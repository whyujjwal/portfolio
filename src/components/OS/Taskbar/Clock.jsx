import React, { useState, useEffect } from 'react';
import './Clock.css';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false); // Toggle between 12/24 hour format
  
  useEffect(() => {
    // Update time every second
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Format time as HH:MM AM/PM or HH:MM
  const formatTime = () => {
    if (is24Hour) {
      return time.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return time.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };
  
  // Get date for tooltip
  const formatDate = () => {
    return time.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div 
      className="clock"
      onClick={() => setIs24Hour(!is24Hour)}
      title={formatDate()}
    >
      <div className="clock-time">
        {formatTime()}
      </div>
    </div>
  );
};

export default Clock;
