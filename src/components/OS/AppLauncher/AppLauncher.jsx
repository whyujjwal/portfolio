import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faFolder, faCode, 
  faFile, faTerminal, faCog, faSearch,
  faGlobe, faBriefcase, faBook, faLaptopCode,
  faHeart, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import './AppLauncher.css';
import '../../../styles/PaperUI.css';

const AppLauncher = ({ onAppClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateIn(true);
  }, []);
  
  // App data with more info for elegant display
  const appCategories = [
    {
      id: 'personal',
      name: 'Personal',
      icon: faHeart,
      apps: [
        { 
          id: 'about', 
          name: 'About Me', 
          icon: faUser, 
          description: 'Personal information and biography'
        },
        { 
          id: 'contact', 
          name: 'Contact', 
          icon: faEnvelope,
          description: 'Get in touch with me'
        }
      ]
    },
    {
      id: 'work',
      name: 'Work',
      icon: faBriefcase,
      apps: [
        { 
          id: 'projects', 
          name: 'Projects', 
          icon: faFolder,
          description: 'Showcase of recent work'
        },
        { 
          id: 'skills', 
          name: 'Skills', 
          icon: faCode,
          description: 'Technical abilities'
        }
      ]
    },
    {
      id: 'tools',
      name: 'Tools',
      icon: faLaptopCode,
      apps: [
        { 
          id: 'github', 
          name: 'GitHub', 
          icon: faGithub,
          description: 'View source code'
        },
        { 
          id: 'browser', 
          name: 'Browser', 
          icon: faGlobe,
          description: 'Web browser'
        },
        { 
          id: 'terminal', 
          name: 'Terminal', 
          icon: faTerminal,
          description: 'Command line interface'
        },
        { 
          id: 'resume', 
          name: 'Resume', 
          icon: faFile,
          description: 'View and download resume'
        }
      ]
    }
  ];
  
  // Combined list of all apps for searching
  const allApps = appCategories.flatMap(category => 
    category.apps.map(app => ({...app, category: category.id}))
  );
  
  // Filter apps based on search term and selected category
  const getFilteredApps = () => {
    let apps = allApps;
    
    if (selectedCategory !== 'all') {
      apps = apps.filter(app => app.category === selectedCategory);
    }
    
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      apps = apps.filter(app => 
        app.name.toLowerCase().includes(searchLower) || 
        app.description.toLowerCase().includes(searchLower)
      );
    }
    
    return apps;
  };
  
  const filteredApps = getFilteredApps();

  return (
    <div className={`app-launcher ${animateIn ? 'animate-in' : ''}`}>
      <div className="launcher-search">
        <div className="search-icon">
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      </div>
      
      <div className="launcher-content">
        <div className="launcher-sidebar">
          <button 
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <span>All</span>
          </button>
          
          {appCategories.map(category => (
            <button 
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <FontAwesomeIcon icon={category.icon} />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        
        <div className="launcher-apps-container">
          {searchTerm && (
            <div className="search-results-label">
              {filteredApps.length === 0 ? 
                `No results for "${searchTerm}"` : 
                `${filteredApps.length} result${filteredApps.length !== 1 ? 's' : ''} for "${searchTerm}"`
              }
            </div>
          )}
          
          <div className="launcher-apps">
            {filteredApps.map((app, index) => (
              <div 
                key={app.id}
                className="app-card"
                onClick={() => onAppClick(app.id)}
                style={{animationDelay: `${index * 0.05}s`}}
                data-category={app.category} // Add category attribute for styling
              >
                <div className="app-icon">
                  <FontAwesomeIcon icon={app.icon} />
                </div>
                <div className="app-info">
                  <div className="app-name">{app.name}</div>
                  <div className="app-description">{app.description}</div>
                </div>
                <div className="app-arrow">
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
              </div>
            ))}
            
            {filteredApps.length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <p>No applications found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLauncher;
