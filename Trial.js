


// src/components/StoryContainer.js
import React from 'react';
import Scene from './Scene';
import MagicalSparkles from './MagicalSparkles';
import PasswordTrail from './PasswordTrail';
import VirusSwirl from './VirusSwirl';

const StoryContainer = ({ currentScene, totalScenes, storyData }) => {
  const currentStoryData = storyData[currentScene - 1];
  const showSparkles = [1, 8, 9, 12, 14].includes(currentScene); // Magical scenes
  const showPasswordTrail = [2, 5].includes(currentScene); // Password spreading
  const showVirusSwirl = [7].includes(currentScene); // Virus attack

  return (
    <div className="story-container rapunzel-container">
      {showSparkles && <MagicalSparkles />}
      {showPasswordTrail && <PasswordTrail />}
      {showVirusSwirl && <VirusSwirl />}
      <Scene
        sceneData={currentStoryData}
        sceneNumber={currentScene}
        totalScenes={totalScenes}
      />
    </div>
  );
};

export default StoryContainer;

// src/components/Character.js
import React from 'react';

const Character = ({ type, isShaking = false, isGlowing = false }) => {
  const getCharacterClass = () => {
    const baseClass = 'character';
    const typeClass = `character-${type}`;
    const shakeClass = isShaking ? 'shaking' : '';
    const glowClass = isGlowing ? 'glowing' : '';
    return `${baseClass} ${typeClass} ${shakeClass} ${glowClass}`.trim();
  };

  const getCharacterImage = () => {
    switch(type) {
      case 'rapunzel':
        return '/images/rapunzel.jpg';
      case 'prince-charm':
        return '/images/prince-charm.jpg';
      case 'troll-revealed':
        return '/images/troll.jpg';
      case 'cyber-fairy':
        return '/images/cyber-fairy.jpg';
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
import PasswordDisplay from './PasswordDisplay';
import MessageBubble from './MessageBubble';
import LoginScreen from './LoginScreen';
import NotificationPanel from './NotificationPanel';
import SecurityChecklist from './SecurityChecklist';
import TowerView from './TowerView';
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
            <TowerView />
            <Character type="rapunzel" />
            <div className="digital-forest">
              <img src={assetMap.digitalForest} alt="Digital Forest" className="forest-bg" loading="lazy" />
            </div>
            <div className="firewall-effects">
              <img src={assetMap.firewall} alt="Firewall" className="firewall-img" loading="lazy" />
            </div>
          </div>
        );

      case 'password-reuse':
        return (
          <div className="password-content">
            <Character type="rapunzel" />
            <PasswordDisplay password={sceneData.password} />
            <div className="login-screens">
              {sceneData.accounts.map((account, index) => (
                <LoginScreen 
                  key={index} 
                  account={account} 
                  password={sceneData.password}
                  delay={index * 0.3}
                />
              ))}
            </div>
          </div>
        );

      case 'friend-request':
        return (
          <div className="message-content">
            <Character type="rapunzel" />
            <div className="tablet-interface">
              <img src={assetMap.tablet} alt="Tablet" className="tablet-bg" loading="lazy" />
              <MessageBubble 
                sender="Prince_Ch4rmz"
                message={sceneData.message}
                isIncoming={true}
              />
            </div>
          </div>
        );

      case 'oversharing':
        return (
          <div className="sharing-content">
            <Character type="rapunzel" isShaking={true} />
            <MessageBubble 
              sender="Rapunzel"
              message={sceneData.response}
              isIncoming={false}
              isWarning={true}
            />
          </div>
        );

      case 'password-spread':
        return (
          <div className="spread-content">
            <div className="dark-hands">
              {sceneData.compromisedAccounts.map((account, index) => (
                <div key={index} className="compromised-account" style={{ animationDelay: `${index * 0.4}s` }}>
                  <img
                    src={getAsset('accounts', account.type)}
                    alt={account.name}
                    className="account-icon"
                    loading="lazy"
                  />
                  <div className="hack-indicator">⚠️</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'accounts-attacked':
        return (
          <div className="attack-content">
            <Character type="rapunzel" isShaking={true} />
            <NotificationPanel notifications={sceneData.notifications} />
            <div className="chaos-indicators">
              {sceneData.damages.map((damage, index) => (
                <div key={index} className="damage-item" style={{ animationDelay: `${index * 0.2}s` }}>
                  <span className="damage-icon">{damage.icon}</span>
                  <span className="damage-text">{damage.text}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'virus-attack':
        return (
          <div className="virus-content">
            <Character type="rapunzel" isShaking={true} />
            <div className="virus-effects">
              <img src={assetMap.digitalVirus} alt="Digital Virus" className="virus-swirl" loading="lazy" />
            </div>
            <div className="chaos-messages">
              {sceneData.chaosEffects.map((effect, index) => (
                <div key={index} className="chaos-effect" style={{ animationDelay: `${index * 0.3}s` }}>
                  {effect}
                </div>
              ))}
            </div>
          </div>
        );

      case 'cyber-fairy':
        return (
          <div className="fairy-content">
            <Character type="cyber-fairy" isGlowing={true} />
            <Character type="rapunzel" />
            <div className="fairy-dialogue">
              <div className="speaker">Cyber-Godmother says:</div>
              <div className="message">{sceneData.message}</div>
            </div>
            <div className="magic-tools">
              {sceneData.tools.map((tool, index) => (
                <div key={index} className="magic-tool">
                  <img
                    src={getAsset('tools', tool.type)}
                    alt={tool.alt}
                    className="tool-img"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'password-reset':
        return (
          <div className="reset-content">
            <div className="characters-row">
              <Character type="rapunzel" />
              <Character type="cyber-fairy" isGlowing={true} />
            </div>
            <div className="reset-actions">
              {sceneData.actions.map((action, index) => (
                <div key={index} className="reset-action" style={{ animationDelay: `${index * 0.4}s` }}>
                  <img
                    src={getAsset('actions', action.icon)}
                    alt={action.alt}
                    className="action-icon"
                    loading="lazy"
                  />
                  <span className="action-text">{action.text}</span>
                  <div className="success-check">✓</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security-setup':
        return (
          <div className="security-content">
            <Character type="rapunzel" />
            <div className="security-measures">
              {sceneData.securityFeatures.map((feature, index) => (
                <div key={index} className="security-feature" style={{ animationDelay: `${index * 0.3}s` }}>
                  <img
                    src={getAsset('security', feature.type)}
                    alt={feature.alt}
                    className="security-img"
                    loading="lazy"
                  />
                  <span className="feature-text">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'prince-revealed':
        return (
          <div className="reveal-content">
            <div className="transformation">
              <Character type="prince-charm" />
              <div className="transform-arrow">→</div>
              <Character type="troll-revealed" />
            </div>
            <div className="reveal-text">
              <div className="warning-badge">⚠️ PHISHING ALERT ⚠️</div>
              <div className="reveal-message">{sceneData.revealMessage}</div>
            </div>
          </div>
        );

      case 'secure-rapunzel':
        return (
          <div className="secure-content">
            <Character type="rapunzel" isGlowing={true} />
            <div className="new-passwords">
              {sceneData.newPasswords.map((pwd, index) => (
                <div key={index} className="password-example">
                  <div className="account-name">{pwd.account}</div>
                  <div className="strong-password">{pwd.password}</div>
                  <div className="strength-indicator">🔒 Strong</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'lessons':
        return (
          <div className="lessons-content">
            <SecurityChecklist items={sceneData.checklist} />
          </div>
        );

      case 'end':
        return (
          <div className="end-content">
            <EndSeal />
            <div className="final-message">
              <div className="motto">Stay Private. Stay Powerful.</div>
              <div className="website">{sceneData.website}</div>
            </div>
            <div className="secure-castle">
              <img src={assetMap.secureCastle} alt="Secure Digital Castle" className="castle-img" loading="lazy" />
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

// src/components/PasswordDisplay.js
import React from 'react';

const PasswordDisplay = ({ password, isGlowing = true }) => {
  return (
    <div className={`password-display ${isGlowing ? 'glowing' : ''}`}>
      <div className="password-label">Golden Password:</div>
      <div className="password-text">{password}</div>
      <div className="warning-text">⚠️ Used everywhere!</div>
    </div>
  );
};

export default PasswordDisplay;

// src/components/MessageBubble.js
import React from 'react';

const MessageBubble = ({ sender, message, isIncoming, isWarning = false }) => {
  return (
    <div className={`message-bubble ${isIncoming ? 'incoming' : 'outgoing'} ${isWarning ? 'warning' : ''}`}>
      <div className="sender-name">{sender}</div>
      <div className="message-text">{message}</div>
      {isWarning && <div className="warning-icon">⚠️</div>}
    </div>
  );
};

export default MessageBubble;

// src/components/LoginScreen.js
import React from 'react';

const LoginScreen = ({ account, password, delay = 0 }) => {
  return (
    <div className="login-screen" style={{ animationDelay: `${delay}s` }}>
      <div className="login-header">
        <img src={account.icon} alt={account.name} className="login-icon" />
        <h3>{account.name}</h3>
      </div>
      <div className="login-form">
        <input type="text" placeholder="Username" value="rapunzel" readOnly />
        <input type="password" placeholder="Password" value={password} readOnly />
        <div className="password-trail">✨</div>
      </div>
    </div>
  );
};

export default LoginScreen;

// src/components/NotificationPanel.js
import React from 'react';

const NotificationPanel = ({ notifications }) => {
  return (
    <div className="notification-panel">
      <div className="panel-header">📱 Notifications</div>
      <div className="notifications-list">
        {notifications.map((notification, index) => (
          <div 
            key={index} 
            className={`notification ${notification.type}`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="notification-icon">{notification.icon}</div>
            <div className="notification-text">{notification.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;

// src/components/SecurityChecklist.js
import React from 'react';

const SecurityChecklist = ({ items }) => {
  return (
    <div className="security-checklist">
      <div className="checklist-header">🔐 Security Lessons</div>
      <div className="checklist-items">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="checklist-item"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <div className="check-icon">✅</div>
            <div className="item-text">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityChecklist;

// src/components/TowerView.js
import React from 'react';
import { assetMap } from '../data/assetMap';

const TowerView = () => {
  return (
    <div className="tower-view">
      <img src={assetMap.tower} alt="Rapunzel's Tower" className="tower-img" />
      <div className="tower-window">
        <div className="window-glow"></div>
      </div>
    </div>
  );
};

export default TowerView;

// src/components/EndSeal.js
import React from 'react';

const EndSeal = () => {
  return (
    <div className="end-seal">
      <div className="seal-circle">
        <div className="crown-icon">👑</div>
        <div className="seal-text">SECURED</div>
      </div>
    </div>
  );
};

export default EndSeal;

// src/components/MagicalSparkles.js
import React from 'react';

const MagicalSparkles = () => {
  return (
    <div className="magical-sparkles">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

export default MagicalSparkles;

// src/components/PasswordTrail.js
import React from 'react';

const PasswordTrail = () => {
  return (
    <div className="password-trail">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="trail-particle"
          style={{
            animationDelay: `${i * 0.2}s`
    
