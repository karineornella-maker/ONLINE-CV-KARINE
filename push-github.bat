@echo off
title Push GitHub - Karine CV
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================================
echo   ENVOI DU CODE VERS GITHUB
echo   Depot : karineornella-maker/ONLINE-CV-KARINE
echo ========================================================
echo.
echo Envoi en cours... Si demande, connectez-vous dans la fenetre qui apparait.
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  [SUCCES] Votre code est desormais en ligne sur GitHub !
    echo  Consultez-le sur :
    echo  https://github.com/karineornella-maker/ONLINE-CV-KARINE
    echo ========================================================
) else (
    echo [ATTENTION] L'envoi n'a pas pu se terminer.
    echo Si necessaire, ouvrez une fenetre PowerShell et lancez : git push -u origin main
)

echo.
pause
