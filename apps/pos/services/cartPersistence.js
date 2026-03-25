/**
 * cartPersistence.js
 * Auto-guardado y recuperación del carrito de compras
 * Previene pérdidas de venta por cierres accidentales del navegador durante el cobro
 */

const CART_KEY = 'rdr_cart_snapshot';

// ─── Auto-guardado ────────────────────────────────────────────────────────────

/**
 * Guarda el estado actual del carrito con metadata de la sesión
 * @param {{ cart, total, clienteLealtad, externalId, terminalId, pagos? }} estado
 */
export function guardarCarrito(estado) {
  if (!estado.cart || estado.cart.length === 0) {
    limpiarCarrito();
    return;
  }
  try {
    const snapshot = {
      ...estado,
      savedAt: new Date().toISOString(),
      version: '1.0',
    };
    localStorage.setItem(CART_KEY, JSON.stringify(snapshot));
  } catch (e) {
    console.warn('[CartPersistence] Error al guardar carrito:', e);
  }
}

// ─── Recuperación ─────────────────────────────────────────────────────────────

/**
 * Recupera el carrito guardado si existe y no es demasiado antiguo
 * @param {number} maxAgeMinutes - Máxima antigüedad en minutos (default: 120 min / 2 horas)
 * @returns {object|null} - Estado guardado o null si no hay / expiró
 */
export function recuperarCarrito(maxAgeMinutes = 120) {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return null;

    const snapshot = JSON.parse(raw);
    if (!snapshot?.cart?.length) {
      limpiarCarrito();
      return null;
    }

    // Verificar antigüedad
    const savedAt = new Date(snapshot.savedAt);
    const ahora = new Date();
    const minutosTranscurridos = (ahora - savedAt) / 1000 / 60;

    if (minutosTranscurridos > maxAgeMinutes) {
      limpiarCarrito();
      return null;
    }

    return snapshot;
  } catch {
    return null;
  }
}

/**
 * Verifica si hay un carrito pendiente de recuperar
 */
export function hayCarritoPendiente() {
  return recuperarCarrito() !== null;
}

/**
 * Limpia el carrito guardado (después de una venta completada o cancelada)
 */
export function limpiarCarrito() {
  try {
    localStorage.removeItem(CART_KEY);
  } catch {}
}

// ─── Ventas Offline ───────────────────────────────────────────────────────────

const OFFLINE_QUEUE_KEY = 'rdr_offline_ventas';

/**
 * Encola una venta para sincronización cuando regrese internet
 * @param {object} venta - Objeto venta completo
 */
export function encolarVentaOffline(venta) {
  try {
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    queue.push({
      ...venta,
      status: 'OFFLINE',
      esOffline: true,
      sincronizado: false,
      enqueuedAt: new Date().toISOString(),
    });
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('[CartPersistence] Error al encolar venta offline:', e);
  }
}

/**
 * Obtiene la cola de ventas pendientes de sincronización
 */
export function obtenerColaOffline() {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Marca una venta offline como sincronizada
 */
export function marcarSincronizado(ventaId) {
  try {
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    const updated = queue.map(v =>
      v.externalId === ventaId ? { ...v, sincronizado: true } : v
    );
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updated));
  } catch {}
}

/**
 * Limpia ventas ya sincronizadas de la cola
 */
export function limpiarSincronizadas() {
  try {
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    const pendientes = queue.filter(v => !v.sincronizado);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(pendientes));
  } catch {}
}
