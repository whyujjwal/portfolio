import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Desktop from './Desktop/Desktop';
import Taskbar from './Taskbar/Taskbar';
import WindowManager from './WindowManager/WindowManager';
import AppLauncher from './AppLauncher/AppLauncher';
import ParticleBackground from './Desktop/ParticleBackground';
import ErrorBoundary from '../common/ErrorBoundary';
import { openApp } from '../../redux/osSlice';
import './DesktopOS.css';

const DesktopOS = () => {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const openApps = useSelector(state => state.os.openApps);
  const dispatch = useDispatch();

  useEffect(() => {
    // Add a loading effect
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 500);
    
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
      <ParticleBackground />
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
