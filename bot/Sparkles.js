// components/Sparkles.js
import React, { useEffect, useState } from 'react';

const Sparkles = () => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2
    }));

    setSparkles(newSparkles);

    const timer = setTimeout(() => {
      setSparkles([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="sparkles-container">
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default Sparkles;
