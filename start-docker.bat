@echo off
echo ========================================
echo   Knowledge Base - Docker Start
echo ========================================
echo.

echo Building and starting containers...
docker-compose up -d --build

echo.
echo ========================================
echo   Services are starting!
echo   MySQL:    localhost:3306
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
