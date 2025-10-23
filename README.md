# Weather App

A beautiful weather application built with React Native (Expo) frontend and Node.js backend running in Docker. The app features a dark theme with current weather display and 7-day forecast functionality.

## Features

- **Home Screen**: Current weather display with city search functionality
- **Forecast Screen**: 7-day weather forecast with hourly/daily tabs
- **Dark Theme**: Modern UI with dark color scheme
- **Docker Backend**: Containerized Node.js API server
- **Real-time Weather**: Integration with OpenWeatherMap API

## Project Structure

```
weather-app-1/
├── app/                    # Frontend (React Native/Expo)
│   ├── index.jsx          # Home screen
│   ├── forecast.jsx       # Forecast screen
│   └── _layout.jsx        # Navigation setup
├── backend/               # Backend API (Node.js)
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── Dockerfile         # Docker configuration
├── docker-compose.yml     # Docker orchestration
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Expo CLI (`npm install -g @expo/cli`)
- OpenWeatherMap API key (free at https://openweathermap.org/api)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# The backend dependencies will be installed automatically via Docker
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# backend/.env
OPENWEATHER_API_KEY=your_actual_api_key_here
PORT=3001
```

**Important**: Replace `your_actual_api_key_here` with your real OpenWeatherMap API key.

### 3. Start the Backend (Docker)

```bash
# Start the backend API server using Docker
docker-compose up -d

# Check if the backend is running
curl http://localhost:3001/api/health
```

### 4. Start the Frontend (Local)

```bash
# Start the Expo development server
npm start

# Or start for specific platforms
npm run android  # For Android
npm run ios      # For iOS
npm run web      # For Web
```

## API Endpoints

The backend provides the following endpoints:

- `GET /api/health` - Health check
- `GET /api/weather/:city` - Get current weather for a city
- `GET /api/weather/coordinates/:lat/:lon` - Get weather by coordinates
- `GET /api/forecast/:city` - Get 5-day forecast for a city

## Usage

1. **Home Screen**: 
   - View current weather for multiple cities
   - Search for any city using the search bar
   - Tap on "Forecast" in the bottom navigation to view forecasts

2. **Forecast Screen**:
   - View 7-day weather forecast
   - Switch between "Hourly" and "Daily" tabs
   - Navigate back to Home using the back arrow or bottom navigation

## Development

### Backend Development

```bash
# Run backend in development mode (with hot reload)
cd backend
npm run dev
```

### Frontend Development

The frontend runs locally with Expo's development server, providing hot reload and debugging capabilities.

### Docker Commands

```bash
# Start backend
docker-compose up -d

# Stop backend
docker-compose down

# View logs
docker-compose logs -f

# Rebuild backend
docker-compose up --build -d
```

## Troubleshooting

### Common Issues

1. **Backend not starting**: 
   - Ensure Docker is running
   - Check if port 3001 is available
   - Verify the `.env` file exists in the backend directory

2. **API key issues**:
   - Ensure you have a valid OpenWeatherMap API key
   - Check the `.env` file has the correct key

3. **Frontend connection issues**:
   - Ensure the backend is running on port 3001
   - Check network connectivity between frontend and backend

### Ports Used

- Frontend (Expo): Various ports (managed by Expo)
- Backend API: 3001
- Docker: Uses port 3001

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the OpenWeatherMap API documentation
3. Create an issue in the repository
