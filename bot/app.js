// App.js - Main Application Component
import React, { useState, useEffect } from 'react';
import './App.css';
import StoryContainer from './components/StoryContainer';
import Navigation from './components/Navigation';
import { storyData } from './data/storyData';

function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const totalScenes = storyData.length;

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch(event.key) {
        case 'ArrowRight':
        case ' ':
          nextScene();
          break;
        case 'ArrowLeft':
          previousScene();
          break;
        case 'Home':
          restartStory();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentScene]);

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        if (currentScene < totalScenes) {
          setCurrentScene(prev => prev + 1);
        } else {
          setCurrentScene(1);
        }
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [isAutoPlay, currentScene, totalScenes]);

  const nextScene = () => {
    if (currentScene < totalScenes) {
      setCurrentScene(currentScene + 1);
    }
  };

  const previousScene = () => {
    if (currentScene > 1) {
      setCurrentScene(currentScene - 1);
    }
  };

  const restartStory = () => {
    setCurrentScene(1);
  };

  const goToScene = (sceneNumber) => {
    if (sceneNumber >= 1 && sceneNumber <= totalScenes) {
      setCurrentScene(sceneNumber);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <div className="app">
      <StoryContainer 
        currentScene={currentScene}
        totalScenes={totalScenes}
        storyData={storyData}
      />
      <Navigation
        currentScene={currentScene}
        totalScenes={totalScenes}
        onNext={nextScene}
        onPrevious={previousScene}
        onRestart={restartStory}
        onGoToScene={goToScene}
        isAutoPlay={isAutoPlay}
        onToggleAutoPlay={toggleAutoPlay}
      />
    </div>
  );
}

export default App;
