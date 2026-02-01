#!/bin/bash

echo "🚀 Blink Chat - Quick Start"
echo "=============================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating environment file..."
    cp .env.example .env.local
    echo "✅ Created .env.local - please update with your configuration"
    echo ""
fi

echo "🎯 Starting Blink Chat..."
echo ""
echo "Starting Socket.IO server on port 3001..."
npm run socket &
SOCKET_PID=$!

echo "Waiting for Socket.IO server to start..."
sleep 2

echo "Starting Next.js development server on port 3000..."
npm run dev &
NEXT_PID=$!

echo ""
echo "✅ Servers started successfully!"
echo ""
echo "📱 Open your browser to: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $SOCKET_PID $NEXT_PID; exit" INT
wait
