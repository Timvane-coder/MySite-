import { createCanvas } from '@napi-rs/canvas';
import * as math from 'mathjs';
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

// Financial Functions Library
class FinancialFunctions {
    // Time Value of Money Functions
    static presentValue(fv, rate, periods, pmt = 0, type = 0) {
        if (rate === 0) {
            return fv + (pmt * periods);
        }
        
        const pvFactor = Math.pow(1 + rate, periods);
        const pv = fv / pvFactor;
        
        if (pmt !== 0) {
            const pmtPV = pmt * ((1 - Math.pow(1 + rate, -periods)) / rate);
            const adjustment = type === 1 ? (1 + rate) : 1;
            return pv + (pmtPV * adjustment);
        }
        
        return pv;
    }

    static futureValue(pv, rate, periods, pmt = 0, type = 0) {
        if (rate === 0) {
            return pv + (pmt * periods);
        }
        
        const fvFactor = Math.pow(1 + rate, periods);
        const fv = pv * fvFactor;
        
        if (pmt !== 0) {
            const pmtFV = pmt * ((fvFactor - 1) / rate);
            const adjustment = type === 1 ? (1 + rate) : 1;
            return fv + (pmtFV * adjustment);
        }
        
        return fv;
    }

    static compoundInterest(principal, rate, periods, compoundingFrequency = 1) {
        const adjustedRate = rate / compoundingFrequency;
        const adjustedPeriods = periods * compoundingFrequency;
        return principal * Math.pow(1 + adjustedRate, adjustedPeriods);
    }

    static effectiveInterestRate(nominalRate, compoundingFrequency) {
        return Math.pow(1 + (nominalRate / compoundingFrequency), compoundingFrequency) - 1;
    }

    // NPV and IRR Functions
    static netPresentValue(rate, cashFlows) {
        return cashFlows.reduce((npv, cf, period) => {
            return npv + (cf / Math.pow(1 + rate, period));
        }, 0);
    }

    static internalRateOfReturn(cashFlows, guess = 0.1, maxIterations = 100, tolerance = 1e-10) {
        let rate = guess;
        
        for (let i = 0; i < maxIterations; i++) {
            const npv = this.netPresentValue(rate, cashFlows);
            const npvDerivative = this.calculateNPVDerivative(rate, cashFlows);
            
            if (Math.abs(npv) < tolerance) {
                return rate;
            }
            
            if (Math.abs(npvDerivative) < tolerance) {
                throw new Error('IRR calculation failed - derivative too small');
            }
            
            const newRate = rate - (npv / npvDerivative);
            
            if (Math.abs(newRate - rate) < tolerance) {
                return newRate;
            }
            
            rate = newRate;
        }
        
        throw new Error('IRR calculation failed to converge');
    }

    static calculateNPVDerivative(rate, cashFlows) {
        return cashFlows.reduce((derivative, cf, period) => {
            if (period === 0) return derivative;
            return derivative - (period * cf / Math.pow(1 + rate, period + 1));
        }, 0);
    }

    // Payback Period Functions
    static paybackPeriod(initialInvestment, cashFlows) {
        let cumulativeCashFlow = -Math.abs(initialInvestment);
        
        for (let period = 0; period < cashFlows.length; period++) {
            cumulativeCashFlow += cashFlows[period];
            if (cumulativeCashFlow >= 0) {
                const previousCumulative = cumulativeCashFlow - cashFlows[period];
                const fractionOfYear = Math.abs(previousCumulative) / cashFlows[period];
                return period + fractionOfYear;
            }
        }
        
        return null; // Investment never pays back
    }

    static discountedPaybackPeriod(initialInvestment, cashFlows, discountRate) {
        let cumulativeDiscountedCashFlow = -Math.abs(initialInvestment);
        
        for (let period = 0; period < cashFlows.length; period++) {
            const discountedCF = cashFlows[period] / Math.pow(1 + discountRate, period + 1);
            cumulativeDiscountedCashFlow += discountedCF;
            
            if (cumulativeDiscountedCashFlow >= 0) {
                const previousCumulative = cumulativeDiscountedCashFlow - discountedCF;
                const fractionOfYear = Math.abs(previousCumulative) / discountedCF;
                return period + 1 + fractionOfYear;
            }
        }
        
        return null; // Investment never pays back
    }

    // Financial Ratios
    static currentRatio(currentAssets, currentLiabilities) {
        if (currentLiabilities === 0) throw new Error('Current liabilities cannot be zero');
        return currentAssets / currentLiabilities;
    }

    static quickRatio(quickAssets, currentLiabilities) {
        if (currentLiabilities === 0) throw new Error('Current liabilities cannot be zero');
        return quickAssets / currentLiabilities;
    }

    static debtToEquityRatio(totalDebt, totalEquity) {
        if (totalEquity === 0) throw new Error('Total equity cannot be zero');
        return totalDebt / totalEquity;
    }

    static returnOnEquity(netIncome, averageEquity) {
        if (averageEquity === 0) throw new Error('Average equity cannot be zero');
        return netIncome / averageEquity;
    }

    static returnOnAssets(netIncome, averageAssets) {
        if (averageAssets === 0) throw new Error('Average assets cannot be zero');
        return netIncome / averageAssets;
    }

    static grossProfitMargin(grossProfit, revenue) {
        if (revenue === 0) throw new Error('Revenue cannot be zero');
        return grossProfit / revenue;
    }

    static operatingMargin(operatingIncome, revenue) {
        if (revenue === 0) throw new Error('Revenue cannot be zero');
        return operatingIncome / revenue;
    }

    static netProfitMargin(netIncome, revenue) {
        if (revenue === 0) throw new Error('Revenue cannot be zero');
        return netIncome / revenue;
    }

    static earningsPerShare(netIncome, weightedAverageShares) {
        if (weightedAverageShares === 0) throw new Error('Weighted average shares cannot be zero');
        return netIncome / weightedAverageShares;
    }

    static priceToEarningsRatio(marketPrice, earningsPerShare) {
        if (earningsPerShare === 0) throw new Error('Earnings per share cannot be zero');
        return marketPrice / earningsPerShare;
    }

    static workingCapital(currentAssets, currentLiabilities) {
        return currentAssets - currentLiabilities;
    }

    // Break-Even Analysis
    static breakEvenUnits(fixedCosts, pricePerUnit, variableCostPerUnit) {
        const contributionMargin = pricePerUnit - variableCostPerUnit;
        if (contributionMargin <= 0) throw new Error('Contribution margin must be positive');
        return fixedCosts / contributionMargin;
    }

    static breakEvenRevenue(fixedCosts, contributionMarginRatio) {
        if (contributionMarginRatio <= 0) throw new Error('Contribution margin ratio must be positive');
        return fixedCosts / contributionMarginRatio;
    }

    // Valuation Models
    static dividendDiscountModel(dividend, growthRate, requiredReturn) {
        if (requiredReturn <= growthRate) {
            throw new Error('Required return must be greater than growth rate');
        }
        return dividend / (requiredReturn - growthRate);
    }

    static economicValueAdded(nopat, wacc, investedCapital) {
        return nopat - (wacc * investedCapital);
    }

    // Amortization
    static calculateAmortizationSchedule(principal, rate, periods) {
        const payment = this.calculatePayment(principal, rate, periods);
        const schedule = [];
        let balance = principal;

        for (let period = 1; period <= periods; period++) {
            const interestPayment = balance * rate;
            const principalPayment = payment - interestPayment;
            balance -= principalPayment;

            schedule.push({
                period,
                payment: payment,
                principalPayment: principalPayment,
                interestPayment: interestPayment,
                remainingBalance: Math.max(0, balance)
            });
        }

        return schedule;
    }

    static calculatePayment(principal, rate, periods) {
        if (rate === 0) return principal / periods;
        return principal * (rate * Math.pow(1 + rate, periods)) / (Math.pow(1 + rate, periods) - 1);
    }

    // Cash Conversion Cycle
    static cashConversionCycle(daysInventoryOutstanding, daysReceivablesOutstanding, daysPayablesOutstanding) {
        return daysInventoryOutstanding + daysReceivablesOutstanding - daysPayablesOutstanding;
    }
}

// Formula Registry
class FormulaRegistry {
    static formulas = {
        'presentValue': {
            name: 'Present Value (PV)',
            category: 'Time Value of Money',
            params: ['futureValue', 'interestRate', 'periods', 'payment', 'type'],
            paramNames: ['Future Value', 'Interest Rate', 'Number of Periods', 'Payment (optional)', 'Type (0=end, 1=beginning)'],
            defaultParams: [1000, 0.05, 10, 0, 0],
            calculate: (params) => FinancialFunctions.presentValue(params[0], params[1], params[2], params[3], params[4]),
            description: 'Calculates the present value of a future amount or annuity',
            useCases: ['Investment valuation', 'Bond pricing', 'Loan calculations']
        },
        'futureValue': {
            name: 'Future Value (FV)',
            category: 'Time Value of Money',
            params: ['presentValue', 'interestRate', 'periods', 'payment', 'type'],
            paramNames: ['Present Value', 'Interest Rate', 'Number of Periods', 'Payment (optional)', 'Type (0=end, 1=beginning)'],
            defaultParams: [1000, 0.05, 10, 0, 0],
            calculate: (params) => FinancialFunctions.futureValue(params[0], params[1], params[2], params[3], params[4]),
            description: 'Calculates the future value of a present amount or annuity',
            useCases: ['Retirement planning', 'Investment growth', 'Savings projections']
        },
        'compoundInterest': {
            name: 'Compound Interest',
            category: 'Time Value of Money',
            params: ['principal', 'interestRate', 'periods', 'compoundingFrequency'],
            paramNames: ['Principal', 'Annual Interest Rate', 'Number of Years', 'Compounding Frequency'],
            defaultParams: [1000, 0.05, 10, 12],
            calculate: (params) => FinancialFunctions.compoundInterest(params[0], params[1], params[2], params[3]),
            description: 'Calculates compound interest with various compounding frequencies',
            useCases: ['Savings accounts', 'Certificate of deposits', 'Investment growth']
        },
        'effectiveInterestRate': {
            name: 'Effective Interest Rate (EIR)',
            category: 'Time Value of Money',
            params: ['nominalRate', 'compoundingFrequency'],
            paramNames: ['Nominal Interest Rate', 'Compounding Frequency'],
            defaultParams: [0.05, 12],
            calculate: (params) => FinancialFunctions.effectiveInterestRate(params[0], params[1]),
            description: 'Converts nominal rate to effective annual rate',
            useCases: ['Comparing loans', 'Investment analysis', 'Financial planning']
        },
        'netPresentValue': {
            name: 'Net Present Value (NPV)',
            category: 'Investment Analysis',
            params: ['discountRate', 'cashFlows'],
            paramNames: ['Discount Rate', 'Cash Flows Array'],
            defaultParams: [0.1, [-1000, 300, 400, 500, 600]],
            calculate: (params) => FinancialFunctions.netPresentValue(params[0], params[1]),
            description: 'Calculates the net present value of cash flows',
            useCases: ['Capital budgeting', 'Project evaluation', 'Investment decisions']
        },
        'internalRateOfReturn': {
            name: 'Internal Rate of Return (IRR)',
            category: 'Investment Analysis',
            params: ['cashFlows', 'guess'],
            paramNames: ['Cash Flows Array', 'Initial Guess'],
            defaultParams: [[-1000, 300, 400, 500, 600], 0.1],
            calculate: (params) => FinancialFunctions.internalRateOfReturn(params[0], params[1]),
            description: 'Calculates the internal rate of return for cash flows',
            useCases: ['Investment evaluation', 'Project ranking', 'Performance measurement']
        },
        'paybackPeriod': {
            name: 'Payback Period',
            category: 'Investment Analysis',
            params: ['initialInvestment', 'cashFlows'],
            paramNames: ['Initial Investment', 'Cash Flows Array'],
            defaultParams: [1000, [300, 400, 500, 600]],
            calculate: (params) => FinancialFunctions.paybackPeriod(params[0], params[1]),
            description: 'Calculates time to recover initial investment',
            useCases: ['Risk assessment', 'Liquidity analysis', 'Quick investment screening']
        },
        'discountedPaybackPeriod': {
            name: 'Discounted Payback Period',
            category: 'Investment Analysis',
            params: ['initialInvestment', 'cashFlows', 'discountRate'],
            paramNames: ['Initial Investment', 'Cash Flows Array', 'Discount Rate'],
            defaultParams: [1000, [300, 400, 500, 600], 0.1],
            calculate: (params) => FinancialFunctions.discountedPaybackPeriod(params[0], params[1], params[2]),
            description: 'Calculates discounted payback period',
            useCases: ['Risk-adjusted payback', 'Time value consideration', 'Investment screening']
        },
        'currentRatio': {
            name: 'Current Ratio',
            category: 'Liquidity Ratios',
            params: ['currentAssets', 'currentLiabilities'],
            paramNames: ['Current Assets', 'Current Liabilities'],
            defaultParams: [150000, 100000],
            calculate: (params) => FinancialFunctions.currentRatio(params[0], params[1]),
            description: 'Measures short-term liquidity',
            useCases: ['Credit analysis', 'Financial health assessment', 'Liquidity management']
        },
        'quickRatio': {
            name: 'Quick Ratio (Acid-Test)',
            category: 'Liquidity Ratios',
            params: ['quickAssets', 'currentLiabilities'],
            paramNames: ['Quick Assets (Current Assets - Inventory)', 'Current Liabilities'],
            defaultParams: [100000, 100000],
            calculate: (params) => FinancialFunctions.quickRatio(params[0], params[1]),
            description: 'Measures immediate liquidity without inventory',
            useCases: ['Conservative liquidity analysis', 'Credit evaluation', 'Cash management']
        },
        'debtToEquityRatio': {
            name: 'Debt-to-Equity Ratio',
            category: 'Leverage Ratios',
            params: ['totalDebt', 'totalEquity'],
            paramNames: ['Total Debt', 'Total Equity'],
            defaultParams: [500000, 1000000],
            calculate: (params) => FinancialFunctions.debtToEquityRatio(params[0], params[1]),
            description: 'Measures financial leverage',
            useCases: ['Risk assessment', 'Capital structure analysis', 'Credit evaluation']
        },
        'returnOnEquity': {
            name: 'Return on Equity (ROE)',
            category: 'Profitability Ratios',
            params: ['netIncome', 'averageEquity'],
            paramNames: ['Net Income', 'Average Stockholders Equity'],
            defaultParams: [100000, 1000000],
            calculate: (params) => FinancialFunctions.returnOnEquity(params[0], params[1]),
            description: 'Measures return generated on shareholders equity',
            useCases: ['Performance evaluation', 'Investment analysis', 'Management effectiveness']
        },
        'returnOnAssets': {
            name: 'Return on Assets (ROA)',
            category: 'Profitability Ratios',
            params: ['netIncome', 'averageAssets'],
            paramNames: ['Net Income', 'Average Total Assets'],
            defaultParams: [100000, 1500000],
            calculate: (params) => FinancialFunctions.returnOnAssets(params[0], params[1]),
            description: 'Measures efficiency in using assets to generate profit',
            useCases: ['Asset utilization analysis', 'Performance benchmarking', 'Management evaluation']
        },
        'grossProfitMargin': {
            name: 'Gross Profit Margin',
            category: 'Profitability Ratios',
            params: ['grossProfit', 'revenue'],
            paramNames: ['Gross Profit', 'Revenue'],
            defaultParams: [400000, 1000000],
            calculate: (params) => FinancialFunctions.grossProfitMargin(params[0], params[1]),
            description: 'Measures profitability after cost of goods sold',
            useCases: ['Pricing analysis', 'Cost control', 'Industry comparison']
        },
        'operatingMargin': {
            name: 'Operating Margin (EBIT Margin)',
            category: 'Profitability Ratios',
            params: ['operatingIncome', 'revenue'],
            paramNames: ['Operating Income (EBIT)', 'Revenue'],
            defaultParams: [200000, 1000000],
            calculate: (params) => FinancialFunctions.operatingMargin(params[0], params[1]),
            description: 'Measures operating efficiency',
            useCases: ['Operational performance', 'Cost management', 'Competitive analysis']
        },
        'netProfitMargin': {
            name: 'Net Profit Margin',
            category: 'Profitability Ratios',
            params: ['netIncome', 'revenue'],
            paramNames: ['Net Income', 'Revenue'],
            defaultParams: [100000, 1000000],
            calculate: (params) => FinancialFunctions.netProfitMargin(params[0], params[1]),
            description: 'Measures overall profitability',
            useCases: ['Overall performance', 'Investor analysis', 'Strategic planning']
        },
        'earningsPerShare': {
            name: 'Earnings Per Share (EPS)',
            category: 'Market Ratios',
            params: ['netIncome', 'weightedAverageShares'],
            paramNames: ['Net Income', 'Weighted Average Shares Outstanding'],
            defaultParams: [100000, 50000],
            calculate: (params) => FinancialFunctions.earningsPerShare(params[0], params[1]),
            description: 'Measures earnings attributable to each share',
            useCases: ['Investment analysis', 'Stock valuation', 'Performance tracking']
        },
        'priceToEarningsRatio': {
            name: 'Price-to-Earnings (P/E) Ratio',
            category: 'Market Ratios',
            params: ['marketPrice', 'earningsPerShare'],
            paramNames: ['Market Price per Share', 'Earnings per Share'],
            defaultParams: [20, 2],
            calculate: (params) => FinancialFunctions.priceToEarningsRatio(params[0], params[1]),
            description: 'Measures market valuation relative to earnings',
            useCases: ['Stock valuation', 'Investment decisions', 'Market analysis']
        },
        'workingCapital': {
            name: 'Working Capital',
            category: 'Liquidity Analysis',
            params: ['currentAssets', 'currentLiabilities'],
            paramNames: ['Current Assets', 'Current Liabilities'],
            defaultParams: [150000, 100000],
            calculate: (params) => FinancialFunctions.workingCapital(params[0], params[1]),
            description: 'Measures short-term financial health',
            useCases: ['Liquidity management', 'Operational financing', 'Cash flow planning']
        },
        'cashConversionCycle': {
            name: 'Cash Conversion Cycle (CCC)',
            category: 'Efficiency Analysis',
            params: ['daysInventoryOutstanding', 'daysReceivablesOutstanding', 'daysPayablesOutstanding'],
            paramNames: ['Days Inventory Outstanding', 'Days Receivables Outstanding', 'Days Payables Outstanding'],
            defaultParams: [45, 30, 25],
            calculate: (params) => FinancialFunctions.cashConversionCycle(params[0], params[1], params[2]),
            description: 'Measures time to convert investments into cash',
            useCases: ['Working capital management', 'Cash flow optimization', 'Operational efficiency']
        },
        'breakEvenUnits': {
            name: 'Break-Even Analysis (Units)',
            category: 'Cost-Volume-Profit Analysis',
            params: ['fixedCosts', 'pricePerUnit', 'variableCostPerUnit'],
            paramNames: ['Fixed Costs', 'Price per Unit', 'Variable Cost per Unit'],
            defaultParams: [100000, 50, 30],
            calculate: (params) => FinancialFunctions.breakEvenUnits(params[0], params[1], params[2]),
            description: 'Calculates break-even point in units',
            useCases: ['Production planning', 'Pricing decisions', 'Cost management']
        },
        'dividendDiscountModel': {
            name: 'Dividend Discount Model',
            category: 'Valuation Models',
            params: ['dividend', 'growthRate', 'requiredReturn'],
            paramNames: ['Expected Dividend per Share', 'Growth Rate', 'Required Return'],
            defaultParams: [2, 0.05, 0.12],
            calculate: (params) => FinancialFunctions.dividendDiscountModel(params[0], params[1], params[2]),
            description: 'Values stock based on dividend payments',
            useCases: ['Stock valuation', 'Investment analysis', 'Portfolio management']
        },
        'economicValueAdded': {
            name: 'Economic Value Added (EVA)',
            category: 'Performance Measurement',
            params: ['nopat', 'wacc', 'investedCapital'],
            paramNames: ['Net Operating Profit After Tax', 'Weighted Average Cost of Capital', 'Invested Capital'],
            defaultParams: [150000, 0.10, 1000000],
            calculate: (params) => FinancialFunctions.economicValueAdded(params[0], params[1], params[2]),
            description: 'Measures economic profit creation',
            useCases: ['Performance evaluation', 'Value creation assessment', 'Management incentives']
        }
    };

    static getFormula(name) {
        return this.formulas[name] || null;
    }

    static getAllFormulas() {
        return Object.keys(this.formulas);
    }

    static getFormulasByCategory(category) {
        return Object.entries(this.formulas)
            .filter(([_, formula]) => formula.category === category)
            .map(([name, _]) => name);
    }

    static getAllCategories() {
        return [...new Set(Object.values(this.formulas).map(f => f.category))];
    }
}

export class EnhancedFinancialWorkbook {
    constructor(options = {}) {
        this.width = options.width || 1200;
        this.height = options.height || 1600;
        this.theme = options.theme || "excel";

        // Spreadsheet styling
        this.cellWidth = 200;
        this.cellHeight = 25;
        this.headerHeight = 30;
        this.rowLabelWidth = 60;
        this.fontSize = 11;

        // Data storage
        this.selectedFormula = null;
        this.formulaParams = null;
        this.calculationResult = null;
        this.scenarioAnalysis = {};
        this.sensitivityAnalysis = {};
        this.comparisonAnalysis = {};
        this.calculationHistory = [];
        this.currentWorkbook = null;

        // Analysis settings
        this.scenarioName = "";
        this.companyName = "";
        this.analysisDate = new Date().toISOString().split('T')[0];
        this.analystName = "";
        this.notes = "";

        // Theme colors
        this.setThemeColors();
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
                borderColor: '#808080'
            }
        };
        this.colors = themes[this.theme] || themes.excel;
    }

    calculateFinancialFormula(config) {
        this.scenarioName = config.scenarioName || "Financial Analysis";
        this.companyName = config.companyName || "Sample Company";
        this.analystName = config.analystName || "Financial Analyst";
        this.notes = config.notes || "";
        
        this.selectedFormula = config.formula;
        this.formulaParams = config.parameters || [];

        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        if (!formula) {
            throw new Error(`Unknown formula: ${this.selectedFormula}`);
        }

        // Use provided parameters or defaults
        const params = this.formulaParams.length > 0 ? this.formulaParams : formula.defaultParams;
        
        // Calculate main result
        this.calculationResult = {
            formula: this.selectedFormula,
            result: formula.calculate(params),
            parameters: this.createParameterSummary(formula, params),
            interpretation: this.generateInterpretation(formula, params)
        };

        // Additional analyses
        if (config.performSensitivityAnalysis) {
            this.performSensitivityAnalysis(config.sensitivityConfig);
        }

        if (config.performScenarioAnalysis) {
            this.performScenarioAnalysis(config.scenarioConfig);
        }

        if (config.performComparisonAnalysis) {
            this.performComparisonAnalysis(config.comparisonConfig);
        }

        // Generate workbook
        this.generateWorkbook();
        
        return this.currentWorkbook;
    }

    createParameterSummary(formula, params) {
        const summary = {};
        formula.paramNames.forEach((name, index) => {
            summary[name] = params[index];
        });
        return summary;
    }

    generateInterpretation(formula, params) {
        const result = this.calculationResult.result;
        
        switch(this.selectedFormula) {
            case 'presentValue':
                return {
                    value: `$${result.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                    meaning: 'This is the current value of the future cash flows',
                    implication: result > params[0] ? 'The present value exceeds the future value due to negative interest or payments' : 'Standard time value relationship'
                };
            case 'currentRatio':
                return {
                    value: result.toFixed(2),
                    meaning: 'Current assets are ' + result.toFixed(2) + ' times current liabilities',
                    implication: result >= 2 ? 'Strong liquidity position' : result >= 1 ? 'Adequate liquidity' : 'Liquidity concerns'
                };
            case 'returnOnEquity':
                return {
                    value: (result * 100).toFixed(2) + '%',
                    meaning: 'Return generated on shareholders\' equity investment',
                    implication: result > 0.15 ? 'Excellent ROE' : result > 0.10 ? 'Good ROE' : 'Below average ROE'
                };
            case 'netPresentValue':
                return {
                    value: `$${result.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                    meaning: 'Net value created by the investment',
                    implication: result > 0 ? 'Investment creates value - Accept' : result < 0 ? 'Investment destroys value - Reject' : 'Breakeven investment'
                };
            default:
                return {
                    value: typeof result === 'number' ? result.toFixed(4) : result.toString(),
                    meaning: 'Calculated result based on input parameters',
                    implication: 'Review result in context of business objectives'
                };
        }
    }

    performSensitivityAnalysis(config) {
        if (!config || !config.parameterIndex) return;

        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        const baseParams = [...this.formulaParams];
        const paramIndex = config.parameterIndex;
        const baseValue = baseParams[paramIndex];
        
        const variations = config.variations || [-50, -25, -10, -5, 0, 5, 10, 25, 50];
        
        this.sensitivityAnalysis = {
            parameterName: formula.paramNames[paramIndex],
            baseValue: baseValue,
            baseResult: this.calculationResult.result,
            variations: []
        };

        variations.forEach(percentChange => {
            const newValue = baseValue * (1 + percentChange / 100);
            const newParams = [...baseParams];
            newParams[paramIndex] = newValue;
            
            try {
                const newResult = formula.calculate(newParams);
                const resultChange = ((newResult - this.calculationResult.result) / this.calculationResult.result) * 100;
                
                this.sensitivityAnalysis.variations.push({
                    percentChange,
                    newValue,
                    newResult,
                    resultChange,
                    sensitivity: resultChange / percentChange // Elasticity
                });
            } catch (error) {
                this.sensitivityAnalysis.variations.push({
                    percentChange,
                    newValue,
                    error: error.message
                });
            }
        });
    }

    performScenarioAnalysis(config) {
        if (!config || !config.scenarios) return;

        this.scenarioAnalysis = {
            baseCase: {
                name: 'Base Case',
                parameters: {...this.calculationResult.parameters},
                result: this.calculationResult.result
            },
            scenarios: []
        };

        config.scenarios.forEach(scenario => {
            const formula = FormulaRegistry.getFormula(this.selectedFormula);
            const scenarioParams = [...this.formulaParams];
            
            // Apply parameter changes for this scenario
            Object.entries(scenario.parameterChanges).forEach(([paramName, newValue]) => {
                const paramIndex = formula.paramNames.indexOf(paramName);
                if (paramIndex !== -1) {
                    scenarioParams[paramIndex] = newValue;
                }
            });

            try {
                const scenarioResult = formula.calculate(scenarioParams);
                const resultChange = ((scenarioResult - this.calculationResult.result) / this.calculationResult.result) * 100;

                this.scenarioAnalysis.scenarios.push({
                    name: scenario.name,
                    parameters: this.createParameterSummary(formula, scenarioParams),
                    result: scenarioResult,
                    resultChange,
                    interpretation: this.generateScenarioInterpretation(scenario.name, scenarioResult, resultChange)
                });
            } catch (error) {
                this.scenarioAnalysis.scenarios.push({
                    name: scenario.name,
                    error: error.message
                });
            }
        });
    }

    generateScenarioInterpretation(scenarioName, result, changePercent) {
        const interpretation = {
            summary: `${scenarioName} results in ${changePercent >= 0 ? 'an increase' : 'a decrease'} of ${Math.abs(changePercent).toFixed(2)}%`
        };

        if (this.selectedFormula === 'netPresentValue') {
            interpretation.recommendation = result > 0 ? 'Accept investment' : 'Reject investment';
        } else if (this.selectedFormula.includes('Ratio')) {
            interpretation.recommendation = result > 1 ? 'Favorable ratio' : 'Unfavorable ratio';
        }

        return interpretation;
    }

    performComparisonAnalysis(config) {
        if (!config || !config.comparisons) return;

        this.comparisonAnalysis = {
            baseCompany: {
                name: this.companyName,
                result: this.calculationResult.result
            },
            comparisons: []
        };

        const formula = FormulaRegistry.getFormula(this.selectedFormula);

        config.comparisons.forEach(comparison => {
            try {
                const comparisonResult = formula.calculate(comparison.parameters);
                const difference = comparisonResult - this.calculationResult.result;
                const percentDifference = (difference / this.calculationResult.result) * 100;

                this.comparisonAnalysis.comparisons.push({
                    name: comparison.name,
                    result: comparisonResult,
                    difference,
                    percentDifference,
                    performance: this.evaluatePerformance(comparisonResult, this.calculationResult.result)
                });
            } catch (error) {
                this.comparisonAnalysis.comparisons.push({
                    name: comparison.name,
                    error: error.message
                });
            }
        });
    }

    evaluatePerformance(comparisonValue, baseValue) {
        const isHigherBetter = ['returnOnEquity', 'returnOnAssets', 'currentRatio', 'quickRatio', 
                               'grossProfitMargin', 'operatingMargin', 'netProfitMargin'].includes(this.selectedFormula);
        
        if (isHigherBetter) {
            return comparisonValue > baseValue ? 'Better' : comparisonValue < baseValue ? 'Worse' : 'Equal';
        } else {
            return comparisonValue < baseValue ? 'Better' : comparisonValue > baseValue ? 'Worse' : 'Equal';
        }
    }

    generateCalculationWalkthrough() {
        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        
        switch(this.selectedFormula) {
            case 'presentValue':
                return this.generatePresentValueWalkthrough();
            case 'futureValue':
                return this.generateFutureValueWalkthrough();
            case 'netPresentValue':
                return this.generateNPVWalkthrough();
            case 'internalRateOfReturn':
                return this.generateIRRWalkthrough();
            case 'currentRatio':
                return this.generateCurrentRatioWalkthrough();
            case 'returnOnEquity':
                return this.generateROEWalkthrough();
            case 'breakEvenUnits':
                return this.generateBreakEvenWalkthrough();
            default:
                return this.generateGenericWalkthrough(formula);
        }
    }

    generatePresentValueWalkthrough() {
        const [fv, rate, periods, pmt, type] = this.formulaParams;
        
        return {
            title: "Present Value Calculation Walkthrough",
            steps: [
                {
                    step: "Step 1: Identify the Variables",
                    explanation: `Future Value (FV) = $${fv.toLocaleString()}
                                Interest Rate (r) = ${(rate * 100).toFixed(2)}%
                                Number of Periods (n) = ${periods}
                                Payment (PMT) = $${pmt.toLocaleString()}
                                Type = ${type === 0 ? 'End of period' : 'Beginning of period'}`
                },
                {
                    step: "Step 2: Apply Present Value Formula",
                    formula: pmt === 0 ? "PV = FV / (1 + r)^n" : "PV = FV / (1 + r)^n + PMT × [(1 - (1 + r)^-n) / r]",
                    explanation: pmt === 0 ? "Single amount formula" : "Combined lump sum and annuity formula"
                },
                {
                    step: "Step 3: Calculate Discount Factor",
                    formula: `(1 + ${rate})^${periods} = ${Math.pow(1 + rate, periods).toFixed(6)}`,
                    explanation: "This is the compound growth factor"
                },
                {
                    step: "Step 4: Calculate Present Value",
                    formula: `PV = $${fv.toLocaleString()} / ${Math.pow(1 + rate, periods).toFixed(6)} = $${this.calculationResult.result.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                    explanation: "Final present value calculation"
                }
            ],
            businessInsight: this.generateBusinessInsight('presentValue')
        };
    }

    generateNPVWalkthrough() {
        const [rate, cashFlows] = this.formulaParams;
        
        return {
            title: "Net Present Value Calculation Walkthrough",
            steps: [
                {
                    step: "Step 1: Identify Cash Flows",
                    explanation: `Discount Rate = ${(rate * 100).toFixed(2)}%
                                Cash Flows: ${cashFlows.map((cf, i) => `Year ${i}: $${cf.toLocaleString()}`).join(', ')}`
                },
                {
                    step: "Step 2: Calculate Present Value of Each Cash Flow",
                    formula: "PV = CF / (1 + r)^t",
                    explanation: "Apply discount rate to each future cash flow"
                },
                {
                    step: "Step 3: Present Value Calculations",
                    details: cashFlows.map((cf, period) => ({
                        period,
                        cashFlow: cf,
                        discountFactor: Math.pow(1 + rate, period).toFixed(6),
                        presentValue: (cf / Math.pow(1 + rate, period)).toFixed(2)
                    }))
                },
                {
                    step: "Step 4: Sum All Present Values",
                    formula: `NPV = ${cashFlows.map((cf, i) => `$${(cf / Math.pow(1 + rate, i)).toFixed(2)}`).join(' + ')} = $${this.calculationResult.result.toFixed(2)}`,
                    explanation: "Net Present Value is the sum of all discounted cash flows"
                }
            ],
            decisionRule: {
                accept: "NPV > 0 (Creates value)",
                reject: "NPV < 0 (Destroys value)",
                current: this.calculationResult.result > 0 ? "ACCEPT - Project creates value" : "REJECT - Project destroys value"
            },
            businessInsight: this.generateBusinessInsight('netPresentValue')
        };
    }

    generateCurrentRatioWalkthrough() {
        const [currentAssets, currentLiabilities] = this.formulaParams;
        
        return {
            title: "Current Ratio Analysis Walkthrough",
            steps: [
                {
                    step: "Step 1: Identify Current Assets and Liabilities",
                    explanation: `Current Assets = $${currentAssets.toLocaleString()}
                                Current Liabilities = $${currentLiabilities.toLocaleString()}`
                },
                {
                    step: "Step 2: Apply Current Ratio Formula",
                    formula: "Current Ratio = Current Assets / Current Liabilities",
                    explanation: "Measures ability to pay short-term obligations"
                },
                {
                    step: "Step 3: Calculate Ratio",
                    formula: `Current Ratio = $${currentAssets.toLocaleString()} / $${currentLiabilities.toLocaleString()} = ${this.calculationResult.result.toFixed(2)}`,
                    explanation: "This means current assets are " + this.calculationResult.result.toFixed(2) + " times current liabilities"
                }
            ],
            interpretation: {
                excellent: "> 2.0 - Strong liquidity position",
                good: "1.5 - 2.0 - Adequate liquidity",
                adequate: "1.0 - 1.5 - Minimum acceptable",
                poor: "< 1.0 - Liquidity concerns",
                current: this.calculateLiquidityAssessment(this.calculationResult.result)
            },
            businessInsight: this.generateBusinessInsight('currentRatio')
        };
    }

    calculateLiquidityAssessment(ratio) {
        if (ratio >= 2.0) return "Excellent - Strong liquidity position";
        if (ratio >= 1.5) return "Good - Adequate liquidity";
        if (ratio >= 1.0) return "Adequate - Minimum acceptable level";
        return "Poor - Significant liquidity concerns";
    }

    generateROEWalkthrough() {
        const [netIncome, averageEquity] = this.formulaParams;
        
        return {
            title: "Return on Equity (ROE) Analysis Walkthrough",
            steps: [
                {
                    step: "Step 1: Identify Components",
                    explanation: `Net Income = $${netIncome.toLocaleString()}
                                Average Stockholders' Equity = $${averageEquity.toLocaleString()}`
                },
                {
                    step: "Step 2: Apply ROE Formula",
                    formula: "ROE = Net Income / Average Stockholders' Equity",
                    explanation: "Measures return generated on shareholders' investment"
                },
                {
                    step: "Step 3: Calculate ROE",
                    formula: `ROE = $${netIncome.toLocaleString()} / $${averageEquity.toLocaleString()} = ${(this.calculationResult.result * 100).toFixed(2)}%`,
                    explanation: "This represents the percentage return on equity investment"
                }
            ],
            duPontAnalysis: {
                note: "ROE can be decomposed using DuPont Analysis:",
                formula: "ROE = (Net Profit Margin) × (Asset Turnover) × (Equity Multiplier)",
                explanation: "This helps identify sources of ROE performance"
            },
            benchmarking: {
                excellent: "> 20% - Outstanding performance",
                good: "15-20% - Above average performance",
                average: "10-15% - Market average",
                poor: "< 10% - Below average performance",
                current: this.calculateROEAssessment(this.calculationResult.result)
            },
            businessInsight: this.generateBusinessInsight('returnOnEquity')
        };
    }

    calculateROEAssessment(roe) {
        if (roe >= 0.20) return "Outstanding - Exceptional shareholder returns";
        if (roe >= 0.15) return "Above Average - Strong performance";
        if (roe >= 0.10) return "Average - Market level performance";
        return "Below Average - Performance concerns";
    }

    generateBreakEvenWalkthrough() {
        const [fixedCosts, pricePerUnit, variableCostPerUnit] = this.formulaParams;
        const contributionMargin = pricePerUnit - variableCostPerUnit;
        
        return {
            title: "Break-Even Analysis Walkthrough",
            steps: [
                {
                    step: "Step 1: Identify Cost Structure",
                    explanation: `Fixed Costs = $${fixedCosts.toLocaleString()}
                                Price per Unit = $${pricePerUnit}
                                Variable Cost per Unit = $${variableCostPerUnit}`
                },
                {
                    step: "Step 2: Calculate Contribution Margin",
                    formula: "Contribution Margin = Price per Unit - Variable Cost per Unit",
                    calculation: `$${pricePerUnit} - $${variableCostPerUnit} = $${contributionMargin}`,
                    explanation: "This is the amount each unit contributes to covering fixed costs"
                },
                {
                    step: "Step 3: Apply Break-Even Formula",
                    formula: "Break-Even Units = Fixed Costs / Contribution Margin per Unit",
                    explanation: "Number of units needed to cover all fixed costs"
                },
                {
                    step: "Step 4: Calculate Break-Even Point",
                    calculation: `$${fixedCosts.toLocaleString()} / $${contributionMargin} = ${this.calculationResult.result.toFixed(0)} units`,
                    explanation: "Must sell this many units to break even"
                }
            ],
            additionalMetrics: {
                breakEvenRevenue: (this.calculationResult.result * pricePerUnit).toLocaleString(),
                contributionMarginRatio: ((contributionMargin / pricePerUnit) * 100).toFixed(2) + '%',
                marginOfSafety: "Calculate as (Actual Sales - Break-Even Sales) / Actual Sales"
            },
            businessInsight: this.generateBusinessInsight('breakEvenUnits')
        };
    }

    generateGenericWalkthrough(formula) {
        return {
            title: `${formula.name} Calculation`,
            steps: [
                {
                    step: "Step 1: Input Parameters",
                    explanation: formula.paramNames.map((name, i) => `${name}: ${this.formulaParams[i]}`).join('\n')
                },
                {
                    step: "Step 2: Apply Formula",
                    formula: "See formula documentation",
                    explanation: `Calculating ${formula.name}`
                },
                {
                    step: "Step 3: Result",
                    result: this.calculationResult.result,
                    explanation: "Final calculated value"
                }
            ],
            businessInsight: this.generateBusinessInsight(this.selectedFormula)
        };
    }

    generateBusinessInsight(formulaType) {
        switch(formulaType) {
            case 'presentValue':
                return {
                    keyTakeaway: "Present value helps evaluate the current worth of future cash flows",
                    decisionMaking: "Use for investment decisions, loan analysis, and valuation",
                    considerations: "Interest rate assumptions are critical - small changes can significantly impact results"
                };
            case 'netPresentValue':
                return {
                    keyTakeaway: "NPV measures the net value created by an investment",
                    decisionMaking: "Accept projects with positive NPV, reject those with negative NPV",
                    considerations: "Discount rate selection is crucial - should reflect project risk and cost of capital"
                };
            case 'currentRatio':
                return {
                    keyTakeaway: "Current ratio indicates short-term financial health and liquidity",
                    decisionMaking: "Important for credit decisions, working capital management",
                    considerations: "Industry context matters - some industries naturally operate with lower ratios"
                };
            case 'returnOnEquity':
                return {
                    keyTakeaway: "ROE measures how effectively management uses shareholders' equity",
                    decisionMaking: "Key metric for investment decisions and management evaluation",
                    considerations: "High ROE could indicate high leverage - analyze alongside other metrics"
                };
            case 'breakEvenUnits':
                return {
                    keyTakeaway: "Break-even analysis identifies minimum sales needed for profitability",
                    decisionMaking: "Essential for pricing, production planning, and feasibility analysis",
                    considerations: "Assumes linear cost behavior - may not hold at all production levels"
                };
            default:
                return {
                    keyTakeaway: "Financial ratios provide insights into company performance",
                    decisionMaking: "Compare to industry benchmarks and historical trends",
                    considerations: "Consider multiple metrics together for comprehensive analysis"
                };
        }
    }

    generateWorkbook() {
        const data = [];

        data.push(...this.generateHeaderSection());
        data.push(...this.generateExecutiveSummarySection());
        data.push(...this.generateInputParametersSection());
        data.push(...this.generateCalculationResultsSection());
        data.push(...this.generateCalculationWalkthroughSection());

        if (Object.keys(this.sensitivityAnalysis).length > 0) {
            data.push(...this.generateSensitivityAnalysisSection());
        }

        if (Object.keys(this.scenarioAnalysis).length > 0) {
            data.push(...this.generateScenarioAnalysisSection());
        }

        if (Object.keys(this.comparisonAnalysis).length > 0) {
            data.push(...this.generateComparisonAnalysisSection());
        }

        data.push(...this.generateRecommendationsSection());
        data.push(...this.generateAppendixSection());

        this.currentWorkbook = data;
    }

    generateHeaderSection() {
        return [
            { type: 'title', content: 'FINANCIAL ANALYSIS WORKBOOK', style: 'main_title' },
            { type: 'spacer' },
            { type: 'section_header', content: 'ANALYSIS OVERVIEW' },
            { type: 'data_row', label: 'Analysis Type:', value: FormulaRegistry.getFormula(this.selectedFormula)?.name || this.selectedFormula },
            { type: 'data_row', label: 'Company/Scenario:', value: this.companyName },
            { type: 'data_row', label: 'Analysis Date:', value: this.analysisDate },
            { type: 'data_row', label: 'Prepared By:', value: this.analystName },
            { type: 'data_row', label: 'Category:', value: FormulaRegistry.getFormula(this.selectedFormula)?.category || 'Financial Analysis' },
            { type: 'spacer' }
        ];
    }

    generateExecutiveSummarySection() {
        const interpretation = this.calculationResult.interpretation;
        
        return [
            { type: 'section_header', content: 'EXECUTIVE SUMMARY' },
            { type: 'data_row', label: 'Key Result:', value: interpretation.value },
            { type: 'data_row', label: 'Meaning:', value: interpretation.meaning },
            { type: 'data_row', label: 'Assessment:', value: interpretation.implication },
            { type: 'spacer' }
        ];
    }

    generateInputParametersSection() {
        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        const rows = [
            { type: 'section_header', content: 'INPUT PARAMETERS' }
        ];

        Object.entries(this.calculationResult.parameters).forEach(([name, value]) => {
            const formattedValue = typeof value === 'number' ? 
                (Math.abs(value) >= 1000 ? value.toLocaleString() : value.toString()) : 
                value.toString();
            rows.push({ type: 'data_row', label: name + ':', value: formattedValue });
        });

        rows.push({ type: 'spacer' });
        return rows;
    }

    generateCalculationResultsSection() {
        const result = this.calculationResult.result;
        const isPercentage = this.selectedFormula.includes('Margin') || 
                           this.selectedFormula.includes('return') || 
                           this.selectedFormula === 'effectiveInterestRate';
        
        const formattedResult = isPercentage ? 
            (result * 100).toFixed(2) + '%' : 
            typeof result === 'number' ? result.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : result.toString();

        return [
            { type: 'section_header', content: 'CALCULATION RESULTS' },
            { type: 'result_row', label: 'Final Result:', value: formattedResult, style: 'highlight' },
            { type: 'data_row', label: 'Formula Used:', value: FormulaRegistry.getFormula(this.selectedFormula)?.name || this.selectedFormula },
            { type: 'data_row', label: 'Description:', value: FormulaRegistry.getFormula(this.selectedFormula)?.description || '' },
            { type: 'spacer' }
        ];
    }

    generateCalculationWalkthroughSection() {
        const walkthrough = this.generateCalculationWalkthrough();
        const rows = [
            { type: 'section_header', content: 'DETAILED CALCULATION WALKTHROUGH' },
            { type: 'subsection_header', content: walkthrough.title }
        ];

        walkthrough.steps.forEach((step, index) => {
            rows.push({ type: 'step_header', content: step.step });
            if (step.explanation) {
                rows.push({ type: 'explanation', content: step.explanation });
            }
            if (step.formula) {
                rows.push({ type: 'formula', content: step.formula });
            }
            if (step.calculation) {
                rows.push({ type: 'calculation', content: step.calculation });
            }
            if (step.details) {
                step.details.forEach(detail => {
                    rows.push({ 
                        type: 'detail_row', 
                        content: `Year ${detail.period}: $${detail.cashFlow.toLocaleString()} / ${detail.discountFactor} = $${detail.presentValue}` 
                    });
                });
            }
            rows.push({ type: 'spacer_small' });
        });

        if (walkthrough.businessInsight) {
            rows.push({ type: 'subsection_header', content: 'BUSINESS INSIGHTS' });
            rows.push({ type: 'data_row', label: 'Key Takeaway:', value: walkthrough.businessInsight.keyTakeaway });
            rows.push({ type: 'data_row', label: 'Decision Making:', value: walkthrough.businessInsight.decisionMaking });
            rows.push({ type: 'data_row', label: 'Considerations:', value: walkthrough.businessInsight.considerations });
        }

        if (walkthrough.decisionRule) {
            rows.push({ type: 'subsection_header', content: 'DECISION RULE' });
            rows.push({ type: 'data_row', label: 'Accept when:', value: walkthrough.decisionRule.accept });
            rows.push({ type: 'data_row', label: 'Reject when:', value: walkthrough.decisionRule.reject });
            rows.push({ type: 'result_row', label: 'Recommendation:', value: walkthrough.decisionRule.current, style: 'highlight' });
        }

        rows.push({ type: 'spacer' });
        return rows;
    }

    generateSensitivityAnalysisSection() {
        if (!this.sensitivityAnalysis || !this.sensitivityAnalysis.variations) return [];

        const rows = [
            { type: 'section_header', content: 'SENSITIVITY ANALYSIS' },
            { type: 'data_row', label: 'Parameter Analyzed:', value: this.sensitivityAnalysis.parameterName },
            { type: 'data_row', label: 'Base Value:', value: this.sensitivityAnalysis.baseValue.toLocaleString() },
            { type: 'spacer_small' },
            { type: 'table_header', content: 'Change % | New Value | New Result | Result Change % | Sensitivity' }
        ];

        this.sensitivityAnalysis.variations.forEach(variation => {
            if (!variation.error) {
                const row = `${variation.percentChange >= 0 ? '+' : ''}${variation.percentChange}% | ` +
                          `${variation.newValue.toLocaleString()} | ` +
                          `${variation.newResult.toLocaleString()} | ` +
                          `${variation.resultChange >= 0 ? '+' : ''}${variation.resultChange.toFixed(2)}% | ` +
                          `${variation.sensitivity.toFixed(3)}`;
                rows.push({ type: 'table_row', content: row });
            }
        });

        rows.push({ type: 'spacer' });
        return rows;
    }

    generateScenarioAnalysisSection() {
        if (!this.scenarioAnalysis || !this.scenarioAnalysis.scenarios) return [];

        const rows = [
            { type: 'section_header', content: 'SCENARIO ANALYSIS' },
            { type: 'subsection_header', content: 'Base Case' },
            { type: 'data_row', label: 'Result:', value: this.scenarioAnalysis.baseCase.result.toLocaleString() }
        ];

        this.scenarioAnalysis.scenarios.forEach(scenario => {
            if (!scenario.error) {
                rows.push({ type: 'subsection_header', content: scenario.name });
                rows.push({ type: 'data_row', label: 'Result:', value: scenario.result.toLocaleString() });
                rows.push({ type: 'data_row', label: 'Change from Base:', value: `${scenario.resultChange >= 0 ? '+' : ''}${scenario.resultChange.toFixed(2)}%` });
                if (scenario.interpretation) {
                    rows.push({ type: 'data_row', label: 'Interpretation:', value: scenario.interpretation.summary });
                }
                rows.push({ type: 'spacer_small' });
            }
        });

        rows.push({ type: 'spacer' });
        return rows;
    }

    generateComparisonAnalysisSection() {
        if (!this.comparisonAnalysis || !this.comparisonAnalysis.comparisons) return [];

        const rows = [
            { type: 'section_header', content: 'COMPARATIVE ANALYSIS' },
            { type: 'data_row', label: 'Base Company:', value: `${this.comparisonAnalysis.baseCompany.name} - ${this.comparisonAnalysis.baseCompany.result.toLocaleString()}` },
            { type: 'spacer_small' },
            { type: 'table_header', content: 'Company | Result | Difference | % Difference | Performance' }
        ];

        this.comparisonAnalysis.comparisons.forEach(comparison => {
            if (!comparison.error) {
                const row = `${comparison.name} | ` +
                          `${comparison.result.toLocaleString()} | ` +
                          `${comparison.difference >= 0 ? '+' : ''}${comparison.difference.toLocaleString()} | ` +
                          `${comparison.percentDifference >= 0 ? '+' : ''}${comparison.percentDifference.toFixed(2)}% | ` +
                          `${comparison.performance}`;
                rows.push({ type: 'table_row', content: row });
            }
        });

        rows.push({ type: 'spacer' });
        return rows;
    }

    generateRecommendationsSection() {
        const recommendations = this.generateRecommendations();
        
        return [
            { type: 'section_header', content: 'RECOMMENDATIONS & CONCLUSIONS' },
            { type: 'data_row', label: 'Primary Recommendation:', value: recommendations.primary },
            { type: 'data_row', label: 'Key Considerations:', value: recommendations.considerations },
            { type: 'data_row', label: 'Next Steps:', value: recommendations.nextSteps },
            { type: 'spacer' }
        ];
    }

    generateRecommendations() {
        const result = this.calculationResult.result;
        
        switch(this.selectedFormula) {
            case 'netPresentValue':
                return {
                    primary: result > 0 ? 'Accept the investment - it creates value' : 'Reject the investment - it destroys value',
                    considerations: 'Verify discount rate assumptions and cash flow projections',
                    nextSteps: 'Perform sensitivity analysis on key assumptions'
                };
            case 'currentRatio':
                return {
                    primary: result >= 2 ? 'Strong liquidity position' : result >= 1 ? 'Adequate liquidity' : 'Address liquidity concerns',
                    considerations: 'Compare to industry benchmarks and seasonal patterns',
                    nextSteps: 'Monitor working capital components regularly'
                };
            case 'returnOnEquity':
                return {
                    primary: result > 0.15 ? 'Excellent shareholder returns' : result > 0.10 ? 'Good performance' : 'Below average returns',
                    considerations: 'Analyze components using DuPont framework and compare to industry peers',
                    nextSteps: 'Investigate drivers of profitability, asset efficiency, and leverage'
                };
            default:
                return {
                    primary: 'Review results in context of business objectives and industry benchmarks',
                    considerations: 'Consider multiple financial metrics for comprehensive analysis',
                    nextSteps: 'Monitor trends and compare to historical performance'
                };
        }
    }

    generateAppendixSection() {
        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        
        return [
            { type: 'section_header', content: 'APPENDIX' },
            { type: 'subsection_header', content: 'Formula Documentation' },
            { type: 'data_row', label: 'Formula Name:', value: formula?.name || this.selectedFormula },
            { type: 'data_row', label: 'Category:', value: formula?.category || 'Financial Analysis' },
            { type: 'data_row', label: 'Description:', value: formula?.description || 'No description available' },
            { type: 'spacer_small' },
            { type: 'subsection_header', content: 'Use Cases' },
            ...(formula?.useCases || []).map(useCase => ({ type: 'bullet_point', content: useCase })),
            { type: 'spacer_small' },
            { type: 'subsection_header', content: 'Notes and Assumptions' },
            { type: 'data_row', label: 'Analysis Date:', value: this.analysisDate },
            { type: 'data_row', label: 'Prepared By:', value: this.analystName },
            { type: 'data_row', label: 'Additional Notes:', value: this.notes || 'None' }
        ];
    }

    // Amortization Schedule Generator
    generateAmortizationSchedule(config) {
        const { principal, annualRate, years, paymentsPerYear = 12 } = config;
        const totalPayments = years * paymentsPerYear;
        const periodRate = annualRate / paymentsPerYear;
        
        const schedule = FinancialFunctions.calculateAmortizationSchedule(principal, periodRate, totalPayments);
        
        this.scenarioName = config.scenarioName || "Amortization Analysis";
        this.companyName = config.borrowerName || "Borrower";
        this.selectedFormula = 'amortization';
        
        this.calculationResult = {
            formula: 'amortization',
            principal: principal,
            annualRate: annualRate,
            years: years,
            paymentsPerYear: paymentsPerYear,
            monthlyPayment: schedule[0].payment,
            totalPayments: totalPayments,
            totalInterest: schedule.reduce((sum, payment) => sum + payment.interestPayment, 0),
            schedule: schedule
        };

        this.generateAmortizationWorkbook();
        return this.currentWorkbook;
    }

    generateAmortizationWorkbook() {
        const data = [];
        const result = this.calculationResult;

        // Header
        data.push(...[
            { type: 'title', content: 'LOAN AMORTIZATION SCHEDULE', style: 'main_title' },
            { type: 'spacer' },
            { type: 'section_header', content: 'LOAN DETAILS' },
            { type: 'data_row', label: 'Borrower:', value: this.companyName },
            { type: 'data_row', label: 'Principal Amount:', value: `$${result.principal.toLocaleString()}` },
            { type: 'data_row', label: 'Annual Interest Rate:', value: `${(result.annualRate * 100).toFixed(2)}%` },
            { type: 'data_row', label: 'Loan Term:', value: `${result.years} years` },
            { type: 'data_row', label: 'Payment Frequency:', value: `${result.paymentsPerYear} times per year` },
            { type: 'spacer' }
        ]);

        // Summary
        data.push(...[
            { type: 'section_header', content: 'PAYMENT SUMMARY' },
            { type: 'result_row', label: 'Payment Amount:', value: `$${result.monthlyPayment.toLocaleString('en-US', {minimumFractionDigits: 2})}`, style: 'highlight' },
            { type: 'data_row', label: 'Total Payments:', value: result.totalPayments.toString() },
            { type: 'data_row', label: 'Total Interest:', value: `$${result.totalInterest.toLocaleString('en-US', {minimumFractionDigits: 2})}` },
            { type: 'data_row', label: 'Total Amount Paid:', value: `$${(result.principal + result.totalInterest).toLocaleString('en-US', {minimumFractionDigits: 2})}` },
            { type: 'spacer' }
        ]);

        // Payment schedule (showing first 12 payments and then annual summaries)
        data.push(...[
            { type: 'section_header', content: 'DETAILED PAYMENT SCHEDULE' },
            { type: 'table_header', content: 'Payment # | Payment | Principal | Interest | Balance' }
        ]);

        // First 12 payments
        for (let i = 0; i < Math.min(12, result.schedule.length); i++) {
            const payment = result.schedule[i];
            const row = `${payment.period} | ` +
                      `$${payment.payment.toFixed(2)} | ` +
                      `$${payment.principalPayment.toFixed(2)} | ` +
                      `$${payment.interestPayment.toFixed(2)} | ` +
                      `$${payment.remainingBalance.toFixed(2)}`;
            data.push({ type: 'table_row', content: row });
        }

        // Annual summaries for longer loans
        if (result.years > 1) {
            data.push({ type: 'spacer_small' });
            data.push({ type: 'subsection_header', content: 'ANNUAL SUMMARY' });
            data.push({ type: 'table_header', content: 'Year | Total Payments | Principal Paid | Interest Paid | Ending Balance' });

            for (let year = 1; year <= result.years; year++) {
                const yearStart = (year - 1) * result.paymentsPerYear;
                const yearEnd = Math.min(year * result.paymentsPerYear - 1, result.schedule.length - 1);
                
                let yearlyPrincipal = 0;
                let yearlyInterest = 0;
                
                for (let i = yearStart; i <= yearEnd; i++) {
                    yearlyPrincipal += result.schedule[i].principalPayment;
                    yearlyInterest += result.schedule[i].interestPayment;
                }
                
                const endingBalance = result.schedule[yearEnd].remainingBalance;
                const totalPayments = result.monthlyPayment * (yearEnd - yearStart + 1);
                
                const row = `${year} | ` +
                          `$${totalPayments.toFixed(2)} | ` +
                          `$${yearlyPrincipal.toFixed(2)} | ` +
                          `$${yearlyInterest.toFixed(2)} | ` +
                          `$${endingBalance.toFixed(2)}`;
                data.push({ type: 'table_row', content: row });
            }
        }

        data.push({ type: 'spacer' });
        this.currentWorkbook = data;
    }

    // Cash Flow Analysis
    generateCashFlowAnalysis(config) {
        const { cashFlows, discountRate, projectName } = config;
        
        this.scenarioName = config.scenarioName || "Cash Flow Analysis";
        this.companyName = projectName || "Project Analysis";
        this.selectedFormula = 'cashFlowAnalysis';

        // Calculate multiple metrics
        const npv = FinancialFunctions.netPresentValue(discountRate, cashFlows);
        let irr = null;
        try {
            irr = FinancialFunctions.internalRateOfReturn(cashFlows);
        } catch (error) {
            irr = 'Cannot be calculated';
        }
        
        const payback = FinancialFunctions.paybackPeriod(Math.abs(cashFlows[0]), cashFlows.slice(1));
        const discountedPayback = FinancialFunctions.discountedPaybackPeriod(Math.abs(cashFlows[0]), cashFlows.slice(1), discountRate);

        this.calculationResult = {
            formula: 'cashFlowAnalysis',
            cashFlows: cashFlows,
            discountRate: discountRate,
            npv: npv,
            irr: irr,
            paybackPeriod: payback,
            discountedPaybackPeriod: discountedPayback,
            initialInvestment: Math.abs(cashFlows[0]),
            totalCashInflows: cashFlows.slice(1).reduce((sum, cf) => sum + (cf > 0 ? cf : 0), 0),
            profitabilityIndex: npv / Math.abs(cashFlows[0]) + 1
        };

        this.generateCashFlowWorkbook();
        return this.currentWorkbook;
    }

    generateCashFlowWorkbook() {
        const data = [];
        const result = this.calculationResult;

        // Header
        data.push(...[
            { type: 'title', content: 'CASH FLOW ANALYSIS', style: 'main_title' },
            { type: 'spacer' },
            { type: 'section_header', content: 'PROJECT OVERVIEW' },
            { type: 'data_row', label: 'Project Name:', value: this.companyName },
            { type: 'data_row', label: 'Analysis Date:', value: this.analysisDate },
            { type: 'data_row', label: 'Discount Rate:', value: `${(result.discountRate * 100).toFixed(2)}%` },
            { type: 'data_row', label: 'Initial Investment:', value: `$${result.initialInvestment.toLocaleString()}` },
            { type: 'spacer' }
        ]);

        // Cash Flow Schedule
        data.push(...[
            { type: 'section_header', content: 'CASH FLOW SCHEDULE' },
            { type: 'table_header', content: 'Year | Cash Flow | PV Factor | Present Value | Cumulative PV' }
        ]);

        let cumulativePV = 0;
        result.cashFlows.forEach((cf, period) => {
            const pvFactor = 1 / Math.pow(1 + result.discountRate, period);
            const presentValue = cf * pvFactor;
            cumulativePV += presentValue;

            const row = `${period} | ` +
                      `$${cf.toLocaleString()} | ` +
                      `${pvFactor.toFixed(6)} | ` +
                      `$${presentValue.toFixed(2)} | ` +
                      `$${cumulativePV.toFixed(2)}`;
            data.push({ type: 'table_row', content: row });
        });

        // Investment Metrics
        data.push({ type: 'spacer' });
        data.push(...[
            { type: 'section_header', content: 'INVESTMENT EVALUATION METRICS' },
            { type: 'result_row', label: 'Net Present Value (NPV):', value: `$${result.npv.toLocaleString('en-US', {minimumFractionDigits: 2})}`, style: result.npv > 0 ? 'positive' : 'negative' },
            { type: 'result_row', label: 'Internal Rate of Return (IRR):', value: typeof result.irr === 'number' ? `${(result.irr * 100).toFixed(2)}%` : result.irr },
            { type: 'data_row', label: 'Payback Period:', value: result.paybackPeriod ? `${result.paybackPeriod.toFixed(2)} years` : 'Never' },
            { type: 'data_row', label: 'Discounted Payback:', value: result.discountedPaybackPeriod ? `${result.discountedPaybackPeriod.toFixed(2)} years` : 'Never' },
            { type: 'data_row', label: 'Profitability Index:', value: result.profitabilityIndex.toFixed(3) },
            { type: 'spacer' }
        ]);

        // Decision Analysis
        const decision = result.npv > 0 ? 'ACCEPT' : 'REJECT';
        const reasoning = result.npv > 0 ? 'Project creates value for shareholders' : 'Project destroys shareholder value';
        
        data.push(...[
            { type: 'section_header', content: 'INVESTMENT RECOMMENDATION' },
            { type: 'result_row', label: 'Recommendation:', value: decision, style: result.npv > 0 ? 'positive' : 'negative' },
            { type: 'data_row', label: 'Rationale:', value: reasoning },
            { type: 'data_row', label: 'Risk Considerations:', value: 'Verify discount rate and cash flow assumptions' }
        ]);

        this.currentWorkbook = data;
    }

    // Flexible Budget Analysis
    generateFlexibleBudget(config) {
        const { fixedCosts, variableCostPerUnit, sellingPricePerUnit, activityLevels } = config;
        
        this.scenarioName = config.scenarioName || "Flexible Budget Analysis";
        this.companyName = config.companyName || "Budget Analysis";
        this.selectedFormula = 'flexibleBudget';

        const budgetAnalysis = activityLevels.map(units => {
            const revenue = units * sellingPricePerUnit;
            const variableCosts = units * variableCostPerUnit;
            const totalCosts = fixedCosts + variableCosts;
            const operatingIncome = revenue - totalCosts;
            const contributionMargin = revenue - variableCosts;
            const contributionMarginRatio = contributionMargin / revenue;

            return {
                units,
                revenue,
                variableCosts,
                fixedCosts,
                totalCosts,
                contributionMargin,
                contributionMarginRatio,
                operatingIncome
            };
        });

        this.calculationResult = {
            formula: 'flexibleBudget',
            fixedCosts,
            variableCostPerUnit,
            sellingPricePerUnit,
            budgetAnalysis,
            breakEvenUnits: FinancialFunctions.breakEvenUnits(fixedCosts, sellingPricePerUnit, variableCostPerUnit)
        };

        this.generateFlexibleBudgetWorkbook();
        return this.currentWorkbook;
    }

    generateFlexibleBudgetWorkbook() {
        const data = [];
        const result = this.calculationResult;

        // Header
        data.push(...[
            { type: 'title', content: 'FLEXIBLE BUDGET ANALYSIS', style: 'main_title' },
            { type: 'spacer' },
            { type: 'section_header', content: 'BUDGET PARAMETERS' },
            { type: 'data_row', label: 'Company:', value: this.companyName },
            { type: 'data_row', label: 'Fixed Costs:', value: `$${result.fixedCosts.toLocaleString()}` },
            { type: 'data_row', label: 'Variable Cost per Unit:', value: `$${result.variableCostPerUnit}` },
            { type: 'data_row', label: 'Selling Price per Unit:', value: `$${result.sellingPricePerUnit}` },
            { type: 'data_row', label: 'Break-Even Units:', value: `${result.breakEvenUnits.toFixed(0)} units` },
            { type: 'spacer' }
        ]);

        // Budget Table
        data.push(...[
            { type: 'section_header', content: 'FLEXIBLE BUDGET AT DIFFERENT ACTIVITY LEVELS' },
            { type: 'table_header', content: 'Units | Revenue | Variable Costs | Fixed Costs | Total Costs | Contribution Margin | CM Ratio | Operating Income' }
        ]);

        result.budgetAnalysis.forEach(budget => {
            const row = `${budget.units.toLocaleString()} | ` +
                      `$${budget.revenue.toLocaleString()} | ` +
                      `$${budget.variableCosts.toLocaleString()} | ` +
                      `$${budget.fixedCosts.toLocaleString()} | ` +
                      `$${budget.totalCosts.toLocaleString()} | ` +
                      `$${budget.contributionMargin.toLocaleString()} | ` +
                      `${(budget.contributionMarginRatio * 100).toFixed(1)}% | ` +
                      `$${budget.operatingIncome.toLocaleString()}`;
            data.push({ type: 'table_row', content: row });
        });

        data.push({ type: 'spacer' });

        // Analysis
        data.push(...[
            { type: 'section_header', content: 'BUDGET ANALYSIS INSIGHTS' },
            { type: 'data_row', label: 'Break-Even Point:', value: `${result.breakEvenUnits.toFixed(0)} units` },
            { type: 'data_row', label: 'Contribution Margin per Unit:', value: `$${(result.sellingPricePerUnit - result.variableCostPerUnit).toFixed(2)}` },
            { type: 'data_row', label: 'Operating Leverage:', value: 'Higher fixed costs increase operating leverage' },
            { type: 'data_row', label: 'Scalability:', value: 'Profit increases rapidly above break-even due to fixed cost absorption' }
        ]);

        this.currentWorkbook = data;
    }

    // Export functionality
    exportToExcel(filename = 'financial_analysis.xlsx') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Financial Analysis');

        // Apply styling and populate worksheet
        this.currentWorkbook.forEach((row, index) => {
            const excelRow = worksheet.getRow(index + 1);
            
            switch(row.type) {
                case 'title':
                    excelRow.getCell(1).value = row.content;
                    excelRow.getCell(1).font = { size: 16, bold: true };
                    break;
                case 'section_header':
                    excelRow.getCell(1).value = row.content;
                    excelRow.getCell(1).font = { size: 12, bold: true };
                    excelRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E2F3' } };
                    break;
                case 'data_row':
                    excelRow.getCell(1).value = row.label;
                    excelRow.getCell(2).value = row.value;
                    break;
                case 'result_row':
                    excelRow.getCell(1).value = row.label;
                    excelRow.getCell(2).value = row.value;
                    excelRow.getCell(2).font = { bold: true };
                    if (row.style === 'positive') {
                        excelRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
                    }
                    break;
                case 'table_header':
                    const headers = row.content.split(' | ');
                    headers.forEach((header, colIndex) => {
                        excelRow.getCell(colIndex + 1).value = header;
                        excelRow.getCell(colIndex + 1).font = { bold: true };
                    });
                    break;
                case 'table_row':
                    const values = row.content.split(' | ');
                    values.forEach((value, colIndex) => {
                        excelRow.getCell(colIndex + 1).value = value;
                    });
                    break;
            }
        });

        // Auto-fit columns
        worksheet.columns.forEach(column => {
            column.width = 20;
        });

        return workbook.xlsx.writeFile(filename);
    }

    // Enhanced PNG Export functionality
    exportToPNG(filename = 'financial_analysis.png', options = {}) {
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');
        
        this.renderFinancialReport(ctx, options);
        
        // Save to file
        const buffer = canvas.toBuffer('image/png');
        if (filename) {
            fs.writeFileSync(filename, buffer);
        }
        
        return buffer;
    }

    renderFinancialReport(ctx, options = {}) {
        const {
            showSensitivity = true,
            showScenarios = true,
            showWalkthrough = true,
            theme = 'professional'
        } = options;

        // Set background
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, this.width, this.height);

        // Add subtle border
        ctx.strokeStyle = this.colors.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, this.width - 20, this.height - 20);

        let yPosition = 40;
        const leftMargin = 50;
        const rightMargin = this.width - 50;
        const contentWidth = rightMargin - leftMargin;

        // Header Section
        yPosition = this.renderHeader(ctx, yPosition, leftMargin, contentWidth);
        
        // Executive Summary
        yPosition = this.renderExecutiveSummary(ctx, yPosition, leftMargin, contentWidth);
        
        // Input Parameters
        yPosition = this.renderInputParameters(ctx, yPosition, leftMargin, contentWidth);
        
        // Main Results
        yPosition = this.renderMainResults(ctx, yPosition, leftMargin, contentWidth);
        
        // Calculation Walkthrough
        if (showWalkthrough && yPosition < this.height - 300) {
            yPosition = this.renderCalculationWalkthrough(ctx, yPosition, leftMargin, contentWidth);
        }
        
        // Sensitivity Analysis
        if (showSensitivity && this.sensitivityAnalysis && Object.keys(this.sensitivityAnalysis).length > 0) {
            yPosition = this.renderSensitivityAnalysis(ctx, yPosition, leftMargin, contentWidth);
        }
        
        // Scenario Analysis
        if (showScenarios && this.scenarioAnalysis && Object.keys(this.scenarioAnalysis).length > 0) {
            yPosition = this.renderScenarioAnalysis(ctx, yPosition, leftMargin, contentWidth);
        }
        
        // Footer
        this.renderFooter(ctx, leftMargin, contentWidth);
    }

    renderHeader(ctx, yPosition, leftMargin, contentWidth) {
        // Main title with background
        const titleHeight = 60;
        ctx.fillStyle = this.colors.headerBg;
        ctx.fillRect(leftMargin - 20, yPosition - 10, contentWidth + 40, titleHeight);
        
        ctx.fillStyle = this.colors.headerText;
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('FINANCIAL ANALYSIS WORKBOOK', leftMargin + contentWidth / 2, yPosition + 30);
        
        yPosition += titleHeight + 20;
        
        // Subtitle
        if (this.calculationResult) {
            ctx.fillStyle = this.colors.sectionText;
            ctx.font = 'bold 18px Arial';
            const formulaName = FormulaRegistry.getFormula(this.selectedFormula)?.name || this.selectedFormula;
            ctx.fillText(formulaName, leftMargin + contentWidth / 2, yPosition);
            yPosition += 30;
        }
        
        // Company info
        ctx.textAlign = 'left';
        ctx.font = '14px Arial';
        ctx.fillText(`Company: ${this.companyName}`, leftMargin, yPosition);
        ctx.fillText(`Date: ${this.analysisDate}`, leftMargin + contentWidth / 2, yPosition);
        ctx.fillText(`Analyst: ${this.analystName}`, leftMargin, yPosition + 20);
        
        return yPosition + 50;
    }

    renderExecutiveSummary(ctx, yPosition, leftMargin, contentWidth) {
        yPosition = this.renderSectionHeader(ctx, 'EXECUTIVE SUMMARY', yPosition, leftMargin, contentWidth);
        
        if (this.calculationResult && this.calculationResult.interpretation) {
            const interpretation = this.calculationResult.interpretation;
            
            // Key result in highlighted box
            const resultBoxHeight = 50;
            ctx.fillStyle = this.colors.resultBg;
            ctx.fillRect(leftMargin, yPosition, contentWidth, resultBoxHeight);
            ctx.strokeStyle = this.colors.borderColor;
            ctx.strokeRect(leftMargin, yPosition, contentWidth, resultBoxHeight);
            
            ctx.fillStyle = this.colors.resultText;
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(interpretation.value, leftMargin + contentWidth / 2, yPosition + 30);
            
            yPosition += resultBoxHeight + 20;
            
            // Interpretation
            ctx.textAlign = 'left';
            ctx.font = '14px Arial';
            ctx.fillStyle = this.colors.cellText;
            yPosition = this.renderWrappedText(ctx, `Meaning: ${interpretation.meaning}`, leftMargin, yPosition, contentWidth);
            yPosition = this.renderWrappedText(ctx, `Assessment: ${interpretation.implication}`, leftMargin, yPosition + 10, contentWidth);
        }
        
        return yPosition + 30;
    }

    renderInputParameters(ctx, yPosition, leftMargin, contentWidth) {
        if (!this.calculationResult || !this.calculationResult.parameters) return yPosition;
        
        yPosition = this.renderSectionHeader(ctx, 'INPUT PARAMETERS', yPosition, leftMargin, contentWidth);
        
        const parameters = this.calculationResult.parameters;
        const paramKeys = Object.keys(parameters);
        const colWidth = contentWidth / Math.min(2, paramKeys.length);
        
        ctx.font = '12px Arial';
        ctx.fillStyle = this.colors.cellText;
        
        let col = 0;
        let row = 0;
        
        paramKeys.forEach((key, index) => {
            const value = parameters[key];
            const formattedValue = typeof value === 'number' ? 
                (Math.abs(value) >= 1000 ? value.toLocaleString() : value.toString()) : 
                value.toString();
                
            const xPos = leftMargin + (col * colWidth);
            const yPos = yPosition + (row * 25);
            
            ctx.fillStyle = this.colors.sectionText;
            ctx.font = 'bold 12px Arial';
            ctx.fillText(`${key}:`, xPos, yPos);
            
            ctx.fillStyle = this.colors.cellText;
            ctx.font = '12px Arial';
            ctx.fillText(formattedValue, xPos + 150, yPos);
            
            col++;
            if (col >= 2) {
                col = 0;
                row++;
            }
        });
        
        return yPosition + ((row + 1) * 25) + 20;
    }

    renderMainResults(ctx, yPosition, leftMargin, contentWidth) {
        yPosition = this.renderSectionHeader(ctx, 'CALCULATION RESULTS', yPosition, leftMargin, contentWidth);
        
        if (this.calculationResult) {
            const result = this.calculationResult.result;
            const isPercentage = this.selectedFormula.includes('Margin') || 
                               this.selectedFormula.includes('return') || 
                               this.selectedFormula === 'effectiveInterestRate';
            
            const formattedResult = isPercentage ? 
                (result * 100).toFixed(2) + '%' : 
                typeof result === 'number' ? result.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : result.toString();

            // Main result box
            const resultBoxHeight = 80;
            ctx.fillStyle = this.colors.resultBg;
            ctx.fillRect(leftMargin, yPosition, contentWidth, resultBoxHeight);
            ctx.strokeStyle = this.colors.borderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(leftMargin, yPosition, contentWidth, resultBoxHeight);
            
            ctx.fillStyle = this.colors.resultText;
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(formattedResult, leftMargin + contentWidth / 2, yPosition + 50);
            
            yPosition += resultBoxHeight + 10;
            
            // Formula description
            ctx.textAlign = 'left';
            ctx.font = '12px Arial';
            ctx.fillStyle = this.colors.cellText;
            const formula = FormulaRegistry.getFormula(this.selectedFormula);
            if (formula) {
                yPosition = this.renderWrappedText(ctx, formula.description, leftMargin, yPosition, contentWidth);
            }
        }
        
        return yPosition + 30;
    }

    renderCalculationWalkthrough(ctx, yPosition, leftMargin, contentWidth) {
        const walkthrough = this.generateCalculationWalkthrough();
        if (!walkthrough || !walkthrough.steps) return yPosition;
        
        yPosition = this.renderSectionHeader(ctx, 'CALCULATION WALKTHROUGH', yPosition, leftMargin, contentWidth);
        
        // Render first few steps to fit on page
        const maxSteps = Math.min(3, walkthrough.steps.length);
        
        walkthrough.steps.slice(0, maxSteps).forEach((step, index) => {
            // Step header
            ctx.fillStyle = this.colors.sectionBg;
            ctx.fillRect(leftMargin, yPosition, contentWidth, 25);
            ctx.fillStyle = this.colors.sectionText;
            ctx.font = 'bold 12px Arial';
            ctx.fillText(step.step, leftMargin + 10, yPosition + 15);
            
            yPosition += 35;
            
            // Step content
            ctx.font = '11px Arial';
            ctx.fillStyle = this.colors.cellText;
            
            if (step.explanation) {
                yPosition = this.renderWrappedText(ctx, step.explanation, leftMargin + 20, yPosition, contentWidth - 40);
                yPosition += 5;
            }
            
            if (step.formula) {
                ctx.fillStyle = this.colors.formulaBg;
                ctx.fillRect(leftMargin + 20, yPosition, contentWidth - 40, 20);
                ctx.fillStyle = this.colors.formulaText;
                ctx.font = 'bold 11px Arial';
                ctx.fillText(step.formula, leftMargin + 25, yPosition + 13);
                yPosition += 25;
            }
            
            yPosition += 10;
        });
        
        return yPosition + 20;
    }

    renderSensitivityAnalysis(ctx, yPosition, leftMargin, contentWidth) {
        if (yPosition > this.height - 200) return yPosition; // Skip if no space
        
        yPosition = this.renderSectionHeader(ctx, 'SENSITIVITY ANALYSIS', yPosition, leftMargin, contentWidth);
        
        ctx.font = '11px Arial';
        ctx.fillStyle = this.colors.cellText;
        ctx.fillText(`Parameter: ${this.sensitivityAnalysis.parameterName}`, leftMargin, yPosition);
        yPosition += 20;
        
        // Simple sensitivity chart
        const chartHeight = 120;
        const chartWidth = contentWidth - 40;
        const chartLeft = leftMargin + 20;
        
        // Chart background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(chartLeft, yPosition, chartWidth, chartHeight);
        ctx.strokeStyle = this.colors.borderColor;
        ctx.strokeRect(chartLeft, yPosition, chartWidth, chartHeight);
        
        // Plot sensitivity points
        const variations = this.sensitivityAnalysis.variations.filter(v => !v.error);
        if (variations.length > 0) {
            const minChange = Math.min(...variations.map(v => v.resultChange));
            const maxChange = Math.max(...variations.map(v => v.resultChange));
            const range = maxChange - minChange || 1;
            
            ctx.fillStyle = '#2196F3';
            variations.forEach((variation, index) => {
                const x = chartLeft + (index / (variations.length - 1)) * chartWidth;
                const y = yPosition + chartHeight - ((variation.resultChange - minChange) / range) * chartHeight;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
        
        return yPosition + chartHeight + 30;
    }

    renderScenarioAnalysis(ctx, yPosition, leftMargin, contentWidth) {
        if (yPosition > this.height - 150) return yPosition; // Skip if no space
        
        yPosition = this.renderSectionHeader(ctx, 'SCENARIO ANALYSIS', yPosition, leftMargin, contentWidth);
        
        ctx.font = '11px Arial';
        ctx.fillStyle = this.colors.cellText;
        
        // Base case
        const baseResult = this.scenarioAnalysis.baseCase.result;
        ctx.fillText(`Base Case: ${baseResult.toLocaleString()}`, leftMargin, yPosition);
        yPosition += 20;
        
        // Show first few scenarios
        const maxScenarios = Math.min(3, this.scenarioAnalysis.scenarios.length);
        this.scenarioAnalysis.scenarios.slice(0, maxScenarios).forEach(scenario => {
            if (!scenario.error) {
                const changeText = scenario.resultChange >= 0 ? '+' : '';
                ctx.fillText(`${scenario.name}: ${scenario.result.toLocaleString()} (${changeText}${scenario.resultChange.toFixed(1)}%)`, 
                           leftMargin + 20, yPosition);
                yPosition += 18;
            }
        });
        
        return yPosition + 20;
    }

    renderSectionHeader(ctx, title, yPosition, leftMargin, contentWidth) {
        const headerHeight = 30;
        ctx.fillStyle = this.colors.sectionBg;
        ctx.fillRect(leftMargin, yPosition, contentWidth, headerHeight);
        ctx.strokeStyle = this.colors.borderColor;
        ctx.strokeRect(leftMargin, yPosition, contentWidth, headerHeight);
        
        ctx.fillStyle = this.colors.sectionText;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(title, leftMargin + 10, yPosition + 20);
        
        return yPosition + headerHeight + 15;
    }

    renderWrappedText(ctx, text, x, y, maxWidth) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        const lineHeight = 16;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
        return currentY + lineHeight;
    }

    renderFooter(ctx, leftMargin, contentWidth) {
        const footerY = this.height - 40;
        ctx.fillStyle = this.colors.borderColor;
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Generated: ${new Date().toLocaleString()}`, leftMargin, footerY);
        ctx.textAlign = 'right';
        ctx.fillText('Enhanced Financial Workbook', leftMargin + contentWidth, footerY);
    }

    // Canvas visualization (simplified version for compatibility)
    generateVisualReport() {
        return this.exportToPNG();
    }

    // Batch export functionality
    exportAllFormats(baseFilename = 'financial_analysis') {
        const results = {};
        
        // Export Excel
        try {
            results.excel = this.exportToExcel(`${baseFilename}.xlsx`);
        } catch (error) {
            results.excel = { error: error.message };
        }
        
        // Export PNG
        try {
            results.png = this.exportToPNG(`${baseFilename}.png`);
        } catch (error) {
            results.png = { error: error.message };
        }
        
        // Export summary PNG (condensed version)
        try {
            results.summary = this.exportToPNG(`${baseFilename}_summary.png`, {
                showSensitivity: false,
                showScenarios: false,
                showWalkthrough: false
            });
        } catch (error) {
            results.summary = { error: error.message };
        }
        
        return results;
    }
}
