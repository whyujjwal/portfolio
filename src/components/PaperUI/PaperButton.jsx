import React from 'react';
import '../../styles/PaperUI.css';

const PaperButton = ({ children, variant = 'primary', ...rest }) => {
  return (
    <button className={`btn btn-${variant}`} {...rest}>
      {children}
    </button>
  );
};

export default PaperButton;
