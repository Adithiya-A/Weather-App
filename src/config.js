// API Configuration
// This file handles different network environments

import { Platform } from 'react-native';

// Development API URLs - try multiple options
const API_URLS = [
  'https://964453d1c74c.ngrok-free.app',  // ngrok tunnel (works for mobile)
  'http://172.17.227.114:3001',           // Your current IP
  'http://10.0.2.2:3001',                 // Android emulator
  'http://localhost:3001',                // Web/local development
  'http://192.168.1.100:3001',           // Common home network IP
];

// Function to get the correct API URL
export const getAPIUrl = () => {
  const isDevelopment = __DEV__;
  
  if (isDevelopment) {
    // For web platform, use localhost
    if (Platform.OS === 'web') {
      return 'http://localhost:3001';
    }
    
    // For mobile, try the first IP (you can change this)
    return API_URLS[0];
  }
  
  // Production URL (replace with your deployed backend)
  return 'https://your-backend.herokuapp.com';
};

// Export the current API URL
export const API_BASE_URL = getAPIUrl();

// Helper function to make API calls with fallback URLs
export const apiCall = async (endpoint, options = {}) => {
  const isDevelopment = __DEV__;
  
  if (isDevelopment) {
    // Try multiple URLs in development
    for (const baseUrl of API_URLS) {
      try {
        const url = `${baseUrl}${endpoint}`;
        console.log(`Trying API URL: ${url}`);
        
        const response = await fetch(url, {
          timeout: 5000, // 5 second timeout per attempt
          ...options,
        });
        
        if (response.ok) {
          console.log(`✅ Success with URL: ${url}`);
          return await response.json();
        }
      } catch (error) {
        console.log(`❌ Failed with URL: ${baseUrl}${endpoint}`, error.message);
        continue;
      }
    }
    
    // If all URLs failed, throw an error
    throw new Error('All API endpoints failed. Please check your network connection and ensure the backend server is running.');
  }
  
  // Production: use single URL
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    timeout: 10000,
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
};

export default {
  API_URLS,
  getAPIUrl,
  API_BASE_URL,
  apiCall
};
