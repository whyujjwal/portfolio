import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DesktopIcon.css';

const DesktopIcon = ({ id, name, icon, onClick, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="desktop-icon" 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
    >
      <div className={`icon-container ${isHovered ? 'hovered' : ''}`}>
        <div className="icon-glow"></div>
        <FontAwesomeIcon icon={icon} size="2x" />
      </div>
      <div className="icon-name">{name}</div>
    </div>
  );
};

export default DesktopIcon;
