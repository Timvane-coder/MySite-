import * as math from 'mathjs';

export class EnhancedSimultaneousEquationsWorkbook {
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
        this.initializeSimultaneousSolvers();
        this.initializeErrorDatabase();
        this.initializeExplanationTemplates();
    }

    initializeSimultaneousLessons() {
        this.lessons = {
            system_2x2_basic: {
                title: "2×2 Systems of Linear Equations - Basic",
                concepts: [
                    "Two equations with two unknowns (x and y)",
                    "Solution is the point where both equations are satisfied",
                    "Three possible outcomes: unique solution, no solution, infinite solutions",
                    "Can be solved by substitution, elimination, or graphing"
                ],
                theory: "A system of two linear equations represents two lines in a coordinate plane. The solution is where these lines intersect. If lines are parallel (same slope, different y-intercept), there's no solution. If they're the same line, there are infinite solutions.",
                keyFormulas: {
                    "Standard Form": "a₁x + b₁y = c₁ and a₂x + b₂y = c₂",
                    "Determinant": "D = a₁b₂ - a₂b₁",
                    "Cramer's Rule (x)": "x = (c₁b₂ - c₂b₁)/D",
                    "Cramer's Rule (y)": "y = (a₁c₂ - a₂c₁)/D"
                },
                solvingMethods: {
                    substitution: [
                        "Solve one equation for one variable",
                        "Substitute into the other equation",
                        "Solve for the remaining variable",
                        "Back-substitute to find the first variable",
                        "Verify solution in both equations"
                    ],
                    elimination: [
                        "Multiply equations to make coefficients of one variable equal",
                        "Add or subtract equations to eliminate that variable",
                        "Solve for the remaining variable",
                        "Substitute back to find the eliminated variable",
                        "Verify solution in both equations"
                    ],
                    graphical: [
                        "Convert both equations to slope-intercept form",
                        "Graph both lines on the same coordinate plane",
                        "Identify the intersection point",
                        "Read coordinates of intersection as solution",
                        "Verify algebraically"
                    ]
                },
                applications: [
                    "Supply and demand equilibrium",
                    "Mixture problems with two components",
                    "Distance-rate-time problems with two objects",
                    "Cost and revenue break-even analysis",
                    "Age problems with two people",
                    "Number problems with two unknowns"
                ]
            },

            system_3x3: {
                title: "3×3 Systems of Linear Equations",
                concepts: [
                    "Three equations with three unknowns (x, y, and z)",
                    "Solution is the point where all three planes intersect",
                    "More complex than 2×2 systems",
                    "Requires systematic elimination or matrix methods"
                ],
                theory: "A 3×3 system represents three planes in 3D space. The solution is where all three planes intersect at a single point (if a unique solution exists). Systems can be inconsistent (no common point) or dependent (planes intersect along a line or coincide).",
                keyFormulas: {
                    "Standard Form": "a₁x + b₁y + c₁z = d₁, a₂x + b₂y + c₂z = d₂, a₃x + b₃y + c₃z = d₃",
                    "Matrix Form": "AX = B, where A is coefficient matrix, X is variable vector, B is constants vector",
                    "Determinant Method": "det(A) ≠ 0 for unique solution"
                },
                solvingMethods: {
                    elimination: [
                        "Use two equations to eliminate one variable",
                        "Use different pair to eliminate same variable",
                        "Solve resulting 2×2 system",
                        "Back-substitute to find third variable",
                        "Verify in all three original equations"
                    ],
                    matrix: [
                        "Set up augmented matrix [A|B]",
                        "Use row operations to get row echelon form",
                        "Back-substitute to find all variables",
                        "Verify solution"
                    ]
                },
                applications: [
                    "Three-commodity market equilibrium",
                    "Network flow problems",
                    "Electrical circuit analysis",
                    "Chemical mixture with three components",
                    "3D geometry problems"
                ]
            },

            system_nonlinear: {
                title: "Systems with Nonlinear Equations",
                concepts: [
                    "At least one equation is nonlinear (quadratic, exponential, etc.)",
                    "Can have multiple solutions",
                    "Substitution method often most effective",
                    "Graphical interpretation helpful"
                ],
                theory: "When one equation is linear and another is nonlinear (like a parabola or circle), the solution represents intersection points. There can be 0, 1, 2, or more solutions depending on the curves.",
                keyFormulas: {
                    "Linear-Quadratic": "y = mx + b and y = ax² + bx + c",
                    "Linear-Circle": "y = mx + b and x² + y² = r²"
                },
                solvingApproach: [
                    "Solve linear equation for one variable",
                    "Substitute into nonlinear equation",
                    "Solve resulting single-variable equation",
                    "Find all values of first variable",
                    "Back-substitute each value to find second variable",
                    "Verify all solution pairs"
                ],
                applications: [
                    "Projectile motion intersecting with linear path",
                    "Economic supply-demand with nonlinear curves",
                    "Optimization with constraints"
                ]
            },

            system_inequalities: {
                title: "Systems of Linear Inequalities",
                concepts: [
                    "Multiple inequality constraints",
                    "Solution is a region, not a point",
                    "Feasible region bounded by boundary lines",
                    "Used in linear programming and optimization"
                ],
                theory: "Systems of inequalities define regions in the coordinate plane. The solution is the intersection of all individual solution regions (the feasible region). Corner points of this region are critical for optimization.",
                keyFormulas: {
                    "Standard Form": "a₁x + b₁y ≤ c₁, a₂x + b₂y ≤ c₂, ...",
                    "Non-negativity": "x ≥ 0, y ≥ 0 (for real-world constraints)"
                },
                solvingSteps: [
                    "Convert each inequality to equality (boundary line)",
                    "Graph each boundary line",
                    "Determine which side of each line satisfies inequality",
                    "Shade solution region for each inequality",
                    "Identify overlapping region (feasible region)",
                    "Find corner points if needed for optimization"
                ],
                applications: [
                    "Linear programming problems",
                    "Resource allocation with constraints",
                    "Production planning",
                    "Diet and nutrition planning",
                    "Investment portfolio constraints"
                ]
            },

            substitution_method: {
                title: "Substitution Method",
                concepts: [
                    "Solve one equation for one variable",
                    "Replace that variable in the other equation",
                    "Best when one equation is already solved for a variable",
                    "Best when coefficients are 1 or -1"
                ],
                theory: "Substitution reduces a system of two equations to a single equation in one variable by expressing one variable in terms of the other.",
                detailedSteps: [
                    "Choose the simpler equation or one with coefficient 1",
                    "Solve that equation for one variable (usually x or y)",
                    "Substitute the expression into the other equation",
                    "Solve the resulting single-variable equation",
                    "Substitute the value back into the expression from step 2",
                    "Calculate the value of the second variable",
                    "Write solution as an ordered pair (x, y)",
                    "Verify by substituting into both original equations"
                ],
                advantages: [
                    "Natural and intuitive approach",
                    "Works well when one variable is isolated",
                    "Good for systems with different coefficient patterns"
                ],
                disadvantages: [
                    "Can create fractions early in the process",
                    "May be more complex than elimination for some systems",
                    "Algebraic manipulation can become messy"
                ]
            },

            elimination_method: {
                title: "Elimination Method (Addition/Subtraction)",
                concepts: [
                    "Multiply equations to create opposite coefficients",
                    "Add or subtract to eliminate one variable",
                    "Best when coefficients are already aligned",
                    "Most efficient for many systems"
                ],
                theory: "Elimination uses the principle that adding equal quantities to both sides of an equation maintains equality. By creating opposite coefficients, one variable cancels out when equations are combined.",
                detailedSteps: [
                    "Analyze coefficients of both variables",
                    "Choose which variable to eliminate (usually easier one)",
                    "Multiply one or both equations by constants to create opposite coefficients",
                    "Add equations if coefficients are opposite; subtract if same",
                    "Solve the resulting single-variable equation",
                    "Substitute value into either original equation",
                    "Solve for the second variable",
                    "Write solution as ordered pair (x, y)",
                    "Verify in both original equations"
                ],
                strategicChoices: [
                    "Eliminate the variable with easier LCM",
                    "Consider which elimination creates simpler numbers",
                    "Look for coefficients that are already multiples",
                    "Sometimes eliminate different variables and compare difficulty"
                ],
                advantages: [
                    "Often fastest method",
                    "Keeps equations in standard form",
                    "Minimizes fractions during solving",
                    "Very systematic and methodical"
                ],
                disadvantages: [
                    "Requires careful attention to signs",
                    "May need to multiply by large numbers",
                    "Can be confusing which equation to multiply"
                ]
            },

            matrix_method: {
                title: "Matrix Method for Simultaneous Equations",
                concepts: [
                    "Represent system as matrix equation AX = B",
                    "Use matrix operations to solve",
                    "Scales well to larger systems",
                    "Foundation for computational methods"
                ],
                theory: "Matrix methods represent systems compactly and provide systematic solving procedures. For a 2×2 system, the solution can be found using the inverse matrix: X = A⁻¹B. For larger systems, row reduction (Gaussian elimination) is more practical.",
                matrixRepresentation: {
                    "Coefficient Matrix A": "Contains coefficients of variables",
                    "Variable Vector X": "Column of unknowns [x, y]ᵀ",
                    "Constant Vector B": "Column of right-hand sides",
                    "Augmented Matrix": "[A|B] used in row reduction"
                },
                methods: {
                    inverse: [
                        "Set up coefficient matrix A and constant vector B",
                        "Calculate determinant of A",
                        "If det(A) ≠ 0, find inverse matrix A⁻¹",
                        "Multiply: X = A⁻¹B",
                        "Extract solutions from result vector"
                    ],
                    rowReduction: [
                        "Form augmented matrix [A|B]",
                        "Use elementary row operations",
                        "Transform to row echelon form",
                        "Back-substitute to find solutions"
                    ]
                },
                applications: [
                    "Computer solutions of large systems",
                    "Engineering and physics problems",
                    "Economic input-output models",
                    "Network analysis"
                ]
            },

            graphical_method: {
                title: "Graphical Method for Simultaneous Equations",
                concepts: [
                    "Each equation represents a line",
                    "Solution is the intersection point",
                    "Visual understanding of solution",
                    "Limited accuracy for non-integer solutions"
                ],
                theory: "The graphical method interprets each equation as a line in the coordinate plane. The solution is where the lines cross. This method provides geometric insight but may lack precision.",
                steps: [
                    "Rewrite each equation in slope-intercept form (y = mx + b)",
                    "Identify slope and y-intercept for each line",
                    "Plot y-intercept for each line",
                    "Use slope to find second point on each line",
                    "Draw both lines on the same coordinate system",
                    "Identify intersection point",
                    "Read coordinates of intersection as solution",
                    "Verify algebraically"
                ],
                interpretation: {
                    "One intersection point": "Unique solution (consistent, independent)",
                    "Lines are parallel": "No solution (inconsistent)",
                    "Lines coincide": "Infinite solutions (consistent, dependent)"
                },
                advantages: [
                    "Provides visual understanding",
                    "Shows relationship between equations",
                    "Immediately shows number of solutions",
                    "Good for checking algebraic solutions"
                ],
                limitations: [
                    "Limited accuracy, especially for fractions",
                    "Difficult for equations with large coefficients",
                    "Not practical for 3×3 or larger systems",
                    "Requires graph paper or software"
                ]
            },

            special_cases: {
                title: "Special Cases in Simultaneous Equations",
                concepts: [
                    "Not all systems have unique solutions",
                    "Inconsistent systems have no solution",
                    "Dependent systems have infinite solutions",
                    "Can identify type by analyzing coefficients"
                ],
                caseTypes: {
                    unique: {
                        description: "Lines intersect at exactly one point",
                        algebraicCondition: "D = a₁b₂ - a₂b₁ ≠ 0",
                        graphicalView: "Lines have different slopes",
                        example: "x + y = 5 and x - y = 1"
                    },
                    noSolution: {
                        description: "Lines are parallel, never intersect",
                        algebraicCondition: "a₁/a₂ = b₁/b₂ ≠ c₁/c₂",
                        graphicalView: "Same slope, different y-intercepts",
                        example: "2x + y = 5 and 2x + y = 3"
                    },
                    infiniteSolutions: {
                        description: "Lines are identical, overlap completely",
                        algebraicCondition: "a₁/a₂ = b₁/b₂ = c₁/c₂",
                        graphicalView: "Same line drawn twice",
                        example: "2x + y = 5 and 4x + 2y = 10"
                    }
                },
                recognition: [
                    "Check ratios of coefficients before solving",
                    "Calculate determinant (0 means no unique solution)",
                    "During solving, watch for contradictions (0 = 5) or identities (0 = 0)",
                    "Graphical method immediately shows case type"
                ]
            },

            word_problems: {
                title: "Word Problems with Simultaneous Equations",
                concepts: [
                    "Real-world situations with multiple unknowns",
                    "Requires translation from words to equations",
                    "Two conditions needed for two unknowns",
                    "Solution must make sense in context"
                ],
                problemTypes: {
                    mixture: {
                        description: "Combining substances with different properties",
                        approach: "One equation for total amount, one for property (concentration, value)",
                        example: "Mixing coffee types with different prices"
                    },
                    motion: {
                        description: "Two objects moving with different rates",
                        approach: "Use d = rt for each object, relate distances or times",
                        example: "Two cars traveling toward each other"
                    },
                    number: {
                        description: "Finding two numbers with given relationships",
                        approach: "Define variables for each number, write relationships as equations",
                        example: "Sum is 50, difference is 10"
                    },
                    age: {
                        description: "Ages of people now and in the future/past",
                        approach: "Define current ages, write relationships at different times",
                        example: "Father is 3 times son's age now, in 10 years twice the age"
                    },
                    money: {
                        description: "Costs, revenues, or financial relationships",
                        approach: "One equation for quantity, one for value",
                        example: "Tickets sold and total revenue"
                    },
                    geometry: {
                        description: "Perimeter, area, or angle relationships",
                        approach: "Use geometric formulas with two unknowns",
                        example: "Rectangle perimeter and area given"
                    }
                },
                solvingStrategy: [
                    "Read problem carefully, identify what to find",
                    "Define variables clearly (write what each represents)",
                    "Identify two different relationships or conditions",
                    "Translate each condition into an equation",
                    "Solve the system using appropriate method",
                    "Check if solution makes sense in context",
                    "Answer the original question with proper units",
                    "Verify in word problem context"
                ]
            },

            applications: {
                title: "Applications of Simultaneous Equations",
                concepts: [
                    "Many real-world problems involve multiple unknowns",
                    "Simultaneous equations model relationships between quantities",
                    "Solutions must be interpreted in context",
                    "Constraints may limit valid solutions"
                ],
                realWorldApplications: {
                    economics: {
                        area: "Supply and Demand",
                        description: "Finding market equilibrium price and quantity",
                        equations: "Supply: p = a + bq, Demand: p = c - dq",
                        solution: "Equilibrium where supply equals demand"
                    },
                    business: {
                        area: "Break-even Analysis",
                        description: "Finding point where revenue equals cost",
                        equations: "Cost: C = Fixed + Variable×q, Revenue: R = Price×q",
                        solution: "Break-even quantity and revenue"
                    },
                    chemistry: {
                        area: "Solution Mixing",
                        description: "Creating desired concentration from two solutions",
                        equations: "Amount equation, Concentration equation",
                        solution: "Quantities of each solution to mix"
                    },
                    physics: {
                        area: "Motion Problems",
                        description: "Analyzing collisions or simultaneous motion",
                        equations: "Position/velocity equations for each object",
                        solution: "Time and location of meeting/collision"
                    },
                    engineering: {
                        area: "Circuit Analysis",
                        description: "Finding currents in complex circuits",
                        equations: "Kirchhoff's laws at junctions and loops",
                        solution: "Current through each component"
                    }
                }
            },

            advanced_techniques: {
                title: "Advanced Techniques for Simultaneous Equations",
                concepts: [
                    "Systems with more than 3 equations",
                    "Systems with parameters",
                    "Homogeneous systems",
                    "Iterative methods for large systems"
                ],
                techniques: {
                    parameterSystems: {
                        description: "Systems where coefficients contain parameters",
                        approach: "Solve in terms of parameter, then apply conditions",
                        consideration: "Solution type may depend on parameter values"
                    },
                    homogeneousSystems: {
                        description: "All constant terms are zero (AX = 0)",
                        properties: "Always has trivial solution (0,0,0,...)",
                        nonTrivial: "Nontrivial solutions exist if det(A) = 0"
                    },
                    underdetermined: {
                        description: "Fewer equations than unknowns",
                        result: "Infinite solutions (if consistent)",
                        approach: "Express solutions in terms of free variables"
                    },
                    overdetermined: {
                        description: "More equations than unknowns",
                        result: "Usually inconsistent or redundant",
                        approach: "Check for consistency, find best-fit solution"
                    }
                }
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
            'leq': '≤', 'geq': '≥', 'neq': '≠', 'approx': '≈',
            'infinity': '∞', 'plusminus': '±',
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'Δ',
            'pi': 'π', 'theta': 'θ', 'lambda': 'λ', 'mu': 'μ',
            'intersection': '∩', 'union': '∪', 'subset': '⊂', 'element': '∈',
            'perpendicular': '⊥', 'parallel': '∥', 'angle': '∠'
        };
    }

    initializeSimultaneousSolvers() {
        this.simultaneousTypes = {
            system_2x2_substitution: {
                patterns: [
                    /substitution.*2x2/i,
                    /2.*equation.*substitution/i
                ],
                solver: this.solveSystem2x2Substitution.bind(this),
                name: '2×2 System - Substitution Method',
                category: 'system_2x2',
                description: 'Solves 2×2 systems using substitution'
            },

            system_2x2_elimination: {
                patterns: [
                    /elimination.*2x2/i,
                    /2.*equation.*elimination/i,
                    /addition.*method/i
                ],
                solver: this.solveSystem2x2Elimination.bind(this),
                name: '2×2 System - Elimination Method',
                category: 'system_2x2',
                description: 'Solves 2×2 systems using elimination'
            },

            system_2x2_graphical: {
                patterns: [
                    /graph.*2x2/i,
                    /graphical.*method/i
                ],
                solver: this.solveSystem2x2Graphical.bind(this),
                name: '2×2 System - Graphical Method',
                category: 'system_2x2',
                description: 'Solves 2×2 systems graphically'
            },

            system_2x2_matrix: {
                patterns: [
                    /matrix.*2x2/i,
                    /cramer.*rule/i,
                    /determinant.*method/i
                ],
                solver: this.solveSystem2x2Matrix.bind(this),
                name: '2×2 System - Matrix Method',
                category: 'system_2x2',
                description: 'Solves 2×2 systems using matrices'
            },

            system_3x3: {
                patterns: [
                    /3x3.*system/i,
                    /three.*equation/i,
                    /three.*variable/i
                ],
                solver: this.solveSystem3x3.bind(this),
                name: '3×3 System of Linear Equations',
                category: 'system_3x3',
                description: 'Solves 3×3 systems'
            },

            system_word_problem: {
                patterns: [
                    /word.*problem.*system/i,
                    /application.*simultaneous/i
                ],
                solver: this.solveSystemWordProblem.bind(this),
                name: 'Word Problem with Simultaneous Equations',
                category: 'applications',
                description: 'Solves real-world problems using systems'
            },

            system_inequalities: {
                patterns: [
                    /system.*inequalit/i,
                    /linear.*programming/i
                ],
                solver: this.solveSystemInequalities.bind(this),
                name: 'System of Linear Inequalities',
                category: 'inequalities',
                description: 'Solves systems of inequalities'
            },

            system_nonlinear: {
                patterns: [
                    /nonlinear.*system/i,
                    /quadratic.*linear/i
                ],
                solver: this.solveSystemNonlinear.bind(this),
                name: 'Nonlinear System',
                category: 'nonlinear',
                description: 'Solves systems with nonlinear equations'
            }
        };
    }

    initializeErrorDatabase() {
        this.commonMistakes = {
            substitution: {
                'Solve for variable': [
                    'Not isolating variable completely',
                    'Sign errors when moving terms',
                    'Forgetting to distribute negative signs'
                ],
                'Substitute expression': [
                    'Not substituting the entire expression',
                    'Forgetting parentheses around substituted expression',
                    'Not simplifying before substituting'
                ],
                'Solve resulting equation': [
                    'Errors in combining like terms',
                    'Sign errors in arithmetic',
                    'Not simplifying completely'
                ]
            },
            elimination: {
                'Prepare equations': [
                    'Multiplying only one side of equation',
                    'Not choosing efficient multipliers',
                    'Creating same sign instead of opposite'
                ],
                'Add/subtract equations': [
                    'Sign errors when adding/subtracting',
                    'Not eliminating variable completely',
                    'Arithmetic errors'
                ],
                'Solve for variable': [
                    'Division errors',
                    'Not simplifying fractions'
                ]
            },
            matrix: {
                'Set up matrix': [
                    'Incorrect coefficient placement',
                    'Forgetting negative signs',
                    'Wrong order of equations'
                ],
                'Calculate determinant': [
                    'Wrong formula application',
                    'Sign errors',
                    'Arithmetic mistakes'
                ]
            }
        };

        this.errorPrevention = {
            substitution_parentheses: {
                reminder: 'Always use parentheses when substituting expressions',
                method: 'Write expression in parentheses before substituting'
            },
            elimination_signs: {
                reminder: 'Check signs carefully when combining equations',
                method: 'Write + or - clearly before each term'
            },
            verification: {
                reminder: 'Always verify solution in BOTH original equations',
                method: 'Substitute values and check both sides equal'
            }
        };
    }

    initializeExplanationTemplates() {
        this.explanationStyles = {
            conceptual: {
                focus: 'Understanding why the method works',
                language: 'intuitive and meaning-focused'
            },
            procedural: {
                focus: 'Step-by-step instructions',
                language: 'clear sequential directions'
            },
            visual: {
                focus: 'Graphical and geometric understanding',
                language: 'spatial and visual metaphors'
            },
            algebraic: {
                focus: 'Formal mathematical rules',
                language: 'precise mathematical terminology'
            }
        };

        this.difficultyLevels = {
            basic: {
                vocabulary: 'simple, everyday language',
                detail: 'essential steps only',
                examples: 'concrete numbers'
            },
            intermediate: {
                vocabulary: 'standard mathematical terms',
                detail: 'main steps with brief explanations',
                examples: 'mix of concrete and abstract'
            },
            detailed: {
                vocabulary: 'full mathematical vocabulary',
                detail: 'comprehensive explanations',
                examples: 'abstract and generalized'
            },
            scaffolded: {
                vocabulary: 'progressive complexity',
                detail: 'guided discovery with questions',
                examples: 'carefully sequenced progression'
            }
        };
    }

    // MAIN SOLVING METHOD
    solveSimultaneousSystem(config) {
        const { equations, method, parameters, context } = config;

        try {
            this.currentProblem = this.parseSimultaneousSystem(equations, method, parameters, context);
            this.currentSolution = this.solveSimultaneousSystem_Internal(this.currentProblem);
            this.solutionSteps = this.generateSimultaneousSteps(this.currentProblem, this.currentSolution);
            this.generateGraphData();
            this.generateWorkbook();

            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                steps: this.solutionSteps,
                graphData: this.graphData
            };

        } catch (error) {
            throw new Error(`Failed to solve simultaneous system: ${error.message}`);
        }
    }

    parseSimultaneousSystem(equations, method = null, parameters = {}, context = {}) {
        // Determine system type from equations array
        const systemSize = equations ? equations.length : (parameters.equations?.length || 2);
        
        // Auto-detect method if not specified
        if (!method) {
            method = this.autoDetectMethod(equations, systemSize, parameters);
        }

        // Parse coefficients from equations
        const parsedEquations = this.parseEquationCoefficients(equations, systemSize);

        return {
            equations: equations || [],
            systemSize: systemSize,
            method: method,
            coefficients: parsedEquations.coefficients,
            constants: parsedEquations.constants,
            parameters: { ...parameters, ...parsedEquations },
            context: { ...context },
            parsedAt: new Date().toISOString()
        };
    }

    autoDetectMethod(equations, systemSize, parameters) {
        // If method specified in parameters, use it
        if (parameters.method) return parameters.method;

        // Auto-detect based on system characteristics
        if (systemSize === 2) {
            // Check if one equation is already solved for a variable
            if (this.hasIsolatedVariable(equations)) {
                return 'system_2x2_substitution';
            }
            // Check if coefficients suggest easy elimination
            if (this.hasMatchingCoefficients(equations)) {
                return 'system_2x2_elimination';
            }
            // Default to elimination for 2x2
            return 'system_2x2_elimination';
        } else if (systemSize === 3) {
            return 'system_3x3';
        }

        return 'system_2x2_elimination';
    }

    parseEquationCoefficients(equations, systemSize) {
        if (!equations || equations.length === 0) {
            return { coefficients: [], constants: [] };
        }

        const coefficients = [];
        const constants = [];

        equations.forEach(equation => {
            const parsed = this.parseEquation(equation);
            coefficients.push(parsed.coefficients);
            constants.push(parsed.constant);
        });

        return { coefficients, constants };
    }

    parseEquation(equation) {
        // Parse equation like "2x + 3y = 7" or "x - 2y = 5"
        const cleaned = equation.replace(/\s+/g, '');
        
        // Extract coefficients for x, y, (and z for 3x3)
        const xMatch = cleaned.match(/([+-]?\d*\.?\d*)x/);
        const yMatch = cleaned.match(/([+-]?\d*\.?\d*)y/);
        const zMatch = cleaned.match(/([+-]?\d*\.?\d*)z/);
        
        // Extract constant (right side of equation)
        const parts = cleaned.split('=');
        const constant = parts.length > 1 ? parseFloat(parts[1]) : 0;

        const coefficients = [];
        
        // Parse x coefficient
        if (xMatch) {
            let coef = xMatch[1];
            if (coef === '' || coef === '+') coef = '1';
            if (coef === '-') coef = '-1';
            coefficients.push(parseFloat(coef));
        } else {
            coefficients.push(0);
        }

        // Parse y coefficient
        if (yMatch) {
            let coef = yMatch[1];
            if (coef === '' || coef === '+') coef = '1';
            if (coef === '-') coef = '-1';
            coefficients.push(parseFloat(coef));
        } else {
            coefficients.push(0);
        }

        // Parse z coefficient if present
        if (zMatch) {
            let coef = zMatch[1];
            if (coef === '' || coef === '+') coef = '1';
            if (coef === '-') coef = '-1';
            coefficients.push(parseFloat(coef));
        }

        return { coefficients, constant };
    }

    hasIsolatedVariable(equations) {
        if (!equations) return false;
        return equations.some(eq => {
            const cleaned = eq.replace(/\s+/g, '');
            return /^[xy]=/i.test(cleaned) || /=[+-]?[xy]$/i.test(cleaned);
        });
    }

    hasMatchingCoefficients(equations) {
        if (!equations || equations.length < 2) return false;
        
        const eq1 = this.parseEquation(equations[0]);
        const eq2 = this.parseEquation(equations[1]);

        // Check if any coefficients match (making elimination easier)
        return eq1.coefficients.some((coef, idx) => 
            Math.abs(coef) === Math.abs(eq2.coefficients[idx])
        );
    }

    solveSimultaneousSystem_Internal(problem) {
        const solver = this.simultaneousTypes[problem.method]?.solver;
        if (!solver) {
            // Default to elimination
            return this.solveSystem2x2Elimination(problem);
        }

        return solver(problem);
    }

    // SOLVER: 2x2 SUBSTITUTION METHOD
    solveSystem2x2Substitution(problem) {
        const { coefficients, constants } = problem;
        
        if (coefficients.length < 2) {
            throw new Error('Need at least 2 equations for 2x2 system');
        }

        const [a1, b1] = coefficients[0];
        const [a2, b2] = coefficients[1];
        const c1 = constants[0];
        const c2 = constants[1];

        // Check for special cases
        const det = a1 * b2 - a2 * b1;
        
        if (Math.abs(det) < 1e-10) {
            return this.handleSpecialCase2x2(a1, b1, c1, a2, b2, c2);
        }

        // Step 1: Solve first equation for x (or y if easier)
        // Choose variable with coefficient closest to 1 or -1
        let solveForX = Math.abs(a1) <= Math.abs(b1);
        
        let substitutionExpr, substitutionVar, solvedVar;
        
        if (solveForX) {
            // Solve for x: x = (c1 - b1*y) / a1
            substitutionExpr = { constant: c1/a1, coefficient: -b1/a1 };
            substitutionVar = 'y';
            solvedVar = 'x';
        } else {
            // Solve for y: y = (c1 - a1*x) / b1
            substitutionExpr = { constant: c1/b1, coefficient: -a1/b1 };
            substitutionVar = 'x';
            solvedVar = 'y';
        }

        // Step 2: Substitute into second equation
        let finalCoeff, finalConst;
        
        if (solveForX) {
            // Substituting x = (c1 - b1*y)/a1 into a2*x + b2*y = c2
            finalCoeff = a2 * substitutionExpr.coefficient + b2;
            finalConst = c2 - a2 * substitutionExpr.constant;
        } else {
            // Substituting y = (c1 - a1*x)/b1 into a2*x + b2*y = c2
            finalCoeff = a2 + b2 * substitutionExpr.coefficient;
            finalConst = c2 - b2 * substitutionExpr.constant;
        }

        // Step 3: Solve for the substitution variable
        const substitutionValue = finalConst / finalCoeff;

        // Step 4: Back-substitute to find the other variable
        const solvedValue = substitutionExpr.constant + substitutionExpr.coefficient * substitutionValue;

        const x = solveForX ? solvedValue : substitutionValue;
        const y = solveForX ? substitutionValue : solvedValue;

        return {
            method: 'Substitution',
            solutionType: 'Unique solution',
            x: x,
            y: y,
            solutions: [{ x, y }],
            substitutionDetails: {
                solvedVar: solvedVar,
                substitutionVar: substitutionVar,
                expression: substitutionExpr,
                firstValue: substitutionValue,
                secondValue: solvedValue
            },
            equations: [`${a1}x + ${b1}y = ${c1}`, `${a2}x + ${b2}y = ${c2}`],
            verification: this.verifySystem2x2Solution(x, y, a1, b1, c1, a2, b2, c2),
            category: 'system_2x2_substitution'
        };
    }

    // SOLVER: 2x2 ELIMINATION METHOD
    solveSystem2x2Elimination(problem) {
        const { coefficients, constants } = problem;
        
        if (coefficients.length < 2) {
            throw new Error('Need at least 2 equations for 2x2 system');
        }

        const [a1, b1] = coefficients[0];
        const [a2, b2] = coefficients[1];
        const c1 = constants[0];
        const c2 = constants[1];

        // Check for special cases
        const det = a1 * b2 - a2 * b1;
        
        if (Math.abs(det) < 1e-10) {
            return this.handleSpecialCase2x2(a1, b1, c1, a2, b2, c2);
        }

        // Determine which variable to eliminate (choose easier one)
        const xGCD = this.gcd(Math.abs(a1), Math.abs(a2));
        const yGCD = this.gcd(Math.abs(b1), Math.abs(b2));
        
        const eliminateX = xGCD >= yGCD;
        
        let mult1, mult2, eliminatedVar;
        
        if (eliminateX) {
            // Eliminate x
            mult1 = Math.abs(a2) / xGCD;
            mult2 = -Math.abs(a1) / xGCD;
            if ((a1 > 0 && a2 > 0) || (a1 < 0 && a2 < 0)) {
                mult2 = -mult2;
            }
            eliminatedVar = 'x';
        } else {
            // Eliminate y
            mult1 = Math.abs(b2) / yGCD;
            mult2 = -Math.abs(b1) / yGCD;
            if ((b1 > 0 && b2 > 0) || (b1 < 0 && b2 < 0)) {
                mult2 = -mult2;
            }
            eliminatedVar = 'y';
        }

        // Multiply equations
        const newA1 = a1 * mult1;
        const newB1 = b1 * mult1;
        const newC1 = c1 * mult1;
        
        const newA2 = a2 * mult2;
        const newB2 = b2 * mult2;
        const newC2 = c2 * mult2;

        // Add equations
        const resultA = newA1 + newA2;
        const resultB = newB1 + newB2;
        const resultC = newC1 + newC2;

        // Solve for remaining variable
        let x, y;
        
        if (eliminateX) {
            // We eliminated x, solve for y
            y = resultC / resultB;
            // Substitute back to find x
            x = (c1 - b1 * y) / a1;
        } else {
            // We eliminated y, solve for x
            x = resultC / resultA;
            // Substitute back to find y
            y = (c1 - a1 * x) / b1;
        }

        return {
            method: 'Elimination (Addition/Subtraction)',
            solutionType: 'Unique solution',
            x: x,
            y: y,
            solutions: [{ x, y }],
            eliminationDetails: {
                eliminatedVariable: eliminatedVar,
                multiplier1: mult1,
                multiplier2: mult2,
                modifiedEq1: `${newA1}x + ${newB1}y = ${newC1}`,
                modifiedEq2: `${newA2}x + ${newB2}y = ${newC2}`,
                resultantEquation: `${resultA}x + ${resultB}y = ${resultC}`
            },
            equations: [`${a1}x + ${b1}y = ${c1}`, `${a2}x + ${b2}y = ${c2}`],
            verification: this.verifySystem2x2Solution(x, y, a1, b1, c1, a2, b2, c2),
            category: 'system_2x2_elimination'
        };
    }

    // SOLVER: 2x2 GRAPHICAL METHOD
    solveSystem2x2Graphical(problem) {
        const { coefficients, constants } = problem;
        
        const [a1, b1] = coefficients[0];
        const [a2, b2] = coefficients[1];
        const c1 = constants[0];
        const c2 = constants[1];

        // Convert to slope-intercept form
        const slope1 = -a1 / b1;
        const yIntercept1 = c1 / b1;
        
        const slope2 = -a2 / b2;
        const yIntercept2 = c2 / b2;

        // Check for special cases
        const det = a1 * b2 - a2 * b1;
        
        if (Math.abs(det) < 1e-10) {
            return this.handleSpecialCase2x2(a1, b1, c1, a2, b2, c2);
        }

        // Calculate intersection point algebraically
        const x = (c1 * b2 - c2 * b1) / det;
        const y = (a1 * c2 - a2 * c1) / det;

        // Generate graph points for visualization
        const graphPoints1 = this.generateLinePoints(slope1, yIntercept1);
        const graphPoints2 = this.generateLinePoints(slope2, yIntercept2);

        return {
            method: 'Graphical',
            solutionType: 'Unique solution',
            x: x,
            y: y,
            solutions: [{ x, y }],
            graphicalDetails: {
                line1: {
                    equation: `y = ${slope1}x + ${yIntercept1}`,
                    slope: slope1,
                    yIntercept: yIntercept1,
                    points: graphPoints1
                },
                line2: {
                    equation: `y = ${slope2}x + ${yIntercept2}`,
                    slope: slope2,
                    yIntercept: yIntercept2,
                    points: graphPoints2
                },
                intersectionPoint: { x, y }
            },
            equations: [`${a1}x + ${b1}y = ${c1}`, `${a2}x + ${b2}y = ${c2}`],
            verification: this.verifySystem2x2Solution(x, y, a1, b1, c1, a2, b2, c2),
            category: 'system_2x2_graphical'
        };
    }

    // SOLVER: 2x2 MATRIX METHOD
    solveSystem2x2Matrix(problem) {
        const { coefficients, constants } = problem;
        
        const [a1, b1] = coefficients[0];
        const [a2, b2] = coefficients[1];
        const c1 = constants[0];
        const c2 = constants[1];

        // Calculate determinant
        const det = a1 * b2 - a2 * b1;

        if (Math.abs(det) < 1e-10) {
            return this.handleSpecialCase2x2(a1, b1, c1, a2, b2, c2);
        }

        // Use Cramer's Rule
        const detX = c1 * b2 - c2 * b1;
        const detY = a1 * c2 - a2 * c1;

        const x = detX / det;
        const y = detY / det;

        return {
            method: 'Matrix Method (Cramer\'s Rule)',
            solutionType: 'Unique solution',
            x: x,
            y: y,
            solutions: [{ x, y }],
            matrixDetails: {
                coefficientMatrix: [[a1, b1], [a2, b2]],
                constantVector: [c1, c2],
                determinant: det,
                determinantX: detX,
                determinantY: detY,
                cramersRuleX: `x = Dₓ/D = ${detX}/${det} = ${x}`,
                cramersRuleY: `y = Dᵧ/D = ${detY}/${det} = ${y}`
            },
            equations: [`${a1}x + ${b1}y = ${c1}`, `${a2}x + ${b2}y = ${c2}`],
            verification: this.verifySystem2x2Solution(x, y, a1, b1, c1, a2, b2, c2),
            category: 'system_2x2_matrix'
        };
    }

    // SOLVER: 3x3 SYSTEM
    solveSystem3x3(problem) {
        const { coefficients, constants } = problem;

        if (coefficients.length < 3) {
            throw new Error('Need at least 3 equations for 3x3 system');
        }

        const [a1, b1, c1] = coefficients[0];
        const [a2, b2, c2] = coefficients[1];
        const [a3, b3, c3] = coefficients[2];
        const d1 = constants[0];
        const d2 = constants[1];
        const d3 = constants[2];

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
                method: 'Gaussian Elimination (LU Decomposition)',
                solutionType: 'Unique solution',
                x: x,
                y: y,
                z: z,
                solutions: [{ x, y, z }],
                matrixDetails: {
                    coefficientMatrix: A,
                    constantVector: B,
                    determinant: math.det(A)
                },
                equations: [
                    `${a1}x + ${b1}y + ${c1}z = ${d1}`,
                    `${a2}x + ${b2}y + ${c2}z = ${d2}`,
                    `${a3}x + ${b3}y + ${c3}z = ${d3}`
                ],
                verification: this.verifySystem3x3Solution(x, y, z, A, B),
                category: 'system_3x3'
            };
        } catch (error) {
            const det = math.det(A);
            if (Math.abs(det) < 1e-10) {
                return {
                    method: 'Gaussian Elimination',
                    solutionType: 'No unique solution',
                    solutions: [],
                    determinant: det,
                    explanation: 'System is either inconsistent or has infinitely many solutions',
                    equations: [
                        `${a1}x + ${b1}y + ${c1}z = ${d1}`,
                        `${a2}x + ${b2}y + ${c2}z = ${d2}`,
                        `${a3}x + ${b3}y + ${c3}z = ${d3}`
                    ],
                    category: 'system_3x3'
                };
            }
            throw error;
        }
    }

    // SOLVER: WORD PROBLEMS
    solveSystemWordProblem(problem) {
        const { context, parameters } = problem;
        
        // This would require natural language processing to extract equations
        // For now, return a template
        return {
            method: 'Word Problem Analysis',
            problemType: context.type || 'General',
            steps: [
                'Define variables clearly',
                'Identify two independent relationships',
                'Write equations from relationships',
                'Solve system using appropriate method',
                'Interpret solution in context',
                'Verify solution makes sense'
            ],
            category: 'word_problem',
            note: 'Specific solution requires parsing word problem'
        };
    }

    // SOLVER: SYSTEM OF INEQUALITIES
    solveSystemInequalities(problem) {
        return {
            method: 'Graphical Method for Inequalities',
            steps: [
                'Convert each inequality to boundary line equation',
                'Graph each boundary line',
                'Test points to determine solution region for each',
                'Find intersection of all solution regions',
                'Identify corner points of feasible region'
            ],
            category: 'inequalities',
            note: 'Graphical representation needed for complete solution'
        };
    }

    // SOLVER: NONLINEAR SYSTEMS
    solveSystemNonlinear(problem) {
        return {
            method: 'Substitution for Nonlinear Systems',
            approach: 'Solve linear equation for one variable, substitute into nonlinear equation',
            category: 'nonlinear',
            note: 'May have multiple solutions; requires solving quadratic or higher degree equation'
        };
    }

    // HELPER: Handle special cases
    handleSpecialCase2x2(a1, b1, c1, a2, b2, c2) {
        // Check ratios
        const ratioA = a2 !== 0 ? a1 / a2 : Infinity;
        const ratioB = b2 !== 0 ? b1 / b2 : Infinity;
        const ratioC = c2 !== 0 ? c1 / c2 : Infinity;

        // Check if lines are identical (infinite solutions)
        if (Math.abs(ratioA - ratioB) < 1e-10 && Math.abs(ratioA - ratioC) < 1e-10) {
            return {
                method: 'Special Case Analysis',
                solutionType: 'Infinitely many solutions (dependent)',
                solutions: ['Infinitely many solutions'],
                explanation: 'The equations represent the same line',
                graphicalInterpretation: 'Lines coincide',
                equations: [`${a1}x + ${b1}y = ${c1}`, `${a2}x + ${b2}y = ${c2}`],
                category: 'special_case'
            };
        }

        // Check if lines are parallel (no solution)
        if (Math.abs(ratioA - ratioB) < 1e-10 && Math.abs(ratioA - ratioC) > 1e-10) {
            return {
                method: 'Special Case Analysis',
                solutionType: 'No solution (inconsistent)',
                solutions: [],
                explanation: 'The equations represent parallel lines',
                graphicalInterpretation: 'Parallel lines never intersect',
                equations: [`${a1}x + ${b1}y = ${c1}`, `${a2}x + ${b2}y = ${c2}`],
                category: 'special_case'
            };
        }

        // Shouldn't reach here, but return generic response
        return {
            method: 'Special Case',
            solutionType: 'Undetermined',
            solutions: [],
            category: 'special_case'
        };
    }

    // VERIFICATION METHODS
    verifySystem2x2Solution(x, y, a1, b1, c1, a2, b2, c2) {
        const eq1Left = a1 * x + b1 * y;
        const eq2Left = a2 * x + b2 * y;

        return {
            equation1: {
                leftSide: eq1Left,
                rightSide: c1,
                difference: Math.abs(eq1Left - c1),
                isValid: Math.abs(eq1Left - c1) < 1e-10,
                substitution: `${a1}(${x}) + ${b1}(${y}) = ${eq1Left}`
            },
            equation2: {
                leftSide: eq2Left,
                rightSide: c2,
                difference: Math.abs(eq2Left - c2),
                isValid: Math.abs(eq2Left - c2) < 1e-10,
                substitution: `${a2}(${x}) + ${b2}(${y}) = ${eq2Left}`
            },
            overallValid: Math.abs(eq1Left - c1) < 1e-10 && Math.abs(eq2Left - c2) < 1e-10
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
                difference: Math.abs(leftSide - rightSide),
                isValid: Math.abs(leftSide - rightSide) < 1e-10,
                substitution: `${row[0]}(${x}) + ${row[1]}(${y}) + ${row[2]}(${z}) = ${leftSide}`
            };
        });
    }

    // STEP GENERATION
    generateSimultaneousSteps(problem, solution) {
        const method = problem.method;
        
        let baseSteps;
        
        switch(method) {
            case 'system_2x2_substitution':
                baseSteps = this.generateSubstitutionSteps(problem, solution);
                break;
            case 'system_2x2_elimination':
                baseSteps = this.generateEliminationSteps(problem, solution);
                break;
            case 'system_2x2_graphical':
                baseSteps = this.generateGraphicalSteps(problem, solution);
                break;
            case 'system_2x2_matrix':
                baseSteps = this.generateMatrixSteps(problem, solution);
                break;
            case 'system_3x3':
                baseSteps = this.generate3x3Steps(problem, solution);
                break;
            default:
                baseSteps = this.generateGenericSystemSteps(problem, solution);
        }

        // Apply enhancements
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
                this.addErrorPrevention(step, method)
            );
        }

        if (this.explanationLevel === 'scaffolded') {
            baseSteps = this.addScaffolding(baseSteps, problem);
        }

        return baseSteps;
    }

    generateSubstitutionSteps(problem, solution) {
        const { coefficients, constants } = problem;
        const [a1, b1] = coefficients[0];
        const [a2, b2] = coefficients[1];
        const c1 = constants[0];
        const c2 = constants[1];
        const { substitutionDetails } = solution;

        const steps = [];

        // Step 1: Given system
        steps.push({
            stepNumber: 1,
            step: 'Given system of equations',
            description: 'Start with two equations in two unknowns',
            expression: `${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`,
            reasoning: 'We need to find values of x and y that satisfy both equations simultaneously',
            visualHint: 'Think of these as two lines in a plane; we\'re finding where they intersect',
            algebraicRule: 'System of linear equations in standard form',
            goalStatement: 'Find the unique point (x, y) that satisfies both equations'
        });

        // Step 2: Choose equation and variable to solve for
        const solvedVar = substitutionDetails.solvedVar;
        const substitutionVar = substitutionDetails.substitutionVar;
        
        steps.push({
            stepNumber: 2,
            step: `Solve first equation for ${solvedVar}`,
            description: `Isolate ${solvedVar} in the first equation`,
            beforeExpression: `${a1}x + ${b1}y = ${c1}`,
            reasoning: `We chose this equation because the coefficient of ${solvedVar} is ${solvedVar === 'x' ? a1 : b1}, making it relatively easy to isolate`,
            strategicChoice: `Substitution method works best when one variable can be isolated easily`,
            algebraicRule: 'Solving linear equation for one variable'
        });

        // Step 3: Express solved variable in terms of other
        const expr = substitutionDetails.expression;
        const expressionStr = solvedVar === 'x' ? 
            `x = ${expr.constant} + (${expr.coefficient})y` :
            `y = ${expr.constant} + (${expr.coefficient})x`;
        
        steps.push({
            stepNumber: 3,
            step: `Express ${solvedVar} in terms of ${substitutionVar}`,
            description: `Write ${solvedVar} as an expression containing ${substitutionVar}`,
            afterExpression: expressionStr,
            reasoning: 'This expression will be substituted into the second equation',
            visualHint: `For every value of ${substitutionVar}, we can now calculate ${solvedVar}`,
            algebraicRule: 'Variable isolation and expression rearrangement',
            criticalNote: 'This expression must be substituted AS IS into the second equation'
        });

        // Step 4: Substitute into second equation
        steps.push({
            stepNumber: 4,
            step: 'Substitute into second equation',
            description: `Replace ${solvedVar} in the second equation with the expression from step 3`,
            beforeExpression: `${a2}x + ${b2}y = ${c2}`,
            operation: `Substitute ${expressionStr}`,
            reasoning: 'This creates an equation with only one variable',
            visualHint: 'We\'re combining information from both equations',
            algebraicRule: 'Substitution property',
            criticalWarning: `IMPORTANT: Use parentheses around the substituted expression`,
            commonMistake: 'Forgetting to substitute the entire expression or omitting parentheses'
        });

        // Step 5: Simplify and solve for substitution variable
        const firstValue = substitutionDetails.firstValue;
        
        steps.push({
            stepNumber: 5,
            step: `Solve for ${substitutionVar}`,
            description: 'Simplify the equation and isolate the variable',
            afterExpression: `${substitutionVar} = ${firstValue}`,
            reasoning: 'We now have one equation in one variable, which we can solve directly',
            algebraicRule: 'Linear equation solving',
            workingDetails: {
                note: 'Combine like terms and solve using inverse operations'
            },
            numericalResult: firstValue
        });

        // Step 6: Back-substitute to find other variable
        const secondValue = substitutionDetails.secondValue;
        
        steps.push({
            stepNumber: 6,
            step: `Find ${solvedVar} by back-substitution`,
            description: `Substitute ${substitutionVar} = ${firstValue} into the expression from step 3`,
            beforeExpression: expressionStr,
            operation: `Replace ${substitutionVar} with ${firstValue}`,
            afterExpression: `${solvedVar} = ${secondValue}`,
            reasoning: 'Back-substitution gives us the value of the other variable',
            algebraicRule: 'Substitution and evaluation',
            numericalResult: secondValue
        });

        // Step 7: Write solution
        steps.push({
            stepNumber: 7,
            step: 'Write the solution',
            description: 'State the solution as an ordered pair',
            expression: `(x, y) = (${solution.x}, ${solution.y})`,
            reasoning: 'This point satisfies both original equations',
            finalAnswer: true,
            visualHint: 'This is the intersection point of the two lines'
        });

        // Step 8: Verify solution
        if (this.includeVerificationInSteps) {
            steps.push({
                stepNumber: 8,
                step: 'Verify the solution',
                description: 'Check that the solution satisfies both original equations',
                verification: solution.verification,
                reasoning: 'Verification confirms our solution is correct',
                algebraicRule: 'Solution verification by substitution'
            });
        }

        return steps;
    }

    generateEliminationSteps(problem, solution) {
        const { coefficients, constants } = problem;
        const [a1, b1] = coefficients[0];
        const [a2, b2] = coefficients[1];
        const c1 = constants[0];
        const c2 = constants[1];
        const { eliminationDetails } = solution;

        const steps = [];

        // Step 1: Given system
        steps.push({
            stepNumber: 1,
            step: 'Given system of equations',
            description: 'Start with two equations in two unknowns',
            expression: `Equation 1: ${a1}x + ${b1}y = ${c1}\nEquation 2: ${a2}x + ${b2}y = ${c2}`,
            reasoning: 'We will eliminate one variable by combining the equations',
            visualHint: 'The elimination method adds or subtracts equations to cancel out one variable',
            algebraicRule: 'System of linear equations',
            goalStatement: 'Eliminate one variable to solve for the other'
        });

        // Step 2: Analyze coefficients and choose variable to eliminate
        const eliminatedVar = eliminationDetails.eliminatedVariable;
        const keptVar = eliminatedVar === 'x' ? 'y' : 'x';
        
        steps.push({
            stepNumber: 2,
            step: `Choose to eliminate ${eliminatedVar}`,
            description: `Analyze coefficients and decide to eliminate ${eliminatedVar}`,
            reasoning: `The coefficients of ${eliminatedVar} are ${eliminatedVar === 'x' ? a1 + ' and ' + a2 : b1 + ' and ' + b2}, which can be made opposites efficiently`,
            strategicChoice: 'Choose the variable with coefficients that are easier to work with',
            algebraicRule: 'Strategic variable elimination choice',
            conceptualNote: 'We want to create opposite coefficients so they cancel when equations are added'
        });

        // Step 3: Determine multipliers
        const mult1 = eliminationDetails.multiplier1;
        const mult2 = eliminationDetails.multiplier2;
        
        steps.push({
            stepNumber: 3,
            step: 'Determine multipliers',
            description: `Find multipliers to create opposite coefficients for ${eliminatedVar}`,
            expression: `Multiply Equation 1 by ${mult1}\nMultiply Equation 2 by ${mult2}`,
            reasoning: `These multipliers will make the coefficients of ${eliminatedVar} opposites`,
            visualHint: 'Think of scaling equations while maintaining their truth',
            algebraicRule: 'Multiplication property of equality',
            criticalWarning: 'IMPORTANT: Multiply ALL terms in the equation, not just one side'
        });

        // Step 4: Multiply equations
        const modEq1 = eliminationDetails.modifiedEq1;
        const modEq2 = eliminationDetails.modifiedEq2;
        
        steps.push({
            stepNumber: 4,
            step: 'Multiply equations by their multipliers',
            description: 'Apply the multipliers to each term in both equations',
            beforeExpression: `Eq 1: ${a1}x + ${b1}y = ${c1}\nEq 2: ${a2}x + ${b2}y = ${c2}`,
            operation: `Multiply by ${mult1} and ${mult2} respectively`,
            afterExpression: `Modified Eq 1: ${modEq1}\nModified Eq 2: ${modEq2}`,
            reasoning: 'The modified equations are equivalent to the originals',
            algebraicRule: 'Scalar multiplication of equations',
            workingDetails: {
                equation1: `${mult1}(${a1}x + ${b1}y) = ${mult1}(${c1})`,
                equation2: `${mult2}(${a2}x + ${b2}y) = ${mult2}(${c2})`
            }
        });

        // Step 5: Add equations to eliminate variable
        const resultEq = eliminationDetails.resultantEquation;
        
        steps.push({
            stepNumber: 5,
            step: `Add equations to eliminate ${eliminatedVar}`,
            description: `Add the two modified equations term by term`,
            beforeExpression: `${modEq1}\n+ ${modEq2}`,
            afterExpression: resultEq,
            reasoning: `The ${eliminatedVar} terms cancel out, leaving an equation in ${keptVar} only`,
            visualHint: `The coefficients of ${eliminatedVar} are opposites, so they sum to zero`,
            algebraicRule: 'Addition property of equality',
            criticalWarning: 'Watch signs carefully when adding terms',
            commonMistake: 'Sign errors when combining positive and negative terms'
        });

        // Step 6: Solve for remaining variable
        const firstVar = keptVar;
        const firstValue = keptVar === 'x' ? solution.x : solution.y;
        
        steps.push({
            stepNumber: 6,
            step: `Solve for ${firstVar}`,
            description: `Isolate ${firstVar} in the resulting equation`,
            beforeExpression: resultEq,
            afterExpression: `${firstVar} = ${firstValue}`,
            reasoning: 'This is now a simple linear equation in one variable',
            algebraicRule: 'Linear equation solving',
            numericalResult: firstValue
        });

        // Step 7: Back-substitute to find eliminated variable
        const secondVar = eliminatedVar;
        const secondValue = eliminatedVar === 'x' ? solution.x : solution.y;
        
        steps.push({
            stepNumber: 7,
            step: `Find ${secondVar} by substitution`,
            description: `Substitute ${firstVar} = ${firstValue} into one of the original equations`,
            beforeExpression: `${a1}x + ${b1}y = ${c1}`,
            operation: `Replace ${firstVar} with ${firstValue}`,
            afterExpression: `${secondVar} = ${secondValue}`,
            reasoning: 'Substituting into either original equation gives the other variable',
            algebraicRule: 'Back-substitution',
            numericalResult: secondValue
        });

        // Step 8: Write solution
        steps.push({
            stepNumber: 8,
            step: 'Write the solution',
            description: 'State the complete solution as an ordered pair',
            expression: `(x, y) = (${solution.x}, ${solution.y})`,
            reasoning: 'This ordered pair satisfies both original equations',
            finalAnswer: true,
            visualHint: 'This represents the intersection point of the two lines'
        });

        // Step 9: Verify solution
        if (this.includeVerificationInSteps) {
            steps.push({
                stepNumber: 9,
                step: 'Verify the solution',
                description: 'Check the solution in both original equations',
                verification: solution.verification,
                reasoning: 'Verification ensures we haven\'t made any errors',
                algebraicRule: 'Solution verification'
            });
        }

        return steps;
    }

    generateGraphicalSteps(problem, solution) {
        const { coefficients, constants } = problem;
        const [a1, b1] = coefficients[0];
        const [a2, b2] = coefficients[1];
        const c1 = constants[0];
        const c2 = constants[1];
        const { graphicalDetails } = solution;

        const steps = [];

        // Step 1: Given system
        steps.push({
            stepNumber: 1,
            step: 'Given system of equations',
            description: 'Two linear equations to solve graphically',
            expression: `${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`,
            reasoning: 'Each equation represents a line; solution is where they intersect',
            visualHint: 'We will graph both lines and find their intersection point',
            goalStatement: 'Find the intersection point by graphing'
        });

        // Step 2: Convert first equation to slope-intercept form
        const line1 = graphicalDetails.line1;
        
        steps.push({
            stepNumber: 2,
            step: 'Convert first equation to y = mx + b form',
            description: 'Solve the first equation for y',
            beforeExpression: `${a1}x + ${b1}y = ${c1}`,
            afterExpression: line1.equation,
            reasoning: 'Slope-intercept form makes it easy to graph the line',
            workingDetails: {
                slope: `m₁ = ${line1.slope}`,
                yIntercept: `b₁ = ${line1.yIntercept}`
            },
            algebraicRule: 'Converting to slope-intercept form'
        });

        // Step 3: Convert second equation to slope-intercept form
        const line2 = graphicalDetails.line2;
        
        steps.push({
            stepNumber: 3,
            step: 'Convert second equation to y = mx + b form',
            description: 'Solve the second equation for y',
            beforeExpression: `${a2}x + ${b2}y = ${c2}`,
            afterExpression: line2.equation,
            reasoning: 'Now both equations are in graphing form',
            workingDetails: {
                slope: `m₂ = ${line2.slope}`,
                yIntercept: `b₂ = ${line2.yIntercept}`
            },
            algebraicRule: 'Converting to slope-intercept form'
        });

        // Step 4: Graph first line
        steps.push({
            stepNumber: 4,
            step: 'Graph the first line',
            description: `Plot line with slope ${line1.slope} and y-intercept ${line1.yIntercept}`,
            reasoning: 'Start at y-intercept, use slope to find other points',
            visualHint: `Start at (0, ${line1.yIntercept}), then rise/run according to slope`,
            graphingTechnique: 'Plot y-intercept, then use slope to find more points'
        });

        // Step 5: Graph second line
        steps.push({
            stepNumber: 5,
            step: 'Graph the second line',
            description: `Plot line with slope ${line2.slope} and y-intercept ${line2.yIntercept}`,
            reasoning: 'Graph the second line on the same coordinate plane',
            visualHint: `Start at (0, ${line2.yIntercept}), then rise/run according to slope`,
            graphingTechnique: 'Use same method as for first line'
        });

        // Step 6: Identify intersection point
        steps.push({
            stepNumber: 6,
            step: 'Identify intersection point',
            description: 'Find where the two lines cross',
            expression: `Intersection point: (${solution.x}, ${solution.y})`,
            reasoning: 'This point lies on both lines, so it satisfies both equations',
            finalAnswer: true,
            visualHint: 'The intersection point is the solution to the system',
            graphicalInterpretation: 'Where the lines meet is the solution'
        });

        // Step 7: Verify algebraically
        if (this.includeVerificationInSteps) {
            steps.push({
                stepNumber: 7,
                step: 'Verify algebraically',
                description: 'Confirm the graphical solution by substitution',
                verification: solution.verification,
                reasoning: 'Algebraic verification confirms the accuracy of the graphical solution',
                note: 'Graphical solutions may have limited precision for non-integer values'
            });
        }

        return steps;
    }

    generateMatrixSteps(problem, solution) {
        const { coefficients, constants } = problem;
        const [a1, b1] = coefficients[0];
        const [a2, b2] = coefficients[1];
        const c1 = constants[0];
        const c2 = constants[1];
        const { matrixDetails } = solution;

        const steps = [];

        // Step 1: Given system
        steps.push({
            stepNumber: 1,
            step: 'Given system of equations',
            description: 'System to solve using matrix methods',
            expression: `${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`,
            reasoning: 'Matrix methods provide a systematic approach for solving systems',
            goalStatement: 'Use Cramer\'s Rule with determinants to find the solution'
        });

        // Step 2: Set up coefficient matrix and constant vector
        steps.push({
            stepNumber: 2,
            step: 'Set up matrices',
            description: 'Identify coefficient matrix A and constant vector B',
            expression: `A = [${a1}  ${b1}]\n    [${a2}  ${b2}]\n\nB = [${c1}]\n    [${c2}]`,
            reasoning: 'The system can be written as AX = B, where X = [x, y]ᵀ',
            algebraicRule: 'Matrix representation of linear systems',
            conceptualNote: 'Coefficients form matrix A, constants form vector B'
        });

        // Step 3: Calculate determinant of A
        const det = matrixDetails.determinant;
        
        steps.push({
            stepNumber: 3,
            step: 'Calculate determinant of coefficient matrix',
            description: 'Find det(A) using the 2×2 determinant formula',
            expression: `det(A) = a₁b₂ - a₂b₁`,
            workingDetails: {
                formula: `det(A) = (${a1})(${b2}) - (${a2})(${b1})`,
                calculation: `det(A) = ${a1 * b2} - ${a2 * b1} = ${det}`
            },
            afterExpression: `det(A) = ${det}`,
            reasoning: 'Non-zero determinant means the system has a unique solution',
            algebraicRule: 'Determinant of 2×2 matrix',
            criticalNote: 'If det(A) = 0, the system has no unique solution'
        });

        // Step 4: Set up matrix for x using Cramer's Rule
        const detX = matrixDetails.determinantX;
        
        steps.push({
            stepNumber: 4,
            step: 'Set up determinant for x (Dₓ)',
            description: 'Replace first column of A with constant vector B',
            expression: `Dₓ = [${c1}  ${b1}]\n     [${c2}  ${b2}]`,
            workingDetails: {
                calculation: `Dₓ = (${c1})(${b2}) - (${c2})(${b1}) = ${detX}`
            },
            reasoning: 'Cramer\'s Rule: replace x-column with constants to find x',
            algebraicRule: 'Cramer\'s Rule for x-coordinate'
        });

        // Step 5: Calculate x
        steps.push({
            stepNumber: 5,
            step: 'Calculate x',
            description: 'Use Cramer\'s Rule: x = Dₓ/det(A)',
            expression: matrixDetails.cramersRuleX,
            afterExpression: `x = ${solution.x}`,
            reasoning: 'Dividing the modified determinant by the original gives x',
            numericalResult: solution.x
        });

        // Step 6: Set up matrix for y using Cramer's Rule
        const detY = matrixDetails.determinantY;
        
        steps.push({
            stepNumber: 6,
            step: 'Set up determinant for y (Dᵧ)',
            description: 'Replace second column of A with constant vector B',
            expression: `Dᵧ = [${a1}  ${c1}]\n     [${a2}  ${c2}]`,
            workingDetails: {
                calculation: `Dᵧ = (${a1})(${c2}) - (${a2})(${c1}) = ${detY}`
            },
            reasoning: 'Cramer\'s Rule: replace y-column with constants to find y',
            algebraicRule: 'Cramer\'s Rule for y-coordinate'
        });

        // Step 7: Calculate y
        steps.push({
            stepNumber: 7,
            step: 'Calculate y',
            description: 'Use Cramer\'s Rule: y = Dᵧ/det(A)',
            expression: matrixDetails.cramersRuleY,
            afterExpression: `y = ${solution.y}`,
            reasoning: 'Dividing the modified determinant by the original gives y',
            numericalResult: solution.y
        });

        // Step 8: Write solution
        steps.push({
            stepNumber: 8,
            step: 'Write the solution',
            description: 'State the solution vector',
            expression: `X = [x] = [${solution.x}]\n    [y]   [${solution.y}]`,
            reasoning: 'The solution vector X satisfies AX = B',
            finalAnswer: true
        });

        // Step 9: Verify solution
        if (this.includeVerificationInSteps) {
            steps.push({
                stepNumber: 9,
                step: 'Verify the solution',
                description: 'Check that AX = B',
                verification: solution.verification,
                reasoning: 'Matrix multiplication confirms our solution',
                algebraicRule: 'Solution verification using matrix multiplication'
            });
        }

        return steps;
    }

    generate3x3Steps(problem, solution) {
        const { coefficients, constants } = problem;
        const steps = [];

        // Step 1: Given system
        steps.push({
            stepNumber: 1,
            step: 'Given 3×3 system of equations',
            description: 'Three equations with three unknowns',
            expression: solution.equations.join('\n'),
            reasoning: 'We need to find x, y, and z that satisfy all three equations',
            goalStatement: 'Use systematic elimination or matrix methods',
            visualHint: 'Think of three planes intersecting at a point in 3D space'
        });

        // Step 2: Set up matrix form
        steps.push({
            stepNumber: 2,
            step: 'Set up augmented matrix',
            description: 'Represent the system as [A|B]',
            expression: 'Augmented matrix: [Coefficient Matrix | Constants]',
            reasoning: 'Matrix form allows systematic row operations',
            algebraicRule: 'Matrix representation of 3×3 systems'
        });

        // Step 3: Gaussian elimination overview
        steps.push({
            stepNumber: 3,
            step: 'Apply Gaussian elimination',
            description: 'Use row operations to get upper triangular form',
            reasoning: 'Row operations simplify the system while preserving solutions',
            method: 'Eliminate variables systematically from bottom to top',
            algebraicRule: 'Elementary row operations'
        });

        // Step 4: Back substitution
        steps.push({
            stepNumber: 4,
            step: 'Back-substitute to find solutions',
            description: 'Work backwards from last equation to find all variables',
            reasoning: 'Once in triangular form, solve from bottom equation upward',
            algebraicRule: 'Back-substitution method'
        });

        // Step 5: Solution
        if (solution.solutionType === 'Unique solution') {
            steps.push({
                stepNumber: 5,
                step: 'Write the solution',
                description: 'State the solution as an ordered triple',
                expression: `(x, y, z) = (${solution.x}, ${solution.y}, ${solution.z})`,
                reasoning: 'This triple satisfies all three original equations',
                finalAnswer: true
            });

            // Step 6: Verify
            if (this.includeVerificationInSteps) {
                steps.push({
                    stepNumber: 6,
                    step: 'Verify the solution',
                    description: 'Check in all three original equations',
                    verification: solution.verification,
                    reasoning: 'All three equations must be satisfied',
                    algebraicRule: 'Complete verification for 3×3 systems'
                });
            }
        } else {
            steps.push({
                stepNumber: 5,
                step: 'Analyze result',
                description: 'System has no unique solution',
                expression: solution.solutionType,
                reasoning: solution.explanation,
                note: 'Determinant of coefficient matrix is zero'
            });
        }

        return steps;
    }

    generateGenericSystemSteps(problem, solution) {
        return [{
            stepNumber: 1,
            step: 'Simultaneous equations problem',
            description: 'Solve the system of equations',
            expression: problem.equations?.join('\n') || 'System not fully specified',
            reasoning: 'Apply appropriate method based on system characteristics',
            solution: solution
        }];
    }

    // HELPER METHODS FROM ORIGINAL CODE
    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a === 0 ? 1 : a;
    }

    generateLinePoints(slope, yIntercept) {
        const points = [];
        for (let x = -10; x <= 10; x += 0.5) {
            points.push({ x: x, y: slope * x + yIntercept });
        }
        return points;
    }

    // ENHANCE STEP EXPLANATION (similar to linear workbook)
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
                prerequisiteSkills: this.identifyPrerequisites(step, problem.method),
                keyVocabulary: this.identifyKeyVocabulary(step),
                connectionsToPrevious: stepIndex > 0 ? this.connectToPreviousStep(step, stepIndex) : null
            }
        };

        return enhanced;
    }

    getConceptualExplanation(step, problem) {
        const conceptualMap = {
            'Given system of equations': 'We start with multiple equations that must all be true at the same time. Our goal is to find the specific values that work in every equation.',
            'Solve first equation for': 'We\'re isolating one variable to express it in terms of another. This lets us replace it in other equations.',
            'Choose to eliminate': 'By strategically combining equations, we can make one variable disappear, simplifying our problem.',
            'Determine multipliers': 'We scale the equations so that one variable will cancel when we combine them.',
            'Add equations to eliminate': 'When we add equations with opposite coefficients, that variable cancels out completely.',
            'Convert to slope-intercept form': 'This form y = mx + b makes it easy to see the line\'s steepness and starting point.',
            'Calculate determinant': 'The determinant tells us if the system has a unique solution. Zero means no unique solution exists.'
        };

        for (const [key, explanation] of Object.entries(conceptualMap)) {
            if (step.step.includes(key)) {
                return explanation;
            }
        }

        return 'This step moves us closer to finding the values that satisfy all equations.';
    }

    getProceduralExplanation(step) {
        if (step.operation) {
            return `1. Identify what needs to be done: ${step.operation}
2. Apply the operation carefully to all relevant terms
3. Simplify the result
4. Check that the step was performed correctly`;
        }
        return 'Follow the systematic procedure for this type of step.';
    }

    getVisualExplanation(step, problem) {
        const visualMap = {
            'system_2x2_substitution': 'Imagine sliding one equation into another, reducing two constraints to one.',
            'system_2x2_elimination': 'Picture two equations as weights on a balance scale. We adjust and combine them to eliminate one weight type.',
            'system_2x2_graphical': 'Each equation is a line. The solution is where the lines cross - the one point that\'s on both lines.',
            'system_2x2_matrix': 'Think of the system as a transformation. The determinant tells us if we can reverse it to find the original values.',
            'system_3x3': 'Visualize three planes in 3D space. The solution is where all three planes meet at a single point.'
        };

        return visualMap[problem.method] || 'Visualize maintaining balance and equivalence through each transformation.';
    }

    getAlgebraicExplanation(step) {
        const algebraicMap = {
            'Given system of equations': 'Set of simultaneous linear equations forming a system',
            'Solve first equation for': 'Application of inverse operations to isolate a variable',
            'Substitute into second equation': 'Substitution property: replacing variable with equivalent expression',
            'Choose to eliminate': 'Strategic application of linear combinations',
            'Multiply equations': 'Scalar multiplication property: multiplying both sides by constant',
            'Add equations to eliminate': 'Addition property of equality with strategic cancellation',
            'Convert to slope-intercept form': 'Algebraic manipulation to standard form y = mx + b',
            'Calculate determinant': 'Determinant formula for 2×2 matrix: ad - bc',
            'Back-substitute': 'Substitution of known value to find remaining unknowns'
        };

        for (const [key, explanation] of Object.entries(algebraicMap)) {
            if (step.step.includes(key)) {
                return explanation;
            }
        }

        return 'Standard algebraic manipulation following field axioms and equality properties.';
    }

    getAdaptiveExplanation(step, explanationLevel) {
        const adaptations = {
            basic: {
                vocabulary: 'simple terms',
                detail: 'key steps only',
                format: 'short, clear sentences'
            },
            intermediate: {
                vocabulary: 'standard math terms',
                detail: 'main steps with reasons',
                format: 'step-by-step with explanations'
            },
            detailed: {
                vocabulary: 'full mathematical terminology',
                detail: 'comprehensive analysis',
                format: 'thorough explanation with theory'
            },
            scaffolded: {
                vocabulary: 'progressive complexity',
                detail: 'guided questions and hints',
                format: 'discovery-based learning'
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

        const replacements = {
            basic: {
                'isolate': 'get by itself',
                'coefficient': 'number in front',
                'substitute': 'replace',
                'eliminate': 'remove',
                'determinant': 'special calculation',
                'back-substitute': 'plug back in'
            },
            intermediate: {
                'isolate': 'isolate',
                'coefficient': 'coefficient',
                'substitute': 'substitute',
                'eliminate': 'eliminate',
                'determinant': 'determinant',
                'back-substitute': 'back-substitute'
            },
            detailed: {
                'isolate': 'isolate (algebraically separate the variable)',
                'coefficient': 'coefficient (multiplicative constant)',
                'substitute': 'substitute (replace with equivalent expression)',
                'eliminate': 'eliminate (systematically remove variable)',
                'determinant': 'determinant (scalar value from square matrix)',
                'back-substitute': 'back-substitute (reverse substitution process)'
            }
        };

        const levelReplacements = replacements[level.vocabulary] || replacements.intermediate;
        let adaptedText = text;

        for (const [term, replacement] of Object.entries(levelReplacements)) {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            adaptedText = adaptedText.replace(regex, replacement);
        }

        return adaptedText;
    }


    identifyPrerequisites(step, method) {
        const prerequisites = {
            'Solve first equation for': ['Linear equation solving', 'Variable isolation', 'Inverse operations'],
            'Substitute into second equation': ['Substitution concept', 'Expression evaluation', 'Parentheses use'],
            'Choose to eliminate': ['Understanding of opposites', 'Coefficient comparison', 'LCM/GCD concepts'],
            'Multiply equations': ['Multiplication of equations', 'Distributive property', 'Maintaining equality'],
            'Add equations to eliminate': ['Addition of expressions', 'Like term combination', 'Sign rules'],
            'Calculate determinant': ['Matrix notation', 'Determinant formula', 'Cross-multiplication'],
            'Convert to slope-intercept form': ['Solving for y', 'Slope concept', 'Y-intercept concept']
        };

        return prerequisites[step.step] || ['Basic algebraic operations', 'Understanding of equations'];
    }

    identifyKeyVocabulary(step) {
        const vocabulary = {
            'Given system of equations': ['system', 'simultaneous', 'equations', 'unknowns', 'solution'],
            'Solve first equation for': ['isolate', 'solve for', 'variable', 'coefficient'],
            'Substitute into second equation': ['substitute', 'replace', 'expression', 'parentheses'],
            'Choose to eliminate': ['eliminate', 'cancel', 'opposite coefficients', 'linear combination'],
            'Add equations to eliminate': ['add', 'combine', 'cancel out', 'elimination'],
            'Calculate determinant': ['determinant', 'matrix', 'unique solution', 'non-zero'],
            'Graph both lines': ['graph', 'line', 'intersection', 'coordinate plane']
        };

        return vocabulary[step.step] || ['equation', 'solution', 'variable'];
    }

    connectToPreviousStep(step, stepIndex) {
        return {
            connection: `This step builds on step ${stepIndex} by continuing the solution process`,
            progression: 'We are systematically reducing the number of variables',
            relationship: 'Each step brings us closer to isolating the variables and finding the solution'
        };
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

    generateStepBridge(currentStep, nextStep) {
        return {
            currentState: `We now have: ${currentStep.afterExpression || currentStep.expression}`,
            nextGoal: `Next, we need to: ${nextStep.description}`,
            why: `This is necessary because we need to ${this.explainStepNecessity(currentStep, nextStep)}`,
            howItHelps: `This will help us by ${this.explainStepBenefit(nextStep)}`
        };
    }

    explainStepProgression(currentStep, nextStep) {
        return `After ${currentStep.step}, we transition to ${nextStep.step} to continue solving the system`;
    }

    explainStepStrategy(nextStep) {
        return `The strategy for "${nextStep.step}" is to ${nextStep.description?.toLowerCase() || 'proceed with the solution'}`;
    }

    explainStepNecessity(currentStep, nextStep) {
        return 'further simplify the system and move toward finding all variable values';
    }

    explainStepBenefit(nextStep) {
        return 'reducing the complexity of the system and isolating variables';
    }

    addErrorPrevention(step, method) {
        const methodKey = method.includes('substitution') ? 'substitution' : 
                         method.includes('elimination') ? 'elimination' : 
                         method.includes('matrix') ? 'matrix' : 'general';
        
        const mistakes = this.commonMistakes[methodKey]?.[step.step] || [];

        return {
            ...step,
            errorPrevention: {
                commonMistakes: mistakes,
                preventionTips: this.generatePreventionTips(step, method),
                checkPoints: this.generateCheckPoints(step),
                warningFlags: this.identifyWarningFlags(step, method)
            },
            validation: {
                selfCheck: this.generateSelfCheckQuestion(step),
                expectedResult: this.describeExpectedResult(step),
                troubleshooting: this.generateTroubleshootingTips(step)
            }
        };
    }

    generatePreventionTips(step, method) {
        const tips = {
            'Substitute into second equation': [
                'Always use parentheses around the substituted expression',
                'Distribute carefully if multiplying by a coefficient',
                'Double-check signs when substituting negative expressions'
            ],
            'Multiply equations': [
                'Multiply EVERY term in the equation, including the constant',
                'Keep track of signs when multiplying by negative numbers',
                'Verify that opposite coefficients are created'
            ],
            'Add equations to eliminate': [
                'Line up terms vertically before adding',
                'Check signs carefully - opposite coefficients should cancel',
                'Verify that the target variable is truly eliminated'
            ]
        };

        return tips[step.step] || ['Double-check your work', 'Verify each algebraic manipulation'];
    }

    generateCheckPoints(step) {
        return [
            'Did I apply operations correctly to both sides?',
            'Are my signs correct?',
            'Does this step move me toward the solution?',
            'Can I verify this step makes sense?'
        ];
    }

    identifyWarningFlags(step, method) {
        const warnings = {
            'Substitute into second equation': ['Missing parentheses around substituted expression'],
            'Multiply equations': ['Forgetting to multiply all terms', 'Sign errors with negative multipliers'],
            'Add equations to eliminate': ['Sign errors when combining', 'Variable not actually eliminated'],
            'Calculate determinant': ['Arithmetic errors', 'Sign mistakes in calculation']
        };

        return warnings[step.step] || [];
    }

    generateSelfCheckQuestion(step) {
        const questions = {
            'Solve first equation for': 'Did I isolate the variable correctly?',
            'Substitute into second equation': 'Did I use parentheses and substitute the entire expression?',
            'Multiply equations': 'Did I multiply every term, including the constant?',
            'Add equations to eliminate': 'Did the target variable actually cancel out?',
            'Calculate determinant': 'Did I apply the determinant formula correctly?'
        };

        return questions[step.step] || 'Does this step make sense and bring me closer to the solution?';
    }

    describeExpectedResult(step) {
        const expectations = {
            'Solve first equation for': 'One variable should be isolated and expressed in terms of the other',
            'Substitute into second equation': 'Should have one equation with only one variable',
            'Multiply equations': 'Target variable should have opposite coefficients in the two equations',
            'Add equations to eliminate': 'One variable should be completely eliminated',
            'Calculate determinant': 'Should get a non-zero number if unique solution exists',
            'Back-substitute': 'Should find the value of the second variable'
        };

        return expectations[step.step] || 'The step should simplify the system';
    }

    generateTroubleshootingTips(step) {
        return [
            'If stuck, review the previous step carefully',
            'Check for arithmetic errors',
            'Verify all operations were applied to both sides',
            'Consider if there\'s a simpler approach',
            'Make sure parentheses are used correctly'
        ];
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

    generateGuidingQuestions(step, problem) {
        const questions = {
            'Given system of equations': [
                'How many equations do we have?',
                'How many unknowns are there?',
                'What methods could we use to solve this system?',
                'What does the solution represent geometrically?'
            ],
            'Solve first equation for': [
                'Which variable has the simplest coefficient?',
                'What operations do we need to isolate this variable?',
                'How do we express one variable in terms of another?'
            ],
            'Substitute into second equation': [
                'What expression are we substituting?',
                'Where does it go in the second equation?',
                'Why must we use parentheses?',
                'What variable will remain after substitution?'
            ],
            'Choose to eliminate': [
                'Which variable has easier coefficients to work with?',
                'What do we need to do to make coefficients opposite?',
                'Which elimination would require smaller multipliers?'
            ],
            'Multiply equations': [
                'What multipliers create opposite coefficients?',
                'Must we multiply every term?',
                'What happens to the signs?',
                'How do we verify we did this correctly?'
            ],
            'Add equations to eliminate': [
                'Which terms will cancel out?',
                'How do we add the remaining terms?',
                'What equation results from this addition?'
            ],
            'Convert to slope-intercept form': [
                'How do we solve for y?',
                'What is the slope of each line?',
                'What is the y-intercept of each line?'
            ],
            'Calculate determinant': [
                'What is the determinant formula for 2×2?',
                'What does a non-zero determinant tell us?',
                'What if the determinant equals zero?'
            ]
        };

        return questions[step.step] || [
            'What is the goal of this step?',
            'How does this step simplify the problem?',
            'What should we watch out for?'
        ];
    }

    breakIntoSubSteps(step) {
        const subSteps = {
            'Substitute into second equation': [
                'Identify the expression to substitute',
                'Locate where it goes in the second equation',
                'Write the expression in parentheses',
                'Replace the variable with the parenthesized expression',
                'Simplify by distributing if necessary',
                'Combine like terms'
            ],
            'Multiply equations': [
                'Identify the multiplier needed',
                'Multiply the first term (x term)',
                'Multiply the second term (y term)',
                'Multiply the constant term',
                'Write the complete modified equation',
                'Verify opposite coefficients are created'
            ],
            'Add equations to eliminate': [
                'Write equations vertically aligned',
                'Add the x terms (should cancel if eliminating x)',
                'Add the y terms (should cancel if eliminating y)',
                'Add the constant terms',
                'Write the resulting equation',
                'Verify the target variable is eliminated'
            ]
        };

        return subSteps[step.step] || [
            'Identify what needs to be done',
            'Perform the operation carefully',
            'Check the result',
            'Write the new equation'
        ];
    }

    generateProgressiveHints(step) {
        const hints = {
            'Substitute into second equation': {
                level1: 'Think about replacing one variable with an expression.',
                level2: 'Remember to use parentheses around the entire expression you\'re substituting.',
                level3: 'The expression from step 1 should go exactly where the variable appears.',
                level4: 'Write: second equation with variable replaced by (expression)'
            },
            'Multiply equations': {
                level1: 'Think about what number would make the coefficients opposite.',
                level2: 'Remember to multiply EVERY term in the equation.',
                level3: 'Use the LCM or a simple multiple to create opposite coefficients.',
                level4: 'Multiply: multiply each term including the constant on the right side'
            },
            'Add equations to eliminate': {
                level1: 'When you add, opposite terms should cancel.',
                level2: 'Line up the terms vertically before adding.',
                level3: 'Add term by term: x-terms together, y-terms together, constants together.',
                level4: 'The target variable should disappear completely.'
            }
        };

        return hints[step.step] || {
            level1: 'Think about what this step is trying to accomplish.',
            level2: 'Consider the properties of equality.',
            level3: 'Remember to perform operations on both sides.',
            level4: 'Apply the appropriate algebraic rule.'
        };
    }

    generatePracticeVariation(step, problem) {
        return {
            similarProblem: 'Try a similar system with different numbers',
            practiceHint: 'Practice this step type with simpler coefficients first',
            extension: 'Once confident, try systems with fractions or larger numbers'
        };
    }

    explainThinkingProcess(step) {
        return {
            observe: 'What do I see in the current system?',
            goal: 'What am I trying to achieve in this step?',
            strategy: 'What method or operation will help?',
            execute: 'How do I apply this correctly?',
            verify: 'Does my result make sense?'
        };
    }

    identifyDecisionPoints(step) {
        const decisions = {
            'Choose to eliminate': [
                'Which variable to eliminate (x or y)?',
                'What multipliers to use?',
                'Should I add or subtract equations?'
            ],
            'Solve first equation for': [
                'Which variable to solve for?',
                'Which equation to use?',
                'What operations are needed?'
            ],
            'Convert to slope-intercept form': [
                'How to isolate y?',
                'How to identify slope and intercept?'
            ]
        };

        return decisions[step.step] || [
            'What is the best approach?',
            'What operations are needed?',
            'How to verify correctness?'
        ];
    }

    suggestAlternativeMethods(step, problem) {
        const alternatives = {
            'system_2x2': [
                'Could use substitution instead of elimination',
                'Could use graphical method for visual understanding',
                'Could use matrix methods (Cramer\'s Rule)',
                'Could use augmented matrix and row reduction'
            ]
        };

        const methodAlternatives = alternatives['system_2x2'] || [];
        
        return {
            currentMethod: problem.method,
            alternatives: methodAlternatives,
            note: 'All methods should give the same answer; choice depends on the specific system'
        };
    }

    // GRAPH DATA GENERATION
    generateGraphData() {
        if (!this.currentSolution || !this.currentProblem) return;

        const { method } = this.currentProblem;

        if (method === 'system_2x2_graphical' || this.currentProblem.systemSize === 2) {
            this.graphData = this.generate2x2GraphData();
        }
    }

    generate2x2GraphData() {
        const { coefficients, constants } = this.currentProblem;
        
        if (!coefficients || coefficients.length < 2) return null;

        const [a1, b1] = coefficients[0];
        const [a2, b2] = coefficients[1];
        const c1 = constants[0];
        const c2 = constants[1];

        // Convert to slope-intercept form
        const line1 = {
            slope: -a1 / b1,
            yIntercept: c1 / b1,
            equation: `y = ${(-a1/b1).toFixed(2)}x + ${(c1/b1).toFixed(2)}`,
            points: this.generateLinePoints(-a1/b1, c1/b1)
        };

        const line2 = {
            slope: -a2 / b2,
            yIntercept: c2 / b2,
            equation: `y = ${(-a2/b2).toFixed(2)}x + ${(c2/b2).toFixed(2)}`,
            points: this.generateLinePoints(-a2/b2, c2/b2)
        };

        return {
            type: 'system_2x2',
            line1: line1,
            line2: line2,
            intersection: this.currentSolution.solutionType === 'Unique solution' ? 
                { x: this.currentSolution.x, y: this.currentSolution.y } : null,
            solutionType: this.currentSolution.solutionType
        };
    }

    // WORKBOOK GENERATION
    generateWorkbook() {
        if (!this.currentSolution || !this.currentProblem) return;

        const workbook = this.createWorkbookStructure();

        workbook.sections = [
            this.createProblemSection(),
            this.createMethodSection(),
            this.createEnhancedStepsSection(),
            this.createLessonSection(),
            this.createSolutionSection(),
            this.createVerificationSection(),
            this.createGraphicalSection(),
            this.createPedagogicalNotesSection(),
            this.createAlternativeMethodsSection()
        ].filter(section => section !== null);

        this.currentWorkbook = workbook;
    }

    createWorkbookStructure() {
        return {
            title: 'Enhanced Simultaneous Equations Workbook',
            subtitle: 'Comprehensive Multi-Layer Step-by-Step Solutions',
            timestamp: new Date().toISOString(),
            theme: this.theme,
            dimensions: { width: this.width, height: this.height },
            explanationLevel: this.explanationLevel,
            sections: []
        };
    }

    createProblemSection() {
        if (!this.currentProblem) return null;

        const data = [
            ['System Type', `${this.currentProblem.systemSize}×${this.currentProblem.systemSize} System`],
            ['Number of Equations', this.currentProblem.systemSize],
            ['Number of Unknowns', this.currentProblem.systemSize],
            ['', '']
        ];

        // Add equations
        if (this.currentProblem.equations && this.currentProblem.equations.length > 0) {
            data.push(['Equations', '']);
            this.currentProblem.equations.forEach((eq, index) => {
                data.push([`Equation ${index + 1}`, eq]);
            });
        }

        return {
            title: 'Problem Statement',
            type: 'problem',
            data: data
        };
    }

    createMethodSection() {
        if (!this.currentSolution) return null;

        const methodNames = {
            'system_2x2_substitution': 'Substitution Method',
            'system_2x2_elimination': 'Elimination Method (Addition/Subtraction)',
            'system_2x2_graphical': 'Graphical Method',
            'system_2x2_matrix': 'Matrix Method (Cramer\'s Rule)',
            'system_3x3': 'Gaussian Elimination'
        };

        return {
            title: 'Solution Method',
            type: 'method',
            data: [
                ['Method Used', methodNames[this.currentProblem.method] || this.currentSolution.method],
                ['Category', this.currentSolution.category || 'simultaneous_equations'],
                ['Best For', this.getMethodSuitability(this.currentProblem.method)]
            ]
        };
    }

    getMethodSuitability(method) {
        const suitability = {
            'system_2x2_substitution': 'Systems where one variable is easily isolated',
            'system_2x2_elimination': 'Systems with aligned coefficients or easy multipliers',
            'system_2x2_graphical': 'Visual understanding and approximate solutions',
            'system_2x2_matrix': 'Systematic approach, scales to larger systems',
            'system_3x3': '3×3 and larger systems'
        };

        return suitability[method] || 'General simultaneous equation solving';
    }

    createEnhancedStepsSection() {
        if (!this.solutionSteps || this.solutionSteps.length === 0) return null;

        const stepsData = [];

        this.solutionSteps.forEach((step, index) => {
            // Skip bridge steps in basic view
            if (step.stepType === 'bridge' && this.explanationLevel === 'basic') {
                return;
            }

            if (step.stepType === 'bridge') {
                stepsData.push(['═══ Connection ═══', '']);
                stepsData.push(['Why Next Step', step.explanation?.why || step.reasoning]);
                stepsData.push(['', '']);
                return;
            }

            // Main step header
            stepsData.push([`╔═══ Step ${step.stepNumber} ═══╗`, '']);
            stepsData.push(['Action', step.step]);
            stepsData.push(['Description', step.description]);

            // Expressions
            if (step.beforeExpression && step.afterExpression) {
                stepsData.push(['', '']);
                stepsData.push(['Before', step.beforeExpression]);
                if (step.operation) {
                    stepsData.push(['Operation', step.operation]);
                }
                stepsData.push(['After', step.afterExpression]);
            } else if (step.expression) {
                stepsData.push(['Expression', step.expression]);
            }

            // Core explanation
            if (step.reasoning) {
                stepsData.push(['', '']);
                stepsData.push(['Reasoning', step.reasoning]);
            }

            if (step.algebraicRule) {
                stepsData.push(['Algebraic Rule', step.algebraicRule]);
            }

            // Enhanced explanations (based on level)
            if (this.explanationLevel !== 'basic' && step.explanations) {
                stepsData.push(['', '']);
                stepsData.push(['─── Enhanced Explanations ───', '']);
                
                if (step.explanations.conceptual) {
                    stepsData.push(['Conceptual', step.explanations.conceptual]);
                }
                
                if (this.explanationLevel === 'detailed' && step.explanations.algebraic) {
                    stepsData.push(['Algebraic', step.explanations.algebraic]);
                }
            }

            // Visual hints
            if (step.visualHint) {
                stepsData.push(['Visual Hint', step.visualHint]);
            }

            // Working details
            if (step.workingDetails) {
                stepsData.push(['', '']);
                stepsData.push(['─── Working Details ───', '']);
                Object.entries(step.workingDetails).forEach(([key, value]) => {
                    stepsData.push([key, value]);
                });
            }

            // Error prevention
            if (this.includeErrorPrevention && step.errorPrevention) {
                stepsData.push(['', '']);
                stepsData.push(['─── Error Prevention ───', '']);
                
                if (step.errorPrevention.commonMistakes && step.errorPrevention.commonMistakes.length > 0) {
                    stepsData.push(['Common Mistakes', step.errorPrevention.commonMistakes.join('; ')]);
                }
                
                if (step.errorPrevention.preventionTips && step.errorPrevention.preventionTips.length > 0) {
                    stepsData.push(['Prevention Tips', step.errorPrevention.preventionTips.join('; ')]);
                }

                if (step.criticalWarning) {
                    stepsData.push(['⚠ WARNING', step.criticalWarning]);
                }
            }

            // Scaffolding questions
            if (this.explanationLevel === 'scaffolded' && step.scaffolding) {
                stepsData.push(['', '']);
                stepsData.push(['─── Guiding Questions ───', '']);
                step.scaffolding.guidingQuestions.forEach((q, idx) => {
                    stepsData.push([`Q${idx + 1}`, q]);
                });
            }

            // Mark final answer
            if (step.finalAnswer) {
                stepsData.push(['', '']);
                stepsData.push(['✓ FINAL ANSWER', step.expression || 'See solution section']);
            }

            stepsData.push(['', '']); // Spacing between steps
            stepsData.push(['', '']); // Extra spacing
        });

        return {
            title: 'Detailed Step-by-Step Solution',
            type: 'steps',
            data: stepsData,
            stepCount: this.solutionSteps.filter(s => s.stepType !== 'bridge').length
        };
    }

    createLessonSection() {
        const method = this.currentProblem?.method;
        const lessonKey = method?.replace('system_2x2_', '') || 'elimination';
        
        const lessons = this.lessons || {};
        const lesson = lessons[`${lessonKey}_method`] || lessons['elimination_method'];

        if (!lesson) {
            return {
                title: 'Key Concepts',
                type: 'lesson',
                data: [
                    ['Concept', 'Simultaneous equations must all be satisfied at once'],
                    ['Solution', 'The point where all equations intersect'],
                    ['Methods', 'Substitution, Elimination, Graphical, Matrix']
                ]
            };
        }

        const data = [
            ['Topic', lesson.title],
            ['', '']
        ];

        if (lesson.concepts) {
            data.push(['Key Concepts', '']);
            lesson.concepts.forEach((concept, idx) => {
                data.push([`  ${idx + 1}`, concept]);
            });
            data.push(['', '']);
        }

        if (lesson.theory) {
            data.push(['Theory', lesson.theory]);
            data.push(['', '']);
        }

        if (lesson.advantages) {
            data.push(['Advantages', '']);
            lesson.advantages.forEach((adv, idx) => {
                data.push([`  ${idx + 1}`, adv]);
            });
        }

        return {
            title: 'Learning Concepts',
            type: 'lesson',
            data: data
        };
    }

    createSolutionSection() {
        if (!this.currentSolution) return null;

        const data = [
            ['Solution Type', this.currentSolution.solutionType]
        ];

        if (this.currentSolution.solutionType === 'Unique solution') {
            data.push(['', '']);
            
            if (this.currentProblem.systemSize === 2) {
                data.push(['x =', this.currentSolution.x?.toFixed(6) || 'N/A']);
                data.push(['y =', this.currentSolution.y?.toFixed(6) || 'N/A']);
                data.push(['', '']);
                data.push(['Solution Point', `(${this.currentSolution.x?.toFixed(6)}, ${this.currentSolution.y?.toFixed(6)})`]);
            } else if (this.currentProblem.systemSize === 3) {
                data.push(['x =', this.currentSolution.x?.toFixed(6) || 'N/A']);
                data.push(['y =', this.currentSolution.y?.toFixed(6) || 'N/A']);
                data.push(['z =', this.currentSolution.z?.toFixed(6) || 'N/A']);
                data.push(['', '']);
                data.push(['Solution Point', `(${this.currentSolution.x?.toFixed(6)}, ${this.currentSolution.y?.toFixed(6)}, ${this.currentSolution.z?.toFixed(6)})`]);
            }

            // Geometric interpretation
            if (this.currentProblem.systemSize === 2) {
                data.push(['', '']);
                data.push(['Geometric Meaning', 'The point where both lines intersect']);
            }
        } else {
            data.push(['Explanation', this.currentSolution.explanation || 'Special case solution']);
            
            if (this.currentSolution.graphicalInterpretation) {
                data.push(['Graphical View', this.currentSolution.graphicalInterpretation]);
            }
        }

        return {
            title: 'Final Solution',
            type: 'solution',
            data: data
        };
    }

    createVerificationSection() {
        if (!this.currentSolution || this.currentSolution.solutionType !== 'Unique solution') return null;

        const data = [
            ['Verification Method', 'Substitution into original equations'],
            ['', '']
        ];

        if (this.currentSolution.verification) {
            const verif = this.currentSolution.verification;

            if (this.currentProblem.systemSize === 2) {
                // Equation 1 verification
                data.push(['─── Equation 1 ───', '']);
                data.push(['Substitution', verif.equation1.substitution]);
                data.push(['Left Side', verif.equation1.leftSide?.toFixed(6)]);
                data.push(['Right Side', verif.equation1.rightSide?.toFixed(6)]);
                data.push(['Difference', verif.equation1.difference?.toExponential(2)]);
                data.push(['Valid?', verif.equation1.isValid ? '✓ Yes' : '✗ No']);
                data.push(['', '']);

                // Equation 2 verification
                data.push(['─── Equation 2 ───', '']);
                data.push(['Substitution', verif.equation2.substitution]);
                data.push(['Left Side', verif.equation2.leftSide?.toFixed(6)]);
                data.push(['Right Side', verif.equation2.rightSide?.toFixed(6)]);
                data.push(['Difference', verif.equation2.difference?.toExponential(2)]);
                data.push(['Valid?', verif.equation2.isValid ? '✓ Yes' : '✗ No']);
                data.push(['', '']);

                // Overall
                data.push(['Overall Verification', verif.overallValid ? '✓ Solution is CORRECT' : '✗ Solution has errors']);
            } else if (this.currentProblem.systemSize === 3 && Array.isArray(verif)) {
                verif.forEach((eq, idx) => {
                    data.push([`─── Equation ${eq.equation} ───`, '']);
                    data.push(['Substitution', eq.substitution]);
                    data.push(['Left Side', eq.leftSide?.toFixed(6)]);
                    data.push(['Right Side', eq.rightSide?.toFixed(6)]);
                    data.push(['Valid?', eq.isValid ? '✓ Yes' : '✗ No']);
                    data.push(['', '']);
                });
            }
        }

        if (this.verificationDetail === 'detailed') {
            data.push(['Tolerance Level', '1e-10']);
            data.push(['Numerical Precision', '6 decimal places']);
        }

        return {
            title: 'Solution Verification',
            type: 'verification',
            data: data
        };
    }

    createGraphicalSection() {
        if (!this.graphData || this.currentProblem.systemSize !== 2) return null;

        const data = [
            ['Graphical Representation', '2D Coordinate Plane'],
            ['', '']
        ];

        if (this.graphData.line1) {
            data.push(['─── Line 1 ───', '']);
            data.push(['Equation', this.graphData.line1.equation]);
            data.push(['Slope', this.graphData.line1.slope?.toFixed(4)]);
            data.push(['Y-Intercept', this.graphData.line1.yIntercept?.toFixed(4)]);
            data.push(['', '']);
        }

        if (this.graphData.line2) {
            data.push(['─── Line 2 ───', '']);
            data.push(['Equation', this.graphData.line2.equation]);
            data.push(['Slope', this.graphData.line2.slope?.toFixed(4)]);
            data.push(['Y-Intercept', this.graphData.line2.yIntercept?.toFixed(4)]);
            data.push(['', '']);
        }

        if (this.graphData.intersection) {
            data.push(['─── Intersection Point ───', '']);
            data.push(['x-coordinate', this.graphData.intersection.x?.toFixed(6)]);
            data.push(['y-coordinate', this.graphData.intersection.y?.toFixed(6)]);
            data.push(['Meaning', 'Solution to the system']);
        }

        return {
            title: 'Graphical Analysis',
            type: 'graphical',
            data: data
        };
    }

    createPedagogicalNotesSection() {
        if (!this.includePedagogicalNotes) return null;

        const method = this.currentProblem?.method?.replace('system_2x2_', '') || 'elimination';
        const lessonKey = `${method}_method`;
        const lesson = this.lessons?.[lessonKey];

        if (!lesson) {
            return {
                title: 'Teaching Notes',
                type: 'pedagogical',
                data: [
                    ['Focus', 'Understanding simultaneous equation solving'],
                    ['Prerequisites', 'Linear equation solving, algebraic manipulation'],
                    ['Extensions', 'Larger systems, applications, matrix methods']
                ]
            };
        }

        const data = [];

        if (lesson.concepts) {
            data.push(['Key Concepts', '']);
            lesson.concepts.forEach((concept, idx) => {
                data.push([`  ${idx + 1}`, concept]);
            });
            data.push(['', '']);
        }

        if (lesson.advantages) {
            data.push(['Method Advantages', '']);
            lesson.advantages.forEach((adv, idx) => {
                data.push([`  +`, adv]);
            });
            data.push(['', '']);
        }

        if (lesson.disadvantages) {
            data.push(['Method Limitations', '']);
            lesson.disadvantages.forEach((dis, idx) => {
                data.push([`  -`, dis]);
            });
            data.push(['', '']);
        }

        // Add generic teaching notes
        data.push(['Common Student Difficulties', '']);
        data.push(['  1', 'Sign errors when manipulating equations']);
        data.push(['  2', 'Forgetting to apply operations to all terms']);
        data.push(['  3', 'Mixing up which variable to eliminate or solve for']);
        data.push(['  4', 'Not verifying solutions in original equations']);

        return {
            title: 'Pedagogical Notes',
            type: 'pedagogical',
            data: data
        };
    }

    createAlternativeMethodsSection() {
        if (!this.includeAlternativeMethods) return null;

        const currentMethod = this.currentSolution?.method || 'Unknown';

        const data = [
            ['Current Method', currentMethod],
            ['', ''],
            ['─── Alternative Methods ───', '']
        ];

        const alternatives = [
            {
                name: 'Substitution Method',
                when: 'Best when one variable is easily isolated',
                pros: 'Natural and intuitive',
                cons: 'Can create complex fractions'
            },
            {
                name: 'Elimination Method',
                when: 'Best for aligned coefficients',
                pros: 'Systematic and efficient',
                cons: 'Requires careful sign tracking'
            },
            {
                name: 'Graphical Method',
                when: 'Good for visual learners',
                pros: 'Shows geometric meaning',
                cons: 'Limited precision'
            },
            {
                name: 'Matrix Method',
                when: 'Systematic approach for any size',
                pros: 'Scales well, computer-friendly',
                cons: 'Requires matrix knowledge'
            }
        ];

        alternatives.forEach((alt, idx) => {
            if (alt.name !== currentMethod) {
                data.push([`Method ${idx + 1}`, alt.name]);
                data.push(['  Best When', alt.when]);
                data.push(['  Advantages', alt.pros]);
                data.push(['  Limitations', alt.cons]);
                data.push(['', '']);
            }
        });

        data.push(['Recommendation', 'All methods give the same solution; choose based on system characteristics and personal preference']);

        return {
            title: 'Alternative Solution Methods',
            type: 'alternatives',
            data: data
        };
    }


// MISSING FUNCTION: calculateVerificationConfidence
    calculateVerificationConfidence() {
        if (!this.currentSolution || !this.currentProblem) return 'Unknown';

        const { method, systemSize } = this.currentProblem;
        const { solutionType } = this.currentSolution;

        // Special cases have confirmed status
        if (solutionType === 'Infinitely many solutions (dependent)' || 
            solutionType === 'No solution (inconsistent)') {
            return 'Confirmed';
        }

        // For unique solutions, check verification results
        if (solutionType === 'Unique solution') {
            const verification = this.currentSolution.verification;

            if (!verification) return 'Medium';

            if (systemSize === 2) {
                // Check both equations
                if (verification.overallValid) {
                    return 'High';
                } else if (verification.equation1.isValid || verification.equation2.isValid) {
                    return 'Medium';
                } else {
                    return 'Low';
                }
            } else if (systemSize === 3) {
                // Check all three equations
                if (Array.isArray(verification)) {
                    const allValid = verification.every(eq => eq.isValid);
                    const someValid = verification.some(eq => eq.isValid);
                    
                    if (allValid) return 'High';
                    if (someValid) return 'Medium';
                    return 'Low';
                }
            }
        }

        // Default confidence based on method
        const methodConfidence = {
            'system_2x2_substitution': 'High',
            'system_2x2_elimination': 'High',
            'system_2x2_matrix': 'High',
            'system_2x2_graphical': 'Medium', // Graphical has limited precision
            'system_3x3': 'High'
        };

        return methodConfidence[method] || 'Medium';
    }

    // MISSING FUNCTION: getVerificationNotes
    getVerificationNotes() {
        if (!this.currentProblem || !this.currentSolution) return 'No verification performed';

        const { method, systemSize } = this.currentProblem;
        const { solutionType } = this.currentSolution;
        const notes = [];

        // Add method-specific notes
        switch(method) {
            case 'system_2x2_substitution':
                notes.push('Direct substitution method used for verification');
                notes.push('Both original equations checked independently');
                break;
            
            case 'system_2x2_elimination':
                notes.push('Solution verified by substitution into original equations');
                notes.push('Elimination accuracy confirmed through back-substitution');
                break;
            
            case 'system_2x2_graphical':
                notes.push('Algebraic verification performed for graphical solution');
                notes.push('Note: Graphical method may have rounding in visual representation');
                break;
            
            case 'system_2x2_matrix':
                notes.push('Cramer\'s Rule solution verified by substitution');
                notes.push('Determinant calculations double-checked');
                break;
            
            case 'system_3x3':
                notes.push('All three equations verified independently');
                notes.push('LU decomposition solution checked against original system');
                break;
        }

        // Add tolerance information
        notes.push('Numerical tolerance: 1e-10');
        notes.push('Verification precision: 6 decimal places');

        // Add solution type specific notes
        if (solutionType === 'Unique solution') {
            notes.push('Unique solution confirmed by determinant and substitution');
        } else if (solutionType === 'No solution (inconsistent)') {
            notes.push('Inconsistency confirmed by parallel lines (equal slopes, different intercepts)');
        } else if (solutionType === 'Infinitely many solutions (dependent)') {
            notes.push('Dependence confirmed by identical lines (proportional coefficients)');
        }

        // Add system size note
        if (systemSize === 2) {
            notes.push('2×2 system: solution represents intersection of two lines');
        } else if (systemSize === 3) {
            notes.push('3×3 system: solution represents intersection of three planes');
        }

        return notes.join('; ');
    }

    // MISSING FUNCTION: generatePedagogicalNotes
    generatePedagogicalNotes(problemType) {
        const pedagogicalDatabase = {
            system_2x2_substitution: {
                objectives: [
                    'Solve 2×2 systems using substitution method',
                    'Express one variable in terms of another',
                    'Perform back-substitution to find both variables',
                    'Verify solutions in both original equations'
                ],
                keyConcepts: [
                    'Variable isolation and expression',
                    'Substitution property',
                    'Single-variable equation solving',
                    'Back-substitution technique',
                    'Ordered pair notation'
                ],
                prerequisites: [
                    'Solving linear equations for one variable',
                    'Substituting expressions for variables',
                    'Simplifying algebraic expressions',
                    'Understanding of ordered pairs',
                    'Proper use of parentheses'
                ],
                commonDifficulties: [
                    'Forgetting to use parentheses when substituting expressions',
                    'Sign errors during substitution',
                    'Not simplifying completely before substituting',
                    'Confusion about which equation to solve first',
                    'Arithmetic errors in back-substitution'
                ],
                teachingStrategies: [
                    'Emphasize importance of parentheses around substituted expressions',
                    'Use color coding for substituted expressions',
                    'Practice identifying which variable/equation is easier to work with',
                    'Show both substitution orders to demonstrate they give same answer',
                    'Have students verify each step before proceeding'
                ],
                extensions: [
                    'Systems with fractions or decimals',
                    'Systems requiring significant algebraic manipulation',
                    'Three-variable systems using repeated substitution',
                    'Word problems requiring system setup and solving',
                    'Systems with parameters'
                ],
                assessment: [
                    'Check understanding of when substitution is most efficient',
                    'Verify correct use of parentheses in substitution',
                    'Assess ability to back-substitute correctly',
                    'Confirm students verify solutions in both equations',
                    'Test with various coefficient types (integers, fractions, decimals)'
                ],
                commonMisconceptions: [
                    'Thinking substitution only works one way',
                    'Believing the first equation must always be used',
                    'Assuming back-substitution is optional',
                    'Not recognizing when special cases (no solution, infinite solutions) occur'
                ]
            },

            system_2x2_elimination: {
                objectives: [
                    'Solve 2×2 systems using elimination method',
                    'Create opposite coefficients strategically',
                    'Add or subtract equations to eliminate variables',
                    'Use back-substitution to find both variables',
                    'Recognize when elimination is most efficient'
                ],
                keyConcepts: [
                    'Opposite coefficients',
                    'Linear combination of equations',
                    'Strategic multiplication of equations',
                    'Addition property of equality',
                    'Back-substitution'
                ],
                prerequisites: [
                    'Multiplying equations by constants',
                    'Adding and subtracting equations',
                    'Finding LCM of coefficients',
                    'Sign rules for arithmetic',
                    'Solving single-variable equations'
                ],
                commonDifficulties: [
                    'Sign errors when multiplying equations',
                    'Not multiplying all terms in equation',
                    'Choosing inefficient variable to eliminate',
                    'Sign errors when adding/subtracting equations',
                    'Forgetting to back-substitute for second variable'
                ],
                teachingStrategies: [
                    'Use vertical alignment to show term-by-term addition',
                    'Practice creating opposite coefficients with simple examples',
                    'Discuss strategic choice of variable to eliminate',
                    'Use arrows to track sign changes',
                    'Have students verify opposite coefficients before adding'
                ],
                extensions: [
                    '3×3 systems using multiple eliminations',
                    'Systems requiring decimal or fraction multipliers',
                    'Comparison with substitution method on same system',
                    'Word problems with natural elimination structure',
                    'Systems with three or more variables'
                ],
                assessment: [
                    'Check strategic thinking in choosing variable to eliminate',
                    'Verify correct multiplication of all equation terms',
                    'Assess sign accuracy in combining equations',
                    'Confirm proper back-substitution',
                    'Test understanding of why variable eliminates'
                ],
                commonMisconceptions: [
                    'Thinking only one equation needs to be multiplied',
                    'Believing elimination always requires large multipliers',
                    'Not recognizing that coefficients must be opposite, not equal',
                    'Assuming eliminated variable is lost forever'
                ]
            },

            system_2x2_graphical: {
                objectives: [
                    'Convert equations to slope-intercept form',
                    'Graph linear equations accurately',
                    'Identify intersection points visually',
                    'Verify graphical solutions algebraically',
                    'Recognize solution types from graph appearance'
                ],
                keyConcepts: [
                    'Slope-intercept form (y = mx + b)',
                    'Graphing using slope and y-intercept',
                    'Intersection as solution',
                    'Parallel vs intersecting vs coincident lines',
                    'Geometric interpretation of algebraic solution'
                ],
                prerequisites: [
                    'Slope and y-intercept concepts',
                    'Graphing linear equations',
                    'Reading coordinates from graphs',
                    'Converting between equation forms',
                    'Understanding of coordinate plane'
                ],
                commonDifficulties: [
                    'Inaccurate graphing leading to wrong intersection',
                    'Difficulty reading non-integer coordinates',
                    'Confusion about which line is which',
                    'Scale problems on coordinate plane',
                    'Not verifying graphical solution algebraically'
                ],
                teachingStrategies: [
                    'Use graph paper or graphing technology',
                    'Practice slope as "rise over run"',
                    'Color-code the two different lines',
                    'Start with integer-solution systems',
                    'Always verify graphical solutions algebraically'
                ],
                extensions: [
                    'Systems with non-integer solutions',
                    'Using technology for accurate graphing',
                    'Graphing inequalities (shaded regions)',
                    'Three-variable systems (3D graphing)',
                    'Analyzing system types before solving'
                ],
                assessment: [
                    'Check accuracy of slope-intercept conversions',
                    'Verify correct graphing technique',
                    'Assess ability to identify intersection points',
                    'Confirm algebraic verification is performed',
                    'Test recognition of special cases (parallel, coincident)'
                ],
                commonMisconceptions: [
                    'Thinking graphical solution is always exact',
                    'Believing graphs can replace algebraic verification',
                    'Not understanding why parallel lines mean no solution',
                    'Confusion about what the intersection point represents'
                ]
            },

            system_2x2_matrix: {
                objectives: [
                    'Set up matrix equation AX = B from system',
                    'Calculate 2×2 determinants',
                    'Apply Cramer\'s Rule to find solutions',
                    'Recognize when determinant indicates no unique solution',
                    'Interpret matrix methods in context of systems'
                ],
                keyConcepts: [
                    'Matrix representation of systems',
                    'Coefficient matrix, variable vector, constant vector',
                    'Determinant calculation and meaning',
                    'Cramer\'s Rule formulas',
                    'Relationship between determinant and solution existence'
                ],
                prerequisites: [
                    'Basic matrix notation',
                    'Matrix multiplication concept',
                    'Determinant formula for 2×2 matrices',
                    'Understanding of systematic procedures',
                    'Fraction operations'
                ],
                commonDifficulties: [
                    'Setting up coefficient matrix incorrectly',
                    'Sign errors in determinant calculation',
                    'Forgetting which column to replace in Cramer\'s Rule',
                    'Not checking determinant before applying Cramer\'s Rule',
                    'Confusion about matrix notation'
                ],
                teachingStrategies: [
                    'Use color coding for matrix elements',
                    'Practice determinant calculation separately first',
                    'Show both Cramer\'s Rule steps side-by-side',
                    'Emphasize checking determinant first',
                    'Connect matrix method back to original equations'
                ],
                extensions: [
                    '3×3 systems using matrix methods',
                    'Matrix inverse method (X = A⁻¹B)',
                    'Augmented matrices and row reduction',
                    'Systems with more equations than unknowns',
                    'Computer-based matrix solving'
                ],
                assessment: [
                    'Check correct matrix setup from equations',
                    'Verify determinant calculation accuracy',
                    'Assess proper application of Cramer\'s Rule',
                    'Confirm understanding of determinant meaning',
                    'Test ability to interpret results'
                ],
                commonMisconceptions: [
                    'Thinking Cramer\'s Rule works when determinant is zero',
                    'Believing matrix method is always fastest',
                    'Not understanding what matrices represent',
                    'Confusion about when to use which column replacement'
                ]
            },

            system_3x3: {
                objectives: [
                    'Extend elimination method to 3×3 systems',
                    'Eliminate variables systematically',
                    'Solve resulting 2×2 system',
                    'Use back-substitution for third variable',
                    'Verify solutions in all three equations'
                ],
                keyConcepts: [
                    'Three equations with three unknowns',
                    'Systematic variable elimination',
                    'Reduction to 2×2 system',
                    'Multiple back-substitutions',
                    'Three planes intersecting at a point'
                ],
                prerequisites: [
                    'Proficiency with 2×2 systems',
                    'Elimination method mastery',
                    'Strong algebraic manipulation skills',
                    'Organized work habits',
                    'Patient, systematic approach'
                ],
                commonDifficulties: [
                    'Choosing which variable to eliminate first',
                    'Keeping track of multiple eliminations',
                    'Sign errors in complex combinations',
                    'Losing track of which equations have been used',
                    'Making errors in multiple back-substitutions'
                ],
                teachingStrategies: [
                    'Label equations clearly (Eq1, Eq2, Eq3)',
                    'Use systematic notation for derived equations',
                    'Eliminate same variable from two pairs of equations',
                    'Check work frequently at each stage',
                    'Use matrix methods as alternative/verification'
                ],
                extensions: [
                    'Systems with 4 or more variables',
                    'Gaussian elimination algorithm',
                    'Matrix row reduction (RREF)',
                    'Systems with parameters',
                    'Applications in geometry, physics, economics'
                ],
                assessment: [
                    'Check systematic approach to eliminations',
                    'Verify correct reduction to 2×2 system',
                    'Assess accuracy through all calculations',
                    'Confirm verification in all original equations',
                    'Test with different coefficient patterns'
                ],
                commonMisconceptions: [
                    'Thinking 3×3 is just three times harder than 2×2',
                    'Not realizing organization is crucial',
                    'Believing you must eliminate x first',
                    'Assuming substitution is practical for 3×3'
                ]
            },

            system_word_problem: {
                objectives: [
                    'Translate word problems into systems of equations',
                    'Define variables clearly from context',
                    'Identify independent relationships',
                    'Choose appropriate solving method',
                    'Interpret solutions in original context'
                ],
                keyConcepts: [
                    'Variable definition from word problems',
                    'Identifying independent conditions',
                    'Translation from words to equations',
                    'Contextual interpretation of solutions',
                    'Units and dimensional analysis'
                ],
                prerequisites: [
                    'Understanding of word problem structure',
                    'Ability to identify unknown quantities',
                    'Recognition of mathematical relationships in context',
                    'Proficiency with at least one solving method',
                    'Critical reading skills'
                ],
                commonDifficulties: [
                    'Defining variables clearly',
                    'Finding two independent conditions',
                    'Translating words to correct equations',
                    'Using dependent relationships (creating same equation twice)',
                    'Forgetting to answer the original question'
                ],
                teachingStrategies: [
                    'Have students write what each variable represents',
                    'Identify all given information first',
                    'Look for key phrases (sum, difference, rate, etc.)',
                    'Create equation from each independent fact',
                    'Always relate answer back to question'
                ],
                extensions: [
                    'Three-variable word problems',
                    'Problems with constraints or optimization',
                    'Real-world applications from various fields',
                    'Problems requiring additional formulas (d=rt, etc.)',
                    'Multi-step problems with sequential solving'
                ],
                assessment: [
                    'Check clarity of variable definitions',
                    'Verify equations match problem conditions',
                    'Assess appropriateness of method chosen',
                    'Confirm solution answers original question',
                    'Test interpretation skills with various contexts'
                ],
                commonMisconceptions: [
                    'Thinking more words means more equations needed',
                    'Believing any two equations will work',
                    'Not checking if solution makes sense in context',
                    'Assuming variables must be x and y'
                ]
            },

            system_inequalities: {
                objectives: [
                    'Graph systems of linear inequalities',
                    'Identify feasible regions',
                    'Find corner points of feasible regions',
                    'Apply to linear programming problems',
                    'Interpret solutions as regions, not points'
                ],
                keyConcepts: [
                    'Inequality graphing (boundary lines and shading)',
                    'Feasible region as intersection',
                    'Corner points (vertices)',
                    'Testing points to determine shading',
                    'Constraints in optimization'
                ],
                prerequisites: [
                    'Graphing linear equations',
                    'Understanding inequality symbols',
                    'Solving linear inequalities',
                    'Coordinate plane concepts',
                    'Basic optimization concepts'
                ],
                commonDifficulties: [
                    'Determining correct side to shade',
                    'Using dashed vs solid boundary lines',
                    'Finding intersection of multiple inequalities',
                    'Identifying all corner points',
                    'Understanding unbounded regions'
                ],
                teachingStrategies: [
                    'Always test a point to verify shading direction',
                    'Use different colors/patterns for each inequality',
                    'Emphasize feasible region as overlap',
                    'Practice finding corner points algebraically',
                    'Connect to real-world constraint problems'
                ],
                extensions: [
                    'Linear programming optimization',
                    'Three-variable systems (3D regions)',
                    'Applications in business, economics, engineering',
                    'Computer-based solution methods',
                    'Integer programming (discrete solutions)'
                ],
                assessment: [
                    'Check correct boundary line type (solid/dashed)',
                    'Verify accurate shading of regions',
                    'Assess identification of feasible region',
                    'Confirm all corner points found',
                    'Test interpretation of unbounded regions'
                ],
                commonMisconceptions: [
                    'Thinking solution is a single point',
                    'Believing all systems have bounded regions',
                    'Not understanding meaning of empty feasible region',
                    'Assuming optimal solutions are always at corners'
                ]
            },

            system_nonlinear: {
                objectives: [
                    'Recognize systems with nonlinear equations',
                    'Apply substitution method for nonlinear systems',
                    'Solve resulting quadratic or higher-degree equations',
                    'Find all solution pairs',
                    'Verify multiple solutions'
                ],
                keyConcepts: [
                    'Linear and nonlinear equation types',
                    'Multiple solutions possibility',
                    'Substitution as primary method',
                    'Quadratic formula application',
                    'Geometric interpretation (line intersecting curve)'
                ],
                prerequisites: [
                    'Solving quadratic equations',
                    'Substitution method for linear systems',
                    'Understanding of parabolas, circles, etc.',
                    'Complex algebraic manipulation',
                    'Graphing various functions'
                ],
                commonDifficulties: [
                    'Handling multiple solutions',
                    'Algebraic complexity after substitution',
                    'Not finding all solutions',
                    'Errors in quadratic formula application',
                    'Difficulty visualizing geometric situation'
                ],
                teachingStrategies: [
                    'Always graph to see expected number of solutions',
                    'Practice substitution with simpler cases first',
                    'Emphasize checking all solutions',
                    'Use technology to verify solutions graphically',
                    'Connect to real-world intersection problems'
                ],
                extensions: [
                    'Systems with two nonlinear equations',
                    'Higher-degree polynomial systems',
                    'Exponential and logarithmic systems',
                    'Numerical solution methods',
                    'Systems with no real solutions (complex solutions)'
                ],
                assessment: [
                    'Check identification of nonlinear equations',
                    'Verify correct application of substitution',
                    'Assess finding of all solutions',
                    'Confirm proper verification of each solution',
                    'Test geometric interpretation understanding'
                ],
                commonMisconceptions: [
                    'Expecting only one solution',
                    'Thinking elimination works as easily as for linear',
                    'Not recognizing when complex solutions occur',
                    'Assuming graphical and algebraic solutions always match exactly'
                ]
            }
        };

        // Return pedagogical notes for the problem type, with fallback
        return pedagogicalDatabase[problemType] || {
            objectives: [
                'Solve systems of simultaneous equations',
                'Apply appropriate solution methods',
                'Verify solutions accurately'
            ],
            keyConcepts: [
                'Systems of equations',
                'Multiple solving methods',
                'Solution verification'
            ],
            prerequisites: [
                'Linear equation solving',
                'Algebraic manipulation',
                'Basic graphing skills'
            ],
            commonDifficulties: [
                'Sign errors in calculations',
                'Choosing appropriate method',
                'Verification of solutions'
            ],
            teachingStrategies: [
                'Provide systematic approach',
                'Emphasize checking work',
                'Use visual aids when possible'
            ],
            extensions: [
                'More complex systems',
                'Real-world applications',
                'Technology-enhanced solving'
            ],
            assessment: [
                'Check understanding of methods',
                'Verify accuracy of calculations',
                'Assess problem-solving strategy'
            ],
            commonMisconceptions: [
                'Confusion about when methods apply',
                'Misunderstanding of solution types',
                'Errors in algebraic manipulation'
            ]
        };
    }
}
