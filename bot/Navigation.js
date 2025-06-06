// components/Navigation.js
import React from 'react';

const Navigation = ({ 
  currentScene, 
  totalScenes, 
  onNext, 
  onPrevious, 
  onRestart,
  onGoToScene,
  isAutoPlay,
  onToggleAutoPlay
}) => {
  return (
    <div className="navigation">
      <button 
        className="nav-btn"
        onClick={onPrevious}
        disabled={currentScene === 1}
      >
        ← Previous
      </button>
      
      <div className="scene-selector">
        <select 
          value={currentScene} 
          onChange={(e) => onGoToScene(parseInt(e.target.value))}
          className="scene-select"
        >
          {Array.from({ length: totalScenes }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Scene {i + 1}
            </option>
          ))}
        </select>
      </div>

      <button 
        className="nav-btn"
        onClick={onNext}
        disabled={currentScene === totalScenes}
      >
        Next →
      </button>

      <button className="nav-btn" onClick={onRestart}>
        🔄 Restart
      </button>

      <button 
        className={`nav-btn ${isAutoPlay ? 'active' : ''}`}
        onClick={onToggleAutoPlay}
      >
        {isAutoPlay ? '⏸️ Pause' : '▶️ Auto'}
      </button>
    </div>
  );
};

export default Navigation;
