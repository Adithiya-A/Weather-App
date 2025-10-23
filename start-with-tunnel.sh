#!/bin/bash

echo "🌤️  Starting Weather App with Mobile Tunnel..."

# Start backend
echo "🚀 Starting Backend Server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server failed to start"
    exit 1
fi

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel..."
ngrok http 3001 --log=stdout &
NGROK_PID=$!

# Wait for ngrok to start
sleep 5

# Get the ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$NGROK_URL" ]; then
    echo "✅ ngrok tunnel created: $NGROK_URL"
    
    # Update config with new URL
    sed -i "s|'https://[^']*\.ngrok-free\.app'|'$NGROK_URL'|" ../src/config.js
    echo "🔧 Updated config with ngrok URL"
else
    echo "❌ Failed to get ngrok URL"
    exit 1
fi

# Go back to root and start Expo
cd ..
echo "📱 Starting Expo Development Server..."
npx expo start --tunnel --clear

# Cleanup function
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $NGROK_PID 2>/dev/null
    pkill -f "expo start" 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait
