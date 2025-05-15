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
    createWoodenDropTower(scene);
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

    // Function to create a wooden drop tower
  function createWoodenDropTower(scene) {
  const towerGroup = new THREE.Group();
  towerGroup.position.set(-40, 0, -60);

  // Materials
  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    roughness: 0.8,
    metalness: 0.2
  });

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.4,
    metalness: 0.8
  });

  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0x964B00,
    roughness: 0.7
  });

  // Base platform
  const basePlatformGeometry = new THREE.CylinderGeometry(10, 10, 1, 16);
  const basePlatform = new THREE.Mesh(basePlatformGeometry, platformMaterial);
  basePlatform.position.y = 0;
  basePlatform.castShadow = true;
  basePlatform.receiveShadow = true;
  towerGroup.add(basePlatform);

  // Tower structure (wooden framework)
  const createWoodenFrame = () => {
    const frameGroup = new THREE.Group();

    // Four corner pillars
    const cornerPositions = [
      { x: 6, z: 6 },
      { x: 6, z: -6 },
      { x: -6, z: 6 },
      { x: -6, z: -6 }
    ];

    // Create main support pillars
    cornerPositions.forEach(pos => {
      const pillarGeometry = new THREE.BoxGeometry(1.5, 60, 1.5);
      const pillar = new THREE.Mesh(pillarGeometry, woodMaterial);
      pillar.position.set(pos.x, 30, pos.z);
      pillar.castShadow = true;
      frameGroup.add(pillar);
    });

    // Create horizontal supports at different heights
    for (let height = 5; height <= 55; height += 10) {
      // X-direction supports
      for (let z = -6; z <= 6; z += 12) {
        const supportGeometry = new THREE.BoxGeometry(13, 1, 1);
        const support = new THREE.Mesh(supportGeometry, woodMaterial);
        support.position.set(0, height, z);
        support.castShadow = true;
        frameGroup.add(support);
      }

      // Z-direction supports
      for (let x = -6; x <= 6; x += 12) {
        const supportGeometry = new THREE.BoxGeometry(1, 1, 13);
        const support = new THREE.Mesh(supportGeometry, woodMaterial);
        support.position.set(x, height, 0);
        support.castShadow = true;
        frameGroup.add(support);
      }

      // Cross braces (X pattern)
      const createCrossBrace = (startX, startZ, endX, endZ, height) => {
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
        const braceGeometry = new THREE.BoxGeometry(length, 0.7, 0.7);
        const brace = new THREE.Mesh(braceGeometry, woodMaterial);

        // Position at midpoint
        brace.position.set(
          (startX + endX) / 2,
          height,
          (startZ + endZ) / 2
        );

        // Rotate to point from start to end
        brace.rotation.y = Math.atan2(endZ - startZ, endX - startX);

        brace.castShadow = true;
        frameGroup.add(brace);
      };

      // Add cross braces to each side
      if (height % 20 === 5) { // Add cross braces every other level
        createCrossBrace(-6, -6, 6, 6, height);
        createCrossBrace(6, -6, -6, 6, height);
        createCrossBrace(-6, -6, -6, 6, height);
        createCrossBrace(6, -6, 6, 6, height);
      }
    }

    return frameGroup;
  };

  const woodenFrame = createWoodenFrame();
  towerGroup.add(woodenFrame);

  // Create track rails for elevator
  const railGeometry = new THREE.BoxGeometry(0.5, 55, 0.5);
  const railMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.9
  });

  // Add four rails, one at each corner inside the structure
  const railPositions = [
    { x: 4, z: 4 },
    { x: 4, z: -4 },
    { x: -4, z: 4 },
    { x: -4, z: -4 }
  ];

  railPositions.forEach(pos => {
    const rail = new THREE.Mesh(railGeometry, railMaterial);
    rail.position.set(pos.x, 27.5, pos.z);
    rail.castShadow = true;
    towerGroup.add(rail);
  });

  // Create elevator car
  const elevatorGroup = new THREE.Group();
  elevatorGroup.name = 'dropTowerElevator';
  elevatorGroup.position.y = 2; // Starting position

  // Elevator platform
  const platformGeometry = new THREE.BoxGeometry(8, 1, 8);
  const elevatorPlatform = new THREE.Mesh(platformGeometry, metalMaterial);
  elevatorPlatform.castShadow = true;
  elevatorGroup.add(elevatorPlatform);

  // Seats - create a circle of seats
  const seatMaterial = new THREE.MeshStandardMaterial({ color: 0xDD0000 });
  const seatCount = 8;

  for (let i = 0; i < seatCount; i++) {
    const angle = (i / seatCount) * Math.PI * 2;
    const radius = 3;

    // Seat base
    const seatBaseGeometry = new THREE.BoxGeometry(1.2, 0.5, 1.2);
    const seatBase = new THREE.Mesh(seatBaseGeometry, seatMaterial);
    seatBase.position.set(
      Math.cos(angle) * radius,
      1,
      Math.sin(angle) * radius
    );
    elevatorGroup.add(seatBase);

    // Seat back
    const seatBackGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.3);
    const seatBack = new THREE.Mesh(seatBackGeometry, seatMaterial);
    seatBack.position.set(
      Math.cos(angle) * radius,
      2,
      Math.sin(angle) * radius + (Math.cos(angle) < 0 ? 0.45 : -0.45)
    );
    seatBack.rotation.y = angle;
    elevatorGroup.add(seatBack);

    // Safety bar
    const barGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    const bar = new THREE.Mesh(barGeometry, metalMaterial);
    bar.position.set(
      Math.cos(angle) * radius,
      2,
      Math.sin(angle) * radius + (Math.cos(angle) < 0 ? -0.5 : 0.5)
    );
    bar.rotation.x = Math.PI / 2;
    bar.rotation.z = angle;
    elevatorGroup.add(bar);
  }

  // Add center column
  const centerColumnGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 8);
  const centerColumn = new THREE.Mesh(centerColumnGeometry, metalMaterial);
  centerColumn.position.y = 1;
  elevatorGroup.add(centerColumn);

  towerGroup.add(elevatorGroup);

  // Top cap of the tower
  const topCapGeometry = new THREE.CylinderGeometry(8, 8, 2, 16);
  const topCap = new THREE.Mesh(topCapGeometry, woodMaterial);
  topCap.position.y = 59;
  topCap.castShadow = true;
  towerGroup.add(topCap);

  // Add decorative flags at the top
  const flagMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const radius = 7;

    // Flag pole
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(
      Math.cos(angle) * radius,
      61,
      Math.sin(angle) * radius
    );
    towerGroup.add(pole);

    // Flag
    const flagGeometry = new THREE.PlaneGeometry(1.5, 0.8);
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(
      Math.cos(angle) * radius + 0.8,
      62,
      Math.sin(angle) * radius
    );
    flag.rotation.y = angle + Math.PI / 2;
    towerGroup.add(flag);
  }

  // Add queue line barriers
  const barrierMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
  const ropeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);

  // Create a simple queue line
  for (let i = 0; i < 5; i++) {
    // Left side posts
    const leftPost = new THREE.Mesh(postGeometry, barrierMaterial);
    leftPost.position.set(-12 - i * 2, 0.5, 3);
    towerGroup.add(leftPost);

    // Right side posts
    const rightPost = new THREE.Mesh(postGeometry, barrierMaterial);
    rightPost.position.set(-12 - i * 2, 0.5, -3);
    towerGroup.add(rightPost);

    // Connecting ropes
    if (i < 4) {
      const rope = new THREE.Mesh(ropeGeometry, barrierMaterial);
      rope.position.set(-13 - i * 2, 0.5, 0);
      rope.rotation.z = Math.PI / 2;
      towerGroup.add(rope);
    }
  }

  scene.add(towerGroup);
 }

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
