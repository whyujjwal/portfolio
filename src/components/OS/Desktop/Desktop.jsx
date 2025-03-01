import React, { useState, useEffect } from 'react';
import DesktopIcon from './DesktopIcon';
import { faUser, faFolderOpen, faCode, faEnvelope, faTerminal, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import './Desktop.css';

// Update initial positions for desktop icons - closer together since no text labels
const initialIconPositions = {
  about: { x: 20, y: 20 },
  projects: { x: 20, y: 100 }, // Reduced vertical spacing
  skills: { x: 20, y: 180 },
  contact: { x: 20, y: 260 },
  github: { x: 20, y: 340 },
  browser: { x: 20, y: 420 },
  terminal: { x: 20, y: 500 }
};

const Desktop = ({ onAppClick, closeLauncher }) => {
  const [iconPositions, setIconPositions] = useState(() => {
    // Load from localStorage or use initial positions
    const savedPositions = localStorage.getItem('desktopIconPositions');
    return savedPositions ? JSON.parse(savedPositions) : initialIconPositions;
  });
  
  // Save positions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('desktopIconPositions', JSON.stringify(iconPositions));
  }, [iconPositions]);
  
  // Handle desktop click outside of icons to close launcher
  const handleDesktopClick = (e) => {
    // If clicking directly on the desktop (not on an icon or app launcher)
    if (e.target.classList.contains('desktop') || e.target.classList.contains('desktop-area')) {
      closeLauncher();
    }
  };
  
  // Handle icon drag
  const handleIconDrag = (id, position) => {
    setIconPositions(prev => ({
      ...prev,
      [id]: position
    }));
  };

  const desktopApps = [
    { id: 'about', name: 'About Me', icon: faUser },
    { id: 'projects', name: 'Projects', icon: faFolderOpen },
    { id: 'skills', name: 'Skills', icon: faCode },
    { id: 'contact', name: 'Contact', icon: faEnvelope },
    { id: 'github', name: 'GitHub', icon: faGithub },
    { id: 'browser', name: 'Browser', icon: faGlobe },
    { id: 'terminal', name: 'Terminal', icon: faTerminal },
  ];

  return (
    <div className="desktop-area" onClick={handleDesktopClick}>
      <div className="desktop">
        {desktopApps.map((app, index) => (
          <DesktopIcon 
            key={app.id}
            id={app.id}
            name={app.name}
            icon={app.icon} 
            onClick={() => onAppClick(app.id)}
            position={iconPositions[app.id]}
            onDrag={handleIconDrag}
            draggable={true}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Desktop;
