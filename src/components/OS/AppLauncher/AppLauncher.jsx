import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faFolderOpen, faCode, 
  faFile, faTerminal, faCog, faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import './AppLauncher.css';

const AppLauncher = ({ onAppClick }) => {
  const appCategories = [
    {
      name: 'Personal',
      apps: [
        { id: 'about', name: 'About Me', icon: faUser },
        { id: 'contact', name: 'Contact', icon: faEnvelope }
      ]
    },
    {
      name: 'Portfolio',
      apps: [
        { id: 'projects', name: 'Projects', icon: faFolderOpen },
        { id: 'skills', name: 'Skills', icon: faCode },
        { id: 'github', name: 'GitHub', icon: faGithub },
        { id: 'resume', name: 'Resume', icon: faFile }
      ]
    },
    {
      name: 'Tools',
      apps: [
        { id: 'browser', name: 'Browser', icon: faGlobe },
        { id: 'terminal', name: 'Terminal', icon: faTerminal },
        { id: 'settings', name: 'Settings', icon: faCog }
      ]
    }
  ];
  
  return (
    <div className="app-launcher">
      <div className="launcher-search">
        <input type="text" placeholder="Search applications..." />
      </div>
      <div className="launcher-content">
        {appCategories.map(category => (
          <div key={category.name} className="launcher-category">
            <h3 className="category-title">{category.name}</h3>
            <div className="category-apps">
              {category.apps.map(app => (
                <div 
                  key={app.id} 
                  className="launcher-app"
                  onClick={() => onAppClick(app.id)}
                >
                  <FontAwesomeIcon icon={app.icon} />
                  <span>{app.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppLauncher;
