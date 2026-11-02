@echo off
setlocal
title Portfolio dev server
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not on PATH. Install it from https://nodejs.org and run this again.
  pause
  exit /b 1
)

rem Install packages on first run, or when package-lock.json changed since the last install.
set "NEED_INSTALL=0"
if not exist "node_modules\.package-lock.json" set "NEED_INSTALL=1"
if "%NEED_INSTALL%"=="0" (
  powershell -NoProfile -Command "if ((Get-Item 'package-lock.json').LastWriteTime -gt (Get-Item 'node_modules\.package-lock.json').LastWriteTime) { exit 1 } else { exit 0 }"
  if errorlevel 1 set "NEED_INSTALL=1"
)
if "%NEED_INSTALL%"=="1" (
  echo Installing packages...
  call npm install
  if errorlevel 1 (
    echo npm install failed. See the errors above.
    pause
    exit /b 1
  )
)

rem Open the browser once the server answers (waits up to 2 minutes).
start "" /b powershell -NoProfile -WindowStyle Hidden -Command "$u='http://localhost:3000'; for ($i = 0; $i -lt 120; $i++) { try { Invoke-WebRequest $u -UseBasicParsing -TimeoutSec 60 | Out-Null; Start-Process $u; break } catch { Start-Sleep -Seconds 1 } }"

echo Starting dev server on http://localhost:3000  (close this window or press Ctrl+C to stop)
call npm run dev -- -p 3000

echo.
echo The dev server stopped. If it says port 3000 is in use, close the other server and run this again.
pause
