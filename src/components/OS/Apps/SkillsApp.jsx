import React from 'react';
import './App.css';

const SkillsApp = () => {
  const skillCategories = [
    {
      name: 'Frontend',
      skills: [
        { name: 'HTML/CSS', level: 90 },
        { name: 'JavaScript', level: 85 },
        { name: 'React', level: 80 },
        { name: 'Vue.js', level: 70 },
        { name: 'Angular', level: 65 }
      ]
    },
    {
      name: 'Backend',
      skills: [
        { name: 'Node.js', level: 80 },
        { name: 'Express', level: 75 },
        { name: 'Python', level: 70 },
        { name: 'Django', level: 65 },
        { name: 'PHP', level: 60 }
      ]
    },
    {
      name: 'Database',
      skills: [
        { name: 'MongoDB', level: 75 },
        { name: 'PostgreSQL', level: 70 },
        { name: 'MySQL', level: 70 },
        { name: 'Firebase', level: 65 }
      ]
    },
    {
      name: 'Tools & Others',
      skills: [
        { name: 'Git', level: 85 },
        { name: 'Docker', level: 70 },
        { name: 'AWS', level: 65 },
        { name: 'Agile/Scrum', level: 80 }
      ]
    }
  ];

  return (
    <div className="app skills-app">
      <div className="app-header">
        <h2>My Skills</h2>
      </div>
      <div className="app-content">
        {skillCategories.map(category => (
          <div key={category.name} className="skill-category">
            <h3 className="category-name">{category.name}</h3>
            <div className="skills-list">
              {category.skills.map(skill => (
                <div key={skill.name} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div 
                      className="skill-progress" 
                      style={{ width: `${skill.level}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsApp;
