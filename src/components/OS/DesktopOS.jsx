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

  // Initialize background elements and track mouse for parallax
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

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Function to toggle the launcher
  const toggleLauncher = () => {
    setLauncherOpen(prevState => !prevState);
  };

  // Function to explicitly close the launcher
  const closeLauncher = () => {
    if (launcherOpen) {
      setLauncherOpen(false);
    }
  };

  // Handle opening apps
  const handleOpenApp = (appId) => {
    dispatch(openApp(appId));
    // Close the launcher when an app is opened
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
      {/* Background elements with parallax */}
      <div className="os-background" style={getParallaxStyle(0.5)}>
        {/* Stars and paper bits */}
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
      
      {/* Desktop content area */}
      <div className="os-content">
        <Desktop 
          onAppClick={handleOpenApp} 
          closeLauncher={closeLauncher} 
        />
        <ErrorBoundary>
          <WindowManager openApps={openApps} />
        </ErrorBoundary>
        {launcherOpen && (
          <div className="launcher-container" onClick={(e) => e.stopPropagation()}>
            <AppLauncher onAppClick={handleOpenApp} />
          </div>
        )}
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
