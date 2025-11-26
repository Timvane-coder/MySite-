import { createCanvas } from '@napi-rs/canvas';
import ExcelJS from 'exceljs';
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import * as math from 'mathjs';
import GIFEncoder from 'gifencoder';
import { PassThrough } from 'stream';



// ============================================================================
// STEREOCHEMISTRY DIAGRAMS REGISTRY - Molecular Structure Configuration
// ============================================================================

class StereochemistryDiagramsRegistry {
    static diagrams = {
        // ===== SIMPLE MOLECULES =====
        'methane': {
            name: 'Methane (CH₄)',
            formula: 'CH4',
            category: 'Simple Molecules',
            description: 'Tetrahedral methane molecule with 109.5° bond angles',
            geometry: 'tetrahedral',
            bondAngles: [109.5],
            centralAtom: 'C',
            atoms: [
                { element: 'C', position: [0, 0, 0] },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 }
            ],
            defaultOptions: {
                title: 'Methane (CH₄)',
                showAngles: true,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 20,
                rotationY: 30,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'water': {
            name: 'Water (H₂O)',
            formula: 'H2O',
            category: 'Simple Molecules',
            description: 'Bent water molecule with 104.5° bond angle',
            geometry: 'bent',
            bondAngles: [104.5],
            centralAtom: 'O',
            atoms: [
                { element: 'O', position: [0, 0, 0] },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 }
            ],
            lonePairs: 2,
            defaultOptions: {
                title: 'Water (H₂O)',
                showAngles: true,
                showLabels: true,
                showLonePairs: true,
                show3D: true,
                show2D: true,
                rotationX: 15,
                rotationY: 20,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'ammonia': {
            name: 'Ammonia (NH₃)',
            formula: 'NH3',
            category: 'Simple Molecules',
            description: 'Trigonal pyramidal ammonia with 107° bond angles',
            geometry: 'trigonal_pyramidal',
            bondAngles: [107],
            centralAtom: 'N',
            atoms: [
                { element: 'N', position: [0, 0, 0] },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 }
            ],
            lonePairs: 1,
            defaultOptions: {
                title: 'Ammonia (NH₃)',
                showAngles: true,
                showLabels: true,
                showLonePairs: true,
                show3D: true,
                show2D: true,
                rotationX: 20,
                rotationY: 25,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'carbonDioxide': {
            name: 'Carbon Dioxide (CO₂)',
            formula: 'CO2',
            category: 'Simple Molecules',
            description: 'Linear carbon dioxide with 180° bond angle',
            geometry: 'linear',
            bondAngles: [180],
            centralAtom: 'C',
            atoms: [
                { element: 'O', position: [-1, 0, 0] },
                { element: 'C', position: [0, 0, 0] },
                { element: 'O', position: [1, 0, 0] }
            ],
            bondTypes: ['double', 'double'],
            defaultOptions: {
                title: 'Carbon Dioxide (CO₂)',
                showAngles: true,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 0,
                rotationY: 20,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== ORGANIC MOLECULES =====
        'ethane': {
            name: 'Ethane (C₂H₆)',
            formula: 'C2H6',
            category: 'Organic Molecules',
            description: 'Ethane molecule with C-C single bond',
            geometry: 'tetrahedral',
            bondAngles: [109.5],
            atoms: [
                { element: 'C', position: [-0.5, 0, 0] },
                { element: 'C', position: [0.5, 0, 0] },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 1 },
                { element: 'H', bondedTo: 1 },
                { element: 'H', bondedTo: 1 }
            ],
            defaultOptions: {
                title: 'Ethane (C₂H₆)',
                showAngles: true,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 20,
                rotationY: 30,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'ethene': {
            name: 'Ethene (C₂H₄)',
            formula: 'C2H4',
            category: 'Organic Molecules',
            description: 'Ethene with C=C double bond, planar geometry',
            geometry: 'trigonal_planar',
            bondAngles: [120],
            atoms: [
                { element: 'C', position: [-0.5, 0, 0] },
                { element: 'C', position: [0.5, 0, 0] },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 1 },
                { element: 'H', bondedTo: 1 }
            ],
            bondTypes: ['double'],
            defaultOptions: {
                title: 'Ethene (C₂H₄)',
                showAngles: true,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 10,
                rotationY: 20,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'glucose': {
            name: 'Glucose (C₆H₁₂O₆)',
            formula: 'C6H12O6',
            category: 'Carbohydrates',
            description: 'α-D-Glucose in chair conformation',
            geometry: 'chair',
            bondAngles: [109.5],
            isRing: true,
            atoms: [
                { element: 'C', position: [0, 0, 0], label: 'C1' },
                { element: 'C', position: [1, 0.5, 0], label: 'C2' },
                { element: 'C', position: [2, 0, 0], label: 'C3' },
                { element: 'C', position: [2.5, -1, 0], label: 'C4' },
                { element: 'C', position: [1.5, -1.5, 0], label: 'C5' },
                { element: 'O', position: [0.5, -1, 0], label: 'O' }
            ],
            defaultOptions: {
                title: 'α-D-Glucose (C₆H₁₂O₆)',
                showAngles: false,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 30,
                rotationY: 45,
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== INORGANIC MOLECULES =====
        'sulfurHexafluoride': {
            name: 'Sulfur Hexafluoride (SF₆)',
            formula: 'SF6',
            category: 'Inorganic Molecules',
            description: 'Octahedral sulfur hexafluoride with 90° bond angles',
            geometry: 'octahedral',
            bondAngles: [90, 180],
            centralAtom: 'S',
            atoms: [
                { element: 'S', position: [0, 0, 0] },
                { element: 'F', bondedTo: 0 },
                { element: 'F', bondedTo: 0 },
                { element: 'F', bondedTo: 0 },
                { element: 'F', bondedTo: 0 },
                { element: 'F', bondedTo: 0 },
                { element: 'F', bondedTo: 0 }
            ],
            defaultOptions: {
                title: 'Sulfur Hexafluoride (SF₆)',
                showAngles: true,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 30,
                rotationY: 45,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        }
    };

    static getDiagram(key) {
        return this.diagrams[key];
    }

    static getAllDiagrams() {
        return Object.keys(this.diagrams);
    }

    static getDiagramsByCategory(category) {
        return Object.entries(this.diagrams)
            .filter(([_, diagram]) => diagram.category === category)
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getAllCategories() {
        return [...new Set(Object.values(this.diagrams).map(d => d.category))];
    }

    static searchDiagrams(query) {
        const lowerQuery = query.toLowerCase();
        return Object.entries(this.diagrams)
            .filter(([key, diagram]) =>
                diagram.name.toLowerCase().includes(lowerQuery) ||
                diagram.formula.toLowerCase().includes(lowerQuery) ||
                diagram.description.toLowerCase().includes(lowerQuery) ||
                key.toLowerCase().includes(lowerQuery)
            )
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static findByFormula(formula) {
        const normalizedFormula = formula.replace(/\s/g, '').toLowerCase();
        return Object.entries(this.diagrams)
            .filter(([_, diagram]) => 
                diagram.formula.toLowerCase() === normalizedFormula
            )
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getDiagramStats() {
        const stats = {};
        this.getAllCategories().forEach(category => {
            const diagrams = this.getDiagramsByCategory(category);
            stats[category] = {
                count: Object.keys(diagrams).length,
                diagrams: Object.keys(diagrams)
            };
        });
        return stats;
    }
}

// ============================================================================
// ATOM PROPERTIES - Colors, sizes, and characteristics
// ============================================================================

class AtomProperties {
    static elements = {
        'H': { 
            name: 'Hydrogen', 
            color: '#FFFFFF', 
            radius: 25, 
            bonds: 1,
            electronegativity: 2.20
        },
        'C': { 
            name: 'Carbon', 
            color: '#909090', 
            radius: 40, 
            bonds: 4,
            electronegativity: 2.55
        },
        'N': { 
            name: 'Nitrogen', 
            color: '#3050F8', 
            radius: 38, 
            bonds: 3,
            electronegativity: 3.04
        },
        'O': { 
            name: 'Oxygen', 
            color: '#FF0D0D', 
            radius: 37, 
            bonds: 2,
            electronegativity: 3.44
        },
        'F': { 
            name: 'Fluorine', 
            color: '#90E050', 
            radius: 35, 
            bonds: 1,
            electronegativity: 3.98
        },
        'S': { 
            name: 'Sulfur', 
            color: '#FFFF30', 
            radius: 42, 
            bonds: 2,
            electronegativity: 2.58
        },
        'P': { 
            name: 'Phosphorus', 
            color: '#FF8000', 
            radius: 42, 
            bonds: 3,
            electronegativity: 2.19
        },
        'Cl': { 
            name: 'Chlorine', 
            color: '#1FF01F', 
            radius: 38, 
            bonds: 1,
            electronegativity: 3.16
        },
        'Br': { 
            name: 'Bromine', 
            color: '#A62929', 
            radius: 40, 
            bonds: 1,
            electronegativity: 2.96
        }
    };

    static getElement(symbol) {
        return this.elements[symbol] || { 
            name: symbol, 
            color: '#FF00FF', 
            radius: 35, 
            bonds: 1,
            electronegativity: 2.0
        };
    }

    static getBondLength(element1, element2) {
        const e1 = this.getElement(element1);
        const e2 = this.getElement(element2);
        return (e1.radius + e2.radius) * 1.2;
    }
}

// ============================================================================
// MOLECULAR GEOMETRY CALCULATOR
// ============================================================================

class MolecularGeometry {
    static calculateTetrahedralPositions(bondLength = 100) {
        const angle = 109.5 * Math.PI / 180;
        return [
            [0, -bondLength, 0],
            [bondLength * Math.sin(angle), bondLength * Math.cos(angle) * 0.33, bondLength * 0.94],
            [bondLength * Math.sin(angle) * Math.cos(2*Math.PI/3), bondLength * Math.cos(angle) * 0.33, bondLength * 0.94 * Math.sin(2*Math.PI/3)],
            [bondLength * Math.sin(angle) * Math.cos(4*Math.PI/3), bondLength * Math.cos(angle) * 0.33, bondLength * 0.94 * Math.sin(4*Math.PI/3)]
        ];
    }

    static calculateTrigonalPlanarPositions(bondLength = 100) {
        const angle = 120 * Math.PI / 180;
        return [
            [0, -bondLength, 0],
            [bondLength * Math.sin(angle), bondLength * Math.cos(angle), 0],
            [bondLength * Math.sin(angle) * Math.cos(2*Math.PI/3), bondLength * Math.cos(angle), 0]
        ];
    }

    static calculateLinearPositions(bondLength = 100) {
        return [
            [-bondLength, 0, 0],
            [bondLength, 0, 0]
        ];
    }

    static calculateBentPositions(bondLength = 100, angle = 104.5) {
        const angleRad = angle * Math.PI / 180;
        const halfAngle = angleRad / 2;
        return [
            [-bondLength * Math.sin(halfAngle), -bondLength * Math.cos(halfAngle), 0],
            [bondLength * Math.sin(halfAngle), -bondLength * Math.cos(halfAngle), 0]
        ];
    }

    static calculateTrigonalPyramidalPositions(bondLength = 100) {
        const angle = 107 * Math.PI / 180;
        return [
            [0, -bondLength, 0],
            [bondLength * Math.sin(angle), bondLength * Math.cos(angle) * 0.4, bondLength * 0.8],
            [bondLength * Math.sin(angle) * Math.cos(2*Math.PI/3), bondLength * Math.cos(angle) * 0.4, bondLength * 0.8 * Math.sin(2*Math.PI/3)],
            [bondLength * Math.sin(angle) * Math.cos(4*Math.PI/3), bondLength * Math.cos(angle) * 0.4, bondLength * 0.8 * Math.sin(4*Math.PI/3)]
        ];
    }

    static calculateOctahedralPositions(bondLength = 100) {
        return [
            [0, bondLength, 0],
            [0, -bondLength, 0],
            [bondLength, 0, 0],
            [-bondLength, 0, 0],
            [0, 0, bondLength],
            [0, 0, -bondLength]
        ];
    }

    static rotatePoint3D(point, rotX, rotY, rotZ) {
        let [x, y, z] = point;

        // Rotate around X axis
        if (rotX) {
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);
            const newY = y * cosX - z * sinX;
            const newZ = y * sinX + z * cosX;
            y = newY;
            z = newZ;
        }

        // Rotate around Y axis
        if (rotY) {
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const newX = x * cosY + z * sinY;
            const newZ = -x * sinY + z * cosY;
            x = newX;
            z = newZ;
        }

        // Rotate around Z axis
        if (rotZ) {
            const cosZ = Math.cos(rotZ);
            const sinZ = Math.sin(rotZ);
            const newX = x * cosZ - y * sinZ;
            const newY = x * sinZ + y * cosZ;
            x = newX;
            y = newY;
        }

        return [x, y, z];
    }

    static projectTo2D(point3D, scale = 1, perspective = 500) {
        const [x, y, z] = point3D;
        const factor = perspective / (perspective + z);
        return [
            x * factor * scale,
            y * factor * scale,
            z
        ];
    }
}

// ============================================================================
// STEREOCHEMISTRY DIAGRAM RENDERER
// ============================================================================

class StereochemistryDiagramRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas ? canvas.getContext('2d') : null;
    }

    renderDiagram(diagramKey, x, y, width, height, options = {}) {
        const diagram = StereochemistryDiagramsRegistry.getDiagram(diagramKey);
        if (!diagram) {
            throw new Error(`Stereochemistry diagram '${diagramKey}' not found`);
        }

        const mergedOptions = { ...diagram.defaultOptions, ...options };
        
        this.ctx.save();
        this.ctx.translate(x, y);

        // Clear background
        this.ctx.fillStyle = mergedOptions.backgroundColor;
        this.ctx.fillRect(0, 0, width, height);

        // Title
        this.drawTitle(mergedOptions.title, width / 2, 20);

        // Draw both 2D and 3D if requested
        if (mergedOptions.show2D && mergedOptions.show3D) {
            // Split view
            this.draw2DMolecule(diagram, width * 0.25, height * 0.5, width * 0.4, mergedOptions);
            this.draw3DMolecule(diagram, width * 0.75, height * 0.5, width * 0.4, mergedOptions);
            
            // Labels
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillStyle = '#2C3E50';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('2D Structure', width * 0.25, 60);
            this.ctx.fillText('3D Model', width * 0.75, 60);
        } else if (mergedOptions.show2D) {
            this.draw2DMolecule(diagram, width / 2, height / 2, width * 0.8, mergedOptions);
        } else if (mergedOptions.show3D) {
            this.draw3DMolecule(diagram, width / 2, height / 2, width * 0.8, mergedOptions);
        }

        // Molecular info
        this.drawMolecularInfo(diagram, 20, height - 100, mergedOptions);

        this.ctx.restore();
    }

    draw2DMolecule(diagram, centerX, centerY, size, options) {
        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        const bondLength = size * 0.15;
        const positions = this.calculate2DPositions(diagram, bondLength);

        // Draw bonds first
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;

        diagram.atoms.forEach((atom, index) => {
            if (atom.bondedTo !== undefined && positions[index] && positions[atom.bondedTo]) {
                const bondType = diagram.bondTypes ? diagram.bondTypes[index - 1] : 'single';
                this.draw2DBond(
                    positions[atom.bondedTo],
                    positions[index],
                    bondType
                );
            }
        });

        // Draw atoms
        diagram.atoms.forEach((atom, index) => {
            if (positions[index]) {
                this.drawAtom2D(
                    atom.element,
                    positions[index][0],
                    positions[index][1],
                    options.showLabels
                );
            }
        });

        // Draw bond angles if requested
        if (options.showAngles && diagram.bondAngles) {
            this.drawBondAngles2D(positions, diagram, bondLength);
        }

        // Draw lone pairs if present
        if (options.showLonePairs && diagram.lonePairs) {
            this.drawLonePairs2D(positions[0], diagram.lonePairs);
        }

        this.ctx.restore();
    }

    draw3DMolecule(diagram, centerX, centerY, size, options) {
        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        const bondLength = size * 0.12;
        const rotX = (options.rotationX || 0) * Math.PI / 180;
        const rotY = (options.rotationY || 0) * Math.PI / 180;
        
        const positions = this.calculate3DPositions(diagram, bondLength, rotX, rotY);

        // Sort by Z-depth for proper rendering
        const renderOrder = positions
            .map((pos, idx) => ({ pos, idx, z: pos ? pos[2] : -Infinity }))
            .sort((a, b) => a.z - b.z);

        // Draw bonds first (back to front)
        renderOrder.forEach(({ idx }) => {
            const atom = diagram.atoms[idx];
            if (atom.bondedTo !== undefined && positions[idx] && positions[atom.bondedTo]) {
                const bondType = diagram.bondTypes ? diagram.bondTypes[idx - 1] : 'single';
                this.draw3DBond(
                    positions[atom.bondedTo],
                    positions[idx],
                    bondType,
                    diagram.atoms[atom.bondedTo].element,
                    atom.element
                );
            }
        });

        // Draw atoms (back to front)
        renderOrder.forEach(({ idx }) => {
            if (positions[idx]) {
                const atom = diagram.atoms[idx];
                this.drawAtom3D(
                    atom.element,
                    positions[idx][0],
                    positions[idx][1],
                    positions[idx][2],
                    options.showLabels
                );
            }
        });

        // Draw bond angles if requested
        if (options.showAngles && diagram.bondAngles) {
            this.drawBondAngles3D(positions, diagram);
        }

        this.ctx.restore();
    }

    calculate2DPositions(diagram, bondLength) {
        const positions = [];
        
        switch (diagram.geometry) {
            case 'tetrahedral':
                positions[0] = [0, 0];
                const tetPos = [
                    [0, -bondLength],
                    [bondLength * 0.866, bondLength * 0.5],
                    [-bondLength * 0.866, bondLength * 0.5],
                    [0, bondLength * 0.3]
                ];
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = tetPos.shift();
                    }
                });
                break;

            case 'bent':
                positions[0] = [0, 0];
                const angle = (diagram.bondAngles[0] || 104.5) * Math.PI / 180;
                const halfAngle = angle / 2;
                positions[1] = [-bondLength * Math.sin(halfAngle), -bondLength * Math.cos(halfAngle)];
                positions[2] = [bondLength * Math.sin(halfAngle), -bondLength * Math.cos(halfAngle)];
                break;

            case 'trigonal_pyramidal':
                positions[0] = [0, 0];
                const trigPos = [
                    [0, -bondLength],
                    [bondLength * 0.866, bondLength * 0.3],
                    [-bondLength * 0.866, bondLength * 0.3]
                ];
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = trigPos.shift();
                    }
                });
                break;

            case 'linear':
                diagram.atoms.forEach((atom, idx) => {
                    positions[idx] = atom.position ? 
                        [atom.position[0] * bondLength, atom.position[1] * bondLength] :
                        [0, 0];
                });
                break;

            case 'trigonal_planar':
                positions[0] = [0, 0];
                const planarPos = MolecularGeometry.calculateTrigonalPlanarPositions(bondLength);
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        const pos = planarPos.shift();
                        positions[idx] = [pos[0], pos[1]];
                    }
                });
                break;

            case 'octahedral':
                positions[0] = [0, 0];
                const octPos = [
                    [0, -bondLength],
                    [bondLength, 0],
                    [0, bondLength],
                    [-bondLength, 0],
                    [bondLength * 0.5, -bondLength * 0.3],
                    [-bondLength * 0.5, -bondLength * 0.3]
                ];
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = octPos.shift();
                    }
                });
                break;

            default:
                diagram.atoms.forEach((atom, idx) => {
                    positions[idx] = atom.position ? 
                        [atom.position[0] * bondLength, atom.position[1] * bondLength] :
                        [0, 0];
                });
        }

        return positions;
    }

    calculate3DPositions(diagram, bondLength, rotX, rotY) {
        const positions = [];
        let pos3D;

        switch (diagram.geometry) {
            case 'tetrahedral':
                pos3D = MolecularGeometry.calculateTetrahedralPositions(bondLength);
                positions[0] = [0, 0, 0];
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx] && pos3D.length > 0) {
                        positions[idx] = pos3D.shift();
                    }
                });
                break;

            case 'bent':
                pos3D = MolecularGeometry.calculateBentPositions(bondLength, diagram.bondAngles[0]);
                positions[0] = [0, 0, 0];
                positions[1] = pos3D[0];
                positions[2] = pos3D[1];
                break;

            case 'trigonal_pyramidal':
                pos3D = MolecularGeometry.calculateTrigonalPyramidalPositions(bondLength);
                positions[0] = [0, 0, 0];
                let pIndex = 0;
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = pos3D[pIndex++];
                    }
                });
                break;

            case 'linear':
                pos3D = MolecularGeometry.calculateLinearPositions(bondLength);
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.position) {
                        positions[idx] = [
                            atom.position[0] * bondLength,
                            atom.position[1] * bondLength,
                            atom.position[2] * bondLength
                        ];
                    }
                });
                break;

            case 'trigonal_planar':
                pos3D = MolecularGeometry.calculateTrigonalPlanarPositions(bondLength);
                positions[0] = [0, 0, 0];
                let tpIndex = 0;
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = pos3D[tpIndex++];
                    }
                });
                break;

            case 'octahedral':
                pos3D = MolecularGeometry.calculateOctahedralPositions(bondLength);
                positions[0] = [0, 0, 0];
                let octIndex = 0;
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = pos3D[octIndex++];
                    }
                });
                break;

            default:
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.position) {
                        positions[idx] = [
                            atom.position[0] * bondLength,
                            atom.position[1] * bondLength,
                            atom.position[2] * bondLength || 0
                        ];
                    }
                });
        }

        // Apply rotations and project to 2D
        return positions.map(pos => {
            if (!pos) return null;
            const rotated = MolecularGeometry.rotatePoint3D(pos, rotX, rotY, 0);
            return MolecularGeometry.projectTo2D(rotated, 1, 500);
        });
    }

    drawAtom2D(element, x, y, showLabel) {
        const props = AtomProperties.getElement(element);
        
        // Draw sphere with gradient
        const gradient = this.ctx.createRadialGradient(
            x - props.radius * 0.3, 
            y - props.radius * 0.3, 
            0,
            x, 
            y, 
            props.radius
        );
        gradient.addColorStop(0, this.lightenColor(props.color, 40));
        gradient.addColorStop(1, props.color);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, props.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Outline
        this.ctx.strokeStyle = this.darkenColor(props.color, 30);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Label
        if (showLabel) {
            this.ctx.fillStyle = element === 'H' ? '#000000' : '#FFFFFF';
            this.ctx.font = 'bold 18px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(element, x, y);
        }
    }

    drawAtom3D(element, x, y, z, showLabel) {
        const props = AtomProperties.getElement(element);
        
        // Depth-based size adjustment
        const depthFactor = (z + 500) / 500;
        const radius = props.radius * Math.max(0.5, Math.min(1.2, depthFactor));

        // Draw sphere with gradient and depth shading
        const brightness = Math.max(0.6, Math.min(1, depthFactor));
        const gradient = this.ctx.createRadialGradient(
            x - radius * 0.3, 
            y - radius * 0.3, 
            0,
            x, 
            y, 
            radius
        );
        
        const lightColor = this.lightenColor(props.color, 40 * brightness);
        const baseColor = this.adjustBrightness(props.color, brightness);
        
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(0.7, baseColor);
        gradient.addColorStop(1, this.darkenColor(baseColor, 20));

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Specular highlight
        this.ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * brightness})`;
        this.ctx.beginPath();
        this.ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        // Outline
        this.ctx.strokeStyle = this.darkenColor(props.color, 30);
        this.ctx.lineWidth = 2 * (z > 0 ? 1 : 0.7);
        this.ctx.stroke();

        // Label
        if (showLabel) {
            this.ctx.fillStyle = element === 'H' ? '#000000' : '#FFFFFF';
            this.ctx.font = `bold ${Math.floor(16 * depthFactor)}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(element, x, y);
        }
    }

    draw2DBond(pos1, pos2, bondType = 'single') {
        const [x1, y1] = pos1;
        const [x2, y2] = pos2;

        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;

        if (bondType === 'single') {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        } else if (bondType === 'double') {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const offsetX = -dy / len * 4;
            const offsetY = dx / len * 4;

            this.ctx.beginPath();
            this.ctx.moveTo(x1 + offsetX, y1 + offsetY);
            this.ctx.lineTo(x2 + offsetX, y2 + offsetY);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x1 - offsetX, y1 - offsetY);
            this.ctx.lineTo(x2 - offsetX, y2 - offsetY);
            this.ctx.stroke();
        } else if (bondType === 'triple') {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const offsetX = -dy / len * 5;
            const offsetY = dx / len * 5;

            this.ctx.beginPath();
            this.ctx.moveTo(x1 + offsetX, y1 + offsetY);
            this.ctx.lineTo(x2 + offsetX, y2 + offsetY);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x1 - offsetX, y1 - offsetY);
            this.ctx.lineTo(x2 - offsetX, y2 - offsetY);
            this.ctx.stroke();
        }
    }

    draw3DBond(pos1, pos2, bondType, element1, element2) {
        const [x1, y1, z1] = pos1;
        const [x2, y2, z2] = pos2;

        // Depth-based width
        const avgZ = (z1 + z2) / 2;
        const depthFactor = (avgZ + 500) / 500;
        const lineWidth = 3 * Math.max(0.7, Math.min(1.2, depthFactor));

        // Gradient for depth
        const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
        const brightness1 = Math.max(0.6, (z1 + 500) / 500);
        const brightness2 = Math.max(0.6, (z2 + 500) / 500);
        
        gradient.addColorStop(0, `rgba(44, 62, 80, ${brightness1})`);
        gradient.addColorStop(1, `rgba(44, 62, 80, ${brightness2})`);

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';

        if (bondType === 'single') {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        } else if (bondType === 'double') {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const offsetX = -dy / len * 4;
            const offsetY = dx / len * 4;

            this.ctx.beginPath();
            this.ctx.moveTo(x1 + offsetX, y1 + offsetY);
            this.ctx.lineTo(x2 + offsetX, y2 + offsetY);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x1 - offsetX, y1 - offsetY);
            this.ctx.lineTo(x2 - offsetX, y2 - offsetY);
            this.ctx.stroke();
        } else if (bondType === 'triple') {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const offsetX = -dy / len * 5;
            const offsetY = dx / len * 5;

            this.ctx.beginPath();
            this.ctx.moveTo(x1 + offsetX, y1 + offsetY);
            this.ctx.lineTo(x2 + offsetX, y2 + offsetY);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x1 - offsetX, y1 - offsetY);
            this.ctx.lineTo(x2 - offsetX, y2 - offsetY);
            this.ctx.stroke();
        }
    }

    drawBondAngles2D(positions, diagram, bondLength) {
        if (positions.length < 3) return;

        this.ctx.save();
        
        const centralPos = positions[0];
        const bondedPositions = positions.slice(1, 3);

        if (centralPos && bondedPositions[0] && bondedPositions[1]) {
            const angle1 = Math.atan2(
                bondedPositions[0][1] - centralPos[1],
                bondedPositions[0][0] - centralPos[0]
            );
            const angle2 = Math.atan2(
                bondedPositions[1][1] - centralPos[1],
                bondedPositions[1][0] - centralPos[0]
            );

            // Draw arc
            this.ctx.strokeStyle = '#E74C3C';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 3]);
            this.ctx.beginPath();
            this.ctx.arc(centralPos[0], centralPos[1], bondLength * 0.4, angle1, angle2, false);
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            // Draw angle label
            const midAngle = (angle1 + angle2) / 2;
            const labelX = centralPos[0] + Math.cos(midAngle) * bondLength * 0.6;
            const labelY = centralPos[1] + Math.sin(midAngle) * bondLength * 0.6;

            this.ctx.fillStyle = '#E74C3C';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`${diagram.bondAngles[0]}°`, labelX, labelY);
        }

        this.ctx.restore();
    }

    drawBondAngles3D(positions, diagram) {
        if (positions.length < 3) return;

        this.ctx.save();
        
        const centralPos = positions[0];
        const bondedPositions = positions.slice(1, 3).filter(p => p);

        if (centralPos && bondedPositions.length >= 2) {
            const angle1 = Math.atan2(
                bondedPositions[0][1] - centralPos[1],
                bondedPositions[0][0] - centralPos[0]
            );
            const angle2 = Math.atan2(
                bondedPositions[1][1] - centralPos[1],
                bondedPositions[1][0] - centralPos[0]
            );

            const radius = 50;

            // Draw arc
            this.ctx.strokeStyle = '#E74C3C';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 3]);
            this.ctx.beginPath();
            this.ctx.arc(centralPos[0], centralPos[1], radius, angle1, angle2, false);
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            // Draw angle label
            const midAngle = (angle1 + angle2) / 2;
            const labelX = centralPos[0] + Math.cos(midAngle) * (radius + 20);
            const labelY = centralPos[1] + Math.sin(midAngle) * (radius + 20);

            this.ctx.fillStyle = '#E74C3C';
            this.ctx.font = 'bold 13px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`${diagram.bondAngles[0]}°`, labelX, labelY);
        }

        this.ctx.restore();
    }

    drawLonePairs2D(centralPos, count) {
        if (!centralPos) return;

        const [x, y] = centralPos;
        const radius = 50;
        const angleStart = Math.PI * 0.6;
        const angleSpacing = Math.PI * 0.3;

        this.ctx.fillStyle = '#95A5A6';
        
        for (let i = 0; i < count; i++) {
            const angle = angleStart + i * angleSpacing;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;

            // Draw two dots for each lone pair
            this.ctx.beginPath();
            this.ctx.arc(px - 4, py, 3, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(px + 4, py, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawTitle(title, x, y) {
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, x, y);
    }

    drawMolecularInfo(diagram, x, y, options) {
        this.ctx.save();
        this.ctx.translate(x, y);

        // Info box background
        this.ctx.fillStyle = 'rgba(236, 240, 241, 0.9)';
        this.ctx.strokeStyle = '#BDC3C7';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(0, 0, 300, 80, 8);
        this.ctx.fill();
        this.ctx.stroke();

        // Info text
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = '13px Arial';
        this.ctx.textAlign = 'left';

        this.ctx.fillText(`Formula: ${diagram.formula}`, 15, 25);
        this.ctx.fillText(`Geometry: ${diagram.geometry.replace(/_/g, ' ')}`, 15, 45);
        
        if (diagram.bondAngles && diagram.bondAngles.length > 0) {
            const angleText = diagram.bondAngles.length > 1 
                ? `${diagram.bondAngles.join('°, ')}°`
                : `${diagram.bondAngles[0]}°`;
            this.ctx.fillText(`Bond Angles: ${angleText}`, 15, 65);
        }

        this.ctx.restore();
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
    }

    adjustBrightness(color, factor) {
        const num = parseInt(color.replace('#', ''), 16);
        const R = Math.min(255, Math.max(0, Math.round((num >> 16) * factor)));
        const G = Math.min(255, Math.max(0, Math.round(((num >> 8) & 0x00FF) * factor)));
        const B = Math.min(255, Math.max(0, Math.round((num & 0x0000FF) * factor)));
        return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
    }
}



export {StereochemistryDiagramsRegistry,StereochemistryDiagramRenderer,AtomProperties,MolecularGeometry};








// ============================================================================
// ADD THIS TO EnhancedSpreadsheetWorkbook CLASS
/**
export class EnhancedSpreadsheetWorkbook {
    constructor(options = {}) {
        this.width = options.width || 1600;
        this.height = options.height || 2000;
        this.theme = options.theme || 'professional';

        // Spreadsheet data
        this.data = [];
        this.headers = [];
        this.formulas = {};
        this.calculations = {};
        this.history = [];

        // Chart management
        this.charts = [];
        this.chartRenderer = new ChartCanvasRenderer();

        // Anatomical diagram management
        this.anatomicalDiagrams = [];
        this.diagramRenderer = new AnatomicalDiagramRenderer(null);

        // Cross-section diagram management
        this.crossSectionDiagrams = [];
        this.crossSectionRenderer = new CrossSectionDiagramRenderer(null);

        // Stereochemistry diagram management
        this.stereochemistryDiagrams = [];
        this.stereochemistryRenderer = new StereochemistryDiagramRenderer(null);

        // Graphing Calculator management
        this.graphingCalculator = null;

        // Statistical Workbook management
        this.statisticalWorkbook = null;
        this.statisticalAnalyses = [];

        // Unified diagram tracking (for convenience)
        this.allDiagrams = {
            anatomical: this.anatomicalDiagrams,
            crossSection: this.crossSectionDiagrams,
            stereochemistry: this.stereochemistryDiagrams
        };

        // Visual settings
        this.cellWidth = 150;
        this.cellHeight = 30;
        this.headerHeight = 35;
        this.fontSize = 11;
        this.headerFontSize = 12;

        // Metadata
        this.sheetName = options.sheetName || 'Sheet1';
        this.createdDate = new Date();
        this.lastModified = new Date();
        this.author = options.author || 'User';

        this.setThemeColors();
    }

    // ==================== THEME COLORS ====================
    setThemeColors() {
        const themes = {
            professional: {
                background: '#ffffff',
                gridColor: '#e0e0e0',
                headerBg: '#2c3e50',
                headerText: '#ffffff',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#c0c0c0'
            },
            dark: {
                background: '#1e1e1e',
                gridColor: '#404040',
                headerBg: '#0d47a1',
                headerText: '#ffffff',
                cellBg: '#2d2d2d',
                cellText: '#ffffff',
                borderColor: '#505050'
            },
            light: {
                background: '#f5f5f5',
                gridColor: '#d0d0d0',
                headerBg: '#4caf50',
                headerText: '#ffffff',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#bdbdbd'
            }
        };
        this.colors = themes[this.theme] || themes.professional;
    }

   
    // ========================================================================
    // STEREOCHEMISTRY DIAGRAM MANAGEMENT METHODS
    // ========================================================================

    // Get available stereochemistry diagrams
    getAvailableStereochemistryDiagrams() {
        const diagrams = {};
        const categories = StereochemistryDiagramsRegistry.getAllCategories();

        categories.forEach(category => {
            diagrams[category] = StereochemistryDiagramsRegistry.getDiagramsByCategory(category);
        });

        return diagrams;
    }

    // Get stereochemistry diagram suggestions based on context
    suggestStereochemistryDiagrams(context = null) {
        const suggestions = [];

        // Check headers for chemistry keywords
        const hasChemistry = this.headers.some(h => 
            /molecule|compound|chemical|bond|atom|formula|reaction|chemistry/i.test(h)
        );
        
        const hasOrganic = this.headers.some(h => 
            /carbon|hydrocarbon|alkane|alkene|alkyne|organic|methane|ethane|benzene/i.test(h)
        );
        
        const hasInorganic = this.headers.some(h => 
            /sulfur|fluoride|oxide|chloride|inorganic|metal|ion/i.test(h)
        );

        const hasBiochemistry = this.headers.some(h => 
            /glucose|amino|protein|carbohydrate|lipid|biochem/i.test(h)
        );

        // Check data for chemical formulas
        const detectedFormulas = new Set();
        this.data.forEach(row => {
            Object.values(row).forEach(value => {
                if (typeof value === 'string') {
                    // Common chemical formula patterns
                    const formulaPatterns = [
                        /\bCH4\b/i, /\bC2H6\b/i, /\bC2H4\b/i, /\bH2O\b/i, 
                        /\bNH3\b/i, /\bCO2\b/i, /\bSF6\b/i, /\bC6H12O6\b/i
                    ];
                    
                    formulaPatterns.forEach(pattern => {
                        if (pattern.test(value)) {
                            const match = value.match(pattern)[0].toUpperCase().replace(/\s/g, '');
                            detectedFormulas.add(match);
                        }
                    });
                }
            });
        });

        // Add suggestions based on detected formulas
        detectedFormulas.forEach(formula => {
            const found = StereochemistryDiagramsRegistry.findByFormula(formula);
            Object.keys(found).forEach(key => {
                if (!suggestions.find(s => s.key === key)) {
                    suggestions.push({
                        key,
                        priority: 10,
                        reason: `Chemical formula ${formula} detected in data`
                    });
                }
            });
        });

        // Add context-based suggestions
        if (hasOrganic || hasChemistry) {
            if (!suggestions.find(s => s.key === 'methane')) {
                suggestions.push({ key: 'methane', priority: 9, reason: 'Organic chemistry context detected' });
            }
            if (!suggestions.find(s => s.key === 'ethane')) {
                suggestions.push({ key: 'ethane', priority: 8, reason: 'Hydrocarbon molecules' });
            }
            if (!suggestions.find(s => s.key === 'ethene')) {
                suggestions.push({ key: 'ethene', priority: 7, reason: 'Alkene structures' });
            }
        }

        if (hasInorganic) {
            if (!suggestions.find(s => s.key === 'water')) {
                suggestions.push({ key: 'water', priority: 9, reason: 'Inorganic chemistry context' });
            }
            if (!suggestions.find(s => s.key === 'ammonia')) {
                suggestions.push({ key: 'ammonia', priority: 8, reason: 'Simple inorganic molecules' });
            }
            if (!suggestions.find(s => s.key === 'sulfurHexafluoride')) {
                suggestions.push({ key: 'sulfurHexafluoride', priority: 7, reason: 'Complex inorganic structures' });
            }
        }

        if (hasBiochemistry) {
            if (!suggestions.find(s => s.key === 'glucose')) {
                suggestions.push({ key: 'glucose', priority: 9, reason: 'Biochemistry/carbohydrate data detected' });
            }
        }

        // General suggestions if no specific context
        if (suggestions.length === 0) {
            suggestions.push(
                { key: 'methane', priority: 7, reason: 'Common chemistry molecule' },
                { key: 'water', priority: 6, reason: 'Universal molecule' },
                { key: 'carbonDioxide', priority: 5, reason: 'Environmental chemistry' }
            );
        }

        return suggestions.sort((a, b) => b.priority - a.priority);
    }

    // Get stereochemistry diagram help
    getStereochemistryDiagramHelp(diagramKey) {
        const diagram = StereochemistryDiagramsRegistry.getDiagram(diagramKey);
        if (!diagram) {
            return { error: 'Stereochemistry diagram not found' };
        }

        return {
            name: diagram.name,
            formula: diagram.formula,
            category: diagram.category,
            description: diagram.description,
            geometry: diagram.geometry,
            bondAngles: diagram.bondAngles,
            centralAtom: diagram.centralAtom,
            atoms: diagram.atoms.length,
            defaultOptions: diagram.defaultOptions
        };
    }

    // Find stereochemistry diagram by formula
    findStereochemistryDiagramByFormula(formula) {
        return StereochemistryDiagramsRegistry.findByFormula(formula);
    }

    // Add stereochemistry diagram to workbook
    addStereochemistryDiagram(diagramConfig) {
        const {
            key,
            title = null,
            options = {},
            filename = null
        } = diagramConfig;

        // Validate diagram exists
        const diagram = StereochemistryDiagramsRegistry.getDiagram(key);
        if (!diagram) {
            throw new Error(`Stereochemistry diagram '${key}' not found`);
        }

        // Merge options
        const mergedOptions = { ...diagram.defaultOptions, ...options };
        if (title) mergedOptions.title = title;

        // Store diagram config
        const diagramObj = {
            id: `stereochem_${this.stereochemistryDiagrams.length + 1}`,
            key,
            type: 'stereochemistry',
            title: mergedOptions.title,
            options: mergedOptions,
            filename: filename || `${this.sheetName}_${key}_${Date.now()}.png`,
            createdAt: new Date(),
            category: diagram.category,
            formula: diagram.formula
        };

        this.stereochemistryDiagrams.push(diagramObj);
        this.addToHistory(`Added stereochemistry diagram: ${diagram.name}`);

        return diagramObj;
    }

    // Render stereochemistry diagram to PNG
    renderStereochemistryDiagramToPNG(diagramIndex) {
        if (diagramIndex < 0 || diagramIndex >= this.stereochemistryDiagrams.length) {
            throw new Error(`Stereochemistry diagram index ${diagramIndex} out of range`);
        }

        const diagramConfig = this.stereochemistryDiagrams[diagramIndex];
        
        const width = diagramConfig.options.width || 800;
        const height = diagramConfig.options.height || 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Update renderer's canvas
        this.stereochemistryRenderer.canvas = canvas;
        this.stereochemistryRenderer.ctx = ctx;

        // Render the diagram
        this.stereochemistryRenderer.renderDiagram(
            diagramConfig.key,
            0,
            0,
            width,
            height,
            diagramConfig.options
        );

        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(diagramConfig.filename, buffer);

        return {
            id: diagramConfig.id,
            filename: diagramConfig.filename,
            size: buffer.length,
            category: diagramConfig.category,
            type: 'stereochemistry',
            formula: diagramConfig.formula
        };
    }

    // Render all stereochemistry diagrams
    renderAllStereochemistryDiagrams() {
        const results = [];

        this.stereochemistryDiagrams.forEach((_, index) => {
            try {
                const result = this.renderStereochemistryDiagramToPNG(index);
                results.push(result);
            } catch (error) {
                results.push({
                    error: error.message,
                    index
                });
            }
        });

        return results;
    }

    // Get stereochemistry diagram statistics
    getStereochemistryDiagramStatistics() {
        const stats = StereochemistryDiagramsRegistry.getDiagramStats();
        return {
            totalAvailable: Object.values(stats).reduce((sum, cat) => sum + cat.count, 0),
            byCategory: stats,
            diagramsInWorkbook: this.stereochemistryDiagrams.length
        };
    }

    // Search stereochemistry diagrams
    searchStereochemistryDiagrams(query) {
        return StereochemistryDiagramsRegistry.searchDiagrams(query);
    }

    // List all stereochemistry diagrams in workbook
    listStereochemistryDiagrams() {
        return this.stereochemistryDiagrams.map((diagram, index) => ({
            index,
            id: diagram.id,
            name: diagram.title,
            formula: diagram.formula,
            type: StereochemistryDiagramsRegistry.getDiagram(diagram.key).name,
            category: diagram.category,
            filename: diagram.filename,
            created: diagram.createdAt
        }));
    }

    // Remove stereochemistry diagram
    removeStereochemistryDiagram(diagramIndex) {
        if (diagramIndex < 0 || diagramIndex >= this.stereochemistryDiagrams.length) {
            throw new Error(`Stereochemistry diagram index ${diagramIndex} out of range`);
        }

        const removed = this.stereochemistryDiagrams.splice(diagramIndex, 1);
        this.addToHistory(`Removed stereochemistry diagram: ${removed[0].title}`);
        return removed[0];
    }

    // Update stereochemistry diagram
    updateStereochemistryDiagram(diagramIndex, updates) {
        if (diagramIndex < 0 || diagramIndex >= this.stereochemistryDiagrams.length) {
            throw new Error(`Stereochemistry diagram index ${diagramIndex} out of range`);
        }

        const diagram = this.stereochemistryDiagrams[diagramIndex];
        
        if (updates.title) diagram.title = updates.title;
        if (updates.options) {
            diagram.options = { ...diagram.options, ...updates.options };
        }

        this.addToHistory(`Updated stereochemistry diagram: ${diagram.title}`);
        return diagram;
    }

    // Batch add stereochemistry diagrams by category
    addStereochemistryDiagramsByCategory(category, options = {}) {
        const diagrams = StereochemistryDiagramsRegistry.getDiagramsByCategory(category);
        const results = [];

        Object.keys(diagrams).forEach(key => {
            try {
                const result = this.addStereochemistryDiagram({
                    key,
                    options,
                    filename: `${this.sheetName}_${key}_${Date.now()}.png`
                });
                results.push(result);
            } catch (error) {
                results.push({ key, error: error.message });
            }
        });

        return results;
    }

    // Auto-detect and add stereochemistry diagrams from data
    addStereochemistryDiagramsFromData(options = {}) {
        const results = [];
        const foundFormulas = new Set();

        // Search through data for chemical formulas
        this.data.forEach(row => {
            Object.values(row).forEach(value => {
                if (typeof value === 'string') {
                    // Common chemical formula patterns
                    const formulaPattern = /\b([A-Z][a-z]?\d*)+\b/g;
                    const matches = value.match(formulaPattern);
                    
                    if (matches) {
                        matches.forEach(formula => {
                            const found = StereochemistryDiagramsRegistry.findByFormula(formula);
                            Object.keys(found).forEach(key => {
                                if (!foundFormulas.has(key)) {
                                    foundFormulas.add(key);
                                    try {
                                        const result = this.addStereochemistryDiagram({
                                            key,
                                            options,
                                            filename: `${this.sheetName}_${key}_${Date.now()}.png`
                                        });
                                        results.push({
                                            ...result,
                                            detectedIn: 'data',
                                            formula
                                        });
                                    } catch (error) {
                                        results.push({
                                            key,
                                            formula,
                                            error: error.message
                                        });
                                    }
                                }
                            });
                        });
                    }
                }
            });
        });

        return {
            results,
            totalAdded: results.filter(r => !r.error).length,
            formulas: Array.from(foundFormulas)
        };
    }

    // Export stereochemistry diagrams to a folder
    exportStereochemistryDiagramsToFolder(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const results = [];

        this.stereochemistryDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/${path.basename(diagram.filename)}`;
                
                const result = this.renderStereochemistryDiagramToPNG(index);
                results.push(result);
                
                // Restore original filename
                diagram.filename = originalFilename;
            } catch (error) {
                results.push({
                    index,
                    error: error.message
                });
            }
        });

        return {
            folder: folderPath,
            results,
            totalExported: results.filter(r => !r.error).length
        };
    }

    // Generate stereochemistry comparison report
    generateStereochemistryComparisonReport(formulas) {
        const report = {
            title: 'Molecular Structure Comparison',
            molecules: [],
            summary: {}
        };

        formulas.forEach(formula => {
            const found = this.findStereochemistryDiagramByFormula(formula);
            Object.entries(found).forEach(([key, diagram]) => {
                report.molecules.push({
                    key,
                    name: diagram.name,
                    formula: diagram.formula,
                    geometry: diagram.geometry,
                    bondAngles: diagram.bondAngles,
                    centralAtom: diagram.centralAtom,
                    category: diagram.category
                });
            });
        });

        // Generate summary
        const geometries = {};
        report.molecules.forEach(mol => {
            geometries[mol.geometry] = (geometries[mol.geometry] || 0) + 1;
        });

        report.summary = {
            totalMolecules: report.molecules.length,
            geometryDistribution: geometries,
            categories: [...new Set(report.molecules.map(m => m.category))]
        };

        return report;
    }

    // Get molecular geometry information
    getMolecularGeometryInfo(geometry) {
        const geometryInfo = {
            'tetrahedral': {
                bondAngles: [109.5],
                coordination: 4,
                description: 'Four atoms arranged at corners of a tetrahedron',
                examples: ['CH₄', 'CCl₄', 'NH₄⁺']
            },
            'bent': {
                bondAngles: [104.5, 120],
                coordination: 2,
                description: 'Two atoms with lone pairs causing bent shape',
                examples: ['H₂O', 'H₂S', 'SO₂']
            },
            'trigonal_pyramidal': {
                bondAngles: [107],
                coordination: 3,
                description: 'Three atoms with one lone pair forming pyramid',
                examples: ['NH₃', 'PH₃', 'H₃O⁺']
            },
            'trigonal_planar': {
                bondAngles: [120],
                coordination: 3,
                description: 'Three atoms in flat triangular arrangement',
                examples: ['BF₃', 'CO₃²⁻', 'C₂H₄']
            },
            'linear': {
                bondAngles: [180],
                coordination: 2,
                description: 'Two atoms in straight line',
                examples: ['CO₂', 'HCN', 'BeF₂']
            },
            'octahedral': {
                bondAngles: [90, 180],
                coordination: 6,
                description: 'Six atoms arranged at corners of octahedron',
                examples: ['SF₆', 'Fe(CN)₆³⁻', 'Co(NH₃)₆³⁺']
            }
        };

        return geometryInfo[geometry] || { error: 'Geometry not found' };
    }

    // Generate molecular properties table
    generateMolecularPropertiesTable() {
        const molecules = this.stereochemistryDiagrams;
        
        if (molecules.length === 0) {
            return { error: 'No stereochemistry diagrams in workbook' };
        }

        const table = {
            headers: ['Name', 'Formula', 'Geometry', 'Bond Angles', 'Central Atom', 'Category'],
            rows: []
        };

        molecules.forEach(mol => {
            const diagram = StereochemistryDiagramsRegistry.getDiagram(mol.key);
            if (diagram) {
                table.rows.push([
                    diagram.name,
                    diagram.formula,
                    diagram.geometry.replace(/_/g, ' '),
                    diagram.bondAngles.join(', ') + '°',
                    diagram.centralAtom || 'N/A',
                    diagram.category
                ]);
            }
        });

        return table;
    }

    // Export stereochemistry diagrams with metadata
    exportStereochemistryWithMetadata(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const results = [];
        const metadata = {
            exportDate: new Date().toISOString(),
            workbookName: this.sheetName,
            molecules: []
        };

        this.stereochemistryDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/${path.basename(diagram.filename)}`;
                
                const result = this.renderStereochemistryDiagramToPNG(index);
                results.push(result);
                
                // Add metadata
                const diagramInfo = StereochemistryDiagramsRegistry.getDiagram(diagram.key);
                metadata.molecules.push({
                    filename: path.basename(diagram.filename),
                    name: diagramInfo.name,
                    formula: diagramInfo.formula,
                    geometry: diagramInfo.geometry,
                    bondAngles: diagramInfo.bondAngles,
                    centralAtom: diagramInfo.centralAtom,
                    category: diagramInfo.category
                });
                
                diagram.filename = originalFilename;
            } catch (error) {
                results.push({
                    error: error.message,
                    diagram: diagram.key
                });
            }
        });

        // Write metadata JSON file
        const metadataPath = `${folderPath}/metadata.json`;
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        return {
            folder: folderPath,
            results,
            metadataFile: metadataPath,
            totalExported: results.filter(r => !r.error).length
        };
    }

    // ========================================================================
    // UNIFIED DIAGRAM MANAGEMENT (Anatomical + Cross-Section + Stereochemistry)
    // ========================================================================

    // Get all available diagrams
    getAllAvailableDiagrams() {
        return {
            anatomical: this.getAvailableAnatomicalDiagrams(),
            crossSection: this.getAvailableCrossSectionDiagrams(),
            stereochemistry: this.getAvailableStereochemistryDiagrams()
        };
    }

    // Search all diagrams
    searchAllDiagrams(query) {
        return {
            anatomical: this.searchAnatomicalDiagrams(query),
            crossSection: this.searchCrossSectionDiagrams(query),
            stereochemistry: this.searchStereochemistryDiagrams(query)
        };
    }

    // Get all diagram statistics
    getAllDiagramStatistics() {
        const anatomicalStats = this.getAnatomicalDiagramStatistics();
        const crossSectionStats = this.getCrossSectionDiagramStatistics();
        const stereochemStats = this.getStereochemistryDiagramStatistics();

        return {
            anatomical: anatomicalStats,
            crossSection: crossSectionStats,
            stereochemistry: stereochemStats,
            combined: {
                totalAvailable: 
                    anatomicalStats.totalDiagrams + 
                    crossSectionStats.totalAvailable + 
                    stereochemStats.totalAvailable,
                totalInWorkbook: 
                    this.anatomicalDiagrams.length + 
                    this.crossSectionDiagrams.length + 
                    this.stereochemistryDiagrams.length
            }
        };
    }

    // List all diagrams by type
    listAllDiagrams() {
        return {
            anatomical: this.listAnatomicalDiagrams(),
            crossSection: this.listCrossSectionDiagrams(),
            stereochemistry: this.listStereochemistryDiagrams(),
            total: 
                this.anatomicalDiagrams.length + 
                this.crossSectionDiagrams.length + 
                this.stereochemistryDiagrams.length
        };
    }

    // Get all diagram suggestions
    getAllDiagramSuggestions() {
        return {
            anatomical: this.suggestAnatomicalDiagrams(),
            crossSection: this.suggestCrossSectionDiagrams(),
            stereochemistry: this.suggestStereochemistryDiagrams()
        };
    }

    // Render all diagrams (anatomical + cross-section + stereochemistry)
    renderAllDiagrams() {
        const results = {
            anatomical: this.renderAllAnatomicalDiagrams(),
            crossSection: this.renderAllCrossSectionDiagrams(),
            stereochemistry: this.renderAllStereochemistryDiagrams()
        };

        return {
            ...results,
            summary: {
                anatomicalRendered: results.anatomical.filter(r => !r.error).length,
                crossSectionRendered: results.crossSection.filter(r => !r.error).length,
                stereochemistryRendered: results.stereochemistry.filter(r => !r.error).length,
                totalRendered: 
                    results.anatomical.filter(r => !r.error).length + 
                    results.crossSection.filter(r => !r.error).length +
                    results.stereochemistry.filter(r => !r.error).length,
                totalErrors: 
                    results.anatomical.filter(r => r.error).length + 
                    results.crossSection.filter(r => r.error).length +
                    results.stereochemistry.filter(r => r.error).length
            }
        };
    }

    // Export all diagrams organized by type
    exportAllDiagramsToFolder(folderPath, separateByType = true) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const results = {
            anatomical: [],
            crossSection: [],
            stereochemistry: []
        };

        if (separateByType) {
            // Create subfolders
            const anatomicalFolder = `${folderPath}/anatomical`;
            const crossSectionFolder = `${folderPath}/cross-section`;
            const stereochemFolder = `${folderPath}/stereochemistry`;
            
            [anatomicalFolder, crossSectionFolder, stereochemFolder].forEach(folder => {
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true });
                }
            });

            // Export anatomical diagrams
            const anatomicalExport = this.exportAnatomicalDiagramsToFolder(anatomicalFolder);
            results.anatomical = anatomicalExport.results;

            // Export cross-section diagrams
            const crossSectionExport = this.exportCrossSectionDiagramsToFolder(crossSectionFolder);
            results.crossSection = crossSectionExport.results;

            // Export stereochemistry diagrams
            const stereochemExport = this.exportStereochemistryDiagramsToFolder(stereochemFolder);
            results.stereochemistry = stereochemExport.results;
        } else {
            // Export all to same folder
            const anatomicalExport = this.exportAnatomicalDiagramsToFolder(folderPath);
            results.anatomical = anatomicalExport.results;

            const crossSectionExport = this.exportCrossSectionDiagramsToFolder(folderPath);
            results.crossSection = crossSectionExport.results;

            const stereochemExport = this.exportStereochemistryDiagramsToFolder(folderPath);
            results.stereochemistry = stereochemExport.results;
        }

        return {
            folder: folderPath,
            separatedByType: separateByType,
            results,
            summary: {
                anatomicalExported: results.anatomical.filter(r => !r.error).length,
                crossSectionExported: results.crossSection.filter(r => !r.error).length,
                stereochemistryExported: results.stereochemistry.filter(r => !r.error).length,
                totalExported: 
                    results.anatomical.filter(r => !r.error).length + 
                    results.crossSection.filter(r => !r.error).length +
                    results.stereochemistry.filter(r => !r.error).length,
                totalErrors: 
                    results.anatomical.filter(r => r.error).length + 
                    results.crossSection.filter(r => r.error).length +
                    results.stereochemistry.filter(r => r.error).length
            }
        };
    }

    // Batch add diagrams by category (all three types)
    addDiagramsByCategory(category, diagramType = 'all', options = {}) {
        const results = {
            anatomical: [],
            crossSection: [],
            stereochemistry: []
        };

        if (diagramType === 'anatomical' || diagramType === 'all') {
            try {
                results.anatomical = this.addAnatomicalDiagramsByCategory(category, options);
            } catch (error) {
                results.anatomical = [{ error: error.message, category, type: 'anatomical' }];
            }
        }

        if (diagramType === 'crossSection' || diagramType === 'all') {
            try {
                results.crossSection = this.addCrossSectionDiagramsByCategory(category, options);
            } catch (error) {
                results.crossSection = [{ error: error.message, category, type: 'crossSection' }];
            }
        }

        if (diagramType === 'stereochemistry' || diagramType === 'all') {
            try {
                results.stereochemistry = this.addStereochemistryDiagramsByCategory(category, options);
            } catch (error) {
                results.stereochemistry = [{ error: error.message, category, type: 'stereochemistry' }];
            }
        }

        return results;
    }

    // Generate comprehensive diagram guide
    generateComprehensiveDiagramGuide() {
        const guide = {
            title: 'Complete Scientific Diagram Reference',
            generatedAt: new Date(),
            workbook: this.sheetName,
            anatomical: {
                title: 'Anatomical Diagrams',
                categories: {},
                totalAvailable: 0
            },
            crossSection: {
                title: 'Cross-Section Diagrams',
                categories: {},
                totalAvailable: 0
            },
            stereochemistry: {
                title: 'Stereochemistry Diagrams',
                categories: {},
                totalAvailable: 0
            },
            suggestions: this.getAllDiagramSuggestions(),
            inWorkbook: this.listAllDiagrams()
        };

        // Anatomical diagrams
        const anatomicalCategories = AnatomicalDiagramsRegistry.getAllCategories();
        anatomicalCategories.forEach(category => {
            const diagrams = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);
            guide.anatomical.categories[category] = Object.entries(diagrams).map(([key, diagram]) => ({
                key,
                name: diagram.name,
                description: diagram.description,
                usage: diagram.usage,
                examples: diagram.examples
            }));
            guide.anatomical.totalAvailable += Object.keys(diagrams).length;
        });

        // Cross-section diagrams
        const crossSectionCategories = CrossSectionDiagramsRegistry.getAllCategories();
        crossSectionCategories.forEach(category => {
            const diagrams = CrossSectionDiagramsRegistry.getDiagramsByCategory(category);
            guide.crossSection.categories[category] = Object.entries(diagrams).map(([key, diagram]) => ({
                key,
                name: diagram.name,
                description: diagram.description,
                usage: diagram.usage,
                examples: diagram.examples
            }));
            guide.crossSection.totalAvailable += Object.keys(diagrams).length;
        });

        // Stereochemistry diagrams
        const stereochemCategories = StereochemistryDiagramsRegistry.getAllCategories();
        stereochemCategories.forEach(category => {
            const diagrams = StereochemistryDiagramsRegistry.getDiagramsByCategory(category);
            guide.stereochemistry.categories[category] = Object.entries(diagrams).map(([key, diagram]) => ({
                key,
                name: diagram.name,
                formula: diagram.formula,
                geometry: diagram.geometry,
                description: diagram.description,
                usage: diagram.usage,
                bondAngles: diagram.bondAngles
            }));
            guide.stereochemistry.totalAvailable += Object.keys(diagrams).length;
        });

        guide.summary = {
            totalAvailableDiagrams: 
                guide.anatomical.totalAvailable + 
                guide.crossSection.totalAvailable +
                guide.stereochemistry.totalAvailable,
            anatomicalInWorkbook: this.anatomicalDiagrams.length,
            crossSectionInWorkbook: this.crossSectionDiagrams.length,
            stereochemistryInWorkbook: this.stereochemistryDiagrams.length,
            totalInWorkbook: 
                this.anatomicalDiagrams.length + 
                this.crossSectionDiagrams.length +
                this.stereochemistryDiagrams.length
        };

        return guide;
    }

    // Generate unified report with all visualizations
    generateUnifiedVisualizationReport() {
        const baseReport = this.generateReport();
        const diagramsList = this.listAllDiagrams();
        const stats = this.getAllDiagramStatistics();

        return {
            ...baseReport,
            visualizations: {
                charts: {
                    count: this.charts.length,
                    charts: this.charts.map((chart, index) => ({
                        index,
                        type: chart.type,
                        title: chart.title
                    }))
                },
                anatomicalDiagrams: {
                    count: diagramsList.anatomical.length,
                    diagrams: diagramsList.anatomical
                },
                crossSectionDiagrams: {
                    count: diagramsList.crossSection.length,
                    diagrams: diagramsList.crossSection
                },
                stereochemistryDiagrams: {
                    count: diagramsList.stereochemistry.length,
                    diagrams: diagramsList.stereochemistry
                },
                summary: {
                    totalCharts: this.charts.length,
                    totalAnatomical: diagramsList.anatomical.length,
                    totalCrossSection: diagramsList.crossSection.length,
                    totalStereochemistry: diagramsList.stereochemistry.length,
                    totalDiagrams: diagramsList.total,
                    totalVisualizations: this.charts.length + diagramsList.total
                }
            },
            statistics: stats,
            suggestions: this.getAllDiagramSuggestions()
        };
    }

    // Quick add: Suggest and add top diagrams based on data
    quickAddSuggestedDiagrams(maxDiagrams = 5, diagramType = 'all') {
        const results = {
            anatomical: [],
            crossSection: [],
            stereochemistry: []
        };

        if (diagramType === 'anatomical' || diagramType === 'all') {
            const anatomicalSuggestions = this.suggestAnatomicalDiagrams().slice(0, maxDiagrams);
            anatomicalSuggestions.forEach(suggestion => {
                try {
                    const diagram = this.addAnatomicalDiagram({ key: suggestion.key });
                    results.anatomical.push({
                        ...diagram,
                        reason: suggestion.reason
                    });
                } catch (error) {
                    results.anatomical.push({
                        key: suggestion.key,
                        error: error.message
                    });
                }
            });
        }

        if (diagramType === 'crossSection' || diagramType === 'all') {
            const crossSectionSuggestions = this.suggestCrossSectionDiagrams().slice(0, maxDiagrams);
            crossSectionSuggestions.forEach(suggestion => {
                try {
                    const diagram = this.addCrossSectionDiagram({ key: suggestion.key });
                    results.crossSection.push({
                        ...diagram,
                        reason: suggestion.reason
                    });
                } catch (error) {
                    results.crossSection.push({
                        key: suggestion.key,
                        error: error.message
                    });
                }
            });
        }

        if (diagramType === 'stereochemistry' || diagramType === 'all') {
            const stereochemSuggestions = this.suggestStereochemistryDiagrams().slice(0, maxDiagrams);
            stereochemSuggestions.forEach(suggestion => {
                try {
                    const diagram = this.addStereochemistryDiagram({ key: suggestion.key });
                    results.stereochemistry.push({
                        ...diagram,
                        reason: suggestion.reason
                    });
                } catch (error) {
                    results.stereochemistry.push({
                        key: suggestion.key,
                        error: error.message
                    });
                }
            });
        }

        return results;
    }

    // Get diagram by ID (searches all three types)
    getDiagramById(diagramId) {
        const anatomical = this.anatomicalDiagrams.find(d => d.id === diagramId);
        if (anatomical) return { ...anatomical, type: 'anatomical' };

        const crossSection = this.crossSectionDiagrams.find(d => d.id === diagramId);
        if (crossSection) return { ...crossSection, type: 'crossSection' };

        const stereochemistry = this.stereochemistryDiagrams.find(d => d.id === diagramId);
        if (stereochemistry) return { ...stereochemistry, type: 'stereochemistry' };

        return null;
    }

    // Remove diagram by ID (searches all three types)
    removeDiagramById(diagramId) {
        const anatomicalIndex = this.anatomicalDiagrams.findIndex(d => d.id === diagramId);
        if (anatomicalIndex !== -1) {
            return this.removeAnatomicalDiagram(anatomicalIndex);
        }

        const crossSectionIndex = this.crossSectionDiagrams.findIndex(d => d.id === diagramId);
        if (crossSectionIndex !== -1) {
            return this.removeCrossSectionDiagram(crossSectionIndex);
        }

        const stereochemIndex = this.stereochemistryDiagrams.findIndex(d => d.id === diagramId);
        if (stereochemIndex !== -1) {
            return this.removeStereochemistryDiagram(stereochemIndex);
        }

        throw new Error(`Diagram with ID ${diagramId} not found`);
    }

    // Get diagram by identifier (searches all registries)
    getDiagramByIdentifier(identifier) {
        // Try as key in stereochemistry first (for formula support)
        let diagram = StereochemistryDiagramsRegistry.getDiagram(identifier);
        if (diagram) return { type: 'stereochemistry', diagram };

        // Try as formula
        const byFormula = StereochemistryDiagramsRegistry.findByFormula(identifier);
        if (Object.keys(byFormula).length > 0) {
            return { type: 'stereochemistry', diagrams: byFormula };
        }

        // Try anatomical
        diagram = AnatomicalDiagramsRegistry.getDiagram(identifier);
        if (diagram) return { type: 'anatomical', diagram };

        // Try cross-section
        diagram = CrossSectionDiagramsRegistry.getDiagram(identifier);
        if (diagram) return { type: 'crossSection', diagram };

        return { error: 'Diagram not found' };
    }

    // Generate complete diagram catalog
    generateDiagramCatalog() {
        const catalog = {
            metadata: {
                generated: new Date().toISOString(),
                workbook: this.sheetName,
                author: this.author
            },
            anatomical: {
                available: AnatomicalDiagramsRegistry.getAllDiagrams().length,
                inWorkbook: this.anatomicalDiagrams.length,
                categories: AnatomicalDiagramsRegistry.getAllCategories()
            },
            crossSection: {
                available: CrossSectionDiagramsRegistry.getAllDiagrams().length,
                inWorkbook: this.crossSectionDiagrams.length,
                categories: CrossSectionDiagramsRegistry.getAllCategories()
            },
            stereochemistry: {
                available: StereochemistryDiagramsRegistry.getAllDiagrams().length,
                inWorkbook: this.stereochemistryDiagrams.length,
                categories: StereochemistryDiagramsRegistry.getAllCategories(),
                formulas: Object.values(StereochemistryDiagramsRegistry.diagrams).map(d => d.formula)
            },
            totalDiagrams: {
                available: 
                    AnatomicalDiagramsRegistry.getAllDiagrams().length +
                    CrossSectionDiagramsRegistry.getAllDiagrams().length +
                    StereochemistryDiagramsRegistry.getAllDiagrams().length,
                inWorkbook: 
                    this.anatomicalDiagrams.length +
                    this.crossSectionDiagrams.length +
                    this.stereochemistryDiagrams.length
            }
        };

        return catalog;
    }

    // Count diagrams by type
    getDiagramCounts() {
        return {
            anatomical: this.anatomicalDiagrams.length,
            crossSection: this.crossSectionDiagrams.length,
            stereochemistry: this.stereochemistryDiagrams.length,
            total: 
                this.anatomicalDiagrams.length + 
                this.crossSectionDiagrams.length + 
                this.stereochemistryDiagrams.length
        };
    }

    // Check if workbook has diagrams of specific type
    hasDiagramsOfType(type) {
        const counts = this.getDiagramCounts();
        switch(type) {
            case 'anatomical':
                return counts.anatomical > 0;
            case 'crossSection':
                return counts.crossSection > 0;
            case 'stereochemistry':
                return counts.stereochemistry > 0;
            case 'any':
                return counts.total > 0;
            default:
                return false;
        }
    }

    // Get all diagrams of specific category across all types
    getAllDiagramsByCategory(category) {
        const results = {
            anatomical: [],
            crossSection: [],
            stereochemistry: []
        };

        // Check anatomical
        const anatomicalInCategory = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);
        results.anatomical = this.anatomicalDiagrams.filter(d => 
            Object.keys(anatomicalInCategory).includes(d.key)
        );

        // Check cross-section
        const crossSectionInCategory = CrossSectionDiagramsRegistry.getDiagramsByCategory(category);
        results.crossSection = this.crossSectionDiagrams.filter(d => 
            Object.keys(crossSectionInCategory).includes(d.key)
        );

        // Check stereochemistry
        const stereochemInCategory = StereochemistryDiagramsRegistry.getDiagramsByCategory(category);
        results.stereochemistry = this.stereochemistryDiagrams.filter(d => 
            Object.keys(stereochemInCategory).includes(d.key)
        );

        return results;
    }

    // Export diagrams with comprehensive metadata
    exportDiagramsWithFullMetadata(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const results = {
            anatomical: [],
            crossSection: [],
            stereochemistry: []
        };

        const metadata = {
            exportDate: new Date().toISOString(),
            workbook: this.sheetName,
            author: this.author,
            diagrams: {
                anatomical: [],
                crossSection: [],
                stereochemistry: []
            }
        };

        // Export anatomical
        this.anatomicalDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/anatomical_${path.basename(diagram.filename)}`;
                
                const result = this.renderAnatomicalDiagramToPNG(index);
                results.anatomical.push(result);
                
                const diagramInfo = AnatomicalDiagramsRegistry.getDiagram(diagram.key);
                metadata.diagrams.anatomical.push({
                    filename: path.basename(diagram.filename),
                    name: diagramInfo.name,
                    category: diagramInfo.category,
                    description: diagramInfo.description
                });
                
                diagram.filename = originalFilename;
            } catch (error) {
                results.anatomical.push({ error: error.message, diagram: diagram.key });
            }
        });

        // Export cross-section
        this.crossSectionDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/crosssection_${path.basename(diagram.filename)}`;
                
                const result = this.renderCrossSectionDiagramToPNG(index);
                results.crossSection.push(result);
                
                const diagramInfo = CrossSectionDiagramsRegistry.getDiagram(diagram.key);
                metadata.diagrams.crossSection.push({
                    filename: path.basename(diagram.filename),
                    name: diagramInfo.name,
                    category: diagramInfo.category,
                    description: diagramInfo.description
                });
                
                diagram.filename = originalFilename;
            } catch (error) {
                results.crossSection.push({ error: error.message, diagram: diagram.key });
            }
        });

        // Export stereochemistry
        this.stereochemistryDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/molecule_${path.basename(diagram.filename)}`;
                
                const result = this.renderStereochemistryDiagramToPNG(index);
                results.stereochemistry.push(result);
                
                const diagramInfo = StereochemistryDiagramsRegistry.getDiagram(diagram.key);
                metadata.diagrams.stereochemistry.push({
                    filename: path.basename(diagram.filename),
                    name: diagramInfo.name,
                    formula: diagramInfo.formula,
                    geometry: diagramInfo.geometry,
                    bondAngles: diagramInfo.bondAngles,
                    category: diagramInfo.category
                });
                
                diagram.filename = originalFilename;
            } catch (error) {
                results.stereochemistry.push({ error: error.message, diagram: diagram.key });
            }
        });

        // Write metadata JSON file
        const metadataPath = `${folderPath}/complete_metadata.json`;
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        return {
            folder: folderPath,
            results,
            metadataFile: metadataPath,
            summary: {
                anatomicalExported: results.anatomical.filter(r => !r.error).length,
                crossSectionExported: results.crossSection.filter(r => !r.error).length,
                stereochemistryExported: results.stereochemistry.filter(r => !r.error).length,
                totalExported: 
                    results.anatomical.filter(r => !r.error).length +
                    results.crossSection.filter(r => !r.error).length +
                    results.stereochemistry.filter(r => !r.error).length,
                totalErrors: 
                    results.anatomical.filter(r => r.error).length +
                    results.crossSection.filter(r => r.error).length +
                    results.stereochemistry.filter(r => r.error).length
            }
        };
    }

    // Generate comparison report for all diagram types
    generateDiagramTypeComparisonReport() {
        return {
            title: 'Diagram Type Comparison Report',
            workbook: this.sheetName,
            generatedAt: new Date().toISOString(),
            anatomical: {
                count: this.anatomicalDiagrams.length,
                availableCount: AnatomicalDiagramsRegistry.getAllDiagrams().length,
                categories: AnatomicalDiagramsRegistry.getAllCategories(),
                utilizationRate: this.anatomicalDiagrams.length / AnatomicalDiagramsRegistry.getAllDiagrams().length
            },
            crossSection: {
                count: this.crossSectionDiagrams.length,
                availableCount: CrossSectionDiagramsRegistry.getAllDiagrams().length,
                categories: CrossSectionDiagramsRegistry.getAllCategories(),
                utilizationRate: this.crossSectionDiagrams.length / CrossSectionDiagramsRegistry.getAllDiagrams().length
            },
            stereochemistry: {
                count: this.stereochemistryDiagrams.length,
                availableCount: StereochemistryDiagramsRegistry.getAllDiagrams().length,
                categories: StereochemistryDiagramsRegistry.getAllCategories(),
                formulas: this.stereochemistryDiagrams.map(d => d.formula),
                utilizationRate: this.stereochemistryDiagrams.length / StereochemistryDiagramsRegistry.getAllDiagrams().length
            },
            summary: {
                totalDiagrams: 
                    this.anatomicalDiagrams.length + 
                    this.crossSectionDiagrams.length + 
                    this.stereochemistryDiagrams.length,
                totalAvailable: 
                    AnatomicalDiagramsRegistry.getAllDiagrams().length +
                    CrossSectionDiagramsRegistry.getAllDiagrams().length +
                    StereochemistryDiagramsRegistry.getAllDiagrams().length,
                overallUtilizationRate: 
                    (this.anatomicalDiagrams.length + this.crossSectionDiagrams.length + this.stereochemistryDiagrams.length) /
                    (AnatomicalDiagramsRegistry.getAllDiagrams().length + CrossSectionDiagramsRegistry.getAllDiagrams().length + StereochemistryDiagramsRegistry.getAllDiagrams().length)
            }
        };
    }

    // Clear all diagrams of specific type
    clearDiagramsByType(type) {
        const removed = {
            anatomical: 0,
            crossSection: 0,
            stereochemistry: 0
        };

        switch(type) {
            case 'anatomical':
                removed.anatomical = this.anatomicalDiagrams.length;
                this.anatomicalDiagrams = [];
                this.addToHistory(`Cleared all anatomical diagrams (${removed.anatomical})`);
                break;
            case 'crossSection':
                removed.crossSection = this.crossSectionDiagrams.length;
                this.crossSectionDiagrams = [];
                this.addToHistory(`Cleared all cross-section diagrams (${removed.crossSection})`);
                break;
            case 'stereochemistry':
                removed.stereochemistry = this.stereochemistryDiagrams.length;
                this.stereochemistryDiagrams = [];
                this.addToHistory(`Cleared all stereochemistry diagrams (${removed.stereochemistry})`);
                break;
            case 'all':
                removed.anatomical = this.anatomicalDiagrams.length;
                removed.crossSection = this.crossSectionDiagrams.length;
                removed.stereochemistry = this.stereochemistryDiagrams.length;
                this.anatomicalDiagrams = [];
                this.crossSectionDiagrams = [];
                this.stereochemistryDiagrams = [];
                this.addToHistory(`Cleared all diagrams (${removed.anatomical + removed.crossSection + removed.stereochemistry})`);
                break;
            default:
                throw new Error(`Invalid diagram type: ${type}`);
        }

        return removed;
    }

    // Get comprehensive workbook summary
    getWorkbookSummary() {
        return {
            metadata: {
                name: this.sheetName,
                created: this.createdDate,
                lastModified: this.lastModified,
                author: this.author
            },
            data: {
                rows: this.data.length,
                columns: this.headers.length,
                headers: this.headers
            },
            visualizations: {
                charts: this.charts.length,
                diagrams: {
                    anatomical: this.anatomicalDiagrams.length,
                    crossSection: this.crossSectionDiagrams.length,
                    stereochemistry: this.stereochemistryDiagrams.length,
                    total: this.getDiagramCounts().total
                }
            },
            history: {
                entries: this.history.length,
                lastAction: this.history[this.history.length - 1] || null
            }
        };
    }


  
// ============================================================================
// UPDATED exportToPNG - Now includes Charts, Anatomical, Cross-Section, and Stereochemistry Diagrams
// ============================================================================

exportToPNG(filename = 'spreadsheet.png', options = {}) {
    const { 
        includeCharts = false, 
        includeAnatomicalDiagrams = false,
        includeCrossSectionDiagrams = false,
        includeStereochemistryDiagrams = false,
        chartIndices = [],
        anatomicalIndices = [],
        crossSectionIndices = [],
        stereochemistryIndices = []
    } = options;

    let totalHeight = this.height;
    const visualizationsToRender = {
        charts: [],
        anatomical: [],
        crossSection: [],
        stereochemistry: []
    };

    // Collect charts to render
    if (includeCharts && this.charts.length > 0) {
        const selectedCharts = chartIndices.length > 0
            ? chartIndices.map(i => this.charts[i]).filter(Boolean)
            : this.charts;
        visualizationsToRender.charts = selectedCharts;
    }

    // Collect anatomical diagrams to render
    if (includeAnatomicalDiagrams && this.anatomicalDiagrams.length > 0) {
        const selectedDiagrams = anatomicalIndices.length > 0
            ? anatomicalIndices.map(i => this.anatomicalDiagrams[i]).filter(Boolean)
            : this.anatomicalDiagrams;
        visualizationsToRender.anatomical = selectedDiagrams;
    }

    // Collect cross-section diagrams to render
    if (includeCrossSectionDiagrams && this.crossSectionDiagrams.length > 0) {
        const selectedCrossSections = crossSectionIndices.length > 0
            ? crossSectionIndices.map(i => this.crossSectionDiagrams[i]).filter(Boolean)
            : this.crossSectionDiagrams;
        visualizationsToRender.crossSection = selectedCrossSections;
    }

    // Collect stereochemistry diagrams to render
    if (includeStereochemistryDiagrams && this.stereochemistryDiagrams.length > 0) {
        const selectedStereochem = stereochemistryIndices.length > 0
            ? stereochemistryIndices.map(i => this.stereochemistryDiagrams[i]).filter(Boolean)
            : this.stereochemistryDiagrams;
        visualizationsToRender.stereochemistry = selectedStereochem;
    }

    // Calculate additional height needed
    const totalVisualizations = 
        visualizationsToRender.charts.length + 
        visualizationsToRender.anatomical.length +
        visualizationsToRender.crossSection.length +
        visualizationsToRender.stereochemistry.length;
    
    if (totalVisualizations > 0) {
        const sectionHeaderHeight = 80;
        const itemHeight = 350;
        const itemsPerRow = 2;
        const rows = Math.ceil(totalVisualizations / itemsPerRow);
        totalHeight += sectionHeaderHeight + (itemHeight * rows) + 50;
    }

    const canvas = createCanvas(this.width, totalHeight);
    const ctx = canvas.getContext('2d');

    // Render spreadsheet
    this.renderSpreadsheet(ctx);

    // Render visualizations if any
    if (totalVisualizations > 0) {
        this.renderVisualizationsToCanvas(ctx, visualizationsToRender);
    }

    const buffer = canvas.toBuffer('image/png');
    if (filename) {
        fs.writeFileSync(filename, buffer);
    }
    return buffer;
}

// ============================================================================
// UNIFIED Visualizations Renderer - All Visualization Types
// ============================================================================

renderVisualizationsToCanvas(ctx, visualizations) {
    const { 
        charts = [], 
        anatomical = [], 
        crossSection = [], 
        stereochemistry = [] 
    } = visualizations;
    
    const allVisualizations = [
        ...charts.map(c => ({ type: 'chart', data: c, icon: '📊' })),
        ...anatomical.map(d => ({ type: 'anatomical', data: d, icon: '🫀' })),
        ...crossSection.map(d => ({ type: 'crossSection', data: d, icon: '🔬' })),
        ...stereochemistry.map(d => ({ type: 'stereochemistry', data: d, icon: '🧪' }))
    ];

    if (allVisualizations.length === 0) return;

    // Calculate exact position right after spreadsheet ends
    const numRows = this.data.length;
    const spreadsheetEndY = 100 + this.headerHeight + (numRows * this.cellHeight) + 80;

    // Section header
    const headerY = spreadsheetEndY;
    ctx.fillStyle = this.colors.headerBg;
    ctx.fillRect(0, headerY, this.width, 60);

    ctx.fillStyle = this.colors.headerText;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('📊 Visualizations', 30, headerY + 25);

    // Summary text
    ctx.font = '14px Arial';
    const summaryParts = [];
    if (charts.length > 0) summaryParts.push(`${charts.length} Chart${charts.length !== 1 ? 's' : ''}`);
    if (anatomical.length > 0) summaryParts.push(`${anatomical.length} Anatomical`);
    if (crossSection.length > 0) summaryParts.push(`${crossSection.length} Cross-Section`);
    if (stereochemistry.length > 0) summaryParts.push(`${stereochemistry.length} Molecule${stereochemistry.length !== 1 ? 's' : ''}`);
    
    ctx.fillText(summaryParts.join(' • '), 30, headerY + 45);

    // Visualizations layout
    let currentY = headerY + 80;
    const itemsPerRow = 2;
    const itemWidth = 700;
    const itemHeight = 500;
    const itemSpacingX = 80;
    const itemSpacingY = 80;

    allVisualizations.forEach((viz, index) => {
        const colIndex = index % itemsPerRow;
        const rowIndex = Math.floor(index / itemsPerRow);

        const vizX = 50 + (colIndex * (itemWidth + itemSpacingX));
        const vizY = currentY + (rowIndex * (itemHeight + itemSpacingY + 40));

        // Title with icon
        ctx.fillStyle = this.colors.cellText;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(
            `${viz.icon} ${index + 1}. ${viz.data.title}`,
            vizX,
            vizY - 15
        );

        // Type label
        ctx.font = '11px Arial';
        ctx.fillStyle = '#666666';
        const typeLabels = {
            'chart': 'Chart',
            'anatomical': 'Anatomical Diagram',
            'crossSection': 'Cross-Section',
            'stereochemistry': 'Molecular Structure'
        };
        ctx.fillText(typeLabels[viz.type], vizX, vizY - 2);

        // Border
        ctx.strokeStyle = this.colors.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(vizX, vizY, itemWidth, itemHeight);

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(vizX + 1, vizY + 1, itemWidth - 2, itemHeight - 2);

        // Render the visualization
        try {
            ctx.save();
            ctx.translate(vizX, vizY);

            const tempCanvas = createCanvas(itemWidth, itemHeight);
            const tempCtx = tempCanvas.getContext('2d');

            if (viz.type === 'chart') {
                // Render chart
                this.chartRenderer.renderChart(
                    tempCanvas,
                    tempCtx,
                    viz.data.key,
                    viz.data.data,
                    { ...viz.data.options, width: itemWidth, height: itemHeight }
                );
            } else if (viz.type === 'anatomical') {
                // Render anatomical diagram
                this.diagramRenderer.canvas = tempCanvas;
                this.diagramRenderer.ctx = tempCtx;
                this.renderSpecificAnatomicalDiagram(viz.data.key, {
                    ...viz.data.options,
                    width: itemWidth,
                    height: itemHeight
                });
            } else if (viz.type === 'crossSection') {
                // Render cross-section diagram
                this.crossSectionRenderer.canvas = tempCanvas;
                this.crossSectionRenderer.ctx = tempCtx;
                this.crossSectionRenderer.renderDiagram(
                    viz.data.key,
                    0,
                    0,
                    itemWidth,
                    itemHeight,
                    viz.data.options
                );
            } else if (viz.type === 'stereochemistry') {
                // Render stereochemistry diagram
                this.stereochemistryRenderer.canvas = tempCanvas;
                this.stereochemistryRenderer.ctx = tempCtx;
                this.stereochemistryRenderer.renderDiagram(
                    viz.data.key,
                    0,
                    0,
                    itemWidth,
                    itemHeight,
                    viz.data.options
                );
            }

            // Draw the rendered visualization onto main canvas
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.restore();

        } catch (error) {
            ctx.restore();
            // Error state
            ctx.fillStyle = '#ffcccc';
            ctx.fillRect(vizX, vizY, itemWidth, itemHeight);
            ctx.fillStyle = '#ff0000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                `Error rendering ${typeLabels[viz.type]}`,
                vizX + itemWidth / 2,
                vizY + itemHeight / 2
            );
            console.error(`${viz.type} ${index + 1} error:`, error.message);
        }
    });
}

// Helper method for rendering specific anatomical diagrams


// ============================================================================
// UPDATED exportToExcel - All Diagram Types
// ============================================================================

async exportToExcel(filename = 'spreadsheet.xlsx', options = {}) {
    const { 
        includeCharts = false,
        includeAnatomicalDiagrams = false,
        includeCrossSectionDiagrams = false,
        includeStereochemistryDiagrams = false
    } = options;
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = this.author;
    workbook.created = this.createdDate;
    workbook.modified = this.lastModified;
    workbook.lastPrinted = new Date();

    const worksheet = workbook.addWorksheet(this.sheetName);
    worksheet.properties.defaultRowHeight = 20;

    // Add headers
    const headerRow = worksheet.addRow(this.headers);
    headerRow.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 12,
        name: 'Calibri'
    };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
    };
    headerRow.alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    headerRow.height = 30;

    headerRow.eachCell(cell => {
        cell.border = {
            top: { style: 'medium', color: { argb: 'FF2E5C8A' } },
            left: { style: 'thin', color: { argb: 'FF2E5C8A' } },
            bottom: { style: 'medium', color: { argb: 'FF2E5C8A' } },
            right: { style: 'thin', color: { argb: 'FF2E5C8A' } }
        };
    });

    // Add data rows
    this.data.forEach((row, rowIndex) => {
        const excelRow = worksheet.addRow(row);
        excelRow.height = 22;

        row.forEach((cellValue, colIndex) => {
            const cellRef = `${this.columnToLetter(colIndex)}${rowIndex + 1}`;
            const cell = excelRow.getCell(colIndex + 1);

            if (this.formulas[cellRef]) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFF2CC' }
                };
                cell.font = { bold: true, color: { argb: 'FF000000' } };
                cell.note = {
                    texts: [
                        { font: { bold: true, size: 10 }, text: 'Formula: ' },
                        { font: { size: 10 }, text: this.formulas[cellRef].formula }
                    ],
                    margins: { insetmode: 'auto', inset: [5, 5, 5, 5] }
                };
            } else if (this.calculations[cellRef] !== undefined) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE2EFDA' }
                };
                cell.font = { italic: true };
            }

            if (typeof cellValue === 'number') {
                cell.numFmt = cellValue % 1 === 0 ? '#,##0' : '#,##0.00';
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
            } else {
                cell.alignment = { horizontal: 'left', vertical: 'middle' };
            }

            cell.border = {
                top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
            };
        });

        if (rowIndex % 2 === 1) {
            excelRow.eachCell(cell => {
                if (!cell.fill || !cell.fill.fgColor || cell.fill.fgColor.argb === 'FFFFFFFF') {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF8F8F8' }
                    };
                }
            });
        }
    });

    // Auto-fit columns
    worksheet.columns.forEach((column, index) => {
        let maxLength = this.headers[index]?.toString().length || 10;
        column.eachCell({ includeEmpty: false }, cell => {
            const cellLength = cell.value ? cell.value.toString().length : 0;
            maxLength = Math.max(maxLength, cellLength);
        });
        column.width = Math.min(Math.max(maxLength + 3, 12), 45);
    });

    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    // ========== FORMULAS SHEET ==========
    if (Object.keys(this.formulas).length > 0) {
        const formulaSheet = workbook.addWorksheet('📋 Formulas');

        const formulaHeaderRow = formulaSheet.addRow([
            'Cell', 'Formula', 'Type', 'Category', 'Description', 'Applied'
        ]);

        formulaHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        formulaHeaderRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF70AD47' }
        };
        formulaHeaderRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        formulaHeaderRow.height = 30;

        Object.entries(this.formulas).forEach(([cell, data], index) => {
            const formula = SpreadsheetFormulaRegistry.getFormula(data.formulaKey);
            const formulaRow = formulaSheet.addRow([
                cell,
                data.formula,
                formula?.name || data.formulaKey,
                formula?.category || 'Unknown',
                formula?.description || '',
                data.timestamp.toLocaleString()
            ]);

            formulaRow.alignment = { vertical: 'top', wrapText: true };

            if (index % 2 === 1) {
                formulaRow.eachCell(cell => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F0F0' } };
                });
            }
        });

        formulaSheet.columns = [
            { width: 15 }, { width: 35 }, { width: 25 },
            { width: 20 }, { width: 45 }, { width: 22 }
        ];
    }

    // ========== VISUALIZATIONS SHEET (All Types) ==========
    const hasVisualizations = 
        (includeCharts && this.charts.length > 0) || 
        (includeAnatomicalDiagrams && this.anatomicalDiagrams.length > 0) ||
        (includeCrossSectionDiagrams && this.crossSectionDiagrams.length > 0) ||
        (includeStereochemistryDiagrams && this.stereochemistryDiagrams.length > 0);

    if (hasVisualizations) {
        const vizSheet = workbook.addWorksheet('📊 Visualizations');
        let currentRow = 1;

        // Track temp files for cleanup AFTER Excel is saved
        const tempFilesToCleanup = [];

        // HELPER FUNCTION: Add image to Excel with proper error handling
        const addImageToExcel = async (canvas, title, type, index, metadata = {}) => {
            let tempFilePath = null;
            
            try {
                // Create temp directory if it doesn't exist
                const tempDir = os.tmpdir();
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }

                // Generate unique filename
                const timestamp = Date.now();
                const random = Math.random().toString(36).substring(2, 15);
                tempFilePath = path.join(tempDir, `${type}_${timestamp}_${index}_${random}.png`);

                // Save canvas to buffer
                const buffer = canvas.toBuffer('image/png');
                
                // Write buffer to temp file
                fs.writeFileSync(tempFilePath, buffer);

                // Verify file exists
                if (!fs.existsSync(tempFilePath)) {
                    throw new Error(`Failed to create temp file: ${tempFilePath}`);
                }

                console.log(`  • Created temp file: ${path.basename(tempFilePath)}`);

                // Add image to workbook
                const imageId = workbook.addImage({
                    filename: tempFilePath,
                    extension: 'png'
                });

                // Add title
                const titleCell = vizSheet.getCell(`A${currentRow}`);
                titleCell.value = title;
                
                const typeColors = {
                    'chart': 'FF4472C4',
                    'anatomical': 'FFE74C3C',
                    'crossSection': 'FF27AE60',
                    'stereochemistry': 'FF9B59B6'
                };
                
                titleCell.font = { 
                    bold: true, 
                    size: 12, 
                    color: { argb: typeColors[type] || 'FF000000' } 
                };
                titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
                vizSheet.getRow(currentRow).height = 25;
                currentRow += 1;

                // Add metadata if provided
                if (Object.keys(metadata).length > 0) {
                    const metaCell = vizSheet.getCell(`A${currentRow}`);
                    const metaText = Object.entries(metadata)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(' • ');
                    metaCell.value = metaText;
                    metaCell.font = { size: 10, italic: true, color: { argb: 'FF666666' } };
                    vizSheet.getRow(currentRow).height = 20;
                    currentRow += 1;
                }

                // Insert image
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                
                vizSheet.addImage(imageId, {
                    tl: { col: 0, row: currentRow - 1 },
                    ext: { width: imgWidth, height: imgHeight },
                    editAs: 'oneCell'
                });

                // Calculate rows for image
                const rowsNeeded = Math.ceil(imgHeight / 20);
                for (let r = 0; r < rowsNeeded; r++) {
                    vizSheet.getRow(currentRow + r).height = 20;
                }
                currentRow += rowsNeeded + 2;

                console.log(`  ✓ Added ${type} to Excel: ${title}`);

                // Add to cleanup list (don't delete yet!)
                tempFilesToCleanup.push(tempFilePath);

                return true;

            } catch (error) {
                console.error(`  ❌ Error adding ${type} ${index + 1}:`, error.message);
                
                // Add error message to sheet
                const errorCell = vizSheet.getCell(`A${currentRow}`);
                errorCell.value = `⚠ Error: ${title} - ${error.message}`;
                errorCell.font = { color: { argb: 'FFFF0000' }, italic: true };
                vizSheet.getRow(currentRow).height = 25;
                currentRow += 2;

                return false;
            }
        };

        // Add Charts
        if (includeCharts && this.charts.length > 0) {
            console.log('\n📊 Adding Charts to Excel...');
            
            // Section header
            const chartHeaderCell = vizSheet.getCell(`A${currentRow}`);
            chartHeaderCell.value = '📊 CHARTS';
            chartHeaderCell.font = { bold: true, size: 14, color: { argb: 'FF4472C4' } };
            chartHeaderCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE7F3FF' }
            };
            vizSheet.getRow(currentRow).height = 30;
            currentRow += 2;

            for (let i = 0; i < this.charts.length; i++) {
                const chartConfig = this.charts[i];
                
                try {
                    // Render chart to canvas
                    const chartCanvas = createCanvas(
                        chartConfig.options.width || 700,
                        chartConfig.options.height || 500
                    );
                    const chartCtx = chartCanvas.getContext('2d');

                    this.chartRenderer.renderChart(
                        chartCanvas,
                        chartCtx,
                        chartConfig.key,
                        chartConfig.data,
                        chartConfig.options
                    );

                    // Add to Excel
                    await addImageToExcel(
                        chartCanvas,
                        `Chart ${i + 1}: ${chartConfig.title}`,
                        'chart',
                        i,
                        { Type: chartConfig.key }
                    );

                } catch (error) {
                    console.error(`  ❌ Chart ${i + 1} rendering failed:`, error.message);
                }
            }

            currentRow += 2;
        }

        // Add Anatomical Diagrams
        if (includeAnatomicalDiagrams && this.anatomicalDiagrams.length > 0) {
            console.log('\n🫀 Adding Anatomical Diagrams to Excel...');
            
            // Section header
            const anatomicalHeaderCell = vizSheet.getCell(`A${currentRow}`);
            anatomicalHeaderCell.value = '🫀 ANATOMICAL DIAGRAMS';
            anatomicalHeaderCell.font = { bold: true, size: 14, color: { argb: 'FFE74C3C' } };
            anatomicalHeaderCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFE7E7' }
            };
            vizSheet.getRow(currentRow).height = 30;
            currentRow += 2;

            for (let i = 0; i < this.anatomicalDiagrams.length; i++) {
                const diagramConfig = this.anatomicalDiagrams[i];
                
                try {
                    // Render diagram to canvas
                    const diagramWidth = diagramConfig.options.width || 800;
                    const diagramHeight = diagramConfig.options.height || 700;
                    const diagramCanvas = createCanvas(diagramWidth, diagramHeight);
                    const diagramCtx = diagramCanvas.getContext('2d');

                    this.diagramRenderer.canvas = diagramCanvas;
                    this.diagramRenderer.ctx = diagramCtx;
                    
                    this.renderSpecificAnatomicalDiagram(diagramConfig.key, diagramConfig.options);

                    const diagramInfo = AnatomicalDiagramsRegistry.getDiagram(diagramConfig.key);

                    // Add to Excel
                    await addImageToExcel(
                        diagramCanvas,
                        `Diagram ${i + 1}: ${diagramConfig.title}`,
                        'anatomical',
                        i,
                        { Category: diagramInfo.category }
                    );

                } catch (error) {
                    console.error(`  ❌ Anatomical Diagram ${i + 1} rendering failed:`, error.message);
                }
            }

            currentRow += 2;
        }

        // Add Cross-Section Diagrams
        if (includeCrossSectionDiagrams && this.crossSectionDiagrams.length > 0) {
            console.log('\n🔬 Adding Cross-Section Diagrams to Excel...');
            
            // Section header
            const crossSectionHeaderCell = vizSheet.getCell(`A${currentRow}`);
            crossSectionHeaderCell.value = '🔬 CROSS-SECTION DIAGRAMS';
            crossSectionHeaderCell.font = { bold: true, size: 14, color: { argb: 'FF27AE60' } };
            crossSectionHeaderCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE7F9EF' }
            };
            vizSheet.getRow(currentRow).height = 30;
            currentRow += 2;

            for (let i = 0; i < this.crossSectionDiagrams.length; i++) {
                const diagramConfig = this.crossSectionDiagrams[i];
                
                try {
                    // Render diagram to canvas
                    const diagramWidth = diagramConfig.options.width || 800;
                    const diagramHeight = diagramConfig.options.height || 600;
                    const diagramCanvas = createCanvas(diagramWidth, diagramHeight);
                    const diagramCtx = diagramCanvas.getContext('2d');

                    this.crossSectionRenderer.canvas = diagramCanvas;
                    this.crossSectionRenderer.ctx = diagramCtx;
                    
                    this.crossSectionRenderer.renderDiagram(
                        diagramConfig.key,
                        0,
                        0,
                        diagramWidth,
                        diagramHeight,
                        diagramConfig.options
                    );

                    const diagramInfo = CrossSectionDiagramsRegistry.getDiagram(diagramConfig.key);

                    // Add to Excel
                    await addImageToExcel(
                        diagramCanvas,
                        `Cross-Section ${i + 1}: ${diagramConfig.title}`,
                        'crossSection',
                        i,
                        { Category: diagramInfo.category }
                    );

                } catch (error) {
                    console.error(`  ❌ Cross-Section Diagram ${i + 1} rendering failed:`, error.message);
                }
            }

            currentRow += 2;
        }

        // Add Stereochemistry Diagrams
        if (includeStereochemistryDiagrams && this.stereochemistryDiagrams.length > 0) {
            console.log('\n🧪 Adding Stereochemistry Diagrams to Excel...');
            
            // Section header
            const stereochemHeaderCell = vizSheet.getCell(`A${currentRow}`);
            stereochemHeaderCell.value = '🧪 MOLECULAR STRUCTURES';
            stereochemHeaderCell.font = { bold: true, size: 14, color: { argb: 'FF9B59B6' } };
            stereochemHeaderCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF4ECF7' }
            };
            vizSheet.getRow(currentRow).height = 30;
            currentRow += 2;

            for (let i = 0; i < this.stereochemistryDiagrams.length; i++) {
                const diagramConfig = this.stereochemistryDiagrams[i];
                
                try {
                    // Render diagram to canvas
                    const diagramWidth = diagramConfig.options.width || 800;
                    const diagramHeight = diagramConfig.options.height || 600;
                    const diagramCanvas = createCanvas(diagramWidth, diagramHeight);
                    const diagramCtx = diagramCanvas.getContext('2d');

                    this.stereochemistryRenderer.canvas = diagramCanvas;
                    this.stereochemistryRenderer.ctx = diagramCtx;
                    
                    this.stereochemistryRenderer.renderDiagram(
                        diagramConfig.key,
                        0,
                        0,
                        diagramWidth,
                        diagramHeight,
                        diagramConfig.options
                    );

                    const diagramInfo = StereochemistryDiagramsRegistry.getDiagram(diagramConfig.key);

                    // Add to Excel with molecular info
                    await addImageToExcel(
                        diagramCanvas,
                        `Molecule ${i + 1}: ${diagramConfig.title}`,
                        'stereochemistry',
                        i,
                        { 
                            Formula: diagramInfo.formula,
                            Geometry: diagramInfo.geometry.replace(/_/g, ' '),
                            'Bond Angles': diagramInfo.bondAngles.join('°, ') + '°'
                        }
                    );

                } catch (error) {
                    console.error(`  ❌ Stereochemistry Diagram ${i + 1} rendering failed:`, error.message);
                }
            }

            currentRow += 2;
        }

        vizSheet.columns = [{ width: 100 }];

        // Save workbook FIRST, then cleanup temp files
        console.log('\n💾 Saving Excel workbook...');
        await workbook.xlsx.writeFile(filename);
        console.log(`✓ Excel file saved: ${filename}\n`);

        // NOW cleanup temp files after Excel is saved
        console.log('🧹 Cleaning up temporary files...');
        tempFilesToCleanup.forEach(tempFile => {
            try {
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                    console.log(`  • Cleaned up: ${path.basename(tempFile)}`);
                }
            } catch (e) {
                console.warn(`  ⚠ Failed to delete temp file: ${tempFile}`);
            }
        });
    } else {
        // No visualizations - just save
        console.log('\n💾 Saving Excel workbook...');
        await workbook.xlsx.writeFile(filename);
        console.log(`✓ Excel file saved: ${filename}\n`);
    }

    return {
        success: true,
        filename,
        sheets: workbook.worksheets.length,
        rows: this.data.length,
        columns: this.headers.length,
        formulas: Object.keys(this.formulas).length,
        visualizations: {
            charts: includeCharts ? this.charts.length : 0,
            anatomicalDiagrams: includeAnatomicalDiagrams ? this.anatomicalDiagrams.length : 0,
            crossSectionDiagrams: includeCrossSectionDiagrams ? this.crossSectionDiagrams.length : 0,
            stereochemistryDiagrams: includeStereochemistryDiagrams ? this.stereochemistryDiagrams.length : 0,
            total: 
                (includeCharts ? this.charts.length : 0) +
                (includeAnatomicalDiagrams ? this.anatomicalDiagrams.length : 0) +
                (includeCrossSectionDiagrams ? this.crossSectionDiagrams.length : 0) +
                (includeStereochemistryDiagrams ? this.stereochemistryDiagrams.length : 0)
        }
    };
}

// ============================================================================
// UPDATED generateCombinedReport - All Visualization Types
// ============================================================================

generateCombinedReport() {
    const baseReport = this.generateReport();
    
    return {
        ...baseReport,
        anatomicalDiagrams: this.listAnatomicalDiagrams(),
        crossSectionDiagrams: this.listCrossSectionDiagrams(),
        stereochemistryDiagrams: this.listStereochemistryDiagrams(),
        statistics: {
            anatomical: this.getAnatomicalDiagramStatistics(),
            crossSection: this.getCrossSectionDiagramStatistics(),
            stereochemistry: this.getStereochemistryDiagramStatistics()
        },
        visualizations: {
            charts: this.charts.length,
            anatomicalDiagrams: this.anatomicalDiagrams.length,
            crossSectionDiagrams: this.crossSectionDiagrams.length,
            stereochemistryDiagrams: this.stereochemistryDiagrams.length,
            total: 
                this.charts.length + 
                this.anatomicalDiagrams.length +
                this.crossSectionDiagrams.length +
                this.stereochemistryDiagrams.length
        }
    };
}

// ============================================================================
// UPDATED generateReport - Complete Metadata
// ============================================================================

generateReport() {
    return {
        metadata: {
            sheetName: this.sheetName,
            created: this.createdDate,
            lastModified: this.lastModified,
            author: this.author,
            rowCount: this.data.length,
            columnCount: this.headers.length
        },
        data: {
            headers: this.headers,
            totalRows: this.data.length,
            totalCells: this.data.length * this.headers.length
        },
        formulas: {
            count: Object.keys(this.formulas).length,
            formulas: Object.entries(this.formulas).map(([cell, data]) => ({
                cell,
                formula: data.formula,
                formulaKey: data.formulaKey,
                timestamp: data.timestamp
            }))
        },
        calculations: {
            count: Object.keys(this.calculations).length
        },
        visualizations: {
            charts: {
                count: this.charts.length,
                types: [...new Set(this.charts.map(c => c.key))]
            },
            diagrams: {
                anatomical: {
                    count: this.anatomicalDiagrams.length,
                    categories: [...new Set(this.anatomicalDiagrams.map(d => d.category))]
                },
                crossSection: {
                    count: this.crossSectionDiagrams.length,
                    categories: [...new Set(this.crossSectionDiagrams.map(d => d.category))]
                },
                stereochemistry: {
                    count: this.stereochemistryDiagrams.length,
                    formulas: [...new Set(this.stereochemistryDiagrams.map(d => d.formula))],
                    geometries: [...new Set(this.stereochemistryDiagrams.map(d => {
                        const diagram = StereochemistryDiagramsRegistry.getDiagram(d.key);
                        return diagram ? diagram.geometry : 'unknown';
                    }))]
                },
                total: 
                    this.anatomicalDiagrams.length +
                    this.crossSectionDiagrams.length +
                    this.stereochemistryDiagrams.length
            }
        },
        history: {
            entries: this.history.length,
            recentActions: this.history.slice(-10)
        }
    };
}

// ============================================================================
// EXPORT CONVENIENCE METHODS
// ============================================================================

// Export with all visualizations
async exportCompleteWorkbook(baseFilename = 'complete_workbook', format = 'both') {
    const results = {
        png: null,
        excel: null
    };

    const exportOptions = {
        includeCharts: true,
        includeAnatomicalDiagrams: true,
        includeCrossSectionDiagrams: true,
        includeStereochemistryDiagrams: true
    };

    try {
        if (format === 'png' || format === 'both') {
            console.log('📊 Exporting complete workbook to PNG...');
            const pngFilename = `${baseFilename}.png`;
            this.exportToPNG(pngFilename, exportOptions);
            results.png = {
                success: true,
                filename: pngFilename,
                visualizations: this.getDiagramCounts()
            };
            console.log(`✓ PNG export complete: ${pngFilename}\n`);
        }

        if (format === 'excel' || format === 'both') {
            console.log('📊 Exporting complete workbook to Excel...');
            const excelFilename = `${baseFilename}.xlsx`;
            const excelResult = await this.exportToExcel(excelFilename, exportOptions);
            results.excel = excelResult;
        }

        return {
            success: true,
            results,
            summary: {
                format,
                charts: this.charts.length,
                anatomicalDiagrams: this.anatomicalDiagrams.length,
                crossSectionDiagrams: this.crossSectionDiagrams.length,
                stereochemistryDiagrams: this.stereochemistryDiagrams.length,
                totalVisualizations: this.getDiagramCounts().total
            }
        };

    } catch (error) {
        console.error('❌ Export failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Export specific visualization types
async exportSelectedVisualizations(baseFilename, options = {}) {
    const {
        format = 'both',
        includeCharts = false,
        includeAnatomicalDiagrams = false,
        includeCrossSectionDiagrams = false,
        includeStereochemistryDiagrams = false,
        chartIndices = [],
        anatomicalIndices = [],
        crossSectionIndices = [],
        stereochemistryIndices = []
    } = options;

    const exportOptions = {
        includeCharts,
        includeAnatomicalDiagrams,
        includeCrossSectionDiagrams,
        includeStereochemistryDiagrams,
        chartIndices,
        anatomicalIndices,
        crossSectionIndices,
        stereochemistryIndices
    };

    const results = {
        png: null,
        excel: null
    };

    try {
        if (format === 'png' || format === 'both') {
            const pngFilename = `${baseFilename}.png`;
            this.exportToPNG(pngFilename, exportOptions);
            results.png = {
                success: true,
                filename: pngFilename
            };
        }

        if (format === 'excel' || format === 'both') {
            const excelFilename = `${baseFilename}.xlsx`;
            results.excel = await this.exportToExcel(excelFilename, exportOptions);
        }

        return {
            success: true,
            results
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Quick export methods
async exportWithCharts(filename = 'workbook_with_charts') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeCharts: true
    });
}

async exportWithAnatomicalDiagrams(filename = 'workbook_with_anatomical') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeAnatomicalDiagrams: true
    });
}

async exportWithCrossSectionDiagrams(filename = 'workbook_with_crosssection') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeCrossSectionDiagrams: true
    });
}

async exportWithStereochemistryDiagrams(filename = 'workbook_with_molecules') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeStereochemistryDiagrams: true
    });
}

async exportWithAllDiagrams(filename = 'workbook_with_all_diagrams') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeAnatomicalDiagrams: true,
        includeCrossSectionDiagrams: true,
        includeStereochemistryDiagrams: true
    });
}

// ============================================================================
// VISUALIZATION SUMMARY METHODS
// ============================================================================

getVisualizationSummary() {
    return {
        charts: {
            count: this.charts.length,
            types: this.charts.map(c => ({
                title: c.title,
                type: c.key
            }))
        },
        anatomicalDiagrams: {
            count: this.anatomicalDiagrams.length,
            diagrams: this.anatomicalDiagrams.map(d => ({
                title: d.title,
                category: d.category
            }))
        },
        crossSectionDiagrams: {
            count: this.crossSectionDiagrams.length,
            diagrams: this.crossSectionDiagrams.map(d => ({
                title: d.title,
                category: d.category
            }))
        },
        stereochemistryDiagrams: {
            count: this.stereochemistryDiagrams.length,
            molecules: this.stereochemistryDiagrams.map(d => ({
                title: d.title,
                formula: d.formula
            }))
        },
        total: 
            this.charts.length + 
            this.anatomicalDiagrams.length +
            this.crossSectionDiagrams.length +
            this.stereochemistryDiagrams.length
    };
}

hasAnyVisualizations() {
    return (
        this.charts.length > 0 ||
        this.anatomicalDiagrams.length > 0 ||
        this.crossSectionDiagrams.length > 0 ||
        this.stereochemistryDiagrams.length > 0
    );
}

getVisualizationTypes() {
    const types = [];
    if (this.charts.length > 0) types.push('charts');
    if (this.anatomicalDiagrams.length > 0) types.push('anatomical');
    if (this.crossSectionDiagrams.length > 0) types.push('crossSection');
    if (this.stereochemistryDiagrams.length > 0) types.push('stereochemistry');
    return types;
}

// ============================================================================
// BATCH EXPORT METHODS
// ============================================================================

async exportAllVisualizationsSeparately(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const results = {
        charts: [],
        anatomical: [],
        crossSection: [],
        stereochemistry: [],
        errors: []
    };

    console.log('\n📊 Exporting all visualizations separately...\n');

    // Export charts
    for (let i = 0; i < this.charts.length; i++) {
        try {
            const chart = this.charts[i];
            const filename = `${folderPath}/chart_${i + 1}_${chart.title.replace(/[^a-z0-9]/gi, '_')}.png`;
            
            const canvas = createCanvas(
                chart.options.width || 700,
                chart.options.height || 500
            );
            const ctx = canvas.getContext('2d');

            this.chartRenderer.renderChart(canvas, ctx, chart.key, chart.data, chart.options);

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            results.charts.push({ success: true, filename, title: chart.title });
            console.log(`✓ Chart ${i + 1}: ${chart.title}`);
        } catch (error) {
            results.errors.push({ type: 'chart', index: i, error: error.message });
            console.error(`✗ Chart ${i + 1} failed: ${error.message}`);
        }
    }

    // Export anatomical diagrams
    for (let i = 0; i < this.anatomicalDiagrams.length; i++) {
        try {
            const diagram = this.anatomicalDiagrams[i];
            const filename = `${folderPath}/anatomical_${i + 1}_${diagram.title.replace(/[^a-z0-9]/gi, '_')}.png`;
            
            const canvas = createCanvas(
                diagram.options.width || 800,
                diagram.options.height || 700
            );
            const ctx = canvas.getContext('2d');

            this.diagramRenderer.canvas = canvas;
            this.diagramRenderer.ctx = ctx;
            this.renderSpecificAnatomicalDiagram(diagram.key, diagram.options);

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            results.anatomical.push({ success: true, filename, title: diagram.title });
            console.log(`✓ Anatomical ${i + 1}: ${diagram.title}`);
        } catch (error) {
            results.errors.push({ type: 'anatomical', index: i, error: error.message });
            console.error(`✗ Anatomical ${i + 1} failed: ${error.message}`);
        }
    }

    // Export cross-section diagrams
    for (let i = 0; i < this.crossSectionDiagrams.length; i++) {
        try {
            const diagram = this.crossSectionDiagrams[i];
            const filename = `${folderPath}/crosssection_${i + 1}_${diagram.title.replace(/[^a-z0-9]/gi, '_')}.png`;
            
            const canvas = createCanvas(
                diagram.options.width || 800,
                diagram.options.height || 600
            );
            const ctx = canvas.getContext('2d');

            this.crossSectionRenderer.canvas = canvas;
            this.crossSectionRenderer.ctx = ctx;
            this.crossSectionRenderer.renderDiagram(
                diagram.key,
                0,
                0,
                diagram.options.width || 800,
                diagram.options.height || 600,
                diagram.options
            );

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            results.crossSection.push({ success: true, filename, title: diagram.title });
            console.log(`✓ Cross-Section ${i + 1}: ${diagram.title}`);
        } catch (error) {
            results.errors.push({ type: 'crossSection', index: i, error: error.message });
            console.error(`✗ Cross-Section ${i + 1} failed: ${error.message}`);
        }
    }

    // Export stereochemistry diagrams
    for (let i = 0; i < this.stereochemistryDiagrams.length; i++) {
        try {
            const diagram = this.stereochemistryDiagrams[i];
            const filename = `${folderPath}/molecule_${i + 1}_${diagram.title.replace(/[^a-z0-9]/gi, '_')}.png`;
            
            const canvas = createCanvas(
                diagram.options.width || 800,
                diagram.options.height || 600
            );
            const ctx = canvas.getContext('2d');

            this.stereochemistryRenderer.canvas = canvas;
            this.stereochemistryRenderer.ctx = ctx;
            this.stereochemistryRenderer.renderDiagram(
                diagram.key,
                0,
                0,
                diagram.options.width || 800,
                diagram.options.height || 600,
                diagram.options
            );

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            results.stereochemistry.push({ success: true, filename, title: diagram.title });
            console.log(`✓ Molecule ${i + 1}: ${diagram.title}`);
        } catch (error) {
            results.errors.push({ type: 'stereochemistry', index: i, error: error.message });
            console.error(`✗ Molecule ${i + 1} failed: ${error.message}`);
        }
    }

    console.log('\n✓ Export complete!\n');

    return {
        folder: folderPath,
        results,
        summary: {
            chartsExported: results.charts.length,
            anatomicalExported: results.anatomical.length,
            crossSectionExported: results.crossSection.length,
            stereochemistryExported: results.stereochemistry.length,
            totalExported: 
                results.charts.length + 
                results.anatomical.length +
                results.crossSection.length +
                results.stereochemistry.length,
            errors: results.errors.length
        }
    };
}

  

    generateFormulaGuide() {
        const guide = {
            title: 'Available Formula Actions',
            categories: {},
            totalFormulas: 0,
            suggestions: []
        };

        const categories = SpreadsheetFormulaRegistry.getAllCategories();

        categories.forEach(category => {
            const formulas = SpreadsheetFormulaRegistry.getFormulasByCategory(category);
            guide.categories[category] = Object.entries(formulas).map(([key, formula]) => ({
                key,
                name: formula.name,
                description: formula.description,
                example: formula.example,
                excelFormula: formula.excelFormula,
                parameters: formula.paramNames || []
            }));
            guide.totalFormulas += Object.keys(formulas).length;
        });

        if (this.data.length > 0) {
            const sampleRange = `A2:A${Math.min(this.data.length + 1, 11)}`;
            guide.suggestions = this.suggestFormulas(sampleRange);
        }

        return guide;
    }

    getFormulaHelp(formulaKey) {
        const formula = SpreadsheetFormulaRegistry.getFormula(formulaKey);
        if (!formula) {
            return { error: 'Formula not found' };
        }

        return {
            name: formula.name,
            category: formula.category,
            description: formula.description,
            excelFormula: formula.excelFormula,
            example: formula.example,
            parameters: formula.params.map((param, index) => ({
                name: param,
                description: formula.paramNames[index] || param,
                required: true
            })),
            usage: formula.usage || 'Apply this formula to calculate results',
            tips: this.generateFormulaTips(formula)
        };
    }

    generateFormulaTips(formula) {
        const tips = [];

        if (formula.params.includes('range')) {
            tips.push('Use cell ranges like A1:A10 to reference multiple cells');
            tips.push('You can reference entire columns like A:A');
        }

        if (formula.category === 'Financial & Economic') {
            tips.push('Interest rates should be entered as decimals (e.g., 0.05 for 5%)');
            tips.push('Ensure time periods match (monthly rate with monthly periods)');
        }

        if (formula.category === 'Budget & Business') {
            tips.push('Compare actual vs budget to track performance');
            tips.push('Use conditional formatting to highlight variances');
        }

        if (formula.excelFormula === 'IF') {
            tips.push('Conditions can use operators: >, <, >=, <=, =, <>');
            tips.push('Nest multiple IF statements for complex logic');
        }

        return tips;
    }

    validateFormulaParams(formulaKey, params) {
        const formula = SpreadsheetFormulaRegistry.getFormula(formulaKey);
        if (!formula) {
            return { valid: false, error: 'Formula not found' };
        }

        const validation = {
            valid: true,
            warnings: [],
            errors: []
        };

        if (params.length < formula.params.length) {
            validation.errors.push(`Expected ${formula.params.length} parameters, got ${params.length}`);
            validation.valid = false;
        }

        params.forEach((param, index) => {
            const paramType = formula.params[index];

            if (typeof param === 'string' && param.includes(':')) {
                const range = this.parseRangeReference(param);
                if (!range.start || !range.end) {
                    validation.errors.push(`Invalid range reference: ${param}`);
                    validation.valid = false;
                }
            }
            else if (typeof param === 'string' && /^[A-Z]+\d+$/.test(param)) {
                const cell = this.parseCellReference(param);
                if (!cell) {
                    validation.errors.push(`Invalid cell reference: ${param}`);
                    validation.valid = false;
                }
            }

            if (formula.category === 'Financial & Economic' && typeof param !== 'string') {
                if (isNaN(parseFloat(param))) {
                    validation.errors.push(`Parameter ${index + 1} must be numeric`);
                    validation.valid = false;
                }
            }
        });

        return validation;
    }

    createFormulaTemplate(formulaKey, description = '') {
        const formula = SpreadsheetFormulaRegistry.getFormula(formulaKey);
        if (!formula) {
            return null;
        }

        return {
            key: formulaKey,
            name: formula.name,
            description: description || formula.description,
            template: formula.example,
            parameters: formula.paramNames.map((name, index) => ({
                name,
                placeholder: `<${name}>`,
                example: this.getParameterExample(formula.params[index])
            })),
            instructions: `Replace placeholders with your cell references or values`,
            example: formula.example
        };
    }

    getParameterExample(paramType) {
        switch (paramType) {
            case 'range':
                return 'A1:A10';
            case 'number':
                return '100';
            case 'rate':
                return '0.05';
            case 'text':
                return '"Sample Text"';
            default:
                return 'value';
        }
    }

    
    countEmptyCells() {
        let count = 0;
        this.data.forEach(row => {
            row.forEach(cell => {
                if (cell === '' || cell === null || cell === undefined) {
                    count++;
                }
            });
        });
        return count;
    }

    calculateStatistics() {
        const stats = {};

        for (let col = 0; col < this.headers.length; col++) {
            const values = [];
            this.data.forEach(row => {
                if (row[col] !== undefined && !isNaN(parseFloat(row[col]))) {
                    values.push(parseFloat(row[col]));
                }
            });

            if (values.length > 0) {
                const sum = values.reduce((a, b) => a + b, 0);
                const avg = sum / values.length;
                const sorted = [...values].sort((a, b) => a - b);

                stats[this.headers[col]] = {
                    count: values.length,
                    sum,
                    average: avg,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    median: sorted[Math.floor(sorted.length / 2)]
                };
            }
        }

        return stats;
    }
}

// ============================================================================
// EXPORT REGISTRIES AND CLASSES
// ============================================================================

export { 
    StereochemistryDiagramsRegistry,
    StereochemistryDiagramRenderer,
    AtomProperties,
    MolecularGeometry,
};

*/
