import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowMaximize, faWindowRestore, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { minimizeApp } from '../../../redux/osSlice';
import './Window.css';

const Window = ({ id, title, children, onClose, isActive, isMinimized, initialPosition, onActivate }) => {
  const [position, setPosition] = useState(initialPosition || { x: 50, y: 50 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [focusTimestamp, setFocusTimestamp] = useState(Date.now());
  
  const windowRef = useRef(null);
  const titlebarRef = useRef(null);
  const dispatch = useDispatch();
  
  // Minimum window dimensions
  const MIN_WIDTH = 300;
  const MIN_HEIGHT = 200;
  
  // Window click/focus handler with subtle animation
  const handleWindowClick = () => {
    if (onActivate) {
      setFocusTimestamp(Date.now());
      onActivate();
    }
  };
  
  // Maximize/restore window with smooth animation
  const handleMaximize = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsMaximized(!isMaximized);
      setTimeout(() => {
        setIsAnimating(false);
      }, 250);
    }, 10);
  };
  
  // Minimize window with animation
  const handleMinimize = () => {
    setIsAnimating(true);
    windowRef.current.style.animation = 'windowClose 0.25s cubic-bezier(0.19, 1, 0.22, 1) forwards';
    setTimeout(() => {
      dispatch(minimizeApp(id));
      setIsAnimating(false);
      windowRef.current.style.animation = '';
    }, 250);
  };
  
  // ========== DRAGGING FUNCTIONALITY ==========
  
  const handleMouseDown = (e) => {
    if (!titlebarRef.current || !titlebarRef.current.contains(e.target) || isMaximized) return;
    
    // Don't start dragging if we clicked on a button
    if (e.target.closest('.window-btn')) return;
    
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    windowRef.current.classList.add('dragging');
    
    // Ensure window is active when starting to drag
    if (onActivate) onActivate();
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Ensure window stays within viewport with some margin
    const maxX = window.innerWidth - size.width;
    const maxY = window.innerHeight - size.height;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };
  
  const handleMouseUp = () => {
    if (isDragging) {
      windowRef.current.classList.remove('dragging');
    }
    setIsDragging(false);
  };
  
  // ========== RESIZING FUNCTIONALITY ==========
  
  const handleResizeStart = (direction, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const rect = windowRef.current.getBoundingClientRect();
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setResizeStartSize({ width: rect.width, height: rect.height });
    setResizeDirection(direction);
    setIsResizing(true);
    windowRef.current.classList.add('resizing');
    
    // Ensure window is active when starting to resize
    if (onActivate) onActivate();
  };
  
  // Rest of resizing functionality remains the same
  const handleResizeMove = (e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStartPos.x;
    const deltaY = e.clientY - resizeStartPos.y;
    
    const direction = resizeDirection;
    let newWidth = resizeStartSize.width;
    let newHeight = resizeStartSize.height;
    let newX = position.x;
    let newY = position.y;
    
    // Width adjustments
    if (direction.includes('e')) {
      newWidth = Math.max(resizeStartSize.width + deltaX, MIN_WIDTH);
    } else if (direction.includes('w')) {
      const maxLeftResize = resizeStartSize.width - MIN_WIDTH;
      const actualDelta = Math.max(-maxLeftResize, Math.min(deltaX, resizeStartSize.width));
      newWidth = resizeStartSize.width - actualDelta;
      newX = position.x + actualDelta;
    }
    
    // Height adjustments
    if (direction.includes('s')) {
      newHeight = Math.max(resizeStartSize.height + deltaY, MIN_HEIGHT);
    } else if (direction.includes('n')) {
      const maxTopResize = resizeStartSize.height - MIN_HEIGHT;
      const actualDelta = Math.max(-maxTopResize, Math.min(deltaY, resizeStartSize.height));
      newHeight = resizeStartSize.height - actualDelta;
      newY = position.y + actualDelta;
    }
    
    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
  };
  
  const handleResizeEnd = () => {
    if (isResizing) {
      windowRef.current.classList.remove('resizing');
    }
    setIsResizing(false);
  };
  
  // Add event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
    } else {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, resizeDirection]);
  
  // Helper function to get window style based on state
  const getWindowStyle = () => {
    if (isMaximized) {
      return { width: '100%', height: '100%' };
    }
    
    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${size.width}px`,
      height: `${size.height}px`,
      display: isMinimized ? 'none' : 'flex',
      zIndex: isActive ? 100 + focusTimestamp % 10 : 10, // Ensures proper stacking
    };
  };
  
  return (
    <div 
      ref={windowRef}
      className={`window
        ${isActive ? 'active' : ''} 
        ${isMaximized ? 'maximized' : ''} 
        ${isAnimating ? 'animating' : ''}
        app-${id}
      `}
      style={getWindowStyle()}
      onClick={handleWindowClick}
    >
      <div ref={titlebarRef} className="window-titlebar" onMouseDown={handleMouseDown}>
        <div className="window-title">{title}</div>
        <div className="window-controls">
          <button className="window-btn minimize" onClick={handleMinimize} title="Minimize">
            <FontAwesomeIcon icon={faWindowMinimize} />
          </button>
          <button className="window-btn maximize" onClick={handleMaximize} title={isMaximized ? "Restore" : "Maximize"}>
            <FontAwesomeIcon icon={isMaximized ? faWindowRestore : faWindowMaximize} />
          </button>
          <button className="window-btn close" onClick={onClose} title="Close">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      
      <div className="window-content">
        {children}
      </div>
      
      {/* Resize handles - only visible when not maximized */}
      {!isMaximized && (
        <>
          <div className="resize-handle n" onMouseDown={(e) => handleResizeStart('n', e)}></div>
          <div className="resize-handle ne" onMouseDown={(e) => handleResizeStart('ne', e)}></div>
          <div className="resize-handle e" onMouseDown={(e) => handleResizeStart('e', e)}></div>
          <div className="resize-handle se" onMouseDown={(e) => handleResizeStart('se', e)}></div>
          <div className="resize-handle s" onMouseDown={(e) => handleResizeStart('s', e)}></div>
          <div className="resize-handle sw" onMouseDown={(e) => handleResizeStart('sw', e)}></div>
          <div className="resize-handle w" onMouseDown={(e) => handleResizeStart('w', e)}></div>
          <div className="resize-handle nw" onMouseDown={(e) => handleResizeStart('nw', e)}></div>
        </>
      )}
    </div>
  );
};

export default Window;
