// src/components/Entertainment.jsx
import { useState, useEffect, useRef } from 'react';
import RainAnimation from './animations/RainAnimation';

const Entertainment = () => {
  const [clickCount, setClickCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [isRaining, setIsRaining] = useState(true);
  const timeoutRef = useRef(null);
  const lastClickTimeRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // Load wooden fish image
    const woodenFishImage = new Image();
    woodenFishImage.src = "https://fish.leixf.cn/document.querySelector('#center > div.wooden-fish')";
    woodenFishImage.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = woodenFishImage.src;
      }
    };
    
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
    
    // Always increment total clicks
    setTotalClicks(prevTotal => prevTotal + 1);
    
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
    
    // Add click animation effect
    if (imageRef.current) {
      imageRef.current.classList.add('clicked');
      setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.classList.remove('clicked');
        }
      }, 300);
    }
  };

  return (
    <div className="entertainment-page">
      {isRaining ? <RainAnimation /> : null}
      
      <div className="entertainment-content">
        <h2>歡迎一起來積功德</h2>
        <p>點擊 OIIA 超過 5 次可以讓雨停！</p>
        
        <div className="wooden-fish-container" onClick={handleClick}>
          <img 
            ref={imageRef}
            className="wooden-fish"
            src="/oiia.gif"
            alt="oiia"
          />
        </div>
        
        <div className="click-counter">
          <p>總點擊次數: {totalClicks}</p>
        </div>
      </div>
    </div>
  );
};

export default Entertainment;