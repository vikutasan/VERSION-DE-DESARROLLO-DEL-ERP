import { CONFIG } from '../config';
const API_BASE = CONFIG.API_BASE_URL;

/**
 * Servicio de gestión de caja del turno.
 * Maneja apertura, movimientos, resumen en tiempo real y cierre.
 */
export const cashService = {

    /** Abre una nueva sesión de caja para el cajero autenticado. */
    async abrirSesion({ terminal_id, employee_id, employee_name, opening_float }) {
        const respuesta = await fetch(`${API_BASE}/cash/sessions/open`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ terminal_id, employee_id, employee_name, opening_float }),
        });
        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.detail || 'Error al abrir la sesión de caja');
        }
        return respuesta.json();
    },

    /** Obtiene la sesión activa de una terminal, o null si no hay ninguna. */
    async obtenerSesionActiva(terminal_id) {
        try {
            const respuesta = await fetch(`${API_BASE}/cash/sessions/${terminal_id}/active`);
            if (respuesta.status === 404) return null;
            if (!respuesta.ok) return null; // Silenciar cualquier otro error de red para no romper el POS
            return await respuesta.json();
        } catch (error) {
            console.error("Error en cashService.obtenerSesionActiva:", error);
            return null;
        }
    },

    /** Registra una entrada o salida de dinero en el turno activo. */
    async agregarMovimiento(session_id, { movement_type, amount, concept }) {
        const respuesta = await fetch(`${API_BASE}/cash/sessions/${session_id}/movements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movement_type, amount, concept }),
        });
        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.detail || 'Error al registrar el movimiento');
        }
        return respuesta.json();
    },

    /** Elimina un movimiento previamente registrado. */
    async eliminarMovimiento(session_id, movimiento_id) {
        const respuesta = await fetch(
            `${API_BASE}/cash/sessions/${session_id}/movements/${movimiento_id}`,
            { method: 'DELETE' }
        );
        if (!respuesta.ok) throw new Error('Error al eliminar el movimiento');
        return respuesta.json();
    },

    /** Calcula en tiempo real los totales del turno según el sistema. */
    async obtenerResumen(session_id) {
        const respuesta = await fetch(`${API_BASE}/cash/sessions/${session_id}/summary`);
        if (!respuesta.ok) throw new Error('Error al obtener el resumen de caja');
        return respuesta.json();
    },

    /** Cierra el turno y guarda los montos físicos para cálculo de diferencias. */
    async cerrarSesion(session_id, { physical_cash, physical_credit, physical_debit }) {
        const respuesta = await fetch(`${API_BASE}/cash/sessions/${session_id}/close`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ physical_cash, physical_credit, physical_debit }),
        });
        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.detail || 'Error al cerrar el turno');
        }
        return respuesta.json();
    },
};

/**
 * Servicio de seguridad para validación de PINs de empleados.
 */
export const securityService = {

    /** Valida el PIN ingresado y devuelve el nombre y rol del empleado. */
    async validarPin(pin) {
        const respuesta = await fetch(`${API_BASE}/security/employees/validate-pin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin }),
        });
        if (!respuesta.ok) {
            throw new Error('PIN incorrecto o empleado inactivo');
        }
        return respuesta.json();
    },
};
