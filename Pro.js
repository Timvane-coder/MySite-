// src/App.js                                     import React, { useState, useEffect } from 'react';                                                 import './App.css';                               import StoryContainer from './components/StoryContainer';                                           import Navigation from './components/Navigation'; import { storyData } from './data/storyData';
                                                  function App() {                                    const [currentScene, setCurrentScene] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const totalScenes = storyData.length;

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
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
          setCurrentScene((prev) => prev + 1);
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

// components/Character.js
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
        <img src="/images/restart.jpg" alt="Restart" className="nav-icon" />
        Restart
      </button>

      <button
        className={`nav-btn ${isAutoPlay ? 'active' : ''}`}
        onClick={onToggleAutoPlay}
      >
        <img
          src={isAutoPlay ? "/images/pause.jpg" : "/images/play-icon.jpg"}
          alt={isAutoPlay ? "Pause" : "Play"}
          className="nav-icon"
        />
        {isAutoPlay ? 'Pause' : 'Auto'}
      </button>
    </div>
  );
};

export default Navigation;

import React from 'react';
import Scene from './Scene';
import Sparkles from './Sparkles';

const StoryContainer = ({ currentScene, totalScenes, storyData }) => {
  const currentStoryData = storyData[currentScene - 1];
  const showSparkles = [1, 10, 16, 18].includes(currentScene); // Updated scene numbers for sparkles

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

// components/Character.js
import React from 'react';

const Character = ({ type, isShaking = false }) => {
  const getCharacterClass = () => {
    const baseClass = 'character';
    const typeClass = `character-${type}`;
    const shakeClass = isShaking ? 'shaking' : '';
    return `${baseClass} ${typeClass} ${shakeClass}`.trim();
  };

  const getCharacterImage = () => {
    switch(type) {
      case 'cinderella':
        return '/images/Cinderella.jpg';
      case 'stepsister':
        return '/images/stepsister.jpg';
      case 'fairy-godit':
        return '/images/godit.jpg';
      default:
        return '/images/default-character.jpg';
    }
  };

  return (
    <div className={getCharacterClass()}>
      <img
        src={getCharacterImage()}
        alt={`${type} character`}
        className="character-image"
      />
    </div>
  );
};

export default Character;

// src/components/Scene.js
import React, { useEffect, useState } from 'react';
import { assetMap, getAsset } from '../data/assetMap';
import Character from './Character';
import SocialPost from './SocialPost';
import PhoneInterface from './PhoneInterface';
import EmailPopup from './EmailPopup';
import SecurityAlert from './SecurityAlert';
import Checklist from './Checklist';
import EndSeal from './EndSeal';


const Scene = ({ sceneData, sceneNumber, totalScenes }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [sceneNumber]);

  const renderSceneContent = () => {
    switch (sceneData.type) {
      case 'intro':
        return (
          <div className="intro-content">
            <div className="kingdom-icons">
              <img src={assetMap.castle} alt="Castle" className="castle-image" loading="lazy" />
              <img src={assetMap.antenna} alt="Signal Tower" className="antenna-image" loading="lazy" />
              <img src={assetMap.castle} alt="Castle" className="castle-image" loading="lazy" />
            </div>
            <div className="wifi-indicators">
              <img src={assetMap.wifi} alt="WiFi Signal" className="wifi-image" loading="lazy" />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="video-content">
            <video
              src={getAsset('videos', sceneData.video.type)}
              alt={sceneData.video.alt}
              className="scene-video"
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        );

      case 'social-life':
        return (
          <div className="social-content">
            <div className="room-background">
              <img src={assetMap.cinderellaRoom} alt="Cinderella's Room" className="room-bg" loading="lazy" />
            </div>
            <Character type="cinderella" />
            {sceneData.socialPosts.map((post, index) => (
              <SocialPost key={index} post={post} delay={index * 0.3} />
            ))}
          </div>
        );

      case 'stepsisters':
        return (
          <div className="stepsisters-content">
            <div className="characters-row">
              <Character type="stepsister" />
              <Character type="stepsister" />
            </div>
            <div className="dialogue-bubbles">
              {sceneData.dialogue.map((line, index) => (
                <div key={index} className="dialogue-bubble">
                  {line}
                </div>
              ))}
            </div>
            <div className="security-icons">
              {sceneData.securityIcons.map((icon, index) => (
                <div key={index} className="security-icon" style={{ animationDelay: `${index * 0.2}s` }}>
                  <img
                    src={getAsset('security', icon.type)}
                    alt={icon.alt}
                    className="security-img"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'scam-message':
        return (
          <div className="scam-content">
            <Character type="cinderella" />
            <EmailPopup email={sceneData.email} />
          </div>
        );

      case 'phishing-site':
        return (
          <div className="phishing-content">
            <PhoneInterface website={sceneData.website} />
          </div>
        );

      

      case 'fairy-godit':
        return (
          <div className="fairy-content">
            <Character type="fairy-godit" />
            <div className="tools-row">
              {sceneData.tools.map((tool, index) => (
                <div key={index} className="tool-icon">
                  <img
                    src={getAsset('tools', tool.type)}
                    alt={tool.alt}
                    className="tool-img"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="fairy-dialogue">
              <div className="speaker">Fairy God-IT says:</div>
              <div className="message">{sceneData.message}</div>
            </div>
          </div>
        );

      case 'cleanup':
        return (
          <div className="cleanup-content">
            <div className="characters-row">
              <Character type="cinderella" />
              <Character type="fairy-godit" />
            </div>
            <div className="cleanup-actions">
              {sceneData.actions.map((action, index) => (
                <div key={index} className="cleanup-action" style={{ animationDelay: `${index * 0.3}s` }}>
                  <img
                    src={getAsset('actions', action.icon)}
                    alt={action.alt}
                    className="action-icon"
                    loading="lazy"
                  />
                  <span className="action-text">{action.text}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'secure-cinderella':
        return (
          <div className="secure-content">
            <Character type="cinderella" />
            <div className="security-indicators">
              {sceneData.indicators.map((indicator, index) => (
                <div key={index} className="indicator">
                  <img
                    src={getAsset('indicators', indicator.type)}
                    alt={indicator.alt}
                    className="indicator-img"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="password-display">
              <div className="label">New Password:</div>
              <div className="password">{sceneData.newPassword}</div>
            </div>
          </div>
        );
      case 'end':
        return (
          <div className="end-content">
            <EndSeal />
            <div className="learn-more">
              <div className="title">Learn More:</div>
              <div className="website">{sceneData.website}</div>
            </div>
            <div className="music-notes">
              <img src={assetMap.musicalNotes} alt="Musical Notes" className="music-img" loading="lazy" />
            </div>
          </div>
        );

      default:
        return <div>Scene content not found</div>;
    }
  };

  return (
    <div className={`scene scene-${sceneNumber} ${sceneData.backgroundClass} ${isVisible ? 'active' : ''}`}>
      <div className="scene-counter">Scene {sceneNumber} / {totalScenes}</div>
      <div className="title">{sceneData.title}</div>
      <div className="scene-content">{renderSceneContent()}</div>
      <div className="narration">{sceneData.narration}</div>
    </div>
  );
};

export default Scene;

// src/data/storyData.js
export const storyData = [
  {
    id: 1,
    type: 'intro',
    title: 'Cinderella 2.0: The Digital Footprint',
    narration: "Once upon a time... in a modern kingdom filled with smartphones and Wi-Fi... lived a cheerful young woman named Cinderella.",
    backgroundClass: 'kingdom-bg',
  },
  {
    id: 2,
    type: 'video',
    title: 'Welcome to the Digital Kingdom',
    narration: "Explore the vibrant digital world where Cinderella connects with friends and shares her life online.",
    video: { type: 'digital-kingdom', alt: 'Digital Kingdom Video' },
    backgroundClass: 'video-bg',
  },
  {
    id: 3,
    type: 'social-life',
    title: "Cinderella's Social Life",
    narration: "Cinderella loved sharing her life online. Her breakfast? Posted. Her pet's name? Hashtagged. Her mother's maiden name? In a nostalgic Facebook post.",
    socialPosts: [
      { content: "Me & Maxie - Puppy Love!", likes: 42, warning: true, image: "puppy" },
      { content: "Mom & me in the 90s! (Maiden name: Benson)", likes: 28, warning: true, image: "family" },
      { content: "Can't wait for my b-day June 6!", likes: 56, warning: true, image: "birthday" },
    ],
    backgroundClass: 'social-bg',
  },
  {
    id: 4,
    type: 'stepsisters',
    title: 'The Cautious Stepsisters',
    narration: "Her stepsisters? They were careful. Private profiles, two-factor locks, and no oversharing.",
    dialogue: [
      "Don't post your birthday, Cindy!",
      "Use private mode at least!",
    ],
    securityIcons: [
      { type: 'lock', alt: 'Security Lock' },
      { type: 'privacy', alt: 'Privacy Shield' },
      { type: 'shield', alt: 'Protection Shield' },
      { type: '2fa', alt: 'Two Factor Authentication' },
    ],
    backgroundClass: 'secure-bg',
  },
  {
    id: 5,
    type: 'end',
    title: 'Happily Ever After... Online!',
    narration: "And they all lived securely ever after, browsing safely in the digital kingdom!",
    website: "www.staysafeonline.org",
    backgroundClass: 'end-bg',
  },
];

// src/data/assetMap.js
const fallbackImage = require('../assets/images/fallback.jpg');

export const assetMap = {
  // Security icons (used in stepsisters scene)
  security: {
    lock: require('../assets/images/security-lock.jpg'),


  },
  // Tool icons (used in fairy-godit scene)

  // Video assets (used in video scenes)
  videos: {
    'digital-kingdom': require('../assets/videos/intro.mp4'),

  },
  // Other images used across components
  castle: require('../assets/images/castle.jpg'),

};

// Helper function to get asset with fallback
export const getAsset = (category, type) => {
  try {
    return assetMap[category][type] || fallbackImage;
  } catch (error) {
    console.error(`Asset not found: ${category}/${type}`);
    return fallbackImage;
  }
};
