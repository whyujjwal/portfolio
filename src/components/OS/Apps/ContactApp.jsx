import React, { useState } from 'react';
import './App.css';

const ContactApp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);
    
    // Simulate form submission
    try {
      // Replace with actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitResult({
        success: true,
        message: 'Your message has been sent successfully! I will get back to you soon.'
      });
      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app contact-app">
      <div className="app-header">
        <h2>Contact Me</h2>
      </div>
      <div className="app-content">
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-method">
              <h4>Email</h4>
              <p><a href="mailto:your.email@example.com">your.email@example.com</a></p>
            </div>
            <div className="contact-method">
              <h4>LinkedIn</h4>
              <p><a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">linkedin.com/in/yourprofile</a></p>
            </div>
            <div className="contact-method">
              <h4>GitHub</h4>
              <p><a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">github.com/yourusername</a></p>
            </div>
            <div className="contact-method">
              <h4>Location</h4>
              <p>Your City, Country</p>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>Send me a message</h3>
            {submitResult && (
              <div className={`form-result ${submitResult.success ? 'success' : 'error'}`}>
                {submitResult.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactApp;