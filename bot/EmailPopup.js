// components/EmailPopup.js
import React from 'react';

const EmailPopup = ({ email }) => {
  return (
    <div className="email-popup">
      <div className="email-header">
        <span className="email-icon">💌</span>
        <span className="email-subject">{email.subject}</span>
      </div>
      <div className="email-body">
        {email.body}
      </div>
      <div className="email-cta">
        <button className="claim-button">
          {email.buttonText}
        </button>
      </div>
    </div>
  );
};

export default EmailPopup;
