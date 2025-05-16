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
    createRollerCoaster(scene);
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
      
      // Animate roller coaster carts
      rollerCoasterCarts.forEach((cart, i) => {
        const offset = i * 0.5;
        const time = clock.getElapsedTime() + offset;
        
        // Make carts follow a complex path
        cart.position.x = 30 + 25 * Math.cos(time * 0.5);
        cart.position.z = 30 + 25 * Math.sin(time * 0.5);
        cart.position.y = 5 + 3 * Math.sin(time * 2);
        
        // Rotate cart to follow the path
        cart.rotation.y = Math.atan2(
          -25 * 0.5 * Math.sin(time * 0.5),
          -25 * 0.5 * Math.cos(time * 0.5)
        );
      });
      
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
  
  // Function to create the roller coaster
  function createRollerCoaster(scene) {
    // Roller coaster base
    const baseGeometry = new THREE.BoxGeometry(30, 2, 30);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(-60, 1, -60);
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);
    
    // Create roller coaster tracks (simplified as a torus for this demo)
    const trackGeometry = new THREE.TorusGeometry(25, 0.5, 8, 100);
    const trackMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.position.set(30, 5, 30);
    track.rotation.x = Math.PI / 2;
    track.castShadow = true;
    scene.add(track);
    
    // Add some supports
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const supportGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 8);
      const support = new THREE.Mesh(supportGeometry, baseMaterial);
      support.position.set(
        30 + 25 * Math.cos(angle),
        2.5,
        30 + 25 * Math.sin(angle)
      );
      support.castShadow = true;
      scene.add(support);
    }
    
    // Add roller coaster carts
    for (let i = 0; i < 3; i++) {
      const cartGeometry = new THREE.BoxGeometry(3, 1, 2);
      const cartMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
      const cart = new THREE.Mesh(cartGeometry, cartMaterial);
      cart.name = `rollerCoasterCart${i}`;
      cart.castShadow = true;
      scene.add(cart);
    }
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
    const roofGeometry = new THREE.ConeGeometry(15, 5, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 12.5, 80);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    scene.add(roof);
    
    // Food stand
    const standGeometry = new THREE.BoxGeometry(8, 6, 8);
    const standMaterial = new THREE.MeshStandardMaterial({ color: 0xff9966 });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.set(40, 3, 0);
    stand.castShadow = true;
    stand.receiveShadow = true;
    scene.add(stand);
    
    // Stand roof
    const standRoofGeometry = new THREE.ConeGeometry(6, 3, 4);
    const standRoofMaterial = new THREE.MeshStandardMaterial({ color: 0x993300 });
    const standRoof = new THREE.Mesh(standRoofGeometry, standRoofMaterial);
    standRoof.position.set(40, 7.5, 0);
    standRoof.rotation.y = Math.PI / 4;
    standRoof.castShadow = true;
    scene.add(standRoof);
    
    // Gift shop
    const shopGeometry = new THREE.BoxGeometry(10, 7, 10);
    const shopMaterial = new THREE.MeshStandardMaterial({ color: 0x99ccff });
    const shop = new THREE.Mesh(shopGeometry, shopMaterial);
    shop.position.set(-40, 3.5, 0);
    shop.castShadow = true;
    shop.receiveShadow = true;
    scene.add(shop);
    
    // Gift shop roof
    const shopRoofGeometry = new THREE.ConeGeometry(8, 4, 4);
    const shopRoofMaterial = new THREE.MeshStandardMaterial({ color: 0x3366cc });
    const shopRoof = new THREE.Mesh(shopRoofGeometry, shopRoofMaterial);
    shopRoof.position.set(-40, 9, 0);
    shopRoof.rotation.y = Math.PI / 4;
    shopRoof.castShadow = true;
    scene.add(shopRoof);
    
    // Restrooms
    const restroomGeometry = new THREE.BoxGeometry(6, 5, 6);
    const restroomMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const restroom = new THREE.Mesh(restroomGeometry, restroomMaterial);
    restroom.position.set(0, 2.5, -40);
    restroom.castShadow = true;
    restroom.receiveShadow = true;
    scene.add(restroom);
  }
  
  // Function to create trees and vegetation
  function createTrees(scene) {
    // Create trees scattered around the park
    for (let i = 0; i < 30; i++) {
      const treeGroup = new THREE.Group();
      
      // Random position, avoiding central area and attractions
      let x, z;
      do {
        x = (Math.random() - 0.5) * 400;
        z = (Math.random() - 0.5) * 400;
      } while (Math.sqrt(x * x + z * z) < 70 || Math.abs(x) > 200 || Math.abs(z) > 200);
      
      // Tree trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.5, 1, 5, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 2.5;
      trunk.castShadow = true;
      treeGroup.add(trunk);
      
      // Tree foliage
      const foliageGeometry = new THREE.ConeGeometry(3, 7, 8);
      const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x2e8b57 });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.y = 8;
      foliage.castShadow = true;
      treeGroup.add(foliage);
      
      treeGroup.position.set(x, 0, z);
      scene.add(treeGroup);
    }
    
    // Add some bushes near the entrance
    for (let i = 0; i < 10; i++) {
      const bushGeometry = new THREE.SphereGeometry(1.5, 8, 8);
      const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x3a9d23 });
      const bush = new THREE.Mesh(bushGeometry, bushMaterial);
      
      const x = 15 * (Math.random() - 0.5);
      const z = 70 + 5 * Math.random();
      
      bush.position.set(x, 1.5, z);
      bush.castShadow = true;
      scene.add(bush);
    }
  }
  
  const handleCameraChange = (preset) => {
    switch(preset) {
      case 'overhead':
        setCameraPosition({ x: 0, y: 150, z: 0 });
        break;
      case 'entrance':
        setCameraPosition({ x: 0, y: 10, z: 100 });
        break;
      case 'ferrisWheel':
        setCameraPosition({ x: 50, y: 30, z: -70 });
        break;
      case 'carousel':
        setCameraPosition({ x: 15, y: 10, z: 15 });
        break;
      case 'water':
        setCameraPosition({ x: -70, y: 20, z: 80 });
        break;
      default:
        setCameraPosition({ x: 0, y: 50, z: 100 });
    }
  };
  
  return (
    <div className="h-screen w-full relative">
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-white text-2xl">Loading Amusement Park...</div>
        </div>
      )}
      
      <div ref={mountRef} className="w-full h-full" />
      
      <div className="absolute top-4 left-4 p-4 bg-white bg-opacity-80 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">Amusement Park Controls</h2>
        <div className="space-y-2">
          <button 
            onClick={() => handleCameraChange('overhead')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Overhead View
          </button>
          <button 
            onClick={() => handleCameraChange('entrance')}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Entrance View
          </button>
          <button
            onClick={() => handleCameraChange('ferrisWheel')}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Ferris Wheel View
          </button>
          <button
            onClick={() => handleCameraChange('carousel')}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Carousel View
          </button>
          <button
            onClick={() => handleCameraChange('water')}
            className="w-full px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
          >
            Water Ride View
          </button>
        </div>
      </div>
    </div>
  );
};

// Move create* functions to a separate file for better organization
export const createPaths = (scene) => { /* ... */ };
export const createRollerCoaster = (scene) => { /* ... */ };
export const createFerrisWheel = (scene) => { /* ... */ };
export const createTower = (scene) => { /* ... */ };
export const createCarousel = (scene) => { /* ... */ };
export const createWaterRide = (scene) => { /* ... */ };
export const createBuildings = (scene) => { /* ... */ };
export const createTrees = (scene) => { /* ... */ };

export default AmusementPark;
