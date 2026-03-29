# GUIA DE ACTUALIZACIÓN SEGURA (Instancia Única)

Esta guía te ayudará a actualizar tu ERP en el servidor de forma limpia, asegurando que tus datos (tickets, usuarios, etc.) se mantengan intactos.

## 1. El Concepto Clave: Separación de Datos
Para que la actualización sea segura, tus datos viven en una carpeta externa (ej: `C:\ERP_DATA`) y el código en otra. Así, puedes cambiar el código sin tocar los datos.

## 2. Proceso de Actualización

### Paso A: Obtener el Nuevo Código
En la carpeta de tu ERP:
```powershell
git pull origin main
```
*Tus datos no corren riesgo porque el código ahora sabe buscarlos en la carpeta externa configurada en tu `.env`.*

### Paso B: Reiniciar con el Nuevo Código
```powershell
docker-compose down
docker-compose up -d --build
```

## 3. Seguridad de Puertos
Si en tu servidor necesitas un puerto específico, asegúrate de que esté definido en tu archivo `.env`. Al actualizar con `git pull`, tu archivo `.env` **no se borrará**, manteniendo tu configuración de red intacta.

> [!IMPORTANT]
> Nunca borres la carpeta externa de datos (ej: `C:\ERP_DATA`). Esa es la memoria de tu empresa.
