@echo off
echo ================================================================
echo  DEMO MODE - No MongoDB, No Login Required!
echo ================================================================
echo.
echo This demo mode:
echo   ✅ NO MongoDB installation needed
echo   ✅ NO authentication required
echo   ✅ Uses sample in-memory data
echo   ✅ All features work immediately
echo.
echo Starting servers...
echo ================================================================
echo.

echo Starting Backend (Demo Mode)...
start cmd /k "cd backend && npm run demo"

timeout /t 5 /nobreak >nul

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo ================================================================
echo  Servers Starting...
echo ================================================================
echo.
echo Backend (Demo): http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Wait 10 seconds, then open: http://localhost:3000
echo.
echo No login needed - go straight to dashboard!
echo.
echo ================================================================
echo Press any key to open browser...
pause >nul

timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo Done! Check the two command windows that opened.
echo Press any key to exit this window...
pause >nul
