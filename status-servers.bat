@echo off
cd C:\Users\Alumno\Documents\node
echo.
echo =========== Estado de servidores ===========
pm2 status
echo.
echo Backend: http://10.1.176.207:8000
echo Frontend: http://10.1.176.207:3000
echo.
pause
