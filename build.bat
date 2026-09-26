@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is required. & exit /b 1)
node tools\build-wiki.mjs || exit /b 1
node tools\build-provenance.mjs || exit /b 1
node tools\check.mjs || exit /b 1
echo Farm Tycoon Field Guide is ready in this folder.
