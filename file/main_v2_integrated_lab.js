import * as THREE from 'three';

import { OrbitControls } from
    'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from
    'three/addons/loaders/GLTFLoader.js';

import { DRACOLoader } from
    'three/addons/loaders/DRACOLoader.js';

import { KTX2Loader } from
    'three/addons/loaders/KTX2Loader.js';

import { GUI } from
    'three/addons/libs/lil-gui.module.min.js';

import gsap from
    'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';

import TWEEN from
    'https://esm.sh/@tweenjs/tween.js@23.1.2';


// ============================================================
// ERROR REPORTING
// ============================================================

const errorElement = document.getElementById('error');

function showError(message) {

    errorElement.style.display = 'block';

    errorElement.textContent +=
        `${message}\n\n`;
}

window.addEventListener(
    'error',
    event => {
        showError(
            `window.onerror:\n${event.message}\n${event.filename}:${event.lineno}`
        );
    }
);

window.addEventListener(
    'unhandledrejection',
    event => {
        showError(
            `Unhandled Promise Rejection:\n${event.reason}`
        );
    }
);


// ============================================================
// STATUS
// ============================================================

const loadingElement =
    document.getElementById('loading');

const statusElement =
    document.getElementById('status');

function setStatus(message) {
    statusElement.textContent = message;
}


// ============================================================
// SCENE
// ============================================================

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x080808);


// ============================================================
// CAMERA
// ============================================================

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
);


// Original camera starting position
camera.position.set(
    0,
    8,
    22
);


// ============================================================
// RENDERER
// ============================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

document.body.appendChild(
    renderer.domElement
);


// ============================================================
// CONTROLS
// ============================================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enabled = false;

controls.enableDamping = true;


// ============================================================
// DRACO
// ============================================================

const draco =
    new DRACOLoader();

draco.setDecoderPath(
    'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/'
);


// ============================================================
// SHARED GLTF LOADER
// ============================================================

const loader =
    new GLTFLoader();

loader.setDRACOLoader(
    draco
);



// ============================================================
// PHYSICALLY BASED LIGHTING SUBSYSTEM
// ============================================================
// Shared by the entire cinematic + education scene.
// The original physical-lights objects/materials are preserved,
// but the subsystem uses main_v2.js scene/camera/renderer.
// ============================================================

const bulbLuminousPowers = {
  '110000 lm (1000W)': 110000,
  '3500 lm (300W)': 3500,
  '1700 lm (100W)': 1700,
  '800 lm (60W)': 800,
  '400 lm (40W)': 400,
  '180 lm (25W)': 180,
  '20 lm (4W)': 20,
  'Off': 0
};

const hemiLuminousIrradiances = {
  '0.0001 lx (Moonless Night)': 0.0001,
  '0.002 lx (Night Airglow)': 0.002,
  '0.5 lx (Full Moon)': 0.5,
  '3.4 lx (City Twilight)': 3.4,
  '50 lx (Living Room)': 50,
  '100 lx (Very Overcast)': 100,
  '350 lx (Office Room)': 350,
  '400 lx (Sunrise/Sunset)': 400,
  '1000 lx (Overcast)': 1000,
  '18000 lx (Daylight)': 18000,
  '50000 lx (Direct Sun)': 50000
};

const params = {
  shadows: true,
  exposure: 0.68,
  bulbPower: Object.keys(bulbLuminousPowers)[4],
  hemiIrradiance: Object.keys(hemiLuminousIrradiances)[0]
};

let bulbLight, bulbMat, hemiLight;
let ballMat, cubeMat, floorMat;
let previousShadowMap = false;
let physicalGUI;

function initializePhysicalLighting() {

  bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);
  bulbMat = new THREE.MeshStandardMaterial({
    emissive: 0xffffee,
    emissiveIntensity: 1,
    color: 0x000000
  });

  const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
  const Bulb = new THREE.Mesh(bulbGeometry, bulbMat);
  Bulb.name = 'Bulb';
  bulbLight.add(Bulb);
  bulbLight.position.set(0, 2, 0);
  bulbLight.castShadow = true;
  scene.add(bulbLight);

  hemiLight = new THREE.HemisphereLight(
    0xddeeff,
    0x0f0e0d,
    0.02
  );
  scene.add(hemiLight);

  floorMat = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    color: 0xffffff,
    metalness: 0.2,
    bumpScale: 1
  });

  const textureLoader = new THREE.TextureLoader();

  textureLoader.load('textures/hardwood2_diffuse.jpg', map => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(10, 24);
    map.colorSpace = THREE.SRGBColorSpace;
    floorMat.map = map;
    floorMat.needsUpdate = true;
  });

  textureLoader.load('textures/hardwood2_bump.jpg', map => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(10, 24);
    floorMat.bumpMap = map;
    floorMat.needsUpdate = true;
  });

  textureLoader.load('textures/hardwood2_roughness.jpg', map => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(10, 24);
    floorMat.roughnessMap = map;
    floorMat.needsUpdate = true;
  });

  cubeMat = new THREE.MeshStandardMaterial({
    roughness: 0.7,
    color: 0xffffff,
    bumpScale: 1,
    metalness: 0.2
  });

  textureLoader.load('textures/brick_diffuse.jpg', map => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(1, 1);
    map.colorSpace = THREE.SRGBColorSpace;
    cubeMat.map = map;
    cubeMat.needsUpdate = true;
  });

  textureLoader.load('textures/brick_bump.jpg', map => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(1, 1);
    cubeMat.bumpMap = map;
    cubeMat.needsUpdate = true;
  });

  ballMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 1.0
  });

  textureLoader.load('textures/planets/earth_atmos_2048.jpg', map => {
    map.anisotropy = 4;
    map.colorSpace = THREE.SRGBColorSpace;
    ballMat.map = map;
    ballMat.needsUpdate = true;
  });

  textureLoader.load('textures/planets/earth_specular_2048.jpg', map => {
    map.anisotropy = 4;
    map.colorSpace = THREE.SRGBColorSpace;
    ballMat.metalnessMap = map;
    ballMat.needsUpdate = true;
  });

  const physicalFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    floorMat
  );
  physicalFloor.name = 'PhysicalFloor';
  physicalFloor.receiveShadow = true;
  physicalFloor.rotation.x = -Math.PI / 2;
  scene.add(physicalFloor);

  const ballMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 32, 32),
    ballMat
  );
  ballMesh.name = 'Globe';
  ballMesh.position.set(1, 0.25, 1);
  ballMesh.rotation.y = Math.PI;
  ballMesh.castShadow = true;
  scene.add(ballMesh);

  const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

  const boxMesh = new THREE.Mesh(boxGeometry, cubeMat);
  boxMesh.name = 'Brick';
  boxMesh.position.set(-0.5, 0.25, -1);
  boxMesh.castShadow = true;
  scene.add(boxMesh);

  const boxMesh2 = new THREE.Mesh(boxGeometry, cubeMat);
  boxMesh2.name = 'Brick_2';
  boxMesh2.position.set(0, 0.25, -5);
  boxMesh2.castShadow = true;
  scene.add(boxMesh2);

  const boxMesh3 = new THREE.Mesh(boxGeometry, cubeMat);
  boxMesh3.name = 'Brick_3';
  boxMesh3.position.set(7, 0.25, 0);
  boxMesh3.castShadow = true;
  scene.add(boxMesh3);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ReinhardToneMapping;

  physicalGUI = new GUI();

  physicalGUI.add(
    params,
    'hemiIrradiance',
    Object.keys(hemiLuminousIrradiances)
  );

  physicalGUI.add(
    params,
    'bulbPower',
    Object.keys(bulbLuminousPowers)
  );

  physicalGUI.add(params, 'exposure', 0, 1);
  physicalGUI.add(params, 'shadows');
  physicalGUI.open();
}

function updatePhysicalLighting() {

  if (!bulbLight || !hemiLight) return;

  renderer.toneMappingExposure =
    Math.pow(params.exposure, 5.0);

  renderer.shadowMap.enabled = params.shadows;
  bulbLight.castShadow = params.shadows;

  if (params.shadows !== previousShadowMap) {

    if (ballMat) ballMat.needsUpdate = true;
    if (cubeMat) cubeMat.needsUpdate = true;
    if (floorMat) floorMat.needsUpdate = true;

    previousShadowMap = params.shadows;
  }

  bulbLight.power =
    bulbLuminousPowers[params.bulbPower];

  bulbMat.emissiveIntensity =
    bulbLight.intensity / Math.pow(0.02, 2.0);

  hemiLight.intensity =
    hemiLuminousIrradiances[params.hemiIrradiance];

  const time = Date.now() * 0.0005;

  bulbLight.position.y =
    Math.cos(time) * 0.75 + 1.25;
}

initializePhysicalLighting();



// ============================================================
// RAMEN SHOP + LAB SIMULATION UI
// ============================================================

const RAMEN_SHOP_WORLD_POSITION = new THREE.Vector3(
  12.5500, 6.7000, 2.2000
);

const RAMEN_HOLOGRAM_WORLD_POSITION = new THREE.Vector3(
  12.3000, 11.5000, 1.4000
);

// The ramen shop remains the local origin of its own interaction
// system; this root moves the complete shop + hologram + inductor
// assembly into the cinematic world.
const ramenLabRoot = new THREE.Group();
ramenLabRoot.name = 'RamenShop_LabRoot';
ramenLabRoot.position.copy(RAMEN_SHOP_WORLD_POSITION);
scene.add(ramenLabRoot);

const labUIRoot = document.createElement('div');
labUIRoot.id = 'ramen-lab-ui';
labUIRoot.style.cssText = 'display:none;position:fixed;inset:0;z-index:100;pointer-events:none;';
labUIRoot.innerHTML = `
<style>
#ramen-lab-ui .lab-topbar{position:fixed;top:0;left:0;right:0;height:44px;background:rgba(0,0,0,.82);backdrop-filter:blur(8px);border-bottom:1px solid #2a2a3a;display:flex;align-items:center;justify-content:space-between;padding:0 14px;z-index:200;pointer-events:auto}
#ramen-lab-ui .lab-title{font-size:11px;letter-spacing:2px;color:#ff7f00;text-transform:uppercase}
#ramen-lab-ui .lab-status{font-size:11px;color:#888}
#ramen-lab-ui .lab-btn{background:#1a1a2a;border:1px solid #3a3a5a;color:#ccc;border-radius:6px;padding:5px 12px;font-size:11px;font-family:'Courier New',monospace;cursor:pointer}
#ramen-lab-ui .lab-btn:hover{background:#2a2a4a}
#ramen-lab-ui .lab-btn.active{background:#ff7f0033;border-color:#ff7f00;color:#ff7f00}
#ramen-lab-ui #lab-btn-row{position:fixed;top:52px;right:10px;display:flex;flex-direction:column;gap:6px;z-index:200;pointer-events:auto}
#ramen-lab-ui #lab-log-panel{position:fixed;top:52px;left:10px;right:10px;max-height:55vh;overflow-y:auto;background:rgba(0,0,0,.93);border:1px solid #2a2a3a;border-radius:10px;padding:12px 14px;z-index:100;transition:opacity .3s,transform .3s;pointer-events:auto}
#ramen-lab-ui #lab-log-panel.hidden{opacity:0;pointer-events:none;transform:translateY(-8px)}
#ramen-lab-ui .log-entry{font-size:11px;line-height:1.85;padding:1px 0;border-bottom:1px solid #111;display:flex;gap:7px;word-break:break-all}
#ramen-lab-ui .log-entry.ok{color:#4eca8b}.log-entry.err{color:#ff5f5f;font-weight:bold}.log-entry.info{color:#f0c060}.log-entry.pending{color:#888}.log-entry.head{color:#adf;font-weight:bold}.log-entry.click{color:#ff7f00;font-weight:bold}.log-entry.screen{color:#f4f}.log-entry.ind{color:#ff3333;font-weight:bold}
#ramen-lab-ui #lab-progress-bar-wrap{margin-top:8px;height:4px;background:#1a1a2a;border-radius:3px;overflow:hidden}
#ramen-lab-ui #lab-progress-bar{height:100%;width:0%;background:linear-gradient(90deg,#ff7f00,#00ff7f);transition:width .3s}
#ramen-lab-ui #lab-summary{margin-top:6px;font-size:10px;color:#666}
#ramen-lab-ui #lab-mode-indicator{position:fixed;bottom:52px;left:50%;transform:translateX(-50%);font-size:11px;letter-spacing:1px;text-transform:uppercase;background:rgba(0,0,0,.75);border:1px solid #333;padding:5px 16px;border-radius:20px;z-index:100;pointer-events:none}
#ramen-lab-ui #lab-subnav{position:fixed;bottom:96px;left:50%;transform:translateX(-50%);display:none;gap:8px;z-index:150;flex-wrap:wrap;justify-content:center;pointer-events:auto}
#ramen-lab-ui #lab-subnav.visible{display:flex}
#ramen-lab-ui #lab-subnav button{background:#0a0a1a;border:1px solid #444;color:#aaa;border-radius:14px;padding:6px 14px;font-size:11px;font-family:'Courier New',monospace;cursor:pointer}
#ramen-lab-ui #lab-subnav button:hover{background:#1a1a2a;color:#fff}
#ramen-lab-ui #lab-subnav button.active{border-color:var(--sub-color,#00cfff);color:var(--sub-color,#00cfff);background:#0a0a2a}
#ramen-lab-ui #lab-back-btn{position:fixed;bottom:52px;left:14px;display:none;z-index:150;pointer-events:auto}
#ramen-lab-ui #lab-back-btn button{background:#1a1a2a;border:1px solid #ff7f00;color:#ff7f00;border-radius:20px;padding:7px 18px;font-size:11px;font-family:'Courier New',monospace;cursor:pointer}
#ramen-lab-ui #lab-coord-debug{position:fixed;bottom:130px;left:14px;font-size:10px;color:#ff7f00;z-index:50;line-height:1.8;pointer-events:auto;cursor:pointer;font-family:'Courier New',monospace;background:rgba(0,0,0,.7);padding:5px 9px;border-radius:6px}
#ramen-lab-ui #lab-hint{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);font-size:10px;color:#333;z-index:100;text-align:center;background:rgba(0,0,0,.5);padding:4px 14px;border-radius:20px;pointer-events:none}
#ramen-lab-ui #inductor-panel{position:fixed;top:52px;right:10px;display:none;flex-direction:column;gap:6px;z-index:210;background:rgba(0,0,0,.85);border:1px solid #ff3333;border-radius:10px;padding:10px;width:150px;pointer-events:auto}
#ramen-lab-ui #inductor-panel.visible{display:flex}
#ramen-lab-ui #inductor-panel .ind-title{font-size:10px;color:#ff3333;letter-spacing:1px;margin-bottom:4px}
#ramen-lab-ui #inductor-panel button{background:#1a1a2a;border:1px solid #3a3a5a;color:#ccc;border-radius:6px;padding:6px 10px;font-size:11px;font-family:'Courier New',monospace;cursor:pointer}
#ramen-lab-ui #inductor-panel button.flow-off{background-color:rgb(80,20,20)}
#ramen-lab-ui #inductor-panel button.flow-on{background-color:rgb(20,80,20)}
#ramen-lab-ui #inductor-panel #freqRow{display:none;gap:4px}
#ramen-lab-ui #inductor-panel #freqRow.visible{display:flex}
#ramen-lab-ui #inductor-panel #freqRow button{flex:1;padding:5px 4px;font-size:10px}
</style>
<div class="lab-topbar"><span class="lab-title">🍜 Step 09 — Inductor</span><span class="lab-status" id="top-status">Loading…</span></div>
<div id="lab-btn-row"><button class="lab-btn active" id="btn-log">📋 Log</button></div>
<div id="lab-log-panel"><div id="log-entries"></div><div id="lab-progress-bar-wrap"><div id="lab-progress-bar"></div></div><div id="lab-summary"></div></div>
<div id="lab-mode-indicator" style="color:#888">● DEFAULT VIEW</div>
<div id="lab-subnav"></div>
<div id="lab-back-btn"><button>← Back</button></div>
<div id="lab-coord-debug">cam: —<br>tgt: —</div>
<div id="lab-hint">Click: Projects · About Me · Articles · Credits</div>
<div id="inductor-panel">
  <div class="ind-title">⚡ INDUCTOR DEMO</div>
  <button id="ind-flip">DC VOLTAGE</button>
  <button id="ind-flow" class="flow-off">OFF</button>
  <div id="freqRow"><button id="ind-lowF">LOW f</button><button id="ind-highF">HIGH f</button></div>
</div>`;
document.body.appendChild(labUIRoot);

const logWrap = labUIRoot.querySelector('#log-entries');
const barEl = labUIRoot.querySelector('#lab-progress-bar');
const summaryEl = labUIRoot.querySelector('#lab-summary');
const topStatus = labUIRoot.querySelector('#top-status');
const modeEl = labUIRoot.querySelector('#lab-mode-indicator');
const backBtn = labUIRoot.querySelector('#lab-back-btn');
const subnavEl = labUIRoot.querySelector('#lab-subnav');
const coordEl = labUIRoot.querySelector('#lab-coord-debug');
const icons={pending:'⏳',ok:'✅',err:'❌',info:'📌',head:'──',click:'👆',screen:'🖥',ind:'⚡'};

function log(msg,type='info'){
  const d=document.createElement('div');
  d.className=`log-entry ${type}`;
  d.innerHTML=`<span>${icons[type]||'·'}</span><span>${msg}</span>`;
  logWrap.appendChild(d);
  logWrap.scrollTop=logWrap.scrollHeight;
  console.log(`[${type}] ${msg}`);
}
function setBar(pct){barEl.style.width=pct+'%';}
function setLabStatus(msg,col){topStatus.textContent=msg;topStatus.style.color=col||'#888';}

function toggleLabLog(){
  const h=labUIRoot.querySelector('#lab-log-panel').classList.toggle('hidden');
  labUIRoot.querySelector('#btn-log').classList.toggle('active',!h);
}
function hideAll(){
  labUIRoot.querySelector('#lab-log-panel').classList.add('hidden');
  labUIRoot.querySelector('#btn-log').classList.remove('active');
}
labUIRoot.querySelector('#btn-log').addEventListener('click',toggleLabLog);
labUIRoot.querySelector('#lab-back-btn button').addEventListener('click',()=>window.goHome());

window.addEventListener('error',e=>log('ERROR: '+e.message,'err'));
window.addEventListener('unhandledrejection',e=>log('REJECT: '+(e.reason?.message||e.reason),'err'));


const GLTF_SHOP   = './models/ramenShopExhibtStand.glb';
const GLTF_HOLO   = './models/ramenHologram.gltf';
const DRACO_PATH  = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';
const BASIS_PATH  = 'https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/libs/basis/';

// ── LOADERS ──────────────────────────────────────────────────
// Reuse main_v2.js renderer + DRACO loader + GLTFLoader.
// KTX2 is added specifically for the ramen-shop baked texture pipeline.
const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath(
  'https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/libs/basis/'
);
ktx2Loader.detectSupport(renderer);

const texLoader = new THREE.TextureLoader();
const gltfLoader = loader;
gltfLoader.setKTX2Loader(ktx2Loader);
// ── TEXTURE HELPERS ──────────────────────────────────────────
const texCache={};
function loadKTX2(path){
  return new Promise(r=>{
    if(texCache[path]){r(texCache[path]);return;}
    ktx2Loader.load(path,t=>{texCache[path]=t;r(t);},undefined,
      ()=>{const p=path.replace('.ktx2','.png');texLoader.load(p,t=>{texCache[path]=t;r(t);},undefined,()=>r(null));});
  });
}
function loadPNG(path){
  return new Promise(r=>{
    if(texCache[path]){r(texCache[path]);return;}
    texLoader.load(path,t=>{texCache[path]=t;r(t);},undefined,()=>r(null));
  });
}
function loadBasis(path){
  return new Promise(r=>{
    if(texCache[path]){r(texCache[path]);return;}
    ktx2Loader.load(path,t=>{texCache[path]=t;r(t);},undefined,()=>r(null));
  });
}
function applyMat(meshMap,name,material){
  const t=meshMap[name];if(!t)return false;
  t.traverse(o=>{if(o.isMesh)o.material=material;});return true;
}
function bakedMat(tex){tex.flipY=false;tex.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:tex});}
function screenMat(tex) {
  tex.flipY = false              // ← add this
  tex.colorSpace = THREE.SRGBColorSpace
  return new THREE.MeshBasicMaterial({ map: tex })
}

function vendingScreenMat(tex) {
  tex.flipY = false
  tex.colorSpace = THREE.SRGBColorSpace
  tex.repeat.set(0.854, 1.0)
  tex.offset.set(0.0, 0.0)
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return new THREE.MeshBasicMaterial({ map: tex })
}

function videoMat(src){
  const v=document.createElement('video');
  v.src=src;v.loop=true;v.muted=true;v.playsInline=true;v.crossOrigin='anonymous';v.play().catch(()=>{});
  const t=new THREE.VideoTexture(v);t.colorSpace=THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({map:t});
}
function cycleScreens(target,textures,intervalMs){
  if(!textures.length)return;let idx=0;
  const set=()=>{const m=new THREE.MeshBasicMaterial({map:textures[idx]});target.traverse(o=>{if(o.isMesh)o.material=m;});};
  set();if(textures.length<2)return;
  return setInterval(()=>{idx=(idx+1)%textures.length;set();},intervalMs);
}

// ── MATERIAL DATA (Steps 2-4) ────────────────────────────────
const BAKED=[
  ['ramenShopJoined',    './textures/baked/ramenShopBaked1024.ktx2'],
  ['machinesJoined',     './textures/baked/machinesBaked1024.ktx2' ],
  ['floor',              './textures/baked/floorBaked1024.ktx2'    ],
  ['miscJoined',         './textures/baked/machinesBaked1024.ktx2'     ],
  ['graphicsJoined',     './textures/baked/graphicsBaked512.ktx2'  ],
  ['jesseZhouJoined',    './textures/baked/ramenShopBaked1024.ktx2'],
  ['chinese',            './textures/baked/ramenShopBaked1024.ktx2'],
  ['easelFrontGraphic',  './textures/baked/ramenShopBaked1024.ktx2'],
  ['vendingMachineLight','./textures/baked/machinesBaked1024.ktx2' ],
  ['arcadeRim',          './textures/baked/machinesBaked1024.ktx2' ],
  ['arcadeToken',        './textures/baked/machinesBaked1024.ktx2' ],
  ['dishStand',          './textures/baked/ramenShopBaked1024.ktx2'],
];
const COLORS=[
  ['projectsRed',0xe8003c],['projectsWhite',0xffffff],
  ['aboutMeBlue',0x00cfff],['aboutMeBlack',0x111111],
  ['articlesRed',0xff4400],['articlesWhite',0xffffff],
  ['creditsOrange',0xff8800],['creditsBlack',0x111111],
  ['jZhouPink',0xff44aa],['jZhouBlack',0x111111],
  ['greenSignSquare',0x00cc44],['greenLED',0x00ff44],
  ['redLED',0xff2200],['yellowRightLight',0xffee00],['whiteButton',0xffffff],
];
const MATCAPS=[
  [['neonBlue'],                                           './textures/matcaps/neonBlueMatCap.ktx2', null],
  [['neonGreen'],                                          './textures/matcaps/neonGreenMatCap.ktx2',null],
  [['neonPink','neonYellow'],                              './textures/matcaps/neonBlueMatCap.ktx2', null],
  [['fan1','fan2'],                                        './textures/matcaps/fanMatCap.ktx2',       null],
  [['dish'],                                               './textures/matcaps/dishMatCap.ktx2',      null],
  [['lampLights'],                                         null,'./textures/matcaps/lightMatcap.png'      ],
  [['storageLight','portalLight','blueLights','poleLight'],'./textures/matcaps/neonBlueMatCap.ktx2', null],
];
const VIDEO_SCREENS=[
  ['littleTVScreen','./textures/videosTextures/littleTVScreen.mp4'],
  ['tallScreen',    './textures/videosTextures/tallScreen.mp4'    ],
  ['tvScreen',      './textures/videosTextures/tvScreen.mp4'      ],
  ['smallScreen3',  './textures/videosTextures/smallScreen3.mp4'  ],
  ['smallScreen4',  './textures/videosTextures/smallScreen4.mp4'  ],
  ['smallScreen5',  './textures/videosTextures/smallScreen5.mp4'  ],
];
const SIDE_PATHS=['sideScreen1','sideScreen2','sideScreen3'].map(n=>`./textures/screens/sideScreens/${n}.ktx2`);
const SMALL1_PATHS=[1,2,3,4,5].map(i=>`./textures/screens/smallScreen1/${i}.basis`);
const SMALL2_PATHS=[1,2,3,4,5].map(i=>`./textures/screens/smallScreen2/${i}.basis`);

const SCREEN_TEX={};
const SCREEN_LOAD_LIST=[
  ['bigScreenDefault',     './textures/screens/aboutMeScreens/bigScreenDefault.ktx2'           ],
  ['vendingDefault',       './textures/screens/vendingMachineScreens/vendingMachineDefault.ktx2'],
  ['arcadeDefault',        './textures/screens/arcadeScreens/arcadeScreenDefault.ktx2'          ],
  ['easelTouch',           './textures/screens/easel/easelTouch.ktx2'                           ],
  ['bigScreenAbout',       './textures/screens/aboutMeScreens/bigScreenAbout.ktx2'              ],
  ['bigScreenAboutMobile', './textures/screens/aboutMeScreens/bigScreenAboutMobile.ktx2'        ],
  ['bigScreenSkills',      './textures/screens/aboutMeScreens/bigScreenSkills.ktx2'             ],
  ['bigScreenSkillsMobile','./textures/screens/aboutMeScreens/bigScreenSkillsMobile.ktx2'       ],
  ['bigScreenExperience',  './textures/screens/aboutMeScreens/bigScreenExperience.ktx2'         ],
  ['bigScreenExpMobile',   './textures/screens/aboutMeScreens/bigScreenExperienceMobile.ktx2'   ],
  ['vendingMenu',          './textures/screens/vendingMachineScreens/vendingMachineMenu.ktx2'   ],
  ['project1',             './textures/screens/vendingMachineScreens/project1.ktx2'             ],
  ['project2',             './textures/screens/vendingMachineScreens/project2.ktx2'             ],
  ['project3',             './textures/screens/vendingMachineScreens/project3.ktx2'             ],
  ['project4',             './textures/screens/vendingMachineScreens/project4.ktx2'             ],
  ['project5',             './textures/screens/vendingMachineScreens/project5.ktx2'             ],
  ['project6',             './textures/screens/vendingMachineScreens/project6.ktx2'             ],
  ['project7',             './textures/screens/vendingMachineScreens/project7.ktx2'             ],
  ['project8',             './textures/screens/vendingMachineScreens/project8.ktx2'             ],
  ['arcadeCredits',        './textures/screens/arcadeScreens/arcadeScreenCredits.ktx2'          ],
  ['arcadeThanks',         './textures/screens/arcadeScreens/arcadeScreenThanks.ktx2'           ],
];

let meshMap={};
function setScreen(meshName,texKey){
  const tex=SCREEN_TEX[texKey];if(!tex)return;
  applyMat(meshMap,meshName,screenMat(tex));
  log(`  🖥 ${meshName} → ${texKey}`,'screen');
}
const isMobile=innerWidth<600;
function buildSubnav(tabs){
  subnavEl.innerHTML='';
  subnavEl.style.setProperty('--sub-color',tabs.color||'#00cfff');
  tabs.buttons.forEach((btn,i)=>{
    const el=document.createElement('button');
    el.textContent=btn.label;
    if(i===0)el.classList.add('active');
    el.addEventListener('click',()=>{
      subnavEl.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      el.classList.add('active');btn.action();
    });
    subnavEl.appendChild(el);
  });
  subnavEl.classList.add('visible');
  if(tabs.buttons[0])tabs.buttons[0].action();
}
function hideSubnav(){subnavEl.classList.remove('visible');subnavEl.innerHTML='';}

let sideInterval=null;
let creditsTimer=null;

function activateProjects(){
  const _vt = SCREEN_TEX['vendingDefault']
  if (_vt) applyMat(meshMap, 'vendingMachineScreen', vendingScreenMat(_vt))
  buildSubnav({color:'#e8003c',buttons:[
    // Menu button: bloop (UI nav)
    {label:'📋 Menu',action:()=>{ playSound('bloop'); setScreen('vendingMachineScreen','vendingMenu'); }},
    // Project slots: ding (vending machine dispense feel)
    {label:'P1',action:()=>{ playSound('ding'); setScreen('vendingMachineScreen','project1'); }},
    {label:'P2',action:()=>{ playSound('ding'); setScreen('vendingMachineScreen','project2'); }},
    {label:'P3',action:()=>{ playSound('ding'); setScreen('vendingMachineScreen','project3'); }},
    {label:'P4',action:()=>{ playSound('ding'); setScreen('vendingMachineScreen','project4'); }},
    {label:'P5',action:()=>{ playSound('ding'); setScreen('vendingMachineScreen','project5'); }},
    {label:'P6',action:()=>{ playSound('ding'); setScreen('vendingMachineScreen','project6'); }},
    {label:'P7',action:()=>{ playSound('ding'); setScreen('vendingMachineScreen','project7'); }},
    {label:'P8',action:()=>{ playSound('ding'); setScreen('vendingMachineScreen','project8'); }},
  ]});
}
function activateAboutMe(){
  const aKey=isMobile?'bigScreenAboutMobile':'bigScreenAbout';
  const sKey=isMobile?'bigScreenSkillsMobile':'bigScreenSkills';
  const eKey=isMobile?'bigScreenExpMobile':'bigScreenExperience';
  buildSubnav({color:'#00cfff',buttons:[
    // About Me tabs: bloop (soft UI transition)
    {label:'👤 About',     action:()=>{ playSound('bloop'); setScreen('bigScreen',aKey); }},
    {label:'🛠 Skills',    action:()=>{ playSound('bloop'); setScreen('bigScreen',sKey); }},
    {label:'💼 Experience',action:()=>{ playSound('bloop'); setScreen('bigScreen',eKey); }},
  ]});
}
function activateArticles(){
  if(sideInterval){clearInterval(sideInterval);sideInterval=null;}
  const tex=SCREEN_TEX['sideScreen1'];
  if(tex)applyMat(meshMap,'sideScreen',new THREE.MeshBasicMaterial({map:tex}));
  hideSubnav();
}
function activateCredits(){
  setScreen('arcadeScreen','arcadeCredits');
  playSound('arcade');   // arcade cabinet startup sound
  if(creditsTimer)clearTimeout(creditsTimer);
  creditsTimer=setTimeout(()=>setScreen('arcadeScreen','arcadeThanks'),4000);
  hideSubnav();
}
function activateHome(){
  setScreen('bigScreen','bigScreenDefault');
  setScreen('vendingMachineScreen','vendingDefault');
  setScreen('arcadeScreen','arcadeDefault');
  if(sideInterval)clearInterval(sideInterval);
  const sideTex=['sideScreen1','sideScreen2','sideScreen3'].map(k=>SCREEN_TEX[k]).filter(Boolean);
  if(sideTex.length&&meshMap['sideScreen'])sideInterval=cycleScreens(meshMap['sideScreen'],sideTex,3000);
  if(creditsTimer){clearTimeout(creditsTimer);creditsTimer=null;}
  hideSubnav();
}

// ─────────────────────────────────────────────────────────────
//  SOUND ENGINE
//
//  All audio is handled through the Web Audio API via
//  THREE.AudioListener + THREE.Audio (non-positional).
//  We don't use positional audio because the shop is small
//  and all sounds should be heard at full volume regardless
//  of camera position.
//
//  Sound map:
//    cooking.mp3  — ambient background loop (quiet, always on)
//    hologram.mp3 — ambient hologram hum loop (quiet, always on)
//    whoosh.mp3   — camera fly transition (plays on every flyTo)
//    click.mp3    — sign / screen tap (plays on valid raycast hit)
//    ding.mp3     — vending machine project selection
//    bloop.mp3    — sub-nav tab press (About/Skills/Experience, P1-P8)
//    arcade.mp3   — plays when credits view activates
//
//  Browser autoplay policy: AudioContext must be resumed on the
//  first user gesture. We resume on the first pointerdown and
//  show a mute/unmute button in the UI.
// ─────────────────────────────────────────────────────────────

// AudioListener attaches to the camera — required by THREE.Audio
const audioListener = new THREE.AudioListener();
camera.add(audioListener);

// Sound store: name → { audio, buffer }
const SFX = {};
const ambientSounds = [];   // loops that should respect mute state

let audioReady   = false;   // true after first user gesture
let isMuted      = false;
let audioContext = audioListener.context;

// ── Mute button ────────────────────────────────────────────
const muteBtn = document.createElement('button');
muteBtn.id        = 'mute-btn';
muteBtn.className = 'btn';
muteBtn.textContent = '🔊';
muteBtn.style.cssText = 'position:fixed;bottom:52px;right:10px;z-index:200;font-size:14px;padding:5px 10px;';
document.body.appendChild(muteBtn);

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? '🔇' : '🔊';
  // Mute/unmute all sounds via the listener gain
  audioListener.setMasterVolume(isMuted ? 0 : 1);
  log(isMuted ? 'Sound muted' : 'Sound unmuted', 'info');
});

// ── Load a sound ────────────────────────────────────────────
function loadSound(name, path, { loop=false, volume=1.0 }={}) {
  return new Promise(resolve => {
    const audio  = new THREE.Audio(audioListener);
    const loader = new THREE.AudioLoader();
    loader.load(
      path,
      buffer => {
        audio.setBuffer(buffer);
        audio.setLoop(loop);
        audio.setVolume(volume);
        SFX[name] = audio;
        if (loop) ambientSounds.push(audio);
        log(`  ✓ sound loaded: ${name}`, 'ok');
        resolve(audio);
      },
      undefined,
      err => {
        log(`  ✗ sound FAILED: ${name} — ${err?.message||'unknown'}`, 'err');
        resolve(null);
      }
    );
  });
}

// ── Play a one-shot sound ────────────────────────────────────
// Stops and restarts if already playing so rapid taps work
function playSound(name) {
  if (!audioReady || isMuted) return;
  const audio = SFX[name];
  if (!audio) return;
  if (audio.isPlaying) audio.stop();
  audio.play();
}

// ── Start ambient loops ──────────────────────────────────────
function startAmbient() {
  if (!audioReady) return;
  ['cooking', 'hologram'].forEach(name => {
    const a = SFX[name];
    if (a && !a.isPlaying) a.play();
  });
}

// ── Resume AudioContext on first gesture ─────────────────────
// Required by browser autoplay policy — context starts suspended
function resumeAudio() {
  if (audioReady) return;
  audioContext.resume().then(() => {
    audioReady = true;
    startAmbient();
    log('AudioContext resumed ✓ — ambient sounds started', 'ok');
  });
}

// Hook into existing pointer handlers
renderer.domElement.addEventListener('pointerdown', resumeAudio, { once: false });

// ── Preload all sounds ───────────────────────────────────────
async function loadAllSounds() {
  log('── Sound loading ──', 'head');
  await Promise.all([
    loadSound('cooking',  './sound/cooking.mp3',  { loop:true,  volume:0.18 }),
    loadSound('hologram', './sound/hologram.mp3', { loop:true,  volume:0.12 }),
    loadSound('whoosh',   './sound/whoosh.mp3',   { loop:false, volume:0.7  }),
    loadSound('click',    './sound/click.mp3',    { loop:false, volume:0.8  }),
    loadSound('ding',     './sound/ding.mp3',     { loop:false, volume:0.9  }),
    loadSound('bloop',    './sound/bloop.mp3',    { loop:false, volume:0.7  }),
    loadSound('arcade',   './sound/arcade.mp3',   { loop:false, volume:0.75 }),
  ]);
  log('All sounds loaded ✓', 'ok');
}

// ── VIEWS ────────────────────────────────────────────────────
const VIEWS={
  home:{camPos:new THREE.Vector3(-11,8,22),target:new THREE.Vector3(0,2,-2),
    label:'● DEFAULT VIEW',color:'#888',minPolar:0,maxPolar:Math.PI/2,minAzi:-Infinity,maxAzi:Infinity,minDist:5,maxDist:300,onArrive:activateHome},
  projects:{camPos:new THREE.Vector3(1.65,2.91,7.53),target:new THREE.Vector3(0.57,1.05,0.20),
    label:'🛒 PROJECTS',color:'#e8003c',minPolar:Math.PI*0.25,maxPolar:Math.PI*0.6,minAzi:-0.4,maxAzi:0.4,minDist:2,maxDist:14,onArrive:activateProjects},
  aboutMe:{camPos:new THREE.Vector3(1.27,7.25,10.47),target:new THREE.Vector3(0.45,7.13,-2.00),
    label:'👤 ABOUT ME',color:'#00cfff',minPolar:Math.PI*0.2,maxPolar:Math.PI*0.5,minAzi:-0.3,maxAzi:0.3,minDist:4,maxDist:20,onArrive:activateAboutMe},
  articles:{camPos:new THREE.Vector3(-0.60,7.94,11.76),target:new THREE.Vector3(-0.00,2.00,-2.00),
    label:'📰 ARTICLES',color:'#ff4400',minPolar:Math.PI*0.2,maxPolar:Math.PI*0.6,minAzi:-0.5,maxAzi:0.5,minDist:3,maxDist:18,onArrive:activateArticles},
  credits:{camPos:new THREE.Vector3(-1.19,2.69,6.13),target:new THREE.Vector3(0.47,0.35,-0.12),
    label:'🎮 CREDITS',color:'#ff8800',minPolar:Math.PI*0.25,maxPolar:Math.PI*0.6,minAzi:-0.5,maxAzi:0.5,minDist:2,maxDist:12,onArrive:activateCredits},
};

let currentMode='home',isTransitioning=false;

for (const view of Object.values(VIEWS)) {
  view.camPos.add(RAMEN_SHOP_WORLD_POSITION);
  view.target.add(RAMEN_SHOP_WORLD_POSITION);
}


function flyTo(viewKey){
  if(isTransitioning||currentMode===viewKey)return;
  isTransitioning=true; controls.enabled=false;
  const view=VIEWS[viewKey];
  const pp={x:camera.position.x,y:camera.position.y,z:camera.position.z};
  const tp={x:controls.target.x,y:controls.target.y,z:controls.target.z};
  gsap.to(pp,{x:view.camPos.x,y:view.camPos.y,z:view.camPos.z,duration:1.8,ease:'power2.inOut',
    onUpdate(){camera.position.set(pp.x,pp.y,pp.z);}});
  gsap.to(tp,{x:view.target.x,y:view.target.y,z:view.target.z,duration:1.8,ease:'power2.inOut',
    onUpdate(){controls.target.set(tp.x,tp.y,tp.z);controls.update();},
    onComplete(){
      controls.minPolarAngle=view.minPolar; controls.maxPolarAngle=view.maxPolar;
      controls.minAzimuthAngle=view.minAzi; controls.maxAzimuthAngle=view.maxAzi;
      controls.minDistance=view.minDist; controls.maxDistance=view.maxDist;
      controls.enabled=true; isTransitioning=false; currentMode=viewKey;
      modeEl.textContent=view.label; modeEl.style.color=view.color;
      backBtn.style.display=viewKey==='home'?'none':'block';
      if(view.onArrive)view.onArrive();
      log(`📍 Arrived: ${view.label}`,'click');
    }
  });
  log(`🎬 Flying to: ${view.label}`,'click');
  modeEl.textContent=view.label; modeEl.style.color=view.color;

  // Whoosh on every camera transition
  playSound('whoosh');
}

window.goHome=function(){
  if(!labModeActive || isTransitioning)return;
  const prev=currentMode; currentMode='temp';
  flyTo('home');
  setTimeout(()=>{
    controls.minPolarAngle=VIEWS.home.minPolar; controls.maxPolarAngle=VIEWS.home.maxPolar;
    controls.minAzimuthAngle=VIEWS.home.minAzi; controls.maxAzimuthAngle=VIEWS.home.maxAzi;
    controls.minDistance=VIEWS.home.minDist; controls.maxDistance=VIEWS.home.maxDist;
    backBtn.style.display='none';
  },2000);
};

// ── RAYCASTER ────────────────────────────────────────────────
const raycaster=new THREE.Raycaster();
const pointer=new THREE.Vector2();
let clickableMeshes=[];
const CLICK_MAP={
  'projectsRed':'projects','projectsWhite':'projects',
  'aboutMeBlue':'aboutMe','aboutMeBlack':'aboutMe',
  'articlesRed':'articles','articlesWhite':'articles',
  'creditsOrange':'credits','creditsBlack':'credits',
  'vendingMachineScreen':'projects','bigScreen':'aboutMe',
  'arcadeScreen':'credits','sideScreen':'articles',
};
function onDown(e){pointer._dx=e.touches?e.touches[0].clientX:e.clientX;pointer._dy=e.touches?e.touches[0].clientY:e.clientY;}
function onUp(e){
  if(!labModeActive || isTransitioning)return;
  const cx=e.changedTouches?e.changedTouches[0].clientX:e.clientX;
  const cy=e.changedTouches?e.changedTouches[0].clientY:e.clientY;
  if(Math.abs(cx-(pointer._dx||0))>8||Math.abs(cy-(pointer._dy||0))>8)return;
  const rect=renderer.domElement.getBoundingClientRect();
  pointer.x=((cx-rect.left)/rect.width)*2-1;
  pointer.y=-((cy-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(clickableMeshes,false);
  if(hits.length){
    const name=hits[0].object.userData.clickName||hits[0].object.name;
    const vk=CLICK_MAP[name];
    if(vk){
      playSound('click');   // tap feedback on valid hit
      log(`👆 ${name} → ${vk}`,'click');
      flyTo(vk);
    }
  }
}
renderer.domElement.addEventListener('pointerdown',onDown);
renderer.domElement.addEventListener('pointerup',onUp);
renderer.domElement.addEventListener('touchstart',onDown,{passive:true});
renderer.domElement.addEventListener('touchend',onUp,{passive:true});

// ─────────────────────────────────────────────────────────────
//  HOLOGRAM SHADER
//
//  Reconstructed from the original repo's hologramShaders/ and
//  the Three.js Journey holographic shader lesson.
//
//  VERTEX SHADER — passes world-space position and surface
//  normal (in view space) to the fragment stage.
//  The normal is used for the Fresnel rim calculation.
//
//  FRAGMENT SHADER — four layered effects:
//  1. Horizontal scan lines — fract(vPosition.y * lineCount + time)
//     creates repeating bright bands that scroll upward over time.
//  2. Fresnel rim glow — dot(vNormal, viewDir) gives 0 at edges,
//     1 at centre. We invert so edges glow: (1 - dot)^power.
//     This makes the silhouette rim burn brightest, fading toward
//     the centre — the classic hologram edge effect.
//  3. Pulsing opacity — sin(time) drives alpha so the hologram
//     breathes in and out, never going fully transparent.
//  4. Glitch flicker — occasional rapid sin(time*50) spike adds
//     the sci-fi instability feel.
//
//  Hologram colour: #00eeff (cyan-teal) matching the original.
//  Transparency: side=THREE.DoubleSide, depthWrite:false so the
//  hologram composites over the scene without z-fighting.
// ─────────────────────────────────────────────────────────────

const holoVertexShader = /* glsl */`
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    // World-space position — used for scan line Y coordinate
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vPosition = modelPosition.xyz;

    // View-space normal — used for Fresnel dot product
    // normalMatrix transforms normals correctly into view space
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

const holoFragmentShader = /* glsl */`
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uLineCount;   // number of scan lines
  uniform float uLineSpeed;   // scroll speed
  uniform float uFresnelPow;  // rim sharpness (higher = thinner rim)
  uniform float uOpacityMin;  // minimum alpha (never fully invisible)
  uniform float uOpacityMax;  // maximum alpha peak

  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    // ── 1. Scan lines ──────────────────────────────────────
    // fract creates the repeating 0→1 ramp. Multiplying by a
    // step makes thin bright lines on a dark field.
    float scanLine = fract(vPosition.y * uLineCount + uTime * uLineSpeed);
    // Narrow bright band: values near 0 or 1 → bright
    float line = step(0.85, scanLine);

    // ── 2. Fresnel rim ─────────────────────────────────────
    // vNormal is in view space; viewDir for view-space normals
    // is always (0,0,1) — we don't need the actual camera vec.
    float fresnel = dot(vNormal, vec3(0.0, 0.0, 1.0));
    fresnel = clamp(fresnel, 0.0, 1.0);
    // Invert so rim (low dot) is bright, centre is dark
    float rim = pow(1.0 - fresnel, uFresnelPow);

    // ── 3. Pulsing opacity ─────────────────────────────────
    float pulse = sin(uTime * 1.5) * 0.5 + 0.5;   // 0→1
    float alpha = mix(uOpacityMin, uOpacityMax, pulse);

    // ── 4. Glitch flicker ──────────────────────────────────
    // Rare fast flicker — abs(sin) creates sharp spikes
    float glitch = abs(sin(uTime * 40.0));
    glitch = step(0.98, glitch) * 0.4;   // fires ~2% of time

    // ── Combine ─────────────────────────────────────────────
    // Base: rim glow + scan lines
    float intensity = rim * 0.6 + line * 0.4;
    // Final alpha: base alpha * intensity + glitch spike
    float finalAlpha = (alpha * intensity) + glitch;
    finalAlpha = clamp(finalAlpha, 0.0, 1.0);

    // Colour: hologram cyan, brightness driven by rim + lines
    vec3 color = uColor * (rim + line * 0.5 + 0.1);

    gl_FragColor = vec4(color, finalAlpha);
  }
`;

// Create the hologram ShaderMaterial
const holoUniforms = {
  uTime:       { value: 0.0 },
  uColor:      { value: new THREE.Color(0x00eeff) },
  uLineCount:  { value: 80.0 },    // scan line density
  uLineSpeed:  { value: 1.2 },     // scroll speed (upward)
  uFresnelPow: { value: 2.0 },     // rim sharpness
  uOpacityMin: { value: 0.15 },    // breath minimum
  uOpacityMax: { value: 0.85 },    // breath maximum
};

const holoMaterial = new THREE.ShaderMaterial({
  vertexShader:   holoVertexShader,
  fragmentShader: holoFragmentShader,
  uniforms:       holoUniforms,
  transparent:    true,
  depthWrite:     false,          // composites correctly over scene
  side:           THREE.DoubleSide,
  blending:       THREE.AdditiveBlending,  // glow adds to scene behind it
});

const GLTF_SHOP   = './models/ramenShopExhibtStand.glb';
const GLTF_HOLO   = './models/ramenHologram.gltf';

// ─────────────────────────────────────────────────────────────
//  MAIN LOAD — shop first, then hologram
//  Integrated into the shared main_v2 scene.
// ─────────────────────────────────────────────────────────────
let labReadyResolve;
let labReadyReject;
const labReadyPromise = new Promise((resolve, reject) => {
  labReadyResolve = resolve;
  labReadyReject = reject;
});

async function loadRamenLabAssets() {
  log('── Ramen Shop + Lab simulation ──','head');
  log('Fetching ramenShop.gltf …','pending');

  try {
    const response = await fetch(GLTF_SHOP);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await response.text();
    log('Shop GLTF reachable ✓','ok');
    setBar(8);
  } catch (error) {
    log('FETCH FAILED: '+error.message,'err');
    setLabStatus('Error ❌','#ff5f5f');
    labReadyResolve();
    return labReadyPromise;
  }

  loadShop();
  return labReadyPromise;
}

function loadShop(){
  log('Loading ramenShop.gltf …','pending');
  gltfLoader.load(GLTF_SHOP, async(gltf)=>{
    log('Shop GLTF parsed ✓','ok'); setBar(18);

    const model=gltf.scene;
    model.traverse(o=>{if(o.name)meshMap[o.name]=o;});
    log(`${Object.keys(meshMap).length} named objects`,'ok');

    // Load sounds in parallel while we process the model
    loadAllSounds();

    const bbox=new THREE.Box3().setFromObject(model);
    const center=bbox.getCenter(new THREE.Vector3());
    const size=bbox.getSize(new THREE.Vector3());
    model.position.x-=center.x; model.position.z-=center.z; model.position.y-=bbox.min.y;
    model.traverse(c=>{if(c.isMesh){c.receiveShadow=true;c.castShadow=false;}});
    model.position.set(0, 0, 0);
    ramenLabRoot.add(model);

    const sh=size.y;
    log(`Shop: ${size.x.toFixed(1)}×${sh.toFixed(1)}×${size.z.toFixed(1)}`,'info');
    setBar(22);

    Object.keys(CLICK_MAP).forEach(name=>{
      const obj=meshMap[name];if(!obj)return;
      obj.traverse(o=>{if(o.isMesh){o.userData.clickName=name;clickableMeshes.push(o);}});
    });

    // ── Baked ──
    log('── Baked textures ──','head');
    for(const[name,ktx2]of BAKED){
      const tex=await loadKTX2(ktx2);if(!tex)continue;
      applyMat(meshMap,name,bakedMat(tex));
    }
    setBar(38);

    for(const[name,hex]of COLORS)applyMat(meshMap,name,new THREE.MeshBasicMaterial({color:hex}));
    setBar(44);

    log('── Matcaps ──','head');
    for(const[names,ktx2,png]of MATCAPS){
      const tex=ktx2?await loadKTX2(ktx2):await loadPNG(png);if(!tex)continue;
      const mat=new THREE.MeshMatcapMaterial({matcap:tex});
      names.forEach(n=>applyMat(meshMap,n,mat));
    }
    setBar(54);

    for(const[name,src]of VIDEO_SCREENS)applyMat(meshMap,name,videoMat(src));
    const s1=(await Promise.all(SMALL1_PATHS.map(loadBasis))).filter(Boolean);
    s1.forEach(t=>{t.colorSpace=THREE.SRGBColorSpace;});
    if(meshMap['smallScreen1']&&s1.length)cycleScreens(meshMap['smallScreen1'],s1,2000);
    const s2=(await Promise.all(SMALL2_PATHS.map(loadBasis))).filter(Boolean);
    s2.forEach(t=>{t.colorSpace=THREE.SRGBColorSpace;});
    if(meshMap['smallScreen2']&&s2.length)cycleScreens(meshMap['smallScreen2'],s2,2000);
    setBar(62);

    log('── Screen textures ──','head');
    const sideTex=[];
    for(const p of SIDE_PATHS){
      const tex=await loadKTX2(p);
      if(tex){
        tex.colorSpace=THREE.SRGBColorSpace;
        const key=p.split('/').pop().replace('.ktx2','');
        SCREEN_TEX[key]=tex; sideTex.push(tex);
      }
    }
    if(meshMap['sideScreen']&&sideTex.length)sideInterval=cycleScreens(meshMap['sideScreen'],sideTex,3000);

    let loaded=0;
    for(const[key,path]of SCREEN_LOAD_LIST){
      const tex=await loadKTX2(path);
      if(tex){tex.colorSpace=THREE.SRGBColorSpace;SCREEN_TEX[key]=tex;loaded++;}
      setBar(62+Math.round((loaded/SCREEN_LOAD_LIST.length)*18));
    }
    log(`${loaded}/${SCREEN_LOAD_LIST.length} screen textures ✓`,'ok');

    setScreen('bigScreen','bigScreenDefault');
    setScreen('vendingMachineScreen','vendingDefault');
    setScreen('arcadeScreen','arcadeDefault');
    if(SCREEN_TEX['easelTouch'])applyMat(meshMap,'easelFrontGraphic',screenMat(SCREEN_TEX['easelTouch']));
    setBar(82);

    // ── Now load hologram ──
    loadHologram(sh);

  },
  (xhr)=>{if(xhr.total)setBar(8+Math.round((xhr.loaded/xhr.total)*10));},
  (err)=>{
    log('Shop GLTFLoader ERROR: '+(err?.message||err),'err');
    setLabStatus('Error ❌','#ff5f5f');
    labReadyResolve();
  }
  );
}

// ─────────────────────────────────────────────────────────────
//  HOLOGRAM LOAD
//  The hologram model is 106.97×78.01×91.56 units — enormous.
//  The shop is 49.9×10.09×49.9.
//  We scale it down to fit above the neon sign.
//
//  Target: hologram ~2 units wide, ~1.5 units tall
//  Scale factor ≈ 2 / 106.97 ≈ 0.0187
//  Position: centred X, Y just above the neon sign (~7.5 units),
//  Z slightly in front of the shop face (~-1)
// ─────────────────────────────────────────────────────────────
function loadHologram(shopHeight){
  log('── Step 7: ramenHologram.gltf ──','head');
  log('Fetching ramenHologram.gltf …','pending');

  gltfLoader.load(
    GLTF_HOLO,

    (gltf)=>{
      log('Hologram GLTF parsed ✓','ok');

      const holo=gltf.scene;

      // Requested final calibration:
      // WORLD: SCALE 1 / 1 / 1
      //        OFFSET 12.3000 / 11.5000 / 1.4000
      // The ramenLabRoot is at WORLD 12.5500 / 6.7000 / 2.2000,
      // so these become LOCAL -0.2500 / 4.8000 / -0.8000.
      holo.scale.set(1.0000, 1.0000, 1.0000);
      holo.position.set(-0.2500, 4.8000, -0.8000);
      log('Hologram calibration: scale 1 / 1 / 1 ✓','info');
      log('Hologram world position: 12.3000 / 11.5000 / 1.4000 ✓','info');

      // Apply hologram shader to every mesh in the model
      let meshCount=0;
      holo.traverse(child=>{
        if(child.isMesh){
          child.material  = holoMaterial;
          child.castShadow    = false;
          child.receiveShadow = false;
          meshCount++;
        }
      });
      log(`Hologram shader applied to ${meshCount} mesh(es) ✓`,'ok');

      ramenLabRoot.add(holo);

      // Store reference for animation loop
      window._holoScene = holo;

      setBar(92);
      log('▶ STEP 8 COMPLETE — Hologram + Sound live','ok');

      // ── Now load the inductor demo (Step 09) ──
      loadInductor();
    },

    (xhr)=>{if(xhr.total)log(`Hologram: ${Math.round((xhr.loaded/xhr.total)*100)}%`,'pending');},

    (err)=>{
      log('Hologram GLTF ERROR: '+(err?.message||err),'err');
      log('Continuing without hologram — check ./models/ramenHologram.gltf path','info');
      setBar(92);
      setLabStatus('⚠️ Hologram failed — shop OK','#f0c060');
      // Still attempt the inductor demo even if hologram failed
      loadInductor();
    }
  );
}

// ─────────────────────────────────────────────────────────────
//  STEP 09/10 — INDUCTOR DEMO (self-inductance / Faraday's Law)
//  FINAL CONSOLIDATED VERSION
//
//  Loads ./models/powersupply.glb as a standalone rig placed
//  into the shop scene using the calibration below:
//
//    SCALE_X=1.0000 SCALE_Y=1.0000 SCALE_Z=1.0000
//    OFFSET_X=-2.6000 OFFSET_Y=-0.5637 OFFSET_Z=0.8352
//    ROT_X=0.0° ROT_Y=0.0° ROT_Z=0.0°
//
//  Includes fixes applied after initial integration:
//   - Coil radius (r) and pitch (b) now correctly multiplied by
//     INDUCTOR_UNIT — previously only `extrude` was scaled, so
//     the coil was built ~100x too large and disconnected from
//     the connector wires.
//   - AC oscilloscope reverted to procedural 3D world-space
//     geometry (axis box + sine outline + sweeping THREE.Points
//     clouds) — the TV-mesh canvas-texture version didn't work
//     out, so this goes back to the original approach. The
//     oscilloscope group is positioned at the same Y height as
//     IND_OFFSET.y so it lines up with the rest of the rig.
//   - All text labels (INDUCTOR, RESISTOR, EMF, +/-, current
//     status) sized down substantially to match shop scale.
// ─────────────────────────────────────────────────────────────

const GLTF_POWERSUPPLY = './models/powersupply.glb';

// Calibration supplied for this integration
const IND_OFFSET = new THREE.Vector3(-2.6000, 1.5637, 0.8352);
const IND_SCALE   = new THREE.Vector3(1.0000, 1.0000, 1.0000);
const IND_ROT     = new THREE.Euler(
  THREE.MathUtils.degToRad(0.0),
  THREE.MathUtils.degToRad(0.0),
  THREE.MathUtils.degToRad(0.0)
);

// Root group everything inductor-related hangs off of, so the
// whole demo can be positioned/scaled as one unit and toggled
// visible/invisible without touching the shop model at all.
const inductorRoot = new THREE.Group();
inductorRoot.name = 'inductorRoot';
inductorRoot.position.copy(IND_OFFSET);
inductorRoot.scale.copy(IND_SCALE);
inductorRoot.rotation.copy(IND_ROT);
ramenLabRoot.add(inductorRoot);

// Procedural geometry scale — the original inductor page used
// coordinates in the hundreds inside a scene with far=50000.
// The ramen shop's coordinate space is roughly 1/100th that
// scale, so every procedural dimension is multiplied by
// INDUCTOR_UNIT to compress the original demo geometry down.
const INDUCTOR_UNIT = 0.01;

// Label text size multiplier — shop scale needs labels far
// smaller than the original standalone page's canvas-texture
// sizes (which were tuned for a scene with far=50000). This
// gets applied on top of INDUCTOR_UNIT in indMakeText below.
// Raise this later if labels need to read more clearly.
const INDUCTOR_LABEL_SCALE = 0.12;

// Mixer + node refs, populated once the GLB resolves.
let indModel, indMixer;
let indKnob, indPlus, indMinus;
let indActions = {};      // {clipName: AnimationAction}
let indModelReady = false;

// Procedural-geometry containers
let indSpring        = new THREE.Group();  // the coil
let indConnectors    = new THREE.Group();  // wire tubes
let indResistor;
let indBulbGroup, indBulbLight, indBulbMaterial;
let indDisplayGroup  = new THREE.Group();  // shared home for DC label / AC waveform children

const indParams = {
  b: 2.4,
  p: 500,
  extrude: 5,
  r: 40,
  t: 119.6,
  points: 200
};

// Shared resources reused by every text label
const indLabelGeometry = new THREE.PlaneGeometry(10, 10);

function indMakeLabelCanvas(size, name, backgdCol, color){
  const borderSize = 2;
  const ctx = document.createElement('canvas').getContext('2d');
  const font = `${size}px bold sans-serif`;
  ctx.font = font;
  const doubleBorderSize = borderSize * 2;
  const width = ctx.measureText(name).width + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.font = font;               // must re-set after canvas resize clears state
  ctx.textBaseline = 'top';
  ctx.fillStyle = backgdCol;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.fillText(name, borderSize, borderSize);
  return ctx.canvas;
}

function indMakeText(x, y, z, size, material, name, backgdCol, color){
  const canvas = indMakeLabelCanvas(size, name, backgdCol, color);
  material.map = new THREE.CanvasTexture(canvas);
  const root = new THREE.Object3D();
  root.position.set(x, y, z);
  const label = new THREE.Mesh(indLabelGeometry, material);
  root.add(label);
  // Combines shop-scale compression (INDUCTOR_UNIT) with an
  // additional label-specific shrink (INDUCTOR_LABEL_SCALE) so
  // text reads as small signage rather than room-sized banners.
  const labelBaseScale = 0.1 * INDUCTOR_UNIT * 10 * INDUCTOR_LABEL_SCALE;
  label.scale.x = canvas.width * labelBaseScale;
  label.scale.y = canvas.height * labelBaseScale;
  return root;
}

// ── Helix coil (procedural) — FIXED: r and b now scaled ─────
function indHelixPoint(a, b, t){
  return new THREE.Vector3(a * Math.cos(t), a * Math.sin(t), b * t);
}
function indHelixPointsArray(a, b, value){
  const pts = [];
  for(let t=0; t<value; t+=0.1) pts.push(indHelixPoint(a, b, t));
  return pts;
}
function indAddSpring(extrude, b, t, radialSegs){
  const u = INDUCTOR_UNIT;
  const xDist = b * u;                                      // FIX: pitch now scaled
  const helixPoints = indHelixPointsArray(indParams.r * u, xDist, t);  // FIX: radius now scaled
  const curve = new THREE.CatmullRomCurve3(helixPoints);
  const tubeGeometry = new THREE.TubeGeometry(curve, radialSegs, extrude, 15, false);
  const mat = new THREE.MeshPhongMaterial({
    color: 0xff3333, flatShading: false, side: THREE.DoubleSide
  });
  mat.color.convertSRGBToLinear();
  const mesh = new THREE.Mesh(tubeGeometry, mat);
  indSpring.add(mesh);

  const labelMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true });
  const iLabel = indMakeText(
    -250 * INDUCTOR_UNIT, 120 * INDUCTOR_UNIT, 0,
    30, labelMat, 'INDUCTOR', 'rgba(0,0,0,0)', 'rgba(05,05,05,1)'
  );
  iLabel.rotation.y = 1.57;
  inductorRoot.add(iLabel);
}

// ── Connector wires (procedural) ────────────────────────────
const indConnectorMaterial = new THREE.MeshPhongMaterial({
  color: 0xb87333, side: THREE.DoubleSide
});
function indMakeConnector(x1,y1,z1, x2,y2,z2, gap){
  const u = INDUCTOR_UNIT;
  const spline = new THREE.CatmullRomCurve3([
    new THREE.Vector3(x1*u, y1*u, z1*u),
    new THREE.Vector3((x1-40)*u, (y1+5)*u, z2*u),
    new THREE.Vector3(x2*u, (y2+1)*u, z2*u),
    new THREE.Vector3(x2*u, y2*u, gap*u)
  ]);
  const tubeGeometry = new THREE.TubeGeometry(spline, 25, 6*u, 4, false);
  const mesh = new THREE.Mesh(tubeGeometry, indConnectorMaterial);
  indConnectors.add(mesh);
}

// ── Resistor (procedural) — labels shrunk ───────────────────
function indMakeResistor(){
  const u = INDUCTOR_UNIT;
  const geo = new THREE.BoxGeometry(120*u, 40*u, 40*u).translate(0, 20*u, 0);
  const material = new THREE.MeshPhongMaterial({ color: 0x221011 });
  const rMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true });

  const rLabel1 = indMakeText(0, 20*u, 20.1*u, 20, rMaterial, ' RESISTOR ', 'rgba(0,0,0,0.1)', 'rgba(250,55,05,1)');
  const rLabel2 = rLabel1.clone();
  rLabel2.position.set(0, 20*u, -20.1*u);
  rLabel2.rotation.y = 3.14;
  const rLabel3 = rLabel1.clone();
  rLabel3.position.set(0, 40.1*u, 0);
  rLabel3.rotation.set(-1.57, 0, 0);

  indResistor = new THREE.Mesh(geo, material);
  indResistor.add(rLabel1, rLabel2, rLabel3);
  indResistor.position.set(-80*u, 0, 280*u);
  inductorRoot.add(indResistor);
}

// ── Bulb (procedural) ────────────────────────────────────────
function indMakeBulb(){
  const u = INDUCTOR_UNIT;
  const group = new THREE.Group();

  const bulbGeometry = new THREE.SphereGeometry(1*u*20, 32, 32);
  indBulbLight = new THREE.PointLight(0x986b65, 0, 300*u*20, 6);
  indBulbMaterial = new THREE.MeshStandardMaterial({
    emissive: 0xffffee, emissiveIntensity: 0, color: 0xeeeeee, roughness: 1
  });
  indBulbLight.add(new THREE.Mesh(bulbGeometry, indBulbMaterial));
  indBulbLight.position.set(0, 1*u*20, 0);
  indBulbLight.castShadow = true;

  const d = 2000*u;
  indBulbLight.shadow.camera.left = -d;
  indBulbLight.shadow.camera.right = d;
  indBulbLight.shadow.camera.top = d;
  indBulbLight.shadow.camera.bottom = -d;
  indBulbLight.shadow.camera.far = 1000*u;

  const bulbStem = new THREE.CylinderGeometry(0.65*u*20, 0.5*u*20, 0.55*u*20, 32);
  const bStem = new THREE.Mesh(bulbStem, indBulbMaterial);
  bStem.position.set(0, 1*u*20, 0);
  bStem.castShadow = true;
  bStem.receiveShadow = true;

  const bulbPlug = new THREE.CylinderGeometry(0.52*u*20, 0.52*u*20, 1.2*u*20, 32);
  const plugMat = new THREE.MeshPhongMaterial({ color: 0x837d7a });
  const plug = new THREE.Mesh(bulbPlug, plugMat);
  plug.position.set(0, 0.5*u*20, 0);
  plug.receiveShadow = true;
  plug.castShadow = true;

  group.add(bStem, indBulbLight, plug);
  group.position.set(-260*u, 0, -200*u);
  inductorRoot.add(group);
  indBulbGroup = group;
}

// ── Oscilloscope axis/line helper ───────────────────────────
function indInitLine(points, material){
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geo, material);
}

// ── Assemble all procedural geometry ────────────────────────
function buildInductorGeometry(){
  log('Building procedural inductor geometry…', 'ind');

  indAddSpring(indParams.extrude*INDUCTOR_UNIT, indParams.b, indParams.t, indParams.p);
  indSpring.position.set(-250*INDUCTOR_UNIT, 52*INDUCTOR_UNIT, -120*INDUCTOR_UNIT);
  indSpring.rotation.z = -1.7;
  inductorRoot.add(indSpring);

  indMakeConnector(92, 2, -20, -250, 10, -250, -120);
  indMakeConnector(92, 2, 20, -250, 10, 250, 163);
  inductorRoot.add(indConnectors);

  indMakeResistor();
  indMakeBulb();

  // indDisplayGroup holds either the DC "Induced EMF" label set
  // or the AC oscilloscope — rebuilt per mode, never both at once.
  // Positioned at Y = 0 by default here; AC mode repositions it
  // to sit at the same height as IND_OFFSET.y (see indPeriodicAction).
  indDisplayGroup.visible = false;
  inductorRoot.add(indDisplayGroup);

  log('Procedural inductor geometry built ✓ (coil, wires, resistor, bulb)', 'ok');
}

// ── Load powersupply.glb, register clips, grab node refs ────
function loadInductor(){
  log('── Step 09: powersupply.glb ──','head');
  log('Fetching powersupply.glb …','pending');

  gltfLoader.load(
    GLTF_POWERSUPPLY,
    (gltf)=>{
      log('powersupply.glb parsed ✓','ok');

      indModel = gltf.scene;
      indModel.traverse(o=>{
        if(o.isMesh){ o.castShadow=false; o.receiveShadow=true; }
      });
      inductorRoot.add(indModel);

      // ── Named node refs for JS-level control ──
      indKnob  = indModel.getObjectByName('knob');
      indPlus  = indModel.getObjectByName('plus');
      indMinus = indModel.getObjectByName('minus');

      if(indKnob)  { indKnob.rotation.y = 0; log('  ✓ node ref: knob','ok'); }
      else           log('  ✗ node "knob" not found in GLB','err');

      if(indPlus)  { indPlus.visible = false;  log('  ✓ node ref: plus','ok'); }
      else           log('  ✗ node "plus" not found in GLB','err');

      if(indMinus) { indMinus.visible = false; log('  ✓ node ref: minus','ok'); }
      else           log('  ✗ node "minus" not found in GLB','err');

      // Remaining rig nodes (Armature001, switch, Supply,
      // connector, Voltage_Knob, SwitchFlip) are driven entirely
      // by their baked animation clips through indMixer below.

      // ── AnimationMixer + clip registration ──
      indMixer = new THREE.AnimationMixer(indModel);
      const fixedStates = ['polarity','Action','Action_knob','AC_connector','DC_connector','knob_reset'];

      if(gltf.animations && gltf.animations.length){
        for(let i=0;i<gltf.animations.length;i++){
          const clip = gltf.animations[i];
          const action = indMixer.clipAction(clip);
          indActions[clip.name] = action;
          if(fixedStates.indexOf(clip.name) >= 0){
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
          }
          log(`  ✓ clip registered: ${clip.name}`,'ok');
        }
        log(`${gltf.animations.length} animation clip(s) registered into actions{}`,'ind');
      } else {
        log('No animation clips found on powersupply.glb','info');
      }

      indModelReady = true;

      buildInductorGeometry();
      setupInductorPanel();

      setBar(100);
      summaryEl.textContent='Steps 1–10 complete · Inductor demo fully wired · Procedural oscilloscope';
      setLabStatus('✅ Step 10 complete — Inductor demo live','#4eca8b');
      log('▶ STEP 10 COMPLETE','ok');
      log('powersupply.glb loaded, clips registered, coil fixed, oscilloscope procedural, labels resized','ok');

      setTimeout(()=>{
        hideAll();
        labUIRoot.querySelector('#lab-hint').textContent=
          '🔊 Tap anything to start audio  |  Projects · About Me · Articles · Credits';
      },3000);
      labReadyResolve();

    },
    (xhr)=>{ if(xhr.total) log(`powersupply.glb: ${Math.round((xhr.loaded/xhr.total)*100)}%`,'pending'); },
    (err)=>{
      log('powersupply.glb ERROR: '+(err?.message||err),'err');
      log('Continuing without inductor demo — check ./models/powersupply.glb path','info');
      setBar(100);
      setLabStatus('⚠️ Inductor failed — shop OK','#f0c060');
      labReadyResolve();
    }
  );
}

// ─────────────────────────────────────────────────────────────
//  DUAL ANIMATION SYSTEMS + STATE TOGGLING
// ─────────────────────────────────────────────────────────────

let indFlow = false, indAcVolt = false, indLowF = true;
let indIntensity = 0, indScale = 1;
let indReqID = null, indReqAC = null;
let indT = 0;
let indParamsF = [30, 1, 1];

// Display children refs (populated per-mode)
let indVDisplay, indIDisplay, indIPlus, indIMinus;
let indIWave, indVWave;

const indVoltageMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true });
const indChargeMaterial  = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true });
const indPlusMaterial    = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true });
const indMinusMaterial   = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true });

const indButtonFlip = labUIRoot.querySelector('#ind-flip');
const indButtonFlow = labUIRoot.querySelector('#ind-flow');
const indFreqRow    = labUIRoot.querySelector('#freqRow');
const indLowFBtn    = labUIRoot.querySelector('#ind-lowF');
const indHighFBtn   = labUIRoot.querySelector('#ind-highF');

// ── Clear indDisplayGroup children (DC ↔ AC mode swap) ────────
function indClearDisplay(){
  while(indDisplayGroup.children.length > 0){
    indDisplayGroup.remove(indDisplayGroup.children[0]);
  }
  indIWave = undefined; indVWave = undefined;
}

// ── DC mode: "Induced EMF" label + polarity indicators ───────
function indMakeDisplay(){
  indClearDisplay();
  const u = INDUCTOR_UNIT;

  indVDisplay = indMakeText(220*u, 130*u, -180*u, 50, indVoltageMaterial,
    'Increasing Current', 'rgba(0,0,0,0)', 'rgba(0,05,05,1)');
  inductorRoot.add(indVDisplay);

  indIDisplay = indMakeText(-200*u, 50*u, 0, 35, indChargeMaterial,
    'Induced EMF', 'rgba(0,0,0,0.1)', 'rgba(0,05,05,1)');
  indIDisplay.rotation.y = 1.57;
  indDisplayGroup.add(indIDisplay);

  indIPlus = indMakeText(-200*u, 50*u, 140*u, 40, indPlusMaterial,
    '+', 'rgba(0,0,0,0)', 'rgba(0,05,05,1)');
  indIPlus.rotation.y = 1.57;
  indIMinus = indMakeText(-200*u, 50*u, -140*u, 50, indMinusMaterial,
    '-', 'rgba(0,0,0,0)', 'rgba(0,05,05,1)');
  indIMinus.rotation.y = 1.57;
  indDisplayGroup.add(indIMinus, indIPlus);

  indDisplayGroup.children.forEach(c => c.visible = false);
  indDisplayGroup.visible = true;
}

// ── AC mode: procedural oscilloscope axis box + waveform ──────
// Positioned at the same Y height as IND_OFFSET.y so the scope
// lines up with the rest of the rig instead of floating at an
// arbitrary height like the original standalone page did.
function indMakeWaveform(X, F, factor){
  indClearDisplay();
  const u = INDUCTOR_UNIT;

  const a=0, b=100*u, c=0, d=0, w=200*u;
  const lmaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

  indDisplayGroup.add(indInitLine([new THREE.Vector3(a,d+w,c), new THREE.Vector3(a,0,c)], lmaterial));
  indDisplayGroup.add(indInitLine([new THREE.Vector3(a,b,c), new THREE.Vector3(a+w,b,c)], lmaterial));
  indDisplayGroup.add(indInitLine([new THREE.Vector3(a+w,d+w,c), new THREE.Vector3(a+w,d,c)], lmaterial));
  indDisplayGroup.add(indInitLine([new THREE.Vector3(a,d+w,c), new THREE.Vector3(a+w,d+w,c)], lmaterial));
  indDisplayGroup.add(indInitLine([new THREE.Vector3(a,d,c), new THREE.Vector3(a+w,d,c)], lmaterial));

  const wavePoints = [];
  for(let j=0, l=2*factor*Math.PI; j<=l; j+=0.25){
    wavePoints.push(new THREE.Vector3(a + j*X*F*u, b + 80*u*Math.sin(j*F), 0));
  }
  for(let k=1; k<=wavePoints.length-1; k++){
    indDisplayGroup.add(indInitLine([wavePoints[k-1], wavePoints[k]], lmaterial));
  }
  indDisplayGroup.children.forEach(c => c.visible = false);

  const igeometry = new THREE.BufferGeometry();
  const pos = new Float32Array(indParams.points * 4 * 3);
  igeometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  indIWave = new THREE.Points(igeometry, new THREE.PointsMaterial({ size: 10*u, color: 0xff0000 }));
  indIWave.geometry.setDrawRange(0, 0);

  const vgeometry = new THREE.BufferGeometry();
  const vpos = new Float32Array(indParams.points * 4 * 3);
  vgeometry.setAttribute('position', new THREE.BufferAttribute(vpos, 3));
  indVWave = new THREE.Points(vgeometry, new THREE.PointsMaterial({ size: 10*u, color: 0x0000ff }));
  indVWave.geometry.setDrawRange(0, 0);

  let i=0, index=0, index1=0;
  for(let j=0, l=indParams.points*4; j<l; j++){
    const t=i, z=c;
    const x = a + t*X*F*u;
    const y = b + 80*u*Math.sin(t*F);
    const y1 = b + 100*u*Math.cos(t*F);
    vpos[index1++]=x; vpos[index1++]=y1; vpos[index1++]=z;
    pos[index++]=x;  pos[index++]=y;   pos[index++]=z;
    i += 0.00835*factor;
  }
  indDisplayGroup.add(indIWave, indVWave);
  indDisplayGroup.visible = true;
}

// ── Oscilloscope sweep (hand-rolled rAF, not the mixer) ───────
function indDrawWaveform(){
  if(!indIWave || !indVWave) return;
  const count = indIWave.geometry.attributes.position.count;
  if(indT < count){
    indVWave.geometry.setDrawRange(0, indT);
    indIWave.geometry.setDrawRange(0, indT);
    indReqAC = requestAnimationFrame(indDrawWaveform);
  } else {
    indVWave.geometry.setDrawRange(0, indT);
    indIWave.geometry.setDrawRange(0, 0);
    indT = 0;
    indReqAC = requestAnimationFrame(indDrawWaveform);
  }
  indT++;
}

// ── DC "crank the knob" → induced EMF fade-in ─────────────────
function indInducedEmf(){
  if(!indKnob) { indOnScaleAction(); return; }
  if(indKnob.rotation.y > -5){
    indKnob.rotation.y -= 0.01;
    indReqID = requestAnimationFrame(indInducedEmf);
  } else {
    cancelAnimationFrame(indReqID);
    indOnScaleAction();
  }
}
function indOnScaleAction(){
  if(indScale >= 0){
    if(indBulbMaterial){ indBulbMaterial.emissiveIntensity = indIntensity; }
    if(indBulbLight){ indBulbLight.intensity = indIntensity; }
    indScale = indScale < 0 ? 0 : indScale;
    indDisplayGroup.children.forEach(c => c.scale.set(indScale, indScale, indScale));
    indReqID = requestAnimationFrame(indOnScaleAction);
  } else {
    indScale = 0;
    cancelAnimationFrame(indReqID);
  }
  indScale -= 0.003;
  indIntensity += 0.08;
}

// ── DC "release the knob" → EMF fade-out ───────────────────────
function indOffEmf(){
  if(!indKnob) { indOffScaleAction(); return; }
  if(indKnob.rotation.y > -5.1 && indKnob.rotation.y < 0){
    indKnob.rotation.y += 0.005;
    indReqID = requestAnimationFrame(indOffEmf);
  } else {
    cancelAnimationFrame(indReqID);
    indOffScaleAction();
  }
}
function indOffScaleAction(){
  if(indScale >= 0){
    if(indBulbMaterial){ indBulbMaterial.emissiveIntensity = indIntensity; }
    if(indBulbLight){ indBulbLight.intensity = indIntensity; }
    indDisplayGroup.children.forEach(c => c.scale.set(indScale, indScale, indScale));
    indReqID = requestAnimationFrame(indOffScaleAction);
  } else {
    indDisplayGroup.children.forEach(c => c.visible = false);
    indIntensity = 0; indScale = 0;
    if(indBulbMaterial){ indBulbMaterial.emissiveIntensity = 0; }
    if(indBulbLight){ indBulbLight.intensity = 0; }
    cancelAnimationFrame(indReqID);
  }
  indScale -= 0.005;
  indIntensity -= 0.01;
}

// ── DC flow toggle: setTimeout-choreographed sequence ──────────
function indFlowAction(){
  cancelAnimationFrame(indReqID);
  cancelAnimationFrame(indReqAC);

  if(indFlow){
    indButtonFlow.disabled = true;
    indButtonFlow.style.cursor = 'default';
    if(indActions['Action']) indActions['Action'].play();
    indButtonFlow.textContent = 'ON';
    indButtonFlow.className = 'flow-on';

    setTimeout(()=>{
      if(indIMinus) indIMinus.position.z = 140*INDUCTOR_UNIT;
      if(indIPlus)  indIPlus.position.z  = -140*INDUCTOR_UNIT;
      indInducedEmf();
      indVoltageMaterial.map = new THREE.CanvasTexture(
        indMakeLabelCanvas(50, 'Increasing Current', 'rgba(0,0,0,0)', 'rgba(05,55,05,1)'));
    }, 1000);

    setTimeout(()=>{
      if(indPlus)  indPlus.visible = true;
      if(indMinus) indMinus.visible = true;
      indScale = 1;
      indDisplayGroup.children.forEach(c => { c.visible = true; c.scale.set(1,1,1); });
    }, 2500);

    setTimeout(()=>{
      indVoltageMaterial.map = new THREE.CanvasTexture(
        indMakeLabelCanvas(50, 'Constant Current', 'rgba(0,0,0,0)', 'rgba(05,55,05,1)'));
      indButtonFlow.disabled = false;
      indButtonFlow.style.cursor = 'pointer';
    }, 10000);

  } else {
    indScale = 1; indIntensity = 20;
    indButtonFlow.disabled = true;
    indButtonFlow.style.cursor = 'default';
    indVoltageMaterial.map = new THREE.CanvasTexture(
      indMakeLabelCanvas(50, 'Decreasing Current', 'rgba(0,0,0,0)', 'rgba(05,55,05,1)'));

    setTimeout(()=>{
      if(indIMinus) indIMinus.position.z = -140*INDUCTOR_UNIT;
      if(indIPlus)  indIPlus.position.z  = 140*INDUCTOR_UNIT;
      indOffEmf();
    }, 1000);

    setTimeout(()=>{
      if(indPlus)  indPlus.visible = true;
      if(indMinus) indMinus.visible = true;
      indScale = 1;
      indDisplayGroup.children.forEach(c => { c.visible = true; c.scale.set(1,1,1); });
    }, 2500);

    setTimeout(()=>{
      if(indPlus)  indPlus.visible = false;
      if(indMinus) indMinus.visible = false;
    }, 1000);

    setTimeout(()=>{
      indButtonFlow.disabled = false;
      indButtonFlow.style.cursor = 'pointer';
      if(indActions['Action']) indActions['Action'].reset().stop();
      indButtonFlip.disabled = false;
      indButtonFlip.style.cursor = 'pointer';
      indVoltageMaterial.map = new THREE.CanvasTexture(
        indMakeLabelCanvas(50, 'No Current', 'rgba(0,0,0,0)', 'rgba(05,55,05,1)'));
    }, 18000);

    indButtonFlow.textContent = 'OFF';
    indButtonFlow.className = 'flow-off';
  }
}

// ── AC flow toggle: oscilloscope sweep + rig clip ──────────────
function indPeriodicAction(){
  cancelAnimationFrame(indReqID);
  cancelAnimationFrame(indReqAC);

  if(indFlow){
    if(indActions['Action']) indActions['Action'].play();
    indButtonFlow.textContent = 'ON';
    indButtonFlow.className = 'flow-on';
    if(indKnob) indKnob.rotation.y = -1.4;
    indIntensity = 20;
    if(indBulbMaterial) indBulbMaterial.emissiveIntensity = 20;
    if(indBulbLight)    indBulbLight.intensity = 20;
    indDisplayGroup.children.forEach(c => c.visible = true);
    indDrawWaveform();

    // Oscilloscope sits at the same Y height as IND_OFFSET.y,
    // so it reads level with the rest of the rig rather than
    // floating up near the coil like the original page did.
    indDisplayGroup.position.set(-250*INDUCTOR_UNIT, IND_OFFSET.y, 100*INDUCTOR_UNIT);
    indDisplayGroup.rotation.set(0, 1.57, 0);
  } else {
    if(indActions['Action']) indActions['Action'].reset().stop();
    if(indKnob) indKnob.rotation.y = 0;
    if(indPlus)  indPlus.visible = false;
    if(indMinus) indMinus.visible = false;
    indButtonFlow.textContent = 'OFF';
    indButtonFlow.className = 'flow-off';

    indDisplayGroup.position.set(0,0,0);
    indDisplayGroup.rotation.set(0,0,0);
    indDisplayGroup.children.forEach(c => c.visible = false);

    setTimeout(()=>{
      if(indVWave) indVWave.geometry.setDrawRange(0,0);
      if(indIWave) indIWave.geometry.setDrawRange(0,0);
      indT = 0;
      indIntensity = 0;
      if(indBulbMaterial) indBulbMaterial.emissiveIntensity = 0;
      if(indBulbLight)    indBulbLight.intensity = 0;
    }, 500);

    indMakeWaveform(indParamsF[0], indParamsF[1], indParamsF[2]);
  }
}

// ── Master flow dispatcher (DC vs AC route differently) ────────
function indChargeAction(){
  if(indAcVolt){
    indT = 0;
    indMakeWaveform(indParamsF[0], indParamsF[1], indParamsF[2]);
    indPeriodicAction();
  } else {
    indMakeDisplay();
    indFlowAction();
    indButtonFlip.disabled = true;
    indButtonFlip.style.cursor = 'default';
  }
}

// ── Frequency selection (AC mode only) ─────────────────────────
function indFreqSelect(){
  if(indLowF){
    indParamsF = [30, 1, 1];
    indLowFBtn.style.backgroundColor = 'rgb(26,164,26)';
    indHighFBtn.style.backgroundColor = 'rgb(164,26,26)';
  } else {
    indParamsF = [15, 0.67, 3];
    indHighFBtn.style.backgroundColor = 'rgb(26,164,26)';
    indLowFBtn.style.backgroundColor = 'rgb(164,26,26)';
  }
}

// ── Wire up the control panel UI ───────────────────────────────
function setupInductorPanel(){
  const panel = labUIRoot.querySelector('#inductor-panel');
  panel.classList.add('visible');

  indButtonFlow.addEventListener('click', ()=>{
    indFlow = !indFlow;
    indChargeAction();
    log(`⚡ flow → ${indFlow}`, 'ind');
  });

  indButtonFlip.addEventListener('click', ()=>{
    indAcVolt = !indAcVolt;
    indFlow = false;
    if(indActions['Action']) indActions['Action'].reset().stop();
    if(indKnob) indKnob.rotation.y = 0;
    indFreqSelect();
    indButtonFlow.textContent = 'OFF';
    indButtonFlow.className = 'flow-off';

    if(indAcVolt){
      indFreqRow.classList.add('visible');
      if(indActions['DC_connector']) indActions['DC_connector'].reset().stop();
      if(indActions['AC_connector']) { indActions['AC_connector'].setDuration(2).play(); }
      indButtonFlip.textContent = 'AC VOLTAGE';
    } else {
      indFreqRow.classList.remove('visible');
      if(indActions['AC_connector']) indActions['AC_connector'].reset().stop();
      if(indActions['DC_connector']) { indActions['DC_connector'].setDuration(2).play(); }
      indButtonFlip.textContent = 'DC VOLTAGE';
    }
    log(`⚡ acVolt → ${indAcVolt}`, 'ind');
  });

  indLowFBtn.addEventListener('click', ()=>{ indLowF = true;  indFreqSelect(); });
  indHighFBtn.addEventListener('click', ()=>{ indLowF = false; indFreqSelect(); });

  indFreqSelect();
  log('Inductor control panel wired — DC/AC toggle, flow, frequency','ok');
}


// ─────────────────────────────────────────────────────────────
//  SHARED MAIN_V2 UPDATE
//  No second renderer / camera / scene / render loop.
// ─────────────────────────────────────────────────────────────
let labElapsed = 0;
let showCoords = true;

coordEl.addEventListener('click', () => {
  showCoords = !showCoords;
  coordEl.style.opacity = showCoords ? '1' : '0.2';
});

function updateLabSimulation(delta) {
  labElapsed += delta;

  holoUniforms.uTime.value = labElapsed;

  if (window._holoScene) {
    window._holoScene.rotation.y = labElapsed * 0.4;
    window._holoScene.position.y =
      4.8 + Math.sin(labElapsed * 1.2) * 0.08;
  }

  if (indModelReady && indMixer) {
    indMixer.update(delta);
  }

  if (showCoords && coordEl) {
    const p = camera.position;
    const t = controls.target;

    coordEl.innerHTML =
      `<span style="color:#adf">cam</span> x:${p.x.toFixed(2)} y:${p.y.toFixed(2)} z:${p.z.toFixed(2)}<br>` +
      `<span style="color:#fa0">tgt</span> x:${t.x.toFixed(2)} y:${t.y.toFixed(2)} z:${t.z.toFixed(2)}<br>` +
      `<span style="color:#6f6">fov</span> ${camera.fov.toFixed(1)}°<br>` +
      `<span style="color:#555">mode: ${currentMode}</span>`;
  }
}

// Called only after the cinematic has completed.
function activateLabMode() {
  labModeActive = true;

  controls.enabled = true;
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;

  controls.minPolarAngle = VIEWS.home.minPolar;
  controls.maxPolarAngle = VIEWS.home.maxPolar;
  controls.minAzimuthAngle = VIEWS.home.minAzi;
  controls.maxAzimuthAngle = VIEWS.home.maxAzi;
  controls.minDistance = VIEWS.home.minDist;
  controls.maxDistance = VIEWS.home.maxDist;

  camera.position.copy(VIEWS.home.camPos);
  controls.target.copy(VIEWS.home.target);
  controls.update();

  currentMode = 'home';
  isTransitioning = false;

  if (modeEl) {
    modeEl.textContent = VIEWS.home.label;
    modeEl.style.color = VIEWS.home.color;
  }

  if (backBtn) {
    backBtn.style.display = 'none';
  }

  if (labUIRoot) {
    labUIRoot.style.display = 'block';
  }

  if (indModelReady) {
    setupLabInteractionState();
  }

  setStatus('Education demo ready');
  setLabStatus('✅ Cinematic complete — Lab mode active','#4eca8b');
  log('▶ EDUCATION MODE ACTIVE','ok');
  log('Shared camera / controls / renderer / physical lighting are now live.','info');
}

// Keep the original simulation click system intact, but gate it until
// the cinematic has ended.
let labModeActive = false;

function setupLabInteractionState() {
  if (!labModeActive) return;
  activateHome();
  startAmbient();
}

// Replace the original pointer handlers with gated versions by using
// this flag in the existing onUp function.


// ============================================================
// FORMATION
// ============================================================

const FORMATION_CENTER =
    new THREE.Vector3(
        0,
        1.2,
        -0.4
    );


// ============================================================
// AVATAR DEFINITIONS
// ============================================================
//
// Avatar pipeline preserved.
// ============================================================

// ============================================================
// AVATAR DEFINITIONS
// ============================================================
//
// Avatar pipeline preserved.
// ============================================================

const AVATAR_DEFINITIONS = [

    // ========================================================
    // AVATAR 1
    // ========================================================

    {
        id: 1,

        path: './avatar.glb',

        position: [
            -2.4,
            0,
            0.7
        ],

        rotation: [
            0,
            0,
            0
        ],

        scale: 1,

        clip: 'walking',

        inspectionBone: 'Head',

        sentence:
            'hello world this is a test',

        accessories: [

            {
                name: 'backpack',
                path: './backpack.glb'
            },

            {
                name: 'headphones',
                path: './headphones.glb'
            }

        ],

        expression: 'neutral',

        gesture: 'shaking'
    },


    // ========================================================
    // AVATAR 2
    // ========================================================

    {
        id: 2,

        path: './avatar_2.glb',

        position: [
            2.4,
            0,
            0.7
        ],

        rotation: [
            0,
            0,
            0
        ],

        scale: 1,

        clip: 'waving',

        inspectionBone: 'LeftArm',

        sentence:
            'how are you doing today',

        accessories: [

            {
                name: 'headphones',
                path: './headphones.glb'
            },

            {
                name: 'backpack',
                path: './backpack.glb'
            }

        ],

        expression: 'sad',

        gesture: 'nodding_yes'
    },


    // ========================================================
    // AVATAR 3
    // ========================================================

    {
        id: 3,

        path: './avatar_3.glb',

        position: [
            0,
            0,
            -2.2
        ],

        rotation: [
            0,
            0,
            0
        ],

        scale: 1,

        clip: 'greetings',

        inspectionBone: 'RightFoot',

        sentence:
            'i am happy to help you',

        accessories: [

            {
                name: 'backpack',
                path: './backpack.glb'
            }

        ],

        expression: 'angry',

        gesture: 'nodding_no'
    },


    // ========================================================
    // AVATAR 4
    // ========================================================

    {
        id: 4,

        path: './avatar_4.glb',

        position: [
            -2.4,
            0,
            -2.2
        ],

        rotation: [
            0,
            0,
            0
        ],

        scale: 1,

        clip: 'HostageIdle',

        inspectionBone: 'Head',

        sentence:
            'thank you for your time',

        accessories: [

            {
                name: 'headphones',
                path: './headphones.glb'
            }

        ],

        expression: 'disgusted',

        gesture: 'nodding_yes'
    },


    // ========================================================
    // AVATAR 5
    // ========================================================

    {
        id: 5,

        path: './avatar_5.glb',

        position: [
            2.4,
            0,
            -2.2
        ],

        rotation: [
            0,
            0,
            0
        ],

        scale: 1,

        clip: 'fastforwarding',

        inspectionBone: 'Head',

        sentence:
            'i am happy to help you',

        accessories: [

            {
                name: 'backpack',
                path: './backpack.glb'
            }

        ],

        expression: 'happy',

        gesture: 'nodding_no'
    }

];




// ============================================================
// FORD RAPTOR DEFINITION
// ============================================================
//
// Completely independent from the avatar pipeline.
// ============================================================

const CAR_DEFINITION = {

    id: 'ford_raptor',

    path: './ford_raptor.glb',

    position: [
        0,
        0,
        0
    ],

    rotation: [
        0,
        0,
        0
    ],

    scale: 1,


    // --------------------------------------------------------
    // SHOWROOM SHOTS
    // --------------------------------------------------------

    shots: {

        CAR_APPROACH: {

            clip: 'Door_Right_Open',

            camera: {
                position: [
                    0,
                    3,
                    -8
                ],

                target: [
                    0,
                    0.5,
                    0
                ],

                duration: 2500
            }
        },


        CAR_ORBIT: {

            clip: 'Bonnet_Open',

            camera: {

                radius: 8,

                height: 2.5,

                verticalAmplitude: 0.5,

                revolutions: 1,

                duration: 8000
            }
        },


        FRONT_LEFT_TYRE: {

            clip: 'Door_Left_Open',

            camera: {

                position: [
                    2,
                    1.5,
                    4
                ],

                target: [
                    0,
                    0.5,
                    0
                ],

                duration: 2200
            }
        },


        REAR_RIGHT_TYRE: {

            clip: 'Tailgate_Open',

            camera: {

                position: [
                    0,
                    2,
                    -5
                ],

                target: [
                    0,
                    0.5,
                    0
                ],

                duration: 2200
            }
        },


        CAR_BOUNCE: {

            clip: 'Steering_Sweep',

            camera: {

                position: [
                    2,
                    1.5,
                    4
                ],

                target: [
                    0,
                    0.5,
                    0
                ],

                duration: 1800,

                bounceAmount: 0.15,

                bounceDuration: 400
            }
        },


        CAR_RISE: {

            clip: 'Brake_Lights',

            camera: {

                position: [
                    0,
                    12,
                    -14
                ],

                target: [
                    0,
                    0.5,
                    0
                ],

                duration: 3000
            }
        }
    }
};


// ============================================================
// PHONEME → VISEME
// ============================================================

const PHONEME_TO_VISEME = {

    SIL: 'viseme_sil',
    PAU: 'viseme_sil',
    HH: 'viseme_sil',

    P: 'viseme_PP',
    B: 'viseme_PP',
    M: 'viseme_PP',

    F: 'viseme_FF',
    V: 'viseme_FF',

    TH: 'viseme_TH',
    DH: 'viseme_TH',

    T: 'viseme_DD',
    D: 'viseme_DD',
    L: 'viseme_DD',

    N: 'viseme_nn',
    NG: 'viseme_nn',

    K: 'viseme_kk',
    G: 'viseme_kk',

    CH: 'viseme_CH',
    JH: 'viseme_CH',
    SH: 'viseme_CH',
    ZH: 'viseme_CH',

    S: 'viseme_SS',
    Z: 'viseme_SS',

    R: 'viseme_RR',

    AA: 'viseme_aa',
    AE: 'viseme_aa',
    AH: 'viseme_aa',
    AO: 'viseme_aa',

    EH: 'viseme_E',
    ER: 'viseme_E',

    IH: 'viseme_I',
    IY: 'viseme_I',
    Y: 'viseme_I',

    OW: 'viseme_O',
    OY: 'viseme_O',

    UH: 'viseme_U',
    UW: 'viseme_U',
    W: 'viseme_U'
};


// ============================================================
// SPEECH SETTINGS
// ============================================================

const PHONEME_DURATION_MS = 130;

const CROSSFADE_MS = 60;


// ============================================================
// SIMPLE TEXT → PHONEME SEQUENCE
// ============================================================

function textToPhonemeSequence(text) {

    const words =
        text
            .toUpperCase()
            .trim()
            .split(/\s+/);

    const sequence = [];

    for (const word of words) {

        for (const character of word) {

            let phoneme = null;

            switch (character) {

                case 'A':
                    phoneme = 'AA';
                    break;

                case 'E':
                    phoneme = 'EH';
                    break;

                case 'I':
                    phoneme = 'IH';
                    break;

                case 'O':
                    phoneme = 'OW';
                    break;

                case 'U':
                    phoneme = 'UH';
                    break;

                case 'P':
                    phoneme = 'P';
                    break;

                case 'B':
                    phoneme = 'B';
                    break;

                case 'M':
                    phoneme = 'M';
                    break;

                case 'F':
                    phoneme = 'F';
                    break;

                case 'V':
                    phoneme = 'V';
                    break;

                case 'T':
                    phoneme = 'T';
                    break;

                case 'D':
                    phoneme = 'D';
                    break;

                case 'L':
                    phoneme = 'L';
                    break;

                case 'N':
                    phoneme = 'N';
                    break;

                case 'K':
                    phoneme = 'K';
                    break;

                case 'G':
                    phoneme = 'G';
                    break;

                case 'S':
                    phoneme = 'S';
                    break;

                case 'Z':
                    phoneme = 'Z';
                    break;

                case 'R':
                    phoneme = 'R';
                    break;

                case 'W':
                    phoneme = 'W';
                    break;

                case 'Y':
                    phoneme = 'Y';
                    break;

                case 'H':
                    phoneme = 'HH';
                    break;
            }

            if (phoneme) {

                sequence.push(
                    PHONEME_TO_VISEME[phoneme]
                );
            }
        }

        sequence.push(
            'viseme_sil'
        );
    }

    return sequence;
}


// ============================================================
// SPEECH DRIVER
// ============================================================

class SpeechDriver {

    constructor(model) {

        this.model = model;

        this.morphMeshes = [];

        this.sequence = [];

        this.currentIndex = 0;

        this.timer = null;

        this.active = false;

        model.traverse(object => {

            if (
                object.isMesh &&
                object.morphTargetDictionary &&
                object.morphTargetInfluences
            ) {

                this.morphMeshes.push(
                    object
                );
            }
        });
    }


    setViseme(name, value) {

        for (
            const mesh of this.morphMeshes
        ) {

            const dictionary =
                mesh.morphTargetDictionary;

            const influences =
                mesh.morphTargetInfluences;

            if (
                dictionary &&
                dictionary[name] !== undefined
            ) {

                influences[
                    dictionary[name]
                ] = value;
            }
        }
    }


    clearVisemes() {

        for (
            const mesh of this.morphMeshes
        ) {

            const dictionary =
                mesh.morphTargetDictionary;

            const influences =
                mesh.morphTargetInfluences;

            if (!dictionary) {
                continue;
            }

            for (
                const name of Object.keys(dictionary)
            ) {

                if (
                    name.startsWith('viseme_')
                ) {

                    influences[
                        dictionary[name]
                    ] = 0;
                }
            }
        }
    }


    speak(text) {

        this.stop();

        this.sequence =
            textToPhonemeSequence(text);

        this.currentIndex = 0;

        this.active = true;

        return new Promise(resolve => {

            this.resolveSpeech = resolve;

            this.playNext();
        });
    }


    playNext() {

        if (!this.active) {
            return;
        }

        if (
            this.currentIndex >=
            this.sequence.length
        ) {

            this.clearVisemes();

            this.active = false;

            if (this.resolveSpeech) {

                this.resolveSpeech();

                this.resolveSpeech = null;
            }

            return;
        }

        const viseme =
            this.sequence[
                this.currentIndex
            ];

        this.clearVisemes();

        this.setViseme(
            viseme,
            1
        );

        this.currentIndex++;

        this.timer =
            setTimeout(
                () => this.playNext(),
                PHONEME_DURATION_MS
            );
    }


    stop() {

        if (this.timer) {

            clearTimeout(
                this.timer
            );

            this.timer = null;
        }

        this.active = false;

        this.clearVisemes();

        if (this.resolveSpeech) {

            this.resolveSpeech();

            this.resolveSpeech = null;
        }
    }
}


// ============================================================
// BLINK DRIVER
// ============================================================

class BlinkDriver {

    constructor(model) {

        this.model = model;

        this.morphMeshes = [];

        this.blinkTimer = null;

        model.traverse(object => {

            if (
                object.isMesh &&
                object.morphTargetDictionary &&
                object.morphTargetInfluences
            ) {

                this.morphMeshes.push(
                    object
                );
            }
        });

        this.scheduleBlink();
    }


    findMorph(name) {

        for (
            const mesh of this.morphMeshes
        ) {

            if (
                mesh.morphTargetDictionary &&
                mesh.morphTargetDictionary[name]
                    !== undefined
            ) {

                return {
                    mesh,
                    index:
                        mesh.morphTargetDictionary[name]
                };
            }
        }

        return null;
    }


    blink() {

        const left =
            this.findMorph('eyeBlinkLeft');

        const right =
            this.findMorph('eyeBlinkRight');

        if (!left && !right) {
            return;
        }

        const start = performance.now();

        const duration = 120;

        const animateBlink = now => {

            const t =
                Math.min(
                    1,
                    (now - start) / duration
                );

            const value =
                t < 0.5
                    ? t * 2
                    : (1 - t) * 2;

            if (left) {

                left.mesh
                    .morphTargetInfluences[
                        left.index
                    ] = value;
            }

            if (right) {

                right.mesh
                    .morphTargetInfluences[
                        right.index
                    ] = value;
            }

            if (t < 1) {

                requestAnimationFrame(
                    animateBlink
                );
            }
        };

        requestAnimationFrame(
            animateBlink
        );
    }


    scheduleBlink() {

        const delay =
            2500 +
            Math.random() * 3500;

        this.blinkTimer =
            setTimeout(() => {

                this.blink();

                this.scheduleBlink();

            }, delay);
    }
}


// ============================================================
// EXPRESSION DRIVER
// ============================================================

class ExpressionDriver {

    constructor(model) {

        this.model = model;

        this.morphMeshes = [];

        model.traverse(object => {

            if (
                object.isMesh &&
                object.morphTargetDictionary &&
                object.morphTargetInfluences
            ) {

                this.morphMeshes.push(
                    object
                );
            }
        });
    }


    setMorph(name, value) {

        for (
            const mesh of this.morphMeshes
        ) {

            const dictionary =
                mesh.morphTargetDictionary;

            if (
                dictionary &&
                dictionary[name] !== undefined
            ) {

                mesh.morphTargetInfluences[
                    dictionary[name]
                ] = value;
            }
        }
    }


    clearExpressionMorphs() {

        const expressionNames = [

            'mouthSad',

            'mouthSmile',

            'browInnerUp',

            'browDownLeft',

            'browDownRight',

            'browOuterUpLeft',

            'browOuterUpRight',

            'eyeSquintLeft',

            'eyeSquintRight'

        ];

        for (
            const name of expressionNames
        ) {

            this.setMorph(
                name,
                0
            );
        }
    }


    apply(expression) {

        this.clearExpressionMorphs();

        switch (expression) {

            case 'neutral':

                break;


            case 'sad':

                this.setMorph(
                    'mouthSad',
                    0.8
                );

                this.setMorph(
                    'browInnerUp',
                    0.6
                );

                break;


            case 'angry':

                this.setMorph(
                    'browDownLeft',
                    0.8
                );

                this.setMorph(
                    'browDownRight',
                    0.8
                );

                break;


            case 'disgusted':

                this.setMorph(
                    'mouthSad',
                    0.45
                );

                this.setMorph(
                    'browDownLeft',
                    0.35
                );

                this.setMorph(
                    'browDownRight',
                    0.35
                );

                break;


            case 'happy':

                this.setMorph(
                    'mouthSmile',
                    0.8
                );

                this.setMorph(
                    'eyeSquintLeft',
                    0.3
                );

                this.setMorph(
                    'eyeSquintRight',
                    0.3
                );

                break;
        }
    }
}


// ============================================================
// GESTURE DRIVER
// ============================================================

class GestureDriver {

    constructor(model, bones) {

        this.model = model;

        this.bones = bones;

        this.gesture = null;

        this.time = 0;

        this.enabled = true;

        const head =
            this.bones.Head ||
            this.bones.Neck;

        const neck =
            this.bones.Neck;

        this.baseHeadRotation =
            head ? head.rotation.clone() : null;

        this.baseNeckRotation =
            neck ? neck.rotation.clone() : null;
    }


    setGesture(name) {

        this.gesture = name;

        this.time = 0;
    }


    disable() {

        this.enabled = false;

        this.gesture = null;

        this.time = 0;

        this.restoreBasePose();
    }


    enable() {

        this.enabled = true;

        this.time = 0;
    }


    restoreBasePose() {

        const head =
            this.bones.Head ||
            this.bones.Neck;

        const neck =
            this.bones.Neck;

        if (
            head &&
            this.baseHeadRotation
        ) {

            head.rotation.copy(
                this.baseHeadRotation
            );
        }

        if (
            neck &&
            neck !== head &&
            this.baseNeckRotation
        ) {

            neck.rotation.copy(
                this.baseNeckRotation
            );
        }
    }


    update(delta) {

        if (
            !this.enabled ||
            !this.gesture
        ) {
            return;
        }

        this.time += delta;

        const head =
            this.bones.Head ||
            this.bones.Neck;

        if (!head) {
            return;
        }

        const neck =
            this.bones.Neck;

        const t = this.time;


        // ----------------------------------------------------
        // SHAKE
        // ----------------------------------------------------

        if (
            this.gesture ===
            'shaking'
        ) {

            const amount =
                Math.sin(t * 7) *
                THREE.MathUtils.degToRad(3);

            head.rotation.z =
                amount;

            if (neck) {

                neck.rotation.z =
                    amount * 0.4;
            }
        }


        // ----------------------------------------------------
        // NOD YES
        // ----------------------------------------------------

        else if (
            this.gesture ===
            'nodding_yes'
        ) {

            const amount =
                Math.sin(t * 4) *
                THREE.MathUtils.degToRad(5);

            head.rotation.x =
                amount;

            if (neck) {

                neck.rotation.x =
                    amount * 0.4;
            }
        }


        // ----------------------------------------------------
        // NOD NO
        // ----------------------------------------------------

        else if (
            this.gesture ===
            'nodding_no'
        ) {

            const amount =
                Math.sin(t * 4) *
                THREE.MathUtils.degToRad(5);

            head.rotation.y =
                amount;

            if (neck) {

                neck.rotation.y =
                    amount * 0.4;
            }
        }
    }
}


// ============================================================
// ACCESSORY MANAGER
// ============================================================
//
// IMPORTANT:
// Uses the same GLTFLoader that already has DRACO configured.
// ============================================================

class AccessoryManager {

    constructor(model, loader) {

        this.model = model;

        this.loader = loader;

        this.loaded = [];
    }


    async loadAccessory(
        name,
        path
    ) {

        const gltf =
            await this.loader.loadAsync(
                path
            );

        const accessory =
            gltf.scene;

        accessory.name =
            `Accessory_${name}`;

        accessory.traverse(object => {

            if (object.isMesh) {

                object.castShadow = true;

                object.receiveShadow = true;
            }
        });

        this.model.add(
            accessory
        );

        this.loaded.push(
            accessory
        );

        return accessory;
    }


    async loadAccessories(
        definitions
    ) {

        if (!definitions) {
            return;
        }

        for (
            const definition
            of definitions
        ) {

            try {

                await this.loadAccessory(
                    definition.name,
                    definition.path
                );

            } catch (error) {

                showError(
                    `Accessory loading failed:\n` +
                    `${definition.name}\n` +
                    `${definition.path}\n\n` +
                    `${error}`
                );
            }
        }
    }
}


// ============================================================
// AVATAR CONTROLLER
// ============================================================
//
// Existing avatar controller preserved.
// ============================================================

class AvatarController {

    constructor(
        definition,
        gltf
    ) {

        this.definition =
            definition;

        this.id =
            definition.id;

        this.model =
            gltf.scene;

        this.animations =
            gltf.animations || [];

        this.mixer =
            new THREE.AnimationMixer(
                this.model
            );

        this.actions =
            new Map();

        this.currentAction =
            null;

        this.bones = {};

        this.inspectionBone =
            definition.inspectionBone;


        // ----------------------------------------------------
        // TRANSFORM
        // ----------------------------------------------------

        this.model.position.set(
            ...definition.position
        );

        this.model.rotation.set(
            ...definition.rotation
        );

        this.model.scale.setScalar(
            definition.scale
        );


        // ----------------------------------------------------
        // SHADOWS
        // ----------------------------------------------------

        this.model.traverse(object => {

            if (object.isMesh) {

                object.castShadow = true;

                object.receiveShadow = true;
            }
        });


        // ----------------------------------------------------
        // BONES
        // ----------------------------------------------------

        this.model.traverse(object => {

            if (
                object.isBone
            ) {

                this.bones[
                    object.name
                ] = object;
            }
        });


        // ----------------------------------------------------
        // DRIVERS
        // ----------------------------------------------------

        this.speechDriver =
            new SpeechDriver(
                this.model
            );

        this.blinkDriver =
            new BlinkDriver(
                this.model
            );

        this.expressionDriver =
            new ExpressionDriver(
                this.model
            );

        this.gestureDriver =
            new GestureDriver(
                this.model,
                this.bones
            );


        // ----------------------------------------------------
        // ACCESSORIES
        // ----------------------------------------------------

        this.accessories =
            new AccessoryManager(
                this.model,
                loader
            );


        // ----------------------------------------------------
        // ANIMATION ACTIONS
        // ----------------------------------------------------

        for (
            const clip of this.animations
        ) {

            const action =
                this.mixer.clipAction(
                    clip
                );

            action.loop =
                THREE.LoopRepeat;

            action.clampWhenFinished =
                false;

            this.actions.set(
                clip.name,
                action
            );
        }
    }


    async loadAccessories() {

        await this.accessories
            .loadAccessories(
                this.definition.accessories
            );
    }


    playClip(
        clipName = this.definition.clip
    ) {

        const nextAction =
            this.actions.get(
                clipName
            );

        if (!nextAction) {

            console.warn(
                `Avatar ${this.id}: ` +
                `clip "${clipName}" not found`
            );

            return;
        }


        if (
            this.currentAction ===
            nextAction
        ) {

            return;
        }


        if (this.currentAction) {

            nextAction
                .reset()
                .fadeIn(
                    CROSSFADE_MS / 1000
                );

            this.currentAction
                .fadeOut(
                    CROSSFADE_MS / 1000
                );

        } else {

            nextAction
                .reset()
                .fadeIn(
                    CROSSFADE_MS / 1000
                );
        }


        nextAction.play();

        this.currentAction =
            nextAction;
    }


    disableGesture() {

        this.gestureDriver.disable();
    }


    enableGesture() {

        this.gestureDriver.enable();

        this.gestureDriver.setGesture(
            this.definition.gesture
        );
    }


    stopBodyAnimation() {

        if (!this.currentAction) {
            return;
        }

        const action =
            this.currentAction;

        action.fadeOut(
            CROSSFADE_MS / 1000
        );

        this.currentAction = null;
    }


    beginOrderedTurn() {

        this.disableGesture();

        this.expressionDriver.apply(
            this.definition.expression
        );

        this.playClip(
            this.definition.clip
        );
    }


    async completeOrderedTurn() {

        this.stopBodyAnimation();

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    CROSSFADE_MS
                )
        );

        this.enableGesture();
    }


    update(delta) {

        this.mixer.update(
            delta
        );

        this.gestureDriver.update(
            delta
        );
    }
}


// ============================================================
// AVATAR STORAGE
// ============================================================

const avatarControllers = [];
// ============================================================
// EXHIBIT STORAGE
// ============================================================

let exhibitController = null;

// ============================================================
// LOAD AVATARS
// ============================================================

async function loadAvatars() {

    for (
        const definition
        of AVATAR_DEFINITIONS
    ) {

        setStatus(
            `Loading Avatar ${definition.id}...`
        );

        const gltf =
            await loader.loadAsync(
                definition.path
            );

        const controller =
            new AvatarController(
                definition,
                gltf
            );

        scene.add(
            controller.model
        );

        await controller
            .loadAccessories();

        avatarControllers.push(
            controller
        );

        console.log(
            `Avatar ${definition.id} loaded`
        );

        console.log(
            'Animations:',
            controller.animations.map(
                clip => clip.name
            )
        );

        console.log(
            'Bones:',
            Object.keys(
                controller.bones
            )
        );
    }
}


// ============================================================
// BONE WORLD POSITION
// ============================================================

function getBoneWorldPosition(
    controller,
    boneName
) {

    const bone =
        controller.bones[
            boneName
        ];

    if (!bone) {

        console.warn(
            `Avatar ${controller.id}: ` +
            `bone "${boneName}" not found`
        );

        return controller.model
            .getWorldPosition(
                new THREE.Vector3()
            );
    }

    const position =
        new THREE.Vector3();

    bone.getWorldPosition(
        position
    );

    return position;
}


// ============================================================
// INSPECTION CAMERA OFFSETS
// ============================================================
/**
const INSPECTION_OFFSETS = {

    Head:
        new THREE.Vector3(
            2.8,
            1.0,
            3.5
        ),

    LeftArm:
        new THREE.Vector3(
            3.2,
            0.7,
            3.3
        ),

    RightFoot:
        new THREE.Vector3(
            3.0,
            1.3,
            3.2
        )
};


// ============================================================
// GET INSPECTION POSITION
// ============================================================

function calculateInspectionCameraPosition(
    controller
) {

    const bonePosition =
        getBoneWorldPosition(
            controller,
            controller.inspectionBone
        );

    const offset =
        INSPECTION_OFFSETS[
            controller.inspectionBone
        ] ||
        INSPECTION_OFFSETS.Head;

    return bonePosition
        .clone()
        .add(offset);
}


// ============================================================
// LOOK CAMERA
// ============================================================

function lookAtInspection(
    controller
) {

    const target =
        getBoneWorldPosition(
            controller,
            controller.inspectionBone
        );

    camera.lookAt(
        target
    );
}


// ============================================================
// GENERIC CAMERA MOVE
// ============================================================

function moveCameraTo(
    position,
    duration,
    target = FORMATION_CENTER
) {

    return new Promise(
        resolve => {

            const start =
                camera.position.clone();

            const destination =
                position.clone();

            const tweenObject = {
                t: 0
            };


            new TWEEN.Tween(
                tweenObject
            )
                .to(
                    {
                        t: 1
                    },
                    duration
                )
                .easing(
                    TWEEN.Easing.Cubic.InOut
                )
                .onUpdate(() => {

                    camera.position
                        .lerpVectors(
                            start,
                            destination,
                            tweenObject.t
                        );

                    camera.lookAt(
                        target
                    );
                })
                .onComplete(() => {

                    camera.position.copy(
                        destination
                    );

                    camera.lookAt(
                        target
                    );

                    resolve();
                })
                .start();
        }
    );
}


// ============================================================
// CAMERA → SPECIFIC AVATAR
// ============================================================

function moveCameraToInspection(
    controller,
    duration = 1800
) {

    return new Promise(
        resolve => {

            const destination =
                calculateInspectionCameraPosition(
                    controller
                );

            const start =
                camera.position.clone();

            const tweenObject = {
                t: 0
            };


            new TWEEN.Tween(
                tweenObject
            )
                .to(
                    {
                        t: 1
                    },
                    duration
                )
                .easing(
                    TWEEN.Easing.Cubic.InOut
                )
                .onUpdate(() => {

                    camera.position
                        .lerpVectors(
                            start,
                            destination,
                            tweenObject.t
                        );

                    lookAtInspection(
                        controller
                    );
                })
                .onComplete(() => {

                    camera.position.copy(
                        destination
                    );

                    lookAtInspection(
                        controller
                    );

                    resolve();
                })
                .start();
        }
    );
}


// ============================================================
// PERFORM AVATAR
// ============================================================

async function performAvatar(
    controller
) {

    setStatus(
        `Avatar ${controller.id} — ` +
        `${controller.definition.sentence}`
    );


    // Body animation
    controller.playClip();


    // Facial expression
    controller.expressionDriver.apply(
        controller.definition.expression
    );


    // Gesture
    controller.gestureDriver.setGesture(
        controller.definition.gesture
    );


    // Speech / visemes
    await controller.speechDriver.speak(
        controller.definition.sentence
    );
}


// ============================================================
// INSPECTION SHOT
// ============================================================

async function inspectAvatar(
    controller
) {

    console.log(
        `Camera → Avatar ${controller.id}`
    );

    setStatus(
        `Camera → Avatar ${controller.id}`
    );


    await moveCameraToInspection(
        controller,
        1800
    );


    console.log(
        `Avatar ${controller.id} inspection started`
    );


    await performAvatar(
        controller
    );


    console.log(
        `Avatar ${controller.id} inspection complete`
    );
}

*/

// ============================================================
// INSPECTION CAMERA OFFSETS
// ============================================================

const INSPECTION_OFFSETS = {

    Head:
        new THREE.Vector3(
            2.8,
            1.0,
            3.5
        ),

    LeftArm:
        new THREE.Vector3(
            3.2,
            0.7,
            3.3
        ),

    RightFoot:
        new THREE.Vector3(
            3.0,
            1.3,
            3.2
        )
};


// ============================================================
// GET INSPECTION POSITION
// ============================================================

function calculateInspectionCameraPosition(
    controller
) {

    const bonePosition =
        getBoneWorldPosition(
            controller,
            controller.inspectionBone
        );

    const offset =
        INSPECTION_OFFSETS[
            controller.inspectionBone
        ] ||
        INSPECTION_OFFSETS.Head;

    return bonePosition
        .clone()
        .add(offset);
}


// ============================================================
// LOOK CAMERA
// ============================================================

function lookAtInspection(
    controller
) {

    const target =
        getBoneWorldPosition(
            controller,
            controller.inspectionBone
        );

    camera.lookAt(
        target
    );
}


// ============================================================
// GENERIC CAMERA MOVE
// ============================================================

function moveCameraTo(
    position,
    duration,
    target = FORMATION_CENTER
) {

    return new Promise(
        resolve => {

            const start =
                camera.position.clone();

            const destination =
                position.clone();

            const tweenObject = {
                t: 0
            };


            new TWEEN.Tween(
                tweenObject
            )
                .to(
                    {
                        t: 1
                    },
                    duration
                )
                .easing(
                    TWEEN.Easing.Cubic.InOut
                )
                .onUpdate(() => {

                    camera.position
                        .lerpVectors(
                            start,
                            destination,
                            tweenObject.t
                        );

                    camera.lookAt(
                        target
                    );
                })
                .onComplete(() => {

                    camera.position.copy(
                        destination
                    );

                    camera.lookAt(
                        target
                    );

                    resolve();
                })
                .start();
        }
    );
}


// ============================================================
// CAMERA → SPECIFIC AVATAR
// ============================================================

function moveCameraToInspection(
    controller,
    duration = 1800
) {

    return new Promise(
        resolve => {

            const destination =
                calculateInspectionCameraPosition(
                    controller
                );

            const start =
                camera.position.clone();

            const tweenObject = {
                t: 0
            };


            new TWEEN.Tween(
                tweenObject
            )
                .to(
                    {
                        t: 1
                    },
                    duration
                )
                .easing(
                    TWEEN.Easing.Cubic.InOut
                )
                .onUpdate(() => {

                    camera.position
                        .lerpVectors(
                            start,
                            destination,
                            tweenObject.t
                        );

                    lookAtInspection(
                        controller
                    );
                })
                .onComplete(() => {

                    camera.position.copy(
                        destination
                    );

                    lookAtInspection(
                        controller
                    );

                    resolve();
                })
                .start();
        }
    );
}


// ============================================================
// PERFORM AVATAR
// ============================================================

async function performAvatar(
    controller
) {

    setStatus(
        `Avatar ${controller.id} — ` +
        `${controller.definition.sentence}`
    );


    // Body animation
    controller.playClip();


    // Facial expression
    controller.expressionDriver.apply(
        controller.definition.expression
    );


    // Gesture
    controller.gestureDriver.setGesture(
        controller.definition.gesture
    );


    // Speech / visemes
    await controller.speechDriver.speak(
        controller.definition.sentence
    );
}


// ============================================================
// AVATAR INSPECTION SHOT DEFINITIONS
// ============================================================
//
// Avatar 1 → side profile
// Avatar 2 → gesture inspection
// Avatar 3 → accessory inspection
// Avatar 4 → face inspection
// Avatar 5 → upper-body inspection
// ============================================================

const AVATAR_INSPECTION_SHOTS = {

    1: {
        type: 'side_profile',
        duration: 2600
    },

    2: {
        type: 'gesture',
        duration: 1800
    },

    3: {
        type: 'accessory',
        duration: 4200
    },

    4: {
        type: 'face',
        duration: 3000
    },

    5: {
        type: 'upper_body',
        duration: 2400
    }
};


function getAvatarInspectionCenter(
    controller
) {

    return controller.model.getWorldPosition(
        new THREE.Vector3()
    );
}


function getAvatarInspectionHead(
    controller
) {

    return getBoneWorldPosition(
        controller,
        'Head'
    );
}


// ============================================================
// SIDE PROFILE
// ============================================================
//
// Camera moves to a clean 90-degree profile while keeping the
// head and upper body in frame.
// ============================================================

async function runAvatarSideProfileInspection(
    controller,
    duration
) {

    const center =
        getAvatarInspectionCenter(
            controller
        );

    const target =
        getAvatarInspectionHead(
            controller
        ).add(
            new THREE.Vector3(
                0,
                -0.25,
                0
            )
        );

    const destination =
        center.clone().add(
            new THREE.Vector3(
                4.0,
                1.55,
                0.15
            )
        );

    await moveCameraTo(
        destination,
        duration,
        target
    );

    await performAvatar(
        controller
    );
}


// ============================================================
// GESTURE INSPECTION
// ============================================================
//
// Camera stays close to the upper body/gesture area while the
// avatar performs its configured gesture and speech.
// ============================================================

async function runAvatarGestureInspection(
    controller,
    duration
) {

    const gestureBone =
        getBoneWorldPosition(
            controller,
            controller.inspectionBone
        );

    const destination =
        gestureBone.clone().add(
            new THREE.Vector3(
                2.7,
                0.65,
                2.8
            )
        );

    const target =
        gestureBone.clone().add(
            new THREE.Vector3(
                0,
                0.15,
                0
            )
        );

    await moveCameraTo(
        destination,
        duration,
        target
    );

    await performAvatar(
        controller
    );
}


// ============================================================
// ACCESSORY INSPECTION
// ============================================================
//
// A close orbit keeps the avatar's attached accessories visible
// while the existing avatar performance runs.
// ============================================================

function runAvatarAccessoryOrbit(
    controller,
    duration
) {

    return new Promise(
        resolve => {

            const center =
                getAvatarInspectionCenter(
                    controller
                );

            const target =
                getAvatarInspectionHead(
                    controller
                ).add(
                    new THREE.Vector3(
                        0,
                        -0.45,
                        0
                    )
                );

            const startOffset =
                new THREE.Vector3(
                    4.2,
                    1.8,
                    4.2
                );

            const radius =
                Math.sqrt(
                    startOffset.x *
                    startOffset.x +

                    startOffset.z *
                    startOffset.z
                );

            const startAngle =
                Math.atan2(
                    startOffset.x,
                    startOffset.z
                );

            const state = {
                angle: startAngle
            };


            new TWEEN.Tween(
                state
            )
                .to(
                    {
                        angle:
                            startAngle +
                            Math.PI * 1.25
                    },
                    duration
                )
                .easing(
                    TWEEN.Easing.Cubic.InOut
                )
                .onUpdate(() => {

                    camera.position.x =
                        center.x +
                        Math.sin(
                            state.angle
                        ) *
                        radius;

                    camera.position.z =
                        center.z +
                        Math.cos(
                            state.angle
                        ) *
                        radius;

                    camera.position.y =
                        center.y +
                        1.8 +
                        Math.sin(
                            state.angle
                        ) *
                        0.25;

                    camera.lookAt(
                        target
                    );
                })
                .onComplete(() => {

                    camera.lookAt(
                        target
                    );

                    resolve();
                })
                .start();
        }
    );
}


async function runAvatarAccessoryInspection(
    controller,
    duration
) {

    const center =
        getAvatarInspectionCenter(
            controller
        );

    const head =
        getAvatarInspectionHead(
            controller
        );

    const target =
        head.clone().add(
            new THREE.Vector3(
                0,
                -0.45,
                0
            )
        );

    const startPosition =
        center.clone().add(
            new THREE.Vector3(
                4.2,
                1.8,
                4.2
            )
        );

    await moveCameraTo(
        startPosition,
        900,
        target
    );

    const actionPromise =
        performAvatar(
            controller
        );

    const cameraPromise =
        runAvatarAccessoryOrbit(
            controller,
            duration
        );

    await Promise.all([
        actionPromise,
        cameraPromise
    ]);
}


// ============================================================
// FACE INSPECTION
// ============================================================
//
// Slow push toward the head for facial expression and viseme
// inspection.
// ============================================================

async function runAvatarFaceInspection(
    controller,
    duration
) {

    const head =
        getAvatarInspectionHead(
            controller
        );

    const startPosition =
        head.clone().add(
            new THREE.Vector3(
                2.2,
                0.35,
                2.6
            )
        );

    const closePosition =
        head.clone().add(
            new THREE.Vector3(
                1.35,
                0.18,
                1.65
            )
        );

    const target =
        head.clone();

    await moveCameraTo(
        startPosition,
        900,
        target
    );

    const actionPromise =
        performAvatar(
            controller
        );

    const cameraPromise =
        moveCameraTo(
            closePosition,
            duration,
            target
        );

    await Promise.all([
        actionPromise,
        cameraPromise
    ]);
}


// ============================================================
// UPPER-BODY INSPECTION
// ============================================================
//
// Frames chest + head for expression, gesture and speech.
// ============================================================

async function runAvatarUpperBodyInspection(
    controller,
    duration
) {

    const center =
        getAvatarInspectionCenter(
            controller
        );

    const head =
        getAvatarInspectionHead(
            controller
        );

    const destination =
        center.clone().add(
            new THREE.Vector3(
                3.6,
                1.8,
                4.0
            )
        );

    const target =
        head.clone().add(
            new THREE.Vector3(
                0,
                -0.55,
                0
            )
        );

    await moveCameraTo(
        destination,
        duration,
        target
    );

    await performAvatar(
        controller
    );
}


// ============================================================
// INSPECTION SHOT DISPATCHER
// ============================================================

async function inspectAvatar(
    controller
) {

    const config =
        AVATAR_INSPECTION_SHOTS[
            controller.id
        ] || {
            type: 'upper_body',
            duration: 2200
        };

    console.log(
        `Camera → Avatar ${controller.id} → ${config.type}`
    );

    setStatus(
        `Avatar ${controller.id} → ${config.type}`
    );


    switch (config.type) {

        case 'side_profile':

            await runAvatarSideProfileInspection(
                controller,
                config.duration
            );

            break;


        case 'gesture':

            await runAvatarGestureInspection(
                controller,
                config.duration
            );

            break;


        case 'accessory':

            await runAvatarAccessoryInspection(
                controller,
                config.duration
            );

            break;


        case 'face':

            await runAvatarFaceInspection(
                controller,
                config.duration
            );

            break;


        case 'upper_body':

            await runAvatarUpperBodyInspection(
                controller,
                config.duration
            );

            break;


        default:

            await runAvatarUpperBodyInspection(
                controller,
                config.duration
            );
    }


    console.log(
        `Avatar ${controller.id} inspection complete`
    );
}



// ============================================================
// ORBIT
// ============================================================

// ============================================================
// ORDERED AVATAR FORMATION SYSTEM
// ============================================================
//
// Master selection:
//     ORDERED_AVATAR_SEQUENCE
//
// Supported:
//     2 avatars
//     3 avatars
//     4 avatars
//     5 avatars
//
// Formation shots:
//
//     runOrderedFormationApproach()
//             ↓
//     runOrderedFormationOrbit()
//             ↓
//     runFormationOrbit()
//             ↓
//     runFormationPortrait()
//             ↓
//     runFormationElevation()
//
// All formation shots use the SAME formation layout
// and the SAME camera configuration.
//

const ORDERED_AVATAR_SEQUENCE = [
    0,
    1,
    2,
    3,
    4
];


// ============================================================
// FORMATION LAYOUTS
// ============================================================

const ORDERED_FORMATION_LAYOUTS = {

    // --------------------------------------------------------
    // 2 AVATARS
    // --------------------------------------------------------

    2: [

        [-1.3, 0],

        [1.3, 0]

    ],


    // --------------------------------------------------------
    // 3 AVATARS
    // --------------------------------------------------------

    3: [

        [0, 0.8],

        [-1.5, -0.8],

        [1.5, -0.8]

    ],


    // --------------------------------------------------------
    // 4 AVATARS
    // --------------------------------------------------------

    4: [

        [-1.5, 0.8],

        [1.5, 0.8],

        [-1.5, -0.8],

        [1.5, -0.8]

    ],


    // --------------------------------------------------------
    // 5 AVATARS
    // --------------------------------------------------------

    5: [

        [0, 1.1],

        [-1.5, 0.2],

        [1.5, 0.2],

        [-1.2, -1.0],

        [1.2, -1.0]

    ]

};


// ============================================================
// SHARED FORMATION CAMERA CONFIGURATION
// ============================================================
//
// Every formation shot derives its framing from this
// configuration.
//
// This keeps:
//
//     Approach
//     Orbit
//     Portrait
//     Elevation
//
// visually consistent.
//

const ORDERED_FORMATION_CAMERA = {

    fov: 45,

    orbitDuration: 7000,

    orbitStartAngle: 0,

    height: 3.5,

    verticalAmplitude: 0.4,

    heroHeight: 3.5,

    elevationLowHeight: 2.2,

    elevationHighHeight: 5.4,

    portraitAngle:
        THREE.MathUtils.degToRad(22),

    portraitHeight: 3.5,

    approachDistanceMultiplier: 2.2,

    approachHighHeight: 6.5,

    approachFastDuration: 1200,

    approachSlowDuration: 1800

};


// ============================================================
// FORMATION ORBIT SETTINGS
// ============================================================

const ORDERED_FORMATION_ORBIT = {

    height: 3.5,

    verticalAmplitude: 0.4,

    revolutions: 1

};


// ============================================================
// VALIDATE FORMATION SELECTION
// ============================================================

function validateFormationSelection(
    avatarIndices
) {

    if (
        !Array.isArray(
            avatarIndices
        )
    ) {

        throw new Error(
            'avatarIndices must be an array.'
        );
    }


    if (
        avatarIndices.length < 2 ||
        avatarIndices.length > 5
    ) {

        throw new Error(
            'Ordered formation requires 2–5 active avatars.'
        );
    }


    const unique =
        new Set(
            avatarIndices
        );

    if (
        unique.size !==
        avatarIndices.length
    ) {

        throw new Error(
            'Formation avatar indices must be unique.'
        );
    }


    for (
        const index of avatarIndices
    ) {

        if (
            !avatarControllers[index]
        ) {

            throw new Error(
                `Avatar index ${index} does not exist.`
            );
        }
    }
}


// ============================================================
// GET FORMATION LAYOUT
// ============================================================

function getOrderedFormationLayout(
    avatarIndices
) {

    validateFormationSelection(
        avatarIndices
    );


    const count =
        avatarIndices.length;


    const layout =
        ORDERED_FORMATION_LAYOUTS[
            count
        ];


    if (!layout) {

        throw new Error(
            'Ordered formation requires 2–5 active avatars.'
        );
    }


    return layout;
}


// ============================================================
// APPLY ORDERED FORMATION
// ============================================================
//
// Selected avatars are temporarily moved into the shared
// formation.
//
// Original positions and visibility are saved so that they
// can be restored after the shot.
//

function applyOrderedFormation(
    avatarIndices
) {

    const layout =
        getOrderedFormationLayout(
            avatarIndices
        );


    const originalStates =
        new Map();


    // --------------------------------------------------------
    // SAVE ORIGINAL STATES
    // --------------------------------------------------------

    for (
        let index = 0;
        index < avatarControllers.length;
        index++
    ) {

        const controller =
            avatarControllers[index];


        originalStates.set(
            index,
            {

                position:
                    controller.model
                        .position
                        .clone(),

                visible:
                    controller.model.visible

            }
        );


        controller.model.visible =
            avatarIndices.includes(
                index
            );
    }


    // --------------------------------------------------------
    // APPLY FORMATION POSITIONS
    // --------------------------------------------------------

    avatarIndices.forEach(
        (
            avatarIndex,
            slot
        ) => {

            const controller =
                avatarControllers[
                    avatarIndex
                ];


            const [
                x,
                z
            ] =
                layout[
                    slot
                ];


            controller.model.position.set(

                FORMATION_CENTER.x + x,

                0,

                FORMATION_CENTER.z + z

            );
        }
    );


    return originalStates;
}


// ============================================================
// RESTORE ORIGINAL AVATAR STATES
// ============================================================

function restoreOrderedFormation(
    originalStates
) {

    for (
        const [
            index,
            state
        ]
        of originalStates
    ) {

        const controller =
            avatarControllers[index];


        if (!controller) {
            continue;
        }


        controller.model.position.copy(
            state.position
        );


        controller.model.visible =
            state.visible;
    }
}


// ============================================================
// GET SHARED FORMATION CAMERA CONFIG
// ============================================================
//
// This is the important part of the integrated system.
//
// The same layout generates the same:
//
//     center
//     radius
//     target
//     orbit start
//     hero position
//     portrait positions
//     elevation positions
//     approach positions
//
// for every formation shot.
//

function getOrderedFormationCameraConfig(
    avatarIndices
) {

    const layout =
        getOrderedFormationLayout(
            avatarIndices
        );


    const center =
        FORMATION_CENTER.clone();


    // --------------------------------------------------------
    // FIND FORMATION EXTENTS
    // --------------------------------------------------------

    let minX = Infinity;

    let maxX = -Infinity;

    let minZ = Infinity;

    let maxZ = -Infinity;


    for (
        const [
            x,
            z
        ]
        of layout
    ) {

        minX =
            Math.min(
                minX,
                x
            );

        maxX =
            Math.max(
                maxX,
                x
            );

        minZ =
            Math.min(
                minZ,
                z
            );

        maxZ =
            Math.max(
                maxZ,
                z
            );
    }


    const span =
        Math.max(

            maxX - minX,

            maxZ - minZ,

            1

        );


    // --------------------------------------------------------
    // CAMERA RADIUS
    // --------------------------------------------------------

    const fov =
        THREE.MathUtils.degToRad(
            ORDERED_FORMATION_CAMERA.fov
        );


    const fitDistance =
        (
            span * 0.5
        ) /
        Math.tan(
            fov * 0.5
        );


    const radius =
        THREE.MathUtils.clamp(

            fitDistance * 1.7,

            5.0,

            8.0

        );


    // --------------------------------------------------------
    // SHARED ANGLE
    // --------------------------------------------------------

    const orbitStartAngle =
        ORDERED_FORMATION_CAMERA
            .orbitStartAngle;


    // --------------------------------------------------------
    // ORBIT START
    // --------------------------------------------------------

    const orbitStartPosition =
        new THREE.Vector3(

            center.x +
                Math.sin(
                    orbitStartAngle
                ) *
                radius,

            ORDERED_FORMATION_CAMERA
                .height,

            center.z +
                Math.cos(
                    orbitStartAngle
                ) *
                radius

        );


    // --------------------------------------------------------
    // HERO
    // --------------------------------------------------------

    const heroPosition =
        new THREE.Vector3(

            center.x,

            ORDERED_FORMATION_CAMERA
                .heroHeight,

            center.z +
                radius

        );


    // --------------------------------------------------------
    // ELEVATION LOW
    // --------------------------------------------------------

    const elevationLowPosition =
        new THREE.Vector3(

            center.x,

            ORDERED_FORMATION_CAMERA
                .elevationLowHeight,

            center.z +
                radius

        );


    // --------------------------------------------------------
    // ELEVATION HIGH
    // --------------------------------------------------------

    const elevationHighPosition =
        new THREE.Vector3(

            center.x,

            ORDERED_FORMATION_CAMERA
                .elevationHighHeight,

            center.z +
                radius

        );


    // --------------------------------------------------------
    // PORTRAIT LEFT
    // --------------------------------------------------------

    const portraitAngle =
        -ORDERED_FORMATION_CAMERA
            .portraitAngle;


    const portraitLeftPosition =
        new THREE.Vector3(

            center.x +
                Math.sin(
                    portraitAngle
                ) *
                radius,

            ORDERED_FORMATION_CAMERA
                .portraitHeight,

            center.z +
                Math.cos(
                    portraitAngle
                ) *
                radius

        );


    // --------------------------------------------------------
    // PORTRAIT CENTER
    // --------------------------------------------------------

    const portraitCenterPosition =
        new THREE.Vector3(

            center.x,

            ORDERED_FORMATION_CAMERA
                .portraitHeight,

            center.z +
                radius

        );


    // --------------------------------------------------------
    // PORTRAIT RIGHT
    // --------------------------------------------------------

    const portraitRightAngle =
        ORDERED_FORMATION_CAMERA
            .portraitAngle;


    const portraitRightPosition =
        new THREE.Vector3(

            center.x +
                Math.sin(
                    portraitRightAngle
                ) *
                radius,

            ORDERED_FORMATION_CAMERA
                .portraitHeight,

            center.z +
                Math.cos(
                    portraitRightAngle
                ) *
                radius

        );


    // --------------------------------------------------------
    // APPROACH FAR
    // --------------------------------------------------------

    const approachFarRadius =
        radius *
        ORDERED_FORMATION_CAMERA
            .approachDistanceMultiplier;


    const approachFarPosition =
        new THREE.Vector3(

            center.x,

            ORDERED_FORMATION_CAMERA
                .approachHighHeight,

            center.z +
                approachFarRadius

        );


    // --------------------------------------------------------
    // APPROACH MID
    // --------------------------------------------------------

    const approachMidPosition =
        new THREE.Vector3(

            center.x,

            ORDERED_FORMATION_CAMERA
                .height + 0.7,

            center.z +
                radius * 1.35

        );


    // --------------------------------------------------------
    // RETURN CONFIGURATION
    // --------------------------------------------------------

    return {

        center,

        radius,

        target:
            center.clone(),

        orbitStartAngle,

        orbitStartPosition,

        heroPosition,

        elevationLowPosition,

        elevationHighPosition,

        portraitLeftPosition,

        portraitCenterPosition,

        portraitRightPosition,

        approachFarPosition,

        approachMidPosition,

        height:
            ORDERED_FORMATION_CAMERA
                .height,

        verticalAmplitude:
            ORDERED_FORMATION_CAMERA
                .verticalAmplitude,

        orbitDuration:
            ORDERED_FORMATION_CAMERA
                .orbitDuration

    };
}


// ============================================================
// APPLY FORMATION CAMERA CONFIGURATION
// ============================================================

function applyFormationCameraConfig(
    config
) {

    if (
        camera.isPerspectiveCamera
    ) {

        camera.fov =
            ORDERED_FORMATION_CAMERA
                .fov;

        camera.updateProjectionMatrix();
    }


    camera.lookAt(
        config.target
    );
}


// ============================================================
// GENERIC FORMATION CAMERA MOVE
// ============================================================

function moveFormationCameraTo(
    position,
    duration,
    target
) {

    return new Promise(
        resolve => {

            const start =
                camera.position.clone();


            const destination =
                position.clone();


            const tweenObject = {
                t: 0
            };


            new TWEEN.Tween(
                tweenObject
            )

                .to(
                    {
                        t: 1
                    },
                    duration
                )

                .easing(
                    TWEEN.Easing.Cubic.InOut
                )

                .onUpdate(
                    () => {

                        camera.position.lerpVectors(

                            start,

                            destination,

                            tweenObject.t

                        );


                        camera.lookAt(
                            target
                        );
                    }
                )

                .onComplete(
                    () => {

                        camera.position.copy(
                            destination
                        );


                        camera.lookAt(
                            target
                        );


                        resolve();
                    }
                )

                .start();
        }
    );
}


// ============================================================
// FORMATION ORBIT CAMERA
// ============================================================
//
// Orbit → elevation movement → hero.
//
// Uses the shared formation configuration.
//

function runFormationOrbitCamera(
    config,
    includeHero = true
) {

    return new Promise(
        resolve => {

            const orbitState = {

                angle:
                    config.orbitStartAngle

            };


            new TWEEN.Tween(
                orbitState
            )

                .to(
                    {
                        angle:
                            config.orbitStartAngle +
                            Math.PI * 2
                    },

                    config.orbitDuration
                )

                .easing(
                    TWEEN.Easing.Linear.None
                )

                .onUpdate(
                    () => {

                        const angle =
                            orbitState.angle;


                        camera.position.x =
                            config.center.x +
                            Math.sin(angle) *
                            config.radius;


                        camera.position.z =
                            config.center.z +
                            Math.cos(angle) *
                            config.radius;


                        camera.position.y =
                            config.height +
                            Math.sin(
                                angle * 2
                            ) *
                            config.verticalAmplitude;


                        camera.lookAt(
                            config.target
                        );
                    }
                )

                .onComplete(
                    async () => {

                        camera.position.copy(
                            config.orbitStartPosition
                        );


                        if (
                            includeHero
                        ) {

                            await moveFormationCameraTo(

                                config.heroPosition,

                                1800,

                                config.target

                            );
                        }


                        resolve();
                    }
                )

                .start();
        }
    );
}


// ============================================================
// PREPARE ORDERED WAITING POSE
// ============================================================

function prepareOrderedWaitingPose(
    avatarIndices
) {

    for (
        const index
        of avatarIndices
    ) {

        const controller =
            avatarControllers[index];


        if (!controller) {
            continue;
        }


        controller.disableGesture();

        controller.stopBodyAnimation();

        controller.enableGesture();
    }
}


// ============================================================
// RUN ONE ORDERED AVATAR TURN
// ============================================================

async function runOrderedAvatarTurn(
    avatarIndex
) {

    const controller =
        avatarControllers[
            avatarIndex
        ];


    if (!controller) {
        return;
    }


    setStatus(

        `Avatar ${controller.id} — ` +
        `${controller.definition.sentence}`

    );


    controller.beginOrderedTurn();


    await controller.speechDriver.speak(

        controller.definition.sentence

    );


    await controller.completeOrderedTurn();
}


// ============================================================
// RUN ORDERED AVATAR SEQUENCE
// ============================================================
//
// Avatar 1
//     ↓
// Avatar 2
//     ↓
// Avatar 3
//     ↓
// ...

async function runOrderedAvatarSequence(
    avatarIndices
) {

    for (
        const avatarIndex
        of avatarIndices
    ) {

        await runOrderedAvatarTurn(
            avatarIndex
        );
    }
}


// ============================================================
// ORDERED FORMATION APPROACH
// ============================================================
//
// FAR
//  ↓
// FAST APPROACH
//  ↓
// SLOW ARRIVAL
//  ↓
// HERO
//
// This shot only reveals the formation.
// The avatars do not perform here.
//

async function runOrderedFormationApproach(
    avatarIndices =
        ORDERED_AVATAR_SEQUENCE
) {

    validateFormationSelection(
        avatarIndices
    );


    let originalStates = null;

    let config = null;


    try {

        // ----------------------------------------------------
        // APPLY SHARED FORMATION
        // ----------------------------------------------------

        originalStates =
            applyOrderedFormation(
                avatarIndices
            );


        prepareOrderedWaitingPose(
            avatarIndices
        );


        // ----------------------------------------------------
        // GET SHARED CAMERA CONFIG
        // ----------------------------------------------------

        config =
            getOrderedFormationCameraConfig(
                avatarIndices
            );


        applyFormationCameraConfig(
            config
        );


        setStatus(
            `${avatarIndices.length} avatars — ` +
            `formation approach`
        );


        // ----------------------------------------------------
        // FAR
        // ----------------------------------------------------

        await moveFormationCameraTo(

            config.approachFarPosition,

            900,

            config.target

        );


        // ----------------------------------------------------
        // FAST APPROACH
        // ----------------------------------------------------

        await moveFormationCameraTo(

            config.approachMidPosition,

            ORDERED_FORMATION_CAMERA
                .approachFastDuration,

            config.target

        );


        // ----------------------------------------------------
        // SLOW ARRIVAL
        // ----------------------------------------------------

        await moveFormationCameraTo(

            config.heroPosition,

            ORDERED_FORMATION_CAMERA
                .approachSlowDuration,

            config.target

        );


    } finally {

        // ----------------------------------------------------
        // RESTORE ORIGINAL POSITIONS
        // ----------------------------------------------------

        if (
            originalStates
        ) {

            restoreOrderedFormation(
                originalStates
            );
        }


        if (
            config
        ) {

            camera.lookAt(
                config.target
            );
        }
    }
}


// ============================================================
// ORDERED FORMATION ORBIT
// ============================================================
//
// Formation
//     ↓
// Orbit
//     ↓
// Elevation during orbit
//     ↓
// Hero
//
// Avatar performance is ORDERED:
//
// Avatar 1
//     ↓
// Avatar 2
//     ↓
// Avatar 3
//     ↓
// ...

async function runOrderedFormationOrbit(
    avatarIndices =
        ORDERED_AVATAR_SEQUENCE
) {

    validateFormationSelection(
        avatarIndices
    );


    let originalStates = null;

    let config = null;


    try {

        // ----------------------------------------------------
        // APPLY FORMATION
        // ----------------------------------------------------

        originalStates =
            applyOrderedFormation(
                avatarIndices
            );


        prepareOrderedWaitingPose(
            avatarIndices
        );


        // ----------------------------------------------------
        // SHARED CAMERA CONFIG
        // ----------------------------------------------------

        config =
            getOrderedFormationCameraConfig(
                avatarIndices
            );


        applyFormationCameraConfig(
            config
        );


        setStatus(

            `${avatarIndices.length} avatars — ` +
            `ordered formation orbit`

        );


        // ----------------------------------------------------
        // CAMERA START
        // ----------------------------------------------------

        camera.position.copy(
            config.orbitStartPosition
        );


        camera.lookAt(
            config.target
        );


        // ----------------------------------------------------
        // CAMERA + AVATAR PERFORMANCE
        // ----------------------------------------------------

        await Promise.all([

            runFormationOrbitCamera(
                config,
                true
            ),

            runOrderedAvatarSequence(
                avatarIndices
            )

        ]);


    } finally {

        // ----------------------------------------------------
        // RESTORE
        // ----------------------------------------------------

        if (
            originalStates
        ) {

            restoreOrderedFormation(
                originalStates
            );
        }


        if (
            config
        ) {

            camera.lookAt(
                config.target
            );
        }
    }
}


// ============================================================
// FORMATION ORBIT
// ============================================================
//
// All selected avatars perform simultaneously.
//
// Camera:
//
//     formation
//        ↓
//     complete orbit
//        ↓
//     elevation
//        ↓
//     hero
//
// Uses ORDERED_AVATAR_SEQUENCE as the master selection.
//

async function runFormationOrbit(
    avatarIndices =
        ORDERED_AVATAR_SEQUENCE
) {

    validateFormationSelection(
        avatarIndices
    );


    let originalStates = null;

    let config = null;


    try {

        // ----------------------------------------------------
        // APPLY SHARED FORMATION
        // ----------------------------------------------------

        originalStates =
            applyOrderedFormation(
                avatarIndices
            );


        // ----------------------------------------------------
        // SHARED CAMERA CONFIG
        // ----------------------------------------------------

        config =
            getOrderedFormationCameraConfig(
                avatarIndices
            );


        applyFormationCameraConfig(
            config
        );


        setStatus(

            `${avatarIndices.length} avatars — ` +
            `simultaneous formation orbit`

        );


        // ----------------------------------------------------
        // PREPARE ALL AVATARS
        // ----------------------------------------------------

        for (
            const index
            of avatarIndices
        ) {

            const controller =
                avatarControllers[index];


            controller.playClip();


            controller.expressionDriver.apply(

                controller.definition
                    .expression

            );


            controller.gestureDriver.setGesture(

                controller.definition
                    .gesture

            );
        }


        // ----------------------------------------------------
        // START SPEECH SIMULTANEOUSLY
        // ----------------------------------------------------

        const speechPromises =
            avatarIndices.map(
                index => {

                    const controller =
                        avatarControllers[
                            index
                        ];


                    return controller
                        .speechDriver
                        .speak(
                            controller
                                .definition
                                .sentence
                        );
                }
            );


        // ----------------------------------------------------
        // CAMERA START
        // ----------------------------------------------------

        camera.position.copy(
            config.orbitStartPosition
        );


        camera.lookAt(
            config.target
        );


        // ----------------------------------------------------
        // CAMERA + SPEECH
        // ----------------------------------------------------

        await Promise.all([

            runFormationOrbitCamera(
                config,
                true
            ),

            Promise.all(
                speechPromises
            )

        ]);


    } finally {

        // ----------------------------------------------------
        // RESTORE
        // ----------------------------------------------------

        if (
            originalStates
        ) {

            restoreOrderedFormation(
                originalStates
            );
        }


        if (
            config
        ) {

            camera.lookAt(
                config.target
            );
        }
    }
}


// ============================================================
// FORMATION PORTRAIT
// ============================================================
//
// Small camera movement only.
//
//     LEFT
//       ↓
//     CENTER
//       ↓
//     SLIGHT RIGHT
//       ↓
//     CENTER
//
// NOT a full orbit.
//
// All selected avatars perform simultaneously.
//

async function runFormationPortrait(
    avatarIndices =
        ORDERED_AVATAR_SEQUENCE
) {

    validateFormationSelection(
        avatarIndices
    );


    let originalStates = null;

    let config = null;


    try {

        // ----------------------------------------------------
        // APPLY SHARED FORMATION
        // ----------------------------------------------------

        originalStates =
            applyOrderedFormation(
                avatarIndices
            );


        // ----------------------------------------------------
        // SHARED CAMERA CONFIG
        // ----------------------------------------------------

        config =
            getOrderedFormationCameraConfig(
                avatarIndices
            );


        applyFormationCameraConfig(
            config
        );


        setStatus(

            `${avatarIndices.length} avatars — ` +
            `formation portrait`

        );


        // ----------------------------------------------------
        // PREPARE AVATARS
        // ----------------------------------------------------

        for (
            const index
            of avatarIndices
        ) {

            const controller =
                avatarControllers[index];


            controller.playClip();


            controller.expressionDriver.apply(

                controller.definition
                    .expression

            );


            controller.gestureDriver.setGesture(

                controller.definition
                    .gesture

            );
        }


        // ----------------------------------------------------
        // START SPEECH
        // ----------------------------------------------------

        const speechPromises =
            avatarIndices.map(
                index => {

                    const controller =
                        avatarControllers[
                            index
                        ];


                    return controller
                        .speechDriver
                        .speak(
                            controller
                                .definition
                                .sentence
                        );
                }
            );


        // ----------------------------------------------------
        // START AT CENTER
        // ----------------------------------------------------

        camera.position.copy(
            config.portraitCenterPosition
        );


        camera.lookAt(
            config.target
        );


        // ----------------------------------------------------
        // LEFT
        // ----------------------------------------------------

        await moveFormationCameraTo(

            config.portraitLeftPosition,

            900,

            config.target

        );


        // ----------------------------------------------------
        // CENTER
        // ----------------------------------------------------

        await moveFormationCameraTo(

            config.portraitCenterPosition,

            1100,

            config.target

        );


        // ----------------------------------------------------
        // SLIGHT RIGHT
        // ----------------------------------------------------

        await moveFormationCameraTo(

            config.portraitRightPosition,

            1100,

            config.target

        );


        // ----------------------------------------------------
        // FINAL CENTER
        // ----------------------------------------------------

        await moveFormationCameraTo(

            config.portraitCenterPosition,

            900,

            config.target

        );


        // ----------------------------------------------------
        // WAIT FOR SPEECH
        // ----------------------------------------------------

        await Promise.all(
            speechPromises
        );


    } finally {

        // ----------------------------------------------------
        // RESTORE
        // ----------------------------------------------------

        if (
            originalStates
        ) {

            restoreOrderedFormation(
                originalStates
            );
        }


        if (
            config
        ) {

            camera.lookAt(
                config.target
            );
        }
    }
}


// ============================================================
// FORMATION ELEVATION
// ============================================================
//
//     LOW
//      ↓
//   ELEVATED
//      ↓
//     HERO
//
// All selected avatars perform simultaneously.
//

async function runFormationElevation(
    avatarIndices =
        ORDERED_AVATAR_SEQUENCE
) {

    validateFormationSelection(
        avatarIndices
    );


    let originalStates = null;

    let config = null;


    try {

        // ----------------------------------------------------
        // APPLY SHARED FORMATION
        // ----------------------------------------------------

        originalStates =
            applyOrderedFormation(
                avatarIndices
            );


        // ----------------------------------------------------
        // SHARED CAMERA CONFIG
        // ----------------------------------------------------

        config =
            getOrderedFormationCameraConfig(
                avatarIndices
            );


        applyFormationCameraConfig(
            config
        );


        setStatus(

            `${avatarIndices.length} avatars — ` +
            `formation elevation`

        );


        // ----------------------------------------------------
        // PREPARE AVATARS
        // ----------------------------------------------------

        for (
            const index
            of avatarIndices
        ) {

            const controller =
                avatarControllers[index];


            controller.playClip();


            controller.expressionDriver.apply(

                controller.definition
                    .expression

            );


            controller.gestureDriver.setGesture(

                controller.definition
                    .gesture

            );
        }


        // ----------------------------------------------------
        // START SPEECH
        // ----------------------------------------------------

        const speechPromises =
            avatarIndices.map(
                index => {

                    const controller =
                        avatarControllers[
                            index
                        ];


                    return controller
                        .speechDriver
                        .speak(
                            controller
                                .definition
                                .sentence
                        );
                }
            );


        // ----------------------------------------------------
        // LOW
        // ----------------------------------------------------

        camera.position.copy(
            config.elevationLowPosition
        );


        camera.lookAt(
            config.target
        );


        // ----------------------------------------------------
        // ELEVATED
        // ----------------------------------------------------

        await moveFormationCameraTo(

            config.elevationHighPosition,

            1500,

            config.target

        );


        // ----------------------------------------------------
        // HERO
        // ----------------------------------------------------

        await moveFormationCameraTo(

            config.heroPosition,

            1300,

            config.target

        );


        // ----------------------------------------------------
        // WAIT FOR SPEECH
        // ----------------------------------------------------

        await Promise.all(
            speechPromises
        );


    } finally {

        // ----------------------------------------------------
        // RESTORE
        // ----------------------------------------------------

        if (
            originalStates
        ) {

            restoreOrderedFormation(
                originalStates
            );
        }


        if (
            config
        ) {

            camera.lookAt(
                config.target
            );
        }
    }
}


// ============================================================
// ORDERED FORMATION PORTRAIT
// ============================================================
//
// Camera:
//
//     LEFT
//       ↓
//     CENTER
//       ↓
//     RIGHT
//       ↓
//     CENTER
//
// Avatar performance:
//
//     Avatar 1
//        ↓
//     Avatar 2
//        ↓
//     Avatar 3
//        ↓
//     Avatar 4
//        ↓
//     Avatar 5
//
// Camera movement and avatar performance happen concurrently.
// The avatar performance itself is strictly ordered.
//

async function runOrderedFormationPortrait(
    avatarIndices = ORDERED_AVATAR_SEQUENCE
) {
    validateFormationSelection(avatarIndices);

    let originalStates = null;
    let config = null;

    try {
        // ----------------------------------------------------
        // Apply shared formation
        // ----------------------------------------------------

        originalStates =
            applyOrderedFormation(
                avatarIndices
            );

        prepareOrderedWaitingPose(
            avatarIndices
        );

        // ----------------------------------------------------
        // Get shared formation camera configuration
        // ----------------------------------------------------

        config =
            getOrderedFormationCameraConfig(
                avatarIndices
            );

        applyFormationCameraConfig(config);

        setStatus(
            `${avatarIndices.length} avatars — ` +
            `ordered formation portrait`
        );

        // ----------------------------------------------------
        // Start at CENTER
        // ----------------------------------------------------

        camera.position.copy(
            config.portraitCenterPosition
        );

        camera.lookAt(
            config.target
        );

        // ----------------------------------------------------
        // Camera + ordered avatar performance
        // ----------------------------------------------------
        //
        // The camera moves continuously while
        // runOrderedAvatarSequence() performs:
        //
        // Avatar 1 → Avatar 2 → Avatar 3 → ...
        //
        // These two processes happen at the same time.
        // ----------------------------------------------------

        await Promise.all([
            (async () => {

                // CENTER → LEFT
                await moveFormationCameraTo(
                    config.portraitLeftPosition,
                    900,
                    config.target
                );

                // LEFT → CENTER
                await moveFormationCameraTo(
                    config.portraitCenterPosition,
                    1100,
                    config.target
                );

                // CENTER → RIGHT
                await moveFormationCameraTo(
                    config.portraitRightPosition,
                    1100,
                    config.target
                );

                // RIGHT → CENTER
                await moveFormationCameraTo(
                    config.portraitCenterPosition,
                    900,
                    config.target
                );

            })(),

            // Ordered avatar performance
            runOrderedAvatarSequence(
                avatarIndices
            )
        ]);

    } finally {

        // ----------------------------------------------------
        // Restore original avatar positions/visibility
        // ----------------------------------------------------

        if (originalStates) {
            restoreOrderedFormation(
                originalStates
            );
        }

        if (config) {
            camera.lookAt(
                config.target
            );
        }
    }
}


// ============================================================
// ORDERED FORMATION ELEVATION
// ============================================================
//
// Camera:
//
//     LOW
//       ↓
//     HIGH
//       ↓
//     HERO
//
// Avatar performance:
//
//     Avatar 1
//        ↓
//     Avatar 2
//        ↓
//     Avatar 3
//        ↓
//     Avatar 4
//        ↓
//     Avatar 5
//
// Camera movement and ordered avatar performance happen
// concurrently.
//

async function runOrderedFormationElevation(
    avatarIndices = ORDERED_AVATAR_SEQUENCE
) {
    validateFormationSelection(avatarIndices);

    let originalStates = null;
    let config = null;

    try {
        // ----------------------------------------------------
        // Apply shared formation
        // ----------------------------------------------------

        originalStates =
            applyOrderedFormation(
                avatarIndices
            );

        prepareOrderedWaitingPose(
            avatarIndices
        );

        // ----------------------------------------------------
        // Get shared formation camera configuration
        // ----------------------------------------------------

        config =
            getOrderedFormationCameraConfig(
                avatarIndices
            );

        applyFormationCameraConfig(config);

        setStatus(
            `${avatarIndices.length} avatars — ` +
            `ordered formation elevation`
        );

        // ----------------------------------------------------
        // Start at LOW position
        // ----------------------------------------------------

        camera.position.copy(
            config.elevationLowPosition
        );

        camera.lookAt(
            config.target
        );

        // ----------------------------------------------------
        // Camera + ordered avatar performance
        // ----------------------------------------------------
        //
        // Camera:
        //
        // LOW → HIGH → HERO
        //
        // Avatar:
        //
        // Avatar 1 → Avatar 2 → Avatar 3 → ...
        //
        // Both processes run at the same time.
        // ----------------------------------------------------

        await Promise.all([
            (async () => {

                // LOW → HIGH
                await moveFormationCameraTo(
                    config.elevationHighPosition,
                    1500,
                    config.target
                );

                // HIGH → HERO
                await moveFormationCameraTo(
                    config.heroPosition,
                    1300,
                    config.target
                );

            })(),

            // Ordered avatar performance
            runOrderedAvatarSequence(
                avatarIndices
            )
        ]);

    } finally {

        // ----------------------------------------------------
        // Restore original avatar positions/visibility
        // ----------------------------------------------------

        if (originalStates) {
            restoreOrderedFormation(
                originalStates
            );
        }

        if (config) {
            camera.lookAt(
                config.target
            );
        }
    }
}


// ============================================================
// DIRECTOR / HARD-CODED CAMERA CINEMATIC
// ============================================================
//
// This is intentionally different from the object-driven shots.
//
// Object-driven shots calculate the camera from an object/bone.
// Director shots do NOT do that.
//
// The camera path is authoritative:
//     positions -> camera path
//     targets   -> look-at path
//     fov       -> lens path
//
// Nothing is searched for automatically. An object may be in the
// frame, outside the frame, or completely absent. The shot simply
// follows the coordinates supplied here.
// ============================================================

const DIRECTOR_SHOTS = [

    // --------------------------------------------------------
    // 1. SINGLE AVATAR — APPROACH → PASS → SETTLE → SPEAK → PULL AWAY
    // --------------------------------------------------------
    {
        id: 'DIRECT_AVATAR_SINGLE_CINEMATIC',

        duration: 8.0,

        positions: [
            new THREE.Vector3(
                7.0,
                5.0,
                10.0
            ),
            new THREE.Vector3(
                2.8,
                2.8,
                5.0
            ),
            new THREE.Vector3(
                -1.8,
                2.5,
                2.8
            ),
            new THREE.Vector3(
                1.9,
                2.1,
                3.6
            ),
            new THREE.Vector3(
                4.8,
                3.2,
                7.0
            )
        ],

        targets: [
            new THREE.Vector3(
                0.0,
                1.0,
                1.7
            ),
            new THREE.Vector3(
                -0.3,
                1.4,
                1.7
            ),
            new THREE.Vector3(
                -0.3,
                1.5,
                1.7
            )
        ],

        easing: 'easeInOutCubic',

        fov: [
            52,
            46
        ],

        actionDelay: 3.2,

        avatar: {
            id: 1,
            position: new THREE.Vector3(
                -0.2930,
                0.0000,
                1.6930
            ),
            rotationYDeg: -71,
            scale: 1,
            clip: 'walking',
            speech: 'hello world this is a test',
            gesture: 'nodding_no',
            expression: 'disgusted'
        }
    },


    // --------------------------------------------------------
    // 2. ORDERED MULTI-AVATAR — SPEAKER 1 → SPEAKER 2 → GROUP
    // --------------------------------------------------------
    {
        id: 'DIRECT_AVATAR_DUO_ORDERED_CINEMATIC',

        duration: 9.0,

        positions: [
            new THREE.Vector3(
                6.5,
                4.5,
                7.0
            ),
            new THREE.Vector3(
                3.8,
                3.0,
                4.0
            ),
            new THREE.Vector3(
                1.8,
                2.3,
                3.2
            ),
            new THREE.Vector3(
                3.6,
                2.6,
                4.2
            ),
            new THREE.Vector3(
                5.2,
                3.4,
                6.2
            )
        ],

        targets: [
            new THREE.Vector3(
                0.8,
                1.0,
                1.0
            ),
            new THREE.Vector3(
                0.45,
                1.25,
                1.05
            ),
            new THREE.Vector3(
                0.9,
                1.15,
                1.0
            )
        ],

        easing: 'easeInOutCubic',

        fov: [
            50,
            44
        ],

        actionDelay: 1.8,

        avatars: [
            {
                id: 2,
                position: new THREE.Vector3(
                    0.4420,
                    0.0000,
                    1.0270
                ),
                rotationYDeg: 96,
                scale: 1,
                clip: 'waving',
                speech: 'see you later',
                gesture: 'nodding_no',
                expression: 'sad'
            },
            {
                id: 3,
                position: new THREE.Vector3(
                    1.3200,
                    0.0000,
                    1.0270
                ),
                rotationYDeg: -72,
                scale: 1,
                clip: 'greetings',
                speech: 'i am happy to help you',
                gesture: 'nodding_yes',
                expression: 'angry'
            }
        ],

        clipOrder: 'sequential',
        speechOrder: 'sequential'
    },


    // --------------------------------------------------------
    // 3. SIMULTANEOUS MULTI-AVATAR — CONTINUOUS CENTER MOVE
    // --------------------------------------------------------
    {
        id: 'DIRECT_AVATAR_DUO_SIMULTANEOUS_CINEMATIC',

        duration: 6.5,

        positions: [
            new THREE.Vector3(
                -5.5,
                3.4,
                7.0
            ),
            new THREE.Vector3(
                -2.5,
                2.6,
                4.0
            ),
            new THREE.Vector3(
                0.0,
                2.2,
                3.0
            ),
            new THREE.Vector3(
                2.8,
                2.7,
                4.4
            )
        ],

        targets: [
            new THREE.Vector3(
                0.65,
                1.1,
                1.35
            ),
            new THREE.Vector3(
                0.65,
                1.2,
                1.35
            )
        ],

        easing: 'easeInOutCubic',

        fov: [
            48,
            43
        ],

        avatars: [
            {
                id: 4,
                position: new THREE.Vector3(
                    0.1490,
                    0.0000,
                    1.9050
                ),
                rotationYDeg: 80,
                scale: 1,
                clip: 'HostageIdle',
                speech: 'hello world this is a test',
                gesture: 'nodding_no',
                expression: 'angry'
            },
            {
                id: 5,
                position: new THREE.Vector3(
                    1.3200,
                    0.0000,
                    1.9050
                ),
                rotationYDeg: -57,
                scale: 1,
                clip: 'fastforwarding',
                speech: 'thank you for your time',
                gesture: 'nodding_yes',
                expression: 'angry'
            }
        ],

        clipOrder: 'simultaneous',
        speechOrder: 'simultaneous'
    },


    // --------------------------------------------------------
    // 4. THREE-PERSON GROUP CONVERSATION
    // --------------------------------------------------------
    //
    // Establishing group → speaker → listener → final group.
    // The three avatars use the existing loaded controllers.
    // --------------------------------------------------------
    {
        id: 'DIRECT_AVATAR_GROUP_CONVERSATION',

        duration: 10.5,

        positions: [
            new THREE.Vector3(
                7.5,
                5.2,
                9.0
            ),
            new THREE.Vector3(
                3.2,
                3.1,
                4.2
            ),
            new THREE.Vector3(
                1.2,
                2.4,
                3.1
            ),
            new THREE.Vector3(
                -1.8,
                2.6,
                3.8
            ),
            new THREE.Vector3(
                3.8,
                3.2,
                5.8
            )
        ],

        targets: [
            new THREE.Vector3(
                0.4,
                1.0,
                1.2
            ),
            new THREE.Vector3(
                -0.2,
                1.35,
                1.55
            ),
            new THREE.Vector3(
                1.1,
                1.25,
                1.1
            ),
            new THREE.Vector3(
                0.4,
                1.15,
                1.2
            )
        ],

        easing: 'easeInOutCubic',

        fov: [
            54,
            44
        ],

        actionDelay: 1.5,

        avatars: [
            {
                id: 1,
                position: new THREE.Vector3(
                    -1.35,
                    0.0000,
                    1.65
                ),
                rotationYDeg: -35,
                scale: 1,
                clip: 'walking',
                speech: 'hello world this is a test',
                gesture: 'nodding_no',
                expression: 'disgusted'
            },
            {
                id: 2,
                position: new THREE.Vector3(
                    0.0,
                    0.0000,
                    1.05
                ),
                rotationYDeg: 0,
                scale: 1,
                clip: 'waving',
                speech: 'see you later',
                gesture: 'nodding_no',
                expression: 'sad'
            },
            {
                id: 3,
                position: new THREE.Vector3(
                    1.35,
                    0.0000,
                    1.65
                ),
                rotationYDeg: 35,
                scale: 1,
                clip: 'greetings',
                speech: 'i am happy to help you',
                gesture: 'nodding_yes',
                expression: 'angry'
            }
        ],

        clipOrder: 'sequential',
        speechOrder: 'sequential'
    },


    // --------------------------------------------------------
    // EXISTING EXHIBIT DIRECTOR ACTION
    // --------------------------------------------------------
    {
        id: 'DIRECT_EXHIBIT_ACTION',

        duration: 4.5,

        positions: [
            new THREE.Vector3(
                6.0,
                4.0,
                6.5
            ),
            new THREE.Vector3(
                4.0,
                3.0,
                2.0
            ),
            new THREE.Vector3(
                2.5,
                2.5,
                4.0
            )
        ],

        targets: [
            new THREE.Vector3(
                0.0,
                1.0,
                0.0
            ),
            new THREE.Vector3(
                0.5,
                1.5,
                0.5
            )
        ],

        easing: 'easeInOutCubic',

        fov: [
            50,
            40
        ],

        exhibit: {
            shot: 'GAMING_SETUP_INSPECT'
        }
    }
];

// ============================================================
// DIRECTOR HELPERS
// ============================================================

const DIRECTOR_EASINGS = {

    linear:
        TWEEN.Easing.Linear.None,

    easeInOutCubic:
        TWEEN.Easing.Cubic.InOut,

    easeInCubic:
        TWEEN.Easing.Cubic.In,

    easeOutCubic:
        TWEEN.Easing.Cubic.Out,

    easeInOutQuad:
        TWEEN.Easing.Quadratic.InOut,

    easeInOutQuart:
        TWEEN.Easing.Quartic.InOut
};


function toDirectorVector3(value) {

    if (value instanceof THREE.Vector3) {
        return value.clone();
    }

    if (Array.isArray(value)) {
        return new THREE.Vector3(
            value[0],
            value[1],
            value[2]
        );
    }

    return new THREE.Vector3();
}


function sampleDirectorKeyframes(
    values,
    t
) {

    if (!values || !values.length) {
        return null;
    }

    if (values.length === 1) {
        return values[0].clone
            ? values[0].clone()
            : values[0];
    }

    const scaled =
        THREE.MathUtils.clamp(
            t,
            0,
            1
        ) *
        (values.length - 1);

    const index =
        Math.min(
            Math.floor(scaled),
            values.length - 2
        );

    const localT =
        scaled - index;

    if (
        values[index] instanceof THREE.Vector3
    ) {

        return new THREE.Vector3().lerpVectors(
            values[index],
            values[index + 1],
            localT
        );
    }

    return THREE.MathUtils.lerp(
        values[index],
        values[index + 1],
        localT
    );
}


function prepareDirectorCameraPath(
    shot
) {

    const positions =
        (shot.positions || [])
            .map(toDirectorVector3);

    if (positions.length < 2) {
        throw new Error(
            `${shot.id}: camera path requires at least 2 positions.`
        );
    }

    const targets =
        (shot.targets || [])
            .map(toDirectorVector3);

    if (targets.length < 1) {
        throw new Error(
            `${shot.id}: camera path requires at least 1 target.`
        );
    }

    const fovs =
        shot.fov === undefined
            ? null
            : Array.isArray(shot.fov)
                ? shot.fov.slice()
                : [shot.fov];

    const curve =
        positions.length === 2
            ? null
            : new THREE.CatmullRomCurve3(
                positions,
                false,
                'centripetal',
                0.5
            );

    return {
        positions,
        targets,
        fovs,
        curve
    };
}


function getDirectorCameraPosition(
    path,
    t
) {

    if (!path.curve) {

        return new THREE.Vector3().lerpVectors(
            path.positions[0],
            path.positions[1],
            t
        );
    }

    return path.curve.getPointAt(
        THREE.MathUtils.clamp(t, 0, 1)
    );
}


function runDirectorCameraPath(
    shot
) {

    const path =
        prepareDirectorCameraPath(
            shot
        );

    const duration =
        Math.max(
            0,
            Number(shot.duration || 0)
        ) * 1000;

    const easing =
        DIRECTOR_EASINGS[
            shot.easing || 'easeInOutCubic'
        ] ||
        TWEEN.Easing.Cubic.InOut;

    const state = {
        t: 0
    };

    const startFov =
        camera.fov;

    return new Promise(
        resolve => {

            new TWEEN.Tween(state)
                .to(
                    {
                        t: 1
                    },
                    duration
                )
                .easing(easing)
                .onUpdate(() => {

                    const t = state.t;

                    camera.position.copy(
                        getDirectorCameraPosition(
                            path,
                            t
                        )
                    );

                    const target =
                        sampleDirectorKeyframes(
                            path.targets,
                            t
                        );

                    camera.lookAt(
                        target
                    );

                    if (path.fovs) {

                        const fov =
                            path.fovs.length === 1
                                ? path.fovs[0]
                                : THREE.MathUtils.lerp(
                                    path.fovs[0],
                                    path.fovs[path.fovs.length - 1],
                                    t
                                );

                        camera.fov = fov;
                        camera.updateProjectionMatrix();
                    }
                })
                .onComplete(() => {

                    camera.position.copy(
                        getDirectorCameraPosition(
                            path,
                            1
                        )
                    );

                    const finalTarget =
                        sampleDirectorKeyframes(
                            path.targets,
                            1
                        );

                    camera.lookAt(
                        finalTarget
                    );

                    if (path.fovs) {

                        camera.fov =
                            path.fovs.length === 1
                                ? path.fovs[0]
                                : path.fovs[
                                    path.fovs.length - 1
                                ];

                        camera.updateProjectionMatrix();
                    } else {

                        camera.fov = startFov;
                        camera.updateProjectionMatrix();
                    }

                    resolve();
                })
                .start();
        }
    );
}


function getDirectorAvatarController(
    id
) {

    return avatarControllers.find(
        controller =>
            controller.id === id
    );
}


function applyDirectorAvatarState(
    controller,
    config
) {

    if (!controller || !config) {
        return;
    }

    if (config.position) {
        controller.model.position.copy(
            toDirectorVector3(
                config.position
            )
        );
    }

    if (config.rotationYDeg !== undefined) {
        controller.model.rotation.y =
            THREE.MathUtils.degToRad(
                config.rotationYDeg
            );
    }

    if (config.scale !== undefined) {
        controller.model.scale.setScalar(
            config.scale
        );
    }

    if (config.expression) {
        controller.expressionDriver.apply(
            config.expression
        );
    }

    if (config.gesture) {
        controller.enableGesture();
        controller.gestureDriver.setGesture(
            config.gesture
        );
    }
}


function beginDirectorAvatarAction(
    controller,
    config
) {

    if (!controller) {
        return Promise.resolve();
    }

    applyDirectorAvatarState(
        controller,
        config
    );

    if (config.gesture) {
        controller.enableGesture();
        controller.gestureDriver.setGesture(
            config.gesture
        );
    }

    if (config.expression) {
        controller.expressionDriver.apply(
            config.expression
        );
    }

    controller.playClip(
        config.clip ||
        controller.definition.clip
    );

    if (!config.speech) {
        return Promise.resolve();
    }

    return controller.speechDriver.speak(
        config.speech
    );
}


async function finishDirectorAvatarAction(
    controller,
    config
) {

    if (!controller) {
        return;
    }

    controller.stopBodyAnimation();

    await new Promise(
        resolve =>
            setTimeout(
                resolve,
                CROSSFADE_MS
            )
    );

    if (config.gesture) {
        controller.enableGesture();
        controller.gestureDriver.setGesture(
            config.gesture
        );
    } else {
        controller.enableGesture();
    }
}


async function runDirectorAvatarSequence(
    shot
) {

    if (shot.avatar) {

        const controller =
            getDirectorAvatarController(
                shot.avatar.id
            );

        if (!controller) {
            throw new Error(
                `${shot.id}: Avatar ${shot.avatar.id} is not loaded.`
            );
        }

        applyDirectorAvatarState(
            controller,
            shot.avatar
        );

        await beginDirectorAvatarAction(
            controller,
            shot.avatar
        );

        await finishDirectorAvatarAction(
            controller,
            shot.avatar
        );

        return;
    }

    const avatarConfigs =
        shot.avatars || [];

    if (!avatarConfigs.length) {
        return;
    }

    const controllers =
        avatarConfigs.map(config => {
            const controller =
                getDirectorAvatarController(
                    config.id
                );

            if (!controller) {
                throw new Error(
                    `${shot.id}: Avatar ${config.id} is not loaded.`
                );
            }

            applyDirectorAvatarState(
                controller,
                config
            );

            return {
                controller,
                config
            };
        });

    const clipOrder =
        shot.clipOrder || 'simultaneous';

    const speechOrder =
        shot.speechOrder || clipOrder;

    if (
        clipOrder === 'sequential' ||
        speechOrder === 'sequential'
    ) {

        for (const item of controllers) {

            const config = item.config;
            const controller = item.controller;

            if (config.gesture) {
                controller.enableGesture();
                controller.gestureDriver.setGesture(
                    config.gesture
                );
            }

            if (config.expression) {
                controller.expressionDriver.apply(
                    config.expression
                );
            }

            controller.playClip(
                config.clip ||
                controller.definition.clip
            );

            if (config.speech) {
                await controller.speechDriver.speak(
                    config.speech
                );
            }

            await finishDirectorAvatarAction(
                controller,
                config
            );
        }

        return;
    }

    // Simultaneous action: all clips, gestures and speeches start
    // together, then the whole group completes together.
    const speechPromises = [];

    for (const item of controllers) {

        const config = item.config;
        const controller = item.controller;

        if (config.gesture) {
            controller.enableGesture();
            controller.gestureDriver.setGesture(
                config.gesture
            );
        }

        if (config.expression) {
            controller.expressionDriver.apply(
                config.expression
            );
        }

        controller.playClip(
            config.clip ||
            controller.definition.clip
        );

        if (config.speech) {
            speechPromises.push(
                controller.speechDriver.speak(
                    config.speech
                )
            );
        }
    }

    await Promise.all(
        speechPromises
    );

    await Promise.all(
        controllers.map(item =>
            finishDirectorAvatarAction(
                item.controller,
                item.config
            )
        )
    );
}


async function runDirectorExhibitAction(
    shot
) {

    if (!shot.exhibit || !exhibitController) {
        return;
    }

    const shotName =
        shot.exhibit.shot;

    if (!shotName) {
        return;
    }

    exhibitController.playShot(
        shotName
    );
}


async function runDirectorShot(
    shot
) {

    if (!shot) {
        return;
    }

    setStatus(
        `Director shot → ${shot.id}`
    );

    const actionPromise =
        new Promise(async resolve => {

            const delayMs =
                Math.max(0, Number(shot.actionDelay || 0)) * 1000;

            if (delayMs > 0) {
                await new Promise(
                    delayResolve =>
                        setTimeout(delayResolve, delayMs)
                );
            }

            await Promise.all([
                runDirectorAvatarSequence(shot),
                runDirectorExhibitAction(shot)
            ]);

            resolve();
        });

    const cameraPromise =
        runDirectorCameraPath(shot);

    // The camera has its own hard-coded duration. Actions are
    // allowed to finish naturally so speech is never cut merely
    // because the camera reached its endpoint.
    await Promise.all([
        cameraPromise,
        actionPromise
    ]);
}


async function runDirectorCinematic() {

    setStatus(
        'Director cinematic'
    );

    for (const shot of DIRECTOR_SHOTS) {

        await runDirectorShot(
            shot
        );
    }
}


// ============================================================
// FINAL RISE
// ============================================================

function runFinalCameraSequence() {

    return new Promise(
        async resolve => {

            setStatus(
                'Final camera rise'
            );


            await moveCameraTo(
                new THREE.Vector3(
                    0,
                    10,
                    13
                ),
                2500,
                FORMATION_CENTER
            );


            setStatus(
                'Final formation view'
            );


            await moveCameraTo(
                new THREE.Vector3(
                    6,
                    3.5,
                    9
                ),
                3500,
                FORMATION_CENTER
            );


            controls.enabled = true;

            setStatus(
                'Cinematic complete'
            );

            resolve();
        }
    );
}


// ============================================================
// FORD RAPTOR CONTROLLER
// ============================================================
//
// Completely separate from AvatarController.
//
// The important design detail is that the wheel action is
// maintained separately from the current showroom action.
//
// Therefore:
//
// Wheels_Spin_Forward
//        +
// Door_Right_Open
//
// can run simultaneously.
//
// Changing the door / bonnet / tailgate / steering / brake
// action never stops the wheel action.
// ============================================================

class CarController {

    constructor(
        definition,
        gltf
    ) {

        this.definition =
            definition;

        this.model =
            gltf.scene;

        this.animations =
            gltf.animations || [];

        this.mixer =
            new THREE.AnimationMixer(
                this.model
            );


        // ----------------------------------------------------
        // ACTION STORAGE
        // ----------------------------------------------------

        this.actions =
            new Map();


        // Current showroom action only.
        this.currentShotAction =
            null;


        // Independent wheel action.
        this.wheelAction =
            null;


        // ----------------------------------------------------
        // TRANSFORM
        // ----------------------------------------------------

        this.model.position.set(
            ...definition.position
        );

        this.model.rotation.set(
            ...definition.rotation
        );

        this.model.scale.setScalar(
            definition.scale
        );


        // ----------------------------------------------------
        // SHADOWS
        // ----------------------------------------------------

        this.model.traverse(object => {

            if (object.isMesh) {

                object.castShadow = true;

                object.receiveShadow = true;
            }
        });


        // ----------------------------------------------------
        // ANIMATION ACTIONS
        // ----------------------------------------------------

        for (
            const clip of this.animations
        ) {

            const action =
                this.mixer.clipAction(
                    clip
                );

            this.actions.set(
                clip.name,
                action
            );
        }


        console.log(
            'Ford Raptor clips:',
            this.animations.map(
                clip => clip.name
            )
        );
    }


    // --------------------------------------------------------
    // PLAY SHOWROOM CLIP
    // --------------------------------------------------------

    playClip(
        clipName,
        fadeDuration = 0.2
    ) {

        const nextAction =
            this.actions.get(
                clipName
            );

        if (!nextAction) {

            console.warn(
                `Ford Raptor: ` +
                `clip "${clipName}" not found`
            );

            return null;
        }


        // Do not interfere with the wheel action.
        if (
            nextAction ===
            this.wheelAction
        ) {

            return nextAction;
        }


        // Stop the previous showroom action
        // from influencing the car.
        if (
            this.currentShotAction &&
            this.currentShotAction !== nextAction
        ) {

            this.currentShotAction
                .fadeOut(
                    fadeDuration
                );
        }


        // This is a showroom action.
        nextAction
            .reset()
            .setLoop(
                THREE.LoopOnce,
                1
            );

        nextAction.clampWhenFinished =
            true;

        nextAction
            .fadeIn(
                fadeDuration
            )
            .play();


        this.currentShotAction =
            nextAction;


        return nextAction;
    }


    // --------------------------------------------------------
    // PLAY NAMED SHOWROOM SHOT
    // --------------------------------------------------------

    playShot(
        shotName,
        fadeDuration = 0.2
    ) {

        const shot =
            this.definition.shots[
                shotName
            ];

        if (!shot) {

            console.warn(
                `Ford Raptor: ` +
                `shot "${shotName}" not found`
            );

            return null;
        }


        return this.playClip(
            shot.clip,
            fadeDuration
        );
    }


    // --------------------------------------------------------
    // WHEEL SPIN
    // --------------------------------------------------------

    startWheelSpin() {

        const action =
            this.actions.get(
                'Wheels_Spin_Forward'
            );

        if (!action) {

            console.warn(
                'Ford Raptor: Wheels_Spin_Forward not found'
            );

            return;
        }


        this.wheelAction =
            action;


        // Important:
        // This action is independent from the
        // showroom currentShotAction.

        action
            .reset()
            .setLoop(
                THREE.LoopRepeat,
                Infinity
            );

        action.clampWhenFinished =
            false;

        action.play();


        console.log(
            'Ford Raptor wheels spinning'
        );
    }


    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    update(delta) {

        this.mixer.update(
            delta
        );
    }
}


// ============================================================
// CAR STORAGE
// ============================================================

let carController = null;


// ============================================================
// LOAD FORD RAPTOR
// ============================================================

async function loadCar() {

    setStatus(
        'Loading Ford Raptor...'
    );


    const gltf =
        await loader.loadAsync(
            CAR_DEFINITION.path
        );


    carController =
        new CarController(
            CAR_DEFINITION,
            gltf
        );


    scene.add(
        carController.model
    );


    console.log(
        'Ford Raptor loaded'
    );


    console.log(
        'Ford Raptor animations:',
        carController.animations.map(
            clip => clip.name
        )
    );


    // --------------------------------------------------------
    // KEEP WHEELS SPINNING
    // --------------------------------------------------------

    carController.startWheelSpin();
}


// ============================================================
// CAR CAMERA TARGET
// ============================================================

const CAR_CAMERA_TARGET =
    new THREE.Vector3(
        0,
        0.5,
        0
    );


// ============================================================
// CAR CAMERA MOVE
// ============================================================
//
// Same generic camera movement style as the avatar system.
// ============================================================

function moveCameraToCarPosition(
    position,
    duration,
    target = CAR_CAMERA_TARGET
) {

    return new Promise(
        resolve => {

            const start =
                camera.position.clone();

            const destination =
                position.clone();

            const tweenObject = {
                t: 0
            };


            new TWEEN.Tween(
                tweenObject
            )
                .to(
                    {
                        t: 1
                    },
                    duration
                )
                .easing(
                    TWEEN.Easing.Cubic.InOut
                )
                .onUpdate(() => {

                    camera.position
                        .lerpVectors(
                            start,
                            destination,
                            tweenObject.t
                        );

                    camera.lookAt(
                        target
                    );
                })
                .onComplete(() => {

                    camera.position.copy(
                        destination
                    );

                    camera.lookAt(
                        target
                    );

                    resolve();
                })
                .start();
        }
    );
}


// ============================================================
// CAR ORBIT CAMERA
// ============================================================

function runCarOrbit() {

    return new Promise(
        resolve => {

            const shot =
                CAR_DEFINITION
                    .shots
                    .CAR_ORBIT;

            const config =
                shot.camera;


            const orbitState = {
                angle:
                    Math.atan2(
                        camera.position.x -
                        CAR_CAMERA_TARGET.x,

                        camera.position.z -
                        CAR_CAMERA_TARGET.z
                    )
            };


            const radius =
                config.radius;


            const duration =
                config.duration;


            const height =
                config.height;


            const verticalAmplitude =
                config.verticalAmplitude;


            const totalAngle =
                Math.PI *
                2 *
                config.revolutions;


            new TWEEN.Tween(
                orbitState
            )
                .to(
                    {
                        angle:
                            orbitState.angle +
                            totalAngle
                    },
                    duration
                )
                .easing(
                    TWEEN.Easing.Linear.None
                )
                .onUpdate(() => {

                    const angle =
                        orbitState.angle;


                    camera.position.x =
                        CAR_CAMERA_TARGET.x +
                        Math.sin(angle) *
                        radius;


                    camera.position.z =
                        CAR_CAMERA_TARGET.z +
                        Math.cos(angle) *
                        radius;


                    camera.position.y =
                        height +
                        Math.sin(
                            angle * 2
                        ) *
                        verticalAmplitude;


                    camera.lookAt(
                        CAR_CAMERA_TARGET
                    );
                })
                .onComplete(() => {

                    camera.lookAt(
                        CAR_CAMERA_TARGET
                    );

                    resolve();
                })
                .start();
        }
    );
}


// ============================================================
// CAR BOUNCE
// ============================================================
//
// The original showroom bounce was:
//
// Y = 0
//   ↓
// Y = 0.15
//   ↓
// Y = 0
//
// Here the car itself performs that bounce while the camera
// holds a close showroom position and adds a subtle matching
// camera bounce.
// ============================================================

function runCarBounce() {

    return new Promise(
        async resolve => {

            const shot =
                CAR_DEFINITION
                    .shots
                    .CAR_BOUNCE;

            const config =
                shot.camera;


            // ------------------------------------------------
            // Move camera into bounce composition
            // ------------------------------------------------

            await moveCameraToCarPosition(
                new THREE.Vector3(
                    ...config.position
                ),
                1200,
                new THREE.Vector3(
                    ...config.target
                )
            );


            // ------------------------------------------------
            // Car bounce
            // ------------------------------------------------

            const carStartY =
                carController.model.position.y;

            const bounceState = {
                y: carStartY
            };


            // ------------------------------------------------
            // Camera bounce
            // ------------------------------------------------

            const cameraStartY =
                camera.position.y;


            const bounceStateCamera = {
                t: 0
            };


            const bounceAmount =
                config.bounceAmount;


            const bounceDuration =
                config.bounceDuration;


            new TWEEN.Tween(
                bounceState
            )
                .to(
                    {
                        y:
                            carStartY +
                            bounceAmount
                    },
                    bounceDuration
                )
                .easing(
                    TWEEN.Easing.Cubic.Out
                )
                .yoyo(true)
                .repeat(1)
                .onUpdate(() => {

                    carController
                        .model
                        .position
                        .y =
                        bounceState.y;
                })
                .onComplete(() => {

                    carController
                        .model
                        .position
                        .y =
                        carStartY;
                })
                .start();


            // ------------------------------------------------
            // Camera bounce
            // ------------------------------------------------

            new TWEEN.Tween(
                bounceStateCamera
            )
                .to(
                    {
                        t: 1
                    },
                    bounceDuration * 2
                )
                .easing(
                    TWEEN.Easing.Cubic.InOut
                )
                .onUpdate(() => {

                    const t =
                        bounceStateCamera.t;

                    const offset =
                        Math.sin(
                            t * Math.PI
                        ) *
                        bounceAmount;

                    camera.position.y =
                        cameraStartY +
                        offset;

                    camera.lookAt(
                        CAR_CAMERA_TARGET
                    );
                })
                .onComplete(() => {

                    camera.position.y =
                        cameraStartY;

                    camera.lookAt(
                        CAR_CAMERA_TARGET
                    );

                    resolve();
                })
                .start();
        }
    );
}


// ============================================================
// RUN ONE FORD RAPTOR SHOT
// ============================================================
//
// This is the central car-shot dispatcher.
//
// CAR_APPROACH
//     ↓
// CAR_ORBIT
//     ↓
// FRONT_LEFT_TYRE
//     ↓
// REAR_RIGHT_TYRE
//     ↓
// CAR_BOUNCE
//     ↓
// CAR_RISE
//
// Every car shot owns its own camera movement.
// ============================================================

async function runCarShot(
    shotName
) {

    if (!carController) {

        console.warn(
            'Ford Raptor controller is not loaded.'
        );

        return;
    }


    const shot =
        CAR_DEFINITION.shots[
            shotName
        ];


    if (!shot) {

        console.warn(
            `Ford Raptor shot "${shotName}" not found`
        );

        return;
    }


    console.log(
        `Ford Raptor → ${shotName}`
    );


    setStatus(
        `Ford Raptor → ${shotName}`
    );


    // ========================================================
    // START THE CAR ANIMATION
    // ========================================================

    carController.playShot(
        shotName
    );


    // ========================================================
    // CAR APPROACH
    // ========================================================

    if (
        shotName ===
        'CAR_APPROACH'
    ) {

        const config =
            shot.camera;


        await moveCameraToCarPosition(

            new THREE.Vector3(
                ...config.position
            ),

            config.duration,

            new THREE.Vector3(
                ...config.target
            )
        );


        return;
    }


    // ========================================================
    // CAR ORBIT
    // ========================================================

    if (
        shotName ===
        'CAR_ORBIT'
    ) {

        await runCarOrbit();

        return;
    }


    // ========================================================
    // FRONT-LEFT TYRE
    // ========================================================

    if (
        shotName ===
        'FRONT_LEFT_TYRE'
    ) {

        const config =
            shot.camera;


        await moveCameraToCarPosition(

            new THREE.Vector3(
                ...config.position
            ),

            config.duration,

            new THREE.Vector3(
                ...config.target
            )
        );


        return;
    }


    // ========================================================
    // REAR-RIGHT TYRE
    // ========================================================

    if (
        shotName ===
        'REAR_RIGHT_TYRE'
    ) {

        const config =
            shot.camera;


        await moveCameraToCarPosition(

            new THREE.Vector3(
                ...config.position
            ),

            config.duration,

            new THREE.Vector3(
                ...config.target
            )
        );


        return;
    }


    // ========================================================
    // CAR BOUNCE
    // ========================================================

    if (
        shotName ===
        'CAR_BOUNCE'
    ) {

        await runCarBounce();

        return;
    }


    // ========================================================
    // CAR RISE
    // ========================================================

    if (
        shotName ===
        'CAR_RISE'
    ) {

        const config =
            shot.camera;


        await moveCameraToCarPosition(

            new THREE.Vector3(
                ...config.position
            ),

            config.duration,

            new THREE.Vector3(
                ...config.target
            )
        );


        return;
    }
}


// ============================================================
// COMPLETE FORD RAPTOR SHOWROOM
// ============================================================
//
// This is deliberately separate from the avatar pipeline.
//
// The avatar controller does not know the car exists.
// The car controller does not know the avatars exist.
// Only runCinematic() coordinates both.
// ============================================================

async function runFordRaptorShowroom() {

    console.log(
        '========================================'
    );

    console.log(
        'FORD RAPTOR SHOWROOM START'
    );

    console.log(
        '========================================'
    );


    // --------------------------------------------------------
    // CAR APPROACH
    // --------------------------------------------------------

    await runCarShot(
        'CAR_APPROACH'
    );


    // --------------------------------------------------------
    // CAR ORBIT
    // --------------------------------------------------------

    await runCarShot(
        'CAR_ORBIT'
    );


    // --------------------------------------------------------
    // FRONT-LEFT TYRE
    // --------------------------------------------------------

    await runCarShot(
        'FRONT_LEFT_TYRE'
    );


    // --------------------------------------------------------
    // REAR-RIGHT TYRE
    // --------------------------------------------------------

    await runCarShot(
        'REAR_RIGHT_TYRE'
    );


    // --------------------------------------------------------
    // CAR BOUNCE
    // --------------------------------------------------------

    await runCarShot(
        'CAR_BOUNCE'
    );


    // --------------------------------------------------------
    // CAR RISE
    // --------------------------------------------------------

    await runCarShot(
        'CAR_RISE'
    );


    console.log(
        '========================================'
    );

    console.log(
        'FORD RAPTOR SHOWROOM COMPLETE'
    );

    console.log(
        '========================================'
    );
}


// ============================================================
// EXHIBIT STAND DEFINITIONS
// ============================================================
//
// The exhibit stand is now composed of FIVE independent GLBs.
//
//     exhibitStand.glb
//     metal_door_rigged.glb
//     gaming_setup.glb
//     panel.glb
//     wallboard.glb
//
// Each GLB gets its own ExhibitController.
//
// Inspection can target either:
//
//     1. the entire GLB
//     2. a specific mesh inside a GLB
//
// Currently animated:
//
//     metal_door_rigged.glb → Door_Open
//     exhibitStand.glb mesh_77 → Door_Close
//
// Everything else has no clip yet.
//

const EXHIBIT_DEFINITIONS = [

    // ========================================================
    // MAIN EXHIBIT STAND
    // ========================================================

    {
        id: 'exhibitStand',

        path: './exhibitStand.glb',

        position: [
            0,
            0,
            0
        ],

        rotation: [
            0,
            0,
            0
        ],

        scale: 1
    },


    // ========================================================
    // METAL DOOR
    // ========================================================

    {
        id: 'metal_door_rigged',

        path: './metal_door_rigged.glb',

        position: [
            -2.4,
            0,
            0.7
        ],

        rotation: [
            0,
            0,
            0
        ],

        scale: 1
    },


    // ========================================================
    // GAMING SETUP
    // ========================================================

    {
        id: 'gaming_setup',

        path: './gaming_setup.glb',

        position: [
            2.4,
            0,
            0.7
        ],

        rotation: [
            0,
            0,
            0
        ],

        scale: 1
    },


    // ========================================================
    // PANEL
    // ========================================================

    {
        id: 'panel',

        path: './panel.glb',

        position: [
            -2.4,
            0,
            -2.2
        ],

        rotation: [
            0,
            0,
            0
        ],

        scale: 1
    },


    // ========================================================
    // WALLBOARD
    // ========================================================

    {
        id: 'wallboard',

        path: './wallboard.glb',

        position: [
            2.4,
            0,
            -2.2
        ],

        rotation: [
            0,
            0,
            0
        ],

        scale: 1
    }

];


// ============================================================
// EXHIBIT SHOT DEFINITIONS
// ============================================================
//
// `target` is deliberately the actual GLB filename for
// whole-GLB inspections.
//
// For mesh inspections:
//
//     target: 'mesh_77'
//     target: 'mesh_79'
//
// `asset` tells the inspection system which GLB contains
// that mesh.
//
// Only shots with an actual animation receive `clip`.
//

const EXHIBIT_SHOTS = {

    // ========================================================
    // MAIN EXHIBIT
    // ========================================================

    ROOM_APPROACH: {

        asset: 'exhibitStand.glb',

        target: 'exhibitStand.glb'
    },


    ROOM_ORBIT: {

        asset: 'exhibitStand.glb',

        target: 'exhibitStand.glb'
    },


    // --------------------------------------------------------
    // MESH 77
    // --------------------------------------------------------
    //
    // Confirmed available in exhibitStand.glb.
    //
    // Animated with Door_Close.
    //

    MESH_77_INSPECT: {

        asset: 'exhibitStand.glb',

        target: 'mesh_77',

        clip: 'Door_Close'
    },


    // --------------------------------------------------------
    // MESH 79
    // --------------------------------------------------------
    //
    // Confirmed available in exhibitStand.glb.
    //
    // No animation yet.
    //

    MESH_79_INSPECT: {

        asset: 'exhibitStand.glb',

        target: 'mesh_79'
    },


    // ========================================================
    // METAL DOOR GLB
    // ========================================================
    //
    // Whole GLB inspection.
    //
    // Animated with Door_Open.
    //

    METAL_DOOR_INSPECT: {

        asset: 'metal_door_rigged.glb',

        target: 'metal_door_rigged.glb',

        clip: 'Door_Open'
    },


    // ========================================================
    // GAMING SETUP GLB
    // ========================================================
    //
    // Whole GLB inspection.
    //
    // No animation yet.
    //

    GAMING_SETUP_INSPECT: {

        asset: 'gaming_setup.glb',

        target: 'gaming_setup.glb'
    },


    // ========================================================
    // PANEL GLB
    // ========================================================
    //
    // Whole GLB inspection.
    //
    // No animation yet.
    //

    PANEL_INSPECT: {

        asset: 'panel.glb',

        target: 'panel.glb'
    },


    // ========================================================
    // WALLBOARD GLB
    // ========================================================
    //
    // Whole GLB inspection.
    //
    // No animation yet.
    //

    WALLBOARD_INSPECT: {

        asset: 'wallboard.glb',

        target: 'wallboard.glb'
    }

};


// ============================================================
// EXHIBIT CONTROLLER
// ============================================================
//
// One controller per GLB.
//
// This is now structurally similar to:
//
//     AvatarController
//
// Each controller owns:
//
//     model
//     animations
//     mixer
//     actions
//     currentAction
//
// Therefore animations from one exhibit GLB cannot accidentally
// be searched for on another exhibit GLB.
//

class ExhibitController {

    constructor(
        definition,
        gltf
    ) {

        this.definition =
            definition;


        this.id =
            definition.id;


        this.path =
            definition.path;


        this.model =
            gltf.scene;


        this.animations =
            gltf.animations || [];


        this.parser =
            gltf.parser;


        // ----------------------------------------------------
        // ANIMATION MIXER
        // ----------------------------------------------------

        this.mixer =
            new THREE.AnimationMixer(
                this.model
            );


        this.actions =
            new Map();


        this.currentAction =
            null;


        // ----------------------------------------------------
        // TRANSFORM
        // ----------------------------------------------------

        this.model.position.set(
            ...definition.position
        );


        this.model.rotation.set(
            ...definition.rotation
        );


        this.model.scale.setScalar(
            definition.scale
        );


        // ----------------------------------------------------
        // SHADOWS
        // ----------------------------------------------------

        this.model.traverse(
            object => {

                if (object.isMesh) {

                    object.castShadow = true;

                    object.receiveShadow = true;
                }
            }
        );


        // ----------------------------------------------------
        // ANIMATION ACTIONS
        // ----------------------------------------------------

        for (
            const clip
            of this.animations
        ) {

            const action =
                this.mixer.clipAction(
                    clip
                );


            action.loop =
                THREE.LoopRepeat;


            action.clampWhenFinished =
                false;


            this.actions.set(
                clip.name,
                action
            );
        }


        // ----------------------------------------------------
        // DEBUG INFORMATION
        // ----------------------------------------------------

        console.log(
            `Exhibit loaded: ${this.id}`
        );


        console.log(
            `Exhibit path: ${this.path}`
        );


        console.log(
            'Exhibit animations:',
            this.animations.map(
                clip => clip.name
            )
        );


        console.log(
            'Exhibit objects:',
            this.getNamedObjects()
        );
    }


    // ========================================================
    // FIND OBJECT
    // ========================================================

    findObject(
        name
    ) {

        let result =
            null;


        this.model.traverse(
            object => {

                if (
                    !result &&
                    object.name === name
                ) {

                    result = object;
                }
            }
        );


        return result;
    }


    // ========================================================
    // GET ALL OBJECTS WITH A NAME
    // ========================================================

    getObjectsByName(
        name
    ) {

        const objects = [];


        this.model.traverse(
            object => {

                if (
                    object.name === name
                ) {

                    objects.push(
                        object
                    );
                }
            }
        );


        return objects;
    }


    // ========================================================
    // GET NAMED OBJECTS
    // ========================================================

    getNamedObjects() {

        const objects = [];


        this.model.traverse(
            object => {

                if (
                    object.name
                ) {

                    objects.push(
                        object.name
                    );
                }
            }
        );


        return objects;
    }


    // ========================================================
    // GET GLTF NODE
    // ========================================================

    async getGLTFNode(
        nodeIndex
    ) {

        if (
            !this.parser
        ) {

            return null;
        }


        try {

            return await this.parser.getDependency(
                'node',
                nodeIndex
            );

        } catch (error) {

            console.warn(
                `Failed to retrieve GLTF node ${nodeIndex}`,
                error
            );

            return null;
        }
    }


    // ========================================================
    // PLAY CLIP
    // ========================================================

    playClip(
        clipName,
        fadeDuration = CROSSFADE_MS / 1000
    ) {

        if (!clipName) {

            return null;
        }


        const nextAction =
            this.actions.get(
                clipName
            );


        if (!nextAction) {

            console.warn(
                `Exhibit ${this.id}: ` +
                `clip "${clipName}" not found`
            );

            return null;
        }


        // ----------------------------------------------------
        // SAME ACTION
        // ----------------------------------------------------

        if (
            this.currentAction ===
            nextAction
        ) {

            return nextAction;
        }


        // ----------------------------------------------------
        // CROSSFADE
        // ----------------------------------------------------

        if (
            this.currentAction
        ) {

            nextAction
                .reset()
                .fadeIn(
                    fadeDuration
                );


            this.currentAction
                .fadeOut(
                    fadeDuration
                );

        } else {

            nextAction
                .reset()
                .fadeIn(
                    fadeDuration
                );
        }


        nextAction.play();


        this.currentAction =
            nextAction;


        return nextAction;
    }


    // ========================================================
    // PLAY NAMED SHOT
    // ========================================================

    playShot(
        shotName
    ) {

        const shot =
            EXHIBIT_SHOTS[
                shotName
            ];


        if (!shot) {

            console.warn(
                `Exhibit shot "${shotName}" not found`
            );

            return null;
        }


        // ----------------------------------------------------
        // No clip means this is currently a camera-only shot.
        // ----------------------------------------------------

        if (!shot.clip) {

            return null;
        }


        return this.playClip(
            shot.clip
        );
    }


    // ========================================================
    // UPDATE
    // ========================================================

    update(
        delta
    ) {

        this.mixer.update(
            delta
        );
    }
}


// ============================================================
// EXHIBIT STORAGE
// ============================================================
//
// Instead of:
//
//     let exhibitController = null;
//
// we now have one controller for each GLB.
//

const exhibitControllers =
    new Map();


// ============================================================
// GET EXHIBIT CONTROLLER
// ============================================================

function getExhibitController(
    assetPath
) {

    return exhibitControllers.get(
        assetPath
    ) || null;
}


// ============================================================
// LOAD EXHIBIT STAND
// ============================================================
//
// Loads all five GLBs independently.
//
// This deliberately follows the same definition-driven pattern
// as the avatar loader.
//

async function loadExhibitStand() {

    setStatus(
        'Loading exhibit stand...'
    );


    for (
        const definition
        of EXHIBIT_DEFINITIONS
    ) {

        try {

            setStatus(
                `Loading ${definition.path}...`
            );


            const gltf =
                await loader.loadAsync(
                    definition.path
                );


            const controller =
                new ExhibitController(
                    definition,
                    gltf
                );


            scene.add(
                controller.model
            );


            exhibitControllers.set(
                definition.path,
                controller
            );


            console.log(
                `Exhibit asset loaded: ` +
                `${definition.path}`
            );

        } catch (error) {

            console.error(
                `Failed to load exhibit asset: ` +
                `${definition.path}`,
                error
            );


            showError(
                `Exhibit loading failed:\n` +
                `${definition.path}\n\n` +
                `${error}`
            );


            throw error;
        }
    }


    // --------------------------------------------------------
    // VERIFY ALL FIVE ASSETS
    // --------------------------------------------------------

    console.log(
        '========================================'
    );


    console.log(
        'EXHIBIT ASSETS LOADED'
    );


    for (
        const [
            path,
            controller
        ]
        of exhibitControllers
    ) {

        console.log(
            path,
            controller
        );
    }


    console.log(
        '========================================'
    );


    // --------------------------------------------------------
    // VERIFY IMPORTANT MAIN-STAND MESHES
    // --------------------------------------------------------

    const mainExhibit =
        getExhibitController(
            './exhibitStand.glb'
        );


    if (mainExhibit) {

        console.log(
            'mesh_77:',
            mainExhibit.findObject(
                'mesh_77'
            )
        );


        console.log(
            'mesh_79:',
            mainExhibit.findObject(
                'mesh_79'
            )
        );
    }


    // --------------------------------------------------------
    // VERIFY SPLIT GLBS
    // --------------------------------------------------------

    console.log(
        'metal_door_rigged.glb:',
        getExhibitController(
            './metal_door_rigged.glb'
        )
    );


    console.log(
        'gaming_setup.glb:',
        getExhibitController(
            './gaming_setup.glb'
        )
    );


    console.log(
        'panel.glb:',
        getExhibitController(
            './panel.glb'
        )
    );


    console.log(
        'wallboard.glb:',
        getExhibitController(
            './wallboard.glb'
        )
    );
}


// ============================================================
// EXHIBIT CAMERA TARGET HELPERS
// ============================================================


// ============================================================
// GET EXHIBIT ROOM CENTER
// ============================================================
//
// The room center is calculated from ALL five loaded exhibit
// assets rather than only exhibitStand.glb.
//

function getExhibitRoomCenter() {

    const box =
        new THREE.Box3();


    let found =
        false;


    for (
        const controller
        of exhibitControllers.values()
    ) {

        if (
            !controller.model.visible
        ) {

            continue;
        }


        box.expandByObject(
            controller.model
        );


        found =
            true;
    }


    if (!found) {

        return new THREE.Vector3(
            0,
            1,
            0
        );
    }


    return box.getCenter(
        new THREE.Vector3()
    );
}


// ============================================================
// OBJECT WORLD CENTER
// ============================================================

function getObjectWorldCenter(
    object
) {

    if (!object) {

        return getExhibitRoomCenter();
    }


    const box =
        new THREE.Box3()
            .setFromObject(
                object
            );


    return box.getCenter(
        new THREE.Vector3()
    );
}


// ============================================================
// GET INSPECTION CONTROLLER
// ============================================================
//
// Every shot declares:
//
//     asset: './some.glb'
//
// This tells us which ExhibitController owns the target.
//

function getInspectionController(
    shot
) {

    if (!shot) {

        return null;
    }


    return getExhibitController(
        shot.asset
    );
}


// ============================================================
// EXHIBIT INSPECTION TARGET
// ============================================================
//
// There are now two target modes:
//
// ------------------------------------------------------------
// WHOLE GLB
// ------------------------------------------------------------
//
// target:
//     'gaming_setup.glb'
//
// Returns:
//     gaming_setup controller.model
//
// ------------------------------------------------------------
// MESH
// ------------------------------------------------------------
//
// target:
//     'mesh_77'
//
// asset:
//     'exhibitStand.glb'
//
// Returns:
//     mesh_77
// ============================================================

function getExhibitInspectionTarget(
    shot
) {

    const controller =
        getInspectionController(
            shot
        );


    if (!controller) {

        console.warn(
            `No exhibit controller found for asset: ` +
            `${shot?.asset}`
        );

        return null;
    }


    // --------------------------------------------------------
    // WHOLE GLB INSPECTION
    // --------------------------------------------------------

    if (
        shot.target ===
        shot.asset
    ) {

        return controller.model;
    }


    // --------------------------------------------------------
    // MESH INSPECTION
    // --------------------------------------------------------

    const targetObject =
        controller.findObject(
            shot.target
        );


    if (!targetObject) {

        console.warn(
            `Exhibit target "${shot.target}" ` +
            `not found inside ${shot.asset}`
        );

        return null;
    }


    return targetObject;
}


// ============================================================
// EXHIBIT CAMERA CONFIGURATION
// ============================================================
//
// Existing camera style is preserved.
//
// There is now one camera configuration for every new
// inspection target.
//

const EXHIBIT_CAMERA = {

    ROOM_APPROACH: {

        position:
            new THREE.Vector3(
                0,
                4,
                10
            ),

        duration: 2200

    },


    ROOM_ORBIT: {

        radius: 8,

        height: 4,

        duration: 8000

    },


    MESH_77_INSPECT: {

        position:
            new THREE.Vector3(
                3,
                2.4,
                -5
            ),

        duration: 4800

    },


    MESH_79_INSPECT: {

        position:
            new THREE.Vector3(
                3,
                2.4,
                4
            ),

        duration: 4800

    },


    METAL_DOOR_INSPECT: {

        position:
            new THREE.Vector3(
                -5,
                2.4,
                3
            ),

        duration: 4800

    },


    GAMING_SETUP_INSPECT: {

        position:
            new THREE.Vector3(
                5,
                2.2,
                2
            ),

        duration: 4800

    },


    PANEL_INSPECT: {

        position:
            new THREE.Vector3(
                -5,
                2.2,
                -2
            ),

        duration: 4800

    },


    WALLBOARD_INSPECT: {

        position:
            new THREE.Vector3(
                5,
                2.2,
                -2
            ),

        duration: 4800

    }

};


// ============================================================
// MOVE CAMERA TO EXHIBIT OBJECT
// ============================================================

async function moveCameraToExhibitObject(
    shot,
    cameraPosition,
    duration
) {

    const targetObject =
        getExhibitInspectionTarget(
            shot
        );


    if (!targetObject) {

        console.warn(
            `Exhibit target "${shot.target}" ` +
            `could not be resolved`
        );

        return;
    }


    const target =
        getObjectWorldCenter(
            targetObject
        );


    await moveCameraTo(
        cameraPosition.clone(),
        duration,
        target
    );
}


// ============================================================
// EXHIBIT ROOM APPROACH
// ============================================================

async function runExhibitRoomApproach() {

    setStatus(
        'Exhibit → Room approach'
    );


    const center =
        getExhibitRoomCenter();


    await moveCameraTo(

        new THREE.Vector3(
            center.x,
            center.y + 4,
            center.z + 10
        ),

        EXHIBIT_CAMERA
            .ROOM_APPROACH
            .duration,

        center
    );
}


// ============================================================
// EXHIBIT ROOM ORBIT
// ============================================================

function runExhibitRoomOrbit() {

    return new Promise(
        resolve => {

            setStatus(
                'Exhibit → Room orbit'
            );


            const center =
                getExhibitRoomCenter();


            const startOffset =
                camera.position
                    .clone()
                    .sub(center);


            const radius =
                Math.sqrt(

                    startOffset.x *
                    startOffset.x +

                    startOffset.z *
                    startOffset.z

                );


            const startAngle =
                Math.atan2(
                    startOffset.x,
                    startOffset.z
                );


            const state = {

                angle:
                    startAngle

            };


            new TWEEN.Tween(
                state
            )

                .to(
                    {
                        angle:
                            startAngle +
                            Math.PI * 2
                    },

                    EXHIBIT_CAMERA
                        .ROOM_ORBIT
                        .duration
                )

                .easing(
                    TWEEN.Easing.Linear.None
                )

                .onUpdate(() => {

                    camera.position.x =
                        center.x +
                        Math.sin(
                            state.angle
                        ) *
                        radius;


                    camera.position.z =
                        center.z +
                        Math.cos(
                            state.angle
                        ) *
                        radius;


                    camera.position.y =
                        center.y +
                        EXHIBIT_CAMERA
                            .ROOM_ORBIT
                            .height +

                        Math.sin(
                            state.angle * 2
                        ) *
                        0.35;


                    camera.lookAt(
                        center
                    );

                })

                .onComplete(() => {

                    resolve();

                })

                .start();

        }
    );
}


// ============================================================
// EXHIBIT INSPECTION SHOT
// ============================================================
//
// This is now generic.
//
// Example:
//
//     MESH_77_INSPECT
//
// resolves:
//
//     exhibitStand.glb
//          ↓
//     mesh_77
//          ↓
//     Door_Close
//
//
//
// METAL_DOOR_INSPECT
//
// resolves:
//
//     metal_door_rigged.glb
//          ↓
//     entire GLB
//          ↓
//     Door_Open
//
//
//
// GAMING_SETUP_INSPECT
//
// resolves:
//
//     gaming_setup.glb
//          ↓
//     entire GLB
//          ↓
//     no animation
// ============================================================

async function runExhibitInspection(
    shotName
) {

    const shot =
        EXHIBIT_SHOTS[
            shotName
        ];


    if (!shot) {

        console.warn(
            `Exhibit shot "${shotName}" not found`
        );

        return;
    }


    console.log(
        `Exhibit camera → ${shotName}`
    );


    setStatus(
        `Exhibit → ${shotName}`
    );


    const config =
        EXHIBIT_CAMERA[
            shotName
        ];


    if (!config) {

        console.warn(
            `No camera configuration for ` +
            `${shotName}`
        );

        return;
    }


    const controller =
        getInspectionController(
            shot
        );


    if (!controller) {

        console.warn(
            `No controller for ${shot.asset}`
        );

        return;
    }


    // --------------------------------------------------------
    // PLAY CLIP IF THIS SHOT HAS ONE
    // --------------------------------------------------------
    //
    // Shots without a clip are camera-only.
    //

    if (
        shot.clip
    ) {

        controller.playClip(
            shot.clip
        );
    }


    // --------------------------------------------------------
    // CAMERA
    // --------------------------------------------------------

    await moveCameraToExhibitObject(

        shot,

        config.position,

        config.duration
    );


    // --------------------------------------------------------
    // INSPECTION HOLD
    // --------------------------------------------------------

    await new Promise(
        resolve =>
            setTimeout(
                resolve,
                700
            )
    );
}


// ============================================================
// COMPLETE EXHIBIT SHOWROOM
// ============================================================
//
// Inspection order:
//
//     ROOM APPROACH
//          ↓
//     ROOM ORBIT
//          ↓
//     MESH_77
//          ↓
//     MESH_79
//          ↓
//     METAL DOOR GLB
//          ↓
//     GAMING SETUP GLB
//          ↓
//     PANEL GLB
//          ↓
//     WALLBOARD GLB
//
// ============================================================

async function exhibitShot() {

    if (
        exhibitControllers.size === 0
    ) {

        console.warn(
            'Exhibit controllers not loaded'
        );

        return;
    }


    // ========================================================
    // ROOM APPROACH
    // ========================================================

    await runExhibitRoomApproach();


    // ========================================================
    // ROOM ORBIT
    // ========================================================

    await runExhibitRoomOrbit();


    // ========================================================
    // MESH 77
    //
    // Door_Close
    // ========================================================

    await runExhibitInspection(
        'MESH_77_INSPECT'
    );


    // ========================================================
    // MESH 79
    //
    // No clip yet.
    // ========================================================

    await runExhibitInspection(
        'MESH_79_INSPECT'
    );


    // ========================================================
    // METAL DOOR GLB
    //
    // Door_Open
    // ========================================================

    await runExhibitInspection(
        'METAL_DOOR_INSPECT'
    );


    // ========================================================
    // GAMING SETUP GLB
    //
    // No clip yet.
    // ========================================================

    await runExhibitInspection(
        'GAMING_SETUP_INSPECT'
    );


    // ========================================================
    // PANEL GLB
    //
    // No clip yet.
    // ========================================================

    await runExhibitInspection(
        'PANEL_INSPECT'
    );


    // ========================================================
    // WALLBOARD GLB
    //
    // No clip yet.
    // ========================================================

    await runExhibitInspection(
        'WALLBOARD_INSPECT'
    );


    console.log(
        '========================================'
    );


    console.log(
        'EXHIBIT SHOWROOM COMPLETE'
    );


    console.log(
        '========================================'
    );
}

// ============================================================
// CLOCK
// ============================================================
//
// Must exist BEFORE animate() begins.
// ============================================================

const clock =
    new THREE.Clock();


// ============================================================
// ANIMATION LOOP
// ============================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        clock.getDelta();


    // --------------------------------------------------------
    // AVATAR MIXERS
    // --------------------------------------------------------

    for (
        const controller
        of avatarControllers
    ) {

        controller.update(
            delta
        );
    }

    

    // --------------------------------------------------------
    // FORD RAPTOR MIXER
    // --------------------------------------------------------

    if (carController) {

        carController.update(
            delta
        );
    }

    // Update exhibit animation mixer
    for (
        const controller
        of exhibitControllers.values()
    ) {

        controller.update(
            delta
        );
    }
    // --------------------------------------------------------
    // PHYSICAL LIGHTING
    // --------------------------------------------------------

    updatePhysicalLighting();

    // --------------------------------------------------------
    // RAMEN SHOP + INDUCTOR LAB
    // --------------------------------------------------------

    updateLabSimulation(delta);

    // --------------------------------------------------------
    // TWEEN.JS
    // --------------------------------------------------------

    TWEEN.update();


    // --------------------------------------------------------
    // CONTROLS
    // --------------------------------------------------------

    if (controls.enabled) {

        controls.update();
    }


    // --------------------------------------------------------
    // RENDER
    // --------------------------------------------------------

    renderer.render(
        scene,
        camera
    );
}


// Start rendering immediately.
animate();


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
    'resize',
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);


// ============================================================
// COMPLETE CINEMATIC
// ============================================================
//
// Existing avatar sequence remains intact.
//
// The Ford Raptor showroom is appended after the avatar
// formation orbit and before the final camera sequence.
//
// Shared opening:
//
//     INITIAL FLY
//          ↓
//     SLOW APPROACH
//
// Then:
//
//     AVATAR 1
//          ↓
//     AVATAR 2
//          ↓
//     AVATAR 3
//          ↓
//     AVATAR 4
//          ↓
//     AVATAR 5
//          ↓
//     FIVE-AVATAR ORBIT
//          ↓
//     FORD RAPTOR SHOWROOM
//          ↓
//     FINAL CAMERA
// ============================================================

// ============================================================
// COMPLETE CINEMATIC
// ============================================================

// ============================================================
// COMPLETE CINEMATIC
// ============================================================

async function runCinematic() {

    controls.enabled = false;


    // ========================================================
    // SHARED OPENING
    // ========================================================

    setStatus(
        'Camera fly'
    );

    await moveCameraTo(
        new THREE.Vector3(
            0,
            6,
            13
        ),
        2500,
        FORMATION_CENTER
    );


    setStatus(
        'Camera approach'
    );

    await moveCameraTo(
        new THREE.Vector3(
            0,
            3.5,
            9
        ),
        2500,
        FORMATION_CENTER
    );

    /**
    // ========================================================
    // AVATARS
    // ========================================================

    await inspectAvatar(
        avatarControllers[0]
    );

    await inspectAvatar(
        avatarControllers[1]
    );

    await inspectAvatar(
        avatarControllers[2]
    );

    await inspectAvatar(
        avatarControllers[3]
    );

    await inspectAvatar(
        avatarControllers[4]
    );


    // ========================================================
    // FIVE-AVATAR FORMATION
    // ========================================================

    // ========================================================
// SHARED AVATAR FORMATION SHOTS
// ========================================================

    await runOrderedFormationApproach(
        ORDERED_AVATAR_SEQUENCE
    );

    await runOrderedFormationOrbit(
        ORDERED_AVATAR_SEQUENCE
    );

    await runFormationOrbit(
        ORDERED_AVATAR_SEQUENCE
    );

    await runFormationPortrait(
        ORDERED_AVATAR_SEQUENCE
    );

    await runFormationElevation(
        ORDERED_AVATAR_SEQUENCE
    );

    await runOrderedFormationPortrait(
        ORDERED_AVATAR_SEQUENCE
    );

    await runOrderedFormationElevation(
        ORDERED_AVATAR_SEQUENCE
    );

    // ========================================================
    // FORD RAPTOR SHOWROOM
    // ========================================================

    await runCarShot(
        'CAR_APPROACH'
    );

    await runCarShot(
        'CAR_ORBIT'
    );

    await runCarShot(
        'FRONT_LEFT_TYRE'
    );

    await runCarShot(
        'REAR_RIGHT_TYRE'
    );

    await runCarShot(
        'CAR_BOUNCE'
    );

    await runCarShot(
        'CAR_RISE'
    );

    */
    // ========================================================
    // EXHIBIT STAND SHOWROOM
    // ========================================================

    await exhibitShot();


    // ========================================================
    // FINAL CAMERA
    // ========================================================

    await runFinalCameraSequence();

    // ========================================================
    // CINEMATIC COMPLETE → EDUCATION MODE
    // ========================================================

    activateLabMode();


    // ========================================================
    // DIRECTOR / HARD-CODED CAMERA CINEMATIC
    // ========================================================
    /**
    await runDirectorCinematic();
   */
}

// ============================================================
// INITIALIZATION
// ============================================================

async function initialize() {

    try {

        // ----------------------------------------------------
        // LOAD AVATARS
        // ----------------------------------------------------

        setStatus(
            'Loading avatars...'
        );

        await loadAvatars();


        if (
            avatarControllers.length !== AVATAR_DEFINITIONS.length
        ) {

            throw new Error(
                `Expected ${AVATAR_DEFINITIONS.length} avatars, ` +
                `loaded ${avatarControllers.length}`
            );
        }


        // ----------------------------------------------------
        // LOAD FORD RAPTOR
        // ----------------------------------------------------

        await loadCar();


        if (!carController) {

            throw new Error(
                'Ford Raptor failed to load'
            );
        }

        await loadExhibitStand();


        if (
           exhibitControllers.size !==
           EXHIBIT_DEFINITIONS.length
        ) {

           throw new Error(
               `Expected ${
        EXHIBIT_DEFINITIONS.length
                } exhibit assets, loaded $
        {
        exhibitControllers.size
                }`
            );
        }
        // ----------------------------------------------------
        // LOAD RAMEN SHOP + HOLOGRAM + INDUCTOR LAB
        // AFTER ALL EXHIBIT STANDS
        // ----------------------------------------------------

        setStatus(
            'Loading ramen shop + lab simulation...'
        );

        await loadRamenLabAssets();

        // ----------------------------------------------------
        // HIDE LOADING
        // ----------------------------------------------------

        loadingElement.style.display =
            'none';


        setStatus(
            'Starting cinematic...'
        );


        // Give the browser one frame to finish
        // placing everything before the camera starts.
        await new Promise(
            resolve =>
                requestAnimationFrame(
                    resolve
                )
        );


        // ----------------------------------------------------
        // START COMPLETE CINEMATIC
        // ----------------------------------------------------

        await runCinematic();


    } catch (error) {

        console.error(
            error
        );

        showError(
            `initialize.Error:\n${error.stack || error}`
        );

        loadingElement.textContent =
            'Initialization failed';
    }
}


initialize();
