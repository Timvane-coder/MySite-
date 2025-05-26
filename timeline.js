///////////////////////////////////
/* Enhanced GSAP Animation Implementation */
///////////////////////////////////

// Animation timing constants (in milliseconds)
const ANIMATION_TIMINGS = {
  welcome: 16750,
  candDetailModelTop: 1800,
  modelTopCandDetail: 1900,
  modelTopContents: 1200,
  logoForward: 1200,
  logoBackward: 1200,
  contact3: 4000,
  contact3Back: 5000,
  contact2: 6400,
  contact2Back: 7200
};

// Page configuration object
const PAGE_CONFIG = {
  content: {
    flame: "#cont_flame",
    description: "#desc1",
    detailPg: "#details-cont",
    offset: "500vh",
    animDelay: [10000, 7900],
    threeDAnimation: [anim_candidate, anim_candidate_back],
    threeDAnimDelay: [6.0, 3.5],
    threeDAnimTop: [anim_candidate_top, anim_candidate_top_back],
    threeDAnimTopDelay: [6400, 7200],
  },
  candidates: {
    flame: "#cands_flame",
    description: "#desc3",
    detailPg: "#details-cands",
    offset: "700vh",
    animDelay: [10500, 11700],
    threeDAnimation: [anim_candidate, anim_candidate_back],
    threeDAnimDelay: [6.5, 7.0],
    threeDAnimTop: [anim_candidate_top, anim_candidate_top_back],
    threeDAnimTopDelay: [6400, 7200],
  },
};

// Animation state management
class AnimationController {
  constructor() {
    this.master = gsap.timeline();
    this.isPortrait = () => window.innerHeight > window.innerWidth;
    this.init();
  }

  init() {
    // Hide PDF button initially
    $("#pdfBtn").hide();
    
    // Setup initial states
    this.master.set([".description", ".flame", "#flashingLogoCopy"], {
      autoAlpha: 0,
    });

    // Register custom effects
    this.registerFlameEffect();
    this.setupGlowAnimation();
    
    // Initialize based on session state
    this.initializeSequence();
  }

  registerFlameEffect() {
    gsap.registerEffect({
      name: "flame",
      effect: (targets, config) => {
        return gsap
          .timeline({ repeat: config.time })
          .set(targets, { rotation: 0, clearProps: "all" })
          .to(targets, { duration: 0.25, autoAlpha: 1 })
          .to(targets, {
            duration: 0.5,
            rotation: -360,
            repeat: 2,
            ease: "none",
            transformOrigin: "0% 50%",
          }, "-=0.25")
          .to(targets, { duration: 0.25, autoAlpha: 0 });
      },
      defaults: {},
      extendTimeline: true,
    });
  }

  setupGlowAnimation() {
    // Continuous glow effect for logo
    gsap.to("#glowCopy feDropShadow", {
      duration: 2,
      attr: { stdDeviation: 0 },
      repeat: -1,
      yoyo: true,
    });
  }

  // Enhanced logo gradient animation
  applyGradientToLogo() {
    const elements = document.querySelectorAll(".svganim");
    elements.forEach(el => el.setAttribute("fill", "url(#theGradient)"));
  }

  // Optimized welcome message popup
  createWelcomeMessage() {
    const container = $("#message");
    const words = ["WELCOME", "TO", "THE", "FUTURE", "OF", "FINANCIAL", "UNDERSTANDING"];
    const tl = gsap.timeline();
    let time = 0;

    words.forEach((word, i) => {
      const midIndex = word.length === 1 ? 0 : 
                      word.length === 6 ? 2 : 
                      Math.floor(word.length / 2);
      
      const element = $(`
        <h3>
          ${word.substring(0, midIndex)}
          <span>${word[midIndex]}</span>
          ${word.substring(midIndex + 1)}
        </h3>
      `).appendTo(container);

      // Dynamic positioning based on word length
      const transforms = {
        2: "translate(-75%, -50%)",
        6: "translate(-45%, -50%)",
        10: "translate(-53%, -50%)"
      };
      
      if (transforms[word.length] || word.length > 10) {
        element.css("transform", transforms[word.length] || transforms[10]);
      }

      // Staggered animation timing
      const durations = {
        appear: i === 0 ? 0.15 : 0.05,
        stay: [0.35, 0.25, 0.25, 0.35, 0.35, 0.25, 0.45][i] || 0.35,
        disappear: i === words.length - 1 ? 0.1 : 0.02
      };

      gsap.set(element, { autoAlpha: 0, scale: i === 0 ? 2 : 1 });
      
      tl.to(element, durations.appear, { 
        autoAlpha: 1, 
        scale: 1 
      }, time)
      .to(element, durations.disappear, { 
        autoAlpha: 0,
        scale: i === words.length - 1 ? 0 : 1
      }, `+=${durations.stay}`);

      time += durations.appear + durations.stay + 0.05;
    });

    return tl;
  }

  // Main logo to welcome to 3D transition
  createLogoWelcome3DSequence(skipIntro = false) {
    const tl = gsap.timeline();
    
    tl.to("#vertLine stop", {
      delay: 1,
      duration: 3,
      attr: { offset: "0%" },
      ease: "none",
      onComplete: () => this.applyGradientToLogo(),
    })
    .to("#topStop", {
      duration: 1.5,
      delay: 1,
      attr: { offset: "0%" },
      ease: "none",
    })
    .to("#topStop", {
      duration: 0.5,
      attr: { "stop-color": "#666" },
    })
    .to(".company-logo-name-page", {
      delay: 0.5,
      duration: 1.5,
      autoAlpha: 0,
      ease: "none",
    })
    .to(".company-logo-name-page", {
      duration: 0.5,
      y: "-200vh",
    })
    .to(".welcome-page", {
      duration: 0.5,
      y: "-100vh",
      onComplete: () => this.createWelcomeMessage(),
    }, "-=0.5")
    .to(".welcome-page", {
      duration: 0.01,
      y: "-200vh",
    }, "+=3.3")
    .to(".threeD-panel", {
      duration: 0.01,
      y: "-200vh",
    }, "-=0.01")
    .call(() => {
      if (typeof render === 'function') render();
      if (!skipIntro && typeof anim_start === 'function') anim_start();
    })
    .to(".threeD-panel", {
      duration: 1.5,
      autoAlpha: 1,
    });

    return tl;
  }

  // Floating logo appearance animation
  createFlashingLogoAnimation() {
    const tl = gsap.timeline();
    
    tl.set("#flashingLogo", {
      autoAlpha: 1,
      x: "-8vw",
      rotation: -120,
    })
    .set("#fl-contact span", { autoAlpha: 0 })
    .to("#fl-contact", {
      duration: 0.1,
      y: "-200vh",
    })
    .to("#flashingLogo", {
      duration: 1.5,
      x: 4,
      rotation: 0,
      ease: "slow(0.7, 0.1, false)",
    })
    .to("#hamburgerMenu", {
      duration: 1.5,
      autoAlpha: 1,
    }, "-=1.5")
    .to("#fl-contact span", {
      duration: 1,
      autoAlpha: 1,
    });

    // Continuous glow for interactive elements
    gsap.to(["#glow feDropShadow", "#hamglow feDropShadow"], {
      duration: 2,
      attr: { stdDeviation: 0 },
      repeat: -1,
      yoyo: true,
    });

    return tl;
  }

  // Flame and description animation
  createFlameDescSequence(pageType) {
    const config = PAGE_CONFIG[pageType];
    if (!config) return gsap.timeline();

    return gsap.timeline()
      .flame(config.flame, { time: 2 })
      .to(config.description, {
        duration: 1,
        autoAlpha: 1,
      }, "-=3")
      .to(config.description, {
        duration: 1,
        autoAlpha: 0,
      });
  }

  // Contact/back button transition
  createContactTransition(enable3D = true) {
    const tl = gsap.timeline();

    tl.set("#fl-back", { autoAlpha: 0 })
    .to("#fl-contact", {
      duration: 1,
      autoAlpha: 0,
      ease: "slow(0.7, 0.1, false)",
    })
    .set("#hamburgerMenu", { display: "none" });

    if (enable3D) {
      const scaleConfig = this.isPortrait() 
        ? { x: "46vw", y: "25vh", scale: 10 }
        : { x: "26vw", y: "32vh", scale: 7 };

      tl.to("#flashingLogoCopy", {
        duration: 1.7,
        autoAlpha: 1,
        x: scaleConfig.x,
        y: scaleConfig.y,
        scaleX: scaleConfig.scale,
        scaleY: scaleConfig.scale,
        rotationY: 360,
        ease: "slow(0.7, 0.1, false)",
      }, "-=0.5");
    }

    tl.to("#fl-contact", {
      duration: 0.1,
      y: "200vh",
    })
    .to("#fl-back", {
      duration: 0.1,
      y: "-300vh",
    }, "-=0.1");

    return tl;
  }

  // Pointer events management
  togglePointerEvents(duration) {
    const elements = ".logo, .floating-logo, .backBtns, .mainContent-title, .getStarted, #hamburgerMenu";
    
    $(elements).css("pointer-events", "none");
    
    setTimeout(() => {
      $(elements).css("pointer-events", "auto");
    }, duration);
  }

  // Initialize the complete animation sequence
  initializeSequence() {
    const hasStoredState = sessionStorage.getItem("cameraPos") !== null;
    
    if (hasStoredState) {
      this.master
        .add(this.createLogoWelcome3DSequence(true))
        .add(this.createFlashingLogoAnimation());
    } else {
      this.master
        .add(this.createLogoWelcome3DSequence(false))
        .add(this.createFlashingLogoAnimation())
        .add(() => {
          if (typeof mainPgContentsAppear === 'function') {
            mainPgContentsAppear();
          }
        }, "+=15");
    }
  }

  // Public methods for external control
  playFlameSequence(pageType) {
    return this.createFlameDescSequence(pageType);
  }

  playContactTransition(enable3D = true) {
    return this.createContactTransition(enable3D);
  }

  disableInteraction(duration) {
    this.togglePointerEvents(duration);
  }
}

// Initialize the animation controller
const animController = new AnimationController();

// Export for external use
window.animController = animController;

// Legacy function exports for backward compatibility
window.flameDescDisappear = (type) => animController.playFlameSequence(type);
window.fl_contact_goback = (threeAnim) => animController.playContactTransition(threeAnim);
window.pointer = (time) => animController.disableInteraction(time)
