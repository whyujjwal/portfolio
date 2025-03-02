import React from 'react';
import '../../styles/PaperUI.css';

const PaperSidebar = ({ children }) => {
  return (
    <aside className="paper-sidebar">
      {children}
    </aside>
  );
};

export const PaperSidebarItem = ({ children, active, ...rest }) => {
  return (
    <a className={`paper-sidebar-item ${active ? 'active' : ''}`} {...rest}>
      {children}
    </a>
  );
};

export default PaperSidebar;
