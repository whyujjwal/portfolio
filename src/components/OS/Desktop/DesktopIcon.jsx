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
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const iconRef = useRef(null);
  
  // Register ref for collision detection
  useEffect(() => {
    if (registerRef) {
      registerRef(id, iconRef.current);
    }
  }, [id, registerRef]);
  
  // Icon appearance when hovered
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  // Fixed dragging functionality
  const handleMouseDown = (e) => {
    if (!draggable) return;
    
    // Double click is for opening the app
    if (e.detail === 2) {
      if (onClick) onClick();
      return;
    }
    
    // Get the current position of the icon
    const rect = iconRef.current.getBoundingClientRect();
    
    // Calculate the offset from where the user clicked
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsDragging(true);
    if (onDragStart) onDragStart(id);
    
    // Prevent default to avoid text selection during drag
    e.preventDefault();
  };
  
  // Fixed mouse move handler
  const handleMouseMove = (e) => {
    if (!isDragging || !draggable) return;
    
    // Calculate new position based on mouse position and offset
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Update position through the callback
    if (onDrag) {
      onDrag(id, { x: newX, y: newY });
    }
  };
  
  const handleMouseUp = () => {
    if (isDragging && onDragEnd) {
      onDragEnd(id, position);
    }
    
    setIsDragging(false);
  };
  
  // Set up event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, id, onDrag, onDragEnd, position]);
  
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
      data-id={id} // Add data attribute for per-icon styling
    >
      <div className={`icon-container ${isHovered ? 'hovered' : ''}`}>
        <div className="icon-glow" />
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="icon-label">{name}</div>
    </div>
  );
};

export default DesktopIcon;
