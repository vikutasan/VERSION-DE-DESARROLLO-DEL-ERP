# Guía de Despliegue: Sistema BOM Industrial y Trazabilidad

Esta guía está diseñada para que el asistente Antigravity del servidor de producción integre las mejoras de la versión de desarrollo de manera segura y eficiente.

## 1. Preparación del Entorno
Antes de aplicar los cambios, asegúrese de que los contenedores estén corriendo.

## 2. Actualización de Código
Realice el pull de la última versión de la rama `main`:
```bash
git pull origin main
```

## 3. Migración de Base de Datos (Paso Crítico)
Esta mejora añade nuevas columnas de gramaje y corrige vínculos de base de datos que apuntaban a tablas obsoletas. Es **indispensable** ejecutar el script de migración dentro del contenedor de la API:

```bash
docker exec rderico-api-dev python migrate_technical_sheets.py
```

### ¿Qué hace este script?
- Añade las columnas `primary_mass_grams`, `secondary_mass_grams` y `tertiary_mass_grams` a la tabla `product_technical_sheets`.
- Corrige las llaves foranenas (Constraints) para que apunten a la tabla activa de masas (`doughs`) en lugar de la tabla antigua (`mass_manager`).

## 4. Reinicio de Servicios
Para que los cambios en los modelos de Python y la interfaz de React surtan efecto, reinicie los contenedores:

```bash
docker-compose restart api pos
```

## 5. Verificación de Éxito
1. **Maestro de Productos**: Abra la ficha de un producto manufacturado y verifique que aparezcan los 3 selectores de masa con sus campos de gramaje. Intente guardar un cambio; no debería haber errores de red.
2. **Gestor de Masas**: Vaya al Step 5 (Vínculos) de cualquier masa. Verifique que aparezcan los productos vinculados con su nombre, SKU y gramajes en el nuevo diseño compacto.
3. **Ordenamiento**: Verifique que puede arrastrar y soltar masas en la lista principal y que el orden se mantiene al recargar.

---
> [!IMPORTANT]
> No omita el paso 3. Si no se ejecuta la migración, el guardado de productos fallará con errores de integridad.
