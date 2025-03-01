import React from 'react';
import './App.css';  // Fix import path

const AboutApp = () => {
  return (
    <div className="app about-app">
      <div className="app-header">
        <h2>About Me</h2>
      </div>
      <div className="app-content">
        <div className="about-profile">
          <div className="profile-image">
            <img src="/path-to-your-image.jpg" alt="Profile" />
          </div>
          <div className="profile-details">
            <h3>Your Name</h3>
            <p className="profile-title">Full Stack Developer</p>
            <p className="profile-location">Your Location</p>
          </div>
        </div>
        
        <div className="about-section">
          <h4>Who I Am</h4>
          <p>
            Write a compelling paragraph about yourself, your journey as a developer,
            and what makes you passionate about programming.
          </p>
        </div>
        
        <div className="about-section">
          <h4>Experience</h4>
          <ul className="experience-list">
            <li>
              <span className="year">2021 - Present</span>
              <strong>Position Title</strong> at Company Name
            </li>
            <li>
              <span className="year">2019 - 2021</span>
              <strong>Position Title</strong> at Company Name
            </li>
          </ul>
        </div>
        
        <div className="about-section">
          <h4>Education</h4>
          <ul className="education-list">
            <li>
              <span className="year">2015 - 2019</span>
              <strong>Degree Name</strong> - Institution Name
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutApp;
