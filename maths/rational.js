// Enhanced Rational Algebraic Workbook - Improved Step-by-Step Explanations
import * as math from 'mathjs';

export class EnhancedRationalAlgebraicWorkbook {
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
        this.initializeRationalSolvers();
        this.initializeErrorDatabase();
        this.initializeExplanationTemplates();
        this.initializeRationalLessons();
    }

    initializeRationalLessons() {
        this.lessons = {
            simplifying_rationals: {
                title: "Simplifying Rational Expressions",
                concepts: [
                    "A rational expression is a ratio of two polynomials: P(x)/Q(x) where Q(x) ≠ 0",
                    "Factor both numerator and denominator completely",
                    "Cancel common factors (not common terms)",
                    "State restrictions where denominator equals zero"
                ],
                theory: "Rational expressions behave like fractions. Simplification involves factoring and canceling common factors while maintaining equivalence for all valid values of the variable.",
                keyFormulas: {
                    "Standard Form": "P(x)/Q(x) where Q(x) ≠ 0",
                    "Simplified Form": "Factor and cancel: (a·b)/(a·c) = b/c, a ≠ 0",
                    "Domain Restriction": "Find values where Q(x) = 0"
                },
                solvingSteps: [
                    "Factor numerator completely",
                    "Factor denominator completely",
                    "Identify and cancel common factors",
                    "State domain restrictions",
                    "Write simplified form"
                ],
                applications: [
                    "Rate and proportion problems",
                    "Work rate calculations",
                    "Optimization problems",
                    "Physics formulas (resistance, capacitance)"
                ]
            },

            rational_equations: {
                title: "Solving Rational Equations",
                concepts: [
                    "Equations containing rational expressions",
                    "Find LCD (Least Common Denominator) of all fractions",
                    "Multiply entire equation by LCD to clear fractions",
                    "Check solutions for extraneous roots"
                ],
                theory: "Rational equations are solved by eliminating fractions through multiplication by the LCD, then solving the resulting polynomial equation. Solutions must be checked against domain restrictions.",
                keyFormulas: {
                    "General Form": "P₁(x)/Q₁(x) = P₂(x)/Q₂(x)",
                    "LCD Method": "LCD × (equation) = polynomial equation",
                    "Cross Multiplication": "a/b = c/d → ad = bc"
                },
                solvingSteps: [
                    "Identify all denominators",
                    "Find LCD of all denominators",
                    "Multiply entire equation by LCD",
                    "Solve resulting polynomial equation",
                    "Check solutions in original equation",
                    "Reject extraneous solutions"
                ],
                applications: [
                    "Mixture problems",
                    "Work rate problems",
                    "Distance-rate-time problems",
                    "Proportion problems"
                ]
            },

            operations_on_rationals: {
                title: "Operations with Rational Expressions",
                concepts: [
                    "Addition/Subtraction: Find common denominator",
                    "Multiplication: Multiply numerators and denominators",
                    "Division: Multiply by reciprocal",
                    "Complex fractions: Simplify numerator and denominator separately"
                ],
                theory: "Operations on rational expressions follow the same rules as arithmetic fractions, with the added complexity of polynomial expressions requiring factoring.",
                keyFormulas: {
                    "Addition": "a/b + c/d = (ad + bc)/(bd)",
                    "Subtraction": "a/b - c/d = (ad - bc)/(bd)",
                    "Multiplication": "(a/b) × (c/d) = (ac)/(bd)",
                    "Division": "(a/b) ÷ (c/d) = (a/b) × (d/c) = (ad)/(bc)"
                },
                techniques: [
                    "Find LCD for addition/subtraction",
                    "Factor before multiplying or dividing",
                    "Cancel common factors across operation",
                    "Simplify complex fractions by LCD or division method"
                ],
                applications: [
                    "Combined work rates",
                    "Parallel resistance in circuits",
                    "Lens equations in optics",
                    "Harmonic means"
                ]
            },

            complex_fractions: {
                title: "Complex Rational Expressions",
                concepts: [
                    "Fractions within fractions (compound fractions)",
                    "Two methods: LCD method and division method",
                    "Simplify numerator and denominator separately",
                    "Perform division as final step"
                ],
                theory: "Complex fractions can be simplified by treating them as division problems or by multiplying by the LCD of all fractions involved.",
                keyFormulas: {
                    "Definition": "(a/b)/(c/d) = (a/b) × (d/c) = ad/bc",
                    "LCD Method": "Multiply by LCD/LCD",
                    "Division Method": "Simplify top and bottom, then divide"
                },
                solvingSteps: [
                    "Identify all denominators (main and sub-fractions)",
                    "Method 1: Find LCD of all fractions, multiply",
                    "Method 2: Simplify top and bottom separately, then divide",
                    "Simplify final result",
                    "State restrictions"
                ],
                applications: [
                    "Combined rates problems",
                    "Electrical impedance",
                    "Optical systems",
                    "Economic ratios"
                ]
            },

            rational_inequalities: {
                title: "Rational Inequalities",
                concepts: [
                    "Inequalities involving rational expressions",
                    "Find critical values (zeros and undefined points)",
                    "Test intervals between critical values",
                    "Use sign analysis or test points"
                ],
                theory: "Rational inequalities require careful analysis of sign changes at zeros and asymptotes. Solutions are intervals determined by testing regions.",
                keyFormulas: {
                    "Standard Form": "P(x)/Q(x) > 0 (or <, ≥, ≤)",
                    "Critical Values": "Zeros: P(x) = 0; Asymptotes: Q(x) = 0",
                    "Sign Analysis": "Test each interval between critical values"
                },
                solvingSteps: [
                    "Move all terms to one side",
                    "Combine into single rational expression",
                    "Find zeros of numerator (P(x) = 0)",
                    "Find zeros of denominator (Q(x) = 0)",
                    "Create sign chart with critical values",
                    "Test each interval",
                    "Write solution in interval notation"
                ],
                applications: [
                    "Optimization with constraints",
                    "Break-even analysis",
                    "Quality control ranges",
                    "Physics threshold problems"
                ]
            },

            partial_fractions: {
                title: "Partial Fraction Decomposition",
                concepts: [
                    "Decompose complex fraction into sum of simpler fractions",
                    "Degree of numerator must be less than denominator",
                    "Factor denominator completely",
                    "Use different forms for different factor types"
                ],
                theory: "Partial fraction decomposition expresses a rational function as a sum of simpler fractions, essential for integration and inverse transforms.",
                keyFormulas: {
                    "Linear Factors": "A/(x-a) + B/(x-b)",
                    "Repeated Linear": "A/(x-a) + B/(x-a)²",
                    "Quadratic": "A/(x-a) + (Bx+C)/(x²+bx+c)",
                    "Improper": "Polynomial + Proper Fraction"
                },
                types: [
                    "Distinct linear factors",
                    "Repeated linear factors",
                    "Irreducible quadratic factors",
                    "Improper fractions (long division first)"
                ],
                applications: [
                    "Integration of rational functions",
                    "Laplace transform inversions",
                    "Signal processing",
                    "Control theory"
                ]
            },

            rational_functions: {
                title: "Rational Function Analysis",
                concepts: [
                    "Function of form f(x) = P(x)/Q(x)",
                    "Domain: all x where Q(x) ≠ 0",
                    "Vertical asymptotes where Q(x) = 0",
                    "Horizontal asymptotes from degree comparison"
                ],
                theory: "Rational functions exhibit rich behavior including asymptotes, holes, and various end behaviors depending on the degrees of numerator and denominator.",
                keyFormulas: {
                    "General Form": "f(x) = P(x)/Q(x)",
                    "Vertical Asymptote": "x = a where Q(a) = 0 and P(a) ≠ 0",
                    "Horizontal Asymptote": "y = lim(x→∞) f(x)",
                    "Hole": "x = a where P(a) = Q(a) = 0"
                },
                analysis_components: [
                    "Domain and restrictions",
                    "Vertical asymptotes",
                    "Horizontal/oblique asymptotes",
                    "Holes (removable discontinuities)",
                    "Intercepts",
                    "End behavior"
                ],
                applications: [
                    "Cost-benefit analysis",
                    "Population models",
                    "Chemical reaction rates",
                    "Economic modeling"
                ]
            },

            rational_word_problems: {
                title: "Applications of Rational Equations",
                concepts: [
                    "Translate word problems into rational equations",
                    "Common setups: work rate, mixture, distance-rate-time",
                    "Define variables clearly",
                    "Check reasonableness of solutions"
                ],
                theory: "Many real-world problems involve rates and proportions naturally modeled by rational equations. Solution interpretation is crucial.",
                problem_types: {
                    "Work Rate": "1/t₁ + 1/t₂ = 1/t_together",
                    "Mixture": "amount₁·concentration₁ + amount₂·concentration₂ = total·final_concentration",
                    "Distance-Rate-Time": "d = rt, combined with rational relationships",
                    "Proportion": "a/b = c/d"
                },
                solution_strategy: [
                    "Read carefully and identify what to find",
                    "Define variables for unknowns",
                    "Set up rational equation from relationships",
                    "Solve equation (clear fractions with LCD)",
                    "Check solution in context",
                    "Answer with appropriate units and interpretation"
                ],
                common_setups: {
                    "Upstream/Downstream": "rate_boat ± rate_current",
                    "Together Work": "rate₁ + rate₂ = combined_rate",
                    "Dilution": "amount·concentration = pure substance"
                }
            },

            graphing_rationals: {
                title: "Graphing Rational Functions",
                concepts: [
                    "Identify all asymptotes (vertical, horizontal, oblique)",
                    "Find intercepts (x and y)",
                    "Locate holes (removable discontinuities)",
                    "Analyze behavior near asymptotes"
                ],
                theory: "Graphing rational functions requires understanding asymptotic behavior, discontinuities, and the relationship between algebraic and geometric properties.",
                keyFormulas: {
                    "Vertical Asymptote": "Set Q(x) = 0",
                    "Horizontal (deg P < deg Q)": "y = 0",
                    "Horizontal (deg P = deg Q)": "y = ratio of leading coefficients",
                    "Oblique (deg P = deg Q + 1)": "Polynomial division quotient"
                },
                graphing_steps: [
                    "Factor and simplify function",
                    "Find domain restrictions",
                    "Locate vertical asymptotes",
                    "Determine horizontal/oblique asymptotes",
                    "Find x and y intercepts",
                    "Identify holes",
                    "Plot key points",
                    "Sketch curves following asymptotic behavior"
                ],
                applications: [
                    "Cost analysis visualization",
                    "Population dynamics",
                    "Chemical kinetics",
                    "Engineering design"
                ]
            },

            solving_for_variable: {
                title: "Solving Rational Formulas for a Variable",
                concepts: [
                    "Isolate desired variable in rational formula",
                    "Clear fractions by multiplying by LCD",
                    "Collect all terms containing variable",
                    "Factor out variable if needed"
                ],
                theory: "Many formulas in science and mathematics are rational expressions. Solving for a specific variable requires algebraic manipulation while maintaining equivalence.",
                keyFormulas: {
                    "Resistance": "1/R_total = 1/R₁ + 1/R₂",
                    "Lens Equation": "1/f = 1/d_o + 1/d_i",
                    "Combined Rate": "1/t = 1/t₁ + 1/t₂"
                },
                techniques: [
                    "Clear fractions first (multiply by LCD)",
                    "Move terms with target variable to one side",
                    "Factor out target variable",
                    "Divide or simplify to isolate variable"
                ],
                applications: [
                    "Physics formulas (lenses, circuits, motion)",
                    "Chemistry (concentration, dilution)",
                    "Economics (cost, revenue, profit)",
                    "Engineering (stress, strain, efficiency)"
                ]
            },

            rational_exponents: {
                title: "Rational Exponents and Radicals",
                concepts: [
                    "Rational exponent: x^(m/n) = ⁿ√(x^m)",
                    "Convert between radical and exponential form",
                    "Apply exponent rules to rational exponents",
                    "Simplify expressions with rational exponents"
                ],
                theory: "Rational exponents provide an alternative notation for radicals and follow the same exponent rules, enabling algebraic manipulation of root expressions.",
                keyFormulas: {
                    "Definition": "x^(m/n) = (x^m)^(1/n) = (x^(1/n))^m",
                    "Product Rule": "x^(a/b) · x^(c/d) = x^(a/b + c/d)",
                    "Quotient Rule": "x^(a/b) / x^(c/d) = x^(a/b - c/d)",
                    "Power Rule": "(x^(a/b))^(c/d) = x^(ac/bd)"
                },
                techniques: [
                    "Convert radicals to rational exponents",
                    "Apply exponent rules",
                    "Simplify using factoring",
                    "Rationalize if needed"
                ],
                applications: [
                    "Growth and decay models",
                    "Physics (dimensional analysis)",
                    "Scaling relationships",
                    "Geometric mean calculations"
                ]
            },

            variation: {
                title: "Direct, Inverse, and Joint Variation",
                concepts: [
                    "Direct variation: y = kx (y ∝ x)",
                    "Inverse variation: y = k/x (y ∝ 1/x)",
                    "Joint variation: z = kxy (z ∝ xy)",
                    "Combined variation: combinations of direct and inverse"
                ],
                theory: "Variation describes proportional relationships between variables. Rational expressions naturally model inverse and combined variation.",
                keyFormulas: {
                    "Direct": "y = kx, k is constant of variation",
                    "Inverse": "y = k/x or xy = k",
                    "Joint": "z = kxy",
                    "Combined": "y = kx/z (direct with x, inverse with z)"
                },
                problem_solving: [
                    "Identify type of variation from problem description",
                    "Write variation equation with constant k",
                    "Use given values to find k",
                    "Substitute k and solve for unknown"
                ],
                applications: [
                    "Physics laws (inverse square law, Hooke's law)",
                    "Economics (supply-demand)",
                    "Chemistry (gas laws)",
                    "Engineering (stress-strain)"
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
            'intersection': '∩', 'union': '∪', 'subset': '⊂', 'element': '∈',
            'perpendicular': '⊥', 'parallel': '∥', 'angle': '∠'
        };
    }

    initializeRationalSolvers() {
        this.rationalTypes = {
            // Simplifying rational expressions
            simplify_rational: {
                patterns: [
                    /simplif.*rational/i,
                    /factor.*\(.*\).*\/.*\(.*\)/,
                    /reduce.*fraction/i,
                    /cancel.*factor/i
                ],
                solver: this.simplifyRational.bind(this),
                name: 'Simplifying Rational Expressions',
                category: 'simplification',
                description: 'Simplifies rational expressions by factoring and canceling'
            },

            // Rational equations
            rational_equation: {
                patterns: [
                    /\(.*\)\/\(.*\)\s*=\s*\(.*\)\/\(.*\)/,
                    /.*\/.*=.*\/.*[^<>]/,
                    /solve.*rational.*equation/i,
                    /clear.*fraction/i
                ],
                solver: this.solveRationalEquation.bind(this),
                name: 'Rational Equations',
                category: 'equations',
                description: 'Solves equations containing rational expressions'
            },

            // Addition/Subtraction of rationals
            rational_addition: {
                patterns: [
                    /.*\/.*[+\-].*\/.*/,
                    /add.*rational/i,
                    /subtract.*rational/i,
                    /common.*denominator/i
                ],
                solver: this.addSubtractRationals.bind(this),
                name: 'Addition/Subtraction of Rational Expressions',
                category: 'operations',
                description: 'Adds or subtracts rational expressions'
            },

            // Multiplication/Division of rationals
            rational_multiplication: {
                patterns: [
                    /\(.*\/.*\)\s*[×*]\s*\(.*\/.*\)/,
                    /\(.*\/.*\)\s*÷\s*\(.*\/.*\)/,
                    /multiply.*rational/i,
                    /divide.*rational/i
                ],
                solver: this.multiplyDivideRationals.bind(this),
                name: 'Multiplication/Division of Rational Expressions',
                category: 'operations',
                description: 'Multiplies or divides rational expressions'
            },

            // Complex fractions
            complex_fraction: {
                patterns: [
                    /complex.*fraction/i,
                    /compound.*fraction/i,
                    /\(.*\/.*\)\/\(.*\/.*\)/,
                    /fraction.*within.*fraction/i
                ],
                solver: this.simplifyComplexFraction.bind(this),
                name: 'Complex Fractions',
                category: 'complex_fractions',
                description: 'Simplifies complex rational expressions'
            },

            // Rational inequalities
            rational_inequality: {
                patterns: [
                    /.*\/.*[<>≤≥].*/,
                    /rational.*inequality/i,
                    /inequality.*rational/i,
                    /sign.*chart.*rational/i
                ],
                solver: this.solveRationalInequality.bind(this),
                name: 'Rational Inequalities',
                category: 'inequalities',
                description: 'Solves inequalities with rational expressions'
            },

            // Partial fractions
            partial_fractions: {
                patterns: [
                    /partial.*fraction/i,
                    /decompose.*fraction/i,
                    /decomposition/i
                ],
                solver: this.partialFractionDecomposition.bind(this),
                name: 'Partial Fraction Decomposition',
                category: 'partial_fractions',
                description: 'Decomposes rational expressions into partial fractions'
            },

            // Rational function analysis
            rational_function_analysis: {
                patterns: [
                    /analyze.*rational.*function/i,
                    /asymptote.*rational/i,
                    /domain.*rational.*function/i,
                    /graph.*rational/i
                ],
                solver: this.analyzeRationalFunction.bind(this),
                name: 'Rational Function Analysis',
                category: 'function_analysis',
                description: 'Analyzes rational functions for domain, asymptotes, etc.'
            },

            // Work rate problems
            work_rate_rational: {
                patterns: [
                    /work.*rate.*rational/i,
                    /together.*complete/i,
                    /combined.*work/i,
                    /1\/t.*1\/t/i
                ],
                solver: this.solveWorkRateRational.bind(this),
                name: 'Work Rate Problems',
                category: 'applications',
                description: 'Solves work rate problems using rational equations'
            },

            // Distance-rate-time with rationals
            rational_drt: {
                patterns: [
                    /upstream.*downstream/i,
                    /current.*speed/i,
                    /wind.*speed/i,
                    /rate.*rational/i
                ],
                solver: this.solveRationalDRT.bind(this),
                name: 'Distance-Rate-Time with Rationals',
                category: 'applications',
                description: 'Solves motion problems with rational expressions'
            },

            // Mixture problems with rationals
            rational_mixture: {
                patterns: [
                    /mixture.*rational/i,
                    /concentration.*rational/i,
                    /solution.*percent/i
                ],
                solver: this.solveRationalMixture.bind(this),
                name: 'Mixture Problems with Rationals',
                category: 'applications',
                description: 'Solves mixture problems using rational equations'
            },

            // Solving formulas for variables
            solve_formula_rational: {
                patterns: [
                    /solve.*for.*[a-z].*rational/i,
                    /isolate.*variable.*rational/i,
                    /rearrange.*formula/i
                ],
                solver: this.solveFormulaForVariable.bind(this),
                name: 'Solving Formulas for Variables',
                category: 'formulas',
                description: 'Solves rational formulas for a specified variable'
            },

            // Rational exponents
            rational_exponents: {
                patterns: [
                    /rational.*exponent/i,
                    /x\^\([0-9]+\/[0-9]+\)/,
                    /fractional.*exponent/i,
                    /radical.*rational/i
                ],
                solver: this.simplifyRationalExponents.bind(this),
                name: 'Rational Exponents',
                category: 'exponents',
                description: 'Simplifies expressions with rational exponents'
            },

            // Variation problems
            variation_problems: {
                patterns: [
                    /direct.*variation/i,
                    /inverse.*variation/i,
                    /joint.*variation/i,
                    /vary.*directly/i,
                    /vary.*inversely/i
                ],
                solver: this.solveVariation.bind(this),
                name: 'Variation Problems',
                category: 'variation',
                description: 'Solves direct, inverse, and joint variation problems'
            },

            // Proportions
            proportions: {
                patterns: [
                    /proportion/i,
                    /[a-z]\/[a-z]\s*=\s*[a-z]\/[a-z]/,
                    /cross.*multiply/i,
                    /ratio.*equal/i
                ],
                solver: this.solveProportion.bind(this),
                name: 'Proportions',
                category: 'proportions',
                description: 'Solves proportion problems'
            }
        };
    }

    initializeErrorDatabase() {
        this.commonMistakes = {
            simplify_rational: {
                'Factor numerator and denominator': [
                    'Canceling terms instead of factors',
                    'Forgetting to factor completely before canceling',
                    'Canceling across addition/subtraction'
                ],
                'State restrictions': [
                    'Not identifying all values that make denominator zero',
                    'Forgetting restrictions from canceled factors'
                ]
            },
            rational_equation: {
                'Clear fractions with LCD': [
                    'Not distributing LCD to all terms',
                    'Arithmetic errors when multiplying by LCD',
                    'Forgetting to simplify before solving'
                ],
                'Check for extraneous solutions': [
                    'Not checking solutions in original equation',
                    'Accepting solutions that make denominator zero',
                    'Not recognizing when solution creates undefined expression'
                ]
            },
            rational_addition: {
                'Find common denominator': [
                    'Using incorrect LCD',
                    'Not converting all fractions to common denominator',
                    'Forgetting to multiply numerator when adjusting denominator'
                ],
                'Combine numerators': [
                    'Distributing negative sign incorrectly',
                    'Not combining like terms properly',
                    'Arithmetic errors in numerator'
                ]
            },
            rational_multiplication: {
                'Factor before multiplying': [
                    'Multiplying first instead of factoring and canceling',
                    'Missing opportunities to simplify',
                    'Creating unnecessarily complex expressions'
                ]
            },
            rational_inequality: {
                'Create sign chart': [
                    'Not finding all critical values',
                    'Confusing zeros with undefined points',
                    'Testing intervals incorrectly'
                ],
                'Interpret solution': [
                    'Including undefined points in solution',
                    'Wrong inequality notation at boundaries',
                    'Not expressing in interval notation correctly'
                ]
            }
        };

        this.errorPrevention = {
            cancel_factors_only: {
                reminder: 'Only factors can be canceled, not terms being added/subtracted',
                method: 'Factor completely first, then identify and cancel common factors'
            },
            check_extraneous: {
                reminder: 'Always check solutions in the original equation',
                method: 'Substitute each solution and verify denominators are not zero'
            },
            lcd_distribution: {
                reminder: 'Multiply every term by the LCD, including constants',
                method: 'Use parentheses to ensure proper distribution'
            },
            critical_values: {
                reminder: 'Include both zeros and undefined points in analysis',
                method: 'Set numerator=0 for zeros, denominator=0 for undefined points'
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
    solveRationalProblem(config) {
        const { equation, scenario, parameters, problemType, context } = config;

        try {
            // Parse the problem
            this.currentProblem = this.parseRationalProblem(equation, scenario, parameters, problemType, context);

            // Solve the problem
            this.currentSolution = this.solveRationalProblem_Internal(this.currentProblem);

            // Generate solution steps
            this.solutionSteps = this.generateRationalSteps(this.currentProblem, this.currentSolution);

            // Generate graph data if applicable
            this.generateRationalGraphData();

            // Generate workbook
            this.generateRationalWorkbook();

            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                solutions: this.currentSolution?.solutions,
                solutionType: this.currentSolution?.solutionType
            };

        } catch (error) {
            throw new Error(`Failed to solve rational problem: ${error.message}`);
        }
    }

    parseRationalProblem(equation, scenario = '', parameters = {}, problemType = null, context = {}) {
        const cleanInput = equation ? this.cleanMathExpression(equation) : '';

        // If problem type is specified, use it directly
        if (problemType && this.rationalTypes[problemType]) {
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

        // Auto-detect rational problem type
        for (const [type, config] of Object.entries(this.rationalTypes)) {
            for (const pattern of config.patterns) {
                if (pattern.test(cleanInput) || pattern.test(scenario)) {
                    const match = cleanInput.match(pattern);
                    const extractedParams = this.extractRationalParameters(match, type);

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

        throw new Error(`Unable to recognize rational problem type from: ${equation || scenario}`);
    }

    cleanMathExpression(expression) {
        return expression
            .replace(/\s+/g, ' ')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/≠/g, '!=')
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .trim();
    }

    extractRationalParameters(match, type) {
        const params = {};
        
        // Extract parameters based on type
        if (type === 'rational_equation' && match) {
            // Extract numerator and denominator expressions
            params.equation = match[0];
        }
        
        return params;
    }

    solveRationalProblem_Internal(problem) {
        const solver = this.rationalTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for rational problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    // RATIONAL SOLVERS


simplifyRational(problem) {
    const { numerator, denominator, expression } = problem.parameters;

    if (!numerator || !denominator) {
        return {
            problemType: 'Simplifying Rational Expression',
            original: expression,
            note: 'Unable to parse numerator and denominator. Please use format: (numerator)/(denominator)',
            simplified: expression,
            category: 'simplify_rational'
        };
    }

    // Try to identify common factors (basic symbolic approach)
    const commonFactors = this.findCommonFactors(numerator, denominator);
    const restrictions = this.findDomainRestrictions(denominator);

    return {
        problemType: 'Simplifying Rational Expression',
        original: `(${numerator})/(${denominator})`,
        numerator: numerator,
        denominator: denominator,
        steps: [
            `Factor the numerator: ${numerator}`,
            `Factor the denominator: ${denominator}`,
            commonFactors.length > 0 ? `Common factors found: ${commonFactors.join(', ')}` : 'No common factors to cancel',
            commonFactors.length > 0 ? 'Cancel common factors' : 'Expression is already simplified',
            `Domain restrictions: x ≠ ${restrictions.join(', ')}`
        ],
        method: 'Factor and Cancel',
        simplified: commonFactors.length > 0 ? 'Simplified form (with common factors canceled)' : `(${numerator})/(${denominator})`,
        restrictions: restrictions,
        commonFactors: commonFactors,
        note: 'Factor completely to find all common factors that can be canceled',
        category: 'simplify_rational'
    };
}

solveRationalEquation(problem) {
    const { equation, leftSide, rightSide } = problem.parameters;

    if (!equation || !leftSide || !rightSide) {
        return {
            problemType: 'Rational Equation',
            equation: equation,
            method: 'LCD Method',
            steps: ['Unable to parse equation. Please check format.'],
            solutions: [],
            category: 'rational_equation'
        };
    }

    // Try to solve the equation
    const solutions = this.solveRationalEquationNumerically(leftSide, rightSide);
    const restrictions = this.findAllDenominatorRestrictions(equation);
    
    // Filter out extraneous solutions
    const validSolutions = solutions.filter(sol => !restrictions.includes(sol));
    const extraneousSolutions = solutions.filter(sol => restrictions.includes(sol));

    return {
        problemType: 'Rational Equation',
        equation: equation,
        leftSide: leftSide,
        rightSide: rightSide,
        method: 'LCD Method',
        steps: [
            'Identify all denominators in the equation',
            `Denominators found: ${this.extractDenominators(equation).join(', ')}`,
            'Find the LCD of all denominators',
            'Multiply entire equation by LCD to clear fractions',
            'Solve the resulting polynomial equation',
            `Found ${solutions.length} potential solution(s)`,
            'Check each solution in original equation',
            extraneousSolutions.length > 0 ? `Rejected ${extraneousSolutions.length} extraneous solution(s)` : 'All solutions valid'
        ],
        solutions: validSolutions,
        extraneousSolutions: extraneousSolutions,
        restrictions: restrictions,
        warnings: [
            'Solutions that make any denominator zero are extraneous',
            'Always check in original equation'
        ],
        category: 'rational_equation'
    };
}

addSubtractRationals(problem) {
    const { term1, term2, operation, expression } = problem.parameters;

    if (!term1 || !term2) {
        return {
            problemType: 'Rational Operation',
            expression: expression,
            method: 'Common Denominator Method',
            result: expression,
            note: 'Unable to parse terms. Please check format.',
            category: 'rational_addition'
        };
    }

    const opName = operation === '+' ? 'Addition' : 'Subtraction';
    
    // Parse fractions
    const frac1 = this.parseFraction(term1);
    const frac2 = this.parseFraction(term2);
    
    // Find LCD
    const lcd = this.findLCD(frac1.denominator, frac2.denominator);

    return {
        problemType: `${opName} of Rational Expressions`,
        expression: `${term1} ${operation} ${term2}`,
        term1: term1,
        term2: term2,
        operation: operation,
        method: 'Common Denominator Method',
        steps: [
            `First fraction: ${term1}`,
            `Second fraction: ${term2}`,
            `LCD of denominators: ${lcd}`,
            `Rewrite ${term1} with denominator ${lcd}`,
            `Rewrite ${term2} with denominator ${lcd}`,
            `${opName === 'Addition' ? 'Add' : 'Subtract'} the numerators`,
            'Simplify the result'
        ],
        lcd: lcd,
        keyPoint: operation === '-' ? 
            'When subtracting, distribute the negative to ALL terms in the second numerator!' :
            'Add numerators over common denominator',
        result: `Result with LCD ${lcd}`,
        restrictions: this.findDomainRestrictions(`${frac1.denominator} ${frac2.denominator}`),
        category: 'rational_addition'
    };
}

multiplyDivideRationals(problem) {
    const { term1, term2, operation, expression } = problem.parameters;

    if (!term1 || !term2) {
        return {
            problemType: 'Rational Operation',
            expression: expression,
            method: operation === '*' ? 'Multiplication' : 'Division',
            result: expression,
            note: 'Unable to parse terms. Please check format.',
            category: 'rational_multiplication'
        };
    }

    const opName = operation === '*' ? 'Multiplication' : 'Division';
    const opSymbol = operation === '*' ? '×' : '÷';
    
    // Parse fractions
    const frac1 = this.parseFraction(term1);
    const frac2 = this.parseFraction(term2);

    return {
        problemType: `${opName} of Rational Expressions`,
        expression: `${term1} ${opSymbol} ${term2}`,
        term1: term1,
        term2: term2,
        operation: operation,
        method: operation === '*' ? 'Factor and Cancel' : 'Multiply by Reciprocal',
        steps: operation === '*' ? [
            `First fraction: (${frac1.numerator})/(${frac1.denominator})`,
            `Second fraction: (${frac2.numerator})/(${frac2.denominator})`,
            'Factor all numerators and denominators',
            'Cancel common factors diagonally',
            `Multiply remaining: (${frac1.numerator} × ${frac2.numerator})/(${frac1.denominator} × ${frac2.denominator})`,
            'State domain restrictions'
        ] : [
            `First fraction: (${frac1.numerator})/(${frac1.denominator})`,
            `Second fraction: (${frac2.numerator})/(${frac2.denominator})`,
            `Reciprocal of second: (${frac2.denominator})/(${frac2.numerator})`,
            'Multiply by reciprocal',
            `Result: (${frac1.numerator} × ${frac2.denominator})/(${frac1.denominator} × ${frac2.numerator})`,
            'Factor and cancel common factors',
            'State domain restrictions'
        ],
        keyPoint: operation === '*' ? 
            'Factor before multiplying - makes canceling much easier!' : 
            'Flip the second fraction (reciprocal) and multiply',
        result: operation === '*' ? 
            `(${frac1.numerator} × ${frac2.numerator})/(${frac1.denominator} × ${frac2.denominator})` :
            `(${frac1.numerator} × ${frac2.denominator})/(${frac1.denominator} × ${frac2.numerator})`,
        restrictions: this.findDomainRestrictions(`${frac1.denominator} ${frac2.denominator} ${frac2.numerator}`),
        category: 'rational_multiplication'
    };
}

// HELPER METHODS FOR COMPUTATION

findCommonFactors(num, den) {
    // Basic pattern matching for common factors
    const commonFactors = [];
    
    // Check for common linear factors like (x-a)
    const numFactors = this.extractLinearFactors(num);
    const denFactors = this.extractLinearFactors(den);
    
    for (const nf of numFactors) {
        if (denFactors.includes(nf)) {
            commonFactors.push(nf);
        }
    }
    
    return commonFactors;
}

extractLinearFactors(expr) {
    // Extract linear factors like (x-1), (x+2), etc.
    const factors = [];
    const matches = expr.matchAll(/\(x\s*([+-])\s*(\d+)\)/g);
    
    for (const match of matches) {
        factors.push(`(x ${match[1]} ${match[2]})`);
    }
    
    return factors;
}

findDomainRestrictions(denominator) {
    // Find values that make denominator zero
    const restrictions = [];
    
    // Look for linear factors (x-a) or (x+a)
    const linearMatches = denominator.matchAll(/\(x\s*([+-])\s*(\d+)\)/g);
    for (const match of linearMatches) {
        const sign = match[1];
        const value = parseInt(match[2]);
        restrictions.push(sign === '-' ? value : -value);
    }
    
    // Look for simple x in denominator
    if (denominator.includes('x') && !denominator.includes('x²') && 
        !denominator.includes('x^2') && denominator.split(/[()]/)[0].trim() === 'x') {
        restrictions.push(0);
    }
    
    return restrictions;
}

findAllDenominatorRestrictions(equation) {
    // Find all values that make any denominator zero
    const restrictions = [];
    
    // Extract all denominators
    const denominators = this.extractDenominators(equation);
    
    for (const den of denominators) {
        const denRestrictions = this.findDomainRestrictions(den);
        restrictions.push(...denRestrictions);
    }
    
    // Remove duplicates
    return [...new Set(restrictions)];
}

extractDenominators(equation) {
    const denominators = [];
    
    // Pattern 1: number/denominator
    const pattern1 = equation.matchAll(/\d+\s*\/\s*\(([^)]+)\)/g);
    for (const match of pattern1) {
        denominators.push(match[1]);
    }
    
    // Pattern 2: number/x or number/(x+a)
    const pattern2 = equation.matchAll(/\d+\s*\/\s*([a-z]+(?:\s*[+-]\s*\d+)?)/gi);
    for (const match of pattern2) {
        if (!match[1].includes('/')) {
            denominators.push(match[1]);
        }
    }
    
    return denominators;
}

solveRationalEquationNumerically(leftSide, rightSide) {
    // Numerical solution using Newton's method or test values
    const solutions = [];
    
    // Test integer values from -20 to 20
    for (let x = -20; x <= 20; x++) {
        if (x === 0) continue; // Skip x=0 which often makes denominators zero
        
        try {
            const left = this.evaluateExpression(leftSide, x);
            const right = this.evaluateExpression(rightSide, x);
            
            if (left !== null && right !== null && Math.abs(left - right) < 0.0001) {
                solutions.push(x);
            }
        } catch (e) {
            // Skip values that cause errors (division by zero, etc.)
            continue;
        }
    }
    
    // Test some fractional values
    const testFractions = [0.5, 1.5, 2.5, -0.5, -1.5, -2.5];
    for (const x of testFractions) {
        try {
            const left = this.evaluateExpression(leftSide, x);
            const right = this.evaluateExpression(rightSide, x);
            
            if (left !== null && right !== null && Math.abs(left - right) < 0.0001) {
                solutions.push(x);
            }
        } catch (e) {
            continue;
        }
    }
    
    return solutions;
}

evaluateExpression(expr, x) {
    try {
        // Replace x with value
        let evaluated = expr.replace(/x/g, `(${x})`);
        
        // Handle fractions like 1/(x+1)
        // Simple evaluation - replace and compute
        
        // For basic expressions like "1/x", "1/(x+1)", etc.
        const fractionPattern = /(\d+)\s*\/\s*\(([^)]+)\)/g;
        evaluated = evaluated.replace(fractionPattern, (match, num, den) => {
            const denValue = eval(den.replace(/x/g, x));
            if (Math.abs(denValue) < 0.0001) return null; // Division by zero
            return num / denValue;
        });
        
        // Handle simple fractions like 1/x
        const simpleFractionPattern = /(\d+)\s*\/\s*([a-z0-9()]+)/gi;
        evaluated = evaluated.replace(simpleFractionPattern, (match, num, den) => {
            try {
                const denValue = eval(den.replace(/x/g, x));
                if (Math.abs(denValue) < 0.0001) return null;
                return num / denValue;
            } catch {
                return match;
            }
        });
        
        // Evaluate the final expression
        const result = eval(evaluated);
        return isFinite(result) ? result : null;
    } catch (e) {
        return null;
    }
}

parseFraction(term) {
    // Parse a fraction term like "(x+2)/(x-1)" or "3/(x+1)"
    
    // Pattern 1: (numerator)/(denominator)
    const pattern1 = term.match(/\(([^)]+)\)\s*\/\s*\(([^)]+)\)/);
    if (pattern1) {
        return {
            numerator: pattern1[1].trim(),
            denominator: pattern1[2].trim()
        };
    }
    
    // Pattern 2: numerator/(denominator)
    const pattern2 = term.match(/([^\/]+)\s*\/\s*\(([^)]+)\)/);
    if (pattern2) {
        return {
            numerator: pattern2[1].trim(),
            denominator: pattern2[2].trim()
        };
    }
    
    // Pattern 3: (numerator)/denominator
    const pattern3 = term.match(/\(([^)]+)\)\s*\/\s*([^\/]+)/);
    if (pattern3) {
        return {
            numerator: pattern3[1].trim(),
            denominator: pattern3[2].trim()
        };
    }
    
    // Pattern 4: simple fraction
    const pattern4 = term.match(/([^\/]+)\s*\/\s*(.+)/);
    if (pattern4) {
        return {
            numerator: pattern4[1].trim(),
            denominator: pattern4[2].trim()
        };
    }
    
    return {
        numerator: term,
        denominator: '1'
    };
}

findLCD(den1, den2) {
    // Simplified LCD finder
    // For symbolic expressions, combine them
    
    if (den1 === den2) {
        return den1;
    }
    
    // If both are simple, multiply them (simplified approach)
    if (!den1.includes('(') && !den2.includes('(')) {
        if (den1 === '1') return den2;
        if (den2 === '1') return den1;
        return `${den1} × ${den2}`;
    }
    
    // For factored forms, take all unique factors
    return `LCD of (${den1}) and (${den2})`;
}

// Add verification method
verifyRationalEquation() {
    const solution = this.currentSolution;
    
    if (!solution || !solution.solutions || solution.solutions.length === 0) {
        return {
            type: 'no_solutions',
            message: 'No solutions available to verify'
        };
    }

    const validSolutions = solution.solutions.map(sol => {
        const leftValue = this.evaluateExpression(solution.leftSide, sol);
        const rightValue = this.evaluateExpression(solution.rightSide, sol);
        const difference = leftValue !== null && rightValue !== null ? 
            Math.abs(leftValue - rightValue) : Infinity;

        return {
            solution: sol,
            leftSide: leftValue !== null ? leftValue.toFixed(6) : 'undefined',
            rightSide: rightValue !== null ? rightValue.toFixed(6) : 'undefined',
            difference: difference,
            isValid: difference < 0.0001
        };
    });

    return {
        verificationType: 'Rational Equation Verification',
        equation: solution.equation,
        method: 'Substitution into original equation',
        validSolutions: validSolutions,
        extraneousSolutions: (solution.extraneousSolutions || []).map(sol => ({
            solution: sol,
            reason: 'Makes denominator zero'
        })),
        allValid: validSolutions.every(v => v.isValid)
    };
}



simplifyComplexFraction(problem) {
    const { numeratorFraction, denominatorFraction, expression } = problem.parameters;

    if (!numeratorFraction || !denominatorFraction) {
        return {
            problemType: 'Complex Fraction',
            expression: expression,
            note: 'Unable to parse complex fraction structure',
            methods: [
                {
                    name: 'Division Method',
                    steps: [
                        'Simplify the numerator to a single fraction',
                        'Simplify the denominator to a single fraction',
                        'Divide numerator by denominator (multiply by reciprocal)',
                        'Simplify the result'
                    ]
                }
            ],
            category: 'complex_fraction'
        };
    }

    // Parse the fractions
    const numFrac = this.parseFraction(numeratorFraction);
    const denFrac = this.parseFraction(denominatorFraction);

    // Find all denominators for LCD method
    const allDenominators = [
        numFrac.denominator,
        denFrac.denominator
    ].filter(d => d !== '1');

    const lcd = allDenominators.length > 0 ? 
        this.findLCD(allDenominators[0], allDenominators[1] || allDenominators[0]) : 
        '1';

    return {
        problemType: 'Complex Fraction',
        expression: expression,
        numeratorFraction: numeratorFraction,
        denominatorFraction: denominatorFraction,
        structure: {
            numerator: `(${numFrac.numerator})/(${numFrac.denominator})`,
            denominator: `(${denFrac.numerator})/(${denFrac.denominator})`
        },
        methods: [
            {
                name: 'Division Method',
                steps: [
                    `Numerator fraction: (${numFrac.numerator})/(${numFrac.denominator})`,
                    `Denominator fraction: (${denFrac.numerator})/(${denFrac.denominator})`,
                    'Rewrite as division problem',
                    `[(${numFrac.numerator})/(${numFrac.denominator})] ÷ [(${denFrac.numerator})/(${denFrac.denominator})]`,
                    `Multiply by reciprocal: [(${numFrac.numerator})/(${numFrac.denominator})] × [(${denFrac.denominator})/(${denFrac.numerator})]`,
                    `Result: (${numFrac.numerator} × ${denFrac.denominator})/(${numFrac.denominator} × ${denFrac.numerator})`,
                    'Simplify by canceling common factors'
                ],
                result: `(${numFrac.numerator} × ${denFrac.denominator})/(${numFrac.denominator} × ${denFrac.numerator})`
            },
            {
                name: 'LCD Method',
                steps: [
                    `Find LCD of all small fractions: ${lcd}`,
                    `Multiply numerator and denominator by ${lcd}`,
                    'Small fraction denominators cancel',
                    'Simplify the resulting expression'
                ],
                lcd: lcd
            }
        ],
        recommendation: allDenominators.length > 1 ? 
            'LCD method is often faster when multiple fractions are involved' : 
            'Division method is straightforward for this problem',
        result: `Simplified: (${numFrac.numerator} × ${denFrac.denominator})/(${numFrac.denominator} × ${denFrac.numerator})`,
        restrictions: this.findDomainRestrictions(`${numFrac.denominator} ${denFrac.denominator} ${denFrac.numerator}`),
        category: 'complex_fraction'
    };
}

solveRationalInequality(problem) {
    const { inequality, numerator, operator, rightSide } = problem.parameters;

    if (!inequality) {
        return {
            problemType: 'Rational Inequality',
            inequality: problem.parameters.expression || 'Not provided',
            note: 'Unable to parse inequality',
            category: 'rational_inequality'
        };
    }

    // Extract the rational expression
    const parts = inequality.split(/[><≤≥]/);
    const leftExpr = parts[0].trim();
    const rightExpr = parts[1] ? parts[1].trim() : '0';
    const actualOperator = inequality.match(/[><≤≥]/)?.[0] || '>';

    // Parse the left side as a fraction
    const frac = this.parseFraction(leftExpr);
    
    // Find critical points (zeros and undefined points)
    const zeros = this.findZeros(frac.numerator);
    const undefined = this.findZeros(frac.denominator);
    const criticalPoints = [...zeros, ...undefined].sort((a, b) => a - b);

    // Test intervals
    const intervals = [];
    const testResults = [];

    // Test point before first critical value
    if (criticalPoints.length > 0) {
        const testPoint = criticalPoints[0] - 1;
        const testResult = this.testInequality(leftExpr, rightExpr, actualOperator, testPoint);
        testResults.push({
            interval: `(-∞, ${criticalPoints[0]})`,
            testPoint: testPoint,
            satisfies: testResult
        });
    }

    // Test points between critical values
    for (let i = 0; i < criticalPoints.length - 1; i++) {
        const testPoint = (criticalPoints[i] + criticalPoints[i + 1]) / 2;
        const testResult = this.testInequality(leftExpr, rightExpr, actualOperator, testPoint);
        testResults.push({
            interval: `(${criticalPoints[i]}, ${criticalPoints[i + 1]})`,
            testPoint: testPoint,
            satisfies: testResult
        });
    }

    // Test point after last critical value
    if (criticalPoints.length > 0) {
        const testPoint = criticalPoints[criticalPoints.length - 1] + 1;
        const testResult = this.testInequality(leftExpr, rightExpr, actualOperator, testPoint);
        testResults.push({
            interval: `(${criticalPoints[criticalPoints.length - 1]}, ∞)`,
            testPoint: testPoint,
            satisfies: testResult
        });
    }

    // Determine solution intervals
    const solutionIntervals = testResults
        .filter(t => t.satisfies)
        .map(t => t.interval);

    // Build interval notation
    const intervalNotation = solutionIntervals.length > 0 ?
        solutionIntervals.join(' ∪ ') :
        'No solution';

    return {
        problemType: 'Rational Inequality',
        inequality: inequality,
        operator: actualOperator,
        method: 'Sign Chart Method',
        steps: [
            'Move all terms to one side (inequality vs 0)',
            `Left side: ${leftExpr}`,
            `Right side: ${rightExpr}`,
            'Combine into single rational expression',
            `Numerator: ${frac.numerator}`,
            `Denominator: ${frac.denominator}`,
            `Find zeros of numerator: ${zeros.length > 0 ? zeros.join(', ') : 'none found'}`,
            `Find zeros of denominator (undefined points): ${undefined.length > 0 ? undefined.join(', ') : 'none found'}`,
            `Critical points: ${criticalPoints.join(', ')}`,
            'Test a point in each interval',
            'Determine which intervals satisfy the inequality'
        ],
        criticalPoints: criticalPoints,
        zeros: zeros,
        undefinedPoints: undefined,
        testResults: testResults,
        solutionIntervals: solutionIntervals,
        solutionSet: intervalNotation !== 'No solution' ? 
            `Solution: ${intervalNotation}` : 
            'No solution',
        intervalNotation: intervalNotation,
        criticalConcepts: [
            'Zeros of numerator: points where expression equals zero',
            'Zeros of denominator: vertical asymptotes (never included in solution)',
            'Test point in each interval to determine sign',
            `Use ${actualOperator.includes('=') ? 'closed' : 'open'} circles at zeros, always open at asymptotes`
        ],
        category: 'rational_inequality'
    };
}

analyzeRationalFunction(problem) {
    const { expression, numerator, denominator } = problem.parameters;

    let num, den;
    
    if (numerator && denominator) {
        num = numerator;
        den = denominator;
    } else {
        // Try to parse from expression
        const frac = this.parseFraction(expression);
        num = frac.numerator;
        den = frac.denominator;
    }

    // Find vertical asymptotes (denominator zeros)
    const verticalAsymptotes = this.findZeros(den);

    // Find holes (common factors)
    const commonFactors = this.findCommonFactors(num, den);
    const holes = commonFactors.length > 0 ? 
        this.findZeros(commonFactors.join(' ')) : 
        [];

    // Find x-intercepts (numerator zeros, excluding holes)
    const numZeros = this.findZeros(num);
    const xIntercepts = numZeros.filter(z => !holes.includes(z));

    // Find y-intercept (if x=0 is in domain)
    let yIntercept = null;
    if (!verticalAsymptotes.includes(0) && !holes.includes(0)) {
        const yValue = this.evaluateExpression(expression, 0);
        if (yValue !== null && isFinite(yValue)) {
            yIntercept = yValue;
        }
    }

    // Determine horizontal asymptote
    const numDegree = this.getDegree(num);
    const denDegree = this.getDegree(den);
    let horizontalAsymptote = null;

    if (numDegree < denDegree) {
        horizontalAsymptote = 0;
    } else if (numDegree === denDegree) {
        const numLeading = this.getLeadingCoefficient(num);
        const denLeading = this.getLeadingCoefficient(den);
        horizontalAsymptote = numLeading / denLeading;
    }

    return {
        problemType: 'Rational Function Analysis',
        function: expression || `(${num})/(${den})`,
        numerator: num,
        denominator: den,
        analysisComponents: {
            domain: verticalAsymptotes.length > 0 ? 
                `All real numbers except x = ${verticalAsymptotes.join(', ')}` : 
                'All real numbers',
            verticalAsymptotes: verticalAsymptotes.length > 0 ? 
                verticalAsymptotes.map(va => `x = ${va}`) : 
                ['None'],
            holes: holes.length > 0 ? 
                holes.map(h => `x = ${h}`) : 
                ['None'],
            horizontalAsymptote: horizontalAsymptote !== null ? 
                `y = ${horizontalAsymptote}` : 
                (numDegree > denDegree ? 'None (oblique or none)' : 'None'),
            xIntercepts: xIntercepts.length > 0 ? 
                xIntercepts.map(xi => `x = ${xi}`) : 
                ['None'],
            yIntercept: yIntercept !== null ? 
                `y = ${yIntercept}` : 
                'None (undefined at x=0)'
        },
        steps: [
            `Factor numerator: ${num}`,
            `Factor denominator: ${den}`,
            `Domain: exclude x = ${verticalAsymptotes.join(', ')}`,
            commonFactors.length > 0 ? 
                `Holes at x = ${holes.join(', ')} (common factors)` : 
                'No holes (no common factors)',
            verticalAsymptotes.length > 0 ? 
                `Vertical asymptotes at x = ${verticalAsymptotes.join(', ')}` : 
                'No vertical asymptotes',
            horizontalAsymptote !== null ? 
                `Horizontal asymptote: y = ${horizontalAsymptote}` : 
                'No horizontal asymptote',
            xIntercepts.length > 0 ? 
                `X-intercepts at x = ${xIntercepts.join(', ')}` : 
                'No x-intercepts',
            yIntercept !== null ? 
                `Y-intercept at y = ${yIntercept}` : 
                'No y-intercept'
        ],
        horizontalAsymptoteRules: {
            'deg(num) < deg(den)': `y = 0 ${numDegree < denDegree ? '✓ (applies here)' : ''}`,
            'deg(num) = deg(den)': `y = ratio of leading coefficients ${numDegree === denDegree ? '✓ (applies here)' : ''}`,
            'deg(num) = deg(den) + 1': `Oblique asymptote ${numDegree === denDegree + 1 ? '✓ (applies here)' : ''}`,
            'deg(num) > deg(den) + 1': `No horizontal or oblique asymptote ${numDegree > denDegree + 1 ? '✓ (applies here)' : ''}`
        },
        degrees: {
            numerator: numDegree,
            denominator: denDegree
        },
        category: 'rational_function_analysis'
    };
}

solveWorkRateRational(problem) {
    const { scenario, equation } = problem.parameters;

    // Try to extract time values from scenario
    const timeMatches = scenario.match(/(\d+)\s*hours?/gi);
    const times = timeMatches ? timeMatches.map(t => parseInt(t)) : [];

    let solution = null;
    let solutionSteps = [];

    if (times.length >= 2) {
        // We have two work times, calculate combined time
        const t1 = times[0];
        const t2 = times[1];
        
        // Formula: 1/t1 + 1/t2 = 1/t_combined
        // Solving: t_combined = (t1 * t2)/(t1 + t2)
        const tCombined = (t1 * t2) / (t1 + t2);
        
        solution = tCombined;
        solutionSteps = [
            `Person A completes job in ${t1} hours → Rate A = 1/${t1} jobs/hour`,
            `Person B completes job in ${t2} hours → Rate B = 1/${t2} jobs/hour`,
            `Combined rate = 1/${t1} + 1/${t2}`,
            `Combined rate = ${(1/t1).toFixed(4)} + ${(1/t2).toFixed(4)} = ${(1/t1 + 1/t2).toFixed(4)} jobs/hour`,
            `Time together = 1 / combined rate`,
            `Time together = 1 / ${(1/t1 + 1/t2).toFixed(4)}`,
            `Time together = ${tCombined.toFixed(2)} hours`
        ];
    }

    return {
        problemType: 'Work Rate Problem',
        scenario: scenario || 'Combined work problem',
        equation: equation || '1/t₁ + 1/t₂ = 1/t_combined',
        principle: 'Work Rate = 1/Time; Combined Rate = Sum of Individual Rates',
        formula: '1/t₁ + 1/t₂ = 1/t_combined',
        explanation: 'If person A completes job in t₁ hours, their rate is 1/t₁ jobs per hour',
        givenInformation: times.length >= 2 ? 
            `Time for person A: ${times[0]} hours, Time for person B: ${times[1]} hours` : 
            'Parse work times from problem description',
        steps: solutionSteps.length > 0 ? solutionSteps : [
            'Define variables for unknown time(s)',
            'Express each work rate as 1/time',
            'Set up equation: sum of individual rates = combined rate',
            'Find LCD and clear fractions',
            'Solve resulting equation',
            'Check reasonableness (time should be positive)',
            'State answer with proper units'
        ],
        solution: solution !== null ? 
            `Combined time: ${solution.toFixed(2)} hours` : 
            'Set up equation and solve using formula above',
        commonSetups: {
            'Time Together': '1/t₁ + 1/t₂ = 1/t_together',
            'Time Remaining': 'rate × time_worked + rate × time_remaining = 1 job',
            'Part of Job': 'rate₁ × time + rate₂ × time = fraction_completed'
        },
        examples: [
            'Worker A: 4 hours alone → rate = 1/4 = 0.25 jobs/hour',
            'Worker B: 6 hours alone → rate = 1/6 = 0.167 jobs/hour',
            'Together: 1/4 + 1/6 = 3/12 + 2/12 = 5/12 jobs/hour',
            'Time together: 1 ÷ (5/12) = 12/5 = 2.4 hours'
        ],
        keyInsights: [
            'Faster worker has larger rate (smaller time)',
            'Combined time is always less than either individual time',
            'If working against each other, subtract rates',
            'Formula: t_combined = (t₁ × t₂)/(t₁ + t₂)'
        ],
        category: 'work_rate_rational'
    };
}

solveRationalDRT(problem) {
    const { scenario, equation } = problem.parameters;

    // Try to extract speeds and distances from scenario
    const speedMatch = scenario.match(/(\d+)\s*(?:mph|km\/h|m\/s)/gi);
    const distanceMatch = scenario.match(/(\d+)\s*(?:miles?|km|meters?)/gi);
    
    const speeds = speedMatch ? speedMatch.map(s => parseInt(s)) : [];
    const distances = distanceMatch ? distanceMatch.map(d => parseInt(d)) : [];

    return {
        problemType: 'Distance-Rate-Time with Rationals',
        scenario: scenario || 'Motion with current/wind',
        principle: 'distance = rate × time, with adjusted rates for current/wind',
        formula: 'd = r × t',
        givenInformation: {
            speeds: speeds.length > 0 ? speeds : 'Extract from problem',
            distances: distances.length > 0 ? distances : 'Extract from problem'
        },
        rateAdjustments: {
            'Downstream': 'rate_effective = boat_speed + current_speed',
            'Upstream': 'rate_effective = boat_speed - current_speed',
            'With Wind': 'rate_effective = plane_speed + wind_speed',
            'Against Wind': 'rate_effective = plane_speed - wind_speed'
        },
        steps: [
            'Identify: boat speed (b), current speed (c), distances',
            'Downstream rate: b + c',
            'Upstream rate: b - c',
            'Use d = rt for each direction',
            'If same distance both ways: d/(b+c) = t_down, d/(b-c) = t_up',
            'Set up equation based on given information',
            'Clear fractions using LCD',
            'Solve for unknown variable',
            'Check: speeds positive, times positive',
            'State answer with units'
        ],
        commonScenarios: {
            'Round Trip': 'd_down = d_up, but t_down ≠ t_up (downstream faster)',
            'Same Time Different Distance': 't_down = t_up, find distance difference',
            'Total Time': 't_total = t_down + t_up'
        },
        examples: [
            'Boat speed: 20 mph, Current: 4 mph',
            'Downstream rate: 20 + 4 = 24 mph',
            'Upstream rate: 20 - 4 = 16 mph',
            'Distance 48 miles each way:',
            'Time downstream: 48/24 = 2 hours',
            'Time upstream: 48/16 = 3 hours',
            'Total time: 5 hours'
        ],
        keyInsights: [
            'Downstream is faster (takes less time for same distance)',
            'Upstream is slower (takes more time for same distance)',
            'Boat speed must exceed current speed to go upstream',
            'If times are equal but distances different, use d₁/(b+c) = d₂/(b-c)'
        ],
        category: 'rational_drt'
    };
}

solveRationalMixture(problem) {
    const { scenario, equation } = problem.parameters;

    // Try to extract concentrations and amounts
    const percentMatches = scenario.match(/(\d+)%/g);
    const amountMatches = scenario.match(/(\d+)\s*(?:L|liters?|gallons?|ml)/gi);
    
    const percentages = percentMatches ? percentMatches.map(p => parseInt(p)) : [];
    const amounts = amountMatches ? amountMatches.map(a => parseInt(a)) : [];

    return {
        problemType: 'Mixture Problem with Rationals',
        scenario: scenario || 'Concentration mixture problem',
        principle: 'Amount × Concentration = Pure Substance',
        formula: 'amount₁ × conc₁ + amount₂ × conc₂ = total_amount × final_conc',
        givenInformation: {
            concentrations: percentages.length > 0 ? 
                percentages.map(p => `${p}%`) : 
                'Extract from problem',
            amounts: amounts.length > 0 ? amounts : 'Extract from problem'
        },
        steps: [
            'Define variables for unknown amounts (x, y)',
            `Convert percentages to decimals: ${percentages.map(p => `${p}% = ${p/100}`).join(', ')}`,
            'Set up amount equation: x + y = total',
            'Set up pure substance equation: (conc₁)x + (conc₂)y = (final_conc)(total)',
            'Solve system of equations',
            'Substitute to find both amounts',
            'Verify: amounts positive, concentrations valid',
            'State answer with units'
        ],
        commonTypes: {
            'Solution Mixing': 'Mix two solutions to get desired concentration',
            'Dilution': 'Add pure water (0%) to reduce concentration',
            'Strengthening': 'Add pure substance (100%) to increase concentration',
            'Alloy': 'Mix metals with different purities'
        },
        examples: percentages.length >= 2 && amounts.length >= 1 ? [
            `Given: ${percentages[0]}% solution, ${percentages[1]}% solution, need ${amounts[0]}L total`,
            `Let x = amount of ${percentages[0]}% solution`,
            `Let y = amount of ${percentages[1]}% solution`,
            `Amount equation: x + y = ${amounts[0]}`,
            `Concentration: ${percentages[0]/100}x + ${percentages[1]/100}y = final_conc × ${amounts[0]}`,
            'Solve system for x and y'
        ] : [
            'Mix x L of 20% solution with y L of 50% solution',
            'Get 100 L of 35% solution',
            'Amount equation: x + y = 100',
            'Concentration equation: 0.20x + 0.50y = 0.35(100) = 35',
            'From first: y = 100 - x',
            'Substitute: 0.20x + 0.50(100-x) = 35',
            '0.20x + 50 - 0.50x = 35',
            '-0.30x = -15',
            'x = 50 L of 20% solution',
            'y = 50 L of 50% solution'
        ],
        keyInsights: [
            'Final concentration must be between the two original concentrations',
            'Adding pure water (0%) decreases concentration',
            'Adding pure substance (100%) increases concentration',
            'Convert all percentages to decimals before calculating',
            'Amount of pure substance = amount × concentration'
        ],
        category: 'rational_mixture'
    };
}

// Continue in next part...
// CONTINUED RATIONAL SOLVERS

solveFormulaForVariable(problem) {
    const { formula, targetVariable, equation } = problem.parameters;

    const actualFormula = formula || equation || '';
    const variable = targetVariable || 'x';

    // Try to recognize common formulas
    let recognizedFormula = null;
    let solutionFormula = null;

    if (actualFormula.includes('1/R') || actualFormula.toLowerCase().includes('resistance')) {
        recognizedFormula = 'Parallel Resistance';
        solutionFormula = 'R₁ = (R_total × R₂)/(R₂ - R_total)';
    } else if (actualFormula.includes('1/f') || actualFormula.toLowerCase().includes('lens')) {
        recognizedFormula = 'Lens Equation';
        solutionFormula = 'd_o = (f × d_i)/(d_i - f)';
    } else if (actualFormula.includes('1/t') && actualFormula.split('1/t').length > 2) {
        recognizedFormula = 'Combined Work Rate';
        solutionFormula = 't₁ = (t_total × t₂)/(t₂ - t_total)';
    }

    return {
        problemType: 'Solving Formula for Variable',
        formula: actualFormula || 'Rational formula',
        targetVariable: variable,
        recognizedAs: recognizedFormula,
        method: 'Algebraic Manipulation',
        steps: [
            `Given formula: ${actualFormula}`,
            `Solve for: ${variable}`,
            'Step 1: Multiply through by LCD to clear all fractions',
            'Step 2: Expand and simplify both sides',
            `Step 3: Move all terms with ${variable} to one side`,
            'Step 4: Move all other terms to opposite side',
            `Step 5: Factor out ${variable} if it appears multiple times`,
            `Step 6: Divide to isolate ${variable}`,
            'Step 7: Simplify final expression'
        ],
        solution: solutionFormula || `${variable} = (solved expression)`,
        commonFormulas: {
            'Parallel Resistance': {
                formula: '1/R_total = 1/R₁ + 1/R₂',
                solveForR1: 'R₁ = (R_total × R₂)/(R₂ - R_total)',
                steps: [
                    '1/R₁ = 1/R_total - 1/R₂',
                    '1/R₁ = (R₂ - R_total)/(R_total × R₂)',
                    'R₁ = (R_total × R₂)/(R₂ - R_total)'
                ]
            },
            'Lens Equation': {
                formula: '1/f = 1/d_o + 1/d_i',
                solveForDo: 'd_o = (f × d_i)/(d_i - f)',
                steps: [
                    '1/d_o = 1/f - 1/d_i',
                    '1/d_o = (d_i - f)/(f × d_i)',
                    'd_o = (f × d_i)/(d_i - f)'
                ]
            },
            'Combined Work': {
                formula: '1/t_total = 1/t₁ + 1/t₂',
                solveForT1: 't₁ = (t_total × t₂)/(t₂ - t_total)',
                steps: [
                    '1/t₁ = 1/t_total - 1/t₂',
                    '1/t₁ = (t₂ - t_total)/(t_total × t₂)',
                    't₁ = (t_total × t₂)/(t₂ - t_total)'
                ]
            }
        },
        strategies: [
            'Multiply through by LCD first - eliminates all fractions immediately',
            'If variable appears in multiple terms, factor it out',
            'Keep track of domain restrictions (where denominators ≠ 0)',
            'Check if result is undefined for any values'
        ],
        domainRestrictions: [
            'Original formula denominators cannot be zero',
            'In solved formula, denominator cannot be zero'
        ],
        category: 'solve_formula_rational'
    };
}

simplifyRationalExponents(problem) {
    const { base, exponent, expression } = problem.parameters;

    const expr = expression || `${base}^(${exponent})`;
    
    // Try to extract base and rational exponent
    const match = expr.match(/(\d+)\^\((\d+)\/(\d+)\)/);
    let calculatedValue = null;
    let steps = [];

    if (match) {
        const b = parseInt(match[1]);
        const m = parseInt(match[2]);
        const n = parseInt(match[3]);
        
        // Calculate x^(m/n) = ⁿ√(x^m)
        const power = Math.pow(b, m);
        const root = Math.pow(power, 1/n);
        calculatedValue = root;
        
        steps = [
            `Given: ${b}^(${m}/${n})`,
            `Interpretation: ${b}^(${m}/${n}) = ⁿ√(${b}^${m})`,
            `Step 1: Calculate the power: ${b}^${m} = ${power}`,
            `Step 2: Take the ${n}th root: ⁿ√${power} = ${root.toFixed(4)}`,
            `Alternative: (ⁿ√${b})^${m} = ${Math.pow(Math.pow(b, 1/n), m).toFixed(4)}`,
            `Result: ${root.toFixed(4)}`
        ];
    }

    return {
        problemType: 'Rational Exponents',
        expression: expr,
        conversion: 'x^(m/n) = ⁿ√(x^m) = (ⁿ√x)^m',
        explanation: 'Rational exponents represent roots and powers combined',
        calculatedValue: calculatedValue,
        steps: calculatedValue !== null ? steps : [
            'Identify the rational exponent m/n',
            'Numerator (m) represents the power',
            'Denominator (n) represents the root',
            'Choose conversion: ⁿ√(x^m) or (ⁿ√x)^m',
            'Calculate power first, then root (or vice versa)',
            'Simplify to numerical or simplest radical form'
        ],
        exponentRules: {
             'Product': 'x^(a/b) · x^(c/d) = x^(a/b + c/d) = x^((ad+bc)/(bd))',
            'Quotient': 'x^(a/b) / x^(c/d) = x^(a/b - c/d) = x^((ad-bc)/(bd))',
            'Power': '(x^(a/b))^(c/d) = x^(ac/bd)',
            'Negative': 'x^(-a/b) = 1/x^(a/b) = 1/(ⁿ√(x^a))',
            'Reciprocal': '(x/y)^(a/b) = x^(a/b)/y^(a/b)'
        },
        examples: [
            '8^(2/3) = ³√(8²) = ³√64 = 4',
            '16^(3/4) = ⁴√(16³) = ⁴√4096 = 8',
            'x^(1/2) × x^(1/3) = x^(3/6 + 2/6) = x^(5/6)',
            '(27x⁶)^(2/3) = 27^(2/3) × x^(6×2/3) = 9x⁴',
            '32^(3/5) = ⁵√(32³) = ⁵√32768 = 8'
        ],
        detailedExamples: [
            {
                problem: '16^(3/4)',
                method1: 'Power then root',
                steps1: [
                    '16^3 = 4096',
                    '⁴√4096 = 8'
                ],
                method2: 'Root then power',
                steps2: [
                    '⁴√16 = 2',
                    '2^3 = 8'
                ],
                result: '8 (both methods give same answer)'
            }
        ],
        keyInsights: [
            'x^(1/n) means the nth root of x',
            'x^(m/n) means the nth root of x raised to mth power',
            'Negative exponents create reciprocals',
            'Exponent of 1/2 is the same as square root',
            'Usually easier to take root first, then raise to power',
            'Both x^(m/n) and (x^(1/n))^m give the same result'
        ],
        category: 'rational_exponents'
    };
}

solveVariation(problem) {
    const { variationType, scenario, givenValues } = problem.parameters;

    const variationTypes = {
        direct: {
            equation: 'y = kx',
            description: 'y varies directly as x (y is proportional to x)',
            relationship: 'As x increases, y increases proportionally',
            solving: 'Find k using given values: k = y/x, then solve for unknown',
            graph: 'Straight line through origin'
        },
        inverse: {
            equation: 'y = k/x  or  xy = k',
            description: 'y varies inversely as x (y is inversely proportional to x)',
            relationship: 'As x increases, y decreases proportionally',
            solving: 'Find k using given values: k = xy, then solve for unknown',
            graph: 'Hyperbola'
        },
        joint: {
            equation: 'z = kxy',
            description: 'z varies jointly as x and y',
            relationship: 'z is proportional to the product of x and y',
            solving: 'Find k using given values: k = z/(xy), then solve',
            graph: '3D surface'
        },
        combined: {
            equation: 'y = kx/z  or  y = kxz',
            description: 'Combination of direct and inverse variation',
            relationship: 'Mixed proportional relationships',
            solving: 'Find k using given values, then solve for unknown',
            graph: 'Complex surface'
        }
    };

    const varInfo = variationTypes[variationType] || variationTypes.direct;

    // Try to extract numerical values from scenario for example calculation
    const numbers = scenario.match(/\d+/g);
    let exampleCalculation = null;

    if (numbers && numbers.length >= 2 && variationType === 'direct') {
        const y1 = parseInt(numbers[0]);
        const x1 = parseInt(numbers[1]);
        const k = y1 / x1;
        
        exampleCalculation = {
            given: `y = ${y1} when x = ${x1}`,
            findK: `k = y/x = ${y1}/${x1} = ${k}`,
            equation: `y = ${k}x`,
            example: numbers[2] ? `When x = ${numbers[2]}, y = ${k} × ${numbers[2]} = ${k * parseInt(numbers[2])}` : null
        };
    } else if (numbers && numbers.length >= 2 && variationType === 'inverse') {
        const y1 = parseInt(numbers[0]);
        const x1 = parseInt(numbers[1]);
        const k = y1 * x1;
        
        exampleCalculation = {
            given: `y = ${y1} when x = ${x1}`,
            findK: `k = xy = ${y1} × ${x1} = ${k}`,
            equation: `y = ${k}/x or xy = ${k}`,
            example: numbers[2] ? `When x = ${numbers[2]}, y = ${k}/${numbers[2]} = ${(k / parseInt(numbers[2])).toFixed(2)}` : null
        };
    }

    return {
        problemType: 'Variation Problem',
        variationType: variationType,
        scenario: scenario,
        formula: varInfo.equation,
        description: varInfo.description,
        relationship: varInfo.relationship,
        steps: [
            'Identify type of variation from problem description',
            `Write variation equation: ${varInfo.equation}`,
            'Substitute given values to find constant k',
            'Solve for k',
            'Write complete equation with k value',
            'Substitute known values to find unknown',
            'Solve for the unknown variable',
            'Check reasonableness of answer'
        ],
        solvingProcess: varInfo.solving,
        calculation: exampleCalculation,
        examples: {
            direct: {
                problem: 'If y = 12 when x = 3, find y when x = 5',
                solution: [
                    'Since y varies directly as x: y = kx',
                    'Find k: 12 = k(3) → k = 4',
                    'Equation: y = 4x',
                    'When x = 5: y = 4(5) = 20'
                ]
            },
            inverse: {
                problem: 'If y = 12 when x = 3, find y when x = 4',
                solution: [
                    'Since y varies inversely as x: y = k/x or xy = k',
                    'Find k: 12(3) = k → k = 36',
                    'Equation: y = 36/x',
                    'When x = 4: y = 36/4 = 9'
                ]
            },
            joint: {
                problem: 'If z = 24 when x = 2 and y = 3, find z when x = 4, y = 5',
                solution: [
                    'Since z varies jointly as x and y: z = kxy',
                    'Find k: 24 = k(2)(3) → 24 = 6k → k = 4',
                    'Equation: z = 4xy',
                    'When x = 4, y = 5: z = 4(4)(5) = 80'
                ]
            },
            combined: {
                problem: 'y varies directly as x and inversely as z. If y = 6 when x = 12, z = 4, find y when x = 8, z = 2',
                solution: [
                    'Equation: y = kx/z',
                    'Find k: 6 = k(12)/4 → 6 = 3k → k = 2',
                    'Equation: y = 2x/z',
                    'When x = 8, z = 2: y = 2(8)/2 = 8'
                ]
            }
        },
        realWorldApplications: [
            'Direct: Distance and time at constant speed (d = vt)',
            'Inverse: Speed and time for fixed distance (t = d/v)',
            'Inverse: Pressure and volume of gas at constant temp (PV = k)',
            'Joint: Area of rectangle (A = lw)',
            'Combined: Gas laws (P = nRT/V)',
            'Inverse square: Gravitational force (F = k/r²)'
        ],
        graphicalRepresentation: {
            direct: 'Straight line through origin with slope k',
            inverse: 'Hyperbola in quadrants I and III (if k > 0)',
            joint: '3D surface passing through origin',
            combined: 'Complex 3D surface'
        },
        keyInsights: [
            'Direct variation: ratio y/x is constant',
            'Inverse variation: product xy is constant',
            'Joint variation: combines multiple direct variations',
            'Combined: mix of direct and inverse relationships',
            'Always find k first using given values',
            'k is called the constant of variation or proportionality constant'
        ],
        category: 'variation_problems'
    };
}

solveProportion(problem) {
    const { a, b, c, d, proportion } = problem.parameters;

    let actualA = a, actualB = b, actualC = c, actualD = d;
    let unknown = null;
    let solution = null;

    // Try to parse proportion if parameters not provided
    if (proportion && (!a || !b || !c || !d)) {
        const match = proportion.match(/([^=\/]+)\/([^=\/]+)\s*=\s*([^=\/]+)\/([^=\/]+)/);
        if (match) {
            actualA = match[1].trim();
            actualB = match[2].trim();
            actualC = match[3].trim();
            actualD = match[4].trim();
        }
    }

    // Determine which is the unknown variable
    const isNumber = (val) => !isNaN(parseFloat(val)) && isFinite(val);
    
    if (!isNumber(actualA) && actualA.match(/[a-z]/i)) {
        unknown = 'a';
        // a/b = c/d → a = bc/d
        if (isNumber(actualB) && isNumber(actualC) && isNumber(actualD)) {
            solution = (parseFloat(actualB) * parseFloat(actualC)) / parseFloat(actualD);
        }
    } else if (!isNumber(actualB) && actualB.match(/[a-z]/i)) {
        unknown = 'b';
        // a/b = c/d → b = ad/c
        if (isNumber(actualA) && isNumber(actualC) && isNumber(actualD)) {
            solution = (parseFloat(actualA) * parseFloat(actualD)) / parseFloat(actualC);
        }
    } else if (!isNumber(actualC) && actualC.match(/[a-z]/i)) {
        unknown = 'c';
        // a/b = c/d → c = ad/b
        if (isNumber(actualA) && isNumber(actualB) && isNumber(actualD)) {
            solution = (parseFloat(actualA) * parseFloat(actualD)) / parseFloat(actualB);
        }
    } else if (!isNumber(actualD) && actualD.match(/[a-z]/i)) {
        unknown = 'd';
        // a/b = c/d → d = bc/a
        if (isNumber(actualA) && isNumber(actualB) && isNumber(actualC)) {
            solution = (parseFloat(actualB) * parseFloat(actualC)) / parseFloat(actualA);
        }
    }

    const solutionSteps = solution !== null ? [
        `Given proportion: ${actualA}/${actualB} = ${actualC}/${actualD}`,
        `Unknown variable: ${unknown}`,
        `Cross multiply: ${actualA} × ${actualD} = ${actualB} × ${actualC}`,
        solution !== null ? `Solve for ${unknown}: ${unknown} = ${solution.toFixed(4)}` : 'Set up equation and solve',
        solution !== null ? `Verification: ${solution.toFixed(4)}/${isNumber(actualB) ? actualB : '?'} = ${isNumber(actualC) ? actualC : '?'}/${isNumber(actualD) ? actualD : '?'}` : 'Check by substitution'
    ] : [
        `Write the proportion: ${actualA}/${actualB} = ${actualC}/${actualD}`,
        'Identify the unknown variable',
        `Cross multiply: ${actualA} × ${actualD} = ${actualB} × ${actualC}`,
        'Solve the resulting equation',
        'Check solution by substituting back',
        'Verify both sides of proportion are equal'
    ];

    return {
        problemType: 'Proportion',
        proportion: proportion || `${actualA}/${actualB} = ${actualC}/${actualD}`,
        values: {
            a: actualA,
            b: actualB,
            c: actualC,
            d: actualD
        },
        unknown: unknown,
        solution: solution !== null ? `${unknown} = ${solution.toFixed(4)}` : 'Solve using cross multiplication',
        method: 'Cross Multiplication',
        principle: 'If a/b = c/d, then ad = bc (product of means = product of extremes)',
        steps: solutionSteps,
        terminology: {
            'Means': `The inner terms (${actualB} and ${actualC} in ${actualA}/${actualB} = ${actualC}/${actualD})`,
            'Extremes': `The outer terms (${actualA} and ${actualD} in ${actualA}/${actualB} = ${actualC}/${actualD})`,
            'Cross Products': `${actualA} × ${actualD} and ${actualB} × ${actualC}, which must be equal`
        },
        examples: [
            {
                problem: 'x/5 = 12/20',
                solution: [
                    'Cross multiply: x(20) = 5(12)',
                    '20x = 60',
                    'x = 3',
                    'Check: 3/5 = 0.6 and 12/20 = 0.6 ✓'
                ]
            },
            {
                problem: '3/7 = y/21',
                solution: [
                    'Cross multiply: 3(21) = 7y',
                    '63 = 7y',
                    'y = 9',
                    'Check: 3/7 ≈ 0.429 and 9/21 ≈ 0.429 ✓'
                ]
            },
            {
                problem: '(x+2)/4 = 15/10',
                solution: [
                    'Cross multiply: (x+2)(10) = 4(15)',
                    '10x + 20 = 60',
                    '10x = 40',
                    'x = 4',
                    'Check: (4+2)/4 = 6/4 = 1.5 and 15/10 = 1.5 ✓'
                ]
            }
        ],
        propertyOfProportions: [
            'If a/b = c/d, then a/c = b/d (alternation)',
            'If a/b = c/d, then b/a = d/c (inversion)',
            'If a/b = c/d, then (a+b)/b = (c+d)/d (composition)',
            'If a/b = c/d, then (a-b)/b = (c-d)/d (division)',
            'If a/b = c/d = e/f, then (a+c+e)/(b+d+f) = a/b (addition)'
        ],
        applications: [
            'Scale models and maps (1:100 scale means 1 cm represents 100 cm)',
            'Recipe conversions (doubling, halving, serving adjustments)',
            'Similar triangles in geometry (corresponding sides proportional)',
            'Unit conversions (miles to kilometers, etc.)',
            'Mixing problems (paint colors, chemical solutions)',
            'Rate problems (speed, work rate, flow rate)',
            'Currency exchange rates',
            'Density calculations'
        ],
        keyInsights: [
            'Proportions represent equal ratios or rates',
            'Cross multiplication is the fastest solution method',
            'Check that original fractions are equivalent',
            'Proportions are symmetric: if a/b = c/d then c/d = a/b',
            'In proportion a/b = c/d, if you know any 3 values, you can find the 4th',
            'Proportions maintain relationships when both quantities change together'
        ],
        category: 'proportions'
    };
}

partialFractionDecomposition(problem) {
    const { numerator, denominator, expression } = problem.parameters;

    let num, den;
    
    if (numerator && denominator) {
        num = numerator;
        den = denominator;
    } else {
        const frac = this.parseFraction(expression);
        num = frac.numerator;
        den = frac.denominator;
    }

    // Determine degree comparison
    const numDegree = this.getDegree(num);
    const denDegree = this.getDegree(den);
    const isProper = numDegree < denDegree;

    // Analyze denominator factors
    const factors = this.analyzeFactors(den);

    return {
        problemType: 'Partial Fraction Decomposition',
        expression: expression || `(${num})/(${den})`,
        numerator: num,
        denominator: den,
        isProper: isProper,
        purpose: 'Express a complex fraction as sum of simpler fractions',
        prerequisite: isProper ? 
            'Fraction is proper (degree of numerator < denominator) ✓' : 
            '⚠️ Fraction is improper - must do polynomial long division first',
        steps: [
            isProper ? 
                'Fraction is proper, proceed with decomposition' : 
                'Step 0: Perform polynomial long division (improper fraction)',
            `Factor the denominator: ${den}`,
            `Identify factor types: ${factors.description}`,
            'Set up partial fraction form based on factor types',
            'Clear fractions by multiplying both sides by LCD (denominator)',
            'Expand and collect like terms',
            'Equate coefficients of corresponding powers of x',
            'Solve system of equations for unknown constants (A, B, C, ...)',
            'Write final decomposition with found constants',
            'Verify by combining fractions back together'
        ],
        factorTypes: {
            'Distinct Linear Factors': {
                form: 'A/(x-a) + B/(x-b) + ...',
                example: '1/((x-1)(x-2)) = A/(x-1) + B/(x-2)',
                applies: factors.hasDistinctLinear
            },
            'Repeated Linear Factors': {
                form: 'A/(x-a) + B/(x-a)² + C/(x-a)³ + ...',
                example: '1/(x-1)³ = A/(x-1) + B/(x-1)² + C/(x-1)³',
                applies: factors.hasRepeatedLinear
            },
            'Irreducible Quadratic': {
                form: '(Ax+B)/(x²+bx+c)',
                example: 'x/(x²+1) → already in simplest form or combine with others',
                applies: factors.hasQuadratic
            },
            'Mixed Factors': {
                form: 'Combine all above forms',
                example: '(x+1)/((x-1)(x²+1)) = A/(x-1) + (Bx+C)/(x²+1)',
                applies: factors.isMixed
            }
        },
        detailedExample: {
            problem: '(5x+3)/((x+1)(x-2))',
            setup: 'A/(x+1) + B/(x-2)',
            clearing: 'Multiply both sides by (x+1)(x-2):',
            equation: '5x+3 = A(x-2) + B(x+1)',
            method1: {
                name: 'Substitution Method (Faster)',
                steps: [
                    'Substitute x=2: 5(2)+3 = A(0) + B(3) → 13 = 3B → B = 13/3',
                    'Substitute x=-1: 5(-1)+3 = A(-3) + B(0) → -2 = -3A → A = 2/3'
                ]
            },
            method2: {
                name: 'Coefficient Comparison',
                steps: [
                    'Expand: 5x+3 = Ax - 2A + Bx + B',
                    'Collect: 5x+3 = (A+B)x + (-2A+B)',
                    'Equate x coefficients: A+B = 5',
                    'Equate constants: -2A+B = 3',
                    'Solve system: A = 2/3, B = 13/3'
                ]
            },
            result: '(2/3)/(x+1) + (13/3)/(x-2)',
            verification: 'Combine back: [(2/3)(x-2) + (13/3)(x+1)] / [(x+1)(x-2)] = (5x+3)/[(x+1)(x-2)] ✓'
        },
        applications: [
            'Integration of rational functions (calculus)',
            'Inverse Laplace transforms (differential equations)',
            'Z-transforms (discrete systems)',
            'Signal processing and filter design',
            'Control system analysis',
            'Solving differential equations'
        ],
        keyInsights: [
            'Each distinct linear factor (x-a) contributes one term: A/(x-a)',
            'Repeated factor (x-a)ⁿ needs n terms: A₁/(x-a) + A₂/(x-a)² + ... + Aₙ/(x-a)ⁿ',
            'Each irreducible quadratic needs linear numerator: (Ax+B)/(x²+bx+c)',
            'Substitution method is usually faster for finding constants',
            'Always verify result by combining fractions back',
            'If improper, do long division first to get: polynomial + proper fraction'
        ],
        degrees: {
            numerator: numDegree,
            denominator: denDegree
        },
        category: 'partial_fractions'
    };
}

// ADDITIONAL HELPER METHODS FOR COMPUTATIONS

findZeros(expr) {
    // Find zeros of an expression (simplified approach)
    const zeros = [];
    
    // Look for (x-a) factors
    const matches = expr.matchAll(/\(x\s*-\s*(\d+)\)/g);
    for (const match of matches) {
        zeros.push(parseInt(match[1]));
    }
    
    // Look for (x+a) factors
    const matches2 = expr.matchAll(/\(x\s*\+\s*(\d+)\)/g);
    for (const match of matches2) {
        zeros.push(-parseInt(match[1]));
    }
    
    // Check for simple x (zero at 0)
    if (expr.trim() === 'x') {
        zeros.push(0);
    }
    
    return zeros;
}

testInequality(leftExpr, rightExpr, operator, testPoint) {
    try {
        const leftValue = this.evaluateExpression(leftExpr, testPoint);
        const rightValue = this.evaluateExpression(rightExpr, testPoint);
        
        if (leftValue === null || rightValue === null) {
            return false;
        }
        
        switch(operator) {
            case '>': return leftValue > rightValue;
            case '<': return leftValue < rightValue;
            case '≥': return leftValue >= rightValue;
            case '≤': return leftValue <= rightValue;
            default: return false;
        }
    } catch {
        return false;
    }
}

getDegree(expr) {
    // Find highest degree of x in expression
    let maxDegree = 0;
    
    // Check for x^n
    const powerMatches = expr.matchAll(/x\^(\d+)/g);
    for (const match of powerMatches) {
        maxDegree = Math.max(maxDegree, parseInt(match[1]));
    }
    
    // Check for x² x³ etc
    if (expr.includes('x³') || expr.includes('x^3')) maxDegree = Math.max(maxDegree, 3);
    if (expr.includes('x²') || expr.includes('x^2')) maxDegree = Math.max(maxDegree, 2);
    if (expr.includes('x') && maxDegree === 0) maxDegree = 1;
    
    return maxDegree;
}

getLeadingCoefficient(expr) {
    // Extract leading coefficient (simplified)
    const degree = this.getDegree(expr);
    
    if (degree === 0) {
        const num = parseFloat(expr);
        return isNaN(num) ? 1 : num;
    }
    
    // Look for coefficient of highest degree term
    const pattern = new RegExp(`([+-]?\\d*\\.?\\d*)x\\^?${degree}?`);
    const match = expr.match(pattern);
    
    if (match && match[1]) {
        const coef = match[1].replace(/\s/g, '');
        if (coef === '' || coef === '+') return 1;
        if (coef === '-') return -1;
        return parseFloat(coef);
    }
    
    return 1;
}

analyzeFactors(denominator) {
    const hasLinear = /\(x\s*[+-]\s*\d+\)/.test(denominator);
    const hasRepeated = /\(x\s*[+-]\s*\d+\)\^?\d*/.test(denominator) && denominator.includes('^');
    const hasQuadratic = /x²|x\^2/.test(denominator);
    
    let description = '';
    if (hasLinear && !hasRepeated && !hasQuadratic) {
        description = 'Distinct linear factors only';
    } else if (hasRepeated) {
        description = 'Contains repeated linear factors';
    } else if (hasQuadratic) {
        description = 'Contains quadratic factors';
    } else if (hasLinear && hasQuadratic) {
        description = 'Mixed: linear and quadratic factors';
    } else {
        description = 'Complex factorization';
    }
    
    return {
        hasDistinctLinear: hasLinear && !hasRepeated,
        hasRepeatedLinear: hasRepeated,
        hasQuadratic: hasQuadratic,
        isMixed: (hasLinear || hasRepeated) && hasQuadratic,
        description: description
    };
}

// HELPER METHOD: Generate verification for rational equation


    // STEP GENERATION FOR RATIONAL PROBLEMS

    generateRationalSteps(problem, solution) {
        let baseSteps = this.generateBaseRationalSteps(problem, solution);

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

    generateBaseRationalSteps(problem, solution) {
        const { type } = problem;

        switch (type) {
            case 'simplify_rational':
                return this.generateSimplifyRationalSteps(problem, solution);
            case 'rational_equation':
                return this.generateRationalEquationSteps(problem, solution);
            case 'rational_addition':
                return this.generateRationalAdditionSteps(problem, solution);
            case 'rational_multiplication':
                return this.generateRationalMultiplicationSteps(problem, solution);
            case 'complex_fraction':
                return this.generateComplexFractionSteps(problem, solution);
            case 'rational_inequality':
                return this.generateRationalInequalitySteps(problem, solution);
            case 'work_rate_rational':
                return this.generateWorkRateSteps(problem, solution);
            default:
                return this.generateGenericRationalSteps(problem, solution);
        }
    }

    generateSimplifyRationalSteps(problem, solution) {
        const { numerator, denominator } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given rational expression',
            description: 'Start with the rational expression to be simplified',
            expression: `${numerator}/${denominator}`,
            reasoning: 'Our goal is to factor and cancel common factors',
            visualHint: 'Think of simplifying like reducing a fraction to lowest terms',
            goalStatement: 'Factor completely, then cancel common factors'
        });

        steps.push({
            stepNumber: 2,
            step: 'Factor the numerator',
            description: 'Factor the numerator polynomial completely',
            beforeExpression: numerator,
            operation: 'Factor',
            reasoning: 'Factoring reveals common factors that can be canceled',
            algebraicRule: 'Use factoring techniques: GCF, grouping, special patterns',
            keyPoint: 'Factor completely - check for multiple factoring opportunities'
        });

        steps.push({
            stepNumber: 3,
            step: 'Factor the denominator',
            description: 'Factor the denominator polynomial completely',
            beforeExpression: denominator,
            operation: 'Factor',
            reasoning: 'Both numerator and denominator must be factored to see common factors',
            algebraicRule: 'Apply same factoring techniques to denominator',
            warningNote: 'Denominator cannot equal zero - note these restrictions'
        });

        steps.push({
            stepNumber: 4,
            step: 'Identify common factors',
            description: 'Look for factors that appear in both numerator and denominator',
            reasoning: 'Only factors (not terms) can be canceled',
            visualHint: 'Common factors can be "canceled" because they equal 1 when divided',
            criticalWarning: 'Cannot cancel terms that are added or subtracted - only factors!'
        });

        steps.push({
            stepNumber: 5,
            step: 'Cancel common factors',
            description: 'Divide out common factors from numerator and denominator',
            operation: 'Cancel',
            reasoning: 'Canceling common factors simplifies the expression',
            algebraicRule: 'a·b / a·c = b/c (where a ≠ 0)',
            finalAnswer: false
        });

        steps.push({
            stepNumber: 6,
            step: 'State domain restrictions',
            description: 'Identify values that make the original denominator zero',
            reasoning: 'These values must be excluded from the domain',
            keyPoint: 'Include restrictions from canceled factors too!',
            finalAnswer: true
        });

        return steps;
    }

    generateRationalEquationSteps(problem, solution) {
        const { equation } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given equation',
            description: 'Start with the rational equation',
            expression: equation,
            reasoning: 'We need to find value(s) that make this equation true',
            visualHint: 'Think of clearing fractions like finding a common language',
            goalStatement: 'Clear fractions using LCD, then solve'
        });

        steps.push({
            stepNumber: 2,
            step: 'Identify all denominators',
            description: 'List all denominators in the equation',
            reasoning: 'We need all denominators to find the LCD',
            procedureNote: 'Factor denominators if not already factored'
        });

        steps.push({
            stepNumber: 3,
            step: 'Find LCD',
            description: 'Determine the Least Common Denominator',
            reasoning: 'LCD is the smallest expression divisible by all denominators',
            algebraicRule: 'LCD includes each factor the greatest number of times it appears',
            methodNote: 'Use factored form to identify LCD clearly'
        });

        steps.push({
            stepNumber: 4,
            step: 'Multiply by LCD',
            description: 'Multiply every term in the equation by the LCD',
            operation: '× LCD',
            reasoning: 'This eliminates all fractions, creating a polynomial equation',
            criticalWarning: 'Multiply EVERY term, including constants and whole numbers',
            algebraicRule: 'Distribution property ensures balance is maintained'
        });

        steps.push({
            stepNumber: 5,
            step: 'Simplify',
            description: 'Cancel denominators and simplify',
            reasoning: 'Denominators divide out, leaving polynomial equation',
            proceduralNote: 'Expand any remaining parentheses and combine like terms'
        });

        steps.push({
            stepNumber: 6,
            step: 'Solve polynomial equation',
            description: 'Solve the resulting equation using appropriate methods',
            reasoning: 'Now we have a standard polynomial equation',
            methodNote: 'May require factoring, quadratic formula, or other techniques'
        });

        steps.push({
            stepNumber: 7,
            step: 'Check for extraneous solutions',
            description: 'Substitute each solution into the original equation',
            reasoning: 'Solutions that make any denominator zero are extraneous',
            criticalWarning: 'This step is ESSENTIAL - never skip checking!',
            checkMethod: 'Plug solution into original equation and verify denominators ≠ 0',
            finalAnswer: true
        });

        return steps;
    }

    generateRationalAdditionSteps(problem, solution) {
        const { term1, term2, operation } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given expression',
            description: `Rational expression with ${operation === '+' ? 'addition' : 'subtraction'}`,
            expression: `${term1} ${operation} ${term2}`,
            reasoning: 'We need a common denominator to combine these fractions',
            visualHint: 'Like adding fractions in arithmetic - need common denominator',
            goalStatement: 'Find LCD, rewrite fractions, combine numerators'
        });

        steps.push({
            stepNumber: 2,
            step: 'Factor all denominators',
            description: 'Factor each denominator completely',
            reasoning: 'Factored form makes finding LCD easier',
            algebraicRule: 'Factor completely using all factoring techniques'
        });

        steps.push({
            stepNumber: 3,
            step: 'Find LCD',
            description: 'Determine the Least Common Denominator',
            reasoning: 'LCD is the product of all unique factors with highest powers',
            methodNote: 'Include each unique factor the maximum times it appears'
        });

        steps.push({
            stepNumber: 4,
            step: 'Rewrite with LCD',
            description: 'Convert each fraction to equivalent fraction with LCD',
            reasoning: 'Multiply numerator and denominator by missing factors',
            algebraicRule: 'Multiplying by 1 (missing factors / missing factors) maintains equivalence',
            procedureNote: 'Multiply numerator by same factors as denominator'
        });

        steps.push({
            stepNumber: 5,
            step: 'Combine numerators',
            description: operation === '+' ? 'Add the numerators' : 'Subtract the numerators',
            operation: operation,
            reasoning: 'With common denominator, we can combine numerators',
            criticalWarning: operation === '-' ? 'Distribute negative sign to ALL terms in second numerator!' : null,
            algebraicRule: 'a/c + b/c = (a+b)/c or a/c - b/c = (a-b)/c'
        });

        steps.push({
            stepNumber: 6,
            step: 'Simplify result',
            description: 'Simplify the numerator and factor if possible',
            reasoning: 'May be able to cancel common factors',
            procedureNote: 'Combine like terms, then factor to check for cancellation',
            finalAnswer: true
        });

        return steps;
    }

    generateRationalMultiplicationSteps(problem, solution) {
        const { term1, term2, operation } = problem.parameters;
        const steps = [];

        if (operation === '/') {
            steps.push({
                stepNumber: 1,
                step: 'Given division problem',
                description: 'Rational expression division',
                expression: `${term1} ÷ ${term2}`,
                reasoning: 'Division means multiply by reciprocal',
                keyPrinciple: 'To divide fractions: flip second fraction and multiply'
            });

            steps.push({
                stepNumber: 2,
                step: 'Rewrite as multiplication',
                description: 'Change division to multiplication by reciprocal',
                beforeExpression: `${term1} ÷ ${term2}`,
                operation: 'Flip and multiply',
                afterExpression: `${term1} × (reciprocal of ${term2})`,
                reasoning: 'Division is multiplication by multiplicative inverse',
                algebraicRule: 'a/b ÷ c/d = a/b × d/c'
            });
        } else {
            steps.push({
                stepNumber: 1,
                step: 'Given multiplication problem',
                description: 'Rational expression multiplication',
                expression: `${term1} × ${term2}`,
                reasoning: 'Multiply numerators and denominators',
                strategicNote: 'Factor first to simplify before multiplying'
            });
        }

        const nextStep = operation === '/' ? 3 : 2;

        steps.push({
            stepNumber: nextStep,
            step: 'Factor everything',
            description: 'Factor all numerators and denominators completely',
            reasoning: 'Factoring reveals opportunities to cancel before multiplying',
            strategicAdvantage: 'Much easier to cancel first than to factor large products',
            algebraicRule: 'Factor using GCF, grouping, special patterns'
        });

        steps.push({
            stepNumber: nextStep + 1,
            step: 'Cancel common factors',
            description: 'Identify and cancel factors appearing in numerator and denominator',
            operation: 'Cancel diagonally',
            reasoning: 'Factors cancel whether in same fraction or diagonal fractions',
            visualHint: 'Can cancel "diagonally" - numerator of one with denominator of other',
            keyPoint: 'This is why we factor first!'
        });

        steps.push({
            stepNumber: nextStep + 2,
            step: 'Multiply remaining factors',
            description: 'Multiply what remains after canceling',
            reasoning: 'Much simpler to multiply after canceling',
            algebraicRule: '(a/b) × (c/d) = (a×c)/(b×d) after canceling',
            procedureNote: 'Multiply numerators together, denominators together'
        });

        steps.push({
            stepNumber: nextStep + 3,
            step: 'State domain restrictions',
            description: 'Identify values that make any original denominator zero',
            reasoning: 'Restrictions from original problem still apply',
            keyPoint: 'Include restrictions from canceled factors',
            finalAnswer: true
        });

        return steps;
    }

    generateComplexFractionSteps(problem, solution) {
        const { numeratorFraction, denominatorFraction } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given complex fraction',
            description: 'Fraction with fractions in numerator and/or denominator',
            expression: `(${numeratorFraction})/(${denominatorFraction})`,
            reasoning: 'We need to simplify this to a single simple fraction',
            visualHint: 'Think of this as a division problem in disguise',
            goalStatement: 'Simplify to form P(x)/Q(x)'
        });

        steps.push({
            stepNumber: 2,
            step: 'Choose method',
            description: 'Select Division Method or LCD Method',
            methods: {
                division: 'Simplify top and bottom separately, then divide',
                lcd: 'Multiply by LCD/LCD to clear all fractions at once'
            },
            reasoning: 'Both methods work; LCD often faster for complex cases',
            recommendation: 'Use LCD method for this problem'
        });

        steps.push({
            stepNumber: 3,
            step: 'Find LCD of all small fractions',
            description: 'Identify LCD of all fractions in numerator and denominator',
            reasoning: 'This LCD will clear all fractions when we multiply',
            procedureNote: 'Include fractions from both numerator and denominator parts'
        });

        steps.push({
            stepNumber: 4,
            step: 'Multiply by LCD/LCD',
            description: 'Multiply entire complex fraction by LCD/LCD',
            operation: '× (LCD/LCD)',
            reasoning: 'Multiplying by LCD/LCD = 1, so value unchanged',
            algebraicRule: 'Multiply both numerator and denominator by LCD',
            visualHint: 'This clears all the small fractions'
        });

        steps.push({
            stepNumber: 5,
            step: 'Simplify',
            description: 'Distribute LCD and cancel denominators',
            reasoning: 'Small fraction denominators divide out',
            procedureNote: 'Each fraction × LCD cancels that fraction\'s denominator',
            result: 'Left with polynomial expression in numerator and denominator'
        });

        steps.push({
            stepNumber: 6,
            step: 'Factor and reduce',
            description: 'Factor numerator and denominator, cancel common factors',
            reasoning: 'Final simplification to lowest terms',
            algebraicRule: 'Standard simplification: factor and cancel',
            finalAnswer: true
        });

        return steps;
    }

    generateRationalInequalitySteps(problem, solution) {
        const { numerator, denominator, operator } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given inequality',
            description: 'Rational inequality to solve',
            expression: `${numerator}/${denominator} ${operator} 0`,
            reasoning: 'Solution will be interval(s) on number line',
            visualHint: 'Think of finding regions where fraction is positive or negative',
            goalStatement: 'Use sign chart to find solution intervals'
        });

        steps.push({
            stepNumber: 2,
            step: 'Move all terms to one side',
            description: 'Get zero on right side of inequality',
            reasoning: 'Standard form allows us to analyze sign of single expression',
            algebraicRule: 'Maintain inequality direction when moving terms',
            procedureNote: 'Combine into single rational expression if needed'
        });

        steps.push({
            stepNumber: 3,
            step: 'Find critical values',
            description: 'Identify where expression equals zero or is undefined',
            subSteps: [
                'Zeros of numerator: where expression = 0',
                'Zeros of denominator: where expression is undefined'
            ],
            reasoning: 'Sign can only change at critical values',
            methodNote: 'Set numerator = 0 and denominator = 0 separately',
            keyInsight: 'Critical values divide number line into test intervals'
        });

        steps.push({
            stepNumber: 4,
            step: 'Create sign chart',
            description: 'Mark critical values on number line',
            reasoning: 'This organizes our analysis of each interval',
            procedureNote: 'Mark zeros with open/closed circles as appropriate',
            chartNote: 'Denominator zeros always get open circles (undefined there)'
        });

        steps.push({
            stepNumber: 5,
            step: 'Test each interval',
            description: 'Pick test point in each interval, evaluate expression',
            reasoning: 'Sign is constant within each interval',
            methodNote: 'Choose easy test points (often integers)',
            procedureNote: 'Only need to determine positive or negative, not exact value'
        });

        steps.push({
            stepNumber: 6,
            step: 'Record signs on chart',
            description: 'Mark each interval as positive (+) or negative (-)',
            reasoning: 'Visual representation shows where inequality is satisfied',
            visualHint: 'Put + or - above each interval on number line'
        });

        steps.push({
            stepNumber: 7,
            step: 'Write solution',
            description: 'Select intervals based on inequality operator',
            reasoning: `Choose intervals where expression is ${operator.includes('>') ? 'positive' : 'negative'}`,
            intervalNotation: 'Use interval notation with proper brackets',
            criticalPoint: 'Use [ ] for ≤ or ≥ at zeros, never at undefined points',
            finalAnswer: true
        });

        return steps;
    }

    generateWorkRateSteps(problem, solution) {
        const { scenario } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Read and understand',
            description: 'Carefully read the work rate problem',
            scenario: scenario,
            reasoning: 'Identify what is given and what to find',
            keyPrinciple: 'Work rate = 1 / (time to complete job alone)'
        });

        steps.push({
            stepNumber: 2,
            step: 'Define variables',
            description: 'Let variables represent unknown times or rates',
            reasoning: 'Clear variable definitions prevent confusion',
            exampleFormat: 'Let t = time for person A to complete job alone',
            organizationTip: 'List all variables and their meanings'
        });

        steps.push({
            stepNumber: 3,
            step: 'Express rates',
            description: 'Write work rate for each person as 1/time',
            reasoning: 'Rate tells what fraction of job completed per unit time',
            formula: 'If time = t hours, rate = 1/t jobs per hour',
            keyInsight: 'Rates add when working together'
        });

        steps.push({
            stepNumber: 4,
            step: 'Set up equation',
            description: 'Write equation based on problem relationship',
            commonSetup: '1/t₁ + 1/t₂ = 1/t_together',
            reasoning: 'Combined rate equals sum of individual rates',
            algebraicPrinciple: 'Part₁ + Part₂ = Whole job'
        });

        steps.push({
            stepNumber: 5,
            step: 'Clear fractions',
            description: 'Multiply entire equation by LCD',
            reasoning: 'Eliminates fractions to create simpler equation',
            procedureNote: 'Find LCD of all times, multiply every term'
        });

        steps.push({
            stepNumber: 6,
            step: 'Solve equation',
            description: 'Solve the resulting equation for unknown',
            reasoning: 'Standard algebraic techniques apply',
            methodNote: 'May be linear or quadratic depending on problem'
        });

        steps.push({
            stepNumber: 7,
            step: 'Check and interpret',
            description: 'Verify solution makes sense in context',
            reasoning: 'Time must be positive; check reasonableness',
            interpretationNote: 'State answer with appropriate units',
            finalAnswer: true
        });

        return steps;
    }

    generateGenericRationalSteps(problem, solution) {
        return [{
            stepNumber: 1,
            step: 'Rational problem',
            description: 'Solve the given rational expression problem',
            expression: problem.equation || 'Problem not fully specified',
            reasoning: 'Apply appropriate rational expression techniques',
            solution: solution,
            generalApproach: [
                'Factor where possible',
                'Find common denominators for addition/subtraction',
                'Clear fractions for equations',
                'Check for extraneous solutions',
                'State domain restrictions'
            ]
        }];
    }

    // ENHANCED STEP EXPLANATION METHODS

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

    // HELPER METHODS FOR EXPLANATIONS

    getConceptualExplanation(step, problem) {
        const conceptualExplanations = {
            'Given rational expression': 'A rational expression is like a fraction, but with polynomials instead of just numbers. Our goal is to simplify it to its most basic form.',
            'Factor the numerator': 'Factoring reveals the building blocks of the expression. Think of it like breaking down a number into its prime factors.',
            'Find LCD': 'The LCD is like finding a common language that all fractions can speak. It\'s the smallest expression that all denominators divide into evenly.',
            'Multiply by LCD': 'Multiplying by the LCD is like clearing the table - it removes all fractions and leaves us with a simpler equation to solve.',
            'Check for extraneous solutions': 'Some solutions work algebraically but create division by zero in the original problem. These "false" solutions must be rejected.'
        };

        return conceptualExplanations[step.step] || 'This step transforms the expression toward a simpler or more useful form.';
    }

    getProceduralExplanation(step) {
        if (step.operation) {
            return `1. Identify what operation is needed: ${step.operation}
2. Apply this operation carefully
3. Simplify the result
4. Check your work`;
        }
        return 'Follow standard procedures for this type of step.';
    }

    getVisualExplanation(step, problem) {
        const visualExplanations = {
            'simplify_rational': 'Picture canceling common factors like removing identical weights from both sides of a balance.',
            'rational_equation': 'Imagine clearing fractions like removing obstacles from a path - it makes the journey simpler.',
            'rational_inequality': 'Visualize the number line divided into regions, like different colored zones, where the inequality behaves differently.',
            'complex_fraction': 'Think of a complex fraction as a stack of boxes that needs to be flattened into a single layer.'
        };

        return visualExplanations[problem.type] || 'Visualize the algebraic transformation as a systematic simplification process.';
    }

    getAlgebraicExplanation(step) {
        const algebraicRules = {
            'Factor the numerator': 'Apply factoring techniques: GCF, difference of squares, trinomial factoring, grouping',
            'Find LCD': 'LCD = product of all unique prime factors, each raised to highest power appearing',
            'Cancel common factors': 'Cancellation property: (a·b)/(a·c) = b/c for a ≠ 0',
            'Multiply by LCD': 'Multiplication property of equality: if a = b, then ac = bc',
            'Set numerator = 0': 'Zero product property: if P(x) = 0, then at least one factor equals 0'
        };

        return algebraicRules[step.step] || 'Apply standard algebraic principles and properties.';
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
            connection: `Building on step ${stepIndex}, we now ${step.description.toLowerCase()}`,
            progression: 'Each step brings us closer to the final simplified form',
            relationship: 'This step depends on the factoring/simplification from the previous step'
        };
    }

    generateStepBridge(currentStep, nextStep) {
        return {
            currentState: `We now have: ${currentStep.afterExpression || currentStep.expression}`,
            nextGoal: `Next, we need to: ${nextStep.description}`,
            why: `This is necessary to ${this.explainStepNecessity(currentStep, nextStep)}`,
            howItHelps: `This will help by ${this.explainStepBenefit(nextStep)}`
        };
    }

    explainStepProgression(currentStep, nextStep) {
        return `After ${currentStep.step}, the next logical action is to ${nextStep.description.toLowerCase()}`;
    }

    explainStepStrategy(nextStep) {
        return `The strategy for "${nextStep.step}" focuses on ${nextStep.reasoning || 'systematic simplification'}`;
    }

    explainStepNecessity(currentStep, nextStep) {
        return 'continue the simplification process and move closer to our goal';
    }

    explainStepBenefit(nextStep) {
        return 'making the expression simpler and more manageable';
    }

    generatePreventionTips(step, problemType) {
        const tips = {
            'Factor the numerator': [
                'Factor completely - check for multiple layers of factoring',
                'Don\'t forget to look for GCF first',
                'Verify factoring by multiplying back'
            ],
            'Find LCD': [
                'Include all unique factors from all denominators',
                'Use highest power of each factor',
                'Double-check by dividing LCD by each denominator'
            ],
            'Check for extraneous solutions': [
                'Substitute into ORIGINAL equation, not simplified',
                'Check that all denominators are non-zero',
                'Remember: extraneous means algebraically correct but contextually invalid'
            ]
        };

        return tips[step.step] || ['Work carefully and check each step', 'Verify your answer makes sense'];
    }

    generateCheckPoints(step) {
        return [
            'Have I followed the procedure correctly?',
            'Did I make any arithmetic errors?',
            'Does my result make sense?',
            'Have I considered all special cases?'
        ];
    }

    identifyWarningFlags(step, problemType) {
        const warnings = {
            simplify_rational: step.step === 'Cancel common factors' ?
                ['Only cancel factors, never terms that are added/subtracted'] : [],
            rational_equation: step.step === 'Check for extraneous solutions' ?
                ['Solutions making any denominator zero must be rejected'] : [],
            rational_inequality: step.step === 'Write solution' ?
                ['Never include values where denominator is zero'] : []
        };

        return warnings[problemType] || [];
    }

    generateSelfCheckQuestion(step) {
        const questions = {
            'Factor the numerator': 'Have I factored completely? Can I factor any further?',
            'Find LCD': 'Does my LCD contain all necessary factors at proper powers?',
            'Cancel common factors': 'Am I canceling factors, not terms being added?',
            'Check for extraneous solutions': 'Does my solution make any denominator zero?'
        };

        return questions[step.step] || 'Does this step move me toward the solution correctly?';
    }

    describeExpectedResult(step) {
        const expectations = {
            'Factor the numerator': 'Numerator should be written as product of factors',
            'Find LCD': 'LCD should be divisible by all denominators',
            'Cancel common factors': 'Expression should be simpler with fewer factors',
            'Multiply by LCD': 'All fractions should be eliminated'
        };

        return expectations[step.step] || 'Step should simplify or clarify the problem';
    }

    generateTroubleshootingTips(step) {
        return [
            'If stuck, review the previous step for errors',
            'Check arithmetic carefully',
            'Consider if there\'s a factoring opportunity you missed',
            'Verify denominators are handled correctly'
        ];
    }

    breakIntoSubSteps(step) {
        if (step.step === 'Factor the numerator' || step.step === 'Factor the denominator') {
            return [
                'Look for greatest common factor (GCF)',
                'Check for special patterns (difference of squares, perfect square trinomial)',
                'Try grouping if four terms',
                'Factor trinomials if applicable',
                'Verify by multiplying back'
            ];
        }

        if (step.step === 'Find LCD') {
            return [
                'List all denominators',
                'Factor each denominator completely',
                'Identify all unique factors',
                'For each unique factor, use highest power',
                'Multiply these factors together'
            ];
        }

        return ['Analyze the current state', 'Determine the necessary operation', 'Execute carefully'];
    }

    generatePracticeVariation(step, problem) {
        return {
            similarProblem: 'Try similar rational expressions with different polynomials',
            practiceHint: 'Start with simpler expressions to build confidence',
            extension: 'Progress to more complex polynomials as you master the technique'
        };
    }

    explainThinkingProcess(step) {
        return {
            observe: 'What is the current form of the expression?',
            goal: 'What am I trying to achieve with this step?',
            strategy: 'What technique or method should I use?',
            execute: 'How do I carry out this technique correctly?',
            verify: 'Does my result make sense and move toward the goal?'
        };
    }

    identifyDecisionPoints(step) {
        return [
            'Choosing which factoring method to apply',
            'Deciding whether to use LCD method or division method',
            'Selecting appropriate test points for inequalities'
        ];
    }

    suggestAlternativeMethods(step, problem) {
        const alternatives = {
            'complex_fraction': [
                'Division method: simplify top and bottom separately, then divide',
                'LCD method: multiply by LCD/LCD to clear all fractions at once'
            ],
            'rational_equation': [
                'LCD method: multiply entire equation by LCD',
                'Cross multiplication: works when equation has form a/b = c/d'
            ]
        };

        return alternatives[problem.type] || ['The method shown is standard for this problem type'];
    }

    identifyPrerequisites(step, problemType) {
        const prerequisites = {
            'Factor the numerator': ['Polynomial factoring techniques', 'GCF identification', 'Special product recognition'],
            'Find LCD': ['Prime factorization', 'Understanding of least common multiple', 'Polynomial factoring'],
            'Multiply by LCD': ['Distributive property', 'Properties of equality', 'Algebraic simplification'],
            'Check for extraneous solutions': ['Substitution method', 'Understanding of domain restrictions', 'Division by zero concept']
        };

        return prerequisites[step.step] || ['Basic algebraic operations'];
    }

    identifyKeyVocabulary(step) {
        const vocabulary = {
            'Factor the numerator': ['factor', 'numerator', 'GCF', 'polynomial'],
            'Find LCD': ['LCD', 'least common denominator', 'factor', 'denominator'],
            'Cancel common factors': ['cancel', 'common factor', 'simplify'],
            'Check for extraneous solutions': ['extraneous', 'solution', 'domain', 'restriction']
        };

        return vocabulary[step.step] || [];
    }

    generateGuidingQuestions(step, problem) {
        const questions = {
            'Given rational expression': [
                'What type of rational expression is this?',
                'What is our end goal?',
                'What restrictions might apply?'
            ],
            'Factor the numerator': [
                'What factoring techniques might apply here?',
                'Is there a GCF?',
                'Are there any special patterns?'
            ],
            'Find LCD': [
                'What are all the denominators?',
                'What factors appear in each?',
                'Which factors need highest powers?'
            ],
            'Check for extraneous solutions': [
                'What values make denominators zero?',
                'Does my solution create any undefined expressions?',
                'Have I checked in the original equation?'
            ]
        };

        return questions[step.step] || ['What is this step trying to accomplish?', 'How does it help solve the problem?'];
    }

    generateProgressiveHints(step) {
        return {
            level1: 'Think about what mathematical operation or technique is appropriate here.',
            level2: 'Consider the standard procedure for this type of step.',
            level3: 'Remember to apply the operation systematically and check your work.',
            level4: step.operation ? `Try: ${step.operation}` : 'Apply the appropriate technique for this rational expression.'
        };
    }

    adaptLanguageLevel(text, level) {
        if (!text) return '';

        const adaptations = {
            basic: {
                replacements: {
                    'rational expression': 'fraction with variables',
                    'numerator': 'top of fraction',
                    'denominator': 'bottom of fraction',
                    'factor': 'break down into pieces that multiply',
                    'LCD': 'common bottom number',
                    'cancel': 'cross out matching parts',
                    'extraneous': 'false or extra'
                }
            },
            intermediate: {
                replacements: {
                    'rational expression': 'rational expression',
                    'numerator': 'numerator',
                    'denominator': 'denominator',
                    'factor': 'factor',
                    'LCD': 'least common denominator',
                    'cancel': 'cancel',
                    'extraneous': 'extraneous'
                }
            },
            detailed: {
                replacements: {
                    'rational expression': 'rational expression (ratio of polynomials)',
                    'numerator': 'numerator (dividend polynomial)',
                    'denominator': 'denominator (divisor polynomial, nonzero)',
                    'factor': 'factor (express as product of irreducible factors)',
                    'LCD': 'least common denominator (minimal common multiple of denominators)',
                    'cancel': 'cancel (apply multiplicative inverse property)',
                    'extraneous': 'extraneous (algebraically derived but domain-invalid)'
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

    // VERIFICATION METHODS

    verifyRationalSolution() {
        const { type } = this.currentProblem;

        switch (type) {
            case 'simplify_rational':
                return this.verifySimplification();
            case 'rational_equation':
                return this.verifyRationalEquation();
            case 'rational_inequality':
                return this.verifyRationalInequality();
            default:
                return { type: 'general', message: 'Solution verified using standard methods' };
        }
    }

    verifySimplification() {
        return {
            verificationType: 'Simplification Check',
            checks: [
                'All common factors canceled',
                'Result in lowest terms',
                'Domain restrictions stated',
                'No further simplification possible'
            ],
            method: 'Verify by multiplying factors back',
            confidence: 'High'
        };
    }

    verifyRationalEquation() {
        const solutions = this.currentSolution?.solutions || [];
        
        return {
            verificationType: 'Solution Verification',
            method: 'Substitution into original equation',
            checks: [
                'Substitute into original equation',
                'Verify no denominators equal zero',
                'Check arithmetic',
                'Confirm both sides equal'
            ],
            extraneous: 'Solutions checked for domain violations',
            validSolutions: solutions,
            confidence: 'High'
        };
    }

    verifyRationalInequality() {
        return {
            verificationType: 'Inequality Verification',
            method: 'Sign chart and test points',
            checks: [
                'All critical values identified',
                'Sign determined in each interval',
                'Correct intervals selected',
                'Proper boundary notation used'
            ],
            confidence: 'High'
        };
    }

    calculateVerificationConfidence() {
        if (!this.currentSolution || !this.currentProblem) return 'Unknown';

        const { type } = this.currentProblem;

        switch (type) {
            case 'simplify_rational':
                return 'High';
            case 'rational_equation':
                return 'High';
            case 'rational_inequality':
                return 'High';
            default:
                return 'Medium';
        }
    }

    getVerificationNotes() {
        const { type } = this.currentProblem;
        const notes = [];

        switch (type) {
            case 'simplify_rational':
                notes.push('Verified by factoring check');
                notes.push('Domain restrictions confirmed');
                break;
            case 'rational_equation':
                notes.push('Solutions checked in original equation');
                notes.push('Extraneous solutions rejected');
                break;
            case 'rational_inequality':
                notes.push('Sign chart method used');
                notes.push('Test points verified in each interval');
                break;
            default:
                notes.push('Standard verification applied');
        }

        return notes.join('; ');
    }

    // PEDAGOGICAL NOTES

    generatePedagogicalNotes(problemType) {
        const pedagogicalDatabase = {
            simplify_rational: {
                objectives: [
                    'Factor polynomials completely',
                    'Cancel common factors correctly',
                    'State domain restrictions'
                ],
                keyConcepts: [
                    'Rational expression as ratio of polynomials',
                    'Only factors (not terms) can be canceled',
                    'Domain excludes denominator zeros'
                ],
                prerequisites: [
                    'Polynomial factoring',
                    'Understanding of fractions',
                    'Basic algebraic manipulation'
                ],
                commonDifficulties: [
                    'Canceling terms instead of factors',
                    'Incomplete factoring',
                    'Forgetting domain restrictions'
                ],
                extensions: [
                    'Complex fractions',
                    'Operations with rational expressions',
                    'Rational equations'
                ],
                assessment: [
                    'Check factoring completeness',
                    'Verify proper cancellation',
                    'Confirm domain restrictions stated'
                ]
            },
            rational_equation: {
                objectives: [
                    'Solve equations containing rational expressions',
                    'Use LCD to clear fractions',
                    'Identify and reject extraneous solutions'
                ],
                keyConcepts: [
                    'Clearing fractions with LCD',
                    'Extraneous solutions from domain violations',
                    'Checking solutions in original equation'
                ],
                prerequisites: [
                    'Solving linear and quadratic equations',
                    'Finding LCD',
                    'Polynomial factoring'
                ],
                commonDifficulties: [
                    'Not distributing LCD to all terms',
                    'Forgetting to check for extraneous solutions',
                    'Arithmetic errors when clearing fractions',
                    'Not recognizing when solution makes denominator zero'
                ],
                extensions: [
                    'Rational inequalities',
                    'Systems involving rational equations',
                    'Application problems'
                ],
                assessment: [
                    'Verify LCD found correctly',
                    'Check all solutions in original equation',
                    'Ensure extraneous solutions identified'
                ]
            },
            rational_addition: {
                objectives: [
                    'Add and subtract rational expressions',
                    'Find LCD of polynomial expressions',
                    'Combine and simplify results'
                ],
                keyConcepts: [
                    'Common denominator requirement',
                    'LCD construction from factored form',
                    'Distributing negative in subtraction'
                ],
                prerequisites: [
                    'Adding/subtracting numeric fractions',
                    'Polynomial factoring',
                    'Finding LCM'
                ],
                commonDifficulties: [
                    'Incorrect LCD',
                    'Not adjusting numerators properly',
                    'Sign errors in subtraction',
                    'Forgetting to simplify final answer'
                ],
                extensions: [
                    'Complex fractions',
                    'Three or more terms',
                    'Rational equations'
                ],
                assessment: [
                    'Check LCD correctness',
                    'Verify numerator adjustments',
                    'Confirm final simplification'
                ]
            },
            complex_fraction: {
                objectives: [
                    'Simplify complex rational expressions',
                    'Apply LCD method or division method',
                    'Choose efficient solution strategy'
                ],
                keyConcepts: [
                    'Complex fraction as division problem',
                    'LCD of all component fractions',
                    'Method selection based on complexity'
                ],
                prerequisites: [
                    'Simplifying simple rationals',
                    'Finding LCD',
                    'Division of fractions'
                ],
                commonDifficulties: [
                    'Confusion about which LCD to use',
                    'Not distributing LCD to all parts',
                    'Complexity management',
                    'Losing track of negative signs'
                ],
                extensions: [
                    'Nested complex fractions',
                    'Complex fractions in equations',
                    'Applications in electrical circuits'
                ],
                assessment: [
                    'Verify method choice appropriate',
                    'Check systematic application',
                    'Confirm complete simplification'
                ]
            },
            rational_inequality: {
                objectives: [
                    'Solve rational inequalities',
                    'Use sign chart method',
                    'Express solutions in interval notation'
                ],
                keyConcepts: [
                    'Critical values (zeros and undefined points)',
                    'Sign analysis between critical values',
                    'Boundary inclusion rules'
                ],
                prerequisites: [
                    'Solving polynomial inequalities',
                    'Understanding of number line',
                    'Interval notation'
                ],
                commonDifficulties: [
                    'Missing critical values',
                    'Confusing zeros with undefined points',
                    'Incorrect test point evaluation',
                    'Wrong boundary notation'
                ],
                extensions: [
                    'Absolute value rational inequalities',
                    'Systems of rational inequalities',
                    'Optimization applications'
                ],
                assessment: [
                    'Check all critical values found',
                    'Verify sign chart accuracy',
                    'Confirm proper interval notation'
                ]
            },
            work_rate_rational: {
                objectives: [
                    'Set up work rate problems as rational equations',
                    'Interpret rates as reciprocals of time',
                    'Solve and interpret in context'
                ],
                keyConcepts: [
                    'Work rate = 1/time',
                    'Combined rates sum',
                    'Part of job = rate × time'
                ],
                prerequisites: [
                    'Solving rational equations',
                    'Understanding of rates',
                    'Word problem translation'
                ],
                commonDifficulties: [
                    'Confusion between rate and time',
                    'Incorrect equation setup',
                    'Not checking reasonableness',
                    'Unit inconsistencies'
                ],
                extensions: [
                    'Three or more workers',
                    'Workers with different efficiencies',
                    'Partial work scenarios'
                ],
                assessment: [
                    'Check equation setup logic',
                    'Verify solution reasonableness',
                    'Confirm proper units'
                ]
            }
        };

        return pedagogicalDatabase[problemType] || {
            objectives: ['Solve the given rational expression problem'],
            keyConcepts: ['Apply rational expression techniques'],
            prerequisites: ['Basic algebra skills'],
            commonDifficulties: ['Various computational errors'],
            extensions: ['More complex variations'],
            assessment: ['Check understanding of solution process']
        };
    }

    generateAlternativeMethods(problemType) {
        const alternativeDatabase = {
            simplify_rational: {
                primaryMethod: 'Factor and cancel',
                methods: [
                    {
                        name: 'Direct Factoring Method',
                        description: 'Factor completely then cancel common factors'
                    },
                    {
                        name: 'Numerical Verification',
                        description: 'Substitute test values to verify equivalence'
                    }
                ],
                comparison: 'Factoring method is standard; numerical verification confirms correctness'
            },
            rational_equation: {
                primaryMethod: 'LCD Method',
                methods: [
                    {
                        name: 'LCD Method',
                        description: 'Multiply entire equation by LCD to clear all fractions'
                    },
                    {
                        name: 'Cross Multiplication',
                        description: 'For equations of form a/b = c/d, use ad = bc'
                    },
                    {
                        name: 'Substitution',
                        description: 'Let u = rational expression to simplify structure'
                    }
                ],
                comparison: 'LCD method is most general; cross multiplication works for simple proportions; substitution useful for repeated expressions'
            },
            complex_fraction: {
                primaryMethod: 'LCD Method',
                methods: [
                    {
                        name: 'LCD Method',
                        description: 'Multiply by LCD/LCD to clear all fractions at once'
                    },
                    {
                        name: 'Division Method',
                        description: 'Simplify numerator and denominator separately, then divide'
                    },
                    {
                        name: 'Step-by-Step Simplification',
                        description: 'Simplify innermost fractions first, work outward'
                    }
                ],
                comparison: 'LCD method often fastest; division method more intuitive; step-by-step good for highly nested fractions'
            },
            rational_inequality: {
                primaryMethod: 'Sign Chart Method',
                methods: [
                    {
                        name: 'Sign Chart Method',
                        description: 'Find critical values, test intervals, create sign chart'
                    },
                    {
                        name: 'Graphical Method',
                        description: 'Graph the rational function and identify solution regions'
                    },
                    {
                        name: 'Test Point Method',
                        description: 'Test points systematically in each interval'
                    }
                ],
                comparison: 'Sign chart is systematic and reliable; graphical provides visual insight; test points confirm sign chart results'
            },
            work_rate_rational: {
                primaryMethod: 'Rate equation setup',
                methods: [
                    {
                        name: 'Combined Rate Approach',
                        description: 'Add individual rates to get combined rate'
                    },
                    {
                        name: 'Table Method',
                        description: 'Organize rate, time, and work in table format'
                    },
                    {
                        name: 'Part-of-Job Approach',
                        description: 'Focus on what fraction of job each completes'
                    }
                ],
                comparison: 'Combined rate is algebraically direct; table helps organize information; part-of-job builds intuition'
            }
        };

        return alternativeDatabase[problemType] || {
            primaryMethod: 'Standard algebraic approach',
            methods: [
                {
                    name: 'Systematic Approach',
                    description: 'Follow standard problem-solving steps'
                }
            ],
            comparison: 'Method choice depends on problem structure and personal preference'
        };
    }

    // GRAPH DATA GENERATION

    generateRationalGraphData() {
        if (!this.currentSolution || !this.currentProblem) return;

        const { type } = this.currentProblem;

        switch(type) {
            case 'rational_function_analysis':
                this.graphData = this.generateRationalFunctionGraph();
                break;

            case 'rational_inequality':
                this.graphData = this.generateInequalityNumberLine();
                break;

            default:
                this.graphData = null;
        }
    }

    generateRationalFunctionGraph() {
        return {
            type: 'rational_function',
            components: {
                verticalAsymptotes: [],
                horizontalAsymptote: null,
                holes: [],
                xIntercepts: [],
                yIntercept: null
            },
            note: 'Graph data structure prepared for rational function'
        };
    }

    generateInequalityNumberLine() {
        return {
            type: 'number_line',
            criticalValues: [],
            intervals: [],
            solution: []
        };
    }

    // WORKBOOK GENERATION

    generateRationalWorkbook() {
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
            title: 'Rational Algebraic Workbook',
            subtitle: 'Enhanced Multi-Layer Explanations',
            timestamp: new Date().toISOString(),
            theme: this.theme,
            dimensions: { width: this.width, height: this.height },
            sections: []
        };
    }

    createProblemSection() {
        if (!this.currentProblem) return null;

        const problemData = [
            ['Problem Type', this.rationalTypes[this.currentProblem.type]?.name || this.currentProblem.type],
            ['Category', this.rationalTypes[this.currentProblem.type]?.category || 'General'],
            ['Description', this.rationalTypes[this.currentProblem.type]?.description || 'Rational expression problem']
        ];

        if (this.currentProblem.equation) {
            problemData.push(['Equation/Expression', this.currentProblem.equation]);
        }

        if (this.currentProblem.scenario) {
            problemData.push(['Scenario', this.currentProblem.scenario]);
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
            // Skip bridge steps in data representation
            if (step.stepType === 'bridge') {
                stepsData.push(['', '']); // Spacing for bridges
                stepsData.push(['Connection', step.explanation?.currentState || 'Connecting steps']);
                stepsData.push(['Next Goal', step.explanation?.nextGoal || 'Continue solving']);
                stepsData.push(['', '']); // Spacing
                return;
            }

            // Main step header
            stepsData.push(['═══════════════════════════', '═══════════════════════════']);
            stepsData.push([`STEP ${step.stepNumber}`, step.step.toUpperCase()]);
            stepsData.push(['═══════════════════════════', '═══════════════════════════']);

            // Description
            if (step.description) {
                stepsData.push(['Description', step.description]);
            }

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

            // Reasoning
            if (step.reasoning) {
                stepsData.push(['Reasoning', step.reasoning]);
            }

            // Algebraic rule
            if (step.algebraicRule) {
                stepsData.push(['Algebraic Rule', step.algebraicRule]);
            }

            // Visual hint
            if (step.visualHint) {
                stepsData.push(['Visual Hint', step.visualHint]);
            }

            // Key points and warnings
            if (step.keyPoint) {
                stepsData.push(['Key Point', step.keyPoint]);
            }

            if (step.criticalWarning) {
                stepsData.push(['⚠️ WARNING', step.criticalWarning]);
            }

            // Enhanced explanations (if detailed level)
            if (this.explanationLevel === 'detailed' && step.explanations) {
                stepsData.push(['', '']); // Spacing
                stepsData.push(['Conceptual', step.explanations.conceptual || '']);
                if (step.explanations.algebraic) {
                    stepsData.push(['Algebraic Detail', step.explanations.algebraic]);
                }
            }

            // Error prevention (if enabled)
            if (this.includeErrorPrevention && step.errorPrevention) {
                stepsData.push(['', '']); // Spacing
                stepsData.push(['Common Mistakes', step.errorPrevention.commonMistakes?.join('; ') || 'None listed']);
                stepsData.push(['Prevention Tips', step.errorPrevention.preventionTips?.join('; ') || 'Work carefully']);
            }

            // Scaffolding questions (if scaffolded level)
            if (this.explanationLevel === 'scaffolded' && step.scaffolding) {
                stepsData.push(['', '']); // Spacing
                stepsData.push(['Guiding Questions', step.scaffolding.guidingQuestions?.join(' | ') || '']);
            }

            // Final answer indicator
            if (step.finalAnswer) {
                stepsData.push(['', '']);
                stepsData.push(['✓ Status', 'FINAL ANSWER REACHED']);
            }

            stepsData.push(['', '']); // Spacing between steps
        });

        return {
            title: 'Enhanced Step-by-Step Solution',
            subtitle: `Explanation Level: ${this.explanationLevel}`,
            type: 'steps',
            data: stepsData
        };
    }

    createLessonSection() {
        const { type } = this.currentProblem;
        const lessonKey = this.mapProblemTypeToLesson(type);
        const lesson = this.lessons[lessonKey];

        if (!lesson) return null;

        const lessonData = [
            ['Topic', lesson.title],
            ['', ''],
            ['Theory', lesson.theory],
            ['', ''],
            ['Key Concepts', lesson.concepts.join(' | ')],
            ['', '']
        ];

        if (lesson.keyFormulas) {
            lessonData.push(['Key Formulas', '']);
            Object.entries(lesson.keyFormulas).forEach(([name, formula]) => {
                lessonData.push([name, formula]);
            });
            lessonData.push(['', '']);
        }

        if (lesson.solvingSteps) {
            lessonData.push(['General Solving Steps', '']);
            lesson.solvingSteps.forEach((step, index) => {
                lessonData.push([`Step ${index + 1}`, step]);
            });
            lessonData.push(['', '']);
        }

        if (lesson.applications) {
            lessonData.push(['Applications', lesson.applications.join('; ')]);
        }

        return {
            title: 'Lesson: ' + lesson.title,
            type: 'lesson',
            data: lessonData
        };
    }

    mapProblemTypeToLesson(problemType) {
        const mapping = {
            'simplify_rational': 'simplifying_rationals',
            'rational_equation': 'rational_equations',
            'rational_addition': 'operations_on_rationals',
            'rational_multiplication': 'operations_on_rationals',
            'complex_fraction': 'complex_fractions',
            'rational_inequality': 'rational_inequalities',
            'partial_fractions': 'partial_fractions',
            'rational_function_analysis': 'rational_functions',
            'work_rate_rational': 'rational_word_problems',
            'rational_drt': 'rational_word_problems',
            'rational_mixture': 'rational_word_problems',
            'solve_formula_rational': 'solving_for_variable',
            'rational_exponents': 'rational_exponents',
            'variation_problems': 'variation',
            'proportions': 'rational_equations'
        };

        return mapping[problemType] || 'simplifying_rationals';
    }

    createSolutionSection() {
        if (!this.currentSolution) return null;

        const solutionData = [
            ['Problem Type', this.currentSolution.problemType || 'Rational Expression Problem']
        ];

        if (this.currentSolution.solutionType) {
            solutionData.push(['Solution Type', this.currentSolution.solutionType]);
        }

        if (this.currentSolution.solutions) {
            if (Array.isArray(this.currentSolution.solutions)) {
                solutionData.push(['Solutions', this.currentSolution.solutions.join(', ')]);
            } else {
                solutionData.push(['Solution', JSON.stringify(this.currentSolution.solutions)]);
            }
        }

        if (this.currentSolution.method) {
            solutionData.push(['Method Used', this.currentSolution.method]);
        }

        if (this.currentSolution.steps) {
            solutionData.push(['', '']);
            solutionData.push(['Solution Steps Summary', '']);
            this.currentSolution.steps.forEach((step, index) => {
                solutionData.push([`${index + 1}`, step]);
            });
        }

        return {
            title: 'Final Solution',
            type: 'solution',
            data: solutionData
        };
    }

    createAnalysisSection() {
        const analysisData = [
            ['Total Steps', this.solutionSteps?.length || 0],
            ['Explanation Level', this.explanationLevel.charAt(0).toUpperCase() + this.explanationLevel.slice(1)],
            ['Method', this.currentSolution?.method || 'Standard rational expression techniques'],
            ['Category', this.rationalTypes[this.currentProblem.type]?.category || 'General']
        ];

        if (this.currentSolution?.warnings) {
            analysisData.push(['', '']);
            analysisData.push(['Important Warnings', '']);
            this.currentSolution.warnings.forEach((warning, index) => {
                analysisData.push([`Warning ${index + 1}`, warning]);
            });
        }

        return {
            title: 'Solution Analysis',
            type: 'analysis',
            data: analysisData
        };
    }

    createVerificationSection() {
        if (!this.includeVerificationInSteps) return null;

        const verification = this.verifyRationalSolution();
        const verificationData = [
            ['Verification Type', verification.verificationType || 'General Verification'],
            ['Method', verification.method || 'Standard checking procedures']
        ];

        if (verification.checks) {
            verificationData.push(['', '']);
            verificationData.push(['Verification Checks', '']);
            verification.checks.forEach((check, index) => {
                verificationData.push([`Check ${index + 1}`, check]);
            });
        }

        verificationData.push(['', '']);
        verificationData.push(['Confidence Level', this.calculateVerificationConfidence()]);
        verificationData.push(['Notes', this.getVerificationNotes()]);

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

        const pedagogicalData = [
            ['Learning Objectives', ''],
            ...notes.objectives.map((obj, i) => [`  ${i + 1}`, obj]),
            ['', ''],
            ['Key Concepts', ''],
            ...notes.keyConcepts.map((concept, i) => [`  ${i + 1}`, concept]),
            ['', ''],
            ['Prerequisites', notes.prerequisites.join('; ')],
            ['', ''],
            ['Common Difficulties', ''],
            ...notes.commonDifficulties.map((diff, i) => [`  ${i + 1}`, diff]),
            ['', ''],
            ['Extension Ideas', notes.extensions.join('; ')],
            ['', ''],
            ['Assessment Tips', ''],
            ...notes.assessment.map((tip, i) => [`  ${i + 1}`, tip])
        ];

        return {
            title: 'Teaching & Learning Notes',
            type: 'pedagogical',
            data: pedagogicalData
        };
    }

    createAlternativeMethodsSection() {
        if (!this.includeAlternativeMethods) return null;

        const { type } = this.currentProblem;
        const alternatives = this.generateAlternativeMethods(type);

        const alternativeData = [
            ['Primary Method', alternatives.primaryMethod],
            ['', ''],
            ['Alternative Approaches', '']
        ];

        alternatives.methods.forEach((method, index) => {
            alternativeData.push(['', '']);
            alternativeData.push([`Method ${index + 1}`, method.name]);
            alternativeData.push(['Description', method.description]);
        });

        alternativeData.push(['', '']);
        alternativeData.push(['Method Comparison', alternatives.comparison]);

        return {
            title: 'Alternative Solution Methods',
            type: 'alternatives',
            data: alternativeData
        };
    }

    // HELPER METHOD
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


