@echo off
echo ================================================================
echo  Push Inventory Management System to GitHub
echo ================================================================
echo.

echo Step 1: Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit
)
echo ✅ Git is installed
echo.

echo Step 2: Initializing Git repository...
git init
echo ✅ Git initialized
echo.

echo Step 3: Adding all files to Git...
git add .
echo ✅ Files added
echo.

echo Step 4: Creating commit...
git commit -m "Initial commit: Complete MERN Inventory Management System with authentication, product management, inventory tracking, and order processing"
echo ✅ Commit created
echo.

echo ================================================================
echo  IMPORTANT: Manual Steps Required
echo ================================================================
echo.
echo Now you need to:
echo.
echo 1. Go to: https://github.com/new
echo 2. Repository name: inventory-management-system
echo 3. Description: Full-stack MERN Inventory Management System
echo 4. Choose Public or Private
echo 5. DON'T check any boxes (no README, no .gitignore, no license)
echo 6. Click "Create repository"
echo.
echo After creating the repository, GitHub will show you commands.
echo Come back here and press any key to continue...
pause >nul

echo.
echo ================================================================
echo  Enter Your GitHub Repository URL
echo ================================================================
echo.
echo Example: https://github.com/yourusername/inventory-management-system.git
echo.
set /p REPO_URL="Paste your repository URL here: "

echo.
echo Adding remote repository...
git remote add origin %REPO_URL%
echo ✅ Remote added
echo.

echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ================================================================
echo  ✅ SUCCESS!
echo ================================================================
echo.
echo Your code has been pushed to GitHub!
echo Repository: %REPO_URL%
echo.
echo Next steps:
echo 1. Visit your repository on GitHub
echo 2. Verify all files are uploaded
echo 3. Check that .env files are NOT visible (they shouldn't be)
echo 4. Share the repository URL
echo.
echo ================================================================
pause
