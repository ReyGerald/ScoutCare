@echo off
title ScoutCare — First Aid & Medicine Reminder
echo ========================================================
echo  ScoutCare - A First-Aid and Medicine Reminder App
echo  For Boy Scouts, Parents, and Scout Leaders
echo ========================================================
echo Launching local server and web application...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
