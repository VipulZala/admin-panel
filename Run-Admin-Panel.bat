@echo off
echo Starting Admin Panel...
cd /d "c:\Users\zalav\OneDrive\Desktop\ADMIN DASHBOARD\admin-panel"
if %errorlevel% neq 0 (
    echo Error: Could not find the project directory.
    pause
    exit /b
)
echo Successfully moved to project directory.
echo Starting development server...
call npm run dev
if %errorlevel% neq 0 (
    echo.
    echo Error: "npm run dev" failed with exit code %errorlevel%.
    echo Make sure Node.js and npm are installed correctly.
    pause
)
pause
