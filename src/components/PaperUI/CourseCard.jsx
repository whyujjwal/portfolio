import React from 'react';
import '../../styles/PaperUI.css';
import ProgressBar from './ProgressBar';

const CourseCard = ({ 
  image, 
  title, 
  description, 
  meta, 
  progress, 
  onClick,
  tags = []
}) => {
  return (
    <div className="course-card" onClick={onClick}>
      {image && (
        <img src={image} alt={title} className="course-card-img" />
      )}
      <div className="course-card-content">
        <h4 className="course-card-title">{title}</h4>
        {tags.length > 0 && (
          <div className="course-tags">
            {tags.map((tag, index) => (
              <span key={index} className="course-tag">{tag}</span>
            ))}
          </div>
        )}
        <p className="course-card-description">{description}</p>
        {progress !== undefined && (
          <ProgressBar 
            progress={progress} 
            height={6} 
            animated={false}
          />
        )}
        {meta && <div className="course-card-meta">{meta}</div>}
      </div>
    </div>
  );
};

// Add these additional styles to /styles/PaperUI.css
const CourseCardAdditionalStyles = `
/* Enhanced Course Card */
.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
}

.course-tag {
  padding: 2px 8px;
  background-color: var(--neutral-200);
  border-radius: 4px;
  font-size: var(--text-xs);
  color: var(--neutral-700);
  font-weight: 500;
}
`;

export default CourseCard;
