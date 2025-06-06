// components/Scene.js
import React, { useEffect, useState } from 'react';
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
    switch(sceneData.type) {
      case 'intro':
        return (
          <div className="intro-content">
            <div className="kingdom-icons">
              <span className="castle">🏰</span>
              <span className="antenna">📡</span>
              <span className="castle">🏰</span>
            </div>
          </div>
        );

      case 'social-life':
        return (
          <div className="social-content">
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
                <div key={index} className="security-icon" style={{animationDelay: `${index * 0.2}s`}}>
                  {icon}
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

      case 'hack-attack':
        return (
          <div className="hack-content">
            <Character type="cinderella" isShaking={true} />
            {sceneData.alerts.map((alert, index) => (
              <SecurityAlert 
                key={index} 
                alert={alert} 
                delay={index * 0.5}
              />
            ))}
          </div>
        );

      case 'fairy-godit':
        return (
          <div className="fairy-content">
            <Character type="fairy-godit" />
            <div className="tools-row">
              {sceneData.tools.map((tool, index) => (
                <span key={index} className="tool-icon">{tool}</span>
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
                <div key={index} className="cleanup-action" style={{animationDelay: `${index * 0.3}s`}}>
                  {action}
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
                <span key={index} className="indicator">{indicator}</span>
              ))}
            </div>
            <div className="password-display">
              <div className="label">New Password:</div>
              <div className="password">{sceneData.newPassword}</div>
            </div>
          </div>
        );

      case 'lessons':
        return (
          <div className="lessons-content">
            <Checklist items={sceneData.checklist} />
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
            <div className="music-notes">🎵 ✨ 🏰 ✨ 🎵</div>
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
      
      <div className="scene-content">
        {renderSceneContent()}
      </div>
      
      <div className="narration">
        {sceneData.narration}
      </div>
    </div>
  );
};

export default Scene;
