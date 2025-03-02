import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { faWindows } from '@fortawesome/free-brands-svg-icons'; // Fix: Import faWindows from brands package
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
  return (
    <div className="taskbar">
      <button 
        className={`taskbar-button start-button ${launcherOpen ? 'active' : ''}`} 
        onClick={toggleLauncher}
        title="Open App Launcher"
      >
        <FontAwesomeIcon icon={faWindows} />
      </button>
      
      <div className="taskbar-items">
        {openApps.map(app => (
          <TaskbarItem 
            key={app.id} 
            app={app}
            className="taskbar-button"
          />
        ))}
      </div>
      
      <div className="taskbar-right">
        <button 
          className="taskbar-button theme-toggle" 
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
        </button>
        <Clock />
      </div>
    </div>
  );
};

export default Taskbar;
