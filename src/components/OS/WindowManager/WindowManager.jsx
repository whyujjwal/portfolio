import React from 'react';
import { useDispatch } from 'react-redux';
import Window from './Window';
import { setActiveApp, closeApp } from '../../../redux/osSlice';
import './WindowManager.css';

// Simple static imports rather than lazy loading for reliability
import AboutApp from '../Apps/AboutApp';
import ProjectsApp from '../Apps/ProjectsApp';
import SkillsApp from '../Apps/SkillsApp';
import ContactApp from '../Apps/ContactApp';
import TerminalApp from '../Apps/TerminalApp';
import GitHubApp from '../Apps/GitHubApp';

// App components mapping
const appComponents = {
  about: { component: AboutApp, title: 'About Me' },
  projects: { component: ProjectsApp, title: 'Projects' },
  skills: { component: SkillsApp, title: 'Skills' },
  contact: { component: ContactApp, title: 'Contact' },
  terminal: { component: TerminalApp, title: 'Terminal' },
  github: { component: GitHubApp, title: 'GitHub Profile' }
};

const WindowManager = ({ openApps }) => {
  const dispatch = useDispatch();
  
  const handleActivate = (appId) => {
    console.log('Activating app:', appId);
    dispatch(setActiveApp(appId));
  };
  
  const handleClose = (appId) => {
    console.log('Closing app:', appId);
    dispatch(closeApp(appId));
  };
  
  return (
    <div className="window-manager">
      {openApps.map(app => {
        const AppComponent = appComponents[app.id]?.component;
        const title = appComponents[app.id]?.title || app.id.charAt(0).toUpperCase() + app.id.slice(1);
        
        return AppComponent ? (
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
            <AppComponent />
          </Window>
        ) : null;
      })}
    </div>
  );
};

export default WindowManager;
