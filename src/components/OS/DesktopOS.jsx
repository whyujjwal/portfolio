import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Desktop from './Desktop/Desktop';
import Taskbar from './Taskbar/Taskbar';
import WindowManager from './WindowManager/WindowManager';
import AppLauncher from './AppLauncher/AppLauncher';
import ErrorBoundary from '../common/ErrorBoundary';
import { openApp } from '../../redux/osSlice';
import './DesktopOS.css';

const DesktopOS = () => {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [stars, setStars] = useState([]);
  const [paperBits, setPaperBits] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const openApps = useSelector(state => state.os.openApps);
  const dispatch = useDispatch();

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Generate background elements
  useEffect(() => {
    // Generate stars (subtle speckles)
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: `${0.5 + Math.random() * 2}px`,
          animationDuration: `${3 + Math.random() * 10}s`
        });
      }
      return newStars;
    };
    
    // Generate floating paper bits for interactivity
    const generatePaperBits = () => {
      const bits = [];
      for (let i = 0; i < 12; i++) {
        bits.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: `${10 + Math.random() * 30}px`,
          rotation: Math.random() * 360,
          animationDuration: `${20 + Math.random() * 40}s`,
          delay: `${Math.random() * 5}s`
        });
      }
      return bits;
    };
    
    setStars(generateStars());
    setPaperBits(generatePaperBits());
    
    // Add a loading effect
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleLauncher = () => {
    setLauncherOpen(prevState => !prevState);
  };

  const handleOpenApp = (appId) => {
    dispatch(openApp(appId));
    setLauncherOpen(false);
  };

  // Calculate parallax values
  const getParallaxStyle = (depth) => {
    const maxShift = 30; // Maximum pixel shift for parallax
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate offset based on mouse position relative to center
    const offsetX = ((mousePosition.x - windowWidth / 2) / windowWidth) * maxShift * depth;
    const offsetY = ((mousePosition.y - windowHeight / 2) / windowHeight) * maxShift * depth;
    
    return {
      transform: `translate(${offsetX}px, ${offsetY}px)`
    };
  };

  return (
    <div className={`desktop-os ${loaded ? 'loaded' : ''}`}>
      {/* Animated background with parallax effects */}
      <div className="os-background" style={getParallaxStyle(0.5)}>
        {/* Star field effect */}
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDuration: star.animationDuration
            }}
          />
        ))}
      </div>
      
      {/* Interactive floating paper bits */}
      <div className="paper-bits-container">
        {paperBits.map(bit => (
          <div
            key={bit.id}
            className="paper-bit"
            style={{
              left: bit.left,
              top: bit.top,
              width: bit.size,
              height: bit.size,
              transform: `rotate(${bit.rotation}deg)`,
              animationDuration: bit.animationDuration,
              animationDelay: bit.delay
            }}
          />
        ))}
      </div>
      
      {/* Floating particles with parallax */}
      <div className="floating-particles" style={getParallaxStyle(1.2)}>
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>
      
      <div className="os-content">
        <Desktop onAppClick={handleOpenApp} />
        <ErrorBoundary>
          <WindowManager openApps={openApps} />
        </ErrorBoundary>
        {launcherOpen && <AppLauncher onAppClick={handleOpenApp} />}
      </div>
      <Taskbar 
        openApps={openApps} 
        toggleLauncher={toggleLauncher}
        launcherOpen={launcherOpen}
      />
    </div>
  );
};

export default DesktopOS;
