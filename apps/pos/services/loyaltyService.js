/**
 * loyaltyService.js
 * Servicio de Programa de Lealtad R de Rico
 * Gestiona clientes, saldo de puntos, niveles y búsqueda por teléfono
 */

import { pesosAPuntos, puntosPesos, calcularRedimible, REGLAS_DEFAULT } from './paymentService.js';

const STORAGE_KEY = 'rdr_loyalty_clients';
const HISTORIAL_KEY = 'rdr_loyalty_historial';

// ─── Persistencia (localStorage como storage local — reemplazar por API en producción) ─────

function getClientes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveClientes(clientes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
}

function getHistorial() {
  try {
    return JSON.parse(localStorage.getItem(HISTORIAL_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistorial(historial) {
  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
}

// ─── Niveles de Cliente ───────────────────────────────────────────────────────

const THRESHOLDS_NIVEL = {
  BRONCE: 0,
  PLATA: 500,   // $500 en compras acumuladas
  ORO: 2000,    // $2,000 en compras acumuladas
};

export function calcularNivel(totalCompras) {
  if (totalCompras >= THRESHOLDS_NIVEL.ORO) return 'ORO';
  if (totalCompras >= THRESHOLDS_NIVEL.PLATA) return 'PLATA';
  return 'BRONCE';
}

export function nivelIcon(nivel) {
  return { BRONCE: '🥉', PLATA: '🥈', ORO: '🥇' }[nivel] || '🥉';
}

export function nivelColor(nivel) {
  return {
    BRONCE: 'text-amber-600',
    PLATA: 'text-gray-400',
    ORO: 'text-yellow-400',
  }[nivel] || 'text-amber-600';
}

// ─── CRUD de Clientes ─────────────────────────────────────────────────────────

/**
 * Busca un cliente por número de teléfono
 * @param {string} telefono
 * @returns {object|null}
 */
export function buscarCliente(telefono) {
  const tel = telefono.replace(/\D/g, ''); // Solo dígitos
  return getClientes().find(c => c.telefono.replace(/\D/g, '') === tel) || null;
}

/**
 * Registra un nuevo cliente en el programa de lealtad
 * @param {{ nombre, telefono, email? }} datos
 * @returns {object} - Cliente creado
 */
export function registrarCliente(datos) {
  const clientes = getClientes();
  const existente = buscarCliente(datos.telefono);
  if (existente) throw new Error('Ya existe un cliente con ese teléfono');

  const nuevo = {
    id: `cli_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    nombre: datos.nombre.trim(),
    telefono: datos.telefono.replace(/\D/g, ''),
    email: datos.email || null,
    saldoPuntos: 10, // 10 puntos de bienvenida
    nivelCliente: 'BRONCE',
    totalCompras: 0,
    fechaAlta: new Date().toISOString(),
    ultimaVisita: new Date().toISOString(),
    isActive: true,
  };

  clientes.push(nuevo);
  saveClientes(clientes);

  // Registrar movimiento de bienvenida
  registrarMovimiento(nuevo.id, {
    tipo: 'BIENVENIDA',
    puntos: 10,
    descripcion: '¡Bienvenido al Club R de Rico! 🥖',
    ventaId: null,
  });

  return nuevo;
}

/**
 * Actualiza datos básicos de un cliente
 */
export function actualizarCliente(clienteId, cambios) {
  const clientes = getClientes();
  const idx = clientes.findIndex(c => c.id === clienteId);
  if (idx === -1) throw new Error('Cliente no encontrado');
  clientes[idx] = { ...clientes[idx], ...cambios };
  saveClientes(clientes);
  return clientes[idx];
}

// ─── Gestión de Puntos ────────────────────────────────────────────────────────

/**
 * Acumula puntos a un cliente después de una venta
 * @param {string} clienteId
 * @param {number} montoGastado - Total de la venta (sin puntos usados)
 * @param {string} ventaId
 * @param {object} reglas
 * @returns {{ puntosGanados, nuevoSaldo }}
 */
export function acumularPuntos(clienteId, montoGastado, ventaId, reglas = REGLAS_DEFAULT) {
  const clientes = getClientes();
  const idx = clientes.findIndex(c => c.id === clienteId);
  if (idx === -1) throw new Error('Cliente no encontrado');

  const cliente = clientes[idx];
  const puntosGanados = pesosAPuntos(montoGastado, reglas);
  if (puntosGanados === 0) return { puntosGanados: 0, nuevoSaldo: cliente.saldoPuntos };

  const saldoAnterior = cliente.saldoPuntos;
  const nuevoSaldo = saldoAnterior + puntosGanados;
  const nuevoTotalCompras = parseFloat((cliente.totalCompras + montoGastado).toFixed(2));
  const nivelNuevo = calcularNivel(nuevoTotalCompras);

  clientes[idx] = {
    ...cliente,
    saldoPuntos: nuevoSaldo,
    totalCompras: nuevoTotalCompras,
    nivelCliente: nivelNuevo,
    ultimaVisita: new Date().toISOString(),
  };
  saveClientes(clientes);

  registrarMovimiento(clienteId, {
    tipo: 'ACUMULACION',
    puntos: puntosGanados,
    saldoAnterior,
    saldoNuevo: nuevoSaldo,
    ventaId,
    descripcion: `+${puntosGanados} pts por compra de $${montoGastado.toFixed(2)}`,
  });

  return { puntosGanados, nuevoSaldo, subioNivel: nivelNuevo !== cliente.nivelCliente };
}

/**
 * Redime puntos de un cliente (descuenta del saldo)
 * @param {string} clienteId
 * @param {number} puntos - Puntos a redimir
 * @param {string} ventaId
 * @param {object} reglas
 * @returns {{ montoDescuento, nuevoSaldo }}
 */
export function redimirPuntos(clienteId, puntos, ventaId, reglas = REGLAS_DEFAULT) {
  const clientes = getClientes();
  const idx = clientes.findIndex(c => c.id === clienteId);
  if (idx === -1) throw new Error('Cliente no encontrado');

  const cliente = clientes[idx];
  if (puntos > cliente.saldoPuntos) throw new Error('Puntos insuficientes');

  const saldoAnterior = cliente.saldoPuntos;
  const nuevoSaldo = saldoAnterior - puntos;
  const montoDescuento = puntosPesos(puntos, reglas);

  clientes[idx] = {
    ...cliente,
    saldoPuntos: nuevoSaldo,
    ultimaVisita: new Date().toISOString(),
  };
  saveClientes(clientes);

  registrarMovimiento(clienteId, {
    tipo: 'REDENCION',
    puntos: -puntos,
    saldoAnterior,
    saldoNuevo: nuevoSaldo,
    ventaId,
    descripcion: `Canje de ${puntos} pts = $${montoDescuento.toFixed(2)} de descuento`,
  });

  return { montoDescuento, nuevoSaldo, puntosRedimidos: puntos };
}

// ─── Historial ────────────────────────────────────────────────────────────────

function registrarMovimiento(clienteId, datos) {
  const historial = getHistorial();
  historial.unshift({
    id: `mov_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    clienteId,
    tipo: datos.tipo,
    puntos: datos.puntos,
    saldoAnterior: datos.saldoAnterior || 0,
    saldoNuevo: datos.saldoNuevo || datos.puntos,
    ventaId: datos.ventaId || null,
    descripcion: datos.descripcion || '',
    createdAt: new Date().toISOString(),
  });
  // Mantener solo los últimos 1000 movimientos en local
  if (historial.length > 1000) historial.splice(1000);
  saveHistorial(historial);
}

export function obtenerHistorialCliente(clienteId, limite = 20) {
  return getHistorial()
    .filter(m => m.clienteId === clienteId)
    .slice(0, limite);
}

// ─── Resumen para Ticket ──────────────────────────────────────────────────────

export function resumenLealtadTicket(cliente, puntosGanados, reglas = REGLAS_DEFAULT) {
  const nuevoSaldo = cliente.saldoPuntos + puntosGanados;
  const equivalenciaPesos = puntosPesos(nuevoSaldo, reglas);
  return {
    puntosGanados,
    saldoTotal: nuevoSaldo,
    equivalenciaPesos,
    nivelActual: cliente.nivelCliente,
  };
}

// ─── Info de puntos disponibles para checkout ─────────────────────────────────

export function infoRedencionCheckout(cliente, totalVenta, reglas = REGLAS_DEFAULT) {
  const { puedeRedimir, maxPesos, maxPuntos } = calcularRedimible(
    totalVenta, cliente.saldoPuntos, reglas
  );
  return {
    saldoPuntos: cliente.saldoPuntos,
    saldoEnPesos: puntosPesos(cliente.saldoPuntos, reglas),
    puedeRedimir,
    maxPuntosRecanjeables: maxPuntos,
    maxPesosRecanjeables: maxPesos,
    nivelCliente: cliente.nivelCliente,
  };
}
