// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import TimeRangeSelector from './TimeRangeSelector';
import WeatherChart from './WeatherChart';
import BatteryStatus from './BatteryStatus';
import AnomalyWarning from './AnomalyWarning';
import { getDataByTimeRange } from '../services/dataService';
import { detectAnomalies } from '../utils/anomalyDetector';

const Dashboard = ({ weatherData, selectedTimeRange, onTimeRangeChange }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    // Filter data based on time range
    const filtered = getDataByTimeRange(weatherData, selectedTimeRange);
    setFilteredData(filtered);
    
    // Detect anomalies in the filtered data
    const detectedAnomalies = detectAnomalies(filtered);
    setAnomalies(detectedAnomalies);
  }, [weatherData, selectedTimeRange]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Weather Monitoring Dashboard</h2>
        <TimeRangeSelector 
          selectedRange={selectedTimeRange} 
          onChange={onTimeRangeChange} 
        />
      </div>
      
      {anomalies.length > 0 && (
        <div className="anomalies-section">
          <h3>Detected Anomalies</h3>
          <div className="anomalies-container">
            {anomalies.map((anomaly, index) => (
              <AnomalyWarning key={index} anomaly={anomaly} />
            ))}
          </div>
        </div>
      )}
      
      <div className="charts-grid">
        <div className="chart-container temperature">
          <h3>Temperature</h3>
          <WeatherChart 
            data={filteredData} 
            dataKey="airtemp_Avg" 
            color="#FF7043" 
            unit="°C"
            yAxisLabel="Temperature (°C)"
          />
        </div>
        
        <div className="chart-container humidity">
          <h3>Humidity</h3>
          <WeatherChart 
            data={filteredData} 
            dataKey="relhumidity_Avg" 
            color="#26C6DA" 
            unit="%"
            yAxisLabel="Humidity (%)"
          />
        </div>
        
        <div className="chart-container pressure">
          <h3>Air Pressure</h3>
          <WeatherChart 
            data={filteredData} 
            dataKey="airpressure_Avg" 
            color="#7E57C2" 
            unit="hPa"
            yAxisLabel="Pressure (hPa)"
          />
        </div>
        
        <div className="chart-container rain">
          <h3>Rain Intensity</h3>
          <WeatherChart 
            data={filteredData} 
            dataKey="Rintensity_Tot" 
            color="#42A5F5" 
            unit="mm/h"
            yAxisLabel="Rain Intensity (mm/h)"
            chartType="bar"
          />
        </div>
        
        <div className="chart-container wind">
          <h3>Wind Speed & Direction</h3>
          <WeatherChart 
            data={filteredData} 
            dataKey="WS_ms_S_WVT" 
            directionKey="WindDir_D1_WVT"
            color="#66BB6A" 
            unit="m/s"
            yAxisLabel="Wind Speed (m/s)"
            type="wind"
          />
        </div>
        
        <div className="chart-container battery">
          <h3>Battery Status</h3>
          <BatteryStatus data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;