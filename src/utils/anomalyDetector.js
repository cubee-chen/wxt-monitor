// src/utils/anomalyDetector.js

/**
 * Detects anomalies in weather data based on various rules
 * @param {Array} data - The weather data array
 * @returns {Array} Array of anomalies with descriptions
 */
export const detectAnomalies = (data) => {
    if (!data || data.length === 0) return [];
    
    const anomalies = [];
    
    // Check for battery voltage issues
    const batteryAnomalies = detectBatteryAnomalies(data);
    if (batteryAnomalies.length > 0) {
      anomalies.push(...batteryAnomalies);
    }
    
    // Check for temperature spikes or drops
    const temperatureAnomalies = detectTemperatureAnomalies(data);
    if (temperatureAnomalies.length > 0) {
      anomalies.push(...temperatureAnomalies);
    }
    
    // Check for humidity issues
    const humidityAnomalies = detectHumidityAnomalies(data);
    if (humidityAnomalies.length > 0) {
      anomalies.push(...humidityAnomalies);
    }
    
    // Check for pressure anomalies
    const pressureAnomalies = detectPressureAnomalies(data);
    if (pressureAnomalies.length > 0) {
      anomalies.push(...pressureAnomalies);
    }
    
    // Check for missing data
    const missingDataAnomalies = detectMissingData(data);
    if (missingDataAnomalies.length > 0) {
      anomalies.push(...missingDataAnomalies);
    }
    
    return anomalies;
  };
  
  // Check for battery voltage issues
  const detectBatteryAnomalies = (data) => {
    const anomalies = [];
    const lowVoltageThreshold = 12.0; // Define low voltage threshold
    
    data.forEach(entry => {
      if (entry.batt_volt_Min && entry.batt_volt_Min < lowVoltageThreshold) {
        anomalies.push({
          timestamp: entry.TIMESTAMP,
          type: 'battery',
          severity: 'warning',
          message: `Low battery voltage detected: ${entry.batt_volt_Min}V at ${entry.TIMESTAMP}`
        });
      }
    });
    
    return anomalies;
  };
  
  // Check for temperature anomalies (sudden spikes or drops)
  const detectTemperatureAnomalies = (data) => {
    const anomalies = [];
    const tempChangeThreshold = 5.0; // 5 degrees change in one reading
    
    for (let i = 1; i < data.length; i++) {
      const currentTemp = data[i].airtemp_Avg;
      const prevTemp = data[i-1].airtemp_Avg;
      
      if (currentTemp && prevTemp) {
        const tempDiff = Math.abs(currentTemp - prevTemp);
        
        if (tempDiff > tempChangeThreshold) {
          anomalies.push({
            timestamp: data[i].TIMESTAMP,
            type: 'temperature',
            severity: 'warning',
            message: `Unusual temperature change detected: ${tempDiff.toFixed(1)}° change at ${data[i].TIMESTAMP}`
          });
        }
      }
    }
    
    return anomalies;
  };
  
  // Check for humidity anomalies
  const detectHumidityAnomalies = (data) => {
    const anomalies = [];
    
    for (let i = 0; i < data.length; i++) {
      const humidity = data[i].relhumidity_Avg;
      
      // Check for impossible humidity values
      if (humidity !== undefined && (humidity < 0 || humidity > 100)) {
        anomalies.push({
          timestamp: data[i].TIMESTAMP,
          type: 'humidity',
          severity: 'error',
          message: `Invalid humidity reading: ${humidity}% at ${data[i].TIMESTAMP}`
        });
      }
    }
    
    return anomalies;
  };
  
  // Check for pressure anomalies
  const detectPressureAnomalies = (data) => {
    const anomalies = [];
    const pressureChangeThreshold = 10; // 10 hPa change in one reading
    
    for (let i = 1; i < data.length; i++) {
      const currentPressure = data[i].airpressure_Avg;
      const prevPressure = data[i-1].airpressure_Avg;
      
      if (currentPressure && prevPressure) {
        const pressureDiff = Math.abs(currentPressure - prevPressure);
        
        if (pressureDiff > pressureChangeThreshold) {
          anomalies.push({
            timestamp: data[i].TIMESTAMP,
            type: 'pressure',
            severity: 'warning',
            message: `Unusual pressure change detected: ${pressureDiff.toFixed(1)} hPa change at ${data[i].TIMESTAMP}`
          });
        }
      }
    }
    
    return anomalies;
  };
  
  // Check for missing data (gaps in timestamps)
  const detectMissingData = (data) => {
    const anomalies = [];
    const expectedInterval = 2 * 60 * 1000; // 2 minutes in milliseconds
    const toleranceInterval = 30 * 1000; // 30 seconds tolerance
    
    for (let i = 1; i < data.length; i++) {
      const currentTime = new Date(data[i].TIMESTAMP).getTime();
      const prevTime = new Date(data[i-1].TIMESTAMP).getTime();
      const timeDiff = currentTime - prevTime;
      
      // If gap is significantly larger than expected interval
      if (timeDiff > (expectedInterval + toleranceInterval)) {
        const gapMinutes = Math.round(timeDiff / 60000);
        anomalies.push({
          timestamp: data[i-1].TIMESTAMP,
          type: 'missing_data',
          severity: 'info',
          message: `Data gap detected: Approximately ${gapMinutes} minutes between ${data[i-1].TIMESTAMP} and ${data[i].TIMESTAMP}`
        });
      }
    }
    
    return anomalies;
  };