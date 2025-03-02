import React from 'react';
import PaperNavbar from './PaperNavbar';
import '../../styles/PaperUI.css';

const PaperLayout = ({ 
  logo,
  navItems, 
  sidebar,
  children,
  fullWidth = false
}) => {
  return (
    <div className="paper-layout">
      <PaperNavbar logo={logo}>
        {navItems}
      </PaperNavbar>
      
      <div className="paper-layout-content">
        {sidebar && (
          <div className="paper-layout-sidebar">
            {sidebar}
          </div>
        )}
        
        <main className={`paper-layout-main ${sidebar ? 'with-sidebar' : ''}`}>
          <div className={`${fullWidth ? '' : 'paper-container'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Add styles to /styles/PaperUI.css to support PaperLayout
const PaperLayoutStyles = `
/* Paper Layout Component */
.paper-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--neutral-300);
}

.paper-layout-content {
  display: flex;
  flex: 1;
}

.paper-layout-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.paper-layout-main {
  flex: 1;
  padding: var(--space-5) 0;
}

.paper-layout-main.with-sidebar {
  margin-left: 240px;
}

@media (max-width: 768px) {
  .paper-layout-sidebar {
    width: 100%;
    position: static;
  }
  
  .paper-layout-main.with-sidebar {
    margin-left: 0;
  }
}
`;

export default PaperLayout;
