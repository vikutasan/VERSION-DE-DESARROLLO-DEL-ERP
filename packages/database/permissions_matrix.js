/**
 * R DE RICO - SISTEMA DE CONTROL DE ACCESO (RBAC)
 * 
 * Este módulo define qué puede ver y hacer cada empleado dentro del ecosistema.
 * "Seguridad por Diseño".
 */

export const PermissionsMatrix = {
    ADMIN: {
        description: "Dueño / Socio Fundador",
        access: ["ALL"], // Acceso total a finanzas, configuración y borrado.
        features: ["FINANCIAL_REPORTS", "SYSTEM_CONFIG", "DELETE_RECORDS"]
    },
    MANAGER: {
        description: "Gerente de Sucursal / Planta",
        access: ["HR_DASHBOARD", "PRODUCTION_PLAN", "B2B_HUB", "LOGISTICS", "POS"],
        features: ["ADD_INCIDENTS", "EDIT_MANUALS", "LIQUIDATE_ROUTES", "APPROVE_PRODUCTION"]
    },
    BAKER: {
        description: "Maestro Panadero / Repostero",
        access: ["PRODUCTION_PLAN", "OPERATIONAL_MANUALS", "VOICE_AGENT"],
        features: ["MARK_TASK_DONE", "REPORT_WASTE", "VIEW_RECIPES"]
    },
    LOGISTICS: {
        description: "Gerente de Logística / Despacho",
        access: ["LOGISTICS_DASHBOARD", "DRIVERS_VIEW", "FLEET_MANAGEMENT"],
        features: ["ASSIGN_ROUTES", "OPTIMIZE_RUTAS", "VIEW_PAYMENTS"]
    },
    DRIVER: {
        description: "Repartidor en Campo",
        access: ["DRIVER_APP", "VOICE_AGENT"],
        features: ["CONFIRM_DELIVERY", "OPEN_MAPS", "COLLECT_PAYMENT"]
    },
    WAITER: {
        description: "Mesero en Sucursal",
        access: ["WAITER_APP", "POS"],
        features: ["TAKE_ORDERS", "VIEW_TABLE_MAP", "PRINT_STUB"]
    },
    CASHIER: {
        description: "Cajero de Sucursal",
        access: ["POS", "SALES_SUMMARY"],
        features: ["PROCESS_PAYMENT", "CLOSE_CASH_DRAWER"]
    }
};

/**
 * Función de guardia para los componentes de la interfaz.
 */
export const hasAccess = (userRole, requiredModule) => {
    if (!userRole || !PermissionsMatrix[userRole]) return false;
    const permissions = PermissionsMatrix[userRole].access;
    return permissions.includes("ALL") || permissions.includes(requiredModule);
};
