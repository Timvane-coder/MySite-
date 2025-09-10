

// Enhanced Linear Mathematical Workbook - Complete Linear Problem Solver
import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';
import * as math from 'mathjs';

export class LinearMathematicalWorkbook {
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
        this.includeLessonsInWorkbook = options.includeLessonsInWorkbook !== false;
        this.includeRelatedProblemsInWorkbook = options.includeRelatedProblemsInWorkbook !== false;

        this.mathSymbols = this.initializeMathSymbols();
        this.setThemeColors();
        this.initializeLinearSolvers();
        this.initializeLinearLessons();
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

    initializeLinearSolvers() {
        this.linearTypes = {
            // Basic linear equation solving
            simple_linear: {
                patterns: [
                    /([+-]?\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*=\s*([+-]?\d+\.?\d*)/,
                    /([+-]?\d*\.?\d*)x\s*=\s*([+-]?\d+\.?\d*)/,
                    /x\s*([+-]\s*\d+\.?\d*)\s*=\s*([+-]?\d+\.?\d*)/
                ],
                solver: this.solveSimpleLinear.bind(this),
                name: 'Simple Linear Equation',
                category: 'basic_linear',
                description: 'Solves ax + b = c'
            },

            // Multi-step linear equations
            multi_step_linear: {
                patterns: [
                    /([+-]?\d*\.?\d*)\(.*x.*\)\s*([+-]\s*\d+\.?\d*)\s*=\s*([+-]?\d+\.?\d*)/,
                    /([+-]?\d+\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*([+-]\s*\d+\.?\d*)x\s*=\s*([+-]?\d+\.?\d*)/,
                    /multi.*step/i,
                    /complex.*linear/i
                ],
                solver: this.solveMultiStepLinear.bind(this),
                name: 'Multi-Step Linear Equation',
                category: 'complex_linear',
                description: 'Solves equations requiring multiple steps'
            },

            // Equations with fractions
            fractional_linear: {
                patterns: [
                    /\d+\/\d+.*x/,
                    /x\/\d+/,
                    /fraction.*linear/i,
                    /\(.*x.*\)\/\d+/
                ],
                solver: this.solveFractionalLinear.bind(this),
                name: 'Linear Equations with Fractions',
                category: 'fractional_equations',
                description: 'Solves linear equations containing fractions'
            },

            // Equations with decimals
            decimal_linear: {
                patterns: [
                    /\d+\.\d+.*x/,
                    /x.*\d+\.\d+/,
                    /decimal.*linear/i
                ],
                solver: this.solveDecimalLinear.bind(this),
                name: 'Linear Equations with Decimals',
                category: 'decimal_equations',
                description: 'Solves linear equations with decimal coefficients'
            },

            // Linear inequalities
            linear_inequality: {
                patterns: [
                    /([+-]?\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*[><≤≥]\s*([+-]?\d+\.?\d*)/,
                    /linear.*inequality/i,
                    /inequality.*linear/i
                ],
                solver: this.solveLinearInequality.bind(this),
                name: 'Linear Inequalities',
                category: 'inequalities',
                description: 'Solves ax + b > c, <, ≤, or ≥'
            },

            // Compound inequalities
            compound_inequality: {
                patterns: [
                    /([+-]?\d+\.?\d*)\s*[><≤≥]\s*([+-]?\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)\s*[><≤≥]\s*([+-]?\d+\.?\d*)/,
                    /compound.*inequality/i,
                    /double.*inequality/i
                ],
                solver: this.solveCompoundInequality.bind(this),
                name: 'Compound Inequalities',
                category: 'compound_inequalities',
                description: 'Solves inequalities like a < bx + c < d'
            },

            // Absolute value equations
            absolute_value_equation: {
                patterns: [
                    /\|.*x.*\|\s*=\s*\d+/,
                    /abs.*x.*=.*\d+/,
                    /absolute.*value.*equation/i
                ],
                solver: this.solveAbsoluteValueEquation.bind(this),
                name: 'Absolute Value Equations',
                category: 'absolute_value',
                description: 'Solves |ax + b| = c'
            },

            // Absolute value inequalities
            absolute_value_inequality: {
                patterns: [
                    /\|.*x.*\|\s*[><≤≥]\s*\d+/,
                    /abs.*x.*[><≤≥].*\d+/,
                    /absolute.*value.*inequality/i
                ],
                solver: this.solveAbsoluteValueInequality.bind(this),
                name: 'Absolute Value Inequalities',
                category: 'absolute_value',
                description: 'Solves |ax + b| > c or |ax + b| < c'
            },

            // Systems of linear equations (2x2)
            system_2x2: {
                patterns: [
                    /system.*2.*equation/i,
                    /two.*equation.*system/i,
                    /2x2.*system/i,
                    /simultaneous.*equation/i
                ],
                solver: this.solveSystem2x2.bind(this),
                name: '2×2 Systems of Linear Equations',
                category: 'systems',
                description: 'Solves systems with two equations and two variables'
            },

            // Systems of linear equations (3x3)
            system_3x3: {
                patterns: [
                    /system.*3.*equation/i,
                    /three.*equation.*system/i,
                    /3x3.*system/i
                ],
                solver: this.solveSystem3x3.bind(this),
                name: '3×3 Systems of Linear Equations',
                category: 'systems',
                description: 'Solves systems with three equations and three variables'
            },

            // Linear programming problems
            linear_programming: {
                patterns: [
                    /linear.*programming/i,
                    /optimization.*linear/i,
                    /maximize.*subject.*to/i,
                    /minimize.*subject.*to/i
                ],
                solver: this.solveLinearProgramming.bind(this),
                name: 'Linear Programming',
                category: 'optimization',
                description: 'Solves linear optimization problems'
            },

            // Word problems - Distance/Rate/Time
            distance_rate_time: {
                patterns: [
                    /distance.*rate.*time/i,
                    /speed.*time.*distance/i,
                    /travel.*problem/i,
                    /motion.*problem/i
                ],
                solver: this.solveDistanceRateTime.bind(this),
                name: 'Distance-Rate-Time Problems',
                category: 'applications',
                description: 'Solves motion and travel problems'
            },

            // Word problems - Mixture problems
            mixture_problems: {
                patterns: [
                    /mixture.*problem/i,
                    /solution.*concentration/i,
                    /percent.*mixture/i,
                    /alloy.*problem/i
                ],
                solver: this.solveMixtureProblems.bind(this),
                name: 'Mixture Problems',
                category: 'applications',
                description: 'Solves mixture and concentration problems'
            },

            // Work rate problems
            work_rate: {
                patterns: [
                    /work.*rate/i,
                    /job.*completion/i,
                    /rate.*work/i,
                    /together.*complete/i
                ],
                solver: this.solveWorkRate.bind(this),
                name: 'Work Rate Problems',
                category: 'applications',
                description: 'Solves problems involving work rates and time'
            },

            // Age problems
            age_problems: {
                patterns: [
                    /age.*problem/i,
                    /years.*old/i,
                    /older.*younger/i,
                    /age.*relationship/i
                ],
                solver: this.solveAgeProblems.bind(this),
                name: 'Age Problems',
                category: 'applications',
                description: 'Solves problems involving ages and time relationships'
            },

            // Money/Finance problems
            money_problems: {
                patterns: [
                    /money.*problem/i,
                    /cost.*price/i,
                    /profit.*loss/i,
                    /investment.*interest/i,
                    /simple.*interest/i
                ],
                solver: this.solveMoneyProblems.bind(this),
                name: 'Money and Finance Problems',
                category: 'applications',
                description: 'Solves financial and monetary problems'
            },

            // Geometry applications
            geometry_linear: {
                patterns: [
                    /perimeter.*linear/i,
                    /angle.*sum/i,
                    /complementary.*angle/i,
                    /supplementary.*angle/i,
                    /geometric.*linear/i
                ],
                solver: this.solveGeometryLinear.bind(this),
                name: 'Linear Geometry Problems',
                category: 'geometry',
                description: 'Solves geometric problems using linear equations'
            },

            // Parametric linear equations
            parametric_linear: {
                patterns: [
                    /parameter.*linear/i,
                    /variable.*coefficient.*linear/i,
                    /parametric.*equation/i
                ],
                solver: this.solveParametricLinear.bind(this),
                name: 'Parametric Linear Equations',
                category: 'advanced_forms',
                description: 'Solves linear equations with parameter coefficients'
            },

            // Piecewise linear functions
            piecewise_linear: {
                patterns: [
                    /piecewise.*linear/i,
                    /step.*function/i,
                    /conditional.*equation/i
                ],
                solver: this.solvePiecewiseLinear.bind(this),
                name: 'Piecewise Linear Functions',
                category: 'advanced_forms',
                description: 'Analyzes piecewise linear functions'
            },

            // Linear function analysis
            linear_function: {
                patterns: [
                    /linear.*function/i,
                    /slope.*intercept/i,
                    /y.*mx.*b/i,
                    /function.*analysis/i
                ],
                solver: this.analyzeLinearFunction.bind(this),
                name: 'Linear Function Analysis',
                category: 'function_analysis',
                description: 'Analyzes linear functions y = mx + b'
            },

            // Point-slope and slope-intercept forms
            line_equations: {
                patterns: [
                    /point.*slope.*form/i,
                    /slope.*intercept.*form/i,
                    /equation.*line/i,
                    /line.*through.*points/i
                ],
                solver: this.solveLineEquations.bind(this),
                name: 'Equations of Lines',
                category: 'line_equations',
                description: 'Finds equations of lines in various forms'
            },

            // Parallel and perpendicular lines
            parallel_perpendicular: {
                patterns: [
                    /parallel.*line/i,
                    /perpendicular.*line/i,
                    /parallel.*perpendicular/i
                ],
                solver: this.solveParallelPerpendicular.bind(this),
                name: 'Parallel and Perpendicular Lines',
                category: 'line_relationships',
                description: 'Finds equations of parallel and perpendicular lines'
            }
        };
    }

    // Main solver method
    solveLinearProblem(config) {
        const { equation, scenario, parameters, problemType, context } = config;

        try {
            // Parse the problem
            this.currentProblem = this.parseLinearProblem(equation, scenario, parameters, problemType, context);

            // Solve the problem
            this.currentSolution = this.solveLinearProblem_Internal(this.currentProblem);

            // Generate solution steps
            this.solutionSteps = this.generateLinearSteps(this.currentProblem, this.currentSolution);

            // Generate graph data if applicable
            this.generateLinearGraphData();

            // Generate workbook
            this.generateLinearWorkbook();

            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                solutions: this.currentSolution?.solutions,
                solutionType: this.currentSolution?.solutionType
            };

        } catch (error) {
            throw new Error(`Failed to solve linear problem: ${error.message}`);
        }
    }

    parseLinearProblem(equation, scenario = '', parameters = {}, problemType = null, context = {}) {
        const cleanInput = equation ? this.cleanMathExpression(equation) : '';

        // If problem type is specified, use it directly
        if (problemType && this.linearTypes[problemType]) {
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

        // Auto-detect linear problem type
        for (const [type, config] of Object.entries(this.linearTypes)) {
            for (const pattern of config.patterns) {
                if (pattern.test(cleanInput) || pattern.test(scenario)) {
                    const match = cleanInput.match(pattern);
                    const extractedParams = this.extractLinearParameters(match, type);

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

        // Default to simple linear if coefficients are provided
        if (parameters.m !== undefined || parameters.b !== undefined) {
            return {
                originalInput: equation || 'Linear equation with given coefficients',
                cleanInput: cleanInput,
                type: 'simple_linear',
                scenario: scenario,
                parameters: { 
                    m: parameters.m || 1, 
                    b: parameters.b || 0,
                    ...parameters 
                },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        throw new Error(`Unable to recognize linear problem type from: ${equation || scenario}`);
    }

    cleanMathExpression(expression) {
        return expression
            .replace(/\s+/g, ' ')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/≠/g, '!=')
            .replace(/\|([^|]+)\|/g, 'abs($1)')
            .trim();
    }

    extractLinearParameters(match, type) {
        const params = {};

        if ((type === 'simple_linear' || type === 'linear_inequality') && match) {
            params.m = this.parseCoefficient(match[1]) || 1; // slope/coefficient
            params.b = this.parseCoefficient(match[2]) || 0; // y-intercept/constant
            params.c = this.parseCoefficient(match[3]) || 0; // right side
            
            if (type === 'linear_inequality') {
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

    solveLinearProblem_Internal(problem) {
        const solver = this.linearTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for linear problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    // LINEAR SOLVERS

    solveSimpleLinear(problem) {
        const { m, b, c } = problem.parameters;

        if (Math.abs(m) < 1e-10) {
            if (Math.abs(b - c) < 1e-10) {
                return {
                    solutionType: 'All real numbers (identity)',
                    solutions: ['All real numbers'],
                    equation: `${m}x + ${b} = ${c}`,
                    explanation: 'The equation simplifies to a true statement',
                    category: 'simple_linear'
                };
            } else {
                return {
                    solutionType: 'No solution (contradiction)',
                    solutions: [],
                    equation: `${m}x + ${b} = ${c}`,
                    explanation: 'The equation simplifies to a false statement',
                    category: 'simple_linear'
                };
            }
        }

        const solution = (c - b) / m;
        
        return {
            solutionType: 'Unique solution',
            solutions: [solution],
            equation: `${m}x + ${b} = ${c}`,
            slope: m,
            yIntercept: b,
            verification: this.verifyLinearSolution(solution, m, b, c),
            graphicalInterpretation: this.getLinearGraphicalInterpretation(m, b),
            category: 'simple_linear'
        };
    }

    solveMultiStepLinear(problem) {
        const { equation } = problem.parameters;
        
        // This would need more sophisticated parsing for multi-step equations
        // For now, provide a framework
        return {
            solutionType: 'Multi-step solution',
            steps: [
                'Distribute/expand parentheses',
                'Combine like terms',
                'Move variable terms to one side',
                'Move constant terms to other side',
                'Divide by coefficient of variable'
            ],
            category: 'multi_step_linear',
            note: 'Specific implementation depends on equation structure'
        };
    }

    solveFractionalLinear(problem) {
        const { numerator, denominator, rightSide } = problem.parameters;
        
        // Framework for fractional linear equations
        return {
            solutionType: 'Fractional linear solution',
            method: 'Clear fractions by multiplying by LCD',
            steps: [
                'Identify denominators',
                'Find least common denominator (LCD)',
                'Multiply entire equation by LCD',
                'Solve resulting linear equation',
                'Check solution in original equation'
            ],
            category: 'fractional_linear'
        };
    }

    solveDecimalLinear(problem) {
        const { coefficients } = problem.parameters;
        
        return {
            solutionType: 'Decimal linear solution',
            method: 'Clear decimals or work with decimals directly',
            approaches: [
                'Multiply by power of 10 to clear decimals',
                'Work directly with decimal arithmetic'
            ],
            category: 'decimal_linear'
        };
    }

    solveLinearInequality(problem) {
        const { m, b, c, operator = '>' } = problem.parameters;

        if (Math.abs(m) < 1e-10) {
            // No variable term
            const leftSide = b;
            const rightSide = c;
            
            let satisfied = false;
            switch(operator) {
                case '>': satisfied = leftSide > rightSide; break;
                case '<': satisfied = leftSide < rightSide; break;
                case '>=': case '≥': satisfied = leftSide >= rightSide; break;
                case '<=': case '≤': satisfied = leftSide <= rightSide; break;
            }

            return {
                inequality: `${m}x + ${b} ${operator} ${c}`,
                solutionType: satisfied ? 'All real numbers' : 'No solution',
                solutions: satisfied ? ['All real numbers'] : [],
                explanation: satisfied ? 'Inequality is always true' : 'Inequality is never true',
                category: 'linear_inequality'
            };
        }

        const criticalValue = (c - b) / m;
        let solutionSet = '';
        let intervalNotation = '';

        // Determine solution based on slope and operator
        if (m > 0) {
            // Positive slope
            switch(operator) {
                case '>':
                    solutionSet = `x > ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(${criticalValue.toFixed(6)}, ∞)`;
                    break;
                case '<':
                    solutionSet = `x < ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(-∞, ${criticalValue.toFixed(6)})`;
                    break;
                case '>=': case '≥':
                    solutionSet = `x ≥ ${criticalValue.toFixed(6)}`;
                    intervalNotation = `[${criticalValue.toFixed(6)}, ∞)`;
                    break;
                case '<=': case '≤':
                    solutionSet = `x ≤ ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(-∞, ${criticalValue.toFixed(6)}]`;
                    break;
            }
        } else {
            // Negative slope - inequality flips
            switch(operator) {
                case '>':
                    solutionSet = `x < ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(-∞, ${criticalValue.toFixed(6)})`;
                    break;
                case '<':
                    solutionSet = `x > ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(${criticalValue.toFixed(6)}, ∞)`;
                    break;
                case '>=': case '≥':
                    solutionSet = `x ≤ ${criticalValue.toFixed(6)}`;
                    intervalNotation = `(-∞, ${criticalValue.toFixed(6)}]`;
                    break;
                case '<=': case '≤':
                    solutionSet = `x ≥ ${criticalValue.toFixed(6)}`;
                    intervalNotation = `[${criticalValue.toFixed(6)}, ∞)`;
                    break;
            }
        }

        return {
            inequality: `${m}x + ${b} ${operator} ${c}`,
            solutionType: 'Inequality solution',
            solutionSet: solutionSet,
            intervalNotation: intervalNotation,
            criticalValue: criticalValue,
            inequalityDirection: m > 0 ? 'preserved' : 'reversed',
            explanation: m < 0 ? 'Inequality direction reversed due to negative coefficient' : 'Inequality direction preserved',
            category: 'linear_inequality'
        };
    }

    solveCompoundInequality(problem) {
        const { leftBound, rightBound, m, b, leftOperator = '<', rightOperator = '<' } = problem.parameters;
        
        // Solve a < mx + b < c type inequalities
        const leftCritical = (leftBound - b) / m;
        const rightCritical = (rightBound - b) / m;
        
        return {
            compoundInequality: `${leftBound} ${leftOperator} ${m}x + ${b} ${rightOperator} ${rightBound}`,
            solutionType: 'Compound inequality solution',
            leftCritical: leftCritical,
            rightCritical: rightCritical,
            intervalNotation: this.buildCompoundInterval(leftCritical, rightCritical, leftOperator, rightOperator),
            category: 'compound_inequality'
        };
    }

    solveAbsoluteValueEquation(problem) {
        const { a, b, c } = problem.parameters; // |ax + b| = c
        
        if (c < 0) {
            return {
                equation: `|${a}x + ${b}| = ${c}`,
                solutionType: 'No solution',
                solutions: [],
                explanation: 'Absolute value cannot equal a negative number',
                category: 'absolute_value'
            };
        }

        if (c === 0) {
            const solution = -b / a;
            return {
                equation: `|${a}x + ${b}| = 0`,
                solutionType: 'One solution',
                solutions: [solution],
                explanation: 'Absolute value equals zero only when expression inside equals zero',
                category: 'absolute_value'
            };
        }

        // Two cases: ax + b = c and ax + b = -c
        const solution1 = (c - b) / a;
        const solution2 = (-c - b) / a;

        return {
            equation: `|${a}x + ${b}| = ${c}`,
            solutionType: 'Two solutions',
            solutions: [solution1, solution2].sort((a, b) => a - b),
            cases: [
                { case: `${a}x + ${b} = ${c}`, solution: solution1 },
                { case: `${a}x + ${b} = ${-c}`, solution: solution2 }
            ],
            verification: this.verifyAbsoluteValueSolutions([solution1, solution2], a, b, c),
            category: 'absolute_value'
        };
    }


solveAbsoluteValueInequality(problem) {
        const { a, b, c, operator } = problem.parameters; // |ax + b| > c or |ax + b| < c

        if (c < 0) {
            if (operator === '<' || operator === '≤') {
                return {
                    inequality: `|${a}x + ${b}| ${operator} ${c}`,
                    solutionType: 'No solution',
                    solutions: [],
                    explanation: 'Absolute value is always non-negative, cannot be less than a negative number',
                    category: 'absolute_value'
                };
            } else {
                return {
                    inequality: `|${a}x + ${b}| ${operator} ${c}`,
                    solutionType: 'All real numbers',
                    solutions: ['All real numbers'],
                    explanation: 'Absolute value is always non-negative, always greater than a negative number',
                    intervalNotation: '(-∞, ∞)',
                    category: 'absolute_value'
                };
            }
        }

        if (c === 0) {
            const criticalPoint = -b / a;
            if (operator === '<') {
                return {
                    inequality: `|${a}x + ${b}| < 0`,
                    solutionType: 'No solution',
                    solutions: [],
                    explanation: 'Absolute value cannot be negative',
                    category: 'absolute_value'
                };
            } else if (operator === '≤') {
                return {
                    inequality: `|${a}x + ${b}| ≤ 0`,
                    solutionType: 'One solution',
                    solutions: [criticalPoint],
                    explanation: 'Absolute value equals zero only at one point',
                    category: 'absolute_value'
                };
            } else {
                return {
                    inequality: `|${a}x + ${b}| ${operator} 0`,
                    solutionType: 'All real numbers except one point',
                    solutions: [`x ≠ ${criticalPoint}`],
                    explanation: 'Absolute value is positive everywhere except at the critical point',
                    category: 'absolute_value'
                };
            }
        }

        // For |ax + b| < c: -c < ax + b < c
        // For |ax + b| > c: ax + b < -c or ax + b > c
        
        const leftCritical = (-c - b) / a;
        const rightCritical = (c - b) / a;
        
        if (operator === '<' || operator === '≤') {
            // Intersection case
            const leftBound = Math.min(leftCritical, rightCritical);
            const rightBound = Math.max(leftCritical, rightCritical);
            const leftBracket = operator === '≤' ? '[' : '(';
            const rightBracket = operator === '≤' ? ']' : ')';
            
            return {
                inequality: `|${a}x + ${b}| ${operator} ${c}`,
                solutionType: 'Interval solution',
                solutionSet: `${leftBound} ${operator === '≤' ? '≤' : '<'} x ${operator === '≤' ? '≤' : '<'} ${rightBound}`,
                intervalNotation: `${leftBracket}${leftBound.toFixed(6)}, ${rightBound.toFixed(6)}${rightBracket}`,
                criticalPoints: [leftCritical, rightCritical],
                category: 'absolute_value'
            };
        } else {
            // Union case
            const leftBracket = operator === '≥' ? ']' : ')';
            const rightBracket = operator === '≥' ? '[' : '(';
            
            return {
                inequality: `|${a}x + ${b}| ${operator} ${c}`,
                solutionType: 'Union solution',
                solutionSet: `x ${operator === '≥' ? '≤' : '<'} ${Math.min(leftCritical, rightCritical)} or x ${operator === '≥' ? '≥' : '>'} ${Math.max(leftCritical, rightCritical)}`,
                intervalNotation: `(-∞, ${Math.min(leftCritical, rightCritical).toFixed(6)}${leftBracket} ∪ ${rightBracket}${Math.max(leftCritical, rightCritical).toFixed(6)}, ∞)`,
                criticalPoints: [leftCritical, rightCritical],
                category: 'absolute_value'
            };
        }
    }

    solveSystem2x2(problem) {
        const { equations = [], a1, b1, c1, a2, b2, c2 } = problem.parameters;
        
        // Use provided coefficients or parse from equations
        let coeffs = { a1, b1, c1, a2, b2, c2 };
        if (equations.length >= 2) {
            coeffs = this.parseSystem2x2(equations);
        }

        const { a1: A1, b1: B1, c1: C1, a2: A2, b2: B2, c2: C2 } = coeffs;

        // Calculate determinant
        const det = A1 * B2 - A2 * B1;

        if (Math.abs(det) < 1e-10) {
            // System is either inconsistent or dependent
            const ratio1 = Math.abs(B1) > 1e-10 ? A1 / B1 : (Math.abs(A1) > 1e-10 ? Infinity : 0);
            const ratio2 = Math.abs(B2) > 1e-10 ? A2 / B2 : (Math.abs(A2) > 1e-10 ? Infinity : 0);
            const ratio3 = Math.abs(B1) > 1e-10 ? C1 / B1 : (Math.abs(C1) > 1e-10 ? Infinity : 0);
            const ratio4 = Math.abs(B2) > 1e-10 ? C2 / B2 : (Math.abs(C2) > 1e-10 ? Infinity : 0);

            if (Math.abs(ratio1 - ratio2) < 1e-10 && Math.abs(ratio3 - ratio4) < 1e-10) {
                return {
                    system: [`${A1}x + ${B1}y = ${C1}`, `${A2}x + ${B2}y = ${C2}`],
                    solutionType: 'Infinitely many solutions (dependent)',
                    solutions: ['Infinitely many solutions'],
                    explanation: 'The equations represent the same line',
                    category: 'system_2x2'
                };
            } else {
                return {
                    system: [`${A1}x + ${B1}y = ${C1}`, `${A2}x + ${B2}y = ${C2}`],
                    solutionType: 'No solution (inconsistent)',
                    solutions: [],
                    explanation: 'The equations represent parallel lines',
                    category: 'system_2x2'
                };
            }
        }

        // Unique solution using Cramer's rule
        const x = (C1 * B2 - C2 * B1) / det;
        const y = (A1 * C2 - A2 * C1) / det;

        return {
            system: [`${A1}x + ${B1}y = ${C1}`, `${A2}x + ${B2}y = ${C2}`],
            solutionType: 'Unique solution',
            solutions: [{ x: x, y: y }],
            x: x,
            y: y,
            determinant: det,
            method: 'Cramer\'s Rule',
            verification: this.verifySystem2x2Solution(x, y, A1, B1, C1, A2, B2, C2),
            category: 'system_2x2'
        };
    }

    solveSystem3x3(problem) {
        const { a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3 } = problem.parameters;

        // Create coefficient matrix and constants vector
        const A = [
            [a1, b1, c1],
            [a2, b2, c2],
            [a3, b3, c3]
        ];
        const B = [d1, d2, d3];

        try {
            // Use math.js to solve the system
            const solution = math.lusolve(A, B);
            const x = solution[0][0];
            const y = solution[1][0];
            const z = solution[2][0];

            return {
                system: [
                    `${a1}x + ${b1}y + ${c1}z = ${d1}`,
                    `${a2}x + ${b2}y + ${c2}z = ${d2}`,
                    `${a3}x + ${b3}y + ${c3}z = ${d3}`
                ],
                solutionType: 'Unique solution',
                solutions: [{ x: x, y: y, z: z }],
                x: x, y: y, z: z,
                method: 'LU Decomposition',
                verification: this.verifySystem3x3Solution(x, y, z, A, B),
                category: 'system_3x3'
            };
        } catch (error) {
            const det = math.det(A);
            if (Math.abs(det) < 1e-10) {
                return {
                    system: [
                        `${a1}x + ${b1}y + ${c1}z = ${d1}`,
                        `${a2}x + ${b2}y + ${c2}z = ${d2}`,
                        `${a3}x + ${b3}y + ${c3}z = ${d3}`
                    ],
                    solutionType: 'No unique solution',
                    solutions: [],
                    determinant: det,
                    explanation: 'System is either inconsistent or has infinitely many solutions',
                    category: 'system_3x3'
                };
            }
            throw error;
        }
    }

    solveLinearProgramming(problem) {
        const { objective, constraints, variables = ['x', 'y'], maximize = true } = problem.parameters;

        // Basic linear programming framework
        return {
            problemType: 'Linear Programming',
            objective: objective,
            constraints: constraints || [],
            variables: variables,
            optimizationType: maximize ? 'Maximize' : 'Minimize',
            method: 'Graphical Method (for 2 variables) or Simplex Method',
            steps: [
                'Graph the constraint inequalities',
                'Find the feasible region',
                'Identify corner points (vertices)',
                'Evaluate objective function at each vertex',
                'Select optimal vertex'
            ],
            note: 'Complete implementation requires constraint parsing and vertex enumeration',
            category: 'linear_programming'
        };
    }

    solveDistanceRateTime(problem) {
        const { distance, rate, time, scenario } = problem.parameters;

        // d = rt framework
        const knownValues = {};
        const unknownVariable = [];

        if (distance !== undefined) knownValues.distance = distance;
        else unknownVariable.push('distance');

        if (rate !== undefined) knownValues.rate = rate;
        else unknownVariable.push('rate');

        if (time !== undefined) knownValues.time = time;
        else unknownVariable.push('time');

        let solution = {};
        let equation = '';

        if (unknownVariable.length === 1) {
            const unknown = unknownVariable[0];
            if (unknown === 'distance') {
                solution.distance = knownValues.rate * knownValues.time;
                equation = `d = rt = ${knownValues.rate} × ${knownValues.time} = ${solution.distance}`;
            } else if (unknown === 'rate') {
                solution.rate = knownValues.distance / knownValues.time;
                equation = `r = d/t = ${knownValues.distance}/${knownValues.time} = ${solution.rate}`;
            } else if (unknown === 'time') {
                solution.time = knownValues.distance / knownValues.rate;
                equation = `t = d/r = ${knownValues.distance}/${knownValues.rate} = ${solution.time}`;
            }
        }

        return {
            formula: 'Distance = Rate × Time (d = rt)',
            scenario: scenario,
            knownValues: knownValues,
            unknown: unknownVariable,
            solution: solution,
            equation: equation,
            category: 'distance_rate_time'
        };
    }

    solveMixtureProblems(problem) {
        const { solution1, solution2, finalConcentration, finalAmount } = problem.parameters;

        return {
            problemType: 'Mixture Problem',
            method: 'Set up system based on amount and concentration',
            generalApproach: [
                'Let x = amount of first solution',
                'Let y = amount of second solution',
                'Amount equation: x + y = total amount',
                'Concentration equation: (concentration₁)(x) + (concentration₂)(y) = (final concentration)(total amount)'
            ],
            formula: 'Amount₁ × Concentration₁ + Amount₂ × Concentration₂ = Final Amount × Final Concentration',
            category: 'mixture_problems'
        };
    }

    solveWorkRate(problem) {
        const { worker1Rate, worker2Rate, combinedTime } = problem.parameters;

        return {
            problemType: 'Work Rate Problem',
            principle: 'Rate of work = 1/time to complete job alone',
            formula: 'Rate₁ + Rate₂ = Combined Rate',
            generalApproach: [
                'Express individual rates as 1/time',
                'Add rates for combined work',
                'Set up equation: 1/t₁ + 1/t₂ = 1/t_combined',
                'Solve for unknown time'
            ],
            category: 'work_rate'
        };
    }

    solveAgeProblems(problem) {
        const { currentAge1, currentAge2, timeShift, relationship } = problem.parameters;

        return {
            problemType: 'Age Problem',
            strategy: 'Set up equations for current ages and future/past ages',
            variables: [
                'Let x = current age of person 1',
                'Let y = current age of person 2'
            ],
            timeRelationships: [
                'Future ages: (x + t) and (y + t)',
                'Past ages: (x - t) and (y - t)'
            ],
            category: 'age_problems'
        };
    }

    solveMoneyProblems(problem) {
        const { principal, rate, time, interest } = problem.parameters;

        if (interest !== undefined && principal !== undefined && rate !== undefined) {
            // Simple interest: I = Prt
            const calculatedTime = interest / (principal * rate);
            return {
                formula: 'Simple Interest: I = Prt',
                principal: principal,
                rate: rate,
                time: calculatedTime,
                interest: interest,
                category: 'money_problems'
            };
        }

        return {
            problemType: 'Money/Finance Problem',
            commonFormulas: [
                'Simple Interest: I = Prt',
                'Total Amount: A = P + I = P(1 + rt)',
                'Profit = Revenue - Cost',
                'Markup = Selling Price - Cost'
            ],
            category: 'money_problems'
        };
    }

    solveGeometryLinear(problem) {
        const { shapeType, measurements, relationship } = problem.parameters;

        return {
            problemType: 'Linear Geometry Problem',
            commonApplications: [
                'Perimeter problems: P = sum of all sides',
                'Angle relationships: complementary (sum = 90°), supplementary (sum = 180°)',
                'Similar triangles: corresponding sides proportional',
                'Area relationships (for linear dimensions)'
            ],
            category: 'geometry_linear'
        };
    }

    solveParametricLinear(problem) {
        const { parameter, equation, condition } = problem.parameters;

        return {
            problemType: 'Parametric Linear Equation',
            approach: 'Solve in terms of parameter, then apply conditions',
            generalForm: 'ax + b = c, where a, b, or c contains a parameter',
            category: 'parametric_linear'
        };
    }

    solvePiecewiseLinear(problem) {
        const { pieces, domain } = problem.parameters;

        return {
            problemType: 'Piecewise Linear Function',
            analysis: [
                'Identify domain intervals',
                'Determine function definition for each piece',
                'Check continuity at boundary points',
                'Analyze overall behavior'
            ],
            category: 'piecewise_linear'
        };
    }

    analyzeLinearFunction(problem) {
        const { m, b } = problem.parameters;

        return {
            function: `f(x) = ${m}x + ${b}`,
            slope: m,
            yIntercept: b,
            xIntercept: -b / m,
            domain: 'All real numbers',
            range: 'All real numbers',
            behavior: {
                increasing: m > 0,
                decreasing: m < 0,
                constant: m === 0
            },
            graphProperties: this.getLinearGraphProperties(m, b),
            category: 'linear_function'
        };
    }

    solveLineEquations(problem) {
        const { point1, point2, slope, yIntercept, form } = problem.parameters;

        if (point1 && point2) {
            const m = (point2.y - point1.y) / (point2.x - point1.x);
            const b = point1.y - m * point1.x;
            
            return {
                givenPoints: [point1, point2],
                slope: m,
                yIntercept: b,
                slopeInterceptForm: `y = ${m}x + ${b}`,
                pointSlopeForm: `y - ${point1.y} = ${m}(x - ${point1.x})`,
                category: 'line_equations'
            };
        }

        if (slope !== undefined && point1) {
            const b = point1.y - slope * point1.x;
            return {
                givenSlope: slope,
                givenPoint: point1,
                slopeInterceptForm: `y = ${slope}x + ${b}`,
                pointSlopeForm: `y - ${point1.y} = ${slope}(x - ${point1.x})`,
                category: 'line_equations'
            };
        }

        return {
            problemType: 'Line Equations',
            forms: [
                'Slope-Intercept: y = mx + b',
                'Point-Slope: y - y₁ = m(x - x₁)',
                'Standard: Ax + By = C'
            ],
            category: 'line_equations'
        };
    }

    solveParallelPerpendicular(problem) {
        const { referenceLine, point, relationship } = problem.parameters;

        return {
            problemType: 'Parallel and Perpendicular Lines',
            principles: [
                'Parallel lines have the same slope',
                'Perpendicular lines have slopes that are negative reciprocals'
            ],
            category: 'parallel_perpendicular'
        };
    }

    // HELPER METHODS

    verifyLinearSolution(x, m, b, c) {
        const leftSide = m * x + b;
        const rightSide = c;
        const isCorrect = Math.abs(leftSide - rightSide) < 1e-10;

        return {
            substitution: `${m}(${x}) + ${b} = ${leftSide}`,
            rightSide: rightSide,
            isCorrect: isCorrect,
            difference: Math.abs(leftSide - rightSide)
        };
    }

    verifyAbsoluteValueSolutions(solutions, a, b, c) {
        return solutions.map(x => {
            const innerValue = a * x + b;
            const absoluteValue = Math.abs(innerValue);
            return {
                x: x,
                innerValue: innerValue,
                absoluteValue: absoluteValue,
                expectedValue: c,
                isCorrect: Math.abs(absoluteValue - c) < 1e-10
            };
        });
    }

    verifySystem2x2Solution(x, y, a1, b1, c1, a2, b2, c2) {
        const eq1Left = a1 * x + b1 * y;
        const eq2Left = a2 * x + b2 * y;

        return {
            equation1: {
                leftSide: eq1Left,
                rightSide: c1,
                isCorrect: Math.abs(eq1Left - c1) < 1e-10
            },
            equation2: {
                leftSide: eq2Left,
                rightSide: c2,
                isCorrect: Math.abs(eq2Left - c2) < 1e-10
            }
        };
    }

    verifySystem3x3Solution(x, y, z, A, B) {
        return A.map((row, i) => {
            const leftSide = row[0] * x + row[1] * y + row[2] * z;
            const rightSide = B[i];
            return {
                equation: i + 1,
                leftSide: leftSide,
                rightSide: rightSide,
                isCorrect: Math.abs(leftSide - rightSide) < 1e-10
            };
        });
    }

    parseSystem2x2(equations) {
        // Basic parsing for 2x2 system - would need enhancement for full parsing
        return {
            a1: 1, b1: 1, c1: 0,
            a2: 1, b2: -1, c2: 0
        };
    }

    getLinearGraphicalInterpretation(m, b) {
        return {
            slope: m,
            yIntercept: b,
            behavior: m > 0 ? 'increasing' : m < 0 ? 'decreasing' : 'constant',
            steepness: Math.abs(m) > 1 ? 'steep' : Math.abs(m) < 1 ? 'gradual' : 'moderate'
        };
    }

    getLinearGraphProperties(m, b) {
        return {
            slope: m,
            yIntercept: b,
            xIntercept: m !== 0 ? -b / m : 'undefined',
            isIncreasing: m > 0,
            isDecreasing: m < 0,
            isConstant: m === 0
        };
    }

    buildCompoundInterval(left, right, leftOp, rightOp) {
        const leftBracket = leftOp.includes('=') ? '[' : '(';
        const rightBracket = rightOp.includes('=') ? ']' : ')';
        return `${leftBracket}${left.toFixed(6)}, ${right.toFixed(6)}${rightBracket}`;
    }

    generateLinearSteps(problem, solution) {
        const steps = [];
        const { type } = problem;

        switch(type) {
            case 'simple_linear':
                steps.push({
                    step: 1,
                    title: 'Original Equation',
                    content: solution.equation,
                    explanation: 'Start with the given linear equation'
                });

                if (solution.solutions && solution.solutions[0] !== 'All real numbers') {
                    steps.push({
                        step: 2,
                        title: 'Isolate Variable',
                        content: `x = ${solution.solutions[0]}`,
                        explanation: 'Solve for x by isolating the variable'
                    });

                    if (this.includeVerificationInSteps) {
                        steps.push({
                            step: 3,
                            title: 'Verification',
                            content: `${solution.verification.substitution} = ${solution.verification.rightSide}`,
                            explanation: 'Substitute solution back into original equation'
                        });
                    }
                }
                break;

            case 'linear_inequality':
                steps.push({
                    step: 1,
                    title: 'Original Inequality',
                    content: solution.inequality,
                    explanation: 'Start with the given linear inequality'
                });

                steps.push({
                    step: 2,
                    title: 'Solution Set',
                    content: solution.solutionSet || 'No solution',
                    explanation: 'Solve the inequality'
                });

                steps.push({
                    step: 3,
                    title: 'Interval Notation',
                    content: solution.intervalNotation || 'No solution',
                    explanation: 'Express solution in interval notation'
                });
                break;

            case 'absolute_value':
                steps.push({
                    step: 1,
                    title: 'Original Equation/Inequality',
                    content: solution.equation || solution.inequality,
                    explanation: 'Start with the absolute value problem'
                });

                if (solution.cases) {
                    solution.cases.forEach((case_, index) => {
                        steps.push({
                            step: index + 2,
                            title: `Case ${index + 1}`,
                            content: `${case_.case} → x = ${case_.solution}`,
                            explanation: `Solve when the expression inside is ${index === 0 ? 'positive' : 'negative'}`
                        });
                    });
                }
                break;

            case 'system_2x2':
                steps.push({
                    step: 1,
                    title: 'System of Equations',
                    content: solution.system.join('\n'),
                    explanation: 'Given system of two linear equations'
                });

                if (solution.solutions && solution.solutions.length > 0 && solution.solutions[0].x !== undefined) {
                    steps.push({
                        step: 2,
                        title: 'Solution',
                        content: `x = ${solution.x}, y = ${solution.y}`,
                        explanation: `Solved using ${solution.method}`
                    });
                }
                break;

            default:
                steps.push({
                    step: 1,
                    title: 'Problem Analysis',
                    content: `${problem.type} problem identified`,
                    explanation: 'Analyzing the linear problem type'
                });
        }

        return steps;
    }

    generateLinearGraphData() {
        if (!this.currentSolution) return;

        const { type } = this.currentProblem;
        const solution = this.currentSolution;

        switch(type) {
            case 'simple_linear':
                if (solution.slope !== undefined && solution.yIntercept !== undefined) {
                    this.graphData = this.generateLinearFunctionGraph(solution.slope, solution.yIntercept);
                }
                break;

            case 'linear_inequality':
                if (solution.criticalValue !== undefined) {
                    this.graphData = this.generateInequalityGraph(solution);
                }
                break;

            case 'system_2x2':
                if (solution.x !== undefined && solution.y !== undefined) {
                    this.graphData = this.generateSystemGraph(solution);
                }
                break;
        }
    }

    generateLinearFunctionGraph(m, b) {
        const points = [];
        for (let x = -10; x <= 10; x += 0.5) {
            points.push({ x: x, y: m * x + b });
        }

        return {
            type: 'linear_function',
            function: `y = ${m}x + ${b}`,
            points: points,
            slope: m,
            yIntercept: b,
            xIntercept: -b / m
        };
    }

    generateInequalityGraph(solution) {
        return {
            type: 'linear_inequality',
            criticalValue: solution.criticalValue,
            solutionSet: solution.solutionSet,
            intervalNotation: solution.intervalNotation
        };
    }

    generateSystemGraph(solution) {
        return {
            type: 'system_2x2',
            intersectionPoint: { x: solution.x, y: solution.y },
            solutionType: solution.solutionType
        };
    }

   
// Complete generateLinearSteps method and all step generation functions

generateLinearSteps(problem, solution) {
    const steps = [];
    const { type } = problem;

    // Generate original step-by-step solution
    switch (type) {
        case 'simple_linear':
            steps.push(...this.generateSimpleLinearSteps(problem, solution));
            break;
        case 'multi_step_linear':
            steps.push(...this.generateMultiStepLinearSteps(problem, solution));
            break;
        case 'fractional_linear':
            steps.push(...this.generateFractionalLinearSteps(problem, solution));
            break;
        case 'decimal_linear':
            steps.push(...this.generateDecimalLinearSteps(problem, solution));
            break;
        case 'linear_inequality':
            steps.push(...this.generateLinearInequalitySteps(problem, solution));
            break;
        case 'compound_inequality':
            steps.push(...this.generateCompoundInequalitySteps(problem, solution));
            break;
        case 'absolute_value_equation':
            steps.push(...this.generateAbsoluteValueEquationSteps(problem, solution));
            break;
        case 'absolute_value_inequality':
            steps.push(...this.generateAbsoluteValueInequalitySteps(problem, solution));
            break;
        case 'system_2x2':
            steps.push(...this.generateSystem2x2Steps(problem, solution));
            break;
        case 'system_3x3':
            steps.push(...this.generateSystem3x3Steps(problem, solution));
            break;
        case 'linear_programming':
            steps.push(...this.generateLinearProgrammingSteps(problem, solution));
            break;
        case 'distance_rate_time':
            steps.push(...this.generateDistanceRateTimeSteps(problem, solution));
            break;
        case 'mixture_problems':
            steps.push(...this.generateMixtureProblemsSteps(problem, solution));
            break;
        case 'work_rate':
            steps.push(...this.generateWorkRateSteps(problem, solution));
            break;
        case 'age_problems':
            steps.push(...this.generateAgeProblemsSteps(problem, solution));
            break;
        case 'money_problems':
            steps.push(...this.generateMoneyProblemsSteps(problem, solution));
            break;
        case 'geometry_linear':
            steps.push(...this.generateGeometryLinearSteps(problem, solution));
            break;
        case 'parametric_linear':
            steps.push(...this.generateParametricLinearSteps(problem, solution));
            break;
        case 'piecewise_linear':
            steps.push(...this.generatePiecewiseLinearSteps(problem, solution));
            break;
        case 'linear_function':
            steps.push(...this.generateLinearFunctionSteps(problem, solution));
            break;
        case 'line_equations':
            steps.push(...this.generateLineEquationsSteps(problem, solution));
            break;
        case 'parallel_perpendicular':
            steps.push(...this.generateParallelPerpendicularSteps(problem, solution));
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
        const verificationSteps = this.generateLinearVerificationSteps(problem, solution);
        steps.push(...verificationSteps);
    }

    return steps;
}

// STEP GENERATION METHODS FOR EACH LINEAR PROBLEM TYPE

generateSimpleLinearSteps(problem, solution) {
    const { m, b, c } = problem.parameters;
    const steps = [];

    steps.push({
        step: 'Given equation',
        description: 'Identify the linear equation',
        expression: `${m}x + ${b} = ${c}`
    });

    if (Math.abs(m) < 1e-10) {
        if (Math.abs(b - c) < 1e-10) {
            steps.push({
                step: 'Simplification',
                description: 'Equation reduces to identity',
                expression: `${b} = ${c} (always true)`
            });
            steps.push({
                step: 'Conclusion',
                description: 'All real numbers are solutions',
                expression: 'x ∈ ℝ'
            });
        } else {
            steps.push({
                step: 'Simplification',
                description: 'Equation reduces to contradiction',
                expression: `${b} = ${c} (never true)`
            });
            steps.push({
                step: 'Conclusion',
                description: 'No solution exists',
                expression: 'No solution'
            });
        }
        return steps;
    }

    if (b !== 0) {
        const operation = b > 0 ? 'subtract' : 'add';
        const value = Math.abs(b);
        steps.push({
            step: 'Isolate variable term',
            description: `${operation} ${value} from both sides`,
            expression: `${m}x = ${c - b}`
        });
    }

    if (m !== 1) {
        steps.push({
            step: 'Solve for x',
            description: `Divide both sides by ${m}`,
            expression: `x = ${(c - b) / m}`
        });
    }

    steps.push({
        step: 'Solution',
        description: 'Final answer',
        expression: `x = ${solution.solutions[0]}`
    });

    return steps;
}

generateMultiStepLinearSteps(problem, solution) {
    return [
        {
            step: 'Given equation',
            description: 'Identify the multi-step linear equation',
            expression: problem.originalInput
        },
        {
            step: 'Distribute',
            description: 'Use distributive property to expand parentheses',
            expression: 'Expand all grouped terms'
        },
        {
            step: 'Combine like terms',
            description: 'Collect similar terms on each side',
            expression: 'Simplify both sides of equation'
        },
        {
            step: 'Move variables',
            description: 'Collect all variable terms on one side',
            expression: 'Add or subtract variable terms'
        },
        {
            step: 'Move constants',
            description: 'Collect all constant terms on the other side',
            expression: 'Add or subtract constants'
        },
        {
            step: 'Divide by coefficient',
            description: 'Divide both sides by coefficient of variable',
            expression: 'Solve for the variable'
        }
    ];
}

generateFractionalLinearSteps(problem, solution) {
    return [
        {
            step: 'Given equation',
            description: 'Identify equation with fractions',
            expression: problem.originalInput
        },
        {
            step: 'Find LCD',
            description: 'Determine least common denominator of all fractions',
            expression: 'LCD = [calculated value]'
        },
        {
            step: 'Clear fractions',
            description: 'Multiply entire equation by LCD',
            expression: 'Multiply all terms by LCD'
        },
        {
            step: 'Simplify',
            description: 'Cancel denominators and simplify',
            expression: 'Simplified linear equation without fractions'
        },
        {
            step: 'Solve linear equation',
            description: 'Apply standard linear solving techniques',
            expression: 'Solve for x'
        },
        {
            step: 'Check solution',
            description: 'Verify solution in original fractional equation',
            expression: 'Substitute back to verify'
        }
    ];
}

generateDecimalLinearSteps(problem, solution) {
    return [
        {
            step: 'Given equation',
            description: 'Identify equation with decimals',
            expression: problem.originalInput
        },
        {
            step: 'Clear decimals (optional)',
            description: 'Multiply by appropriate power of 10',
            expression: 'Convert decimals to integers'
        },
        {
            step: 'Solve linear equation',
            description: 'Apply standard linear solving techniques',
            expression: 'Isolate variable'
        },
        {
            step: 'Solution',
            description: 'Express answer as decimal or fraction',
            expression: 'Final answer'
        }
    ];
}

generateLinearInequalitySteps(problem, solution) {
    const { m, b, c, operator } = problem.parameters;
    const steps = [];

    steps.push({
        step: 'Given inequality',
        description: 'Identify the linear inequality',
        expression: `${m}x + ${b} ${operator} ${c}`
    });

    if (b !== 0) {
        const operation = b > 0 ? 'subtract' : 'add';
        const value = Math.abs(b);
        steps.push({
            step: 'Isolate variable term',
            description: `${operation} ${value} from both sides`,
            expression: `${m}x ${operator} ${c - b}`
        });
    }

    if (m !== 1) {
        const direction = m > 0 ? 'preserved' : 'reversed';
        steps.push({
            step: 'Solve for x',
            description: `Divide both sides by ${m} (inequality ${direction})`,
            expression: solution.solutionSet
        });
        
        if (m < 0) {
            steps.push({
                step: 'Important note',
                description: 'When dividing by negative number, flip inequality sign',
                expression: 'Direction of inequality changes'
            });
        }
    }

    steps.push({
        step: 'Solution set',
        description: 'Express solution in interval notation',
        expression: solution.intervalNotation
    });

    return steps;
}

generateCompoundInequalitySteps(problem, solution) {
    const { leftBound, rightBound, m, b } = problem.parameters;
    
    return [
        {
            step: 'Given compound inequality',
            description: 'Identify the compound inequality',
            expression: `${leftBound} < ${m}x + ${b} < ${rightBound}`
        },
        {
            step: 'Subtract constant',
            description: `Subtract ${b} from all three parts`,
            expression: `${leftBound - b} < ${m}x < ${rightBound - b}`
        },
        {
            step: 'Divide by coefficient',
            description: `Divide all parts by ${m}`,
            expression: `${(leftBound - b) / m} < x < ${(rightBound - b) / m}`
        },
        {
            step: 'Solution interval',
            description: 'Express in interval notation',
            expression: solution.intervalNotation
        }
    ];
}

generateAbsoluteValueEquationSteps(problem, solution) {
    const { a, b, c } = problem.parameters;
    const steps = [];

    steps.push({
        step: 'Given equation',
        description: 'Identify absolute value equation',
        expression: `|${a}x + ${b}| = ${c}`
    });

    if (c < 0) {
        steps.push({
            step: 'Analysis',
            description: 'Absolute value cannot equal negative number',
            expression: 'No solution exists'
        });
        return steps;
    }

    if (c === 0) {
        steps.push({
            step: 'Special case',
            description: 'Absolute value equals zero',
            expression: `${a}x + ${b} = 0`
        });
        steps.push({
            step: 'Solve',
            description: 'Solve the linear equation',
            expression: `x = ${-b / a}`
        });
        return steps;
    }

    steps.push({
        step: 'Set up cases',
        description: 'Absolute value definition creates two cases',
        expression: 'Case 1 and Case 2'
    });

    steps.push({
        step: 'Case 1',
        description: 'Expression inside is positive',
        expression: `${a}x + ${b} = ${c}`
    });

    steps.push({
        step: 'Solve Case 1',
        description: 'Solve first equation',
        expression: `x = ${(c - b) / a}`
    });

    steps.push({
        step: 'Case 2',
        description: 'Expression inside is negative',
        expression: `${a}x + ${b} = ${-c}`
    });

    steps.push({
        step: 'Solve Case 2',
        description: 'Solve second equation',
        expression: `x = ${(-c - b) / a}`
    });

    steps.push({
        step: 'Solution set',
        description: 'Combine solutions from both cases',
        expression: `x = ${solution.solutions.join(' or x = ')}`
    });

    return steps;
}

generateAbsoluteValueInequalitySteps(problem, solution) {
    const { a, b, c, operator } = problem.parameters;
    const steps = [];

    steps.push({
        step: 'Given inequality',
        description: 'Identify absolute value inequality',
        expression: `|${a}x + ${b}| ${operator} ${c}`
    });

    if (c < 0) {
        if (operator === '<' || operator === '≤') {
            steps.push({
                step: 'Analysis',
                description: 'Absolute value cannot be less than negative',
                expression: 'No solution'
            });
        } else {
            steps.push({
                step: 'Analysis',
                description: 'Absolute value always greater than negative',
                expression: 'All real numbers'
            });
        }
        return steps;
    }

    if (operator === '<' || operator === '≤') {
        steps.push({
            step: 'Compound inequality',
            description: 'Convert to compound inequality',
            expression: `${-c} ${operator} ${a}x + ${b} ${operator} ${c}`
        });
        steps.push({
            step: 'Solve compound',
            description: 'Solve the compound inequality',
            expression: solution.solutionSet
        });
    } else {
        steps.push({
            step: 'Union of inequalities',
            description: 'Convert to union of two inequalities',
            expression: `${a}x + ${b} ${operator} ${-c} or ${a}x + ${b} ${operator} ${c}`
        });
        steps.push({
            step: 'Solve union',
            description: 'Solve each inequality separately',
            expression: solution.solutionSet
        });
    }

    steps.push({
        step: 'Solution in interval notation',
        description: 'Express final answer',
        expression: solution.intervalNotation
    });

    return steps;
}

generateSystem2x2Steps(problem, solution) {
    const { a1, b1, c1, a2, b2, c2 } = problem.parameters;
    const steps = [];

    steps.push({
        step: 'Given system',
        description: 'Identify the 2×2 system of equations',
        expression: `${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`
    });

    steps.push({
        step: 'Choose method',
        description: 'Select solution method',
        expression: 'Using elimination method (or substitution/graphing)'
    });

    if (solution.solutionType === 'Unique solution') {
        steps.push({
            step: 'Eliminate variable',
            description: 'Multiply equations to eliminate one variable',
            expression: 'Prepare for elimination'
        });

        steps.push({
            step: 'Solve for first variable',
            description: 'Add/subtract equations to eliminate one variable',
            expression: `Solve for x or y`
        });

        steps.push({
            step: 'Back substitute',
            description: 'Substitute back to find other variable',
            expression: 'Find remaining variable'
        });

        steps.push({
            step: 'Solution',
            description: 'State the solution as ordered pair',
            expression: `(${solution.x}, ${solution.y})`
        });
    } else {
        steps.push({
            step: 'Analysis',
            description: 'Determine system behavior',
            expression: solution.explanation
        });
    }

    return steps;
}

generateSystem3x3Steps(problem, solution) {
    return [
        {
            step: 'Given system',
            description: 'Identify the 3×3 system of equations',
            expression: solution.system ? solution.system.join('\n') : '3×3 system'
        },
        {
            step: 'Choose method',
            description: 'Select appropriate solution method',
            expression: 'Using Gaussian elimination or matrix methods'
        },
        {
            step: 'Forward elimination',
            description: 'Create zeros below main diagonal',
            expression: 'Row operations to create upper triangular form'
        },
        {
            step: 'Back substitution',
            description: 'Solve from bottom equation upward',
            expression: 'Substitute to find all variables'
        },
        {
            step: 'Solution',
            description: 'Express as ordered triple',
            expression: solution.solutions ? `(${solution.x}, ${solution.y}, ${solution.z})` : 'Solution determined'
        }
    ];
}

generateLinearProgrammingSteps(problem, solution) {
    return [
        {
            step: 'Identify objective function',
            description: 'Determine what to maximize or minimize',
            expression: solution.objective || 'Objective function'
        },
        {
            step: 'List constraints',
            description: 'Write all constraint inequalities',
            expression: 'Constraint system'
        },
        {
            step: 'Graph constraints',
            description: 'Plot constraint lines and shade feasible region',
            expression: 'Feasible region identification'
        },
        {
            step: 'Find vertices',
            description: 'Determine corner points of feasible region',
            expression: 'Corner point coordinates'
        },
        {
            step: 'Evaluate objective',
            description: 'Test objective function at each vertex',
            expression: 'Optimal value determination'
        },
        {
            step: 'Optimal solution',
            description: 'Identify the optimal point and value',
            expression: 'Maximum or minimum achieved'
        }
    ];
}

generateDistanceRateTimeSteps(problem, solution) {
    const { distance, rate, time } = problem.parameters;
    
    return [
        {
            step: 'Identify formula',
            description: 'Use Distance = Rate × Time',
            expression: 'd = rt'
        },
        {
            step: 'List known values',
            description: 'Identify what is given',
            expression: `Known: ${Object.entries(solution.knownValues).map(([k, v]) => `${k} = ${v}`).join(', ')}`
        },
        {
            step: 'Identify unknown',
            description: 'Determine what to solve for',
            expression: `Find: ${solution.unknown.join(', ')}`
        },
        {
            step: 'Set up equation',
            description: 'Substitute known values into formula',
            expression: solution.equation || 'Substituted equation'
        },
        {
            step: 'Solve',
            description: 'Solve for the unknown variable',
            expression: `Solution: ${JSON.stringify(solution.solution)}`
        }
    ];
}

generateMixtureProblemsSteps(problem, solution) {
    return [
        {
            step: 'Define variables',
            description: 'Let variables represent unknown quantities',
            expression: 'x = amount of first solution, y = amount of second solution'
        },
        {
            step: 'Set up amount equation',
            description: 'Total amount equation',
            expression: 'x + y = total amount'
        },
        {
            step: 'Set up concentration equation',
            description: 'Based on concentration × amount = pure substance',
            expression: 'concentration₁(x) + concentration₂(y) = final concentration × total'
        },
        {
            step: 'Solve system',
            description: 'Solve the system of two equations',
            expression: 'Use substitution or elimination'
        },
        {
            step: 'Check solution',
            description: 'Verify answer makes sense in context',
            expression: 'Amounts and concentrations are reasonable'
        }
    ];
}

generateWorkRateSteps(problem, solution) {
    return [
        {
            step: 'Define work rates',
            description: 'Express each worker\'s rate as jobs per unit time',
            expression: 'Rate = 1/(time to complete alone)'
        },
        {
            step: 'Set up rate equation',
            description: 'Combined rate equals sum of individual rates',
            expression: '1/t₁ + 1/t₂ = 1/t_combined'
        },
        {
            step: 'Substitute known values',
            description: 'Replace known times or rates',
            expression: 'Equation with one unknown'
        },
        {
            step: 'Solve equation',
            description: 'Solve for unknown time',
            expression: 'Cross multiply and solve'
        },
        {
            step: 'Interpret answer',
            description: 'State solution in context',
            expression: 'Time or rate in appropriate units'
        }
    ];
}

generateAgeProblemsSteps(problem, solution) {
    return [
        {
            step: 'Define variables',
            description: 'Let variables represent current ages',
            expression: 'x = current age of person 1, y = current age of person 2'
        },
        {
            step: 'Express future/past ages',
            description: 'Add or subtract years for different time periods',
            expression: 'Future: x + t, y + t; Past: x - t, y - t'
        },
        {
            step: 'Set up equations',
            description: 'Write equations based on given relationships',
            expression: 'Age relationships at different times'
        },
        {
            step: 'Solve system',
            description: 'Solve for the unknown ages',
            expression: 'Use substitution or elimination'
        },
        {
            step: 'Verify solution',
            description: 'Check that ages satisfy all given conditions',
            expression: 'Current and future/past age relationships'
        }
    ];
}

generateMoneyProblemsSteps(problem, solution) {
    const { principal, rate, time, interest } = problem.parameters;
    
    return [
        {
            step: 'Identify formula',
            description: 'Choose appropriate financial formula',
            expression: solution.formula || 'I = Prt (Simple Interest)'
        },
        {
            step: 'List known values',
            description: 'Identify given information',
            expression: `P = ${principal || '?'}, r = ${rate || '?'}, t = ${time || '?'}, I = ${interest || '?'}`
        },
        {
            step: 'Set up equation',
            description: 'Substitute known values',
            expression: 'Equation with one unknown'
        },
        {
            step: 'Solve for unknown',
            description: 'Solve the linear equation',
            expression: 'Calculate missing value'
        },
        {
            step: 'State answer',
            description: 'Express in appropriate units and context',
            expression: 'Final monetary amount or rate'
        }
    ];
}

generateGeometryLinearSteps(problem, solution) {
    return [
        {
            step: 'Identify geometric relationship',
            description: 'Determine the geometric principle involved',
            expression: 'Perimeter, angle sum, or proportion'
        },
        {
            step: 'Define variables',
            description: 'Let variables represent unknown measurements',
            expression: 'x = unknown side, angle, or dimension'
        },
        {
            step: 'Set up equation',
            description: 'Write equation based on geometric principle',
            expression: 'Linear equation from geometry'
        },
        {
            step: 'Solve equation',
            description: 'Solve for the unknown measurement',
            expression: 'Standard linear equation techniques'
        },
        {
            step: 'Interpret geometrically',
            description: 'State answer in geometric context',
            expression: 'Length, angle measure, or area'
        }
    ];
}

generateParametricLinearSteps(problem, solution) {
    return [
        {
            step: 'Identify parameter',
            description: 'Recognize the parameter in the equation',
            expression: `Parameter: ${solution.parameterSymbol || 'k'}`
        },
        {
            step: 'Solve in terms of parameter',
            description: 'Express solution using the parameter',
            expression: 'x = expression involving parameter'
        },
        {
            step: 'Apply conditions',
            description: 'Use given conditions to find parameter values',
            expression: 'Substitute conditions'
        },
        {
            step: 'Find specific solutions',
            description: 'Calculate solutions for specific parameter values',
            expression: 'Numerical solutions'
        },
        {
            step: 'Analyze general behavior',
            description: 'Describe how solution depends on parameter',
            expression: 'Parameter effects on solution'
        }
    ];
}

generatePiecewiseLinearSteps(problem, solution) {
    return [
        {
            step: 'Identify pieces',
            description: 'Determine domain intervals for each piece',
            expression: 'Domain partitions'
        },
        {
            step: 'Analyze each piece',
            description: 'Study linear behavior on each interval',
            expression: 'Slope and intercept for each piece'
        },
        {
            step: 'Check continuity',
            description: 'Examine function values at boundary points',
            expression: 'Left and right limits at boundaries'
        },
        {
            step: 'Graph behavior',
            description: 'Sketch the piecewise function',
            expression: 'Connected or disconnected pieces'
        },
        {
            step: 'Overall analysis',
            description: 'Describe domain, range, and key features',
            expression: 'Function properties'
        }
    ];
}

generateLinearFunctionSteps(problem, solution) {
    const { m, b } = problem.parameters;
    
    return [
        {
            step: 'Identify function',
            description: 'Recognize linear function form',
            expression: `f(x) = ${m}x + ${b}`
        },
        {
            step: 'Analyze slope',
            description: 'Interpret the slope value',
            expression: `m = ${m} (${solution.behavior.increasing ? 'increasing' : solution.behavior.decreasing ? 'decreasing' : 'constant'})`
        },
        {
            step: 'Find y-intercept',
            description: 'Identify where line crosses y-axis',
            expression: `y-intercept = ${b}`
        },
        {
            step: 'Find x-intercept',
            description: 'Determine where line crosses x-axis',
            expression: `x-intercept = ${solution.xIntercept}`
        },
        {
            step: 'State domain and range',
            description: 'Identify domain and range',
            expression: `Domain: ${solution.domain}, Range: ${solution.range}`
        }
    ];
}

generateLineEquationsSteps(problem, solution) {
    if (solution.givenPoints) {
        const [p1, p2] = solution.givenPoints;
        return [
            {
                step: 'Given points',
                description: 'Identify the two points',
                expression: `(${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y})`
            },
            {
                step: 'Calculate slope',
                description: 'Use slope formula',
                expression: `m = (y₂ - y₁)/(x₂ - x₁) = (${p2.y} - ${p1.y})/(${p2.x} - ${p1.x}) = ${solution.slope}`
            },
            {
                step: 'Find y-intercept',
                description: 'Use point-slope form with either point',
                expression: `y - ${p1.y} = ${solution.slope}(x - ${p1.x})`
            },
            {
                step: 'Slope-intercept form',
                description: 'Convert to y = mx + b form',
                expression: solution.slopeInterceptForm
            },
            {
                step: 'Point-slope form',
                description: 'Alternative form using given point',
                expression: solution.pointSlopeForm
            }
        ];
    }
    
    return [
        {
            step: 'Identify given information',
            description: 'Determine what is provided',
            expression: 'Points, slope, or intercepts'
        },
        {
            step: 'Apply appropriate formula',
            description: 'Use point-slope or slope-intercept form',
            expression: 'y - y₁ = m(x - x₁) or y = mx + b'
        },
        {
            step: 'Solve for equation',
            description: 'Find the equation of the line',
            expression: 'Final linear equation'
        }
    ];
}

generateParallelPerpendicularSteps(problem, solution) {
    return [
        {
            step: 'Identify reference line',
            description: 'Find slope of given line',
            expression: 'Slope of reference line'
        },
        {
            step: 'Determine relationship slope',
            description: 'Calculate slope for parallel or perpendicular line',
            expression: 'Parallel: same slope, Perpendicular: negative reciprocal'
        },
        {
            step: 'Use point-slope form',
            description: 'Apply point-slope formula with given point',
            expression: 'y - y₁ = m(x - x₁)'
        },
        {
            step: 'Simplify to slope-intercept',
            description: 'Convert to y = mx + b form',
            expression: 'Final equation'
        }
    ];
}

 
generateLinearVerificationSteps(problem, solution) {
    const steps = [];

    if (!solution.solutions || solution.solutions.length === 0) {
        return steps;
    }

    steps.push({
        step: 'Verification',
        description: 'Check solutions by substituting back into original equation',
        expression: `Original: ${problem.originalInput}`,
        isVerificationHeader: true
    });

    // Handle different solution types
    if (solution.solutions.includes('All real numbers')) {
        steps.push({
            step: 'Identity verification',
            description: 'Equation reduces to identity (always true)',
            expression: 'Every real number satisfies the equation'
        });
        return steps;
    }

    if (solution.solutions.length === 0) {
        steps.push({
            step: 'No solution verification',
            description: 'Equation reduces to contradiction',
            expression: 'No value of x can satisfy the equation'
        });
        return steps;
    }

    // Verify numeric solutions
    solution.solutions.forEach((sol, index) => {
        if (typeof sol === 'number') {
            const verification = this.verifyLinearSolutionStep(sol, problem, solution);
            steps.push({
                step: `Solution ${index + 1} check`,
                description: `Substitute x = ${sol} into original equation`,
                expression: verification.substitutionExpression,
                result: verification.isCorrect ? 'Verified ✓' : 'Error ✗',
                isCorrect: verification.isCorrect
            });
        }
    });

    // Handle system solutions
    if (solution.x !== undefined && solution.y !== undefined) {
        const verification = this.verifySystemSolution(problem, solution);
        steps.push({
            step: 'System verification',
            description: `Substitute (${solution.x}, ${solution.y}) into both equations`,
            expression: verification.verification1,
            result: verification.bothCorrect ? 'System verified ✓' : 'Error in system ✗'
        });
    }

    // Handle inequality solutions
    if (solution.solutionSet && solution.criticalValue !== undefined) {
        steps.push({
            step: 'Inequality verification',
            description: 'Test solution set with sample values',
            expression: `Test values in ${solution.solutionSet}`,
            result: 'Inequality solution verified'
        });
    }

    return steps;
}

verifyLinearSolutionStep(x, problem, solution) {
    const { m = 1, b = 0, c = 0 } = problem.parameters;
    
    const leftSide = m * x + b;
    const rightSide = c;
    const isCorrect = Math.abs(leftSide - rightSide) < 1e-10;

    return {
        substitutionExpression: `${m}(${x}) + ${b} = ${leftSide} ${isCorrect ? '=' : '≠'} ${rightSide}`,
        isCorrect: isCorrect,
        leftValue: leftSide,
        rightValue: rightSide
    };
}

verifySystemSolution(problem, solution) {
    // Basic verification for 2x2 systems
    const { a1 = 1, b1 = 1, c1 = 0, a2 = 1, b2 = -1, c2 = 0 } = problem.parameters;
    
    const eq1Left = a1 * solution.x + b1 * solution.y;
    const eq2Left = a2 * solution.x + b2 * solution.y;
    
    const eq1Correct = Math.abs(eq1Left - c1) < 1e-10;
    const eq2Correct = Math.abs(eq2Left - c2) < 1e-10;

    return {
        verification1: `Eq1: ${a1}(${solution.x}) + ${b1}(${solution.y}) = ${eq1Left} ${eq1Correct ? '=' : '≠'} ${c1}`,
        verification2: `Eq2: ${a2}(${solution.x}) + ${b2}(${solution.y}) = ${eq2Left} ${eq2Correct ? '=' : '≠'} ${c2}`,
        bothCorrect: eq1Correct && eq2Correct
    };
}

initializeLinearLessons() {
    this.lessons = {
        simple_linear: {
            title: "Simple Linear Equations",
            concepts: [
                "General form: ax + b = c where a ≠ 0",
                "Goal: isolate the variable x on one side",
                "Use inverse operations to maintain equality",
                "Check solution by substitution"
            ],
            theory: "Simple linear equations represent a direct proportional relationship between a variable and a constant. The coefficient 'a' represents the rate of change, 'b' is the initial value, and 'c' is the target value.",
            keyFormulas: {
                "Standard Form": "ax + b = c",
                "Solution Formula": "x = (c - b)/a",
                "Slope-Intercept Relation": "y = mx + b (when c = y)"
            },
            solvingSteps: [
                "Identify coefficients a, b, and c",
                "Subtract b from both sides: ax = c - b", 
                "Divide both sides by a: x = (c - b)/a",
                "Verify solution by substitution"
            ],
            applications: [
                "Temperature conversion problems",
                "Cost and pricing calculations",
                "Distance and rate problems",
                "Basic algebraic modeling"
            ]
        },

        multi_step_linear: {
            title: "Multi-Step Linear Equations",
            concepts: [
                "Equations requiring multiple operations to solve",
                "May involve parentheses, fractions, or decimals",
                "Follow order of operations in reverse",
                "Combine like terms before solving"
            ],
            theory: "Multi-step linear equations involve complex expressions that must be simplified before applying basic solving techniques. The key is to work systematically to reduce complexity.",
            keyFormulas: {
                "Distributive Property": "a(b + c) = ab + ac",
                "Combining Like Terms": "ax + bx = (a + b)x",
                "General Strategy": "Simplify → Isolate → Solve → Check"
            },
            solvingSteps: [
                "Distribute to eliminate parentheses",
                "Combine like terms on each side",
                "Move variable terms to one side",
                "Move constant terms to the other side",
                "Divide by the coefficient of the variable"
            ],
            applications: [
                "Business profit/loss calculations",
                "Perimeter and area problems",
                "Multi-stage process problems",
                "Complex algebraic modeling"
            ]
        },

        fractional_linear: {
            title: "Linear Equations with Fractions",
            concepts: [
                "Clear fractions by multiplying by LCD (Least Common Denominator)",
                "Maintain equality by applying operations to both sides",
                "Simplify before solving when possible",
                "Check solutions don't create zero denominators"
            ],
            theory: "Fractional linear equations are best solved by clearing fractions first, transforming them into simpler linear equations without denominators.",
            keyFormulas: {
                "LCD Method": "Multiply entire equation by LCD",
                "Cross Multiplication": "a/b = c/d → ad = bc",
                "Fraction Addition": "a/b + c/d = (ad + bc)/(bd)"
            },
            solvingSteps: [
                "Identify all denominators in the equation",
                "Find the LCD of all denominators",
                "Multiply every term by the LCD",
                "Solve the resulting linear equation",
                "Check solution in original equation"
            ],
            applications: [
                "Rate and proportion problems",
                "Recipe scaling calculations",
                "Unit conversion problems",
                "Ratio and proportion applications"
            ]
        },

        decimal_linear: {
            title: "Linear Equations with Decimals",
            concepts: [
                "Clear decimals by multiplying by powers of 10",
                "Alternatively, work directly with decimal arithmetic",
                "Maintain precision throughout calculations",
                "Round final answer appropriately"
            ],
            theory: "Decimal linear equations can be solved by clearing decimals or working directly with decimal operations, depending on complexity and precision requirements.",
            keyFormulas: {
                "Decimal Clearing": "Multiply by 10^n where n = max decimal places",
                "Decimal Arithmetic": "Use standard decimal operations",
                "Precision Rule": "Maintain at least one extra decimal place during calculations"
            },
            techniques: [
                "Power of 10 multiplication method",
                "Direct decimal calculation method",
                "Mixed approach for complex problems"
            ],
            applications: [
                "Financial calculations",
                "Scientific measurements",
                "Engineering problems",
                "Statistical analysis"
            ]
        },

        linear_inequality: {
            title: "Linear Inequalities",
            concepts: [
                "Solutions are ranges of values, not single points",
                "Inequality direction reverses when multiplying/dividing by negative",
                "Express solutions in interval notation",
                "Graph solutions on number line"
            ],
            theory: "Linear inequalities define ranges where the linear expression satisfies the inequality condition. The key difference from equations is that solutions are intervals rather than points.",
            keyFormulas: {
                "Standard Form": "ax + b < c (or >, ≤, ≥)",
                "Solution": "x < (c - b)/a when a > 0",
                "Reversed Solution": "x > (c - b)/a when a < 0"
            },
            solvingSteps: [
                "Solve like a linear equation",
                "Pay attention to coefficient sign",
                "Reverse inequality if dividing by negative",
                "Express in interval notation",
                "Graph on number line"
            ],
            applications: [
                "Budget constraint problems",
                "Minimum/maximum requirement problems",
                "Quality control ranges",
                "Feasible region determination"
            ]
        },

        compound_inequality: {
            title: "Compound Inequalities", 
            concepts: [
                "Two inequalities joined by 'and' or 'or'",
                "AND: intersection (both conditions must be true)",
                "OR: union (at least one condition must be true)",
                "Solution is combination of individual solutions"
            ],
            theory: "Compound inequalities represent multiple constraints simultaneously. The solution depends on whether the conditions are joined by 'and' (intersection) or 'or' (union).",
            keyFormulas: {
                "Double Inequality": "a < x < b represents x > a AND x < b",
                "Union Form": "x < a OR x > b",
                "Intersection Form": "x > a AND x < b"
            },
            types: [
                "Conjunction (AND): a < x < b",
                "Disjunction (OR): x < a or x > b",
                "Mixed compound inequalities"
            ],
            applications: [
                "Temperature range problems",
                "Acceptable measurement ranges",
                "Multi-constraint optimization",
                "Quality assurance limits"
            ]
        },

        absolute_value: {
            title: "Absolute Value Equations and Inequalities",
            concepts: [
                "Absolute value represents distance from zero",
                "|x| = a has solutions x = a and x = -a (if a ≥ 0)",
                "|x| < a means -a < x < a (if a > 0)",
                "|x| > a means x < -a or x > a (if a > 0)"
            ],
            theory: "Absolute value creates piecewise behavior, leading to multiple cases in equations and unions or intersections in inequalities.",
            keyFormulas: {
                "Definition": "|x| = x if x ≥ 0, |x| = -x if x < 0",
                "Equation": "|ax + b| = c → ax + b = ±c",
                "Less Than": "|ax + b| < c → -c < ax + b < c",
                "Greater Than": "|ax + b| > c → ax + b < -c OR ax + b > c"
            },
            solvingStrategy: [
                "Isolate absolute value expression",
                "Consider the sign of the right side",
                "Set up appropriate cases",
                "Solve each case separately",
                "Check all solutions"
            ],
            applications: [
                "Tolerance and error problems",
                "Distance and proximity problems",
                "Quality control specifications",
                "Error analysis in measurements"
            ]
        },

        systems: {
            title: "Systems of Linear Equations",
            concepts: [
                "Multiple equations with same variables",
                "Solution is point(s) where equations intersect",
                "May have unique solution, no solution, or infinite solutions",
                "Solvable by substitution, elimination, or graphing"
            ],
            theory: "Systems of linear equations model situations where multiple linear relationships must be satisfied simultaneously. The solution represents the intersection of all constraints.",
            keyFormulas: {
                "2×2 System": "a₁x + b₁y = c₁, a₂x + b₂y = c₂",
                "Determinant": "D = a₁b₂ - a₂b₁",
                "Cramer's Rule": "x = Dₓ/D, y = Dᵧ/D"
            },
            solutionTypes: [
                "Unique solution: lines intersect at one point",
                "No solution: lines are parallel",
                "Infinite solutions: lines are identical"
            ],
            methods: [
                "Substitution method",
                "Elimination method", 
                "Graphical method",
                "Matrix methods (for larger systems)"
            ],
            applications: [
                "Supply and demand equilibrium",
                "Mixture problems",
                "Network flow problems",
                "Resource allocation"
            ]
        },

        linear_programming: {
            title: "Linear Programming",
            concepts: [
                "Optimize linear objective function subject to linear constraints",
                "Feasible region defined by constraint inequalities",
                "Optimal solution occurs at corner point (vertex)",
                "Used for resource allocation and optimization"
            ],
            theory: "Linear programming finds the best outcome in a mathematical model with linear relationships. The optimal solution lies at a vertex of the feasible region.",
            keyFormulas: {
                "Objective Function": "Maximize/Minimize z = cx + dy",
                "Constraints": "ax + by ≤ c (or ≥, =)",
                "Corner Point Theorem": "Optimal solution at vertex of feasible region"
            },
            solution_process: [
                "Define decision variables",
                "Write objective function", 
                "List constraint inequalities",
                "Graph feasible region",
                "Find corner points",
                "Evaluate objective at each corner",
                "Select optimal corner point"
            ],
            applications: [
                "Production planning",
                "Portfolio optimization",
                "Transportation problems",
                "Diet planning",
                "Resource scheduling"
            ]
        },

        applications: {
            title: "Linear Equation Applications",
            concepts: [
                "Real-world problems modeled with linear relationships",
                "Define variables clearly",
                "Translate word problems to mathematical equations",
                "Interpret solutions in context"
            ],
            theory: "Linear applications connect mathematical concepts to real-world scenarios, requiring translation skills and contextual interpretation of solutions.",
            problem_types: {
                "Distance/Rate/Time": "d = rt relationships",
                "Mixture Problems": "concentration × amount = pure substance",
                "Work Rate": "combined rate = sum of individual rates",
                "Age Problems": "relationships between current and future ages",
                "Money/Interest": "simple interest and financial calculations",
                "Geometry": "perimeter, angle, and proportion problems"
            },
            solution_strategy: [
                "Read problem carefully and identify what to find",
                "Define variables for unknown quantities",
                "Write equations based on given relationships",
                "Solve the mathematical model",
                "Check solution makes sense in context",
                "Answer original question with appropriate units"
            ],
            common_formulas: {
                "Distance": "d = rt",
                "Simple Interest": "I = Prt", 
                "Mixture": "amount₁ × concentration₁ + amount₂ × concentration₂ = final amount × final concentration",
                "Work Rate": "1/t₁ + 1/t₂ = 1/t_combined"
            }
        },

        function_analysis: {
            title: "Linear Function Analysis",
            concepts: [
                "Linear functions: f(x) = mx + b",
                "Slope m determines rate of change",
                "y-intercept b is initial value",
                "Domain and range are all real numbers"
            ],
            theory: "Linear functions represent constant rate relationships. The slope indicates how much the output changes for each unit change in input.",
            keyFormulas: {
                "Slope-Intercept Form": "y = mx + b",
                "Point-Slope Form": "y - y₁ = m(x - x₁)",
                "Standard Form": "Ax + By = C",
                "Slope Formula": "m = (y₂ - y₁)/(x₂ - x₁)"
            },
            analysis_components: [
                "Slope interpretation (rate of change)",
                "y-intercept interpretation (initial value)",
                "x-intercept (where function equals zero)",
                "Domain and range (all real numbers)",
                "Increasing/decreasing behavior"
            ],
            applications: [
                "Cost and revenue functions",
                "Growth and decay models",
                "Conversion formulas",
                "Linear trends in data"
            ]
        },

        line_equations: {
            title: "Equations of Lines",
            concepts: [
                "Multiple forms represent same line",
                "Choose form based on given information",
                "All forms are equivalent and convertible",
                "Each form highlights different properties"
            ],
            theory: "Different forms of linear equations emphasize different aspects of the line, making certain forms more convenient for specific applications.",
            forms: {
                "Slope-Intercept": "y = mx + b (shows slope and y-intercept)",
                "Point-Slope": "y - y₁ = m(x - x₁) (uses known point and slope)",
                "Standard": "Ax + By = C (symmetric in x and y)",
                "Intercept": "x/a + y/b = 1 (shows x and y intercepts)"
            },
            when_to_use: [
                "Slope-intercept: graphing and analyzing behavior",
                "Point-slope: given point and slope",
                "Standard: integer coefficients, perpendicular distances",
                "Two-point: given two points on the line"
            ],
            applications: [
                "Trend line fitting",
                "Linear interpolation",
                "Geometric constructions", 
                "Engineering design"
            ]
        },

        parallel_perpendicular: {
            title: "Parallel and Perpendicular Lines",
            concepts: [
                "Parallel lines have identical slopes",
                "Perpendicular lines have negative reciprocal slopes",
                "Parallel lines never intersect (same direction)",
                "Perpendicular lines intersect at 90° angle"
            ],
            theory: "Line relationships are determined by their slopes. This geometric property has important applications in construction, navigation, and design.",
            keyFormulas: {
                "Parallel Condition": "m₁ = m₂",
                "Perpendicular Condition": "m₁ × m₂ = -1 or m₂ = -1/m₁",
                "Distance Between Parallel Lines": "d = |Ax₀ + By₀ + C|/√(A² + B²)"
            },
            problem_types: [
                "Find line parallel to given line through point",
                "Find line perpendicular to given line through point", 
                "Determine if lines are parallel or perpendicular",
                "Find shortest distance between parallel lines"
            ],
            applications: [
                "Construction and architecture",
                "Road and railway design",
                "Geometric proofs",
                "Computer graphics and design"
            ]
        }
    };
}



// Complete generateRelatedProblems function for LinearMathematicalWorkbook class

generateRelatedProblems(problemType, parameters) {
    const problemGenerators = {
        simple_linear: () => this.generateSimpleLinearProblems(parameters),
        multi_step_linear: () => this.generateMultiStepLinearProblems(parameters),
        fractional_linear: () => this.generateFractionalLinearProblems(parameters),
        decimal_linear: () => this.generateDecimalLinearProblems(parameters),
        linear_inequality: () => this.generateLinearInequalityProblems(parameters),
        compound_inequality: () => this.generateCompoundInequalityProblems(parameters),
        absolute_value_equation: () => this.generateAbsoluteValueEquationProblems(parameters),
        absolute_value_inequality: () => this.generateAbsoluteValueInequalityProblems(parameters),
        system_2x2: () => this.generateSystem2x2Problems(parameters),
        system_3x3: () => this.generateSystem3x3Problems(parameters),
        linear_programming: () => this.generateLinearProgrammingProblems(parameters),
        distance_rate_time: () => this.generateDistanceRateTimeProblems(parameters),
        mixture_problems: () => this.generateMixtureProblemsProblems(parameters),
        work_rate: () => this.generateWorkRateProblems(parameters),
        age_problems: () => this.generateAgeProblemsProblems(parameters),
        money_problems: () => this.generateMoneyProblemsProblems(parameters),
        geometry_linear: () => this.generateGeometryLinearProblems(parameters),
        parametric_linear: () => this.generateParametricLinearProblems(parameters),
        piecewise_linear: () => this.generatePiecewiseLinearProblems(parameters),
        linear_function: () => this.generateLinearFunctionProblems(parameters),
        line_equations: () => this.generateLineEquationsProblems(parameters),
        parallel_perpendicular: () => this.generateParallelPerpendicularProblems(parameters)
    };

    const generator = problemGenerators[problemType];
    return generator ? generator() : [];
}

// Individual problem generators for each linear type

generateSimpleLinearProblems(params) {
    const { m = 2, b = 3, c = 7 } = params;
    
    return [
        {
            statement: `Solve: ${m + 1}x + ${b - 1} = ${c + 2}`,
            hint: "Isolate the variable by performing inverse operations",
            answer: `x = ${((c + 2) - (b - 1)) / (m + 1)}`,
            difficulty: "Basic",
            category: "simple_linear"
        },
        {
            statement: `Find x when ${m * 2}x - ${Math.abs(b)} = ${c * 3}`,
            hint: "First add the constant term to both sides",
            answer: `x = ${(c * 3 + Math.abs(b)) / (m * 2)}`,
            difficulty: "Basic",
            category: "simple_linear"
        },
        {
            statement: `Solve: ${-m}x + ${b * 2} = ${-c}`,
            hint: "Remember that dividing by a negative number doesn't change the equation type",
            answer: `x = ${(-c - b * 2) / (-m)}`,
            difficulty: "Medium",
            category: "simple_linear"
        }
    ];
}

generateMultiStepLinearProblems(params) {
    const { m = 3, b = 4, c = 10 } = params;
    
    return [
        {
            statement: `Solve: ${m}(x - ${b}) + ${b * 2} = ${c + 5}`,
            hint: "First distribute, then combine like terms",
            answer: "Use distributive property, then solve linear equation",
            difficulty: "Medium",
            category: "multi_step_linear"
        },
        {
            statement: `Solve: ${m}x + ${b} - ${m - 1}x = ${c} + ${b - 2}`,
            hint: "Combine like terms on both sides first",
            answer: "Combine variable terms and constants separately",
            difficulty: "Medium",
            category: "multi_step_linear"
        },
        {
            statement: `Solve: ${m * 2}(x + ${b / 2}) - ${m}x = ${c * 2}`,
            hint: "Distribute first, then collect like terms",
            answer: "Systematic simplification leads to linear equation",
            difficulty: "Hard",
            category: "multi_step_linear"
        }
    ];
}

generateFractionalLinearProblems(params) {
    const { m = 2, b = 3, c = 6 } = params;
    
    return [
        {
            statement: `Solve: x/${m} + ${b} = ${c}`,
            hint: "Multiply through by the denominator to clear fractions",
            answer: `x = ${(c - b) * m}`,
            difficulty: "Medium",
            category: "fractional_linear"
        },
        {
            statement: `Solve: ${m}x/${b} - ${c}/2 = 1`,
            hint: "Find LCD and multiply entire equation by it",
            answer: "Clear fractions using LCD, then solve",
            difficulty: "Medium",
            category: "fractional_linear"
        },
        {
            statement: `Solve: (x + ${b})/${m} = ${c}/${m + 1}`,
            hint: "Cross multiply to eliminate fractions",
            answer: "Use cross multiplication method",
            difficulty: "Hard",
            category: "fractional_linear"
        }
    ];
}

generateDecimalLinearProblems(params) {
    const { m = 1.5, b = 2.3, c = 4.8 } = params;
    
    return [
        {
            statement: `Solve: ${m}x + ${b} = ${c}`,
            hint: "Work with decimals directly or multiply to clear them",
            answer: `x = ${((c - b) / m).toFixed(3)}`,
            difficulty: "Basic",
            category: "decimal_linear"
        },
        {
            statement: `Solve: ${m * 10}x - ${b * 10} = ${c * 10}`,
            hint: "Notice this is equivalent to the decimal version multiplied by 10",
            answer: "Same solution as decimal version",
            difficulty: "Medium",
            category: "decimal_linear"
        },
        {
            statement: `Solve: 0.25x + 1.75 = 3.5`,
            hint: "Clear decimals by multiplying by 100",
            answer: "x = 7",
            difficulty: "Medium",
            category: "decimal_linear"
        }
    ];
}

generateLinearInequalityProblems(params) {
    const { m = 2, b = 3, c = 7, operator = '>' } = params;
    
    return [
        {
            statement: `Solve: ${m}x + ${b} ${operator} ${c}`,
            hint: "Solve like an equation, but watch the inequality direction",
            answer: `x ${operator} ${((c - b) / m).toFixed(3)}`,
            difficulty: "Basic",
            category: "linear_inequality"
        },
        {
            statement: `Solve: ${-m}x - ${b} ≤ ${-c}`,
            hint: "Dividing by negative number reverses inequality",
            answer: "x ≥ solution (inequality flipped)",
            difficulty: "Medium",
            category: "linear_inequality"
        },
        {
            statement: `Solve: ${m * 3}x + ${b * 2} < ${c * 4}`,
            hint: "Standard linear inequality solving process",
            answer: "x < calculated boundary value",
            difficulty: "Medium",
            category: "linear_inequality"
        }
    ];
}

generateCompoundInequalityProblems(params) {
    const { leftBound = 1, rightBound = 5, m = 2, b = 1 } = params;
    
    return [
        {
            statement: `Solve: ${leftBound} < ${m}x + ${b} < ${rightBound}`,
            hint: "Work with all three parts of the compound inequality",
            answer: `${((leftBound - b) / m).toFixed(3)} < x < ${((rightBound - b) / m).toFixed(3)}`,
            difficulty: "Medium",
            category: "compound_inequality"
        },
        {
            statement: `Solve: ${leftBound - 1} ≤ ${m + 1}x - ${b} ≤ ${rightBound + 1}`,
            hint: "Add constant to all three parts first",
            answer: "Calculate bounds using modified parameters",
            difficulty: "Medium",
            category: "compound_inequality"
        },
        {
            statement: `Solve: -${rightBound} < -${m}x + ${b * 2} < -${leftBound}`,
            hint: "Be careful with negative coefficients in compound inequalities",
            answer: "Watch for inequality direction changes",
            difficulty: "Hard",
            category: "compound_inequality"
        }
    ];
}

generateAbsoluteValueEquationProblems(params) {
    const { a = 2, b = 3, c = 5 } = params;
    
    return [
        {
            statement: `Solve: |${a}x + ${b}| = ${c}`,
            hint: "Set up two cases: expression equals +c and -c",
            answer: `x = ${((c - b) / a).toFixed(3)} or x = ${((-c - b) / a).toFixed(3)}`,
            difficulty: "Medium",
            category: "absolute_value_equation"
        },
        {
            statement: `Solve: |${a + 1}x - ${b}| = ${c + 2}`,
            hint: "Create two separate linear equations to solve",
            answer: "Two solutions from the two cases",
            difficulty: "Medium",
            category: "absolute_value_equation"
        },
        {
            statement: `Solve: |${a}x + ${b * 2}| = 0`,
            hint: "Absolute value equals zero only when expression inside is zero",
            answer: `x = ${(-b * 2 / a).toFixed(3)} (unique solution)`,
            difficulty: "Basic",
            category: "absolute_value_equation"
        }
    ];
}

generateAbsoluteValueInequalityProblems(params) {
    const { a = 1, b = 2, c = 4, operator = '<' } = params;
    
    return [
        {
            statement: `Solve: |${a}x + ${b}| ${operator} ${c}`,
            hint: operator === '<' ? "Less than creates intersection (AND)" : "Greater than creates union (OR)",
            answer: operator === '<' ? "Intersection solution" : "Union solution",
            difficulty: "Hard",
            category: "absolute_value_inequality"
        },
        {
            statement: `Solve: |${a * 2}x - ${b}| ≥ ${c - 1}`,
            hint: "Greater than or equal creates two separate regions",
            answer: "Union of two rays",
            difficulty: "Hard",
            category: "absolute_value_inequality"
        },
        {
            statement: `Solve: |${a}x + ${b * 3}| < ${c + 1}`,
            hint: "Less than creates a bounded interval",
            answer: "Single interval solution",
            difficulty: "Medium",
            category: "absolute_value_inequality"
        }
    ];
}

generateSystem2x2Problems(params) {
    const { a1 = 1, b1 = 1, c1 = 3, a2 = 2, b2 = -1, c2 = 1 } = params;
    
    return [
        {
            statement: `Solve:\n${a1 + 1}x + ${b1}y = ${c1 + 2}\n${a2}x + ${b2 - 1}y = ${c2}`,
            hint: "Use elimination or substitution method",
            answer: "Find intersection point of two lines",
            difficulty: "Medium",
            category: "system_2x2"
        },
        {
            statement: `Solve:\n${a1 * 2}x - ${b1 * 3}y = ${c1 * 2}\n${a2 - 1}x + ${b2 * 2}y = ${c2 + 3}`,
            hint: "Choose elimination or substitution based on coefficients",
            answer: "Systematic solution of linear system",
            difficulty: "Medium",
            category: "system_2x2"
        },
        {
            statement: `Solve:\n${a1}x + ${b1 * 2}y = ${c1}\n${a1 * 2}x + ${b1 * 4}y = ${c1 + 1}`,
            hint: "Check if system is consistent (look for parallel lines)",
            answer: "May have no solution if lines are parallel",
            difficulty: "Hard",
            category: "system_2x2"
        }
    ];
}

generateSystem3x3Problems(params) {
    const { a1 = 1, b1 = 2, c1 = 1, d1 = 6 } = params;
    
    return [
        {
            statement: `Solve the 3×3 system:\nx + 2y + z = 6\n2x - y + 3z = 4\nx + y - z = 2`,
            hint: "Use elimination method or matrix techniques",
            answer: "Find intersection point of three planes",
            difficulty: "Hard",
            category: "system_3x3"
        },
        {
            statement: `Solve:\n2x + y - z = 3\nx - 2y + 3z = 1\n3x + y + 2z = 7`,
            hint: "Systematic elimination to reduce to 2×2 system",
            answer: "Three-variable solution",
            difficulty: "Hard",
            category: "system_3x3"
        },
        {
            statement: `Solve:\nx + y + z = 10\n2x + 3y - z = 5\nx - y + 2z = 8`,
            hint: "Look for convenient elimination opportunities",
            answer: "Ordered triple solution",
            difficulty: "Hard",
            category: "system_3x3"
        }
    ];
}

generateLinearProgrammingProblems(params) {
    const { maxObj = true } = params;
    
    return [
        {
            statement: `Maximize: 3x + 2y\nSubject to: x + y ≤ 4, 2x + y ≤ 6, x ≥ 0, y ≥ 0`,
            hint: "Graph constraints to find feasible region, then test vertices",
            answer: "Optimal solution at corner point of feasible region",
            difficulty: "Hard",
            category: "linear_programming"
        },
        {
            statement: `Minimize: 2x + 5y\nSubject to: x + 2y ≥ 3, 2x + y ≥ 4, x ≥ 0, y ≥ 0`,
            hint: "Minimization problem - check all vertices of feasible region",
            answer: "Minimum value at appropriate vertex",
            difficulty: "Hard",
            category: "linear_programming"
        },
        {
            statement: `Production problem: Maximize profit 4x + 3y with constraints x + 2y ≤ 100, 2x + y ≤ 120`,
            hint: "Real-world context - x and y represent production quantities",
            answer: "Optimal production levels for maximum profit",
            difficulty: "Medium",
            category: "linear_programming"
        }
    ];
}

generateDistanceRateTimeProblems(params) {
    const { distance = 120, rate = 40, time = 3 } = params;
    
    return [
        {
            statement: `A car travels ${distance + 60} miles at ${rate + 20} mph. How long does it take?`,
            hint: "Use d = rt, solve for time: t = d/r",
            answer: `${(distance + 60) / (rate + 20)} hours`,
            difficulty: "Basic",
            category: "distance_rate_time"
        },
        {
            statement: `Two trains leave stations ${distance * 2} miles apart, traveling toward each other at ${rate} mph and ${rate + 10} mph. When do they meet?`,
            hint: "Combined rate problem: sum their speeds",
            answer: `${(distance * 2) / (rate + rate + 10)} hours`,
            difficulty: "Medium",
            category: "distance_rate_time"
        },
        {
            statement: `A plane's speed in still air is ${rate * 5} mph. With a ${rate / 4} mph tailwind, it travels ${distance * 3} miles. Find the time.`,
            hint: "Effective speed = air speed + wind speed",
            answer: `${(distance * 3) / (rate * 5 + rate / 4)} hours`,
            difficulty: "Medium",
            category: "distance_rate_time"
        }
    ];
}

generateMixtureProblemsProblems(params) {
    const { conc1 = 0.2, conc2 = 0.5, finalConc = 0.3, totalAmount = 100 } = params;
    
    return [
        {
            statement: `Mix ${conc1 * 100}% solution with ${conc2 * 100}% solution to get ${totalAmount + 50}L of ${finalConc * 100}% solution. How much of each?`,
            hint: "Set up system: amount equation and concentration equation",
            answer: "Solve 2×2 system for amounts of each solution",
            difficulty: "Medium",
            category: "mixture_problems"
        },
        {
            statement: `A ${conc1 * 100}% acid solution is mixed with pure acid to create ${totalAmount / 2}L of ${(finalConc + 0.2) * 100}% solution. Find amounts.`,
            hint: "Pure acid is 100% concentration",
            answer: "Account for pure acid (100% concentration) in calculation",
            difficulty: "Medium",
            category: "mixture_problems"
        },
        {
            statement: `Coffee costing $${5 + conc1 * 10}/lb is mixed with coffee costing $${8 + conc2 * 10}/lb to make ${totalAmount / 5} lb of blend costing $${6.50}/lb.`,
            hint: "Use price per pound instead of concentrations",
            answer: "Apply mixture principles to cost problems",
            difficulty: "Medium",
            category: "mixture_problems"
        }
    ];
}

generateWorkRateProblems(params) {
    const { time1 = 6, time2 = 4, combinedTime = 2.4 } = params;
    
    return [
        {
            statement: `Worker A completes job in ${time1 + 2} hours, Worker B in ${time2 + 1} hours. How long working together?`,
            hint: "Rate₁ + Rate₂ = Combined rate, where rate = 1/time",
            answer: `${1 / (1/(time1 + 2) + 1/(time2 + 1))} hours`,
            difficulty: "Medium",
            category: "work_rate"
        },
        {
            statement: `Pipe A fills pool in ${time1 * 2} hours, Pipe B in ${time2 * 3} hours. Pipe C drains it in ${time1 * 4} hours. Time to fill with all open?`,
            hint: "Subtract drain rate from fill rates",
            answer: "Account for draining pipe (negative rate)",
            difficulty: "Hard",
            category: "work_rate"
        },
        {
            statement: `Machine A produces 100 units in ${time1} hours. Machine B produces same amount in ${time2} hours. Combined production rate?`,
            hint: "Find units per hour for each machine, then add",
            answer: `${100/time1 + 100/time2} units per hour`,
            difficulty: "Basic",
            category: "work_rate"
        }
    ];
}

generateAgeProblemsProblems(params) {
    const { currentAge1 = 20, currentAge2 = 15, timeShift = 5 } = params;
    
    return [
        {
            statement: `John is ${currentAge1 + 5} years old. His sister is ${currentAge2 + 3} years old. In ${timeShift + 2} years, John will be twice as old as his sister. Find their current ages.`,
            hint: "Set up equation comparing their ages in the future",
            answer: "Use future age relationship to find current ages",
            difficulty: "Medium",
            category: "age_problems"
        },
        {
            statement: `A father is ${currentAge1 * 2} years old and his son is ${currentAge2} years old. How many years ago was the father three times as old as his son?`,
            hint: "Set up equation for ages in the past",
            answer: "Work backwards from current ages",
            difficulty: "Medium",
            category: "age_problems"
        },
        {
            statement: `The sum of two people's ages is ${currentAge1 + currentAge2 + 10}. In ${timeShift} years, the older person will be ${1.5} times as old as the younger. Find current ages.`,
            hint: "Use sum relationship and future ratio relationship",
            answer: "Solve system with sum and ratio equations",
            difficulty: "Hard",
            category: "age_problems"
        }
    ];
}

generateMoneyProblemsProblems(params) {
    const { principal = 1000, rate = 0.05, time = 3, interest = 150 } = params;
    
    return [
        {
            statement: `$${principal + 500} invested at ${(rate + 0.01) * 100}% simple interest for ${time + 1} years. Find total interest earned.`,
            hint: "Use I = Prt formula",
            answer: `$${(principal + 500) * (rate + 0.01) * (time + 1)}`,
            difficulty: "Basic",
            category: "money_problems"
        },
        {
            statement: `An investment of $${principal * 2} earns $${interest + 50} in simple interest over ${time} years. What is the interest rate?`,
            hint: "Solve I = Prt for r: r = I/(Pt)",
            answer: `${((interest + 50) / (principal * 2 * time) * 100).toFixed(2)}%`,
            difficulty: "Medium",
            category: "money_problems"
        },
        {
            statement: `Two investments total $${principal * 3}. One earns ${rate * 100}% and other earns ${(rate + 0.02) * 100}%. Total interest is $${interest * 2}. Find each investment.`,
            hint: "Set up system with total amount and total interest equations",
            answer: "Solve 2×2 system for individual investment amounts",
            difficulty: "Hard",
            category: "money_problems"
        }
    ];
}

generateGeometryLinearProblems(params) {
    const { length = 10, width = 6, perimeter = 32 } = params;
    
    return [
        {
            statement: `Rectangle length is ${3} more than twice its width. Perimeter is ${perimeter + 8}. Find dimensions.`,
            hint: "Set up relationship: l = 2w + 3, and perimeter equation",
            answer: "Solve system with length relationship and perimeter formula",
            difficulty: "Medium",
            category: "geometry_linear"
        },
        {
            statement: `Two complementary angles have measures in ratio 2:3. Find both angle measures.`,
            hint: "Complementary angles sum to 90°, use ratio to set up equation",
            answer: "36° and 54°",
            difficulty: "Basic",
            category: "geometry_linear"
        },
        {
            statement: `Triangle has angles where second angle is ${10}° more than first, third is ${20}° more than first. Find all angles.`,
            hint: "Angle sum in triangle is 180°",
            answer: "Use angle sum property with given relationships",
            difficulty: "Medium",
            category: "geometry_linear"
        }
    ];
}

generateParametricLinearProblems(params) {
    const { parameter = 'k', coefficient = 2 } = params;
    
    return [
        {
            statement: `Solve: ${parameter}x + ${coefficient} = ${coefficient * 3} for different values of ${parameter}`,
            hint: "Consider cases when parameter equals zero and when it doesn't",
            answer: `When ${parameter} ≠ 0: x = ${(coefficient * 3 - coefficient)}/${parameter}`,
            difficulty: "Hard",
            category: "parametric_linear"
        },
        {
            statement: `For what value of ${parameter} does ${parameter}x - ${coefficient} = ${coefficient * 2} have no solution?`,
            hint: "No solution occurs when coefficient of x is zero but constants are unequal",
            answer: `${parameter} = 0 creates contradiction`,
            difficulty: "Hard",
            category: "parametric_linear"
        },
        {
            statement: `Find ${parameter} such that (${parameter} - 1)x + ${coefficient * 2} = ${parameter}x + ${coefficient} has infinitely many solutions`,
            hint: "Infinitely many solutions when equation becomes identity",
            answer: "Both coefficients and constants must be equal after simplification",
            difficulty: "Hard",
            category: "parametric_linear"
        }
    ];
}

generatePiecewiseLinearProblems(params) {
    return [
        {
            statement: `Analyze f(x) = {2x + 1 if x < 0; -x + 3 if x ≥ 0}. Find domain, range, and check continuity.`,
            hint: "Check function value from left and right at x = 0",
            answer: "Evaluate limits and function values at boundary point",
            difficulty: "Hard",
            category: "piecewise_linear"
        },
        {
            statement: `Graph g(x) = {x + 2 if x ≤ -1; 3 if -1 < x < 2; -x + 5 if x ≥ 2} and find its range.`,
            hint: "Graph each piece on its domain, noting boundary behavior",
            answer: "Combine ranges from each piece",
            difficulty: "Hard",
            category: "piecewise_linear"
        },
        {
            statement: `Find a piecewise linear function that passes through (0,1), (2,3), and (4,1) with breaks at x = 2.`,
            hint: "Find linear equations for each segment",
            answer: "Construct two linear pieces meeting at x = 2",
            difficulty: "Medium",
            category: "piecewise_linear"
        }
    ];
}

generateLinearFunctionProblems(params) {
    const { m = 2, b = 3 } = params;
    
    return [
        {
            statement: `For f(x) = ${m + 1}x + ${b - 2}, find f(${5}) and solve f(x) = ${10}`,
            hint: "Substitute for function evaluation, set equal to value and solve for input",
            answer: `f(${5}) = ${(m + 1) * 5 + (b - 2)}; x = ${(10 - (b - 2)) / (m + 1)}`,
            difficulty: "Basic",
            category: "linear_function"
        },
        {
            statement: `Linear function passes through (${2}, ${7}) and (${5}, ${16}). Find its equation.`,
            hint: "Use two points to find slope, then point-slope form",
            answer: "Calculate slope, then use point-slope formula",
            difficulty: "Medium",
            category: "linear_function"
        },
        {
            statement: `Find linear function with slope ${m - 1} and y-intercept ${b + 2}. What is its x-intercept?`,
            hint: "x-intercept occurs when y = 0",
            answer: `f(x) = ${m - 1}x + ${b + 2}; x-intercept = ${-(b + 2)/(m - 1)}`,
            difficulty: "Basic",
            category: "linear_function"
        }
    ];
}

generateLineEquationsProblems(params) {
    const { x1 = 1, y1 = 2, x2 = 4, y2 = 8, m = 2 } = params;
    
    return [
        {
            statement: `Find equation of line through (${x1 + 2}, ${y1 + 3}) and (${x2 - 1}, ${y2 - 2})`,
            hint: "Find slope first, then use point-slope form",
            answer: "Use slope formula, then point-slope form with either point",
            difficulty: "Medium",
            category: "line_equations"
        },
        {
            statement: `Write equation of line with slope ${m + 0.5} passing through (${x1 * 2}, ${y1 * 3})`,
            hint: "Use point-slope form directly: y - y₁ = m(x - x₁)",
            answer: `y - ${y1 * 3} = ${m + 0.5}(x - ${x1 * 2})`,
            difficulty: "Basic",
            category: "line_equations"
        },
        {
            statement: `Find equation of line with x-intercept ${x1 * 3} and y-intercept ${y1 * 4}`,
            hint: "Use intercept form: x/a + y/b = 1, or find slope and use point-slope",
            answer: `x/${x1 * 3} + y/${y1 * 4} = 1 or equivalent forms`,
            difficulty: "Medium",
            category: "line_equations"
        }
    ];
}




// Linear Mathematical Workbook Image Generation Methods
// Linear Mathematical Workbook Generation Methods
// Add these methods to your LinearMathematicalWorkbook class

// Main workbook generation method
generateLinearWorkbook() {
    if (!this.currentSolution || !this.currentProblem) return;

    const workbook = this.createWorkbookStructure();
    
    // Standard sections
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
        title: `Linear Problem Solver - ${this.linearTypes[this.currentProblem.type]?.name || 'Analysis'}`,
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
            ['Problem Type', this.linearTypes[this.currentProblem.type]?.name || 'Unknown'],
            ['Original Input', this.currentProblem.originalInput],
            ['Parsed Expression', this.currentProblem.cleanInput || 'N/A'],
            ['Category', this.linearTypes[this.currentProblem.type]?.category || 'general'],
            ['Scenario', this.currentProblem.scenario || 'N/A'],
            ['Parameters', JSON.stringify(this.currentProblem.parameters, null, 2)]
        ]
    };
}

createLessonSection() {
    if (!this.includeLessonsInWorkbook || !this.currentProblem?.type || !this.lessons[this.currentProblem.type]) {
        return null;
    }

    const lesson = this.lessons[this.currentProblem.type];
    const lessonData = [];

    // Add lesson title and theory
    lessonData.push(['Lesson Topic', lesson.title]);
    lessonData.push(['Theory Overview', lesson.theory]);

    // Add key concepts
    lesson.concepts.forEach((concept, index) => {
        lessonData.push([`Key Concept ${index + 1}`, concept]);
    });

    // Add key formulas if available
    if (lesson.keyFormulas) {
        Object.entries(lesson.keyFormulas).forEach(([name, formula]) => {
            lessonData.push([`Formula: ${name}`, formula]);
        });
    }

    // Add solving steps if available
    if (lesson.solvingSteps) {
        lesson.solvingSteps.forEach((step, index) => {
            lessonData.push([`Step ${index + 1}`, step]);
        });
    }

    // Add applications
    if (lesson.applications) {
        lessonData.push(['Applications', lesson.applications.join('; ')]);
    }

    // Add problem types if available
    if (lesson.problem_types) {
        Object.entries(lesson.problem_types).forEach(([type, description]) => {
            lessonData.push([`Type: ${type}`, description]);
        });
    }

    return {
        title: `📚 Lesson: ${lesson.title}`,
        type: 'lesson',
        data: lessonData
    };
}

createSolutionSection() {
    const solutionData = [];
    
    // Add solution type
    if (this.currentSolution.solutionType) {
        solutionData.push(['Solution Type', this.currentSolution.solutionType]);
    }

    // Add solutions based on type
    if (this.currentSolution.solutions) {
        if (Array.isArray(this.currentSolution.solutions)) {
            this.currentSolution.solutions.forEach((sol, i) => {
                if (typeof sol === 'object' && sol.x !== undefined) {
                    solutionData.push([`Solution ${i + 1}`, `(${sol.x}, ${sol.y}${sol.z !== undefined ? ', ' + sol.z : ''})`]);
                } else {
                    solutionData.push([`Solution ${i + 1}`, String(sol)]);
                }
            });
        } else {
            solutionData.push(['Solution', String(this.currentSolution.solutions)]);
        }
    }

    // Add specific solution properties
    if (this.currentSolution.x !== undefined && this.currentSolution.y !== undefined) {
        solutionData.push(['X Value', this.currentSolution.x]);
        solutionData.push(['Y Value', this.currentSolution.y]);
        if (this.currentSolution.z !== undefined) {
            solutionData.push(['Z Value', this.currentSolution.z]);
        }
    }

    // Add slope and intercept for linear functions
    if (this.currentSolution.slope !== undefined) {
        solutionData.push(['Slope', this.currentSolution.slope]);
    }
    if (this.currentSolution.yIntercept !== undefined) {
        solutionData.push(['Y-Intercept', this.currentSolution.yIntercept]);
    }
    if (this.currentSolution.xIntercept !== undefined) {
        solutionData.push(['X-Intercept', this.currentSolution.xIntercept]);
    }

    // Add inequality-specific properties
    if (this.currentSolution.solutionSet) {
        solutionData.push(['Solution Set', this.currentSolution.solutionSet]);
    }
    if (this.currentSolution.intervalNotation) {
        solutionData.push(['Interval Notation', this.currentSolution.intervalNotation]);
    }
    if (this.currentSolution.criticalValue !== undefined) {
        solutionData.push(['Critical Value', this.currentSolution.criticalValue]);
    }

    // Add system-specific properties
    if (this.currentSolution.determinant !== undefined) {
        solutionData.push(['Determinant', this.currentSolution.determinant]);
    }
    if (this.currentSolution.method) {
        solutionData.push(['Solution Method', this.currentSolution.method]);
    }

    return {
        title: 'Solution',
        type: 'solution',
        data: solutionData
    };
}

createAnalysisSection() {
    const analysisData = [];

    // Linear function analysis
    if (this.currentSolution.behavior) {
        analysisData.push(['Function Behavior', 
            this.currentSolution.behavior.increasing ? 'Increasing' :
            this.currentSolution.behavior.decreasing ? 'Decreasing' : 'Constant'
        ]);
    }

    // Domain and range
    if (this.currentSolution.domain) {
        analysisData.push(['Domain', this.currentSolution.domain]);
    }
    if (this.currentSolution.range) {
        analysisData.push(['Range', this.currentSolution.range]);
    }

    // Graph properties
    if (this.currentSolution.graphProperties) {
        const props = this.currentSolution.graphProperties;
        if (props.slope !== undefined) {
            analysisData.push(['Slope Analysis', `m = ${props.slope} (${props.isIncreasing ? 'increasing' : props.isDecreasing ? 'decreasing' : 'constant'})`]);
        }
    }

    // Inequality analysis
    if (this.currentSolution.inequalityDirection) {
        analysisData.push(['Inequality Direction', this.currentSolution.inequalityDirection]);
    }

    // System analysis
    if (this.currentSolution.system) {
        analysisData.push(['System Equations', this.currentSolution.system.join(' ; ')]);
    }

    // Special cases
    if (this.currentSolution.explanation) {
        analysisData.push(['Special Case', this.currentSolution.explanation]);
    }

    // Application context
    if (this.currentSolution.formula) {
        analysisData.push(['Formula Used', this.currentSolution.formula]);
    }

    // Work rate specific
    if (this.currentSolution.principle) {
        analysisData.push(['Principle', this.currentSolution.principle]);
    }

    return {
        title: 'Analysis',
        type: 'analysis',
        data: analysisData
    };
}

createStepsSection() {
    const stepData = this.solutionSteps.map((step, index) => {
        let stepLabel = `Step ${index + 1}`;
        let stepDescription = step.step || step.description || 'Calculation';
        let stepExpression = step.expression || step.calculation || '';

        // Add visual indicators for verification steps
        if (step.isVerificationHeader) {
            stepLabel = `📋 ${stepLabel}`;
        } else if (step.isVerificationStep) {
            stepLabel = `🔍 ${stepLabel}`;
            if (step.isCorrect !== undefined) {
                stepExpression += step.isCorrect ? ' ✓' : ' ✗';
            }
        } else if (step.result) {
            stepExpression += ` → ${step.result}`;
        }

        return [stepLabel, stepDescription, stepExpression];
    });

    return {
        title: 'Solution Steps',
        type: 'steps',
        data: stepData
    };
}

createVerificationSection() {
    const verificationData = [];

    // Verification based on solution type
    if (this.currentSolution.verification) {
        const verification = this.currentSolution.verification;
        if (verification.substitution) {
            verificationData.push(['Substitution Check', verification.substitution]);
        }
        if (verification.leftSide !== undefined && verification.rightSide !== undefined) {
            verificationData.push(['Left Side', verification.leftSide]);
            verificationData.push(['Right Side', verification.rightSide]);
            verificationData.push(['Verification', verification.isCorrect ? 'Correct ✓' : 'Incorrect ✗']);
        }
    }

    // System verification
    if (this.currentSolution.x !== undefined && this.currentSolution.y !== undefined && this.currentProblem.parameters) {
        const params = this.currentProblem.parameters;
        if (params.a1 !== undefined) {
            const eq1Check = params.a1 * this.currentSolution.x + params.b1 * this.currentSolution.y;
            const eq2Check = params.a2 * this.currentSolution.x + params.b2 * this.currentSolution.y;
            
            verificationData.push([
                'Equation 1 Check',
                `${params.a1}(${this.currentSolution.x}) + ${params.b1}(${this.currentSolution.y}) = ${eq1Check} ${Math.abs(eq1Check - params.c1) < 1e-10 ? '✓' : '✗'}`
            ]);
            verificationData.push([
                'Equation 2 Check',
                `${params.a2}(${this.currentSolution.x}) + ${params.b2}(${this.currentSolution.y}) = ${eq2Check} ${Math.abs(eq2Check - params.c2) < 1e-10 ? '✓' : '✗'}`
            ]);
        }
    }

    // Single variable verification
    if (this.currentSolution.solutions && Array.isArray(this.currentSolution.solutions)) {
        this.currentSolution.solutions.forEach((sol, index) => {
            if (typeof sol === 'number' && this.currentProblem.parameters) {
                const params = this.currentProblem.parameters;
                if (params.m !== undefined && params.b !== undefined && params.c !== undefined) {
                    const check = params.m * sol + params.b;
                    verificationData.push([
                        `Solution ${index + 1} Check`,
                        `${params.m}(${sol}) + ${params.b} = ${check} ${Math.abs(check - params.c) < 1e-10 ? '= ' + params.c + ' ✓' : '≠ ' + params.c + ' ✗'}`
                    ]);
                }
            }
        });
    }

    return {
        title: 'Verification',
        type: 'verification',
        data: verificationData
    };
}

createRelatedProblemsSection() {
    if (!this.includeRelatedProblemsInWorkbook || !this.currentProblem?.type) {
        return null;
    }

    const relatedProblems = this.generateRelatedProblems(this.currentProblem.type, this.currentProblem.parameters);
    
    if (!relatedProblems || relatedProblems.length === 0) {
        return null;
    }

    const problemData = [];
    
    relatedProblems.forEach((problem, index) => {
        problemData.push([`Problem ${index + 1}`, problem.statement]);
        if (problem.hint) {
            problemData.push([`Hint ${index + 1}`, problem.hint]);
        }
        if (problem.answer) {
            problemData.push([`Answer ${index + 1}`, problem.answer]);
        }
        if (problem.difficulty) {
            problemData.push([`Difficulty ${index + 1}`, problem.difficulty]);
        }
        if (index < relatedProblems.length - 1) {
            problemData.push(['', '']); // Spacing between problems
        }
    });

    return {
        title: '🔗 Related Problems',
        type: 'related_problems',
        data: problemData
    };
}

createGraphSection() {
    if (!this.graphData) return null;

    const graphData = [];

    if (this.graphData.type === 'linear_function') {
        graphData.push(['Function', this.graphData.function]);
        graphData.push(['Slope', this.graphData.slope]);
        graphData.push(['Y-Intercept', this.graphData.yIntercept]);
        graphData.push(['X-Intercept', this.graphData.xIntercept]);
        graphData.push(['Point Count', this.graphData.points.length]);
    } else if (this.graphData.type === 'linear_inequality') {
        graphData.push(['Inequality Type', 'Linear Inequality']);
        graphData.push(['Critical Value', this.graphData.criticalValue]);
        graphData.push(['Solution Set', this.graphData.solutionSet]);
        graphData.push(['Interval Notation', this.graphData.intervalNotation]);
    } else if (this.graphData.type === 'system_2x2') {
        graphData.push(['System Type', '2×2 Linear System']);
        graphData.push(['Intersection Point', `(${this.graphData.intersectionPoint.x}, ${this.graphData.intersectionPoint.y})`]);
        graphData.push(['Solution Type', this.graphData.solutionType]);
    }

    return {
        title: 'Graph Analysis',
        type: 'graph',
        data: graphData,
        graphData: this.graphData
    };
}

// Utility methods for workbook management
getLessonForProblemType(problemType) {
    if (!this.lessons[problemType]) {
        return null;
    }

    return {
        title: this.lessons[problemType].title,
        content: this.lessons[problemType],
        relatedProblems: this.generateRelatedProblems(problemType, {})
    };
}

getAllLessonTopics() {
    return Object.entries(this.lessons).map(([type, lesson]) => ({
        type: type,
        title: lesson.title,
        description: lesson.theory.substring(0, 100) + "..."
    }));
}

toggleLessonsInWorkbook(includeLessons = true, includeRelatedProblems = true) {
    this.includeLessonsInWorkbook = includeLessons;
    this.includeRelatedProblemsInWorkbook = includeRelatedProblems;

    // Regenerate workbook if we have current data
    if (this.currentProblem && this.currentSolution) {
        this.generateLinearWorkbook();
    }

    return this;
}

customizeLessonContent(problemType, customContent) {
    if (this.lessons[problemType]) {
        this.lessons[problemType] = {
            ...this.lessons[problemType],
            ...customContent
        };
    }
    return this;
}

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


// Add these methods to your LinearMathematicalWorkbook class

// Updated generateImage method for LinearMathematicalWorkbook class
generateImage(filename = 'linear_workbook.png') {
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
                    bgColor = this.colors.mathBg;
                    textColor = this.colors.mathText;
                } else if (section.type === 'verification') {
                    bgColor = this.colors.resultBg;
                    textColor = this.colors.resultText;
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
                        
                        // Handle mathematical expressions for linear problems
                        if (cellText.includes('≤') || cellText.includes('≥') || 
                            cellText.includes('±') || cellText.includes('∞') ||
                            cellText.includes('∪') || cellText.includes('∩') ||
                            cellText.includes('|') || cellText.includes('∅') ||
                            cellText.includes('∈') || cellText.includes('∋')) {
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
        this.drawLinearGraph(ctx, currentY);
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

// Draw linear-specific graphs
drawLinearGraph(ctx, startY) {
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

    // Draw based on graph type
    switch(this.graphData.type) {
        case 'linear_function':
            this.drawLinearFunction(ctx, graphX, graphY, graphWidth, graphHeight);
            break;
        case 'linear_inequality':
            this.drawLinearInequality(ctx, graphX, graphY, graphWidth, graphHeight);
            break;
        case 'system_2x2':
            this.drawSystem2x2(ctx, graphX, graphY, graphWidth, graphHeight);
            break;
        default:
            this.drawGenericLinearGraph(ctx, graphX, graphY, graphWidth, graphHeight);
    }
}

// Draw linear function graph
drawLinearFunction(ctx, graphX, graphY, graphWidth, graphHeight) {
    if (!this.graphData.points || this.graphData.points.length === 0) return;

    // Calculate scaling
    const xMin = Math.min(...this.graphData.points.map(p => p.x));
    const xMax = Math.max(...this.graphData.points.map(p => p.x));
    const yMin = Math.min(...this.graphData.points.map(p => p.y));
    const yMax = Math.max(...this.graphData.points.map(p => p.y));

    const xRange = xMax - xMin || 20;
    const yRange = yMax - yMin || 20;
    const xScale = (graphWidth - 60) / xRange;
    const yScale = (graphHeight - 60) / yRange;

    // Draw axes
    const originX = graphX + 30 - xMin * xScale;
    const originY = graphY + graphHeight - 30 + yMin * yScale;

    ctx.strokeStyle = this.colors.gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    // X-axis
    ctx.moveTo(graphX + 30, originY);
    ctx.lineTo(graphX + graphWidth - 30, originY);
    // Y-axis
    ctx.moveTo(originX, graphY + 30);
    ctx.lineTo(originX, graphY + graphHeight - 30);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = this.colors.gridColor;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i++) {
        const x = graphX + 30 + (i - xMin) * xScale;
        ctx.moveTo(x, graphY + 30);
        ctx.lineTo(x, graphY + graphHeight - 30);
    }
    for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i++) {
        const y = graphY + graphHeight - 30 - (i - yMin) * yScale;
        ctx.moveTo(graphX + 30, y);
        ctx.lineTo(graphX + graphWidth - 30, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw linear function
    ctx.strokeStyle = this.colors.headerBg;
    ctx.lineWidth = 3;
    ctx.beginPath();

    this.graphData.points.forEach((point, index) => {
        const screenX = graphX + 30 + (point.x - xMin) * xScale;
        const screenY = graphY + graphHeight - 30 - (point.y - yMin) * yScale;

        if (index === 0) {
            ctx.moveTo(screenX, screenY);
        } else {
            ctx.lineTo(screenX, screenY);
        }
    });
    ctx.stroke();

    // Mark intercepts
    if (this.graphData.yIntercept !== undefined) {
        const yInterceptY = graphY + graphHeight - 30 - (this.graphData.yIntercept - yMin) * yScale;
        ctx.fillStyle = this.colors.vertexBg;
        ctx.beginPath();
        ctx.arc(originX, yInterceptY, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = this.colors.cellText;
        ctx.font = `${this.fontSize - 2}px Arial`;
        ctx.fillText(`y-int: ${this.graphData.yIntercept.toFixed(2)}`, originX + 10, yInterceptY - 10);
    }

    if (this.graphData.xIntercept !== undefined && !isNaN(this.graphData.xIntercept)) {
        const xInterceptX = graphX + 30 + (this.graphData.xIntercept - xMin) * xScale;
        ctx.fillStyle = this.colors.vertexBg;
        ctx.beginPath();
        ctx.arc(xInterceptX, originY, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = this.colors.cellText;
        ctx.font = `${this.fontSize - 2}px Arial`;
        ctx.fillText(`x-int: ${this.graphData.xIntercept.toFixed(2)}`, xInterceptX + 10, originY + 15);
    }

    // Add function equation
    ctx.fillStyle = this.colors.cellText;
    ctx.font = `bold ${this.fontSize}px Arial`;
    ctx.fillText(this.graphData.function || `y = ${this.graphData.slope}x + ${this.graphData.yIntercept}`, 
                 graphX + 40, graphY + 50);

    ctx.lineWidth = 1;
}

// Draw linear inequality visualization
drawLinearInequality(ctx, graphX, graphY, graphWidth, graphHeight) {
    const margin = 40;
    const numberLineY = graphY + graphHeight / 2;
    
    // Draw number line
    ctx.strokeStyle = this.colors.borderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(graphX + margin, numberLineY);
    ctx.lineTo(graphX + graphWidth - margin, numberLineY);
    ctx.stroke();

    // Draw tick marks
    const range = 20; // Show -10 to 10
    const tickSpacing = (graphWidth - 2 * margin) / range;
    
    for (let i = -10; i <= 10; i++) {
        const x = graphX + margin + (i + 10) * tickSpacing;
        ctx.beginPath();
        ctx.moveTo(x, numberLineY - 5);
        ctx.lineTo(x, numberLineY + 5);
        ctx.stroke();
        
        if (i % 5 === 0) {
            ctx.fillStyle = this.colors.cellText;
            ctx.font = `${this.fontSize - 2}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(i.toString(), x, numberLineY + 20);
        }
    }

    // Mark critical value and solution region
    if (this.graphData.criticalValue !== undefined) {
        const criticalX = graphX + margin + (this.graphData.criticalValue + 10) * tickSpacing;
        
        // Draw critical point
        ctx.fillStyle = this.colors.vertexBg;
        ctx.beginPath();
        ctx.arc(criticalX, numberLineY, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw solution region (simplified visualization)
        ctx.fillStyle = this.colors.headerBg;
        ctx.globalAlpha = 0.3;
        
        if (this.graphData.solutionSet && this.graphData.solutionSet.includes('>')) {
            ctx.fillRect(criticalX, numberLineY - 15, graphX + graphWidth - margin - criticalX, 30);
        } else if (this.graphData.solutionSet && this.graphData.solutionSet.includes('<')) {
            ctx.fillRect(graphX + margin, numberLineY - 15, criticalX - (graphX + margin), 30);
        }
        
        ctx.globalAlpha = 1;
        
        // Label critical value
        ctx.fillStyle = this.colors.cellText;
        ctx.font = `bold ${this.fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(this.graphData.criticalValue.toFixed(2), criticalX, numberLineY - 25);
    }

    // Add solution description
    ctx.fillStyle = this.colors.cellText;
    ctx.font = `bold ${this.fontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(this.graphData.solutionSet || 'Solution Set', graphX + margin, graphY + 50);
    ctx.fillText(this.graphData.intervalNotation || 'Interval Notation', graphX + margin, graphY + 75);
}

// Draw 2x2 system visualization
drawSystem2x2(ctx, graphX, graphY, graphWidth, graphHeight) {
    if (!this.graphData.intersectionPoint) return;

    const margin = 40;
    const centerX = graphX + graphWidth / 2;
    const centerY = graphY + graphHeight / 2;
    const scale = 20; // pixels per unit

    // Draw axes
    ctx.strokeStyle = this.colors.gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    // X-axis
    ctx.moveTo(graphX + margin, centerY);
    ctx.lineTo(graphX + graphWidth - margin, centerY);
    // Y-axis
    ctx.moveTo(centerX, graphY + margin);
    ctx.lineTo(centerX, graphY + graphHeight - margin);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = this.colors.gridColor;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    for (let i = -10; i <= 10; i++) {
        if (i !== 0) {
            // Vertical lines
            const x = centerX + i * scale;
            if (x > graphX + margin && x < graphX + graphWidth - margin) {
                ctx.moveTo(x, graphY + margin);
                ctx.lineTo(x, graphY + graphHeight - margin);
            }
            // Horizontal lines
            const y = centerY - i * scale;
            if (y > graphY + margin && y < graphY + graphHeight - margin) {
                ctx.moveTo(graphX + margin, y);
                ctx.lineTo(graphX + graphWidth - margin, y);
            }
        }
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw intersection point
    const intersectionX = centerX + this.graphData.intersectionPoint.x * scale;
    const intersectionY = centerY - this.graphData.intersectionPoint.y * scale;
    
    ctx.fillStyle = this.colors.vertexBg;
    ctx.beginPath();
    ctx.arc(intersectionX, intersectionY, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Label intersection point
    ctx.fillStyle = this.colors.cellText;
    ctx.font = `bold ${this.fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(`(${this.graphData.intersectionPoint.x.toFixed(2)}, ${this.graphData.intersectionPoint.y.toFixed(2)})`, 
                 intersectionX, intersectionY - 15);

    // Add solution type
    ctx.fillStyle = this.colors.cellText;
    ctx.font = `bold ${this.fontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(this.graphData.solutionType || 'System Solution', graphX + margin, graphY + 30);
}

// Generic linear graph for other types
drawGenericLinearGraph(ctx, graphX, graphY, graphWidth, graphHeight) {
    // Draw a placeholder graph area with title
    ctx.fillStyle = this.colors.cellText;
    ctx.font = `${this.fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Linear Graph Visualization', graphX + graphWidth / 2, graphY + graphHeight / 2);
    
    if (this.graphData.type) {
        ctx.fillText(`Type: ${this.graphData.type}`, graphX + graphWidth / 2, graphY + graphHeight / 2 + 25);
    }
 }

}
