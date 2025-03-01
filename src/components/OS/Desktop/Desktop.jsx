import React from 'react';
import DesktopIcon from './DesktopIcon';
import { faUser, faFolderOpen, faCode, faEnvelope, faTerminal, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import './Desktop.css';

const Desktop = ({ onAppClick }) => {
  const desktopApps = [
    { id: 'about', name: 'About Me', icon: faUser },
    { id: 'projects', name: 'Projects', icon: faFolderOpen },
    { id: 'skills', name: 'Skills', icon: faCode },
    { id: 'contact', name: 'Contact', icon: faEnvelope },
    { id: 'github', name: 'GitHub', icon: faGithub },
    { id: 'browser', name: 'Browser', icon: faGlobe },
    { id: 'terminal', name: 'Terminal', icon: faTerminal },
  ];

  return (
    <div className="desktop">
      <div className="desktop-icons">
        {desktopApps.map((app, index) => (
          <DesktopIcon 
            key={app.id}
            id={app.id}
            name={app.name}
            icon={app.icon} 
            onClick={() => onAppClick(app.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Desktop;
