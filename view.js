///////////////////////////////////
/* GSAP animation implementation */
///////////////////////////////////

// elapsed time variables
const _3D_welcome_contents = 16750; // anim1
const _3D_candDetail_modelTop = 1800; // anim_top
const _3D_modelTop_candDetail = 1900; // anim_top_back
const _3D_modelTop_contents = 1200; // anim_down
const _3D_logo_forward = 1200; // mark_forward
const _3D_logo_backward = 1200; // mark_backward

const _conts_contact3 = 4000;
const _contact3_conts = 5000;
const _conts_contact2 = 6400;
const _contact2_conts = 7200;

const ID_index = {
  content: {
    flame: "#cont_flame",
    description: "#desc1",
    detailPg: "#details-cont",
    offset: "500vh",
    animDelay: [10000, 7900],
    threeDAnimation: [anim_candidate, anim_candidate_back],
    threeDAnimDelay: [6.0, 3.5],
    threeDAnimTop: [anim_candidate_top, anim_candidate_top_back], // [anim_content_top, anim_content_top_back],
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

//hide pdf button
$("#pdfBtn").hide();

// flashingLogoCopy
gsap.to("#glowCopy feDropShadow", {
  duration: 2,
  attr: { stdDeviation: 0 },
  repeat: -1,
  yoyo: true,
});

// main GSAP timeline object
let master = gsap.timeline();

// set subcontents of 'contents' page to 'opacity:0; visibility:hidden'
master.set([".description", ".flame", "#flashingLogoCopy"], {
  autoAlpha: 0,
});

// register the effect with GSAP: flame effect
gsap.registerEffect({
  name: "flame",
  effect: (targets, config) => {
    return gsap
      .timeline({
        repeat: config.time,
      })
      .set(targets, { rotation: 0, clearProps: "all" })
      .to(targets, { duration: 0.25, autoAlpha: 1 })
      .to(
        targets,
        {
          duration: 0.5,
          rotation: -360,
          repeat: 2,
          ease: Linear.easeNone,
          transformOrigin: "0% 50%",
        },
        "-=0.25"
      )
      .to(targets, {
        duration: 0.25,
        autoAlpha: 0,
      });
  },
  defaults: {}, //defaults get applied to any "config" object passed to the effect
  extendTimeline: true, //now you can call the effect directly on any GSAP timeline to have the result immediately inserted in the position you define (default is sequenced at the end)
});

// change animation of logoName from uniform filling to gradient one
const changeAttr = () => {
  let eles = document.querySelectorAll(".svganim");
  eles.forEach((ele) => {
    ele.setAttribute("fill", "url(#theGradient)");
  });
};

// welcome screen words popup
const messagePopup = () => {
  const container = $("#message");
  const chunks = ["WELCOME", "TO", "THE", "FUTURE", "OF", "FINANCIAL", "UNDERSTANDING"];

  let tl = new gsap.timeline(),
    time = 0,
    chunk,
    element;

  for (let i = 0; i < chunks.length; i++) {
    chunk = chunks[i];
    let index = chunk.length === 1 ? 0 : Math.floor(chunk.length / 2);
    if (chunk.length === 6) index = 2;
    element = $(
      "<h3>" +
        chunk.substring(0, index) +
        "<span>" +
        chunk[index] +
        "</span>" +
        chunk.substring(index + 1, chunk.length) +
        "</h3>"
    ).appendTo(container);
    //
    if (chunk.length == 2) {
      element.css("transform", "translate(-75%, -50%)");
    } else if (chunk.length === 6) {
      element.css("transform", "translate(-45%, -50%)");
    } else if (chunk.length > 10) {
      element.css("transform", "translate(-53%, -50%)");
    }
    disappearDuration = 0.02;
    if (i == 0) {
      gsap.set(element, { autoAlpha: 0, scale: 2 });
      tl.to(element, 0.15, { autoAlpha: 1, scale: 1 }, time).to(
        element,
        disappearDuration,
        { autoAlpha: 0 },
        "+=0.35"
      );
      time += 0.5;
    } else {
      gsap.set(element, { autoAlpha: 0, scale: 1 });
      if (i == 1 || i == 2 || i == 5) {
        tl.to(element, 0.05, { autoAlpha: 1 }, time).to(
          element,
          disappearDuration,
          {
            autoAlpha: 0,
          },
          "+=0.25"
        );
        time += 0.3;
      } else if (i == 3 || i == 4) {
        tl.to(element, 0.05, { autoAlpha: 1 }, time).to(
          element,
          disappearDuration,
          {
            autoAlpha: 0,
          },
          "+=0.35"
        );
        time += 0.4;
      } else if (i != chunks.length - 1) {
        tl.to(element, 0.05, { autoAlpha: 1 }, time).to(
          element,
          disappearDuration,
          {
            autoAlpha: 0,
          },
          "+=0.45"
        );
        time += 0.5;
      } else {
        tl.to(element, 0.05, { autoAlpha: 1 }, time).to(
          element,
          0.1,
          {
            autoAlpha: 0,
            scale: 0,
          },
          "+=0.45"
        );
        time += 0.6;
      }
    }
  }
};

// logoName -> welcome -> 3d start animation
function logoWelcomeThreeD(skipping = false) {
  let animation = gsap.timeline();
  animation
    .to("#vertLine stop", {
      delay: 1,
      duration: 3,
      attr: { offset: "0%" },
      ease: Linear.easeNone,
      onComplete: changeAttr,
    })
    .to("#topStop", {
      duration: 1.5,
      delay: 1,
      attr: { offset: "0%" },
      ease: Linear.easeNone,
    })
    .to("#topStop", {
      duration: 0.5,
      attr: { "stop-color": "#666" },
    })
    .to(".company-logo-name-page", {
      delay: 0.5,
      duration: 1.5,
      autoAlpha: 0,
      ease: Linear.easeNone,
    })
    .to(".company-logo-name-page", {
      duration: 0.5,
      y: "-200vh",
    })
    .to(
      ".welcome-page",
      {
        duration: 0.5,
        y: "-100vh",
        onComplete: messagePopup,
      },
      "-=0.5"
    )
    .to(
      ".welcome-page",
      {
        duration: 0.01,
        translateY: "-200vh",
      },
      "+=3.3"
    )
    .to(
      ".threeD-panel",
      {
        duration: 0.01, // 3d panel translate (0,200vh) => (0,0): 0.1s
        translateY: "-200vh",
      },
      "-=0.01"
    )
    .call(render);
  if (!skipping) {
    animation.call(anim_start);
  }

  animation.to(".threeD-panel", {
    duration: 1.5, // 3d panel brighten: 1.5s
    autoAlpha: 1,
  });
  return animation;
}

// tl-floating-logo appear animation while first 3D animation
function flashingLogoAppear() {
  let animation = gsap.timeline();
  animation.set("#flashingLogo", {
    autoAlpha: 1,
    translateX: "-8vw",
    rotation: "-120deg",
  });
  animation.set("#fl-contact span", {
    autoAlpha: 0,
  });
  animation
    .to("#fl-contact", {
      duration: 0.1,
      translateY: "-200vh",
    })
    .to("#flashingLogo", {
      duration: 1.5,
      x: 4,
      rotation: "0deg",
      ease: "slow(0.7, 0.1, false)",
    })
    .to(
      "#hamburgerMenu",
      {
        duration: 1.5,
        autoAlpha: 1,
      },
      "-=1.5"
    )
    .to("#fl-contact span", {
      duration: 1,
      autoAlpha: 1,
    });

  gsap.to(["#glow feDropShadow", "#hamglow feDropShadow"], {
    duration: 2,
    attr: { stdDeviation: 0 },
    repeat: -1,
    yoyo: true,
  });

  return animation;
}



function flameDescDisappear(type) {
  let animation = gsap.timeline();
  animation
    .flame(ID_index[type].flame, { time: 2 })
    .to(
      ID_index[type].description,
      {
        duration: 1,
        autoAlpha: 1,
      },
      "-=3"
    )
    .to(ID_index[type].description, {
      duration: 1,
      autoAlpha: 0,
    });
  return animation;
}

// floating-logo change
function fl_contact_goback(threeAnim = true) {
  let anim = gsap.timeline();

  anim.set("#fl-back", {
    autoAlpha: 0,
  });
  if (threeAnim) {
    // anim.to('#fl-contact', {
    // 	duration: 1,
    // 	autoAlpha: 0,
    // 	ease: 'slow(0.7, 0.1, false)',
    // 	onStart: mark_forward, // 1.2s
    // });
    anim.to("#fl-contact", {
      duration: 1,
      autoAlpha: 0,
      ease: "slow(0.7, 0.1, false)",
    });
    anim.set("#hamburgerMenu", {
      display: "none",
    });

    if (isPortrait()) {
      anim.to(
        "#flashingLogoCopy",
        {
          duration: 1.7,
          autoAlpha: 1,
          translateX: "46vw",
          translateY: "25vh",
          scaleX: 10,
          scaleY: 10,
          rotationY: 360,
          ease: "slow(0.7, 0.1, false)",
        },
        "-=0.5"
      );
    } else {
      anim.to(
        "#flashingLogoCopy",
        {
          duration: 1.7,
          autoAlpha: 1,
          translateX: "26vw",
          translateY: "32vh",
          scaleX: 7,
          scaleY: 7,
          rotationY: 360,
          ease: "slow(0.7, 0.1, false)",
        },
        "-=0.5"
      );
    }
  } else {
    anim.to("#fl-contact", {
      duration: 1,
      autoAlpha: 0,
      ease: "slow(0.7, 0.1, false)",
    });
    anim.set("#hamburgerMenu", {
      display: "none",
    });
  }

  anim
    .to("#fl-contact", {
      duration: 0.1,
      translateY: "200vh",
    })
    .to(
      "#fl-back",
      {
        duration: 0.1,
        translateY: "-300vh",
      },
      "-=0.1"
    );
  return anim;
}


// disable & enable pointer-events function
const pointer = function (time) {
  $(".logo, .floating-logo, .backBtns, .mainContent-title, .getStarted, #hamburgerMenu").css(
    "pointer-events",
    "none"
  );
  setTimeout(function () {
    // enable click after 'time' seconds
    $(".logo, .floating-logo, .backBtns, .mainContent-title, .getStarted, #hamburgerMenu").css(
      "pointer-events",
      "auto"
    );
  }, time); // 'time' seconds delay
};

// reset index page
if (sessionStorage.getItem("cameraPos") !== null) {
  master.add(logoWelcomeThreeD(true)).add(flashingLogoAppear());
} else {
  master
    .add(logoWelcomeThreeD(false))
    .add(flashingLogoAppear())
    .add(mainPgContentsAppear(), "+=15");
}

