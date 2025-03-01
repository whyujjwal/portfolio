import React from 'react';
import { useDispatch } from 'react-redux';
import Window from './Window';
import AboutApp from '../Apps/AboutApp';
import ProjectsApp from '../Apps/ProjectsApp';
import SkillsApp from '../Apps/SkillsApp';
import ContactApp from '../Apps/ContactApp';
import TerminalApp from '../Apps/TerminalApp';
import { setActiveApp, closeApp } from '../../../redux/osSlice';
import './WindowManager.css';

const WindowManager = ({ openApps }) => {
  const dispatch = useDispatch();
  
  // Map app IDs to their component and title
  const appComponents = {
    about: { component: AboutApp, title: 'About Me' },
    projects: { component: ProjectsApp, title: 'Projects' },
    skills: { component: SkillsApp, title: 'Skills' },
    contact: { component: ContactApp, title: 'Contact' },
    terminal: { component: TerminalApp, title: 'Terminal' }
  };
  
  const handleActivate = (appId) => {
    dispatch(setActiveApp(appId));
  };
  
  const handleClose = (appId) => {
    dispatch(closeApp(appId));
  };
  
  return (
    <div className="window-manager">
      {openApps.map(app => {
        const AppComponent = appComponents[app.id]?.component;
        const title = appComponents[app.id]?.title || app.id.charAt(0).toUpperCase() + app.id.slice(1);
        
        return (
          <Window 
            key={app.id}
            id={app.id}
            title={title} 
            onClose={() => handleClose(app.id)}
            isActive={app.isActive}
            isMinimized={app.isMinimized}
            initialPosition={app.position}
            onActivate={() => handleActivate(app.id)}
          >
            {AppComponent ? <AppComponent /> : <div>App not found</div>}
          </Window>
        );
      })}
    </div>
  );
};

export default WindowManager;
