# Configuración del Repositorio Privado - R de Rico ERP
# Este script inicializa el control de versiones y el repositorio privado en Google Cloud.
# Ejecuta este script DESPUÉS de haber reiniciado tu equipo tras la instalación de Git y gcloud.

Write-Host "--- Inicializando Control de Versiones Privado (R de Rico) ---" -ForegroundColor Cyan

# 1. Inicializar Git local
if (-not (Test-Path ".git")) {
    git init
    Write-Host "Repositorio Git inicializado localmente." -ForegroundColor Green
}
else {
    Write-Host "El repositorio Git ya existe." -ForegroundColor Yellow
}

# 2. Configurar el nombre del usuario y correo
# Cambia estos valores por tus datos reales de Google Cloud:
# git config --global user.email "tu-email-de-google@gmail.com"
# git config --global user.name "R de Rico Admin"

# 3. Crear el repositorio en Google Cloud Source Repositories
Write-Host "Conectando con Google Cloud Source Repositories..."
# git config --global credential.helper gcloud.sh
# gcloud source repos create r-de-rico-core

# 4. Configurar el origen remoto
# Si el repositorio ya fue creado manualmente en la consola de Google:
# git remote add google https://source.developers.google.com/p/tu-proyecto-id/r/r-de-rico-core

# 5. Crear estructura de ramas recomendada
Write-Host "Creando ramas: Main y Development..."
# git checkout -b main
# git add .
# git commit -m "feat: Inicialización completa del Ecosistema R de Rico (Core + MRP + Vision AI)"

# Crear la rama de desarrollo
# git branch development

Write-Host "`nRECOMENDACIÓN DE ADMINISTRADOR:" -ForegroundColor Green
Write-Host "Para completar la conexión con Google Cloud, sigue estos pasos:"
Write-Host "1. Ejecuta: gcloud auth login"
Write-Host "2. Ejecuta: gcloud config set project [TU_PROJECT_ID]"
Write-Host "3. Descomenta las líneas de comando en este script para automatizar el primer envío (Push)."
