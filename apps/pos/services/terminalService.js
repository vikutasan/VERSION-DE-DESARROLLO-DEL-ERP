/**
 * terminalService.js
 * Middleware de Terminal Bancaria para R de Rico POS
 * 
 * Estrategia:
 * 1. Intenta integración via URL Redirect (Clip / Netpay Smart)
 * 2. Tiene timeout de 45 segundos
 * 3. Manejo completo de fallas: timeout, sin conexión, rechazo
 * 4. Registro en FallasTerminal para auditoría
 * 
 * NOTA: La integración directa de Pinpad (Serial/USB) requiere Electron.
 * En modo web, usamos URL redirect y captura manual del código de auth.
 */

import { crearPago } from './paymentService.js';

const TERMINAL_TIMEOUT_MS = 45_000; // 45 segundos como especificaste

// ─── Configuración del Procesador ────────────────────────────────────────────

const PROCESADORES = {
  CLIP: {
    nombre: 'Clip',
    checkoutUrl: 'https://clip.mx/pago/', // URL real de Clip Checkout
    webhookPath: '/api/terminal/webhook/clip',
    logoUrl: '🟡',
  },
  NETPAY: {
    nombre: 'Netpay Smart',
    checkoutUrl: 'https://netpay.mx/checkout/',
    webhookPath: '/api/terminal/webhook/netpay',
    logoUrl: '🔵',
  },
  MANUAL: {
    nombre: 'Terminal Manual / WiFi',
    checkoutUrl: null,
    webhookPath: null,
    logoUrl: '💳',
  },
};

let PROCESADOR_ACTIVO = 'MANUAL'; // Cambia según la terminal elegida

export function configurarProcesador(procesador) {
  PROCESADOR_ACTIVO = procesador;
}

export function getProcesadorActivo() {
  return PROCESADORES[PROCESADOR_ACTIVO] || PROCESADORES.MANUAL;
}

// ─── Estado de la Terminal ────────────────────────────────────────────────────

/**
 * Verifica si hay conexión a internet (no si la terminal está disponible)
 */
export async function verificarConexion() {
  try {
    const resp = await fetch('https://1.1.1.1', {
      method: 'HEAD',
      mode: 'no-cors',
      signal: AbortSignal.timeout(3000),
    });
    return true;
  } catch {
    return false;
  }
}

// ─── Cobro con Terminal (Flujo Principal) ─────────────────────────────────────

/**
 * Inicia un cobro con terminal bancaria.
 * 
 * Flujo:
 * 1. Verifica conexión
 * 2. Construye URL/payload para el procesador
 * 3. Espera respuesta (con timeout)
 * 4. Retorna resultado
 * 
 * @param {{ externalId, monto, concepto }} params
 * @param {{ onStatusChange, onTimeout, onError }} callbacks
 * @returns {Promise<{ aprobado, pago?, error?, tipoError? }>}
 */
export async function iniciarCobro(params, callbacks = {}) {
  const { externalId, monto, concepto = 'Venta R de Rico' } = params;
  const { onStatusChange, onTimeout, onError } = callbacks;

  // 1. Verificar conexión
  const tieneConexion = await verificarConexion();
  if (!tieneConexion) {
    const error = crearFallaTerminal(externalId, monto, 'SIN_CONEXION', 'Sin acceso a internet');
    registrarFallaLocal(error);
    if (onError) onError({ tipo: 'SIN_CONEXION', falla: error });
    return { aprobado: false, error: 'SIN_CONEXION', falla: error };
  }

  if (onStatusChange) onStatusChange('PROCESANDO');

  // 2. En modo MANUAL: no enviamos a terminal automáticamente
  if (PROCESADOR_ACTIVO === 'MANUAL') {
    return { aprobado: null, modo: 'MANUAL', esperandoCajero: true };
  }

  // 3. Integración via URL Redirect (Clip / Netpay)
  const procesador = PROCESADORES[PROCESADOR_ACTIVO];
  if (procesador?.checkoutUrl) {
    return await iniciarCobroUrlRedirect({ externalId, monto, concepto, procesador }, callbacks);
  }

  // 4. Fallback
  return { aprobado: null, modo: 'MANUAL', esperandoCajero: true };
}

async function iniciarCobroUrlRedirect(params, callbacks) {
  const { externalId, monto, concepto, procesador } = params;
  const { onTimeout, onError, onStatusChange } = callbacks;

  return new Promise((resolve) => {
    // Construir URL del procesador con parámetros
    const returnUrl = encodeURIComponent(
      `${window.location.origin}/pos/terminal-callback?external_id=${externalId}`
    );
    const checkoutUrl = `${procesador.checkoutUrl}?amount=${monto}&reference=${externalId}&concept=${encodeURIComponent(concepto)}&return_url=${returnUrl}`;

    // Timeout de 45 segundos
    const timeoutId = setTimeout(() => {
      const falla = crearFallaTerminal(externalId, monto, 'TIMEOUT', 'Sin respuesta en 45 segundos');
      registrarFallaLocal(falla);
      if (onTimeout) onTimeout(falla);
      resolve({ aprobado: false, error: 'TIMEOUT', falla });
    }, TERMINAL_TIMEOUT_MS);

    // Abrir URL del procesador en nueva ventana / WebView
    const ventanaTerminal = window.open(checkoutUrl, 'terminal_bancaria', 'width=600,height=800');

    // Escuchar respuesta via postMessage o polling de URL params
    const messageHandler = (event) => {
      if (event.data?.type === 'TERMINAL_RESULTADO') {
        clearTimeout(timeoutId);
        window.removeEventListener('message', messageHandler);

        if (event.data.aprobado) {
          resolve({
            aprobado: true,
            pago: crearPago('TARJETA', event.data.monto, {
              ultimos4Digitos: event.data.ultimos4,
              marcaTarjeta: event.data.marca,
              numeroAutorizacion: event.data.authCode,
              idTransaccionProcesador: event.data.transactionId,
            }),
            authCode: event.data.authCode,
          });
        } else {
          const falla = crearFallaTerminal(externalId, event.data.monto, 'TARJETA_DECLINADA', event.data.motivo);
          registrarFallaLocal(falla);
          resolve({ aprobado: false, error: event.data.motivo, falla });
        }
      }
    };

    window.addEventListener('message', messageHandler);

    // Si el usuario cierra la ventana de la terminal manualmente
    const checkCierre = setInterval(() => {
      if (ventanaTerminal?.closed) {
        clearInterval(checkCierre);
        clearTimeout(timeoutId);
        window.removeEventListener('message', messageHandler);
        resolve({ aprobado: null, error: 'VENTANA_CERRADA', modoManual: true });
      }
    }, 1000);
  });
}

// ─── Validación Manual de Auth Code ──────────────────────────────────────────

/**
 * Registra un cobro con tarjeta aprobado manualmente (cajero ingresa el código)
 * @param {{ externalId, monto, authCode, ultimos4?, marcaTarjeta? }} datos
 * @returns {object} - PagoDetalle
 */
export function validarPagoManual(datos) {
  const { monto, authCode, ultimos4Digitos, marcaTarjeta } = datos;
  const pago = crearPago('TARJETA', monto, {
    ultimos4Digitos: ultimos4Digitos || null,
    marcaTarjeta: marcaTarjeta || 'DESCONOCIDA',
    numeroAutorizacion: authCode,
    esManual: true,
  });
  pago.estadoPago = 'MANUAL';
  return pago;
}

/**
 * Registra un pago en modo offline (tarjeta en terminal independiente con datos móviles)
 * @param {{ monto, nota? }} datos
 * @returns {object} - PagoDetalle en modo OFFLINE_CARD
 */
export function registrarPagoOffline(datos) {
  const { monto } = datos;
  const pago = crearPago('OFFLINE_CARD', monto, {
    esManual: true,
    referenciaTransaccion: `OFFLINE-${Date.now()}`,
  });
  pago.estadoPago = 'MANUAL';
  return pago;
}

// ─── Registro de Fallas ───────────────────────────────────────────────────────

const FALLAS_STORAGE_KEY = 'rdr_fallas_terminal';

function crearFallaTerminal(ventaExternalId, montoIntentado, errorType, descripcion) {
  return {
    id: `falla_${Date.now()}`,
    ventaExternalId,
    montoIntentado,
    errorType,
    descripcion,
    resolucion: null,
    codigoAuth: null,
    createdAt: new Date().toISOString(),
  };
}

function registrarFallaLocal(falla) {
  try {
    const fallas = JSON.parse(localStorage.getItem(FALLAS_STORAGE_KEY) || '[]');
    fallas.unshift(falla);
    if (fallas.length > 500) fallas.splice(500);
    localStorage.setItem(FALLAS_STORAGE_KEY, JSON.stringify(fallas));
  } catch (e) {
    console.error('[TerminalService] Error al registrar falla:', e);
  }
}

export function obtenerFallasLocal(limite = 50) {
  try {
    return JSON.parse(localStorage.getItem(FALLAS_STORAGE_KEY) || '[]').slice(0, limite);
  } catch {
    return [];
  }
}

export function actualizarResolucionFalla(fallaId, resolucion, codigoAuth = null) {
  try {
    const fallas = JSON.parse(localStorage.getItem(FALLAS_STORAGE_KEY) || '[]');
    const idx = fallas.findIndex(f => f.id === fallaId);
    if (idx !== -1) {
      fallas[idx].resolucion = resolucion;
      fallas[idx].codigoAuth = codigoAuth;
      localStorage.setItem(FALLAS_STORAGE_KEY, JSON.stringify(fallas));
    }
  } catch (e) {
    console.error('[TerminalService] Error al actualizar falla:', e);
  }
}

// ─── Mensajes de Error para UI ────────────────────────────────────────────────

export const MENSAJES_ERROR = {
  TIMEOUT: {
    titulo: '⚠️ Error de Conexión con Terminal',
    cuerpo: 'No se pudo confirmar el pago en 45 segundos. Por favor, revisa el ticket físico de la terminal bancaria antes de reintentar.',
    acciones: ['REINTENTAR', 'VALIDAR_MANUAL', 'CAMBIAR_EFECTIVO'],
  },
  SIN_CONEXION: {
    titulo: '📶 Sin Conexión a Internet',
    cuerpo: 'No hay conexión a internet. Puedes procesar la tarjeta en la terminal WiFi de forma independiente y registrar el pago manualmente.',
    acciones: ['VALIDAR_MANUAL', 'MODO_OFFLINE', 'CAMBIAR_EFECTIVO'],
  },
  TARJETA_DECLINADA: {
    titulo: '🚫 Tarjeta Declinada',
    cuerpo: 'El banco rechazó la transacción. Solicita al cliente que use otra tarjeta o método de pago.',
    acciones: ['REINTENTAR', 'CAMBIAR_EFECTIVO'],
  },
  FONDOS_INSUFICIENTES: {
    titulo: '💳 Sin Fondos Suficientes',
    cuerpo: 'La tarjeta no tiene fondos suficientes para esta transacción.',
    acciones: ['REINTENTAR', 'CAMBIAR_EFECTIVO'],
  },
  ERROR_PROCESADOR: {
    titulo: '🔧 Error del Procesador',
    cuerpo: 'El procesador de pagos reportó un error. Anota el código de error y contáctanos si persiste.',
    acciones: ['REINTENTAR', 'VALIDAR_MANUAL', 'CAMBIAR_EFECTIVO'],
  },
  TARJETA_INVALIDA: {
    titulo: '❌ Tarjeta No Válida',
    cuerpo: 'La tarjeta no puede ser procesada. Verifica que sea una tarjeta de débito o crédito válida.',
    acciones: ['REINTENTAR', 'CAMBIAR_EFECTIVO'],
  },
};
