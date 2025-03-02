import { 
  faUser, 
  faFolderOpen, 
  faCode, 
  faEnvelope, 
  faTerminal, 
  faGlobe,
  faFile,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

/**
 * Returns the appropriate FontAwesome icon for a given app ID
 * 
 * @param {string} appId - The app identifier
 * @returns {Object} A FontAwesome icon object
 */
export const getAppIcon = (appId) => {
  switch (appId) {
    case 'about':
      return faUser;
      
    case 'projects':
      return faFolderOpen;
      
    case 'skills':
      return faCode;
      
    case 'contact':
      return faEnvelope;
      
    case 'github':
      return faGithub;
      
    case 'browser':
      return faGlobe;
      
    case 'terminal':
      return faTerminal;
      
    case 'resume':
      return faFile;
      
    default:
      return faQuestion; // Default fallback icon
  }
};

/**
 * Returns the color for a given app ID
 * 
 * @param {string} appId - The app identifier
 * @returns {string} A color value (hex or CSS color name)
 */
export const getAppColor = (appId) => {
  switch (appId) {
    case 'about':
      return '#e51691'; // Pink
      
    case 'projects':
      return '#58cb8e'; // Green
      
    case 'skills':
      return '#3a10e5'; // Blue
      
    case 'contact':
      return '#ff6347'; // Tomato
      
    case 'github':
      return '#333333'; // Dark gray
      
    case 'browser':
      return '#0086f8'; // Browser blue
      
    case 'terminal':
      return '#444444'; // Terminal gray
      
    case 'resume':
      return '#f5a623'; // Resume orange
      
    default:
      return '#888888'; // Default gray
  }
};

/**
 * Gets the category for an app ID
 * 
 * @param {string} appId - The app identifier
 * @returns {string} The category name
 */
export const getAppCategory = (appId) => {
  const categories = {
    about: 'personal',
    contact: 'personal',
    projects: 'work',
    skills: 'work',
    github: 'tools',
    browser: 'tools',
    terminal: 'tools',
    resume: 'tools'
  };
  
  return categories[appId] || 'other';
};
