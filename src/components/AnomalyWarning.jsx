// src/components/AnomalyWarning.jsx

const AnomalyWarning = ({ anomaly }) => {
    const { type, severity, message, timestamp } = anomaly;
    
    const getIconForType = (type) => {
      switch (type) {
        case 'battery':
          return '🔋';
        case 'temperature':
          return '🌡️';
        case 'humidity':
          return '💧';
        case 'pressure':
          return '🔄';
        case 'missing_data':
          return '❓';
        default:
          return '⚠️';
      }
    };
  
    return (
      <div className={`anomaly-warning ${severity}`}>
        <div className="anomaly-icon">
          {getIconForType(type)}
        </div>
        <div className="anomaly-content">
          <div className="anomaly-message">{message}</div>
          <div className="anomaly-timestamp">Detected at: {timestamp}</div>
        </div>
      </div>
    );
  };
  
  export default AnomalyWarning;