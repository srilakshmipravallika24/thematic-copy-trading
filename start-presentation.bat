@echo off
TITLE Thematic Social Copy-Trading Platform (Team Presentation)
echo ================================================================
echo   THEMATIC SOCIAL COPY-TRADING NETWORK (REGULATED RIA EDITION)
echo   Starting Backend API (Port 5000) & Next.js Frontend (Port 3000)...
echo ================================================================

cd /d "%~dp0"
node start-all.js
pause
