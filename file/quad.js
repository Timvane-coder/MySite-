// Enhanced Quadratic Mathematical Workbook - Improved Step-by-Step Explanations
import * as math from 'mathjs';

export class EnhancedQuadraticMathematicalWorkbook {
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
        this.initializeQuadraticSolvers();
        this.initializeErrorDatabase();
        this.initializeExplanationTemplates();
    }

    initializeQuadraticLessons() {
        this.lessons = {
            standard_quadratic: {
                title: "Standard Quadratic Equations",
                concepts: [
                    "General form: ax² + bx + c = 0 where a ≠ 0",
                    "Goal: find values of x that make the equation equal to zero",
                    "Solutions are called roots or zeros",
                    "Can have 0, 1, or 2 real solutions"
                ],
                theory: "Quadratic equations represent parabolic relationships. The coefficient 'a' determines concavity, 'b' affects axis of symmetry position, and 'c' is the y-intercept.",
                keyFormulas: {
                    "Standard Form": "ax² + bx + c = 0",
                    "Quadratic Formula": "x = (-b ± √(b² - 4ac))/(2a)",
                    "Discriminant": "Δ = b² - 4ac",
                    "Vertex Form": "a(x - h)² + k"
                },
                solvingSteps: [
                    "Identify coefficients a, b, and c",
                    "Calculate discriminant Δ = b² - 4ac",
                    "Determine number of solutions based on Δ",
                    "Apply quadratic formula to find solutions",
                    "Verify solutions by substitution"
                ],
                applications: [
                    "Projectile motion problems",
                    "Area and geometry optimization",
                    "Revenue and profit maximization",
                    "Physics and engineering modeling"
                ]
            },

            factoring_quadratic: {
                title: "Solving by Factoring",
                concepts: [
                    "Express quadratic as product of two binomials",
                    "Use zero product property: if ab = 0, then a = 0 or b = 0",
                    "Most efficient when factors are integers",
                    "Not all quadratics can be factored over integers"
                ],
                theory: "Factoring transforms a quadratic equation into a product form, allowing use of the zero product property to find solutions quickly.",
                keyFormulas: {
                    "Factored Form": "(x - r₁)(x - r₂) = 0",
                    "Zero Product Property": "If ab = 0, then a = 0 or b = 0",
                    "Sum and Product": "x² + (r₁ + r₂)x + r₁r₂"
                },
                solvingSteps: [
                    "Ensure equation is in standard form ax² + bx + c = 0",
                    "Factor out GCF if present",
                    "Find two numbers that multiply to ac and add to b",
                    "Factor the quadratic expression",
                    "Apply zero product property to find solutions"
                ],
                applications: [
                    "Quick solutions for simple quadratics",
                    "Graphing and analysis",
                    "Algebraic proofs",
                    "Polynomial analysis"
                ]
            },

            completing_square: {
                title: "Completing the Square",
                concepts: [
                    "Transform standard form into vertex form",
                    "Create perfect square trinomial",
                    "Reveals vertex of parabola",
                    "Foundation for quadratic formula derivation"
                ],
                theory: "Completing the square converts ax² + bx + c into a(x - h)² + k form, making the vertex and other properties visible.",
                keyFormulas: {
                    "Perfect Square": "(x + p)² = x² + 2px + p²",
                    "Completion Value": "Add and subtract (b/2a)²",
                    "Vertex Form": "a(x - h)² + k where h = -b/2a"
                },
                solvingSteps: [
                    "Divide all terms by a (if a ≠ 1)",
                    "Move constant term to right side",
                    "Add (b/2a)² to both sides",
                    "Factor left side as perfect square",
                    "Solve by taking square root of both sides"
                ],
                applications: [
                    "Finding vertex of parabola",
                    "Graphing quadratic functions",
                    "Optimization problems",
                    "Deriving quadratic formula"
                ]
            },

            quadratic_formula: {
                title: "Quadratic Formula Method",
                concepts: [
                    "Universal method for all quadratic equations",
                    "Derived from completing the square",
                    "Discriminant reveals nature of solutions",
                    "Always produces exact solutions"
                ],
                theory: "The quadratic formula provides a direct method to find solutions of any quadratic equation, regardless of whether it can be factored.",
                keyFormulas: {
                    "Quadratic Formula": "x = (-b ± √(b² - 4ac))/(2a)",
                    "Discriminant": "Δ = b² - 4ac",
                    "Sum of Roots": "x₁ + x₂ = -b/a",
                    "Product of Roots": "x₁ · x₂ = c/a"
                },
                discriminantAnalysis: {
                    "Δ > 0": "Two distinct real solutions",
                    "Δ = 0": "One repeated real solution (vertex on x-axis)",
                    "Δ < 0": "Two complex conjugate solutions (no real solutions)"
                },
                applications: [
                    "When factoring is difficult or impossible",
                    "Finding exact irrational solutions",
                    "Analyzing solution types",
                    "Solving real-world quadratic problems"
                ]
            },

            quadratic_inequality: {
                title: "Quadratic Inequalities",
                concepts: [
                    "Solutions are intervals on number line",
                    "Related to sign of quadratic expression",
                    "Critical points are roots of related equation",
                    "Test intervals between and beyond roots"
                ],
                theory: "Quadratic inequalities define regions where the quadratic expression is positive or negative. Solutions depend on parabola orientation and root locations.",
                keyFormulas: {
                    "Standard Form": "ax² + bx + c > 0 (or <, ≤, ≥)",
                    "Critical Points": "Roots of ax² + bx + c = 0",
                    "Sign Analysis": "Test points in each interval"
                },
                solvingSteps: [
                    "Solve related equation ax² + bx + c = 0",
                    "Plot critical points on number line",
                    "Identify test intervals",
                    "Test sign of expression in each interval",
                    "Write solution using interval notation"
                ],
                applications: [
                    "Range restrictions in optimization",
                    "Feasible region determination",
                    "Constraint analysis",
                    "Quality control specifications"
                ]
            },

            rational_equations: {
                title: "Equations Leading to Quadratics",
                concepts: [
                    "Rational equations can lead to quadratics when cleared",
                    "Must check for extraneous solutions",
                    "Radical equations may become quadratic when squared",
                    "Domain restrictions must be considered"
                ],
                theory: "Many non-quadratic equations transform into quadratic form through algebraic manipulation, requiring quadratic solution methods.",
                transformations: {
                    "Rational": "Clear denominators → quadratic",
                    "Radical": "Square both sides → quadratic",
                    "Quadratic Form": "Substitution u = f(x) → quadratic in u"
                },
                criticalWarning: "Always check solutions in original equation to eliminate extraneous solutions introduced by transformations",
                applications: [
                    "Rate and work problems",
                    "Physics equations with reciprocals",
                    "Higher-degree equations in quadratic form",
                    "Radical equations"
                ]
            },

            vertex_form: {
                title: "Vertex Form and Graphing",
                concepts: [
                    "Vertex form: f(x) = a(x - h)² + k",
                    "Vertex located at point (h, k)",
                    "Parameter 'a' controls width and direction",
                    "Facilitates graphing and transformations"
                ],
                theory: "Vertex form explicitly shows the vertex of the parabola and makes transformations (shifts, stretches, reflections) transparent.",
                keyFormulas: {
                    "Vertex Form": "f(x) = a(x - h)² + k",
                    "Vertex": "(h, k)",
                    "Axis of Symmetry": "x = h",
                    "Standard to Vertex": "Complete the square"
                },
                graphingElements: [
                    "Vertex (h, k)",
                    "Axis of symmetry x = h",
                    "Direction: opens up if a > 0, down if a < 0",
                    "Width: |a| > 1 narrow, |a| < 1 wide",
                    "y-intercept: f(0)"
                ],
                applications: [
                    "Graphing quadratic functions",
                    "Finding maximum/minimum values",
                    "Optimization problems",
                    "Transformational geometry"
                ]
            },

            quadratic_systems: {
                title: "Systems with Quadratic Equations",
                concepts: [
                    "System with one or more quadratic equations",
                    "Can have 0, 1, 2, or more solutions",
                    "Solutions are intersection points of graphs",
                    "Substitution method often effective"
                ],
                theory: "Systems involving quadratics represent simultaneous conditions where both equations must be satisfied. Solutions correspond to intersection points.",
                solutionTypes: [
                    "Linear-Quadratic: 0, 1, or 2 solutions",
                    "Quadratic-Quadratic: 0, 1, 2, 3, or 4 solutions",
                    "Geometric interpretation as intersection points"
                ],
                methods: [
                    "Substitution method",
                    "Elimination (when possible)",
                    "Graphical method",
                    "Using discriminant for analysis"
                ],
                applications: [
                    "Trajectory intersections",
                    "Market equilibrium with nonlinear supply/demand",
                    "Optimization with constraints",
                    "Engineering design problems"
                ]
            },

            quadratic_functions: {
                title: "Quadratic Function Analysis",
                concepts: [
                    "f(x) = ax² + bx + c defines a parabola",
                    "Domain: all real numbers",
                    "Range: depends on vertex and direction",
                    "Symmetry about vertical line through vertex"
                ],
                theory: "Quadratic functions model many natural phenomena with maximum or minimum values. Complete analysis reveals all key features.",
                analysisComponents: {
                    "Vertex": "Maximum or minimum point",
                    "Axis of Symmetry": "x = -b/(2a)",
                    "Direction": "Concavity based on sign of a",
                    "Intercepts": "x-intercepts (roots) and y-intercept",
                    "Domain": "All real numbers (-∞, ∞)",
                    "Range": "[k, ∞) if a > 0, (-∞, k] if a < 0"
                },
                applications: [
                    "Projectile motion analysis",
                    "Business revenue/profit functions",
                    "Area optimization",
                    "Physics and engineering models"
                ]
            },

            word_problems: {
                title: "Quadratic Word Problems",
                concepts: [
                    "Translate real situations into quadratic equations",
                    "Identify what variable represents",
                    "Set up equation based on problem conditions",
                    "Interpret solutions in context"
                ],
                theory: "Quadratic word problems require translating verbal descriptions into mathematical models, solving, and interpreting results meaningfully.",
                problemTypes: {
                    "Area/Geometry": "Rectangles, borders, paths with area constraints",
                    "Projectile Motion": "Height as function of time h(t) = -16t² + v₀t + h₀",
                    "Number Problems": "Consecutive integers, digit problems",
                    "Business": "Revenue = (price)(quantity), profit optimization",
                    "Work/Rate": "Combined rates, time relationships",
                    "Pythagorean": "Right triangle problems"
                },
                solutionStrategy: [
                    "Read carefully and identify unknowns",
                    "Define variable clearly",
                    "Write equation from problem conditions",
                    "Solve quadratic equation",
                    "Check reasonableness in context",
                    "Answer with appropriate units"
                ],
                commonFormulas: {
                    "Area": "A = lw for rectangles",
                    "Projectile": "h(t) = -16t² + v₀t + h₀ (feet) or -4.9t² + v₀t + h₀ (meters)",
                    "Pythagorean": "a² + b² = c²",
                    "Consecutive Integers": "n, n+1 or n, n+2"
                }
            },

            complex_solutions: {
                title: "Complex Solutions",
                concepts: [
                    "Occur when discriminant is negative",
                    "Come in conjugate pairs: a + bi and a - bi",
                    "Imaginary unit: i = √(-1), i² = -1",
                    "Graph has no x-intercepts"
                ],
                theory: "Complex solutions extend the real number system to ensure all quadratics have solutions. They have important applications in engineering and physics.",
                keyFormulas: {
                    "Complex Number": "a + bi where i² = -1",
                    "Conjugate Pairs": "x = p ± qi",
                    "Standard Form": "x = (-b ± i√(4ac - b²))/(2a) when Δ < 0"
                },
                properties: [
                    "Sum is real: (a + bi) + (a - bi) = 2a",
                    "Product is real: (a + bi)(a - bi) = a² + b²",
                    "Graph doesn't cross x-axis",
                    "Parabola entirely above or below x-axis"
                ],
                applications: [
                    "Electrical engineering (AC circuits)",
                    "Signal processing",
                    "Quantum mechanics",
                    "Control systems"
                ]
            },

            optimization: {
                title: "Quadratic Optimization",
                concepts: [
                    "Find maximum or minimum value of quadratic function",
                    "Vertex gives optimal value",
                    "Applications in business, geometry, physics",
                    "May involve constraint equations"
                ],
                theory: "Quadratic optimization finds the best value (maximum or minimum) of a quantity modeled by a quadratic function.",
                keyFormulas: {
                    "Vertex x-coordinate": "x = -b/(2a)",
                    "Optimal Value": "f(-b/(2a)) = c - b²/(4a)",
                    "Maximum": "When a < 0",
                    "Minimum": "When a > 0"
                },
                problemTypes: [
                    "Maximum area with fixed perimeter",
                    "Maximum revenue/profit in business",
                    "Optimal launch angle in projectile motion",
                    "Minimum cost in production"
                ],
                solutionProcess: [
                    "Write quantity to optimize as function of one variable",
                    "Express as quadratic function",
                    "Find vertex using x = -b/(2a)",
                    "Calculate optimal value",
                    "Verify it's maximum or minimum as required"
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
            'leq': '≤', 'geq': '≥', 'neq': '≠', 'approx': '≈',
            'infinity': '∞', 'plusminus': '±', 'sqrt': '√',
            // Greek letters
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'Δ',
            'pi': 'π', 'theta': 'θ', 'lambda': 'λ', 'mu': 'μ',
            // Special symbols
            'intersection': '∩', 'union': '∪', 'subset': '⊂', 'element': '∈',
            'perpendicular': '⊥', 'parallel': '∥', 'squared': '²'
        };
    }

    initializeQuadraticSolvers() {
        this.quadraticTypes = {
            // Standard quadratic equation
            standard_quadratic: {
                patterns: [
                    /([+-]?\d*\.?\d*)x\^2\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*=\s*0/,
                    /([+-]?\d*\.?\d*)x²\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*=\s*0/,
                    /quadratic.*equation/i,
                    /solve.*x\^2/i
                ],
                solver: this.solveStandardQuadratic.bind(this),
                name: 'Standard Quadratic Equation',
                category: 'basic_quadratic',
                description: 'Solves ax² + bx + c = 0'
            },

            // Factoring method
            factoring_quadratic: {
                patterns: [
                    /factor.*quadratic/i,
                    /solve.*by.*factoring/i,
                    /factor.*x\^2/i
                ],
                solver: this.solveByFactoring.bind(this),
                name: 'Solving by Factoring',
                category: 'factoring',
                description: 'Solves by factoring and zero product property'
            },

            // Completing the square
            completing_square: {
                patterns: [
                    /complet.*square/i,
                    /vertex.*form/i,
                    /complete.*the.*square/i
                ],
                solver: this.solveByCompletingSquare.bind(this),
                name: 'Completing the Square',
                category: 'completing_square',
                description: 'Solves by completing the square method'
            },

            // Quadratic formula
            quadratic_formula: {
                patterns: [
                    /quadratic.*formula/i,
                    /use.*formula/i,
                    /apply.*quadratic.*formula/i
                ],
                solver: this.solveByQuadraticFormula.bind(this),
                name: 'Quadratic Formula Method',
                category: 'quadratic_formula',
                description: 'Solves using quadratic formula'
            },

            // Quadratic inequalities
            quadratic_inequality: {
                patterns: [
                    /([+-]?\d*\.?\d*)x\^2\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*[><≤≥]/,
                    /quadratic.*inequality/i,
                    /inequality.*x\^2/i
                ],
                solver: this.solveQuadraticInequality.bind(this),
                name: 'Quadratic Inequalities',
                category: 'inequalities',
                description: 'Solves ax² + bx + c > 0, <, ≤, or ≥'
            },

            // Vertex form analysis
            vertex_form: {
                patterns: [
                    /vertex.*form/i,
                    /find.*vertex/i,
                    /parabola.*vertex/i
                ],
                solver: this.analyzeVertexForm.bind(this),
                name: 'Vertex Form Analysis',
                category: 'vertex_analysis',
                description: 'Converts to vertex form and analyzes parabola'
            },

            // Quadratic function analysis
            function_analysis: {
                patterns: [
                    /analyz.*quadratic.*function/i,
                    /properties.*parabola/i,
                    /function.*f\(x\).*x\^2/i
                ],
                solver: this.analyzeQuadraticFunction.bind(this),
                name: 'Quadratic Function Analysis',
                category: 'function_analysis',
                description: 'Complete analysis of quadratic function'
            },

            // Systems with quadratics
            quadratic_system: {
                patterns: [
                    /system.*quadratic/i,
                    /quadratic.*system/i,
                    /simultaneous.*x\^2/i
                ],
                solver: this.solveQuadraticSystem.bind(this),
                name: 'Systems with Quadratic Equations',
                category: 'systems',
                description: 'Solves systems involving quadratic equations'
            },

            // Word problems - Projectile motion
            projectile_motion: {
                patterns: [
                    /projectile/i,
                    /thrown.*ball/i,
                    /height.*time/i,
                    /trajectory/i
                ],
                solver: this.solveProjectileMotion.bind(this),
                name: 'Projectile Motion Problems',
                category: 'word_problems',
                description: 'Solves projectile and trajectory problems'
            },

            // Word problems - Area and geometry
            area_geometry: {
                patterns: [
                    /area.*rectangle/i,
                    /dimension.*area/i,
                    /geometric.*quadratic/i,
                    /perimeter.*area/i
                ],
                solver: this.solveAreaGeometry.bind(this),
                name: 'Area and Geometry Problems',
                category: 'word_problems',
                description: 'Solves area optimization and geometry problems'
            },

            // Word problems - Number problems
            number_problems: {
                patterns: [
                    /consecutive.*integer/i,
                    /number.*product/i,
                    /two.*numbers.*sum/i
                ],
                solver: this.solveNumberProblems.bind(this),
                name: 'Number Problems',
                category: 'word_problems',
                description: 'Solves problems involving number relationships'
            },

            // Word problems - Business/Revenue
            business_revenue: {
                patterns: [
                    /revenue/i,
                    /profit.*price/i,
                    /maximum.*revenue/i,
                    /business.*optimization/i
                ],
                solver: this.solveBusinessRevenue.bind(this),
                name: 'Business and Revenue Problems',
                category: 'word_problems',
                description: 'Solves business optimization problems'
            },

            // Optimization problems
            optimization: {
                patterns: [
                    /maximiz.*quadratic/i,
                    /minimiz.*quadratic/i,
                    /optimi.*quadratic/i,
                    /maximum.*value/i,
                    /minimum.*value/i
                ],
                solver: this.solveOptimization.bind(this),
                name: 'Quadratic Optimization',
                category: 'optimization',
                description: 'Finds maximum or minimum values'
            },

            // Rational equations leading to quadratics
            rational_to_quadratic: {
                patterns: [
                    /rational.*equation/i,
                    /equation.*fraction.*x\^2/i,
                    /reciprocal.*quadratic/i
                ],
                solver: this.solveRationalToQuadratic.bind(this),
                name: 'Rational Equations',
                category: 'rational_equations',
                description: 'Solves rational equations leading to quadratics'
            },

            // Radical equations leading to quadratics
            radical_to_quadratic: {
                patterns: [
                    /radical.*equation/i,
                    /sqrt.*equation/i,
                    /square.*root.*equation/i
                ],
                solver: this.solveRadicalToQuadratic.bind(this),
                name: 'Radical Equations',
                category: 'radical_equations',
                description: 'Solves radical equations leading to quadratics'
            },

            // Quadratic form equations
            quadratic_form: {
                patterns: [
                    /quadratic.*form/i,
                    /equation.*form.*u\^2/i,
                    /substitution.*quadratic/i
                ],
                solver: this.solveQuadraticForm.bind(this),
                name: 'Quadratic Form Equations',
                category: 'quadratic_form',
                description: 'Solves equations reducible to quadratic form'
            },

            // Complex solutions
            complex_solutions: {
                patterns: [
                    /complex.*solution/i,
                    /imaginary.*solution/i,
                    /no.*real.*solution/i
                ],
                solver: this.solveWithComplexSolutions.bind(this),
                name: 'Complex Solutions',
                category: 'complex_solutions',
                description: 'Handles quadratics with complex solutions'
            }
        };
    }

    initializeErrorDatabase() {
        this.commonMistakes = {
            standard_quadratic: {
                'Apply quadratic formula': [
                    'Sign errors with -b term',
                    'Forgetting ± symbol (missing second solution)',
                    'Arithmetic errors under square root',
                    'Division errors with 2a denominator'
                ],
                'Calculate discriminant': [
                    'Sign error in b² - 4ac',
                    'Incorrect order of operations',
                    'Missing parentheses in -4ac'
                ]
            },
            factoring_quadratic: {
                'Factor expression': [
                    'Incorrect factor pairs',
                    'Sign errors in factors',
                    'Forgetting to factor out GCF first',
                    'Not checking factors multiply correctly'
                ],
                'Apply zero product property': [
                    'Setting factored expression equal to x instead of 0',
                    'Missing one of the solutions'
                ]
            },
            completing_square: {
                'Complete the square': [
                    'Incorrect calculation of (b/2a)²',
                    'Forgetting to add same value to both sides',
                    'Sign errors when moving constant term',
                    'Not dividing by a first when a ≠ 1'
                ]
            },
            quadratic_inequality: {
                'Determine solution intervals': [
                    'Incorrect test point selection',
                    'Wrong inequality symbols in final answer',
                    'Forgetting to include/exclude boundary points',
                    'Not considering parabola concavity'
                ]
            }
        };

        this.errorPrevention = {
            quadratic_formula_signs: {
                reminder: 'Write formula first: x = (-b ± √(b² - 4ac))/(2a)',
                method: 'Substitute carefully, keeping all signs explicit'
            },
            discriminant_check: {
                reminder: 'Calculate Δ = b² - 4ac first to know solution type',
                method: 'Δ > 0: two real, Δ = 0: one real, Δ < 0: complex'
            },
            factoring_verification: {
                reminder: 'Always expand factors to verify correctness',
                method: 'Use FOIL to check (x + p)(x + q) = x² + (p+q)x + pq'
            },
            inequality_testing: {
                reminder: 'Test a point in each interval to determine sign',
                method: 'Choose simple test points like 0, ±1'
            }
        };
    }

    initializeExplanationTemplates() {
        this.explanationStyles = {
            conceptual: {
                focus: 'Why this step works and its mathematical meaning',
                language: 'intuitive and meaning-focused'
            },
            procedural: {
                focus: 'Exact sequence of operations to perform',
                language: 'step-by-step instructions'
            },
            visual: {
                focus: 'Graphical and spatial understanding',
                language: 'visual and spatial metaphors'
            },
            algebraic: {
                focus: 'Formal algebraic rules and properties',
                language: 'precise mathematical terminology'
            }
        };

        this.difficultyLevels = {
            basic: {
                vocabulary: 'simple, everyday language',
                detail: 'essential steps only',
                examples: 'concrete numbers and simple cases'
            },
            intermediate: {
                vocabulary: 'standard mathematical terms',
                detail: 'main steps with brief explanations',
                examples: 'mix of concrete and abstract'
            },
            detailed: {
                vocabulary: 'full mathematical vocabulary',
                detail: 'comprehensive explanations with reasoning',
                examples: 'abstract and generalized cases'
            },
            scaffolded: {
                vocabulary: 'progressive from simple to complex',
                detail: 'guided discovery with questions',
                examples: 'carefully sequenced difficulty progression'
            }
        };
    }

    // Main solver method
    solveQuadraticProblem(config) {
        const { equation, scenario, parameters, problemType, context } = config;

        try {
            // Parse the problem
            this.currentProblem = this.parseQuadraticProblem(equation, scenario, parameters, problemType, context);

            // Solve the problem
            this.currentSolution = this.solveQuadraticProblem_Internal(this.currentProblem);

            // Generate solution steps
            this.solutionSteps = this.generateQuadraticSteps(this.currentProblem, this.currentSolution);

            // Generate graph data if applicable
            this.generateQuadraticGraphData();

            // Generate workbook
            this.generateQuadraticWorkbook();

            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                solutions: this.currentSolution?.solutions,
                solutionType: this.currentSolution?.solutionType
            };

        } catch (error) {
            throw new Error(`Failed to solve quadratic problem: ${error.message}`);
        }
    }

    parseQuadraticProblem(equation, scenario = '', parameters = {}, problemType = null, context = {}) {
        const cleanInput = equation ? this.cleanMathExpression(equation) : '';

        // If problem type is specified, use it directly
        if (problemType && this.quadraticTypes[problemType]) {
            return {
                originalInput: equation || `${problemType} problem`,
                cleanInput: cleanInput,
                type: problemType,
                scenario: scenario,
                parameters: { ...parameters },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        // Auto-detect quadratic problem type
        for (const [type, config] of Object.entries(this.quadraticTypes)) {
            for (const pattern of config.patterns) {
                if (pattern.test(cleanInput) || pattern.test(scenario)) {
                    const match = cleanInput.match(pattern);
                    const extractedParams = this.extractQuadraticParameters(match, type);

                    return {
                        originalInput: equation || scenario,
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

        // Default to standard quadratic if coefficients are provided
        if (parameters.a !== undefined || parameters.b !== undefined || parameters.c !== undefined) {
            return {
                originalInput: equation || 'Quadratic equation with given coefficients',
                cleanInput: cleanInput,
                type: 'standard_quadratic',
                scenario: scenario,
                parameters: { 
                    a: parameters.a || 1, 
                    b: parameters.b || 0,
                    c: parameters.c || 0,
                    ...parameters 
                },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        throw new Error(`Unable to recognize quadratic problem type from: ${equation || scenario}`);
    }

    cleanMathExpression(expression) {
        return expression
            .replace(/\s+/g, ' ')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/≠/g, '!=')
            .replace(/\^2/g, '²')
            .replace(/\*\*/g, '^')
            .trim();
    }

    extractQuadraticParameters(match, type) {
        const params = {};

        if ((type === 'standard_quadratic' || type === 'quadratic_inequality') && match) {
            params.a = this.parseCoefficient(match[1]) || 1;
            params.b = this.parseCoefficient(match[2]) || 0;
            params.c = this.parseCoefficient(match[3]) || 0;
            
            if (type === 'quadratic_inequality') {
                const inequalityMatch = match[0].match(/[><≤≥]/);
                params.operator = inequalityMatch ? inequalityMatch[0] : '>';
            }
        }

        return params;
    }

    parseCoefficient(coeff) {
        if (!coeff || coeff.trim() === '') return 0;

        let cleaned = coeff.replace(/\s+/g, '');
        if (cleaned === '+' || cleaned === '') return 1;
        if (cleaned === '-') return -1;

        // Handle fractions
        const fractionMatch = cleaned.match(/^([+-]?\d*\.?\d*)\/(\d*\.?\d*)$/);
        if (fractionMatch) {
            const numerator = parseFloat(fractionMatch[1]) || 1;
            const denominator = parseFloat(fractionMatch[2]) || 1;
            return denominator !== 0 ? numerator / denominator : 0;
        }

        // Handle regular numbers
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    }

    solveQuadraticProblem_Internal(problem) {
        const solver = this.quadraticTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for quadratic problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    // QUADRATIC SOLVERS

    solveStandardQuadratic(problem) {
        const { a, b, c } = problem.parameters;

        if (Math.abs(a) < 1e-10) {
            throw new Error('Coefficient a cannot be zero in a quadratic equation');
        }

        // Calculate discriminant
        const discriminant = b * b - 4 * a * c;

        let solutions = [];
        let solutionType = '';
        let complexSolutions = [];

        if (discriminant > 1e-10) {
            // Two distinct real solutions
            const sqrtDiscriminant = Math.sqrt(discriminant);
            const x1 = (-b + sqrtDiscriminant) / (2 * a);
            const x2 = (-b - sqrtDiscriminant) / (2 * a);
            solutions = [x1, x2].sort((a, b) => a - b);
            solutionType = 'Two distinct real solutions';
        } else if (Math.abs(discriminant) <= 1e-10) {
            // One repeated real solution
            const x = -b / (2 * a);
            solutions = [x];
            solutionType = 'One repeated real solution (double root)';
        } else {
            // Complex solutions
            const realPart = -b / (2 * a);
            const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
            complexSolutions = [
                { real: realPart, imaginary: imaginaryPart },
                { real: realPart, imaginary: -imaginaryPart }
            ];
            solutionType = 'Two complex conjugate solutions';
        }

        return {
            equation: `${a}x² + ${b}x + ${c} = 0`,
            coefficients: { a, b, c },
            discriminant: discriminant,
            solutionType: solutionType,
            solutions: solutions,
            complexSolutions: complexSolutions,
            vertex: this.calculateVertex(a, b, c),
            axisOfSymmetry: -b / (2 * a),
            yIntercept: c,
            sumOfRoots: solutions.length > 0 ? -b / a : null,
            productOfRoots: solutions.length > 0 ? c / a : null,
            verification: solutions.length > 0 ? this.verifyQuadraticSolutions(solutions, a, b, c) : null,
            category: 'standard_quadratic'
        };
    }

    solveByFactoring(problem) {
        const { a, b, c } = problem.parameters;

        // Try to find integer factors
        const factors = this.findQuadraticFactors(a, b, c);

        if (factors) {
            const { factor1, factor2, roots } = factors;
            
            return {
                equation: `${a}x² + ${b}x + ${c} = 0`,
                coefficients: { a, b, c },
                factoredForm: `(${factor1})(${factor2}) = 0`,
                factors: [factor1, factor2],
                solutions: roots,
                solutionType: roots[0] === roots[1] ? 'One repeated solution' : 'Two distinct solutions',
                method: 'Factoring with Zero Product Property',
                verification: this.verifyQuadraticSolutions(roots, a, b, c),
                category: 'factoring_quadratic'
            };
        }

        // If can't factor, use quadratic formula as fallback
        return {
            ...this.solveStandardQuadratic(problem),
            note: 'Could not factor with integers, used quadratic formula instead',
            category: 'factoring_quadratic'
        };
    }

    solveByCompletingSquare(problem) {
        const { a, b, c } = problem.parameters;

        // Steps for completing the square
        const steps = [];

        // Step 1: Divide by a if a ≠ 1
        let a1 = 1, b1 = b / a, c1 = c / a;
        
        if (Math.abs(a - 1) > 1e-10) {
            steps.push({
                description: `Divide all terms by ${a}`,
                equation: `x² + ${b1}x + ${c1} = 0`
            });
        }

        // Step 2: Move constant to right side
        steps.push({
            description: 'Move constant term to right side',
            equation: `x² + ${b1}x = ${-c1}`
        });

        // Step 3: Complete the square
        const halfB = b1 / 2;
        const squareTerm = halfB * halfB;
        
        steps.push({
            description: `Add (${halfB})² = ${squareTerm} to both sides`,
            equation: `x² + ${b1}x + ${squareTerm} = ${-c1 + squareTerm}`
        });

        // Step 4: Factor left side
        steps.push({
            description: 'Factor perfect square trinomial',
            equation: `(x + ${halfB})² = ${-c1 + squareTerm}`
        });

        // Step 5: Solve
        const rightSide = -c1 + squareTerm;
        let solutions = [];
        let solutionType = '';

        if (rightSide > 1e-10) {
            const sqrtValue = Math.sqrt(rightSide);
            solutions = [
                -halfB + sqrtValue,
                -halfB - sqrtValue
            ].sort((a, b) => a - b);
            solutionType = 'Two distinct real solutions';
        } else if (Math.abs(rightSide) <= 1e-10) {
            solutions = [-halfB];
            solutionType = 'One repeated solution';
        } else {
            solutionType = 'Complex solutions';
        }

        return {
            equation: `${a}x² + ${b}x + ${c} = 0`,
            coefficients: { a, b, c },
            vertexForm: `${a}(x + ${halfB})² + ${c - a * squareTerm}`,
            vertex: { x: -halfB, y: c - a * squareTerm },
            steps: steps,
            solutions: solutions,
            solutionType: solutionType,
            method: 'Completing the Square',
            verification: solutions.length > 0 ? this.verifyQuadraticSolutions(solutions, a, b, c) : null,
            category: 'completing_square'
        };
    }

    solveByQuadraticFormula(problem) {
        const { a, b, c } = problem.parameters;

        if (Math.abs(a) < 1e-10) {
            throw new Error('Coefficient a cannot be zero');
        }

        const discriminant = b * b - 4 * a * c;

        return {
            equation: `${a}x² + ${b}x + ${c} = 0`,
            coefficients: { a, b, c },
            formula: 'x = (-b ± √(b² - 4ac))/(2a)',
            substitution: `x = (${-b} ± √(${b}² - 4(${a})(${c})))/(2(${a}))`,
            discriminant: discriminant,
            discriminantInterpretation: this.interpretDiscriminant(discriminant),
            ...this.solveStandardQuadratic(problem),
            method: 'Quadratic Formula',
            category: 'quadratic_formula'
        };
    }

    solveQuadraticInequality(problem) {
        const { a, b, c, operator = '>' } = problem.parameters;

        // First solve the related equation
        const relatedSolution = this.solveStandardQuadratic(problem);
        const roots = relatedSolution.solutions;

        if (roots.length === 0) {
            // No real roots - parabola doesn't cross x-axis
            const testValue = a * 0 * 0 + b * 0 + c; // Test at x = 0
            let satisfied = false;

            switch(operator) {
                case '>': satisfied = testValue > 0; break;
                case '<': satisfied = testValue < 0; break;
                case '>=': case '≥': satisfied = testValue >= 0; break;
                case '<=': case '≤': satisfied = testValue <= 0; break;
            }

            return {
                inequality: `${a}x² + ${b}x + ${c} ${operator} 0`,
                solutionType: satisfied ? 'All real numbers' : 'No solution',
                solutions: satisfied ? ['All real numbers'] : [],
                explanation: satisfied ? 
                    'Parabola is entirely above/below x-axis and satisfies inequality everywhere' :
                    'Parabola is entirely above/below x-axis but never satisfies inequality',
                category: 'quadratic_inequality'
            };
        }

        // Determine solution intervals based on roots and parabola direction
        const solution = this.determineInequalityIntervals(roots, a, operator);

        return {
            inequality: `${a}x² + ${b}x + ${c} ${operator} 0`,
            relatedEquation: `${a}x² + ${b}x + ${c} = 0`,
            criticalPoints: roots,
            parabolaOpens: a > 0 ? 'upward' : 'downward',
            ...solution,
            testPoints: this.generateTestPoints(roots),
            category: 'quadratic_inequality'
        };
    }

    analyzeVertexForm(problem) {
        const { a, b, c } = problem.parameters;

        const h = -b / (2 * a);
        const k = c - (b * b) / (4 * a);

        return {
            standardForm: `f(x) = ${a}x² + ${b}x + ${c}`,
            vertexForm: `f(x) = ${a}(x - ${h})² + ${k}`,
            vertex: { x: h, y: k },
            axisOfSymmetry: `x = ${h}`,
            direction: a > 0 ? 'Opens upward (minimum at vertex)' : 'Opens downward (maximum at vertex)',
            vertexType: a > 0 ? 'Minimum' : 'Maximum',
            optimalValue: k,
            transformations: this.describeTransformations(a, h, k),
            category: 'vertex_form'
        };
    }

    analyzeQuadraticFunction(problem) {
        const { a, b, c } = problem.parameters;

        const vertex = this.calculateVertex(a, b, c);
        const standardSolution = this.solveStandardQuadratic(problem);

        return {
            function: `f(x) = ${a}x² + ${b}x + ${c}`,
            coefficients: { a, b, c },
            vertex: vertex,
            axisOfSymmetry: -b / (2 * a),
            direction: a > 0 ? 'Opens upward' : 'Opens downward',
            yIntercept: c,
            xIntercepts: standardSolution.solutions,
            domain: 'All real numbers (-∞, ∞)',
            range: a > 0 ? `[${vertex.y}, ∞)` : `(-∞, ${vertex.y}]`,
            extremeValue: {
                type: a > 0 ? 'minimum' : 'maximum',
                value: vertex.y,
                location: vertex.x
            },
            concavity: a > 0 ? 'Concave up' : 'Concave down',
            discriminant: standardSolution.discriminant,
            graphBehavior: this.describeGraphBehavior(a, b, c, standardSolution.discriminant),
            category: 'function_analysis'
        };
    }

    solveQuadraticSystem(problem) {
        const { equations, equation1, equation2 } = problem.parameters;

        // Framework for quadratic systems
        return {
            problemType: 'System with Quadratic Equation',
            method: 'Substitution or elimination method',
            steps: [
                'Solve simpler equation for one variable (if applicable)',
                'Substitute into other equation',
                'Solve resulting quadratic equation',
                'Back-substitute to find other variable',
                'Check all solutions in both original equations'
            ],
            note: 'Systems can have 0, 1, 2, 3, or 4 solutions depending on intersection points',
            category: 'quadratic_system'
        };
    }

    solveProjectileMotion(problem) {
        const { initialHeight, initialVelocity, time, targetHeight } = problem.parameters;
        const g = problem.parameters.units === 'metric' ? 4.9 : 16; // gravity constant

        // Height equation: h(t) = -gt² + v₀t + h₀
        const a = -g;
        const b = initialVelocity || 0;
        const c = initialHeight || 0;

        if (targetHeight !== undefined) {
            // Solve for time when height equals targetHeight
            const adjustedProblem = {
                parameters: {
                    a: a,
                    b: b,
                    c: c - targetHeight
                }
            };
            const solution = this.solveStandardQuadratic(adjustedProblem);

            return {
                equation: `h(t) = ${a}t² + ${b}t + ${c}`,
                targetHeight: targetHeight,
                timesToReachHeight: solution.solutions.filter(t => t >= 0),
                maxHeight: this.calculateVertex(a, b, c).y,
                timeToMaxHeight: -b / (2 * a),
                totalFlightTime: solution.solutions.length > 1 ? Math.max(...solution.solutions) : null,
                category: 'projectile_motion'
            };
        }

        return {
            equation: `h(t) = ${a}t² + ${b}t + ${c}`,
            initialHeight: c,
            initialVelocity: b,
            maxHeight: this.calculateVertex(a, b, c).y,
            timeToMaxHeight: -b / (2 * a),
            category: 'projectile_motion'
        };
    }

    solveAreaGeometry(problem) {
        const { length, width, area, relationship } = problem.parameters;

        return {
            problemType: 'Area and Geometry Problem',
            commonSetup: 'A = lw where one dimension is expressed in terms of the other',
            approach: [
                'Define variable for unknown dimension',
                'Express other dimension in terms of variable',
                'Set up equation: length × width = area',
                'Expand to get quadratic equation',
                'Solve and check for reasonable dimensions'
            ],
            category: 'area_geometry'
        };
    }

    solveNumberProblems(problem) {
        return {
            problemType: 'Number Problems',
            commonTypes: [
                'Consecutive integers: n, n+1',
                'Consecutive even/odd: n, n+2',
                'Two numbers with given sum and product'
            ],
            approach: [
                'Define variables for unknown numbers',
                'Set up equations based on given conditions',
                'Expand to quadratic form',
                'Solve and verify answers make sense'
            ],
            category: 'number_problems'
        };
    }

    solveBusinessRevenue(problem) {
        const { priceFunction, quantityFunction, targetRevenue } = problem.parameters;

        return {
            problemType: 'Business Revenue Optimization',
            formula: 'Revenue = (price)(quantity)',
            commonScenario: 'R(x) = (initial_price - price_decrease × x)(initial_quantity + quantity_increase × x)',
            approach: [
                'Define variable (usually number of price changes)',
                'Express price and quantity in terms of variable',
                'Set up R = price × quantity',
                'Expand to quadratic form',
                'Find maximum using vertex or solve for target revenue'
            ],
            optimization: 'Maximum revenue occurs at vertex of parabola',
            category: 'business_revenue'
        };
    }

    solveOptimization(problem) {
        const { a, b, c, optimizationType } = problem.parameters;

        const vertex = this.calculateVertex(a, b, c);
        const isMaximum = a < 0;
        const isMinimum = a > 0;

        return {
            function: `f(x) = ${a}x² + ${b}x + ${c}`,
            optimizationType: isMaximum ? 'Maximum' : 'Minimum',
            optimalPoint: vertex,
            optimalValue: vertex.y,
            occursAt: vertex.x,
            verification: isMaximum ? 
                (optimizationType === 'maximize' ? 'Correct: parabola opens downward' : 'Note: This is a maximum, not minimum') :
                (optimizationType === 'minimize' ? 'Correct: parabola opens upward' : 'Note: This is a minimum, not maximum'),
            category: 'optimization'
        };
    }

    solveRationalToQuadratic(problem) {
        return {
            problemType: 'Rational Equation Leading to Quadratic',
            method: 'Clear denominators by multiplying by LCD',
            warning: 'Must check for extraneous solutions (values that make denominator zero)',
            steps: [
                'Identify all denominators',
                'Find LCD of all denominators',
                'Multiply entire equation by LCD',
                'Simplify to quadratic form',
                'Solve quadratic equation',
                'Check solutions in original equation'
            ],
            category: 'rational_to_quadratic'
        };
    }

    solveRadicalToQuadratic(problem) {
        return {
            problemType: 'Radical Equation Leading to Quadratic',
            method: 'Isolate radical, then square both sides',
            warning: 'Squaring can introduce extraneous solutions - must verify',
            steps: [
                'Isolate the radical expression',
                'Square both sides of equation',
                'Simplify to quadratic form',
                'Solve quadratic equation',
                'Check ALL solutions in original equation'
            ],
            category: 'radical_to_quadratic'
        };
    }

    solveQuadraticForm(problem) {
        return {
            problemType: 'Equation in Quadratic Form',
            method: 'Use substitution to transform to quadratic',
            example: 'x⁴ - 5x² + 4 = 0, let u = x², then u² - 5u + 4 = 0',
            steps: [
                'Identify the substitution (u = f(x))',
                'Rewrite equation in terms of u',
                'Solve quadratic equation for u',
                'Back-substitute to find x',
                'Verify all solutions'
            ],
            category: 'quadratic_form'
        };
    }

    solveWithComplexSolutions(problem) {
        const solution = this.solveStandardQuadratic(problem);

        if (solution.complexSolutions && solution.complexSolutions.length > 0) {
            return {
                ...solution,
                complexForm: solution.complexSolutions.map(s => 
                    `${s.real} ${s.imaginary >= 0 ? '+' : ''}${s.imaginary}i`
                ),
                conjugatePairs: true,
                graphicalMeaning: 'Parabola does not intersect x-axis',
                category: 'complex_solutions'
            };
        }

        return solution;
    }

    // HELPER METHODS

    calculateVertex(a, b, c) {
        const h = -b / (2 * a);
        const k = a * h * h + b * h + c;
        return { x: h, y: k };
    }

    verifyQuadraticSolutions(solutions, a, b, c) {
        return solutions.map(x => {
            const result = a * x * x + b * x + c;
            return {
                solution: x,
                substitution: `${a}(${x})² + ${b}(${x}) + ${c}`,
                result: result,
                isValid: Math.abs(result) < 1e-10
            };
        });
    }

    findQuadraticFactors(a, b, c) {
        // Try to find integer factors for ax² + bx + c
        // This is a simplified factoring attempt
        
        if (a === 1) {
            // For x² + bx + c, find factors of c that sum to b
            for (let i = -Math.abs(c); i <= Math.abs(c); i++) {
                if (i === 0) continue;
                if (c % i === 0) {
                    const j = c / i;
                    if (i + j === b) {
                        return {
                            factor1: `x ${i >= 0 ? '+' : ''}${i}`,
                            factor2: `x ${j >= 0 ? '+' : ''}${j}`,
                            roots: [-i, -j]
                        };
                    }
                }
            }
        }

        // If can't factor easily, return null
        return null;
    }

    interpretDiscriminant(discriminant) {
        if (discriminant > 1e-10) {
            return {
                value: discriminant,
                interpretation: 'Two distinct real solutions',
                graphMeaning: 'Parabola crosses x-axis at two points',
                rootType: 'Real and unequal'
            };
        } else if (Math.abs(discriminant) <= 1e-10) {
            return {
                value: discriminant,
                interpretation: 'One repeated real solution',
                graphMeaning: 'Parabola touches x-axis at vertex',
                rootType: 'Real and equal (double root)'
            };
        } else {
            return {
                value: discriminant,
                interpretation: 'Two complex conjugate solutions',
                graphMeaning: 'Parabola does not intersect x-axis',
                rootType: 'Complex conjugates'
            };
        }
    }

    determineInequalityIntervals(roots, a, operator) {
        // Sort roots
        const sortedRoots = [...roots].sort((x, y) => x - y);
        
        // Test intervals
        const intervals = [];
        const testResults = [];

        if (sortedRoots.length === 1) {
            // One root - parabola touches x-axis
            const root = sortedRoots[0];
            
            // Test left of root
            const leftTest = this.testPoint(root - 1, a, this.currentProblem.parameters.b, this.currentProblem.parameters.c, operator);
            // Test right of root
            const rightTest = this.testPoint(root + 1, a, this.currentProblem.parameters.b, this.currentProblem.parameters.c, operator);

            if (leftTest.satisfies) {
                intervals.push(`(-∞, ${root}${operator.includes('=') ? ']' : ')'})`);
            }
            if (operator.includes('=')) {
                intervals.push(`{${root}}`);
            }
            if (rightTest.satisfies) {
                intervals.push(`(${operator.includes('=') ? '[' : '('}${root}, ∞)`);
            }

        } else if (sortedRoots.length === 2) {
            // Two roots
            const [r1, r2] = sortedRoots;

            // Test three regions
            const leftTest = this.testPoint(r1 - 1, a, this.currentProblem.parameters.b, this.currentProblem.parameters.c, operator);
            const middleTest = this.testPoint((r1 + r2) / 2, a, this.currentProblem.parameters.b, this.currentProblem.parameters.c, operator);
            const rightTest = this.testPoint(r2 + 1, a, this.currentProblem.parameters.b, this.currentProblem.parameters.c, operator);

            testResults.push(leftTest, middleTest, rightTest);

            // Build solution based on which intervals satisfy
            if (leftTest.satisfies) {
                intervals.push(`(-∞, ${r1}${operator.includes('=') ? ']' : ')'})`);
            }
            if (middleTest.satisfies) {
                const leftBracket = operator.includes('=') ? '[' : '(';
                const rightBracket = operator.includes('=') ? ']' : ')';
                intervals.push(`${leftBracket}${r1}, ${r2}${rightBracket}`);
            }
            if (rightTest.satisfies) {
                intervals.push(`(${operator.includes('=') ? '[' : '('}${r2}, ∞)`);
            }
        }

        return {
            solutionType: 'Interval solution',
            intervalNotation: intervals.join(' ∪ '),
            solutionSet: intervals.length > 0 ? intervals.join(' or ') : 'No solution',
            testResults: testResults
        };
    }

    testPoint(x, a, b, c, operator) {
        const value = a * x * x + b * x + c;
        let satisfies = false;

        switch(operator) {
            case '>': satisfies = value > 0; break;
            case '<': satisfies = value < 0; break;
            case '>=': case '≥': satisfies = value >= 0; break;
            case '<=': case '≤': satisfies = value <= 0; break;
        }

        return {
            testPoint: x,
            value: value,
            satisfies: satisfies,
            comparison: `${value} ${operator} 0`
        };
    }

    generateTestPoints(roots) {
        if (roots.length === 0) return [{ point: 0, description: 'Test at x = 0' }];
        if (roots.length === 1) {
            return [
                { point: roots[0] - 1, description: `Test left of root (${roots[0] - 1})` },
                { point: roots[0] + 1, description: `Test right of root (${roots[0] + 1})` }
            ];
        }
        
        const [r1, r2] = roots.sort((a, b) => a - b);
        return [
            { point: r1 - 1, description: `Test left of roots (${r1 - 1})` },
            { point: (r1 + r2) / 2, description: `Test between roots (${(r1 + r2) / 2})` },
            { point: r2 + 1, description: `Test right of roots (${r2 + 1})` }
        ];
    }

    describeTransformations(a, h, k) {
        const transformations = [];

        if (Math.abs(a - 1) > 1e-10) {
            if (Math.abs(a) > 1) {
                transformations.push(`Vertical stretch by factor of ${Math.abs(a)}`);
            } else if (Math.abs(a) < 1) {
                transformations.push(`Vertical compression by factor of ${Math.abs(a)}`);
            }
        }

        if (a < 0) {
            transformations.push('Reflection over x-axis');
        }

        if (Math.abs(h) > 1e-10) {
            transformations.push(`Horizontal shift ${h > 0 ? 'right' : 'left'} by ${Math.abs(h)} units`);
        }

        if (Math.abs(k) > 1e-10) {
            transformations.push(`Vertical shift ${k > 0 ? 'up' : 'down'} by ${Math.abs(k)} units`);
        }

        return transformations;
    }

    describeGraphBehavior(a, b, c, discriminant) {
        const behavior = {
            opens: a > 0 ? 'upward' : 'downward',
            vertex: this.calculateVertex(a, b, c),
            width: Math.abs(a) > 1 ? 'narrower than y = x²' : Math.abs(a) < 1 ? 'wider than y = x²' : 'same width as y = x²'
        };

        if (discriminant > 0) {
            behavior.xAxisRelation = 'Crosses x-axis at two points';
        } else if (Math.abs(discriminant) < 1e-10) {
            behavior.xAxisRelation = 'Touches x-axis at one point (vertex)';
        } else {
            behavior.xAxisRelation = 'Does not intersect x-axis';
        }

        return behavior;
    }

    // GENERATE QUADRATIC STEPS

    generateQuadraticSteps(problem, solution) {
        let baseSteps = this.generateBaseQuadraticSteps(problem, solution);

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

    generateBaseQuadraticSteps(problem, solution) {
        const { type } = problem;

        switch (type) {
            case 'standard_quadratic':
            case 'quadratic_formula':
                return this.generateQuadraticFormulaSteps(problem, solution);
            case 'factoring_quadratic':
                return this.generateFactoringSteps(problem, solution);
            case 'completing_square':
                return this.generateCompletingSquareSteps(problem, solution);
            case 'quadratic_inequality':
                return this.generateQuadraticInequalitySteps(problem, solution);
            default:
                return this.generateGenericQuadraticSteps(problem, solution);
        }
    }

    generateQuadraticFormulaSteps(problem, solution) {
        const { a, b, c } = problem.parameters;
        const steps = [];

        // Step 1: Given equation
        steps.push({
            stepNumber: 1,
            step: 'Given equation',
            description: 'Start with the quadratic equation in standard form',
            expression: `${a}x² + ${b}x + ${c} = 0`,
            beforeExpression: null,
            afterExpression: `${a}x² + ${b}x + ${c} = 0`,
            operation: null,
            reasoning: 'This is a quadratic equation where we need to find values of x that make it equal to zero',
            visualHint: 'Think of this as finding where a parabola crosses the x-axis',
            algebraicRule: 'Quadratic equation in standard form ax² + bx + c = 0',
            goalStatement: 'Our goal is to find the values of x (called roots or solutions)'
        });

        // Step 2: Identify coefficients
        steps.push({
            stepNumber: 2,
            step: 'Identify coefficients',
            description: 'Extract the coefficients a, b, and c from the equation',
            coefficients: { a, b, c },
            expression: `a = ${a}, b = ${b}, c = ${c}`,
            reasoning: 'These coefficients will be substituted into the quadratic formula',
            algebraicRule: 'In ax² + bx + c = 0, identify each coefficient',
            visualHint: 'a is the coefficient of x², b is the coefficient of x, c is the constant term'
        });

        // Step 3: Calculate discriminant
        const discriminant = solution.discriminant;
        steps.push({
            stepNumber: 3,
            step: 'Calculate discriminant',
            description: 'Calculate Δ = b² - 4ac to determine the nature of solutions',
            beforeExpression: 'Δ = b² - 4ac',
            substitution: `Δ = (${b})² - 4(${a})(${c})`,
            calculation: `Δ = ${b * b} - ${4 * a * c}`,
            afterExpression: `Δ = ${discriminant}`,
            reasoning: 'The discriminant tells us how many real solutions exist',
            discriminantMeaning: this.getDiscriminantMeaning(discriminant),
            algebraicRule: 'Discriminant Δ = b² - 4ac',
            visualHint: 'Discriminant determines if parabola crosses x-axis (Δ>0), touches it (Δ=0), or misses it (Δ<0)',
            criticalConcept: true
        });

        // Step 4: Apply quadratic formula
        if (discriminant >= 0) {
            steps.push({
                stepNumber: 4,
                step: 'Apply quadratic formula',
                description: 'Use the quadratic formula to find solutions',
                formula: 'x = (-b ± √(b² - 4ac))/(2a)',
                substitution: `x = (${-b} ± √${discriminant})/(${2 * a})`,
                reasoning: 'The quadratic formula gives the exact solutions for any quadratic equation',
                algebraicRule: 'Quadratic Formula: derived from completing the square',
                visualHint: 'The ± means we get two solutions: one with + and one with -'
            });

            // Step 5: Simplify
            const sqrtDiscriminant = Math.sqrt(discriminant);
            steps.push({
                stepNumber: 5,
                step: 'Simplify square root',
                description: `Calculate √${discriminant}`,
                beforeExpression: `x = (${-b} ± √${discriminant})/(${2 * a})`,
                calculation: `√${discriminant} = ${sqrtDiscriminant}`,
                afterExpression: `x = (${-b} ± ${sqrtDiscriminant})/(${2 * a})`,
                reasoning: 'Evaluate the square root to get numerical values'
            });

            // Step 6: Calculate both solutions
            if (discriminant > 1e-10) {
                const x1 = (-b + sqrtDiscriminant) / (2 * a);
                const x2 = (-b - sqrtDiscriminant) / (2 * a);

                steps.push({
                    stepNumber: 6,
                    step: 'Calculate solutions',
                    description: 'Find both solutions using + and - separately',
                    solution1: {
                        calculation: `x₁ = (${-b} + ${sqrtDiscriminant})/(${2 * a}) = ${(-b + sqrtDiscriminant)}/${2 * a}`,
                        result: x1
                    },
                    solution2: {
                        calculation: `x₂ = (${-b} - ${sqrtDiscriminant})/(${2 * a}) = ${(-b - sqrtDiscriminant)}/${2 * a}`,
                        result: x2
                    },
                    finalSolutions: [x1, x2],
                    reasoning: 'The ± gives us two distinct solutions',
                    finalAnswer: true
                });
            } else {
                // One solution (discriminant = 0)
                const x = -b / (2 * a);
                steps.push({
                    stepNumber: 6,
                    step: 'Calculate solution',
                    description: 'Since discriminant is zero, we have one repeated solution',
                    calculation: `x = ${-b}/${2 * a} = ${x}`,
                    finalSolution: x,
                    reasoning: 'When Δ = 0, both solutions are the same (the parabola touches the x-axis at exactly one point)',
                    finalAnswer: true
                });
            }
        } else {
            // Complex solutions
            steps.push({
                stepNumber: 4,
                step: 'Identify complex solutions',
                description: 'Since discriminant is negative, solutions are complex',
                reasoning: 'Cannot take square root of negative number in real number system',
                complexForm: `x = ${-b/(2*a)} ± ${Math.sqrt(-discriminant)/(2*a)}i`,
                realPart: -b / (2 * a),
                imaginaryPart: Math.sqrt(-discriminant) / (2 * a),
                explanation: 'Complex solutions come in conjugate pairs: a + bi and a - bi',
                finalAnswer: true
            });
        }

        return steps;
    }

    generateFactoringSteps(problem, solution) {
        const { a, b, c } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given equation',
            description: 'Start with the quadratic equation',
            expression: `${a}x² + ${b}x + ${c} = 0`,
            reasoning: 'We will try to factor this equation and use the zero product property',
            goalStatement: 'Express the quadratic as a product of two factors'
        });

        if (solution.factoredForm) {
            steps.push({
                stepNumber: 2,
                step: 'Factor the quadratic',
                description: 'Find two binomials whose product gives the original quadratic',
                beforeExpression: `${a}x² + ${b}x + ${c}`,
                afterExpression: solution.factoredForm,
                reasoning: 'We look for factors of ac that add up to b',
                algebraicRule: 'Factoring: reverse of FOIL/distribution',
                verificationHint: 'You can verify by expanding the factors'
            });

            steps.push({
                stepNumber: 3,
                step: 'Apply zero product property',
                description: 'If a product equals zero, at least one factor must be zero',
                expression: solution.factoredForm,
                cases: solution.factors.map(factor => `${factor} = 0`),
                reasoning: 'If AB = 0, then A = 0 or B = 0',
                algebraicRule: 'Zero Product Property',
                visualHint: 'Setting each factor to zero gives us the x-intercepts'
            });

            steps.push({
                stepNumber: 4,
                step: 'Solve for x',
                description: 'Solve each simple equation',
                solutions: solution.solutions,
                finalSolutions: solution.solutions,
                reasoning: 'Each factor being zero gives one solution',
                finalAnswer: true
            });
        } else {
            steps.push({
                stepNumber: 2,
                step: 'Cannot factor easily',
                description: 'This quadratic does not factor nicely with integers',
                recommendation: 'Use quadratic formula instead',
                alternativeSolution: this.solveStandardQuadratic(problem)
            });
        }

        return steps;
    }

    generateCompletingSquareSteps(problem, solution) {
        const { a, b, c } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given equation',
            description: 'Start with the quadratic equation in standard form',
            expression: `${a}x² + ${b}x + ${c} = 0`,
            reasoning: 'We will complete the square to convert this to vertex form',
            goalStatement: 'Transform into (x + p)² = q form'
        });

        // Add completing square steps from solution
        if (solution.steps) {
            solution.steps.forEach((s, index) => {
                steps.push({
                    stepNumber: index + 2,
                    step: s.description,
                    description: s.description,
                    expression: s.equation,
                    reasoning: this.getCompletingSquareReasoning(s.description),
                    algebraicRule: this.getCompletingSquareRule(s.description)
                });
            });
        }

        return steps;
    }

    generateQuadraticInequalitySteps(problem, solution) {
        const { a, b, c, operator } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given inequality',
            description: 'Start with the quadratic inequality',
            expression: `${a}x² + ${b}x + ${c} ${operator} 0`,
            reasoning: 'Unlike equations, inequalities have solution intervals, not just points',
            visualHint: 'We need to find where the parabola is above or below the x-axis',
            goalStatement: 'Find all x values that make the inequality true'
        });

        steps.push({
            stepNumber: 2,
            step: 'Solve related equation',
            description: 'First, find where the parabola crosses the x-axis',
            expression: `${a}x² + ${b}x + ${c} = 0`,
            reasoning: 'The roots are the boundary points where the parabola changes sign',
            criticalPoints: solution.criticalPoints || [],
            algebraicRule: 'Critical points divide number line into test intervals'
        });

        if (solution.criticalPoints && solution.criticalPoints.length > 0) {
            steps.push({
                stepNumber: 3,
                step: 'Identify test intervals',
                description: 'The critical points divide the number line into regions',
                intervals: this.describeTestIntervals(solution.criticalPoints),
                reasoning: 'The sign of the quadratic expression is constant within each interval',
                visualHint: 'Draw a number line with the critical points marked'
            });

            steps.push({
                stepNumber: 4,
                step: 'Test each interval',
                description: 'Pick a test point in each interval and check if it satisfies the inequality',
                testResults: solution.testResults,
                reasoning: 'If one point in an interval works, the entire interval is part of the solution',
                method: 'Substitute test points into original inequality'
            });
        }

        steps.push({
            stepNumber: 5,
            step: 'Write solution',
            description: 'Express the solution in interval notation',
            intervalNotation: solution.intervalNotation,
            solutionSet: solution.solutionSet,
            reasoning: 'Combine all intervals that satisfy the inequality',
            finalAnswer: true
        });

        return steps;
    }

    generateGenericQuadraticSteps(problem, solution) {
        return [{
            stepNumber: 1,
            step: 'Quadratic problem',
            description: 'Solve the given quadratic problem',
            expression: problem.equation || 'Problem not fully recognized',
            reasoning: 'Apply appropriate quadratic solution technique',
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

    getConceptualExplanation(step, problem) {
        const conceptualExplanations = {
            'Given equation': 'We start with a quadratic equation, which represents a parabola. Our job is to find where this parabola crosses the x-axis (the roots).',
            'Calculate discriminant': 'The discriminant tells us about the nature of solutions before we calculate them. It reveals whether the parabola crosses, touches, or misses the x-axis entirely.',
            'Apply quadratic formula': 'The quadratic formula is a universal tool that works for any quadratic equation. It directly gives us the x-intercepts of the parabola.',
            'Factor the quadratic': 'Factoring breaks the quadratic into simpler pieces. Each factor represents a linear relationship, and their product recreates the original parabola.'
        };

        return conceptualExplanations[step.step] || 'This step brings us closer to finding the solutions.';
    }

    getProceduralExplanation(step) {
        if (step.formula) {
            return `1. Write the formula: ${step.formula}
2. Substitute the known values
3. Perform arithmetic calculations
4. Simplify to get final result`;
        }
        return 'Follow the standard procedure for this type of step.';
    }

    getVisualExplanation(step, problem) {
        const visualExplanations = {
            'standard_quadratic': 'Imagine a U-shaped or inverted U-shaped curve (parabola). We are finding where this curve crosses the horizontal axis.',
            'quadratic_inequality': 'Picture shading regions on the number line where the parabola is above or below the x-axis.',
            'completing_square': 'Visualize shifting and transforming the parabola to clearly see its vertex (highest or lowest point).'
        };

        return visualExplanations[problem.type] || 'Visualize the quadratic relationship as a parabolic curve.';
    }

    getAlgebraicExplanation(step) {
        const algebraicRules = {
            'Given equation': 'Standard form of quadratic: ax² + bx + c = 0 where a ≠ 0',
            'Calculate discriminant': 'Discriminant formula: Δ = b² - 4ac',
            'Apply quadratic formula': 'Quadratic formula: x = (-b ± √(b² - 4ac))/(2a)',
            'Factor the quadratic': 'Factoring theorem: If ax² + bx + c = (px + q)(rx + s), then roots are -q/p and -s/r',
            'Apply zero product property': 'Zero Product Property: If AB = 0, then A = 0 or B = 0'
        };

        return algebraicRules[step.step] || 'Apply standard algebraic principles.';
    }

    getAdaptiveExplanation(step, explanationLevel) {
        const level = this.difficultyLevels[explanationLevel] || this.difficultyLevels.intermediate;
        
        return {
            adaptedDescription: this.adaptLanguageLevel(step.description, level),
            adaptedReasoning: this.adaptLanguageLevel(step.reasoning, level),
            complexityLevel: explanationLevel
        };
    }

    adaptLanguageLevel(text, level) {
        if (!text) return '';

        const adaptations = {
            basic: {
                'discriminant': 'number that tells us about solutions',
                'coefficient': 'number in front of variable',
                'parabola': 'U-shaped curve',
                'conjugate': 'matching pair',
                'vertex': 'highest or lowest point'
            },
            intermediate: {
                'discriminant': 'discriminant',
                'coefficient': 'coefficient',
                'parabola': 'parabola',
                'conjugate': 'conjugate',
                'vertex': 'vertex'
            },
            detailed: {
                'discriminant': 'discriminant (Δ = b² - 4ac)',
                'coefficient': 'coefficient (numerical multiplier)',
                'parabola': 'parabola (graph of quadratic function)',
                'conjugate': 'conjugate (a + bi and a - bi)',
                'vertex': 'vertex (optimal point of parabola)'
            }
        };

        const levelAdaptation = adaptations[level.vocabulary] || adaptations.intermediate;
        let adaptedText = text;

        for (const [term, replacement] of Object.entries(levelAdaptation)) {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            adaptedText = adaptedText.replace(regex, replacement);
        }

        return adaptedText;
    }

    // HELPER METHODS FOR STEPS

    getDiscriminantMeaning(discriminant) {
        if (discriminant > 1e-10) {
            return 'Positive discriminant → Two distinct real solutions → Parabola crosses x-axis twice';
        } else if (Math.abs(discriminant) <= 1e-10) {
            return 'Zero discriminant → One repeated real solution → Parabola touches x-axis at vertex';
        } else {
            return 'Negative discriminant → Two complex solutions → Parabola does not intersect x-axis';
        }
    }

    getCompletingSquareReasoning(description) {
        const reasoningMap = {
            'Divide all terms': 'Makes the leading coefficient 1, simplifying the completion process',
            'Move constant term': 'Isolates the variable terms on one side',
            'Add (b/2a)²': 'Creates a perfect square trinomial on the left side',
            'Factor perfect square': 'Expresses left side as (x + p)²',
            'Take square root': 'Eliminates the square, leaving a linear equation'
        };

        for (const [key, value] of Object.entries(reasoningMap)) {
            if (description.includes(key)) return value;
        }

        return 'Progresses toward isolating x';
    }

    getCompletingSquareRule(description) {
        if (description.includes('Divide')) return 'Division Property of Equality';
        if (description.includes('Move')) return 'Addition/Subtraction Property of Equality';
        if (description.includes('Add')) return 'Completing the square: add (b/2)² to create perfect square';
        if (description.includes('Factor')) return 'Perfect Square Trinomial: x² + 2px + p² = (x + p)²';
        return 'Standard algebraic manipulation';
    }

    describeTestIntervals(criticalPoints) {
        if (criticalPoints.length === 0) return ['All real numbers'];
        if (criticalPoints.length === 1) {
            return [
                `(-∞, ${criticalPoints[0]})`,
                `(${criticalPoints[0]}, ∞)`
            ];
        }

        const sorted = [...criticalPoints].sort((a, b) => a - b);
        return [
            `(-∞, ${sorted[0]})`,
            `(${sorted[0]}, ${sorted[1]})`,
            `(${sorted[1]}, ∞)`
        ];
    }

    generateStepBridge(currentStep, nextStep) {
        return {
            currentState: `We now have: ${currentStep.afterExpression || currentStep.expression}`,
            nextGoal: `Next, we need to: ${nextStep.description}`,
            why: `This is necessary to: ${this.explainStepNecessity(currentStep, nextStep)}`,
            howItHelps: `This will help by: ${this.explainStepBenefit(nextStep)}`
        };
    }

    explainStepProgression(currentStep, nextStep) {
        return `After ${currentStep.step}, we proceed to ${nextStep.step} to continue solving`;
    }

    explainStepStrategy(nextStep) {
        return `The strategy for "${nextStep.step}" is to ${nextStep.description?.toLowerCase()}`;
    }

    explainStepNecessity(currentStep, nextStep) {
        return `completing ${currentStep.step} and moving toward the final solution`;
    }

    explainStepBenefit(nextStep) {
        return `advancing us closer to finding the solutions`;
    }

    generatePreventionTips(step, problemType) {
        const tips = {
            'Apply quadratic formula': [
                'Write out the formula before substituting',
                'Be careful with negative signs, especially -b',
                'Remember the ± means two separate calculations',
                'Simplify under the square root first'
            ],
            'Calculate discriminant': [
                'Use parentheses: (b)² - 4(a)(c)',
                'Calculate b² completely before subtracting 4ac',
                'Watch for sign errors with negative coefficients'
            ]
        };

        return tips[step.step] || ['Check your arithmetic', 'Verify each calculation'];
    }

    generateCheckPoints(step) {
        return [
            'Verify arithmetic is correct',
            'Check that signs are handled properly',
            'Ensure formula is applied correctly',
            'Confirm step moves toward solution'
        ];
    }

    identifyWarningFlags(step, problemType) {
        const warnings = {
            standard_quadratic: step.step === 'Apply quadratic formula' ?
                ['Watch for sign error with -b', 'Don\'t forget ± symbol'] : [],
            completing_square: step.step?.includes('square') ?
                ['Must add (b/2)² to BOTH sides'] : [],
            quadratic_inequality: step.step === 'Test each interval' ?
                ['Choose simple test points', 'Verify arithmetic at each test point'] : []
        };

        return warnings[problemType] || [];
    }

    generateSelfCheckQuestion(step) {
        const questions = {
            'Calculate discriminant': 'Did I calculate b² - 4ac correctly with proper signs?',
            'Apply quadratic formula': 'Did I include both the + and - solutions?',
            'Factor the quadratic': 'Do my factors multiply back to the original expression?',
            'Test each interval': 'Did I test at least one point in each interval?'
        };

        return questions[step.step] || 'Does this step make sense and move me toward the solution?';
    }

    describeExpectedResult(step) {
        const expectations = {
            'Calculate discriminant': 'A single number that may be positive, zero, or negative',
            'Apply quadratic formula': 'One or two numerical solutions (or complex solutions)',
            'Factor the quadratic': 'Two binomial factors whose product equals the original',
            'Test each interval': 'Determination of which intervals satisfy the inequality'
        };

        return expectations[step.step] || 'Progress toward the final solution';
    }

    generateTroubleshootingTips(step) {
        return [
            'Review the previous step if confused',
            'Check all arithmetic carefully',
            'Verify you applied formulas correctly',
            'Consider trying an alternative method'
        ];
    }

    breakIntoSubSteps(step) {
        if (step.formula) {
            return [
                `Write the formula: ${step.formula}`,
                'Identify the values to substitute',
                'Substitute values carefully',
                'Perform calculations step by step',
                'Simplify to final form'
            ];
        }

        return ['Understand what is required', 'Apply the appropriate technique', 'Verify the result'];
    }

    generatePracticeVariation(step, problem) {
        return {
            similarProblem: 'Try a similar problem with different coefficients',
            practiceHint: 'Practice the same technique with simpler numbers first',
            extension: 'Once comfortable, try more complex variations'
        };
    }

    explainThinkingProcess(step) {
        return {
            observe: 'What information do I have?',
            goal: 'What am I trying to find?',
            strategy: 'Which method or formula should I use?',
            execute: 'How do I apply this method correctly?',
            verify: 'Does my answer make sense?'
        };
    }

    identifyDecisionPoints(step) {
        return [
            'Choosing which solving method to use',
            'Deciding how to simplify expressions',
            'Determining which formula applies'
        ];
    }

    suggestAlternativeMethods(step, problem) {
        const alternatives = {
            'Apply quadratic formula': [
                'Could try factoring if coefficients are simple',
                'Could complete the square for practice',
                'Could use graphing for approximation'
            ],
            'Factor the quadratic': [
                'Could use quadratic formula for exact solutions',
                'Could complete the square to see vertex form'
            ]
        };

        return alternatives[step.step] || ['The chosen method is appropriate for this problem'];
    }

    connectToPreviousStep(step, stepIndex) {
        return {
            connection: `This step builds on step ${stepIndex} by continuing the solution process`,
            progression: 'We are making progress toward finding the roots',
            relationship: 'Each step brings us closer to the final answer'
        };
    }

    identifyPrerequisites(step, problemType) {
        const prerequisites = {
            'Calculate discriminant': ['Exponents', 'Order of operations', 'Multiplication with negatives'],
            'Apply quadratic formula': ['Square roots', 'Fraction operations', 'Sign rules'],
            'Factor the quadratic': ['FOIL method', 'Finding factor pairs', 'Zero product property'],
            'Complete the square': ['Perfect square trinomials', 'Square root property']
        };

        return prerequisites[step.step] || ['Basic algebraic operations'];
    }

    identifyKeyVocabulary(step) {
        const vocabulary = {
            'Given equation': ['quadratic', 'equation', 'standard form', 'coefficient'],
            'Calculate discriminant': ['discriminant', 'radicand', 'nature of roots'],
            'Apply quadratic formula': ['formula', 'roots', 'solutions', 'plus-minus'],
            'Factor the quadratic': ['factor', 'binomial', 'zero product property']
        };

        return vocabulary[step.step] || [];
    }

    generateGuidingQuestions(step, problem) {
        const questions = {
            'Given equation': [
                'Is this equation in standard form ax² + bx + c = 0?',
                'What are the coefficients a, b, and c?',
                'What method should I use to solve this?'
            ],
            'Calculate discriminant': [
                'What is the formula for the discriminant?',
                'What does the discriminant tell us?',
                'Is my discriminant positive, zero, or negative?'
            ],
            'Apply quadratic formula': [
                'Have I written the formula correctly?',
                'Did I substitute the right values?',
                'Am I calculating both + and - solutions?'
            ],
            'Factor the quadratic': [
                'What two numbers multiply to give ac and add to give b?',
                'Can I verify my factors by expanding?',
                'What does each factor equal when set to zero?'
            ]
        };

        return questions[step.step] || ['What is the goal of this step?', 'How does this help solve the problem?'];
    }

    generateProgressiveHints(step) {
        return {
            level1: 'Think about what mathematical tool or formula applies here.',
            level2: 'Remember to follow the standard procedure for this type of problem.',
            level3: 'Consider the specific formula or property that relates to this step.',
            level4: step.formula ? `Use the formula: ${step.formula}` : 'Apply the appropriate technique carefully.'
        };
    }

    // GRAPH DATA GENERATION

    generateQuadraticGraphData() {
        if (!this.currentSolution) return;

        const { type } = this.currentProblem;
        const solution = this.currentSolution;

        switch(type) {
            case 'standard_quadratic':
            case 'quadratic_formula':
            case 'factoring_quadratic':
            case 'completing_square':
                if (solution.coefficients) {
                    this.graphData = this.generateParabolaGraph(solution.coefficients.a, solution.coefficients.b, solution.coefficients.c);
                }
                break;

            case 'quadratic_inequality':
                if (solution.criticalPoints) {
                    this.graphData = this.generateInequalityParabolaGraph(solution);
                }
                break;
        }
    }

    generateParabolaGraph(a, b, c) {
        const vertex = this.calculateVertex(a, b, c);
        const points = [];

        // Generate points for the parabola
        const xMin = vertex.x - 10;
        const xMax = vertex.x + 10;

        for (let x = xMin; x <= xMax; x += 0.5) {
            const y = a * x * x + b * x + c;
            points.push({ x: x, y: y });
        }

        // Find x-intercepts if they exist
        const standardSolution = this.solveStandardQuadratic({ parameters: { a, b, c } });

        return {
            type: 'parabola',
            function: `f(x) = ${a}x² + ${b}x + ${c}`,
            points: points,
            vertex: vertex,
            xIntercepts: standardSolution.solutions,
            yIntercept: c,
            axisOfSymmetry: vertex.x,
            direction: a > 0 ? 'upward' : 'downward'
        };
    }

    generateInequalityParabolaGraph(solution) {
        const { a, b, c } = this.currentProblem.parameters;
        const parabolaData = this.generateParabolaGraph(a, b, c);

        return {
            ...parabolaData,
            type: 'quadratic_inequality',
            criticalPoints: solution.criticalPoints,
            solutionIntervals: solution.intervalNotation,
            shadedRegions: this.determineShadedRegions(solution)
        };
    }

    determineShadedRegions(solution) {
        // Determine which regions to shade based on solution
        return {
            intervalNotation: solution.intervalNotation,
            description: solution.solutionSet
        };
    }

    // VERIFICATION METHODS

    verifyStandardQuadratic() {
        const { a, b, c } = this.currentProblem.parameters;
        const solutions = this.currentSolution.solutions;

        if (!solutions || solutions.length === 0) {
            return { type: 'no_real_solutions', message: 'No real solutions to verify' };
        }

        const verifications = solutions.map(x => {
            const result = a * x * x + b * x + c;
            const isValid = Math.abs(result) < 1e-9;

            return {
                solution: x,
                substitution: `${a}(${x})² + ${b}(${x}) + ${c}`,
                leftSide: a * x * x + b * x + c,
                rightSide: 0,
                difference: Math.abs(result),
                isValid: isValid
            };
        });

        return {
            equation: `${a}x² + ${b}x + ${c} = 0`,
            solutions: solutions,
            verifications: verifications,
            allValid: verifications.every(v => v.isValid)
        };
    }

    verifyQuadraticInequality() {
        const { a, b, c, operator } = this.currentProblem.parameters;
        const { criticalPoints, intervalNotation } = this.currentSolution;

        const testPoints = this.generateTestPoints(criticalPoints || []);
        
        const testResults = testPoints.map(tp => {
            const x = tp.point;
            const value = a * x * x + b * x + c;
            let satisfies = false;

            switch(operator) {
                case '>': satisfies = value > 0; break;
                case '<': satisfies = value < 0; break;
                case '>=': case '≥': satisfies = value >= 0; break;
                case '<=': case '≤': satisfies = value <= 0; break;
            }

            return {
                testPoint: x,
                value: value,
                satisfies: satisfies,
                comparison: `${value} ${operator} 0`
            };
        });

        return {
            inequality: `${a}x² + ${b}x + ${c} ${operator} 0`,
            criticalPoints: criticalPoints,
            testResults: testResults,
            intervalNotation: intervalNotation
        };
    }

    calculateVerificationConfidence() {
        if (!this.currentSolution || !this.currentProblem) return 'Unknown';

        const { type } = this.currentProblem;

        switch (type) {
            case 'standard_quadratic':
            case 'quadratic_formula':
            case 'factoring_quadratic':
            case 'completing_square':
                const verification = this.verifyStandardQuadratic();
                if (verification.type === 'no_real_solutions') return 'Confirmed (Complex Solutions)';
                return verification.allValid ? 'High' : 'Low';

            case 'quadratic_inequality':
                return 'High';

            default:
                return 'Medium';
        }
    }

    getVerificationNotes() {
        const { type } = this.currentProblem;
        const notes = [];

        switch (type) {
            case 'standard_quadratic':
            case 'quadratic_formula':
                notes.push('Direct substitution method used');
                notes.push('Numerical tolerance: 1e-9');
                notes.push('Both solutions verified independently');
                break;

            case 'factoring_quadratic':
                notes.push('Solutions verified by substitution');
                notes.push('Factored form verified by expansion');
                break;

            case 'completing_square':
                notes.push('Vertex form and standard form solutions match');
                notes.push('Solutions verified by substitution');
                break;

            case 'quadratic_inequality':
                notes.push('Test points used to verify solution regions');
                notes.push('Critical points and boundary behavior checked');
                break;

            default:
                notes.push('Standard verification methods applied');
        }

        return notes.join('; ');
    }

    // WORKBOOK GENERATION

    generateQuadraticWorkbook() {
        if (!this.currentSolution || !this.currentProblem) return;

        const workbook = this.createWorkbookStructure();

        workbook.sections = [
            this.createProblemSection(),
            this.createEnhancedStepsSection(),
            this.createQuadraticLessonSection(),
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
            title: 'Quadratic Mathematical Workbook',
            timestamp: new Date().toISOString(),
            theme: this.theme,
            dimensions: { width: this.width, height: this.height },
            sections: []
        };
    }

    createProblemSection() {
        if (!this.currentProblem) return null;

        const { a, b, c } = this.currentProblem.parameters;

        return {
            title: 'Problem Statement',
            type: 'problem',
            data: [
                ['Problem Type', this.quadraticTypes[this.currentProblem.type]?.name || this.currentProblem.type],
                ['Equation', `${a}x² + ${b}x + ${c} = 0`],
                ['Coefficients', `a = ${a}, b = ${b}, c = ${c}`],
                ['Description', this.currentProblem.scenario || 'Standard quadratic equation']
            ]
        };
    }

    createEnhancedStepsSection() {
        if (!this.solutionSteps || this.solutionSteps.length === 0) return null;

        const stepsData = [];

        this.solutionSteps.forEach((step, index) => {
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

            if (step.visualHint && this.explanationLevel !== 'basic') {
                stepsData.push(['Visual Hint', step.visualHint]);
            }

            // Enhanced explanations
            if (step.explanations && this.explanationLevel === 'detailed') {
                stepsData.push(['Conceptual', step.explanations.conceptual]);
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

            stepsData.push(['', '']); // Spacing
        });

        return {
            title: 'Enhanced Step-by-Step Solution',
            type: 'steps',
            data: stepsData
        };
    }

    createQuadraticLessonSection() {
        const { type } = this.currentProblem;
        const categoryMap = {
            'standard_quadratic': 'standard_quadratic',
            'quadratic_formula': 'quadratic_formula',
            'factoring_quadratic': 'factoring_quadratic',
            'completing_square': 'completing_square',
            'quadratic_inequality': 'quadratic_inequality'
        };

        const lessonKey = categoryMap[type] || 'standard_quadratic';

        return {
            title: 'Key Concepts',
            type: 'lesson',
            data: [
                ['Concept', 'Quadratic equations represent parabolic relationships'],
                ['Standard Form', 'ax² + bx + c = 0 where a ≠ 0'],
                ['Goal', 'Find values of x that make the equation equal to zero'],
                ['Solutions', 'Called roots, zeros, or x-intercepts']
            ]
        };
    }

    createSolutionSection() {
        if (!this.currentSolution) return null;

        const solutionData = [];

        if (this.currentSolution.solutions && this.currentSolution.solutions.length > 0) {
            this.currentSolution.solutions.forEach((sol, index) => {
                solutionData.push([`Solution ${index + 1}`, sol]);
            });
        } else if (this.currentSolution.complexSolutions && this.currentSolution.complexSolutions.length > 0) {
            this.currentSolution.complexSolutions.forEach((sol, index) => {
                solutionData.push([`Solution ${index + 1}`, `${sol.real} ${sol.imaginary >= 0 ? '+' : ''}${sol.imaginary}i`]);
            });
        }

        if (this.currentSolution.solutionType) {
            solutionData.push(['Solution Type', this.currentSolution.solutionType]);
        }

        if (this.currentSolution.discriminant !== undefined) {
            solutionData.push(['Discriminant', this.currentSolution.discriminant]);
        }

        return {
            title: 'Final Solution',
            type: 'solution',
            data: solutionData
        };
    }

    createAnalysisSection() {
        if (!this.currentSolution) return null;

        const analysisData = [
            ['Steps Used', this.solutionSteps?.length || 0],
            ['Difficulty Level', this.explanationLevel],
            ['Method', this.quadraticTypes[this.currentProblem.type]?.name || 'Standard method']
        ];

        if (this.currentSolution.vertex) {
            analysisData.push(['Vertex', `(${this.currentSolution.vertex.x}, ${this.currentSolution.vertex.y})`]);
        }

        if (this.currentSolution.axisOfSymmetry !== undefined) {
            analysisData.push(['Axis of Symmetry', `x = ${this.currentSolution.axisOfSymmetry}`]);
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
        verificationData.push(['', '']);

        switch (type) {
            case 'standard_quadratic':
            case 'quadratic_formula':
            case 'factoring_quadratic':
            case 'completing_square':
                const verification = this.verifyStandardQuadratic();
                if (verification.type === 'no_real_solutions') {
                    verificationData.push(['Result', 'Complex solutions - no real verification possible']);
                } else {
                    verificationData.push(['Equation', verification.equation]);
                    verificationData.push(['', '']);
                    
                    verification.verifications.forEach((v, index) => {
                        verificationData.push([`Solution ${index + 1}`, v.solution]);
                        verificationData.push(['Substitution', v.substitution]);
                        verificationData.push(['Result', v.leftSide]);
                        verificationData.push(['Valid', v.isValid ? 'Yes' : 'No']);
                        verificationData.push(['', '']);
                    });

                    verificationData.push(['All Solutions Valid', verification.allValid ? 'Yes' : 'No']);
                }
                break;

            case 'quadratic_inequality':
                const inequalityVerification = this.verifyQuadraticInequality();
                verificationData.push(['Inequality', inequalityVerification.inequality]);
                verificationData.push(['Solution Set', inequalityVerification.intervalNotation]);
                verificationData.push(['', '']);
                verificationData.push(['Test Point', 'Value', 'Satisfies']);
                
                inequalityVerification.testResults.forEach(test => {
                    verificationData.push([
                        test.testPoint,
                        test.value.toFixed(4),
                        test.satisfies ? 'Yes' : 'No'
                    ]);
                });
                break;

            default:
                verificationData.push(['General Check', 'Solution verified using substitution method']);
        }

        if (this.verificationDetail === 'detailed') {
            verificationData.push(['', '']);
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

    createPedagogicalNotesSection() {
        if (!this.includePedagogicalNotes) return null;

        const notes = this.generateQuadraticPedagogicalNotes(this.currentProblem.type);

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

    createAlternativeMethodsSection() {
        if (!this.includeAlternativeMethods) return null;

        const alternatives = this.generateQuadraticAlternativeMethods(this.currentProblem.type);

        return {
            title: 'Alternative Solution Methods',
            type: 'alternatives',
            data: [
                ['Primary Method Used', alternatives.primaryMethod],
                ['', ''],
                ['Alternative Methods', ''],
                ...alternatives.methods.map((method, index) => [
                    `Method ${index + 1}`, `${method.name}: ${method.description}`
                ]),
                ['', ''],
                ['Method Comparison', alternatives.comparison]
            ]
        };
    }

    generateQuadraticPedagogicalNotes(problemType) {
        const pedagogicalDatabase = {
            standard_quadratic: {
                objectives: [
                    'Solve quadratic equations using quadratic formula',
                    'Calculate and interpret the discriminant',
                    'Verify solutions through substitution'
                ],
                keyConcepts: [
                    'Discriminant determines nature of solutions',
                    'Parabolic graphs and x-intercepts',
                    'Relationship between algebraic and graphical solutions'
                ],
                prerequisites: [
                    'Simplifying square roots',
                    'Order of operations',
                    'Working with negative numbers and fractions'
                ],
                commonDifficulties: [
                    'Sign errors with -b in formula',
                    'Forgetting ± symbol (missing second solution)',
                    'Arithmetic errors under square root',
                    'Division errors with 2a denominator'
                ],
                extensions: [
                    'Complex solutions when discriminant is negative',
                    'Deriving quadratic formula by completing square',
                    'Applications in projectile motion'
                ],
                assessment: [
                    'Check discriminant calculation separately',
                    'Verify both solutions are found',
                    'Test understanding with various coefficient signs'
                ]
            },
            factoring_quadratic: {
                objectives: [
                    'Factor quadratic expressions',
                    'Apply zero product property',
                    'Verify factorization by expansion'
                ],
                keyConcepts: [
                    'Zero product property',
                    'Relationship between factors and roots',
                    'FOIL method in reverse'
                ],
                prerequisites: [
                    'Finding factor pairs',
                    'FOIL method for multiplication',
                    'Zero product property'
                ],
                commonDifficulties: [
                    'Finding correct factor pairs',
                    'Sign errors in factors',
                    'Not factoring out GCF first',
                    'Attempting to factor when not factorable'
                ],
                extensions: [
                    'Factoring with leading coefficient ≠ 1',
                    'Recognizing non-factorable quadratics',
                    'Connection to graphing'
                ],
                assessment: [
                    'Verify factors multiply correctly',
                    'Check solutions in original equation',
                    'Test with various factoring patterns'
                ]
            }
        };

        return pedagogicalDatabase[problemType] || {
            objectives: ['Solve quadratic problems'],
            keyConcepts: ['Quadratic relationships'],
            prerequisites: ['Basic algebra'],
            commonDifficulties: ['Various computational challenges'],
            extensions: ['More complex applications'],
            assessment: ['Verify understanding of process']
        };
    }

    generateQuadraticAlternativeMethods(problemType) {
        const alternativeDatabase = {
            standard_quadratic: {
                primaryMethod: 'Quadratic Formula',
                methods: [
                    {
                        name: 'Factoring',
                        description: 'Express as product of binomials and use zero product property (only works when factors are rational)'
                    },
                    {
                        name: 'Completing the Square',
                        description: 'Transform to vertex form and solve (shows relationship to vertex)'
                    },
                    {
                        name: 'Graphical Method',
                        description: 'Graph the parabola and identify x-intercepts (provides visual understanding)'
                    }
                ],
                comparison: 'Quadratic formula is universal; factoring is fastest when possible; completing square reveals vertex; graphing shows full behavior'
            },
            factoring_quadratic: {
                primaryMethod: 'Factoring with Zero Product Property',
                methods: [
                    {
                        name: 'Quadratic Formula',
                        description: 'Apply formula for exact solutions (works for all quadratics)'
                    },
                    {
                        name: 'AC Method',
                        description: 'Factor by grouping when leading coefficient ≠ 1'
                    },
                    {
                        name: 'Guess and Check',
                        description: 'Trial and error with factor pairs (good for simple cases)'
                    }
                ],
                comparison: 'Factoring is elegant when it works; quadratic formula is more reliable; AC method handles complex cases'
            }
        };

        return alternativeDatabase[problemType] || {
            primaryMethod: 'Standard algebraic approach',
            methods: [{
                name: 'Alternative approach',
                description: 'Other methods may be applicable depending on problem structure'
            }],
            comparison: 'Choose method based on problem characteristics and personal preference'
        };
    }
}

// Export the class
export default EnhancedQuadraticMathematicalWorkbook;
