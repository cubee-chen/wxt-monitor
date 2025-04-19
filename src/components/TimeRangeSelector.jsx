// src/components/TimeRangeSelector.jsx

const TimeRangeSelector = ({ selectedRange, onChange }) => {
    const ranges = [
      { value: '24h', label: '過去 24 小時' },
      { value: '3d', label: '過去 3 天' },
      { value: '1w', label: '過去 1 週' },
      { value: '1m', label: '過去 1 個月' }
    ];
  
    return (
      <div className="time-range-selector">
        <span className="selector-label">選擇的時段區間：</span>
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