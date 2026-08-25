@echo off
REM Builds kia-academy-portable.zip on D: (avoids full C: drive)
set TEMP=D:\kian\tmp
set TMP=D:\kian\tmp
if not exist "D:\kian\tmp" mkdir "D:\kian\tmp"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0make-portable-zip.ps1"
echo.
pause
