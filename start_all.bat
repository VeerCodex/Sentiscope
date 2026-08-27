@echo off
echo ===================================================================
echo Launching SentiScope - Sentiment Analysis Platform for Businesses
echo ===================================================================

echo Starting Backend in new window...
start "SentiScope Backend API" cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Starting Frontend in new window...
start "SentiScope React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting!
echo - Backend API Docs: http://127.0.0.1:8000/docs
echo - Frontend Dashboard: http://localhost:5173
echo ===================================================================
