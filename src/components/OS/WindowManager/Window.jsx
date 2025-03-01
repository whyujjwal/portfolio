import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowMaximize, faWindowRestore, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { minimizeApp } from '../../../redux/osSlice';
import './Window.css';

const Window = ({ id, title, children, onClose, isActive, isMinimized, initialPosition, onActivate }) => {
  const dispatch = useDispatch();
  const windowRef = useRef(null);
  const titlebarRef = useRef(null);
  
  // Initialize position state from props or default
  const [position, setPosition] = useState({
    x: initialPosition?.x || 100,
    y: initialPosition?.y || 100
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Log to help debug
  useEffect(() => {
    console.log(`Window ${id} mounted with position:`, position);
    
    // Add window dimension debug info
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      console.log(`Window ${id} dimensions:`, rect);
    }
  }, []);

  // Window control functions
  const handleMaximize = (e) => {
    e.stopPropagation();
    setIsMaximized(!isMaximized);
  };
  
  const handleMinimize = (e) => {
    e.stopPropagation();
    dispatch(minimizeApp(id));
  };

  // Simple manual drag implementation
  const startDrag = (e) => {
    // Ignore if clicking on controls or when maximized
    if (e.target.closest('.window-controls') || isMaximized) return;
    
    setIsDragging(true);
    const windowRect = windowRef.current.getBoundingClientRect();
    
    setDragOffset({
      x: e.clientX - windowRect.left,
      y: e.clientY - windowRect.top
    });
    
    // Activate window when starting to drag
    if (onActivate) onActivate();
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  const handleDrag = (e) => {
    if (!isDragging || isMaximized) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Update position
    setPosition({
      x: newX,
      y: newY
    });
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  // Set up event listeners for manual dragging
  useEffect(() => {
    if (!titlebarRef.current) return;
    
    const titlebar = titlebarRef.current;
    titlebar.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    
    // Cleanup event listeners
    return () => {
      titlebar.removeEventListener('mousedown', startDrag);
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
    };
  }, [isDragging, dragOffset, isMaximized]);
  
  // Handle window click to activate
  const handleWindowClick = () => {
    if (onActivate) onActivate();
  };
  
  if (isMinimized) return null;
  
  // Position styles for the window
  const windowStyles = isMaximized 
    ? { width: '100%', height: 'calc(100vh - 48px)', top: 0, left: 0 }
    : { 
        width: '600px', 
        height: '400px', 
        top: `${position.y}px`, 
        left: `${position.x}px` 
      };
  
  return (
    <div 
      ref={windowRef}
      className={`window ${isActive ? 'active' : ''} ${isMaximized ? 'maximized' : ''}`}
      style={windowStyles}
      onClick={handleWindowClick}
    >
      <div ref={titlebarRef} className="window-titlebar">
        <div className="window-title">{title}</div>
        <div className="window-controls">
          <button className="window-btn minimize" onClick={handleMinimize}>
            <FontAwesomeIcon icon={faWindowMinimize} />
          </button>
          <button className="window-btn maximize" onClick={handleMaximize}>
            <FontAwesomeIcon icon={isMaximized ? faWindowRestore : faWindowMaximize} />
          </button>
          <button className="window-btn close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};

export default Window;
