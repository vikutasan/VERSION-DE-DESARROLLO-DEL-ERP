const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno desde la raíz del proyecto
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

/**
 * R DE RICO - MOTOR DE IMPORTACIÓN MASIVA (V2)
 * 
 * Este script lee el archivo 'importar_productos_AQUI.json' de la raíz 
 * y lo inyecta directamente en la base de datos industrial.
 */

async function importProducts() {
    console.log("--- Iniciando Importación de Catálogo R de Rico 🚀 ---");
    console.log(`Usando Base de Datos: ${process.env.DATABASE_URL || 'No definida'}`);

    try {
        // Buscar el archivo en la raíz del proyecto
        const filePath = path.join(__dirname, '../../importar_productos_AQUI.json');

        if (!fs.existsSync(filePath)) {
            console.error(`❌ ERROR: No encontré el archivo en ${filePath}`);
            return;
        }

        const rawData = fs.readFileSync(filePath, 'utf8');
        const products = JSON.parse(rawData);

        for (const item of products) {
            // 1. Asegurar que la categoría existe (Upsert por nombre)
            const category = await prisma.category.upsert({
                where: { name: item.category },
                update: {},
                create: { name: item.category }
            });

            // 2. Crear o Actualizar el producto (Upsert por SKU)
            await prisma.product.upsert({
                where: { sku: item.sku },
                update: {
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    stock: item.stock || 0,
                    unit: item.unit || 'pza',
                    categoryId: category.id
                },
                create: {
                    sku: item.sku,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    stock: item.stock || 0,
                    unit: item.unit || 'pza',
                    categoryId: category.id
                }
            });

            console.log(`✅ Sincronizado: ${item.name} [${item.sku}]`);
        }

        console.log("--- Importación Finalizada con Éxito 🎂 ---");

    } catch (error) {
        console.error("❌ Error en la importación:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar importación
importProducts();
