/**
 * R de Rico - Sistema de Bill of Materials (BOM) & Recetas
 * 
 * Este módulo se encarga de:
 * 1. Definir los insumos (Materias primas)
 * 2. Crear las recetas (Relación Producto -> Insumos)
 * 3. Procesar el descuento automático de inventario al vender
 */

export const RecipeCalculator = {
    /**
     * Calcula el costo teórico de producción basado en los insumos actuales.
     * Útil para que el socio administrador vea márgenes de utilidad en tiempo real.
     */
    calculateProductionCost(recipeItems) {
        return recipeItems.reduce((total, item) => {
            return total + (item.quantity * item.unitCost);
        }, 0);
    },

    /**
     * Genera el desglose de insumos necesarios para una orden específica.
     * Ejemplo: Si se venden 10 Pizzas, calcula cuántos kg de harina se consumieron.
     */
    getInventoryImpact(productId, quantity, recipes) {
        const recipe = recipes.find(r => r.productId === productId);
        if (!recipe) return [];

        return recipe.items.map(item => ({
            ingredientId: item.ingredientId,
            amountToDeduct: item.amount * quantity,
            unit: item.unit
        }));
    }
};

/**
 * Ejemplo de Estructura de Receta para R de Rico:
 * 
 * {
 *   productName: "Pizza Margherita Grande",
 *   items: [
 *     { ingredient: "Harina de Trigo", amount: 0.250, unit: "kg" },
 *     { ingredient: "Queso Mozzarella", amount: 0.180, unit: "kg" },
 *     { ingredient: "Salsa de Tomate Artesanal", amount: 0.100, unit: "lt" },
 *     { ingredient: "Albahaca Fresca", amount: 5, unit: "gr" }
 *   ]
 * }
 */
