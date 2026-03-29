# GUIA DE ACTUALIZACIÓN SEGURA (R de Rico ERP)

Esta guía te ayudará a actualizar el ERP en tu servidor de producción sin riesgo de perder tickets, usuarios o productos.

## 1. Configuración de Seguridad (Hacer una sola vez)
Asegúrate de que tu archivo `.env` en el servidor tenga configuradas las rutas de datos **fuera** de la carpeta del código:
```env
# Ejemplo de rutas seguras fuera del código
DB_DATA_PATH="C:\ERP_DATA\postgres"
IMAGES_DATA_PATH="C:\ERP_DATA\imagenes"
```

## 2. Proceso de Actualización Paso a Paso

### Paso A: Respaldo Preventivo
Antes de cualquier cambio, haz una copia de tu carpeta de datos:
- Copia `C:\ERP_DATA` a una ubicación externa o un disco de respaldo.

### Paso B: Obtener la Nueva Versión
Desde la terminal en la carpeta del ERP:
```powershell
git pull origin main
```
*Nota: Esto actualizará el código, pero **no borrará** tu archivo `.env` ni tu carpeta `C:\ERP_DATA`.*

### Paso C: Reiniciar el Sistema
Para aplicar los cambios de código manteniendo tus datos:
```powershell
docker-compose down
docker-compose up -d --build
```

## 3. ¿Qué hacer si "desaparece" algo?
Si tras actualizar no ves tus productos:
1. **Revisa el .env:** Asegúrate de que `DB_DATA_PATH` y `IMAGES_DATA_PATH` apunten a la carpeta correcta donde están tus datos.
2. **Nombres de Proyecto:** No cambies el nombre de la carpeta principal del ERP, ya que Docker lo usa para identificar los volúmenes.

> [!IMPORTANT]
> **NUNCA** uses el comando `docker-compose down -v`, ya que la opción `-v` borra los volúmenes de datos de Docker.
