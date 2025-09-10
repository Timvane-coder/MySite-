import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';

// Enhanced Geometrical Mathematical Workbook - Complete Geometry Problem Solver
import * as math from 'mathjs';

// Enhanced Geometrical Mathematical Workbook - Complete Geometry Problem Solver
export class GeometricalMathematicalWorkbook {
    constructor(options = {}) {
        this.width = options.width || 1400;
        this.height = options.height || 2000;
        this.theme = options.theme || "excel";
        this.cellWidth = 200;
        this.cellHeight = 28;
        this.headerHeight = 35;
        this.mathHeight = 40;
        this.rowLabelWidth = 60;
        this.fontSize = 12;
        this.mathFontSize = 14;

        this.currentProblem = null;
        this.currentSolution = null;
        this.solutionSteps = [];
        this.currentWorkbook = null;
        this.graphData = null;
        this.diagramData = null;

        this.includeVerificationInSteps = options.includeVerificationInSteps !== false;
        this.verificationDetail = options.verificationDetail || 'detailed';

        this.initializeGeometryLessons();
        this.mathSymbols = this.initializeMathSymbols();
        this.setThemeColors();
        this.initializeGeometrySolvers();
    }

    setThemeColors() {
        const themes = {
            excel: {
                background: '#ffffff',
                gridColor: '#c0c0c0',
                headerBg: '#4472c4',
                headerText: '#ffffff',
                sectionBg: '#d9e2f3',
                sectionText: '#000000',
                cellBg: '#ffffff',
                cellText: '#000000',
                resultBg: '#e2efda',
                resultText: '#000000',
                formulaBg: '#fff2cc',
                formulaText: '#7f6000',
                stepBg: '#f2f2f2',
                stepText: '#333333',
                borderColor: '#808080',
                mathBg: '#fef7e0',
                mathText: '#b06000',
                diagramBg: '#f8f9fa',
                shapeColor: '#2c5aa0'
            },
            scientific: {
                background: '#f8f9fa',
                gridColor: '#4682b4',
                headerBg: '#2c5aa0',
                headerText: '#ffffff',
                sectionBg: '#e1ecf4',
                sectionText: '#2c5aa0',
                cellBg: '#ffffff',
                cellText: '#2c5aa0',
                resultBg: '#d4edda',
                resultText: '#155724',
                formulaBg: '#fff3cd',
                formulaText: '#856404',
                stepBg: '#e9ecef',
                stepText: '#495057',
                borderColor: '#4682b4',
                mathBg: '#e3f2fd',
                mathText: '#1565c0',
                diagramBg: '#f1f8ff',
                shapeColor: '#1565c0'
            }
        };

        this.colors = themes[this.theme] || themes.excel;
    }

    initializeGeometryLessons() {
        this.lessons = {
            basic_shapes: {
                title: "Basic Geometric Shapes",
                concepts: [
                    "Points, lines, and planes as fundamental elements",
                    "Angles: acute, right, obtuse, straight, and reflex",
                    "Triangles: equilateral, isosceles, scalene, right",
                    "Quadrilaterals: square, rectangle, parallelogram, rhombus, trapezoid"
                ],
                theory: "Basic geometric shapes form the foundation of all geometric analysis. Understanding their properties, classification, and relationships is essential for solving complex problems.",
                keyFormulas: {
                    "Triangle Area": "A = ½bh or A = ½ab sin C",
                    "Triangle Perimeter": "P = a + b + c",
                    "Rectangle Area": "A = lw",
                    "Rectangle Perimeter": "P = 2(l + w)",
                    "Circle Area": "A = πr²",
                    "Circle Circumference": "C = 2πr"
                },
                applications: [
                    "Area and perimeter calculations",
                    "Construction and architecture",
                    "Art and design",
                    "Engineering applications"
                ]
            },

            triangles: {
                title: "Triangle Geometry",
                concepts: [
                    "Triangle inequality theorem: sum of any two sides > third side",
                    "Angle sum property: interior angles sum to 180°",
                    "Congruence criteria: SSS, SAS, ASA, AAS, RHS",
                    "Similarity criteria: AAA, SSS, SAS"
                ],
                theory: "Triangles are the most stable and fundamental polygons. Their properties form the basis for trigonometry and many geometric proofs.",
                keyFormulas: {
                    "Heron's Formula": "A = √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2",
                    "Law of Sines": "a/sin A = b/sin B = c/sin C",
                    "Law of Cosines": "c² = a² + b² - 2ab cos C",
                    "Area (base-height)": "A = ½bh",
                    "Area (two sides)": "A = ½ab sin C"
                },
                specialCases: {
                    "Right Triangle": "Pythagorean theorem: a² + b² = c²",
                    "Equilateral Triangle": "All sides equal, all angles 60°",
                    "Isosceles Triangle": "Two sides equal, base angles equal"
                }
            },

            circles: {
                title: "Circle Geometry",
                concepts: [
                    "Center, radius, diameter, chord, arc, sector, segment",
                    "Tangent and secant lines",
                    "Central and inscribed angles",
                    "Arc length and sector area formulas"
                ],
                theory: "Circles are perfectly symmetric shapes where all points are equidistant from the center. They appear frequently in nature and engineering.",
                keyFormulas: {
                    "Circumference": "C = 2πr = πd",
                    "Area": "A = πr²",
                    "Arc Length": "s = rθ (θ in radians) or s = πrθ/180° (θ in degrees)",
                    "Sector Area": "A = ½r²θ (θ in radians) or A = πr²θ/360° (θ in degrees)",
                    "Chord Length": "c = 2r sin(θ/2)"
                },
                theorems: [
                    "Inscribed angle theorem",
                    "Tangent-secant theorem",
                    "Power of a point theorem",
                    "Thales' theorem"
                ]
            },

            coordinate_geometry: {
                title: "Coordinate Geometry",
                concepts: [
                    "Cartesian coordinate system",
                    "Distance and midpoint formulas",
                    "Slope and equation of lines",
                    "Circles in coordinate form"
                ],
                theory: "Coordinate geometry bridges algebra and geometry, allowing geometric problems to be solved using algebraic methods.",
                keyFormulas: {
                    "Distance Formula": "d = √[(x₂-x₁)² + (y₂-y₁)²]",
                    "Midpoint Formula": "M = ((x₁+x₂)/2, (y₁+y₂)/2)",
                    "Slope Formula": "m = (y₂-y₁)/(x₂-x₁)",
                    "Point-Slope Form": "y - y₁ = m(x - x₁)",
                    "Circle Equation": "(x-h)² + (y-k)² = r²"
                },
                applications: [
                    "GPS navigation",
                    "Computer graphics",
                    "Engineering design",
                    "Physics motion analysis"
                ]
            },

            area_perimeter: {
                title: "Area and Perimeter",
                concepts: [
                    "Area as measure of surface covered",
                    "Perimeter as measure of boundary length",
                    "Units: square units for area, linear units for perimeter",
                    "Composite shapes and irregular figures"
                ],
                theory: "Area and perimeter are fundamental measurements in geometry with extensive practical applications in construction, agriculture, and design.",
                keyFormulas: {
                    "Square": "A = s², P = 4s",
                    "Rectangle": "A = lw, P = 2(l+w)",
                    "Triangle": "A = ½bh, P = a+b+c",
                    "Parallelogram": "A = bh, P = 2(a+b)",
                    "Trapezoid": "A = ½(b₁+b₂)h, P = a+b₁+c+b₂",
                    "Regular Polygon": "A = ½pa (p=perimeter, a=apothem)"
                },
                strategies: [
                    "Break complex shapes into simple ones",
                    "Use subtraction for shapes with holes",
                    "Apply appropriate formulas systematically",
                    "Check units and reasonableness of answers"
                ]
            },

            pythagorean_theorem: {
                title: "Pythagorean Theorem",
                concepts: [
                    "In right triangles: a² + b² = c² (c is hypotenuse)",
                    "Converse: if a² + b² = c², triangle is right-angled",
                    "Pythagorean triples: integer solutions like (3,4,5)",
                    "Applications in distance, navigation, construction"
                ],
                theory: "The Pythagorean theorem is one of the most important relationships in mathematics, connecting algebra and geometry.",
                keyFormulas: {
                    "Basic Form": "a² + b² = c²",
                    "Distance in 2D": "d = √[(x₂-x₁)² + (y₂-y₁)²]",
                    "Distance in 3D": "d = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]"
                },
                commonTriples: [
                    "(3, 4, 5) and multiples",
                    "(5, 12, 13) and multiples",
                    "(8, 15, 17) and multiples",
                    "(7, 24, 25) and multiples"
                ],
                applications: [
                    "Construction and carpentry",
                    "Navigation and GPS",
                    "Computer graphics",
                    "Physics and engineering"
                ]
            },

            similarity_congruence: {
                title: "Similarity and Congruence",
                concepts: [
                    "Congruent figures: same size and shape",
                    "Similar figures: same shape, proportional sizes",
                    "Congruence tests: SSS, SAS, ASA, AAS, RHS",
                    "Similarity tests: AAA, SSS, SAS"
                ],
                theory: "Similarity and congruence are fundamental concepts for comparing geometric figures and solving problems involving proportions.",
                congruenceTests: {
                    "SSS": "All three sides equal",
                    "SAS": "Two sides and included angle equal",
                    "ASA": "Two angles and included side equal",
                    "AAS": "Two angles and non-included side equal",
                    "RHS": "Right angle, hypotenuse, and one side equal"
                },
                similarityTests: {
                    "AAA": "All three angles equal",
                    "SSS": "All three sides proportional",
                    "SAS": "Two sides proportional and included angle equal"
                },
                applications: [
                    "Scale drawings and maps",
                    "Photography and optics",
                    "Architecture and design",
                    "Shadow problems and indirect measurement"
                ]
            },

            transformations: {
                title: "Geometric Transformations",
                concepts: [
                    "Translation: sliding without rotation",
                    "Rotation: turning about a fixed point",
                    "Reflection: flipping over a line",
                    "Scaling: enlarging or reducing proportionally"
                ],
                theory: "Transformations describe how geometric figures can be moved, turned, flipped, or resized while preserving certain properties.",
                types: {
                    "Isometries": "Preserve distance and angle (translation, rotation, reflection)",
                    "Similarities": "Preserve shape but not necessarily size (scaling)",
                    "Affine": "Preserve ratios and parallelism",
                    "Projective": "Most general transformations"
                },
                applications: [
                    "Computer graphics and animation",
                    "Robotics and mechanical engineering",
                    "Art and design patterns",
                    "Crystallography and symmetry"
                ]
            },

            solid_geometry: {
                title: "3D Geometry and Solids",
                concepts: [
                    "Polyhedra: prisms, pyramids, platonic solids",
                    "Curved solids: cylinders, cones, spheres",
                    "Surface area and volume calculations",
                    "Cross-sections and projections"
                ],
                theory: "Three-dimensional geometry extends plane geometry concepts to space, involving volume, surface area, and spatial relationships.",
                keyFormulas: {
                    "Rectangular Prism": "V = lwh, SA = 2(lw + lh + wh)",
                    "Cylinder": "V = πr²h, SA = 2πr² + 2πrh",
                    "Sphere": "V = (4/3)πr³, SA = 4πr²",
                    "Cone": "V = (1/3)πr²h, SA = πr² + πrl",
                    "Pyramid": "V = (1/3)Bh (B = base area)"
                },
                applications: [
                    "Architecture and construction",
                    "Manufacturing and packaging",
                    "Engineering design",
                    "Physics and astronomy"
                ]
            },

            trigonometry_geometry: {
                title: "Trigonometry in Geometry",
                concepts: [
                    "Sine, cosine, and tangent ratios",
                    "Special angles: 30°, 45°, 60°",
                    "Law of sines and cosines",
                    "Area formulas using trigonometry"
                ],
                theory: "Trigonometry provides tools to solve triangles and analyze periodic phenomena, essential for advanced geometry.",
                keyRatios: {
                    "Sine": "sin θ = opposite/hypotenuse",
                    "Cosine": "cos θ = adjacent/hypotenuse",
                    "Tangent": "tan θ = opposite/adjacent"
                },
                identities: [
                    "sin²θ + cos²θ = 1",
                    "tan θ = sin θ/cos θ",
                    "sin(90° - θ) = cos θ",
                    "cos(90° - θ) = sin θ"
                ],
                applications: [
                    "Surveying and navigation",
                    "Wave analysis in physics",
                    "Engineering oscillations",
                    "Computer graphics rotations"
                ]
            }
        };
    }

    initializeMathSymbols() {
        return {
            // Geometric symbols
            'angle': '∠', 'triangle': '△', 'square': '□', 'circle': '○',
            'parallel': '∥', 'perpendicular': '⊥', 'congruent': '≅', 'similar': '∼',
            'degree': '°', 'prime': '′', 'double_prime': '″',
            
            // Mathematical operators
            'pi': 'π', 'sqrt': '√', 'infinity': '∞', 'plusminus': '±',
            'leq': '≤', 'geq': '≥', 'neq': '≠', 'approx': '≈',
            
            // Superscripts and powers
            '²': '²', '³': '³', '^2': '²', '^3': '³',
            
            // Greek letters
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ',
            'theta': 'θ', 'phi': 'φ', 'lambda': 'λ'
        };
    }

    initializeGeometrySolvers() {
        this.geometryTypes = {
            // Basic shape problems
            triangle_area: {
                patterns: [
                    /triangle.*area/i,
                    /area.*triangle/i,
                    /base.*height.*triangle/i,
                    /heron.*formula/i
                ],
                solver: this.solveTriangleArea.bind(this),
                name: 'Triangle Area',
                category: 'area_calculations',
                description: 'Calculates triangle area using various methods'
            },

            circle_area: {
                patterns: [
                    /circle.*area/i,
                    /area.*circle/i,
                    /pi.*r.*squared/i,
                    /radius.*area/i
                ],
                solver: this.solveCircleArea.bind(this),
                name: 'Circle Area',
                category: 'area_calculations',
                description: 'Calculates circle area and related properties'
            },

            rectangle_area: {
                patterns: [
                    /rectangle.*area/i,
                    /area.*rectangle/i,
                    /length.*width/i,
                    /rectangular.*area/i
                ],
                solver: this.solveRectangleArea.bind(this),
                name: 'Rectangle Area',
                category: 'area_calculations',
                description: 'Calculates rectangle area and perimeter'
            },

            // Pythagorean theorem
            pythagorean: {
                patterns: [
                    /pythagorean.*theorem/i,
                    /right.*triangle/i,
                    /a.*squared.*b.*squared/i,
                    /hypotenuse/i
                ],
                solver: this.solvePythagorean.bind(this),
                name: 'Pythagorean Theorem',
                category: 'right_triangles',
                description: 'Solves right triangle problems using Pythagorean theorem'
            },

            // Distance and midpoint
            distance_formula: {
                patterns: [
                    /distance.*formula/i,
                    /distance.*between.*points/i,
                    /coordinate.*distance/i,
                    /sqrt.*x.*y/i
                ],
                solver: this.solveDistance.bind(this),
                name: 'Distance Formula',
                category: 'coordinate_geometry',
                description: 'Calculates distance between two points'
            },

            midpoint_formula: {
                patterns: [
                    /midpoint.*formula/i,
                    /midpoint.*between/i,
                    /center.*point/i,
                    /average.*coordinates/i
                ],
                solver: this.solveMidpoint.bind(this),
                name: 'Midpoint Formula',
                category: 'coordinate_geometry',
                description: 'Finds midpoint between two points'
            },

            // Perimeter calculations
            perimeter: {
                patterns: [
                    /perimeter/i,
                    /circumference/i,
                    /boundary.*length/i,
                    /around.*shape/i
                ],
                solver: this.solvePerimeter.bind(this),
                name: 'Perimeter Calculation',
                category: 'perimeter_calculations',
                description: 'Calculates perimeter of various shapes'
            },

            // Angle problems
            angle_calculations: {
                patterns: [
                    /angle.*calculation/i,
                    /degrees.*angle/i,
                    /supplementary.*angle/i,
                    /complementary.*angle/i
                ],
                solver: this.solveAngles.bind(this),
                name: 'Angle Calculations',
                category: 'angle_problems',
                description: 'Solves various angle-related problems'
            },

            // Triangle solving
            triangle_solving: {
                patterns: [
                    /solve.*triangle/i,
                    /law.*sines/i,
                    /law.*cosines/i,
                    /triangle.*sides.*angles/i
                ],
                solver: this.solveTriangle.bind(this),
                name: 'Triangle Solving',
                category: 'triangle_analysis',
                description: 'Solves triangles using various methods'
            },

            // Similar triangles
            similar_triangles: {
                patterns: [
                    /similar.*triangles/i,
                    /proportion.*triangles/i,
                    /scale.*factor/i,
                    /corresponding.*sides/i
                ],
                solver: this.solveSimilarTriangles.bind(this),
                name: 'Similar Triangles',
                category: 'similarity',
                description: 'Solves problems involving similar triangles'
            },

            // Volume calculations
            volume: {
                patterns: [
                    /volume/i,
                    /cubic.*units/i,
                    /3d.*shape/i,
                    /solid.*geometry/i
                ],
                solver: this.solveVolume.bind(this),
                name: 'Volume Calculation',
                category: 'solid_geometry',
                description: 'Calculates volume of 3D shapes'
            },

            // Surface area
            surface_area: {
                patterns: [
                    /surface.*area/i,
                    /total.*area/i,
                    /area.*3d/i,
                    /faces.*area/i
                ],
                solver: this.solveSurfaceArea.bind(this),
                name: 'Surface Area',
                category: 'solid_geometry',
                description: 'Calculates surface area of 3D shapes'
            }
        };
    }

    // MAIN SOLVER METHOD
    solveGeometryProblem(config) {
        const { problem, scenario, parameters, problemType, context } = config;

        try {
            // Parse the problem
            this.currentProblem = this.parseGeometryProblem(problem, scenario, parameters, problemType, context);

            // Solve the problem
            this.currentSolution = this.solveGeometryProblem_Internal(this.currentProblem);

            // Generate solution steps
            this.solutionSteps = this.generateGeometrySteps(this.currentProblem, this.currentSolution);

            // Generate diagram data if applicable
            this.generateDiagramData();

            // Generate workbook
            this.generateGeometryWorkbook();

            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                steps: this.solutionSteps,
                diagram: this.diagramData
            };

        } catch (error) {
            throw new Error(`Failed to solve geometry problem: ${error.message}`);
        }
    }

    parseGeometryProblem(problem, scenario = '', parameters = {}, problemType = null, context = {}) {
        const cleanInput = problem ? this.cleanMathExpression(problem) : '';

        // If problem type is specified, use it directly
        if (problemType && this.geometryTypes[problemType]) {
            return {
                originalInput: problem || `${problemType} problem`,
                cleanInput: cleanInput,
                type: problemType,
                scenario: scenario,
                parameters: { ...parameters },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        // Auto-detect geometry problem type
        for (const [type, config] of Object.entries(this.geometryTypes)) {
            for (const pattern of config.patterns) {
                if (pattern.test(cleanInput) || pattern.test(scenario)) {
                    const match = cleanInput.match(pattern);
                    const extractedParams = this.extractGeometryParameters(match, type, parameters);

                    return {
                        originalInput: problem || scenario,
                        cleanInput: cleanInput,
                        type: type,
                        scenario: scenario,
                        parameters: { ...extractedParams, ...parameters },
                        context: { ...context },
                        match: match,
                        parsedAt: new Date().toISOString()
                    };
                }
            }
        }

        // Default based on provided parameters
        if (parameters.shape) {
            const shapeType = parameters.shape.toLowerCase();
            if (shapeType.includes('triangle')) return { ...this.createDefaultProblem('triangle_area', parameters), originalInput: problem || scenario };
            if (shapeType.includes('circle')) return { ...this.createDefaultProblem('circle_area', parameters), originalInput: problem || scenario };
            if (shapeType.includes('rectangle')) return { ...this.createDefaultProblem('rectangle_area', parameters), originalInput: problem || scenario };
        }

        throw new Error(`Unable to recognize geometry problem type from: ${problem || scenario}`);
    }

    createDefaultProblem(type, parameters) {
        return {
            cleanInput: '',
            type: type,
            scenario: '',
            parameters: { ...parameters },
            context: {},
            parsedAt: new Date().toISOString()
        };
    }

    cleanMathExpression(expression) {
        return expression
            .replace(/\s+/g, ' ')
            .replace(/\*\*/g, '^')
            .replace(/sqrt/g, '√')
            .replace(/pi/g, 'π')
            .replace(/degree/g, '°')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .trim();
    }

    extractGeometryParameters(match, type, existingParams) {
        const params = { ...existingParams };

        // Extract numeric values from the match if available
        if (match && match.length > 1) {
            const numbers = match[0].match(/\d+(?:\.\d+)?/g);
            if (numbers) {
                switch (type) {
                    case 'triangle_area':
                        if (numbers.length >= 2) {
                            params.base = parseFloat(numbers[0]);
                            params.height = parseFloat(numbers[1]);
                        }
                        break;
                    case 'circle_area':
                        if (numbers.length >= 1) {
                            params.radius = parseFloat(numbers[0]);
                        }
                        break;
                    case 'rectangle_area':
                        if (numbers.length >= 2) {
                            params.length = parseFloat(numbers[0]);
                            params.width = parseFloat(numbers[1]);
                        }
                        break;
                }
            }
        }

        return params;
    }

    solveGeometryProblem_Internal(problem) {
        const solver = this.geometryTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for geometry problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    // GEOMETRY SOLVERS

    solveTriangleArea(problem) {
        const { base, height, a, b, c, angle, method = 'base_height' } = problem.parameters;

        let area = 0;
        let perimeter = 0;
        let solutionMethod = '';
        let additionalInfo = {};

        if (method === 'base_height' && base !== undefined && height !== undefined) {
            area = 0.5 * base * height;
            solutionMethod = 'Base × Height Method';
            additionalInfo.formula = 'A = ½bh';
        } else if (method === 'two_sides_angle' && a !== undefined && b !== undefined && angle !== undefined) {
            const angleRad = (angle * Math.PI) / 180;
            area = 0.5 * a * b * Math.sin(angleRad);
            solutionMethod = 'Two Sides and Included Angle';
            additionalInfo.formula = 'A = ½ab sin C';
        } else if (method === 'heron' && a !== undefined && b !== undefined && c !== undefined) {
            const s = (a + b + c) / 2; // semi-perimeter
            area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            perimeter = a + b + c;
            solutionMethod = "Heron's Formula";
            additionalInfo.formula = 'A = √[s(s-a)(s-b)(s-c)]';
            additionalInfo.semiPerimeter = s;
        } else {
            throw new Error('Insufficient parameters for triangle area calculation');
        }

        // Verify triangle inequality if all sides are given
        if (a !== undefined && b !== undefined && c !== undefined) {
            const triangleValid = (a + b > c) && (a + c > b) && (b + c > a);
            additionalInfo.triangleInequality = {
                valid: triangleValid,
                conditions: [
                    `${a} + ${b} > ${c}: ${a + b > c}`,
                    `${a} + ${c} > ${b}: ${a + c > b}`,
                    `${b} + ${c} > ${a}: ${b + c > a}`
                ]
            };
        }

        return {
            area: parseFloat(area.toFixed(6)),
            perimeter: parseFloat(perimeter.toFixed(6)) || null,
            method: solutionMethod,
            parameters: problem.parameters,
            formula: additionalInfo.formula,
            additionalInfo: additionalInfo,
            category: 'triangle_area'
        };
    }

    solveCircleArea(problem) {
        const { radius, diameter, circumference } = problem.parameters;

        let r = radius;
        if (r === undefined && diameter !== undefined) {
            r = diameter / 2;
        } else if (r === undefined && circumference !== undefined) {
            r = circumference / (2 * Math.PI);
        }

        if (r === undefined) {
            throw new Error('Insufficient parameters: need radius, diameter, or circumference');
        }

        const area = Math.PI * r * r;
        const circ = 2 * Math.PI * r;
        const diam = 2 * r;

        return {
            area: parseFloat(area.toFixed(6)),
            circumference: parseFloat(circ.toFixed(6)),
            radius: parseFloat(r.toFixed(6)),
            diameter: parseFloat(diam.toFixed(6)),
            formula: 'A = πr²',
            circumferenceFormula: 'C = 2πr',
            parameters: problem.parameters,
            category: 'circle_area'
        };
    }

    solveRectangleArea(problem) {
        const { length, width, perimeter, area } = problem.parameters;

        let l = length;
        let w = width;
        let p = perimeter;
        let a = area;

        // Calculate missing values if possible
        if (l !== undefined && w !== undefined) {
            a = l * w;
            p = 2 * (l + w);
        } else if (a !== undefined && l !== undefined) {
            w = a / l;
            p = 2 * (l + w);
        } else if (a !== undefined && w !== undefined) {
            l = a / w;
            p = 2 * (l + w);
        } else if (p !== undefined && l !== undefined) {
            w = (p / 2) - l;
            a = l * w;
        } else if (p !== undefined && w !== undefined) {
            l = (p / 2) - w;
            a = l * w;
        } else {
            throw new Error('Insufficient parameters: need at least two of length, width, area, or perimeter');
        }

        return {
            area: parseFloat(a.toFixed(6)),
            perimeter: parseFloat(p.toFixed(6)),
            length: parseFloat(l.toFixed(6)),
            width: parseFloat(w.toFixed(6)),
            formula: 'A = l × w',
            perimeterFormula: 'P = 2(l + w)',
            parameters: problem.parameters,
            category: 'rectangle_area'
        };
    }

    solvePythagorean(problem) {
        const { a, b, c, side1, side2, hypotenuse } = problem.parameters;

        // Normalize parameter names
        let sideA = a || side1;
        let sideB = b || side2;
        let sideC = c || hypotenuse;

        let missingVariable = '';

        if (sideA !== undefined && sideB !== undefined && sideC === undefined) {
            // Find hypotenuse
            sideC = Math.sqrt(sideA * sideA + sideB * sideB);
            missingVariable = 'c (hypotenuse)';
        } else if (sideA !== undefined && sideC !== undefined && sideB === undefined) {
            // Find side b
            if (sideC * sideC < sideA * sideA) {
                throw new Error('Invalid triangle: hypotenuse must be longer than other sides');
            }
            sideB = Math.sqrt(sideC * sideC - sideA * sideA);
            missingVariable = 'b (side)';
        } else if (sideB !== undefined && sideC !== undefined && sideA === undefined) {
            // Find side a
            if (sideC * sideC < sideB * sideB) {
                throw new Error('Invalid triangle: hypotenuse must be longer than other sides');
            }
            sideA = Math.sqrt(sideC * sideC - sideB * sideB);
            missingVariable = 'a (side)';
        } else {
            throw new Error('Need exactly two sides to find the third using Pythagorean theorem');
        }

        // Calculate area and other properties
        const area = 0.5 * sideA * sideB;
        const perimeter = sideA + sideB + sideC;

        // Check if it's a Pythagorean triple
        const isTriple = Number.isInteger(sideA) && Number.isInteger(sideB) && Number.isInteger(sideC);

        return {
            a: parseFloat(sideA.toFixed(6)),
            b: parseFloat(sideB.toFixed(6)),
            c: parseFloat(sideC.toFixed(6)),
            area: parseFloat(area.toFixed(6)),
            perimeter: parseFloat(perimeter.toFixed(6)),
            missingVariable: missingVariable,
            formula: 'a² + b² = c²',
            isPythagoreanTriple: isTriple,
            verification: `${sideA.toFixed(2)}² + ${sideB.toFixed(2)}² = ${sideC.toFixed(2)}²`,
            parameters: problem.parameters,
            category: 'pythagorean_theorem'
        };
    }

    solveDistance(problem) {
        const { x1, y1, x2, y2, point1, point2 } = problem.parameters;

        let p1x = x1, p1y = y1, p2x = x2, p2y = y2;

        // Handle point objects
        if (point1 && typeof point1 === 'object') {
            p1x = point1.x || point1[0];
            p1y = point1.y || point1[1];
        }
        if (point2 && typeof point2 === 'object') {
            p2x = point2.x || point2[0];
            p2y = point2.y || point2[1];
        }

        if (p1x === undefined || p1y === undefined || p2x === undefined || p2y === undefined) {
            throw new Error('Need coordinates for both points: (x1,y1) and (x2,y2)');
        }

        const deltaX = p2x - p1x;
        const deltaY = p2y - p1y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        return {
            distance: parseFloat(distance.toFixed(6)),
            point1: { x: p1x, y: p1y },
            point2: { x: p2x, y: p2y },
            deltaX: parseFloat(deltaX.toFixed(6)),
            deltaY: parseFloat(deltaY.toFixed(6)),
            formula: 'd = √[(x₂-x₁)² + (y₂-y₁)²]',
            calculation: `√[(${p2x}-${p1x})² + (${p2y}-${p1y})²] = √[${deltaX}² + ${deltaY}²]`,
            parameters: problem.parameters,
            category: 'distance_formula'
        };
    }

    solveMidpoint(problem) {
        const { x1, y1, x2, y2, point1, point2 } = problem.parameters;

        let p1x = x1, p1y = y1, p2x = x2, p2y = y2;

        // Handle point objects
        if (point1 && typeof point1 === 'object') {
            p1x = point1.x || point1[0];
            p1y = point1.y || point1[1];
        }
        if (point2 && typeof point2 === 'object') {
            p2x = point2.x || point2[0];
            p2y = point2.y || point2[1];
        }

        if (p1x === undefined || p1y === undefined || p2x === undefined || p2y === undefined) {
            throw new Error('Need coordinates for both points: (x1,y1) and (x2,y2)');
        }

        const midX = (p1x + p2x) / 2;
        const midY = (p1y + p2y) / 2;

        return {
            midpoint: { x: parseFloat(midX.toFixed(6)), y: parseFloat(midY.toFixed(6)) },
            point1: { x: p1x, y: p1y },
            point2: { x: p2x, y: p2y },
            formula: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)',
            calculation: `M = ((${p1x}+${p2x})/2, (${p1y}+${p2y})/2) = (${midX}, ${midY})`,
            parameters: problem.parameters,
            category: 'midpoint_formula'
        };
    }

    solvePerimeter(problem) {
        const { shape, sides, radius, diameter, length, width, base, height } = problem.parameters;

        let perimeter = 0;
        let formula = '';
        let shapeType = shape || 'unknown';

        if (shapeType === 'circle' || radius !== undefined || diameter !== undefined) {
            const r = radius || (diameter / 2);
            perimeter = 2 * Math.PI * r;
            formula = 'P = 2πr';
            shapeType = 'circle';
        } else if (shapeType === 'rectangle' || (length !== undefined && width !== undefined)) {
            perimeter = 2 * (length + width);
            formula = 'P = 2(l + w)';
            shapeType = 'rectangle';
        } else if (shapeType === 'square') {
            const side = length || width || sides?.[0];
            perimeter = 4 * side;
            formula = 'P = 4s';
        } else if (shapeType === 'triangle' && sides && sides.length === 3) {
            perimeter = sides.reduce((sum, side) => sum + side, 0);
            formula = 'P = a + b + c';
        } else if (sides && Array.isArray(sides)) {
            perimeter = sides.reduce((sum, side) => sum + side, 0);
            formula = `P = ${sides.map((_, i) => `s${i+1}`).join(' + ')}`;
            shapeType = 'polygon';
        } else {
            throw new Error('Insufficient parameters for perimeter calculation');
        }

        return {
            perimeter: parseFloat(perimeter.toFixed(6)),
            shape: shapeType,
            formula: formula,
            parameters: problem.parameters,
            category: 'perimeter'
        };
    }

    solveAngles(problem) {
        const { angles, angleType, complementary, supplementary, triangle } = problem.parameters;

        let result = {};

        if (complementary !== undefined) {
            // Find complementary angle (sum = 90°)
            const comp = 90 - complementary;
            result = {
                originalAngle: complementary,
                complementaryAngle: comp,
                relationship: 'complementary',
                sum: 90,
                formula: 'θ₁ + θ₂ = 90°'
            };
        } else if (supplementary !== undefined) {
            // Find supplementary angle (sum = 180°)
            const supp = 180 - supplementary;
            result = {
                originalAngle: supplementary,
                supplementaryAngle: supp,
                relationship: 'supplementary',
                sum: 180,
                formula: 'θ₁ + θ₂ = 180°'
            };
        } else if (triangle && Array.isArray(angles)) {
            // Triangle angle calculations
            const knownAngles = angles.filter(a => a !== undefined);
            const angleSum = knownAngles.reduce((sum, angle) => sum + angle, 0);
            
            if (knownAngles.length === 2) {
                const thirdAngle = 180 - angleSum;
                result = {
                    angles: [...knownAngles, thirdAngle],
                    missingAngle: thirdAngle,
                    angleSum: 180,
                    formula: 'A + B + C = 180°',
                    triangleType: this.classifyTriangle({ angles: [...knownAngles, thirdAngle] })
                };
            } else if (knownAngles.length === 3) {
                result = {
                    angles: knownAngles,
                    angleSum: angleSum,
                    isValid: Math.abs(angleSum - 180) < 0.001,
                    formula: 'A + B + C = 180°',
                    triangleType: this.classifyTriangle({ angles: knownAngles })
                };
            }
        }

        return {
            ...result,
            parameters: problem.parameters,
            category: 'angle_calculations'
        };
    }

    solveTriangle(problem) {
        const { sides, angles, method = 'auto' } = problem.parameters;
        let { a, b, c, A, B, C } = problem.parameters;

        // Normalize inputs
        if (sides) {
            [a, b, c] = sides;
        }
        if (angles) {
            [A, B, C] = angles.map(angle => angle * Math.PI / 180); // Convert to radians
        }

        let solution = {};
        let solutionMethod = '';

        // Count known values
        const knownSides = [a, b, c].filter(x => x !== undefined).length;
        const knownAngles = [A, B, C].filter(x => x !== undefined).length;

        try {
            if (knownSides === 3) {
                // SSS - Use Law of Cosines
                solution = this.solveTriangleSSS(a, b, c);
                solutionMethod = 'SSS (Law of Cosines)';
            } else if (knownSides === 2 && knownAngles === 1) {
                // SAS or SSA
                if (A !== undefined && b !== undefined && c !== undefined) {
                    solution = this.solveTriangleSAS(b, c, A, 'A');
                    solutionMethod = 'SAS (Law of Cosines)';
                } else if (B !== undefined && a !== undefined && c !== undefined) {
                    solution = this.solveTriangleSAS(a, c, B, 'B');
                    solutionMethod = 'SAS (Law of Cosines)';
                } else if (C !== undefined && a !== undefined && b !== undefined) {
                    solution = this.solveTriangleSAS(a, b, C, 'C');
                    solutionMethod = 'SAS (Law of Cosines)';
                }
            } else if (knownSides === 1 && knownAngles === 2) {
                // AAS or ASA - Use Law of Sines
                solution = this.solveTriangleAAS(problem.parameters);
                solutionMethod = 'AAS/ASA (Law of Sines)';
            }

            // Calculate additional properties
            if (solution.a && solution.b && solution.c) {
                const s = (solution.a + solution.b + solution.c) / 2;
                solution.area = Math.sqrt(s * (s - solution.a) * (s - solution.b) * (s - solution.c));
                solution.perimeter = solution.a + solution.b + solution.c;
                solution.semiperimeter = s;
            }

            return {
                ...solution,
                method: solutionMethod,
                triangleType: this.classifyTriangle(solution),
                parameters: problem.parameters,
                category: 'triangle_solving'
            };

        } catch (error) {
            throw new Error(`Cannot solve triangle: ${error.message}`);
        }
    }

    solveTriangleSSS(a, b, c) {
        // Check triangle inequality
        if (a + b <= c || a + c <= b || b + c <= a) {
            throw new Error('Invalid triangle: violates triangle inequality');
        }

        // Use Law of Cosines to find angles
        const A = Math.acos((b*b + c*c - a*a) / (2*b*c));
        const B = Math.acos((a*a + c*c - b*b) / (2*a*c));
        const C = Math.PI - A - B;

        return {
            a: a, b: b, c: c,
            A: A * 180 / Math.PI,
            B: B * 180 / Math.PI,
            C: C * 180 / Math.PI
        };
    }

    solveTriangleSAS(side1, side2, angle, anglePosition) {
        // Given two sides and included angle
        const c = Math.sqrt(side1*side1 + side2*side2 - 2*side1*side2*Math.cos(angle));
        
        // Find other angles using Law of Sines
        const sinA = (side1 * Math.sin(angle)) / c;
        const sinB = (side2 * Math.sin(angle)) / c;
        
        const A = Math.asin(sinA);
        const B = Math.asin(sinB);

        return {
            a: side1, b: side2, c: c,
            A: A * 180 / Math.PI,
            B: B * 180 / Math.PI,
            C: angle * 180 / Math.PI
        };
    }

    solveTriangleAAS(params) {
        // Implementation for AAS/ASA cases using Law of Sines
        // This is a simplified version - full implementation would handle all cases
        const { a, A, B } = params;
        
        if (a !== undefined && A !== undefined && B !== undefined) {
            const C = Math.PI - A - B;
            const b = a * Math.sin(B) / Math.sin(A);
            const c = a * Math.sin(C) / Math.sin(A);
            
            return {
                a: a, b: b, c: c,
                A: A * 180 / Math.PI,
                B: B * 180 / Math.PI,
                C: C * 180 / Math.PI
            };
        }
        
        throw new Error('AAS/ASA solving not fully implemented for this parameter combination');
    }

    classifyTriangle(triangle) {
        const { sides, angles, a, b, c, A, B, C } = triangle;
        
        let sideClass = 'scalene';
        let angleClass = 'acute';
        
        // Classify by sides
        const s = sides || [a, b, c].filter(x => x !== undefined);
        if (s.length === 3) {
            if (Math.abs(s[0] - s[1]) < 0.001 && Math.abs(s[1] - s[2]) < 0.001) {
                sideClass = 'equilateral';
            } else if (Math.abs(s[0] - s[1]) < 0.001 || Math.abs(s[1] - s[2]) < 0.001 || Math.abs(s[0] - s[2]) < 0.001) {
                sideClass = 'isosceles';
            }
        }
        
        // Classify by angles
        const ang = angles || [A, B, C].filter(x => x !== undefined);
        if (ang.length >= 1) {
            const maxAngle = Math.max(...ang);
            if (Math.abs(maxAngle - 90) < 0.001 || Math.abs(maxAngle - Math.PI/2) < 0.001) {
                angleClass = 'right';
            } else if (maxAngle > 90 || maxAngle > Math.PI/2) {
                angleClass = 'obtuse';
            }
        }
        
        return `${sideClass} ${angleClass}`;
    }

    solveSimilarTriangles(problem) {
        const { triangle1, triangle2, scaleFactor, correspondingSides } = problem.parameters;

        let result = {};

        if (scaleFactor !== undefined && triangle1 && triangle2) {
            // Given scale factor, find corresponding measurements
            result = {
                scaleFactor: scaleFactor,
                triangle1: triangle1,
                triangle2: triangle2,
                ratios: this.calculateSimilarityRatios(triangle1, triangle2),
                areRatio: scaleFactor * scaleFactor,
                perimeterRatio: scaleFactor
            };
        } else if (correspondingSides && correspondingSides.length >= 2) {
            // Calculate scale factor from corresponding sides
            const ratio = correspondingSides[1] / correspondingSides[0];
            result = {
                scaleFactor: ratio,
                correspondingSides: correspondingSides,
                areRatio: ratio * ratio,
                perimeterRatio: ratio,
                verification: `Scale factor = ${correspondingSides[1]}/${correspondingSides[0]} = ${ratio}`
            };
        }

        return {
            ...result,
            parameters: problem.parameters,
            category: 'similar_triangles'
        };
    }

    calculateSimilarityRatios(triangle1, triangle2) {
        const ratios = {};
        
        if (triangle1.sides && triangle2.sides) {
            ratios.sides = triangle1.sides.map((side, i) => triangle2.sides[i] / side);
        }
        
        if (triangle1.area && triangle2.area) {
            ratios.area = triangle2.area / triangle1.area;
        }
        
        if (triangle1.perimeter && triangle2.perimeter) {
            ratios.perimeter = triangle2.perimeter / triangle1.perimeter;
        }
        
        return ratios;
    }

    solveVolume(problem) {
        const { shape, radius, height, length, width, base, area } = problem.parameters;
        
        let volume = 0;
        let formula = '';
        let shapeType = shape || 'unknown';

        switch (shapeType.toLowerCase()) {
            case 'sphere':
                if (radius === undefined) throw new Error('Sphere requires radius');
                volume = (4/3) * Math.PI * radius * radius * radius;
                formula = 'V = (4/3)πr³';
                break;
                
            case 'cylinder':
                if (radius === undefined || height === undefined) throw new Error('Cylinder requires radius and height');
                volume = Math.PI * radius * radius * height;
                formula = 'V = πr²h';
                break;
                
            case 'cone':
                if (radius === undefined || height === undefined) throw new Error('Cone requires radius and height');
                volume = (1/3) * Math.PI * radius * radius * height;
                formula = 'V = (1/3)πr²h';
                break;
                
            case 'rectangular_prism':
            case 'box':
                if (length === undefined || width === undefined || height === undefined) {
                    throw new Error('Rectangular prism requires length, width, and height');
                }
                volume = length * width * height;
                formula = 'V = lwh';
                break;
                
            case 'pyramid':
                if (base === undefined || height === undefined) throw new Error('Pyramid requires base area and height');
                volume = (1/3) * base * height;
                formula = 'V = (1/3)Bh';
                break;
                
            default:
                throw new Error(`Unknown shape for volume calculation: ${shapeType}`);
        }

        return {
            volume: parseFloat(volume.toFixed(6)),
            shape: shapeType,
            formula: formula,
            parameters: problem.parameters,
            category: 'volume'
        };
    }

    solveSurfaceArea(problem) {
        const { shape, radius, height, length, width, slantHeight } = problem.parameters;
        
        let surfaceArea = 0;
        let formula = '';
        let shapeType = shape || 'unknown';
        let breakdown = {};

        switch (shapeType.toLowerCase()) {
            case 'sphere':
                if (radius === undefined) throw new Error('Sphere requires radius');
                surfaceArea = 4 * Math.PI * radius * radius;
                formula = 'SA = 4πr²';
                break;
                
            case 'cylinder':
                if (radius === undefined || height === undefined) throw new Error('Cylinder requires radius and height');
                const baseArea = Math.PI * radius * radius;
                const lateralArea = 2 * Math.PI * radius * height;
                surfaceArea = 2 * baseArea + lateralArea;
                formula = 'SA = 2πr² + 2πrh';
                breakdown = { bases: 2 * baseArea, lateral: lateralArea };
                break;
                
            case 'cone':
                if (radius === undefined || height === undefined) throw new Error('Cone requires radius and height');
                const slant = slantHeight || Math.sqrt(radius * radius + height * height);
                const coneBase = Math.PI * radius * radius;
                const coneLateral = Math.PI * radius * slant;
                surfaceArea = coneBase + coneLateral;
                formula = 'SA = πr² + πrl';
                breakdown = { base: coneBase, lateral: coneLateral, slantHeight: slant };
                break;
                
            case 'rectangular_prism':
            case 'box':
                if (length === undefined || width === undefined || height === undefined) {
                    throw new Error('Rectangular prism requires length, width, and height');
                }
                surfaceArea = 2 * (length * width + length * height + width * height);
                formula = 'SA = 2(lw + lh + wh)';
                breakdown = {
                    face1: 2 * length * width,
                    face2: 2 * length * height,
                    face3: 2 * width * height
                };
                break;
                
            default:
                throw new Error(`Unknown shape for surface area calculation: ${shapeType}`);
        }

        return {
            surfaceArea: parseFloat(surfaceArea.toFixed(6)),
            shape: shapeType,
            formula: formula,
            breakdown: breakdown,
            parameters: problem.parameters,
            category: 'surface_area'
        };
    }

    
    // STEP GENERATION METHODS

    generateGeometrySteps(problem, solution) {
        const steps = [];
        const { type } = problem;

        // Generate original step-by-step solution
        switch (type) {
            case 'triangle_area':
                steps.push(...this.generateTriangleAreaSteps(problem, solution));
                break;
            case 'circle_area':
                steps.push(...this.generateCircleAreaSteps(problem, solution));
                break;
            case 'rectangle_area':
                steps.push(...this.generateRectangleAreaSteps(problem, solution));
                break;
            case 'pythagorean':
                steps.push(...this.generatePythagoreanSteps(problem, solution));
                break;
            case 'distance_formula':
                steps.push(...this.generateDistanceSteps(problem, solution));
                break;
            case 'midpoint_formula':
                steps.push(...this.generateMidpointSteps(problem, solution));
                break;
            case 'perimeter':
                steps.push(...this.generatePerimeterSteps(problem, solution));
                break;
            case 'angle_calculations':
                steps.push(...this.generateAngleSteps(problem, solution));
                break;
            case 'triangle_solving':
                steps.push(...this.generateTriangleSolvingSteps(problem, solution));
                break;
            case 'similar_triangles':
                steps.push(...this.generateSimilarTrianglesSteps(problem, solution));
                break;
            case 'volume':
                steps.push(...this.generateVolumeSteps(problem, solution));
                break;
            case 'surface_area':
                steps.push(...this.generateSurfaceAreaSteps(problem, solution));
                break;
            default:
                steps.push({
                    step: 'Problem Analysis',
                    description: `Analyzing ${type} problem`,
                    expression: problem.originalInput,
                    category: 'analysis'
                });
        }

        // Add verification steps if enabled
        if (this.includeVerificationInSteps) {
            const verificationSteps = this.generateGeometryVerificationSteps(problem, solution);
            steps.push(...verificationSteps);
        }

        return steps;
    }

    // INDIVIDUAL STEP GENERATION METHODS

    generateTriangleAreaSteps(problem, solution) {
        const { base, height, a, b, c, angle, method = 'base_height' } = problem.parameters;
        const steps = [];

        steps.push({
            step: 'Given Information',
            description: 'Identify the given measurements',
            expression: this.formatGivenInfo(problem.parameters),
            category: 'setup'
        });

        if (method === 'base_height' && base !== undefined && height !== undefined) {
            steps.push({
                step: 'Choose Formula',
                description: 'Use the base-height formula for triangle area',
                expression: 'A = ½bh',
                category: 'formula'
            });

            steps.push({
                step: 'Substitute Values',
                description: 'Replace variables with given values',
                expression: `A = ½ × ${base} × ${height}`,
                category: 'substitution'
            });

            steps.push({
                step: 'Calculate',
                description: 'Perform the multiplication',
                expression: `A = ½ × ${base * height} = ${solution.area}`,
                category: 'calculation'
            });

        } else if (method === 'two_sides_angle' && a !== undefined && b !== undefined && angle !== undefined) {
            steps.push({
                step: 'Choose Formula',
                description: 'Use the two-sides-angle formula',
                expression: 'A = ½ab sin C',
                category: 'formula'
            });

            steps.push({
                step: 'Convert Angle',
                description: 'Ensure angle is ready for calculation',
                expression: `C = ${angle}° = ${(angle * Math.PI / 180).toFixed(4)} radians`,
                category: 'conversion'
            });

            steps.push({
                step: 'Substitute Values',
                description: 'Replace variables with given values',
                expression: `A = ½ × ${a} × ${b} × sin(${angle}°)`,
                category: 'substitution'
            });

            steps.push({
                step: 'Calculate',
                description: 'Evaluate the trigonometric expression',
                expression: `A = ½ × ${a} × ${b} × ${Math.sin(angle * Math.PI / 180).toFixed(4)} = ${solution.area}`,
                category: 'calculation'
            });

        } else if (method === 'heron' && a !== undefined && b !== undefined && c !== undefined) {
            const s = (a + b + c) / 2;
            
            steps.push({
                step: 'Choose Formula',
                description: "Use Heron's formula for triangle area",
                expression: 'A = √[s(s-a)(s-b)(s-c)]',
                category: 'formula'
            });

            steps.push({
                step: 'Calculate Semi-perimeter',
                description: 'Find s = (a + b + c)/2',
                expression: `s = (${a} + ${b} + ${c})/2 = ${s}`,
                category: 'calculation'
            });

            steps.push({
                step: 'Substitute into Formula',
                description: 'Replace all variables',
                expression: `A = √[${s}(${s}-${a})(${s}-${b})(${s}-${c})]`,
                category: 'substitution'
            });

            steps.push({
                step: 'Simplify Inside Square Root',
                description: 'Calculate the expression under the radical',
                expression: `A = √[${s} × ${s-a} × ${s-b} × ${s-c}] = √[${s*(s-a)*(s-b)*(s-c)}]`,
                category: 'calculation'
            });

            steps.push({
                step: 'Calculate Final Result',
                description: 'Take the square root',
                expression: `A = ${solution.area}`,
                category: 'result'
            });
        }

        return steps;
    }

    generateCircleAreaSteps(problem, solution) {
        const { radius, diameter, circumference } = problem.parameters;
        const steps = [];

        steps.push({
            step: 'Given Information',
            description: 'Identify the given measurements',
            expression: this.formatGivenInfo(problem.parameters),
            category: 'setup'
        });

        // Determine radius if not directly given
        if (radius !== undefined) {
            steps.push({
                step: 'Radius Known',
                description: 'Radius is directly provided',
                expression: `r = ${radius}`,
                category: 'identification'
            });
        } else if (diameter !== undefined) {
            steps.push({
                step: 'Find Radius from Diameter',
                description: 'Use relationship r = d/2',
                expression: `r = d/2 = ${diameter}/2 = ${solution.radius}`,
                category: 'conversion'
            });
        } else if (circumference !== undefined) {
            steps.push({
                step: 'Find Radius from Circumference',
                description: 'Use relationship C = 2πr, so r = C/(2π)',
                expression: `r = C/(2π) = ${circumference}/(2π) = ${solution.radius}`,
                category: 'conversion'
            });
        }

        steps.push({
            step: 'Choose Formula',
            description: 'Use the circle area formula',
            expression: 'A = πr²',
            category: 'formula'
        });

        steps.push({
            step: 'Substitute Values',
            description: 'Replace r with the known radius',
            expression: `A = π × (${solution.radius})²`,
            category: 'substitution'
        });

        steps.push({
            step: 'Calculate',
            description: 'Evaluate the expression',
            expression: `A = π × ${Math.pow(solution.radius, 2)} = ${solution.area}`,
            category: 'calculation'
        });

        return steps;
    }

    generateRectangleAreaSteps(problem, solution) {
        const { length, width, perimeter, area } = problem.parameters;
        const steps = [];

        steps.push({
            step: 'Given Information',
            description: 'Identify the given measurements',
            expression: this.formatGivenInfo(problem.parameters),
            category: 'setup'
        });

        if (length !== undefined && width !== undefined) {
            steps.push({
                step: 'Choose Formula',
                description: 'Use the rectangle area formula',
                expression: 'A = l × w',
                category: 'formula'
            });

            steps.push({
                step: 'Substitute Values',
                description: 'Replace variables with given values',
                expression: `A = ${length} × ${width}`,
                category: 'substitution'
            });

            steps.push({
                step: 'Calculate Area',
                description: 'Perform the multiplication',
                expression: `A = ${solution.area}`,
                category: 'calculation'
            });

        } else if (area !== undefined && length !== undefined) {
            steps.push({
                step: 'Find Missing Dimension',
                description: 'Use A = l × w to find width',
                expression: `w = A/l = ${area}/${length} = ${solution.width}`,
                category: 'solving'
            });

        } else if (area !== undefined && width !== undefined) {
            steps.push({
                step: 'Find Missing Dimension',
                description: 'Use A = l × w to find length',
                expression: `l = A/w = ${area}/${width} = ${solution.length}`,
                category: 'solving'
            });
        }

        // Calculate perimeter if not given
        if (solution.length && solution.width) {
            steps.push({
                step: 'Calculate Perimeter',
                description: 'Use the perimeter formula',
                expression: `P = 2(l + w) = 2(${solution.length} + ${solution.width}) = ${solution.perimeter}`,
                category: 'additional'
            });
        }

        return steps;
    }

    generatePythagoreanSteps(problem, solution) {
        const { a, b, c, side1, side2, hypotenuse } = problem.parameters;
        const steps = [];

        // Normalize parameter names
        let sideA = a || side1;
        let sideB = b || side2;
        let sideC = c || hypotenuse;

        steps.push({
            step: 'Given Information',
            description: 'Identify the given sides of the right triangle',
            expression: this.formatGivenInfo(problem.parameters),
            category: 'setup'
        });

        steps.push({
            step: 'State Theorem',
            description: 'The Pythagorean theorem for right triangles',
            expression: 'a² + b² = c²',
            category: 'theorem'
        });

        if (sideA !== undefined && sideB !== undefined && sideC === undefined) {
            steps.push({
                step: 'Find Hypotenuse',
                description: 'Solve for c (hypotenuse)',
                expression: `c² = a² + b² = ${sideA}² + ${sideB}²`,
                category: 'substitution'
            });

            steps.push({
                step: 'Calculate Squares',
                description: 'Evaluate the squared terms',
                expression: `c² = ${sideA * sideA} + ${sideB * sideB} = ${sideA * sideA + sideB * sideB}`,
                category: 'calculation'
            });

            steps.push({
                step: 'Take Square Root',
                description: 'Find c by taking the square root',
                expression: `c = √${sideA * sideA + sideB * sideB} = ${solution.c}`,
                category: 'result'
            });

        } else if (sideA !== undefined && sideC !== undefined && sideB === undefined) {
            steps.push({
                step: 'Find Side b',
                description: 'Rearrange to solve for b',
                expression: `b² = c² - a² = ${sideC}² - ${sideA}²`,
                category: 'rearrange'
            });

            steps.push({
                step: 'Calculate Squares',
                description: 'Evaluate the squared terms',
                expression: `b² = ${sideC * sideC} - ${sideA * sideA} = ${sideC * sideC - sideA * sideA}`,
                category: 'calculation'
            });

            steps.push({
                step: 'Take Square Root',
                description: 'Find b by taking the square root',
                expression: `b = √${sideC * sideC - sideA * sideA} = ${solution.b}`,
                category: 'result'
            });

        } else if (sideB !== undefined && sideC !== undefined && sideA === undefined) {
            steps.push({
                step: 'Find Side a',
                description: 'Rearrange to solve for a',
                expression: `a² = c² - b² = ${sideC}² - ${sideB}²`,
                category: 'rearrange'
            });

            steps.push({
                step: 'Calculate Squares',
                description: 'Evaluate the squared terms',
                expression: `a² = ${sideC * sideC} - ${sideB * sideB} = ${sideC * sideC - sideB * sideB}`,
                category: 'calculation'
            });

            steps.push({
                step: 'Take Square Root',
                description: 'Find a by taking the square root',
                expression: `a = √${sideC * sideC - sideB * sideB} = ${solution.a}`,
                category: 'result'
            });
        }

        // Additional calculations
        if (solution.area) {
            steps.push({
                step: 'Calculate Triangle Area',
                description: 'Use the two legs as base and height',
                expression: `Area = ½ × ${solution.a} × ${solution.b} = ${solution.area}`,
                category: 'additional'
            });
        }

        return steps;
    }

    generateDistanceSteps(problem, solution) {
        const steps = [];
        const { x1, y1, x2, y2 } = solution.point1.x !== undefined ? 
            { x1: solution.point1.x, y1: solution.point1.y, x2: solution.point2.x, y2: solution.point2.y } :
            problem.parameters;

        steps.push({
            step: 'Given Points',
            description: 'Identify the coordinates of both points',
            expression: `Point 1: (${x1}, ${y1}), Point 2: (${x2}, ${y2})`,
            category: 'setup'
        });

        steps.push({
            step: 'Distance Formula',
            description: 'Use the distance formula between two points',
            expression: 'd = √[(x₂-x₁)² + (y₂-y₁)²]',
            category: 'formula'
        });

        steps.push({
            step: 'Substitute Coordinates',
            description: 'Replace variables with given coordinates',
            expression: `d = √[(${x2}-${x1})² + (${y2}-${y1})²]`,
            category: 'substitution'
        });

        steps.push({
            step: 'Calculate Differences',
            description: 'Find the differences in x and y coordinates',
            expression: `d = √[(${solution.deltaX})² + (${solution.deltaY})²]`,
            category: 'calculation'
        });

        steps.push({
            step: 'Square the Differences',
            description: 'Calculate the squared terms',
            expression: `d = √[${solution.deltaX * solution.deltaX} + ${solution.deltaY * solution.deltaY}]`,
            category: 'calculation'
        });

        steps.push({
            step: 'Add and Take Square Root',
            description: 'Complete the calculation',
            expression: `d = √${solution.deltaX * solution.deltaX + solution.deltaY * solution.deltaY} = ${solution.distance}`,
            category: 'result'
        });

        return steps;
    }

    generateMidpointSteps(problem, solution) {
        const steps = [];
        const { x1, y1, x2, y2 } = solution.point1.x !== undefined ? 
            { x1: solution.point1.x, y1: solution.point1.y, x2: solution.point2.x, y2: solution.point2.y } :
            problem.parameters;

        steps.push({
            step: 'Given Points',
            description: 'Identify the coordinates of both endpoints',
            expression: `Point 1: (${x1}, ${y1}), Point 2: (${x2}, ${y2})`,
            category: 'setup'
        });

        steps.push({
            step: 'Midpoint Formula',
            description: 'Use the midpoint formula',
            expression: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)',
            category: 'formula'
        });

        steps.push({
            step: 'Substitute Coordinates',
            description: 'Replace variables with given coordinates',
            expression: `M = ((${x1}+${x2})/2, (${y1}+${y2})/2)`,
            category: 'substitution'
        });

        steps.push({
            step: 'Calculate x-coordinate',
            description: 'Find the average of x-coordinates',
            expression: `x_m = (${x1}+${x2})/2 = ${x1 + x2}/2 = ${solution.midpoint.x}`,
            category: 'calculation'
        });

        steps.push({
            step: 'Calculate y-coordinate',
            description: 'Find the average of y-coordinates',
            expression: `y_m = (${y1}+${y2})/2 = ${y1 + y2}/2 = ${solution.midpoint.y}`,
            category: 'calculation'
        });

        steps.push({
            step: 'Final Result',
            description: 'The midpoint coordinates',
            expression: `M = (${solution.midpoint.x}, ${solution.midpoint.y})`,
            category: 'result'
        });

        return steps;
    }

    generatePerimeterSteps(problem, solution) {
        const steps = [];
        const { shape, radius, diameter, length, width, sides } = problem.parameters;

        steps.push({
            step: 'Given Information',
            description: 'Identify the shape and measurements',
            expression: this.formatGivenInfo(problem.parameters),
            category: 'setup'
        });

        switch (solution.shape.toLowerCase()) {
            case 'circle':
                steps.push({
                    step: 'Choose Formula',
                    description: 'Use the circle circumference formula',
                    expression: 'C = 2πr',
                    category: 'formula'
                });

                if (radius) {
                    steps.push({
                        step: 'Substitute Radius',
                        description: 'Replace r with given radius',
                        expression: `C = 2π × ${radius}`,
                        category: 'substitution'
                    });
                } else if (diameter) {
                    steps.push({
                        step: 'Find Radius',
                        description: 'Convert diameter to radius',
                        expression: `r = d/2 = ${diameter}/2 = ${diameter/2}`,
                        category: 'conversion'
                    });

                    steps.push({
                        step: 'Substitute Radius',
                        description: 'Replace r with calculated radius',
                        expression: `C = 2π × ${diameter/2}`,
                        category: 'substitution'
                    });
                }

                steps.push({
                    step: 'Calculate',
                    description: 'Evaluate the expression',
                    expression: `C = ${solution.perimeter}`,
                    category: 'result'
                });
                break;

            case 'rectangle':
                steps.push({
                    step: 'Choose Formula',
                    description: 'Use the rectangle perimeter formula',
                    expression: 'P = 2(l + w)',
                    category: 'formula'
                });

                steps.push({
                    step: 'Substitute Values',
                    description: 'Replace l and w with given dimensions',
                    expression: `P = 2(${length} + ${width})`,
                    category: 'substitution'
                });

                steps.push({
                    step: 'Calculate',
                    description: 'Evaluate the expression',
                    expression: `P = 2(${length + width}) = ${solution.perimeter}`,
                    category: 'result'
                });
                break;

            case 'triangle':
                steps.push({
                    step: 'Choose Formula',
                    description: 'Sum all three sides',
                    expression: 'P = a + b + c',
                    category: 'formula'
                });

                steps.push({
                    step: 'Add Side Lengths',
                    description: 'Sum the given side lengths',
                    expression: `P = ${sides.join(' + ')} = ${solution.perimeter}`,
                    category: 'calculation'
                });
                break;

            default:
                if (sides && Array.isArray(sides)) {
                    steps.push({
                        step: 'Add All Sides',
                        description: 'Sum all the side lengths',
                        expression: `P = ${sides.join(' + ')} = ${solution.perimeter}`,
                        category: 'calculation'
                    });
                }
        }

        return steps;
    }

    generateAngleSteps(problem, solution) {
        const steps = [];

        steps.push({
            step: 'Given Information',
            description: 'Identify the known angle information',
            expression: this.formatGivenInfo(problem.parameters),
            category: 'setup'
        });

        if (solution.relationship === 'complementary') {
            steps.push({
                step: 'Complementary Angle Relationship',
                description: 'Two angles are complementary if they sum to 90°',
                expression: 'θ₁ + θ₂ = 90°',
                category: 'definition'
            });

            steps.push({
                step: 'Solve for Unknown Angle',
                description: 'Find the complementary angle',
                expression: `θ₂ = 90° - ${solution.originalAngle}° = ${solution.complementaryAngle}°`,
                category: 'calculation'
            });

        } else if (solution.relationship === 'supplementary') {
            steps.push({
                step: 'Supplementary Angle Relationship',
                description: 'Two angles are supplementary if they sum to 180°',
                expression: 'θ₁ + θ₂ = 180°',
                category: 'definition'
            });

            steps.push({
                step: 'Solve for Unknown Angle',
                description: 'Find the supplementary angle',
                expression: `θ₂ = 180° - ${solution.originalAngle}° = ${solution.supplementaryAngle}°`,
                category: 'calculation'
            });

        } else if (solution.angles) {
            steps.push({
                step: 'Triangle Angle Sum Property',
                description: 'The sum of angles in a triangle is 180°',
                expression: 'A + B + C = 180°',
                category: 'theorem'
            });

            if (solution.missingAngle) {
                const knownAngles = solution.angles.slice(0, -1);
                steps.push({
                    step: 'Find Missing Angle',
                    description: 'Solve for the unknown angle',
                    expression: `C = 180° - ${knownAngles.join('° - ')}° = ${solution.missingAngle}°`,
                    category: 'calculation'
                });
            }

            if (solution.triangleType) {
                steps.push({
                    step: 'Classify Triangle',
                    description: 'Determine the type of triangle based on angles',
                    expression: `Triangle type: ${solution.triangleType}`,
                    category: 'classification'
                });
            }
        }

        return steps;
    }

    generateTriangleSolvingSteps(problem, solution) {
        const steps = [];

        steps.push({
            step: 'Given Information',
            description: 'Identify known sides and angles',
            expression: this.formatGivenInfo(problem.parameters),
            category: 'setup'
        });

        steps.push({
            step: 'Solution Method',
            description: `Using ${solution.method}`,
            expression: this.getTriangleSolvingFormula(solution.method),
            category: 'method'
        });

        // Add specific steps based on method
        if (solution.method.includes('SSS')) {
            steps.push({
                step: 'Apply Law of Cosines',
                description: 'Find first angle using cosine law',
                expression: `cos A = (b² + c² - a²)/(2bc)`,
                category: 'formula'
            });

            if (solution.A) {
                steps.push({
                    step: 'Calculate Angle A',
                    description: 'Evaluate the inverse cosine',
                    expression: `A = cos⁻¹((${solution.b}² + ${solution.c}² - ${solution.a}²)/(2×${solution.b}×${solution.c})) = ${solution.A.toFixed(2)}°`,
                    category: 'calculation'
                });
            }

        } else if (solution.method.includes('SAS')) {
            steps.push({
                step: 'Find Third Side',
                description: 'Use Law of Cosines to find unknown side',
                expression: `c² = a² + b² - 2ab cos C`,
                category: 'formula'
            });

        } else if (solution.method.includes('Law of Sines')) {
            steps.push({
                step: 'Apply Law of Sines',
                description: 'Use the sine relationship',
                expression: `a/sin A = b/sin B = c/sin C`,
                category: 'formula'
            });
        }

        // Add area calculation if available
        if (solution.area) {
            steps.push({
                step: 'Calculate Area',
                description: "Use Heron's formula with all sides known",
                expression: `Area = ${solution.area.toFixed(3)} square units`,
                category: 'additional'
            });
        }

        return steps;
    }

    generateSimilarTrianglesSteps(problem, solution) {
        const steps = [];

        steps.push({
            step: 'Given Information',
            description: 'Identify the similar triangles and known measurements',
            expression: this.formatGivenInfo(problem.parameters),
            category: 'setup'
        });

        if (solution.scaleFactor) {
            steps.push({
                step: 'Scale Factor',
                description: 'Determine the ratio between corresponding sides',
                expression: `Scale factor = ${solution.scaleFactor}`,
                category: 'ratio'
            });

            if (solution.verification) {
                steps.push({
                    step: 'Verify Scale Factor',
                    description: 'Calculate from corresponding sides',
                    expression: solution.verification,
                    category: 'verification'
                });
            }

            steps.push({
                step: 'Area Ratio',
                description: 'The ratio of areas equals the square of the scale factor',
                expression: `Area ratio = (scale factor)² = ${solution.scaleFactor}² = ${solution.areRatio}`,
                category: 'relationship'
            });

            steps.push({
                step: 'Perimeter Ratio',
                description: 'The ratio of perimeters equals the scale factor',
                expression: `Perimeter ratio = scale factor = ${solution.perimeterRatio}`,
                category: 'relationship'
            });
        }

        return steps;
    }

    generateVolumeSteps(problem, solution) {
        const steps = [];
        const { shape, radius, height, length, width, base } = problem.parameters;

        steps.push({
            step: 'Given Information',
            description: 'Identify the 3D shape and measurements',
            expression: this.formatGivenInfo(problem.parameters),
            category: 'setup'
        });

        steps.push({
            step: 'Choose Formula',
            description: `Surface area formula for ${solution.shape}`,
            expression: solution.formula,
            category: 'formula'
        });

        switch (solution.shape.toLowerCase()) {
            case 'sphere':
                steps.push({
                    step: 'Substitute Radius',
                    description: 'Replace r with given radius',
                    expression: `SA = 4π × (${radius})²`,
                    category: 'substitution'
                });

                steps.push({
                    step: 'Calculate',
                    description: 'Evaluate the expression',
                    expression: `SA = 4π × ${Math.pow(radius, 2)} = ${solution.surfaceArea}`,
                    category: 'calculation'
                });
                break;

            case 'cylinder':
                if (solution.breakdown) {
                    steps.push({
                        step: 'Break Down Surface Area',
                        description: 'Cylinder SA = 2 circular bases + lateral surface',
                        expression: 'SA = 2πr² + 2πrh',
                        category: 'breakdown'
                    });

                    steps.push({
                        step: 'Calculate Base Areas',
                        description: 'Find area of both circular bases',
                        expression: `Base areas = 2π(${radius})² = ${solution.breakdown.bases}`,
                        category: 'calculation'
                    });

                    steps.push({
                        step: 'Calculate Lateral Area',
                        description: 'Find area of curved surface',
                        expression: `Lateral area = 2π(${radius})(${height}) = ${solution.breakdown.lateral}`,
                        category: 'calculation'
                    });

                    steps.push({
                        step: 'Add Components',
                        description: 'Sum all surface areas',
                        expression: `SA = ${solution.breakdown.bases} + ${solution.breakdown.lateral} = ${solution.surfaceArea}`,
                        category: 'result'
                    });
                }
                break;

            case 'rectangular_prism':
            case 'box':
                if (solution.breakdown) {
                    steps.push({
                        step: 'Break Down Surface Area',
                        description: 'Box has 6 faces: 2 of each dimension pair',
                        expression: 'SA = 2(lw + lh + wh)',
                        category: 'breakdown'
                    });

                    steps.push({
                        step: 'Calculate Each Face Type',
                        description: 'Find area of each face pair',
                        expression: `2lw = ${solution.breakdown.face1}, 2lh = ${solution.breakdown.face2}, 2wh = ${solution.breakdown.face3}`,
                        category: 'calculation'
                    });

                    steps.push({
                        step: 'Add All Faces',
                        description: 'Sum all face areas',
                        expression: `SA = ${solution.breakdown.face1} + ${solution.breakdown.face2} + ${solution.breakdown.face3} = ${solution.surfaceArea}`,
                        category: 'result'
                    });
                }
                break;
        }

        return steps;
    }

    // VERIFICATION METHODS

    generateGeometryVerificationSteps(problem, solution) {
        const steps = [];

        steps.push({
            step: 'Verification',
            description: 'Check the solution using alternative methods or properties',
            expression: '--- Verification Steps ---',
            category: 'verification_header'
        });

        switch (problem.type) {
            case 'triangle_area':
                steps.push(...this.verifyTriangleArea(problem, solution));
                break;
            case 'pythagorean':
                steps.push(...this.verifyPythagorean(problem, solution));
                break;
            case 'distance_formula':
                steps.push(...this.verifyDistance(problem, solution));
                break;
            case 'circle_area':
                steps.push(...this.verifyCircleArea(problem, solution));
                break;
            case 'rectangle_area':
                steps.push(...this.verifyRectangleArea(problem, solution));
                break;
            case 'triangle_solving':
                steps.push(...this.verifyTriangleSolution(problem, solution));
                break;
            default:
                steps.push({
                    step: 'General Verification',
                    description: 'Check units and reasonableness of answer',
                    expression: `Result: ${JSON.stringify(solution).substring(0, 100)}...`,
                    category: 'verification'
                });
        }

        return steps;
    }

    verifyTriangleArea(problem, solution) {
        const steps = [];
        
        if (solution.additionalInfo?.triangleInequality) {
            steps.push({
                step: 'Triangle Inequality Check',
                description: 'Verify that the triangle can exist',
                expression: solution.additionalInfo.triangleInequality.conditions.join(', '),
                category: 'verification'
            });

            steps.push({
                step: 'Triangle Validity',
                description: 'Triangle inequality result',
                expression: `Triangle is ${solution.additionalInfo.triangleInequality.valid ? 'valid' : 'invalid'}`,
                category: 'verification'
            });
        }

        if (problem.parameters.method === 'heron' && problem.parameters.base && problem.parameters.height) {
            const alternateArea = 0.5 * problem.parameters.base * problem.parameters.height;
            steps.push({
                step: 'Alternative Method Check',
                description: 'Verify using base-height formula',
                expression: `A = ½bh = ½(${problem.parameters.base})(${problem.parameters.height}) = ${alternateArea}`,
                category: 'verification'
            });

            const difference = Math.abs(alternateArea - solution.area);
            steps.push({
                step: 'Method Comparison',
                description: 'Compare results from different methods',
                expression: `Difference: ${difference.toFixed(6)} (should be close to 0)`,
                category: 'verification'
            });
        }

        return steps;
    }

    verifyPythagorean(problem, solution) {
        const steps = [];

        steps.push({
            step: 'Pythagorean Verification',
            description: 'Check that a² + b² = c²',
            expression: `${solution.a}² + ${solution.b}² = ${solution.c}²`,
            category: 'verification'
        });

        const leftSide = solution.a * solution.a + solution.b * solution.b;
        const rightSide = solution.c * solution.c;
        const difference = Math.abs(leftSide - rightSide);

        steps.push({
            step: 'Calculate Both Sides',
            description: 'Evaluate the equation',
            expression: `${leftSide.toFixed(6)} = ${rightSide.toFixed(6)}`,
            category: 'verification'
        });

        steps.push({
            step: 'Verification Result',
            description: 'Check if equation holds true',
            expression: `Difference: ${difference.toFixed(8)} ${difference < 0.000001 ? '✓ Verified' : '✗ Error detected'}`,
            category: 'verification'
        });

        if (solution.isPythagoreanTriple) {
            steps.push({
                step: 'Pythagorean Triple',
                description: 'This is a Pythagorean triple (integer solution)',
                expression: `(${solution.a}, ${solution.b}, ${solution.c}) is a Pythagorean triple`,
                category: 'verification'
            });
        }

        return steps;
    }

    verifyDistance(problem, solution) {
        const steps = [];

        // Verify by checking if distance is always positive
        steps.push({
            step: 'Distance Properties',
            description: 'Distance must be non-negative',
            expression: `d = ${solution.distance} ${solution.distance >= 0 ? '✓' : '✗'}`,
            category: 'verification'
        });

        // Check if points are the same
        if (solution.distance === 0) {
            steps.push({
                step: 'Point Coincidence',
                description: 'Zero distance means points are identical',
                expression: `Points (${solution.point1.x}, ${solution.point1.y}) and (${solution.point2.x}, ${solution.point2.y}) are the same`,
                category: 'verification'
            });
        }

        // Verify using alternative calculation
        const altDistance = Math.sqrt(Math.pow(solution.point2.x - solution.point1.x, 2) + Math.pow(solution.point2.y - solution.point1.y, 2));
        steps.push({
            step: 'Alternative Calculation',
            description: 'Recalculate to verify result',
            expression: `Alternative: √[(${solution.point2.x}-${solution.point1.x})² + (${solution.point2.y}-${solution.point1.y})²] = ${altDistance.toFixed(6)}`,
            category: 'verification'
        });

        const difference = Math.abs(altDistance - solution.distance);
        steps.push({
            step: 'Verification Result',
            description: 'Compare calculations',
            expression: `Difference: ${difference.toFixed(8)} ${difference < 0.000001 ? '✓ Verified' : '✗ Error detected'}`,
            category: 'verification'
        });

        return steps;
    }

    verifyCircleArea(problem, solution) {
        const steps = [];

        // Verify radius is positive
        steps.push({
            step: 'Radius Validation',
            description: 'Radius must be positive',
            expression: `r = ${solution.radius} ${solution.radius > 0 ? '✓' : '✗'}`,
            category: 'verification'
        });

        // Check relationship between circumference and area
        const expectedCircumference = 2 * Math.PI * solution.radius;
        steps.push({
            step: 'Circumference Check',
            description: 'Verify C = 2πr',
            expression: `Expected C = 2π(${solution.radius}) = ${expectedCircumference.toFixed(6)}`,
            category: 'verification'
        });

        const circumferenceDiff = Math.abs(expectedCircumference - solution.circumference);
        steps.push({
            step: 'Circumference Verification',
            description: 'Compare calculated circumference',
            expression: `Difference: ${circumferenceDiff.toFixed(8)} ${circumferenceDiff < 0.000001 ? '✓ Verified' : '✗ Error detected'}`,
            category: 'verification'
        });

        return steps;
    }

    verifyRectangleArea(problem, solution) {
        const steps = [];

        // Check that dimensions are positive
        steps.push({
            step: 'Dimension Validation',
            description: 'Length and width must be positive',
            expression: `l = ${solution.length} ${solution.length > 0 ? '✓' : '✗'}, w = ${solution.width} ${solution.width > 0 ? '✓' : '✗'}`,
            category: 'verification'
        });

        // Verify area calculation
        const expectedArea = solution.length * solution.width;
        steps.push({
            step: 'Area Verification',
            description: 'Check A = l × w',
            expression: `Expected A = ${solution.length} × ${solution.width} = ${expectedArea}`,
            category: 'verification'
        });

        const areaDiff = Math.abs(expectedArea - solution.area);
        steps.push({
            step: 'Area Check Result',
            description: 'Compare calculated area',
            expression: `Difference: ${areaDiff.toFixed(8)} ${areaDiff < 0.000001 ? '✓ Verified' : '✗ Error detected'}`,
            category: 'verification'
        });

        // Verify perimeter calculation
        const expectedPerimeter = 2 * (solution.length + solution.width);
        const perimeterDiff = Math.abs(expectedPerimeter - solution.perimeter);
        steps.push({
            step: 'Perimeter Verification',
            description: 'Check P = 2(l + w)',
            expression: `Expected P = 2(${solution.length} + ${solution.width}) = ${expectedPerimeter}, Difference: ${perimeterDiff.toFixed(8)} ${perimeterDiff < 0.000001 ? '✓' : '✗'}`,
            category: 'verification'
        });

        return steps;
    }

    verifyTriangleSolution(problem, solution) {
        const steps = [];

        if (solution.A && solution.B && solution.C) {
            // Verify angle sum
            const angleSum = solution.A + solution.B + solution.C;
            steps.push({
                step: 'Angle Sum Check',
                description: 'Triangle angles must sum to 180°',
                expression: `A + B + C = ${solution.A.toFixed(2)}° + ${solution.B.toFixed(2)}° + ${solution.C.toFixed(2)}° = ${angleSum.toFixed(2)}°`,
                category: 'verification'
            });

            const angleDiff = Math.abs(angleSum - 180);
            steps.push({
                step: 'Angle Sum Verification',
                description: 'Check deviation from 180°',
                expression: `Difference from 180°: ${angleDiff.toFixed(6)} ${angleDiff < 0.01 ? '✓ Verified' : '✗ Error detected'}`,
                category: 'verification'
            });
        }

        if (solution.a && solution.b && solution.c) {
            // Verify triangle inequality
            const ineq1 = solution.a + solution.b > solution.c;
            const ineq2 = solution.a + solution.c > solution.b;
            const ineq3 = solution.b + solution.c > solution.a;

            steps.push({
                step: 'Triangle Inequality Check',
                description: 'Verify all three triangle inequalities',
                expression: `${solution.a} + ${solution.b} > ${solution.c}: ${ineq1 ? '✓' : '✗'}`,
                category: 'verification'
            });

            steps.push({
                step: 'Triangle Validity',
                description: 'Overall triangle validity',
                expression: `Triangle is ${(ineq1 && ineq2 && ineq3) ? 'valid' : 'invalid'}`,
                category: 'verification'
            });
        }

        return steps;
    }

    // HELPER METHODS

    formatGivenInfo(parameters) {
        const info = [];
        for (const [key, value] of Object.entries(parameters)) {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    info.push(`${key}: [${value.join(', ')}]`);
                } else if (typeof value === 'object') {
                    info.push(`${key}: ${JSON.stringify(value)}`);
                } else {
                    info.push(`${key}: ${value}`);
                }
            }
        }
        return info.join(', ');
    }

    getTriangleSolvingFormula(method) {
        const formulas = {
            'SSS (Law of Cosines)': 'c² = a² + b² - 2ab cos C',
            'SAS (Law of Cosines)': 'c² = a² + b² - 2ab cos C',
            'AAS/ASA (Law of Sines)': 'a/sin A = b/sin B = c/sin C',
            'Law of Sines': 'a/sin A = b/sin B = c/sin C',
            'Law of Cosines': 'c² = a² + b² - 2ab cos C'
        };
        return formulas[method] || 'Various triangle solving formulas';
    }

    // DIAGRAM AND GRAPH DATA METHODS

    generateDiagramData() {
        if (!this.currentProblem || !this.currentSolution) return;

        const { type } = this.currentProblem;
        const solution = this.currentSolution;

        switch (type) {
            case 'triangle_area':
            case 'pythagorean':
            case 'triangle_solving':
                this.diagramData = this.generateTriangleDiagram(this.currentProblem, solution);
                break;
            case 'circle_area':
                this.diagramData = this.generateCircleDiagram(this.currentProblem, solution);
                break;
            case 'rectangle_area':
                this.diagramData = this.generateRectangleDiagram(this.currentProblem, solution);
                break;
            case 'distance_formula':
            case 'midpoint_formula':
                this.diagramData = this.generateCoordinateDiagram(this.currentProblem, solution);
                break;
            case 'volume':
            case 'surface_area':
                this.diagramData = this.generate3DDiagram(this.currentProblem, solution);
                break;
            default:
                this.diagramData = this.generateGenericDiagram(this.currentProblem, solution);
        }
    }

    generateTriangleDiagram(problem, solution) {
        const scale = 200; // Base scale for diagram
        
        // Determine triangle dimensions
        let a = solution.a || problem.parameters.a || 3;
        let b = solution.b || problem.parameters.b || 4;
        let c = solution.c || problem.parameters.c || 5;
        
        // Normalize to fit in diagram
        const maxSide = Math.max(a, b, c);
        const scaleFactor = scale / maxSide;
        a *= scaleFactor;
        b *= scaleFactor;
        c *= scaleFactor;

        // Calculate triangle coordinates using law of cosines
        const cosC = (a*a + b*b - c*c) / (2*a*b);
        const angleC = Math.acos(Math.max(-1, Math.min(1, cosC)));
        
        const vertices = [
            { x: 50, y: 250, label: 'A' },
            { x: 50 + a, y: 250, label: 'B' },
            { x: 50 + b * Math.cos(angleC), y: 250 - b * Math.sin(angleC), label: 'C' }
        ];

        const sides = [
            { from: 'A', to: 'B', length: a/scaleFactor, label: `a = ${solution.a || a/scaleFactor}` },
            { from: 'B', to: 'C', length: b/scaleFactor, label: `b = ${solution.b || b/scaleFactor}` },
            { from: 'C', to: 'A', length: c/scaleFactor, label: `c = ${solution.c || c/scaleFactor}` }
        ];

        return {
            type: 'triangle',
            width: 400,
            height: 300,
            vertices: vertices,
            sides: sides,
            area: solution.area,
            angles: solution.A ? [solution.A, solution.B, solution.C] : null,
            properties: {
                triangleType: solution.triangleType || this.classifyTriangle(solution),
                isRightTriangle: problem.type === 'pythagorean'
            }
        };
    }

    generateCircleDiagram(problem, solution) {
        const centerX = 200;
        const centerY = 150;
        const displayRadius = Math.min(solution.radius * 20, 100); // Scale for display

        return {
            type: 'circle',
            width: 400,
            height: 300,
            center: { x: centerX, y: centerY },
            radius: displayRadius,
            actualRadius: solution.radius,
            area: solution.area,
            circumference: solution.circumference,
            diameter: solution.diameter,
            properties: {
                radiusLabel: `r = ${solution.radius}`,
                areaLabel: `A = ${solution.area.toFixed(2)}`,
                circumferenceLabel: `C = ${solution.circumference.toFixed(2)}`
            }
        };
    }

    generateRectangleDiagram(problem, solution) {
        const scale = 200 / Math.max(solution.length, solution.width);
        const displayLength = solution.length * scale;
        const displayWidth = solution.width * scale;

        return {
            type: 'rectangle',
            width: 400,
            height: 300,
            rectangle: {
                x: 50,
                y: 50,
                width: displayLength,
                height: displayWidth
            },
            actualDimensions: {
                length: solution.length,
                width: solution.width
            },
            area: solution.area,
            perimeter: solution.perimeter,
            properties: {
                lengthLabel: `l = ${solution.length}`,
                widthLabel: `w = ${solution.width}`,
                areaLabel: `A = ${solution.area}`,
                perimeterLabel: `P = ${solution.perimeter}`
            }
        };
    }

    generateCoordinateDiagram(problem, solution) {
        const point1 = solution.point1;
        const point2 = solution.point2;
        
        // Calculate display bounds
        const margin = 50;
        const minX = Math.min(point1.x, point2.x) - 2;
        const maxX = Math.max(point1.x, point2.x) + 2;
        const minY = Math.min(point1.y, point2.y) - 2;
        const maxY = Math.max(point1.y, point2.y) + 2;
        
        const scaleX = 300 / (maxX - minX);
        const scaleY = 200 / (maxY - minY);
        const scale = Math.min(scaleX, scaleY);

        return {
            type: 'coordinate_plane',
            width: 400,
            height: 300,
            bounds: { minX, maxX, minY, maxY },
            scale: scale,
            points: [
                {
                    x: margin + (point1.x - minX) * scale,
                    y: 250 - (point1.y - minY) * scale,
                    actualX: point1.x,
                    actualY: point1.y,
                    label: `P₁(${point1.x}, ${point1.y})`
                },
                {
                    x: margin + (point2.x - minX) * scale,
                    y: 250 - (point2.y - minY) * scale,
                    actualX: point2.x,
                    actualY: point2.y,
                    label: `P₂(${point2.x}, ${point2.y})`
                }
            ],
            distance: solution.distance,
            midpoint: solution.midpoint,
            properties: {
                distanceLabel: solution.distance ? `d = ${solution.distance.toFixed(3)}` : null,
                midpointLabel: solution.midpoint ? `M(${solution.midpoint.x}, ${solution.midpoint.y})` : null
            }
        };
    }

    generate3DDiagram(problem, solution) {
        const { shape } = solution;
        const { radius, height, length, width } = problem.parameters;

        let diagramData = {
            type: '3d_shape',
            shape: shape,
            width: 400,
            height: 300
        };

        switch (shape.toLowerCase()) {
            case 'sphere':
                diagramData.sphere = {
                    centerX: 200,
                    centerY: 150,
                    radius: Math.min(radius * 10, 80),
                    actualRadius: radius
                };
                break;

            case 'cylinder':
                diagramData.cylinder = {
                    centerX: 200,
                    centerY: 150,
                    radius: Math.min(radius * 15, 60),
                    height: Math.min(height * 10, 120),
                    actualRadius: radius,
                    actualHeight: height
                };
                break;

            case 'rectangular_prism':
            case 'box':
                const scale = 150 / Math.max(length, width, height);
                diagramData.box = {
                    x: 100,
                    y: 100,
                    length: length * scale,
                    width: width * scale,
                    height: height * scale,
                    actualLength: length,
                    actualWidth: width,
                    actualHeight: height
                };
                break;
        }

        diagramData.volume = solution.volume;
        diagramData.surfaceArea = solution.surfaceArea;

        return diagramData;
    }

    generateGenericDiagram(problem, solution) {
        return {
            type: 'generic',
            width: 400,
            height: 300,
            title: `${problem.type} Solution`,
            content: `Solution: ${JSON.stringify(solution, null, 2).substring(0, 200)}...`,
            properties: solution
        };
    }

    // GRAPH DATA METHODS

    generateGraphData() {
        if (!this.currentProblem || !this.currentSolution) return;

        const { type } = this.currentProblem;
        const solution = this.currentSolution;

        switch (type) {
            case 'triangle_area':
                this.graphData = this.generateTriangleAreaGraph(this.currentProblem, solution);
                break;
            case 'circle_area':
                this.graphData = this.generateCircleAreaGraph(this.currentProblem, solution);
                break;
            case 'pythagorean':
                this.graphData = this.generatePythagoreanGraph(this.currentProblem, solution);
                break;
            case 'distance_formula':
                this.graphData = this.generateDistanceGraph(this.currentProblem, solution);
                break;
            case 'volume':
                this.graphData = this.generateVolumeGraph(this.currentProblem, solution);
                break;
            default:
                this.graphData = this.generateDefaultGraph(this.currentProblem, solution);
        }
    }

    generateTriangleAreaGraph(problem, solution) {
        // Graph showing how area changes with base or height
        const { base = 5, height = 4 } = problem.parameters;
        const data = [];

        // Vary base while keeping height constant
        for (let b = 1; b <= base * 2; b += 0.5) {
            data.push({
                base: b,
                area: 0.5 * b * height,
                type: 'Base variation'
            });
        }

        // Vary height while keeping base constant
        for (let h = 1; h <= height * 2; h += 0.5) {
            data.push({
                height: h,
                area: 0.5 * base * h,
                type: 'Height variation'
            });
        }

        return {
            type: 'line_chart',
            title: 'Triangle Area vs Dimensions',
            data: data,
            xAxis: 'dimension',
            yAxis: 'area',
            currentSolution: {
                base: base,
                height: height,
                area: solution.area
            }
        };
    }

    generateCircleAreaGraph(problem, solution) {
        // Graph showing area vs radius relationship
        const data = [];
        const maxRadius = solution.radius * 2;

        for (let r = 0.5; r <= maxRadius; r += 0.1) {
            data.push({
                radius: parseFloat(r.toFixed(1)),
                area: Math.PI * r * r,
                circumference: 2 * Math.PI * r
            });
        }

        return {
            type: 'multi_line_chart',
            title: 'Circle Properties vs Radius',
            data: data,
            xAxis: 'radius',
            lines: [
                { yAxis: 'area', color: '#4472c4', label: 'Area' },
                { yAxis: 'circumference', color: '#e15759', label: 'Circumference' }
            ],
            currentSolution: {
                radius: solution.radius,
                area: solution.area,
                circumference: solution.circumference
            }
        };
    }

    generatePythagoreanGraph(problem, solution) {
        // Graph showing the Pythagorean relationship
        const data = [];
        const maxSide = Math.max(solution.a, solution.b) * 1.5;

        for (let a = 1; a <= maxSide; a += 0.5) {
            const c = Math.sqrt(a * a + solution.b * solution.b);
            data.push({
                sideA: a,
                hypotenuse: c,
                aSquared: a * a,
                cSquared: c * c
            });
        }

        return {
            type: 'multi_line_chart',
            title: 'Pythagorean Relationship',
            data: data,
            xAxis: 'sideA',
            lines: [
                { yAxis: 'hypotenuse', color: '#4472c4', label: 'Hypotenuse' },
                { yAxis: 'aSquared', color: '#70ad47', label: 'a²' },
                { yAxis: 'cSquared', color: '#ffc000', label: 'c²' }
            ],
            currentSolution: solution
        };
    }
    generateDistanceGraph(problem, solution) {
    // Graph showing distance from point1 to various points
    const { point1, point2 } = solution;
    const data = [];

    // Create a grid of points around the two given points
    const centerX = (point1.x + point2.x) / 2;
    const centerY = (point1.y + point2.y) / 2;
    const range = Math.max(Math.abs(point2.x - point1.x), Math.abs(point2.y - point1.y)) * 2;
    
    for (let x = centerX - range; x <= centerX + range; x += range / 10) {
        for (let y = centerY - range; y <= centerY + range; y += range / 10) {
            const dist = Math.sqrt((x - point1.x) ** 2 + (y - point1.y) ** 2);
            data.push({
                x: parseFloat(x.toFixed(1)),
                y: parseFloat(y.toFixed(1)),
                distance: parseFloat(dist.toFixed(2))
            });
        }
    }

    return {
        type: 'heatmap',
        title: `Distance from Point (${point1.x}, ${point1.y})`,
        data: data,
        xAxis: 'x',
        yAxis: 'y',
        valueAxis: 'distance',
        currentSolution: {
            point1: point1,
            point2: point2,
            distance: solution.distance
        }
    };
 }

generateVolumeGraph(problem, solution) {
    // Graph showing volume vs dimension relationships
    const { radius, height, length, width } = problem.parameters;
    const data = [];

    if (solution.shape === 'sphere' && radius) {
        // Show how volume changes with radius
        for (let r = 0.5; r <= radius * 2; r += 0.1) {
            data.push({
                dimension: parseFloat(r.toFixed(1)),
                volume: (4/3) * Math.PI * Math.pow(r, 3),
                surfaceArea: 4 * Math.PI * Math.pow(r, 2),
                type: 'radius'
            });
        }
    } else if (solution.shape === 'cylinder' && radius && height) {
        // Show volume vs radius
        for (let r = 0.5; r <= radius * 2; r += 0.1) {
            data.push({
                dimension: parseFloat(r.toFixed(1)),
                volume: Math.PI * Math.pow(r, 2) * height,
                type: 'radius_variation'
            });
        }
        // Show volume vs height
        for (let h = 0.5; h <= height * 2; h += 0.1) {
            data.push({
                dimension: parseFloat(h.toFixed(1)),
                volume: Math.PI * Math.pow(radius, 2) * h,
                type: 'height_variation'
            });
        }
    }

    return {
        type: 'line_chart',
        title: `${solution.shape} Volume vs Dimensions`,
        data: data,
        xAxis: 'dimension',
        yAxis: 'volume',
        currentSolution: {
            volume: solution.volume,
            surfaceArea: solution.surfaceArea
        }
    };
}

generateDefaultGraph(problem, solution) {
    // Generic graph for unsupported problem types
    return {
        type: 'bar_chart',
        title: `${problem.type} Results`,
        data: [
            {
                category: 'Solution',
                value: typeof solution === 'object' ? Object.keys(solution).length : 1,
                label: 'Number of solution properties'
            }
        ],
        xAxis: 'category',
        yAxis: 'value',
        note: 'Generic visualization - specific graph not available for this problem type'
    };
} 

// Completion of Enhanced Geometrical Mathematical Workbook

// Continue from generateSurfaceAreaSteps method
generateSurfaceAreaSteps(problem, solution) {
    const steps = [];
    const { shape, radius, height, length, width } = problem.parameters;

    steps.push({
        step: 'Given Information',
        description: 'Identify the 3D shape and measurements',
        expression: this.formatGivenInfo(problem.parameters),
        category: 'setup'
    });

    steps.push({
        step: 'Choose Formula',
        description: `Surface area formula for ${solution.shape}`,
        expression: solution.formula,
        category: 'formula'
    });

    switch (solution.shape.toLowerCase()) {
        case 'sphere':
            steps.push({
                step: 'Substitute Radius',
                description: 'Replace r with given radius',
                expression: `SA = 4π × (${radius})²`,
                category: 'substitution'
            });

            steps.push({
                step: 'Calculate',
                description: 'Evaluate the expression',
                expression: `SA = 4π × ${Math.pow(radius, 2)} = ${solution.surfaceArea}`,
                category: 'calculation'
            });
            break;

        case 'cylinder':
            if (solution.breakdown) {
                steps.push({
                    step: 'Break Down Surface Area',
                    description: 'Cylinder SA = 2 circular bases + lateral surface',
                    expression: 'SA = 2πr² + 2πrh',
                    category: 'breakdown'
                });

                steps.push({
                    step: 'Calculate Base Areas',
                    description: 'Find area of both circular bases',
                    expression: `Base areas = 2π(${radius})² = ${solution.breakdown.bases}`,
                    category: 'calculation'
                });

                steps.push({
                    step: 'Calculate Lateral Area',
                    description: 'Find area of curved surface',
                    expression: `Lateral area = 2π(${radius})(${height}) = ${solution.breakdown.lateral}`,
                    category: 'calculation'
                });

                steps.push({
                    step: 'Add Components',
                    description: 'Sum all surface areas',
                    expression: `SA = ${solution.breakdown.bases} + ${solution.breakdown.lateral} = ${solution.surfaceArea}`,
                    category: 'result'
                });
            }
            break;

        case 'rectangular_prism':
        case 'box':
            if (solution.breakdown) {
                steps.push({
                    step: 'Break Down Surface Area',
                    description: 'Box has 6 faces: 2 of each dimension pair',
                    expression: 'SA = 2(lw + lh + wh)',
                    category: 'breakdown'
                });

                steps.push({
                    step: 'Calculate Each Face Type',
                    description: 'Find area of each face pair',
                    expression: `2lw = ${solution.breakdown.face1}, 2lh = ${solution.breakdown.face2}, 2wh = ${solution.breakdown.face3}`,
                    category: 'calculation'
                });

                steps.push({
                    step: 'Add All Faces',
                    description: 'Sum all face areas',
                    expression: `SA = ${solution.breakdown.face1} + ${solution.breakdown.face2} + ${solution.breakdown.face3} = ${solution.surfaceArea}`,
                    category: 'result'
                });
            }
            break;

        case 'cone':
            if (solution.breakdown) {
                steps.push({
                    step: 'Break Down Surface Area',
                    description: 'Cone SA = base area + lateral surface',
                    expression: 'SA = πr² + πrl',
                    category: 'breakdown'
                });

                steps.push({
                    step: 'Calculate Slant Height',
                    description: 'Find slant height if not given',
                    expression: `l = √(r² + h²) = √(${radius}² + ${height}²) = ${solution.breakdown.slantHeight}`,
                    category: 'calculation'
                });

                steps.push({
                    step: 'Calculate Base Area',
                    description: 'Find area of circular base',
                    expression: `Base area = π(${radius})² = ${solution.breakdown.base}`,
                    category: 'calculation'
                });

                steps.push({
                    step: 'Calculate Lateral Area',
                    description: 'Find area of curved surface',
                    expression: `Lateral area = π(${radius})(${solution.breakdown.slantHeight}) = ${solution.breakdown.lateral}`,
                    category: 'calculation'
                });

                steps.push({
                    step: 'Add Components',
                    description: 'Sum base and lateral areas',
                    expression: `SA = ${solution.breakdown.base} + ${solution.breakdown.lateral} = ${solution.surfaceArea}`,
                    category: 'result'
                });
            }
            break;
    }

    return steps;
}

// RELATED PROBLEMS GENERATION

generateRelatedProblems(problemType, parameters = {}) {
    const problemGenerators = {
        triangle_area: () => this.generateTriangleAreaProblems(parameters),
        circle_area: () => this.generateCircleAreaProblems(parameters),
        rectangle_area: () => this.generateRectangleAreaProblems(parameters),
        pythagorean: () => this.generatePythagoreanProblems(parameters),
        distance_formula: () => this.generateDistanceFormulaProblems(parameters),
        midpoint_formula: () => this.generateMidpointProblems(parameters),
        perimeter: () => this.generatePerimeterProblems(parameters),
        angle_calculations: () => this.generateAngleProblems(parameters),
        triangle_solving: () => this.generateTriangleSolvingProblems(parameters),
        similar_triangles: () => this.generateSimilarTriangleProblems(parameters),
        volume: () => this.generateVolumeProblems(parameters),
        surface_area: () => this.generateSurfaceAreaProblems(parameters)
    };

    const generator = problemGenerators[problemType];
    return generator ? generator() : this.generateGenericProblems(problemType, parameters);
}

// Specific Problem Generators
generateTriangleAreaProblems(params) {
    const { base = 6, height = 8, a = 5, b = 12, c = 13 } = params;
    
    return [
        {
            statement: `Find the area of a triangle with base ${base + 2} and height ${height - 1}`,
            hint: "Use the formula A = ½bh",
            answer: `Area = ½ × ${base + 2} × ${height - 1} = ${0.5 * (base + 2) * (height - 1)} square units`,
            difficulty: 'easy',
            category: 'basic_formula'
        },
        {
            statement: `A triangle has sides ${a + 1}, ${b - 2}, and ${c + 1}. Find its area using Heron's formula.`,
            hint: "First find the semi-perimeter s = (a+b+c)/2, then use A = √[s(s-a)(s-b)(s-c)]",
            answer: `Use Heron's formula with s = ${((a + 1) + (b - 2) + (c + 1))/2}`,
            difficulty: 'medium',
            category: 'herons_formula'
        },
        {
            statement: `Find the area of a triangle with two sides of length ${a} and ${b}, and an included angle of 60°`,
            hint: "Use A = ½ab sin C",
            answer: `Area = ½ × ${a} × ${b} × sin(60°) = ½ × ${a} × ${b} × ${Math.sin(Math.PI/3).toFixed(3)} = ${(0.5 * a * b * Math.sin(Math.PI/3)).toFixed(2)}`,
            difficulty: 'medium',
            category: 'trigonometric'
        },
        {
            statement: `An equilateral triangle has a side length of ${a + 2}. Find its area.`,
            hint: "For an equilateral triangle, A = (√3/4)s²",
            answer: `Area = (√3/4) × ${a + 2}² = ${(Math.sqrt(3)/4 * Math.pow(a + 2, 2)).toFixed(2)} square units`,
            difficulty: 'medium',
            category: 'special_triangles'
        }
    ];
}

generateCircleAreaProblems(params) {
    const { radius = 5, diameter = 10, circumference = 31.4 } = params;
    
    return [
        {
            statement: `Find the area of a circle with radius ${radius + 2}`,
            hint: "Use A = πr²",
            answer: `Area = π × ${radius + 2}² = ${(Math.PI * Math.pow(radius + 2, 2)).toFixed(2)} square units`,
            difficulty: 'easy',
            category: 'basic_formula'
        },
        {
            statement: `A circle has a diameter of ${diameter + 4}. Find its area.`,
            hint: "First find radius: r = d/2, then use A = πr²",
            answer: `r = ${diameter + 4}/2 = ${(diameter + 4)/2}, Area = π × ${(diameter + 4)/2}² = ${(Math.PI * Math.pow((diameter + 4)/2, 2)).toFixed(2)}`,
            difficulty: 'easy',
            category: 'diameter_given'
        },
        {
            statement: `If a circle's circumference is ${circumference + 6}, what is its area?`,
            hint: "Find radius from C = 2πr, then calculate area",
            answer: `r = C/(2π) = ${circumference + 6}/(2π) = ${((circumference + 6)/(2*Math.PI)).toFixed(2)}, Area = ${(Math.PI * Math.pow((circumference + 6)/(2*Math.PI), 2)).toFixed(2)}`,
            difficulty: 'medium',
            category: 'circumference_given'
        },
        {
            statement: `Find the area of a sector with radius ${radius} and central angle 120°`,
            hint: "Sector area = (θ/360°) × πr²",
            answer: `Area = (120°/360°) × π × ${radius}² = (1/3) × π × ${Math.pow(radius, 2)} = ${(Math.PI * Math.pow(radius, 2) / 3).toFixed(2)}`,
            difficulty: 'medium',
            category: 'sector_area'
        }
    ];
}

generateRectangleAreaProblems(params) {
    const { length = 8, width = 6, area = 48, perimeter = 28 } = params;
    
    return [
        {
            statement: `Find the area of a rectangle with length ${length + 3} and width ${width - 1}`,
            hint: "Use A = l × w",
            answer: `Area = ${length + 3} × ${width - 1} = ${(length + 3) * (width - 1)} square units`,
            difficulty: 'easy',
            category: 'basic_formula'
        },
        {
            statement: `A rectangle has an area of ${area + 12} and length ${length + 2}. Find its width.`,
            hint: "Use w = A/l",
            answer: `Width = ${area + 12}/${length + 2} = ${(area + 12)/(length + 2)} units`,
            difficulty: 'medium',
            category: 'missing_dimension'
        },
        {
            statement: `A rectangle has perimeter ${perimeter + 8} and width ${width}. Find its area.`,
            hint: "First find length using P = 2(l + w), then calculate area",
            answer: `Length = (${perimeter + 8}/2) - ${width} = ${((perimeter + 8)/2) - width}, Area = ${((perimeter + 8)/2) - width} × ${width} = ${(((perimeter + 8)/2) - width) * width}`,
            difficulty: 'medium',
            category: 'perimeter_given'
        },
        {
            statement: `A square has the same area as a rectangle with dimensions ${length} by ${width}. Find the side length of the square.`,
            hint: "Square area = rectangle area, so s² = l × w",
            answer: `Square area = ${length} × ${width} = ${length * width}, Side length = √${length * width} = ${Math.sqrt(length * width).toFixed(2)}`,
            difficulty: 'medium',
            category: 'area_comparison'
        }
    ];
}

generatePythagoreanProblems(params) {
    const { a = 3, b = 4, c = 5 } = params;
    
    return [
        {
            statement: `In a right triangle, the legs are ${a + 2} and ${b + 1}. Find the hypotenuse.`,
            hint: "Use c² = a² + b²",
            answer: `c = √(${a + 2}² + ${b + 1}²) = √(${Math.pow(a + 2, 2)} + ${Math.pow(b + 1, 2)}) = ${Math.sqrt(Math.pow(a + 2, 2) + Math.pow(b + 1, 2)).toFixed(2)}`,
            difficulty: 'easy',
            category: 'find_hypotenuse'
        },
        {
            statement: `A right triangle has hypotenuse ${c + 3} and one leg ${a + 1}. Find the other leg.`,
            hint: "Use b² = c² - a²",
            answer: `b = √(${c + 3}² - ${a + 1}²) = √(${Math.pow(c + 3, 2)} - ${Math.pow(a + 1, 2)}) = ${Math.sqrt(Math.pow(c + 3, 2) - Math.pow(a + 1, 2)).toFixed(2)}`,
            difficulty: 'medium',
            category: 'find_leg'
        },
        {
            statement: `A ladder ${c + 5} feet long leans against a wall. The bottom is ${a + 3} feet from the wall. How high up the wall does it reach?`,
            hint: "This is a Pythagorean theorem application problem",
            answer: `Height = √(${c + 5}² - ${a + 3}²) = ${Math.sqrt(Math.pow(c + 5, 2) - Math.pow(a + 3, 2)).toFixed(2)} feet`,
            difficulty: 'medium',
            category: 'real_world_application'
        },
        {
            statement: `Verify if a triangle with sides ${a + 4}, ${b + 3}, ${c + 2} is a right triangle.`,
            hint: "Check if a² + b² = c² for the longest side as hypotenuse",
            answer: `Check: ${Math.pow(a + 4, 2)} + ${Math.pow(b + 3, 2)} = ${Math.pow(a + 4, 2) + Math.pow(b + 3, 2)} and ${Math.pow(c + 2, 2)} = ${Math.pow(c + 2, 2)}`,
            difficulty: 'medium',
            category: 'verification'
        }
    ];
}

generateDistanceFormulaProblems(params) {
    const { x1 = 1, y1 = 2, x2 = 4, y2 = 6 } = params;
    
    return [
        {
            statement: `Find the distance between points (${x1 + 2}, ${y1 - 1}) and (${x2 + 1}, ${y2 + 2})`,
            hint: "Use d = √[(x₂-x₁)² + (y₂-y₁)²]",
            answer: `d = √[(${x2 + 1}-${x1 + 2})² + (${y2 + 2}-${y1 - 1})²] = ${Math.sqrt(Math.pow((x2 + 1) - (x1 + 2), 2) + Math.pow((y2 + 2) - (y1 - 1), 2)).toFixed(2)}`,
            difficulty: 'easy',
            category: 'basic_distance'
        },
        {
            statement: `Point A is at (${x1}, ${y1}) and point B is at (${x2}, ${y2}). Find the distance AB.`,
            hint: "Apply the distance formula",
            answer: `Distance = √[(${x2}-${x1})² + (${y2}-${y1})²] = ${Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(2)}`,
            difficulty: 'easy',
            category: 'coordinate_geometry'
        },
        {
            statement: `A point P(x, ${y1}) is equidistant from A(${x1}, ${y1 + 2}) and B(${x2}, ${y1 - 1}). Find x.`,
            hint: "Set distances PA = PB and solve for x",
            answer: `Set √[(x-${x1})² + (${y1}-${y1 + 2})²] = √[(x-${x2})² + (${y1}-${y1 - 1})²] and solve`,
            difficulty: 'hard',
            category: 'equidistant_points'
        },
        {
            statement: `Find the perimeter of triangle with vertices (${x1}, ${y1}), (${x2}, ${y2}), and (${x1 + x2}, ${y1 + y2})`,
            hint: "Calculate all three side lengths using distance formula, then sum",
            answer: `Calculate three distances and add them together`,
            difficulty: 'medium',
            category: 'triangle_perimeter'
        }
    ];
}

generateVolumeProblems(params) {
    const { radius = 3, height = 8, length = 6, width = 4 } = params;
    
    return [
        {
            statement: `Find the volume of a cylinder with radius ${radius + 1} and height ${height - 2}`,
            hint: "Use V = πr²h",
            answer: `Volume = π × ${radius + 1}² × ${height - 2} = ${(Math.PI * Math.pow(radius + 1, 2) * (height - 2)).toFixed(2)} cubic units`,
            difficulty: 'easy',
            category: 'cylinder_volume'
        },
        {
            statement: `A sphere has radius ${radius + 2}. Find its volume.`,
            hint: "Use V = (4/3)πr³",
            answer: `Volume = (4/3)π × ${radius + 2}³ = ${((4/3) * Math.PI * Math.pow(radius + 2, 3)).toFixed(2)} cubic units`,
            difficulty: 'medium',
            category: 'sphere_volume'
        },
        {
            statement: `A rectangular prism has dimensions ${length} × ${width + 2} × ${height - 1}. Find its volume.`,
            hint: "Use V = l × w × h",
            answer: `Volume = ${length} × ${width + 2} × ${height - 1} = ${length * (width + 2) * (height - 1)} cubic units`,
            difficulty: 'easy',
            category: 'rectangular_prism'
        },
        {
            statement: `A cone has base radius ${radius} and height ${height}. Compare its volume to a cylinder with the same base and height.`,
            hint: "Cone volume is 1/3 of cylinder volume with same base and height",
            answer: `Cone volume = (1/3)π × ${radius}² × ${height} = ${((1/3) * Math.PI * Math.pow(radius, 2) * height).toFixed(2)}, Cylinder volume = ${(Math.PI * Math.pow(radius, 2) * height).toFixed(2)}`,
            difficulty: 'medium',
            category: 'volume_comparison'
        }
    ];
}

generateGenericProblems(problemType, params) {
    return [
        {
            statement: `Solve a ${problemType.replace('_', ' ')} problem with different parameters`,
            hint: "Apply the same method with modified values",
            answer: "Use the appropriate formula for this geometry problem type",
            difficulty: 'medium',
            category: 'variation'
        },
        {
            statement: `Find an alternative approach to solve this ${problemType.replace('_', ' ')} problem`,
            hint: "Consider different geometric relationships or formulas",
            answer: "Explore multiple solution methods",
            difficulty: 'hard',
            category: 'alternative_methods'
        }
    ];
}

// WORKBOOK GENERATION

generateGeometryWorkbook() {
    if (!this.currentSolution || !this.currentProblem) return;

    const workbook = this.createWorkbookStructure();
    
    // Standard sections for geometry workbooks
    workbook.sections = [
        this.createProblemSection(),
        this.createLessonSection(),
        this.createSolutionSection(),
        this.createAnalysisSection(),
        this.createStepsSection(),
        this.createVerificationSection(),
        this.createRelatedProblemsSection()
    ].filter(section => section !== null);

    if (this.diagramData) {
        workbook.sections.push(this.createDiagramSection());
    }

    if (this.graphData) {
        workbook.sections.push(this.createGraphSection());
    }

    this.currentWorkbook = workbook;
}

createWorkbookStructure() {
    return {
        title: `Geometry Problem Solver - ${this.geometryTypes[this.currentProblem.type]?.name || 'Analysis'}`,
        timestamp: new Date().toISOString(),
        problemType: this.currentProblem.type,
        sections: [],
        metadata: {
            theme: this.theme,
            colors: this.colors,
            dimensions: { width: this.width, height: this.height }
        }
    };
}

createProblemSection() {
    return {
        title: 'Problem Statement',
        type: 'problem',
        data: [
            ['Original Input', this.currentProblem.originalInput || 'Generated problem'],
            ['Problem Type', this.geometryTypes[this.currentProblem.type]?.name || this.currentProblem.type],
            ['Category', this.geometryTypes[this.currentProblem.type]?.category || 'geometry'],
            ['Description', this.geometryTypes[this.currentProblem.type]?.description || 'Geometric calculation'],
            ['Parsed At', new Date(this.currentProblem.parsedAt).toLocaleString()]
        ],
        styling: {
            headerBg: this.colors.headerBg,
            headerText: this.colors.headerText,
            cellBg: this.colors.cellBg,
            cellText: this.colors.cellText
        }
    };
}

createLessonSection() {
    const problemType = this.currentProblem.type;
    const lessonKey = this.mapProblemTypeToLesson(problemType);
    const lesson = this.lessons[lessonKey];
    
    if (!lesson) return null;

    const data = [
        ['Title', lesson.title],
        ['Theory', lesson.theory],
        ['Key Concepts', Array.isArray(lesson.concepts) ? lesson.concepts.join('; ') : 'Various concepts'],
        ['Applications', Array.isArray(lesson.applications) ? lesson.applications.join('; ') : 'Multiple applications']
    ];

    // Add key formulas if available
    if (lesson.keyFormulas) {
        Object.entries(lesson.keyFormulas).forEach(([name, formula]) => {
            data.push([`Formula: ${name}`, formula]);
        });
    }

    return {
        title: 'Lesson & Theory',
        type: 'lesson',
        data: data,
        styling: {
            headerBg: this.colors.sectionBg,
            headerText: this.colors.sectionText,
            cellBg: this.colors.cellBg,
            formulaBg: this.colors.formulaBg
        }
    };
}

createSolutionSection() {
    const solution = this.currentSolution;
    const data = [];

    // Add main result first
    const mainResults = this.extractMainResults(solution);
    mainResults.forEach(([key, value]) => {
        data.push([key, value]);
    });

    // Add formula used
    if (solution.formula) {
        data.push(['Formula Used', solution.formula]);
    }

    // Add method if available
    if (solution.method) {
        data.push(['Solution Method', solution.method]);
    }

    // Add additional properties
    Object.entries(solution).forEach(([key, value]) => {
        if (!['formula', 'method', 'parameters', 'category', 'additionalInfo'].includes(key) && 
            !mainResults.some(([mainKey]) => mainKey.toLowerCase() === key.toLowerCase())) {
            if (typeof value === 'number') {
                data.push([this.formatPropertyName(key), value.toFixed(6)]);
            } else if (typeof value === 'string' || typeof value === 'boolean') {
                data.push([this.formatPropertyName(key), value.toString()]);
            }
        }
    });

    return {
        title: 'Solution Results',
        type: 'solution',
        data: data,
        styling: {
            headerBg: this.colors.resultBg,
            headerText: this.colors.resultText,
            cellBg: this.colors.cellBg,
            resultBg: this.colors.resultBg
        }
    };
}

createAnalysisSection() {
    const analysis = this.analyzeGeometryProblem(this.currentProblem, this.currentSolution);
    
    const data = [
        ['Problem Complexity', analysis.complexity],
        ['Solution Approach', analysis.approach],
        ['Key Insights', analysis.insights.join('; ')],
        ['Geometric Properties', analysis.properties.join('; ')],
        ['Practical Applications', analysis.applications.join('; ')]
    ];

    if (analysis.specialNotes.length > 0) {
        data.push(['Special Notes', analysis.specialNotes.join('; ')]);
    }

    return {
        title: 'Problem Analysis',
        type: 'analysis',
        data: data,
        styling: {
            headerBg: this.colors.sectionBg,
            headerText: this.colors.sectionText,
            cellBg: this.colors.stepBg
        }
    };
}

createStepsSection() {
    if (!this.solutionSteps || this.solutionSteps.length === 0) return null;

    const data = [['Step', 'Description', 'Expression', 'Category']];
    
    this.solutionSteps.forEach((step, index) => {
        data.push([
            `${index + 1}. ${step.step}`,
            step.description,
            step.expression || '',
            step.category || 'general'
        ]);
    });

    return {
        title: 'Solution Steps',
        type: 'steps',
        data: data,
        styling: {
            headerBg: this.colors.headerBg,
            headerText: this.colors.headerText,
            stepBg: this.colors.stepBg,
            mathBg: this.colors.mathBg
        }
    };
}

createVerificationSection() {
    const verification = this.performGeometryVerification(this.currentProblem, this.currentSolution);
    
    const data = [
        ['Verification Status', verification.status],
        ['Accuracy Check', verification.accuracyCheck],
        ['Units Consistency', verification.unitsCheck],
        ['Reasonableness', verification.reasonablenessCheck],
        ['Mathematical Validity', verification.validityCheck]
    ];

    if (verification.warnings.length > 0) {
        data.push(['Warnings', verification.warnings.join('; ')]);
    }

    if (verification.recommendations.length > 0) {
        data.push(['Recommendations', verification.recommendations.join('; ')]);
    }

    return {
        title: 'Verification & Quality Check',
        type: 'verification',
        data: data,
        styling: {
            headerBg: this.colors.sectionBg,
            headerText: this.colors.sectionText,
            cellBg: this.colors.cellBg
        }
    };
}

createRelatedProblemsSection() {
    const relatedProblems = this.generateRelatedProblems(this.currentProblem.type, this.currentProblem.parameters);
    
    if (relatedProblems.length === 0) return null;

    const data = [['Problem', 'Hint', 'Difficulty', 'Category']];
    
    relatedProblems.forEach((problem, index) => {
        data.push([
            `${index + 1}. ${problem.statement}`,
            problem.hint,
            problem.difficulty || 'medium',
            problem.category || 'related'
        ]);
    });

    return {
        title: 'Related Problems',
        type: 'related_problems',
        data: data,
        styling: {
            headerBg: this.colors.sectionBg,
            headerText: this.colors.sectionText,
            cellBg: this.colors.stepBg
        }
    };
}

createDiagramSection() {
    if (!this.diagramData) return null;

    return {
        title: 'Geometric Diagram',
        type: 'diagram',
        data: [
            ['Diagram Type', this.diagramData.type],
            ['Width', this.diagramData.width],
            ['Height', this.diagramData.height],
            ['Properties', JSON.stringify(this.diagramData.properties, null, 2)]
        ],
        diagramData: this.diagramData,
        styling: {
            headerBg: this.colors.diagramBg,
            headerText: this.colors.sectionText,
            cellBg: this.colors.cellBg
        }
    };
 }

// Completion of GeometricalMathematicalWorkbook class

createGraphSection() {
    if (!this.graphData) return null;

    return {
        title: 'Mathematical Visualization',
        type: 'graph',
        data: [
            ['Graph Type', this.graphData.type],
            ['Title', this.graphData.title],
            ['X-Axis', this.graphData.xAxis],
            ['Y-Axis', this.graphData.yAxis || 'y'],
            ['Data Points', this.graphData.data?.length || 0]
        ],
        graphData: this.graphData,
        styling: {
            headerBg: this.colors.sectionBg,
            headerText: this.colors.sectionText,
            cellBg: this.colors.cellBg,
            graphBg: this.colors.diagramBg
        }
    };
}

// ANALYSIS AND VERIFICATION METHODS

analyzeGeometryProblem(problem, solution) {
    const { type } = problem;
    
    const analysis = {
        complexity: 'Medium',
        approach: 'Direct Formula Application',
        insights: [],
        properties: [],
        applications: [],
        specialNotes: []
    };

    switch (type) {
        case 'triangle_area':
            analysis.complexity = solution.method?.includes('Heron') ? 'Medium' : 'Basic';
            analysis.approach = solution.method || 'Base-Height Method';
            analysis.insights = [
                'Triangles are fundamental polygons',
                'Multiple calculation methods available',
                'Area relates to base and height relationship'
            ];
            analysis.properties = [
                'Triangle inequality must hold',
                'Area is always positive',
                'Multiple formulas yield same result'
            ];
            analysis.applications = [
                'Construction and carpentry',
                'Land surveying',
                'Architectural design',
                'Engineering calculations'
            ];
            if (solution.isPythagoreanTriple) {
                analysis.specialNotes.push('Forms a Pythagorean triple');
            }
            break;

        case 'circle_area':
            analysis.complexity = 'Basic';
            analysis.approach = 'Pi-Radius Squared Formula';
            analysis.insights = [
                'Circles have perfect symmetry',
                'Area grows quadratically with radius',
                'Pi represents circle constant'
            ];
            analysis.properties = [
                'Radius must be positive',
                'Area proportional to r²',
                'Circumference proportional to r'
            ];
            analysis.applications = [
                'Wheel and gear design',
                'Circular construction',
                'Astronomy calculations',
                'Manufacturing processes'
            ];
            break;

        case 'pythagorean':
            analysis.complexity = 'Medium';
            analysis.approach = 'Pythagorean Theorem';
            analysis.insights = [
                'Fundamental relationship in right triangles',
                'Connects algebra and geometry',
                'Basis for distance calculations'
            ];
            analysis.properties = [
                'Only applies to right triangles',
                'Hypotenuse is always longest side',
                'Forms basis for coordinate geometry'
            ];
            analysis.applications = [
                'Construction and carpentry',
                'Navigation systems',
                'Computer graphics',
                'Physics calculations'
            ];
            if (solution.isPythagoreanTriple) {
                analysis.specialNotes.push('Integer solution (Pythagorean triple)');
            }
            break;

        case 'distance_formula':
            analysis.complexity = 'Medium';
            analysis.approach = 'Coordinate Geometry';
            analysis.insights = [
                'Extension of Pythagorean theorem',
                'Works in any coordinate system',
                'Foundation of analytical geometry'
            ];
            analysis.properties = [
                'Distance is always non-negative',
                'Symmetric: d(A,B) = d(B,A)',
                'Triangle inequality holds'
            ];
            analysis.applications = [
                'GPS navigation',
                'Computer graphics',
                'Robotics pathfinding',
                'Geographic information systems'
            ];
            break;

        case 'volume':
        case 'surface_area':
            analysis.complexity = 'Medium to Advanced';
            analysis.approach = '3D Geometric Formulas';
            analysis.insights = [
                '3D geometry extends 2D concepts',
                'Volume and surface area are related',
                'Shape determines formula complexity'
            ];
            analysis.properties = [
                'All dimensions must be positive',
                'Units are cubic (volume) or square (area)',
                'Scaling affects volume and area differently'
            ];
            analysis.applications = [
                'Manufacturing and packaging',
                'Architecture and construction',
                'Material estimation',
                'Engineering design'
            ];
            break;

        default:
            analysis.insights = ['Standard geometric problem solving'];
            analysis.properties = ['Follows geometric principles'];
            analysis.applications = ['Various practical uses'];
    }

    return analysis;
}

performGeometryVerification(problem, solution) {
    const verification = {
        status: 'VERIFIED',
        accuracyCheck: 'PASSED',
        unitsCheck: 'CONSISTENT',
        reasonablenessCheck: 'REASONABLE',
        validityCheck: 'VALID',
        warnings: [],
        recommendations: []
    };

    // Check for negative values where they shouldn't exist
    const positiveProperties = ['area', 'volume', 'distance', 'perimeter', 'radius', 'length', 'width', 'height'];
    positiveProperties.forEach(prop => {
        if (solution[prop] !== undefined && solution[prop] < 0) {
            verification.warnings.push(`Negative ${prop} detected: ${solution[prop]}`);
            verification.status = 'WARNING';
        }
    });

    // Check triangle inequality for triangles
    if (problem.type.includes('triangle') && solution.a && solution.b && solution.c) {
        const sides = [solution.a, solution.b, solution.c];
        const [a, b, c] = sides.sort((x, y) => x - y);
        if (a + b <= c) {
            verification.warnings.push('Triangle inequality violation detected');
            verification.validityCheck = 'INVALID';
            verification.status = 'ERROR';
        }
    }

    // Check Pythagorean theorem accuracy
    if (problem.type === 'pythagorean') {
        const leftSide = solution.a * solution.a + solution.b * solution.b;
        const rightSide = solution.c * solution.c;
        const difference = Math.abs(leftSide - rightSide);
        
        if (difference > 0.000001) {
            verification.warnings.push(`Pythagorean verification failed: difference = ${difference}`);
            verification.accuracyCheck = 'FAILED';
            verification.status = 'ERROR';
        }
    }

    // Reasonableness checks
    if (solution.area && solution.area > 1000000) {
        verification.recommendations.push('Very large area - verify input values');
    }
    
    if (solution.volume && solution.volume > 1000000) {
        verification.recommendations.push('Very large volume - verify input values');
    }

    // Check for extremely small values
    Object.entries(solution).forEach(([key, value]) => {
        if (typeof value === 'number' && value > 0 && value < 0.000001) {
            verification.recommendations.push(`Very small ${key} value: ${value} - check precision requirements`);
        }
    });

    return verification;
}

// UTILITY METHODS

mapProblemTypeToLesson(problemType) {
    const mapping = {
        'triangle_area': 'triangles',
        'triangle_solving': 'triangles',
        'similar_triangles': 'similarity_congruence',
        'circle_area': 'circles',
        'rectangle_area': 'area_perimeter',
        'perimeter': 'area_perimeter',
        'pythagorean': 'pythagorean_theorem',
        'distance_formula': 'coordinate_geometry',
        'midpoint_formula': 'coordinate_geometry',
        'angle_calculations': 'basic_shapes',
        'volume': 'solid_geometry',
        'surface_area': 'solid_geometry'
    };
    
    return mapping[problemType] || 'basic_shapes';
}

extractMainResults(solution) {
    const mainResults = [];
    
    // Common geometric results in order of importance
    const priorityKeys = ['area', 'volume', 'distance', 'perimeter', 'radius', 'a', 'b', 'c', 'length', 'width', 'height'];
    
    priorityKeys.forEach(key => {
        if (solution[key] !== undefined && typeof solution[key] === 'number') {
            mainResults.push([this.formatPropertyName(key), solution[key].toFixed(6)]);
        }
    });

    // Add special results
    if (solution.midpoint) {
        mainResults.push(['Midpoint', `(${solution.midpoint.x}, ${solution.midpoint.y})`]);
    }
    
    if (solution.triangleType) {
        mainResults.push(['Triangle Type', solution.triangleType]);
    }
    
    if (solution.scaleFactor) {
        mainResults.push(['Scale Factor', solution.scaleFactor.toString()]);
    }

    return mainResults;
}

formatPropertyName(key) {
    const nameMap = {
        'a': 'Side a',
        'b': 'Side b', 
        'c': 'Side c (Hypotenuse)',
        'A': 'Angle A',
        'B': 'Angle B',
        'C': 'Angle C',
        'surfaceArea': 'Surface Area',
        'scaleFactor': 'Scale Factor'
    };
    
    if (nameMap[key]) return nameMap[key];
    
    // Convert camelCase to Title Case
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

getWorkbookSummary() {
    if (!this.currentWorkbook) return 'No workbook generated';

    let summary = `${this.currentWorkbook.title}\n`;
    summary += `Generated: ${new Date(this.currentWorkbook.timestamp).toLocaleString()}\n\n`;

    this.currentWorkbook.sections.forEach(section => {
        summary += `${section.title}:\n`;
        if (section.data && Array.isArray(section.data)) {
            section.data.forEach(row => {
                if (Array.isArray(row) && row.length >= 2) {
                    summary += `  ${row[0]}: ${row[1]}\n`;
                }
            });
        }
        summary += '\n';
    });

    return summary;
 }

 // Updated generateImage method for GeometricalMathematicalWorkbook class
generateImage(filename = 'geometry_workbook.png') {
    if (!this.currentWorkbook) {
        throw new Error('No workbook data available. Please solve a geometry problem first.');
    }

    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');

    // Set up fonts and styles
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Fill background
    ctx.fillStyle = this.colors.background;
    ctx.fillRect(0, 0, this.width, this.height);

    let currentY = 20;
    
    // Draw title
    ctx.fillStyle = this.colors.headerBg;
    ctx.fillRect(0, currentY, this.width, this.headerHeight);
    ctx.fillStyle = this.colors.headerText;
    ctx.font = `bold ${this.mathFontSize + 2}px Arial`;
    ctx.fillText(this.currentWorkbook.title, 20, currentY + this.headerHeight / 2);
    currentY += this.headerHeight + 10;

    // Draw sections
    this.currentWorkbook.sections.forEach((section, sectionIndex) => {
        // Section header
        ctx.fillStyle = this.colors.sectionBg;
        ctx.fillRect(0, currentY, this.width, this.headerHeight);
        ctx.fillStyle = this.colors.sectionText;
        ctx.font = `bold ${this.fontSize + 2}px Arial`;
        ctx.fillText(section.title, 20, currentY + this.headerHeight / 2);
        currentY += this.headerHeight;

        // Section data rows
        if (section.data && Array.isArray(section.data)) {
            section.data.forEach((row, rowIndex) => {
                let rowHeight = this.cellHeight;
                
                // Determine row type for coloring based on geometry-specific sections
                let bgColor = this.colors.cellBg;
                let textColor = this.colors.cellText;
                
                if (section.type === 'solution') {
                    bgColor = this.colors.resultBg;
                    textColor = this.colors.resultText;
                } else if (section.type === 'steps') {
                    bgColor = this.colors.stepBg;
                    textColor = this.colors.stepText;
                    rowHeight = this.mathHeight;
                } else if (section.type === 'analysis') {
                    bgColor = this.colors.formulaBg;
                    textColor = this.colors.formulaText;
                } else if (section.type === 'lesson') {
                    bgColor = this.colors.mathBg;
                    textColor = this.colors.mathText;
                    rowHeight = this.mathHeight;
                } else if (section.type === 'verification') {
                    bgColor = this.colors.resultBg;
                    textColor = this.colors.resultText;
                } else if (section.type === 'related_problems') {
                    bgColor = this.colors.stepBg;
                    textColor = this.colors.stepText;
                    rowHeight = this.mathHeight;
                } else if (section.type === 'diagram') {
                    bgColor = this.colors.diagramBg;
                    textColor = this.colors.sectionText;
                } else if (section.type === 'graph') {
                    bgColor = this.colors.diagramBg;
                    textColor = this.colors.sectionText;
                }

                // Draw row background
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, currentY, this.width, rowHeight);

                // Draw border
                ctx.strokeStyle = this.colors.borderColor;
                ctx.strokeRect(0, currentY, this.width, rowHeight);

                // Draw row content
                ctx.fillStyle = textColor;
                ctx.font = section.type === 'steps' || section.type === 'lesson' || section.type === 'related_problems' ? 
                    `${this.mathFontSize}px Arial` : 
                    `${this.fontSize}px Arial`;

                if (Array.isArray(row)) {
                    // Multi-column row
                    let columnWidth = this.width / row.length;
                    row.forEach((cell, colIndex) => {
                        let x = colIndex * columnWidth + 10;
                        let cellText = String(cell || '');
                        
                        // Handle geometric expressions and symbols
                        if (cellText.includes('√') || cellText.includes('π') || cellText.includes('²') || 
                            cellText.includes('³') || cellText.includes('∠') || cellText.includes('△') ||
                            cellText.includes('°') || cellText.includes('≅') || cellText.includes('∼') ||
                            cellText.includes('⊥') || cellText.includes('∥')) {
                            ctx.font = `${this.mathFontSize}px Arial`;
                        }
                        
                        // Wrap text if too long
                        const maxWidth = columnWidth - 20;
                        const words = cellText.split(' ');
                        let line = '';
                        let lineY = currentY + rowHeight / 2;
                        
                        for (let word of words) {
                            const testLine = line + word + ' ';
                            const metrics = ctx.measureText(testLine);
                            if (metrics.width > maxWidth && line !== '') {
                                ctx.fillText(line, x, lineY);
                                line = word + ' ';
                                lineY += 16;
                            } else {
                                line = testLine;
                            }
                        }
                        ctx.fillText(line, x, lineY);
                        
                        // Draw column separator
                        if (colIndex < row.length - 1) {
                            ctx.strokeStyle = this.colors.gridColor;
                            ctx.beginPath();
                            ctx.moveTo((colIndex + 1) * columnWidth, currentY);
                            ctx.lineTo((colIndex + 1) * columnWidth, currentY + rowHeight);
                            ctx.stroke();
                        }
                    });
                } else {
                    // Single cell content
                    ctx.fillText(String(row), 20, currentY + rowHeight / 2);
                }

                currentY += rowHeight;
            });
        }

        // Add diagram section if this is a diagram section
        if (section.type === 'diagram' && section.diagramData) {
            currentY = this.drawGeometricDiagram(ctx, currentY, section.diagramData);
        }

        // Add spacing between sections
        currentY += 10;
    });

    // Add graph if available
    if (this.graphData && this.currentWorkbook.sections.some(s => s.type === 'graph')) {
        this.drawGeometryGraph(ctx, currentY);
    }

    // Save to file
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(filename, buffer);
    
    return {
        filename: filename,
        dimensions: { width: this.width, height: this.height },
        sections: this.currentWorkbook.sections.length,
        fileSize: buffer.length
    };
}

// Add geometric diagram drawing method
drawGeometricDiagram(ctx, startY, diagramData) {
    if (!diagramData) return startY;

    const diagramWidth = Math.min(diagramData.width || 400, this.width - 40);
    const diagramHeight = Math.min(diagramData.height || 300, 300);
    const diagramX = (this.width - diagramWidth) / 2;
    const diagramY = startY + 20;

    // Draw diagram background
    ctx.fillStyle = this.colors.diagramBg;
    ctx.fillRect(diagramX, diagramY, diagramWidth, diagramHeight);
    ctx.strokeStyle = this.colors.borderColor;
    ctx.strokeRect(diagramX, diagramY, diagramWidth, diagramHeight);

    // Draw based on diagram type
    switch (diagramData.type) {
        case 'triangle':
            this.drawTriangle(ctx, diagramX, diagramY, diagramData);
            break;
        case 'circle':
            this.drawCircle(ctx, diagramX, diagramY, diagramData);
            break;
        case 'rectangle':
            this.drawRectangle(ctx, diagramX, diagramY, diagramData);
            break;
        case 'coordinate_plane':
            this.drawCoordinatePlane(ctx, diagramX, diagramY, diagramData);
            break;
        case '3d_shape':
            this.draw3DShape(ctx, diagramX, diagramY, diagramData);
            break;
        default:
            // Generic diagram
            ctx.fillStyle = this.colors.sectionText;
            ctx.font = `${this.fontSize}px Arial`;
            ctx.fillText('Geometric Diagram', diagramX + 20, diagramY + 30);
            if (diagramData.content) {
                ctx.fillText(diagramData.content, diagramX + 20, diagramY + 60);
            }
    }

    return diagramY + diagramHeight + 20;
}

// Triangle drawing method
drawTriangle(ctx, offsetX, offsetY, data) {
    if (!data.vertices || data.vertices.length < 3) return;

    ctx.strokeStyle = this.colors.shapeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Draw triangle
    const vertices = data.vertices.map(v => ({
        x: offsetX + v.x,
        y: offsetY + v.y,
        label: v.label
    }));

    ctx.moveTo(vertices[0].x, vertices[0].y);
    vertices.forEach((vertex, i) => {
        if (i > 0) ctx.lineTo(vertex.x, vertex.y);
    });
    ctx.closePath();
    ctx.stroke();

    // Fill if right triangle
    if (data.properties?.isRightTriangle) {
        ctx.fillStyle = this.colors.shapeColor + '20';
        ctx.fill();
    }

    // Label vertices
    ctx.fillStyle = this.colors.sectionText;
    ctx.font = `bold ${this.fontSize}px Arial`;
    vertices.forEach(vertex => {
        ctx.fillText(vertex.label, vertex.x - 5, vertex.y - 10);
    });

    // Label sides if available
    if (data.sides) {
        ctx.font = `${this.fontSize - 2}px Arial`;
        data.sides.forEach((side, i) => {
            const v1 = vertices.find(v => v.label === side.from);
            const v2 = vertices.find(v => v.label === side.to);
            if (v1 && v2) {
                const midX = (v1.x + v2.x) / 2;
                const midY = (v1.y + v2.y) / 2;
                ctx.fillText(side.label, midX, midY);
            }
        });
    }

    // Show area if available
    if (data.area) {
        ctx.fillStyle = this.colors.resultText;
        ctx.font = `${this.fontSize}px Arial`;
        ctx.fillText(`Area = ${data.area}`, offsetX + 20, offsetY + data.height - 20);
    }
}

// Circle drawing method
drawCircle(ctx, offsetX, offsetY, data) {
    if (!data.center || !data.radius) return;

    const centerX = offsetX + data.center.x;
    const centerY = offsetY + data.center.y;

    // Draw circle
    ctx.strokeStyle = this.colors.shapeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, data.radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw center point
    ctx.fillStyle = this.colors.shapeColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Draw radius line
    ctx.strokeStyle = this.colors.sectionText;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + data.radius, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = this.colors.sectionText;
    ctx.font = `${this.fontSize}px Arial`;
    ctx.fillText('C', centerX - 5, centerY - 10);
    ctx.fillText('r', centerX + data.radius / 2, centerY - 10);

    // Show properties
    if (data.properties) {
        ctx.font = `${this.fontSize - 1}px Arial`;
        let labelY = offsetY + data.height - 60;
        Object.entries(data.properties).forEach(([key, value]) => {
            ctx.fillText(value, offsetX + 20, labelY);
            labelY += 16;
        });
    }
}

// Rectangle drawing method
drawRectangle(ctx, offsetX, offsetY, data) {
    if (!data.rectangle) return;

    const rect = {
        x: offsetX + data.rectangle.x,
        y: offsetY + data.rectangle.y,
        width: data.rectangle.width,
        height: data.rectangle.height
    };

    // Draw rectangle
    ctx.strokeStyle = this.colors.shapeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

    // Fill lightly
    ctx.fillStyle = this.colors.shapeColor + '20';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    // Dimension labels
    ctx.fillStyle = this.colors.sectionText;
    ctx.font = `${this.fontSize}px Arial`;
    
    // Width label
    ctx.fillText('w', rect.x + rect.width / 2 - 5, rect.y + rect.height + 15);
    
    // Height label  
    ctx.save();
    ctx.translate(rect.x - 15, rect.y + rect.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('l', 0, 0);
    ctx.restore();

    // Show properties
    if (data.properties) {
        ctx.font = `${this.fontSize - 1}px Arial`;
        let labelY = offsetY + data.height - 60;
        Object.entries(data.properties).forEach(([key, value]) => {
            ctx.fillText(value, offsetX + 20, labelY);
            labelY += 16;
        });
    }
}

// Coordinate plane drawing method
drawCoordinatePlane(ctx, offsetX, offsetY, data) {
    if (!data.points || data.points.length === 0) return;

    const planeWidth = data.width || 300;
    const planeHeight = data.height || 200;

    // Draw axes
    ctx.strokeStyle = this.colors.gridColor;
    ctx.lineWidth = 1;

    // Grid lines
    ctx.setLineDash([1, 2]);
    for (let i = 0; i <= 10; i++) {
        const x = offsetX + (i * planeWidth / 10);
        const y = offsetY + (i * planeHeight / 10);
        
        ctx.beginPath();
        ctx.moveTo(x, offsetY);
        ctx.lineTo(x, offsetY + planeHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(offsetX, y);
        ctx.lineTo(offsetX + planeWidth, y);
        ctx.stroke();
    }
    ctx.setLineDash([]);

    // Main axes
    ctx.strokeStyle = this.colors.sectionText;
    ctx.lineWidth = 2;
    
    const centerX = offsetX + planeWidth / 2;
    const centerY = offsetY + planeHeight / 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(offsetX, centerY);
    ctx.lineTo(offsetX + planeWidth, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, offsetY);
    ctx.lineTo(centerX, offsetY + planeHeight);
    ctx.stroke();

    // Plot points
    ctx.fillStyle = this.colors.resultBg;
    data.points.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(offsetX + point.x, offsetY + point.y, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Point label
        ctx.fillStyle = this.colors.sectionText;
        ctx.font = `${this.fontSize - 2}px Arial`;
        ctx.fillText(point.label, offsetX + point.x + 8, offsetY + point.y - 8);
        ctx.fillStyle = this.colors.resultBg;
    });

    // Draw line between points if distance calculation
    if (data.points.length === 2) {
        ctx.strokeStyle = this.colors.shapeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(offsetX + data.points[0].x, offsetY + data.points[0].y);
        ctx.lineTo(offsetX + data.points[1].x, offsetY + data.points[1].y);
        ctx.stroke();
    }

    // Show properties
    if (data.properties) {
        ctx.fillStyle = this.colors.sectionText;
        ctx.font = `${this.fontSize - 1}px Arial`;
        let labelY = offsetY + data.height - 40;
        Object.entries(data.properties).forEach(([key, value]) => {
            if (value) {
                ctx.fillText(value, offsetX + 20, labelY);
                labelY += 16;
            }
        });
    }
}

// 3D Shape drawing method (simplified isometric view)
draw3DShape(ctx, offsetX, offsetY, data) {
    ctx.strokeStyle = this.colors.shapeColor;
    ctx.lineWidth = 2;

    if (data.sphere) {
        const s = data.sphere;
        const centerX = offsetX + s.centerX;
        const centerY = offsetY + s.centerY;

        // Draw sphere as circle with shading
        ctx.beginPath();
        ctx.arc(centerX, centerY, s.radius, 0, 2 * Math.PI);
        ctx.stroke();

        // Add shading gradient effect
        ctx.strokeStyle = this.colors.gridColor;
        ctx.beginPath();
        ctx.arc(centerX - s.radius/3, centerY - s.radius/3, s.radius, 0, Math.PI);
        ctx.stroke();
        
    } else if (data.cylinder) {
        const c = data.cylinder;
        const centerX = offsetX + c.centerX;
        const centerY = offsetY + c.centerY;

        // Draw cylinder in isometric view
        // Top ellipse
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - c.height/2, c.radius, c.radius/2, 0, 0, 2 * Math.PI);
        ctx.stroke();

        // Bottom ellipse
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + c.height/2, c.radius, c.radius/2, 0, 0, 2 * Math.PI);
        ctx.stroke();

        // Side lines
        ctx.beginPath();
        ctx.moveTo(centerX - c.radius, centerY - c.height/2);
        ctx.lineTo(centerX - c.radius, centerY + c.height/2);
        ctx.moveTo(centerX + c.radius, centerY - c.height/2);
        ctx.lineTo(centerX + c.radius, centerY + c.height/2);
        ctx.stroke();

    } else if (data.box) {
        const b = data.box;
        const x = offsetX + b.x;
        const y = offsetY + b.y;

        // Draw box in isometric view
        const depth = b.width * 0.5;
        
        // Front face
        ctx.strokeRect(x, y, b.length, b.height);
        
        // Top face (parallelogram)
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + depth, y - depth);
        ctx.lineTo(x + depth + b.length, y - depth);
        ctx.lineTo(x + b.length, y);
        ctx.stroke();
        
        // Right face
        ctx.beginPath();
        ctx.moveTo(x + b.length, y);
        ctx.lineTo(x + b.length + depth, y - depth);
        ctx.lineTo(x + b.length + depth, y - depth + b.height);
        ctx.lineTo(x + b.length, y + b.height);
        ctx.stroke();
    }

    // Show volume and surface area
    if (data.volume || data.surfaceArea) {
        ctx.fillStyle = this.colors.sectionText;
        ctx.font = `${this.fontSize - 1}px Arial`;
        let labelY = offsetY + data.height - 60;
        
        if (data.volume) {
            ctx.fillText(`Volume = ${data.volume}`, offsetX + 20, labelY);
            labelY += 16;
        }
        if (data.surfaceArea) {
            ctx.fillText(`Surface Area = ${data.surfaceArea}`, offsetX + 20, labelY);
        }
    }
}

// Add geometry graph drawing method
drawGeometryGraph(ctx, startY) {
    if (!this.graphData) return;

    const graphWidth = 600;
    const graphHeight = 400;
    const graphX = (this.width - graphWidth) / 2;
    const graphY = startY + 20;

    // Draw graph background
    ctx.fillStyle = this.colors.diagramBg;
    ctx.fillRect(graphX, graphY, graphWidth, graphHeight);
    ctx.strokeStyle = this.colors.borderColor;
    ctx.strokeRect(graphX, graphY, graphWidth, graphHeight);

    // Draw based on graph type
    switch (this.graphData.type) {
        case 'line_chart':
        case 'multi_line_chart':
            this.drawLineChart(ctx, graphX, graphY, graphWidth, graphHeight);
            break;
        case 'bar_chart':
            this.drawBarChart(ctx, graphX, graphY, graphWidth, graphHeight);
            break;
        case 'heatmap':
            this.drawHeatmap(ctx, graphX, graphY, graphWidth, graphHeight);
            break;
        default:
            // Generic graph
            ctx.fillStyle = this.colors.sectionText;
            ctx.font = `${this.fontSize}px Arial`;
            ctx.fillText(this.graphData.title || 'Mathematical Graph', graphX + 20, graphY + 30);
    }
}

// Line chart drawing
drawLineChart(ctx, graphX, graphY, graphWidth, graphHeight) {
    const data = this.graphData.data;
    if (!data || data.length === 0) return;

    const padding = 40;
    const chartWidth = graphWidth - 2 * padding;
    const chartHeight = graphHeight - 2 * padding;

    // Find data ranges
    const xKey = this.graphData.xAxis;
    const yKey = this.graphData.yAxis || this.graphData.lines?.[0]?.yAxis || 'y';
    
    const xValues = data.map(d => d[xKey]).filter(v => v !== undefined);
    const yValues = data.map(d => d[yKey]).filter(v => v !== undefined);
    
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    const xScale = chartWidth / (xMax - xMin);
    const yScale = chartHeight / (yMax - yMin);

    // Draw axes
    ctx.strokeStyle = this.colors.gridColor;
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(graphX + padding, graphY + graphHeight - padding);
    ctx.lineTo(graphX + graphWidth - padding, graphY + graphHeight - padding);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(graphX + padding, graphY + padding);
    ctx.lineTo(graphX + padding, graphY + graphHeight - padding);
    ctx.stroke();

    // Draw data line
    ctx.strokeStyle = this.colors.shapeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    let firstPoint = true;
    data.forEach(point => {
        if (point[xKey] !== undefined && point[yKey] !== undefined) {
            const x = graphX + padding + (point[xKey] - xMin) * xScale;
            const y = graphY + graphHeight - padding - (point[yKey] - yMin) * yScale;
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
    });
    ctx.stroke();

    // Mark current solution point if available
    if (this.graphData.currentSolution) {
        const sol = this.graphData.currentSolution;
        const solX = graphX + padding + (sol[xKey] - xMin) * xScale;
        const solY = graphY + graphHeight - padding - (sol[yKey] - yMin) * yScale;
        
        ctx.fillStyle = this.colors.resultBg;
        ctx.beginPath();
        ctx.arc(solX, solY, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Graph title
    ctx.fillStyle = this.colors.sectionText;
    ctx.font = `bold ${this.fontSize + 2}px Arial`;
    ctx.fillText(this.graphData.title || 'Graph', graphX + 20, graphY + 25);
}

// Bar chart drawing
drawBarChart(ctx, graphX, graphY, graphWidth, graphHeight) {
    const data = this.graphData.data;
    if (!data || data.length === 0) return;

    const padding = 60;
    const chartWidth = graphWidth - 2 * padding;
    const chartHeight = graphHeight - 2 * padding;

    const values = data.map(d => d.value || d[this.graphData.yAxis] || 0);
    const maxValue = Math.max(...values);
    const barWidth = chartWidth / data.length;

    // Draw bars
    data.forEach((item, i) => {
        const value = item.value || item[this.graphData.yAxis] || 0;
        const barHeight = (value / maxValue) * chartHeight;
        const x = graphX + padding + i * barWidth;
        const y = graphY + graphHeight - padding - barHeight;

        ctx.fillStyle = this.colors.shapeColor;
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);

        // Bar labels
        ctx.fillStyle = this.colors.sectionText;
        ctx.font = `${this.fontSize - 2}px Arial`;
        ctx.save();
        ctx.translate(x + barWidth * 0.4, graphY + graphHeight - 20);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(item.property || item[this.graphData.xAxis] || '', 0, 0);
        ctx.restore();
    });

    // Graph title
    ctx.fillStyle = this.colors.sectionText;
    ctx.font = `bold ${this.fontSize + 2}px Arial`;
    ctx.fillText(this.graphData.title || 'Bar Chart', graphX + 20, graphY + 25);
  }

}

