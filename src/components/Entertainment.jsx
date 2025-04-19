// src/components/Entertainment.jsx
import { useState, useEffect, useRef } from 'react';
import RainAnimation from './animations/RainAnimation';
import SunshineAnimation from './animations/SunshineAnimation';
import ClickTimeChart from './ClickTimeChart';

const Entertainment = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showSunshine, setShowSunshine] = useState(false);
  const [clickHistory, setClickHistory] = useState([]);
  const buttonRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastClickTimeRef = useRef(null);

  useEffect(() => {
    // Clear timeout on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    const currentTime = new Date();
    
    // Check if this is a consecutive click (within 3 seconds)
    const isConsecutive = lastClickTimeRef.current && 
      (currentTime - lastClickTimeRef.current) < 3000;
    
    // Reset click count if not consecutive
    if (!isConsecutive && clickCount !== 0) {
      setClickCount(0);
    } else {
      // Increment click count
      setClickCount(prevCount => prevCount + 1);
    }
    
    // Record this click in history
    const newClickEvent = {
      time: currentTime,
      count: clickHistory.length + 1
    };
    setClickHistory(prev => [...prev, newClickEvent]);
    
    // Update last click time
    lastClickTimeRef.current = currentTime;

    // Check if we've reached 10 consecutive clicks
    if (clickCount + 1 >= 10) {
      setShowSunshine(true);
      setClickCount(0); // Reset click count
      
      // Set timeout to return to rain after 25 seconds
      timeoutRef.current = setTimeout(() => {
        setShowSunshine(false);
      }, 25000);
    }
  };

  return (
    <div className="entertainment-page">
      {showSunshine ? <SunshineAnimation /> : <RainAnimation />}
      
      <div className="entertainment-content">
        <h2>Weather Magic</h2>
        <p>Click the button 10 times in a row to change the weather!</p>
        
        <button 
          ref={buttonRef}
          className="weather-button"
          onClick={handleClick}
        >
          {showSunshine ? "☀️ Enjoying Sunshine!" : "🌧️ Make it Sunny!"}
        </button>
        
        <div className="click-counter">
          {clickCount > 0 && <p>Consecutive Clicks: {clickCount} / 10</p>}
        </div>
        
        <div className="click-chart-container">
          <h3>Click History</h3>
          <ClickTimeChart clickHistory={clickHistory} />
        </div>
      </div>
    </div>
  );
};

export default Entertainment;