@echo off
echo ===================================================
echo PamAgents - Starting Backend Services
echo ===================================================

echo [1/2] Starting Go Backend Server...
cd backend
start "PamAgents Go Backend" cmd /c "go run . --serve & pause"

echo [2/2] Starting Python AI Engine...
cd ..\backend\engine
start "PamAgents AI Engine" cmd /c "call ..\..\.venv\Scripts\activate.bat && python main.py & pause"

echo Both services have been launched in separate windows.
cd ..\..
pause
