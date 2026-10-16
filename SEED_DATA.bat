@echo off
echo ================================================
echo  Seeding Demo Data
echo ================================================
echo.

echo Checking MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB service not running!
    echo Please start MongoDB first.
    echo.
    pause
    exit
)

echo.
echo Running seed script...
cd backend
call npm run seed

echo.
echo ================================================
echo Demo accounts created:
echo ================================================
echo Admin:    admin@example.com    / admin123
echo Manager:  manager@example.com  / manager123
echo Staff:    staff@example.com    / staff123
echo ================================================
echo.
echo Press any key to exit...
pause >nul
