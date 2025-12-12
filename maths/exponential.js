// Enhanced Exponential Mathematical Workbook - Improved Step-by-Step Explanations
import * as math from 'mathjs';

export class EnhancedExponentialMathematicalWorkbook {
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
        this.initializeExponentialSolvers();
        this.initializeErrorDatabase();
        this.initializeExplanationTemplates();
    }

    initializeExponentialLessons() {
        this.lessons = {
            simple_exponential: {
                title: "Simple Exponential Equations",
                concepts: [
                    "General form: a^x = b where a > 0, a ≠ 1",
                    "Goal: isolate the exponent using logarithms",
                    "Use logarithmic properties to solve",
                    "Check solution by substitution"
                ],
                theory: "Exponential equations represent repeated multiplication. The base 'a' represents the growth/decay factor, and 'x' represents the number of times multiplication occurs.",
                keyFormulas: {
                    "Standard Form": "a^x = b",
                    "Logarithmic Solution": "x = log_a(b) = ln(b)/ln(a)",
                    "Change of Base": "log_a(b) = ln(b)/ln(a) = log(b)/log(a)"
                },
                solvingSteps: [
                    "Isolate the exponential expression",
                    "Take logarithm of both sides",
                    "Use logarithm properties to bring down exponent",
                    "Solve for the variable",
                    "Verify solution by substitution"
                ],
                applications: [
                    "Population growth models",
                    "Radioactive decay",
                    "Compound interest calculations",
                    "Bacterial growth problems"
                ]
            },

            exponential_same_base: {
                title: "Exponential Equations with Same Base",
                concepts: [
                    "Form: a^f(x) = a^g(x)",
                    "If bases are equal, exponents must be equal",
                    "Simplify to algebraic equation: f(x) = g(x)",
                    "No logarithms needed when bases match"
                ],
                theory: "When exponential expressions with the same base are equal, their exponents must be equal. This fundamental property simplifies many exponential equations.",
                keyFormulas: {
                    "Equal Base Property": "If a^m = a^n, then m = n (a > 0, a ≠ 1)",
                    "Power of Power": "(a^m)^n = a^(mn)",
                    "Product Rule": "a^m · a^n = a^(m+n)"
                },
                solvingSteps: [
                    "Express both sides with the same base",
                    "Apply exponential properties to simplify",
                    "Set exponents equal to each other",
                    "Solve the resulting algebraic equation",
                    "Check solution in original equation"
                ],
                applications: [
                    "Simplifying complex exponential expressions",
                    "Solving growth equations with matching time periods",
                    "Chemistry concentration problems",
                    "Physics decay problems"
                ]
            },

            exponential_different_base: {
                title: "Exponential Equations with Different Bases",
                concepts: [
                    "Form: a^x = b^x where a ≠ b",
                    "Must use logarithms to solve",
                    "Take natural log or common log of both sides",
                    "Apply logarithm properties to isolate variable"
                ],
                theory: "When bases differ, logarithms are essential tools for solving. The change of base formula and logarithm properties allow us to handle different bases systematically.",
                keyFormulas: {
                    "Logarithm of Both Sides": "If a^x = b^x, take ln: x·ln(a) = x·ln(b)",
                    "Power Rule": "ln(a^x) = x·ln(a)",
                    "Change of Base": "log_a(x) = ln(x)/ln(a)"
                },
                solvingSteps: [
                    "Take logarithm of both sides (ln or log)",
                    "Apply power rule: bring exponents down",
                    "Isolate the variable algebraically",
                    "Simplify using calculator if needed",
                    "Verify solution"
                ],
                applications: [
                    "Comparing different growth rates",
                    "Investment comparisons",
                    "Half-life vs doubling time problems",
                    "Multiple decay rate analysis"
                ]
            },

            exponential_quadratic: {
                title: "Exponential Equations with Quadratic Form",
                concepts: [
                    "Form: a^(2x) + b·a^x + c = 0",
                    "Use substitution: let u = a^x",
                    "Transforms to quadratic: u² + bu + c = 0",
                    "Solve for u, then solve a^x = u"
                ],
                theory: "Some exponential equations have quadratic structure when we recognize a^(2x) = (a^x)². Substitution transforms the exponential equation into a familiar quadratic form.",
                keyFormulas: {
                    "Substitution": "Let u = a^x, then a^(2x) = u²",
                    "Quadratic Formula": "u = (-b ± √(b²-4ac))/(2a)",
                    "Back Substitution": "x = log_a(u)"
                },
                solvingSteps: [
                    "Identify quadratic structure in exponential terms",
                    "Make substitution u = a^x",
                    "Solve resulting quadratic equation",
                    "Back-substitute to find x from u",
                    "Check all solutions (reject negatives if needed)"
                ],
                applications: [
                    "Complex growth/decay models",
                    "Population dynamics with limiting factors",
                    "Chemical reaction kinetics",
                    "Economic cycles with exponential components"
                ]
            },

            exponential_inequality: {
                title: "Exponential Inequalities",
                concepts: [
                    "Form: a^x > b or a^x < b",
                    "Solutions depend on whether base a > 1 or 0 < a < 1",
                    "If a > 1: inequality direction preserved when taking log",
                    "If 0 < a < 1: inequality direction reverses when taking log"
                ],
                theory: "Exponential inequalities require careful attention to the base. Growth (a > 1) and decay (0 < a < 1) bases behave differently when applying logarithms.",
                keyFormulas: {
                    "Growth Base (a > 1)": "If a^x > b, then x > log_a(b)",
                    "Decay Base (0 < a < 1)": "If a^x > b, then x < log_a(b)",
                    "Domain Restriction": "b must be positive for real solutions"
                },
                solvingSteps: [
                    "Isolate exponential expression",
                    "Identify if base is growth (a > 1) or decay (0 < a < 1)",
                    "Take logarithm of both sides",
                    "Apply appropriate inequality direction",
                    "Express solution in interval notation"
                ],
                applications: [
                    "Investment threshold problems",
                    "Population minimum/maximum constraints",
                    "Temperature range modeling",
                    "Concentration limit problems"
                ]
            },

            exponential_systems: {
                title: "Systems of Exponential Equations",
                concepts: [
                    "Multiple exponential equations with same variables",
                    "May require substitution or elimination",
                    "Often involves logarithmic manipulation",
                    "Solutions may be approximate (numerical methods)"
                ],
                theory: "Systems of exponential equations combine algebraic techniques with logarithmic properties. Some systems have closed-form solutions, others require numerical methods.",
                keyFormulas: {
                    "Logarithmic Elimination": "Use logs to create linear relationships",
                    "Substitution Method": "Express one variable in terms of another",
                    "Graphical Interpretation": "Solutions are intersection points"
                },
                solvingSteps: [
                    "Take logarithms where appropriate",
                    "Look for substitution opportunities",
                    "Reduce to algebraic system if possible",
                    "Use numerical methods if necessary",
                    "Verify all solutions"
                ],
                applications: [
                    "Multi-species population models",
                    "Chemical equilibrium systems",
                    "Economic supply-demand with exponential components",
                    "Coupled growth/decay processes"
                ]
            },

            exponential_growth: {
                title: "Exponential Growth Models",
                concepts: [
                    "General form: y = a·b^t or y = a·e^(kt)",
                    "Parameter 'a' is initial amount",
                    "Parameter 'b' or 'k' determines growth rate",
                    "Doubling time and growth rate relationships"
                ],
                theory: "Exponential growth occurs when rate of change is proportional to current amount. This appears in population growth, compound interest, and many natural phenomena.",
                keyFormulas: {
                    "Discrete Growth": "y = a·(1+r)^t",
                    "Continuous Growth": "y = a·e^(kt)",
                    "Doubling Time": "T_double = ln(2)/k or log(2)/log(b)",
                    "Growth Rate": "k = ln(b)"
                },
                solvingSteps: [
                    "Identify initial value 'a'",
                    "Determine growth rate from data",
                    "Choose appropriate model (discrete vs continuous)",
                    "Write equation with parameters",
                    "Use equation to make predictions or solve for time"
                ],
                applications: [
                    "Population forecasting",
                    "Compound interest calculations",
                    "Bacterial culture growth",
                    "Social media viral spread",
                    "Technology adoption curves"
                ]
            },

            exponential_decay: {
                title: "Exponential Decay Models",
                concepts: [
                    "General form: y = a·b^t (0 < b < 1) or y = a·e^(-kt)",
                    "Parameter 'a' is initial amount",
                    "Decay constant determines rate of decrease",
                    "Half-life is time for quantity to reduce by half"
                ],
                theory: "Exponential decay describes processes where rate of decrease is proportional to current amount. Common in radioactive decay, drug metabolism, and depreciation.",
                keyFormulas: {
                    "Discrete Decay": "y = a·(1-r)^t",
                    "Continuous Decay": "y = a·e^(-kt)",
                    "Half-Life": "T_half = ln(2)/k or log(2)/log(1/b)",
                    "Decay Constant": "k = -ln(b)"
                },
                solvingSteps: [
                    "Identify initial value 'a'",
                    "Determine decay rate or half-life",
                    "Choose model form (discrete vs continuous)",
                    "Write equation with parameters",
                    "Solve for time or remaining amount"
                ],
                applications: [
                    "Radioactive decay problems",
                    "Drug concentration in bloodstream",
                    "Depreciation of assets",
                    "Cooling of objects (Newton's Law)",
                    "Light intensity through material"
                ]
            },

            compound_interest: {
                title: "Compound Interest Problems",
                concepts: [
                    "Interest compounded at regular intervals",
                    "Formula: A = P(1 + r/n)^(nt)",
                    "Continuous compounding: A = Pe^(rt)",
                    "Solving for time, rate, or principal"
                ],
                theory: "Compound interest is exponential growth applied to finance. Interest earns interest, leading to exponential increase over time.",
                keyFormulas: {
                    "Compound Interest": "A = P(1 + r/n)^(nt)",
                    "Continuous Compounding": "A = Pe^(rt)",
                    "Effective Annual Rate": "EAR = (1 + r/n)^n - 1",
                    "Time to Double": "t = ln(2)/(n·ln(1+r/n))"
                },
                parameters: {
                    "P": "Principal (initial amount)",
                    "A": "Final amount",
                    "r": "Annual interest rate (as decimal)",
                    "n": "Number of times compounded per year",
                    "t": "Time in years"
                },
                applications: [
                    "Savings account growth",
                    "Loan amortization",
                    "Investment returns",
                    "Retirement planning",
                    "Present value calculations"
                ]
            },

            half_life: {
                title: "Half-Life and Doubling Time",
                concepts: [
                    "Half-life: time for quantity to reduce to half",
                    "Doubling time: time for quantity to double",
                    "Relationship to decay/growth constant",
                    "Applications in science and finance"
                ],
                theory: "Half-life and doubling time are characteristic times that describe exponential processes. They provide intuitive measures of decay and growth rates.",
                keyFormulas: {
                    "Half-Life": "t_1/2 = ln(2)/k",
                    "Doubling Time": "t_double = ln(2)/k",
                    "Amount After n Half-Lives": "A = A_0·(1/2)^n",
                    "Decay Constant from Half-Life": "k = ln(2)/t_1/2"
                },
                solvingSteps: [
                    "Identify whether problem involves growth or decay",
                    "Determine half-life or doubling time",
                    "Calculate decay/growth constant k",
                    "Write exponential model",
                    "Solve for desired quantity"
                ],
                applications: [
                    "Radioactive dating (Carbon-14)",
                    "Medical dosage calculations",
                    "Population projections",
                    "Investment doubling time",
                    "Pollution decay in environment"
                ]
            },

            logarithmic_equations: {
                title: "Logarithmic Equations",
                concepts: [
                    "Inverse of exponential equations",
                    "Form: log_a(x) = b means a^b = x",
                    "Use exponential form to solve",
                    "Check for extraneous solutions (domain restrictions)"
                ],
                theory: "Logarithmic equations are solved by converting to exponential form or using logarithm properties. Domain restrictions require careful checking of solutions.",
                keyFormulas: {
                    "Definition": "log_a(x) = b ⟺ a^b = x",
                    "Product Rule": "log_a(xy) = log_a(x) + log_a(y)",
                    "Quotient Rule": "log_a(x/y) = log_a(x) - log_a(y)",
                    "Power Rule": "log_a(x^n) = n·log_a(x)"
                },
                solvingSteps: [
                    "Use log properties to combine or separate logarithms",
                    "Convert to exponential form",
                    "Solve the resulting equation",
                    "Check solutions in original equation",
                    "Reject solutions outside logarithm domain (x > 0)"
                ],
                applications: [
                    "pH calculations in chemistry",
                    "Decibel scale in acoustics",
                    "Richter scale for earthquakes",
                    "Information theory and entropy",
                    "Solving exponential equations"
                ]
            },

            natural_exponential: {
                title: "Natural Exponential Function e^x",
                concepts: [
                    "Base e ≈ 2.71828... (Euler's number)",
                    "Unique property: derivative of e^x is e^x",
                    "Natural logarithm ln(x) is inverse of e^x",
                    "Continuous growth/decay models use e"
                ],
                theory: "The natural exponential function e^x is fundamental in mathematics because of its unique calculus properties and natural occurrence in growth/decay processes.",
                keyFormulas: {
                    "Natural Exponential": "y = e^x",
                    "Natural Logarithm": "ln(e^x) = x and e^(ln(x)) = x",
                    "Continuous Growth": "y = a·e^(kt)",
                    "Limit Definition": "e = lim(n→∞)(1 + 1/n)^n"
                },
                properties: [
                    "Always positive: e^x > 0 for all real x",
                    "Increases for all x (exponential growth)",
                    "Horizontal asymptote at y = 0 as x → -∞",
                    "Passes through (0, 1)"
                ],
                applications: [
                    "Continuous compound interest",
                    "Natural growth/decay processes",
                    "Probability distributions (normal, exponential)",
                    "Differential equations solutions",
                    "Physics and engineering models"
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

    initializeExponentialSolvers() {
        this.exponentialTypes = {
            // Basic exponential equation solving
            simple_exponential: {
                patterns: [
                    /([+-]?\d*\.?\d*)\s*\*?\s*([+-]?\d*\.?\d*)\s*\^\s*x\s*=\s*([+-]?\d+\.?\d*)/,
                    /([+-]?\d*\.?\d*)\s*\^\s*x\s*=\s*([+-]?\d+\.?\d*)/,
                    /simple.*exponential/i,
                    /basic.*exponential/i
                ],
                solver: this.solveSimpleExponential.bind(this),
                name: 'Simple Exponential Equation',
                category: 'basic_exponential',
                description: 'Solves a^x = b'
            },

            exponential_same_base: {
                patterns: [
                    /same.*base/i,
                    /equal.*base/i,
                    /matching.*base/i
                ],
                solver: this.solveExponentialSameBase.bind(this),
                name: 'Exponential Equations with Same Base',
                category: 'same_base',
                description: 'Solves a^f(x) = a^g(x)'
            },

            exponential_different_base: {
                patterns: [
                    /different.*base/i,
                    /unequal.*base/i,
                    /distinct.*base/i
                ],
                solver: this.solveExponentialDifferentBase.bind(this),
                name: 'Exponential Equations with Different Bases',
                category: 'different_base',
                description: 'Solves a^x = b^y using logarithms'
            },

            exponential_quadratic: {
                patterns: [
                    /quadratic.*exponential/i,
                    /exponential.*quadratic/i,
                    /substitution.*exponential/i
                ],
                solver: this.solveExponentialQuadratic.bind(this),
                name: 'Exponential Equations with Quadratic Form',
                category: 'quadratic_exponential',
                description: 'Solves a^(2x) + b·a^x + c = 0'
            },

            exponential_inequality: {
                patterns: [
                    /exponential.*inequality/i,
                    /inequality.*exponential/i,
                    /([+-]?\d*\.?\d*)\s*\^\s*x\s*[><≤≥]/
                ],
                solver: this.solveExponentialInequality.bind(this),
                name: 'Exponential Inequalities',
                category: 'inequalities',
                description: 'Solves a^x > b or a^x < b'
            },

            exponential_systems: {
                patterns: [
                    /system.*exponential/i,
                    /exponential.*system/i,
                    /simultaneous.*exponential/i
                ],
                solver: this.solveExponentialSystem.bind(this),
                name: 'Systems of Exponential Equations',
                category: 'systems',
                description: 'Solves systems with exponential equations'
            },

            exponential_growth: {
                patterns: [
                    /growth.*model/i,
                    /exponential.*growth/i,
                    /population.*growth/i,
                    /compound.*growth/i
                ],
                solver: this.solveExponentialGrowth.bind(this),
                name: 'Exponential Growth Models',
                category: 'growth',
                description: 'Solves y = a·b^t or y = a·e^(kt) for growth'
            },

            exponential_decay: {
                patterns: [
                    /decay.*model/i,
                    /exponential.*decay/i,
                    /radioactive.*decay/i,
                    /half.*life/i
                ],
                solver: this.solveExponentialDecay.bind(this),
                name: 'Exponential Decay Models',
                category: 'decay',
                description: 'Solves y = a·b^t (0<b<1) or y = a·e^(-kt)'
            },

            compound_interest: {
                patterns: [
                    /compound.*interest/i,
                    /interest.*compound/i,
                    /continuous.*compound/i
                ],
                solver: this.solveCompoundInterest.bind(this),
                name: 'Compound Interest Problems',
                category: 'finance',
                description: 'Solves A = P(1+r/n)^(nt) or A = Pe^(rt)'
            },

            half_life: {
                patterns: [
                    /half.*life/i,
                    /doubling.*time/i,
                    /half-life/i
                ],
                solver: this.solveHalfLife.bind(this),
                name: 'Half-Life and Doubling Time',
                category: 'decay_growth',
                description: 'Calculates time for half decay or doubling'
            },

            logarithmic_equation: {
                patterns: [
                    /log.*equation/i,
                    /logarithm.*equation/i,
                    /ln.*equation/i,
                    /log\s*\(/i,
                    /ln\s*\(/i
                ],
                solver: this.solveLogarithmicEquation.bind(this),
                name: 'Logarithmic Equations',
                category: 'logarithmic',
                description: 'Solves log_a(x) = b or equations with logs'
            },

            natural_exponential: {
                patterns: [
                    /natural.*exponential/i,
                    /e\s*\^\s*x/i,
                    /euler/i,
                    /continuous.*model/i
                ],
                solver: this.solveNaturalExponential.bind(this),
                name: 'Natural Exponential Function',
                category: 'natural',
                description: 'Solves equations involving e^x'
            }
        };
    }

    // Initialize common mistakes and error prevention database
    initializeErrorDatabase() {
        this.commonMistakes = {
            simple_exponential: {
                'Take logarithm': [
                    'Forgetting to take log of both sides',
                    'Using wrong logarithm base',
                    'Not applying log properties correctly'
                ],
                'Apply power rule': [
                    'Confusing log(a^x) with (log a)^x',
                    'Forgetting to bring exponent down as coefficient',
                    'Sign errors when dealing with negative exponents'
                ]
            },
            exponential_inequality: {
                'Take logarithm': [
                    'Forgetting to flip inequality for decay bases (0 < a < 1)',
                    'Not checking if right side is positive',
                    'Confusing growth and decay base behavior'
                ]
            },
            exponential_quadratic: {
                'Substitution': [
                    'Not recognizing quadratic form',
                    'Forgetting to back-substitute after solving quadratic',
                    'Not rejecting negative values when back-substituting'
                ]
            },
            compound_interest: {
                'Apply formula': [
                    'Confusing n (compounding frequency) with t (time)',
                    'Not converting percentage rate to decimal',
                    'Using wrong formula for continuous vs discrete compounding'
                ]
            }
        };

        this.errorPrevention = {
            logarithm_checking: {
                reminder: 'Always check if argument of logarithm is positive',
                method: 'Verify domain restrictions before taking logs'
            },
            base_identification: {
                reminder: 'Identify if base is growth (a > 1) or decay (0 < a < 1)',
                method: 'This determines inequality direction when taking logs'
            },
            substitution_verification: {
                reminder: 'After substitution, check if solution is valid in original form',
                method: 'Reject solutions that make arguments negative or zero'
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
    solveExponentialProblem(config) {
        const { equation, scenario, parameters, problemType, context } = config;

        try {
            // Parse the problem
            this.currentProblem = this.parseExponentialProblem(equation, scenario, parameters, problemType, context);

            // Solve the problem
            this.currentSolution = this.solveExponentialProblem_Internal(this.currentProblem);

            // Generate solution steps
            this.solutionSteps = this.generateExponentialSteps(this.currentProblem, this.currentSolution);

            // Generate graph data if applicable
            this.generateExponentialGraphData();

            // Generate workbook
            this.generateExponentialWorkbook();

            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                solutions: this.currentSolution?.solutions,
                solutionType: this.currentSolution?.solutionType
            };

        } catch (error) {
            throw new Error(`Failed to solve exponential problem: ${error.message}`);
        }
    }

    parseExponentialProblem(equation, scenario = '', parameters = {}, problemType = null, context = {}) {
        const cleanInput = equation ? this.cleanMathExpression(equation) : '';

        // If problem type is specified, use it directly
        if (problemType && this.exponentialTypes[problemType]) {
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

        // Auto-detect exponential problem type
        for (const [type, config] of Object.entries(this.exponentialTypes)) {
            for (const pattern of config.patterns) {
                if (pattern.test(cleanInput) || pattern.test(scenario)) {
                    const match = cleanInput.match(pattern);
                    const extractedParams = this.extractExponentialParameters(match, type);

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

        // Default to simple exponential if base and result are provided
        if (parameters.a !== undefined || parameters.b !== undefined) {
            return {
                originalInput: equation || 'Exponential equation with given parameters',
                cleanInput: cleanInput,
                type: 'simple_exponential',
                scenario: scenario,
                parameters: { 
                    a: parameters.a || 2, 
                    b: parameters.b || 8,
                    ...parameters 
                },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        throw new Error(`Unable to recognize exponential problem type from: ${equation || scenario}`);
    }

    cleanMathExpression(expression) {
        return expression
            .replace(/\s+/g, ' ')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/≠/g, '!=')
            .replace(/\^/g, '^')
            .replace(/\*\*/g, '^')
            .trim();
    }

    extractExponentialParameters(match, type) {
        const params = {};

        if (type === 'simple_exponential' && match) {
            // Extract coefficient, base, and result
            params.coefficient = this.parseCoefficient(match[1]) || 1;
            params.a = this.parseCoefficient(match[2]) || this.parseCoefficient(match[1]) || 2; // base
            params.b = this.parseCoefficient(match[3]) || this.parseCoefficient(match[2]) || 8; // result
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

    solveExponentialProblem_Internal(problem) {
        const solver = this.exponentialTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for exponential problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    // EXPONENTIAL SOLVERS

    solveSimpleExponential(problem) {
        const { coefficient = 1, a, b } = problem.parameters;

        // Solve coefficient * a^x = b
        // a^x = b/coefficient
        const adjustedB = b / coefficient;

        // Check validity
        if (a <= 0 || a === 1) {
            return {
                solutionType: 'Invalid base',
                solutions: [],
                equation: `${coefficient}·${a}^x = ${b}`,
                explanation: 'Base must be positive and not equal to 1',
                category: 'simple_exponential'
            };
        }

        if (adjustedB <= 0) {
            return {
                solutionType: 'No solution',
                solutions: [],
                equation: `${coefficient}·${a}^x = ${b}`,
                explanation: 'Exponential expressions are always positive, cannot equal non-positive number',
                category: 'simple_exponential'
            };
        }

        // Solution: x = log_a(b/coefficient) = ln(b/coefficient) / ln(a)
        const solution = Math.log(adjustedB) / Math.log(a);
        
        return {
            solutionType: 'Unique solution',
            solutions: [solution],
            equation: `${coefficient}·${a}^x = ${b}`,
            base: a,
            result: b,
            coefficient: coefficient,
            logarithmicForm: `x = log_${a}(${adjustedB})`,
            naturalLogForm: `x = ln(${adjustedB})/ln(${a})`,
            verification: this.verifyExponentialSolution(solution, a, coefficient, b),
            graphicalInterpretation: this.getExponentialGraphicalInterpretation(a, coefficient),
            category: 'simple_exponential'
        };
    }

    solveExponentialSameBase(problem) {
        const { base, exponent1, exponent2 } = problem.parameters;
        
        // a^f(x) = a^g(x) means f(x) = g(x)
        return {
            solutionType: 'Same base solution',
            principle: 'When bases are equal, exponents must be equal',
            reducedEquation: `${exponent1} = ${exponent2}`,
            base: base,
            method: 'Set exponents equal and solve algebraically',
            category: 'exponential_same_base',
            note: 'This reduces to an algebraic equation'
        };
    }

    solveExponentialDifferentBase(problem) {
        const { base1, base2, exponent1, exponent2 } = problem.parameters;
        
        // Framework for different base exponential equations
        return {
            solutionType: 'Different base solution',
            method: 'Take logarithm of both sides',
            steps: [
                'Take natural log (or common log) of both sides',
                'Apply power rule: ln(a^x) = x·ln(a)',
                'Solve resulting algebraic equation',
                'Simplify using calculator'
            ],
            category: 'exponential_different_base'
        };
    }

    solveExponentialQuadratic(problem) {
        const { a, b, c, base } = problem.parameters;
        
        // Solve (base)^(2x) + b·(base)^x + c = 0
        // Let u = base^x, then u^2 + bu + c = 0
        
        // Use quadratic formula
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant < 0) {
            return {
                solutionType: 'No real solutions',
                solutions: [],
                equation: `${a}·${base}^(2x) + ${b}·${base}^x + ${c} = 0`,
                explanation: 'Discriminant is negative in quadratic form',
                category: 'exponential_quadratic'
            };
        }

        const u1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const u2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        const solutions = [];
        
        // Back-substitute: base^x = u
        if (u1 > 0) {
            solutions.push(Math.log(u1) / Math.log(base));
        }
        if (u2 > 0 && u2 !== u1) {
            solutions.push(Math.log(u2) / Math.log(base));
        }

        return {
            solutionType: solutions.length > 0 ? `${solutions.length} solution(s)` : 'No valid solutions',
            solutions: solutions,
            substitution: `Let u = ${base}^x`,
            quadraticForm: `${a}u^2 + ${b}u + ${c} = 0`,
            uValues: [u1, u2].filter(u => u > 0),
            discriminant: discriminant,
            category: 'exponential_quadratic'
        };
    }

    solveExponentialInequality(problem) {
        const { a, b, operator = '>' } = problem.parameters;

        if (a <= 0 || a === 1) {
            return {
                inequality: `${a}^x ${operator} ${b}`,
                solutionType: 'Invalid base',
                solutions: [],
                explanation: 'Base must be positive and not equal to 1',
                category: 'exponential_inequality'
            };
        }

        if (b <= 0) {
            // Exponential is always positive
            if (operator === '>' || operator === '>=') {
                return {
                    inequality: `${a}^x ${operator} ${b}`,
                    solutionType: 'All real numbers',
                    solutions: ['All real numbers'],
                    intervalNotation: '(-∞, ∞)',
                    explanation: 'Exponential function is always positive',
                    category: 'exponential_inequality'
                };
            } else {
                return {
                    inequality: `${a}^x ${operator} ${b}`,
                    solutionType: 'No solution',
                    solutions: [],
                    explanation: 'Exponential function is always positive, cannot be less than or equal to negative number',
                    category: 'exponential_inequality'
                };
            }
        }

        // Find critical value: a^x = b => x = log_a(b)
        const criticalValue = Math.log(b) / Math.log(a);
        let solutionSet = '';
        let intervalNotation = '';

        // Determine solution based on base and operator
        const isGrowthBase = a > 1;

        if (isGrowthBase) {
            // Growth base (a > 1)
            switch(operator) {
                case '>':
                    solutionSet = `x > ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(${criticalValue.toFixed(6)}, ∞)`;
                    break;
                case '<':
                    solutionSet = `x < ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(-∞, ${criticalValue.toFixed(6)})`;
                    break;
                case '>=':
                    solutionSet = `x ≥ ${criticalValue.toFixed(6)}`;
                    intervalNotation = `[${criticalValue.toFixed(6)}, ∞)`;
                    break;
                case '<=':
                    solutionSet = `x ≤ ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(-∞, ${criticalValue.toFixed(6)}]`;
                    break;
            }
        } else {
            // Decay base (0 < a < 1) - inequality flips
            switch(operator) {
                case '>':
                    solutionSet = `x < ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(-∞, ${criticalValue.toFixed(6)})`;
                    break;
                case '<':
                    solutionSet = `x > ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(${criticalValue.toFixed(6)}, ∞)`;
                    break;
                case '>=':
                    solutionSet = `x ≤ ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(-∞, ${criticalValue.toFixed(6)}]`;
                    break;
                case '<=':
                    solutionSet = `x ≥ ${criticalValue.toFixed(6)}`;
                    intervalNotation = `[${criticalValue.toFixed(6)}, ∞)`;
                    break;
            }
        }

        return {
            inequality: `${a}^x ${operator} ${b}`,
            solutionType: 'Inequality solution',
            solutionSet: solutionSet,
            intervalNotation: intervalNotation,
            criticalValue: criticalValue,
            baseType: isGrowthBase ? 'growth (a > 1)' : 'decay (0 < a < 1)',
            inequalityBehavior: isGrowthBase ? 'preserved' : 'reversed',
            explanation: isGrowthBase ? 
                'Inequality direction preserved with growth base' : 
                'Inequality direction reversed with decay base',
            category: 'exponential_inequality'
        };
    }

    solveExponentialSystem(problem) {
        const { equations = [] } = problem.parameters;
        
        return {
            problemType: 'System of Exponential Equations',
            equations: equations,
            methods: [
                'Substitution with logarithms',
                'Elimination after taking logs',
                'Numerical methods for complex systems'
            ],
            category: 'exponential_systems',
            note: 'May require numerical approximation methods'
        };
    }

    solveExponentialGrowth(problem) {
        const { initialAmount, growthRate, time, finalAmount, base } = problem.parameters;

        // y = a·b^t or y = a·e^(kt)
        const useNatural = base === Math.E || base === 'e';

        if (useNatural) {
            // Continuous growth: y = a·e^(kt)
            if (finalAmount && initialAmount && time) {
                // Solve for k
                const k = Math.log(finalAmount / initialAmount) / time;
                return {
                    model: 'Continuous exponential growth',
                    equation: `y = ${initialAmount}·e^(${k}t)`,
                    initialAmount: initialAmount,
                    growthConstant: k,
                    doublingTime: Math.log(2) / k,
                    category: 'exponential_growth'
                };
            }
        } else {
            // Discrete growth: y = a·b^t
            if (finalAmount && initialAmount && time) {
                // Solve for b
                const b = Math.pow(finalAmount / initialAmount, 1 / time);
                return {
                    model: 'Discrete exponential growth',
                    equation: `y = ${initialAmount}·${b}^t`,
                    initialAmount: initialAmount,
                    growthFactor: b,
                    growthRate: (b - 1) * 100 + '%',
                    doublingTime: Math.log(2) / Math.log(b),
                    category: 'exponential_growth'
                };
            }
        }

        return {
            model: 'Exponential Growth',
            generalForm: 'y = a·b^t or y = a·e^(kt)',
            category: 'exponential_growth'
        };
    }

    solveExponentialDecay(problem) {
        const { initialAmount, decayRate, time, finalAmount, halfLife } = problem.parameters;

        if (halfLife) {
            // Use half-life formula
            const k = Math.log(2) / halfLife;
            
            if (time) {
                const remaining = initialAmount * Math.exp(-k * time);
                return {
                    model: 'Exponential decay with half-life',
                    equation: `y = ${initialAmount}·e^(-${k}t)`,
                    initialAmount: initialAmount,
                    decayConstant: k,
                    halfLife: halfLife,
                    timeElapsed: time,
                    remainingAmount: remaining,
                    percentRemaining: (remaining / initialAmount * 100).toFixed(2) + '%',
                    category: 'exponential_decay'
                };
            }
        }

        return {
            model: 'Exponential Decay',
            generalForm: 'y = a·b^t (0<b<1) or y = a·e^(-kt)',
            category: 'exponential_decay'
        };
    }

    solveCompoundInterest(problem) {
        const { principal, rate, time, compoundingFrequency, finalAmount } = problem.parameters;

        if (compoundingFrequency === 'continuous') {
            // A = Pe^(rt)
            if (principal && rate && time) {
                const A = principal * Math.exp(rate * time);
                return {
                    model: 'Continuous compound interest',
                    formula: `A = Pe^(rt)`,
                    principal: principal,
                    rate: rate,
                    time: time,
                    finalAmount: A,
                    interest: A - principal,
                    category: 'compound_interest'
                };
            }
        } else {
            // A = P(1 + r/n)^(nt)
            const n = compoundingFrequency || 12; // default monthly
            
            if (principal && rate && time) {
                const A = principal * Math.pow(1 + rate / n, n * time);
                return {
                    model: 'Discrete compound interest',
                    formula: `A = P(1 + r/n)^(nt)`,
                    principal: principal,
                    rate: rate,
                    compoundingFrequency: n,
                    time: time,
                    finalAmount: A,
                    interest: A - principal,
                    category: 'compound_interest'
                };
            }
        }

        return {
            model: 'Compound Interest',
            formulas: [
                'Discrete: A = P(1 + r/n)^(nt)',
                'Continuous: A = Pe^(rt)'
            ],
            category: 'compound_interest'
        };
    }

    solveHalfLife(problem) {
        const { halfLife, doublingTime, initialAmount, time } = problem.parameters;

        if (halfLife) {
            const k = Math.log(2) / halfLife;
            
            return {
                model: 'Half-life decay',
                halfLife: halfLife,
                decayConstant: k,
                formula: `A = A₀·e^(-${k}t) or A = A₀·(1/2)^(t/${halfLife})`,
                category: 'half_life'
            };
        }

        if (doublingTime) {
            const k = Math.log(2) / doublingTime;
            
            return {
                model: 'Doubling time growth',
                doublingTime: doublingTime,
                growthConstant: k,
                formula: `A = A₀·e^(${k}t) or A = A₀·2^(t/${doublingTime})`,
                category: 'half_life'
            };
        }

        return {
            model: 'Half-Life or Doubling Time',
            formulas: [
                'Half-life: t₁/₂ = ln(2)/k',
                'Doubling time: t_d = ln(2)/k'
            ],
            category: 'half_life'
        };
    }

    solveLogarithmicEquation(problem) {
        const { base = 10, argument, result } = problem.parameters;

        // log_base(argument) = result
        // Convert to exponential: argument = base^result

        if (result !== undefined) {
            const solution = Math.pow(base, result);
            
            return {
                solutionType: 'Logarithmic equation solution',
                equation: `log_${base}(x) = ${result}`,
                exponentialForm: `x = ${base}^${result}`,
                solution: solution,
                verification: solution > 0,
                category: 'logarithmic_equation'
            };
        }

        return {
            model: 'Logarithmic Equation',
            principle: 'log_a(x) = b means a^b = x',
            category: 'logarithmic_equation'
        };
    }

    solveNaturalExponential(problem) {
        const { coefficient = 1, exponent, result } = problem.parameters;

        // Solve coefficient·e^(exponent·x) = result
        const adjustedResult = result / coefficient;

        if (adjustedResult <= 0) {
            return {
                solutionType: 'No solution',
                solutions: [],
                explanation: 'e^x is always positive',
                category: 'natural_exponential'
            };
        }

        // x = ln(result/coefficient) / exponent
        const solution = Math.log(adjustedResult) / (exponent || 1);

        return {
            solutionType: 'Natural exponential solution',
            solutions: [solution],
            equation: `${coefficient}·e^(${exponent}x) = ${result}`,
            naturalLogForm: `x = ln(${adjustedResult})/${exponent}`,
            category: 'natural_exponential'
        };
    }

    // HELPER METHODS

    verifyExponentialSolution(x, base, coefficient, result) {
        const leftSide = coefficient * Math.pow(base, x);
        const rightSide = result;
        const difference = Math.abs(leftSide - rightSide);
        const tolerance = 1e-10;

        return {
            solution: x,
            leftSide: leftSide,
            rightSide: rightSide,
            difference: difference,
            isCorrect: difference < tolerance,
            substitution: `${coefficient}·${base}^${x} = ${leftSide}`,
            equation: `${coefficient}·${base}^x = ${result}`,
            tolerance: tolerance
        };
    }

    getExponentialGraphicalInterpretation(base, coefficient) {
        return {
            base: base,
            coefficient: coefficient,
            behavior: base > 1 ? 'exponential growth' : base < 1 && base > 0 ? 'exponential decay' : 'invalid',
            steepness: base > 2 ? 'rapid' : base > 1 ? 'moderate' : 'gradual decay'
        };
    }

    generateExponentialGraphData() {
        if (!this.currentSolution) return;

        const { type } = this.currentProblem;
        const solution = this.currentSolution;

        switch(type) {
            case 'simple_exponential':
                if (solution.base !== undefined) {
                    this.graphData = this.generateExponentialFunctionGraph(solution.base, solution.coefficient || 1);
                }
                break;

            case 'exponential_growth':
            case 'exponential_decay':
                if (solution.initialAmount && solution.growthConstant) {
                    this.graphData = this.generateGrowthDecayGraph(solution);
                }
                break;
        }
    }

    generateExponentialFunctionGraph(base, coefficient) {
        const points = [];
        for (let x = -5; x <= 5; x += 0.2) {
            points.push({ x: x, y: coefficient * Math.pow(base, x) });
        }

        return {
            type: 'exponential_function',
            function: `y = ${coefficient}·${base}^x`,
            points: points,
            base: base,
            coefficient: coefficient,
            asymptote: 0
        };
    }

    generateGrowthDecayGraph(solution) {
        return {
            type: solution.model.includes('growth') ? 'exponential_growth' : 'exponential_decay',
            equation: solution.equation,
            initialAmount: solution.initialAmount
        };
    }

    // Enhanced step generation with multiple explanation layers
    generateExponentialSteps(problem, solution) {
        let baseSteps = this.generateBaseExponentialSteps(problem, solution);

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

    generateBaseExponentialSteps(problem, solution) {
        const { type } = problem;

        switch (type) {
            case 'simple_exponential':
                return this.generateEnhancedSimpleExponentialSteps(problem, solution);
            case 'exponential_inequality':
                return this.generateEnhancedExponentialInequalitySteps(problem, solution);
            case 'exponential_quadratic':
                return this.generateEnhancedExponentialQuadraticSteps(problem, solution);
            case 'compound_interest':
                return this.generateEnhancedCompoundInterestSteps(problem, solution);
            default:
                return this.generateGenericSteps(problem, solution);
        }
    }

    generateEnhancedSimpleExponentialSteps(problem, solution) {
        const { coefficient = 1, a, b } = problem.parameters;
        const steps = [];

        // Step 1: Initial equation
        steps.push({
            stepNumber: 1,
            step: 'Given equation',
            description: 'Start with the exponential equation',
            expression: `${coefficient}·${a}^x = ${b}`,
            beforeExpression: null,
            afterExpression: `${coefficient}·${a}^x = ${b}`,
            operation: null,
            reasoning: 'This is an exponential equation where the variable is in the exponent',
            visualHint: 'Think of exponential growth or decay - the variable controls how many times we multiply',
            algebraicRule: 'Exponential equation in form c·a^x = b',
            goalStatement: 'Our goal is to isolate x using logarithms'
        });

        // Check validity
        if (a <= 0 || a === 1) {
            steps.push({
                stepNumber: 2,
                step: 'Check base validity',
                description: 'Verify that the base is valid',
                expression: `Base = ${a}`,
                reasoning: 'For exponential equations, base must be positive and not equal to 1',
                conclusion: 'Invalid base - no solution exists',
                solutionType: 'invalid_base'
            });
            return steps;
        }

        const adjustedB = b / coefficient;

        if (adjustedB <= 0) {
            steps.push({
                stepNumber: 2,
                step: 'Check right side validity',
                description: 'Verify that the result is positive',
                expression: `${a}^x = ${adjustedB}`,
                reasoning: 'Exponential expressions are always positive for any real x',
                conclusion: 'No solution exists - exponential cannot equal non-positive number',
                solutionType: 'no_solution'
            });
            return steps;
        }

        // Step 2: Isolate exponential (if coefficient ≠ 1)
        if (coefficient !== 1) {
            steps.push({
                stepNumber: 2,
                step: 'Isolate the exponential expression',
                description: `Divide both sides by ${coefficient}`,
                beforeExpression: `${coefficient}·${a}^x = ${b}`,
                operation: `÷ ${coefficient}`,
                afterExpression: `${a}^x = ${adjustedB}`,
                reasoning: 'We need the exponential expression alone before taking logarithms',
                algebraicRule: 'Division Property of Equality',
                visualHint: 'Remove any coefficients from the exponential term',
                workingDetails: {
                    leftSide: `${coefficient}·${a}^x ÷ ${coefficient} = ${a}^x`,
                    rightSide: `${b} ÷ ${coefficient} = ${adjustedB}`
                }
            });
        }

        // Step 3: Take logarithm
        const stepNum = coefficient === 1 ? 2 : 3;
        steps.push({
            stepNumber: stepNum,
            step: 'Take logarithm of both sides',
            description: `Apply natural logarithm (ln) to both sides`,
            beforeExpression: `${a}^x = ${adjustedB}`,
            operation: 'ln( )',
            afterExpression: `ln(${a}^x) = ln(${adjustedB})`,
            reasoning: 'Logarithms are the inverse operation of exponentials, allowing us to "bring down" the exponent',
            algebraicRule: 'Logarithm of both sides maintains equality',
            visualHint: 'Logarithm unlocks the exponent, allowing us to work with it algebraically',
            criticalConcept: 'Taking logarithms is the key technique for solving exponential equations'
        });

        // Step 4: Apply power rule
        steps.push({
            stepNumber: stepNum + 1,
            step: 'Apply logarithm power rule',
            description: 'Bring the exponent down as a coefficient',
            beforeExpression: `ln(${a}^x) = ln(${adjustedB})`,
            operation: 'Power Rule',
            afterExpression: `x·ln(${a}) = ln(${adjustedB})`,
            reasoning: 'The power rule of logarithms states that ln(a^x) = x·ln(a)',
            algebraicRule: 'Logarithm Power Rule: ln(a^n) = n·ln(a)',
            visualHint: 'The exponent moves from superscript position to coefficient position',
            workingDetails: {
                powerRule: `ln(${a}^x) = x·ln(${a})`,
                rightSide: `ln(${adjustedB}) stays as is`
            }
        });

        // Step 5: Solve for x
        steps.push({
            stepNumber: stepNum + 2,
            step: 'Solve for x',
            description: `Divide both sides by ln(${a})`,
            beforeExpression: `x·ln(${a}) = ln(${adjustedB})`,
            operation: `÷ ln(${a})`,
            afterExpression: `x = ln(${adjustedB})/ln(${a})`,
            reasoning: 'Division isolates x completely',
            algebraicRule: 'Division Property of Equality',
            visualHint: 'We now have x isolated on one side',
            finalAnswer: true,
            workingDetails: {
                leftSide: `x·ln(${a}) ÷ ln(${a}) = x`,
                rightSide: `ln(${adjustedB}) ÷ ln(${a}) = ${solution.solutions[0]}`,
                changeOfBase: `This is equivalent to log_${a}(${adjustedB})`
            },
            numericalResult: solution.solutions[0],
            approximation: `x ≈ ${solution.solutions[0].toFixed(6)}`
        });

        return steps;
    }

    generateEnhancedExponentialInequalitySteps(problem, solution) {
        const { a, b, operator = '>' } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given inequality',
            description: 'Start with the exponential inequality',
            expression: `${a}^x ${operator} ${b}`,
            reasoning: 'Unlike equations, inequalities define a range of solutions',
            visualHint: 'Solutions will be an interval, not just a point',
            goalStatement: 'Find all values of x that make this inequality true',
            criticalNote: 'Pay attention to whether the base is growth (a > 1) or decay (0 < a < 1)'
        });

        // Check base type
        const isGrowthBase = a > 1;
        steps.push({
            stepNumber: 2,
            step: 'Identify base type',
            description: `Determine if base represents growth or decay`,
            expression: `Base a = ${a}`,
            baseType: isGrowthBase ? 'Growth base (a > 1)' : 'Decay base (0 < a < 1)',
            reasoning: isGrowthBase ? 
                'Since a > 1, this is exponential growth - function is increasing' :
                'Since 0 < a < 1, this is exponential decay - function is decreasing',
            implication: isGrowthBase ?
                'Inequality direction will be preserved when taking logarithm' :
                'Inequality direction will REVERSE when taking logarithm',
            criticalWarning: !isGrowthBase ? 'IMPORTANT: Inequality will flip!' : null
        });

        // Take logarithm
        steps.push({
            stepNumber: 3,
            step: 'Take logarithm of both sides',
            description: 'Apply natural logarithm to both sides',
            beforeExpression: `${a}^x ${operator} ${b}`,
            operation: 'ln( )',
            afterExpression: `ln(${a}^x) ${operator} ln(${b})`,
            reasoning: 'Logarithm allows us to work with the exponent',
            algebraicRule: 'Logarithm preserves inequality for positive arguments',
            visualHint: 'Make sure right side is positive before taking log'
        });

        // Apply power rule
        steps.push({
            stepNumber: 4,
            step: 'Apply power rule',
            description: 'Bring exponent down as coefficient',
            beforeExpression: `ln(${a}^x) ${operator} ln(${b})`,
            operation: 'Power Rule',
            afterExpression: `x·ln(${a}) ${operator} ln(${b})`,
            reasoning: 'Power rule: ln(a^x) = x·ln(a)',
            algebraicRule: 'Logarithm Power Rule'
        });

        // Solve for x with inequality direction check
        const willFlip = (isGrowthBase && Math.log(a) < 0) || (!isGrowthBase && Math.log(a) > 0);
        const actualFlip = Math.log(a) < 0;
        const newOperator = actualFlip ? this.flipInequalityOperator(operator) : operator;

        steps.push({
            stepNumber: 5,
            step: 'Solve for x',
            description: `Divide both sides by ln(${a})`,
            beforeExpression: `x·ln(${a}) ${operator} ln(${b})`,
            operation: `÷ ln(${a}) = ${Math.log(a)}`,
            afterExpression: `x ${newOperator} ${solution.criticalValue.toFixed(6)}`,
            reasoning: actualFlip ?
                `Since ln(${a}) < 0, inequality direction REVERSES` :
                `Since ln(${a}) > 0, inequality direction is PRESERVED`,
            algebraicRule: 'Division by negative number reverses inequality',
            criticalWarning: actualFlip ? 'INEQUALITY FLIPPED!' : null,
            visualHint: 'Always check sign of ln(a) when dividing',
            finalAnswer: true,
            intervalNotation: solution.intervalNotation
        });

        return steps;
    }

    generateEnhancedExponentialQuadraticSteps(problem, solution) {
        const { a, b, c, base } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given equation',
            description: 'Start with exponential equation in quadratic form',
            expression: `${a}·${base}^(2x) + ${b}·${base}^x + ${c} = 0`,
            reasoning: 'Notice that ${base}^(2x) = (${base}^x)² - this has quadratic structure',
            visualHint: 'Recognize the pattern: (something)² + b·(something) + c = 0',
            goalStatement: 'Use substitution to transform into a quadratic equation'
        });

        steps.push({
            stepNumber: 2,
            step: 'Make substitution',
            description: `Let u = ${base}^x`,
            beforeExpression: `${a}·${base}^(2x) + ${b}·${base}^x + ${c} = 0`,
            substitution: `u = ${base}^x, therefore u² = ${base}^(2x)`,
            afterExpression: `${a}u² + ${b}u + ${c} = 0`,
            reasoning: 'This substitution transforms the exponential equation into a standard quadratic',
            algebraicRule: 'Substitution technique',
            visualHint: 'We temporarily replace the exponential with a simpler variable'
        });

        steps.push({
            stepNumber: 3,
            step: 'Solve quadratic equation',
            description: 'Use quadratic formula or factoring',
            beforeExpression: `${a}u² + ${b}u + ${c} = 0`,
            operation: 'Quadratic Formula',
            formula: `u = (-b ± √(b²-4ac))/(2a)`,
            discriminant: solution.discriminant,
            afterExpression: solution.uValues ? `u = ${solution.uValues.join(' or u = ')}` : 'No real solutions',
            reasoning: 'Apply standard quadratic solution methods',
            algebraicRule: 'Quadratic Formula'
        });

        if (solution.uValues && solution.uValues.length > 0) {
            steps.push({
                stepNumber: 4,
                step: 'Back-substitute',
                description: `Replace u with ${base}^x`,
                beforeExpression: `u = ${solution.uValues.join(' or u = ')}`,
                backSubstitution: `${base}^x = ${solution.uValues.join(` or ${base}^x = `)}`,
                reasoning: 'Convert back from u to the original exponential form',
                criticalNote: 'Only positive u values are valid (since a^x > 0 always)'
            });

            steps.push({
                stepNumber: 5,
                step: 'Solve exponential equations',
                description: 'Take logarithm to solve for x',
                solutions: solution.solutions.map((x, i) => ({
                    equation: `${base}^x = ${solution.uValues[i]}`,
                    solution: `x = ln(${solution.uValues[i]})/ln(${base}) = ${x.toFixed(6)}`
                })),
                reasoning: 'Use logarithms to isolate x from each exponential equation',
                finalAnswer: true,
                numericalResults: solution.solutions
            });
        }

        return steps;
    }

    generateEnhancedCompoundInterestSteps(problem, solution) {
        const { principal, rate, time, compoundingFrequency } = problem.parameters;
        const steps = [];

        const isContinuous = compoundingFrequency === 'continuous';

        steps.push({
            stepNumber: 1,
            step: 'Identify given information',
            description: 'List all known values',
            given: {
                principal: principal,
                rate: rate,
                time: time,
                compounding: isContinuous ? 'Continuous' : `${compoundingFrequency} times per year`
            },
            reasoning: 'Organize information to determine which formula to use',
            goalStatement: 'Calculate the final amount after compound interest'
        });

        steps.push({
            stepNumber: 2,
            step: 'Choose appropriate formula',
            description: isContinuous ? 'Use continuous compounding formula' : 'Use discrete compounding formula',
            formula: isContinuous ? 'A = Pe^(rt)' : 'A = P(1 + r/n)^(nt)',
            reasoning: isContinuous ? 
                'Continuous compounding uses natural exponential function e' :
                'Discrete compounding compounds at regular intervals',
            algebraicRule: 'Compound Interest Formula'
        });

        steps.push({
            stepNumber: 3,
            step: 'Substitute values',
            description: 'Plug in the known values',
            beforeExpression: solution.formula,
            substitution: isContinuous ?
                `A = ${principal}·e^(${rate}·${time})` :
                `A = ${principal}(1 + ${rate}/${compoundingFrequency})^(${compoundingFrequency}·${time})`,
            reasoning: 'Replace variables with numerical values',
            visualHint: 'Double-check that rate is in decimal form, not percentage'
        });

        steps.push({
            stepNumber: 4,
            step: 'Calculate',
            description: 'Evaluate the exponential expression',
            calculation: isContinuous ?
                `e^(${rate * time}) ≈ ${Math.exp(rate * time).toFixed(6)}` :
                `(1 + ${rate}/${compoundingFrequency})^(${compoundingFrequency * time}) ≈ ${Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * time).toFixed(6)}`,
            finalAmount: `A = $${solution.finalAmount.toFixed(2)}`,
            interest: `Interest earned = $${solution.interest.toFixed(2)}`,
            finalAnswer: true,
            reasoning: 'Use calculator to evaluate exponential expression'
        });

        return steps;
    }

    generateGenericSteps(problem, solution) {
        return [{
            stepNumber: 1,
            step: 'Generic exponential problem',
            description: 'Solve the given exponential problem',
            expression: problem.equation || 'Problem not recognized',
            reasoning: 'Apply appropriate exponential techniques for this problem type',
            solution: solution
        }];
    }

    // Enhanced explanation methods
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

    // Helper methods for explanations
    getConceptualExplanation(step, problem) {
        const conceptualExplanations = {
            'Given equation': 'We start with an equation where the variable is in the exponent. Exponentials represent repeated multiplication.',
            'Take logarithm of both sides': 'Logarithms are the inverse of exponentials. They allow us to "unlock" the exponent and work with it algebraically.',
            'Apply logarithm power rule': 'The power rule brings the exponent down from its superscript position, transforming it into a coefficient we can manipulate.',
            'Make substitution': 'When we see exponential expressions that form a pattern, substitution simplifies the problem into familiar territory.'
        };

        return conceptualExplanations[step.step] || 'This step moves us closer to isolating the variable.';
    }

    getProceduralExplanation(step) {
        if (step.operation) {
            return `1. Identify the operation needed: ${step.operation}
2. Apply this operation to both sides
3. Simplify both sides
4. Write the resulting equation`;
        }
        return 'Follow the standard procedure for this type of exponential step.';
    }

    getVisualExplanation(step, problem) {
        const visualExplanations = {
            'simple_exponential': 'Picture an exponential curve - we need to find the x-value that produces the desired height.',
            'exponential_inequality': 'Imagine the exponential curve and shade the region where the curve is above/below the threshold.',
            'exponential_quadratic': 'Think of this as a U-shaped parabola in disguise, hidden within exponential expressions.'
        };

        return visualExplanations[problem.type] || 'Visualize how logarithms "undo" exponentials.';
    }

    getAlgebraicExplanation(step) {
        const algebraicRules = {
            'Given equation': 'Exponential equation in standard form where the variable appears in the exponent',
            'Take logarithm of both sides': 'Apply logarithm function (inverse of exponential) to both sides',
            'Apply logarithm power rule': 'Use property: log(a^n) = n·log(a)',
            'Make substitution': 'Variable substitution to reduce problem complexity'
        };

        return algebraicRules[step.step] || 'Apply standard exponential and logarithmic properties';
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
            progression: 'We are making progress toward isolating the variable',
            relationship: 'Each step brings us closer to the final answer'
        };
    }

    generateStepBridge(currentStep, nextStep) {
        return {
            currentState: `We now have: ${currentStep.afterExpression || currentStep.expression}`,
            nextGoal: `Next, we need to: ${nextStep.description}`,
            why: `This step is necessary to continue solving`,
            howItHelps: `This will help us get closer to isolating x`
        };
    }

    explainStepProgression(currentStep, nextStep) {
        return `After ${currentStep.step}, we proceed to ${nextStep.step.toLowerCase()} to continue`;
    }

    explainStepStrategy(nextStep) {
        return `The strategy for "${nextStep.step}" is to ${nextStep.description.toLowerCase()}`;
    }

    generatePreventionTips(step, problemType) {
        const tips = {
            'Take logarithm': [
                'Make sure both sides are positive before taking log',
                'Choose ln (natural log) for convenience',
                'Apply to entire expression, not just parts'
            ],
            'Apply logarithm power rule': [
                'Remember: log(a^n) = n·log(a), NOT (log a)^n',
                'The exponent becomes a coefficient',
                'Apply this property carefully'
            ]
        };

        return tips[step.step] || ['Double-check your work', 'Verify each calculation'];
    }

    generateCheckPoints(step) {
        return [
            'Verify the operation was applied correctly',
            'Check arithmetic calculations',
            'Ensure the equation is properly simplified',
            'Confirm the step moves toward the solution'
        ];
    }

    identifyWarningFlags(step, problemType) {
        const warnings = {
            exponential_inequality: step.step === 'Solve for x' ?
                ['Check if dividing by negative ln(a) - flip inequality if so'] : [],
            exponential_quadratic: step.step === 'Back-substitute' ?
                ['Reject negative u values - exponentials are always positive'] : []
        };

        return warnings[problemType] || [];
    }

    generateSelfCheckQuestion(step) {
        const questions = {
            'Take logarithm of both sides': 'Did I apply the logarithm to both complete sides of the equation?',
            'Apply logarithm power rule': 'Did the exponent become a coefficient, not stay as an exponent?',
            'Make substitution': 'Did I identify the correct pattern for substitution?'
        };

        return questions[step.step] || 'Does this step make sense and move me toward the solution?';
    }

    describeExpectedResult(step) {
        const expectations = {
            'Take logarithm of both sides': 'Both sides should have logarithm notation',
            'Apply logarithm power rule': 'Exponent should now be a coefficient',
            'Solve for x': 'Variable x should be isolated'
        };

        return expectations[step.step] || 'The step should simplify the problem further';
    }

    generateTroubleshootingTips(step) {
        return [
            'If stuck, review the previous step',
            'Check for calculation errors',
            'Verify logarithm properties were applied correctly',
            'Consider if there\'s a simpler approach'
        ];
    }

    breakIntoSubSteps(step) {
        if (step.operation) {
            return [
                `Identify the operation needed: ${step.operation}`,
                'Apply the operation to the left side',
                'Apply the same operation to the right side',
                'Simplify both sides',
                'Write the resulting equation'
            ];
        }

        return ['Analyze the current state', 'Determine the next action', 'Execute the operation'];
    }

    generatePracticeVariation(step, problem) {
        return {
            similarProblem: 'Try a similar problem with different base and result',
            practiceHint: 'Practice with simple bases like 2, 3, or 10 first',
            extension: 'Once comfortable, try more complex exponential forms'
        };
    }

    explainThinkingProcess(step) {
        return {
            observe: 'What do I see in the current equation?',
            goal: 'What am I trying to achieve?',
            strategy: 'What operation will help me reach my goal?',
            execute: 'How do I apply this operation correctly?',
            verify: 'Does my result make sense?'
        };
    }

    identifyDecisionPoints(step) {
        return [
            'Choosing which logarithm base to use (ln is typical)',
            'Deciding when to apply logarithm properties',
            'Selecting the most efficient solution method'
        ];
    }

    suggestAlternativeMethods(step, problem) {
        const alternatives = {
            'Take logarithm of both sides': [
                'Could use common log (log base 10) instead of natural log',
                'Could use log with same base as the exponential'
            ],
            'Solve for x': [
                'Could use graphical methods for verification',
                'Could use numerical approximation methods'
            ]
        };

        return alternatives[step.step] || ['Alternative approaches exist but this is most direct'];
    }

    flipInequalityOperator(operator) {
        const flips = { '>': '<', '<': '>', '≥': '≤', '≤': '≥', '>=': '<=', '<=': '>=' };
        return flips[operator] || operator;
    }

    identifyPrerequisites(step, problemType) {
        const prerequisites = {
            'Take logarithm of both sides': ['Understanding of logarithms', 'Inverse function concept'],
            'Apply logarithm power rule': ['Logarithm properties', 'Exponent rules'],
            'Make substitution': ['Variable substitution', 'Quadratic equations']
        };

        return prerequisites[step.step] || ['Basic exponential concepts'];
    }

    identifyKeyVocabulary(step) {
        const vocabulary = {
            'Given equation': ['exponential', 'base', 'exponent', 'variable'],
            'Take logarithm of both sides': ['logarithm', 'natural log', 'inverse function'],
            'Apply logarithm power rule': ['power rule', 'coefficient', 'property']
        };

        return vocabulary[step.step] || [];
    }

    adaptLanguageLevel(text, level) {
        if (!text) return '';

        const adaptations = {
            basic: {
                replacements: {
                    'logarithm': 'log (opposite of exponential)',
                    'exponent': 'power',
                    'coefficient': 'number in front',
                    'isolate': 'get by itself'
                }
            },
            intermediate: {
                replacements: {
                    'logarithm': 'logarithm',
                    'exponent': 'exponent',
                    'coefficient': 'coefficient',
                    'isolate': 'isolate'
                }
            },
            detailed: {
                replacements: {
                    'logarithm': 'logarithm (inverse exponential function)',
                    'exponent': 'exponent (power to which base is raised)',
                    'coefficient': 'coefficient (multiplicative constant)',
                    'isolate': 'isolate (algebraically separate)'
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

    verifySimpleExponential() {
        const { coefficient = 1, a, b } = this.currentProblem.parameters;
        const solution = this.currentSolution.solutions[0];

        if (typeof solution !== 'number') {
            return { type: 'special_case', message: solution };
        }

        const leftSide = coefficient * Math.pow(a, solution);
        const rightSide = b;
        const difference = Math.abs(leftSide - rightSide);
        const tolerance = 1e-10;

        return {
            solution: solution,
            leftSide: leftSide,
            rightSide: rightSide,
            difference: difference,
            isValid: difference < tolerance,
            substitution: `${coefficient}·${a}^${solution} = ${leftSide}`,
            equation: `${coefficient}·${a}^x = ${b}`,
            tolerance: tolerance
        };
    }

    verifyExponentialInequality() {
        const { a, b, operator } = this.currentProblem.parameters;
        const { criticalValue, solutionSet } = this.currentSolution;

        const testPoints = [
            criticalValue - 1,
            criticalValue,
            criticalValue + 1
        ];

        const testResults = testPoints.map(x => {
            const leftValue = Math.pow(a, x);
            let satisfies = false;

            switch (operator) {
                case '>': satisfies = leftValue > b; break;
                case '<': satisfies = leftValue < b; break;
                case '>=': case '≥': satisfies = leftValue >= b; break;
                case '<=': case '≤': satisfies = leftValue <= b; break;
            }

            return {
                testPoint: x,
                leftValue: leftValue,
                rightValue: b,
                satisfies: satisfies,
                relation: `${leftValue} ${operator} ${b}`
            };
        });

        return {
            criticalValue: criticalValue,
            operator: operator,
            testResults: testResults,
            solutionSet: solutionSet,
            inequality: `${a}^x ${operator} ${b}`
        };
    }

    calculateVerificationConfidence() {
        if (!this.currentSolution || !this.currentProblem) return 'Unknown';

        const { type } = this.currentProblem;

        switch (type) {
            case 'simple_exponential':
                const verification = this.verifySimpleExponential();
                if (verification.type === 'special_case') return 'Confirmed';
                return verification.isValid ? 'High' : 'Low';

            case 'exponential_inequality':
                return 'High';

            case 'exponential_quadratic':
                return this.currentSolution.solutions.length > 0 ? 'High' : 'Confirmed';

            default:
                return 'Medium';
        }
    }

    getVerificationNotes() {
        const { type } = this.currentProblem;
        const notes = [];

        switch (type) {
            case 'simple_exponential':
                notes.push('Direct substitution method used');
                notes.push('Numerical tolerance: 1e-10');
                break;

            case 'exponential_inequality':
                notes.push('Test points used to verify solution region');
                notes.push('Critical value and boundary behavior checked');
                break;

            case 'exponential_quadratic':
                notes.push('Quadratic substitution method verified');
                notes.push('Back-substitution validity checked');
                break;

            default:
                notes.push('Standard verification methods applied');
        }

        return notes.join('; ');
    }

    generatePedagogicalNotes(problemType) {
        const pedagogicalDatabase = {
            simple_exponential: {
                objectives: [
                    'Solve exponential equations using logarithms',
                    'Apply logarithm properties correctly',
                    'Verify solutions through substitution'
                ],
                keyConcepts: [
                    'Logarithm as inverse of exponential',
                    'Power rule for logarithms',
                    'Change of base formula'
                ],
                prerequisites: [
                    'Understanding of exponentials',
                    'Basic logarithm concepts',
                    'Algebraic manipulation skills'
                ],
                commonDifficulties: [
                    'Forgetting to take log of both sides',
                    'Confusing log(a^x) with (log a)^x',
                    'Not checking domain restrictions'
                ],
                extensions: [
                    'Exponential inequalities',
                    'Systems with exponentials',
                    'Applications in growth/decay'
                ],
                assessment: [
                    'Check understanding of logarithm properties',
                    'Verify correct application of power rule',
                    'Test with different bases'
                ]
            },
            exponential_inequality: {
                objectives: [
                    'Solve exponential inequalities',
                    'Understand base type effects on inequality direction',
                    'Express solutions in interval notation'
                ],
                keyConcepts: [
                    'Growth vs decay bases',
                    'Inequality direction with logarithms',
                    'Critical values and test points'
                ],
                prerequisites: [
                    'Exponential equation solving',
                    'Logarithm properties',
                    'Inequality concepts'
                ],
                commonDifficulties: [
                    'Forgetting to flip inequality for decay bases',
                    'Not checking if ln(a) is positive or negative',
                    'Misunderstanding solution intervals'
                ],
                extensions: [
                    'Compound exponential inequalities',
                    'Systems of inequalities',
                    'Optimization problems'
                ],
                assessment: [
                    'Test with both growth and decay bases',
                    'Check interval notation understanding',
                    'Verify graphical interpretation'
                ]
            },
            exponential_quadratic: {
                objectives: [
                    'Recognize quadratic form in exponential equations',
                    'Apply substitution technique effectively',
                    'Validate solutions after back-substitution'
                ],
                keyConcepts: [
                    'Substitution method',
                    'Quadratic solution techniques',
                    'Domain restrictions (exponentials always positive)'
                ],
                prerequisites: [
                    'Quadratic equation solving',
                    'Exponential equation basics',
                    'Substitution technique'
                ],
                commonDifficulties: [
                    'Not recognizing quadratic structure',
                    'Forgetting to back-substitute',
                    'Not rejecting negative u values'
                ],
                extensions: [
                    'Higher degree exponential equations',
                    'Rational exponential equations',
                    'Systems with quadratic exponentials'
                ],
                assessment: [
                    'Check recognition of quadratic form',
                    'Verify substitution process',
                    'Test validation of solutions'
                ]
            },
            compound_interest: {
                objectives: [
                    'Apply compound interest formulas',
                    'Distinguish between discrete and continuous compounding',
                    'Solve for various parameters (P, A, r, t)'
                ],
                keyConcepts: [
                    'Exponential growth in finance',
                    'Compounding frequency effect',
                    'Natural exponential in continuous compounding'
                ],
                prerequisites: [
                    'Exponential functions',
                    'Logarithms for solving',
                    'Financial terminology'
                ],
                commonDifficulties: [
                    'Confusing n and t parameters',
                    'Not converting percentage to decimal',
                    'Wrong formula selection'
                ],
                extensions: [
                    'Present value calculations',
                    'Annuities and series',
                    'Loan amortization'
                ],
                assessment: [
                    'Check formula selection',
                    'Verify parameter identification',
                    'Test practical applications'
                ]
            }
        };

        return pedagogicalDatabase[problemType] || {
            objectives: ['Solve the given exponential problem'],
            keyConcepts: ['Apply exponential and logarithmic techniques'],
            prerequisites: ['Basic exponential and logarithmic skills'],
            commonDifficulties: ['Various computational errors'],
            extensions: ['More complex exponential variations'],
            assessment: ['Check understanding of solution process']
        };
    }

    generateAlternativeMethods(problemType) {
        const alternativeDatabase = {
            simple_exponential: {
                primaryMethod: 'Natural logarithm method',
                methods: [
                    {
                        name: 'Common Logarithm Method',
                        description: 'Use log base 10 instead of natural log'
                    },
                    {
                        name: 'Same Base Logarithm',
                        description: 'Use logarithm with same base as exponential'
                    },
                    {
                        name: 'Graphical Method',
                        description: 'Graph both sides and find intersection'
                    },
                    {
                        name: 'Numerical Methods',
                        description: 'Use iterative approximation techniques'
                    }
                ],
                comparison: 'Natural log is most common; same-base log is cleanest; graphical provides visualization'
            },
            exponential_inequality: {
                primaryMethod: 'Logarithmic algebraic method',
                methods: [
                    {
                        name: 'Graphical Method',
                        description: 'Graph exponential function and identify regions'
                    },
                    {
                        name: 'Test Point Method',
                        description: 'Find critical value then test intervals'
                    },
                    {
                        name: 'Sign Analysis',
                        description: 'Analyze sign of difference between sides'
                    }
                ],
                comparison: 'Algebraic method is most precise; graphical shows regions clearly; test points verify solution'
            },
            exponential_quadratic: {
                primaryMethod: 'Substitution with quadratic formula',
                methods: [
                    {
                        name: 'Factoring Method',
                        description: 'Factor quadratic form if possible, then back-substitute'
                    },
                    {
                        name: 'Completing the Square',
                        description: 'Complete square in u, then solve exponentials'
                    },
                    {
                        name: 'Graphical Method',
                        description: 'Graph substituted function to find u values'
                    }
                ],
                comparison: 'Quadratic formula is universal; factoring is fastest when possible; graphical aids understanding'
            },
            compound_interest: {
                primaryMethod: 'Direct formula application',
                methods: [
                    {
                        name: 'Logarithmic Solving',
                        description: 'Use logs to solve for rate or time'
                    },
                    {
                        name: 'Trial and Error',
                        description: 'Systematic testing for simple problems'
                    },
                    {
                        name: 'Financial Calculator',
                        description: 'Use specialized calculator functions'
                    },
                    {
                        name: 'Spreadsheet Method',
                        description: 'Create compound interest tables'
                    }
                ],
                comparison: 'Formula is fastest; logarithms needed for solving unknowns; calculators/spreadsheets for complex scenarios'
            }
        };

        return alternativeDatabase[problemType] || {
            primaryMethod: 'Standard exponential approach',
            methods: [
                {
                    name: 'Systematic Approach',
                    description: 'Follow standard exponential problem-solving steps'
                }
            ],
            comparison: 'Method choice depends on problem structure and available tools'
        };
    }

    // WORKBOOK GENERATION

    generateExponentialWorkbook() {
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
            title: 'Exponential Mathematical Workbook',
            timestamp: new Date().toISOString(),
            theme: this.theme,
            dimensions: { width: this.width, height: this.height },
            sections: []
        };
    }

    createProblemSection() {
        if (!this.currentProblem) return null;

        return {
            title: 'Problem Statement',
            type: 'problem',
            data: [
                ['Problem Type', this.currentProblem.type],
                ['Equation', this.currentProblem.equation || this.currentProblem.originalInput],
                ['Description', this.currentProblem.scenario || 'Exponential equation']
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
            } else {
                stepsData.push(['Expression', step.expression]);
            }

            if (step.reasoning) {
                stepsData.push(['Reasoning', step.reasoning]);
            }

            if (step.algebraicRule) {
                stepsData.push(['Rule Used', step.algebraicRule]);
            }

            if (step.criticalConcept) {
                stepsData.push(['Key Concept', step.criticalConcept]);
            }

            if (step.criticalWarning) {
                stepsData.push(['⚠️ WARNING', step.criticalWarning]);
            }

            // Enhanced explanations
            if (step.explanations && this.explanationLevel === 'detailed') {
                stepsData.push(['Conceptual', step.explanations.conceptual]);
            }

            if (step.errorPrevention && this.includeErrorPrevention) {
                stepsData.push(['Common Mistakes', step.errorPrevention.commonMistakes.join('; ')]);
                stepsData.push(['Prevention Tips', step.errorPrevention.preventionTips.join('; ')]);
            }

            if (step.scaffolding && this.explanationLevel === 'scaffolded') {
                stepsData.push(['Guiding Questions', step.scaffolding.guidingQuestions.join(' ')]);
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
        return {
            title: 'Key Concepts',
            type: 'lesson',
            data: [
                ['Concept', 'Exponential equations have variables in the exponent'],
                ['Goal', 'Use logarithms to bring exponents down and solve'],
                ['Method', 'Take logarithm of both sides, apply power rule, solve algebraically']
            ]
        };
    }

    createSolutionSection() {
        if (!this.currentSolution) return null;

        const solutionData = [];

        if (this.currentSolution.solutions && Array.isArray(this.currentSolution.solutions)) {
            this.currentSolution.solutions.forEach((sol, idx) => {
                solutionData.push([`Solution ${idx + 1}`, typeof sol === 'number' ? sol.toFixed(6) : sol]);
            });
        } else {
            solutionData.push(['Final Answer', this.currentSolution.value || JSON.stringify(this.currentSolution.solutions)]);
        }

        if (this.currentSolution.solutionType) {
            solutionData.push(['Solution Type', this.currentSolution.solutionType]);
        }

        if (this.currentSolution.logarithmicForm) {
            solutionData.push(['Logarithmic Form', this.currentSolution.logarithmicForm]);
        }

        if (this.currentSolution.intervalNotation) {
            solutionData.push(['Interval Notation', this.currentSolution.intervalNotation]);
        }

        return {
            title: 'Final Solution',
            type: 'solution',
            data: solutionData
        };
    }

    createAnalysisSection() {
        return {
            title: 'Solution Analysis',
            type: 'analysis',
            data: [
                ['Steps Used', this.solutionSteps?.length || 0],
                ['Difficulty Level', this.explanationLevel],
                ['Method', 'Logarithmic manipulation'],
                ['Category', this.currentProblem?.type || 'Unknown']
            ]
        };
    }

    createVerificationSection() {
        if (!this.currentSolution || !this.currentProblem) return null;

        const verificationData = [];
        const { type } = this.currentProblem;

        verificationData.push(['Verification Method', 'Result']);
        verificationData.push(['', '']); // Spacing

        switch (type) {
            case 'simple_exponential':
                const verification = this.verifySimpleExponential();
                verificationData.push(...this.formatSimpleExponentialVerification(verification));
                break;

            case 'exponential_inequality':
                const inequalityVerification = this.verifyExponentialInequality();
                verificationData.push(...this.formatExponentialInequalityVerification(inequalityVerification));
                break;

            default:
                verificationData.push(['General Check', 'Solution verified using substitution method']);
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

    formatSimpleExponentialVerification(verification) {
        if (verification.type === 'special_case') {
            return [['Special Case', verification.message]];
        }

        return [
            ['Original Equation', verification.equation],
            ['Solution', `x = ${verification.solution}`],
            ['Substitution', verification.substitution],
            ['Left Side', verification.leftSide],
            ['Right Side', verification.rightSide],
            ['Difference', verification.difference.toExponential(2)],
            ['Valid', verification.isValid ? 'Yes' : 'No']
        ];
    }

    formatExponentialInequalityVerification(verification) {
        const data = [
            ['Original Inequality', verification.inequality],
            ['Critical Value', verification.criticalValue],
            ['Solution Set', verification.solutionSet],
            ['', ''], // Spacing
            ['Test Point', 'Left Value', 'Right Value', 'Satisfies']
        ];

        verification.testResults.forEach(test => {
            data.push([
                test.testPoint,
                test.leftValue,
                test.rightValue,
                test.satisfies ? 'Yes' : 'No'
            ]);
        });

        return data;
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
}
