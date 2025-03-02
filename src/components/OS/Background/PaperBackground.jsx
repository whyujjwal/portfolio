import React, { useEffect, useRef } from 'react';
import './PaperBackground.css';

const PaperBackground = ({ theme = 'light' }) => {
  const canvasRef = useRef(null);
  const isDarkTheme = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Setup animation frame
    let animationFrameId;
    let particles = [];
    
    // Create initial particles
    const createParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor((width * height) / 25000), 50);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          vx: Math.random() * 0.2 - 0.1,
          vy: Math.random() * 0.2 - 0.1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };
    
    // Create gradients based on theme
    const createBackgroundGradient = () => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      
      if (isDarkTheme) {
        // Dark theme gradient
        gradient.addColorStop(0, '#2a2722');
        gradient.addColorStop(0.5, '#232225');
        gradient.addColorStop(1, '#1e1d20');
      } else {
        // Light theme gradient
        gradient.addColorStop(0, '#f3f0eb');
        gradient.addColorStop(1, '#e8e1d5');
      }
      
      return gradient;
    };
    
    // Draw subtle grid
    const drawGrid = () => {
      const gridSize = 30;
      const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
      
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      
      // Draw vertical lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };
    
    // Draw subtle shapes
    const drawShapes = () => {
      // Abstract shapes - circles with gradients
      const shapes = [
        { x: width * 0.8, y: height * 0.2, size: 180 },
        { x: width * 0.2, y: height * 0.6, size: 220 },
        { x: width * 0.6, y: height * 0.8, size: 150 }
      ];
      
      shapes.forEach(shape => {
        const gradient = ctx.createRadialGradient(
          shape.x, shape.y, 0,
          shape.x, shape.y, shape.size
        );
        
        if (isDarkTheme) {
          gradient.addColorStop(0, 'rgba(80, 75, 85, 0.15)');
          gradient.addColorStop(0.5, 'rgba(60, 55, 65, 0.1)');
          gradient.addColorStop(1, 'rgba(40, 35, 45, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    
    // Draw and animate particles
    const drawParticles = () => {
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        if (isDarkTheme) {
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.3})`;
        } else {
          ctx.fillStyle = `rgba(0, 0, 0, ${particle.opacity * 0.15})`;
        }
        
        ctx.fill();
        
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      });
    };
    
    // Apply texture overlay
    const applyTexture = () => {
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
    };
    
    // Main draw function
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background gradient
      ctx.fillStyle = createBackgroundGradient();
      ctx.fillRect(0, 0, width, height);
      
      // Draw elements
      drawGrid();
      drawShapes();
      drawParticles();
      applyTexture();
      
      // Add vignette effect
      ctx.fillStyle = isDarkTheme ? 
        'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.5) 100%)' : 
        'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.2) 100%)';
      
      animationFrameId = window.requestAnimationFrame(draw);
    };
    
    // Handle window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
      draw();
    };
    
    // Initialize and start animation
    createParticles();
    draw();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, isDarkTheme]);
  
  return (
    <div className={`paper-background ${isDarkTheme ? 'dark' : 'light'}`}>
      <canvas ref={canvasRef} className="paper-canvas" />
      <div className="paper-texture-overlay"></div>
      <div className="paper-vignette"></div>
    </div>
  );
};

export default PaperBackground;
