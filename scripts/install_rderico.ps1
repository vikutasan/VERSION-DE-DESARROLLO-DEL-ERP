# Script de Instalación Rápida para R de Rico ERP - Sucursal Toluca
# Ejecuta este script con clic derecho -> "Ejecutar con PowerShell"

Write-Host "--- Iniciando Instalación de R de Rico ERP ---" -ForegroundColor Cyan

# 1. Comprobar permisos de administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "Por favor, ejecuta este script como ADMINISTRADOR."
    exit
}

# 2. Instalar Winget (si no está disponible)
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "Instalando Microsoft Store UI para habilitar Winget..."
    # (Este paso suele ser automático en Windows 10/11 actualizado)
}

# 3. Instalar Node.js (v18+)
Write-Host "Instalando Node.js v18 (LTS)..."
winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements

# 4. Instalar Docker Desktop (Para el servidor de base de datos Edge)
Write-Host "Instalando Docker Desktop..."
winget install Docker.DockerDesktop --silent --accept-package-agreements

# 5. Instalar Git
Write-Host "Instalando Git..."
winget install Git.Git --silent --accept-package-agreements

# 6. Instalar Google Cloud SDK (gcloud CLI)
Write-Host "Instalando Google Cloud SDK..."
winget install Google.CloudSDK --silent --accept-package-agreements


# 6. Configurar Variables de Entorno
Write-Host "Configurando variables del ERP..."
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Archivo .env creado. Por favor, edítalo con tus claves finales." -ForegroundColor Green
}

# 7. Mensaje Final
Write-Host "`n--- Instalación Completada con Éxito ---" -ForegroundColor Green
Write-Host "Por favor, reinicia la computadora para que los cambios de PATH surtan efecto."
Write-Host "Mañana en Toluca, solo deberás abrir Docker y ejecutar 'docker-compose up -d' en esta carpeta."
