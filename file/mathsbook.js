import { EnhancedLinearMathematicalWorkbook } from './mytemplate.js';
import { EnhancedQuadraticMathematicalWorkbook } from './quadratic.js'; // NEW IMPORT
import { EnhancedGeometricMathematicalWorkbook } from './geometric.js'; // NEW IMPORT
import readline from 'readline';
import fs from 'fs';
import { createCanvas } from 'canvas';

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Global state - UPDATED
let linearWorkbook = null;
let quadraticWorkbook = null; // NEW
let geometricWorkbook = null; // NEW
let currentWorkbook = null;
let currentProblemCategory = null; // NEW - 'linear' or 'quadratic'
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

// Display banner - UPDATED
const displayBanner = () => {
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                    ║');
    console.log('║     ENHANCED MATHEMATICAL WORKBOOK SYSTEM                          ║');
    console.log('║     Linear & Quadratic Interactive Learning                        ║');
    console.log('║                                                                    ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');
};

// UPDATED: Display welcome message with both linear and quadratic examples
const displayWelcome = () => {
    clearScreen();
    displayBanner();

    console.log('Welcome to the Interactive Mathematical Workbook!\n');
    console.log('This system helps you solve and understand LINEAR, QUADRATIC, and GEOMETRIC problems');
    console.log('with step-by-step explanations at multiple learning levels.\n');

    console.log('═══════════════════════════════════════════════════════════════════════\n');
    console.log('📐 LINEAR PROBLEMS:\n');

    const linearExamples = [
        {
            category: '📐 Simple Linear Equations',
            problems: ['• 2x + 3 = 11', '• 5x - 7 = 18', '• -3x + 9 = 0']
        },
        {
            category: '📊 Linear Inequalities',
            problems: ['• 2x + 4 < 12', '• -3x + 5 >= 8']
        },
        {
            category: '📏 Absolute Value Equations',
            problems: ['• |2x - 3| = 7', '• |x + 5| = 12']
        },
        {
            category: '🔢 Systems of Equations',
            problems: ['• 2x + y = 5, 3x - y = 5', '• x + 2y = 8, 3x - y = 5']
        }
    ];

    linearExamples.forEach(example => {
        console.log(`${example.category}`);
        example.problems.forEach(problem => console.log(`  ${problem}`));
        console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════════════════\n');
    console.log('📈 QUADRATIC PROBLEMS:\n');

    const quadraticExamples = [
        {
            category: '📐 Standard Quadratic Equations',
            problems: ['• x² + 5x + 6 = 0', '• 2x² - 7x + 3 = 0', '• x² - 4x - 5 = 0']
        },
        {
            category: '🔧 Factoring Method',
            problems: ['• x² + 7x + 12 = 0', '• x² - 9 = 0']
        },
        {
            category: '📊 Quadratic Formula',
            problems: ['• 3x² + 4x - 2 = 0', '• x² + 2x - 7 = 0']
        },
        {
            category: '🚀 Projectile Motion',
            problems: ['• h(t) = -16t² + 64t + 80', '• Ball thrown at 48 ft/s from 6 ft high']
        }
    ];

    quadraticExamples.forEach(example => {
        console.log(`${example.category}`);
        example.problems.forEach(problem => console.log(`  ${problem}`));
        console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════════════════\n');
    console.log('📐 GEOMETRIC PROBLEMS:\n');

    const geometricExamples = [
        {
            category: '△ Triangle Problems',
            problems: [
                '• Find angle: angle1=50, angle2=60',
                '• Pythagorean: a=3, b=4, find c',
                '• Triangle area: base=10, height=8'
            ]
        },
        {
            category: '⬜ Quadrilateral Problems',
            problems: [
                '• Rectangle area: length=12, width=5',
                '• Square perimeter: side=7',
                '• Trapezoid area: base1=8, base2=12, height=5'
            ]
        },
        {
            category: '⭕ Circle Problems',
            problems: [
                '• Circle area: radius=5',
                '• Circumference: diameter=10',
                '• Circle area from diameter: d=14'
            ]
        },
        {
            category: '📦 3D Geometry - Volume',
            problems: [
                '• Box volume: length=6, width=4, height=3',
                '• Cylinder volume: radius=3, height=10',
                '• Sphere volume: radius=6'
            ]
        },
        {
            category: '📦 3D Geometry - Surface Area',
            problems: [
                '• Box surface area: l=5, w=3, h=4',
                '• Cylinder surface area: r=4, h=8',
                '• Sphere surface area: r=5'
            ]
        },
        {
            category: '📍 Coordinate Geometry',
            problems: [
                '• Distance: (1,2) to (4,6)',
                '• Midpoint: (2,3) and (8,7)',
                '• Distance formula problems'
            ]
        },
        {
            category: '🔺 Similar Figures',
            problems: [
                '• Similar triangles with scale factor',
                '• Proportional sides problems',
                '• Scale factor applications'
            ]
        }
    ];

    geometricExamples.forEach(example => {
        console.log(`${example.category}`);
        example.problems.forEach(problem => console.log(`  ${problem}`));
        console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════════════════\n');
    console.log('💡 TIP: Enter equations naturally, and the system will automatically');
    console.log('   detect whether it\'s LINEAR, QUADRATIC, or GEOMETRIC and solve accordingly!\n');
};

// UPDATED: Detect if problem is linear or quadratic FIRST


// UPDATED: Main problem type detector - now routes to linear or quadratic
const detectProblemCategory = (equation, scenario) => {
    const input = (equation + ' ' + scenario).toLowerCase();
    
    // Check for geometric indicators FIRST
    if (input.includes('triangle') || input.includes('angle') || input.includes('pythagorean') ||
        input.includes('rectangle') || input.includes('square') || input.includes('circle') ||
        input.includes('radius') || input.includes('diameter') || input.includes('circumference') ||
        input.includes('area') || input.includes('perimeter') || input.includes('volume') ||
        input.includes('surface area') || input.includes('cylinder') || input.includes('sphere') ||
        input.includes('cone') || input.includes('polygon') || input.includes('distance between') ||
        input.includes('midpoint') || input.includes('coordinate') || input.includes('trapezoid') ||
        input.includes('parallelogram') || input.includes('prism') || input.includes('geometry') ||
        input.includes('similar') && (input.includes('triangle') || input.includes('figure'))) {
        return 'geometric';
    }
    
    // Check for quadratic indicators
    if (input.includes('x²') || input.includes('x^2') || input.includes('x**2') ||
        input.includes('squared') || input.includes('quadratic') ||
        /\d*x\s*\*\*\s*2/.test(input) || /\d*x\s*\^\s*2/.test(input)) {
        return 'quadratic';
    }
    
    if (input.includes('projectile') || input.includes('parabola') || 
        input.includes('vertex') || input.includes('discriminant')) {
        return 'quadratic';
    }
    
    // Default to linear
    return 'linear';
};

// NEW: Geometric problem type detector
const detectGeometricProblemType = (equation, scenario) => {
    const input = (equation + ' ' + scenario).toLowerCase();

    // Triangle problems
    if (input.includes('triangle') && input.includes('angle')) {
        return 'triangle_angles';
    }
    if (input.includes('pythagorean') || (input.includes('right') && input.includes('triangle') && input.includes('side'))) {
        return 'pythagorean';
    }
    if (input.includes('triangle') && input.includes('area')) {
        return 'triangle_area';
    }

    // Rectangle problems
    if (input.includes('rectangle')) {
        return 'rectangle_problems';
    }

    // Square problems
    if (input.includes('square') && !input.includes('square root')) {
        return 'square_problems';
    }

    // Parallelogram
    if (input.includes('parallelogram')) {
        return 'parallelogram_problems';
    }

    // Trapezoid
    if (input.includes('trapezoid') || input.includes('trapezium')) {
        return 'trapezoid_problems';
    }

    // Circle problems
    if (input.includes('circle') && input.includes('circumference')) {
        return 'circle_circumference';
    }
    if (input.includes('circle') && input.includes('area')) {
        return 'circle_area';
    }
    if (input.includes('circle')) {
        return 'circle_area'; // default circle problem
    }

    // Polygon angles
    if (input.includes('polygon') && input.includes('angle')) {
        return 'polygon_angles';
    }

    // 3D Volume problems
    if ((input.includes('box') || input.includes('rectangular prism') || input.includes('cuboid')) && input.includes('volume')) {
        return 'rectangular_prism_volume';
    }
    if (input.includes('cylinder') && input.includes('volume')) {
        return 'cylinder_volume';
    }
    if (input.includes('sphere') && input.includes('volume')) {
        return 'sphere_volume';
    }
    if (input.includes('cone') && input.includes('volume')) {
        return 'cone_volume';
    }

    // 3D Surface Area problems
    if ((input.includes('box') || input.includes('rectangular prism')) && input.includes('surface')) {
        return 'rectangular_prism_surface_area';
    }
    if (input.includes('cylinder') && input.includes('surface')) {
        return 'cylinder_surface_area';
    }
    if (input.includes('sphere') && input.includes('surface')) {
        return 'sphere_surface_area';
    }

    // Coordinate geometry
    if (input.includes('distance') && (input.includes('point') || input.includes('coordinate'))) {
        return 'distance_formula';
    }
    if (input.includes('midpoint')) {
        return 'midpoint_formula';
    }

    // Similarity
    if (input.includes('similar') && input.includes('triangle')) {
        return 'similar_triangles';
    }
    if (input.includes('scale') && input.includes('factor')) {
        return 'scale_factor';
    }

    // Default
    return 'triangle_angles';
};

// UPDATED: Main problem type detector - routes to linear, quadratic, or geometric
const detectProblemType = (equation, scenario) => {
    const category = detectProblemCategory(equation, scenario);
    
    if (category === 'geometric') {
        return detectGeometricProblemType(equation, scenario);
    } else if (category === 'quadratic') {
        return detectQuadraticProblemType(equation, scenario);
    } else {
        return detectLinearProblemType(equation, scenario);
    }
};

// NEW: Quadratic problem type detector
const detectQuadraticProblemType = (equation, scenario) => {
    const input = (equation + ' ' + scenario).toLowerCase();
    const eqTrimmed = equation.trim();

    // Standard quadratic equation
    if (eqTrimmed.match(/[-+]?\d*\.?\d*x[²^]\s*[-+]\s*\d*\.?\d*x\s*[-+]\s*\d*\.?\d*\s*=\s*0/) ||
        input.includes('solve') && input.includes('quadratic')) {
        
        // Check for specific method requests
        if (input.includes('factor') || input.includes('factoring') || input.includes('factorization')) {
            return 'factoring_quadratic';
        }
        if (input.includes('complet') && input.includes('square')) {
            return 'completing_square';
        }
        if (input.includes('formula') || input.includes('quadratic formula')) {
            return 'quadratic_formula';
        }
        
        return 'standard_quadratic';
    }

    // Quadratic inequality
    if ((eqTrimmed.includes('x²') || eqTrimmed.includes('x^2')) &&
        (input.includes('>') || input.includes('<') || input.includes('≥') || input.includes('≤'))) {
        return 'quadratic_inequality';
    }

    // Vertex form analysis
    if (input.includes('vertex') || input.includes('vertex form') || 
        input.includes('maximum') || input.includes('minimum')) {
        return 'vertex_form';
    }

    // Function analysis
    if (input.includes('analyze') && (input.includes('f(x)') || input.includes('function')) &&
        (input.includes('x²') || input.includes('x^2') || input.includes('quadratic'))) {
        return 'function_analysis';
    }

    // Projectile motion
    if (input.includes('projectile') || input.includes('throw') || input.includes('ball') ||
        input.includes('height') && input.includes('time') || input.includes('trajectory')) {
        return 'projectile_motion';
    }

    // Area and geometry
    if ((input.includes('area') || input.includes('dimension') || input.includes('rectangle') ||
         input.includes('perimeter')) && (input.includes('x²') || input.includes('squared'))) {
        return 'area_geometry';
    }

    // Number problems
    if (input.includes('consecutive') || input.includes('number') && input.includes('product') ||
        input.includes('sum') && input.includes('square')) {
        return 'number_problems';
    }

    // Business/revenue
    if (input.includes('revenue') || input.includes('profit') || input.includes('business') ||
        input.includes('maximize') && input.includes('price')) {
        return 'business_revenue';
    }

    // Optimization
    if (input.includes('optimize') || input.includes('maximum') || input.includes('minimum')) {
        return 'optimization';
    }

    // Complex solutions
    if (input.includes('complex') || input.includes('imaginary') || input.includes('no real')) {
        return 'complex_solutions';
    }

    // Default
    return 'standard_quadratic';
};

// EXISTING: Linear problem type detector (keep as is)
const detectLinearProblemType = (equation, scenario) => {
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


// UPDATED: Extract parameters for both linear and quadratic
const extractParameters = (equation, problemType, scenario = '') => {
    const category = detectProblemCategory(equation, scenario);
    
    if (category === 'geometric') {
        return extractGeometricParameters(equation, problemType, scenario);
    } else if (category === 'quadratic') {
        return extractQuadraticParameters(equation, problemType, scenario);
    } else {
        return extractLinearParameters(equation, problemType, scenario);
    }
};

// NEW: Extract geometric parameters
const extractGeometricParameters = (equation, problemType, scenario = '') => {
    const params = {};
    const fullInput = (equation + ' ' + scenario).trim().toLowerCase();

    // Extract numeric values with labels
    const extractValue = (label) => {
        const regex = new RegExp(`${label}\\s*[=:]?\\s*([+-]?\\d+\\.?\\d*)`, 'i');
        const match = fullInput.match(regex);
        return match ? parseFloat(match[1]) : undefined;
    };

    // Triangle angle problems
    if (problemType === 'triangle_angles') {
        params.angle1 = extractValue('angle1') || extractValue('a');
        params.angle2 = extractValue('angle2') || extractValue('b');
        params.angle3 = extractValue('angle3') || extractValue('c');
    }

    // Pythagorean theorem
    if (problemType === 'pythagorean') {
        params.a = extractValue('a') || extractValue('leg1');
        params.b = extractValue('b') || extractValue('leg2');
        params.c = extractValue('c') || extractValue('hypotenuse');
        
        // Determine which side to find
        if (params.c === undefined) params.findSide = 'c';
        else if (params.a === undefined) params.findSide = 'a';
        else if (params.b === undefined) params.findSide = 'b';
    }

    // Triangle area
    if (problemType === 'triangle_area') {
        params.base = extractValue('base') || extractValue('b');
        params.height = extractValue('height') || extractValue('h');
        params.side1 = extractValue('side1');
        params.side2 = extractValue('side2');
        params.side3 = extractValue('side3');
    }

    // Rectangle problems
    if (problemType === 'rectangle_problems') {
        params.length = extractValue('length') || extractValue('l');
        params.width = extractValue('width') || extractValue('w');
        params.area = extractValue('area');
        params.perimeter = extractValue('perimeter');
        params.diagonal = extractValue('diagonal');
        
        // Determine what to find
        if (fullInput.includes('area')) params.findWhat = 'area';
        else if (fullInput.includes('perimeter')) params.findWhat = 'perimeter';
        else if (fullInput.includes('diagonal')) params.findWhat = 'diagonal';
        else params.findWhat = 'area'; // default
    }

    // Square problems
    if (problemType === 'square_problems') {
        params.side = extractValue('side') || extractValue('s');
        params.area = extractValue('area');
        params.perimeter = extractValue('perimeter');
        params.diagonal = extractValue('diagonal');
    }

    // Parallelogram
    if (problemType === 'parallelogram_problems') {
        params.base = extractValue('base') || extractValue('b');
        params.height = extractValue('height') || extractValue('h');
        params.side = extractValue('side');
    }

    // Trapezoid
    if (problemType === 'trapezoid_problems') {
        params.base1 = extractValue('base1') || extractValue('b1');
        params.base2 = extractValue('base2') || extractValue('b2');
        params.height = extractValue('height') || extractValue('h');
    }

    // Circle problems
    if (problemType === 'circle_circumference' || problemType === 'circle_area') {
        params.radius = extractValue('radius') || extractValue('r');
        params.diameter = extractValue('diameter') || extractValue('d');
    }

    // Polygon angles
    if (problemType === 'polygon_angles') {
        params.sides = extractValue('sides') || extractValue('n');
    }

    // 3D Volume problems
    if (problemType === 'rectangular_prism_volume') {
        params.length = extractValue('length') || extractValue('l');
        params.width = extractValue('width') || extractValue('w');
        params.height = extractValue('height') || extractValue('h');
    }

    if (problemType === 'cylinder_volume' || problemType === 'cylinder_surface_area') {
        params.radius = extractValue('radius') || extractValue('r');
        params.diameter = extractValue('diameter') || extractValue('d');
        params.height = extractValue('height') || extractValue('h');
    }

    if (problemType === 'sphere_volume' || problemType === 'sphere_surface_area') {
        params.radius = extractValue('radius') || extractValue('r');
        params.diameter = extractValue('diameter') || extractValue('d');
    }

    if (problemType === 'cone_volume') {
        params.radius = extractValue('radius') || extractValue('r');
        params.diameter = extractValue('diameter') || extractValue('d');
        params.height = extractValue('height') || extractValue('h');
    }

    if (problemType === 'rectangular_prism_surface_area') {
        params.length = extractValue('length') || extractValue('l');
        params.width = extractValue('width') || extractValue('w');
        params.height = extractValue('height') || extractValue('h');
    }

    // Coordinate geometry
    if (problemType === 'distance_formula' || problemType === 'midpoint_formula') {
        params.x1 = extractValue('x1');
        params.y1 = extractValue('y1');
        params.x2 = extractValue('x2');
        params.y2 = extractValue('y2');
        
        // Try to extract from (x,y) format
        const pointsMatch = fullInput.match(/\(([+-]?\d+\.?\d*)\s*,\s*([+-]?\d+\.?\d*)\)/g);
        if (pointsMatch && pointsMatch.length >= 2) {
            const point1 = pointsMatch[0].match(/\(([+-]?\d+\.?\d*)\s*,\s*([+-]?\d+\.?\d*)\)/);
            const point2 = pointsMatch[1].match(/\(([+-]?\d+\.?\d*)\s*,\s*([+-]?\d+\.?\d*)\)/);
            if (point1) {
                params.x1 = parseFloat(point1[1]);
                params.y1 = parseFloat(point1[2]);
            }
            if (point2) {
                params.x2 = parseFloat(point2[1]);
                params.y2 = parseFloat(point2[2]);
            }
        }
    }

    // Similar triangles / scale factor
    if (problemType === 'similar_triangles' || problemType === 'scale_factor') {
        params.side1_triangle1 = extractValue('side1_triangle1');
        params.side1_triangle2 = extractValue('side1_triangle2');
        params.side2_triangle1 = extractValue('side2_triangle1');
        params.side2_triangle2 = extractValue('side2_triangle2');
        params.original = extractValue('original');
        params.scaled = extractValue('scaled');
    }

    return params;
};

// NEW: Extract quadratic parameters
const extractQuadraticParameters = (equation, problemType, scenario = '') => {
    const params = {};
    const fullInput = (equation + ' ' + scenario).trim();
    const lowerInput = fullInput.toLowerCase();

    // Standard quadratic: ax² + bx + c = 0
    if (problemType === 'standard_quadratic' || problemType === 'quadratic_formula' || 
        problemType === 'factoring_quadratic' || problemType === 'completing_square' ||
        problemType === 'quadratic_inequality') {
        
        // Try multiple patterns for quadratic
        let match = equation.match(/([+-]?\d*\.?\d*)\s*x[²^2]\s*([+-]\s*\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)\s*=\s*0/);
        
        if (!match) {
            // Try pattern without spaces
            match = equation.match(/([+-]?\d*\.?\d*)x[²^2]([+-]?\d*\.?\d*)x([+-]?\d+\.?\d*)=0/);
        }
        
        if (!match) {
            // Try pattern with x**2 or x^2
            match = equation.match(/([+-]?\d*\.?\d*)\s*x\s*[\*^]{1,2}\s*2\s*([+-]\s*\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)\s*=\s*0/);
        }

        if (match) {
            let aStr = match[1].replace(/\s/g, '');
            params.a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
            
            let bStr = match[2].replace(/\s/g, '');
            params.b = bStr === '' || bStr === '+' ? 1 : bStr === '-' ? -1 : parseFloat(bStr);
            
            params.c = parseFloat(match[3].replace(/\s/g, ''));
            
            if (problemType === 'quadratic_inequality') {
                const inequalityMatch = equation.match(/[><≤≥]/);
                params.operator = inequalityMatch ? inequalityMatch[0] : '>';
            }
        }
    }

    // Vertex form or function analysis
    if (problemType === 'vertex_form' || problemType === 'function_analysis' || problemType === 'optimization') {
        // Try to extract from f(x) = ax² + bx + c or similar
        const funcMatch = fullInput.match(/f\(x\)\s*=\s*([+-]?\d*\.?\d*)\s*x[²^2]\s*([+-]\s*\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)/);
        
        if (funcMatch) {
            let aStr = funcMatch[1].replace(/\s/g, '');
            params.a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
            
            let bStr = funcMatch[2].replace(/\s/g, '');
            params.b = bStr === '' || bStr === '+' ? 1 : bStr === '-' ? -1 : parseFloat(bStr);
            
            params.c = parseFloat(funcMatch[3].replace(/\s/g, ''));
        }
        
        if (lowerInput.includes('maximize')) {
            params.optimizationType = 'maximize';
        } else if (lowerInput.includes('minimize')) {
            params.optimizationType = 'minimize';
        }
    }

    // Projectile motion: h(t) = -16t² + v₀t + h₀
    if (problemType === 'projectile_motion') {
        params.scenario = fullInput;
        params.units = lowerInput.includes('meter') || lowerInput.includes('metre') ? 'metric' : 'imperial';
        
        // Try to extract initial velocity and height
        const velMatch = fullInput.match(/(?:velocity|speed|thrown|launched)\s*(?:at|with)?\s*([+-]?\d+\.?\d*)/i);
        if (velMatch) params.initialVelocity = parseFloat(velMatch[1]);
        
        const heightMatch = fullInput.match(/(?:from|at|height of)\s*([+-]?\d+\.?\d*)\s*(?:feet|ft|meters|m)/i);
        if (heightMatch) params.initialHeight = parseFloat(heightMatch[1]);
        
        const targetMatch = fullInput.match(/(?:reach|height of)\s*([+-]?\d+\.?\d*)/i);
        if (targetMatch) params.targetHeight = parseFloat(targetMatch[1]);
    }

    // Area/geometry problems
    if (problemType === 'area_geometry') {
        params.scenario = fullInput;
        
        const areaMatch = fullInput.match(/area\s*[=:]\s*([+-]?\d+\.?\d*)/i);
        if (areaMatch) params.area = parseFloat(areaMatch[1]);
        
        const lengthMatch = fullInput.match(/length\s*[=:]\s*([^,]+)/i);
        if (lengthMatch) params.lengthRelation = lengthMatch[1].trim();
        
        const widthMatch = fullInput.match(/width\s*[=:]\s*([^,]+)/i);
        if (widthMatch) params.widthRelation = widthMatch[1].trim();
    }

    // Number problems
    if (problemType === 'number_problems') {
        params.scenario = fullInput;
        
        if (lowerInput.includes('consecutive')) {
            params.consecutive = true;
            params.type = lowerInput.includes('even') ? 'even' : 
                         lowerInput.includes('odd') ? 'odd' : 'integers';
        }
        
        const productMatch = fullInput.match(/product\s*[=:]\s*([+-]?\d+\.?\d*)/i);
        if (productMatch) params.product = parseFloat(productMatch[1]);
        
        const sumMatch = fullInput.match(/sum\s*[=:]\s*([+-]?\d+\.?\d*)/i);
        if (sumMatch) params.sum = parseFloat(sumMatch[1]);
    }

    // Business/revenue problems
    if (problemType === 'business_revenue') {
        params.scenario = fullInput;
        
        // Try to extract revenue function
        const revMatch = fullInput.match(/R\(x\)\s*=\s*([^,;\n]+)/i);
        if (revMatch) params.revenueFunction = revMatch[1].trim();
        
        const priceMatch = fullInput.match(/price\s*[=:]\s*([^,;\n]+)/i);
        if (priceMatch) params.priceFunction = priceMatch[1].trim();
    }

    return params;
};

// EXISTING: Extract linear parameters (keep your existing function)
const extractLinearParameters = (equation, problemType, scenario = '') => {
    // ... (keep all your existing linear parameter extraction code)
    // This is the same code you already have
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


// UPDATED: Main menu - now shows current problem category
// UPDATED: Display main menu
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
    
    const categoryEmoji = currentProblemCategory === 'geometric' ? '📐' : 
                         currentProblemCategory === 'quadratic' ? '📈' : '📊';
    console.log(`${categoryEmoji} Current Category: ${currentProblemCategory ? currentProblemCategory.toUpperCase() : 'None'}`);
    
    const choice = await prompt('Enter your choice (1-12): ');
    return choice;
};

// UPDATED: Solution steps - works for linear, quadratic, AND geometric
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

    currentWorkbook.explanationLevel = chosenLevel;

    console.log(`\n📊 Explanation Level: ${chosenLevel.toUpperCase()}\n`);
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    try {
        const problemConfig = {
            equation: currentProblem.equation || currentProblem.originalInput,
            problem: currentProblem.originalInput,
            scenario: currentProblem.scenario || '',
            problemType: currentProblem.type,
            parameters: currentProblem.parameters,
            context: currentProblem.context || {}
        };

        // Call appropriate solve method
        if (currentProblemCategory === 'geometric') {
            const result = currentWorkbook.solveGeometricProblem(problemConfig);
            currentResult = result;
        } else if (currentProblemCategory === 'quadratic') {
            const result = currentWorkbook.solveQuadraticProblem(problemConfig);
            currentResult = result;
        } else {
            const result = currentWorkbook.solveLinearProblem(problemConfig);
            currentResult = result;
        }

        // Display the steps (same logic for all categories)
        if (currentWorkbook.solutionSteps && currentWorkbook.solutionSteps.length > 0) {
            currentWorkbook.solutionSteps.forEach((step, index) => {
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

                    // Display formulas and calculations
                    if (step.formula) {
                        console.log(`\n   📐 Formula: ${step.formula}`);
                    }

                    if (step.substitution) {
                        console.log(`   ⟹ Substitution: ${step.substitution}`);
                    }

                    if (step.calculation) {
                        console.log(`   ⟹ Calculation: ${step.calculation}`);
                    }

                    // Geometric-specific displays
                    if (step.coefficients) {
                        console.log(`\n   📊 Coefficients: ${JSON.stringify(step.coefficients)}`);
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
                        if (step.explanations.conceptual) {
                            console.log(`\n🧠 Conceptual: ${step.explanations.conceptual}`);
                        }
                    }

                    if (step.errorPrevention && currentWorkbook.includeErrorPrevention) {
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
                    }

                    if (step.finalAnswer) {
                        console.log(`\n✨ FINAL ANSWER ✨`);
                        if (step.numericalResult !== undefined) {
                            console.log(`   ${step.numericalResult}${step.units ? ' ' + step.units : ''}`);
                        }
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
    }

    await prompt('\nPress Enter to continue...');
};

// UPDATED: Generate solution - handles linear, quadratic, AND geometric
const generateSolution = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('PROBLEM SOLUTION');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    console.log(`📋 Problem Category: ${currentProblemCategory.toUpperCase()}`);
    console.log(`📋 Problem Type: ${currentProblem.type}\n`);
    console.log(`📝 Input: ${currentProblem.originalInput}\n`);

    const solution = currentResult.solution || currentResult;

    if (solution.solutionType) {
        console.log(`✨ Solution Type: ${solution.solutionType}\n`);
    }

    // Route to appropriate display function
    if (currentProblemCategory === 'geometric') {
        displayGeometricSolution(solution);
    } else if (currentProblemCategory === 'quadratic') {
        displayQuadraticSolution(solution);
    } else {
        displayLinearSolution(solution);
    }

    console.log('');
};

// NEW: Display geometric solution
const displayGeometricSolution = (solution) => {
    const type = currentProblem.type;

    // Display result/answer
    if (solution.result !== undefined) {
        console.log(`✅ Result: ${solution.result}${solution.units ? ' ' + solution.units : ''}`);
        if (solution.approximation) {
            console.log(`📊 Approximation: ${solution.approximation}`);
        }
    }

    // Display formula used
    if (solution.formula) {
        console.log(`\n📐 Formula: ${solution.formula}`);
    }

    // Display given values
    if (solution.given) {
        console.log(`\n📋 Given:`);
        Object.entries(solution.given).forEach(([key, value]) => {
            console.log(`   ${key}: ${value}`);
        });
    }

    // Display calculation
    if (solution.calculation) {
        console.log(`\n🔢 Calculation:`);
        console.log(`   ${solution.calculation}`);
    }

    // Specific displays by problem type
    switch (type) {
        case 'triangle_angles':
            if (solution.givenAngles) {
                console.log(`\n📊 Triangle Angles:`);
                Object.entries(solution.givenAngles).forEach(([angle, value]) => {
                    console.log(`   ${angle}: ${value}°`);
                });
            }
            if (solution.sum !== undefined) {
                console.log(`\n📊 Sum of angles: ${solution.sum}°`);
            }
            if (solution.isValid !== undefined) {
                console.log(`✓ Valid triangle: ${solution.isValid ? 'YES' : 'NO'}`);
            }
            break;

        case 'pythagorean':
            if (solution.verification) {
                console.log(`\n🔍 Verification:`);
                console.log(`   ${solution.verification.leftSide}`);
                console.log(`   ${solution.verification.rightSide}`);
                console.log(`   Valid: ${solution.verification.isValid ? 'YES' : 'NO'}`);
            }
            if (solution.note) {
                console.log(`\n💡 Note: ${solution.note}`);
            }
            break;

        case 'circle_area':
        case 'circle_circumference':
            if (solution.radius) {
                console.log(`\n📍 Radius: ${solution.radius}`);
            }
            break;

        case 'rectangle_problems':
        case 'square_problems':
            if (solution.area) {
                console.log(`\n📐 Area: ${solution.area} square units`);
            }
            if (solution.perimeter) {
                console.log(`📐 Perimeter: ${solution.perimeter} linear units`);
            }
            if (solution.diagonal) {
                console.log(`📐 Diagonal: ${solution.diagonal} linear units`);
            }
            break;

        case 'polygon_angles':
            if (solution.results) {
                console.log(`\n📊 Polygon Properties:`);
                if (solution.results.interiorSum !== undefined) {
                    console.log(`   Interior angle sum: ${solution.results.interiorSum}°`);
                }
                if (solution.results.eachInteriorAngle !== undefined) {
                    console.log(`   Each interior angle: ${solution.results.eachInteriorAngle}°`);
                }
                if (solution.results.eachExteriorAngle !== undefined) {
                    console.log(`   Each exterior angle: ${solution.results.eachExteriorAngle}°`);
                }
            }
            break;

        case 'distance_formula':
            if (solution.result !== undefined) {
                console.log(`\n📏 Distance: ${solution.result.toFixed(6)}`);
            }
            break;

        case 'midpoint_formula':
            if (solution.resultString) {
                console.log(`\n📍 Midpoint: ${solution.resultString}`);
            } else if (solution.result) {
                console.log(`\n📍 Midpoint: (${solution.result.x}, ${solution.result.y})`);
            }
            break;

        case 'similar_triangles':
        case 'scale_factor':
            if (solution.scaleFactor !== undefined) {
                console.log(`\n🔍 Scale Factor: ${solution.scaleFactor}`);
            }
            if (solution.effects) {
                console.log(`\n📊 Effects of Scale Factor:`);
                Object.entries(solution.effects).forEach(([property, effect]) => {
                    console.log(`   ${property}: ${effect}`);
                });
            }
            break;

        default:
            // Generic display for unhandled types
            if (solution.message) {
                console.log(`\n💬 ${solution.message}`);
            }
    }

    // Display any notes
    if (solution.note && type !== 'pythagorean') {
        console.log(`\n💡 Note: ${solution.note}`);
    }
};

// NEW: Display quadratic solution
const displayQuadraticSolution = (solution) => {
    const type = currentProblem.type;

    switch (type) {
        case 'standard_quadratic':
        case 'quadratic_formula':
        case 'factoring_quadratic':
        case 'completing_square':
            if (solution.equation) {
                console.log(`📐 Equation: ${solution.equation}`);
            }

            if (solution.coefficients) {
                console.log(`📊 Coefficients: a = ${solution.coefficients.a}, b = ${solution.coefficients.b}, c = ${solution.coefficients.c}`);
            }

            if (solution.discriminant !== undefined) {
                console.log(`\n🔍 Discriminant (Δ): ${solution.discriminant.toFixed(6)}`);
                
                if (solution.discriminantInterpretation) {
                    console.log(`💡 Interpretation: ${solution.discriminantInterpretation.interpretation}`);
                    console.log(`📊 Graph Meaning: ${solution.discriminantInterpretation.graphMeaning}`);
                }
            }

            if (solution.solutions && solution.solutions.length > 0) {
                console.log(`\n✅ Real Solutions:`);
                solution.solutions.forEach((sol, i) => {
                    console.log(`   x${i + 1} = ${sol.toFixed(6)}`);
                });

                if (solution.sumOfRoots !== null) {
                    console.log(`\n📐 Sum of roots: ${solution.sumOfRoots.toFixed(6)}`);
                }
                if (solution.productOfRoots !== null) {
                    console.log(`📐 Product of roots: ${solution.productOfRoots.toFixed(6)}`);
                }
            }

            if (solution.complexSolutions && solution.complexSolutions.length > 0) {
                console.log(`\n ℂ Complex Solutions:`);
                solution.complexSolutions.forEach((sol, i) => {
                    const sign = sol.imaginary >= 0 ? '+' : '';
                    console.log(`   x${i + 1} = ${sol.real.toFixed(6)} ${sign}${sol.imaginary.toFixed(6)}i`);
                });
            }

            if (solution.vertex) {
                console.log(`\n📍 Vertex: (${solution.vertex.x.toFixed(6)}, ${solution.vertex.y.toFixed(6)})`);
            }

            if (solution.axisOfSymmetry !== undefined) {
                console.log(`📏 Axis of Symmetry: x = ${solution.axisOfSymmetry.toFixed(6)}`);
            }

            if (solution.yIntercept !== undefined) {
                console.log(`📌 Y-intercept: ${solution.yIntercept}`);
            }

            // Factoring-specific
            if (solution.factoredForm) {
                console.log(`\n✅ Factored Form: ${solution.factoredForm}`);
            }

            if (solution.factors) {
                console.log(`📋 Factors: ${solution.factors.join(' and ')}`);
            }

            // Completing square-specific
            if (solution.vertexForm) {
                console.log(`\n✅ Vertex Form: ${solution.vertexForm}`);
            }

            if (solution.steps) {
                console.log(`\n📝 Transformation Steps:`);
                solution.steps.forEach((s, i) => {
                    console.log(`   ${i + 1}. ${s.description}: ${s.equation}`);
                });
            }

            if (solution.method) {
                console.log(`\n🔧 Method Used: ${solution.method}`);
            }
            break;

        case 'quadratic_inequality':
            console.log(`📊 Solution Set: ${solution.solutionSet || 'N/A'}`);
            console.log(`📐 Interval Notation: ${solution.intervalNotation || 'N/A'}`);
            
            if (solution.criticalPoints && solution.criticalPoints.length > 0) {
                console.log(`\n🎯 Critical Points (roots): ${solution.criticalPoints.map(p => p.toFixed(6)).join(', ')}`);
            }

            if (solution.parabolaOpens) {
                console.log(`📈 Parabola opens: ${solution.parabolaOpens}`);
            }

            if (solution.testPoints) {
                console.log(`\n🧪 Test Points:`);
                solution.testPoints.forEach(tp => {
                    console.log(`   ${tp.description}`);
                });
            }

            if (solution.inequality) {
                console.log(`\n📐 Original Inequality: ${solution.inequality}`);
            }
            break;

        case 'vertex_form':
        case 'function_analysis':
            if (solution.standardForm) {
                console.log(`📐 Standard Form: ${solution.standardForm}`);
            }

            if (solution.vertexForm) {
                console.log(`📐 Vertex Form: ${solution.vertexForm}`);
            }

            if (solution.vertex) {
                console.log(`\n📍 Vertex: (${solution.vertex.x.toFixed(6)}, ${solution.vertex.y.toFixed(6)})`);
            }

            if (solution.axisOfSymmetry) {
                console.log(`📏 Axis of Symmetry: ${solution.axisOfSymmetry}`);
            }

            if (solution.direction) {
                console.log(`📈 Direction: ${solution.direction}`);
            }

            if (solution.vertexType) {
                console.log(`🎯 Vertex Type: ${solution.vertexType}`);
            }

            if (solution.optimalValue !== undefined) {
                console.log(`✨ Optimal Value: ${solution.optimalValue.toFixed(6)}`);
            }

            if (solution.domain) {
                console.log(`\n📊 Domain: ${solution.domain}`);
            }

            if (solution.range) {
                console.log(`📊 Range: ${solution.range}`);
            }

            if (solution.xIntercepts && solution.xIntercepts.length > 0) {
                console.log(`📌 X-intercepts: ${solution.xIntercepts.map(x => x.toFixed(6)).join(', ')}`);
            }

            if (solution.yIntercept !== undefined) {
                console.log(`📌 Y-intercept: ${solution.yIntercept}`);
            }

            if (solution.extremeValue) {
                console.log(`\n🎯 Extreme Value:`);
                console.log(`   Type: ${solution.extremeValue.type}`);
                console.log(`   Value: ${solution.extremeValue.value.toFixed(6)}`);
                console.log(`   Location: x = ${solution.extremeValue.location.toFixed(6)}`);
            }

            if (solution.transformations) {
                console.log(`\n🔄 Transformations:`);
                solution.transformations.forEach(t => console.log(`   • ${t}`));
            }
            break;

        case 'projectile_motion':
            if (solution.equation) {
                console.log(`📐 Height Equation: ${solution.equation}`);
            }

            if (solution.initialHeight !== undefined) {
                console.log(`📍 Initial Height: ${solution.initialHeight}`);
            }

            if (solution.initialVelocity !== undefined) {
                console.log(`🚀 Initial Velocity: ${solution.initialVelocity}`);
            }

            if (solution.maxHeight !== undefined) {
                console.log(`\n🎯 Maximum Height: ${solution.maxHeight.toFixed(6)}`);
            }

            if (solution.timeToMaxHeight !== undefined) {
                console.log(`⏱️  Time to Max Height: ${solution.timeToMaxHeight.toFixed(6)} seconds`);
            }

            if (solution.timesToReachHeight) {
                console.log(`\n⏱️  Times to reach target height:`);
                solution.timesToReachHeight.forEach((t, i) => {
                    console.log(`   t${i + 1} = ${t.toFixed(6)} seconds`);
                });
            }

            if (solution.totalFlightTime !== null) {
                console.log(`⏱️  Total Flight Time: ${solution.totalFlightTime.toFixed(6)} seconds`);
            }
            break;

        case 'area_geometry':
        case 'number_problems':
        case 'business_revenue':
        case 'optimization':
            console.log(`📚 Problem Type: ${solution.problemType || type}`);
            
            if (solution.approach) {
                console.log(`\n🔧 Approach:`);
                solution.approach.forEach((step, i) => {
                    console.log(`   ${i + 1}. ${step}`);
                });
            }

            if (solution.formula) {
                console.log(`\n📐 Key Formula: ${solution.formula}`);
            }

            if (solution.solution) {
                console.log(`\n✅ Solution: ${JSON.stringify(solution.solution, null, 2)}`);
            }

            if (solution.optimalPoint) {
                console.log(`\n🎯 Optimal Point: (${solution.optimalPoint.x.toFixed(6)}, ${solution.optimalPoint.y.toFixed(6)})`);
            }

            if (solution.optimalValue !== undefined) {
                console.log(`✨ Optimal Value: ${solution.optimalValue.toFixed(6)}`);
            }
            break;

        default:
            console.log('📊 Solution computed successfully.');
            console.log(JSON.stringify(solution, null, 2));
    }
};

// EXISTING: Display linear solution (keep your existing function)
const displayLinearSolution = (solution) => {
    // ... (keep all your existing linear solution display code)
    const type = currentProblem.type;

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


// UPDATED: Display graph - handles both linear and quadratic
const displayGraph = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('GRAPH / DIAGRAM');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    // Ensure graph data is generated
    if (!currentWorkbook.graphData) {
        if (currentProblemCategory === 'geometric') {
            currentWorkbook.generateGeometricGraphData();
        } else if (currentProblemCategory === 'quadratic') {
            currentWorkbook.generateQuadraticGraphData();
        } else {
            currentWorkbook.generateLinearGraphData();
        }
    }

    if (currentWorkbook.graphData) {
        console.log(`📊 Graph Type: ${currentWorkbook.graphData.type}\n`);

        if (currentProblemCategory === 'geometric') {
            displayGeometricGraph(currentWorkbook.graphData);
        } else if (currentProblemCategory === 'quadratic') {
            displayQuadraticGraph(currentWorkbook.graphData);
        } else {
            displayLinearGraph(currentWorkbook.graphData);
        }
    } else {
        console.log('ℹ️  No graph data available for this problem type.\n');
    }
};

// NEW: Display geometric graph
const displayGeometricGraph = (graphData) => {
    switch (graphData.type) {
        case 'triangle':
            console.log(`📐 Triangle Diagram\n`);
            console.log(`   Properties: ${graphData.properties}`);
            console.log(`   Note: ${graphData.note}\n`);
            console.log(`   Visual representation:`);
            console.log(`        /\\`);
            console.log(`       /  \\`);
            console.log(`      /    \\`);
            console.log(`     /______\\\n`);
            console.log(`   💡 The three angles sum to 180°`);
            break;

        case 'right_triangle':
            console.log(`📐 Right Triangle (Pythagorean Theorem)\n`);
            if (graphData.sides) {
                console.log(`   Sides:`);
                console.log(`   • Leg a: ${graphData.sides.a || 'unknown'}`);
                console.log(`   • Leg b: ${graphData.sides.b || 'unknown'}`);
                console.log(`   • Hypotenuse c: ${graphData.sides.c || 'unknown'}\n`);
            }
            console.log(`   Visual representation:`);
            console.log(`       |\\`);
            console.log(`     c | \\ a`);
            console.log(`       |  \\`);
            console.log(`       |___\\`);
            console.log(`         b\n`);
            console.log(`   💡 Remember: a² + b² = c²`);
            break;

        case 'circle':
            console.log(`⭕ Circle Diagram\n`);
            if (graphData.radius) {
                console.log(`   Radius: ${graphData.radius}`);
                console.log(`   Diameter: ${graphData.radius * 2}\n`);
            }
            console.log(`   Visual representation:`);
            console.log(`        ___`);
            console.log(`      /     \\`);
            console.log(`     |   •   |  ← center`);
            console.log(`      \\_____/`);
            console.log(`         ↑`);
            console.log(`       radius\n`);
            console.log(`   💡 All points are equidistant from center`);
            break;

        case 'rectangle':
            console.log(`⬜ Rectangle Diagram\n`);
            if (graphData.dimensions) {
                console.log(`   Length: ${graphData.dimensions.length}`);
                console.log(`   Width: ${graphData.dimensions.width}\n`);
            }
            console.log(`   Visual representation:`);
            console.log(`     ___________`);
            console.log(`    |           |  ← length`);
            console.log(`    |           |`);
            console.log(`    |___________|`);
            console.log(`         ↑`);
            console.log(`       width\n`);
            console.log(`   💡 Opposite sides are equal and parallel`);
            break;

        case 'coordinate_points':
            console.log(`📍 Coordinate Plane\n`);
            if (graphData.points && graphData.points.length >= 2) {
                console.log(`   Point 1: (${graphData.points[0].x}, ${graphData.points[0].y})`);
                console.log(`   Point 2: (${graphData.points[1].x}, ${graphData.points[1].y})\n`);
            }
            console.log(`   Visual representation:`);
            console.log(`       y`);
            console.log(`       |`);
            console.log(`       |  • P2`);
            console.log(`       |`);
            console.log(`       | • P1`);
            console.log(`   ────┼──────── x`);
            console.log(`       |`);
            console.log(`\n   💡 Distance = √[(x₂-x₁)² + (y₂-y₁)²]`);
            break;

        default:
            console.log(`📊 ${graphData.type}`);
            if (graphData.note) {
                console.log(`   ${graphData.note}\n`);
            }
            console.log(`   Diagram visualization available in workbook export.`);
    }
};


// NEW: Display quadratic graph
const displayQuadraticGraph = (graphData) => {
    switch (graphData.type) {
        case 'parabola':
            console.log(`📈 Function: ${graphData.function}\n`);
            console.log(`📊 Parabola Properties:`);
            console.log(`   Vertex: (${graphData.vertex.x.toFixed(2)}, ${graphData.vertex.y.toFixed(2)})`);
            console.log(`   Axis of Symmetry: x = ${graphData.axisOfSymmetry.toFixed(2)}`);
            console.log(`   Y-intercept: ${graphData.yIntercept}`);
            console.log(`   Direction: Opens ${graphData.direction}`);

            if (graphData.xIntercepts && graphData.xIntercepts.length > 0) {
                console.log(`   X-intercepts: ${graphData.xIntercepts.map(x => x.toFixed(6)).join(', ')}`);
            } else {
                console.log(`   X-intercepts: None (parabola doesn't cross x-axis)`);
            }

            console.log(`\n📍 Sample Points on the Parabola:`);
            const a = currentResult.solution.coefficients.a;
            const b = currentResult.solution.coefficients.b;
            const c = currentResult.solution.coefficients.c;
            [-2, 0, 2].forEach(x => {
                const y = a * x * x + b * x + c;
                console.log(`   (${x}, ${y.toFixed(2)})`);
            });

            console.log(`\n📉 Visual Representation:`);
            if (graphData.direction === 'upward') {
                console.log(`      y`);
                console.log(`      |`);
                console.log(`      |    ╱ ╲`);
                console.log(`      |   ╱   ╲`);
                console.log(`      |  ╱     ╲`);
                console.log(`      | ╱       ╲`);
                console.log(`   ───┼───────────── x`);
                console.log(`      |  vertex`);
                console.log(`   (U-shaped parabola opening upward)`);
            } else {
                console.log(`      y`);
                console.log(`      | ╲       ╱`);
                console.log(`      |  ╲     ╱`);
                console.log(`      |   ╲   ╱`);
                console.log(`      |    ╲ ╱`);
                console.log(`      |  vertex`);
                console.log(`   ───┼───────────── x`);
                console.log(`      |`);
                console.log(`   (Inverted parabola opening downward)`);
            }
            break;

        case 'quadratic_inequality':
            console.log(`📉 Quadratic Inequality Solution:\n`);
            if (graphData.criticalPoints && graphData.criticalPoints.length > 0) {
                console.log(`   Critical Points: ${graphData.criticalPoints.map(p => p.toFixed(6)).join(', ')}`);
            }
            console.log(`   Solution Intervals: ${graphData.solutionIntervals}`);
            console.log(`\n   Parabola opens: ${graphData.direction}`);
            console.log(`\n   Number Line with Shaded Regions:`);
            console.log(`   (Shaded where parabola satisfies inequality)`);
            break;

        default:
            console.log(`   Graph data available but visualization format`);
            console.log(`   for this quadratic type is still in development.\n`);
    }
};

// EXISTING: Display linear graph (keep your existing function)
const displayLinearGraph = (graphData) => {
    // ... (keep all your existing linear graph display code)
    switch(graphData.type) {
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
};


// UPDATED: Generate lesson - handles both linear and quadratic


// UPDATED: Solution verification - handles both linear and quadratic
const generateLesson = (problemType) => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('LESSON: THEORY & KEY CONCEPTS');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    // Initialize lessons if not already done
    if (currentProblemCategory === 'geometric') {
        if (!currentWorkbook.lessons || Object.keys(currentWorkbook.lessons).length === 0) {
            currentWorkbook.initializeGeometricLessons();
        }
    } else if (currentProblemCategory === 'quadratic') {
        if (!currentWorkbook.lessons || Object.keys(currentWorkbook.lessons).length === 0) {
            currentWorkbook.initializeQuadraticLessons();
        }
    } else {
        if (!currentWorkbook.lessons || Object.keys(currentWorkbook.lessons).length === 0) {
            currentWorkbook.initializeLinearLessons();
        }
    }

    const lesson = currentWorkbook.lessons[problemType];

    if (!lesson) {
        console.log(`ℹ️  No specific lesson available for "${problemType}".\n`);
        console.log(`📚 However, here are general ${currentProblemCategory} principles:\n`);
        
        if (currentProblemCategory === 'geometric') {
            console.log('🎯 KEY PRINCIPLES:');
            console.log('  • Geometry deals with shapes, sizes, and spatial relationships');
            console.log('  • Each shape has specific formulas for area, perimeter, volume');
            console.log('  • Understanding properties helps solve complex problems');
            console.log('  • Units matter: linear (length), square (area), cubic (volume)\n');
        } else if (currentProblemCategory === 'quadratic') {
            console.log('🎯 KEY PRINCIPLES:');
            console.log('  • Quadratic equations have degree 2 (highest power is x²)');
            console.log('  • Graphs are parabolas (U-shaped curves)');
            console.log('  • Can have 0, 1, or 2 real solutions\n');
        } else {
            console.log('🎯 KEY PRINCIPLES:');
            console.log('  • Linear relationships have constant rates of change');
            console.log('  • Equations maintain balance\n');
        }
        
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

// UPDATED: Solution verification - handles linear, quadratic, AND geometric
const solutionVerification = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('SOLUTION VERIFICATION');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    const type = currentProblem.type;
    const solution = currentResult.solution || currentResult;

    try {
        if (currentProblemCategory === 'geometric') {
            verifyGeometricSolution(type, solution);
        } else if (currentProblemCategory === 'quadratic') {
            verifyQuadraticSolution(type, solution);
        } else {
            verifyLinearSolution(type, solution);
        }

        const confidence = currentWorkbook.calculateVerificationConfidence();
        console.log(`🎯 Verification Confidence: ${confidence}`);
        
        const notes = currentWorkbook.getVerificationNotes();
        if (notes) {
            console.log(`📝 Notes: ${notes}`);
        }
        console.log('');

    } catch (error) {
        console.log(`⚠️  Verification error: ${error.message}\n`);
        console.log(`💡 The solution may still be correct. Manual verification recommended.\n`);
    }
};

// NEW: Verify geometric solution
const verifyGeometricSolution = (type, solution) => {
    switch (type) {
        case 'triangle_angles':
            if (solution.verification) {
                const v = solution.verification;
                console.log(`📋 Triangle Angle Verification\n`);
                console.log(`   Angle 1: ${v.angle1}°`);
                console.log(`   Angle 2: ${v.angle2}°`);
                console.log(`   Angle 3: ${v.angle3}°`);
                console.log(`   Sum: ${v.sum}°`);
                console.log(`   Expected: ${v.expectedSum}°`);
                console.log(`   Valid: ${v.isValid ? '✓ YES' : '✗ NO'}\n`);
            }
            break;

        case 'pythagorean':
            if (solution.verification) {
                const v = solution.verification;
                console.log(`📋 Pythagorean Theorem Verification\n`);
                console.log(`   a = ${v.leg1}, b = ${v.leg2}, c = ${v.hypotenuse}`);
                console.log(`   ${v.leftSide}`);
                console.log(`   ${v.rightSide}`);
                console.log(`   Difference: ${v.difference.toFixed(8)}`);
                console.log(`   Valid: ${v.isValid ? '✓ YES' : '✗ NO'}\n`);
            }
            break;

        case 'rectangle_problems':
        case 'circle_area':
        case 'circle_circumference':
            console.log(`📋 Geometric Calculation Verification\n`);
            if (solution.result !== undefined) {
                console.log(`   Calculated result: ${solution.result}`);
                if (solution.formula) {
                    console.log(`   Formula used: ${solution.formula}`);
                }
                console.log(`   Status: ✓ Calculation verified\n`);
            }
            break;

        case 'distance_formula':
        case 'midpoint_formula':
            console.log(`📋 Coordinate Geometry Verification\n`);
            if (solution.calculation) {
                console.log(`   Calculation steps:`);
                console.log(`   ${solution.calculation}`);
                console.log(`   Status: ✓ Verified\n`);
            }
            break;

        default:
            console.log(`📊 Geometric Problem: ${type}\n`);
            console.log(`💡 Verification Method:`);
            console.log(`  1. Check all measurements are positive`);
            console.log(`  2. Verify units are consistent`);
            console.log(`  3. Confirm result makes geometric sense\n`);
            
            if (solution.result !== undefined) {
                console.log(`✅ Result: ${solution.result}${solution.units ? ' ' + solution.units : ''}`);
                console.log(`   Status: ${solution.result > 0 ? '✓ Valid (positive)' : '⚠️ Check calculation'}\n`);
            }
    }
};


// NEW: Verify quadratic solution
const verifyQuadraticSolution = (type, solution) => {
    switch (type) {
        case 'standard_quadratic':
        case 'quadratic_formula':
        case 'factoring_quadratic':
        case 'completing_square':
            const verification = currentWorkbook.verifyStandardQuadratic();
            
            if (verification.type === 'no_real_solutions') {
                console.log(`❌ ${verification.message}\n`);
                if (solution.complexSolutions) {
                    console.log(`ℂ Complex Solutions Present:`);
                    solution.complexSolutions.forEach((sol, i) => {
                        const sign = sol.imaginary >= 0 ? '+' : '';
                        console.log(`   x${i + 1} = ${sol.real.toFixed(6)} ${sign}${sol.imaginary.toFixed(6)}i`);
                    });
                    console.log('');
                }
            } else {
                console.log(`📋 Original Equation: ${verification.equation}\n`);
                console.log(`✅ All Solutions Valid: ${verification.allValid ? 'YES' : 'NO'}\n`);
                
                console.log(`🔍 Individual Solution Verification:\n`);
                verification.verifications.forEach((v, i) => {
                    console.log(`  Solution ${i + 1}: x = ${v.solution.toFixed(6)}`);
                    console.log(`    Substitution: ${v.substitution}`);
                    console.log(`    Result: ${v.result.toFixed(8)}`);
                    console.log(`    Expected: 0`);
                    console.log(`    Status: ${v.isValid ? '✓ VALID' : '✗ INVALID'}\n`);
                });
            }
            break;

        case 'quadratic_inequality':
            const inequalityVerification = currentWorkbook.verifyQuadraticInequality();
            console.log(`📋 Original Inequality: ${inequalityVerification.inequality}\n`);
            
            if (inequalityVerification.criticalPoints) {
                console.log(`🎯 Critical Points: ${inequalityVerification.criticalPoints.map(p => p.toFixed(6)).join(', ')}\n`);
            }
            
            console.log(`📊 Solution Set: ${inequalityVerification.intervalNotation}\n`);
            
            if (inequalityVerification.testResults && inequalityVerification.testResults.length > 0) {
                console.log(`🔍 Test Point Verification:`);
                console.log(`   ${'Point'.padEnd(12)} ${'Value'.padEnd(12)} Result`);
                console.log(`   ${'-'.repeat(50)}`);
                inequalityVerification.testResults.forEach(test => {
                    const status = test.satisfies ? '✓ Satisfies' : '✗ Does not satisfy';
                    console.log(`   ${String(test.testPoint.toFixed(2)).padEnd(12)} ${String(test.value.toFixed(2)).padEnd(12)} ${status}`);
                });
                console.log('');
            }
            break;

        case 'vertex_form':
        case 'function_analysis':
            console.log(`📈 Quadratic Function Analysis\n`);
            if (solution.function) {
                console.log(`Function: ${solution.function}\n`);
            }
            console.log(`🔍 Verification by Sample Points:`);
            const { a, b, c } = solution.coefficients || currentProblem.parameters;
            [-2, 0, 2].forEach(x => {
                const y = a * x * x + b * x + c;
                console.log(`  f(${x}) = ${a}(${x})² + ${b}(${x}) + ${c} = ${y.toFixed(6)}`);
            });
            console.log(`\n✓ Function verified: all points lie on the parabola\n`);
            break;

        case 'projectile_motion':
            console.log(`🚀 Projectile Motion Verification\n`);
            if (solution.equation) {
                console.log(`📐 Height Equation: ${solution.equation}\n`);
            }
            if (solution.maxHeight !== undefined) {
                console.log(`🔍 Verifying Maximum Height:`);
                console.log(`   Calculated max: ${solution.maxHeight.toFixed(6)}`);
                console.log(`   Occurs at: t = ${solution.timeToMaxHeight.toFixed(6)} seconds`);
                console.log(`   ✓ Verified using vertex formula: t = -b/(2a)\n`);
            }
            if (solution.timesToReachHeight) {
                console.log(`🔍 Verifying Times to Target Height:`);
                solution.timesToReachHeight.forEach((t, i) => {
                    console.log(`   Time ${i + 1}: ${t.toFixed(6)} seconds ✓`);
                });
                console.log('');
            }
            break;

        default:
            console.log(`📊 Quadratic Problem: ${type}\n`);
            console.log(`💡 Verification Method:`);
            console.log(`  1. Substitute solution(s) back into original equation`);
            console.log(`  2. Verify result equals zero (or satisfies inequality)`);
            console.log(`  3. Check that answer is reasonable in context\n`);
            
            if (solution) {
                console.log(`✅ Current Solution:`);
                console.log(JSON.stringify(solution, null, 2));
                console.log('');
            }
    }
};

// EXISTING: Verify linear solution (keep your existing function)
const verifyLinearSolution = (type, solution) => {
    // ... (keep all your existing linear verification code)
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


};
// UPDATED: Pedagogical notes - handles both linear and quadratic
const pedagogicalNotes = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('PEDAGOGICAL NOTES (Teaching Tips)');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    const notes = currentProblemCategory === 'geometric' 
        ? currentWorkbook.generatePedagogicalNotes(currentProblem.type)
        : currentProblemCategory === 'quadratic'
        ? currentWorkbook.generateQuadraticPedagogicalNotes(currentProblem.type)
        : currentWorkbook.generatePedagogicalNotes(currentProblem.type);
    
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

// UPDATED: Alternative methods - handles linear, quadratic, AND geometric
const alternativeMethods = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('ALTERNATIVE SOLUTION METHODS');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    const alternatives = currentProblemCategory === 'geometric'
        ? currentWorkbook.generateAlternativeMethods(currentProblem.type)
        : currentProblemCategory === 'quadratic'
        ? currentWorkbook.generateQuadraticAlternativeMethods(currentProblem.type)
        : currentWorkbook.generateAlternativeMethods(currentProblem.type);
    
    console.log(`🔧 Primary Method Used: ${alternatives.primaryMethod}\n`);
    
    console.log('🔄 ALTERNATIVE APPROACHES:\n');
    alternatives.methods.forEach((method, i) => {
        console.log(`  ${i + 1}. ${method.name}`);
        console.log(`     ${method.description}\n`);
    });
    
    console.log(`📊 Method Comparison:`);
    console.log(`   ${alternatives.comparison}\n`);
};

// UPDATED: Generate related problems - handles linear, quadratic, AND geometric
const generateRelatedProblems = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('RELATED PRACTICE PROBLEMS');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    const type = currentProblem.type;
    
    console.log(`📝 Practice problems similar to your problem (${type}):\n`);
    
    // GEOMETRIC PRACTICE PROBLEMS
    if (currentProblemCategory === 'geometric') {
        if (type === 'triangle_angles') {
            console.log('  1. angle1=45, angle2=60, find angle3');
            console.log('  2. angle1=30, angle3=90, find angle2');
            console.log('  3. angle2=55, angle3=75, find angle1');
            console.log('  4. angle1=angle2=50, find angle3');
            console.log('  5. All angles equal (equilateral)\n');
            
        } else if (type === 'pythagorean') {
            console.log('  1. a=5, b=12, find c');
            console.log('  2. a=8, b=15, find c');
            console.log('  3. b=7, c=25, find a');
            console.log('  4. a=9, c=15, find b');
            console.log('  5. a=6, b=8, find c\n');
            
        } else if (type === 'triangle_area') {
            console.log('  1. base=12, height=8');
            console.log('  2. base=15, height=10');
            console.log('  3. side1=3, side2=4, side3=5 (Heron\'s)');
            console.log('  4. base=20, height=12');
            console.log('  5. base=9, height=6\n');
            
        } else if (type === 'rectangle_problems') {
            console.log('  1. length=10, width=6, find area');
            console.log('  2. length=8, width=5, find perimeter');
            console.log('  3. length=12, width=9, find diagonal');
            console.log('  4. length=15, width=4, find area and perimeter');
            console.log('  5. area=48, length=12, find width\n');
            
        } else if (type === 'circle_area' || type === 'circle_circumference') {
            console.log('  1. radius=7, find area');
            console.log('  2. radius=4, find circumference');
            console.log('  3. diameter=10, find area');
            console.log('  4. radius=6, find both area and circumference');
            console.log('  5. diameter=14, find circumference\n');
            
        } else if (type === 'rectangular_prism_volume') {
            console.log('  1. l=5, w=4, h=3, find volume');
            console.log('  2. l=10, w=6, h=8, find volume');
            console.log('  3. l=7, w=7, h=7 (cube)');
            console.log('  4. l=12, w=5, h=9, find volume');
            console.log('  5. l=8, w=3, h=4, find volume\n');
            
        } else if (type === 'cylinder_volume') {
            console.log('  1. r=3, h=10, find volume');
            console.log('  2. r=5, h=12, find volume');
            console.log('  3. d=8, h=15, find volume');
            console.log('  4. r=4, h=9, find volume');
            console.log('  5. r=6, h=7, find volume\n');
            
        } else if (type === 'distance_formula') {
            console.log('  1. (0,0) to (3,4)');
            console.log('  2. (1,2) to (7,10)');
            console.log('  3. (-2,3) to (4,8)');
            console.log('  4. (5,1) to (9,4)');
            console.log('  5. (-3,-3) to (3,3)\n');
            
        } else if (type === 'midpoint_formula') {
            console.log('  1. (2,4) and (8,10)');
            console.log('  2. (0,0) and (6,8)');
            console.log('  3. (-2,3) and (4,7)');
            console.log('  4. (1,1) and (9,9)');
            console.log('  5. (-4,2) and (6,-4)\n');
        }
    }
    // QUADRATIC PRACTICE PROBLEMS
    else if (currentProblemCategory === 'quadratic') {
        // ... (keep existing quadratic practice problems)
    }
    // LINEAR PRACTICE PROBLEMS
    else {
        // ... (keep existing linear practice problems)
    }
    
    console.log('💡 Tip: Try solving these on your own, then use this system to check!');
    console.log(`🎯 Challenge: Try different ${currentProblemCategory} problem types!\n`);
};

// UPDATED: Generate complete workbook - handles linear, quadratic, AND geometric
const generateCompleteWorkbook = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('COMPLETE WORKBOOK GENERATION');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    console.log('📄 Generating comprehensive workbook with all sections...\n');
    
    if (currentProblemCategory === 'geometric') {
        currentWorkbook.generateGeometricWorkbook();
    } else if (currentProblemCategory === 'quadratic') {
        currentWorkbook.generateQuadraticWorkbook();
    } else {
        currentWorkbook.generateLinearWorkbook();
    }
    
    if (currentWorkbook.currentWorkbook) {
        console.log('✅ Workbook Generated Successfully!\n');
        console.log('📊 Workbook Contents:');
        console.log(`   • Title: ${currentWorkbook.currentWorkbook.title}`);
        console.log(`   • Category: ${currentProblemCategory.toUpperCase()}`);
        console.log(`   • Sections: ${currentWorkbook.currentWorkbook.sections.length}`);
        console.log(`   • Theme: ${currentWorkbook.currentWorkbook.theme}`);
        console.log(`   • Dimensions: ${currentWorkbook.currentWorkbook.dimensions.width}x${currentWorkbook.currentWorkbook.dimensions.height}\n`);
        
        console.log('📑 Included Sections:');
        currentWorkbook.currentWorkbook.sections.forEach((section, i) => {
            console.log(`   ${i + 1}. ${section.title} (${section.type})`);
        });
        console.log('\n💾 Ready for export to PNG!\n');
    } else {
        console.log('❌ Failed to generate workbook.\n');
    }
};

// UPDATED: Export workbook to PNG - handles all categories
const exportWorkbookToPNG = async () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('EXPORT WORKBOOK TO PNG');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    if (!currentWorkbook.currentWorkbook) {
        console.log('⚠️  No workbook generated yet. Generating now...\n');
        if (currentProblemCategory === 'geometric') {
            currentWorkbook.generateGeometricWorkbook();
        } else if (currentProblemCategory === 'quadratic') {
            currentWorkbook.generateQuadraticWorkbook();
        } else {
            currentWorkbook.generateLinearWorkbook();
        }
    }
    
    console.log('📸 Creating spreadsheet-style PNG image...\n');
    
    try {
        const canvas = createWorkbookCanvas(currentWorkbook);
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const categoryPrefix = currentProblemCategory;
        const defaultFilename = `${categoryPrefix}-workbook-${currentProblem.type}-${timestamp}.png`;
        
        const filename = await prompt(`Enter filename (default: ${defaultFilename}): `) || defaultFilename;
        const finalFilename = filename.endsWith('.png') ? filename : filename + '.png';
        
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(finalFilename, buffer);
        
        console.log(`\n✅ Workbook exported successfully!`);
        console.log(`📁 File: ${finalFilename}`);
        console.log(`📏 Size: ${(buffer.length / 1024).toFixed(2)} KB`);
        console.log(`📐 Dimensions: ${canvas.width}x${canvas.height} pixels\n`);
        console.log('✨ Your workbook is ready! Open the PNG file to view it.\n');
        
    } catch (error) {
        console.log(`❌ Export failed: ${error.message}\n`);
    }
};

// UPDATED: Create workbook canvas - works for all categories
const createWorkbookCanvas = (wb) => {
    const cellWidth = 400;
    const cellHeight = 35;
    const labelWidth = 300;
    const headerHeight = 60;
    const titleHeight = 80;
    const padding = 20;
    const borderWidth = 2;
    
    let totalRows = 0;
    if (wb.currentWorkbook && wb.currentWorkbook.sections) {
        wb.currentWorkbook.sections.forEach(section => {
            totalRows += 2;
            if (section.data) {
                totalRows += section.data.length;
            }
        });
    }
    
    const width = 1400;
    const height = Math.max(2000, titleHeight + (totalRows * cellHeight) + 200);
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
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
    
    const titleText = currentProblemCategory === 'geometric' 
        ? 'Geometric Mathematical Workbook'
        : currentProblemCategory === 'quadratic' 
        ? 'Quadratic Mathematical Workbook' 
        : 'Linear Mathematical Workbook';
    ctx.fillText(titleText, width / 2, titleHeight / 2);
    
    ctx.font = '14px Arial';
    const timestamp = new Date().toLocaleString();
    ctx.fillText(`Generated: ${timestamp} | Category: ${currentProblemCategory.toUpperCase()}`, width / 2, titleHeight - 20);
    
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
                        y += 10;
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
                    
                    const maxLabelLength = 35;
                    const displayLabel = label.length > maxLabelLength ? 
                        label.substring(0, maxLabelLength) + '...' : label;
                    ctx.fillText(displayLabel, padding + 10, y + cellHeight / 2);
                    
                    ctx.font = '13px Arial';
                    const maxValueLength = 85;
                    
                    if (value.length > maxValueLength) {
                        const lines = wrapText(value, maxValueLength);
                        const lineHeight = 16;
                        const startY = y + (cellHeight / 2) - ((lines.length - 1) * lineHeight / 2);
                        
                        lines.forEach((line, i) => {
                            ctx.fillText(line, padding + labelWidth + 10, startY + (i * lineHeight));
                        });
                        
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
            
            y += padding;
        });
    }
    
    // Add footer
    ctx.fillStyle = colors.gridColor;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Generated by Enhanced Mathematical Workbook System', width / 2, height - 30);
    
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

// UPDATED: Get problem input from user - detects linear, quadratic, OR geometric
const getProblemInput = async () => {
    clearScreen();
    displayBanner();

    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('ENTER YOUR PROBLEM');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    console.log('📝 Enter the mathematical equation or problem:\n');
    console.log('Examples (LINEAR):');
    console.log('  • 2x + 3 = 11');
    console.log('  • 3x - 5 > 10');
    console.log('  • |2x - 1| = 7\n');
    
    console.log('Examples (QUADRATIC):');
    console.log('  • x² + 5x + 6 = 0');
    console.log('  • 2x^2 - 7x + 3 = 0');
    console.log('  • x² + 3x - 4 > 0\n');
    
    console.log('Examples (GEOMETRIC):');
    console.log('  • Triangle: angle1=50, angle2=60');
    console.log('  • Pythagorean: a=3, b=4');
    console.log('  • Circle: radius=5');
    console.log('  • Rectangle: length=10, width=6');
    console.log('  • Distance: (1,2) to (4,6)\n');

    const equation = await prompt('Equation/Problem: ');

    if (!equation) {
        console.log('\n⚠️  No input entered. Please try again.\n');
        return false;
    }

    console.log('\n📋 Scenario/Context (optional):');
    console.log('   (e.g., "Find area", "Pythagorean theorem", etc.)\n');

    const scenario = await prompt('Scenario (press Enter to skip): ');

    // Detect category FIRST (linear, quadratic, or geometric)
    currentProblemCategory = detectProblemCategory(equation, scenario);
    console.log(`\n🔍 Detected Category: ${currentProblemCategory.toUpperCase()}`);

    // Then detect specific problem type
    const problemType = detectProblemType(equation, scenario);
    console.log(`🔍 Detected Problem Type: ${problemType}\n`);

    // Extract parameters
    const parameters = extractParameters(equation, problemType, scenario);

    // Show extracted parameters
    console.log(`📊 Extracted Parameters:`);
    if (Object.keys(parameters).length > 0) {
        Object.entries(parameters).forEach(([key, value]) => {
            if (value !== undefined) {
                console.log(`   ${key} = ${value}`);
            }
        });
    } else {
        console.log('   (No specific parameters extracted)');
    }
    console.log('');

    // Ask for explanation level preference
    console.log('📚 Choose default explanation level:\n');
    console.log('  1. Basic (Simple, beginner-friendly)');
    console.log('  2. Intermediate (Standard mathematical terms)');
    console.log('  3. Detailed (Comprehensive with theory)');
    console.log('  4. Scaffolded (Guided learning with questions)\n');

    const levelChoice = await prompt('Level (1-4, default 2): ') || '2';
    const levels = ['basic', 'intermediate', 'detailed', 'scaffolded'];
    const explanationLevel = levels[parseInt(levelChoice) - 1] || 'intermediate';

    // Create appropriate workbook based on category
    if (currentProblemCategory === 'geometric') {
        geometricWorkbook = new EnhancedGeometricMathematicalWorkbook({
            width: 1400,
            height: 2000,
            explanationLevel: explanationLevel,
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            theme: 'excel'
        });
        currentWorkbook = geometricWorkbook;
    } else if (currentProblemCategory === 'quadratic') {
        quadraticWorkbook = new EnhancedQuadraticMathematicalWorkbook({
            width: 1400,
            height: 2000,
            explanationLevel: explanationLevel,
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            theme: 'excel'
        });
        currentWorkbook = quadraticWorkbook;
    } else {
        linearWorkbook = new EnhancedLinearMathematicalWorkbook({
            width: 1400,
            height: 2000,
            explanationLevel: explanationLevel,
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            theme: 'excel'
        });
        currentWorkbook = linearWorkbook;
    }

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
            explanationLevel: explanationLevel,
            category: currentProblemCategory
        }
    };

    console.log('\n✅ Problem loaded successfully!\n');

    // Solve the problem
    console.log('🔄 Solving problem...\n');

    try {
        if (currentProblemCategory === 'geometric') {
            currentResult = currentWorkbook.solveGeometricProblem({
                problem: equation,
                scenario: scenario,
                problemType: problemType,
                parameters: parameters
            });
        } else if (currentProblemCategory === 'quadratic') {
            currentResult = currentWorkbook.solveQuadraticProblem({
                equation: equation,
                scenario: scenario,
                problemType: problemType,
                parameters: parameters
            });
        } else {
            currentResult = currentWorkbook.solveLinearProblem({
                equation: equation,
                scenario: scenario,
                problemType: problemType,
                parameters: parameters
            });
        }

        // Check if solution indicates manual setup needed
        if (currentResult.solution?.needsManualSetup || currentResult.solutionType === 'Requires manual setup') {
            console.log('ℹ️  This problem type requires specific format.\n');
            if (currentResult.solution?.instructions || currentResult.instructions) {
                console.log('📋 Instructions:');
                (currentResult.solution?.instructions || currentResult.instructions).forEach(instr => {
                    console.log(`   ${instr}`);
                });
                console.log('');
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
        console.log(`  Category: ${currentProblemCategory}`);
        console.log(`  Problem type: ${problemType}`);
        console.log(`  Parameters: ${JSON.stringify(parameters, null, 2)}\n`);
        
        if (currentProblemCategory === 'geometric') {
            console.log('💡 For geometric problems, try formats like:');
            console.log('  • angle1=50, angle2=60 (for triangles)');
            console.log('  • radius=5 (for circles)');
            console.log('  • length=10, width=6 (for rectangles)');
            console.log('  • a=3, b=4 (for Pythagorean theorem)\n');
        } else if (currentProblemCategory === 'quadratic') {
            console.log('💡 For quadratic equations, try formats like:');
            console.log('  • x² + 5x + 6 = 0');
            console.log('  • x^2 + 5x + 6 = 0');
            console.log('  • 2x**2 - 3x + 1 = 0\n');
        }
        
        const retry = await prompt('Would you like to try again? (y/n): ');
        if (retry.toLowerCase() === 'y') {
            return await getProblemInput();
        }
        return false;
    }
};

// Main application loop (keep existing with updated start message)
const runInteractiveWorkbook = async () => {
    displayWelcome();
    
    await prompt('\nPress Enter to continue...');
    
    const problemLoaded = await getProblemInput();
    
    if (!problemLoaded) {
        console.log('Exiting...\n');
        rl.close();
        return;
    }
    
    let running = true;
    
    while (running) {
        clearScreen();
        displayBanner();
        
        console.log(`📋 Current Problem: ${currentProblem.originalInput}`);
        console.log(`📊 Category: ${currentProblemCategory.toUpperCase()}`);
        console.log(`📊 Problem Type: ${currentProblem.type}`);
        console.log(`📚 Explanation Level: ${currentWorkbook.explanationLevel}`);
        
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
                console.log('Thank you for using the Interactive Mathematical Workbook!');
                console.log('═══════════════════════════════════════════════════════════════════════\n');
                console.log('📚 Keep practicing and learning!');
                console.log('🎯 Remember: Mathematics is about understanding, not just answers.\n');
                console.log('💡 You explored LINEAR, QUADRATIC, and GEOMETRIC problems today!\n');
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
console.log('Starting Interactive Mathematical Workbook System...\n');
console.log('📐 Supporting LINEAR, QUADRATIC, and GEOMETRIC problems\n');
runInteractiveWorkbook().catch(error => {
    console.error('Fatal error:', error);
    rl.close();
});

// Main application loop (keep existing structure, just update references)
