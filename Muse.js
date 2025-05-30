import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AmusementPark = () => {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 50, z: 100 });

  useEffect(() => {
    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue background

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 75, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Controls for camera movement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a7d44,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Paths
    createPaths(scene);

    // Create amusement park elements
    createEnhancedRollerCoaster(scene);
    createFerrisWheel(scene);
    createTower(scene);
    createCarousel(scene);
    createWaterRide(scene);
    
    createBuildings(scene);
    createTrees(scene);

    setIsLoading(false);

    // Animation loop
    let rollerCoasterCarts = [];
    let ferrisWheel;
    let carouselPlatform;
    let towerRide;

    // Get references to animated objects
    scene.traverse((object) => {
      if (object.name === 'ferrisWheel') {
        ferrisWheel = object;
      } else if (object.name === 'carouselPlatform') {
        carouselPlatform = object;
      } else if (object.name === 'towerRide') {
        towerRide = object;
      } else if (object.name.includes('rollerCoasterCart')) {
        rollerCoasterCarts.push(object);
      }
    });

    const clock = new THREE.Clock();
    let towerDirection = 1;
    let towerPosition = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Animate Ferris wheel
      if (ferrisWheel) {
        ferrisWheel.rotation.z += 0.005;
      }

      // Animate carousel
      if (carouselPlatform) {
        carouselPlatform.rotation.y += 0.01;
      }

      // Animate tower ride
      if (towerRide) {
        towerPosition += towerDirection * 0.3;
        if (towerPosition > 20) {
          towerDirection = -1;
        } else if (towerPosition < 0) {
          towerDirection = 1;
        }
        towerRide.position.y = towerPosition + 5;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [cameraPosition]);

  // Function to create paths in the park
  function createPaths(scene) {
    // Main paths
    const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xD2B48C });

    // Create a circular path around the park
    const circularPathGeometry = new THREE.RingGeometry(60, 65, 32);
    const circularPath = new THREE.Mesh(circularPathGeometry, pathMaterial);
    circularPath.rotation.x = -Math.PI / 2;
    circularPath.position.y = -0.4;
    scene.add(circularPath);

    // Create radial paths from center to attractions
    const createRadialPath = (angle, length) => {
      const pathGeometry = new THREE.PlaneGeometry(5, length);
      const path = new THREE.Mesh(pathGeometry, pathMaterial);
      path.rotation.x = -Math.PI / 2;
      path.position.y = -0.4;
      path.position.x = Math.cos(angle) * length / 2;
      path.position.z = Math.sin(angle) * length / 2;
      path.rotation.y = angle + Math.PI / 2;
      scene.add(path);
    };

    // Create paths to each attraction
    for (let i = 0; i < 5; i++) {
      createRadialPath((i * Math.PI * 2) / 5, 60);
    }
  }

  // Function to create the enhanced roller coaster with complex track
  function createEnhancedRollerCoaster(scene) {
    // Create roller coaster area
    const baseGeometry = new THREE.BoxGeometry(80, 2, 80);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(-60, 1, -60);
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);

    // Create station platform
    const stationGeometry = new THREE.BoxGeometry(20, 3, 10);
    const stationMaterial = new THREE.MeshStandardMaterial({ color: 0xA52A2A });
    const station = new THREE.Mesh(stationGeometry, stationMaterial);
    station.position.set(-60, 2.5, -30);
    station.castShadow = true;
    scene.add(station);

    // Station roof
    const roofGeometry = new THREE.BoxGeometry(22, 1, 12);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(-60, 8, -30);
    roof.castShadow = true;
    scene.add(roof);

    // Roof supports
    for (let i = -1; i <= 1; i += 2) {
      for (let j = -1; j <= 1; j += 2) {
        const supportGeometry = new THREE.BoxGeometry(1, 5, 1);
        const support = new THREE.Mesh(supportGeometry, roofMaterial);
        support.position.set(-60 + (i * 9), 5.5, -30 + (j * 4));
        support.castShadow = true;
        scene.add(support);
      }
    }

    // Create complex roller coaster track
    const trackGroup = new THREE.Group();
    trackGroup.name = 'rollerCoasterTrack';

    // Define track points for a more complex coaster
    const trackPoints = [
      // Station start
      new THREE.Vector3(-70, 4, -30),
      new THREE.Vector3(-50, 4, -30),

      // First climb
      new THREE.Vector3(-40, 4, -40),
      new THREE.Vector3(-30, 20, -50),

      // First drop
      new THREE.Vector3(-20, 25, -60),
      new THREE.Vector3(-10, 10, -70),
      new THREE.Vector3(0, 8, -80),

      // Loop prep
      new THREE.Vector3(10, 12, -70),
      new THREE.Vector3(20, 18, -60),

      // Loop
      new THREE.Vector3(20, 25, -50),
      new THREE.Vector3(20, 30, -40),
      new THREE.Vector3(20, 25, -30),
      new THREE.Vector3(20, 18, -20),

      // Helix entry
      new THREE.Vector3(10, 15, -10),
      new THREE.Vector3(0, 14, -10),

      // Helix (spiral)
      new THREE.Vector3(-10, 13, -20),
      new THREE.Vector3(-20, 12, -30),
      new THREE.Vector3(-30, 11, -40),
      new THREE.Vector3(-40, 10, -50),
      new THREE.Vector3(-50, 9, -60),
      new THREE.Vector3(-60, 8, -70),

      // Final stretch back to station
      new THREE.Vector3(-70, 6, -60),
      new THREE.Vector3(-75, 5, -50),
      new THREE.Vector3(-75, 4, -40),
      new THREE.Vector3(-70, 4, -30)
    ];

    // Create track curve
    const trackCurve = new THREE.CatmullRomCurve3(trackPoints);
    trackCurve.closed = true;

    // Create main track geometry
    const trackGeometry = new THREE.TubeGeometry(trackCurve, 200, 0.5, 8, false);
    const trackMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.castShadow = true;
    trackGroup.add(track);

    // Create track ties and rails
    const trackLength = trackCurve.getLength();
    const tiesCount = Math.floor(trackLength / 2); // Place ties every 2 units

    for (let i = 0; i < tiesCount; i++) {
      const t = i / tiesCount;
      const tiePosition = trackCurve.getPointAt(t);
      const tangent = trackCurve.getTangentAt(t);

      // Create orientation matrix
      const normal = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
      const adjNormal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();

      // Create tie
      const tieGeometry = new THREE.BoxGeometry(0.3, 0.2, 2.5);
      const tieMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const tie = new THREE.Mesh(tieGeometry, tieMaterial);

      // Position and orient tie
      tie.position.copy(tiePosition);

      // Create orientation matrix for the tie
      const tieMatrix = new THREE.Matrix4();
      const xColumn = new THREE.Vector3().copy(binormal);
      const yColumn = new THREE.Vector3().copy(adjNormal);
      const zColumn = new THREE.Vector3().copy(tangent);

      tieMatrix.makeBasis(xColumn, yColumn, zColumn);
      tie.setRotationFromMatrix(tieMatrix);

      // Only add some ties to reduce geometry load
      if (i % 8 === 0) {
        trackGroup.add(tie);
      }

      // Add vertical supports at intervals
      if (i % 24 === 0 && tiePosition.y > 5) {
        const height = tiePosition.y - 2;
        const supportGeometry = new THREE.CylinderGeometry(0.5, 0.5, height, 8);
        const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const support = new THREE.Mesh(supportGeometry, supportMaterial);

        support.position.set(tiePosition.x, height/2, tiePosition.z);
        support.castShadow = true;
        trackGroup.add(support);
      }
    }

    scene.add(trackGroup);

    function createWoodenTower(scene) {
  // Tower parameters
    const towerHeight = 60;
    const towerBaseWidth = 18;
    const towerTopWidth = 12;
    const woodColor = 0x8B4513;
    const darkWoodColor = 0x5D2906;
  
  // Create the main tower structure group
    const towerGroup = new THREE.Group();
    towerGroup.name = 'woodenTower';
    towerGroup.position.set(70, 0, -40);
    scene.add(towerGroup);
  
  // Create the base foundation
    const baseGeometry = new THREE.BoxGeometry(towerBaseWidth + 4, 2, towerBaseWidth + 4);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 1;
    base.receiveShadow = true;
    base.castShadow = true;
    towerGroup.add(base);
  
  // Create the tower frame
    createTowerFrame(towerGroup, towerHeight, towerBaseWidth, towerTopWidth, woodColor);
  
  // Create observation deck at the top
    createObservationDeck(towerGroup, towerHeight, towerTopWidth, woodColor, darkWoodColor);
  
  // Create the elevator shaft
    const shaftGroup = createElevatorShaft(towerGroup, towerHeight, towerBaseWidth, towerTopWidth);
  
  // Create the elevator car
    const elevator = createElevatorCar(towerHeight, towerBaseWidth, towerTopWidth);
    elevator.name = 'towerElevator';
    shaftGroup.add(elevator);
  
  // Add ladder on the outside
    createOutsideLadder(towerGroup, towerHeight, towerBaseWidth, woodColor);
  
  // Add some decorative elements
    createDecorativeElements(towerGroup, towerHeight, towerBaseWidth, towerTopWidth, woodColor, darkWoodColor);
  
    return towerGroup;
 }

 function createTowerFrame(towerGroup, towerHeight, towerBaseWidth, towerTopWidth, woodColor) {
  // Create the 4 corner posts (tapering from base to top)
  const cornerPositions = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1]
  ];
  
  for (let i = 0; i < 4; i++) {
    // For each corner, create a segmented post to taper it
    const segments = 6;
    const segmentHeight = towerHeight / segments;
    
    for (let j = 0; j < segments; j++) {
      const segmentBottom = j * segmentHeight;
      const segmentTop = (j + 1) * segmentHeight;
      
      // Calculate width at bottom and top of this segment
      const bottomWidthFactor = 1 - (j / segments);
      const topWidthFactor = 1 - ((j + 1) / segments);
      const bottomWidth = towerBaseWidth * bottomWidthFactor + towerTopWidth * (1 - bottomWidthFactor);
      const topWidth = towerBaseWidth * topWidthFactor + towerTopWidth * (1 - topWidthFactor);
      
      const bottomPos = cornerPositions[i].map(val => val * (bottomWidth / 2));
      const topPos = cornerPositions[i].map(val => val * (topWidth / 2));
      
      // Create post geometry (tapered cylinder)
      const postGeometry = new THREE.CylinderGeometry(0.8, 1, segmentHeight, 8);
      const postMaterial = new THREE.MeshStandardMaterial({ 
        color: woodColor,
        roughness: 0.8,
        metalness: 0.1
      });
      const post = new THREE.Mesh(postGeometry, postMaterial);
      
      // Position the post segment
      post.position.x = bottomPos[0];
      post.position.z = bottomPos[1];
      post.position.y = segmentBottom + segmentHeight / 2;
      
      // Add a slight random rotation for natural wood look
      post.rotation.y = Math.random() * 0.1;
      post.castShadow = true;
      
      towerGroup.add(post);
    }
  }
  
  // Create horizontal supports at different heights
  for (let h = 0; h < towerHeight; h += 10) {
    createHorizontalSupports(towerGroup, h, towerHeight, towerBaseWidth, towerTopWidth, woodColor);
  }
  
  // Create cross braces
  createCrossBraces(towerGroup, towerHeight, towerBaseWidth, towerTopWidth, woodColor);
}

function createHorizontalSupports(towerGroup, height, towerHeight, towerBaseWidth, towerTopWidth, woodColor) {
  // Calculate width at this height
  const heightFactor = 1 - (height / towerHeight);
  const width = towerBaseWidth * heightFactor + towerTopWidth * (1 - heightFactor);
  
  // Create horizontal beams connecting the corner posts
  const sides = [
    [[-1, -1], [1, -1]], // front
    [[1, -1], [1, 1]],   // right
    [[1, 1], [-1, 1]],   // back
    [[-1, 1], [-1, -1]]  // left
  ];
  
  sides.forEach((side) => {
    const start = side[0].map(val => val * (width / 2));
    const end = side[1].map(val => val * (width / 2));
    const length = Math.sqrt(
      Math.pow(end[0] - start[0], 2) + 
      Math.pow(end[1] - start[1], 2)
    );
    
    const supportGeometry = new THREE.BoxGeometry(length, 0.8, 0.8);
    const supportMaterial = new THREE.MeshStandardMaterial({ 
      color: woodColor,
      roughness: 0.8,
      metalness: 0.1
    });
    const support = new THREE.Mesh(supportGeometry, supportMaterial);
    
    // Position at midpoint between start and end
    support.position.x = (start[0] + end[0]) / 2;
    support.position.z = (start[1] + end[1]) / 2;
    support.position.y = height;
    
    // Rotate to point from start to end
    support.rotation.y = Math.atan2(end[1] - start[1], end[0] - start[0]);
    
    support.castShadow = true;
    towerGroup.add(support);
  });
}

function createCrossBraces(towerGroup, towerHeight, towerBaseWidth, towerTopWidth, woodColor) {
  // Add cross braces for structural support (X pattern)
  const sectionHeight = 10;
  const sections = Math.floor(towerHeight / sectionHeight);
  
  for (let section = 0; section < sections; section++) {
    const bottomHeight = section * sectionHeight;
    const topHeight = (section + 1) * sectionHeight;
    
    // Calculate width at bottom and top of this section
    const bottomHeightFactor = 1 - (bottomHeight / towerHeight);
    const topHeightFactor = 1 - (topHeight / towerHeight);
    const bottomWidth = towerBaseWidth * bottomHeightFactor + towerTopWidth * (1 - bottomHeightFactor);
    const topWidth = towerBaseWidth * topHeightFactor + towerTopWidth * (1 - topHeightFactor);
    
    // Create cross braces on each side
    const sides = [
      [[-1, -1], [1, -1], [1, -1], [-1, -1]], // front
      [[1, -1], [1, 1], [1, 1], [1, -1]],     // right
      [[1, 1], [-1, 1], [-1, 1], [1, 1]],     // back
      [[-1, 1], [-1, -1], [-1, -1], [-1, 1]]  // left
    ];
    
    sides.forEach((side) => {
      // First brace (bottom-left to top-right)
      createCrossBrace(
        towerGroup,
        side[0], bottomHeight, bottomWidth,
        side[1], topHeight, topWidth,
        woodColor
      );
      
      // Second brace (bottom-right to top-left)
      createCrossBrace(
        towerGroup,
        side[2], topHeight, topWidth,
        side[3], bottomHeight, bottomWidth,
        woodColor
      );
    });
  }
}

function createCrossBrace(towerGroup, startPos, startHeight, startWidth, endPos, endHeight, endWidth, woodColor) {
  // Map corner positions to actual coordinates based on width
  const start = startPos.map(val => val * (startWidth / 2));
  const end = endPos.map(val => val * (endWidth / 2));
  
  // Calculate length of the brace
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) + 
    Math.pow(end[1] - start[1], 2) + 
    Math.pow(endHeight - startHeight, 2)
  );
  
  // Create the brace as a thin box
  const braceGeometry = new THREE.BoxGeometry(0.5, length, 0.5);
  const braceMaterial = new THREE.MeshStandardMaterial({ 
    color: woodColor,
    roughness: 0.8,
    metalness: 0.1
  });
  const brace = new THREE.Mesh(braceGeometry, braceMaterial);
  
  // Position at midpoint
  brace.position.x = (start[0] + end[0]) / 2;
  brace.position.z = (start[1] + end[1]) / 2;
  brace.position.y = (startHeight + endHeight) / 2;
  
  // Calculate rotation to point from start to end
  // First around Y axis
  const yRotation = Math.atan2(end[1] - start[1], end[0] - start[0]);
  brace.rotation.y = yRotation;
  
  // Then tilt up/down in brace's local X-Z plane
  const horizontalDist = Math.sqrt(
    Math.pow(end[0] - start[0], 2) + 
    Math.pow(end[1] - start[1], 2)
  );
  const xRotation = Math.atan2(endHeight - startHeight, horizontalDist);
  brace.rotation.x = xRotation;
  
  brace.castShadow = true;
  towerGroup.add(brace);
}

function createObservationDeck(towerGroup, towerHeight, towerTopWidth, woodColor, darkWoodColor) {
  // Create observation platform at the top
  const platformGeometry = new THREE.CylinderGeometry(towerTopWidth * 0.6, towerTopWidth * 0.6, 1.5, 16);
  const platformMaterial = new THREE.MeshStandardMaterial({ 
    color: darkWoodColor,
    roughness: 0.8,
    metalness: 0.1 
  });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = towerHeight;
  platform.castShadow = true;
  platform.receiveShadow = true;
  towerGroup.add(platform);
  
  // Add railing around the observation deck
  const railingGroup = new THREE.Group();
  railingGroup.position.y = towerHeight + 0.75;
  towerGroup.add(railingGroup);
  
  const radius = towerTopWidth * 0.6;
  const segments = 16;
  
  // Create vertical posts
  for (let i = 0; i < segments; i++) {
    const angle = (i * Math.PI * 2) / segments;
    const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 6);
    const postMaterial = new THREE.MeshStandardMaterial({ 
      color: woodColor,
      roughness: 0.8 
    });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    
    post.position.x = radius * Math.cos(angle);
    post.position.z = radius * Math.sin(angle);
    post.position.y = 1.5;
    post.castShadow = true;
    
    railingGroup.add(post);
  }
  
  // Create horizontal railings
  for (let i = 0; i < segments; i++) {
    const startAngle = (i * Math.PI * 2) / segments;
    const endAngle = ((i + 1) * Math.PI * 2) / segments;
    
    const startX = radius * Math.cos(startAngle);
    const startZ = radius * Math.sin(startAngle);
    const endX = radius * Math.cos(endAngle);
    const endZ = radius * Math.sin(endAngle);
    
    // Create top and bottom railings
    [1, 3].forEach(height => {
      const railGeometry = new THREE.CylinderGeometry(0.15, 0.15, 
        Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2)), 6);
      const railMaterial = new THREE.MeshStandardMaterial({ 
        color: woodColor,
        roughness: 0.8 
      });
      const rail = new THREE.Mesh(railGeometry, railMaterial);
      
      // Position at midpoint
      rail.position.x = (startX + endX) / 2;
      rail.position.z = (startZ + endZ) / 2;
      rail.position.y = height;
      
      // Rotate to align with segment
      rail.rotation.y = Math.atan2(endZ - startZ, endX - startX);
      rail.rotation.z = Math.PI / 2;
      
      rail.castShadow = true;
      railingGroup.add(rail);
    });
  }
  
  // Create roof
  const roofGeometry = new THREE.ConeGeometry(towerTopWidth * 0.7, 4, 16);
  const roofMaterial = new THREE.MeshStandardMaterial({ 
    color: darkWoodColor,
    roughness: 0.7
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = towerHeight + 5;
  roof.castShadow = true;
  towerGroup.add(roof);
  
  // Add small flagpole at the top
  const flagpoleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
  const flagpoleMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const flagpole = new THREE.Mesh(flagpoleGeometry, flagpoleMaterial);
  flagpole.position.y = towerHeight + 7;
  flagpole.castShadow = true;
  towerGroup.add(flagpole);
  
  // Add flag
  const flagGeometry = new THREE.PlaneGeometry(1.5, 0.8);
  const flagMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff0000,
    side: THREE.DoubleSide
  });
  const flag = new THREE.Mesh(flagGeometry, flagMaterial);
  flag.position.set(0.6, towerHeight + 6.5, 0);
  flag.rotation.y = Math.PI / 2;
  flag.castShadow = true;
  towerGroup.add(flag);
}

function createElevatorShaft(towerGroup, towerHeight, towerBaseWidth, towerTopWidth) {
  // Create elevator shaft group
  const shaftGroup = new THREE.Group();
  shaftGroup.name = 'elevatorShaft';
  towerGroup.add(shaftGroup);
  
  // Calculate approximate center width
  const centerWidth = (towerBaseWidth + towerTopWidth) / 2;
  const shaftWidth = 4;
  
  // Create shaft corners (vertical beams)
  const cornerPositions = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1]
  ];
  
  for (let i = 0; i < 4; i++) {
    const beamGeometry = new THREE.BoxGeometry(0.6, towerHeight, 0.6);
    const beamMaterial = new THREE.MeshStandardMaterial({ color: 0x5D2906 });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    
    beam.position.x = cornerPositions[i][0] * (shaftWidth / 2);
    beam.position.z = cornerPositions[i][1] * (shaftWidth / 2);
    beam.position.y = towerHeight / 2;
    
    beam.castShadow = true;
    shaftGroup.add(beam);
  }
  
  // Create horizontal shaft guides at intervals
  for (let h = 0; h < towerHeight; h += 5) {
    for (let i = 0; i < 4; i++) {
      const side = i % 2 === 0 ? 'x' : 'z';
      const guideGeometry = new THREE.BoxGeometry(
        side === 'x' ? shaftWidth : 0.4,
        0.4,
        side === 'z' ? shaftWidth : 0.4
      );
      const guideMaterial = new THREE.MeshStandardMaterial({ color: 0x5D2906 });
      const guide = new THREE.Mesh(guideGeometry, guideMaterial);
      
      guide.position.y = h;
      if (side === 'x') {
        guide.position.z = (i === 0 ? -1 : 1) * (shaftWidth / 2);
      } else {
        guide.position.x = (i === 1 ? -1 : 1) * (shaftWidth / 2);
      }
      
      guide.castShadow = true;
      shaftGroup.add(guide);
    }
  }
  
  // Create cable for elevator
  const cableGeometry = new THREE.CylinderGeometry(0.1, 0.1, towerHeight, 8);
  const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const cable = new THREE.Mesh(cableGeometry, cableMaterial);
  cable.position.y = towerHeight / 2;
  shaftGroup.add(cable);
  
  return shaftGroup;
}

function createElevatorCar(towerHeight, towerBaseWidth, towerTopWidth) {
  // Create elevator car group
  const elevatorGroup = new THREE.Group();
  elevatorGroup.position.y = 3; // Starting position
  
  // Create elevator cabin
  const cabinGeometry = new THREE.BoxGeometry(3.5, 4, 3.5);
  const cabinMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x886633,
    roughness: 0.7,
    metalness: 0.2
  });
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
  cabin.position.y = 2;
  cabin.castShadow = true;
  elevatorGroup.add(cabin);
  
  // Add ornate trim around the top and bottom
  const trimTopGeometry = new THREE.BoxGeometry(3.7, 0.3, 3.7);
  const trimBottomGeometry = new THREE.BoxGeometry(3.7, 0.3, 3.7);
  const trimMaterial = new THREE.MeshStandardMaterial({ color: 0x5D2906 });
  
  const trimTop = new THREE.Mesh(trimTopGeometry, trimMaterial);
  trimTop.position.y = 4;
  trimTop.castShadow = true;
  elevatorGroup.add(trimTop);
  
  const trimBottom = new THREE.Mesh(trimBottomGeometry, trimMaterial);
  trimBottom.position.y = 0;
  trimBottom.castShadow = true;
  elevatorGroup.add(trimBottom);
  
  // Add windows
  const windowMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xaaddff,
    transparent: true,
    opacity: 0.7,
    metalness: 0.9
  });
  
  // Side windows (four sides)
  const sides = [
    [0, 0, 1.76], // front
    [1.76, 0, 0], // right
    [0, 0, -1.76], // back
    [-1.76, 0, 0]  // left
  ];
  
  sides.forEach(side => {
    const windowGeometry = new THREE.PlaneGeometry(2, 2.5);
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(side[0], 2, side[1]);
    window.rotation.y = Math.atan2(side[0], side[1]);
    elevatorGroup.add(window);
  });
  
  // Add roof
  const roofGeometry = new THREE.ConeGeometry(2.5, 1, 4);
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x5D2906 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 4.6;
  roof.rotation.y = Math.PI / 4; // Rotate 45 degrees for better alignment
  roof.castShadow = true;
  elevatorGroup.add(roof);
  
  // Add elevator cables
  for (let i = -1; i <= 1; i += 2) {
    const cableGeometry = new THREE.CylinderGeometry(0.05, 0.05, 6, 8);
    const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const cable = new THREE.Mesh(cableGeometry, cableMaterial);
    cable.position.set(i, 7, 0);
    cable.castShadow = true;
    elevatorGroup.add(cable);
  }
  
  // Add pulley wheels at the top
  for (let i = -1; i <= 1; i += 2) {
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(i, 4.8, 0);
    wheel.rotation.x = Math.PI / 2;
    wheel.castShadow = true;
    elevatorGroup.add(wheel);
  }
  
  return elevatorGroup;
}

function createOutsideLadder(towerGroup, towerHeight, towerBaseWidth, woodColor) {
  // Create ladder from bottom to top for maintenance access
  const ladderGroup = new THREE.Group();
  ladderGroup.position.set(towerBaseWidth / 2 + 0.5, 0, 0);
  towerGroup.add(ladderGroup);
  
  // Create vertical rails
  for (let i = -1; i <= 1; i += 2) {
    const railGeometry = new THREE.CylinderGeometry(0.15, 0.15, towerHeight, 8);
    const railMaterial = new THREE.MeshStandardMaterial({ color: woodColor });
    const rail = new THREE.Mesh(railGeometry, railMaterial);
    rail.position.set(i * 0.5, towerHeight / 2, 0);
    rail.castShadow = true;
    ladderGroup.add(rail);
  }
  
  // Create rungs
  const rungCount = Math.floor(towerHeight / 2);
  for (let i = 0; i < rungCount; i++) {
    const rungGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8);
    const rungMaterial = new THREE.MeshStandardMaterial({ color: woodColor });
    const rung = new THREE.Mesh(rungGeometry, rungMaterial);
    rung.position.y = 2 * i;
    rung.rotation.z = Math.PI / 2;
    rung.castShadow = true;
    ladderGroup.add(rung);
  }
}

function createDecorativeElements(towerGroup, towerHeight, towerBaseWidth, towerTopWidth, woodColor, darkWoodColor) {
  // Add entrance at the bottom
  const entranceWidth = 4;
  const entranceHeight = 6;
  
  // Create entrance frame
  const entranceFrameGeometry = new THREE.BoxGeometry(entranceWidth + 1, entranceHeight + 1, 0.5);
  const entranceFrameMaterial = new THREE.MeshStandardMaterial({ color: darkWoodColor });
  const entranceFrame = new THREE.Mesh(entranceFrameGeometry, entranceFrameMaterial);
  entranceFrame.position.set(0, entranceHeight / 2, -towerBaseWidth / 2 - 0.25);
  entranceFrame.castShadow = true;
  towerGroup.add(entranceFrame);
  
  // Create entrance door (partially open)
  const doorGeometry = new THREE.BoxGeometry(entranceWidth * 0.8, entranceHeight * 0.9, 0.3);
  const doorMaterial = new THREE.MeshStandardMaterial({ color: woodColor });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(entranceWidth * 0.3, entranceHeight / 2 - 0.5, -towerBaseWidth / 2 - 0.5);
  door.rotation.y = Math.PI / 6; // Slightly open
  door.castShadow = true;
  towerGroup.add(door);
  
  // Add decorative signage
  const signGeometry = new THREE.PlaneGeometry(5, 1.5);
  const signMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xeecc99,
    side: THREE.DoubleSide
  });
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.set(0, entranceHeight + 2, -towerBaseWidth / 2 - 0.6);
  sign.castShadow = true;
  towerGroup.add(sign);
  
  // Add lanterns at various heights
  const lanternPositions = [
    [towerBaseWidth / 2, 10, towerBaseWidth / 2],
    [-towerBaseWidth / 2, 25, towerBaseWidth / 2],
    [towerBaseWidth / 2, 40, -towerBaseWidth / 2],
    [-towerBaseWidth / 3, towerHeight - 5, towerTopWidth / 3]
  ];
  
  lanternPositions.forEach(pos => {
    createLantern(towerGroup, pos[0], pos[1], pos[2]);
  });
}

function createLantern(parent, x, y, z) {
  const lanternGroup = new THREE.Group();
  lanternGroup.position.set(x, y, z);
  
  // Create lantern base
  const baseGeometry = new THREE.CylinderGeometry(0.3, 0.2, 0.3, 8);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -0.4;
  base.castShadow = true;
  lanternGroup.add(base);
  
  // Create lantern body
  const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffcc44,
    transparent: true,
    opacity: 0.7,
    emissive: 0xffaa00,
    emissiveIntensity: 0.5
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  lanternGroup.add(body);
  
  // Create lantern top
  const topGeometry = new THREE.ConeGeometry(0.3, 0.3, 8);
  const topMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.position.y = 0.45;
  top.castShadow = true;
  lanternGroup.add(top);
  
  // Add light source inside lantern
  const light = new THREE.PointLight(0xffaa00, 0.5, 10);
  light.position.y = 0;
  lanternGroup.add(light);
  
  parent.add(lanternGroup);
}

// Add this to your animation loop
function animateWoodenTower(scene, delta) {
  // Find the elevator
  let towerElevator;
  scene.traverse((object) => {
    if (object.name === 'towerElevator') {
      towerElevator = object;
    }
  });
  
  if (towerElevator) {
    // Elevator movement logic
    const maxHeight = 50; // Maximum height
    const minHeight = 3;  // Minimum height
    const cycleTime = 30; // Time for one full cycle in seconds
    
    // Calculate position based on time
    const time = (Date.now() % (cycleTime * 1000)) / 1000;
    const normalizedTime = time / cycleTime; // 0 to 1
    
    // Use sine wave for smooth up and down movement
    const elevatorPosition = minHeight + (maxHeight - minHeight) * Math.sin(normalizedTime * Math.PI * 2) * 0.5 + (maxHeight - minHeight) * 0.5;
    
    towerElevator.position.y = elevatorPosition;
  }
  }

    // Function to create a wooden drop tower
  
  // Tower structure (wooden framework)
  
  // Elevator platform
  
  // Add center column
  
   

    // Create stationary roller coaster train
    const createTrain = () => {
      const trainGroup = new THREE.Group();
      trainGroup.name = 'stationaryTrain';

      // Position at the station
      const stationPosition = trackCurve.getPointAt(0);
      const stationTangent = trackCurve.getTangentAt(0);

      // Create orientation matrix
      const normal = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(stationTangent, normal).normalize();
      const adjNormal = new THREE.Vector3().crossVectors(binormal, stationTangent).normalize();

      // Create 4 connected cars
      const carColors = [0xDC143C, 0x4169E1, 0xFFD700, 0x32CD32];

      for (let i = 0; i < 4; i++) {
        const carGroup = new THREE.Group();
        carGroup.name = `trainCar${i}`;

        // Car body
        const carGeometry = new THREE.BoxGeometry(3, 1.2, 1.8);
        const carMaterial = new THREE.MeshStandardMaterial({ color: carColors[i] });
        const car = new THREE.Mesh(carGeometry, carMaterial);
        car.position.y = 0.6;
        car.castShadow = true;
        carGroup.add(car);

        // Car roof
        const roofGeometry = new THREE.BoxGeometry(3, 0.2, 2);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 1.3;
        roof.castShadow = true;
        carGroup.add(roof);

        // Seats (two rows)
        for (let row = 0; row < 2; row++) {
          const seatGeometry = new THREE.BoxGeometry(1, 0.4, 1.6);
          const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
          const seat = new THREE.Mesh(seatGeometry, seatMaterial);
          seat.position.set((row - 0.5) * 1.5, 0.6, 0);
          seat.castShadow = true;
          carGroup.add(seat);
        }

        // Wheels
        for (let w = -1; w <= 1; w += 2) {
          for (let z = -1; z <= 1; z += 2) {
            const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
            const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(w * 1.2, 0, z * 0.7);
            wheel.castShadow = true;
            carGroup.add(wheel);
          }
        }

        // Position each car
        carGroup.position.copy(stationPosition);
        carGroup.position.x -= (i * 4) * stationTangent.x;
        carGroup.position.z -= (i * 4) * stationTangent.z;

        // Orient car to track
        const carMatrix = new THREE.Matrix4();
        carMatrix.makeBasis(binormal, adjNormal, stationTangent);
        carGroup.setRotationFromMatrix(carMatrix);

        trainGroup.add(carGroup);
      }

      scene.add(trainGroup);
    };

    createTrain();
  }

  // Function to create the Ferris wheel
  function createFerrisWheel(scene) {
    // Create the main wheel structure
    const wheelGroup = new THREE.Group();
    wheelGroup.name = 'ferrisWheel';

    // Wheel outer ring
    const ringGeometry = new THREE.TorusGeometry(20, 1, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: 0x1a75ff });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.castShadow = true;
    wheelGroup.add(ring);

    // Wheel spokes
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const spokeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 40, 8);
      const spokeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
      const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
      spoke.rotation.z = angle;
      spoke.castShadow = true;
      wheelGroup.add(spoke);
    }

    // Wheel cabins
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const cabinGeometry = new THREE.BoxGeometry(3, 3, 3);
      const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);

      cabin.position.set(20 * Math.cos(angle), 20 * Math.sin(angle), 0);
      cabin.castShadow = true;
      wheelGroup.add(cabin);
    }

    // Center hub
    const hubGeometry = new THREE.CylinderGeometry(2, 2, 2, 32);
    const hubMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.rotation.x = Math.PI / 2;
    hub.castShadow = true;
    wheelGroup.add(hub);

    // Support structure
    const supportGeometry = new THREE.BoxGeometry(5, 25, 5);
    const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const support = new THREE.Mesh(supportGeometry, supportMaterial);
    support.position.set(0, -12.5, 0);
    support.castShadow = true;

    // Position the entire wheel
    wheelGroup.position.set(50, 25, -50);
    wheelGroup.rotation.y = Math.PI / 2;
    scene.add(wheelGroup);

    // Add the support to the scene separately
    support.position.set(50, 12.5, -50);
    scene.add(support);
  }

  // Function to create the tower ride
  function createTower(scene) {
    // Tower base
    const baseGeometry = new THREE.CylinderGeometry(5, 5, 2, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(-50, 1, 50);
    base.castShadow = true;
    scene.add(base);

    // Tower structure
    const towerGeometry = new THREE.CylinderGeometry(2, 2, 40, 16);
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.set(-50, 21, 50);
    tower.castShadow = true;
    scene.add(tower);

    // Ride platform
    const platformGeometry = new THREE.CylinderGeometry(8, 8, 2, 16);
    const platformMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.name = 'towerRide';
    platform.position.set(-50, 5, 50);  // Starting position
    platform.castShadow = true;
    scene.add(platform);

    // Add seats to the platform
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const seatGeometry = new THREE.BoxGeometry(2, 1, 2);
      const seatMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
      const seat = new THREE.Mesh(seatGeometry, seatMaterial);

      seat.position.set(
        6 * Math.cos(angle),
        0.5,
        6 * Math.sin(angle)
      );

      seat.castShadow = true;
      platform.add(seat);
    }
  }

  // Function to create the carousel
  function createCarousel(scene) {
    // Carousel base
    const baseGeometry = new THREE.CylinderGeometry(12, 12, 1, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x964B00 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 0.5, 0);
    base.receiveShadow = true;
    scene.add(base);

    // Carousel platform
    const platformGeometry = new THREE.CylinderGeometry(10, 10, 1, 32);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      metalness: 0.3,
      roughness: 0.4
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.name = 'carouselPlatform';
    platform.position.set(0, 1.5, 0);
    platform.castShadow = true;
    platform.receiveShadow = true;
    scene.add(platform);

    // Carousel roof
    const roofGeometry = new THREE.ConeGeometry(12, 8, 32);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xE55137 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 11, 0);  // Higher position for the roof
    roof.castShadow = true;
    scene.add(roof);

    // Center pole
    const poleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(0, 6, 0);
    pole.castShadow = true;
    scene.add(pole);

    // Create horses
    const horseColors = [0xff0000, 0xffff00, 0x0000ff, 0xffffff, 0x00ff00, 0xff00ff];

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const horseGroup = new THREE.Group();

      // Simple horse body
      const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: horseColors[i % horseColors.length]
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.5;
      horseGroup.add(body);

      // Horse head
      const headGeometry = new THREE.BoxGeometry(1, 1, 1);
      const head = new THREE.Mesh(headGeometry, bodyMaterial);
      head.position.set(0, 1, 2);
      horseGroup.add(head);

      // Horse legs
      for (let j = 0; j < 4; j++) {
        const legGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
        const leg = new THREE.Mesh(legGeometry, bodyMaterial);
        const xPos = j < 2 ? -0.5 : 0.5;
        const zPos = j % 2 === 0 ? 1 : -1;
        leg.position.set(xPos, -0.5, zPos);
        horseGroup.add(leg);
      }

      // Pole for horse
      const horsePoleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
      const horsePole = new THREE.Mesh(horsePoleGeometry, poleMaterial);
      horsePole.position.set(0, -1.5, 0);
      horseGroup.add(horsePole);

      // Position the horse
      horseGroup.position.set(
        7 * Math.cos(angle),
        3,  // Raised height for the horses
        7 * Math.sin(angle)
      );
      horseGroup.rotation.y = -angle + Math.PI / 2;  // Orient horses to face outward

      platform.add(horseGroup);  // Add horses to the platform so they rotate with it
    }
  }

  // Function to create water rides
  function createWaterRide(scene) {
    // Water pool
    const poolGeometry = new THREE.CylinderGeometry(20, 20, 1, 32);
    const poolMaterial = new THREE.MeshStandardMaterial({
      color: 0x4444ff,
      transparent: true,
      opacity: 0.7
    });
    const pool = new THREE.Mesh(poolGeometry, poolMaterial);
    pool.position.set(-60, 0, 60);
    pool.receiveShadow = true;
    scene.add(pool);

    // Water slide structure
    const slideGroup = new THREE.Group();

    // Slide tower
    const towerGeometry = new THREE.BoxGeometry(5, 15, 5);
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.set(0, 7.5, 0);
    tower.castShadow = true;
    slideGroup.add(tower);

    // Slide (using a custom curved shape)
    const slideCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 15, 0),
      new THREE.Vector3(5, 13, 5),
      new THREE.Vector3(10, 10, 8),
      new THREE.Vector3(15, 6, 10),
      new THREE.Vector3(18, 2, 12)
    ]);

    const slideGeometry = new THREE.TubeGeometry(slideCurve, 20, 1, 8, false);
    const slideMaterial = new THREE.MeshStandardMaterial({ color: 0xff9500 });
    const slide = new THREE.Mesh(slideGeometry, slideMaterial);
    slide.castShadow = true;
    slideGroup.add(slide);

    // Position the entire water ride
    slideGroup.position.set(-70, 0, 50);
    scene.add(slideGroup);

    // Add some inflatable tubes in the pool
    const tubeGeometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
    const tubeColors = [0xff0000, 0x00ff00, 0xffff00];

    for (let i = 0; i < 5; i++) {
      const tubeMaterial = new THREE.MeshStandardMaterial({
        color: tubeColors[i % tubeColors.length]
      });
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);

      // Random positions within the pool
      const distance = Math.random() * 10;
      const angle = Math.random() * Math.PI * 2;

      tube.position.set(
        -60 + distance * Math.cos(angle),
        0.5,
        60 + distance * Math.sin(angle)
      );

      tube.rotation.x = Math.PI / 2;
      tube.castShadow = true;
      scene.add(tube);
    }
  }

  // Function to create buildings
  function createBuildings(scene) {
    // Create entrance building
    const entranceGeometry = new THREE.BoxGeometry(20, 10, 5);
    const entranceMaterial = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });
    const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
    entrance.position.set(0, 5, 80);
    entrance.castShadow = true;
    entrance.receiveShadow = true;
    scene.add(entrance);

    // Entrance roof
    // Entrance roof
    const roofGeometry = new THREE.ConeGeometry(20, 8, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const entranceRoof = new THREE.Mesh(roofGeometry, roofMaterial);
    entranceRoof.position.set(0, 14, 80);
    entranceRoof.rotation.y = Math.PI / 4;
    entranceRoof.castShadow = true;
    scene.add(entranceRoof);

    // Entrance doors
    const doorGeometry = new THREE.BoxGeometry(3, 6, 0.2);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

    const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    leftDoor.position.set(-1.5, 3, 77.5);
    leftDoor.castShadow = true;
    scene.add(leftDoor);

    const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    rightDoor.position.set(1.5, 3, 77.5);
    rightDoor.castShadow = true;
    scene.add(rightDoor);

    // Food stands
    const createFoodStand = (x, z, color) => {
      const standGroup = new THREE.Group();

      // Stand base
      const standGeometry = new THREE.BoxGeometry(8, 5, 8);
      const standMaterial = new THREE.MeshStandardMaterial({ color });
      const stand = new THREE.Mesh(standGeometry, standMaterial);
      stand.position.y = 2.5;
      stand.castShadow = true;
      standGroup.add(stand);

      // Stand roof
      const standRoofGeometry = new THREE.ConeGeometry(6, 3, 4);
      const standRoof = new THREE.Mesh(standRoofGeometry, roofMaterial);
      standRoof.position.y = 6.5;
      standRoof.rotation.y = Math.PI / 4;
      standRoof.castShadow = true;
      standGroup.add(standRoof);

      // Counter
      const counterGeometry = new THREE.BoxGeometry(8, 1, 2);
      const counterMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 });
      const counter = new THREE.Mesh(counterGeometry, counterMaterial);
      counter.position.set(0, 3, 5);
      counter.castShadow = true;
      standGroup.add(counter);

      standGroup.position.set(x, 0, z);
      scene.add(standGroup);
    };

    // Create several food stands
    createFoodStand(30, 60, 0xFF5733); // Orange
    createFoodStand(50, 30, 0x33FF57); // Green
    createFoodStand(-30, 60, 0x5733FF); // Purple

    // Restroom building
    const restroomGeometry = new THREE.BoxGeometry(12, 6, 8);
    const restroomMaterial = new THREE.MeshStandardMaterial({ color: 0xBFBFBF });
    const restroom = new THREE.Mesh(restroomGeometry, restroomMaterial);
    restroom.position.set(60, 3, 60);
    restroom.castShadow = true;
    scene.add(restroom);

    // Restroom roof
    const restroomRoofGeometry = new THREE.BoxGeometry(14, 1, 10);
    const restroomRoof = new THREE.Mesh(restroomRoofGeometry, roofMaterial);
    restroomRoof.position.set(60, 6.5, 60);
    restroomRoof.castShadow = true;
    scene.add(restroomRoof);

    // Ticket booth
    const boothGeometry = new THREE.BoxGeometry(6, 4, 6);
    const boothMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const booth = new THREE.Mesh(boothGeometry, boothMaterial);
    booth.position.set(0, 2, 70);
    booth.castShadow = true;
    scene.add(booth);

    // Booth roof
    const boothRoofGeometry = new THREE.ConeGeometry(5, 3, 4);
    const boothRoof = new THREE.Mesh(boothRoofGeometry, roofMaterial);
    boothRoof.position.set(0, 5.5, 70);
    boothRoof.rotation.y = Math.PI / 4;
    boothRoof.castShadow = true;
    scene.add(boothRoof);

    // Gift shop
    const giftShopGeometry = new THREE.BoxGeometry(15, 7, 10);
    const giftShopMaterial = new THREE.MeshStandardMaterial({ color: 0xADD8E6 });
    const giftShop = new THREE.Mesh(giftShopGeometry, giftShopMaterial);
    giftShop.position.set(-40, 3.5, 30);
    giftShop.castShadow = true;
    scene.add(giftShop);

    // Gift shop roof
    const giftShopRoofGeometry = new THREE.BoxGeometry(17, 1, 12);
    const giftShopRoof = new THREE.Mesh(giftShopRoofGeometry, roofMaterial);
    giftShopRoof.position.set(-40, 7.5, 30);
    giftShopRoof.castShadow = true;
    scene.add(giftShopRoof);

    // Windows for gift shop
    for (let i = -1; i <= 1; i += 2) {
      const windowGeometry = new THREE.PlaneGeometry(3, 2);
      const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x87CEFA,
        transparent: true,
        opacity: 0.7
      });
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(-40 + (i * 5), 4, 35.01);
      window.castShadow = false;
      scene.add(window);
    }
  }

  // Function to create trees and decorative elements
  function createTrees(scene) {
    // Create trees distributed around the park
    const createTree = (x, z) => {
      const treeGroup = new THREE.Group();

      // Tree trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 2, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 1;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // Tree foliage (multiple layers for more realistic look)
      const foliageColors = [0x228B22, 0x006400, 0x2E8B57];

      for (let i = 0; i < 3; i++) {
        const foliageGeometry = new THREE.ConeGeometry(2 - i * 0.5, 3, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({
          color: foliageColors[i % foliageColors.length]
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 3 + i * 1.5;
        foliage.castShadow = true;
        treeGroup.add(foliage);
      }

      treeGroup.position.set(x, 0, z);
      scene.add(treeGroup);
    };

    // Create trees around the perimeter and scattered through the park
    const treePositions = [
      // Perimeter trees
      { x: 80, z: 80 }, { x: 80, z: 60 }, { x: 80, z: 40 }, { x: 80, z: 20 },
      { x: 80, z: 0 }, { x: 80, z: -20 }, { x: 80, z: -40 }, { x: 80, z: -60 },
      { x: 60, z: -80 }, { x: 40, z: -80 }, { x: 20, z: -80 }, { x: 0, z: -80 },
      { x: -20, z: -80 }, { x: -40, z: -80 }, { x: -60, z: -80 }, { x: -80, z: -80 },
      { x: -80, z: -60 }, { x: -80, z: -40 }, { x: -80, z: -20 }, { x: -80, z: 0 },
      { x: -80, z: 20 }, { x: -80, z: 40 }, { x: -80, z: 60 }, { x: -80, z: 80 },
      { x: -60, z: 80 }, { x: -40, z: 80 }, { x: -20, z: 80 }, { x: 20, z: 80 },
      { x: 40, z: 80 }, { x: 60, z: 80 },

      // Random trees inside park
      { x: 30, z: -30 }, { x: -20, z: 40 }, { x: 10, z: 30 }, { x: -30, z: -20 },
      { x: 40, z: 10 }, { x: -40, z: -10 }, { x: 20, z: -50 }, { x: -50, z: 20 }
    ];

    treePositions.forEach(pos => {
      createTree(pos.x, pos.z);
    });

    // Create bushes and flower beds
    const createBush = (x, z) => {
      const bushGeometry = new THREE.SphereGeometry(1.5, 8, 8);
      const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
      const bush = new THREE.Mesh(bushGeometry, bushMaterial);
      bush.position.set(x, 1.5, z);
      bush.castShadow = true;
      scene.add(bush);
    };

    // Create flower beds
    const createFlowerBed = (x, z, size) => {
      const bedGeometry = new THREE.CircleGeometry(size, 16);
      const bedMaterial = new THREE.MeshStandardMaterial({ color: 0x3A2E39 });
      const bed = new THREE.Mesh(bedGeometry, bedMaterial);
      bed.rotation.x = -Math.PI / 2;
      bed.position.set(x, 0.05, z);
      bed.receiveShadow = true;
      scene.add(bed);

      // Add flowers
      const flowerColors = [0xFF0000, 0xFFFF00, 0xFF00FF, 0xFFFFFF, 0x00FFFF];
      const flowerCount = Math.floor(size * 5);

      for (let i = 0; i < flowerCount; i++) {
        const radius = Math.random() * (size - 0.5);
        const angle = Math.random() * Math.PI * 2;
        const flowerX = x + radius * Math.cos(angle);
        const flowerZ = z + radius * Math.sin(angle);

        const flowerGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const flowerMaterial = new THREE.MeshStandardMaterial({
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)]
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(flowerX, 0.3, flowerZ);
        flower.castShadow = true;
        scene.add(flower);

        // Flower stem
        const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
        const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set(flowerX, 0.15, flowerZ);
        stem.castShadow = true;
        scene.add(stem);
      }
    };

    // Add bushes around key attractions
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      createBush(15 * Math.cos(angle), 15 * Math.sin(angle));
    }

    // Create flowerbeds at park entrance and near attractions
    createFlowerBed(0, 65, 5);
    createFlowerBed(40, -40, 4);
    createFlowerBed(-40, 40, 4);
    createFlowerBed(30, 30, 3);

    // Add benches
    const createBench = (x, z, rotation) => {
    const benchGroup = new THREE.Group();

      // Bench seat
      const seatGeometry = new THREE.BoxGeometry(3, 0.3, 1);
      const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const seat = new THREE.Mesh(seatGeometry, seatMaterial);
      seat.position.y = 0.6;
      seat.castShadow = true;
      benchGroup.add(seat);

      // Bench legs
      for (let i = -1; i <= 1; i += 2) {
        const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 1);
        const leg = new THREE.Mesh(legGeometry, seatMaterial);
        leg.position.set(i * 1.3, 0.3, 0);
        leg.castShadow = true;
        benchGroup.add(leg);
      }

      // Bench back
      const backGeometry = new THREE.BoxGeometry(3, 1, 0.2);
      const back = new THREE.Mesh(backGeometry, seatMaterial);
      back.position.set(0, 1.2, -0.4);
      back.castShadow = true;
      benchGroup.add(back);

      benchGroup.position.set(x, 0, z);
      benchGroup.rotation.y = rotation;
      scene.add(benchGroup);
    };

    // Add benches throughout the park
    createBench(10, 50, 0);
    createBench(20, 40, Math.PI / 4);
    createBench(-10, 40, -Math.PI / 4);
    createBench(40, 10, Math.PI / 2);
    createBench(-40, 0, -Math.PI / 2);
    createBench(0, -40, Math.PI);
    createBench(-20, -30, Math.PI * 3 / 4);

    // Create trash cans
    const createTrashCan = (x, z) => {
      const canGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 8);
      const canMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
      const can = new THREE.Mesh(canGeometry, canMaterial);
      can.position.set(x, 0.75, z);
      can.castShadow = true;
      scene.add(can);
    };

    // Place trash cans near benches and attractions
    createTrashCan(12, 50);
    createTrashCan(22, 40);
    createTrashCan(-8, 40);
    createTrashCan(40, 12);
    createTrashCan(-38, 0);
    createTrashCan(2, -40);
    createTrashCan(-18, -30);
  }

  // Camera position selector buttons
  const cameraPositions = [
    { name: "Overview", pos: { x: 0, y: 50, z: 100 } },
    { name: "Roller Coaster", pos: { x: -60, y: 20, z: -60 } },
    { name: "Ferris Wheel", pos: { x: 50, y: 25, z: -30 } },
    { name: "Tower", pos: { x: -30, y: 20, z: 50 } },
    { name: "Carousel", pos: { x: 0, y: 20, z: 20 } },
    { name: "Entrance", pos: { x: 0, y: 20, z: 60 } }
  ];

  return (
    <div className="relative w-full h-screen">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading Amusement Park...</div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-70 p-2 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Camera Views</h2>
        <div className="flex flex-col space-y-2">
          {cameraPositions.map((pos) => (
            <button
              key={pos.name}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setCameraPosition(pos.pos)}
            >
              {pos.name}
            </button>
          ))}
        </div>
      </div>

      <div ref={mountRef} className="w-full h-full"></div>

      <div className="absolute bottom-4 right-4 z-10 bg-white bg-opacity-70 p-2 rounded-lg">
        <p className="text-sm">
          Use mouse to navigate: Left click + drag to rotate, scroll to zoom, right click + drag to pan
        </p>
      </div>
    </div>
  );
};

export default AmusementPark
