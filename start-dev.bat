@echo off
echo ========================================
echo   Knowledge Base - Start Development
echo ========================================
echo.

echo Starting Backend Server...
start cmd /k "cd backend && pip install -r requirements.txt && copy .env.example .env && uvicorn app.main:app --reload --port 8000"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ========================================
echo   Development servers are starting!
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo ========================================
