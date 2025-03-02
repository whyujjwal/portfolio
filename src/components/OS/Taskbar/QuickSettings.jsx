import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWifi, faBluetooth, faVolumeUp, faVolumeMute,
  faMoon, faSun, faBatteryFull, faCog
} from '@fortawesome/free-solid-svg-icons';
import './QuickSettings.css';

const QuickSettings = ({ theme, toggleTheme }) => {
  const [volume, setVolume] = useState(75);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  
  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };
  
  return (
    <div className="quick-settings">
      <div className="quick-settings-header">
        <h3>Quick Settings</h3>
      </div>
      
      <div className="quick-toggles">
        <div className={`quick-toggle ${wifi ? 'active' : ''}`} onClick={() => setWifi(!wifi)}>
          <FontAwesomeIcon icon={faWifi} />
          <span>Wi-Fi</span>
        </div>
        
        <div className={`quick-toggle ${bluetooth ? 'active' : ''}`} onClick={() => setBluetooth(!bluetooth)}>
          <FontAwesomeIcon icon={faBluetooth} />
          <span>Bluetooth</span>
        </div>
        
        <div className={`quick-toggle ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme}>
          <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} />
          <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </div>
      </div>
      
      <div className="volume-slider">
        <div className="slider-icon">
          <FontAwesomeIcon icon={volume === 0 ? faVolumeMute : faVolumeUp} />
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={handleVolumeChange}
          className="slider"
        />
        <div className="volume-value">{volume}%</div>
      </div>
      
      <div className="battery-indicator">
        <FontAwesomeIcon icon={faBatteryFull} />
        <span>75%</span>
      </div>
      
      <div className="quick-settings-footer">
        <button className="settings-button">
          <FontAwesomeIcon icon={faCog} />
          <span>All Settings</span>
        </button>
      </div>
    </div>
  );
};

export default QuickSettings;
