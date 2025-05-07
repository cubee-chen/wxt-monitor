// src/services/dataService.js
import axios from 'axios';

// GitHub raw content URL for your data file
const DATA_URL = 'https://raw.githubusercontent.com/JackQuark/2025CloudDymWorkshop/cr1000/CR1000_2_Data1min.dat';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_STORED_RECORDS = 1000; // Limit number of records to store in localStorage

let cachedData = null;
let lastFetchTime = null;

/**
 * Fetches weather data from GitHub repository
 */
export const fetchWeatherData = async () => {
  // Return cached data if it's fresh enough
  const now = new Date().getTime();
  if (cachedData && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedData;
  }

  try {
    const response = await axios.get(DATA_URL);
    const parsedData = parseWeatherData(response.data);
    
    // Update cache
    cachedData = parsedData;
    lastFetchTime = now;
    
    // Only store recent data to avoid exceeding quota
    const recentData = parsedData.slice(-MAX_STORED_RECORDS);
    
    try {
      // Store metadata separately
      localStorage.setItem('weatherDataTimestamp', now.toString());
      localStorage.setItem('weatherDataCount', recentData.length.toString());
      
      // Store data in chunks to avoid quota issues
      const chunkSize = 100;
      for (let i = 0; i < recentData.length; i += chunkSize) {
        const chunk = recentData.slice(i, i + chunkSize);
        localStorage.setItem(`weatherData_${i}`, JSON.stringify(chunk));
      }
    } catch (storageError) {
      console.warn('Failed to store data in localStorage:', storageError);
      // Clear localStorage and try to store only essential data
      try {
        localStorage.clear();
        localStorage.setItem('weatherDataTimestamp', now.toString());
      } catch (e) {
        console.error('Failed to use localStorage:', e);
      }
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // Try to return cached data from localStorage if available
    try {
      const timestamp = localStorage.getItem('weatherDataTimestamp');
      const count = parseInt(localStorage.getItem('weatherDataCount') || '0');
      
      if (timestamp && count > 0) {
        let storedData = [];
        
        // Retrieve data chunks
        const chunkSize = 100;
        for (let i = 0; i < count; i += chunkSize) {
          const chunkData = localStorage.getItem(`weatherData_${i}`);
          if (chunkData) {
            storedData = storedData.concat(JSON.parse(chunkData));
          }
        }
        
        if (storedData.length > 0) {
          return storedData;
        }
      }
    } catch (e) {
      console.error('Error retrieving cached data:', e);
    }
    
    throw error;
  }
};

/**
 * Parses the raw DAT file data
 */
const parseWeatherData = (rawData) => {
  // Split the data into lines
  const lines = rawData.split('\n');
  
  // Extract headers (line 2, which is index 1)
  const headers = lines[1].replace(/"/g, '').split(',');
  
  // Skip the first 4 lines (header info) and parse the data
  const data = [];
  for (let i = 4; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Remove quotes and split by comma
    const values = line.replace(/"/g, '').split(',');
    
    // Create an object with the headers as keys
    const entry = {};
    headers.forEach((header, index) => {
      const value = values[index];
      
      // Convert numeric values
      if (header !== 'TIMESTAMP' && value !== '') {
        entry[header] = parseFloat(value);
      } else {
        entry[header] = value;
      }
    });
    
    // Convert timestamp to Date object
    if (entry.TIMESTAMP) {
      entry.date = new Date(entry.TIMESTAMP);
    }
    
    data.push(entry);
  }
  
  return data;
};

/**
 * Gets data filtered by time range
 */
export const getDataByTimeRange = (data, range) => {
  if (!data || data.length === 0) return [];
  
  const now = new Date();
  let startDate;
  
  switch (range) {
    case '24h':
      startDate = new Date(now - 24 * 60 * 60 * 1000);
      break;
    case '3d':
      startDate = new Date(now - 3 * 24 * 60 * 60 * 1000);
      break;
    case '1w':
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
      break;
    case '1m':
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now - 24 * 60 * 60 * 1000); // Default to 24h
  }
  
  return data.filter(item => item.date >= startDate);
};