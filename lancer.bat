@echo off
title CV en Ligne - Karine Benissanh
chcp 65001 >nul
cls

echo ==========================================================
echo   CV EN LIGNE - DEDE KARINE ORNELLA BENISSANH
echo ==========================================================
echo.
echo Demarrage du serveur local et ouverture du navigateur...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Ouverture directe dans votre navigateur par defaut...
    start "" "%~dp0index.html"
)

pause
