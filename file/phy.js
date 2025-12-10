import readline from 'readline';
import * as docx from "docx";
import PDFDocument from 'pdfkit';

import fs from 'fs';


import { GraphingCalculator, GraphingCalculatorGame,Theme} from './graphing.js';
import { ExcelChartsRegistry, ChartCanvasRenderer} from './chart.js';
import { AnatomicalDiagramsRegistry, AnatomicalShapes,AnatomicalDiagramRenderer} from './anatomy.js';
import { StereochemistryDiagramsRegistry,StereochemistryDiagramRenderer,AtomProperties,MolecularGeometry} from './3DChemistry.js';
import { ChemistryDiagramsRegistry, ChemistryDiagramRenderer } from './chemistryDiagrams.js';
import { PhysicsDiagramsRegistry, PhysicsDiagramRenderer } from './physicsDiagrams.js';
import { CrossSectionDiagramsRegistry,CrossSectionDiagramRenderer,CrossSectionShapes} from './crossection.js';
import { GeometricShapesRegistry,GeometricShapeRenderer} from './geometry.js';

import { GraphRegistry,  GraphRenderer} from './graph.js';
import { createCanvas } from '@napi-rs/canvas';
import ExcelJS from 'exceljs';

const { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, 
        AlignmentType, HeadingLevel, BorderStyle, WidthType, UnderlineType } = docx;




// === COMPREHENSIVE EXAMINATION PAPER GENERATOR ===
// Integrated with Problem Solver - Multi-Subject Support




/**
//=========================================
PHYSICS GENERATORS
*/

//========================================================//


// ==================== MECHANICS GENERATORS WITH DIAGRAMS ====================

generateRelatedKinematics1DDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];
    
    // Original problems without diagrams (keep existing)
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Uniform Acceleration',
        problem: `A car accelerates from rest at 3 m/s² for 8 seconds. Find final velocity and distance traveled.`,
        parameters: { initialVelocity: 0, acceleration: 3, time: 8, findVelocityAndDistance: true },
        type: 'kinematics_1d',
        subparts: [
            'Identify given: u = 0, a = 3 m/s², t = 8 s',
            'Use v = u + at to find final velocity',
            'Use s = ut + ½at² to find distance',
            'Calculate v = 0 + 3(8) = 24 m/s',
            'Calculate s = 0 + ½(3)(8²) = 96 m'
        ],
        helper: 'formulas: v = u + at, s = ut + ½at², v² = u² + 2as',
        realWorldContext: 'Vehicle acceleration analysis'
    });

    // NEW: Problem with velocity-time graph
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Motion Analysis with v-t Graph',
        problem: 'Analyze the velocity-time graph showing a car that accelerates for 2s to 10 m/s, travels at constant velocity for 3s, then decelerates to rest in 2s. Find total displacement.',
        parameters: {
            graphType: 'velocity-time',
            segments: [
                { time: 0, value: 0, label: 'Rest' },
                { time: 2, value: 10, label: 'Accelerating' },
                { time: 5, value: 10, label: 'Constant velocity' },
                { time: 7, value: 0, label: 'Decelerating' }
            ]
        },
        type: 'kinematics_1d',
        subparts: [
            'Displacement = area under v-t graph',
            'Phase 1 (0-2s): Triangle area = ½ × 2 × 10 = 10 m',
            'Phase 2 (2-5s): Rectangle area = 3 × 10 = 30 m',
            'Phase 3 (5-7s): Triangle area = ½ × 2 × 10 = 10 m',
            'Total displacement = 10 + 30 + 10 = 50 m'
        ],
        helper: 'Area under v-t graph gives displacement; Slope of v-t graph gives acceleration',
        realWorldContext: 'Trip analysis using graphs',
        diagramInfo: {
            type: 'motion_graphs',
            registryKey: 'motionGraphs',
            renderOptions: {
                graphType: 'velocity-time',
                segments: [
                    { time: 0, value: 0, label: 'Rest' },
                    { time: 2, value: 10, label: 'Accelerating' },
                    { time: 5, value: 10, label: 'Constant velocity' },
                    { time: 7, value: 0, label: 'Decelerating' }
                ],
                showArea: true,
                showSlope: true,
                showGrid: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_motion_graph_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedKinematics2DDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Vector Addition in 2D Motion',
        problem: 'A boat travels 40 m east, then 30 m north. Find the resultant displacement vector and direction.',
        parameters: {
            vectors: [
                { x: 40, y: 0, label: 'East', color: '#E74C3C' },
                { x: 0, y: 30, label: 'North', color: '#3498DB' }
            ],
            showResultant: true
        },
        type: 'kinematics_2d',
        subparts: [
            'Draw displacement vectors tip-to-tail',
            'Resultant magnitude: R = √(40² + 30²) = √(1600 + 900) = 50 m',
            'Direction: θ = tan⁻¹(30/40) = tan⁻¹(0.75) = 36.9° north of east',
            'Resultant: 50 m at 36.9° from east'
        ],
        helper: 'Use Pythagorean theorem for magnitude; Use tan⁻¹(y/x) for angle',
        realWorldContext: 'Navigation and displacement problems',
        diagramInfo: {
            type: 'vector_diagram',
            registryKey: 'vectorDiagram',
            renderOptions: {
                vectors: [
                    { x: 40, y: 30, label: 'A', color: '#E74C3C' },
                    { x: 30, y: -20, label: 'B', color: '#3498DB' }
                ],
                showComponents: true,
                showResultant: true,
                showGrid: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_vector_diagram_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedProjectileMotionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Projectile Motion Trajectory',
        problem: 'A ball is thrown at 20 m/s at 45° above horizontal. Draw the trajectory and find maximum height and range. (g = 10 m/s²)',
        parameters: {
            initialVelocity: 20,
            launchAngle: 45,
            gravity: 10
        },
        type: 'projectile_motion',
        subparts: [
            'Horizontal component: vₓ = 20 cos(45°) = 14.14 m/s',
            'Vertical component: vᵧ = 20 sin(45°) = 14.14 m/s',
            'Maximum height: H = vᵧ²/(2g) = (14.14)²/20 = 10 m',
            'Time of flight: T = 2vᵧ/g = 2(14.14)/10 = 2.83 s',
            'Range: R = vₓ × T = 14.14 × 2.83 = 40 m'
        ],
        helper: 'Horizontal motion: uniform velocity; Vertical motion: uniformly accelerated (a = -g)',
        realWorldContext: 'Sports projectiles, ballistics',
        diagramInfo: {
            type: 'projectile_motion',
            registryKey: 'projectileMotion',
            renderOptions: {
                initialVelocity: 20,
                launchAngle: 45,
                showVelocityVectors: true,
                showComponents: true,
                showTrajectory: true,
                showRange: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_projectile_motion_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedNewtonsLawsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Free Body Diagram Analysis',
        problem: 'A 5 kg box rests on a table. Draw the free body diagram showing all forces. If a 20 N horizontal force is applied, find acceleration.',
        parameters: {
            mass: 5,
            appliedForce: 20,
            forces: [
                { name: 'Weight', magnitude: 49, angle: 270, color: '#E74C3C' },
                { name: 'Normal', magnitude: 49, angle: 90, color: '#3498DB' },
                { name: 'Applied', magnitude: 20, angle: 0, color: '#2ECC71' }
            ]
        },
        type: 'newtons_laws',
        subparts: [
            'Weight: W = mg = 5 × 9.8 = 49 N (downward)',
            'Normal force: N = 49 N (upward)',
            'Applied force: F = 20 N (horizontal)',
            'Net force: Fₙₑₜ = 20 N (horizontal)',
            'Acceleration: a = F/m = 20/5 = 4 m/s²'
        ],
        helper: 'Newton\'s 2nd Law: F = ma; Forces in equilibrium: ΣF = 0',
        realWorldContext: 'Understanding forces on objects',
        diagramInfo: {
            type: 'free_body_diagram',
            registryKey: 'freeBodyDiagram',
            renderOptions: {
                forces: [
                    { name: 'Weight', magnitude: 50, angle: 270, color: '#E74C3C' },
                    { name: 'Normal', magnitude: 50, angle: 90, color: '#3498DB' },
                    { name: 'Applied', magnitude: 30, angle: 0, color: '#2ECC71' }
                ],
                showLabels: true,
                showMagnitudes: true,
                showAngles: false
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_free_body_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedFrictionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Friction on Inclined Plane',
        problem: 'A 10 kg box rests on a 30° incline. Draw forces and find friction force if μₛ = 0.4. (g = 10 m/s²)',
        parameters: {
            mass: 10,
            angle: 30,
            frictionCoeff: 0.4,
            includeComponents: true
        },
        type: 'friction',
        subparts: [
            'Weight: W = mg = 10 × 10 = 100 N',
            'Component parallel to incline: W∥ = mg sin(30°) = 100 × 0.5 = 50 N',
            'Component perpendicular: W⊥ = mg cos(30°) = 100 × 0.866 = 86.6 N',
            'Normal force: N = W⊥ = 86.6 N',
            'Maximum static friction: fₛ = μₛN = 0.4 × 86.6 = 34.6 N',
            'Since W∥ (50N) > fₛ (34.6N), box will slide'
        ],
        helper: 'Resolve weight into components; Normal force N = W⊥; Friction f = μN',
        realWorldContext: 'Objects on slopes and ramps',
        diagramInfo: {
            type: 'inclined_plane',
            registryKey: 'inclinedPlane',
            renderOptions: {
                angle: 30,
                mass: 10,
                showForceComponents: true,
                showAngles: true,
                showFriction: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_inclined_plane_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedCircularMotionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Centripetal Force in Circular Motion',
        problem: 'A 2 kg ball moves in a circle of radius 1.5 m at 6 m/s. Draw the motion and find centripetal force and acceleration.',
        parameters: {
            mass: 2,
            radius: 1.5,
            velocity: 6
        },
        type: 'circular_motion',
        subparts: [
            'Centripetal acceleration: aᴄ = v²/r = 6²/1.5 = 36/1.5 = 24 m/s²',
            'Centripetal force: Fᴄ = maᴄ = 2 × 24 = 48 N',
            'Direction: Always toward center of circle',
            'Velocity is tangent to circle, acceleration points to center'
        ],
        helper: 'Centripetal force: Fᴄ = mv²/r; Centripetal acceleration: aᴄ = v²/r',
        realWorldContext: 'Cars turning corners, satellites orbiting',
        diagramInfo: {
            type: 'circular_motion',
            registryKey: 'circularMotion',
            renderOptions: {
                radius: 100,
                velocity: 15,
                showCentripetalForce: true,
                showVelocity: true,
                showAcceleration: true
            },
            canvasSize: { width: 700, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_circular_motion_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedWorkEnergyDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Work-Energy Transformation',
        problem: 'A 5 kg object slides down from 10 m height. Initial KE = 0, find final KE and velocity at bottom. Show energy transformation. (g = 10 m/s²)',
        parameters: {
            mass: 5,
            height: 10,
            initialKE: 0,
            initialPE: 500,
            finalKE: 500,
            finalPE: 0
        },
        type: 'work_energy',
        subparts: [
            'Initial PE: PEᵢ = mgh = 5 × 10 × 10 = 500 J',
            'Initial KE: KEᵢ = 0 J (starts from rest)',
            'Final PE: PEf = 0 J (at ground level)',
            'By conservation: KEf = PEᵢ = 500 J',
            'Final velocity: ½mv² = 500 → v = √(2×500/5) = √200 = 14.14 m/s'
        ],
        helper: 'Conservation of energy: KEᵢ + PEᵢ = KEf + PEf; PE = mgh; KE = ½mv²',
        realWorldContext: 'Energy conversion in falling objects, roller coasters',
        diagramInfo: {
            type: 'work_energy_chart',
            registryKey: 'workEnergyBarChart',
            renderOptions: {
                initialKE: 0,
                initialPE: 500,
                finalKE: 500,
                finalPE: 0,
                workDone: 0,
                showValues: true,
                showTotal: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_work_energy_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedMomentumCollisionsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Elastic Collision Analysis',
        problem: 'Two carts collide: Cart A (2 kg, 5 m/s) hits Cart B (3 kg, -3 m/s). Show before/after and find final velocities in elastic collision.',
        parameters: {
            collisionType: 'elastic',
            objects: [
                { mass: 2, velocity: 5, color: '#E74C3C' },
                { mass: 3, velocity: -3, color: '#3498DB' }
            ]
        },
        type: 'momentum_collisions',
        subparts: [
            'Initial momentum: pᵢ = m₁v₁ + m₂v₂ = 2(5) + 3(-3) = 10 - 9 = 1 kg·m/s',
            'Initial KE: KEᵢ = ½(2)(5²) + ½(3)(-3²) = 25 + 13.5 = 38.5 J',
            'For elastic collision: Both momentum and KE conserved',
            'Using elastic collision formulas:',
            'v₁f = [(m₁-m₂)v₁ + 2m₂v₂]/(m₁+m₂) = [(2-3)(5) + 2(3)(-3)]/(5) = -5.8 m/s',
            'v₂f = [(m₂-m₁)v₂ + 2m₁v₁]/(m₁+m₂) = [(3-2)(-3) + 2(2)(5)]/(5) = 3.4 m/s'
        ],
        helper: 'Momentum: p = mv; Elastic: both p and KE conserved; Inelastic: only p conserved',
        realWorldContext: 'Collisions in sports, car crashes',
        diagramInfo: {
            type: 'momentum_collision',
            registryKey: 'momentumCollision',
            renderOptions: {
                collisionType: 'elastic',
                objects: [
                    { mass: 2, velocity: 5, color: '#E74C3C' },
                    { mass: 3, velocity: -3, color: '#3498DB' }
                ],
                showBefore: true,
                showAfter: true,
                showMomentum: true,
                showEnergy: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_collision_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedRotationalMotionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Torque on a Lever',
        problem: 'A 2 m lever has fulcrum at 0.6 m from left end. 50 N force applied at left end, find force needed at right end for balance.',
        parameters: {
            leverLength: 200,
            fulcrumPosition: 0.3,
            force1: 50,
            force2: 30
        },
        type: 'rotational_motion',
        subparts: [
            'Left moment arm: r₁ = 0.6 m',
            'Right moment arm: r₂ = 2 - 0.6 = 1.4 m',
            'For equilibrium: τ₁ = τ₂',
            'F₁ × r₁ = F₂ × r₂',
            '50 × 0.6 = F₂ × 1.4',
            'F₂ = 30/1.4 = 21.4 N'
        ],
        helper: 'Torque: τ = rF sin(θ); For equilibrium: Στ = 0',
        realWorldContext: 'Seesaws, crowbars, door handles',
        diagramInfo: {
            type: 'torque_lever',
            registryKey: 'torqueLeverDiagram',
            renderOptions: {
                leverLength: 200,
                fulcrumPosition: 0.3,
                force1: 50,
                force2: 30,
                showMomentArms: true,
                showForces: true,
                showRotation: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_torque_lever_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Simple Harmonic Motion - Spring',
        problem: 'A 2 kg mass on spring (k = 100 N/m) oscillates with amplitude 0.5 m. Find period, frequency, and maximum velocity.',
        parameters: {
            mass: 2,
            springConstant: 100,
            amplitude: 0.5
        },
        type: 'rotational_motion',
        subparts: [
            'Period: T = 2π√(m/k) = 2π√(2/100) = 2π√0.02 = 0.89 s',
            'Frequency: f = 1/T = 1/0.89 = 1.12 Hz',
            'Angular frequency: ω = √(k/m) = √(100/2) = 7.07 rad/s',
            'Maximum velocity: vₘₐₓ = Aω = 0.5 × 7.07 = 3.54 m/s',
            'Maximum velocity occurs at equilibrium position'
        ],
        helper: 'SHM: T = 2π√(m/k), vₘₐₓ = Aω, aₘₐₓ = Aω²',
        realWorldContext: 'Mass-spring systems, oscillations',
        diagramInfo: {
            type: 'spring_harmonic',
            registryKey: 'springHarmonicMotion',
            renderOptions: {
                amplitude: 50,
                springConstant: 10,
                mass: 2,
                showDisplacement: true,
                showForce: true,
                showEnergy: true,
                animate: false
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_spring_harmonic_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

// ==================== WAVES AND SOUND GENERATORS WITH DIAGRAMS ====================

generateRelatedWavePropertiesDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    // Original problem without diagram
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Wave Speed Calculation',
        problem: 'Wave has frequency 50 Hz and wavelength 4 m. Find wave speed.',
        parameters: { frequency: 50, wavelength: 4, findSpeed: true },
        type: 'wave_properties',
        subparts: [
            'Wave equation: v = fλ',
            'Identify: f = 50 Hz, λ = 4 m',
            'Calculate: v = 50 × 4 = 200 m/s',
            'Wave speed depends on medium properties'
        ],
        helper: 'formula: v = fλ (wave speed = frequency × wavelength)',
        realWorldContext: 'All wave motion'
    });

    // NEW: Transverse vs Longitudinal waves with diagram
    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Comparing Wave Types',
        problem: 'Compare transverse and longitudinal waves. A transverse wave has wavelength 2 m and a longitudinal sound wave has the same wavelength. If both travel at same speed 340 m/s, find their frequencies.',
        parameters: {
            wavelength: 2,
            speed: 340,
            showParticleMotion: true
        },
        type: 'wave_properties',
        subparts: [
            'Transverse: particle motion perpendicular to wave direction',
            'Longitudinal: particle motion parallel to wave direction',
            'For both waves: v = fλ',
            'Frequency: f = v/λ = 340/2 = 170 Hz',
            'Same frequency despite different particle motion'
        ],
        helper: 'Transverse: e.g. light, water waves; Longitudinal: e.g. sound waves',
        realWorldContext: 'Understanding different wave types in nature',
        diagramInfo: {
            type: 'wave_types',
            registryKey: 'transverseLongitudinalWaves',
            renderOptions: {
                wavelength: 100,
                amplitude: 30,
                showParticles: true,
                showLabels: true,
                animate: false
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_wave_types_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedWaveInterferenceDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Two-Source Wave Interference',
        problem: 'Two coherent sources 10 cm apart produce waves of wavelength 3 cm. Find positions of first three nodes and antinodes.',
        parameters: {
            separation: 100,
            wavelength: 30
        },
        type: 'wave_interference',
        subparts: [
            'Constructive interference (antinodes): path difference = nλ',
            'First antinode: Δd = 0 (center line)',
            'Second antinode: Δd = λ = 3 cm',
            'Third antinode: Δd = 2λ = 6 cm',
            'Destructive interference (nodes): path difference = (n + ½)λ',
            'First node: Δd = λ/2 = 1.5 cm',
            'Second node: Δd = 3λ/2 = 4.5 cm'
        ],
        helper: 'Constructive: Δd = nλ; Destructive: Δd = (n + ½)λ',
        realWorldContext: 'Sound interference, water wave patterns',
        diagramInfo: {
            type: 'wave_interference',
            registryKey: 'waveInterference',
            renderOptions: {
                separation: 100,
                wavelength: 30,
                showSources: true,
                showNodes: true,
                showAntinodes: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_wave_interference_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedSoundWavesDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Sound Wave Pressure Variations',
        problem: 'A sound wave with frequency 440 Hz (musical note A) travels through air at 343 m/s. Draw the pressure variation and find wavelength.',
        parameters: {
            frequency: 440,
            speed: 343,
            amplitude: 50
        },
        type: 'sound_waves',
        subparts: [
            'Sound is longitudinal wave with compressions and rarefactions',
            'Wavelength: λ = v/f = 343/440 = 0.78 m',
            'Period: T = 1/f = 1/440 = 0.00227 s = 2.27 ms',
            'Compressions: regions of high pressure',
            'Rarefactions: regions of low pressure'
        ],
        helper: 'Sound speed in air ≈ 343 m/s at 20°C; v = fλ',
        realWorldContext: 'Musical notes, acoustic waves',
        diagramInfo: {
            type: 'sound_pressure',
            registryKey: 'soundWavePressure',
            renderOptions: {
                frequency: 440,
                amplitude: 50,
                showCompressions: true,
                showRarefactions: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_sound_pressure_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedDopplerEffectDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Doppler Effect Analysis',
        problem: 'A sound source emitting 500 Hz moves toward a stationary observer at 0.1c (speed of sound). Draw wavefront compression and find observed frequency.',
        parameters: {
            sourceFrequency: 500,
            sourceVelocity: 0.5,
            direction: 'right'
        },
        type: 'doppler_effect',
        subparts: [
            'Source moving toward observer: wavefronts compressed',
            'Observed frequency: f\' = f × [v/(v - vₛ)]',
            'Where v = speed of sound, vₛ = source velocity',
            'f\' = 500 × [343/(343 - 34.3)]',
            'f\' = 500 × [343/308.7] = 555.6 Hz',
            'Higher frequency (higher pitch) when approaching'
        ],
        helper: 'Approaching: f\' = f[v/(v-vₛ)]; Receding: f\' = f[v/(v+vₛ)]',
        realWorldContext: 'Ambulance sirens, train whistles',
        diagramInfo: {
            type: 'doppler_effect',
            registryKey: 'dopplerEffect',
            renderOptions: {
                sourceVelocity: 0.5,
                direction: 'right',
                showWavefronts: true,
                showVelocity: true,
                showFrequencyChange: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_doppler_effect_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedStandingWavesDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Standing Waves on String',
        problem: 'A 3 m string vibrates in 3rd harmonic. Wave speed is 60 m/s. Draw standing wave pattern and find frequency.',
        parameters: {
            harmonic: 3,
            length: 300,
            amplitude: 40,
            waveSpeed: 60
        },
        type: 'standing_waves',
        subparts: [
            'For string fixed at both ends: L = nλ/2',
            '3rd harmonic: n = 3',
            '3 = 3λ/2 → λ = 2 m',
            'Frequency: f = v/λ = 60/2 = 30 Hz',
            'Number of nodes: n + 1 = 4',
            'Number of antinodes: n = 3'
        ],
        helper: 'String fixed both ends: L = nλ/2, f = nv/(2L)',
        realWorldContext: 'Guitar strings, violin strings',
        diagramInfo: {
            type: 'standing_waves',
            registryKey: 'standingWaves',
            renderOptions: {
                harmonic: 3,
                length: 300,
                amplitude: 40,
                showNodes: true,
                showAntinodes: true,
                animate: false
            },
            canvasSize: { width: 900, height: 500 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_standing_waves_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedResonanceDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Wavefront Propagation',
        problem: 'A point source produces circular wavefronts with wavelength 4 cm. Draw the wavefront pattern showing 5 wavefronts.',
        parameters: {
            wavelength: 40,
            numWavefronts: 5
        },
        type: 'resonance',
        subparts: [
            'Wavefronts are surfaces of constant phase',
            'For point source: circular wavefronts',
            'Spacing between wavefronts = wavelength = 4 cm',
            'Wave rays perpendicular to wavefronts',
            'Energy propagates along rays'
        ],
        helper: 'Wavefronts show wave propagation; spacing = wavelength',
        realWorldContext: 'Water ripples, sound propagation',
        diagramInfo: {
            type: 'wavefront',
            registryKey: 'wavefrontDiagram',
            renderOptions: {
                wavelength: 40,
                numWavefronts: 5,
                showSource: true,
                showRays: true
            },
            canvasSize: { width: 700, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_wavefront_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

// ==================== THERMODYNAMICS GENERATORS WITH DIAGRAMS ====================

generateRelatedTemperatureHeatDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    // Original problem without diagram
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Temperature Conversion',
        problem: 'Convert 77°F to Celsius and Kelvin.',
        parameters: { fahrenheit: 77, convertToCelsiusKelvin: true },
        type: 'temperature_heat',
        subparts: [
            'Fahrenheit to Celsius: C = (F - 32) × 5/9',
            'Calculate: C = (77 - 32) × 5/9 = 45 × 5/9 = 25°C',
            'Celsius to Kelvin: K = C + 273.15',
            'K = 25 + 273.15 = 298.15 K',
            'Room temperature is about 25°C or 298 K'
        ],
        helper: 'C = (F-32)×5/9, K = C + 273.15',
        realWorldContext: 'International temperature scales'
    });

    // NEW: Heating curve with diagram
    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Heating Curve Analysis',
        problem: 'Ice at -20°C is heated to steam at 120°C. Draw heating curve and identify phase changes. What happens during plateaus?',
        parameters: {
            substance: 'water',
            initialTemp: -20,
            finalTemp: 120
        },
        type: 'temperature_heat',
        subparts: [
            'Segment 1: Heating ice from -20°C to 0°C',
            'Plateau 1: Melting (ice → water) at 0°C, temperature constant',
            'Segment 2: Heating water from 0°C to 100°C',
            'Plateau 2: Boiling (water → steam) at 100°C, temperature constant',
            'Segment 3: Heating steam from 100°C to 120°C',
            'During plateaus: energy goes into phase change, not temperature increase'
        ],
        helper: 'Phase changes occur at constant temperature; Heat of fusion and vaporization',
        realWorldContext: 'Boiling water, melting ice',
        diagramInfo: {
            type: 'heating_curve_physics',
            registryKey: 'heatingCurvePhysics',
            renderOptions: {
                substance: 'water',
                showPhases: true,
                showPlateaus: true,
                showLabels: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_heating_curve_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedThermalExpansionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Heat Transfer Modes',
        problem: 'Compare the three modes of heat transfer: conduction, convection, and radiation. Give examples of each.',
        parameters: {
            modes: ['conduction', 'convection', 'radiation']
        },
        type: 'thermal_expansion',
        subparts: [
            'Conduction: Heat transfer through direct contact (solid)',
            'Example: Metal spoon in hot coffee',
            'Convection: Heat transfer by fluid motion (liquid/gas)',
            'Example: Boiling water, air circulation',
            'Radiation: Heat transfer by electromagnetic waves (no medium needed)',
            'Example: Sun warming Earth, microwave oven'
        ],
        helper: 'Conduction: Q/t = kAΔT/d; Convection: fluid circulation; Radiation: all objects emit EM waves',
        realWorldContext: 'Cooking, heating systems, solar energy',
        diagramInfo: {
            type: 'heat_transfer',
            registryKey: 'heatTransferModes',
            renderOptions: {
                modes: ['conduction', 'convection', 'radiation'],
                showParticles: true,
                showArrows: true,
                showLabels: true
            },
            canvasSize: { width: 1000, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_heat_transfer_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedCalorimetryDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Phase Diagram Analysis',
        problem: 'Examine the phase diagram for water. Identify the triple point, critical point, and explain phase transitions.',
        parameters: {
            substance: 'water'
        },
        type: 'calorimetry',
        subparts: [
            'Triple point: All three phases coexist (0.01°C, 611.657 Pa)',
            'Critical point: Above this, no distinct liquid-gas phase (374°C, 22.064 MPa)',
            'Solid-liquid line: Melting/freezing boundary',
            'Liquid-gas line: Boiling/condensation boundary',
            'Solid-gas line: Sublimation/deposition boundary',
            'Water\'s unusual property: solid-liquid line has negative slope'
        ],
        helper: 'Phase diagrams show P-T relationships and phase boundaries',
        realWorldContext: 'Understanding phase changes, pressure cookers',
        diagramInfo: {
            type: 'phase_diagram_physics',
            registryKey: 'phaseDiagramPhysics',
            renderOptions: {
                substance: 'water',
                showTriplePoint: true,
                showCriticalPoint: true,
                showPhaseRegions: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_phase_diagram_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedHeatTransferDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Kinetic Theory of Gases',
        problem: 'Draw gas particles in a container showing random motion. If temperature doubles, how does average kinetic energy change?',
        parameters: {
            numParticles: 50,
            temperature: 300
        },
        type: 'heat_transfer',
        subparts: [
            'Gas particles in random motion, colliding elastically',
            'Average kinetic energy: KE_avg = (3/2)kT',
            'If temperature doubles: T_new = 2T',
            'KE_new = (3/2)k(2T) = 2 × (3/2)kT',
            'Average kinetic energy doubles when temperature doubles',
            'Particle speed increases by factor of √2'
        ],
        helper: 'KE_avg ∝ T; Root-mean-square speed: v_rms = √(3kT/m)',
        realWorldContext: 'Understanding gas behavior, temperature meaning',
        diagramInfo: {
            type: 'kinetic_theory',
            registryKey: 'kineticTheoryParticles',
            renderOptions: {
                numParticles: 50,
                temperature: 300,
                showVelocityVectors: true,
                showCollisions: false,
                animate: false
            },
            canvasSize: { width: 700, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_kinetic_theory_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedGasLawsPhysicsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'P-V Diagram for Gas Process',
        problem: 'Gas undergoes isothermal expansion from 50 L at 100 kPa to 150 L. Draw P-V diagram and find final pressure.',
        parameters: {
            processType: 'isothermal',
            initialP: 100,
            initialV: 50,
            finalV: 150
        },
        type: 'gas_laws_physics',
        subparts: [
            'Isothermal process: Temperature constant, PV = constant',
            'Initial state: P₁ = 100 kPa, V₁ = 50 L',
            'Final state: V₂ = 150 L, P₂ = ?',
            'Using P₁V₁ = P₂V₂',
            '100 × 50 = P₂ × 150',
            'P₂ = 5000/150 = 33.3 kPa',
            'Curve on P-V diagram is hyperbola'
        ],
        helper: 'Isothermal: PV = const; Isobaric: P = const; Isochoric: V = const',
        realWorldContext: 'Gas processes in engines, thermodynamics',
        diagramInfo: {
            type: 'pv_diagram',
            registryKey: 'pvDiagram',
            renderOptions: {
                processType: 'isothermal',
                initialP: 100,
                initialV: 50,
                finalV: 150,
                showWork: true,
                showCurve: true,
                showLabels: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_pv_diagram_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedThermodynamicProcessesDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Carnot Cycle Analysis',
        problem: 'Carnot engine operates between 500 K hot reservoir and 300 K cold reservoir. Draw the cycle and find efficiency.',
        parameters: {
            Th: 500,
            Tc: 300
        },
        type: 'thermodynamic_processes',
        subparts: [
            'Carnot cycle: Most efficient heat engine',
            '4 stages: isothermal expansion, adiabatic expansion, isothermal compression, adiabatic compression',
            'Efficiency: η = 1 - (Tc/Th)',
            'η = 1 - (300/500) = 1 - 0.6 = 0.4 = 40%',
            'Maximum possible efficiency between these temperatures',
            'Real engines have lower efficiency'
        ],
        helper: 'Carnot efficiency: η = 1 - (Tc/Th); Uses absolute temperatures (Kelvin)',
        realWorldContext: 'Ideal heat engines, thermodynamic limits',
        diagramInfo: {
            type: 'carnot_cycle',
            registryKey: 'carnotCycle',
            renderOptions: {
                Th: 500,
                Tc: 300,
                showStages: true,
                showEfficiency: true,
                showPVDiagram: true
            },
            canvasSize: { width: 900, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_carnot_cycle_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedHeatEnginesDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Heat Engine Efficiency',
        problem: 'Heat engine absorbs 1000 J from hot reservoir at 600 K, rejects 600 J to cold reservoir at 300 K. Draw energy flow and find efficiency.',
        parameters: {
            Qh: 1000,
            Qc: 600,
            Th: 600,
            Tc: 300
        },
        type: 'heat_engines',
        subparts: [
            'Heat absorbed: Qₕ = 1000 J',
            'Heat rejected: Qᴄ = 600 J',
            'Work done: W = Qₕ - Qᴄ = 1000 - 600 = 400 J',
            'Actual efficiency: η = W/Qₕ = 400/1000 = 0.40 = 40%',
            'Carnot efficiency: ηᴄ = 1 - Tᴄ/Tₕ = 1 - 300/600 = 0.50 = 50%',
            'Actual < Carnot (real engines have irreversibilities)',
            'Cannot convert all heat to work (2nd law)'
        ],
        helper: 'Efficiency: η = W/Qₕ = 1 - Qᴄ/Qₕ; Max: ηᴄ = 1 - Tᴄ/Tₕ',
        realWorldContext: 'Car engines, power plants, refrigerators',
        diagramInfo: {
            type: 'heat_engine',
            registryKey: 'heatEngineDiagram',
            renderOptions: {
                Qh: 1000,
                Qc: 600,
                Th: 600,
                Tc: 300,
                showWork: true,
                showEfficiency: true,
                showReservoirs: true,
                showEnergyFlow: true
            },
            canvasSize: { width: 900, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_heat_engine_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Refrigerator Coefficient of Performance',
        problem: 'Refrigerator removes 800 J from cold space at 250 K, rejects heat to room at 300 K. If work input is 200 J, find COP. Compare to ideal.',
        parameters: {
            Qc: 800,
            W: 200,
            Tc: 250,
            Th: 300
        },
        type: 'heat_engines',
        subparts: [
            'Heat removed from cold: Qᴄ = 800 J',
            'Work input: W = 200 J',
            'Heat rejected to hot: Qₕ = Qᴄ + W = 800 + 200 = 1000 J',
            'Coefficient of Performance: COP = Qᴄ/W = 800/200 = 4',
            'Ideal COP: COPᴄ = Tᴄ/(Tₕ - Tᴄ) = 250/(300 - 250) = 5',
            'Actual COP < ideal (irreversibilities)',
            'Higher COP = more efficient refrigerator'
        ],
        helper: 'Refrigerator: COP = Qᴄ/W; Ideal: COPᴄ = Tᴄ/(Tₕ - Tᴄ)',
        realWorldContext: 'Refrigerators, air conditioners, heat pumps',
        diagramInfo: {
            type: 'refrigerator',
            registryKey: 'refrigeratorDiagram',
            renderOptions: {
                Qc: 800,
                Qh: 1000,
                W: 200,
                Tc: 250,
                Th: 300,
                showCOP: true,
                showEnergyFlow: true,
                showComparison: true
            },
            canvasSize: { width: 900, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_refrigerator_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

// ==================== ELECTRICITY AND MAGNETISM GENERATORS WITH DIAGRAMS ====================

generateRelatedElectrostaticsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    // Original problem without diagram
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Coulomb\'s Law',
        problem: 'Two charges +3 μC and -5 μC separated by 0.2 m. Find force between them. (k = 9×10⁹ N·m²/C²)',
        parameters: { q1: 3e-6, q2: -5e-6, distance: 0.2, k: 9e9, findForce: true },
        type: 'electrostatics',
        subparts: [
            'Coulomb\'s Law: F = k|q₁q₂|/r²',
            'Calculate: F = 9×10⁹ × |3×10⁻⁶ × (-5×10⁻⁶)| / (0.2)²',
            'F = 9×10⁹ × 15×10⁻¹² / 0.04',
            'F = 135×10⁻³ / 0.04 = 3.375 N',
            'Force is attractive (opposite charges)'
        ],
        helper: 'Coulomb\'s Law: F = k|q₁q₂|/r², k = 8.99×10⁹ N·m²/C²',
        realWorldContext: 'Electrostatic forces between charges'
    });

    // NEW: Electric field lines with diagram
    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Electric Field Line Pattern',
        problem: 'Draw electric field lines for a +Q and -Q charge separated by distance d. Describe the field pattern.',
        parameters: {
            charges: [
                { x: -100, y: 0, charge: 1, label: '+Q' },
                { x: 100, y: 0, charge: -1, label: '-Q' }
            ]
        },
        type: 'electrostatics',
        subparts: [
            'Field lines start on positive charge, end on negative charge',
            'Lines never cross each other',
            'Density of lines indicates field strength',
            'Strong field between charges',
            'Field pattern shows dipole configuration',
            'Electric field points from + to -'
        ],
        helper: 'Field lines show direction of force on positive test charge',
        realWorldContext: 'Understanding electric fields, dipoles',
        diagramInfo: {
            type: 'electric_field',
            registryKey: 'electricFieldLines',
            renderOptions: {
                charges: [
                    { x: -100, y: 0, charge: 1, label: '+Q' },
                    { x: 100, y: 0, charge: -1, label: '-Q' }
                ],
                showCharges: true,
                showFieldLines: true,
                numLines: 16
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_electric_field_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedElectricFieldsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Electric Potential vs Distance',
        problem: 'A point charge Q = 10 μC creates an electric potential. Draw V vs r graph and find potential at r = 2 m.',
        parameters: {
            chargeQ: 10
        },
        type: 'electric_fields',
        subparts: [
            'Electric potential: V = kQ/r',
            'At r = 2 m: V = (9×10⁹)(10×10⁻⁶)/2',
            'V = 90,000/2 = 45,000 V',
            'Potential decreases as 1/r (inverse relationship)',
            'Potential is scalar (no direction)',
            'V → 0 as r → ∞'
        ],
        helper: 'Electric potential: V = kQ/r; Electric field: E = kQ/r²',
        realWorldContext: 'Voltage around charged objects',
        diagramInfo: {
            type: 'potential_distance',
            registryKey: 'potentialDistanceGraph',
            renderOptions: {
                chargeQ: 10,
                showFieldStrength: false,
                showEquation: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_potential_distance_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedACCircuitsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'AC Voltage and Current',
        problem: 'Draw AC voltage waveform with Vₘₐₓ = 170 V, f = 60 Hz. Calculate RMS voltage and period.',
        parameters: {
            vMax: 170,
            frequency: 60
        },
        type: 'ac_circuits',
        subparts: [
            'AC voltage: V(t) = Vₘₐₓ sin(2πft)',
            'Peak voltage: Vₘₐₓ = 170 V',
            'RMS voltage: Vᵣₘₛ = Vₘₐₓ/√2 = 170/1.414 = 120 V',
            'Period: T = 1/f = 1/60 = 0.0167 s = 16.7 ms',
            'Angular frequency: ω = 2πf = 377 rad/s',
            'RMS value is effective DC equivalent'
        ],
        helper: 'AC: Vᵣₘₛ = Vₘₐₓ/√2, Iᵣₘₛ = Iₘₐₓ/√2; Period T = 1/f',
        realWorldContext: 'Household electricity (120V RMS, 60 Hz)',
        diagramInfo: {
            type: 'ac_waveform',
            registryKey: 'acVoltageWaveform',
            renderOptions: {
                vMax: 170,
                frequency: 60,
                showRMS: true,
                showPeriod: true,
                showPhase: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_ac_waveform_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'RLC Circuit Impedance',
        problem: 'AC circuit with R=100Ω, L=0.5H, C=10μF at f=60Hz. Draw phasor diagram and find impedance.',
        parameters: {
            resistance: 100,
            inductance: 0.5,
            capacitance: 10e-6,
            frequency: 60
        },
        type: 'ac_circuits',
        subparts: [
            'Angular frequency: ω = 2πf = 2π(60) = 377 rad/s',
            'Inductive reactance: Xₗ = ωL = 377 × 0.5 = 188.5 Ω',
            'Capacitive reactance: Xᴄ = 1/(ωC) = 1/(377×10×10⁻⁶) = 265 Ω',
            'Net reactance: X = Xₗ - Xᴄ = 188.5 - 265 = -76.5 Ω',
            'Impedance: Z = √(R² + X²) = √(100² + 76.5²) = 126 Ω',
            'Phase angle: φ = tan⁻¹(X/R) = tan⁻¹(-76.5/100) = -37.4°',
            'Current leads voltage (capacitive circuit)'
        ],
        helper: 'Impedance: Z = √(R² + (Xₗ - Xᴄ)²); Xₗ = ωL, Xᴄ = 1/(ωC)',
        realWorldContext: 'AC power systems, filters, resonance',
        diagramInfo: {
            type: 'rlc_circuit',
            registryKey: 'rlcCircuitDiagram',
            renderOptions: {
                resistance: 100,
                inductance: 0.5,
                capacitance: 10e-6,
                frequency: 60,
                showPhasorDiagram: true,
                showImpedance: true,
                showPhase: true
            },
            canvasSize: { width: 1000, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_rlc_circuit_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Resonance in AC Circuits',
        problem: 'LC circuit with L=0.1H, C=100μF. Draw resonance curve and find resonant frequency.',
        parameters: {
            inductance: 0.1,
            capacitance: 100e-6
        },
        type: 'ac_circuits',
        subparts: [
            'Resonance occurs when Xₗ = Xᴄ',
            'At resonance: ωL = 1/(ωC)',
            'ω² = 1/(LC)',
            'ω = 1/√(LC) = 1/√(0.1 × 100×10⁻⁶)',
            'ω = 1/√(10⁻⁵) = 316.2 rad/s',
            'Resonant frequency: f₀ = ω/(2π) = 316.2/(2π) = 50.3 Hz',
            'At resonance: Z = R (minimum), maximum current'
        ],
        helper: 'Resonance: f₀ = 1/(2π√LC); Z minimum, current maximum',
        realWorldContext: 'Radio tuning, filters, oscillators',
        diagramInfo: {
            type: 'resonance_curve',
            registryKey: 'acResonanceCurve',
            renderOptions: {
                inductance: 0.1,
                capacitance: 100e-6,
                showResonantFrequency: true,
                showBandwidth: true,
                showQFactor: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_ac_resonance_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedElectricPotentialDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Equipotential Lines',
        problem: 'Draw equipotential lines around +Q and -Q charges separated by distance d. Show relationship to electric field.',
        parameters: {
            charges: [
                { q: 1, x: -50, y: 0, label: '+Q' },
                { q: -1, x: 50, y: 0, label: '-Q' }
            ]
        },
        type: 'electric_potential',
        subparts: [
            'Equipotential lines: surfaces of constant potential',
            'Electric field perpendicular to equipotential lines',
            'Lines closer together → stronger field',
            'Potential: V = kQ/r (point charge)',
            'Between charges: potential varies continuously',
            'No work done moving charge along equipotential',
            'Field points from high to low potential'
        ],
        helper: 'Equipotentials: ⊥ to E field; E = -∇V (field = negative gradient of potential)',
        realWorldContext: 'Understanding electric fields and potential energy',
        diagramInfo: {
            type: 'equipotential_lines',
            registryKey: 'equipotentialLinesDiagram',
            renderOptions: {
                charges: [
                    { q: 1, x: -50, y: 0, label: '+Q' },
                    { q: -1, x: 50, y: 0, label: '-Q' }
                ],
                showEquipotentials: true,
                showFieldLines: true,
                showValues: true,
                numEquipotentials: 10
            },
            canvasSize: { width: 900, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_equipotential_lines_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Electric Potential Energy',
        problem: 'Two charges +2μC and +3μC are 0.5 m apart. Find potential energy of the system and work to bring them to 0.2 m apart.',
        parameters: {
            q1: 2e-6,
            q2: 3e-6,
            r1: 0.5,
            r2: 0.2,
            k: 9e9
        },
        type: 'electric_potential',
        subparts: [
            'Electric potential energy: U = kq₁q₂/r',
            'Initial: U₁ = (9×10⁹)(2×10⁻⁶)(3×10⁻⁶)/0.5',
            'U₁ = 54×10⁻³/0.5 = 0.108 J',
            'Final: U₂ = (9×10⁹)(2×10⁻⁶)(3×10⁻⁶)/0.2',
            'U₂ = 54×10⁻³/0.2 = 0.270 J',
            'Work done: W = ΔU = U₂ - U₁ = 0.270 - 0.108 = 0.162 J',
            'Positive work (both charges positive, repel)'
        ],
        helper: 'Potential energy: U = kq₁q₂/r; Work = ΔU; Same sign → repel (U > 0)',
        realWorldContext: 'Electrostatic energy, ion interactions'
    });

    return relatedProblems;
}


generateRelatedCapacitanceDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Capacitor Charging Curve',
        problem: 'A 100 μF capacitor charges through 1 kΩ resistor to 12 V. Draw charging curve and find time to reach 63% of max voltage.',
        parameters: {
            capacitance: 100,
            resistance: 1000,
            voltage: 12,
            curveType: 'charging'
        },
        type: 'capacitance',
        subparts: [
            'Time constant: τ = RC = (1000)(100×10⁻⁶) = 0.1 s',
            'Charging equation: V(t) = V₀(1 - e^(-t/τ))',
            'At t = τ: V(τ) = V₀(1 - e⁻¹) = V₀(0.632) = 63.2% of V₀',
            'Time to reach 63%: t = τ = 0.1 s',
            'After 5τ: capacitor ~99% charged',
            'Exponential approach to final voltage'
        ],
        helper: 'Time constant τ = RC; V(t) = V₀(1 - e^(-t/τ)) for charging',
        realWorldContext: 'Camera flash circuits, timing circuits',
        diagramInfo: {
            type: 'capacitor_curve',
            registryKey: 'capacitorChargeCurve',
            renderOptions: {
                capacitance: 100,
                resistance: 1000,
                voltage: 12,
                curveType: 'charging',
                showTimeConstant: true,
                showEquation: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_capacitor_curve_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedCurrentResistanceDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Basic Circuit Analysis',
        problem: 'Draw a circuit with 12V battery, 100Ω resistor, 200Ω resistor, 10μF capacitor, and closed switch. Analyze the circuit.',
        parameters: {
            components: [
                { type: 'battery', voltage: 12 },
                { type: 'resistor', resistance: 100 },
                { type: 'capacitor', capacitance: 10 },
                { type: 'switch', state: 'closed' }
            ],
            configuration: 'series'
        },
        type: 'current_resistance',
        subparts: [
            'Total resistance (series): R = 100 + 200 = 300 Ω',
            'Current (Ohm\'s Law): I = V/R = 12/300 = 0.04 A = 40 mA',
            'Voltage across 100Ω: V₁ = IR = 0.04 × 100 = 4 V',
            'Voltage across 200Ω: V₂ = IR = 0.04 × 200 = 8 V',
            'Total voltage: 4 + 8 = 12 V (check)',
            'Capacitor will charge to 12 V'
        ],
        helper: 'Ohm\'s Law: V = IR; Series: same current, voltages add',
        realWorldContext: 'Basic electrical circuits',
        diagramInfo: {
            type: 'circuit_diagram',
            registryKey: 'circuitDiagram',
            renderOptions: {
                components: [
                    { type: 'battery', voltage: 12 },
                    { type: 'resistor', resistance: 100 },
                    { type: 'capacitor', capacitance: 10 },
                    { type: 'switch', state: 'closed' }
                ],
                configuration: 'series',
                showValues: true,
                showCurrent: true,
                showSymbols: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_circuit_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedDCCircuitsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Series vs Parallel Circuit Comparison',
        problem: 'Compare circuits with three resistors (100Ω, 200Ω, 150Ω) connected to 12V battery in series vs parallel configurations.',
        parameters: {
            voltage: 12,
            resistors: [100, 200, 150],
            compareCircuits: true
        },
        type: 'dc_circuits',
        subparts: [
            'Series: R_total = 100 + 200 + 150 = 450 Ω',
            'Series current: I = 12/450 = 0.027 A (same through all)',
            'Parallel: 1/R_total = 1/100 + 1/200 + 1/150 = 0.0233',
            'R_total = 42.9 Ω',
            'Parallel current: I = 12/42.9 = 0.28 A',
            'Parallel has lower resistance, higher current'
        ],
        helper: 'Series: R_total = ΣR, same I; Parallel: 1/R_total = Σ(1/R), same V',
        realWorldContext: 'Household circuits, Christmas lights',
        diagramInfo: {
            type: 'series_parallel',
            registryKey: 'seriesParallelCircuits',
            renderOptions: {
                voltage: 12,
                resistors: [100, 200, 150],
                showBoth: true,
                showCalculations: true,
                showCurrent: true
            },
            canvasSize: { width: 1000, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_series_parallel_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedMagneticFieldsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Magnetic Field Lines of Bar Magnet',
        problem: 'Draw the magnetic field line pattern around a bar magnet. Explain the field direction and where field is strongest.',
        parameters: {
            sourceType: 'bar_magnet'
        },
        type: 'magnetic_fields',
        subparts: [
            'Field lines emerge from North pole',
            'Field lines enter South pole',
            'Lines form closed loops',
            'Never cross each other',
            'Strongest field near poles (lines closest together)',
            'Field direction: North to South outside magnet'
        ],
        helper: 'Magnetic field lines show direction of force on North pole',
        realWorldContext: 'Permanent magnets, compass behavior',
        diagramInfo: {
            type: 'magnetic_field',
            registryKey: 'magneticFieldLines',
            renderOptions: {
                sourceType: 'bar_magnet',
                showPoles: true,
                showFieldLines: true,
                showCompass: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_magnetic_field_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Lorentz Force on Moving Charge',
        problem: 'An electron (q = -e) moves at 50 m/s eastward through a magnetic field of 1 T pointing into the page. Find force magnitude and direction.',
        parameters: {
            charge: -1,
            velocity: { x: 50, y: 0 },
            magneticField: { direction: 'into_page', magnitude: 1 }
        },
        type: 'magnetic_fields',
        subparts: [
            'Lorentz force: F = qvB sin(θ)',
            'Angle between v and B: θ = 90° (perpendicular)',
            'F = (1.6×10⁻¹⁹)(50)(1) sin(90°)',
            'F = 8×10⁻¹⁸ N',
            'Direction: Use right-hand rule (for positive charge)',
            'For electron (negative): force is southward (opposite)',
            'Force perpendicular to both v and B'
        ],
        helper: 'Lorentz force: F = qvB sin(θ); Use right-hand rule for direction',
        realWorldContext: 'Particle accelerators, mass spectrometers',
        diagramInfo: {
            type: 'lorentz_force',
            registryKey: 'lorentzForce',
            renderOptions: {
                velocity: { x: 50, y: 0 },
                magneticField: { direction: 'into_page', magnitude: 1 },
                charge: 1,
                showVelocity: true,
                showField: true,
                showForce: true,
                showRightHandRule: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_lorentz_force_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedEMInductionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Electromagnetic Induction',
        problem: 'A magnet moves toward a 5-turn coil. Draw the setup and explain how current is induced. What determines current direction?',
        parameters: {
            coilTurns: 5,
            magnetMoving: true
        },
        type: 'electromagnetic_induction',
        subparts: [
            'Moving magnet changes magnetic flux through coil',
            'Faraday\'s Law: ε = -N(ΔΦ/Δt)',
            'Changing flux induces EMF',
            'Induced current creates its own magnetic field',
            'Lenz\'s Law: Induced current opposes the change',
            'If magnet approaches: induced field repels magnet',
            'Current direction: use right-hand rule'
        ],
        helper: 'Faraday: ε = -N(ΔΦ/Δt); Lenz: induced effect opposes cause',
        realWorldContext: 'Generators, transformers, induction cooktops',
        diagramInfo: {
            type: 'em_induction',
            registryKey: 'electromagneticInduction',
            renderOptions: {
                coilTurns: 5,
                magnetMoving: true,
                showMagnet: true,
                showCoil: true,
                showCurrent: true,
                showFlux: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_em_induction_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Transformer Operation',
        problem: 'A transformer has 100 turns on primary and 500 turns on secondary. Input voltage is 120 V. Draw transformer and find output voltage.',
        parameters: {
            primaryTurns: 100,
            secondaryTurns: 500,
            inputVoltage: 120
        },
        type: 'electromagnetic_induction',
        subparts: [
            'Transformer ratio: Vₛ/Vₚ = Nₛ/Nₚ',
            'Vₛ/120 = 500/100',
            'Vₛ = 120 × 5 = 600 V',
            'Step-up transformer (increases voltage)',
            'Power conservation: VₚIₚ = VₛIₛ (ideal)',
            'Current decreases as voltage increases'
        ],
        helper: 'Transformer: Vₛ/Vₚ = Nₛ/Nₚ; Iₛ/Iₚ = Nₚ/Nₛ',
        realWorldContext: 'Power distribution, voltage conversion',
        diagramInfo: {
            type: 'transformer',
            registryKey: 'transformer',
            renderOptions: {
                primaryTurns: 100,
                secondaryTurns: 500,
                inputVoltage: 120,
                showCore: true,
                showTurns: true,
                showVoltages: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_transformer_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}



// ==================== OPTICS GENERATORS WITH DIAGRAMS ====================

generateRelatedReflectionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'easy',
        scenario: 'Plane Mirror Image Formation',
        problem: 'Object 10 cm tall is placed 15 cm in front of plane mirror. Draw ray diagram and describe image characteristics.',
        parameters: {
            mirrorType: 'plane',
            objectDistance: 100,
            objectHeight: 50
        },
        type: 'reflection',
        subparts: [
            'Plane mirror produces virtual image',
            'Image distance = Object distance (15 cm behind mirror)',
            'Image height = Object height (10 cm)',
            'Image is upright (not inverted)',
            'Magnification: m = 1 (same size)',
            'Image appears to be behind mirror (virtual)'
        ],
        helper: 'Plane mirror: d_image = d_object, m = 1, virtual, upright',
        realWorldContext: 'Bathroom mirrors, reflection',
        diagramInfo: {
            type: 'mirror_ray_diagram',
            registryKey: 'planeMirrorRayDiagram',
            renderOptions: {
                mirrorType: 'plane',
                objectDistance: 100,
                objectHeight: 50,
                showObject: true,
                showImage: true,
                showRays: true,
                showNormals: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_plane_mirror_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedRefractionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Snell\'s Law Application',
        problem: 'Light travels from air (n=1.0) into glass (n=1.5) at 30° incident angle. Draw refraction and find refracted angle.',
        parameters: {
            n1: 1.0,
            n2: 1.5,
            incidentAngle: 30
        },
        type: 'refraction',
        subparts: [
            'Snell\'s Law: n₁ sin(θ₁) = n₂ sin(θ₂)',
            '1.0 × sin(30°) = 1.5 × sin(θ₂)',
            '0.5 = 1.5 × sin(θ₂)',
            'sin(θ₂) = 0.5/1.5 = 0.333',
            'θ₂ = sin⁻¹(0.333) = 19.5°',
            'Light bends toward normal (entering denser medium)'
        ],
        helper: 'Snell\'s Law: n₁ sin(θ₁) = n₂ sin(θ₂); Toward normal if n₂ > n₁',
        realWorldContext: 'Light bending in water, lenses',
        diagramInfo: {
            type: 'snells_law',
            registryKey: 'snellsLawRefraction',
            renderOptions: {
                n1: 1.0,
                n2: 1.5,
                incidentAngle: 30,
                showAngles: true,
                showNormals: true,
                showEquation: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_snells_law_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Total Internal Reflection',
        problem: 'Light travels from glass (n=1.5) to air (n=1.0). Draw the critical angle and explain total internal reflection.',
        parameters: {
            n1: 1.5,
            n2: 1.0,
            angle: 50
        },
        type: 'refraction',
        subparts: [
            'Critical angle: sin(θc) = n₂/n₁',
            'sin(θc) = 1.0/1.5 = 0.667',
            'θc = sin⁻¹(0.667) = 41.8°',
            'If θ > θc: Total internal reflection occurs',
            'No refracted ray, all light reflects back',
            'Used in optical fibers'
        ],
        helper: 'TIR occurs when: θ > θc and n₁ > n₂; θc = sin⁻¹(n₂/n₁)',
        realWorldContext: 'Fiber optics, prisms, diamonds',
        diagramInfo: {
            type: 'total_internal_reflection',
            registryKey: 'totalInternalReflection',
            renderOptions: {
                n1: 1.5,
                n2: 1.0,
                angle: 50,
                showCriticalAngle: true,
                showMultipleAngles: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_total_internal_reflection_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedLensesDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Convex Lens Image Formation',
        problem: 'Object 5 cm tall placed 15 cm from convex lens (f = 10 cm). Draw ray diagram and find image position and size.',
        parameters: {
            lensType: 'convex',
            focalLength: 100,
            objectDistance: 150,
            objectHeight: 50
        },
        type: 'lenses',
        subparts: [
            'Lens equation: 1/f = 1/d_o + 1/d_i',
            '1/10 = 1/15 + 1/d_i',
            '1/d_i = 1/10 - 1/15 = 3/30 - 2/30 = 1/30',
            'd_i = 30 cm (real image, opposite side)',
            'Magnification: m = -d_i/d_o = -30/15 = -2',
            'Image height: h_i = m × h_o = -2 × 5 = -10 cm (inverted, magnified)'
        ],
        helper: 'Lens equation: 1/f = 1/d_o + 1/d_i; m = -d_i/d_o = h_i/h_o',
        realWorldContext: 'Cameras, projectors, magnifying glasses',
        diagramInfo: {
            type: 'lens_ray_diagram',
            registryKey: 'convexLensRayDiagram',
            renderOptions: {
                lensType: 'convex',
                focalLength: 100,
                objectDistance: 150,
                objectHeight: 50,
                showObject: true,
                showImage: true,
                showPrincipalRays: true,
                showFocalPoints: true
            },
            canvasSize: { width: 1000, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_convex_lens_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Concave Lens Image Formation',
        problem: 'Object 5 cm tall placed 15 cm from concave lens (f = -10 cm). Draw ray diagram and describe image.',
        parameters: {
            lensType: 'concave',
            focalLength: -100,
            objectDistance: 150,
            objectHeight: 50
        },
        type: 'lenses',
        subparts: [
            'Lens equation: 1/f = 1/d_o + 1/d_i',
            '1/(-10) = 1/15 + 1/d_i',
            '1/d_i = -1/10 - 1/15 = -3/30 - 2/30 = -5/30',
            'd_i = -6 cm (virtual image, same side as object)',
            'Magnification: m = -d_i/d_o = -(-6)/15 = 0.4',
            'Image: virtual, upright, smaller (4 cm × 0.4 = 2 cm tall)'
        ],
        helper: 'Concave lens: always produces virtual, upright, diminished image',
        realWorldContext: 'Correcting nearsightedness, peepholes',
        diagramInfo: {
            type: 'lens_ray_diagram',
            registryKey: 'concaveLensRayDiagram',
            renderOptions: {
                lensType: 'concave',
                focalLength: -100,
                objectDistance: 150,
                objectHeight: 50,
                showObject: true,
                showImage: true,
                showPrincipalRays: true,
                showFocalPoints: true
            },
            canvasSize: { width: 1000, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_concave_lens_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedMirrorsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Concave Mirror Image Formation',
        problem: 'Object 5 cm tall at 15 cm from concave mirror (f = 10 cm). Draw ray diagram and locate image.',
        parameters: {
            mirrorType: 'concave',
            focalLength: 100,
            objectDistance: 150,
            objectHeight: 50
        },
        type: 'mirrors',
        subparts: [
            'Mirror equation: 1/f = 1/d_o + 1/d_i',
            '1/10 = 1/15 + 1/d_i',
            '1/d_i = 1/10 - 1/15 = 1/30',
            'd_i = 30 cm (real image, in front of mirror)',
            'Magnification: m = -d_i/d_o = -30/15 = -2',
            'Image: real, inverted, magnified (10 cm tall)'
        ],
        helper: 'Concave mirror can form real or virtual images depending on object position',
        realWorldContext: 'Telescopes, makeup mirrors, shaving mirrors',
        diagramInfo: {
            type: 'mirror_ray_diagram',
            registryKey: 'concaveMirrorRayDiagram',
            renderOptions: {
                mirrorType: 'concave',
                focalLength: 100,
                objectDistance: 150,
                objectHeight: 50,
                showObject: true,
                showImage: true,
                showRays: true,
                showFocalPoint: true,
                showCenter: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_concave_mirror_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Convex Mirror Image Formation',
        problem: 'Object 5 cm tall at 15 cm from convex mirror (f = -10 cm). Draw ray diagram and describe image.',
        parameters: {
            mirrorType: 'convex',
            focalLength: -100,
            objectDistance: 150,
            objectHeight: 50
        },
        type: 'mirrors',
        subparts: [
            'Mirror equation: 1/f = 1/d_o + 1/d_i',
            '1/(-10) = 1/15 + 1/d_i',
            '1/d_i = -1/10 - 1/15 = -5/30',
            'd_i = -6 cm (virtual image, behind mirror)',
            'Magnification: m = -d_i/d_o = 6/15 = 0.4',
            'Image: virtual, upright, smaller (2 cm tall)'
        ],
        helper: 'Convex mirror always produces virtual, upright, diminished image',
        realWorldContext: 'Car side mirrors, security mirrors',
        diagramInfo: {
            type: 'mirror_ray_diagram',
            registryKey: 'convexMirrorRayDiagram',
            renderOptions: {
                mirrorType: 'convex',
                focalLength: -100,
                objectDistance: 150,
                objectHeight: 50,
                showObject: true,
                showImage: true,
                showRays: true,
                showFocalPoint: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_convex_mirror_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedOpticalInstrumentsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Prism Dispersion',
        problem: 'White light passes through a 60° prism. Draw the dispersion pattern and explain why colors separate.',
        parameters: {
            prismAngle: 60
        },
        type: 'optical_instruments',
        subparts: [
            'White light contains all visible wavelengths',
            'Different wavelengths refract by different amounts',
            'Refractive index varies with wavelength (dispersion)',
            'Violet light: highest n, bends most',
            'Red light: lowest n, bends least',
            'Result: spectrum from red to violet'
        ],
        helper: 'Dispersion: n varies with λ; Short λ (violet) bends more than long λ (red)',
        realWorldContext: 'Rainbows, spectroscopy',
        diagramInfo: {
            type: 'prism_dispersion',
            registryKey: 'prismDispersion',
            renderOptions: {
                prismAngle: 60,
                showSpectrum: true,
                showAngles: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_prism_dispersion_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Optical Fiber Total Internal Reflection',
        problem: 'Draw light propagation through a 30 cm optical fiber showing multiple total internal reflections.',
        parameters: {
            fiberLength: 300,
            numReflections: 5
        },
        type: 'optical_instruments',
        subparts: [
            'Fiber has high refractive index core',
            'Low refractive index cladding',
            'Light enters at shallow angle',
            'Repeatedly reflects at core-cladding boundary',
            'Total internal reflection keeps light inside',
            'Allows long-distance light transmission'
        ],
        helper: 'Optical fibers use TIR; n_core > n_cladding',
        realWorldContext: 'Internet fiber optics, medical endoscopes',
        diagramInfo: {
            type: 'optical_fiber',
            registryKey: 'opticalFiber',
            renderOptions: {
                fiberLength: 300,
                numReflections: 5,
                showCore: true,
                showCladding: true,
                showReflections: true
            },
            canvasSize: { width: 900, height: 400 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_optical_fiber_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedWaveOpticsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Light Polarization',
        problem: 'Unpolarized light passes through a polarizer. Draw the setup and explain how intensity changes.',
        parameters: {
            polarizationType: 'linear'
        },
        type: 'wave_optics',
        subparts: [
            'Unpolarized light: electric field vibrates in all directions',
            'Polarizer allows only one orientation to pass',
            'Intensity after polarizer: I = I₀/2',
            'Light is now linearly polarized',
            'Second polarizer at angle θ: I = I₀ cos²(θ) (Malus\'s Law)',
            'Crossed polarizers (90°): no light passes'
        ],
        helper: 'Malus\'s Law: I = I₀ cos²(θ); Polarization proves light is transverse wave',
        realWorldContext: 'Sunglasses, LCD screens, photography filters',
        diagramInfo: {
            type: 'polarization',
            registryKey: 'polarizationDiagram',
            renderOptions: {
                polarizationType: 'linear',
                showUnpolarized: true,
                showPolarizer: true,
                showPolarized: true
            },
            canvasSize: { width: 900, height: 500 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_polarization_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedDiffractionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Double Slit Interference Pattern',
        problem: 'Light (λ = 600 nm) passes through double slit with separation 0.5 mm. Screen is 1 m away. Draw interference pattern and find fringe spacing.',
        parameters: {
            slitType: 'double',
            slitSeparation: 0.5,
            wavelength: 600,
            screenDistance: 1000
        },
        type: 'diffraction',
        subparts: [
            'Double slit creates interference pattern',
            'Bright fringes: d sin(θ) = mλ (m = 0, 1, 2...)',
            'For small angles: sin(θ) ≈ tan(θ) = y/L',
            'Fringe spacing: Δy = λL/d',
            'Δy = (600×10⁻⁹)(1)/(0.5×10⁻³)',
            'Δy = 1.2×10⁻³ m = 1.2 mm'
        ],
        helper: 'Double slit: Bright at d sin(θ) = mλ; Dark at d sin(θ) = (m+½)λ',
        realWorldContext: 'Wave nature of light, diffraction gratings',
        diagramInfo: {
            type: 'diffraction',
            registryKey: 'diffractionPattern',
            renderOptions: {
                slitType: 'double',
                slitWidth: 20,
                slitSeparation: 80,
                wavelength: 10,
                showIntensity: true,
                showPattern: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_diffraction_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

// ==================== MODERN PHYSICS GENERATORS WITH DIAGRAMS ====================

generateRelatedPhotoelectricEffectDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Photoelectric Effect Analysis',
        problem: 'Photons of energy 3.0 eV strike metal surface with work function 2.0 eV. Draw the process and find maximum kinetic energy of ejected electrons.',
        parameters: {
            workFunction: 2.0,
            photonEnergy: 3.0
        },
        type: 'photoelectric_effect',
        subparts: [
            'Einstein\'s photoelectric equation: KE_max = hf - φ',
            'Photon energy: E = 3.0 eV',
            'Work function: φ = 2.0 eV',
            'KE_max = 3.0 - 2.0 = 1.0 eV',
            'Convert to joules: 1.0 eV × 1.6×10⁻¹⁹ J/eV = 1.6×10⁻¹⁹ J',
            'If hf < φ, no electrons ejected'
        ],
        helper: 'Photoelectric: KE_max = hf - φ; Threshold: f₀ = φ/h',
        realWorldContext: 'Solar cells, light sensors, quantum nature of light',
        diagramInfo: {
            type: 'photoelectric_effect',
            registryKey: 'photoelectricEffect',
            renderOptions: {
                workFunction: 2.0,
                photonEnergy: 3.0,
                showPhotons: true,
                showElectrons: true,
                showEnergyLevels: true,
                showEquation: true
            },
            canvasSize: { width: 800, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_photoelectric_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}



generateRelatedAtomicSpectraDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Hydrogen Emission Spectrum',
        problem: 'Hydrogen atom electron transitions from n=3 to n=2, n=4 to n=2, n=5 to n=2. Draw energy level diagram and emission spectrum.',
        parameters: {
            element: 'hydrogen',
            transitions: [
                { n1: 3, n2: 2, wavelength: 656 },
                { n1: 4, n2: 2, wavelength: 486 },
                { n1: 5, n2: 2, wavelength: 434 }
            ]
        },
        type: 'atomic_spectra',
        subparts: [
            'Energy levels: E_n = -13.6/n² eV',
            'Transition n=3→2: ΔE = E₃ - E₂ = -13.6(1/9 - 1/4) = 1.89 eV',
            'Photon wavelength: λ = hc/ΔE = 656 nm (red)',
            'n=4→2: ΔE = 2.55 eV, λ = 486 nm (cyan)',
            'n=5→2: ΔE = 2.86 eV, λ = 434 nm (violet)',
            'These form the Balmer series (visible light)'
        ],
        helper: 'Bohr model: E_n = -13.6/n² eV; ΔE = hf = hc/λ',
        realWorldContext: 'Spectroscopy, identifying elements, astronomy',
        diagramInfo: {
            type: 'emission_spectra',
            registryKey: 'lineEmissionSpectra',
            renderOptions: {
                element: 'hydrogen',
                transitions: [
                    { n1: 3, n2: 2, wavelength: 656 },
                    { n1: 4, n2: 2, wavelength: 486 },
                    { n1: 5, n2: 2, wavelength: 434 }
                ],
                showEnergyLevels: true,
                showSpectrum: true,
                showTransitions: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_emission_spectra_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedBohrModelDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Bohr Model Energy Levels',
        problem: 'Draw Bohr model energy level diagram for hydrogen. Calculate energy and radius for n=1, 2, 3.',
        parameters: {
            atom: 'hydrogen',
            levels: [1, 2, 3]
        },
        type: 'bohr_model',
        subparts: [
            'Bohr energy levels: Eₙ = -13.6/n² eV',
            'n=1: E₁ = -13.6/1² = -13.6 eV (ground state)',
            'n=2: E₂ = -13.6/4 = -3.4 eV',
            'n=3: E₃ = -13.6/9 = -1.51 eV',
            'Bohr radius: rₙ = n²r₀, r₀ = 0.529 Å',
            'n=1: r₁ = 0.529 Å',
            'n=2: r₂ = 4(0.529) = 2.12 Å',
            'n=3: r₃ = 9(0.529) = 4.76 Å',
            'Higher n → higher energy, larger radius'
        ],
        helper: 'Bohr: Eₙ = -13.6/n² eV, rₙ = n²(0.529 Å); n = 1, 2, 3...',
        realWorldContext: 'Atomic structure, spectroscopy',
        diagramInfo: {
            type: 'bohr_energy_levels',
            registryKey: 'bohrEnergyLevelDiagram',
            renderOptions: {
                atom: 'hydrogen',
                showLevels: [1, 2, 3, 4, 5],
                showEnergies: true,
                showRadii: true,
                showTransitions: false
            },
            canvasSize: { width: 800, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_bohr_energy_levels_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Bohr Model Transitions',
        problem: 'Electron in hydrogen transitions from n=4 to n=2. Draw transition and calculate photon wavelength.',
        parameters: {
            n_initial: 4,
            n_final: 2
        },
        type: 'bohr_model',
        subparts: [
            'Initial energy: E₄ = -13.6/16 = -0.85 eV',
            'Final energy: E₂ = -13.6/4 = -3.4 eV',
            'Energy difference: ΔE = E₄ - E₂ = -0.85 - (-3.4) = 2.55 eV',
            'Convert to joules: 2.55 × 1.6×10⁻¹⁹ = 4.08×10⁻¹⁹ J',
            'Photon energy: E = hf = hc/λ',
            'Wavelength: λ = hc/E = (6.63×10⁻³⁴)(3×10⁸)/(4.08×10⁻¹⁹)',
            'λ = 4.87×10⁻⁷ m = 487 nm (blue-green light)',
            'This is part of Balmer series (visible light)'
        ],
        helper: 'ΔE = hf = hc/λ; Balmer series: transitions to n=2',
        realWorldContext: 'Emission spectra, hydrogen lamp',
        diagramInfo: {
            type: 'bohr_transitions',
            registryKey: 'bohrTransitionDiagram',
            renderOptions: {
                n_initial: 4,
                n_final: 2,
                showEnergyLevels: true,
                showPhoton: true,
                showWavelength: true,
                showCalculation: true
            },
            canvasSize: { width: 800, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_bohr_transition_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedComptonScatteringDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Compton Scattering Event',
        problem: 'X-ray photon (λ₀ = 0.1 nm) scatters off electron at 90°. Draw scattering diagram and find scattered wavelength.',
        parameters: {
            initialWavelength: 0.1e-9,
            scatteringAngle: 90
        },
        type: 'compton_scattering',
        subparts: [
            'Compton equation: Δλ = λ - λ₀ = (h/mₑc)(1 - cos θ)',
            'Compton wavelength: λc = h/(mₑc) = 2.43×10⁻¹² m',
            'Angle: θ = 90°, cos(90°) = 0',
            'Δλ = 2.43×10⁻¹² (1 - 0) = 2.43×10⁻¹² m',
            'Scattered wavelength: λ = λ₀ + Δλ',
            'λ = 0.1×10⁻⁹ + 2.43×10⁻¹² = 1.0243×10⁻¹⁰ m',
            'λ ≈ 0.102 nm (slightly longer wavelength)',
            'Photon loses energy to recoil electron'
        ],
        helper: 'Compton: Δλ = (h/mₑc)(1 - cos θ); Demonstrates photon momentum',
        realWorldContext: 'X-ray scattering, particle nature of light',
        diagramInfo: {
            type: 'compton_scattering',
            registryKey: 'comptonScatteringDiagram',
            renderOptions: {
                initialWavelength: 0.1e-9,
                scatteringAngle: 90,
                showPhoton: true,
                showElectron: true,
                showMomentum: true,
                showWavelengthChange: true,
                showEquation: true
            },
            canvasSize: { width: 900, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_compton_scattering_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Compton Scattering Energy Transfer',
        problem: 'Photon with energy 100 keV scatters at 180° (backscatter). Calculate energy of scattered photon and recoil electron.',
        parameters: {
            initialEnergy: 100e3,
            scatteringAngle: 180
        },
        type: 'compton_scattering',
        subparts: [
            'Electron rest energy: E₀ = mₑc² = 511 keV',
            'For backscatter (θ = 180°): cos(180°) = -1',
            'Energy of scattered photon: E\' = E/(1 + (E/E₀)(1 - cos θ))',
            'E\' = 100/(1 + (100/511)(1 - (-1)))',
            'E\' = 100/(1 + (100/511)(2))',
            'E\' = 100/(1 + 0.391) = 100/1.391 = 71.9 keV',
            'Energy transferred to electron: ΔE = 100 - 71.9 = 28.1 keV',
            'Maximum energy transfer occurs at 180° scattering'
        ],
        helper: 'Compton: E\' = E/[1 + (E/mₑc²)(1 - cos θ)]; mₑc² = 511 keV',
        realWorldContext: 'X-ray imaging, gamma ray astronomy',
        diagramInfo: {
            type: 'compton_energy',
            registryKey: 'comptonEnergyDiagram',
            renderOptions: {
                initialEnergy: 100,
                scatteringAngle: 180,
                showEnergyLevels: true,
                showBackscatter: true,
                showElectronRecoil: true,
                showConservation: true
            },
            canvasSize: { width: 900, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_compton_energy_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedQuantumMechanicsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Quantum Tunneling Through Barrier',
        problem: 'Particle with energy 7 eV encounters potential barrier of height 10 eV and width 5 nm. Draw potential well and explain tunneling.',
        parameters: {
            barrierHeight: 10,
            barrierWidth: 50,
            particleEnergy: 7
        },
        type: 'quantum_mechanics',
        subparts: [
            'Classically: particle cannot pass (E < V)',
            'Quantum mechanically: wavefunction penetrates barrier',
            'Probability of tunneling depends on barrier width and height',
            'Tunneling probability: T ∝ e^(-2αL), where α depends on (V-E)',
            'Wavefunction decays exponentially inside barrier',
            'Non-zero probability to find particle beyond barrier'
        ],
        helper: 'Quantum tunneling allows particles to pass through classically forbidden regions',
        realWorldContext: 'Radioactive decay, scanning tunneling microscope, nuclear fusion in stars',
        diagramInfo: {
            type: 'quantum_tunneling',
            registryKey: 'quantumTunneling',
            renderOptions: {
                barrierHeight: 10,
                barrierWidth: 50,
                particleEnergy: 7,
                showPotentialWell: true,
                showWavefunction: true,
                showProbability: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_quantum_tunneling_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedWaveParticleDualityDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'de Broglie Wavelength',
        problem: 'Electron accelerated through 100 V potential. Calculate de Broglie wavelength. (m_e = 9.11×10⁻³¹ kg, e = 1.6×10⁻¹⁹ C)',
        parameters: {
            particle: 'electron',
            voltage: 100
        },
        type: 'wave_particle_duality',
        subparts: [
            'Kinetic energy: KE = eV = 1.6×10⁻¹⁹ × 100 = 1.6×10⁻¹⁷ J',
            'Velocity: KE = ½mv² → v = √(2KE/m) = √(2×1.6×10⁻¹⁷/9.11×10⁻³¹)',
            'v = 5.93×10⁶ m/s',
            'Momentum: p = mv = 9.11×10⁻³¹ × 5.93×10⁶ = 5.4×10⁻²⁴ kg·m/s',
            'de Broglie wavelength: λ = h/p = 6.63×10⁻³⁴/5.4×10⁻²⁴',
            'λ = 1.23×10⁻¹⁰ m = 0.123 nm (similar to X-ray wavelengths)'
        ],
        helper: 'de Broglie: λ = h/p = h/(mv); All matter has wave properties',
        realWorldContext: 'Electron microscopes, electron diffraction',
        diagramInfo: {
            type: 'de_broglie',
            registryKey: 'deBroglieWavelength',
            renderOptions: {
                particle: 'electron',
                velocity: 1e6,
                showWaveform: true,
                showEquation: true,
                showComparison: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_de_broglie_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

// ==================== RELATIVITY GENERATORS WITH DIAGRAMS ====================

generateRelatedTimeDilationDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Time Dilation Calculation',
        problem: 'Spacecraft travels at 0.8c. Draw time dilation graph and find time dilation factor. If 10 years pass on Earth, how much time passes on spacecraft?',
        parameters: {
            velocity: 0.8
        },
        type: 'time_dilation',
        subparts: [
            'Lorentz factor: γ = 1/√(1 - v²/c²)',
            'γ = 1/√(1 - 0.8²) = 1/√(1 - 0.64) = 1/√0.36',
            'γ = 1/0.6 = 1.667',
            'Time dilation: Δt = γΔt₀',
            'If Δt = 10 years (Earth), then Δt₀ = 10/1.667 = 6 years',
            'Only 6 years pass on spacecraft (moving clock runs slower)'
        ],
        helper: 'Time dilation: Δt = γΔt₀, where γ = 1/√(1 - v²/c²)',
        realWorldContext: 'GPS satellites, particle accelerators, twin paradox',
        diagramInfo: {
            type: 'time_dilation',
            registryKey: 'timeDilation',
            renderOptions: {
                showLorentzFactor: true,
                showEquation: true,
                showExample: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_time_dilation_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedLengthContractionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Length Contraction Analysis',
        problem: 'Spaceship 100 m long (at rest) travels at 0.8c. Draw length contraction diagram and find observed length from Earth.',
        parameters: {
            properLength: 100,
            velocity: 0.8
        },
        type: 'length_contraction',
        subparts: [
            'Lorentz factor: γ = 1/√(1 - v²/c²) = 1.667 (from previous calculation)',
            'Length contraction: L = L₀/γ',
            'L = 100/1.667 = 60 m',
            'Spaceship appears 60 m long to Earth observer',
            'Contraction occurs only in direction of motion',
            'Perpendicular dimensions unchanged'
        ],
        helper: 'Length contraction: L = L₀/γ = L₀√(1 - v²/c²)',
        realWorldContext: 'High-speed particles, cosmic ray muons reaching Earth',
        diagramInfo: {
            type: 'length_contraction',
            registryKey: 'lengthContraction',
            renderOptions: {
                properLength: 100,
                velocity: 0.8,
                showRestFrame: true,
                showMovingFrame: true,
                showEquation: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_length_contraction_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedRelativisticMomentumDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Spacetime Diagram',
        problem: 'Draw a spacetime diagram showing three events. Event A at (t=0, x=0), Event B at (t=100s, x=50ls), Event C at (t=80s, x=-30ls). Show worldlines.',
        parameters: {
            events: [
                { x: 0, t: 0, label: 'A' },
                { x: 50, t: 100, label: 'B' },
                { x: -30, t: 80, label: 'C' }
            ]
        },
        type: 'relativistic_momentum',
        subparts: [
            'Spacetime diagram: time on vertical axis, space on horizontal',
            'Event A at origin',
            'Event B: 50 light-seconds away, 100 seconds later',
            'Light cone: events within can be causally connected',
            'Worldline: path of object through spacetime',
            'Timelike separation: can be causally connected',
            'Spacelike separation: cannot be causally connected'
        ],
        helper: 'Spacetime diagrams show events in 4D spacetime; Light travels at 45° on diagram',
        realWorldContext: 'Understanding causality and relativity',
        diagramInfo: {
            type: 'spacetime_diagram',
            registryKey: 'spacetimeDiagram',
            renderOptions: {
                events: [
                    { x: 0, t: 0, label: 'A' },
                    { x: 50, t: 100, label: 'B' },
                    { x: -30, t: 80, label: 'C' }
                ],
                showLightCones: true,
                showWorldlines: true,
                showAxes: true
            },
            canvasSize: { width: 800, height: 800 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_spacetime_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}


generateRelatedMassEnergyEquivalenceDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Mass-Energy Conversion',
        problem: 'Calculate energy released when 0.1 g of matter is completely converted to energy. Compare to TNT explosion (4.6 MJ/kg).',
        parameters: {
            mass: 0.0001,
            c: 3e8
        },
        type: 'mass_energy_equivalence',
        subparts: [
            'Einstein\'s equation: E = mc²',
            'mass: m = 0.1 g = 0.0001 kg',
            'E = 0.0001 × (3×10⁸)²',
            'E = 0.0001 × 9×10¹⁶ = 9×10¹² J = 9 TJ',
            'TNT comparison: 9×10¹² J / (4.6×10⁶ J/kg) = 1,957,000 kg',
            'Equivalent to ~2 million kg of TNT!',
            'Demonstrates enormous energy in small mass'
        ],
        helper: 'E = mc²; 1 kg of matter = 9×10¹⁶ J; c = 3×10⁸ m/s',
        realWorldContext: 'Nuclear reactions, particle-antiparticle annihilation',
        diagramInfo: {
            type: 'mass_energy',
            registryKey: 'massEnergyEquivalence',
            renderOptions: {
                showEquation: true,
                showConversion: true,
                showComparison: true,
                showApplications: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_mass_energy_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Nuclear Binding Energy',
        problem: 'Helium-4 nucleus has mass 4.0015 u. Calculate mass defect and binding energy. (1 u = 931.5 MeV/c²)',
        parameters: {
            protons: 2,
            neutrons: 2,
            nuclearMass: 4.0015,
            protonMass: 1.00728,
            neutronMass: 1.00867
        },
        type: 'mass_energy_equivalence',
        subparts: [
            'Expected mass: 2(1.00728) + 2(1.00867) = 4.0319 u',
            'Actual mass: 4.0015 u',
            'Mass defect: Δm = 4.0319 - 4.0015 = 0.0304 u',
            'Binding energy: BE = Δm × c² = 0.0304 × 931.5 MeV',
            'BE = 28.3 MeV',
            'Binding energy per nucleon: 28.3/4 = 7.08 MeV/nucleon',
            'Mass defect converted to binding energy holds nucleus together'
        ],
        helper: 'BE = Δmc²; Higher BE/nucleon = more stable nucleus',
        realWorldContext: 'Nuclear stability, fusion and fission energy'
    });

    return relatedProblems;
}

generateRelatedLorentzTransformationsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Lorentz Transformation Application',
        problem: 'Two events in frame S: Event A at (x=0, t=0) and Event B at (x=300 m, t=1 μs). Frame S\' moves at 0.6c. Find coordinates in S\'.',
        parameters: {
            eventA: { x: 0, t: 0 },
            eventB: { x: 300, t: 1e-6 },
            velocity: 0.6
        },
        type: 'lorentz_transformations',
        subparts: [
            'Lorentz factor: γ = 1/√(1 - v²/c²) = 1/√(1 - 0.36) = 1.25',
            'Lorentz transformations:',
            'x\' = γ(x - vt), t\' = γ(t - vx/c²)',
            'Event A: x\'ₐ = 0, t\'ₐ = 0 (both frames agree on origin)',
            'Event B: x\'ᵦ = 1.25(300 - 0.6×3×10⁸×10⁻⁶)',
            'x\'ᵦ = 1.25(300 - 180) = 150 m',
            't\'ᵦ = 1.25(10⁻⁶ - 0.6×300/(9×10¹⁶))',
            't\'ᵦ = 1.25(10⁻⁶ - 2×10⁻⁷) = 1.0×10⁻⁶ s'
        ],
        helper: 'Lorentz: x\' = γ(x - vt), t\' = γ(t - vx/c²); Simultaneity is relative',
        realWorldContext: 'Particle physics, relativity experiments',
        diagramInfo: {
            type: 'lorentz_transformation',
            registryKey: 'lorentzTransformationDiagram',
            renderOptions: {
                velocity: 0.6,
                showBothFrames: true,
                showEvents: true,
                showTransformations: true,
                showEquations: true
            },
            canvasSize: { width: 1000, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_lorentz_transformation_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Relativistic Velocity Addition',
        problem: 'Spaceship moves at 0.8c relative to Earth. It fires missile at 0.6c relative to ship. Find missile speed relative to Earth. Draw velocity addition diagram.',
        parameters: {
            shipVelocity: 0.8,
            missileVelocity: 0.6
        },
        type: 'lorentz_transformations',
        subparts: [
            'Relativistic velocity addition: u = (v + u\')/(1 + vu\'/c²)',
            'v = 0.8c (ship), u\' = 0.6c (missile in ship frame)',
            'u = (0.8c + 0.6c)/(1 + 0.8×0.6)',
            'u = 1.4c/(1 + 0.48) = 1.4c/1.48',
            'u = 0.946c',
            'Note: u < c (never exceeds light speed)',
            'Classical: would be 0.8c + 0.6c = 1.4c (wrong!)'
        ],
        helper: 'Relativistic addition: u = (v + u\')/(1 + vu\'/c²); Result always < c',
        realWorldContext: 'Particle accelerators, cosmic ray velocities',
        diagramInfo: {
            type: 'velocity_addition',
            registryKey: 'velocityAddition',
            renderOptions: {
                v1: 0.8,
                v2: 0.6,
                showClassical: true,
                showRelativistic: true,
                showComparison: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_velocity_addition_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

// ==================== NUCLEAR PHYSICS GENERATORS WITH DIAGRAMS ====================

generateRelatedRadioactiveDecayPhysicsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Alpha Decay Process',
        problem: 'Radium-226 undergoes alpha decay. Draw the nuclear process and write the decay equation.',
        parameters: {
            decayType: 'alpha',
            parentNucleus: 'Ra-226',
            daughterNucleus: 'Rn-222'
        },
        type: 'radioactive_decay_physics',
        subparts: [
            'Alpha particle: ⁴₂He (2 protons, 2 neutrons)',
            'Radium-226: ²²⁶₈₈Ra',
            'Alpha decay: ²²⁶₈₈Ra → ²²²₈₆Rn + ⁴₂He',
            'Mass number decreases by 4',
            'Atomic number decreases by 2',
            'Produces radon-222 and helium nucleus'
        ],
        helper: 'Alpha decay: A → (A-4) + ⁴He; Z → (Z-2)',
        realWorldContext: 'Radioactive dating, nuclear decay chains',
        diagramInfo: {
            type: 'nuclear_decay_physics',
            registryKey: 'alphaDecayDiagram',
            renderOptions: {
                decayType: 'alpha',
                parentNucleus: 'Ra-226',
                daughterNucleus: 'Rn-222',
                showParent: true,
                showProducts: true,
                showEquation: true,
                showEnergy: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_alpha_decay_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Beta Decay Process',
        problem: 'Carbon-14 undergoes beta-minus decay. Draw the process and explain neutrino emission.',
        parameters: {
            decayType: 'beta',
            parentNucleus: 'C-14',
            daughterNucleus: 'N-14'
        },
        type: 'radioactive_decay_physics',
        subparts: [
            'Beta-minus decay: neutron → proton + electron + antineutrino',
            '¹⁴₆C → ¹⁴₇N + ⁰₋₁e + ν̄ₑ',
            'Mass number stays same (14)',
            'Atomic number increases by 1 (6 → 7)',
            'Antineutrino carries away energy and momentum',
            'Used in radiocarbon dating'
        ],
        helper: 'Beta-minus: n → p + e⁻ + ν̄; Z increases by 1, A unchanged',
        realWorldContext: 'Carbon dating, medical tracers',
        diagramInfo: {
            type: 'nuclear_decay_physics',
            registryKey: 'betaDecayDiagram',
            renderOptions: {
                decayType: 'beta',
                parentNucleus: 'C-14',
                daughterNucleus: 'N-14',
                showParent: true,
                showProducts: true,
                showNeutrino: true,
                showEquation: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_beta_decay_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Radioactive Half-Life',
        problem: 'Isotope has half-life of 5730 years (C-14). Starting with 100 g, draw decay curve and find amount after 11,460 years.',
        parameters: {
            isotope: 'C-14',
            halfLife: 5730,
            initialAmount: 100,
            timeElapsed: 11460
        },
        type: 'radioactive_decay_physics',
        subparts: [
            'Number of half-lives: n = t/t₁/₂ = 11,460/5,730 = 2',
            'After 1 half-life: 100/2 = 50 g',
            'After 2 half-lives: 50/2 = 25 g',
            'Formula: N(t) = N₀(½)^n = 100(½)² = 25 g',
            'Exponential decay: N(t) = N₀e^(-λt)',
            'Decay constant: λ = ln(2)/t₁/₂'
        ],
        helper: 'Half-life: N(t) = N₀(½)^(t/t₁/₂); λ = 0.693/t₁/₂',
        realWorldContext: 'Dating artifacts, medical isotopes',
        diagramInfo: {
            type: 'half_life_graph',
            registryKey: 'halfLifeGraph',
            renderOptions: {
                isotope: 'C-14',
                halfLife: 5730,
                initialAmount: 100,
                showHalfLives: true,
                showExponential: true,
                showPercentages: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_half_life_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedNuclearReactionsPhysicsDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Nuclear Structure',
        problem: 'Draw the nuclear structure of Carbon-12 showing protons and neutrons. Calculate the nuclear radius.',
        parameters: {
            protons: 6,
            neutrons: 6,
            element: 'C-12'
        },
        type: 'nuclear_reactions_physics',
        subparts: [
            'Carbon-12: 6 protons, 6 neutrons',
            'Total nucleons: A = 12',
            'Nuclear radius: r = r₀A^(1/3), where r₀ = 1.2 fm',
            'r = 1.2 × 12^(1/3) = 1.2 × 2.29 = 2.75 fm',
            'Nuclear density extremely high: ~10¹⁷ kg/m³',
            'Protons and neutrons held by strong nuclear force'
        ],
        helper: 'Nuclear radius: r = r₀A^(1/3), r₀ = 1.2 fm = 1.2×10⁻¹⁵ m',
        realWorldContext: 'Understanding atomic nuclei',
        diagramInfo: {
            type: 'nuclear_structure_physics',
            registryKey: 'nuclearStructurePhysics',
            renderOptions: {
                protons: 6,
                neutrons: 6,
                element: 'C-12',
                showProtons: true,
                showNeutrons: true,
                showLabels: true,
                showForces: false
            },
            canvasSize: { width: 700, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_nuclear_structure_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedBindingEnergyDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Nuclear Binding Energy Curve',
        problem: 'Draw the binding energy per nucleon vs mass number curve. Identify regions favorable for fission and fusion.',
        parameters: {
            showPeak: true,
            showFissionRegion: true,
            showFusionRegion: true
        },
        type: 'binding_energy',
        subparts: [
            'Binding energy per nucleon: BE/A',
            'Peak at Fe-56 (Iron): most stable nucleus',
            'BE/A ≈ 8.8 MeV for Fe-56',
            'Light nuclei (A < 56): Fusion releases energy',
            'Heavy nuclei (A > 56): Fission releases energy',
            'Stars fuse light elements up to iron'
        ],
        helper: 'BE = Δmc²; Higher BE/A = more stable',
        realWorldContext: 'Nuclear stability, stellar nucleosynthesis',
        diagramInfo: {
            type: 'binding_energy_curve',
            registryKey: 'bindingEnergyCurve',
            renderOptions: {
                showPeak: true,
                showFissionRegion: true,
                showFusionRegion: true,
                showElements: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_binding_energy_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedFissionFusionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Nuclear Fission Process',
        problem: 'U-235 absorbs a neutron and undergoes fission into Ba-141, Kr-92, and 3 neutrons. Draw the process and explain chain reaction.',
        parameters: {
            nucleus: 'U-235',
            products: ['Ba-141', 'Kr-92'],
            neutrons: 3
        },
        type: 'fission_fusion',
        subparts: [
            'Fission equation: ²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n + energy',
            'Check: 235 + 1 = 141 + 92 + 3 = 236 ✓',
            'Each fission releases ~200 MeV',
            'Produces 3 neutrons → can trigger 3 more fissions',
            'Chain reaction: self-sustaining if critical mass reached',
            'Used in nuclear reactors and weapons'
        ],
        helper: 'Fission: Heavy nucleus splits; releases neutrons and energy',
        realWorldContext: 'Nuclear power plants, atomic bombs',
        diagramInfo: {
            type: 'fission_diagram',
            registryKey: 'nuclearFissionDiagram',
            renderOptions: {
                nucleus: 'U-235',
                products: ['Ba-141', 'Kr-92'],
                neutrons: 3,
                showNeutron: true,
                showProducts: true,
                showNeutrons: true,
                showEnergy: true
            },
            canvasSize: { width: 1000, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_fission_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Nuclear Fusion Process',
        problem: 'Deuterium and tritium fuse to form helium. Draw D-T fusion reaction and calculate energy release.',
        parameters: {
            reactants: ['H-2', 'H-3'],
            product: 'He-4'
        },
        type: 'fission_fusion',
        subparts: [
            'D-T fusion: ²H + ³H → ⁴He + n + energy',
            'Mass check: 2 + 3 = 4 + 1 = 5 ✓',
            'Energy released: ~17.6 MeV per reaction',
            'Requires very high temperature (millions of degrees)',
            'Occurs in stars and fusion reactors',
            'Clean energy source (no radioactive waste like fission)'
        ],
        helper: 'Fusion: Light nuclei combine; requires high temperature and pressure',
        realWorldContext: 'Stars, fusion reactors, hydrogen bombs',
        diagramInfo: {
            type: 'fusion_diagram',
            registryKey: 'nuclearFusionDiagram',
            renderOptions: {
                reactants: ['H-2', 'H-3'],
                product: 'He-4',
                showReactants: true,
                showProduct: true,
                showNeutron: true,
                showEnergy: true
            },
            canvasSize: { width: 1000, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_fusion_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Nuclear Chain Reaction',
        problem: 'Draw a chain reaction diagram showing 3 generations with branching factor of 2. Explain criticality.',
        parameters: {
            generations: 3,
            branchingFactor: 2
        },
        type: 'fission_fusion',
        subparts: [
            'Generation 0: 1 fission event',
            'Generation 1: 2 fission events (branching factor = 2)',
            'Generation 2: 4 fission events',
            'Generation 3: 8 fission events',
            'Subcritical: k < 1 (reaction dies out)',
            'Critical: k = 1 (sustained reaction)',
            'Supercritical: k > 1 (exponential growth)'
        ],
        helper: 'Chain reaction: k = neutrons produced/neutrons absorbed',
        realWorldContext: 'Nuclear reactor control, critical mass',
        diagramInfo: {
            type: 'chain_reaction_diagram',
            registryKey: 'chainReactionDiagram',
            renderOptions: {
                generations: 3,
                branchingFactor: 2,
                showGenerations: true,
                showNeutrons: true,
                showFissions: true
            },
            canvasSize: { width: 1000, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_chain_reaction_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedRadiationDetectionDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Radiation Penetration Power',
        problem: 'Compare penetration of alpha, beta, and gamma radiation through materials. Draw penetration diagram.',
        parameters: {
            radiationTypes: ['alpha', 'beta', 'gamma']
        },
        type: 'radiation_detection',
        subparts: [
            'Alpha (α): Stopped by paper or skin',
            'Helium nuclei, +2 charge, heavy',
            'Beta (β): Stopped by aluminum foil',
            'Electrons, -1 charge, lighter than alpha',
            'Gamma (γ): Requires thick lead or concrete',
            'EM radiation, no charge, very penetrating',
            'Ionizing power: α > β > γ (inverse of penetration)'
        ],
        helper: 'Alpha: least penetrating, most ionizing; Gamma: most penetrating, least ionizing',
        realWorldContext: 'Radiation shielding, safety protocols',
        diagramInfo: {
            type: 'radiation_penetration',
            registryKey: 'radiationPenetration',
            renderOptions: {
                radiationTypes: ['alpha', 'beta', 'gamma'],
                showBarriers: true,
                showPaths: true,
                showLabels: true
            },
            canvasSize: { width: 1000, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_radiation_penetration_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}

generateRelatedGravitationDiagram(originalProblem, originalSolution, options) {
    const relatedProblems = [];

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Gravitational Force Between Masses',
        problem: 'Two spheres with masses 100 kg and 200 kg are separated by 2 m. Draw the gravitational force diagram and calculate the force between them. (G = 6.67×10⁻¹¹ N·m²/kg²)',
        parameters: {
            mass1: 100,
            mass2: 200,
            distance: 2,
            G: 6.67e-11
        },
        type: 'gravitation',
        subparts: [
            'Newton\'s law of gravitation: F = Gm₁m₂/r²',
            'G = 6.67×10⁻¹¹ N·m²/kg² (universal gravitational constant)',
            'F = (6.67×10⁻¹¹)(100)(200)/(2²)',
            'F = (6.67×10⁻¹¹)(20,000)/4',
            'F = 1.334×10⁻⁶/4 = 3.335×10⁻⁷ N',
            'Very small force (gravity is weakest fundamental force)',
            'Forces are equal and opposite (Newton\'s 3rd law)'
        ],
        helper: 'Gravitation: F = Gm₁m₂/r²; G = 6.67×10⁻¹¹ N·m²/kg²',
        realWorldContext: 'Gravitational attraction between objects',
        diagramInfo: {
            type: 'gravitational_force',
            registryKey: 'gravitationalForceDiagram',
            renderOptions: {
                mass1: 100,
                mass2: 200,
                distance: 2,
                showForceVectors: true,
                showDistanceLabel: true,
                showMasses: true,
                showEquation: true
            },
            canvasSize: { width: 900, height: 600 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_gravitational_force_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Gravitational Field and Acceleration',
        problem: 'Calculate Earth\'s gravitational field strength at its surface. Draw field lines around Earth. (M_Earth = 5.97×10²⁴ kg, R_Earth = 6.37×10⁶ m)',
        parameters: {
            mass: 5.97e24,
            radius: 6.37e6,
            G: 6.67e-11
        },
        type: 'gravitation',
        subparts: [
            'Gravitational field strength: g = GM/r²',
            'At Earth\'s surface: r = R_Earth',
            'g = (6.67×10⁻¹¹)(5.97×10²⁴)/(6.37×10⁶)²',
            'g = (3.98×10¹⁴)/(4.06×10¹³)',
            'g = 9.81 m/s² (acceleration due to gravity)',
            'This is why all objects fall at 9.8 m/s² near Earth\'s surface',
            'Field strength = acceleration of free-falling object'
        ],
        helper: 'Gravitational field: g = GM/r²; At surface: g = GM/R²',
        realWorldContext: 'Weight, free fall, projectile motion',
        diagramInfo: {
            type: 'gravitational_field',
            registryKey: 'gravitationalFieldDiagram',
            renderOptions: {
                centralMass: 'Earth',
                showFieldLines: true,
                showTestMass: true,
                showAcceleration: true,
                showEquation: true,
                numFieldLines: 16
            },
            canvasSize: { width: 800, height: 800 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_gravitational_field_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Orbital Velocity and Period',
        problem: 'Satellite orbits Earth at altitude 400 km. Draw orbit and calculate orbital velocity and period. (R_Earth = 6.37×10⁶ m)',
        parameters: {
            altitude: 400e3,
            earthRadius: 6.37e6,
            earthMass: 5.97e24,
            G: 6.67e-11
        },
        type: 'gravitation',
        subparts: [
            'Orbital radius: r = R_Earth + h = 6.37×10⁶ + 0.4×10⁶ = 6.77×10⁶ m',
            'For circular orbit: gravitational force = centripetal force',
            'GMm/r² = mv²/r → v = √(GM/r)',
            'v = √[(6.67×10⁻¹¹)(5.97×10²⁴)/(6.77×10⁶)]',
            'v = √(5.88×10⁷) = 7,670 m/s = 7.67 km/s',
            'Orbital period: T = 2πr/v = 2π(6.77×10⁶)/7,670',
            'T = 5,546 s = 92.4 minutes',
            'ISS orbits at similar altitude with ~90 min period'
        ],
        helper: 'Orbital velocity: v = √(GM/r); Period: T = 2πr/v = 2π√(r³/GM)',
        realWorldContext: 'Satellites, ISS, GPS satellites',
        diagramInfo: {
            type: 'orbital_motion',
            registryKey: 'orbitalMotionDiagram',
            renderOptions: {
                centralBody: 'Earth',
                orbitRadius: 200,
                showVelocity: true,
                showCentripetalForce: true,
                showGravitationalForce: true,
                showPeriod: true
            },
            canvasSize: { width: 900, height: 900 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_orbital_motion_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Kepler\'s Third Law',
        problem: 'Mars orbits Sun at 1.52 AU. Earth\'s orbital period is 1 year. Draw comparative orbits and calculate Mars\' orbital period using Kepler\'s third law.',
        parameters: {
            earthDistance: 1.0,
            marsDistance: 1.52,
            earthPeriod: 1.0
        },
        type: 'gravitation',
        subparts: [
            'Kepler\'s third law: T² ∝ r³ for objects orbiting same body',
            'Ratio form: (T₂/T₁)² = (r₂/r₁)³',
            '(T_Mars/T_Earth)² = (1.52/1.0)³',
            '(T_Mars/1)² = (1.52)³ = 3.51',
            'T_Mars = √3.51 = 1.87 years',
            'Mars takes 1.87 Earth years to orbit Sun',
            'Law applies to all planets orbiting Sun'
        ],
        helper: 'Kepler\'s 3rd law: T² = (4π²/GM)r³; Ratio: (T₂/T₁)² = (r₂/r₁)³',
        realWorldContext: 'Planetary orbits, exoplanet detection',
        diagramInfo: {
            type: 'kepler_orbits',
            registryKey: 'keplerThirdLawDiagram',
            renderOptions: {
                centralBody: 'Sun',
                orbits: [
                    { name: 'Earth', radius: 100, period: 1.0, color: '#3498DB' },
                    { name: 'Mars', radius: 152, period: 1.87, color: '#E74C3C' }
                ],
                showPeriods: true,
                showDistances: true,
                showEquation: true
            },
            canvasSize: { width: 1000, height: 1000 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_kepler_orbits_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Gravitational Potential Energy',
        problem: 'Calculate energy needed to lift 1000 kg satellite from Earth\'s surface to 400 km altitude. Draw energy diagram.',
        parameters: {
            mass: 1000,
            altitude: 400e3,
            earthRadius: 6.37e6,
            earthMass: 5.97e24,
            G: 6.67e-11
        },
        type: 'gravitation',
        subparts: [
            'Gravitational PE: U = -GMm/r (zero at infinity)',
            'At surface: U₁ = -(6.67×10⁻¹¹)(5.97×10²⁴)(1000)/(6.37×10⁶)',
            'U₁ = -6.25×10¹⁰ J',
            'At altitude: r₂ = 6.37×10⁶ + 0.4×10⁶ = 6.77×10⁶ m',
            'U₂ = -(6.67×10⁻¹¹)(5.97×10²⁴)(1000)/(6.77×10⁶)',
            'U₂ = -5.88×10¹⁰ J',
            'Energy needed: ΔE = U₂ - U₁ = -5.88×10¹⁰ - (-6.25×10¹⁰)',
            'ΔE = 3.7×10⁹ J = 3.7 GJ',
            'Note: Cannot use mgh for large altitude changes'
        ],
        helper: 'Gravitational PE: U = -GMm/r; Work = ΔU; Escape energy at U = 0',
        realWorldContext: 'Rocket launches, satellite deployment',
        diagramInfo: {
            type: 'gravitational_potential',
            registryKey: 'gravitationalPotentialDiagram',
            renderOptions: {
                centralBody: 'Earth',
                showPotentialCurve: true,
                showEnergyLevels: true,
                highlightPositions: [
                    { r: 6.37e6, label: 'Surface' },
                    { r: 6.77e6, label: '400 km altitude' }
                ],
                showWorkDone: true
            },
            canvasSize: { width: 900, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_gravitational_potential_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'hard',
        scenario: 'Escape Velocity',
        problem: 'Calculate escape velocity from Earth\'s surface. Draw energy diagram showing kinetic and potential energy. (M_Earth = 5.97×10²⁴ kg, R_Earth = 6.37×10⁶ m)',
        parameters: {
            earthMass: 5.97e24,
            earthRadius: 6.37e6,
            G: 6.67e-11
        },
        type: 'gravitation',
        subparts: [
            'Escape velocity: minimum speed to reach infinity',
            'At escape: total energy = 0 (KE + PE = 0)',
            '½mv² - GMm/R = 0',
            'v_escape = √(2GM/R)',
            'v_e = √[2(6.67×10⁻¹¹)(5.97×10²⁴)/(6.37×10⁶)]',
            'v_e = √(1.25×10⁸) = 11,180 m/s = 11.2 km/s',
            'Independent of mass of escaping object',
            'Rockets must exceed this speed to leave Earth'
        ],
        helper: 'Escape velocity: v_e = √(2GM/R); Independent of object mass',
        realWorldContext: 'Space missions, rocket design',
        diagramInfo: {
            type: 'escape_velocity',
            registryKey: 'escapeVelocityDiagram',
            renderOptions: {
                centralBody: 'Earth',
                showEnergyDiagram: true,
                showTrajectories: true,
                showVelocityVectors: true,
                showEscapeCondition: true,
                showEquation: true
            },
            canvasSize: { width: 1000, height: 800 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_escape_velocity_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Geostationary Orbit',
        problem: 'Calculate the altitude of a geostationary satellite that orbits Earth once per 24 hours. Draw orbit diagram showing Earth\'s rotation.',
        parameters: {
            period: 86400,
            earthMass: 5.97e24,
            earthRadius: 6.37e6,
            G: 6.67e-11
        },
        type: 'gravitation',
        subparts: [
            'Geostationary: T = 24 hours = 86,400 s',
            'Kepler\'s 3rd law: T² = (4π²/GM)r³',
            'r³ = GMT²/(4π²)',
            'r³ = (6.67×10⁻¹¹)(5.97×10²⁴)(86,400)²/(4π²)',
            'r³ = 7.54×10²² m³',
            'r = 4.22×10⁷ m = 42,200 km',
            'Altitude: h = r - R_Earth = 42,200 - 6,370 = 35,800 km',
            'All geostationary satellites at this altitude above equator'
        ],
        helper: 'Geostationary: T = 24 hrs, altitude ≈ 35,800 km above equator',
        realWorldContext: 'Communication satellites, weather satellites',
        diagramInfo: {
            type: 'geostationary_orbit',
            registryKey: 'geostationaryOrbitDiagram',
            renderOptions: {
                showEarth: true,
                showRotation: true,
                showOrbit: true,
                showSatellite: true,
                showAltitude: true,
                showEquator: true,
                show24HourPeriod: true
            },
            canvasSize: { width: 900, height: 900 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_geostationary_orbit_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    relatedProblems.push({
        difficulty: 'medium',
        scenario: 'Weightlessness in Orbit',
        problem: 'Astronaut in ISS at 400 km altitude feels weightless. Draw free body diagram and explain why. Calculate gravitational force on 70 kg astronaut at this altitude.',
        parameters: {
            mass: 70,
            altitude: 400e3,
            earthRadius: 6.37e6,
            earthMass: 5.97e24,
            G: 6.67e-11
        },
        type: 'gravitation',
        subparts: [
            'Orbital radius: r = 6.37×10⁶ + 0.4×10⁶ = 6.77×10⁶ m',
            'Gravitational force: F = GMm/r²',
            'F = (6.67×10⁻¹¹)(5.97×10²⁴)(70)/(6.77×10⁶)²',
            'F = 608 N (about 88% of surface weight)',
            'Surface weight: W = mg = 70 × 9.8 = 686 N',
            'Weightlessness: astronaut and ISS both in free fall',
            'Both accelerate toward Earth at same rate',
            'No normal force from floor → feels weightless',
            'Gravity still present but both falling together'
        ],
        helper: 'Weightlessness = free fall; Both astronaut and spacecraft fall together',
        realWorldContext: 'Space stations, astronaut experience',
        diagramInfo: {
            type: 'weightlessness',
            registryKey: 'weightlessnessOrbitDiagram',
            renderOptions: {
                showISS: true,
                showAstronaut: true,
                showGravityVector: true,
                showFreeFall: true,
                showComparison: true,
                showExplanation: true
            },
            canvasSize: { width: 1000, height: 700 }
        },
        generateDiagram: function() {
            try {
                const canvas = createCanvas(
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height
                );
                const renderer = new PhysicsDiagramRenderer(canvas);
                renderer.renderDiagram(
                    this.diagramInfo.registryKey,
                    0, 0,
                    this.diagramInfo.canvasSize.width,
                    this.diagramInfo.canvasSize.height,
                    this.diagramInfo.renderOptions
                );
                const buffer = canvas.toBuffer('image/png');
                const filename = `physics_weightlessness_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                return { success: true, filename: filename, path: `./${filename}` };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    });

    return relatedProblems;
}






// ======================================[[[[✓✓✓✓✓========

// ==================== REPRODUCTION & DEVELOPMENT GENERATORS WITH DIAGRAMS ====================

