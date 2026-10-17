@echo off
echo =======================================================
echo Antigravity Conversation Restorer
echo =======================================================
echo Please close Antigravity IDE now (File -^> Exit).
echo This script will wait for Antigravity IDE to exit,
echo patch state.vscdb with the missing conversation,
echo and then automatically restart Antigravity IDE.
echo =======================================================
python "%~dp0restore_convo.py" --wait
pause
