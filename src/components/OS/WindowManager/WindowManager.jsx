import React from 'react';
import { useDispatch } from 'react-redux';
import Window from './Window';
import { setActiveApp, closeApp } from '../../../redux/osSlice';
import './WindowManager.css';

// App imports - only importing what we need to avoid circular dependencies
const appComponents = {
  about: {
    component: React.lazy(() => import('../Apps/AboutApp')),
    title: 'About Me'
  },
  projects: {
    component: React.lazy(() => import('../Apps/ProjectsApp')),
    title: 'Projects'
  },
  skills: {
    component: React.lazy(() => import('../Apps/SkillsApp')),
    title: 'Skills'
  },
  contact: {
    component: React.lazy(() => import('../Apps/ContactApp')),
    title: 'Contact'
  },
  terminal: {
    component: React.lazy(() => import('../Apps/TerminalApp')),
    title: 'Terminal'
  },
  github: {
    component: React.lazy(() => import('../Apps/GitHubApp')),
    title: 'GitHub Profile'
  },
  browser: {
    component: React.lazy(() => import('../Apps/BrowserApp')),
    title: 'Web Browser'
  }
};

const WindowManager = ({ openApps }) => {
  const dispatch = useDispatch();
  
  const handleActivate = (appId) => {
    dispatch(setActiveApp(appId));
  };
  
  const handleClose = (appId) => {
    dispatch(closeApp(appId));
  };
  
  return (
    <div className="window-manager">
      <React.Suspense fallback={<div>Loading...</div>}>
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
      </React.Suspense>
    </div>
  );
};

export default WindowManager;
