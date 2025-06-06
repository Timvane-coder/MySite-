// components/PhoneInterface.js
import React from 'react';

const PhoneInterface = ({ website }) => {
  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="browser-bar">
          <div className="url-bar suspicious">
            🌐 {website.url}
          </div>
        </div>
        <div className="website-content">
          <div className="site-header">{website.header}</div>
          <div className="form-container">
            {website.formFields.map((field, index) => (
              <input
                key={index}
                type={field.type}
                placeholder={field.placeholder}
                className={field.suspicious ? 'suspicious-field' : ''}
                readOnly
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneInterface;
