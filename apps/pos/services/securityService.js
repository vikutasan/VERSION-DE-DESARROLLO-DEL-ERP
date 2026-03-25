import { CONFIG } from '../config';

class SecurityService {
    async listEmployees() {
        const res = await fetch(`${CONFIG.API_BASE_URL}/security/employees`);
        if (!res.ok) throw new Error("Error cargando lista de personal");
        return res.json();
    }

    async listProfiles() {
        const res = await fetch(`${CONFIG.API_BASE_URL}/security/profiles`);
        if (!res.ok) throw new Error("Error cargando perfiles de seguridad");
        return res.json();
    }

    async createEmployee(employeeData) {
        const res = await fetch(`${CONFIG.API_BASE_URL}/security/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Error al crear empleado");
        }
        return res.json();
    }

    async updateEmployee(employeeId, employeeData) {
        const res = await fetch(`${CONFIG.API_BASE_URL}/security/employees/${employeeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Error al actualizar empleado");
        }
        return res.json();
    }

    async deactivateEmployee(employeeId) {
        const res = await fetch(`${CONFIG.API_BASE_URL}/security/employees/${employeeId}/deactivate`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Error al desactivar empleado");
        }
        return res.json();
    }

    async validatePin(pin) {
        const res = await fetch(`${CONFIG.API_BASE_URL}/security/employees/validate-pin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        });
        if (!res.ok) throw new Error("PIN incorrecto");
        return res.json();
    }
}

export const securityService = new SecurityService();
