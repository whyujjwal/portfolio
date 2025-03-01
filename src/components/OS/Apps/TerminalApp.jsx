import React, { useState, useRef, useEffect } from 'react';
import './App.css';  // Fix import path
import './TerminalApp.css';

const TerminalApp = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    {
      type: 'output',
      text: 'Welcome to Portfolio Terminal v1.0.0'
    },
    {
      type: 'output',
      text: 'Type "help" to see available commands.'
    }
  ]);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  
  const handleCommand = (cmd) => {
    const commandLower = cmd.toLowerCase().trim();
    
    // Add the command to history
    setHistory(prev => [...prev, { type: 'command', text: cmd }]);
    
    // Process commands
    switch(commandLower) {
      case 'help':
        return setHistory(prev => [
          ...prev, 
          { 
            type: 'output', 
            text: `Available commands:
- help: Show this help message
- about: Show information about me
- skills: List my technical skills
- projects: List my projects
- contact: Show contact information
- clear: Clear the terminal
- github: Open my GitHub profile`
          }
        ]);
      case 'about':
        return setHistory(prev => [
          ...prev, 
          { 
            type: 'output', 
            text: `I'm a full-stack developer with experience in React, Node.js, and more.
I love building web applications and solving complex problems.`
          }
        ]);
      case 'skills':
        return setHistory(prev => [
          ...prev, 
          { 
            type: 'output', 
            text: 'Technical Skills:\n- JavaScript/TypeScript\n- React/Redux\n- Node.js/Express\n- HTML/CSS\n- MongoDB\n- SQL\n- Git'
          }
        ]);
      case 'projects':
        return setHistory(prev => [
          ...prev, 
          { 
            type: 'output', 
            text: 'My Projects:\n1. Project One - A web application...\n2. Project Two - A mobile app...\n3. Project Three - An API service...\n\nType "open <project number>" to see details.'
          }
        ]);
      case 'contact':
        return setHistory(prev => [
          ...prev, 
          { 
            type: 'output', 
            text: 'Contact Information:\nEmail: your.email@example.com\nLinkedIn: linkedin.com/in/yourprofile\nGitHub: github.com/yourusername'
          }
        ]);
      case 'clear':
        return setHistory([]);
      case 'github':
        window.open('https://github.com/yourusername', '_blank');
        return setHistory(prev => [
          ...prev, 
          { 
            type: 'output', 
            text: 'Opening GitHub profile...'
          }
        ]);
      default:
        return setHistory(prev => [
          ...prev, 
          { 
            type: 'output', 
            text: `Command not found: ${cmd}\nType "help" to see available commands.`
          }
        ]);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        handleCommand(input);
        setInput('');
      }
    }
  };
  
  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener('click', handleClick);
    }
    
    return () => {
      if (terminal) {
        terminal.removeEventListener('click', handleClick);
      }
    };
  }, []);
  
  return (
    <div className="app terminal-app">
      <div className="terminal-container" ref={terminalRef}>
        {history.map((item, index) => (
          <div 
            key={index} 
            className={`terminal-line ${item.type === 'command' ? 'command' : 'output'}`}
          >
            {item.type === 'command' ? '$ ' : ''}{item.text}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="prompt">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalApp;
