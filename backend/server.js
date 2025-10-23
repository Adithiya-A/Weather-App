const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// OpenWeatherMap API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'your_api_key_here';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather API is running' });
});

// Get current weather by city name
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      windSpeed: response.data.wind.speed,
      visibility: response.data.visibility / 1000, // Convert to km
      timestamp: new Date().toISOString()
    };
    
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.response?.data?.message || 'City not found'
    });
  }
});

// Get weather by coordinates
app.get('/api/weather/coordinates/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      windSpeed: response.data.wind.speed,
      visibility: response.data.visibility / 1000,
      timestamp: new Date().toISOString()
    };
    
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.response?.data?.message || 'Invalid coordinates'
    });
  }
});

// Get 5-day forecast
app.get('/api/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    const forecastData = response.data.list.map(item => ({
      date: new Date(item.dt * 1000).toISOString(),
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      windSpeed: item.wind.speed
    }));
    
    res.json({
      city: response.data.city.name,
      country: response.data.city.country,
      forecast: forecastData
    });
  } catch (error) {
    console.error('Forecast API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch forecast data',
      message: error.response?.data?.message || 'City not found'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Weather API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});