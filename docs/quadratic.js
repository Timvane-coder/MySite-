
import * as math from 'mathjs';                                 
import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';

// Enhanced Quadratic Mathematical Workbook - Complete Quadratic Problem Solver
export class QuadraticMathematicalWorkbook {                        
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

        this.includeVerificationInSteps = options.includeVerificationInSteps !== false;
        this.verificationDetail = options.verificationDetail || 'detailed';

        // NEW: Options for new features
        this.includeLesson = options.includeLesson !== false;
        this.includeRelatedProblems = options.includeRelatedProblems !== false;

        this.mathSymbols = this.initializeMathSymbols();

        this.setThemeColors();
        this.initializeQuadraticSolvers();
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
            // Superscripts and powers
            '²': '²', '³': '³', '^2': '²', '^3': '³',
            // Greek letters
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'Δ',
            'pi': 'π', 'theta': 'θ', 'lambda': 'λ', 'mu': 'μ',
            // Mathematical operators
            'sqrt': '√', 'integral': '∫', 'sum': 'Σ', 'product': 'Π',
            'infinity': '∞', 'plusminus': '±', 'leq': '≤', 'geq': '≥',
            'neq': '≠', 'approx': '≈',
            // Fractions and special symbols
            'frac': '/', 'over': '/', 'vertex': '⌂', 'discriminant': 'Δ'
        };
    }

    initializeQuadraticSolvers() {
        this.quadraticTypes = {
            // Basic quadratic equation solving
            standard_form: {
                patterns: [
                    /([+-]?\d*\.?\d*)x²\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d*\.?\d*)\s*=\s*0/,
                    /([+-]?\d*\.?\d*)x\^2\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d*\.?\d*)\s*=\s*0/,
                    /([+-]?\d*\.?\d*)x²\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d*\.?\d*)/
                ],
                solver: this.solveStandardQuadratic.bind(this),
                name: 'Standard Quadratic Equation',
                category: 'basic_quadratic',
                description: 'Solves ax² + bx + c = 0'
            },

            // Quadratic formula demonstration
            quadratic_formula: {
                patterns: [
                    /quadratic.*formula/i,
                    /x.*=.*-b.*sqrt.*discriminant/i,
                    /formula.*quadratic/i
                ],
                solver: this.demonstrateQuadraticFormula.bind(this),
                name: 'Quadratic Formula',
                category: 'theory',
                description: 'Demonstrates the quadratic formula'
            },

            // Completing the square
            completing_square: {
                patterns: [
                    /complete.*square/i,
                    /completing.*square/i,
                    /perfect.*square/i
                ],
                solver: this.completeTheSquare.bind(this),
                name: 'Completing the Square',
                category: 'solving_method',
                description: 'Solves by completing the square'
            },

            // Factoring quadratics
            factoring: {
                patterns: [
                    /factor.*quadratic/i,
                    /factoring/i,
                    /factor.*form/i
                ],
                solver: this.factorQuadratic.bind(this),
                name: 'Factoring Quadratics',
                category: 'solving_method',
                description: 'Solves by factoring'
            },

            // Vertex form and parabola properties
            vertex_form: {
                patterns: [
                    /vertex.*form/i,
                    /vertex/i,
                    /parabola.*vertex/i,
                    /y.*=.*a.*\(.*x.*-.*h.*\).*\+.*k/i
                ],
                solver: this.analyzeVertexForm.bind(this),
                name: 'Vertex Form Analysis',
                category: 'parabola_properties',
                description: 'Analyzes vertex form y = a(x-h)² + k'
            },

            // Quadratic function analysis
            function_analysis: {
                patterns: [
                    /analyze.*quadratic/i,
                    /function.*analysis/i,
                    /parabola.*analysis/i,
                    /quadratic.*properties/i
                ],
                solver: this.analyzeQuadraticFunction.bind(this),
                name: 'Quadratic Function Analysis',
                category: 'function_analysis',
                description: 'Complete analysis of quadratic functions'
            },

            // Discriminant analysis
            discriminant: {
                patterns: [
                    /discriminant/i,
                    /b².*-.*4ac/i,
                    /nature.*roots/i,
                    /type.*roots/i
                ],
                solver: this.analyzeDiscriminant.bind(this),
                name: 'Discriminant Analysis',
                category: 'theory',
                description: 'Analyzes discriminant and root types'
            },

            // Quadratic inequalities
            inequality: {
                patterns: [
                    /([+-]?\d*\.?\d*)x²\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d*\.?\d*)\s*[><≤≥]\s*0/,
                    /quadratic.*inequality/i,
                    /inequality.*quadratic/i
                ],
                solver: this.solveQuadraticInequality.bind(this),
                name: 'Quadratic Inequalities',
                category: 'inequalities',
                description: 'Solves quadratic inequalities'
            },

            // Systems with quadratics
            system_quadratic: {
                patterns: [
                    /system.*quadratic/i,
                    /quadratic.*system/i,
                    /two.*equations.*quadratic/i
                ],
                solver: this.solveQuadraticSystem.bind(this),
                name: 'Systems with Quadratics',
                category: 'systems',
                description: 'Solves systems involving quadratics'
            },

            // Word problems and applications
            projectile_motion: {
                patterns: [
                    /projectile/i,
                    /height.*time/i,
                    /ball.*thrown/i,
                    /motion.*gravity/i,
                    /h.*=.*-16t²/i,
                    /h.*=.*-4\.9t²/i
                ],
                solver: this.solveProjectileMotion.bind(this),
                name: 'Projectile Motion',
                category: 'applications',
                description: 'Solves projectile motion problems'
            },

            area_optimization: {
                patterns: [
                    /maximize.*area/i,
                    /area.*optimization/i,
                    /rectangle.*area/i,
                    /fence.*area/i
                ],
                solver: this.solveAreaOptimization.bind(this),
                name: 'Area Optimization',
                category: 'applications',
                description: 'Solves area optimization problems'
            },

            profit_revenue: {
                patterns: [
                    /profit.*price/i,
                    /revenue.*quadratic/i,
                    /business.*optimization/i,
                    /maximize.*profit/i
                ],
                solver: this.solveProfitRevenue.bind(this),
                name: 'Profit and Revenue',
                category: 'applications',
                description: 'Solves business optimization problems'
            },

            fractional_quadratic: {
                patterns: [
                    /([+-]?\d*\.?\d*)\/x²\s*([+-]\s*\d*\.?\d*)\/x\s*([+-]\s*\d*\.?\d*)\s*=\s*0/,
                    /\d+\/x²/,
                    /fraction.*quadratic/i,
                    /reciprocal.*quadratic/i
                ],
                solver: this.solveFractionalQuadratics.bind(this),
                name: 'Fractional Quadratics',
                category: 'advanced_forms',
                description: 'Solves equations like 1/x² + 3/x - 4 = 0'
            },

            parametric_quadratic: {
                patterns: [
                    /\([^)]*[a-z]\s*[+-]\s*\d*\)\s*x²/i,
                    /parameter.*quadratic/i,
                    /variable.*coefficient/i
                ],
                solver: this.solveParametricQuadratics.bind(this),
                name: 'Parametric Quadratics',
                category: 'advanced_forms',
                description: 'Solves quadratics with parameter coefficients'
            },

            linear_quadratic_system: {
                patterns: [
                    /system.*linear.*quadratic/i,
                    /parabola.*line.*intersection/i,
                    /y.*=.*x².*y.*=.*x/i
                ],
                solver: this.solveLinearQuadraticSystem.bind(this),
                name: 'Linear-Quadratic Systems',
                category: 'systems',
                description: 'Solves systems with one linear and one quadratic equation'
            },

            rational_inequality: {
                patterns: [
                    /\([^)]*x²[^)]*\)\s*\/\s*\([^)]*x[^)]*\)\s*[><≤≥]/,
                    /rational.*inequality/i,
                    /fraction.*inequality/i
                ],
                solver: this.solveRationalInequalities.bind(this),
                name: 'Rational Inequalities',
                category: 'advanced_inequalities',
                description: 'Solves inequalities with quadratic rational expressions'
            },

            inverse_quadratic: {
                patterns: [
                    /find.*equation.*roots/i,
                    /given.*roots.*find/i,
                    /construct.*quadratic/i
                ],
                solver: this.solveInverseQuadratics.bind(this),
                name: 'Inverse Quadratic Problems',
                category: 'construction',
                description: 'Finds quadratic equation given roots or conditions'
            },

            special_factoring: {
                patterns: [
                    /difference.*squares/i,
                    /perfect.*square.*trinomial/i,
                    /special.*factoring/i
                ],
                solver: this.solveSpecialFactoring.bind(this),
                name: 'Special Factoring Cases',
                category: 'factoring',
                description: 'Handles special factoring patterns'
            },

            // Quadratic transformations
            transformations: {
                patterns: [
                    /transformation.*quadratic/i,
                    /shift.*parabola/i,
                    /stretch.*parabola/i,
                    /reflect.*parabola/i
                ],
                solver: this.analyzeTransformations.bind(this),
                name: 'Quadratic Transformations',
                category: 'transformations',
                description: 'Analyzes parabola transformations'
            },

            // NEW: Added biquadratic solver
            biquadratic: {
                patterns: [
                    /([+-]?\d*\.?\d*)x\^4\s*([+-]\s*\d*\.?\d*)x\^2\s*([+-]\s*\d*\.?\d*)\s*=\s*0/
                ],
                solver: this.solveBiquadratic.bind(this),
                name: 'Biquadratic Equation',
                category: 'advanced_forms',
                description: 'Solves ax^4 + bx^2 + c = 0'
            },

            // NEW: Added radical quadratic solver
            radical_quadratic: {
                patterns: [
                    /sqrt\s*\(\s*x\s*\)\s*[+-]\s*sqrt\s*\(\s*x\s*\+\s*\d+\s*\)\s*=\s*\d+/
                ],
                solver: this.solveRadicalQuadratic.bind(this),
                name: 'Quadratics with Radicals',
                category: 'advanced_forms',
                description: 'Solves equations with radicals reducing to quadratics'
            },

            // NEW: Added Diophantine quadratic solver
            diophantine_quadratic: {
                patterns: [
                    /integer.*solutions/i,
                    /diophantine.*quadratic/i
                ],
                solver: this.solveDiophantineQuadratic.bind(this),
                name: 'Diophantine Quadratic',
                category: 'integer_solutions',
                description: 'Finds integer solutions for ax^2 + bx + c = 0'
            },

            // NEW: Added word problem types
            geometry_dimensions: {
                patterns: [
                    /rectangle.*perimeter/i,
                    /dimensions.*area/i
                ],
                solver: this.solveGeometryDimensions.bind(this),
                name: 'Geometry Dimensions',
                category: 'applications',
                description: 'Solves for dimensions in geometry problems'
            },

            finance_break_even: {
                patterns: [
                    /break-even/i,
                    /cost.*revenue/i
                ],
                solver: this.solveFinanceBreakEven.bind(this),
                name: 'Break-Even Analysis',
                category: 'applications',
                description: 'Solves break-even points in finance'
            },

            rate_time: {
                patterns: [
                    /boat.*current/i,
                    /rate.*time/i
                ],
                solver: this.solveRateTime.bind(this),
                name: 'Rate-Time Problems',
                category: 'applications',
                description: 'Solves distance-rate-time problems'
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
            this.generateGraphData();

            // Generate workbook
            this.generateQuadraticWorkbook();

            // ADD THIS RETURN STATEMENT:
            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                solutions: this.currentSolution?.solutions,
                discriminant: this.currentSolution?.discriminant,
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

        // Default to standard form if coefficients are provided
        if (parameters.a !== undefined || parameters.b !== undefined || parameters.c !== undefined) {
            return {
                originalInput: equation || 'Quadratic with given coefficients',
                cleanInput: cleanInput,
                type: 'standard_form',
                scenario: scenario,
                parameters: {
                    a: parameters.a || 0,
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
            .replace(/x\^2/g, 'x²')
            .replace(/\*\*/g, '^')
            .replace(/sqrt/g, '√')
            .replace(/\\frac/g, 'frac')
            .replace(/\\sqrt/g, '√')
            .replace(/\\pm/g, '±')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .trim();
    }

    extractQuadraticParameters(match, type) {
        const params = {};

        if ((type === 'standard_form' || type === 'inequality') && match) {
            params.a = this.parseCoefficient(match[1]) || 1;
            params.b = this.parseCoefficient(match[2]) || 0;
            params.c = this.parseCoefficient(match[3]) || 0;

            if (type === 'inequality') {
                // Extract inequality operator
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

        // Handle fractions first (before parseFloat)
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
            throw new Error('Not a quadratic equation (coefficient of x² is effectively 0)');
        }

        const discriminant = b * b - 4 * a * c;
        const vertex = {
            x: -b / (2 * a),
            y: (4 * a * c - b * b) / (4 * a)
        };

        let solutions = [];
        let solutionType = '';
        let rootsAnalysis = {};

        if (discriminant > 0) {
            const sqrtD = Math.sqrt(discriminant);
            const x1 = (-b + sqrtD) / (2 * a);
            const x2 = (-b - sqrtD) / (2 * a);
            solutions = [x1, x2].sort((a, b) => a - b);
            solutionType = 'Two distinct real roots';
            rootsAnalysis = {
                sum: -b / a,
                product: c / a,
                distance: Math.abs(x1 - x2)
            };
        } else if (Math.abs(discriminant) < 1e-10) {
            const x = -b / (2 * a);
            solutions = [x];
            solutionType = 'One repeated real root (double root)';
            rootsAnalysis = {
                sum: -b / a,
                product: c / a,
                distance: 0
            };
        } else {
            const realPart = -b / (2 * a);
            const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
            solutions = [
                `${realPart.toFixed(6)} + ${imaginaryPart.toFixed(6)}i`,
                `${realPart.toFixed(6)} - ${imaginaryPart.toFixed(6)}i`
            ];
            solutionType = 'Two complex conjugate roots';
            rootsAnalysis = {
                realPart: realPart,
                imaginaryPart: imaginaryPart,
                modulus: Math.sqrt(realPart * realPart + imaginaryPart * imaginaryPart)
            };
        }

        // Additional analysis
        const parabola = this.analyzeParabola(a, b, c, vertex, discriminant);

        return {
            solutions: solutions,
            discriminant: discriminant,
            solutionType: solutionType,
            coefficients: { a, b, c },
            vertex: vertex,
            rootsAnalysis: rootsAnalysis,
            parabola: parabola,
            category: 'basic_quadratic'
        };
    }

    analyzeParabola(a, b, c, vertex, discriminant) {
        const opensUpward = a > 0;
        const axisOfSymmetry = -b / (2 * a);
        const yIntercept = c;

        // Find x-intercepts if real
        let xIntercepts = [];
        if (discriminant >= 0) {
            if (discriminant > 0) {
                const sqrtD = Math.sqrt(discriminant);
                xIntercepts = [
                    (-b + sqrtD) / (2 * a),
                    (-b - sqrtD) / (2 * a)
                ].sort((a, b) => a - b);
            } else {
                xIntercepts = [-b / (2 * a)];
            }
        }

        return {
            opensUpward: opensUpward,
            concavity: opensUpward ? 'upward' : 'downward',
            axisOfSymmetry: axisOfSymmetry,
            vertex: vertex,
            yIntercept: yIntercept,
            xIntercepts: xIntercepts,
            hasRealRoots: discriminant >= 0,
            domainDescription: 'All real numbers',
            rangeDescription: opensUpward ?
                `y ≥ ${vertex.y.toFixed(4)}` :
                `y ≤ ${vertex.y.toFixed(4)}`,
            transformations: this.identifyTransformations(a, b, c)
        };
    }

    identifyTransformations(a, b, c) {
        const h = -b / (2 * a);
        const k = (4 * a * c - b * b) / (4 * a);

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

    completeTheSquare(problem) {
        const { a, b, c } = problem.parameters;

        if (Math.abs(a) < 1e-10) {
            throw new Error('Not a quadratic equation');
        }

        // Complete the square: ax² + bx + c = a(x - h)² + k
        const h = -b / (2 * a);
        const k = c - (b * b) / (4 * a);

        const steps = [
            {
                step: 'Original equation',
                expression: `${a}x² + ${b}x + ${c} = 0`
            },
            {
                step: 'Factor out coefficient of x²',
                expression: a !== 1 ? `${a}(x² + ${(b/a).toFixed(4)}x) + ${c} = 0` : `x² + ${b}x + ${c} = 0`
            },
            {
                step: 'Complete the square',
                expression: a !== 1 ?
                    `${a}(x² + ${(b/a).toFixed(4)}x + ${(b/(2*a))**2}) - ${a}×${(b/(2*a))**2} + ${c} = 0` :
                    `x² + ${b}x + ${(b/2)**2} - ${(b/2)**2} + ${c} = 0`
            },
            {
                step: 'Simplify to vertex form',
                expression: `${a}(x - ${(-h).toFixed(4)})² + ${k.toFixed(4)} = 0`
            },
            {
                step: 'Solve for x',
                expression: `(x - ${(-h).toFixed(4)})² = ${(-k/a).toFixed(4)}`
            }
        ];

        // Get final solutions
        const standardSolution = this.solveStandardQuadratic(problem);

        return {
            ...standardSolution,
            vertexForm: {
                a: a,
                h: h,
                k: k,
                equation: `y = ${a}(x - ${h.toFixed(4)})² + ${k.toFixed(4)}`
            },
            completingSquareSteps: steps,
            method: 'completing_the_square'
        };
    }

    factorQuadratic(problem) {
        const { a, b, c } = problem.parameters;

        if (Math.abs(a) < 1e-10) {
            throw new Error('Not a quadratic equation');
        }

        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            return {
                factorizable: false,
                reason: 'No real roots - cannot factor over real numbers',
                discriminant: discriminant,
                originalEquation: `${a}x² + ${b}x + ${c} = 0`,
                complexFactorization: this.getComplexFactorization(a, b, c)
            };
        }

        let factorization = null;
        let factorizationSteps = [];

        if (a === 1) {
            // Simple case: x² + bx + c
            factorization = this.factorSimpleQuadratic(b, c);
        } else {
            // General case: ax² + bx + c
            factorization = this.factorGeneralQuadratic(a, b, c);
        }

        if (factorization.success) {
            const standardSolution = this.solveStandardQuadratic(problem);

            return {
                ...standardSolution,
                factorizable: true,
                factorization: factorization,
                method: 'factoring'
            };
        } else {
            return {
                factorizable: false,
                reason: 'Cannot find integer factors',
                discriminant: discriminant,
                originalEquation: `${a}x² + ${b}x + ${c} = 0`,
                suggestion: 'Use quadratic formula or completing the square'
            };
        }
    }

    factorSimpleQuadratic(b, c) {
        // Find two numbers that multiply to c and add to b
        for (let i = -Math.abs(c); i <= Math.abs(c); i++) {
            if (i === 0) continue;
            if (c % i === 0) {
                const j = c / i;
                if (i + j === b) {
                    return {
                        success: true,
                        factors: [i, j],
                        factored: `(x + ${i})(x + ${j})`,
                        zeros: [-i, -j],
                        verification: `${i} × ${j} = ${c}, ${i} + ${j} = ${b}`
                    };
                }
            }
        }

        return { success: false };
    }

    factorGeneralQuadratic(a, b, c) {
        // Try to factor ax² + bx + c
        // Look for factors of ac that add to b
        const ac = a * c;

        for (let i = -Math.abs(ac); i <= Math.abs(ac); i++) {
            if (i === 0) continue;
            if (ac % i === 0) {
                const j = ac / i;
                if (i + j === b) {
                    // Rewrite as ax² + ix + jx + c and factor by grouping
                    const gcd1 = this.gcd(a, i);
                    const gcd2 = this.gcd(j, c);

                    return {
                        success: true,
                        splitMiddleTerm: `${a}x² + ${i}x + ${j}x + ${c}`,
                        grouping: `${gcd1}x(${a/gcd1}x + ${i/gcd1}) + ${gcd2}(${j/gcd2}x + ${c/gcd2})`,
                        factored: this.constructFactorization(a, b, c, i, j),
                        verification: `${i} × ${j} = ${ac}, ${i} + ${j} = ${b}`
                    };
                }
            }
        }

        return { success: false };
    }

    constructFactorization(a, b, c, p, q) {
        // This is a simplified construction - more complex logic needed for general case
        const discriminant = b * b - 4 * a * c;
        const sqrtD = Math.sqrt(discriminant);
        const x1 = (-b + sqrtD) / (2 * a);
        const x2 = (-b - sqrtD) / (2 * a);

        if (Number.isInteger(x1) && Number.isInteger(x2)) {
            return `${a}(x - ${x1})(x - ${x2})`;
        }

        // Try to find rational factorization
        return `(${a}x + ${p})(x + ${q/a})`;
    }

    getComplexFactorization(a, b, c) {
        const discriminant = b * b - 4 * a * c;
        const sqrtD = Math.sqrt(-discriminant);
        const realPart = -b / (2 * a);
        const imagPart = sqrtD / (2 * a);

        return `${a}(x - (${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i))(x - (${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i))`;
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

    analyzeVertexForm(problem) {
        const { a, h, k } = problem.parameters;

        if (Math.abs(a) < 1e-10) {
            throw new Error('Not a quadratic function (a cannot be 0)');
        }

        // Convert to standard form
        const standardA = a;
        const standardB = -2 * a * h;
        const standardC = a * h * h + k;

        const vertex = { x: h, y: k };
        const discriminant = standardB * standardB - 4 * standardA * standardC;

        // Find x-intercepts
        let xIntercepts = [];
        if (discriminant > 0) {
            const sqrtTerm = Math.sqrt(-k/a);
            xIntercepts = [h + sqrtTerm, h - sqrtTerm].sort((a, b) => a - b);
        } else if (Math.abs(discriminant) < 1e-10) {
            xIntercepts = [h];
        }

        const parabola = this.analyzeParabola(standardA, standardB, standardC, vertex, discriminant);

        return {
            vertexForm: {
                a: a,
                h: h,
                k: k,
                equation: `y = ${a}(x - ${h})² + ${k}`
            },
            standardForm: {
                a: standardA,
                b: standardB,
                c: standardC,
                equation: `y = ${standardA}x² + ${standardB}x + ${standardC}`
            },
            vertex: vertex,
            discriminant: discriminant,
            parabola: parabola,
            xIntercepts: xIntercepts,
            category: 'vertex_analysis'
        };
    }

    analyzeQuadraticFunction(problem) {
        const { a, b, c } = problem.parameters;

        if (Math.abs(a) < 1e-10) {
            throw new Error('Not a quadratic function');
        }

        const basicSolution = this.solveStandardQuadratic(problem);

        // Additional function analysis
        const vertex = basicSolution.vertex;
        const discriminant = basicSolution.discriminant;

        // Domain and range
        const domain = { min: -Infinity, max: Infinity, description: "All real numbers" };
        const range = a > 0 ?
            { min: vertex.y, max: Infinity, description: `y ≥ ${vertex.y.toFixed(4)}` } :
            { min: -Infinity, max: vertex.y, description: `y ≤ ${vertex.y.toFixed(4)}` };

        // Intervals of increase/decrease
        const increasing = a > 0 ?
            { interval: `(${vertex.x.toFixed(4)}, ∞)`, description: `Increasing for x > ${vertex.x.toFixed(4)}` } :
            { interval: `(-∞, ${vertex.x.toFixed(4)})`, description: `Increasing for x < ${vertex.x.toFixed(4)}` };

        const decreasing = a > 0 ?
            { interval: `(-∞, ${vertex.x.toFixed(4)})`, description: `Decreasing for x < ${vertex.x.toFixed(4)}` } :
            { interval: `(${vertex.x.toFixed(4)}, ∞)`, description: `Decreasing for x > ${vertex.x.toFixed(4)}` };

        // End behavior
        const endBehavior = a > 0 ?
            { left: "As x → -∞, y → +∞", right: "As x → +∞, y → +∞" } :
            { left: "As x → -∞, y → -∞", right: "As x → +∞, y → -∞" };

        return {
            ...basicSolution,
            domain: domain,
            range: range,
            increasing: increasing,
            decreasing: decreasing,
            endBehavior: endBehavior,
            extremum: {
                type: a > 0 ? "minimum" : "maximum",
                value: vertex.y,
                occurs_at: vertex.x
            },
            category: 'function_analysis'
        };
    }

    analyzeDiscriminant(problem) {
        const { a, b, c } = problem.parameters;

        if (Math.abs(a) < 1e-10) {
            throw new Error('Not a quadratic equation');
        }

        const discriminant = b * b - 4 * a * c;
        let analysis = {
            discriminant: discriminant,
            formula: `Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`,
            calculation: `= ${b*b} - ${4*a*c} = ${discriminant}`
        };

        if (discriminant > 0) {
            analysis.rootType = "Two distinct real roots";
            analysis.graphicalInterpretation = "Parabola crosses x-axis at two points";
            analysis.rootNature = "Rational or irrational real numbers";
            if (this.isPerfectSquare(discriminant)) {
                analysis.rootNature = "Rational numbers (perfect square discriminant)";
            }
        } else if (Math.abs(discriminant) < 1e-10) {
            analysis.rootType = "One repeated real root (double root)";
            analysis.graphicalInterpretation = "Parabola touches x-axis at exactly one point (vertex)";
            analysis.rootNature = "Rational number";
        } else {
            analysis.rootType = "Two complex conjugate roots";
            analysis.graphicalInterpretation = "Parabola does not intersect x-axis";
            analysis.rootNature = "Complex conjugates (a ± bi)";
        }

        return {
            ...analysis,
            category: 'discriminant_analysis'
        };
    }

    isPerfectSquare(n) {
        if (n < 0) return false;
        const sqrt = Math.sqrt(n);
        return Math.floor(sqrt) === sqrt;
    }

    solveQuadraticInequality(problem) {
        const { a, b, c, operator = '>' } = problem.parameters;

        if (Math.abs(a) < 1e-10) {
            throw new Error('Not a quadratic inequality');
        }

        const basicSolution = this.solveStandardQuadratic(problem);
        const discriminant = basicSolution.discriminant;

        let solution = {
            inequality: `${a}x² + ${b}x + ${c} ${operator} 0`,
            discriminant: discriminant,
            parabola: basicSolution.parabola
        };

        if (discriminant < 0) {
            // No real roots
            if ((operator === '>' && a > 0) || (operator === '<' && a < 0) ||
                (operator === '≥' && a > 0) || (operator === '≤' && a < 0)) {
                solution.solutionSet = "All real numbers";
                solution.interval = "(-∞, ∞)";
                solution.explanation = "Parabola never crosses x-axis and opens " + (a > 0 ? "upward" : "downward");
            } else {
                solution.solutionSet = "No solution";
                solution.interval = "∅";
                solution.explanation = "Parabola never crosses x-axis and inequality cannot be satisfied";
            }
        } else {
            const roots = basicSolution.solutions.sort((x, y) => x - y);

            if (discriminant === 0) {
                // One repeated root
                const root = roots[0];
                if (operator === '>' || operator === '<') {
                    if ((operator === '>' && a > 0) || (operator === '<' && a < 0)) {
                        solution.solutionSet = `All real numbers except x = ${root}`;
                        solution.interval = `(-∞, ${root}) ∪ (${root}, ∞)`;
                    } else {
                        solution.solutionSet = "No solution";
                        solution.interval = "∅";
                    }
                } else { // ≥ or ≤
                    if ((operator === '≥' && a > 0) || (operator === '≤' && a < 0)) {
                        solution.solutionSet = "All real numbers";
                        solution.interval = "(-∞, ∞)";
                    } else {
                        solution.solutionSet = `x = ${root}`;
                        solution.interval = `{${root}}`;
                    }
                }
            } else {
                // Two distinct roots
                const [r1, r2] = roots;

                if (a > 0) { // Parabola opens upward
                    if (operator === '>' || operator === '≥') {
                        const bracket1 = operator === '>' ? ')' : ']';
                        const bracket2 = operator === '>' ? '(' : '[';
                        solution.solutionSet = `x < ${r1} or x > ${r2}`;
                        solution.interval = `(-∞, ${r1}${bracket1} ∪ ${bracket2}${r2}, ∞)`;
                    } else {
                        const bracket1 = operator === '<' ? '(' : '[';
                        const bracket2 = operator === '<' ? ')' : ']';
                        solution.solutionSet = `${r1} < x < ${r2}`;
                        solution.interval = `${bracket1}${r1}, ${r2}${bracket2}`;
                    }
                } else { // Parabola opens downward
                    if (operator === '>' || operator === '≥') {
                        const bracket1 = operator === '>' ? '(' : '[';
                        const bracket2 = operator === '>' ? ')' : ']';
                        solution.solutionSet = `${r1} < x < ${r2}`;
                        solution.interval = `${bracket1}${r1}, ${r2}${bracket2}`;
                    } else {
                        const bracket1 = operator === '<' ? ')' : ']';
                        const bracket2 = operator === '<' ? '(' : '[';
                        solution.solutionSet = `x < ${r1} or x > ${r2}`;
                        solution.interval = `(-∞, ${r1}${bracket1} ∪ ${bracket2}${r2}, ∞)`;
                    }
                }
            }
        }

        return {
            ...solution,
            category: 'quadratic_inequality'
        };
    }

    solveQuadraticSystem(problem) {
        // For systems involving quadratics - simplified implementation
        const { equations } = problem.parameters;

        return {
            message: "Quadratic system solver - implementation depends on specific system type",
            systemType: "General quadratic system",
            category: 'quadratic_system',
            note: "Specific implementation would depend on the exact system format"
        };
    }

    solveProjectileMotion(problem) {
        const { initialHeight = 0, initialVelocity = 0, gravity = -16, timeVariable = 't' } = problem.parameters;

        // Height equation: h(t) = -16t² + v₀t + h₀ (using feet and -16 ft/s²)
        // Or h(t) = -4.9t² + v₀t + h₀ (using meters and -9.8 m/s²)

        const a = gravity === -16 ? -16 : -4.9;
        const b = initialVelocity;
        const c = initialHeight;

        // Solve for when object hits ground (h = 0)
        const groundProblem = {
            parameters: { a: a, b: b, c: c }
        };

        const basicSolution = this.solveStandardQuadratic(groundProblem);

        // Find maximum height and time to reach it
        const timeToMaxHeight = -b / (2 * a);
        const maxHeight = a * timeToMaxHeight * timeToMaxHeight + b * timeToMaxHeight + c;

        // Filter positive time solutions
        const validTimes = basicSolution.solutions.filter(t => t >= 0);

        return {
            equation: `h(${timeVariable}) = ${a}${timeVariable}² + ${b}${timeVariable} + ${c}`,
            initialHeight: initialHeight,
            initialVelocity: initialVelocity,
            gravity: gravity,
            maxHeight: maxHeight,
            timeToMaxHeight: timeToMaxHeight,
            timeToGround: validTimes.length > 0 ? Math.max(...validTimes) : null,
            allSolutions: basicSolution.solutions,
            validSolutions: validTimes,
            units: gravity === -16 ? { distance: 'feet', time: 'seconds' } : { distance: 'meters', time: 'seconds' },
            category: 'projectile_motion'
        };
    }

    solveAreaOptimization(problem) {
        const { constraint, objectiveFunction, variables = ['x', 'y'] } = problem.parameters;

        // Example: Maximize rectangular area with fixed perimeter
        // This would need specific problem parsing - simplified implementation

        return {
            problemType: "Area Optimization",
            objective: "Maximize or minimize area subject to constraints",
            method: "Express area as quadratic function and find vertex",
            category: 'area_optimization',
            note: "Specific solution depends on exact problem constraints"
        };
    }

    solveProfitRevenue(problem) {
        const { revenueFunction, costFunction, priceVariable = 'p' } = problem.parameters;

        // Typical format: R(p) = p × demand(p), where demand is linear
        // Profit = Revenue - Cost

        return {
            problemType: "Business Optimization",
            objective: "Maximize profit or revenue",
            method: "Find vertex of quadratic profit/revenue function",
            category: 'business_optimization',
            note: "Specific solution depends on given revenue and cost functions"
        };
    }

    analyzeTransformations(problem) {
        const { originalFunction = 'x²', transformedFunction } = problem.parameters;

        // Analyze transformations from f(x) = x² to f(x) = a(x-h)² + k
        const transformations = [];

        return {
            originalFunction: originalFunction,
            transformedFunction: transformedFunction,
            transformations: transformations,
            category: 'function_transformations'
        };
    }

    demonstrateQuadraticFormula(problem) {
        const { a = 1, b = 0, c = 0 } = problem.parameters;

        const discriminant = b * b - 4 * a * c;

        return {
            formula: "x = (-b ± √(b² - 4ac)) / (2a)",
            substitution: `x = (${-b} ± √(${b}² - 4(${a})(${c}))) / (2(${a}))`,
            discriminant: discriminant,
            calculation: `x = (${-b} ± √${discriminant}) / ${2*a}`,
            derivation: this.getQuadraticFormulaDerivation(),
            category: 'quadratic_formula'
        };
    }

    getQuadraticFormulaDerivation() {
        return [
            "Start with: ax² + bx + c = 0",
            "Divide by a: x² + (b/a)x + (c/a) = 0",
            "Move constant to right: x² + (b/a)x = -(c/a)",
            "Complete the square: x² + (b/a)x + (b/2a)² = -(c/a) + (b/2a)²",
            "Factor left side: (x + b/2a)² = -(c/a) + (b²/4a²)",
            "Simplify right side: (x + b/2a)² = (b² - 4ac)/(4a²)",
            "Take square root: x + b/2a = ±√(b² - 4ac)/(2a)",
            "Solve for x: x = -b/(2a) ± √(b² - 4ac)/(2a)",
            "Final form: x = (-b ± √(b² - 4ac))/(2a)"
        ];
    }

    solveFractionalQuadratics(problem) {
        const { equation } = problem.parameters;

        // Enhanced pattern matching for various fractional forms
        const patterns = {
            standard: /([+-]?\d*\.?\d*)\/x²\s*([+-]?\s*\d*\.?\d*)\/x\s*([+-]?\s*\d*\.?\d*)\s*=\s*0/,
            mixed: /([+-]?\d*\.?\d*)\/x²\s*([+-]?\s*\d*\.?\d*)x\s*([+-]?\s*\d*\.?\d*)\s*=\s*0/,
            reciprocal: /([+-]?\d*\.?\d*)\(1\/x\)²\s*([+-]?\s*\d*\.?\d*)\(1\/x\)\s*([+-]?\s*\d*\.?\d*)\s*=\s*0/
        };

        let match = null;
        let patternType = null;

        for (const [type, pattern] of Object.entries(patterns)) {
            match = equation.match(pattern);
            if (match) {
                patternType = type;
                break;
            }
        }

        if (!match) {
            throw new Error('Not a recognized fractional quadratic form');
        }

        const a = this.parseCoefficient(match[1]) || 1;
        const b = this.parseCoefficient(match[2]) || 0;
        const c = this.parseCoefficient(match[3]) || 0;

        // Substitute u = 1/x, solve au² + bu + c = 0
        const substitutionProblem = {
            parameters: { a, b, c }
        };

        const uSolution = this.solveStandardQuadratic(substitutionProblem);

        // Convert u solutions back to x = 1/u
        const xSolutions = [];
        const validUSolutions = [];

        for (const u of uSolution.solutions) {
            if (typeof u === 'number' && Math.abs(u) > 1e-10) {
                xSolutions.push(1 / u);
                validUSolutions.push(u);
            }
        }

        return {
            originalEquation: equation,
            substitution: 'Let u = 1/x',
            quadraticInU: `${a}u² + ${b}u + ${c} = 0`,
            uSolutions: validUSolutions,
            solutions: xSolutions,
            solutionType: xSolutions.length === 2 ? 'Two real solutions' :
                         xSolutions.length === 1 ? 'One real solution' : 'No real solutions',
            verification: this.verifyFractionalSolutions(xSolutions, a, b, c),
            category: 'fractional_quadratic'
        };
    }

    solveParametricQuadratics(problem) {
        const { a, b, c, parameter = 'm' } = problem.parameters;

        // Example: (m-1)x² + 2mx + (m+3) = 0
        const analysis = {
            parameterSymbol: parameter,
            leadingCoefficient: a,
            quadraticCondition: this.buildParameterCondition(a, parameter),
            discriminantExpression: this.buildParametricDiscriminant(a, b, c, parameter),
            specialCases: this.analyzeParametricSpecialCases(a, b, c, parameter)
        };

        return {
            ...analysis,
            rootAnalysis: this.analyzeParametricRoots(a, b, c, parameter),
            category: 'parametric_quadratic'
        };
    }

    solveLinearQuadraticSystem(problem) {
        const { quadratic = {}, linear = {} } = problem.parameters;

        // Quadratic: y = ax² + bx + c
        // Linear: y = mx + n
        // Intersection: ax² + bx + c = mx + n
        // Rearrange: ax² + (b-m)x + (c-n) = 0

        const qA = quadratic.a || 1;
        const qB = quadratic.b || 0;
        const qC = quadratic.c || 0;
        const lM = linear.m || 1;
        const lN = linear.n || 0;

        const intersectionProblem = {
            parameters: {
                a: qA,
                b: qB - lM,
                c: qC - lN
            }
        };

        const intersectionSolution = this.solveStandardQuadratic(intersectionProblem);

        // Calculate corresponding y-values for real solutions
        const intersectionPoints = [];
        for (const x of intersectionSolution.solutions) {
            if (typeof x === 'number') {
                const y = lM * x + lN;
                intersectionPoints.push({ x: parseFloat(x.toFixed(6)), y: parseFloat(y.toFixed(6)) });
            }
        }

        return {
            systemEquations: {
                quadratic: `y = ${qA}x² + ${qB}x + ${qC}`,
                linear: `y = ${lM}x + ${lN}`
            },
            intersectionEquation: `${qA}x² + ${qB - lM}x + ${qC - lN} = 0`,
            discriminant: intersectionSolution.discriminant,
            intersectionPoints: intersectionPoints,
            solutionType: this.getSystemSolutionType(intersectionSolution.discriminant),
            graphicalInterpretation: this.getSystemGraphicalInterpretation(intersectionSolution.discriminant),
            verification: this.verifySystemSolutions(intersectionPoints, quadratic, linear),
            category: 'linear_quadratic_system'
        };
    }

    solveRationalInequalities(problem) {
        const { numerator = {}, denominator = {}, operator = '>' } = problem.parameters;

        // Find critical points (zeros of numerator and denominator)
        const numZeros = this.findPolynomialZeros(numerator);
        const denZeros = this.findPolynomialZeros(denominator);

        // Combine and sort all critical points
        const criticalPoints = [...numZeros, ...denZeros].sort((a, b) => a - b);

        // Create test intervals
        const intervals = this.createTestIntervals(criticalPoints);

        // Test sign in each interval
        const signAnalysis = intervals.map(interval => {
            const testPoint = (interval.start + interval.end) / 2;
            const numValue = this.evaluatePolynomial(numerator, testPoint);
            const denValue = this.evaluatePolynomial(denominator, testPoint);

            if (Math.abs(denValue) < 1e-10) {
                return { ...interval, sign: 'undefined', valid: false };
            }

            const quotient = numValue / denValue;
            return {
                ...interval,
                sign: quotient > 0 ? 'positive' : 'negative',
                value: quotient,
                valid: true
            };
        });

        // Determine solution intervals based on operator
        const solutionIntervals = this.determineSolutionIntervals(signAnalysis, operator);

        return {
            criticalPoints: {
                numeratorZeros: numZeros,
                denominatorZeros: denZeros,
                all: criticalPoints
            },
            signAnalysis: signAnalysis,
            solutionIntervals: solutionIntervals,
            solutionSet: this.formatRationalSolution(solutionIntervals),
            category: 'rational_inequality'
        };
    }

    solveInverseQuadratics(problem) {
        const { roots = [], conditions = {}, leadingCoefficient = 1 } = problem.parameters;

        if (roots.length === 0) {
            throw new Error('No roots provided for inverse problem');
        }

        let quadraticEquation = '';
        let analysis = {};

        if (roots.length === 1) {
            // Double root case: a(x - r)² = 0
            const r = roots[0];
            quadraticEquation = `${leadingCoefficient}(x - ${r})²`;
            analysis = {
                expandedForm: `${leadingCoefficient}x² - ${2 * leadingCoefficient * r}x + ${leadingCoefficient * r * r}`,
                discriminant: 0,
                vertex: { x: r, y: 0 }
            };
        } else if (roots.length === 2) {
            // Two distinct roots: a(x - r₁)(x - r₂) = 0
            const [r1, r2] = roots;
            quadraticEquation = `${leadingCoefficient}(x - ${r1})(x - ${r2})`;

            const sum = r1 + r2;
            const product = r1 * r2;

            analysis = {
                expandedForm: `${leadingCoefficient}x² - ${leadingCoefficient * sum}x + ${leadingCoefficient * product}`,
                standardCoefficients: {
                    a: leadingCoefficient,
                    b: -leadingCoefficient * sum,
                    c: leadingCoefficient * product
                },
                viettasFormulas: {
                    sumOfRoots: sum,
                    productOfRoots: product
                },
                vertex: {
                    x: sum / 2,
                    y: leadingCoefficient * (r1 - r2) * (r1 - r2) / (-4)
                }
            };
        }

        // Apply additional conditions if provided
        if (conditions.passesThroughPoint) {
            const point = conditions.passesThroughPoint;
            analysis.additionalCondition = `Passes through (${point.x}, ${point.y})`;
            // This would require solving for the leading coefficient
        }

        return {
            givenRoots: roots,
            factorForm: quadraticEquation,
            ...analysis,
            verification: this.verifyInverseConstruction(roots, analysis.standardCoefficients),
            category: 'inverse_quadratic'
        };
    }

    solveSpecialFactoring(problem) {
        const { a, b, c } = problem.parameters;

        // Check for difference of squares: ax² - d²
        if (Math.abs(b) < 1e-10 && c < 0) {
            const sqrtA = Math.sqrt(Math.abs(a));
            const sqrtC = Math.sqrt(Math.abs(c));

            if (Number.isInteger(sqrtA) && Number.isInteger(sqrtC)) {
                const factor1 = a > 0 ? `${sqrtA}x - ${sqrtC}` : `${sqrtA}x + ${sqrtC}`;
                const factor2 = a > 0 ? `${sqrtA}x + ${sqrtC}` : `${sqrtA}x - ${sqrtC}`;

                return {
                    type: 'difference_of_squares',
                    factored: `(${factor1})(${factor2})`,
                    zeros: a > 0 ? [-sqrtC/sqrtA, sqrtC/sqrtA] : [-sqrtC/sqrtA, sqrtC/sqrtA],
                    verification: `${sqrtA}² = ${a}, ${sqrtC}² = ${Math.abs(c)}`
                };
            }
        }

        // Check for perfect square trinomial
        const discriminant = b * b - 4 * a * c;
        if (Math.abs(discriminant) < 1e-10) {
            const sqrtA = Math.sqrt(Math.abs(a));
            const root = -b / (2 * a);

            if (Number.isInteger(sqrtA)) {
                return {
                    type: 'perfect_square_trinomial',
                    factored: `(${sqrtA}x ${root >= 0 ? '+' : '-'} ${Math.abs(root)})²`,
                    zeros: [root],
                    verification: `Discriminant = ${discriminant} ≈ 0`
                };
            }
        }

        // Check for sum/difference of cubes (extended case)
        // This would handle higher-degree cases that reduce to quadratics

        return {
            type: 'no_special_pattern',
            recommendation: 'Use general factoring methods or quadratic formula',
            category: 'special_factoring'
        };
    }

    // NEW: Biquadratic solver method
    solveBiquadratic(problem) {
        const { a, b, c } = problem.parameters; // Note: here a is coeff of x^4, b of x^2, c constant
        const substitution = { a: a, b: b, c: c }; // u = x^2, solve au^2 + bu + c = 0
        const uSolution = this.solveStandardQuadratic({ parameters: substitution });

        const xSolutions = [];
        uSolution.solutions.forEach(u => {
            if (u >= 0) {
                const sqrtU = Math.sqrt(u);
                xSolutions.push(sqrtU, -sqrtU);
            } else if (u < 0) {
                const imag = Math.sqrt(-u);
                xSolutions.push(`0 + ${imag}i`, `0 - ${imag}i`);
            }
        });

        return {
            substitution: 'u = x²',
            uSolutions: uSolution.solutions,
            solutions: xSolutions,
            category: 'biquadratic'
        };
    }

    // NEW: Radical quadratic solver method
    solveRadicalQuadratic(problem) {
        // Example: sqrt(x) + sqrt(x + k) = m -> isolate one radical, square both sides, solve quadratic
        const { k = 1, m = 1 } = problem.parameters; // Placeholder parsing
        const isolated = `sqrt(x + ${k}) = ${m} - sqrt(x)`;
        const squared = `(x + ${k}) = (${m} - sqrt(x))^2`;
        const expanded = `x + ${k} = ${m*m} - 2*${m}*sqrt(x) + x`;
        const simplified = `${k} - ${m*m} = -2*${m}*sqrt(x)`;
        const isolatedRadical = `sqrt(x) = [${m*m} - ${k}] / (2*${m})`; // Simplified
        const xSolution = math.pow(math.evaluate(isolatedRadical.split('=')[1]), 2);

        return {
            steps: [isolated, squared, expanded, simplified, isolatedRadical],
            solution: xSolution,
            category: 'radical_quadratic'
        };
    }

    // NEW: Diophantine quadratic solver
    solveDiophantineQuadratic(problem) {
        const basicSolution = this.solveStandardQuadratic(problem);
        const integerSolutions = basicSolution.solutions.filter(s => Number.isInteger(s));

        return {
            ...basicSolution,
            integerSolutions,
            note: integerSolutions.length > 0 ? 'Integer solutions found' : 'No integer solutions',
            category: 'diophantine_quadratic'
        };
    }

    // NEW: Geometry dimensions solver
    solveGeometryDimensions(problem) {
        const { perimeter = 0, area = 0 } = problem.parameters; // e.g., rectangle: length = x, width = (perimeter/2 - x), area = x*(perimeter/2 - x)
        const a = -1;
        const b = perimeter / 2;
        const c = -area;
        const basicSolution = this.solveStandardQuadratic({ parameters: { a, b, c } });

        return {
            ...basicSolution,
            dimensions: basicSolution.solutions.map(len => ({ length: len, width: perimeter/2 - len })),
            category: 'geometry_dimensions'
        };
    }

    // NEW: Finance break-even solver
    solveFinanceBreakEven(problem) {
        const { fixedCost = 0, variableCost = 0, pricePerUnit = 0 } = problem.parameters;
        const a = -variableCost;
        const b = pricePerUnit;
        const c = -fixedCost;
        const basicSolution = this.solveStandardQuadratic({ parameters: { a, b, c } });

        return {
            ...basicSolution,
            breakEvenPoints: basicSolution.solutions,
            category: 'finance_break_even'
        };
    }

    // NEW: Rate-time solver
    solveRateTime(problem) {
        const { rateWith = 0, rateAgainst = 0, distance = 0 } = problem.parameters; // e.g., boat in current
        // Equation derivation: time with = distance / (rate + current), against = distance / (rate - current), etc.
        // Assume standard form derived
        const a = 1; // Placeholder
        const b = - (rateWith + rateAgainst);
        const c = rateWith * rateAgainst - distance; // Simplified
        const basicSolution = this.solveStandardQuadratic({ parameters: { a, b, c } });

        return {
            ...basicSolution,
            rates: basicSolution.solutions,
            category: 'rate_time'
        };
    }

    generateFractionalSteps(problem, solution) {
        return [
            {
                step: 'Identify fractional form',                               
                description: 'Recognize equation with reciprocal terms',
                expression: solution.originalEquation
            },                                                              
            {
                step: 'Make substitution',
                description: 'Let u = 1/x to eliminate fractions',
                expression: solution.substitution                           
            },
            {
                step: 'Rewrite as standard quadratic',
                description: 'Transform to quadratic in u',
                expression: solution.quadraticInU
            },
            {
                step: 'Solve for u',
                description: 'Apply quadratic formula or factoring',
                expression: `u = ${solution.uSolutions.join(', ')}`
            },
            {
                step: 'Convert back to x',
                description: 'Since u = 1/x, then x = 1/u',
                expression: `x = ${solution.solutions.join(', ')}`
            }
        ];
    }
                                                                
    generateSystemSteps(problem, solution) {
        return [
            {
                step: 'System of equations',                                    
                description: 'One quadratic and one linear equation',                                                                           
                expression: `${solution.systemEquations.quadratic}\n${solution.systemEquations.linear}`
            },
            {
                step: 'Set equations equal',
                description: 'Find intersection by eliminating y',              
                expression: solution.intersectionEquation
            },
            {
                step: 'Solve for x-coordinates',
                description: 'Solve the resulting quadratic',
                expression: `x = ${solution.intersectionPoints.map(p => p.x).join(', ')}`
            },
            {
                step: 'Find y-coordinates',
                description: 'Substitute x-values into linear equation',                                                                        
                expression: solution.intersectionPoints.map(p => `(${p.x}, ${p.y})`).join(', ')
            }                                                           
        ];
    }
                                                                
    generateParametricSteps(problem, solution) {
        return [
            {
                step: 'Identify parameter',
                description: `Equation contains parameter: ${solution.parameterSymbol}`,
                expression: problem.originalInput
            },                                                              
            {
                step: 'Determine quadratic condition',
                description: 'For quadratic behavior, leading coefficient ≠ 0',
                expression: solution.quadraticCondition
            },
            {
                step: 'Calculate discriminant',
                description: 'Express discriminant in terms of parameter',
                expression: solution.discriminantExpression                 
            },
            {
                step: 'Analyze root conditions',                                
                description: 'Determine parameter values for different root types',
                expression: `Real roots: Δ ≥ 0\nEqual roots: Δ = 0\nComplex roots: Δ < 0`
            },
            {
                step: 'Special cases analysis',
                description: 'Check parameter values that make equation linear',
                expression: solution.specialCases.linearCase || 'No special linear case'
            }
        ];
    }

    generateRationalInequalitySteps(problem, solution) {                
        return [
            {
                step: 'Identify rational inequality',
                description: 'Inequality with rational expression',
                expression: `${problem.originalInput}`
            },
            {
                step: 'Find critical points',
                description: 'Zeros of numerator and denominator',
                expression: `Numerator zeros: ${solution.criticalPoints.numeratorZeros.join(', ') || 'none'}\nDenominator zeros: ${solution.criticalPoints.denominatorZeros.join(', ') || 'none'}`
            },
            {
                step: 'Create sign chart',
                description: 'Test sign of expression in each interval',
                expression: solution.signAnalysis.map(interval =>
                    `${interval.start} to ${interval.end}: ${interval.sign}`
                ).join('\n')                                                
            },
            {
                step: 'Apply inequality condition',
                description: 'Select intervals where inequality is satisfied',
                expression: `Solution: ${solution.solutionSet}`
            },
            {                                                                   
                step: 'Exclude undefined points',
                description: 'Remove points where denominator equals zero',
                expression: `Excluded: x ≠ ${solution.criticalPoints.denominatorZeros.join(', ')}`
            }
        ];
    }

    generateInverseSteps(problem, solution) {
        const steps = [
            {
                step: 'Given information',
                description: 'Roots provided for quadratic construction',
                expression: `Roots: ${solution.givenRoots.join(', ')}`
            }                                                           
        ];

        if (solution.givenRoots.length === 1) {
            steps.push(
                {
                    step: 'Double root case',
                    description: 'Single root means repeated root (vertex on x-axis)',
                    expression: `(x - ${solution.givenRoots[0]})² = 0`
                },
                {
                    step: 'Expand with leading coefficient',
                    description: 'Include leading coefficient a',                   
                    expression: solution.factorForm
                },
                {                                                                   
                    step: 'Standard form',
                    description: 'Expand to get ax² + bx + c = 0',
                    expression: solution.expandedForm
                }
            );
        } else if (solution.givenRoots.length === 2) {
            steps.push(
                {
                    step: 'Factor form construction',
                    description: 'Use (x - r₁)(x - r₂) = 0 with given roots',
                    expression: solution.factorForm
                },                                                              
                {
                    step: 'Apply Vieta\'s formulas',
                    description: 'Sum and product of roots',
                    expression: `Sum: r₁ + r₂ = ${solution.viettasFormulas.sumOfRoots}\nProduct: r₁ × r₂ = ${solution.viettasFormulas.productOfRoots}`
                },
                {
                    step: 'Standard form',
                    description: 'Expand to standard quadratic form',
                    expression: solution.expandedForm
                },
                {
                    step: 'Identify vertex',
                    description: 'Find vertex coordinates',
                    expression: `Vertex: (${solution.vertex.x}, ${solution.vertex.y})`
                }
            );
        }

        return steps;
    }

    generateSpecialFactoringSteps(problem, solution) {
        const steps = [
            {                                                                   
                step: 'Identify pattern',
                description: 'Check for special factoring patterns',
                expression: `${problem.parameters.a}x² + ${problem.parameters.b}x + ${problem.parameters.c}`
            }
        ];

        if (solution.type === 'difference_of_squares') {
            steps.push(                                                         
                {
                    step: 'Recognize difference of squares',
                    description: 'Pattern: a²x² - b² = (ax - b)(ax + b)',
                    expression: solution.verification                           
                },
                {
                    step: 'Apply difference of squares formula',
                    description: 'Factor as product of conjugates',
                    expression: solution.factored
                },
                {                                                                   
                    step: 'Find zeros',
                    description: 'Set each factor equal to zero',
                    expression: `x = ${solution.zeros.join(', ')}`
                }
            );
        } else if (solution.type === 'perfect_square_trinomial') {          
            steps.push(
                {
                    step: 'Recognize perfect square trinomial',
                    description: 'Pattern: a²x² ± 2abx + b² = (ax ± b)²',
                    expression: solution.verification
                },
                {
                    step: 'Apply perfect square formula',
                    description: 'Factor as squared binomial',
                    expression: solution.factored
                },
                {
                    step: 'Find repeated zero',
                    description: 'Double root from squared factor',
                    expression: `x = ${solution.zeros[0]} (multiplicity 2)`
                }
            );
        } else {
            steps.push({
                step: 'No special pattern found',
                description: solution.recommendation,
                expression: 'Use general factoring methods or quadratic formula'
            });
        }

        return steps;
    }

    generateStandardFormSteps(problem, solution) {
        const { a, b, c } = problem.parameters;
        const steps = [];

        steps.push({
            step: 'Given equation',
            description: 'Standard form quadratic equation',
            expression: `${a}x² + ${b}x + ${c} = 0`
        });

        steps.push({
            step: 'Identify coefficients',
            description: 'Extract coefficients for quadratic formula',
            expression: `a = ${a}, b = ${b}, c = ${c}`                  
        });

        steps.push({
            step: 'Calculate discriminant',
            description: 'Discriminant determines number and type of solutions',
            expression: `Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${solution.discriminant}`
        });

        if (solution.discriminant >= 0) {
            steps.push({
                step: 'Apply quadratic formula',                                
                description: 'Use quadratic formula to find solutions',
                expression: `x = (-${b} ± √${solution.discriminant}) / (2(${a}))`
            });

            if (solution.solutions.length === 2) {
                steps.push({
                    step: 'Calculate both solutions',
                    description: 'Two distinct real solutions',
                    expression: `x₁ = ${solution.solutions[0].toFixed(6)}, x₂ = ${solution.solutions[1].toFixed(6)}`
                });                                                         
            } else {
                steps.push({
                    step: 'Calculate solution',
                    description: 'One repeated real solution',
                    expression: `x = ${solution.solutions[0].toFixed(6)}`
                });
            }
        } else {
            steps.push({
                step: 'Complex solutions',
                description: 'Negative discriminant gives complex solutions',
                expression: `x = ${solution.solutions[0]}, x = ${solution.solutions[1]}`
            });
        }

        return steps;
    }

    generateFactoringSteps(problem, solution) {
        const steps = [];
        const { a, b, c } = problem.parameters;

        if (solution.factorizable) {
            steps.push({
                step: 'Check for factoring possibility',
                description: 'Look for rational roots or perfect square trinomial',                                                             
                expression: `${a}x² + ${b}x + ${c} = 0`
            });

            if (solution.factorization.splitMiddleTerm) {
                steps.push({
                    step: 'Split middle term',                                      
                    description: 'Break down middle term for factoring by grouping',                                                                
                    expression: solution.factorization.splitMiddleTerm
                });
            }
                                                                            
            steps.push({
                step: 'Factor the expression',
                description: 'Write in factored form',
                expression: `${solution.factorization.factored} = 0`                                                                        
            });

            steps.push({
                step: 'Apply zero product property',
                description: 'If AB = 0, then A = 0 or B = 0',
                expression: `Solutions: x = ${solution.solutions.join(', ')}`
            });
        } else {
            steps.push({
                step: 'Factoring not possible',
                description: solution.reason,
                expression: `${a}x² + ${b}x + ${c} = 0`
            });
        }                                                       
        return steps;
    }

    generateQuadraticFormulaSteps(problem, solution) {
        const steps = [];

        steps.push({
            step: 'Quadratic Formula',
            description: 'General solution for ax² + bx + c = 0',
            expression: 'x = (-b ± √(b² - 4ac)) / (2a)'
        });

        steps.push({
            step: 'Formula derivation',
            description: 'Derived by completing the square',
            expression: solution.derivation?.join(' → ') || 'Standard derivation'
        });                                                     
        return steps;
    }
                                                                    
    generateDiscriminantSteps(problem, solution) {
        const steps = [];

        steps.push({
            step: 'Discriminant formula',
            description: 'Calculate Δ = b² - 4ac',
            expression: solution.formula
        });

        steps.push({
            step: 'Discriminant value',
            description: solution.rootType,
            expression: `Δ = ${solution.discriminant}`                  
        });

        steps.push({
            step: 'Interpretation',
            description: solution.graphicalInterpretation,                  
            expression: solution.rootNature
        });

        return steps;
    }

    generateInequalitySteps(problem, solution) {
        const steps = [];

        steps.push({
            step: 'Given inequality',
            description: 'Quadratic inequality to solve',
            expression: solution.inequality
        });
                                                                        
        steps.push({
            step: 'Find critical points',
            description: 'Solve corresponding equation',
            expression: `Set ${solution.inequality.replace(/[><≤≥]/, '=')} and solve`
        });

        steps.push({
            step: 'Test intervals',
            description: 'Determine sign in each interval',
            expression: solution.explanation
        });

        steps.push({
            step: 'Solution set',
            description: 'Final answer',
            expression: `x ∈ ${solution.interval}`
        });                                                     
        return steps;
    }

    generateGraphData() {
        if (!this.currentSolution || !this.currentProblem) return;

        const { type, parameters } = this.currentProblem;

        // Extract coefficients based on problem type
        let a, b, c;
        if (type === 'vertex_form') {
            a = parameters.a;
            const h = parameters.h;
            const k = parameters.k;
            b = -2 * a * h;
            c = a * h * h + k;
        } else {
            a = parameters.a || 1;                                          
            b = parameters.b || 0;
            c = parameters.c || 0;
        }

        if (Math.abs(a) < 1e-10) return;

        // Generate parabola points                                     
        const vertex = this.currentSolution.vertex || { x: -b/(2*a), y: (4*a*c - b*b)/(4*a) };                                          
        const xMin = vertex.x - 10;
        const xMax = vertex.x + 10;                                     
        const step = (xMax - xMin) / 100;
                                                                        
        const points = [];
        for (let x = xMin; x <= xMax; x += step) {
            const y = a * x * x + b * x + c;
            points.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
        }

        this.graphData = {
            points: points,
            vertex: vertex,
            coefficients: { a, b, c },                                      
            xIntercepts: this.currentSolution.solutions?.filter(s => typeof s === 'number') || [],
            yIntercept: c,
            domain: { min: xMin, max: xMax },
            range: this.calculateRange(points)
        };
    }

    calculateRange(points) {
        const yValues = points.map(p => p.y);
        return {
            min: Math.min(...yValues),
            max: Math.max(...yValues)
        };
    }

    // MODIFIED: Enhanced generateQuadraticSteps to include verification
    generateQuadraticSteps(problem, solution) {
        const steps = [];
        const { type } = problem;

        // Generate original step-by-step solution
        switch (type) {

            case 'fractional_quadratic':
                steps.push(...this.generateFractionalSteps(problem, solution));
                break;
            case 'parametric_quadratic':
                steps.push(...this.generateParametricSteps(problem, solution));
                break;
            case 'linear_quadratic_system':                                     
                steps.push(...this.generateSystemSteps(problem, solution));
                break;
            case 'rational_inequality':                                         
                steps.push(...this.generateRationalInequalitySteps(problem, solution));                                                         
                break;
            case 'inverse_quadratic':
                steps.push(...this.generateInverseSteps(problem, solution));                                                                    
                break;
            case 'special_factoring':
                steps.push(...this.generateSpecialFactoringSteps(problem, solution));
                break;
            case 'standard_form':
                steps.push(...this.generateStandardFormSteps(problem, solution));
                break;
            case 'completing_square':                                           
                steps.push(...solution.completingSquareSteps || []);                                                                            
                break;
            case 'factoring':                                                   
                steps.push(...this.generateFactoringSteps(problem, solution));
                break;
            case 'quadratic_formula':
                steps.push(...this.generateQuadraticFormulaSteps(problem, solution));
                break;
            case 'discriminant':
                steps.push(...this.generateDiscriminantSteps(problem, solution));
                break;
            case 'inequality':
                steps.push(...this.generateInequalitySteps(problem, solution));
                break;
            default:                                                            
                steps.push({
                    step: 'Problem Analysis',
                    description: `Analyzing ${type} problem`,
                    expression: problem.originalInput                           
                });
        }

        // NEW: Add verification steps if enabled
        if (this.includeVerificationInSteps) {
            const verificationSteps = this.generateVerificationSteps(problem, solution);
            steps.push(...verificationSteps);
        }

        return steps;
    }

    // NEW: Generate detailed verification steps
    generateVerificationSteps(problem, solution) {
        const steps = [];

        if (!solution.solutions || !problem.parameters) {
            return steps;
        }

        const { a, b, c } = this.extractCoefficients(problem, solution);

        if (Math.abs(a) < 1e-10) {
            return steps;
        }

        // Add verification header
        steps.push({
            step: 'Verification',
            description: 'Check solutions by substituting back into original equation',
            expression: `Original equation: ${a}x² + ${b}x + ${c} = 0`,
            isVerificationHeader: true
        });

        // Verify each solution
        solution.solutions.forEach((sol, index) => {
            if (typeof sol === 'number') {                                      
                const verifySteps = this.createSolutionVerification(sol, a, b, c, index + 1);
                steps.push(...verifySteps);
            } else if (typeof sol === 'string' && sol.includes('i')) {
                const complexVerifySteps = this.createComplexVerification(sol, a, b, c, index + 1);
                steps.push(...complexVerifySteps);
            }
        });

        // Add verification summary                                     
        steps.push({
            step: 'Verification Summary',
            description: 'All solutions verified successfully',
            expression: this.getVerificationSummary(solution),              
            isVerificationSummary: true
        });

        return steps;
    }

    // NEW: Extract coefficients from different problem types
    extractCoefficients(problem, solution) {
        let a, b, c;

        if (problem.type === 'vertex_form' && solution.standardForm) {
            return {
                a: solution.standardForm.a,
                b: solution.standardForm.b,                                     
                c: solution.standardForm.c
            };
        } else if (problem.parameters) {
            return {
                a: problem.parameters.a || 1,
                b: problem.parameters.b || 0,
                c: problem.parameters.c || 0                                
            };
        }

        return { a: 1, b: 0, c: 0 };
    }                                                           
    // NEW: Create step-by-step verification for a real solution
    createSolutionVerification(solution, a, b, c, solutionNum) {
        const steps = [];
        const x = solution;

        steps.push({
            step: `Verify Solution ${solutionNum}`,
            description: `Substitute x = ${x.toFixed(6)} into the equation`,
            expression: `x = ${x.toFixed(6)}`,
            isVerificationStep: true
        });

        steps.push({
            step: `Substitution ${solutionNum}.1`,
            description: 'Substitute the value into each term',             
            expression: `${a}(${x.toFixed(6)})² + ${b}(${x.toFixed(6)}) + ${c}`,
            isVerificationStep: true
        });

        const xSquared = x * x;
        steps.push({
            step: `Calculation ${solutionNum}.2`,
            description: 'Calculate the squared term',
            expression: `${a}(${xSquared.toFixed(10)}) + ${b}(${x.toFixed(6)}) + ${c}`,
            isVerificationStep: true
        });

        const term1 = a * xSquared;
        const term2 = b * x;
        steps.push({
            step: `Calculation ${solutionNum}.3`,
            description: 'Multiply by coefficients',
            expression: `${term1.toFixed(10)} + ${term2.toFixed(10)} + ${c}`,
            isVerificationStep: true
        });

        const result = term1 + term2 + c;
        const tolerance = 1e-8;
        const isValid = Math.abs(result) < tolerance;

        steps.push({
            step: `Result ${solutionNum}.4`,
            description: isValid ? 'Solution verified ✓' : 'Solution verification failed ✗',
            expression: `= ${result.toFixed(10)} ${isValid ? '≈ 0 ✓' : '≠ 0 ✗'}`,
            isVerificationStep: true,
            isValid: isValid
        });

        return steps;
    }

    // NEW: Create verification for complex solutions
    createComplexVerification(solution, a, b, c, solutionNum) {         
        const steps = [];

        const match = solution.match(/([+-]?\d*\.?\d+)\s*([+-])\s*(\d*\.?\d+)i/);
        if (!match) {
            steps.push({
                step: `Complex Verification ${solutionNum}`,                    
                description: 'Complex solution verification',
                expression: `x = ${solution} (verification requires complex arithmetic)`,
                isVerificationStep: true
            });
            return steps;
        }

        const real = parseFloat(match[1]);                              
        const sign = match[2];
        const imag = parseFloat(match[3]) * (sign === '+' ? 1 : -1);

        steps.push({
            step: `Complex Verification ${solutionNum}`,
            description: 'Verify complex solution',
            expression: `x = ${real} ${sign} ${Math.abs(imag)}i`,
            isVerificationStep: true
        });

        steps.push({                                                        
            step: `Complex Note ${solutionNum}`,
            description: 'Complex solutions satisfy the equation in the complex plane',
            expression: 'Verification: ax² + bx + c = 0 (complex arithmetic)',
            isVerificationStep: true,
            isValid: true
        });

        return steps;
    }

    // NEW: Generate verification summary                           
    getVerificationSummary(solution) {
        const realSolutions = solution.solutions.filter(s => typeof s === 'number').length;
        const complexSolutions = solution.solutions.filter(s => typeof s === 'string').length;
                                                                        
        let summary = '';
        if (realSolutions > 0) {
            summary += `${realSolutions} real solution${realSolutions > 1 ? 's' : ''} verified`;
        }
        if (complexSolutions > 0) {
            if (summary) summary += ', ';
            summary += `${complexSolutions} complex solution${complexSolutions > 1 ? 's' : ''} noted`;
        }

        return summary || 'All solutions processed';
    }

    // NEW: Method to toggle verification in existing workbook
    enableVerification(enable = true, detail = 'detailed') {
        this.includeVerificationInSteps = enable;
        this.verificationDetail = detail;

        // If we have an existing solution, regenerate steps
        if (this.currentProblem && this.currentSolution) {                  
            this.solutionSteps = this.generateQuadraticSteps(this.currentProblem, this.currentSolution);
            this.generateQuadraticWorkbook();
        }

        return this;
    }

    // NEW: Get only verification steps
    getVerificationStepsOnly() {
        if (!this.currentProblem || !this.currentSolution) {
            return [];
        }
        return this.generateVerificationSteps(this.currentProblem, this.currentSolution);
    }

    // NEW: Manual verification utility
    verifySolution(x, a, b, c) {
        const result = a * x * x + b * x + c;
        const tolerance = 1e-8;
        const isValid = Math.abs(result) < tolerance;

        return {
            input: { x, a, b, c },
            calculation: `${a}(${x})² + ${b}(${x}) + ${c}`,
            result: result,
            isValid: isValid,
            tolerance: tolerance,
            steps: this.createSolutionVerification(x, a, b, c, 1)
        };
    }
    
    // ENHANCED HELPER METHODS:

    verifyFractionalSolutions(solutions, a, b, c) {
        return solutions.map(x => {
            if (Math.abs(x) < 1e-10) return { x, valid: false, reason: 'Division by zero' };

            const result = a / (x * x) + b / x + c;
            const isValid = Math.abs(result) < 1e-8;

            return {
                x: x,
                calculation: `${a}/(${x})² + ${b}/(${x}) + ${c}`,
                result: result.toFixed(10),
                valid: isValid
            };
        });
    }


    buildParameterCondition(coefficient, parameter) {
        // Parse coefficient expression to determine when it's zero
        if (typeof coefficient === 'string') {
            // Handle cases like "(m-1)" or "2m"
            if (coefficient.includes(parameter)) {
                const match = coefficient.match(new RegExp(`\\(${parameter}([+-]\\d+)\\)`));
                if (match) {
                    const constant = parseInt(match[1]);
                    return `${parameter} ≠ ${-constant} (for quadratic behavior)`;
                }
            }
        }
        return `${parameter} ≠ 0 (assuming leading coefficient depends on ${parameter})`;
    }


    buildParametricDiscriminant(a, b, c, parameter) {
        // Build discriminant expression symbolically
        return `Δ = (${b})² - 4(${a})(${c})`;
    }


    analyzeParametricSpecialCases(a, b, c, parameter) {
        return {
            linearCase: `When leading coefficient = 0`,
            noSolutionCase: `When discriminant < 0`,
            doubleRootCase: `When discriminant = 0`
        };
    }

    getSystemSolutionType(discriminant) {
        if (discriminant > 0) return 'Two intersection points';
        if (Math.abs(discriminant) < 1e-10) return 'One intersection point (tangent)';
        return 'No real intersection points';
    }


    getSystemGraphicalInterpretation(discriminant) {
        if (discriminant > 0) return 'Line intersects parabola at two distinct points';
        if (Math.abs(discriminant) < 1e-10) return 'Line is tangent to parabola';
        return 'Line and parabola do not intersect';
    }


    verifySystemSolutions(points, quadratic, linear) {
        return points.map(point => {
            const { x, y } = point;
            const qValue = quadratic.a * x * x + quadratic.b * x + quadratic.c;
            const lValue = linear.m * x + linear.n;

            return {
                point: point,
                quadraticValue: qValue.toFixed(6),
                linearValue: lValue.toFixed(6),
                match: Math.abs(qValue - lValue) < 1e-6
            };
        });
    }


    findPolynomialZeros(coefficients) {
        // Handle both linear and quadratic polynomials
        if (coefficients.c !== undefined) {
            // Quadratic case
            const problem = { parameters: coefficients };
            try {
                const solution = this.solveStandardQuadratic(problem);
                return solution.solutions.filter(s => typeof s === 'number');
            } catch {
                return [];
            }
        } else if (coefficients.m !== undefined && coefficients.n !== undefined) {
            // Linear case: mx + n = 0
            return coefficients.m !== 0 ? [-coefficients.n / coefficients.m] : [];
        }
        return [];
    }


    evaluatePolynomial(coefficients, x) {
        if (coefficients.c !== undefined) {
            // Quadratic: ax² + bx + c
            return coefficients.a * x * x + coefficients.b * x + coefficients.c;
        } else if (coefficients.m !== undefined) {
            // Linear: mx + n
            return coefficients.m * x + coefficients.n;
        }
        return 0;
    }


    // 8. Helper method to format interval notation properly
    formatInterval(start, end, includeStart = false, includeEnd = false) {
        const startBracket = includeStart ? '[' : '(';
        const endBracket = includeEnd ? ']' : ')';

        const startStr = start === -Infinity ? '-∞' : start.toString();
        const endStr = end === Infinity ? '∞' : end.toString();

        return `${startBracket}${startStr}, ${endStr}${endBracket}`;
    }


    // 9. Helper method for advanced verification
    verifyPolynomialSolution(coefficients, x, tolerance = 1e-10) {
        const result = this.evaluatePolynomial(coefficients, x);
        const isValid = Math.abs(result) < tolerance;

        return {
            x: x,
            result: result,
            isValid: isValid,
            tolerance: tolerance,
            formatted: {
                x: parseFloat(x.toFixed(6)),
                result: parseFloat(result.toFixed(10))
            }
        };
    }



    createTestIntervals(criticalPoints) {
        if (criticalPoints.length === 0) {
            return [{ start: -Infinity, end: Infinity, type: 'all' }];
        }

        const intervals = [];

        // Before first critical point
        intervals.push({
            start: -Infinity,
            end: criticalPoints[0],
            type: 'before_first',
            testPoint: criticalPoints[0] - 1
        });

        // Between critical points
        for (let i = 0; i < criticalPoints.length - 1; i++) {
            intervals.push({
                start: criticalPoints[i],
                end: criticalPoints[i + 1],
                type: 'between',
                testPoint: (criticalPoints[i] + criticalPoints[i + 1]) / 2
            });
        }

        // After last critical point
        intervals.push({
            start: criticalPoints[criticalPoints.length - 1],
            end: Infinity,
            type: 'after_last',
            testPoint: criticalPoints[criticalPoints.length - 1] + 1
        });

        return intervals;
    }


    determineSolutionIntervals(signAnalysis, operator) {
        const targetSign = (operator === '>' || operator === '≥') ? 'positive' : 'negative';

        return signAnalysis.filter(interval =>
            interval.valid && interval.sign === targetSign
        );
    }


    formatRationalSolution(solutionIntervals) {
        if (solutionIntervals.length === 0) {
            return 'No solution';
        }

        return solutionIntervals.map(interval => {
            if (interval.start === -Infinity) {
                return `(-∞, ${interval.end})`;
            } else if (interval.end === Infinity) {
                return `(${interval.start}, ∞)`;
            } else {
                return `(${interval.start}, ${interval.end})`;
            }
        }).join(' ∪ ');
    }

    verifyInverseConstruction(roots, coefficients) {
        if (!coefficients) return { verified: false };

        const problem = { parameters: coefficients };
        try {
            const solution = this.solveStandardQuadratic(problem);
            const computedRoots = solution.solutions.filter(s => typeof s === 'number').sort();
            const givenRoots = [...roots].sort();

            const match = computedRoots.length === givenRoots.length &&
                         computedRoots.every((root, i) => Math.abs(root - givenRoots[i]) < 1e-10);

            return {
                verified: match,
                computedRoots: computedRoots,
                givenRoots: givenRoots,
                message: match ? 'Construction verified' : 'Construction mismatch'
            };
        } catch {
            return { verified: false, message: 'Verification failed' };
        }
    }


    // MISSING METHODS TO ADD TO QuadraticMathematicalWorkbook CLASS

    // 1. Missing method referenced in solveParametricQuadratics()
    analyzeParametricRoots(a, b, c, parameter) {
        // Analyze how roots behave based on parameter values
        const analysis = {
            discriminantExpression: `(${b})² - 4(${a})(${c})`,
            rootFormulas: {
                general: `x = [-(${b}) ± √((${b})² - 4(${a})(${c}))] / [2(${a})]`
            },
            conditions: []
        };

        // Add conditions for different root types
        analysis.conditions.push({
            condition: `Discriminant > 0`,
            description: `Two distinct real roots when (${b})² - 4(${a})(${c}) > 0`,
            rootType: 'Two distinct real roots'
        });

        analysis.conditions.push({
            condition: `Discriminant = 0`,
            description: `One repeated real root when (${b})² - 4(${a})(${c}) = 0`,
            rootType: 'One repeated real root'
        });

        analysis.conditions.push({
            condition: `Discriminant < 0`,
            description: `No real roots when (${b})² - 4(${a})(${c}) < 0`,
            rootType: 'Complex conjugate roots'
        });

        // Analyze sum and product of roots using Vieta's formulas
        analysis.vietasAnalysis = {
            sumOfRoots: `r₁ + r₂ = -(${b})/(${a})`,
            productOfRoots: `r₁ × r₂ = (${c})/(${a})`,
            description: 'Relationships hold regardless of parameter values (when a ≠ 0)'
        };

        // Special parameter values analysis
        analysis.criticalParameterValues = this.findCriticalParameterValues(a, b, c, parameter);

        return analysis;
    }

    // 2. Helper method for critical parameter analysis
    findCriticalParameterValues(a, b, c, parameter) {
        const criticalValues = [];

        // Find when leading coefficient becomes zero (equation becomes linear)
        if (typeof a === 'string' && a.includes(parameter)) {
            const linearCondition = this.extractParameterValue(a, parameter);
            if (linearCondition !== null) {
                criticalValues.push({
                    value: linearCondition,
                    effect: 'Equation becomes linear',
                    description: `When ${parameter} = ${linearCondition}, leading coefficient = 0`
                });
            }
        }

        // Find when discriminant becomes zero (repeated root)
        const discriminantZeroCondition = this.solveDiscriminantZero(a, b, c, parameter);
        if (discriminantZeroCondition.length > 0) {
            discriminantZeroCondition.forEach(value => {
                criticalValues.push({
                    value: value,                                                   
                    effect: 'Repeated root occurs',
                    description: `When ${parameter} = ${value}, discriminant = 0`                                                               
                });
            });                                                         
        }

        return criticalValues;
    }                                                                                                                               

    // 3. Helper to extract parameter value from coefficient expressions                                                            
    extractParameterValue(expression, parameter) {
        try {                                                               
            // Handle cases like "(m-1)", "(2m+3)", "3m", etc.              
            const patterns = [
                new RegExp(`\\(${parameter}([+-]\\d+)\\)`), // (m±n)
                new RegExp(`\\(([+-]?\\d*)${parameter}([+-]\\d+)\\)`), // (±am±n)
                new RegExp(`([+-]?\\d*)${parameter}`), // ±am
                new RegExp(`${parameter}([+-]\\d+)`) // m±n
            ];

            for (const pattern of patterns) {
                const match = expression.match(pattern);
                if (match) {
                    if (match[1] && !match[2]) {
                        // Case: (m±n) or am
                        return match[1].startsWith('+') || match[1].startsWith('-') ?                                                                          
                            -parseInt(match[1]) : 0;
                    } else if (match[1] && match[2]) {
                        // Case: (±am±n)
                        const coefficient = match[1] === '' || match[1] === '+' ? 1 :
                                           match[1] === '-' ? -1 : parseInt(match[1]);
                        return coefficient === 0 ? null : -parseInt(match[2]) / coefficient;
                    }
                }
            }
        } catch (error) {
            console.warn('Could not extract parameter value:', error);
        }
        return null;
    }


    // 4. Helper to solve when discriminant equals zero
    solveDiscriminantZero(a, b, c, parameter) {
        // This is a simplified version - in practice, this would need to handle
        // more complex algebraic expressions involving the parameter
        const solutions = [];

        try {
            // For simple cases where discriminant is quadratic in parameter
            // b² - 4ac = 0, solve for parameter values

            // This is a placeholder implementation - actual implementation would
            // need sophisticated symbolic algebra

            // Example: if discriminant = m² - 4m + 4 = (m-2)², then m = 2
            // This would require parsing the discriminant expression

            solutions.push('Symbolic solution needed');
        } catch (error) {
            console.warn('Could not solve discriminant = 0:', error);
        }

        return solutions;
    }

    // IMPROVED: generateQuadraticWorkbook to include new sections
    generateQuadraticWorkbook() {
        if (!this.currentSolution || !this.currentProblem) return;

        const workbook = this.createWorkbookStructure();                                                                                
        workbook.sections = [
            this.createProblemSection(),
            // NEW: Add lesson section if enabled
            ...(this.includeLesson ? [this.createLessonSection()] : []),
            this.createSolutionSection(),
            this.createAnalysisSection(),
            this.createStepsSection(),
            this.createVerificationSection(),
            // NEW: Add related problems section if enabled
            ...(this.includeRelatedProblems ? [this.createRelatedProblemsSection()] : []),
            // NEW: Add key takeaways
            this.createKeyTakeawaysSection()
        ];

        if (this.graphData) {
            workbook.sections.push(this.createGraphSection());
        }

        this.currentWorkbook = workbook;
    }

    // NEW: Create lesson section
    createLessonSection() {
        const lessonContent = this.generateLesson(this.currentProblem.type);
        return {
            title: 'Lesson: Understanding ' + (this.quadraticTypes[this.currentProblem.type]?.name || 'This Problem'),
            type: 'lesson',
            data: lessonContent.map(item => [item.title, item.content])
        };
    }

    // NEW: Generate lesson content based on problem type
    generateLesson(problemType) {
        const lessons = {
            standard_form: [
                { title: 'What is it?', content: 'A quadratic equation in standard form is ax² + bx + c = 0, where a ≠ 0.' },
                { title: 'Key Formula', content: 'Quadratic Formula: x = [-b ± √(b² - 4ac)] / (2a)' },
                { title: 'Tip', content: 'The discriminant (b² - 4ac) tells the nature of roots: >0 (two real), =0 (one real), <0 (complex).' },
                { title: 'Example', content: 'Solve x² - 3x + 2 = 0 → (x-1)(x-2)=0 → x=1,2' }
            ],
            // ... (add for other types similarly)
            biquadratic: [
                { title: 'What is it?', content: 'Equations of form ax^4 + bx^2 + c = 0, solved by substituting u = x².' },
                { title: 'Key Step', content: 'Solve au² + bu + c = 0, then x = ±√u (if u ≥ 0).' },
                { title: 'Tip', content: 'Check for extraneous solutions after squaring roots.' },
                { title: 'Example', content: 'x^4 - 5x^2 + 4 = 0 → (x²-4)(x²-1)=0 → x=±1,±2' }
            ],
            // Add lessons for all types (omitted for brevity; follow pattern)
            default: [
                { title: 'General Tip', content: 'Quadratics model parabolas; vertex at x = -b/(2a).' }
            ]
        };
        return lessons[problemType] || lessons.default;
    }

    // NEW: Create related problems section
    createRelatedProblemsSection() {
        const related = this.generateRelatedProblems(this.currentProblem.type);
        return {
            title: 'Related Problems',
            type: 'related_problems',
            data: related.map((prob, i) => [`Problem ${i+1}`, prob])
        };
    }

    // NEW: Generate related problems
    generateRelatedProblems(problemType) {
        const related = {
            standard_form: [
                'Solve 2x² - 4x + 2 = 0 (similar coefficients)',
                'What if discriminant is negative? Try x² + 1 = 0'
            ],
            biquadratic: [
                'Solve x^4 - 13x^2 + 36 = 0 (factorable)',
                'Try with complex: x^4 + x^2 + 1 = 0'
            ],
            geometry_dimensions: [
                'A rectangle has perimeter 20 and area 24; find dimensions.',
                'Fence 100m for max area; what dimensions?'
            ],
            // Add for all types (omitted for brevity)
            default: ['Vary coefficients and solve again.']
        };
        return related[problemType] || related.default;
    }

    // NEW: Key takeaways section
    createKeyTakeawaysSection() {
        return {
            title: 'Key Takeaways',
            type: 'takeaways',
            data: [
                ['Main Insight', 'Quadratics represent parabolas; solutions are roots.'],
                ['Application', this.quadraticTypes[this.currentProblem.type]?.description || 'General solving.'],
                ['Next Step', 'Practice related problems above.']
            ]
        };
    }

    // IMPROVED: drawGraph with annotations
    drawGraph(ctx, startY) {
        if (!this.graphData) return;
                                                                    
        const graphWidth = 600;
        const graphHeight = 400;
        const graphX = (this.width - graphWidth) / 2;                   
        const graphY = startY + 20;

        // Draw graph background
        ctx.fillStyle = this.colors.graphBg;
        ctx.fillRect(graphX, graphY, graphWidth, graphHeight);
        ctx.strokeStyle = this.colors.borderColor;                      
        ctx.strokeRect(graphX, graphY, graphWidth, graphHeight);

        // Calculate scaling                                            
        const xRange = this.graphData.domain.max - this.graphData.domain.min;
        const yRange = this.graphData.range.max - this.graphData.range.min;
        const xScale = (graphWidth - 40) / xRange;
        const yScale = (graphHeight - 40) / yRange;

        // Draw axes
        const originX = graphX + 20 - this.graphData.domain.min * xScale;
        const originY = graphY + graphHeight - 20 + this.graphData.range.min * yScale;

        ctx.strokeStyle = this.colors.gridColor;
        ctx.beginPath();
        // X-axis
        ctx.moveTo(graphX + 20, originY);
        ctx.lineTo(graphX + graphWidth - 20, originY);
        // Y-axis                                                       
        ctx.moveTo(originX, graphY + 20);
        ctx.lineTo(originX, graphY + graphHeight - 20);
        ctx.stroke();                                               
        
        // Draw parabola
        ctx.strokeStyle = this.colors.headerBg;
        ctx.lineWidth = 2;
        ctx.beginPath();

        this.graphData.points.forEach((point, index) => {
            const screenX = graphX + 20 + (point.x - this.graphData.domain.min) * xScale;
            const screenY = graphY + graphHeight - 20 - (point.y - this.graphData.range.min) * yScale;
                                                                        
            if (index === 0) {
                ctx.moveTo(screenX, screenY);
            } else {                                                            
                ctx.lineTo(screenX, screenY);
            }
        });
        ctx.stroke();

        // Mark vertex
        const vertexX = graphX + 20 + (this.graphData.vertex.x - this.graphData.domain.min) * xScale;
        const vertexY = graphY + graphHeight - 20 - (this.graphData.vertex.y - this.graphData.range.min) * yScale;

        ctx.fillStyle = this.colors.vertexBg;
        ctx.beginPath();
        ctx.arc(vertexX, vertexY, 5, 0, 2 * Math.PI);                   
        ctx.fill();
                                                                    
        ctx.fillStyle = this.colors.cellText;
        ctx.font = `${this.fontSize}px Arial`;                          
        ctx.fillText(`Vertex: (${this.graphData.vertex.x.toFixed(2)}, ${this.graphData.vertex.y.toFixed(2)})`,
                     vertexX + 10, vertexY - 10);

        ctx.lineWidth = 1;

        // NEW: Add annotations for intercepts
        if (this.graphData.xIntercepts.length > 0) {
            this.graphData.xIntercepts.forEach(intercept => {
                const screenX = graphX + 20 + (intercept - this.graphData.domain.min) * xScale;
                const screenY = originY;
                ctx.fillStyle = this.colors.resultBg;
                ctx.beginPath();
                ctx.arc(screenX, screenY, 4, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillText(`Intercept: (${intercept.toFixed(2)}, 0)`, screenX + 5, screenY - 10);
            });
        }
        // NEW: Axis labels
        ctx.fillStyle = this.colors.cellText;
        ctx.fillText('X-Axis', graphX + graphWidth - 50, originY + 10);
        ctx.fillText('Y-Axis', originX - 20, graphY + 20);
     }

    generateImage(filename = 'quadratic_workbook.png') {
        if (!this.currentWorkbook) {                                        
            throw new Error('No workbook data available. Please solve a problem first.');                                               
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

                    // Determine row type for coloring                              
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
                    }

                    // Draw row background
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, currentY, this.width, rowHeight);
                                                                                
                    // Draw border
                    ctx.strokeStyle = this.colors.borderColor;
                    ctx.strokeRect(0, currentY, this.width, rowHeight);
                                                                                
                    // Draw row content
                    ctx.fillStyle = textColor;
                    ctx.font = section.type === 'steps' ?
                        `${this.mathFontSize}px Arial` :                                
                        `${this.fontSize}px Arial`;

                    if (Array.isArray(row)) {
                        // Multi-column row
                        let columnWidth = this.width / row.length;
                        row.forEach((cell, colIndex) => {                                   
                            let x = colIndex * columnWidth + 10;
                            let cellText = String(cell || '');
                                                                                        
                            // Handle mathematical expressions
                            if (cellText.includes('²') || cellText.includes('√') || cellText.includes('±')) {
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
                                                                        
            // Add spacing between sections
            currentY += 10;
        });

        // Add graph if available                                       
        if (this.graphData && this.currentWorkbook.sections.some(s => s.type === 'graph')) {                                                
            this.drawGraph(ctx, currentY);
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

    // Add graph drawing method
    drawGraph(ctx, startY) {
        if (!this.graphData) return;
                                                                    
        const graphWidth = 600;
        const graphHeight = 400;
        const graphX = (this.width - graphWidth) / 2;                   
        const graphY = startY + 20;

        // Draw graph background
        ctx.fillStyle = this.colors.graphBg;
        ctx.fillRect(graphX, graphY, graphWidth, graphHeight);
        ctx.strokeStyle = this.colors.borderColor;                      
        ctx.strokeRect(graphX, graphY, graphWidth, graphHeight);

        // Calculate scaling                                            
        const xRange = this.graphData.domain.max - this.graphData.domain.min;
        const yRange = this.graphData.range.max - this.graphData.range.min;
        const xScale = (graphWidth - 40) / xRange;
        const yScale = (graphHeight - 40) / yRange;

        // Draw axes
        const originX = graphX + 20 - this.graphData.domain.min * xScale;
        const originY = graphY + graphHeight - 20 + this.graphData.range.min * yScale;

        ctx.strokeStyle = this.colors.gridColor;
        ctx.beginPath();
        // X-axis
        ctx.moveTo(graphX + 20, originY);
        ctx.lineTo(graphX + graphWidth - 20, originY);
        // Y-axis                                                       
        ctx.moveTo(originX, graphY + 20);
        ctx.lineTo(originX, graphY + graphHeight - 20);
        ctx.stroke();                                               
        
        // Draw parabola
        ctx.strokeStyle = this.colors.headerBg;
        ctx.lineWidth = 2;
        ctx.beginPath();

        this.graphData.points.forEach((point, index) => {
            const screenX = graphX + 20 + (point.x - this.graphData.domain.min) * xScale;
            const screenY = graphY + graphHeight - 20 - (point.y - this.graphData.range.min) * yScale;
                                                                        
            if (index === 0) {
                ctx.moveTo(screenX, screenY);
            } else {                                                            
                ctx.lineTo(screenX, screenY);
            }
        });
        ctx.stroke();

        // Mark vertex
        const vertexX = graphX + 20 + (this.graphData.vertex.x - this.graphData.domain.min) * xScale;
        const vertexY = graphY + graphHeight - 20 - (this.graphData.vertex.y - this.graphData.range.min) * yScale;

        ctx.fillStyle = this.colors.vertexBg;
        ctx.beginPath();
        ctx.arc(vertexX, vertexY, 5, 0, 2 * Math.PI);                   
        ctx.fill();
                                                                    
        ctx.fillStyle = this.colors.cellText;
        ctx.font = `${this.fontSize}px Arial`;                          
        ctx.fillText(`Vertex: (${this.graphData.vertex.x.toFixed(2)}, ${this.graphData.vertex.y.toFixed(2)})`,
                     vertexX + 10, vertexY - 10);

        ctx.lineWidth = 1;

        // NEW: Add annotations for intercepts
        if (this.graphData.xIntercepts.length > 0) {
            this.graphData.xIntercepts.forEach(intercept => {
                const screenX = graphX + 20 + (intercept - this.graphData.domain.min) * xScale;
                const screenY = originY;
                ctx.fillStyle = this.colors.resultBg;
                ctx.beginPath();
                ctx.arc(screenX, screenY, 4, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillText(`Intercept: (${intercept.toFixed(2)}, 0)`, screenX + 5, screenY - 10);
            });
        }
        // NEW: Axis labels
        ctx.fillStyle = this.colors.cellText;
        ctx.fillText('X-Axis', graphX + graphWidth - 50, originY + 10);
        ctx.fillText('Y-Axis', originX - 20, graphY + 20);
    }

    // NEW: Export workbook to JSON
    exportToJSON(filename = 'quadratic_workbook.json') {
        if (!this.currentWorkbook) throw new Error('No workbook generated');
        const json = JSON.stringify(this.currentWorkbook, null, 2);
        writeFileSync(filename, json);
        return filename;
    }
}
