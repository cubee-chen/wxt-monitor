// src/components/animations/SunshineAnimation.jsx
import { useEffect, useRef } from 'react';

const SunshineAnimation = () => {
  const canvasRef = useRef(null);
  const sunRays = useRef([]);
  const clouds = useRef([]);
  
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
    
    // Calculate sun position
    const sunX = canvas.width * 0.75;
    const sunY = canvas.height * 0.3;
    const sunRadius = Math.min(canvas.width, canvas.height) * 0.1;
    
    // Sun ray class
    class SunRay {
      constructor(angle) {
        this.angle = angle;
        this.length = sunRadius * 0.8;
        this.maxLength = sunRadius * 2;
        this.growing = true;
        this.growSpeed = Math.random() * 0.5 + 0.5;
      }
      
      update() {
        if (this.growing) {
          this.length += this.growSpeed;
          if (this.length >= this.maxLength) {
            this.growing = false;
          }
        } else {
          this.length -= this.growSpeed;
          if (this.length <= sunRadius * 0.8) {
            this.growing = true;
          }
        }
      }
      
      draw() {
        const startX = sunX + Math.cos(this.angle) * sunRadius;
        const startY = sunY + Math.sin(this.angle) * sunRadius;
        const endX = sunX + Math.cos(this.angle) * (sunRadius + this.length);
        const endY = sunY + Math.sin(this.angle) * (sunRadius + this.length);
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'rgba(255, 180, 0, 0.6)';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }
    
    // Cloud class
    class Cloud {
      constructor() {
        this.x = Math.random() * canvas.width * 2 - canvas.width;
        this.y = Math.random() * (canvas.height * 0.6);
        this.width = Math.random() * 150 + 100;
        this.speed = Math.random() * 0.2 + 0.1;
        this.circles = [];
        
        // Generate circles for the cloud
        const circleCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < circleCount; i++) {
          this.circles.push({
            x: Math.random() * (this.width * 0.8),
            y: Math.random() * 20 - 10,
            radius: Math.random() * 30 + 20
          });
        }
      }
      
      update() {
        this.x += this.speed;
        if (this.x > canvas.width + this.width) {
          this.x = -this.width;
        }
      }
      
      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Draw each circle of the cloud
        this.circles.forEach(circle => {
          ctx.beginPath();
          ctx.arc(this.x + circle.x, this.y + circle.y, circle.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }
    
    // Initialize sun rays
    const rayCount = 12;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      sunRays.current.push(new SunRay(angle));
    }
    
    // Initialize clouds
    const cloudCount = 5;
    for (let i = 0; i < cloudCount; i++) {
      clouds.current.push(new Cloud());
    }
    
    // Animation loop
    const animate = () => {
      // Clear canvas with a bright blue sky
      ctx.fillStyle = 'rgb(135, 206, 235)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw sun
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 1)';
      ctx.fill();
      
      // Draw sun rays
      sunRays.current.forEach(ray => {
        ray.update();
        ray.draw();
      });
      
      // Draw clouds
      clouds.current.forEach(cloud => {
        cloud.update();
        cloud.draw();
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

export default SunshineAnimation;