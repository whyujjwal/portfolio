import React from 'react';
import '../../styles/PaperUI.css';

const ProgressBar = ({ 
  progress, 
  height = 8, 
  color = 'var(--primary-blue-light)',
  backgroundColor = 'var(--neutral-300)',
  label,
  animated = true,
  striped = false
}) => {
  // Ensure progress is between 0 and 100
  const validProgress = Math.min(Math.max(0, progress), 100);
  
  const progressStyle = {
    height: `${height}px`,
    backgroundColor
  };
  
  const barStyle = {
    width: `${validProgress}%`,
    backgroundColor: color,
    height: '100%',
    transition: animated ? 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
  };
  
  const stripedClass = striped ? 'progress-bar-striped' : '';
  const animatedClass = striped && animated ? 'progress-bar-animated' : '';
  
  return (
    <div className="progress-component">
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <span>{validProgress}%</span>
        </div>
      )}
      <div className="progress-container" style={progressStyle}>
        <div 
          className={`progress-bar ${stripedClass} ${animatedClass}`} 
          style={barStyle}
          role="progressbar" 
          aria-valuenow={validProgress} 
          aria-valuemin="0" 
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

// Add these additional styles to /styles/PaperUI.css
const ProgressBarAdditionalStyles = `
/* Enhanced Progress Bar Component */
.progress-component {
  margin: var(--space-4) 0;
  width: 100%;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
  color: var(--neutral-700);
}

.progress-container {
  background-color: var(--neutral-300);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  background-color: var(--primary-blue-light);
  border-radius: 4px;
  position: relative;
}

/* Striped effect */
.progress-bar-striped {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

/* Animation for striped progress bar */
.progress-bar-animated {
  animation: progress-bar-stripes 1s linear infinite;
}

@keyframes progress-bar-stripes {
  0% {
    background-position: 1rem 0;
  }
  100% {
    background-position: 0 0;
  }
}
`;

export default ProgressBar;
