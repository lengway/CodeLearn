#!/bin/bash

echo "🚀 Starting CodeLearn Platform..."

# Start all services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check services status
echo ""
echo "📊 Services Status:"
docker-compose ps

echo ""
echo "✅ Platform started!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "📚 API: http://localhost:3000/api"
echo "🔧 Piston API: http://localhost:2358/api/v2/runtimes"
echo ""
echo "📋 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
