import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DesktopIcon.css';

const DesktopIcon = ({ 
  id, 
  name, 
  icon, 
  onClick, 
  position, 
  onDrag, 
  onDragStart, 
  onDragEnd,
  draggable = true, 
  registerRef,
  style
}) => {
  // ... existing state and refs ...

  return (
    <div 
      ref={iconRef}
      className={`desktop-icon ${isDragging ? 'dragging' : ''}`}
      style={{
        ...style,
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      data-id={id}
      title={name} // Add title for tooltip on hover
    >
      <div className={`icon-container ${isHovered ? 'hovered' : ''}`}>
        <div className="icon-glow" />
        <FontAwesomeIcon icon={icon} />
      </div>
      {/* Remove the label element completely */}
    </div>
  );
};

export default DesktopIcon;
