@echo off
setlocal
set "ROOT_DIR=%~dp0.."

echo ===================================================
echo PamAgents - Starting Backend Services
echo ===================================================

echo [1/2] Starting Go Backend Server...
start "PamAgents Go Backend" cmd /c "cd /d ""%ROOT_DIR%\backend"" && go run . --serve & pause"

echo [2/2] Starting Python AI Engine...
start "PamAgents AI Engine" cmd /c "cd /d ""%ROOT_DIR%\backend\engine"" && (if exist ""%ROOT_DIR%\.venv\Scripts\activate.bat"" call ""%ROOT_DIR%\.venv\Scripts\activate.bat"" & python main.py) & pause"

echo Both services have been launched in separate windows.
pause
