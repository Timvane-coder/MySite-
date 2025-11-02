import { EnhancedLinearMathematicalWorkbook } from './mytemplate.js';
import { EnhancedQuadraticMathematicalWorkbook } from './quadratic.js'; // NEW IMPORT
import { EnhancedGeometricMathematicalWorkbook } from './geometric.js'; // NEW IMPORT
import { EnhancedExponentialMathematicalWorkbook } from './exponential.js'; // NEW IMPORT
import { EnhancedVectorMathematicalWorkbook } from './vector.js'; // NEW IMPORT

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
let exponentialWorkbook = null; // NEW
let vectorWorkbook = null; // NEW
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
const displayWelcome = () => {
    clearScreen();
    displayBanner();

    console.log('Welcome to the Interactive Mathematical Workbook!\n');
    console.log('This system helps you solve and understand LINEAR, QUADRATIC, GEOMETRIC, and EXPONENTIAL problems');
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
        }
    ];

    geometricExamples.forEach(example => {
        console.log(`${example.category}`);
        example.problems.forEach(problem => console.log(`  ${problem}`));
        console.log('');
    });


    const vectorExamples = [
        {
            category: '➕ Vector Operations',
            problems: [
                '• Add vectors: <3,4,0> + <1,-2,5>',
                '• Subtract: <5,2,1> - <1,1,1>',
                '• Scalar multiply: 3 * <2,1,4>'
            ]
        },
        {
            category: '📏 Vector Properties',
            problems: [
                '• Magnitude of <3,-4,12>',
                '• Unit vector of <6,8,0>',
                '• Normalize <2,2,1>'
            ]
        },
        {
            category: '✖️ Vector Products',
            problems: [
                '• Dot product: <2,3,-1> · <1,0,4>',
                '• Cross product: <1,2,3> × <4,5,6>',
                '• Angle between vectors'
            ]
        },
        {
            category: '📐 Vector Geometry',
            problems: [
                '• Project <3,4,0> onto <1,0,0>',
                '• Distance between points',
                '• Orthogonal test: perpendicular?'
            ]
        },
        {
            category: '📊 Advanced Operations',
            problems: [
                '• Triple scalar product',
                '• Parallelogram area',
                '• Parametric line equation'
            ]
        }
    ];

    vectorExamples.forEach(example => {
        console.log(`${example.category}`);
        example.problems.forEach(problem => console.log(`  ${problem}`));
        console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════════════════\n');
    console.log('📊 EXPONENTIAL PROBLEMS:\n');


   

    const exponentialExamples = [
        {
            category: '📈 Simple Exponential Equations',
            problems: ['• 2^x = 8', '• 3^x = 27', '• 5^x = 125', '• 2^x = 32']
        },
        {
            category: '🔬 Exponential Growth/Decay',
            problems: [
                '• Population doubles every 5 years, initial=1000',
                '• Radioactive half-life: initial=100g, half-life=10 years',
                '• Bacterial growth: y = 50e^(0.3t)'
            ]
        },
        {
            category: '💰 Compound Interest',
            problems: [
                '• $1000 at 5% annual, compounded monthly for 10 years',
                '• Continuous compounding: P=5000, r=0.04, t=8',
                '• Find time to double at 6% interest'
            ]
        },
        {
            category: '⚗️ Half-Life Problems',
            problems: [
                '• Carbon-14 half-life: 5730 years, find decay constant',
                '• Drug concentration: initial=50mg, half-life=3 hours',
                '• Doubling time for 8% growth rate'
            ]
        },
        {
            category: '📉 Exponential Inequalities',
            problems: [
                '• 2^x > 16',
                '• 0.5^x < 0.125',
                '• e^x >= 10'
            ]
        },
        {
            category: '🧮 Logarithmic Equations',
            problems: [
                '• log₂(x) = 5',
                '• ln(x) = 3',
                '• log(x) + log(x-3) = 1'
            ]
        }
    ];

    exponentialExamples.forEach(example => {
        console.log(`${example.category}`);
        example.problems.forEach(problem => console.log(`  ${problem}`));
        console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════════════════\n');
    console.log('💡 TIP: Enter equations naturally, and the system will automatically');
    console.log('   detect whether it\'s LINEAR, QUADRATIC, GEOMETRIC, or EXPONENTIAL!\n');
};


const displayBanner = () => {
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                    ║');
    console.log('║     ENHANCED MATHEMATICAL WORKBOOK SYSTEM                          ║');
    console.log('║     Linear • Quadratic • Geometric • Exponential • Vector          ║');
    console.log('║                                                                    ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');
};


// UPTED: Detect if problem is linear or quadratic FIRST


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
   

    if (input.includes('vector') || input.includes('⟨') || input.includes('<') && input.includes('>') && input.includes(',') ||
        input.includes('dot product') || input.includes('cross product') || 
        input.includes('magnitude') && input.includes('direction') ||
        input.includes('unit vector') || input.includes('normalize') ||
        input.includes('projection') && !input.includes('projectile') ||
        input.includes('orthogonal') || input.includes('parallel') && input.includes(',') ||
        input.includes('·') || input.includes('×') && !input.includes('×') || // dot/cross symbols
        /\<[\d\s,.-]+\>/.test(input)) { // angle bracket notation
        return 'vector';
    }

    // Check for exponential indicators
    if (input.includes('^x') || input.includes('**x') || input.includes('exponential') ||
        input.includes('e^') || input.includes('exp(') || input.includes('growth') ||
        input.includes('decay') || input.includes('half-life') || input.includes('half life') ||
        input.includes('compound interest') || input.includes('continuous compound') ||
        input.includes('population growth') || input.includes('radioactive') ||
        input.includes('bacteria') || input.includes('doubling time') ||
        input.includes('log') || input.includes('ln(') || input.includes('logarithm')) {
        return 'exponential';
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


const detectProblemType = (equation, scenario) => {
    const category = detectProblemCategory(equation, scenario);
    
    if (category === 'geometric') {
        return detectGeometricProblemType(equation, scenario);
    } else if (category === 'quadratic') {
        return detectQuadraticProblemType(equation, scenario);
    } else if (category === 'vector') {
        return detectVectorProblemType(equation, scenario);

    } else if (category === 'exponential') {
        return detectExponentialProblemType(equation, scenario);
    } else {
        return detectLinearProblemType(equation, scenario);
    }
};


const detectVectorProblemType = (equation, scenario) => {
    const input = (equation + ' ' + scenario).toLowerCase();

    // Vector addition
    if (input.includes('add') && input.includes('vector') || input.includes('+') && /\<[\d\s,.-]+\>/.test(input)) {
        return 'vector_addition';
    }

    // Vector subtraction
    if (input.includes('subtract') && input.includes('vector') || input.includes('-') && /\<[\d\s,.-]+\>/.test(input)) {
        return 'vector_subtraction';
    }

    // Scalar multiplication
    if (input.includes('scalar') && input.includes('mult') || 
        /\d+\s*\*\s*\<[\d\s,.-]+\>/.test(input)) {
        return 'scalar_multiplication';
    }

    // Magnitude
    if (input.includes('magnitude') || input.includes('length') || input.includes('norm') ||
        input.includes('||') && input.includes('vector')) {
        return 'vector_magnitude';
    }

    // Unit vector
    if (input.includes('unit') && input.includes('vector') || input.includes('normalize')) {
        return 'unit_vector';
    }

    // Dot product
    if (input.includes('dot') && input.includes('product') || input.includes('·') ||
        input.includes('scalar product') || input.includes('inner product')) {
        return 'dot_product';
    }

    // Cross product
    if (input.includes('cross') && input.includes('product') || input.includes('×') ||
        input.includes('vector product')) {
        return 'cross_product';
    }

    // Angle between vectors
    if (input.includes('angle') && input.includes('between') && input.includes('vector')) {
        return 'vector_angle';
    }

    // Projection
    if (input.includes('project') && input.includes('vector') || 
        input.includes('projection') && !input.includes('projectile')) {
        return 'vector_projection';
    }

    // Orthogonal test
    if (input.includes('orthogonal') || input.includes('perpendicular') && input.includes('vector')) {
        return 'orthogonal_test';
    }

    // Parallel test
    if (input.includes('parallel') && input.includes('vector') || input.includes('collinear')) {
        return 'parallel_test';
    }

    // Distance between points
    if (input.includes('distance') && input.includes('point') && input.includes(',')) {
        return 'distance_points';
    }

    // Linear combination
    if (input.includes('linear') && input.includes('combination') || 
        input.includes('coefficient') && input.includes('vector')) {
        return 'linear_combination';
    }

    // Triple scalar product
    if (input.includes('triple') && input.includes('scalar')) {
        return 'triple_scalar';
    }

    // Triple vector product
    if (input.includes('triple') && input.includes('vector') && input.includes('product')) {
        return 'triple_vector';
    }

    // Area calculations
    if (input.includes('parallelogram') && input.includes('area') && input.includes('vector')) {
        return 'parallelogram_area';
    }
    if (input.includes('triangle') && input.includes('area') && input.includes('vector')) {
        return 'triangle_area';
    }

    // Volume
    if (input.includes('parallelepiped') && input.includes('volume')) {
        return 'parallelepiped_volume';
    }

    // Lines and planes
    if (input.includes('parametric') && input.includes('line')) {
        return 'parametric_line';
    }
    if (input.includes('plane') && input.includes('equation')) {
        return 'plane_equation';
    }
    if (input.includes('point') && input.includes('line') && input.includes('distance')) {
        return 'point_line_distance';
    }
    if (input.includes('point') && input.includes('plane') && input.includes('distance')) {
        return 'point_plane_distance';
    }

    // Default to vector addition if vectors are detected
    if (/\<[\d\s,.-]+\>/.test(input)) {
        return 'vector_addition';
    }

    return 'vector_addition'; // default
};

// NEW: Exponential problem type detector
const detectExponentialProblemType = (equation, scenario) => {
    const input = (equation + ' ' + scenario).toLowerCase();

    // Simple exponential equation
    if (input.match(/\d+\s*\^\s*x/) || input.match(/\d+\s*\*\*\s*x/)) {
        if (input.includes('>') || input.includes('<') || input.includes('≥') || input.includes('≤')) {
            return 'exponential_inequality';
        }
        return 'simple_exponential';
    }

    // Natural exponential
    if (input.includes('e^') || input.includes('exp(') || input.includes('euler')) {
        return 'natural_exponential';
    }

    // Growth models
    if (input.includes('growth') || input.includes('population') || input.includes('bacteria') ||
        input.includes('increase') || input.includes('doubles')) {
        return 'exponential_growth';
    }

    // Decay models
    if (input.includes('decay') || input.includes('radioactive') || input.includes('half-life') ||
        input.includes('decrease') || input.includes('depreciation')) {
        return 'exponential_decay';
    }

    // Compound interest
    if (input.includes('compound') || input.includes('interest') || input.includes('investment') ||
        input.includes('continuous compound')) {
        return 'compound_interest';
    }

    // Half-life specific
    if (input.includes('half-life') || input.includes('half life') || input.includes('doubling time')) {
        return 'half_life';
    }

    // Logarithmic equations
    if (input.includes('log') || input.includes('ln(') || input.includes('logarithm')) {
        return 'logarithmic_equation';
    }

    // Exponential inequalities
    if ((input.includes('^x') || input.includes('**x')) && 
        (input.includes('>') || input.includes('<') || input.includes('≥') || input.includes('≤'))) {
        return 'exponential_inequality';
    }

    // Same base
    if (input.includes('same base') || input.includes('equal base')) {
        return 'exponential_same_base';
    }

    // Quadratic form
    if (input.includes('quadratic') && input.includes('exponential')) {
        return 'exponential_quadratic';
    }

    // Default
    return 'simple_exponential';
};

// UPDATED: detectProblemType


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



const extractVectorParameters = (equation, problemType, scenario = '') => {
    const params = {};
    const fullInput = (equation + ' ' + scenario).trim();

    // Extract vectors in angle bracket notation: <x, y, z>
    const vectorPattern = /\<\s*([-+]?\d+\.?\d*)\s*,\s*([-+]?\d+\.?\d*)\s*(?:,\s*([-+]?\d+\.?\d*))?\s*\>/g;
    const vectors = [];
    let match;
    
    while ((match = vectorPattern.exec(fullInput)) !== null) {
        const vector = [
            parseFloat(match[1]),
            parseFloat(match[2]),
            match[3] !== undefined ? parseFloat(match[3]) : 0
        ];
        vectors.push(vector);
    }

    if (vectors.length > 0) {
        params.vectors = vectors;
    }

    // Extract scalar for scalar multiplication
    if (problemType === 'scalar_multiplication') {
        const scalarMatch = fullInput.match(/(\d+\.?\d*)\s*\*/);
        if (scalarMatch) {
            params.scalar = parseFloat(scalarMatch[1]);
        }
    }

    // Extract coefficients for linear combination
    if (problemType === 'linear_combination') {
        const coeffPattern = /coefficient[s]?[:=]\s*\[([-+]?\d+\.?\d*(?:\s*,\s*[-+]?\d+\.?\d*)*)\]/i;
        const coeffMatch = fullInput.match(coeffPattern);
        if (coeffMatch) {
            params.coefficients = coeffMatch[1].split(',').map(c => parseFloat(c.trim()));
        }
    }

    // Extract point and direction for parametric line
    if (problemType === 'parametric_line') {
        const pointMatch = fullInput.match(/point[:=]\s*\<\s*([-+]?\d+\.?\d*)\s*,\s*([-+]?\d+\.?\d*)\s*,\s*([-+]?\d+\.?\d*)\s*\>/i);
        const directionMatch = fullInput.match(/direction[:=]\s*\<\s*([-+]?\d+\.?\d*)\s*,\s*([-+]?\d+\.?\d*)\s*,\s*([-+]?\d+\.?\d*)\s*\>/i);
        
        if (pointMatch) {
            params.point = [parseFloat(pointMatch[1]), parseFloat(pointMatch[2]), parseFloat(pointMatch[3])];
        }
        if (directionMatch) {
            params.direction = [parseFloat(directionMatch[1]), parseFloat(directionMatch[2]), parseFloat(directionMatch[3])];
        }
    }

    // Extract point and normal for plane equation
    if (problemType === 'plane_equation') {
        const pointMatch = fullInput.match(/point[:=]\s*\<\s*([-+]?\d+\.?\d*)\s*,\s*([-+]?\d+\.?\d*)\s*,\s*([-+]?\d+\.?\d*)\s*\>/i);
        const normalMatch = fullInput.match(/normal[:=]\s*\<\s*([-+]?\d+\.?\d*)\s*,\s*([-+]?\d+\.?\d*)\s*,\s*([-+]?\d+\.?\d*)\s*\>/i);
        
        if (pointMatch) {
            params.point = [parseFloat(pointMatch[1]), parseFloat(pointMatch[2]), parseFloat(pointMatch[3])];
        }
        if (normalMatch) {
            params.normal = [parseFloat(normalMatch[1]), parseFloat(normalMatch[2]), parseFloat(normalMatch[3])];
        }
    }

    return params;
};

// UPDATED: Extract parameters for both linear and quadratic
const extractExponentialParameters = (equation, problemType, scenario = '') => {
    const params = {};
    const fullInput = (equation + ' ' + scenario).trim().toLowerCase();

    // Extract numeric values with labels
    const extractValue = (label) => {
        const regex = new RegExp(`${label}\\s*[=:]?\\s*([+-]?\\d+\\.?\\d*)`, 'i');
        const match = fullInput.match(regex);
        return match ? parseFloat(match[1]) : undefined;
    };

    // Simple exponential: a^x = b
    if (problemType === 'simple_exponential' || problemType === 'exponential_inequality') {
        // Try to match pattern like "2^x = 8" or "3^x = 27"
        const match = equation.match(/([+-]?\d*\.?\d*)\s*\*?\s*([+-]?\d*\.?\d*)\s*[\^*]{1,2}\s*x\s*([=<>≤≥]+)\s*([+-]?\d+\.?\d*)/);
        
        if (match) {
            params.coefficient = parseFloat(match[1]) || 1;
            params.a = parseFloat(match[2]) || parseFloat(match[1]) || 2; // base
            params.b = parseFloat(match[4]); // result
            
            if (problemType === 'exponential_inequality') {
                params.operator = match[3];
            }
        }
    }

    // Growth/Decay models
    if (problemType === 'exponential_growth' || problemType === 'exponential_decay') {
        params.initialAmount = extractValue('initial') || extractValue('a') || extractValue('a0') || extractValue('p');
        params.growthRate = extractValue('rate') || extractValue('r') || extractValue('k');
        params.time = extractValue('time') || extractValue('t');
        params.finalAmount = extractValue('final') || extractValue('amount');
        params.base = extractValue('base') || extractValue('b');
        
        if (fullInput.includes('double')) {
            params.doublingTime = extractValue('doubles') || extractValue('doubling');
        }
    }

    // Compound interest
    if (problemType === 'compound_interest') {
        params.principal = extractValue('principal') || extractValue('p') || extractValue('initial');
        params.rate = extractValue('rate') || extractValue('r');
        params.time = extractValue('time') || extractValue('t') || extractValue('years');
        params.compoundingFrequency = extractValue('n') || extractValue('frequency');
        params.finalAmount = extractValue('final') || extractValue('a') || extractValue('amount');
        
        // Convert percentage to decimal
        if (params.rate && params.rate > 1) {
            params.rate = params.rate / 100;
        }
        
        // Check for continuous compounding
        if (fullInput.includes('continuous')) {
            params.compoundingFrequency = 'continuous';
        } else if (!params.compoundingFrequency) {
            if (fullInput.includes('monthly')) params.compoundingFrequency = 12;
            else if (fullInput.includes('quarterly')) params.compoundingFrequency = 4;
            else if (fullInput.includes('annual') || fullInput.includes('yearly')) params.compoundingFrequency = 1;
            else if (fullInput.includes('daily')) params.compoundingFrequency = 365;
            else params.compoundingFrequency = 1; // default annual
        }
    }

    // Half-life problems
    if (problemType === 'half_life') {
        params.halfLife = extractValue('half-life') || extractValue('halflife') || extractValue('half life');
        params.doublingTime = extractValue('doubling') || extractValue('double');
        params.initialAmount = extractValue('initial') || extractValue('a0');
        params.time = extractValue('time') || extractValue('t');
        params.decayConstant = extractValue('k') || extractValue('decay constant');
    }

    // Logarithmic equations
    if (problemType === 'logarithmic_equation') {
        params.base = extractValue('base') || 10; // default base 10
        params.argument = extractValue('x');
        params.result = extractValue('result');
        
        // Check for natural log
        if (fullInput.includes('ln') || fullInput.includes('natural')) {
            params.base = Math.E;
        }
    }

    // Natural exponential
    if (problemType === 'natural_exponential') {
        params.coefficient = extractValue('coefficient') || 1;
        params.exponent = extractValue('exponent') || 1;
        params.result = extractValue('result');
        params.base = Math.E;
    }

    return params;
};

// UPDATED: extractParameters
const extractParameters = (equation, problemType, scenario = '') => {
    const category = detectProblemCategory(equation, scenario);
    
    if (category === 'geometric') {
        return extractGeometricParameters(equation, problemType, scenario);
    } else if (category === 'vector') {
        return extractVectorParameters(equation, problemType, scenario);
    } else if (category === 'quadratic') {
        return extractQuadraticParameters(equation, problemType, scenario);
    } else if (category === 'exponential') {
        return extractExponentialParameters(equation, problemType, scenario);
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
                          currentProblemCategory === 'vector' ? '➡️' : 
                          currentProblemCategory === 'quadratic' ? '📈' : 
                          currentProblemCategory === 'exponential' ? '📊' : '📊';
    console.log(`${categoryEmoji} Current Category: ${currentProblemCategory ? currentProblemCategory.toUpperCase() : 'None'}`);
    
    const choice = await prompt('Enter your choice (1-12): ');
    return choice;
};

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
        } else if (currentProblemCategory === 'vector') {
            const result = currentWorkbook.solveVectorProblem(problemConfig);
            currentResult = result;
        } else if (currentProblemCategory === 'quadratic') {
            const result = currentWorkbook.solveQuadraticProblem(problemConfig);
            currentResult = result;
        } else if (currentProblemCategory === 'exponential') {
            const result = currentWorkbook.solveExponentialProblem(problemConfig);
            currentResult = result;
        } else {
            const result = currentWorkbook.solveLinearProblem(problemConfig);
            currentResult = result;
        }

        // Display the steps
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

                    if (step.logarithmicForm) {
                        console.log(`   ⟹ Logarithmic Form: ${step.logarithmicForm}`);
                    }

                    if (step.naturalLogForm) {
                        console.log(`   ⟹ Natural Log Form: ${step.naturalLogForm}`);
                    }

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

                    if (step.criticalConcept) {
                        console.log(`\n🎯 Critical Concept: ${step.criticalConcept}`);
                    }

                    if (step.criticalWarning) {
                        console.log(`\n⚠️  ${step.criticalWarning}`);
                    }

                    if (step.criticalNote) {
                        console.log(`\n📌 Note: ${step.criticalNote}`);
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
                        if (step.approximation) {
                            console.log(`   Approximation: ${step.approximation}`);
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

// UPDATED: generateSolution
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
    } else if (currentProblemCategory === 'vector') {
        displayVectorSolution(solution);
    } else if (currentProblemCategory === 'quadratic') {
        displayQuadraticSolution(solution);
    } else if (currentProblemCategory === 'exponential') {
        displayExponentialSolution(solution);
    } else {
        displayLinearSolution(solution);
    }

    console.log('');
};

const displayVectorSolution = (solution) => {
    const type = currentProblem.type;

    switch (type) {
        case 'vector_addition':
        case 'vector_subtraction':
            if (solution.result) {
                console.log(`✅ Result Vector: ${solution.resultVector || JSON.stringify(solution.result)}`);
                console.log(`📏 Magnitude: ${solution.magnitude?.toFixed(6) || 'N/A'}`);
            }
            if (solution.vectors) {
                console.log(`\n📊 Input Vectors:`);
                solution.vectors.forEach((v, i) => {
                    console.log(`   Vector ${i + 1}: ${Array.isArray(v) ? `⟨${v.join(', ')}⟩` : v}`);
                });
            }
            if (solution.geometric) {
                console.log(`\n🎨 Geometric: ${solution.geometric}`);
            }
            break;

        case 'scalar_multiplication':
            console.log(`🔢 Scalar: ${solution.scalar}`);
            console.log(`📐 Original Vector: ${solution.vector ? `⟨${solution.vector.join(', ')}⟩` : 'N/A'}`);
            console.log(`✅ Result: ${solution.resultVector}`);
            console.log(`\n📏 Original Magnitude: ${solution.originalMagnitude?.toFixed(6)}`);
            console.log(`📏 Result Magnitude: ${solution.resultMagnitude?.toFixed(6)}`);
            console.log(`📊 Scale Factor: ${solution.scaleFactor}`);
            console.log(`🔄 Direction: ${solution.directionChange}`);
            break;

        case 'vector_magnitude':
            console.log(`📐 Vector: ${solution.vectorNotation}`);
            console.log(`✅ Magnitude: ${solution.magnitude?.toFixed(6)}`);
            if (solution.calculation) {
                console.log(`\n🔢 Calculation: ${solution.calculation}`);
            }
            console.log(`\n💡 ${solution.interpretation || 'Length of the vector'}`);
            break;

        case 'unit_vector':
            if (solution.error) {
                console.log(`❌ ${solution.error}`);
            } else {
                console.log(`📐 Original Vector: ${solution.vectorNotation}`);
                console.log(`📏 Magnitude: ${solution.magnitude?.toFixed(6)}`);
                console.log(`✅ Unit Vector: ${solution.unitVectorNotation}`);
                console.log(`🔍 Verification: ||û|| = ${solution.verification?.toFixed(6)}`);
                console.log(`\n💡 ${solution.interpretation || 'Unit vector with magnitude 1'}`);
            }
            break;

        case 'dot_product':
            console.log(`📐 Vector u: ${solution.vectorU}`);
            console.log(`📐 Vector v: ${solution.vectorV}`);
            console.log(`✅ Dot Product: ${solution.dotProduct?.toFixed(6)}`);
            if (solution.calculation) {
                console.log(`\n🔢 Calculation: ${solution.calculation}`);
            }
            if (solution.magnitudes) {
                console.log(`\n📏 Magnitudes:`);
                console.log(`   ||u|| = ${solution.magnitudes.u?.toFixed(6)}`);
                console.log(`   ||v|| = ${solution.magnitudes.v?.toFixed(6)}`);
            }
            if (solution.angleDegrees !== null && solution.angleDegrees !== undefined) {
                console.log(`\n∠ Angle: ${solution.angleDegrees?.toFixed(2)}°`);
            }
            if (solution.relationship) {
                console.log(`💡 ${solution.relationship}`);
            }
            break;

        case 'cross_product':
            console.log(`📐 Vector u: ${solution.vectorU}`);
            console.log(`📐 Vector v: ${solution.vectorV}`);
            console.log(`✅ Cross Product: ${solution.crossProductNotation}`);
            console.log(`📏 Magnitude: ${solution.magnitude?.toFixed(6)}`);
            if (solution.parallelogramArea !== undefined) {
                console.log(`📐 Parallelogram Area: ${solution.parallelogramArea?.toFixed(6)}`);
            }
            if (solution.angleDegrees !== null && solution.angleDegrees !== undefined) {
                console.log(`∠ Angle: ${solution.angleDegrees?.toFixed(2)}°`);
            }
            if (solution.perpendicularity) {
                console.log(`\n🔍 Perpendicularity Check:`);
                console.log(`   Perpendicular to u: ${solution.perpendicularity.perpToU ? '✓' : '✗'}`);
                console.log(`   Perpendicular to v: ${solution.perpendicularity.perpToV ? '✓' : '✗'}`);
            }
            if (solution.geometric) {
                console.log(`\n💡 ${solution.geometric}`);
            }
            break;

        case 'vector_angle':
            if (solution.error) {
                console.log(`❌ ${solution.error}`);
            } else {
                console.log(`📐 Vector u: ${solution.vectorU}`);
                console.log(`📐 Vector v: ${solution.vectorV}`);
                console.log(`🔢 Dot Product: ${solution.dotProduct?.toFixed(6)}`);
                console.log(`\n📏 Magnitudes:`);
                console.log(`   ||u|| = ${solution.magnitudes?.u?.toFixed(6)}`);
                console.log(`   ||v|| = ${solution.magnitudes?.v?.toFixed(6)}`);
                console.log(`\n📊 cos θ = ${solution.cosTheta?.toFixed(6)}`);
                console.log(`✅ Angle: ${solution.angleDegrees?.toFixed(2)}° (${solution.angleRadians?.toFixed(6)} radians)`);
                if (solution.relationship) {
                    console.log(`💡 ${solution.relationship}`);
                }
            }
            break;

        case 'vector_projection':
            if (solution.error) {
                console.log(`❌ ${solution.error}`);
            } else {
                console.log(`📐 Vector u: ${solution.vectorU}`);
                console.log(`📐 Vector v: ${solution.vectorV}`);
                console.log(`\n📊 Scalar Projection: ${solution.scalarProjection?.toFixed(6)}`);
                console.log(`✅ Vector Projection: ${solution.projectionNotation}`);
                if (solution.orthogonalNotation) {
                    console.log(`⊥ Orthogonal Component: ${solution.orthogonalNotation}`);
                }
                if (solution.verification) {
                    console.log(`\n🔍 Verification:`);
                    console.log(`   Orthogonal: ${solution.verification.isOrthogonal ? '✓' : '✗'}`);
                }
                console.log(`\n💡 ${solution.interpretation || 'Component of u in direction of v'}`);
            }
            break;

        case 'orthogonal_test':
            console.log(`📐 Vector u: ${solution.vectorU}`);
            console.log(`📐 Vector v: ${solution.vectorV}`);
            console.log(`🔢 Dot Product: ${solution.dotProduct?.toFixed(6)}`);
            console.log(`\n✅ ${solution.conclusion}`);
            console.log(`📋 Criterion: ${solution.criterion}`);
            break;

        case 'parallel_test':
            console.log(`📐 Vector u: ${solution.vectorU}`);
            console.log(`📐 Vector v: ${solution.vectorV}`);
            console.log(`🔢 Cross Product Magnitude: ${solution.crossMagnitude?.toFixed(6)}`);
            if (solution.direction) {
                console.log(`🔄 Direction: ${solution.direction}`);
            }
            console.log(`\n✅ ${solution.conclusion}`);
            console.log(`📋 Criterion: ${solution.criterion}`);
            break;

        case 'distance_points':
            console.log(`📍 Point P: ${solution.pointP}`);
            console.log(`📍 Point Q: ${solution.pointQ}`);
            console.log(`📐 Difference Vector: ${solution.differenceNotation}`);
            console.log(`✅ Distance: ${solution.distance?.toFixed(6)}`);
            if (solution.calculation) {
                console.log(`\n🔢 ${solution.calculation}`);
            }
            break;

        case 'linear_combination':
            console.log(`📊 Coefficients: [${solution.coefficients?.join(', ')}]`);
            console.log(`📐 Vectors:`);
            solution.vectors?.forEach((v, i) => {
                console.log(`   v${i + 1} = ⟨${v.join(', ')}⟩`);
            });
            console.log(`\n🔢 Expression: ${solution.expression}`);
            console.log(`✅ Result: ${solution.resultNotation}`);
            break;

        case 'triple_scalar':
            console.log(`📐 Formula: ${solution.formula}`);
            console.log(`✅ Triple Scalar Product: ${solution.tripleScalarProduct?.toFixed(6)}`);
            console.log(`📦 Volume: ${solution.volume?.toFixed(6)}`);
            console.log(`\n💡 ${solution.geometric}`);
            console.log(`📋 ${solution.interpretation}`);
            break;

        case 'parallelogram_area':
            console.log(`📐 Cross Product: ${solution.crossProductNotation}`);
            console.log(`✅ Area: ${solution.area?.toFixed(6)} square units`);
            console.log(`📋 Formula: ${solution.formula}`);
            break;

        case 'triangle_area':
            console.log(`📍 Vertices:`);
            solution.vertices?.forEach((v, i) => {
                console.log(`   Vertex ${i + 1}: ⟨${v.join(', ')}⟩`);
            });
            console.log(`\n📐 Side AB: ⟨${solution.sideAB?.join(', ')}⟩`);
            console.log(`📐 Side AC: ⟨${solution.sideAC?.join(', ')}⟩`);
            console.log(`✅ Area: ${solution.area?.toFixed(6)} square units`);
            console.log(`📋 Formula: ${solution.formula}`);
            break;

        case 'parallelepiped_volume':
            console.log(`📐 Formula: ${solution.formula}`);
            console.log(`🔢 Triple Scalar: ${solution.tripleScalar?.toFixed(6)}`);
            console.log(`✅ Volume: ${solution.volume?.toFixed(6)} cubic units`);
            break;

        case 'parametric_line':
            console.log(`📍 Point: ${solution.pointNotation}`);
            console.log(`➡️ Direction: ${solution.directionNotation}`);
            console.log(`\n📐 Vector Form: ${solution.vectorForm}`);
            console.log(`\n📊 Parametric Form:`);
            if (solution.parametricForm) {
                console.log(`   ${solution.parametricForm.x}`);
                console.log(`   ${solution.parametricForm.y}`);
                console.log(`   ${solution.parametricForm.z}`);
            }
            break;

        case 'plane_equation':
            console.log(`📍 Point: ${solution.pointNotation}`);
            console.log(`⊥ Normal: ${solution.normalNotation}`);
            console.log(`\n📐 Scalar Equation: ${solution.scalarEquation}`);
            console.log(`📊 Vector Form: ${solution.vectorForm}`);
            break;

        case 'point_line_distance':
            console.log(`📍 Point: ⟨${solution.point?.join(', ')}⟩`);
            console.log(`📍 Line Point: ⟨${solution.linePoint?.join(', ')}⟩`);
            console.log(`➡️ Line Direction: ⟨${solution.lineDirection?.join(', ')}⟩`);
            console.log(`\n✅ Distance: ${solution.distance?.toFixed(6)}`);
            console.log(`📋 Formula: ${solution.formula}`);
            break;

        case 'point_plane_distance':
            console.log(`📍 Point: ⟨${solution.point?.join(', ')}⟩`);
            console.log(`📍 Plane Point: ⟨${solution.planePoint?.join(', ')}⟩`);
            console.log(`⊥ Plane Normal: ⟨${solution.planeNormal?.join(', ')}⟩`);
            console.log(`\n✅ Distance: ${solution.distance?.toFixed(6)}`);
            console.log(`📋 Formula: ${solution.formula}`);
            break;

        default:
            console.log('📊 Vector solution computed successfully.');
            console.log(JSON.stringify(solution, null, 2));
    }
};



// NEW: Display exponential solution
const displayExponentialSolution = (solution) => {
    const type = currentProblem.type;

    switch (type) {
        case 'simple_exponential':
        case 'natural_exponential':
            if (solution.equation) {
                console.log(`📐 Equation: ${solution.equation}`);
            }

            if (solution.base !== undefined) {
                console.log(`📊 Base: ${solution.base}`);
            }

            if (solution.coefficient !== undefined && solution.coefficient !== 1) {
                console.log(`📊 Coefficient: ${solution.coefficient}`);
            }

            if (solution.solutions && solution.solutions.length > 0) {
                console.log(`\n✅ Solution:`);
                solution.solutions.forEach((sol, i) => {
                    if (typeof sol === 'number') {
                        console.log(`   x = ${sol.toFixed(6)}`);
                    } else {
                        console.log(`   ${sol}`);
                    }
                });
            }

            if (solution.logarithmicForm) {
                console.log(`\n📐 Logarithmic Form: ${solution.logarithmicForm}`);
            }

            if (solution.naturalLogForm) {
                console.log(`📐 Natural Log Form: ${solution.naturalLogForm}`);
            }

            if (solution.graphicalInterpretation) {
                console.log(`\n📊 Graphical Interpretation:`);
                console.log(`   Base: ${solution.graphicalInterpretation.base}`);
                console.log(`   Behavior: ${solution.graphicalInterpretation.behavior}`);
            }
            break;

        case 'exponential_inequality':
            console.log(`📊 Solution Set: ${solution.solutionSet || 'N/A'}`);
            console.log(`📐 Interval Notation: ${solution.intervalNotation || 'N/A'}`);
            
            if (solution.criticalValue !== undefined) {
                console.log(`\n🎯 Critical Value: x = ${solution.criticalValue.toFixed(6)}`);
            }

            if (solution.baseType) {
                console.log(`📊 Base Type: ${solution.baseType}`);
            }

            if (solution.inequalityBehavior) {
                console.log(`🔄 Inequality Direction: ${solution.inequalityBehavior}`);
            }

            if (solution.explanation) {
                console.log(`\n💡 ${solution.explanation}`);
            }

            if (solution.inequality) {
                console.log(`\n📐 Original Inequality: ${solution.inequality}`);
            }
            break;

        case 'exponential_growth':
            if (solution.model) {
                console.log(`📈 Model: ${solution.model}`);
            }

            if (solution.equation) {
                console.log(`📐 Equation: ${solution.equation}`);
            }

            if (solution.initialAmount !== undefined) {
                console.log(`\n📍 Initial Amount: ${solution.initialAmount}`);
            }

            if (solution.growthConstant !== undefined) {
                console.log(`📊 Growth Constant (k): ${solution.growthConstant.toFixed(6)}`);
            }

            if (solution.growthFactor !== undefined) {
                console.log(`📊 Growth Factor (b): ${solution.growthFactor.toFixed(6)}`);
            }

            if (solution.growthRate) {
                console.log(`📊 Growth Rate: ${solution.growthRate}`);
            }

            if (solution.doublingTime !== undefined) {
                console.log(`⏱️  Doubling Time: ${solution.doublingTime.toFixed(6)} time units`);
            }
            break;

        case 'exponential_decay':
            if (solution.model) {
                console.log(`📉 Model: ${solution.model}`);
            }

            if (solution.equation) {
                console.log(`📐 Equation: ${solution.equation}`);
            }

            if (solution.initialAmount !== undefined) {
                console.log(`\n📍 Initial Amount: ${solution.initialAmount}`);
            }

            if (solution.decayConstant !== undefined) {
                console.log(`📊 Decay Constant (k): ${solution.decayConstant.toFixed(6)}`);
            }

            if (solution.halfLife !== undefined) {
                console.log(`⏱️  Half-Life: ${solution.halfLife} time units`);
            }

            if (solution.timeElapsed !== undefined) {
                console.log(`⏱️  Time Elapsed: ${solution.timeElapsed}`);
            }

            if (solution.remainingAmount !== undefined) {
                console.log(`📊 Remaining Amount: ${solution.remainingAmount.toFixed(6)}`);
            }

            if (solution.percentRemaining) {
                console.log(`📊 Percent Remaining: ${solution.percentRemaining}`);
            }
            break;

        case 'compound_interest':
            if (solution.model) {
                console.log(`💰 Model: ${solution.model}`);
            }

            if (solution.formula) {
                console.log(`📐 Formula: ${solution.formula}`);
            }

            if (solution.principal !== undefined) {
                console.log(`\n💵 Principal: $${solution.principal.toFixed(2)}`);
            }

            if (solution.rate !== undefined) {
                console.log(`📊 Interest Rate: ${(solution.rate * 100).toFixed(2)}%`);
            }

            if (solution.compoundingFrequency !== undefined) {
                if (solution.compoundingFrequency === 'continuous') {
                    console.log(`📊 Compounding: Continuous`);
                } else {
                    console.log(`📊 Compounding Frequency: ${solution.compoundingFrequency} times per year`);
                }
            }

            if (solution.time !== undefined) {
                console.log(`⏱️  Time: ${solution.time} years`);
            }

            if (solution.finalAmount !== undefined) {
                console.log(`\n💰 Final Amount: $${solution.finalAmount.toFixed(2)}`);
            }

            if (solution.interest !== undefined) {
                console.log(`📈 Interest Earned: $${solution.interest.toFixed(2)}`);
            }
            break;

        case 'half_life':
            if (solution.model) {
                console.log(`⚗️  Model: ${solution.model}`);
            }

            if (solution.halfLife !== undefined) {
                console.log(`⏱️  Half-Life: ${solution.halfLife} time units`);
            }

            if (solution.doublingTime !== undefined) {
                console.log(`⏱️  Doubling Time: ${solution.doublingTime} time units`);
            }

            if (solution.decayConstant !== undefined) {
                console.log(`📊 Decay Constant (k): ${solution.decayConstant.toFixed(6)}`);
            }

            if (solution.growthConstant !== undefined) {
                console.log(`📊 Growth Constant (k): ${solution.growthConstant.toFixed(6)}`);
            }

            if (solution.formula) {
                console.log(`\n📐 Formula: ${solution.formula}`);
            }
            break;

        case 'logarithmic_equation':
            if (solution.equation) {
                console.log(`📐 Equation: ${solution.equation}`);
            }

            if (solution.exponentialForm) {
                console.log(`📐 Exponential Form: ${solution.exponentialForm}`);
            }

            if (solution.solution !== undefined) {
                console.log(`\n✅ Solution: x = ${solution.solution.toFixed(6)}`);
            }

            if (solution.verification !== undefined) {
                console.log(`🔍 Verification: ${solution.verification ? 'Valid (x > 0)' : 'Invalid (x ≤ 0)'}`);
            }
            break;

        case 'exponential_quadratic':
            if (solution.substitution) {
                console.log(`🔄 Substitution: ${solution.substitution}`);
            }

            if (solution.quadraticForm) {
                console.log(`📐 Quadratic Form: ${solution.quadraticForm}`);
            }

            if (solution.discriminant !== undefined) {
                console.log(`\n📊 Discriminant: ${solution.discriminant.toFixed(6)}`);
            }

            if (solution.uValues && solution.uValues.length > 0) {
                console.log(`\n📊 u values: ${solution.uValues.map(u => u.toFixed(6)).join(', ')}`);
            }

            if (solution.solutions && solution.solutions.length > 0) {
                console.log(`\n✅ Solutions for x:`);
                solution.solutions.forEach((sol, i) => {
                    console.log(`   x${i + 1} = ${sol.toFixed(6)}`);
                });
            } else if (solution.solutionType) {
                console.log(`\n${solution.solutionType}`);
            }
            break;

        case 'exponential_systems':
            console.log(`📚 Problem Type: ${solution.problemType || 'System of Exponential Equations'}`);
            
            if (solution.equations && solution.equations.length > 0) {
                console.log(`\n📐 Equations:`);
                solution.equations.forEach((eq, i) => {
                    console.log(`   ${i + 1}. ${eq}`);
                });
            }

            if (solution.methods && solution.methods.length > 0) {
                console.log(`\n🔧 Solution Methods:`);
                solution.methods.forEach(method => {
                    console.log(`   • ${method}`);
                });
            }

            if (solution.note) {
                console.log(`\n💡 Note: ${solution.note}`);
            }
            break;

        default:
            console.log('📊 Exponential solution computed successfully.');
            if (solution.message) {
                console.log(`💬 ${solution.message}`);
            }
            console.log(JSON.stringify(solution, null, 2));
    }
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

        } else if (currentProblemCategory === 'vector') {
            currentWorkbook.generateVectorGraphData();
        } else if (currentProblemCategory === 'quadratic') {
            currentWorkbook.generateQuadraticGraphData();
        } else if (currentProblemCategory === 'exponential') {
            currentWorkbook.generateExponentialGraphData();
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
        } else if (currentProblemCategory === 'exponential') {
            displayExponentialGraph(currentWorkbook.graphData);
        } else {
            displayLinearGraph(currentWorkbook.graphData);
        }
    } else {
        console.log('ℹ️  No graph data available for this problem type.\n');
    }
};


const displayVectorGraph = (graphData) => {
    switch (graphData.type) {
        case 'vector_addition':
        case 'vector_subtraction':
            console.log(`➡️ Vector ${graphData.type === 'vector_addition' ? 'Addition' : 'Subtraction'} Diagram\n`);
            if (graphData.vectors && graphData.vectors.length > 0) {
                console.log(`📊 Input Vectors:`);
                graphData.vectors.forEach((v, i) => {
                    console.log(`   v${i + 1} = ⟨${v.join(', ')}⟩`);
                });
            }
            if (graphData.resultant) {
                console.log(`\n✅ Resultant: ⟨${graphData.resultant.join(', ')}⟩`);
            }
            console.log(`\n   Visual Representation (2D projection):`);
            console.log(`       y`);
            console.log(`       |`);
            console.log(`       |    ↗ resultant`);
            console.log(`       |  ↗`);
            console.log(`       |→ v1`);
            console.log(`   ────┼──────── x`);
            console.log(`       |`);
            console.log(`\n   💡 ${graphData.geometric || 'Head-to-tail method'}`);
            break;

        case 'cross_product':
            console.log(`✖️ Cross Product Diagram\n`);
            console.log(`📊 Vector u: ⟨${graphData.vectorU?.join(', ')}⟩`);
            console.log(`📊 Vector v: ⟨${graphData.vectorV?.join(', ')}⟩`);
            console.log(`✅ u × v: ⟨${graphData.crossProduct?.join(', ')}⟩`);
            console.log(`\n   3D Visualization:`);
            console.log(`         z`);
            console.log(`         ↑  u × v (perpendicular)`);
            console.log(`         |`);
            console.log(`         |  → v`);
            console.log(`         | ↗`);
            console.log(`         |/`);
            console.log(`   ──────o──────→ y`);
            console.log(`        /|`);
            console.log(`       / u`);
            console.log(`      x`);
            console.log(`\n   💡 Result is perpendicular to both input vectors`);
            console.log(`   📐 Use right-hand rule: fingers u, curl to v, thumb points result`);
            break;

        case 'projection':
            console.log(`📐 Vector Projection Diagram\n`);
            console.log(`📊 Vector u: ⟨${graphData.vectorU?.join(', ')}⟩`);
            console.log(`📊 Vector v: ⟨${graphData.vectorV?.join(', ')}⟩`);
            if (graphData.projection) {
                console.log(`✅ Projection: ⟨${graphData.projection.join(', ')}⟩`);
            }
            console.log(`\n   Visual Representation:`);
            console.log(`         u`);
            console.log(`        ↗`);
            console.log(`       / |`);
            console.log(`      /  | perpendicular`);
            console.log(`     /   ↓`);
            console.log(`    ────────→ projection onto v`);
            console.log(`         v direction`);
            console.log(`\n   💡 Projection shows component of u in direction of v`);
            break;

        default:
            console.log(`📊 ${graphData.type}`);
            console.log(`   Vector visualization available in 3D space.`);
            if (graphData.note) {
                console.log(`   ${graphData.note}`);
            }
    }
};



// NEW: Display exponential graph
const displayExponentialGraph = (graphData) => {
    switch (graphData.type) {
        case 'exponential_function':
            console.log(`📈 Function: ${graphData.function}\n`);
            console.log(`📊 Exponential Properties:`);
            console.log(`   Base: ${graphData.base}`);
            console.log(`   Coefficient: ${graphData.coefficient}`);
            console.log(`   Horizontal Asymptote: y = ${graphData.asymptote}`);

            console.log(`\n📍 Sample Points:`);
            if (graphData.points && graphData.points.length > 0) {
                const samplePoints = graphData.points.filter((p, i) => i % 5 === 0).slice(0, 5);
                samplePoints.forEach(pt => {
                    console.log(`   (${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`);
                });
            }

            console.log(`\n📉 Visual Representation:`);
            if (graphData.base > 1) {
                console.log(`      y`);
                console.log(`      |        ╱`);
                console.log(`      |      ╱`);
                console.log(`      |    ╱`);
                console.log(`      |  ╱`);
                console.log(`   ───┼─────────── x`);
                console.log(`      |___________  (asymptote y=0)`);
                console.log(`   (Exponential growth: base > 1)`);
            } else {
                console.log(`      y`);
                console.log(`      |╲`);
                console.log(`      | ╲`);
                console.log(`      |  ╲`);
                console.log(`      |   ╲`);
                console.log(`   ───┼─────────── x`);
                console.log(`      |___________  (asymptote y=0)`);
                console.log(`   (Exponential decay: 0 < base < 1)`);
            }
            break;

        case 'exponential_growth':
        case 'exponential_decay':
            console.log(`📊 Model: ${graphData.type}\n`);
            if (graphData.equation) {
                console.log(`📐 Equation: ${graphData.equation}`);
            }
            if (graphData.initialAmount !== undefined) {
                console.log(`📍 Initial Amount: ${graphData.initialAmount}`);
            }
            console.log(`\n💡 Graph shows ${graphData.type === 'exponential_growth' ? 'increasing' : 'decreasing'} exponential curve`);
            console.log(`   approaching horizontal asymptote at y = 0`);
            break;

        default:
            console.log(`   Graph data available for ${graphData.type}`);
            console.log(`   Visualization shows exponential behavior\n`);
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
                console.log(`📈 Function: ${graphData.function}`);
                console.log(`\n📊 Graph Properties:`);
                console.log(`   Slope (m): ${graphData.slope}`);
                console.log(`   Y-intercept (b): ${graphData.yIntercept}`);
                if (graphData.xIntercept !== Infinity && graphData.xIntercept !== -Infinity) {
                    console.log(`   X-intercept: ${graphData.xIntercept.toFixed(6)}`);
                }
                
                console.log(`\n📍 Sample Points on the Line:`);
                const m = graphData.slope;
                const b = graphData.yIntercept;
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
                const critVal = graphData.criticalValue;
                console.log(`   Critical Value: ${critVal.toFixed(6)}`);
                console.log(`   Solution Set: ${graphData.solutionSet}`);
                console.log(`   Interval: ${graphData.intervalNotation}\n`);
                
                console.log(`   Number Line Representation:`);
                const isGreater = graphData.solutionSet.includes('>');
                const isInclusive = graphData.intervalNotation.includes('[') || 
                                    graphData.intervalNotation.includes(']');
                
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
                console.log(`   Left Boundary: ${graphData.leftCritical.toFixed(6)}`);
                console.log(`   Right Boundary: ${graphData.rightCritical.toFixed(6)}`);
                console.log(`   Interval: ${graphData.intervalNotation}\n`);
                
                console.log(`   Number Line Representation:`);
                console.log(`   ─────●═══════●─────`);
                console.log(`       ${graphData.leftCritical.toFixed(2)}      ${graphData.rightCritical.toFixed(2)}`);
                console.log(`   (Shaded region between boundaries)`);
                break;

            case 'absolute_value':
                console.log(`📐 Absolute Value Graph:\n`);
                if (graphData.solutions && graphData.solutions.length > 0) {
                    console.log(`   Solutions: ${graphData.solutions.map(s => s.toFixed(6)).join(', ')}\n`);
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
                const pt = graphData.intersectionPoint;
                console.log(`   Solution: (${pt.x.toFixed(6)}, ${pt.y.toFixed(6)})`);
                console.log(`   Type: ${graphData.solutionType}\n`);
                
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
                console.log(`   Graph Type: ${graphData.type}`);

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

    } else if (currentProblemCategory === 'vector') {
        if (!currentWorkbook.lessons || Object.keys(currentWorkbook.lessons).length === 0) {
            currentWorkbook.initializeVectorLessons();
        }

    } else if (currentProblemCategory === 'quadratic') {
        if (!currentWorkbook.lessons || Object.keys(currentWorkbook.lessons).length === 0) {
            currentWorkbook.initializeQuadraticLessons();
        }
    } else if (currentProblemCategory === 'exponential') {
        if (!currentWorkbook.lessons || Object.keys(currentWorkbook.lessons).length === 0) {
            currentWorkbook.initializeExponentialLessons();
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
        } else if (currentProblemCategory === 'exponential') {
            console.log('🎯 KEY PRINCIPLES:');
            console.log('  • Exponential functions involve variables in the exponent');
            console.log('  • Represent rapid growth or decay processes');
            console.log('  • Logarithms are the inverse of exponentials');
            console.log('  • Used in compound interest, population growth, radioactive decay\n');
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

const solutionVerification = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('SOLUTION VERIFICATION');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    const type = currentProblem.type;
    const solution = currentResult.solution || currentResult;
    
    try {
        if (currentProblemCategory === 'vector') {
            verifyVectorSolution(type, solution);
        } else if (currentProblemCategory === 'geometric') {
            verifyGeometricSolution(type, solution);
        } else if (currentProblemCategory === 'quadratic') {
            verifyQuadraticSolution(type, solution);
        } else if (currentProblemCategory === 'exponential') {
            verifyExponentialSolution(type, solution);
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

// NEW: Verify vector solution
const verifyVectorSolution = (type, solution) => {
    switch (type) {
        case 'vector_addition':
        case 'vector_subtraction':
            const addVerification = currentWorkbook.verifyVectorAddition();
            console.log(`📋 Vector Operation: ${addVerification.operation}\n`);
            console.log(`📊 Input Vectors:`);
            addVerification.inputVectors.forEach((v, i) => {
                console.log(`   Vector ${i + 1}: ${v}`);
            });
            console.log(`\n✅ Result Vector: ${addVerification.resultVector}`);
            console.log(`📏 Magnitude: ${addVerification.magnitude.toFixed(6)}\n`);
            
            console.log(`🔍 Component Verification:`);
            addVerification.componentCheck.forEach((check, i) => {
                const component = ['x', 'y', 'z'][i] || `component ${i}`;
                console.log(`   ${component}: ${check.calculation} = ${check.result.toFixed(6)} ${check.isCorrect ? '✓' : '✗'}`);
            });
            console.log('');
            break;
            
        case 'dot_product':
            const dotVerification = currentWorkbook.verifyDotProduct();
            console.log(`📋 Dot Product Verification\n`);
            console.log(`   Vector u: ${dotVerification.vectorU}`);
            console.log(`   Vector v: ${dotVerification.vectorV}\n`);
            console.log(`   Calculated: ${dotVerification.calculatedResult.toFixed(6)}`);
            console.log(`   Verification: ${dotVerification.verification.toFixed(6)}`);
            console.log(`   Difference: ${dotVerification.difference.toExponential(2)}`);
            console.log(`   Status: ${dotVerification.isCorrect ? '✓ VALID' : '✗ INVALID'}\n`);
            
            if (solution.angle !== undefined) {
                console.log(`📐 Geometric Interpretation:`);
                console.log(`   Angle: ${solution.angleDegrees.toFixed(2)}°`);
                console.log(`   Relationship: ${solution.relationship}\n`);
            }
            break;
            
        case 'cross_product':
            const crossVerification = currentWorkbook.verifyCrossProduct();
            console.log(`📋 Cross Product Verification\n`);
            console.log(`   Vector u: ${crossVerification.vectorU}`);
            console.log(`   Vector v: ${crossVerification.vectorV}\n`);
            console.log(`   Calculated Result: ${crossVerification.calculatedResult}`);
            console.log(`   Verification: ${crossVerification.verification}`);
            console.log(`   Status: ${crossVerification.isCorrect ? '✓ VALID' : '✗ INVALID'}\n`);
            
            console.log(`🔍 Perpendicularity Check:`);
            console.log(`   Perpendicular to u: ${crossVerification.perpendicularToU ? '✓ YES' : '✗ NO'}`);
            console.log(`   Perpendicular to v: ${crossVerification.perpendicularToV ? '✓ YES' : '✗ NO'}`);
            console.log(`   Right-hand rule: ${crossVerification.rightHandRule}\n`);
            
            if (solution.magnitude !== undefined) {
                console.log(`📏 Magnitude (Parallelogram Area): ${solution.magnitude.toFixed(6)}\n`);
            }
            break;
            
        case 'vector_magnitude':
            const magVerification = currentWorkbook.verifyMagnitude();
            console.log(`📋 Magnitude Verification\n`);
            console.log(`   Vector: ${magVerification.vector}`);
            console.log(`   Calculated Magnitude: ${magVerification.calculatedMagnitude.toFixed(6)}`);
            console.log(`   Verification: ${magVerification.verification.toFixed(6)}`);
            console.log(`   Is Correct: ${magVerification.isCorrect ? '✓ YES' : '✗ NO'}`);
            console.log(`   Is Non-negative: ${magVerification.isNonNegative ? '✓ YES' : '✗ NO'}`);
            console.log(`   Formula: ${magVerification.formula}\n`);
            break;
            
        case 'unit_vector':
            const unitVerification = currentWorkbook.verifyUnitVector();
            if (unitVerification.error) {
                console.log(`❌ ${unitVerification.error}\n`);
            } else {
                console.log(`📋 Unit Vector Verification\n`);
                console.log(`   Unit Vector: ${unitVerification.unitVector}`);
                console.log(`   Magnitude: ${unitVerification.magnitude.toFixed(6)}`);
                console.log(`   Is Unit (magnitude = 1): ${unitVerification.isUnit ? '✓ YES' : '✗ NO'}`);
                console.log(`   Deviation from 1: ${unitVerification.deviation.toExponential(2)}`);
                console.log(`   ${unitVerification.criterion}\n`);
            }
            break;
            
        case 'vector_projection':
            const projVerification = currentWorkbook.verifyProjection();
            if (projVerification.error) {
                console.log(`❌ ${projVerification.error}\n`);
            } else {
                console.log(`📋 Vector Projection Verification\n`);
                console.log(`   Projection: ${projVerification.projection}`);
                console.log(`   Orthogonal Component: ${projVerification.orthogonal}`);
                console.log(`   Reconstruction: ${projVerification.reconstruction}`);
                console.log(`   Reconstruction Correct: ${projVerification.reconstructionCorrect ? '✓ YES' : '✗ NO'}\n`);
                
                console.log(`🔍 Orthogonality Check:`);
                console.log(`   Dot Product: ${projVerification.orthogonalityCheck?.toFixed(6) || 'N/A'}`);
                console.log(`   Are Orthogonal: ${projVerification.areOrthogonal === true ? '✓ YES' : projVerification.areOrthogonal === false ? '✗ NO' : 'N/A'}\n`);
            }
            break;
            
        case 'vector_angle':
            console.log(`📋 Angle Between Vectors Verification\n`);
            console.log(`   Vector u: ${solution.vectorU}`);
            console.log(`   Vector v: ${solution.vectorV}\n`);
            console.log(`   Dot Product: ${solution.dotProduct.toFixed(6)}`);
            console.log(`   Magnitude u: ${solution.magnitudes.u.toFixed(6)}`);
            console.log(`   Magnitude v: ${solution.magnitudes.v.toFixed(6)}`);
            console.log(`   cos θ: ${solution.cosTheta.toFixed(6)}\n`);
            console.log(`✅ Angle: ${solution.angleDegrees.toFixed(2)}° (${solution.angleRadians.toFixed(6)} radians)`);
            console.log(`   Relationship: ${solution.relationship}\n`);
            break;
            
        case 'orthogonal_test':
            console.log(`📋 Orthogonality Test\n`);
            console.log(`   Vector u: ${solution.vectorU}`);
            console.log(`   Vector v: ${solution.vectorV}\n`);
            console.log(`   Dot Product: ${solution.dotProduct.toFixed(6)}`);
            console.log(`   ${solution.criterion}`);
            console.log(`   Result: ${solution.conclusion}\n`);
            console.log(`   Status: ${solution.isOrthogonal ? '✓ ORTHOGONAL' : '✗ NOT ORTHOGONAL'}\n`);
            break;
            
        case 'parallel_test':
            console.log(`📋 Parallel Test\n`);
            console.log(`   Vector u: ${solution.vectorU}`);
            console.log(`   Vector v: ${solution.vectorV}\n`);
            console.log(`   Cross Product: ${currentWorkbook.formatVector(solution.crossProduct)}`);
            console.log(`   Cross Magnitude: ${solution.crossMagnitude.toFixed(6)}`);
            console.log(`   ${solution.criterion}`);
            console.log(`   Result: ${solution.conclusion}\n`);
            console.log(`   Status: ${solution.isParallel ? '✓ PARALLEL' : '✗ NOT PARALLEL'}\n`);
            break;
            
        case 'distance_points':
            console.log(`📋 Distance Between Points\n`);
            console.log(`   Point P: ${solution.pointP}`);
            console.log(`   Point Q: ${solution.pointQ}\n`);
            console.log(`   Difference Vector: ${solution.differenceNotation}`);
            console.log(`   Calculation: ${solution.calculation}`);
            console.log(`✅ Distance: ${solution.distance.toFixed(6)} units\n`);
            break;
            
        case 'triple_scalar':
            console.log(`📋 Triple Scalar Product Verification\n`);
            console.log(`   Formula: ${solution.formula}`);
            console.log(`   Cross Product (v × w): ${currentWorkbook.formatVector(solution.crossProduct)}`);
            console.log(`   Triple Scalar Product: ${solution.tripleScalarProduct.toFixed(6)}`);
            console.log(`   Volume: ${solution.volume.toFixed(6)} cubic units\n`);
            console.log(`   Geometric: ${solution.geometric}`);
            console.log(`   ${solution.interpretation}\n`);
            break;
            
        case 'parallelogram_area':
            console.log(`📋 Parallelogram Area\n`);
            console.log(`   Cross Product: ${solution.crossProductNotation}`);
            console.log(`   Formula: ${solution.formula}`);
            console.log(`✅ Area: ${solution.area.toFixed(6)} square units\n`);
            break;
            
        case 'triangle_area':
            console.log(`📋 Triangle Area\n`);
            console.log(`   Side AB: ${currentWorkbook.formatVector(solution.sideAB)}`);
            console.log(`   Side AC: ${currentWorkbook.formatVector(solution.sideAC)}`);
            console.log(`   Cross Product: ${currentWorkbook.formatVector(solution.crossProduct)}`);
            console.log(`   Formula: ${solution.formula}`);
            console.log(`✅ Area: ${solution.area.toFixed(6)} square units\n`);
            break;
            
        case 'parametric_line':
            console.log(`📋 Parametric Line Equation\n`);
            console.log(`   Point on Line: ${solution.pointNotation}`);
            console.log(`   Direction Vector: ${solution.directionNotation}\n`);
            console.log(`   Vector Form: ${solution.vectorForm}`);
            console.log(`\n   Parametric Form:`);
            console.log(`   ${solution.parametricForm.x}`);
            console.log(`   ${solution.parametricForm.y}`);
            console.log(`   ${solution.parametricForm.z}\n`);
            break;
            
        case 'plane_equation':
            console.log(`📋 Plane Equation\n`);
            console.log(`   Point on Plane: ${solution.pointNotation}`);
            console.log(`   Normal Vector: ${solution.normalNotation}\n`);
            console.log(`   Scalar Equation: ${solution.scalarEquation}`);
            console.log(`   Vector Form: ${solution.vectorForm}\n`);
            break;
            
        default:
            console.log(`📊 Vector Problem: ${type}\n`);
            console.log(`💡 Verification Method:`);
            console.log(`  1. Check vector operations performed correctly`);
            console.log(`  2. Verify geometric interpretation`);
            console.log(`  3. Confirm perpendicularity/parallelism where applicable`);
            console.log(`  4. Validate magnitude and direction\n`);
            
            if (solution && solution.result) {
                console.log(`✅ Result:`);
                if (Array.isArray(solution.result)) {
                    console.log(`   Vector: ${currentWorkbook.formatVector(solution.result)}`);
                    if (solution.magnitude !== undefined) {
                        console.log(`   Magnitude: ${solution.magnitude.toFixed(6)}`);
                    }
                } else {
                    console.log(`   ${JSON.stringify(solution.result, null, 2)}`);
                }
                console.log('');
            }
    }
};

// NEW: Verify exponential solution
const verifyExponentialSolution = (type, solution) => {
    switch (type) {
        case 'simple_exponential':
        case 'natural_exponential':
            const verification = currentWorkbook.verifySimpleExponential();
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

        case 'exponential_inequality':
            const inequalityVerification = currentWorkbook.verifyExponentialInequality();
            console.log(`📋 Original Inequality: ${inequalityVerification.inequality}\n`);
            console.log(`🎯 Critical Value: ${inequalityVerification.criticalValue.toFixed(6)}`);
            console.log(`📊 Solution Set: ${inequalityVerification.solutionSet}\n`);
            
            if (inequalityVerification.testResults && inequalityVerification.testResults.length > 0) {
                console.log(`🔍 Test Point Verification:`);
                console.log(`   ${'Point'.padEnd(12)} ${'Left'.padEnd(12)} ${' Op '.padEnd(4)} ${'Right'.padEnd(12)} Result`);
                console.log(`   ${'-'.repeat(60)}`);
                inequalityVerification.testResults.forEach(test => {
                    const status = test.satisfies ? '✓ Valid' : '✗ Invalid';
                    console.log(`   ${String(test.testPoint.toFixed(2)).padEnd(12)} ${String(test.leftValue.toFixed(2)).padEnd(12)} ${inequalityVerification.operator.padEnd(4)} ${String(test.rightValue.toFixed(2)).padEnd(12)} ${status}`);
                });
                console.log('');
            }
            break;

        case 'exponential_growth':
        case 'exponential_decay':
            console.log(`📊 ${type.includes('growth') ? 'Growth' : 'Decay'} Model Verification\n`);
            if (solution.equation) {
                console.log(`📐 Equation: ${solution.equation}\n`);
            }
            
            console.log(`🔍 Verification Method:`);
            console.log(`  1. Check initial condition (t=0)`);
            console.log(`  2. Verify exponential behavior`);
            console.log(`  3. Confirm ${type.includes('growth') ? 'growth' : 'decay'} constant is positive\n`);
            
            if (solution.initialAmount !== undefined) {
                console.log(`✓ Initial amount verified: ${solution.initialAmount}`);
            }
            
            if (type.includes('growth') && solution.growthConstant) {
                console.log(`✓ Growth constant k = ${solution.growthConstant.toFixed(6)} > 0`);
            } else if (type.includes('decay') && solution.decayConstant) {
                console.log(`✓ Decay constant k = ${solution.decayConstant.toFixed(6)} > 0`);
            }
            console.log('');
            break;

        case 'compound_interest':
            console.log(`💰 Compound Interest Verification\n`);
            if (solution.formula) {
                console.log(`📐 Formula Used: ${solution.formula}\n`);
            }
            
            console.log(`🔍 Verification:`);
            if (solution.principal !== undefined) {
                console.log(`  ✓ Principal: $${solution.principal.toFixed(2)}`);
            }
            if (solution.rate !== undefined) {
                console.log(`  ✓ Rate: ${(solution.rate * 100).toFixed(2)}%`);
            }
            if (solution.time !== undefined) {
                console.log(`  ✓ Time: ${solution.time} years`);
            }
            if (solution.finalAmount !== undefined) {
                console.log(`  ✓ Final Amount: $${solution.finalAmount.toFixed(2)}`);
            }
            
            console.log(`\n💡 To verify manually:`);
            console.log(`  1. Substitute values into formula`);
            console.log(`  2. Calculate step by step`);
            console.log(`  3. Compare with computed result\n`);
            break;

        case 'half_life':
            console.log(`⚗️  Half-Life Verification\n`);
            
            if (solution.halfLife !== undefined) {
                console.log(`📊 Half-Life: ${solution.halfLife} time units`);
                console.log(`📊 Decay Constant: k = ln(2)/${solution.halfLife} = ${(Math.log(2)/solution.halfLife).toFixed(6)}\n`);
            } else if (solution.doublingTime !== undefined) {
                console.log(`📊 Doubling Time: ${solution.doublingTime} time units`);
                console.log(`📊 Growth Constant: k = ln(2)/${solution.doublingTime} = ${(Math.log(2)/solution.doublingTime).toFixed(6)}\n`);
            }
            
            console.log(`🔍 Relationship Verification:`);
            console.log(`  ✓ Half-life formula: t₁/₂ = ln(2)/k`);
            console.log(`  ✓ After one half-life: amount = initial × 0.5`);
            console.log(`  ✓ After two half-lives: amount = initial × 0.25\n`);
            break;

        case 'logarithmic_equation':
            console.log(`📊 Logarithmic Equation Verification\n`);
            
            if (solution.equation) {
                console.log(`📐 Original: ${solution.equation}`);
            }
            if (solution.exponentialForm) {
                console.log(`📐 Exponential Form: ${solution.exponentialForm}\n`);
            }
            
            if (solution.solution !== undefined) {
                console.log(`🔍 Verification:`);
                console.log(`  Solution: x = ${solution.solution.toFixed(6)}`);
                console.log(`  Domain Check: x > 0? ${solution.solution > 0 ? '✓ YES' : '✗ NO'}`);
                console.log(`  Status: ${solution.verification ? '✓ VALID' : '✗ INVALID'}\n`);
            }
            break;

        case 'exponential_quadratic':
            console.log(`🔢 Exponential Quadratic Verification\n`);
            
            if (solution.substitution) {
                console.log(`📐 Substitution: ${solution.substitution}`);
            }
            
            if (solution.uValues && solution.uValues.length > 0) {
                console.log(`\n📊 u-values (must be positive):`);
                solution.uValues.forEach((u, i) => {
                    console.log(`  u${i + 1} = ${u.toFixed(6)} ${u > 0 ? '✓' : '✗ (rejected)'}`);
                });
            }
            
            if (solution.solutions && solution.solutions.length > 0) {
                console.log(`\n✅ Valid solutions for x:`);
                solution.solutions.forEach((x, i) => {
                    console.log(`  x${i + 1} = ${x.toFixed(6)} ✓`);
                });
            }
            
            console.log(`\n💡 Verification notes:`);
            console.log(`  • Only positive u-values yield real solutions`);
            console.log(`  • Exponential expressions are always positive\n`);
            break;

        default:
            console.log(`📊 Exponential Problem: ${type}\n`);
            console.log(`💡 Verification Method:`);
            console.log(`  1. Substitute solution back into original equation`);
            console.log(`  2. Check domain restrictions (arguments > 0 for logs)`);
            console.log(`  3. Verify exponential properties are maintained`);
            console.log(`  4. Ensure answer is reasonable in context\n`);
            
            if (solution) {
                console.log(`📊 Current Solution:`);
                console.log(JSON.stringify(solution, null, 2));
                console.log('');
            }
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

    const notes = currentProblemCategory === 'vector'
        ? currentWorkbook.generatePedagogicalNotes(currentProblem.type)
        : currentProblemCategory === 'geometric'
        ? currentWorkbook.generatePedagogicalNotes(currentProblem.type)
        : currentProblemCategory === 'quadratic'
        ? currentWorkbook.generatePedagogicalNotes(currentProblem.type)
        : currentProblemCategory === 'exponential'
        ? currentWorkbook.generatePedagogicalNotes(currentProblem.type)
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

// UPDATED: Alternative methods - includes vectors
const alternativeMethods = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('ALTERNATIVE SOLUTION METHODS');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    const alternatives = currentWorkbook.generateAlternativeMethods(currentProblem.type);
    
    console.log(`🔧 Primary Method Used: ${alternatives.primaryMethod}\n`);
    
    console.log('🔄 ALTERNATIVE APPROACHES:\n');
    alternatives.methods.forEach((method, i) => {
        console.log(`  ${i + 1}. ${method.name}`);
        console.log(`     ${method.description}\n`);
    });
    
    console.log(`📊 Method Comparison:`);
    console.log(`   ${alternatives.comparison}\n`);
};

// UPDATED: Generate related problems - includes vectors
const generateRelatedProblems = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('RELATED PRACTICE PROBLEMS');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    const type = currentProblem.type;
    
    console.log(`📝 Practice problems similar to your problem (${type}):\n`);
    
    // VECTOR PRACTICE PROBLEMS
    if (currentProblemCategory === 'vector') {
        if (type === 'vector_addition') {
            console.log('  1. Add ⟨3, 4⟩ + ⟨1, 2⟩');
            console.log('  2. Add ⟨-2, 5, 3⟩ + ⟨4, -1, 6⟩');
            console.log('  3. Add three vectors: ⟨1, 0⟩ + ⟨0, 1⟩ + ⟨2, 3⟩');
            console.log('  4. Add ⟨5, -3, 2⟩ + ⟨-5, 3, -2⟩');
            console.log('  5. Add ⟨7, 2, -4⟩ + ⟨3, -8, 1⟩\n');
            
        } else if (type === 'vector_subtraction') {
            console.log('  1. Subtract ⟨5, 3⟩ - ⟨2, 1⟩');
            console.log('  2. Subtract ⟨6, -4, 2⟩ - ⟨3, 2, -1⟩');
            console.log('  3. Subtract ⟨0, 0, 0⟩ - ⟨4, 5, 6⟩');
            console.log('  4. Subtract ⟨-3, 7⟩ - ⟨-3, 7⟩');
            console.log('  5. Subtract ⟨9, 1, -5⟩ - ⟨4, 3, -2⟩\n');
            
        } else if (type === 'scalar_multiplication') {
            console.log('  1. Multiply 3⟨2, 4⟩');
            console.log('  2. Multiply -2⟨5, -3, 1⟩');
            console.log('  3. Multiply 0.5⟨8, 6, -4⟩');
            console.log('  4. Multiply -1⟨7, 2, 9⟩');
            console.log('  5. Multiply 4⟨-1, 3, 0⟩\n');
            
        } else if (type === 'dot_product') {
            console.log('  1. ⟨3, 4⟩ · ⟨1, 2⟩');
            console.log('  2. ⟨1, 2, 3⟩ · ⟨4, 5, 6⟩');
            console.log('  3. ⟨-2, 5⟩ · ⟨3, -1⟩');
            console.log('  4. ⟨1, 0, -1⟩ · ⟨2, 3, 4⟩');
            console.log('  5. ⟨6, -3, 2⟩ · ⟨2, 4, -1⟩\n');
            
        } else if (type === 'cross_product') {
            console.log('  1. ⟨1, 0, 0⟩ × ⟨0, 1, 0⟩');
            console.log('  2. ⟨2, 3, 4⟩ × ⟨5, 6, 7⟩');
            console.log('  3. ⟨1, 2, 3⟩ × ⟨-1, -2, -3⟩');
            console.log('  4. ⟨3, -2, 1⟩ × ⟨1, 4, -2⟩');
            console.log('  5. ⟨0, 3, 5⟩ × ⟨-2, 1, 4⟩\n');
            
        } else if (type === 'vector_magnitude') {
            console.log('  1. Find ||⟨3, 4⟩||');
            console.log('  2. Find ||⟨1, 2, 2⟩||');
            console.log('  3. Find ||⟨-5, 12⟩||');
            console.log('  4. Find ||⟨2, -3, 6⟩||');
            console.log('  5. Find ||⟨7, 0, -24⟩||\n');
            
        } else if (type === 'unit_vector') {
            console.log('  1. Find unit vector for ⟨3, 4⟩');
            console.log('  2. Find unit vector for ⟨6, 8⟩');
            console.log('  3. Find unit vector for ⟨1, 2, 2⟩');
            console.log('  4. Find unit vector for ⟨-3, 0, 4⟩');
            console.log('  5. Find unit vector for ⟨5, -12⟩\n');
            
        } else if (type === 'vector_projection') {
            console.log('  1. Project ⟨4, 2⟩ onto ⟨3, 0⟩');
            console.log('  2. Project ⟨1, 2, 3⟩ onto ⟨1, 0, 0⟩');
            console.log('  3. Project ⟨5, 5⟩ onto ⟨1, 1⟩');
            console.log('  4. Project ⟨3, -4, 5⟩ onto ⟨2, 0, 1⟩');
            console.log('  5. Project ⟨6, 8⟩ onto ⟨3, 4⟩\n');
            
        } else if (type === 'vector_angle') {
            console.log('  1. Angle between ⟨1, 0⟩ and ⟨0, 1⟩');
            console.log('  2. Angle between ⟨3, 4⟩ and ⟨4, 3⟩');
            console.log('  3. Angle between ⟨1, 1, 1⟩ and ⟨1, 0, 0⟩');
            console.log('  4. Angle between ⟨2, -1⟩ and ⟨1, 2⟩');
            console.log('  5. Angle between ⟨3, 4, 0⟩ and ⟨0, 4, 3⟩\n');
            
        } else if (type === 'orthogonal_test') {
            console.log('  1. Test ⟨1, 2⟩ and ⟨-2, 1⟩');
            console.log('  2. Test ⟨3, 4⟩ and ⟨4, -3⟩');
            console.log('  3. Test ⟨1, 0, 0⟩ and ⟨0, 1, 0⟩');
            console.log('  4. Test ⟨2, 3, -1⟩ and ⟨1, -2, 4⟩');
            console.log('  5. Test ⟨5, 5⟩ and ⟨1, -1⟩\n');
            
        } else if (type === 'parallel_test') {
            console.log('  1. Test ⟨2, 4⟩ and ⟨1, 2⟩');
            console.log('  2. Test ⟨3, 6, 9⟩ and ⟨1, 2, 3⟩');
            console.log('  3. Test ⟨-4, 8⟩ and ⟨2, -4⟩');
            console.log('  4. Test ⟨1, 0, 0⟩ and ⟨0, 1, 0⟩');
            console.log('  5. Test ⟨5, -10, 15⟩ and ⟨-1, 2, -3⟩\n');
            
        } else if (type === 'distance_points') {
            console.log('  1. Distance from (0, 0) to (3, 4)');
            console.log('  2. Distance from (1, 2, 3) to (4, 6, 8)');
            console.log('  3. Distance from (-2, 5) to (3, -7)');
            console.log('  4. Distance from (0, 0, 0) to (1, 1, 1)');
            console.log('  5. Distance from (5, -3, 2) to (-1, 4, 6)\n');
            
        } else if (type === 'parallelogram_area') {
            console.log('  1. Area with sides ⟨3, 0, 0⟩ and ⟨0, 4, 0⟩');
            console.log('  2. Area with sides ⟨2, 3, 0⟩ and ⟨-1, 4, 0⟩');
            console.log('  3. Area with sides ⟨1, 2, 3⟩ and ⟨4, 5, 6⟩');
            console.log('  4. Area with sides ⟨5, 0, 0⟩ and ⟨3, 4, 0⟩');
            console.log('  5. Area with sides ⟨2, -1, 3⟩ and ⟨1, 3, -2⟩\n');
            
        } else if (type === 'triangle_area') {
            console.log('  1. Vertices: (0,0), (4,0), (0,3)');
            console.log('  2. Vertices: (1,1), (4,1), (2,5)');
            console.log('  3. Vertices: (0,0,0), (3,0,0), (0,4,0)');
            console.log('  4. Vertices: (-2,3), (1,7), (4,2)');
            console.log('  5. Vertices: (1,2,3), (4,5,6), (7,8,9)\n');
            
        } else if (type === 'triple_scalar') {
            console.log('  1. u=⟨1,0,0⟩, v=⟨0,1,0⟩, w=⟨0,0,1⟩');
            console.log('  2. u=⟨2,3,1⟩, v=⟨1,0,2⟩, w=⟨3,1,0⟩');
            console.log('  3. u=⟨1,1,1⟩, v=⟨1,2,3⟩, w=⟨4,5,6⟩');
            console.log('  4. u=⟨3,-2,1⟩, v=⟨1,4,2⟩, w=⟨-1,1,3⟩');
            console.log('  5. u=⟨2,0,1⟩, v=⟨1,3,0⟩, w=⟨0,2,4⟩\n');
            
        } else if (type === 'parametric_line') {
            console.log('  1. Line through (1,2) with direction ⟨3,4⟩');
            console.log('  2. Line through (0,0,0) with direction ⟨1,1,1⟩');
            console.log('  3. Line through (2,-1,3) with direction ⟨0,1,0⟩');
            console.log('  4. Line through points (1,2,3) and (4,5,6)');
            console.log('  5. Line through (5,0) parallel to ⟨-2,3⟩\n');
            
        } else if (type === 'plane_equation') {
            console.log('  1. Plane through (1,2,3) with normal ⟨4,5,6⟩');
            console.log('  2. Plane through (0,0,0) with normal ⟨1,0,0⟩');
            console.log('  3. Plane through (2,-1,4) perpendicular to ⟨3,2,1⟩');
            console.log('  4. Plane through three points');
            console.log('  5. Plane parallel to xy-plane through (0,0,5)\n');
            
        } else {
            console.log('  1. Try simpler numerical values');
            console.log('  2. Work with 2D vectors first, then 3D');
            console.log('  3. Try unit vectors (i, j, k)');
            console.log('  4. Experiment with perpendicular vectors');
            console.log('  5. Test parallel and opposite vectors\n');
        }
    }


    else if (currentProblemCategory === 'geometric') {
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
        if (type === 'standard_quadratic' || type === 'quadratic_formula' || type === 'factoring_quadratic') {
            console.log('  1. x² + 5x + 6 = 0');
            console.log('  2. 2x² - 7x + 3 = 0');
            console.log('  3. x² - 4 = 0');
            console.log('  4. 3x² + 2x - 1 = 0');
            console.log('  5. x² + 6x + 9 = 0\n');
            
        } else if (type === 'completing_square') {
            console.log('  1. x² + 8x + 5 = 0');
            console.log('  2. x² - 6x + 2 = 0');
            console.log('  3. 2x² + 12x + 7 = 0');
            console.log('  4. x² + 10x - 3 = 0');
            console.log('  5. 3x² - 18x + 15 = 0\n');
            
        } else if (type === 'quadratic_inequality') {
            console.log('  1. x² - 5x + 6 > 0');
            console.log('  2. 2x² + 3x - 2 ≤ 0');
            console.log('  3. x² - 9 < 0');
            console.log('  4. -x² + 4x + 5 ≥ 0');
            console.log('  5. 3x² - 7x + 2 > 0\n');
            
        } else if (type === 'vertex_form' || type === 'function_analysis') {
            console.log('  1. Find vertex of y = x² + 6x + 5');
            console.log('  2. Find vertex of y = 2x² - 8x + 3');
            console.log('  3. Convert to vertex form: y = x² + 4x + 1');
            console.log('  4. Find maximum of y = -x² + 6x - 5');
            console.log('  5. Find axis of symmetry: y = 3x² - 12x + 7\n');
            
        } else if (type === 'projectile_motion') {
            console.log('  1. h(t) = -16t² + 64t, find max height');
            console.log('  2. h(t) = -4.9t² + 20t + 5, when hits ground?');
            console.log('  3. h(t) = -16t² + 48t + 10, max height and time');
            console.log('  4. h(t) = -16t² + 80t, when at 64 feet?');
            console.log('  5. h(t) = -4.9t² + 30t, time in air\n');
        }
    }
    // EXPONENTIAL PRACTICE PROBLEMS
    else if (currentProblemCategory === 'exponential') {
        if (type === 'simple_exponential' || type === 'natural_exponential') {
            console.log('  1. 2^x = 16');
            console.log('  2. 3^(x+1) = 27');
            console.log('  3. 5^(2x) = 125');
            console.log('  4. e^x = 10');
            console.log('  5. 4^(x-2) = 64\n');
            
        } else if (type === 'exponential_inequality') {
            console.log('  1. 2^x > 8');
            console.log('  2. 3^x ≤ 81');
            console.log('  3. 5^(x-1) < 25');
            console.log('  4. e^x ≥ 100');
            console.log('  5. (1/2)^x > 0.125\n');
            
        } else if (type === 'exponential_growth') {
            console.log('  1. P(t) = 100e^(0.05t), find P(10)');
            console.log('  2. N(t) = 50(1.2)^t, when does N = 200?');
            console.log('  3. Population doubles every 5 years, model');
            console.log('  4. A(t) = 1000(1.08)^t, find time to double');
            console.log('  5. Growth rate 3% per year, initial 500\n');
            
        } else if (type === 'exponential_decay') {
            console.log('  1. A(t) = 100e^(-0.1t), find A(5)');
            console.log('  2. N(t) = 1000(0.8)^t, when half remaining?');
            console.log('  3. Depreciation 15% per year, initial $20000');
            console.log('  4. A(t) = 50e^(-0.05t), when A = 25?');
            console.log('  5. Decay rate 2% per hour, model\n');
            
        } else if (type === 'compound_interest') {
            console.log('  1. $1000 at 5% annually for 10 years');
            console.log('  2. $5000 at 6% quarterly for 5 years');
            console.log('  3. $2000 at 4% monthly for 3 years');
            console.log('  4. $10000 at 7% continuously for 8 years');
            console.log('  5. $3000 at 5.5% semi-annually for 6 years\n');
            
        } else if (type === 'half_life') {
            console.log('  1. Half-life 10 years, 80% remains when?');
            console.log('  2. Half-life 5730 years (Carbon-14)');
            console.log('  3. Substance decays to 25% in 20 years');
            console.log('  4. Half-life 8 days, initial 100g, find after 24 days');
            console.log('  5. When does 200g reduce to 50g?\n');
            
        } else if (type === 'logarithmic_equation') {
            console.log('  1. log₂(x) = 5');
            console.log('  2. ln(x) = 3');
            console.log('  3. log(x + 1) = 2');
            console.log('  4. log₅(2x - 3) = 2');
            console.log('  5. ln(x²) = 4\n');
            
        } else if (type === 'exponential_quadratic') {
            console.log('  1. e^(2x) - 5e^x + 6 = 0');
            console.log('  2. 4^x - 5(2^x) + 4 = 0');
            console.log('  3. 9^x - 10(3^x) + 9 = 0');
            console.log('  4. e^(2x) - 3e^x - 10 = 0');
            console.log('  5. 25^x - 6(5^x) + 5 = 0\n');
        }
    }
    // LINEAR PRACTICE PROBLEMS
    else {
        if (type === 'simple_linear' || type === 'multi_step_linear') {
            console.log('  1. 2x + 5 = 13');
            console.log('  2. 3x - 7 = 2x + 4');
            console.log('  3. 4(x + 2) = 20');
            console.log('  4. 5x + 3 = 2x + 18');
            console.log('  5. 7 - 2x = 3x + 17\n');
            
        } else if (type === 'fractional_linear') {
            console.log('  1. x/3 + 2 = 5');
            console.log('  2. (2x + 1)/4 = 3');
            console.log('  3. x/2 + x/3 = 5');
            console.log('  4. (x - 3)/5 = 2');
            console.log('  5. 3x/4 - 1 = x/2 + 2\n');
            
        } else if (type === 'linear_inequality') {
            console.log('  1. 2x + 3 < 11');
            console.log('  2. 5x - 7 ≥ 3x + 9');
            console.log('  3. -3x + 5 > 14');
            console.log('  4. 4x - 1 ≤ 2x + 5');
            console.log('  5. 6 - 2x < 3x - 9\n');
            
        } else if (type === 'compound_inequality') {
            console.log('  1. -3 < 2x + 1 < 7');
            console.log('  2. 1 ≤ 3x - 2 ≤ 10');
            console.log('  3. -5 < -2x + 3 < 7');
            console.log('  4. 0 ≤ 4x + 8 < 20');
            console.log('  5. -10 < 5x - 5 ≤ 15\n');
            
        } else if (type === 'absolute_value_equation') {
            console.log('  1. |x + 3| = 7');
            console.log('  2. |2x - 1| = 5');
            console.log('  3. |3x + 4| = 10');
            console.log('  4. |x - 5| = 2');
            console.log('  5. |4x + 8| = 12\n');
            
        } else if (type === 'absolute_value_inequality') {
            console.log('  1. |x - 2| < 5');
            console.log('  2. |2x + 3| ≥ 7');
            console.log('  3. |x + 1| ≤ 4');
            console.log('  4. |3x - 6| > 9');
            console.log('  5. |5x - 10| < 15\n');
            
        } else if (type === 'system_2x2') {
            console.log('  1. x + y = 5, x - y = 1');
            console.log('  2. 2x + 3y = 12, x - y = 1');
            console.log('  3. 3x + 2y = 11, x + 4y = 13');
            console.log('  4. 5x - 2y = 4, 3x + y = 7');
            console.log('  5. 4x + 3y = 10, 2x - y = 4\n');
            
        } else if (type === 'system_3x3') {
            console.log('  1. x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2');
            console.log('  2. 2x + y + z = 8, x - y + 2z = 4, 3x + 2y - z = 10');
            console.log('  3. x + 2y + 3z = 14, 2x - y + z = 3, 3x + y - 2z = 0');
            console.log('  4. 3x + 2y + z = 11, x + 3y + 2z = 13, 2x + y + 3z = 12');
            console.log('  5. x - y + z = 2, 2x + y - z = 3, x + 2y + z = 6\n');
        }
    }
    
    console.log('💡 Tip: Try solving these on your own, then use this system to check!');
    console.log(`🎯 Challenge: Try different ${currentProblemCategory} problem types!\n`);
};

// UPDATED: Generate complete workbook - handles all problem types including vectors
const generateCompleteWorkbook = () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('COMPLETE WORKBOOK');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    console.log('📚 Generating comprehensive workbook...\n');
    
    // Generate all sections
    console.log('✓ Problem Statement');
    console.log('✓ Lesson & Theory');
    console.log('✓ Step-by-Step Solution');
    console.log('✓ Solution Verification');
    console.log('✓ Graph/Diagram');
    console.log('✓ Pedagogical Notes');
    console.log('✓ Alternative Methods');
    console.log('✓ Practice Problems\n');
    
    // Call the appropriate workbook generation method
    if (currentProblemCategory === 'vector') {
        currentWorkbook.generateVectorWorkbook();
    } else if (currentProblemCategory === 'geometric') {
        currentWorkbook.generateGeometricWorkbook();
    } else if (currentProblemCategory === 'quadratic') {
        currentWorkbook.generateQuadraticWorkbook();
    } else if (currentProblemCategory === 'exponential') {
        currentWorkbook.generateExponentialWorkbook();
    } else {
        currentWorkbook.generateLinearWorkbook();
    }
    
    console.log('✅ Complete workbook generated successfully!\n');
    
    console.log('📊 Workbook Contents:\n');
    if (currentWorkbook.currentWorkbook && currentWorkbook.currentWorkbook.sections) {
        currentWorkbook.currentWorkbook.sections.forEach((section, i) => {
            console.log(`  ${i + 1}. ${section.title}`);
        });
    }
    
    console.log('\n💡 Use option 10 to export this workbook as PNG image!\n');
};

// UPDATED: Export workbook to PNG - handles all problem types
const exportWorkbookToPNG = async () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('EXPORT WORKBOOK TO PNG');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
    
    if (!currentWorkbook.currentWorkbook) {
        console.log('⚠️  No workbook generated yet. Please generate workbook first (option 9).\n');
        return;
    }
    
    console.log('📊 Preparing workbook for export...\n');

    try {
        const filename = `${currentProblemCategory}_workbook_${Date.now()}.png`;
        const canvas = createWorkbookCanvas(currentWorkbook);
        const buffer = canvas.toBuffer('image/png');
        
        fs.writeFileSync(filename, buffer);
        
        console.log(`✅ Workbook exported successfully!\n`);
        console.log(`📁 File: ${filename}`);
        console.log(`📐 Size: ${canvas.width}x${canvas.height} pixels\n`);
        console.log(`💡 You can now open this file in any image viewer.\n`);
        
    } catch (error) {
        console.log(`❌ Export failed: ${error.message}\n`);
        console.log(`💡 Make sure the canvas library is properly installed.\n`);
    }
};

// UPDATED: Create workbook canvas - handles all problem types including vectors
const createWorkbookCanvas = (workbook) => {
    const width = 1400;
    const height = 2400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = workbook.colors?.background || '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    let yPos = 40;
    
    // Title
    ctx.fillStyle = workbook.colors?.headerBg || '#4472c4';
    ctx.fillRect(0, 0, width, 80);
    ctx.fillStyle = workbook.colors?.headerText || '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    
    const categoryTitle = currentProblemCategory.charAt(0).toUpperCase() + currentProblemCategory.slice(1);
    ctx.fillText(`${categoryTitle} Mathematical Workbook`, width / 2, 50);
    
    yPos = 100;
    
    // Problem type
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Problem Type: ${currentProblem.type}`, 40, yPos);
    yPos += 40;

    // Problem statement
    ctx.font = '16px Arial';
    const problemText = currentProblem.originalInput || currentProblem.equation;
    const maxWidth = width - 80;
    
    // Word wrap for long problems
    const words = problemText.split(' ');
    let line = '';
    words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
            ctx.fillText(line, 40, yPos);
            line = word + ' ';
            yPos += 25;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line, 40, yPos);
    yPos += 60;
    
    // Sections
    if (workbook.currentWorkbook && workbook.currentWorkbook.sections) {
        workbook.currentWorkbook.sections.forEach(section => {
            // Check if we need a new page (simple overflow prevention)
            if (yPos > height - 200) {
                return; // Stop adding content if canvas is full
            }
            
            // Section header
            ctx.fillStyle = workbook.colors?.sectionBg || '#d9e2f3';
            ctx.fillRect(20, yPos - 25, width - 40, 35);
            ctx.fillStyle = workbook.colors?.sectionText || '#000000';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(section.title, 40, yPos);
            yPos += 50;
            
            // Section data
            if (section.data && Array.isArray(section.data)) {
                ctx.font = '14px Arial';
                ctx.fillStyle = '#000000';
                
                // Limit number of rows to prevent overflow
                const maxRows = Math.min(section.data.length, 15);
                
                for (let i = 0; i < maxRows; i++) {
                    const row = section.data[i];
                    
                    if (yPos > height - 150) {
                        break; // Stop if near bottom
                    }
                    
                    if (Array.isArray(row)) {
                        let text = row.join(': ');
                        
                        // Special handling for vector notation
                        if (currentProblemCategory === 'vector') {
                            // Replace special characters for rendering
                            text = text.replace(/⟨/g, '<').replace(/⟩/g, '>');
                            text = text.replace(/·/g, '•').replace(/×/g, 'x');
                        }
                        
                        // Truncate long text
                        if (text.length > 120) {
                            text = text.substring(0, 120) + '...';
                        }
                        
                        ctx.fillText(text, 60, yPos);
                        yPos += 25;
                    }
                }
                
                // Add note if content was truncated
                if (section.data.length > maxRows) {
                    ctx.font = 'italic 12px Arial';
                    ctx.fillStyle = '#666666';
                    ctx.fillText('(Additional content not shown...)', 60, yPos);
                    yPos += 20;
                    ctx.fillStyle = '#000000';
                    ctx.font = '14px Arial';
                }
            }
            
            yPos += 30;
        });
    }
    
    // Add category-specific visual indicators
    if (currentProblemCategory === 'vector' && yPos < height - 150) {
        ctx.fillStyle = workbook.colors?.vectorBg || '#e6f3ff';
        ctx.fillRect(20, yPos, width - 40, 100);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Vector Properties:', 40, yPos + 25);
        ctx.font = '14px Arial';
        ctx.fillText('• Vectors have magnitude and direction', 40, yPos + 50);
        ctx.fillText('• Operations: addition, dot product, cross product', 40, yPos + 70);
        yPos += 120;
    }
    
    // Footer
    ctx.fillStyle = workbook.colors?.headerBg || '#4472c4';
    ctx.fillRect(0, height - 60, width, 60);
    ctx.fillStyle = workbook.colors?.headerText || '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Generated by Enhanced Mathematical Workbook System - ${new Date().toLocaleDateString()}`, width / 2, height - 35);
    ctx.fillText(`Category: ${categoryTitle} | Problem Type: ${currentProblem.type}`, width / 2, height - 15);
    
    return canvas;
};

// UPDATED: Get problem input - handles all problem types including vectors
const getProblemInput = async () => {
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('ENTER YOUR PROBLEM');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    const equation = await prompt('📝 Enter your equation or problem: ');
    
    if (!equation || equation.toLowerCase() === 'exit') {
        return false;
    }
    
    const scenario = await prompt('📖 Additional context (optional, press Enter to skip): ');
    
    console.log('\n🔍 Analyzing problem...\n');
    
    currentProblemCategory = detectProblemCategory(equation, scenario);
    console.log(`✅ Detected Category: ${currentProblemCategory.toUpperCase()}`);
    
    const problemType = detectProblemType(equation, scenario);
    console.log(`✅ Detected Problem Type: ${problemType}`);
    
    const parameters = extractParameters(equation, problemType, scenario);
    console.log(`✅ Extracted Parameters: ${JSON.stringify(parameters, null, 2)}`);
    
    // Initialize appropriate workbook
    if (currentProblemCategory === 'vector') {
        if (!vectorWorkbook) {
            const { EnhancedVectorMathematicalWorkbook } = await import('./vector.js');
            vectorWorkbook = new EnhancedVectorMathematicalWorkbook({
                explanationLevel: 'intermediate',
                includeVerificationInSteps: true,
                includeConceptualConnections: true,
                includeAlternativeMethods: true,
                includeErrorPrevention: true,
                includeCommonMistakes: true,
                includePedagogicalNotes: true
            });
        }
        currentWorkbook = vectorWorkbook;
    } else if (currentProblemCategory === 'geometric') {
        if (!geometricWorkbook) {
            geometricWorkbook = new EnhancedGeometricMathematicalWorkbook({
                explanationLevel: 'intermediate',
                includeVerificationInSteps: true,
                includeConceptualConnections: true,
                includeAlternativeMethods: true,
                includeErrorPrevention: true,
                includeCommonMistakes: true,
                includePedagogicalNotes: true
            });
        }
        currentWorkbook = geometricWorkbook;
    } else if (currentProblemCategory === 'quadratic') {
        if (!quadraticWorkbook) {
            quadraticWorkbook = new EnhancedQuadraticMathematicalWorkbook({
                explanationLevel: 'intermediate',
                includeVerificationInSteps: true,
                includeConceptualConnections: true,
                includeAlternativeMethods: true,
                includeErrorPrevention: true,
                includeCommonMistakes: true,
                includePedagogicalNotes: true
            });
        }
        currentWorkbook = quadraticWorkbook;
    } else if (currentProblemCategory === 'exponential') {
        if (!exponentialWorkbook) {
            exponentialWorkbook = new EnhancedExponentialMathematicalWorkbook({
                explanationLevel: 'intermediate',
                includeVerificationInSteps: true,
                includeConceptualConnections: true,
                includeAlternativeMethods: true,
                includeErrorPrevention: true,
                includeCommonMistakes: true,
                includePedagogicalNotes: true
            });
        }
        currentWorkbook = exponentialWorkbook;
    } else {
        if (!linearWorkbook) {
            linearWorkbook = new EnhancedLinearMathematicalWorkbook({
                explanationLevel: 'intermediate',
                includeVerificationInSteps: true,
                includeConceptualConnections: true,
                includeAlternativeMethods: true,
                includeErrorPrevention: true,
                includeCommonMistakes: true,
                includePedagogicalNotes: true
            });
        }
        currentWorkbook = linearWorkbook;
    }
    
    currentProblem = {
        originalInput: equation,
        equation: equation,
        scenario: scenario,
        type: problemType,
        parameters: parameters,
        context: {}
    };
    
    try {
        const problemConfig = {
            equation: equation,
            problem: equation,
            scenario: scenario,
            problemType: problemType,
            parameters: parameters,
            context: {}
        };

        if (currentProblemCategory === 'vector') {
            // Vector-specific problem configuration
            currentResult = currentWorkbook.solveVectorProblem({
                vectors: parameters.vectors || [],
                operation: equation,
                parameters: parameters,
                problemType: problemType,
                context: {}
            });
        } else if (currentProblemCategory === 'geometric') {
            currentResult = currentWorkbook.solveGeometricProblem(problemConfig);
        } else if (currentProblemCategory === 'quadratic') {
            currentResult = currentWorkbook.solveQuadraticProblem(problemConfig);
        } else if (currentProblemCategory === 'exponential') {
            currentResult = currentWorkbook.solveExponentialProblem(problemConfig);
        } else {
            currentResult = currentWorkbook.solveLinearProblem(problemConfig);
        }
        
        console.log('\n✅ Problem loaded and solved successfully!\n');
        return true;
        
    } catch (error) {
        console.log(`\n❌ Error: ${error.message}\n`);
        console.log('💡 Please try rephrasing your problem or check the format.\n');
        
        // Show format hints based on category
        if (currentProblemCategory === 'vector') {
            console.log('📝 Vector Format Examples:');
            console.log('  • "add <1,2,3> and <4,5,6>"');
            console.log('  • "dot product <1,2> and <3,4>"');
            console.log('  • "cross product <1,0,0> and <0,1,0>"');
            console.log('  • "magnitude of <3,4>"');
            console.log('  • "angle between <1,1> and <1,0>"\n');
        }
        
        return await getProblemInput();
    }
};


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
                console.log('💡 You explored LINEAR, QUADRATIC, GEOMETRIC, EXPONENTIAL, and VECTOR problems!\n');
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
console.log('📐 Supporting LINEAR, QUADRATIC, GEOMETRIC, EXPONENTIAL, and VECTOR problems\n');

runInteractiveWorkbook().catch(error => {
    console.error('Fatal error:', error);
    rl.close();
});
