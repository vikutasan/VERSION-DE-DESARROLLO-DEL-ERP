# R de Rico ERP - Local Launcher
# Uso: Botón derecho -> Ejecutar con PowerShell

Write-Host "🚀 Iniciando R de Rico ERP..." -ForegroundColor Orange

# 1. Instalar dependencias si no existen
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias por primera vez..." -ForegroundColor Cyan
    powershell -ExecutionPolicy Bypass -Command "npm install"
}

# 2. Iniciar servidor de desarrollo
Write-Host "🌐 Abriendo Centro de Experimentación en http://localhost:3000" -ForegroundColor Green
powershell -ExecutionPolicy Bypass -Command "npm run dev"
