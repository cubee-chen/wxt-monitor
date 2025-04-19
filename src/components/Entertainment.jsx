// src/components/Entertainment.jsx
import { useState, useEffect, useRef } from 'react';
import RainAnimation from './animations/RainAnimation';

const Entertainment = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isRaining, setIsRaining] = useState(true);
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
    
    // Create ripple effect on button
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    buttonRef.current.appendChild(ripple);
    
    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${currentTime.clientX - rect.left - size/2}px`;
    ripple.style.top = `${currentTime.clientY - rect.top - size/2}px`;
    
    // Remove the ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
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
    
    // Update last click time
    lastClickTimeRef.current = currentTime;

    // Check if we've reached 5 consecutive clicks
    if (clickCount + 1 >= 5) {
      setIsRaining(false);
      setClickCount(0); // Reset click count
      
      // Set timeout to return to rain after 25 seconds
      timeoutRef.current = setTimeout(() => {
        setIsRaining(true);
      }, 25000);
    }
  };

  return (
    <div className="entertainment-page">
      {isRaining ? <RainAnimation /> : null}
      
      <div className="entertainment-content">
        <h2>Weather Magic</h2>
        <p>Click the button 5 times in a row to stop the rain!</p>
        
        <button 
          ref={buttonRef}
          className="weather-button"
          onClick={handleClick}
        >
          {!isRaining ? "🌤️ Enjoying Clear Weather!" : "🌧️ Stop the Rain!"}
        </button>
        
        <div className="click-counter">
          {clickCount > 0 && <p>Consecutive Clicks: {clickCount} / 5</p>}
        </div>
      </div>
    </div>
  );
};

export default Entertainment;