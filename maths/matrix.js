// Enhanced Matrix Mathematical Workbook - Improved Step-by-Step Explanations
import * as math from 'mathjs';

export class EnhancedMatrixMathematicalWorkbook {
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
        this.initializeMatrixSolvers();
        this.initializeErrorDatabase();
        this.initializeExplanationTemplates();
        this.initializeMatrixLessons();
    }

    initializeMatrixLessons() {
        this.lessons = {
            matrix_basics: {
                title: "Matrix Basics and Notation",
                concepts: [
                    "Matrix: Rectangular array of numbers arranged in rows and columns",
                    "Dimensions: m×n where m = rows, n = columns",
                    "Elements: Individual entries denoted as aᵢⱼ (row i, column j)",
                    "Square matrix: Same number of rows and columns (n×n)"
                ],
                theory: "Matrices are fundamental mathematical objects used to organize data, represent linear transformations, and solve systems of equations. Understanding matrix structure is essential for all matrix operations.",
                keyFormulas: {
                    "Element Notation": "aᵢⱼ represents element in row i, column j",
                    "Matrix Dimensions": "A is m×n means m rows and n columns",
                    "Square Matrix": "n×n matrix where rows = columns"
                },
                applications: [
                    "Data organization and storage",
                    "Computer graphics transformations",
                    "Network and graph representations",
                    "Quantum mechanics state representation"
                ]
            },

            matrix_addition: {
                title: "Matrix Addition and Subtraction",
                concepts: [
                    "Only matrices of same dimensions can be added/subtracted",
                    "Add/subtract corresponding elements: (A + B)ᵢⱼ = aᵢⱼ + bᵢⱼ",
                    "Commutative: A + B = B + A",
                    "Associative: (A + B) + C = A + (B + C)"
                ],
                theory: "Matrix addition combines two matrices by adding corresponding elements. This operation preserves dimensions and follows arithmetic properties similar to scalar addition.",
                keyFormulas: {
                    "Addition": "(A + B)ᵢⱼ = aᵢⱼ + bᵢⱼ",
                    "Subtraction": "(A - B)ᵢⱼ = aᵢⱼ - bᵢⱼ",
                    "Zero Matrix": "A + O = A"
                },
                solvingSteps: [
                    "Verify matrices have same dimensions",
                    "Add/subtract corresponding elements",
                    "Maintain matrix structure",
                    "Check result dimensions match input"
                ],
                applications: [
                    "Combining datasets",
                    "Image processing operations",
                    "Economic models with multiple variables",
                    "Physics vector field combinations"
                ]
            },

            scalar_multiplication: {
                title: "Scalar Multiplication",
                concepts: [
                    "Multiply every element by scalar: (kA)ᵢⱼ = k·aᵢⱼ",
                    "Distributive: k(A + B) = kA + kB",
                    "Associative: (kℓ)A = k(ℓA)",
                    "Identity: 1·A = A, 0·A = O"
                ],
                theory: "Scalar multiplication scales a matrix by multiplying each element by a constant. This operation preserves matrix structure while changing magnitude.",
                keyFormulas: {
                    "Scalar Mult": "(kA)ᵢⱼ = k·aᵢⱼ",
                    "Distributive": "k(A + B) = kA + kB",
                    "Factoring": "kA + kB = k(A + B)"
                },
                applications: [
                    "Scaling transformations",
                    "Unit conversions in matrices",
                    "Amplitude adjustments in signals",
                    "Probability distribution scaling"
                ]
            },

            matrix_multiplication: {
                title: "Matrix Multiplication",
                concepts: [
                    "Requires inner dimensions to match: (m×n)·(n×p) = (m×p)",
                    "Element formula: (AB)ᵢⱼ = Σₖ aᵢₖ·bₖⱼ",
                    "NOT commutative: AB ≠ BA generally",
                    "Associative: (AB)C = A(BC)"
                ],
                theory: "Matrix multiplication represents composition of linear transformations. Each element is the dot product of a row from the first matrix and a column from the second.",
                keyFormulas: {
                    "Product Element": "(AB)ᵢⱼ = Σₖ aᵢₖ·bₖⱼ",
                    "Dimension Rule": "(m×n)·(n×p) → (m×p)",
                    "Identity": "AI = IA = A"
                },
                solvingSteps: [
                    "Check dimension compatibility (columns of A = rows of B)",
                    "Compute each element as row·column dot product",
                    "Result has dimensions (rows of A) × (columns of B)",
                    "Verify computations with sample elements"
                ],
                applications: [
                    "Linear transformation composition",
                    "Neural network operations",
                    "3D graphics rendering",
                    "Markov chain state transitions"
                ]
            },

            matrix_transpose: {
                title: "Matrix Transpose",
                concepts: [
                    "Transpose: Flip matrix over main diagonal",
                    "Notation: Aᵀ or A'",
                    "Formula: (Aᵀ)ᵢⱼ = aⱼᵢ",
                    "Dimensions swap: (m×n)ᵀ = (n×m)"
                ],
                theory: "Transposition exchanges rows and columns, creating a reflection across the main diagonal. This operation has important algebraic properties.",
                keyFormulas: {
                    "Transpose": "(Aᵀ)ᵢⱼ = aⱼᵢ",
                    "Double Transpose": "(Aᵀ)ᵀ = A",
                    "Sum Transpose": "(A + B)ᵀ = Aᵀ + Bᵀ",
                    "Product Transpose": "(AB)ᵀ = BᵀAᵀ"
                },
                applications: [
                    "Symmetric matrix operations",
                    "Covariance matrix computation",
                    "Least squares problems",
                    "Orthogonal transformations"
                ]
            },

            determinant: {
                title: "Matrix Determinant",
                concepts: [
                    "Defined only for square matrices",
                    "2×2 determinant: |A| = ad - bc",
                    "Measures scaling factor of transformation",
                    "Zero determinant means matrix is singular (non-invertible)"
                ],
                theory: "The determinant is a scalar value encoding important properties of a square matrix, including invertibility, volume scaling, and eigenvalue products.",
                keyFormulas: {
                    "2×2 Determinant": "det(A) = a₁₁a₂₂ - a₁₂a₂₁",
                    "3×3 Cofactor": "det(A) = Σ aᵢⱼCᵢⱼ (any row/column)",
                    "Product Rule": "det(AB) = det(A)·det(B)"
                },
                solvingSteps: [
                    "For 2×2: Use direct formula ad - bc",
                    "For 3×3: Use cofactor expansion or Sarrus rule",
                    "For n×n: Use LU decomposition or recursive cofactor",
                    "Check if result is zero (singular matrix)"
                ],
                applications: [
                    "Testing matrix invertibility",
                    "Computing matrix inverse",
                    "Solving systems with Cramer's rule",
                    "Finding areas and volumes"
                ]
            },

            matrix_inverse: {
                title: "Matrix Inverse",
                concepts: [
                    "A⁻¹ exists only if det(A) ≠ 0",
                    "AA⁻¹ = A⁻¹A = I (identity matrix)",
                    "2×2 inverse: A⁻¹ = (1/det(A))·adj(A)",
                    "Inverse reverses linear transformation"
                ],
                theory: "The matrix inverse is analogous to reciprocal for scalars. It allows solving matrix equations and reversing transformations.",
                keyFormulas: {
                    "Inverse Property": "AA⁻¹ = I",
                    "2×2 Inverse": "A⁻¹ = (1/det(A))[[d,-b],[-c,a]]",
                    "Product Inverse": "(AB)⁻¹ = B⁻¹A⁻¹",
                    "Transpose Inverse": "(Aᵀ)⁻¹ = (A⁻¹)ᵀ"
                },
                solvingSteps: [
                    "Compute determinant and verify ≠ 0",
                    "For 2×2: Swap diagonals, negate off-diagonals, divide by det",
                    "For larger: Use Gauss-Jordan elimination [A|I] → [I|A⁻¹]",
                    "Verify by computing AA⁻¹ = I"
                ],
                applications: [
                    "Solving matrix equations AX = B",
                    "Decryption in cryptography",
                    "Inverse transformations in graphics",
                    "Control theory and feedback systems"
                ]
            },

            systems_matrices: {
                title: "Systems of Linear Equations using Matrices",
                concepts: [
                    "System AX = B where A is coefficient matrix",
                    "Solution: X = A⁻¹B (if A⁻¹ exists)",
                    "Augmented matrix [A|B] for row reduction",
                    "Row operations preserve solution set"
                ],
                theory: "Matrices provide compact representation of linear systems and enable systematic solution methods through matrix operations.",
                keyFormulas: {
                    "Matrix Form": "AX = B",
                    "Inverse Solution": "X = A⁻¹B (if det(A) ≠ 0)",
                    "Cramer's Rule": "xᵢ = det(Aᵢ)/det(A)",
                    "Augmented Matrix": "[A|B]"
                },
                solvingSteps: [
                    "Write system in matrix form AX = B",
                    "Check if det(A) ≠ 0 for unique solution",
                    "Method 1: Compute X = A⁻¹B",
                    "Method 2: Row reduce [A|B] to [I|X]",
                    "Verify solution by substitution"
                ],
                applications: [
                    "Engineering systems analysis",
                    "Economic equilibrium models",
                    "Circuit analysis",
                    "Optimization problems"
                ]
            },

            eigenvalues_eigenvectors: {
                title: "Eigenvalues and Eigenvectors",
                concepts: [
                    "Eigenvector: Non-zero vector where Av = λv",
                    "Eigenvalue: Scalar λ in Av = λv",
                    "Characteristic equation: det(A - λI) = 0",
                    "n×n matrix has n eigenvalues (counting multiplicity)"
                ],
                theory: "Eigenvalues and eigenvectors reveal directions that are merely scaled (not rotated) by a linear transformation, providing insight into matrix behavior.",
                keyFormulas: {
                    "Eigenvector Equation": "Av = λv",
                    "Characteristic Equation": "det(A - λI) = 0",
                    "Trace": "tr(A) = Σ λᵢ",
                    "Determinant": "det(A) = Π λᵢ"
                },
                solvingSteps: [
                    "Form characteristic equation det(A - λI) = 0",
                    "Solve for eigenvalues λ",
                    "For each λ, solve (A - λI)v = 0 for eigenvector v",
                    "Verify Av = λv for each pair"
                ],
                applications: [
                    "Principal component analysis (PCA)",
                    "Stability analysis of systems",
                    "Vibration modes in mechanics",
                    "Google PageRank algorithm"
                ]
            },

            matrix_rank: {
                title: "Matrix Rank",
                concepts: [
                    "Rank: Maximum number of linearly independent rows/columns",
                    "Full rank: rank = min(m, n) for m×n matrix",
                    "Rank deficiency indicates linear dependence",
                    "Rank determines solution existence for AX = B"
                ],
                theory: "Rank measures the dimension of the space spanned by matrix rows or columns, indicating the effective dimensionality of the transformation.",
                keyFormulas: {
                    "Rank Definition": "rank(A) = dim(Col(A)) = dim(Row(A))",
                    "Full Rank": "rank(A) = min(m,n) for m×n matrix",
                    "Rank-Nullity": "rank(A) + nullity(A) = n"
                },
                applications: [
                    "Determining system solvability",
                    "Data dimensionality analysis",
                    "Image compression",
                    "Signal processing"
                ]
            },

            special_matrices: {
                title: "Special Matrix Types",
                concepts: [
                    "Identity matrix I: diagonal 1s, others 0",
                    "Diagonal matrix: non-zero only on diagonal",
                    "Symmetric: A = Aᵀ",
                    "Orthogonal: AAᵀ = I"
                ],
                theory: "Special matrices have unique properties that simplify computations and appear frequently in applications.",
                keyFormulas: {
                    "Identity": "Iᵢⱼ = δᵢⱼ (Kronecker delta)",
                    "Symmetric": "aᵢⱼ = aⱼᵢ",
                    "Orthogonal": "QQᵀ = I",
                    "Diagonal": "aᵢⱼ = 0 for i ≠ j"
                },
                properties: {
                    "Identity": "AI = IA = A for any matrix A",
                    "Diagonal": "Easy multiplication and inversion",
                    "Symmetric": "Real eigenvalues, orthogonal eigenvectors",
                    "Orthogonal": "Preserves lengths and angles"
                },
                applications: [
                    "Simplifying matrix computations",
                    "Coordinate transformations",
                    "Optimization algorithms",
                    "Quantum mechanics operators"
                ]
            },

            row_operations: {
                title: "Elementary Row Operations",
                concepts: [
                    "Row swap: Exchange two rows",
                    "Row scaling: Multiply row by non-zero scalar",
                    "Row addition: Add multiple of one row to another",
                    "Operations preserve solution set"
                ],
                theory: "Elementary row operations are the foundation of Gaussian elimination and row reduction, enabling systematic solution of linear systems.",
                keyFormulas: {
                    "Row Swap": "Rᵢ ↔ Rⱼ",
                    "Row Scale": "kRᵢ → Rᵢ (k ≠ 0)",
                    "Row Addition": "Rᵢ + kRⱼ → Rᵢ"
                },
                solvingSteps: [
                    "Identify pivot positions (leading 1s)",
                    "Use row operations to create zeros below pivots",
                    "Continue to create row echelon form",
                    "Back-substitute or continue to reduced form"
                ],
                applications: [
                    "Gaussian elimination",
                    "Finding matrix inverse",
                    "Computing matrix rank",
                    "Solving linear systems"
                ]
            },

            lu_decomposition: {
                title: "LU Decomposition",
                concepts: [
                    "Factor A = LU where L is lower, U is upper triangular",
                    "L has 1s on diagonal",
                    "Efficient for solving multiple systems",
                    "Used in computing determinants"
                ],
                theory: "LU decomposition factors a matrix into lower and upper triangular matrices, enabling efficient solution of linear systems through forward and backward substitution.",
                keyFormulas: {
                    "Decomposition": "A = LU",
                    "Lower Triangular": "L: lᵢⱼ = 0 for i < j",
                    "Upper Triangular": "U: uᵢⱼ = 0 for i > j",
                    "Determinant": "det(A) = Π uᵢᵢ"
                },
                solvingSteps: [
                    "Perform Gaussian elimination on A",
                    "L contains elimination multipliers",
                    "U is the resulting upper triangular matrix",
                    "Solve LY = B, then UX = Y"
                ],
                applications: [
                    "Solving multiple systems with same A",
                    "Computing determinants efficiently",
                    "Matrix inversion",
                    "Numerical stability in computations"
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
                matrixBg: '#f0f8ff',
                matrixBorder: '#4682b4'
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
                matrixBg: '#e8f4f8',
                matrixBorder: '#1976d2'
            }
        };

        this.colors = themes[this.theme] || themes.excel;
    }

    initializeMathSymbols() {
        return {
            // Mathematical operators
            'times': '×', 'cdot': '·', 'div': '÷',
            'leq': '≤', 'geq': '≥', 'neq': '≠', 'approx': '≈',
            'infinity': '∞', 'plusminus': '±',
            // Greek letters
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'Δ',
            'pi': 'π', 'theta': 'θ', 'lambda': 'λ', 'mu': 'μ',
            'sigma': 'Σ', 'omega': 'Ω',
            // Special symbols
            'transpose': 'ᵀ', 'inverse': '⁻¹',
            'det': 'det', 'tr': 'tr',
            'dimension': '×'
        };
    }

    initializeMatrixSolvers() {
        this.matrixTypes = {
            matrix_addition: {
                patterns: [
                    /add.*matri/i,
                    /matrix.*addition/i,
                    /sum.*matrices/i
                ],
                solver: this.solveMatrixAddition.bind(this),
                name: 'Matrix Addition/Subtraction',
                category: 'basic_operations',
                description: 'Adds or subtracts matrices element-wise'
            },

            scalar_multiplication: {
                patterns: [
                    /scalar.*mult/i,
                    /multiply.*scalar/i,
                    /scale.*matrix/i
                ],
                solver: this.solveScalarMultiplication.bind(this),
                name: 'Scalar Multiplication',
                category: 'basic_operations',
                description: 'Multiplies matrix by scalar constant'
            },

            matrix_multiplication: {
                patterns: [
                    /matrix.*mult/i,
                    /multiply.*matrices/i,
                    /product.*matrices/i
                ],
                solver: this.solveMatrixMultiplication.bind(this),
                name: 'Matrix Multiplication',
                category: 'matrix_operations',
                description: 'Computes product of two matrices'
            },

            matrix_transpose: {
                patterns: [
                    /transpose/i,
                    /flip.*matrix/i,
                    /transpose.*matrix/i
                ],
                solver: this.solveMatrixTranspose.bind(this),
                name: 'Matrix Transpose',
                category: 'matrix_operations',
                description: 'Transposes matrix (rows ↔ columns)'
            },

            determinant: {
                patterns: [
                    /determinant/i,
                    /det.*matrix/i,
                    /find.*det/i
                ],
                solver: this.solveDeterminant.bind(this),
                name: 'Matrix Determinant',
                category: 'matrix_properties',
                description: 'Computes determinant of square matrix'
            },

            matrix_inverse: {
                patterns: [
                    /inverse/i,
                    /invert.*matrix/i,
                    /find.*inverse/i
                ],
                solver: this.solveMatrixInverse.bind(this),
                name: 'Matrix Inverse',
                category: 'matrix_operations',
                description: 'Computes inverse of invertible matrix'
            },

            solve_system: {
                patterns: [
                    /solve.*system/i,
                    /linear.*system/i,
                    /system.*equations/i
                ],
                solver: this.solveLinearSystem.bind(this),
                name: 'Linear System Solution',
                category: 'applications',
                description: 'Solves system of linear equations using matrices'
            },

            eigenvalues: {
                patterns: [
                    /eigenvalue/i,
                    /eigenvector/i,
                    /characteristic.*equation/i
                ],
                solver: this.solveEigenvalues.bind(this),
                name: 'Eigenvalues and Eigenvectors',
                category: 'advanced',
                description: 'Finds eigenvalues and eigenvectors'
            },

            matrix_rank: {
                patterns: [
                    /rank/i,
                    /find.*rank/i,
                    /matrix.*rank/i
                ],
                solver: this.solveMatrixRank.bind(this),
                name: 'Matrix Rank',
                category: 'matrix_properties',
                description: 'Computes rank of matrix'
            },

            lu_decomposition: {
                patterns: [
                    /lu.*decomp/i,
                    /lu.*factor/i,
                    /factor.*lu/i
                ],
                solver: this.solveLUDecomposition.bind(this),
                name: 'LU Decomposition',
                category: 'factorization',
                description: 'Factors matrix into lower and upper triangular'
            },

            qr_decomposition: {
                patterns: [
                    /qr.*decomp/i,
                    /qr.*factor/i,
                    /factor.*qr/i
                ],
                solver: this.solveQRDecomposition.bind(this),
                name: 'QR Decomposition',
                category: 'factorization',
                description: 'Factors matrix into orthogonal and upper triangular'
            },

            row_echelon: {
                patterns: [
                    /row.*echelon/i,
                    /ref.*form/i,
                    /echelon.*form/i
                ],
                solver: this.solveRowEchelon.bind(this),
                name: 'Row Echelon Form',
                category: 'matrix_operations',
                description: 'Reduces matrix to row echelon form'
            },

            reduced_row_echelon: {
                patterns: [
                    /rref/i,
                    /reduced.*row.*echelon/i,
                    /gauss.*jordan/i
                ],
                solver: this.solveReducedRowEchelon.bind(this),
                name: 'Reduced Row Echelon Form',
                category: 'matrix_operations',
                description: 'Reduces matrix to reduced row echelon form'
            }
        };
    }

    initializeErrorDatabase() {
        this.commonMistakes = {
            matrix_multiplication: {
                'Check dimensions': [
                    'Forgetting to verify columns of A = rows of B',
                    'Confusing result dimensions',
                    'Trying to multiply incompatible matrices'
                ],
                'Compute elements': [
                    'Using wrong row or column',
                    'Arithmetic errors in dot product',
                    'Forgetting to sum all products'
                ]
            },
            determinant: {
                'Cofactor expansion': [
                    'Sign errors in alternating pattern',
                    'Selecting wrong minor',
                    'Arithmetic mistakes in recursion'
                ]
            },
            matrix_inverse: {
                'Check invertibility': [
                    'Not checking if determinant is zero',
                    'Attempting to invert singular matrix'
                ],
                'Compute inverse': [
                    'Sign errors in adjugate',
                    'Forgetting to divide by determinant'
                ]
            }
        };

        this.errorPrevention = {
            dimension_checking: {
                reminder: 'Always verify dimension compatibility before operations',
                method: 'Write dimensions explicitly: (m×n)·(n×p) → (m×p)'
            },
            element_tracking: {
                reminder: 'Keep track of row and column indices carefully',
                method: 'Use subscript notation and highlight current elements'
            },
            determinant_signs: {
                reminder: 'Cofactor signs alternate in checkerboard pattern',
                method: 'Draw sign pattern: +−+−... for reference'
            }
        };
    }

    initializeExplanationTemplates() {
        this.explanationStyles = {
            conceptual: {
                focus: 'Why matrix operations work and their geometric meaning',
                language: 'intuitive and visual understanding'
            },
            procedural: {
                focus: 'Exact algorithmic steps to compute matrix operations',
                language: 'step-by-step instructions'
            },
            visual: {
                focus: 'Graphical and spatial interpretation of matrices',
                language: 'visual metaphors and geometric concepts'
            },
            algebraic: {
                focus: 'Formal matrix algebra and properties',
                language: 'precise mathematical notation and proofs'
            }
        };

        this.difficultyLevels = {
            basic: {
                vocabulary: 'simple, everyday language',
                detail: 'essential computational steps only',
                examples: 'small matrices (2×2, 3×3) with simple numbers'
            },
            intermediate: {
                vocabulary: 'standard linear algebra terms',
                detail: 'main operations with brief explanations',
                examples: 'mix of sizes with clear patterns'
            },
            detailed: {
                vocabulary: 'full mathematical vocabulary',
                detail: 'comprehensive explanations with theory',
                examples: 'general cases and abstract reasoning'
            },
            scaffolded: {
                vocabulary: 'progressive from simple to complex',
                detail: 'guided discovery with leading questions',
                examples: 'carefully sequenced difficulty progression'
            }
        };
    }

    // Main solver method
    solveMatrixProblem(config) {
        const { matrices, operation, parameters, problemType, context } = config;

        try {
            // Parse the problem
            this.currentProblem = this.parseMatrixProblem(matrices, operation, parameters, problemType, context);

            // Solve the problem
            this.currentSolution = this.solveMatrixProblem_Internal(this.currentProblem);

            // Generate solution steps
            this.solutionSteps = this.generateMatrixSteps(this.currentProblem, this.currentSolution);

            // Generate workbook
            this.generateMatrixWorkbook();

            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                steps: this.solutionSteps
            };

        } catch (error) {
            throw new Error(`Failed to solve matrix problem: ${error.message}`);
        }
    }



    solveMatrixProblem_Internal(problem) {
        const solver = this.matrixTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for matrix problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    // MATRIX SOLVERS

parseMatrixProblem(matrices, operation = '', parameters = {}, problemType = null, context = {}) {
        // If problem type is specified, use it directly
        if (problemType && this.matrixTypes[problemType]) {
            return {
                matrices: matrices || {},
                operation: operation,
                type: problemType,
                parameters: { ...parameters },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        // Auto-detect matrix problem type
        for (const [type, config] of Object.entries(this.matrixTypes)) {
            for (const pattern of config.patterns) {
                if (pattern.test(operation) || (context.description && pattern.test(context.description))) {
                    return {
                        matrices: matrices || {},
                        operation: operation,
                        type: type,
                        parameters: { ...parameters },
                        context: { ...context },
                        parsedAt: new Date().toISOString()
                    };
                }
            }
        }

        throw new Error(`Unable to recognize matrix problem type from: ${operation}`);
    }

    solveMatrixProblem_Internal(problem) {
        const solver = this.matrixTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for matrix problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    // MATRIX SOLVERS

    solveMatrixAddition(problem) {
        const { A, B, operation = 'add' } = problem.matrices;

        if (!A || !B) {
            throw new Error('Two matrices required for addition/subtraction');
        }

        const matrixA = math.matrix(A);
        const matrixB = math.matrix(B);

        // Check dimensions
        const sizeA = matrixA.size();
        const sizeB = matrixB.size();

        if (sizeA[0] !== sizeB[0] || sizeA[1] !== sizeB[1]) {
            return {
                error: 'Dimension mismatch',
                matrixA: { data: A, dimensions: sizeA },
                matrixB: { data: B, dimensions: sizeB },
                message: `Cannot ${operation} matrices of different dimensions: ${sizeA} and ${sizeB}`,
                category: 'matrix_addition'
            };
        }

        let result;
        if (operation === 'subtract') {
            result = math.subtract(matrixA, matrixB);
        } else {
            result = math.add(matrixA, matrixB);
        }

        return {
            operation: operation,
            matrixA: { data: A, dimensions: sizeA },
            matrixB: { data: B, dimensions: sizeB },
            result: { data: result.toArray(), dimensions: result.size() },
            operationSymbol: operation === 'add' ? '+' : '-',
            verification: this.verifyMatrixOperation(A, B, result.toArray(), operation),
            category: 'matrix_addition'
        };
    }

// FIXED VERSION of solveScalarMultiplication method
// Replace this in your EnhancedMatrixMathematicalWorkbook class (around line 865)

solveScalarMultiplication(problem) {
    // Debug logging
    console.log('DEBUG - problem.matrices:', problem.matrices);
    
    const { A, scalar } = problem.matrices;

    console.log('DEBUG - A:', A);
    console.log('DEBUG - scalar:', scalar);
    
    // Better validation - check each condition separately
    if (!A) {
        throw new Error('Matrix required for scalar multiplication');
    }
    
    if (scalar === undefined || scalar === null) {
        throw new Error('Scalar value required for scalar multiplication');
    }

    const matrixA = math.matrix(A);
    const result = math.multiply(scalar, matrixA);

    return {
        operation: 'scalar_multiplication',
        matrix: { data: A, dimensions: matrixA.size() },
        scalar: scalar,
        result: { data: result.toArray(), dimensions: result.size() },
        verification: this.verifyScalarMultiplication(A, scalar, result.toArray()),
        category: 'scalar_multiplication'
    };
}

// Also update verifyScalarMultiplication if needed:
verifyScalarMultiplication(A, scalar, result) {
    const tolerance = 1e-10;
    let isValid = true;

    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A[i].length; j++) {
            const expected = scalar * A[i][j];
            if (Math.abs(result[i][j] - expected) > tolerance) {
                isValid = false;
                break;
            }
        }
        if (!isValid) break;
    }

    return {
        isValid: isValid,
        tolerance: tolerance,
        formula: 'Each element multiplied by scalar'
    };
}

    solveMatrixMultiplication(problem) {
        const { A, B } = problem.matrices;

        if (!A || !B) {
            throw new Error('Two matrices required for multiplication');
        }

        const matrixA = math.matrix(A);
        const matrixB = math.matrix(B);

        const sizeA = matrixA.size();
        const sizeB = matrixB.size();

        // Check dimension compatibility
        if (sizeA[1] !== sizeB[0]) {
            return {
                error: 'Dimension incompatibility',
                matrixA: { data: A, dimensions: sizeA },
                matrixB: { data: B, dimensions: sizeB },
                message: `Cannot multiply: columns of A (${sizeA[1]}) ≠ rows of B (${sizeB[0]})`,
                rule: 'For AB to exist: (m×n)·(n×p) → (m×p)',
                category: 'matrix_multiplication'
            };
        }

        const result = math.multiply(matrixA, matrixB);
        const resultSize = result.size();

        return {
            operation: 'matrix_multiplication',
            matrixA: { data: A, dimensions: sizeA },
            matrixB: { data: B, dimensions: sizeB },
            result: { data: result.toArray(), dimensions: resultSize },
            dimensionRule: `(${sizeA[0]}×${sizeA[1]})·(${sizeB[0]}×${sizeB[1]}) = (${resultSize[0]}×${resultSize[1]})`,
            verification: this.verifyMatrixMultiplication(A, B, result.toArray()),
            elementFormula: '(AB)ᵢⱼ = Σₖ aᵢₖ·bₖⱼ',
            category: 'matrix_multiplication'
        };
    }

    solveMatrixTranspose(problem) {
        const { A } = problem.matrices;

        if (!A) {
            throw new Error('Matrix required for transpose');
        }

        const matrixA = math.matrix(A);
        const result = math.transpose(matrixA);

        return {
            operation: 'transpose',
            matrix: { data: A, dimensions: matrixA.size() },
            result: { data: result.toArray(), dimensions: result.size() },
            dimensionChange: `${matrixA.size()[0]}×${matrixA.size()[1]} → ${result.size()[0]}×${result.size()[1]}`,
            formula: '(Aᵀ)ᵢⱼ = aⱼᵢ',
            properties: {
                doubleTranspose: '(Aᵀ)ᵀ = A',
                sumTranspose: '(A + B)ᵀ = Aᵀ + Bᵀ',
                productTranspose: '(AB)ᵀ = BᵀAᵀ'
            },
            verification: this.verifyTranspose(A, result.toArray()),
            category: 'matrix_transpose'
        };
    }

    solveDeterminant(problem) {
        const { A } = problem.matrices;

        if (!A) {
            throw new Error('Matrix required for determinant');
        }

        const matrixA = math.matrix(A);
        const size = matrixA.size();

        if (size[0] !== size[1]) {
            return {
                error: 'Not square matrix',
                matrix: { data: A, dimensions: size },
                message: 'Determinant is only defined for square matrices',
                category: 'determinant'
            };
        }

        const det = math.det(matrixA);
        const n = size[0];

        let method = '';
        let formula = '';

        if (n === 2) {
            method = 'Direct formula';
            formula = 'det(A) = a₁₁a₂₂ - a₁₂a₂₁';
        } else if (n === 3) {
            method = 'Cofactor expansion or Rule of Sarrus';
            formula = 'det(A) = Σ aᵢⱼCᵢⱼ (cofactor expansion)';
        } else {
            method = 'LU decomposition';
            formula = 'det(A) = Π uᵢᵢ (product of diagonal elements of U)';
        }

        return {
            operation: 'determinant',
            matrix: { data: A, dimensions: size },
            determinant: det,
            isInvertible: Math.abs(det) > 1e-10,
            method: method,
            formula: formula,
            interpretation: this.interpretDeterminant(det),
            category: 'determinant'
        };
    }

    solveMatrixInverse(problem) {
        const { A } = problem.matrices;

        if (!A) {
            throw new Error('Matrix required for inverse');
        }

        const matrixA = math.matrix(A);
        const size = matrixA.size();

        if (size[0] !== size[1]) {
            return {
                error: 'Not square matrix',
                matrix: { data: A, dimensions: size },
                message: 'Inverse is only defined for square matrices',
                category: 'matrix_inverse'
            };
        }

        const det = math.det(matrixA);

        if (Math.abs(det) < 1e-10) {
            return {
                error: 'Singular matrix',
                matrix: { data: A, dimensions: size },
                determinant: det,
                message: 'Matrix is singular (det = 0) and cannot be inverted',
                category: 'matrix_inverse'
            };
        }

        const inverse = math.inv(matrixA);
        const n = size[0];

        let method = '';
        if (n === 2) {
            method = 'Direct formula: A⁻¹ = (1/det(A))·adj(A)';
        } else {
            method = 'Gauss-Jordan elimination: [A|I] → [I|A⁻¹]';
        }

        return {
            operation: 'matrix_inverse',
            matrix: { data: A, dimensions: size },
            determinant: det,
            inverse: { data: inverse.toArray(), dimensions: inverse.size() },
            method: method,
            verification: this.verifyInverse(A, inverse.toArray()),
            properties: {
                definition: 'AA⁻¹ = A⁻¹A = I',
                productInverse: '(AB)⁻¹ = B⁻¹A⁻¹',
                transposeInverse: '(Aᵀ)⁻¹ = (A⁻¹)ᵀ'
            },
            category: 'matrix_inverse'
        };
    }

    solveLinearSystem(problem) {
        const { A, B } = problem.matrices;

        if (!A || !B) {
            throw new Error('Coefficient matrix A and constants B required');
        }

        const matrixA = math.matrix(A);
        const vectorB = math.matrix(B);

        const sizeA = matrixA.size();
        const sizeB = vectorB.size();

        // Check if B is a column vector
        if (sizeB.length === 1) {
            // Convert to column vector
            const columnB = [];
            for (let i = 0; i < sizeB[0]; i++) {
                columnB.push([B[i]]);
            }
            problem.matrices.B = columnB;
        }

        try {
            const solution = math.lusolve(matrixA, problem.matrices.B);
            
            return {
                operation: 'solve_system',
                coefficientMatrix: { data: A, dimensions: sizeA },
                constants: { data: problem.matrices.B, dimensions: [sizeA[0], 1] },
                solution: { data: solution, dimensions: [sizeA[1], 1] },
                method: 'LU decomposition with forward/backward substitution',
                matrixForm: 'AX = B',
                solutionFormula: 'X = A⁻¹B',
                verification: this.verifySystemSolution(A, problem.matrices.B, solution),
                category: 'systems_matrices'
            };
        } catch (error) {
            const det = math.det(matrixA);
            return {
                error: 'System cannot be solved',
                coefficientMatrix: { data: A, dimensions: sizeA },
                determinant: det,
                message: Math.abs(det) < 1e-10 ? 
                    'System is singular (det = 0): no unique solution' :
                    'Error in solving system',
                category: 'systems_matrices'
            };
        }
    }

solveScalarMultiplication(problem) {
    // Access matrix from problem.matrices.A
    const A = problem.matrices?.A;
    // Access scalar from problem.parameters.scalar (NOT problem.matrices.scalar)
    const scalar = problem.parameters?.scalar;

    if (!A) {
        throw new Error('Matrix required for scalar multiplication');
    }
    
    if (scalar === undefined || scalar === null) {
        throw new Error('Scalar value required for scalar multiplication');
    }

    const matrixA = math.matrix(A);
    const result = math.multiply(scalar, matrixA);

    return {
        operation: 'scalar_multiplication',
        matrix: { data: A, dimensions: matrixA.size() },
        scalar: scalar,
        result: { data: result.toArray(), dimensions: result.size() },
        verification: this.verifyScalarMultiplication(A, scalar, result.toArray()),
        category: 'scalar_multiplication'
    };
}

solveMatrixTranspose(problem) {
    const A = problem.matrices?.A;
    
    if (!A || !Array.isArray(A) || A.length === 0) {
        throw new Error('Valid matrix required for transpose');
    }

    const matrixA = math.matrix(A);
    const result = math.transpose(matrixA);

    return {
        operation: 'transpose',
        matrix: { data: A, dimensions: matrixA.size() },
        result: { data: result.toArray(), dimensions: result.size() },
        dimensionChange: `${matrixA.size()[0]}×${matrixA.size()[1]} → ${result.size()[0]}×${result.size()[1]}`,
        formula: '(Aᵀ)ᵢⱼ = aⱼᵢ',
        properties: {
            doubleTranspose: '(Aᵀ)ᵀ = A',
            sumTranspose: '(A + B)ᵀ = Aᵀ + Bᵀ',
            productTranspose: '(AB)ᵀ = BᵀAᵀ'
        },
        verification: this.verifyTranspose(A, result.toArray()),
        category: 'matrix_transpose'
    };
}

solveDeterminant(problem) {
    const A = problem.matrices?.A;

    if (!A || !Array.isArray(A) || A.length === 0) {
        throw new Error('Valid matrix required for determinant');
    }

    const matrixA = math.matrix(A);
    const size = matrixA.size();

    if (size[0] !== size[1]) {
        return {
            error: 'Not square matrix',
            matrix: { data: A, dimensions: size },
            message: 'Determinant is only defined for square matrices',
            category: 'determinant'
        };
    }

    const det = math.det(matrixA);
    const n = size[0];

    let method = '';
    let formula = '';

    if (n === 2) {
        method = 'Direct formula';
        formula = 'det(A) = a₁₁a₂₂ - a₁₂a₂₁';
    } else if (n === 3) {
        method = 'Cofactor expansion or Rule of Sarrus';
        formula = 'det(A) = Σ aᵢⱼCᵢⱼ (cofactor expansion)';
    } else {
        method = 'LU decomposition';
        formula = 'det(A) = Π uᵢᵢ (product of diagonal elements of U)';
    }

    return {
        operation: 'determinant',
        matrix: { data: A, dimensions: size },
        determinant: det,
        isInvertible: Math.abs(det) > 1e-10,
        method: method,
        formula: formula,
        interpretation: this.interpretDeterminant(det),
        category: 'determinant'
    };
}

solveMatrixInverse(problem) {
    const A = problem.matrices?.A;

    if (!A || !Array.isArray(A) || A.length === 0) {
        throw new Error('Valid matrix required for inverse');
    }

    const matrixA = math.matrix(A);
    const size = matrixA.size();

    if (size[0] !== size[1]) {
        return {
            error: 'Not square matrix',
            matrix: { data: A, dimensions: size },
            message: 'Inverse is only defined for square matrices',
            category: 'matrix_inverse'
        };
    }

    const det = math.det(matrixA);

    if (Math.abs(det) < 1e-10) {
        return {
            error: 'Singular matrix',
            matrix: { data: A, dimensions: size },
            determinant: det,
            message: 'Matrix is singular (det = 0) and cannot be inverted',
            category: 'matrix_inverse'
        };
    }

    const inverse = math.inv(matrixA);
    const n = size[0];

    let method = '';
    if (n === 2) {
        method = 'Direct formula: A⁻¹ = (1/det(A))·adj(A)';
    } else {
        method = 'Gauss-Jordan elimination: [A|I] → [I|A⁻¹]';
    }

    return {
        operation: 'matrix_inverse',
        matrix: { data: A, dimensions: size },
        determinant: det,
        inverse: { data: inverse.toArray(), dimensions: inverse.size() },
        method: method,
        verification: this.verifyInverse(A, inverse.toArray()),
        properties: {
            definition: 'AA⁻¹ = A⁻¹A = I',
            productInverse: '(AB)⁻¹ = B⁻¹A⁻¹',
            transposeInverse: '(Aᵀ)⁻¹ = (A⁻¹)ᵀ'
        },
        category: 'matrix_inverse'
    };
}

solveEigenvalues(problem) {
    const A = problem.matrices?.A;

    if (!A || !Array.isArray(A) || A.length === 0) {
        throw new Error('Valid matrix required for eigenvalue computation');
    }

    const matrixA = math.matrix(A);
    const size = matrixA.size();

    if (size[0] !== size[1]) {
        return {
            error: 'Not square matrix',
            matrix: { data: A, dimensions: size },
            message: 'Eigenvalues are only defined for square matrices',
            category: 'eigenvalues'
        };
    }

    try {
        const result = math.eigs(matrixA);
        
        return {
            operation: 'eigenvalues',
            matrix: { data: A, dimensions: size },
            eigenvalues: result.values,
            eigenvectors: result.vectors,
            characteristicEquation: 'det(A - λI) = 0',
            properties: {
                trace: `tr(A) = Σλᵢ = ${math.trace(matrixA)}`,
                determinant: `det(A) = Πλᵢ = ${math.det(matrixA)}`
            },
            verification: this.verifyEigenvalues(A, result.values, result.vectors),
            category: 'eigenvalues_eigenvectors'
        };
    } catch (error) {
        return {
            error: 'Eigenvalue computation failed',
            matrix: { data: A, dimensions: size },
            message: 'Eigenvalues could not be computed numerically',
            note: 'For analytical solutions, solve characteristic equation manually',
            category: 'eigenvalues_eigenvectors'
        };
    }
}

solveMatrixRank(problem) {
    const A = problem.matrices?.A;

    if (!A || !Array.isArray(A) || A.length === 0) {
        throw new Error('Valid matrix required for rank computation');
    }

    const matrixA = math.matrix(A);
    const size = matrixA.size();

    // Compute rank using SVD or row reduction
    let rank;
    try {
        // Use row echelon form to find rank
        const rref = this.computeRowEchelon(A);
        rank = this.countPivots(rref);
    } catch (error) {
        rank = math.rank(matrixA);
    }

    const maxRank = Math.min(size[0], size[1]);
    const isFullRank = rank === maxRank;

    return {
        operation: 'matrix_rank',
        matrix: { data: A, dimensions: size },
        rank: rank,
        maxPossibleRank: maxRank,
        isFullRank: isFullRank,
        nullity: size[1] - rank,
        rankNullityTheorem: `rank(A) + nullity(A) = ${rank} + ${size[1] - rank} = ${size[1]}`,
        interpretation: this.interpretRank(rank, maxRank, size),
        category: 'matrix_rank'
    };
}

solveRowEchelon(problem) {
    const A = problem.matrices?.A;

    if (!A || !Array.isArray(A) || A.length === 0) {
        throw new Error('Valid matrix required for row echelon form');
    }

    const ref = this.computeRowEchelon(A);
    const matrixA = math.matrix(A);

    return {
        operation: 'row_echelon_form',
        matrix: { data: A, dimensions: matrixA.size() },
        result: { data: ref, dimensions: [ref.length, ref[0].length] },
        pivotPositions: this.findPivots(ref),
        method: 'Gaussian elimination',
        properties: [
            'Leading entry (pivot) in each row is 1',
            'Pivot in each row is to the right of pivot in row above',
            'All entries below pivots are zero'
        ],
        category: 'row_echelon'
    };
}

solveReducedRowEchelon(problem) {
    const A = problem.matrices?.A;

    if (!A || !Array.isArray(A) || A.length === 0) {
        throw new Error('Valid matrix required for reduced row echelon form');
    }

    const matrixA = math.matrix(A);
    const rref = this.computeReducedRowEchelon(A);

    return {
        operation: 'reduced_row_echelon_form',
        matrix: { data: A, dimensions: matrixA.size() },
        result: { data: rref, dimensions: [rref.length, rref[0].length] },
        pivotPositions: this.findPivots(rref),
        method: 'Gauss-Jordan elimination',
        properties: [
            'Leading entry in each row is 1',
            'Each pivot is the only non-zero entry in its column',
            'All entries above and below pivots are zero'
        ],
        uniqueness: 'Every matrix has a unique reduced row echelon form',
        category: 'reduced_row_echelon'
    };
}

solveLUDecomposition(problem) {
    const A = problem.matrices?.A;

    if (!A || !Array.isArray(A) || A.length === 0) {
        throw new Error('Valid matrix required for LU decomposition');
    }

    const matrixA = math.matrix(A);
    const size = matrixA.size();

    if (size[0] !== size[1]) {
        return {
            error: 'Not square matrix',
            matrix: { data: A, dimensions: size },
            message: 'LU decomposition typically requires square matrix',
            category: 'lu_decomposition'
        };
    }

    try {
        const result = math.lup(matrixA);
        
        return {
            operation: 'lu_decomposition',
            matrix: { data: A, dimensions: size },
            L: { data: result.L.toArray(), dimensions: result.L.size() },
            U: { data: result.U.toArray(), dimensions: result.U.size() },
            P: { data: result.p, description: 'Permutation vector' },
            decomposition: 'PA = LU',
            verification: this.verifyLUDecomposition(A, result.L.toArray(), result.U.toArray(), result.p),
            applications: [
                'Solving linear systems efficiently',
                'Computing determinants',
                'Matrix inversion'
            ],
            category: 'lu_decomposition'
        };
    } catch (error) {
        return {
            error: 'LU decomposition failed',
            matrix: { data: A, dimensions: size },
            message: 'Matrix may be singular or ill-conditioned',
            category: 'lu_decomposition'
        };
    }
}

solveQRDecomposition(problem) {
    const A = problem.matrices?.A;

    if (!A || !Array.isArray(A) || A.length === 0) {
        throw new Error('Valid matrix required for QR decomposition');
    }

    const matrixA = math.matrix(A);
    const size = matrixA.size();

    try {
        const result = math.qr(matrixA);
        
        return {
            operation: 'qr_decomposition',
            matrix: { data: A, dimensions: size },
            Q: { data: result.Q.toArray(), dimensions: result.Q.size() },
            R: { data: result.R.toArray(), dimensions: result.R.size() },
            decomposition: 'A = QR',
            properties: {
                Q: 'Orthogonal matrix (QᵀQ = I)',
                R: 'Upper triangular matrix'
            },
            verification: this.verifyQRDecomposition(A, result.Q.toArray(), result.R.toArray()),
            applications: [
                'Least squares problems',
                'Eigenvalue algorithms',
                'Orthonormalization'
            ],
            category: 'qr_decomposition'
        };
    } catch (error) {
        return {
            error: 'QR decomposition failed',
            matrix: { data: A, dimensions: size },
            message: 'Decomposition could not be computed',
            category: 'qr_decomposition'
        };
    }
}

    // HELPER METHODS FOR ROW OPERATIONS

    computeRowEchelon(matrix) {
        const A = JSON.parse(JSON.stringify(matrix)); // Deep copy
        const m = A.length;
        const n = A[0].length;
        let pivotRow = 0;

        for (let col = 0; col < n && pivotRow < m; col++) {
            // Find pivot
            let maxRow = pivotRow;
            for (let row = pivotRow + 1; row < m; row++) {
                if (Math.abs(A[row][col]) > Math.abs(A[maxRow][col])) {
                    maxRow = row;
                }
            }

            if (Math.abs(A[maxRow][col]) < 1e-10) {
                continue; // No pivot in this column
            }

            // Swap rows
            [A[pivotRow], A[maxRow]] = [A[maxRow], A[pivotRow]];

            // Eliminate below
            for (let row = pivotRow + 1; row < m; row++) {
                const factor = A[row][col] / A[pivotRow][col];
                for (let c = col; c < n; c++) {
                    A[row][c] -= factor * A[pivotRow][c];
                }
            }

            pivotRow++;
        }

        return A;
    }

    computeReducedRowEchelon(matrix) {
        const A = this.computeRowEchelon(matrix);
        const m = A.length;
        const n = A[0].length;

        // Back substitution
        for (let row = m - 1; row >= 0; row--) {
            // Find pivot column
            let pivotCol = -1;
            for (let col = 0; col < n; col++) {
                if (Math.abs(A[row][col]) > 1e-10) {
                    pivotCol = col;
                    break;
                }
            }

            if (pivotCol === -1) continue;

            // Scale row to make pivot = 1
            const pivot = A[row][pivotCol];
            for (let col = 0; col < n; col++) {
                A[row][col] /= pivot;
            }

            // Eliminate above
            for (let r = 0; r < row; r++) {
                const factor = A[r][pivotCol];
                for (let col = 0; col < n; col++) {
                    A[r][col] -= factor * A[row][col];
                }
            }
        }

        return A;
    }

    findPivots(matrix) {
        const pivots = [];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (Math.abs(matrix[i][j] - 1) < 1e-10) {
                    // Check if this is the leading 1 in the row
                    let isLeading = true;
                    for (let k = 0; k < j; k++) {
                        if (Math.abs(matrix[i][k]) > 1e-10) {
                            isLeading = false;
                            break;
                        }
                    }
                    if (isLeading) {
                        pivots.push({ row: i, col: j });
                        break;
                    }
                }
            }
        }
        return pivots;
    }

    countPivots(matrix) {
        return this.findPivots(matrix).length;
    }

    // VERIFICATION METHODS

    verifyMatrixOperation(A, B, result, operation) {
        const tolerance = 1e-10;
        let isValid = true;

        for (let i = 0; i < A.length; i++) {
            for (let j = 0; j < A[i].length; j++) {
                let expected;
                if (operation === 'add') {
                    expected = A[i][j] + B[i][j];
                } else if (operation === 'subtract') {
                    expected = A[i][j] - B[i][j];
                }
                
                if (Math.abs(result[i][j] - expected) > tolerance) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid) break;
        }

        return {
            isValid: isValid,
            tolerance: tolerance,
            method: 'Element-wise comparison'
        };
    }

    verifyScalarMultiplication(A, scalar, result) {
        const tolerance = 1e-10;
        let isValid = true;

        for (let i = 0; i < A.length; i++) {
            for (let j = 0; j < A[i].length; j++) {
                const expected = scalar * A[i][j];
                if (Math.abs(result[i][j] - expected) > tolerance) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid) break;
        }

        return {
            isValid: isValid,
            tolerance: tolerance,
            formula: 'Each element multiplied by scalar'
        };
    }

    verifyMatrixMultiplication(A, B, result) {
        const tolerance = 1e-10;
        let isValid = true;
        const sampleVerifications = [];

        // Verify a few sample elements
        const samplesToCheck = Math.min(3, result.length);
        
        for (let i = 0; i < samplesToCheck; i++) {
            for (let j = 0; j < Math.min(3, result[i].length); j++) {
                let expected = 0;
                for (let k = 0; k < B.length; k++) {
                    expected += A[i][k] * B[k][j];
                }
                
                const diff = Math.abs(result[i][j] - expected);
                sampleVerifications.push({
                    position: `(${i},${j})`,
                    computed: result[i][j],
                    expected: expected,
                    difference: diff,
                    valid: diff < tolerance
                });

                if (diff > tolerance) {
                    isValid = false;
                }
            }
        }

        return {
            isValid: isValid,
            tolerance: tolerance,
            sampleVerifications: sampleVerifications,
            formula: '(AB)ᵢⱼ = Σₖ aᵢₖ·bₖⱼ'
        };
    }

    verifyTranspose(A, AT) {
        const tolerance = 1e-10;
        let isValid = true;

        for (let i = 0; i < A.length; i++) {
            for (let j = 0; j < A[i].length; j++) {
                if (Math.abs(A[i][j] - AT[j][i]) > tolerance) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid) break;
        }

        return {
            isValid: isValid,
            tolerance: tolerance,
            property: '(Aᵀ)ᵢⱼ = aⱼᵢ verified'
        };
    }

    verifyInverse(A, Ainv) {
        const matrixA = math.matrix(A);
        const matrixAinv = math.matrix(Ainv);
        const product = math.multiply(matrixA, matrixAinv);
        const identity = math.identity(A.length);
        
        const diff = math.subtract(product, identity);
        const maxDiff = math.max(math.abs(diff));

        return {
            isValid: maxDiff < 1e-8,
            maxDifference: maxDiff,
            property: 'AA⁻¹ = I verified',
            productMatrix: product.toArray()
        };
    }

    verifySystemSolution(A, B, X) {
        const matrixA = math.matrix(A);
        const matrixX = math.matrix(X);
        const computedB = math.multiply(matrixA, matrixX);
        
        const matrixB = math.matrix(B);
        const diff = math.subtract(computedB, matrixB);
        const maxDiff = math.max(math.abs(diff));

        return {
            isValid: maxDiff < 1e-8,
            maxDifference: maxDiff,
            property: 'AX = B verified',
            computedB: computedB.toArray()
        };
    }

    verifyEigenvalues(A, eigenvalues, eigenvectors) {
        // Verify Av = λv for each eigenvalue/eigenvector pair
        const verifications = [];
        
        for (let i = 0; i < eigenvalues.length; i++) {
            const lambda = eigenvalues[i];
            const v = eigenvectors[i];
            
            // Compute Av
            const matrixA = math.matrix(A);
            const vectorV = math.matrix(v);
            const Av = math.multiply(matrixA, vectorV);
            
            // Compute λv
            const lambdaV = math.multiply(lambda, vectorV);
            
            // Compare
            const diff = math.subtract(Av, lambdaV);
            const maxDiff = math.max(math.abs(diff));
            
            verifications.push({
                eigenvalue: lambda,
                eigenvector: v,
                isValid: maxDiff < 1e-8,
                maxDifference: maxDiff
            });
        }

        return {
            verifications: verifications,
            allValid: verifications.every(v => v.isValid)
        };
    }

    verifyLUDecomposition(A, L, U, P) {
        const matrixL = math.matrix(L);
        const matrixU = math.matrix(U);
        const product = math.multiply(matrixL, matrixU);
        
        // Apply permutation
        const permutedA = [];
        for (let i = 0; i < P.length; i++) {
            permutedA.push(A[P[i]]);
        }
        
        const diff = math.subtract(product, math.matrix(permutedA));
        const maxDiff = math.max(math.abs(diff));

        return {
            isValid: maxDiff < 1e-8,
            maxDifference: maxDiff,
            property: 'PA = LU verified'
        };
    }

    verifyQRDecomposition(A, Q, R) {
        const matrixQ = math.matrix(Q);
        const matrixR = math.matrix(R);
        const product = math.multiply(matrixQ, matrixR);
        const matrixA = math.matrix(A);
        
        const diff = math.subtract(product, matrixA);
        const maxDiff = math.max(math.abs(diff));

        // Verify Q is orthogonal
        const QTQ = math.multiply(math.transpose(matrixQ), matrixQ);
        const identity = math.identity(Q.length);
        const orthoDiff = math.subtract(QTQ, identity);
        const maxOrthoDiff = math.max(math.abs(orthoDiff));

        return {
            isValid: maxDiff < 1e-8 && maxOrthoDiff < 1e-8,
            productDifference: maxDiff,
            orthogonalityDifference: maxOrthoDiff,
            properties: ['A = QR verified', 'QᵀQ = I verified']
        };
    }

    // INTERPRETATION METHODS

    interpretDeterminant(det) {
        const interpretations = [];
        
        if (Math.abs(det) < 1e-10) {
            interpretations.push('Matrix is singular (not invertible)');
            interpretations.push('Columns/rows are linearly dependent');
            interpretations.push('Transformation collapses space to lower dimension');
        } else {
            interpretations.push('Matrix is invertible');
            interpretations.push('Columns/rows are linearly independent');
            if (det > 0) {
                interpretations.push('Transformation preserves orientation');
            } else {
                interpretations.push('Transformation reverses orientation');
            }
            interpretations.push(`Volume scaling factor: ${Math.abs(det)}`);
        }

        return interpretations;
    }

    interpretRank(rank, maxRank, dimensions) {
        const interpretations = [];
        
        interpretations.push(`Matrix has ${rank} linearly independent rows/columns`);
        
        if (rank === maxRank) {
            interpretations.push('Matrix has full rank');
            if (dimensions[0] === dimensions[1]) {
                interpretations.push('Matrix is invertible (square and full rank)');
            }
        } else {
            interpretations.push(`Matrix is rank deficient (rank < ${maxRank})`);
            interpretations.push(`Nullity = ${dimensions[1] - rank}`);
        }

        return interpretations;
    }

    // STEP GENERATION WITH ENHANCED EXPLANATIONS

    generateMatrixSteps(problem, solution) {
        let baseSteps = this.generateBaseMatrixSteps(problem, solution);

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

    generateBaseMatrixSteps(problem, solution) {
        const { type } = problem;

        switch (type) {
            case 'matrix_addition':
                return this.generateMatrixAdditionSteps(problem, solution);
            case 'matrix_multiplication':
                return this.generateMatrixMultiplicationSteps(problem, solution);
            case 'determinant':
                return this.generateDeterminantSteps(problem, solution);
            case 'matrix_inverse':
                return this.generateMatrixInverseSteps(problem, solution);
            case 'solve_system':
                return this.generateSystemSolutionSteps(problem, solution);
            default:
                return this.generateGenericMatrixSteps(problem, solution);
        }
    }

    generateMatrixAdditionSteps(problem, solution) {
        const steps = [];

        if (solution.error) {
            steps.push({
                stepNumber: 1,
                step: 'Check dimensions',
                description: 'Verify matrices have compatible dimensions',
                matrixA: solution.matrixA,
                matrixB: solution.matrixB,
                reasoning: 'Matrix addition requires same dimensions',
                error: solution.message,
                rule: 'Both matrices must be m×n',
                category: 'dimension_check'
            });
            return steps;
        }

        steps.push({
            stepNumber: 1,
            step: 'Verify dimensions',
            description: 'Check that both matrices have the same dimensions',
            matrixA: solution.matrixA,
            matrixB: solution.matrixB,
            reasoning: 'Addition/subtraction is only defined for matrices of identical size',
            algebraicRule: 'Element-wise operations require dimension compatibility',
            visualHint: 'Each element in A pairs with corresponding element in B',
            goalStatement: `Both matrices are ${solution.matrixA.dimensions[0]}×${solution.matrixA.dimensions[1]}, so operation is valid`
        });

        steps.push({
            stepNumber: 2,
            step: `Perform element-wise ${solution.operation}`,
            description: `${solution.operation === 'add' ? 'Add' : 'Subtract'} corresponding elements`,
            operation: solution.operationSymbol,
            formula: `(A ${solution.operationSymbol} B)ᵢⱼ = aᵢⱼ ${solution.operationSymbol} bᵢⱼ`,
            reasoning: `Each element in result is computed independently`,
            visualHint: 'Process each position: combine elements at same row and column',
            result: solution.result,
            finalAnswer: true
        });

        return steps;
    }

    generateMatrixMultiplicationSteps(problem, solution) {
        const steps = [];

        if (solution.error) {
            steps.push({
                stepNumber: 1,
                step: 'Check dimension compatibility',
                description: 'Verify dimensions allow multiplication',
                matrixA: solution.matrixA,
                matrixB: solution.matrixB,
                reasoning: 'Columns of first matrix must equal rows of second',
                error: solution.message,
                rule: solution.rule,
                visualHint: 'Think: (m×n)·(n×p) → middle dimensions must match',
                category: 'dimension_check'
            });
            return steps;
        }

        steps.push({
            stepNumber: 1,
            step: 'Verify dimension compatibility',
            description: 'Check multiplication is defined',
            matrixA: solution.matrixA,
            matrixB: solution.matrixB,
            dimensionRule: solution.dimensionRule,
            reasoning: `Columns of A (${solution.matrixA.dimensions[1]}) = Rows of B (${solution.matrixB.dimensions[0]})`,
            algebraicRule: 'Inner dimensions must match',
            visualHint: 'Result will be outer dimensions: rows of A × columns of B',
            goalStatement: `Result will be ${solution.result.dimensions[0]}×${solution.result.dimensions[1]}`
        });

        steps.push({
            stepNumber: 2,
            step: 'Compute dot products',
            description: 'Calculate each element as row·column dot product',
            formula: solution.elementFormula,
            reasoning: 'Element (i,j) = sum of products of row i from A and column j from B',
            visualHint: 'For each position in result, multiply corresponding elements and sum',
            algebraicRule: 'Matrix multiplication is composition of linear transformations',
            procedure: [
                'Select row i from matrix A',
                'Select column j from matrix B',
                'Multiply corresponding elements',
                'Sum all products to get result[i][j]'
            ]
        });

        steps.push({
            stepNumber: 3,
            step: 'Assemble result matrix',
            description: 'Collect all computed elements into result matrix',
            result: solution.result,
            dimensionCheck: `Result is ${solution.result.dimensions[0]}×${solution.result.dimensions[1]} as expected`,
            finalAnswer: true
        });

        return steps;
    }

    generateDeterminantSteps(problem, solution) {
        const steps = [];
        const n = solution.matrix.dimensions[0];

        if (solution.error) {
            steps.push({
                stepNumber: 1,
                step: 'Check if matrix is square',
                description: 'Verify determinant is defined',
                matrix: solution.matrix,
                error: solution.message,
                rule: 'Determinant only defined for square matrices (n×n)',
                category: 'dimension_check'
            });
            return steps;
        }

        steps.push({
            stepNumber: 1,
            step: 'Verify square matrix',
            description: 'Confirm matrix is n×n',
            matrix: solution.matrix,
            reasoning: 'Determinant requires equal number of rows and columns',
            goalStatement: `Matrix is ${n}×${n}, determinant can be computed`
        });

        if (n === 2) {
            steps.push({
                stepNumber: 2,
                step: 'Apply 2×2 determinant formula',
                description: 'Use direct formula for 2×2 matrix',
                formula: 'det(A) = a₁₁a₂₂ - a₁₂a₂₁',
                reasoning: 'For 2×2, determinant is product of diagonal minus product of anti-diagonal',
                visualHint: 'Main diagonal products minus off-diagonal products',
                calculation: `(${solution.matrix.data[0][0]})(${solution.matrix.data[1][1]}) - (${solution.matrix.data[0][1]})(${solution.matrix.data[1][0]})`,
                determinant: solution.determinant,
                finalAnswer: true
            });
        } else if (n === 3) {
            steps.push({
                stepNumber: 2,
                step: 'Choose method',
                description: 'Select cofactor expansion or Rule of Sarrus',
                method: solution.method,
                formula: solution.formula,
                reasoning: 'For 3×3, multiple methods available with similar complexity'
            });

            steps.push({
                stepNumber: 3,
                step: 'Compute determinant',
                description: 'Execute chosen method',
                determinant: solution.determinant,
                finalAnswer: true
            });
        } else {
            steps.push({
                stepNumber: 2,
                step: 'Use computational method',
                description: 'Apply LU decomposition for efficiency',
                method: solution.method,
                formula: solution.formula,
                reasoning: 'For large matrices, direct computation is inefficient',
                determinant: solution.determinant,
                finalAnswer: true
            });
        }

        steps.push({
            stepNumber: n === 2 ? 3 : 4,
            step: 'Interpret result',
            description: 'Understand geometric and algebraic meaning',
            determinant: solution.determinant,
            isInvertible: solution.isInvertible,
            interpretations: solution.interpretation,
            reasoning: 'Determinant reveals key matrix properties'
        });

        return steps;
    }

    generateMatrixInverseSteps(problem, solution) {
        const steps = [];

        if (solution.error) {
            steps.push({
                stepNumber: 1,
                step: 'Check invertibility',
                description: 'Verify matrix can be inverted',
                matrix: solution.matrix,
                error: solution.message,
                reasoning: solution.error === 'Singular matrix' ? 
                    'Matrix with zero determinant has no inverse' :
                    'Only square matrices can have inverses',
                category: 'invertibility_check'
            });
            return steps;
        }

        steps.push({
            stepNumber: 1,
            step: 'Verify square matrix',
            description: 'Confirm matrix is n×n',
            matrix: solution.matrix,
            reasoning: 'Inverse only defined for square matrices',
            goalStatement: `Matrix is ${solution.matrix.dimensions[0]}×${solution.matrix.dimensions[0]}`
        });

        steps.push({
            stepNumber: 2,
            step: 'Compute determinant',
            description: 'Check if matrix is invertible',
            determinant: solution.determinant,
            reasoning: 'Non-zero determinant confirms invertibility',
            algebraicRule: 'det(A) ≠ 0 ⟺ A is invertible',
            criticalCheck: solution.determinant !== 0 ? 'Matrix is invertible' : 'Matrix is singular'
        });

        const n = solution.matrix.dimensions[0];
        if (n === 2) {
            steps.push({
                stepNumber: 3,
                step: 'Apply 2×2 inverse formula',
                description: 'Use direct formula',
                formula: 'A⁻¹ = (1/det(A))[[d,-b],[-c,a]]',
                reasoning: 'For 2×2 matrices, swap diagonals, negate off-diagonals, divide by determinant',
                visualHint: 'Swap main diagonal, flip signs of anti-diagonal, scale by 1/det'
            });
        } else {
            steps.push({
                stepNumber: 3,
                step: 'Set up augmented matrix',
                description: 'Form [A|I] for Gauss-Jordan elimination',
                method: solution.method,
                reasoning: 'Row reduce [A|I] to [I|A⁻¹]',
                algebraicRule: 'Elementary row operations transform A to I while transforming I to A⁻¹'
            });

            steps.push({
                stepNumber: 4,
                step: 'Perform row reduction',
                description: 'Apply Gauss-Jordan elimination',
                reasoning: 'Systematic row operations convert left side to identity matrix'
            });
        }

        steps.push({
            stepNumber: n === 2 ? 4 : 5,
            step: 'Obtain inverse matrix',
            description: 'Extract computed inverse',
            inverse: solution.inverse,
            finalAnswer: true
        });

        return steps;
    }

    generateSystemSolutionSteps(problem, solution) {
        const steps = [];

        if (solution.error) {
            steps.push({
                stepNumber: 1,
                step: 'Analyze system',
                description: 'Check if system has unique solution',
                coefficientMatrix: solution.coefficientMatrix,
                determinant: solution.determinant,
                error: solution.message,
                reasoning: 'Zero determinant means no unique solution exists',
                category: 'system_analysis'
            });
            return steps;
        }

        steps.push({
            stepNumber: 1,
            step: 'Write in matrix form',
            description: 'Express system as AX = B',
            coefficientMatrix: solution.coefficientMatrix,
            constants: solution.constants,
            matrixForm: solution.matrixForm,
            reasoning: 'Matrix notation provides compact representation and enables systematic solution',
            visualHint: 'A contains coefficients, X contains variables, B contains constants'
        });

        steps.push({
            stepNumber: 2,
            step: 'Choose solution method',
            description: 'Select appropriate technique',
            method: solution.method,
            reasoning: 'LU decomposition is efficient and numerically stable',
            alternatives: [
                'Direct: X = A⁻¹B (if A⁻¹ exists)',
                'LU: Solve LY = B, then UX = Y',
                'Gauss-Jordan: Row reduce [A|B]'
            ]
        });

        steps.push({
            stepNumber: 3,
            step: 'Execute solution algorithm',
            description: 'Apply chosen method to find X',
            solutionFormula: solution.solutionFormula,
            reasoning: 'Systematic computation yields variable values'
        });

        steps.push({
            stepNumber: 4,
            step: 'Extract solution',
            description: 'Read solution values',
            solution: solution.solution,
            reasoning: 'Solution vector X contains values for all variables',
            finalAnswer: true
        });

        return steps;
    }

    generateGenericMatrixSteps(problem, solution) {
        return [{
            stepNumber: 1,
            step: 'Matrix operation',
            description: 'Perform the requested matrix computation',
            operation: problem.type,
            result: solution,
            reasoning: 'Apply appropriate matrix algorithm for this operation'
        }];
    }

    // ENHANCED EXPLANATION METHODS

    enhanceStepExplanation(step, problem, solution, stepIndex, totalSteps) {
        const enhanced = {
            ...step,
            stepNumber: stepIndex + 1,
            totalSteps: totalSteps,

            // Multiple explanation formats
            explanations: {
                conceptual: this.getConceptualMatrixExplanation(step, problem),
                procedural: this.getProceduralMatrixExplanation(step),
                visual: this.getVisualMatrixExplanation(step, problem),
                algebraic: this.getAlgebraicMatrixExplanation(step)
            },

            // Difficulty-adapted explanations
            adaptiveExplanation: this.getAdaptiveExplanation(step, this.explanationLevel),

            // Learning support
            learningSupport: {
                prerequisiteSkills: this.identifyMatrixPrerequisites(step, problem.type),
                keyVocabulary: this.identifyMatrixVocabulary(step),
                connectionsToPrevious: stepIndex > 0 ? this.connectToPreviousStep(step, stepIndex) : null
            }
        };

        return enhanced;
    }

    getConceptualMatrixExplanation(step, problem) {
        const conceptualExplanations = {
            'Verify dimensions': 'Matrices are like tables of numbers. For certain operations, the tables must be the same size or have compatible sizes.',
            'Perform element-wise add': 'Adding matrices is like combining two data tables: each cell adds to its corresponding cell.',
            'Compute dot products': 'Matrix multiplication combines rows and columns: it\'s like finding weighted sums where each row meets each column.',
            'Compute determinant': 'The determinant measures how much a matrix stretches or shrinks space. Zero means the matrix squashes space flat.',
            'Compute inverse': 'Finding the inverse is like finding the "undo" operation: A⁻¹ reverses what A does.'
        };

        return conceptualExplanations[step.step] || 'This step performs a fundamental matrix operation.';
    }

    getProceduralMatrixExplanation(step) {
        if (step.procedure) {
            return step.procedure.map((p, i) => `${i + 1}. ${p}`).join('\n');
        }

        const procedural = {
            'Verify dimensions': '1. Count rows in matrix A\n2. Count columns in matrix A\n3. Repeat for matrix B\n4. Compare dimensions',
            'Compute dot products': '1. Select row i from A\n2. Select column j from B\n3. Multiply element-by-element\n4. Sum all products',
            'Apply 2×2 determinant formula': '1. Multiply top-left by bottom-right\n2. Multiply top-right by bottom-left\n3. Subtract second product from first'
        };

        return procedural[step.step] || 'Follow standard matrix operation procedure.';
    }

    getVisualMatrixExplanation(step, problem) {
        const visualExplanations = {
            'matrix_addition': 'Imagine two grids of numbers overlaying each other - combine numbers in matching positions.',
            'matrix_multiplication': 'Picture sliding each row of the first matrix across each column of the second, multiplying and adding as you go.',
            'determinant': 'The determinant represents the volume scaling factor when the matrix transforms space.',
            'matrix_inverse': 'The inverse undoes the transformation: if A rotates and scales, A⁻¹ scales back and rotates in reverse.',
            'transpose': 'Flip the matrix across its diagonal: rows become columns and columns become rows.'
        };

        return visualExplanations[problem.type] || 'Visualize the matrix operation geometrically.';
    }

    getAlgebraicMatrixExplanation(step) {
        const algebraicRules = {
            'Verify dimensions': 'Dimension compatibility: operations require specific size relationships',
            'Perform element-wise add': 'Commutative: A + B = B + A; Associative: (A + B) + C = A + (B + C)',
            'Compute dot products': 'NOT commutative: AB ≠ BA generally; Associative: (AB)C = A(BC)',
            'Compute determinant': 'det(AB) = det(A)·det(B); det(Aᵀ) = det(A)',
            'Compute inverse': 'AA⁻¹ = A⁻¹A = I; (AB)⁻¹ = B⁻¹A⁻¹'
        };

        return algebraicRules[step.step] || 'Apply formal matrix algebra rules and properties.';
    }

    identifyMatrixPrerequisites(step, problemType) {
        const prerequisites = {
            'Verify dimensions': ['Counting rows and columns', 'Understanding matrix structure'],
            'Perform element-wise add': ['Basic arithmetic', 'Array indexing'],
            'Compute dot products': ['Multiplication and addition', 'Summation notation'],
            'Compute determinant': ['Matrix multiplication', 'Understanding of linear independence'],
            'Compute inverse': ['Determinant calculation', 'Row operations', 'Identity matrix concept']
        };

        return prerequisites[step.step] || ['Basic matrix concepts'];
    }

    identifyMatrixVocabulary(step) {
        const vocabulary = {
            'Verify dimensions': ['matrix', 'dimensions', 'rows', 'columns', 'compatibility'],
            'Perform element-wise add': ['element', 'corresponding', 'element-wise', 'position'],
            'Compute dot products': ['dot product', 'inner product', 'row', 'column', 'summation'],
            'Compute determinant': ['determinant', 'singular', 'invertible', 'scalar'],
            'Compute inverse': ['inverse', 'identity matrix', 'row operations', 'augmented matrix']
        };

        return vocabulary[step.step] || [];
    }

    addStepBridges(steps, problem) {
        const enhancedSteps = [];

        for (let i = 0; i < steps.length; i++) {
            enhancedSteps.push(steps[i]);

            if (i < steps.length - 1) {
                enhancedSteps.push({
                    stepType: 'bridge',
                    title: 'Connecting to Next Step',
                    explanation: this.generateMatrixStepBridge(steps[i], steps[i + 1]),
                    reasoning: this.explainMatrixStepProgression(steps[i], steps[i + 1]),
                    strategicThinking: this.explainMatrixStepStrategy(steps[i + 1])
                });
            }
        }

        return enhancedSteps;
    }

    generateMatrixStepBridge(currentStep, nextStep) {
        return {
            currentState: `We have completed: ${currentStep.description}`,
            nextGoal: `Next we will: ${nextStep.description}`,
            why: `This is necessary to continue the ${this.currentProblem.type} operation`,
            howItHelps: `This moves us closer to the final result`
        };
    }

    explainMatrixStepProgression(currentStep, nextStep) {
        return `After ${currentStep.step}, we proceed to ${nextStep.step} to continue solving the matrix problem`;
    }

    explainMatrixStepStrategy(nextStep) {
        return `The strategy for "${nextStep.step}" is to ${nextStep.description.toLowerCase()}`;
    }

    addErrorPrevention(step, problemType) {
        const mistakes = this.commonMistakes[problemType]?.[step.step] || [];

        return {
            ...step,
            errorPrevention: {
                commonMistakes: mistakes,
                preventionTips: this.generateMatrixPreventionTips(step, problemType),
                checkPoints: this.generateMatrixCheckPoints(step),
                warningFlags: this.identifyMatrixWarningFlags(step, problemType)
            },
            validation: {
                selfCheck: this.generateMatrixSelfCheckQuestion(step),
                expectedResult: this.describeMatrixExpectedResult(step),
                troubleshooting: this.generateMatrixTroubleshootingTips(step)
            }
        };
    }

    generateMatrixPreventionTips(step, problemType) {
        const tips = {
            'Check dimensions': [
                'Write dimensions explicitly before starting',
                'Draw dimension diagram: (m×n)·(n×p)',
                'Verify compatibility before computing'
            ],
            'Compute dot products': [
                'Keep track of which row and column you\'re on',
                'Double-check arithmetic in summation',
                'Verify you\'re using correct number of terms'
            ],
            'Compute determinant': [
                'Be careful with sign patterns in cofactor expansion',
                'Check arithmetic at each step',
                'Verify final sign is correct'
            ]
        };

        return tips[step.step] || ['Double-check calculations', 'Verify dimensions'];
    }

    generateMatrixCheckPoints(step) {
        return [
            'Verify dimensions are compatible',
            'Check arithmetic calculations',
            'Ensure proper indexing (row, column)',
            'Confirm result dimensions are correct'
        ];
    }

    identifyMatrixWarningFlags(step, problemType) {
        const warnings = {
            matrix_multiplication: step.step === 'Check dimension compatibility' ?
                ['Columns of A must equal rows of B'] : [],
            determinant: step.step === 'Compute determinant' ?
                ['Watch for sign errors in cofactor expansion'] : [],
            matrix_inverse: step.step === 'Check invertibility' ?
                ['Zero determinant means no inverse exists'] : []
        };

        return warnings[problemType] || [];
    }

    generateMatrixSelfCheckQuestion(step) {
        const questions = {
            'Verify dimensions': 'Did I count the rows and columns correctly?',
            'Compute dot products': 'Did I multiply the correct row by the correct column?',
            'Compute determinant': 'Did I apply the correct signs in my calculation?',
            'Compute inverse': 'Does my result satisfy AA⁻¹ = I?'
        };

        return questions[step.step] || 'Does this step make sense and move toward the solution?';
    }

    describeMatrixExpectedResult(step) {
        const expectations = {
            'Verify dimensions': 'Dimensions should be compatible for the operation',
            'Perform element-wise add': 'Result should have same dimensions as inputs',
            'Compute dot products': 'Each element is a sum of products',
            'Compute determinant': 'Result is a single scalar value',
            'Compute inverse': 'Result matrix when multiplied by original gives identity'
        };

        return expectations[step.step] || 'The step should progress toward the solution';
    }

    generateMatrixTroubleshootingTips(step) {
        return [
            'If dimensions don\'t match, review the operation requirements',
            'Check for arithmetic errors in calculations',
            'Verify you\'re using correct row and column indices',
            'Consider using smaller test matrices to verify method'
        ];
    }

    addScaffolding(steps, problem) {
        return steps.map((step, index) => ({
            ...step,
            scaffolding: {
                guidingQuestions: this.generateMatrixGuidingQuestions(step, problem),
                subSteps: this.breakMatrixIntoSubSteps(step),
                hints: this.generateMatrixProgressiveHints(step),
                practiceVariation: this.generateMatrixPracticeVariation(step, problem)
            },
            metacognition: {
                thinkingProcess: this.explainMatrixThinkingProcess(step),
                decisionPoints: this.identifyMatrixDecisionPoints(step),
                alternativeApproaches: this.suggestMatrixAlternativeMethods(step, problem)
            }
        }));
    }

    generateMatrixGuidingQuestions(step, problem) {
        const questions = {
            'Verify dimensions': [
                'What are the dimensions of each matrix?',
                'Are these dimensions compatible for this operation?',
                'What will be the dimensions of the result?'
            ],
            'Compute dot products': [
                'Which row and column am I currently computing?',
                'How many multiplications will I need?',
                'Did I sum all the products correctly?'
            ],
            'Compute determinant': [
                'Is this matrix square?',
                'Which method is most appropriate for this size?',
                'What does the determinant tell us about this matrix?'
            ]
        };

        return questions[step.step] || ['What is the purpose of this step?', 'How does it help solve the problem?'];
    }

    breakMatrixIntoSubSteps(step) {
        if (step.procedure) {
            return step.procedure;
        }

        const subSteps = {
            'Compute dot products': [
                'Select the current row from first matrix',
                'Select the current column from second matrix',
                'Multiply first elements together',
                'Continue for all pairs of elements',
                'Sum all the products',
                'Place result in correct position'
            ],
            'Compute determinant': [
                'Verify matrix is square',
                'Choose appropriate method based on size',
                'Execute calculation systematically',
                'Check sign and arithmetic',
                'Interpret the result'
            ]
        };

        return subSteps[step.step] || ['Analyze the step', 'Execute the operation', 'Verify the result'];
    }

    generateMatrixProgressiveHints(step) {
        return {
            level1: 'Think about what this matrix operation means geometrically.',
            level2: 'Remember to check dimensions and compatibility first.',
            level3: 'Follow the systematic procedure for this type of operation.',
            level4: step.formula ? `Use the formula: ${step.formula}` : 'Apply the standard algorithm step by step.'
        };
    }

    generateMatrixPracticeVariation(step, problem) {
        return {
            similarProblem: 'Try the same operation with 2×2 matrices first',
            practiceHint: 'Start with simple integer matrices before using decimals',
            extension: 'Once comfortable, try with larger matrices or special types (symmetric, diagonal, etc.)'
        };
    }

    explainMatrixThinkingProcess(step) {
        return {
            observe: 'What matrices am I working with and what are their properties?',
            goal: 'What result am I trying to compute?',
            strategy: 'What operation or algorithm should I apply?',
            execute: 'How do I carry out this operation correctly?',
            verify: 'Does my result make sense? Can I check it?'
        };
    }

    identifyMatrixDecisionPoints(step) {
        return [
            'Choosing which method to use for the operation',
            'Deciding order of operations',
            'Selecting efficient computational approach',
            'Determining when to verify intermediate results'
        ];
    }

    suggestMatrixAlternativeMethods(step, problem) {
        const alternatives = {
            'Compute determinant': [
                'Cofactor expansion along any row or column',
                'Rule of Sarrus (for 3×3 only)',
                'LU decomposition method',
                'Row reduction to triangular form'
            ],
            'Compute inverse': [
                'Adjugate method: A⁻¹ = (1/det)adj(A)',
                'Gauss-Jordan elimination: [A|I] → [I|A⁻¹]',
                'LU decomposition approach',
                'Cramer\'s rule for systems'
            ],
            'solve_system': [
                'Direct inversion: X = A⁻¹B',
                'LU decomposition',
                'Gauss-Jordan elimination',
                'Cramer\'s rule',
                'Iterative methods (for large systems)'
            ]
        };

        return alternatives[problem.type] || ['Multiple approaches exist depending on matrix properties'];
    }

    // WORKBOOK GENERATION

    generateMatrixWorkbook() {
        if (!this.currentSolution || !this.currentProblem) return;

        const workbook = this.createWorkbookStructure();

        workbook.sections = [
            this.createMatrixProblemSection(),
            this.createMatrixLessonSection(),
            this.createEnhancedMatrixStepsSection(),
            this.createMatrixSolutionSection(),
            this.createMatrixAnalysisSection(),
            this.createMatrixVerificationSection(),
            this.createMatrixPedagogicalNotesSection(),
            this.createMatrixAlternativeMethodsSection(),
            this.createMatrixVisualizationSection()
        ].filter(section => section !== null);

        this.currentWorkbook = workbook;
    }

    createWorkbookStructure() {
        return {
            title: 'Enhanced Matrix Mathematical Workbook',
            timestamp: new Date().toISOString(),
            theme: this.theme,
            dimensions: { width: this.width, height: this.height },
            sections: []
        };
    }

    createMatrixProblemSection() {
        if (!this.currentProblem) return null;

        const data = [
            ['Problem Type', this.matrixTypes[this.currentProblem.type]?.name || this.currentProblem.type],
            ['Category', this.matrixTypes[this.currentProblem.type]?.category || 'N/A'],
            ['Description', this.matrixTypes[this.currentProblem.type]?.description || 'Matrix operation'],
            ['Operation', this.currentProblem.operation || this.currentProblem.type]
        ];

        // Add matrix inputs if present
        if (this.currentProblem.matrices) {
            Object.keys(this.currentProblem.matrices).forEach(key => {
                if (Array.isArray(this.currentProblem.matrices[key])) {
                    data.push(['', '']); // Spacing
                    data.push([`Matrix ${key}`, this.formatMatrixForDisplay(this.currentProblem.matrices[key])]);
                } else if (typeof this.currentProblem.matrices[key] === 'number') {
                    data.push([`Scalar ${key}`, this.currentProblem.matrices[key]]);
                }
            });
        }

        return {
            title: 'Problem Statement',
            type: 'problem',
            data: data
        };
    }

    createMatrixLessonSection() {
        const problemType = this.currentProblem.type;
        const lessonKey = this.mapProblemTypeToLesson(problemType);
        const lesson = this.lessons[lessonKey];

        if (!lesson) return null;

        const data = [
            ['Topic', lesson.title],
            ['', ''], // Spacing
            ['Theory', lesson.theory],
            ['', ''] // Spacing
        ];

        // Add key concepts
        data.push(['Key Concepts', '']);
        lesson.concepts.forEach(concept => {
            data.push(['  •', concept]);
        });

        data.push(['', '']); // Spacing

        // Add formulas
        if (lesson.keyFormulas) {
            data.push(['Important Formulas', '']);
            Object.entries(lesson.keyFormulas).forEach(([name, formula]) => {
                data.push([`  ${name}`, formula]);
            });
        }

        data.push(['', '']); // Spacing

        // Add solving steps if present
        if (lesson.solvingSteps) {
            data.push(['Solution Strategy', '']);
            lesson.solvingSteps.forEach((step, index) => {
                data.push([`  ${index + 1}.`, step]);
            });
        }

        data.push(['', '']); // Spacing

        // Add applications
        if (lesson.applications) {
            data.push(['Applications', '']);
            lesson.applications.forEach(app => {
                data.push(['  •', app]);
            });
        }

        return {
            title: 'Lesson: ' + lesson.title,
            type: 'lesson',
            data: data
        };
    }

    createEnhancedMatrixStepsSection() {
        if (!this.solutionSteps || this.solutionSteps.length === 0) return null;

        const stepsData = [];

        this.solutionSteps.forEach((step, index) => {
            // Skip bridge steps in basic view
            if (step.stepType === 'bridge' && this.explanationLevel === 'basic') {
                return;
            }

            // Bridge step formatting
            if (step.stepType === 'bridge') {
                stepsData.push(['', '']); // Spacing
                stepsData.push(['→ Connecting Step', step.title]);
                stepsData.push(['Explanation', step.explanation.why]);
                stepsData.push(['', '']); // Spacing
                return;
            }

            // Main step
            stepsData.push([`Step ${step.stepNumber}`, step.step]);
            stepsData.push(['Description', step.description]);

            // Add matrix displays if present
            if (step.matrixA) {
                stepsData.push(['Matrix A', this.formatMatrixForDisplay(step.matrixA.data)]);
                stepsData.push(['Dimensions', `${step.matrixA.dimensions[0]}×${step.matrixA.dimensions[1]}`]);
            }

            if (step.matrixB) {
                stepsData.push(['Matrix B', this.formatMatrixForDisplay(step.matrixB.data)]);
                stepsData.push(['Dimensions', `${step.matrixB.dimensions[0]}×${step.matrixB.dimensions[1]}`]);
            }

            if (step.matrix) {
                stepsData.push(['Matrix', this.formatMatrixForDisplay(step.matrix.data)]);
                stepsData.push(['Dimensions', `${step.matrix.dimensions[0]}×${step.matrix.dimensions[1]}`]);
            }

            // Add operation if present
            if (step.operation) {
                stepsData.push(['Operation', step.operation]);
            }

            // Add formula if present
            if (step.formula) {
                stepsData.push(['Formula', step.formula]);
            }

            // Add reasoning
            if (step.reasoning) {
                stepsData.push(['Reasoning', step.reasoning]);
            }

            // Add algebraic rule
            if (step.algebraicRule) {
                stepsData.push(['Mathematical Rule', step.algebraicRule]);
            }

            // Add visual hint
            if (step.visualHint && this.explanationLevel !== 'basic') {
                stepsData.push(['Visual Hint', step.visualHint]);
            }

            // Add enhanced explanations for detailed level
            if (step.explanations && this.explanationLevel === 'detailed') {
                stepsData.push(['', '']); // Spacing
                stepsData.push(['Conceptual Explanation', step.explanations.conceptual]);
                stepsData.push(['Algebraic Perspective', step.explanations.algebraic]);
            }

            // Add error prevention if enabled
            if (step.errorPrevention && this.includeErrorPrevention) {
                stepsData.push(['', '']); // Spacing
                stepsData.push(['Common Mistakes', step.errorPrevention.commonMistakes.join('; ')]);
                stepsData.push(['Prevention Tips', step.errorPrevention.preventionTips.join('; ')]);
            }

            // Add scaffolding for scaffolded level
            if (step.scaffolding && this.explanationLevel === 'scaffolded') {
                stepsData.push(['', '']); // Spacing
                stepsData.push(['Guiding Questions', step.scaffolding.guidingQuestions.join(' | ')]);
                if (step.scaffolding.hints) {
                    stepsData.push(['Hint Level 1', step.scaffolding.hints.level1]);
                    stepsData.push(['Hint Level 2', step.scaffolding.hints.level2]);
                }
            }

            // Add result if present
            if (step.result) {
                stepsData.push(['', '']); // Spacing
                stepsData.push(['Result', this.formatMatrixForDisplay(step.result.data)]);
                stepsData.push(['Dimensions', `${step.result.dimensions[0]}×${step.result.dimensions[1]}`]);
            }

            // Add scalar result if present
            if (step.determinant !== undefined) {
                stepsData.push(['Determinant', step.determinant]);
            }

            if (step.finalAnswer) {
                stepsData.push(['Status', '✓ Final Answer']);
            }

            stepsData.push(['', '']); // Spacing between steps
        });

        return {
            title: 'Enhanced Step-by-Step Solution',
            type: 'steps',
            data: stepsData
        };
    }

    createMatrixSolutionSection() {
        if (!this.currentSolution) return null;

        const data = [];

        // Handle error cases
        if (this.currentSolution.error) {
            data.push(['Status', 'Error']);
            data.push(['Error Type', this.currentSolution.error]);
            data.push(['Message', this.currentSolution.message]);
            return {
                title: 'Solution Result',
                type: 'solution',
                data: data
            };
        }

        // Display result based on operation type
        data.push(['Operation', this.currentSolution.operation || this.currentProblem.type]);
        data.push(['', '']); // Spacing

        if (this.currentSolution.result) {
            data.push(['Result Matrix', this.formatMatrixForDisplay(this.currentSolution.result.data)]);
            data.push(['Dimensions', `${this.currentSolution.result.dimensions[0]}×${this.currentSolution.result.dimensions[1]}`]);
        }

        if (this.currentSolution.determinant !== undefined) {
            data.push(['Determinant', this.currentSolution.determinant]);
            data.push(['Invertible', this.currentSolution.isInvertible ? 'Yes' : 'No']);
        }

        if (this.currentSolution.inverse) {
            data.push(['', '']); // Spacing
            data.push(['Inverse Matrix', this.formatMatrixForDisplay(this.currentSolution.inverse.data)]);
        }

        if (this.currentSolution.solution) {
            data.push(['', '']); // Spacing
            data.push(['Solution Vector', this.formatMatrixForDisplay(this.currentSolution.solution.data)]);
        }

        if (this.currentSolution.eigenvalues) {
            data.push(['', '']); // Spacing
            data.push(['Eigenvalues', this.currentSolution.eigenvalues.join(', ')]);
        }

        if (this.currentSolution.rank !== undefined) {
            data.push(['', '']); // Spacing
            data.push(['Rank', this.currentSolution.rank]);
            data.push(['Full Rank', this.currentSolution.isFullRank ? 'Yes' : 'No']);
        }

        return {
            title: 'Final Solution',
            type: 'solution',
            data: data
        };
    }

    createMatrixAnalysisSection() {
        if (!this.currentSolution) return null;

        const data = [
            ['Problem Type', this.currentProblem.type],
            ['Explanation Level', this.explanationLevel],
            ['Steps Generated', this.solutionSteps?.length || 0],
            ['', ''] // Spacing
        ];

        // Add operation-specific analysis
        if (this.currentSolution.dimensionRule) {
            data.push(['Dimension Analysis', this.currentSolution.dimensionRule]);
        }

        if (this.currentSolution.method) {
            data.push(['Method Used', this.currentSolution.method]);
        }

        if (this.currentSolution.interpretation) {
            data.push(['', '']); // Spacing
            data.push(['Interpretations', '']);
            this.currentSolution.interpretation.forEach(interp => {
                data.push(['  •', interp]);
            });
        }

        // Add properties if present
        if (this.currentSolution.properties) {
            data.push(['', '']); // Spacing
            data.push(['Mathematical Properties', '']);
            
            if (typeof this.currentSolution.properties === 'object') {
                Object.entries(this.currentSolution.properties).forEach(([key, value]) => {
                    data.push([`  ${key}`, value]);
                });
            } else if (Array.isArray(this.currentSolution.properties)) {
                this.currentSolution.properties.forEach(prop => {
                    data.push(['  •', prop]);
                });
            }
        }

        return {
            title: 'Solution Analysis',
            type: 'analysis',
            data: data
        };
    }

    createMatrixVerificationSection() {
        if (!this.currentSolution || !this.includeVerificationInSteps) return null;

        const data = [];

        // Add verification header
        data.push(['Verification Method', 'Matrix Operation Verification']);
        data.push(['', '']); // Spacing

        // Check if verification data exists
        if (this.currentSolution.verification) {
            const verification = this.currentSolution.verification;

            if (verification.isValid !== undefined) {
                data.push(['Status', verification.isValid ? '✓ Valid' : '✗ Invalid']);
                
                if (verification.tolerance) {
                    data.push(['Tolerance', verification.tolerance]);
                }

                if (verification.method) {
                    data.push(['Method', verification.method]);
                }

                if (verification.formula) {
                    data.push(['Formula', verification.formula]);
                }

                if (verification.property) {
                    data.push(['Property Verified', verification.property]);
                }

                // Add sample verifications if present
                if (verification.sampleVerifications) {
                    data.push(['', '']); // Spacing
                    data.push(['Sample Verifications', '']);
                    verification.sampleVerifications.forEach(sample => {
                        data.push([`Position ${sample.position}`, 
                            `Computed: ${sample.computed}, Expected: ${sample.expected}, Valid: ${sample.valid ? 'Yes' : 'No'}`]);
                    });
                }

                // Add detailed verifications for eigenvalues
                if (verification.verifications) {
                    data.push(['', '']); // Spacing
                    data.push(['Detailed Verifications', '']);
                    verification.verifications.forEach((v, index) => {
                        data.push([`Pair ${index + 1}`, `Valid: ${v.isValid ? 'Yes' : 'No'}`]);
                    });
                }
            }
        }

        // Add confidence level
        if (this.verificationDetail === 'detailed') {
            data.push(['', '']); // Spacing
            data.push(['Confidence Level', this.calculateMatrixVerificationConfidence()]);
            data.push(['Verification Notes', this.getMatrixVerificationNotes()]);
        }

        return {
            title: 'Solution Verification',
            type: 'verification',
            data: data
        };
    }

    createMatrixPedagogicalNotesSection() {
        if (!this.includePedagogicalNotes) return null;

        const problemType = this.currentProblem.type;
        const lessonKey = this.mapProblemTypeToLesson(problemType);
        const pedagogicalNotes = this.generateMatrixPedagogicalNotes(lessonKey);

        if (!pedagogicalNotes) return null;

        const data = [
            ['Learning Objectives', ''],
            ...pedagogicalNotes.objectives.map(obj => ['  •', obj]),
            ['', ''], // Spacing
            ['Key Concepts', ''],
            ...pedagogicalNotes.keyConcepts.map(concept => ['  •', concept]),
            ['', ''], // Spacing
            ['Prerequisites', ''],
            ...pedagogicalNotes.prerequisites.map(prereq => ['  •', prereq]),
            ['', ''], // Spacing
            ['Common Difficulties', ''],
            ...pedagogicalNotes.commonDifficulties.map(diff => ['  •', diff]),
            ['', ''], // Spacing
            ['Extension Ideas', ''],
            ...pedagogicalNotes.extensions.map(ext => ['  •', ext]),
            ['', ''], // Spacing
            ['Assessment Tips', ''],
            ...pedagogicalNotes.assessment.map(tip => ['  •', tip])
        ];

        return {
            title: 'Teaching Notes',
            type: 'pedagogical',
            data: data
        };
    }

    createMatrixAlternativeMethodsSection() {
        if (!this.includeAlternativeMethods) return null;

        const alternatives = this.generateMatrixAlternativeMethods(this.currentProblem.type);

        if (!alternatives) return null;

        const data = [
            ['Primary Method', alternatives.primaryMethod],
            ['', ''], // Spacing
            ['Alternative Methods', '']
        ];

        alternatives.methods.forEach((method, index) => {
            data.push([`Method ${index + 1}`, method.name]);
            data.push(['Description', method.description]);
            if (method.complexity) {
                data.push(['Complexity', method.complexity]);
            }
            data.push(['', '']); // Spacing
        });

        if (alternatives.comparison) {
            data.push(['Method Comparison', alternatives.comparison]);
        }

        if (alternatives.recommendations) {
            data.push(['', '']); // Spacing
            data.push(['Recommendations', '']);
            alternatives.recommendations.forEach(rec => {
                data.push(['  •', rec]);
            });
        }

        return {
            title: 'Alternative Solution Methods',
            type: 'alternatives',
            data: data
        };
    }

    createMatrixVisualizationSection() {
        // This section would contain visual representations
        // For now, we'll include textual descriptions of visualizations

        const data = [];

        if (this.currentProblem.type === 'matrix_multiplication') {
            data.push(['Visualization Type', 'Matrix Multiplication Process']);
            data.push(['Description', 'Each element computed as dot product of row and column']);
            data.push(['Geometric Interpretation', 'Composition of linear transformations']);
        } else if (this.currentProblem.type === 'determinant') {
            data.push(['Visualization Type', 'Determinant Interpretation']);
            data.push(['Description', 'Represents volume scaling factor']);
            data.push(['Geometric Interpretation', 'How transformation stretches or shrinks space']);
        } else if (this.currentProblem.type === 'matrix_transpose') {
            data.push(['Visualization Type', 'Transpose Operation']);
            data.push(['Description', 'Reflection across main diagonal']);
            data.push(['Geometric Interpretation', 'Rows become columns, columns become rows']);
        }

        if (data.length === 0) return null;

        return {
            title: 'Visual Interpretation',
            type: 'visualization',
            data: data
        };
    }

    // HELPER METHODS

    formatMatrixForDisplay(matrix) {
        if (!matrix || !Array.isArray(matrix)) return 'N/A';
        
        return matrix.map(row => 
            '[' + row.map(val => 
                typeof val === 'number' ? val.toFixed(4) : val
            ).join(', ') + ']'
        ).join('\n');
    }

    mapProblemTypeToLesson(problemType) {
        const mapping = {
            'matrix_addition': 'matrix_addition',
            'scalar_multiplication': 'scalar_multiplication',
            'matrix_multiplication': 'matrix_multiplication',
            'matrix_transpose': 'matrix_transpose',
            'determinant': 'determinant',
            'matrix_inverse': 'matrix_inverse',
            'solve_system': 'systems_matrices',
            'eigenvalues': 'eigenvalues_eigenvectors',
            'matrix_rank': 'matrix_rank',
            'lu_decomposition': 'lu_decomposition',
            'row_echelon': 'row_operations',
            'reduced_row_echelon': 'row_operations'
        };

        return mapping[problemType] || 'matrix_basics';
    }

    generateMatrixPedagogicalNotes(lessonKey) {
        const pedagogicalDatabase = {
            matrix_basics: {
                objectives: [
                    'Understand matrix structure and notation',
                    'Identify matrix dimensions',
                    'Access matrix elements using indices'
                ],
                keyConcepts: [
                    'Matrix as rectangular array',
                    'Row and column indexing',
                    'Matrix dimensions m×n'
                ],
                prerequisites: [
                    'Basic arithmetic',
                    'Understanding of arrays',
                    'Coordinate notation'
                ],
                commonDifficulties: [
                    'Confusing row and column order',
                    'Index notation (i,j) vs (j,i)',
                    'Understanding dimension notation'
                ],
                extensions: [
                    'Special matrix types',
                    'Matrix operations',
                    'Applications in data science'
                ],
                assessment: [
                    'Test dimension identification',
                    'Verify element access understanding',
                    'Check notation comprehension'
                ]
            },
            matrix_addition: {
                objectives: [
                    'Add and subtract matrices',
                    'Understand dimension requirements',
                    'Apply commutative and associative properties'
                ],
                keyConcepts: [
                    'Element-wise operations',
                    'Dimension compatibility',
                    'Matrix arithmetic properties'
                ],
                prerequisites: [
                    'Matrix notation',
                    'Basic arithmetic',
                    'Understanding of corresponding elements'
                ],
                commonDifficulties: [
                    'Attempting to add incompatible dimensions',
                    'Misaligning elements',
                    'Confusing with matrix multiplication'
                ],
                extensions: [
                    'Linear combinations of matrices',
                    'Matrix equations',
                    'Applications in data manipulation'
                ],
                assessment: [
                    'Test with various dimensions',
                    'Check error handling for incompatible sizes',
                    'Verify property understanding'
                ]
            },
            matrix_multiplication: {
                objectives: [
                    'Multiply matrices correctly',
                    'Understand dimension requirements',
                    'Recognize non-commutativity'
                ],
                keyConcepts: [
                    'Dot product of row and column',
                    'Dimension compatibility (m×n)·(n×p)',
                    'Non-commutative property'
                ],
                prerequisites: [
                    'Dot product calculation',
                    'Matrix notation',
                    'Summation notation'
                ],
                commonDifficulties: [
                    'Incorrect dimension checking',
                    'Confusing which row and column to use',
                    'Arithmetic errors in dot products',
                    'Assuming AB = BA'
                ],
                extensions: [
                    'Matrix powers',
                    'Transformation composition',
                    'Applications in graphics and networks'
                ],
                assessment: [
                    'Test with various dimension combinations',
                    'Verify dot product computation',
                    'Check understanding of non-commutativity'
                ]
            },
            determinant: {
                objectives: [
                    'Compute determinants for 2×2 and 3×3 matrices',
                    'Understand geometric interpretation',
                    'Use determinant to test invertibility'
                ],
                keyConcepts: [
                    'Determinant as scalar value',
                    'Volume scaling interpretation',
                    'Invertibility criterion'
                ],
                prerequisites: [
                    'Matrix multiplication',
                    'Cofactor expansion',
                    'Understanding of linear independence'
                ],
                commonDifficulties: [
                    'Sign errors in cofactor expansion',
                    'Arithmetic mistakes',
                    'Forgetting alternating signs',
                    'Confusion about interpretation'
                ],
                extensions: [
                    'Properties of determinants',
                    'Determinant of products',
                    'Applications in solving systems'
                ],
                assessment: [
                    'Test with various sizes',
                    'Check cofactor expansion understanding',
                    'Verify interpretation comprehension'
                ]
            },
            matrix_inverse: {
                objectives: [
                    'Compute matrix inverses',
                    'Verify invertibility',
                    'Apply inverse to solve equations'
                ],
                keyConcepts: [
                    'Inverse definition: AA⁻¹ = I',
                    'Invertibility criterion',
                    'Relationship to determinant'
                ],
                prerequisites: [
                    'Determinant calculation',
                    'Matrix multiplication',
                    'Identity matrix concept',
                    'Row operations'
                ],
                commonDifficulties: [
                    'Not checking determinant first',
                    'Errors in Gauss-Jordan elimination',
                    'Sign mistakes in adjugate',
                    'Verification errors'
                ],
                extensions: [
                    'Inverse properties',
                    'Applications to systems',
                    'Numerical methods for large matrices'
                ],
                assessment: [
                    'Test invertibility checking',
                    'Verify computation accuracy',
                    'Check application understanding'
                ]
            },
            systems_matrices: {
                objectives: [
                    'Represent systems as matrix equations',
                    'Solve using matrix methods',
                    'Interpret solution types'
                ],
                keyConcepts: [
                    'Matrix equation AX = B',
                    'Solution via inverse',
                    'Row reduction method'
                ],
                prerequisites: [
                    'System of equations',
                    'Matrix inverse',
                    'Row operations'
                ],
                commonDifficulties: [
                    'Setting up coefficient matrix incorrectly',
                    'Misinterpreting solution vector',
                    'Not recognizing no solution cases'
                ],
                extensions: [
                    'Larger systems',
                    'Overdetermined and underdetermined systems',
                    'Applications in engineering'
                ],
                assessment: [
                    'Test matrix setup',
                    'Verify solution methods',
                    'Check interpretation of results'
                ]
            }
        };

        return pedagogicalDatabase[lessonKey] || pedagogicalDatabase.matrix_basics;
    }

    generateMatrixAlternativeMethods(problemType) {
        const methodsDatabase = {
            matrix_multiplication: {
                primaryMethod: 'Standard row-column dot product',
                methods: [
                    {
                        name: 'Block multiplication',
                        description: 'Partition matrices into blocks and multiply blocks',
                        complexity: 'Same asymptotic complexity, useful for structure'
                    },
                    {
                        name: 'Strassen algorithm',
                        description: 'Recursive divide-and-conquer approach',
                        complexity: 'O(n^2.807) instead of O(n^3)'
                    },
                    {
                        name: 'Element-wise formula',
                        description: 'Directly compute each element independently',
                        complexity: 'Standard O(n^3), good for parallel computation'
                    }
                ],
                comparison: 'Standard method is most intuitive; Strassen faster for large matrices; block method useful for structured matrices',
                recommendations: [
                    'Use standard method for small matrices and learning',
                    'Consider Strassen for very large numerical computations',
                    'Use block multiplication for sparse or structured matrices'
                ]
            },
            determinant: {
                primaryMethod: 'Cofactor expansion',
                methods: [
                    {
                        name: 'LU decomposition',
                        description: 'Factor into LU and multiply diagonal elements of U',
                        complexity: 'O(n^3), more numerically stable'
                    },
                    {
                        name: 'Rule of Sarrus',
                        description: 'Diagonal products method for 3×3 only',
                        complexity: 'O(1) for 3×3, visual and direct'
                    },
                    {
                        name: 'Row reduction',
                        description: 'Reduce to triangular form and multiply diagonal',
                        complexity: 'O(n^3), numerically stable'
                    }
                ],
                comparison: 'Cofactor expansion grows factorially; LU and row reduction are O(n^3) and more stable',
                recommendations: [
                    'Use direct formula for 2×2',
                    'Use Sarrus or cofactor for 3×3',
                    'Use LU or row reduction for larger matrices'
                ]
            },
            matrix_inverse: {
                primaryMethod: 'Gauss-Jordan elimination',
                methods: [
                    {
                        name: 'Adjugate method',
                        description: 'A⁻¹ = (1/det(A))·adj(A)',
                        complexity: 'Requires determinant and cofactors, expensive'
                    },
                    {
                        name: 'LU decomposition',
                        description: 'Factor and solve multiple systems',
                        complexity: 'O(n^3), efficient for multiple systems'
                    },
                    {
                        name: 'Block inversion',
                        description: 'Invert block matrices using block operations',
                        complexity: 'Useful for structured matrices'
                    }
                ],
                comparison: 'Gauss-Jordan most systematic; adjugate good for teaching; LU efficient for algorithms',
                recommendations: [
                    'Use adjugate method for 2×2 and hand calculations',
                    'Use Gauss-Jordan for learning and moderate sizes',
                    'Use LU for computational implementations'
                ]
            },
            solve_system: {
                primaryMethod: 'LU decomposition with forward/backward substitution',
                methods: [
                    {
                        name: 'Matrix inversion',
                        description: 'Compute X = A⁻¹B directly',
                        complexity: 'O(n^3) but less efficient and less stable'
                    },
                    {
                        name: 'Gauss-Jordan elimination',
                        description: 'Row reduce augmented matrix [A|B]',
                        complexity: 'O(n^3), systematic and reliable'
                    },
                    {
                        name: 'Cramer\'s Rule',
                        description: 'Use determinants to solve',
                        complexity: 'O(n!), only practical for small systems'
                    },
                    {
                        name: 'Iterative methods',
                        description: 'Jacobi, Gauss-Seidel for large sparse systems',
                        complexity: 'Variable, good for specific matrix types'
                    }
                ],
                comparison: 'LU most efficient for general systems; iterative methods for large sparse; Gauss-Jordan most systematic',
                recommendations: [
                    'Use Cramer\'s rule only for 2×2 or 3×3',
                    'Use LU for general dense systems',
                    'Use Gauss-Jordan for learning',
                    'Use iterative methods for large sparse systems'
                ]
            }
        };

        return methodsDatabase[problemType] || null;
    }

    calculateMatrixVerificationConfidence() {
        if (!this.currentSolution) return 'Unknown';

        if (this.currentSolution.error) return 'N/A (Error in solution)';

        if (this.currentSolution.verification) {
            const verification = this.currentSolution.verification;
            
            if (verification.isValid === true) return 'High';
            if (verification.isValid === false) return 'Low';
            if (verification.allValid === true) return 'High';
            if (verification.allValid === false) return 'Medium';
        }

        return 'Medium';
    }

    getMatrixVerificationNotes() {
        const notes = [];

        if (!this.currentSolution) return 'No solution to verify';

        const { type } = this.currentProblem;

        switch (type) {
            case 'matrix_addition':
            case 'scalar_multiplication':
                notes.push('Element-wise comparison performed');
                notes.push('Tolerance: 1e-10');
                break;
            case 'matrix_multiplication':
                notes.push('Sample elements verified via dot product');
                notes.push('Full verification computationally expensive');
                break;
            case 'matrix_inverse':
                notes.push('Verified AA⁻¹ = I property');
                notes.push('Numerical tolerance: 1e-8');
                break;
            case 'determinant':
                notes.push('Computed using numerical library');
                notes.push('Result interpretation provided');
                break;
            case 'solve_system':
                notes.push('Solution verified by substitution AX = B');
                notes.push('Numerical accuracy checked');
                break;
            case 'eigenvalues':
                notes.push('Each eigenvalue-eigenvector pair verified');
                notes.push('Av = λv property checked');
                break;
            default:
                notes.push('Standard verification methods applied');
        }

        return notes.join('; ');
    }

    // UTILITY METHODS

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
            adaptedReasoning: step.reasoning ? this.adaptLanguageLevel(step.reasoning, level) : '',
            complexityLevel: explanationLevel
        };
    }

    adaptLanguageLevel(text, level) {
        if (!text) return '';

        const adaptations = {
            basic: {
                replacements: {
                    'matrix': 'grid of numbers',
                    'element': 'number in the grid',
                    'dimension': 'size',
                    'row': 'horizontal line',
                    'column': 'vertical line',
                    'determinant': 'special number from matrix',
                    'inverse': 'reverse matrix',
                    'transpose': 'flip rows and columns',
                    'compatible': 'matching',
                    'coefficient': 'number in front'
                }
            },
            intermediate: {
                replacements: {
                    'matrix': 'matrix',
                    'element': 'element',
                    'dimension': 'dimension',
                    'row': 'row',
                    'column': 'column',
                    'determinant': 'determinant',
                    'inverse': 'inverse',
                    'transpose': 'transpose',
                    'compatible': 'compatible',
                    'coefficient': 'coefficient'
                }
            },
            detailed: {
                replacements: {
                    'matrix': 'matrix (linear transformation representation)',
                    'element': 'element (entry aᵢⱼ)',
                    'dimension': 'dimension (m×n order)',
                    'row': 'row (horizontal vector)',
                    'column': 'column (vertical vector)',
                    'determinant': 'determinant (scalar invariant)',
                    'inverse': 'inverse (multiplicative inverse under matrix multiplication)',
                    'transpose': 'transpose (reflection across main diagonal)',
                    'compatible': 'compatible (satisfying dimension requirements)',
                    'coefficient': 'coefficient (multiplicative constant)'
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
            connection: `This step builds on step ${stepIndex} by continuing the matrix operation`,
            progression: 'We are making progress toward computing the final result',
            relationship: 'Each step brings us closer to the complete solution'
        };
    }



calculateVerificationConfidence() {
        if (!this.currentSolution || !this.currentProblem) return 'Unknown';

        const { type } = this.currentProblem;

        // Handle error cases
        if (this.currentSolution.error) {
            return 'N/A';
        }

        // Check verification results based on problem type
        switch (type) {
            case 'matrix_addition':
            case 'scalar_multiplication':
                if (this.currentSolution.verification?.isValid) return 'High';
                if (this.currentSolution.verification?.isValid === false) return 'Low';
                return 'Medium';

            case 'matrix_multiplication':
                if (this.currentSolution.verification?.isValid) {
                    // Check sample verifications
                    const samples = this.currentSolution.verification.sampleVerifications || [];
                    const allValid = samples.every(s => s.valid);
                    return allValid ? 'High' : 'Medium';
                }
                return 'Medium';

            case 'matrix_transpose':
                if (this.currentSolution.verification?.isValid) return 'High';
                return 'Medium';

            case 'determinant':
                // Determinant computation is generally reliable
                return 'High';

            case 'matrix_inverse':
                if (this.currentSolution.verification?.isValid) {
                    const maxDiff = this.currentSolution.verification.maxDifference;
                    if (maxDiff < 1e-10) return 'High';
                    if (maxDiff < 1e-6) return 'Medium';
                    return 'Low';
                }
                return 'Medium';

            case 'solve_system':
                if (this.currentSolution.verification?.isValid) {
                    const maxDiff = this.currentSolution.verification.maxDifference;
                    if (maxDiff < 1e-10) return 'High';
                    if (maxDiff < 1e-6) return 'Medium';
                    return 'Low';
                }
                return 'Medium';

            case 'eigenvalues':
                if (this.currentSolution.verification?.allValid) return 'High';
                if (this.currentSolution.verification?.verifications) {
                    const validCount = this.currentSolution.verification.verifications.filter(v => v.isValid).length;
                    const totalCount = this.currentSolution.verification.verifications.length;
                    if (validCount === totalCount) return 'High';
                    if (validCount >= totalCount / 2) return 'Medium';
                    return 'Low';
                }
                return 'Medium';

            case 'lu_decomposition':
            case 'qr_decomposition':
                if (this.currentSolution.verification?.isValid) {
                    const maxDiff = this.currentSolution.verification.maxDifference || 
                                   this.currentSolution.verification.productDifference;
                    if (maxDiff < 1e-10) return 'High';
                    if (maxDiff < 1e-6) return 'Medium';
                    return 'Low';
                }
                return 'Medium';

            case 'matrix_rank':
                // Rank computation via row reduction is generally reliable
                return 'High';

            case 'row_echelon':
            case 'reduced_row_echelon':
                // Row operations are deterministic
                return 'High';

            default:
                return 'Medium';
        }
    }

    getVerificationNotes() {
        if (!this.currentSolution || !this.currentProblem) {
            return 'No solution available for verification';
        }

        const { type } = this.currentProblem;
        const notes = [];

        // Add type-specific notes
        switch (type) {
            case 'matrix_addition':
                notes.push('Element-wise comparison performed');
                notes.push('Each corresponding element verified');
                notes.push('Numerical tolerance: 1e-10');
                if (this.currentSolution.verification?.isValid) {
                    notes.push('All elements match expected values');
                }
                break;

            case 'scalar_multiplication':
                notes.push('Each element verified as scalar × original');
                notes.push('Numerical tolerance: 1e-10');
                if (this.currentSolution.verification?.formula) {
                    notes.push(this.currentSolution.verification.formula);
                }
                break;

            case 'matrix_multiplication':
                notes.push('Sample elements verified via dot product computation');
                notes.push('Full verification can be computationally expensive for large matrices');
                if (this.currentSolution.verification?.sampleVerifications) {
                    const validSamples = this.currentSolution.verification.sampleVerifications.filter(s => s.valid).length;
                    const totalSamples = this.currentSolution.verification.sampleVerifications.length;
                    notes.push(`${validSamples}/${totalSamples} sample elements verified`);
                }
                notes.push('Formula used: (AB)ᵢⱼ = Σₖ aᵢₖ·bₖⱼ');
                break;

            case 'matrix_transpose':
                notes.push('Verified (Aᵀ)ᵢⱼ = aⱼᵢ for all elements');
                notes.push('Numerical tolerance: 1e-10');
                if (this.currentSolution.verification?.property) {
                    notes.push(this.currentSolution.verification.property);
                }
                break;

            case 'determinant':
                notes.push('Computed using numerical library (math.js)');
                if (this.currentSolution.method) {
                    notes.push(`Method: ${this.currentSolution.method}`);
                }
                notes.push('Result interpretation based on determinant value');
                if (Math.abs(this.currentSolution.determinant) < 1e-10) {
                    notes.push('Determinant ≈ 0 indicates singular matrix');
                } else {
                    notes.push('Non-zero determinant confirms invertibility');
                }
                break;

            case 'matrix_inverse':
                notes.push('Verified AA⁻¹ = I (identity matrix)');
                if (this.currentSolution.verification?.maxDifference !== undefined) {
                    notes.push(`Maximum difference from identity: ${this.currentSolution.verification.maxDifference.toExponential(2)}`);
                }
                notes.push('Numerical tolerance: 1e-8');
                if (this.currentSolution.verification?.property) {
                    notes.push(this.currentSolution.verification.property);
                }
                break;

            case 'solve_system':
                notes.push('Solution verified by substitution: AX = B');
                if (this.currentSolution.verification?.maxDifference !== undefined) {
                    notes.push(`Maximum difference: ${this.currentSolution.verification.maxDifference.toExponential(2)}`);
                }
                notes.push('Numerical tolerance: 1e-8');
                if (this.currentSolution.method) {
                    notes.push(`Solution method: ${this.currentSolution.method}`);
                }
                break;

            case 'eigenvalues':
                notes.push('Each eigenvalue-eigenvector pair verified');
                notes.push('Property checked: Av = λv for each pair');
                if (this.currentSolution.verification?.verifications) {
                    const validCount = this.currentSolution.verification.verifications.filter(v => v.isValid).length;
                    notes.push(`${validCount}/${this.currentSolution.verification.verifications.length} pairs verified`);
                }
                notes.push('Numerical tolerance: 1e-8');
                break;

            case 'lu_decomposition':
                notes.push('Verified PA = LU property');
                if (this.currentSolution.verification?.maxDifference !== undefined) {
                    notes.push(`Maximum difference: ${this.currentSolution.verification.maxDifference.toExponential(2)}`);
                }
                notes.push('Permutation matrix P accounts for row swaps');
                notes.push('Numerical tolerance: 1e-8');
                break;

            case 'qr_decomposition':
                notes.push('Verified A = QR property');
                notes.push('Verified Q is orthogonal (QᵀQ = I)');
                if (this.currentSolution.verification?.productDifference !== undefined) {
                    notes.push(`Product difference: ${this.currentSolution.verification.productDifference.toExponential(2)}`);
                }
                if (this.currentSolution.verification?.orthogonalityDifference !== undefined) {
                    notes.push(`Orthogonality difference: ${this.currentSolution.verification.orthogonalityDifference.toExponential(2)}`);
                }
                notes.push('Numerical tolerance: 1e-8');
                break;

            case 'matrix_rank':
                notes.push('Rank computed via row reduction to echelon form');
                notes.push('Number of pivot positions counted');
                if (this.currentSolution.isFullRank !== undefined) {
                    notes.push(this.currentSolution.isFullRank ? 'Matrix has full rank' : 'Matrix is rank deficient');
                }
                break;

            case 'row_echelon':
                notes.push('Result is in row echelon form (REF)');
                notes.push('Leading entries form staircase pattern');
                if (this.currentSolution.pivotPositions) {
                    notes.push(`${this.currentSolution.pivotPositions.length} pivot positions identified`);
                }
                break;

            case 'reduced_row_echelon':
                notes.push('Result is in reduced row echelon form (RREF)');
                notes.push('Each leading entry is 1 with zeros above and below');
                notes.push('RREF is unique for each matrix');
                if (this.currentSolution.pivotPositions) {
                    notes.push(`${this.currentSolution.pivotPositions.length} pivot columns`);
                }
                break;

            default:
                notes.push('Standard verification methods applied');
                notes.push('Results computed using numerical linear algebra library');
        }

        // Add general notes
        if (this.currentSolution.verification?.isValid === false) {
            notes.push('⚠ WARNING: Verification failed - review calculations');
        }

        if (this.verificationDetail === 'detailed') {
            notes.push('Detailed verification performed with multiple checks');
        }

        return notes.join('; ');
    }

}
