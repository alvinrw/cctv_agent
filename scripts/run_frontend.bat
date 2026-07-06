@echo off
setlocal
set "ROOT_DIR=%~dp0.."
set "FRONTEND_DIR=%ROOT_DIR%\frontend"

echo ===================================================
echo PAMAgents - Starting Frontend
echo ===================================================

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not available in PATH.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not installed or not available in PATH.
  exit /b 1
)

for /f %%A in ('node -p "parseInt(process.versions.node)"') do set "NODE_MAJOR=%%A"
if %NODE_MAJOR% LSS 18 (
  echo Node.js 18 or newer is required to run this frontend.
  node --version
  exit /b 1
)

cd /d "%FRONTEND_DIR%"

if "%~1"=="" (
  npm run dev
) else (
  npm run dev -- %*
)
