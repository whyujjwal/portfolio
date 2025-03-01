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
  
  // Size state for resizing
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [resizeStartData, setResizeStartData] = useState(null);

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

  // Resize functionality
  const startResize = (e, direction) => {
    if (isMaximized) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeDirection(direction);
    
    const rect = windowRef.current.getBoundingClientRect();
    setResizeStartData({
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      startLeft: rect.left,
      startTop: rect.top
    });
    
    // Activate window when starting to resize
    if (onActivate) onActivate();
  };

  const handleResize = (e) => {
    if (!isResizing || isMaximized) return;
    
    const { startX, startY, startWidth, startHeight, startLeft, startTop } = resizeStartData;
    const direction = resizeDirection;
    
    // Calculate new dimensions
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newX = position.x;
    let newY = position.y;
    
    if (direction.includes('e')) {
      newWidth = Math.max(300, startWidth + (e.clientX - startX));
    }
    if (direction.includes('s')) {
      newHeight = Math.max(200, startHeight + (e.clientY - startY));
    }
    if (direction.includes('w')) {
      const widthChange = startX - e.clientX;
      newWidth = Math.max(300, startWidth + widthChange);
      newX = Math.min(position.x - widthChange, position.x + startWidth - 300);
    }
    if (direction.includes('n')) {
      const heightChange = startY - e.clientY;
      newHeight = Math.max(200, startHeight + heightChange);
      newY = Math.min(position.y - heightChange, position.y + startHeight - 200);
    }
    
    // Update state
    setSize({ width: newWidth, height: newHeight });
    if (direction.includes('w') || direction.includes('n')) {
      setPosition({ x: newX, y: newY });
    }
  };

  const stopResize = () => {
    setIsResizing(false);
    setResizeDirection(null);
    setResizeStartData(null);
  };

  // Set up event listeners for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleDrag(e);
      }
      if (isResizing) {
        handleResize(e);
      }
    };
    
    const handleMouseUp = () => {
      stopDrag();
      stopResize();
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeDirection, resizeStartData]);
  
  useEffect(() => {
    if (titlebarRef.current) {
      titlebarRef.current.addEventListener('mousedown', startDrag);
      return () => {
        titlebarRef.current?.removeEventListener('mousedown', startDrag);
      };
    }
  }, []);
  
  // Handle window activation on click
  const handleWindowClick = () => {
    if (onActivate) onActivate();
  };
  
  if (isMinimized) return null;
  
  // Window style with position and size
  const windowStyle = isMaximized 
    ? { width: '100%', height: 'calc(100vh - 52px)', top: 0, left: 0 }
    : { 
        width: `${size.width}px`, 
        height: `${size.height}px`, 
        top: `${position.y}px`, 
        left: `${position.x}px` 
      };
  
  return (
    <div 
      ref={windowRef}
      className={`window ${isActive ? 'active' : ''} ${isMaximized ? 'maximized' : ''}`}
      style={windowStyle}
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
      
      {/* Resize handles */}
      {!isMaximized && (
        <>
          <div className="resize-handle n" onMouseDown={(e) => startResize(e, 'n')}></div>
          <div className="resize-handle e" onMouseDown={(e) => startResize(e, 'e')}></div>
          <div className="resize-handle s" onMouseDown={(e) => startResize(e, 's')}></div>
          <div className="resize-handle w" onMouseDown={(e) => startResize(e, 'w')}></div>
          <div className="resize-handle ne" onMouseDown={(e) => startResize(e, 'ne')}></div>
          <div className="resize-handle se" onMouseDown={(e) => startResize(e, 'se')}></div>
          <div className="resize-handle sw" onMouseDown={(e) => startResize(e, 'sw')}></div>
          <div className="resize-handle nw" onMouseDown={(e) => startResize(e, 'nw')}></div>
        </>
      )}
    </div>
  );
};

export default Window;
