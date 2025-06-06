
// data/storyData.js
export const storyData = [
  {
    id: 1,
    type: 'intro',
    title: '🏰 Cinderella 2.0 ✨ The Digital Footprint',
    narration: "Once upon a time... in a modern kingdom filled with smartphones and Wi-Fi... lived a cheerful young woman named Cinderella.",
    backgroundClass: 'kingdom-bg'
  },
  {
    id: 2,
    type: 'social-life',
    title: "Cinderella's Social Life",
    narration: "Cinderella loved sharing her life online. Her breakfast? Posted. Her pet's name? Hashtagged. Her mother's maiden name? In a nostalgic Facebook post.",
    socialPosts: [
      { content: "📸 Me & Maxie 💕 #PuppyLove", likes: 42, warning: true },
      { content: "👩‍👧 Mom & me in the 90s! 💖 (Maiden name: Benson 🫣)", likes: 28, warning: true },
      { content: "🎉 Can't wait for my b-day June 6!", likes: 56, warning: true }
    ],
    backgroundClass: 'social-bg'
  },
  {
    id: 3,
    type: 'stepsisters',
    title: 'The Cautious Stepsisters',
    narration: "Her stepsisters? They were careful. Private profiles, two-factor locks, and no oversharing.",
    dialogue: [
      "Don't post your birthday, Cindy!",
      "Use private mode at least!"
    ],
    securityIcons: ['🔒', '👓', '🛡️'],
    backgroundClass: 'secure-bg'
  },
  {
    id: 4,
    type: 'scam-message',
    title: 'The Mysterious Message',
    narration: "One day, a mysterious message appeared...",
    email: {
      subject: "Royal Invitation!",
      body: "You've been selected to attend the Royal Crypto Gala! Click here to confirm your invite!",
      buttonText: "✨ CLAIM NOW ✨"
    },
    backgroundClass: 'warning-bg'
  },
  {
    id: 5,
    type: 'phishing-site',
    title: 'The Suspicious Website',
    narration: "She didn't notice the strange web address... or the security question that seemed oddly specific.",
    website: {
      url: 'royal-crypto-palace.ru/claim',
      header: '👑 Royal Registration',
      formFields: [
        { type: 'text', placeholder: 'Name' },
        { type: 'email', placeholder: 'Email' },
        { type: 'password', placeholder: 'Password' },
        { type: 'text', placeholder: "Pet's name?", suspicious: true }
      ]
    },
    backgroundClass: 'danger-bg'
  },
  {
    id: 6,
    type: 'hack-attack',
    title: 'The Hack Attack!',
    narration: "Moments later, her bank sent a warning... and everything started unraveling.",
    alerts: [
      { icon: '🚨', text: 'New login from unknown device – Nigeria' },
      { icon: '💳', text: 'Bank Account: -$2,847' },
      { icon: '💔', text: 'Your photos used on fake dating profile' },
      { icon: '🚫', text: 'Access Denied - Account Locked' }
    ],
    backgroundClass: 'alert-bg'
  },
  {
    id: 7,
    type: 'fairy-godit',
    title: 'Fairy God-IT to the Rescue!',
    narration: "Her Fairy God-IT arrived — not with a wand, but with cybersecurity tools.",
    tools: ['⌨️', '🔐', '🛡️', '🧹'],
    message: "Reset your passwords. Enable 2FA. Sweep those social posts!",
    backgroundClass: 'magical-bg'
  },
  {
    id: 8,
    type: 'cleanup',
    title: 'The Digital Clean-Up',
    narration: "They worked hard to clean the mess. But some things couldn't be undone.",
    actions: [
      '✨ Password Manager: Active',
      '🗑️ Old Posts: Deleted',
      '📱 Authenticator App: Installed',
      '🔐 2FA: Enabled'
    ],
    backgroundClass: 'recovery-bg'
  },
  {
    id: 9,
    type: 'secure-cinderella',
    title: 'Cinderella 2.0: Secured',
    narration: "Cinderella learned that while glass slippers may shatter... digital footprints never fully disappear.",
    indicators: ['🔒', '✅', '🛡️'],
    newPassword: 'N3verShare!2025',
    backgroundClass: 'secure-bg'
  },
  {
    id: 10,
    type: 'lessons',
    title: 'Cybersecurity Lessons',
    narration: "Be like the secure Cinderella. Guard your digital life like royalty.",
    checklist: [
      "Don't overshare personal info",
      "Use strong, unique passwords",
      "Beware of phishing emails",
      "Enable 2FA everywhere",
      "Review privacy settings"
    ],
    backgroundClass: 'educational-bg'
  },
  {
    id: 11,
    type: 'end',
    title: 'The End',
    narration: "And they all lived securely ever after.",
    website: 'www.cyberwise.org/cinderella',
    backgroundClass: 'end-bg'
  }
];

