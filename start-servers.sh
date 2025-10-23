#!/bin/bash

# Weather App Startup Script
echo "🌤️  Starting Weather App Servers..."

# Function to get the local IP address
get_local_ip() {
    # Try different methods to get the local IP
    if command -v ip &> /dev/null; then
        ip route get 1.1.1.1 | awk '{print $7}' | head -1
    elif command -v hostname &> /dev/null; then
        hostname -I | awk '{print $1}'
    else
        echo "127.0.0.1"
    fi
}

# Get the local IP
LOCAL_IP=$(get_local_ip)
echo "📍 Local IP: $LOCAL_IP"

# Update the config file with the current IP
sed -i "s/localIP: 'http:\/\/.*:3001'/localIP: 'http:\/\/$LOCAL_IP:3001'/" app/config.js

echo "🔧 Updated API configuration with IP: $LOCAL_IP"

# Start backend server
echo "🚀 Starting Backend Server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend server is running on port 3001"
else
    echo "❌ Backend server failed to start"
    exit 1
fi

# Go back to root directory
cd ..

# Start Expo development server
echo "📱 Starting Expo Development Server..."
npx expo start --tunnel --clear

# Cleanup function
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    pkill -f "expo start" 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait
