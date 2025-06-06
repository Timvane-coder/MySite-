// components/Character.js
import React from 'react';

const Character = ({ type, isShaking = false }) => {
  const getCharacterClass = () => {
    const baseClass = 'character';
    const typeClass = `character-${type}`;
    const shakeClass = isShaking ? 'shaking' : '';
    return `${baseClass} ${typeClass} ${shakeClass}`.trim();
  };

  return <div className={getCharacterClass()}></div>;
};

export default Character;
