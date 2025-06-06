// components/SecurityAlert.js
import React from 'react';

const SecurityAlert = ({ alert, delay = 0 }) => {
  return (
    <div 
      className="security-alert"
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="alert-icon">{alert.icon}</span>
      <span className="alert-text">{alert.text}</span>
    </div>
  );
};
export default SecurityAlert;
