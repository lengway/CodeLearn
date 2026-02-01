# PowerShell script to start CodeLearn Platform

Write-Host "🚀 Starting CodeLearn Platform..." -ForegroundColor Cyan

# Start all services
docker-compose up -d

Write-Host ""
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check services status
Write-Host ""
Write-Host "📊 Services Status:" -ForegroundColor Green
docker-compose ps

Write-Host ""
Write-Host "✅ Platform started!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📚 API: http://localhost:3000/api" -ForegroundColor Cyan
Write-Host "🔧 Piston API: http://localhost:2358/api/v2/runtimes" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 To view logs: docker-compose logs -f" -ForegroundColor Yellow
Write-Host "🛑 To stop: docker-compose down" -ForegroundColor Yellow
