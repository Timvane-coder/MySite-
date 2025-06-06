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
    createWoodenTower(scene);  
    createBuildings(scene);
    createSewageTreatmentMachine(scene);
    createSewageTreatment(scene); 
    const towerCrane = createEnhancedTowerCrane(scene);
    scene.add(towerCrane);
    createTrees(scene);
    demonstrateCraneLift(scene);
    createGeometricShapesTree(scene, { x: 40, y: 0, z: -20 });
    populateTreeWithSampleShapes(scene); 
    const { sewageGroup, flowAnimations } = createSewageTreatmentSimulator(scene); // Changed to the new simulator


    setIsLoading(false);

    // Animation loop
    let rollerCoasterCarts = [];
    let ferrisWheel;
    let carouselPlatform;
    let towerRide;
    let towerElevator; 
    let sewageMixer;
    let sewageFlowSegments = [];
    let cleanWaterFlow;
    let sweepArms = [];
    let waterFlowParticles = [];
    let waterFlow;
    let geometricShapesTree;
    //let crane;
    //let towerCrane;

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
      } else if (object.name === 'towerElevator') {
        towerElevator = object; // Ad
      } else if (object.name === 'sewageMixer') {
        sewageMixer = object;
      } else if (object.name.includes('sewageFlowSegment')) {
        sewageFlowSegments.push(object);
      } else if (object.name === 'cleanWaterFlow') {
        cleanWaterFlow = object;
      } else if (object.name === 'waterFlow') {
        waterFlow = object;
      } else if (object.name.includes('sweepArm_')) {
        sweepArms.push(object);
      } else if (object.name === 'geometricShapesTree') {    // Add this check for tower crane
        geometricShapesTree = object;
      //} else if (object.name === 'towerCrane') {
        //crane = object;
      }
    });

    if (flowAnimations && flowAnimations.length > 0) {
      waterFlowParticles = flowAnimations;
    }


    const clock = new THREE.Clock();
    let towerDirection = 1;
    let towerPosition = 0;
    let lastOverflowToggleTime = 0;
    //let craneOperationTime = 0;                   // Add this line
    //let craneOperationState = 'rotate';

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const currentTime = clock.getElapsedTime(); 
      // Animate Ferris wheel
      if (ferrisWheel) {
        ferrisWheel.rotation.z += 0.005;
      }

      if (towerRide) {
    towerPosition += towerDirection * 0.3;
    if (towerPosition > 20) {
      towerDirection = -1;
    } else if (towerPosition < 0) {
      towerDirection = 1;
    }
    towerRide.position.y = towerPosition + 5;
  }
   
     if (sewageMixer) {
       //Rotate the mixer in the main tank
       sewageMixer.rotation.y += 0.03;
  }

  // Animate sewage flow segments
  if (sewageFlowSegments.length > 0) {
    // Create flowing effect by moving the segments
    for (let i = 0; i < sewageFlowSegments.length; i++) {
      const segment = sewageFlowSegments[i];
      // Reset position when it reaches the end
      if (segment.position.x >= -6) {
        segment.position.x = -14;
      } else {
        segment.position.x += 0.05;
      }
    }
  }

  // Animate clean water flow
  if (cleanWaterFlow) {
    // Pulsate the clean water flow to simulate flowing
    const pulsateScale = Math.sin(currentTime * 4) * 0.3 + 0.7;
    cleanWaterFlow.scale.set(1, 1, pulsateScale);
    
    // Periodically make the clean water flow visible/invisible
    const flowCycleTime = 8;
    const flowActiveTime = 6;
    const flowCyclePosition = currentTime % flowCycleTime;
    cleanWaterFlow.visible = flowCyclePosition < flowActiveTime;
  }



     if (towerRide) {
    towerPosition += towerDirection * 0.3;
    if (towerPosition > 20) {
      towerDirection = -1;
    } else if (towerPosition < 0) {
      towerDirection = 1;
    }
    towerRide.position.y = towerPosition + 5;
  }
  
  // Animate wooden tower elevator
  if (towerElevator) {
    const maxHeight = 50; // Maximum height
    const minHeight = 3;  // Minimum height
    const cycleTime = 30; // Time for one full cycle in seconds
    
    // Calculate position based on time
    const time = (Date.now() % (cycleTime * 1000)) / 1000;
    const normalizedTime = time / cycleTime; // 0 to 1
    
    // Use sine wave for smooth up and down movement
    const elevatorPosition = minHeight + (maxHeight - minHeight) * 
      Math.sin(normalizedTime * Math.PI * 2) * 0.5 + (maxHeight - minHeight) * 0.5;
    
    towerElevator.position.y = elevatorPosition;
  }


      // Animate carousel
      if (carouselPlatform) {
        carouselPlatform.rotation.y += 0.01;
      }
      if (waterFlow) {
    // Toggle water overflow visibility every 10 seconds (5 seconds on, 5 seconds off)
        const cycleTime = 10;
        const overflowTime = 5;
        const cyclePosition = currentTime % cycleTime;
        waterFlow.visible = cyclePosition < overflowTime;
      }

      sweepArms.forEach((arm, index) => {
    // Different speed for each tank to add variety
        const rotationSpeed = 0.005 + (index * 0.002);
        arm.rotation.y += rotationSpeed;
     });
     
     waterFlowParticles.forEach(particle => {
       const { startX, startZ, endX, endZ, speed, offset } = particle.userData;
       const direction = new THREE.Vector3(endX - startX, 0, endZ - startZ);
       const length = direction.length();
       direction.normalize();
    
    // Update particle position
       particle.userData.offset = (particle.userData.offset + speed) % length;
       const currentOffset = particle.userData.offset;
    
       particle.position.x = startX + direction.x * currentOffset;
       particle.position.z = startZ + direction.z * currentOffset;
    
    // Add a small vertical bounce
       particle.position.y = 4 + Math.sin(currentTime * 5 + currentOffset) * 0.1;
    });

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
      if (towerCrane) {
        animateEnhancedTowerCrane(towerCrane,scene, delta);
      }

      if (geometricShapesTree) {
        animateGeometricShapesTree(geometricShapesTree, currentTime);
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


// Function to set up crane controls for user interaction

function createGeometricShapesTree(scene, position = { x: 40, y: 0, z: -20 }) {
  // Create main group for the entire tree structure
  const shapesTree = new THREE.Group();
  shapesTree.name = 'geometricShapesTree';
  shapesTree.position.set(position.x, position.y, position.z);
  scene.add(shapesTree);

  // Materials for different parts
  const trunkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513, // Brown color for trunk and branches
    roughness: 0.8 
  });

  // Create the tree trunk - taller since no canopy
  const trunkGeometry = new THREE.CylinderGeometry(1.5, 2, 20, 8);
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 10; // Adjusted height
  shapesTree.add(trunk);

  // No canopy - just branches and shapes for a cleaner educational look

  // Define branch positions and angles for geometric shape containers - adjusted heights for no canopy
  const branchData = [
    // Left side branches
    { angle: -Math.PI * 0.7, length: 8, height: 16, shapeName: 'cube' },
    { angle: -Math.PI * 0.5, length: 7, height: 12, shapeName: 'pyramid' },
    { angle: -Math.PI * 0.3, length: 6, height: 8, shapeName: 'cone' },
    { angle: -Math.PI * 0.8, length: 9, height: 20, shapeName: 'triangularPrism' },
    
    // Right side branches
    { angle: Math.PI * 0.7, length: 8, height: 18, shapeName: 'sphere' },
    { angle: Math.PI * 0.5, length: 7, height: 14, shapeName: 'cylinder' },
    { angle: Math.PI * 0.3, length: 6, height: 10, shapeName: 'hexagon' },
    { angle: Math.PI * 0.8, length: 9, height: 22, shapeName: 'rectangle' },
    
    // Top branches
    { angle: 0, length: 6, height: 24, shapeName: 'pentagon' },
    { angle: Math.PI * 0.15, length: 5, height: 25, shapeName: 'parallelogram' },
    { angle: -Math.PI * 0.15, length: 5, height: 25, shapeName: 'rightTriangle' },
    
    // Lower branches
    { angle: Math.PI * 0.9, length: 5, height: 6, shapeName: 'square' },
    { angle: -Math.PI * 0.9, length: 5, height: 6, shapeName: 'cuboid' }
  ];

  // Store container references for later use
  const shapeContainers = {};

  // Create branches with geometric shape containers
  branchData.forEach((branch, index) => {
    // Create branch
    const branchGeometry = new THREE.CylinderGeometry(0.3, 0.5, branch.length, 6);
    const branchMesh = new THREE.Mesh(branchGeometry, trunkMaterial);
    
    // Position and rotate branch
    const branchX = Math.cos(branch.angle) * (branch.length / 2 + 2);
    const branchZ = Math.sin(branch.angle) * (branch.length / 2 + 2);
    branchMesh.position.set(branchX, branch.height, branchZ);
    branchMesh.rotation.z = -branch.angle + Math.PI / 2;
    shapesTree.add(branchMesh);

    // Create container at the end of branch
    const containerPosition = {
      x: Math.cos(branch.angle) * (branch.length + 4),
      y: branch.height,
      z: Math.sin(branch.angle) * (branch.length + 4)
    };

    const container = createShapeContainer(branch.shapeName, containerPosition);
    container.name = `container_${branch.shapeName}`;
    shapesTree.add(container);
    
    // Store reference for later access
    shapeContainers[branch.shapeName] = container;
  });

  // Store container references in the tree's userData for easy access
  shapesTree.userData.containers = shapeContainers;
  
  // Add a sign at the base of the tree
  createTreeSign(shapesTree);

  return shapesTree;
}

// Function to create individual shape containers
function createShapeContainer(shapeName, position) {
  const container = new THREE.Group();
  container.position.set(position.x, position.y, position.z);
  
  // Create a transparent bounding box to show the container area
  const containerMaterial = new THREE.MeshStandardMaterial({
    color: getShapeColor(shapeName),
    transparent: true,
    opacity: 0.3,
    wireframe: false
  });

  // Create a wireframe outline
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: getShapeColor(shapeName),
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });

  let containerGeometry, wireframeGeometry;
  
  // Create appropriate container geometry based on shape name
  switch(shapeName) {
    case 'cube':
      containerGeometry = new THREE.BoxGeometry(3, 3, 3);
      wireframeGeometry = new THREE.BoxGeometry(3.1, 3.1, 3.1);
      break;
    case 'sphere':
      containerGeometry = new THREE.SphereGeometry(2, 16, 12);
      wireframeGeometry = new THREE.SphereGeometry(2.1, 16, 12);
      break;
    case 'cylinder':
      containerGeometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
      wireframeGeometry = new THREE.CylinderGeometry(1.6, 1.6, 3.1, 16);
      break;
    case 'cone':
      containerGeometry = new THREE.ConeGeometry(1.5, 3, 16);
      wireframeGeometry = new THREE.ConeGeometry(1.6, 3.1, 16);
      break;
    case 'pyramid':
      containerGeometry = new THREE.ConeGeometry(1.5, 3, 4);
      wireframeGeometry = new THREE.ConeGeometry(1.6, 3.1, 4);
      break;
    case 'cuboid':
    case 'rectangle':
      containerGeometry = new THREE.BoxGeometry(4, 2, 3);
      wireframeGeometry = new THREE.BoxGeometry(4.1, 2.1, 3.1);
      break;
    case 'triangularPrism':
      containerGeometry = createTriangularPrismGeometry(2, 3);
      wireframeGeometry = createTriangularPrismGeometry(2.1, 3.1);
      break;
    case 'hexagon':
      containerGeometry = new THREE.CylinderGeometry(2, 2, 1, 6);
      wireframeGeometry = new THREE.CylinderGeometry(2.1, 2.1, 1.1, 6);
      break;
    case 'pentagon':
      containerGeometry = new THREE.CylinderGeometry(2, 2, 1, 5);
      wireframeGeometry = new THREE.CylinderGeometry(2.1, 2.1, 1.1, 5);
      break;
    case 'square':
      containerGeometry = new THREE.BoxGeometry(3, 0.2, 3);
      wireframeGeometry = new THREE.BoxGeometry(3.1, 0.3, 3.1);
      break;
    case 'parallelogram':
      containerGeometry = createParallelogramGeometry(3, 2);
      wireframeGeometry = createParallelogramGeometry(3.1, 2.1);
      break;
    case 'rightTriangle':
      containerGeometry = createRightTriangleGeometry(2.5);
      wireframeGeometry = createRightTriangleGeometry(2.6);
      break;
    default:
      containerGeometry = new THREE.BoxGeometry(2, 2, 2);
      wireframeGeometry = new THREE.BoxGeometry(2.1, 2.1, 2.1);
  }

  // Create the container mesh
  const containerMesh = new THREE.Mesh(containerGeometry, containerMaterial);
  const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
  
  container.add(containerMesh);
  container.add(wireframeMesh);

  // Add a floating label
  createShapeLabel(container, shapeName);

  // Store metadata
  container.userData = {
    shapeName: shapeName,
    isEmpty: true,
    containedObject: null
  };

  return container;
}

// Helper function to create triangular prism geometry
function createTriangularPrismGeometry(size, height) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(size, 0);
  shape.lineTo(size/2, size * Math.sin(Math.PI/3));
  shape.lineTo(0, 0);
  
  const extrudeSettings = {
    depth: height,
    bevelEnabled: false
  };
  
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Helper function to create parallelogram geometry
function createParallelogramGeometry(width, height) {
  const shape = new THREE.Shape();
  const skew = 0.5;
  shape.moveTo(-width/2 + skew, -height/2);
  shape.lineTo(width/2 + skew, -height/2);
  shape.lineTo(width/2 - skew, height/2);
  shape.lineTo(-width/2 - skew, height/2);
  shape.lineTo(-width/2 + skew, -height/2);
  
  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: false
  };
  
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Helper function to create right triangle geometry
function createRightTriangleGeometry(size) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(size, 0);
  shape.lineTo(0, size);
  shape.lineTo(0, 0);
  
  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: false
  };
  
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Helper function to get appropriate colors for each shape
function getShapeColor(shapeName) {
  const colors = {
    'cube': 0x228B22,        // Green
    'sphere': 0x4169E1,      // Royal Blue
    'cylinder': 0x87CEEB,    // Sky Blue
    'cone': 0x1E90FF,        // Dodger Blue
    'pyramid': 0xFF6347,     // Tomato Red
    'cuboid': 0xFF8C00,      // Dark Orange
    'rectangle': 0x20B2AA,   // Light Sea Green
    'triangularPrism': 0x00CED1, // Dark Turquoise
    'hexagon': 0xDDA0DD,     // Plum
    'pentagon': 0xFFA07A,    // Light Salmon
    'square': 0x00CED1,      // Dark Turquoise
    'parallelogram': 0xFFB6C1, // Light Pink
    'rightTriangle': 0x98FB98  // Pale Green
  };
  return colors[shapeName] || 0x888888;
}

// Function to create floating labels for each shape
function createShapeLabel(container, shapeName) {
  // Create a simple text representation using a plane with texture
  // In a real implementation, you might use HTML/CSS labels or sprite-based text
  const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
  const labelMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9
  });
  
  const label = new THREE.Mesh(labelGeometry, labelMaterial);
  label.position.y = 3;
  label.lookAt(0, 3, 10); // Make label face towards typical camera position
  
  container.add(label);
  
  // Store the shape name for reference
  label.userData.text = shapeName;
}

// Function to create a sign at the base of the tree
function createTreeSign(treeGroup) {
  // Create sign post
  const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
  const postMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const post = new THREE.Mesh(postGeometry, postMaterial);
  post.position.set(-5, 2, -5);
  treeGroup.add(post);

  // Create sign board
  const signGeometry = new THREE.BoxGeometry(6, 3, 0.3);
  const signMaterial = new THREE.MeshStandardMaterial({ color: 0xF5DEB3 });
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.set(-5, 4.5, -5);
  treeGroup.add(sign);

  // Add border to sign
  const borderGeometry = new THREE.BoxGeometry(6.2, 3.2, 0.25);
  const borderMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  border.position.set(-5, 4.5, -5.05);
  treeGroup.add(border);
}

// Function to place a 3D object into a container
function placeObjectInContainer(shapesTree, shapeName, object) {
  if (!shapesTree || !shapesTree.userData.containers) {
    console.warn('Shapes tree not found or containers not initialized');
    return false;
  }

  const container = shapesTree.userData.containers[shapeName];
  if (!container) {
    console.warn(`Container for shape ${shapeName} not found`);
    return false;
  }

  if (!container.userData.isEmpty) {
    console.warn(`Container for ${shapeName} is already occupied`);
    return false;
  }

  // Clear any existing object
  if (container.userData.containedObject) {
    container.remove(container.userData.containedObject);
  }

  // Position object at container center
  object.position.set(0, 0, 0);
  container.add(object);
  
  // Update container metadata
  container.userData.isEmpty = false;
  container.userData.containedObject = object;
  
  // Add gentle floating animation to the contained object
  object.userData.floatOffset = Math.random() * Math.PI * 2;
  
  return true;
}

// Function to remove object from container
function removeObjectFromContainer(shapesTree, shapeName) {
  if (!shapesTree || !shapesTree.userData.containers) {
    return null;
  }

  const container = shapesTree.userData.containers[shapeName];
  if (!container || container.userData.isEmpty) {
    return null;
  }

  const object = container.userData.containedObject;
  if (object) {
    container.remove(object);
    container.userData.isEmpty = true;
    container.userData.containedObject = null;
  }

  return object;
}

// Animation function for the shapes tree
function animateGeometricShapesTree(shapesTree, currentTime) {
  if (!shapesTree) return;

  // Animate floating objects in containers
  if (shapesTree.userData.containers) {
    Object.values(shapesTree.userData.containers).forEach(container => {
      if (!container.userData.isEmpty && container.userData.containedObject) {
        const object = container.userData.containedObject;
        const floatOffset = object.userData.floatOffset || 0;
        
        // Gentle floating motion
        object.position.y = Math.sin(currentTime * 2 + floatOffset) * 0.2;
        
        // Gentle rotation
        object.rotation.y += 0.01;
      }
    });
  }

  // Make labels always face the camera (billboard effect)
  shapesTree.traverse((child) => {
    if (child.userData && child.userData.text) {
      // In a real implementation, you would calculate the camera position
      // For now, we'll just rotate towards a general direction
      child.lookAt(shapesTree.position.x + 10, child.position.y, shapesTree.position.z + 10);
    }
  });
}

// Demo function to populate containers with sample shapes
function populateTreeWithSampleShapes(shapesTree) {
  if (!shapesTree) return;

  // Create sample 3D objects for demonstration
  const sampleShapes = {
    'cube': new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    ),
    'sphere': new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    ),
    'cylinder': new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 2, 16),
      new THREE.MeshStandardMaterial({ color: 0x00ffff })
    ),
    'cone': new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 16),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    ),
    'pyramid': new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 4),
      new THREE.MeshStandardMaterial({ color: 0xff6600 })
    )
  };

  // Place some sample shapes (you can expand this)
  Object.entries(sampleShapes).forEach(([shapeName, shape]) => {
    placeObjectInContainer(shapesTree, shapeName, shape);
  });
}
// Function to setup keyboard controls for the tower crane


// Function to setup keyboard controls for the tower crane

function createEnhancedTowerCrane(scene, position = { x: -60, y: 2.5, z: -30 }) {
  // Create a group for the entire crane
  const crane = new THREE.Group();
  crane.name = 'towerCrane';
  crane.position.set(position.x, position.y, position.z);
  scene.add(crane);
  
  // Materials with improved realism
  const craneMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf5a623, // Yellow/orange like in the diagram
    metalness: 0.7,
    roughness: 0.3 
  });
  
  const cabinMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    metalness: 0.5,
    roughness: 0.2
  });
  
  const metalMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888, 
    metalness: 0.8,
    roughness: 0.2
  });

  const concreteMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.9,
    metalness: 0.1
  });
  
  // Create the tower base (concrete foundation)
  const baseGeometry = new THREE.BoxGeometry(12, 1, 12);
  const base = new THREE.Mesh(baseGeometry, concreteMaterial);
  base.position.y = 0.5;
  base.name = 'craneBase';
  crane.add(base);
  
  // Create the mast (vertical tower)
  const mastHeight = 80;
  const mastWidth = 6;
  const mast = createMast(mastHeight, mastWidth, craneMaterial);
  mast.position.y = 1; // Position on top of the base
  mast.name = 'craneMast';
  crane.add(mast);
  
  // Add climbing frame near the top as in the diagram
  const climbingFrame = createClimbingFrame(craneMaterial);
  climbingFrame.position.set(-4, mastHeight - 5, 0);
  mast.add(climbingFrame);
  
  // Create the slewing unit (turntable) at the top of the mast
  const slewingUnit = new THREE.Group();
  slewingUnit.name = 'craneSlewingUnit';
  slewingUnit.position.y = mastHeight;
  crane.add(slewingUnit);
  
  // Add a visible slewing ring (turntable base) as in the diagram
  const slewingRingGeometry = new THREE.CylinderGeometry(mastWidth/1.5, mastWidth/1.5, 2, 24);
  const slewingRing = new THREE.Mesh(slewingRingGeometry, metalMaterial);
  slewingRing.name = 'craneSlewingRing';
  slewingUnit.add(slewingRing);

  // Add motor housing for the slewing unit as in the diagram
  const slewingMotor = createMotorHousing(metalMaterial);
  slewingMotor.position.set(0, 2, 0);
  slewingMotor.name = 'craneSlewingMotor';
  slewingUnit.add(slewingMotor);
  
  // Create operator cabin
  const cabin = createCraneCabin(cabinMaterial);
  cabin.position.set(1, 4, 0);
  cabin.name = 'craneOperatorCab';
  slewingUnit.add(cabin);

  // Create the counterweight section as in the diagram
  const counterweight = createCounterweight(metalMaterial, craneMaterial);
  counterweight.position.set(-8, 4, 0);
  counterweight.name = 'craneCounterweight';
  slewingUnit.add(counterweight);
  
  // Create the jib (main horizontal arm)
  const jibLength = 70;
  const jib = createCraneJib(jibLength, craneMaterial);
  jib.position.y = 6;
  jib.name = 'craneJib';
  slewingUnit.add(jib);
  
  // Create counter-jib (shorter back arm) as in the diagram
  const counterJib = createCounterJib(20, craneMaterial);
  counterJib.position.y = 6;
  counterJib.name = 'craneCounterJib';
  slewingUnit.add(counterJib);
  
  // Create the trolley system that moves along the jib
  const trolley = createTrolley(metalMaterial);
  trolley.position.set(25, 0, 0); // Initial position along the jib
  trolley.name = 'craneTrolley';
  jib.add(trolley);
  
  // Create the hook and rope
  const hookAndRope = createHookAndRope(25, metalMaterial);
  hookAndRope.name = 'craneHook';
  trolley.add(hookAndRope);
  
  // Add a motor to the trolley as shown in the diagram
  const trolleyMotor = createMotorHousing(metalMaterial, 0.8);
  trolleyMotor.position.set(0, -1, 0);
  trolleyMotor.name = 'craneTrolleyMotor';
  trolley.add(trolleyMotor);
  
  // Store initial properties for animation
  crane.userData = {
    // Base transform properties
    rotationSpeed: 0,
    targetRotation: 0,
    trolleyPosition: 25,
    targetTrolleyPosition: 25,
    hookHeight: 25,
    targetHookHeight: 25,
    
    // Physics properties for hook
    hookSwingAngleX: 0,
    hookSwingAngleZ: 0,
    hookSwingVelocityX: 0,
    hookSwingVelocityZ: 0,
    
    // Vertical movement properties for the entire crane
    verticalPosition: 0,
    targetVerticalPosition: 0,
    verticalSpeed: 0,
    isExtending: false,
    
    // Attached object
    attachedObject: null,
    
    // Collision detection properties
    collisionDetected: false,
    collisionAlarmTime: 0,
    collisionObjects: [], // Store references to objects that can collide
    hookCollisionRadius: 2.5 // Radius for collision detection around the hook
  };
  
  return crane;
}

// Function to create the mast (vertical tower) with proper lattice framework
function createMast(height, width, material) {
  const mast = new THREE.Group();
  
  // Create the four main vertical corner posts
  const cornerSize = 0.8;
  const cornerPositions = [
    { x: -width/2 + cornerSize/2, z: -width/2 + cornerSize/2 },
    { x: width/2 - cornerSize/2, z: -width/2 + cornerSize/2 },
    { x: width/2 - cornerSize/2, z: width/2 - cornerSize/2 },
    { x: -width/2 + cornerSize/2, z: width/2 - cornerSize/2 }
  ];
  
  cornerPositions.forEach(pos => {
    const cornerGeometry = new THREE.BoxGeometry(cornerSize, height, cornerSize);
    const corner = new THREE.Mesh(cornerGeometry, material);
    corner.position.set(pos.x, height/2, pos.z);
    mast.add(corner);
  });
  
  // Add framework/lattice details to make the mast look like in the diagram
  addFrameworkToMast(mast, width, height, material);
  
  return mast;
}

// Function to add framework/lattice details to the mast
function addFrameworkToMast(mast, width, height, material) {
  const barSize = 0.5;
  const numSegments = Math.floor(height / 6); // One framework segment every 6 units
  const segmentHeight = height / numSegments;
  
  for (let i = 0; i < numSegments; i++) {
    const yPos = i * segmentHeight;
    
    // Add horizontal frames at each segment (four sides)
    for (let level = 0; level < 2; level++) {
      const levelY = yPos + level * segmentHeight/2 + segmentHeight/4;
      
      // Horizontal X frames (front and back)
      const hFrameX1 = new THREE.Mesh(
        new THREE.BoxGeometry(width, barSize, barSize),
        material
      );
      hFrameX1.position.set(0, levelY, -width/2 + barSize/2);
      
      const hFrameX2 = new THREE.Mesh(
        new THREE.BoxGeometry(width, barSize, barSize),
        material
      );
      hFrameX2.position.set(0, levelY, width/2 - barSize/2);
      
      // Horizontal Z frames (left and right)
      const hFrameZ1 = new THREE.Mesh(
        new THREE.BoxGeometry(barSize, barSize, width),
        material
      );
      hFrameZ1.position.set(-width/2 + barSize/2, levelY, 0);
      
      const hFrameZ2 = new THREE.Mesh(
        new THREE.BoxGeometry(barSize, barSize, width),
        material
      );
      hFrameZ2.position.set(width/2 - barSize/2, levelY, 0);
      
      mast.add(hFrameX1, hFrameX2, hFrameZ1, hFrameZ2);
    }
    
    // Add diagonal cross braces on all four sides
    if (i < numSegments) {
      const sideLength = width;
      const diagonalLength = Math.sqrt(sideLength * sideLength + segmentHeight * segmentHeight);
      
      // Create diagonal braces for each face
      for (let face = 0; face < 4; face++) {
        // Create geometry for diagonal braces
        const diagonalGeom = new THREE.BoxGeometry(diagonalLength, barSize, barSize);
        diagonalGeom.translate(diagonalLength/2 - barSize/2, 0, 0); // Center at origin
        
        // Create two diagonals for X pattern
        const diagonal1 = new THREE.Mesh(diagonalGeom.clone(), material);
        const diagonal2 = new THREE.Mesh(diagonalGeom.clone(), material);
        
        // Position and rotate based on which face we're working on
        if (face === 0 || face === 2) { // Front and back faces
          const zPos = face === 0 ? -width/2 + barSize/2 : width/2 - barSize/2;
          
          diagonal1.position.set(-sideLength/2, yPos, zPos);
          diagonal1.rotation.z = Math.atan2(segmentHeight, sideLength);
          
          diagonal2.position.set(sideLength/2, yPos, zPos);
          diagonal2.rotation.z = -Math.atan2(segmentHeight, sideLength);
        } else { // Left and right faces
          const xPos = face === 1 ? width/2 - barSize/2 : -width/2 + barSize/2;
          
          diagonal1.rotation.y = Math.PI/2; // Rotate to align with Z axis
          diagonal1.position.set(xPos, yPos, -sideLength/2);
          diagonal1.rotation.x = Math.atan2(segmentHeight, sideLength);
          
          diagonal2.rotation.y = Math.PI/2; // Rotate to align with Z axis
          diagonal2.position.set(xPos, yPos, sideLength/2);
          diagonal2.rotation.x = -Math.atan2(segmentHeight, sideLength);
        }
        
        mast.add(diagonal1, diagonal2);
      }
    }
  }
}

// Create a climbing frame as shown in the diagram
function createClimbingFrame(material) {
  const frame = new THREE.Group();
  
  // Main frame structure (simplified)
  const frameGeometry = new THREE.BoxGeometry(3, 6, 3);
  const frameMesh = new THREE.Mesh(frameGeometry, material);
  frame.add(frameMesh);
  
  return frame;
}

// Create the operator cabin with warning light
function createCraneCabin(material) {
  const cabin = new THREE.Group();
  
  // Main cabin body
  const cabinGeometry = new THREE.BoxGeometry(4, 3, 3);
  const cabinMesh = new THREE.Mesh(cabinGeometry, material);
  cabin.add(cabinMesh);
  
  // Windows (use glass-like material)
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x88ccee,
    transparent: true,
    opacity: 0.7,
    metalness: 0.9,
    roughness: 0.1
  });
  
  // Front window (larger)
  const frontWindowGeom = new THREE.BoxGeometry(0.1, 2, 2.5);
  const frontWindow = new THREE.Mesh(frontWindowGeom, glassMaterial);
  frontWindow.position.set(2.05, 0, 0);
  cabin.add(frontWindow);
  
  // Side windows
  const sideWindowGeom = new THREE.BoxGeometry(3.5, 2, 0.1);
  const leftWindow = new THREE.Mesh(sideWindowGeom, glassMaterial);
  leftWindow.position.set(0, 0, 1.55);
  const rightWindow = new THREE.Mesh(sideWindowGeom, glassMaterial);
  rightWindow.position.set(0, 0, -1.55);
  cabin.add(leftWindow, rightWindow);
  
  // Add collision warning lights
  const warningLightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0x440000,
    transparent: true,
    opacity: 0.8
  });
  
  // Create multiple warning lights around the cabin
  const lightPositions = [
    { x: 2.1, y: 1.2, z: 0.8 },    // Front right
    { x: 2.1, y: 1.2, z: -0.8 },   // Front left
    { x: -2.1, y: 1.2, z: 0.8 },   // Back right
    { x: -2.1, y: 1.2, z: -0.8 },  // Back left
    { x: 0, y: 1.8, z: 0 }          // Top center
  ];
  
  lightPositions.forEach((pos, index) => {
    const lightGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const warningLight = new THREE.Mesh(lightGeometry, warningLightMaterial.clone());
    warningLight.position.set(pos.x, pos.y, pos.z);
    warningLight.name = `warningLight_${index}`;
    warningLight.userData = { 
      isWarningLight: true,
      originalEmissive: 0x440000,
      blinkingEmissive: 0xff4444
    };
    cabin.add(warningLight);
  });
  
  return cabin;
}

// Create motor housing as shown in the diagram
function createMotorHousing(material, scale = 1) {
  const motor = new THREE.Group();
  
  // Main motor body
  const motorGeometry = new THREE.BoxGeometry(3 * scale, 2 * scale, 2 * scale);
  const motorMesh = new THREE.Mesh(motorGeometry, material);
  motor.add(motorMesh);
  
  // Add details (simplified)
  const capGeometry = new THREE.CylinderGeometry(0.8 * scale, 0.8 * scale, 0.5 * scale, 12);
  capGeometry.rotateZ(Math.PI/2);
  const motorCap = new THREE.Mesh(capGeometry, material);
  motorCap.position.x = 1.5 * scale;
  motor.add(motorCap);
  
  return motor;
}

// Create the counterweight as shown in the diagram
function createCounterweight(metalMaterial, craneMaterial) {
  const counterweightGroup = new THREE.Group();
  
  // Support structure
  const supportGeometry = new THREE.BoxGeometry(2, 6, 3);
  const support = new THREE.Mesh(supportGeometry, craneMaterial);
  counterweightGroup.add(support);
  
  // Multiple stacked blocks for the counterweight as shown in diagram
  for (let i = 0; i < 5; i++) {
    const blockGeometry = new THREE.BoxGeometry(6, 1.5, 6);
    const block = new THREE.Mesh(blockGeometry, metalMaterial);
    block.position.y = -i * 1.6 - 2; // Stack the blocks downward
    counterweightGroup.add(block);
  }
  
  return counterweightGroup;
}

// Create the jib (horizontal arm)
function createCraneJib(length, material) {
  const jib = new THREE.Group();
  
  // Top chord (main horizontal beam)
  const topBeam = new THREE.Mesh(
    new THREE.BoxGeometry(length, 0.8, 0.8),
    material
  );
  topBeam.position.set(length/2, 0, 0);
  
  // Bottom chord
  const bottomBeam = new THREE.Mesh(
    new THREE.BoxGeometry(length, 0.8, 0.8),
    material
  );
  bottomBeam.position.set(length/2, -3, 0);
  
  jib.add(topBeam, bottomBeam);
  
  // Add vertical and diagonal members to create the truss structure as in the diagram
  const numSegments = Math.floor(length / 4); // One segment every 4 units
  const segmentLength = length / numSegments;
  
  for (let i = 0; i <= numSegments; i++) {
    const xPos = i * segmentLength;
    
    // Vertical members
    if (i <= numSegments) {
      const verticalGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
      const vertical = new THREE.Mesh(verticalGeometry, material);
      vertical.position.set(xPos, -1.5, 0);
      jib.add(vertical);
    }
    
    // Diagonal members for triangular truss
    if (i < numSegments) {
      const diagonalLength = Math.sqrt(segmentLength * segmentLength + 9); // 3² = 9 for height
      const diagonalGeometry = new THREE.BoxGeometry(diagonalLength, 0.5, 0.5);
      
      // Position at start of segment, rotated to end at next vertical
      const diagonal = new THREE.Mesh(diagonalGeometry, material);
      diagonal.position.set(xPos + segmentLength/2, -1.5, 0);
      diagonal.rotation.z = -Math.atan2(3, segmentLength);
      
      jib.add(diagonal);
    }
    
    // Add horizontal bracing between top and bottom at intervals
    if (i % 2 === 0 && i < numSegments) {
      const bracingGeometry = new THREE.BoxGeometry(segmentLength * 2, 0.5, 0.5);
      const bracing = new THREE.Mesh(bracingGeometry, material);
      bracing.position.set(xPos + segmentLength, -1.5, 0);
      jib.add(bracing);
    }
  }
  
  return jib;
}

// Create counter-jib (shorter back arm) as in the diagram
function createCounterJib(length, material) {
  const counterJib = new THREE.Group();
  
  // Main structural beams (simplified version of the jib)
  const topBeam = new THREE.Mesh(
    new THREE.BoxGeometry(length, 0.8, 0.8),
    material
  );
  topBeam.position.set(-length/2, 0, 0);
  
  const bottomBeam = new THREE.Mesh(
    new THREE.BoxGeometry(length, 0.8, 0.8),
    material
  );
  bottomBeam.position.set(-length/2, -3, 0);
  
  counterJib.add(topBeam, bottomBeam);
  
  // Add some vertical and diagonal members similar to the jib
  const numSegments = 5;
  const segmentLength = length / numSegments;
  
  for (let i = 0; i <= numSegments; i++) {
    const xPos = -i * segmentLength;
    
    // Vertical members
    const verticalGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
    const vertical = new THREE.Mesh(verticalGeometry, material);
    vertical.position.set(xPos, -1.5, 0);
    counterJib.add(vertical);
    
    // Simple diagonal bracing
    if (i < numSegments) {
      const diagonalLength = Math.sqrt(segmentLength * segmentLength + 9);
      const diagonalGeometry = new THREE.BoxGeometry(diagonalLength, 0.5, 0.5);
      
      const diagonal = new THREE.Mesh(diagonalGeometry, material);
      diagonal.position.set(xPos - segmentLength/2, -1.5, 0);
      diagonal.rotation.z = Math.atan2(3, segmentLength);
      
      counterJib.add(diagonal);
    }
  }
  
  return counterJib;
}

// Create the trolley that moves along the jib
function createTrolley(material) {
  const trolley = new THREE.Group();
  
  // Main trolley body
  const trolleyGeometry = new THREE.BoxGeometry(3, 1.5, 3);
  const trolleyMesh = new THREE.Mesh(trolleyGeometry, material);
  trolleyMesh.position.y = -0.5;
  trolley.add(trolleyMesh);
  
  // Add wheels that fit on the jib
  const wheelRadius = 0.4;
  const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 3.5, 16);
  wheelGeometry.rotateX(Math.PI / 2);
  
  // Front and rear wheels
  for (let x of [-1, 1]) {
    const wheel = new THREE.Mesh(wheelGeometry, material);
    wheel.position.set(x, -0.2, 0);
    trolley.add(wheel);
  }
  
  return trolley;
}

// Create the hook and rope
function createHookAndRope(length, material) {
  const hookAndRope = new THREE.Group();
  
  // Create rope as a thin cylinder
  const ropeGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 8);
  const ropeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x444444,
    roughness: 0.8
  });
  const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
  rope.position.y = -length / 2;
  hookAndRope.add(rope);
  
  // Create hook
  const hookGroup = new THREE.Group();
  hookGroup.position.y = -length;
  hookGroup.name = 'hookTip'; // Name for collision detection
  hookAndRope.add(hookGroup);
  
  // Hook top connection
  const hookTopGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
  const hookTop = new THREE.Mesh(hookTopGeometry, material);
  hookGroup.add(hookTop);
  
  // Hook curve - create using a torus
  const hookCurveGeometry = new THREE.TorusGeometry(1, 0.25, 16, 32, Math.PI);
  const hookCurve = new THREE.Mesh(hookCurveGeometry, material);
  hookCurve.position.y = -1.5;
  hookCurve.rotation.x = Math.PI;
  hookGroup.add(hookCurve);
  
  // Hook straight part
  const hookStraightGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, 16);
  const hookStraight = new THREE.Mesh(hookStraightGeometry, material);
  hookStraight.position.y = -2.5;
  hookGroup.add(hookStraight);
  
  return hookAndRope;
}

// Collision detection function
function checkCollisions(crane, scene) {
  if (!crane || !scene) return false;
  
  // Verify scene has traverse method (should be a THREE.Scene or THREE.Group)
  if (typeof scene.traverse !== 'function') {
    console.warn('Scene object does not have traverse method');
    return false;
  }
  
  const userData = crane.userData;
  const slewingUnit = crane.getObjectByName('craneSlewingUnit');
  
  if (!slewingUnit) return false;
  
  const jib = slewingUnit.getObjectByName('craneJib');
  if (!jib) return false;
  
  const trolley = jib.getObjectByName('craneTrolley');
  if (!trolley) return false;
  
  const hookAndRope = trolley.getObjectByName('craneHook');
  if (!hookAndRope) return false;
  
  // Get the hook tip position in world coordinates
  const hookTip = hookAndRope.getObjectByName('hookTip');
  if (!hookTip) return false;
  
  const hookWorldPosition = new THREE.Vector3();
  hookTip.getWorldPosition(hookWorldPosition);
  
  // Check collisions with all objects in the scene
  let collisionFound = false;
  
  try {
    scene.traverse((object) => {
      // Skip crane parts and non-mesh objects
      if (object === crane || 
          crane.getObjectById(object.id) ||
          !object.isMesh ||
          object.userData.isWarningLight ||
          object.name.includes('crane') ||
          object.name.includes('hook') ||
          object.name.includes('rope') ||
          object.name.includes('tower')) {
        return;
      }
      
      // Get bounding box of the object
      const box = new THREE.Box3().setFromObject(object);
      
      // Expand the bounding box by the hook collision radius
      box.expandByScalar(userData.hookCollisionRadius);
      
      // Check if hook position is within the expanded bounding box
      if (box.containsPoint(hookWorldPosition)) {
        collisionFound = true;
        
        // Add to collision objects list if not already present
        if (!userData.collisionObjects.includes(object)) {
          userData.collisionObjects.push(object);
          console.log(`Collision detected with object: ${object.name || 'Unnamed object'}`);
        }
      } else {
        // Remove from collision objects list if it was there
        const index = userData.collisionObjects.indexOf(object);
        if (index > -1) {
          userData.collisionObjects.splice(index, 1);
        }
      }
    });
  } catch (error) {
    console.error('Error during collision detection:', error);
    return false;
  }
  
  // Update collision state
  const wasColliding = userData.collisionDetected;
  userData.collisionDetected = collisionFound;
  
  // Log when collision state changes
  if (collisionFound && !wasColliding) {
    console.log('Collision alarm activated!');
  } else if (!collisionFound && wasColliding) {
    console.log('Collision alarm deactivated');
    userData.collisionObjects = []; // Clear the collision objects array
  }
  
  return collisionFound;
}

// Alternative collision detection function that accepts an array of objects instead of scene
function checkCollisionsWithObjects(crane, objectsArray) {
  if (!crane || !Array.isArray(objectsArray)) return false;
  
  const userData = crane.userData;
  const slewingUnit = crane.getObjectByName('craneSlewingUnit');
  
  if (!slewingUnit) return false;
  
  const jib = slewingUnit.getObjectByName('craneJib');
  const trolley = jib.getObjectByName('craneTrolley');
  const hookAndRope = trolley.getObjectByName('craneHook');
  
  if (!hookAndRope) return false;
  
  // Get the hook tip position in world coordinates
  const hookTip = hookAndRope.getObjectByName('hookTip');
  if (!hookTip) return false;
  
  const hookWorldPosition = new THREE.Vector3();
  hookTip.getWorldPosition(hookWorldPosition);
  
  // Check collisions with provided objects
  let collisionFound = false;
  
  objectsArray.forEach((object) => {
    // Skip non-mesh objects and crane parts
    if (!object.isMesh ||
        object === crane || 
        crane.getObjectById(object.id) ||
        object.userData.isWarningLight ||
        object.name.includes('crane')) {
      return;
    }
    
    // Get bounding box of the object
    const box = new THREE.Box3().setFromObject(object);
    
    // Expand the bounding box by the hook collision radius
    box.expandByScalar(userData.hookCollisionRadius);
    
    // Check if hook position is within the expanded bounding box
    if (box.containsPoint(hookWorldPosition)) {
      collisionFound = true;
      
      // Add to collision objects list if not already present
      if (!userData.collisionObjects.includes(object)) {
        userData.collisionObjects.push(object);
        console.log(`Collision detected with object: ${object.name || 'Unnamed object'}`);
      }
    } else {
      // Remove from collision objects list if it was there
      const index = userData.collisionObjects.indexOf(object);
      if (index > -1) {
        userData.collisionObjects.splice(index, 1);
      }
    }
  });
  
  // Update collision state
  const wasColliding = userData.collisionDetected;
  userData.collisionDetected = collisionFound;
  
  // Log when collision state changes
  if (collisionFound && !wasColliding) {
    console.log('Collision alarm activated!');
  } else if (!collisionFound && wasColliding) {
    console.log('Collision alarm deactivated');
    userData.collisionObjects = []; // Clear the collision objects array
  }
  
  return collisionFound;
}

// Function to update warning lights
function updateWarningLights(crane, delta) {
  if (!crane) return;
  
  const userData = crane.userData;
  const cabin = crane.getObjectByName('craneOperatorCab');
  
  if (!cabin) return;
  
  // Update alarm timer
  userData.collisionAlarmTime += delta;
  
  // Get all warning lights
  cabin.children.forEach(child => {
    if (child.userData.isWarningLight) {
      const material = child.material;
      
      if (userData.collisionDetected) {
        // Blink the lights at 2Hz (2 times per second)
        const blinkSpeed = 4; // 4 cycles per second for faster blinking
        const blinkState = Math.sin(userData.collisionAlarmTime * blinkSpeed * Math.PI) > 0;
        
        if (blinkState) {
          material.emissive.setHex(child.userData.blinkingEmissive);
          material.opacity = 1.0;
        } else {
          material.emissive.setHex(child.userData.originalEmissive);
          material.opacity = 0.3;
        }
      } else {
        // Normal state - dim red
        material.emissive.setHex(child.userData.originalEmissive);
        material.opacity = 0.8;
      }
    }
  });
}

// Animation function for the crane with collision detection
function animateEnhancedTowerCrane(crane, scene, delta) {
  if (!crane) return;
  
  const userData = crane.userData;
  const slewingUnit = crane.getObjectByName('craneSlewingUnit');
  const jib = slewingUnit.getObjectByName('craneJib');
  const trolley = jib.getObjectByName('craneTrolley');
  const hookAndRope = trolley.getObjectByName('craneHook');
  
  // Check for collisions
  checkCollisions(crane, scene);
  
  // Update warning lights
  updateWarningLights(crane, delta);
  
  // Handle vertical movement of the entire crane (for construction-in-progress effect)
  if (userData.isExtending) {
    const verticalDiff = userData.targetVerticalPosition - userData.verticalPosition;
    if (Math.abs(verticalDiff) > 0.1) {
      userData.verticalSpeed += verticalDiff * 0.01;
      userData.verticalSpeed *= 0.95; // Damping
      userData.verticalSpeed = THREE.MathUtils.clamp(userData.verticalSpeed, -0.5, 0.5);
      userData.verticalPosition += userData.verticalSpeed;
      
      // Update mast height based on vertical position
      const mast = crane.getObjectByName('craneMast');
      if (mast) {
        // This would need to be implemented with dynamic geometry
        // For this example, we'll just move the slewing unit up
        slewingUnit.position.y = 80 + userData.verticalPosition;
      }
    } else {
      userData.verticalSpeed *= 0.9; // Slow down when close to target
    }
  }
  
  // Smooth rotation of the slewing unit (turntable)
  const angleDiff = userData.targetRotation - slewingUnit.rotation.y;
  
  // Handle wrap-around for continuous rotation (e.g., going from 350° to 10°)
  let adjustedAngleDiff = angleDiff;
  if (Math.abs(angleDiff) > Math.PI) {
    adjustedAngleDiff = angleDiff - Math.sign(angleDiff) * 2 * Math.PI;
  }
  
  if (Math.abs(adjustedAngleDiff) > 0.01) {
    // Gradually adjust rotation speed for smooth acceleration/deceleration
    userData.rotationSpeed += adjustedAngleDiff * 0.01;
    // Apply damping to prevent oscillation
    userData.rotationSpeed *= 0.95;
    // Apply speed limiter
    userData.rotationSpeed = THREE.MathUtils.clamp(userData.rotationSpeed, -0.04, 0.04);
    slewingUnit.rotation.y += userData.rotationSpeed;
    
    // Normalize the rotation between 0 and 2π
    slewingUnit.rotation.y = slewingUnit.rotation.y % (2 * Math.PI);
    if (slewingUnit.rotation.y < 0) slewingUnit.rotation.y += 2 * Math.PI;
  } else {
    userData.rotationSpeed *= 0.9; // Slow down when close to target
  }
  
  // Move trolley along the jib
  const trolleyDiff = userData.targetTrolleyPosition - userData.trolleyPosition;
  if (Math.abs(trolleyDiff) > 0.1) {
    userData.trolleyPosition += trolleyDiff * 0.02;
    trolley.position.x = userData.trolleyPosition;
  }
  
  // Adjust hook height
  const hookDiff = userData.targetHookHeight - userData.hookHeight;
  if (Math.abs(hookDiff) > 0.1) {
    userData.hookHeight += hookDiff * 0.03;
    
    // Update the rope with new length
    if (hookAndRope) {
      // Update only the rope's scale to simulate extension/retraction
      const rope = hookAndRope.children[0];
      if (rope) {
        rope.scale.y = userData.hookHeight / 25; // 25 is the initial length
        rope.position.y = -userData.hookHeight / 2;
      }
      
      // Update hook position
      const hook = hookAndRope.children[1];
      if (hook) {
        hook.position.y = -userData.hookHeight;
      }
    }
  }
  
  // Apply enhanced physics to the hook for realistic swinging
  // Constants for the physical simulation
  const gravity = 9.8;
  const k = 2.5;           // Spring constant (rope stiffness)
  const damping = 0.08;    // Damping factor (air resistance)
  
  // Calculate forces based on slewing unit rotation (centrifugal force)
  const centrifugalForce = userData.rotationSpeed * userData.hookHeight * 200;
  
  // Apply spring physics for the hook swing
  const forceX = -k * userData.hookSwingAngleX - damping * userData.hookSwingVelocityX + centrifugalForce;
  const forceZ = -k * userData.hookSwingAngleZ - damping * userData.hookSwingVelocityZ;
  
  // Update velocity
  userData.hookSwingVelocityX += forceX * delta;
  userData.hookSwingVelocityZ += forceZ * delta;
  
  // Update angle
  userData.hookSwingAngleX += userData.hookSwingVelocityX * delta;
  userData.hookSwingAngleZ += userData.hookSwingVelocityZ * delta;
  
  // Apply the swing to the hook
  //if (hookAndRope) {
    //hookAndRope.rotation.x = userData.hookSwingAngleX;
    //hookAndRope.rotation.z = userData.hookSwingAngleZ;
  //}
  
  // Update any attached object
  if (userData.attachedObject && hookAndRope) {
    const hook = hookAndRope.children[1];
    if (hook) {
      // Match the position of the attached object to the hook
      userData.attachedObject.position.copy(hook.getWorldPosition(new THREE.Vector3()));
      userData.attachedObject.position.y -= 3; // Adjust based on object size
      
      // Also apply the rotation from the swinging hook
      userData.attachedObject.rotation.x = hookAndRope.rotation.x;
      userData.attachedObject.rotation.z = hookAndRope.rotation.z;
    }
  }
}

// Functions to control the crane
// Function to create a liftable object at a fixed position on top of a pole
 
  

// Utility function to register objects for collision detection
function addCollisionObject(crane, object) {
  if (!crane || !object) return;
  
  // Mark the object as collidable
  object.userData.collidable = true;
  
  // You can also add it to a specific list if needed
  if (!crane.userData.collisionObjects) {
    crane.userData.collisionObjects = [];
  }
}


// Function to rotate the crane to a specified angle
function rotateCrane(crane, angleDegrees) {
  if (!crane) return;
  const angleRadians = (angleDegrees * Math.PI) / 180;
  crane.userData.targetRotation = angleRadians;
}

// Function to move the trolley to a specified position
function moveTrolley(crane, position) {
  if (!crane) return;
  // Get the trolley component
  const trolley = crane.getObjectByName('craneTrolley');
  if (!trolley) return;
  
  // Clamp position between min and max values
  const minPosition = 5;
  const maxPosition = 60;
  const clampedPosition = Math.max(minPosition, Math.min(maxPosition, position));
  
  // Store the target position in userData
  crane.userData.trolleyTargetPosition = clampedPosition;
  crane.userData.trolleyPosition = clampedPosition;
}

// Function to set the hook height
function setHookHeight(crane, height) {
  if (!crane) return;
  // Get the hook component
  const hook = crane.getObjectByName('craneHook');
  if (!hook) return;
  
  // Clamp height between min and max values
  const minHeight = 5;
  const maxHeight = 50;
  const clampedHeight = Math.max(minHeight, Math.min(maxHeight, height));
  
  // Store the target height in userData
  crane.userData.hookTargetHeight = clampedHeight;
  crane.userData.hookHeight = clampedHeight;
}

// Function to attach an object to the crane hook
function attachObjectToCrane(crane, object) {
  if (!crane || !object) return;
  const hook = crane.getObjectByName('craneHook');
  if (!hook) return;
  
  // Store the original parent of the object
  object.userData.originalParent = object.parent;
  
  // Remove from current parent and add to hook
  object.parent.remove(object);
  hook.add(object);
  
  // Position relative to hook
  object.position.set(0, -5, 0);
  
  // Store reference to the attached object
  crane.userData.attachedObject = object;
}

// Function to detach an object from the crane hook
function detachObjectFromCrane(crane) {
  if (!crane) return;
  const object = crane.userData.attachedObject;
  if (!object) return;
  
  // Get the hook and the original parent
  const hook = crane.getObjectByName('craneHook');
  const originalParent = object.userData.originalParent || scene;
  
  if (hook) {
    // Get the world position before detaching
    const worldPosition = new THREE.Vector3();
    object.getWorldPosition(worldPosition);
    
    // Remove from hook
    hook.remove(object);
    
    // Add back to original parent
    originalParent.add(object);
    
    // Set the position in world space
    object.position.copy(worldPosition);
  }
  
  // Clear the reference
  crane.userData.attachedObject = null;
}




// Function to run a demonstration of crane lifting an object
function demonstrateCraneLift(scene, crane) {
   if (!crane) {
    console.warn('Tower crane not found for demonstration');
    return;
  }

  // Find an object to lift
  let liftObject = scene.getObjectByName('liftableObject');

  // If no dedicated object is found, try to find a suitable object
  if (!liftObject) {
    // Look for objects near the ground that might be liftable
    scene.traverse((object) => {
      if (object.isMesh &&
          object.position.y < 5 &&
          object.position.y >= 0 &&
          object !== scene.getObjectByName('ground') &&
          !object.name.includes('crane') &&
          !liftObject) {
        liftObject = object;
        liftObject.name = 'liftableObject';
      }
    });
  }

  // If still no object, create a simple box to lift
  if (!liftObject) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xdd2222 });
    liftObject = new THREE.Mesh(geometry, material);
    liftObject.name = 'liftableObject';
    liftObject.position.set(40, 2.5, 40);
    liftObject.castShadow = true;
    liftObject.receiveShadow = true;
    scene.add(liftObject);
  }

  // Show notification
  showNotification('Starting crane demonstration sequence');

  // Store current crane state to restore later
  const originalRotation = crane.rotation.y;
  const originalTrolleyPosition = crane.userData.trolleyPosition;
  const originalHookHeight = crane.userData.hookHeight;

  // Disable manual controls during demo
  const isManuallyControlled = crane.userData.isRotating;
  crane.userData.isRotating = false;

  // Function to run the lift sequence
  const liftSequence = () => {
    // Step 1: Rotate crane to face the object
    rotateCrane(crane, 210);
    showNotification('Step 1: Rotating crane to target', 3000);

    setTimeout(() => {
      // Step 2: Move trolley to be above the object
      moveTrolley(crane, 55);
      showNotification('Step 2: Moving trolley outward', 3000);
    }, 3000);

    setTimeout(() => {
      // Step 3: Lower hook to grab the object
      setHookHeight(crane, 45);
      showNotification('Step 3: Lowering hook to object', 3000);
    }, 6000);

    setTimeout(() => {
      // Step 4: Attach the object to the crane
      attachObjectToCrane(crane, liftObject);
      showNotification('Step 4: Attaching object to hook', 3000);
    }, 9000);

    setTimeout(() => {
      // Step 5: Raise the hook with the object
      setHookHeight(crane, 25);
      showNotification('Step 5: Raising hook with object', 3000);
    }, 12000);

    setTimeout(() => {
      // Step 6: Rotate crane to new position
      rotateCrane(crane, 45);
      showNotification('Step 6: Rotating to destination', 3000);
    }, 15000);

    setTimeout(() => {
      // Step 7: Move trolley to new position
      moveTrolley(crane, 25);
      showNotification('Step 7: Positioning trolley', 3000);
    }, 18000);

    setTimeout(() => {
      // Step 8: Lower the object
      setHookHeight(crane, 40);
      showNotification('Step 8: Lowering object to ground', 3000);
    }, 21000);

    setTimeout(() => {
      // Step 9: Detach the object
      detachObjectFromCrane(crane);
      showNotification('Step 9: Detaching object', 3000);

      // Update the object's position to where it was placed
      liftObject.position.set(-35, 1, -10);
    }, 24000);

    // Step 10: Return crane to original position
    setTimeout(() => {
      rotateCrane(crane, originalRotation * (180/Math.PI));
      moveTrolley(crane, originalTrolleyPosition);
      setHookHeight(crane, originalHookHeight);
      showNotification('Demonstration complete', 3000);

      // Restore manual control state
      crane.userData.isRotating = isManuallyControlled;
    }, 27000);
  };

  // Start the demonstration
  liftSequence();
}

// Helper function to show notifications for the demonstration
function showNotification(message, duration = 2000) {
  // Create or reuse notification element
  let notification = document.getElementById('crane-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'crane-notification';
    notification.style.position = 'absolute';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.5s';
    document.body.appendChild(notification);
  }

  // Set message and show
  notification.textContent = message;
  notification.style.opacity = '1';

  // Clear any existing timeout
  if (notification.timeoutId) {
    clearTimeout(notification.timeoutId);
  }

  // Hide after duration
  notification.timeoutId = setTimeout(() => {
    notification.style.opacity = '0';
  }, duration);
}



//**********************************************


function createSewageTreatmentMachine(scene) {
  const sewageGroup = new THREE.Group();
  sewageGroup.name = 'sewageTreatmentMachine';
  
  // Position the entire group at the desired coordinates
  sewageGroup.position.set(-10, 1, 15);
  
  // Platform/base structure
  const platformGeometry = new THREE.BoxGeometry(30, 2, 20);
  const platformMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.set(0, 0, 0); // Position relative to the group
  sewageGroup.add(platform);
  
  // Support columns
  for (let i = 0; i < 4; i++) {
    const columnGeometry = new THREE.CylinderGeometry(1, 1, 36, 8);
    const columnMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const column = new THREE.Mesh(columnGeometry, columnMaterial);
    
    // Position columns at the corners of the platform
    const xPos = (i % 2 === 0) ? -12 : 12;
    const zPos = (i < 2) ? -8 : 8;
    column.position.set(xPos, -18, zPos);
    
    sewageGroup.add(column);
  }
  
  // Main treatment tank
  const tankGeometry = new THREE.CylinderGeometry(8, 8, 10, 16);
  const tankMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x3399ff,
    transparent: true,
    opacity: 0.7
  });
  const tank = new THREE.Mesh(tankGeometry, tankMaterial);
  tank.position.set(0, 8, 0);
  sewageGroup.add(tank);
  
  // Secondary treatment tanks
  const smallTankGeometry = new THREE.CylinderGeometry(3, 3, 6, 12);
  const greenWaterMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x33cc66,
    transparent: true,
    opacity: 0.6
  });
  
  for (let i = 0; i < 3; i++) {
    const smallTank = new THREE.Mesh(smallTankGeometry, greenWaterMaterial);
    smallTank.position.set(-10 + i * 10, 5, -6);
    sewageGroup.add(smallTank);
  }
  
  // Pipes
  const createPipe = (x1, y1, z1, x2, y2, z2) => {
    const direction = new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1);
    const length = direction.length();
    direction.normalize();
    
    const pipeGeometry = new THREE.CylinderGeometry(0.5, 0.5, length, 8);
    const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    
    // Position and orient the pipe
    pipe.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
    pipe.lookAt(x2, y2, z2);
    pipe.rotateX(Math.PI / 2);
    
    return pipe;
  };
  
  // Add pipes connecting tanks
  sewageGroup.add(createPipe(0, 3, 0, -10, 2, -6));
  sewageGroup.add(createPipe(-10, 2, -6, 0, 2, -6));
  sewageGroup.add(createPipe(0, 2, -6, 10, 2, -6));
  
  // Inlet pipe with animated sewage flow
  const inletPipeGeometry = new THREE.CylinderGeometry(0.8, 0.8, 15, 8);
  const inletPipeMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
  const inletPipe = new THREE.Mesh(inletPipeGeometry, inletPipeMaterial);
  inletPipe.position.set(-14, 10, 0);
  inletPipe.rotation.z = Math.PI / 2;
  sewageGroup.add(inletPipe);
  
  // Create animated sewage flow
  const flowGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 8);
  const flowMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x663300,
    transparent: true,
    opacity: 0.8
  });
  
  // Create several flow segments for animation
  const flowSegments = [];
  for (let i = 0; i < 5; i++) {
    const flowSegment = new THREE.Mesh(flowGeometry, flowMaterial);
    flowSegment.position.set(-14 + i * 2, 10, 0);
    flowSegment.rotation.z = Math.PI / 2;
    flowSegment.name = 'sewageFlowSegment' + i;
    sewageGroup.add(flowSegment);
    flowSegments.push(flowSegment);
  }
  
  // Outlet pipe with clean water
  const outletPipeGeometry = new THREE.CylinderGeometry(0.8, 0.8, 12, 8);
  const outletPipeMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
  const outletPipe = new THREE.Mesh(outletPipeGeometry, outletPipeMaterial);
  outletPipe.position.set(14, 8, 0);
  outletPipe.rotation.z = Math.PI / 2;
  sewageGroup.add(outletPipe);
  
  // Create clean water flow
  const cleanWaterGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 8);
  const cleanWaterMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x00ccff,
    transparent: true,
    opacity: 0.6
  });
  
  const cleanWaterFlow = new THREE.Mesh(cleanWaterGeometry, cleanWaterMaterial);
  cleanWaterFlow.position.set(18, 8, 0);
  cleanWaterFlow.rotation.z = Math.PI / 2;
  cleanWaterFlow.name = 'cleanWaterFlow';
  cleanWaterFlow.visible = true;
  sewageGroup.add(cleanWaterFlow);
  
  // Add control panel
  const panelGeometry = new THREE.BoxGeometry(4, 2, 1);
  const panelMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
  const controlPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  controlPanel.position.set(10, 10, 8);
  sewageGroup.add(controlPanel);
  
  // Add buttons to control panel
  const buttonGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
  const buttonMaterials = [
    new THREE.MeshPhongMaterial({ color: 0xff0000 }),
    new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
    new THREE.MeshPhongMaterial({ color: 0xffff00 })
  ];
  
  for (let i = 0; i < 3; i++) {
    const button = new THREE.Mesh(buttonGeometry, buttonMaterials[i]);
    button.position.set(9 + i, 10.5, 8.5);
    button.rotation.x = Math.PI / 2;
    sewageGroup.add(button);
  }
  
  // Add rotating mixer in main tank
  const mixerGeometry = new THREE.BoxGeometry(10, 0.5, 0.5);
  const mixerMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
  const mixer = new THREE.Mesh(mixerGeometry, mixerMaterial);
  mixer.position.set(0, 8, 0);
  mixer.name = 'sewageMixer';
  sewageGroup.add(mixer);
  
  // Add educational sign
  const signGeometry = new THREE.PlaneGeometry(8, 4);
  const signTexture = createTextTexture("Sewage Treatment Plant", "Educational Exhibit");
  const signMaterial = new THREE.MeshBasicMaterial({ 
    map: signTexture,
    side: THREE.DoubleSide
  });
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.set(0, 16, 9);
  sign.rotation.x = -Math.PI / 10;
  sewageGroup.add(sign);
  
  scene.add(sewageGroup);
  return sewageGroup;
}

// Helper function to create a texture with text
function createTextTexture(title, subtitle) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  
  // Background
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Border
  context.strokeStyle = '#000000';
  context.lineWidth = 8;
  context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
  
  // Title
  context.fillStyle = '#000000';
  context.font = 'bold 24px Arial';
  context.textAlign = 'center';
  context.fillText(title, canvas.width / 2, 50);
  
  // Subtitle
  context.font = '18px Arial';
  context.fillText(subtitle, canvas.width / 2, 80);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Animation update function for the sewage treatment machine
function updateSewageTreatmentMachine(sewageGroup, currentTime) {
  // Find the mixer and rotate it
  sewageGroup.traverse((object) => {
    if (object.name === 'sewageMixer') {
      object.rotation.y += 0.02;
    }
  });
  
  // Animate flow segments
  for (let i = 0; i < 5; i++) {
    const flowSegment = sewageGroup.getObjectByName('sewageFlowSegment' + i);
    if (flowSegment) {
      // Pulse the opacity to create a flow effect
      const opacityOffset = Math.sin(currentTime * 2 + i * 0.5) * 0.2 + 0.6;
      flowSegment.material.opacity = opacityOffset;
    }
  }
  
  // Animate clean water flow
  const cleanWaterFlow = sewageGroup.getObjectByName('cleanWaterFlow');
  if (cleanWaterFlow) {
    // Pulse the opacity for the clean water too
    cleanWaterFlow.material.opacity = Math.sin(currentTime * 3) * 0.2 + 0.6;
    
    // Move the water flow slightly to create an animation effect
    cleanWaterFlow.position.x = 18 + Math.sin(currentTime * 5) * 0.2;
  }
}

function createSewageTreatment(scene) {
  const treatmentGroup = new THREE.Group();
  treatmentGroup.name = 'sewageTreatment';
  treatmentGroup.position.set(75, 0, 65); // Base position
  scene.add(treatmentGroup);

  // 1. Primary Treatment Tank (partially underground)
  const tankGeometry = new THREE.BoxGeometry(10, 2, 10);
  const tankMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444, // Gray, concrete-like
    roughness: 0.8,
    metalness: 0.2,
  });
  const tank = new THREE.Mesh(tankGeometry, tankMaterial);
  tank.position.set(0, -1, 0); // Center of group, base at y=-1 (underground)
  tank.castShadow = true;
  tank.receiveShadow = true;
  treatmentGroup.add(tank);

  // 2. Control Building
  const buildingGeometry = new THREE.BoxGeometry(5, 3, 5);
  const buildingMaterial = new THREE.MeshStandardMaterial({
    color: 0xBFBFBF, // Matches restroom
    roughness: 0.7,
    metalness: 0.3,
  });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.set(-5, 1.5, -5); // Offset to southwest corner
  building.castShadow = true;
  building.receiveShadow = true;
  treatmentGroup.add(building);

  // Building Roof
  const roofGeometry = new THREE.BoxGeometry(5.5, 0.5, 5.5);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513, // Matches park roofs
    roughness: 0.7,
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(-5, 3.25, -5);
  roof.castShadow = true;
  treatmentGroup.add(roof);

  // Door
  const doorGeometry = new THREE.BoxGeometry(2, 2, 0.2);
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(-5, 1, -2.4); // On north face
  door.castShadow = true;
  treatmentGroup.add(door);

  // 3. Pipes (simplified, connecting to restroom at 60, 60)
  const pipeMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333, // Dark gray, metallic
    metalness: 0.5,
    roughness: 0.5,
  });

  // Exposed pipe segment entering tank
  const pipeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 8);
  const pipe1 = new THREE.Mesh(pipeGeometry, pipeMaterial);
  pipe1.rotation.z = Math.PI / 2; // Horizontal
  pipe1.position.set(5, -0.5, 0); // East side of tank, entering from right
  pipe1.castShadow = true;
  treatmentGroup.add(pipe1);

  // Vertical pipe segment (suggesting underground connection)
  const pipe2Geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
  const pipe2 = new THREE.Mesh(pipe2Geometry, pipeMaterial);
  pipe2.position.set(5, -1.5, 0); // Below pipe1, going underground
  pipe2.castShadow = true;
  treatmentGroup.add(pipe2);

  // 4. Fencing (three sides to enclose the system)
  const fenceMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513, // Matches park benches
    roughness: 0.8,
  });

  // North fence
  const fenceGeometry = new THREE.BoxGeometry(20, 2, 0.2);
  const northFence = new THREE.Mesh(fenceGeometry, fenceMaterial);
  northFence.position.set(0, 1, 10); // Along z=75
  northFence.castShadow = true;
  treatmentGroup.add(northFence);

  // East fence
  const eastFenceGeometry = new THREE.BoxGeometry(0.2, 2, 20);
  const eastFence = new THREE.Mesh(eastFenceGeometry, fenceMaterial);
  eastFence.position.set(10, 1, 0); // Along x=85
  eastFence.castShadow = true;
  treatmentGroup.add(eastFence);

  // West fence
  const westFence = new THREE.Mesh(eastFenceGeometry, fenceMaterial);
  westFence.position.set(-10, 1, 0); // Along x=65
  westFence.castShadow = true;
  treatmentGroup.add(westFence);

  // 5. Trees and Bushes (to camouflage)
  const createTree = (x, z) => {
    const treeGroup = new THREE.Group();
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 2, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    // Foliage
    const foliageGeometry = new THREE.ConeGeometry(2, 3, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 3.5;
    foliage.castShadow = true;
    treeGroup.add(foliage);
    treeGroup.position.set(x, 0, z);
    treatmentGroup.add(treeGroup);
  };

  // Place trees around the perimeter
  createTree(-8, 8); // Northwest
  createTree(8, 8);  // Northeast
  createTree(0, 12); // North center

  // Bush for additional cover
  const bushGeometry = new THREE.SphereGeometry(1.5, 8, 8);
  const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.position.set(0, 1.5, 8);
  bush.castShadow = true;
  treatmentGroup.add(bush);
}

function createSewageTreatmentSimulator(scene) {
  const sewageGroup = new THREE.Group();
  sewageGroup.name = 'sewageTreatmentSimulator';
  
  // Position the entire facility
  sewageGroup.position.set(120, 0, -120);
  
  // Create ground platform
  const platformGeometry = new THREE.PlaneGeometry(100, 80);
  const platformMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x3a5f0b, // Green grass color
    side: THREE.DoubleSide 
  });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  platform.position.y = 0.1; // Slightly above ground
  sewageGroup.add(platform);
  
  // Create concrete paths between tanks
  const createPath = (startX, startZ, endX, endZ, width) => {
    const direction = new THREE.Vector3(endX - startX, 0, endZ - startZ);
    const length = direction.length();
    direction.normalize();
    
    const pathGeometry = new THREE.PlaneGeometry(length, width);
    const pathMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x999999, // Concrete color
      side: THREE.DoubleSide 
    });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    
    // Position and rotate path
    path.position.set(startX + (endX - startX) / 2, 0.2, startZ + (endZ - startZ) / 2);
    path.rotation.x = -Math.PI / 2;
    
    // Calculate rotation around Y axis (to align with direction)
    const angle = Math.atan2(direction.x, direction.z);
    path.rotation.y = angle;
    
    return path;
  };
  
  // Create circular treatment tanks
  const createTreatmentTank = (x, z, size, waterColor, hasWalkway = true) => {
    const tankGroup = new THREE.Group();
    
    // Outer wall
    const outerWallGeometry = new THREE.CylinderGeometry(size, size, 4, 32);
    const outerWallMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const outerWall = new THREE.Mesh(outerWallGeometry, outerWallMaterial);
    outerWall.position.set(x, 2, z);
    tankGroup.add(outerWall);
    
    // Inner wall
    const innerWallGeometry = new THREE.CylinderGeometry(size - 0.5, size - 0.5, 4.2, 32);
    const innerWallMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd });
    const innerWall = new THREE.Mesh(innerWallGeometry, innerWallMaterial);
    innerWall.position.set(x, 2, z);
    tankGroup.add(innerWall);
    
    // Water
    const waterGeometry = new THREE.CylinderGeometry(size - 0.6, size - 0.6, 3.5, 32);
    const waterMaterial = new THREE.MeshPhongMaterial({ 
      color: waterColor,
      transparent: true,
      opacity: 0.8
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.set(x, 1.75, z);
    tankGroup.add(water);
    
    // Central mechanism platform
    const centralPlatformGeometry = new THREE.CylinderGeometry(2, 2, 4.5, 16);
    const centralPlatformMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    const centralPlatform = new THREE.Mesh(centralPlatformGeometry, centralPlatformMaterial);
    centralPlatform.position.set(x, 2.25, z);
    tankGroup.add(centralPlatform);
    
    if (hasWalkway) {
      // Create walkway bridge
      const walkwayGeometry = new THREE.BoxGeometry(size * 2 + 2, 0.5, 1.5);
      const walkwayMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
      const walkway = new THREE.Mesh(walkwayGeometry, walkwayMaterial);
      walkway.position.set(x, 4.25, z);
      tankGroup.add(walkway);
      
      // Add railings
      const railingMaterial = new THREE.MeshPhongMaterial({ color: 0x3388cc });
      
      // Left railing
      const leftRailingGeometry = new THREE.BoxGeometry(size * 2 + 2, 1.2, 0.1);
      const leftRailing = new THREE.Mesh(leftRailingGeometry, railingMaterial);
      leftRailing.position.set(x, 5.1, z - 0.7);
      tankGroup.add(leftRailing);
      
      // Right railing
      const rightRailingGeometry = new THREE.BoxGeometry(size * 2 + 2, 1.2, 0.1);
      const rightRailing = new THREE.Mesh(rightRailingGeometry, railingMaterial);
      rightRailing.position.set(x, 5.1, z + 0.7);
      tankGroup.add(rightRailing);
    }
    
    // Add mechanical arms (radial) - the spokes seen in the image
    const spokes = 16; // Number of spokes
    const spokeMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    
    for (let i = 0; i < spokes; i++) {
      const angle = (i / spokes) * Math.PI * 2;
      const spokeGeometry = new THREE.BoxGeometry(size - 3, 0.2, 0.2);
      const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
      
      spoke.position.set(x, 3.5, z);
      spoke.rotation.y = angle;
      spoke.translateX((size - 3) / 2 + 2); // Move it out from center
      
      if (i % 4 === 0) {
        // Add vertical supports on some spokes
        const supportGeometry = new THREE.BoxGeometry(0.2, 2, 0.2);
        const support = new THREE.Mesh(supportGeometry, spokeMaterial);
        support.position.set(spoke.position.x, 2.5, spoke.position.z);
        support.rotation.y = angle;
        tankGroup.add(support);
      }
      
      tankGroup.add(spoke);
    }
    
    // Create mechanical sweep arms
    const sweepArmGeometry = new THREE.BoxGeometry(size - 1, 0.3, 0.3);
    const sweepArmMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
    const sweepArm = new THREE.Mesh(sweepArmGeometry, sweepArmMaterial);
    sweepArm.position.set(x, 1, z);
    sweepArm.name = 'sweepArm_' + x + '_' + z; // Name for animation
    tankGroup.add(sweepArm);
    
    return tankGroup;
  };
  
  // Create pump stations
  const createPumpStation = (x, z) => {
    const pumpGroup = new THREE.Group();
    
    // Building
    const buildingGeometry = new THREE.BoxGeometry(6, 4, 6);
    const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, 2, z);
    pumpGroup.add(building);
    
    // Roof
    const roofGeometry = new THREE.BoxGeometry(7, 0.5, 7);
    const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(x, 4.25, z);
    pumpGroup.add(roof);
    
    // Pipes going in/out
    const pipeGeometry = new THREE.CylinderGeometry(0.6, 0.6, 5, 8);
    const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    
    const pipe1 = new THREE.Mesh(pipeGeometry, pipeMaterial);
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(x - 3, 1.5, z + 2);
    pumpGroup.add(pipe1);
    
    const pipe2 = new THREE.Mesh(pipeGeometry, pipeMaterial);
    pipe2.rotation.z = Math.PI / 2;
    pipe2.position.set(x + 3, 1.5, z - 2);
    pumpGroup.add(pipe2);
    
    return pumpGroup;
  };
  
  // Add multiple circular tanks
  const tank1 = createTreatmentTank(-30, -25, 15, 0x004400);
  sewageGroup.add(tank1);
  
  const tank2 = createTreatmentTank(0, -25, 15, 0x006600);
  sewageGroup.add(tank2);
  
  const tank3 = createTreatmentTank(30, -25, 15, 0x008800);
  sewageGroup.add(tank3);
  
  const tank4 = createTreatmentTank(-30, 10, 15, 0x00aa00);
  sewageGroup.add(tank4);
  
  const tank5 = createTreatmentTank(0, 10, 15, 0x00cc00);
  sewageGroup.add(tank5);
  
  const tank6 = createTreatmentTank(30, 10, 15, 0x00ff00, false);
  sewageGroup.add(tank6);
  
  // Add pump stations
  const pumpStation1 = createPumpStation(-15, -5);
  sewageGroup.add(pumpStation1);
  
  const pumpStation2 = createPumpStation(15, -10);
  sewageGroup.add(pumpStation2);
  
  // Add the main paths
  const mainPath1 = createPath(-30, -8, 30, -8, 5);
  sewageGroup.add(mainPath1);
  
  const mainPath2 = createPath(0, -8, 0, -23, 5);
  sewageGroup.add(mainPath2);
  
  // Add connection paths to tanks
  sewageGroup.add(createPath(-30, -8, -30, -25, 3));
  sewageGroup.add(createPath(0, -8, 0, -25, 3));
  sewageGroup.add(createPath(30, -8, 30, -25, 3));
  sewageGroup.add(createPath(-30, -8, -30, 10, 3));
  sewageGroup.add(createPath(0, -8, 0, 10, 3));
  sewageGroup.add(createPath(30, -8, 30, 10, 3));
  
  // Add pipes connecting tanks (above ground)
  const createConnectingPipe = (x1, z1, x2, z2) => {
    const direction = new THREE.Vector3(x2 - x1, 0, z2 - z1);
    const length = direction.length();
    direction.normalize();
    
    // Main pipe
    const pipeGeometry = new THREE.CylinderGeometry(0.8, 0.8, length, 8);
    const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    
    // Position and orient the pipe
    pipe.position.set((x1 + x2) / 2, 4, (z1 + z2) / 2);
    
    // Calculate rotation around Y axis
    const angle = Math.atan2(x2 - x1, z2 - z1);
    pipe.rotation.y = angle;
    pipe.rotation.x = Math.PI / 2;
    
    return pipe;
  };
  
  // Add connecting pipes
  sewageGroup.add(createConnectingPipe(-30, -25, 0, -25));
  sewageGroup.add(createConnectingPipe(0, -25, 30, -25));
  sewageGroup.add(createConnectingPipe(-30, 10, 0, 10));
  sewageGroup.add(createConnectingPipe(0, 10, 30, 10));
  sewageGroup.add(createConnectingPipe(-30, -25, -30, 10));
  sewageGroup.add(createConnectingPipe(30, -25, 30, 10));
  
  // Create water flow animations
  const flowAnimations = [];
  
  // Create flowing water particle effect in the pipes
  const createWaterFlow = (x1, z1, x2, z2) => {
    const particleCount = 20;
    const direction = new THREE.Vector3(x2 - x1, 0, z2 - z1);
    const length = direction.length();
    direction.normalize();
    
    const flowGroup = new THREE.Group();
    flowGroup.name = 'waterFlow_' + x1 + '_' + z1 + '_' + x2 + '_' + z2;
    
    for (let i = 0; i < particleCount; i++) {
      const particleSize = 0.4;
      const particleGeometry = new THREE.SphereGeometry(particleSize, 8, 8);
      const particleMaterial = new THREE.MeshPhongMaterial({
        color: 0x0088ff, 
        transparent: true,
        opacity: 0.7
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Distribute particles along the pipe
      const pos = i / particleCount;
      particle.position.set(
        x1 + direction.x * length * pos,
        4,
        z1 + direction.z * length * pos
      );
      
      particle.userData = {
        startX: x1,
        startZ: z1,
        endX: x2,
        endZ: z2,
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * length // Random starting offset
      };
      
      flowGroup.add(particle);
      flowAnimations.push(particle);
    }
    
    return flowGroup;
  };
  
  // Add water flow to some of the pipes
  sewageGroup.add(createWaterFlow(-30, -25, 0, -25));
  sewageGroup.add(createWaterFlow(0, -25, 30, -25));
  sewageGroup.add(createWaterFlow(-30, 10, 0, 10));
  sewageGroup.add(createWaterFlow(0, 10, 30, 10));
  
  // Add entrance area with sign
  const entranceGeometry = new THREE.BoxGeometry(15, 0.5, 10);
  const entranceMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
  const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
  entrance.position.set(0, 0.3, 30);
  sewageGroup.add(entrance);
  
  // Create entrance sign
  const signGeometry = new THREE.BoxGeometry(12, 6, 0.5);
  const signTexture = createTextTexture("SEWAGE TREATMENT FACILITY", "EDUCATIONAL EXHIBIT", "OPEN TO PUBLIC");
  const signMaterial = new THREE.MeshBasicMaterial({ 
    map: signTexture,
    side: THREE.DoubleSide
  });
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.set(0, 4, 30);
  sewageGroup.add(sign);
  
  // Add fence around the facility
  const createFence = (x1, z1, x2, z2) => {
    const direction = new THREE.Vector3(x2 - x1, 0, z2 - z1);
    const length = direction.length();
    direction.normalize();
    
    const fenceGroup = new THREE.Group();
    
    // Base fence
    const fenceGeometry = new THREE.BoxGeometry(length, 2, 0.1);
    const fenceMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
    const fence = new THREE.Mesh(fenceGeometry, fenceMaterial);
    
    fence.position.set((x1 + x2) / 2, 1, (z1 + z2) / 2);
    
    // Calculate rotation around Y axis
    const angle = Math.atan2(x2 - x1, z2 - z1);
    fence.rotation.y = angle;
    
    fenceGroup.add(fence);
    
    // Add fence posts
    const postCount = Math.ceil(length / 4);
    for (let i = 0; i <= postCount; i++) {
      const postGeometry = new THREE.BoxGeometry(0.3, 2.5, 0.3);
      const post = new THREE.Mesh(postGeometry, fenceMaterial);
      
      const t = i / postCount;
      post.position.set(
        x1 + direction.x * length * t,
        1.25,
        z1 + direction.z * length * t
      );
      
      fenceGroup.add(post);
    }
    
    return fenceGroup;
  };
  
  // Add fence around the perimeter
  const fenceSize = 50;
  sewageGroup.add(createFence(-fenceSize, -fenceSize, fenceSize, -fenceSize));
  sewageGroup.add(createFence(fenceSize, -fenceSize, fenceSize, fenceSize));
  sewageGroup.add(createFence(fenceSize, fenceSize, -fenceSize, fenceSize));
  sewageGroup.add(createFence(-fenceSize, fenceSize, -fenceSize, -30));
  sewageGroup.add(createFence(-fenceSize, -20, -fenceSize, -fenceSize));
  
  // Create gate
  const gateGeometry = new THREE.BoxGeometry(10, 2, 0.1);
  const gateMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
  const gate = new THREE.Mesh(gateGeometry, gateMaterial);
  gate.position.set(0, 1, fenceSize);
  gate.rotation.y = Math.PI / 2;
  sewageGroup.add(gate);
  
  scene.add(sewageGroup);
  return { sewageGroup, flowAnimations };
}

// Helper function to create a texture with text
function createTextTexture(title, subtitle, subtitle2 = null) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  
  // Background
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Border
  context.strokeStyle = '#000000';
  context.lineWidth = 8;
  context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
  
  // Title
  context.fillStyle = '#000000';
  context.font = 'bold 32px Arial';
  context.textAlign = 'center';
  context.fillText(title, canvas.width / 2, 80);
  
  // Subtitle
  context.font = 'bold 24px Arial';
  context.fillText(subtitle, canvas.width / 2, 130);
  
  // Optional second subtitle
  if (subtitle2) {
    context.font = '20px Arial';
    context.fillText(subtitle2, canvas.width / 2, 180);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
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


    // Function to create a sewage treatment machine
  
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
  
  // Here's how to properly integrate the wooden tower into your amusement park
  
// First, add these functions to your code file (e.g., AmusementPark.js)
// Place them alongside your other creation functions (like createTower, createCarousel, etc.)
 // Here's how to properly integrate the wooden tower into your amusement park

// First, add these functions to your code file (e.g., AmusementPark.js)
// Place them alongside your other creation functions (like createTower, createCarousel, etc.)

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
  
  // Removed the unused centerWidth variable
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


  // Then, modify your scene initialization code to add the wooden tower:

// In your main initialization code, add this line where you create your other attractions
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
    base.position.set(25, 1, 5);
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
    platform.position.set(5, 1, -12);
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
    { name: "Overview", pos: { x: 0, y: 150, z: 10 } },
    { name: "Roller Coaster", pos: { x: -60, y: 20, z: -60 } },
    { name: "Ferris Wheel", pos: { x: 50, y: 30, z: -70 } },
    { name: "Tower", pos: { x: -30, y: 20, z: 50 } },
    { name: "Carousel", pos: { x: 15, y: 10, z: 15 } },
    { name: "Entrance", pos: { x: 0, y: 10, z: 100 } }
  ];

  return (
    <div className="relative w-full h-screen">
       {isLoading && (
         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
           <div className="text-white text-xl">Loading Amusement Park...</div>
         </div>
       )}

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
