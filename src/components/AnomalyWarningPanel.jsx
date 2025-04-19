// New file: src/components/AnomalyWarningPanel.jsx
import { useState, useEffect } from 'react';
import AnomalyWarning from './AnomalyWarning';

const AnomalyWarningPanel = ({ allWeatherData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [allAnomalies, setAllAnomalies] = useState([]);

  useEffect(() => {
    // Detect anomalies in all data, regardless of time range
    if (allWeatherData && allWeatherData.length > 0) {
      // Import and use the anomaly detector here to process all data
      import('../utils/anomalyDetector').then(({ detectAnomalies }) => {
        const anomalies = detectAnomalies(allWeatherData);
        setAllAnomalies(anomalies);
      });
    }
  }, [allWeatherData]);

  return (
    <div className="anomaly-panel">
      <div 
        className="anomaly-panel-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>
          Anomaly History 
          <span className="anomaly-count">({allAnomalies.length})</span> 
          <span className="expand-icon">{isExpanded ? '▼' : '►'}</span>
        </h3>
      </div>
      
      {isExpanded && (
        <div className="anomalies-container expanded">
          {allAnomalies.length > 0 ? (
            allAnomalies.map((anomaly, index) => (
              <AnomalyWarning key={index} anomaly={anomaly} />
            ))
          ) : (
            <p className="no-anomalies">No anomalies detected in the full dataset.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AnomalyWarningPanel;