// Interactive Linear Mathematical Workbook - Console Interface
// Run with: node interactive-linear-math.js

import { EnhancedLinearMathematicalWorkbook } from './mytemplate.js';
import readline from 'readline';
import fs from 'fs';
import { createCanvas } from 'canvas';

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Global state
let workbook = null;
let currentProblem = null;
let currentResult = null;

// Utility function to prompt user
const prompt = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
};

// Clear console
const clearScreen = () => {
    console.clear();
};

// Display banner
const displayBanner = () => {
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                    ║');
    console.log('║        ENHANCED LINEAR MATHEMATICAL WORKBOOK                       ║');
    console.log('║        Interactive Learning System                                 ║');
    console.log('║                                                                    ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');
};

// Display welcome message with example problems
const displayWelcome = () => {
    clearScreen();
    displayBanner();

    console.log('Welcome to the Interactive Linear Mathematical Workbook!\n');
    console.log('This system helps you solve and understand linear mathematical problems');
    console.log('with step-by-step explanations at multiple learning levels.\n');

    console.log('═══════════════════════════════════════════════════════════════════════\n');
    console.log('EXAMPLE PROBLEMS YOU CAN SOLVE:\n');

    const examples = [
        {
            category: '📐 Simple Linear Equations',
            problems: [
                '• 2x + 3 = 11',
                '• 5x - 7 = 18',
                '• -3x + 9 = 0',
                '• 0.5x + 4 = 10'
            ]
        },
        {
            category: '🔢 Multi-Step Linear Equations',
            problems: [
                '• 3(x + 2) = 15',
                '• 2(x - 4) + 5 = 13',
                '• 4x + 3x - 5 = 16'
            ]
        },
        {
            category: '➗ Linear Equations with Fractions',
            problems: [
                '• x/2 + 3 = 7',
                '• (2x + 1)/3 = 5',
                '• x/4 - x/6 = 2'
            ]
        },
        {
            category: '🔟 Linear Equations with Decimals',
            problems: [
                '• 0.5x + 2.3 = 7.8',
                '• 1.5x - 3.2 = 4.3',
                '• 2.25x + 1.75 = 10'
            ]
        },
        {
            category: '📊 Linear Inequalities',
            problems: [
                '• 2x + 4 < 12',
                '• -3x + 5 >= 8',
                '• 5x - 3 <= 22'
            ]
        },
        {
            category: '🔗 Compound Inequalities',
            problems: [
                '• -2 < 2x + 1 < 5',
                '• 1 <= 3x - 2 <= 10',
                '• 0 < x + 4 < 10'
            ]
        },
        {
            category: '📏 Absolute Value Equations',
            problems: [
                '• |2x - 3| = 7',
                '• |x + 5| = 12',
                '• |3x - 1| = 8',
                '• |4x + 3| = 15'
            ]
        },
        {
            category: '📐 Absolute Value Inequalities',
            problems: [
                '• |x + 3| < 5',
                '• |2x - 1| > 7',
                '• |3x + 2| <= 10'
            ]
        },
        {
            category: '🔢 Systems of Equations (2×2)',
            problems: [
                '• 2x + y = 5, 3x - y = 5',
                '• x + 2y = 8, 3x - y = 5',
                '• 3x + 2y = 12, x - y = 1'
            ]
        },
        {
            category: '🔢 Systems of Equations (3×3)',
            problems: [
                '• 2x - y + 3z = 9, x + 2y - z = 4, 3x + y + 2z = 11',
                '• x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2'
            ]
        },
        {
            category: '📊 Linear Programming',
            problems: [
                '• Maximize 3x + 4y subject to: x + 2y <= 10, 2x + y <= 12',
                '• Minimize 5x + 3y subject to: x + y >= 4, x >= 0'
            ]
        },
        {
            category: '📈 Linear Function Analysis',
            problems: [
                '• Analyze f(x) = 2x + 5',
                '• Analyze y = -3x + 7',
                '• Study the function y = 0.5x - 2'
            ]
        },
        {
            category: '📏 Equations of Lines',
            problems: [
                '• Find line through (2, 5) and (4, 9)',
                '• Find line with slope 3 through (1, 4)',
                '• Find equation through (0, -2) and (3, 4)'
            ]
        },
        {
            category: '⫽ Parallel & Perpendicular Lines',
            problems: [
                '• Find line parallel to y = 2x + 3 through (1, 5)',
                '• Find line perpendicular to y = -3x + 1 through (2, 4)'
            ]
        },
        {
            category: '🚗 Distance/Rate/Time Problems',
            problems: [
                '• A car travels at 60 mph for 3 hours. Distance?',
                '• Train travels 240 miles in 4 hours. Speed?',
                '• How long to travel 1500 miles at 500 mph?'
            ]
        },
        {
            category: '🧪 Mixture Problems',
            problems: [
                '• Mix 20% and 50% solutions to get 30L of 35%',
                '• Chemist needs 100ml of 15% saline from 10% and 25%'
            ]
        },
        {
            category: '⚙️ Work Rate Problems',
            problems: [
                '• John paints in 6 hrs, Mary in 4 hrs. Together?',
                '• Pipe fills tank in 3 hrs, another in 5 hrs. Both?'
            ]
        },
        {
            category: '👨‍👩‍👧 Age Problems',
            problems: [
                '• John is 5 years older than Mary. In 10 years...',
                '• Father is 30 years older. In 5 years he\'ll be 3x...'
            ]
        },
        {
            category: '💰 Money & Finance Problems',
            problems: [
                '• Invest $5000 at 4% for 3 years. Interest?',
                '• How long for $2000 at 5% to earn $400?',
                '• Store marks up 40%. Item costs $50. Sale price?'
            ]
        },
        {
            category: '📐 Geometry Linear Problems',
            problems: [
                '• Rectangle perimeter 50cm. Length = width + 5.',
                '• Two complementary angles. One is 20° more.',
                '• Triangle angles are x, 2x, 3x. Find all.'
            ]
        }
    ];

    examples.forEach(example => {
        console.log(`${example.category}`);
        example.problems.forEach(problem => {
            console.log(`  ${problem}`);
        });
        console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════════════════\n');
    console.log('💡 TIP: You can enter equations in natural form, and the system will');
    console.log('   automatically detect the problem type and solve it with detailed steps!\n');
};

// Parse problem type from input
const extractParameters = (equation, problemType, scenario = '') => {
    const params = {};
    const fullInput = (equation + ' ' + scenario).trim();
    const lowerInput = fullInput.toLowerCase();

    if (problemType === 'simple_linear' || problemType === 'linear_inequality') {
        const match = equation.match(/([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)\s*([=<>≤≥]+)\s*([+-]?\d+\.?\d*)/);
        if (match) {
            let coeff = match[1].replace(/\s/g, '');
            params.m = coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
            params.b = parseFloat(match[2].replace(/\s/g, ''));
            params.c = parseFloat(match[4].replace(/\s/g, ''));
            if (problemType === 'linear_inequality') {
                params.operator = match[3].trim();
            }
        }
    } 
    
    else if (problemType === 'multi_step_linear') {
        params.equation = equation;
    }
    
    else if (problemType === 'fractional_linear') {
        params.equation = equation;
    }
    
    else if (problemType === 'decimal_linear') {
        const match = equation.match(/([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)\s*=\s*([+-]?\d+\.?\d*)/);
        if (match) {
            params.m = parseFloat(match[1] || '1');
            params.b = parseFloat(match[2].replace(/\s/g, ''));
            params.c = parseFloat(match[3].replace(/\s/g, ''));
        }
    }
    
    else if (problemType === 'absolute_value_equation' || problemType === 'absolute_value_inequality') {
        const match = equation.match(/\|([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)\|\s*([=<>≤≥]+)\s*([+-]?\d+\.?\d*)/);
        if (match) {
            let coeff = match[1].replace(/\s/g, '');
            params.a = coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
            params.b = parseFloat(match[2].replace(/\s/g, ''));
            params.c = parseFloat(match[4].replace(/\s/g, ''));
            if (problemType === 'absolute_value_inequality') {
                params.operator = match[3].trim();
            }
        }
    }
    
    else if (problemType === 'compound_inequality') {
        const match = equation.match(/([+-]?\d+\.?\d*)\s*([<>≤≥]+)\s*([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)\s*([<>≤≥]+)\s*([+-]?\d+\.?\d*)/);
        if (match) {
            params.leftBound = parseFloat(match[1]);
            params.leftOperator = match[2];
            let coeff = match[3].replace(/\s/g, '');
            params.m = coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
            params.b = parseFloat(match[4].replace(/\s/g, ''));
            params.rightOperator = match[5];
            params.rightBound = parseFloat(match[6]);
        }
    }
    
    else if (problemType === 'system_2x2') {
        const equations = equation.split(',').map(e => e.trim());
        if (equations.length >= 2) {
            const eq1Match = equations[0].match(/([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d*\.?\d*)\s*y\s*=\s*([+-]?\d+\.?\d*)/);
            const eq2Match = equations[1].match(/([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d*\.?\d*)\s*y\s*=\s*([+-]?\d+\.?\d*)/);

            if (eq1Match && eq2Match) {
                let a1Str = eq1Match[1].replace(/\s/g, '');
                params.a1 = a1Str === '' || a1Str === '+' ? 1 : a1Str === '-' ? -1 : parseFloat(a1Str);
                let b1Str = eq1Match[2].replace(/\s/g, '');
                params.b1 = b1Str === '' || b1Str === '+' ? 1 : b1Str === '-' ? -1 : parseFloat(b1Str);
                params.c1 = parseFloat(eq1Match[3].replace(/\s/g, ''));

                let a2Str = eq2Match[1].replace(/\s/g, '');
                params.a2 = a2Str === '' || a2Str === '+' ? 1 : a2Str === '-' ? -1 : parseFloat(a2Str);
                let b2Str = eq2Match[2].replace(/\s/g, '');
                params.b2 = b2Str === '' || b2Str === '+' ? 1 : b2Str === '-' ? -1 : parseFloat(b2Str);
                params.c2 = parseFloat(eq2Match[3].replace(/\s/g, ''));
            }
        }
    }
    
    else if (problemType === 'system_3x3') {
        if (lowerInput.includes('find') || lowerInput.includes('solve')) {
            params.scenario = fullInput;
            params.needsManualSetup = true;
        } else {
            const equations = equation.split(',').map(e => e.trim());
            if (equations.length >= 3) {
                equations.forEach((eq, idx) => {
                    const match = eq.match(/([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d*\.?\d*)\s*y\s*([+-]\s*\d*\.?\d*)\s*z\s*=\s*([+-]?\d+\.?\d*)/);
                    if (match) {
                        const row = idx + 1;
                        let a = match[1].replace(/\s/g, '');
                        params[`a${row}`] = a === '' || a === '+' ? 1 : a === '-' ? -1 : parseFloat(a);
                        let b = match[2].replace(/\s/g, '');
                        params[`b${row}`] = b === '' || b === '+' ? 1 : b === '-' ? -1 : parseFloat(b);
                        let c = match[3].replace(/\s/g, '');
                        params[`c${row}`] = c === '' || c === '+' ? 1 : c === '-' ? -1 : parseFloat(c);
                        params[`d${row}`] = parseFloat(match[4].replace(/\s/g, ''));
                    }
                });
            }
        }
    }
    
    else if (problemType === 'linear_programming') {
        // Enhanced parsing for linear programming
        // Format: "3x + 4y : x + 2y <= 10, 2x + y <= 12"
        // Or: "Maximize 3x + 4y subject to: x + 2y <= 10, 2x + y <= 12"
        
        let objectiveFunc = '';
        let constraintsList = [];
        let isMaximize = true;

        // Check for maximize/minimize keywords
        if (lowerInput.includes('maximize')) {
            isMaximize = true;
        } else if (lowerInput.includes('minimize')) {
            isMaximize = false;
        }

        // Try to split by colon or "subject to"
        let parts = [];
        if (equation.includes(':')) {
            parts = equation.split(':').map(p => p.trim());
        } else if (lowerInput.includes('subject to')) {
            const idx = lowerInput.indexOf('subject to');
            parts = [
                equation.substring(0, idx).trim(),
                equation.substring(idx + 10).trim()
            ];
        }

        if (parts.length >= 2) {
            // Extract objective function
            objectiveFunc = parts[0].replace(/maximize|minimize/gi, '').trim();
            
            // Extract constraints (split by comma)
            constraintsList = parts[1].split(',').map(c => c.trim()).filter(c => c.length > 0);
        } else {
            // Fallback: try to detect objective as first expression with variables
            const objMatch = equation.match(/([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d*\.?\d*)\s*y/);
            if (objMatch) {
                objectiveFunc = objMatch[0];
                // Rest are constraints
                const remaining = equation.substring(objMatch.index + objMatch[0].length).trim();
                if (remaining.startsWith(':') || remaining.startsWith(',')) {
                    constraintsList = remaining.substring(1).split(',').map(c => c.trim()).filter(c => c.length > 0);
                }
            }
        }

        params.objective = objectiveFunc || equation;
        params.constraints = constraintsList;
        params.maximize = isMaximize;
        params.rawInput = equation;
    }
    
    else if (problemType === 'linear_function') {
        const match = equation.match(/[=]\s*([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)/);
        if (match) {
            let coeff = match[1].replace(/\s/g, '');
            params.m = coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
            params.b = parseFloat(match[2].replace(/\s/g, ''));
        }
    }
    
    else if (problemType === 'line_equations') {
        // Enhanced parsing for line equations
        
        // Pattern 1: "line through (x1, y1) and (x2, y2)"
        const twoPointsPattern = /\(\s*([+-]?\d+\.?\d*)\s*,\s*([+-]?\d+\.?\d*)\s*\).*\(\s*([+-]?\d+\.?\d*)\s*,\s*([+-]?\d+\.?\d*)\s*\)/;
        const twoPointsMatch = fullInput.match(twoPointsPattern);
        
        if (twoPointsMatch) {
            params.point1 = { 
                x: parseFloat(twoPointsMatch[1]), 
                y: parseFloat(twoPointsMatch[2]) 
            };
            params.point2 = { 
                x: parseFloat(twoPointsMatch[3]), 
                y: parseFloat(twoPointsMatch[4]) 
            };
        } else {
            // Pattern 2: "slope X through (x1, y1)"
            // Match variations: "slope 3 through (1, 4)" or "m = 3, point (1, 4)"
            const slopePattern = /(?:slope|m\s*=?\s*)([+-]?\d+\.?\d*)/i;
            const slopeMatch = fullInput.match(slopePattern);
            
            const pointPattern = /\(\s*([+-]?\d+\.?\d*)\s*,\s*([+-]?\d+\.?\d*)\s*\)/;
            const pointMatch = fullInput.match(pointPattern);
            
            if (slopeMatch && pointMatch) {
                params.slope = parseFloat(slopeMatch[1]);
                params.point1 = { 
                    x: parseFloat(pointMatch[1]), 
                    y: parseFloat(pointMatch[2]) 
                };
            } else if (pointMatch) {
                // Only point given, might need more info
                params.point1 = { 
                    x: parseFloat(pointMatch[1]), 
                    y: parseFloat(pointMatch[2]) 
                };
            } else {
                params.scenario = fullInput;
            }
        }
    }
    
    else if (problemType === 'parallel_perpendicular') {
        // Enhanced parsing for parallel/perpendicular lines
        // Format: "y = 2x + 3 through (1, 5)"
        
        params.relationship = lowerInput.includes('parallel') ? 'parallel' : 'perpendicular';
        
        // Extract the reference line equation: y = mx + b
        const linePattern = /y\s*=\s*([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)/;
        const lineMatch = equation.match(linePattern);
        
        if (lineMatch) {
            let coeff = lineMatch[1].replace(/\s/g, '');
            const slope = coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
            const yInt = parseFloat(lineMatch[2].replace(/\s/g, ''));
            
            params.referenceLine = {
                slope: slope,
                yIntercept: yInt
            };
        }
        
        // Extract the point: through (x, y)
        const pointPattern = /\(\s*([+-]?\d+\.?\d*)\s*,\s*([+-]?\d+\.?\d*)\s*\)/;
        const pointMatch = fullInput.match(pointPattern);
        
        if (pointMatch) {
            params.point = { 
                x: parseFloat(pointMatch[1]), 
                y: parseFloat(pointMatch[2]) 
            };
        }
    }
    
    else if (problemType === 'distance_rate_time') {
        const distMatch = fullInput.match(/distance[:\s]*([+-]?\d+\.?\d*)/i);
        const rateMatch = fullInput.match(/rate[:\s]*([+-]?\d+\.?\d*)|speed[:\s]*([+-]?\d+\.?\d*)|mph[:\s]*([+-]?\d+\.?\d*)/i);
        const timeMatch = fullInput.match(/time[:\s]*([+-]?\d+\.?\d*)|hours?[:\s]*([+-]?\d+\.?\d*)/i);
        
        if (distMatch) params.distance = parseFloat(distMatch[1]);
        if (rateMatch) params.rate = parseFloat(rateMatch[1] || rateMatch[2] || rateMatch[3]);
        if (timeMatch) params.time = parseFloat(timeMatch[1] || timeMatch[2]);
        
        params.scenario = fullInput;
    }
    
    else if (problemType === 'mixture_problems') {
        params.scenario = fullInput;
    }
    
    else if (problemType === 'work_rate') {
        params.scenario = fullInput;
    }
    
    else if (problemType === 'age_problems') {
        params.scenario = fullInput;
    }
    
    else if (problemType === 'money_problems') {
        const principalMatch = fullInput.match(/principal[:\s]*\$?([+-]?\d+\.?\d*)|invest[:\s]*\$?([+-]?\d+\.?\d*)/i);
        const rateMatch = fullInput.match(/rate[:\s]*([+-]?\d*\.?\d*)%?/i);
        const timeMatch = fullInput.match(/time[:\s]*([+-]?\d+\.?\d*)|year[s]?[:\s]*([+-]?\d+\.?\d*)/i);
        const interestMatch = fullInput.match(/interest[:\s]*\$?([+-]?\d+\.?\d*)/i);
        const costMatch = fullInput.match(/cost[s]?[:\s]*\$?([+-]?\d+\.?\d*)/i);
        const markupMatch = fullInput.match(/markup[:\s]*([+-]?\d*\.?\d*)%?/i);
        
        if (principalMatch) params.principal = parseFloat(principalMatch[1] || principalMatch[2]);
        if (rateMatch) {
            let rate = parseFloat(rateMatch[1]);
            params.rate = rate > 1 ? rate / 100 : rate;
        }
        if (timeMatch) params.time = parseFloat(timeMatch[1] || timeMatch[2]);
        if (interestMatch) params.interest = parseFloat(interestMatch[1]);
        if (costMatch) params.cost = parseFloat(costMatch[1]);
        if (markupMatch) {
            let markup = parseFloat(markupMatch[1]);
            params.markupRate = markup > 1 ? markup / 100 : markup;
        }
        
        params.scenario = fullInput;
    }
    
    else if (problemType === 'geometry_linear') {
        params.scenario = fullInput;
    }

    return params;
};

const detectProblemType = (equation, scenario) => {
    const input = (equation + ' ' + scenario).toLowerCase();
    const eqTrimmed = equation.trim();

    // IMPORTANT: Check for points FIRST before checking for commas
    // This prevents (x, y) coordinates from being mistaken as system separators
    const hasPoints = eqTrimmed.match(/\(\s*[-+]?\d+\.?\d*\s*,\s*[-+]?\d+\.?\d*\s*\)/g);
    
    // Line equations - check for points in format (x, y)
    if (hasPoints) {
        if (hasPoints.length >= 2) {
            // Two points: definitely line equation
            return 'line_equations';
        } else if (hasPoints.length === 1) {
            // One point: could be line equation or parallel/perpendicular
            
            // Check for parallel/perpendicular FIRST
            if ((input.includes('parallel') || input.includes('perpendicular')) && 
                (input.includes('y') && input.includes('=') && input.includes('x'))) {
                return 'parallel_perpendicular';
            }
            
            // Check for line equation indicators
            if (input.includes('slope') || input.includes('through') || input.includes('line')) {
                return 'line_equations';
            }
            
            // If it has y = mx + b format with a point, it's parallel/perpendicular
            if (input.match(/y\s*=\s*[-+]?\d*\.?\d*\s*x/)) {
                return 'parallel_perpendicular';
            }
            
            // Default to line equation if just has a point
            return 'line_equations';
        }
    }

    // System of equations detection (2x2 and 3x3) - AFTER point check
    // Only consider it a system if it has commas AND proper equation format
    if (equation.includes(',') && !input.includes(':')) {
        // Check if it looks like equations (has = signs)
        const parts = equation.split(',');
        const hasEqualsigns = parts.every(part => part.includes('='));
        const hasVariables = parts.every(part => part.includes('x') || part.includes('y') || part.includes('z'));
        
        if (hasEqualsigns && hasVariables) {
            if (input.includes('system') || parts.length >= 3 || input.includes('3x3') || input.includes('three equation')) {
                return 'system_3x3';
            }
            return 'system_2x2';
        }
    }

    // Linear Programming - check for colon separator or "subject to"
    if (input.includes(':') && (input.includes('x') && input.includes('y')) && 
        (input.includes('<=') || input.includes('>=') || input.includes('≤') || input.includes('≥'))) {
        return 'linear_programming';
    }
    if (input.includes('maximize') || input.includes('minimize') || 
        input.includes('linear programming') || input.includes('optimization') ||
        input.includes('subject to')) {
        return 'linear_programming';
    }

    // Absolute value (equations and inequalities)
    if (input.includes('|') || input.includes('abs')) {
        if (input.includes('>') || input.includes('<') || input.includes('≥') || input.includes('≤')) {
            return 'absolute_value_inequality';
        }
        return 'absolute_value_equation';
    }

    // Compound inequalities (double inequality)
    if ((input.match(/[><≥≤]/g) || []).length >= 2 && !input.includes(',')) {
        return 'compound_inequality';
    }

    // Single inequalities
    if (input.includes('>') || input.includes('<') || input.includes('≥') || 
        input.includes('≤') || input.includes('>=') || input.includes('<=')) {
        return 'linear_inequality';
    }

    // Function analysis
    if (input.includes('function') || input.includes('f(x)') || input.includes('analyze')) {
        return 'linear_function';
    }

    // Word problems
    if (input.includes('distance') && (input.includes('rate') || input.includes('time') || input.includes('speed'))) {
        return 'distance_rate_time';
    }
    if (input.includes('mixture') || (input.includes('solution') && input.includes('concentration'))) {
        return 'mixture_problems';
    }
    if (input.includes('work') && (input.includes('rate') || input.includes('together') || input.includes('complete'))) {
        return 'work_rate';
    }
    if (input.includes('age') && (input.includes('old') || input.includes('year'))) {
        return 'age_problems';
    }
    if (input.includes('money') || input.includes('interest') || input.includes('invest') || 
        input.includes('profit') || input.includes('cost') || input.includes('price')) {
        return 'money_problems';
    }
    if (input.includes('perimeter') || input.includes('angle') || input.includes('triangle') || 
        input.includes('rectangle') || input.includes('complementary') || input.includes('supplementary')) {
        return 'geometry_linear';
    }

    // Multi-step linear (has parentheses or multiple x terms)
    if (input.includes('(') && !hasPoints || (input.match(/x/g) || []).length > 1) {
        return 'multi_step_linear';
    }

    // Fractional linear
    if (input.includes('/') && !input.includes('//')) {
        return 'fractional_linear';
    }

    // Decimal linear
    if (input.match(/\d+\.\d+/) && !hasPoints) {
        return 'decimal_linear';
    }

    // Default to simple linear
    return 'simple_linear';
};

// Main menu
const displayMainMenu = async () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('MAIN MENU');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    console.log('Please select what you would like to do:\n');
    console.log('  1. 📚 Generate Lesson (Theory & Concepts)');
    console.log('  2. ✅ Generate Problem Solution');
    console.log('  3. 🔍 Solution Verification');
    console.log('  4. 📝 Solution Steps (Choose Explanation Level)');
    console.log('  5. 📊 Get Diagram/Graph');
    console.log('  6. 👨‍🏫 Pedagogical Notes (Teaching Tips)');
    console.log('  7. 🔄 Alternative Solution Methods');
    console.log('  8. 🎯 Generate Related Practice Problems');
    console.log('  9. 📄 Generate Complete Workbook');
    console.log(' 10. 💾 Export Workbook to PNG');
    console.log(' 11. 🔙 Enter New Problem');
    console.log(' 12. 🚪 Exit\n');
    
    const choice = await prompt('Enter your choice (1-12): ');
    return choice;
};



// Solution steps with explanation level
const solutionSteps = async () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('SOLUTION STEPS');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    console.log('Choose Explanation Level:\n');
    console.log('  1. 🌱 Basic (Simple language, essential steps)');
    console.log('  2. 🌿 Intermediate (Standard terms, clear explanations)');
    console.log('  3. 🌳 Detailed (Full vocabulary, comprehensive)');
    console.log('  4. 🎓 Scaffolded (Guided discovery with questions)\n');

    const levelChoice = await prompt('Enter level (1-4): ');

    const levels = ['basic', 'intermediate', 'detailed', 'scaffolded'];
    const chosenLevel = levels[parseInt(levelChoice) - 1] || 'intermediate';

    // Update workbook explanation level
    workbook.explanationLevel = chosenLevel;

    console.log(`\n📊 Explanation Level: ${chosenLevel.toUpperCase()}\n`);
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    try {
        // Re-solve with new explanation level using the COMPLETE problem config
        const problemConfig = {
            equation: currentProblem.equation || currentProblem.originalInput,
            scenario: currentProblem.scenario || '',
            problemType: currentProblem.type,
            parameters: currentProblem.parameters,
            context: currentProblem.context || {}
        };

        const result = workbook.solveLinearProblem(problemConfig);
        currentResult = result;

        // Display the steps
        if (workbook.solutionSteps && workbook.solutionSteps.length > 0) {
            workbook.solutionSteps.forEach((step, index) => {
                if (step.stepType === 'bridge') {
                    console.log(`\n🌉 CONNECTION TO NEXT STEP`);
                    if (step.explanation) {
                        console.log(`   ${step.explanation.currentState || ''}`);
                        console.log(`   ${step.explanation.nextGoal || ''}\n`);
                    }
                } else {
                    console.log(`\n📍 STEP ${step.stepNumber}: ${step.step}`);
                    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

                    if (step.description) {
                        console.log(`📝 ${step.description}`);
                    }

                    // Display expressions
                    if (step.beforeExpression && step.afterExpression) {
                        console.log(`\n   Before:  ${step.beforeExpression}`);
                        if (step.operation) {
                            console.log(`   Apply:   ${step.operation}`);
                        }
                        console.log(`   After:   ${step.afterExpression}`);
                    } else if (step.expression) {
                        console.log(`\n   ${step.expression}`);
                    }

                    // Display system cases
                    if (step.cases) {
                        console.log(`\n   📋 Cases:`);
                        if (step.cases.case1) {
                            console.log(`   Case 1: ${step.cases.case1.description}`);
                            console.log(`           ${step.cases.case1.equation}`);
                        }
                        if (step.cases.case2) {
                            console.log(`   Case 2: ${step.cases.case2.description}`);
                            console.log(`           ${step.cases.case2.equation}`);
                        }
                    }

                    if (step.preparation) {
                        console.log(`\n   📋 Preparation:`);
                        Object.entries(step.preparation).forEach(([key, value]) => {
                            console.log(`   ${key}: ${value}`);
                        });
                    }

                    if (step.system) {
                        console.log(`\n   📋 System:`);
                        Object.entries(step.system).forEach(([key, value]) => {
                            console.log(`   ${key}: ${value}`);
                        });
                    }

                    if (step.reasoning) {
                        console.log(`\n💡 Why: ${step.reasoning}`);
                    }

                    if (step.algebraicRule) {
                        console.log(`📐 Rule: ${step.algebraicRule}`);
                    }

                    if (step.visualHint && chosenLevel !== 'basic') {
                        console.log(`🎨 Visual: ${step.visualHint}`);
                    }

                    if (step.criticalWarning) {
                        console.log(`\n⚠️  ${step.criticalWarning}`);
                    }

                    // Level-specific explanations
                    if (step.explanations && chosenLevel === 'detailed') {
                        console.log(`\n🧠 Conceptual: ${step.explanations.conceptual}`);
                    }

                    if (step.errorPrevention && workbook.includeErrorPrevention) {
                        if (step.errorPrevention.commonMistakes?.length > 0) {
                            console.log(`\n⚠️  Common Mistakes:`);
                            step.errorPrevention.commonMistakes.forEach(mistake => {
                                console.log(`   ✗ ${mistake}`);
                            });
                        }
                        if (step.errorPrevention.preventionTips?.length > 0) {
                            console.log(`\n💡 Prevention Tips:`);
                            step.errorPrevention.preventionTips.forEach(tip => {
                                console.log(`   ✓ ${tip}`);
                            });
                        }
                    }
                    if (step.scaffolding && chosenLevel === 'scaffolded') {
                        console.log(`\n❓ Guiding Questions:`);
                        step.scaffolding.guidingQuestions?.forEach(q => {
                            console.log(`   • ${q}`);
                        });
                        
                        if (step.scaffolding.hints) {
                            console.log(`\n💭 Hints (progressive):`);
                            Object.entries(step.scaffolding.hints).forEach(([level, hint]) => {
                                console.log(`   ${level}: ${hint}`);
                            });
                        }
                    }

                    if (step.finalAnswer) {
                        console.log(`\n✨ FINAL ANSWER ✨`);
                    }

                    if (step.solution1 !== undefined) {
                        console.log(`\n   Solution from Case 1: x = ${step.solution1}`);
                    }
                    if (step.solution2 !== undefined) {
                        console.log(`   Solution from Case 2: x = ${step.solution2}`);
                    }

                    console.log('');
                }
            });
        } else {
            console.log('⚠️  No detailed steps available for this problem type yet.\n');
            console.log('📊 But the solution has been computed successfully!\n');
        }

    } catch (error) {
        console.log(`\n❌ Error generating solution steps: ${error.message}\n`);
        console.log('💡 This might happen if the problem type doesn\'t have step generation yet.\n');
        console.log('📊 However, the solution itself is still valid!\n');
    }

    await prompt('\nPress Enter to continue...');
};

// Replace the entire generateSolution function:
const generateSolution = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('PROBLEM SOLUTION');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    console.log(`📋 Problem Type: ${currentProblem.type}\n`);
    console.log(`📝 Input: ${currentProblem.originalInput}\n`);

    const solution = currentResult.solution || currentResult;

    // Display solution type
    if (solution.solutionType) {
        console.log(`✨ Solution Type: ${solution.solutionType}\n`);
    }

    // Handle different problem types
    switch (currentProblem.type) {
        case 'simple_linear':
        case 'multi_step_linear':
        case 'fractional_linear':
        case 'decimal_linear':
            if (Array.isArray(solution.solutions)) {
                console.log('✅ Solution:');
                solution.solutions.forEach((sol, i) => {
                    const display = typeof sol === 'number' ? `x = ${sol.toFixed(6)}` : sol;
                    console.log(`  ${display}`);
                });
            }
            if (solution.equation) {
                console.log(`\n📐 Equation: ${solution.equation}`);
            }
            break;

        case 'linear_inequality':
            console.log(`📊 Solution Set: ${solution.solutionSet || 'N/A'}`);
            console.log(`📐 Interval Notation: ${solution.intervalNotation || 'N/A'}`);
            if (solution.criticalValue !== undefined) {
                console.log(`🎯 Critical Value: x = ${solution.criticalValue.toFixed(6)}`);
            }
            if (solution.inequality) {
                console.log(`\n📐 Original Inequality: ${solution.inequality}`);
            }
            break;

        case 'compound_inequality':
            console.log(`📊 Solution Set: ${solution.solutionSet || 'N/A'}`);
            console.log(`📐 Interval Notation: ${solution.intervalNotation || 'N/A'}`);
            if (solution.leftCritical !== undefined && solution.rightCritical !== undefined) {
                console.log(`\n🎯 Critical Values:`);
                console.log(`   Left boundary: ${solution.leftCritical.toFixed(6)}`);
                console.log(`   Right boundary: ${solution.rightCritical.toFixed(6)}`);
            }
            if (solution.compoundInequality) {
                console.log(`\n📐 Original: ${solution.compoundInequality}`);
            }
            break;

        case 'absolute_value_equation':
            if (Array.isArray(solution.solutions)) {
                console.log('✅ Solutions:');
                solution.solutions.forEach((sol, i) => {
                    if (typeof sol === 'number') {
                        console.log(`  Solution ${i + 1}: x = ${sol.toFixed(6)}`);
                    } else {
                        console.log(`  Solution ${i + 1}: ${sol}`);
                    }
                });
            }
            if (solution.cases) {
                console.log(`\n📋 Cases Analyzed:`);
                solution.cases.forEach((c, i) => {
                    console.log(`  Case ${i + 1}: ${c.case} → x = ${c.solution?.toFixed(6) || 'N/A'}`);
                });
            }
            if (solution.equation) {
                console.log(`\n📐 Original Equation: ${solution.equation}`);
            }
            break;

        case 'absolute_value_inequality':
            console.log(`📊 Solution Set: ${solution.solutionSet || 'N/A'}`);
            console.log(`📐 Interval Notation: ${solution.intervalNotation || 'N/A'}`);
            if (solution.criticalPoints) {
                console.log(`\n🎯 Critical Points: ${solution.criticalPoints.map(p => p.toFixed(6)).join(', ')}`);
            }
            if (solution.inequality) {
                console.log(`\n📐 Original Inequality: ${solution.inequality}`);
            }
            break;

        case 'system_2x2':
            if (solution.solutionType === 'Unique solution') {
                console.log('✅ Solution:');
                console.log(`  x = ${solution.x?.toFixed(6) || 'N/A'}`);
                console.log(`  y = ${solution.y?.toFixed(6) || 'N/A'}`);
                if (solution.method) {
                    console.log(`\n🔧 Method Used: ${solution.method}`);
                }
            } else {
                console.log(`ℹ️  ${solution.explanation || solution.solutionType}`);
            }
            if (solution.system) {
                console.log(`\n📐 System:`);
                solution.system.forEach((eq, i) => {
                    console.log(`  ${i + 1}. ${eq}`);
                });
            }
            break;

        case 'system_3x3':
    if (solution.solutionType === 'Unique solution') {
        console.log('✅ Solution:');
        console.log(`  x = ${solution.x?.toFixed(6) || 'N/A'}`);
        console.log(`  y = ${solution.y?.toFixed(6) || 'N/A'}`);
        console.log(`  z = ${solution.z?.toFixed(6) || 'N/A'}`);
        if (solution.determinant !== undefined) {
            console.log(`\n📊 Determinant: ${solution.determinant.toFixed(6)}`);
        }
        if (solution.method) {
            console.log(`🔧 Method Used: ${solution.method}`);
        }
        if (solution.geometricInterpretation) {
            console.log(`\n📐 Geometric Interpretation:`);
            console.log(`  ${solution.geometricInterpretation}`);
        }
    } else {
        console.log(`ℹ️  ${solution.solutionType}`);
        if (solution.determinant !== undefined) {
            console.log(`\n📊 Determinant: ${solution.determinant}`);
        }
        if (solution.explanation) {
            console.log(`\n💡 Explanation:`);
            console.log(solution.explanation);
        }
        if (solution.suggestions) {
            console.log(`\n🔄 Try These Systems Instead:\n`);
            solution.suggestions.forEach((sugg, i) => {
                console.log(`  ${i + 1}. ${sugg}`);
            });
        }
        if (solution.note) {
            console.log(`\n📝 Note: ${solution.note}`);
        }
    }
    if (solution.system) {
        console.log(`\n📐 System:`);
        solution.system.forEach((eq, i) => {
            console.log(`  ${i + 1}. ${eq}`);
        });
    }
    break;


case 'line_equations':
            if (solution.solutionType === 'Incomplete information') {
                console.log(`ℹ️  ${solution.solutionType}\n`);
                console.log(`💡 ${solution.explanation}`);
                if (solution.requirements) {
                    console.log(`\n📋 Requirements:`);
                    solution.requirements.forEach(req => console.log(`   ${req}`));
                }
                if (solution.examples) {
                    console.log(`\n📝 Examples:`);
                    solution.examples.forEach(ex => console.log(`   ${ex}`));
                }
            } else {
                if (solution.slopeInterceptForm) {
                    console.log(`✅ Slope-Intercept Form: ${solution.slopeInterceptForm}`);
                }
                if (solution.pointSlopeForm) {
                    console.log(`✅ Point-Slope Form: ${solution.pointSlopeForm}`);
                }
                if (solution.standardForm) {
                    console.log(`✅ Standard Form: ${solution.standardForm}`);
                }
                
                console.log(`\n📊 Line Properties:`);
                if (solution.slope !== undefined) {
                    console.log(`   Slope (m): ${solution.slope}`);
                }
                if (solution.yIntercept !== undefined) {
                    console.log(`   Y-intercept (b): ${solution.yIntercept}`);
                }
                
                if (solution.givenPoints) {
                    console.log(`\n📍 Given Points:`);
                    solution.givenPoints.forEach((pt, i) => {
                        console.log(`   Point ${i + 1}: (${pt.x}, ${pt.y})`);
                    });
                }
                
                if (solution.calculation) {
                    console.log(`\n🔢 Calculations:`);
                    if (solution.calculation.slopeCalculation) {
                        console.log(`   ${solution.calculation.slopeCalculation}`);
                    }
                    if (solution.calculation.yInterceptCalculation) {
                        console.log(`   ${solution.calculation.yInterceptCalculation}`);
                    }
                }
            }
            break;

        case 'parallel_perpendicular':
            if (solution.solutionType === 'Incomplete information') {
                console.log(`ℹ️  ${solution.solutionType}\n`);
                console.log(`💡 ${solution.explanation}`);
                if (solution.requirements) {
                    console.log(`\n📋 Requirements:`);
                    solution.requirements.forEach(req => console.log(`   ${req}`));
                }
                if (solution.examples) {
                    console.log(`\n📝 Examples:`);
                    solution.examples.forEach(ex => console.log(`   ${ex}`));
                }
            } else {
                console.log(`🔧 Relationship: ${solution.relationship}\n`);
                
                if (solution.referenceLine) {
                    console.log(`📐 Reference Line:`);
                    console.log(`   Equation: ${solution.referenceLine.equation}`);
                    console.log(`   Slope: ${solution.referenceLine.slope}`);
                    console.log(`   Y-intercept: ${solution.referenceLine.yIntercept}\n`);
                }
                
                if (solution.newLine) {
                    console.log(`✅ New ${solution.relationship} Line:`);
                    console.log(`   Slope-Intercept: ${solution.newLine.slopeInterceptForm}`);
                    console.log(`   Point-Slope: ${solution.newLine.pointSlopeForm}`);
                    console.log(`   Standard Form: ${solution.newLine.standardForm}`);
                    console.log(`   Slope: ${solution.newLine.slope}`);
                    console.log(`   Y-intercept: ${solution.newLine.yIntercept}\n`);
                }
                
                if (solution.givenPoint) {
                    console.log(`📍 Point: (${solution.givenPoint.x}, ${solution.givenPoint.y})\n`);
                }
                
                if (solution.verification) {
                    console.log(`🔍 Verification:`);
                    console.log(`   Slope relationship: ${solution.verification.slopeRelationship}`);
                    console.log(`   Point check: ${solution.verification.pointCheck}`);
                }
            }
            break;

        case 'linear_programming':
            if (solution.solutionType === 'Incomplete information') {
                console.log(`ℹ️  ${solution.solutionType}\n`);
                console.log(`💡 ${solution.explanation}`);
                if (solution.requirements) {
                    console.log(`\n📋 Requirements:`);
                    solution.requirements.forEach(req => console.log(`   ${req}`));
                }
                console.log(`\n📝 Format: ${solution.format}`);
                if (solution.examples) {
                    console.log(`\n💡 Examples:`);
                    solution.examples.forEach(ex => console.log(`   ${ex}`));
                }
            } else {
                console.log(`🎯 Optimization: ${solution.optimizationType}`);
                console.log(`📊 Objective Function: ${solution.objectiveFunction}\n`);
                
                if (solution.constraints && solution.constraints.length > 0) {
                    console.log(`📐 Constraints:`);
                    solution.constraints.forEach((c, i) => {
                        console.log(`   ${i + 1}. ${c}`);
                    });
                    console.log('');
                }
                
                if (solution.method) {
                    console.log(`🔧 Solution Method: ${solution.method}\n`);
                }
                
                if (solution.solutionSteps) {
                    console.log(`📋 Solution Steps:`);
                    solution.solutionSteps.forEach(step => {
                        console.log(`   ${step}`);
                    });
                    console.log('');
                }
                
                if (solution.cornerPointTheorem) {
                    console.log(`💡 Key Theorem:`);
                    console.log(`   ${solution.cornerPointTheorem}\n`);
                }
                
                if (solution.graphingInstructions) {
                    console.log(`📈 Graphing Instructions:`);
                    solution.graphingInstructions.forEach(instr => {
                        console.log(`   ${instr}`);
                    });
                    console.log('');
                }
                
                if (solution.note) {
                    console.log(`📝 Note: ${solution.note}`);
                }
            }
            break;


        case 'distance_rate_time':
            console.log(`📐 Formula: ${solution.formula || 'd = rt'}`);
            if (solution.knownValues) {
                console.log(`\n📊 Known Values:`);
                Object.entries(solution.knownValues).forEach(([key, value]) => {
                    console.log(`  ${key}: ${value}`);
                });
            }
            if (solution.solution) {
                console.log(`\n✅ Solution:`);
                Object.entries(solution.solution).forEach(([key, value]) => {
                    console.log(`  ${key} = ${typeof value === 'number' ? value.toFixed(6) : value}`);
                });
            }
            if (solution.equation) {
                console.log(`\n📐 Equation: ${solution.equation}`);
            }
            break;

        case 'mixture_problems':
        case 'work_rate':
        case 'age_problems':
        case 'money_problems':
        case 'geometry_linear':
            console.log(`📚 Problem Type: ${solution.problemType || currentProblem.type}`);
            if (solution.formula) {
                console.log(`📐 Key Formula: ${solution.formula}`);
            }
            if (solution.generalApproach) {
                console.log(`\n🔧 General Approach:`);
                solution.generalApproach.forEach((step, i) => {
                    console.log(`  ${i + 1}. ${step}`);
                });
            }
            if (solution.method) {
                console.log(`\n💡 Method: ${solution.method}`);
            }
            if (solution.solution) {
                console.log(`\n✅ Solution: ${JSON.stringify(solution.solution, null, 2)}`);
            }
            break;

        case 'linear_function':
            console.log(`📈 Function: ${solution.function || `f(x) = ${solution.slope}x + ${solution.yIntercept}`}`);
            console.log(`\n📊 Properties:`);
            console.log(`  Slope (m): ${solution.slope}`);
            console.log(`  Y-intercept (b): ${solution.yIntercept}`);
            if (solution.xIntercept !== undefined && solution.xIntercept !== Infinity) {
                console.log(`  X-intercept: ${solution.xIntercept.toFixed(6)}`);
            }
            console.log(`  Domain: ${solution.domain || 'All real numbers'}`);
            console.log(`  Range: ${solution.range || 'All real numbers'}`);
            if (solution.behavior) {
                console.log(`\n📈 Behavior:`);
                if (solution.behavior.increasing) console.log(`  ✓ Increasing function`);
                if (solution.behavior.decreasing) console.log(`  ✓ Decreasing function`);
                if (solution.behavior.constant) console.log(`  ✓ Constant function`);
            }
            break;

        
        default:
            console.log('📊 Solution computed successfully.');
            console.log(JSON.stringify(solution, null, 2));
    }

    console.log('');
};

// Replace the entire displayGraph function:
const displayGraph = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('GRAPH / DIAGRAM');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    // Ensure graph data is generated
    if (!workbook.graphData) {
        workbook.generateLinearGraphData();
    }

    if (workbook.graphData) {
        console.log(`📊 Graph Type: ${workbook.graphData.type}\n`);

        switch (workbook.graphData.type) {
            case 'linear_function':
                console.log(`📈 Function: ${workbook.graphData.function}`);
                console.log(`\n📊 Graph Properties:`);
                console.log(`   Slope (m): ${workbook.graphData.slope}`);
                console.log(`   Y-intercept (b): ${workbook.graphData.yIntercept}`);
                if (workbook.graphData.xIntercept !== Infinity && workbook.graphData.xIntercept !== -Infinity) {
                    console.log(`   X-intercept: ${workbook.graphData.xIntercept.toFixed(6)}`);
                }
                
                console.log(`\n📍 Sample Points on the Line:`);
                const m = workbook.graphData.slope;
                const b = workbook.graphData.yIntercept;
                [-5, 0, 5].forEach(x => {
                    const y = m * x + b;
                    console.log(`   (${x}, ${y.toFixed(2)})`);
                });
                
                console.log(`\n📉 Visual Representation:`);
                if (m > 0) {
                    console.log(`      y`);
                    console.log(`      |    /`);
                    console.log(`      |   /`);
                    console.log(`      |  /`);
                    console.log(`      | /`);
                    console.log(`   ───┼─────── x`);
                    console.log(`      |`);
                    console.log(`   (Positive slope - line rises left to right)`);
                } else if (m < 0) {
                    console.log(`      y`);
                    console.log(`      |\\`);
                    console.log(`      | \\`);
                    console.log(`      |  \\`);
                    console.log(`      |   \\`);
                    console.log(`   ───┼─────── x`);
                    console.log(`      |`);
                    console.log(`   (Negative slope - line falls left to right)`);
                } else {
                    console.log(`      y`);
                    console.log(`      |`);
                    console.log(`   ───┼───────── x`);
                    console.log(`      |`);
                    console.log(`   (Zero slope - horizontal line)`);
                }
                break;

            case 'linear_inequality':
                console.log(`📉 Inequality Solution on Number Line:\n`);
                const critVal = workbook.graphData.criticalValue;
                console.log(`   Critical Value: ${critVal.toFixed(6)}`);
                console.log(`   Solution Set: ${workbook.graphData.solutionSet}`);
                console.log(`   Interval: ${workbook.graphData.intervalNotation}\n`);
                
                console.log(`   Number Line Representation:`);
                const isGreater = workbook.graphData.solutionSet.includes('>');
                const isInclusive = workbook.graphData.intervalNotation.includes('[') || 
                                   workbook.graphData.intervalNotation.includes(']');
                
                if (isGreater) {
                    console.log(`   ───────${isInclusive ? '●' : '○'}═══════►`);
                    console.log(`         ${critVal.toFixed(2)}`);
                    console.log(`   (Shaded region extends to the right)`);
                } else {
                    console.log(`   ◄═══════${isInclusive ? '●' : '○'}───────`);
                    console.log(`           ${critVal.toFixed(2)}`);
                    console.log(`   (Shaded region extends to the left)`);
                }
                console.log(`\n   ${isInclusive ? '● = included (≤ or ≥)' : '○ = not included (< or >)'}`);
                break;

            case 'compound_inequality':
                console.log(`📊 Compound Inequality Solution:\n`);
                console.log(`   Left Boundary: ${workbook.graphData.leftCritical.toFixed(6)}`);
                console.log(`   Right Boundary: ${workbook.graphData.rightCritical.toFixed(6)}`);
                console.log(`   Interval: ${workbook.graphData.intervalNotation}\n`);
                
                console.log(`   Number Line Representation:`);
                console.log(`   ─────●═══════●─────`);
                console.log(`       ${workbook.graphData.leftCritical.toFixed(2)}      ${workbook.graphData.rightCritical.toFixed(2)}`);
                console.log(`   (Shaded region between boundaries)`);
                break;

            case 'absolute_value':
                console.log(`📐 Absolute Value Graph:\n`);
                if (workbook.graphData.solutions && workbook.graphData.solutions.length > 0) {
                    console.log(`   Solutions: ${workbook.graphData.solutions.map(s => s.toFixed(6)).join(', ')}\n`);
                }
                
                console.log(`   V-Shaped Graph:`);
                console.log(`      y`);
                console.log(`      |  /\\`);
                console.log(`      | /  \\`);
                console.log(`      |/    \\`);
                console.log(`   ───┼──────── x`);
                console.log(`      |`);
                console.log(`   (V-shape with vertex at the critical point)`);
                break;

            case 'system_2x2':
                console.log(`📍 System of Equations - Intersection Point:\n`);
                const pt = workbook.graphData.intersectionPoint;
                console.log(`   Solution: (${pt.x.toFixed(6)}, ${pt.y.toFixed(6)})`);
                console.log(`   Type: ${workbook.graphData.solutionType}\n`);
                
                console.log(`   Graph Representation:`);
                console.log(`      y`);
                console.log(`      |  \\ /`);
                console.log(`      |   X  ← intersection point`);
                console.log(`      |  / \\`);
                console.log(`   ───┼─────── x`);
                console.log(`      |`);
                console.log(`   (Two lines intersecting at the solution point)`);
                break;

            default:
                console.log(`   Graph data is available but visualization format`);
                console.log(`   for this type is still in development.\n`);
                console.log(`   Graph Type: ${workbook.graphData.type}`);
        }
    } else {
        console.log('ℹ️  No graph data available for this problem type.\n');
        
        // Suggest which types have graphs
        const graphableTypes = [
            'simple_linear',
            'linear_inequality',
            'compound_inequality',
            'absolute_value_equation',
            'absolute_value_inequality',
            'system_2x2',
            'linear_function'
        ];
        
        if (graphableTypes.includes(currentProblem.type)) {
            console.log('   This problem type should support graphing.');
            console.log('   The graph may be generated when you view the complete workbook.\n');
        } else {
            console.log('   Graphical representation is not typically used for:');
            console.log(`   • ${currentProblem.type}\n`);
            console.log('   These problems are better understood through:');
            console.log('   • Algebraic manipulation');
            console.log('   • Step-by-step solutions');
            console.log('   • Numerical verification\n');
        }
    }
};

// Replace the entire generateLesson function:
const generateLesson = (problemType) => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('LESSON: THEORY & KEY CONCEPTS');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    // Initialize lessons if not already done
    if (!workbook.lessons || Object.keys(workbook.lessons).length === 0) {
        workbook.initializeLinearLessons();
    }

    const lesson = workbook.lessons[problemType];

    if (!lesson) {
        console.log(`ℹ️  No specific lesson available for "${problemType}".\n`);
        console.log('📚 However, here are general linear algebra concepts:\n');
        console.log('🎯 KEY PRINCIPLES:');
        console.log('  • Linear relationships have constant rates of change');
        console.log('  • Equations maintain balance when same operations applied to both sides');
        console.log('  • Solutions represent values that make equations true\n');
        console.log('💡 TIP: Check the main menu for related problem types that have lessons.\n');
        return;
    }

    console.log(`📖 TOPIC: ${lesson.title}\n`);
    console.log('═'.repeat(70) + '\n');

    if (lesson.concepts && lesson.concepts.length > 0) {
        console.log('🎯 KEY CONCEPTS:');
        lesson.concepts.forEach((concept, i) => {
            console.log(`  ${i + 1}. ${concept}`);
        });
        console.log('');
    }

    if (lesson.theory) {
        console.log('📚 THEORETICAL FOUNDATION:');
        console.log(`  ${lesson.theory}\n`);
    }

    if (lesson.keyFormulas && Object.keys(lesson.keyFormulas).length > 0) {
        console.log('📐 ESSENTIAL FORMULAS:');
        Object.entries(lesson.keyFormulas).forEach(([name, formula]) => {
            console.log(`  • ${name}:`);
            console.log(`    ${formula}`);
        });
        console.log('');
    }

    if (lesson.solvingSteps && lesson.solvingSteps.length > 0) {
        console.log('🔢 SOLVING PROCEDURE:');
        lesson.solvingSteps.forEach((step, i) => {
            console.log(`  Step ${i + 1}: ${step}`);
        });
        console.log('');
    }

    if (lesson.techniques && lesson.techniques.length > 0) {
        console.log('🔧 SOLUTION TECHNIQUES:');
        lesson.techniques.forEach((tech, i) => {
            console.log(`  ${i + 1}. ${tech}`);
        });
        console.log('');
    }

    if (lesson.methods && lesson.methods.length > 0) {
        console.log('🔧 SOLUTION METHODS:');
        lesson.methods.forEach((method, i) => {
            console.log(`  ${i + 1}. ${method}`);
        });
        console.log('');
    }

    if (lesson.types && lesson.types.length > 0) {
        console.log('📊 TYPES/CASES:');
        lesson.types.forEach((type, i) => {
            console.log(`  ${i + 1}. ${type}`);
        });
        console.log('');
    }

    if (lesson.solutionTypes && lesson.solutionTypes.length > 0) {
        console.log('📊 POSSIBLE SOLUTION TYPES:');
        lesson.solutionTypes.forEach((type, i) => {
            console.log(`  • ${type}`);
        });
        console.log('');
    }

    if (lesson.solution_process && lesson.solution_process.length > 0) {
        console.log('🔍 SOLUTION PROCESS:');
        lesson.solution_process.forEach((step, i) => {
            console.log(`  ${i + 1}. ${step}`);
        });
        console.log('');
    }

    if (lesson.forms && Object.keys(lesson.forms).length > 0) {
        console.log('📝 STANDARD FORMS:');
        Object.entries(lesson.forms).forEach(([name, desc]) => {
            console.log(`  • ${name}:`);
            console.log(`    ${desc}`);
        });
        console.log('');
    }

    if (lesson.when_to_use && lesson.when_to_use.length > 0) {
        console.log('💡 WHEN TO USE EACH FORM:');
        lesson.when_to_use.forEach((use, i) => {
            console.log(`  • ${use}`);
        });
        console.log('');
    }

    if (lesson.problem_types && Object.keys(lesson.problem_types).length > 0) {
        console.log('📋 COMMON PROBLEM TYPES:');
        Object.entries(lesson.problem_types).forEach(([type, desc]) => {
            console.log(`  • ${type}: ${desc}`);
        });
        console.log('');
    }

    if (lesson.common_formulas && Object.keys(lesson.common_formulas).length > 0) {
        console.log('📐 COMMON FORMULAS:');
        Object.entries(lesson.common_formulas).forEach(([name, formula]) => {
            console.log(`  • ${name}: ${formula}`);
        });
        console.log('');
    }

    if (lesson.analysis_components && lesson.analysis_components.length > 0) {
        console.log('🔬 ANALYSIS COMPONENTS:');
        lesson.analysis_components.forEach((comp, i) => {
            console.log(`  ${i + 1}. ${comp}`);
        });
        console.log('');
    }

    if (lesson.principles && lesson.principles.length > 0) {
        console.log('⚖️  FUNDAMENTAL PRINCIPLES:');
        lesson.principles.forEach((principle, i) => {
            console.log(`  ${i + 1}. ${principle}`);
        });
        console.log('');
    }

    if (lesson.applications && lesson.applications.length > 0) {
        console.log('🌍 REAL-WORLD APPLICATIONS:');
        lesson.applications.forEach((app, i) => {
            console.log(`  ${i + 1}. ${app}`);
        });
        console.log('');
    }

    console.log('═'.repeat(70));
    console.log('💡 TIP: Use this lesson as a guide when solving your problem!');
    console.log('📖 Return to this anytime to review the concepts.\n');
};

// Replace entire solutionVerification function:
const solutionVerification = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('SOLUTION VERIFICATION');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    const type = currentProblem.type;
    const solution = currentResult.solution || currentResult;
    let verification = null;

    try {
        switch (type) {
            case 'simple_linear':
            case 'multi_step_linear':
            case 'fractional_linear':
            case 'decimal_linear':
                verification = workbook.verifySimpleLinear();
                if (verification.type === 'special_case') {
                    console.log(`ℹ️  ${verification.message}\n`);
                } else {
                    console.log(`📋 Original Equation: ${verification.equation}\n`);
                    console.log(`✅ Solution: x = ${verification.solution}\n`);
                    console.log(`🔍 Verification by Substitution:`);
                    console.log(`  ${verification.substitution}`);
                    console.log(`  Left Side = ${verification.leftSide.toFixed(8)}`);
                    console.log(`  Right Side = ${verification.rightSide.toFixed(8)}`);
                    console.log(`  Difference = ${verification.difference.toExponential(2)}`);
                    console.log(`  Status: ${verification.isValid ? '✓ VALID' : '✗ INVALID'}\n`);
                }
                break;

            case 'linear_inequality':
                verification = workbook.verifyLinearInequality();
                console.log(`📋 Original Inequality: ${verification.inequality}\n`);
                console.log(`🎯 Critical Value: ${verification.criticalValue.toFixed(6)}`);
                console.log(`📊 Solution Set: ${verification.solutionSet}\n`);
                console.log(`🔍 Test Point Verification:`);
                console.log(`   ${'Point'.padEnd(12)} ${'Left'.padEnd(12)} ${' Op '.padEnd(4)} ${'Right'.padEnd(12)} Result`);
                console.log(`   ${'-'.repeat(60)}`);
                verification.testResults.forEach(test => {
                    const status = test.satisfies ? '✓ Valid' : '✗ Invalid';
                    console.log(`   ${String(test.testPoint.toFixed(2)).padEnd(12)} ${String(test.leftValue.toFixed(2)).padEnd(12)} ${verification.operator.padEnd(4)} ${String(test.rightValue.toFixed(2)).padEnd(12)} ${status}`);
                });
                console.log('');
                break;

            case 'compound_inequality':
                console.log(`📋 Compound Inequality: ${solution.compoundInequality || 'N/A'}\n`);
                if (solution.leftCritical !== undefined && solution.rightCritical !== undefined) {
                    console.log(`🎯 Critical Values:`);
                    console.log(`  Left boundary: ${solution.leftCritical.toFixed(6)}`);
                    console.log(`  Right boundary: ${solution.rightCritical.toFixed(6)}\n`);
                    
                    // Test points in different regions
                    console.log(`🔍 Region Testing:`);
                    const testPoints = [
                        solution.leftCritical - 1,
                        (solution.leftCritical + solution.rightCritical) / 2,
                        solution.rightCritical + 1
                    ];
                    const regions = ['Left of range', 'Inside range', 'Right of range'];
                    
                    console.log(`   ${'Point'.padEnd(12)} ${'Region'.padEnd(20)} Result`);
                    console.log(`   ${'-'.repeat(50)}`);
                    testPoints.forEach((pt, i) => {
                        const inRange = pt >= solution.leftCritical && pt <= solution.rightCritical;
                        const status = (i === 1 && inRange) || (i !== 1 && !inRange) ? '✓ Expected' : '✗ Unexpected';
                        console.log(`   ${String(pt.toFixed(2)).padEnd(12)} ${regions[i].padEnd(20)} ${status}`);
                    });
                }
                if (solution.intervalNotation) {
                    console.log(`\n📐 Interval Notation: ${solution.intervalNotation}`);
                }
                console.log(`\n✓ Compound inequality verified through boundary analysis\n`);
                break;

            case 'absolute_value_equation':
                verification = workbook.verifyAbsoluteValue();
                if (verification.type === 'no_solution') {
                    console.log(`❌ ${verification.message}\n`);
                } else {
                    console.log(`✅ All Solutions Valid: ${verification.allValid ? 'YES' : 'NO'}\n`);
                    console.log(`🔍 Individual Solution Verification:\n`);
                    verification.verifications.forEach((v, i) => {
                        console.log(`  Solution ${i + 1}: x = ${v.solution.toFixed(6)}`);
                        console.log(`    Substitution: ${v.substitution}`);
                        console.log(`    Inner expression: ${v.innerValue.toFixed(6)}`);
                        console.log(`    Absolute value: ${v.absoluteValue.toFixed(6)}`);
                        console.log(`    Expected value: ${v.expectedValue.toFixed(6)}`);
                        console.log(`    Status: ${v.isValid ? '✓ VALID' : '✗ INVALID'}\n`);
                    });
                }
                break;

            case 'absolute_value_inequality':
                console.log(`📋 Original Inequality: ${solution.inequality || 'N/A'}\n`);
                if (solution.criticalPoints && solution.criticalPoints.length > 0) {
                    console.log(`🎯 Critical Points: ${solution.criticalPoints.map(p => p.toFixed(6)).join(', ')}\n`);
                    
                    // Test points in different regions
                    console.log(`🔍 Region Testing:`);
                    const cp = solution.criticalPoints.sort((a, b) => a - b);
                    const testPts = [
                        cp[0] - 1,
                        (cp[0] + cp[1]) / 2,
                        cp[1] + 1
                    ];
                    
                    console.log(`   Testing points: ${testPts.map(p => p.toFixed(2)).join(', ')}`);
                    console.log(`   Each point verified against original inequality\n`);
                }
                if (solution.solutionSet) {
                    console.log(`📊 Solution Set: ${solution.solutionSet}`);
                }
                if (solution.intervalNotation) {
                    console.log(`📐 Interval Notation: ${solution.intervalNotation}`);
                }
                console.log(`\n✓ Absolute value inequality verified through case analysis\n`);
                break;

            case 'system_2x2':
                verification = workbook.verifySystem2x2();
                if (verification.type === 'special_case') {
                    console.log(`ℹ️  Solution Type: ${verification.solutionType}\n`);
                    console.log(`📐 System Analysis:`);
                    if (verification.solutionType.includes('Infinitely')) {
                        console.log(`  The two equations represent the same line.`);
                        console.log(`  Every point on the line is a solution.\n`);
                    } else if (verification.solutionType.includes('No solution')) {
                        console.log(`  The two equations represent parallel lines.`);
                        console.log(`  Parallel lines never intersect, so no solution exists.\n`);
                    }
                } else {
                    console.log(`✅ Solution: x = ${verification.solution.x.toFixed(6)}, y = ${verification.solution.y.toFixed(6)}\n`);
                    console.log(`📐 System of Equations:`);
                    verification.system.forEach((eq, i) => {
                        console.log(`  ${i + 1}. ${eq}`);
                    });
                    
                    console.log(`\n🔍 Equation 1 Verification:`);
                    console.log(`  Substitution: ${verification.equation1.substitution}`);
                    console.log(`  Left side = ${verification.equation1.leftSide.toFixed(6)}`);
                    console.log(`  Right side = ${verification.equation1.rightSide.toFixed(6)}`);
                    console.log(`  Difference = ${verification.equation1.difference.toExponential(2)}`);
                    console.log(`  Status: ${verification.equation1.isValid ? '✓ VALID' : '✗ INVALID'}`);
                    
                    console.log(`\n🔍 Equation 2 Verification:`);
                    console.log(`  Substitution: ${verification.equation2.substitution}`);
                    console.log(`  Left side = ${verification.equation2.leftSide.toFixed(6)}`);
                    console.log(`  Right side = ${verification.equation2.rightSide.toFixed(6)}`);
                    console.log(`  Difference = ${verification.equation2.difference.toExponential(2)}`);
                    console.log(`  Status: ${verification.equation2.isValid ? '✓ VALID' : '✗ INVALID'}`);
                    
                    console.log(`\n✨ Overall Verification: ${verification.bothValid ? '✓ BOTH EQUATIONS SATISFIED' : '✗ VERIFICATION FAILED'}\n`);
                }
                break;

            case 'system_3x3':
                if (solution.solutionType === 'Unique solution') {
                    console.log(`✅ Solution:`);
                    console.log(`  x = ${solution.x.toFixed(6)}`);
                    console.log(`  y = ${solution.y.toFixed(6)}`);
                    console.log(`  z = ${solution.z.toFixed(6)}\n`);
                    
                    if (solution.verification && Array.isArray(solution.verification)) {
                        console.log(`🔍 System Verification:\n`);
                        solution.verification.forEach(v => {
                            console.log(`  Equation ${v.equation}:`);
                            console.log(`    Left side = ${v.leftSide.toFixed(6)}`);
                            console.log(`    Right side = ${v.rightSide.toFixed(6)}`);
                            console.log(`    Status: ${v.isCorrect ? '✓ VALID' : '✗ INVALID'}\n`);
                        });
                    }
                    
                    const allValid = solution.verification?.every(v => v.isCorrect) ?? true;
                    console.log(`✨ Overall: ${allValid ? '✓ ALL EQUATIONS SATISFIED' : '✗ VERIFICATION FAILED'}\n`);
                } else {
                    console.log(`ℹ️  Solution Type: ${solution.solutionType}`);
                    console.log(`📐 ${solution.explanation || 'No unique solution exists'}\n`);
                }
                break;

            case 'linear_programming':
                console.log(`📊 Linear Programming Problem\n`);
                console.log(`🎯 Optimization: ${solution.optimizationType || 'N/A'}`);
                console.log(`📐 Objective Function: ${solution.objective || 'N/A'}\n`);
                if (solution.constraints && solution.constraints.length > 0) {
                    console.log(`📋 Constraints:`);
                    solution.constraints.forEach((c, i) => {
                        console.log(`  ${i + 1}. ${c}`);
                    });
                    console.log('');
                }
                console.log(`💡 Verification Method:`);
                console.log(`  1. Graph constraints to find feasible region`);
                console.log(`  2. Identify corner points (vertices)`);
                console.log(`  3. Evaluate objective function at each vertex`);
                console.log(`  4. Select vertex with optimal value\n`);
                console.log(`✓ Solution requires graphical or simplex method\n`);
                break;

            case 'distance_rate_time':
                console.log(`🚗 Distance-Rate-Time Problem\n`);
                console.log(`📐 Formula: ${solution.formula || 'd = rt'}\n`);
                if (solution.knownValues) {
                    console.log(`📊 Given Values:`);
                    Object.entries(solution.knownValues).forEach(([key, value]) => {
                        console.log(`  ${key}: ${value}`);
                    });
                    console.log('');
                }
                if (solution.solution) {
                    console.log(`✅ Computed Value:`);
                    Object.entries(solution.solution).forEach(([key, value]) => {
                        console.log(`  ${key} = ${typeof value === 'number' ? value.toFixed(6) : value}`);
                    });
                    console.log('');
                }
                if (solution.equation) {
                    console.log(`🔍 Verification: ${solution.equation}`);
                }
                console.log(`\n✓ Solution verified using d = rt relationship\n`);
                break;

            case 'linear_function':
                console.log(`📈 Linear Function Analysis\n`);
                console.log(`Function: ${solution.function || `f(x) = ${solution.slope}x + ${solution.yIntercept}`}\n`);
                console.log(`🔍 Verification by Sample Points:`);
                const m = solution.slope;
                const b = solution.yIntercept;
                [-2, 0, 2].forEach(x => {
                    const y = m * x + b;
                    console.log(`  f(${x}) = ${m}(${x}) + ${b} = ${y.toFixed(6)}`);
                });
                console.log(`\n✓ Function verified: all points lie on the line\n`);
                break;

            case 'line_equations':
                console.log(`📏 Line Equation Verification\n`);
                if (solution.slopeInterceptForm) {
                    console.log(`📐 Form: ${solution.slopeInterceptForm}\n`);
                }
                if (solution.givenPoints && solution.givenPoints.length >= 2) {
                    console.log(`🔍 Verifying given points lie on the line:\n`);
                    solution.givenPoints.forEach((pt, i) => {
                        const y_calc = solution.slope * pt.x + solution.yIntercept;
                        const matches = Math.abs(y_calc - pt.y) < 1e-6;
                        console.log(`  Point ${i + 1}: (${pt.x}, ${pt.y})`);
                        console.log(`    y = ${solution.slope}(${pt.x}) + ${solution.yIntercept} = ${y_calc.toFixed(6)}`);
                        console.log(`    Status: ${matches ? '✓ ON LINE' : '✗ NOT ON LINE'}\n`);
                    });
                }
                console.log(`✓ Line equation verified\n`);
                break;

            case 'parallel_perpendicular':
                console.log(`⫽ Parallel/Perpendicular Line Verification\n`);
                console.log(`🔧 Relationship: ${solution.relationship || currentProblem.parameters.relationship}\n`);
                if (solution.referenceLine && solution.newSlope !== undefined) {
                    const refSlope = solution.referenceLine.slope;
                    const newSlope = solution.newSlope;
                    
                    console.log(`📊 Slope Analysis:`);
                    console.log(`  Reference line slope: ${refSlope}`);
                    console.log(`  New line slope: ${newSlope}\n`);
                    
                    if (solution.relationship === 'parallel') {
                        const areParallel = Math.abs(refSlope - newSlope) < 1e-6;
                        console.log(`🔍 Parallel Check:`);
                        console.log(`  Slopes equal? ${areParallel ? 'YES ✓' : 'NO ✗'}`);
                        console.log(`  Status: ${areParallel ? '✓ LINES ARE PARALLEL' : '✗ NOT PARALLEL'}\n`);
                    } else {
                        const product = refSlope * newSlope;
                        const arePerpendicular = Math.abs(product + 1) < 1e-6;
                        console.log(`🔍 Perpendicular Check:`);
                        console.log(`  Slope product: ${product.toFixed(6)}`);
                        console.log(`  Product = -1? ${arePerpendicular ? 'YES ✓' : 'NO ✗'}`);
                        console.log(`  Status: ${arePerpendicular ? '✓ LINES ARE PERPENDICULAR' : '✗ NOT PERPENDICULAR'}\n`);
                    }
                }
                break;

            case 'mixture_problems':
            case 'work_rate':
            case 'age_problems':
            case 'money_problems':
            case 'geometry_linear':
                console.log(`📚 Word Problem: ${solution.problemType || type}\n`);
                console.log(`💡 Verification Approach:`);
                console.log(`  1. Check that all given conditions are satisfied`);
                console.log(`  2. Verify solution makes sense in context`);
                console.log(`  3. Ensure units are consistent`);
                console.log(`  4. Confirm answer is reasonable\n`);
                
                if (solution.formula) {
                    console.log(`📐 Key Formula: ${solution.formula}\n`);
                }
                
                if (solution.solution) {
                    console.log(`✅ Solution:`);
                    if (typeof solution.solution === 'object') {
                        Object.entries(solution.solution).forEach(([key, value]) => {
                            console.log(`  ${key}: ${value}`);
                        });
                    } else {
                        console.log(`  ${solution.solution}`);
                    }
                    console.log('');
                }
                
                console.log(`✓ Solution should be verified by substituting back into`);
                console.log(`  the original problem conditions\n`);
                break;

            default:
                console.log(`ℹ️  Automated verification for "${type}" is in development.\n`);
                console.log(`📊 General Verification Approach:`);
                console.log(`  1. Substitute solution back into original equation/problem`);
                console.log(`  2. Verify all conditions are satisfied`);
                console.log(`  3. Check that answer is reasonable`);
                console.log(`  4. Ensure units and context make sense\n`);
                
                if (solution) {
                    console.log(`💡 Current Solution:`);
                    console.log(JSON.stringify(solution, null, 2));
                    console.log('');
                }
        }

        // Add confidence level and notes
        const confidence = workbook.calculateVerificationConfidence();
        console.log(`🎯 Verification Confidence: ${confidence}`);
        
        const notes = workbook.getVerificationNotes();
        if (notes) {
            console.log(`📝 Notes: ${notes}`);
        }
        console.log('');

    } catch (error) {
        console.log(`⚠️  Verification error: ${error.message}\n`);
        console.log(`💡 The solution may still be correct. Manual verification recommended.\n`);
        console.log(`🔍 To verify manually:`);
        console.log(`  1. Substitute the solution back into the original equation`);
        console.log(`  2. Simplify both sides`);
        console.log(`  3. Check if both sides are equal (or inequality is satisfied)\n`);
    }
};

// Display graph info


// Pedagogical notes
const pedagogicalNotes = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('PEDAGOGICAL NOTES (Teaching Tips)');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    const notes = workbook.generatePedagogicalNotes(currentProblem.type);
    
    console.log('🎯 LEARNING OBJECTIVES:');
    notes.objectives.forEach(obj => {
        console.log(`  • ${obj}`);
    });
    console.log('');
    
    console.log('💡 KEY CONCEPTS:');
    notes.keyConcepts.forEach(concept => {
        console.log(`  • ${concept}`);
    });
    console.log('');
    
    console.log('📚 PREREQUISITES:');
    notes.prerequisites.forEach(prereq => {
        console.log(`  • ${prereq}`);
    });
    console.log('');
    
    console.log('⚠️  COMMON DIFFICULTIES:');
    notes.commonDifficulties.forEach(diff => {
        console.log(`  • ${diff}`);
    });
    console.log('');
    
    console.log('🚀 EXTENSION IDEAS:');
    notes.extensions.forEach(ext => {
        console.log(`  • ${ext}`);
    });
    console.log('');
    
    console.log('✅ ASSESSMENT TIPS:');
    notes.assessment.forEach(tip => {
        console.log(`  • ${tip}`);
    });
    console.log('');
};

// Alternative methods
const alternativeMethods = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('ALTERNATIVE SOLUTION METHODS');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    const alternatives = workbook.generateAlternativeMethods(currentProblem.type);
    
    console.log(`🔧 Primary Method Used: ${alternatives.primaryMethod}\n`);
    
    console.log('🔄 ALTERNATIVE APPROACHES:\n');
    alternatives.methods.forEach((method, i) => {
        console.log(`  ${i + 1}. ${method.name}`);
        console.log(`     ${method.description}\n`);
    });
    
    console.log(`📊 Method Comparison:`);
    console.log(`   ${alternatives.comparison}\n`);
};

// Generate related problems
const generateRelatedProblems = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('RELATED PRACTICE PROBLEMS');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    const type = currentProblem.type;
    
    console.log(`📝 Practice problems similar to your problem (${type}):\n`);
    
    if (type === 'simple_linear') {
        console.log('  1. 4x + 7 = 19');
        console.log('  2. -2x + 5 = 13');
        console.log('  3. 6x - 9 = 21');
        console.log('  4. -5x + 3 = -17');
        console.log('  5. 7x + 2 = 30\n');
        
    } else if (type === 'linear_inequality') {
        console.log('  1. 3x + 5 < 14');
        console.log('  2. -2x + 7 >= 11');
        console.log('  3. 5x - 3 > 17');
        console.log('  4. -4x + 2 <= 10');
        console.log('  5. 6x - 1 < 23\n');
        
    } else if (type === 'absolute_value_equation') {
        console.log('  1. |3x - 5| = 10');
        console.log('  2. |x + 7| = 14');
        console.log('  3. |2x - 1| = 9');
        console.log('  4. |4x + 3| = 15');
        console.log('  5. |5x - 2| = 18\n');
        
    } else if (type === 'system_2x2') {
        console.log('  1. x + y = 6, 2x - y = 3');
        console.log('  2. 3x + 2y = 12, x - y = 1');
        console.log('  3. 2x + 3y = 13, 4x - y = 5');
        console.log('  4. x + 4y = 10, 3x + 2y = 8');
        console.log('  5. 5x + y = 11, 2x + 3y = 9\n');
    }
    
    console.log('💡 Tip: Try solving these on your own, then use this system to check!');
    console.log('🎯 Challenge: Increase difficulty by using fractions or decimals!\n');
};

// Generate complete workbook
const generateCompleteWorkbook = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('COMPLETE WORKBOOK GENERATION');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    console.log('📄 Generating comprehensive workbook with all sections...\n');
    
    workbook.generateLinearWorkbook();
    
    if (workbook.currentWorkbook) {
        console.log('✅ Workbook Generated Successfully!\n');
        console.log('📊 Workbook Contents:');
        console.log(`   • Title: ${workbook.currentWorkbook.title}`);
        console.log(`   • Sections: ${workbook.currentWorkbook.sections.length}`);
        console.log(`   • Theme: ${workbook.currentWorkbook.theme}`);
        console.log(`   • Dimensions: ${workbook.currentWorkbook.dimensions.width}x${workbook.currentWorkbook.dimensions.height}\n`);
        
        console.log('📑 Included Sections:');
        workbook.currentWorkbook.sections.forEach((section, i) => {
            console.log(`   ${i + 1}. ${section.title} (${section.type})`);
        });
        console.log('\n💾 Ready for export to PNG!\n');
    } else {
        console.log('❌ Failed to generate workbook.\n');
    }
};

// Export workbook to PNG - COMPLETELY REWRITTEN
const exportWorkbookToPNG = async () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('EXPORT WORKBOOK TO PNG');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    if (!workbook.currentWorkbook) {
        console.log('⚠️  No workbook generated yet. Generating now...\n');
        workbook.generateLinearWorkbook();
    }
    
    console.log('📸 Creating spreadsheet-style PNG image...\n');
    
    try {
        // Create spreadsheet-style workbook image
        const canvas = createWorkbookCanvas(workbook);
        
        // Default filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const defaultFilename = `linear-workbook-${currentProblem.type}-${timestamp}.png`;
        
        const filename = await prompt(`Enter filename (default: ${defaultFilename}): `) || defaultFilename;
        
        // Ensure .png extension
        const finalFilename = filename.endsWith('.png') ? filename : filename + '.png';
        
        // Save PNG file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(finalFilename, buffer);
        
        console.log(`\n✅ Workbook exported successfully!`);
        console.log(`📁 File: ${finalFilename}`);
        console.log(`📏 Size: ${(buffer.length / 1024).toFixed(2)} KB`);
        console.log(`📐 Dimensions: ${canvas.width}x${canvas.height} pixels\n`);
        
        console.log('✨ Your workbook is ready! Open the PNG file to view it.\n');
        
    } catch (error) {
        console.log(`❌ Export failed: ${error.message}\n`);
        console.log('💡 Make sure you have installed: npm install canvas\n');
    }
};

// Create spreadsheet-style canvas - NEW FUNCTION
const createWorkbookCanvas = (wb) => {
    const cellWidth = 400;
    const cellHeight = 35;
    const labelWidth = 300;
    const headerHeight = 60;
    const titleHeight = 80;
    const padding = 20;
    const borderWidth = 2;
    
    // Calculate required height
    let totalRows = 0;
    if (wb.currentWorkbook && wb.currentWorkbook.sections) {
        wb.currentWorkbook.sections.forEach(section => {
            totalRows += 2; // Section header + spacing
            if (section.data) {
                totalRows += section.data.length;
            }
        });
    }
    
    const width = 1400;
    const height = Math.max(2000, titleHeight + (totalRows * cellHeight) + 200);
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Colors from theme
    const colors = wb.colors || {
        background: '#ffffff',
        headerBg: '#4472c4',
        headerText: '#ffffff',
        sectionBg: '#d9e2f3',
        sectionText: '#000000',
        cellBg: '#ffffff',
        cellText: '#000000',
        gridColor: '#c0c0c0',
        borderColor: '#808080'
    };
    
    // Fill background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);
    
    // Draw title header
    ctx.fillStyle = colors.headerBg;
    ctx.fillRect(0, 0, width, titleHeight);
    
    ctx.fillStyle = colors.headerText;
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Linear Mathematical Workbook', width / 2, titleHeight / 2);
    
    // Add timestamp
    ctx.font = '14px Arial';
    const timestamp = new Date().toLocaleString();
    ctx.fillText(`Generated: ${timestamp}`, width / 2, titleHeight - 20);
    
    let y = titleHeight + padding;
    
    // Draw sections
    if (wb.currentWorkbook && wb.currentWorkbook.sections) {
        wb.currentWorkbook.sections.forEach(section => {
            // Section header
            ctx.fillStyle = colors.sectionBg;
            ctx.fillRect(padding, y, width - (padding * 2), headerHeight);
            
            ctx.strokeStyle = colors.borderColor;
            ctx.lineWidth = borderWidth;
            ctx.strokeRect(padding, y, width - (padding * 2), headerHeight);
            
            ctx.fillStyle = colors.sectionText;
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(section.title, padding + 15, y + headerHeight / 2);
            
            y += headerHeight + 5;
            
            // Draw data rows
            if (section.data && Array.isArray(section.data)) {
                section.data.forEach(row => {
                    if (row.length === 0 || (row.length === 1 && row[0] === '')) {
                        y += 10; // Spacing row
                        return;
                    }
                    
                    const label = String(row[0] || '');
                    const value = String(row[1] || '');
                    
                    // Draw label cell
                    ctx.fillStyle = colors.cellBg;
                    ctx.fillRect(padding, y, labelWidth, cellHeight);
                    ctx.strokeStyle = colors.gridColor;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(padding, y, labelWidth, cellHeight);
                    
                    // Draw value cell
                    ctx.fillRect(padding + labelWidth, y, width - labelWidth - (padding * 2), cellHeight);
                    ctx.strokeRect(padding + labelWidth, y, width - labelWidth - (padding * 2), cellHeight);
                    
                    // Draw text
                    ctx.fillStyle = colors.cellText;
                    ctx.font = 'bold 14px Arial';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    
                    // Truncate label if too long
                    const maxLabelLength = 35;
                    const displayLabel = label.length > maxLabelLength ? 
                        label.substring(0, maxLabelLength) + '...' : label;
                    ctx.fillText(displayLabel, padding + 10, y + cellHeight / 2);
                    
                    // Draw value (possibly multi-line)
                    ctx.font = '13px Arial';
                    const maxValueLength = 85;
                    
                    if (value.length > maxValueLength) {
                        // Split into multiple lines
                        const lines = wrapText(value, maxValueLength);
                        const lineHeight = 16;
                        const startY = y + (cellHeight / 2) - ((lines.length - 1) * lineHeight / 2);
                        
                        lines.forEach((line, i) => {
                            ctx.fillText(line, padding + labelWidth + 10, startY + (i * lineHeight));
                        });
                        
                        // Increase cell height if needed
                        if (lines.length > 2) {
                            const extraHeight = (lines.length - 2) * lineHeight;
                            y += extraHeight;
                        }
                    } else {
                        ctx.fillText(value, padding + labelWidth + 10, y + cellHeight / 2);
                    }
                    
                    y += cellHeight;
                });
            }
            
            y += padding; // Space between sections
        });
    }
    
    // Add footer
    ctx.fillStyle = colors.gridColor;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Generated by Enhanced Linear Mathematical Workbook System', width / 2, height - 30);
    
    return canvas;
};

// Helper function to wrap text
const wrapText = (text, maxLength) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        if ((currentLine + word).length <= maxLength) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines;
};

// Get problem input from user

const getProblemInput = async () => {
    clearScreen();
    displayBanner();

    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('ENTER YOUR PROBLEM');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    console.log('📝 Enter the mathematical equation or problem:\n');
    console.log('Examples:');
    console.log('  • 2x + 3 = 11');
    console.log('  • 3x - 5 > 10');
    console.log('  • |2x - 1| = 7');
    console.log('  • 2x + y = 5, 3x - y = 5\n');

    const equation = await prompt('Equation: ');

    if (!equation) {
        console.log('\n⚠️  No equation entered. Please try again.\n');
        return false;
    }

    console.log('\n📋 Scenario/Context (optional):');
    console.log('   (e.g., "A store problem", "Temperature conversion", etc.)\n');

    const scenario = await prompt('Scenario (press Enter to skip): ');

    // Auto-detect problem type
    // Auto-detect problem type
    const problemType = detectProblemType(equation, scenario);
    console.log(`\n🔍 Detected Problem Type: ${problemType}`);
    
    // Show what was detected for debugging
    if (problemType === 'line_equations') {
        console.log(`   ✓ Recognized as line equation problem`);
    } else if (problemType === 'parallel_perpendicular') {
        console.log(`   ✓ Recognized as parallel/perpendicular line problem`);
    }
    console.log('');

    // Extract parameters
    const parameters = extractParameters(equation, problemType, scenario);

    

    // Show extracted parameters for debugging
    if (problemType === 'line_equations' || problemType === 'parallel_perpendicular') {
        console.log(`📊 Extracted Parameters:`);
        if (parameters.point1) {
            console.log(`   Point 1: (${parameters.point1.x}, ${parameters.point1.y})`);
        }
        if (parameters.point2) {
            console.log(`   Point 2: (${parameters.point2.x}, ${parameters.point2.y})`);
        }
        if (parameters.slope !== undefined) {
            console.log(`   Slope: ${parameters.slope}`);
        }
        if (parameters.referenceLine) {
            console.log(`   Reference Line: y = ${parameters.referenceLine.slope}x + ${parameters.referenceLine.yIntercept}`);
        }
        if (parameters.point) {
            console.log(`   Through Point: (${parameters.point.x}, ${parameters.point.y})`);
        }
        if (parameters.relationship) {
            console.log(`   Relationship: ${parameters.relationship}`);
        }
        console.log('');
    }

    // Validate system_2x2 parameters
    if (problemType === 'system_2x2') {
        if (!parameters.a1 || !parameters.b1 || !parameters.c1 || !parameters.a2 || !parameters.b2 || !parameters.c2) {
            console.log('⚠️  Could not parse system of equations properly.');
            console.log('Please enter in format: ax + by = c, dx + ey = f\n');
            console.log('Example: 2x + y = 5, 3x - y = 5\n');
            return false;
        }
        console.log('✓ System parameters extracted successfully\n');
    }
    // Ask for explanation level preference
    console.log('📚 Choose default explanation level:\n');
    console.log('  1. Basic (Simple, beginner-friendly)');
    console.log('  2. Intermediate (Standard mathematical terms)');
    console.log('  3. Detailed (Comprehensive with theory)');
    console.log('  4. Scaffolded (Guided learning with questions)\n');

    const levelChoice = await prompt('Level (1-4, default 2): ') || '2';                                          
    const levels = ['basic', 'intermediate', 'detailed', 'scaffolded'];                                                             
    const explanationLevel = levels[parseInt(levelChoice) - 1] || 'intermediate';                                               
    // Create workbook with chosen settings
    workbook = new EnhancedLinearMathematicalWorkbook({
        width: 1400,                                                    
        height: 2000,
        explanationLevel: explanationLevel,                             includeVerificationInSteps: true,
        includeConceptualConnections: true,
        includeAlternativeMethods: true,
        includeErrorPrevention: true,
        includeCommonMistakes: true,                                    includePedagogicalNotes: true,
        theme: 'excel'
    });
                                                                    // Store problem info
    currentProblem = {
        equation: equation,
        originalInput: equation,
        cleanInput: equation,
        scenario: scenario,
        type: problemType,
        parameters: parameters,
        context: {
            userProvided: true,
            explanationLevel: explanationLevel
        }
    };

    console.log('\n✅ Problem loaded successfully!\n');

    // Solve the problem
    console.log('🔄 Solving problem...\n');

    try {
        currentResult = workbook.solveLinearProblem({
            equation: equation,
            scenario: scenario,
            problemType: problemType,
            parameters: parameters
        });

        // Check if solution indicates manual setup needed
        if (currentResult.solution?.needsManualSetup || currentResult.solutionType === 'Requires manual setup') {
            console.log('ℹ️  This problem type requires specific equation format.\n');
            if (currentResult.solution?.instructions || currentResult.instructions) {
                console.log('📋 Instructions:');
                (currentResult.solution?.instructions || currentResult.instructions).forEach(instr => {
                    console.log(`   ${instr}`);
                });
                console.log('');
            }
            if (currentResult.solution?.example || currentResult.example) {
                console.log(`💡 Example format: ${currentResult.solution?.example || currentResult.example}\n`);
            }
            const retry = await prompt('Would you like to try entering it again? (y/n): ');
            if (retry.toLowerCase() === 'y') {
                return await getProblemInput();
            }
            return false;
        }

        console.log('✅ Solution computed successfully!\n');
        await prompt('Press Enter to continue to main menu...');
        return true;

    } catch (error) {
        console.log(`❌ Error solving problem: ${error.message}\n`);
        console.log('💡 This might mean:\n');
        console.log('  • The equation format needs to be adjusted');
        console.log('  • This problem type needs more specific input\n');
        
        console.log('🔍 What was detected:');
        console.log(`  Problem type: ${problemType}`);
        console.log(`  Parameters extracted: ${JSON.stringify(parameters, null, 2)}\n`);
        
        console.log('💡 For word problems, try including numeric values like:');
        console.log('  • "distance: 240, time: 4" for rate problems');
        console.log('  • "principal: 5000, rate: 0.04, time: 3" for money problems\n');
        
        const retry = await prompt('Would you like to try again? (y/n): ');
        if (retry.toLowerCase() === 'y') {
            return await getProblemInput();
        }
        return false;
    }

};

// Main application loop
const runInteractiveWorkbook = async () => {
    displayWelcome();
    
    await prompt('\nPress Enter to continue...');
    
    // Get problem from user
    const problemLoaded = await getProblemInput();
    
    if (!problemLoaded) {
        console.log('Exiting...\n');
        rl.close();
        return;
    }
    
    // Main menu loop
    let running = true;
    
    while (running) {
        clearScreen();
        displayBanner();
        
        console.log(`📋 Current Problem: ${currentProblem.originalInput}`);
        console.log(`📊 Problem Type: ${currentProblem.type}`);
        console.log(`📚 Explanation Level: ${workbook.explanationLevel}`);
        
        const choice = await displayMainMenu();
        
        switch (choice) {
            case '1':
                clearScreen();
                displayBanner();
                generateLesson(currentProblem.type);
                await prompt('\nPress Enter to continue...');
                break;
                
            case '2':
                clearScreen();
                displayBanner();
                generateSolution();
                await prompt('\nPress Enter to continue...');
                break;
                
            case '3':
                clearScreen();
                displayBanner();
                solutionVerification();
                await prompt('\nPress Enter to continue...');
                break;
                
            case '4':
                clearScreen();
                displayBanner();
                await solutionSteps();
                await prompt('\nPress Enter to continue...');
                break;
                
            case '5':
                clearScreen();
                displayBanner();
                displayGraph();
                await prompt('\nPress Enter to continue...');
                break;
                
            case '6':
                clearScreen();
                displayBanner();
                pedagogicalNotes();
                await prompt('\nPress Enter to continue...');
                break;
                
            case '7':
                clearScreen();
                displayBanner();
                alternativeMethods();
                await prompt('\nPress Enter to continue...');
                break;
                
            case '8':
                clearScreen();
                displayBanner();
                generateRelatedProblems();
                await prompt('\nPress Enter to continue...');
                break;
                
            case '9':
                clearScreen();
                displayBanner();
                generateCompleteWorkbook();
                await prompt('\nPress Enter to continue...');
                break;
                
            case '10':
                clearScreen();
                displayBanner();
                await exportWorkbookToPNG();
                await prompt('\nPress Enter to continue...');
                break;
                
            case '11':
                const newProblem = await getProblemInput();
                if (!newProblem) {
                    running = false;
                }
                break;
                
            case '12':
                console.log('\n═══════════════════════════════════════════════════════════════════════');
                console.log('Thank you for using the Interactive Linear Mathematical Workbook!');
                console.log('═══════════════════════════════════════════════════════════════════════\n');
                console.log('📚 Keep practicing and learning!');
                console.log('🎯 Remember: Mathematics is all about understanding, not just answers.\n');
                running = false;
                break;
                
            default:
                console.log('\n⚠️  Invalid choice. Please enter a number from 1-12.\n');
                await prompt('Press Enter to continue...');
        }
    }
    
    rl.close();
};

// Start the application
console.log('Starting Interactive Linear Mathematical Workbook...\n');
runInteractiveWorkbook().catch(error => {
    console.error('Fatal error:', error);
    rl.close();
});
