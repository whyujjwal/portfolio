import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowMaximize, faWindowRestore, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import Draggable from 'react-draggable';
import { minimizeApp } from '../../../redux/osSlice';
import './Window.css';

const Window = ({ id, title, children, onClose, isActive, isMinimized, initialPosition, onActivate }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(initialPosition || { x: 100, y: 100 });
  const [prevPosition, setPrevPosition] = useState(position);
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [prevSize, setPrevSize] = useState(size);
  const nodeRef = useRef(null);
  const dispatch = useDispatch();
  
  const handleMaximize = () => {
    if (!isMaximized) {
      setPrevPosition(position);
      setPrevSize(size);
      setIsMaximized(true);
    } else {
      setIsMaximized(false);
    }
  };
  
  const handleMinimize = () => {
    dispatch(minimizeApp(id));
  };

  const onDragStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };
  
  useEffect(() => {
    if (onActivate) {
      onActivate();
    }
  }, []);
  
  if (isMinimized) return null;

  return (
    <Draggable 
      nodeRef={nodeRef}
      handle=".window-titlebar"
      position={isMaximized ? {x: 0, y: 0} : position}
      defaultPosition={initialPosition || {x: 100, y: 100}}
      disabled={isMaximized}
      bounds="parent"
      onStop={onDragStop}
      onMouseDown={() => onActivate && onActivate()}
    >
      <div 
        ref={nodeRef} 
        className={`window ${isActive ? 'active' : ''} ${isMaximized ? 'maximized' : ''}`}
        style={!isMaximized ? {
          width: `${size.width}px`,
          height: `${size.height}px`
        } : {}}
      >
        <div className="window-titlebar">
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
    </Draggable>
  );
};

export default Window;
