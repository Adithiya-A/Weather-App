#!/bin/bash

# Start Ngrok tunnel for weather app backend
echo "🚀 Starting Ngrok tunnel for weather app backend..."
echo "📡 Backend running on: http://localhost:3001"
echo "🌐 Creating public tunnel..."

# Start ngrok in background
ngrok http 3001 --log=stdout > ngrok.log 2>&1 &
NGROK_PID=$!

# Wait for ngrok to start
sleep 5

# Get the public URL
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$PUBLIC_URL" ]; then
    echo "✅ Ngrok tunnel created successfully!"
    echo "🌍 Public URL: $PUBLIC_URL"
    echo "🔗 API Health Check: $PUBLIC_URL/api/health"
    echo "🌤️  Weather API: $PUBLIC_URL/api/weather/Chennai"
    echo ""
    echo "📱 Update your mobile app config with this URL:"
    echo "   $PUBLIC_URL"
    echo ""
    echo "⏹️  To stop the tunnel, run: pkill -f ngrok"
    echo "📋 To see logs: tail -f ngrok.log"
else
    echo "❌ Failed to get Ngrok URL. Check if ngrok is running properly."
    kill $NGROK_PID 2>/dev/null
    exit 1
fi

# Keep the script running
echo "🔄 Tunnel is running... Press Ctrl+C to stop"
wait $NGROK_PID
