import React from 'react';
import { useSelector } from 'react-redux';
import DesktopOS from './components/OS/DesktopOS';
import './App.css';

function App() {
  const theme = useSelector(state => state.os.theme);
  
  return (
    <div className={`app ${theme}`}>
      <DesktopOS />
    </div>
  );
}

export default App;
