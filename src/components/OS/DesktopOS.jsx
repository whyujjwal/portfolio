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
  const openApps = useSelector(state => state.os.openApps);
  const dispatch = useDispatch();

  // Generate random stars for the background
  useEffect(() => {
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
    
    setStars(generateStars());
    
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

  return (
    <div className={`desktop-os ${loaded ? 'loaded' : ''}`}>
      {/* Animated background */}
      <div className="os-background">
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
      
      {/* Floating particles */}
      <div className="floating-particles">
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
