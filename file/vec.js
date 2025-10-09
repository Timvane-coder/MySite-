// Enhanced Vector Mathematical Workbook - Improved Step-by-Step Explanations
import * as math from 'mathjs';

export class EnhancedVectorMathematicalWorkbook {
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
        this.initializeVectorSolvers();
        this.initializeErrorDatabase();
        this.initializeExplanationTemplates();
    }

    initializeVectorLessons() {
        this.lessons = {
            vector_basics: {
                title: "Vector Fundamentals",
                concepts: [
                    "Vectors have magnitude and direction",
                    "Notation: bold v or v⃗ or ⟨x, y, z⟩",
                    "Component form represents coordinates",
                    "Unit vectors: î, ĵ, k̂ along axes"
                ],
                theory: "Vectors are mathematical objects that represent quantities with both magnitude and direction. Unlike scalars (which have only magnitude), vectors are essential for describing physical quantities like velocity, force, and displacement.",
                keyFormulas: {
                    "Component Form": "v = ⟨x, y, z⟩ or v = xî + yĵ + zk̂",
                    "Magnitude": "||v|| = √(x² + y² + z²)",
                    "Unit Vector": "û = v/||v||",
                    "Zero Vector": "0 = ⟨0, 0, 0⟩"
                },
                fundamentalProperties: [
                    "Position vectors start at origin",
                    "Free vectors can be moved parallel to themselves",
                    "Equal vectors have same magnitude and direction",
                    "Opposite vectors: v and -v"
                ],
                applications: [
                    "Physics: force, velocity, acceleration",
                    "Engineering: stress, displacement",
                    "Computer graphics: 3D modeling",
                    "Navigation: direction and distance"
                ]
            },

            vector_addition: {
                title: "Vector Addition and Subtraction",
                concepts: [
                    "Add vectors component-wise",
                    "Geometric: parallelogram or triangle rule",
                    "Commutative: u + v = v + u",
                    "Associative: (u + v) + w = u + (v + w)"
                ],
                theory: "Vector addition combines two or more vectors to produce a resultant vector. Geometrically, this is done by placing the tail of one vector at the head of another (tip-to-tail method) or using the parallelogram rule.",
                keyFormulas: {
                    "Addition": "u + v = ⟨u₁ + v₁, u₂ + v₂, u₃ + v₃⟩",
                    "Subtraction": "u - v = ⟨u₁ - v₁, u₂ - v₂, u₃ - v₃⟩",
                    "Scalar Multiple": "cv = ⟨cx, cy, cz⟩",
                    "Properties": "u + 0 = u, u + (-u) = 0"
                },
                geometricInterpretation: [
                    "Triangle rule: place vectors head-to-tail",
                    "Parallelogram rule: form parallelogram",
                    "Subtraction: u - v = u + (-v)",
                    "Resultant: diagonal from origin"
                ],
                applications: [
                    "Net force calculations",
                    "Relative velocity problems",
                    "Displacement vectors",
                    "Vector fields"
                ]
            },

            scalar_multiplication: {
                title: "Scalar Multiplication",
                concepts: [
                    "Multiply each component by scalar",
                    "Changes magnitude, not direction (if c > 0)",
                    "Reverses direction if c < 0",
                    "Distributive: c(u + v) = cu + cv"
                ],
                theory: "Scalar multiplication scales a vector by a real number. The operation stretches or shrinks the vector and can reverse its direction.",
                keyFormulas: {
                    "Definition": "cv = ⟨cx, cy, cz⟩",
                    "Magnitude": "||cv|| = |c| · ||v||",
                    "Properties": "c(dv) = (cd)v, 1v = v, 0v = 0"
                },
                specialCases: [
                    "c = 1: identity",
                    "c = 0: zero vector",
                    "c = -1: opposite vector",
                    "0 < c < 1: shrinks vector",
                    "c > 1: stretches vector"
                ],
                applications: [
                    "Scaling forces",
                    "Unit vector calculation",
                    "Linear combinations",
                    "Parametric equations"
                ]
            },

            dot_product: {
                title: "Dot Product (Scalar Product)",
                concepts: [
                    "Results in a scalar, not a vector",
                    "Measures projection of one vector onto another",
                    "Related to angle between vectors",
                    "Commutative: u · v = v · u"
                ],
                theory: "The dot product is a fundamental operation that produces a scalar from two vectors. It measures how much two vectors align with each other.",
                keyFormulas: {
                    "Algebraic": "u · v = u₁v₁ + u₂v₂ + u₃v₃",
                    "Geometric": "u · v = ||u|| ||v|| cos θ",
                    "Angle": "cos θ = (u · v)/(||u|| ||v||)",
                    "Properties": "u · u = ||u||²"
                },
                specialCases: [
                    "u · v = 0: vectors are perpendicular",
                    "u · v > 0: angle < 90°",
                    "u · v < 0: angle > 90°",
                    "u · v = ||u|| ||v||: vectors parallel"
                ],
                applications: [
                    "Work: W = F · d",
                    "Projection calculations",
                    "Testing orthogonality",
                    "Component extraction",
                    "Angle determination"
                ]
            },

            cross_product: {
                title: "Cross Product (Vector Product)",
                concepts: [
                    "Results in a vector perpendicular to both",
                    "Magnitude relates to parallelogram area",
                    "Right-hand rule determines direction",
                    "Anti-commutative: u × v = -(v × u)"
                ],
                theory: "The cross product is a binary operation on two vectors in 3D space, producing a third vector perpendicular to both input vectors. The magnitude equals the area of the parallelogram formed by the vectors.",
                keyFormulas: {
                    "Component Form": "u × v = ⟨u₂v₃ - u₃v₂, u₃v₁ - u₁v₃, u₁v₂ - u₂v₁⟩",
                    "Determinant Form": "u × v = |î  ĵ  k̂|  |u₁ u₂ u₃|  |v₁ v₂ v₃|",
                    "Magnitude": "||u × v|| = ||u|| ||v|| sin θ",
                    "Properties": "u × u = 0, u × v = -v × u"
                },
                geometricProperties: [
                    "Result perpendicular to both vectors",
                    "Magnitude = area of parallelogram",
                    "Direction by right-hand rule",
                    "Zero if vectors parallel"
                ],
                applications: [
                    "Torque: τ = r × F",
                    "Angular momentum",
                    "Normal vectors to planes",
                    "Area calculations",
                    "Rotation representations"
                ]
            },

            vector_magnitude: {
                title: "Vector Magnitude and Unit Vectors",
                concepts: [
                    "Magnitude is length of vector",
                    "Always non-negative",
                    "Unit vector has magnitude 1",
                    "Normalization creates unit vector"
                ],
                theory: "The magnitude (or length) of a vector represents its size without regard to direction. Unit vectors provide pure direction information with standardized length.",
                keyFormulas: {
                    "2D Magnitude": "||v|| = √(x² + y²)",
                    "3D Magnitude": "||v|| = √(x² + y² + z²)",
                    "Unit Vector": "û = v/||v||",
                    "Distance": "d = ||v₂ - v₁||"
                },
                properties: [
                    "||v|| ≥ 0, ||v|| = 0 iff v = 0",
                    "||cv|| = |c| ||v||",
                    "||û|| = 1 for any unit vector",
                    "Triangle inequality: ||u + v|| ≤ ||u|| + ||v||"
                ],
                applications: [
                    "Speed from velocity vector",
                    "Distance calculations",
                    "Direction vectors",
                    "Normalizing for comparisons"
                ]
            },

            vector_projection: {
                title: "Vector Projections",
                concepts: [
                    "Scalar projection: component in direction",
                    "Vector projection: vector in direction",
                    "Orthogonal decomposition",
                    "Projection onto subspaces"
                ],
                theory: "Projection of a vector onto another gives the component of the first vector in the direction of the second. This decomposition is fundamental in many applications.",
                keyFormulas: {
                    "Scalar Projection": "comp_v u = (u · v)/||v||",
                    "Vector Projection": "proj_v u = ((u · v)/(v · v))v",
                    "Orthogonal Component": "u - proj_v u",
                    "Decomposition": "u = proj_v u + (u - proj_v u)"
                },
                geometricInterpretation: [
                    "Scalar projection is signed length",
                    "Vector projection is shadow on direction",
                    "Orthogonal part is perpendicular",
                    "Decomposition separates parallel and perpendicular"
                ],
                applications: [
                    "Work calculations",
                    "Force components",
                    "Least squares fitting",
                    "Signal processing"
                ]
            },

            vector_angles: {
                title: "Angles Between Vectors",
                concepts: [
                    "Angle measured using dot product",
                    "Range: [0, π] or [0°, 180°]",
                    "Special angles indicate relationships",
                    "Direction cosines"
                ],
                theory: "The angle between two vectors quantifies their relative orientation. This is computed using the dot product formula and provides important geometric information.",
                keyFormulas: {
                    "Angle Formula": "cos θ = (u · v)/(||u|| ||v||)",
                    "Angle Calculation": "θ = arccos((u · v)/(||u|| ||v||))",
                    "Direction Cosines": "cos α = x/||v||, cos β = y/||v||, cos γ = z/||v||",
                    "Identity": "cos²α + cos²β + cos²γ = 1"
                },
                specialAngles: [
                    "θ = 0°: vectors parallel, same direction",
                    "θ = 90°: vectors perpendicular",
                    "θ = 180°: vectors parallel, opposite direction",
                    "0° < θ < 90°: acute angle",
                    "90° < θ < 180°: obtuse angle"
                ],
                applications: [
                    "Determining orthogonality",
                    "Finding parallel vectors",
                    "Direction analysis",
                    "Optimization problems"
                ]
            },

            linear_combinations: {
                title: "Linear Combinations of Vectors",
                concepts: [
                    "Combination: c₁v₁ + c₂v₂ + ... + cₙvₙ",
                    "Span: all possible linear combinations",
                    "Linear independence",
                    "Basis vectors"
                ],
                theory: "A linear combination forms new vectors by scaling and adding existing vectors. The span of a set of vectors is all vectors that can be created through linear combinations.",
                keyFormulas: {
                    "General Form": "v = c₁v₁ + c₂v₂ + ... + cₙvₙ",
                    "2D Span": "All ℝ² if vectors not parallel",
                    "3D Span": "All ℝ³ if three vectors not coplanar",
                    "Standard Basis": "Any v = xî + yĵ + zk̂"
                },
                fundamentalConcepts: [
                    "Linear independence: no vector is a combination of others",
                    "Basis: linearly independent spanning set",
                    "Dimension: number of basis vectors",
                    "Coordinates: coefficients in basis representation"
                ],
                applications: [
                    "Solving vector equations",
                    "Representing vector spaces",
                    "Computer graphics transformations",
                    "Quantum mechanics states"
                ]
            },

            parametric_lines: {
                title: "Lines and Parametric Equations",
                concepts: [
                    "Parametric form: r(t) = r₀ + tv",
                    "r₀ is point on line, v is direction",
                    "t is parameter (-∞ < t < ∞)",
                    "Different forms are equivalent"
                ],
                theory: "Lines in space are described using vector equations. A line is determined by a point and a direction vector.",
                keyFormulas: {
                    "Vector Form": "r(t) = r₀ + tv = ⟨x₀, y₀, z₀⟩ + t⟨a, b, c⟩",
                    "Parametric Form": "x = x₀ + at, y = y₀ + bt, z = z₀ + ct",
                    "Symmetric Form": "(x - x₀)/a = (y - y₀)/b = (z - z₀)/c",
                    "Two Points": "r(t) = (1-t)P + tQ or r(t) = P + t(Q - P)"
                },
                properties: [
                    "Parallel lines: same direction vector",
                    "Intersecting lines: solve for common point",
                    "Skew lines: non-intersecting, non-parallel",
                    "Distance from point to line"
                ],
                applications: [
                    "Ray tracing in graphics",
                    "Motion along straight paths",
                    "Intersection problems",
                    "Optimization paths"
                ]
            },

            planes: {
                title: "Planes in Space",
                concepts: [
                    "Plane determined by point and normal",
                    "Normal vector perpendicular to plane",
                    "Multiple equivalent forms",
                    "Distance from point to plane"
                ],
                theory: "A plane in 3D space can be defined by a point on the plane and a vector perpendicular to it (normal vector). Alternatively, three non-collinear points determine a plane.",
                keyFormulas: {
                    "Scalar Equation": "ax + by + cz = d where n = ⟨a, b, c⟩ is normal",
                    "Vector Form": "n · (r - r₀) = 0",
                    "Point-Normal": "a(x - x₀) + b(y - y₀) + c(z - z₀) = 0",
                    "Three Points": "Use cross product for normal"
                },
                operations: [
                    "Finding normal: cross product of direction vectors",
                    "Parallel planes: same normal vector",
                    "Perpendicular planes: normal vectors perpendicular",
                    "Distance formula: |ax₁ + by₁ + cz₁ - d|/√(a² + b² + c²)"
                ],
                applications: [
                    "3D modeling surfaces",
                    "Physics: inclined planes",
                    "Computer graphics rendering",
                    "Structural engineering"
                ]
            },

            vector_applications: {
                title: "Vector Applications",
                concepts: [
                    "Physics: forces, motion, fields",
                    "Engineering: stress, strain",
                    "Graphics: transformations, lighting",
                    "Navigation: position, velocity"
                ],
                theory: "Vectors are fundamental tools across science and engineering, providing a natural way to represent and manipulate quantities with direction.",
                physicsApplications: {
                    "Force": "F = ma, resultant force",
                    "Velocity": "v = dr/dt, relative velocity",
                    "Work": "W = F · d",
                    "Torque": "τ = r × F",
                    "Angular Momentum": "L = r × p"
                },
                engineeringApplications: {
                    "Stress Analysis": "Force per unit area",
                    "Structural Loads": "Vector addition of forces",
                    "Fluid Flow": "Velocity fields",
                    "Electromagnetics": "Field vectors"
                },
                graphicsApplications: {
                    "Transformations": "Translation, rotation, scaling",
                    "Lighting": "Normal vectors, reflection",
                    "Camera Systems": "View direction vectors",
                    "Collision Detection": "Distance calculations"
                },
                practicalProblems: [
                    "Finding resultant forces",
                    "Calculating work done",
                    "Determining equilibrium",
                    "Navigation and pathfinding"
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
                vectorBg: '#e6f3ff'
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
                vectorBg: '#e8f4f8'
            }
        };

        this.colors = themes[this.theme] || themes.excel;
    }

    initializeMathSymbols() {
        return {
            // Mathematical operators
            'dot': '·', 'cross': '×', 'approx': '≈',
            'infinity': '∞', 'plusminus': '±',
            // Greek letters
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'Δ',
            'pi': 'π', 'theta': 'θ', 'lambda': 'λ', 'mu': 'μ',
            'omega': 'ω', 'phi': 'φ',
            // Vector symbols
            'parallel': '∥', 'perpendicular': '⊥',
            'angle': '∠', 'magnitude': '||',
            // Set notation
            'element': '∈', 'subset': '⊂', 'union': '∪', 'intersection': '∩'
        };
    }

    initializeVectorSolvers() {
        this.vectorTypes = {
            // Basic vector operations
            vector_addition: {
                patterns: [
                    /add.*vector/i,
                    /vector.*addition/i,
                    /sum.*vector/i,
                    /\+.*vector/i
                ],
                solver: this.solveVectorAddition.bind(this),
                name: 'Vector Addition',
                category: 'basic_operations',
                description: 'Adds two or more vectors component-wise'
            },

            vector_subtraction: {
                patterns: [
                    /subtract.*vector/i,
                    /vector.*subtraction/i,
                    /difference.*vector/i,
                    /-.*vector/i
                ],
                solver: this.solveVectorSubtraction.bind(this),
                name: 'Vector Subtraction',
                category: 'basic_operations',
                description: 'Subtracts one vector from another'
            },

            scalar_multiplication: {
                patterns: [
                    /scalar.*mult/i,
                    /multiply.*scalar/i,
                    /scale.*vector/i
                ],
                solver: this.solveScalarMultiplication.bind(this),
                name: 'Scalar Multiplication',
                category: 'basic_operations',
                description: 'Multiplies a vector by a scalar'
            },

            // Vector magnitude and normalization
            vector_magnitude: {
                patterns: [
                    /magnitude/i,
                    /length.*vector/i,
                    /norm.*vector/i,
                    /\|\|.*\|\|/
                ],
                solver: this.solveVectorMagnitude.bind(this),
                name: 'Vector Magnitude',
                category: 'properties',
                description: 'Calculates the length of a vector'
            },

            unit_vector: {
                patterns: [
                    /unit.*vector/i,
                    /normalize/i,
                    /direction.*vector/i
                ],
                solver: this.solveUnitVector.bind(this),
                name: 'Unit Vector',
                category: 'properties',
                description: 'Finds unit vector in same direction'
            },

            // Dot product
            dot_product: {
                patterns: [
                    /dot.*product/i,
                    /scalar.*product/i,
                    /inner.*product/i,
                    /u.*·.*v/i
                ],
                solver: this.solveDotProduct.bind(this),
                name: 'Dot Product',
                category: 'products',
                description: 'Calculates scalar product of two vectors'
            },

            // Cross product
            cross_product: {
                patterns: [
                    /cross.*product/i,
                    /vector.*product/i,
                    /u.*×.*v/i
                ],
                solver: this.solveCrossProduct.bind(this),
                name: 'Cross Product',
                category: 'products',
                description: 'Calculates vector product perpendicular to both vectors'
            },

            // Angle between vectors
            vector_angle: {
                patterns: [
                    /angle.*between/i,
                    /angle.*vector/i,
                    /theta.*vector/i
                ],
                solver: this.solveVectorAngle.bind(this),
                name: 'Angle Between Vectors',
                category: 'geometry',
                description: 'Finds angle between two vectors'
            },

            // Projection
            vector_projection: {
                patterns: [
                    /project/i,
                    /projection/i,
                    /component.*onto/i
                ],
                solver: this.solveVectorProjection.bind(this),
                name: 'Vector Projection',
                category: 'geometry',
                description: 'Projects one vector onto another'
            },

            // Orthogonality
            orthogonal_test: {
                patterns: [
                    /orthogonal/i,
                    /perpendicular.*vector/i,
                    /right.*angle/i
                ],
                solver: this.solveOrthogonalTest.bind(this),
                name: 'Orthogonality Test',
                category: 'relationships',
                description: 'Tests if vectors are perpendicular'
            },

            // Parallel test
            parallel_test: {
                patterns: [
                    /parallel.*vector/i,
                    /collinear/i,
                    /same.*direction/i
                ],
                solver: this.solveParallelTest.bind(this),
                name: 'Parallel Test',
                category: 'relationships',
                description: 'Tests if vectors are parallel'
            },

            // Distance between points
            distance_points: {
                patterns: [
                    /distance.*point/i,
                    /distance.*between/i,
                    /|P.*Q|/i
                ],
                solver: this.solveDistancePoints.bind(this),
                name: 'Distance Between Points',
                category: 'geometry',
                description: 'Calculates distance between two points'
            },

            // Linear combinations
            linear_combination: {
                patterns: [
                    /linear.*combination/i,
                    /combination.*vector/i,
                    /c1.*v1.*c2.*v2/i
                ],
                solver: this.solveLinearCombination.bind(this),
                name: 'Linear Combination',
                category: 'advanced',
                description: 'Forms linear combination of vectors'
            },

            // Triple scalar product
            triple_scalar: {
                patterns: [
                    /triple.*scalar/i,
                    /scalar.*triple/i,
                    /box.*product/i
                ],
                solver: this.solveTripleScalarProduct.bind(this),
                name: 'Triple Scalar Product',
                category: 'advanced',
                description: 'Calculates u · (v × w)'
            },

            // Triple vector product
            triple_vector: {
                patterns: [
                    /triple.*vector/i,
                    /vector.*triple/i,
                    /u.*×.*\(v.*×.*w\)/i
                ],
                solver: this.solveTripleVectorProduct.bind(this),
                name: 'Triple Vector Product',
                category: 'advanced',
                description: 'Calculates u × (v × w)'
            },

            // Area calculations
            parallelogram_area: {
                patterns: [
                    /area.*parallelogram/i,
                    /parallelogram.*area/i
                ],
                solver: this.solveParallelogramArea.bind(this),
                name: 'Parallelogram Area',
                category: 'geometry',
                description: 'Finds area using cross product'
            },

            triangle_area: {
                patterns: [
                    /area.*triangle/i,
                    /triangle.*area/i
                ],
                solver: this.solveTriangleArea.bind(this),
                name: 'Triangle Area',
                category: 'geometry',
                description: 'Finds area of triangle from vertices'
            },

            // Volume calculations
            parallelepiped_volume: {
                patterns: [
                    /volume.*parallelepiped/i,
                    /parallelepiped.*volume/i,
                    /box.*volume/i
                ],
                solver: this.solveParallelepipedVolume.bind(this),
                name: 'Parallelepiped Volume',
                category: 'geometry',
                description: 'Finds volume using triple scalar product'
            },

            // Line equations
            parametric_line: {
                patterns: [
                    /parametric.*line/i,
                    /line.*equation/i,
                    /vector.*line/i
                ],
                solver: this.solveParametricLine.bind(this),
                name: 'Parametric Line',
                category: 'lines_planes',
                description: 'Finds parametric equation of line'
            },

            // Plane equations
            plane_equation: {
                patterns: [
                    /plane.*equation/i,
                    /equation.*plane/i,
                    /plane.*normal/i
                ],
                solver: this.solvePlaneEquation.bind(this),
                name: 'Plane Equation',
                category: 'lines_planes',
                description: 'Finds equation of plane'
            },

            // Distance from point to line
            point_line_distance: {
                patterns: [
                    /distance.*point.*line/i,
                    /point.*line.*distance/i
                ],
                solver: this.solvePointLineDistance.bind(this),
                name: 'Point to Line Distance',
                category: 'geometry',
                description: 'Calculates shortest distance from point to line'
            },

            // Distance from point to plane
            point_plane_distance: {
                patterns: [
                    /distance.*point.*plane/i,
                    /point.*plane.*distance/i
                ],
                solver: this.solvePointPlaneDistance.bind(this),
                name: 'Point to Plane Distance',
                category: 'geometry',
                description: 'Calculates distance from point to plane'
            }
        };
    }

    initializeErrorDatabase() {
        this.commonMistakes = {
            vector_addition: {
                'Add components': [
                    'Adding magnitudes instead of components',
                    'Mixing up x, y, z coordinates',
                    'Forgetting to include all dimensions'
                ]
            },
            dot_product: {
                'Calculate product': [
                    'Confusing dot product with cross product',
                    'Getting scalar result but expecting vector',
                    'Sign errors in multiplication',
                    'Not recognizing result is scalar'
                ],
                'Interpret result': [
                    'Forgetting result relates to angle',
                    'Not checking for orthogonality when result is zero'
                ]
            },
            cross_product: {
                'Set up determinant': [
                    'Wrong order of components in determinant',
                    'Sign errors in expansion',
                    'Confusing rows and columns'
                ],
                'Calculate components': [
                    'Arithmetic errors in cross multiplication',
                    'Forgetting negative signs',
                    'Wrong pairing of components'
                ],
                'Verify direction': [
                    'Not using right-hand rule',
                    'Result not perpendicular to both vectors'
                ]
            },
            vector_magnitude: {
                'Square components': [
                    'Forgetting to square each component',
                    'Adding components instead of squares',
                    'Sign errors with negative components'
                ],
                'Take square root': [
                    'Forgetting final square root',
                    'Getting negative magnitude'
                ]
            },
            unit_vector: {
                'Calculate magnitude': [
                    'Using wrong magnitude formula',
                    'Dividing by zero for zero vector'
                ],
                'Divide by magnitude': [
                    'Not dividing all components',
                    'Arithmetic errors in division'
                ]
            },
            vector_projection: {
                'Compute dot product': [
                    'Using wrong vectors in dot product',
                    'Sign errors'
                ],
                'Divide and multiply': [
                    'Using wrong denominator (should be v·v)',
                    'Forgetting to multiply by vector v'
                ]
            }
        };

        this.errorPrevention = {
            component_tracking: {
                reminder: 'Always track x, y, z components separately',
                method: 'Use subscripts or colors for each component'
            },
            dot_vs_cross: {
                reminder: 'Dot product → scalar, Cross product → vector',
                method: 'Check dimensionality of result'
            },
            right_hand_rule: {
                reminder: 'Use right-hand rule for cross product direction',
                method: 'Point fingers along first vector, curl to second'
            },
            magnitude_check: {
                reminder: 'Magnitude is always non-negative',
                method: 'Double-check if you get negative result'
            },
            unit_vector_check: {
                reminder: 'Unit vector should have magnitude 1',
                method: 'Verify ||û|| = 1 after calculation'
            }
        };
    }

    initializeExplanationTemplates() {
        this.explanationStyles = {
            conceptual: {
                focus: 'Physical meaning and geometric interpretation',
                language: 'intuitive and meaning-focused'
            },
            procedural: {
                focus: 'Step-by-step computational process',
                language: 'algorithmic instructions'
            },
            visual: {
                focus: 'Geometric and spatial understanding',
                language: 'visual and spatial metaphors'
            },
            algebraic: {
                focus: 'Formal mathematical rules and properties',
                language: 'precise mathematical terminology'
            }
        };

        this.difficultyLevels = {
            basic: {
                vocabulary: 'simple, everyday language',
                detail: 'essential steps only',
                examples: 'concrete numerical cases'
            },
            intermediate: {
                vocabulary: 'standard mathematical terms',
                detail: 'main steps with brief explanations',
                examples: 'mix of concrete and abstract'
            },
            detailed: {
                vocabulary: 'full mathematical vocabulary',
                detail: 'comprehensive explanations with theory',
                examples: 'abstract and generalized cases'
            },
            scaffolded: {
                vocabulary: 'progressive from simple to complex',
                detail: 'guided discovery with questions',
                examples: 'carefully sequenced progression'
            }
        };
    }

    // Main solver method
    solveVectorProblem(config) {
        const { vectors, operation, parameters, problemType, context } = config;

        try {
            // Parse the problem
            this.currentProblem = this.parseVectorProblem(vectors, operation, parameters, problemType, context);

            // Solve the problem
            this.currentSolution = this.solveVectorProblem_Internal(this.currentProblem);

            // Generate solution steps
            this.solutionSteps = this.generateVectorSteps(this.currentProblem, this.currentSolution);

            // Generate graph data if applicable
            this.generateVectorGraphData();

            // Generate workbook
            this.generateVectorWorkbook();

            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                result: this.currentSolution?.result,
                type: this.currentSolution?.type
            };

        } catch (error) {
            throw new Error(`Failed to solve vector problem: ${error.message}`);
        }
    }

    parseVectorProblem(vectors, operation = '', parameters = {}, problemType = null, context = {}) {
        // If problem type is specified, use it directly
        if (problemType && this.vectorTypes[problemType]) {
            return {
                originalInput: operation || `${problemType} problem`,
                vectors: this.parseVectors(vectors),
                type: problemType,
                operation: operation,
                parameters: { ...parameters },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        // Auto-detect vector problem type
        for (const [type, config] of Object.entries(this.vectorTypes)) {
            for (const pattern of config.patterns) {
                if (pattern.test(operation)) {
                    return {
                        originalInput: operation,
                        vectors: this.parseVectors(vectors),
                        type: type,
                        operation: operation,
                        parameters: { ...parameters },
                        context: { ...context },
                        parsedAt: new Date().toISOString()
                    };
                }
            }
        }

        throw new Error(`Unable to recognize vector problem type from: ${operation}`);
    }

    parseVectors(vectorInput) {
        if (!vectorInput) return [];

        // Handle various vector input formats
        if (Array.isArray(vectorInput)) {
            return vectorInput.map(v => this.parseVector(v));
        }

        return [this.parseVector(vectorInput)];
    }

    parseVector(v) {
        // Already in correct format
        if (Array.isArray(v)) {
            return v;
        }

        // Parse string format like "<1, 2, 3>" or "1i + 2j + 3k"
        if (typeof v === 'string') {
            // Angle bracket notation
            const bracketMatch = v.match(/<([^>]+)>/);
            if (bracketMatch) {
                return bracketMatch[1].split(',').map(x => parseFloat(x.trim()));
            }

            // Component notation (i, j, k)
            const components = [0, 0, 0];
            const iMatch = v.match(/([+-]?\d*\.?\d+)\s*i/);
            const jMatch = v.match(/([+-]?\d*\.?\d+)\s*j/);
            const kMatch = v.match(/([+-]?\d*\.?\d+)\s*k/);

            if (iMatch) components[0] = parseFloat(iMatch[1]);
            if (jMatch) components[1] = parseFloat(jMatch[1]);
            if (kMatch) components[2] = parseFloat(kMatch[1]);

            return components;
        }

        return [0, 0, 0];
    }

    solveVectorProblem_Internal(problem) {
        const solver = this.vectorTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for vector problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    // VECTOR SOLVERS

    solveVectorAddition(problem) {
        const vectors = problem.vectors;
        if (vectors.length < 2) {
            throw new Error('Need at least 2 vectors for addition');
        }

        const dimension = Math.max(...vectors.map(v => v.length));
        const result = new Array(dimension).fill(0);

        vectors.forEach(v => {
            for (let i = 0; i < dimension; i++) {
                result[i] += v[i] || 0;
            }
        });

        return {
            operation: 'Vector Addition',
            vectors: vectors,
            result: result,
            resultVector: this.formatVector(result),
            magnitude: this.calculateMagnitude(result),
            category: 'basic_operations',
            geometric: `Resultant vector from head-to-tail method`
        };
    }

    solveVectorSubtraction(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 2) {
            throw new Error('Need exactly 2 vectors for subtraction');
        }

        const [u, v] = vectors;
        const dimension = Math.max(u.length, v.length);
        const result = new Array(dimension).fill(0);

        for (let i = 0; i < dimension; i++) {
            result[i] = (u[i] || 0) - (v[i] || 0);
        }

        return {
            operation: 'Vector Subtraction',
            vectors: vectors,
            result: result,
            resultVector: this.formatVector(result),
            magnitude: this.calculateMagnitude(result),
            category: 'basic_operations',
            geometric: `Direction from v to u`
        };
    }

    solveScalarMultiplication(problem) {
        const { scalar } = problem.parameters;
        const vector = problem.vectors[0];

        if (scalar === undefined) {
            throw new Error('Scalar value required');
        }

        const result = vector.map(component => scalar * component);

        return {
            operation: 'Scalar Multiplication',
            scalar: scalar,
            vector: vector,
            result: result,
            resultVector: this.formatVector(result),
            originalMagnitude: this.calculateMagnitude(vector),
            resultMagnitude: this.calculateMagnitude(result),
            scaleFactor: Math.abs(scalar),
            directionChange: scalar < 0 ? 'reversed' : 'preserved',
            category: 'basic_operations'
        };
    }

    solveVectorMagnitude(problem) {
        const vector = problem.vectors[0];
        const magnitude = this.calculateMagnitude(vector);

        return {
            operation: 'Vector Magnitude',
            vector: vector,
            vectorNotation: this.formatVector(vector),
            magnitude: magnitude,
            calculation: this.getMagnitudeCalculation(vector),
            category: 'properties',
            interpretation: `Length or size of the vector`
        };
    }

    solveUnitVector(problem) {
        const vector = problem.vectors[0];
        const magnitude = this.calculateMagnitude(vector);

        if (magnitude < 1e-10) {
            return {
                operation: 'Unit Vector',
                vector: vector,
                error: 'Cannot normalize zero vector',
                category: 'properties'
            };
        }

        const unitVector = vector.map(component => component / magnitude);

        return {
            operation: 'Unit Vector',
            vector: vector,
            vectorNotation: this.formatVector(vector),
            magnitude: magnitude,
            unitVector: unitVector,
            unitVectorNotation: this.formatVector(unitVector),
            verification: this.calculateMagnitude(unitVector),
            category: 'properties',
            interpretation: `Direction of original vector with length 1`
        };
    }

    solveDotProduct(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 2) {
            throw new Error('Need exactly 2 vectors for dot product');
        }

        const [u, v] = vectors;
        const dotProduct = this.calculateDotProduct(u, v);

        const magU = this.calculateMagnitude(u);
        const magV = this.calculateMagnitude(v);
        
        let angle = null;
        let angleDegrees = null;
        if (magU > 1e-10 && magV > 1e-10) {
            const cosTheta = dotProduct / (magU * magV);
            // Clamp to [-1, 1] to handle numerical errors
            const clampedCos = Math.max(-1, Math.min(1, cosTheta));
            angle = Math.acos(clampedCos);
            angleDegrees = angle * (180 / Math.PI);
        }

        return {
            operation: 'Dot Product',
            vectors: vectors,
            vectorU: this.formatVector(u),
            vectorV: this.formatVector(v),
            dotProduct: dotProduct,
            calculation: this.getDotProductCalculation(u, v),
            magnitudes: { u: magU, v: magV },
            angle: angle,
            angleDegrees: angleDegrees,
            relationship: this.interpretDotProduct(dotProduct, angle),
            category: 'products',
            geometric: `Measures how much vectors align`
        };
    }

    solveCrossProduct(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 2) {
            throw new Error('Need exactly 2 vectors for cross product');
        }

        let [u, v] = vectors;
        
        // Ensure 3D vectors
        u = this.ensureThreeDimensional(u);
        v = this.ensureThreeDimensional(v);

        const crossProduct = this.calculateCrossProduct(u, v);
        const magnitude = this.calculateMagnitude(crossProduct);

        const magU = this.calculateMagnitude(u);
        const magV = this.calculateMagnitude(v);

        let angle = null;
        let angleDegrees = null;
        if (magU > 1e-10 && magV > 1e-10) {
            const sinTheta = magnitude / (magU * magV);
            // Clamp to [0, 1]
            const clampedSin = Math.max(0, Math.min(1, sinTheta));
            angle = Math.asin(clampedSin);
            angleDegrees = angle * (180 / Math.PI);
        }

        return {
            operation: 'Cross Product',
            vectors: vectors,
            vectorU: this.formatVector(u),
            vectorV: this.formatVector(v),
            crossProduct: crossProduct,
            crossProductNotation: this.formatVector(crossProduct),
            magnitude: magnitude,
            calculation: this.getCrossProductCalculation(u, v),
            magnitudes: { u: magU, v: magV },
            parallelogramArea: magnitude,
            angle: angle,
            angleDegrees: angleDegrees,
            perpendicularity: this.verifyCrossProductPerpendicular(crossProduct, u, v),
            category: 'products',
            geometric: `Perpendicular to both vectors, magnitude = parallelogram area`
        };
    }

    solveVectorAngle(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 2) {
            throw new Error('Need exactly 2 vectors for angle calculation');
        }

        const [u, v] = vectors;
        const dotProduct = this.calculateDotProduct(u, v);
        const magU = this.calculateMagnitude(u);
        const magV = this.calculateMagnitude(v);

        if (magU < 1e-10 || magV < 1e-10) {
            return {
                operation: 'Angle Between Vectors',
                error: 'Cannot find angle with zero vector',
                category: 'geometry'
            };
        }

        const cosTheta = dotProduct / (magU * magV);
        const clampedCos = Math.max(-1, Math.min(1, cosTheta));
        const angleRadians = Math.acos(clampedCos);
        const angleDegrees = angleRadians * (180 / Math.PI);

        return {
            operation: 'Angle Between Vectors',
            vectors: vectors,
            vectorU: this.formatVector(u),
            vectorV: this.formatVector(v),
            dotProduct: dotProduct,
            magnitudes: { u: magU, v: magV },
            cosTheta: cosTheta,
            angleRadians: angleRadians,
            angleDegrees: angleDegrees,
            relationship: this.interpretAngle(angleDegrees),
            category: 'geometry'
        };
    }

    solveVectorProjection(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 2) {
            throw new Error('Need exactly 2 vectors for projection');
        }

        const [u, v] = vectors;
        const dotProduct = this.calculateDotProduct(u, v);
        const magVSquared = this.calculateDotProduct(v, v);

        if (magVSquared < 1e-10) {
            return {
                operation: 'Vector Projection',
                error: 'Cannot project onto zero vector',
                category: 'geometry'
            };
        }

        const scalarProjection = dotProduct / Math.sqrt(magVSquared);
        const projectionScalar = dotProduct / magVSquared;
        const projection = v.map(component => projectionScalar * component);

        // Orthogonal component
        const orthogonal = u.map((component, i) => component - projection[i]);

        return {
            operation: 'Vector Projection',
            vectors: vectors,
            vectorU: this.formatVector(u),
            vectorV: this.formatVector(v),
            scalarProjection: scalarProjection,
            vectorProjection: projection,
            projectionNotation: this.formatVector(projection),
            orthogonalComponent: orthogonal,
            orthogonalNotation: this.formatVector(orthogonal),
            verification: this.verifyProjectionOrthogonal(projection, orthogonal),
            category: 'geometry',
            interpretation: `Component of u in direction of v`
        };
    }

    solveOrthogonalTest(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 2) {
            throw new Error('Need exactly 2 vectors for orthogonality test');
        }

        const [u, v] = vectors;
        const dotProduct = this.calculateDotProduct(u, v);
        const isOrthogonal = Math.abs(dotProduct) < 1e-10;

        return {
            operation: 'Orthogonality Test',
            vectors: vectors,
            vectorU: this.formatVector(u),
            vectorV: this.formatVector(v),
            dotProduct: dotProduct,
            isOrthogonal: isOrthogonal,
            conclusion: isOrthogonal ? 'Vectors are orthogonal (perpendicular)' : 'Vectors are not orthogonal',
            category: 'relationships',
            criterion: 'Vectors are orthogonal if and only if u · v = 0'
        };
    }

    solveParallelTest(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 2) {
            throw new Error('Need exactly 2 vectors for parallel test');
        }

        const [u, v] = vectors;
        const crossProduct = this.calculateCrossProduct(
            this.ensureThreeDimensional(u),
            this.ensureThreeDimensional(v)
        );
        const crossMagnitude = this.calculateMagnitude(crossProduct);
        const isParallel = crossMagnitude < 1e-10;

        // Check if same or opposite direction
        let direction = null;
        if (isParallel) {
            const dotProduct = this.calculateDotProduct(u, v);
            direction = dotProduct > 0 ? 'same direction' : 'opposite direction';
        }

        return {
            operation: 'Parallel Test',
            vectors: vectors,
            vectorU: this.formatVector(u),
            vectorV: this.formatVector(v),
            crossProduct: crossProduct,
            crossMagnitude: crossMagnitude,
            isParallel: isParallel,
            direction: direction,
            conclusion: isParallel ? `Vectors are parallel (${direction})` : 'Vectors are not parallel',
            category: 'relationships',
            criterion: 'Vectors are parallel if and only if u × v = 0'
        };
    }

    solveDistancePoints(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 2) {
            throw new Error('Need exactly 2 points for distance calculation');
        }

        const [P, Q] = vectors;
        const difference = P.map((component, i) => Q[i] - component);
        const distance = this.calculateMagnitude(difference);

        return {
            operation: 'Distance Between Points',
            pointP: this.formatVector(P),
            pointQ: this.formatVector(Q),
            differenceVector: difference,
            differenceNotation: this.formatVector(difference),
            distance: distance,
            calculation: this.getMagnitudeCalculation(difference),
            category: 'geometry'
        };
    }

    solveLinearCombination(problem) {
        const vectors = problem.vectors;
        const { coefficients } = problem.parameters;

        if (!coefficients || coefficients.length !== vectors.length) {
            throw new Error('Need coefficients for each vector');
        }

        const dimension = Math.max(...vectors.map(v => v.length));
        const result = new Array(dimension).fill(0);

        vectors.forEach((v, index) => {
            const coeff = coefficients[index];
            for (let i = 0; i < dimension; i++) {
                result[i] += coeff * (v[i] || 0);
            }
        });

        return {
            operation: 'Linear Combination',
            vectors: vectors,
            coefficients: coefficients,
            expression: this.formatLinearCombination(vectors, coefficients),
            result: result,
            resultNotation: this.formatVector(result),
            category: 'advanced'
        };
    }

    solveTripleScalarProduct(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 3) {
            throw new Error('Need exactly 3 vectors for triple scalar product');
        }

        let [u, v, w] = vectors.map(vec => this.ensureThreeDimensional(vec));

        const crossVW = this.calculateCrossProduct(v, w);
        const tripleScalar = this.calculateDotProduct(u, crossVW);

        return {
            operation: 'Triple Scalar Product',
            vectors: vectors,
            formula: 'u · (v × w)',
            crossProduct: crossVW,
            tripleScalarProduct: tripleScalar,
            volume: Math.abs(tripleScalar),
            category: 'advanced',
            geometric: `Volume of parallelepiped formed by vectors`,
            interpretation: tripleScalar === 0 ? 'Vectors are coplanar' : 'Vectors form a parallelepiped'
        };
    }

    solveTripleVectorProduct(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 3) {
            throw new Error('Need exactly 3 vectors for triple vector product');
        }

        let [u, v, w] = vectors.map(vec => this.ensureThreeDimensional(vec));

        const crossVW = this.calculateCrossProduct(v, w);
        const result = this.calculateCrossProduct(u, crossVW);

        // BAC-CAB rule: u × (v × w) = v(u·w) - w(u·v)
        const dotUW = this.calculateDotProduct(u, w);
        const dotUV = this.calculateDotProduct(u, v);
        
        const bacCabCheck = v.map((comp, i) => comp * dotUW - w[i] * dotUV);

        return {
            operation: 'Triple Vector Product',
            vectors: vectors,
            formula: 'u × (v × w)',
            crossVW: crossVW,
            result: result,
            resultNotation: this.formatVector(result),
            bacCabFormula: 'v(u·w) - w(u·v)',
            bacCabResult: bacCabCheck,
            verification: this.vectorsEqual(result, bacCabCheck),
            category: 'advanced'
        };
    }

    solveParallelogramArea(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 2) {
            throw new Error('Need exactly 2 vectors for parallelogram area');
        }

        let [u, v] = vectors.map(vec => this.ensureThreeDimensional(vec));
        const crossProduct = this.calculateCrossProduct(u, v);
        const area = this.calculateMagnitude(crossProduct);

        return {
            operation: 'Parallelogram Area',
            vectors: vectors,
            crossProduct: crossProduct,
            crossProductNotation: this.formatVector(crossProduct),
            area: area,
            formula: 'Area = ||u × v||',
            category: 'geometry'
        };
    }

    solveTriangleArea(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 3) {
            throw new Error('Need exactly 3 vertices for triangle area');
        }

        const [A, B, C] = vectors;
        const AB = B.map((comp, i) => comp - A[i]);
        const AC = C.map((comp, i) => comp - A[i]);

        const crossProduct = this.calculateCrossProduct(
            this.ensureThreeDimensional(AB),
            this.ensureThreeDimensional(AC)
        );
        const area = this.calculateMagnitude(crossProduct) / 2;

        return {
            operation: 'Triangle Area',
            vertices: vectors,
            sideAB: AB,
            sideAC: AC,
            crossProduct: crossProduct,
            area: area,
            formula: 'Area = ½||AB × AC||',
            category: 'geometry'
        };
    }

    solveParallelepipedVolume(problem) {
        const vectors = problem.vectors;
        if (vectors.length !== 3) {
            throw new Error('Need exactly 3 vectors for parallelepiped volume');
        }

        let [u, v, w] = vectors.map(vec => this.ensureThreeDimensional(vec));

        const crossVW = this.calculateCrossProduct(v, w);
        const tripleScalar = this.calculateDotProduct(u, crossVW);
        const volume = Math.abs(tripleScalar);

        return {
            operation: 'Parallelepiped Volume',
            vectors: vectors,
            formula: 'Volume = |u · (v × w)|',
            crossProduct: crossVW,
            tripleScalar: tripleScalar,
            volume: volume,
            category: 'geometry'
        };
    }

    solveParametricLine(problem) {
        const { point, direction } = problem.parameters;
        
        if (!point || !direction) {
            throw new Error('Need point and direction vector for line');
        }

        return {
            operation: 'Parametric Line',
            point: point,
            pointNotation: this.formatVector(point),
            direction: direction,
            directionNotation: this.formatVector(direction),
            vectorForm: `r(t) = ${this.formatVector(point)} + t${this.formatVector(direction)}`,
            parametricForm: this.getParametricForm(point, direction),
            category: 'lines_planes'
        };
    }

    solvePlaneEquation(problem) {
        const { point, normal } = problem.parameters;
        
        if (!point || !normal) {
            throw new Error('Need point and normal vector for plane');
        }

        const [a, b, c] = normal;
        const [x0, y0, z0] = point;
        const d = a * x0 + b * y0 + c * z0;

        return {
            operation: 'Plane Equation',
            point: point,
            pointNotation: this.formatVector(point),
            normal: normal,
            normalNotation: this.formatVector(normal),
            scalarEquation: `${a}x + ${b}y + ${c}z = ${d}`,
            vectorForm: `n · (r - r₀) = 0`,
            category: 'lines_planes'
        };
    }

    solvePointLineDistance(problem) {
        const { point, linePoint, lineDirection } = problem.parameters;
        
        if (!point || !linePoint || !lineDirection) {
            throw new Error('Need point, line point, and line direction');
        }

        const AP = point.map((comp, i) => comp - linePoint[i]);
        const crossProduct = this.calculateCrossProduct(
            this.ensureThreeDimensional(AP),
            this.ensureThreeDimensional(lineDirection)
        );
        const distance = this.calculateMagnitude(crossProduct) / this.calculateMagnitude(lineDirection);

        return {
            operation: 'Point to Line Distance',
            point: point,
            linePoint: linePoint,
            lineDirection: lineDirection,
            vectorAP: AP,
            crossProduct: crossProduct,
            distance: distance,
            formula: 'distance = ||AP × d|| / ||d||',
            category: 'geometry'
        };
    }

    solvePointPlaneDistance(problem) {
        const { point, planePoint, planeNormal } = problem.parameters;
        
        if (!point || !planePoint || !planeNormal) {
            throw new Error('Need point, plane point, and plane normal');
        }

        const AP = point.map((comp, i) => comp - planePoint[i]);
        const dotProduct = this.calculateDotProduct(AP, planeNormal);
        const normalMagnitude = this.calculateMagnitude(planeNormal);
        const distance = Math.abs(dotProduct) / normalMagnitude;

        return {
            operation: 'Point to Plane Distance',
            point: point,
            planePoint: planePoint,
            planeNormal: planeNormal,
            vectorAP: AP,
            dotProduct: dotProduct,
            distance: distance,
            formula: 'distance = |AP · n| / ||n||',
            category: 'geometry'
        };
    }

    // HELPER CALCULATION METHODS

    calculateMagnitude(vector) {
        return Math.sqrt(vector.reduce((sum, component) => sum + component * component, 0));
    }

    calculateDotProduct(u, v) {
        const length = Math.max(u.length, v.length);
        let sum = 0;
        for (let i = 0; i < length; i++) {
            sum += (u[i] || 0) * (v[i] || 0);
        }
        return sum;
    }

    calculateCrossProduct(u, v) {
        // u and v must be 3D
        return [
            u[1] * v[2] - u[2] * v[1],
            u[2] * v[0] - u[0] * v[2],
            u[0] * v[1] - u[1] * v[0]
        ];
    }

    ensureThreeDimensional(vector) {
        if (vector.length >= 3) return vector.slice(0, 3);
        return [...vector, ...new Array(3 - vector.length).fill(0)];
    }

    formatVector(vector) {
        return `⟨${vector.map(v => this.formatNumber(v)).join(', ')}⟩`;
    }

    formatNumber(num) {
        if (Math.abs(num) < 1e-10) return '0';
        if (Number.isInteger(num)) return num.toString();
        return num.toFixed(4).replace(/\.?0+$/, '');
    }

    getMagnitudeCalculation(vector) {
        const squares = vector.map(v => `${this.formatNumber(v)}²`).join(' + ');
        const sum = vector.reduce((s, v) => s + v * v, 0);
        return `√(${squares}) = √${this.formatNumber(sum)} = ${this.formatNumber(Math.sqrt(sum))}`;
    }

    getDotProductCalculation(u, v) {
        const products = u.map((comp, i) => `(${this.formatNumber(comp)})(${this.formatNumber(v[i] || 0)})`).join(' + ');
        const sum = this.calculateDotProduct(u, v);
        return `${products} = ${this.formatNumber(sum)}`;
    }

    getCrossProductCalculation(u, v) {
        return {
            i_component: `(${this.formatNumber(u[1])})(${this.formatNumber(v[2])}) - (${this.formatNumber(u[2])})(${this.formatNumber(v[1])})`,
            j_component: `(${this.formatNumber(u[2])})(${this.formatNumber(v[0])}) - (${this.formatNumber(u[0])})(${this.formatNumber(v[2])})`,
            k_component: `(${this.formatNumber(u[0])})(${this.formatNumber(v[1])}) - (${this.formatNumber(u[1])})(${this.formatNumber(v[0])})`
        };
    }

    interpretDotProduct(dotProduct, angle) {
        if (Math.abs(dotProduct) < 1e-10) return 'Vectors are orthogonal (perpendicular)';
        if (angle === null) return 'Cannot determine relationship';
        if (angle < Math.PI / 2) return 'Vectors form acute angle';
        if (angle > Math.PI / 2) return 'Vectors form obtuse angle';
        return 'Vectors are parallel';
    }

    interpretAngle(degrees) {
        if (Math.abs(degrees) < 0.01) return 'Vectors are parallel (same direction)';
        if (Math.abs(degrees - 180) < 0.01) return 'Vectors are parallel (opposite direction)';
        if (Math.abs(degrees - 90) < 0.01) return 'Vectors are perpendicular';
        if (degrees < 90) return 'Acute angle';
        if (degrees > 90) return 'Obtuse angle';
        return 'Right angle';
    }

    verifyCrossProductPerpendicular(crossProduct, u, v) {
        const dot1 = this.calculateDotProduct(crossProduct, u);
        const dot2 = this.calculateDotProduct(crossProduct, v);
        return {
            perpToU: Math.abs(dot1) < 1e-8,
            perpToV: Math.abs(dot2) < 1e-8,
            dotWithU: dot1,
            dotWithV: dot2
        };
    }

    verifyProjectionOrthogonal(projection, orthogonal) {
        const dotProduct = this.calculateDotProduct(projection, orthogonal);
        return {
            isOrthogonal: Math.abs(dotProduct) < 1e-8,
            dotProduct: dotProduct
        };
    }

    vectorsEqual(v1, v2, tolerance = 1e-8) {
        if (v1.length !== v2.length) return false;
        return v1.every((comp, i) => Math.abs(comp - v2[i]) < tolerance);
    }

    formatLinearCombination(vectors, coefficients) {
        return vectors.map((v, i) => 
            `${this.formatNumber(coefficients[i])}${this.formatVector(v)}`
        ).join(' + ');
    }

    getParametricForm(point, direction) {
        return {
            x: `x = ${this.formatNumber(point[0])} + ${this.formatNumber(direction[0])}t`,
            y: `y = ${this.formatNumber(point[1])} + ${this.formatNumber(direction[1])}t`,
            z: `z = ${this.formatNumber(point[2] || 0)} + ${this.formatNumber(direction[2] || 0)}t`
        };
    }

    // ENHANCED STEP GENERATION

    generateVectorSteps(problem, solution) {
        let baseSteps = this.generateBaseVectorSteps(problem, solution);

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

    generateBaseVectorSteps(problem, solution) {
        const { type } = problem;

        switch (type) {
            case 'vector_addition':
                return this.generateVectorAdditionSteps(problem, solution);
            case 'dot_product':
                return this.generateDotProductSteps(problem, solution);
            case 'cross_product':
                return this.generateCrossProductSteps(problem, solution);
            case 'vector_magnitude':
                return this.generateMagnitudeSteps(problem, solution);
            case 'unit_vector':
                return this.generateUnitVectorSteps(problem, solution);
            case 'vector_projection':
                return this.generateProjectionSteps(problem, solution);
            case 'vector_angle':
                return this.generateAngleSteps(problem, solution);
            default:
                return this.generateGenericVectorSteps(problem, solution);
        }
    }

    generateVectorAdditionSteps(problem, solution) {
        const vectors = problem.vectors;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given vectors',
            description: 'Start with the vectors to be added',
            expression: vectors.map((v, i) => `v${i + 1} = ${this.formatVector(v)}`).join(', '),
            reasoning: 'Vector addition is performed component-wise',
            visualHint: 'Think of placing vectors head-to-tail or using the parallelogram rule',
            goalStatement: 'Add corresponding components of all vectors'
        });

        steps.push({
            stepNumber: 2,
            step: 'Add x-components',
            description: 'Sum all x-components (first components)',
            calculation: vectors.map((v, i) => this.formatNumber(v[0])).join(' + '),
            result: this.formatNumber(solution.result[0]),
            reasoning: 'X-components add independently of other components',
            algebraicRule: 'Component-wise addition property'
        });

        if (vectors[0].length > 1) {
            steps.push({
                stepNumber: 3,
                step: 'Add y-components',
                description: 'Sum all y-components (second components)',
                calculation: vectors.map((v, i) => this.formatNumber(v[1] || 0)).join(' + '),
                result: this.formatNumber(solution.result[1]),
                reasoning: 'Y-components add independently',
                algebraicRule: 'Component-wise addition property'
            });
        }

        if (vectors[0].length > 2) {
            steps.push({
                stepNumber: 4,
                step: 'Add z-components',
                description: 'Sum all z-components (third components)',
                calculation: vectors.map((v, i) => this.formatNumber(v[2] || 0)).join(' + '),
                result: this.formatNumber(solution.result[2]),
                reasoning: 'Z-components add independently',
                algebraicRule: 'Component-wise addition property'
            });
        }

        steps.push({
            stepNumber: steps.length + 1,
            step: 'Write resultant vector',
            description: 'Combine all components into result vector',
            expression: solution.resultVector,
            result: solution.result,
            magnitude: solution.magnitude,
            finalAnswer: true,
            reasoning: 'The resultant vector represents the combined effect of all input vectors'
        });

        return steps;
    }

    generateDotProductSteps(problem, solution) {
        const [u, v] = problem.vectors;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given vectors',
            description: 'Start with two vectors for dot product',
            vectorU: solution.vectorU,
            vectorV: solution.vectorV,
            reasoning: 'Dot product measures how much two vectors align',
            visualHint: 'Result is a scalar (number), not a vector',
            goalStatement: 'Calculate u · v by multiplying corresponding components and summing'
        });

        steps.push({
            stepNumber: 2,
            step: 'Multiply corresponding components',
            description: 'Multiply each pair of corresponding components',
            calculation: solution.calculation,
            reasoning: 'Each component contributes to the overall alignment',
            algebraicRule: 'u · v = u₁v₁ + u₂v₂ + u₃v₃'
        });

        steps.push({
            stepNumber: 3,
            step: 'Sum the products',
            description: 'Add all the products together',
            result: solution.dotProduct,
            finalAnswer: true,
            reasoning: 'The final scalar value indicates alignment between vectors',
            interpretation: solution.relationship
        });

        if (solution.angle !== null) {
            steps.push({
                stepNumber: 4,
                step: 'Interpret geometrically',
                description: 'Use dot product to find angle between vectors',
                formula: 'cos θ = (u · v)/(||u|| ||v||)',
                angle: solution.angleDegrees,
                angleUnit: 'degrees',
                reasoning: 'Dot product relates to the angle between vectors',
                geometric: solution.geometric
            });
        }

        return steps;
    }

    generateCrossProductSteps(problem, solution) {
        const [u, v] = problem.vectors;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given vectors',
            description: 'Start with two vectors for cross product',
            vectorU: solution.vectorU,
            vectorV: solution.vectorV,
            reasoning: 'Cross product produces a vector perpendicular to both',
            visualHint: 'Use right-hand rule: fingers along u, curl toward v, thumb points in result direction',
            goalStatement: 'Calculate u × v using determinant method'
        });

        steps.push({
            stepNumber: 2,
            step: 'Set up determinant',
            description: 'Arrange vectors in determinant form',
            expression: '|  î    ĵ    k̂  |\n| u₁  u₂  u₃ |\n| v₁  v₂  v₃ |',
            reasoning: 'Determinant expansion gives the cross product components',
            algebraicRule: 'Cross product determinant formula'
        });

        const calc = solution.calculation;
        
        steps.push({
            stepNumber: 3,
            step: 'Calculate i-component',
            description: 'Expand along first row for i-component',
            calculation: calc.i_component,
            result: solution.crossProduct[0],
            reasoning: 'i-component from minor determinant excluding first column',
            formula: 'i: u₂v₃ - u₃v₂'
        });

        steps.push({
            stepNumber: 4,
            step: 'Calculate j-component',
            description: 'Expand for j-component (note the negative sign)',
            calculation: calc.j_component,
            result: solution.crossProduct[1],
            reasoning: 'j-component has negative sign in determinant expansion',
            formula: 'j: -(u₁v₃ - u₃v₁) = u₃v₁ - u₁v₃',
            criticalWarning: 'Remember the negative sign for j-component'
        });

        steps.push({
            stepNumber: 5,
            step: 'Calculate k-component',
            description: 'Expand for k-component',
            calculation: calc.k_component,
            result: solution.crossProduct[2],
            reasoning: 'k-component from minor determinant excluding third column',
            formula: 'k: u₁v₂ - u₂v₁'
        });

        steps.push({
            stepNumber: 6,
            step: 'Write result vector',
            description: 'Combine components into cross product vector',
            expression: solution.crossProductNotation,
            result: solution.crossProduct,
            magnitude: solution.magnitude,
            finalAnswer: true,
            reasoning: 'Result is perpendicular to both input vectors',
            geometric: solution.geometric
        });

        if (solution.perpendicularity) {
            steps.push({
                stepNumber: 7,
                step: 'Verify perpendicularity',
                description: 'Check that result is perpendicular to both vectors',
                verification: solution.perpendicularity,
                reasoning: 'Cross product should have zero dot product with both original vectors'
            });
        }

        return steps;
    }

    generateMagnitudeSteps(problem, solution) {
        const vector = problem.vectors[0];
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given vector',
            description: 'Start with the vector',
            expression: solution.vectorNotation,
            reasoning: 'Magnitude measures the length or size of the vector',
            visualHint: 'Think of magnitude as the distance from origin to the point',
            goalStatement: 'Calculate ||v|| = √(x² + y² + z²)'
        });

        steps.push({
            stepNumber: 2,
            step: 'Square each component',
            description: 'Square each component of the vector',
            calculation: vector.map(v => `${this.formatNumber(v)}² = ${this.formatNumber(v * v)}`).join(', '),
            reasoning: 'Squaring ensures all contributions are positive',
            algebraicRule: 'Pythagorean theorem in n dimensions'
        });

        steps.push({
            stepNumber: 3,
            step: 'Sum the squares',
            description: 'Add all squared components',
            calculation: vector.map(v => this.formatNumber(v * v)).join(' + '),
            result: vector.reduce((sum, v) => sum + v * v, 0),
            reasoning: 'Total squared length'
        });

        steps.push({
            stepNumber: 4,
            step: 'Take square root',
            description: 'Take the square root of the sum',
            calculation: solution.calculation,
            result: solution.magnitude,
            finalAnswer: true,
            reasoning: 'Square root gives the actual length',
            interpretation: solution.interpretation
        });

        return steps;
    }

    generateUnitVectorSteps(problem, solution) {
        const vector = problem.vectors[0];
        const steps = [];

        if (solution.error) {
            return [{
                stepNumber: 1,
                step: 'Check vector',
                description: 'Cannot normalize zero vector',
                error: solution.error,
                reasoning: 'Division by zero is undefined'
            }];
        }

        steps.push({
            stepNumber: 1,
            step: 'Given vector',
            description: 'Start with the vector to normalize',
            expression: solution.vectorNotation,
            reasoning: 'Unit vector has same direction but magnitude 1',
            visualHint: 'Normalization scales the vector to length 1',
            goalStatement: 'Calculate û = v/||v||'
        });

        steps.push({
            stepNumber: 2,
            step: 'Calculate magnitude',
            description: 'Find the magnitude of the vector',
            calculation: this.getMagnitudeCalculation(vector),
            result: solution.magnitude,
            reasoning: 'Need magnitude to normalize',
            algebraicRule: '||v|| = √(x² + y² + z²)'
        });

        steps.push({
            stepNumber: 3,
            step: 'Divide each component',
            description: 'Divide each component by the magnitude',
            calculation: vector.map((v, i) => 
                `${this.formatNumber(v)} / ${this.formatNumber(solution.magnitude)} = ${this.formatNumber(solution.unitVector[i])}`
            ).join(', '),
            reasoning: 'Each component is scaled by the same factor',
            algebraicRule: 'û = ⟨x/||v||, y/||v||, z/||v||⟩'
        });

        steps.push({
            stepNumber: 4,
            step: 'Write unit vector',
            description: 'Combine components into unit vector',
            expression: solution.unitVectorNotation,
            result: solution.unitVector,
            verification: `||û|| = ${this.formatNumber(solution.verification)}`,
            finalAnswer: true,
            reasoning: 'Unit vector preserves direction but has magnitude 1',
            interpretation: solution.interpretation
        });

        return steps;
    }

    generateProjectionSteps(problem, solution) {
        const [u, v] = problem.vectors;
        const steps = [];

        if (solution.error) {
            return [{
                stepNumber: 1,
                step: 'Check vectors',
                error: solution.error,
                reasoning: 'Cannot project onto zero vector'
            }];
        }

        steps.push({
            stepNumber: 1,
            step: 'Given vectors',
            description: 'Project vector u onto vector v',
            vectorU: solution.vectorU,
            vectorV: solution.vectorV,
            reasoning: 'Projection finds the component of u in the direction of v',
            visualHint: 'Think of projection as the shadow of u onto v',
            goalStatement: 'Calculate proj_v(u) = ((u · v)/(v · v))v'
        });

        steps.push({
            stepNumber: 2,
            step: 'Calculate u · v',
            description: 'Find the dot product of u and v',
            calculation: this.getDotProductCalculation(u, v),
            result: this.calculateDotProduct(u, v),
            reasoning: 'Dot product measures alignment',
            algebraicRule: 'u · v = u₁v₁ + u₂v₂ + u₃v₃'
        });

        steps.push({
            stepNumber: 3,
            step: 'Calculate v · v',
            description: 'Find the dot product of v with itself',
            calculation: this.getDotProductCalculation(v, v),
            result: this.calculateDotProduct(v, v),
            reasoning: 'This is ||v||² (magnitude squared)',
            algebraicRule: 'v · v = ||v||²'
        });

        steps.push({
            stepNumber: 4,
            step: 'Calculate scalar projection',
            description: 'Find the component of u along v',
            result: solution.scalarProjection,
            reasoning: 'Signed length of projection',
            formula: 'comp_v(u) = (u · v) / ||v||'
        });

        steps.push({
            stepNumber: 5,
            step: 'Calculate vector projection',
            description: 'Multiply the scalar by direction vector',
            expression: solution.projectionNotation,
            result: solution.vectorProjection,
            finalAnswer: true,
            reasoning: 'Vector projection is in the direction of v',
            interpretation: solution.interpretation
        });

        if (solution.orthogonalComponent) {
            steps.push({
                stepNumber: 6,
                step: 'Find orthogonal component',
                description: 'Calculate u - proj_v(u)',
                expression: solution.orthogonalNotation,
                result: solution.orthogonalComponent,
                reasoning: 'Orthogonal component is perpendicular to v',
                verification: solution.verification
            });
        }

        return steps;
    }

    generateAngleSteps(problem, solution) {
        const [u, v] = problem.vectors;
        const steps = [];

        if (solution.error) {
            return [{
                stepNumber: 1,
                step: 'Check vectors',
                error: solution.error,
                reasoning: 'Cannot find angle with zero vector'
            }];
        }

        steps.push({
            stepNumber: 1,
            step: 'Given vectors',
            description: 'Find angle between two vectors',
            vectorU: solution.vectorU,
            vectorV: solution.vectorV,
            reasoning: 'Angle is found using dot product formula',
            visualHint: 'Angle measured from u to v',
            goalStatement: 'Calculate θ = arccos((u · v)/(||u|| ||v||))'
        });

        steps.push({
            stepNumber: 2,
            step: 'Calculate dot product',
            description: 'Find u · v',
            calculation: this.getDotProductCalculation(u, v),
            result: solution.dotProduct,
            reasoning: 'Dot product relates to angle',
            algebraicRule: 'u · v = ||u|| ||v|| cos θ'
        });

        steps.push({
            stepNumber: 3,
            step: 'Calculate magnitudes',
            description: 'Find ||u|| and ||v||',
            calculations: {
                magU: this.getMagnitudeCalculation(u),
                magV: this.getMagnitudeCalculation(v)
            },
            results: solution.magnitudes,
            reasoning: 'Need magnitudes for angle formula'
        });

        steps.push({
            stepNumber: 4,
            step: 'Calculate cos θ',
            description: 'Divide dot product by product of magnitudes',
            calculation: `${this.formatNumber(solution.dotProduct)} / (${this.formatNumber(solution.magnitudes.u)} × ${this.formatNumber(solution.magnitudes.v)})`,
            result: solution.cosTheta,
            reasoning: 'This gives the cosine of the angle',
            formula: 'cos θ = (u · v)/(||u|| ||v||)'
        });

        steps.push({
            stepNumber: 5,
            step: 'Calculate angle',
            description: 'Take inverse cosine (arccos) of the result',
            resultRadians: solution.angleRadians,
            resultDegrees: solution.angleDegrees,
            finalAnswer: true,
            reasoning: 'Inverse cosine gives the angle measure',
            interpretation: solution.relationship
        });

        return steps;
    }

    generateGenericVectorSteps(problem, solution) {
        return [{
            stepNumber: 1,
            step: 'Vector operation',
            description: `Perform ${solution.operation}`,
            result: solution.result || solution,
            reasoning: 'Apply appropriate vector operation techniques'
        }];
    }

    // ENHANCEMENT METHODS (similar to linear workbook)

    enhanceStepExplanation(step, problem, solution, stepIndex, totalSteps) {
        const enhanced = {
            ...step,
            stepNumber: stepIndex + 1,
            totalSteps: totalSteps,

            explanations: {
                conceptual: this.getConceptualExplanation(step, problem),
                procedural: this.getProceduralExplanation(step),
                visual: this.getVisualExplanation(step, problem),
                algebraic: this.getAlgebraicExplanation(step)
            },

            adaptiveExplanation: this.getAdaptiveExplanation(step, this.explanationLevel),

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

    getConceptualExplanation(step, problem) {
        const conceptualMap = {
            'Given vectors': 'Vectors are mathematical objects with both magnitude and direction, represented by components in each dimension.',
            'Add components': 'Component-wise addition preserves the geometric meaning - we\'re combining the effects in each direction independently.',
            'Calculate dot product': 'Dot product measures alignment: positive means vectors point generally the same way, negative means opposite ways, zero means perpendicular.',
            'Calculate cross product': 'Cross product creates a new vector perpendicular to both inputs, with magnitude equal to the parallelogram area they form.',
            'Calculate magnitude': 'Magnitude is the "length" of the vector - how far it reaches from the origin in space.'
        };

        return conceptualMap[step.step] || 'This step advances our understanding of the vector relationship.';
    }

    getProceduralExplanation(step) {
        return step.calculation ? 
            `Perform the calculation: ${step.calculation}` :
            `Execute the operation systematically following the formula.`;
    }

    getVisualExplanation(step, problem) {
        const visualMap = {
            'vector_addition': 'Imagine placing the second vector\'s tail at the first vector\'s head - the result connects start to final end.',
            'dot_product': 'Picture projecting one vector onto another - the dot product measures this projected length times the other vector\'s length.',
            'cross_product': 'Use your right hand: point fingers along first vector, curl toward second, thumb points in result direction.',
            'vector_magnitude': 'Visualize the straight-line distance from the origin to the point represented by the vector.'
        };

        return visualMap[problem.type] || 'Visualize the geometric meaning of this operation in space.';
    }

    getAlgebraicExplanation(step) {
        return step.algebraicRule || 'Apply vector algebra rules systematically';
    }

    getAdaptiveExplanation(step, level) {
        // Adapt language complexity based on level
        return {
            adapted: `[${level} explanation] ${step.description}`,
            complexity: level
        };
    }

    identifyPrerequisites(step, problemType) {
        const prereqMap = {
            'vector_addition': ['Component notation', 'Basic arithmetic'],
            'dot_product': ['Multiplication', 'Summation', 'Vector components'],
            'cross_product': ['Determinants', '3D coordinates', 'Right-hand rule'],
            'vector_magnitude': ['Pythagorean theorem', 'Square roots']
        };

        return prereqMap[problemType] || ['Basic vector concepts'];
    }

    identifyKeyVocabulary(step) {
        const vocab = [];
        if (step.step.includes('component')) vocab.push('component', 'coordinate');
        if (step.step.includes('magnitude')) vocab.push('magnitude', 'length', 'norm');
        if (step.step.includes('dot')) vocab.push('dot product', 'scalar product');
        if (step.step.includes('cross')) vocab.push('cross product', 'vector product', 'perpendicular');
        return vocab;
    }

    connectToPreviousStep(step, stepIndex) {
        return {
            connection: `Building on step ${stepIndex}, we now ${step.description.toLowerCase()}`,
            progression: 'Each step brings us closer to the complete solution'
        };
    }

    generateStepBridge(current, next) {
        return {
            currentState: current.result ? `We have: ${current.result}` : 'Current state established',
            nextGoal: `Next: ${next.description}`,
            why: `This prepares us for ${next.step}`
        };
    }

    explainStepProgression(current, next) {
