// components/Checklist.js
import React from 'react';

const Checklist = ({ items }) => {
  return (
    <div className="checklist">
      {items.map((item, index) => (
        <div 
          key={index}
          className="checklist-item"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          ✅ {item}
        </div>
      ))}
    </div>
  );
};

export default Checklist;
               
