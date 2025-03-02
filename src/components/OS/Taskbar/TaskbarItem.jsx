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
      className={`taskbar-button ${app.isActive && !app.isMinimized ? 'active' : ''}`} 
      onClick={handleClick}
      title={app.title}
    >
      <div className="taskbar-item-indicator"></div>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default TaskbarItem;
