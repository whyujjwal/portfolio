import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowMaximize, faWindowRestore, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import Draggable from 'react-draggable';
import { minimizeApp } from '../../../redux/osSlice';
import './Window.css';

const Window = ({ id, title, children, onClose, isActive, isMinimized, initialPosition, onActivate }) => {
  // State
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(initialPosition || { x: 100, y: 100 });
  const [prevPosition, setPrevPosition] = useState(position);
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [prevSize, setPrevSize] = useState(size);
  
  // Refs for draggable
  const nodeRef = useRef(null);
  const dispatch = useDispatch();
  
  // Handle window activation
  const handleActivate = (e) => {
    // Don't activate when clicking controls
    if (!e.target.closest('.window-controls')) {
      onActivate && onActivate();
    }
  };
  
  // Window control functions
  const handleMaximize = (e) => {
    e.stopPropagation();
    if (!isMaximized) {
      setPrevPosition({...position});
      setPrevSize({...size});
      setIsMaximized(true);
    } else {
      setIsMaximized(false);
      setPosition(prevPosition);
    }
  };
  
  const handleMinimize = (e) => {
    e.stopPropagation();
    dispatch(minimizeApp(id));
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose && onClose();
  };
  
  // After drag stops, update position state
  const handleDragStop = (e, data) => {
    if (!isMaximized) {
      setPosition({ x: data.x, y: data.y });
    }
  };
  
  // Simple resize functions - simplified for reliability
  const startResize = (e, direction) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startLeft = position.x;
    const startTop = position.y;
    
    function handleMouseMove(moveEvent) {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;
      
      if (direction.includes('e')) {
        newWidth = Math.max(300, startWidth + (moveEvent.clientX - startX));
      }
      if (direction.includes('s')) {
        newHeight = Math.max(200, startHeight + (moveEvent.clientY - startY));
      }
      if (direction.includes('w')) {
        const calculatedWidth = Math.max(300, startWidth - (moveEvent.clientX - startX));
        newX = startLeft + (startWidth - calculatedWidth);
        newWidth = calculatedWidth;
      }
      if (direction.includes('n')) {
        const calculatedHeight = Math.max(200, startHeight - (moveEvent.clientY - startY));
        newY = startTop + (startHeight - calculatedHeight);
        newHeight = calculatedHeight;
      }
      
      setSize({ width: newWidth, height: newHeight });
      if (direction.includes('n') || direction.includes('w')) {
        setPosition({ x: newX, y: newY });
      }
    }
    
    function handleMouseUp() {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Set up activation handler on mount
  useEffect(() => {
    // Activate window when it's first mounted
    onActivate && onActivate();
    
    return () => {
      // Clean up any potential event listeners
    };
  }, []);
  
  // Don't render if minimized
  if (isMinimized) return null;
  
  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".draggable-handle"
      defaultPosition={position}
      position={isMaximized ? { x: 0, y: 0 } : null}
      onStop={handleDragStop}
      disabled={isMaximized}
      bounds=".window-manager"
      cancel=".window-controls, .resize-handle"
    >
      <div 
        ref={nodeRef}
        className={`window ${isActive ? 'active' : ''} ${isMaximized ? 'maximized' : ''}`}
        style={!isMaximized ? { width: `${size.width}px`, height: `${size.height}px` } : {}}
        onClick={handleActivate}
      >
        <div className="window-titlebar">
          {/* Explicit draggable handle */}
          <div className="draggable-handle">
            <div className="window-title">{title}</div>
          </div>
          <div className="window-controls">
            <button className="window-btn minimize" onClick={handleMinimize}>
              <FontAwesomeIcon icon={faWindowMinimize} />
            </button>
            <button className="window-btn maximize" onClick={handleMaximize}>
              <FontAwesomeIcon icon={isMaximized ? faWindowRestore : faWindowMaximize} />
            </button>
            <button className="window-btn close" onClick={handleClose}>
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
    </Draggable>
  );
};

export default Window;
