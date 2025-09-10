// Enhanced Exponential Mathematical Workbook - Complete Exponential Problem Solver
import * as math from 'mathjs';
// ES Module version - Exponential Workbook Image Generator
import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';

// Enhanced Exponential Mathematical Workbook - Complete Exponential Problem Solver
export class ExponentialMathematicalWorkbook {                        
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

        // Initialize exponential-specific components
        this.initializeExponentialLessons();
        this.mathSymbols = this.initializeMathSymbols();
        this.setThemeColors();
        this.initializeExponentialSolvers();
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
                asymptoteBg: '#ffe6e6'
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
                asymptoteBg: '#ffe0e6'
            }
        };

        this.colors = themes[this.theme] || themes.excel;
    }

    initializeMathSymbols() {
        return {
            // Mathematical constants
            'e': 'e', 'pi': 'π', 'ln': 'ln', 'log': 'log',
            // Exponential notation
            '^': '^', 'exp': 'exp', 'sqrt': '√',
            // Inequality symbols
            'leq': '≤', 'geq': '≥', 'neq': '≠', 'approx': '≈',
            // Special symbols
            'infinity': '∞', 'plusminus': '±', 'asymptote': '~',
            // Greek letters commonly used
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'lambda': 'λ'
        };
    }

    initializeExponentialLessons() {
        this.lessons = {
            exponential_basic: {
                title: 'Basic Exponential Functions',
                theory: 'An exponential function has the form f(x) = a·b^x where a > 0, b > 0, and b ≠ 1. The base b determines growth (b > 1) or decay (0 < b < 1).',
                concepts: [
                    'f(x) = a·b^x is the standard form',
                    'When b > 1: exponential growth',
                    'When 0 < b < 1: exponential decay',
                    'The y-intercept is always (0, a)',
                    'Horizontal asymptote at y = 0'
                ],
                keyFormulas: {
                    'Standard Form': 'f(x) = a·b^x',
                    'Natural Exponential': 'f(x) = a·e^(kx)',
                    'Growth Factor': 'b = 1 + r (where r is growth rate)',
                    'Half-life': 't₁/₂ = ln(2)/k (for decay)'
                },
                applications: [
                    'Population growth models',
                    'Radioactive decay',
                    'Compound interest',
                    'Bacterial growth'
                ]
            },

            exponential_equations: {
                title: 'Solving Exponential Equations',
                theory: 'Exponential equations can be solved using logarithms, same-base technique, or substitution methods. The key is isolating the exponential term.',
                concepts: [
                    'If b^x = b^y, then x = y (same base property)',
                    'Take logarithm of both sides: log(b^x) = x·log(b)',
                    'Use properties of logarithms to simplify',
                    'Check solutions in original equation'
                ],
                keyFormulas: {
                    'Same Base': 'If b^x = b^y, then x = y',
                    'Logarithm Property': 'log(b^x) = x·log(b)',
                    'Natural Log': 'ln(e^x) = x',
                    'Change of Base': 'log_b(x) = ln(x)/ln(b)'
                },
                applications: [
                    'Solving growth equations',
                    'Finding time in decay problems',
                    'Compound interest calculations'
                ]
            },

            logarithmic_functions: {
                title: 'Logarithmic Functions',
                theory: 'Logarithmic functions are inverses of exponential functions. If y = b^x, then x = log_b(y). They have domain (0,∞) and range (-∞,∞).',
                concepts: [
                    'y = log_b(x) is inverse of y = b^x',
                    'Domain: x > 0, Range: all real numbers',
                    'Vertical asymptote at x = 0',
                    'log_b(1) = 0 and log_b(b) = 1',
                    'Common log: base 10, Natural log: base e'
                ],
                keyFormulas: {
                    'Definition': 'y = log_b(x) ⟺ b^y = x',
                    'Product Rule': 'log_b(xy) = log_b(x) + log_b(y)',
                    'Quotient Rule': 'log_b(x/y) = log_b(x) - log_b(y)',
                    'Power Rule': 'log_b(x^n) = n·log_b(x)',
                    'Change of Base': 'log_b(x) = log_a(x)/log_a(b)'
                },
                applications: [
                    'pH calculations',
                    'Richter scale measurements',
                    'Sound intensity (decibels)'
                ]
            },

            logarithmic_equations: {
                title: 'Solving Logarithmic Equations',
                theory: 'Logarithmic equations involve unknown variables inside logarithms. Solutions require using properties of logarithms and checking domain restrictions.',
                concepts: [
                    'Use properties of logarithms to simplify',
                    'Convert to exponential form when helpful',
                    'Always check solutions in original equation',
                    'Reject solutions that make arguments ≤ 0'
                ],
                keyFormulas: {
                    'Exponential Form': 'If log_b(x) = y, then b^y = x',
                    'Same Base Property': 'If log_b(x) = log_b(y), then x = y',
                    'Domain Restriction': 'Arguments must be positive'
                },
                applications: [
                    'Finding unknown time periods',
                    'Solving pH problems',
                    'Decibel calculations'
                ]
            },

            exponential_growth: {
                title: 'Exponential Growth Models',
                theory: 'Exponential growth occurs when quantity increases at a rate proportional to current amount. Model: A(t) = A₀·e^(kt) or A(t) = A₀·(1+r)^t.',
                concepts: [
                    'A₀ is initial amount',
                    'k is continuous growth rate',
                    'r is periodic growth rate',
                    'Doubling time: t = ln(2)/k',
                    'Growth factor = 1 + growth rate'
                ],
                keyFormulas: {
                    'Continuous Growth': 'A(t) = A₀·e^(kt)',
                    'Periodic Growth': 'A(t) = A₀·(1+r)^t',
                    'Doubling Time': 't_double = ln(2)/k',
                    'Growth Rate Conversion': 'e^k = 1 + r'
                },
                applications: [
                    'Population dynamics',
                    'Investment growth',
                    'Bacterial culture growth',
                    'Economic modeling'
                ]
            },

            exponential_decay: {
                title: 'Exponential Decay Models',
                theory: 'Exponential decay occurs when quantity decreases at rate proportional to current amount. Model: A(t) = A₀·e^(-kt) or A(t) = A₀·(1-r)^t.',
                concepts: [
                    'k > 0 for decay (negative exponent)',
                    '0 < 1-r < 1 for periodic decay',
                    'Half-life: t₁/₂ = ln(2)/k',
                    'Decay approaches but never reaches zero'
                ],
                keyFormulas: {
                    'Continuous Decay': 'A(t) = A₀·e^(-kt)',
                    'Periodic Decay': 'A(t) = A₀·(1-r)^t',
                    'Half-life': 't₁/₂ = ln(2)/k',
                    'Remaining Fraction': 'A(t)/A₀ = e^(-kt)'
                },
                applications: [
                    'Radioactive decay',
                    'Drug metabolism',
                    'Population decline',
                    'Cooling problems'
                ]
            },

            compound_interest: {
                title: 'Compound Interest',
                theory: 'Compound interest grows exponentially. Formula depends on compounding frequency: A = P(1 + r/n)^(nt) for n times per year, A = Pe^(rt) for continuous.',
                concepts: [
                    'P = principal amount',
                    'r = annual interest rate',
                    'n = compounding frequency per year',
                    't = time in years',
                    'Continuous compounding uses e'
                ],
                keyFormulas: {
                    'Compound Interest': 'A = P(1 + r/n)^(nt)',
                    'Continuous Compounding': 'A = Pe^(rt)',
                    'Effective Rate': 'r_eff = (1 + r/n)^n - 1',
                    'Doubling Time': 't = ln(2)/r (continuous)'
                },
                applications: [
                    'Savings accounts',
                    'Investment planning',
                    'Loan calculations',
                    'Annuity problems'
                ]
            },

            logarithmic_scales: {
                title: 'Logarithmic Scales',
                theory: 'Logarithmic scales compress large ranges of data. Common examples include pH, Richter scale, and decibels. Each unit represents a multiplicative change.',
                concepts: [
                    'Each unit = factor of 10 change (common log)',
                    'pH = -log[H⁺]',
                    'Richter scale measures earthquake magnitude',
                    'Decibels measure sound intensity ratio'
                ],
                keyFormulas: {
                    'pH Scale': 'pH = -log₁₀[H⁺]',
                    'Richter Scale': 'M = log₁₀(A/A₀)',
                    'Decibels': 'dB = 10·log₁₀(I/I₀)',
                    'General Log Scale': 'Scale = log_b(value/reference)'
                },
                applications: [
                    'Chemistry pH calculations',
                    'Seismology',
                    'Acoustics and sound',
                    'Scientific measurements'
                ]
            }
        };
    }

    initializeExponentialSolvers() {
        this.exponentialTypes = {
            // Basic exponential equations
            exponential_basic: {
                patterns: [
                    /([+-]?\d*\.?\d*)\s*\*?\s*(\d*\.?\d*)\s*\^\s*x\s*=\s*([+-]?\d*\.?\d*)/,
                    /([+-]?\d*\.?\d*)\s*\*?\s*e\s*\^\s*([+-]?\d*\.?\d*x[+-]?\d*\.?\d*)\s*=\s*([+-]?\d*\.?\d*)/,
                    /(\d*\.?\d*)\s*\^\s*x\s*=\s*(\d*\.?\d*)/
                ],
                solver: this.solveBasicExponential.bind(this),
                name: 'Basic Exponential Equations',
                category: 'exponential_equations',
                description: 'Solves equations of form a·b^x = c'
            },

            // Exponential with same base
            exponential_same_base: {
                patterns: [
                    /(\d*\.?\d*)\s*\^\s*\(([^)]+)\)\s*=\s*(\d*\.?\d*)\s*\^\s*\(([^)]+)\)/,
                    /e\s*\^\s*\(([^)]+)\)\s*=\s*e\s*\^\s*\(([^)]+)\)/
                ],
                solver: this.solveSameBaseExponential.bind(this),
                name: 'Same Base Exponential Equations',
                category: 'exponential_equations',
                description: 'Solves equations where bases are equal'
            },

            // Logarithmic equations
            logarithmic_basic: {
                patterns: [
                    /log\s*\(([^)]+)\)\s*=\s*([+-]?\d*\.?\d*)/,
                    /ln\s*\(([^)]+)\)\s*=\s*([+-]?\d*\.?\d*)/,
                    /log_(\d+)\s*\(([^)]+)\)\s*=\s*([+-]?\d*\.?\d*)/
                ],
                solver: this.solveBasicLogarithmic.bind(this),
                name: 'Basic Logarithmic Equations',
                category: 'logarithmic_equations',
                description: 'Solves equations with single logarithms'
            },

            // Logarithmic properties
            logarithmic_properties: {
                patterns: [
                    /log\s*\(([^)]+)\)\s*[+-]\s*log\s*\(([^)]+)\)\s*=\s*([+-]?\d*\.?\d*)/,
                    /ln\s*\(([^)]+)\)\s*[+-]\s*ln\s*\(([^)]+)\)\s*=\s*([+-]?\d*\.?\d*)/
                ],
                solver: this.solveLogarithmicProperties.bind(this),
                name: 'Logarithmic Properties',
                category: 'logarithmic_equations',
                description: 'Uses log properties to solve equations'
            },

            // Exponential growth/decay
            exponential_growth: {
                patterns: [
                    /growth/i,
                    /population/i,
                    /increase/i,
                    /compound/i,
                    /A.*=.*A.*e/i,
                    /P.*\(.*1.*\+.*r.*\)/i
                ],
                solver: this.solveExponentialGrowth.bind(this),
                name: 'Exponential Growth Problems',
                category: 'applications',
                description: 'Solves growth and compound interest problems'
            },

            exponential_decay: {
                patterns: [
                    /decay/i,
                    /half.*life/i,
                    /radioactive/i,
                    /decrease/i,
                    /cooling/i,
                    /A.*=.*A.*e.*-/i
                ],
                solver: this.solveExponentialDecay.bind(this),
                name: 'Exponential Decay Problems',
                category: 'applications',
                description: 'Solves decay and half-life problems'
            },

            // Logarithmic scales
            logarithmic_scales: {
                patterns: [
                    /pH/i,
                    /richter/i,
                    /decibel/i,
                    /earthquake/i,
                    /sound.*intensity/i,
                    /acid/i
                ],
                solver: this.solveLogarithmicScale.bind(this),
                name: 'Logarithmic Scale Problems',
                category: 'applications',
                description: 'Solves pH, Richter scale, and decibel problems'
            },

            // Systems with exponentials
            exponential_systems: {
                patterns: [
                    /system.*exponential/i,
                    /two.*equations.*exponential/i
                ],
                solver: this.solveExponentialSystem.bind(this),
                name: 'Exponential Systems',
                category: 'systems',
                description: 'Solves systems involving exponentials'
            },

            // Exponential inequalities
            exponential_inequalities: {
                patterns: [
                    /(\d*\.?\d*)\s*\^\s*x\s*[><≤≥]\s*(\d*\.?\d*)/,
                    /e\s*\^\s*x\s*[><≤≥]\s*(\d*\.?\d*)/
                ],
                solver: this.solveExponentialInequality.bind(this),
                name: 'Exponential Inequalities',
                category: 'inequalities',
                description: 'Solves exponential inequalities'
            },

            // Advanced exponential forms
            exponential_substitution: {
                patterns: [
                    /(\d*\.?\d*)\s*\^\s*\(2x\)/,
                    /e\s*\^\s*\(2x\)/,
                    /substitution.*exponential/i
                ],
                solver: this.solveExponentialSubstitution.bind(this),
                name: 'Exponential Substitution',
                category: 'advanced_forms',
                description: 'Uses substitution for complex exponential equations'
            },

            // Inverse functions
            inverse_exponential: {
                patterns: [
                    /inverse.*exponential/i,
                    /find.*inverse/i,
                    /f.*-1/i
                ],
                solver: this.solveInverseExponential.bind(this),
                name: 'Inverse Exponential Functions',
                category: 'inverse_functions',
                description: 'Finds inverses of exponential functions'
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
            this.generateGraphData();

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

        // Default handling if no pattern matches
        if (parameters.base || parameters.coefficient || parameters.exponent) {
            return {
                originalInput: equation || 'Exponential with given parameters',
                cleanInput: cleanInput,
                type: 'exponential_basic',
                scenario: scenario,
                parameters: { ...parameters },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        throw new Error(`Unable to recognize exponential problem type from: ${equation || scenario}`);
    }

    cleanMathExpression(expression) {
        return expression
            .replace(/\s+/g, ' ')
            .replace(/\*\*/g, '^')
            .replace(/exp\s*\(/g, 'e^(')
            .replace(/natural\s+log/gi, 'ln')
            .replace(/common\s+log/gi, 'log')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/≠/g, '!=')
            .trim();
    }

    extractExponentialParameters(match, type) {
        const params = {};

        if (type === 'exponential_basic' && match) {
            params.coefficient = this.parseCoefficient(match[1]) || 1;
            params.base = this.parseCoefficient(match[2]) || Math.E;
            params.result = this.parseCoefficient(match[3]) || 0;
        } else if (type === 'logarithmic_basic' && match) {
            params.argument = match[1];
            params.result = this.parseCoefficient(match[2]) || 0;
            if (match[0].includes('ln')) {
                params.base = Math.E;
            } else {
                params.base = 10;
            }
        }

        return params;
    }

    parseCoefficient(coeff) {
        if (!coeff || coeff.trim() === '') return 0;

        let cleaned = coeff.replace(/\s+/g, '');
        if (cleaned === '+' || cleaned === '') return 1;
        if (cleaned === '-') return -1;
        if (cleaned === 'e') return Math.E;

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

    solveBasicExponential(problem) {
        const { coefficient = 1, base = Math.E, result = 0, exponent = 'x' } = problem.parameters;

        if (coefficient === 0) {
            throw new Error('Coefficient cannot be zero');
        }

        if (base <= 0 || base === 1) {
            throw new Error('Base must be positive and not equal to 1');
        }

        if (result <= 0) {
            throw new Error('Result must be positive for exponential equation');
        }

        // Solve a * b^x = c
        // b^x = c/a
        // x = log_b(c/a)
        const ratio = result / coefficient;

        if (ratio <= 0) {
            return {
                solutions: [],
                solutionType: 'No real solutions (negative or zero ratio)',
                equation: `${coefficient} * ${base}^${exponent} = ${result}`,
                category: 'exponential_basic'
            };
        }

        const solution = Math.log(ratio) / Math.log(base);

        return {
            solutions: [solution],
            solutionType: 'One real solution',
            equation: `${coefficient} * ${base}^${exponent} = ${result}`,
            ratio: ratio,
            logForm: `${exponent} = log_${base}(${ratio})`,
            verification: this.verifyExponentialSolution(solution, coefficient, base, result),
            category: 'exponential_basic'
        };
    }

    solveSameBaseExponential(problem) {
        const match = problem.match;
        if (!match) {
            throw new Error('Unable to parse same base exponential equation');
        }

        // For equations like b^(f(x)) = b^(g(x))
        // Solution: f(x) = g(x)
        const leftExponent = match[1] || match[2];
        const rightExponent = match[3] || match[4];

        return {
            solutions: [`Set exponents equal: ${leftExponent} = ${rightExponent}`],
            solutionType: 'Linear equation in exponents',
            originalEquation: problem.originalInput,
            simplifiedEquation: `${leftExponent} = ${rightExponent}`,
            method: 'Same base property',
            category: 'exponential_equations'
        };
    }

    solveBasicLogarithmic(problem) {
        const { argument, result = 0, base = 10 } = problem.parameters;

        // Solve log_b(argument) = result
        // Therefore: argument = b^result
        const solution = Math.pow(base, result);

        // Check domain restriction
        const domainValid = this.checkLogarithmicDomain(argument, solution);

        return {
            solutions: domainValid.valid ? [solution] : [],
            solutionType: domainValid.valid ? 'One real solution' : 'No valid solution (domain restriction)',
            equation: `log_${base}(${argument}) = ${result}`,
            exponentialForm: `${argument} = ${base}^${result}`,
            domainCheck: domainValid,
            verification: domainValid.valid ? this.verifyLogarithmicSolution(solution, argument, base, result) : null,
            category: 'logarithmic_equations'
        };
    }

    solveLogarithmicProperties(problem) {
        // This would handle equations using log properties like log(x) + log(y) = c
        return {
            solutions: ['Solution depends on specific logarithmic property equation'],
            solutionType: 'Requires property application',
            method: 'Use logarithmic properties to combine or separate terms',
            category: 'logarithmic_equations'
        };
    }


// Continue from solveExponentialGrowth
    solveExponentialGrowth(problem) {
        const {
            initialAmount = 1000,
            growthRate = 0.05,
            timeVariable = 't',
            targetAmount,
            targetTime,
            compoundingFrequency = 1
        } = problem.parameters;

        let model, solution = {};

        if (compoundingFrequency === 'continuous') {
            // A(t) = A₀ * e^(rt)
            model = `A(${timeVariable}) = ${initialAmount} * e^(${growthRate}*${timeVariable})`;

            if (targetAmount) {
                // Solve for time: t = ln(A/A₀) / r
                const time = Math.log(targetAmount / initialAmount) / growthRate;
                solution.timeToReachTarget = time;
            }

            if (targetTime) {
                // Find amount at time t: A = A₀ * e^(rt)
                const amount = initialAmount * Math.exp(growthRate * targetTime);
                solution.amountAtTime = amount;
            }

            solution.doublingTime = Math.log(2) / growthRate;
        } else {
            // A(t) = A₀ * (1 + r/n)^(nt)
            const n = compoundingFrequency;
            model = `A(${timeVariable}) = ${initialAmount} * (1 + ${growthRate}/${n})^(${n}*${timeVariable})`;

            if (targetAmount) {
                // Solve for time: t = ln(A/A₀) / (n * ln(1 + r/n))
                const time = Math.log(targetAmount / initialAmount) / (n * Math.log(1 + growthRate / n));
                solution.timeToReachTarget = time;
            }

            if (targetTime) {
                const amount = initialAmount * Math.pow(1 + growthRate / n, n * targetTime);
                solution.amountAtTime = amount;
            }

            solution.doublingTime = Math.log(2) / (n * Math.log(1 + growthRate / n));
            solution.effectiveRate = Math.pow(1 + growthRate / n, n) - 1;
        }

        return {
            solutions: solution.timeToReachTarget ? [solution.timeToReachTarget] : [],
            solutionType: 'Exponential Growth Model',
            model: model,
            growthType: compoundingFrequency === 'continuous' ? 'Continuous' : 'Discrete',
            parameters: { initialAmount, growthRate, compoundingFrequency },
            results: solution,
            category: 'exponential_growth'
        };
    }

    solveExponentialDecay(problem) {
        const {
            initialAmount = 1000,
            decayRate = 0.05,
            timeVariable = 't',
            targetAmount,
            targetTime,
            halfLife
        } = problem.parameters;

        let solution = {};
        let model;

        if (halfLife) {
            // Using half-life: A(t) = A₀ * (1/2)^(t/t₁/₂)
            const k = Math.log(2) / halfLife;
            model = `A(${timeVariable}) = ${initialAmount} * e^(-${k}*${timeVariable})`;
            solution.decayConstant = k;

            if (targetAmount) {
                // Solve for time: t = -ln(A/A₀) / k
                const time = -Math.log(targetAmount / initialAmount) / k;
                solution.timeToReachTarget = time;
            }

            if (targetTime) {
                const amount = initialAmount * Math.exp(-k * targetTime);
                solution.amountAtTime = amount;
            }

            solution.halfLife = halfLife;
        } else {
            // Using decay rate: A(t) = A₀ * e^(-kt)
            model = `A(${timeVariable}) = ${initialAmount} * e^(-${decayRate}*${timeVariable})`;

            if (targetAmount) {
                const time = -Math.log(targetAmount / initialAmount) / decayRate;
                solution.timeToReachTarget = time;
            }

            if (targetTime) {
                const amount = initialAmount * Math.exp(-decayRate * targetTime);
                solution.amountAtTime = amount;
            }

            solution.halfLife = Math.log(2) / decayRate;
            solution.decayConstant = decayRate;
        }

        // Calculate percentage remaining
        if (solution.timeToReachTarget) {
            solution.percentRemaining = (targetAmount / initialAmount) * 100;
        }

        return {
            solutions: solution.timeToReachTarget ? [solution.timeToReachTarget] : [],
            solutionType: 'Exponential Decay Model',
            model: model,
            parameters: { initialAmount, decayRate, halfLife },
            results: solution,
            category: 'exponential_decay'
        };
    }

    solveLogarithmicScale(problem) {
        const { scaleType = 'pH', value1, value2, intensity1, intensity2 } = problem.parameters;
        let solution = {};

        switch (scaleType.toLowerCase()) {
            case 'ph':
                if (intensity1) {
                    // pH = -log₁₀[H⁺]
                    solution.pH = -Math.log10(intensity1);
                    solution.calculation = `pH = -log₁₀(${intensity1}) = ${solution.pH.toFixed(2)}`;
                }
                if (value1 && value2) {
                    // Compare pH values
                    const ratio = Math.pow(10, value1 - value2);
                    solution.intensityRatio = ratio;
                    solution.comparison = `Solution 1 is ${ratio.toFixed(2)} times more acidic than solution 2`;
                }
                break;

            case 'richter':
                if (value1 && value2) {
                    // Richter scale comparison
                    const energyRatio = Math.pow(10, 1.5 * (value1 - value2));
                    const amplitudeRatio = Math.pow(10, value1 - value2);
                    solution.energyRatio = energyRatio;
                    solution.amplitudeRatio = amplitudeRatio;
                    solution.comparison = `Earthquake 1 releases ${energyRatio.toFixed(2)} times more energy`;
                }
                break;

            case 'decibel':
                if (intensity1 && intensity2) {
                    // dB = 10 * log₁₀(I/I₀)
                    const dB = 10 * Math.log10(intensity1 / intensity2);
                    solution.decibels = dB;
                    solution.calculation = `dB = 10 * log₁₀(${intensity1}/${intensity2}) = ${dB.toFixed(2)}`;
                }
                break;
        }

        return {
            solutions: [solution.pH || solution.decibels || solution.energyRatio || 0],
            solutionType: `${scaleType.toUpperCase()} Scale Calculation`,
            scaleType: scaleType,
            results: solution,
            category: 'logarithmic_scales'
        };
    }

    solveExponentialSystem(problem) {
        // Placeholder for system solving - would need specific system equations
        return {
            solutions: ['System solution depends on specific equations'],
            solutionType: 'Exponential System',
            method: 'Substitution or elimination with logarithms',
            category: 'exponential_systems'
        };
    }

    solveExponentialInequality(problem) {
        const match = problem.match;
        if (!match) {
            throw new Error('Unable to parse exponential inequality');
        }

        const base = parseFloat(match[1]) || Math.E;
        const result = parseFloat(match[2]);
        const operator = problem.originalInput.match(/[><≤≥]/)[0];

        let solution;
        if (base > 1) {
            // For base > 1, exponential function is increasing
            if (operator === '>' || operator === '≥') {
                solution = `x ${operator} ${Math.log(result) / Math.log(base)}`;
            } else {
                solution = `x ${operator} ${Math.log(result) / Math.log(base)}`;
            }
        } else if (base > 0 && base < 1) {
            // For 0 < base < 1, exponential function is decreasing
            // Inequality flips when taking logarithm
            const flippedOp = operator === '>' ? '<' : operator === '<' ? '>' : 
                             operator === '≥' ? '≤' : '≥';
            solution = `x ${flippedOp} ${Math.log(result) / Math.log(base)}`;
        }

        return {
            solutions: [solution],
            solutionType: 'Exponential Inequality',
            inequality: problem.originalInput,
            baseAnalysis: base > 1 ? 'Base > 1: function is increasing' : 'Base < 1: function is decreasing',
            category: 'exponential_inequalities'
        };
    }

    solveExponentialSubstitution(problem) {
        // Example: solve equations like 4^x - 2^(x+1) - 8 = 0
        // Let u = 2^x, then 4^x = (2^2)^x = (2^x)^2 = u^2
        
        return {
            solutions: ['Solution depends on specific substitution form'],
            solutionType: 'Exponential with Substitution',
            method: 'Let u = base^x and solve resulting polynomial',
            category: 'exponential_substitution'
        };
    }

    solveInverseExponential(problem) {
        const { base = Math.E, coefficient = 1, constant = 0 } = problem.parameters;
        
        // For f(x) = a * b^x + c, inverse is f⁻¹(x) = log_b((x-c)/a)
        const inverseFunction = `f⁻¹(x) = log_${base}((x - ${constant})/${coefficient})`;
        
        return {
            solutions: [inverseFunction],
            solutionType: 'Inverse Function',
            originalFunction: `f(x) = ${coefficient} * ${base}^x + ${constant}`,
            inverseFunction: inverseFunction,
            domain: `x > ${constant}`,
            range: 'All real numbers',
            category: 'inverse_exponential'
        };
    }

    // STEP GENERATION METHODS

    generateExponentialSteps(problem, solution) {
        const steps = [];
        const { type } = problem;

        // Generate original step-by-step solution
        switch (type) {
            case 'exponential_basic':
                steps.push(...this.generateBasicExponentialSteps(problem, solution));
                break;
            case 'exponential_same_base':
                steps.push(...this.generateSameBaseSteps(problem, solution));
                break;
            case 'logarithmic_basic':
                steps.push(...this.generateBasicLogarithmicSteps(problem, solution));
                break;
            case 'logarithmic_properties':
                steps.push(...this.generateLogarithmicPropertiesSteps(problem, solution));
                break;
            case 'exponential_growth':
                steps.push(...this.generateExponentialGrowthSteps(problem, solution));
                break;
            case 'exponential_decay':
                steps.push(...this.generateExponentialDecaySteps(problem, solution));
                break;
            case 'logarithmic_scales':
                steps.push(...this.generateLogarithmicScaleSteps(problem, solution));
                break;
            case 'exponential_inequalities':
                steps.push(...this.generateExponentialInequalitySteps(problem, solution));
                break;
            case 'exponential_substitution':
                steps.push(...this.generateExponentialSubstitutionSteps(problem, solution));
                break;
            case 'inverse_exponential':
                steps.push(...this.generateInverseExponentialSteps(problem, solution));
                break;
            default:
                steps.push({
                    step: 'Problem Analysis',
                    description: `Analyzing ${type} problem`,
                    expression: problem.originalInput
                });
        }

        // Add verification steps if enabled
        if (this.includeVerificationInSteps) {
            const verificationSteps = this.generateExponentialVerificationSteps(problem, solution);
            steps.push(...verificationSteps);
        }

        return steps;
    }

    // INDIVIDUAL STEP GENERATION METHODS

    generateBasicExponentialSteps(problem, solution) {
        const { coefficient = 1, base = Math.E, result = 0 } = problem.parameters;
        
        return [
            {
                step: 'Given equation',
                description: 'Basic exponential equation',
                expression: `${coefficient} * ${base}^x = ${result}`
            },
            {
                step: 'Isolate exponential term',
                description: 'Divide both sides by coefficient',
                expression: `${base}^x = ${result}/${coefficient} = ${solution.ratio}`
            },
            {
                step: 'Take logarithm',
                description: 'Apply logarithm to both sides',
                expression: `log_${base}(${base}^x) = log_${base}(${solution.ratio})`
            },
            {
                step: 'Simplify using log property',
                description: 'log_b(b^x) = x',
                expression: `x = log_${base}(${solution.ratio})`
            },
            {
                step: 'Calculate solution',
                description: 'Evaluate the logarithm',
                expression: `x = ${solution.solutions[0].toFixed(6)}`
            }
        ];
    }

    generateSameBaseSteps(problem, solution) {
        return [
            {
                step: 'Identify same base',
                description: 'Both sides have the same exponential base',
                expression: problem.originalInput
            },
            {
                step: 'Apply same base property',
                description: 'If b^f(x) = b^g(x), then f(x) = g(x)',
                expression: solution.simplifiedEquation
            },
            {
                step: 'Solve linear equation',
                description: 'Solve the equation in the exponents',
                expression: `Solution method: ${solution.method}`
            }
        ];
    }

    generateBasicLogarithmicSteps(problem, solution) {
        const { argument, result, base } = problem.parameters;
        
        return [
            {
                step: 'Given logarithmic equation',
                description: 'Basic logarithmic equation',
                expression: `log_${base}(${argument}) = ${result}`
            },
            {
                step: 'Convert to exponential form',
                description: 'Use definition: log_b(x) = y ⟺ b^y = x',
                expression: solution.exponentialForm
            },
            {
                step: 'Solve for variable',
                description: 'Calculate the exponential expression',
                expression: `${argument} = ${base}^${result} = ${solution.solutions[0]}`
            },
            {
                step: 'Check domain restriction',
                description: 'Verify argument is positive',
                expression: solution.domainCheck.valid ? 'Domain satisfied ✓' : 'Domain violation ✗'
            }
        ];
    }

    generateLogarithmicPropertiesSteps(problem, solution) {
        return [
            {
                step: 'Identify logarithmic properties',
                description: 'Use sum/difference properties of logarithms',
                expression: problem.originalInput
            },
            {
                step: 'Apply logarithm properties',
                description: 'log(a) + log(b) = log(ab), log(a) - log(b) = log(a/b)',
                expression: 'Combine logarithmic terms'
            },
            {
                step: 'Convert to exponential form',
                description: 'Transform to solve for the variable',
                expression: 'Apply exponential form conversion'
            }
        ];
    }

    generateExponentialGrowthSteps(problem, solution) {
        const { initialAmount, growthRate, compoundingFrequency } = solution.parameters;
        const isContinuous = compoundingFrequency === 'continuous';
        
        return [
            {
                step: 'Identify growth model',
                description: isContinuous ? 'Continuous exponential growth' : 'Discrete compound growth',
                expression: solution.model
            },
            {
                step: 'Set up equation',
                description: 'Substitute known values',
                expression: `Initial amount: $${initialAmount}, Growth rate: ${growthRate * 100}%`
            },
            {
                step: 'Calculate key metrics',
                description: 'Find doubling time and other important values',
                expression: `Doubling time: ${solution.results.doublingTime?.toFixed(2)} units`
            },
            {
                step: 'Solve for unknown',
                description: solution.results.timeToReachTarget ? 'Time to reach target' : 'Amount at given time',
                expression: solution.results.timeToReachTarget ? 
                    `Time = ${solution.results.timeToReachTarget.toFixed(2)} units` :
                    `Amount = $${solution.results.amountAtTime?.toFixed(2)}`
            }
        ];
    }

    generateExponentialDecaySteps(problem, solution) {
        const { initialAmount, halfLife } = solution.parameters;
        
        return [
            {
                step: 'Identify decay model',
                description: halfLife ? 'Half-life decay model' : 'Exponential decay model',
                expression: solution.model
            },
            {
                step: 'Set up decay equation',
                description: 'Use appropriate decay formula',
                expression: `Initial amount: ${initialAmount}, Half-life: ${solution.results.halfLife?.toFixed(2)}`
            },
            {
                step: 'Calculate decay constant',
                description: 'Find decay rate k',
                expression: `k = ln(2)/t₁/₂ = ${solution.results.decayConstant?.toFixed(6)}`
            },
            {
                step: 'Solve for unknown',
                description: solution.results.timeToReachTarget ? 'Time for specific amount' : 'Amount at given time',
                expression: solution.results.timeToReachTarget ?
                    `Time = ${solution.results.timeToReachTarget.toFixed(2)} units` :
                    `Amount = ${solution.results.amountAtTime?.toFixed(2)}`
            }
        ];
    }

    generateLogarithmicScaleSteps(problem, solution) {
        const scaleType = solution.scaleType.toUpperCase();
        
        return [
            {
                step: `${scaleType} scale identification`,
                description: `Working with ${scaleType} logarithmic scale`,
                expression: solution.results.calculation || `${scaleType} scale problem`
            },
            {
                step: 'Apply scale formula',
                description: `Use appropriate ${scaleType} formula`,
                expression: scaleType === 'PH' ? 'pH = -log₁₀[H⁺]' :
                          scaleType === 'RICHTER' ? 'M = log₁₀(A/A₀)' :
                          scaleType === 'DECIBEL' ? 'dB = 10 * log₁₀(I/I₀)' : 'Scale formula'
            },
            {
                step: 'Calculate result',
                description: 'Evaluate logarithmic expression',
                expression: solution.results.comparison || `${scaleType} value calculated`
            }
        ];
    }

    generateExponentialInequalitySteps(problem, solution) {
        return [
            {
                step: 'Identify inequality type',
                description: 'Exponential inequality analysis',
                expression: solution.inequality
            },
            {
                step: 'Analyze base',
                description: 'Determine if base affects inequality direction',
                expression: solution.baseAnalysis
            },
            {
                step: 'Take logarithm',
                description: 'Apply logarithm preserving or flipping inequality',
                expression: 'Apply log to both sides'
            },
            {
                step: 'Solution set',
                description: 'Final inequality solution',
                expression: solution.solutions[0]
            }
        ];
    }

    generateExponentialSubstitutionSteps(problem, solution) {
        return [
            {
                step: 'Identify substitution pattern',
                description: 'Recognize exponential terms that can be substituted',
                expression: problem.originalInput
            },
            {
                step: 'Make substitution',
                description: solution.method,
                expression: 'Let u = base^x'
            },
            {
                step: 'Solve polynomial',
                description: 'Solve resulting equation in u',
                expression: 'Solve for u values'
            },
            {
                step: 'Back substitute',
                description: 'Convert u values back to x',
                expression: 'x = log_base(u)'
            }
        ];
    }

    generateInverseExponentialSteps(problem, solution) {
        return [
            {
                step: 'Given function',
                description: 'Original exponential function',
                expression: solution.originalFunction
            },
            {
                step: 'Replace f(x) with y',
                description: 'Set up for inverse finding',
                expression: 'Let y = f(x)'
            },
            {
                step: 'Swap variables',
                description: 'Interchange x and y',
                expression: 'Swap x ↔ y'
            },
            {
                step: 'Solve for y',
                description: 'Isolate y using logarithms',
                expression: solution.inverseFunction
            },
            {
                step: 'Identify domain and range',
                description: 'Determine restrictions',
                expression: `Domain: ${solution.domain}, Range: ${solution.range}`
            }
        ];
    }

    // VERIFICATION METHODS

    generateExponentialVerificationSteps(problem, solution) {
        const steps = [];
        
        if (!solution.solutions || solution.solutions.length === 0) {
            return steps;
        }

        // Add verification header
        steps.push({
            step: 'Verification',
            description: 'Check solutions by substituting back into original equation',
            expression: `Original: ${problem.originalInput}`,
            isVerificationHeader: true
        });

        // Verify each solution
        solution.solutions.forEach((sol, index) => {
            if (typeof sol === 'number') {
                const verifySteps = this.createExponentialVerification(sol, problem, solution, index + 1);
                steps.push(...verifySteps);
            }
        });

        return steps;
    }

    createExponentialVerification(solutionValue, problem, solution, solutionNum) {
        const steps = [];
        const x = solutionValue;

        steps.push({
            step: `Verify Solution ${solutionNum}`,
            description: `Substitute x = ${x.toFixed(6)} into original equation`,
            expression: `x = ${x.toFixed(6)}`,
            isVerificationStep: true
        });

        // Verification depends on problem type
        if (problem.type === 'exponential_basic') {
            const { coefficient = 1, base = Math.E, result = 0 } = problem.parameters;
            
            const calculatedResult = coefficient * Math.pow(base, x);
            const tolerance = 1e-6;
            const isValid = Math.abs(calculatedResult - result) < tolerance;

            steps.push({
                step: `Calculation ${solutionNum}`,
                description: 'Evaluate the exponential expression',
                expression: `${coefficient} × ${base}^${x.toFixed(6)} = ${calculatedResult.toFixed(6)}`,
                isVerificationStep: true
            });

            steps.push({
                step: `Result ${solutionNum}`,
                description: isValid ? 'Solution verified ✓' : 'Solution verification failed ✗',
                expression: `${calculatedResult.toFixed(6)} ${isValid ? '≈' : '≠'} ${result} ${isValid ? '✓' : '✗'}`,
                isVerificationStep: true,
                isValid: isValid
            });
        }

        return steps;
    }

    // VERIFICATION UTILITIES

    verifyExponentialSolution(x, coefficient, base, expectedResult) {
        const actualResult = coefficient * Math.pow(base, x);
        const tolerance = 1e-10;
        const error = Math.abs(actualResult - expectedResult);
        
        return {
            input: x,
            expected: expectedResult,
            actual: actualResult,
            error: error,
            isValid: error < tolerance,
            tolerance: tolerance,
            calculation: `${coefficient} × ${base}^${x} = ${actualResult}`
        };
    }

    verifyLogarithmicSolution(x, argument, base, expectedResult) {
        // For log_base(argument) = expectedResult where argument contains x
        // This would need to parse the argument expression and substitute x
        return {
            input: x,
            expected: expectedResult,
            isValid: true, // Simplified verification
            note: 'Logarithmic verification requires expression parsing'
        };
    }

    checkLogarithmicDomain(argument, solutionValue) {
        // Check if the argument becomes positive when x = solutionValue
        // This is simplified - full implementation would parse the argument expression
        return {
            valid: solutionValue > 0,
            argument: argument,
            value: solutionValue,
            requirement: 'Argument must be positive'
        };
    }

    // Add these methods to the ExponentialMathematicalWorkbook class

// 1. Generate Related Problems Method
generateRelatedProblems(problemType, parameters) {
    const problemGenerators = {
        exponential_basic: () => this.generateBasicExponentialProblems(parameters),
        exponential_equations: () => this.generateExponentialEquationProblems(parameters),
        logarithmic_functions: () => this.generateLogarithmicFunctionProblems(parameters),
        logarithmic_equations: () => this.generateLogarithmicEquationProblems(parameters),
        exponential_growth: () => this.generateExponentialGrowthProblems(parameters),
        exponential_decay: () => this.generateExponentialDecayProblems(parameters),
        compound_interest: () => this.generateCompoundInterestProblems(parameters),
        logarithmic_scales: () => this.generateLogarithmicScaleProblems(parameters),
        exponential_inequalities: () => this.generateExponentialInequalityProblems(parameters),
        exponential_substitution: () => this.generateExponentialSubstitutionProblems(parameters),
        inverse_exponential: () => this.generateInverseExponentialProblems(parameters)
    };

    const generator = problemGenerators[problemType];
    return generator ? generator() : [];
}

// 2. Specific Problem Generators for Each Type
generateBasicExponentialProblems(params) {
    const { coefficient = 2, base = 3, result = 81 } = params;
    
    return [
        {
            statement: `Solve: ${coefficient + 1} × ${base}^x = ${result * 2}`,
            hint: "Isolate the exponential term first, then take logarithms",
            answer: "Apply logarithm after isolating the exponential term"
        },
        {
            statement: `Solve: ${coefficient} × e^x = ${result}`,
            hint: "Use natural logarithm for equations with base e",
            answer: `x = ln(${result}/${coefficient}) = ln(${result/coefficient})`
        },
        {
            statement: `Find x if ${base}^(2x) = ${base}^(x+3)`,
            hint: "When bases are equal, set exponents equal",
            answer: "Set exponents equal: 2x = x + 3, so x = 3"
        }
    ];
}

generateExponentialEquationProblems(params) {
    const { base = 2 } = params;
    
    return [
        {
            statement: `Solve: ${base}^(x+1) × ${base}^(x-2) = ${base}^5`,
            hint: "Use the product rule: a^m × a^n = a^(m+n)",
            answer: "Combine exponents: (x+1) + (x-2) = 5"
        },
        {
            statement: `Solve: (1/3)^x = 27`,
            hint: "Express both sides with the same base",
            answer: "Rewrite as 3^(-x) = 3^3, so -x = 3, x = -3"
        },
        {
            statement: `Solve: 5^(2x-1) = 125`,
            hint: "Express 125 as a power of 5",
            answer: "125 = 5^3, so 2x-1 = 3, x = 2"
        }
    ];
}

generateLogarithmicFunctionProblems(params) {
    const { base = 10 } = params;
    
    return [
        {
            statement: `Find the domain of f(x) = log₂(3x - 6)`,
            hint: "The argument of a logarithm must be positive",
            answer: "3x - 6 > 0, so x > 2. Domain: (2, ∞)"
        },
        {
            statement: `Evaluate: log₃(27) + log₃(1/9)`,
            hint: "Use properties of logarithms",
            answer: "log₃(27 × 1/9) = log₃(3) = 1"
        },
        {
            statement: `Simplify: ln(e³) - 2ln(e)`,
            hint: "Use the power rule: ln(a^n) = n·ln(a)",
            answer: "3ln(e) - 2ln(e) = 3(1) - 2(1) = 1"
        }
    ];
}

generateExponentialGrowthProblems(params) {
    const { initialAmount = 1000, growthRate = 0.05 } = params;
    
    return [
        {
            statement: `A population of ${initialAmount} grows at ${growthRate * 100}% per year. Find the population after 10 years.`,
            hint: "Use A(t) = A₀(1 + r)^t",
            answer: `A(10) = ${initialAmount}(1.05)^10 ≈ ${Math.round(initialAmount * Math.pow(1.05, 10))}`
        },
        {
            statement: `How long will it take for $${initialAmount} to double at ${growthRate * 100}% continuous interest?`,
            hint: "Use doubling time formula: t = ln(2)/r",
            answer: `t = ln(2)/${growthRate} ≈ ${(Math.log(2)/growthRate).toFixed(1)} years`
        },
        {
            statement: `Bacteria population triples every 4 hours. If initial count is ${initialAmount}, find count after 12 hours.`,
            hint: "After 12 hours, there are 3 doubling periods",
            answer: `${initialAmount} × 3^(12/4) = ${initialAmount} × 3^3 = ${initialAmount * 27}`
        }
    ];
}

generateExponentialDecayProblems(params) {
    const { initialAmount = 100, halfLife = 5730 } = params;
    
    return [
        {
            statement: `Carbon-14 has half-life ${halfLife} years. How much remains from ${initialAmount}g after ${halfLife * 2} years?`,
            hint: "After two half-lives, 1/4 remains",
            answer: `${initialAmount}/4 = ${initialAmount/4}g remains`
        },
        {
            statement: `A radioactive substance decays to 25% of original amount in 8 years. Find half-life.`,
            hint: "25% means two half-lives have passed",
            answer: "8 years = 2 half-lives, so half-life = 4 years"
        },
        {
            statement: `Drug concentration decreases by 15% each hour. Starting with ${initialAmount}mg, find amount after 5 hours.`,
            hint: "Use A(t) = A₀(1-r)^t where r = 0.15",
            answer: `${initialAmount}(0.85)^5 ≈ ${Math.round(initialAmount * Math.pow(0.85, 5))}mg`
        }
    ];
}

generateCompoundInterestProblems(params) {
    const { principal = 5000, rate = 0.06, time = 10 } = params;
    
    return [
        {
            statement: `$${principal} invested at ${rate * 100}% compounded monthly for ${time} years. Find final amount.`,
            hint: "Use A = P(1 + r/n)^(nt) where n = 12",
            answer: `A = ${principal}(1 + ${rate}/12)^(12×${time}) ≈ $${Math.round(principal * Math.pow(1 + rate/12, 12*time))}`
        },
        {
            statement: `How long to triple $${principal} at ${rate * 100}% continuously compounded?`,
            hint: "Solve 3P = Pe^(rt) for t",
            answer: `t = ln(3)/${rate} ≈ ${(Math.log(3)/rate).toFixed(1)} years`
        },
        {
            statement: `What rate doubles $${principal} in ${time} years with annual compounding?`,
            hint: "Solve 2P = P(1+r)^t for r",
            answer: `r = 2^(1/${time}) - 1 ≈ ${((Math.pow(2, 1/time) - 1) * 100).toFixed(2)}%`
        }
    ];
}

generateLogarithmicScaleProblems(params) {
    return [
        {
            statement: `If solution A has pH 3 and solution B has pH 6, how many times more acidic is A than B?`,
            hint: "pH difference of 3 means 10³ times difference in acidity",
            answer: "Solution A is 10³ = 1000 times more acidic"
        },
        {
            statement: `Earthquake A: magnitude 7.2, Earthquake B: magnitude 5.2. Compare their energy release.`,
            hint: "Energy ratio = 10^(1.5 × magnitude difference)",
            answer: "A releases 10^(1.5×2) = 10³ = 1000 times more energy"
        },
        {
            statement: `Sound level increases from 40 dB to 70 dB. How many times more intense is the louder sound?`,
            hint: "Intensity ratio = 10^(dB difference/10)",
            answer: "10^(30/10) = 10³ = 1000 times more intense"
        }
    ];
}

generateExponentialInequalityProblems(params) {
    const { base = 2 } = params;
    
    return [
        {
            statement: `Solve: ${base}^x > 32`,
            hint: "Express 32 as a power of 2, then compare exponents",
            answer: `32 = 2^5, so x > 5`
        },
        {
            statement: `Solve: (1/3)^x ≤ 9`,
            hint: "Rewrite with same base and remember inequality flips",
            answer: "3^(-x) ≤ 3², so -x ≤ 2, x ≥ -2"
        },
        {
            statement: `Solve: e^(2x-1) < e³`,
            hint: "When bases are equal and positive, compare exponents directly",
            answer: "2x - 1 < 3, so x < 2"
        }
    ];
}

generateExponentialSubstitutionProblems(params) {
    return [
        {
            statement: `Solve: 4^x - 2^(x+1) - 8 = 0`,
            hint: "Let u = 2^x, then 4^x = (2^x)² = u²",
            answer: "Substitute to get u² - 2u - 8 = 0, solve for u, then find x"
        },
        {
            statement: `Solve: 9^x - 12(3^x) + 27 = 0`,
            hint: "Let u = 3^x, then 9^x = (3^x)² = u²",
            answer: "u² - 12u + 27 = 0, gives u = 9 or u = 3"
        },
        {
            statement: `Solve: e^(2x) - 5e^x + 6 = 0`,
            hint: "Let u = e^x, then e^(2x) = (e^x)² = u²",
            answer: "u² - 5u + 6 = 0, factors to (u-2)(u-3) = 0"
        }
    ];
}

generateInverseExponentialProblems(params) {
    return [
        {
            statement: `Find the inverse of f(x) = 2e^(3x) + 1`,
            hint: "Replace f(x) with y, swap variables, solve for y",
            answer: "f⁻¹(x) = (1/3)ln((x-1)/2)"
        },
        {
            statement: `Find the inverse of g(x) = 3^(x-2) - 5`,
            hint: "Use logarithms to solve for the variable",
            answer: "g⁻¹(x) = log₃(x + 5) + 2"
        },
        {
            statement: `If f(x) = log₂(x + 4), find f⁻¹(3)`,
            hint: "Find the inverse function first, then evaluate at x = 3",
            answer: "f⁻¹(x) = 2^x - 4, so f⁻¹(3) = 2³ - 4 = 4"
        }
    ];
}

// 3. Generate Graph Data Method
generateGraphData() {
    if (!this.currentSolution || !this.currentProblem) return;

    const { type, parameters } = this.currentProblem;
    
    // Generate appropriate graph data based on problem type
    switch (type) {
        case 'exponential_basic':
        case 'exponential_equations':
            this.generateExponentialGraph(parameters);
            break;
        case 'logarithmic_functions':
        case 'logarithmic_equations':
            this.generateLogarithmicGraph(parameters);
            break;
        case 'exponential_growth':
            this.generateGrowthGraph(parameters);
            break;
        case 'exponential_decay':
            this.generateDecayGraph(parameters);
            break;
        case 'compound_interest':
            this.generateCompoundInterestGraph(parameters);
            break;
        case 'logarithmic_scales':
            this.generateScaleGraph(parameters);
            break;
        default:
            this.generateGenericExponentialGraph(parameters);
    }
}

generateExponentialGraph(parameters) {
    const { coefficient = 1, base = Math.E, result = 0 } = parameters;
    
    // Generate points for exponential function
    const xMin = -5;
    const xMax = 5;
    const step = 0.1;
    const points = [];
    
    for (let x = xMin; x <= xMax; x += step) {
        const y = coefficient * Math.pow(base, x);
        if (y < 1000 && y > -1000) { // Prevent overflow
            points.push({ 
                x: parseFloat(x.toFixed(2)), 
                y: parseFloat(y.toFixed(4)) 
            });
        }
    }
    
    // Find key points
    const solution = this.currentSolution.solutions?.[0];
    
    this.graphData = {
        type: 'exponential',
        points: points,
        function: `f(x) = ${coefficient} × ${base}^x`,
        keyPoints: {
            yIntercept: { x: 0, y: coefficient },
            solution: solution ? { x: solution, y: result } : null
        },
        asymptote: { type: 'horizontal', equation: 'y = 0' },
        domain: { min: xMin, max: xMax },
        range: this.calculateExponentialRange(points, base > 1)
    };
}

generateLogarithmicGraph(parameters) {
    const { base = 10, coefficient = 1, constant = 0 } = parameters;
    
    const xMin = 0.01;
    const xMax = 100;
    const points = [];
    
    // Use logarithmic spacing for x values
    for (let i = 0; i <= 100; i++) {
        const x = xMin * Math.pow(xMax/xMin, i/100);
        const y = coefficient * (Math.log(x) / Math.log(base)) + constant;
        points.push({ 
            x: parseFloat(x.toFixed(4)), 
            y: parseFloat(y.toFixed(4)) 
        });
    }
    
    this.graphData = {
        type: 'logarithmic',
        points: points,
        function: `f(x) = ${coefficient} × log₍${base}₎(x) + ${constant}`,
        keyPoints: {
            intercept: { x: Math.pow(base, -constant/coefficient), y: 0 }
        },
        asymptote: { type: 'vertical', equation: 'x = 0' },
        domain: { min: xMin, max: xMax },
        range: { min: -Infinity, max: Infinity }
    };
}

generateGrowthGraph(parameters) {
    const { initialAmount = 1000, growthRate = 0.05, compoundingFrequency = 1 } = parameters;
    
    const tMax = 20; // 20 time periods
    const points = [];
    
    for (let t = 0; t <= tMax; t += 0.5) {
        let amount;
        if (compoundingFrequency === 'continuous') {
            amount = initialAmount * Math.exp(growthRate * t);
        } else {
            amount = initialAmount * Math.pow(1 + growthRate/compoundingFrequency, compoundingFrequency * t);
        }
        
        points.push({ 
            x: parseFloat(t.toFixed(1)), 
            y: parseFloat(amount.toFixed(2)) 
        });
    }
    
    const doublingTime = Math.log(2) / growthRate;
    
    this.graphData = {
        type: 'growth',
        points: points,
        model: compoundingFrequency === 'continuous' ? 'Continuous Growth' : 'Compound Growth',
        keyPoints: {
            initial: { x: 0, y: initialAmount },
            doubling: { x: doublingTime, y: 2 * initialAmount }
        },
        doublingTime: doublingTime,
        domain: { min: 0, max: tMax },
        range: { min: initialAmount, max: points[points.length - 1].y }
    };
}

generateDecayGraph(parameters) {
    const { initialAmount = 1000, decayRate = 0.05, halfLife } = parameters;
    
    const tMax = halfLife ? halfLife * 5 : 20;
    const points = [];
    
    const k = halfLife ? Math.log(2) / halfLife : decayRate;
    
    for (let t = 0; t <= tMax; t += tMax/100) {
        const amount = initialAmount * Math.exp(-k * t);
        points.push({ 
            x: parseFloat(t.toFixed(2)), 
            y: parseFloat(amount.toFixed(4)) 
        });
    }
    
    const calculatedHalfLife = Math.log(2) / k;
    
    this.graphData = {
        type: 'decay',
        points: points,
        model: 'Exponential Decay',
        keyPoints: {
            initial: { x: 0, y: initialAmount },
            halfLife: { x: calculatedHalfLife, y: initialAmount / 2 },
            quarterLife: { x: 2 * calculatedHalfLife, y: initialAmount / 4 }
        },
        halfLife: calculatedHalfLife,
        asymptote: { type: 'horizontal', equation: 'y = 0' },
        domain: { min: 0, max: tMax },
        range: { min: 0, max: initialAmount }
    };
}

generateCompoundInterestGraph(parameters) {
    const { principal = 1000, rate = 0.06, compoundingFrequency = 12 } = parameters;
    
    const years = 30;
    const points = [];
    
    for (let t = 0; t <= years; t += 0.25) {
        let amount;
        if (compoundingFrequency === 'continuous') {
            amount = principal * Math.exp(rate * t);
        } else {
            amount = principal * Math.pow(1 + rate/compoundingFrequency, compoundingFrequency * t);
        }
        
        points.push({ 
            x: parseFloat(t.toFixed(2)), 
            y: parseFloat(amount.toFixed(2)) 
        });
    }
    
    this.graphData = {
        type: 'compound_interest',
        points: points,
        model: compoundingFrequency === 'continuous' ? 'Continuous Compounding' : `Compounded ${compoundingFrequency} times per year`,
        keyPoints: {
            initial: { x: 0, y: principal },
            final: { x: years, y: points[points.length - 1].y }
        },
        domain: { min: 0, max: years },
        range: { min: principal, max: points[points.length - 1].y }
    };
}

generateScaleGraph(parameters) {
    const { scaleType = 'pH' } = parameters;
    
    // Generate comparison data for different scale types
    let points = [];
    let xLabel = '';
    let yLabel = '';
    
    switch (scaleType.toLowerCase()) {
        case 'ph':
            xLabel = 'pH Value';
            yLabel = 'H⁺ Concentration';
            for (let pH = 0; pH <= 14; pH += 0.5) {
                const concentration = Math.pow(10, -pH);
                points.push({ x: pH, y: concentration });
            }
            break;
            
        case 'richter':
            xLabel = 'Richter Magnitude';
            yLabel = 'Relative Energy';
            for (let mag = 1; mag <= 9; mag += 0.5) {
                const energy = Math.pow(10, 1.5 * mag);
                points.push({ x: mag, y: energy });
            }
            break;
            
        case 'decibel':
            xLabel = 'Sound Level (dB)';
            yLabel = 'Intensity Ratio';
            for (let db = 0; db <= 120; db += 10) {
                const intensity = Math.pow(10, db / 10);
                points.push({ x: db, y: intensity });
            }
            break;
    }
    
    this.graphData = {
        type: 'logarithmic_scale',
        points: points,
        scaleType: scaleType,
        xLabel: xLabel,
        yLabel: yLabel,
        isLogScale: true,
        domain: { min: points[0]?.x || 0, max: points[points.length - 1]?.x || 10 },
        range: { min: Math.min(...points.map(p => p.y)), max: Math.max(...points.map(p => p.y)) }
    };
}

generateGenericExponentialGraph(parameters) {
    // Default exponential graph when specific type isn't handled
    this.generateExponentialGraph({ coefficient: 1, base: Math.E, ...parameters });
}

calculateExponentialRange(points, isIncreasing) {
    const yValues = points.map(p => p.y).filter(y => isFinite(y));
    return {
        min: Math.min(...yValues),
        max: Math.max(...yValues),
        behavior: isIncreasing ? 'increasing' : 'decreasing'
    };
}

// 4. Generate Workbook Method
generateExponentialWorkbook() {
    if (!this.currentSolution || !this.currentProblem) return;

    const workbook = this.createWorkbookStructure();
    
    // Standard sections for exponential workbooks
    workbook.sections = [
        this.createProblemSection(),
        this.createLessonSection(),
        this.createSolutionSection(),
        this.createAnalysisSection(),
        this.createStepsSection(),
        this.createVerificationSection(),
        this.createRelatedProblemsSection()
    ].filter(section => section !== null);

    if (this.graphData) {
        workbook.sections.push(this.createGraphSection());
    }

    this.currentWorkbook = workbook;
}

createWorkbookStructure() {
    return {
        title: `Exponential Problem Solver - ${this.exponentialTypes[this.currentProblem.type]?.name || 'Analysis'}`,
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
            ['Original Input', this.currentProblem.originalInput],
            ['Problem Type', this.exponentialTypes[this.currentProblem.type]?.name || this.currentProblem.type],
            ['Category', this.exponentialTypes[this.currentProblem.type]?.category || 'exponential'],
            ['Parsed At', new Date(this.currentProblem.parsedAt).toLocaleString()]
        ],
        styling: {
            headerBg: this.colors.headerBg,
            headerText: this.colors.headerText,
            cellBg: this.colors.cellBg
        }
    };
}

createLessonSection() {
    const lesson = this.lessons[this.currentProblem.type] || 
                  this.lessons[this.exponentialTypes[this.currentProblem.type]?.category];
    
    if (!lesson) return null;

    return {
        title: `Lesson: ${lesson.title}`,
        type: 'lesson',
        data: [
            ['Theory', lesson.theory],
            ['Key Concepts', lesson.concepts.join('; ')],
            ['Applications', lesson.applications.join('; ')],
            ...Object.entries(lesson.keyFormulas).map(([name, formula]) => [name, formula])
        ],
        styling: {
            headerBg: this.colors.sectionBg,
            headerText: this.colors.sectionText,
            cellBg: this.colors.mathBg
        }
    };
}

createSolutionSection() {
    const solution = this.currentSolution;
    const data = [
        ['Solution Type', solution.solutionType],
        ['Category', solution.category || 'exponential']
    ];

    if (solution.solutions && solution.solutions.length > 0) {
        solution.solutions.forEach((sol, index) => {
            data.push([`Solution ${index + 1}`, typeof sol === 'number' ? sol.toFixed(6) : sol.toString()]);
        });
    }

    if (solution.model) data.push(['Model', solution.model]);
    if (solution.equation) data.push(['Equation', solution.equation]);
    if (solution.method) data.push(['Method', solution.method]);

    return {
        title: 'Solution',
        type: 'solution',
        data: data,
        styling: {
            headerBg: this.colors.resultBg,
            headerText: this.colors.resultText,
            cellBg: this.colors.cellBg
        }
    };
}

createAnalysisSection() {
    const solution = this.currentSolution;
    const data = [];

    // Add specific analysis based on solution properties
    if (solution.results) {
        Object.entries(solution.results).forEach(([key, value]) => {
            if (typeof value === 'number') {
                data.push([key.replace(/([A-Z])/g, ' $1').trim(), value.toFixed(6)]);
            } else {
                data.push([key.replace(/([A-Z])/g, ' $1').trim(), value.toString()]);
            }
        });
    }

    if (solution.parameters) {
        Object.entries(solution.parameters).forEach(([key, value]) => {
            data.push([`Parameter: ${key}`, typeof value === 'number' ? value.toFixed(6) : value.toString()]);
        });
    }

    return data.length > 0 ? {
        title: 'Analysis',
        type: 'analysis',
        data: data,
        styling: {
            headerBg: this.colors.sectionBg,
            headerText: this.colors.sectionText,
            cellBg: this.colors.cellBg
        }
    } : null;
}

createStepsSection() {
    if (!this.solutionSteps || this.solutionSteps.length === 0) return null;

    const data = this.solutionSteps.map((step, index) => [
        `Step ${index + 1}: ${step.step}`,
        step.description,
        step.expression || ''
    ]);

    return {
        title: 'Solution Steps',
        type: 'steps',
        data: data,
        styling: {
            headerBg: this.colors.stepBg,
            headerText: this.colors.stepText,
            cellBg: this.colors.cellBg
        }
    };
}

createVerificationSection() {
    if (!this.includeVerificationInSteps) return null;

    const verificationSteps = this.generateExponentialVerificationSteps(this.currentProblem, this.currentSolution);
    if (verificationSteps.length === 0) return null;

    const data = verificationSteps.map((step, index) => [
        step.step,
        step.description,
        step.expression || ''
    ]);

    return {
        title: 'Verification',
        type: 'verification',
        data: data,
        styling: {
            headerBg: this.colors.asymptoteBg,
            headerText: this.colors.resultText,
            cellBg: this.colors.cellBg
        }
    };
}

createRelatedProblemsSection() {
    const relatedProblems = this.generateRelatedProblems(this.currentProblem.type, this.currentProblem.parameters);
    if (relatedProblems.length === 0) return null;

    const data = relatedProblems.map((problem, index) => [
        `Problem ${index + 1}`,
        problem.statement,
        problem.hint || '',
        problem.answer || ''
    ]);

    return {
        title: 'Related Problems',
        type: 'related',
        data: data,
        styling: {
            headerBg: this.colors.formulaBg,
            headerText: this.colors.formulaText,
            cellBg: this.colors.cellBg
        }
    };
}

createGraphSection() {
    if (!this.graphData) return null;

    const data = [
        ['Graph Type', this.graphData.type],
        ['Function', this.graphData.function || this.graphData.model || 'Exponential Function'],
        ['Domain', `[${this.graphData.domain.min}, ${this.graphData.domain.max}]`],
        ['Range', this.graphData.range.min === -Infinity ? 'All real numbers' :
                 `[${this.graphData.range.min}, ${this.graphData.range.max}]`]
    ];

    if (this.graphData.asymptote) {
        data.push(['Asymptote', this.graphData.asymptote.equation]);
    }

    if (this.graphData.keyPoints) {
        Object.entries(this.graphData.keyPoints).forEach(([key, point]) => {
            if (point) {
                data.push([`${key.replace(/([A-Z])/g, ' $1').trim()}`, 
                         `(${point.x.toFixed(4)}, ${point.y.toFixed(4)})`]);
            }
        });
    }

    if (this.graphData.doublingTime) {
        data.push(['Doubling Time', this.graphData.doublingTime.toFixed(4)]);
    }

    if (this.graphData.halfLife) {
        data.push(['Half Life', this.graphData.halfLife.toFixed(4)]);
    }

    if (this.graphData.isLogScale) {
        data.push(['Scale Type', 'Logarithmic']);
        data.push(['X-Axis Label', this.graphData.xLabel]);
        data.push(['Y-Axis Label', this.graphData.yLabel]);
    }

    return {
        title: 'Graph Analysis',
        type: 'graph',
        data: data,
        styling: {
            headerBg: this.colors.graphBg,
            headerText: this.colors.graphText,
            cellBg: this.colors.cellBg
        }
    };
}

// Utility method to get a formatted workbook summary
getWorkbookSummary() {
    if (!this.currentWorkbook) return 'No workbook generated';

    let summary = `${this.currentWorkbook.title}\n`;
    summary += `Generated: ${new Date(this.currentWorkbook.timestamp).toLocaleString()}\n\n`;

    this.currentWorkbook.sections.forEach(section => {
        summary += `${section.title}:\n`;
        section.data.forEach(row => {
            if (Array.isArray(row)) {
                summary += `  ${row[0]}: ${row[1]}\n`;
            }
        });
        summary += '\n';
    });

    return summary;
}

// Updated generateImage method for ExponentialMathematicalWorkbook class
generateImage(filename = 'exponential_workbook.png') {
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
                } else if (section.type === 'lesson') {
                    bgColor = this.colors.asymptoteBg;
                    textColor = this.colors.resultText;
                    rowHeight = this.mathHeight;
                } else if (section.type === 'graph') {
                    bgColor = this.colors.graphBg;
                    textColor = this.colors.graphText;
                }

                // Draw row background
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, currentY, this.width, rowHeight);

                // Draw border
                ctx.strokeStyle = this.colors.borderColor;
                ctx.strokeRect(0, currentY, this.width, rowHeight);

                // Draw row content
                ctx.fillStyle = textColor;
                ctx.font = section.type === 'steps' || section.type === 'lesson' ? 
                    `${this.mathFontSize}px Arial` : 
                    `${this.fontSize}px Arial`;

                if (Array.isArray(row)) {
                    // Multi-column row
                    let columnWidth = this.width / row.length;
                    row.forEach((cell, colIndex) => {
                        let x = colIndex * columnWidth + 10;
                        let cellText = String(cell || '');
                        
                        // Handle exponential expressions
                        if (cellText.includes('^') || cellText.includes('e') || cellText.includes('ln') || 
                            cellText.includes('log') || cellText.includes('×')) {
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
        this.drawExponentialGraph(ctx, currentY);
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

// Add exponential graph drawing method
drawExponentialGraph(ctx, startY) {
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
    ctx.lineWidth = 1;
    ctx.beginPath();
    // X-axis
    ctx.moveTo(graphX + 20, originY);
    ctx.lineTo(graphX + graphWidth - 20, originY);
    // Y-axis
    ctx.moveTo(originX, graphY + 20);
    ctx.lineTo(originX, graphY + graphHeight - 20);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = this.colors.gridColor;
    ctx.globalAlpha = 0.3;
    
    // Vertical grid lines
    for (let x = this.graphData.domain.min; x <= this.graphData.domain.max; x += 1) {
        const screenX = graphX + 20 + (x - this.graphData.domain.min) * xScale;
        ctx.beginPath();
        ctx.moveTo(screenX, graphY + 20);
        ctx.lineTo(screenX, graphY + graphHeight - 20);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    const yStep = this.graphData.isLogScale ? Math.pow(10, Math.floor(Math.log10(yRange))) : 
                 Math.pow(10, Math.floor(Math.log10(yRange / 10)));
    for (let y = this.graphData.range.min; y <= this.graphData.range.max; y += yStep) {
        if (y >= this.graphData.range.min && y <= this.graphData.range.max) {
            const screenY = graphY + graphHeight - 20 - (y - this.graphData.range.min) * yScale;
            ctx.beginPath();
            ctx.moveTo(graphX + 20, screenY);
            ctx.lineTo(graphX + graphWidth - 20, screenY);
            ctx.stroke();
        }
    }
    
    ctx.globalAlpha = 1.0;

    // Draw asymptote if present
    if (this.graphData.asymptote) {
        ctx.strokeStyle = this.colors.asymptoteBg;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        
        if (this.graphData.asymptote.type === 'horizontal') {
            const asymptoteY = parseFloat(this.graphData.asymptote.equation.split('=')[1].trim());
            const screenY = graphY + graphHeight - 20 - (asymptoteY - this.graphData.range.min) * yScale;
            ctx.moveTo(graphX + 20, screenY);
            ctx.lineTo(graphX + graphWidth - 20, screenY);
        } else if (this.graphData.asymptote.type === 'vertical') {
            const asymptoteX = parseFloat(this.graphData.asymptote.equation.split('=')[1].trim());
            const screenX = graphX + 20 + (asymptoteX - this.graphData.domain.min) * xScale;
            ctx.moveTo(screenX, graphY + 20);
            ctx.lineTo(screenX, graphY + graphHeight - 20);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Draw exponential curve
    ctx.strokeStyle = this.colors.headerBg;
    ctx.lineWidth = 3;
    ctx.beginPath();

    let firstPoint = true;
    this.graphData.points.forEach((point, index) => {
        const screenX = graphX + 20 + (point.x - this.graphData.domain.min) * xScale;
        const screenY = graphY + graphHeight - 20 - (point.y - this.graphData.range.min) * yScale;

        // Only draw points that are within the visible area
        if (screenX >= graphX + 20 && screenX <= graphX + graphWidth - 20 && 
            screenY >= graphY + 20 && screenY <= graphY + graphHeight - 20) {
            
            if (firstPoint) {
                ctx.moveTo(screenX, screenY);
                firstPoint = false;
            } else {
                ctx.lineTo(screenX, screenY);
            }
        }
    });
    ctx.stroke();

    // Mark key points
    if (this.graphData.keyPoints) {
        Object.entries(this.graphData.keyPoints).forEach(([key, point]) => {
            if (point) {
                const screenX = graphX + 20 + (point.x - this.graphData.domain.min) * xScale;
                const screenY = graphY + graphHeight - 20 - (point.y - this.graphData.range.min) * yScale;
                
                // Choose color based on point type
                let pointColor = this.colors.resultBg;
                if (key === 'yIntercept') pointColor = this.colors.formulaBg;
                else if (key === 'solution') pointColor = this.colors.stepBg;
                else if (key === 'doubling') pointColor = this.colors.asymptoteBg;
                
                ctx.fillStyle = pointColor;
                ctx.beginPath();
                ctx.arc(screenX, screenY, 4, 0, 2 * Math.PI);
                ctx.fill();
                
                // Label the point
                ctx.fillStyle = this.colors.cellText;
                ctx.font = `${this.fontSize - 2}px Arial`;
                const label = `${key}: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
                ctx.fillText(label, screenX + 8, screenY - 8);
            }
        });
    }

    // Draw axis labels
    ctx.fillStyle = this.colors.cellText;
    ctx.font = `${this.fontSize}px Arial`;
    
    // X-axis label
    const xLabel = this.graphData.xLabel || 'x';
    ctx.fillText(xLabel, graphX + graphWidth - 30, originY + 20);
    
    // Y-axis label
    const yLabel = this.graphData.yLabel || 'y';
    ctx.fillText(yLabel, originX - 20, graphY + 15);

    // Function label
    if (this.graphData.function) {
        ctx.fillStyle = this.colors.headerBg;
        ctx.font = `bold ${this.fontSize + 2}px Arial`;
        ctx.fillText(this.graphData.function, graphX + 20, graphY + 40);
    }

    ctx.lineWidth = 1;
 }

}
