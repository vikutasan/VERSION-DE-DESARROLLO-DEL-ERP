# PLAN DE ACCIÓN PARA LA IA DEL SERVIDOR (Antigravity)

Este es el conjunto de instrucciones que debes darle a la IA de **tu servidor** para que ella haga el trabajo pesado por ti de forma segura.

## Paso 1: "El Gran Salto" (Actualizar el Código)
Dile a la IA de tu servidor exactamente esto:
> *"He actualizado el repositorio en GitHub con un nuevo sistema de persistencia de datos y puertos variables. Por favor, haz un `git pull origin main` para descargar los cambios y luego ayúdame a configurar el archivo `.env` local para que mis productos y usuarios se guarden en una carpeta externa segura que no sea la del código."*

## Paso 2: La Migración de Datos Existentes
Si ya tienes datos en tu servidor estable, la IA debe ayudarte a moverlos a la "Zona Segura". Dile esto:
> *"Quiero que mis datos de Postgres y las imágenes de los productos se muevan a la carpeta `C:\ERP_DATA`. Revisa dónde están mis volúmenes actuales de Docker y ayúdame a copiarlos a esa nueva ruta para que al encender la nueva versión, mi información aparezca ahí."*

## Paso 3: Configuración del .env
La IA debe asegurarse de que estas líneas existan en el servidor:
```env
# Dile que lo configure así:
DB_DATA_PATH="C:\ERP_DATA\postgres"
IMAGES_DATA_PATH="C:\ERP_DATA\imagenes"
```

## Paso 4: Encendido y Verificación
Finalmente, dile:
> *"Ahora arranca el sistema usando `docker-compose up -d --build` y verifica que los productos y tickets antiguos se carguen correctamente desde la nueva ruta `C:\ERP_DATA`."*

---

### ¿Por qué hacer esto?
Porque la IA del servidor tiene acceso a los archivos **reales** de tu empresa. Al darle estas instrucciones, ella sabrá exactamente qué archivos mover para que tu "estante de productos" y tu "caja de tickets" nunca más se vacíen al actualizar.
