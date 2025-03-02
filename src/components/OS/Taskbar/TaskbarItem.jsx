import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { toggleMinimize, activateApp } from '../../../redux/osSlice';
import { getAppIcon } from '../../../utils/appUtils';
import './TaskbarItem.css';

const TaskbarItem = ({ app }) => {
  const dispatch = useDispatch();
  
  const handleClick = () => {
    if (app.isActive && !app.isMinimized) {
      dispatch(toggleMinimize(app.id));
    } else {
      dispatch(activateApp(app.id));
    }
  };
  
  const icon = getAppIcon(app.id);
  
  return (
    <button 
      className={`taskbar-button ${app.isActive && !app.isMinimized ? 'active' : ''} ${app.isMinimized ? 'minimized' : ''}`}
      onClick={handleClick}
      title={app.title}
    >
      <FontAwesomeIcon icon={icon} />
      <div className="taskbar-item-indicator"></div>
    </button>
  );
};

export default TaskbarItem;
