import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoon, faSun, faCog, faBell, 
  faVolumeUp, faSearch, faWifi, faBatteryThreeQuarters, faCode, faVolumeMute
} from '@fortawesome/free-solid-svg-icons';
import { faWindows } from '@fortawesome/free-brands-svg-icons';
import Clock from './Clock';
import TaskbarItem from './TaskbarItem';
import './Taskbar.css';
import '../../../styles/PaperUI.css';

const Taskbar = ({ 
  openApps, 
  toggleLauncher, 
  launcherOpen, 
  toggleTheme, 
  theme 
}) => {
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [volume, setVolume] = useState(75);
  const quickSettingsRef = useRef(null);
  const notificationsRef = useRef(null);
  
  // Handle outside clicks to close panels
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (quickSettingsRef.current && !quickSettingsRef.current.contains(e.target)) {
        setQuickSettingsOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle settings panel
  const handleSettingsToggle = (e) => {
    e.stopPropagation();
    setQuickSettingsOpen(!quickSettingsOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };
  
  // Toggle notifications panel
  const handleNotificationsToggle = (e) => {
    e.stopPropagation();
    setNotificationsOpen(!notificationsOpen);
    if (quickSettingsOpen) setQuickSettingsOpen(false);
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    
    // Update custom property for slider gradient
    e.target.style.setProperty('--volume-percent', `${newVolume}%`);
  };
  
  // Toggle search
  const handleSearchToggle = () => {
    setSearchActive(!searchActive);
  };
  
  // Get current date for notifications
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="taskbar">
      {/* Start button */}
      <button 
        className={`taskbar-button start-button ${launcherOpen ? 'active' : ''}`} 
        onClick={toggleLauncher}
        title="Open App Launcher"
      >
        <FontAwesomeIcon icon={faWindows} />
      </button>
      
      {/* Search button/bar */}
      <div className={`taskbar-search ${searchActive ? 'active' : ''}`}>
        <button 
          className="taskbar-button search-button"
          onClick={handleSearchToggle}
          title="Search"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        
        {searchActive && (
          <input 
            type="text" 
            className="search-input" 
            placeholder="Type to search..." 
            autoFocus 
          />
        )}
      </div>
      
      {/* Taskbar apps with proper container */}
      <div className="taskbar-items">
        {openApps && openApps.length > 0 ? (
          openApps.map(app => (
            <TaskbarItem 
              key={app.id} 
              app={app}
            />
          ))
        ) : (
          <div className="taskbar-empty-message">No open apps</div>
        )}
      </div>
      
      {/* Flexible spacer to push items to edges */}
      <div className="taskbar-spacer"></div>
      
      {/* Right side controls */}
      <div className="taskbar-right">
        {/* Notifications */}
        <div className="taskbar-control" ref={notificationsRef}>
          <button 
            className={`taskbar-button ${notificationsOpen ? 'active' : ''}`}
            onClick={handleNotificationsToggle}
            title="Notifications"
          >
            <FontAwesomeIcon icon={faBell} />
            <span className="notification-dot"></span>
          </button>
          {/* Notification panel */}
          {notificationsOpen && (
            <div className="notifications-panel">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <p>{currentDate}</p>
              </div>
              <div className="notifications-content">
                <div className="notification-item" style={{animationDelay: '0.05s'}}>
                  <div className="notification-icon">
                    <FontAwesomeIcon icon={faWindows} />
                  </div>
                  <div className="notification-text">
                    <p className="notification-title">Welcome to Paper OS</p>
                    <p className="notification-message">Click on app icons to launch them.</p>
                    <p className="notification-time">Just now</p>
                  </div>
                </div>
                
                <div className="notification-item" style={{animationDelay: '0.1s'}}>
                  <div className="notification-icon">
                    <FontAwesomeIcon icon={faCode} />
                  </div>
                  <div className="notification-text">
                    <p className="notification-title">Portfolio Ready</p>
                    <p className="notification-message">Your portfolio is ready to explore.</p>
                    <p className="notification-time">5 minutes ago</p>
                  </div>
                </div>
              </div>
              <div className="notifications-footer">
                <button className="paper-button">Clear all</button>
              </div>
            </div>
          )}
        </div>
        
        {/* Settings */}
        <div className="taskbar-control" ref={quickSettingsRef}>
          <button 
            className={`taskbar-button ${quickSettingsOpen ? 'active' : ''}`}
            onClick={handleSettingsToggle}
            title="Settings"
          >
            <FontAwesomeIcon icon={faCog} />
          </button>
          {/* Quick settings panel */}
          {quickSettingsOpen && (
            <div className="quick-settings-panel">
              <div className="quick-settings-header">
                <h3>Quick Settings</h3>
              </div>
              <div className="quick-settings-content">
                {/* Theme toggle */}
                <div className="quick-settings-row">
                  <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                  <button 
                    className={`paper-toggle ${theme === 'dark' ? 'active' : ''}`}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                  >
                  </button>
                </div>
                
                {/* Volume slider */}
                <div className="quick-settings-row">
                  <span>Volume</span>
                  <div className="volume-control">
                    <FontAwesomeIcon icon={volume === 0 ? faVolumeMute : faVolumeUp} />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume} 
                      onChange={handleVolumeChange}
                      className="volume-slider"
                      style={{'--volume-percent': `${volume}%`}}
                    />
                    <span className="volume-value">{volume}%</span>
                  </div>
                </div>
                
                {/* Wi-Fi toggle */}
                <div className="quick-settings-row">
                  <span>Wi-Fi</span>
                  <button className="paper-toggle active">
                  </button>
                </div>
                
                {/* Battery status */}
                <div className="quick-settings-row">
                  <span>Battery</span>
                  <div className="battery-status">
                    <FontAwesomeIcon icon={faBatteryThreeQuarters} />
                    <span>75%</span>
                  </div>
                </div>
              </div>
              <div className="quick-settings-footer">
                <button className="paper-button">Open Settings</button>
              </div>
            </div>
          )}
        </div>
        
        {/* Theme toggle */}
        <button 
          className="taskbar-button theme-toggle" 
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
        </button>
        
        {/* Clock */}
        <Clock />
      </div>
    </div>
  );
};

export default Taskbar;
