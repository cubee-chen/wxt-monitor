// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import TimeRangeSelector from "./TimeRangeSelector";
import WeatherChart from "./WeatherChart";
import BatteryStatus from "./BatteryStatus";
import AnomalyWarning from "./AnomalyWarning";
import { getDataByTimeRange } from "../services/dataService";
import { detectAnomalies } from "../utils/anomalyDetector";
import AnomalyWarningPanel from "./AnomalyWarningPanel";

const Dashboard = ({ weatherData, selectedTimeRange, onTimeRangeChange }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  // Debug line to check filtered data
  useEffect(() => {
    console.log("Wind Direction Data:", filteredData.map(d => ({
      timestamp: d.timestamp,
      direction: d.wdavg_Avg
    })));
  }, [filteredData]);

  useEffect(() => {
    // Filter data based on time range
    const filtered = getDataByTimeRange(weatherData, selectedTimeRange);
    setFilteredData(filtered);

    //debug line
    console.log("Filtered Data length", filtered.length);

    // Detect anomalies in the filtered data
    const detectedAnomalies = detectAnomalies(filtered);
    setAnomalies(detectedAnomalies);
  }, [weatherData, selectedTimeRange]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>WXT 即時數據 @NTU</h2>
        <TimeRangeSelector
          selectedRange={selectedTimeRange}
          onChange={onTimeRangeChange}
        />
      </div>

      {/* Full anomaly history (independent of time range) */}
      <AnomalyWarningPanel allWeatherData={weatherData} />

      {/* Current time range anomalies */}
      {anomalies.length > 0 && (
        <div className="anomalies-section">
          <h3>Current View Anomalies</h3>
          <div className="anomalies-container">
            {anomalies.map((anomaly, index) => (
              <AnomalyWarning key={index} anomaly={anomaly} />
            ))}
          </div>
        </div>
      )}

      <div className="charts-grid">
        <div className="chart-container temperature">
          <h3>溫度 (°C)</h3>
          <WeatherChart
            data={filteredData}
            dataKey="airtemp_Avg"
            color="#FF7043"
            unit="°C"
            yAxisLabel=""
          />
        </div>

        <div className="chart-container humidity">
          <h3>相對濕度 (%)</h3>
          <WeatherChart
            data={filteredData}
            dataKey="relhumidity_Avg"
            color="#26C6DA"
            unit="%"
            yAxisLabel=""
          />
        </div>

        <div className="chart-container pressure">
          <h3>氣壓 (hPa)</h3>
          <WeatherChart
            data={filteredData}
            dataKey="airpressure_Avg"
            color="#7E57C2"
            unit="hPa"
            yAxisLabel=""
            chartType="bar" // Changed from line to bar
          />
        </div>

        <div className="chart-container rain">
          <h3>降水強度 (mm/hr)</h3>
          <WeatherChart
            data={filteredData}
            dataKey="Rintensity_Tot"
            color="#42A5F5"
            unit="mm/h"
            yAxisLabel=""
            chartType="bar"
          />
        </div>

        <div className="chart-container wind">
          <h3>風向風速 (m/s)</h3>
          <WeatherChart
            data={filteredData}
            // dataKey="WS_ms_S_WVT"
            dataKey="Wsavg_Avg"
            directionKey="WindDir_D1_WVT"
            // directionKey="wdavg_Avg"
            color="#66BB6A"
            unit="m/s"
            yAxisLabel=""
            type="wind"
          />
        </div>

        <div className="chart-container battery">
          <h3>電池狀態 (Volt)</h3>
          <BatteryStatus data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
