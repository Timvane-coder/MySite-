// Enhanced Geometric Mathematical Workbook - Improved Step-by-Step Explanations
import * as math from 'mathjs';

export class EnhancedGeometricMathematicalWorkbook {
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

        // Enhanced explanation options
        this.explanationLevel = options.explanationLevel || 'intermediate'; // 'basic', 'intermediate', 'detailed', 'scaffolded'
        this.includeVerificationInSteps = options.includeVerificationInSteps !== false;
        this.includeConceptualConnections = options.includeConceptualConnections !== false;
        this.includeAlternativeMethods = options.includeAlternativeMethods !== false;
        this.includeErrorPrevention = options.includeErrorPrevention !== false;
        this.includeCommonMistakes = options.includeCommonMistakes !== false;
        this.includePedagogicalNotes = options.includePedagogicalNotes !== false;
        this.verificationDetail = options.verificationDetail || 'detailed';

        this.mathSymbols = this.initializeMathSymbols();
        this.setThemeColors();
        this.initializeGeometricSolvers();
        this.initializeErrorDatabase();
        this.initializeExplanationTemplates();
    }

    initializeGeometricLessons() {
        this.lessons = {
            triangle_properties: {
                title: "Triangle Properties and Classification",
                concepts: [
                    "Sum of interior angles equals 180°",
                    "Types: equilateral, isosceles, scalene",
                    "Right triangles satisfy Pythagorean theorem",
                    "Triangle inequality: sum of two sides > third side"
                ],
                theory: "Triangles are fundamental geometric shapes with three sides and three angles. Their properties form the basis for trigonometry and many geometric proofs.",
                keyFormulas: {
                    "Angle Sum": "∠A + ∠B + ∠C = 180°",
                    "Pythagorean Theorem": "a² + b² = c² (right triangles)",
                    "Area (base-height)": "A = ½bh",
                    "Area (Heron's)": "A = √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2"
                },
                solvingSteps: [
                    "Identify given information (sides, angles)",
                    "Classify triangle type",
                    "Apply appropriate theorem or formula",
                    "Solve for unknown values",
                    "Verify solution makes geometric sense"
                ],
                applications: [
                    "Engineering structures and trusses",
                    "Navigation and surveying",
                    "Computer graphics",
                    "Architectural design"
                ]
            },

            quadrilateral_properties: {
                title: "Quadrilateral Properties",
                concepts: [
                    "Sum of interior angles equals 360°",
                    "Types: square, rectangle, parallelogram, rhombus, trapezoid",
                    "Parallel sides and equal angles define special types",
                    "Diagonals have special properties in each type"
                ],
                theory: "Quadrilaterals are four-sided polygons with varying properties based on side lengths, angles, and parallel relationships.",
                keyFormulas: {
                    "Angle Sum": "∠A + ∠B + ∠C + ∠D = 360°",
                    "Rectangle Area": "A = length × width",
                    "Parallelogram Area": "A = base × height",
                    "Trapezoid Area": "A = ½(b₁ + b₂)h"
                },
                solvingSteps: [
                    "Identify quadrilateral type",
                    "List known sides and angles",
                    "Apply properties specific to that type",
                    "Use angle sum or side relationships",
                    "Calculate area or perimeter as needed"
                ],
                applications: [
                    "Floor plans and room layouts",
                    "Land surveying",
                    "Tile and paving patterns",
                    "Frame construction"
                ]
            },

            circle_geometry: {
                title: "Circle Properties and Measurements",
                concepts: [
                    "All points equidistant from center",
                    "Radius, diameter, circumference, and area relationships",
                    "Central angles and inscribed angles",
                    "Tangent lines perpendicular to radius"
                ],
                theory: "Circles are perfectly symmetric shapes defined by a center point and radius. They have unique properties involving angles, arcs, and chord relationships.",
                keyFormulas: {
                    "Circumference": "C = 2πr = πd",
                    "Area": "A = πr²",
                    "Arc Length": "s = rθ (θ in radians)",
                    "Sector Area": "A = ½r²θ"
                },
                solvingSteps: [
                    "Identify given measurements (radius, diameter, etc.)",
                    "Determine what to find",
                    "Select appropriate formula",
                    "Substitute values and calculate",
                    "Include correct units"
                ],
                applications: [
                    "Wheel and gear design",
                    "Circular motion physics",
                    "Astronomy and planetary orbits",
                    "Architectural arches and domes"
                ]
            },

            polygon_properties: {
                title: "Polygon Properties and Calculations",
                concepts: [
                    "Regular vs irregular polygons",
                    "Interior angle sum: (n-2) × 180°",
                    "Exterior angle sum: always 360°",
                    "Symmetry and diagonals"
                ],
                theory: "Polygons are closed figures with three or more straight sides. Regular polygons have equal sides and angles, while irregular polygons vary.",
                keyFormulas: {
                    "Interior Angle Sum": "(n-2) × 180°",
                    "Each Interior Angle (regular)": "(n-2) × 180° / n",
                    "Each Exterior Angle (regular)": "360° / n",
                    "Number of Diagonals": "n(n-3)/2"
                },
                solvingSteps: [
                    "Count number of sides (n)",
                    "Determine if regular or irregular",
                    "Apply angle sum formulas",
                    "Calculate individual angles if regular",
                    "Find perimeter and area as needed"
                ],
                applications: [
                    "Honeycomb structures",
                    "Tessellations and tiling",
                    "Crystal structures",
                    "Game board design"
                ]
            },

            pythagorean_theorem: {
                title: "Pythagorean Theorem and Applications",
                concepts: [
                    "Applies to right triangles only",
                    "a² + b² = c² where c is hypotenuse",
                    "Can find any side given two sides",
                    "Used to verify right angles"
                ],
                theory: "The Pythagorean theorem relates the three sides of a right triangle and is one of the most fundamental relationships in geometry.",
                keyFormulas: {
                    "Standard Form": "a² + b² = c²",
                    "Find Hypotenuse": "c = √(a² + b²)",
                    "Find Leg": "a = √(c² - b²)",
                    "Distance Formula": "d = √[(x₂-x₁)² + (y₂-y₁)²]"
                },
                solvingSteps: [
                    "Identify the right angle and hypotenuse",
                    "Label legs as a and b, hypotenuse as c",
                    "Substitute known values into formula",
                    "Solve for unknown side",
                    "Verify solution is positive and reasonable"
                ],
                applications: [
                    "Distance calculations in coordinate geometry",
                    "Construction and carpentry",
                    "Navigation and GPS",
                    "Computer graphics and game design"
                ]
            },

            area_calculations: {
                title: "Area Formulas and Calculations",
                concepts: [
                    "Different formulas for different shapes",
                    "Units are always squared",
                    "Composite figures need decomposition",
                    "Area measures surface coverage"
                ],
                theory: "Area quantifies the two-dimensional space enclosed by a shape. Each geometric figure has specific area formulas derived from its properties.",
                keyFormulas: {
                    "Rectangle": "A = lw",
                    "Triangle": "A = ½bh",
                    "Circle": "A = πr²",
                    "Trapezoid": "A = ½(b₁+b₂)h",
                    "Parallelogram": "A = bh"
                },
                solvingSteps: [
                    "Identify the shape(s)",
                    "Find or calculate necessary dimensions",
                    "Apply appropriate area formula",
                    "For composite figures, add or subtract areas",
                    "Include squared units"
                ],
                applications: [
                    "Real estate and property measurement",
                    "Material estimation (paint, carpet, etc.)",
                    "Agricultural field planning",
                    "Manufacturing and fabrication"
                ]
            },

            perimeter_calculations: {
                title: "Perimeter and Circumference",
                concepts: [
                    "Sum of all side lengths",
                    "Units are linear (not squared)",
                    "Special formulas for circles",
                    "Measures distance around shape"
                ],
                theory: "Perimeter measures the total distance around the boundary of a two-dimensional shape.",
                keyFormulas: {
                    "General": "P = sum of all sides",
                    "Rectangle": "P = 2l + 2w = 2(l+w)",
                    "Square": "P = 4s",
                    "Circle": "C = 2πr = πd",
                    "Regular Polygon": "P = n × s"
                },
                solvingSteps: [
                    "Identify all sides of the figure",
                    "Measure or calculate each side length",
                    "Add all side lengths",
                    "For circles, use circumference formula",
                    "Include linear units"
                ],
                applications: [
                    "Fencing and boundary marking",
                    "Race track design",
                    "Picture framing",
                    "Border materials estimation"
                ]
            },

            volume_calculations: {
                title: "Volume of 3D Solids",
                concepts: [
                    "Measures three-dimensional space",
                    "Units are cubed",
                    "Different formulas for different solids",
                    "Base area × height for prisms"
                ],
                theory: "Volume quantifies the three-dimensional space occupied by a solid object. Understanding cross-sections helps visualize volume formulas.",
                keyFormulas: {
                    "Rectangular Prism": "V = lwh",
                    "Cube": "V = s³",
                    "Cylinder": "V = πr²h",
                    "Cone": "V = ⅓πr²h",
                    "Sphere": "V = ⁴⁄₃πr³",
                    "Pyramid": "V = ⅓Bh"
                },
                solvingSteps: [
                    "Identify the type of solid",
                    "Find necessary dimensions (radius, height, etc.)",
                    "Apply appropriate volume formula",
                    "Calculate with correct operations",
                    "Include cubed units"
                ],
                applications: [
                    "Container capacity",
                    "Packaging design",
                    "Fluid mechanics",
                    "Architecture and construction"
                ]
            },

            surface_area: {
                title: "Surface Area of 3D Solids",
                concepts: [
                    "Sum of areas of all faces",
                    "Units are squared",
                    "Nets help visualize surface area",
                    "Different formulas for different solids"
                ],
                theory: "Surface area measures the total area covering the outside of a three-dimensional object.",
                keyFormulas: {
                    "Rectangular Prism": "SA = 2(lw + lh + wh)",
                    "Cube": "SA = 6s²",
                    "Cylinder": "SA = 2πr² + 2πrh = 2πr(r+h)",
                    "Cone": "SA = πr² + πrl",
                    "Sphere": "SA = 4πr²"
                },
                solvingSteps: [
                    "Identify the solid shape",
                    "Determine all necessary dimensions",
                    "Apply surface area formula",
                    "For complex shapes, add areas of all faces",
                    "Include squared units"
                ],
                applications: [
                    "Material cost estimation",
                    "Heat transfer calculations",
                    "Painting and coating",
                    "Gift wrapping"
                ]
            },

            similarity_congruence: {
                title: "Similar and Congruent Figures",
                concepts: [
                    "Congruent: same size and shape",
                    "Similar: same shape, proportional sizes",
                    "Corresponding parts have same ratios",
                    "Scale factors relate similar figures"
                ],
                theory: "Similarity and congruence describe relationships between geometric figures. Congruent figures are identical, while similar figures have the same shape but different sizes.",
                keyFormulas: {
                    "Scale Factor": "k = corresponding length ratio",
                    "Area Ratio": "Area₂/Area₁ = k²",
                    "Volume Ratio": "Volume₂/Volume₁ = k³",
                    "Corresponding Angles": "Equal in similar figures"
                },
                solvingSteps: [
                    "Identify corresponding parts",
                    "Calculate scale factor if similar",
                    "Set up proportions for unknown lengths",
                    "Solve proportions",
                    "Verify answer makes sense"
                ],
                applications: [
                    "Map scales",
                    "Model building",
                    "Photography and enlargements",
                    "Architectural blueprints"
                ]
            },

            coordinate_geometry: {
                title: "Coordinate Geometry",
                concepts: [
                    "Points located by (x, y) coordinates",
                    "Distance formula from Pythagorean theorem",
                    "Midpoint averages coordinates",
                    "Slope measures steepness"
                ],
                theory: "Coordinate geometry combines algebra and geometry, allowing geometric problems to be solved using algebraic methods.",
                keyFormulas: {
                    "Distance": "d = √[(x₂-x₁)² + (y₂-y₁)²]",
                    "Midpoint": "M = ((x₁+x₂)/2, (y₁+y₂)/2)",
                    "Slope": "m = (y₂-y₁)/(x₂-x₁)",
                    "Point-Slope Form": "y - y₁ = m(x - x₁)"
                },
                solvingSteps: [
                    "Plot points on coordinate plane if helpful",
                    "Identify which formula to use",
                    "Substitute coordinate values",
                    "Simplify and solve",
                    "Interpret result geometrically"
                ],
                applications: [
                    "GPS and navigation",
                    "Computer graphics",
                    "Physics motion problems",
                    "Data visualization"
                ]
            },

            transformations: {
                title: "Geometric Transformations",
                concepts: [
                    "Translation: slides figure",
                    "Rotation: turns figure around point",
                    "Reflection: flips figure over line",
                    "Dilation: enlarges or reduces figure"
                ],
                theory: "Geometric transformations move or change figures while preserving certain properties. Rigid transformations preserve size and shape.",
                keyFormulas: {
                    "Translation": "(x, y) → (x+a, y+b)",
                    "Reflection over x-axis": "(x, y) → (x, -y)",
                    "Reflection over y-axis": "(x, y) → (-x, y)",
                    "Rotation 90° CCW": "(x, y) → (-y, x)",
                    "Dilation": "(x, y) → (kx, ky)"
                },
                solvingSteps: [
                    "Identify type of transformation",
                    "Note the transformation parameters",
                    "Apply transformation rule to each point",
                    "Verify image properties",
                    "Graph if visualization needed"
                ],
                applications: [
                    "Computer animation",
                    "Pattern design",
                    "Robotics",
                    "Image processing"
                ]
            }
        };
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
                graphBg: '#f8f9fa',
                vertexBg: '#ffe6e6'
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
                graphBg: '#f1f8ff',
                vertexBg: '#ffe0e6'
            }
        };

        this.colors = themes[this.theme] || themes.excel;
    }

    initializeMathSymbols() {
        return {
            // Mathematical operators
            'degree': '°', 'pi': 'π', 'approx': '≈', 'sqrt': '√',
            'infinity': '∞', 'plusminus': '±',
            // Greek letters
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'Δ',
            'theta': 'θ', 'lambda': 'λ', 'mu': 'μ', 'phi': 'φ',
            // Geometric symbols
            'angle': '∠', 'triangle': '△', 'perpendicular': '⊥', 
            'parallel': '∥', 'congruent': '≅', 'similar': '∼',
            'therefore': '∴', 'because': '∵'
        };
    }

    initializeGeometricSolvers() {
        this.geometricTypes = {
            // Triangle problems
            triangle_angles: {
                patterns: [
                    /triangle.*angle/i,
                    /find.*angle.*triangle/i,
                    /angle.*sum.*triangle/i
                ],
                solver: this.solveTriangleAngles.bind(this),
                name: 'Triangle Angle Problems',
                category: 'triangles',
                description: 'Solves for unknown angles in triangles using angle sum property'
            },

            pythagorean: {
                patterns: [
                    /pythagorean/i,
                    /right.*triangle.*side/i,
                    /hypotenuse/i,
                    /a\^2.*b\^2.*c\^2/i
                ],
                solver: this.solvePythagorean.bind(this),
                name: 'Pythagorean Theorem',
                category: 'triangles',
                description: 'Solves right triangle problems using a² + b² = c²'
            },

            triangle_area: {
                patterns: [
                    /triangle.*area/i,
                    /area.*triangle/i
                ],
                solver: this.solveTriangleArea.bind(this),
                name: 'Triangle Area',
                category: 'area',
                description: 'Calculates triangle area using various methods'
            },

            // Quadrilateral problems
            rectangle_problems: {
                patterns: [
                    /rectangle/i,
                    /rectangular/i
                ],
                solver: this.solveRectangle.bind(this),
                name: 'Rectangle Problems',
                category: 'quadrilaterals',
                description: 'Solves area, perimeter, and diagonal problems for rectangles'
            },

            square_problems: {
                patterns: [
                    /square/i
                ],
                solver: this.solveSquare.bind(this),
                name: 'Square Problems',
                category: 'quadrilaterals',
                description: 'Solves problems involving squares'
            },

            parallelogram_problems: {
                patterns: [
                    /parallelogram/i
                ],
                solver: this.solveParallelogram.bind(this),
                name: 'Parallelogram Problems',
                category: 'quadrilaterals',
                description: 'Solves parallelogram area and perimeter'
            },

            trapezoid_problems: {
                patterns: [
                    /trapezoid/i,
                    /trapezium/i
                ],
                solver: this.solveTrapezoid.bind(this),
                name: 'Trapezoid Problems',
                category: 'quadrilaterals',
                description: 'Solves trapezoid area and perimeter'
            },

            // Circle problems
            circle_circumference: {
                patterns: [
                    /circle.*circumference/i,
                    /circumference.*circle/i
                ],
                solver: this.solveCircleCircumference.bind(this),
                name: 'Circle Circumference',
                category: 'circles',
                description: 'Calculates circumference given radius or diameter'
            },

            circle_area: {
                patterns: [
                    /circle.*area/i,
                    /area.*circle/i
                ],
                solver: this.solveCircleArea.bind(this),
                name: 'Circle Area',
                category: 'circles',
                description: 'Calculates area of circle given radius'
            },

            // Polygon problems
            polygon_angles: {
                patterns: [
                    /polygon.*angle/i,
                    /interior.*angle.*polygon/i,
                    /exterior.*angle.*polygon/i
                ],
                solver: this.solvePolygonAngles.bind(this),
                name: 'Polygon Angle Problems',
                category: 'polygons',
                description: 'Calculates interior and exterior angles of polygons'
            },

            // 3D geometry
            rectangular_prism_volume: {
                patterns: [
                    /rectangular.*prism.*volume/i,
                    /box.*volume/i,
                    /cuboid.*volume/i
                ],
                solver: this.solveRectangularPrismVolume.bind(this),
                name: 'Rectangular Prism Volume',
                category: 'volume',
                description: 'Calculates volume of rectangular prisms'
            },

            cylinder_volume: {
                patterns: [
                    /cylinder.*volume/i,
                    /volume.*cylinder/i
                ],
                solver: this.solveCylinderVolume.bind(this),
                name: 'Cylinder Volume',
                category: 'volume',
                description: 'Calculates volume of cylinders'
            },

            sphere_volume: {
                patterns: [
                    /sphere.*volume/i,
                    /volume.*sphere/i
                ],
                solver: this.solveSphereVolume.bind(this),
                name: 'Sphere Volume',
                category: 'volume',
                description: 'Calculates volume of spheres'
            },

            cone_volume: {
                patterns: [
                    /cone.*volume/i,
                    /volume.*cone/i
                ],
                solver: this.solveConeVolume.bind(this),
                name: 'Cone Volume',
                category: 'volume',
                description: 'Calculates volume of cones'
            },

            // Surface area problems
            rectangular_prism_surface_area: {
                patterns: [
                    /rectangular.*prism.*surface/i,
                    /box.*surface.*area/i
                ],
                solver: this.solveRectangularPrismSurfaceArea.bind(this),
                name: 'Rectangular Prism Surface Area',
                category: 'surface_area',
                description: 'Calculates surface area of rectangular prisms'
            },

            cylinder_surface_area: {
                patterns: [
                    /cylinder.*surface/i,
                    /surface.*area.*cylinder/i
                ],
                solver: this.solveCylinderSurfaceArea.bind(this),
                name: 'Cylinder Surface Area',
                category: 'surface_area',
                description: 'Calculates surface area of cylinders'
            },

            sphere_surface_area: {
                patterns: [
                    /sphere.*surface/i,
                    /surface.*area.*sphere/i
                ],
                solver: this.solveSphereSurfaceArea.bind(this),
                name: 'Sphere Surface Area',
                category: 'surface_area',
                description: 'Calculates surface area of spheres'
            },

            // Coordinate geometry
            distance_formula: {
                patterns: [
                    /distance.*between.*points/i,
                    /distance.*formula/i,
                    /coordinate.*distance/i
                ],
                solver: this.solveDistance.bind(this),
                name: 'Distance Between Points',
                category: 'coordinate_geometry',
                description: 'Calculates distance between two points'
            },

            midpoint_formula: {
                patterns: [
                    /midpoint/i,
                    /middle.*point/i
                ],
                solver: this.solveMidpoint.bind(this),
                name: 'Midpoint Formula',
                category: 'coordinate_geometry',
                description: 'Finds midpoint between two points'
            },

            // Similarity and proportion
            similar_triangles: {
                patterns: [
                    /similar.*triangle/i,
                    /proportion.*triangle/i
                ],
                solver: this.solveSimilarTriangles.bind(this),
                name: 'Similar Triangles',
                category: 'similarity',
                description: 'Solves problems involving similar triangles'
            },

            scale_factor: {
                patterns: [
                    /scale.*factor/i,
                    /dilation/i,
                    /enlargement/i
                ],
                solver: this.solveScaleFactor.bind(this),
                name: 'Scale Factor Problems',
                category: 'similarity',
                description: 'Solves problems involving scale factors and dilations'
            }
        };
    }

    initializeErrorDatabase() {
        this.commonMistakes = {
            triangle_angles: {
                'Use angle sum property': [
                    'Forgetting that angles must sum to exactly 180°',
                    'Using 360° instead of 180° for triangles',
                    'Not accounting for all three angles'
                ],
                'Solve for unknown angle': [
                    'Arithmetic errors in subtraction',
                    'Forgetting to check if result is positive'
                ]
            },
            pythagorean: {
                'Identify hypotenuse': [
                    'Confusing legs with hypotenuse',
                    'Not recognizing hypotenuse as longest side opposite right angle'
                ],
                'Apply formula': [
                    'Squaring incorrectly',
                    'Forgetting to take square root',
                    'Adding when should subtract (finding leg)'
                ]
            },
            circle_area: {
                'Apply formula': [
                    'Using diameter instead of radius',
                    'Forgetting to square the radius',
                    'Using circumference formula instead of area'
                ]
            },
            volume_calculations: {
                'Calculate volume': [
                    'Using area formula instead of volume',
                    'Forgetting to cube units',
                    'Mixing up radius and diameter'
                ]
            }
        };

        this.errorPrevention = {
            unit_checking: {
                reminder: 'Always check if units are consistent',
                method: 'Convert all measurements to same unit before calculating'
            },
            formula_selection: {
                reminder: 'Match the correct formula to the shape',
                method: 'Identify shape type before selecting formula'
            },
            dimension_verification: {
                reminder: 'Verify you have the correct dimension for each measurement',
                method: 'Label each value clearly (radius vs diameter, etc.)'
            }
        };
    }

    initializeExplanationTemplates() {
        this.explanationStyles = {
            conceptual: {
                focus: 'Why this geometric property or relationship exists',
                language: 'intuitive and visually-focused'
            },
            procedural: {
                focus: 'Step-by-step calculation process',
                language: 'sequential instructions'
            },
            visual: {
                focus: 'Spatial relationships and diagram interpretation',
                language: 'visual and spatial descriptions'
            },
            algebraic: {
                focus: 'Mathematical formulas and symbolic manipulation',
                language: 'precise mathematical notation'
            }
        };

        this.difficultyLevels = {
            basic: {
                vocabulary: 'simple geometric terms',
                detail: 'essential steps only',
                examples: 'whole numbers and simple shapes'
            },
            intermediate: {
                vocabulary: 'standard geometric terminology',
                detail: 'main steps with geometric reasoning',
                examples: 'variety of measurements and shapes'
            },
            detailed: {
                vocabulary: 'full geometric vocabulary',
                detail: 'comprehensive explanations with proofs',
                examples: 'complex figures and derivations'
            },
            scaffolded: {
                vocabulary: 'progressive from simple to technical',
                detail: 'guided discovery with questions',
                examples: 'carefully sequenced difficulty'
            }
        };
    }

    // Main solver method
    solveGeometricProblem(config) {
        const { problem, parameters, problemType, context } = config;

        try {
            // Parse the problem
            this.currentProblem = this.parseGeometricProblem(problem, parameters, problemType, context);

            // Solve the problem
            this.currentSolution = this.solveGeometricProblem_Internal(this.currentProblem);

            // Generate solution steps
            this.solutionSteps = this.generateGeometricSteps(this.currentProblem, this.currentSolution);

            // Generate graph data if applicable
            this.generateGeometricGraphData();

            // Generate workbook
            this.generateGeometricWorkbook();

            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                result: this.currentSolution?.result,
                solutionType: this.currentSolution?.solutionType
            };

        } catch (error) {
            throw new Error(`Failed to solve geometric problem: ${error.message}`);
        }
    }

    parseGeometricProblem(problem = '', parameters = {}, problemType = null, context = {}) {
        const cleanInput = problem ? this.cleanMathExpression(problem) : '';

        // If problem type is specified, use it directly
        if (problemType && this.geometricTypes[problemType]) {
            return {
                originalInput: problem || `${problemType} problem`,
                cleanInput: cleanInput,
                type: problemType,
                parameters: { ...parameters },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        // Auto-detect geometric problem type
        for (const [type, config] of Object.entries(this.geometricTypes)) {
            for (const pattern of config.patterns) {
                if (pattern.test(cleanInput) || pattern.test(problem)) {
                    return {
                        originalInput: problem,
                        cleanInput: cleanInput,
                        type: type,
                        parameters: { ...parameters },
                        context: { ...context },
                        parsedAt: new Date().toISOString()
                    };
                }
            }
        }

        throw new Error(`Unable to recognize geometric problem type from: ${problem}`);
    }

    cleanMathExpression(expression) {
        return expression
            .replace(/\s+/g, ' ')
            .replace(/°/g, 'deg')
            .replace(/π/g, 'pi')
            .replace(/√/g, 'sqrt')
            .trim();
    }

    solveGeometricProblem_Internal(problem) {
        const solver = this.geometricTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for geometric problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    // GEOMETRIC SOLVERS

    solveTriangleAngles(problem) {
        const { angle1, angle2, angle3 } = problem.parameters;
        const TRIANGLE_SUM = 180;

        let unknownCount = 0;
        let knownSum = 0;
        let unknownAngle = null;

        if (angle1 !== undefined) knownSum += angle1;
        else { unknownCount++; unknownAngle = 'angle1'; }

        if (angle2 !== undefined) knownSum += angle2;
        else { unknownCount++; unknownAngle = 'angle2'; }

        if (angle3 !== undefined) knownSum += angle3;
        else { unknownCount++; unknownAngle = 'angle3'; }

        if (unknownCount === 0) {
            // All angles given - verify
            return {
                solutionType: 'Verification',
                givenAngles: { angle1, angle2, angle3 },
                sum: angle1 + angle2 + angle3,
                isValid: Math.abs((angle1 + angle2 + angle3) - TRIANGLE_SUM) < 0.001,
                message: Math.abs((angle1 + angle2 + angle3) - TRIANGLE_SUM) < 0.001 ? 
                    'Valid triangle - angles sum to 180°' : 
                    'Invalid triangle - angles do not sum to 180°',
                category: 'triangle_angles'
            };
        }

        if (unknownCount === 1) {
            const unknownValue = TRIANGLE_SUM - knownSum;
            return {
                solutionType: 'Single unknown angle',
                unknownAngle: unknownAngle,
                result: unknownValue,
                knownSum: knownSum,
                calculation: `${TRIANGLE_SUM}° - ${knownSum}° = ${unknownValue}°`,
                verification: this.verifyTriangleAngles(
                    unknownAngle === 'angle1' ? unknownValue : angle1,
                    unknownAngle === 'angle2' ? unknownValue : angle2,
                    unknownAngle === 'angle3' ? unknownValue : angle3
                ),
                category: 'triangle_angles'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need at least two angles to solve',
            category: 'triangle_angles'
        };
    }

    solvePythagorean(problem) {
        const { a, b, c, findSide } = problem.parameters;

        // Determine what to find
        if (findSide === 'c' || (a !== undefined && b !== undefined && c === undefined)) {
            // Find hypotenuse
            const hypotenuse = Math.sqrt(a * a + b * b);
            return {
                solutionType: 'Find hypotenuse',
                given: { leg1: a, leg2: b },
                formula: 'c = √(a² + b²)',
                calculation: `c = √(${a}² + ${b}²) = √(${a*a} + ${b*b}) = √${a*a + b*b}`,
                result: hypotenuse,
                verification: this.verifyPythagorean(a, b, hypotenuse),
                category: 'pythagorean'
            };
        }

        if (findSide === 'a' || (a === undefined && b !== undefined && c !== undefined)) {
            // Find leg a
            if (c * c < b * b) {
                return {
                    solutionType: 'Invalid triangle',
                    message: 'Hypotenuse must be longer than leg',
                    category: 'pythagorean'
                };
            }
            const legA = Math.sqrt(c * c - b * b);
            return {
                solutionType: 'Find leg',
                given: { leg: b, hypotenuse: c },
                formula: 'a = √(c² - b²)',
                calculation: `a = √(${c}² - ${b}²) = √(${c*c} - ${b*b}) = √${c*c - b*b}`,
                result: legA,
                verification: this.verifyPythagorean(legA, b, c),
                category: 'pythagorean'
            };
        }

        if (findSide === 'b' || (a !== undefined && b === undefined && c !== undefined)) {
            // Find leg b
            if (c * c < a * a) {
                return {
                    solutionType: 'Invalid triangle',
                    message: 'Hypotenuse must be longer than leg',
                    category: 'pythagorean'
                };
            }
            const legB = Math.sqrt(c * c - a * a);
            return {
                solutionType: 'Find leg',
                given: { leg: a, hypotenuse: c },
                formula: 'b = √(c² - a²)',
                calculation: `b = √(${c}² - ${a}²) = √(${c*c} - ${a*a}) = √${c*c - a*a}`,
                result: legB,
                verification: this.verifyPythagorean(a, legB, c),
                category: 'pythagorean'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need two sides to find the third',
            category: 'pythagorean'
        };
    }

    solveTriangleArea(problem) {
        const { base, height, side1, side2, side3, method } = problem.parameters;

        if (base !== undefined && height !== undefined) {
            // Base-height method
            const area = 0.5 * base * height;
            return {
                solutionType: 'Base-height method',
                given: { base, height },
                formula: 'A = ½bh',
                calculation: `A = ½ × ${base} × ${height} = ${area}`,
                result: area,
                units: 'square units',
                category: 'triangle_area'
            };
        }

        if (side1 !== undefined && side2 !== undefined && side3 !== undefined) {
            // Heron's formula
            const s = (side1 + side2 + side3) / 2;
            const area = Math.sqrt(s * (s - side1) * (s - side2) * (s - side3));
            return {
                solutionType: "Heron's formula",
                given: { side1, side2, side3 },
                semiperimeter: s,
                formula: 'A = √[s(s-a)(s-b)(s-c)]',
                calculation: `s = (${side1}+${side2}+${side3})/2 = ${s}\nA = √[${s}×${s-side1}×${s-side2}×${s-side3}] = ${area}`,
                result: area,
                units: 'square units',
                category: 'triangle_area'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need base and height, or all three sides',
            category: 'triangle_area'
        };
    }

    solveRectangle(problem) {
        const { length, width, area, perimeter, diagonal, findWhat } = problem.parameters;

        if (findWhat === 'area' || (length !== undefined && width !== undefined && area === undefined)) {
            const calculatedArea = length * width;
            return {
                solutionType: 'Find area',
                given: { length, width },
                formula: 'A = l × w',
                calculation: `A = ${length} × ${width} = ${calculatedArea}`,
                result: calculatedArea,
                units: 'square units',
                category: 'rectangle'
            };
        }

        if (findWhat === 'perimeter' || (length !== undefined && width !== undefined && perimeter === undefined)) {
            const calculatedPerimeter = 2 * (length + width);
            return {
                solutionType: 'Find perimeter',
                given: { length, width },
                formula: 'P = 2(l + w)',
                calculation: `P = 2(${length} + ${width}) = 2(${length + width}) = ${calculatedPerimeter}`,
                result: calculatedPerimeter,
                units: 'linear units',
                category: 'rectangle'
            };
        }

        if (findWhat === 'diagonal' || (length !== undefined && width !== undefined && diagonal === undefined)) {
            const calculatedDiagonal = Math.sqrt(length * length + width * width);
            return {
                solutionType: 'Find diagonal',
                given: { length, width },
                formula: 'd = √(l² + w²)',
                calculation: `d = √(${length}² + ${width}²) = √(${length*length} + ${width*width}) = ${calculatedDiagonal}`,
                result: calculatedDiagonal,
                units: 'linear units',
                note: 'Using Pythagorean theorem',
                category: 'rectangle'
            };
        }

        return {
            solutionType: 'Multiple possibilities',
            message: 'Specify what to find',
            category: 'rectangle'
        };
    }

    solveSquare(problem) {
        const { side, area, perimeter, diagonal, findWhat } = problem.parameters;

        if (side !== undefined) {
            const results = {
                solutionType: 'All square properties',
                given: { side },
                area: side * side,
                perimeter: 4 * side,
                diagonal: side * Math.sqrt(2),
                formulas: {
                    area: 'A = s²',
                    perimeter: 'P = 4s',
                    diagonal: 'd = s√2'
                },
                category: 'square'
            };
            return results;
        }

        if (area !== undefined) {
            const calculatedSide = Math.sqrt(area);
            return {
                solutionType: 'Find side from area',
                given: { area },
                formula: 's = √A',
                calculation: `s = √${area} = ${calculatedSide}`,
                result: calculatedSide,
                category: 'square'
            };
        }

        if (perimeter !== undefined) {
            const calculatedSide = perimeter / 4;
            return {
                solutionType: 'Find side from perimeter',
                given: { perimeter },
                formula: 's = P/4',
                calculation: `s = ${perimeter}/4 = ${calculatedSide}`,
                result: calculatedSide,
                category: 'square'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need side, area, perimeter, or diagonal',
            category: 'square'
        };
    }

    solveParallelogram(problem) {
        const { base, height, side, area, perimeter } = problem.parameters;

        if (base !== undefined && height !== undefined) {
            const calculatedArea = base * height;
            return {
                solutionType: 'Find area',
                given: { base, height },
                formula: 'A = b × h',
                calculation: `A = ${base} × ${height} = ${calculatedArea}`,
                result: calculatedArea,
                units: 'square units',
                note: 'Height is perpendicular distance between parallel sides',
                category: 'parallelogram'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need base and height for area',
            category: 'parallelogram'
        };
    }

    solveTrapezoid(problem) {
        const { base1, base2, height, area } = problem.parameters;

        if (base1 !== undefined && base2 !== undefined && height !== undefined) {
            const calculatedArea = 0.5 * (base1 + base2) * height;
            return {
                solutionType: 'Find area',
                given: { base1, base2, height },
                formula: 'A = ½(b₁ + b₂)h',
                calculation: `A = ½(${base1} + ${base2}) × ${height} = ½(${base1 + base2}) × ${height} = ${calculatedArea}`,
                result: calculatedArea,
                units: 'square units',
                category: 'trapezoid'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need both bases and height',
            category: 'trapezoid'
        };
    }

    solveCircleCircumference(problem) {
        const { radius, diameter } = problem.parameters;

        if (radius !== undefined) {
            const circumference = 2 * Math.PI * radius;
            return {
                solutionType: 'Find circumference from radius',
                given: { radius },
                formula: 'C = 2πr',
                calculation: `C = 2π × ${radius} = ${circumference}`,
                result: circumference,
                approximation: `≈ ${circumference.toFixed(2)}`,
                units: 'linear units',
                category: 'circle'
            };
        }

        if (diameter !== undefined) {
            const circumference = Math.PI * diameter;
            return {
                solutionType: 'Find circumference from diameter',
                given: { diameter },
                formula: 'C = πd',
                calculation: `C = π × ${diameter} = ${circumference}`,
                result: circumference,
                approximation: `≈ ${circumference.toFixed(2)}`,
                units: 'linear units',
                category: 'circle'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need radius or diameter',
            category: 'circle'
        };
    }

    solveCircleArea(problem) {
        const { radius, diameter } = problem.parameters;

        if (radius !== undefined) {
            const area = Math.PI * radius * radius;
            return {
                solutionType: 'Find area from radius',
                given: { radius },
                formula: 'A = πr²',
                calculation: `A = π × ${radius}² = π × ${radius * radius} = ${area}`,
                result: area,
                approximation: `≈ ${area.toFixed(2)}`,
                units: 'square units',
                category: 'circle'
            };
        }

        if (diameter !== undefined) {
            const r = diameter / 2;
            const area = Math.PI * r * r;
            return {
                solutionType: 'Find area from diameter',
                given: { diameter },
                radius: r,
                formula: 'A = πr² (where r = d/2)',
                calculation: `r = ${diameter}/2 = ${r}\nA = π × ${r}² = ${area}`,
                result: area,
                approximation: `≈ ${area.toFixed(2)}`,
                units: 'square units',
                category: 'circle'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need radius or diameter',
            category: 'circle'
        };
    }

    solvePolygonAngles(problem) {
        const { sides, interiorAngle, exteriorAngle, findWhat } = problem.parameters;

        if (sides !== undefined) {
            const interiorSum = (sides - 2) * 180;
            const eachInteriorAngle = interiorSum / sides;
            const eachExteriorAngle = 360 / sides;

            return {
                solutionType: 'Regular polygon angle properties',
                given: { sides },
                formulas: {
                    interiorSum: '(n-2) × 180°',
                    eachInterior: '(n-2) × 180° / n',
                    eachExterior: '360° / n'
                },
                results: {
                    interiorSum: interiorSum,
                    eachInteriorAngle: eachInteriorAngle,
                    eachExteriorAngle: eachExteriorAngle
                },
                category: 'polygon'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need number of sides',
            category: 'polygon'
        };
    }

    solveRectangularPrismVolume(problem) {
        const { length, width, height } = problem.parameters;

        if (length !== undefined && width !== undefined && height !== undefined) {
            const volume = length * width * height;
            return {
                solutionType: 'Find volume',
                given: { length, width, height },
                formula: 'V = l × w × h',
                calculation: `V = ${length} × ${width} × ${height} = ${volume}`,
                result: volume,
                units: 'cubic units',
                category: 'volume'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need length, width, and height',
            category: 'volume'
        };
    }

    solveCylinderVolume(problem) {
        const { radius, height, diameter } = problem.parameters;
        const r = radius !== undefined ? radius : (diameter !== undefined ? diameter / 2 : undefined);

        if (r !== undefined && height !== undefined) {
            const volume = Math.PI * r * r * height;
            return {
                solutionType: 'Find cylinder volume',
                given: radius !== undefined ? { radius, height } : { diameter, height },
                radius: r,
                formula: 'V = πr²h',
                calculation: `V = π × ${r}² × ${height} = π × ${r*r} × ${height} = ${volume}`,
                result: volume,
                approximation: `≈ ${volume.toFixed(2)}`,
                units: 'cubic units',
                category: 'volume'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need radius (or diameter) and height',
            category: 'volume'
        };
    }

    solveSphereVolume(problem) {
        const { radius, diameter } = problem.parameters;
        const r = radius !== undefined ? radius : (diameter !== undefined ? diameter / 2 : undefined);

        if (r !== undefined) {
            const volume = (4/3) * Math.PI * r * r * r;
            return {
                solutionType: 'Find sphere volume',
                given: radius !== undefined ? { radius } : { diameter },
                radius: r,
                formula: 'V = (4/3)πr³',
                calculation: `V = (4/3) × π × ${r}³ = (4/3) × π × ${r*r*r} = ${volume}`,
                result: volume,
                approximation: `≈ ${volume.toFixed(2)}`,
                units: 'cubic units',
                category: 'volume'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need radius or diameter',
            category: 'volume'
        };
    }

    solveConeVolume(problem) {
        const { radius, height, diameter } = problem.parameters;
        const r = radius !== undefined ? radius : (diameter !== undefined ? diameter / 2 : undefined);

        if (r !== undefined && height !== undefined) {
            const volume = (1/3) * Math.PI * r * r * height;
            return {
                solutionType: 'Find cone volume',
                given: radius !== undefined ? { radius, height } : { diameter, height },
                radius: r,
                formula: 'V = (1/3)πr²h',
                calculation: `V = (1/3) × π × ${r}² × ${height} = (1/3) × π × ${r*r} × ${height} = ${volume}`,
                result: volume,
                approximation: `≈ ${volume.toFixed(2)}`,
                units: 'cubic units',
                category: 'volume'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need radius (or diameter) and height',
            category: 'volume'
        };
    }

    solveRectangularPrismSurfaceArea(problem) {
        const { length, width, height } = problem.parameters;

        if (length !== undefined && width !== undefined && height !== undefined) {
            const surfaceArea = 2 * (length * width + length * height + width * height);
            return {
                solutionType: 'Find surface area',
                given: { length, width, height },
                formula: 'SA = 2(lw + lh + wh)',
                calculation: `SA = 2(${length}×${width} + ${length}×${height} + ${width}×${height})\n    = 2(${length*width} + ${length*height} + ${width*height})\n    = 2(${length*width + length*height + width*height})\n    = ${surfaceArea}`,
                result: surfaceArea,
                units: 'square units',
                category: 'surface_area'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need length, width, and height',
            category: 'surface_area'
        };
    }

    solveCylinderSurfaceArea(problem) {
        const { radius, height, diameter } = problem.parameters;
        const r = radius !== undefined ? radius : (diameter !== undefined ? diameter / 2 : undefined);

        if (r !== undefined && height !== undefined) {
            const surfaceArea = 2 * Math.PI * r * (r + height);
            return {
                solutionType: 'Find cylinder surface area',
                given: radius !== undefined ? { radius, height } : { diameter, height },
                radius: r,
                formula: 'SA = 2πr(r + h)',
                calculation: `SA = 2π × ${r} × (${r} + ${height})\n    = 2π × ${r} × ${r + height}\n    = ${surfaceArea}`,
                result: surfaceArea,
                approximation: `≈ ${surfaceArea.toFixed(2)}`,
                units: 'square units',
                category: 'surface_area'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need radius (or diameter) and height',
            category: 'surface_area'
        };
    }

    solveSphereSurfaceArea(problem) {
        const { radius, diameter } = problem.parameters;
        const r = radius !== undefined ? radius : (diameter !== undefined ? diameter / 2 : undefined);

        if (r !== undefined) {
            const surfaceArea = 4 * Math.PI * r * r;
            return {
                solutionType: 'Find sphere surface area',
                given: radius !== undefined ? { radius } : { diameter },
                radius: r,
                formula: 'SA = 4πr²',
                calculation: `SA = 4π × ${r}² = 4π × ${r*r} = ${surfaceArea}`,
                result: surfaceArea,
                approximation: `≈ ${surfaceArea.toFixed(2)}`,
                units: 'square units',
                category: 'surface_area'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need radius or diameter',
            category: 'surface_area'
        };
    }

    solveDistance(problem) {
        const { x1, y1, x2, y2 } = problem.parameters;

        if (x1 !== undefined && y1 !== undefined && x2 !== undefined && y2 !== undefined) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);

            return {
                solutionType: 'Distance between points',
                given: { point1: `(${x1}, ${y1})`, point2: `(${x2}, ${y2})` },
                formula: 'd = √[(x₂-x₁)² + (y₂-y₁)²]',
                calculation: `d = √[(${x2}-${x1})² + (${y2}-${y1})²]\n  = √[${dx}² + ${dy}²]\n  = √[${dx*dx} + ${dy*dy}]\n  = √${dx*dx + dy*dy}\n  = ${distance}`,
                result: distance,
                category: 'coordinate_geometry'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need coordinates of both points',
            category: 'coordinate_geometry'
        };
    }

    solveMidpoint(problem) {
        const { x1, y1, x2, y2 } = problem.parameters;

        if (x1 !== undefined && y1 !== undefined && x2 !== undefined && y2 !== undefined) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return {
                solutionType: 'Midpoint between points',
                given: { point1: `(${x1}, ${y1})`, point2: `(${x2}, ${y2})` },
                formula: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)',
                calculation: `M = ((${x1}+${x2})/2, (${y1}+${y2})/2)\n  = (${x1+x2}/2, ${y1+y2}/2)\n  = (${midX}, ${midY})`,
                result: { x: midX, y: midY },
                resultString: `(${midX}, ${midY})`,
                category: 'coordinate_geometry'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need coordinates of both points',
            category: 'coordinate_geometry'
        };
    }

    solveSimilarTriangles(problem) {
        const { side1_triangle1, side1_triangle2, side2_triangle1, side2_triangle2, unknownSide } = problem.parameters;

        if (side1_triangle1 && side1_triangle2 && side2_triangle1 && !side2_triangle2) {
            const scaleFactor = side1_triangle2 / side1_triangle1;
            const unknown = side2_triangle1 * scaleFactor;

            return {
                solutionType: 'Similar triangles - find unknown side',
                given: {
                    triangle1: { side1: side1_triangle1, side2: side2_triangle1 },
                    triangle2: { side1: side1_triangle2 }
                },
                scaleFactor: scaleFactor,
                formula: 'corresponding sides are proportional',
                calculation: `Scale factor = ${side1_triangle2}/${side1_triangle1} = ${scaleFactor}\nUnknown side = ${side2_triangle1} × ${scaleFactor} = ${unknown}`,
                result: unknown,
                category: 'similarity'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need at least 3 sides with 1 unknown',
            category: 'similarity'
        };
    }

    solveScaleFactor(problem) {
        const { original, scaled, dimension } = problem.parameters;

        if (original !== undefined && scaled !== undefined) {
            const k = scaled / original;

            return {
                solutionType: 'Scale factor calculation',
                given: { original, scaled },
                scaleFactor: k,
                formula: 'k = scaled/original',
                calculation: `k = ${scaled}/${original} = ${k}`,
                effects: {
                    length: `multiply by ${k}`,
                    area: `multiply by ${k}² = ${k*k}`,
                    volume: `multiply by ${k}³ = ${k*k*k}`
                },
                category: 'similarity'
            };
        }

        return {
            solutionType: 'Insufficient information',
            message: 'Need original and scaled dimensions',
            category: 'similarity'
        };
    }

    // VERIFICATION METHODS

    verifyTriangleAngles(angle1, angle2, angle3) {
        const sum = angle1 + angle2 + angle3;
        const isValid = Math.abs(sum - 180) < 0.001;

        return {
            angle1: angle1,
            angle2: angle2,
            angle3: angle3,
            sum: sum,
            expectedSum: 180,
            isValid: isValid,
            difference: Math.abs(sum - 180)
        };
    }

    verifyPythagorean(a, b, c) {
        const leftSide = a * a + b * b;
        const rightSide = c * c;
        const isValid = Math.abs(leftSide - rightSide) < 0.001;

        return {
            leg1: a,
            leg2: b,
            hypotenuse: c,
            leftSide: `${a}² + ${b}² = ${leftSide}`,
            rightSide: `${c}² = ${rightSide}`,
            isValid: isValid,
            difference: Math.abs(leftSide - rightSide)
        };
    }

    verifyRectangleArea(length, width, area) {
        const calculated = length * width;
        const isValid = Math.abs(calculated - area) < 0.001;

        return {
            length: length,
            width: width,
            calculatedArea: calculated,
            givenArea: area,
            isValid: isValid
        };
    }

    verifyCircleArea(radius, area) {
        const calculated = Math.PI * radius * radius;
        const isValid = Math.abs(calculated - area) < 0.001;

        return {
            radius: radius,
            calculatedArea: calculated,
            givenArea: area,
            isValid: isValid
        };
    }

    // STEP GENERATION

    generateGeometricSteps(problem, solution) {
        let baseSteps = this.generateBaseGeometricSteps(problem, solution);

        // Apply enhancements based on options
        if (this.explanationLevel !== 'basic') {
            baseSteps = baseSteps.map((step, index, array) =>
                this.enhanceStepExplanation(step, problem, solution, index, array.length)
            );
        }

        if (this.includeConceptualConnections) {
            baseSteps = this.addStepBridges(baseSteps, problem);
        }

        if (this.includeErrorPrevention) {
            baseSteps = baseSteps.map(step =>
                this.addErrorPrevention(step, problem.type)
            );
        }

        if (this.explanationLevel === 'scaffolded') {
            baseSteps = this.addScaffolding(baseSteps, problem);
        }

        return baseSteps;
    }

    generateBaseGeometricSteps(problem, solution) {
        const { type } = problem;

        switch (type) {
            case 'triangle_angles':
                return this.generateTriangleAngleSteps(problem, solution);
            case 'pythagorean':
                return this.generatePythagoreanSteps(problem, solution);
            case 'triangle_area':
                return this.generateTriangleAreaSteps(problem, solution);
            case 'rectangle_problems':
                return this.generateRectangleSteps(problem, solution);
            case 'circle_area':
            case 'circle_circumference':
                return this.generateCircleSteps(problem, solution);
            case 'rectangular_prism_volume':
                return this.generateVolumeSteps(problem, solution);
            case 'distance_formula':
                return this.generateDistanceSteps(problem, solution);
            default:
                return this.generateGenericGeometricSteps(problem, solution);
        }
    }

    generateTriangleAngleSteps(problem, solution) {
        const { angle1, angle2, angle3 } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'State the angle sum property',
            description: 'The sum of interior angles in any triangle equals 180°',
            expression: '∠A + ∠B + ∠C = 180°',
            reasoning: 'This is a fundamental property of triangles in Euclidean geometry',
            visualHint: 'Imagine tearing off the three corners of a triangle and arranging them - they form a straight line (180°)',
            algebraicRule: 'Triangle Angle Sum Theorem',
            goalStatement: 'Use this property to find the unknown angle'
        });

        if (solution.solutionType === 'Single unknown angle') {
            steps.push({
                stepNumber: 2,
                step: 'Identify known angles',
                description: 'List the angles we know',
                expression: `Known angles: ${angle1 !== undefined ? '∠A = ' + angle1 + '°' : ''} ${angle2 !== undefined ? '∠B = ' + angle2 + '°' : ''} ${angle3 !== undefined ? '∠C = ' + angle3 + '°' : ''}`,
                reasoning: 'We need to identify what information we have before solving',
                visualHint: 'Mark the known angles on a triangle diagram'
            });

            steps.push({
                stepNumber: 3,
                step: 'Calculate sum of known angles',
                description: `Add the angles we know: ${solution.knownSum}°`,
                beforeExpression: `${angle1 !== undefined ? angle1 : '?'} + ${angle2 !== undefined ? angle2 : '?'} + ${angle3 !== undefined ? angle3 : '?'}`,
                afterExpression: `Known sum = ${solution.knownSum}°`,
                reasoning: 'This tells us how much of the 180° is already accounted for'
            });

            steps.push({
                stepNumber: 4,
                step: 'Find unknown angle',
                description: 'Subtract the known sum from 180°',
                beforeExpression: `180° - ${solution.knownSum}°`,
                operation: 'subtraction',
                afterExpression: `${solution.result}°`,
                reasoning: 'The unknown angle must make up the difference to reach 180°',
                algebraicRule: 'Subtraction Property',
                finalAnswer: true,
                numericalResult: solution.result
            });
        }

        return steps;
    }

    generatePythagoreanSteps(problem, solution) {
        const { a, b, c } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'State the Pythagorean theorem',
            description: 'For right triangles, the sum of squares of the legs equals the square of the hypotenuse',
            expression: 'a² + b² = c²',
            reasoning: 'This fundamental relationship applies to all right triangles',
            visualHint: 'The hypotenuse is always the longest side, opposite the right angle',
            algebraicRule: 'Pythagorean Theorem',
            goalStatement: 'Use this to find the unknown side'
        });

        if (solution.solutionType === 'Find hypotenuse') {
            steps.push({
                stepNumber: 2,
                step: 'Identify given sides',
                description: 'We have the two legs of the right triangle',
                expression: `a = ${a}, b = ${b}`,
                reasoning: 'The legs are the two sides that form the right angle'
            });

            steps.push({
                stepNumber: 3,
                step: 'Substitute into formula',
                description: 'Replace a and b with the known values',
                beforeExpression: 'a² + b² = c²',
                afterExpression: `${a}² + ${b}² = c²`,
                reasoning: 'Substitution allows us to work with specific numbers',
                algebraicRule: 'Substitution'
            });

            steps.push({
                stepNumber: 4,
                step: 'Square the legs',
                description: 'Calculate a² and b²',
                beforeExpression: `${a}² + ${b}²`,
                operation: 'square each term',
                afterExpression: `${a*a} + ${b*b} = c²`,
                reasoning: 'Squaring means multiplying the number by itself',
                workingDetails: {
                    calculation1: `${a}² = ${a} × ${a} = ${a*a}`,
                    calculation2: `${b}² = ${b} × ${b} = ${b*b}`
                }
            });

            steps.push({
                stepNumber: 5,
                step: 'Add the squares',
                description: 'Sum the squared values',
                beforeExpression: `${a*a} + ${b*b}`,
                operation: 'addition',
                afterExpression: `${a*a + b*b} = c²`,
                reasoning: 'This gives us c² on the right side'
            });

            steps.push({
                stepNumber: 6,
                step: 'Take the square root',
                description: 'Find c by taking the square root of both sides',
                beforeExpression: `c² = ${a*a + b*b}`,
                operation: '√',
                afterExpression: `c = √${a*a + b*b} = ${solution.result}`,
                reasoning: 'Square root is the inverse operation of squaring',
                algebraicRule: 'Square Root Property',
                finalAnswer: true,
                numericalResult: solution.result
            });
        } else if (solution.solutionType === 'Find leg') {
            steps.push({
                stepNumber: 2,
                step: 'Identify given sides',
                description: 'We have one leg and the hypotenuse',
                expression: `Leg = ${b || a}, Hypotenuse = ${c}`,
                reasoning: 'We need to find the other leg'
            });

            steps.push({
                stepNumber: 3,
                step: 'Rearrange formula',
                description: 'Isolate the unknown leg',
                beforeExpression: 'a² + b² = c²',
                operation: 'rearrange',
                afterExpression: solution.formula,
                reasoning: 'Move the known leg term to the other side',
                algebraicRule: 'Subtraction Property of Equality'
            });

            steps.push({
                stepNumber: 4,
                step: 'Substitute values',
                description: 'Replace with known measurements',
                beforeExpression: solution.formula,
                afterExpression: solution.calculation.split('=')[0],
                reasoning: 'Use the specific measurements given'
            });

            steps.push({
                stepNumber: 5,
                step: 'Calculate and simplify',
                description: 'Perform the arithmetic',
                expression: solution.calculation,
                reasoning: 'Square, subtract, then take square root',
                finalAnswer: true,
                numericalResult: solution.result
            });
        }

        return steps;
    }

    generateTriangleAreaSteps(problem, solution) {
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Identify the area formula',
            description: `Using ${solution.solutionType}`,
            expression: solution.formula,
            reasoning: 'Different formulas apply based on known information',
            visualHint: 'The base and height must be perpendicular'
        });

        if (solution.solutionType === 'Base-height method') {
            const { base, height } = solution.given;

            steps.push({
                stepNumber: 2,
                step: 'Identify given values',
                description: 'Note the base and height measurements',
                expression: `base = ${base}, height = ${height}`,
                reasoning: 'These are the two values we need for the formula'
            });

            steps.push({
                stepNumber: 3,
                step: 'Substitute into formula',
                description: 'Replace b and h with actual values',
                beforeExpression: 'A = ½bh',
                afterExpression: `A = ½ × ${base} × ${height}`,
                reasoning: 'Substitution prepares us for calculation',
                algebraicRule: 'Substitution'
            });

            steps.push({
                stepNumber: 4,
                step: 'Calculate the area',
                description: 'Multiply the values',
                expression: solution.calculation,
                reasoning: 'Multiply in order: ½ × base × height',
                finalAnswer: true,
                numericalResult: solution.result,
                units: solution.units
            });
        }

        return steps;
    }

    generateRectangleSteps(problem, solution) {
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Identify rectangle formula',
            description: `Finding ${solution.solutionType}`,
            expression: solution.formula,
            reasoning: 'Rectangles have specific formulas for different properties',
            visualHint: 'A rectangle has four right angles and opposite sides equal'
        });

        steps.push({
            stepNumber: 2,
            step: 'List given dimensions',
            description: 'Note the measurements provided',
            expression: Object.entries(solution.given).map(([key, val]) => `${key} = ${val}`).join(', '),
            reasoning: 'Identify what information we have'
        });

        steps.push({
            stepNumber: 3,
            step: 'Substitute and calculate',
            description: 'Apply the formula with given values',
            expression: solution.calculation,
            reasoning: 'Perform the operations in the correct order',
            finalAnswer: true,
            numericalResult: solution.result,
            units: solution.units
        });

        return steps;
    }

    generateCircleSteps(problem, solution) {
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'State circle formula',
            description: solution.solutionType,
            expression: solution.formula,
            reasoning: 'Circle formulas use π (pi) ≈ 3.14159...',
            visualHint: 'All points on a circle are equidistant from the center'
        });

        steps.push({
            stepNumber: 2,
            step: 'Identify given value',
            description: 'Note the radius or diameter',
            expression: Object.entries(solution.given).map(([key, val]) => `${key} = ${val}`).join(', '),
            reasoning: 'This is what we need to substitute into the formula'
        });

        if (solution.radius && problem.parameters.diameter) {
            steps.push({
                stepNumber: 3,
                step: 'Convert diameter to radius',
                description: 'Radius is half of diameter',
                expression: `r = d/2 = ${problem.parameters.diameter}/2 = ${solution.radius}`,
                reasoning: 'Most circle formulas use radius, not diameter'
            });
        }

        steps.push({
            stepNumber: steps.length + 1,
            step: 'Calculate result',
            description: 'Apply the formula',
            expression: solution.calculation,
            reasoning: 'Use π ≈ 3.14159 for calculation',
            finalAnswer: true,
            numericalResult: solution.result,
            approximation: solution.approximation,
            units: solution.units
        });

        return steps;
    }

    generateVolumeSteps(problem, solution) {
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Identify volume formula',
            description: solution.solutionType,
            expression: solution.formula,
            reasoning: '3D volume measures cubic units',
            visualHint: 'Volume measures the space inside a 3D object'
        });

        steps.push({
            stepNumber: 2,
            step: 'List dimensions',
            description: 'Note all measurements',
            expression: Object.entries(solution.given).map(([key, val]) => `${key} = ${val}`).join(', '),
            reasoning: 'We need all three dimensions for volume'
        });

        steps.push({
            stepNumber: 3,
            step: 'Calculate volume',
            description: 'Multiply the dimensions',
            expression: solution.calculation,
            reasoning: 'Follow order of operations',
            finalAnswer: true,
            numericalResult: solution.result,
            units: solution.units
        });

        return steps;
    }

    generateDistanceSteps(problem, solution) {
        const { x1, y1, x2, y2 } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'State distance formula',
            description: 'Formula derived from Pythagorean theorem',
            expression: solution.formula,
            reasoning: 'Distance is the hypotenuse of right triangle formed by horizontal and vertical changes',
            visualHint: 'Plot points on coordinate plane and visualize the right triangle',
            algebraicRule: 'Distance Formula'
        });

        steps.push({
            stepNumber: 2,
            step: 'Identify coordinates',
            description: 'Label the two points',
            expression: `Point 1: (${x1}, ${y1}), Point 2: (${x2}, ${y2})`,
            reasoning: 'Clear labeling prevents confusion'
        });

        steps.push({
            stepNumber: 3,
            step: 'Calculate coordinate differences',
            description: 'Find horizontal and vertical changes',
            expression: `Δx = ${x2} - ${x1} = ${x2 - x1}\nΔy = ${y2} - ${y1} = ${y2 - y1}`,
            reasoning: 'These differences form the legs of our right triangle'
        });

        steps.push({
            stepNumber: 4,
            step: 'Apply distance formula',
            description: 'Substitute and calculate',
            expression: solution.calculation,
            reasoning: 'Square the differences, add them, then take square root',
            finalAnswer: true,
            numericalResult: solution.result
        });

        return steps;
    }

    generateGenericGeometricSteps(problem, solution) {
        return [{
            stepNumber: 1,
            step: 'Geometric problem',
            description: 'Solve using appropriate geometric principles',
            expression: problem.type || 'Geometric calculation',
            reasoning: 'Apply relevant geometric formulas and theorems',
            solution: solution
        }];
    }

    // ENHANCED EXPLANATION METHODS

    enhanceStepExplanation(step, problem, solution, stepIndex, totalSteps) {
        const enhanced = {
            ...step,
            stepNumber: stepIndex + 1,
            totalSteps: totalSteps,

            // Multiple explanation formats
            explanations: {
                conceptual: this.getConceptualExplanation(step, problem),
                procedural: this.getProceduralExplanation(step),
                visual: this.getVisualExplanation(step, problem),
                algebraic: this.getAlgebraicExplanation(step)
            },

            // Difficulty-adapted explanations
            adaptiveExplanation: this.getAdaptiveExplanation(step, this.explanationLevel),

            // Learning support
            learningSupport: {
                prerequisiteSkills: this.identifyPrerequisites(step, problem.type),
                keyVocabulary: this.identifyKeyVocabulary(step),
                connectionsToPrevious: stepIndex > 0 ? this.connectToPreviousStep(step, stepIndex) : null
            }
        };

        return enhanced;
    }

    addStepBridges(steps, problem) {
        const enhancedSteps = [];

        for (let i = 0; i < steps.length; i++) {
            enhancedSteps.push(steps[i]);

            if (i < steps.length - 1) {
                enhancedSteps.push({
                    stepType: 'bridge',
                    title: 'Connecting to Next Step',
                    explanation: this.generateStepBridge(steps[i], steps[i + 1]),
                    reasoning: this.explainStepProgression(steps[i], steps[i + 1]),
                    strategicThinking: this.explainStepStrategy(steps[i + 1])
                });
            }
        }

        return enhancedSteps;
    }

    addErrorPrevention(step, problemType) {
        const mistakes = this.commonMistakes[problemType]?.[step.step] || [];

        return {
            ...step,
            errorPrevention: {
                commonMistakes: mistakes,
                preventionTips: this.generatePreventionTips(step, problemType),
                checkPoints: this.generateCheckPoints(step),
                warningFlags: this.identifyWarningFlags(step, problemType)
            },
            validation: {
                selfCheck: this.generateSelfCheckQuestion(step),
                expectedResult: this.describeExpectedResult(step),
                troubleshooting: this.generateTroubleshootingTips(step)
            }
        };
    }

    addScaffolding(steps, problem) {
        return steps.map((step, index) => ({
            ...step,
            scaffolding: {
                guidingQuestions: this.generateGuidingQuestions(step, problem),
                subSteps: this.breakIntoSubSteps(step),
                hints: this.generateProgressiveHints(step),
                practiceVariation: this.generatePracticeVariation(step, problem)
            },
            metacognition: {
                thinkingProcess: this.explainThinkingProcess(step),
                decisionPoints: this.identifyDecisionPoints(step),
                alternativeApproaches: this.suggestAlternativeMethods(step, problem)
            }
        }));
    }

    // HELPER METHODS

    getConceptualExplanation(step, problem) {
        const conceptualExplanations = {
            'State the angle sum property': 'The angles in a triangle always add up to 180° because of how triangles exist in flat (Euclidean) space. This is one of the most fundamental properties of triangles.',
            'State the Pythagorean theorem': 'In a right triangle, the relationship between the sides creates a perfect mathematical balance. The square of the longest side equals the sum of squares of the other two sides.',
            'Identify the area formula': 'Area measures how much flat space a shape covers. For triangles, we use half of base times height because a triangle is half of a parallelogram.'
        };

        return conceptualExplanations[step.step] || 'This step applies a geometric principle to move toward our solution.';
    }

    getProceduralExplanation(step) {
        if (step.operation) {
            return `1. Note the current expression\n2. Apply ${step.operation}\n3. Simplify the result\n4. Write the new expression`;
        }
        return 'Follow the geometric procedure for this calculation.';
    }

    getVisualExplanation(step, problem) {
        const visualExplanations = {
            'triangle_angles': 'Draw a triangle and label each angle. The three angles, when arranged together, form a straight line.',
            'pythagorean': 'Visualize squares built on each side of the right triangle. The two smaller squares together equal the largest square.',
            'circle_area': 'Imagine filling the circle with tiny squares. The formula π r² counts all these squares.',
            'rectangle_problems': 'Picture the rectangle as a grid of unit squares. Area counts all the squares.'
        };

        return visualExplanations[problem.type] || 'Visualize the geometric shape and relationships.';
    }

    getAlgebraicExplanation(step) {
        const algebraicRules = {
            'State the angle sum property': 'Angle Sum Theorem: For triangle ABC, m∠A + m∠B + m∠C = 180°',
            'State the Pythagorean theorem': 'Pythagorean Theorem: In right triangle with legs a, b and hypotenuse c: a² + b² = c²',
            'Take the square root': 'Square Root Property: If x² = a, then x = √a (taking positive root for length)',
            'Substitute into formula': 'Substitution: Replace variables with known values'
        };

        return algebraicRules[step.step] || 'Apply standard geometric and algebraic principles';
    }

    getAdaptiveExplanation(step, explanationLevel) {
        const adaptations = {
            basic: {
                vocabulary: 'simple terms',
                detail: 'essential information only',
                format: 'short sentences'
            },
            intermediate: {
                vocabulary: 'standard geometric terms',
                detail: 'main concepts with brief explanations',
                format: 'clear step-by-step format'
            },
            detailed: {
                vocabulary: 'full geometric terminology',
                detail: 'comprehensive explanations with proofs',
                format: 'thorough analysis with multiple perspectives'
            },
            scaffolded: {
                vocabulary: 'progressive complexity',
                detail: 'guided discovery approach',
                format: 'questions leading to understanding'
            }
        };

        const level = adaptations[explanationLevel] || adaptations.intermediate;
        return {
            adaptedDescription: this.adaptLanguageLevel(step.description, level),
            adaptedReasoning: this.adaptLanguageLevel(step.reasoning, level),
            complexityLevel: explanationLevel
        };
    }

    connectToPreviousStep(step, stepIndex) {
        return {
            connection: `This step builds on step ${stepIndex} by continuing the solution process`,
            progression: 'We are making progress toward finding the final answer',
            relationship: 'Each step brings us closer to the result'
        };
    }

    explainStepProgression(currentStep, nextStep) {
        return `After ${currentStep.step}, we need to ${nextStep.description.toLowerCase()} to continue solving`;
    }

    explainStepStrategy(nextStep) {
        return `The strategy for "${nextStep.step}" is to ${nextStep.description.toLowerCase()}`;
    }

    generatePreventionTips(step, problemType) {
        const tips = {
            'Calculate sum of known angles': [
                'Add carefully and check your arithmetic',
                'Make sure all angles are in degrees',
                'List angles before adding'
            ],
            'Square the legs': [
                'Remember: squaring means multiplying by itself',
                'Check your multiplication',
                'Keep track of which value is which'
            ]
        };

        return tips[step.step] || ['Double-check your calculations', 'Verify units are consistent'];
    }

    generateCheckPoints(step) {
        return [
            'Verify all values are correctly identified',
            'Check arithmetic calculations',
            'Ensure units are appropriate',
            'Confirm the step moves toward the solution'
        ];
    }

    identifyWarningFlags(step, problemType) {
        const warnings = {
            pythagorean: step.step === 'Take the square root' ?
                ['Make sure to take the positive square root for length'] : [],
            triangle_angles: step.step === 'Find unknown angle' ?
                ['Check that result is positive and less than 180°'] : [],
            circle_area: step.step === 'Calculate result' ?
                ['Make sure you are using radius, not diameter'] : []
        };

        return warnings[problemType] || [];
    }

    generateSelfCheckQuestion(step) {
        const questions = {
            'Calculate sum of known angles': 'Did I add all the known angles correctly?',
            'Take the square root': 'Did I take the square root of both sides?',
            'Substitute into formula': 'Did I substitute the correct values in the right places?'
        };

        return questions[step.step] || 'Does this step make sense and move me toward the solution?';
    }

    describeExpectedResult(step) {
        const expectations = {
            'Calculate sum of known angles': 'A sum less than 180°',
            'Take the square root': 'A positive length value',
            'Calculate the area': 'A positive area value with square units'
        };

        return expectations[step.step] || 'The step should simplify the problem further';
    }

    generateTroubleshootingTips(step) {
        return [
            'If stuck, review the formula',
            'Check for arithmetic errors',
            'Verify you are using the right formula for the shape',
            'Make sure all units are consistent'
        ];
    }

    breakIntoSubSteps(step) {
        if (step.operation) {
            return [
                `Identify what operation is needed: ${step.operation}`,
                'Write out the calculation clearly',
                'Perform the arithmetic carefully',
                'Check your result makes sense',
                'Write the final expression'
            ];
        }

        return ['Understand the current state', 'Determine the next action', 'Execute carefully'];
    }

    generatePracticeVariation(step, problem) {
        return {
            similarProblem: 'Try a similar problem with different measurements',
            practiceHint: 'Practice with simpler numbers first',
            extension: 'Once comfortable, try more complex variations'
        };
    }

    explainThinkingProcess(step) {
        return {
            observe: 'What geometric information do I have?',
            goal: 'What am I trying to find?',
            strategy: 'What formula or theorem will help?',
            execute: 'How do I apply this correctly?',
            verify: 'Does my answer make geometric sense?'
        };
    }

    identifyDecisionPoints(step) {
        return [
            'Choosing which formula to use',
            'Deciding which values to substitute',
            'Selecting the most efficient method'
        ];
    }

    suggestAlternativeMethods(step, problem) {
        const alternatives = {
            'triangle_area': [
                'Could use Heron\'s formula if all sides are known',
                'Could use trigonometry if angle and sides are known'
            ],
            'pythagorean': [
                'Could verify by checking if angle is 90°',
                'Could use trigonometric relationships'
            ]
        };

        return alternatives[problem.type] || ['Alternative approaches exist but this is most direct'];
    }

    explainStepNecessity(currentStep, nextStep) {
        return `${nextStep.step} is necessary because ${currentStep.step} prepared the values we need`;
    }

    explainStepBenefit(nextStep) {
        return `This step will help us get the final numerical answer`;
    }

    generateStepBridge(currentStep, nextStep) {
        return {
            currentState: `We now have: ${currentStep.afterExpression || currentStep.expression}`,
            nextGoal: `Next, we need to: ${nextStep.description}`,
            why: `This step is necessary because: ${this.explainStepNecessity(currentStep, nextStep)}`,
            howItHelps: `This will help us by: ${this.explainStepBenefit(nextStep)}`
        };
    }

    generateGuidingQuestions(step, problem) {
        const questions = {
            'State the angle sum property': [
                'What is special about triangles and their angles?',
                'What does the angle sum theorem tell us?',
                'How can we use this property?'
            ],
            'State the Pythagorean theorem': [
                'What makes this a right triangle?',
                'Which side is the hypotenuse?',
                'How do the sides relate to each other?'
            ],
            'Identify the area formula': [
                'What shape are we working with?',
                'What information do we have?',
                'Which area formula applies to this shape?'
            ],
            'Calculate sum of known angles': [
                'What angles do we already know?',
                'How do we add these angles together?',
                'What does this sum tell us?'
            ],
            'Take the square root': [
                'Why do we need to take the square root?',
                'What is the square root of our value?',
                'Does this answer make sense as a length?'
            ]
        };

        return questions[step.step] || ['What is the purpose of this step?', 'How does this move us toward the solution?'];
    }

    generateProgressiveHints(step) {
        return {
            level1: 'Think about what geometric property or formula applies here.',
            level2: 'Remember to identify all given information first.',
            level3: 'Use the appropriate formula for this shape.',
            level4: step.formula ? `Try using: ${step.formula}` : 'Apply the relevant geometric principle.'
        };
    }

    identifyPrerequisites(step, problemType) {
        const prerequisites = {
            'State the angle sum property': ['Understanding of angles', 'Triangle properties'],
            'State the Pythagorean theorem': ['Right triangles', 'Squaring numbers', 'Square roots'],
            'Calculate the area': ['Multiplication', 'Understanding of area concept'],
            'Take the square root': ['Understanding of square roots', 'Inverse operations'],
            'Substitute into formula': ['Variable substitution', 'Formula recognition']
        };

        return prerequisites[step.step] || ['Basic geometric knowledge'];
    }

    identifyKeyVocabulary(step) {
        const vocabulary = {
            'State the angle sum property': ['angle', 'triangle', 'interior angle', 'sum', 'degree'],
            'State the Pythagorean theorem': ['right triangle', 'hypotenuse', 'leg', 'square', 'square root'],
            'Calculate the area': ['area', 'base', 'height', 'square units'],
            'Identify the area formula': ['formula', 'base', 'height', 'area'],
            'Take the square root': ['square root', 'radical', 'inverse operation']
        };

        return vocabulary[step.step] || [];
    }

    adaptLanguageLevel(text, level) {
        if (!text) return '';

        const adaptations = {
            basic: {
                replacements: {
                    'hypotenuse': 'longest side (across from right angle)',
                    'perpendicular': 'at a right angle to',
                    'theorem': 'rule',
                    'substitute': 'put in place of',
                    'interior angle': 'angle inside',
                    'circumference': 'distance around',
                    'radius': 'distance from center to edge',
                    'diameter': 'distance across through center'
                }
            },
            intermediate: {
                replacements: {
                    'hypotenuse': 'hypotenuse',
                    'perpendicular': 'perpendicular',
                    'theorem': 'theorem',
                    'substitute': 'substitute',
                    'interior angle': 'interior angle',
                    'circumference': 'circumference',
                    'radius': 'radius',
                    'diameter': 'diameter'
                }
            },
            detailed: {
                replacements: {
                    'hypotenuse': 'hypotenuse (longest side opposite the right angle)',
                    'perpendicular': 'perpendicular (forming a 90° angle)',
                    'theorem': 'theorem (proven mathematical statement)',
                    'substitute': 'substitute (replace variable with value)',
                    'interior angle': 'interior angle (angle formed inside the polygon)',
                    'circumference': 'circumference (perimeter of a circle)',
                    'radius': 'radius (distance from center to any point on circle)',
                    'diameter': 'diameter (twice the radius, passes through center)'
                }
            }
        };

        const levelAdaptation = adaptations[level.vocabulary] || adaptations.intermediate;
        let adaptedText = text;

        for (const [term, replacement] of Object.entries(levelAdaptation.replacements)) {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            adaptedText = adaptedText.replace(regex, replacement);
        }

        return adaptedText;
    }

    // GRAPH DATA GENERATION

    generateGeometricGraphData() {
        if (!this.currentSolution) return;

        const { type } = this.currentProblem;

        switch(type) {
            case 'triangle_angles':
                this.graphData = this.generateTriangleGraph();
                break;
            case 'pythagorean':
                this.graphData = this.generateRightTriangleGraph();
                break;
            case 'circle_area':
            case 'circle_circumference':
                this.graphData = this.generateCircleGraph();
                break;
            case 'rectangle_problems':
                this.graphData = this.generateRectangleGraph();
                break;
            case 'distance_formula':
                this.graphData = this.generateCoordinateGraph();
                break;
        }
    }

    generateTriangleGraph() {
        return {
            type: 'triangle',
            properties: 'Angle sum visualization',
            note: 'Visual representation of triangle with labeled angles'
        };
    }

    generateRightTriangleGraph() {
        const { a, b, c } = this.currentProblem.parameters;
        return {
            type: 'right_triangle',
            sides: { a, b, c: this.currentSolution.result },
            note: 'Right triangle with legs and hypotenuse labeled'
        };
    }

    generateCircleGraph() {
        const { radius, diameter } = this.currentProblem.parameters;
        const r = radius || (diameter ? diameter / 2 : this.currentSolution.radius);
        return {
            type: 'circle',
            radius: r,
            note: 'Circle with radius shown'
        };
    }

    generateRectangleGraph() {
        const { length, width } = this.currentProblem.parameters;
        return {
            type: 'rectangle',
            dimensions: { length, width },
            note: 'Rectangle with dimensions labeled'
        };
    }

    generateCoordinateGraph() {
        const { x1, y1, x2, y2 } = this.currentProblem.parameters;
        return {
            type: 'coordinate_points',
            points: [
                { x: x1, y: y1, label: 'Point 1' },
                { x: x2, y: y2, label: 'Point 2' }
            ],
            note: 'Two points on coordinate plane with distance shown'
        };
    }

    // WORKBOOK GENERATION

    generateGeometricWorkbook() {
        if (!this.currentSolution || !this.currentProblem) return;

        const workbook = this.createWorkbookStructure();

        workbook.sections = [
            this.createProblemSection(),
            this.createEnhancedStepsSection(),
            this.createLessonSection(),
            this.createSolutionSection(),
            this.createAnalysisSection(),
            this.createVerificationSection(),
            this.createPedagogicalNotesSection(),
            this.createAlternativeMethodsSection()
        ].filter(section => section !== null);

        this.currentWorkbook = workbook;
    }

    createWorkbookStructure() {
        return {
            title: 'Geometric Mathematical Workbook',
            timestamp: new Date().toISOString(),
            theme: this.theme,
            dimensions: { width: this.width, height: this.height },
            sections: []
        };
    }

    createProblemSection() {
        if (!this.currentProblem) return null;

        const problemData = [
            ['Problem Type', this.geometricTypes[this.currentProblem.type]?.name || this.currentProblem.type],
            ['Category', this.geometricTypes[this.currentProblem.type]?.category || 'geometry']
        ];

        // Add parameter details
        for (const [key, value] of Object.entries(this.currentProblem.parameters)) {
            if (value !== undefined) {
                problemData.push([key, value]);
            }
        }

        return {
            title: 'Problem Statement',
            type: 'problem',
            data: problemData
        };
    }

    createEnhancedStepsSection() {
        if (!this.solutionSteps || this.solutionSteps.length === 0) return null;

        const stepsData = [];

        this.solutionSteps.forEach((step, index) => {
            // Skip bridge steps in data output
            if (step.stepType === 'bridge') {
                stepsData.push(['--- Bridge ---', step.explanation.currentState || '']);
                stepsData.push(['Next Goal', step.explanation.nextGoal || '']);
                stepsData.push(['', '']);
                return;
            }

            // Main step
            stepsData.push(['Step ' + step.stepNumber, step.description]);

            if (step.beforeExpression && step.afterExpression) {
                stepsData.push(['Before', step.beforeExpression]);
                if (step.operation) {
                    stepsData.push(['Operation', step.operation]);
                }
                stepsData.push(['After', step.afterExpression]);
            } else if (step.expression) {
                stepsData.push(['Expression', step.expression]);
            }

            if (step.reasoning) {
                stepsData.push(['Reasoning', step.reasoning]);
            }

            if (step.algebraicRule) {
                stepsData.push(['Rule Used', step.algebraicRule]);
            }

            if (step.visualHint) {
                stepsData.push(['Visual Hint', step.visualHint]);
            }

            if (step.goalStatement) {
                stepsData.push(['Goal', step.goalStatement]);
            }

            // Enhanced explanations
            if (step.explanations && this.explanationLevel === 'detailed') {
                if (step.explanations.conceptual) {
                    stepsData.push(['Conceptual', step.explanations.conceptual]);
                }
                if (step.explanations.visual) {
                    stepsData.push(['Visual', step.explanations.visual]);
                }
            }

            if (step.errorPrevention && this.includeErrorPrevention) {
                const mistakes = step.errorPrevention.commonMistakes;
                if (mistakes && mistakes.length > 0) {
                    stepsData.push(['Common Mistakes', mistakes.join('; ')]);
                }
                const tips = step.errorPrevention.preventionTips;
                if (tips && tips.length > 0) {
                    stepsData.push(['Prevention Tips', tips.join('; ')]);
                }
            }

            if (step.scaffolding && this.explanationLevel === 'scaffolded') {
                const questions = step.scaffolding.guidingQuestions;
                if (questions && questions.length > 0) {
                    stepsData.push(['Guiding Questions', questions.join(' ')]);
                }
            }

            if (step.finalAnswer) {
                stepsData.push(['Final Answer', step.numericalResult + (step.units ? ' ' + step.units : '')]);
                if (step.approximation) {
                    stepsData.push(['Approximation', step.approximation]);
                }
            }

            stepsData.push(['', '']); // Spacing
        });

        return {
            title: 'Enhanced Step-by-Step Solution',
            type: 'steps',
            data: stepsData
        };
    }

    createLessonSection() {
        const { type } = this.currentProblem;
        const category = this.geometricTypes[type]?.category;

        const lessonData = [
            ['Category', category || 'geometry'],
            ['Key Concept', 'Apply geometric formulas and theorems'],
            ['Method', 'Identify shape, select formula, substitute values, calculate']
        ];

        // Add specific lesson information if available
        if (this.lessons && this.lessons[category]) {
            const lesson = this.lessons[category];
            lessonData.push(['', '']);
            lessonData.push(['Topic', lesson.title]);
            if (lesson.theory) {
                lessonData.push(['Theory', lesson.theory]);
            }
        }

        return {
            title: 'Key Concepts',
            type: 'lesson',
            data: lessonData
        };
    }

    createSolutionSection() {
        if (!this.currentSolution) return null;

        const solutionData = [];

        if (this.currentSolution.result !== undefined) {
            const units = this.currentSolution.units || '';
            solutionData.push(['Final Answer', `${this.currentSolution.result}${units ? ' ' + units : ''}`]);
        }

        if (this.currentSolution.approximation) {
            solutionData.push(['Approximation', this.currentSolution.approximation]);
        }

        if (this.currentSolution.solutionType) {
            solutionData.push(['Solution Type', this.currentSolution.solutionType]);
        }

        if (this.currentSolution.formula) {
            solutionData.push(['Formula Used', this.currentSolution.formula]);
        }

        if (this.currentSolution.calculation) {
            solutionData.push(['Calculation', this.currentSolution.calculation]);
        }

        // Add any additional solution properties
        if (this.currentSolution.x !== undefined && this.currentSolution.y !== undefined) {
            solutionData.push(['Result', `(${this.currentSolution.x}, ${this.currentSolution.y})`]);
        }

        return {
            title: 'Final Solution',
            type: 'solution',
            data: solutionData.length > 0 ? solutionData : [['Solution', JSON.stringify(this.currentSolution)]]
        };
    }

    createAnalysisSection() {
        const analysisData = [
            ['Steps Used', this.solutionSteps?.length || 0],
            ['Difficulty Level', this.explanationLevel],
            ['Problem Category', this.geometricTypes[this.currentProblem.type]?.category || 'geometry']
        ];

        if (this.currentSolution.category) {
            analysisData.push(['Specific Type', this.currentSolution.category]);
        }

        if (this.graphData) {
            analysisData.push(['Graph Available', 'Yes']);
            analysisData.push(['Graph Type', this.graphData.type]);
        }

        return {
            title: 'Solution Analysis',
            type: 'analysis',
            data: analysisData
        };
    }

    createVerificationSection() {
        if (!this.currentSolution || !this.currentProblem) return null;

        const verificationData = [];
        const { type } = this.currentProblem;

        verificationData.push(['Verification Method', 'Result']);
        verificationData.push(['', '']); // Spacing

        switch (type) {
            case 'triangle_angles':
                if (this.currentSolution.verification) {
                    const v = this.currentSolution.verification;
                    verificationData.push(['Angle 1', v.angle1 + '°']);
                    verificationData.push(['Angle 2', v.angle2 + '°']);
                    verificationData.push(['Angle 3', v.angle3 + '°']);
                    verificationData.push(['Sum', v.sum + '°']);
                    verificationData.push(['Expected Sum', v.expectedSum + '°']);
                    verificationData.push(['Valid', v.isValid ? 'Yes' : 'No']);
                }
                break;

            case 'pythagorean':
                if (this.currentSolution.verification) {
                    const v = this.currentSolution.verification;
                    verificationData.push(['Leg 1 (a)', v.leg1]);
                    verificationData.push(['Leg 2 (b)', v.leg2]);
                    verificationData.push(['Hypotenuse (c)', v.hypotenuse]);
                    verificationData.push(['Left Side', v.leftSide]);
                    verificationData.push(['Right Side', v.rightSide]);
                    verificationData.push(['Valid', v.isValid ? 'Yes' : 'No']);
                }
                break;

            case 'rectangle_problems':
                if (this.currentSolution.result && this.currentProblem.parameters.length && this.currentProblem.parameters.width) {
                    verificationData.push(['Given Length', this.currentProblem.parameters.length]);
                    verificationData.push(['Given Width', this.currentProblem.parameters.width]);
                    verificationData.push(['Calculated Result', this.currentSolution.result]);
                    verificationData.push(['Status', 'Verified']);
                }
                break;

            default:
                verificationData.push(['Status', 'Solution verified using substitution method']);
                if (this.currentSolution.result !== undefined) {
                    verificationData.push(['Result', this.currentSolution.result]);
                    verificationData.push(['Validity', 'Positive value: ' + (this.currentSolution.result > 0 ? 'Yes' : 'No')]);
                }
        }

        if (this.verificationDetail === 'detailed') {
            verificationData.push(['', '']); // Spacing
            verificationData.push(['Confidence Level', this.calculateVerificationConfidence()]);
            verificationData.push(['Verification Notes', this.getVerificationNotes()]);
        }

        return {
            title: 'Solution Verification',
            type: 'verification',
            data: verificationData,
            confidence: this.calculateVerificationConfidence()
        };
    }

    calculateVerificationConfidence() {
        if (!this.currentSolution || !this.currentProblem) return 'Unknown';

        const { type } = this.currentProblem;

        if (this.currentSolution.verification) {
            return this.currentSolution.verification.isValid ? 'High' : 'Low';
        }

        if (this.currentSolution.result !== undefined && this.currentSolution.result > 0) {
            return 'High';
        }

        if (this.currentSolution.solutionType === 'Insufficient information') {
            return 'N/A';
        }

        return 'Medium';
    }

    getVerificationNotes() {
        const { type } = this.currentProblem;
        const notes = [];

        switch (type) {
            case 'triangle_angles':
                notes.push('Verified using angle sum property (180°)');
                break;
            case 'pythagorean':
                notes.push('Verified using Pythagorean theorem a² + b² = c²');
                break;
            case 'circle_area':
            case 'circle_circumference':
                notes.push('Calculation uses π ≈ 3.14159');
                notes.push('Result should be positive');
                break;
            case 'distance_formula':
                notes.push('Distance calculated using coordinate geometry');
                notes.push('Result represents straight-line distance');
                break;
            default:
                notes.push('Standard geometric verification applied');
        }

        return notes.join('; ');
    }

    createPedagogicalNotesSection() {
        if (!this.includePedagogicalNotes) return null;

        const { type } = this.currentProblem;
        const notes = this.generatePedagogicalNotes(type);

        return {
            title: 'Teaching Notes',
            type: 'pedagogical',
            data: [
                ['Learning Objectives', notes.objectives.join('; ')],
                ['Key Concepts', notes.keyConcepts.join('; ')],
                ['Prerequisites', notes.prerequisites.join('; ')],
                ['Common Difficulties', notes.commonDifficulties.join('; ')],
                ['Extension Ideas', notes.extensions.join('; ')],
                ['Assessment Tips', notes.assessment.join('; ')]
            ]
        };
    }

    generatePedagogicalNotes(problemType) {
        const pedagogicalDatabase = {
            triangle_angles: {
                objectives: [
                    'Apply triangle angle sum property',
                    'Solve for unknown angles',
                    'Verify triangle validity'
                ],
                keyConcepts: [
                    'Angle sum equals 180°',
                    'Interior vs exterior angles',
                    'Triangle classification'
                ],
                prerequisites: [
                    'Understanding of angles',
                    'Basic arithmetic',
                    'Degree measurement'
                ],
                commonDifficulties: [
                    'Confusing angle sum with other properties',
                    'Arithmetic errors',
                    'Not checking if answer is reasonable'
                ],
                extensions: [
                    'Exterior angles',
                    'Polygon angle sums',
                    'Angle relationships in special triangles'
                ],
                assessment: [
                    'Check understanding of 180° property',
                    'Verify computational accuracy',
                    'Test with different triangle types'
                ]
            },
            pythagorean: {
                objectives: [
                    'Apply Pythagorean theorem correctly',
                    'Identify right triangles',
                    'Distinguish between legs and hypotenuse'
                ],
                keyConcepts: [
                    'Right triangle properties',
                    'Relationship a² + b² = c²',
                    'Square and square root operations'
                ],
                prerequisites: [
                    'Understanding of right angles',
                    'Squaring numbers',
                    'Taking square roots'
                ],
                commonDifficulties: [
                    'Confusing legs with hypotenuse',
                    'Squaring errors',
                    'Forgetting to take square root'
                ],
                extensions: [
                    'Distance formula',
                    'Pythagorean triples',
                    'Applications in coordinate geometry'
                ],
                assessment: [
                    'Check identification of hypotenuse',
                    'Verify correct formula application',
                    'Test with various right triangles'
                ]
            },
            circle_area: {
                objectives: [
                    'Calculate circle area using formula',
                    'Distinguish radius from diameter',
                    'Work with π in calculations'
                ],
                keyConcepts: [
                    'Area formula A = πr²',
                    'Radius vs diameter',
                    'Approximation of π'
                ],
                prerequisites: [
                    'Understanding of circles',
                    'Squaring numbers',
                    'Working with π'
                ],
                commonDifficulties: [
                    'Using diameter instead of radius',
                    'Forgetting to square the radius',
                    'Confusion between area and circumference'
                ],
                extensions: [
                    'Sectors and segments',
                    'Circles in coordinate plane',
                    'Related rates problems'
                ],
                assessment: [
                    'Check radius identification',
                    'Verify formula selection',
                    'Test understanding of π'
                ]
            },
            rectangle_problems: {
                objectives: [
                    'Calculate area and perimeter of rectangles',
                    'Apply appropriate formulas',
                    'Understand relationship between dimensions'
                ],
                keyConcepts: [
                    'Area = length × width',
                    'Perimeter = 2(length + width)',
                    'Right angles and parallel sides'
                ],
                prerequisites: [
                    'Multiplication',
                    'Understanding of rectangles',
                    'Unit consistency'
                ],
                commonDifficulties: [
                    'Confusing area and perimeter formulas',
                    'Inconsistent units',
                    'Calculation errors'
                ],
                extensions: [
                    'Composite figures',
                    'Optimization problems',
                    'Real-world applications'
                ],
                assessment: [
                    'Check formula selection',
                    'Verify unit consistency',
                    'Test with various dimensions'
                ]
            }
        };

        return pedagogicalDatabase[problemType] || {
            objectives: ['Solve geometric problems'],
            keyConcepts: ['Apply geometric formulas'],
            prerequisites: ['Basic geometric knowledge'],
            commonDifficulties: ['Various computational errors'],
            extensions: ['More complex problems'],
            assessment: ['Check understanding of process']
        };
    }

    createAlternativeMethodsSection() {
        if (!this.includeAlternativeMethods) return null;

        const { type } = this.currentProblem;
        const alternatives = this.generateAlternativeMethods(type);

        return {
            title: 'Alternative Solution Methods',
            type: 'alternatives',
            data: [
                ['Primary Method Used', alternatives.primaryMethod],
                ['', ''], // Spacing
                ['Alternative Methods', ''],
                ...alternatives.methods.map((method, index) => [
                    `Method ${index + 1}`, `${method.name}: ${method.description}`
                ]),
                ['', ''], // Spacing
                ['Method Comparison', alternatives.comparison]
            ]
        };
    }

    generateAlternativeMethods(problemType) {
        const alternativeDatabase = {
            triangle_angles: {
                primaryMethod: 'Angle sum property (algebraic)',
                methods: [
                    {
                        name: 'Visual Method',
                        description: 'Tear off corners and arrange to show 180°'
                    },
                    {
                        name: 'Exterior Angle Method',
                        description: 'Use exterior angle theorem'
                    }
                ],
                comparison: 'Algebraic method is most precise; visual method builds conceptual understanding'
            },
            pythagorean: {
                primaryMethod: 'Direct application of a² + b² = c²',
                methods: [
                    {
                        name: 'Geometric Proof',
                        description: 'Use area of squares on each side'
                    },
                    {
                        name: 'Trigonometric Method',
                        description: 'Use sine and cosine relationships'
                    },
                    {
                        name: 'Distance Formula',
                        description: 'Apply in coordinate plane'
                    }
                ],
                comparison: 'Direct formula is fastest; geometric proof shows why it works; trigonometry offers alternative for some problems'
            },
            triangle_area: {
                primaryMethod: 'Base × height ÷ 2',
                methods: [
                    {
                        name: "Heron's Formula",
                        description: 'Use all three sides without height'
                    },
                    {
                        name: 'Trigonometric Formula',
                        description: 'Use two sides and included angle: ½ab sin(C)'
                    },
                    {
                        name: 'Coordinate Method',
                        description: 'Use vertex coordinates'
                    }
                ],
                comparison: 'Base-height is simplest when height is known; Heron\'s when only sides known; trigonometry when angle and sides known'
            },
            circle_area: {
                primaryMethod: 'Formula A = πr²',
                methods: [
                    {
                        name: 'Integration Method',
                        description: 'Integrate circular function (calculus)'
                    },
                    {
                        name: 'Approximation Method',
                        description: 'Estimate using inscribed/circumscribed polygons'
                    },
                    {
                        name: 'Sector Addition',
                        description: 'Sum areas of many small sectors'
                    }
                ],
                comparison: 'Direct formula is standard and efficient; integration proves the formula; approximation builds understanding'
            },
            rectangle_problems: {
                primaryMethod: 'Direct formula application',
                methods: [
                    {
                        name: 'Unit Square Counting',
                        description: 'Visualize and count unit squares (for small dimensions)'
                    },
                    {
                        name: 'Decomposition Method',
                        description: 'Break into smaller rectangles and add'
                    },
                    {
                        name: 'Coordinate Geometry',
                        description: 'Use vertices and coordinate formulas'
                    }
                ],
                comparison: 'Direct formulas are most efficient; counting builds understanding; decomposition useful for complex shapes'
            }
        };

        return alternativeDatabase[problemType] || {
            primaryMethod: 'Standard geometric formula',
            methods: [
                {
                    name: 'Alternative Approach',
                    description: 'Other geometric methods may apply'
                }
            ],
            comparison: 'Method choice depends on given information and context'
        };
    }
}

// Export the class
export default EnhancedGeometricMathematicalWorkbook;
