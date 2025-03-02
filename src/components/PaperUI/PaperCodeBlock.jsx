import React from 'react';
import '../../styles/PaperUI.css';

const PaperCodeBlock = ({ language, children }) => {
  return (
    <div className="code-block">
      {language && <div className="code-language">{language}</div>}
      <code>{children}</code>
    </div>
  );
};

export default PaperCodeBlock;
