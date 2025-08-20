// ./src/SpreadsheetCalculator.js

import { createCanvas } from '@napi-rs/canvas';
import * as math from 'mathjs';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

// ./src/SpreadsheetCalculator.js (partial update)

export class SpreadsheetCalculator {
    constructor() {
        // Default settings
        this.width = 800;
        this.height = 600;
        this.rowLabelWidth = 50;
        this.headerHeight = 40;
        this.cellWidth = 120;
        this.cellHeight = 30;
        this.fontSize = 14;
        this.cellPadding = 5;
        this.theme = 'light'; // Default theme
        this.colors = this.setThemeColors(this.theme);
        this.currentSheet = null;
        this.calculationHistory = [];
        this.formulaDatabase = this.initializeFormulaDatabase();
        this.padding = 10;
        this.formulaBarHeight = 25;
        this.statsPanelHeight = 80;
    }

    // Set theme colors based on theme name
    setThemeColors(theme) {
        const themes = {
            light: {
                background: '#ffffff',
                headerBg: '#e0e0e0',
                headerText: '#000000',
                cellBg: '#f9f9f9',
                cellText: '#333333',
                borderColor: '#cccccc',
                gridColor: '#e0e0e0',
                formulaBar: '#f0f0f0',
            },
            excel: {
                background: '#ffffff',
                headerBg: '#4472c4', // Blue-gray header like Excel
                headerText: '#ffffff',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#e0e0e0',
                gridColor: '#e0e0e0',
                formulaBar: '#f0f0f0',
            },
            dark: {
                background: '#1a1a1a',
                headerBg: '#2d2d2d',
                headerText: '#ffffff',
                cellBg: '#2a2a2a',
                cellText: '#cccccc',
                borderColor: '#404040',
                gridColor: '#333333',
                formulaBar: '#252525',
            },
            scientific: {
                background: '#ffffff',
                headerBg: '#d3d3d3', // Light gray for a clean look
                headerText: '#000000',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#d3d3d3',
                gridColor: '#e0e0e0',
                formulaBar: '#f0f0f0',
            },
            googlesheets: {
                background: '#ffffff',
                headerBg: '#34a853', // Green header like Google Sheets
                headerText: '#ffffff',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#e0e0e0',
                gridColor: '#e0e0e0',
                formulaBar: '#f0f0f0',
            },
            classic: {
                background: '#f5f5dc', // Beige background for retro feel
                headerBg: '#d2b48c', // Tan header
                headerText: '#000000',
                cellBg: '#f5f5dc',
                cellText: '#000000',
                borderColor: '#8b4513', // Brown border
                gridColor: '#d2b48c',
                formulaBar: '#f0e68c', // Light yellow
            }
        };
        return themes[theme] || themes['light']; // Default to light if theme is invalid
    }

    // Method to set or change the theme
    setTheme(theme) {
        this.theme = theme;
        this.colors = this.setThemeColors(theme);
    }

    // ... (other methods like renderSpreadsheet, drawData, setCellBackground, setCellTextStyle remain unchanged)



    initializeFormulaDatabase() {
        return {
            // Linear Function: y = mx + b
            'linearfunction': {
                type: 'algebraic',
                description: 'Linear Function Analysis',
                params: ['m', 'b'],
                template: (equation, params) => {
                    const xValues = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
                    const yValues = xValues.map(x => params.m * x + params.b);

                    return [
                        [
                            { value: 'Linear Function Analysis', type: 'header' },
                            { value: '', type: 'header' },
                            { value: '', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'Equation:', type: 'label' },
                            { value: `y = ${params.m}x + ${params.b}`, type: 'formula' },
                            { value: '', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Parameters:', type: 'header' },
                            { value: 'Value', type: 'header' },
                            { value: 'Description', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'm =', type: 'label' },
                            { value: params.m, type: 'data' },
                            { value: 'Slope (rate of change)', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'b =', type: 'label' },
                            { value: params.b, type: 'data' },
                            { value: 'Y-intercept', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Key Points:', type: 'header' },
                            { value: 'Calculation', type: 'header' },
                            { value: 'Result', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'X-intercept:', type: 'label' },
                            { value: 'x = -b/m', type: 'formula' },
                            { value: params.m !== 0 ? (-params.b / params.m).toFixed(4) : 'No x-intercept', type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Y-intercept:', type: 'label' },
                            { value: 'y = b', type: 'formula' },
                            { value: params.b, type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Domain:', type: 'label' },
                            { value: 'All real numbers', type: 'formula' },
                            { value: '(-∞, ∞)', type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Range:', type: 'label' },
                            { value: 'All real numbers', type: 'formula' },
                            { value: '(-∞, ∞)', type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Sample Points:', type: 'header' },
                            { value: 'x', type: 'header' },
                            { value: 'y = mx + b', type: 'header' },
                            { value: 'y-value', type: 'header' }
                        ],
                        ...xValues.map((x, index) => [
                            { value: `Point ${index + 1}:`, type: 'label' },
                            { value: x, type: 'data' },
                            { value: `${params.m}(${x}) + ${params.b}`, type: 'formula' },
                            { value: yValues[index].toFixed(2), type: 'result' }
                        ])
                    ];
                }
            },

            // Custom Linear Formula: Parse any linear equation format
            'customlinear': {
                type: 'algebraic',
                description: 'Custom Linear Formula Analysis',
                params: ['equation'],
                template: (equation, params) => {
                    const parsedLinear = this.parseLinearEquation(params.equation);
                    const xValues = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
                    const yValues = xValues.map(x => parsedLinear.m * x + parsedLinear.b);

                    return [
                        [
                            { value: 'Custom Linear Formula Analysis', type: 'header' },
                            { value: '', type: 'header' },
                            { value: '', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'Original Equation:', type: 'label' },
                            { value: params.equation, type: 'formula' },
                            { value: '', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Standard Form:', type: 'label' },
                            { value: `y = ${parsedLinear.m}x + ${parsedLinear.b}`, type: 'formula' },
                            { value: '', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Parsed Parameters:', type: 'header' },
                            { value: 'Value', type: 'header' },
                            { value: 'Description', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'Slope (m) =', type: 'label' },
                            { value: parsedLinear.m, type: 'data' },
                            { value: 'Rate of change', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Y-intercept (b) =', type: 'label' },
                            { value: parsedLinear.b, type: 'data' },
                            { value: 'Value when x = 0', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Analysis:', type: 'header' },
                            { value: 'Calculation', type: 'header' },
                            { value: 'Result', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'X-intercept:', type: 'label' },
                            { value: 'x = -b/m', type: 'formula' },
                            { value: parsedLinear.m !== 0 ? (-parsedLinear.b / parsedLinear.m).toFixed(4) : 'No x-intercept', type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Y-intercept:', type: 'label' },
                            { value: 'y = b', type: 'formula' },
                            { value: parsedLinear.b, type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Slope Type:', type: 'label' },
                            { value: this.describeSlopeType(parsedLinear.m), type: 'formula' },
                            { value: parsedLinear.m > 0 ? 'Positive' : parsedLinear.m < 0 ? 'Negative' : 'Zero', type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Sample Points:', type: 'header' },
                            { value: 'x', type: 'header' },
                            { value: 'Calculation', type: 'header' },
                            { value: 'y-value', type: 'header' }
                        ],
                        ...xValues.map((x, index) => [
                            { value: `Point ${index + 1}:`, type: 'label' },
                            { value: x, type: 'data' },
                            { value: `${parsedLinear.m}(${x}) + ${parsedLinear.b}`, type: 'formula' },
                            { value: yValues[index].toFixed(2), type: 'result' }
                        ])
                    ];
                }
            },

            // Custom Quadratic Formula: Parse any quadratic equation format
            'customquadratic': {
                type: 'algebraic',
                description: 'Custom Quadratic Formula Analysis',
                params: ['equation'],
                template: (equation, params) => {
                    const parsedQuadratic = this.parseQuadraticEquation(params.equation);
                    const xValues = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
                    const yValues = xValues.map(x => parsedQuadratic.a * x * x + parsedQuadratic.b * x + parsedQuadratic.c);
                    const vertex = this.calculateVertex(parsedQuadratic.a, parsedQuadratic.b, parsedQuadratic.c);
                    const discriminant = parsedQuadratic.b * parsedQuadratic.b - 4 * parsedQuadratic.a * parsedQuadratic.c;

                    return [
                        [
                            { value: 'Custom Quadratic Formula Analysis', type: 'header' },
                            { value: '', type: 'header' },
                            { value: '', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'Original Equation:', type: 'label' },
                            { value: params.equation, type: 'formula' },
                            { value: '', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Standard Form:', type: 'label' },
                            { value: `y = ${parsedQuadratic.a}x² + ${parsedQuadratic.b}x + ${parsedQuadratic.c}`, type: 'formula' },
                            { value: '', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Parsed Parameters:', type: 'header' },
                            { value: 'Value', type: 'header' },
                            { value: 'Description', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'a =', type: 'label' },
                            { value: parsedQuadratic.a, type: 'data' },
                            { value: 'Coefficient of x²', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'b =', type: 'label' },
                            { value: parsedQuadratic.b, type: 'data' },
                            { value: 'Coefficient of x', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'c =', type: 'label' },
                            { value: parsedQuadratic.c, type: 'data' },
                            { value: 'Constant term', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Key Properties:', type: 'header' },
                            { value: 'Formula', type: 'header' },
                            { value: 'Result', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'Discriminant:', type: 'label' },
                            { value: 'b² - 4ac', type: 'formula' },
                            { value: discriminant.toFixed(4), type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Opens:', type: 'label' },
                            { value: parsedQuadratic.a > 0 ? 'Upward (a > 0)' : 'Downward (a < 0)', type: 'formula' },
                            { value: parsedQuadratic.a > 0 ? 'Upward' : 'Downward', type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Vertex X:', type: 'label' },
                            { value: 'x = -b/(2a)', type: 'formula' },
                            { value: vertex.x.toFixed(4), type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Vertex Y:', type: 'label' },
                            { value: 'y = f(vertex_x)', type: 'formula' },
                            { value: vertex.y.toFixed(4), type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Axis of Symmetry:', type: 'label' },
                            { value: 'x = -b/(2a)', type: 'formula' },
                            { value: `x = ${vertex.x.toFixed(4)}`, type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Roots/Solutions:', type: 'header' },
                            { value: 'Formula', type: 'header' },
                            { value: 'Value', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'x₁ =', type: 'label' },
                            { value: '(-b + √Δ) / 2a', type: 'formula' },
                            { value: this.calculateQuadraticRoot(parsedQuadratic.a, parsedQuadratic.b, parsedQuadratic.c, true), type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'x₂ =', type: 'label' },
                            { value: '(-b - √Δ) / 2a', type: 'formula' },
                            { value: this.calculateQuadraticRoot(parsedQuadratic.a, parsedQuadratic.b, parsedQuadratic.c, false), type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Root Type:', type: 'label' },
                            { value: this.describeRootType(discriminant), type: 'formula' },
                            { value: discriminant > 0 ? 'Two real roots' : discriminant === 0 ? 'One real root' : 'No real roots', type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Sample Points:', type: 'header' },
                            { value: 'x', type: 'header' },
                            { value: 'Calculation', type: 'header' },
                            { value: 'y-value', type: 'header' }
                        ],
                        ...xValues.map((x, index) => [
                            { value: `Point ${index + 1}:`, type: 'label' },
                            { value: x, type: 'data' },
                            { value: `${parsedQuadratic.a}(${x})² + ${parsedQuadratic.b}(${x}) + ${parsedQuadratic.c}`, type: 'formula' },
                            { value: yValues[index].toFixed(2), type: 'result' }
                        ])
                    ];
                }
            },

            // Quadratic Formula: ax² + bx + c = 0
            'quadraticformula': {
                type: 'algebraic',
                description: 'Quadratic Formula Solution',
                params: ['a', 'b', 'c'],
                template: (equation, params) => {
                    return [
                        [
                            { value: 'Quadratic Formula Analysis', type: 'header' },
                            { value: '', type: 'header' },
                            { value: '', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'Equation:', type: 'label' },
                            { value: `${params.a}x² + ${params.b}x + ${params.c} = 0`, type: 'formula' },
                            { value: '', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Parameters:', type: 'header' },
                            { value: 'Value', type: 'header' },
                            { value: 'Description', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'a =', type: 'label' },
                            { value: params.a, type: 'data' },
                            { value: 'Coefficient of x²', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'b =', type: 'label' },
                            { value: params.b, type: 'data' },
                            { value: 'Coefficient of x', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'c =', type: 'label' },
                            { value: params.c, type: 'data' },
                            { value: 'Constant term', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Calculations:', type: 'header' },
                            { value: 'Formula', type: 'header' },
                            { value: 'Result', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'Discriminant:', type: 'label' },
                            { value: 'b² - 4ac', type: 'formula' },
                            { value: params.b * params.b - 4 * params.a * params.c, type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'x₁ =', type: 'label' },
                            { value: '(-b + √Δ) / 2a', type: 'formula' },
                            { value: this.calculateQuadraticRoot(params.a, params.b, params.c, true), type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'x₂ =', type: 'label' },
                            { value: '(-b - √Δ) / 2a', type: 'formula' },
                            { value: this.calculateQuadraticRoot(params.a, params.b, params.c, false), type: 'result' },
                            { value: '', type: 'data' }
                        ]
                    ];
                }
            },

            // Compound Interest Formula: A = P(1 + r/n)^(nt)
            'compoundinterest': {
                type: 'financial',
                description: 'Compound Interest Calculator',
                params: ['P', 'r', 'n', 't'],
                template: (equation, params) => {
                    return [
                        [
                            { value: 'Compound Interest Analysis', type: 'header' },
                            { value: '', type: 'header' },
                            { value: '', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'Formula:', type: 'label' },
                            { value: 'A = P(1 + r/n)^(nt)', type: 'formula' },
                            { value: '', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Parameters:', type: 'header' },
                            { value: 'Value', type: 'header' },
                            { value: 'Description', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'P =', type: 'label' },
                            { value: `$${params.P.toLocaleString()}`, type: 'data' },
                            { value: 'Principal amount', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'r =', type: 'label' },
                            { value: `${(params.r * 100).toFixed(2)}%`, type: 'data' },
                            { value: 'Annual interest rate', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'n =', type: 'label' },
                            { value: params.n, type: 'data' },
                            { value: 'Compounds per year', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 't =', type: 'label' },
                            { value: `${params.t} years`, type: 'data' },
                            { value: 'Time period', type: 'data' },
                            { value: '', type: 'data' }
                        ],
                        ['', '', '', ''],
                        [
                            { value: 'Results:', type: 'header' },
                            { value: 'Calculation', type: 'header' },
                            { value: 'Amount', type: 'header' },
                            { value: '', type: 'header' }
                        ],
                        [
                            { value: 'Final Amount:', type: 'label' },
                            { value: 'A = P(1 + r/n)^(nt)', type: 'formula' },
                            { value: `$${this.calculateCompoundInterest(params.P, params.r, params.n, params.t).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, type: 'result' },
                            { value: '', type: 'data' }
                        ],
                        [
                            { value: 'Interest Earned:', type: 'label' },
                            { value: 'A - P', type: 'formula' },
                            { value: `$${(this.calculateCompoundInterest(params.P, params.r, params.n, params.t) - params.P).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, type: 'result' },
                            { value: '', type: 'data' }
                        ]
                    ];
                }
            },

            // Default betting analysis template
            'bet_analysis': {
                type: 'betting',
                description: 'Comprehensive betting probability analysis',
                params: ['winProbability', 'betAmount', 'odds', 'oddsFormat', 'bankroll'],
                template: this.createBettingTemplate.bind(this)
            },

            // Custom betting analysis
            'custom_betting': {
                type: 'betting',
                description: 'Custom betting analysis with your parameters',
                params: ['equation'],
                template: this.createBettingTemplate.bind(this)
            }
        };
    }

    // Helper method for quadratic formula calculation
    calculateQuadraticRoot(a, b, c, positive = true) {
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            return 'No real solution';
        }
        const sqrt_discriminant = Math.sqrt(discriminant);
        if (positive) {
            return ((-b + sqrt_discriminant) / (2 * a)).toFixed(4);
        } else {
            return ((-b - sqrt_discriminant) / (2 * a)).toFixed(4);
        }
    }

    // Helper method for compound interest calculation
    calculateCompoundInterest(P, r, n, t) {
        return P * Math.pow(1 + r / n, n * t);
    }

    // Helper method to parse linear equations in various formats
    parseLinearEquation(equation) {
        // Remove spaces and convert to lowercase for easier parsing
        let eq = equation.replace(/\s/g, '').toLowerCase();

        // Handle different formats:
        // y = mx + b, y = mx - b, mx + b, ax + by = c, etc.
        let m = 0, b = 0;

        try {
            // Handle standard form: y = mx + b or y = mx - b
            if (eq.includes('y=')) {
                const rightSide = eq.split('y=')[1];
                const parsed = this.parseLinearRightSide(rightSide);
                m = parsed.m;
                b = parsed.b;
            }
            // Handle slope-intercept without y=: mx + b
            else if (eq.includes('x') && !eq.includes('=')) {
                const parsed = this.parseLinearRightSide(eq);
                m = parsed.m;
                b = parsed.b;
            }
            // Handle general form: ax + by = c (convert to y = mx + b)
            else if (eq.includes('=') && eq.includes('x') && eq.includes('y')) {
                const parsed = this.parseGeneralLinearForm(eq);
                m = parsed.m;
                b = parsed.b;
            }
            // Handle point-slope form and other formats
            else {
                throw new Error('Unsupported equation format');
            }

            return { m, b };

        } catch (error) {
            throw new Error(`Unable to parse linear equation: ${equation}. Supported formats: y = mx + b, ax + by = c, mx + b`);
        }
    }

    // Helper method to parse the right side of y = mx + b format
    parseLinearRightSide(rightSide) {
        let m = 0, b = 0;

        // Handle cases like: 2x + 3, -3x + 5, x - 2, -x + 4, 5x, -7, etc.
        rightSide = rightSide.replace('y', '');
        // Split by + and - while keeping the operators
        const terms = rightSide.split(/([+-])/).filter(term => term !== '');
        let currentSign = 1;

        for (let i = 0; i < terms.length; i++) {
            const term = terms[i];
            if (term === '+') {
                currentSign = 1;
            } else if (term === '-') {
                currentSign = -1;
            } else {
                if (term.includes('x')) {
                    // Extract coefficient of x
                    let coeff = term.replace('x', '');
                    if (coeff === '' || coeff === '+') {
                        coeff = '1';
                    } else if (coeff === '-') {
                        coeff = '-1';
                    }
                    m += currentSign * parseFloat(coeff);
                } else if (term !== '') {
                    // Constant term
                    b += currentSign * parseFloat(term);
                }
            }
        }

        return { m, b };
    }

    // Helper method to parse general form: ax + by = c
    parseGeneralLinearForm(equation) {
        const [leftSide, rightSide] = equation.split('=');

        // Parse coefficients from ax + by
        let a = 0, b = 0;
        const c = parseFloat(rightSide);

        const terms = leftSide.split(/([+-])/).filter(term => term !== '');
        let currentSign = 1;

        for (let i = 0; i < terms.length; i++) {
            const term = terms[i];

            if (term === '+') {
                currentSign = 1;
            } else if (term === '-') {
                currentSign = -1;
            } else {
                if (term.includes('x')) {
                    let coeff = term.replace('x', '');
                    if (coeff === '' || coeff === '+') coeff = '1';
                    else if (coeff === '-') coeff = '-1';
                    a = currentSign * parseFloat(coeff);
                } else if (term.includes('y')) {
                    let coeff = term.replace('y', '');
                    if (coeff === '' || coeff === '+') coeff = '1';
                    else if (coeff === '-') coeff = '-1';
                    b = currentSign * parseFloat(coeff);
                }
            }
        }

        // Convert to slope-intercept form: y = mx + b
        // From ax + by = c to y = (-a/b)x + (c/b)
        if (b === 0) {
            throw new Error('Invalid linear equation: coefficient of y cannot be zero in general form');
        }

        const m = -a / b;
        const b_intercept = c / b;

        return { m, b: b_intercept };
    }

    // Helper method to describe slope type
    describeSlopeType(slope) {
        if (slope > 0) {
            return 'Increasing line';
        } else if (slope < 0) {
            return 'Decreasing line';
        } else {
            return 'Horizontal line';
        }
    }

    // Helper method to parse quadratic equations in various formats
    parseQuadraticEquation(equation) {
        // Remove spaces and convert to lowercase for easier parsing
        let eq = equation.replace(/\s/g, '').toLowerCase();

        // Handle different formats:
        // y = ax² + bx + c, ax² + bx + c = 0, x² + bx + c, etc.
        let a = 0, b = 0, c = 0;

        try {
            // Handle standard form: y = ax² + bx + c
            if (eq.includes('y=')) {
                const rightSide = eq.split('y=')[1];
                const parsed = this.parseQuadraticRightSide(rightSide);
                a = parsed.a;
                b = parsed.b;
                c = parsed.c;
            }
            // Handle equation form: ax² + bx + c = 0
            else if (eq.includes('=0')) {
                const leftSide = eq.split('=0')[0];
                const parsed = this.parseQuadraticRightSide(leftSide);
                a = parsed.a;
                b = parsed.b;
                c = parsed.c;
            }
            // Handle just the polynomial: ax² + bx + c
            else if (eq.includes('x²') || eq.includes('x^2')) {
                const parsed = this.parseQuadraticRightSide(eq);
                a = parsed.a;
                b = parsed.b;
                c = parsed.c;
            } else {
                throw new Error('Unsupported equation format');
            }

            if (a === 0) {
                throw new Error('Not a quadratic equation (coefficient of x² cannot be zero)');
            }

            return { a, b, c };

        } catch (error) {
            throw new Error(`Unable to parse quadratic equation: ${equation}. Supported formats: y = ax² + bx + c, ax² + bx + c = 0, ax² + bx + c`);
        }
    }

    // Helper method to parse the polynomial part of quadratic equations
    parseQuadraticRightSide(rightSide) {
        let a = 0, b = 0, c = 0;
        // Replace x^2 with x² for consistency
        rightSide = rightSide.replace(/x\^2/g, 'x²');
        // Split by + and - while keeping the operators
        const terms = rightSide.split(/([+-])/).filter(term => term !== '');

        let currentSign = 1;
        for (let i = 0; i < terms.length; i++) {
            const term = terms[i];
            if (term === '+') {
                currentSign = 1;
            } else if (term === '-') {
                currentSign = -1;
            } else if (term !== '') {
                if (term.includes('x²')) {
                    // Extract coefficient of x²
                    let coeff = term.replace('x²', '');
                    if (coeff === '' || coeff === '+') {
                        coeff = '1';
                    } else if (coeff === '-') {
                        coeff = '-1';
                    }
                    a += currentSign * parseFloat(coeff);
                } else if (term.includes('x') && !term.includes('x²')) {
                    // Extract coefficient of x
                    let coeff = term.replace('x', '');
                    if (coeff === '' || coeff === '+') {
                        coeff = '1';
                    } else if (coeff === '-') {
                        coeff = '-1';
                    }
                    b += currentSign * parseFloat(coeff);
                } else {
                    // Constant term
                    c += currentSign * parseFloat(term);
                }
            }
        }

        return { a, b, c };
    }

    // Helper method to calculate vertex of parabola
    calculateVertex(a, b, c) {
        const x = -b / (2 * a);
        const y = a * x * x + b * x + c;
        return { x, y };
    }

    // Helper method to describe root type based on discriminant
    describeRootType(discriminant) {
        if (discriminant > 0) {
            return 'Two distinct real roots';
        } else if (discriminant === 0) {
            return 'One repeated real root';
        } else {
            return 'Two complex conjugate roots';
        }
    }

    // Parse betting equation from user input
    parseBettingEquation(equation) {
        const defaultParams = {
            winProbability: 0.55,
            betAmount: 100,
            odds: 2.0,
            oddsFormat: 'decimal',
            bankroll: 1000
        };

        try {
            // Remove spaces and normalize the equation
            const cleanEquation = equation.replace(/\s/g, '');

            // Check if it's just the template name
            if (cleanEquation.toLowerCase() === 'bet_analysis' || cleanEquation.toLowerCase() === 'custom_betting') {
                return defaultParams;
            }

            // Try to parse as JavaScript object notation
            // Handle different input formats
            let parsedParams = {};

            // Method 1: Try to parse as JSON-like object
            if (cleanEquation.includes('{') && cleanEquation.includes('}')) {
                try {
                    // Extract the object part
                    const objectMatch = cleanEquation.match(/\{[^}]+\}/);
                    if (objectMatch) {
                        let objectStr = objectMatch[0];
                        // Convert to valid JSON
                        objectStr = objectStr.replace(/(\w+):/g, '"$1":');
                        objectStr = objectStr.replace(/'/g, '"');
                        parsedParams = JSON.parse(objectStr);
                    }
                } catch (e) {
                    console.warn('Failed to parse as JSON object, trying parameter extraction');
                }
            }

            // Method 2: Extract parameters using regex patterns
            if (Object.keys(parsedParams).length === 0) {
                const patterns = {
                    winProbability: /winProbability[:\s]*([0-9.]+)/i,
                    betAmount: /betAmount[:\s]*([0-9.]+)/i,
                    odds: /odds[:\s]*(-?[0-9.]+)/i,
                    oddsFormat: /oddsFormat[:\s]*['"]?(\w+)['"]?/i,
                    bankroll: /bankroll[:\s]*([0-9.]+)/i
                };

                Object.keys(patterns).forEach(param => {
                    const match = equation.match(patterns[param]);
                    if (match) {
                        if (param === 'oddsFormat') {
                            parsedParams[param] = match[1].toLowerCase();
                        } else {
                            parsedParams[param] = parseFloat(match[1]);
                        }
                    }
                });
            }

            // Method 3: Handle simple comma-separated values
            if (Object.keys(parsedParams).length === 0) {
                const values = cleanEquation.split(',').map(v => v.trim());
                if (values.length >= 4) {
                    parsedParams = {
                        winProbability: parseFloat(values[0]) || defaultParams.winProbability,
                        betAmount: parseFloat(values[1]) || defaultParams.betAmount,
                        odds: parseFloat(values[2]) || defaultParams.odds,
                        oddsFormat: values[3].replace(/['"]/g, '').toLowerCase() || defaultParams.oddsFormat,
                        bankroll: parseFloat(values[4]) || defaultParams.bankroll
                    };
                }
            }

            // Merge with defaults for any missing parameters
            const result = { ...defaultParams, ...parsedParams };

            // Validate parameters
            result.winProbability = Math.max(0, Math.min(1, result.winProbability));
            result.betAmount = Math.max(0, result.betAmount);
            result.bankroll = Math.max(result.betAmount, result.bankroll);

            if (!['decimal', 'american', 'fractional'].includes(result.oddsFormat)) {
                result.oddsFormat = 'decimal';
            }

            return result;

        } catch (error) {
            console.warn('Failed to parse betting equation, using defaults:', error.message);
            return defaultParams;
        }
    }

    createBettingTemplate(equation, params) {
        const { winProbability, betAmount, odds, oddsFormat, bankroll } = params;
        const data = [];

        // Convert odds to decimal format for calculations
        let decimalOdds = odds;
        let impliedProbability, expectedValue, variance, standardDeviation;

        if (oddsFormat === 'american') {
            decimalOdds = odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1;
        } else if (oddsFormat === 'fractional') {
            // Assuming odds is passed as decimal representation of fraction
            decimalOdds = odds + 1;
        }

        // Calculate betting metrics
        impliedProbability = 1 / decimalOdds;
        const payout = betAmount * decimalOdds;
        const profit = payout - betAmount;
        expectedValue = (winProbability * profit) - ((1 - winProbability) * betAmount);

        // Calculate variance and standard deviation
        const winOutcome = profit;
        const loseOutcome = -betAmount;
        const expectedOutcome = expectedValue;
        variance = winProbability * Math.pow(winOutcome - expectedOutcome, 2) +
                  (1 - winProbability) * Math.pow(loseOutcome - expectedOutcome, 2);
        standardDeviation = Math.sqrt(variance);

        // Header
        data.push([
            { value: 'Betting Probability Analysis', type: 'header', span: 4, style: 'title' },
            '', '', ''
        ]);
        data.push([
            { value: `Generated: ${new Date().toLocaleString()}`, type: 'data', span: 4 },
            '', '', ''
        ]);
        data.push(['', '', '', '']); // Empty row

        // Input Parameters Display
        data.push([
            { value: 'Input Parameters', type: 'header', span: 4 },
            '', '', ''
        ]);

        data.push([
            { value: 'Parameter', type: 'header' },
            { value: 'Value', type: 'header' },
            { value: 'Format', type: 'header' },
            { value: 'Description', type: 'header' }
        ]);

        data.push([
            { value: 'Bet Amount', type: 'label' },
            { value: `$${betAmount.toFixed(2)}`, type: 'result' },
            { value: 'USD', type: 'data' },
            { value: 'Amount wagered per bet', type: 'data' }
        ]);

        data.push([
            { value: 'Winning Probability', type: 'label' },
            { value: `${(winProbability * 100).toFixed(2)}%`, type: 'result' },
            { value: 'Percentage', type: 'data' },
            { value: 'Your estimated chance of winning', type: 'data' }
        ]);

        data.push([
            { value: 'Losing Probability', type: 'label' },
            { value: `${((1 - winProbability) * 100).toFixed(2)}%`, type: 'result' },
            { value: 'Percentage', type: 'data' },
            { value: 'Your estimated chance of losing', type: 'data' }
        ]);

        data.push([
            { value: 'Original Odds', type: 'label' },
            { value: odds.toString(), type: 'result' },
            { value: oddsFormat.charAt(0).toUpperCase() + oddsFormat.slice(1), type: 'data' },
            { value: 'Bookmaker odds as entered', type: 'data' }
        ]);

        data.push([
            { value: 'Decimal Odds', type: 'label' },
            { value: decimalOdds.toFixed(2), type: 'result' },
            { value: 'Decimal', type: 'data' },
            { value: 'Converted to decimal format', type: 'data' }
        ]);

        data.push([
            { value: 'Implied Probability', type: 'label' },
            { value: `${(impliedProbability * 100).toFixed(2)}%`, type: 'result' },
            { value: 'Percentage', type: 'data' },
            { value: 'Probability implied by bookmaker odds', type: 'data' }
        ]);

        data.push(['', '', '', '']); // Empty row

        // Payout Analysis
        data.push([
            { value: 'Payout Analysis', type: 'header', span: 4 },
            '', '', ''
        ]);

        data.push([
            { value: 'Scenario', type: 'header' },
            { value: 'Probability', type: 'header' },
            { value: 'Total Return', type: 'header' },
            { value: 'Net Profit/Loss', type: 'header' }
        ]);

        data.push([
            { value: 'Win', type: 'label' },
            { value: `${(winProbability * 100).toFixed(2)}%`, type: 'result' },
            { value: `$${payout.toFixed(2)}`, type: 'data' },
            { value: `+$${profit.toFixed(2)}`, type: 'result' }
        ]);

        data.push([
            { value: 'Loss', type: 'label' },
            { value: `${((1 - winProbability) * 100).toFixed(2)}%`, type: 'result' },
            { value: '$0.00', type: 'data' },
            { value: `-$${betAmount.toFixed(2)}`, type: 'result' }
        ]);

        data.push(['', '', '', '']); // Empty row

        // Expected Value Analysis
        data.push([
            { value: 'Statistical Analysis', type: 'header', span: 4 },
            '', '', ''
        ]);

        data.push([
            { value: 'Metric', type: 'header' },
            { value: 'Formula', type: 'header' },
            { value: 'Value', type: 'header' },
            { value: 'Interpretation', type: 'header' }
        ]);

        data.push([
            { value: 'Expected Value', type: 'label' },
            { value: 'E(X) = P(win)×Profit - P(lose)×Loss', type: 'formula' },
            { value: `$${expectedValue.toFixed(2)}`, type: 'result' },
            { value: expectedValue > 0 ? 'Positive expectation - Good bet!' : expectedValue < 0 ? 'Negative expectation - Bad bet' : 'Break-even bet', type: 'data' }
        ]);

        data.push([
            { value: 'Expected Value %', type: 'label' },
            { value: '(E(X) / Bet Amount) × 100', type: 'formula' },
            { value: `${((expectedValue / betAmount) * 100).toFixed(2)}%`, type: 'result' },
            { value: 'Return on investment per bet', type: 'data' }
        ]);

        data.push([
            { value: 'Variance', type: 'label' },
            { value: 'Var(X) = Σ[P(x)×(x-μ)²]', type: 'formula' },
            { value: variance.toFixed(2), type: 'result' },
            { value: 'Measure of bet volatility', type: 'data' }
        ]);

        data.push([
            { value: 'Standard Deviation', type: 'label' },
            { value: 'σ = √Var(X)', type: 'formula' },
            { value: `$${standardDeviation.toFixed(2)}`, type: 'result' },
            { value: 'Risk (uncertainty) per bet', type: 'data' }
        ]);

        // Edge calculation
        const edge = winProbability - impliedProbability;
        data.push([
            { value: 'Betting Edge', type: 'label' },
            { value: 'Your Prob - Implied Prob', type: 'formula' },
            { value: `${(edge * 100).toFixed(2)}%`, type: 'result' },
            { value: edge > 0.05 ? 'Strong positive edge' : edge > 0 ? 'Positive edge (good bet)' : edge < -0.05 ? 'Strong negative edge' : 'Negative edge (avoid)', type: 'data' }
        ]);

        data.push(['', '', '', '']); // Empty row

        // Bankroll Management
        data.push([
            { value: 'Bankroll Management', type: 'header', span: 4 },
            '', '', ''
        ]);

        const betPercentage = (betAmount / bankroll) * 100;
        const maxConsecutiveLosses = Math.floor(bankroll / betAmount);

        // Kelly Criterion calculation
        const kellyFraction = edge > 0 ? (winProbability * decimalOdds - 1) / (decimalOdds - 1) : 0;
        const kellySuggested = Math.max(0, kellyFraction * bankroll);

        data.push([
            { value: 'Metric', type: 'header' },
            { value: 'Value', type: 'header' },
            { value: 'Assessment', type: 'header' },
            { value: 'Risk Level', type: 'header' }
        ]);

        data.push([
            { value: 'Current Bankroll', type: 'label' },
            { value: `$${bankroll.toFixed(2)}`, type: 'result' },
            { value: 'Total available funds', type: 'data' },
            { value: 'N/A', type: 'data' }
        ]);

        data.push([
            { value: 'Bet Size %', type: 'label' },
            { value: `${betPercentage.toFixed(2)}%`, type: 'result' },
            { value: betPercentage <= 2 ? 'Very Conservative' : betPercentage <= 5 ? 'Conservative' : betPercentage <= 10 ? 'Moderate' : 'Aggressive', type: 'data' },
            { value: betPercentage <= 5 ? 'Low' : betPercentage <= 10 ? 'Medium' : 'High', type: 'data' }
        ]);

        data.push([
            { value: 'Kelly Criterion', type: 'label' },
            { value: `$${kellySuggested.toFixed(2)}`, type: 'result' },
            { value: `${((kellySuggested / bankroll) * 100).toFixed(2)}% of bankroll`, type: 'data' },
            { value: kellyFraction > 0 ? 'Mathematically optimal' : 'Avoid this bet', type: 'data' }
        ]);

        data.push([
            { value: 'Survival Capacity', type: 'label' },
            { value: `${maxConsecutiveLosses} bets`, type: 'result' },
            { value: 'Max consecutive losses before ruin', type: 'data' },
            { value: maxConsecutiveLosses >= 20 ? 'Good' : maxConsecutiveLosses >= 10 ? 'Moderate' : 'Risky', type: 'data' }
        ]);

        data.push(['', '', '', '']); // Empty row

        // Simulation Results
        data.push([
            { value: 'Long-term Projection (100 bets)', type: 'header', span: 4 },
            '', '', ''
        ]);

        data.push([
            { value: 'Outcome', type: 'header' },
            { value: 'Expected Count', type: 'header' },
            { value: 'Expected Profit/Loss', type: 'header' },
            { value: 'Cumulative Impact', type: 'header' }
        ]);

        const expectedWins = winProbability * 100;
        const expectedLosses = (1 - winProbability) * 100;
        const totalExpectedProfit = expectedValue * 100;
        const totalBetAmount = betAmount * 100;

        data.push([
            { value: 'Wins', type: 'label' },
            { value: expectedWins.toFixed(1), type: 'result' },
            { value: `+$${(expectedWins * profit).toFixed(2)}`, type: 'data' },
            { value: 'Positive contribution', type: 'data' }
        ]);

        data.push([
            { value: 'Losses', type: 'label' },
            { value: expectedLosses.toFixed(1), type: 'result' },
            { value: `-$${(expectedLosses * betAmount).toFixed(2)}`, type: 'data' },
            { value: 'Negative contribution', type: 'data' }
        ]);

        data.push([
            { value: 'Total Wagered', type: 'label' },
            { value: '100 bets', type: 'formula' },
            { value: `$${totalBetAmount.toFixed(2)}`, type: 'result' },
            { value: 'Total money at risk', type: 'data' }
        ]);

        data.push([
            { value: 'Net Expected Result', type: 'label' },
            { value: 'Over 100 bets', type: 'formula' },
            { value: `$${totalExpectedProfit.toFixed(2)}`, type: 'result' },
            { value: totalExpectedProfit > 0 ? 'Profitable long-term' : 'Unprofitable long-term', type: 'data' }
        ]);

        data.push([
            { value: 'ROI %', type: 'label' },
            { value: '(Net Profit / Total Wagered) × 100', type: 'formula' },
            { value: `${((totalExpectedProfit / totalBetAmount) * 100).toFixed(2)}%`, type: 'result' },
            { value: 'Return on investment', type: 'data' }
        ]);

        data.push(['', '', '', '']); // Empty row

        // Recommendations
        data.push([
            { value: 'Recommendations', type: 'header', span: 4 },
            '', '', ''
        ]);

        const recommendations = this.generateRecommendations(expectedValue, edge, betPercentage, kellyFraction);
        recommendations.forEach(rec => {
            data.push([
                { value: rec.category, type: 'label' },
                { value: rec.recommendation, type: 'data', span: 3 },
                '', ''
            ]);
        });

        return data;
    }

    generateRecommendations(expectedValue, edge, betPercentage, kellyFraction) {
        const recommendations = [];

        // Bet Decision
        if (expectedValue > 0 && edge > 0.02) {
            recommendations.push({
                category: 'Bet Decision',
                recommendation: '✅ RECOMMENDED - Positive expected value with good edge'
            });
        } else if (expectedValue > 0) {
            recommendations.push({
                category: 'Bet Decision',
                recommendation: '⚠️ MARGINAL - Small positive edge, proceed with caution'
            });
        } else {
            recommendations.push({
                category: 'Bet Decision',
                recommendation: '❌ NOT RECOMMENDED - Negative expected value'
            });
        }

        // Bet Sizing
        if (betPercentage <= 2) {
            recommendations.push({
                category: 'Bet Sizing',
                recommendation: '🛡️ Very conservative sizing - Low risk approach'
            });
        } else if (betPercentage <= 5) {
            recommendations.push({
                category: 'Bet Sizing',
                recommendation: '✅ Conservative sizing - Recommended for most bettors'
            });
        } else if (betPercentage <= 10) {
            recommendations.push({
                category: 'Bet Sizing',
                recommendation: '⚠️ Moderate sizing - Acceptable if confident in edge'
            });
        } else {
            recommendations.push({
                category: 'Bet Sizing',
                recommendation: '🚨 Aggressive sizing - High risk, consider reducing'
            });
        }

        // Kelly Criterion
        if (kellyFraction > 0.1) {
            recommendations.push({
                category: 'Kelly Advice',
                recommendation: 'Strong mathematical edge detected - Consider increasing bet size'
            });
        } else if (kellyFraction > 0.02) {
            recommendations.push({
                category: 'Kelly Advice',
                recommendation: 'Moderate edge - Current bet size may be appropriate'
            });
        } else if (kellyFraction > 0) {
            recommendations.push({
                category: 'Kelly Advice',
                recommendation: 'Small edge - Consider smaller bet size'
            });
        } else {
            recommendations.push({
                category: 'Kelly Advice',
                recommendation: 'No mathematical edge - Kelly suggests avoiding this bet'
            });
        }

        return recommendations;
    }

    // Method to get supported parameter formats for betting
    getSupportedParameterFormats() {
        return {
            formats: [
                'Object notation: { winProbability: 0.55, betAmount: 100, odds: 2.0, oddsFormat: "decimal", bankroll: 1000 }',
                'Parameter list: winProbability: 0.55, betAmount: 100, odds: 2.0, oddsFormat: decimal, bankroll: 1000',
                'Comma separated: 0.55, 100, 2.0, decimal, 1000',
                'Template name: bet_analysis (uses defaults)'
            ],
            parameters: {
                winProbability: 'Your estimated probability of winning (0.0 to 1.0)',
                betAmount: 'Amount to bet per wager (positive number)',
                odds: 'Bookmaker odds in specified format',
                oddsFormat: 'Format of odds: "decimal", "american", or "fractional"',
                bankroll: 'Total bankroll available for betting (positive number)'
            },
            examples: {
                conservative: 'winProbability: 0.55, betAmount: 25, odds: 1.9, oddsFormat: decimal, bankroll: 1000',
                aggressive: 'winProbability: 0.65, betAmount: 100, odds: 2.2, oddsFormat: decimal, bankroll: 500',
                american_odds: 'winProbability: 0.6, betAmount: 50, odds: +150, oddsFormat: american, bankroll: 2000',
                fractional_odds: 'winProbability: 0.45, betAmount: 75, odds: 2.5, oddsFormat: fractional, bankroll: 1500'
            },
            validation: {
                winProbability: { min: 0, max: 1, type: 'float' },
                betAmount: { min: 0.01, max: Infinity, type: 'float' },
                odds: { min: -Infinity, max: Infinity, type: 'float' },
                oddsFormat: { values: ['decimal', 'american', 'fractional'], type: 'string' },
                bankroll: { min: 0.01, max: Infinity, type: 'float' }
            }
        };
    }

    // Method to validate betting parameters
    validateBettingParameters(params) {
        const validation = this.getSupportedParameterFormats().validation;
        const errors = [];

        Object.keys(validation).forEach(param => {
            const value = params[param];
            const rules = validation[param];

            if (value === undefined || value === null) {
                errors.push(`Parameter '${param}' is required`);
                return;
            }

            if (rules.type === 'float') {
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                    errors.push(`Parameter '${param}' must be a valid number`);
                    return;
                }
                if (numValue < rules.min || numValue > rules.max) {
                    errors.push(`Parameter '${param}' must be between ${rules.min} and ${rules.max}`);
                    return;
                }
            }

            if (rules.type === 'string' && rules.values) {
                if (!rules.values.includes(value.toString().toLowerCase())) {
                    errors.push(`Parameter '${param}' must be one of: ${rules.values.join(', ')}`);
                    return;
                }
            }
        });

        // Additional validation rules
        if (params.betAmount > params.bankroll) {
            errors.push('Bet amount cannot exceed bankroll');
        }

        if (params.winProbability <= 0 || params.winProbability >= 1) {
            errors.push('Win probability must be between 0 and 1 (exclusive)');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Method to convert odds between formats
    convertOdds(odds, fromFormat, toFormat) {
        if (fromFormat === toFormat) return odds;

        let decimal;

        // Convert to decimal first
        switch (fromFormat.toLowerCase()) {
            case 'decimal':
                decimal = odds;
                break;
            case 'american':
                decimal = odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1;
                break;
            case 'fractional':
                decimal = odds + 1;
                break;
            default:
                throw new Error(`Unsupported odds format: ${fromFormat}`);
        }

        // Convert from decimal to target format
        switch (toFormat.toLowerCase()) {
            case 'decimal':
                return Math.round(decimal * 100) / 100;
            case 'american':
                return decimal >= 2 ?
                    Math.round((decimal - 1) * 100) :
                    Math.round(-100 / (decimal - 1));
            case 'fractional':
                return Math.round((decimal - 1) * 100) / 100;
            default:
                throw new Error(`Unsupported odds format: ${toFormat}`);
        }
    }

    // Method to calculate break-even probability
    calculateBreakEvenProbability(odds, oddsFormat = 'decimal') {
        const decimalOdds = this.convertOdds(odds, oddsFormat, 'decimal');
        return 1 / decimalOdds;
    }

    // Method to calculate implied probability
    calculateImpliedProbability(odds, oddsFormat = 'decimal') {
        return this.calculateBreakEvenProbability(odds, oddsFormat);
    }

    // Method to calculate Kelly Criterion
    calculateKellyCriterion(winProbability, odds, oddsFormat = 'decimal') {
        const decimalOdds = this.convertOdds(odds, oddsFormat, 'decimal');
        const lossProb = 1 - winProbability;
        return (winProbability * decimalOdds - 1) / (decimalOdds - 1);
    }

    // Method to simulate betting outcomes
    simulateBetting(params, numSimulations = 1000) {
        const { winProbability, betAmount, odds, oddsFormat, bankroll } = params;
        const decimalOdds = this.convertOdds(odds, oddsFormat, 'decimal');
        const profit = betAmount * (decimalOdds - 1);

        const results = {
            wins: 0,
            losses: 0,
            totalProfit: 0,
            maxWinStreak: 0,
            maxLossStreak: 0,
            outcomes: []
        };

        let currentWinStreak = 0;
        let currentLossStreak = 0;

        for (let i = 0; i < numSimulations; i++) {
            const isWin = Math.random() < winProbability;
            const outcome = isWin ? profit : -betAmount;

            results.outcomes.push(outcome);
            results.totalProfit += outcome;

            if (isWin) {
                results.wins++;
                currentWinStreak++;
                currentLossStreak = 0;
                results.maxWinStreak = Math.max(results.maxWinStreak, currentWinStreak);
            } else {
                results.losses++;
                currentLossStreak++;
                currentWinStreak = 0;
                results.maxLossStreak = Math.max(results.maxLossStreak, currentLossStreak);
            }
        }

        results.winRate = results.wins / numSimulations;
        results.averageProfit = results.totalProfit / numSimulations;
        results.roi = (results.totalProfit / (betAmount * numSimulations)) * 100;

        return results;
    }

    // Method to generate risk assessment
    generateRiskAssessment(params) {
        const { winProbability, betAmount, bankroll, odds, oddsFormat } = params;
        const decimalOdds = this.convertOdds(odds, oddsFormat, 'decimal');
        const impliedProbability = this.calculateImpliedProbability(odds, oddsFormat);
        const kelly = this.calculateKellyCriterion(winProbability, odds, oddsFormat);

        const riskFactors = [];
        let riskScore = 0;

        // Bet size risk
        const betPercentage = (betAmount / bankroll) * 100;
        if (betPercentage > 10) {
            riskFactors.push('High bet size relative to bankroll (>10%)');
            riskScore += 3;
        } else if (betPercentage > 5) {
            riskFactors.push('Moderate bet size relative to bankroll (5-10%)');
            riskScore += 1;
        }

        // Edge risk
        const edge = winProbability - impliedProbability;
        if (edge <= 0) {
            riskFactors.push('No positive edge detected');
            riskScore += 4;
        } else if (edge < 0.02) {
            riskFactors.push('Very small edge (<2%)');
            riskScore += 2;
        }

        // Kelly risk
        if (kelly <= 0) {
            riskFactors.push('Kelly Criterion suggests avoiding this bet');
            riskScore += 3;
        } else if (kelly < betPercentage / 100) {
            riskFactors.push('Bet size exceeds Kelly Criterion recommendation');
            riskScore += 1;
        }

        // Probability confidence
        if (winProbability > 0.8) {
            riskFactors.push('Very high win probability claim (>80%) - verify confidence');
            riskScore += 1;
        }

        return {
            riskScore: riskScore,
            riskLevel: riskScore === 0 ? 'Low' : riskScore <= 3 ? 'Moderate' : riskScore <= 6 ? 'High' : 'Very High',
            riskFactors: riskFactors,
            recommendations: this.generateRiskRecommendations(riskScore, riskFactors)
        };
    }

    // Method to generate risk-based recommendations
    generateRiskRecommendations(riskScore, riskFactors) {
        const recommendations = [];

        if (riskScore === 0) {
            recommendations.push('✅ Low risk profile - Proceed as planned');
        } else if (riskScore <= 3) {
            recommendations.push('⚠️ Moderate risk - Consider reducing bet size');
            recommendations.push('📊 Monitor results closely');
        } else if (riskScore <= 6) {
            recommendations.push('🚨 High risk detected - Strongly consider avoiding');
            recommendations.push('💰 If proceeding, significantly reduce bet size');
            recommendations.push('📈 Reassess probability estimates');
        } else {
            recommendations.push('❌ Very high risk - Avoid this bet');
            recommendations.push('🔍 Review analysis methodology');
            recommendations.push('💡 Consider paper trading first');
        }

        return recommendations;
    }

    // Method to parse custom equations with parameters
    parseCustomEquation(equation, parameters) {
        let normalizedEq = equation.toLowerCase().replace(/\s/g, '');

        // Special handling for betting
        if (normalizedEq.startsWith('bet_analysis') || normalizedEq.startsWith('custom_betting')) {
            let paramsString = equation.replace(/bet_analysis|custom_betting/i, '').trim();
            let parsedParams;

            if (paramsString) {
                // Parse the remaining string as params
                parsedParams = this.parseBettingEquation(paramsString);
            } else if (parameters && Object.keys(parameters).length > 0) {
                // Use provided parameters object
                parsedParams = { ...this.getDefaultParameters('bet_analysis'), ...parameters };
            } else {
                // Defaults
                parsedParams = this.getDefaultParameters('bet_analysis');
            }

            // Validate
            const validation = this.validateParameters('bet_analysis', parsedParams);
            if (!validation.isValid) {
                throw new Error(`Invalid betting parameters: ${validation.errors.join('; ')}`);
            }

            return {
                equation: 'bet_analysis',
                template: this.formulaDatabase['bet_analysis'],
                parameters: parsedParams
            };
        }

        if (!this.formulaDatabase[normalizedEq]) {
            throw new Error(`Unknown equation: ${equation}`);
        }

        const template = this.formulaDatabase[normalizedEq];
        // Validate parameters
        const requiredParams = template.params;
        const missingParams = requiredParams.filter(param => !(param in parameters));

        if (missingParams.length > 0) {
            throw new Error(`Missing parameters: ${missingParams.join(', ')}`);
        }

        // Validate parameter types and values
        this.validateParameters(normalizedEq, parameters);

        return {
            equation: normalizedEq,
            template: template,
            parameters: parameters
        };
    }

    // Method to validate parameters based on equation type
    validateParameters(equation, parameters) {
        switch(equation) {
            case 'linearfunction':
                // Linear functions are valid for any real numbers m and b
                if (typeof parameters.m !== 'number' || typeof parameters.b !== 'number') {
                    throw new Error('Parameters "m" and "b" must be numbers');
                }
                break;
            case 'customlinear':
                // Custom linear requires an equation string
                if (typeof parameters.equation !== 'string' || parameters.equation.trim() === '') {
                    throw new Error('Parameter "equation" must be a non-empty string');
                }
                // Test if the equation can be parsed
                try {
                    this.parseLinearEquation(parameters.equation);
                } catch (error) {
                    throw new Error(`Invalid linear equation: ${error.message}`);
                }
                break;
            case 'customquadratic':
                // Custom quadratic requires an equation string
                if (typeof parameters.equation !== 'string' || parameters.equation.trim() === '') {
                    throw new Error('Parameter "equation" must be a non-empty string');
                }
                // Test if the equation can be parsed
                try {
                    this.parseQuadraticEquation(parameters.equation);
                } catch (error) {
                    throw new Error(`Invalid quadratic equation: ${error.message}`);
                }
                break;
            case 'quadraticformula':
                if (parameters.a === 0) {
                    throw new Error('Parameter "a" cannot be zero in quadratic formula');
                }
                break;
            case 'compoundinterest':
                if (parameters.P <= 0) {
                    throw new Error('Principal amount must be positive');
                }
                if (parameters.r < 0) {
                    throw new Error('Interest rate cannot be negative');
                }
                if (parameters.n <= 0) {
                    throw new Error('Number of compounds per year must be positive');
                }
                if (parameters.t <= 0) {
                    throw new Error('Time period must be positive');
                }
                break;
            case 'bet_analysis':
            case 'custom_betting':
                const bettingValidation = this.validateBettingParameters(parameters);
                if (!bettingValidation.isValid) {
                    throw new Error(bettingValidation.errors.join('; '));
                }
                break;
        }
    }

    // Method to get default analysis template for an equation
    getDefaultAnalysisTemplate(equation) {
        const normalizedEq = equation.toLowerCase().replace(/\s/g, '');

        if (!this.formulaDatabase[normalizedEq]) {
            throw new Error(`Unknown equation: ${equation}`);
        }

        const template = this.formulaDatabase[normalizedEq];
        // Provide default parameters based on equation type
        const defaultParams = this.getDefaultParameters(normalizedEq);

        return {
            equation: normalizedEq,
            type: template.type,
            description: template.description,
            requiredParams: template.params,
            defaultParams: defaultParams,
            example: this.generateSpreadsheetWithParams(equation, defaultParams) // Note: This method is missing in the provided code
        };
    }

    // Method to get default parameters for each equation
    getDefaultParameters(equation) {
        const defaults = {
            'linearfunction': { m: 2, b: 3 }, // y = 2x + 3
            'customlinear': { equation: 'y = 2x + 3' }, // Example custom linear equation
            'quadraticformula': { a: 1, b: -5, c: 6 }, // x² - 5x + 6 = 0
            'customquadratic': { equation: 'y = x² - 4x + 3' }, // Example custom quadratic equation
            'compoundinterest': { P: 1000, r: 0.05, n: 12, t: 5 }, // $1000 at 5% compounded monthly for 5 years
            'bet_analysis': {
                winProbability: 0.55,
                betAmount: 100,
                odds: 2.0,
                oddsFormat: 'decimal',
                bankroll: 1000
            },
            'custom_betting': {
                equation: 'winProbability:0.55, betAmount:100, odds:2.0, oddsFormat:decimal, bankroll:1000'
            }
        };

        return defaults[equation] || {};
    }

    // Method to get available equations
    getAvailableEquations() {
        return Object.keys(this.formulaDatabase).map(key => ({
            equation: key,
            type: this.formulaDatabase[key].type,
            description: this.formulaDatabase[key].description,
            params: this.formulaDatabase[key].params
        }));
    }

    // Method to get calculation history
    getCalculationHistory() {
        return this.calculationHistory;
    }

    // Method to clear history
    clearHistory() {
        this.calculationHistory = [];
    }

    // Method to change theme
    setTheme(theme) {
        this.theme = theme;
        this.setThemeColors();
    }

    // Method to add custom equation template
    addCustomEquation(name, config) {
        const normalizedName = name.toLowerCase().replace(/\s/g, '');
        this.formulaDatabase[normalizedName] = {
            type: config.type || 'custom',
            description: config.description || name,
            params: config.params || [],
            template: config.template
        };
    }



    // Method to calculate betting metrics for statistics
    calculateBettingMetrics(params) {
        const { winProbability, betAmount, odds, oddsFormat, bankroll } = params;
        const decimalOdds = this.convertOdds(odds, oddsFormat, 'decimal');
        const impliedProbability = this.calculateImpliedProbability(odds, oddsFormat);
        const payout = betAmount * decimalOdds;
        const profit = payout - betAmount;
        const expectedValue = (winProbability * profit) - ((1 - winProbability) * betAmount);
        const edge = winProbability - impliedProbability;
        const kellyFraction = this.calculateKellyCriterion(winProbability, odds, oddsFormat);
        const betPercentage = (betAmount / bankroll) * 100;

        // Calculate variance and standard deviation
        const winOutcome = profit;
        const loseOutcome = -betAmount;
        const variance = winProbability * Math.pow(winOutcome - expectedValue, 2) +
                        (1 - winProbability) * Math.pow(loseOutcome - expectedValue, 2);
        const standardDeviation = Math.sqrt(variance);

        return {
            expectedValue,
            edge,
            kellyFraction,
            betPercentage,
            impliedProbability,
            variance,
            standardDeviation
        };
    }

    // Method to generate spreadsheet from equation with custom parameters
    generateSpreadsheetWithParams(equation, parameters) {
        const parsedEq = this.parseCustomEquation(equation, parameters);
        const template = parsedEq.template;
        const data = template.template(equation, parsedEq.parameters); // Use parsed parameters

        this.currentSheet = {
            equation: parsedEq.equation,
            type: template.type,
            description: template.description,
            data: data,
            parameters: parsedEq.parameters,
            generated: new Date().toISOString(),
            rows: data.length,
            cols: data[0] ? data[0].length : 0
        };

        this.calculationHistory.push({
            equation: parsedEq.equation,
            parameters: parsedEq.parameters,
            timestamp: new Date().toISOString(),
            type: template.type
        });

        return this.currentSheet;
    }

    // Enhanced method to generate spreadsheet from equation
    generateSpreadsheet(equation, parameters = null) {
        const normalizedEq = equation.toLowerCase().replace(/\s/g, '');
        if (!this.formulaDatabase[normalizedEq]) {
            throw new Error(`Unknown equation: ${equation}. Available equations: ${Object.keys(this.formulaDatabase).join(', ')}`);
        }

        const template = this.formulaDatabase[normalizedEq];
        // Use provided parameters or defaults
        const finalParams = parameters || this.getDefaultParameters(normalizedEq);

        // Validate parameters
        this.validateParameters(normalizedEq, finalParams);

        // Generate the data using the template
        const data = template.template(equation, finalParams);

        this.currentSheet = {
            equation: normalizedEq,
            type: template.type,
            description: template.description,
            data: data,
            parameters: finalParams,
            generated: new Date().toISOString(),
            rows: data.length,
            cols: data[0] ? data[0].length : 0
        };

        this.calculationHistory.push({
            equation: normalizedEq,
            parameters: finalParams,
            timestamp: new Date().toISOString(),
            type: template.type
        });

        return this.currentSheet;
    }

   setCellBackground(ctx, x, y, type, span = 1) {
        let bgColor = this.colors.cellBg;

        switch (type) {
            case 'header':
                bgColor = this.colors.headerBg;
                break;
            case 'result':
            case 'positive':
                bgColor = this.theme === 'dark' ? '#1a4d2e' : '#e8f5e8';
                break;
            case 'negative':
                bgColor = this.theme === 'dark' ? '#4d1a1a' : '#ffeaea';
                break;
            case 'formula':
                bgColor = this.theme === 'dark' ? '#2a2a4d' : '#f0f0ff';
                break;
            case 'title':
                bgColor = this.theme === 'dark' ? '#2d2d2d' : '#f0f0f0';
                break;
        }

        if (bgColor !== this.colors.cellBg) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(x, y, this.cellWidth * span, this.cellHeight);
        }

        return bgColor; // Return for potential use in spanning cells
    }

    // Set text style based on cell type
    setCellTextStyle(ctx, type) {
        let textColor = this.colors.cellText;
        let font = `${this.fontSize}px Arial`;

        switch (type) {
            case 'header':
                font = `bold ${this.fontSize}px Arial`;
                textColor = this.colors.headerText;
                break;
            case 'label':
                font = `bold ${this.fontSize}px Arial`;
                break;
            case 'formula':
                font = `italic ${this.fontSize}px Arial`;
                textColor = this.theme === 'dark' ? '#9bb3ff' : '#4169e1';
                break;
            case 'result':
                font = `bold ${this.fontSize}px Arial`;
                break;
            case 'positive':
                font = `bold ${this.fontSize}px Arial`;
                textColor = this.theme === 'dark' ? '#90ee90' : '#006400';
                break;
            case 'negative':
                font = `bold ${this.fontSize}px Arial`;
                textColor = this.theme === 'dark' ? '#ff6b6b' : '#dc143c';
                break;
            case 'title':
                font = `bold ${this.fontSize + 2}px Arial`;
                textColor = this.colors.headerText;
                break;
        }

        ctx.font = font;
        ctx.fillStyle = textColor;
    }

    // Method to render spreadsheet as canvas
    renderSpreadsheet(outputPath = null) {
        if (!this.currentSheet) {
            throw new Error('No spreadsheet data to render. Generate a spreadsheet first.');
        }

        // Dynamically calculate canvas dimensions, accounting for cell padding
        const numCols = this.currentSheet.cols;
        const numRows = this.currentSheet.rows;
        this.width = this.rowLabelWidth + (numCols * this.cellWidth) + this.padding * 2; // Padding on both sides
        this.height = this.headerHeight + 30 + (numRows * this.cellHeight) + this.formulaBarHeight + this.statsPanelHeight + this.padding * 2; // Padding top and bottom

        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');

        // Set up canvas with a safety check
        if (!this.colors || !this.colors.background) {
            console.error('Colors not properly initialized. Using default background.');
            ctx.fillStyle = '#ffffff'; // Fallback white background
        } else {
            this.setupCanvas(ctx);
        }

        // Draw spreadsheet
        this.drawSpreadsheet(ctx);

        // Save to file if path provided
        if (outputPath) {
            this.saveCanvas(canvas, outputPath);
        }

        return canvas;
    }

        // Setup canvas with background and basic styling
    setupCanvas(ctx) {
        // Fill background
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, this.width, this.height);

        // Set default font
        ctx.font = `${this.fontSize}px Arial`;
        ctx.textBaseline = 'middle';
    }


    // Draw the spreadsheet grid and data
    drawSpreadsheet(ctx) {
        if (!this.currentSheet) return;

        const data = this.currentSheet.data;
        const startX = this.rowLabelWidth;
        const startY = this.headerHeight + 30; // Account for title space

        // Draw title
        this.drawTitle(ctx);

        // Draw column headers (A, B, C, etc.)
        this.drawColumnHeaders(ctx, data[0].length);

        // Draw row headers (1, 2, 3, etc.)
        this.drawRowHeaders(ctx, data.length);

        // Draw grid and data
        this.drawGrid(ctx, data);
        this.drawData(ctx, data);

        // Draw formula bar
        this.drawFormulaBar(ctx);

        // Draw statistics panel
        this.drawStatistics(ctx);
    }

    // Draw spreadsheet title
    drawTitle(ctx) {
        ctx.font = `bold ${this.fontSize + 4}px Arial`;
        ctx.fillStyle = this.colors.headerText;
        ctx.textAlign = 'center';
        const title = `${this.currentSheet.description} - ${this.currentSheet.equation.toUpperCase()}`;
        ctx.fillText(title, this.width / 2, 15 + this.padding); // Adjusted for padding
        ctx.font = `${this.fontSize}px Arial`;
    }

    // Draw column headers (A, B, C, etc.)
    drawColumnHeaders(ctx, numCols) {
        ctx.fillStyle = this.colors.headerBg;
        ctx.fillRect(this.rowLabelWidth, 0, numCols * this.cellWidth, this.headerHeight);
        ctx.strokeStyle = this.colors.borderColor;
        ctx.strokeRect(this.rowLabelWidth, 0, numCols * this.cellWidth, this.headerHeight);

        ctx.fillStyle = this.colors.headerText;
        ctx.textAlign = 'center';

        for (let col = 0; col < numCols; col++) {
            const letter = String.fromCharCode(65 + col); // A, B, C, etc.
            const x = this.rowLabelWidth + col * this.cellWidth + this.cellWidth / 2;
            const y = this.headerHeight / 2;
            ctx.fillText(letter, x, y);

            // Draw column separator
            if (col > 0) {
                ctx.beginPath();
                ctx.moveTo(this.rowLabelWidth + col * this.cellWidth, 0);
                ctx.lineTo(this.rowLabelWidth + col * this.cellWidth, this.headerHeight);
                ctx.stroke();
            }
        }
    }

    // Draw row headers (1, 2, 3, etc.)
    drawRowHeaders(ctx, numRows) {
        const startY = this.headerHeight + 30; // Account for title space
        ctx.fillStyle = this.colors.headerBg;
        ctx.fillRect(0, startY, this.rowLabelWidth, numRows * this.cellHeight);
        ctx.strokeStyle = this.colors.borderColor;
        ctx.strokeRect(0, startY, this.rowLabelWidth, numRows * this.cellHeight);

        ctx.fillStyle = this.colors.headerText;
        ctx.textAlign = 'center';

        for (let row = 0; row < numRows; row++) {
            const rowNumber = row + 1;
            const x = this.rowLabelWidth / 2;
            const y = startY + row * this.cellHeight + this.cellHeight / 2;
            ctx.fillText(rowNumber.toString(), x, y);

            // Draw row separator
            if (row > 0) {
                ctx.beginPath();
                ctx.moveTo(0, startY + row * this.cellHeight);
                ctx.lineTo(this.rowLabelWidth, startY + row * this.cellHeight);
                ctx.stroke();
            }
        }
    }

    // Draw the grid lines
    drawGrid(ctx, data) {
        const startX = this.rowLabelWidth;
        const startY = this.headerHeight + 30;
        const gridWidth = data[0].length * this.cellWidth;
        const gridHeight = data.length * this.cellHeight;
        ctx.strokeStyle = this.colors.gridColor;
        ctx.lineWidth = 1;

        // Draw vertical lines
        for (let col = 0; col <= data[0].length; col++) {
            const x = startX + col * this.cellWidth;
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY + gridHeight);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let row = 0; row <= data.length; row++) {
            const y = startY + row * this.cellHeight;
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(startX + gridWidth, y);
            ctx.stroke();
        }
   }

    



// Draw the data in cells
    drawData(ctx, data) {
        const startX = this.rowLabelWidth;
        const startY = this.headerHeight + 30;
        ctx.textAlign = 'left';

        for (let row = 0; row < data.length; row++) {
            for (let col = 0; col < data[row].length; col++) {
                const cellData = data[row][col];
                const x = startX + col * this.cellWidth + this.cellPadding + 5; // Adjusted x with padding
                const y = startY + row * this.cellHeight + this.cellHeight / 2; // Center vertically, adjusted with padding

                // Get cell value and type
                let value, type;
                if (typeof cellData === 'object' && cellData !== null) {
                    value = cellData.value || '';
                    type = cellData.type || 'data';
                } else {
                    value = cellData || '';
                    type = 'data';
                }

                // Handle cell spanning
                if (typeof cellData === 'object' && cellData.span) {
                    const spanWidth = cellData.span * this.cellWidth;
                    ctx.fillStyle = this.setCellBackground(ctx, startX + col * this.cellWidth, startY + row * this.cellHeight, type, cellData.span);
                    ctx.fillRect(startX + col * this.cellWidth, startY + row * this.cellHeight, spanWidth, this.cellHeight);
                    col += cellData.span - 1; // Skip spanned columns
                } else {
                    this.setCellBackground(ctx, startX + col * this.cellWidth, startY + row * this.cellHeight, type);
                }

                // Set text style based on type
                this.setCellTextStyle(ctx, type);

                // Draw cell value with padding consideration
                if (value !== '') {
                    const maxWidth = this.cellWidth - (this.cellPadding * 2) - 10; // Adjust max width for padding
                    const truncatedText = this.truncateText(ctx, value.toString(), maxWidth);
                    ctx.fillText(truncatedText, x, y);
                }
            }
        }
    }
    // Draw formula bar
    drawFormulaBar(ctx) {
        const barHeight = this.formulaBarHeight;
        const barY = this.headerHeight + 30 + this.currentSheet.rows * this.cellHeight + this.padding;

        ctx.fillStyle = this.colors.formulaBar;
        ctx.fillRect(0, barY, this.width, barHeight);
        ctx.strokeStyle = this.colors.borderColor;
        ctx.strokeRect(0, barY, this.width, barHeight);

        ctx.fillStyle = this.colors.cellText;
        ctx.font = `bold ${this.fontSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText('Formula:', this.padding, barY + barHeight / 2);

        const equationText = `${this.currentSheet.equation.toUpperCase()} - ${this.currentSheet.description}`;
        ctx.font = `${this.fontSize}px Arial`;
        ctx.fillText(equationText, 80, barY + barHeight / 2);
    }

    // Draw statistics panel
    drawStatistics(ctx) {
        const panelY = this.headerHeight + 30 + this.currentSheet.rows * this.cellHeight + this.formulaBarHeight + this.padding * 2;
        const panelHeight = this.statsPanelHeight;

        ctx.fillStyle = this.colors.formulaBar;
        ctx.fillRect(0, panelY, this.width, panelHeight);
        ctx.strokeStyle = this.colors.borderColor;
        ctx.strokeRect(0, panelY, this.width, panelHeight);

        ctx.fillStyle = this.colors.cellText;
        ctx.font = `bold ${this.fontSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText('Analysis Summary:', this.padding, panelY + 20);
        ctx.font = `${this.fontSize - 1}px Arial`;

        const stats = this.generateStatistics();
        let yOffset = 35;
        stats.forEach(stat => {
            ctx.fillText(stat, this.padding, panelY + yOffset);
            yOffset += 15;
        });
    }
    // Generate statistics for current sheet
    // Generate statistics for current sheet
generateStatistics() {
    const stats = [];
    const params = this.currentSheet.parameters;

    switch (this.currentSheet.equation) {
        case 'linearfunction':
            stats.push(`Equation: y = ${params.m}x + ${params.b}`);
            stats.push(`Slope: ${params.m} (${this.describeSlopeType(params.m)})`);
            stats.push(`Y-Intercept: ${params.b}`);
            stats.push(`X-Intercept: ${params.m !== 0 ? (-params.b / params.m).toFixed(4) : 'No x-intercept'}`);
            // Add sample points
            const linearPoints = this.getLinearSamplePoints(`y = ${params.m}x + ${params.b}`, [-2, 2], 5);
            stats.push(`Sample Points: ${linearPoints.map(p => `(${p.x}, ${p.y})`).join(', ')}`);
            break;
        case 'customlinear':
            const parsedLinear = this.parseLinearEquation(params.equation);
            stats.push(`Original Equation: ${params.equation}`);
            stats.push(`Standard Form: y = ${parsedLinear.m}x + ${parsedLinear.b}`);
            stats.push(`Slope: ${parsedLinear.m} (${this.describeSlopeType(parsedLinear.m)})`);
            stats.push(`Y-Intercept: ${parsedLinear.b}`);
            stats.push(`X-Intercept: ${parsedLinear.m !== 0 ? (-parsedLinear.b / parsedLinear.m).toFixed(4) : 'No x-intercept'}`);
            // Add sample points
            const customLinearPoints = this.getLinearSamplePoints(params.equation, [-2, 2], 5);
            stats.push(`Sample Points: ${customLinearPoints.map(p => `(${p.x}, ${p.y})`).join(', ')}`);
            break;
        case 'quadraticformula':
            const discriminant = params.b * params.b - 4 * params.a * params.c;
            stats.push(`Equation: ${params.a}x² + ${params.b}x + ${params.c} = 0`);
            stats.push(`Discriminant: ${discriminant} (${discriminant >= 0 ? 'Real solutions' : 'Complex solutions'})`);
            break;
        case 'compoundinterest':
            const finalAmount = this.calculateCompoundInterest(params.P, params.r, params.n, params.t);
            stats.push(`Principal: $${params.P.toLocaleString()}, Rate: ${(params.r * 100).toFixed(2)}%`);
            stats.push(`Final Amount: $${finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
            break;
        case 'bet_analysis':
        case 'custom_betting':
            const metrics = this.calculateBettingMetrics(params);
            stats.push(`Bet: $${params.betAmount}, Odds: ${params.odds} (${params.oddsFormat})`);
            stats.push(`Win Probability: ${(params.winProbability * 100).toFixed(2)}%`);
            stats.push(`Expected Value: $${metrics.expectedValue.toFixed(2)} (${metrics.expectedValue > 0 ? 'Positive' : metrics.expectedValue < 0 ? 'Negative' : 'Neutral'})`);
            stats.push(`Edge: ${(metrics.edge * 100).toFixed(2)}%`);
            stats.push(`Kelly Criterion: ${(metrics.kellyFraction * 100).toFixed(2)}% of bankroll`);
            stats.push(`Bet Size: ${metrics.betPercentage.toFixed(2)}% of bankroll`);
            stats.push(`Implied Probability: ${(metrics.impliedProbability * 100).toFixed(2)}%`);
            stats.push(`Standard Deviation: $${metrics.standardDeviation.toFixed(2)}`);
            break;
    }

    stats.push(`Generated: ${new Date(this.currentSheet.generated).toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' })}`);
    return stats;
}
    // Save canvas to file
    saveCanvas(canvas, outputPath) {
        const buffer = canvas.toBuffer('image/png');
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, buffer);
        console.log(`Spreadsheet saved to: ${outputPath}`);
    }


  // Truncate text to fit in cell
    truncateText(ctx, text, maxWidth) {
        if (ctx.measureText(text).width <= maxWidth) {
            return text;
        }

        let truncated = text;
        while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
            truncated = truncated.slice(0, -1);
        }
        return truncated + '...';
    }




    // Export spreadsheet data to XLSX
    exportToXLSX(outputPath = null) {
        if (!this.currentSheet) {
            throw new Error('No spreadsheet data to export. Generate a spreadsheet first.');
        }

        const data = this.currentSheet.data;
        // Prepare worksheet data
        const wsData = [];

        // Add header with metadata
        wsData.push(['# ' + this.currentSheet.description]);
        wsData.push(['# Generated: ' + new Date(this.currentSheet.generated).toLocaleString()]);
        wsData.push([]); // Empty row

        // Add data rows
        data.forEach(row => {
            const wsRow = row.map(cell => {
                let value;
                if (typeof cell === 'object' && cell !== null) {
                    value = cell.value || '';
                } else {
                    value = cell || '';
                }
                return value.toString();
            });
            wsData.push(wsRow);
        });

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, this.currentSheet.equation);

        // Add metadata sheet
        const metadata = [
            ['Equation', this.currentSheet.equation],
            ['Description', this.currentSheet.description],
            ['Type', this.currentSheet.type],
            ['Generated', this.currentSheet.generated],
            ['Rows', this.currentSheet.rows],
            ['Columns', this.currentSheet.cols],
            ['Parameters', JSON.stringify(this.currentSheet.parameters)],
            ['ExportedAt', new Date().toISOString()],
            ['Version', '1.0']
        ];
        const metaWs = XLSX.utils.aoa_to_sheet(metadata);
        XLSX.utils.book_append_sheet(wb, metaWs, 'Metadata');

        // Write to file if outputPath provided
        if (outputPath) {
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            XLSX.writeFile(wb, outputPath);
            console.log(`Spreadsheet exported to XLSX: ${outputPath}`);
        }

        // Return workbook object
        return wb;
    }

    // Export spreadsheet data to CSV
    exportToCSV(outputPath = null) {
        if (!this.currentSheet) {
            throw new Error('No spreadsheet data to export. Generate a spreadsheet first.');
        }

        const data = this.currentSheet.data;
        const csvLines = [];

        // Add header with metadata
        csvLines.push(`# ${this.currentSheet.description}`);
        csvLines.push(`# Generated: ${new Date(this.currentSheet.generated).toLocaleString()}`);
        csvLines.push('');

        // Add data rows
        data.forEach(row => {
            const csvRow = row.map(cell => {
                let value;
                if (typeof cell === 'object' && cell !== null) {
                    value = cell.value || '';
                } else {
                    value = cell || '';
                }
                // Escape commas and quotes
                if (value.toString().includes(',') || value.toString().includes('"')) {
                    return `"${value.toString().replace(/"/g, '""')}"`;
                }
                return value.toString();
            });
            csvLines.push(csvRow.join(','));
        });

        const csvContent = csvLines.join('\n');

        if (outputPath) {
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(outputPath, csvContent);
            console.log(`Spreadsheet exported to CSV: ${outputPath}`);
        }

        return csvContent;
    }




    // Enhanced method to analyze any linear equation string
    analyzeLinearEquation(equationString) {
        try {
            const parsed = this.parseLinearEquation(equationString);
            return {
                originalEquation: equationString,
                standardForm: `y = ${parsed.m}x + ${parsed.b}`,
                slope: parsed.m,
                yIntercept: parsed.b,
                xIntercept: parsed.m !== 0 ? -parsed.b / parsed.m : null,
                slopeType: this.describeSlopeType(parsed.m),
                isValid: true,
                analysis: {
                    domain: '(-∞, ∞)',
                    range: '(-∞, ∞)',
                    increasing: parsed.m > 0,
                    decreasing: parsed.m < 0,
                    horizontal: parsed.m === 0
                }
            };
        } catch (error) {
            return {
                originalEquation: equationString,
                isValid: false,
                error: error.message
            };
        }
    }

    // Method to get sample points for any linear equation
    getLinearSamplePoints(equationString, xRange = [-5, 5], numPoints = 11) {
        try {
            const parsed = this.parseLinearEquation(equationString);
            const xValues = [];
            const step = (xRange[1] - xRange[0]) / (numPoints - 1);

            for (let i = 0; i < numPoints; i++) {
                xValues.push(xRange[0] + i * step);
            }

            return xValues.map(x => ({
                x: parseFloat(x.toFixed(2)),
                y: parseFloat((parsed.m * x + parsed.b).toFixed(2))
            }));
        } catch (error) {
            throw new Error(`Cannot generate sample points: ${error.message}`);
        }
    }

    // Enhanced method to analyze any quadratic equation string
    analyzeQuadraticEquation(equationString) {
    try {
        const parsed = this.parseQuadraticEquation(equationString);
        const vertex = this.calculateVertex(parsed.a, parsed.b, parsed.c);
        const discriminant = parsed.b * parsed.b - 4 * parsed.a * parsed.c;
        const roots = this.calculateQuadraticRoots(parsed.a, parsed.b, parsed.c);

        return {
            originalEquation: equationString,
            standardForm: `y = ${parsed.a}x² + ${parsed.b}x + ${parsed.c}`,
            coefficients: {
                a: parsed.a,
                b: parsed.b,
                c: parsed.c
            },
            vertex: {
                x: parseFloat(vertex.x.toFixed(4)),
                y: parseFloat(vertex.y.toFixed(4))
            },
            axisOfSymmetry: parseFloat(vertex.x.toFixed(4)),
            discriminant: discriminant,
            roots: roots,
            yIntercept: parsed.c,
            opensUpward: parsed.a > 0,
            opensDownward: parsed.a < 0,
            isValid: true,
            analysis: {
                domain: '(-∞, ∞)',
                range: parsed.a > 0 ? `[${vertex.y.toFixed(4)}, ∞)` : `(-∞, ${vertex.y.toFixed(4)}]`,
                hasMinimum: parsed.a > 0,
                hasMaximum: parsed.a < 0,
                extremeValue: vertex.y,
                rootType: this.describeRootType(discriminant),
                numberOfRealRoots: discriminant > 0 ? 2 : discriminant === 0 ? 1 : 0,
                concavity: parsed.a > 0 ? 'Concave up' : 'Concave down'
            }
        };
    } catch (error) {
        return {
            originalEquation: equationString,
            isValid: false,
            error: error.message
        };
    }
}

// Enhanced method to calculate both quadratic roots with detailed information
calculateQuadraticRoots(a, b, c) {
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        // Complex roots
        const realPart = -b / (2 * a);
        const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
        return {
            type: 'complex',
            root1: {
                real: parseFloat(realPart.toFixed(4)),
                imaginary: parseFloat(imaginaryPart.toFixed(4)),
                display: `${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i`
            },
            root2: {
                real: parseFloat(realPart.toFixed(4)),
                imaginary: parseFloat((-imaginaryPart).toFixed(4)),
                display: `${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`
            },
            discriminant: discriminant
        };
    } else if (discriminant === 0) {
        // One repeated real root
        const root = -b / (2 * a);
        return {
            type: 'repeated',
            root1: parseFloat(root.toFixed(4)),
            root2: parseFloat(root.toFixed(4)),
            display: `x = ${root.toFixed(4)} (repeated)`,
            discriminant: discriminant
        };
    } else {
        // Two distinct real roots
        const sqrtDiscriminant = Math.sqrt(discriminant);
        const root1 = (-b + sqrtDiscriminant) / (2 * a);
        const root2 = (-b - sqrtDiscriminant) / (2 * a);
        return {
            type: 'real',
            root1: parseFloat(root1.toFixed(4)),
            root2: parseFloat(root2.toFixed(4)),
            smaller: Math.min(root1, root2),
            larger: Math.max(root1, root2),
            discriminant: discriminant
        };
    }
}

// Method to get sample points for any quadratic equation
getQuadraticSamplePoints(equationString, xRange = [-5, 5], numPoints = 11) {
    try {
        const parsed = this.parseQuadraticEquation(equationString);
        const xValues = [];
        const step = (xRange[1] - xRange[0]) / (numPoints - 1);

        for (let i = 0; i < numPoints; i++) {
            xValues.push(xRange[0] + i * step);
        }

        return xValues.map(x => ({
            x: parseFloat(x.toFixed(2)),
            y: parseFloat((parsed.a * x * x + parsed.b * x + parsed.c).toFixed(2))
        }));
    } catch (error) {
        throw new Error(`Cannot generate sample points: ${error.message}`);
    }
}

// Method to get detailed vertex analysis
getVertexAnalysis(equationString) {
    try {
        const parsed = this.parseQuadraticEquation(equationString);
        const vertex = this.calculateVertex(parsed.a, parsed.b, parsed.c);

        return {
            vertex: {
                x: parseFloat(vertex.x.toFixed(4)),
                y: parseFloat(vertex.y.toFixed(4))
            },
            axisOfSymmetry: `x = ${vertex.x.toFixed(4)}`,
            isMinimum: parsed.a > 0,
            isMaximum: parsed.a < 0,
            extremeType: parsed.a > 0 ? 'Minimum' : 'Maximum',
            extremeValue: parseFloat(vertex.y.toFixed(4)),
            calculation: {
                formula: 'x = -b/(2a)',
                substitution: `x = -(${parsed.b})/(2×${parsed.a}) = ${vertex.x.toFixed(4)}`,
                yCalculation: `y = ${parsed.a}(${vertex.x.toFixed(4)})² + ${parsed.b}(${vertex.x.toFixed(4)}) + ${parsed.c} = ${vertex.y.toFixed(4)}`
            }
        };
    } catch (error) {
        throw new Error(`Cannot analyze vertex: ${error.message}`);
    }
}

// Method to analyze quadratic transformations
analyzeQuadraticTransformations(equationString, baseFunction = 'y = x²') {
    try {
        const parsed = this.parseQuadraticEquation(equationString);
        const baseParsed = this.parseQuadraticEquation(baseFunction);

        const vertex = this.calculateVertex(parsed.a, parsed.b, parsed.c);
        const baseVertex = this.calculateVertex(baseParsed.a, baseParsed.b, baseParsed.c);

        return {
            originalFunction: baseFunction,
            transformedFunction: equationString,
            transformations: {
                verticalStretch: parsed.a !== baseParsed.a ? Math.abs(parsed.a / baseParsed.a) : null,
                verticalShrink: Math.abs(parsed.a) < Math.abs(baseParsed.a) ? Math.abs(parsed.a / baseParsed.a) : null,
                reflection: (parsed.a * baseParsed.a) < 0,
                horizontalShift: vertex.x - baseVertex.x,
                verticalShift: vertex.y - baseVertex.y
            },
            description: this.describeTransformations(parsed.a, baseParsed.a, vertex, baseVertex)
        };
    } catch (error) {
        throw new Error(`Cannot analyze transformations: ${error.message}`);
    }
}

// Helper method to describe transformations in words
describeTransformations(a, baseA, vertex, baseVertex) {
    const descriptions = [];

    // Vertical stretch/shrink and reflection
    if (Math.abs(a) > Math.abs(baseA)) {
        descriptions.push(`Vertical stretch by factor of ${Math.abs(a / baseA)}`);
    } else if (Math.abs(a) < Math.abs(baseA)) {
        descriptions.push(`Vertical shrink by factor of ${Math.abs(a / baseA)}`);
    }

    if ((a * baseA) < 0) {
        descriptions.push('Reflection over x-axis');
    }

    // Horizontal shift
    const hShift = vertex.x - baseVertex.x;
    if (hShift > 0) {
        descriptions.push(`Horizontal shift right by ${hShift} units`);
    } else if (hShift < 0) {
        descriptions.push(`Horizontal shift left by ${Math.abs(hShift)} units`);
    }

    // Vertical shift
    const vShift = vertex.y - baseVertex.y;
    if (vShift > 0) {
        descriptions.push(`Vertical shift up by ${vShift} units`);
    } else if (vShift < 0) {
        descriptions.push(`Vertical shift down by ${Math.abs(vShift)} units`);
    }

    return descriptions.length > 0 ? descriptions : ['No transformations applied'];
}

// Method to find x-intercepts (roots) with detailed steps
findQuadraticIntercepts(equationString) {
    try {
        const parsed = this.parseQuadraticEquation(equationString);
        const roots = this.calculateQuadraticRoots(parsed.a, parsed.b, parsed.c);

        return {
            yIntercept: {
                point: [0, parsed.c],
                value: parsed.c,
                calculation: `When x = 0: y = ${parsed.c}`
            },
            xIntercepts: this.formatInterceptResults(roots, parsed),
            interceptAnalysis: {
                numberOfXIntercepts: roots.discriminant > 0 ? 2 : roots.discriminant === 0 ? 1 : 0,
                discriminant: roots.discriminant,
                rootType: this.describeRootType(roots.discriminant)
            }
        };
    } catch (error) {
        throw new Error(`Cannot find intercepts: ${error.message}`);
    }
}

// Helper method to format intercept results
formatInterceptResults(roots, parsed) {
    if (roots.type === 'real') {
        return {
            point1: [roots.root1, 0],
            point2: [roots.root2, 0],
            values: [roots.root1, roots.root2],
            calculation: [
                `x₁ = (-${parsed.b} + √${roots.discriminant})/(2×${parsed.a}) = ${roots.root1}`,
                `x₂ = (-${parsed.b} - √${roots.discriminant})/(2×${parsed.a}) = ${roots.root2}`
            ]
        };
    } else if (roots.type === 'repeated') {
        return {
            point: [roots.root1, 0],
            value: roots.root1,
            calculation: `x = -${parsed.b}/(2×${parsed.a}) = ${roots.root1} (repeated root)`
        };
    } else {
        return {
            type: 'complex',
            message: 'No real x-intercepts (roots are complex)',
            complexRoots: [roots.root1.display, roots.root2.display]
        };
    }
}

// Method to evaluate quadratic function at specific points
evaluateQuadraticAt(equationString, xValues) {
    try {
        const parsed = this.parseQuadraticEquation(equationString);

        if (!Array.isArray(xValues)) {
            xValues = [xValues];
        }

        return xValues.map(x => {
            const y = parsed.a * x * x + parsed.b * x + parsed.c;
            return {
                x: x,
                y: parseFloat(y.toFixed(4)),
                calculation: `y = ${parsed.a}(${x})² + ${parsed.b}(${x}) + ${parsed.c} = ${y.toFixed(4)}`
            };
        });
    } catch (error) {
        throw new Error(`Cannot evaluate quadratic: ${error.message}`);
    }
}

// Method to compare two quadratic functions
compareQuadratics(equation1, equation2) {
    try {
        const analysis1 = this.analyzeQuadraticEquation(equation1);
        const analysis2 = this.analyzeQuadraticEquation(equation2);

        if (!analysis1.isValid || !analysis2.isValid) {
            throw new Error('One or both equations are invalid');
        }

        return {
            equation1: analysis1,
            equation2: analysis2,
            comparison: {
                sameOpening: (analysis1.opensUpward && analysis2.opensUpward) || (analysis1.opensDownward && analysis2.opensDownward),
                vertexComparison: {
                    equation1Higher: analysis1.vertex.y > analysis2.vertex.y,
                    equation2Higher: analysis2.vertex.y > analysis1.vertex.y,
                    sameHeight: Math.abs(analysis1.vertex.y - analysis2.vertex.y) < 0.0001
                },
                widthComparison: {
                    equation1Narrower: Math.abs(analysis1.coefficients.a) > Math.abs(analysis2.coefficients.a),
                    equation2Narrower: Math.abs(analysis2.coefficients.a) > Math.abs(analysis1.coefficients.a),
                    sameWidth: Math.abs(analysis1.coefficients.a - analysis2.coefficients.a) < 0.0001
                },
                intersectionPoints: this.findQuadraticIntersections(equation1, equation2)
            }
        };
    } catch (error) {
        throw new Error(`Cannot compare quadratics: ${error.message}`);
    }
}

// Method to find intersection points between two quadratic functions
findQuadraticIntersections(equation1, equation2) {
    try {
        const parsed1 = this.parseQuadraticEquation(equation1);
        const parsed2 = this.parseQuadraticEquation(equation2);

        // Find intersection by setting equations equal: a₁x² + b₁x + c₁ = a₂x² + b₂x + c₂
        // Rearrange to: (a₁-a₂)x² + (b₁-b₂)x + (c₁-c₂) = 0
        const a = parsed1.a - parsed2.a;
        const b = parsed1.b - parsed2.b;
        const c = parsed1.c - parsed2.c;

        if (a === 0 && b === 0 && c === 0) {
            return { type: 'identical', message: 'The equations are identical' };
        } else if (a === 0 && b === 0) {
            return { type: 'none', message: 'Parallel parabolas - no intersection points' };
        } else if (a === 0) {
            // Linear case
            const x = -c / b;
            const y = parsed1.a * x * x + parsed1.b * x + parsed1.c;
            return {
                type: 'single',
                point: [parseFloat(x.toFixed(4)), parseFloat(y.toFixed(4))]
            };
        } else {
            // Quadratic case
            const roots = this.calculateQuadraticRoots(a, b, c);
            if (roots.type === 'real') {
                const y1 = parsed1.a * roots.root1 * roots.root1 + parsed1.b * roots.root1 + parsed1.c;
                const y2 = parsed1.a * roots.root2 * roots.root2 + parsed1.b * roots.root2 + parsed1.c;
                return {
                    type: 'two',
                    points: [
                        [roots.root1, parseFloat(y1.toFixed(4))],
                        [roots.root2, parseFloat(y2.toFixed(4))]
                    ]
                };
            } else if (roots.type === 'repeated') {
                const y = parsed1.a * roots.root1 * roots.root1 + parsed1.b * roots.root1 + parsed1.c;
                return {
                    type: 'tangent',
                    point: [roots.root1, parseFloat(y.toFixed(4))],
                    message: 'Parabolas are tangent at this point'
                };
            } else {
                return { type: 'none', message: 'No real intersection points' };
            }
        }
    } catch (error) {
        throw new Error(`Cannot find intersections: ${error.message}`);
    }
}

// Method for full betting analysis
analyzeBettingEquation(equationString) {
    try {
        const parsed = this.parseCustomEquation(equationString, {});
        const params = parsed.parameters;
        const sheet = parsed.template.template(equationString, params);  // Generate spreadsheet

        // Additional analyses
        const simulation = this.simulateBetting(params);
        const risk = this.generateRiskAssessment(params);

        return {
            sheet,  // The 2D array for spreadsheet
            simulation,
            risk,
            convertedOdds: {
                decimal: this.convertOdds(params.odds, params.oddsFormat, 'decimal'),
                american: this.convertOdds(params.odds, params.oddsFormat, 'american'),
                fractional: this.convertOdds(params.odds, params.oddsFormat, 'fractional')
            },
            breakEvenProb: this.calculateBreakEvenProbability(params.odds, params.oddsFormat),
            kelly: this.calculateKellyCriterion(params.winProbability, params.odds, params.oddsFormat)
        };
    } catch (error) {
        return { isValid: false, error: error.message };
    }
  }

}
