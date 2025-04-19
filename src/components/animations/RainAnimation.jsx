// src/components/animations/RainAnimation.jsx
import { useEffect, useRef } from 'react';

const RainAnimation = () => {
  const canvasRef = useRef(null);
  const raindrops = useRef([]);
  const splashes = useRef([]);
  
  // Initialize rain animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const updateCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initial setup
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    
    // Raindrop class
    class Raindrop {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -100;
        this.length = Math.random() * 20 + 10;
        this.speed = Math.random() * 10 + 5;
      }
      
      update() {
        this.y += this.speed;
        
        // Create splash when raindrop hits bottom
        if (this.y > canvas.height) {
          // Create a splash
          splashes.current.push(new Splash(this.x, canvas.height));
          
          // Reset raindrop
          this.y = Math.random() * -100;
          this.x = Math.random() * canvas.width;
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    
    // Splash class
    class Splash {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.maxRadius = Math.random() * 5 + 3;
        this.speed = Math.random() * 0.5 + 0.2;
        this.opacity = 1;
        this.fadeSpeed = Math.random() * 0.05 + 0.02;
      }
      
      update() {
        this.radius += this.speed;
        this.opacity -= this.fadeSpeed;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(174, 194, 224, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    
    // Initialize raindrops
    const dropCount = 200;
    for (let i = 0; i < dropCount; i++) {
      raindrops.current.push(new Raindrop());
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update raindrops
      raindrops.current.forEach(drop => {
        drop.update();
        drop.draw();
      });
      
      // Draw and update splashes
      splashes.current = splashes.current.filter(splash => {
        if (splash.opacity <= 0 || splash.radius >= splash.maxRadius) {
          return false;
        }
        splash.update();
        splash.draw();
        return true;
      });
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    const animationId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="weather-animation-canvas"
    />
  );
};

export default RainAnimation;