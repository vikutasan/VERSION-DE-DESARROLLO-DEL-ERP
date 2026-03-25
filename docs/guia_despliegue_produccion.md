# Guía de Despliegue: Prueba de Campo R-DE-RICO

Esta guía detalla los pasos para instalar y ejecutar la prueba del sistema, asegurando la coexistencia con el sistema actual.

## 1. Pre-requisitos del Servidor (Terminal 6)
El servidor central debe tener instalado lo siguiente:
- **Git**: Para descargar el código desde GitHub.
- **Docker Desktop**: El motor que correrá la base de datos, el API y el POS.
- **Docker Compose**: (Incluido en Docker Desktop) para orquestar los servicios.
- **Navegador Chrome/Edge**: Para visualizar la interfaz táctil.

## 2. Instalación desde GitHub (Servidor)
Ejecutar estos comandos en una terminal del servidor:
```powershell
# Clonar repositorio
git clone <URL_DE_TU_REPOSITORIO>
cd <CARPETA_DEL_PROYECTO>

# Iniciar la infraestructura (Base de datos, API, POS)
docker-compose up -d --build
```

## 3. Configuración de Red LAN
Para que las Terminales 1-5 vean al Servidor:
1. Obtener la IP local del Servidor (ej. `192.168.1.50`).
2. En cada terminal cliente, abrir el navegador y apuntar a: `http://192.168.1.50:3000`.

## 4. Coexistencia con Sistema SaaS
Es **totalmente posible** correr ambos a la par:
- **Puertos Libres**: Nuestro sistema usa el puerto `3000` para el frontend y `8000` para el backend. Si el SaaS no los usa, no habrá conflicto.
- **Aislamiento**: Los datos de esta prueba se guardan dentro de contenedores Docker, por lo que su sistema actual está 100% a salvo de cualquier interferencia de datos.

## 5. Recomendación de Prueba
- **Carril Paralelo**: Sugiero correr la prueba en un par de terminales primero mientras las otras siguen con el SaaS, o probar el flujo completo en una terminal de "respaldo" antes de pasar las 6 CPUs.
