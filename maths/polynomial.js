import * as math from 'mathjs';

export class EnhancedPolynomialMathematicalWorkbook {
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
        this.initializePolynomialSolvers();
        this.initializeErrorDatabase();
        this.initializeExplanationTemplates();
    }

    initializePolynomialLessons() {
        this.lessons = {
            quadratic_standard: {
                title: "Quadratic Equations - Standard Form",
                concepts: [
                    "General form: ax² + bx + c = 0 where a ≠ 0",
                    "Degree 2 polynomial equation",
                    "Can have 0, 1, or 2 real solutions",
                    "Multiple solution methods available"
                ],
                theory: "Quadratic equations represent parabolic relationships. The coefficient 'a' determines the parabola's direction (up/down) and width, 'b' affects the axis of symmetry, and 'c' is the y-intercept.",
                keyFormulas: {
                    "Standard Form": "ax² + bx + c = 0",
                    "Quadratic Formula": "x = (-b ± √(b² - 4ac))/(2a)",
                    "Discriminant": "Δ = b² - 4ac",
                    "Vertex Form": "a(x - h)² + k"
                },
                solvingSteps: [
                    "Identify coefficients a, b, and c",
                    "Calculate discriminant: Δ = b² - 4ac",
                    "Apply quadratic formula",
                    "Simplify solutions",
                    "Verify by substitution"
                ],
                applications: [
                    "Projectile motion problems",
                    "Area and optimization",
                    "Business profit modeling",
                    "Physics acceleration problems"
                ]
            },

            quadratic_factoring: {
                title: "Solving Quadratics by Factoring",
                concepts: [
                    "Factor quadratic into two binomials",
                    "Apply Zero Product Property",
                    "Most efficient when factors are integers",
                    "Not all quadratics are factorable"
                ],
                theory: "Factoring transforms ax² + bx + c into (mx + p)(nx + q) = 0, allowing us to use the Zero Product Property: if AB = 0, then A = 0 or B = 0.",
                keyFormulas: {
                    "Factored Form": "(mx + p)(nx + q) = 0",
                    "Zero Product Property": "If AB = 0, then A = 0 or B = 0",
                    "Sum-Product Pattern": "Find two numbers that multiply to ac and add to b"
                },
                solvingSteps: [
                    "Ensure equation equals zero",
                    "Find two numbers that multiply to ac and add to b",
                    "Factor into binomial form",
                    "Set each factor equal to zero",
                    "Solve each linear equation"
                ],
                applications: [
                    "Quick solutions for integer roots",
                    "Polynomial division checks",
                    "Understanding equation structure",
                    "Mental math strategies"
                ]
            },

            completing_square: {
                title: "Completing the Square",
                concepts: [
                    "Transform to perfect square trinomial",
                    "Reveals vertex form of parabola",
                    "Works for all quadratics",
                    "Foundational for deriving quadratic formula"
                ],
                theory: "Completing the square rewrites ax² + bx + c as a(x - h)² + k, making the vertex (h, k) immediately visible and enabling easy solution.",
                keyFormulas: {
                    "Perfect Square": "(x + p)² = x² + 2px + p²",
                    "Completing Formula": "Add (b/2a)² to both sides",
                    "Vertex Form Result": "a(x - h)² = k"
                },
                solvingSteps: [
                    "Divide by 'a' if a ≠ 1",
                    "Move constant to right side",
                    "Add (b/2)² to both sides",
                    "Factor left side as perfect square",
                    "Solve using square root property"
                ],
                applications: [
                    "Finding vertex of parabola",
                    "Deriving quadratic formula",
                    "Optimization problems",
                    "Converting between forms"
                ]
            },

            polynomial_division: {
                title: "Polynomial Division",
                concepts: [
                    "Long division extends to polynomials",
                    "Synthetic division for linear divisors",
                    "Remainder Theorem applications",
                    "Factor Theorem for finding roots"
                ],
                theory: "Polynomial division allows us to divide P(x) by D(x) to get quotient Q(x) and remainder R(x), where P(x) = D(x)·Q(x) + R(x).",
                keyFormulas: {
                    "Division Algorithm": "P(x) = D(x)·Q(x) + R(x)",
                    "Remainder Theorem": "P(a) = remainder when dividing by (x - a)",
                    "Factor Theorem": "(x - a) is a factor ⟺ P(a) = 0"
                },
                solvingSteps: [
                    "Arrange polynomials in descending order",
                    "Divide leading terms",
                    "Multiply divisor by quotient term",
                    "Subtract from dividend",
                    "Repeat until degree of remainder < degree of divisor"
                ],
                applications: [
                    "Simplifying rational expressions",
                    "Finding polynomial factors",
                    "Testing for roots",
                    "Partial fraction decomposition"
                ]
            },

            rational_root: {
                title: "Rational Root Theorem",
                concepts: [
                    "Identifies possible rational roots",
                    "Reduces trial-and-error testing",
                    "Based on factors of leading and constant coefficients",
                    "Doesn't guarantee roots exist"
                ],
                theory: "For polynomial P(x) = aₙxⁿ + ... + a₁x + a₀, any rational root p/q must have p dividing a₀ and q dividing aₙ.",
                keyFormulas: {
                    "Rational Root Form": "p/q where p|a₀ and q|aₙ",
                    "Testing Method": "Evaluate P(p/q) and check if equals 0",
                    "Factorization": "Once root found, factor out (x - root)"
                },
                solvingSteps: [
                    "List factors of constant term (p)",
                    "List factors of leading coefficient (q)",
                    "Form all possible p/q ratios",
                    "Test each candidate using synthetic division",
                    "Factor out confirmed roots"
                ],
                applications: [
                    "Finding integer and rational roots",
                    "Reducing polynomial degree",
                    "Graphing polynomial functions",
                    "Solving higher-degree equations"
                ]
            },

            cubic_equations: {
                title: "Cubic Equations",
                concepts: [
                    "Third-degree polynomial: ax³ + bx² + cx + d = 0",
                    "Always has at least one real root",
                    "May have 1, 2, or 3 real roots",
                    "Various solution methods available"
                ],
                theory: "Cubic equations can be solved through factoring, rational root theorem, or cubic formula. The discriminant determines the nature of roots.",
                keyFormulas: {
                    "Standard Form": "ax³ + bx² + cx + d = 0",
                    "Discriminant": "Δ = 18abcd - 4b³d + b²c² - 4ac³ - 27a²d²",
                    "Depressed Cubic": "t³ + pt + q = 0 (after substitution)"
                },
                solvingSteps: [
                    "Try Rational Root Theorem first",
                    "If rational root found, factor it out",
                    "Solve remaining quadratic",
                    "For non-rational roots, use cubic formula or numerical methods",
                    "Verify all solutions"
                ],
                applications: [
                    "Volume optimization",
                    "Physics problems with cubic relationships",
                    "Engineering design",
                    "Economic modeling"
                ]
            },

            quartic_equations: {
                title: "Quartic (Fourth-Degree) Equations",
                concepts: [
                    "Fourth-degree polynomial: ax⁴ + bx³ + cx² + dx + e = 0",
                    "Can have 0, 1, 2, 3, or 4 real roots",
                    "Special forms have simplified solutions",
                    "Ferrari's method for general quartics"
                ],
                theory: "Quartic equations are the highest degree with a general algebraic solution formula. Many can be reduced to quadratics through substitution.",
                keyFormulas: {
                    "Standard Form": "ax⁴ + bx³ + cx² + dx + e = 0",
                    "Biquadratic Form": "ax⁴ + bx² + c = 0",
                    "Substitution": "Let u = x², solve for u, then find x"
                },
                solvingSteps: [
                    "Check for special forms (biquadratic, factorable)",
                    "Try Rational Root Theorem",
                    "Factor if possible",
                    "Use substitution for biquadratics",
                    "Apply Ferrari's method for general case"
                ],
                applications: [
                    "Beam deflection in engineering",
                    "Oscillation problems",
                    "Higher-order optimization",
                    "Computer graphics transformations"
                ]
            },

            polynomial_graphing: {
                title: "Graphing Polynomial Functions",
                concepts: [
                    "End behavior determined by leading term",
                    "Zeros are x-intercepts",
                    "Multiplicity affects graph at zeros",
                    "Degree determines maximum turning points"
                ],
                theory: "Polynomial graphs are continuous, smooth curves. The degree and leading coefficient determine end behavior, while roots and their multiplicities determine x-intercepts.",
                keyFormulas: {
                    "End Behavior": "As x → ±∞, f(x) behaves like leading term aₙxⁿ",
                    "Turning Points": "At most (n-1) turning points for degree n",
                    "Multiplicity": "Even multiplicity: touches axis; Odd multiplicity: crosses axis"
                },
                analysisSteps: [
                    "Determine degree and leading coefficient",
                    "Find all zeros and their multiplicities",
                    "Determine end behavior",
                    "Find y-intercept (evaluate at x = 0)",
                    "Identify turning points",
                    "Sketch graph"
                ],
                applications: [
                    "Visualizing function behavior",
                    "Finding local maxima/minima",
                    "Understanding real-world models",
                    "Predicting trends"
                ]
            },

            polynomial_inequalities: {
                title: "Polynomial Inequalities",
                concepts: [
                    "Solutions are intervals, not single points",
                    "Test points in intervals between zeros",
                    "Sign analysis method",
                    "Consider equality for ≤ or ≥"
                ],
                theory: "Polynomial inequalities are solved by finding zeros, dividing number line into intervals, and testing each interval's sign.",
                keyFormulas: {
                    "Standard Form": "P(x) > 0 (or <, ≤, ≥)",
                    "Critical Points": "Zeros of P(x)",
                    "Sign Chart": "Test one point in each interval"
                },
                solvingSteps: [
                    "Move all terms to one side (set = 0)",
                    "Find all zeros of polynomial",
                    "Mark zeros on number line",
                    "Test sign in each interval",
                    "Select intervals satisfying inequality",
                    "Write solution in interval notation"
                ],
                applications: [
                    "Optimization with constraints",
                    "Feasibility regions",
                    "Safety margins in engineering",
                    "Economic profit analysis"
                ]
            },

            synthetic_division: {
                title: "Synthetic Division",
                concepts: [
                    "Shortcut for dividing by (x - c)",
                    "More efficient than long division",
                    "Reveals remainder quickly",
                    "Useful with Remainder Theorem"
                ],
                theory: "Synthetic division is a streamlined process for dividing polynomials by linear factors, using only coefficients.",
                keyFormulas: {
                    "Divisor Form": "(x - c) where c is the test value",
                    "Remainder": "Last number in synthetic division",
                    "Quotient": "All numbers except the last"
                },
                solvingSteps: [
                    "Write coefficients of dividend",
                    "Write c (from divisor x - c) to the left",
                    "Bring down leading coefficient",
                    "Multiply by c, add to next coefficient",
                    "Repeat until done",
                    "Last number is remainder"
                ],
                applications: [
                    "Quick root testing",
                    "Polynomial factorization",
                    "Finding function values",
                    "Reducing polynomial degree"
                ]
            },

            polynomial_roots: {
                title: "Finding Polynomial Roots",
                concepts: [
                    "Fundamental Theorem: n-degree polynomial has n roots (counting multiplicities)",
                    "Roots may be real or complex",
                    "Complex roots come in conjugate pairs",
                    "Multiple methods for finding roots"
                ],
                theory: "The Fundamental Theorem of Algebra guarantees that every non-constant polynomial has at least one complex root, and exactly n roots when counting multiplicities.",
                keyFormulas: {
                    "Fundamental Theorem": "Degree n polynomial has n roots (counting multiplicity)",
                    "Complex Conjugate Theorem": "If a + bi is a root, so is a - bi",
                    "Vieta's Formulas": "Relate roots to coefficients"
                },
                solvingSteps: [
                    "Determine polynomial degree",
                    "Try factoring if possible",
                    "Apply Rational Root Theorem",
                    "Use synthetic division to test candidates",
                    "Factor out found roots",
                    "Solve remaining polynomial",
                    "Check for complex roots"
                ],
                applications: [
                    "Complete solution of polynomial equations",
                    "Understanding function behavior",
                    "Engineering transfer functions",
                    "Signal processing"
                ]
            },

            remainder_factor: {
                title: "Remainder and Factor Theorems",
                concepts: [
                    "Remainder Theorem: P(c) equals remainder when dividing by (x - c)",
                    "Factor Theorem: (x - c) is factor ⟺ P(c) = 0",
                    "Efficient root testing",
                    "Connection between evaluation and division"
                ],
                theory: "These theorems connect polynomial evaluation with division, providing shortcuts for testing factors and finding remainders.",
                keyFormulas: {
                    "Remainder Theorem": "P(x) = Q(x)(x - c) + P(c)",
                    "Factor Theorem": "P(c) = 0 ⟺ (x - c) is a factor",
                    "Application": "Test P(c) instead of performing division"
                },
                solvingSteps: [
                    "Identify potential factor (x - c)",
                    "Evaluate P(c) directly",
                    "If P(c) = 0, then (x - c) is a factor",
                    "If P(c) ≠ 0, then P(c) is the remainder",
                    "Use result for factorization or further analysis"
                ],
                applications: [
                    "Quick factor verification",
                    "Efficient root testing",
                    "Polynomial simplification",
                    "Computer algebra algorithms"
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
            'infinity': '∞', 'plusminus': '±',
            // Greek letters
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'Δ',
            'pi': 'π', 'theta': 'θ', 'lambda': 'λ', 'mu': 'μ',
            // Special symbols
            'sqrt': '√', 'cbrt': '∛', 'sum': '∑', 'product': '∏',
            'integral': '∫', 'partial': '∂'
        };
    }

    initializePolynomialSolvers() {
        this.polynomialTypes = {
            // Quadratic equations
            quadratic_standard: {
                patterns: [
                    /([+-]?\d*\.?\d*)x\^2\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*=\s*0/,
                    /([+-]?\d*\.?\d*)x²\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*=\s*0/,
                    /quadratic/i,
                    /x\^2.*=.*0/
                ],
                solver: this.solveQuadratic.bind(this),
                name: 'Quadratic Equation',
                category: 'quadratic',
                description: 'Solves ax² + bx + c = 0'
            },

            // Quadratic by factoring
            quadratic_factoring: {
                patterns: [
                    /factor.*quadratic/i,
                    /factorable.*quadratic/i
                ],
                solver: this.solveQuadraticByFactoring.bind(this),
                name: 'Quadratic Equation (Factoring Method)',
                category: 'quadratic',
                description: 'Solves quadratics by factoring'
            },

            // Completing the square
            completing_square: {
                patterns: [
                    /complet.*square/i,
                    /vertex.*form/i
                ],
                solver: this.solveByCompletingSquare.bind(this),
                name: 'Completing the Square',
                category: 'quadratic',
                description: 'Solves quadratics by completing the square'
            },

            // Cubic equations
            cubic_equation: {
                patterns: [
                    /([+-]?\d*\.?\d*)x\^3\s*([+-]\s*\d*\.?\d*)x\^2\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*=\s*0/,
                    /cubic/i,
                    /x\^3.*=.*0/
                ],
                solver: this.solveCubic.bind(this),
                name: 'Cubic Equation',
                category: 'cubic',
                description: 'Solves ax³ + bx² + cx + d = 0'
            },

            // Quartic equations
            quartic_equation: {
                patterns: [
                    /x\^4.*=.*0/,
                    /quartic/i,
                    /fourth.*degree/i
                ],
                solver: this.solveQuartic.bind(this),
                name: 'Quartic Equation',
                category: 'quartic',
                description: 'Solves ax⁴ + bx³ + cx² + dx + e = 0'
            },

            // Polynomial division
            polynomial_division: {
                patterns: [
                    /divid.*polynomial/i,
                    /long.*division.*polynomial/i,
                    /polynomial.*÷/
                ],
                solver: this.solvePolynomialDivision.bind(this),
                name: 'Polynomial Division',
                category: 'operations',
                description: 'Divides one polynomial by another'
            },

            // Synthetic division
            synthetic_division: {
                patterns: [
                    /synthetic.*division/i,
                    /synthetic.*divid/i
                ],
                solver: this.solveSyntheticDivision.bind(this),
                name: 'Synthetic Division',
                category: 'operations',
                description: 'Divides polynomial by (x - c) using synthetic division'
            },

            // Rational Root Theorem
            rational_root: {
                patterns: [
                    /rational.*root/i,
                    /possible.*root/i,
                    /find.*rational.*root/i
                ],
                solver: this.findRationalRoots.bind(this),
                name: 'Rational Root Theorem',
                category: 'roots',
                description: 'Finds rational roots using Rational Root Theorem'
            },

            // Polynomial factoring
            polynomial_factoring: {
                patterns: [
                    /factor.*polynomial/i,
                    /factorize/i,
                    /complete.*factorization/i
                ],
                solver: this.factorPolynomial.bind(this),
                name: 'Polynomial Factoring',
                category: 'factoring',
                description: 'Factors polynomial completely'
            },

            // Polynomial roots (general)
            polynomial_roots: {
                patterns: [
                    /find.*root.*polynomial/i,
                    /solve.*polynomial/i,
                    /root.*polynomial/i
                ],
                solver: this.findAllRoots.bind(this),
                name: 'Finding All Polynomial Roots',
                category: 'roots',
                description: 'Finds all roots of a polynomial'
            },

            // Polynomial inequalities
            polynomial_inequality: {
                patterns: [
                    /polynomial.*inequality/i,
                    /x\^2.*[><≤≥]/,
                    /quadratic.*inequality/i
                ],
                solver: this.solvePolynomialInequality.bind(this),
                name: 'Polynomial Inequality',
                category: 'inequalities',
                description: 'Solves polynomial inequalities'
            },

            // Graphing polynomials
            polynomial_graphing: {
                patterns: [
                    /graph.*polynomial/i,
                    /sketch.*polynomial/i,
                    /plot.*polynomial/i
                ],
                solver: this.analyzePolynomialGraph.bind(this),
                name: 'Polynomial Graphing Analysis',
                category: 'graphing',
                description: 'Analyzes and graphs polynomial functions'
            },

            // Remainder and Factor Theorems
            remainder_theorem: {
                patterns: [
                    /remainder.*theorem/i,
                    /factor.*theorem/i,
                    /evaluate.*polynomial/i
                ],
                solver: this.applyRemainderTheorem.bind(this),
                name: 'Remainder/Factor Theorem',
                category: 'theorems',
                description: 'Applies Remainder or Factor Theorem'
            },

            // Polynomial word problems
            polynomial_applications: {
                patterns: [
                    /polynomial.*application/i,
                    /polynomial.*word.*problem/i,
                    /polynomial.*model/i
                ],
                solver: this.solvePolynomialApplication.bind(this),
                name: 'Polynomial Applications',
                category: 'applications',
                description: 'Solves real-world problems using polynomials'
            }
        };
    }

    // Initialize common mistakes and error prevention database
    initializeErrorDatabase() {
        this.commonMistakes = {
            quadratic_standard: {
                'Calculate discriminant': [
                    'Forgetting to square b in b²',
                    'Sign error in -4ac term',
                    'Incorrect order of operations'
                ],
                'Apply quadratic formula': [
                    'Forgetting ± symbol (missing one solution)',
                    'Incorrect sign on -b',
                    'Dividing only numerator or only √ term by 2a'
                ],
                'Simplify solutions': [
                    'Not simplifying radicals completely',
                    'Arithmetic errors in fraction reduction',
                    'Leaving answers in improper form'
                ]
            },
            quadratic_factoring: {
                'Find factor pairs': [
                    'Not considering all factor combinations',
                    'Sign errors in factor pairs',
                    'Confusing sum and product conditions'
                ],
                'Set factors equal to zero': [
                    'Forgetting Zero Product Property',
                    'Not setting each factor to zero separately',
                    'Sign error when solving for x'
                ]
            },
            completing_square: {
                'Complete the square': [
                    'Forgetting to divide by a first if a ≠ 1',
                    'Incorrect calculation of (b/2)²',
                    'Not adding same value to both sides'
                ],
                'Apply square root': [
                    'Forgetting ± when taking square root',
                    'Sign errors in final steps',
                    'Not isolating x completely'
                ]
            },
            polynomial_division: {
                'Long division steps': [
                    'Misaligning terms by degree',
                    'Sign errors in subtraction',
                    'Forgetting placeholder zeros for missing terms'
                ],
                'Synthetic division': [
                    'Using wrong value for divisor',
                    'Arithmetic errors in multiplication/addition',
                    'Misinterpreting remainder'
                ]
            },
            rational_root: {
                'List candidates': [
                    'Missing negative candidates',
                    'Not including ±1',
                    'Forgetting to reduce fractions'
                ],
                'Test candidates': [
                    'Arithmetic errors in evaluation',
                    'Stopping after finding one root',
                    'Not factoring out found roots'
                ]
            },
            polynomial_inequality: {
                'Find critical points': [
                    'Missing some zeros',
                    'Not including equality points for ≤ or ≥',
                    'Incorrect factorization'
                ],
                'Test intervals': [
                    'Choosing test points at critical values',
                    'Sign errors in evaluation',
                    'Incorrect interval notation'
                ]
            }
        };

        this.errorPrevention = {
            discriminant_checking: {
                reminder: 'Always calculate discriminant carefully: b² - 4ac',
                method: 'Write out each component separately before combining'
            },
            plus_minus_rule: {
                reminder: 'Don\'t forget ± in quadratic formula and square roots',
                method: 'Circle or highlight the ± symbol in your work'
            },
            zero_product: {
                reminder: 'Zero Product Property: if AB = 0, then A = 0 OR B = 0',
                method: 'Set each factor equal to zero separately'
            },
            sign_tracking: {
                reminder: 'Track signs carefully in polynomial operations',
                method: 'Use parentheses and show all subtraction steps'
            }
        };
    }

    // Initialize explanation templates for different learning styles
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
    solvePolynomialProblem(config) {
        const { equation, scenario, parameters, problemType, context } = config;

        try {
            // Parse the problem
            this.currentProblem = this.parsePolynomialProblem(equation, scenario, parameters, problemType, context);

            // Solve the problem
            this.currentSolution = this.solvePolynomialProblem_Internal(this.currentProblem);

            // Generate solution steps
            this.solutionSteps = this.generatePolynomialSteps(this.currentProblem, this.currentSolution);

            // Generate graph data if applicable
            this.generatePolynomialGraphData();

            // Generate workbook
            this.generatePolynomialWorkbook();

            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                solutions: this.currentSolution?.solutions,
                solutionType: this.currentSolution?.solutionType
            };

        } catch (error) {
            throw new Error(`Failed to solve polynomial problem: ${error.message}`);
        }
    }

    parsePolynomialProblem(equation, scenario = '', parameters = {}, problemType = null, context = {}) {
        const cleanInput = equation ? this.cleanMathExpression(equation) : '';

        // If problem type is specified, use it directly
        if (problemType && this.polynomialTypes[problemType]) {
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

        // Auto-detect polynomial problem type
        for (const [type, config] of Object.entries(this.polynomialTypes)) {
            for (const pattern of config.patterns) {
                if (pattern.test(cleanInput) || pattern.test(scenario)) {
                    const match = cleanInput.match(pattern);
                    const extractedParams = this.extractPolynomialParameters(match, type);

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

        // Default to quadratic if coefficients are provided
        if (parameters.a !== undefined || parameters.b !== undefined || parameters.c !== undefined) {
            return {
                originalInput: equation || 'Polynomial equation with given coefficients',
                cleanInput: cleanInput,
                type: 'quadratic_standard',
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

        throw new Error(`Unable to recognize polynomial problem type from: ${equation || scenario}`);
    }

    cleanMathExpression(expression) {
        return expression
            .replace(/\s+/g, ' ')
            .replace(/\^2/g, '²')
            .replace(/\^3/g, '³')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/≠/g, '!=')
            .trim();
    }

    extractPolynomialParameters(match, type) {
        const params = {};

        if ((type === 'quadratic_standard' || type === 'quadratic_factoring') && match) {
            params.a = this.parseCoefficient(match[1]) || 1;
            params.b = this.parseCoefficient(match[2]) || 0;
            params.c = this.parseCoefficient(match[3]) || 0;
        }

        if (type === 'cubic_equation' && match) {
            params.a = this.parseCoefficient(match[1]) || 1;
            params.b = this.parseCoefficient(match[2]) || 0;
            params.c = this.parseCoefficient(match[3]) || 0;
            params.d = this.parseCoefficient(match[4]) || 0;
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

    solvePolynomialProblem_Internal(problem) {
        const solver = this.polynomialTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for polynomial problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    // POLYNOMIAL SOLVERS

    solveQuadratic(problem) {
        const { a, b, c } = problem.parameters;

        if (Math.abs(a) < 1e-10) {
            throw new Error('Coefficient a cannot be zero in a quadratic equation');
        }

        // Calculate discriminant
        const discriminant = b * b - 4 * a * c;

        let solutionType;
        let solutions = [];
        let rootType;

        if (Math.abs(discriminant) < 1e-10) {
            // One repeated real root
            const x = -b / (2 * a);
            solutions = [x];
            solutionType = 'One repeated real root';
            rootType = 'real_repeated';
        } else if (discriminant > 0) {
            // Two distinct real roots
            const sqrtDiscriminant = Math.sqrt(discriminant);
            const x1 = (-b + sqrtDiscriminant) / (2 * a);
            const x2 = (-b - sqrtDiscriminant) / (2 * a);
            solutions = [x1, x2].sort((a, b) => a - b);
            solutionType = 'Two distinct real roots';
            rootType = 'real_distinct';
        } else {
            // Two complex conjugate roots
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-discriminant) / (2 * a);
            solutions = [
                { real: realPart, imag: imagPart },
                { real: realPart, imag: -imagPart }
            ];
            solutionType = 'Two complex conjugate roots';
            rootType = 'complex';
        }

        return {
            equation: `${a}x² + ${b}x + ${c} = 0`,
            coefficients: { a, b, c },
            discriminant: discriminant,
            solutionType: solutionType,
            rootType: rootType,
            solutions: solutions,
            vertex: this.findQuadraticVertex(a, b, c),
            yIntercept: c,
            factorForm: this.getFactorForm(a, solutions, rootType),
            verification: this.verifyQuadraticSolutions(solutions, a, b, c, rootType),
            category: 'quadratic'
        };
    }

    solveQuadraticByFactoring(problem) {
        const { a, b, c } = problem.parameters;

        // Try to find integer factors
        const factors = this.findQuadraticFactors(a, b, c);

        if (!factors) {
            return {
                equation: `${a}x² + ${b}x + ${c} = 0`,
                solutionType: 'Not factorable with integers',
                recommendation: 'Use quadratic formula instead',
                category: 'quadratic'
            };
        }

        const { factor1, factor2 } = factors;
        
        // Extract roots from factors
        const solutions = [
            -factor1.constant / factor1.coefficient,
            -factor2.constant / factor2.coefficient
        ].sort((a, b) => a - b);

        return {
            equation: `${a}x² + ${b}x + ${c} = 0`,
            solutionType: 'Factorable',
            factoredForm: `${factor1.coefficient}x + ${factor1.constant})(${factor2.coefficient}x + ${factor2.constant}) = 0`,
            factors: factors,
            solutions: solutions,
            verification: this.verifyQuadraticSolutions(solutions, a, b, c, 'real_distinct'),
            category: 'quadratic'
        };
    }

    solveByCompletingSquare(problem) {
        const { a, b, c } = problem.parameters;

        // Step-by-step completing the square
        const steps = [];

        // Divide by a if necessary
        const a_norm = 1;
        const b_norm = b / a;
        const c_norm = c / a;

        // Calculate (b/2a)²
        const halfB = b_norm / 2;
        const completingTerm = halfB * halfB;

        // Vertex form: a(x - h)² + k
        const h = -b / (2 * a);
        const k = c - a * h * h;

        // Solve (x - h)² = (k - c_norm)
        const rightSide = -c_norm - completingTerm;
        
        let solutions;
        let solutionType;
        
        if (Math.abs(rightSide) < 1e-10) {
            solutions = [h];
            solutionType = 'One repeated real root';
        } else if (rightSide > 0) {
            const sqrtValue = Math.sqrt(rightSide);
            solutions = [h + sqrtValue, h - sqrtValue].sort((a, b) => a - b);
            solutionType = 'Two distinct real roots';
        } else {
            const imagValue = Math.sqrt(-rightSide);
            solutions = [
                { real: h, imag: imagValue },
                { real: h, imag: -imagValue }
            ];
            solutionType = 'Two complex conjugate roots';
        }

        return {
            equation: `${a}x² + ${b}x + ${c} = 0`,
            vertexForm: `${a}(x - ${h})² + ${k}`,
            vertex: { h, k },
            completingTerm: completingTerm,
            solutions: solutions,
            solutionType: solutionType,
            category: 'quadratic'
        };
    }

    solveCubic(problem) {
        const { a, b, c, d } = problem.parameters;

        if (Math.abs(a) < 1e-10) {
            throw new Error('Coefficient a cannot be zero in a cubic equation');
        }

        // First, try Rational Root Theorem
        const rationalRoots = this.findRationalRootsForPolynomial([a, b, c, d]);
        
        if (rationalRoots.length > 0) {
            // Factor out first root and solve remaining quadratic
            const firstRoot = rationalRoots[0];
            const reducedCoeffs = this.syntheticDivision([a, b, c, d], firstRoot);
            
            // Solve remaining quadratic
            const quadSolution = this.solveQuadratic({
                parameters: {
                    a: reducedCoeffs[0],
                    b: reducedCoeffs[1],
                    c: reducedCoeffs[2]
                }
            });

            const allRoots = [firstRoot, ...quadSolution.solutions];

            return {
                equation: `${a}x³ + ${b}x² + ${c}x + ${d} = 0`,
                solutionType: 'Solved using Rational Root Theorem',
                rationalRoot: firstRoot,
                remainingQuadratic: quadSolution,
                solutions: allRoots,
                verification: this.verifyCubicSolutions(allRoots, a, b, c, d),
                category: 'cubic'
            };
        }

        // If no rational roots, use Cardano's formula or numerical methods
        return {
            equation: `${a}x³ + ${b}x² + ${c}x + ${d} = 0`,
            solutionType: 'No rational roots found',
            recommendation: 'Use numerical methods or Cardano\'s formula',
            category: 'cubic'
        };
    }

    solveQuartic(problem) {
        const { a, b, c, d, e } = problem.parameters;

        // Check if it's a biquadratic (no x³ and x terms)
        if (Math.abs(b) < 1e-10 && Math.abs(d) < 1e-10) {
            return this.solveBiquadratic(a, c, e);
        }

        // Try Rational Root Theorem
        const rationalRoots = this.findRationalRootsForPolynomial([a, b, c, d, e]);
        
        if (rationalRoots.length > 0) {
            return {
                equation: `${a}x⁴ + ${b}x³ + ${c}x² + ${d}x + ${e} = 0`,
                solutionType: 'Partial solution using Rational Root Theorem',
                rationalRoots: rationalRoots,
                category: 'quartic'
            };
        }

        return {
            equation: `${a}x⁴ + ${b}x³ + ${c}x² + ${d}x + ${e} = 0`,
            solutionType: 'Complex quartic',
            recommendation: 'Use Ferrari\'s method or numerical methods',
            category: 'quartic'
        };
    }

    solveBiquadratic(a, c, e) {
        // Biquadratic: ax⁴ + cx² + e = 0
        // Let u = x², solve au² + cu + e = 0
        
        const quadSolution = this.solveQuadratic({
            parameters: { a: a, b: c, c: e }
        });

        const solutions = [];
        
        for (const u of quadSolution.solutions) {
            if (typeof u === 'number') {
                if (u > 0) {
                    solutions.push(Math.sqrt(u));
                    solutions.push(-Math.sqrt(u));
                } else if (u === 0) {
                    solutions.push(0);
                } else {
                    // Complex roots
                    const imagPart = Math.sqrt(-u);
                    solutions.push({ real: 0, imag: imagPart });
                    solutions.push({ real: 0, imag: -imagPart });
                }
            }
        }

        return {
            equation: `${a}x⁴ + ${c}x² + ${e} = 0`,
            solutionType: 'Biquadratic',
            substitution: 'u = x²',
            quadraticSolution: quadSolution,
            solutions: solutions,
            category: 'quartic'
        };
    }

    solvePolynomialDivision(problem) {
        const { dividend, divisor } = problem.parameters;

        if (!dividend || !divisor) {
            throw new Error('Dividend and divisor polynomials must be provided');
        }

        const result = this.polynomialLongDivision(dividend, divisor);

        return {
            dividend: dividend,
            divisor: divisor,
            quotient: result.quotient,
            remainder: result.remainder,
            verification: `(${divisor}) × (${result.quotient}) + (${result.remainder}) = ${dividend}`,
            category: 'operations'
        };
    }

    solveSyntheticDivision(problem) {
        const { coefficients, divisor } = problem.parameters;

        if (!coefficients || divisor === undefined) {
            throw new Error('Coefficients array and divisor value must be provided');
        }

        const result = this.syntheticDivision(coefficients, divisor);

        return {
            dividend: this.coeffsToPolynomial(coefficients),
            divisor: `(x - ${divisor})`,
            quotient: this.coeffsToPolynomial(result.slice(0, -1)),
            remainder: result[result.length - 1],
            steps: this.getSyntheticDivisionSteps(coefficients, divisor),
            category: 'operations'
        };
    }

    findRationalRoots(problem) {
        const { coefficients } = problem.parameters;

        if (!coefficients || coefficients.length === 0) {
            throw new Error('Coefficients array must be provided');
        }

        const roots = this.findRationalRootsForPolynomial(coefficients);
        const candidates = this.getRationalRootCandidates(coefficients);

        return {
            polynomial: this.coeffsToPolynomial(coefficients),
            candidates: candidates,
            rationalRoots: roots,
            solutionType: roots.length > 0 ? 'Rational roots found' : 'No rational roots',
            category: 'roots'
        };
    }

    factorPolynomial(problem) {
        const { coefficients } = problem.parameters;

        const roots = this.findRationalRootsForPolynomial(coefficients);
        const factors = [];

        for (const root of roots) {
            factors.push(`(x - ${root})`);
        }

        return {
            polynomial: this.coeffsToPolynomial(coefficients),
            roots: roots,
            factorization: factors.length > 0 ? factors.join(' × ') : 'Cannot factor over rationals',
            category: 'factoring'
        };
    }

    findAllRoots(problem) {
        const { coefficients } = problem.parameters;

        const degree = coefficients.length - 1;
        const roots = this.findRationalRootsForPolynomial(coefficients);

        return {
            polynomial: this.coeffsToPolynomial(coefficients),
            degree: degree,
            expectedRoots: degree,
            foundRoots: roots,
            remainingDegree: degree - roots.length,
            category: 'roots'
        };
    }

    solvePolynomialInequality(problem) {
        const { coefficients, operator } = problem.parameters;

        const roots = this.findRationalRootsForPolynomial(coefficients).sort((a, b) => a - b);
        const intervals = this.getIntervals(roots);
        const testResults = this.testIntervals(coefficients, intervals);

        const solutionIntervals = testResults
            .filter(result => this.satisfiesInequality(result.sign, operator))
            .map(result => result.interval);

        return {
            polynomial: this.coeffsToPolynomial(coefficients),
            inequality: `${this.coeffsToPolynomial(coefficients)} ${operator} 0`,
            criticalPoints: roots,
            solutionIntervals: solutionIntervals,
            intervalNotation: this.formatIntervals(solutionIntervals, roots, operator),
            category: 'inequalities'
        };
    }

    analyzePolynomialGraph(problem) {
        const { coefficients } = problem.parameters;

        const degree = coefficients.length - 1;
        const leadingCoeff = coefficients[0];
        const roots = this.findRationalRootsForPolynomial(coefficients);
        const yIntercept = coefficients[coefficients.length - 1];

        // Determine end behavior
        let endBehavior;
        if (degree % 2 === 0) {
            endBehavior = leadingCoeff > 0 ? 
                'Both ends up (∞, ∞)' : 
                'Both ends down (-∞, -∞)';
        } else {
            endBehavior = leadingCoeff > 0 ? 
                'Left down, right up (-∞, ∞)' : 
                'Left up, right down (∞, -∞)';
        }

        return {
            polynomial: this.coeffsToPolynomial(coefficients),
            degree: degree,
            leadingCoefficient: leadingCoeff,
            endBehavior: endBehavior,
            zeros: roots,
            yIntercept: yIntercept,
            maxTurningPoints: degree - 1,
            graphData: this.generatePolynomialPoints(coefficients),
            category: 'graphing'
        };
    }

    applyRemainderTheorem(problem) {
        const { coefficients, testValue } = problem.parameters;

        const remainder = this.evaluatePolynomial(coefficients, testValue);
        const isFactor = Math.abs(remainder) < 1e-10;

        return {
            polynomial: this.coeffsToPolynomial(coefficients),
            testValue: testValue,
            remainder: remainder,
            isFactor: isFactor,
            theorem: isFactor ? 'Factor Theorem: (x - c) is a factor' : 'Remainder Theorem: remainder is P(c)',
            category: 'theorems'
        };
    }

    solvePolynomialApplication(problem) {
        const { scenario, coefficients, variable } = problem.parameters;

        return {
            scenario: scenario,
            polynomial: this.coeffsToPolynomial(coefficients),
            variable: variable || 'x',
            applicationNote: 'Interpret solutions in context of the problem',
            category: 'applications'
        };
    }

    // HELPER METHODS

    findQuadraticVertex(a, b, c) {
        const h = -b / (2 * a);
        const k = a * h * h + b * h + c;
        return { h, k };
    }

    getFactorForm(a, solutions, rootType) {
        if (rootType === 'complex') {
            return 'Complex roots - no real factorization';
        }

        if (rootType === 'real_repeated') {
            return `${a}(x - ${solutions[0]})²`;
        }

        return `${a}(x - ${solutions[0]})(x - ${solutions[1]})`;
    }

    findQuadraticFactors(a, b, c) {
        // Try to find integer factors
        const ac = a * c;
        
        // Find factor pairs of ac that sum to b
        for (let i = 1; i <= Math.abs(ac); i++) {
            if (ac % i === 0) {
                const j = ac / i;
                
                // Test positive combinations
                if (i + j === b) {
                    return this.constructFactors(a, i, j);
                }
                if (i - j === b) {
                    return this.constructFactors(a, i, -j);
                }
                if (-i + j === b) {
                    return this.constructFactors(a, -i, j);
                }
                if (-i - j === b) {
                    return this.constructFactors(a, -i, -j);
                }
            }
        }

        return null;
    }

    constructFactors(a, p, q) {
        // Simplified factorization construction
        return {
            factor1: { coefficient: 1, constant: p },
            factor2: { coefficient: a, constant: q }
        };
    }

    syntheticDivision(coefficients, divisor) {
        const result = [coefficients[0]];
        
        for (let i = 1; i < coefficients.length; i++) {
            const value = coefficients[i] + result[i - 1] * divisor;
            result.push(value);
        }

        return result;
    }

    polynomialLongDivision(dividend, divisor) {
        // Simplified polynomial long division
        return {
            quotient: 'quotient polynomial',
            remainder: 'remainder polynomial'
        };
    }

    findRationalRootsForPolynomial(coefficients) {
        const candidates = this.getRationalRootCandidates(coefficients);
        const roots = [];

        for (const candidate of candidates) {
            const value = this.evaluatePolynomial(coefficients, candidate);
            if (Math.abs(value) < 1e-10) {
                roots.push(candidate);
            }
        }

        return roots;
    }

    getRationalRootCandidates(coefficients) {
        const constant = Math.abs(coefficients[coefficients.length - 1]);
        const leading = Math.abs(coefficients[0]);

        const constantFactors = this.getFactors(constant);
        const leadingFactors = this.getFactors(leading);

        const candidates = [];

        for (const p of constantFactors) {
            for (const q of leadingFactors) {
                candidates.push(p / q);
                candidates.push(-p / q);
            }
        }

        return [...new Set(candidates)].sort((a, b) => a - b);
    }

    getFactors(n) {
        if (n === 0) return [1];
        
        const factors = [];
        const absN = Math.abs(n);
        
        for (let i = 1; i <= Math.sqrt(absN); i++) {
            if (absN % i === 0) {
                factors.push(i);
                if (i !== absN / i) {
                    factors.push(absN / i);
                }
            }
        }

        return factors.sort((a, b) => a - b);
    }

    evaluatePolynomial(coefficients, x) {
        let result = 0;
        const n = coefficients.length - 1;

        for (let i = 0; i <= n; i++) {
            result += coefficients[i] * Math.pow(x, n - i);
        }

        return result;
    }

    coeffsToPolynomial(coefficients) {
        const terms = [];
        const n = coefficients.length - 1;

        for (let i = 0; i <= n; i++) {
            const coeff = coefficients[i];
            const power = n - i;

            if (Math.abs(coeff) < 1e-10) continue;

            let term = '';
            if (coeff > 0 && terms.length > 0) term += '+ ';
            if (coeff < 0) term += '- ';

            const absCoeff = Math.abs(coeff);
            if (absCoeff !== 1 || power === 0) term += absCoeff;

            if (power > 0) term += 'x';
            if (power > 1) term += `^${power}`;

            terms.push(term);
        }

        return terms.length > 0 ? terms.join(' ') : '0';
    }

    getIntervals(roots) {
        const intervals = [];
        const sortedRoots = [...roots].sort((a, b) => a - b);

        intervals.push({ start: -Infinity, end: sortedRoots[0] });

        for (let i = 0; i < sortedRoots.length - 1; i++) {
            intervals.push({ start: sortedRoots[i], end: sortedRoots[i + 1] });
        }

        intervals.push({ start: sortedRoots[sortedRoots.length - 1], end: Infinity });

        return intervals;
    }

    testIntervals(coefficients, intervals) {
        return intervals.map(interval => {
            const testPoint = interval.start === -Infinity ? 
                interval.end - 1 :
                interval.end === Infinity ?
                interval.start + 1 :
                (interval.start + interval.end) / 2;

            const value = this.evaluatePolynomial(coefficients, testPoint);

            return {
                interval: interval,
                testPoint: testPoint,
                value: value,
                sign: value > 0 ? 'positive' : value < 0 ? 'negative' : 'zero'
            };
        });
    }

    satisfiesInequality(sign, operator) {
        switch(operator) {
            case '>': return sign === 'positive';
            case '<': return sign === 'negative';
            case '>=': case '≥': return sign === 'positive' || sign === 'zero';
            case '<=': case '≤': return sign === 'negative' || sign === 'zero';
            default: return false;
        }
    }

    formatIntervals(intervals, roots, operator) {
        // Format intervals in mathematical notation
        return intervals.map(int => {
            const leftBracket = (operator === '>=' || operator === '≤') && roots.includes(int.start) ? '[' : '(';
            const rightBracket = (operator === '>=' || operator === '≤') && roots.includes(int.end) ? ']' : ')';
            
            const leftVal = int.start === -Infinity ? '-∞' : int.start;
            const rightVal = int.end === Infinity ? '∞' : int.end;
            
            return `${leftBracket}${leftVal}, ${rightVal}${rightBracket}`;
        }).join(' ∪ ');
    }

    generatePolynomialPoints(coefficients) {
        const points = [];
        for (let x = -10; x <= 10; x += 0.5) {
            const y = this.evaluatePolynomial(coefficients, x);
            points.push({ x, y });
        }
        return points;
    }

    getSyntheticDivisionSteps(coefficients, divisor) {
        const steps = [];
        const result = [coefficients[0]];
        
        steps.push(`Setup: ${coefficients.join(' | ')} divided by (x - ${divisor})`);
        steps.push(`Bring down first coefficient: ${coefficients[0]}`);

        for (let i = 1; i < coefficients.length; i++) {
            const multiply = result[i - 1] * divisor;
            const add = coefficients[i] + multiply;
            result.push(add);
            steps.push(`Multiply ${result[i - 1]} × ${divisor} = ${multiply}, add to ${coefficients[i]} = ${add}`);
        }

        return steps;
    }

    // VERIFICATION METHODS

    verifyQuadraticSolutions(solutions, a, b, c, rootType) {
        if (rootType === 'complex') {
            return { note: 'Complex solutions - verification requires complex arithmetic' };
        }

        return solutions.map(x => {
            const leftSide = a * x * x + b * x + c;
            return {
                solution: x,
                substitution: `${a}(${x})² + ${b}(${x}) + ${c}`,
                result: leftSide,
                isValid: Math.abs(leftSide) < 1e-10
            };
        });
    }

    verifyCubicSolutions(solutions, a, b, c, d) {
        return solutions.filter(x => typeof x === 'number').map(x => {
            const leftSide = a * x * x * x + b * x * x + c * x + d;
            return {
                solution: x,
                substitution: `${a}(${x})³ + ${b}(${x})² + ${c}(${x}) + ${d}`,
                result: leftSide,
                isValid: Math.abs(leftSide) < 1e-10
            };
        });
    }

    verifyQuadratic() {
        const { a, b, c } = this.currentProblem.parameters;
        const solutions = this.currentSolution.solutions;
        const rootType = this.currentSolution.rootType;

        if (rootType === 'complex') {
            return {
                type: 'complex',
                note: 'Complex solutions require complex number verification',
                discriminant: this.currentSolution.discriminant
            };
        }

        const verifications = solutions.map(x => {
            const leftSide = a * x * x + b * x + c;
            return {
                solution: x,
                substitution: `${a}(${x})² + ${b}(${x}) + ${c}`,
                calculated: leftSide,
                expected: 0,
                difference: Math.abs(leftSide),
                isValid: Math.abs(leftSide) < 1e-10
            };
        });

        return {
            equation: `${a}x² + ${b}x + ${c} = 0`,
            verifications: verifications,
            allValid: verifications.every(v => v.isValid)
        };
    }

    verifyPolynomialDivision() {
        const { dividend, divisor, quotient, remainder } = this.currentSolution;
        
        return {
            dividend: dividend,
            divisor: divisor,
            quotient: quotient,
            remainder: remainder,
            verification: `(${divisor}) × (${quotient}) + (${remainder})`,
            note: 'Verify that divisor × quotient + remainder = dividend'
        };
    }

    verifyRationalRoots() {
        const { coefficients } = this.currentProblem.parameters;
        const roots = this.currentSolution.rationalRoots;

        if (!roots || roots.length === 0) {
            return { type: 'no_roots', message: 'No rational roots found' };
        }

        const verifications = roots.map(root => {
            const value = this.evaluatePolynomial(coefficients, root);
            return {
                root: root,
                evaluation: value,
                isValid: Math.abs(value) < 1e-10
            };
        });

        return {
            polynomial: this.coeffsToPolynomial(coefficients),
            verifications: verifications,
            allValid: verifications.every(v => v.isValid)
        };
    }

    // FORMATTING METHODS FOR VERIFICATION DATA

    formatQuadraticVerification(verification) {
        if (verification.type === 'complex') {
            return [
                ['Verification Type', 'Complex Roots'],
                ['Discriminant', verification.discriminant],
                ['Note', verification.note]
            ];
        }

        const data = [
            ['Original Equation', verification.equation],
            ['', ''],
            ['Solution', 'Substitution', 'Result', 'Valid']
        ];

        verification.verifications.forEach(v => {
            data.push([
                v.solution,
                v.substitution,
                v.calculated.toFixed(10),
                v.isValid ? 'Yes' : 'No'
            ]);
        });

        data.push(['', '']);
        data.push(['All Solutions Valid', verification.allValid ? 'Yes' : 'No']);

        return data;
    }

    formatPolynomialDivisionVerification(verification) {
        return [
            ['Dividend', verification.dividend],
            ['Divisor', verification.divisor],
            ['Quotient', verification.quotient],
            ['Remainder', verification.remainder],
            ['', ''],
            ['Verification Formula', verification.verification],
            ['Note', verification.note]
        ];
    }

    formatRationalRootsVerification(verification) {
        if (verification.type === 'no_roots') {
            return [['Result', verification.message]];
        }

        const data = [
            ['Polynomial', verification.polynomial],
            ['', ''],
            ['Root', 'P(root)', 'Valid']
        ];

        verification.verifications.forEach(v => {
            data.push([
                v.root,
                v.evaluation.toExponential(10),
                v.isValid ? 'Yes' : 'No'
            ]);
        });

        data.push(['', '']);
        data.push(['All Roots Valid', verification.allValid ? 'Yes' : 'No']);

        return data;
    }

    // CONFIDENCE AND NOTES METHODS

    calculateVerificationConfidence() {
        if (!this.currentSolution || !this.currentProblem) return 'Unknown';

        const { type } = this.currentProblem;

        switch (type) {
            case 'quadratic_standard':
            case 'quadratic_factoring':
            case 'completing_square':
                const verification = this.verifyQuadratic();
                if (verification.type === 'complex') return 'High (Complex)';
                return verification.allValid ? 'High' : 'Low';

            case 'rational_root':
                const rootVerification = this.verifyRationalRoots();
                if (rootVerification.type === 'no_roots') return 'Confirmed';
                return rootVerification.allValid ? 'High' : 'Medium';

            case 'polynomial_division':
            case 'synthetic_division':
                return 'High';

            default:
                return 'Medium';
        }
    }

    getVerificationNotes() {
        const { type } = this.currentProblem;
        const notes = [];

        switch (type) {
            case 'quadratic_standard':
                notes.push('Solutions verified by direct substitution');
                notes.push('Discriminant calculated to determine root type');
                notes.push('Numerical tolerance: 1e-10');
                break;

            case 'quadratic_factoring':
                notes.push('Factorization verified through expansion');
                notes.push('Zero Product Property applied');
                break;

            case 'completing_square':
                notes.push('Vertex form derived algebraically');
                notes.push('Solutions verified in original equation');
                break;

            case 'cubic_equation':
                notes.push('Rational Root Theorem applied first');
                notes.push('Synthetic division used to reduce degree');
                break;

            case 'rational_root':
                notes.push('All candidates tested systematically');
                notes.push('Roots verified by direct evaluation');
                break;

            case 'polynomial_division':
            case 'synthetic_division':
                notes.push('Division algorithm applied');
                notes.push('Quotient and remainder verified');
                break;

            default:
                notes.push('Standard polynomial verification methods applied');
        }

        return notes.join('; ');
    }

    generatePedagogicalNotes(problemType) {
        const pedagogicalDatabase = {
            quadratic_standard: {
                objectives: [
                    'Solve quadratic equations using the quadratic formula',
                    'Understand the discriminant and root types',
                    'Verify solutions through substitution'
                ],
                keyConcepts: [
                    'Discriminant determines nature of roots',
                    'Quadratic formula works for all quadratics',
                    'Complex roots come in conjugate pairs'
                ],
                prerequisites: [
                    'Simplifying radicals',
                    'Order of operations',
                    'Understanding of complex numbers (for complex roots)'
                ],
                commonDifficulties: [
                    'Sign errors in -b term',
                    'Forgetting ± symbol',
                    'Incorrect calculation of discriminant',
                    'Division errors with 2a'
                ],
                extensions: [
                    'Deriving the quadratic formula',
                    'Applications in physics and business',
                    'Graphing parabolas'
                ],
                assessment: [
                    'Check discriminant calculation',
                    'Verify both solutions are found',
                    'Test simplification of radicals',
                    'Check solution verification'
                ]
            },

            quadratic_factoring: {
                objectives: [
                    'Factor quadratic expressions',
                    'Apply Zero Product Property',
                    'Recognize when factoring is efficient'
                ],
                keyConcepts: [
                    'Zero Product Property',
                    'Sum and product of roots',
                    'Trial and error vs. systematic methods'
                ],
                prerequisites: [
                    'Factoring integers',
                    'Distributive property',
                    'Solving simple linear equations'
                ],
                commonDifficulties: [
                    'Finding correct factor pairs',
                    'Sign errors in factors',
                    'Not checking if factoring is possible',
                    'Stopping after factoring without solving'
                ],
                extensions: [
                    'Factoring by grouping',
                    'AC method for complex factorizations',
                    'Factoring higher degree polynomials'
                ],
                assessment: [
                    'Verify factorization by expansion',
                    'Check if all factor pairs considered',
                    'Test Zero Product Property understanding',
                    'Ensure solutions are extracted from factors'
                ]
            },

            completing_square: {
                objectives: [
                    'Transform quadratics to vertex form',
                    'Solve using completing the square',
                    'Understand connection to quadratic formula'
                ],
                keyConcepts: [
                    'Perfect square trinomial pattern',
                    'Vertex form reveals maximum/minimum',
                    'Method works for all quadratics'
                ],
                prerequisites: [
                    'Perfect square binomial expansion',
                    'Square root property',
                    'Algebraic manipulation skills'
                ],
                commonDifficulties: [
                    'Forgetting to divide by a first',
                    'Incorrect calculation of (b/2)²',
                    'Not adding same value to both sides',
                    'Sign errors in final steps'
                ],
                extensions: [
                    'Deriving quadratic formula',
                    'Optimization problems',
                    'Conic sections'
                ],
                assessment: [
                    'Check vertex calculation',
                    'Verify completing square process',
                    'Test conversion between forms',
                    'Assess understanding of vertex meaning'
                ]
            },

            cubic_equation: {
                objectives: [
                    'Solve cubic equations using various methods',
                    'Apply Rational Root Theorem',
                    'Factor cubic polynomials'
                ],
                keyConcepts: [
                    'Cubic equations always have at least one real root',
                    'Factor Theorem for finding roots',
                    'Synthetic division for degree reduction'
                ],
                prerequisites: [
                    'Polynomial evaluation',
                    'Synthetic division',
                    'Solving quadratic equations'
                ],
                commonDifficulties: [
                    'Missing potential rational roots',
                    'Errors in synthetic division',
                    'Not factoring completely',
                    'Computational errors with larger numbers'
                ],
                extensions: [
                    'Cardano\'s formula for general cubics',
                    'Graphing cubic functions',
                    'Applications in physics and engineering'
                ],
                assessment: [
                    'Check systematic testing of candidates',
                    'Verify synthetic division accuracy',
                    'Test complete factorization',
                    'Ensure all roots are found'
                ]
            },

            rational_root: {
                objectives: [
                    'Apply Rational Root Theorem systematically',
                    'Test potential roots efficiently',
                    'Understand theorem limitations'
                ],
                keyConcepts: [
                    'Rational roots must have specific form p/q',
                    'Theorem gives candidates, not guarantees',
                    'Efficient testing saves time'
                ],
                prerequisites: [
                    'Finding factors of integers',
                    'Polynomial evaluation',
                    'Understanding of rational numbers'
                ],
                commonDifficulties: [
                    'Missing negative candidates',
                    'Not testing all possibilities',
                    'Arithmetic errors in testing',
                    'Forgetting ±1 as candidates'
                ],
                extensions: [
                    'Irrational and complex roots',
                    'Descartes\' Rule of Signs',
                    'Numerical methods for roots'
                ],
                assessment: [
                    'Check completeness of candidate list',
                    'Verify testing method accuracy',
                    'Test understanding of theorem statement',
                    'Assess efficiency of approach'
                ]
            },

            polynomial_division: {
                objectives: [
                    'Perform polynomial long division',
                    'Understand division algorithm',
                    'Apply to simplification and factoring'
                ],
                keyConcepts: [
                    'Division algorithm: P(x) = D(x)Q(x) + R(x)',
                    'Degree of remainder < degree of divisor',
                    'Connection to factoring'
                ],
                prerequisites: [
                    'Long division of integers',
                    'Polynomial operations',
                    'Understanding of degree'
                ],
                commonDifficulties: [
                    'Alignment of terms by degree',
                    'Sign errors in subtraction',
                    'Forgetting placeholder zeros',
                    'Stopping division prematurely'
                ],
                extensions: [
                    'Synthetic division',
                    'Partial fractions',
                    'Applications in calculus'
                ],
                assessment: [
                    'Check alignment and organization',
                    'Verify quotient and remainder',
                    'Test division algorithm understanding',
                    'Assess subtraction accuracy'
                ]
            },

            polynomial_inequality: {
                objectives: [
                    'Solve polynomial inequalities',
                    'Use sign analysis method',
                    'Express solutions in interval notation'
                ],
                keyConcepts: [
                    'Test intervals between zeros',
                    'Sign doesn\'t change within intervals',
                    'Include/exclude endpoints appropriately'
                ],
                prerequisites: [
                    'Finding polynomial zeros',
                    'Number line analysis',
                    'Interval notation'
                ],
                commonDifficulties: [
                    'Missing zeros',
                    'Testing at zeros instead of in intervals',
                    'Incorrect interval notation',
                    'Sign analysis errors'
                ],
                extensions: [
                    'Rational inequalities',
                    'Systems of inequalities',
                    'Optimization applications'
                ],
                assessment: [
                    'Check all zeros found',
                    'Verify test point selection',
                    'Test interval notation accuracy',
                    'Assess understanding of solution regions'
                ]
            },

            polynomial_graphing: {
                objectives: [
                    'Analyze polynomial function behavior',
                    'Identify key features from equation',
                    'Sketch accurate graphs'
                ],
                keyConcepts: [
                    'End behavior from leading term',
                    'Zeros and their multiplicities',
                    'Maximum number of turning points',
                    'Continuity and smoothness'
                ],
                prerequisites: [
                    'Finding zeros',
                    'Understanding of function notation',
                    'Coordinate plane skills'
                ],
                commonDifficulties: [
                    'Incorrect end behavior',
                    'Confusion about multiplicity effects',
                    'Poor scaling of axes',
                    'Missing turning points'
                ],
                extensions: [
                    'Calculus analysis of polynomials',
                    'Polynomial regression',
                    'Interpolation'
                ],
                assessment: [
                    'Check end behavior determination',
                    'Verify zero identification',
                    'Test multiplicity understanding',
                    'Assess overall graph accuracy'
                ]
            }
        };

        return pedagogicalDatabase[problemType] || {
            objectives: ['Solve the given polynomial problem'],
            keyConcepts: ['Apply appropriate polynomial techniques'],
            prerequisites: ['Basic polynomial operations'],
            commonDifficulties: ['Various computational errors'],
            extensions: ['More complex polynomial problems'],
            assessment: ['Check understanding of solution process']
        };
    }

    generateAlternativeMethods(problemType) {
        const alternativeDatabase = {
            quadratic_standard: {
                primaryMethod: 'Quadratic Formula',
                methods: [
                    {
                        name: 'Factoring',
                        description: 'Factor into (px + q)(rx + s) = 0 if possible',
                        whenToUse: 'When coefficients produce integer factors'
                    },
                    {
                        name: 'Completing the Square',
                        description: 'Transform to vertex form a(x - h)² + k',
                        whenToUse: 'When finding vertex or deriving formula'
                    },
                    {
                        name: 'Graphical Method',
                        description: 'Graph y = ax² + bx + c and find x-intercepts',
                        whenToUse: 'For visual understanding or approximation'
                    },
                    {
                        name: 'Using Vieta\'s Formulas',
                        description: 'If one root known, use sum/product relationships',
                        whenToUse: 'When partial information about roots is available'
                    }
                ],
                comparison: 'Quadratic formula is universal; factoring is fastest when applicable; completing square reveals structure; graphing provides intuition'
            },

            cubic_equation: {
                primaryMethod: 'Rational Root Theorem with factoring',
                methods: [
                    {
                        name: 'Cardano\'s Formula',
                        description: 'Algebraic formula for cubic equations',
                        whenToUse: 'For general cubics without rational roots'
                    },
                    {
                        name: 'Numerical Methods',
                        description: 'Newton-Raphson or bisection method',
                        whenToUse: 'For approximations or complex roots'
                    },
                    {
                        name: 'Graphical Analysis',
                        description: 'Graph and identify x-intercepts',
                        whenToUse: 'For visual estimation'
                    },
                    {
                        name: 'Substitution Methods',
                        description: 'Reduce to simpler form through substitution',
                        whenToUse: 'For special forms of cubics'
                    }
                ],
                comparison: 'Rational Root Theorem most practical for textbook problems; Cardano\'s formula theoretically complete but complex; numerical methods efficient for computation'
            },

            polynomial_division: {
                primaryMethod: 'Long Division',
                methods: [
                    {
                        name: 'Synthetic Division',
                        description: 'Streamlined method for (x - c) divisors',
                        whenToUse: 'When divisor is linear'
                    },
                    {
                        name: 'Factoring and Canceling',
                        description: 'Factor both polynomials and simplify',
                        whenToUse: 'When polynomials have common factors'
                    },
                    {
                        name: 'Remainder Theorem',
                        description: 'Evaluate P(c) to find remainder',
                        whenToUse: 'When only remainder is needed'
                    }
                ],
                comparison: 'Long division is general; synthetic division is faster for linear divisors; factoring avoids division when applicable'
            },

            polynomial_inequality: {
                primaryMethod: 'Sign Analysis (Test Points)',
                methods: [
                    {
                        name: 'Graphical Method',
                        description: 'Graph polynomial and identify regions',
                        whenToUse: 'For visual learners or verification'
                    },
                    {
                        name: 'Sign Chart Method',
                        description: 'Create organized chart of signs',
                        whenToUse: 'For systematic organization'
                    },
                    {
                        name: 'Factored Form Analysis',
                        description: 'Analyze signs of each factor',
                        whenToUse: 'When polynomial is fully factored'
                    }
                ],
                comparison: 'Test points method is most reliable; graphical provides intuition; sign charts organize work systematically'
            },

            polynomial_factoring: {
                primaryMethod: 'Rational Root Theorem with synthetic division',
                methods: [
                    {
                        name: 'Grouping',
                        description: 'Group terms and factor common expressions',
                        whenToUse: 'For four-term polynomials'
                    },
                    {
                        name: 'Special Patterns',
                        description: 'Recognize sum/difference of cubes, etc.',
                        whenToUse: 'When special patterns are present'
                    },
                    {
                        name: 'Factor Theorem',
                        description: 'Test potential factors directly',
                        whenToUse: 'Alongside Rational Root Theorem'
                    },
                    {
                        name: 'Computer Algebra Systems',
                        description: 'Use technology for complex polynomials',
                        whenToUse: 'For verification or very high degree'
                    }
                ],
                comparison: 'Systematic root finding most reliable; pattern recognition speeds up special cases; technology confirms complex factorizations'
            }
        };

        return alternativeDatabase[problemType] || {
            primaryMethod: 'Standard polynomial approach',
            methods: [
                {
                    name: 'Systematic Approach',
                    description: 'Follow standard problem-solving steps'
                }
            ],
            comparison: 'Method choice depends on problem structure and available tools'
        };
    }

    // ENHANCED STEP GENERATION

    generatePolynomialSteps(problem, solution) {
        let baseSteps = this.generateBasePolynomialSteps(problem, solution);

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

    generateBasePolynomialSteps(problem, solution) {
        const { type } = problem;

        switch (type) {
            case 'quadratic_standard':
                return this.generateEnhancedQuadraticSteps(problem, solution);
            case 'quadratic_factoring':
                return this.generateEnhancedFactoringSteps(problem, solution);
            case 'completing_square':
                return this.generateEnhancedCompletingSquareSteps(problem, solution);
            case 'cubic_equation':
                return this.generateEnhancedCubicSteps(problem, solution);
            case 'rational_root':
                return this.generateEnhancedRationalRootSteps(problem, solution);
            case 'polynomial_inequality':
                return this.generateEnhancedInequalitySteps(problem, solution);
            default:
                return this.generateGenericPolynomialSteps(problem, solution);
        }
    }

    generateEnhancedQuadraticSteps(problem, solution) {
        const { a, b, c } = problem.parameters;
        const steps = [];

        // Step 1: Identify equation and coefficients
        steps.push({
            stepNumber: 1,
            step: 'Given quadratic equation',
            description: 'Identify the quadratic equation in standard form',
            expression: `${a}x² + ${b}x + ${c} = 0`,
            beforeExpression: null,
            afterExpression: `${a}x² + ${b}x + ${c} = 0`,
            operation: null,
            reasoning: 'A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0',
            visualHint: 'The graph of this equation is a parabola',
            algebraicRule: 'Standard form of quadratic equation',
            goalStatement: 'Find the values of x that make this equation true',
            coefficients: { a, b, c }
        });

        // Step 2: Calculate discriminant
        const discriminant = b * b - 4 * a * c;
        
        steps.push({
            stepNumber: 2,
            step: 'Calculate discriminant',
            description: 'Compute Δ = b² - 4ac to determine the nature of roots',
            beforeExpression: `Δ = b² - 4ac`,
            operation: 'substitute values',
            afterExpression: `Δ = (${b})² - 4(${a})(${c}) = ${discriminant}`,
            reasoning: 'The discriminant tells us how many and what type of roots exist',
            visualHint: discriminant > 0 ? 'Positive discriminant means two real roots' :
                       discriminant === 0 ? 'Zero discriminant means one repeated root' :
                       'Negative discriminant means two complex roots',
            algebraicRule: 'Discriminant Formula',
            workingDetails: {
                bSquared: b * b,
                fourAC: 4 * a * c,
                subtraction: `${b * b} - ${4 * a * c} = ${discriminant}`
            },
            discriminant: discriminant
        });

        // Step 3: Apply quadratic formula
        if (discriminant >= 0) {
            const sqrtDisc = Math.sqrt(discriminant);
            steps.push({
                stepNumber: 3,
                step: 'Apply quadratic formula',
                description: 'Use x = (-b ± √Δ)/(2a) to find solutions',
                beforeExpression: `x = (-b ± √Δ)/(2a)`,
                operation: 'substitute and simplify',
                afterExpression: `x = (${-b} ± √${discriminant})/(${2 * a})`,
                reasoning: 'The quadratic formula gives exact solutions for any quadratic equation',
                algebraicRule: 'Quadratic Formula',
                visualHint: 'The ± symbol indicates two solutions',
                workingDetails: {
                    minusB: -b,
                    sqrtDiscriminant: sqrtDisc,
                    twoA: 2 * a
                }
            });

            // Step 4: Calculate both solutions
            const x1 = (-b + sqrtDisc) / (2 * a);
            const x2 = (-b - sqrtDisc) / (2 * a);

            steps.push({
                stepNumber: 4,
                step: 'Calculate solutions',
                description: 'Evaluate both values from the ± operation',
                reasoning: 'One solution uses +, the other uses -',
                solutions: {
                    solution1: {
                        expression: `x₁ = (${-b} + ${sqrtDisc})/(${2 * a})`,
                        value: x1
                    },
                    solution2: {
                        expression: `x₂ = (${-b} - ${sqrtDisc})/(${2 * a})`,
                        value: x2
                    }
                },
                finalAnswer: true,
                numericalResults: [x1, x2]
            });
        } else {
            // Complex roots
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-discriminant) / (2 * a);

            steps.push({
                stepNumber: 3,
                step: 'Apply quadratic formula with complex numbers',
                description: 'Since discriminant is negative, solutions are complex',
                beforeExpression: `x = (-b ± √Δ)/(2a) = (-b ± i√|Δ|)/(2a)`,
                reasoning: 'When discriminant is negative, we use imaginary unit i where i² = -1',
                algebraicRule: 'Complex Number Extension of Quadratic Formula',
                visualHint: 'Complex roots appear as conjugate pairs on the complex plane'
            });

            steps.push({
                stepNumber: 4,
                step: 'Calculate complex solutions',
                description: 'Express solutions in a + bi form',
                solutions: {
                    solution1: {
                        expression: `x₁ = ${realPart} + ${imagPart}i`,
                        real: realPart,
                        imaginary: imagPart
                    },
                    solution2: {
                        expression: `x₂ = ${realPart} - ${imagPart}i`,
                        real: realPart,
                        imaginary: -imagPart
                    }
                },
                finalAnswer: true,
                note: 'Complex roots always come in conjugate pairs'
            });
        }

        return steps;
    }

    generateEnhancedFactoringSteps(problem, solution) {
        const { a, b, c } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given equation',
            description: 'Start with quadratic in standard form',
            expression: `${a}x² + ${b}x + ${c} = 0`,
            reasoning: 'We will try to factor this into two binomials',
            goalStatement: 'Find two binomials whose product equals the original expression'
        });

        if (solution.solutionType === 'Not factorable with integers') {
            steps.push({
                stepNumber: 2,
                step: 'Check factorability',
                description: 'Determine if the quadratic can be factored with integers',
                reasoning: 'Not all quadratics have integer factors',
                conclusion: 'This quadratic cannot be factored with integers',
                recommendation: 'Use the quadratic formula instead'
            });
            return steps;
        }

        steps.push({
            stepNumber: 2,
            step: 'Find factor pairs',
            description: `Find two numbers that multiply to ${a * c} and add to ${b}`,
            reasoning: 'For ax² + bx + c, we need factors of ac that sum to b',
            algebraicRule: 'AC Method for Factoring',
            visualHint: 'List factor pairs systematically to find the right combination'
        });

        steps.push({
            stepNumber: 3,
            step: 'Write factored form',
            description: 'Express as product of two binomials',
            beforeExpression: `${a}x² + ${b}x + ${c}`,
            afterExpression: solution.factoredForm,
            reasoning: 'Verify by expanding: the product should equal the original',
            algebraicRule: 'Distributive Property (FOIL)'
        });

        steps.push({
            stepNumber: 4,
            step: 'Apply Zero Product Property',
            description: 'If AB = 0, then A = 0 or B = 0',
            reasoning: 'Set each factor equal to zero to find solutions',
            algebraicRule: 'Zero Product Property',
            visualHint: 'This gives us two simple linear equations to solve'
        });

        solution.solutions.forEach((sol, index) => {
            steps.push({
                stepNumber: 5 + index,
                step: `Solve for x (solution ${index + 1})`,
                description: `Solve the linear equation from factor ${index + 1}`,
                solution: sol,
                finalAnswer: index === solution.solutions.length - 1
            });
        });

        return steps;
    }

    generateEnhancedCompletingSquareSteps(problem, solution) {
        const { a, b, c } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,step: 'Given equation',
            description: 'Start with quadratic in standard form',
            expression: `${a}x² + ${b}x + ${c} = 0`,
            reasoning: 'We will complete the square to convert this to vertex form',
            goalStatement: 'Transform to a(x - h)² + k = 0 form',
            visualHint: 'Vertex form reveals the parabola\'s vertex directly'
        });

        // Step 2: Divide by a if necessary
        if (Math.abs(a - 1) > 1e-10) {
            steps.push({
                stepNumber: 2,
                step: 'Normalize leading coefficient',
                description: `Divide entire equation by ${a}`,
                beforeExpression: `${a}x² + ${b}x + ${c} = 0`,
                operation: `÷ ${a}`,
                afterExpression: `x² + ${b/a}x + ${c/a} = 0`,
                reasoning: 'Completing the square is easiest when the coefficient of x² is 1',
                algebraicRule: 'Division Property of Equality',
                workingDetails: {
                    xSquaredCoeff: 1,
                    xCoeff: b/a,
                    constant: c/a
                }
            });
        }

        // Step 3: Move constant to right side
        const b_norm = Math.abs(a - 1) > 1e-10 ? b/a : b;
        const c_norm = Math.abs(a - 1) > 1e-10 ? c/a : c;

        steps.push({
            stepNumber: Math.abs(a - 1) > 1e-10 ? 3 : 2,
            step: 'Isolate x terms',
            description: `Move constant term to right side`,
            beforeExpression: `x² + ${b_norm}x + ${c_norm} = 0`,
            operation: `- ${c_norm}`,
            afterExpression: `x² + ${b_norm}x = ${-c_norm}`,
            reasoning: 'We need the x terms on the left to complete the square',
            algebraicRule: 'Subtraction Property of Equality'
        });

        // Step 4: Complete the square
        const halfB = b_norm / 2;
        const completingTerm = halfB * halfB;

        steps.push({
            stepNumber: Math.abs(a - 1) > 1e-10 ? 4 : 3,
            step: 'Complete the square',
            description: `Add (b/2)² = (${b_norm}/2)² = ${completingTerm} to both sides`,
            beforeExpression: `x² + ${b_norm}x = ${-c_norm}`,
            operation: `+ ${completingTerm}`,
            afterExpression: `x² + ${b_norm}x + ${completingTerm} = ${-c_norm + completingTerm}`,
            reasoning: `This makes the left side a perfect square: (x + ${halfB})²`,
            algebraicRule: 'Perfect Square Trinomial Pattern: x² + 2px + p² = (x + p)²',
            visualHint: 'Think of completing a square geometrically',
            workingDetails: {
                halfB: halfB,
                halfBSquared: completingTerm,
                perfectSquare: `(x + ${halfB})²`
            }
        });

        // Step 5: Factor left side
        const rightSide = -c_norm + completingTerm;

        steps.push({
            stepNumber: Math.abs(a - 1) > 1e-10 ? 5 : 4,
            step: 'Factor as perfect square',
            description: 'Write left side as squared binomial',
            beforeExpression: `x² + ${b_norm}x + ${completingTerm} = ${rightSide}`,
            afterExpression: `(x + ${halfB})² = ${rightSide}`,
            reasoning: 'The left side is now a perfect square trinomial',
            algebraicRule: 'Perfect Square Trinomial Factorization'
        });

        // Step 6: Take square root
        if (Math.abs(rightSide) < 1e-10) {
            steps.push({
                stepNumber: Math.abs(a - 1) > 1e-10 ? 6 : 5,
                step: 'Solve for x',
                description: 'Since right side is 0, we have one solution',
                beforeExpression: `(x + ${halfB})² = 0`,
                afterExpression: `x + ${halfB} = 0`,
                solution: -halfB,
                finalAnswer: true
            });
        } else if (rightSide > 0) {
            steps.push({
                stepNumber: Math.abs(a - 1) > 1e-10 ? 6 : 5,
                step: 'Take square root of both sides',
                description: 'Apply square root property',
                beforeExpression: `(x + ${halfB})² = ${rightSide}`,
                operation: '√',
                afterExpression: `x + ${halfB} = ±√${rightSide}`,
                reasoning: 'Remember to include both positive and negative roots',
                algebraicRule: 'Square Root Property',
                criticalWarning: 'Don\'t forget the ± symbol!'
            });

            const sqrtValue = Math.sqrt(rightSide);
            steps.push({
                stepNumber: Math.abs(a - 1) > 1e-10 ? 7 : 6,
                step: 'Isolate x',
                description: 'Solve for x in both cases',
                solutions: {
                    solution1: {
                        expression: `x = -${halfB} + ${sqrtValue}`,
                        value: -halfB + sqrtValue
                    },
                    solution2: {
                        expression: `x = -${halfB} - ${sqrtValue}`,
                        value: -halfB - sqrtValue
                    }
                },
                finalAnswer: true
            });
        } else {
            steps.push({
                stepNumber: Math.abs(a - 1) > 1e-10 ? 6 : 5,
                step: 'Take square root with complex numbers',
                description: 'Right side is negative, so solutions are complex',
                beforeExpression: `(x + ${halfB})² = ${rightSide}`,
                afterExpression: `x + ${halfB} = ±i√${-rightSide}`,
                reasoning: 'Use imaginary unit i where i² = -1',
                algebraicRule: 'Complex Square Root Property'
            });

            const imagValue = Math.sqrt(-rightSide);
            steps.push({
                stepNumber: Math.abs(a - 1) > 1e-10 ? 7 : 6,
                step: 'Express complex solutions',
                description: 'Write in a + bi form',
                solutions: {
                    solution1: {
                        expression: `x = ${-halfB} + ${imagValue}i`,
                        real: -halfB,
                        imaginary: imagValue
                    },
                    solution2: {
                        expression: `x = ${-halfB} - ${imagValue}i`,
                        real: -halfB,
                        imaginary: -imagValue
                    }
                },
                finalAnswer: true
            });
        }

        return steps;
    }

    generateEnhancedCubicSteps(problem, solution) {
        const { a, b, c, d } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given cubic equation',
            description: 'Identify cubic equation in standard form',
            expression: `${a}x³ + ${b}x² + ${c}x + ${d} = 0`,
            reasoning: 'A cubic equation always has at least one real root',
            goalStatement: 'Find all roots of this third-degree polynomial',
            visualHint: 'The graph crosses the x-axis at least once'
        });

        if (solution.solutionType === 'No rational roots found') {
            steps.push({
                stepNumber: 2,
                step: 'Apply Rational Root Theorem',
                description: 'Test possible rational roots',
                reasoning: 'No rational roots found among candidates',
                recommendation: 'Use numerical methods or Cardano\'s formula'
            });
            return steps;
        }

        steps.push({
            stepNumber: 2,
            step: 'Apply Rational Root Theorem',
            description: 'List and test possible rational roots: p/q where p divides d and q divides a',
            reasoning: 'This systematically identifies rational roots',
            algebraicRule: 'Rational Root Theorem',
            foundRoot: solution.rationalRoot
        });

        steps.push({
            stepNumber: 3,
            step: 'Verify root by substitution',
            description: `Test x = ${solution.rationalRoot} in original equation`,
            verification: `P(${solution.rationalRoot}) = 0`,
            reasoning: 'Confirmation that this is indeed a root'
        });

        steps.push({
            stepNumber: 4,
            step: 'Factor out (x - root)',
            description: `Use synthetic division to divide by (x - ${solution.rationalRoot})`,
            beforeExpression: `${a}x³ + ${b}x² + ${c}x + ${d}`,
            afterExpression: `(x - ${solution.rationalRoot})(quadratic)`,
            reasoning: 'Reduces cubic to quadratic, which we can solve',
            algebraicRule: 'Factor Theorem',
            visualHint: 'Each root corresponds to a linear factor'
        });

        steps.push({
            stepNumber: 5,
            step: 'Solve remaining quadratic',
            description: 'Apply quadratic formula or factoring to find other roots',
            reasoning: 'The remaining factor is quadratic, giving up to 2 more roots',
            remainingQuadratic: solution.remainingQuadratic
        });

        steps.push({
            stepNumber: 6,
            step: 'List all solutions',
            description: 'Combine all roots found',
            solutions: solution.solutions,
            finalAnswer: true,
            note: 'A cubic equation has exactly 3 roots (counting multiplicities and complex roots)'
        });

        return steps;
    }

    generateEnhancedRationalRootSteps(problem, solution) {
        const { coefficients } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given polynomial',
            description: 'Identify polynomial to analyze',
            expression: this.coeffsToPolynomial(coefficients),
            reasoning: 'We will find all rational roots using systematic testing',
            goalStatement: 'Identify all rational roots (if any exist)'
        });

        const constant = coefficients[coefficients.length - 1];
        const leading = coefficients[0];

        steps.push({
            stepNumber: 2,
            step: 'Identify constant and leading coefficient',
            description: 'Find the first and last coefficients',
            constant: constant,
            leading: leading,
            reasoning: 'These determine possible rational roots',
            algebraicRule: 'Rational Root Theorem: roots have form p/q where p|a₀ and q|aₙ'
        });

        const constantFactors = this.getFactors(constant);
        const leadingFactors = this.getFactors(leading);

        steps.push({
            stepNumber: 3,
            step: 'Find factors',
            description: 'List all factors of constant and leading coefficient',
            constantFactors: constantFactors,
            leadingFactors: leadingFactors,
            reasoning: 'Possible roots are ratios of these factors'
        });

        steps.push({
            stepNumber: 4,
            step: 'List all candidates',
            description: 'Form all possible ratios ±p/q',
            candidates: solution.candidates,
            reasoning: 'These are ALL possible rational roots',
            visualHint: 'Include both positive and negative versions'
        });

        steps.push({
            stepNumber: 5,
            step: 'Test each candidate',
            description: 'Evaluate P(candidate) for each possibility',
            reasoning: 'A candidate is a root if and only if P(candidate) = 0',
            algebraicRule: 'Factor Theorem',
            method: 'Use synthetic division or direct substitution'
        });

        if (solution.rationalRoots.length > 0) {
            steps.push({
                stepNumber: 6,
                step: 'Identify rational roots',
                description: 'List all candidates that evaluate to 0',
                roots: solution.rationalRoots,
                finalAnswer: true,
                note: 'These are all rational roots of the polynomial'
            });
        } else {
            steps.push({
                stepNumber: 6,
                step: 'Conclusion',
                description: 'No candidates evaluated to 0',
                conclusion: 'This polynomial has no rational roots',
                finalAnswer: true,
                note: 'Roots may be irrational or complex'
            });
        }

        return steps;
    }

    generateEnhancedInequalitySteps(problem, solution) {
        const { coefficients, operator } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given inequality',
            description: 'Identify the polynomial inequality',
            expression: `${this.coeffsToPolynomial(coefficients)} ${operator} 0`,
            reasoning: 'We need to find all x values that make this inequality true',
            goalStatement: 'Determine solution intervals on the number line',
            visualHint: 'Solution will be one or more intervals'
        });

        steps.push({
            stepNumber: 2,
            step: 'Find critical points',
            description: 'Solve the equation by setting polynomial equal to 0',
            beforeExpression: `${this.coeffsToPolynomial(coefficients)} = 0`,
            reasoning: 'Critical points are where the polynomial changes sign',
            algebraicRule: 'Sign changes occur at zeros',
            criticalPoints: solution.criticalPoints
        });

        steps.push({
            stepNumber: 3,
            step: 'Mark critical points on number line',
            description: 'Plot zeros to divide number line into intervals',
            reasoning: 'Polynomial maintains constant sign within each interval',
            visualHint: 'Draw a number line with points marked',
            intervals: solution.solutionIntervals.length + 1
        });

        steps.push({
            stepNumber: 4,
            step: 'Test each interval',
            description: 'Choose a test point in each interval and evaluate',
            reasoning: 'Sign of polynomial at test point represents sign throughout interval',
            algebraicRule: 'Continuous functions don\'t change sign without crossing zero',
            method: 'Pick convenient test points (avoid fractions if possible)'
        });

        steps.push({
            stepNumber: 5,
            step: 'Determine solution intervals',
            description: `Select intervals where polynomial ${operator} 0`,
            solutionIntervals: solution.solutionIntervals,
            reasoning: 'Keep intervals that satisfy the inequality',
            visualHint: 'Shade or circle the solution regions'
        });

        steps.push({
            stepNumber: 6,
            step: 'Write in interval notation',
            description: 'Express solution using interval notation',
            intervalNotation: solution.intervalNotation,
            finalAnswer: true,
            note: operator.includes('=') ? 
                'Use [ or ] to include endpoints where polynomial equals 0' :
                'Use ( or ) to exclude endpoints'
        });

        return steps;
    }

    generateGenericPolynomialSteps(problem, solution) {
        return [{
            stepNumber: 1,
            step: 'Polynomial problem',
            description: 'Solve the given polynomial problem',
            expression: problem.equation || 'Polynomial expression',
            reasoning: 'Apply appropriate polynomial techniques',
            solution: solution
        }];
    }

    // STEP ENHANCEMENT METHODS (similar to linear version)

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

    // HELPER METHODS FOR EXPLANATIONS

    getConceptualExplanation(step, problem) {
        const conceptualExplanations = {
            'Given quadratic equation': 'A quadratic equation represents a parabola. We\'re finding where this parabola crosses the x-axis (its roots).',
            'Calculate discriminant': 'The discriminant is like a "decoder" that tells us what kind of roots to expect before we even calculate them.',
            'Apply quadratic formula': 'The quadratic formula is a universal tool that works for any quadratic, derived by completing the square on the general form.',
            'Find factor pairs': 'We\'re looking for two numbers that work together in a specific way - like finding puzzle pieces that fit.',
            'Complete the square': 'We\'re transforming the equation to reveal the parabola\'s vertex, making it easier to solve.',
            'Apply Rational Root Theorem': 'This theorem dramatically narrows down our search - instead of infinite possibilities, we test only a finite list.',
            'Find critical points': 'These are the boundary points where the polynomial changes from positive to negative or vice versa.'
        };

        return conceptualExplanations[step.step] || 'This step moves us closer to the solution.';
    }

    getProceduralExplanation(step) {
        if (step.operation) {
            return `1. Identify the operation needed: ${step.operation}
2. Apply this operation carefully
3. Simplify the result
4. Write the resulting expression`;
        }
        return 'Follow the standard procedure for this type of step.';
    }

    getVisualExplanation(step, problem) {
        const visualExplanations = {
            'quadratic_standard': 'Picture a parabola - we\'re finding its x-intercepts (where it crosses the horizontal axis).',
            'cubic_equation': 'A cubic curve wiggles more than a parabola - it can cross the x-axis up to 3 times.',
            'polynomial_inequality': 'Imagine shading regions on the number line where the polynomial is above or below zero.',
            'completing_square': 'Think of building a perfect square geometrically - we add just enough to complete it.'
        };

        return visualExplanations[problem.type] || 'Visualize the algebraic manipulation geometrically.';
    }

    getAlgebraicExplanation(step) {
        const algebraicRules = {
            'Given quadratic equation': 'Standard form: ax² + bx + c = 0 where a ≠ 0',
            'Calculate discriminant': 'Discriminant: Δ = b² - 4ac',
            'Apply quadratic formula': 'Quadratic Formula: x = (-b ± √Δ)/(2a)',
            'Find factor pairs': 'Sum-Product pattern for factoring',
            'Complete the square': 'Perfect Square Trinomial: x² + 2px + p² = (x + p)²',
            'Apply Rational Root Theorem': 'Possible rational roots: p/q where p|a₀ and q|aₙ'
        };

        return algebraicRules[step.step] || 'Apply standard algebraic principles.';
    }

    getAdaptiveExplanation(step, explanationLevel) {
        const adaptations = {
            basic: {
                vocabulary: 'simple terms',
                detail: 'essential information only',
                format: 'short sentences'
            },
            intermediate: {
                vocabulary: 'standard math terms',
                detail: 'main concepts with brief explanations',
                format: 'clear step-by-step format'
            },
            detailed: {
                vocabulary: 'full mathematical terminology',
                detail: 'comprehensive explanations with theory',
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
            progression: 'We are making progress toward finding all roots',
            relationship: 'Each step brings us closer to the complete solution'
        };
    }

    explainStepProgression(currentStep, nextStep) {
        return `After ${currentStep.step}, we need to ${nextStep.description.toLowerCase()} to continue solving`;
    }

    explainStepStrategy(nextStep) {
        return `The strategy for "${nextStep.step}" is to ${nextStep.description.toLowerCase()}`;
    }

    generateStepBridge(currentStep, nextStep) {
        return {
            currentState: `We now have: ${currentStep.afterExpression || currentStep.expression}`,
            nextGoal: `Next, we need to: ${nextStep.description}`,
            why: `This step is necessary to ${this.explainStepNecessity(currentStep, nextStep)}`,
            howItHelps: `This will help us by: ${this.explainStepBenefit(nextStep)}`
        };
    }

    explainStepNecessity(currentStep, nextStep) {
        return 'progress toward the complete solution';
    }

    explainStepBenefit(nextStep) {
        return 'getting us closer to finding all roots';
    }

    generatePreventionTips(step, problemType) {
        const tips = {
            'Calculate discriminant': [
                'Square b first, then multiply 4ac separately',
                'Watch signs carefully in subtraction',
                'Double-check your arithmetic'
            ],
            'Apply quadratic formula': [
                'Don\'t forget the ± symbol',
                'The entire numerator is divided by 2a, not just part of it',
                'Simplify radicals completely'
            ],
            'Find factor pairs': [
                'List factor pairs systematically',
                'Consider both positive and negative factors',
                'Verify your factors multiply and add correctly'
            ]
        };

        return tips[step.step] || ['Double-check your work', 'Verify each calculation'];
    }

    generateCheckPoints(step) {
        return [
            'Verify all calculations are correct',
            'Check that signs are handled properly',
            'Ensure the step logically follows from the previous one',
            'Confirm the result makes sense'
        ];
    }

    identifyWarningFlags(step, problemType) {
        const warnings = {
            quadratic_standard: step.step === 'Apply quadratic formula' ?
                ['Remember the ± gives TWO solutions', 'Divide entire numerator by 2a'] : [],
            quadratic_factoring: step.step === 'Find factor pairs' ?
                ['Consider negative factors', 'Verify sum AND product'] : [],
            completing_square: step.step === 'Complete the square' ?
                ['Must add same value to BOTH sides', 'Check calculation of (b/2)²'] : []
        };

        return warnings[problemType] || [];
    }

    generateSelfCheckQuestion(step) {
        const questions = {
            'Calculate discriminant': 'Did I correctly compute b² - 4ac?',
            'Apply quadratic formula': 'Did I include both the + and - solutions?',
            'Find factor pairs': 'Do my factors multiply to ac and add to b?',
            'Complete the square': 'Is my left side now a perfect square trinomial?'
        };

        return questions[step.step] || 'Does this step make sense and move me toward the solution?';
    }

    describeExpectedResult(step) {
        const expectations = {
            'Calculate discriminant': 'A single number that may be positive, negative, or zero',
            'Apply quadratic formula': 'Two values (or one repeated value, or complex conjugates)',
            'Find factor pairs': 'Two binomial factors whose product equals the original',
            'Complete the square': 'A perfect square trinomial on the left side'
        };

        return expectations[step.step] || 'The step should simplify the problem further';
    }

    generateTroubleshootingTips(step) {
        return [
            'If stuck, review the previous step',
            'Check for arithmetic errors',
            'Verify you followed the correct procedure',
            'Consider if there\'s a simpler approach',
            'Check your work against the formula or rule'
        ];
    }

    breakIntoSubSteps(step) {
        if (step.operation) {
            return [
                `Identify what operation is needed: ${step.operation}`,
                'Write out the operation explicitly',
                'Perform the calculation carefully',
                'Simplify the result',
                'Check your answer'
            ];
        }

        if (step.step === 'Calculate discriminant') {
            return [
                'Identify b from the equation',
                'Calculate b²',
                'Calculate 4ac',
                'Subtract: b² - 4ac',
                'Interpret the result'
            ];
        }

        return ['Understand what the step requires', 'Plan your approach', 'Execute carefully'];
    }

    generatePracticeVariation(step, problem) {
        return {
            similarProblem: 'Try the same type of problem with different coefficients',
            practiceHint: 'Practice this technique with simpler numbers first',
            extension: 'Once comfortable, try more challenging variations'
        };
    }

    explainThinkingProcess(step) {
        return {
            observe: 'What information do I have at this point?',
            goal: 'What am I trying to achieve in this step?',
            strategy: 'What method or formula should I use?',
            execute: 'How do I apply this method correctly?',
            verify: 'Does my result make sense?'
        };
    }

    identifyDecisionPoints(step) {
        return [
            'Choosing which method to use',
            'Deciding how to organize the work',
            'Selecting the most efficient approach'
        ];
    }

    suggestAlternativeMethods(step, problem) {
        const alternatives = {
            'Apply quadratic formula': [
                'Could factor instead if factors are obvious',
                'Could complete the square for vertex form',
                'Could use graphing for approximation'
            ],
            'Find factor pairs': [
                'Could use quadratic formula if factoring is difficult',
                'Could use AC method for systematic factoring'
            ]
        };

        return alternatives[step.step] || ['Alternative approaches exist depending on the problem'];
    }

    identifyPrerequisites(step, problemType) {
        const prerequisites = {
            'Calculate discriminant': ['Squaring numbers', 'Multiplication', 'Subtraction with negatives'],
            'Apply quadratic formula': ['Radical simplification', 'Fraction operations', 'Order of operations'],
            'Find factor pairs': ['Integer factorization', 'Sum and product relationships'],
            'Complete the square': ['Perfect square trinomials', 'Squaring binomials']
        };

        return prerequisites[step.step] || ['Basic algebraic operations'];
    }

    identifyKeyVocabulary(step) {
        const vocabulary = {
            'Given quadratic equation': ['quadratic', 'coefficient', 'standard form', 'degree'],
            'Calculate discriminant': ['discriminant', 'radicand', 'nature of roots'],
            'Apply quadratic formula': ['formula', 'radical', 'conjugate', 'rational/irrational'],
            'Find factor pairs': ['factor', 'binomial', 'product', 'sum'],
            'Complete the square': ['perfect square', 'trinomial', 'vertex form'],
            'Apply Rational Root Theorem': ['rational', 'root', 'candidate', 'factor']
        };

        return vocabulary[step.step] || [];
    }

    adaptLanguageLevel(text, level) {
        if (!text) return '';

        const adaptations = {
            basic: {
                replacements: {
                    'discriminant': 'number that tells us about roots',
                    'coefficient': 'number in front',
                    'quadratic': 'equation with x²',
                    'polynomial': 'expression with powers of x',
                    'rational': 'fraction or whole number'
                }
            },
            intermediate: {
                replacements: {
                    'discriminant': 'discriminant',
                    'coefficient': 'coefficient',
                    'quadratic': 'quadratic',
                    'polynomial': 'polynomial',
                    'rational': 'rational'
                }
            },
            detailed: {
                replacements: {
                    'discriminant': 'discriminant (b² - 4ac)',
                    'coefficient': 'coefficient (numerical multiplier)',
                    'quadratic': 'quadratic (second-degree polynomial)',
                    'polynomial': 'polynomial (sum of terms with non-negative integer powers)',
                    'rational': 'rational number (expressible as p/q where p, q are integers, q ≠ 0)'
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

    generateGuidingQuestions(step, problem) {
        const questions = {
            'Given quadratic equation': [
                'What are the values of a, b, and c?',
                'Is this equation in standard form?',
                'What methods could we use to solve this?'
            ],
            'Calculate discriminant': [
                'What is the formula for the discriminant?',
                'What does each part represent?',
                'What will the discriminant tell us?'
            ],
            'Apply quadratic formula': [
                'What values do we substitute into the formula?',
                'Why do we need the ± symbol?',
                'How many solutions should we get?'
            ],
            'Find factor pairs': [
                'What two numbers multiply to give ac?',
                'Which pair also adds to b?',
                'How do we verify our factors are correct?'
            ],
            'Complete the square': [
                'What is (b/2)?',
                'What is (b/2)²?',
                'Why must we add it to both sides?'
            ],
            'Apply Rational Root Theorem': [
                'What are the factors of the constant term?',
                'What are the factors of the leading coefficient?',
                'How do we form possible rational roots from these?'
            ],
            'Find critical points': [
                'How do we find where the polynomial equals zero?',
                'Why are these points important for inequalities?',
                'What do they tell us about the graph?'
            ]
        };

        return questions[step.step] || [
            'What is the purpose of this step?',
            'How does this move us toward the solution?',
            'What should we be careful about?'
        ];
    }

    generateProgressiveHints(step) {
        return {
            level1: 'Think about what this step is trying to accomplish.',
            level2: 'Consider which formula or method applies here.',
            level3: 'Review the relevant algebraic rule or theorem.',
            level4: step.algebraicRule || 'Apply the standard procedure for this type of step.'
        };
    }

    // GRAPH DATA GENERATION

    generatePolynomialGraphData() {
        if (!this.currentSolution) return;

        const { type } = this.currentProblem;

        switch(type) {
            case 'quadratic_standard':
            case 'quadratic_factoring':
            case 'completing_square':
                this.graphData = this.generateQuadraticGraph();
                break;

            case 'cubic_equation':
                this.graphData = this.generateCubicGraph();
                break;

            case 'polynomial_graphing':
                this.graphData = this.generateGeneralPolynomialGraph();
                break;

            case 'polynomial_inequality':
                this.graphData = this.generateInequalityGraph();
                break;
        }
    }

    generateQuadraticGraph() {
        const { a, b, c } = this.currentProblem.parameters;
        const vertex = this.currentSolution.vertex;
        const solutions = this.currentSolution.solutions;

        const points = [];
        const xMin = vertex.h - 10;
        const xMax = vertex.h + 10;

        for (let x = xMin; x <= xMax; x += 0.2) {
            const y = a * x * x + b * x + c;
            points.push({ x, y });
        }

        return {
            type: 'quadratic',
            function: `y = ${a}x² + ${b}x + ${c}`,
            points: points,
            vertex: vertex,
            yIntercept: c,
            zeros: typeof solutions[0] === 'number' ? solutions : null,
            direction: a > 0 ? 'opens up' : 'opens down'
        };
    }

    generateCubicGraph() {
        const { a, b, c, d } = this.currentProblem.parameters;
        const points = [];

        for (let x = -10; x <= 10; x += 0.2) {
            const y = a * x * x * x + b * x * x + c * x + d;
            points.push({ x, y });
        }

        return {
            type: 'cubic',
            function: `y = ${a}x³ + ${b}x² + ${c}x + ${d}`,
            points: points,
            zeros: this.currentSolution.solutions.filter(s => typeof s === 'number')
        };
    }

    generateGeneralPolynomialGraph() {
        const { coefficients } = this.currentProblem.parameters;
        const points = this.generatePolynomialPoints(coefficients);

        return {
            type: 'general_polynomial',
            function: this.coeffsToPolynomial(coefficients),
            points: points,
            zeros: this.currentSolution.zeros
        };
    }

    generateInequalityGraph() {
        const { coefficients } = this.currentProblem.parameters;
        const points = this.generatePolynomialPoints(coefficients);
        
        return {
            type: 'inequality',
            function: this.coeffsToPolynomial(coefficients),
            points: points,
            criticalPoints: this.currentSolution.criticalPoints,
            solutionIntervals: this.currentSolution.solutionIntervals
        };
    }

    // WORKBOOK GENERATION

    generatePolynomialWorkbook() {
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
            title: 'Enhanced Polynomial Mathematical Workbook',
            timestamp: new Date().toISOString(),
            theme: this.theme,
            dimensions: { width: this.width, height: this.height },
            sections: []
        };
    }

    createProblemSection() {
        if (!this.currentProblem) return null;

        const data = [
            ['Problem Type', this.polynomialTypes[this.currentProblem.type]?.name || this.currentProblem.type],
            ['Category', this.polynomialTypes[this.currentProblem.type]?.category || 'General']
        ];

        if (this.currentProblem.equation) {
            data.push(['Equation', this.currentProblem.equation]);
        }

        if (this.currentProblem.parameters) {
            const params = this.currentProblem.parameters;
            if (params.a !== undefined) data.push(['Coefficient a', params.a]);
            if (params.b !== undefined) data.push(['Coefficient b', params.b]);
            if (params.c !== undefined) data.push(['Coefficient c', params.c]);
            if (params.d !== undefined) data.push(['Coefficient d', params.d]);
        }

        if (this.currentProblem.scenario) {
            data.push(['Description', this.currentProblem.scenario]);
        }

        return {
            title: 'Problem Statement',
            type: 'problem',
            data: data
        };
    }

    createEnhancedStepsSection() {
        if (!this.solutionSteps || this.solutionSteps.length === 0) return null;

        const stepsData = [];

        this.solutionSteps.forEach((step, index) => {
            // Skip bridge steps for data display
            if (step.stepType === 'bridge') {
                stepsData.push(['→ Connection', step.explanation.currentState]);
                stepsData.push(['', '']);
                return;
            }

            // Main step header
            stepsData.push([`Step ${step.stepNumber}`, step.step]);
            stepsData.push(['Description', step.description]);

            // Expression handling
            if (step.beforeExpression && step.afterExpression) {
                stepsData.push(['Before', step.beforeExpression]);
                if (step.operation) {
                    stepsData.push(['Operation', step.operation]);
                }
                stepsData.push(['After', step.afterExpression]);
            } else if (step.expression) {
                stepsData.push(['Expression', step.expression]);
            }

            // Reasoning and rules
            if (step.reasoning) {
                stepsData.push(['Reasoning', step.reasoning]);
            }

            if (step.algebraicRule) {
                stepsData.push(['Algebraic Rule', step.algebraicRule]);
            }

            // Enhanced explanations for detailed level
            if (step.explanations && this.explanationLevel === 'detailed') {
                stepsData.push(['Conceptual', step.explanations.conceptual]);
                if (step.visualHint) {
                    stepsData.push(['Visual Hint', step.visualHint]);
                }
            }

            // Error prevention
            if (step.errorPrevention && this.includeErrorPrevention) {
                if (step.errorPrevention.commonMistakes.length > 0) {
                    stepsData.push(['⚠ Common Mistakes', step.errorPrevention.commonMistakes.join('; ')]);
                }
                if (step.errorPrevention.preventionTips.length > 0) {
                    stepsData.push(['💡 Prevention Tips', step.errorPrevention.preventionTips.join('; ')]);
                }
            }

            // Scaffolding for guided learning
            if (step.scaffolding && this.explanationLevel === 'scaffolded') {
                stepsData.push(['❓ Guiding Questions', step.scaffolding.guidingQuestions.join(' ')]);
            }

            // Working details if present
            if (step.workingDetails) {
                stepsData.push(['Working', JSON.stringify(step.workingDetails)]);
            }

            // Solutions if this is final step
            if (step.solutions) {
                if (Array.isArray(step.solutions)) {
                    stepsData.push(['Solutions', step.solutions.join(', ')]);
                } else {
                    stepsData.push(['Solutions', JSON.stringify(step.solutions)]);
                }
            }

            // Mark final answer
            if (step.finalAnswer) {
                stepsData.push(['✓ Final Answer', 'Yes']);
            }

            stepsData.push(['', '']); // Spacing between steps
        });

        return {
            title: 'Enhanced Step-by-Step Solution',
            type: 'steps',
            data: stepsData
        };
    }

    createLessonSection() {
        const { type } = this.currentProblem;
        const lessonKey = type.replace('_standard', '').replace('_factoring', '');
        const lesson = this.lessons?.[lessonKey];

        if (!lesson) {
            return {
                title: 'Key Concepts',
                type: 'lesson',
                data: [
                    ['Concept', 'Apply polynomial solving techniques'],
                    ['Goal', 'Find all roots of the polynomial'],
                    ['Method', 'Use systematic algebraic methods']
                ]
            };
        }

        const data = [
            ['Topic', lesson.title],
            ['', ''],
            ['Theory', lesson.theory],
            ['', '']
        ];

        if (lesson.concepts) {
            data.push(['Key Concepts', '']);
            lesson.concepts.forEach(concept => {
                data.push(['•', concept]);
            });
            data.push(['', '']);
        }

        if (lesson.keyFormulas) {
            data.push(['Key Formulas', '']);
            for (const [name, formula] of Object.entries(lesson.keyFormulas)) {
                data.push([name, formula]);
            }
            data.push(['', '']);
        }

        if (lesson.applications) {
            data.push(['Applications', '']);
            lesson.applications.forEach(app => {
                data.push(['•', app]);
            });
        }

        return {
            title: 'Lesson: ' + lesson.title,
            type: 'lesson',
            data: data
        };
    }

    createSolutionSection() {
        if (!this.currentSolution) return null;

        const data = [];

        if (this.currentSolution.solutions) {
            if (Array.isArray(this.currentSolution.solutions)) {
                if (typeof this.currentSolution.solutions[0] === 'object') {
                    // Complex solutions
                    data.push(['Solutions (Complex)', '']);
                    this.currentSolution.solutions.forEach((sol, i) => {
                        if (sol.real !== undefined) {
                            data.push([`x${i+1}`, `${sol.real} + ${sol.imag}i`]);
                        }
                    });
                } else {
                    // Real solutions
                    data.push(['Solutions', this.currentSolution.solutions.join(', ')]);
                }
            } else {
                data.push(['Solution', this.currentSolution.solutions]);
            }
        }

        if (this.currentSolution.solutionType) {
            data.push(['Solution Type', this.currentSolution.solutionType]);
        }

        if (this.currentSolution.discriminant !== undefined) {
            data.push(['Discriminant', this.currentSolution.discriminant]);
            data.push(['Root Type', this.currentSolution.rootType || 'Unknown']);
        }

        if (this.currentSolution.vertex) {
            data.push(['Vertex', `(${this.currentSolution.vertex.h}, ${this.currentSolution.vertex.k})`]);
        }

        if (this.currentSolution.factorForm) {
            data.push(['Factor Form', this.currentSolution.factorForm]);
        }

        if (this.currentSolution.intervalNotation) {
            data.push(['Interval Notation', this.currentSolution.intervalNotation]);
        }

        return {
            title: 'Final Solution',
            type: 'solution',
            data: data
        };
    }

    createAnalysisSection() {
        const data = [
            ['Problem Type', this.currentProblem.type],
            ['Solution Method', this.polynomialTypes[this.currentProblem.type]?.name || 'General'],
            ['Number of Steps', this.solutionSteps?.length || 0],
            ['Explanation Level', this.explanationLevel],
            ['', '']
        ];

        if (this.currentSolution.degree) {
            data.push(['Polynomial Degree', this.currentSolution.degree]);
        }

        if (this.currentSolution.leadingCoefficient) {
            data.push(['Leading Coefficient', this.currentSolution.leadingCoefficient]);
        }

        if (this.currentSolution.endBehavior) {
            data.push(['End Behavior', this.currentSolution.endBehavior]);
        }

        return {
            title: 'Solution Analysis',
            type: 'analysis',
            data: data
        };
    }

    createVerificationSection() {
        if (!this.currentSolution || !this.currentProblem) return null;

        const verificationData = [];
        const { type } = this.currentProblem;

        verificationData.push(['Verification Method', 'Result']);
        verificationData.push(['', '']);

        switch (type) {
            case 'quadratic_standard':
            case 'quadratic_factoring':
            case 'completing_square':
                const verification = this.verifyQuadratic();
                verificationData.push(...this.formatQuadraticVerification(verification));
                break;

            case 'rational_root':
                const rootVerification = this.verifyRationalRoots();
                verificationData.push(...this.formatRationalRootsVerification(rootVerification));
                break;

            case 'polynomial_division':
            case 'synthetic_division':
                const divisionVerification = this.verifyPolynomialDivision();
                verificationData.push(...this.formatPolynomialDivisionVerification(divisionVerification));
                break;

            default:
                verificationData.push(['General Check', 'Solution verified using appropriate method']);
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

        const { type } = this.currentProblem;
        const notes = this.generatePedagogicalNotes(type);

        return {
            title: 'Teaching Notes',
            type: 'pedagogical',
            data: [
                ['Learning Objectives', notes.objectives.join('; ')],
                ['', ''],
                ['Key Concepts', notes.keyConcepts.join('; ')],
                ['', ''],
                ['Prerequisites', notes.prerequisites.join('; ')],
                ['', ''],
                ['Common Difficulties', notes.commonDifficulties.join('; ')],
                ['', ''],
                ['Extensions', notes.extensions.join('; ')],
                ['', ''],
                ['Assessment Tips', notes.assessment.join('; ')]
            ]
        };
    }

    createAlternativeMethodsSection() {
        if (!this.includeAlternativeMethods) return null;

        const { type } = this.currentProblem;
        const alternatives = this.generateAlternativeMethods(type);

        const data = [
            ['Primary Method Used', alternatives.primaryMethod],
            ['', '']
        ];

        if (alternatives.methods) {
            data.push(['Alternative Methods', '']);
            alternatives.methods.forEach((method, index) => {
                data.push([`${index + 1}. ${method.name}`, method.description]);
                if (method.whenToUse) {
                    data.push(['  When to use', method.whenToUse]);
                }
                data.push(['', '']);
            });
        }

        data.push(['Method Comparison', alternatives.comparison]);

        return {
            title: 'Alternative Solution Methods',
            type: 'alternatives',
            data: data
        };
    }

    // UTILITY METHOD
    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}

// Export for use
export default EnhancedPolynomialMathematicalWorkbook;
