/***********************/
/***********************/
/************************/
/* Mixin para crear cubo ( Caras siempre al frente ) */
/************************/
/***********************/
/***********************/
/**/
*, *::after, *::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
  transform-style: preserve-3d;
  -webkit-tap-highlight-color: transparent;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  cursor: pointer;
  background-image: radial-gradient(circle, #171424, black);
}

.face {
  position: absolute;
}

.house {
  position: absolute;
  width: 28vw;
  height: 28vw;
  transform: perspective(90vw) rotateX(75deg) rotateZ(45deg) translateZ(-9vw);
}

.h-shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 1.5vw -3vw 3vw black, 1.5vw 0.5vw 1.5vw black;
}

.h-lights {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 45vw;
  height: 45vw;
}

.h-light {
  position: absolute;
}

.h-light:nth-of-type(1) {
  bottom: 5vw;
  right: 0;
  width: 14vw;
  height: 14vw;
  border-radius: 50%;
  background-image: radial-gradient(#1b182a, transparent);
  filter: blur(1vw);
}

.h-light:nth-of-type(2) {
  bottom: 18vw;
  right: -1vw;
  width: 2vw;
  height: 12vw;
  border-radius: 50%;
  transform: rotateZ(-50deg);
  background-image: radial-gradient(rgba(81, 137, 251, 0.45) 50%, rgba(40, 125, 210, 0.45), transparent);
  box-shadow: -1vw -1vw 2vw 1vw rgba(131, 171, 252, 0.1);
  filter: blur(1vw);
}

.h-light:nth-of-type(3) {
  bottom: -2vw;
  right: 17vw;
  width: 5vw;
  height: 12vw;
  border-radius: 50%;
  transform: rotateZ(-50deg);
  background-image: radial-gradient(rgba(81, 137, 251, 0.5) 50%, rgba(40, 125, 210, 0.5), transparent);
  filter: blur(2vw);
}

.h-light:nth-of-type(3)::before,
.h-light:nth-of-type(3)::after {
  content: "";
  position: absolute;
  width: 200%;
  top: -6vw;
  height: 400%;
  background-image: linear-gradient(to bottom, rgba(40, 125, 210, 0.1), rgba(81, 137, 251, 0.1), transparent);
  border-top-left-radius: 10vw;
  border-top-right-radius: 10vw;
  filter: blur(1.5vw);
}

.h-light:nth-of-type(3)::before {
  right: -50%;
  transform-origin: top right;
  transform: rotateZ(15deg);
  box-shadow: -2vw -2vw 0 rgba(81, 137, 251, 0.075);
}

.h-light:nth-of-type(3)::after {
  left: -50%;
  transform-origin: top left;
  transform: rotateZ(-15deg);
  box-shadow: 2vw -2vw 0 rgba(81, 137, 251, 0.075);
}

.h-light:nth-of-type(4) {
  bottom: 5vw;
  left: 8vw;
  width: 28vw;
  height: 4vw;
  transform-origin: top left;
  transform: skewX(58deg);
  background-image: linear-gradient(to right, rgba(81, 137, 251, 0.075) 10%, transparent 25%, transparent, rgba(0, 0, 0, 0.15));
  filter: blur(0.25vw);
}

.h-light:nth-of-type(6) {
  bottom: 14vw;
  right: 2vw;
  width: 8vw;
  height: 16vw;
  transform-origin: bottom left;
  transform: skewY(49deg);
  background-image: linear-gradient(to left, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  filter: blur(0.35vw);
}

.alt {
  position: absolute;
  left: 0;
  top: 0;
  width: 40vw;
  height: 40vw;
}

.alt__front {
  width: 40vw;
  height: 0.5vw;
  transform-origin: bottom left;
  transform: rotateX(-90deg) translateZ(39.5vw);
  background-color: #9E99C1;
}

.alt__back {
  width: 40vw;
  height: 0.5vw;
  transform-origin: top left;
  transform: rotateX(-90deg) rotateY(180deg) translateX(-40vw) translateY(-0.5vw);
  background-color: #383358;
}

.alt__right {
  width: 40vw;
  height: 0.5vw;
  transform-origin: top left;
  transform: rotateY(90deg) rotateZ(-90deg) translateZ(40vw) translateX(-40vw) translateY(-0.5vw);
  background-color: #383358;
}

.alt__left {
  width: 40vw;
  height: 0.5vw;
  transform-origin: top left;
  transform: rotateY(-90deg) rotateZ(90deg) translateY(-0.5vw);
  background-color: #FBFAFE;
}

.alt__top {
  width: 40vw;
  height: 40vw;
  transform-origin: top left;
  transform: translateZ(0.5vw);
  background-image: linear-gradient(to bottom, #0b0c1f, #383358, #9E99C1);
}

.alt__bottom {
  width: 40vw;
  height: 40vw;
  transform-origin: top left;
  transform: rotateY(180deg) translateX(-40vw);
  background-color: #383358;
}

/* Lights inside top face remain unchanged, still relative to face size */
.alt__top .light:nth-of-type(1) {
  position: absolute;
  height: 100%;
  width: 100%;
  background-image: linear-gradient(to bottom, rgba(20, 61, 103, 0.75), rgba(81, 137, 251, 0.75), transparent);
}
.alt__top .light:nth-of-type(2) {
  position: absolute;
  left: 4vw;
  height: 100%;
  width: 6vw;
  background-image: linear-gradient(to bottom, transparent 20%, rgba(40, 125, 210, 0.75), rgba(81, 137, 251, 0.25) 80%);
  filter: blur(0.1vw);
}
.alt__top .light:nth-of-type(3) {
  position: absolute;
  bottom: 10vw;
  left: 5vw;
  width: 6vw;
  height: 3vw;
  border-radius: 50%;
  transform: rotateZ(42deg);
  background-image: radial-gradient(rgba(131, 171, 252, 0.75) 50%, rgba(32, 99, 167, 0.75));
  filter: blur(0.55vw);
}
.alt__top .light:nth-of-type(4) {
  position: absolute;
  bottom: 7vw;
  left: 4vw;
  width: 8.5vw;
  height: 2vw;
  border-radius: 50%;
  transform: rotateZ(40deg);
  background-image: radial-gradient(rgba(131, 171, 252, 0.75) 50%, rgba(32, 99, 167, 0.75));
  filter: blur(0.55vw);
}
.alt__top .light:nth-of-type(5) {
  position: absolute;
  bottom: 3.5vw;
  left: 4.5vw;
  width: 6vw;
  height: 2vw;
  border-radius: 50%;
  transform: rotateZ(40deg);
  background-image: radial-gradient(rgba(141, 178, 252, 0.75) 50%, rgba(32, 99, 167, 0.75));
  filter: blur(0.75vw);
}
.alt__top .light:nth-of-type(6) {
  position: absolute;
  bottom: 3vw;
  left: 0.5vw;
  width: 4vw;
  height: 2vw;
  border-radius: 50%;
  transform: rotateZ(40deg);
  background-image: radial-gradient(rgba(141, 178, 252, 0.75) 50%, rgba(32, 99, 167, 0.75));
  filter: blur(0.35vw);
}
.alt__top .light:nth-of-type(7) {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right, black, #5189fb 10%, transparent 20%);
}
.alt__top .light:nth-of-type(7)::before {
  content: "";
  position: absolute;
  width: 20%;
  height: 100%;
  background-image: linear-gradient(to right, rgba(5, 70, 199, 0.6), transparent 60%);
}
.alt__top .light:nth-of-type(7)::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 20%;
  background-image: linear-gradient(to bottom, rgba(6, 78, 224, 0.5), transparent 60%);
}
.alt__top .light:nth-of-type(8) {
  position: absolute;
  bottom: 5vw;
  left: 10vw;
  width: 6vw;
  height: 4vw;
  border-radius: 50%;
  transform: rotateZ(40deg);
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 50%, rgba(128, 121, 174, 0.1));
  filter: blur(0.8vw);
}

.bed-c {
  position: absolute;
  left: 18vw;
  top: 20vw;
  width: 16vw;
  height: 9vw;
  transform: translateZ(0.5vw);
}

.bed-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 5%;
  background-color: rgba(11, 12, 31, 0.95);
  filter: blur(1vw);
  transform: translateZ(0);
}

.bed {
  position: absolute;
  left: 0;
  top: 0;
  width: 16vw;
  height: 9vw;
  transform: translateZ(2vw);
}

.bed__front, .bed__back, .bed__right, .bed__left,
.bed__top, .bed__bottom {
  position: absolute;
  background-color: #121225;
}

/* Bed Faces */
.bed__front {
  width: 16vw;
  height: 0.5vw;
  transform-origin: bottom left;
  transform: rotateX(-90deg) translateZ(8.5vw);
  background-color: #0b0c1f;
}
.bed__back {
  width: 16vw;
  height: 0.5vw;
  transform-origin: top left;
  transform: rotateX(-90deg) rotateY(180deg) translateX(-16vw) translateY(-0.5vw);
  background-color: #0b0c1f;
}
.bed__right {
  width: 9vw;
  height: 0.5vw;
  transform-origin: top left;
  transform: rotateY(90deg) rotateZ(-90deg) translateZ(16vw) translateX(-9vw) translateY(-0.5vw);
  background-color: #1e1e36;
}
.bed__left {
  width: 9vw;
  height: 0.5vw;
  transform-origin: top left;
  transform: rotateY(-90deg) rotateZ(90deg) translateY(-0.5vw);
  background-color: #1e1e36;
}
.bed__top {
  width: 16vw;
  height: 9vw;
  transform-origin: top left;
  transform: translateZ(0.5vw);
  background-image: linear-gradient(45deg, #181827, #282847);
  overflow: hidden;
}
.bed__bottom {
  width: 16vw;
  height: 9vw;
  transform-origin: top left;
  transform: rotateY(180deg) translateX(-16vw);
  background-color: #121225;
}

/*mat */
.bed__mattress {
  position: absolute;
  width: 13vw;
  height: 6vw;
  background: linear-gradient(to right, #33334d, #29293d);
  border-radius: 0.5vw;
  transform: translateZ(2.5vw) translateX(0.5vw) translateY(0.5vw);
  box-shadow: inset 0.1vw 0.1vw 0.25vw rgba(255,255,255,0.05);
}
.bed__headboard {
  position: absolute;
  width: 13vw;
  height: 2.5vw;
  background: linear-gradient(to bottom, #151628, #22223a);
  transform-origin: bottom left;
  transform: rotateX(-90deg) translateZ(0vw) translateY(-2.5vw);
  border-radius: 0.3vw;
  box-shadow: inset 0 -0.2vw 0.4vw rgba(0, 0, 0, 0.2);
}

/* Pillow(s) */
.bed__pillow {
  position: absolute;
  width: 4vw;
  height: 2vw;
  background: linear-gradient(45deg, #ffffff, #e6e6f2);
  border-radius: 0.5vw;
  box-shadow: inset -0.2vw -0.2vw 0.5vw rgba(0, 0, 0, 0.1);
  transform: translateZ(2.7vw) translateX(1vw) translateY(-2.2vw);
}
.bed__pillow:nth-of-type(2) {
  transform: translateZ(2.7vw) translateX(6vw) translateY(-2.2vw);
}

/* Blanket */
.bed__blanket {
  position: absolute;
  width: 13vw;
  height: 6vw;
  background: linear-gradient(45deg, #2a2a40, #3f3f5a);
  transform: translateZ(2.1vw) translateX(1.5vw) translateY(1.5vw) rotateZ(2deg);
  border-radius: 0.5vw;
  opacity: 0.95;
  box-shadow: 0 0 0.75vw rgba(0, 0, 0, 0.3);
}

/* Bed Light */
.bed__light {
  position: absolute;
  left: 8vw;
  top: 0;
  width: 12vw;
  height: 6vw;
  background: radial-gradient(ellipse at center, rgba(81, 137, 251, 0.08), transparent 80%);
  transform: translateZ(0.5vw);
  filter: blur(1vw);
  pointer-events: none;
  z-index: -1;
  }

.tv {
  position: absolute;
  left: 1.51vw;
  top: 8vw;
  width: 0.5vw;
  height: 12vw;
  transform: translateZ(8vw);
}
.tv__front {
  width: 0.5vw;
  height: 6vw;
  transform-origin: bottom left;
  transform: rotateX(-90deg) translateZ(6vw);
}
.tv__back {
  width: 0.5vw;
  height: 6vw;
  transform-origin: top left;
  transform: rotateX(-90deg) rotateY(180deg) translateX(-0.5vw) translateY(-6vw);
}
.tv__right {
  width: 12vw;
  height: 6vw;
  transform-origin: top left;
  transform: rotateY(90deg) rotateZ(-90deg) translateZ(0.5vw) translateX(-12vw) translateY(-6vw);
}
.tv__left {
  width: 12vw;
  height: 6vw;
  transform-origin: top left;
  transform: rotateY(-90deg) rotateZ(90deg) translateY(-6vw);
}
.tv__top {
  width: 0.5vw;
  height: 12vw;
  transform-origin: top left;
  transform: translateZ(6vw);
}
.tv__bottom {
  width: 0.5vw;
  height: 12vw;
  transform-origin: top left;
  transform: rotateY(180deg) translateX(-0.5vw);
}
.tv__front {
  background-color: #0b0c1f;
}
.tv__back {
  background-color: #0b0c1f;
}
.tv__right {
  background-color: #9cbcfc;
  border: 0.125vw solid black;
  animation: pantalla-tv 0.25s infinite alternate;
}
.tv__right::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: 0.125vw 0.125vw 1vw rgba(81, 137, 251, 0.5), -0.125vw 0.125vw 1vw rgba(81, 137, 251, 0.5), 0.125vw -0.125vw 1vw rgba(81, 137, 251, 0.5), -0.125vw -0.125vw 1vw rgba(81, 137, 251, 0.5);
  background-image: url("https://rawcdn.githack.com/ricardoolivaalonso/Codepen/43200238c3177b02a97423fa6cc23f8bfcc5c105/Room/gif.gif");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;
  opacity: 0.8;
}
.tv__left {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0b0c1f;
}
.tv__left::before {
  content: "";
  position: absolute;
  width: 13vw;
  height: 7vw;
  background-image: radial-gradient(rgba(36, 112, 188, 0.95), rgba(56, 121, 250, 0.95));
  filter: blur(1.25vw);
  animation: luz-tv 0.25s infinite alternate;
}
.tv__top {
  background-color: #0b0c1f;
}
.tv__bottom {
  background-color: #0b0c1f;
}

.drawer {
  position: absolute;
  width: 8vw;
  height: 2vw;
  transform: translate3d(10vw, 25vw, 1vw); /* Adjust position relative to .house */
  transform-style: preserve-3d;
  animation: drawerIdle 4s ease-in-out infinite alternate;
}

.drawer > div {
  position: absolute;
  background-color: #9E99C1;
  opacity: 0.95;
}

/* Front face */
.drawer__front {
  width: 8vw;
  height: 2vw;
  transform: translateZ(2vw);
  background: #7f77aa;
}

/* Back face */
.drawer__back {
  width: 8vw;
  height: 2vw;
  transform: rotateY(180deg);
  background: #3c3559;
}

/* Top face */
.drawer__top {
  width: 8vw;
  height: 2vw;
  transform: rotateX(90deg) translateY(-1vw);
  transform-origin: top;
  background: #a99fd8;
}

/* Bottom face */
.drawer__bottom {
  width: 8vw;
  height: 2vw;
  transform: rotateX(-90deg) translateY(1vw);
  transform-origin: bottom;
  background: #524c74;
}

/* Left face */
.drawer__left {
  width: 2vw;
  height: 2vw;
  transform: rotateY(-90deg) translateX(-1vw);
  transform-origin: left;
  background: #6d6597;
}

/* Right face */
.drawer__right {
  width: 2vw;
  height: 2vw;
  transform: rotateY(90deg) translateX(7vw);
  transform-origin: right;
  background: #6d6597;
}



.mesa-c {
  position: absolute;
  left: 7vw;
  top: 9.5vw;
  width: 10vw;
  height: 9vw;
  transform: translateZ(0.5vw);
}

.mesa-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 10%;
  background-color: rgba(11, 12, 31, 0.95);
  filter: blur(1vw);
  transform: translateZ(0);
}

.mesa {
  position: absolute;
  left: 0;
  top: 0;
  width: 10vw;
  height: 9vw;
  transform: translateZ(2vw);
}
.mesa__front {
  width: 10vw;
  height: 0.5vw;
  transform-origin: bottom left;
  transform: rotateX(-90deg) translateZ(8.5vw);
}
.mesa__back {
  width: 10vw;
  height: 0.5vw;
  transform-origin: top left;
  transform: rotateX(-90deg) rotateY(180deg) translateX(-10vw) translateY(-0.5vw);
}
.mesa__right {
  width: 9vw;
  height: 0.5vw;
  transform-origin: top left;
  transform: rotateY(90deg) rotateZ(-90deg) translateZ(10vw) translateX(-9vw) translateY(-0.5vw);
}
.mesa__left {
  width: 9vw;
  height: 0.5vw;
  transform-origin: top left;
  transform: rotateY(-90deg) rotateZ(90deg) translateY(-0.5vw);
}
.mesa__top {
  width: 10vw;
  height: 9vw;
  transform-origin: top left;
  transform: translateZ(0.5vw);
}
.mesa__bottom {
  width: 10vw;
  height: 9vw;
  transform-origin: top left;
  transform: rotateY(180deg) translateX(-10vw);
}
.mesa__front {
  background-image: linear-gradient(to right, #0b0c1f, black);
}
.mesa__front::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(45deg, rgba(81, 137, 251, 0.125), rgba(180, 205, 253, 0.25), transparent 55%);
}
.mesa__back {
  background-color: #0b0c1f;
}
.mesa__right {
  background-color: black;
}
.mesa__left {
  background-color: #121332;
}
.mesa__top {
  background-image: linear-gradient(45deg, #0e0f27, #04050d);
  overflow: hidden;
}
.mesa__top::before {
  content: "";
  position: absolute;
  bottom: 0;
  width: 50%;
  height: 50%;
  background-image: linear-gradient(45deg, rgba(81, 137, 251, 0.5), rgba(251, 250, 254, 0.125) 50%, transparent 55%);
  filter: blur(0.5vw);
}
.mesa__top::after {
  content: "";
  position: absolute;
  left: 2vw;
  top: 2vw;
  width: 20%;
  height: 50%;
  border-radius: 50%;
  background-color: rgba(40, 125, 210, 0.079);
  transform: rotateZ(-40deg);
  filter: blur(0.75vw);
}
.mesa__bottom {
  background-color: #0b0c1f;
}

.mesa-p {
  position: absolute;
  width: 0.25vw;
  height: 0.25vw;
}
.mesa-p__front {
  width: 0.25vw;
  height: 1.75vw;
  transform-origin: bottom left;
  transform: rotateX(-90deg) translateZ(-1.5vw);
}
.mesa-p__back {
  width: 0.25vw;
  height: 1.75vw;
  transform-origin: top left;
  transform: rotateX(-90deg) rotateY(180deg) translateX(-0.25vw) translateY(-1.75vw);
}
.mesa-p__right {
  width: 0.25vw;
  height: 1.75vw;
  transform-origin: top left;
  transform: rotateY(90deg) rotateZ(-90deg) translateZ(0.25vw) translateX(-0.25vw) translateY(-1.75vw);
}
.mesa-p__left {
  width: 0.25vw;
  height: 1.75vw;
  transform-origin: top left;
  transform: rotateY(-90deg) rotateZ(90deg) translateY(-1.75vw);
}
.mesa-p__top {
  width: 0.25vw;
  height: 0.25vw;
  transform-origin: top left;
  transform: translateZ(1.75vw);
}
.mesa-p__bottom {
  width: 0.25vw;
  height: 0.25vw;
  transform-origin: top left;
  transform: rotateY(180deg) translateX(-0.25vw);
}
.mesa-p__front {
  background-color: #0b0c1f;
}
.mesa-p__back {
  background-color: #0b0c1f;
}
.mesa-p__right {
  background-color: black;
}
.mesa-p__left {
  background-color: #121332;
}
.mesa-p__top {
  background-color: #1f2158;
}
.mesa-p__bottom {
  background-color: #0b0c1f;
}
.mesa-p__bottom::before {
  content: "";
  position: absolute;
  width: 600%;
  height: 200%;
  top: 0;
  right: 0;
  border-radius: 10%;
  transform: translateZ(-0.1vw);
  background-color: rgba(0, 0, 0, 0.75);
  filter: blur(0.35vw);
}
.mesa-p:nth-of-type(1) {
  left: 0.5vw;
  top: 0.5vw;
}
.mesa-p:nth-of-type(2) {
  right: 0.5vw;
  top: 0.5vw;
}
.mesa-p:nth-of-type(3) {
  left: 0.5vw;
  bottom: 0.5vw;
}
.mesa-p:nth-of-type(4) {
  right: 0.5vw;
  bottom: 0.5vw;
}

/* LAPTOP STYLES */
.laptop {
  position: absolute;
  left: 2vw;
  top: 2vw;
  width: 6vw;
  height: 4vw;
  transform: translateZ(2.5vw) rotateZ(180deg);
  transform-style: preserve-3d;
}

/* Laptop Base */
.laptop-base {
  position: absolute;
  left: 0;
  top: 0;
  width: 6vw;
  height: 4vw;
  transform: translateZ(0);
}

.laptop-base__front,
.laptop-base__back,
.laptop-base__right,
.laptop-base__left,
.laptop-base__top,
.laptop-base__bottom {
  position: absolute;
}

.laptop-base__front {
  width: 6vw;
  height: 0.3vw;
  transform-origin: bottom left;
  transform: rotateX(-90deg) translateZ(3.7vw);
  background-color: #1a1a1a;
}

.laptop-base__back {
  width: 6vw;
  height: 0.3vw;
  transform-origin: top left;
  transform: rotateX(-90deg) rotateY(180deg) translateX(-6vw) translateY(-0.3vw);
  background-color: #1a1a1a;
}

.laptop-base__right {
  width: 4vw;
  height: 0.3vw;
  transform-origin: top left;
  transform: rotateY(90deg) rotateZ(-90deg) translateZ(6vw) translateX(-4vw) translateY(-0.3vw);
  background-color: #2a2a2a;
}

.laptop-base__left {
  width: 4vw;
  height: 0.3vw;
  transform-origin: top left;
  transform: rotateY(-90deg) rotateZ(90deg) translateY(-0.3vw);
  background-color: #2a2a2a;
}

.laptop-base__top {
  width: 6vw;
  height: 4vw;
  transform-origin: top left;
  transform: translateZ(0.3vw);
  background-image: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  overflow: hidden;
}

.laptop-base__top::before {
  content: "";
  position: absolute;
  width: 80%;
  height: 60%;
  left: 10%;
  top: 20%;
  background-color: #000;
  border-radius: 0.2vw;
  border: 0.05vw solid #333;
}

.laptop-base__top::after {
  content: "";
  position: absolute;
  width: 70%;
  height: 45%;
  left: 15%;
  top: 27.5%;
  background-image: linear-gradient(135deg, #1e3a8a, #3b82f6);
  border-radius: 0.1vw;
  animation: laptop-screen 2s infinite alternate;
}

.laptop-base__bottom {
  width: 6vw;
  height: 4vw;
  transform-origin: top left;
  transform: rotateY(180deg) translateX(-6vw);
  background-color: #1a1a1a;
}

/* Hinge Container */
.laptop-hinge {
  position: absolute;
  left: 0;
  top: 0;
  width: 6vw;
  height: 4vw;
  transform: translateZ(0.3vw);
  transform-origin: bottom center;
  perspective: 1000vw;
}

/* Laptop Screen */
.laptop-screen {
  position: absolute;
  left: 0;
  top: 0;
  width: 6vw;
  height: 4vw;
  transform-origin: bottom center;
  transform: rotateX(-105deg);
  animation: lid-open 2s ease-out forwards;
}

.laptop-screen__front,
.laptop-screen__back,
.laptop-screen__right,
.laptop-screen__left,
.laptop-screen__top,
.laptop-screen__bottom {
  position: absolute;
}

.laptop-screen__front {
  width: 6vw;
  height: 0.2vw;
  transform-origin: bottom left;
  transform: rotateX(-90deg) translateZ(3.8vw);
  background-color: #2a2a2a;
}

.laptop-screen__back {
  width: 6vw;
  height: 0.2vw;
  transform-origin: top left;
  transform: rotateX(-90deg) rotateY(180deg) translateX(-6vw) translateY(-0.2vw);
  background-color: #2a2a2a;
}

.laptop-screen__right {
  width: 4vw;
  height: 0.2vw;
  transform-origin: top left;
  transform: rotateY(90deg) rotateZ(-90deg) translateZ(6vw) translateX(-4vw) translateY(-0.2vw);
  background-color: #2a2a2a;
}

.laptop-screen__left {
  width: 4vw;
  height: 0.2vw;
  transform-origin: top left;
  transform: rotateY(-90deg) rotateZ(90deg) translateY(-0.2vw);
  background-color: #2a2a2a;
}

.laptop-screen__top {
  width: 6vw;
  height: 4vw;
  transform-origin: top left;
  transform: translateZ(0.2vw);
  background-color: #1a1a1a;
}

.laptop-screen__bottom {
  width: 6vw;
  height: 4vw;
  transform-origin: top left;
  transform: rotateY(180deg) translateX(-6vw);
  background-image: linear-gradient(135deg, #000, #1a1a1a);
  overflow: hidden;
}

.laptop-screen__bottom::before {
  content: "";
  position: absolute;
  width: 90%;
  height: 80%;
  left: 5%;
  top: 10%;
  background-image: linear-gradient(135deg, #0f172a, #1e293b);
  border-radius: 0.2vw;
  border: 0.05vw solid #334155;
}

.laptop-screen__bottom::after {
  content: "";
  position: absolute;
  width: 80%;
  height: 65%;
  left: 10%;
  top: 17.5%;
  background-image: linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa);
  border-radius: 0.1vw;
  animation: laptop-screen-glow 3s infinite alternate;
}

/* Animations */
@keyframes laptop-screen {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.9;
  }
}

@keyframes laptop-screen-glow {
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.02);
  }
}

@keyframes lid-open {
  0% {
    transform: rotateX(-180deg);
  }
  100% {
    transform: rotateX(-105deg);
  }
}
/* Animations */
@keyframes pantalla-tv {
  0% { background-color: #9cbcfc; }
  50% { background-color: #b4c8fd; }
  100% { background-color: #9cbcfc; }
}

@keyframes luz-tv {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}
