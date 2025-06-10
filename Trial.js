


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
          }}
        >
          🔑
        </div>
      ))}
    </div>
  );
};

export default PasswordTrail;

// src/components/VirusSwirl.js
import React from 'react';

const VirusSwirl = () => {
  return (
    <div className="virus-swirl">
      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={i}
          className="virus-particle"
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${1 + Math.random()}s`
          }}
        >
          🦠
        </div>
      ))}
    </div>
  );
};

export default VirusSwirl;

// src/data/storyData.js
export const storyData = [
  {
    id: 1,
    type: 'intro',
    title: 'Rapunzel: The Shared Password Peril',
    narration: "High in a tower surrounded by firewalls and fiber-optic forests, lived Rapunzel — a curious girl with a long golden password.",
    backgroundClass: 'tower-bg',
  },
  {
    id: 2,
    type: 'password-reuse',
    title: 'One Password to Rule Them All',
    narration: "She used just one password for everything — from enchanted mail to fairy-tune playlists.",
    password: 'Rapunzel123!',
    accounts: [
      { name: 'Enchanted Mail', icon: '/images/mail-icon.jpg' },
      { name: 'Fairy-Tune Playlists', icon: '/images/music-icon.jpg' },
      { name: 'Scroll-Shop', icon: '/images/shop-icon.jpg' },
      { name: 'Cloud Castle Drive', icon: '/images/cloud-icon.jpg' }
    ],
    backgroundClass: 'password-bg',
  },
  {
    id: 3,
    type: 'friend-request',
    title: 'The Friend Request',
    narration: "And one day, someone charming slid into her DMs…",
    message: "Hey Rapunzel, mind sharing your login so I can stream your royal playlist?",
    backgroundClass: 'message-bg',
  },
  {
    id: 4,
    type: 'oversharing',
    title: 'Rapunzel Overshares',
    narration: "She didn't think twice — after all, what harm could it do?",
    response: "Sure! It's Rapunzel123!",
    backgroundClass: 'sharing-bg',
  },
  {
    id: 5,
    type: 'password-spread',
    title: 'The Spread',
    narration: "But that one password opened every door…",
    compromisedAccounts: [
      { type: 'cloud', name: 'Cloud Drive' },
      { type: 'bank', name: 'Magic Bank' },
      { type: 'social', name: 'Social Scroll' },
      { type: 'shopping', name: 'Scroll Shop' }
    ],
    backgroundClass: 'dark-bg',
  },
  {
    id: 6,
    type: 'accounts-attacked',
    title: 'Accounts Under Attack',
    narration: "Her playlist gets renamed to 'Dark Tunes Only.' Her food orders redirect to 'Swamp Tower #13.'",
    notifications: [
      { icon: '🚨', text: 'New Login from Unknown Location', type: 'danger' },
      { icon: '💰', text: 'Scrollshop Order Confirmed – 37 Gold Coins', type: 'warning' },
      { icon: '🎵', text: 'Playlist renamed to "Dark Tunes Only"', type: 'warning' },
      { icon: '🏠', text: 'Delivery address changed to Swamp Tower #13', type: 'danger' }
    ],
    damages: [
      { icon: '🎵', text: 'Playlist Hijacked' },
      { icon: '🛒', text: 'Unauthorized Orders' },
      { icon: '📧', text: 'Email Compromised' },
      { icon: '💳', text: 'Payment Info Stolen' }
    ],
    backgroundClass: 'chaos-bg',
  },
  {
    id: 7,
    type: 'virus-attack',
    title: 'Dark Spells Unleashed',
    narration: "Her once-magical online world turned into a chaotic digital dungeon.",
    chaosEffects: [
      'Files mysteriously deleting...',
      'Spam messages flooding friends...',
      '"Rapunzel loves trolls" memes posted...',
      'Personal photos leaked...'
    ],
    backgroundClass: 'virus-bg',
  },
  {
    id: 8,
    type: 'cyber-fairy',
    title: 'Fairy Cybermother Appears',
    narration: "Her Cyber-Godmother arrived — ready to untangle the mess.",
    message: "Did you reuse your password... everywhere?",
    tools: [
      { type: 'wand', alt: 'Magic Security Wand' },
      { type: 'shield', alt: 'Digital Shield' },
      { type: 'key', alt: 'Master Key' }
    ],
    backgroundClass: 'fairy-bg',
  },
  {
    id: 9,
    type: 'password-reset',
    title: 'The Undo Spell Begins',
    narration: "They worked together to change every password, one spell at a time.",
    actions: [
      { icon: 'password-manager', text: 'Open Password Manager', alt: 'Password Manager' },
      { icon: 'unique-passwords', text: 'Create Unique Passwords', alt: 'Unique Passwords' },
      { icon: '2fa-setup', text: 'Enable 2FA', alt: 'Two Factor Authentication' },
      { icon: 'secure-backup', text: 'Secure Backup Codes', alt: 'Backup Codes' }
    ],
    backgroundClass: 'reset-bg',
  },
  {
    id: 10,
    type: 'security-setup',
    title: 'Locking the Tower',
    narration: "They added extra protection — so only Rapunzel could enter her accounts.",
    securityFeatures: [
      { type: 'dragon-guard', text: 'Digital Dragon Guardian', alt: 'Security Dragon' },
      { type: 'biometric', text: 'Biometric Scan Access', alt: 'Biometric Scanner' },
      { type: 'fortress-mode', text: 'Fortress Mode Enabled', alt: 'Digital Fortress' }
    ],
    backgroundClass: 'security-bg',
  },
  {
    id: 11,
    type: 'prince-revealed',
    title: 'The Prince Revealed',
    narration: "The charming 'Prince' was just a troll phishing for access.",
    revealMessage: "Prince_Ch4rmz was actually a cybertroll using social engineering!",
    backgroundClass: 'reveal-bg',
  },
  {
    id: 12,
    type: 'secure-rapunzel',
    title: 'Rapunzel Rebuilt & Ready',
    narration: "Rapunzel learned that love is kind… but password hygiene is kinder.",
    newPasswords: [
      { account: 'Enchanted Mail', password: 'Tower$Secure4Ever!2025' },
      { account: 'Fairy-Tunes', password: 'Music&Magic#2025!' },
      { account: 'Scroll-Shop', password: 'Shop$afely&Smart2025' }
    ],
    backgroundClass: 'secure-bg',
  },
  {
    id: 13,
    type: 'lessons',
    title: 'Final Lessons',
    narration: "Be like Rapunzel — let your firewall down only for those you trust… and only after 2FA.",
    checklist: [
      'Never share your password',
      'Use unique passwords per account',
      'Enable two-factor authentication',
      'Use a password manager',
      'Watch for charmers with phishing hooks'
    ],
    backgroundClass: 'lessons-bg',
  },
  {
    id: 14,
    type: 'end',
    title: 'Stay Private. Stay Powerful.',
    narration: "And they all lived securely ever after, with strong passwords protecting their digital kingdom!",
    website: "www.cyberwise.org/rapunzel",
    backgroundClass: 'end-bg',
  },
];
