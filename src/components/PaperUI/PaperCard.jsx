import React from 'react';
import '../../styles/PaperUI.css';

const PaperCard = ({ title, children, footer }) => {
  return (
    <div className="paper-card">
      {title && (
        <div className="paper-card-header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="paper-card-content">
        {children}
      </div>
      {footer && (
        <div className="paper-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default PaperCard;
