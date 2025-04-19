// src/components/TimeRangeSelector.jsx

const TimeRangeSelector = ({ selectedRange, onChange }) => {
    const ranges = [
      { value: '24h', label: 'Last 24 Hours' },
      { value: '3d', label: 'Last 3 Days' },
      { value: '1w', label: 'Last Week' },
      { value: '1m', label: 'Last Month' }
    ];
  
    return (
      <div className="time-range-selector">
        <span className="selector-label">Time Range:</span>
        <div className="selector-buttons">
          {ranges.map(range => (
            <button
              key={range.value}
              className={`range-button ${selectedRange === range.value ? 'active' : ''}`}
              onClick={() => onChange(range.value)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default TimeRangeSelector;