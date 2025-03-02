import React, { useState, useEffect, useRef } from 'react';
import DesktopIcon from './DesktopIcon';
import { faUser, faFolderOpen, faCode, faEnvelope, faTerminal, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import './Desktop.css';
import '../../../styles/PaperUI.css';

// Initial positions for desktop icons
const initialIconPositions = {
  about: { x: 30, y: 30 },
  projects: { x: 30, y: 140 },
  skills: { x: 30, y: 250 },
  contact: { x: 30, y: 360 },
  github: { x: 130, y: 30 },
  browser: { x: 130, y: 140 },
  terminal: { x: 130, y: 250 }
};

// Update icon dimensions for collision detection
const ICON_WIDTH = 60; // Update to new width without label
const ICON_HEIGHT = 60; // Update to new height without label
const MIN_SPACING = 8; // Keep minimum spacing

const Desktop = ({ onAppClick, closeLauncher }) => {
  const [iconPositions, setIconPositions] = useState(() => {
    // Load from localStorage or use initial positions
    const savedPositions = localStorage.getItem('desktopIconPositions');
    try {
      return savedPositions ? JSON.parse(savedPositions) : initialIconPositions;
    } catch (e) {
      console.error("Error parsing saved positions", e);
      return initialIconPositions;
    }
  });
  
  // Track the icon being dragged and its original position
  const [dragInfo, setDragInfo] = useState({
    isDragging: false,
    iconId: null,
    originalPosition: null
  });
  
  // Ref to store icon elements
  const iconRefs = useRef({});
  const desktopRef = useRef(null);
  
  // Save positions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('desktopIconPositions', JSON.stringify(iconPositions));
  }, [iconPositions]);
  
  // Handle desktop click outside of icons to close launcher
  const handleDesktopClick = (e) => {
    // If clicking directly on the desktop (not on an icon)
    if (e.target.classList.contains('desktop') || e.target.classList.contains('desktop-area')) {
      closeLauncher();
    }
  };
  
  // Fixed register icon ref for collision detection
  const registerIconRef = (id, element) => {
    if (element) {
      iconRefs.current[id] = element;
    }
  };
  
  // Simplified collision detection
  const checkForCollision = (id, newPosition) => {
    // Get desktop bounds
    const desktopRect = desktopRef.current?.getBoundingClientRect();
    if (!desktopRect) return true;
    
    // Check if icon is outside desktop area
    if (
      newPosition.x < 10 || 
      newPosition.y < 10 || 
      newPosition.x > desktopRect.width - ICON_WIDTH - 10 || 
      newPosition.y > desktopRect.height - ICON_HEIGHT - 10
    ) {
      return true;
    }
    
    // Create a rect for the new position with updated dimensions
    const newRect = {
      left: newPosition.x,
      top: newPosition.y,
      right: newPosition.x + ICON_WIDTH,
      bottom: newPosition.y + ICON_HEIGHT
    };
    
    // Check against all other icons
    for (const otherId in iconPositions) {
      if (otherId === id) continue; // Skip self
      
      const otherPos = iconPositions[otherId];
      
      // Calculate other icon rect
      const otherRect = {
        left: otherPos.x,
        top: otherPos.y,
        right: otherPos.x + ICON_WIDTH,
        bottom: otherPos.y + ICON_HEIGHT
      };
      
      // Check for overlap with spacing
      if (!(newRect.right + MIN_SPACING <= otherRect.left || 
            newRect.left - MIN_SPACING >= otherRect.right || 
            newRect.bottom + MIN_SPACING <= otherRect.top || 
            newRect.top - MIN_SPACING >= otherRect.bottom)) {
        return true; // Collision detected
      }
    }
    
    return false; // No collision
  };

  // Fixed drag start handler
  const handleStartDrag = (id) => {
    setDragInfo({
      isDragging: true,
      iconId: id,
      originalPosition: {...iconPositions[id]}
    });
  };
  
  // Fixed drag handler - update position immediately
  const handleIconDrag = (id, position) => {
    setIconPositions(prev => ({
      ...prev,
      [id]: {
        x: Math.round(position.x),
        y: Math.round(position.y)
      }
    }));
  };
  
  // Fixed drag end handler
  const handleDragEnd = (id, finalPosition) => {
    // Check for collisions only on drop
    if (checkForCollision(id, finalPosition)) {
      // Restore original position with animation
      setIconPositions(prev => ({
        ...prev,
        [id]: dragInfo.originalPosition
      }));
      
      // Visual feedback
      const iconElement = iconRefs.current[id];
      if (iconElement) {
        iconElement.classList.add('collision-animation');
        setTimeout(() => {
          iconElement.classList.remove('collision-animation');
        }, 500);
      }
    }
    
    // Reset drag info
    setDragInfo({
      isDragging: false,
      iconId: null,
      originalPosition: null
    });
  };

  // Reset icon positions if they're in a bad state
  const resetPositions = () => {
    setIconPositions(initialIconPositions);
    localStorage.setItem('desktopIconPositions', JSON.stringify(initialIconPositions));
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
      <div className="desktop" ref={desktopRef}>
        {desktopApps.map((app, index) => (
          <DesktopIcon 
            key={app.id}
            id={app.id}
            name={app.name}
            icon={app.icon} 
            onClick={() => onAppClick(app.id)}
            position={iconPositions[app.id]}
            onDrag={handleIconDrag}
            onDragStart={handleStartDrag}
            onDragEnd={handleDragEnd}
            draggable={true}
            registerRef={registerIconRef}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Desktop;
