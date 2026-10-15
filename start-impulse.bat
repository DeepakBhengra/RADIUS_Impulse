@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo Impulse Tool
echo.

REM The dashboard is a Node app. npm is used only when node_modules is missing.
REM After that, Vite is started directly and does not call npm.
REM The API is .NET and does not use npm.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed.
  echo Install Node.js 22 from https://nodejs.org/ and run this file again.
  exit /b 1
)

if not exist "my-dashboard\node_modules\" (
  where npm >nul 2>&1
  if errorlevel 1 (
    echo npm was not found. Node.js 22 includes npm. Install it, then run this file again.
    exit /b 1
  )
  echo Frontend packages are not installed. Running npm install in my-dashboard...
  pushd "my-dashboard"
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    popd
    exit /b 1
  )
  popd
  echo Frontend packages installed.
) else (
  echo Frontend packages are already installed. Skipping npm install.
)

echo Starting the dashboard. The address comes from my-dashboard\vite.config.js.
start "Impulse Dashboard" /D "%~dp0my-dashboard" cmd /k node_modules\.bin\vite.cmd

where dotnet >nul 2>&1
if errorlevel 1 (
  echo.
  echo .NET SDK 8 was not found, so the API was not started.
  echo Install the .NET 8 SDK to run the API. With VITE_USE_MOCK_API=false, search needs that API.
  goto :open
)

echo Starting the API at http://localhost:5298/
if exist "%~dp0backend-dotnet\set-ods-secrets.bat" (
  echo Loading ODS passwords from backend-dotnet\set-ods-secrets.bat
  start "Impulse API" /D "%~dp0backend-dotnet\ImpulseSupportTool_Repo" cmd /k "call ..\set-ods-secrets.bat && dotnet run --launch-profile http"
) else (
  echo backend-dotnet\set-ods-secrets.bat was not found. The API will start without setting passwords.
  start "Impulse API" /D "%~dp0backend-dotnet\ImpulseSupportTool_Repo" cmd /k dotnet run --launch-profile http
)

:open
timeout /t 3 /nobreak >nul
start "" "http://10.129.180.117:5173/"
echo.
echo Dashboard: http://10.129.180.117:5173/
echo API:       http://localhost:5298/swagger
echo.
echo Mock data is on when my-dashboard\.env.local has VITE_USE_MOCK_API=true.
echo Set that value to false to call the API. The API also needs the ODS user-secret passwords.
endlocal
