import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExpand, faMinus, faCompress } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import './PaperWindow.css';

const PaperWindow = ({
  id,
  title,
  children,
  isActive,
  isMinimized,
  position,
  size,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMoveStart,
  onMove,
  onMoveEnd,
  onResizeStart,
  onResize,
  onResizeEnd
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  
  const windowRef = useRef(null);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const initialWindowPosRef = useRef({ x: 0, y: 0 });
  const initialMousePosRef = useRef({ x: 0, y: 0 });
  const initialSizeRef = useRef({ width: 0, height: 0 });
  
  // Handle window focus when clicked
  const handleWindowClick = (e) => {
    if (!isActive && onFocus) {
      onFocus(id);
    }
  };
  
  // Handle titlebar drag
  const handleDragStart = (e) => {
    if (isMaximized) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    dragStartPosRef.current = { x: mouseX, y: mouseY };
    initialWindowPosRef.current = { ...position };
    
    if (onMoveStart) onMoveStart(id);
    
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };
  
  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartPosRef.current.x;
    const deltaY = e.clientY - dragStartPosRef.current.y;
    
    const newPosition = {
      x: initialWindowPosRef.current.x + deltaX,
      y: initialWindowPosRef.current.y + deltaY
    };
    
    if (onMove) onMove(id, newPosition);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    
    if (onMoveEnd) onMoveEnd(id);
  };
  
  // Handle window resize
  const handleResizeStart = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMaximized) return;
    
    setIsResizing(true);
    setResizeDirection(direction);
    
    initialMousePosRef.current = { x: e.clientX, y: e.clientY };
    initialSizeRef.current = { ...size };
    initialWindowPosRef.current = { ...position };
    
    if (onResizeStart) onResizeStart(id);
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  const handleResizeMove = (e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - initialMousePosRef.current.x;
    const deltaY = e.clientY - initialMousePosRef.current.y;
    
    let newSize = { ...initialSizeRef.current };
    let newPosition = { ...initialWindowPosRef.current };
    
    // Calculate new size and position based on resize direction
    switch (resizeDirection) {
      case 'e':
        newSize.width = Math.max(200, initialSizeRef.current.width + deltaX);
        break;
      case 's':
        newSize.height = Math.max(150, initialSizeRef.current.height + deltaY);
        break;
      case 'se':
        newSize.width = Math.max(200, initialSizeRef.current.width + deltaX);
        newSize.height = Math.max(150, initialSizeRef.current.height + deltaY);
        break;
      case 'w':
        const newWidth = Math.max(200, initialSizeRef.current.width - deltaX);
        newPosition.x = initialWindowPosRef.current.x - (newWidth - initialSizeRef.current.width);
        newSize.width = newWidth;
        break;
      case 'n':
        const newHeight = Math.max(150, initialSizeRef.current.height - deltaY);
        newPosition.y = initialWindowPosRef.current.y - (newHeight - initialSizeRef.current.height);
        newSize.height = newHeight;
        break;
      case 'sw':
        newSize.height = Math.max(150, initialSizeRef.current.height + deltaY);
        const newWidthSW = Math.max(200, initialSizeRef.current.width - deltaX);
        newPosition.x = initialWindowPosRef.current.x - (newWidthSW - initialSizeRef.current.width);
        newSize.width = newWidthSW;
        break;
      case 'ne':
        newSize.width = Math.max(200, initialSizeRef.current.width + deltaX);
        const newHeightNE = Math.max(150, initialSizeRef.current.height - deltaY);
        newPosition.y = initialWindowPosRef.current.y - (newHeightNE - initialSizeRef.current.height);
        newSize.height = newHeightNE;
        break;
      case 'nw':
        const newWidthNW = Math.max(200, initialSizeRef.current.width - deltaX);
        const newHeightNW = Math.max(150, initialSizeRef.current.height - deltaY);
        newPosition.x = initialWindowPosRef.current.x - (newWidthNW - initialSizeRef.current.width);
        newPosition.y = initialWindowPosRef.current.y - (newHeightNW - initialSizeRef.current.height);
        newSize.width = newWidthNW;
        newSize.height = newHeightNW;
        break;
      default:
        break;
    }
    
    if (onResize) onResize(id, newSize);
    if (onMove) onMove(id, newPosition);
  };
  
  const handleResizeEnd = () => {
    setIsResizing(false);
    
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    
    if (onResizeEnd) onResizeEnd(id);
  };
  
  // Handle maximize/restore
  const handleMaximizeToggle = () => {
    if (isMaximized) {
      // Restore previous state
      if (preMaximizeState) {
        onResize(id, preMaximizeState.size);
        onMove(id, preMaximizeState.position);
      }
    } else {
      // Save current state and maximize
      setPreMaximizeState({ position: { ...position }, size: { ...size } });
      
      // Get viewport dimensions and set window to fill it
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight;
      
      onResize(id, { width: maxWidth, height: maxHeight });
      onMove(id, { x: 0, y: 0 });
    }
    
    setIsMaximized(!isMaximized);
    if (onMaximize) onMaximize(id);
  };
  
  // Clean up event listeners when unmounted
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isDragging, isResizing]);
  
  // Animation variants for window
  const windowVariants = {
    open: {
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    closed: {
      opacity: 0,
      scale: 0.9,
      transition: { 
        duration: 0.15
      }
    },
    minimized: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      transition: { 
        duration: 0.2
      }
    }
  };
  
  // Don't render anything if window is minimized
  if (isMinimized) return null;
  
  return (
    <motion.div
      className={`paper-window ${isActive ? 'active' : ''} ${isMaximized ? 'maximized' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: isActive ? 100 : 10
      }}
      ref={windowRef}
      onClick={handleWindowClick}
      initial="closed"
      animate="open"
      exit="closed"
      variants={windowVariants}
    >
      {/* Window titlebar with controls */}
      <div 
        className="window-titlebar"
        onMouseDown={handleDragStart}
        onDoubleClick={handleMaximizeToggle}
      >
        <div className="window-controls-left">
          <div className="window-title">{title}</div>
        </div>
        <div className="window-controls-right">
          <button className="window-control minimize" onClick={onMinimize} title="Minimize">
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <button className="window-control maximize" onClick={handleMaximizeToggle} title={isMaximized ? "Restore" : "Maximize"}>
            <FontAwesomeIcon icon={isMaximized ? faCompress : faExpand} />
          </button>
          <button className="window-control close" onClick={onClose} title="Close">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      
      {/* Window content */}
      <div className="window-content">
        {children}
      </div>
      
      {/* Resize handles - only shown when not maximized */}
      {!isMaximized && (
        <>
          <div className="resize-handle n" onMouseDown={(e) => handleResizeStart(e, 'n')}></div>
          <div className="resize-handle e" onMouseDown={(e) => handleResizeStart(e, 'e')}></div>
          <div className="resize-handle s" onMouseDown={(e) => handleResizeStart(e, 's')}></div>
          <div className="resize-handle w" onMouseDown={(e) => handleResizeStart(e, 'w')}></div>
          <div className="resize-handle ne" onMouseDown={(e) => handleResizeStart(e, 'ne')}></div>
          <div className="resize-handle se" onMouseDown={(e) => handleResizeStart(e, 'se')}></div>
          <div className="resize-handle sw" onMouseDown={(e) => handleResizeStart(e, 'sw')}></div>
          <div className="resize-handle nw" onMouseDown={(e) => handleResizeStart(e, 'nw')}></div>
        </>
      )}
    </motion.div>
  );
};

export default PaperWindow;
