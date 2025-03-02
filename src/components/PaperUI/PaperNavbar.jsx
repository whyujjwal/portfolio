import React from 'react';
import '../../styles/PaperUI.css';

const PaperNavbar = ({ logo, children }) => {
  return (
    <nav className="paper-nav">
      <div className="paper-nav-logo">{logo}</div>
      <div className="paper-nav-items">
        {children}
      </div>
    </nav>
  );
};

export const PaperNavItem = ({ children, active, ...rest }) => {
  return (
    <a className={`paper-nav-item ${active ? 'active' : ''}`} {...rest}>
      {children}
    </a>
  );
};

export default PaperNavbar;
