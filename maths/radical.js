// Enhanced Radical Mathematical Workbook - Improved Step-by-Step Explanations
import * as math from 'mathjs';

export class EnhancedRadicalMathematicalWorkbook {
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
        this.radicalTypes = {};  // Initialize empty object first
        this.initializeRadicalSolvers();
        this.initializeErrorDatabase();
        this.initializeExplanationTemplates();
    }

    initializeRadicalLessons() {
        this.lessons = {
            simplifying_radicals: {
                title: "Simplifying Radicals",
                concepts: [
                    "General form: √(a×b) = √a × √b where a,b ≥ 0",
                    "Goal: extract perfect square factors from under the radical",
                    "Simplest form: no perfect square factors remain under radical",
                    "Check: cannot simplify further and no fractions under radical"
                ],
                theory: "Simplifying radicals involves finding and extracting perfect square factors. The product property of radicals allows us to split radicals and simplify each part separately.",
                keyFormulas: {
                    "Product Property": "√(ab) = √a × √b",
                    "Quotient Property": "√(a/b) = √a / √b",
                    "Power Property": "√(a^n) = a^(n/2)",
                    "Simplified Form": "a√b where b has no perfect square factors"
                },
                solvingSteps: [
                    "Find the prime factorization of the radicand",
                    "Identify perfect square factors",
                    "Extract perfect squares from under the radical",
                    "Multiply extracted factors outside the radical",
                    "Verify the result is in simplest form"
                ],
                applications: [
                    "Pythagorean theorem calculations",
                    "Distance formula in coordinate geometry",
                    "Quadratic formula solutions",
                    "Physics formulas involving square roots"
                ]
            },

            adding_subtracting_radicals: {
                title: "Adding and Subtracting Radicals",
                concepts: [
                    "Like radicals have the same radicand and index",
                    "Only like radicals can be combined",
                    "Combine coefficients, keep radical part unchanged",
                    "Simplify each radical first before combining"
                ],
                theory: "Adding and subtracting radicals is similar to combining like terms in algebra. The radical part must be identical, and we combine only the coefficients.",
                keyFormulas: {
                    "Like Radicals": "a√c + b√c = (a + b)√c",
                    "Unlike Radicals": "√a + √b cannot be simplified (unless a or b simplify to like radicals)",
                    "Distribution": "a(b√c + d√e) = ab√c + ad√e"
                },
                solvingSteps: [
                    "Simplify each radical term completely",
                    "Identify like radical terms",
                    "Combine coefficients of like radicals",
                    "Keep unlike radicals separate",
                    "Write final answer in simplest form"
                ],
                applications: [
                    "Perimeter calculations with radical sides",
                    "Combining measurements in construction",
                    "Vector addition with radical components",
                    "Signal processing and wave calculations"
                ]
            },

            multiplying_radicals: {
                title: "Multiplying Radicals",
                concepts: [
                    "Product property: √a × √b = √(ab)",
                    "Multiply coefficients together, multiply radicands together",
                    "Simplify the result",
                    "Works for same or different radicands"
                ],
                theory: "Multiplication of radicals uses the product property, allowing us to multiply both outside coefficients and radicands separately, then simplify.",
                keyFormulas: {
                    "Basic Product": "√a × √b = √(ab)",
                    "With Coefficients": "(m√a)(n√b) = mn√(ab)",
                    "Binomial": "(√a + √b)(√c + √d) = √(ac) + √(ad) + √(bc) + √(bd)",
                    "Conjugate": "(√a + √b)(√a - √b) = a - b"
                },
                solvingSteps: [
                    "Multiply coefficients outside radicals",
                    "Multiply radicands under the radical",
                    "Simplify the resulting radical",
                    "For binomials, use FOIL or distribution",
                    "Combine like terms in final answer"
                ],
                applications: [
                    "Area calculations with radical dimensions",
                    "Rationalizing denominators",
                    "Quadratic formula manipulations",
                    "Complex number operations"
                ]
            },

            dividing_radicals: {
                title: "Dividing Radicals",
                concepts: [
                    "Quotient property: √a / √b = √(a/b)",
                    "Rationalize denominators: no radicals in denominators",
                    "Multiply by conjugate for binomial denominators",
                    "Simplify numerator and denominator separately first"
                ],
                theory: "Division of radicals uses the quotient property. The key principle is to rationalize denominators by eliminating all radicals from the bottom of fractions.",
                keyFormulas: {
                    "Quotient Property": "√a / √b = √(a/b)",
                    "Rationalizing": "(√a / √b) × (√b / √b) = √(ab) / b",
                    "Conjugate Method": "1/(√a + √b) = (√a - √b)/((√a + √b)(√a - √b)) = (√a - √b)/(a - b)"
                },
                solvingSteps: [
                    "Simplify radicals in numerator and denominator",
                    "Use quotient property if helpful",
                    "Rationalize the denominator",
                    "Simplify the resulting expression",
                    "Verify no radicals remain in denominator"
                ],
                applications: [
                    "Rationalizing complex expressions",
                    "Simplifying fractional measurements",
                    "Physics formulas with radical quotients",
                    "Engineering calculations"
                ]
            },

            radical_equations: {
                title: "Solving Radical Equations",
                concepts: [
                    "Isolate the radical term on one side",
                    "Square both sides to eliminate the radical",
                    "Solve the resulting equation",
                    "Check all solutions (squaring can introduce extraneous solutions)"
                ],
                theory: "Solving radical equations requires isolating the radical and squaring both sides. This process can introduce extraneous solutions, making verification essential.",
                keyFormulas: {
                    "Squaring Both Sides": "(√a)² = a",
                    "Squaring Binomial": "(a + √b)² = a² + 2a√b + b",
                    "Solution Check": "Substitute back into original equation"
                },
                solvingSteps: [
                    "Isolate one radical term",
                    "Square both sides of the equation",
                    "Simplify and solve resulting equation",
                    "If another radical remains, repeat isolation and squaring",
                    "Check all solutions in original equation",
                    "Reject any extraneous solutions"
                ],
                applications: [
                    "Distance and rate problems",
                    "Physics motion equations",
                    "Geometric problem solving",
                    "Optimization problems"
                ]
            },

            higher_index_radicals: {
                title: "Higher Index Radicals",
                concepts: [
                    "Cube roots: ∛a, fourth roots: ∜a, etc.",
                    "ⁿ√(aⁿ) = |a| for even n, a for odd n",
                    "Product and quotient properties apply to all indices",
                    "Simplify by extracting perfect nth powers"
                ],
                theory: "Higher index radicals follow similar rules to square roots but require perfect cubes, fourth powers, etc. Odd index radicals preserve signs while even index radicals produce absolute values.",
                keyFormulas: {
                    "General Form": "ⁿ√a where n is the index",
                    "Product Property": "ⁿ√a × ⁿ√b = ⁿ√(ab)",
                    "Power Property": "ⁿ√(aᵐ) = a^(m/n)",
                    "Simplified Form": "aⁿ√b where b has no perfect nth power factors"
                },
                solvingSteps: [
                    "Identify the index of the radical",
                    "Find prime factorization of radicand",
                    "Group factors by the index",
                    "Extract perfect nth powers",
                    "Simplify the result"
                ],
                applications: [
                    "Volume calculations",
                    "Compound interest formulas",
                    "Geometric mean calculations",
                    "Engineering stress-strain relationships"
                ]
            },

            rational_exponents: {
                title: "Rational Exponents and Radicals",
                concepts: [
                    "ⁿ√a = a^(1/n)",
                    "ⁿ√(aᵐ) = a^(m/n)",
                    "Convert between radical and exponential form",
                    "Apply exponent rules to simplify"
                ],
                theory: "Rational exponents provide an alternative notation for radicals that allows use of exponent rules. The denominator indicates the root, the numerator indicates the power.",
                keyFormulas: {
                    "Radical to Exponent": "ⁿ√a = a^(1/n)",
                    "Radical with Power": "ⁿ√(aᵐ) = a^(m/n) = (a^m)^(1/n) = (a^(1/n))^m",
                    "Product Rule": "a^(m/n) × a^(p/q) = a^(m/n + p/q)",
                    "Power Rule": "(a^(m/n))^p = a^(mp/n)"
                },
                solvingSteps: [
                    "Convert radicals to exponential form",
                    "Apply exponent rules",
                    "Simplify exponents",
                    "Convert back to radical form if needed",
                    "Verify the result"
                ],
                applications: [
                    "Growth and decay models",
                    "Scientific notation calculations",
                    "Logarithm relationships",
                    "Complex algebraic simplifications"
                ]
            },

            nested_radicals: {
                title: "Nested Radicals",
                concepts: [
                    "Radicals within radicals: √(a + √b)",
                    "Denesting when possible using algebraic patterns",
                    "Some nested radicals cannot be simplified",
                    "Look for perfect square patterns"
                ],
                theory: "Nested radicals can sometimes be denested by recognizing patterns like √(a + b + 2√(ab)) = √a + √b. Not all nested radicals can be simplified.",
                keyFormulas: {
                    "Denesting Pattern": "√(a + b + 2√(ab)) = √a + √b",
                    "Denesting Pattern 2": "√(a + b - 2√(ab)) = |√a - √b|",
                    "General Check": "If √(a + √b) = √c + √d, then a + √b = c + d + 2√(cd)"
                },
                solvingSteps: [
                    "Identify the nested radical structure",
                    "Look for denesting patterns",
                    "If pattern exists, express as sum of simpler radicals",
                    "Verify by squaring the denested form",
                    "If no pattern exists, leave in nested form"
                ],
                applications: [
                    "Advanced algebraic simplifications",
                    "Geometric constructions",
                    "Number theory problems",
                    "Pure mathematics research"
                ]
            },

            rationalizing_denominators: {
                title: "Rationalizing Denominators",
                concepts: [
                    "No radicals should appear in denominators",
                    "Multiply by conjugate for binomial denominators",
                    "Multiply by needed radical for monomial denominators",
                    "Simplify after rationalizing"
                ],
                theory: "Rationalizing creates equivalent fractions without radicals in denominators. This is standard mathematical form and makes further calculations easier.",
                keyFormulas: {
                    "Monomial": "(a/√b) × (√b/√b) = a√b/b",
                    "Binomial": "1/(a + √b) × (a - √b)/(a - √b) = (a - √b)/(a² - b)",
                    "Conjugate": "(a + √b)(a - √b) = a² - b"
                },
                solvingSteps: [
                    "Identify the type of denominator (monomial or binomial)",
                    "For monomial: multiply by √b/√b",
                    "For binomial: multiply by conjugate",
                    "Simplify numerator and denominator",
                    "Reduce if possible"
                ],
                applications: [
                    "Standard mathematical form",
                    "Trigonometric simplifications",
                    "Complex fraction simplification",
                    "Calculus limit evaluations"
                ]
            },

            radical_inequalities: {
                title: "Radical Inequalities",
                concepts: [
                    "Domain restrictions: radicand must be non-negative",
                    "Squaring inequalities requires careful sign analysis",
                    "Check solutions against domain restrictions",
                    "Graph to verify solution regions"
                ],
                theory: "Radical inequalities require attention to domain restrictions and careful handling when squaring, as squaring can change inequality directions.",
                keyFormulas: {
                    "Domain": "For √f(x), need f(x) ≥ 0",
                    "Squaring": "If a, b ≥ 0 and a < b, then a² < b²",
                    "Squaring Both Sides": "Valid only when both sides are non-negative"
                },
                solvingSteps: [
                    "Determine domain restrictions",
                    "Isolate the radical term",
                    "Square both sides (if both sides non-negative)",
                    "Solve resulting inequality",
                    "Check solutions against domain",
                    "Graph to verify"
                ],
                applications: [
                    "Optimization with constraints",
                    "Physics range calculations",
                    "Engineering design limits",
                    "Statistical confidence intervals"
                ]
            },

            applications: {
                title: "Radical Applications",
                concepts: [
                    "Pythagorean theorem: a² + b² = c²",
                    "Distance formula: d = √[(x₂-x₁)² + (y₂-y₁)²]",
                    "Quadratic formula: x = [-b ± √(b²-4ac)] / 2a",
                    "Physics formulas often involve square roots"
                ],
                theory: "Radicals appear naturally in many real-world applications, especially in geometry, physics, and engineering where second-order relationships exist.",
                problem_types: {
                    "Pythagorean Problems": "Find unknown sides in right triangles",
                    "Distance Problems": "Calculate distances in coordinate geometry",
                    "Quadratic Solutions": "Solve using quadratic formula",
                    "Physics Motion": "Free fall, projectile motion",
                    "Geometric Mean": "Mean proportional calculations",
                    "Engineering": "Stress analysis, fluid dynamics"
                },
                solution_strategy: [
                    "Identify the formula needed",
                    "Substitute known values",
                    "Simplify radical expressions",
                    "Solve for unknown",
                    "Check reasonableness of answer",
                    "Include proper units"
                ],
                common_formulas: {
                    "Pythagorean": "c = √(a² + b²)",
                    "Distance": "d = √[(Δx)² + (Δy)²]",
                    "Quadratic": "x = [-b ± √(b²-4ac)] / 2a",
                    "Falling Object": "t = √(2h/g)"
                }
            },

            radical_functions: {
                title: "Radical Function Analysis",
                concepts: [
                    "Square root function: f(x) = √x",
                    "Domain: radicand must be non-negative",
                    "Range: typically [0, ∞) for square roots",
                    "Graph is half of a parabola on its side"
                ],
                theory: "Radical functions have restricted domains based on the index and radicand. They model many natural phenomena involving square root relationships.",
                keyFormulas: {
                    "Basic Square Root": "f(x) = √x, domain [0, ∞)",
                    "Transformed": "f(x) = a√(x - h) + k",
                    "General Radical": "f(x) = ⁿ√x",
                    "Inverse": "f(x) = √x ↔ f⁻¹(x) = x²"
                },
                analysis_components: [
                    "Domain determination",
                    "Range identification",
                    "Intercepts (x and y)",
                    "Increasing/decreasing behavior",
                    "Transformations from parent function"
                ],
                applications: [
                    "Physics velocity-time relationships",
                    "Economic utility functions",
                    "Biology growth models",
                    "Engineering design curves"
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
            'sqrt': '√', 'cbrt': '∛', 'root4': '∜',
            'leq': '≤', 'geq': '≥', 'neq': '≠', 'approx': '≈',
            'infinity': '∞', 'plusminus': '±',
            // Greek letters
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'Δ',
            'pi': 'π', 'theta': 'θ', 'lambda': 'λ', 'mu': 'μ',
            // Special symbols
            'squared': '²', 'cubed': '³', 'power': '^'
        };
    }

initializeRadicalSolvers() {
    // IMPORTANT: Bind all solver methods to ensure 'this' context is preserved
    const boundSimplifyRadical = this.simplifyRadical.bind(this);
    const boundAddSubtractRadicals = this.addSubtractRadicals.bind(this);
    const boundMultiplyRadicals = this.multiplyRadicals.bind(this);
    const boundDivideRadicals = this.divideRadicals.bind(this);
    const boundSolveRadicalEquation = this.solveRadicalEquation.bind(this);
    const boundSimplifyHigherIndexRadical = this.simplifyHigherIndexRadical.bind(this);
    const boundRationalExponent = this.rationalExponent.bind(this);
    const boundSimplifyNestedRadical = this.simplifyNestedRadical.bind(this);
    const boundRationalizeDenominator = this.rationalizeDenominator.bind(this);
    const boundSolveRadicalInequality = this.solveRadicalInequality.bind(this);
    const boundSolvePythagorean = this.solvePythagorean.bind(this);
    const boundSolveDistanceFormula = this.solveDistanceFormula.bind(this);
    const boundSolveQuadraticFormula = this.solveQuadraticFormula.bind(this);

    // Make sure we're assigning to this.radicalTypes
    this.radicalTypes = {
        simplify_radical: {
            patterns: [
                /sqrt\((\d+)\)/,
                /√(\d+)/,
                /simplif.*radical/i,
                /simplif.*sqrt/i
            ],
            solver: boundSimplifyRadical,
            name: 'Simplify Radical',
            category: 'simplification',
            description: 'Simplifies √n by extracting perfect square factors'
        },

        add_subtract_radicals: {
            patterns: [
                /(\d*)\s*√(\d+)\s*([+-])\s*(\d*)\s*√(\d+)/,
                /add.*radical/i,
                /subtract.*radical/i,
                /combin.*radical/i
            ],
            solver: boundAddSubtractRadicals,
            name: 'Add/Subtract Radicals',
            category: 'operations',
            description: 'Combines like radical terms'
        },

        multiply_radicals: {
            patterns: [
                /(\d*)\s*√(\d+)\s*\*\s*(\d*)\s*√(\d+)/,
                /(\d*)\s*√(\d+)\s*×\s*(\d*)\s*√(\d+)/,
                /multiply.*radical/i,
                /product.*radical/i
            ],
            solver: boundMultiplyRadicals,
            name: 'Multiply Radicals',
            category: 'operations',
            description: 'Multiplies radical expressions'
        },

        divide_radicals: {
            patterns: [
                /(\d*)\s*√(\d+)\s*\/\s*(\d*)\s*√(\d+)/,
                /divide.*radical/i,
                /quotient.*radical/i,
                /rationaliz/i
            ],
            solver: boundDivideRadicals,
            name: 'Divide Radicals',
            category: 'operations',
            description: 'Divides radicals and rationalizes denominators'
        },

        radical_equation: {
            patterns: [
                /√.*=.*\d+/,
                /solve.*√/i,
                /radical.*equation/i
            ],
            solver: boundSolveRadicalEquation,
            name: 'Solve Radical Equation',
            category: 'equations',
            description: 'Solves equations containing radicals'
        },

        higher_index_radical: {
            patterns: [
                /cbrt\((\d+)\)/,
                /∛(\d+)/,
                /∜(\d+)/,
                /cube.*root/i,
                /fourth.*root/i,
                /(\d+)\s*root/i
            ],
            solver: boundSimplifyHigherIndexRadical,
            name: 'Higher Index Radicals',
            category: 'advanced',
            description: 'Simplifies cube roots, fourth roots, etc.'
        },

        rational_exponent: {
            patterns: [
                /(\d+)\^?\((\d+)\/(\d+)\)/,
                /rational.*exponent/i,
                /fractional.*exponent/i
            ],
            solver: boundRationalExponent,
            name: 'Rational Exponents',
            category: 'advanced',
            description: 'Converts between radicals and rational exponents'
        },

        nested_radical: {
            patterns: [
                /√\(.*√.*\)/,
                /nested.*radical/i,
                /denest/i
            ],
            solver: boundSimplifyNestedRadical,
            name: 'Nested Radicals',
            category: 'advanced',
            description: 'Simplifies or denests nested radical expressions'
        },

        rationalize_denominator: {
            patterns: [
                /\d+\s*\/\s*√\d+/,
                /rationaliz.*denominator/i,
                /conjugate/i
            ],
            solver: boundRationalizeDenominator,
            name: 'Rationalize Denominator',
            category: 'simplification',
            description: 'Eliminates radicals from denominators'
        },

        radical_inequality: {
            patterns: [
                /√.*[<>≤≥]/,
                /radical.*inequality/i
            ],
            solver: boundSolveRadicalInequality,
            name: 'Radical Inequalities',
            category: 'equations',
            description: 'Solves inequalities containing radicals'
        },

        pythagorean: {
            patterns: [
                /pythagorean/i,
                /right.*triangle/i,
                /a.*2.*b.*2.*c.*2/i,
                /hypotenuse/i
            ],
            solver: boundSolvePythagorean,
            name: 'Pythagorean Theorem',
            category: 'applications',
            description: 'Applies Pythagorean theorem with radicals'
        },

        distance_formula: {
            patterns: [
                /distance.*formula/i,
                /distance.*between.*points/i
            ],
            solver: boundSolveDistanceFormula,
            name: 'Distance Formula',
            category: 'applications',
            description: 'Calculates distance using radical formula'
        },

        quadratic_formula_radical: {
            patterns: [
                /quadratic.*formula/i,
                /discriminant/i
            ],
            solver: boundSolveQuadraticFormula,
            name: 'Quadratic Formula',
            category: 'applications',
            description: 'Solves quadratics using formula with radicals'
        }
    };
    
    console.log(`✓ Initialized ${Object.keys(this.radicalTypes).length} radical solver types`);
}

    initializeErrorDatabase() {
        this.commonMistakes = {
            simplify_radical: {
                'Find perfect square factors': [
                    'Missing perfect square factors in the radicand',
                    'Not finding the largest perfect square factor',
                    'Forgetting to check if result can be simplified further'
                ],
                'Extract perfect squares': [
                    'Incorrectly taking the square root of the factor',
                    'Leaving perfect squares under the radical',
                    'Sign errors when extracting'
                ]
            },
            add_subtract_radicals: {
                'Identify like radicals': [
                    'Trying to combine unlike radicals',
                    'Not simplifying radicals first before combining',
                    'Thinking √a + √b = √(a+b)'
                ],
                'Combine coefficients': [
                    'Adding radicands instead of coefficients',
                    'Forgetting that 1 is the coefficient when not shown',
                    'Sign errors when subtracting'
                ]
            },
            multiply_radicals: {
                'Apply product property': [
                    'Not multiplying coefficients together',
                    'Not multiplying radicands together',
                    'Forgetting to simplify the result'
                ]
            },
            divide_radicals: {
                'Rationalize denominator': [
                    'Forgetting to rationalize',
                    'Not multiplying numerator when rationalizing',
                    'Incorrect conjugate selection'
                ]
            },
            radical_equation: {
                'Square both sides': [
                    'Not squaring the entire side',
                    'Incorrectly expanding (a + √b)²',
                    'Forgetting to check for extraneous solutions'
                ],
                'Check solutions': [
                    'Not checking solutions in original equation',
                    'Keeping extraneous solutions',
                    'Ignoring domain restrictions'
                ]
            }
        };

        this.errorPrevention = {
            perfect_square_check: {
                reminder: 'Always check for perfect square factors systematically',
                method: 'Use prime factorization to identify all perfect squares'
            },
            like_radicals_rule: {
                reminder: 'Only combine radicals with identical radicands',
                method: 'Simplify each radical completely before attempting to combine'
            },
            rationalization_check: {
                reminder: 'Denominators must not contain radicals',
                method: 'Always multiply by appropriate form to eliminate radicals from denominator'
            },
            extraneous_solutions: {
                reminder: 'Squaring can introduce invalid solutions',
                method: 'Always substitute solutions back into original equation'
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
                focus: 'Graphical and geometric understanding',
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

    solveRadicalProblem(config) {
    const { expression, scenario, parameters, problemType, context } = config;

    try {
        // DEBUG: Check context immediately
        console.log('🔍 Inside solveRadicalProblem');
        console.log('   this exists?', !!this);
        console.log('   this.radicalTypes exists?', !!this?.radicalTypes);
        
        if (!this || !this.radicalTypes) {
            console.error('❌ CONTEXT LOST! this.radicalTypes is undefined');
            console.error('   typeof this:', typeof this);
            console.error('   this keys:', this ? Object.keys(this) : 'this is null/undefined');
            throw new Error('Context (this) was lost - radicalTypes is undefined');
        }

        // Parse the problem - ENSURE we're calling with proper context
        this.currentProblem = this.parseRadicalProblem.call(this, expression, scenario, parameters, problemType, context);

        // Solve the problem - ENSURE we're calling with proper context
        this.currentSolution = this.solveRadicalProblem_Internal.call(this, this.currentProblem);

        // Generate solution steps - ENSURE we're calling with proper context
        this.solutionSteps = this.generateRadicalSteps.call(this, this.currentProblem, this.currentSolution);

        // Generate graph data if applicable
        this.generateRadicalGraphData.call(this);

        // Generate workbook
        this.generateRadicalWorkbook.call(this);

        return {
            workbook: this.currentWorkbook,
            solution: this.currentSolution,
            solutions: this.currentSolution?.solutions,
            solutionType: this.currentSolution?.solutionType
        };

    } catch (error) {
        console.error('Error in solveRadicalProblem:', error);
        throw new Error(`Failed to solve radical problem: ${error.message}`);
    }
}
 
   parseRadicalProblem(expression, scenario = '', parameters = {}, problemType = null, context = {}) {
        const cleanInput = expression ? this.cleanMathExpression(expression) : '';

        // If problem type is specified, use it directly
        if (problemType && this.radicalTypes && this.radicalTypes[problemType]) {
            return {
                originalInput: expression || `${problemType} problem`,
                cleanInput: cleanInput,
                type: problemType,
                scenario: scenario,
                parameters: { ...parameters },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        // If radicalTypes not initialized yet, throw error
        if (!this.radicalTypes) {
            throw new Error('Radical solver types not initialized');
        }

        // Auto-detect radical problem type
        for (const [type, config] of Object.entries(this.radicalTypes)) {
            for (const pattern of config.patterns) {
                if (pattern.test(cleanInput) || pattern.test(scenario)) {
                    const match = cleanInput.match(pattern);
                    const extractedParams = this.extractRadicalParameters(match, type);

                    return {
                        originalInput: expression || scenario,
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

        // Default to simplify radical if we have a √ symbol or sqrt
        if (cleanInput.includes('√') || cleanInput.includes('sqrt') || 
            cleanInput.includes('∛') || cleanInput.includes('cbrt')) {
            return {
                originalInput: expression,
                cleanInput: cleanInput,
                type: 'simplify_radical',
                scenario: scenario,
                parameters: { 
                    expression: cleanInput,
                    ...parameters 
                },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        throw new Error(`Unable to recognize radical problem type from: ${expression || scenario}`);
    }
        
    cleanMathExpression(expression) {
        return expression
            .replace(/\s+/g, ' ')
            .replace(/√/g, 'sqrt')
            .replace(/∛/g, 'cbrt')
            .replace(/∜/g, 'root4')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/≠/g, '!=')
            .trim();
    }

    extractRadicalParameters(match, type) {
        const params = {};

        if (type === 'simplify_radical' && match) {
            params.radicand = parseInt(match[1]) || 0;
            params.index = 2; // square root by default
        }

        if (type === 'add_subtract_radicals' && match) {
            params.coeff1 = parseInt(match[1]) || 1;
            params.radicand1 = parseInt(match[2]) || 0;
            params.operator = match[3];
            params.coeff2 = parseInt(match[4]) || 1;
            params.radicand2 = parseInt(match[5]) || 0;
        }

        if (type === 'multiply_radicals' && match) {
            params.coeff1 = parseInt(match[1]) || 1;
            params.radicand1 = parseInt(match[2]) || 0;
            params.coeff2 = parseInt(match[3]) || 1;
            params.radicand2 = parseInt(match[4]) || 0;
        }

        if (type === 'divide_radicals' && match) {
            params.coeff1 = parseInt(match[1]) || 1;
            params.radicand1 = parseInt(match[2]) || 0;
            params.coeff2 = parseInt(match[3]) || 1;
            params.radicand2 = parseInt(match[4]) || 0;
        }

        return params;
    }

    solveRadicalProblem_Internal(problem) {
        const solver = this.radicalTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for radical problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    

    // RADICAL SOLVERS

    simplifyRadical(problem) {
        const { radicand, index = 2 } = problem.parameters;

        if (radicand < 0 && index % 2 === 0) {
            return {
                solutionType: 'No real solution',
                solutions: [],
                expression: `√${radicand}`,
                explanation: 'Cannot take even root of negative number in real numbers',
                category: 'simplify_radical'
            };
        }

        const primeFactors = this.primeFactorization(Math.abs(radicand));
        const { outsideFactor, insideFactor } = this.extractPerfectPowers(primeFactors, index);

        const sign = radicand < 0 && index % 2 === 1 ? -1 : 1;
        const finalOutside = sign * outsideFactor;

        return {
            solutionType: 'Simplified radical',
            solutions: [{ outside: finalOutside, inside: insideFactor }],
            originalRadicand: radicand,
            index: index,
            primeFactorization: primeFactors,
            outsideFactor: finalOutside,
            insideFactor: insideFactor,
            simplifiedForm: insideFactor === 1 ? 
                `${finalOutside}` : 
                `${finalOutside === 1 ? '' : finalOutside === -1 ? '-' : finalOutside}√${insideFactor}`,
            isFullySimplified: this.isFullySimplified(insideFactor, index),
            category: 'simplify_radical'
        };
    }

    addSubtractRadicals(problem) {
        const { coeff1, radicand1, operator, coeff2, radicand2 } = problem.parameters;

        // Simplify each radical first
        const simplified1 = this.simplifyRadical({ parameters: { radicand: radicand1 } });
        const simplified2 = this.simplifyRadical({ parameters: { radicand: radicand2 } });

        const finalCoeff1 = coeff1 * simplified1.outsideFactor;
        const finalRadicand1 = simplified1.insideFactor;
        const finalCoeff2 = coeff2 * simplified2.outsideFactor;
        const finalRadicand2 = simplified2.insideFactor;

        // Check if like radicals
        if (finalRadicand1 === finalRadicand2) {
            const resultCoeff = operator === '+' ? 
                finalCoeff1 + finalCoeff2 : 
                finalCoeff1 - finalCoeff2;

            return {
                solutionType: 'Combined like radicals',
                solutions: [{ coefficient: resultCoeff, radicand: finalRadicand1 }],
                expression: `${coeff1}√${radicand1} ${operator} ${coeff2}√${radicand2}`,
                simplifiedForm: finalRadicand1 === 1 ? 
                    `${resultCoeff}` : 
                    `${resultCoeff}√${finalRadicand1}`,
                areLikeRadicals: true,
                intermediateSteps: {
                    term1Simplified: `${finalCoeff1}√${finalRadicand1}`,
                    term2Simplified: `${finalCoeff2}√${finalRadicand2}`
                },
                category: 'add_subtract_radicals'
            };
        } else {
            return {
                solutionType: 'Unlike radicals cannot be combined',
                solutions: [{ 
                    term1: { coefficient: finalCoeff1, radicand: finalRadicand1 },
                    term2: { coefficient: finalCoeff2, radicand: finalRadicand2 }
                }],
                expression: `${coeff1}√${radicand1} ${operator} ${coeff2}√${radicand2}`,
                simplifiedForm: `${finalCoeff1}√${finalRadicand1} ${operator} ${finalCoeff2}√${finalRadicand2}`,
                areLikeRadicals: false,
                explanation: 'Terms have different radicands and cannot be combined',
                category: 'add_subtract_radicals'
            };
        }
    }

    multiplyRadicals(problem) {
        const { coeff1, radicand1, coeff2, radicand2, index = 2 } = problem.parameters;

        // Multiply coefficients
        const resultCoeff = coeff1 * coeff2;

        // Multiply radicands
        const resultRadicand = radicand1 * radicand2;

        // Simplify the result
        const simplified = this.simplifyRadical({ 
            parameters: { radicand: resultRadicand, index: index } 
        });

        const finalOutside = resultCoeff * simplified.outsideFactor;
        const finalInside = simplified.insideFactor;

        return {
            solutionType: 'Product of radicals',
            solutions: [{ outside: finalOutside, inside: finalInside }],
            expression: `(${coeff1}√${radicand1})(${coeff2}√${radicand2})`,
            intermediateProduct: `${resultCoeff}√${resultRadicand}`,
            simplifiedForm: finalInside === 1 ? 
                `${finalOutside}` : 
                `${finalOutside}√${finalInside}`,
            steps: {
                multiplyCoefficients: `${coeff1} × ${coeff2} = ${resultCoeff}`,
                multiplyRadicands: `√${radicand1} × √${radicand2} = √${resultRadicand}`,
                simplifyResult: simplified.simplifiedForm
            },
            category: 'multiply_radicals'
        };
    }

    divideRadicals(problem) {
        const { coeff1, radicand1, coeff2, radicand2, index = 2 } = problem.parameters;

        // Divide coefficients
        const coeffGCD = this.gcd(coeff1, coeff2);
        const resultCoeffNum = coeff1 / coeffGCD;
        const resultCoeffDen = coeff2 / coeffGCD;

        // Divide radicands
        const radicandGCD = this.gcd(radicand1, radicand2);
        const resultRadicandNum = radicand1 / radicandGCD;
        const resultRadicandDen = radicand2 / radicandGCD;

        // Rationalize if needed
        let finalNum, finalDen, finalRadicand;

        if (resultRadicandDen === 1) {
            // No rationalization needed
            const simplified = this.simplifyRadical({ 
                parameters: { radicand: resultRadicandNum, index: index } 
            });
            finalNum = resultCoeffNum * simplified.outsideFactor;
            finalDen = resultCoeffDen;
            finalRadicand = simplified.insideFactor;
        } else {
            // Need to rationalize
            const rationalizeBy = resultRadicandDen;
            const newRadicandNum = resultRadicandNum * rationalizeBy;
            const newDen = resultCoeffDen * Math.sqrt(rationalizeBy);

            const simplified = this.simplifyRadical({ 
                parameters: { radicand: newRadicandNum, index: index } 
            });
            finalNum = resultCoeffNum * simplified.outsideFactor;
            finalDen = newDen;
            finalRadicand = simplified.insideFactor;
        }

        return {
            solutionType: 'Quotient of radicals',
            solutions: [{ numerator: finalNum, denominator: finalDen, radicand: finalRadicand }],
            expression: `(${coeff1}√${radicand1}) / (${coeff2}√${radicand2})`,
            needsRationalization: resultRadicandDen !== 1,
            rationalizedForm: this.formatFraction(finalNum, finalDen, finalRadicand),
            steps: {
                divideCoefficients: `${coeff1}/${coeff2} = ${resultCoeffNum}/${resultCoeffDen}`,
                divideRadicands: `√${radicand1}/√${radicand2} = √(${resultRadicandNum}/${resultRadicandDen})`,
                rationalize: resultRadicandDen !== 1 ? 
                    `Multiply by √${resultRadicandDen}/√${resultRadicandDen}` : 
                    'No rationalization needed'
            },
            category: 'divide_radicals'
        };
    }

    solveRadicalEquation(problem) {
        const { equation, variable = 'x' } = problem.parameters;

        // This is a framework - specific implementation depends on equation structure
        return {
            solutionType: 'Radical equation solution',
            steps: [
                'Isolate the radical term',
                'Square both sides to eliminate radical',
                'Solve the resulting equation',
                'Check for extraneous solutions'
            ],
            warningNotes: [
                'Squaring both sides can introduce extraneous solutions',
                'Always check solutions in the original equation',
                'Reject solutions that make radicand negative'
            ],
            category: 'radical_equation'
        };
    }

    simplifyHigherIndexRadical(problem) {
        const { radicand, index = 3 } = problem.parameters;

        if (radicand < 0 && index % 2 === 0) {
            return {
                solutionType: 'No real solution',
                solutions: [],
                expression: `${index}√${radicand}`,
                explanation: 'Cannot take even root of negative number',
                category: 'higher_index_radical'
            };
        }

        const primeFactors = this.primeFactorization(Math.abs(radicand));
        const { outsideFactor, insideFactor } = this.extractPerfectPowers(primeFactors, index);

        const sign = radicand < 0 ? -1 : 1;
        const finalOutside = sign * outsideFactor;

        return {
            solutionType: `Simplified ${index}-root`,
            solutions: [{ outside: finalOutside, inside: insideFactor }],
            originalRadicand: radicand,
            index: index,
            primeFactorization: primeFactors,
            simplifiedForm: insideFactor === 1 ? 
                `${finalOutside}` : 
                `${finalOutside === 1 ? '' : finalOutside}∛${insideFactor}`,
            category: 'higher_index_radical'
        };
    }

    rationalExponent(problem) {
        const { base, numerator, denominator } = problem.parameters;

        const radicalForm = `${denominator}√(${base}^${numerator})`;
        const exponentForm = `${base}^(${numerator}/${denominator})`;

        // Simplify if possible
        const simplified = this.simplifyHigherIndexRadical({
            parameters: { 
                radicand: Math.pow(base, numerator),
                index: denominator
            }
        });

        return {
            solutionType: 'Rational exponent conversion',
            solutions: [simplified],
            radicalForm: radicalForm,
            exponentForm: exponentForm,
            simplifiedForm: simplified.simplifiedForm,
            category: 'rational_exponent'
        };
    }

    simplifyNestedRadical(problem) {
        const { expression } = problem.parameters;

        return {
            solutionType: 'Nested radical analysis',
            approach: 'Check for denesting patterns',
            patterns: [
                'If √(a + b + 2√(ab)) then can denest to √a + √b',
                'If √(a + b - 2√(ab)) then can denest to |√a - √b|'
            ],
            category: 'nested_radical'
        };
    }

    rationalizeDenominator(problem) {
        const { numerator, denominator, denominatorRadicand } = problem.parameters;

        const rationalizeBy = denominatorRadicand;
        const newNumerator = numerator * Math.sqrt(rationalizeBy);
        const newDenominator = denominator * rationalizeBy;

        return {
            solutionType: 'Rationalized denominator',
            solutions: [{ numerator: newNumerator, denominator: newDenominator }],
            originalForm: `${numerator}/(${denominator}√${denominatorRadicand})`,
            rationalizedForm: `${newNumerator}√${denominatorRadicand}/${newDenominator}`,
            multiplyBy: `√${denominatorRadicand}/√${denominatorRadicand}`,
            category: 'rationalize_denominator'
        };
    }

    solveRadicalInequality(problem) {
        const { inequality, variable = 'x' } = problem.parameters;

        return {
            solutionType: 'Radical inequality solution',
            steps: [
                'Determine domain restrictions (radicand ≥ 0)',
                'Isolate radical term',
                'Square both sides (check signs)',
                'Solve resulting inequality',
                'Check against domain restrictions'
            ],
            category: 'radical_inequality'
        };
    }

    solvePythagorean(problem) {
        const { a, b, c } = problem.parameters;

        if (c !== undefined) {
            // Finding c
            const cSquared = a * a + b * b;
            const cValue = Math.sqrt(cSquared);
            const simplified = this.simplifyRadical({ parameters: { radicand: cSquared } });

            return {
                solutionType: 'Pythagorean theorem - hypotenuse',
                solutions: [{ exact: simplified.simplifiedForm, decimal: cValue }],
                formula: 'c = √(a² + b²)',
                calculation: `c = √(${a}² + ${b}²) = √${cSquared}`,
                category: 'pythagorean'
            };
        } else if (a !== undefined && c !== undefined) {
            // Finding b
            const bSquared = c * c - a * a;
            if (bSquared < 0) {
                return {
                    solutionType: 'No solution',
                    explanation: 'Invalid triangle - hypotenuse shorter than leg',
                    category: 'pythagorean'
                };
            }
            const bValue = Math.sqrt(bSquared);
            const simplified = this.simplifyRadical({ parameters: { radicand: bSquared } });

            return {
                solutionType: 'Pythagorean theorem - leg',
                solutions: [{ exact: simplified.simplifiedForm, decimal: bValue }],
                formula: 'b = √(c² - a²)',
                calculation: `b = √(${c}² - ${a}²) = √${bSquared}`,
                category: 'pythagorean'
            };
        }
    }

    solveDistanceFormula(problem) {
        const { x1, y1, x2, y2 } = problem.parameters;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(dSquared);
        const simplified = this.simplifyRadical({ parameters: { radicand: dSquared } });

        return {
            solutionType: 'Distance formula',
            solutions: [{ exact: simplified.simplifiedForm, decimal: distance }],
            formula: 'd = √[(x₂-x₁)² + (y₂-y₁)²]',
            calculation: `d = √[(${dx})² + (${dy})²] = √${dSquared}`,
            points: { point1: [x1, y1], point2: [x2, y2] },
            category: 'distance_formula'
        };
    }

    solveQuadraticFormula(problem) {
        const { a, b, c } = problem.parameters;

        const discriminant = b * b - 4 * a * c;
        const discriminantSimplified = this.simplifyRadical({ parameters: { radicand: Math.abs(discriminant) } });

        if (discriminant < 0) {
            return {
                solutionType: 'Complex solutions',
                solutions: [],
                discriminant: discriminant,
                explanation: 'No real solutions (discriminant < 0)',
                category: 'quadratic_formula_radical'
            };
        }

        const solution1Num = -b + Math.sqrt(discriminant);
        const solution2Num = -b - Math.sqrt(discriminant);
        const denominator = 2 * a;

        return {
            solutionType: discriminant === 0 ? 'One repeated solution' : 'Two real solutions',
            solutions: [
                { 
                    exact: `(${-b} + ${discriminantSimplified.simplifiedForm})/${denominator}`,
                    decimal: solution1Num / denominator
                },
                { 
                    exact: `(${-b} - ${discriminantSimplified.simplifiedForm})/${denominator}`,
                    decimal: solution2Num / denominator
                }
            ],
            formula: 'x = [-b ± √(b²-4ac)] / 2a',
            discriminant: discriminant,
            discriminantSimplified: discriminantSimplified.simplifiedForm,
            category: 'quadratic_formula_radical'
        };
    }

    // HELPER METHODS

    primeFactorization(n) {
        const factors = {};
        let num = n;

        for (let i = 2; i <= Math.sqrt(num); i++) {
            while (num % i === 0) {
                factors[i] = (factors[i] || 0) + 1;
                num /= i;
            }
        }

        if (num > 1) {
            factors[num] = 1;
        }

        return factors;
    }

    extractPerfectPowers(primeFactors, index) {
        let outsideFactor = 1;
        let insideFactor = 1;

        for (const [prime, count] of Object.entries(primeFactors)) {
            const p = parseInt(prime);
            const quotient = Math.floor(count / index);
            const remainder = count % index;

            outsideFactor *= Math.pow(p, quotient);
            insideFactor *= Math.pow(p, remainder);
        }

        return { outsideFactor, insideFactor };
    }

    isFullySimplified(radicand, index) {
        const factors = this.primeFactorization(radicand);
        for (const count of Object.values(factors)) {
            if (count >= index) return false;
        }
        return true;
    }

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

    formatFraction(num, den, radicand) {
        if (den === 1) {
            return radicand === 1 ? `${num}` : `${num}√${radicand}`;
        }
        return radicand === 1 ? `${num}/${den}` : `(${num}√${radicand})/${den}`;
    }

    // ENHANCED STEP GENERATION

    generateRadicalSteps(problem, solution) {
        let baseSteps = this.generateBaseRadicalSteps(problem, solution);

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

    generateBaseRadicalSteps(problem, solution) {
        const { type } = problem;

        switch (type) {
            case 'simplify_radical':
                return this.generateSimplifyRadicalSteps(problem, solution);
            case 'add_subtract_radicals':
                return this.generateAddSubtractRadicalSteps(problem, solution);
            case 'multiply_radicals':
                return this.generateMultiplyRadicalSteps(problem, solution);
            case 'divide_radicals':
                return this.generateDivideRadicalSteps(problem, solution);
            case 'pythagorean':
                return this.generatePythagoreanSteps(problem, solution);
            case 'distance_formula':
                return this.generateDistanceFormulaSteps(problem, solution);
            default:
                return this.generateGenericRadicalSteps(problem, solution);
        }
    }

    generateSimplifyRadicalSteps(problem, solution) {
        const { radicand, index = 2 } = problem.parameters;
        const steps = [];

        // Step 1: Given radical
        steps.push({
            stepNumber: 1,
            step: 'Given radical',
            description: `Start with the radical expression ${index === 2 ? '√' : index + '√'}${radicand}`,
            expression: `√${radicand}`,
            reasoning: 'We need to simplify this radical by extracting perfect square factors',
            visualHint: 'Think of breaking down the number under the radical into smaller pieces',
            algebraicRule: 'Product Property: √(ab) = √a × √b',
            goalStatement: 'Extract all perfect square factors from under the radical'
        });

        // Step 2: Prime factorization
        const primeFactors = solution.primeFactorization;
        const factorString = Object.entries(primeFactors)
            .map(([prime, count]) => count > 1 ? `${prime}^${count}` : prime)
            .join(' × ');

        steps.push({
            stepNumber: 2,
            step: 'Find prime factorization',
            description: `Break down ${radicand} into prime factors`,
            beforeExpression: `√${radicand}`,
            afterExpression: `√(${factorString})`,
            reasoning: 'Prime factorization helps us identify perfect square factors',
            algebraicRule: 'Every number can be expressed as a product of prime factors',
            visualHint: 'Use a factor tree to find all prime factors systematically',
            workingDetails: {
                primeFactors: primeFactors,
                factorization: factorString
            }
        });

        // Step 3: Identify perfect squares
        const perfectSquares = [];
        const remainingFactors = [];
        
        for (const [prime, count] of Object.entries(primeFactors)) {
            const pairs = Math.floor(count / 2);
            const remainder = count % 2;
            
            if (pairs > 0) {
                perfectSquares.push(`${prime}^${pairs * 2}`);
            }
            if (remainder > 0) {
                remainingFactors.push(prime);
            }
        }

        steps.push({
            stepNumber: 3,
            step: 'Identify perfect square factors',
            description: 'Group factors into pairs (perfect squares) and remaining factors',
            expression: `√(${factorString})`,
            reasoning: 'Perfect squares can be extracted from under the radical',
            algebraicRule: '√(a²) = a for a ≥ 0',
            perfectSquareFactors: perfectSquares.join(' × '),
            remainingFactors: remainingFactors.join(' × ') || '1',
            visualHint: 'Circle pairs of identical prime factors'
        });

        // Step 4: Extract perfect squares
        if (solution.outsideFactor > 1 || solution.insideFactor < radicand) {
            steps.push({
                stepNumber: 4,
                step: 'Extract perfect squares',
                description: 'Move perfect square factors outside the radical',
                beforeExpression: `√(${factorString})`,
                operation: 'Extract √(a²) = a',
                afterExpression: solution.simplifiedForm,
                reasoning: 'Perfect squares simplify to their square roots when extracted',
                algebraicRule: 'Product Property allows us to separate perfect squares',
                visualHint: 'Perfect squares "escape" from under the radical as their square roots',
                finalAnswer: true,
                workingDetails: {
                    outsideFactor: solution.outsideFactor,
                    insideFactor: solution.insideFactor,
                    check: `(${solution.outsideFactor})² × ${solution.insideFactor} = ${radicand}`
                }
            });
        }

        return steps;
    }

    generateAddSubtractRadicalSteps(problem, solution) {
        const { coeff1, radicand1, operator, coeff2, radicand2 } = problem.parameters;
        const steps = [];

        // Step 1: Given expression
        steps.push({
            stepNumber: 1,
            step: 'Given expression',
            description: 'Start with the sum or difference of radicals',
            expression: `${coeff1}√${radicand1} ${operator} ${coeff2}√${radicand2}`,
            reasoning: 'To add or subtract radicals, they must have the same radicand (like radicals)',
            visualHint: 'Think of radicals like variables - only like terms can be combined',
            goalStatement: 'Simplify each radical, then combine if possible'
        });

        // Step 2: Simplify first radical
        const simplified1 = this.simplifyRadical({ parameters: { radicand: radicand1 } });
        
        if (simplified1.outsideFactor !== 1 || simplified1.insideFactor !== radicand1) {
            steps.push({
                stepNumber: 2,
                step: 'Simplify first radical',
                description: `Simplify √${radicand1}`,
                beforeExpression: `${coeff1}√${radicand1}`,
                afterExpression: `${coeff1 * simplified1.outsideFactor}√${simplified1.insideFactor}`,
                reasoning: 'Simplifying helps us identify if radicals are alike',
                algebraicRule: 'Extract perfect square factors',
                workingDetails: {
                    original: `${coeff1}√${radicand1}`,
                    simplified: `${coeff1 * simplified1.outsideFactor}√${simplified1.insideFactor}`
                }
            });
        }

        // Step 3: Simplify second radical
        const simplified2 = this.simplifyRadical({ parameters: { radicand: radicand2 } });
        
        if (simplified2.outsideFactor !== 1 || simplified2.insideFactor !== radicand2) {
            steps.push({
                stepNumber: steps.length + 1,
                step: 'Simplify second radical',
                description: `Simplify √${radicand2}`,
                beforeExpression: `${coeff2}√${radicand2}`,
                afterExpression: `${coeff2 * simplified2.outsideFactor}√${simplified2.insideFactor}`,
                reasoning: 'Both radicals must be in simplest form before combining',
                algebraicRule: 'Extract perfect square factors',
                workingDetails: {
                    original: `${coeff2}√${radicand2}`,
                    simplified: `${coeff2 * simplified2.outsideFactor}√${simplified2.insideFactor}`
                }
            });
        }

        // Step 4: Check if like radicals and combine
        const finalCoeff1 = coeff1 * simplified1.outsideFactor;
        const finalRadicand1 = simplified1.insideFactor;
        const finalCoeff2 = coeff2 * simplified2.outsideFactor;
        const finalRadicand2 = simplified2.insideFactor;

        if (finalRadicand1 === finalRadicand2) {
            steps.push({
                stepNumber: steps.length + 1,
                step: 'Combine like radicals',
                description: 'Add/subtract the coefficients of like radical terms',
                beforeExpression: `${finalCoeff1}√${finalRadicand1} ${operator} ${finalCoeff2}√${finalRadicand2}`,
                operation: `Combine coefficients: ${finalCoeff1} ${operator} ${finalCoeff2}`,
                afterExpression: solution.simplifiedForm,
                reasoning: 'Like radicals combine by adding/subtracting coefficients, just like like terms',
                algebraicRule: 'a√c ± b√c = (a ± b)√c',
                visualHint: 'Think: 5 apples + 3 apples = 8 apples, similarly 5√2 + 3√2 = 8√2',
                finalAnswer: true,
                areLikeRadicals: true
            });
        } else {
            steps.push({
                stepNumber: steps.length + 1,
                step: 'Identify unlike radicals',
                description: 'Radicals have different radicands and cannot be combined',
                expression: `${finalCoeff1}√${finalRadicand1} ${operator} ${finalCoeff2}√${finalRadicand2}`,
                reasoning: 'Unlike radicals must remain separate, like unlike terms in algebra',
                algebraicRule: '√a + √b cannot be simplified if a ≠ b',
                visualHint: 'Cannot combine: like adding apples and oranges',
                finalAnswer: true,
                areLikeRadicals: false,
                explanation: 'This is already in simplest form'
            });
        }

        return steps;
    }

    generateMultiplyRadicalSteps(problem, solution) {
        const { coeff1, radicand1, coeff2, radicand2 } = problem.parameters;
        const steps = [];

        // Step 1: Given product
        steps.push({
            stepNumber: 1,
            step: 'Given product',
            description: 'Start with the product of two radical expressions',
            expression: `(${coeff1}√${radicand1})(${coeff2}√${radicand2})`,
            reasoning: 'When multiplying radicals, multiply coefficients and multiply radicands separately',
            visualHint: 'Use the product property: √a × √b = √(ab)',
            algebraicRule: 'Product Property of Radicals',
            goalStatement: 'Multiply, then simplify the result'
        });

        // Step 2: Multiply coefficients
        const coeffProduct = coeff1 * coeff2;
        steps.push({
            stepNumber: 2,
            step: 'Multiply coefficients',
            description: 'Multiply the numbers outside the radicals',
            beforeExpression: `(${coeff1}√${radicand1})(${coeff2}√${radicand2})`,
            operation: `${coeff1} × ${coeff2} = ${coeffProduct}`,
            afterExpression: `${coeffProduct}(√${radicand1} × √${radicand2})`,
            reasoning: 'Coefficients multiply like regular numbers',
            algebraicRule: 'Coefficient multiplication: (a√b)(c√d) = ac(√b × √d)',
            workingDetails: {
                calculation: `${coeff1} × ${coeff2} = ${coeffProduct}`
            }
        });

        // Step 3: Multiply radicands
        const radicandProduct = radicand1 * radicand2;
        steps.push({
            stepNumber: 3,
            step: 'Multiply radicands',
            description: 'Use product property to multiply numbers under radicals',
            beforeExpression: `${coeffProduct}(√${radicand1} × √${radicand2})`,
            operation: `√${radicand1} × √${radicand2} = √${radicandProduct}`,
            afterExpression: `${coeffProduct}√${radicandProduct}`,
            reasoning: 'Product property allows us to combine radicals with same index',
            algebraicRule: 'Product Property: √a × √b = √(ab)',
            workingDetails: {
                calculation: `${radicand1} × ${radicand2} = ${radicandProduct}`
            }
        });

        // Step 4: Simplify result
        const finalOutside = solution.solutions[0].outside;
        const finalInside = solution.solutions[0].inside;

        if (finalInside < radicandProduct || finalOutside !== coeffProduct) {
            steps.push({
                stepNumber: 4,
                step: 'Simplify the result',
                description: 'Extract perfect square factors from the product',
                beforeExpression: `${coeffProduct}√${radicandProduct}`,
                afterExpression: solution.simplifiedForm,
                reasoning: 'Always simplify radicals to their simplest form',
                algebraicRule: 'Extract all perfect square factors',
                visualHint: 'Look for perfect squares hiding in the product',
                finalAnswer: true,
                workingDetails: {
                    beforeSimplification: `${coeffProduct}√${radicandProduct}`,
                    afterSimplification: solution.simplifiedForm,
                    verification: `${finalOutside}² × ${finalInside} = ${finalOutside * finalOutside * finalInside}`
                }
            });
        } else {
            steps[steps.length - 1].finalAnswer = true;
        }

        return steps;
    }

    generateDivideRadicalSteps(problem, solution) {
        const { coeff1, radicand1, coeff2, radicand2 } = problem.parameters;
        const steps = [];

        // Step 1: Given quotient
        steps.push({
            stepNumber: 1,
            step: 'Given quotient',
            description: 'Start with the division of two radical expressions',
            expression: `(${coeff1}√${radicand1}) / (${coeff2}√${radicand2})`,
            reasoning: 'When dividing radicals, divide coefficients and radicands separately',
            visualHint: 'Use quotient property: √a / √b = √(a/b)',
            algebraicRule: 'Quotient Property of Radicals',
            goalStatement: 'Divide, rationalize if needed, then simplify'
        });

        // Step 2: Divide coefficients
        const coeffGCD = this.gcd(coeff1, coeff2);
        const coeffNum = coeff1 / coeffGCD;
        const coeffDen = coeff2 / coeffGCD;

        steps.push({
            stepNumber: 2,
            step: 'Divide coefficients',
            description: 'Divide the numbers outside the radicals',
            beforeExpression: `(${coeff1}√${radicand1}) / (${coeff2}√${radicand2})`,
            operation: `${coeff1} / ${coeff2} = ${coeffNum}/${coeffDen}`,
            afterExpression: `(${coeffNum}/${coeffDen})(√${radicand1} / √${radicand2})`,
            reasoning: 'Simplify the coefficient fraction first',
            algebraicRule: 'Reduce fractions to lowest terms',
            workingDetails: {
                gcd: coeffGCD,
                simplified: `${coeffNum}/${coeffDen}`
            }
        });

        // Step 3: Apply quotient property
        const radicandGCD = this.gcd(radicand1, radicand2);
        const radicandNum = radicand1 / radicandGCD;
        const radicandDen = radicand2 / radicandGCD;

        steps.push({
            stepNumber: 3,
            step: 'Apply quotient property',
            description: 'Combine radicals using quotient property',
            beforeExpression: `(${coeffNum}/${coeffDen})(√${radicand1} / √${radicand2})`,
            operation: `√${radicand1} / √${radicand2} = √(${radicandNum}/${radicandDen})`,
            afterExpression: `(${coeffNum}/${coeffDen})√(${radicandNum}/${radicandDen})`,
            reasoning: 'Quotient property combines division of radicals',
            algebraicRule: 'Quotient Property: √a / √b = √(a/b)',
            workingDetails: {
                radicandGCD: radicandGCD,
                simplifiedRadicand: `${radicandNum}/${radicandDen}`
            }
        });

        // Step 4: Rationalize denominator if needed
        if (radicandDen !== 1) {
            steps.push({
                stepNumber: 4,
                step: 'Rationalize denominator',
                description: 'Eliminate radical from denominator',
                beforeExpression: `(${coeffNum}/${coeffDen})√(${radicandNum}/${radicandDen})`,
                operation: `Multiply by √${radicandDen}/√${radicandDen}`,
                afterExpression: solution.rationalizedForm,
                reasoning: 'Standard form requires no radicals in denominator',
                algebraicRule: 'Rationalization: multiply by conjugate or √n/√n',
                visualHint: 'Multiplying by √n/√n is like multiplying by 1',
                criticalWarning: 'Must multiply both numerator and denominator',
                finalAnswer: true,
                workingDetails: {
                    multiplyBy: `√${radicandDen}/√${radicandDen}`,
                    numeratorResult: `${coeffNum}√(${radicandNum} × ${radicandDen})`,
                    denominatorResult: `${coeffDen} × ${radicandDen}`
                }
            });
        }

        return steps;
    }

    generatePythagoreanSteps(problem, solution) {
        const { a, b, c } = problem.parameters;
        const steps = [];

        // Step 1: State Pythagorean theorem
        steps.push({
            stepNumber: 1,
            step: 'Pythagorean Theorem',
            description: 'Apply the relationship between sides of a right triangle',
            expression: 'a² + b² = c²',
            reasoning: 'In a right triangle, the square of the hypotenuse equals sum of squares of legs',
            visualHint: 'Draw a right triangle and label the sides',
            algebraicRule: 'Pythagorean Theorem',
            goalStatement: 'Find the unknown side length'
        });

        // Step 2: Substitute known values
        if (c !== undefined) {
            // Finding c
            steps.push({
                stepNumber: 2,
                step: 'Substitute known values',
                description: `Substitute a = ${a} and b = ${b}`,
                beforeExpression: 'a² + b² = c²',
                afterExpression: `${a}² + ${b}² = c²`,
                reasoning: 'Replace variables with given measurements',
                workingDetails: {
                    knownValues: { a, b },
                    unknown: 'c (hypotenuse)'
                }
            });

            // Step 3: Calculate squares
            const aSquared = a * a;
            const bSquared = b * b;
            const cSquared = aSquared + bSquared;

            steps.push({
                stepNumber: 3,
                step: 'Calculate squares',
                description: 'Square the known side lengths',
                beforeExpression: `${a}² + ${b}² = c²`,
                operation: `${a}² = ${aSquared}, ${b}² = ${bSquared}`,
                afterExpression: `${aSquared} + ${bSquared} = c²`,
                reasoning: 'Evaluate the exponential expressions',
                workingDetails: {
                    aSquared: aSquared,
                    bSquared: bSquared
                }
            });

            // Step 4: Add
            steps.push({
                stepNumber: 4,
                step: 'Add the squares',
                description: 'Sum the squared leg lengths',
                beforeExpression: `${aSquared} + ${bSquared} = c²`,
                operation: `${aSquared} + ${bSquared} = ${cSquared}`,
                afterExpression: `${cSquared} = c²`,
                reasoning: 'This gives us c² (the square of the hypotenuse)',
                workingDetails: {
                    sum: cSquared
                }
            });

            // Step 5: Take square root
            steps.push({
                stepNumber: 5,
                step: 'Take square root',
                description: 'Solve for c by taking square root of both sides',
                beforeExpression: `c² = ${cSquared}`,
                operation: `c = √${cSquared}`,
                afterExpression: `c = ${solution.solutions[0].exact}`,
                reasoning: 'Square root undoes squaring (taking positive root for length)',
                algebraicRule: 'If x² = a, then x = √a (for positive x)',
                visualHint: 'Length must be positive, so we take only the positive root',
                finalAnswer: true,
                workingDetails: {
                    exactForm: solution.solutions[0].exact,
                    decimalForm: solution.solutions[0].decimal.toFixed(4)
                }
            });
        }

        return steps;
    }

    generateDistanceFormulaSteps(problem, solution) {
        const { x1, y1, x2, y2 } = problem.parameters;
        const steps = [];

        // Step 1: State distance formula
        steps.push({
            stepNumber: 1,
            step: 'Distance Formula',
            description: 'Apply the distance formula for points in a coordinate plane',
            expression: 'd = √[(x₂-x₁)² + (y₂-y₁)²]',
            reasoning: 'Distance formula is derived from Pythagorean theorem',
            visualHint: 'Imagine a right triangle connecting the two points',
            algebraicRule: 'Distance Formula',
            goalStatement: 'Find the distance between two points'
        });

        // Step 2: Substitute coordinates
        steps.push({
            stepNumber: 2,
            step: 'Substitute coordinates',
            description: `Substitute the coordinates of the two points`,
            beforeExpression: 'd = √[(x₂-x₁)² + (y₂-y₁)²]',
            afterExpression: `d = √[(${x2}-${x1})² + (${y2}-${y1})²]`,
            reasoning: 'Replace variables with actual coordinate values',
            workingDetails: {
                point1: `(${x1}, ${y1})`,
                point2: `(${x2}, ${y2})`
            }
        });

        // Step 3: Calculate differences
        const dx = x2 - x1;
        const dy = y2 - y1;

        steps.push({
            stepNumber: 3,
            step: 'Calculate differences',
            description: 'Find the horizontal and vertical distances',
            beforeExpression: `d = √[(${x2}-${x1})² + (${y2}-${y1})²]`,
            operation: `Δx = ${dx}, Δy = ${dy}`,
            afterExpression: `d = √[(${dx})² + (${dy})²]`,
            reasoning: 'These represent legs of the right triangle',
            workingDetails: {
                horizontalDistance: dx,
                verticalDistance: dy
            }
        });

        // Step 4: Square the differences
        const dxSquared = dx * dx;
        const dySquared = dy * dy;

        steps.push({
            stepNumber: 4,
            step: 'Square the differences',
            description: 'Square both the horizontal and vertical distances',
            beforeExpression: `d = √[(${dx})² + (${dy})²]`,
            operation: `(${dx})² = ${dxSquared}, (${dy})² = ${dySquared}`,
            afterExpression: `d = √[${dxSquared} + ${dySquared}]`,
            reasoning: 'Squaring is needed for Pythagorean relationship',
            workingDetails: {
                dxSquared: dxSquared,
                dySquared: dySquared
            }
        });

        // Step 5: Add and simplify
        const dSquared = dxSquared + dySquared;

        steps.push({
            stepNumber: 5,
            step: 'Add and simplify',
            description: 'Sum the squared differences and simplify the radical',
            beforeExpression: `d = √[${dxSquared} + ${dySquared}]`,
            operation: `${dxSquared} + ${dySquared} = ${dSquared}`,
            afterExpression: `d = ${solution.solutions[0].exact}`,
            reasoning: 'Simplify the radical if possible',
            algebraicRule: 'Extract perfect square factors',
            finalAnswer: true,
            workingDetails: {
                sum: dSquared,
                exactForm: solution.solutions[0].exact,
                decimalForm: solution.solutions[0].decimal.toFixed(4)
            }
        });

        return steps;
    }

    generateGenericRadicalSteps(problem, solution) {
        return [{
            stepNumber: 1,
            step: 'Generic radical problem',
            description: 'Solve the given radical problem',
            expression: problem.expression || 'Problem not fully specified',
            reasoning: 'Apply appropriate radical simplification techniques',
            solution: solution
        }];
    }

    // STEP ENHANCEMENT METHODS (similar to linear workbook)

    enhanceStepExplanation(step, problem, solution, stepIndex, totalSteps) {
        const enhanced = {
            ...step,
            stepNumber: stepIndex + 1,
            totalSteps: totalSteps,

            // Multiple explanation formats
            explanations: {
                conceptual: this.getConceptualExplanationRadical(step, problem),
                procedural: this.getProceduralExplanationRadical(step),
                visual: this.getVisualExplanationRadical(step, problem),
                algebraic: this.getAlgebraicExplanationRadical(step)
            },

            // Difficulty-adapted explanations
            adaptiveExplanation: this.getAdaptiveExplanation(step, this.explanationLevel),

            // Learning support
            learningSupport: {
                prerequisiteSkills: this.identifyPrerequisitesRadical(step, problem.type),
                keyVocabulary: this.identifyKeyVocabularyRadical(step),
                connectionsToPrevious: stepIndex > 0 ? this.connectToPreviousStep(step, stepIndex) : null
            }
        };

        return enhanced;
    }

    getConceptualExplanationRadical(step, problem) {
        const conceptualExplanations = {
            'Given radical': 'A radical represents a root - the opposite of raising to a power. √a asks "what number squared gives a?"',
            'Find prime factorization': 'Breaking into primes reveals the building blocks, making it easier to spot perfect squares.',
            'Identify perfect square factors': 'Perfect squares are numbers we can take the square root of exactly, like 4, 9, 16, etc.',
            'Extract perfect squares': 'Perfect squares can "escape" from under the radical because we know their exact square root.',
            'Multiply radicands': 'The product property lets us combine radicals - multiplying under one radical is the same as multiplying separate radicals.',
            'Rationalize denominator': 'We rationalize to follow standard mathematical convention - no radicals should remain in denominators.'
        };

        return conceptualExplanations[step.step] || 'This step simplifies the radical expression.';
    }

    getProceduralExplanationRadical(step) {
        if (step.operation) {
            return `1. Identify the operation: ${step.operation}
2. Apply this operation carefully
3. Simplify the result
4. Check if further simplification is possible`;
        }
        return 'Follow the standard procedure for this type of radical operation.';
    }

    getVisualExplanationRadical(step, problem) {
        const visualExplanations = {
            'simplify_radical': 'Imagine the radicand as a collection of objects - pair them up, and each pair can leave the radical.',
            'add_subtract_radicals': 'Like combining like terms: 3√2 + 5√2 is like 3 apples + 5 apples = 8 apples.',
            'multiply_radicals': 'Picture multiplying dimensions: length × width under one square root.',
            'pythagorean': 'Visualize a right triangle with squares built on each side - the theorem relates their areas.'
        };

        return visualExplanations[problem.type] || 'Visualize the radical operation as simplifying complex expressions.';
    }

    getAlgebraicExplanationRadical(step) {
        const algebraicRules = {
            'Find prime factorization': 'Fundamental Theorem of Arithmetic: every integer has unique prime factorization',
            'Extract perfect squares': 'Power Property: √(a²) = |a|, or a for a ≥ 0',
            'Multiply radicands': 'Product Property: √a × √b = √(ab) for a, b ≥ 0',
            'Rationalize denominator': 'Multiply by conjugate or appropriate radical form to eliminate denominator radicals'
        };

        return algebraicRules[step.step] || 'Apply standard radical properties and rules';
    }

    addStepBridges(steps, problem) {
        const enhancedSteps = [];

        for (let i = 0; i < steps.length; i++) {
            enhancedSteps.push(steps[i]);

            if (i < steps.length - 1) {
                enhancedSteps.push({
                    stepType: 'bridge',
                    title: 'Connecting to Next Step',
                    explanation: this.generateStepBridgeRadical(steps[i], steps[i + 1]),
                    reasoning: this.explainStepProgression(steps[i], steps[i + 1]),
                    strategicThinking: this.explainStepStrategy(steps[i + 1])
                });
            }
        }

        return enhancedSteps;
    }

    generateStepBridgeRadical(currentStep, nextStep) {
        return {
            currentState: `We now have: ${currentStep.afterExpression || currentStep.expression}`,
            nextGoal: `Next, we need to: ${nextStep.description}`,
            why: `This step is necessary to continue simplifying the radical expression`,
            howItHelps: `This brings us closer to the simplest radical form`
        };
    }

    addErrorPrevention(step, problemType) {
        const mistakes = this.commonMistakes[problemType]?.[step.step] || [];

        return {
            ...step,
            errorPrevention: {
                commonMistakes: mistakes,
                preventionTips: this.generatePreventionTipsRadical(step, problemType),
                checkPoints: this.generateCheckPointsRadical(step),
                warningFlags: this.identifyWarningFlagsRadical(step, problemType)
            },
            validation: {
                selfCheck: this.generateSelfCheckQuestionRadical(step),
                expectedResult: this.describeExpectedResultRadical(step),
                troubleshooting: this.generateTroubleshootingTipsRadical(step)
            }
        };
    }

    generatePreventionTipsRadical(step, problemType) {
        const tips = {
            'Find prime factorization': [
                'Use factor trees or division method systematically',
                'Double-check that all factors are actually prime',
                'Verify by multiplying factors back together'
            ],
            'Identify perfect square factors': [
                'Look for prime factors that appear in pairs',
                'Remember: a prime appearing twice forms a perfect square',
                'Check your exponents carefully'
            ],
            'Multiply radicands': [
                'Don\'t forget to multiply the coefficients separately',
                'Always simplify the product under the radical',
                'Check if the result can be simplified further'
            ]
        };

        return tips[step.step] || ['Check your work at each stage', 'Verify using inverse operations'];
    }

    generateCheckPointsRadical(step) {
        return [
            'Have I applied the operation correctly?',
            'Is the radical in simplest form?',
            'Are there any perfect square factors remaining under the radical?',
            'Does my answer make mathematical sense?'
        ];
    }

    identifyWarningFlagsRadical(step, problemType) {
        const warnings = {
            simplify_radical: step.step === 'Extract perfect squares' ?
                ['Make sure you extract ALL perfect square factors'] : [],
            add_subtract_radicals: step.step === 'Combine like radicals' ?
                ['Verify radicands are identical before combining'] : [],
            divide_radicals: step.step === 'Rationalize denominator' ?
                ['Must rationalize - no radicals should remain in denominator'] : [],
            radical_equation: step.step === 'Square both sides' ?
                ['Warning: squaring can introduce extraneous solutions - must check!'] : []
        };

        return warnings[problemType] || [];
    }

    generateSelfCheckQuestionRadical(step) {
        const questions = {
            'Find prime factorization': 'Are all my factors actually prime numbers?',
            'Extract perfect squares': 'Have I found all the perfect square factors?',
            'Multiply radicands': 'Did I remember to simplify the result?',
            'Rationalize denominator': 'Is my denominator now free of radicals?'
        };

        return questions[step.step] || 'Does this step bring me closer to the simplest form?';
    }

    describeExpectedResultRadical(step) {
        const expectations = {
            'Find prime factorization': 'A product of prime numbers that equals the original radicand',
            'Extract perfect squares': 'Numbers outside the radical and only non-perfect-square factors inside',
            'Rationalize denominator': 'No radicals in the denominator',
            'Combine like radicals': 'A single radical term with combined coefficient'
        };

        return expectations[step.step] || 'A simpler form of the radical expression';
    }

    generateTroubleshootingTipsRadical(step) {
        return [
            'If stuck, go back to prime factorization',
            'Check for arithmetic errors in multiplication/division',
            'Verify you haven\'t missed any perfect square factors',
            'Try working backwards to check your answer'
        ];
    }

    addScaffolding(steps, problem) {
        return steps.map((step, index) => ({
            ...step,
            scaffolding: {
                guidingQuestions: this.generateGuidingQuestionsRadical(step, problem),
                subSteps: this.breakIntoSubStepsRadical(step),
                hints: this.generateProgressiveHintsRadical(step),
                practiceVariation: this.generatePracticeVariationRadical(step, problem)
            },
            metacognition: {
                thinkingProcess: this.explainThinkingProcessRadical(step),
                decisionPoints: this.identifyDecisionPointsRadical(step),
                alternativeApproaches: this.suggestAlternativeMethodsRadical(step, problem)
            }
        }));
    }

    generateGuidingQuestionsRadical(step, problem) {
        const questions = {
            'Given radical': [
                'What is under the radical sign?',
                'What am I being asked to do with this radical?',
                'Is this radical already in simplest form?'
            ],
            'Find prime factorization': [
                'What is the smallest prime that divides this number?',
                'How can I break this down systematically?',
                'Have I checked all possible prime factors?'
            ],
            'Extract perfect squares': [
                'Which prime factors appear in pairs?',
                'What is the square root of each perfect square?',
                'What remains under the radical?'
            ]
        };

        return questions[step.step] || ['What is the goal of this step?', 'How does this simplify the expression?'];
    }

    breakIntoSubStepsRadical(step) {
        if (step.step === 'Find prime factorization') {
            return [
                'Start with the smallest prime (2)',
                'Divide the radicand by this prime if possible',
                'Repeat until the number is no longer divisible',
                'Move to the next prime (3, 5, 7, ...)',
                'Continue until quotient is 1'
            ];
        }
        if (step.step === 'Extract perfect squares') {
            return [
                'Look at the prime factorization',
                'Identify primes that appear at least twice',
                'For each pair, take one factor outside the radical',
                'Multiply all outside factors together',
                'Multiply remaining inside factors together'
            ];
        }
        return ['Analyze the current expression', 'Apply the appropriate operation', 'Simplify'];
    }

    generateProgressiveHintsRadical(step) {
        return {
            level1: 'Think about what property of radicals applies here',
            level2: 'Look for perfect squares or factors that can be simplified',
            level3: 'Remember: √(a²) = a and √(ab) = √a × √b',
            level4: step.operation ? `Try: ${step.operation}` : 'Apply the product or quotient property'
        };
    }

    generatePracticeVariationRadical(step, problem) {
        return {
            similarProblem: 'Try simplifying √72 or √50 using the same method',
            practiceHint: 'Start with smaller radicands like √12 or √18',
            extension: 'Try radicals with larger radicands or higher indices (cube roots, etc.)'
        };

    }

    explainThinkingProcessRadical(step) {
        return {
            observe: 'What radical expression do I have?',
            goal: 'What is the simplest form this can take?',
            strategy: 'What property or operation will help me simplify?',
            execute: 'How do I carefully apply this operation?',
            verify: 'Is this fully simplified? Can I verify by squaring?'
        };
    }

    identifyDecisionPointsRadical(step) {
        return [
            'Choosing which factorization method to use',
            'Deciding when to stop factoring',
            'Determining if rationalization is needed',
            'Selecting the most efficient simplification path'
        ];
    }

    suggestAlternativeMethodsRadical(step, problem) {
        const alternatives = {
            'Find prime factorization': [
                'Factor tree method (visual branching)',
                'Division method (systematic division by primes)',
                'Using known perfect squares (recognize 4, 9, 16, 25, etc.)'
            ],
            'Multiply radicands': [
                'Simplify first, then multiply',
                'Multiply first, then simplify',
                'Use estimation to check reasonableness'
            ]
        };

        return alternatives[step.step] || ['The method shown is most straightforward for this problem'];
    }

    identifyPrerequisitesRadical(step, problemType) {
        const prerequisites = {
            'Find prime factorization': ['Prime numbers', 'Division', 'Multiplication'],
            'Extract perfect squares': ['Perfect squares', 'Square roots', 'Exponent rules'],
            'Rationalize denominator': ['Multiplication of radicals', 'Fraction operations'],
            'Pythagorean Theorem': ['Right triangles', 'Squaring numbers', 'Square roots']
        };

        return prerequisites[step.step] || ['Basic radical properties'];
    }

    identifyKeyVocabularyRadical(step) {
        const vocabulary = {
            'Given radical': ['radical', 'radicand', 'index', 'square root'],
            'Find prime factorization': ['prime number', 'composite number', 'factor', 'prime factorization'],
            'Extract perfect squares': ['perfect square', 'extract', 'simplify'],
            'Rationalize denominator': ['rationalize', 'conjugate', 'denominator']
        };

        return vocabulary[step.step] || [];
    }

    // VERIFICATION METHODS

    verifySimplifyRadical() {
        const { radicand } = this.currentProblem.parameters;
        const solution = this.currentSolution;

        const outside = solution.outsideFactor;
        const inside = solution.insideFactor;
        
        // Verify: outside² × inside should equal original radicand
        const verification = (outside * outside) * inside;
        const isCorrect = verification === radicand;

        return {
            originalRadicand: radicand,
            simplifiedForm: solution.simplifiedForm,
            outsideFactor: outside,
            insideFactor: inside,
            verification: `(${outside})² × ${inside} = ${verification}`,
            isCorrect: isCorrect,
            isFullySimplified: solution.isFullySimplified
        };
    }

    verifyAddSubtractRadical() {
        const solution = this.currentSolution;
        
        return {
            areLikeRadicals: solution.areLikeRadicals,
            simplifiedForm: solution.simplifiedForm,
            canBeCombined: solution.areLikeRadicals,
            note: solution.areLikeRadicals ? 
                'Like radicals successfully combined' : 
                'Unlike radicals cannot be combined further'
        };
    }

    verifyMultiplyRadical() {
        const { coeff1, radicand1, coeff2, radicand2 } = this.currentProblem.parameters;
        const solution = this.currentSolution;

        const expectedCoeff = coeff1 * coeff2;
        const expectedRadicand = radicand1 * radicand2;

        return {
            originalExpression: `(${coeff1}√${radicand1})(${coeff2}√${radicand2})`,
            intermediateProduct: `${expectedCoeff}√${expectedRadicand}`,
            simplifiedForm: solution.simplifiedForm,
            coefficientProduct: `${coeff1} × ${coeff2} = ${expectedCoeff}`,
            radicandProduct: `${radicand1} × ${radicand2} = ${expectedRadicand}`,
            isSimplified: true
        };
    }

    verifyDivideRadical() {
        const solution = this.currentSolution;
        
        return {
            originalExpression: solution.expression,
            rationalizedForm: solution.rationalizedForm,
            denominatorHasRadical: solution.needsRationalization,
            isRationalized: !solution.needsRationalization || solution.rationalizedForm !== undefined,
            note: 'Denominator has been rationalized - no radicals remain in denominator'
        };
    }

    verifyPythagorean() {
        const { a, b } = this.currentProblem.parameters;
        const solution = this.currentSolution;

        if (!solution.solutions || solution.solutions.length === 0) {
            return { type: 'no_solution', message: solution.explanation };
        }

        const cDecimal = solution.solutions[0].decimal;
        
        // Verify: a² + b² should equal c²
        const aSquared = a * a;
        const bSquared = b * b;
        const cSquaredCalc = cDecimal * cDecimal;
        const cSquaredExpected = aSquared + bSquared;
        
        const difference = Math.abs(cSquaredCalc - cSquaredExpected);
        const isValid = difference < 0.0001;

        return {
            theorem: 'a² + b² = c²',
            givenValues: { a, b },
            calculation: `${a}² + ${b}² = ${aSquared} + ${bSquared} = ${cSquaredExpected}`,
            cValue: solution.solutions[0].exact,
            cDecimal: cDecimal.toFixed(4),
            verification: `c² = ${cSquaredCalc.toFixed(4)}`,
            isValid: isValid,
            difference: difference
        };
    }

    verifyDistanceFormula() {
        const { x1, y1, x2, y2 } = this.currentProblem.parameters;
        const solution = this.currentSolution;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dSquared = dx * dx + dy * dy;
        const dCalculated = Math.sqrt(dSquared);

        return {
            formula: 'd = √[(x₂-x₁)² + (y₂-y₁)²]',
            points: { point1: [x1, y1], point2: [x2, y2] },
            differences: { dx, dy },
            calculation: `√[(${dx})² + (${dy})²] = √${dSquared}`,
            exactDistance: solution.solutions[0].exact,
            decimalDistance: solution.solutions[0].decimal.toFixed(4),
            verification: `Calculated: ${dCalculated.toFixed(4)}`,
            isValid: Math.abs(dCalculated - solution.solutions[0].decimal) < 0.0001
        };
    }

    // FORMATTING METHODS FOR VERIFICATION

    formatSimplifyRadicalVerification(verification) {
        return [
            ['Original Radicand', verification.originalRadicand],
            ['Simplified Form', verification.simplifiedForm],
            ['Outside Factor', verification.outsideFactor],
            ['Inside Factor', verification.insideFactor],
            ['Verification', verification.verification],
            ['Is Correct', verification.isCorrect ? 'Yes' : 'No'],
            ['Fully Simplified', verification.isFullySimplified ? 'Yes' : 'No']
        ];
    }

    formatAddSubtractRadicalVerification(verification) {
        return [
            ['Are Like Radicals', verification.areLikeRadicals ? 'Yes' : 'No'],
            ['Can Be Combined', verification.canBeCombined ? 'Yes' : 'No'],
            ['Simplified Form', verification.simplifiedForm],
            ['Note', verification.note]
        ];
    }

    formatMultiplyRadicalVerification(verification) {
        return [
            ['Original Expression', verification.originalExpression],
            ['Intermediate Product', verification.intermediateProduct],
            ['Coefficient Product', verification.coefficientProduct],
            ['Radicand Product', verification.radicandProduct],
            ['Final Simplified Form', verification.simplifiedForm],
            ['Is Simplified', verification.isSimplified ? 'Yes' : 'No']
        ];
    }

    formatDivideRadicalVerification(verification) {
        return [
            ['Original Expression', verification.originalExpression],
            ['Rationalized Form', verification.rationalizedForm],
            ['Needed Rationalization', verification.denominatorHasRadical ? 'Yes' : 'No'],
            ['Is Rationalized', verification.isRationalized ? 'Yes' : 'No'],
            ['Note', verification.note]
        ];
    }

    formatPythagoreanVerification(verification) {
        if (verification.type === 'no_solution') {
            return [['Result', verification.message]];
        }

        return [
            ['Theorem', verification.theorem],
            ['Given: a', verification.givenValues.a],
            ['Given: b', verification.givenValues.b],
            ['Calculation', verification.calculation],
            ['c (exact)', verification.cValue],
            ['c (decimal)', verification.cDecimal],
            ['Verification', verification.verification],
            ['Is Valid', verification.isValid ? 'Yes' : 'No'],
            ['Difference', verification.difference.toExponential(4)]
        ];
    }

    formatDistanceFormulaVerification(verification) {
        return [
            ['Formula', verification.formula],
            ['Point 1', `(${verification.points.point1.join(', ')})`],
            ['Point 2', `(${verification.points.point2.join(', ')})`],
            ['Δx', verification.differences.dx],
            ['Δy', verification.differences.dy],
            ['Calculation', verification.calculation],
            ['Distance (exact)', verification.exactDistance],
            ['Distance (decimal)', verification.decimalDistance],
            ['Verification', verification.verification],
            ['Is Valid', verification.isValid ? 'Yes' : 'No']
        ];
    }

    calculateVerificationConfidence() {
        if (!this.currentSolution || !this.currentProblem) return 'Unknown';

        const { type } = this.currentProblem;

        switch (type) {
            case 'simplify_radical':
                const verification = this.verifySimplifyRadical();
                return verification.isCorrect && verification.isFullySimplified ? 'High' : 'Medium';

            case 'add_subtract_radicals':
                const addVerification = this.verifyAddSubtractRadical();
                return addVerification.areLikeRadicals ? 'High' : 'Confirmed (unlike radicals)';

            case 'multiply_radicals':
                return 'High';

            case 'divide_radicals':
                const divVerification = this.verifyDivideRadical();
                return divVerification.isRationalized ? 'High' : 'Medium';

            case 'pythagorean':
                const pythagVerification = this.verifyPythagorean();
                return pythagVerification.isValid ? 'High' : 'Low';

            case 'distance_formula':
                const distVerification = this.verifyDistanceFormula();
                return distVerification.isValid ? 'High' : 'Low';

            default:
                return 'Medium';
        }
    }

    getVerificationNotes() {
        const { type } = this.currentProblem;
        const notes = [];

        switch (type) {
            case 'simplify_radical':
                notes.push('Verified by squaring outside factor and multiplying by inside factor');
                notes.push('Checked that no perfect square factors remain');
                break;

            case 'add_subtract_radicals':
                notes.push('Verified that radicands are identical for like radicals');
                notes.push('Coefficients combined correctly');
                break;

            case 'multiply_radicals':
                notes.push('Product property applied: √a × √b = √(ab)');
                notes.push('Result simplified by extracting perfect squares');
                break;

            case 'divide_radicals':
                notes.push('Quotient property applied correctly');
                notes.push('Denominator rationalized - no radicals remain');
                break;

            case 'pythagorean':
                notes.push('Pythagorean theorem verified: a² + b² = c²');
                notes.push('Result checked by squaring calculated value');
                break;

            case 'distance_formula':
                notes.push('Distance formula derived from Pythagorean theorem');
                notes.push('Coordinate differences calculated correctly');
                break;

            default:
                notes.push('Standard radical verification methods applied');
        }

        return notes.join('; ');
    }

    generatePedagogicalNotes(problemType) {
        const pedagogicalDatabase = {
            simplify_radical: {
                objectives: [
                    'Simplify radical expressions by extracting perfect square factors',
                    'Use prime factorization to identify simplification opportunities',
                    'Recognize when a radical is in simplest form'
                ],
                keyConcepts: [
                    'Prime factorization',
                    'Perfect square factors',
                    'Product property of radicals',
                    'Simplest radical form'
                ],
                prerequisites: [
                    'Prime numbers and factorization',
                    'Perfect squares (1, 4, 9, 16, 25, ...)',
                    'Square root concept',
                    'Multiplication and division'
                ],
                commonDifficulties: [
                    'Missing perfect square factors in factorization',
                    'Not simplifying completely',
                    'Confusion between extracting and simplifying',
                    'Arithmetic errors in factorization'
                ],
                extensions: [
                    'Higher index radicals (cube roots, etc.)',
                    'Radicals with variables',
                    'Rationalizing denominators',
                    'Complex radical expressions'
                ],
                assessment: [
                    'Check prime factorization accuracy',
                    'Verify all perfect squares extracted',
                    'Test with various radicand sizes',
                    'Confirm understanding of simplest form'
                ]
            },
            add_subtract_radicals: {
                objectives: [
                    'Identify like and unlike radical terms',
                    'Combine like radicals by adding/subtracting coefficients',
                    'Simplify radicals before attempting to combine'
                ],
                keyConcepts: [
                    'Like radicals (same radicand)',
                    'Coefficient operations',
                    'Radical simplification before combining',
                    'Unlike radicals cannot be combined'
                ],
                prerequisites: [
                    'Simplifying radicals',
                    'Combining like terms in algebra',
                    'Addition and subtraction',
                    'Coefficient identification'
                ],
                commonDifficulties: [
                    'Attempting to combine unlike radicals',
                    'Not simplifying first',
                    'Thinking √a + √b = √(a+b)',
                    'Forgetting coefficient of 1 when not shown'
                ],
                extensions: [
                    'Adding/subtracting with multiple terms',
                    'Mixed operations with radicals',
                    'Radicals in algebraic expressions',
                    'Application problems'
                ],
                assessment: [
                    'Test with like and unlike radicals',
                    'Check simplification before combining',
                    'Verify coefficient operations',
                    'Test understanding with counterexamples'
                ]
            },
            multiply_radicals: {
                objectives: [
                    'Apply product property to multiply radicals',
                    'Multiply coefficients and radicands separately',
                    'Simplify products of radical expressions'
                ],
                keyConcepts: [
                    'Product property: √a × √b = √(ab)',
                    'Coefficient multiplication',
                    'Radicand multiplication',
                    'Post-multiplication simplification'
                ],
                prerequisites: [
                    'Simplifying radicals',
                    'Multiplication facts',
                    'Product property understanding',
                    'Prime factorization'
                ],
                commonDifficulties: [
                    'Not multiplying coefficients',
                    'Not multiplying radicands',
                    'Forgetting to simplify result',
                    'Confusion with addition of radicals'
                ],
                extensions: [
                    'Multiplying binomials with radicals (FOIL)',
                    'Conjugate pairs',
                    'Radical expressions with variables',
                    'Rationalizing with multiplication'
                ],
                assessment: [
                    'Check both coefficient and radicand multiplication',
                    'Verify final simplification',
                    'Test with various combinations',
                    'Assess understanding of product property'
                ]
            },
            divide_radicals: {
                objectives: [
                    'Apply quotient property to divide radicals',
                    'Rationalize denominators',
                    'Simplify quotients of radical expressions'
                ],
                keyConcepts: [
                    'Quotient property: √a / √b = √(a/b)',
                    'Rationalization concept',
                    'Multiplying by √n/√n',
                    'Standard form (no radicals in denominator)'
                ],
                prerequisites: [
                    'Multiplying radicals',
                    'Fraction operations',
                    'Equivalent fractions',
                    'Simplifying radicals'
                ],
                commonDifficulties: [
                    'Forgetting to rationalize',
                    'Not multiplying numerator when rationalizing',
                    'Confusion about when rationalization is needed',
                    'Arithmetic errors in rationalization'
                ],
                extensions: [
                    'Rationalizing binomial denominators (conjugates)',
                    'Complex rational expressions',
                    'Higher index radical division',
                    'Multiple radical terms'
                ],
                assessment: [
                    'Check rationalization completeness',
                    'Verify numerator multiplication',
                    'Test understanding of standard form',
                    'Assess simplification accuracy'
                ]
            },
            pythagorean: {
                objectives: [
                    'Apply Pythagorean theorem to right triangles',
                    'Solve for unknown sides using radicals',
                    'Interpret radical solutions in geometric context'
                ],
                keyConcepts: [
                    'Pythagorean theorem: a² + b² = c²',
                    'Right triangle identification',
                    'Hypotenuse vs. legs',
                    'Radical solutions for irrational lengths'
                ],
                prerequisites: [
                    'Right triangle properties',
                    'Squaring numbers',
                    'Simplifying radicals',
                    'Geometry vocabulary'
                ],
                commonDifficulties: [
                    'Confusing which side is the hypotenuse',
                    'Not recognizing when to use the theorem',
                    'Arithmetic errors in squaring',
                    'Not simplifying radical answers'
                ],
                extensions: [
                    'Pythagorean triples',
                    '3D applications (space diagonals)',
                    'Coordinate geometry connections',
                    'Trigonometry relationships'
                ],
                assessment: [
                    'Check triangle identification',
                    'Verify correct formula application',
                    'Test with various side combinations',
                    'Assess radical simplification'
                ]
            },
            distance_formula: {
                objectives: [
                    'Apply distance formula to find distance between points',
                    'Connect distance formula to Pythagorean theorem',
                    'Simplify radical distance expressions'
                ],
                keyConcepts: [
                    'Distance formula: d = √[(x₂-x₁)² + (y₂-y₁)²]',
                    'Coordinate plane navigation',
                    'Horizontal and vertical distances',
                    'Pythagorean connection'
                ],
                prerequisites: [
                    'Coordinate graphing',
                    'Pythagorean theorem',
                    'Simplifying radicals',
                    'Order of operations'
                ],
                commonDifficulties: [
                    'Sign errors in calculating differences',
                    'Forgetting to square the differences',
                    'Order confusion (x₂-x₁ vs x₁-x₂)',
                    'Not simplifying the radical result'
                ],
                extensions: [
                    '3D distance formula',
                    'Midpoint formula',
                    'Applications to circles',
                    'Optimization problems'
                ],
                assessment: [
                    'Check coordinate identification',
                    'Verify difference calculations',
                    'Test formula memorization',
                    'Assess practical applications'
                ]
            },
            radical_equation: {
                objectives: [
                    'Solve equations containing radicals',
                    'Isolate radical terms before squaring',
                    'Check for extraneous solutions'
                ],
                keyConcepts: [
                    'Isolating the radical',
                    'Squaring both sides',
                    'Extraneous solutions',
                    'Solution verification'
                ],
                prerequisites: [
                    'Solving linear equations',
                    'Simplifying radicals',
                    'Squaring expressions',
                    'Substitution for checking'
                ],
                commonDifficulties: [
                    'Not isolating the radical first',
                    'Incorrectly squaring binomials',
                    'Not checking for extraneous solutions',
                    'Domain restriction errors'
                ],
                extensions: [
                    'Equations with multiple radicals',
                    'Higher index radical equations',
                    'Systems involving radicals',
                    'Application word problems'
                ],
                assessment: [
                    'Check isolation technique',
                    'Verify squaring process',
                    'Test solution checking habit',
                    'Assess extraneous solution identification'
                ]
            }
        };

        return pedagogicalDatabase[problemType] || {
            objectives: ['Solve the given radical problem'],
            keyConcepts: ['Apply appropriate radical properties'],
            prerequisites: ['Basic radical understanding'],
            commonDifficulties: ['Various computational errors'],
            extensions: ['More complex variations'],
            assessment: ['Check understanding of solution process']
        };
    }

    generateAlternativeMethods(problemType) {
        const alternativeDatabase = {
            simplify_radical: {
                primaryMethod: 'Prime factorization and extraction',
                methods: [
                    {
                        name: 'Perfect Square Recognition',
                        description: 'Identify known perfect squares (4, 9, 16, 25, etc.) that divide the radicand'
                    },
                    {
                        name: 'Factor Tree Method',
                        description: 'Use visual factor tree to break down into primes'
                    },
                    {
                        name: 'Systematic Division',
                        description: 'Divide by primes systematically: 2, 3, 5, 7, 11, ...'
                    },
                    {
                        name: 'Estimation Check',
                        description: 'Estimate decimal value to verify simplification makes sense'
                    }
                ],
                comparison: 'Prime factorization is most systematic; perfect square recognition is fastest for experienced students; factor trees are most visual'
            },
            multiply_radicals: {
                primaryMethod: 'Product property with post-simplification',
                methods: [
                    {
                        name: 'Simplify First Method',
                        description: 'Simplify each radical before multiplying'
                    },
                    {
                        name: 'Multiply First Method',
                        description: 'Multiply radicands first, then simplify the product'
                    },
                    {
                        name: 'Mixed Approach',
                        description: 'Partially simplify, multiply, then finish simplifying'
                    }
                ],
                comparison: 'Multiply-first is often cleaner; simplify-first helps with larger numbers; mixed approach is flexible'
            },
            divide_radicals: {
                primaryMethod: 'Quotient property with rationalization',
                methods: [
                    {
                        name: 'Simplify-Then-Rationalize',
                        description: 'Simplify numerator and denominator separately, then rationalize'
                    },
                    {
                        name: 'Rationalize-Then-Simplify',
                        description: 'Rationalize first, then simplify the entire expression'
                    },
                    {
                        name: 'Conjugate Method',
                        description: 'For binomial denominators, multiply by conjugate'
                    }
                ],
                comparison: 'Order matters less than careful execution; conjugate method essential for binomials'
            },
            pythagorean: {
                primaryMethod: 'Direct application of a² + b² = c²',
                methods: [
                    {
                        name: 'Algebraic Method',
                        description: 'Substitute values, solve equation, simplify radical'
                    },
                    {
                        name: 'Pythagorean Triples',
                        description: 'Recognize common triples (3-4-5, 5-12-13, etc.) and multiples'
                    },
                    {
                        name: 'Geometric Construction',
                        description: 'Draw accurate diagram, use ruler/compass if needed'
                    },
                    {
                        name: 'Calculator Verification',
                        description: 'Use calculator to check decimal approximation'
                    }
                ],
                comparison: 'Algebraic method is most rigorous; triples save time; construction builds intuition'
            }
        };

        return alternativeDatabase[problemType] || {
            primaryMethod: 'Standard radical approach',
            methods: [
                {
                    name: 'Systematic Approach',
                    description: 'Follow standard problem-solving steps'
                }
            ],
            comparison: 'Method choice depends on problem complexity and familiarity'
        };
    }

    // GRAPH DATA GENERATION

    generateRadicalGraphData() {
        if (!this.currentSolution) return;

        const { type } = this.currentProblem;

        switch(type) {
            case 'simplify_radical':
                // No graph needed for simplification
                break;

            case 'pythagorean':
                if (this.currentSolution.solutions && this.currentSolution.solutions.length > 0) {
                    this.graphData = this.generatePythagoreanGraph(this.currentProblem.parameters, this.currentSolution);
                }
                break;

            case 'distance_formula':
                if (this.currentSolution.solutions && this.currentSolution.solutions.length > 0) {
                    this.graphData = this.generateDistanceGraph(this.currentProblem.parameters, this.currentSolution);
                }
                break;
        }
    }

    generatePythagoreanGraph(params, solution) {
        const { a, b } = params;
        const c = solution.solutions[0].decimal;

        return {
            type: 'right_triangle',
            sides: { a, b, c },
            vertices: [
                { x: 0, y: 0, label: 'Origin' },
                { x: a, y: 0, label: `(${a}, 0)` },
                { x: a, y: b, label: `(${a}, ${b})` }
            ],
            rightAngle: { x: a, y: 0 }
        };
    }

    generateDistanceGraph(params, solution) {
        const { x1, y1, x2, y2 } = params;
        const distance = solution.solutions[0].decimal;

        return {
            type: 'distance_between_points',
            points: [
                { x: x1, y: y1, label: `P₁(${x1}, ${y1})` },
                { x: x2, y: y2, label: `P₂(${x2}, ${y2})` }
            ],
            distance: distance,
            distanceLabel: solution.solutions[0].exact
        };
    }

    // WORKBOOK GENERATION

    generateRadicalWorkbook() {
        if (!this.currentSolution || !this.currentProblem) return;

        const workbook = this.createWorkbookStructure();

        workbook.sections = [
            this.createProblemSection(),
            this.createEnhancedStepsSection(),
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
            title: 'Radical Mathematical Workbook',
            timestamp: new Date().toISOString(),
            theme: this.theme,
            dimensions: { width: this.width, height: this.height },
            sections: []
        };
    }

    createProblemSection() {
        if (!this.currentProblem) return null;

        const problemData = [
            ['Problem Type', this.radicalTypes[this.currentProblem.type]?.name || this.currentProblem.type],
            ['Expression', this.currentProblem.originalInput || 'N/A']
        ];

        if (this.currentProblem.scenario) {
            problemData.push(['Description', this.currentProblem.scenario]);
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
            // Skip bridge steps in main display (they're for learning)
            if (step.stepType === 'bridge' && this.explanationLevel !== 'scaffolded') {
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

            if (step.visualHint && this.explanationLevel !== 'basic') {
                stepsData.push(['Visual Hint', step.visualHint]);
            }

            // Enhanced explanations for detailed level
            if (step.explanations && this.explanationLevel === 'detailed') {
                stepsData.push(['Conceptual', step.explanations.conceptual]);
            }

            // Error prevention
            if (step.errorPrevention && this.includeErrorPrevention) {
                if (step.errorPrevention.commonMistakes && step.errorPrevention.commonMistakes.length > 0) {
                    stepsData.push(['Common Mistakes', step.errorPrevention.commonMistakes.join('; ')]);
                }
                if (step.errorPrevention.preventionTips && step.errorPrevention.preventionTips.length > 0) {
                    stepsData.push(['Prevention Tips', step.errorPrevention.preventionTips.join('; ')]);
                }
            }

            // Scaffolding for guided learning
            if (step.scaffolding && this.explanationLevel === 'scaffolded') {
                if (step.scaffolding.guidingQuestions) {
                    stepsData.push(['Guiding Questions', step.scaffolding.guidingQuestions.join(' ')]);
                }
            }

            // Working details
            if (step.workingDetails) {
                const details = Object.entries(step.workingDetails)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('; ');
                stepsData.push(['Working Details', details]);
            }

            if (step.finalAnswer) {
                stepsData.push(['Final Answer', '✓']);
            }

            stepsData.push(['', '']); // Spacing
        });

        return {
            title: 'Enhanced Step-by-Step Solution',
            type: 'steps',
            data: stepsData
        };
    }


    createSolutionSection() {
        if (!this.currentSolution) return null;

        const solutionData = [];
        const { type } = this.currentProblem;

        // Format solution based on problem type
        switch (type) {
            case 'simplify_radical':
                solutionData.push(['Simplified Form', this.currentSolution.simplifiedForm]);
                solutionData.push(['Outside Factor', this.currentSolution.outsideFactor]);
                solutionData.push(['Inside Factor', this.currentSolution.insideFactor]);
                if (this.currentSolution.primeFactorization) {
                    const factorString = Object.entries(this.currentSolution.primeFactorization)
                        .map(([p, c]) => c > 1 ? `${p}^${c}` : p)
                        .join(' × ');
                    solutionData.push(['Prime Factorization', factorString]);
                }
                break;

            case 'add_subtract_radicals':
                solutionData.push(['Simplified Form', this.currentSolution.simplifiedForm]);
                solutionData.push(['Are Like Radicals', this.currentSolution.areLikeRadicals ? 'Yes' : 'No']);
                break;

            case 'multiply_radicals':
                solutionData.push(['Product', this.currentSolution.simplifiedForm]);
                if (this.currentSolution.intermediateProduct) {
                    solutionData.push(['Intermediate', this.currentSolution.intermediateProduct]);
                }
                break;

            case 'divide_radicals':
                solutionData.push(['Rationalized Form', this.currentSolution.rationalizedForm]);
                solutionData.push(['Needed Rationalization', this.currentSolution.needsRationalization ? 'Yes' : 'No']);
                break;

            case 'pythagorean':
                if (this.currentSolution.solutions && this.currentSolution.solutions.length > 0) {
                    solutionData.push(['Exact Value', this.currentSolution.solutions[0].exact]);
                    solutionData.push(['Decimal Approximation', this.currentSolution.solutions[0].decimal.toFixed(4)]);
                }
                solutionData.push(['Formula Used', this.currentSolution.formula]);
                break;

            case 'distance_formula':
                if (this.currentSolution.solutions && this.currentSolution.solutions.length > 0) {
                    solutionData.push(['Exact Distance', this.currentSolution.solutions[0].exact]);
                    solutionData.push(['Decimal Distance', this.currentSolution.solutions[0].decimal.toFixed(4)]);
                }
                break;

            case 'quadratic_formula_radical':
                solutionData.push(['Discriminant', this.currentSolution.discriminant]);
                if (this.currentSolution.solutions && this.currentSolution.solutions.length > 0) {
                    this.currentSolution.solutions.forEach((sol, idx) => {
                        solutionData.push([`Solution ${idx + 1} (exact)`, sol.exact]);
                        solutionData.push([`Solution ${idx + 1} (decimal)`, sol.decimal.toFixed(4)]);
                    });
                }
                break;

            default:
                if (this.currentSolution.simplifiedForm) {
                    solutionData.push(['Result', this.currentSolution.simplifiedForm]);
                } else if (this.currentSolution.solutions) {
                    solutionData.push(['Solution', JSON.stringify(this.currentSolution.solutions)]);
                }
        }

        if (this.currentSolution.solutionType) {
            solutionData.push(['', '']); // Spacing
            solutionData.push(['Solution Type', this.currentSolution.solutionType]);
        }

        return {
            title: 'Final Solution',
            type: 'solution',
            data: solutionData
        };
    }

    createAnalysisSection() {
        const analysisData = [
            ['Problem Type', this.radicalTypes[this.currentProblem.type]?.name || this.currentProblem.type],
            ['Category', this.radicalTypes[this.currentProblem.type]?.category || 'general'],
            ['Steps Used', this.solutionSteps?.length || 0],
            ['Explanation Level', this.explanationLevel],
            ['Method', this.radicalTypes[this.currentProblem.type]?.description || 'Standard radical operations']
        ];

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

        // Add verification header
        verificationData.push(['Verification Method', 'Result']);
        verificationData.push(['', '']); // Spacing

        switch (type) {
            case 'simplify_radical':
                const verification = this.verifySimplifyRadical();
                verificationData.push(...this.formatSimplifyRadicalVerification(verification));
                break;

            case 'add_subtract_radicals':
                const addVerification = this.verifyAddSubtractRadical();
                verificationData.push(...this.formatAddSubtractRadicalVerification(addVerification));
                break;

            case 'multiply_radicals':
                const multVerification = this.verifyMultiplyRadical();
                verificationData.push(...this.formatMultiplyRadicalVerification(multVerification));
                break;

            case 'divide_radicals':
                const divVerification = this.verifyDivideRadical();
                verificationData.push(...this.formatDivideRadicalVerification(divVerification));
                break;

            case 'pythagorean':
                const pythagVerification = this.verifyPythagorean();
                verificationData.push(...this.formatPythagoreanVerification(pythagVerification));
                break;

            case 'distance_formula':
                const distVerification = this.verifyDistanceFormula();
                verificationData.push(...this.formatDistanceFormulaVerification(distVerification));
                break;

            default:
                verificationData.push(['General Check', 'Solution verified using appropriate radical properties']);
        }

        // Add verification confidence level
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

    createPedagogicalNotesSection() {
        if (!this.includePedagogicalNotes) return null;

        const { type } = this.currentProblem;
        const notes = this.generatePedagogicalNotes(type);

        const pedagogicalData = [
            ['Learning Objectives', notes.objectives.join('; ')],
            ['', ''], // Spacing
            ['Key Concepts', notes.keyConcepts.join('; ')],
            ['', ''], // Spacing
            ['Prerequisites', notes.prerequisites.join('; ')],
            ['', ''], // Spacing
            ['Common Difficulties', notes.commonDifficulties.join('; ')],
            ['', ''], // Spacing
            ['Extension Ideas', notes.extensions.join('; ')],
            ['', ''], // Spacing
            ['Assessment Tips', notes.assessment.join('; ')]
        ];

        return {
            title: 'Teaching Notes',
            type: 'pedagogical',
            data: pedagogicalData
        };
    }

    createAlternativeMethodsSection() {
        if (!this.includeAlternativeMethods) return null;

        const { type } = this.currentProblem;
        const alternatives = this.generateAlternativeMethods(type);

        const alternativeData = [
            ['Primary Method Used', alternatives.primaryMethod],
            ['', ''], // Spacing
            ['Alternative Methods', '']
        ];

        alternatives.methods.forEach((method, index) => {
            alternativeData.push([`Method ${index + 1}: ${method.name}`, method.description]);
        });

        alternativeData.push(['', '']); // Spacing
        alternativeData.push(['Method Comparison', alternatives.comparison]);

        return {
            title: 'Alternative Solution Methods',
            type: 'alternatives',
            data: alternativeData
        };
    }

    // UTILITY METHODS FOR ADAPTIVE EXPLANATIONS

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

    adaptLanguageLevel(text, level) {
        if (!text) return '';

        const adaptations = {
            basic: {
                replacements: {
                    'radicand': 'number under the radical',
                    'coefficient': 'number in front',
                    'prime factorization': 'breaking into prime numbers',
                    'perfect square': 'number with whole square root',
                    'extract': 'take out',
                    'simplify': 'make simpler',
                    'rationalize': 'remove radical from bottom'
                }
            },
            intermediate: {
                replacements: {
                    'radicand': 'radicand',
                    'coefficient': 'coefficient',
                    'prime factorization': 'prime factorization',
                    'perfect square': 'perfect square',
                    'extract': 'extract',
                    'simplify': 'simplify',
                    'rationalize': 'rationalize'
                }
            },
            detailed: {
                replacements: {
                    'radicand': 'radicand (the expression under the radical symbol)',
                    'coefficient': 'coefficient (multiplicative factor)',
                    'prime factorization': 'prime factorization (unique product representation)',
                    'perfect square': 'perfect square (integer that is the square of another integer)',
                    'extract': 'extract (remove from under the radical)',
                    'simplify': 'simplify (reduce to canonical form)',
                    'rationalize': 'rationalize (eliminate radicals from denominator)'
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

    connectToPreviousStep(step, stepIndex) {
        return {
            connection: `This step builds on step ${stepIndex} by continuing the simplification process`,
            progression: 'We are making progress toward the simplest radical form',
            relationship: 'Each step brings us closer to extracting all perfect power factors'
        };
    }

    explainStepProgression(currentStep, nextStep) {
        return `After ${currentStep.step}, we need to ${nextStep.description.toLowerCase()} to continue simplifying`;
    }

    explainStepStrategy(nextStep) {
        return `The strategy for "${nextStep.step}" is to ${nextStep.description.toLowerCase()}`;
    }

    // ADDITIONAL HELPER METHODS

    initializeRadicalLessons() {
        // This method is called in constructor to set up lesson data
        // Implementation provided earlier in the lessons object initialization
    }

    // Method to get all available problem types
    getAvailableProblemTypes() {
        return Object.keys(this.radicalTypes).map(key => ({
            type: key,
            name: this.radicalTypes[key].name,
            category: this.radicalTypes[key].category,
            description: this.radicalTypes[key].description
        }));
    }

    // Method to get lesson information for a specific topic
    getLesson(topicKey) {
        return this.lessons[topicKey] || null;
    }

    // Method to get all lessons
    getAllLessons() {
        return Object.keys(this.lessons).map(key => ({
            key: key,
            title: this.lessons[key].title,
            category: this.determineCategory(key)
        }));
    }

    determineCategory(lessonKey) {
        const categories = {
            simplifying_radicals: 'Basic Operations',
            adding_subtracting_radicals: 'Basic Operations',
            multiplying_radicals: 'Basic Operations',
            dividing_radicals: 'Basic Operations',
            radical_equations: 'Equations',
            higher_index_radicals: 'Advanced Topics',
            rational_exponents: 'Advanced Topics',
            nested_radicals: 'Advanced Topics',
            rationalizing_denominators: 'Standard Form',
            radical_inequalities: 'Inequalities',
            applications: 'Applications',
            radical_functions: 'Functions'
        };
        return categories[lessonKey] || 'General';
    }

    // Export methods for workbook generation
    exportWorkbookData() {
        return {
            problem: this.currentProblem,
            solution: this.currentSolution,
            steps: this.solutionSteps,
            workbook: this.currentWorkbook,
            graphData: this.graphData
        };
    }

    // Method to set options dynamically
    setOptions(options) {
        if (options.explanationLevel !== undefined) {
            this.explanationLevel = options.explanationLevel;
        }
        if (options.includeVerificationInSteps !== undefined) {
            this.includeVerificationInSteps = options.includeVerificationInSteps;
        }
        if (options.includeConceptualConnections !== undefined) {
            this.includeConceptualConnections = options.includeConceptualConnections;
        }
        if (options.includeAlternativeMethods !== undefined) {
            this.includeAlternativeMethods = options.includeAlternativeMethods;
        }
        if (options.includeErrorPrevention !== undefined) {
            this.includeErrorPrevention = options.includeErrorPrevention;
        }
        if (options.includeCommonMistakes !== undefined) {
            this.includeCommonMistakes = options.includeCommonMistakes;
        }
        if (options.includePedagogicalNotes !== undefined) {
            this.includePedagogicalNotes = options.includePedagogicalNotes;
        }
        if (options.verificationDetail !== undefined) {
            this.verificationDetail = options.verificationDetail;
        }
        if (options.theme !== undefined) {
            this.theme = options.theme;
            this.setThemeColors();
        }
    }

    // Method to reset the workbook
    reset() {
        this.currentProblem = null;
        this.currentSolution = null;
        this.solutionSteps = [];
        this.currentWorkbook = null;
        this.graphData = null;
    }

    // Method to generate a summary report
    generateSummaryReport() {
        if (!this.currentProblem || !this.currentSolution) {
            return { error: 'No problem has been solved yet' };
        }

        return {
            problemType: this.radicalTypes[this.currentProblem.type]?.name,
            solutionType: this.currentSolution.solutionType,
            stepsCount: this.solutionSteps.length,
            verificationStatus: this.calculateVerificationConfidence(),
            timestamp: new Date().toISOString(),
            summary: this.generateTextSummary()
        };
    }

    generateTextSummary() {
        const { type } = this.currentProblem;
        let summary = `Problem: ${this.currentProblem.originalInput}\n`;
        summary += `Type: ${this.radicalTypes[type]?.name}\n`;
        
        if (this.currentSolution.simplifiedForm) {
            summary += `Solution: ${this.currentSolution.simplifiedForm}\n`;
        } else if (this.currentSolution.solutions) {
            summary += `Solutions: ${JSON.stringify(this.currentSolution.solutions)}\n`;
        }
        
        summary += `Steps: ${this.solutionSteps.length}\n`;
        summary += `Verification: ${this.calculateVerificationConfidence()}`;
        
        return summary;
    }
}

// Export the class
export default EnhancedRadicalMathematicalWorkbook;
