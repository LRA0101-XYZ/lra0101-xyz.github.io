@echo off
rem ============================================================================
rem  PANOSYS // DARK 2.0 - lanzador para la sala
rem  Abre DARK 2.0 en Chrome en modo kiosko: siempre pantalla completa, sin barras,
rem  camara autorizada de antemano (ningun aviso de permiso) y audio sin gesto previo.
rem  Usa un perfil de Chrome aparte: no toca el Chrome normal.
rem  Para salir: Alt+F4
rem ============================================================================
set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
set "PERFIL=%TEMP%\panosys-dark2-sala"
start "" "%CHROME%" --user-data-dir="%PERFIL%" --kiosk --use-fake-ui-for-media-stream --autoplay-policy=no-user-gesture-required --no-first-run --no-default-browser-check --disable-features=Translate "%~dp0index.html"
