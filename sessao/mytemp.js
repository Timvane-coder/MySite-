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
            this.createVerificationSection()
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

    // MISSING FUNCTION 27: createVerification

    // Integrate with existing methods (keeping the same interface)
    solveLinearProblem(config) {
        const { equation, scenario, parameters, problemType, context } = config;

        try {
            this.currentProblem = this.parseLinearProblem(equation, scenario, parameters, problemType, context);
            this.currentSolution = this.solveLinearProblem_Internal(this.currentProblem);
            this.solutionSteps = this.generateLinearSteps(this.currentProblem, this.currentSolution);
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

    // Keep all existing methods from the original class
    // [Include all the other methods from your original LinearMathematicalWorkbook class here]
    // This is just showing the enhanced step generation implementation

    // Placeholder for the rest of your existing methods
    setThemeColors() {
        // ... your existing implementation
    }

    initializeMathSymbols() {
        // ... your existing implementation
    }

    initializeLinearSolvers() {
        // ... your existing implementation
    }
}
