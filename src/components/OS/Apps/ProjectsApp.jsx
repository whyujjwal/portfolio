import React from 'react';
import './App.css';

const ProjectsApp = () => {
  const projects = [
    {
      id: 1,
      title: 'Project Name 1',
      description: 'A description of your first project. What it does, what technologies you used, what you learned.',
      image: '/path-to-project-image.jpg',
      technologies: ['React', 'Node.js', 'MongoDB'],
      github: 'https://github.com/yourusername/project1',
      demo: 'https://project1-demo.com'
    },
    {
      id: 2,
      title: 'Project Name 2',
      description: 'A description of your second project. What it does, what technologies you used, what you learned.',
      image: '/path-to-project-image.jpg',
      technologies: ['Vue.js', 'Express', 'PostgreSQL'],
      github: 'https://github.com/yourusername/project2',
      demo: 'https://project2-demo.com'
    },
    {
      id: 3,
      title: 'Project Name 3',
      description: 'A description of your third project. What it does, what technologies you used, what you learned.',
      image: '/path-to-project-image.jpg',
      technologies: ['Angular', 'Django', 'MySQL'],
      github: 'https://github.com/yourusername/project3',
      demo: 'https://project3-demo.com'
    }
  ];

  return (
    <div className="app projects-app">
      <div className="app-header">
        <h2>My Projects</h2>
      </div>
      <div className="app-content">
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-details">
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.technologies.map(tech => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">GitHub</a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link">Live Demo</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsApp;
