@echo off
REM Quick start script for Document Editor MVP

echo ========================================
echo Document Editor - Quick Start
echo ========================================
echo.

REM Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js 16+ from nodejs.org
    pause
    exit /b 1
)

echo Node.js is installed
node --version
echo.

REM Install server dependencies
echo Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
cd ..
echo.

REM Install client dependencies
echo Installing client dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
cd ..
echo.

echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Open a PowerShell terminal and run:
echo    cd server
echo    npm run dev
echo.
echo 2. Open another PowerShell terminal and run:
echo    cd client
echo    npm run dev
echo.
echo 3. Open browser to http://localhost:3000
echo.
pause
