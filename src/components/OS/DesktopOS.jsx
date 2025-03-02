import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Desktop from './Desktop/Desktop';
import Taskbar from './Taskbar/Taskbar';
import WindowManager from './WindowManager/WindowManager';
import AppLauncher from './AppLauncher/AppLauncher';
import PaperBackground from './Background/PaperBackground';
import ErrorBoundary from '../common/ErrorBoundary';
import { openApp } from '../../redux/osSlice';
import './DesktopOS.css';
import '../../styles/PaperUI.css'; 

const DesktopOS = () => {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState('light'); // light or dark theme
  
  const openApps = useSelector(state => state.os.openApps);
  const dispatch = useDispatch();
  
  // Set system to loaded after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
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

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Handle opening apps
  const handleOpenApp = (appId) => {
    dispatch(openApp(appId));
    // Close the launcher when an app is opened
    setLauncherOpen(false);
  };

  return (
    <div className={`desktop-os paper-ui ${theme} ${loaded ? 'loaded' : ''}`}>
      {/* Paper Background with updated styling */}
      <PaperBackground theme={theme} />
      
      <div className="os-content paper-layout-content">
        {/* Desktop area with Paper UI styling */}
        <div className="desktop-workspace">
          <Desktop 
            onAppClick={handleOpenApp} 
            closeLauncher={closeLauncher} 
          />
          
          <ErrorBoundary>
            <WindowManager openApps={openApps} />
          </ErrorBoundary>
          
          {/* Paper UI styled app launcher */}
          {launcherOpen && (
            <div className="launcher-wrapper paper-card" onClick={(e) => e.stopPropagation()}>
              <AppLauncher onAppClick={handleOpenApp} />
            </div>
          )}
        </div>
      </div>
      
      {/* Updated taskbar with Paper UI styling */}
      <Taskbar 
        openApps={openApps} 
        toggleLauncher={toggleLauncher}
        launcherOpen={launcherOpen}
        toggleTheme={toggleTheme}
        theme={theme}
      />
    </div>
  );
};

export default DesktopOS;
