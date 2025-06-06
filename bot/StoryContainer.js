// components/StoryContainer.js
import React from 'react';
import Scene from './Scene';
import Sparkles from './Sparkles';

const StoryContainer = ({ currentScene, totalScenes, storyData }) => {
  const currentStoryData = storyData[currentScene - 1];
  const showSparkles = [1, 7, 11].includes(currentScene);

  return (
    <div className="story-container">
      {showSparkles && <Sparkles />}
      <Scene
        sceneData={currentStoryData}
        sceneNumber={currentScene}
        totalScenes={totalScenes}
      />
    </div>
  );
};

export default StoryContainer;
