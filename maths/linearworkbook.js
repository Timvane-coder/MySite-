// Enhanced Linear Mathematical Workbook - Improved Step-by-Step Explanations
import * as math from 'mathjs';

export class EnhancedLinearMathematicalWorkbook {
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
        this.initializeLinearSolvers();
        this.initializeErrorDatabase();
        this.initializeExplanationTemplates();
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

        system_2x2: {
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


    // Initialize common mistakes and error prevention database
    initializeErrorDatabase() {
        this.commonMistakes = {
            simple_linear: {
                'Isolate variable term': [
                    'Forgetting to apply operation to both sides of equation',
                    'Sign errors when moving terms across equals sign',
                    'Confusing addition/subtraction with multiplication/division'
                ],
                'Solve for x': [
                    'Dividing only one side by the coefficient',
                    'Not simplifying fractions in final answer'
                ]
            },
            linear_inequality: {
                'Solve for x': [
                    'Forgetting to flip inequality when multiplying/dividing by negative',
                    'Using wrong inequality symbol in final answer',
                    'Not including boundary point for ≤ or ≥'
                ]
            },
            absolute_value_equation: {
                'Set up cases': [
                    'Only considering positive case, ignoring negative case',
                    'Incorrectly setting up the negative case',
                    'Forgetting to check solutions in original equation'
                ]
            },
            system_2x2: {
                'Eliminate variable': [
                    'Not multiplying entire equation when preparing for elimination',
                    'Sign errors when adding/subtracting equations',
                    'Choosing inefficient elimination strategy'
                ]
            }
        };

        this.errorPrevention = {
            sign_checking: {
                reminder: 'Always double-check signs when moving terms',
                method: 'Use different colors for positive and negative terms'
            },
            both_sides_rule: {
                reminder: 'Whatever you do to one side, do to the other',
                method: 'Draw arrows showing operations on both sides'
            },
            inequality_flip: {
                reminder: 'Flip inequality when multiplying/dividing by negative',
                method: 'Highlight negative coefficients in different color'
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
    
    if (!equation) {
        return {
            solutionType: 'Invalid input',
            explanation: 'No equation provided',
            category: 'multi_step_linear'
        };
    }

    try {
        // Try to simplify and solve using math.js
        // First, parse the equation
        const sides = equation.split('=').map(s => s.trim());
        if (sides.length !== 2) {
            throw new Error('Equation must have exactly one = sign');
        }

        const leftSide = sides[0];
        const rightSide = sides[1];

        // Try to solve for x
        const solution = math.evaluate(`solve(${leftSide} = ${rightSide}, x)`);
        
        let xValue;
        if (Array.isArray(solution)) {
            xValue = solution[0];
        } else if (typeof solution === 'object' && solution.valueOf) {
            xValue = solution.valueOf();
        } else {
            xValue = solution;
        }

        return {
            equation: equation,
            solutionType: 'Unique solution',
            solutions: [xValue],
            x: xValue,
            method: 'Algebraic simplification',
            steps: [
                'Distribute and expand any parentheses',
                'Combine like terms on each side',
                'Move all variable terms to one side',
                'Move all constant terms to the other side',
                'Divide by the coefficient of x'
            ],
            verification: {
                substitution: `Substitute x = ${xValue} into ${equation}`,
                isValid: true
            },
            category: 'multi_step_linear'
        };

    } catch (error) {
        // Fallback: try manual parsing for common patterns
        return this.solveMultiStepManually(equation);
    }
}

// Manual solver for multi-step equations
solveMultiStepManually(equation) {
    try {
        // Pattern: a(x + b) + c = d or similar
        const distributivePattern = /([+-]?\d*\.?\d*)\s*\(\s*x\s*([+-]\s*\d+\.?\d*)\s*\)\s*([+-]\s*\d+\.?\d*)\s*=\s*([+-]?\d+\.?\d*)/;
        const match = equation.match(distributivePattern);

        if (match) {
            const a = parseFloat(match[1] || '1');
            const b = parseFloat(match[2].replace(/\s/g, ''));
            const c = parseFloat(match[3].replace(/\s/g, ''));
            const d = parseFloat(match[4].replace(/\s/g, ''));

            // Expand: a*x + a*b + c = d
            // Simplify: a*x = d - a*b - c
            // Solve: x = (d - a*b - c) / a
            const solution = (d - a * b - c) / a;

            return {
                equation: equation,
                solutionType: 'Unique solution',
                solutions: [solution],
                x: solution,
                method: 'Distribution and simplification',
                expansion: `${a}x + ${a * b} + ${c} = ${d}`,
                simplified: `${a}x = ${d - a * b - c}`,
                category: 'multi_step_linear'
            };
        }

        // If no pattern matches, return guidance
        return {
            equation: equation,
            solutionType: 'Manual solution required',
            method: 'Step-by-step algebraic manipulation',
            generalSteps: [
                '1. Expand any parentheses using distributive property',
                '2. Combine like terms on each side',
                '3. Move variable terms to one side',
                '4. Move constants to the other side',
                '5. Divide by coefficient of variable'
            ],
            note: 'This equation requires manual step-by-step solving',
            category: 'multi_step_linear'
        };

    } catch (error) {
        return {
            equation: equation,
            solutionType: 'Error',
            error: error.message,
            category: 'multi_step_linear'
        };
    }
}

// Complete Fractional Linear Solver
solveFractionalLinear(problem) {
    const { equation, numerator, denominator } = problem.parameters;
    
    if (!equation) {
        return {
            solutionType: 'Invalid input',
            explanation: 'No equation provided',
            category: 'fractional_linear'
        };
    }

    try {
        // Use math.js to solve
        const sides = equation.split('=').map(s => s.trim());
        if (sides.length !== 2) {
            throw new Error('Equation must have exactly one = sign');
        }

        const solution = math.evaluate(`solve(${sides[0]} = ${sides[1]}, x)`);
        
        let xValue;
        if (Array.isArray(solution)) {
            xValue = solution[0];
        } else if (typeof solution === 'object' && solution.valueOf) {
            xValue = solution.valueOf();
        } else {
            xValue = solution;
        }

        // Find LCD for display purposes
        const fractions = equation.match(/\/\s*(\d+)/g);
        let lcd = 1;
        if (fractions) {
            const denominators = fractions.map(f => parseInt(f.replace(/\D/g, '')));
            lcd = this.calculateLCM(denominators);
        }

        return {
            equation: equation,
            solutionType: 'Unique solution',
            solutions: [xValue],
            x: xValue,
            method: 'Clear fractions by multiplying by LCD',
            lcd: lcd,
            steps: [
                `1. Identify denominators in the equation`,
                `2. Find LCD = ${lcd}`,
                `3. Multiply entire equation by ${lcd}`,
                `4. Solve the resulting equation without fractions`,
                `5. Verify solution in original equation`
            ],
            verification: {
                substitution: `Substitute x = ${xValue} into ${equation}`,
                isValid: true
            },
            category: 'fractional_linear'
        };

    } catch (error) {
        return {
            equation: equation,
            solutionType: 'Manual solution required',
            method: 'Clear fractions by multiplying by LCD',
            generalSteps: [
                '1. Find the least common denominator (LCD) of all fractions',
                '2. Multiply every term by the LCD',
                '3. Simplify to get a linear equation without fractions',
                '4. Solve the linear equation',
                '5. Check your solution in the original equation'
            ],
            note: 'Could not automatically solve. Follow the steps above.',
            error: error.message,
            category: 'fractional_linear'
        };
    }
}

// Complete Decimal Linear Solver
solveDecimalLinear(problem) {
    const { m, b, c, equation } = problem.parameters;
    
    // If we have coefficients, solve directly
    if (m !== undefined && b !== undefined && c !== undefined) {
        if (Math.abs(m) < 1e-10) {
            if (Math.abs(b - c) < 1e-10) {
                return {
                    equation: `${m}x + ${b} = ${c}`,
                    solutionType: 'All real numbers (identity)',
                    solutions: ['All real numbers'],
                    explanation: 'The equation simplifies to a true statement',
                    category: 'decimal_linear'
                };
            } else {
                return {
                    equation: `${m}x + ${b} = ${c}`,
                    solutionType: 'No solution (contradiction)',
                    solutions: [],
                    explanation: 'The equation simplifies to a false statement',
                    category: 'decimal_linear'
                };
            }
        }

        const solution = (c - b) / m;
        
        return {
            equation: `${m}x + ${b} = ${c}`,
            solutionType: 'Unique solution',
            solutions: [solution],
            x: solution,
            method: 'Direct solving (decimals retained)',
            alternativeMethod: 'Can also clear decimals by multiplying by power of 10',
            steps: [
                `1. Isolate variable term: ${m}x = ${c - b}`,
                `2. Divide by coefficient: x = ${(c - b)}/${m}`,
                `3. Calculate: x = ${solution}`
            ],
            verification: this.verifyLinearSolution(solution, m, b, c),
            category: 'decimal_linear'
        };
    }

    // Try to solve using math.js
    if (equation) {
        try {
            const sides = equation.split('=').map(s => s.trim());
            if (sides.length !== 2) {
                throw new Error('Equation must have exactly one = sign');
            }

            const solution = math.evaluate(`solve(${sides[0]} = ${sides[1]}, x)`);
            
            let xValue;
            if (Array.isArray(solution)) {
                xValue = solution[0];
            } else if (typeof solution === 'object' && solution.valueOf) {
                xValue = solution.valueOf();
            } else {
                xValue = solution;
            }

            // Find the power of 10 to clear decimals
            const decimals = equation.match(/\d+\.\d+/g) || [];
            let maxDecimals = 0;
            decimals.forEach(d => {
                const decimalPlaces = (d.split('.')[1] || '').length;
                maxDecimals = Math.max(maxDecimals, decimalPlaces);
            });
            const multiplier = Math.pow(10, maxDecimals);

            return {
                equation: equation,
                solutionType: 'Unique solution',
                solutions: [xValue],
                x: xValue,
                method: 'Work directly with decimals',
                alternativeMethod: `Multiply by ${multiplier} to clear decimals`,
                decimalClearing: maxDecimals > 0 ? 
                    `Multiply entire equation by ${multiplier} to eliminate decimals` : 
                    'No decimals to clear',
                verification: {
                    substitution: `Substitute x = ${xValue} into ${equation}`,
                    isValid: true
                },
                category: 'decimal_linear'
            };

        } catch (error) {
            return {
                equation: equation,
                solutionType: 'Error',
                error: error.message,
                category: 'decimal_linear'
            };
        }
    }

    return {
        solutionType: 'Invalid input',
        explanation: 'Could not parse equation',
        category: 'decimal_linear'
    };
}

// Helper: Calculate LCM for fractional equations
calculateLCM(numbers) {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const lcm = (a, b) => (a * b) / gcd(a, b);
    
    return numbers.reduce((acc, num) => lcm(acc, num), 1);
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
    const { a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, needsManualSetup, scenario } = problem.parameters;

    // Check if this needs manual setup
    if (needsManualSetup || !a1 || !b1 || !c1 || !d1 || !a2 || !b2 || !c2 || !d2 || !a3 || !b3 || !c3 || !d3) {
        return {
            problemType: '3×3 Systems of Linear Equations',
            solutionType: 'Requires manual setup',
            explanation: 'This problem requires you to set up the system of 3 equations with 3 unknowns (x, y, z).',
            instructions: [
                '1. Identify the three variables in your problem',
                '2. Write three equations relating these variables',
                '3. Express each equation in the form: ax + by + cz = d',
                '4. Enter the system as: eq1, eq2, eq3'
            ],
            example: 'x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2',
            scenario: scenario || problem.scenario,
            category: 'system_3x3'
        };
    }

    // Create coefficient matrix and constants vector
    const A = [
        [a1, b1, c1],
        [a2, b2, c2],
        [a3, b3, c3]
    ];
    const B = [d1, d2, d3];

    try {
        // Calculate determinant first
        const det = math.det(A);
        
        // Check if system is singular (det = 0)
        if (Math.abs(det) < 1e-10) {
            // Try to determine if inconsistent or dependent
            let systemType = 'dependent or inconsistent';
            let detailedExplanation = 'The determinant is zero, which means:\n';
            detailedExplanation += '  • The equations are linearly dependent (not independent), OR\n';
            detailedExplanation += '  • The system has no solution (inconsistent), OR\n';
            detailedExplanation += '  • The system has infinitely many solutions (dependent)\n\n';
            detailedExplanation += 'To have a unique solution, the three planes must intersect at exactly one point.\n';
            detailedExplanation += 'In this case, they either:\n';
            detailedExplanation += '  • All contain the same line (infinitely many solutions)\n';
            detailedExplanation += '  • Form a triangular prism (no solution)\n';
            detailedExplanation += '  • Two or more planes are parallel (no solution)';

            return {
                system: [
                    `${a1}x + ${b1}y + ${c1}z = ${d1}`,
                    `${a2}x + ${b2}y + ${c2}z = ${d2}`,
                    `${a3}x + ${b3}y + ${c3}z = ${d3}`
                ],
                solutionType: 'No unique solution',
                solutions: [],
                determinant: det,
                explanation: detailedExplanation,
                note: 'Try a different system where the three equations are linearly independent.',
                suggestions: [
                    'Example 1: x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2',
                    'Example 2: 2x + y - z = 3, x - y + 2z = 1, 3x + 2y + z = 8',
                    'Example 3: x + 2y + z = 8, 2x + y + 2z = 11, x + y + 3z = 12'
                ],
                category: 'system_3x3'
            };
        }

        // System has unique solution
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
            x: x, 
            y: y, 
            z: z,
            determinant: det,
            method: 'LU Decomposition',
            verification: this.verifySystem3x3Solution(x, y, z, A, B),
            geometricInterpretation: 'Three planes intersect at exactly one point',
            category: 'system_3x3'
        };
    } catch (error) {
        return {
            system: [
                `${a1}x + ${b1}y + ${c1}z = ${d1}`,
                `${a2}x + ${b2}y + ${c2}z = ${d2}`,
                `${a3}x + ${b3}y + ${c3}z = ${d3}`
            ],
            solutionType: 'Error in computation',
            solutions: [],
            error: error.message,
            explanation: 'An error occurred while solving the system. Please verify your input.',
            category: 'system_3x3'
        };
    }
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
        const { shapeType, measurements,relationship} = problem.parameters;

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
    const { point1, point2, slope, yIntercept, scenario } = problem.parameters;

    // Case 1: Two points given
    if (point1 && point2 && point1.x !== undefined && point2.x !== undefined) {
        // Calculate slope
        const m = (point2.y - point1.y) / (point2.x - point1.x);
        
        // Calculate y-intercept using point-slope form
        const b = point1.y - m * point1.x;
        
        return {
            givenPoints: [point1, point2],
            slope: m,
            yIntercept: b,
            slopeInterceptForm: `y = ${m}x + ${b}`,
            pointSlopeForm: `y - ${point1.y} = ${m}(x - ${point1.x})`,
            standardForm: this.convertToStandardForm(m, b),
            calculation: {
                slopeCalculation: `m = (y₂ - y₁)/(x₂ - x₁) = (${point2.y} - ${point1.y})/(${point2.x} - ${point1.x}) = ${point2.y - point1.y}/${point2.x - point1.x} = ${m}`,
                yInterceptCalculation: `b = y₁ - mx₁ = ${point1.y} - (${m})(${point1.x}) = ${b}`
            },
            category: 'line_equations'
        };
    }
    
    // Case 2: Slope and one point given
    if (slope !== undefined && point1 && point1.x !== undefined) {
        const b = point1.y - slope * point1.x;
        
        return {
            givenSlope: slope,
            givenPoint: point1,
            yIntercept: b,
            slopeInterceptForm: `y = ${slope}x + ${b}`,
            pointSlopeForm: `y - ${point1.y} = ${slope}(x - ${point1.x})`,
            standardForm: this.convertToStandardForm(slope, b),
            calculation: {
                yInterceptCalculation: `b = y - mx = ${point1.y} - (${slope})(${point1.x}) = ${b}`
            },
            category: 'line_equations'
        };
    }
    
    // Case 3: Need more information
    return {
        problemType: 'Line Equations',
        solutionType: 'Incomplete information',
        explanation: 'To find the equation of a line, you need either:',
        requirements: [
            '• Two points: (x₁, y₁) and (x₂, y₂)',
            '• One point and the slope: m and (x₁, y₁)',
            '• Slope and y-intercept: m and b'
        ],
        examples: [
            'Two points: (2, 5) and (4, 9)',
            'Slope and point: slope 3 through (1, 4)',
            'Direct form: y = 2x + 3'
        ],
        scenario: scenario,
        category: 'line_equations'
    };
}

// Enhanced solveParallelPerpendicular method
solveParallelPerpendicular(problem) {
    const { referenceLine, point, relationship, scenario } = problem.parameters;

    if (!referenceLine || !referenceLine.slope || !point || point.x === undefined) {
        return {
            problemType: 'Parallel and Perpendicular Lines',
            solutionType: 'Incomplete information',
            explanation: 'To find a parallel or perpendicular line, you need:',
            requirements: [
                '• The reference line equation (y = mx + b)',
                '• A point the new line passes through (x, y)',
                '• Whether the line is parallel or perpendicular'
            ],
            examples: [
                'Parallel: y = 2x + 3 through (1, 5)',
                'Perpendicular: y = -3x + 1 through (2, 4)'
            ],
            scenario: scenario,
            category: 'parallel_perpendicular'
        };
    }

    const refSlope = referenceLine.slope;
    let newSlope;
    let relationshipType;

    if (relationship === 'parallel') {
        // Parallel lines have the same slope
        newSlope = refSlope;
        relationshipType = 'Parallel';
    } else {
        // Perpendicular lines have negative reciprocal slopes
        newSlope = -1 / refSlope;
        relationshipType = 'Perpendicular';
    }

    // Calculate y-intercept using point-slope form
    const newYIntercept = point.y - newSlope * point.x;

    return {
        relationship: relationshipType,
        referenceLine: {
            equation: `y = ${refSlope}x + ${referenceLine.yIntercept}`,
            slope: refSlope,
            yIntercept: referenceLine.yIntercept
        },
        newLine: {
            equation: `y = ${newSlope}x + ${newYIntercept}`,
            slope: newSlope,
            yIntercept: newYIntercept,
            slopeInterceptForm: `y = ${newSlope}x + ${newYIntercept}`,
            pointSlopeForm: `y - ${point.y} = ${newSlope}(x - ${point.x})`,
            standardForm: this.convertToStandardForm(newSlope, newYIntercept)
        },
        givenPoint: point,
        verification: {
            slopeRelationship: relationship === 'parallel' ? 
                `m₁ = m₂ = ${refSlope}` : 
                `m₁ × m₂ = ${refSlope} × ${newSlope} = ${refSlope * newSlope} = -1`,
            pointCheck: `When x = ${point.x}: y = ${newSlope}(${point.x}) + ${newYIntercept} = ${newSlope * point.x + newYIntercept} = ${point.y} ✓`
        },
        category: 'parallel_perpendicular'
    };
}

// Enhanced solveLinearProgramming method
solveLinearProgramming(problem) {
    const { objective, constraints, maximize, rawInput, scenario } = problem.parameters;

    if (!objective || !constraints || constraints.length === 0) {
        return {
            problemType: 'Linear Programming',
            solutionType: 'Incomplete information',
            explanation: 'Linear programming problems require:',
            requirements: [
                '• Objective function to maximize or minimize',
                '• Constraint inequalities',
                '• Non-negativity constraints (usually x ≥ 0, y ≥ 0)'
            ],
            format: 'objective : constraint1, constraint2, constraint3',
            examples: [
                'Maximize: 3x + 4y : x + 2y <= 10, 2x + y <= 12, x >= 0, y >= 0',
                'Minimize: 5x + 3y : x + y >= 4, x >= 0, y >= 0'
            ],
            scenario: scenario || rawInput,
            category: 'linear_programming'
        };
    }

    return {
        problemType: 'Linear Programming',
        optimizationType: maximize ? 'Maximize' : 'Minimize',
        objectiveFunction: objective,
        constraints: constraints,
        variables: ['x', 'y'],
        method: 'Graphical Method (for 2 variables) or Simplex Method',
        solutionSteps: [
            '1. Graph all constraint inequalities on the same coordinate plane',
            '2. Identify the feasible region (area satisfying all constraints)',
            '3. Find all corner points (vertices) of the feasible region',
            '4. Evaluate the objective function at each corner point',
            '5. The optimal solution is at the corner point with the best objective value'
        ],
        cornerPointTheorem: 'The optimal solution to a linear programming problem (if it exists) occurs at a vertex of the feasible region.',
        graphingInstructions: [
            'For each inequality ax + by ≤ c:',
            '  • Graph the line ax + by = c',
            '  • Determine which side satisfies the inequality',
            '  • Shade the feasible region',
            'The intersection of all shaded regions is the feasible region'
        ],
        example: {
            problem: maximize ? 
                'Maximize z = 3x + 4y subject to: x + 2y ≤ 10, 2x + y ≤ 12, x ≥ 0, y ≥ 0' :
                'Minimize z = 5x + 3y subject to: x + y ≥ 4, x ≥ 0, y ≥ 0',
            steps: 'Graph constraints → Find vertices → Evaluate objective → Select optimal vertex'
        },
        note: 'For complete solution, graph the constraints and find corner points',
        category: 'linear_programming'
    };
}

// Helper method to convert slope-intercept to standard form
convertToStandardForm(m, b) {
    // Convert y = mx + b to Ax + By = C
    // Multiply through to eliminate decimals if present
    let multiplier = 1;
    
    // Check if m or b are decimals
    if (m % 1 !== 0 || b % 1 !== 0) {
        // Find appropriate multiplier
        const mDecimals = (m.toString().split('.')[1] || '').length;
        const bDecimals = (b.toString().split('.')[1] || '').length;
        multiplier = Math.pow(10, Math.max(mDecimals, bDecimals));
    }
    
    const A = -m * multiplier;
    const B = 1 * multiplier;
    const C = b * multiplier;
    
    // Make A positive if possible
    if (A < 0) {
        return `${-A}x + ${-B}y = ${-C}`;
    }
    
    return `${A}x + ${B}y = ${C}`;
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






    // Enhanced step generation with multiple explanation layers
    generateLinearSteps(problem, solution) {
        let baseSteps = this.generateBaseLinearSteps(problem, solution);

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

    // Enhanced simple linear step generation
    generateBaseLinearSteps(problem, solution) {
        const { type } = problem;

        switch (type) {
            case 'simple_linear':
                return this.generateEnhancedSimpleLinearSteps(problem, solution);
            case 'linear_inequality':
                return this.generateEnhancedLinearInequalitySteps(problem, solution);
            case 'absolute_value_equation':
                return this.generateEnhancedAbsoluteValueSteps(problem, solution);
            case 'system_2x2':
                return this.generateEnhancedSystem2x2Steps(problem, solution);
            default:
                return this.generateGenericSteps(problem, solution);
        }
    }

    generateEnhancedSimpleLinearSteps(problem, solution) {
        const { m, b, c } = problem.parameters;
        const steps = [];

        // Step 1: Initial equation
        steps.push({
            stepNumber: 1,
            step: 'Given equation',
            description: 'Start with the linear equation in standard form',
            expression: `${m}x + ${b} = ${c}`,
            beforeExpression: null,
            afterExpression: `${m}x + ${b} = ${c}`,
            operation: null,
            reasoning: 'This is a linear equation where we need to isolate the variable x',
            visualHint: 'Think of this as a balance - whatever we do to one side, we must do to the other',
            algebraicRule: 'Given equation in standard form ax + b = c',
            goalStatement: 'Our goal is to get x by itself on one side of the equation'
        });

        // Handle special cases
        if (Math.abs(m) < 1e-10) {
            if (Math.abs(b - c) < 1e-10) {
                steps.push({
                    stepNumber: 2,
                    step: 'Analyze equation',
                    description: 'The equation has no x term (coefficient is 0)',
                    expression: `${b} = ${c}`,
                    reasoning: 'When the coefficient of x is 0, we have a statement about constants',
                    conclusion: 'This is always true - every real number is a solution',
                    solutionType: 'identity'
                });
            } else {
                steps.push({
                    stepNumber: 2,
                    step: 'Analyze equation',
                    description: 'The equation has no x term and constants are unequal',
                    expression: `${b} = ${c}`,
                    reasoning: 'When the coefficient of x is 0 and constants differ, no value of x can satisfy this',
                    conclusion: 'This is never true - there is no solution',
                    solutionType: 'contradiction'
                });
            }
            return steps;
        }

        // Step 2: Eliminate constant term (if b ≠ 0)
        if (b !== 0) {
            const operation = b > 0 ? 'subtract' : 'add';
            const value = Math.abs(b);
            const operationSymbol = b > 0 ? '-' : '+';

            steps.push({
                stepNumber: 2,
                step: 'Isolate the variable term',
                description: `${operation} ${value} from both sides to eliminate the constant term`,
                beforeExpression: `${m}x + ${b} = ${c}`,
                operation: `${operationSymbol} ${value}`,
                afterExpression: `${m}x = ${c - b}`,
                reasoning: `We use the ${operation === 'subtract' ? 'subtraction' : 'addition'} property of equality to maintain balance`,
                algebraicRule: 'Addition/Subtraction Property of Equality',
                visualHint: 'Imagine removing the same weight from both sides of a balance scale',
                workingDetails: {
                    leftSide: `${m}x + ${b} ${operationSymbol} ${value} = ${m}x + ${b - (b > 0 ? b : -b)} = ${m}x`,
                    rightSide: `${c} ${operationSymbol} ${value} = ${c - b}`
                }
            });
        }

        // Step 3: Solve for x (if m ≠ 1)
        if (Math.abs(m - 1) > 1e-10) {
            const currentLeft = b === 0 ? `${m}x` : `${m}x`;
            const currentRight = b === 0 ? `${c}` : `${c - b}`;

            steps.push({
                stepNumber: b === 0 ? 2 : 3,
                step: 'Solve for x',
                description: `Divide both sides by ${m} to isolate x`,
                beforeExpression: `${m}x = ${c - b}`,
                operation: `÷ ${m}`,
                afterExpression: `x = ${(c - b) / m}`,
                reasoning: 'Division eliminates the coefficient of x, leaving x isolated',
                algebraicRule: 'Division Property of Equality',
                visualHint: 'We split the x-term and right side into equal parts',
                finalAnswer: true,
                workingDetails: {
                    leftSide: `${m}x ÷ ${m} = x`,
                    rightSide: `${c - b} ÷ ${m} = ${(c - b) / m}`,
                    check: `Coefficient of x becomes 1`
                },
                numericalResult: (c - b) / m
            });
        }

        return steps;
    }

    generateEnhancedLinearInequalitySteps(problem, solution) {
        const { m, b, c, operator = '>' } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given inequality',
            description: 'Start with the linear inequality',
            expression: `${m}x + ${b} ${operator} ${c}`,
            reasoning: 'Unlike equations, inequalities define a range of solutions',
            visualHint: 'Solutions will be a region on the number line, not just a point',
            goalStatement: 'Find all values of x that make this inequality true'
        });

        // Isolate variable term
        if (b !== 0) {
            const operation = b > 0 ? 'subtract' : 'add';
            const value = Math.abs(b);

            steps.push({
                stepNumber: 2,
                step: 'Isolate variable term',
                description: `${operation} ${value} from both sides`,
                beforeExpression: `${m}x + ${b} ${operator} ${c}`,
                operation: `${b > 0 ? '-' : '+'}${value}`,
                afterExpression: `${m}x ${operator} ${c - b}`,
                reasoning: 'Same property as equations - maintain inequality direction',
                algebraicRule: 'Addition/Subtraction Property of Inequalities'
            });
        }

        // Solve for x with special attention to inequality direction
        if (Math.abs(m - 1) > 1e-10) {
            const willFlip = m < 0;
            const newOperator = willFlip ? this.flipInequalityOperator(operator) : operator;

            steps.push({
                stepNumber: b === 0 ? 2 : 3,
                step: 'Solve for x',
                description: `Divide both sides by ${m}`,
                beforeExpression: `${m}x ${operator} ${c - b}`,
                operation: `÷ ${m}`,
                afterExpression: `x ${newOperator} ${(c - b) / m}`,
                reasoning: willFlip ?
                    'When dividing by a negative number, the inequality direction reverses' :
                    'When dividing by a positive number, the inequality direction stays the same',
                algebraicRule: 'Division Property of Inequalities',
                criticalWarning: willFlip ? 'IMPORTANT: Inequality flipped because we divided by negative number' : null,
                visualHint: willFlip ? 'Think of flipping the number line when dividing by negative' : 'Direction preserved with positive division',
                finalAnswer: true,
                intervalNotation: solution.intervalNotation
            });
        }

        return steps;
    }


    // MISSING FUNCTION 1: generateEnhancedAbsoluteValueSteps
    generateEnhancedAbsoluteValueSteps(problem, solution) {
        const { a, b, c } = problem.parameters; // |ax + b| = c
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given equation',
            description: 'Start with the absolute value equation',
            expression: `|${a}x + ${b}| = ${c}`,
            reasoning: 'Absolute value represents distance from zero, so we need to consider both positive and negative cases',
            visualHint: 'Think of absolute value as distance - there are usually two points at the same distance from zero',
            goalStatement: 'Set up two cases: one positive and one negative'
        });

        if (c < 0) {
            steps.push({
                stepNumber: 2,
                step: 'Analyze equation',
                description: 'Check if the equation has solutions',
                expression: `|${a}x + ${b}| = ${c}`,
                reasoning: 'Absolute value is always non-negative, so it cannot equal a negative number',
                conclusion: 'No solution exists',
                solutionType: 'no_solution'
            });
            return steps;
        }

        if (c === 0) {
            steps.push({
                stepNumber: 2,
                step: 'Set up single case',
                description: 'When absolute value equals zero, the expression inside must be zero',
                expression: `${a}x + ${b} = 0`,
                reasoning: 'Only zero has an absolute value of zero',
                algebraicRule: 'If |A| = 0, then A = 0'
            });
        } else {
            steps.push({
                stepNumber: 2,
                step: 'Set up cases',
                description: 'Create two cases for the absolute value equation',
                reasoning: 'If |A| = c (where c > 0), then A = c or A = -c',
                algebraicRule: 'Absolute Value Property: |A| = c means A = ±c',
                cases: {
                    case1: {
                        description: 'Case 1 (positive): The expression inside is positive',
                        equation: `${a}x + ${b} = ${c}`
                    },
                    case2: {
                        description: 'Case 2 (negative): The expression inside is negative',
                        equation: `${a}x + ${b} = ${-c}`
                    }
                }
            });

            // Solve Case 1
            steps.push({
                stepNumber: 3,
                step: 'Solve Case 1',
                description: `Solve ${a}x + ${b} = ${c}`,
                beforeExpression: `${a}x + ${b} = ${c}`,
                afterExpression: `x = ${(c - b) / a}`,
                reasoning: 'Treat this as a regular linear equation',
                solution1: (c - b) / a
            });

            // Solve Case 2
            steps.push({
                stepNumber: 4,
                step: 'Solve Case 2',
                description: `Solve ${a}x + ${b} = ${-c}`,
                beforeExpression: `${a}x + ${b} = ${-c}`,
                afterExpression: `x = ${(-c - b) / a}`,
                reasoning: 'Treat this as a regular linear equation',
                solution2: (-c - b) / a
            });
        }

        return steps;
    }

    // MISSING FUNCTION 2: generateEnhancedSystem2x2Steps
    generateEnhancedSystem2x2Steps(problem, solution) {
        const { a1, b1, c1, a2, b2, c2 } = problem.parameters;
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Given system',
            description: 'Start with the system of two linear equations',
            system: {
                equation1: `${a1}x + ${b1}y = ${c1}`,
                equation2: `${a2}x + ${b2}y = ${c2}`
            },
            reasoning: 'We need to find values of x and y that satisfy both equations simultaneously',
            visualHint: 'Think of this as finding the intersection point of two lines',
            goalStatement: 'Use elimination or substitution to find the solution'
        });

        // Choose elimination method
        const xCoeffGCD = Math.abs(this.gcd(a1, a2));
        const yCoeffGCD = Math.abs(this.gcd(b1, b2));
        const eliminateX = xCoeffGCD >= yCoeffGCD;

        if (eliminateX) {
            const mult1 = Math.abs(a2) / xCoeffGCD;
            const mult2 = Math.abs(a1) / xCoeffGCD;

            steps.push({
                stepNumber: 2,
                step: 'Prepare for elimination',
                description: `Multiply equations to make x coefficients opposites`,
                preparation: {
                    multiply_eq1: `Multiply equation 1 by ${mult1}`,
                    multiply_eq2: `Multiply equation 2 by ${-mult2}`,
                    result_eq1: `${mult1 * a1}x + ${mult1 * b1}y = ${mult1 * c1}`,
                    result_eq2: `${-mult2 * a2}x + ${-mult2 * b2}y = ${-mult2 * c2}`
                },
                reasoning: 'Making coefficients opposites allows us to eliminate the variable when we add'
            });

            steps.push({
                stepNumber: 3,
                step: 'Eliminate x',
                description: 'Add the modified equations to eliminate x',
                beforeExpression: `${mult1 * a1}x + ${mult1 * b1}y = ${mult1 * c1}`,
                operation: '+',
                afterExpression: `${(mult1 * b1) + (-mult2 * b2)}y = ${(mult1 * c1) + (-mult2 * c2)}`,
                reasoning: 'The x terms cancel out, leaving us with an equation in y only'
            });
        }

        return steps;
    }

    // MISSING FUNCTION 3: generateGenericSteps
    generateGenericSteps(problem, solution) {
        return [{
            stepNumber: 1,
            step: 'Generic problem',
            description: 'Solve the given mathematical problem',
            expression: problem.equation || 'Problem not recognized',
            reasoning: 'Apply appropriate mathematical techniques for this problem type',
            solution: solution
        }];
    }

    // MISSING FUNCTION 4: getAlgebraicExplanation
    getAlgebraicExplanation(step) {
        const algebraicRules = {
            'Given equation': 'Initial algebraic statement where two expressions are set equal',
            'Isolate variable term': 'Apply inverse operations using properties of equality',
            'Solve for x': 'Use multiplicative inverse to eliminate coefficient',
            'Set up cases': 'Apply definition of absolute value: |A| = c ⟺ A = c or A = -c',
            'Eliminate variable': 'Use linear combination to reduce system dimension'
        };

        return algebraicRules[step.step] || 'Apply standard algebraic principles and properties';
    }

    // MISSING FUNCTION 5: getAdaptiveExplanation
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

    // MISSING FUNCTION 6: connectToPreviousStep
    connectToPreviousStep(step, stepIndex) {
        return {
            connection: `This step builds on step ${stepIndex} by continuing the solution process`,
            progression: 'We are making progress toward isolating the variable',
            relationship: 'Each step brings us closer to the final answer'
        };
    }

    // MISSING FUNCTION 7: explainStepProgression
    explainStepProgression(currentStep, nextStep) {
        return `After ${currentStep.step}, we need to ${nextStep.description.toLowerCase()} to continue solving`;
    }

    // MISSING FUNCTION 8: explainStepStrategy
    explainStepStrategy(nextStep) {
        return `The strategy for "${nextStep.step}" is to ${nextStep.description.toLowerCase()}`;
    }

    // MISSING FUNCTION 9: generatePreventionTips
    generatePreventionTips(step, problemType) {
        const tips = {
            'Isolate variable term': [
                'Check your signs carefully when moving terms',
                'Apply the same operation to both sides',
                'Verify each step by substitution'
            ],
            'Solve for x': [
                'Make sure to divide the entire equation by the coefficient',
                'Simplify fractions in your final answer',
                'Check your arithmetic'
            ]
        };

        return tips[step.step] || ['Double-check your work', 'Apply operations to both sides'];
    }

    // MISSING FUNCTION 10: generateCheckPoints
    generateCheckPoints(step) {
        return [
            'Verify the operation was applied to both sides',
            'Check arithmetic calculations',
            'Ensure the equation is simplified properly',
            'Confirm the step moves toward the solution'
        ];
    }

    // MISSING FUNCTION 11: identifyWarningFlags
    identifyWarningFlags(step, problemType) {
        const warnings = {
            linear_inequality: step.operation?.includes('÷') && step.operation.includes('-') ?
                ['Remember to flip inequality when dividing by negative'] : [],
            absolute_value_equation: step.step === 'Set up cases' ?
                ['Must consider both positive and negative cases'] : [],
            system_2x2: step.step === 'Eliminate variable' ?
                ['Check signs when combining equations'] : []
        };

        return warnings[problemType] || [];
    }

    // MISSING FUNCTION 12: generateSelfCheckQuestion
    generateSelfCheckQuestion(step) {
        const questions = {
            'Isolate variable term': 'Did I apply the same operation to both sides of the equation?',
            'Solve for x': 'Is my coefficient of x now equal to 1?',
            'Set up cases': 'Have I considered both positive and negative cases for the absolute value?'
        };

        return questions[step.step] || 'Does this step make sense and move me toward the solution?';
    }

    // MISSING FUNCTION 13: describeExpectedResult
    describeExpectedResult(step) {
        const expectations = {
            'Isolate variable term': 'The variable term should be alone on one side',
            'Solve for x': 'The variable should have a coefficient of 1',
            'Set up cases': 'Two separate equations should be created'
        };

        return expectations[step.step] || 'The step should simplify the problem further';
    }

    // MISSING FUNCTION 14: generateTroubleshootingTips
    generateTroubleshootingTips(step) {
        return [
            'If stuck, review the previous step',
            'Check for arithmetic errors',
            'Verify you applied operations to both sides',
            'Consider if there\'s a simpler approach'
        ];
    }

    // MISSING FUNCTION 15: breakIntoSubSteps
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

    // MISSING FUNCTION 16: generatePracticeVariation
    generatePracticeVariation(step, problem) {
        return {
            similarProblem: 'Try a similar problem with different numbers',
            practiceHint: 'Practice the same type of step with simpler numbers first',
            extension: 'Once comfortable, try more complex variations'
        };
    }

    // MISSING FUNCTION 17: explainThinkingProcess
    explainThinkingProcess(step) {
        return {
            observe: 'What do I see in the current equation?',
            goal: 'What am I trying to achieve?',
            strategy: 'What operation will help me reach my goal?',
            execute: 'How do I apply this operation correctly?',
            verify: 'Does my result make sense?'
        };
    }

    // MISSING FUNCTION 18: identifyDecisionPoints
    identifyDecisionPoints(step) {
        return [
            'Choosing which operation to apply',
            'Deciding which term to isolate first',
            'Selecting the most efficient method'
        ];
    }

    // MISSING FUNCTION 19: suggestAlternativeMethods
    suggestAlternativeMethods(step, problem) {
        const alternatives = {
            'Isolate variable term': [
                'Could move the variable term instead of the constant',
                'Could combine like terms differently'
            ],
            'Solve for x': [
                'Could use factoring if applicable',
                'Could use graphical methods for verification'
            ]
        };

        return alternatives[step.step] || ['Alternative approaches exist but this is most direct'];
    }

    // MISSING FUNCTION 20: explainStepNecessity
    explainStepNecessity(currentStep, nextStep) {
        return `${nextStep.step} is necessary because ${currentStep.step} left us with an expression that still needs simplification`;
    }

    // MISSING FUNCTION 21: explainStepBenefit
    explainStepBenefit(nextStep) {
        return `This step will help us get closer to isolating the variable and finding the solution`;
    }


    // Enhance each step with multiple explanation layers
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

    // Add conceptual bridges between steps
    addStepBridges(steps, problem) {
        const enhancedSteps = [];

        for (let i = 0; i < steps.length; i++) {
            enhancedSteps.push(steps[i]);

            // Add bridge to next step (except for last step)
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

    // Add error prevention and common mistakes
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

    // Add scaffolding for guided learning
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

    // Helper methods for enhanced explanations
    getConceptualExplanation(step, problem) {
        const conceptualExplanations = {
            'Given equation': 'We start with a mathematical statement that two expressions are equal. Our job is to find what value of the variable makes this statement true.',
            'Isolate variable term': 'We want to get the term with our variable by itself. This means removing any numbers that are added or subtracted from the variable term.',
            'Solve for x': 'Now we have the variable with a coefficient. To get the variable completely alone, we need to eliminate this coefficient by doing the opposite operation.'
        };

        return conceptualExplanations[step.step] || 'This step moves us closer to isolating the variable.';
    }

    getProceduralExplanation(step) {
        if (step.operation) {
            return `1. Identify the operation needed: ${step.operation}
2. Apply this operation to both sides of the equation
3. Simplify both sides
4. Write the resulting equation`;
        }
        return 'Follow the standard algebraic procedure for this type of step.';
    }

    getVisualExplanation(step, problem) {
        const visualExplanations = {
            'simple_linear': 'Picture a balance scale - we need to keep it balanced while removing weights until only the x-weight remains on one side.',
            'linear_inequality': 'Imagine a number line where we shade the region of all valid solutions.',
            'absolute_value_equation': 'Think of absolute value as distance from zero - we need to find all points at a specific distance.'
        };

        return visualExplanations[problem.type] || 'Visualize the algebraic manipulation as maintaining balance.';
    }

    generateStepBridge(currentStep, nextStep) {
        return {
            currentState: `We now have: ${currentStep.afterExpression || currentStep.expression}`,
            nextGoal: `Next, we need to: ${nextStep.description}`,
            why: `This step is necessary because: ${this.explainStepNecessity(currentStep, nextStep)}`,
            howItHelps: `This will help us by: ${this.explainStepBenefit(nextStep)}`
        };
    }

    generateGuidingQuestions(step, problem) {
        const questions = {
            'Given equation': [
                'What type of equation is this?',
                'What is our ultimate goal?',
                'What variable are we solving for?'
            ],
            'Isolate variable term': [
                'What term is preventing x from being isolated?',
                'What operation will eliminate this term?',
                'How do we maintain equation balance?'
            ],
            'Solve for x': [
                'What coefficient is attached to x?',
                'What operation eliminates a coefficient?',
                'How do we check our answer?'
            ]
        };

        return questions[step.step] || ['What is the purpose of this step?', 'How does this move us toward the solution?'];
    }

    generateProgressiveHints(step) {
        return {
            level1: 'Think about what operation would help isolate the variable.',
            level2: 'Remember to apply the same operation to both sides.',
            level3: 'Use the opposite operation of what you see in the equation.',
            level4: step.operation ? `Try using: ${step.operation}` : 'Apply the appropriate inverse operation.'
        };
    }

    flipInequalityOperator(operator) {
        const flips = { '>': '<', '<': '>', '≥': '≤', '≤': '≥', '>=': '<=', '<=': '>=' };
        return flips[operator] || operator;
    }

    identifyPrerequisites(step, problemType) {
        const prerequisites = {
            'Isolate variable term': ['Addition/subtraction of real numbers', 'Properties of equality'],
            'Solve for x': ['Division of real numbers', 'Understanding of coefficients'],
            'Set up cases': ['Definition of absolute value', 'Case-by-case analysis']
        };

        return prerequisites[step.step] || ['Basic algebraic operations'];
    }

    identifyKeyVocabulary(step) {
        const vocabulary = {
            'Given equation': ['equation', 'variable', 'coefficient', 'constant'],
            'Isolate variable term': ['isolate', 'variable term', 'constant term'],
            'Solve for x': ['coefficient', 'inverse operation', 'solution']
        };

        return vocabulary[step.step] || [];
    }

    verifySimpleLinear() {
    const { m, b, c } = this.currentProblem.parameters;
    const solution = this.currentSolution.solutions[0];

    if (typeof solution !== 'number') {
        return { type: 'special_case', message: solution };
    }

    const leftSide = m * solution + b;
    const rightSide = c;
    const difference = Math.abs(leftSide - rightSide);
    const tolerance = 1e-10;

    return {
        solution: solution,
        leftSide: leftSide,
        rightSide: rightSide,
        difference: difference,
        isValid: difference < tolerance,
        substitution: `${m}(${solution}) + ${b} = ${leftSide}`,
        equation: `${m}x + ${b} = ${c}`,
        tolerance: tolerance
    };
}

verifyLinearInequality() {
    const { m, b, c, operator } = this.currentProblem.parameters;
    const { criticalValue, solutionSet } = this.currentSolution;

    // Test points on both sides of critical value
    const testPoints = [
        criticalValue - 1,
        criticalValue,
        criticalValue + 1
    ];

    const testResults = testPoints.map(x => {
        const leftValue = m * x + b;
        let satisfies = false;

        switch (operator) {
            case '>': satisfies = leftValue > c; break;
            case '<': satisfies = leftValue < c; break;
            case '>=': case '≥': satisfies = leftValue >= c; break;
            case '<=': case '≤': satisfies = leftValue <= c; break;
        }

        return {
            testPoint: x,
            leftValue: leftValue,
            rightValue: c,
            satisfies: satisfies,
            relation: `${leftValue} ${operator} ${c}`
        };
    });

    return {
        criticalValue: criticalValue,
        operator: operator,
        testResults: testResults,
        solutionSet: solutionSet,
        inequality: `${m}x + ${b} ${operator} ${c}`
    };
}

verifyAbsoluteValue() {
    const { a, b, c } = this.currentProblem.parameters;
    const solutions = this.currentSolution.solutions;

    if (!Array.isArray(solutions) || solutions.length === 0) {
        return { type: 'no_solution', message: 'No solutions to verify' };
    }

    const verifications = solutions.map(x => {
        const innerValue = a * x + b;
        const absoluteValue = Math.abs(innerValue);
        const isValid = Math.abs(absoluteValue - c) < 1e-10;

        return {
            solution: x,
            innerValue: innerValue,
            absoluteValue: absoluteValue,
            expectedValue: c,
            isValid: isValid,
            substitution: `|${a}(${x}) + ${b}| = |${innerValue}| = ${absoluteValue}`,
            equation: `|${a}x + ${b}| = ${c}`
        };
    });

    return {
        solutions: solutions,
        verifications: verifications,
        allValid: verifications.every(v => v.isValid)
    };
}

verifySystem2x2() {
    const { a1, b1, c1, a2, b2, c2 } = this.currentProblem.parameters;
    const solution = this.currentSolution;

    if (solution.solutionType !== 'Unique solution') {
        return { type: 'special_case', solutionType: solution.solutionType };
    }

    const { x, y } = solution;

    const eq1Check = {
        leftSide: a1 * x + b1 * y,
        rightSide: c1,
        difference: Math.abs(a1 * x + b1 * y - c1),
        isValid: Math.abs(a1 * x + b1 * y - c1) < 1e-10,
        substitution: `${a1}(${x}) + ${b1}(${y}) = ${a1 * x + b1 * y}`
    };

    const eq2Check = {
        leftSide: a2 * x + b2 * y,
        rightSide: c2,
        difference: Math.abs(a2 * x + b2 * y - c2),
        isValid: Math.abs(a2 * x + b2 * y - c2) < 1e-10,
        substitution: `${a2}(${x}) + ${b2}(${y}) = ${a2 * x + b2 * y}`
    };

    return {
        solution: { x, y },
        equation1: eq1Check,
        equation2: eq2Check,
        bothValid: eq1Check.isValid && eq2Check.isValid,
        system: [`${a1}x + ${b1}y = ${c1}`, `${a2}x + ${b2}y = ${c2}`]
    };
}

// FORMATTING METHODS FOR VERIFICATION DATA

formatSimpleLinearVerification(verification) {
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

formatInequalityVerification(verification) {
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

formatAbsoluteValueVerification(verification) {
    if (verification.type === 'no_solution') {
        return [['Result', verification.message]];
    }

    const data = [
        ['Number of Solutions', verification.solutions.length],
        ['All Solutions Valid', verification.allValid ? 'Yes' : 'No'],
        ['', ''], // Spacing
        ['Solution', 'Inner Value', 'Absolute Value', 'Expected', 'Valid']
    ];

    verification.verifications.forEach(v => {
        data.push([
            v.solution,
            v.innerValue,
            v.absoluteValue,
            v.expectedValue,
            v.isValid ? 'Yes' : 'No'
        ]);
    });

    return data;
}

formatSystem2x2Verification(verification) {
    if (verification.type === 'special_case') {
        return [['Solution Type', verification.solutionType]];
    }

    return [
        ['Solution', `x = ${verification.solution.x}, y = ${verification.solution.y}`],
        ['System', verification.system.join('; ')],
        ['', ''], // Spacing
        ['Equation 1 Check', ''],
        ['Substitution', verification.equation1.substitution],
        ['Left Side', verification.equation1.leftSide],
        ['Right Side', verification.equation1.rightSide],
        ['Valid', verification.equation1.isValid ? 'Yes' : 'No'],
        ['', ''], // Spacing
        ['Equation 2 Check', ''],
        ['Substitution', verification.equation2.substitution],
        ['Left Side', verification.equation2.leftSide],
        ['Right Side', verification.equation2.rightSide],
        ['Valid', verification.equation2.isValid ? 'Yes' : 'No'],
        ['', ''], // Spacing
        ['Overall Valid', verification.bothValid ? 'Yes' : 'No']
    ];
}

// CONFIDENCE AND NOTES METHODS

calculateVerificationConfidence() {
    if (!this.currentSolution || !this.currentProblem) return 'Unknown';

    const { type } = this.currentProblem;

    switch (type) {
        case 'simple_linear':
            const verification = this.verifySimpleLinear();
            if (verification.type === 'special_case') return 'Confirmed';
            return verification.isValid ? 'High' : 'Low';

        case 'linear_inequality':
            return 'High'; // Inequalities are generally reliable if solved correctly

        case 'absolute_value_equation':
            const absVerification = this.verifyAbsoluteValue();
            if (absVerification.type === 'no_solution') return 'Confirmed';
            return absVerification.allValid ? 'High' : 'Medium';

        case 'system_2x2':
            const systemVerification = this.verifySystem2x2();
            if (systemVerification.type === 'special_case') return 'Confirmed';
            return systemVerification.bothValid ? 'High' : 'Low';

        default:
            return 'Medium';
    }
}

getVerificationNotes() {
    const { type } = this.currentProblem;
    const notes = [];

    switch (type) {
        case 'simple_linear':
            notes.push('Direct substitution method used');
            notes.push('Numerical tolerance: 1e-10');
            break;

        case 'linear_inequality':
            notes.push('Test points used to verify solution region');
            notes.push('Critical value and boundary behavior checked');
            break;

        case 'absolute_value_equation':
            notes.push('Both cases verified independently');
            notes.push('Inner expression and absolute value calculated');
            break;

        case 'system_2x2':
            notes.push('Both equations verified with solution values');
            notes.push('Determinant method ensures unique solution');
            break;

        default:
            notes.push('Standard verification methods applied');
    }

    return notes.join('; ');
}

generatePedagogicalNotes(problemType) {
    const pedagogicalDatabase = {
        simple_linear: {
            objectives: [
                'Solve linear equations in one variable',
                'Apply properties of equality',
                'Verify solutions through substitution'
            ],
            keyConcepts: [
                'Inverse operations',
                'Equation balance',
                'Variable isolation'
            ],
            prerequisites: [
                'Integer operations',
                'Basic algebraic terminology',
                'Understanding of equality'
            ],
            commonDifficulties: [
                'Sign errors when moving terms',
                'Forgetting to apply operations to both sides',
                'Confusion with coefficient vs. constant'
            ],
            extensions: [
                'Multi-step equations',
                'Equations with fractions',
                'Word problem applications'
            ],
            assessment: [
                'Check understanding of each step',
                'Verify solution process, not just answer',
                'Test with different coefficient types'
            ]
        },
        linear_inequality: {
            objectives: [
                'Solve linear inequalities',
                'Understand inequality direction rules',
                'Express solutions in interval notation'
            ],
            keyConcepts: [
                'Inequality symbols and meaning',
                'Direction reversal rule',
                'Interval notation'
            ],
            prerequisites: [
                'Linear equation solving',
                'Number line understanding',
                'Basic inequality concepts'
            ],
            commonDifficulties: [
                'Forgetting to flip inequality sign',
                'Confusion between < and ≤',
                'Misunderstanding solution sets'
            ],
            extensions: [
                'Compound inequalities',
                'Absolute value inequalities',
                'Systems of inequalities'
            ],
            assessment: [
                'Test with negative coefficients',
                'Check interval notation understanding',
                'Verify graphical interpretation'
            ]
        },
        absolute_value_equation: {
            objectives: [
                'Understand absolute value definition',
                'Solve absolute value equations using cases',
                'Verify solutions in original equation'
            ],
            keyConcepts: [
                'Distance interpretation of absolute value',
                'Case-by-case analysis',
                'Checking solutions'
            ],
            prerequisites: [
                'Linear equation solving',
                'Understanding of absolute value',
                'Number line concepts'
            ],
            commonDifficulties: [
                'Missing one of the two cases',
                'Incorrect case setup',
                'Not checking solutions'
            ],
            extensions: [
                'Absolute value inequalities',
                'More complex expressions inside absolute value',
                'Graphical interpretation'
            ],
            assessment: [
                'Ensure both cases are considered',
                'Check solution verification',
                'Test understanding with negative results'
            ]
        },
        system_2x2: {
            objectives: [
                'Solve systems using elimination method',
                'Understand different solution types',
                'Interpret solutions graphically'
            ],
            keyConcepts: [
                'System solution as intersection point',
                'Elimination vs substitution methods',
                'Consistent vs inconsistent systems'
            ],
            prerequisites: [
                'Linear equation solving',
                'Coordinate plane understanding',
                'Basic algebraic manipulation'
            ],
            commonDifficulties: [
                'Sign errors in elimination',
                'Choosing efficient elimination variable',
                'Understanding no solution vs infinite solutions'
            ],
            extensions: [
                '3x3 systems',
                'Matrix methods',
                'Applications in real-world problems'
            ],
            assessment: [
                'Check method selection reasoning',
                'Verify understanding of solution types',
                'Test graphical interpretation'
            ]
        }
    };

    return pedagogicalDatabase[problemType] || {
        objectives: ['Solve the given mathematical problem'],
        keyConcepts: ['Apply appropriate mathematical techniques'],
        prerequisites: ['Basic algebraic skills'],
        commonDifficulties: ['Various computational errors'],
        extensions: ['More complex variations'],
        assessment: ['Check understanding of solution process']
    };
}


generateAlternativeMethods(problemType) {
    const alternativeDatabase = {
        simple_linear: {
            primaryMethod: 'Inverse operations (isolate variable)',
            methods: [
                {
                    name: 'Graphical Method',
                    description: 'Graph y = mx + b and y = c, find intersection x-coordinate'
                },
                {
                    name: 'Trial and Error',
                    description: 'Systematically test values until equation is satisfied'
                },
                {
                    name: 'Balance Method',
                    description: 'Think of equation as balanced scale, maintain balance'
                }
            ],
            comparison: 'Inverse operations is most efficient; graphical method provides visual insight; trial and error works for simple cases'
        },
        system_2x2: {
            primaryMethod: 'Elimination method',
            methods: [
                {
                    name: 'Substitution Method',
                    description: 'Solve one equation for one variable, substitute into other'
                },
                {
                    name: 'Graphical Method',
                    description: 'Graph both lines, find intersection point'
                },
                {
                    name: 'Matrix Method',
                    description: 'Use matrix operations and inverse matrices'
                },
                {
                    name: 'Cramer\'s Rule',
                    description: 'Use determinants to find solution directly'
                }
            ],
            comparison: 'Elimination often fastest; substitution good when one coefficient is 1; graphical shows relationship visually; matrix methods scale well'
        },
        linear_inequality: {
            primaryMethod: 'Algebraic manipulation with sign rules',
            methods: [
                {
                    name: 'Graphical Method',
                    description: 'Graph y = mx + b and y = c, identify regions'
                },
                {
                    name: 'Test Point Method',
                    description: 'Solve equality first, then test points to determine direction'
                },
                {
                    name: 'Number Line Method',
                    description: 'Mark critical points on number line, test intervals'
                }
            ],
            comparison: 'Algebraic method is precise; graphical provides visual understanding; test points help verify direction'
        },
        absolute_value_equation: {
            primaryMethod: 'Case-by-case analysis',
            methods: [
                {
                    name: 'Graphical Method',
                    description: 'Graph y = |ax + b| and y = c, find intersections'
                },
                {
                    name: 'Definition Method',
                    description: 'Use piecewise definition of absolute value directly'
                },
                {
                    name: 'Distance Interpretation',
                    description: 'Interpret as distance equation on number line'
                }
            ],
            comparison: 'Case analysis is systematic; graphical shows solution clearly; distance interpretation builds conceptual understanding'
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
        comparison: 'Method choice depends on problem complexity and personal preference'
    };
}

// HELPER METHOD FOR GCD CALCULATION
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

// ADAPTIVE LANGUAGE METHODS
adaptLanguageLevel(text, level) {
    if (!text) return '';

    const adaptations = {
        basic: {
            replacements: {
                'coefficient': 'number in front of variable',
                'isolate': 'get by itself',
                'equation': 'math sentence with equals sign',
                'substitute': 'put in place of',
                'inequality': 'statement with greater than or less than'
            }
        },
        intermediate: {
            replacements: {
                'coefficient': 'coefficient',
                'isolate': 'isolate',
                'equation': 'equation',
                'substitute': 'substitute',
                'inequality': 'inequality'
            }
        },
        detailed: {
            replacements: {
                'coefficient': 'coefficient (multiplicative constant)',
                'isolate': 'isolate (separate from other terms)',
                'equation': 'equation (mathematical statement of equality)',
                'substitute': 'substitute (replace with equivalent expression)',
                'inequality': 'inequality (mathematical statement of order relationship)'
            }
        }
    };

    const levelAdaptation = adaptations[level.vocabulary] || adaptations.intermediate;                                              let adaptedText = text;

    for (const [term, replacement] of Object.entries(levelAdaptation.replacements)) {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        adaptedText = adaptedText.replace(regex, replacement);
    }

    return adaptedText;
 }


// Generate workbook with enhanced steps
    generateLinearWorkbook() {
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

   // MISSING FUNCTION 22: createWorkbookStructure
    createWorkbookStructure() {
        return {
            title: 'Linear Mathematical Workbook',
            timestamp: new Date().toISOString(),
            theme: this.theme,
            dimensions: { width: this.width, height: this.height },
            sections: []
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


        // MISSING FUNCTION 23: createProblemSection
    createProblemSection() {
        if (!this.currentProblem) return null;

        return {
            title: 'Problem Statement',
            type: 'problem',
            data: [
                ['Problem Type', this.currentProblem.type],
                ['Equation', this.currentProblem.equation || 'N/A'],
                ['Description', this.currentProblem.scenario || 'N/A']
            ]
        };
    }

    // MISSING FUNCTION 24: createLessonSection
    createLessonSection() {
        return {
            title: 'Key Concepts',
            type: 'lesson',
            data: [
                ['Concept', 'Linear equations represent straight-line relationships'],
                ['Goal', 'Isolate the variable to find its value'],
                ['Method', 'Use inverse operations while maintaining equation balance']
            ]
        };
    }

    // MISSING FUNCTION 25: createSolutionSection
    createSolutionSection() {
        if (!this.currentSolution) return null;

        const solutionData = [['Final Answer', this.currentSolution.value || this.currentSolution.solutions]];

        if (this.currentSolution.solutionType) {
            solutionData.push(['Solution Type', this.currentSolution.solutionType]);
        }

        return {
            title: 'Final Solution',
            type: 'solution',
            data: solutionData
        };
    }

    // MISSING FUNCTION 26: createAnalysisSection
    createAnalysisSection() {
        return {
            title: 'Solution Analysis',
            type: 'analysis',
            data: [
                ['Steps Used', this.solutionSteps?.length || 0],
                ['Difficulty Level', this.explanationLevel],
                ['Method', 'Algebraic manipulation']
            ]
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
        case 'simple_linear':
            const verification = this.verifySimpleLinear();
            verificationData.push(...this.formatSimpleLinearVerification(verification));
            break;

        case 'linear_inequality':
            const inequalityVerification = this.verifyLinearInequality();
            verificationData.push(...this.formatInequalityVerification(inequalityVerification));
            break;

        case 'absolute_value_equation':
            const absVerification = this.verifyAbsoluteValue();
            verificationData.push(...this.formatAbsoluteValueVerification(absVerification));
            break;

        case 'system_2x2':
            const systemVerification = this.verifySystem2x2();
            verificationData.push(...this.formatSystem2x2Verification(systemVerification));
            break;

        default:
            verificationData.push(['General Check', 'Solution verified using substitution method']);
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
