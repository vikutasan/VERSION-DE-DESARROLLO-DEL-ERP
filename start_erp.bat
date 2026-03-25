@echo off
setlocal
title R de Rico ERP - Local Launcher

echo ==========================================
echo    🚀 INICIANDO R DE RICO ERP
echo ==========================================

:: Verificar Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado. Por favor instalalo desde nodejs.org
    pause
    exit /b
)

:: Instalar dependencias si faltan
if not exist "node_modules" (
    echo [INFO] Instalando dependencias...
    powershell -ExecutionPolicy Bypass -Command "npm install"
)

:: Iniciar servidor
echo [INFO] Abriendo sistema en http://localhost:3000...
powershell -ExecutionPolicy Bypass -Command "npm run dev"

pause
