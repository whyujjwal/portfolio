import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCog, faWindowMaximize } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { setActiveApp, restoreApp } from '../../../redux/osSlice';
import './Taskbar.css';

const Taskbar = ({ openApps, toggleLauncher, launcherOpen }) => {
  const [time, setTime] = useState(getCurrentTime());
  const dispatch = useDispatch();
  
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleAppClick = (appId) => {
    const app = openApps.find(app => app.id === appId);
    
    if (app && app.isMinimized) {
      // Restore minimized app
      dispatch(restoreApp(appId));
    } else {
      // Just set as active
      dispatch(setActiveApp(appId));
    }
  };
  
  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <button className={`launcher-button ${launcherOpen ? 'active' : ''}`} onClick={toggleLauncher}>
          <FontAwesomeIcon icon={faHome} />
        </button>
        <div className="taskbar-apps">
          {openApps.map(app => (
            <button 
              key={app.id}
              className={`taskbar-app ${app.isActive ? 'active' : ''} ${app.isMinimized ? 'minimized' : ''}`}
              onClick={() => handleAppClick(app.id)}
            >
              <FontAwesomeIcon icon={app.icon || faWindowMaximize} />
              <span>{app.title || app.id.charAt(0).toUpperCase() + app.id.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="taskbar-right">
        <button className="taskbar-settings">
          <FontAwesomeIcon icon={faCog} />
        </button>
        <div className="taskbar-time">{time}</div>
      </div>
    </div>
  );
};

export default Taskbar;
