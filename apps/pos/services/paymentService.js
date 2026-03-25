/**
 * paymentService.js
 * Lógica de negocio para procesamiento de pagos multimodal en R de Rico POS
 * Soporta: Efectivo, Tarjeta, Puntos de Lealtad, SPEI, Tarjeta Offline
 */

// ─── Reglas de Negocio (configurable desde BD / ReglaPuntos) ─────────────────

export const REGLAS_DEFAULT = {
  factorAcumulacion: 1.0,   // $1 MXN gastado = 1 punto
  valorPunto: 0.05,         // 1 punto = $0.05 MXN de descuento
  limiteMaxRedencionPct: 50, // No se puede pagar más del 50% con puntos
  minimoCompraParaPuntos: 0, // Sin mínimo por defecto
};

// ─── Cálculo de Totales ───────────────────────────────────────────────────────

/**
 * Calcula subtotal, IVA y total de los ítems del carrito
 * @param {Array} items - Ítems del carrito [{price, quantity, taxRate?}]
 * @param {number} taxRate - Tasa de IVA (default 0.16)
 * @returns {{ subtotal, taxAmount, total }}
 */
export function calcularTotales(items, taxRate = 0.16) {
  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
  const total = parseFloat((subtotal + taxAmount).toFixed(2));
  return { subtotal: parseFloat(subtotal.toFixed(2)), taxAmount, total };
}

/**
 * Calcula el total ya pagado de una lista de pagos
 */
export function calcularTotalPagado(pagos) {
  return pagos.reduce((sum, p) => sum + parseFloat(p.monto || 0), 0);
}

/**
 * Calcula el restante por pagar
 */
export function calcularRestante(total, pagos) {
  const pagado = calcularTotalPagado(pagos);
  return Math.max(0, parseFloat((total - pagado).toFixed(2)));
}

/**
 * Calcula el cambio si el efectivo supera el total
 */
export function calcularCambio(totalVenta, pagos) {
  const pagadoEnEfectivo = pagos
    .filter(p => p.metodoPago === 'EFECTIVO')
    .reduce((sum, p) => sum + parseFloat(p.monto || 0), 0);
  const otrasPagos = pagos
    .filter(p => p.metodoPago !== 'EFECTIVO')
    .reduce((sum, p) => sum + parseFloat(p.monto || 0), 0);
  const cambio = pagadoEnEfectivo + otrasPagos - totalVenta;
  return Math.max(0, parseFloat(cambio.toFixed(2)));
}

// ─── Validaciones ─────────────────────────────────────────────────────────────

/**
 * Valida si los pagos cubren el total de la venta
 */
export function ventaEstaPagada(total, pagos) {
  return calcularTotalPagado(pagos) >= total - 0.01; // tolerancia de $0.01
}

/**
 * Determina si se pueden redimir puntos en esta venta
 * @param {number} totalVenta - Total de la venta en $
 * @param {number} saldoPuntos - Puntos disponibles del cliente
 * @param {object} reglas - Reglas de puntos
 * @returns {{ puedeRedimir, maxPesos, maxPuntos }}
 */
export function calcularRedimible(totalVenta, saldoPuntos, reglas = REGLAS_DEFAULT) {
  const maxPorLimite = parseFloat((totalVenta * (reglas.limiteMaxRedencionPct / 100)).toFixed(2));
  const valorEnPesos = parseFloat((saldoPuntos * reglas.valorPunto).toFixed(2));
  const maxPesos = Math.min(maxPorLimite, valorEnPesos);
  const maxPuntos = Math.floor(maxPesos / reglas.valorPunto);
  return {
    puedeRedimir: maxPuntos > 0,
    maxPesos: parseFloat(maxPesos.toFixed(2)),
    maxPuntos,
  };
}

/**
 * Convierte puntos a pesos
 */
export function puntosPesos(puntos, reglas = REGLAS_DEFAULT) {
  return parseFloat((puntos * reglas.valorPunto).toFixed(2));
}

/**
 * Convierte pesos a puntos que se ganan
 */
export function pesosAPuntos(monto, reglas = REGLAS_DEFAULT) {
  return Math.floor(monto * reglas.factorAcumulacion);
}

// ─── Construcción del Objeto Pago ─────────────────────────────────────────────

/**
 * Crea un objeto PagoDetalle para agregar a la lista de pagos
 * @param {string} metodoPago - El método de pago
 * @param {number} monto - Monto a pagar
 * @param {object} extras - Campos adicionales (ultimos4, marcaTarjeta, etc.)
 */
export function crearPago(metodoPago, monto, extras = {}) {
  return {
    id: `pago_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    metodoPago,
    monto: parseFloat(monto.toFixed(2)),
    estadoPago: 'PENDIENTE',
    esManual: extras.esManual || false,
    ultimos4Digitos: extras.ultimos4Digitos || null,
    marcaTarjeta: extras.marcaTarjeta || null,
    numeroAutorizacion: extras.numeroAutorizacion || null,
    idTransaccionProcesador: extras.idTransaccionProcesador || null,
    referenciaTransaccion: extras.referenciaTransaccion || null,
    puntosUtilizados: extras.puntosUtilizados || null,
    motivoRechazo: null,
    createdAt: new Date().toISOString(),
  };
}

// ─── Generación de ID Externo para Venta ─────────────────────────────────────

/**
 * Genera un External ID legible para comunicar a la terminal bancaria
 * Formato: RDR-YYYYMMDD-XXXX (ej: RDR-20260310-4821)
 */
export function generarExternalId() {
  const hoy = new Date();
  const fecha = hoy.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RDR-${fecha}-${rand}`;
}

// ─── Denominaciones de Cambio ─────────────────────────────────────────────────

/**
 * Calcula las denominaciones del cambio (para mostrar al cajero)
 * @param {number} cambio - Monto del cambio
 * @returns {Array} - [{denominacion, cantidad}]
 */
export function calcularDenominaciones(cambio) {
  const DENOMINACIONES = [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1];
  const resultado = [];
  let restante = cambio;

  for (const denom of DENOMINACIONES) {
    const cantidad = Math.floor(restante / denom);
    if (cantidad > 0) {
      resultado.push({ denominacion: denom, cantidad });
      restante = parseFloat((restante - cantidad * denom).toFixed(2));
    }
  }
  return resultado;
}

// ─── Puntos a Ganar en la Venta ───────────────────────────────────────────────

/**
 * Calcula los puntos que se ganarán al finalizar la venta
 * Solo sobre ítems que generan puntos y monto pagado en efectivo/tarjeta (no con puntos)
 * @param {Array} items - [{price, quantity, generaPuntos}]
 * @param {Array} pagos - Lista de pagos
 * @param {object} reglas
 */
export function calcularPuntosAGanar(items, pagos, reglas = REGLAS_DEFAULT) {
  // No acumular si se usaron puntos para pagar (se recibe distinción por item)
  const seUsaronPuntos = pagos.some(p => p.metodoPago === 'PUNTOS');
  if (seUsaronPuntos) return 0;

  const baseAcumulacion = items
    .filter(item => item.generaPuntos !== false)
    .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return pesosAPuntos(baseAcumulacion, reglas);
}
