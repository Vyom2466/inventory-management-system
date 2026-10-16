@echo off
echo ================================================
echo  Inventory Management System - Startup Script
echo ================================================
echo.

echo Checking MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB service not started
    echo Please start MongoDB manually or use MongoDB Atlas
    echo.
    echo Press any key to continue anyway...
    pause >nul
)

echo.
echo Starting Backend Server...
echo ================================================
start cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server...
echo ================================================
start cmd /k "cd frontend && npm run dev"

echo.
echo ================================================
echo  Application is starting...
echo ================================================
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Wait 10 seconds, then open: http://localhost:3000
echo.
echo Login with:
echo   Email: admin@example.com
echo   Password: admin123
echo.
echo ================================================
echo Press any key to open browser...
pause >nul

timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo Done! Check the two command windows that opened.
echo Press any key to exit this window...
pause >nul
