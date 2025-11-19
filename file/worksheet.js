import { createCanvas } from '@napi-rs/canvas';
import ExcelJS from 'exceljs';
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import * as math from 'mathjs';
import GIFEncoder from 'gifencoder';
import { PassThrough } from 'stream';






// Enhanced Formula Registry for Spreadsheet Operations - UPDATED with 25 Financial Formulas
class SpreadsheetFormulaRegistry {
    static formulas = {
        // Basic Mathematics
        'sum': {
            name: 'Add Numbers',
            category: 'Basic Mathematics',
            excelFormula: 'SUM',
            description: 'Add numbers together',
            example: '=SUM(A1:A10)',
            params: ['range'],
            paramNames: ['Cell Range (e.g., A1:A10)'],
            usage: 'Add all numbers in a range',
            calculate: (values) => values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
        },
        'average': {
            name: 'Average Numbers',
            category: 'Basic Mathematics',
            excelFormula: 'AVERAGE',
            description: 'Calculate average of numbers',
            example: '=AVERAGE(A1:A10)',
            params: ['range'],
            paramNames: ['Cell Range'],
            calculate: (values) => {
                const nums = values.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v));
                return nums.length > 0 ? nums.reduce((sum, val) => sum + val, 0) / nums.length : 0;
            }
        },
        'max': {
            name: 'Highest Value',
            category: 'Basic Mathematics',
            excelFormula: 'MAX',
            description: 'Find highest value',
            example: '=MAX(A1:A10)',
            params: ['range'],
            calculate: (values) => Math.max(...values.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v)))
        },
        'min': {
            name: 'Lowest Value',
            category: 'Basic Mathematics',
            excelFormula: 'MIN',
            description: 'Find lowest value',
            example: '=MIN(A1:A10)',
            params: ['range'],
            calculate: (values) => Math.min(...values.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v)))
        },
        'product': {
            name: 'Multiply Numbers',
            category: 'Basic Mathematics',
            excelFormula: 'PRODUCT',
            description: 'Multiply numbers together',
            example: '=PRODUCT(A1:A5)',
            params: ['range'],
            calculate: (values) => values.filter(v => !isNaN(parseFloat(v))).reduce((prod, val) => prod * parseFloat(val), 1)
        },
        'power': {
            name: 'Power (Exponent)',
            category: 'Basic Mathematics',
            excelFormula: 'POWER',
            description: 'Raise number to power',
            example: '=POWER(A1,2)',
            params: ['number', 'power'],
            paramNames: ['Number', 'Power'],
            calculate: (number, power) => Math.pow(parseFloat(number), parseFloat(power))
        },
        'sqrt': {
            name: 'Square Root',
            category: 'Basic Mathematics',
            excelFormula: 'SQRT',
            description: 'Calculate square root',
            example: '=SQRT(A1)',
            params: ['number'],
            calculate: (number) => Math.sqrt(parseFloat(number))
        },
        'round': {
            name: 'Round Number',
            category: 'Basic Mathematics',
            excelFormula: 'ROUND',
            description: 'Round to specified decimals',
            example: '=ROUND(A1,2)',
            params: ['number', 'decimals'],
            paramNames: ['Number', 'Decimal Places'],
            calculate: (number, decimals) => {
                const factor = Math.pow(10, parseInt(decimals) || 0);
                return Math.round(parseFloat(number) * factor) / factor;
            }
        },

'sumByRow': {
    name: 'Sum Each Row Separately',
    category: 'Basic Mathematics',
    excelFormula: 'SUM_BY_ROW',
    description: 'Sum values across columns for each row, results placed in target range',
    example: 'Sum C2:E2, C3:E3, C4:E4 → F2:F4',
    params: ['sourceRange', 'targetRange'],
    paramNames: ['Source Range (e.g., C2:E8)', 'Target Range (e.g., F2:F8)'],
    usage: 'Automatically sums each row in the source range',
    tips: [
        'Source range defines the data to sum (e.g., C2:E8)',
        'Target range defines where results go (e.g., F2:F8)',
        'Number of rows must match between source and target',
        'Works with any number of columns'
    ],
    calculate: () => null // Handled in applyFormulaBatch
},

'productByRow': {
    name: 'Multiply Each Row Separately',
    category: 'Basic Mathematics',
    excelFormula: 'PRODUCT_BY_ROW',
    description: 'Multiply values across columns for each row, results placed in target range',
    example: 'Multiply C2:E2, C3:E3, C4:E4 → F2:F4',
    params: ['sourceRange', 'targetRange'],
    paramNames: ['Source Range (e.g., C2:E8)', 'Target Range (e.g., F2:F8)'],
    usage: 'Automatically multiplies each row in the source range',
    tips: [
        'Source range defines the data to multiply (e.g., C2:E8)',
        'Target range defines where results go (e.g., F2:F8)',
        'Number of rows must match between source and target',
        'Works with any number of columns'
    ],
    calculate: () => null // Handled in applyFormulaBatch
},

'sumByColumn': {
    name: 'Sum Each Column Separately',
    category: 'Basic Mathematics',
    excelFormula: 'SUM_BY_COLUMN',
    description: 'Sum values down rows for each column, results placed in target range',
    example: 'Sum B2:B8, C2:C8, D2:D8 → B9:D9',
    params: ['sourceRange', 'targetRange'],
    paramNames: ['Source Range (e.g., B2:D8)', 'Target Range (e.g., B9:D9)'],
    usage: 'Automatically sums each column in the source range',
    tips: [
        'Source range defines the data to sum (e.g., B2:D8)',
        'Target range defines where results go (e.g., B9:D9)',
        'Number of columns must match between source and target',
        'Works with any number of rows'
    ],
    calculate: () => null // Handled in applyFormulaBatch
},

'averageByRow': {
    name: 'Average Each Row Separately',
    category: 'Basic Mathematics',
    excelFormula: 'AVERAGE_BY_ROW',
    description: 'Calculate average across columns for each row',
    example: 'Average C2:E2, C3:E3, C4:E4 → F2:F4',
    params: ['sourceRange', 'targetRange'],
    paramNames: ['Source Range (e.g., C2:E8)', 'Target Range (e.g., F2:F8)'],
    usage: 'Automatically averages each row in the source range',
    calculate: () => null // Handled in applyFormulaBatch
},


'subtractByRow': {
    name: 'Subtract Each Row Separately',
    category: 'Basic Mathematics',
    excelFormula: 'SUBTRACT_BY_ROW',
    description: 'Subtract values across columns for each row (first - second - third - ...)',
    example: 'Subtract C2:E2, C3:E3, C4:E4 → F2:F4',
    params: ['sourceRange'],
    paramNames: ['Source Range (e.g., C2:E8)'],
    usage: 'Takes first value and subtracts all subsequent values in each row. Target range determines where results go.',
    tips: [
        'Source range defines the data (e.g., C2:E8)',
        'Target range defines where results go (e.g., F2:F8)',
        'Number of rows must match between source and target',
        'Formula: First value - Second value - Third value - ...',
        'Example: If C2=100, D2=30, E2=20, result is 100-30-20=50',
        'Each row gets: =C2-D2-E2, =C3-D3-E3, etc.'
    ],
    calculate: () => null // Handled in applyFormulaBatch
},

'divideByRow': {
    name: 'Divide Each Row Separately',
    category: 'Basic Mathematics',
    excelFormula: 'DIVIDE_BY_ROW',
    description: 'Divide values across columns for each row (first / second / third / ...)',
    example: 'Divide C2:E2, C3:E3, C4:E4 → F2:F4',
    params: ['sourceRange'],
    paramNames: ['Source Range (e.g., C2:E8)'],
    usage: 'Takes first value and divides by all subsequent values in each row. Target range determines where results go.',
    tips: [
        'Source range defines the data (e.g., C2:E8)',
        'Target range defines where results go (e.g., F2:F8)',
        'Number of rows must match between source and target',
        'Formula: First value / Second value / Third value / ...',
        'Example: If C2=100, D2=5, E2=2, result is 100/5/2=10',
        'Each row gets: =C2/D2/E2, =C3/D3/E3, etc.',
        'Will throw error if any divisor is zero'
    ],
    calculate: () => null // Handled in applyFormulaBatch
},

'maxByRow': {
    name: 'Maximum Each Row Separately',
    category: 'Statistical Analysis',
    excelFormula: 'MAX_BY_ROW',
    description: 'Find maximum value across columns for each row',
    example: 'Max of C2:E2, C3:E3, C4:E4 → F2:F4',
    params: ['sourceRange'],
    paramNames: ['Source Range (e.g., C2:E8)'],
    usage: 'Finds the largest value in each row. Target range determines where results go.',
    tips: [
        'Source range defines the data (e.g., C2:E8)',
        'Target range defines where results go (e.g., F2:F8)',
        'Number of rows must match between source and target',
        'Each row gets its own MAX formula: =MAX(C2:E2), =MAX(C3:E3), etc.',
        'Automatically ignores non-numeric values',
        'Useful for finding highest scores, prices, or values per row'
    ],
    calculate: () => null // Handled in applyFormulaBatch
},

'minByRow': {
    name: 'Minimum Each Row Separately',
    category: 'Statistical Analysis',
    excelFormula: 'MIN_BY_ROW',
    description: 'Find minimum value across columns for each row',
    example: 'Min of C2:E2, C3:E3, C4:E4 → F2:F4',
    params: ['sourceRange'],
    paramNames: ['Source Range (e.g., C2:E8)'],
    usage: 'Finds the smallest value in each row. Target range determines where results go.',
    tips: [
        'Source range defines the data (e.g., C2:E8)',
        'Target range defines where results go (e.g., F2:F8)',
        'Number of rows must match between source and target',
        'Each row gets its own MIN formula: =MIN(C2:E2), =MIN(C3:E3), etc.',
        'Automatically ignores non-numeric values',
        'Useful for finding lowest scores, prices, or values per row'
    ],
    calculate: () => null // Handled in applyFormulaBatch
},

'countByRow': {
    name: 'Count Non-Empty Cells Each Row',
    category: 'Statistical Analysis',
    excelFormula: 'COUNT_BY_ROW',
    description: 'Count non-empty cells across columns for each row',
    example: 'Count C2:E2, C3:E3, C4:E4 → F2:F4',
    params: ['sourceRange'],
    paramNames: ['Source Range (e.g., C2:E8)'],
    usage: 'Counts non-empty cells in each row. Target range determines where results go.',
    tips: [
        'Source range defines the data (e.g., C2:E8)',
        'Target range defines where results go (e.g., F2:F8)',
        'Number of rows must match between source and target',
        'Each row gets its own COUNT formula: =COUNT(C2:E2), =COUNT(C3:E3), etc.',
        'Counts cells that are not null, undefined, or empty string',
        'Useful for tracking data completeness per row'
    ],
    calculate: () => null // Handled in applyFormulaBatch
},


        // Financial Functions - EXPANDED
        'pv': {
            name: 'Present Value',
            category: 'Financial & Economic',
            excelFormula: 'PV',
            description: 'Calculate present value of future cash flows',
            example: '=PV(r,n,fv)',
            params: ['rate', 'nper', 'fv', 'pmt'],
            paramNames: ['Interest Rate per Period', 'Number of Periods', 'Future Value', 'Payment per Period (Optional)'],
            usage: 'PV = FV / (1 + r)^n + PMT × [(1 - (1 + r)^-n) / r]',
            calculate: (rate, nper, fv, pmt = 0) => {
                const r = parseFloat(rate);
                const n = parseFloat(nper);
                const fvVal = parseFloat(fv);
                const pmtVal = parseFloat(pmt) || 0;
                
                if (r === 0) return -(fvVal + pmtVal * n);
                
                const pvFromFv = fvVal / Math.pow(1 + r, n);
                const pvFromPmt = pmtVal * ((1 - Math.pow(1 + r, -n)) / r);
                return pvFromFv + pvFromPmt;
            }
        },
        'fv': {
            name: 'Future Value',
            category: 'Financial & Economic',
            excelFormula: 'FV',
            description: 'Calculate future value of investments',
            example: '=FV(rate,nper,pmt,pv)',
            params: ['rate', 'nper', 'pmt', 'pv'],
            paramNames: ['Interest Rate', 'Number of Periods', 'Payment per Period', 'Present Value'],
            usage: 'FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]',
            calculate: (rate, nper, pmt, pv) => {
                const r = parseFloat(rate);
                const n = parseFloat(nper);
                const pm = parseFloat(pmt) || 0;
                const p = parseFloat(pv) || 0;
                if (r === 0) return -(p + pm * n);
                return -(p * Math.pow(1 + r, n) + pm * ((Math.pow(1 + r, n) - 1) / r));
            }
        },
        'pmt': {
            name: 'Loan Payment',
            category: 'Financial & Economic',
            excelFormula: 'PMT',
            description: 'Calculate periodic payment for a loan',
            example: '=PMT(rate,nper,pv)',
            params: ['rate', 'nper', 'pv'],
            paramNames: ['Interest Rate per Period', 'Number of Periods', 'Present Value (Loan Amount)'],
            calculate: (rate, nper, pv) => {
                const r = parseFloat(rate);
                const n = parseFloat(nper);
                const p = parseFloat(pv);
                if (r === 0) return -p / n;
                return -(r * p) / (1 - Math.pow(1 + r, -n));
            }
        },
        'compoundInterest': {
            name: 'Compound Interest',
            category: 'Financial & Economic',
            excelFormula: 'COMPOUND_INTEREST',
            description: 'Calculate compound interest amount',
            example: '=P*(1+r/n)^(n*t)',
            params: ['principal', 'rate', 'compoundingPeriods', 'years'],
            paramNames: ['Principal Amount', 'Annual Interest Rate', 'Compounding Periods per Year', 'Number of Years'],
            usage: 'A = P × (1 + r/n)^(n×t)',
            calculate: (principal, rate, n, t) => {
                const p = parseFloat(principal);
                const r = parseFloat(rate);
                const periods = parseFloat(n);
                const years = parseFloat(t);
                return p * Math.pow(1 + (r / periods), periods * years);
            }
        },
        'earEffectiveRate': {
            name: 'Effective Annual Rate (EAR)',
            category: 'Financial & Economic',
            excelFormula: 'EAR',
            description: 'Calculate effective annual interest rate',
            example: '=(1+r/n)^n - 1',
            params: ['nominalRate', 'compoundingPeriods'],
            paramNames: ['Nominal Annual Rate', 'Compounding Periods per Year'],
            usage: 'EAR = (1 + r/n)^n - 1',
            calculate: (nominalRate, n) => {
                const r = parseFloat(nominalRate);
                const periods = parseFloat(n);
                return Math.pow(1 + (r / periods), periods) - 1;
            }
        },
        'npv': {
            name: 'Net Present Value (NPV)',
            category: 'Financial & Economic',
            excelFormula: 'NPV',
            description: 'Calculate net present value of cash flows',
            example: '=NPV(rate,cashflows)',
            params: ['rate', 'cashFlows'],
            paramNames: ['Discount Rate', 'Cash Flows (comma-separated or range)'],
            usage: 'NPV = Σ [CFt / (1 + r)^t]',
            calculate: (rate, cashFlows) => {
                const r = parseFloat(rate);
                const flows = Array.isArray(cashFlows) ? cashFlows : [cashFlows];
                let npv = 0;
                flows.forEach((cf, index) => {
                    npv += parseFloat(cf) / Math.pow(1 + r, index);
                });
                return npv;
            }
        },
        'irr': {
            name: 'Internal Rate of Return (IRR)',
            category: 'Financial & Economic',
            excelFormula: 'IRR',
            description: 'Calculate internal rate of return using Newton-Raphson method',
            example: '=IRR(cashflows)',
            params: ['cashFlows'],
            paramNames: ['Cash Flows (range or array)'],
            usage: 'IRR: Rate where NPV = 0. Uses Newton-Raphson iteration.',
            calculate: (cashFlows) => {
                const flows = Array.isArray(cashFlows) ? cashFlows.map(cf => parseFloat(cf)) : [parseFloat(cashFlows)];
                
                // Newton-Raphson method to find IRR
                let rate = 0.1; // Initial guess
                const maxIterations = 100;
                const tolerance = 1e-6;
                
                for (let i = 0; i < maxIterations; i++) {
                    let npv = 0, dnpv = 0;
                    
                    for (let t = 0; t < flows.length; t++) {
                        const pow = Math.pow(1 + rate, t);
                        npv += flows[t] / pow;
                        if (t > 0) dnpv -= t * flows[t] / Math.pow(1 + rate, t + 1);
                    }
                    
                    const newRate = rate - (npv / dnpv);
                    if (Math.abs(newRate - rate) < tolerance) return rate;
                    rate = newRate;
                }
                
                return rate;
            }
        },
        'paybackPeriod': {
            name: 'Payback Period',
            category: 'Financial & Economic',
            excelFormula: 'PAYBACK_PERIOD',
            description: 'Calculate simple payback period',
            example: '=PAYBACK_PERIOD(initialInvestment,cashflows)',
            params: ['initialInvestment', 'cashFlows'],
            paramNames: ['Initial Investment', 'Annual Cash Flows (range or array)'],
            usage: 'Payback Period = Years when Cumulative Cash Flows = Initial Investment',
            calculate: (initialInvestment, cashFlows) => {
                const investment = parseFloat(initialInvestment);
                const flows = Array.isArray(cashFlows) ? cashFlows.map(cf => parseFloat(cf)) : [parseFloat(cashFlows)];
                
                let cumulative = 0;
                for (let i = 0; i < flows.length; i++) {
                    cumulative += flows[i];
                    if (cumulative >= investment) {
                        const remaining = investment - (cumulative - flows[i]);
                        return i + (remaining / flows[i]);
                    }
                }
                return flows.length; // Not recovered within period
            }
        },
        'discountedPaybackPeriod': {
            name: 'Discounted Payback Period',
            category: 'Financial & Economic',
            excelFormula: 'DISCOUNTED_PAYBACK',
            description: 'Calculate discounted payback period',
            example: '=DISCOUNTED_PAYBACK(initialInvestment,rate,cashflows)',
            params: ['initialInvestment', 'rate', 'cashFlows'],
            paramNames: ['Initial Investment', 'Discount Rate', 'Annual Cash Flows'],
            usage: 'DPB = Years when Σ [CFt / (1 + r)^t] = Initial Investment',
            calculate: (initialInvestment, rate, cashFlows) => {
                const investment = parseFloat(initialInvestment);
                const r = parseFloat(rate);
                const flows = Array.isArray(cashFlows) ? cashFlows.map(cf => parseFloat(cf)) : [parseFloat(cashFlows)];
                
                let cumulative = 0;
                for (let i = 0; i < flows.length; i++) {
                    cumulative += flows[i] / Math.pow(1 + r, i);
                    if (cumulative >= investment) {
                        const remaining = investment - (cumulative - (flows[i] / Math.pow(1 + r, i)));
                        return i + (remaining / (flows[i] / Math.pow(1 + r, i)));
                    }
                }
                return flows.length;
            }
        },
        'currentRatio': {
            name: 'Current Ratio',
            category: 'Financial & Economic',
            excelFormula: 'CURRENT_RATIO',
            description: 'Calculate current ratio (liquidity measure)',
            example: '=CURRENT_RATIO(currentAssets,currentLiabilities)',
            params: ['currentAssets', 'currentLiabilities'],
            paramNames: ['Current Assets', 'Current Liabilities'],
            usage: 'Current Ratio = Current Assets / Current Liabilities',
            calculate: (currentAssets, currentLiabilities) => {
                return parseFloat(currentAssets) / parseFloat(currentLiabilities);
            }
        },
        'quickRatio': {
            name: 'Quick Ratio (Acid-Test)',
            category: 'Financial & Economic',
            excelFormula: 'QUICK_RATIO',
            description: 'Calculate quick ratio excluding inventory',
            example: '=QUICK_RATIO(currentAssets,inventory,currentLiabilities)',
            params: ['currentAssets', 'inventory', 'currentLiabilities'],
            paramNames: ['Current Assets', 'Inventory', 'Current Liabilities'],
            usage: 'Quick Ratio = (Current Assets - Inventory) / Current Liabilities',
            calculate: (currentAssets, inventory, currentLiabilities) => {
                return (parseFloat(currentAssets) - parseFloat(inventory)) / parseFloat(currentLiabilities);
            }
        },
        'workingCapital': {
            name: 'Working Capital',
            category: 'Financial & Economic',
            excelFormula: 'WORKING_CAPITAL',
            description: 'Calculate working capital',
            example: '=WORKING_CAPITAL(currentAssets,currentLiabilities)',
            params: ['currentAssets', 'currentLiabilities'],
            paramNames: ['Current Assets', 'Current Liabilities'],
            usage: 'Working Capital = Current Assets - Current Liabilities',
            calculate: (currentAssets, currentLiabilities) => {
                return parseFloat(currentAssets) - parseFloat(currentLiabilities);
            }
        },
        'cashConversionCycle': {
            name: 'Cash Conversion Cycle',
            category: 'Financial & Economic',
            excelFormula: 'CASH_CONVERSION_CYCLE',
            description: 'Calculate cash conversion cycle',
            example: '=CCC(dio,dro,dpo)',
            params: ['dio', 'dro', 'dpo'],
            paramNames: ['Days Inventory Outstanding', 'Days Receivable Outstanding', 'Days Payable Outstanding'],
            usage: 'CCC = DIO + DRO - DPO',
            calculate: (dio, dro, dpo) => {
                return parseFloat(dio) + parseFloat(dro) - parseFloat(dpo);
            }
        },
        'debtToEquity': {
            name: 'Debt-to-Equity Ratio',
            category: 'Financial & Economic',
            excelFormula: 'DEBT_TO_EQUITY',
            description: 'Calculate debt-to-equity ratio (leverage measure)',
            example: '=DEBT_TO_EQUITY(totalDebt,totalEquity)',
            params: ['totalDebt', 'totalEquity'],
            paramNames: ['Total Debt', 'Total Equity'],
            usage: 'D/E Ratio = Total Debt / Total Equity',
            calculate: (totalDebt, totalEquity) => {
                return parseFloat(totalDebt) / parseFloat(totalEquity);
            }
        },
        'roe': {
            name: 'Return on Equity (ROE)',
            category: 'Financial & Economic',
            excelFormula: 'ROE',
            description: 'Calculate return on equity',
            example: '=ROE(netIncome,averageEquity)',
            params: ['netIncome', 'averageEquity'],
            paramNames: ['Net Income', 'Average Shareholders\' Equity'],
            usage: 'ROE = Net Income / Average Shareholders\' Equity',
            calculate: (netIncome, averageEquity) => {
                return parseFloat(netIncome) / parseFloat(averageEquity);
            }
        },
        'roa': {
            name: 'Return on Assets (ROA)',
            category: 'Financial & Economic',
            excelFormula: 'ROA',
            description: 'Calculate return on assets',
            example: '=ROA(netIncome,averageAssets)',
            params: ['netIncome', 'averageAssets'],
            paramNames: ['Net Income', 'Average Total Assets'],
            usage: 'ROA = Net Income / Average Total Assets',
            calculate: (netIncome, averageAssets) => {
                return parseFloat(netIncome) / parseFloat(averageAssets);
            }
        },
        'grossProfitMargin': {
            name: 'Gross Profit Margin',
            category: 'Financial & Economic',
            excelFormula: 'GROSS_PROFIT_MARGIN',
            description: 'Calculate gross profit margin percentage',
            example: '=GROSS_PROFIT_MARGIN(grossProfit,revenue)',
            params: ['grossProfit', 'revenue'],
            paramNames: ['Gross Profit', 'Revenue'],
            usage: 'Gross Profit Margin = Gross Profit / Revenue',
            calculate: (grossProfit, revenue) => {
                return parseFloat(grossProfit) / parseFloat(revenue);
            }
        },
        'operatingMargin': {
            name: 'Operating Margin',
            category: 'Financial & Economic',
            excelFormula: 'OPERATING_MARGIN',
            description: 'Calculate operating margin percentage',
            example: '=OPERATING_MARGIN(operatingIncome,revenue)',
            params: ['operatingIncome', 'revenue'],
            paramNames: ['Operating Income', 'Revenue'],
            usage: 'Operating Margin = Operating Income / Revenue',
            calculate: (operatingIncome, revenue) => {
                return parseFloat(operatingIncome) / parseFloat(revenue);
            }
        },
        'netProfitMargin': {
            name: 'Net Profit Margin',
            category: 'Financial & Economic',
            excelFormula: 'NET_PROFIT_MARGIN',
            description: 'Calculate net profit margin percentage',
            example: '=NET_PROFIT_MARGIN(netIncome,revenue)',
            params: ['netIncome', 'revenue'],
            paramNames: ['Net Income', 'Revenue'],
            usage: 'Net Profit Margin = Net Income / Revenue',
            calculate: (netIncome, revenue) => {
                return parseFloat(netIncome) / parseFloat(revenue);
            }
        },
        'eps': {
            name: 'Earnings Per Share (EPS)',
            category: 'Financial & Economic',
            excelFormula: 'EPS',
            description: 'Calculate earnings per share',
            example: '=EPS(netIncome,sharesOutstanding)',
            params: ['netIncome', 'sharesOutstanding'],
            paramNames: ['Net Income', 'Weighted Average Shares Outstanding'],
            usage: 'EPS = Net Income / Weighted Average Shares Outstanding',
            calculate: (netIncome, sharesOutstanding) => {
                return parseFloat(netIncome) / parseFloat(sharesOutstanding);
            }
        },
        'peRatio': {
            name: 'Price-to-Earnings Ratio (P/E)',
            category: 'Financial & Economic',
            excelFormula: 'PE_RATIO',
            description: 'Calculate price-to-earnings ratio',
            example: '=PE_RATIO(marketPrice,eps)',
            params: ['marketPrice', 'eps'],
            paramNames: ['Market Price per Share', 'Earnings Per Share'],
            usage: 'P/E Ratio = Market Price per Share / Earnings Per Share',
            calculate: (marketPrice, eps) => {
                return parseFloat(marketPrice) / parseFloat(eps);
            }
        },
        'breakEvenUnits': {
            name: 'Break-Even Units',
            category: 'Financial & Economic',
            excelFormula: 'BREAK_EVEN_UNITS',
            description: 'Calculate break-even point in units',
            example: '=BREAK_EVEN_UNITS(fixedCosts,price,variableCost)',
            params: ['fixedCosts', 'price', 'variableCost'],
            paramNames: ['Fixed Costs', 'Price per Unit', 'Variable Cost per Unit'],
            usage: 'Break-Even Units = Fixed Costs / (Price - Variable Cost per Unit)',
            calculate: (fixedCosts, price, variableCost) => {
                return parseFloat(fixedCosts) / (parseFloat(price) - parseFloat(variableCost));
            }
        },
        'breakEvenRevenue': {
            name: 'Break-Even Revenue',
            category: 'Financial & Economic',
            excelFormula: 'BREAK_EVEN_REVENUE',
            description: 'Calculate break-even point in revenue',
            example: '=BREAK_EVEN_REVENUE(fixedCosts,contributionMarginRatio)',
            params: ['fixedCosts', 'contributionMarginRatio'],
            paramNames: ['Fixed Costs', 'Contribution Margin Ratio'],
            usage: 'Break-Even Revenue = Fixed Costs / Contribution Margin Ratio',
            calculate: (fixedCosts, cmRatio) => {
                return parseFloat(fixedCosts) / parseFloat(cmRatio);
            }
        },
        'dividendDiscountModel': {
            name: 'Dividend Discount Model',
            category: 'Financial & Economic',
            excelFormula: 'DIVIDEND_DISCOUNT_MODEL',
            description: 'Calculate stock value using dividend discount model',
            example: '=DDM(dividend,requiredReturn,growthRate)',
            params: ['dividend', 'requiredReturn', 'growthRate'],
            paramNames: ['Annual Dividend', 'Required Return', 'Perpetual Growth Rate'],
            usage: 'Value = Dividend / (Required Return - Growth Rate)',
            calculate: (dividend, requiredReturn, growthRate) => {
                const d = parseFloat(dividend);
                const r = parseFloat(requiredReturn);
                const g = parseFloat(growthRate);
                
                if (r <= g) return Infinity; // Invalid: growth rate must be less than required return
                return d / (r - g);
            }
        },
        'economicValueAdded': {
            name: 'Economic Value Added (EVA)',
            category: 'Financial & Economic',
            excelFormula: 'EVA',
            description: 'Calculate economic value added',
            example: '=EVA(nopat,wacc,investedCapital)',
            params: ['nopat', 'wacc', 'investedCapital'],
            paramNames: ['NOPAT (Net Operating Profit After Tax)', 'WACC (Weighted Average Cost of Capital)', 'Invested Capital'],
            usage: 'EVA = NOPAT - (WACC × Invested Capital)',
            calculate: (nopat, wacc, investedCapital) => {
                return parseFloat(nopat) - (parseFloat(wacc) * parseFloat(investedCapital));
            }
        },
        'amortizationPayment': {
            name: 'Amortization Payment',
            category: 'Financial & Economic',
            excelFormula: 'AMORTIZATION_PAYMENT',
            description: 'Calculate fixed amortization payment',
            example: '=AMORTIZATION_PAYMENT(principal,rate,periods)',
            params: ['principal', 'rate', 'periods'],
            paramNames: ['Principal Amount', 'Interest Rate per Period', 'Number of Periods'],
            usage: 'Payment = P × [r(1+r)^n] / [(1+r)^n - 1]',
            calculate: (principal, rate, periods) => {
                const p = parseFloat(principal);
                const r = parseFloat(rate);
                const n = parseFloat(periods);
                
                if (r === 0) return p / n;
                return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            }
        },

        
        // Economic Functions - MICROECONOMICS
        'marketEquilibriumPrice': {
            name: 'Market Equilibrium Price',
            category: 'Economics',
            excelFormula: 'EQUILIBRIUM_PRICE',
            description: 'Calculate equilibrium price where Qd = Qs',
            example: '=EQUILIBRIUM_PRICE(a,b,c,d)',
            params: ['a', 'b', 'c', 'd'],
            paramNames: ['Demand Intercept (a)', 'Demand Slope (b)', 'Supply Intercept (c)', 'Supply Slope (d)'],
            usage: 'Qd = a - bP, Qs = c + dP, Equilibrium: P = (a - c) / (b + d)',
            calculate: (a, b, c, d) => {
                return (parseFloat(a) - parseFloat(c)) / (parseFloat(b) + parseFloat(d));
            }
        },
        'marketEquilibriumQuantity': {
            name: 'Market Equilibrium Quantity',
            category: 'Economics',
            excelFormula: 'EQUILIBRIUM_QUANTITY',
            description: 'Calculate equilibrium quantity where Qd = Qs',
            example: '=EQUILIBRIUM_QUANTITY(a,b,c,d)',
            params: ['a', 'b', 'c', 'd'],
            paramNames: ['Demand Intercept (a)', 'Demand Slope (b)', 'Supply Intercept (c)', 'Supply Slope (d)'],
            usage: 'Q = a - b×P, substitute equilibrium price',
            calculate: (a, b, c, d) => {
                const price = (parseFloat(a) - parseFloat(c)) / (parseFloat(b) + parseFloat(d));
                return parseFloat(a) - parseFloat(b) * price;
            }
        },
        'priceElasticityDemand': {
            name: 'Price Elasticity of Demand',
            category: 'Economics',
            excelFormula: 'PRICE_ELASTICITY_DEMAND',
            description: 'Calculate price elasticity of demand',
            example: '=PED(percentChangeQ,percentChangeP)',
            params: ['percentChangeQuantity', 'percentChangePrice'],
            paramNames: ['% Change in Quantity', '% Change in Price'],
            usage: 'Ed = (%ΔQ / %ΔP)',
            calculate: (pctChangeQ, pctChangeP) => {
                return parseFloat(pctChangeQ) / parseFloat(pctChangeP);
            }
        },
        'priceElasticitySupply': {
            name: 'Price Elasticity of Supply',
            category: 'Economics',
            excelFormula: 'PRICE_ELASTICITY_SUPPLY',
            description: 'Calculate price elasticity of supply',
            example: '=PES(percentChangeQs,percentChangeP)',
            params: ['percentChangeQuantity', 'percentChangePrice'],
            paramNames: ['% Change in Quantity Supplied', '% Change in Price'],
            usage: 'Es = (%ΔQs / %ΔP)',
            calculate: (pctChangeQ, pctChangeP) => {
                return parseFloat(pctChangeQ) / parseFloat(pctChangeP);
            }
        },
        'crossPriceElasticity': {
            name: 'Cross-Price Elasticity',
            category: 'Economics',
            excelFormula: 'CROSS_PRICE_ELASTICITY',
            description: 'Calculate cross-price elasticity between two goods',
            example: '=CROSS_ELASTICITY(percentChangeQx,percentChangePy)',
            params: ['percentChangeQx', 'percentChangePy'],
            paramNames: ['% Change in Quantity of Good X', '% Change in Price of Good Y'],
            usage: 'Exy = (%ΔQx / %ΔPy)',
            calculate: (pctChangeQx, pctChangePy) => {
                return parseFloat(pctChangeQx) / parseFloat(pctChangePy);
            }
        },
        'incomeElasticity': {
            name: 'Income Elasticity of Demand',
            category: 'Economics',
            excelFormula: 'INCOME_ELASTICITY',
            description: 'Calculate income elasticity of demand',
            example: '=INCOME_ELASTICITY(percentChangeQ,percentChangeIncome)',
            params: ['percentChangeQuantity', 'percentChangeIncome'],
            paramNames: ['% Change in Quantity', '% Change in Income'],
            usage: 'Ei = (%ΔQ / %ΔIncome)',
            calculate: (pctChangeQ, pctChangeIncome) => {
                return parseFloat(pctChangeQ) / parseFloat(pctChangeIncome);
            }
        },
        'consumerSurplus': {
            name: 'Consumer Surplus',
            category: 'Economics',
            excelFormula: 'CONSUMER_SURPLUS',
            description: 'Calculate consumer surplus',
            example: '=CONSUMER_SURPLUS(reservationPrice,marketPrice,quantity)',
            params: ['reservationPrice', 'marketPrice', 'quantity'],
            paramNames: ['Reservation Price', 'Market Price', 'Quantity'],
            usage: 'CS = 0.5 × (Reservation Price - Market Price) × Quantity',
            calculate: (reservationPrice, marketPrice, quantity) => {
                return 0.5 * (parseFloat(reservationPrice) - parseFloat(marketPrice)) * parseFloat(quantity);
            }
        },
        'producerSurplus': {
            name: 'Producer Surplus',
            category: 'Economics',
            excelFormula: 'PRODUCER_SURPLUS',
            description: 'Calculate producer surplus',
            example: '=PRODUCER_SURPLUS(marketPrice,minSupplyPrice,quantity)',
            params: ['marketPrice', 'minSupplyPrice', 'quantity'],
            paramNames: ['Market Price', 'Minimum Supply Price', 'Quantity'],
            usage: 'PS = 0.5 × (Market Price - Minimum Supply Price) × Quantity',
            calculate: (marketPrice, minSupplyPrice, quantity) => {
                return 0.5 * (parseFloat(marketPrice) - parseFloat(minSupplyPrice)) * parseFloat(quantity);
            }
        },
        'marginalUtilityPerDollar': {
            name: 'Marginal Utility per Dollar',
            category: 'Economics',
            excelFormula: 'MU_PER_DOLLAR',
            description: 'Calculate marginal utility per dollar spent',
            example: '=MU_PER_DOLLAR(marginalUtility,price)',
            params: ['marginalUtility', 'price'],
            paramNames: ['Marginal Utility', 'Price'],
            usage: 'MU/P (for consumer optimization)',
            calculate: (mu, price) => {
                return parseFloat(mu) / parseFloat(price);
            }
        },
        'profitMaximization': {
            name: 'Profit (TR - TC)',
            category: 'Economics',
            excelFormula: 'PROFIT',
            description: 'Calculate profit from total revenue and total cost',
            example: '=PROFIT(totalRevenue,totalCost)',
            params: ['totalRevenue', 'totalCost'],
            paramNames: ['Total Revenue', 'Total Cost'],
            usage: 'Profit = Total Revenue - Total Cost',
            calculate: (tr, tc) => {
                return parseFloat(tr) - parseFloat(tc);
            }
        },
        'averageTotalCost': {
            name: 'Average Total Cost (ATC)',
            category: 'Economics',
            excelFormula: 'ATC',
            description: 'Calculate average total cost',
            example: '=ATC(totalCost,quantity)',
            params: ['totalCost', 'quantity'],
            paramNames: ['Total Cost', 'Quantity'],
            usage: 'ATC = TC / Q',
            calculate: (tc, q) => {
                return parseFloat(tc) / parseFloat(q);
            }
        },
        'marginalCost': {
            name: 'Marginal Cost (MC)',
            category: 'Economics',
            excelFormula: 'MARGINAL_COST',
            description: 'Calculate marginal cost',
            example: '=MC(changeTotalCost,changeQuantity)',
            params: ['changeTotalCost', 'changeQuantity'],
            paramNames: ['Change in Total Cost', 'Change in Quantity'],
            usage: 'MC = ΔTC / ΔQ',
            calculate: (changeTC, changeQ) => {
                return parseFloat(changeTC) / parseFloat(changeQ);
            }
        },
        'totalRevenue': {
            name: 'Total Revenue',
            category: 'Economics',
            excelFormula: 'TOTAL_REVENUE',
            description: 'Calculate total revenue',
            example: '=TOTAL_REVENUE(price,quantity)',
            params: ['price', 'quantity'],
            paramNames: ['Price', 'Quantity'],
            usage: 'TR = P × Q',
            calculate: (price, quantity) => {
                return parseFloat(price) * parseFloat(quantity);
            }
        },
        'taxIncidenceConsumer': {
            name: 'Tax Incidence (Consumer)',
            category: 'Economics',
            excelFormula: 'TAX_INCIDENCE_CONSUMER',
            description: 'Calculate consumer burden of tax',
            example: '=TAX_INCIDENCE_CONSUMER(elasticitySupply,elasticityDemand)',
            params: ['elasticitySupply', 'elasticityDemand'],
            paramNames: ['Elasticity of Supply (|Es|)', 'Elasticity of Demand (|Ed|)'],
            usage: 'Consumer Burden = |Es| / (|Ed| + |Es|)',
            calculate: (es, ed) => {
                const absEs = Math.abs(parseFloat(es));
                const absEd = Math.abs(parseFloat(ed));
                return absEs / (absEd + absEs);
            }
        },
        'deadweightLoss': {
            name: 'Deadweight Loss from Tax',
            category: 'Economics',
            excelFormula: 'DEADWEIGHT_LOSS',
            description: 'Calculate deadweight loss from taxation',
            example: '=DWL(tax,changeQuantity)',
            params: ['tax', 'changeQuantity'],
            paramNames: ['Tax Amount', 'Change in Quantity'],
            usage: 'DWL = 0.5 × Tax × ΔQuantity',
            calculate: (tax, deltaQ) => {
                return 0.5 * parseFloat(tax) * parseFloat(deltaQ);
            }
        },

        // Economic Functions - MACROECONOMICS
        'gdp': {
            name: 'Gross Domestic Product (GDP)',
            category: 'Economics',
            excelFormula: 'GDP',
            description: 'Calculate GDP using expenditure approach',
            example: '=GDP(consumption,investment,govSpending,exports,imports)',
            params: ['consumption', 'investment', 'govSpending', 'exports', 'imports'],
            paramNames: ['Consumption (C)', 'Investment (I)', 'Government Spending (G)', 'Exports (X)', 'Imports (M)'],
            usage: 'GDP = C + I + G + (X - M)',
            calculate: (c, i, g, x, m) => {
                return parseFloat(c) + parseFloat(i) + parseFloat(g) + parseFloat(x) - parseFloat(m);
            }
        },
        'realGDP': {
            name: 'Real GDP',
            category: 'Economics',
            excelFormula: 'REAL_GDP',
            description: 'Calculate real GDP adjusted for inflation',
            example: '=REAL_GDP(nominalGDP,gdpDeflator)',
            params: ['nominalGDP', 'gdpDeflator'],
            paramNames: ['Nominal GDP', 'GDP Deflator'],
            usage: 'Real GDP = (Nominal GDP / GDP Deflator) × 100',
            calculate: (nominalGDP, deflator) => {
                return (parseFloat(nominalGDP) / parseFloat(deflator)) * 100;
            }
        },
        'gdpDeflator': {
            name: 'GDP Deflator',
            category: 'Economics',
            excelFormula: 'GDP_DEFLATOR',
            description: 'Calculate GDP deflator',
            example: '=GDP_DEFLATOR(nominalGDP,realGDP)',
            params: ['nominalGDP', 'realGDP'],
            paramNames: ['Nominal GDP', 'Real GDP'],
            usage: 'GDP Deflator = (Nominal GDP / Real GDP) × 100',
            calculate: (nominalGDP, realGDP) => {
                return (parseFloat(nominalGDP) / parseFloat(realGDP)) * 100;
            }
        },
        'fiscalMultiplier': {
            name: 'Fiscal Multiplier',
            category: 'Economics',
            excelFormula: 'FISCAL_MULTIPLIER',
            description: 'Calculate fiscal spending multiplier',
            example: '=FISCAL_MULTIPLIER(mpc)',
            params: ['mpc'],
            paramNames: ['Marginal Propensity to Consume (MPC)'],
            usage: 'Multiplier = 1 / (1 - MPC)',
            calculate: (mpc) => {
                return 1 / (1 - parseFloat(mpc));
            }
        },
        'taxMultiplier': {
            name: 'Tax Multiplier',
            category: 'Economics',
            excelFormula: 'TAX_MULTIPLIER',
            description: 'Calculate tax multiplier effect',
            example: '=TAX_MULTIPLIER(mpc)',
            params: ['mpc'],
            paramNames: ['Marginal Propensity to Consume (MPC)'],
            usage: 'Tax Multiplier = -MPC / (1 - MPC)',
            calculate: (mpc) => {
                const mpcVal = parseFloat(mpc);
                return -mpcVal / (1 - mpcVal);
            }
        },
        'inflationRate': {
            name: 'Inflation Rate',
            category: 'Economics',
            excelFormula: 'INFLATION_RATE',
            description: 'Calculate inflation rate using CPI',
            example: '=INFLATION_RATE(cpi1,cpi0)',
            params: ['cpi1', 'cpi0'],
            paramNames: ['Current CPI', 'Previous CPI'],
            usage: 'Inflation Rate = ((CPI₁ - CPI₀) / CPI₀) × 100',
            calculate: (cpi1, cpi0) => {
                return ((parseFloat(cpi1) - parseFloat(cpi0)) / parseFloat(cpi0)) * 100;
            }
        },
        'unemploymentRate': {
            name: 'Unemployment Rate',
            category: 'Economics',
            excelFormula: 'UNEMPLOYMENT_RATE',
            description: 'Calculate unemployment rate',
            example: '=UNEMPLOYMENT_RATE(unemployed,laborForce)',
            params: ['unemployed', 'laborForce'],
            paramNames: ['Number Unemployed', 'Labor Force'],
            usage: 'Unemployment Rate = (Unemployed / Labor Force) × 100',
            calculate: (unemployed, laborForce) => {
                return (parseFloat(unemployed) / parseFloat(laborForce)) * 100;
            }
        },
        'moneyMultiplier': {
            name: 'Money Multiplier',
            category: 'Economics',
            excelFormula: 'MONEY_MULTIPLIER',
            description: 'Calculate money multiplier',
            example: '=MONEY_MULTIPLIER(reserveRatio)',
            params: ['reserveRatio'],
            paramNames: ['Reserve Ratio'],
            usage: 'Money Multiplier = 1 / Reserve Ratio',
            calculate: (reserveRatio) => {
                return 1 / parseFloat(reserveRatio);
            }
        },
        'quantityTheoryPrice': {
            name: 'Quantity Theory of Money (Price Level)',
            category: 'Economics',
            excelFormula: 'QTM_PRICE',
            description: 'Calculate price level using quantity theory',
            example: '=QTM_PRICE(moneySupply,velocity,realOutput)',
            params: ['moneySupply', 'velocity', 'realOutput'],
            paramNames: ['Money Supply (M)', 'Velocity (V)', 'Real Output (Y)'],
            usage: 'MV = PY, therefore P = MV / Y',
            calculate: (m, v, y) => {
                return (parseFloat(m) * parseFloat(v)) / parseFloat(y);
            }
        },
        'economicGrowthRate': {
            name: 'Economic Growth Rate',
            category: 'Economics',
            excelFormula: 'GROWTH_RATE',
            description: 'Calculate economic growth rate',
            example: '=GROWTH_RATE(gdp1,gdp0)',
            params: ['gdp1', 'gdp0'],
            paramNames: ['Current GDP', 'Previous GDP'],
            usage: 'Growth Rate = ((GDP₁ - GDP₀) / GDP₀) × 100',
            calculate: (gdp1, gdp0) => {
                return ((parseFloat(gdp1) - parseFloat(gdp0)) / parseFloat(gdp0)) * 100;
            }
        },
        'solowSteadyStateGrowth': {
            name: 'Solow Steady State Growth',
            category: 'Economics',
            excelFormula: 'SOLOW_GROWTH',
            description: 'Calculate steady state growth rate',
            example: '=SOLOW_GROWTH(populationGrowth,techProgress)',
            params: ['populationGrowth', 'techProgress'],
            paramNames: ['Population Growth Rate (n)', 'Technological Progress (g)'],
            usage: 'Steady State Growth = n + g',
            calculate: (n, g) => {
                return parseFloat(n) + parseFloat(g);
            }
        },
        'realInterestRate': {
            name: 'Real Interest Rate',
            category: 'Economics',
            excelFormula: 'REAL_INTEREST_RATE',
            description: 'Calculate real interest rate',
            example: '=REAL_INTEREST_RATE(nominalRate,inflationRate)',
            params: ['nominalRate', 'inflationRate'],
            paramNames: ['Nominal Interest Rate', 'Inflation Rate'],
            usage: 'Real Rate = Nominal Rate - Inflation Rate',
            calculate: (nominalRate, inflationRate) => {
                return parseFloat(nominalRate) - parseFloat(inflationRate);
            }
        },
        'aggregateExpenditure': {
            name: 'Aggregate Expenditure',
            category: 'Economics',
            excelFormula: 'AGGREGATE_EXPENDITURE',
            description: 'Calculate aggregate expenditure',
            example: '=AE(consumption,investment,govSpending,netExports)',
            params: ['consumption', 'investment', 'govSpending', 'netExports'],
            paramNames: ['Consumption (C)', 'Investment (I)', 'Government Spending (G)', 'Net Exports (NX)'],
            usage: 'AE = C + I + G + NX',
            calculate: (c, i, g, nx) => {
                return parseFloat(c) + parseFloat(i) + parseFloat(g) + parseFloat(nx);
            }
        },
        'exchangeRate': {
            name: 'Exchange Rate',
            category: 'Economics',
            excelFormula: 'EXCHANGE_RATE',
            description: 'Calculate exchange rate',
            example: '=EXCHANGE_RATE(domesticCurrency,foreignCurrency)',
            params: ['domesticCurrency', 'foreignCurrency'],
            paramNames: ['Domestic Currency Amount', 'Foreign Currency Amount'],
            usage: 'Exchange Rate = Domestic Currency / Foreign Currency',
            calculate: (domestic, foreign) => {
                return parseFloat(domestic) / parseFloat(foreign);
            }
        },
        'balanceOfPayments': {
            name: 'Balance of Payments',
            category: 'Economics',
            excelFormula: 'BALANCE_OF_PAYMENTS',
            description: 'Calculate balance of payments',
            example: '=BOP(currentAccount,capitalAccount,financialAccount)',
            params: ['currentAccount', 'capitalAccount', 'financialAccount'],
            paramNames: ['Current Account', 'Capital Account', 'Financial Account'],
            usage: 'BOP = Current Account + Capital Account + Financial Account',
            calculate: (current, capital, financial) => {
                return parseFloat(current) + parseFloat(capital) + parseFloat(financial);
            }
        },

        // Budget & Business

        // Budget & Business
        'budgetDifference': {
            name: 'Budget vs Actual Difference',
            category: 'Budget & Business',
            excelFormula: 'SUBTRACT',
            description: 'Calculate difference between budget and actual',
            example: '=C2-D2',
            params: ['budget', 'actual'],
            paramNames: ['Budget Amount', 'Actual Amount'],
            calculate: (budget, actual) => parseFloat(actual) - parseFloat(budget)
        },
        'budgetPercentage': {
            name: '% of Budget Used',
            category: 'Budget & Business',
            excelFormula: 'DIVIDE',
            description: 'Calculate percentage of budget used',
            example: '=D2/C2',
            params: ['actual', 'budget'],
            paramNames: ['Actual Amount', 'Budget Amount'],
            calculate: (actual, budget) => (parseFloat(actual) / parseFloat(budget))
        },
        'profitMargin': {
            name: 'Profit Margin %',
            category: 'Budget & Business',
            excelFormula: 'PROFIT_MARGIN',
            description: 'Calculate profit margin percentage',
            example: '=(Revenue-Expenses)/Revenue',
            params: ['revenue', 'expenses'],
            paramNames: ['Revenue', 'Expenses'],
            calculate: (revenue, expenses) => ((parseFloat(revenue) - parseFloat(expenses)) / parseFloat(revenue))
        },
        'breakEven': {
            name: 'Break-Even Units',
            category: 'Budget & Business',
            excelFormula: 'BREAK_EVEN',
            description: 'Calculate break-even units',
            example: '=FixedCosts/(Price-VariableCost)',
            params: ['fixedCosts', 'price', 'variableCost'],
            paramNames: ['Fixed Costs', 'Price per Unit', 'Variable Cost per Unit'],
            calculate: (fixed, price, variable) => parseFloat(fixed) / (parseFloat(price) - parseFloat(variable))
        },

        // Statistics
        'median': {
            name: 'Median Value',
            category: 'Statistics & Science',
            excelFormula: 'MEDIAN',
            description: 'Find middle value',
            example: '=MEDIAN(A1:A10)',
            params: ['range'],
            calculate: (values) => {
                const sorted = values.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v)).sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
            }
        },
        'stdev': {
            name: 'Standard Deviation',
            category: 'Statistics & Science',
            excelFormula: 'STDEV',
            description: 'Calculate standard deviation',
            example: '=STDEV(A1:A10)',
            params: ['range'],
            calculate: (values) => {
                const nums = values.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v));
                const avg = nums.reduce((sum, val) => sum + val, 0) / nums.length;
                const variance = nums.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (nums.length - 1);
                return Math.sqrt(variance);
            }
        },

        // Date & Time
        'today': {
            name: "Today's Date",
            category: 'Date & Time',
            excelFormula: 'TODAY',
            description: 'Get current date',
            example: '=TODAY()',
            params: [],
            calculate: () => new Date().toISOString().split('T')[0]
        },
        'datedif': {
            name: 'Days Between Dates',
            category: 'Date & Time',
            excelFormula: 'DATEDIF',
            description: 'Calculate days between dates',
            example: '=DATEDIF(Start,End,"d")',
            params: ['startDate', 'endDate'],
            paramNames: ['Start Date', 'End Date'],
            calculate: (start, end) => {
                const d1 = new Date(start);
                const d2 = new Date(end);
                return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
            }
        },

        // Logical
        'if': {
            name: 'IF Statement',
            category: 'Logical & Error Handling',
            excelFormula: 'IF',
            description: 'Conditional logic',
            example: '=IF(A1>100,"Yes","No")',
            params: ['condition', 'valueIfTrue', 'valueIfFalse'],
            paramNames: ['Condition', 'Value if True', 'Value if False'],
            calculate: (condition, valueTrue, valueFalse) => condition ? valueTrue : valueFalse
        },

        // Text Functions
        'concatenate': {
            name: 'Join Text',
            category: 'Text Functions',
            excelFormula: 'CONCATENATE',
            description: 'Combine text values',
            example: '=A1&" "&B1',
            params: ['text1', 'text2'],
            paramNames: ['Text 1', 'Text 2'],
            calculate: (text1, text2) => String(text1) + String(text2)
        },
        'upper': {
            name: 'Convert to Uppercase',
            category: 'Text Functions',
            excelFormula: 'UPPER',
            description: 'Convert text to uppercase',
            example: '=UPPER(A1)',
            params: ['text'],
            calculate: (text) => String(text).toUpperCase()
        },
        'lower': {
            name: 'Convert to Lowercase',
            category: 'Text Functions',
            excelFormula: 'LOWER',
            description: 'Convert text to lowercase',
            example: '=LOWER(A1)',
            params: ['text'],
            calculate: (text) => String(text).toLowerCase()
        },
        'len': {
            name: 'Text Length',
            category: 'Text Functions',
            excelFormula: 'LEN',
            description: 'Count characters in text',
            example: '=LEN(A1)',
            params: ['text'],
            calculate: (text) => String(text).length
        }
    };

    static getFormula(key) {
        return this.formulas[key];
    }

    static getAllFormulas() {
        return Object.keys(this.formulas);
    }

    static getFormulasByCategory(category) {
        return Object.entries(this.formulas)
            .filter(([_, formula]) => formula.category === category)
            .reduce((acc, [key, formula]) => {
                acc[key] = formula;
                return acc;
            }, {});
    }

    static getAllCategories() {
        return [...new Set(Object.values(this.formulas).map(f => f.category))];
    }

    static searchFormulas(query) {
        const lowerQuery = query.toLowerCase();
        return Object.entries(this.formulas)
            .filter(([key, formula]) =>
                formula.name.toLowerCase().includes(lowerQuery) ||
                formula.description.toLowerCase().includes(lowerQuery) ||
                key.toLowerCase().includes(lowerQuery)
            )
            .reduce((acc, [key, formula]) => {
                acc[key] = formula;
                return acc;
            }, {});
    }

    // Get formulas by category with metadata
    static getCategoryStats() {
        const stats = {};
        this.getAllCategories().forEach(category => {
            const formulas = this.getFormulasByCategory(category);
            stats[category] = {
                count: Object.keys(formulas).length,
                formulas: Object.keys(formulas)
            };
        });
        return stats;
    }

    // Get financial formulas specifically
    static getFinancialFormulas() {
        return this.getFormulasByCategory('Financial & Economic');
    }

    // Check if formula exists
    static formulaExists(key) {
        return this.formulas.hasOwnProperty(key);
    }
}




// Theme enum (copied from types.js)
const Theme = {
    Standard: "standard",
    Dark: "dark",
    Scientific: "scientific"
};

class GraphingCalculator {
    constructor(options) {
        this.equations = [];
        this.plotHistory = [];
        this.colors = ["rgb(255,0,0)", "rgb(0,255,0)", "rgb(0,0,255)", "rgb(255,165,0)", "rgb(128,0,128)"];
        this.colorIndex = 0;
        this.size = 480;
        this.gridSize = 20;
        this.xMin = -10;
        this.xMax = 10;
        this.yMin = -10;
        this.yMax = 10;
        this.backgroundColor = "rgb(255,255,255)";
        this.gridColor = "rgb(200,200,200)";
        this.axisColor = "rgb(0,0,0)";
        this.theme = Theme.Standard;
        this.showGrid = true;
        this.showAxes = true;
        if (options) {
            Object.assign(this, options);
        }
    }

    get width() {
        return this.size;
    }

    get height() {
        return this.size;
    }

    setTheme(theme) {
        this.theme = theme;
        if (theme === Theme.Standard) {
            this.backgroundColor = "rgb(255,255,255)";
            this.gridColor = "rgb(200,200,200)";
            this.axisColor = "rgb(0,0,0)";
        }
        else if (theme === Theme.Dark) {
            this.backgroundColor = "rgb(30,30,30)";
            this.gridColor = "rgb(70,70,70)";
            this.axisColor = "rgb(255,255,255)";
        }
        else if (theme === Theme.Scientific) {
            this.backgroundColor = "rgb(240,248,255)";
            this.gridColor = "rgb(176,196,222)";
            this.axisColor = "rgb(25,25,112)";
        }
    }

    addEquation(equation) {
        try {
            const cleanEquation = this.cleanEquation(equation);
            if (!cleanEquation)
                return false;
            this.equations.push(cleanEquation);
            const equationType = this.detectEquationType(cleanEquation);
            const color = this.colors[this.colorIndex % this.colors.length] ?? "rgb(0,0,0)";
            this.colorIndex++;
            this.plotHistory.push({
                equation: cleanEquation,
                type: equationType,
                color
            });
            return true;
        }
        catch (error) {
            console.error("Error adding equation:", error);
            return false;
        }
    }

    clearEquations() {
        this.equations = [];
        this.plotHistory = [];
        this.colorIndex = 0;
    }

    removeLastEquation() {
        if (this.equations.length > 0) {
            this.equations.pop();
            this.plotHistory.pop();
            this.colorIndex = Math.max(0, this.colorIndex - 1);
        }
    }

    cleanEquation(equation) {
        let cleaned = equation.replace(/\s/g, '');
        cleaned = cleaned.replace(/\^/g, '**');
        cleaned = cleaned.replace(/ln/g, 'log');
        cleaned = cleaned.replace(/π/g, 'pi');
        cleaned = cleaned.replace(/∞/g, 'Infinity');
        return cleaned;
    }

    detectEquationType(equation) {
        if (equation.includes('sin') || equation.includes('cos') || equation.includes('tan')) {
            return 'trigonometric';
        }
        else if (equation.includes('log') || equation.includes('ln')) {
            return 'logarithmic';
        }
        else if (equation.includes('**') && equation.includes('x**2')) {
            return 'quadratic';
        }
        else if (equation.includes('**')) {
            return 'exponential';
        }
        else if (equation.includes('abs') || equation.includes('|')) {
            return 'absolute';
        }
        else if (equation.includes('sqrt')) {
            return 'radical';
        }
        else if (equation.includes('x') && !equation.includes('**')) {
            return 'linear';
        }
        return 'constant';
    }

    screenToGraph(screenX, screenY) {
        const graphX = this.xMin + (screenX / this.size) * (this.xMax - this.xMin);
        const graphY = this.yMax - (screenY / this.size) * (this.yMax - this.yMin);
        return [graphX, graphY];
    }

    graphToScreen(graphX, graphY) {
        const screenX = ((graphX - this.xMin) / (this.xMax - this.xMin)) * this.size;
        const screenY = ((this.yMax - graphY) / (this.yMax - this.yMin)) * this.size;
        return [screenX, screenY];
    }

    async drawGraph(ctx, equationLimit) {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
        if (this.showGrid) {
            this.drawGrid(ctx);
        }
        if (this.showAxes) {
            this.drawAxes(ctx);
        }
        const limit = equationLimit !== undefined ? Math.min(equationLimit, this.equations.length) : this.equations.length;
        for (let i = 0; i < limit; i++) {
            const equation = this.equations[i];
            const historyEntry = this.plotHistory[i];
            if (equation && historyEntry) {
                await this.plotEquation(ctx, equation, historyEntry.color);
            }
        }
        return ctx;
    }

    drawGrid(ctx) {
        ctx.strokeStyle = this.gridColor;
        ctx.lineWidth = 0.5;
        const xStep = (this.xMax - this.xMin) / 20;
        const yStep = (this.yMax - this.yMin) / 20;
        for (let x = this.xMin; x <= this.xMax; x += xStep) {
            const [screenX] = this.graphToScreen(x, 0);
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, this.height);
            ctx.stroke();
        }
        for (let y = this.yMin; y <= this.yMax; y += yStep) {
            const [, screenY] = this.graphToScreen(0, y);
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(this.width, screenY);
            ctx.stroke();
        }
    }

    drawAxes(ctx) {
        ctx.strokeStyle = this.axisColor;
        ctx.lineWidth = 2;
        if (this.yMin <= 0 && this.yMax >= 0) {
            const [, yAxisScreenY] = this.graphToScreen(0, 0);
            ctx.beginPath();
            ctx.moveTo(0, yAxisScreenY);
            ctx.lineTo(this.width, yAxisScreenY);
            ctx.stroke();
        }
        if (this.xMin <= 0 && this.xMax >= 0) {
            const [xAxisScreenX] = this.graphToScreen(0, 0);
            ctx.beginPath();
            ctx.moveTo(xAxisScreenX, 0);
            ctx.lineTo(xAxisScreenX, this.height);
            ctx.stroke();
        }
        this.drawAxisLabels(ctx);
    }

    drawAxisLabels(ctx) {
        ctx.fillStyle = this.axisColor;
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const xStep = Math.ceil((this.xMax - this.xMin) / 10);
        for (let x = Math.ceil(this.xMin / xStep) * xStep; x <= this.xMax; x += xStep) {
            if (x !== 0) {
                const [screenX, yAxisScreenY] = this.graphToScreen(x, 0);
                if (screenX >= 0 && screenX <= this.width) {
                    ctx.fillText(x.toString(), screenX, Math.min(yAxisScreenY + 5, this.height - 15));
                }
            }
        }
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        const yStep = Math.ceil((this.yMax - this.yMin) / 10);
        for (let y = Math.ceil(this.yMin / yStep) * yStep; y <= this.yMax; y += yStep) {
            if (y !== 0) {
                const [xAxisScreenX, screenY] = this.graphToScreen(0, y);
                if (screenY >= 0 && screenY <= this.height) {
                    ctx.fillText(y.toString(), Math.max(xAxisScreenX - 5, 25), screenY);
                }
            }
        }
    }

    async plotEquation(ctx, equation, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const step = (this.xMax - this.xMin) / this.size;
        let firstPoint = true;
        try {
            for (let x = this.xMin; x <= this.xMax; x += step) {
                const expression = equation.replace(/y\s*=\s*/, '').replace(/x/g, x.toString());
                try {
                    const y = math.evaluate(expression);
                    if (typeof y === 'number' && isFinite(y) && y >= this.yMin && y <= this.yMax) {
                        const [screenX, screenY] = this.graphToScreen(x, y);
                        if (firstPoint) {
                            ctx.moveTo(screenX, screenY);
                            firstPoint = false;
                        }
                        else {
                            ctx.lineTo(screenX, screenY);
                        }
                    }
                    else {
                        firstPoint = true;
                    }
                }
                catch {
                    firstPoint = true;
                }
            }
            ctx.stroke();
        }
        catch (error) {
            console.error("Error plotting equation:", equation, error);
        }
    }

    async buffer(mime = "image/png", options) {
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext("2d");
        if (mime !== "image/gif") {
            const equationLimit = options?.equation !== undefined ? options.equation : this.equations.length;
            await this.drawGraph(ctx, equationLimit);
            return canvas.toBuffer(mime);
        }
        else {
            return new Promise((resolve, reject) => {
                const encoder = new GIFEncoder(this.width, this.height);
                const passThrough = new PassThrough();
                const chunks = [];
                passThrough.on("data", chunk => chunks.push(chunk));
                passThrough.on("end", () => resolve(Buffer.concat(chunks)));
                passThrough.on("error", reject);
                encoder.start();
                encoder.setRepeat(0);
                encoder.setDelay(options?.delay ?? 1000);
                encoder.createReadStream().pipe(passThrough);
                const createFrames = async () => {
                    const limit = options?.equation !== undefined ? Math.min(options.equation, this.equations.length) : this.equations.length;
                    const showProgression = options?.showProgression ?? true;
                    if (showProgression) {
                        for (let i = 0; i <= limit; i++) {
                            const tempCalc = new GraphingCalculator({
                                size: this.size,
                                xMin: this.xMin,
                                xMax: this.xMax,
                                yMin: this.yMin,
                                yMax: this.yMax,
                                backgroundColor: this.backgroundColor,
                                gridColor: this.gridColor,
                                axisColor: this.axisColor,
                                theme: this.theme,
                                showGrid: this.showGrid,
                                showAxes: this.showAxes
                            });
                            for (let j = 0; j < i; j++) {
                                const equation = this.equations[j];
                                if (equation) {
                                    tempCalc.addEquation(equation);
                                }
                            }
                            await tempCalc.drawGraph(ctx);
                            encoder.addFrame(ctx);
                        }
                    }
                    else {
                        await this.drawGraph(ctx, limit);
                        encoder.addFrame(ctx);
                    }
                };
                createFrames()
                    .then(() => encoder.finish())
                    .catch(reject);
            });
        }
    }

    getEquations() {
        return [...this.equations];
    }

    getPlotHistory() {
        return [...this.plotHistory];
    }
}


class GraphingCalculatorGame {
    constructor() {
        // Initialize graphing calculator
        this.calculator = new GraphingCalculator({
            size: 480,
            theme: Theme.Standard,
            xMin: -10,
            xMax: 10,
            yMin: -10,
            yMax: 10,
            showGrid: true,
            showAxes: true
        });
        
        // Counters and history
        this.equationCounter = 0;
        this.triangleCounter = 0;
        this.vectorCounter = 0;
        this.matrixCounter = 0;
        this.circleCounter = 0;
        this.rectangleCounter = 0;
        this.squareCounter = 0;
        this.parallelogramCounter = 0;
        this.polygonCounter = 0;
        this.ellipseCounter = 0;
        this.quadrilateralCounter = 0;
        this.cylinderCounter = 0;
        this.trapezoidCounter = 0;
        this.sphereCounter = 0;
        this.coneCounter = 0;
        this.cubeCounter = 0;
        
        this.equationHistory = [];
        this.triangleHistory = [];
        this.vectorHistory = [];
        this.matrixHistory = [];
        this.circleHistory = [];
        this.rectangleHistory = [];
        this.squareHistory = [];
        this.parallelogramHistory = [];
        this.polygonHistory = [];
        this.ellipseHistory = [];
        this.quadrilateralHistory = [];
        this.cylinderHistory = [];
        this.trapezoidHistory = [];
        this.sphereHistory = [];
        this.coneHistory = [];
        this.cubeHistory = [];

        // Vector-specific settings
        this.vectorSettings = {
            arrowSize: 12,
            arrowColor: '#ff6600',
            componentColor: '#0066ff',
            resultantColor: '#ff0000',
            showComponents: true,
            showMagnitude: true,
            showAngle: true,
            show3D: false
        };

        // Matrix-specific settings
        this.matrixSettings = {
            showGrid: true,
            showBasis: true,
            showTransformation: true,
            gridColor: '#e0e0e0',
            basisColor: '#0066ff',
            transformedColor: '#ff0000',
            pointColor: '#00aa00',
            showEigenvalues: true,
            showDeterminant: true
        };

        // Complete formula database with descriptions
        this.formulaDatabase = {
            // Basic Linear Functions
            "y=2x+3": "Linear function: slope = 2, y-intercept = 3",
            "y=x+1": "Linear function: slope = 1, y-intercept = 1",
            "y=-x+5": "Linear function: slope = -1, y-intercept = 5",
            "y=0.5x-2": "Linear function: slope = 0.5, y-intercept = -2",
            "y=3x": "Linear function through origin: slope = 3",

            // Quadratic Functions
            "y=x**2": "Basic parabola opening upward",
            "y=-x**2": "Inverted parabola opening downward",
            "y=x**2+2x+1": "Quadratic function: y = (x+1)²",
            "y=2x**2-4x+1": "Quadratic function with vertex form transformation",
            "y=-0.5x**2+3x-2": "Downward opening parabola",
            "y=(x-1)**2": "Vertex form parabola: vertex at (1,0)",
            "y=2(x-3)**2+5": "Vertex form parabola: vertex at (3,5)",

            // Cubic and Higher Polynomials
            "y=x**3": "Basic cubic function",
            "y=x**3-3x**2+2x": "Cubic polynomial with local extrema",
            "y=x**4-2x**2": "Fourth-degree polynomial (W-shaped)",

            // Exponential Functions
            "y=2**x": "Exponential growth function, base 2",
            "y=0.5**x": "Exponential decay function",
            "y=e**x": "Natural exponential function",
            "y=e**(-x)": "Negative exponential decay",
            "y=2*e**(0.5x)": "Scaled exponential growth",

            // Logarithmic Functions
            "y=log(x)": "Natural logarithm function",
            "y=log(x,2)": "Logarithm base 2",
            "y=log(x+1)": "Shifted logarithm function",
            "y=-log(x)": "Reflected logarithm function",

            // Trigonometric Functions
            "y=sin(x)": "Sine wave function",
            "y=cos(x)": "Cosine wave function",
            "y=tan(x)": "Tangent function with vertical asymptotes",
            "y=2sin(x)": "Amplitude-scaled sine function",
            "y=sin(2x)": "Frequency-doubled sine function",
            "y=sin(x-pi/2)": "Phase-shifted sine function",
            "y=sin(x)+cos(x)": "Sum of sine and cosine",

            // Inverse Trigonometric Functions
            "y=asin(x)": "Arcsine function (inverse sine)",
            "y=acos(x)": "Arccosine function (inverse cosine)",
            "y=atan(x)": "Arctangent function (inverse tangent)",

            // Absolute Value Functions
            "y=abs(x)": "Absolute value function (V-shape)",
            "y=abs(x-2)": "Shifted absolute value function",
            "y=abs(x)+abs(x-4)": "Sum of two absolute value functions",
            "y=-abs(x)+3": "Inverted and shifted absolute value",

            // Square Root Functions
            "y=sqrt(x)": "Square root function",
            "y=sqrt(x-1)": "Shifted square root function",
            "y=-sqrt(x)": "Reflected square root function",
            "y=2sqrt(x+3)": "Scaled and shifted square root",

            // Rational Functions
            "y=1/x": "Reciprocal function with vertical and horizontal asymptotes",
            "y=1/(x-1)": "Shifted reciprocal function",
            "y=(x+1)/(x-2)": "Rational function with oblique asymptote",
            "y=x**2/(x**2+1)": "Rational function approaching horizontal asymptote",

            // Piecewise and Special Functions
            "y=floor(x)": "Floor function (step function)",
            "y=ceil(x)": "Ceiling function",
            "y=sign(x)": "Sign function",
            "y=max(0,x)": "ReLU function (Rectified Linear Unit)",

            // Circle and Conic Equations (implicit forms)
            "x**2+y**2=25": "Circle with radius 5 centered at origin",
            "(x-2)**2+(y-1)**2=9": "Circle with radius 3 centered at (2,1)",

            // Complex Functions
            "y=x*sin(x)": "Product of linear and sine functions",
            "y=e**(-x)*cos(x)": "Damped cosine function",
            "y=x**2*sin(1/x)": "Rapidly oscillating function near origin",
            "y=sin(x)/x": "Sinc function",

            // Statistics and Probability
            "y=e**(-x**2/2)/sqrt(2*pi)": "Standard normal distribution",
            "y=x*e**(-x)": "Gamma distribution shape",

            // Parametric Examples (for reference)
            "x=cos(t),y=sin(t)": "Unit circle (parametric)",
            "x=t,y=t**2": "Parabola (parametric form)",

            // Polar Examples (for reference)
            "r=1": "Unit circle (polar)",
            "r=1+cos(theta)": "Cardioid (polar)",
            "r=sin(2*theta)": "Rose curve (polar)"
        };
    }

    // ==================== QUADRILATERAL METHODS ====================
    
    /**
     * Parse quadrilateral input from various formats
     */
    parseQuadrilateralInput(input) {
        // Pattern 1: quadrilateral A(x1,y1) B(x2,y2) C(x3,y3) D(x4,y4)
        const pattern1 = /quadrilateral\s*a\(([^,]+),([^)]+)\)\s*b\(([^,]+),([^)]+)\)\s*c\(([^,]+),([^)]+)\)\s*d\(([^,]+),([^)]+)\)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                A: { x: parseFloat(match1[1]), y: parseFloat(match1[2]) },
                B: { x: parseFloat(match1[3]), y: parseFloat(match1[4]) },
                C: { x: parseFloat(match1[5]), y: parseFloat(match1[6]) },
                D: { x: parseFloat(match1[7]), y: parseFloat(match1[8]) }
            };
        }

        // Pattern 2: quadrilateral (x1,y1) (x2,y2) (x3,y3) (x4,y4)
        const pattern2 = /quadrilateral\s*\(([^,]+),([^)]+)\)\s*\(([^,]+),([^)]+)\)\s*\(([^,]+),([^)]+)\)\s*\(([^,]+),([^)]+)\)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                A: { x: parseFloat(match2[1]), y: parseFloat(match2[2]) },
                B: { x: parseFloat(match2[3]), y: parseFloat(match2[4]) },
                C: { x: parseFloat(match2[5]), y: parseFloat(match2[6]) },
                D: { x: parseFloat(match2[7]), y: parseFloat(match2[8]) }
            };
        }

        return null;
    }

    /**
     * Calculate quadrilateral properties
     */
    calculateQuadrilateralProperties(A, B, C, D) {
        // Calculate side lengths
        const sideAB = this.calculateDistance(A, B);
        const sideBC = this.calculateDistance(B, C);
        const sideCD = this.calculateDistance(C, D);
        const sideDA = this.calculateDistance(D, A);

        // Calculate diagonals
        const diagonalAC = this.calculateDistance(A, C);
        const diagonalBD = this.calculateDistance(B, D);

        // Calculate area using Shoelace formula
        const area = 0.5 * Math.abs(
            (A.x * B.y - B.x * A.y) +
            (B.x * C.y - C.x * B.y) +
            (C.x * D.y - D.x * C.y) +
            (D.x * A.y - A.x * D.y)
        );

        // Calculate perimeter
        const perimeter = sideAB + sideBC + sideCD + sideDA;

        // Classify quadrilateral
        const classification = this.classifyQuadrilateral(A, B, C, D, sideAB, sideBC, sideCD, sideDA);

        return {
            vertices: { A, B, C, D },
            sides: { AB: sideAB, BC: sideBC, CD: sideCD, DA: sideDA },
            diagonals: { AC: diagonalAC, BD: diagonalBD },
            area,
            perimeter,
            classification
        };
    }

    /**
     * Classify quadrilateral type
     */
    classifyQuadrilateral(A, B, C, D, sideAB, sideBC, sideCD, sideDA) {
        const tolerance = 0.001;

        // Check for rectangle (opposite sides equal and diagonals equal)
        const oppositeSidesEqual = Math.abs(sideAB - sideCD) < tolerance && Math.abs(sideBC - sideDA) < tolerance;
        const diagonalAC = this.calculateDistance(A, C);
        const diagonalBD = this.calculateDistance(B, D);
        const diagonalsEqual = Math.abs(diagonalAC - diagonalBD) < tolerance;

        if (oppositeSidesEqual && diagonalsEqual) {
            // Check if all sides equal (square)
            if (Math.abs(sideAB - sideBC) < tolerance) {
                return "Square";
            }
            return "Rectangle";
        }

        // Check for parallelogram (opposite sides equal)
        if (oppositeSidesEqual) {
            // Check for rhombus (all sides equal)
            if (Math.abs(sideAB - sideBC) < tolerance && Math.abs(sideBC - sideCD) < tolerance) {
                return "Rhombus";
            }
            return "Parallelogram";
        }

        // Check for trapezoid (one pair of parallel sides)
        const vectorAB = { x: B.x - A.x, y: B.y - A.y };
        const vectorDC = { x: C.x - D.x, y: C.y - D.y };
        const vectorAD = { x: D.x - A.x, y: D.y - A.y };
        const vectorBC = { x: C.x - B.x, y: C.y - B.y };

        const crossABDC = vectorAB.x * vectorDC.y - vectorAB.y * vectorDC.x;
        const crossADBC = vectorAD.x * vectorBC.y - vectorAD.y * vectorBC.x;

        if (Math.abs(crossABDC) < tolerance || Math.abs(crossADBC) < tolerance) {
            return "Trapezoid";
        }

        return "General Quadrilateral";
    }

    /**
     * Add quadrilateral
     */
    addQuadrilateral(input) {
        const points = this.parseQuadrilateralInput(input);

        if (!points) {
            console.log("❌ Invalid quadrilateral format!");
            console.log("💡 Examples:");
            console.log("  • quadrilateral A(0,0) B(4,0) C(5,3) D(1,3)");
            console.log("  • quadrilateral (0,0) (4,0) (5,3) (1,3)");
            return false;
        }

        const { A, B, C, D } = points;

        if ([A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y].some(val => isNaN(val))) {
            console.log("❌ Invalid coordinates! Please use numbers only.");
            return false;
        }

        const quadProps = this.calculateQuadrilateralProperties(A, B, C, D);

        this.quadrilateralCounter++;
        this.quadrilateralHistory.push({
            id: this.quadrilateralCounter,
            input: input,
            properties: quadProps
        });

        this.displayQuadrilateralAnalysis(quadProps);
        this.saveIndividualQuadrilateral(quadProps);

        return true;
    }

    /**
     * Display quadrilateral analysis
     */
    displayQuadrilateralAnalysis(props) {
        const { vertices, sides, diagonals, area, perimeter, classification } = props;

        console.log(`\n⬢ QUADRILATERAL ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Vertices:`);
        console.log(`   A: (${vertices.A.x}, ${vertices.A.y})`);
        console.log(`   B: (${vertices.B.x}, ${vertices.B.y})`);
        console.log(`   C: (${vertices.C.x}, ${vertices.C.y})`);
        console.log(`   D: (${vertices.D.x}, ${vertices.D.y})`);

        console.log(`\n📏 Side Lengths:`);
        console.log(`   AB = ${sides.AB.toFixed(3)} units`);
        console.log(`   BC = ${sides.BC.toFixed(3)} units`);
        console.log(`   CD = ${sides.CD.toFixed(3)} units`);
        console.log(`   DA = ${sides.DA.toFixed(3)} units`);

        console.log(`\n📐 Diagonals:`);
        console.log(`   AC = ${diagonals.AC.toFixed(3)} units`);
        console.log(`   BD = ${diagonals.BD.toFixed(3)} units`);

        console.log(`\n📊 Properties:`);
        console.log(`   Area: ${area.toFixed(3)} square units`);
        console.log(`   Perimeter: ${perimeter.toFixed(3)} units`);

        console.log(`\n🏷️ Classification: ${classification}`);

        console.log("=".repeat(50));
    }

    /**
     * Save individual quadrilateral graph
     */
    async saveIndividualQuadrilateral(quadProps) {
        try {
            const buffer = await this.createQuadrilateralGraph(quadProps);
            const { vertices } = quadProps;

            const filename = `quadrilateral_${String(this.quadrilateralCounter).padStart(3, '0')}_${vertices.A.x}_${vertices.A.y}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Quadrilateral graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving quadrilateral graph:", error);
        }
    }

    /**
     * Create quadrilateral graph
     */
    async createQuadrilateralGraph(quadProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawQuadrilateral(ctx, quadProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw quadrilateral
     */
    drawQuadrilateral(ctx, quadProps) {
        const { vertices, sides, area, perimeter, classification } = quadProps;

        const screenA = this.calculator.graphToScreen(vertices.A.x, vertices.A.y);
        const screenB = this.calculator.graphToScreen(vertices.B.x, vertices.B.y);
        const screenC = this.calculator.graphToScreen(vertices.C.x, vertices.C.y);
        const screenD = this.calculator.graphToScreen(vertices.D.x, vertices.D.y);

        // Draw quadrilateral
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenA[0], screenA[1]);
        ctx.lineTo(screenB[0], screenB[1]);
        ctx.lineTo(screenC[0], screenC[1]);
        ctx.lineTo(screenD[0], screenD[1]);
        ctx.closePath();
        ctx.stroke();

        // Draw diagonals
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(screenA[0], screenA[1]);
        ctx.lineTo(screenC[0], screenC[1]);
        ctx.moveTo(screenB[0], screenB[1]);
        ctx.lineTo(screenD[0], screenD[1]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw vertices
        [screenA, screenB, screenC, screenD].forEach((screen, i) => {
            ctx.fillStyle = '#0066ff';
            ctx.beginPath();
            ctx.arc(screen[0], screen[1], 5, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Title and properties
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${classification}`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Area: ${area.toFixed(2)} sq units`,
            `Perimeter: ${perimeter.toFixed(2)} units`,
            `Sides: AB=${sides.AB.toFixed(2)}, BC=${sides.BC.toFixed(2)}`,
            `       CD=${sides.CD.toFixed(2)}, DA=${sides.DA.toFixed(2)}`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }


// ==================== TRAPEZOID METHODS ====================
    
    /**
     * Parse trapezoid input
     */
    parseTrapezoidInput(input) {
        // Pattern 1: trapezoid (x,y) base1 base2 height
        const pattern1 = /trapezoid\s*\(([^,]+),([^)]+)\)\s*([^\s]+)\s*([^\s]+)\s*([^\s]+)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                corner: { x: parseFloat(match1[1]), y: parseFloat(match1[2]) },
                base1: parseFloat(match1[3]),
                base2: parseFloat(match1[4]),
                height: parseFloat(match1[5])
            };
        }

        // Pattern 2: trapezoid x,y,base1,base2,height
        const pattern2 = /trapezoid\s*([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                corner: { x: parseFloat(match2[1]), y: parseFloat(match2[2]) },
                base1: parseFloat(match2[3]),
                base2: parseFloat(match2[4]),
                height: parseFloat(match2[5])
            };
        }

        return null;
    }

    /**
     * Calculate trapezoid properties
     */
    calculateTrapezoidProperties(corner, base1, base2, height) {
        // Area = (base1 + base2) * height / 2
        const area = (base1 + base2) * height / 2;

        // Calculate offset for trapezoid shape (centered)
        const offset = (base1 - base2) / 2;

        // Calculate vertices
        const vertices = {
            A: corner,
            B: { x: corner.x + base1, y: corner.y },
            C: { x: corner.x + base1 - offset, y: corner.y + height },
            D: { x: corner.x + offset, y: corner.y + height }
        };

        // Calculate leg lengths
        const legAD = this.calculateDistance(vertices.A, vertices.D);
        const legBC = this.calculateDistance(vertices.B, vertices.C);

        // Calculate perimeter
        const perimeter = base1 + base2 + legAD + legBC;

        // Calculate median (midsegment)
        const median = (base1 + base2) / 2;

        return {
            corner,
            base1,
            base2,
            height,
            area,
            perimeter,
            median,
            vertices,
            legs: { AD: legAD, BC: legBC }
        };
    }

    /**
     * Add trapezoid
     */
    addTrapezoid(input) {
        const trapData = this.parseTrapezoidInput(input);

        if (!trapData) {
            console.log("❌ Invalid trapezoid format!");
            console.log("💡 Examples:");
            console.log("  • trapezoid (0,0) 6 4 3");
            console.log("  • trapezoid 1,1,5,3,2");
            return false;
        }

        const { corner, base1, base2, height } = trapData;

        if (isNaN(corner.x) || isNaN(corner.y) || isNaN(base1) || isNaN(base2) || isNaN(height) ||
            base1 <= 0 || base2 <= 0 || height <= 0) {
            console.log("❌ Invalid values! All measurements must be positive.");
            return false;
        }

        const trapProps = this.calculateTrapezoidProperties(corner, base1, base2, height);

        this.trapezoidCounter++;
        this.trapezoidHistory.push({
            id: this.trapezoidCounter,
            input: input,
            properties: trapProps
        });

        this.displayTrapezoidAnalysis(trapProps);
        this.saveIndividualTrapezoid(trapProps);

        return true;
    }

    /**
     * Display trapezoid analysis
     */
    displayTrapezoidAnalysis(props) {
        const { base1, base2, height, area, perimeter, median, vertices, legs } = props;

        console.log(`\n⏢ TRAPEZOID ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Vertices:`);
        console.log(`   A: (${vertices.A.x.toFixed(2)}, ${vertices.A.y.toFixed(2)}) - Bottom-left`);
        console.log(`   B: (${vertices.B.x.toFixed(2)}, ${vertices.B.y.toFixed(2)}) - Bottom-right`);
        console.log(`   C: (${vertices.C.x.toFixed(2)}, ${vertices.C.y.toFixed(2)}) - Top-right`);
        console.log(`   D: (${vertices.D.x.toFixed(2)}, ${vertices.D.y.toFixed(2)}) - Top-left`);

        console.log(`\n📏 Measurements:`);
        console.log(`   Base 1 (bottom): ${base1.toFixed(3)} units`);
        console.log(`   Base 2 (top): ${base2.toFixed(3)} units`);
        console.log(`   Height: ${height.toFixed(3)} units`);
        console.log(`   Median (midsegment): ${median.toFixed(3)} units`);
        console.log(`   Leg AD: ${legs.AD.toFixed(3)} units`);
        console.log(`   Leg BC: ${legs.BC.toFixed(3)} units`);

        console.log(`\n📊 Properties:`);
        console.log(`   Area: ${area.toFixed(3)} square units`);
        console.log(`   Perimeter: ${perimeter.toFixed(3)} units`);
        console.log(`   Formula: Area = (b₁ + b₂) × h / 2`);

        if (Math.abs(legs.AD - legs.BC) < 0.001) {
            console.log(`\n⭐ Special: Isosceles Trapezoid (legs are equal)`);
        }

        console.log("=".repeat(50));
    }

    /**
     * Save individual trapezoid graph
     */
    async saveIndividualTrapezoid(trapProps) {
        try {
            const buffer = await this.createTrapezoidGraph(trapProps);
            const { corner, base1, base2, height } = trapProps;

            const filename = `trapezoid_${String(this.trapezoidCounter).padStart(3, '0')}_${corner.x}_${corner.y}_b1${base1}_b2${base2}_h${height}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Trapezoid graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving trapezoid graph:", error);
        }
    }

    /**
     * Create trapezoid graph
     */
    async createTrapezoidGraph(trapProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawTrapezoid(ctx, trapProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw trapezoid
     */
    drawTrapezoid(ctx, trapProps) {
        const { vertices, base1, base2, height, area, perimeter, median } = trapProps;

        const screenA = this.calculator.graphToScreen(vertices.A.x, vertices.A.y);
        const screenB = this.calculator.graphToScreen(vertices.B.x, vertices.B.y);
        const screenC = this.calculator.graphToScreen(vertices.C.x, vertices.C.y);
        const screenD = this.calculator.graphToScreen(vertices.D.x, vertices.D.y);

        // Draw trapezoid
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenA[0], screenA[1]);
        ctx.lineTo(screenB[0], screenB[1]);
        ctx.lineTo(screenC[0], screenC[1]);
        ctx.lineTo(screenD[0], screenD[1]);
        ctx.closePath();
        ctx.stroke();

        // Draw height line
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        const midX = (vertices.A.x + vertices.B.x) / 2;
        const screenMidBottom = this.calculator.graphToScreen(midX, vertices.A.y);
        const screenMidTop = this.calculator.graphToScreen(midX, vertices.D.y);
        ctx.beginPath();
        ctx.moveTo(screenMidBottom[0], screenMidBottom[1]);
        ctx.lineTo(screenMidTop[0], screenMidTop[1]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw vertices
        [screenA, screenB, screenC, screenD].forEach((screen, i) => {
            ctx.fillStyle = '#0066ff';
            ctx.beginPath();
            ctx.arc(screen[0], screen[1], 5, 0, 2 * Math.PI);
            ctx.fill();
        });


        // Title and properties
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Trapezoid`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Base 1: ${base1.toFixed(2)} units`,
            `Base 2: ${base2.toFixed(2)} units`,
            `Height: ${height.toFixed(2)} units`,
            `Median: ${median.toFixed(2)} units`,
            `Area: ${area.toFixed(2)} sq units`,
            `Perimeter: ${perimeter.toFixed(2)} units`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }

    // ==================== SPHERE METHODS ====================
    
    /**
     * Parse sphere input
     */
    parseSphereInput(input) {
        // Pattern 1: sphere center(x,y,z) radius r
        const pattern1 = /sphere\s*center\(([^,]+),([^,]+),([^)]+)\)\s*radius\s*([^\s]+)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                center: { x: parseFloat(match1[1]), y: parseFloat(match1[2]), z: parseFloat(match1[3]) },
                radius: parseFloat(match1[4])
            };
        }

        // Pattern 2: sphere (x,y,z) r
        const pattern2 = /sphere\s*\(([^,]+),([^,]+),([^)]+)\)\s*([^\s]+)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                center: { x: parseFloat(match2[1]), y: parseFloat(match2[2]), z: parseFloat(match2[3]) },
                radius: parseFloat(match2[4])
            };
        }

        // Pattern 3: sphere x,y,z,r
        const pattern3 = /sphere\s*([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match3 = input.match(pattern3);
        if (match3) {
            return {
                center: { x: parseFloat(match3[1]), y: parseFloat(match3[2]), z: parseFloat(match3[3]) },
                radius: parseFloat(match3[4])
            };
        }

        return null;
    }

    /**
     * Calculate sphere properties
     */
    calculateSphereProperties(center, radius) {
        const surfaceArea = 4 * Math.PI * radius * radius;
        const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
        const diameter = 2 * radius;

        return {
            center,
            radius,
            diameter,
            surfaceArea,
            volume
        };
    }

    /**
     * Add sphere
     */
    addSphere(input) {
        const sphereData = this.parseSphereInput(input);

        if (!sphereData) {
            console.log("❌ Invalid sphere format!");
            console.log("💡 Examples:");
            console.log("  • sphere center(0,0,0) radius 5");
            console.log("  • sphere (1,2,3) 4");
            console.log("  • sphere 0,0,0,3");
            return false;
        }

        const { center, radius } = sphereData;

        if (isNaN(center.x) || isNaN(center.y) || isNaN(center.z) || isNaN(radius) || radius <= 0) {
            console.log("❌ Invalid values! Radius must be positive.");
            return false;
        }

        const sphereProps = this.calculateSphereProperties(center, radius);

        this.sphereCounter++;
        this.sphereHistory.push({
            id: this.sphereCounter,
            input: input,
            properties: sphereProps
        });

        this.displaySphereAnalysis(sphereProps);
        this.saveIndividualSphere(sphereProps);

        return true;
    }

    /**
     * Display sphere analysis
     */
    displaySphereAnalysis(props) {
        const { center, radius, diameter, surfaceArea, volume } = props;

        console.log(`\n🌐 SPHERE ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Center: (${center.x}, ${center.y}, ${center.z})`);

        console.log(`\n📏 Measurements:`);
        console.log(`   Radius: ${radius.toFixed(3)} units`);
        console.log(`   Diameter: ${diameter.toFixed(3)} units`);
        console.log(`   Surface Area: ${surfaceArea.toFixed(3)} square units`);
        console.log(`   Volume: ${volume.toFixed(3)} cubic units`);

        console.log(`\n📊 Formulas:`);
        console.log(`   Surface Area: 4πr² = 4π(${radius.toFixed(2)})²`);
        console.log(`   Volume: (4/3)πr³ = (4/3)π(${radius.toFixed(2)})³`);

        console.log("=".repeat(50));
    }

    /**
     * Save individual sphere graph
     */
    async saveIndividualSphere(sphereProps) {
        try {
            const buffer = await this.createSphereGraph(sphereProps);
            const { center, radius } = sphereProps;

            const filename = `sphere_${String(this.sphereCounter).padStart(3, '0')}_center${center.x}_${center.y}_${center.z}_r${radius.toFixed(1)}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Sphere graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving sphere graph:", error);
        }
    }

    /**
     * Create sphere graph (2D projection)
     */
    async createSphereGraph(sphereProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawSphere(ctx, sphereProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw sphere (as 2D projection)
     */
    drawSphere(ctx, sphereProps) {
        const { center, radius, surfaceArea, volume } = sphereProps;

        // Project to 2D (XY plane)
        const screenCenter = this.calculator.graphToScreen(center.x, center.y);
        const screenRadius = Math.abs(this.calculator.graphToScreen(radius, 0)[0] - this.calculator.graphToScreen(0, 0)[0]);

        // Draw outer circle
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(screenCenter[0], screenCenter[1], screenRadius, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw ellipse to show 3D effect
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.ellipse(screenCenter[0], screenCenter[1], screenRadius, screenRadius * 0.4, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw center point
        ctx.fillStyle = '#0066ff';
        ctx.beginPath();
        ctx.arc(screenCenter[0], screenCenter[1], 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw radius line
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(screenCenter[0], screenCenter[1]);
        ctx.lineTo(screenCenter[0] + screenRadius, screenCenter[1]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Title and properties
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Sphere (3D)`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Center: (${center.x}, ${center.y}, ${center.z})`,
            `Radius: ${radius.toFixed(2)} units`,
            `Surface Area: ${surfaceArea.toFixed(2)} sq units`,
            `Volume: ${volume.toFixed(2)} cubic units`,
            `[2D projection shown]`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }

    // ==================== CYLINDER METHODS ====================
    
    /**
     * Parse cylinder input
     */
    parseCylinderInput(input) {
        // Pattern 1: cylinder center(x,y,z) radius height
        const pattern1 = /cylinder\s*center\(([^,]+),([^,]+),([^)]+)\)\s*radius\s*([^\s]+)\s*height\s*([^\s]+)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                center: { x: parseFloat(match1[1]), y: parseFloat(match1[2]), z: parseFloat(match1[3]) },
                radius: parseFloat(match1[4]),
                height: parseFloat(match1[5])
            };
        }

        // Pattern 2: cylinder (x,y,z) r h
        const pattern2 = /cylinder\s*\(([^,]+),([^,]+),([^)]+)\)\s*([^\s]+)\s*([^\s]+)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                center: { x: parseFloat(match2[1]), y: parseFloat(match2[2]), z: parseFloat(match2[3]) },
                radius: parseFloat(match2[4]),
                height: parseFloat(match2[5])
            };
        }

        // Pattern 3: cylinder x,y,z,r,h
        const pattern3 = /cylinder\s*([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match3 = input.match(pattern3);
        if (match3) {
            return {
                center: { x: parseFloat(match3[1]), y: parseFloat(match3[2]), z: parseFloat(match3[3]) },
                radius: parseFloat(match3[4]),
                height: parseFloat(match3[5])
            };
        }

        return null;
    }

    /**
     * Calculate cylinder properties
     */
    calculateCylinderProperties(center, radius, height) {
        const baseArea = Math.PI * radius * radius;
        const lateralSurfaceArea = 2 * Math.PI * radius * height;
        const totalSurfaceArea = lateralSurfaceArea + 2 * baseArea;
        const volume = baseArea * height;

        return {
            center,
            radius,
            height,
            baseArea,
            lateralSurfaceArea,
            totalSurfaceArea,
            volume
        };
    }

    /**
     * Add cylinder
     */
    addCylinder(input) {
        const cylData = this.parseCylinderInput(input);

        if (!cylData) {
            console.log("❌ Invalid cylinder format!");
            console.log("💡 Examples:");
            console.log("  • cylinder center(0,0,0) radius 3 height 5");
            console.log("  • cylinder (1,2,3) 4 6");
            console.log("  • cylinder 0,0,0,3,5");
            return false;
        }

        const { center, radius, height } = cylData;

        if (isNaN(center.x) || isNaN(center.y) || isNaN(center.z) || 
            isNaN(radius) || isNaN(height) || radius <= 0 || height <= 0) {
            console.log("❌ Invalid values! Radius and height must be positive.");
            return false;
        }

        const cylProps = this.calculateCylinderProperties(center, radius, height);

        this.cylinderCounter++;
        this.cylinderHistory.push({
            id: this.cylinderCounter,
            input: input,
            properties: cylProps
        });

        this.displayCylinderAnalysis(cylProps);
        this.saveIndividualCylinder(cylProps);

        return true;
    }

    /**
     * Display cylinder analysis
     */
    displayCylinderAnalysis(props) {
        const { center, radius, height, baseArea, lateralSurfaceArea, totalSurfaceArea, volume } = props;

        console.log(`\n🛢️ CYLINDER ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Center: (${center.x}, ${center.y}, ${center.z})`);

        console.log(`\n📏 Measurements:`);
        console.log(`   Radius: ${radius.toFixed(3)} units`);
        console.log(`   Height: ${height.toFixed(3)} units`);
        console.log(`   Base Area: ${baseArea.toFixed(3)} square units`);
        console.log(`   Lateral Surface Area: ${lateralSurfaceArea.toFixed(3)} square units`);
        console.log(`   Total Surface Area: ${totalSurfaceArea.toFixed(3)} square units`);
        console.log(`   Volume: ${volume.toFixed(3)} cubic units`);

        console.log(`\n📊 Formulas:`);
        console.log(`   Base Area: πr² = π(${radius.toFixed(2)})²`);
        console.log(`   Lateral Surface Area: 2πrh = 2π(${radius.toFixed(2)})(${height.toFixed(2)})`);
        console.log(`   Volume: πr²h = π(${radius.toFixed(2)})²(${height.toFixed(2)})`);

        console.log("=".repeat(50));
    }

    /**
     * Save individual cylinder graph
     */
    async saveIndividualCylinder(cylProps) {
        try {
            const buffer = await this.createCylinderGraph(cylProps);
            const { center, radius, height } = cylProps;

            const filename = `cylinder_${String(this.cylinderCounter).padStart(3, '0')}_center${center.x}_${center.y}_${center.z}_r${radius}_h${height}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Cylinder graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving cylinder graph:", error);
        }
    }

    /**
     * Create cylinder graph (2D projection)
     */
    async createCylinderGraph(cylProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawCylinder(ctx, cylProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw cylinder (as 2D projection)
     */
    drawCylinder(ctx, cylProps) {
        const { center, radius, height, volume, totalSurfaceArea } = cylProps;

        // Project to 2D (side view)
        const screenCenter = this.calculator.graphToScreen(center.x, center.y);
        const screenRadius = Math.abs(this.calculator.graphToScreen(radius, 0)[0] - this.calculator.graphToScreen(0, 0)[0]);
        const screenHeight = Math.abs(this.calculator.graphToScreen(0, height)[1] - this.calculator.graphToScreen(0, 0)[1]);

        // Draw top ellipse
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(screenCenter[0], screenCenter[1] - screenHeight/2, screenRadius, screenRadius * 0.3, 0, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw bottom ellipse
        ctx.beginPath();
        ctx.ellipse(screenCenter[0], screenCenter[1] + screenHeight/2, screenRadius, screenRadius * 0.3, 0, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw side lines
        ctx.beginPath();
        ctx.moveTo(screenCenter[0] - screenRadius, screenCenter[1] - screenHeight/2);
        ctx.lineTo(screenCenter[0] - screenRadius, screenCenter[1] + screenHeight/2);
        ctx.moveTo(screenCenter[0] + screenRadius, screenCenter[1] - screenHeight/2);
        ctx.lineTo(screenCenter[0] + screenRadius, screenCenter[1] + screenHeight/2);
        ctx.stroke();

        // Draw height line
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(screenCenter[0], screenCenter[1] - screenHeight/2);
        ctx.lineTo(screenCenter[0], screenCenter[1] + screenHeight/2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw center point
        ctx.fillStyle = '#0066ff';
        ctx.beginPath();
        ctx.arc(screenCenter[0], screenCenter[1], 5, 0, 2 * Math.PI);
        ctx.fill();

        // Title and properties
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Cylinder (3D)`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Center: (${center.x}, ${center.y}, ${center.z})`,
            `Radius: ${radius.toFixed(2)} units`,
            `Height: ${height.toFixed(2)} units`,
            `Surface Area: ${totalSurfaceArea.toFixed(2)} sq units`,
            `Volume: ${volume.toFixed(2)} cubic units`,
            `[2D projection shown]`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }

    // ==================== CONE METHODS ====================
    
    /**
     * Parse cone input
     */
    parseConeInput(input) {
        // Pattern 1: cone center(x,y,z) radius height
        const pattern1 = /cone\s*center\(([^,]+),([^,]+),([^)]+)\)\s*radius\s*([^\s]+)\s*height\s*([^\s]+)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                center: { x: parseFloat(match1[1]), y: parseFloat(match1[2]), z: parseFloat(match1[3]) },
                radius: parseFloat(match1[4]),
                height: parseFloat(match1[5])
            };
        }

        // Pattern 2: cone (x,y,z) r h
        const pattern2 = /cone\s*\(([^,]+),([^,]+),([^)]+)\)\s*([^\s]+)\s*([^\s]+)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                center: { x: parseFloat(match2[1]), y: parseFloat(match2[2]), z: parseFloat(match2[3]) },
                radius: parseFloat(match2[4]),
                height: parseFloat(match2[5])
            };
        }

        // Pattern 3: cone x,y,z,r,h
        const pattern3 = /cone\s*([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match3 = input.match(pattern3);
        if (match3) {
            return {
                center: { x: parseFloat(match3[1]), y: parseFloat(match3[2]), z: parseFloat(match3[3]) },
                radius: parseFloat(match3[4]),
                height: parseFloat(match3[5])
            };
        }

        return null;
    }

    /**
     * Calculate cone properties
     */
    calculateConeProperties(center, radius, height) {
        const slantHeight = Math.sqrt(radius * radius + height * height);
        const baseArea = Math.PI * radius * radius;
        const lateralSurfaceArea = Math.PI * radius * slantHeight;
        const totalSurfaceArea = baseArea + lateralSurfaceArea;
        const volume = (1/3) * baseArea * height;

        return {
            center,
            radius,
            height,
            slantHeight,
            baseArea,
            lateralSurfaceArea,
            totalSurfaceArea,
            volume
        };
    }

    /**
     * Add cone
     */
    addCone(input) {
        const coneData = this.parseConeInput(input);

        if (!coneData) {
            console.log("❌ Invalid cone format!");
            console.log("💡 Examples:");
            console.log("  • cone center(0,0,0) radius 3 height 5");
            console.log("  • cone (1,2,3) 4 6");
            console.log("  • cone 0,0,0,3,5");
            return false;
        }

        const { center, radius, height } = coneData;

        if (isNaN(center.x) || isNaN(center.y) || isNaN(center.z) || 
            isNaN(radius) || isNaN(height) || radius <= 0 || height <= 0) {
            console.log("❌ Invalid values! Radius and height must be positive.");
            return false;
        }

        const coneProps = this.calculateConeProperties(center, radius, height);

        this.coneCounter++;
        this.coneHistory.push({
            id: this.coneCounter,
            input: input,
            properties: coneProps
        });

        this.displayConeAnalysis(coneProps);
        this.saveIndividualCone(coneProps);

        return true;
    }

    /**
     * Display cone analysis
     */
    /**
     * Display cone analysis
     */
    displayConeAnalysis(props) {
        const { center, radius, height, slantHeight, baseArea, lateralSurfaceArea, totalSurfaceArea, volume } = props;

        console.log(`\n🔺 CONE ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Center (base): (${center.x}, ${center.y}, ${center.z})`);

        console.log(`\n📏 Measurements:`);
        console.log(`   Radius: ${radius.toFixed(3)} units`);
        console.log(`   Height: ${height.toFixed(3)} units`);
        console.log(`   Slant Height: ${slantHeight.toFixed(3)} units`);
        console.log(`   Base Area: ${baseArea.toFixed(3)} square units`);
        console.log(`   Lateral Surface Area: ${lateralSurfaceArea.toFixed(3)} square units`);
        console.log(`   Total Surface Area: ${totalSurfaceArea.toFixed(3)} square units`);
        console.log(`   Volume: ${volume.toFixed(3)} cubic units`);

        console.log(`\n📊 Formulas:`);
        console.log(`   Slant Height: l = √(r² + h²) = √(${radius.toFixed(2)}² + ${height.toFixed(2)}²)`);
        console.log(`   Volume: (1/3)πr²h = (1/3)π(${radius.toFixed(2)})²(${height.toFixed(2)})`);
        console.log(`   Lateral Surface Area: πrl = π(${radius.toFixed(2)})(${slantHeight.toFixed(2)})`);

        console.log("=".repeat(50));
    }

    /**
     * Save individual cone graph
     */
    async saveIndividualCone(coneProps) {
        try {
            const buffer = await this.createConeGraph(coneProps);
            const { center, radius, height } = coneProps;

            const filename = `cone_${String(this.coneCounter).padStart(3, '0')}_center${center.x}_${center.y}_${center.z}_r${radius}_h${height}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Cone graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving cone graph:", error);
        }
    }

    /**
     * Create cone graph (2D projection)
     */
    async createConeGraph(coneProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawCone(ctx, coneProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw cone (as 2D projection)
     */
    drawCone(ctx, coneProps) {
        const { center, radius, height, slantHeight, volume, totalSurfaceArea } = coneProps;

        // Project to 2D (side view)
        const screenCenter = this.calculator.graphToScreen(center.x, center.y);
        const screenRadius = Math.abs(this.calculator.graphToScreen(radius, 0)[0] - this.calculator.graphToScreen(0, 0)[0]);
        const screenHeight = Math.abs(this.calculator.graphToScreen(0, height)[1] - this.calculator.graphToScreen(0, 0)[1]);

        // Draw base ellipse
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(screenCenter[0], screenCenter[1] + screenHeight/2, screenRadius, screenRadius * 0.3, 0, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw cone sides
        ctx.beginPath();
        ctx.moveTo(screenCenter[0] - screenRadius, screenCenter[1] + screenHeight/2);
        ctx.lineTo(screenCenter[0], screenCenter[1] - screenHeight/2);
        ctx.lineTo(screenCenter[0] + screenRadius, screenCenter[1] + screenHeight/2);
        ctx.stroke();

        // Draw height line
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(screenCenter[0], screenCenter[1] - screenHeight/2);
        ctx.lineTo(screenCenter[0], screenCenter[1] + screenHeight/2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw apex point
        ctx.fillStyle = '#0066ff';
        ctx.beginPath();
        ctx.arc(screenCenter[0], screenCenter[1] - screenHeight/2, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw base center
        ctx.beginPath();
        ctx.arc(screenCenter[0], screenCenter[1] + screenHeight/2, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Title and properties
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Cone (3D)`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Center: (${center.x}, ${center.y}, ${center.z})`,
            `Radius: ${radius.toFixed(2)} units`,
            `Height: ${height.toFixed(2)} units`,
            `Slant Height: ${slantHeight.toFixed(2)} units`,
            `Surface Area: ${totalSurfaceArea.toFixed(2)} sq units`,
            `Volume: ${volume.toFixed(2)} cubic units`,
            `[2D projection shown]`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }

    // ==================== CUBE METHODS ====================
    
    /**
     * Parse cube input
     */
    parseCubeInput(input) {
        // Pattern 1: cube (x,y,z) side
        const pattern1 = /cube\s*\(([^,]+),([^,]+),([^)]+)\)\s*([^\s]+)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                corner: { x: parseFloat(match1[1]), y: parseFloat(match1[2]), z: parseFloat(match1[3]) },
                side: parseFloat(match1[4])
            };
        }

        // Pattern 2: cube x,y,z,side
        const pattern2 = /cube\s*([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                corner: { x: parseFloat(match2[1]), y: parseFloat(match2[2]), z: parseFloat(match2[3]) },
                side: parseFloat(match2[4])
            };
        }

        return null;
    }

    /**
     * Calculate cube properties
     */
    calculateCubeProperties(corner, side) {
        const surfaceArea = 6 * side * side;
        const volume = side * side * side;
        const spaceDiagonal = side * Math.sqrt(3);
        const faceDiagonal = side * Math.sqrt(2);

        return {
            corner,
            side,
            surfaceArea,
            volume,
            spaceDiagonal,
            faceDiagonal
        };
    }

    
    addCube(input) {
        const cubeData = this.parseCubeInput(input);

        if (!cubeData) {
            console.log("❌ Invalid cube format!");
            console.log("💡 Examples:");
            console.log("  • cube (0,0,0) 4");
            console.log("  • cube 1,1,1,3");
            return false;
        }

        const { corner, side } = cubeData;

        if (isNaN(corner.x) || isNaN(corner.y) || isNaN(corner.z) || isNaN(side) || side <= 0) {
            console.log("❌ Invalid values! Side must be positive.");
            return false;
        }

        const cubeProps = this.calculateCubeProperties(corner, side);

        this.cubeCounter++;
        this.cubeHistory.push({
            id: this.cubeCounter,
            input: input,
            properties: cubeProps
        });

        this.displayCubeAnalysis(cubeProps);
        this.saveIndividualCube(cubeProps);

        return true;
    }

    /**
     * Display cube analysis
     */
    displayCubeAnalysis(props) {
        const { corner, side, surfaceArea, volume, spaceDiagonal, faceDiagonal } = props;

        console.log(`\n🧊 CUBE ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Corner: (${corner.x}, ${corner.y}, ${corner.z})`);

        console.log(`\n📏 Measurements:`);
        console.log(`   Side: ${side.toFixed(3)} units`);
        console.log(`   Face Diagonal: ${faceDiagonal.toFixed(3)} units (${side.toFixed(2)}√2)`);
        console.log(`   Space Diagonal: ${spaceDiagonal.toFixed(3)} units (${side.toFixed(2)}√3)`);
        console.log(`   Surface Area: ${surfaceArea.toFixed(3)} square units`);
        console.log(`   Volume: ${volume.toFixed(3)} cubic units`);

        console.log(`\n📊 Properties:`);
        console.log(`   6 square faces`);
        console.log(`   12 edges (all equal)`);
        console.log(`   8 vertices`);
        console.log(`   All angles are 90°`);

        console.log(`\n📐 Formulas:`);
        console.log(`   Surface Area: 6s² = 6(${side.toFixed(2)})²`);
        console.log(`   Volume: s³ = (${side.toFixed(2)})³`);

        console.log("=".repeat(50));
    }

    /**
     * Save individual cube graph
     */
    async saveIndividualCube(cubeProps) {
        try {
            const buffer = await this.createCubeGraph(cubeProps);
            const { corner, side } = cubeProps;

            const filename = `cube_${String(this.cubeCounter).padStart(3, '0')}_corner${corner.x}_${corner.y}_${corner.z}_side${side}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Cube graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving cube graph:", error);
        }
    }

    /**
     * Create cube graph (isometric projection)
     */
    async createCubeGraph(cubeProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawCube(ctx, cubeProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw cube (as isometric projection)
     */
    drawCube(ctx, cubeProps) {
        const { corner, side, surfaceArea, volume, spaceDiagonal } = cubeProps;

        // Project to 2D (isometric view)
        const screenCorner = this.calculator.graphToScreen(corner.x, corner.y);
        const screenSide = Math.abs(this.calculator.graphToScreen(side, 0)[0] - this.calculator.graphToScreen(0, 0)[0]);

        // Isometric projection angles
        const isoX = screenSide * Math.cos(Math.PI / 6);
        const isoY = screenSide * Math.sin(Math.PI / 6);
        const isoZ = screenSide;

        // Calculate 8 vertices of the cube in isometric projection
        const x = screenCorner[0];
        const y = screenCorner[1];

        const vertices = {
            // Front face (bottom)
            v1: [x, y],
            v2: [x + isoX, y - isoY],
            v3: [x + isoX, y - isoY - isoZ],
            v4: [x, y - isoZ],
            // Back face (top)
            v5: [x - isoX, y - isoY],
            v6: [x, y - 2 * isoY],
            v7: [x, y - 2 * isoY - isoZ],
            v8: [x - isoX, y - isoY - isoZ]
        };

        // Draw cube edges
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;

        // Front face
        ctx.beginPath();
        ctx.moveTo(vertices.v1[0], vertices.v1[1]);
        ctx.lineTo(vertices.v2[0], vertices.v2[1]);
        ctx.lineTo(vertices.v3[0], vertices.v3[1]);
        ctx.lineTo(vertices.v4[0], vertices.v4[1]);
        ctx.closePath();
        ctx.stroke();

        // Back face
        ctx.beginPath();
        ctx.moveTo(vertices.v5[0], vertices.v5[1]);
        ctx.lineTo(vertices.v6[0], vertices.v6[1]);
        ctx.lineTo(vertices.v7[0], vertices.v7[1]);
        ctx.lineTo(vertices.v8[0], vertices.v8[1]);
        ctx.closePath();
        ctx.stroke();

        // Connecting edges
        ctx.beginPath();
        ctx.moveTo(vertices.v1[0], vertices.v1[1]);
        ctx.lineTo(vertices.v5[0], vertices.v5[1]);
        ctx.moveTo(vertices.v2[0], vertices.v2[1]);
        ctx.lineTo(vertices.v6[0], vertices.v6[1]);
        ctx.moveTo(vertices.v3[0], vertices.v3[1]);
        ctx.lineTo(vertices.v7[0], vertices.v7[1]);
        ctx.moveTo(vertices.v4[0], vertices.v4[1]);
        ctx.lineTo(vertices.v8[0], vertices.v8[1]);
        ctx.stroke();

        // Draw vertices
        Object.values(vertices).forEach(v => {
            ctx.fillStyle = '#0066ff';
            ctx.beginPath();
            ctx.arc(v[0], v[1], 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Title and properties
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Cube (3D)`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Corner: (${corner.x}, ${corner.y}, ${corner.z})`,
            `Side: ${side.toFixed(2)} units`,
            `Space Diagonal: ${spaceDiagonal.toFixed(2)} units`,
            `Surface Area: ${surfaceArea.toFixed(2)} sq units`,
            `Volume: ${volume.toFixed(2)} cubic units`,
            `[Isometric projection shown]`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }


    // ==================== CIRCLE METHODS ====================
    
    /**
     * Parse circle input from various formats
     */
    parseCircleInput(input) {
        const cleanInput = input.replace(/\s/g, '').toLowerCase();

        // Pattern 1: circle center(x,y) radius r
        const pattern1 = /circle\s*center\(([^,]+),([^)]+)\)\s*radius\s*([^\s]+)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                center: { x: parseFloat(match1[1]), y: parseFloat(match1[2]) },
                radius: parseFloat(match1[3])
            };
        }

        // Pattern 2: circle (x,y) r
        const pattern2 = /circle\s*\(([^,]+),([^)]+)\)\s*([^\s]+)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                center: { x: parseFloat(match2[1]), y: parseFloat(match2[2]) },
                radius: parseFloat(match2[3])
            };
        }

        // Pattern 3: circle x,y,r
        const pattern3 = /circle\s*([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match3 = input.match(pattern3);
        if (match3) {
            return {
                center: { x: parseFloat(match3[1]), y: parseFloat(match3[2]) },
                radius: parseFloat(match3[3])
            };
        }

        // Pattern 4: circle diameter d at (x,y)
        const pattern4 = /circle\s*diameter\s*([^\s]+)\s*at\s*\(([^,]+),([^)]+)\)/i;
        const match4 = input.match(pattern4);
        if (match4) {
            return {
                center: { x: parseFloat(match4[2]), y: parseFloat(match4[3]) },
                radius: parseFloat(match4[1]) / 2,
                isDiameter: true
            };
        }

        return null;
    }

    /**
     * Calculate circle properties
     */
    calculateCircleProperties(center, radius) {
        const area = Math.PI * radius * radius;
        const circumference = 2 * Math.PI * radius;
        const diameter = 2 * radius;

        return {
            center,
            radius,
            diameter,
            area,
            circumference
        };
    }

    /**
     * Add circle to the calculator
     */
    addCircle(input) {
        const circleData = this.parseCircleInput(input);

        if (!circleData) {
            console.log("❌ Invalid circle format!");
            console.log("💡 Examples:");
            console.log("  • circle center(0,0) radius 5");
            console.log("  • circle (2,3) 4");
            console.log("  • circle 0,0,3");
            console.log("  • circle diameter 10 at (1,1)");
            return false;
        }

        const { center, radius } = circleData;

        if (isNaN(center.x) || isNaN(center.y) || isNaN(radius) || radius <= 0) {
            console.log("❌ Invalid values! Radius must be positive.");
            return false;
        }

        const circleProps = this.calculateCircleProperties(center, radius);

        this.circleCounter++;
        this.circleHistory.push({
            id: this.circleCounter,
            input: input,
            properties: circleProps
        });

        this.displayCircleAnalysis(circleProps);
        this.saveIndividualCircle(circleProps);

        return true;
    }

    /**
     * Display circle analysis
     */
    displayCircleAnalysis(props) {
        const { center, radius, diameter, area, circumference } = props;

        console.log(`\n⭕ CIRCLE ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Center: (${center.x}, ${center.y})`);
        console.log(`\n📏 Measurements:`);
        console.log(`   Radius: ${radius.toFixed(3)} units`);
        console.log(`   Diameter: ${diameter.toFixed(3)} units`);
        console.log(`   Area: ${area.toFixed(3)} square units`);
        console.log(`   Circumference: ${circumference.toFixed(3)} units`);

        console.log(`\n📊 Properties:`);
        console.log(`   Area formula: πr² = π(${radius.toFixed(2)})²`);
        console.log(`   Circumference formula: 2πr = 2π(${radius.toFixed(2)})`);

        console.log("=".repeat(50));
    }

    /**
     * Save individual circle graph
     */
    async saveIndividualCircle(circleProps) {
        try {
            const buffer = await this.createCircleGraph(circleProps);
            const { center, radius } = circleProps;

            const filename = `circle_${String(this.circleCounter).padStart(3, '0')}_center${center.x}_${center.y}_r${radius.toFixed(1)}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Circle graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving circle graph:", error);
        }
    }

    /**
     * Create circle graph
     */
    async createCircleGraph(circleProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawCircle(ctx, circleProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw circle with annotations
     */
    drawCircle(ctx, circleProps) {
        const { center, radius, area, circumference } = circleProps;

        const screenCenter = this.calculator.graphToScreen(center.x, center.y);
        const screenRadius = Math.abs(this.calculator.graphToScreen(radius, 0)[0] - this.calculator.graphToScreen(0, 0)[0]);

        // Draw circle
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(screenCenter[0], screenCenter[1], screenRadius, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw center point
        ctx.fillStyle = '#0066ff';
        ctx.beginPath();
        ctx.arc(screenCenter[0], screenCenter[1], 6, 0, 2 * Math.PI);
        ctx.fill();

        // Draw radius line
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(screenCenter[0], screenCenter[1]);
        ctx.lineTo(screenCenter[0] + screenRadius, screenCenter[1]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Labels
        ctx.fillStyle = 'black';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Center (${center.x}, ${center.y})`, screenCenter[0], screenCenter[1] - 15);
        ctx.fillText(`r = ${radius.toFixed(2)}`, screenCenter[0] + screenRadius / 2, screenCenter[1] - 10);

        // Title and properties
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Circle`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Center: (${center.x}, ${center.y})`,
            `Radius: ${radius.toFixed(2)} units`,
            `Area: ${area.toFixed(2)} sq units`,
            `Circumference: ${circumference.toFixed(2)} units`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }

    // ==================== RECTANGLE METHODS ====================
    
    /**
     * Parse rectangle input
     */
    parseRectangleInput(input) {
        // Pattern 1: rectangle (x,y) length width
        const pattern1 = /rectangle\s*\(([^,]+),([^)]+)\)\s*([^\s]+)\s*([^\s]+)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                corner: { x: parseFloat(match1[1]), y: parseFloat(match1[2]) },
                length: parseFloat(match1[3]),
                width: parseFloat(match1[4])
            };
        }

        // Pattern 2: rectangle x,y,length,width
        const pattern2 = /rectangle\s*([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                corner: { x: parseFloat(match2[1]), y: parseFloat(match2[2]) },
                length: parseFloat(match2[3]),
                width: parseFloat(match2[4])
            };
        }

        return null;
    }

    /**
     * Calculate rectangle properties
     */
    calculateRectangleProperties(corner, length, width) {
        const area = length * width;
        const perimeter = 2 * (length + width);
        const diagonal = Math.sqrt(length * length + width * width);

        return {
            corner,
            length,
            width,
            area,
            perimeter,
            diagonal,
            vertices: {
                A: corner,
                B: { x: corner.x + length, y: corner.y },
                C: { x: corner.x + length, y: corner.y + width },
                D: { x: corner.x, y: corner.y + width }
            }
        };
    }

    /**
     * Add rectangle
     */
    addRectangle(input) {
        const rectData = this.parseRectangleInput(input);

        if (!rectData) {
            console.log("❌ Invalid rectangle format!");
            console.log("💡 Examples:");
            console.log("  • rectangle (0,0) 4 3");
            console.log("  • rectangle 1,1,5,2");
            return false;
        }

        const { corner, length, width } = rectData;

        if (isNaN(corner.x) || isNaN(corner.y) || isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
            console.log("❌ Invalid values! Length and width must be positive.");
            return false;
        }

        const rectProps = this.calculateRectangleProperties(corner, length, width);

        this.rectangleCounter++;
        this.rectangleHistory.push({
            id: this.rectangleCounter,
            input: input,
            properties: rectProps
        });

        this.displayRectangleAnalysis(rectProps);
        this.saveIndividualRectangle(rectProps);

        return true;
    }

    /**
     * Display rectangle analysis
     */
    displayRectangleAnalysis(props) {
        const { corner, length, width, area, perimeter, diagonal, vertices } = props;

        console.log(`\n▭ RECTANGLE ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Vertices:`);
        console.log(`   A: (${vertices.A.x}, ${vertices.A.y}) - Bottom-left`);
        console.log(`   B: (${vertices.B.x}, ${vertices.B.y}) - Bottom-right`);
        console.log(`   C: (${vertices.C.x}, ${vertices.C.y}) - Top-right`);
        console.log(`   D: (${vertices.D.x}, ${vertices.D.y}) - Top-left`);

        console.log(`\n📏 Measurements:`);
        console.log(`   Length: ${length.toFixed(3)} units`);
        console.log(`   Width: ${width.toFixed(3)} units`);
        console.log(`   Diagonal: ${diagonal.toFixed(3)} units`);
        console.log(`   Area: ${area.toFixed(3)} square units`);
        console.log(`   Perimeter: ${perimeter.toFixed(3)} units`);

        console.log(`\n📊 Properties:`);
        console.log(`   All angles: 90°`);
        console.log(`   Opposite sides equal`);
        if (Math.abs(length - width) < 0.001) {
            console.log(`   ⭐ Special: This is a SQUARE!`);
        }

        console.log("=".repeat(50));
    }

    /**
     * Save individual rectangle graph
     */
    async saveIndividualRectangle(rectProps) {
        try {
            const buffer = await this.createRectangleGraph(rectProps);
            const { corner, length, width } = rectProps;

            const filename = `rectangle_${String(this.rectangleCounter).padStart(3, '0')}_${corner.x}_${corner.y}_${length}x${width}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Rectangle graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving rectangle graph:", error);
        }
    }

    /**
     * Create rectangle graph
     */
    async createRectangleGraph(rectProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawRectangle(ctx, rectProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw rectangle
     */
    drawRectangle(ctx, rectProps) {
        const { vertices, length, width, area, perimeter, diagonal } = rectProps;

        const screenA = this.calculator.graphToScreen(vertices.A.x, vertices.A.y);
        const screenB = this.calculator.graphToScreen(vertices.B.x, vertices.B.y);
        const screenC = this.calculator.graphToScreen(vertices.C.x, vertices.C.y);
        const screenD = this.calculator.graphToScreen(vertices.D.x, vertices.D.y);

        // Draw rectangle
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenA[0], screenA[1]);
        ctx.lineTo(screenB[0], screenB[1]);
        ctx.lineTo(screenC[0], screenC[1]);
        ctx.lineTo(screenD[0], screenD[1]);
        ctx.closePath();
        ctx.stroke();

        // Draw diagonal
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(screenA[0], screenA[1]);
        ctx.lineTo(screenC[0], screenC[1]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw vertices
        [screenA, screenB, screenC, screenD].forEach((screen, i) => {
            ctx.fillStyle = '#0066ff';
            ctx.beginPath();
            ctx.arc(screen[0], screen[1], 5, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Title and properties
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Rectangle`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Length: ${length.toFixed(2)} units`,
            `Width: ${width.toFixed(2)} units`,
            `Diagonal: ${diagonal.toFixed(2)} units`,
            `Area: ${area.toFixed(2)} sq units`,
            `Perimeter: ${perimeter.toFixed(2)} units`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }

// ==================== SQUARE METHODS ====================
    
    /**
     * Parse square input
     */
    parseSquareInput(input) {
        // Pattern 1: square (x,y) side
        const pattern1 = /square\s*\(([^,]+),([^)]+)\)\s*([^\s]+)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                corner: { x: parseFloat(match1[1]), y: parseFloat(match1[2]) },
                side: parseFloat(match1[3])
            };
        }

        // Pattern 2: square x,y,side
        const pattern2 = /square\s*([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                corner: { x: parseFloat(match2[1]), y: parseFloat(match2[2]) },
                side: parseFloat(match2[3])
            };
        }

        return null;
    }

    /**
     * Calculate square properties
     */
    calculateSquareProperties(corner, side) {
        const area = side * side;
        const perimeter = 4 * side;
        const diagonal = side * Math.sqrt(2);

        return {
            corner,
            side,
            area,
            perimeter,
            diagonal,
            vertices: {
                A: corner,
                B: { x: corner.x + side, y: corner.y },
                C: { x: corner.x + side, y: corner.y + side },
                D: { x: corner.x, y: corner.y + side }
            }
        };
    }

    /**
     * Add square
     */
    addSquare(input) {
        const squareData = this.parseSquareInput(input);

        if (!squareData) {
            console.log("❌ Invalid square format!");
            console.log("💡 Examples:");
            console.log("  • square (0,0) 4");
            console.log("  • square 1,1,3");
            return false;
        }

        const { corner, side } = squareData;

        if (isNaN(corner.x) || isNaN(corner.y) || isNaN(side) || side <= 0) {
            console.log("❌ Invalid values! Side must be positive.");
            return false;
        }

        const squareProps = this.calculateSquareProperties(corner, side);

        this.squareCounter++;
        this.squareHistory.push({
            id: this.squareCounter,
            input: input,
            properties: squareProps
        });

        this.displaySquareAnalysis(squareProps);
        this.saveIndividualSquare(squareProps);

        return true;
    }

    /**
     * Display square analysis
     */
    displaySquareAnalysis(props) {
        const { corner, side, area, perimeter, diagonal, vertices } = props;

        console.log(`\n▢ SQUARE ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Vertices:`);
        console.log(`   A: (${vertices.A.x}, ${vertices.A.y}) - Bottom-left`);
        console.log(`   B: (${vertices.B.x}, ${vertices.B.y}) - Bottom-right`);
        console.log(`   C: (${vertices.C.x}, ${vertices.C.y}) - Top-right`);
        console.log(`   D: (${vertices.D.x}, ${vertices.D.y}) - Top-left`);

        console.log(`\n📏 Measurements:`);
        console.log(`   Side: ${side.toFixed(3)} units`);
        console.log(`   Diagonal: ${diagonal.toFixed(3)} units (${side.toFixed(2)}√2)`);
        console.log(`   Area: ${area.toFixed(3)} square units`);
        console.log(`   Perimeter: ${perimeter.toFixed(3)} units`);

        console.log(`\n📊 Properties:`);
        console.log(`   All angles: 90°`);
        console.log(`   All sides equal`);
        console.log(`   Diagonals bisect at 90°`);

        console.log("=".repeat(50));
    }

    /**
     * Save individual square graph
     */
    async saveIndividualSquare(squareProps) {
        try {
            const buffer = await this.createSquareGraph(squareProps);
            const { corner, side } = squareProps;

            const filename = `square_${String(this.squareCounter).padStart(3, '0')}_${corner.x}_${corner.y}_side${side}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Square graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving square graph:", error);
        }
    }

    /**
     * Create square graph
     */
    async createSquareGraph(squareProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawSquare(ctx, squareProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw square
     */
    drawSquare(ctx, squareProps) {
        const { vertices, side, area, perimeter, diagonal } = squareProps;

        const screenA = this.calculator.graphToScreen(vertices.A.x, vertices.A.y);
        const screenB = this.calculator.graphToScreen(vertices.B.x, vertices.B.y);
        const screenC = this.calculator.graphToScreen(vertices.C.x, vertices.C.y);
        const screenD = this.calculator.graphToScreen(vertices.D.x, vertices.D.y);

        // Draw square
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenA[0], screenA[1]);
        ctx.lineTo(screenB[0], screenB[1]);
        ctx.lineTo(screenC[0], screenC[1]);
        ctx.lineTo(screenD[0], screenD[1]);
        ctx.closePath();
        ctx.stroke();

        // Draw diagonals
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(screenA[0], screenA[1]);
        ctx.lineTo(screenC[0], screenC[1]);
        ctx.moveTo(screenB[0], screenB[1]);
        ctx.lineTo(screenD[0], screenD[1]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw vertices
        [screenA, screenB, screenC, screenD].forEach((screen, i) => {
            ctx.fillStyle = '#0066ff';
            ctx.beginPath();
            ctx.arc(screen[0], screen[1], 5, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Title and properties
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Square`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Side: ${side.toFixed(2)} units`,
            `Diagonal: ${diagonal.toFixed(2)} units`,
            `Area: ${area.toFixed(2)} sq units`,
            `Perimeter: ${perimeter.toFixed(2)} units`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }

    // ==================== PARALLELOGRAM METHODS ====================
    
    /**
     * Parse parallelogram input
     */
    parseParallelogramInput(input) {
        // Pattern 1: parallelogram (x,y) base side height
        const pattern1 = /parallelogram\s*\(([^,]+),([^)]+)\)\s*([^\s]+)\s*([^\s]+)\s*([^\s]+)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                corner: { x: parseFloat(match1[1]), y: parseFloat(match1[2]) },
                base: parseFloat(match1[3]),
                side: parseFloat(match1[4]),
                height: parseFloat(match1[5])
            };
        }

        // Pattern 2: parallelogram x,y,base,side,height
        const pattern2 = /parallelogram\s*([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                corner: { x: parseFloat(match2[1]), y: parseFloat(match2[2]) },
                base: parseFloat(match2[3]),
                side: parseFloat(match2[4]),
                height: parseFloat(match2[5])
            };
        }

        return null;
    }

    /**
     * Calculate parallelogram properties
     */
    calculateParallelogramProperties(corner, base, side, height) {
        const area = base * height;
        const perimeter = 2 * (base + side);
        
        // Calculate angle using height and side
        const angle = Math.asin(height / side) * (180 / Math.PI);
        const complementaryAngle = 180 - angle;

        // Calculate offset for parallelogram shape
        const offset = Math.sqrt(side * side - height * height);

        return {
            corner,
            base,
            side,
            height,
            area,
            perimeter,
            angles: {
                acute: angle,
                obtuse: complementaryAngle
            },
            vertices: {
                A: corner,
                B: { x: corner.x + base, y: corner.y },
                C: { x: corner.x + base + offset, y: corner.y + height },
                D: { x: corner.x + offset, y: corner.y + height }
            }
        };
    }

    /**
     * Add parallelogram
     */
    addParallelogram(input) {
        const paraData = this.parseParallelogramInput(input);

        if (!paraData) {
            console.log("❌ Invalid parallelogram format!");
            console.log("💡 Examples:");
            console.log("  • parallelogram (0,0) 5 4 3");
            console.log("  • parallelogram 1,1,6,3,2");
            return false;
        }

        const { corner, base, side, height } = paraData;

        if (isNaN(corner.x) || isNaN(corner.y) || isNaN(base) || isNaN(side) || isNaN(height) || 
            base <= 0 || side <= 0 || height <= 0 || height > side) {
            console.log("❌ Invalid values! Height must be less than or equal to side length.");
            return false;
        }

        const paraProps = this.calculateParallelogramProperties(corner, base, side, height);

        this.parallelogramCounter++;
        this.parallelogramHistory.push({
            id: this.parallelogramCounter,
            input: input,
            properties: paraProps
        });

        this.displayParallelogramAnalysis(paraProps);
        this.saveIndividualParallelogram(paraProps);

        return true;
    }

    /**
     * Display parallelogram analysis
     */
    displayParallelogramAnalysis(props) {
        const { corner, base, side, height, area, perimeter, angles, vertices } = props;

        console.log(`\n▱ PARALLELOGRAM ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Vertices:`);
        console.log(`   A: (${vertices.A.x.toFixed(2)}, ${vertices.A.y.toFixed(2)}) - Bottom-left`);
        console.log(`   B: (${vertices.B.x.toFixed(2)}, ${vertices.B.y.toFixed(2)}) - Bottom-right`);
        console.log(`   C: (${vertices.C.x.toFixed(2)}, ${vertices.C.y.toFixed(2)}) - Top-right`);
        console.log(`   D: (${vertices.D.x.toFixed(2)}, ${vertices.D.y.toFixed(2)}) - Top-left`);

        console.log(`\n📏 Measurements:`);
        console.log(`   Base: ${base.toFixed(3)} units`);
        console.log(`   Side: ${side.toFixed(3)} units`);
        console.log(`   Height: ${height.toFixed(3)} units`);
        console.log(`   Area: ${area.toFixed(3)} square units`);
        console.log(`   Perimeter: ${perimeter.toFixed(3)} units`);

        console.log(`\n📐 Angles:`);
        console.log(`   Acute angles: ${angles.acute.toFixed(1)}°`);
        console.log(`   Obtuse angles: ${angles.obtuse.toFixed(1)}°`);

        console.log(`\n📊 Properties:`);
        console.log(`   Opposite sides parallel and equal`);
        console.log(`   Opposite angles equal`);
        console.log(`   Adjacent angles supplementary`);

        console.log("=".repeat(50));
    }

    /**
     * Save individual parallelogram graph
     */
    async saveIndividualParallelogram(paraProps) {
        try {
            const buffer = await this.createParallelogramGraph(paraProps);
            const { corner, base, side, height } = paraProps;

            const filename = `parallelogram_${String(this.parallelogramCounter).padStart(3, '0')}_${corner.x}_${corner.y}_b${base}_s${side}_h${height}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Parallelogram graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving parallelogram graph:", error);
        }
    }

    /**
     * Create parallelogram graph
     */
    async createParallelogramGraph(paraProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawParallelogram(ctx, paraProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw parallelogram
     */
    drawParallelogram(ctx, paraProps) {
        const { vertices, base, side, height, area, perimeter, angles } = paraProps;

        const screenA = this.calculator.graphToScreen(vertices.A.x, vertices.A.y);
        const screenB = this.calculator.graphToScreen(vertices.B.x, vertices.B.y);
        const screenC = this.calculator.graphToScreen(vertices.C.x, vertices.C.y);
        const screenD = this.calculator.graphToScreen(vertices.D.x, vertices.D.y);

        // Draw parallelogram
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenA[0], screenA[1]);
        ctx.lineTo(screenB[0], screenB[1]);
        ctx.lineTo(screenC[0], screenC[1]);
        ctx.lineTo(screenD[0], screenD[1]);
        ctx.closePath();
        ctx.stroke();

        // Draw height line
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(screenD[0], screenD[1]);
        ctx.lineTo(screenD[0], screenA[1]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw vertices
        [screenA, screenB, screenC, screenD].forEach((screen, i) => {
            ctx.fillStyle = '#0066ff';
            ctx.beginPath();
            ctx.arc(screen[0], screen[1], 5, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Title and properties
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Parallelogram`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Base: ${base.toFixed(2)} units`,
            `Side: ${side.toFixed(2)} units`,
            `Height: ${height.toFixed(2)} units`,
            `Area: ${area.toFixed(2)} sq units`,
            `Perimeter: ${perimeter.toFixed(2)} units`,
            `Angles: ${angles.acute.toFixed(1)}° and ${angles.obtuse.toFixed(1)}°`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }

// ==================== POLYGON METHODS ====================
    
    /**
     * Parse polygon input
     */
    parsePolygonInput(input) {
        // Pattern 1: polygon n sides (x,y) side
        const pattern1 = /polygon\s*(\d+)\s*sides\s*\(([^,]+),([^)]+)\)\s*([^\s]+)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                n: parseInt(match1[1]),
                center: { x: parseFloat(match1[2]), y: parseFloat(match1[3]) },
                side: parseFloat(match1[4])
            };
        }

        // Pattern 2: polygon n,x,y,side
        const pattern2 = /polygon\s*(\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                n: parseInt(match2[1]),
                center: { x: parseFloat(match2[2]), y: parseFloat(match2[3]) },
                side: parseFloat(match2[4])
            };
        }

        return null;
    }

    /**
     * Calculate polygon properties
     */
    calculatePolygonProperties(n, center, side) {
        // Calculate radius (circumradius) from side length
        const radius = side / (2 * Math.sin(Math.PI / n));
        
        // Calculate area
        const area = (n * side * side) / (4 * Math.tan(Math.PI / n));
        
        // Calculate perimeter
        const perimeter = n * side;
        
        // Calculate interior angle
        const interiorAngle = ((n - 2) * 180) / n;
        
        // Calculate exterior angle
        const exteriorAngle = 360 / n;

        // Calculate vertices
        const vertices = [];
        for (let i = 0; i < n; i++) {
            const angle = (2 * Math.PI * i) / n - Math.PI / 2; // Start from top
            vertices.push({
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle)
            });
        }

        return {
            n,
            center,
            side,
            radius,
            area,
            perimeter,
            interiorAngle,
            exteriorAngle,
            vertices
        };
    }

    /**
     * Add polygon
     */
    addPolygon(input) {
        const polyData = this.parsePolygonInput(input);

        if (!polyData) {
            console.log("❌ Invalid polygon format!");
            console.log("💡 Examples:");
            console.log("  • polygon 5 sides (0,0) 2");
            console.log("  • polygon 6,1,1,3");
            return false;
        }

        const { n, center, side } = polyData;

        if (isNaN(center.x) || isNaN(center.y) || isNaN(side) || side <= 0 || n < 3) {
            console.log("❌ Invalid values! Side must be positive and n must be at least 3.");
            return false;
        }

        const polyProps = this.calculatePolygonProperties(n, center, side);

        this.polygonCounter++;
        this.polygonHistory.push({
            id: this.polygonCounter,
            input: input,
            properties: polyProps
        });

        this.displayPolygonAnalysis(polyProps);
        this.saveIndividualPolygon(polyProps);

        return true;
    }

    /**
     * Display polygon analysis
     */
    displayPolygonAnalysis(props) {
        const { n, center, side, radius, area, perimeter, interiorAngle, exteriorAngle } = props;

        const polygonNames = {
            3: "Triangle", 4: "Quadrilateral", 5: "Pentagon", 6: "Hexagon",
            7: "Heptagon", 8: "Octagon", 9: "Nonagon", 10: "Decagon",
            11: "Hendecagon", 12: "Dodecagon"
        };
        const name = polygonNames[n] || `${n}-gon`;

        console.log(`\n⬡ ${n}-SIDED POLYGON (${name.toUpperCase()}) ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Center: (${center.x}, ${center.y})`);
        console.log(`   Number of sides: ${n}`);

        console.log(`\n📏 Measurements:`);
        console.log(`   Side length: ${side.toFixed(3)} units`);
        console.log(`   Radius (circumradius): ${radius.toFixed(3)} units`);
        console.log(`   Area: ${area.toFixed(3)} square units`);
        console.log(`   Perimeter: ${perimeter.toFixed(3)} units`);

        console.log(`\n📐 Angles:`);
        console.log(`   Interior angle: ${interiorAngle.toFixed(1)}°`);
        console.log(`   Exterior angle: ${exteriorAngle.toFixed(1)}°`);
        console.log(`   Sum of interior angles: ${((n - 2) * 180).toFixed(1)}°`);

        console.log(`\n📊 Properties:`);
        console.log(`   Regular ${name.toLowerCase()} (all sides and angles equal)`);
        console.log(`   ${n} lines of symmetry`);
        console.log(`   Rotational symmetry of order ${n}`);

        console.log("=".repeat(50));
    }

    /**
     * Save individual polygon graph
     */
    async saveIndividualPolygon(polyProps) {
        try {
            const buffer = await this.createPolygonGraph(polyProps);
            const { n, center, side } = polyProps;

            const filename = `polygon_${String(this.polygonCounter).padStart(3, '0')}_${n}sides_${center.x}_${center.y}_s${side}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Polygon graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving polygon graph:", error);
        }
    }

    /**
     * Create polygon graph
     */
    async createPolygonGraph(polyProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawPolygon(ctx, polyProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw polygon
     */
    drawPolygon(ctx, polyProps) {
        const { n, vertices, center, side, area, perimeter, interiorAngle, radius } = polyProps;

        const screenVertices = vertices.map(v => this.calculator.graphToScreen(v.x, v.y));
        const screenCenter = this.calculator.graphToScreen(center.x, center.y);

        // Draw polygon
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenVertices[0][0], screenVertices[0][1]);
        for (let i = 1; i < screenVertices.length; i++) {
            ctx.lineTo(screenVertices[i][0], screenVertices[i][1]);
        }
        ctx.closePath();
        ctx.stroke();

        // Draw radius lines
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        screenVertices.forEach(screen => {
            ctx.beginPath();
            ctx.moveTo(screenCenter[0], screenCenter[1]);
            ctx.lineTo(screen[0], screen[1]);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // Draw center
        ctx.fillStyle = '#0066ff';
        ctx.beginPath();
        ctx.arc(screenCenter[0], screenCenter[1], 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw vertices
        screenVertices.forEach(screen => {
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.arc(screen[0], screen[1], 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        const polygonNames = {
            3: "Triangle", 4: "Quadrilateral", 5: "Pentagon", 6: "Hexagon",
            7: "Heptagon", 8: "Octagon", 9: "Nonagon", 10: "Decagon"
        };
        const name = polygonNames[n] || `${n}-gon`;

        // Title and properties
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Regular ${name} (${n} sides)`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Side: ${side.toFixed(2)} units`,
            `Radius: ${radius.toFixed(2)} units`,
            `Area: ${area.toFixed(2)} sq units`,
            `Perimeter: ${perimeter.toFixed(2)} units`,
            `Interior angle: ${interiorAngle.toFixed(1)}°`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }

    // ==================== ELLIPSE METHODS ====================
    
    /**
     * Parse ellipse input
     */
    parseEllipseInput(input) {
        // Pattern 1: ellipse center(x,y) a b
        const pattern1 = /ellipse\s*center\(([^,]+),([^)]+)\)\s*([^\s]+)\s*([^\s]+)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                center: { x: parseFloat(match1[1]), y: parseFloat(match1[2]) },
                a: parseFloat(match1[3]),
                b: parseFloat(match1[4])
            };
        }

        // Pattern 2: ellipse (x,y) a b
        const pattern2 = /ellipse\s*\(([^,]+),([^)]+)\)\s*([^\s]+)\s*([^\s]+)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                center: { x: parseFloat(match2[1]), y: parseFloat(match2[2]) },
                a: parseFloat(match2[3]),
                b: parseFloat(match2[4])
            };
        }

        // Pattern 3: ellipse x,y,a,b
        const pattern3 = /ellipse\s*([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match3 = input.match(pattern3);
        if (match3) {
            return {
                center: { x: parseFloat(match3[1]), y: parseFloat(match3[2]) },
                a: parseFloat(match3[3]),
                b: parseFloat(match3[4])
            };
        }

        return null;
    }

    /**
     * Calculate ellipse properties
     */
    calculateEllipseProperties(center, a, b) {
        // Ensure a >= b (a is semi-major axis)
        const semiMajor = Math.max(a, b);
        const semiMinor = Math.min(a, b);

        // Calculate area
        const area = Math.PI * a * b;

        // Calculate approximate perimeter (Ramanujan's approximation)
        const h = Math.pow((a - b), 2) / Math.pow((a + b), 2);
        const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

        // Calculate eccentricity
        const eccentricity = Math.sqrt(1 - (semiMinor * semiMinor) / (semiMajor * semiMajor));

        // Calculate focal distance
        const c = Math.sqrt(semiMajor * semiMajor - semiMinor * semiMinor);

        return {
            center,
            a,
            b,
            semiMajor,
            semiMinor,
            area,
            perimeter,
            eccentricity,
            focalDistance: c,
            foci: a >= b ? [
                { x: center.x - c, y: center.y },
                { x: center.x + c, y: center.y }
            ] : [
                { x: center.x, y: center.y - c },
                { x: center.x, y: center.y + c }
            ]
        };
    }

    /**
     * Add ellipse
     */
    addEllipse(input) {
        const ellipseData = this.parseEllipseInput(input);

        if (!ellipseData) {
            console.log("❌ Invalid ellipse format!");
            console.log("💡 Examples:");
            console.log("  • ellipse center(0,0) 5 3");
            console.log("  • ellipse (1,1) 4 2");
            console.log("  • ellipse 0,0,6,4");
            return false;
        }

        const { center, a, b } = ellipseData;

        if (isNaN(center.x) || isNaN(center.y) || isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
            console.log("❌ Invalid values! Semi-axes must be positive.");
            return false;
        }

        const ellipseProps = this.calculateEllipseProperties(center, a, b);

        this.ellipseCounter++;
        this.ellipseHistory.push({
            id: this.ellipseCounter,
            input: input,
            properties: ellipseProps
        });

        this.displayEllipseAnalysis(ellipseProps);
        this.saveIndividualEllipse(ellipseProps);

        return true;
    }

    /**
     * Display ellipse analysis
     */
    displayEllipseAnalysis(props) {
        const { center, a, b, semiMajor, semiMinor, area, perimeter, eccentricity, focalDistance, foci } = props;

        console.log(`\n⬭ ELLIPSE ANALYSIS`);
        console.log("=".repeat(50));

        console.log(`📍 Center: (${center.x}, ${center.y})`);
        console.log(`\n📏 Measurements:`);
        console.log(`   Semi-major axis (a): ${semiMajor.toFixed(3)} units`);
        console.log(`   Semi-minor axis (b): ${semiMinor.toFixed(3)} units`);
        console.log(`   Area: ${area.toFixed(3)} square units`);
        console.log(`   Perimeter (approx): ${perimeter.toFixed(3)} units`);

        console.log(`\n📊 Properties:`);
        console.log(`   Eccentricity: ${eccentricity.toFixed(4)}`);
        console.log(`   Focal distance (c): ${focalDistance.toFixed(3)} units`);
        console.log(`   Focus 1: (${foci[0].x.toFixed(2)}, ${foci[0].y.toFixed(2)})`);
        console.log(`   Focus 2: (${foci[1].x.toFixed(2)}, ${foci[1].y.toFixed(2)})`);

        console.log(`\n📐 Classification:`);
        if (Math.abs(a - b) < 0.001) {
            console.log(`   ⭐ Special case: Circle (a = b)`);
        } else if (eccentricity < 0.5) {
            console.log(`   Nearly circular ellipse`);
        } else if (eccentricity > 0.9) {
            console.log(`   Highly elongated ellipse`);
        } else {
            console.log(`   Standard ellipse`);
        }

        console.log("=".repeat(50));
    }

    /**
     * Save individual ellipse graph
     */
    async saveIndividualEllipse(ellipseProps) {
        try {
            const buffer = await this.createEllipseGraph(ellipseProps);
            const { center, a, b } = ellipseProps;

            const filename = `ellipse_${String(this.ellipseCounter).padStart(3, '0')}_${center.x}_${center.y}_a${a}_b${b}.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Ellipse graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving ellipse graph:", error);
        }
    }

    /**
     * Create ellipse graph
     */
    async createEllipseGraph(ellipseProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        await this.calculator.drawGraph(ctx);
        this.drawEllipse(ctx, ellipseProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw ellipse
     */
    drawEllipse(ctx, ellipseProps) {
        const { center, a, b, area, perimeter, eccentricity, foci } = ellipseProps;

        const screenCenter = this.calculator.graphToScreen(center.x, center.y);
        const screenRadiusX = Math.abs(this.calculator.graphToScreen(a, 0)[0] - this.calculator.graphToScreen(0, 0)[0]);
        const screenRadiusY = Math.abs(this.calculator.graphToScreen(0, b)[1] - this.calculator.graphToScreen(0, 0)[1]);

        // Draw ellipse
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(screenCenter[0], screenCenter[1], screenRadiusX, screenRadiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw center
        ctx.fillStyle = '#0066ff';
        ctx.beginPath();
        ctx.arc(screenCenter[0], screenCenter[1], 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw foci
        const screenFocus1 = this.calculator.graphToScreen(foci[0].x, foci[0].y);
        const screenFocus2 = this.calculator.graphToScreen(foci[1].x, foci[1].y);

        ctx.fillStyle = '#00aa00';
        ctx.beginPath();
        ctx.arc(screenFocus1[0], screenFocus1[1], 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenFocus2[0], screenFocus2[1], 4, 0, 2 * Math.PI);
        ctx.fill();

        // Draw axes
        ctx.strokeStyle = '#00aa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);// Major axis
        if (a >= b) {
            const screenLeft = this.calculator.graphToScreen(center.x - a, center.y);
            const screenRight = this.calculator.graphToScreen(center.x + a, center.y);
            ctx.beginPath();
            ctx.moveTo(screenLeft[0], screenLeft[1]);
            ctx.lineTo(screenRight[0], screenRight[1]);
            ctx.stroke();
        } else {
            const screenTop = this.calculator.graphToScreen(center.x, center.y + a);
            const screenBottom = this.calculator.graphToScreen(center.x, center.y - a);
            ctx.beginPath();
            ctx.moveTo(screenTop[0], screenTop[1]);
            ctx.lineTo(screenBottom[0], screenBottom[1]);
            ctx.stroke();
        }

        // Minor axis
        if (b < a) {
            const screenTop = this.calculator.graphToScreen(center.x, center.y + b);
            const screenBottom = this.calculator.graphToScreen(center.x, center.y - b);
            ctx.beginPath();
            ctx.moveTo(screenTop[0], screenTop[1]);
            ctx.lineTo(screenBottom[0], screenBottom[1]);
            ctx.stroke();
        } else {
            const screenLeft = this.calculator.graphToScreen(center.x - b, center.y);
            const screenRight = this.calculator.graphToScreen(center.x + b, center.y);
            ctx.beginPath();
            ctx.moveTo(screenLeft[0], screenLeft[1]);
            ctx.lineTo(screenRight[0], screenRight[1]);
            ctx.stroke();
        }

        ctx.setLineDash([]);

        // Title and properties
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Ellipse`, 10, 25);

        ctx.font = '12px Arial';
        const props = [
            `Center: (${center.x}, ${center.y})`,
            `Semi-major axis: ${Math.max(a, b).toFixed(2)} units`,
            `Semi-minor axis: ${Math.min(a, b).toFixed(2)} units`,
            `Area: ${area.toFixed(2)} sq units`,
            `Perimeter: ${perimeter.toFixed(2)} units (approx)`,
            `Eccentricity: ${eccentricity.toFixed(3)}`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }

// ==================== TRIANGLE METHODS (EXISTING) ====================

    /**
     * Parse triangle input from various formats
     */
    parseTriangleInput(input) {
        // Remove spaces and convert to lowercase for parsing
        const cleanInput = input.replace(/\s/g, '').toLowerCase();

        // Pattern 1: triangle A(x1,y1) B(x2,y2) C(x3,y3)
        const pattern1 = /triangle\s*a\(([^,]+),([^)]+)\)\s*b\(([^,]+),([^)]+)\)\s*c\(([^,]+),([^)]+)\)/i;
        const match1 = input.match(pattern1);

        if (match1) {
            return {
                A: { x: parseFloat(match1[1]), y: parseFloat(match1[2]) },
                B: { x: parseFloat(match1[3]), y: parseFloat(match1[4]) },
                C: { x: parseFloat(match1[5]), y: parseFloat(match1[6]) }
            };
        }

        // Pattern 2: triangle (x1,y1) (x2,y2) (x3,y3)
        const pattern2 = /triangle\s*\(([^,]+),([^)]+)\)\s*\(([^,]+),([^)]+)\)\s*\(([^,]+),([^)]+)\)/i;
        const match2 = input.match(pattern2);

        if (match2) {
            return {
                A: { x: parseFloat(match2[1]), y: parseFloat(match2[2]) },
                B: { x: parseFloat(match2[3]), y: parseFloat(match2[4]) },
                C: { x: parseFloat(match2[5]), y: parseFloat(match2[6]) }
            };
        }

        // Pattern 3: Simple coordinate list: triangle 0,0 4,0 2,3
        const pattern3 = /triangle\s*([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/i;
        const match3 = input.match(pattern3);

        if (match3) {
            return {
                A: { x: parseFloat(match3[1]), y: parseFloat(match3[2]) },
                B: { x: parseFloat(match3[3]), y: parseFloat(match3[4]) },
                C: { x: parseFloat(match3[5]), y: parseFloat(match3[6]) }
            };
        }

        return null;
    }

    /**
     * Check if three points are collinear
     */
    areCollinear(A, B, C) {
        // Using cross product method: points are collinear if cross product is 0
        const crossProduct = (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
        return Math.abs(crossProduct) < 1e-10; // Account for floating point precision
    }

    /**
     * Calculate distance between two points
     */
    calculateDistance(p1, p2) {
        return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    }

    /**
     * Calculate angle using law of cosines
     */
    calculateAngle(a, b, c) {
        // Using law of cosines: cos(C) = (a² + b² - c²) / (2ab)
        const cosAngle = (a * a + b * b - c * c) / (2 * a * b);
        // Clamp to [-1, 1] to handle floating point errors
        const clampedCos = Math.max(-1, Math.min(1, cosAngle));
        return Math.acos(clampedCos) * (180 / Math.PI); // Convert to degrees
    }

    /**
     * Classify triangle by sides
     */
    classifyBySides(sideA, sideB, sideC) {
        const sides = [sideA, sideB, sideC].sort((a, b) => a - b);
        const tolerance = 1e-10;

        if (Math.abs(sides[0] - sides[1]) < tolerance && Math.abs(sides[1] - sides[2]) < tolerance) {
            return "Equilateral";
        } else if (Math.abs(sides[0] - sides[1]) < tolerance ||
                   Math.abs(sides[1] - sides[2]) < tolerance ||
                   Math.abs(sides[0] - sides[2]) < tolerance) {
            return "Isosceles";
        } else {
            return "Scalene";
        }
    }

    /**
     * Classify triangle by angles
     */
    classifyByAngles(angleA, angleB, angleC) {
        const angles = [angleA, angleB, angleC];
        const tolerance = 1;

        if (angles.some(angle => Math.abs(angle - 90) < tolerance)) {
            return "Right";
        } else if (angles.every(angle => angle < 90)) {
            return "Acute";
        } else {
            return "Obtuse";
        }
    }

    /**
     * Calculate triangle properties
     */
    calculateTriangleProperties(A, B, C) {
        // Calculate side lengths
        const sideAB = this.calculateDistance(A, B); // side c
        const sideBC = this.calculateDistance(B, C); // side a
        const sideCA = this.calculateDistance(C, A); // side b

        // Calculate angles using law of cosines
        const angleA = this.calculateAngle(sideBC, sideCA, sideAB); // angle at A
        const angleB = this.calculateAngle(sideCA, sideAB, sideBC); // angle at B
        const angleC = this.calculateAngle(sideAB, sideBC, sideCA); // angle at C

        // Calculate area using cross product formula
        const area = 0.5 * Math.abs((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y));

        // Calculate perimeter
        const perimeter = sideAB + sideBC + sideCA;

        // Classify triangle
        const sideClassification = this.classifyBySides(sideAB, sideBC, sideCA);
        const angleClassification = this.classifyByAngles(angleA, angleB, angleC);

        return {
            vertices: { A, B, C },
            sides: {
                AB: sideAB,
                BC: sideBC,
                CA: sideCA
            },
            angles: {
                A: angleA,
                B: angleB,
                C: angleC
            },
            area,
            perimeter,
            classifications: {
                sides: sideClassification,
                angles: angleClassification,
                full: `${sideClassification} ${angleClassification}`
            }
        };
    }

    /**
     * Add triangle to the calculator
     */
    addTriangle(input) {
        const points = this.parseTriangleInput(input);

        if (!points) {
            console.log("❌ Invalid triangle format!");
            console.log("💡 Examples:");
            console.log("  • triangle A(0,0) B(4,0) C(2,3)");
            console.log("  • triangle (0,0) (4,0) (2,3)");
            console.log("  • triangle 0,0 4,0 2,3");
            return false;
        }

        const { A, B, C } = points;

        // Check if points are valid numbers
        if ([A.x, A.y, B.x, B.y, C.x, C.y].some(val => isNaN(val))) {
            console.log("❌ Invalid coordinates! Please use numbers only.");
            return false;
        }

        // Check if points are collinear
        if (this.areCollinear(A, B, C)) {
            console.log("❌ Points are collinear! Cannot form a triangle.");
            console.log(`Points: A(${A.x}, ${A.y}), B(${B.x}, ${B.y}), C(${C.x}, ${C.y})`);
            return false;
        }

        // Calculate triangle properties
        const triangleProps = this.calculateTriangleProperties(A, B, C);

        this.triangleCounter++;
        this.triangleHistory.push({
            id: this.triangleCounter,
            input: input,
            properties: triangleProps
        });

        // Display triangle analysis
        this.displayTriangleAnalysis(triangleProps);

        // Create individual triangle graph
        this.saveIndividualTriangle(triangleProps);

        return true;
    }

    /**
     * Display detailed triangle analysis
     */
    displayTriangleAnalysis(props) {
        const { vertices, sides, angles, area, perimeter, classifications } = props;

        console.log(`\n🔺 TRIANGLE ANALYSIS`);
        console.log("=".repeat(50));

        // Vertices
        console.log(`📍 Vertices:`);
        console.log(`   A: (${vertices.A.x}, ${vertices.A.y})`);
        console.log(`   B: (${vertices.B.x}, ${vertices.B.y})`);
        console.log(`   C: (${vertices.C.x}, ${vertices.C.y})`);

        // Side lengths
        console.log(`\n📏 Side Lengths:`);
        console.log(`   AB = ${sides.AB.toFixed(3)} units`);
        console.log(`   BC = ${sides.BC.toFixed(3)} units`);
        console.log(`   CA = ${sides.CA.toFixed(3)} units`);

        // Angles
        console.log(`\n📐 Angles:`);
        console.log(`   ∠A = ${angles.A.toFixed(1)}°`);
        console.log(`   ∠B = ${angles.B.toFixed(1)}°`);
        console.log(`   ∠C = ${angles.C.toFixed(1)}°`);
        console.log(`   Sum = ${(angles.A + angles.B + angles.C).toFixed(1)}° ✓`);

        // Properties
        console.log(`\n📊 Properties:`);
        console.log(`   Area: ${area.toFixed(3)} square units`);
        console.log(`   Perimeter: ${perimeter.toFixed(3)} units`);

        // Classification
        console.log(`\n🏷️ Classification:`);
        console.log(`   By sides: ${classifications.sides} Triangle`);
        console.log(`   By angles: ${classifications.angles} Triangle`);
        console.log(`   Overall: ${classifications.full} Triangle`);

        // Special properties
        this.displaySpecialProperties(props);

        console.log("=".repeat(50));
    }

    /**
     * Display special triangle properties
     */
    displaySpecialProperties(props) {
        const { sides, angles, classifications } = props;
        const specialProps = [];

        // Check for right triangle properties
        if (classifications.angles === "Right") {
            const sortedSides = Object.values(sides).sort((a, b) => a - b);
            const [a, b, c] = sortedSides;
            const pythagorean = Math.abs(c * c - (a * a + b * b));

            if (pythagorean < 0.001) {
                specialProps.push(`✓ Pythagorean theorem: ${a.toFixed(2)}² + ${b.toFixed(2)}² = ${c.toFixed(2)}²`);
            }
        }

        // Check for special right triangles
        if (classifications.angles === "Right") {
            const sortedSides = Object.values(sides).sort((a, b) => a - b);
            const [a, b, c] = sortedSides;

            // 45-45-90 triangle
            if (Math.abs(a - b) < 0.001 && Math.abs(c - a * Math.sqrt(2)) < 0.001) {
                specialProps.push("🔺 Special: 45-45-90 Triangle");
            }

            // 30-60-90 triangle
            const ratio1 = c / a;
            const ratio2 = b / a;
            if (Math.abs(ratio1 - 2) < 0.001 && Math.abs(ratio2 - Math.sqrt(3)) < 0.001) {
                specialProps.push("🔺 Special: 30-60-90 Triangle");
            }
        }

        // Check for equilateral properties
        if (classifications.sides === "Equilateral") {
            specialProps.push("✓ All angles are 60°");
            specialProps.push("✓ All sides are equal");
        }

        // Check for isosceles properties
        if (classifications.sides === "Isosceles") {
            const anglesArray = Object.values(angles);
            const baseAngles = anglesArray.filter((angle, index, arr) =>
                arr.findIndex(a => Math.abs(a - angle) < 0.001) !== index ||
                arr.filter(a => Math.abs(a - angle) < 0.001).length > 1
            );
            if (baseAngles.length >= 2) {
                specialProps.push(`✓ Base angles: ${baseAngles[0].toFixed(1)}°`);
            }
        }

        if (specialProps.length > 0) {
            console.log(`\n⭐ Special Properties:`);
            specialProps.forEach(prop => console.log(`   ${prop}`));
        }
    }

    /**
     * Save individual triangle graph
     */
    async saveIndividualTriangle(triangleProps) {
        try {
            const buffer = await this.createTriangleGraph(triangleProps);
            const { vertices } = triangleProps;

            const filename = `triangle_${String(this.triangleCounter).padStart(3, '0')}_A${vertices.A.x}_${vertices.A.y}_B${vertices.B.x}_${vertices.B.y}_C${vertices.C.x}_${vertices.C.y}.png`;
            const filepath = path.join('./temp', filename);

            // Create directory if it doesn't exist
            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Triangle graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving triangle graph:", error);
        }
    }

    /**
     * Create triangle graph with all details
     */
    async createTriangleGraph(triangleProps) {
        const canvas = createCanvas(this.calculator.width, this.calculator.height);
        const ctx = canvas.getContext("2d");

        // Draw basic grid and axes
        await this.calculator.drawGraph(ctx);

        // Draw triangle
        this.drawTriangle(ctx, triangleProps);

        return canvas.toBuffer("image/png");
    }

    /**
     * Draw triangle with all annotations
     */
    drawTriangle(ctx, triangleProps) {
        const { vertices, sides, angles, classifications } = triangleProps;
        const { A, B, C } = vertices;

        // Convert coordinates to screen coordinates
        const screenA = this.calculator.graphToScreen(A.x, A.y);
        const screenB = this.calculator.graphToScreen(B.x, B.y);
        const screenC = this.calculator.graphToScreen(C.x, C.y);

        // Draw triangle outline
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenA[0], screenA[1]);
        ctx.lineTo(screenB[0], screenB[1]);
        ctx.lineTo(screenC[0], screenC[1]);
        ctx.closePath();
        ctx.stroke();

        // Draw vertices as circles
        const drawVertex = (screen, label, color = '#0066ff') => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(screen[0], screen[1], 6, 0, 2 * Math.PI);
            ctx.fill();

            // Label
            ctx.fillStyle = 'black';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(label, screen[0], screen[1] - 15);
        };

        drawVertex(screenA, `A(${A.x}, ${A.y})`, '#ff0000');
        drawVertex(screenB, `B(${B.x}, ${B.y})`, '#00aa00');
        drawVertex(screenC, `C(${C.x}, ${C.y})`, '#0066ff');

        // Draw side length labels
        this.drawSideLabels(ctx, screenA, screenB, screenC, sides);

        // Draw angle labels
        this.drawAngleLabels(ctx, screenA, screenB, screenC, angles);

        // Draw title and classification
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${classifications.full} Triangle`, 10, 25);

        // Draw properties
        ctx.font = '12px Arial';
        const props = [
            `Area: ${triangleProps.area.toFixed(2)} sq units`,
            `Perimeter: ${triangleProps.perimeter.toFixed(2)} units`,
            `Sides: AB=${sides.AB.toFixed(2)}, BC=${sides.BC.toFixed(2)}, CA=${sides.CA.toFixed(2)}`,
            `Angles: ∠A=${angles.A.toFixed(1)}°, ∠B=${angles.B.toFixed(1)}°, ∠C=${angles.C.toFixed(1)}°`
        ];

        props.forEach((prop, index) => {
            ctx.fillText(prop, 10, 50 + index * 15);
        });
    }

    /**
     * Draw side length labels
     */
    drawSideLabels(ctx, screenA, screenB, screenC, sides) {
        const drawSideLabel = (screen1, screen2, length, label) => {
            const midX = (screen1[0] + screen2[0]) / 2;
            const midY = (screen1[1] + screen2[1]) / 2;

            ctx.fillStyle = '#666666';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${label}: ${length.toFixed(2)}`, midX, midY - 5);
        };

        drawSideLabel(screenA, screenB, sides.AB, 'AB');
        drawSideLabel(screenB, screenC, sides.BC, 'BC');
        drawSideLabel(screenC, screenA, sides.CA, 'CA');
    }

    /**
     * Draw angle labels
     */
    drawAngleLabels(ctx, screenA, screenB, screenC, angles) {
        ctx.fillStyle = '#333333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';

        // Angle at A
        ctx.fillText(`${angles.A.toFixed(1)}°`, screenA[0] + 15, screenA[1] + 5);

        // Angle at B
        ctx.fillText(`${angles.B.toFixed(1)}°`, screenB[0] + 15, screenB[1] + 5);

        // Angle at C
        ctx.fillText(`${angles.C.toFixed(1)}°`, screenC[0] + 15, screenC[1] + 5);
    }

    // ==================== HELPER & UTILITY METHODS ====================

    /**
     * Get formula description
     */
    getFormulaDescription(equation) {
        const cleanEq = equation.replace(/\s/g, '');
        return this.formulaDatabase[cleanEq] || `Mathematical function: ${equation}`;
    }

    /**
     * Create a new calculator instance for each equation
     */
    createFreshCalculator() {
        return new GraphingCalculator({
            size: 480,
            theme: this.calculator.theme,
            xMin: this.calculator.xMin,
            xMax: this.calculator.xMax,
            yMin: this.calculator.yMin,
            yMax: this.calculator.yMax,
            showGrid: this.calculator.showGrid,
            showAxes: this.calculator.showAxes,
            backgroundColor: this.calculator.backgroundColor,
            gridColor: this.calculator.gridColor,
            axisColor: this.calculator.axisColor
        });
    }

    // ==================== VECTOR METHODS ====================

    /**
     * Parse vector input from various formats
     */
    parseVectorInput(input) {
        const cleanInput = input.replace(/\s/g, '').toLowerCase();

        // Pattern 1: vector A(x1,y1) B(x2,y2) - displacement vector
        const pattern1 = /vector\s*a\(([^,]+),([^)]+)\)\s*b\(([^,]+),([^)]+)\)/i;
        const match1 = input.match(pattern1);
        if (match1) {
            return {
                type: 'displacement',
                points: [
                    { x: parseFloat(match1[1]), y: parseFloat(match1[2]), label: 'A' },
                    { x: parseFloat(match1[3]), y: parseFloat(match1[4]), label: 'B' }
                ]
            };
        }

        // Pattern 2: vector (x1,y1) (x2,y2) - displacement vector
        const pattern2 = /vector\s*\(([^,]+),([^)]+)\)\s*\(([^,]+),([^)]+)\)/i;
        const match2 = input.match(pattern2);
        if (match2) {
            return {
                type: 'displacement',
                points: [
                    { x: parseFloat(match2[1]), y: parseFloat(match2[2]), label: 'Start' },
                    { x: parseFloat(match2[3]), y: parseFloat(match2[4]), label: 'End' }
                ]
            };
        }

        // Pattern 3: vectors A(x1,y1) B(x2,y2) C(x3,y3) - multiple vectors
        const pattern3 = /vectors?\s*a\(([^,]+),([^)]+)\)\s*b\(([^,]+),([^)]+)\)\s*c\(([^,]+),([^)]+)\)/i;
        const match3 = input.match(pattern3);
        if (match3) {
            return {
                type: 'multiple',
                points: [
                    { x: parseFloat(match3[1]), y: parseFloat(match3[2]), label: 'A' },
                    { x: parseFloat(match3[3]), y: parseFloat(match3[4]), label: 'B' },
                    { x: parseFloat(match3[5]), y: parseFloat(match3[6]), label: 'C' }
                ]
            };
        }

        // Pattern 4: vector <x,y> - component form
        const pattern4 = /vector\s*<([^,]+),([^>]+)>/i;
        const match4 = input.match(pattern4);
        if (match4) {
            return {
                type: 'component',
                components: { x: parseFloat(match4[1]), y: parseFloat(match4[2]) }
            };
        }

        // Pattern 5: 3D vector A(x1,y1,z1) B(x2,y2,z2)
        const pattern5 = /vector\s*a\(([^,]+),([^,]+),([^)]+)\)\s*b\(([^,]+),([^,]+),([^)]+)\)/i;
        const match5 = input.match(pattern5);
        if (match5) {
            return {
                type: 'displacement3d',
                points: [
                    { x: parseFloat(match5[1]), y: parseFloat(match5[2]), z: parseFloat(match5[3]), label: 'A' },
                    { x: parseFloat(match5[4]), y: parseFloat(match5[5]), z: parseFloat(match5[6]), label: 'B' }
                ]
            };
        }

        return null;
    }

    /**
     * Calculate displacement vector from two points
     */
    calculateDisplacementVector(point1, point2) {
        const vector = {
            components: {
                x: point2.x - point1.x,
                y: point2.y - point1.y,
                z: point2.z !== undefined ? point2.z - point1.z : undefined
            },
            startPoint: point1,
            endPoint: point2,
            is3D: point1.z !== undefined && point2.z !== undefined
        };

        // Calculate magnitude
        if (vector.is3D) {
            vector.magnitude = Math.sqrt(
                vector.components.x ** 2 +
                vector.components.y ** 2 +
                vector.components.z ** 2
            );
        } else {
            vector.magnitude = Math.sqrt(
                vector.components.x ** 2 +
                vector.components.y ** 2
            );
        }

        // Calculate direction angles
        vector.direction = this.calculateVectorDirection(vector.components, vector.is3D);

        // Calculate unit vector
        vector.unitVector = {
            x: vector.components.x / vector.magnitude,
            y: vector.components.y / vector.magnitude,
            z: vector.is3D ? vector.components.z / vector.magnitude : undefined
        };

        return vector;
    }

    /**
     * Calculate direction angles for vector
     */
    calculateVectorDirection(components, is3D = false) {
        const direction = {};

        if (is3D) {
            // Direction cosines and angles for 3D
            const magnitude = Math.sqrt(components.x ** 2 + components.y ** 2 + components.z ** 2);

            direction.cosines = {
                alpha: components.x / magnitude,
                beta: components.y / magnitude,
                gamma: components.z / magnitude
            };

            direction.angles = {
                alpha: Math.acos(direction.cosines.alpha) * (180 / Math.PI),
                beta: Math.acos(direction.cosines.beta) * (180 / Math.PI),
                gamma: Math.acos(direction.cosines.gamma) * (180 / Math.PI)
            };
        } else {
            // 2D direction
            direction.angle = Math.atan2(components.y, components.x) * (180 / Math.PI);
            direction.bearing = this.calculateBearing(components.x, components.y);

            // Quadrant
            if (components.x >= 0 && components.y >= 0) direction.quadrant = "I";
            else if (components.x < 0 && components.y >= 0) direction.quadrant = "II";
            else if (components.x < 0 && components.y < 0) direction.quadrant = "III";
            else direction.quadrant = "IV";
        }

        return direction;
    }

    /**
     * Calculate bearing (navigation angle)
     */
    calculateBearing(x, y) {
        let bearing = Math.atan2(x, y) * (180 / Math.PI);
        if (bearing < 0) bearing += 360;

        // Convert to compass bearing
        const compassQuadrant = Math.floor(bearing / 90);
        const compassAngle = bearing % 90;

        switch (compassQuadrant) {
            case 0: return `N${compassAngle.toFixed(1)}°E`;
            case 1: return `S${(90 - compassAngle).toFixed(1)}°E`;
            case 2: return `S${compassAngle.toFixed(1)}°W`;
            case 3: return `N${(90 - compassAngle).toFixed(1)}°W`;
            default: return `${bearing.toFixed(1)}°`;
        }
    }

    /**
     * Add two vectors
     */
    addVectors(vector1, vector2) {
        return {
            x: vector1.components.x + vector2.components.x,
            y: vector1.components.y + vector2.components.y,
            z: vector1.is3D && vector2.is3D ? (vector1.components.z || 0) + (vector2.components.z || 0) : undefined
        };
    }

    /**
     * Subtract two vectors
     */
    subtractVectors(vector1, vector2) {
        return {
            x: vector1.components.x - vector2.components.x,
            y: vector1.components.y - vector2.components.y,
            z: vector1.is3D && vector2.is3D ? (vector1.components.z || 0) - (vector2.components.z || 0) : undefined
        };
    }

    /**
     * Scalar multiplication
     */
    scalarMultiply(vector, scalar) {
        return {
            x: vector.components.x * scalar,
            y: vector.components.y * scalar,
            z: vector.is3D ? (vector.components.z || 0) * scalar : undefined
        };
    }

    /**
     * Dot product of two vectors
     */
    dotProduct(vector1, vector2) {
        let dot = vector1.components.x * vector2.components.x +
                  vector1.components.y * vector2.components.y;

        if (vector1.is3D && vector2.is3D) {
            dot += (vector1.components.z || 0) * (vector2.components.z || 0);
        }

        return dot;
    }

    /**
     * Cross product of two vectors (2D gives scalar, 3D gives vector)
     */
    crossProduct(vector1, vector2) {
        if (vector1.is3D && vector2.is3D) {
            // 3D cross product
            return {
                x: (vector1.components.y || 0) * (vector2.components.z || 0) -
                   (vector1.components.z || 0) * (vector2.components.y || 0),
                y: (vector1.components.z || 0) * (vector2.components.x || 0) -
                   (vector1.components.x || 0) * (vector2.components.z || 0),
                z: (vector1.components.x || 0) * (vector2.components.y || 0) -
                   (vector1.components.y || 0) * (vector2.components.x || 0)
            };
        } else {
            // 2D cross product (scalar)
            return vector1.components.x * vector2.components.y -
                   vector1.components.y * vector2.components.x;
        }
    }

    /**
     * Check if vectors are orthogonal
     */
    areVectorsOrthogonal(vector1, vector2, tolerance = 1e-10) {
        return Math.abs(this.dotProduct(vector1, vector2)) < tolerance;
    }

    /**
     * Check if vectors are parallel
     */
    areVectorsParallel(vector1, vector2, tolerance = 1e-10) {
        const cross = this.crossProduct(vector1, vector2);
        if (typeof cross === 'number') {
            return Math.abs(cross) < tolerance;
        } else {
            const crossMagnitude = Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2);
            return crossMagnitude < tolerance;
        }
    }

    /**
     * Calculate angle between two vectors
     */
    angleBetweenVectors(vector1, vector2) {
        const dot = this.dotProduct(vector1, vector2);
        const angle = Math.acos(dot / (vector1.magnitude * vector2.magnitude));
        return angle * (180 / Math.PI);
    }

    /**
     * Draw vector arrow
     */
    drawVectorArrow(ctx, startScreen, endScreen, color = '#ff6600', label = '', showComponents = false) {
        const [startX, startY] = startScreen;
        const [endX, endY] = endScreen;

        // Calculate arrow direction
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length < 1) return; // Too small to draw

        const unitX = dx / length;
        const unitY = dy / length;

        // Draw main line
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw arrowhead
        const arrowLength = this.vectorSettings.arrowSize;
        const arrowAngle = Math.PI / 6; // 30 degrees

        const arrow1X = endX - arrowLength * Math.cos(Math.atan2(dy, dx) - arrowAngle);
        const arrow1Y = endY - arrowLength * Math.sin(Math.atan2(dy, dx) - arrowAngle);
        const arrow2X = endX - arrowLength * Math.cos(Math.atan2(dy, dx) + arrowAngle);
        const arrow2Y = endY - arrowLength * Math.sin(Math.atan2(dy, dx) + arrowAngle);

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(arrow1X, arrow1Y);
        ctx.moveTo(endX, endY);
        ctx.lineTo(arrow2X, arrow2Y);
        ctx.stroke();

        // Draw label
        if (label) {
            ctx.fillStyle = color;
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            ctx.fillText(label, midX + 15, midY - 5);
        }

        // Draw components if requested
        if (showComponents && this.vectorSettings.showComponents) {
            this.drawVectorComponents(ctx, startScreen, endScreen);
        }
    }

    /**
     * Draw vector components (x and y projections)
     */
    drawVectorComponents(ctx, startScreen, endScreen) {
        const [startX, startY] = startScreen;
        const [endX, endY] = endScreen;

        // X component (horizontal)
        ctx.strokeStyle = this.vectorSettings.componentColor;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, startY);
        ctx.stroke();

        // Y component (vertical)
        ctx.beginPath();
        ctx.moveTo(endX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.setLineDash([]); // Reset line dash

        // Component labels
        ctx.fillStyle = this.vectorSettings.componentColor;
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';

        // X component label
        const xCompMid = (startX + endX) / 2;
        ctx.fillText(`x: ${(endX - startX).toFixed(1)}`, xCompMid, startY - 5);

        // Y component label
        const yCompMid = (startY + endY) / 2;
        ctx.save();
        ctx.translate(endX + 15, yCompMid);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`y: ${(endY - startY).toFixed(1)}`, 0, 0);
        ctx.restore();
    }

    /**
     * Draw complete vector analysis
     */
    drawVectorAnalysis(ctx, vectorData) {
        const { vectors, resultant, operations } = vectorData;

        // Draw grid using the calculator's method
        this.calculator.drawGrid(ctx);

        // Draw individual vectors
        vectors.forEach((vector, index) => {
            const colors = ['#ff6600', '#00aa00', '#0066ff', '#ff0066'];
            const color = colors[index % colors.length];

            const startScreen = this.calculator.graphToScreen(vector.startPoint.x, vector.startPoint.y);
            const endScreen = this.calculator.graphToScreen(vector.endPoint.x, vector.endPoint.y);

            this.drawVectorArrow(ctx, startScreen, endScreen, color,
                `v${index + 1}`, this.vectorSettings.showComponents);

            // Draw start and end points
            this.drawVectorPoint(ctx, startScreen, vector.startPoint.label || `Start${index + 1}`, '#333');
            this.drawVectorPoint(ctx, endScreen, vector.endPoint.label || `End${index + 1}`, color);
        });

        // Draw resultant if multiple vectors
        if (resultant) {
            const resultantStart = this.calculator.graphToScreen(0, 0);
            const resultantEnd = this.calculator.graphToScreen(resultant.x, resultant.y);
            this.drawVectorArrow(ctx, resultantStart, resultantEnd,
                this.vectorSettings.resultantColor, 'Resultant', false);
        }

        // Draw analysis information
        this.drawVectorInfo(ctx, vectorData);
    }

    /**
     * Draw point with label
     */
    drawVectorPoint(ctx, screen, label, color = '#333') {
        const [x, y] = screen;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y - 10);
    }

    /**
     * Draw vector information panel
     */
    drawVectorInfo(ctx, vectorData) {
        const { vectors, operations } = vectorData;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(10, 10, 280, vectors.length * 60 + 40);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(10, 10, 280, vectors.length * 60 + 40);

        ctx.fillStyle = 'black';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Vector Analysis', 20, 30);

        ctx.font = '11px Arial';
        let yOffset = 50;

        vectors.forEach((vector, index) => {
            const info = [
                `Vector ${index + 1}: <${vector.components.x.toFixed(2)}, ${vector.components.y.toFixed(2)}${vector.is3D ? `, ${vector.components.z.toFixed(2)}` : ''}>`,
                `Magnitude: ${vector.magnitude.toFixed(3)} units`,
                vector.is3D
                    ? `Angles: α=${vector.direction.angles.alpha.toFixed(1)}°, β=${vector.direction.angles.beta.toFixed(1)}°, γ=${vector.direction.angles.gamma.toFixed(1)}°`
                    : `Direction: ${vector.direction.angle?.toFixed(1)}°`,
                vector.is3D ? '' : `Bearing: ${vector.direction.bearing || 'N/A'}`
            ];

            info.forEach((line, lineIndex) => {
                if (line) ctx.fillText(line, 20, yOffset + lineIndex * 12);
            });

            yOffset += 60;
        });

        // Draw operations results
        if (operations && Object.keys(operations).length > 0) {
            ctx.font = 'bold 11px Arial';
            ctx.fillText('Operations:', 20, yOffset);
            yOffset += 15;

            ctx.font = '10px Arial';
            Object.entries(operations).forEach(([op, result]) => {
                if (typeof result === 'object' && result.x !== undefined) {
                    ctx.fillText(`${op}: <${result.x.toFixed(2)}, ${result.y.toFixed(2)}${result.z !== undefined ? `, ${result.z.toFixed(2)}` : ''}>`, 20, yOffset);
                } else if (typeof result === 'number') {
                    ctx.fillText(`${op}: ${result.toFixed(3)}${op.includes('Angle') ? '°' : ''}`, 20, yOffset);
                } else if (typeof result === 'boolean') {
                    ctx.fillText(`${op}: ${result ? 'Yes' : 'No'}`, 20, yOffset);
                }
                yOffset += 12;
            });
        }
    }

/**
     * Process vector input and create analysis
     */
    addVector(input) {
        const parsed = this.parseVectorInput(input);

        if (!parsed) {
            console.log("❌ Invalid vector format!");
            console.log("💡 Examples:");
            console.log("  • vector A(1,2) B(5,4)  → Displacement vector");
            console.log("  • vector (0,0) (3,4)   → Simple displacement");
            console.log("  • vector <3,4>          → Component form");
            console.log("  • vectors A(1,1) B(4,3) C(6,5)  → Multiple vectors");
            console.log("  • vector A(1,2,3) B(4,5,6)      → 3D vector");
            return false;
        }

        // Validate coordinates
        if (parsed.points) {
            if (parsed.points.some(p => isNaN(p.x) || isNaN(p.y) || (parsed.type === 'displacement3d' && isNaN(p.z)))) {
                console.log("❌ Invalid coordinates! Please use numbers only.");
                return false;
            }
        } else if (parsed.components) {
            if (isNaN(parsed.components.x) || isNaN(parsed.components.y)) {
                console.log("❌ Invalid components! Please use numbers only.");
                return false;
            }
        }

        let vectorData = { vectors: [], operations: {} };

        if (parsed.type === 'displacement' || parsed.type === 'displacement3d') {
            const vector = this.calculateDisplacementVector(parsed.points[0], parsed.points[1]);
            vectorData.vectors.push(vector);

        } else if (parsed.type === 'component') {
            const vector = {
                components: parsed.components,
                startPoint: { x: 0, y: 0, label: 'Origin' },
                endPoint: { x: parsed.components.x, y: parsed.components.y, label: 'End' },
                magnitude: Math.sqrt(parsed.components.x ** 2 + parsed.components.y ** 2),
                is3D: false
            };
            vector.direction = this.calculateVectorDirection(vector.components);
            vector.unitVector = {
                x: vector.components.x / vector.magnitude,
                y: vector.components.y / vector.magnitude
            };
            vectorData.vectors.push(vector);

        } else if (parsed.type === 'multiple') {
            // Create vectors from consecutive points
            for (let i = 0; i < parsed.points.length - 1; i++) {
                const vector = this.calculateDisplacementVector(parsed.points[i], parsed.points[i + 1]);
                vectorData.vectors.push(vector);
            }

            // Calculate vector operations for multiple vectors
            if (vectorData.vectors.length >= 2) {
                const v1 = vectorData.vectors[0];
                const v2 = vectorData.vectors[1];

                vectorData.operations = {
                    'Sum': this.addVectors(v1, v2),
                    'Difference': this.subtractVectors(v1, v2),
                    'Dot Product': this.dotProduct(v1, v2),
                    'Cross Product': this.crossProduct(v1, v2),
                    'Angle Between': this.angleBetweenVectors(v1, v2),
                    'Orthogonal': this.areVectorsOrthogonal(v1, v2),
                    'Parallel': this.areVectorsParallel(v1, v2)
                };

                // Calculate resultant
                vectorData.resultant = vectorData.operations['Sum'];
            }
        }

        this.vectorCounter++;
        this.vectorHistory.push({
            id: this.vectorCounter,
            input: input,
            data: vectorData
        });

        // Display analysis
        this.displayVectorAnalysis(vectorData);

        // Save graph
        this.saveVectorGraph(vectorData);

        return true;
    }

    /**
     * Display comprehensive vector analysis
     */
    displayVectorAnalysis(vectorData) {
        const { vectors, operations, resultant } = vectorData;

        console.log(`\n➡️  VECTOR ANALYSIS`);
        console.log("=".repeat(60));

        vectors.forEach((vector, index) => {
            console.log(`\n📐 Vector ${index + 1}:`);
            console.log(`   From: ${vector.startPoint.label}(${vector.startPoint.x}, ${vector.startPoint.y}${vector.is3D ? `, ${vector.startPoint.z}` : ''})`);
            console.log(`   To:   ${vector.endPoint.label}(${vector.endPoint.x}, ${vector.endPoint.y}${vector.is3D ? `, ${vector.endPoint.z}` : ''})`);
            console.log(`   Components: <${vector.components.x.toFixed(3)}, ${vector.components.y.toFixed(3)}${vector.is3D ? `, ${vector.components.z.toFixed(3)}` : ''}>`);
            console.log(`   Magnitude: ${vector.magnitude.toFixed(4)} units`);

            if (vector.is3D) {
                console.log(`   Direction Angles: α=${vector.direction.angles.alpha.toFixed(1)}°, β=${vector.direction.angles.beta.toFixed(1)}°, γ=${vector.direction.angles.gamma.toFixed(1)}°`);
                console.log(`   Direction Cosines: <${vector.direction.cosines.alpha.toFixed(4)}, ${vector.direction.cosines.beta.toFixed(4)}, ${vector.direction.cosines.gamma.toFixed(4)}>`);
            } else {
                console.log(`   Direction: ${vector.direction.angle.toFixed(1)}° (${vector.direction.quadrant})`);
                console.log(`   Bearing: ${vector.direction.bearing}`);
            }

            console.log(`   Unit Vector: <${vector.unitVector.x.toFixed(4)}, ${vector.unitVector.y.toFixed(4)}${vector.is3D ? `, ${vector.unitVector.z.toFixed(4)}` : ''}>`);
        });

        if (operations && Object.keys(operations).length > 0) {
            console.log(`\n🔧 Vector Operations:`);
            Object.entries(operations).forEach(([op, result]) => {
                if (typeof result === 'object' && result.x !== undefined) {
                    console.log(`   ${op}: <${result.x.toFixed(3)}, ${result.y.toFixed(3)}${result.z !== undefined ? `, ${result.z.toFixed(3)}` : ''}>`);
                } else if (typeof result === 'number') {
                    console.log(`   ${op}: ${result.toFixed(4)}${op.includes('Angle') ? '°' : ''}`);
                } else if (typeof result === 'boolean') {
                    console.log(`   ${op}: ${result ? '✓ Yes' : '✗ No'}`);
                }
            });
        }

        if (resultant) {
            const resultantMag = Math.sqrt(resultant.x ** 2 + resultant.y ** 2 + (resultant.z || 0) ** 2);
            console.log(`\n📍 Resultant Vector:`);
            console.log(`   Components: <${resultant.x.toFixed(3)}, ${resultant.y.toFixed(3)}${resultant.z !== undefined ? `, ${resultant.z.toFixed(3)}` : ''}>`);
            console.log(`   Magnitude: ${resultantMag.toFixed(4)} units`);
        }

        console.log("=".repeat(60));
    }

    /**
     * Save vector graph
     */
    async saveVectorGraph(vectorData) {
        try {
            const canvas = createCanvas(this.calculator.width, this.calculator.height);
            const ctx = canvas.getContext('2d');

            this.drawVectorAnalysis(ctx, vectorData);

            const filename = `vector_${String(this.vectorCounter).padStart(3, '0')}_analysis.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filepath, buffer);

            console.log(`💾 Vector graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving vector graph:", error);
        }
    }

    /**
     * Display vector history
     */
    displayVectorHistory() {
        console.log(`\n📜 Vector History (${this.vectorCounter} vectors)`);
        console.log("=".repeat(50));

        if (this.vectorHistory.length === 0) {
            console.log("No vectors added yet.");
            return;
        }

        this.vectorHistory.forEach(entry => {
            const { vectors } = entry.data;
            console.log(`${entry.id}. ${entry.input}`);
            vectors.forEach((vector, index) => {
                console.log(`   Vector ${index + 1}: <${vector.components.x.toFixed(2)}, ${vector.components.y.toFixed(2)}${vector.is3D ? `, ${vector.components.z.toFixed(2)}` : ''}> | Mag: ${vector.magnitude.toFixed(2)}`);
            });
            console.log("");
        });
    }

    /**
     * Toggle vector display settings
     */
    toggleVectorSettings() {
        console.log("\n🎛️ Vector Display Settings:");
        console.log(`   Show Components: ${this.vectorSettings.showComponents ? '✓ Enabled' : '✗ Disabled'}`);
        console.log(`   Show Magnitude: ${this.vectorSettings.showMagnitude ? '✓ Enabled' : '✗ Disabled'}`);
        console.log(`   Show Angle: ${this.vectorSettings.showAngle ? '✓ Enabled' : '✗ Disabled'}`);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Enter setting to toggle (components/magnitude/angle) or 'cancel': ", (input) => {
            switch (input.toLowerCase()) {
                case 'components':
                    this.vectorSettings.showComponents = !this.vectorSettings.showComponents;
                    console.log(`Components display ${this.vectorSettings.showComponents ? 'enabled' : 'disabled'}`);
                    break;
                case 'magnitude':
                    this.vectorSettings.showMagnitude = !this.vectorSettings.showMagnitude;
                    console.log(`Magnitude display ${this.vectorSettings.showMagnitude ? 'enabled' : 'disabled'}`);
                    break;
                case 'angle':
                    this.vectorSettings.showAngle = !this.vectorSettings.showAngle;
                    console.log(`Angle display ${this.vectorSettings.showAngle ? 'enabled' : 'disabled'}`);
                    break;
                case 'cancel':
                    console.log("No changes made.");
                    break;
                default:
                    console.log("❌ Invalid setting. Use 'components', 'magnitude', 'angle', or 'cancel'.");
            }
            rl.close();
        });
    }

// ==================== MATRIX METHODS ====================

    /**
     * Parse matrix input from various formats
     */
    parseMatrixInput(input) {
        const cleanInput = input.trim().toLowerCase();

        // Pattern 1: matrix [[a,b],[c,d]] - standard notation
        const pattern1 = /matrix\s*\[\[([^\]]+)\],\[([^\]]+)\]\]/i;
        const match1 = input.match(pattern1);
        if (match1) {
            try {
                const row1 = match1[1].split(',').map(x => parseFloat(x.trim()));
                const row2 = match2[2].split(',').map(x => parseFloat(x.trim()));
                return {
                    type: '2x2',
                    values: [row1, row2]
                };
            } catch (e) {
                return null;
            }
        }

        // Pattern 2: matrix [a,b,c,d] - flat array for 2x2
        const pattern2 = /matrix\s*\[([^\]]+)\]/i;
        const match2 = input.match(pattern2);
        if (match2) {
            try {
                const values = match2[1].split(',').map(x => parseFloat(x.trim()));
                if (values.length === 4) {
                    return {
                        type: '2x2',
                        values: [[values[0], values[1]], [values[2], values[3]]]
                    };
                } else if (values.length === 9) {
                    return {
                        type: '3x3',
                        values: [
                            [values[0], values[1], values[2]],
                            [values[3], values[4], values[5]],
                            [values[6], values[7], values[8]]
                        ]
                    };
                }
            } catch (e) {
                return null;
            }
        }

        // Pattern 3: matrix a b c d - space separated for 2x2
        const pattern3 = /matrix\s+([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)/i;
        const match3 = input.match(pattern3);
        if (match3) {
            return {
                type: '2x2',
                values: [
                    [parseFloat(match3[1]), parseFloat(match3[2])],
                    [parseFloat(match3[3]), parseFloat(match3[4])]
                ]
            };
        }

        // Pattern 4: matrix rotation angle - rotation matrix
        const pattern4 = /matrix\s+rotation\s+([-+]?\d*\.?\d+)/i;
        const match4 = input.match(pattern4);
        if (match4) {
            const angle = parseFloat(match4[1]) * Math.PI / 180; // Convert to radians
            return {
                type: '2x2',
                values: [
                    [Math.cos(angle), -Math.sin(angle)],
                    [Math.sin(angle), Math.cos(angle)]
                ],
                description: `Rotation by ${match4[1]}°`
            };
        }

        // Pattern 5: matrix scale sx sy - scaling matrix
        const pattern5 = /matrix\s+scale\s+([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)/i;
        const match5 = input.match(pattern5);
        if (match5) {
            return {
                type: '2x2',
                values: [
                    [parseFloat(match5[1]), 0],
                    [0, parseFloat(match5[2])]
                ],
                description: `Scale by (${match5[1]}, ${match5[2]})`
            };
        }

        // Pattern 6: matrix reflection axis - reflection matrix
        const pattern6 = /matrix\s+reflection\s+(x|y)/i;
        const match6 = input.match(pattern6);
        if (match6) {
            const axis = match6[1].toLowerCase();
            if (axis === 'x') {
                return {
                    type: '2x2',
                    values: [[1, 0], [0, -1]],
                    description: 'Reflection across x-axis'
                };
            } else {
                return {
                    type: '2x2',
                    values: [[-1, 0], [0, 1]],
                    description: 'Reflection across y-axis'
                };
            }
        }

        // Pattern 7: matrix shear sx sy - shear matrix
        const pattern7 = /matrix\s+shear\s+([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)/i;
        const match7 = input.match(pattern7);
        if (match7) {
            return {
                type: '2x2',
                values: [
                    [1, parseFloat(match7[1])],
                    [parseFloat(match7[2]), 1]
                ],
                description: `Shear by (${match7[1]}, ${match7[2]})`
            };
        }

        return null;
    }

    /**
     * Calculate matrix determinant
     */
    calculateDeterminant(matrix) {
        const n = matrix.length;

        if (n === 2) {
            // 2x2 matrix
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        } else if (n === 3) {
            // 3x3 matrix using rule of Sarrus
            return (
                matrix[0][0] * matrix[1][1] * matrix[2][2] +
                matrix[0][1] * matrix[1][2] * matrix[2][0] +
                matrix[0][2] * matrix[1][0] * matrix[2][1] -
                matrix[0][2] * matrix[1][1] * matrix[2][0] -
                matrix[0][1] * matrix[1][0] * matrix[2][2] -
                matrix[0][0] * matrix[1][2] * matrix[2][1]
            );
        }

        return null;
    }

    /**
     * Calculate matrix trace
     */
    calculateTrace(matrix) {
        let trace = 0;
        for (let i = 0; i < matrix.length; i++) {
            trace += matrix[i][i];
        }
        return trace;
    }

    /**
     * Transpose matrix
     */
    transposeMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const transposed = [];

        for (let i = 0; i < cols; i++) {
            transposed[i] = [];
            for (let j = 0; j < rows; j++) {
                transposed[i][j] = matrix[j][i];
            }
        }

        return transposed;
    }

    /**
     * Invert 2x2 matrix
     */
    invertMatrix2x2(matrix) {
        const det = this.calculateDeterminant(matrix);

        if (Math.abs(det) < 1e-10) {
            return null; // Matrix is singular
        }

        return [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]
        ];
    }

    /**
     * Multiply two matrices
     */
    multiplyMatrices(A, B) {
        const rowsA = A.length;
        const colsA = A[0].length;
        const colsB = B[0].length;

        const result = [];
        for (let i = 0; i < rowsA; i++) {
            result[i] = [];
            for (let j = 0; j < colsB; j++) {
                result[i][j] = 0;
                for (let k = 0; k < colsA; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }

        return result;
    }

    /**
     * Apply matrix transformation to a point
     */
    transformPoint(matrix, point) {
        if (matrix.length === 2 && matrix[0].length === 2) {
            // 2D transformation
            return {
                x: matrix[0][0] * point.x + matrix[0][1] * point.y,
                y: matrix[1][0] * point.x + matrix[1][1] * point.y
            };
        }
        return point;
    }

    /**
     * Calculate eigenvalues for 2x2 matrix
     */
    calculateEigenvalues2x2(matrix) {
        const a = matrix[0][0];
        const b = matrix[0][1];
        const c = matrix[1][0];
        const d = matrix[1][1];

        const trace = a + d;
        const det = a * d - b * c;

        const discriminant = trace * trace - 4 * det;

        if (discriminant < 0) {
            // Complex eigenvalues
            const real = trace / 2;
            const imag = Math.sqrt(-discriminant) / 2;
            return {
                lambda1: { real, imag },
                lambda2: { real, imag: -imag },
                isReal: false
            };
        } else {
            // Real eigenvalues
            const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
            const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
            return {
                lambda1: { real: lambda1, imag: 0 },
                lambda2: { real: lambda2, imag: 0 },
                isReal: true
            };
        }
    }

    /**
     * Classify matrix transformation type
     */
    classifyTransformation(matrix) {
        const det = this.calculateDeterminant(matrix);
        const trace = this.calculateTrace(matrix);
        const eigenvalues = this.calculateEigenvalues2x2(matrix);

        let classification = [];

        // Check for identity
        if (Math.abs(matrix[0][0] - 1) < 1e-10 && Math.abs(matrix[1][1] - 1) < 1e-10 &&
            Math.abs(matrix[0][1]) < 1e-10 && Math.abs(matrix[1][0]) < 1e-10) {
            classification.push("Identity");
        }

        // Check for rotation
        if (Math.abs(det - 1) < 1e-10 && 
            Math.abs(matrix[0][0] - matrix[1][1]) < 1e-10 &&
            Math.abs(matrix[0][1] + matrix[1][0]) < 1e-10) {
            const angle = Math.acos(matrix[0][0]) * 180 / Math.PI;
            classification.push(`Rotation (${angle.toFixed(1)}°)`);
        }

        // Check for reflection
        if (Math.abs(det + 1) < 1e-10) {
            classification.push("Reflection");
        }

        // Check for scaling
        if (Math.abs(matrix[0][1]) < 1e-10 && Math.abs(matrix[1][0]) < 1e-10) {
            classification.push(`Scaling (${matrix[0][0].toFixed(2)}, ${matrix[1][1].toFixed(2)})`);
        }

        // Check for shear
        if (Math.abs(det - 1) < 1e-10 && 
            (Math.abs(matrix[0][1]) > 1e-10 || Math.abs(matrix[1][0]) > 1e-10)) {
            classification.push("Shear");
        }

        // Determinant analysis
        if (Math.abs(det) < 1e-10) {
            classification.push("Singular (no inverse)");
        } else if (det < 0) {
            classification.push("Orientation-reversing");
        } else {
            classification.push("Orientation-preserving");
        }

        return classification.length > 0 ? classification : ["General linear transformation"];
    }

/**
     * Add matrix to calculator
     */
    addMatrix(input) {
        const parsed = this.parseMatrixInput(input);

        if (!parsed) {
            console.log("❌ Invalid matrix format!");
            console.log("💡 Examples:");
            console.log("  • matrix [[1,2],[3,4]]     → Standard notation");
            console.log("  • matrix [1,2,3,4]         → Flat array for 2x2");
            console.log("  • matrix 1 2 3 4           → Space separated");
            console.log("  • matrix rotation 45       → Rotation by 45°");
            console.log("  • matrix scale 2 3         → Scale by (2,3)");
            console.log("  • matrix reflection x      → Reflect across x-axis");
            console.log("  • matrix shear 0.5 0       → Shear transformation");
            return false;
        }

        // Validate matrix values
        const flat = parsed.values.flat();
        if (flat.some(val => isNaN(val))) {
            console.log("❌ Invalid matrix values! Please use numbers only.");
            return false;
        }

        // Calculate matrix properties
        const matrixData = this.analyzeMatrix(parsed.values, parsed.description);

        this.matrixCounter++;
        this.matrixHistory.push({
            id: this.matrixCounter,
            input: input,
            matrix: parsed.values,
            data: matrixData,
            description: parsed.description
        });

        // Display analysis
        this.displayMatrixAnalysis(matrixData);

        // Save visualization
        this.saveMatrixGraph(matrixData);

        return true;
    }

    /**
     * Analyze matrix and calculate all properties
     */
    analyzeMatrix(matrix, description = null) {
        const det = this.calculateDeterminant(matrix);
        const trace = this.calculateTrace(matrix);
        const transposed = this.transposeMatrix(matrix);
        const inverse = matrix.length === 2 ? this.invertMatrix2x2(matrix) : null;
        const eigenvalues = matrix.length === 2 ? this.calculateEigenvalues2x2(matrix) : null;
        const classifications = this.classifyTransformation(matrix);

        // Create test grid points
        const gridPoints = this.createTestGrid();
        const transformedPoints = gridPoints.map(p => this.transformPoint(matrix, p));

        // Create basis vectors
        const basisVectors = [
            { original: { x: 1, y: 0 }, transformed: this.transformPoint(matrix, { x: 1, y: 0 }) },
            { original: { x: 0, y: 1 }, transformed: this.transformPoint(matrix, { x: 0, y: 1 }) }
        ];

        return {
            matrix,
            description,
            determinant: det,
            trace,
            transposed,
            inverse,
            eigenvalues,
            classifications,
            gridPoints,
            transformedPoints,
            basisVectors,
            isInvertible: inverse !== null
        };
    }

    /**
     * Create test grid for visualization
     */
    createTestGrid() {
        const points = [];
        for (let x = -5; x <= 5; x++) {
            for (let y = -5; y <= 5; y++) {
                points.push({ x, y });
            }
        }
        return points;
    }

    /**
     * Display comprehensive matrix analysis
     */
    displayMatrixAnalysis(data) {
        const { matrix, description, determinant, trace, transposed, inverse, 
                eigenvalues, classifications } = data;

        console.log(`\n🔢 MATRIX ANALYSIS`);
        console.log("=".repeat(60));

        if (description) {
            console.log(`📝 Description: ${description}`);
        }

        // Original matrix
        console.log(`\n📊 Original Matrix:`);
        this.printMatrix(matrix);

        // Properties
        console.log(`\n📐 Properties:`);
        console.log(`   Determinant: ${determinant.toFixed(4)}`);
        console.log(`   Trace: ${trace.toFixed(4)}`);
        console.log(`   Invertible: ${inverse ? '✓ Yes' : '✗ No'}`);

        // Classifications
        console.log(`\n🏷️  Classification:`);
        classifications.forEach(c => console.log(`   • ${c}`));

        // Eigenvalues
        if (eigenvalues) {
            console.log(`\n🔬 Eigenvalues:`);
            if (eigenvalues.isReal) {
                console.log(`   λ₁ = ${eigenvalues.lambda1.real.toFixed(4)}`);
                console.log(`   λ₂ = ${eigenvalues.lambda2.real.toFixed(4)}`);
            } else {
                console.log(`   λ₁ = ${eigenvalues.lambda1.real.toFixed(4)} + ${eigenvalues.lambda1.imag.toFixed(4)}i`);
                console.log(`   λ₂ = ${eigenvalues.lambda2.real.toFixed(4)} - ${eigenvalues.lambda2.imag.toFixed(4)}i`);
            }
        }

        // Transposed matrix
        console.log(`\n🔄 Transposed Matrix:`);
        this.printMatrix(transposed);

        // Inverse matrix
        if (inverse) {
            console.log(`\n↩️  Inverse Matrix:`);
            this.printMatrix(inverse);
        }

        // Basis transformation
        console.log(`\n📍 Basis Vector Transformation:`);
        console.log(`   î: (1,0) → (${data.basisVectors[0].transformed.x.toFixed(2)}, ${data.basisVectors[0].transformed.y.toFixed(2)})`);
        console.log(`   ĵ: (0,1) → (${data.basisVectors[1].transformed.x.toFixed(2)}, ${data.basisVectors[1].transformed.y.toFixed(2)})`);

        // Area/Volume scaling
        console.log(`\n📏 Geometric Effects:`);
        console.log(`   Area scaling factor: ${Math.abs(determinant).toFixed(4)}`);
        if (determinant < 0) {
            console.log(`   ⚠️  Orientation reversed`);
        }

        console.log("=".repeat(60));
    }

    /**
     * Print matrix in formatted way
     */
    printMatrix(matrix) {
        const formatted = matrix.map(row => 
            '   [ ' + row.map(val => val.toFixed(4).padStart(8)).join(', ') + ' ]'
        ).join('\n');
        console.log(formatted);
    }

    /**
     * Save matrix visualization graph
     */
    async saveMatrixGraph(matrixData) {
        try {
            const canvas = createCanvas(this.calculator.width * 2, this.calculator.height);
            const ctx = canvas.getContext('2d');

            this.drawMatrixVisualization(ctx, matrixData);

            const filename = `matrix_${String(this.matrixCounter).padStart(3, '0')}_transformation.png`;
            const filepath = path.join('./temp', filename);

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filepath, buffer);

            console.log(`💾 Matrix visualization saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving matrix graph:", error);
        }
    }

    /**
     * Draw complete matrix visualization (side-by-side comparison)
     */
    drawMatrixVisualization(ctx, matrixData) {
        const width = this.calculator.width;
        const height = this.calculator.height;

        // Draw original on left, transformed on right
        this.drawMatrixSide(ctx, matrixData, 0, false); // Original
        this.drawMatrixSide(ctx, matrixData, width, true); // Transformed

        // Draw dividing line
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.lineTo(width, height);
        ctx.stroke();

        // Add labels
        ctx.fillStyle = 'black';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Original', width / 2, 30);
        ctx.fillText('Transformed', width * 1.5, 30);
    }

    /**
     * Draw one side of matrix visualization
     */
    drawMatrixSide(ctx, matrixData, offsetX, isTransformed) {
        const width = this.calculator.width;
        const height = this.calculator.height;

        // Save context and translate
        ctx.save();
        ctx.translate(offsetX, 0);

        // Create temporary calculator for this side
        const tempCalc = this.createFreshCalculator();
        
        // Draw grid and axes
        tempCalc.drawGrid(ctx);

        // Draw grid transformation if enabled
        if (this.matrixSettings.showGrid) {
            this.drawTransformedGrid(ctx, matrixData, tempCalc, isTransformed);
        }

        // Draw basis vectors
        if (this.matrixSettings.showBasis) {
            this.drawBasisVectors(ctx, matrixData, tempCalc, isTransformed);
        }

        // Draw unit square transformation
        this.drawUnitSquare(ctx, matrixData, tempCalc, isTransformed);

        // Draw matrix info panel
        this.drawMatrixInfoPanel(ctx, matrixData, isTransformed);

        ctx.restore();
    }

    /**
     * Draw transformed grid lines
     */
    drawTransformedGrid(ctx, matrixData, calculator, isTransformed) {
        ctx.strokeStyle = this.matrixSettings.gridColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;

        const gridRange = 5;
        
        for (let i = -gridRange; i <= gridRange; i++) {
            // Vertical grid lines
            const line1 = [
                { x: i, y: -gridRange },
                { x: i, y: gridRange }
            ];

            // Horizontal grid lines
            const line2 = [
                { x: -gridRange, y: i },
                { x: gridRange, y: i }
            ];

            if (isTransformed) {
                this.drawTransformedLine(ctx, line1, matrixData.matrix, calculator);
                this.drawTransformedLine(ctx, line2, matrixData.matrix, calculator);
            } else {
                this.drawLine(ctx, line1, calculator);
                this.drawLine(ctx, line2, calculator);
            }
        }

        ctx.globalAlpha = 1.0;
    }

    /**
     * Draw line between two points
     */
    drawLine(ctx, points, calculator) {
        if (points.length < 2) return;

        ctx.beginPath();
        const [startX, startY] = calculator.graphToScreen(points[0].x, points[0].y);
        ctx.moveTo(startX, startY);

        for (let i = 1; i < points.length; i++) {
            const [x, y] = calculator.graphToScreen(points[i].x, points[i].y);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    /**
     * Draw transformed line
     */
    drawTransformedLine(ctx, points, matrix, calculator) {
        const transformed = points.map(p => this.transformPoint(matrix, p));
        this.drawLine(ctx, transformed, calculator);
    }
/**
     * Draw basis vectors
     */
    drawBasisVectors(ctx, matrixData, calculator, isTransformed) {
        const { basisVectors } = matrixData;

        // i-hat (x-axis basis vector) - red
        const iHat = isTransformed ? basisVectors[0].transformed : basisVectors[0].original;
        this.drawVectorFromOrigin(ctx, iHat, calculator, '#ff0000', 'î');

        // j-hat (y-axis basis vector) - blue
        const jHat = isTransformed ? basisVectors[1].transformed : basisVectors[1].original;
        this.drawVectorFromOrigin(ctx, jHat, calculator, '#0066ff', 'ĵ');
    }

    /**
     * Draw vector from origin
     */
    drawVectorFromOrigin(ctx, point, calculator, color, label) {
        const origin = calculator.graphToScreen(0, 0);
        const end = calculator.graphToScreen(point.x, point.y);

        // Draw arrow
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;

        // Line
        ctx.beginPath();
        ctx.moveTo(origin[0], origin[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();

        // Arrowhead
        const angle = Math.atan2(end[1] - origin[1], end[0] - origin[0]);
        const arrowLength = 15;
        const arrowAngle = Math.PI / 6;

        ctx.beginPath();
        ctx.moveTo(end[0], end[1]);
        ctx.lineTo(
            end[0] - arrowLength * Math.cos(angle - arrowAngle),
            end[1] - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.lineTo(
            end[0] - arrowLength * Math.cos(angle + arrowAngle),
            end[1] - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.closePath();
        ctx.fill();

        // Label
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, end[0] + 15, end[1] - 10);
    }

    /**
     * Draw unit square and its transformation
     */
    drawUnitSquare(ctx, matrixData, calculator, isTransformed) {
        // Define unit square vertices
        const square = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 },
            { x: 0, y: 0 } // Close the square
        ];

        const vertices = isTransformed 
            ? square.map(p => this.transformPoint(matrixData.matrix, p))
            : square;

        // Draw filled square
        ctx.fillStyle = isTransformed 
            ? 'rgba(255, 0, 0, 0.15)' 
            : 'rgba(0, 100, 255, 0.15)';
        
        ctx.beginPath();
        const [startX, startY] = calculator.graphToScreen(vertices[0].x, vertices[0].y);
        ctx.moveTo(startX, startY);
        
        for (let i = 1; i < vertices.length; i++) {
            const [x, y] = calculator.graphToScreen(vertices[i].x, vertices[i].y);
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        // Draw outline
        ctx.strokeStyle = isTransformed ? '#ff0000' : '#0066ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw vertices
        for (let i = 0; i < vertices.length - 1; i++) {
            const [x, y] = calculator.graphToScreen(vertices[i].x, vertices[i].y);
            ctx.fillStyle = isTransformed ? '#ff0000' : '#0066ff';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    /**
     * Draw matrix information panel
     */
    drawMatrixInfoPanel(ctx, matrixData, isTransformed) {
        const { matrix, determinant, classifications } = matrixData;

        // Background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(10, 50, 200, 150);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 50, 200, 150);

        // Title
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(isTransformed ? 'After Transformation' : 'Before Transformation', 20, 65);

        // Matrix display
        ctx.font = '10px Courier New';
        let yPos = 85;
        
        if (!isTransformed) {
            ctx.fillText('Matrix:', 20, yPos);
            yPos += 15;
            matrix.forEach(row => {
                const rowStr = '[ ' + row.map(v => v.toFixed(2).padStart(6)).join(' ') + ' ]';
                ctx.fillText(rowStr, 20, yPos);
                yPos += 12;
            });

            yPos += 5;
            ctx.font = '10px Arial';
            ctx.fillText(`det = ${determinant.toFixed(3)}`, 20, yPos);
            yPos += 15;
            ctx.fillText(`Area scale: ${Math.abs(determinant).toFixed(3)}x`, 20, yPos);
        } else {
            ctx.font = '9px Arial';
            yPos = 80;
            ctx.fillText('Type:', 20, yPos);
            yPos += 12;
            classifications.slice(0, 3).forEach(c => {
                const shortC = c.length > 28 ? c.substring(0, 25) + '...' : c;
                ctx.fillText('• ' + shortC, 20, yPos);
                yPos += 12;
            });
        }
    }

    /**
     * Display matrix history
     */
    displayMatrixHistory() {
        console.log(`\n📜 Matrix History (${this.matrixCounter} matrices)`);
        console.log("=".repeat(50));

        if (this.matrixHistory.length === 0) {
            console.log("No matrices added yet.");
            return;
        }

        this.matrixHistory.forEach(entry => {
            const { matrix, data } = entry;
            console.log(`${entry.id}. ${entry.input}`);
            if (entry.description) {
                console.log(`   Description: ${entry.description}`);
            }
            console.log(`   Determinant: ${data.determinant.toFixed(3)}`);
            console.log(`   Type: ${data.classifications[0]}`);
            console.log("");
        });
    }

    /**
     * Toggle matrix display settings
     */
    toggleMatrixSettings() {
        console.log("\n🎛️ Matrix Display Settings:");
        console.log(`   Show Grid: ${this.matrixSettings.showGrid ? '✓ Enabled' : '✗ Disabled'}`);
        console.log(`   Show Basis: ${this.matrixSettings.showBasis ? '✓ Enabled' : '✗ Disabled'}`);
        console.log(`   Show Eigenvalues: ${this.matrixSettings.showEigenvalues ? '✓ Enabled' : '✗ Disabled'}`);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Enter setting to toggle (grid/basis/eigenvalues) or 'cancel': ", (input) => {
            switch (input.toLowerCase()) {
                case 'grid':
                    this.matrixSettings.showGrid = !this.matrixSettings.showGrid;
                    console.log(`Grid display ${this.matrixSettings.showGrid ? 'enabled' : 'disabled'}`);
                    break;
                case 'basis':
                    this.matrixSettings.showBasis = !this.matrixSettings.showBasis;
                    console.log(`Basis display ${this.matrixSettings.showBasis ? 'enabled' : 'disabled'}`);
                    break;
                case 'eigenvalues':
                    this.matrixSettings.showEigenvalues = !this.matrixSettings.showEigenvalues;
                    console.log(`Eigenvalues display ${this.matrixSettings.showEigenvalues ? 'enabled' : 'disabled'}`);
                    break;
                case 'cancel':
                    console.log("No changes made.");
                    break;
                default:
                    console.log("❌ Invalid setting. Use 'grid', 'basis', 'eigenvalues', or 'cancel'.");
            }
            rl.close();
        });
    }

/**
     * Parse linear equation to extract slope and intercept
     */
    parseLinear(equation) {
        const cleanEq = equation.replace(/\s/g, '').replace('y=', '');

        const patterns = [
            /^([+-]?\d*\.?\d*)\*?x([+-]\d+\.?\d*)?$/,
            /^x([+-]\d+\.?\d*)?$/,
            /^([+-]?\d*\.?\d*)\*?x$/,
            /^x$/,
            /^([+-]?\d+\.?\d*)$/
        ];

        for (let pattern of patterns) {
            const match = cleanEq.match(pattern);
            if (match) {
                let slope, intercept;

                if (pattern.source.includes('x')) {
                    slope = match[1] !== undefined ? match[1] : '1';
                    if (slope === '' || slope === '+') slope = '1';
                    if (slope === '-') slope = '-1';
                    slope = parseFloat(slope);

                    intercept = match[2] ? parseFloat(match[2]) : 0;
                } else {
                    slope = 0;
                    intercept = parseFloat(match[1]);
                }

                return { slope, intercept, isLinear: true };
            }
        }

        return { isLinear: false };
    }

    /**
     * Parse quadratic equation to extract coefficients
     */
    parseQuadratic(equation) {
        const cleanEq = equation.replace(/\s/g, '').replace('y=', '');

        // Vertex form pattern: a(x-h)**2+k or a(x+h)**2+k
        const vertexPattern = /^([+-]?\d*\.?\d*)\(x([+-]\d+\.?\d*)\)\*\*2([+-]\d+\.?\d*)?$/;
        const vertexMatch = cleanEq.match(vertexPattern);

        if (vertexMatch) {
            let a = vertexMatch[1] || '1';
            if (a === '' || a === '+') a = '1';
            if (a === '-') a = '-1';
            a = parseFloat(a);

            const h = -parseFloat(vertexMatch[2]); // Note: negative because (x-h) form
            const k = vertexMatch[3] ? parseFloat(vertexMatch[3]) : 0;

            return { a, h, k, isQuadratic: true, form: 'vertex' };
        }

        // Standard form pattern: ax**2+bx+c
        const standardPatterns = [
            // Full form: ax**2+bx+c
            /^([+-]?\d*\.?\d*)\*?x\*\*2([+-]\d*\.?\d*)\*?x([+-]\d+\.?\d*)?$/,
            // No linear term: ax**2+c
            /^([+-]?\d*\.?\d*)\*?x\*\*2([+-]\d+\.?\d*)?$/,
            // Just x**2 with terms: x**2+bx+c
            /^x\*\*2([+-]\d*\.?\d*)\*?x([+-]\d+\.?\d*)?$/,
            // Just x**2 with constant: x**2+c
            /^x\*\*2([+-]\d+\.?\d*)?$/,
            // Just x**2
            /^x\*\*2$/
        ];

        for (let pattern of standardPatterns) {
            const match = cleanEq.match(pattern);
            if (match) {
                let a, b, c;

                if (pattern.source === '^x\\*\\*2$') {
                    // Just x**2
                    a = 1; b = 0; c = 0;
                } else if (pattern.source.includes('bx')) {
                    // Has linear term
                    a = match[1] || '1';
                    if (a === '' || a === '+') a = '1';
                    if (a === '-') a = '-1';
                    a = parseFloat(a);

                    b = match[2] || '0';
                    if (b === '+' || b === '') b = '1';
                    if (b === '-') b = '-1';
                    b = parseFloat(b);

                    c = match[3] ? parseFloat(match[3]) : 0;
                } else {
                    // No linear term or simple forms
                    if (match[1] !== undefined) {
                        a = match[1] || '1';
                        if (a === '' || a === '+') a = '1';
                        if (a === '-') a = '-1';
                        a = parseFloat(a);

                        b = 0;
                        c = match[2] ? parseFloat(match[2]) : 0;
                    } else {
                        // x**2 + constant form
                        a = 1;
                        b = 0;
                        c = match[1] ? parseFloat(match[1]) : 0;
                    }
                }

                // Convert to vertex form: h = -b/(2a), k = c - b²/(4a)
                const h = b !== 0 ? -b / (2 * a) : 0;
                const k = c - (b * b) / (4 * a);

                return { a, b, c, h, k, isQuadratic: true, form: 'standard' };
            }
        }

        return { isQuadratic: false };
    }

/**
 * Parse cubic polynomial equation
 */
parseCubic(equation) {
    const cleanEq = equation.replace(/\s/g, '').replace('y=', '');

    // Pattern: ax**3+bx**2+cx+d
    const pattern = /^([+-]?\d*\.?\d*)\*?x\*\*3([+-]\d*\.?\d*)\*?x\*\*2([+-]\d*\.?\d*)\*?x([+-]\d+\.?\d*)?$/;
    const match = cleanEq.match(pattern);

    if (match) {
        let a = match[1] || '1';
        if (a === '' || a === '+') a = '1';
        if (a === '-') a = '-1';
        a = parseFloat(a);

        let b = match[2] || '0';
        if (b === '+') b = '1';
        if (b === '-') b = '-1';
        b = parseFloat(b);

        let c = match[3] || '0';
        if (c === '+') c = '1';
        if (c === '-') c = '-1';
        c = parseFloat(c);

        let d = match[4] ? parseFloat(match[4]) : 0;

        return { a, b, c, d, isCubic: true };
    }

    // Simple x**3 pattern
    if (cleanEq.match(/^([+-]?\d*\.?\d*)\*?x\*\*3$/)) {
        const simpleMatch = cleanEq.match(/^([+-]?\d*\.?\d*)\*?x\*\*3$/);
        let a = simpleMatch[1] || '1';
        if (a === '' || a === '+') a = '1';
        if (a === '-') a = '-1';
        return { a: parseFloat(a), b: 0, c: 0, d: 0, isCubic: true };
    }

    return { isCubic: false };
}

/**
 * Parse exponential equation
 */
parseExponential(equation) {
    const cleanEq = equation.replace(/\s/g, '').replace('y=', '');

    // Pattern: a*base**x or a*base**(bx+c)+d
    const patterns = [
        /^([+-]?\d*\.?\d*)\*?(\d*\.?\d+)\*\*x$/,  // a*base**x
        /^([+-]?\d*\.?\d*)\*?e\*\*x$/,  // a*e**x
        /^([+-]?\d*\.?\d*)\*?e\*\*\(([+-]?\d*\.?\d*)x\)$/,  // a*e**(bx)
        /^([+-]?\d*\.?\d*)\*?e\*\*\(([+-]?\d*\.?\d*)x([+-]\d+\.?\d*)\)$/,  // a*e**(bx+c)
    ];

    for (let pattern of patterns) {
        const match = cleanEq.match(pattern);
        if (match) {
            let coefficient = match[1] || '1';
            if (coefficient === '' || coefficient === '+') coefficient = '1';
            if (coefficient === '-') coefficient = '-1';

            let base = 'e';
            let exponentCoeff = 1;
            let exponentShift = 0;

            if (pattern === patterns[0]) {
                base = parseFloat(match[2]);
            } else if (match[2]) {
                exponentCoeff = parseFloat(match[2]);
            }
            if (match[3]) {
                exponentShift = parseFloat(match[3]);
            }

            return {
                coefficient: parseFloat(coefficient),
                base: base === 'e' ? Math.E : base,
                exponentCoeff,
                exponentShift,
                isExponential: true
            };
        }
    }

    return { isExponential: false };
}

/**
 * Parse logarithmic equation
 */
parseLogarithmic(equation) {
    const cleanEq = equation.replace(/\s/g, '').replace('y=', '');

    // Patterns for logarithmic functions
    const patterns = [
        /^([+-]?\d*\.?\d*)\*?log\(x\)$/,  // a*log(x)
        /^([+-]?\d*\.?\d*)\*?log\(x,(\d+)\)$/,  // a*log(x,base)
        /^([+-]?\d*\.?\d*)\*?log\(x([+-]\d+\.?\d*)\)$/,  // a*log(x+b)
        /^([+-]?\d*\.?\d*)\*?log\(([+-]?\d*\.?\d*)x\)$/,  // a*log(bx)
    ];

    for (let pattern of patterns) {
        const match = cleanEq.match(pattern);
        if (match) {
            let coefficient = match[1] || '1';
            if (coefficient === '' || coefficient === '+') coefficient = '1';
            if (coefficient === '-') coefficient = '-1';

            let base = Math.E; // Natural log by default
            let xCoeff = 1;
            let xShift = 0;

            if (pattern === patterns[1]) {
                base = parseFloat(match[2]);
            } else if (pattern === patterns[2]) {
                xShift = parseFloat(match[2]);
            } else if (pattern === patterns[3]) {
                xCoeff = parseFloat(match[2]);
            }

            return {
                coefficient: parseFloat(coefficient),
                base,
                xCoeff,
                xShift,
                isLogarithmic: true
            };
        }
    }

    return { isLogarithmic: false };
}

/**
 * Parse trigonometric equation
 */
parseTrigonometric(equation) {
    const cleanEq = equation.replace(/\s/g, '').replace('y=', '');

    // Patterns for trig functions: a*func(bx+c)+d
    const funcPattern = /(sin|cos|tan|asin|acos|atan)/;
    const match = cleanEq.match(funcPattern);

    if (!match) return { isTrigonometric: false };

    const func = match[1];

    // Extract coefficients: a*func(bx+c)+d
    const fullPattern = /^([+-]?\d*\.?\d*)\*?(sin|cos|tan|asin|acos|atan)\(([+-]?\d*\.?\d*)x?([+-]\d*\.?\d*)?\)([+-]\d+\.?\d*)?$/;
    const fullMatch = cleanEq.match(fullPattern);

    if (fullMatch) {
        let amplitude = fullMatch[1] || '1';
        if (amplitude === '' || amplitude === '+') amplitude = '1';
        if (amplitude === '-') amplitude = '-1';

        let frequency = fullMatch[3] || '1';
        if (frequency === '' || frequency === '+') frequency = '1';
        if (frequency === '-') frequency = '-1';

        let phase = fullMatch[4] ? parseFloat(fullMatch[4]) : 0;
        let verticalShift = fullMatch[5] ? parseFloat(fullMatch[5]) : 0;

        return {
            function: func,
            amplitude: parseFloat(amplitude),
            frequency: parseFloat(frequency),
            phase,
            verticalShift,
            isTrigonometric: true
        };
    }

    return { isTrigonometric: false };
}

/**
 * Parse absolute value equation
 */
parseAbsoluteValue(equation) {
    const cleanEq = equation.replace(/\s/g, '').replace('y=', '');

    // Pattern: a*abs(bx+c)+d
    const pattern = /^([+-]?\d*\.?\d*)\*?abs\(([+-]?\d*\.?\d*)x([+-]\d+\.?\d*)?\)([+-]\d+\.?\d*)?$/;
    const match = cleanEq.match(pattern);

    if (match) {
        let coefficient = match[1] || '1';
        if (coefficient === '' || coefficient === '+') coefficient = '1';
        if (coefficient === '-') coefficient = '-1';

        let xCoeff = match[2] || '1';
        if (xCoeff === '' || xCoeff === '+') xCoeff = '1';
        if (xCoeff === '-') xCoeff = '-1';

        let xShift = match[3] ? parseFloat(match[3]) : 0;
        let verticalShift = match[4] ? parseFloat(match[4]) : 0;

        return {
            coefficient: parseFloat(coefficient),
            xCoeff: parseFloat(xCoeff),
            xShift,
            verticalShift,
            isAbsoluteValue: true
        };
    }

    // Multiple absolute values: abs(x)+abs(x-4)
    if (cleanEq.includes('abs') && cleanEq.split('abs').length > 2) {
        return { isAbsoluteValue: true, isMultiple: true };
    }

    return { isAbsoluteValue: false };
}

/**
 * Parse square root equation
 */
parseSquareRoot(equation) {
    const cleanEq = equation.replace(/\s/g, '').replace('y=', '');

    // Pattern: a*sqrt(bx+c)+d
    const pattern = /^([+-]?\d*\.?\d*)\*?sqrt\(([+-]?\d*\.?\d*)x([+-]\d+\.?\d*)?\)([+-]\d+\.?\d*)?$/;
    const match = cleanEq.match(pattern);

    if (match) {
        let coefficient = match[1] || '1';
        if (coefficient === '' || coefficient === '+') coefficient = '1';
        if (coefficient === '-') coefficient = '-1';

        let xCoeff = match[2] || '1';
        if (xCoeff === '' || xCoeff === '+') xCoeff = '1';
        if (xCoeff === '-') xCoeff = '-1';

        let xShift = match[3] ? parseFloat(match[3]) : 0;
        let verticalShift = match[4] ? parseFloat(match[4]) : 0;

        return {
            coefficient: parseFloat(coefficient),
            xCoeff: parseFloat(xCoeff),
            xShift,
            verticalShift,
            isSquareRoot: true
        };
    }

    return { isSquareRoot: false };
}

/**
 * Parse rational equation
 */
parseRational(equation) {
    const cleanEq = equation.replace(/\s/g, '').replace('y=', '');

    // Check if it contains division
    if (!cleanEq.includes('/')) return { isRational: false };

    // Pattern: numerator/denominator
    const parts = cleanEq.split('/');
    if (parts.length === 2) {
        return {
            numerator: parts[0],
            denominator: parts[1],
            isRational: true
        };
    }

    return { isRational: false };
}

/**
 * Parse special functions (floor, ceil, sign, max)
 */
parseSpecialFunction(equation) {
    const cleanEq = equation.replace(/\s/g, '').replace('y=', '');

    const specialFuncs = ['floor', 'ceil', 'sign', 'max', 'min'];
    
    for (let func of specialFuncs) {
        if (cleanEq.includes(func)) {
            return {
                function: func,
                isSpecial: true
            };
        }
    }

    return { isSpecial: false };
}

/**
     * Show key points for linear equations
     */
    showLinearPoints(equation, { slope, intercept }) {
        console.log(`📊 Linear Function Analysis:`);
        console.log(`   Slope (m) = ${slope}`);
        console.log(`   Y-intercept (c) = ${intercept}`);

        if (slope === 0) {
            console.log(`   Type: Horizontal line`);
        } else if (slope > 0) {
            console.log(`   Type: Increasing line`);
        } else {
            console.log(`   Type: Decreasing line`);
        }

        console.log(`📍 Key Points:`);

        // Calculate key points
        const keyXValues = [-3, -2, -1, 0, 1, 2, 3];
        keyXValues.forEach(x => {
            const y = slope * x + intercept;
            if (y >= this.calculator.yMin && y <= this.calculator.yMax &&
                x >= this.calculator.xMin && x <= this.calculator.xMax) {
                const marker = x === 0 ? ' ← Y-intercept' : '';
                console.log(`   (${x}, ${y})${marker}`);
            }
        });

        // Show y-intercept specifically
        console.log(`🎯 Y-intercept: (0, ${intercept})`);

        // Show x-intercept if it exists and is reasonable
        if (slope !== 0) {
            const xIntercept = -intercept / slope;
            if (xIntercept >= this.calculator.xMin && xIntercept <= this.calculator.xMax) {
                console.log(`🎯 X-intercept: (${xIntercept.toFixed(2)}, 0)`);
            }
        }
    }

    /**
     * Show key points for quadratic equations
     */
    showQuadraticPoints(equation, { a, h, k, form }) {
        console.log(`📊 Quadratic Function Analysis:`);
        console.log(`📐 Form: ${form === 'vertex' ? 'Vertex' : 'Standard'} form`);
        console.log(`📊 Coefficient a = ${a} (opens ${a > 0 ? 'upward' : 'downward'})`);
        console.log(`🎯 Vertex: (${h}, ${k})`);
        console.log(`📏 Axis of symmetry: x = ${h}`);
        console.log(`📍 Key Points:`);

        // Calculate key points around the vertex
        const keyXOffsets = [-2, -1, 0, 1, 2];
        keyXOffsets.forEach(offset => {
            const x = h + offset;
            const y = a * (x - h) * (x - h) + k;

            if (x >= this.calculator.xMin && x <= this.calculator.xMax &&
                y >= this.calculator.yMin && y <= this.calculator.yMax) {
                const marker = offset === 0 ? ' ← Vertex' : '';
                console.log(`   (${x}, ${y})${marker}`);
            }
        });

        // Show range information
        if (a > 0) {
            console.log(`📈 Range: y ≥ ${k} (minimum value: ${k})`);
        } else {
            console.log(`📈 Range: y ≤ ${k} (maximum value: ${k})`);
        }

        // Show discriminant info if in standard form
        if (form === 'standard') {
            const discriminant = (4 * a) * k - (h * h * 4 * a * a);
            if (discriminant > 0) {
                console.log(`🔄 X-intercepts: Two real roots`);
            } else if (discriminant === 0) {
                console.log(`🔄 X-intercept: One real root (touches x-axis)`);
            } else {
                console.log(`🔄 X-intercepts: No real roots (doesn't touch x-axis)`);
            }
        }
    }

    /**
     * Save individual graph for single equation with coordinate points marked
     */
    async saveIndividualGraph(equation, calculator) {
        try {
            // Create a custom version that marks coordinate points
            const buffer = await this.createGraphWithPoints(equation, calculator);

            const filename = `equation_${String(this.equationCounter).padStart(3, '0')}_${this.sanitizeFilename(equation)}.png`;
            const filepath = path.join('./temp', filename);

            // Create directory if it doesn't exist
            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Individual graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving individual graph:", error);
        }
    }

/**
     * Draw linear function points with connecting line
     */
    drawLinearPoints(ctx, equation, { slope, intercept }, calculator) {
        // Generate points across the viewing window
        const points = [];
        const xMin = calculator.xMin;
        const xMax = calculator.xMax;

        // Create more points for smoother line
        const numPoints = 50;
        for (let i = 0; i <= numPoints; i++) {
            const x = xMin + (xMax - xMin) * i / numPoints;
            const y = slope * x + intercept;

            if (y >= calculator.yMin && y <= calculator.yMax) {
                const [screenX, screenY] = calculator.graphToScreen(x, y);
                points.push({ x, y, screenX, screenY });
            }
        }

        // Draw the connecting line first
        if (points.length > 1) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(points[0].screenX, points[0].screenY);

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].screenX, points[i].screenY);
            }
            ctx.stroke();
        }

        // Mark specific coordinate points
        const keyXValues = [-3, -2, -1, 0, 1, 2, 3];
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        keyXValues.forEach(x => {
            const y = slope * x + intercept;

            if (x >= calculator.xMin && x <= calculator.xMax &&
                y >= calculator.yMin && y <= calculator.yMax) {

                const [screenX, screenY] = calculator.graphToScreen(x, y);

                // Draw point circle
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(screenX, screenY, 4, 0, 2 * Math.PI);
                ctx.fill();

                // Draw coordinate label
                ctx.fillStyle = 'black';
                ctx.fillText(`(${x},${y})`, screenX, screenY - 15);
            }
        });

        // Highlight y-intercept with different color
        if (intercept >= calculator.yMin && intercept <= calculator.yMax &&
            0 >= calculator.xMin && 0 <= calculator.xMax) {
            const [screenX, screenY] = calculator.graphToScreen(0, intercept);
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = 'blue';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`Y-int: (0,${intercept})`, screenX, screenY - 20);
        }
    }

    /**
     * Draw quadratic function points with parabola curve
     */
    drawQuadraticPoints(ctx, equation, { a, h, k }, calculator) {
        // Generate points for smooth parabola
        const points = [];
        const xMin = calculator.xMin;
        const xMax = calculator.xMax;

        const numPoints = 100;
        for (let i = 0; i <= numPoints; i++) {
            const x = xMin + (xMax - xMin) * i / numPoints;
            const y = a * (x - h) * (x - h) + k;

            if (y >= calculator.yMin && y <= calculator.yMax) {
                const [screenX, screenY] = calculator.graphToScreen(x, y);
                points.push({ x, y, screenX, screenY });
            }
        }

        // Draw the parabola curve
        if (points.length > 1) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(points[0].screenX, points[0].screenY);

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].screenX, points[i].screenY);
            }
            ctx.stroke();
        }

        // Mark specific coordinate points around vertex
        const keyXOffsets = [-2, -1, 0, 1, 2];
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        keyXOffsets.forEach(offset => {
            const x = h + offset;
            const y = a * (x - h) * (x - h) + k;

            if (x >= calculator.xMin && x <= calculator.xMax &&
                y >= calculator.yMin && y <= calculator.yMax) {

                const [screenX, screenY] = calculator.graphToScreen(x, y);

                // Color coding: purple for vertex, green for others
                if (offset === 0) {
                    // Vertex point
                    ctx.fillStyle = 'purple';
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.fillStyle = 'purple';
                    ctx.font = 'bold 14px Arial';
                    ctx.fillText(`Vertex: (${x},${y})`, screenX, screenY - 20);
                } else {
                    // Regular points
                    ctx.fillStyle = 'green';
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, 4, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.fillStyle = 'black';
                    ctx.font = '12px Arial';
                    ctx.fillText(`(${x},${y})`, screenX, screenY - 15);
                }
            }
        });

        // Draw axis of symmetry
        if (h >= calculator.xMin && h <= calculator.xMax) {
            const [axisScreenX1, axisScreenY1] = calculator.graphToScreen(h, calculator.yMin);
            const [axisScreenX2, axisScreenY2] = calculator.graphToScreen(h, calculator.yMax);

            ctx.strokeStyle = 'purple';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(axisScreenX1, axisScreenY1);
            ctx.lineTo(axisScreenX2, axisScreenY2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

/**
 * Show key points for cubic equations
 */
showCubicPoints(equation, { a, b, c, d }) {
    console.log(`📊 Cubic Function Analysis:`);
    console.log(`   Equation: ${equation}`);
    console.log(`   Standard form: ${a}x³ + ${b}x² + ${c}x + ${d}`);
    console.log(`   Leading coefficient: ${a} (${a > 0 ? 'rises to right' : 'falls to right'})`);

    // Calculate critical points (where derivative = 0)
    // f'(x) = 3ax² + 2bx + c = 0
    const discriminant = 4 * b * b - 12 * a * c;
    
    if (discriminant > 0) {
        const x1 = (-2 * b + Math.sqrt(discriminant)) / (6 * a);
        const x2 = (-2 * b - Math.sqrt(discriminant)) / (6 * a);
        const y1 = a * x1 ** 3 + b * x1 ** 2 + c * x1 + d;
        const y2 = a * x2 ** 3 + b * x2 ** 2 + c * x2 + d;
        
        console.log(`\n🔍 Critical Points (local extrema):`);
        console.log(`   Point 1: (${x1.toFixed(3)}, ${y1.toFixed(3)})`);
        console.log(`   Point 2: (${x2.toFixed(3)}, ${y2.toFixed(3)})`);
    } else if (discriminant === 0) {
        const x = -2 * b / (6 * a);
        const y = a * x ** 3 + b * x ** 2 + c * x + d;
        console.log(`\n🔍 Inflection Point: (${x.toFixed(3)}, ${y.toFixed(3)})`);
    }

    // Y-intercept
    console.log(`\n🎯 Y-intercept: (0, ${d})`);

    // Sample points
    console.log(`\n📍 Key Points:`);
    const keyXValues = [-2, -1, 0, 1, 2];
    keyXValues.forEach(x => {
        const y = a * x ** 3 + b * x ** 2 + c * x + d;
        if (y >= this.calculator.yMin && y <= this.calculator.yMax) {
            console.log(`   (${x}, ${y.toFixed(3)})`);
        }
    });
}

/**
 * Show key points for exponential equations
 */
showExponentialPoints(equation, { coefficient, base, exponentCoeff, exponentShift }) {
    console.log(`📊 Exponential Function Analysis:`);
    console.log(`   Equation: ${equation}`);
    console.log(`   Coefficient: ${coefficient}`);
    console.log(`   Base: ${base === Math.E ? 'e (natural)' : base}`);
    console.log(`   Growth: ${coefficient * exponentCoeff > 0 ? 'Exponential growth' : 'Exponential decay'}`);

    // Y-intercept (when x = 0)
    const yIntercept = coefficient * Math.pow(base, exponentShift);
    console.log(`\n🎯 Y-intercept: (0, ${yIntercept.toFixed(4)})`);

    // Horizontal asymptote
    console.log(`📏 Horizontal asymptote: y = ${exponentShift !== 0 ? exponentShift : 0}`);

    // Sample points
    console.log(`\n📍 Key Points:`);
    const keyXValues = [-2, -1, 0, 1, 2];
    keyXValues.forEach(x => {
        const y = coefficient * Math.pow(base, exponentCoeff * x + exponentShift);
        if (y >= this.calculator.yMin && y <= this.calculator.yMax && !isNaN(y) && isFinite(y)) {
            console.log(`   (${x}, ${y.toFixed(4)})`);
        }
    });
}

/**
 * Show key points for logarithmic equations
 */
showLogarithmicPoints(equation, { coefficient, base, xCoeff, xShift }) {
    console.log(`📊 Logarithmic Function Analysis:`);
    console.log(`   Equation: ${equation}`);
    console.log(`   Coefficient: ${coefficient}`);
    console.log(`   Base: ${base === Math.E ? 'e (natural log)' : base}`);
    
    // Domain restriction
    const domainStart = -xShift / xCoeff;
    console.log(`\n📏 Domain: x > ${domainStart.toFixed(3)}`);
    console.log(`📏 Vertical asymptote: x = ${domainStart.toFixed(3)}`);

    // X-intercept (when y = 0)
    const xIntercept = (Math.pow(base, 0) - xShift) / xCoeff;
    if (xIntercept > domainStart) {
        console.log(`🎯 X-intercept: (${xIntercept.toFixed(4)}, 0)`);
    }

    // Sample points
    console.log(`\n📍 Key Points:`);
    const keyXValues = [0.1, 0.5, 1, 2, 3, 5, 10].map(x => x + domainStart + 0.1);
    keyXValues.forEach(x => {
        if (x > domainStart) {
            const logArg = xCoeff * x + xShift;
            if (logArg > 0) {
                const y = coefficient * (Math.log(logArg) / Math.log(base));
                if (y >= this.calculator.yMin && y <= this.calculator.yMax && !isNaN(y) && isFinite(y)) {
                    console.log(`   (${x.toFixed(3)}, ${y.toFixed(4)})`);
                }
            }
        }
    });
}

/**
 * Show key points for trigonometric equations
 */
showTrigonometricPoints(equation, { function: func, amplitude, frequency, phase, verticalShift }) {
    console.log(`📊 Trigonometric Function Analysis:`);
    console.log(`   Function: ${func}`);
    console.log(`   Amplitude: ${amplitude}`);
    console.log(`   Frequency: ${frequency}`);
    console.log(`   Phase shift: ${phase}`);
    console.log(`   Vertical shift: ${verticalShift}`);

    // Period
    let period = 2 * Math.PI / Math.abs(frequency);
    if (func === 'tan') {
        period = Math.PI / Math.abs(frequency);
    }
    console.log(`   Period: ${period.toFixed(4)} (${(period * 180 / Math.PI).toFixed(1)}°)`);

    // Range
    if (func === 'sin' || func === 'cos') {
        const minY = verticalShift - Math.abs(amplitude);
        const maxY = verticalShift + Math.abs(amplitude);
        console.log(`\n📏 Range: [${minY}, ${maxY}]`);
    } else if (func === 'tan') {
        console.log(`\n📏 Range: All real numbers`);
        console.log(`⚠️  Vertical asymptotes at x = ${-phase/frequency + Math.PI/(2*frequency)} + nπ/${frequency}`);
    }

    // Sample points
    console.log(`\n📍 Key Points (one period):`);
    const numPoints = 5;
    for (let i = 0; i <= numPoints; i++) {
        const x = i * period / numPoints - phase / frequency;
        let y;
        
        const arg = frequency * x + phase;
        switch (func) {
            case 'sin':
                y = amplitude * Math.sin(arg) + verticalShift;
                break;
            case 'cos':
                y = amplitude * Math.cos(arg) + verticalShift;
                break;
            case 'tan':
                y = amplitude * Math.tan(arg) + verticalShift;
                break;
            case 'asin':
                if (Math.abs(arg) <= 1) y = amplitude * Math.asin(arg) + verticalShift;
                break;
            case 'acos':
                if (Math.abs(arg) <= 1) y = amplitude * Math.acos(arg) + verticalShift;
                break;
            case 'atan':
                y = amplitude * Math.atan(arg) + verticalShift;
                break;
        }
        
        if (y !== undefined && !isNaN(y) && isFinite(y) && 
            y >= this.calculator.yMin && y <= this.calculator.yMax) {
            console.log(`   (${x.toFixed(4)}, ${y.toFixed(4)})`);
        }
    }
}

/**
 * Show key points for absolute value equations
 */
showAbsoluteValuePoints(equation, info) {
    if (info.isMultiple) {
        console.log(`📊 Multiple Absolute Value Function:`);
        console.log(`   Equation: ${equation}`);
        console.log(`   📍 Check graph for visualization of multiple components`);
        return;
    }

    const { coefficient, xCoeff, xShift, verticalShift } = info;
    
    console.log(`📊 Absolute Value Function Analysis:`);
    console.log(`   Form: ${coefficient}|${xCoeff}x ${xShift >= 0 ? '+' : ''}${xShift}| ${verticalShift >= 0 ? '+' : ''}${verticalShift}`);
    
    // Vertex (where expression inside abs = 0)
    const vertexX = -xShift / xCoeff;
    const vertexY = verticalShift;
    console.log(`\n🎯 Vertex: (${vertexX.toFixed(3)}, ${vertexY})`);
    
    // Slopes
    console.log(`📐 Slopes: ${coefficient * xCoeff} (right), ${-coefficient * xCoeff} (left)`);

    // Sample points
    console.log(`\n📍 Key Points:`);
    const keyXValues = [vertexX - 2, vertexX - 1, vertexX, vertexX + 1, vertexX + 2];
    keyXValues.forEach(x => {
        const y = coefficient * Math.abs(xCoeff * x + xShift) + verticalShift;
        if (y >= this.calculator.yMin && y <= this.calculator.yMax) {
            const marker = x === vertexX ? ' ← Vertex' : '';
            console.log(`   (${x.toFixed(3)}, ${y.toFixed(3)})${marker}`);
        }
    });
}

/**
 * Show key points for square root equations
 */
showSquareRootPoints(equation, { coefficient, xCoeff, xShift, verticalShift }) {
    console.log(`📊 Square Root Function Analysis:`);
    console.log(`   Form: ${coefficient}√(${xCoeff}x ${xShift >= 0 ? '+' : ''}${xShift}) ${verticalShift >= 0 ? '+' : ''}${verticalShift}`);
    
    // Starting point (where radicand = 0)
    const startX = -xShift / xCoeff;
    const startY = verticalShift;
    console.log(`\n🎯 Starting point: (${startX.toFixed(3)}, ${startY})`);
    
    // Domain
    if (xCoeff > 0) {
        console.log(`📏 Domain: x ≥ ${startX.toFixed(3)}`);
    } else {
        console.log(`📏 Domain: x ≤ ${startX.toFixed(3)}`);
    }

    // Range
    if (coefficient > 0) {
        console.log(`📏 Range: y ≥ ${startY}`);
    } else {
        console.log(`📏 Range: y ≤ ${startY}`);
    }

    // Sample points
    console.log(`\n📍 Key Points:`);
    const offsets = [0, 1, 4, 9, 16].map(v => v / Math.abs(xCoeff));
    offsets.forEach(offset => {
        const x = startX + (xCoeff > 0 ? offset : -offset);
        const radicand = xCoeff * x + xShift;
        if (radicand >= 0) {
            const y = coefficient * Math.sqrt(radicand) + verticalShift;
            if (y >= this.calculator.yMin && y <= this.calculator.yMax) {
                console.log(`   (${x.toFixed(3)}, ${y.toFixed(3)})`);
            }
        }
    });
}

/**
 * Show key points for rational equations
 */
showRationalPoints(equation, { numerator, denominator }) {
    console.log(`📊 Rational Function Analysis:`);
    console.log(`   Numerator: ${numerator}`);
    console.log(`   Denominator: ${denominator}`);

    // Try to find vertical asymptotes (where denominator = 0)
    console.log(`\n⚠️  Vertical asymptotes: where ${denominator} = 0`);
    
    // For simple cases
    if (denominator === 'x') {
        console.log(`   x = 0`);
    } else if (denominator.match(/x([+-]\d+)/)) {
        const match = denominator.match(/x([+-]\d+)/);
        const asymptote = -parseFloat(match[1]);
        console.log(`   x = ${asymptote}`);
    }

    // Horizontal asymptote analysis
    console.log(`\n📏 Horizontal asymptote: Analyze degrees of numerator and denominator`);

    // Sample points
    console.log(`\n📍 Sample Points:`);
    const keyXValues = [-3, -2, -1, -0.5, 0.5, 1, 2, 3];
    keyXValues.forEach(x => {
        try {
            // This is a simplified evaluation - would need proper expression parser
            console.log(`   Note: Check individual graph for accurate point values`);
        } catch (e) {
            // Skip problematic points
        }
    });
}

/**
 * Show key points for special functions
 */
showSpecialFunctionPoints(equation, { function: func }) {
    console.log(`📊 Special Function Analysis:`);
    console.log(`   Function type: ${func}`);
    
    switch (func) {
        case 'floor':
            console.log(`   Description: Step function (greatest integer ≤ x)`);
            console.log(`   Discontinuous at all integers`);
            break;
        case 'ceil':
            console.log(`   Description: Ceiling function (least integer ≥ x)`);
            console.log(`   Discontinuous at all integers`);
            break;
        case 'sign':
            console.log(`   Description: Sign function (-1, 0, or 1)`);
            console.log(`   Returns: -1 for x<0, 0 for x=0, 1 for x>0`);
            break;
        case 'max':
            console.log(`   Description: Maximum function (ReLU if max(0,x))`);
            console.log(`   Returns maximum of given values`);
            break;
        case 'min':
            console.log(`   Description: Minimum function`);
            console.log(`   Returns minimum of given values`);
            break;
    }

    console.log(`\n📍 Check individual graph for detailed visualization`);
}

/**
     * Add an equation to the calculator
     */
    addEquation(equation) {
        try {
            // Test if equation is valid by creating a fresh calculator
            const testCalc = this.createFreshCalculator();
            if (testCalc.addEquation(equation)) {
                this.equationCounter++;
                this.equationHistory.push(`${this.equationCounter}. ${equation}`);

                // Create individual graph for this equation
                this.saveIndividualGraph(equation, testCalc);

                // Display equation description
                const description = this.getFormulaDescription(equation);
                console.log(`\n📈 ${equation}: ${description}`);
                console.log(`Added equation: ${equation}`);

                // Show calculated key points based on function type
                this.analyzeAndShowKeyPoints(equation);

                return true;
            }
            return false;
        } catch (error) {
            console.log("❌ Invalid equation!");
            return false;
        }
    }

    /**
     * Analyze equation type and show appropriate key points
     */
   analyzeAndShowKeyPoints(equation) {
    // Check for quadratic first
    const quadraticInfo = this.parseQuadratic(equation);
    if (quadraticInfo.isQuadratic) {
        this.showQuadraticPoints(equation, quadraticInfo);
        return;
    }

    // Check for linear
    const linearInfo = this.parseLinear(equation);
    if (linearInfo.isLinear) {
        this.showLinearPoints(equation, linearInfo);
        return;
    }

    // Check for cubic
    const cubicInfo = this.parseCubic(equation);
    if (cubicInfo.isCubic) {
        this.showCubicPoints(equation, cubicInfo);
        return;
    }

    // Check for exponential
    const exponentialInfo = this.parseExponential(equation);
    if (exponentialInfo.isExponential) {
        this.showExponentialPoints(equation, exponentialInfo);
        return;
    }

    // Check for logarithmic
    const logarithmicInfo = this.parseLogarithmic(equation);
    if (logarithmicInfo.isLogarithmic) {
        this.showLogarithmicPoints(equation, logarithmicInfo);
        return;
    }

    // Check for trigonometric
    const trigInfo = this.parseTrigonometric(equation);
    if (trigInfo.isTrigonometric) {
        this.showTrigonometricPoints(equation, trigInfo);
        return;
    }

    // Check for absolute value
    const absInfo = this.parseAbsoluteValue(equation);
    if (absInfo.isAbsoluteValue) {
        this.showAbsoluteValuePoints(equation, absInfo);
        return;
    }

    // Check for square root
    const sqrtInfo = this.parseSquareRoot(equation);
    if (sqrtInfo.isSquareRoot) {
        this.showSquareRootPoints(equation, sqrtInfo);
        return;
    }

    // Check for rational
    const rationalInfo = this.parseRational(equation);
    if (rationalInfo.isRational) {
        this.showRationalPoints(equation, rationalInfo);
        return;
    }

    // Check for special functions
    const specialInfo = this.parseSpecialFunction(equation);
    if (specialInfo.isSpecial) {
        this.showSpecialFunctionPoints(equation, specialInfo);
        return;
    }

    // For other functions, show general analysis
    console.log(`📊 Function Analysis: ${equation}`);
    console.log(`📍 General function - check individual graph for visualization`);
}

/**
     * Mark coordinate points on the graph with proper line connections
     */
markCoordinatePoints(ctx, equation, calculator) {
    // Check for each function type in order
    const quadraticInfo = this.parseQuadratic(equation);
    if (quadraticInfo.isQuadratic) {
        this.drawQuadraticPoints(ctx, equation, quadraticInfo, calculator);
        return;
    }

    const linearInfo = this.parseLinear(equation);
    if (linearInfo.isLinear) {
        this.drawLinearPoints(ctx, equation, linearInfo, calculator);
        return;
    }

    const cubicInfo = this.parseCubic(equation);
    if (cubicInfo.isCubic) {
        this.drawCubicPoints(ctx, equation, cubicInfo, calculator);
        return;
    }

    const exponentialInfo = this.parseExponential(equation);
    if (exponentialInfo.isExponential) {
        this.drawExponentialPoints(ctx, equation, exponentialInfo, calculator);
        return;
    }

    const logarithmicInfo = this.parseLogarithmic(equation);
    if (logarithmicInfo.isLogarithmic) {
        this.drawLogarithmicPoints(ctx, equation, logarithmicInfo, calculator);
        return;
    }

    const trigInfo = this.parseTrigonometric(equation);
    if (trigInfo.isTrigonometric) {
        this.drawTrigonometricPoints(ctx, equation, trigInfo, calculator);
        return;
    }

    const absInfo = this.parseAbsoluteValue(equation);
    if (absInfo.isAbsoluteValue) {
        this.drawAbsoluteValuePoints(ctx, equation, absInfo, calculator);
        return;
    }

    const sqrtInfo = this.parseSquareRoot(equation);
    if (sqrtInfo.isSquareRoot) {
        this.drawSquareRootPoints(ctx, equation, sqrtInfo, calculator);
        return;
    }

    const rationalInfo = this.parseRational(equation);
    if (rationalInfo.isRational) {
        this.drawRationalPoints(ctx, equation, rationalInfo, calculator);
        return;
    }

    const specialInfo = this.parseSpecialFunction(equation);
    if (specialInfo.isSpecial) {
        this.drawSpecialFunctionPoints(ctx, equation, specialInfo, calculator);
        return;
    }

    // For other functions, just draw the standard curve
    console.log(`📊 Standard function visualization for: ${equation}`);
}

/**
 * Draw cubic function points with connecting curve
 */
drawCubicPoints(ctx, equation, { a, b, c, d }, calculator) {
    const points = [];
    const xMin = calculator.xMin;
    const xMax = calculator.xMax;
    const numPoints = 100;

    for (let i = 0; i <= numPoints; i++) {
        const x = xMin + (xMax - xMin) * i / numPoints;
        const y = a * x ** 3 + b * x ** 2 + c * x + d;

        if (y >= calculator.yMin && y <= calculator.yMax) {
            const [screenX, screenY] = calculator.graphToScreen(x, y);
            points.push({ x, y, screenX, screenY });
        }
    }

    // Draw the curve
    if (points.length > 1) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].screenX, points[0].screenY);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].screenX, points[i].screenY);
        }
        ctx.stroke();
    }

    // Mark critical points
    const discriminant = 4 * b * b - 12 * a * c;
    if (discriminant >= 0) {
        const x1 = (-2 * b + Math.sqrt(discriminant)) / (6 * a);
        const x2 = (-2 * b - Math.sqrt(discriminant)) / (6 * a);

        [x1, x2].forEach((x, idx) => {
            if (x >= calculator.xMin && x <= calculator.xMax) {
                const y = a * x ** 3 + b * x ** 2 + c * x + d;
                if (y >= calculator.yMin && y <= calculator.yMax) {
                    const [screenX, screenY] = calculator.graphToScreen(x, y);
                    
                    ctx.fillStyle = 'purple';
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.fillStyle = 'purple';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Critical (${x.toFixed(2)},${y.toFixed(2)})`, screenX, screenY - 15);
                }
            }
        });
    }

    // Mark key integer points
    ctx.font = '11px Arial';
    [-2, -1, 0, 1, 2].forEach(x => {
        if (x >= calculator.xMin && x <= calculator.xMax) {
            const y = a * x ** 3 + b * x ** 2 + c * x + d;
            if (y >= calculator.yMin && y <= calculator.yMax) {
                const [screenX, screenY] = calculator.graphToScreen(x, y);
                
                ctx.fillStyle = 'green';
                ctx.beginPath();
                ctx.arc(screenX, screenY, 3, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = 'black';
                ctx.fillText(`(${x},${y.toFixed(1)})`, screenX, screenY - 10);
            }
        }
    });
}

/**
 * Draw exponential function points
 */
drawExponentialPoints(ctx, equation, { coefficient, base, exponentCoeff, exponentShift }, calculator) {
    const points = [];
    const xMin = calculator.xMin;
    const xMax = calculator.xMax;
    const numPoints = 100;

    for (let i = 0; i <= numPoints; i++) {
        const x = xMin + (xMax - xMin) * i / numPoints;
        const y = coefficient * Math.pow(base, exponentCoeff * x + exponentShift);

        if (y >= calculator.yMin && y <= calculator.yMax && isFinite(y) && !isNaN(y)) {
            const [screenX, screenY] = calculator.graphToScreen(x, y);
            points.push({ x, y, screenX, screenY });
        }
    }

    // Draw the curve
    if (points.length > 1) {
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].screenX, points[0].screenY);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].screenX, points[i].screenY);
        }
        ctx.stroke();
    }

    // Mark y-intercept
    const yInt = coefficient * Math.pow(base, exponentShift);
    if (yInt >= calculator.yMin && yInt <= calculator.yMax) {
        const [screenX, screenY] = calculator.graphToScreen(0, yInt);
        
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'blue';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`(0,${yInt.toFixed(2)})`, screenX, screenY - 15);
    }

    // Mark key points
    ctx.font = '11px Arial';
    [-2, -1, 1, 2].forEach(x => {
        if (x >= calculator.xMin && x <= calculator.xMax) {
            const y = coefficient * Math.pow(base, exponentCoeff * x + exponentShift);
            if (y >= calculator.yMin && y <= calculator.yMax && isFinite(y)) {
                const [screenX, screenY] = calculator.graphToScreen(x, y);
                
                ctx.fillStyle = 'orange';
                ctx.beginPath();
                ctx.arc(screenX, screenY, 3, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = 'black';
                ctx.fillText(`(${x},${y.toFixed(2)})`, screenX, screenY - 10);
            }
        }
    });
}

/**
 * Draw logarithmic function points
 */
drawLogarithmicPoints(ctx, equation, { coefficient, base, xCoeff, xShift }, calculator) {
    const points = [];
    const xMin = Math.max(calculator.xMin, -xShift / xCoeff + 0.01);
    const xMax = calculator.xMax;
    const numPoints = 100;

    for (let i = 0; i <= numPoints; i++) {
        const x = xMin + (xMax - xMin) * i / numPoints;
        const logArg = xCoeff * x + xShift;
        
        if (logArg > 0) {
            const y = coefficient * (Math.log(logArg) / Math.log(base));

            if (y >= calculator.yMin && y <= calculator.yMax && isFinite(y) && !isNaN(y)) {
                const [screenX, screenY] = calculator.graphToScreen(x, y);
                points.push({ x, y, screenX, screenY });
            }
        }
    }

    // Draw the curve
    if (points.length > 1) {
        ctx.strokeStyle = '#9900cc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].screenX, points[0].screenY);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].screenX, points[i].screenY);
        }
        ctx.stroke();
    }

    // Draw vertical asymptote
    const asymptoteX = -xShift / xCoeff;
    if (asymptoteX >= calculator.xMin && asymptoteX <= calculator.xMax) {
        const [asymScreenX, asymScreenY1] = calculator.graphToScreen(asymptoteX, calculator.yMin);
        const [, asymScreenY2] = calculator.graphToScreen(asymptoteX, calculator.yMax);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(asymScreenX, asymScreenY1);
        ctx.lineTo(asymScreenX, asymScreenY2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'red';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Asymptote', asymScreenX, 20);
    }

    // Mark key points
    ctx.font = '11px Arial';
    [1, 2, 3, 5, 10].forEach(offset => {
        const x = asymptoteX + offset;
        if (x >= calculator.xMin && x <= calculator.xMax) {
            const logArg = xCoeff * x + xShift;
            if (logArg > 0) {
                const y = coefficient * (Math.log(logArg) / Math.log(base));
                if (y >= calculator.yMin && y <= calculator.yMax && isFinite(y)) {
                    const [screenX, screenY] = calculator.graphToScreen(x, y);
                    
                    ctx.fillStyle = 'purple';
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, 3, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.fillStyle = 'black';
                    ctx.fillText(`(${x.toFixed(1)},${y.toFixed(1)})`, screenX, screenY - 10);
                }
            }
        }
    });
}

/**
 * Draw trigonometric function points
 */
drawTrigonometricPoints(ctx, equation, { function: func, amplitude, frequency, phase, verticalShift }, calculator) {
    const points = [];
    const xMin = calculator.xMin;
    const xMax = calculator.xMax;
    const numPoints = 200; // More points for smooth curves

    for (let i = 0; i <= numPoints; i++) {
        const x = xMin + (xMax - xMin) * i / numPoints;
        const arg = frequency * x + phase;
        let y;

        switch (func) {
            case 'sin':
                y = amplitude * Math.sin(arg) + verticalShift;
                break;
            case 'cos':
                y = amplitude * Math.cos(arg) + verticalShift;
                break;
            case 'tan':
                y = amplitude * Math.tan(arg) + verticalShift;
                // Skip near asymptotes
                if (Math.abs(Math.cos(arg)) < 0.01) continue;
                break;
            case 'asin':
                if (Math.abs(arg) <= 1) y = amplitude * Math.asin(arg) + verticalShift;
                break;
            case 'acos':
                if (Math.abs(arg) <= 1) y = amplitude * Math.acos(arg) + verticalShift;
                break;
            case 'atan':
                y = amplitude * Math.atan(arg) + verticalShift;
                break;
        }

        if (y !== undefined && y >= calculator.yMin && y <= calculator.yMax && isFinite(y) && !isNaN(y)) {
            const [screenX, screenY] = calculator.graphToScreen(x, y);
            points.push({ x, y, screenX, screenY });
        }
    }

    // Draw the curve
    if (points.length > 1) {
        ctx.strokeStyle = '#0099ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].screenX, points[0].screenY);

        for (let i = 1; i < points.length; i++) {
            // Check for discontinuities (large jumps)
            const dx = Math.abs(points[i].screenX - points[i - 1].screenX);
            const dy = Math.abs(points[i].screenY - points[i - 1].screenY);
            
            if (dy < 100 || dx > 10) { // Not a vertical asymptote jump
                ctx.lineTo(points[i].screenX, points[i].screenY);
            } else {
                ctx.moveTo(points[i].screenX, points[i].screenY);
            }
        }
        ctx.stroke();
    }

    // Mark key points (maxima, minima, zeros)
    const period = func === 'tan' ? Math.PI / Math.abs(frequency) : 2 * Math.PI / Math.abs(frequency);
    const startX = -phase / frequency;

    ctx.font = '11px Arial';
    
    // Mark one complete period
    for (let i = 0; i <= 4; i++) {
        const x = startX + i * period / 4;
        if (x >= calculator.xMin && x <= calculator.xMax) {
            const arg = frequency * x + phase;
            let y;

            switch (func) {
                case 'sin':
                    y = amplitude * Math.sin(arg) + verticalShift;
                    break;
                case 'cos':
                    y = amplitude * Math.cos(arg) + verticalShift;
                    break;
                case 'tan':
                    if (Math.abs(Math.cos(arg)) > 0.01) {
                        y = amplitude * Math.tan(arg) + verticalShift;
                    }
                    break;
            }

            if (y !== undefined && y >= calculator.yMin && y <= calculator.yMax && isFinite(y)) {
                const [screenX, screenY] = calculator.graphToScreen(x, y);
                
                // Color code: max (red), min (blue), zero (green)
                let color = 'orange';
                if (Math.abs(y - verticalShift) < 0.1) color = 'green'; // Near zero
                else if (y > verticalShift + amplitude * 0.9) color = 'red'; // Near max
                else if (y < verticalShift - amplitude * 0.9) color = 'blue'; // Near min

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(screenX, screenY, 3, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = 'black';
                ctx.fillText(`(${x.toFixed(2)},${y.toFixed(2)})`, screenX, screenY - 10);
            }
        }
    }
}

/**
 * Draw absolute value function points
 */
drawAbsoluteValuePoints(ctx, equation, info, calculator) {
    if (info.isMultiple) {
        // For multiple absolute values, just draw the standard curve
        console.log('Drawing multiple absolute value function');
        return;
    }

    const { coefficient, xCoeff, xShift, verticalShift } = info;
    const points = [];
    const xMin = calculator.xMin;
    const xMax = calculator.xMax;
    const numPoints = 100;

    for (let i = 0; i <= numPoints; i++) {
        const x = xMin + (xMax - xMin) * i / numPoints;
        const y = coefficient * Math.abs(xCoeff * x + xShift) + verticalShift;

        if (y >= calculator.yMin && y <= calculator.yMax) {
            const [screenX, screenY] = calculator.graphToScreen(x, y);
            points.push({ x, y, screenX, screenY });
        }
    }

    // Draw the curve
    if (points.length > 1) {
        ctx.strokeStyle = '#cc0099';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].screenX, points[0].screenY);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].screenX, points[i].screenY);
        }
        ctx.stroke();
    }

    // Mark vertex
    const vertexX = -xShift / xCoeff;
    const vertexY = verticalShift;
    
    if (vertexX >= calculator.xMin && vertexX <= calculator.xMax &&
        vertexY >= calculator.yMin && vertexY <= calculator.yMax) {
        const [screenX, screenY] = calculator.graphToScreen(vertexX, vertexY);
        
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'red';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Vertex (${vertexX.toFixed(2)},${vertexY.toFixed(2)})`, screenX, screenY - 15);
    }

    // Mark other key points
    ctx.font = '11px Arial';
    [vertexX - 2, vertexX - 1, vertexX + 1, vertexX + 2].forEach(x => {
        if (x >= calculator.xMin && x <= calculator.xMax) {
            const y = coefficient * Math.abs(xCoeff * x + xShift) + verticalShift;
            if (y >= calculator.yMin && y <= calculator.yMax) {
                const [screenX, screenY] = calculator.graphToScreen(x, y);
                
                ctx.fillStyle = 'magenta';
                ctx.beginPath();
                ctx.arc(screenX, screenY, 3, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = 'black';
                ctx.fillText(`(${x.toFixed(1)},${y.toFixed(1)})`, screenX, screenY - 10);
            }
        }
    });
}

/**
 * Draw square root function points
 */
drawSquareRootPoints(ctx, equation, { coefficient, xCoeff, xShift, verticalShift }, calculator) {
    const points = [];
    const startX = -xShift / xCoeff;
    
    const xMin = xCoeff > 0 ? Math.max(calculator.xMin, startX) : calculator.xMin;
    const xMax = xCoeff > 0 ? calculator.xMax : Math.min(calculator.xMax, startX);
    const numPoints = 100;

    for (let i = 0; i <= numPoints; i++) {
        const x = xMin + (xMax - xMin) * i / numPoints;
        const radicand = xCoeff * x + xShift;
        
        if (radicand >= 0) {
            const y = coefficient * Math.sqrt(radicand) + verticalShift;

            if (y >= calculator.yMin && y <= calculator.yMax && isFinite(y) && !isNaN(y)) {
                const [screenX, screenY] = calculator.graphToScreen(x, y);
                points.push({ x, y, screenX, screenY });
            }
        }
    }

    // Draw the curve
    if (points.length > 1) {
        ctx.strokeStyle = '#00aa88';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].screenX, points[0].screenY);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].screenX, points[i].screenY);
        }
        ctx.stroke();
    }

    // Mark starting point
    if (startX >= calculator.xMin && startX <= calculator.xMax &&
        verticalShift >= calculator.yMin && verticalShift <= calculator.yMax) {
        const [screenX, screenY] = calculator.graphToScreen(startX, verticalShift);
        
        ctx.fillStyle = 'teal';
        ctx.beginPath();
        ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'teal';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Start (${startX.toFixed(2)},${verticalShift.toFixed(2)})`, screenX, screenY - 15);
    }

    // Mark key points
    ctx.font = '11px Arial';
    [0, 1, 4, 9].forEach(offset => {
        const x = startX + (xCoeff > 0 ? offset / Math.abs(xCoeff) : -offset / Math.abs(xCoeff));
        if (x >= calculator.xMin && x <= calculator.xMax) {
            const radicand = xCoeff * x + xShift;
            if (radicand >= 0) {
                const y = coefficient * Math.sqrt(radicand) + verticalShift;
                if (y >= calculator.yMin && y <= calculator.yMax) {
                    const [screenX, screenY] = calculator.graphToScreen(x, y);
                    
                    ctx.fillStyle = 'darkgreen';
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, 3, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.fillStyle = 'black';
                    ctx.fillText(`(${x.toFixed(1)},${y.toFixed(1)})`, screenX, screenY - 10);
                }
            }
        }
    });
}

/**
 * Draw rational function points
 */
drawRationalPoints(ctx, equation, { numerator, denominator }, calculator) {
    // This is a simplified version - full implementation would need expression parsing
    console.log('Drawing rational function - using standard curve');
    
    // Draw note about asymptotes
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Rational function - check for asymptotes', 10, 30);
}

/**
 * Draw special function points
 */
drawSpecialFunctionPoints(ctx, equation, { function: func }, calculator) {
    const points = [];
    const xMin = calculator.xMin;
    const xMax = calculator.xMax;
    const numPoints = 500; // More points for step functions

    for (let i = 0; i <= numPoints; i++) {
        const x = xMin + (xMax - xMin) * i / numPoints;
        let y;

        switch (func) {
            case 'floor':
                y = Math.floor(x);
                break;
            case 'ceil':
                y = Math.ceil(x);
                break;
            case 'sign':
                y = Math.sign(x);
                break;
            case 'max':
                y = Math.max(0, x); // Assuming max(0,x)
                break;
        }

        if (y !== undefined && y >= calculator.yMin && y <= calculator.yMax) {
            const [screenX, screenY] = calculator.graphToScreen(x, y);
            points.push({ x, y, screenX, screenY });
        }
    }

    // Draw the curve with discontinuities
    if (points.length > 1) {
        ctx.strokeStyle = '#ff3366';
        ctx.lineWidth = 2;
        
        for (let i = 1; i < points.length; i++) {
            // Only connect points if y-values are same (horizontal segments)
            if (Math.abs(points[i].y - points[i - 1].y) < 0.1) {
                ctx.beginPath();
                ctx.moveTo(points[i - 1].screenX, points[i - 1].screenY);
                ctx.lineTo(points[i].screenX, points[i].screenY);
                ctx.stroke();
            }
        }
    }

    // Mark integer points
    ctx.font = '10px Arial';
    for (let x = Math.ceil(calculator.xMin); x <= Math.floor(calculator.xMax); x++) {
        let y;
        switch (func) {
            case 'floor':
                y = Math.floor(x);
                break;
            case 'ceil':
                y = Math.ceil(x);
                break;
            case 'sign':
                y = Math.sign(x);
                break;
            case 'max':
                y = Math.max(0, x);
                break;
        }

        if (y !== undefined && y >= calculator.yMin && y <= calculator.yMax) {
            const [screenX, screenY] = calculator.graphToScreen(x, y);
            
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(screenX, screenY, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Add function type label
    ctx.fillStyle = 'black';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${func} function`, 10, 30);
}
    /**
     * Draw linear function points with connecting line
     */
    drawLinearPoints(ctx, equation, { slope, intercept }, calculator) {
        // Generate points across the viewing window
        const points = [];
        const xMin = calculator.xMin;
        const xMax = calculator.xMax;

        // Create more points for smoother line
        const numPoints = 50;
        for (let i = 0; i <= numPoints; i++) {
            const x = xMin + (xMax - xMin) * i / numPoints;
            const y = slope * x + intercept;

            if (y >= calculator.yMin && y <= calculator.yMax) {
                const [screenX, screenY] = calculator.graphToScreen(x, y);
                points.push({ x, y, screenX, screenY });
            }
        }

        // Draw the connecting line first
        if (points.length > 1) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(points[0].screenX, points[0].screenY);

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].screenX, points[i].screenY);
            }
            ctx.stroke();
        }

        // Mark specific coordinate points
        const keyXValues = [-3, -2, -1, 0, 1, 2, 3];
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        keyXValues.forEach(x => {
            const y = slope * x + intercept;

            if (x >= calculator.xMin && x <= calculator.xMax &&
                y >= calculator.yMin && y <= calculator.yMax) {

                const [screenX, screenY] = calculator.graphToScreen(x, y);

                // Draw point circle
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(screenX, screenY, 4, 0, 2 * Math.PI);
                ctx.fill();

                // Draw coordinate label
                ctx.fillStyle = 'black';
                ctx.fillText(`(${x},${y})`, screenX, screenY - 15);
            }
        });

        // Highlight y-intercept with different color
        if (intercept >= calculator.yMin && intercept <= calculator.yMax &&
            0 >= calculator.xMin && 0 <= calculator.xMax) {
            const [screenX, screenY] = calculator.graphToScreen(0, intercept);
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = 'blue';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`Y-int: (0,${intercept})`, screenX, screenY - 20);
        }
    }

    /**
     * Draw quadratic function points with parabola curve
     */
    drawQuadraticPoints(ctx, equation, { a, h, k }, calculator) {
        // Generate points for smooth parabola
        const points = [];
        const xMin = calculator.xMin;
        const xMax = calculator.xMax;

        const numPoints = 100;
        for (let i = 0; i <= numPoints; i++) {
            const x = xMin + (xMax - xMin) * i / numPoints;
            const y = a * (x - h) * (x - h) + k;

            if (y >= calculator.yMin && y <= calculator.yMax) {
                const [screenX, screenY] = calculator.graphToScreen(x, y);
                points.push({ x, y, screenX, screenY });
            }
        }

        // Draw the parabola curve
        if (points.length > 1) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(points[0].screenX, points[0].screenY);

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].screenX, points[i].screenY);
            }
            ctx.stroke();
        }

        // Mark specific coordinate points around vertex
        const keyXOffsets = [-2, -1, 0, 1, 2];
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        keyXOffsets.forEach(offset => {
            const x = h + offset;
            const y = a * (x - h) * (x - h) + k;

            if (x >= calculator.xMin && x <= calculator.xMax &&
                y >= calculator.yMin && y <= calculator.yMax) {

                const [screenX, screenY] = calculator.graphToScreen(x, y);

                // Color coding: purple for vertex, green for others
                if (offset === 0) {
                    // Vertex point
                    ctx.fillStyle = 'purple';
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.fillStyle = 'purple';
                    ctx.font = 'bold 14px Arial';
                    ctx.fillText(`Vertex: (${x},${y})`, screenX, screenY - 20);
                } else {
                    // Regular points
                    ctx.fillStyle = 'green';
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, 4, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.fillStyle = 'black';
                    ctx.font = '12px Arial';
                    ctx.fillText(`(${x},${y})`, screenX, screenY - 15);
                }
            }
        });

        // Draw axis of symmetry
        if (h >= calculator.xMin && h <= calculator.xMax) {
            const [axisScreenX1, axisScreenY1] = calculator.graphToScreen(h, calculator.yMin);
            const [axisScreenX2, axisScreenY2] = calculator.graphToScreen(h, calculator.yMax);

            ctx.strokeStyle = 'purple';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(axisScreenX1, axisScreenY1);
            ctx.lineTo(axisScreenX2, axisScreenY2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

/**
     * Sanitize filename for saving
     */
    sanitizeFilename(equation) {
        return equation
            .replace(/[^a-zA-Z0-9+\-=]/g, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 20);
    }

    /**
     * Update the graph with current equations (now for display only)
     */
    updateGraph() {
        // This is now just for status display
        console.log(`🎨 Individual graph created for equation`);
    }

    /**
     * Save current graph as PNG (legacy - now creates summary)
     */
    async saveCurrentGraph() {
        try {
            // Create a summary graph showing the current state
            const buffer = await this.calculator.buffer("image/png");

            const filename = `summary_${String(this.equationCounter).padStart(3, '0')}.png`;
            const filepath = path.join('./temp', filename);

            // Create directory if it doesn't exist
            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Summary graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving summary graph:", error);
        }
    }

    /**
     * Save individual graph for single equation with coordinate points marked
     */
    async saveIndividualGraph(equation, calculator) {
        try {
            // Create a custom version that marks coordinate points
            const buffer = await this.createGraphWithPoints(equation, calculator);

            const filename = `equation_${String(this.equationCounter).padStart(3, '0')}_${this.sanitizeFilename(equation)}.png`;
            const filepath = path.join('./temp', filename);

            // Create directory if it doesn't exist
            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Individual graph saved: ${filename}`);
        } catch (error) {
            console.error("❌ Error saving individual graph:", error);
        }
    }

    /**
     * Create graph with coordinate points marked and proper line drawing
     */
    async createGraphWithPoints(equation, calculator) {
        const canvas = createCanvas(calculator.width, calculator.height);
        const ctx = canvas.getContext("2d");

        // Draw the basic graph
        await calculator.drawGraph(ctx);

        // Add coordinate points and enhanced line drawing
        this.markCoordinatePoints(ctx, equation, calculator);

        return canvas.toBuffer("image/png");
    }

    /**
     * Create a new calculator instance for each equation
     */
    createFreshCalculator() {
        return new GraphingCalculator({
            size: 480,
            theme: this.calculator.theme,
            xMin: this.calculator.xMin,
            xMax: this.calculator.xMax,
            yMin: this.calculator.yMin,
            yMax: this.calculator.yMax,
            showGrid: this.calculator.showGrid,
            showAxes: this.calculator.showAxes,
            backgroundColor: this.calculator.backgroundColor,
            gridColor: this.calculator.gridColor,
            axisColor: this.calculator.axisColor
        });
    }
    

/**
     * Display all available formulas with descriptions (UPDATED WITH NEW SHAPES)
     */
    displayAllFormulas() {
        console.log("\n" + "=".repeat(80));
        console.log("📊 COMPLETE MATHEMATICAL FORMULA REFERENCE");
        console.log("=".repeat(80));

        const categories = [
            {
                title: "📏 LINEAR FUNCTIONS (y = mx + c)",
                formulas: ["y=2x+3", "y=x+1", "y=-x+5", "y=0.5x-2", "y=3x"]
            },
            {
                title: "📈 QUADRATIC FUNCTIONS",
                formulas: ["y=x**2", "y=-x**2", "y=x**2+2x+1", "y=2x**2-4x+1", "y=-0.5x**2+3x-2"]
            },
            {
                title: "🔄 CUBIC & POLYNOMIAL FUNCTIONS",
                formulas: ["y=x**3", "y=x**3-3x**2+2x", "y=x**4-2x**2"]
            },
            {
                title: "📊 EXPONENTIAL FUNCTIONS",
                formulas: ["y=2**x", "y=0.5**x", "y=e**x", "y=e**(-x)", "y=2*e**(0.5x)"]
            },
            {
                title: "📉 LOGARITHMIC FUNCTIONS",
                formulas: ["y=log(x)", "y=log(x,2)", "y=log(x+1)", "y=-log(x)"]
            },
            {
                title: "🌊 TRIGONOMETRIC FUNCTIONS",
                formulas: ["y=sin(x)", "y=cos(x)", "y=tan(x)", "y=2sin(x)", "y=sin(2x)", "y=sin(x-pi/2)"]
            },
            {
                title: "🔄 INVERSE TRIG FUNCTIONS",
                formulas: ["y=asin(x)", "y=acos(x)", "y=atan(x)"]
            },
            {
                title: "📐 ABSOLUTE VALUE FUNCTIONS",
                formulas: ["y=abs(x)", "y=abs(x-2)", "y=abs(x)+abs(x-4)", "y=-abs(x)+3"]
            },
            {
                title: "√ SQUARE ROOT FUNCTIONS",
                formulas: ["y=sqrt(x)", "y=sqrt(x-1)", "y=-sqrt(x)", "y=2sqrt(x+3)"]
            },
            {
                title: "➗ RATIONAL FUNCTIONS",
                formulas: ["y=1/x", "y=1/(x-1)", "y=(x+1)/(x-2)", "y=x**2/(x**2+1)"]
            },
            {
                title: "🔺 2D GEOMETRY SHAPES",
                formulas: [
                    "triangle A(0,0) B(4,0) C(2,3)",
                    "circle center(0,0) radius 5",
                    "rectangle (0,0) 4 3",
                    "square (0,0) 4",
                    "parallelogram (0,0) 5 4 3",
                    "polygon 6 sides (0,0) 2",
                    "ellipse center(0,0) 5 3",
                    "quadrilateral A(0,0) B(4,0) C(5,3) D(1,3)",
                    "trapezoid (0,0) 6 4 3"
                ]
            },
            {
                title: "🧊 3D GEOMETRY SHAPES",
                formulas: [
                    "sphere center(0,0,0) radius 5",
                    "cylinder center(0,0,0) radius 3 height 5",
                    "cone center(0,0,0) radius 3 height 5",
                    "cube (0,0,0) 4"
                ]
            },
            {
                title: "➡️  VECTOR OPERATIONS",
                formulas: [
                    "vector A(1,2) B(5,4)    → Displacement vector",
                    "vector <3,4>            → Component form",
                    "vectors A(1,1) B(4,3) C(6,5) → Multiple vectors",
                    "vector A(1,2,3) B(4,5,6) → 3D vector"
                ]
            },
            {
                title: "🔢 MATRIX TRANSFORMATIONS",
                formulas: [
                    "matrix [[1,2],[3,4]]    → Standard 2x2 matrix",
                    "matrix [1,2,3,4]        → Flat array notation",
                    "matrix 1 2 3 4          → Space separated",
                    "matrix rotation 45      → Rotation by 45°",
                    "matrix scale 2 3        → Scale transformation",
                    "matrix reflection x     → Reflection across x-axis"
                ]
            }
        ];

        categories.forEach(category => {
            console.log(`\n${category.title}`);
            console.log("-".repeat(50));
            category.formulas.forEach(formula => {
                if (formula.includes('→')) {
                    console.log(`${formula}`);
                } else {
                    const description = this.formulaDatabase[formula] || 
                        (formula.includes('triangle') ? "Triangle analysis" : 
                         formula.includes('circle') ? "Circle analysis" :
                         formula.includes('rectangle') ? "Rectangle analysis" :
                         formula.includes('square') ? "Square analysis" :
                         formula.includes('parallelogram') ? "Parallelogram analysis" :
                         formula.includes('polygon') ? "Polygon analysis" :
                         formula.includes('ellipse') ? "Ellipse analysis" :
                         formula.includes('quadrilateral') ? "Quadrilateral analysis" :
                         formula.includes('trapezoid') ? "Trapezoid analysis" :
                         formula.includes('sphere') ? "Sphere (3D) analysis" :
                         formula.includes('cylinder') ? "Cylinder (3D) analysis" :
                         formula.includes('cone') ? "Cone (3D) analysis" :
                         formula.includes('cube') ? "Cube (3D) analysis" :
                         formula.includes('vector') ? "Vector operation" :
                         formula.includes('matrix') ? "Matrix transformation" :
                         "Mathematical function");
                    console.log(`${formula.padEnd(40)} → ${description}`);
                }
            });
        });

        console.log("\n" + "=".repeat(80));
        console.log("📝 INPUT EXAMPLES:");
        console.log("");
        console.log("📈 EQUATIONS:");
        console.log("  • Linear:          y=2x+3, y=-0.5x+1, y=3x-2");
        console.log("  • Quadratic:       y=x**2+2x+1, y=-2x**2+4x");
        console.log("  • Exponential:     y=2**x, y=e**(-x)");
        console.log("  • Trigonometric:   y=sin(x), y=cos(2x), y=tan(x)");
        console.log("");
        console.log("🔺 2D GEOMETRY SHAPES:");
        console.log("  • Triangle:        triangle A(0,0) B(4,0) C(2,3)");
        console.log("  • Circle:          circle center(0,0) radius 5");
        console.log("  • Rectangle:       rectangle (0,0) 4 3");
        console.log("  • Square:          square (0,0) 4");
        console.log("  • Parallelogram:   parallelogram (0,0) 5 4 3");
        console.log("  • Polygon:         polygon 6 sides (0,0) 2");
        console.log("  • Ellipse:         ellipse center(0,0) 5 3");
        console.log("  • Quadrilateral:   quadrilateral A(0,0) B(4,0) C(5,3) D(1,3)");
        console.log("  • Trapezoid:       trapezoid (0,0) 6 4 3");
        console.log("");
        console.log("🧊 3D GEOMETRY SHAPES:");
        console.log("  • Sphere:          sphere center(0,0,0) radius 5");
        console.log("  • Cylinder:        cylinder center(0,0,0) radius 3 height 5");
        console.log("  • Cone:            cone center(0,0,0) radius 3 height 5");
        console.log("  • Cube:            cube (0,0,0) 4");
        console.log("");
        console.log("➡️  VECTORS:");
        console.log("  • vector A(1,2) B(5,4)          → 2D displacement");
        console.log("  • vector <3,4>                  → Component form");
        console.log("  • vectors A(1,1) B(4,3) C(6,5)  → Multiple vectors");
        console.log("  • vector A(1,2,3) B(4,5,6)      → 3D vector");
        console.log("");
        console.log("🔢 MATRICES:");
        console.log("  • matrix [[1,2],[3,4]]          → Standard notation");
        console.log("  • matrix [1,2,3,4]              → Flat array (2x2)");
        console.log("  • matrix 1 0 0 1                → Identity matrix");
        console.log("  • matrix rotation 45            → 45° rotation");
        console.log("  • matrix scale 2 2              → Uniform scaling");
        console.log("");
        console.log("=".repeat(80));
        console.log("✨ FEATURES:");
        console.log("🎯 Each equation creates its own graph with coordinate points!");
        console.log("🔺 Complete geometric analysis for 2D shapes!");
        console.log("🧊 Full 3D shape analysis with projections!");
        console.log("➡️  Vector operations with magnitude, direction & operations!");
        console.log("🔢 Matrix transformations with before/after visualization!");
        console.log("📁 All visualizations saved to './temp/' folder");
        console.log("=".repeat(80));
    }

    /**
     * Display help menu (UPDATED WITH ALL NEW SHAPES)
     */
    displayHelp() {
        console.log("\n" + "=".repeat(70));
        console.log("🧮 GRAPHING CALCULATOR COMMANDS");
        console.log("=".repeat(70));
        
        console.log("\n📚 INFORMATION COMMANDS:");
        console.log("  📊 formulas  → Show all available mathematical formulas");
        console.log("  📜 history   → Show all history (equations, shapes, vectors, matrices)");
        console.log("  🔄 status    → Show current calculator status");
        console.log("  ❓ help      → Show this help menu");
        
        console.log("\n📈 GRAPHING COMMANDS:");
        console.log("  📈 graph     → Display current graph visualization");
        console.log("  💾 save      → Save current summary graph as PNG");
        console.log("  🎨 theme     → Change graph theme (standard/dark/scientific)");
        console.log("  📏 zoom      → Adjust viewing window (xmin xmax ymin ymax)");
        
        console.log("\n📋 HISTORY COMMANDS:");
        console.log("  📜 history   → Show all history");
        console.log("  🔺 triangles → Show triangle history");
        console.log("  ⭕ circles   → Show circle history");
        console.log("  ▭ rectangles → Show rectangle history");
        console.log("  ▢ squares    → Show square history");
        console.log("  ▱ parallelograms → Show parallelogram history");
        console.log("  ⬡ polygons   → Show polygon history");
        console.log("  ⬭ ellipses   → Show ellipse history");
        console.log("  ⬢ quadrilaterals → Show quadrilateral history");
        console.log("  ⏢ trapezoids → Show trapezoid history");
        console.log("  🌐 spheres   → Show sphere history");
        console.log("  🛢️ cylinders → Show cylinder history");
        console.log("  🔺 cones     → Show cone history");
        console.log("  🧊 cubes     → Show cube history");
        console.log("  ➡️  vectors   → Show vector history (alias: vhistory)");
        console.log("  🔢 matrices  → Show matrix history (alias: mhistory)");
        
        console.log("\n⚙️  SETTINGS COMMANDS:");
        console.log("  🎛️  vtoggle  → Toggle vector display options");
        console.log("  🎛️  mtoggle  → Toggle matrix display options");
        
        console.log("\n🗑️  MANAGEMENT COMMANDS:");
        console.log("  🗑️  clear    → Clear all items");
        console.log("  ⬅️  undo     → Remove last item");
        console.log("  🚪 quit     → Exit the calculator (alias: exit)");
        
        console.log("\n" + "=".repeat(70));
        console.log("📝 TO ADD ITEMS:");
        console.log("");
        console.log("  📈 EQUATION:  Just type it");
        console.log("     Examples: y=x**2, y=sin(x), y=2x+3");
        console.log("");
        console.log("  🔺 2D SHAPES:");
        console.log("     • Triangle:      triangle A(0,0) B(4,0) C(2,3)");
        console.log("     • Circle:        circle center(0,0) radius 5");
        console.log("     • Rectangle:     rectangle (0,0) 4 3");
        console.log("     • Square:        square (0,0) 4");
        console.log("     • Parallelogram: parallelogram (0,0) 5 4 3");
        console.log("     • Polygon:       polygon 6 sides (0,0) 2");
        console.log("     • Ellipse:       ellipse center(0,0) 5 3");
        console.log("     • Quadrilateral: quadrilateral A(0,0) B(4,0) C(5,3) D(1,3)");
        console.log("     • Trapezoid:     trapezoid (0,0) 6 4 3");
        console.log("");
        console.log("  🧊 3D SHAPES:");
        console.log("     • Sphere:        sphere center(0,0,0) radius 5");
        console.log("     • Cylinder:      cylinder center(0,0,0) radius 3 height 5");
        console.log("     • Cone:          cone center(0,0,0) radius 3 height 5");
        console.log("     • Cube:          cube (0,0,0) 4");
        console.log("");
        console.log("  ➡️  VECTOR:   vector A(x1,y1) B(x2,y2) or vector <x,y>");
        console.log("     Examples: vector A(1,2) B(5,4)");
        console.log("");
        console.log("  🔢 MATRIX:    matrix [values] or matrix [transformation]");
        console.log("     Examples: matrix [[1,2],[3,4]]");
        console.log("               matrix rotation 45");
        console.log("");
        console.log("=".repeat(70));
        console.log("✨ FEATURES:");
        console.log("  • Individual graphs with coordinate points marked");
        console.log("  • Complete geometric analysis for 2D & 3D shapes");
        console.log("  • Vector operations and visualizations");
        console.log("  • Matrix transformations with before/after views");
        console.log("  • All visualizations automatically saved to './temp/'");
        console.log("=".repeat(70));
    }

    /**
     * Get total item count
     */
    getTotalItemCount() {
        return this.equationCounter + this.triangleCounter + this.circleCounter + 
               this.rectangleCounter + this.squareCounter + this.parallelogramCounter +
               this.polygonCounter + this.ellipseCounter + this.quadrilateralCounter +
               this.trapezoidCounter + this.sphereCounter + this.cylinderCounter +
               this.coneCounter + this.cubeCounter + this.vectorCounter + this.matrixCounter;
    }

    /**
     * Clear all items
     */
    clearAll() {
        this.calculator.clearEquations();
        this.equationHistory = [];
        this.triangleHistory = [];
        this.circleHistory = [];
        this.rectangleHistory = [];
        this.squareHistory = [];
        this.parallelogramHistory = [];
        this.polygonHistory = [];
        this.ellipseHistory = [];
        this.quadrilateralHistory = [];
        this.trapezoidHistory = [];
        this.sphereHistory = [];
        this.cylinderHistory = [];
        this.coneHistory = [];
        this.cubeHistory = [];
        this.vectorHistory = [];
        this.matrixHistory = [];
        
        this.equationCounter = 0;
        this.triangleCounter = 0;
        this.circleCounter = 0;
        this.rectangleCounter = 0;
        this.squareCounter = 0;
        this.parallelogramCounter = 0;
        this.polygonCounter = 0;
        this.ellipseCounter = 0;
        this.quadrilateralCounter = 0;
        this.trapezoidCounter = 0;
        this.sphereCounter = 0;
        this.cylinderCounter = 0;
        this.coneCounter = 0;
        this.cubeCounter = 0;
        this.vectorCounter = 0;
        this.matrixCounter = 0;
    }

/**
     * Display shape history helper
     */
    displayShapeHistory(shapeName, history) {
        const icons = {
            triangle: '🔺',
            circle: '⭕',
            rectangle: '▭',
            square: '▢',
            parallelogram: '▱',
            polygon: '⬡',
            ellipse: '⬭',
            quadrilateral: '⬢',
            trapezoid: '⏢',
            sphere: '🌐',
            cylinder: '🛢️',
            cone: '🔺',
            cube: '🧊'
        };

        console.log(`\n${icons[shapeName]} ${shapeName.charAt(0).toUpperCase() + shapeName.slice(1)} History:`);
        console.log("=".repeat(60));
        
        if (history.length === 0) {
            console.log(`No ${shapeName}s added yet.`);
        } else {
            history.forEach(item => {
                console.log(`  ${item.id}. ${item.input}`);
                const props = item.properties;
                if (props.area !== undefined) {
                    console.log(`     Area: ${props.area.toFixed(3)} sq units`);
                }
                if (props.volume !== undefined) {
                    console.log(`     Volume: ${props.volume.toFixed(3)} cubic units`);
                }
                if (props.perimeter !== undefined) {
                    console.log(`     Perimeter: ${props.perimeter.toFixed(3)} units`);
                } else if (props.circumference !== undefined) {
                    console.log(`     Circumference: ${props.circumference.toFixed(3)} units`);
                } else if (props.surfaceArea !== undefined) {
                    console.log(`     Surface Area: ${props.surfaceArea.toFixed(3)} sq units`);
                }
                console.log("");
            });
        }
        console.log("=".repeat(60));
    }

    /**
     * Undo last item (UPDATED)
     */
    undoLast() {
        if (this.getTotalItemCount() === 0) {
            console.log("❌ Nothing to undo!");
            return;
        }

        // Find the most recent item
        const lastIds = {
            equation: this.equationHistory.length > 0 ? parseInt(this.equationHistory[this.equationHistory.length - 1].split('.')[0]) : 0,
            triangle: this.triangleHistory.length > 0 ? this.triangleHistory[this.triangleHistory.length - 1].id : 0,
            circle: this.circleHistory.length > 0 ? this.circleHistory[this.circleHistory.length - 1].id : 0,
            rectangle: this.rectangleHistory.length > 0 ? this.rectangleHistory[this.rectangleHistory.length - 1].id : 0,
            square: this.squareHistory.length > 0 ? this.squareHistory[this.squareHistory.length - 1].id : 0,
            parallelogram: this.parallelogramHistory.length > 0 ? this.parallelogramHistory[this.parallelogramHistory.length - 1].id : 0,
            polygon: this.polygonHistory.length > 0 ? this.polygonHistory[this.polygonHistory.length - 1].id : 0,
            ellipse: this.ellipseHistory.length > 0 ? this.ellipseHistory[this.ellipseHistory.length - 1].id : 0,
            quadrilateral: this.quadrilateralHistory.length > 0 ? this.quadrilateralHistory[this.quadrilateralHistory.length - 1].id : 0,
            trapezoid: this.trapezoidHistory.length > 0 ? this.trapezoidHistory[this.trapezoidHistory.length - 1].id : 0,
            sphere: this.sphereHistory.length > 0 ? this.sphereHistory[this.sphereHistory.length - 1].id : 0,
            cylinder: this.cylinderHistory.length > 0 ? this.cylinderHistory[this.cylinderHistory.length - 1].id : 0,
            cone: this.coneHistory.length > 0 ? this.coneHistory[this.coneHistory.length - 1].id : 0,
            cube: this.cubeHistory.length > 0 ? this.cubeHistory[this.cubeHistory.length - 1].id : 0,
            vector: this.vectorHistory.length > 0 ? this.vectorHistory[this.vectorHistory.length - 1].id : 0,
            matrix: this.matrixHistory.length > 0 ? this.matrixHistory[this.matrixHistory.length - 1].id : 0
        };

        const maxId = Math.max(...Object.values(lastIds));

        if (maxId === lastIds.matrix && lastIds.matrix > 0) {
            const removed = this.matrixHistory.pop();
            this.matrixCounter--;
            console.log(`⬅️  Removed matrix: ${removed.input}`);
        } else if (maxId === lastIds.vector && lastIds.vector > 0) {
            const removed = this.vectorHistory.pop();
            this.vectorCounter--;
            console.log(`⬅️  Removed vector: ${removed.input}`);
        } else if (maxId === lastIds.cube && lastIds.cube > 0) {
            const removed = this.cubeHistory.pop();
            this.cubeCounter--;
            console.log(`⬅️  Removed cube: ${removed.input}`);
        } else if (maxId === lastIds.cone && lastIds.cone > 0) {
            const removed = this.coneHistory.pop();
            this.coneCounter--;
            console.log(`⬅️  Removed cone: ${removed.input}`);
        } else if (maxId === lastIds.cylinder && lastIds.cylinder > 0) {
            const removed = this.cylinderHistory.pop();
            this.cylinderCounter--;
            console.log(`⬅️  Removed cylinder: ${removed.input}`);
        } else if (maxId === lastIds.sphere && lastIds.sphere > 0) {
            const removed = this.sphereHistory.pop();
            this.sphereCounter--;
            console.log(`⬅️  Removed sphere: ${removed.input}`);
        } else if (maxId === lastIds.trapezoid && lastIds.trapezoid > 0) {
            const removed = this.trapezoidHistory.pop();
            this.trapezoidCounter--;
            console.log(`⬅️  Removed trapezoid: ${removed.input}`);
        } else if (maxId === lastIds.quadrilateral && lastIds.quadrilateral > 0) {
            const removed = this.quadrilateralHistory.pop();
            this.quadrilateralCounter--;
            console.log(`⬅️  Removed quadrilateral: ${removed.input}`);
        } else if (maxId === lastIds.ellipse && lastIds.ellipse > 0) {
            const removed = this.ellipseHistory.pop();
            this.ellipseCounter--;
            console.log(`⬅️  Removed ellipse: ${removed.input}`);
        } else if (maxId === lastIds.polygon && lastIds.polygon > 0) {
            const removed = this.polygonHistory.pop();
            this.polygonCounter--;
            console.log(`⬅️  Removed polygon: ${removed.input}`);
        } else if (maxId === lastIds.parallelogram && lastIds.parallelogram > 0) {
            const removed = this.parallelogramHistory.pop();
            this.parallelogramCounter--;
            console.log(`⬅️  Removed parallelogram: ${removed.input}`);
        } else if (maxId === lastIds.square && lastIds.square > 0) {
            const removed = this.squareHistory.pop();
            this.squareCounter--;
            console.log(`⬅️  Removed square: ${removed.input}`);
        } else if (maxId === lastIds.rectangle && lastIds.rectangle > 0) {
            const removed = this.rectangleHistory.pop();
            this.rectangleCounter--;
            console.log(`⬅️  Removed rectangle: ${removed.input}`);
        } else if (maxId === lastIds.circle && lastIds.circle > 0) {
            const removed = this.circleHistory.pop();
            this.circleCounter--;
            console.log(`⬅️  Removed circle: ${removed.input}`);
        } else if (maxId === lastIds.triangle && lastIds.triangle > 0) {
            const removed = this.triangleHistory.pop();
            this.triangleCounter--;
            console.log(`⬅️  Removed triangle: ${removed.input}`);
        } else if (this.equationHistory.length > 0) {
            const removed = this.equationHistory.pop();
            this.equationCounter--;
            console.log(`⬅️  Removed equation: ${removed}`);
        }
    }

    /**
     * Display current graph info (UPDATED WITH ALL SHAPES)
     */
    displayCurrentGraph() {
        console.log("\n🎨 GRAPH DISPLAY INFORMATION");
        console.log("=".repeat(70));
        
        console.log("\n📊 SUMMARY:");
        console.log(`  📈 Equations: ${this.equationCounter}`);
        console.log(`  🔺 Triangles: ${this.triangleCounter}`);
        console.log(`  ⭕ Circles: ${this.circleCounter}`);
        console.log(`  ▭ Rectangles: ${this.rectangleCounter}`);
        console.log(`  ▢ Squares: ${this.squareCounter}`);
        console.log(`  ▱ Parallelograms: ${this.parallelogramCounter}`);
        console.log(`  ⬡ Polygons: ${this.polygonCounter}`);
        console.log(`  ⬭ Ellipses: ${this.ellipseCounter}`);
        console.log(`  ⬢ Quadrilaterals: ${this.quadrilateralCounter}`);
        console.log(`  ⏢ Trapezoids: ${this.trapezoidCounter}`);
        console.log(`  🌐 Spheres: ${this.sphereCounter}`);
        console.log(`  🛢️ Cylinders: ${this.cylinderCounter}`);
        console.log(`  🔺 Cones: ${this.coneCounter}`);
        console.log(`  🧊 Cubes: ${this.cubeCounter}`);
        console.log(`  ➡️  Vectors: ${this.vectorCounter}`);
        console.log(`  🔢 Matrices: ${this.matrixCounter}`);
        console.log(`  📊 Total items: ${this.getTotalItemCount()}`);
        
        console.log("\n⚙️  SETTINGS:");
        console.log(`  🎨 Current theme: ${this.calculator.theme}`);
        console.log(`  📏 Viewing window: x[${this.calculator.xMin}, ${this.calculator.xMax}], y[${this.calculator.yMin}, ${this.calculator.yMax}]`);

        console.log("\n📁 INDIVIDUAL GRAPH FILES:");
        
        if (this.equationHistory.length > 0) {
            console.log("\n  📈 Equation Graphs:");
            this.equationHistory.forEach((eq, index) => {
                const filename = `equation_${String(index + 1).padStart(3, '0')}_${this.sanitizeFilename(eq.replace(/^\d+\.\s*/, ''))}.png`;
                console.log(`    • ${filename}`);
            });
        }

        const shapeTypes = [
            { name: 'Triangle', history: this.triangleHistory, icon: '🔺' },
            { name: 'Circle', history: this.circleHistory, icon: '⭕' },
            { name: 'Rectangle', history: this.rectangleHistory, icon: '▭' },
            { name: 'Square', history: this.squareHistory, icon: '▢' },
            { name: 'Parallelogram', history: this.parallelogramHistory, icon: '▱' },
            { name: 'Polygon', history: this.polygonHistory, icon: '⬡' },
            { name: 'Ellipse', history: this.ellipseHistory, icon: '⬭' },
            { name: 'Quadrilateral', history: this.quadrilateralHistory, icon: '⬢' },
            { name: 'Trapezoid', history: this.trapezoidHistory, icon: '⏢' },
            { name: 'Sphere', history: this.sphereHistory, icon: '🌐' },
            { name: 'Cylinder', history: this.cylinderHistory, icon: '🛢️' },
            { name: 'Cone', history: this.coneHistory, icon: '🔺' },
            { name: 'Cube', history: this.cubeHistory, icon: '🧊' }
        ];

        shapeTypes.forEach(shape => {
            if (shape.history.length > 0) {
                console.log(`\n  ${shape.icon} ${shape.name} Graphs:`);
                shape.history.forEach((item, index) => {
                    console.log(`    • ${shape.name.toLowerCase()}_${String(index + 1).padStart(3, '0')}_...png`);
                });
            }
        });

        if (this.vectorHistory.length > 0) {
            console.log("\n  ➡️  Vector Graphs:");
            this.vectorHistory.forEach((vec, index) => {
                console.log(`    • vector_${String(index + 1).padStart(3, '0')}_analysis.png`);
            });
        }

        if (this.matrixHistory.length > 0) {
            console.log("\n  🔢 Matrix Graphs:");
            this.matrixHistory.forEach((mat, index) => {
                const desc = mat.description ? ` (${mat.description})` : '';
                console.log(`    • matrix_${String(index + 1).padStart(3, '0')}_transformation.png${desc}`);
            });
        }

        if (this.getTotalItemCount() === 0) {
            console.log("\n  📝 No graphs generated yet.");
            console.log("  💡 Add equations, shapes, vectors, or matrices to generate visualizations!");
        }

        console.log("\n💡 TIPS:");
        console.log("  • Each equation creates its own detailed graph with marked points");
        console.log("  • Each 2D shape creates a complete geometric analysis");
        console.log("  • Each 3D shape creates a projection view with all properties");
        console.log("  • Each vector creates a visual analysis with all operations");
        console.log("  • Each matrix creates a before/after transformation view");
        console.log("  • Domain & Range automatically displayed on all graphs");
        console.log("  • All files are saved automatically in './temp/' folder");
        console.log("  • Use 'formulas' to see all available input formats");
        console.log("=".repeat(70));
    }

    /**
     * Get current calculator status (UPDATED)
     */
    getCalculatorStatus() {
        const total = this.getTotalItemCount();
        return `📊 Status | Total: ${total} | Eq: ${this.equationCounter} | 2D: ${this.triangleCounter + this.circleCounter + this.rectangleCounter + this.squareCounter + this.parallelogramCounter + this.polygonCounter + this.ellipseCounter + this.quadrilateralCounter + this.trapezoidCounter} | 3D: ${this.sphereCounter + this.cylinderCounter + this.coneCounter + this.cubeCounter} | Vec: ${this.vectorCounter} | Mat: ${this.matrixCounter}`;
    }

    /**
     * Change theme
     */
    changeTheme(themeName) {
        const themes = {
            'standard': Theme.Standard,
            'dark': Theme.Dark,
            'scientific': Theme.Scientific
        };

        if (themes[themeName]) {
            this.calculator = new GraphingCalculator({
                size: this.calculator.width,
                theme: themes[themeName],
                xMin: this.calculator.xMin,
                xMax: this.calculator.xMax,
                yMin: this.calculator.yMin,
                yMax: this.calculator.yMax,
                showGrid: this.calculator.showGrid,
                showAxes: this.calculator.showAxes
            });
            return true;
        }
        return false;
    }

    /**
     * Set viewing window
     */
    setViewingWindow(xMin, xMax, yMin, yMax) {
        if (xMin >= xMax || yMin >= yMax) {
            return false;
        }

        this.calculator = new GraphingCalculator({
            size: this.calculator.width,
            theme: this.calculator.theme,
            xMin,
            xMax,
            yMin,
            yMax,
            showGrid: this.calculator.showGrid,
            showAxes: this.calculator.showAxes
        });
        return true;
    }

}


class CrossSectionDiagramsRegistry {
    static diagrams = {
        // ===== BIOLOGY - PLANT STRUCTURES =====
        'dicotLeafCrossSection': {
            name: 'Dicot Leaf Cross-Section',
            category: 'Biology - Plant Structures',
            description: 'Cross-section showing palisade and spongy mesophyll layers',
            dataRequired: [],
            usage: 'Best for plant anatomy and photosynthesis education',
            examples: ['Botany studies', 'Plant physiology', 'Photosynthesis'],
            defaultOptions: {
                title: 'Dicot Leaf Cross-Section',
                showLabels: true,
                showCellDetail: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'monocotLeafCrossSection': {
            name: 'Monocot Leaf Cross-Section',
            category: 'Biology - Plant Structures',
            description: 'Cross-section showing parallel veins structure',
            dataRequired: [],
            usage: 'Best for comparing monocot vs dicot anatomy',
            examples: ['Grass anatomy', 'Monocot studies', 'Comparative botany'],
            defaultOptions: {
                title: 'Monocot Leaf Cross-Section',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'rootTipCrossSection': {
            name: 'Root Tip Cross-Section',
            category: 'Biology - Plant Structures',
            description: 'Shows meristematic zone and root cap',
            dataRequired: [],
            usage: 'Best for plant growth and development studies',
            examples: ['Root anatomy', 'Meristem studies', 'Plant growth'],
            defaultOptions: {
                title: 'Root Tip Cross-Section',
                showLabels: true,
                showZones: true,
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'dicotStemCrossSection': {
            name: 'Dicot Stem Cross-Section',
            category: 'Biology - Plant Structures',
            description: 'Vascular bundles arranged in a ring',
            dataRequired: [],
            usage: 'Best for stem anatomy education',
            examples: ['Vascular tissue', 'Plant transport', 'Stem structure'],
            defaultOptions: {
                title: 'Dicot Stem Cross-Section',
                showLabels: true,
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'monocotStemCrossSection': {
            name: 'Monocot Stem Cross-Section',
            category: 'Biology - Plant Structures',
            description: 'Scattered vascular bundles pattern',
            dataRequired: [],
            usage: 'Best for comparing stem structures',
            examples: ['Corn stem', 'Grass anatomy', 'Vascular bundles'],
            defaultOptions: {
                title: 'Monocot Stem Cross-Section',
                showLabels: true,
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'flowerOvaryCrossSection': {
            name: 'Flower Ovary Cross-Section',
            category: 'Biology - Plant Structures',
            description: 'Shows ovules and carpel structure',
            dataRequired: [],
            usage: 'Best for plant reproduction education',
            examples: ['Flower anatomy', 'Reproduction', 'Fruit development'],
            defaultOptions: {
                title: 'Flower Ovary Cross-Section',
                showLabels: true,
                width: 600,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'seedCrossSection': {
            name: 'Seed Cross-Section',
            category: 'Biology - Plant Structures',
            description: 'Shows embryo, endosperm, and seed coat',
            dataRequired: ['seedType'],
            usage: 'Best for seed anatomy and germination studies',
            examples: ['Bean seed', 'Maize seed', 'Seed germination'],
            seedTypeOptions: ['bean', 'maize', 'peanut'],
            defaultOptions: {
                title: 'Seed Cross-Section',
                seedType: 'bean',
                showLabels: true,
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'fruitCrossSection': {
            name: 'Fruit Cross-Section',
            category: 'Biology - Plant Structures',
            description: 'Shows pericarp layers and seed arrangement',
            dataRequired: ['fruitType'],
            usage: 'Best for fruit anatomy education',
            examples: ['Apple anatomy', 'Berry structure', 'Citrus fruit'],
            fruitTypeOptions: ['apple', 'orange', 'tomato', 'berry'],
            defaultOptions: {
                title: 'Fruit Cross-Section',
                fruitType: 'apple',
                showLabels: true,
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== BIOLOGY - ANIMAL ANATOMY =====
        'brainCrossSection': {
            name: 'Brain Cross-Section',
            category: 'Biology - Animal Anatomy',
            description: 'Shows cerebrum, cerebellum, and medulla',
            dataRequired: [],
            usage: 'Best for neuroanatomy education',
            examples: ['Brain structure', 'Neuroscience', 'CNS anatomy'],
            defaultOptions: {
                title: 'Brain Cross-Section',
                showLabels: true,
                plane: 'sagittal',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'smallIntestineCrossSection': {
            name: 'Small Intestine Cross-Section',
            category: 'Biology - Animal Anatomy',
            description: 'Shows villi and muscle layers',
            dataRequired: [],
            usage: 'Best for digestive system anatomy',
            examples: ['Intestinal villi', 'Absorption', 'Digestive anatomy'],
            defaultOptions: {
                title: 'Small Intestine Cross-Section',
                showLabels: true,
                showVilli: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'fishGillsCrossSection': {
            name: 'Fish Gills Cross-Section',
            category: 'Biology - Animal Anatomy',
            description: 'Shows lamellae and filaments for gas exchange',
            dataRequired: [],
            usage: 'Best for aquatic respiration education',
            examples: ['Fish anatomy', 'Respiration', 'Gas exchange'],
            defaultOptions: {
                title: 'Fish Gills Cross-Section',
                showLabels: true,
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'insectThoraxCrossSection': {
            name: 'Insect Thorax Cross-Section',
            category: 'Biology - Animal Anatomy',
            description: 'Shows tracheae, muscles, and exoskeleton',
            dataRequired: [],
            usage: 'Best for insect anatomy and respiration',
            examples: ['Insect anatomy', 'Tracheal system', 'Arthropod structure'],
            defaultOptions: {
                title: 'Insect Thorax Cross-Section',
                showLabels: true,
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'flowerBudCrossSection': {
            name: 'Flower Bud Cross-Section',
            category: 'Biology - Plant Structures',
            description: 'Shows developing petals and reproductive parts',
            dataRequired: [],
            usage: 'Best for flower development studies',
            examples: ['Flower development', 'Bud anatomy', 'Organogenesis'],
            defaultOptions: {
                title: 'Flower Bud Cross-Section',
                showLabels: true,
                width: 600,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== GEOGRAPHY - EARTH & LANDFORMS =====
        'earthCrossSection': {
            name: 'Earth Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows crust, mantle, outer core, and inner core',
            dataRequired: [],
            usage: 'Best for geology and earth science education',
            examples: ['Earth structure', 'Geology', 'Plate tectonics'],
            defaultOptions: {
                title: 'Earth Cross-Section',
                showLabels: true,
                showDepths: true,
                width: 800,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'volcanoCrossSection': {
            name: 'Volcano Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows magma chamber, vent, and crater',
            dataRequired: [],
            usage: 'Best for volcanic activity education',
            examples: ['Volcano structure', 'Volcanic eruptions', 'Magma flow'],
            defaultOptions: {
                title: 'Volcano Cross-Section',
                showLabels: true,
                showLavaFlow: true,
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'foldMountainCrossSection': {
            name: 'Fold Mountain Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows anticlines and synclines formation',
            dataRequired: [],
            usage: 'Best for mountain formation and tectonics',
            examples: ['Mountain building', 'Rock folding', 'Tectonics'],
            defaultOptions: {
                title: 'Fold Mountain Cross-Section',
                showLabels: true,
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'faultLineCrossSection': {
            name: 'Fault Line Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows normal or reverse fault displacement',
            dataRequired: ['faultType'],
            usage: 'Best for earthquake and fault studies',
            examples: ['Fault types', 'Earthquakes', 'Plate boundaries'],
            faultTypeOptions: ['normal', 'reverse', 'strike-slip'],
            defaultOptions: {
                title: 'Fault Line Cross-Section',
                faultType: 'normal',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'riverValleyCrossSection': {
            name: 'River Valley Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows V-shaped or U-shaped valley profile',
            dataRequired: ['valleyType'],
            usage: 'Best for erosion and valley formation studies',
            examples: ['River erosion', 'Valley formation', 'Glacial valleys'],
            valleyTypeOptions: ['v-shaped', 'u-shaped'],
            defaultOptions: {
                title: 'River Valley Cross-Section',
                valleyType: 'v-shaped',
                showLabels: true,
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'riverMeanderCrossSection': {
            name: 'River Meander Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows erosion and deposition on meander bends',
            dataRequired: [],
            usage: 'Best for river processes education',
            examples: ['Meander formation', 'River erosion', 'Deposition'],
            defaultOptions: {
                title: 'River Meander Cross-Section',
                showLabels: true,
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'deltaCrossSection': {
            name: 'Delta Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows distributaries and sediment layers',
            dataRequired: [],
            usage: 'Best for delta formation and sedimentation studies',
            examples: ['Delta formation', 'Sediment deposition', 'River mouths'],
            defaultOptions: {
                title: 'Delta Cross-Section',
                showLabels: true,
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'coastalCliffCrossSection': {
            name: 'Coastal Cliff Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows wave-cut platform and notch',
            dataRequired: [],
            usage: 'Best for coastal erosion studies',
            examples: ['Coastal erosion', 'Wave action', 'Cliff retreat'],
            defaultOptions: {
                title: 'Coastal Cliff Cross-Section',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'coralReefCrossSection': {
            name: 'Coral Reef Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows fringing, barrier, or atoll reef structure',
            dataRequired: ['reefType'],
            usage: 'Best for marine ecosystem education',
            examples: ['Coral reefs', 'Marine ecosystems', 'Reef types'],
            reefTypeOptions: ['fringing', 'barrier', 'atoll'],
            defaultOptions: {
                title: 'Coral Reef Cross-Section',
                reefType: 'fringing',
                showLabels: true,
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'sandDuneCrossSection': {
            name: 'Sand Dune Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows windward and leeward slopes',
            dataRequired: [],
            usage: 'Best for wind erosion and deposition studies',
            examples: ['Dune formation', 'Wind erosion', 'Desert landscapes'],
            defaultOptions: {
                title: 'Sand Dune Cross-Section',
                showLabels: true,
                showWindDirection: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'glacierCrossSection': {
            name: 'Glacier Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows ice layers, moraines, and bedrock',
            dataRequired: [],
            usage: 'Best for glacial processes education',
            examples: ['Glacier structure', 'Ice movement', 'Glacial deposits'],
            defaultOptions: {
                title: 'Glacier Cross-Section',
                showLabels: true,
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'karstCaveCrossSection': {
            name: 'Karst Cave Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows stalactites, stalagmites, and limestone dissolution',
            dataRequired: [],
            usage: 'Best for karst topography and cave formation',
            examples: ['Cave formation', 'Limestone dissolution', 'Karst features'],
            defaultOptions: {
                title: 'Karst Cave Cross-Section',
                showLabels: true,
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'soilProfileCrossSection': {
            name: 'Soil Profile Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows O, A, B, C soil horizons',
            dataRequired: [],
            usage: 'Best for soil science and pedology',
            examples: ['Soil horizons', 'Soil formation', 'Pedology'],
            defaultOptions: {
                title: 'Soil Profile Cross-Section',
                showLabels: true,
                showHorizons: true,
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'urbanLandUseCrossSection': {
            name: 'Urban Land Use Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows CBD to suburbs transition',
            dataRequired: [],
            usage: 'Best for urban geography and planning',
            examples: ['Urban structure', 'Land use zones', 'City planning'],
            defaultOptions: {
                title: 'Urban Land Use Cross-Section',
                showLabels: true,
                width: 1000,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'tunnelCrossSection': {
            name: 'Transport Tunnel Cross-Section',
            category: 'Geography - Earth & Landforms',
            description: 'Shows subway or road tunnel structure',
            dataRequired: [],
            usage: 'Best for infrastructure and engineering geography',
            examples: ['Underground transport', 'Tunnel construction', 'Infrastructure'],
            defaultOptions: {
                title: 'Transport Tunnel Cross-Section',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== AGRICULTURE =====
        'seedGerminationCrossSection': {
            name: 'Seed Germination Cross-Section',
            category: 'Agriculture',
            description: 'Shows germination process stages',
            dataRequired: [],
            usage: 'Best for agricultural education and seed science',
            examples: ['Germination', 'Seed growth', 'Plant propagation'],
            defaultOptions: {
                title: 'Seed Germination Cross-Section',
                showLabels: true,
                showStages: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'rootSystemSoilCrossSection': {
            name: 'Root System in Soil Cross-Section',
            category: 'Agriculture',
            description: 'Shows root growth in different soil types',
            dataRequired: ['soilType'],
            usage: 'Best for soil-plant interactions',
            examples: ['Root development', 'Soil types', 'Water uptake'],
            soilTypeOptions: ['sandy', 'clay', 'loam'],
            defaultOptions: {
                title: 'Root System in Soil',
                soilType: 'loam',
                showLabels: true,
                width: 700,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'cultivatedSoilProfileCrossSection': {
            name: 'Cultivated Soil Profile Cross-Section',
            category: 'Agriculture',
            description: 'Shows soil horizons under cultivation',
            dataRequired: [],
            usage: 'Best for agricultural soil management',
            examples: ['Soil cultivation', 'Tillage effects', 'Soil health'],
            defaultOptions: {
                title: 'Cultivated Soil Profile',
                showLabels: true,
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'terraceFarmCrossSection': {
            name: 'Terrace Farm Cross-Section',
            category: 'Agriculture',
            description: 'Shows terraced slopes with retaining walls',
            dataRequired: [],
            usage: 'Best for soil conservation education',
            examples: ['Terracing', 'Soil conservation', 'Hillside farming'],
            defaultOptions: {
                title: 'Terrace Farm Cross-Section',
                showLabels: true,
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'drainageChannelCrossSection': {
            name: 'Drainage Channel Cross-Section',
            category: 'Agriculture',
            description: 'Shows slope and water flow management',
            dataRequired: [],
            usage: 'Best for irrigation and drainage planning',
            examples: ['Drainage systems', 'Water management', 'Field drainage'],
            defaultOptions: {
                title: 'Drainage Channel Cross-Section',
                showLabels: true,
                showWaterFlow: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'contourBundCrossSection': {
            name: 'Contour Bund Cross-Section',
            category: 'Agriculture',
            description: 'Shows erosion control structure',
            dataRequired: [],
            usage: 'Best for soil conservation practices',
            examples: ['Contour farming', 'Erosion control', 'Water harvesting'],
            defaultOptions: {
                title: 'Contour Bund Cross-Section',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'greenhouseCrossSection': {
            name: 'Greenhouse Cross-Section',
            category: 'Agriculture',
            description: 'Shows structure with ventilation and irrigation',
            dataRequired: [],
            usage: 'Best for controlled environment agriculture',
            examples: ['Greenhouse farming', 'Protected cultivation', 'Climate control'],
            defaultOptions: {
                title: 'Greenhouse Cross-Section',
                showLabels: true,
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'fishPondCrossSection': {
            name: 'Fish Pond Cross-Section',
            category: 'Agriculture',
            description: 'Shows inlet, outlet, and depth layers',
            dataRequired: [],
            usage: 'Best for aquaculture education',
            examples: ['Fish farming', 'Aquaculture', 'Pond management'],
            defaultOptions: {
                title: 'Fish Pond Cross-Section',
                showLabels: true,
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'compostPitCrossSection': {
            name: 'Compost Pit Cross-Section',
            category: 'Agriculture',
            description: 'Shows organic layers and air spaces',
            dataRequired: [],
            usage: 'Best for organic farming and composting',
            examples: ['Composting', 'Organic matter', 'Soil amendment'],
            defaultOptions: {
                title: 'Compost Pit Cross-Section',
                showLabels: true,
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'irrigationCanalCrossSection': {
            name: 'Irrigation Canal Cross-Section',
            category: 'Agriculture',
            description: 'Shows canal lining and water flow',
            dataRequired: [],
            usage: 'Best for irrigation system design',
            examples: ['Irrigation', 'Water distribution', 'Canal design'],
            defaultOptions: {
                title: 'Irrigation Canal Cross-Section',
                showLabels: true,
                showWaterFlow: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'cropFieldRootZoneCrossSection': {
            name: 'Crop Field Root Zone Cross-Section',
            category: 'Agriculture',
            description: 'Shows root zones and fertilizer placement',
            dataRequired: [],
            usage: 'Best for fertilizer management education',
            examples: ['Root zones', 'Fertilizer application', 'Nutrient uptake'],
            defaultOptions: {
                title: 'Crop Field Root Zone',
                showLabels: true,
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'animalHousingCrossSection': {
            name: 'Animal Housing Cross-Section',
            category: 'Agriculture',
            description: 'Shows ventilation, drainage, and bedding',
            dataRequired: [],
            usage: 'Best for livestock management',
            examples: ['Animal housing', 'Barn design', 'Livestock welfare'],
            defaultOptions: {
                title: 'Animal Housing Cross-Section',
                showLabels: true,
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'silagePitCrossSection': {
            name: 'Silage Pit Cross-Section',
            category: 'Agriculture',
            description: 'Shows storage structure for fodder preservation',
            dataRequired: [],
            usage: 'Best for fodder storage and livestock feeding',
            examples: ['Silage storage', 'Fodder preservation', 'Feed management'],
            defaultOptions: {
                title: 'Silage Pit Cross-Section',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'pastureLandCrossSection': {
            name: 'Pasture Land Cross-Section',
            category: 'Agriculture',
            description: 'Shows topsoil and root penetration',
            dataRequired: [],
            usage: 'Best for grassland management',
            examples: ['Pasture management', 'Grazing systems', 'Grass growth'],
            defaultOptions: {
                title: 'Pasture Land Cross-Section',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'hydroponicBedCrossSection': {
            name: 'Hydroponic Bed Cross-Section',
            category: 'Agriculture',
            description: 'Shows growth media layers and nutrient solution',
            dataRequired: [],
            usage: 'Best for soilless agriculture education',
            examples: ['Hydroponics', 'Soilless culture', 'Controlled agriculture'],
            defaultOptions: {
                title: 'Hydroponic Bed Cross-Section',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        }
    };

    static getDiagram(key) {
        return this.diagrams[key];
    }

    static getAllDiagrams() {
        return Object.keys(this.diagrams);
    }

    static getDiagramsByCategory(category) {
        return Object.entries(this.diagrams)
            .filter(([_, diagram]) => diagram.category === category)
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getAllCategories() {
        return [...new Set(Object.values(this.diagrams).map(d => d.category))];
    }

    static searchDiagrams(query) {
        const lowerQuery = query.toLowerCase();
        return Object.entries(this.diagrams)
            .filter(([key, diagram]) =>
                diagram.name.toLowerCase().includes(lowerQuery) ||
                diagram.description.toLowerCase().includes(lowerQuery) ||
                diagram.category.toLowerCase().includes(lowerQuery) ||
                key.toLowerCase().includes(lowerQuery)
            )
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getDiagramStats() {
        const stats = {};
        this.getAllCategories().forEach(category => {
            const diagrams = this.getDiagramsByCategory(category);
            stats[category] = {
                count: Object.keys(diagrams).length,
                diagrams: Object.keys(diagrams)
            };
        });
        return stats;
    }
}

// ============================================================================
// CROSS-SECTION SHAPES LIBRARY
// ============================================================================

class CrossSectionShapes {
    // ===== BIOLOGY - PLANT STRUCTURES =====
    
    static drawDicotLeaf(ctx, x, y, width, height, showCellDetail) {
        ctx.save();
        ctx.translate(x, y);

        // Upper epidermis
        ctx.fillStyle = '#C8E6C9';
        ctx.fillRect(0, 0, width, height * 0.08);
        
        // Cuticle
        ctx.fillStyle = '#A5D6A7';
        ctx.fillRect(0, 0, width, height * 0.03);

        // Palisade mesophyll (columnar cells)
        ctx.fillStyle = '#66BB6A';
        for(let i = 0; i < width / 15; i++) {
            const x = i * 15;
            ctx.fillRect(x, height * 0.08, 12, height * 0.25);
            if(showCellDetail) {
                // Chloroplasts
                ctx.fillStyle = '#2E7D32';
                for(let j = 0; j < 4; j++) {
                    ctx.fillRect(x + 3, height * (0.1 + j * 0.05), 3, 3);
                }
                ctx.fillStyle = '#66BB6A';
            }
        }

        // Spongy mesophyll (irregular cells with air spaces)
        ctx.fillStyle = '#81C784';
        for(let i = 0; i < 30; i++) {
            const cx = Math.random() * width;
            const cy = height * (0.35 + Math.random() * 0.3);
            const radius = 8 + Math.random() * 5;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Vascular bundle (vein)
        const veinX = width / 2;
        const veinY = height * 0.4;
        
        // Xylem
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.ellipse(veinX, veinY, 15, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Phloem
        ctx.fillStyle = '#BCAAA4';
        ctx.beginPath();
        ctx.ellipse(veinX, veinY + 30, 12, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Lower epidermis
        ctx.fillStyle = '#C8E6C9';
        ctx.fillRect(0, height * 0.92, width, height * 0.08);

        // Stomata (pores)
        ctx.fillStyle = '#FFFFFF';
        for(let i = 0; i < 5; i++) {
            const sx = (i + 1) * (width / 6);
            ctx.beginPath();
            ctx.ellipse(sx, height * 0.94, 4, 2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Guard cells
            ctx.strokeStyle = '#81C784';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(sx - 4, height * 0.94, 3, 0, Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(sx + 4, height * 0.94, 3, 0, Math.PI);
            ctx.stroke();
        }

        ctx.restore();
    }

    static drawMonocotLeaf(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        // Upper epidermis
        ctx.fillStyle = '#C8E6C9';
        ctx.fillRect(0, 0, width, height * 0.1);

        // Bulliform cells (large cells on upper epidermis)
        ctx.fillStyle = '#E8F5E9';
        for(let i = 0; i < width / 40; i++) {
            ctx.fillRect(i * 40 + 5, height * 0.02, 30, height * 0.08);
        }

        // Mesophyll (not differentiated into palisade and spongy)
        ctx.fillStyle = '#81C784';
        for(let i = 0; i < 40; i++) {
            const cx = Math.random() * width;
            const cy = height * (0.15 + Math.random() * 0.7);
            const radius = 6 + Math.random() * 4;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Parallel vascular bundles
        const bundleCount = 5;
        for(let i = 0; i < bundleCount; i++) {
            const bx = (i + 1) * (width / (bundleCount + 1));
            const by = height * 0.5;
            
            // Bundle sheath
            ctx.strokeStyle = '#689F38';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(bx, by, 18, 30, 0, 0, Math.PI * 2);
            ctx.stroke();
            
            // Xylem
            ctx.fillStyle = '#8D6E63';
            ctx.beginPath();
            ctx.ellipse(bx, by - 8, 8, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Phloem
            ctx.fillStyle = '#BCAAA4';
            ctx.beginPath();
            ctx.ellipse(bx, by + 8, 6, 10, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Lower epidermis
        ctx.fillStyle = '#C8E6C9';
        ctx.fillRect(0, height * 0.9, width, height * 0.1);

        // Stomata on both surfaces
        ctx.fillStyle = '#FFFFFF';
        for(let i = 0; i < 6; i++) {
            const sx = (i + 1) * (width / 7);
            ctx.beginPath();
            ctx.ellipse(sx, height * 0.93, 3, 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    static drawRootTip(ctx, x, y, width, height, showZones) {
        ctx.save();
        ctx.translate(x, y);

        // Root cap
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.moveTo(width * 0.3, height * 0.98);
        ctx.quadraticCurveTo(width * 0.5, height, width * 0.7, height * 0.98);
        ctx.lineTo(width * 0.7, height * 0.92);
        ctx.lineTo(width * 0.3, height * 0.92);
        ctx.closePath();
        ctx.fill();

        if(showZones) {
            // Zone of cell division (meristematic zone)
            ctx.fillStyle = '#FF8A65';
            ctx.fillRect(width * 0.25, height * 0.75, width * 0.5, height * 0.17);
            
            // Draw small cells
            ctx.strokeStyle = '#D84315';
            ctx.lineWidth = 1;
            for(let row = 0; row < 8; row++) {
                for(let col = 0; col < 10; col++) {
                    ctx.strokeRect(
                        width * 0.25 + col * (width * 0.05),
                        height * 0.75 + row * (height * 0.02),
                        width * 0.05,
                        height * 0.02
                    );
                }
            }

            // Zone of elongation
            ctx.fillStyle = '#FFB74D';
            ctx.fillRect(width * 0.28, height * 0.5, width * 0.44, height * 0.25);
            
            // Elongated cells
            ctx.strokeStyle = '#F57C00';
            for(let row = 0; row < 10; row++) {
                for(let col = 0; col < 8; col++) {
                    ctx.strokeRect(
                        width * 0.28 + col * (width * 0.055),
                        height * 0.5 + row * (height * 0.025),
                        width * 0.055,
                        height * 0.025
                    );
                }
            }

            // Zone of maturation
            ctx.fillStyle = '#FFE082';
            ctx.fillRect(width * 0.3, height * 0.1, width * 0.4, height * 0.4);
            
            // Root hairs
            ctx.strokeStyle = '#FFA726';
            ctx.lineWidth = 2;
            for(let i = 0; i < 15; i++) {
                const hairY = height * (0.15 + Math.random() * 0.3);
                ctx.beginPath();
                ctx.moveTo(width * 0.3, hairY);
                ctx.lineTo(width * 0.15, hairY - 10);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(width * 0.7, hairY);
                ctx.lineTo(width * 0.85, hairY - 10);
                ctx.stroke();
            }

            // Vascular cylinder
            ctx.fillStyle = '#8D6E63';
            ctx.fillRect(width * 0.42, height * 0.1, width * 0.16, height * 0.65);
        }

        // Outline
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width * 0.3, height * 0.92);
        ctx.lineTo(width * 0.3, height * 0.1);
        ctx.quadraticCurveTo(width * 0.3, height * 0.05, width * 0.35, height * 0.05);
        ctx.lineTo(width * 0.65, height * 0.05);
        ctx.quadraticCurveTo(width * 0.7, height * 0.05, width * 0.7, height * 0.1);
        ctx.lineTo(width * 0.7, height * 0.92);
        ctx.stroke();

        ctx.restore();
    }

    static drawDicotStem(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.45;

        // Epidermis
        ctx.fillStyle = '#D7CCC8';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Cortex
        ctx.fillStyle = '#E0E0E0';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2);
        ctx.fill();

        // Vascular bundles in a ring
        const bundleCount = 8;
        const bundleRadius = radius * 0.7;
        
        for(let i = 0; i < bundleCount; i++) {
            const angle = (i / bundleCount) * Math.PI * 2;
            const bx = centerX + Math.cos(angle) * bundleRadius;
            const by = centerY + Math.sin(angle) * bundleRadius;
            
            // Vascular bundle
            ctx.fillStyle = '#A1887F';
            ctx.beginPath();
            ctx.ellipse(bx, by, radius * 0.12, radius * 0.15, angle, 0, Math.PI * 2);
            ctx.fill();
            
            // Xylem (inner, larger)
            ctx.fillStyle = '#8D6E63';
            ctx.beginPath();
            ctx.ellipse(
                bx + Math.cos(angle) * radius * 0.08,
                by + Math.sin(angle) * radius * 0.08,
                radius * 0.06,
                radius * 0.08,
                angle,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Phloem (outer, smaller)
            ctx.fillStyle = '#BCAAA4';
            ctx.beginPath();
            ctx.ellipse(
                bx - Math.cos(angle) * radius * 0.04,
                by - Math.sin(angle) * radius * 0.04,
                radius * 0.04,
                radius * 0.05,
                angle,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Cambium (thin layer between xylem and phloem)
            ctx.strokeStyle = '#FF6F00';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(bx, by, radius * 0.06, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Pith (center)
        ctx.fillStyle = '#F5F5F5';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Pith cells
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;
        for(let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius * 0.35;
            const cx = centerX + Math.cos(angle) * dist;
            const cy = centerY + Math.sin(angle) * dist;
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Outer outline
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    static drawMonocotStem(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.45;

        // Epidermis
        ctx.fillStyle = '#D7CCC8';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Ground tissue (no distinct cortex or pith)
        ctx.fillStyle = '#E8EAF6';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.95, 0, Math.PI * 2);
        ctx.fill();

        // Scattered vascular bundles
        const bundleCount = 20;
        
        for(let i = 0; i < bundleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius * 0.75;
            const bx = centerX + Math.cos(angle) * dist;
            const by = centerY + Math.sin(angle) * dist;
            const bundleSize = radius * (0.08 + Math.random() * 0.05);
            
            // Bundle sheath
            ctx.strokeStyle = '#9E9D24';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(bx, by, bundleSize, 0, Math.PI * 2);
            ctx.stroke();
            
            // Xylem vessels (two large vessels forming a V or Y shape)
            ctx.fillStyle = '#6D4C41';
            ctx.beginPath();
            ctx.arc(bx - bundleSize * 0.3, by + bundleSize * 0.2, bundleSize * 0.25, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(bx + bundleSize * 0.3, by + bundleSize * 0.2, bundleSize * 0.25, 0, Math.PI * 2);
            ctx.fill();
            
            // Phloem (small groups)
            ctx.fillStyle = '#A1887F';
            ctx.beginPath();
            ctx.arc(bx, by - bundleSize * 0.3, bundleSize * 0.2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Outer outline
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    static drawFlowerOvary(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        const centerX = width / 2;
        const centerY = height / 2;

        // Ovary wall
        ctx.fillStyle = '#E1BEE7';
        ctx.strokeStyle = '#8E24AA';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, width * 0.4, height * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Locules (chambers)
        const loculeCount = 3;
        for(let i = 0; i < loculeCount; i++) {
            const angle = (i / loculeCount) * Math.PI * 2 - Math.PI / 2;
            const lx = centerX + Math.cos(angle) * width * 0.15;
            const ly = centerY + Math.sin(angle) * height * 0.15;
            
            // Locule cavity
            ctx.fillStyle = '#F3E5F5';
            ctx.beginPath();
            ctx.ellipse(lx, ly, width * 0.12, height * 0.15, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#9C27B0';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Ovules in each locule
            const ovuleCount = 2;
            for(let j = 0; j < ovuleCount; j++) {
                const oy = ly - height * 0.08 + j * height * 0.08;
                
                // Ovule
                ctx.fillStyle = '#FFE082';
                ctx.beginPath();
                ctx.ellipse(lx, oy, width * 0.04, height * 0.05, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Funiculus (stalk)
                ctx.strokeStyle = '#FFA726';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(lx, oy + height * 0.05);
                ctx.lineTo(lx, ly + height * 0.12);
                ctx.stroke();
            }
        }

        // Style (central column)
        ctx.fillStyle = '#CE93D8';
        ctx.fillRect(centerX - width * 0.02, 0, width * 0.04, height * 0.3);
        
        // Stigma
        ctx.fillStyle = '#AB47BC';
        ctx.beginPath();
        ctx.ellipse(centerX, height * 0.05, width * 0.06, height * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    static drawSeed(ctx, x, y, width, height, seedType) {
        ctx.save();
        ctx.translate(x, y);

        if(seedType === 'bean') {
            // Bean seed (dicot)
            
            // Seed coat (testa)
            ctx.fillStyle = '#8D6E63';
            ctx.beginPath();
            ctx.ellipse(width / 2, height / 2, width * 0.45, height * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Hilum (scar)
            ctx.fillStyle = '#5D4037';
            ctx.beginPath();
            ctx.ellipse(width * 0.2, height / 2, width * 0.05, height * 0.08, -Math.PI / 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Two cotyledons
            ctx.fillStyle = '#FFF9C4';
            ctx.beginPath();
            ctx.ellipse(width * 0.35, height / 2, width * 0.25, height * 0.32, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(width * 0.65, height / 2, width * 0.25, height * 0.32, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Embryo axis
            ctx.fillStyle = '#AED581';
            ctx.fillRect(width * 0.48, height * 0.3, width * 0.04, height * 0.4);
            
            // Plumule (shoot)
            ctx.beginPath();
            ctx.moveTo(width * 0.5, height * 0.3);
            ctx.lineTo(width * 0.45, height * 0.25);
            ctx.lineTo(width * 0.5, height * 0.28);
            ctx.lineTo(width * 0.55, height * 0.25);
            ctx.closePath();
            ctx.fill();
            
            // Radicle (root)
            ctx.beginPath();
            ctx.moveTo(width * 0.5, height * 0.7);
            ctx.lineTo(width * 0.48, height * 0.75);
            ctx.lineTo(width * 0.5, height * 0.73);
            ctx.lineTo(width * 0.52, height * 0.75);
            ctx.closePath();
            ctx.fill();
            
        } else if(seedType === 'maize') {
            // Maize seed (monocot)
            
            // Seed coat + pericarp fused
            ctx.fillStyle = '#FFD54F';
            ctx.beginPath();
            ctx.ellipse(width / 2, height / 2, width * 0.4, height * 0.45, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Endosperm (large, starchy)
            ctx.fillStyle = '#FFF59D';
            ctx.beginPath();
            ctx.ellipse(width * 0.55, height / 2, width * 0.32, height * 0.38, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Single cotyledon (scutellum)
            ctx.fillStyle = '#FFEB3B';
            ctx.beginPath();
            ctx.ellipse(width * 0.32, height / 2, width * 0.15, height * 0.25, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Embryo
            ctx.fillStyle = '#C5E1A5';
            ctx.fillRect(width * 0.25, height * 0.4, width * 0.08, height * 0.2);
            
            // Coleoptile (shoot sheath)
            ctx.strokeStyle = '#9CCC65';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(width * 0.29, height * 0.4);
            ctx.lineTo(width * 0.29, height * 0.3);
            ctx.stroke();
            
            // Radicle
            ctx.beginPath();
            ctx.moveTo(width * 0.29, height * 0.6);
            ctx.lineTo(width * 0.29, height * 0.7);
            ctx.stroke();
            
        } else if(seedType === 'peanut') {
            // Peanut seed
            
            // Seed coat (papery)
            ctx.fillStyle = '#D7CCC8';
            ctx.beginPath();
            ctx.ellipse(width / 2, height / 2, width * 0.42, height * 0.35, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Two large cotyledons
            ctx.fillStyle = '#FFECB3';
            ctx.beginPath();
            ctx.ellipse(width * 0.38, height / 2, width * 0.28, height * 0.28, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(width * 0.62, height / 2, width * 0.28, height * 0.28, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Embryo
            ctx.fillStyle = '#DCEDC8';
            ctx.fillRect(width * 0.48, height * 0.35, width * 0.04, height * 0.3);
        }

        // Outline
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(width / 2, height / 2, width * 0.45, height * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    static drawFruit(ctx, x, y, width, height, fruitType) {
        ctx.save();
        ctx.translate(x, y);

        const centerX = width / 2;
        const centerY = height / 2;

        if(fruitType === 'apple') {
            // Apple cross-section
            
            // Exocarp (skin)
            ctx.fillStyle = '#EF5350';
            ctx.beginPath();
            ctx.arc(centerX, centerY, width * 0.45, 0, Math.PI * 2);
            ctx.fill();
            
            // Mesocarp (flesh)
            ctx.fillStyle = '#FFF9C4';
            ctx.beginPath();
            ctx.arc(centerX, centerY, width * 0.4, 0, Math.PI * 2);
            ctx.fill();
            
            // Endocarp (core)
            ctx.fillStyle = '#F0F4C3';
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - height * 0.15);
            for(let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                const r = i % 2 === 0 ? width * 0.15 : width * 0.08;
                ctx.lineTo(
                    centerX + Math.cos(angle) * r,
                    centerY + Math.sin(angle) * r
                );
            }
            ctx.closePath();
            ctx.fill();
            
            // Seeds in locules
            for(let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                const sx = centerX + Math.cos(angle) * width * 0.12;
                const sy = centerY + Math.sin(angle) * width * 0.12;
                ctx.fillStyle = '#6D4C41';
                ctx.beginPath();
                ctx.ellipse(sx, sy, width * 0.02, width * 0.03, angle, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Vascular bundles
            for(let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2;
                ctx.strokeStyle = '#CDDC39';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(angle) * width * 0.35,
                    centerY + Math.sin(angle) * width * 0.35
                );
                ctx.stroke();
            }
            
            // Stem
            ctx.fillStyle = '#8D6E63';
            ctx.fillRect(centerX - width * 0.02, 0, width * 0.04, height * 0.15);
            
        } else if(fruitType === 'orange') {
            // Orange cross-section
            
            // Exocarp (peel)
            ctx.fillStyle = '#FF9800';
            ctx.beginPath();
            ctx.arc(centerX, centerY, width * 0.45, 0, Math.PI * 2);
            ctx.fill();
            
            // Mesocarp (pith)
            ctx.fillStyle = '#FFF3E0';
            ctx.beginPath();
            ctx.arc(centerX, centerY, width * 0.38, 0, Math.PI * 2);
            ctx.fill();
            
            // Segments (carpels)
            const segmentCount = 10;
            for(let i = 0; i < segmentCount; i++) {
                const angle1 = (i / segmentCount) * Math.PI * 2;
                const angle2 = ((i + 1) / segmentCount) * Math.PI * 2;
                
                ctx.fillStyle = '#FFB74D';
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, width * 0.35, angle1, angle2);
                ctx.closePath();
                ctx.fill();
                
                // Segment membrane
                ctx.strokeStyle = '#FFF3E0';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Juice vesicles
                for(let j = 0; j < 3; j++) {
                    const r = width * (0.15 + j * 0.08);
                    const vx = centerX + Math.cos((angle1 + angle2) / 2) * r;
                    const vy = centerY + Math.sin((angle1 + angle2) / 2) * r;
                    ctx.fillStyle = '#FFCC80';
                    ctx.beginPath();
                    ctx.ellipse(vx, vy, width * 0.02, width * 0.03, (angle1 + angle2) / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
        } else if(fruitType === 'tomato') {
            // Tomato cross-section
            
            // Exocarp (skin)
            ctx.fillStyle = '#F44336';
            ctx.beginPath();
            ctx.arc(centerX, centerY, width * 0.45, 0, Math.PI * 2);
            ctx.fill();
            
            // Mesocarp (flesh)
            ctx.fillStyle = '#FFCDD2';
            ctx.beginPath();
            ctx.arc(centerX, centerY, width * 0.42, 0, Math.PI * 2);
            ctx.fill();
            
            // Locular cavities (chambers with seeds)
            const locules = 4;
            for(let i = 0; i < locules; i++) {
                const angle = (i / locules) * Math.PI * 2 - Math.PI / 4;
                const lx = centerX + Math.cos(angle) * width * 0.2;
                const ly = centerY + Math.sin(angle) * width * 0.2;
                
                // Cavity
                ctx.fillStyle = '#FFEBEE';
                ctx.beginPath();
                ctx.ellipse(lx, ly, width * 0.12, width * 0.15, angle, 0, Math.PI * 2);
                ctx.fill();
                
                // Seeds in gel
                for(let j = 0; j < 8; j++) {
                    const sa = Math.random() * Math.PI * 2;
                    const sr = Math.random() * width * 0.08;
                    const sx = lx + Math.cos(sa) * sr;
                    const sy = ly + Math.sin(sa) * sr;
                    ctx.fillStyle = '#FFF59D';
                    ctx.beginPath();
                    ctx.ellipse(sx, sy, width * 0.015, width * 0.02, sa, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Central columella
            ctx.fillStyle = '#FFCDD2';
            ctx.beginPath();
            ctx.arc(centerX, centerY, width * 0.08, 0, Math.PI * 2);
            ctx.fill();
            
        } else if(fruitType === 'berry') {
            // Generic berry cross-section
            
            // Exocarp
            ctx.fillStyle = '#7B1FA2';
            ctx.beginPath();
            ctx.arc(centerX, centerY, width * 0.4, 0, Math.PI * 2);
            ctx.fill();
            
            // Mesocarp
            ctx.fillStyle = '#CE93D8';
            ctx.beginPath();
            ctx.arc(centerX, centerY, width * 0.35, 0, Math.PI * 2);
            ctx.fill();
            
            // Endocarp
            ctx.fillStyle = '#E1BEE7';
            ctx.beginPath();
            ctx.arc(centerX, centerY, width * 0.25, 0, Math.PI * 2);
            ctx.fill();
            
            // Seeds scattered throughout
            for(let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * width * 0.22;
                const sx = centerX + Math.cos(angle) * dist;
                const sy = centerY + Math.sin(angle) * dist;
                ctx.fillStyle = '#4A148C';
                ctx.beginPath();
                ctx.ellipse(sx, sy, width * 0.02, width * 0.025, angle, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Outer outline
        ctx.strokeStyle = '#212121';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, width * 0.45, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    // ===== BIOLOGY - ANIMAL ANATOMY =====

    static drawBrain(ctx, x, y, width, height, plane) {
        ctx.save();
        ctx.translate(x, y);

        if(plane === 'sagittal') {
            // Sagittal (side view) brain cross-section
            
            // Cerebrum
            ctx.fillStyle = '#FFCCBC';
            ctx.beginPath();
            ctx.moveTo(width * 0.3, height * 0.15);
            ctx.bezierCurveTo(width * 0.1, height * 0.1, width * 0.05, height * 0.3, width * 0.15, height * 0.5);
            ctx.bezierCurveTo(width * 0.2, height * 0.6, width * 0.3, height * 0.65, width * 0.45, height * 0.65);
            ctx.lineTo(width * 0.55, height * 0.65);
            ctx.bezierCurveTo(width * 0.7, height * 0.65, width * 0.85, height * 0.55, width * 0.9, height * 0.4);
            ctx.bezierCurveTo(width * 0.95, height * 0.25, width * 0.85, height * 0.1, width * 0.65, height * 0.15);
            ctx.closePath();
            ctx.fill();

            // Corpus callosum
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.ellipse(width * 0.5, height * 0.4, width * 0.15, height * 0.05, 0, 0, Math.PI * 2);
            ctx.fill();

            // Thalamus
            ctx.fillStyle = '#F8BBD0';
            ctx.beginPath();
            ctx.ellipse(width * 0.48, height * 0.45, width * 0.06, height * 0.08, 0, 0, Math.PI * 2);
            ctx.fill();

            // Hypothalamus
            ctx.fillStyle = '#F48FB1';
            ctx.beginPath();
            ctx.ellipse(width * 0.45, height * 0.52, width * 0.04, height * 0.05, 0, 0, Math.PI * 2);
            ctx.fill();

            // Midbrain
            ctx.fillStyle = '#CE93D8';
            ctx.beginPath();
            ctx.ellipse(width * 0.48, height * 0.58, width * 0.05, height * 0.06, 0, 0, Math.PI * 2);
            ctx.fill();

            // Pons
            ctx.fillStyle = '#B39DDB';
            ctx.beginPath();
            ctx.rect(width * 0.42, height * 0.62, width * 0.12, height * 0.06);
            ctx.fill();

            // Medulla oblongata
            ctx.fillStyle = '#9575CD';
            ctx.beginPath();
            ctx.moveTo(width * 0.45, height * 0.68);
            ctx.lineTo(width * 0.42, height * 0.78);
            ctx.lineTo(width * 0.48, height * 0.78);
            ctx.lineTo(width * 0.52, height * 0.78);
            ctx.lineTo(width * 0.58, height * 0.78);
            ctx.lineTo(width * 0.55, height * 0.68);
            ctx.closePath();
            ctx.fill();

            // Cerebellum
            ctx.fillStyle = '#FFAB91';
            ctx.beginPath();
            ctx.ellipse(width * 0.35, height * 0.72, width * 0.12, height * 0.15, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Cerebellar folia (folds)
            ctx.strokeStyle = '#FF8A65';
            ctx.lineWidth = 1;
            for(let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.moveTo(width * (0.25 + i * 0.025), height * 0.65);
                ctx.lineTo(width * (0.25 + i * 0.025), height * 0.8);
                ctx.stroke();
            }

            // Ventricles
            ctx.fillStyle = '#B3E5FC';
            ctx.beginPath();
            ctx.ellipse(width * 0.52, height * 0.35, width * 0.08, height * 0.06, 0, 0, Math.PI * 2);
            ctx.fill();

            // Cerebral cortex (gray matter folds)
            ctx.strokeStyle = '#D84315';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width * 0.3, height * 0.15);
            ctx.bezierCurveTo(width * 0.1, height * 0.1, width * 0.05, height * 0.3, width * 0.15, height * 0.5);
            ctx.bezierCurveTo(width * 0.2, height * 0.6, width * 0.3, height * 0.65, width * 0.45, height * 0.65);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(width * 0.65, height * 0.15);
            ctx.bezierCurveTo(width * 0.85, height * 0.1, width * 0.95, height * 0.25, width * 0.9, height * 0.4);
            ctx.bezierCurveTo(width * 0.85, height * 0.55, width * 0.7, height * 0.65, width * 0.55, height * 0.65);
            ctx.stroke();

            // Sulci (grooves)
            for(let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(width * (0.35 + i * 0.08), height * 0.2);
                ctx.quadraticCurveTo(
                    width * (0.37 + i * 0.08), height * 0.25,
                    width * (0.35 + i * 0.08), height * 0.3
                );
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    static drawSmallIntestine(ctx, x, y, width, height, showVilli) {
        ctx.save();
        ctx.translate(x, y);

        // Serosa (outer layer)
        ctx.fillStyle = '#FFF9C4';
        ctx.fillRect(0, 0, width, height);

        // Longitudinal muscle layer
        ctx.fillStyle = '#FFCCBC';
        ctx.fillRect(width * 0.05, height * 0.05, width * 0.9, height * 0.1);
        
        // Muscle fibers
        ctx.strokeStyle = '#FF8A65';
        ctx.lineWidth = 1;
        for(let i = 0; i < 15; i++) {
            ctx.beginPath();
            ctx.moveTo(width * (0.1 + i * 0.06), height * 0.05);
            ctx.lineTo(width * (0.1 + i * 0.06), height * 0.15);
            ctx.stroke();
        }

        // Circular muscle layer
        ctx.fillStyle = '#FFAB91';
        ctx.fillRect(width * 0.05, height * 0.15, width * 0.9, height * 0.12);
        
        // Circular patterns
        for(let i = 0; i < 8; i++) {
            ctx.strokeStyle = '#FF7043';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(
                width * (0.15 + i * 0.1), 
                height * 0.21, 
                width * 0.04, 
                height * 0.05, 
                0, 0, Math.PI * 2
            );
            ctx.stroke();
        }

        // Submucosa
        ctx.fillStyle = '#FFE0B2';
        ctx.fillRect(width * 0.05, height * 0.27, width * 0.9, height * 0.15);
        
        // Blood vessels in submucosa
        ctx.strokeStyle = '#E53935';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width * 0.1, height * 0.34);
        for(let i = 0; i < 10; i++) {
            ctx.quadraticCurveTo(
                width * (0.1 + i * 0.08), height * (0.32 + (i % 2) * 0.04),
                width * (0.18 + i * 0.08), height * 0.34
            );
        }
        ctx.stroke();

        // Mucosa
        ctx.fillStyle = '#FFF3E0';
        ctx.fillRect(width * 0.05, height * 0.42, width * 0.9, height * 0.2);

        if(showVilli) {
            // Intestinal villi
            const villiCount = 12;
            for(let i = 0; i < villiCount; i++) {
                const vx = width * (0.1 + i * 0.075);
                const vy = height * 0.42;
                const vHeight = height * 0.18;
                
                // Villus shape
                ctx.fillStyle = '#FFEBEE';
                ctx.beginPath();
                ctx.moveTo(vx, vy);
                ctx.bezierCurveTo(
                    vx - width * 0.02, vy + vHeight * 0.3,
                    vx - width * 0.015, vy + vHeight * 0.7,
                    vx, vy + vHeight
                );
                ctx.bezierCurveTo(
                    vx + width * 0.015, vy + vHeight * 0.7,
                    vx + width * 0.02, vy + vHeight * 0.3,
                    vx, vy
                );
                ctx.closePath();
                ctx.fill();
                
                // Capillary network
                ctx.strokeStyle = '#EF5350';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(vx, vy + vHeight * 0.2);
                ctx.lineTo(vx, vy + vHeight * 0.9);
                ctx.stroke();
                
                // Lacteal (central lymph vessel)
                ctx.strokeStyle = '#FFF59D';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(vx, vy + vHeight * 0.15);
                ctx.lineTo(vx, vy + vHeight * 0.85);
                ctx.stroke();
                
                // Microvilli (brush border)
                ctx.strokeStyle = '#F48FB1';
                ctx.lineWidth = 0.5;
                for(let j = -3; j <= 3; j++) {
                    ctx.beginPath();
                    ctx.moveTo(vx + j * 1.5, vy + vHeight);
                    ctx.lineTo(vx + j * 1.5, vy + vHeight + 5);
                    ctx.stroke();
                }
            }
        }

        // Crypts of Lieberkühn (intestinal glands)
        ctx.fillStyle = '#FFF9C4';
        for(let i = 0; i < 8; i++) {
            ctx.fillRect(
                width * (0.12 + i * 0.1), 
                height * 0.62, 
                width * 0.03, 
                height * 0.1
            );
        }

        // Lumen (inner space)
        ctx.fillStyle = '#E3F2FD';
        ctx.fillRect(width * 0.05, height * 0.72, width * 0.9, height * 0.23);

        // Outline
        ctx.strokeStyle = '#6D4C41';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, width, height);

        ctx.restore();
    }

    static drawFishGills(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        // Gill arch (cartilaginous support)
        ctx.fillStyle = '#E0E0E0';
        ctx.fillRect(width * 0.1, 0, width * 0.15, height);
        
        // Gill rakers (filter feeders)
        ctx.strokeStyle = '#BDBDBD';
        ctx.lineWidth = 2;
        for(let i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.moveTo(width * 0.1, height * (0.05 + i * 0.08));
            ctx.lineTo(width * 0.05, height * (0.05 + i * 0.08));
            ctx.stroke();
        }

        // Gill filaments (primary lamellae)
        const filamentCount = 15;
        for(let i = 0; i < filamentCount; i++) {
            const fy = height * (0.05 + i * 0.06);
            
            // Filament
            ctx.fillStyle = '#EF5350';
            ctx.fillRect(width * 0.25, fy, width * 0.5, height * 0.04);
            
            // Secondary lamellae (gas exchange surfaces)
            const lamellaeCount = 20;
            for(let j = 0; j < lamellaeCount; j++) {
                const lx = width * (0.27 + j * 0.023);
                
                // Upper lamella
                ctx.fillStyle = '#FFCDD2';
                ctx.beginPath();
                ctx.moveTo(lx, fy);
                ctx.lineTo(lx - 3, fy - 8);
                ctx.lineTo(lx + 3, fy - 8);
                ctx.closePath();
                ctx.fill();
                
                // Lower lamella
                ctx.beginPath();
                ctx.moveTo(lx, fy + height * 0.04);
                ctx.lineTo(lx - 3, fy + height * 0.04 + 8);
                ctx.lineTo(lx + 3, fy + height * 0.04 + 8);
                ctx.closePath();
                ctx.fill();
                
                // Capillaries in lamellae
                ctx.strokeStyle = '#D32F2F';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(lx, fy - 7);
                ctx.lineTo(lx, fy - 3);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(lx, fy + height * 0.04 + 3);
                ctx.lineTo(lx, fy + height * 0.04 + 7);
                ctx.stroke();
            }
            
            // Afferent and efferent blood vessels
            ctx.strokeStyle = '#C62828';
            ctx.lineWidth = 3;
            // Afferent (brings deoxygenated blood)
            ctx.beginPath();
            ctx.moveTo(width * 0.25, fy + height * 0.02);
            ctx.lineTo(width * 0.27, fy + height * 0.02);
            ctx.stroke();
            // Efferent (carries oxygenated blood)
            ctx.strokeStyle = '#E53935';
            ctx.beginPath();
            ctx.moveTo(width * 0.73, fy + height * 0.02);
            ctx.lineTo(width * 0.75, fy + height * 0.02);
            ctx.stroke();
        }

        // Water flow arrows
        ctx.fillStyle = '#64B5F6';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('H₂O →', width * 0.78, height * 0.3);
        ctx.fillText('O₂ rich', width * 0.78, height * 0.5);

        ctx.restore();
    }

    static drawInsectThorax(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        const centerX = width / 2;
        const centerY = height / 2;

        // Exoskeleton (cuticle)
        ctx.strokeStyle = '#8D6E63';
        ctx.lineWidth = 8;
        ctx.fillStyle = '#D7CCC8';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, width * 0.45, height * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Epidermis (beneath cuticle)
        ctx.fillStyle = '#BCAAA4';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, width * 0.42, height * 0.37, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body cavity (hemocoel)
        ctx.fillStyle = '#FFF9C4';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, width * 0.38, height * 0.33, 0, 0, Math.PI * 2);
        ctx.fill();

        // Flight muscles (dorsoventral and longitudinal)
        ctx.fillStyle = '#FFAB91';
        
        // Dorsoventral muscles (vertical)
        for(let i = 0; i < 4; i++) {
            ctx.fillRect(
                width * (0.3 + i * 0.15),
                height * 0.22,
                width * 0.08,
                height * 0.56
            );
        }
        
        // Longitudinal muscles (horizontal)
        ctx.fillStyle = '#FF8A65';
        ctx.fillRect(width * 0.15, height * 0.35, width * 0.7, height * 0.08);
        ctx.fillRect(width * 0.15, height * 0.57, width * 0.7, height * 0.08);

        // Tracheal system (respiratory tubes)
        ctx.strokeStyle = '#B3E5FC';
        ctx.lineWidth = 3;
        
        // Main tracheal trunks
        ctx.beginPath();
        ctx.moveTo(width * 0.05, centerY);
        ctx.lineTo(width * 0.95, centerY);
        ctx.stroke();
        
        // Lateral tracheae
        for(let i = 0; i < 5; i++) {
            const tx = width * (0.2 + i * 0.15);
            ctx.beginPath();
            ctx.moveTo(tx, centerY);
            ctx.lineTo(tx, height * 0.15);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(tx, centerY);
            ctx.lineTo(tx, height * 0.85);
            ctx.stroke();
        }
        
        // Tracheoles (fine branches)
        ctx.lineWidth = 1;
        for(let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r1 = width * 0.15;
            const r2 = width * 0.3;
            ctx.beginPath();
            ctx.moveTo(
                centerX + Math.cos(angle) * r1,
                centerY + Math.sin(angle) * r1
            );
            ctx.lineTo(
                centerX + Math.cos(angle) * r2,
                centerY + Math.sin(angle) * r2
            );
            ctx.stroke();
        }

        // Spiracles (breathing pores)
        ctx.fillStyle = '#212121';
        for(let i = 0; i < 2; i++) {
            const side = i === 0 ? 0.08 : 0.92;
            ctx.beginPath();
            ctx.ellipse(width * side, centerY, width * 0.02, height * 0.04, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Heart (dorsal vessel)
        ctx.fillStyle = '#F48FB1';
        ctx.fillRect(width * 0.35, height * 0.12, width * 0.3, height * 0.04);
        
        // Ostia (heart openings)
        ctx.fillStyle = '#E91E63';
        for(let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(width * (0.4 + i * 0.08), height * 0.14, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Nerve cord (ventral)
        ctx.strokeStyle = '#FDD835';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(width * 0.2, height * 0.82);
        ctx.lineTo(width * 0.8, height * 0.82);
        ctx.stroke();
        
        // Ganglia
        ctx.fillStyle = '#F9A825';
        for(let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(width * (0.35 + i * 0.15), height * 0.82, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Digestive system (gut)
        ctx.strokeStyle = '#AED581';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(width * 0.15, height * 0.68);
        ctx.quadraticCurveTo(centerX, height * 0.62, width * 0.85, height * 0.68);
        ctx.stroke();

        ctx.restore();
    }

    static drawFlowerBud(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        const centerX = width / 2;
        const centerY = height / 2;

        // Receptacle (base)
        ctx.fillStyle = '#C5E1A5';
        ctx.beginPath();
        ctx.ellipse(centerX, height * 0.85, width * 0.15, height * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Developing sepals (outermost)
        ctx.fillStyle = '#9CCC65';
        for(let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(0, -height * 0.3, width * 0.12, height * 0.25, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Developing petals
        ctx.fillStyle = '#FFB74D';
        for(let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(0, -height * 0.22, width * 0.1, height * 0.18, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Developing stamens
        ctx.fillStyle = '#FFE082';
        ctx.strokeStyle = '#FFA726';
        ctx.lineWidth = 2;
        for(let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const sx = centerX + Math.cos(angle) * width * 0.08;
            const sy = centerY + Math.sin(angle) * height * 0.08;
            
            // Filament
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(sx, sy);
            ctx.stroke();
            
            // Developing anther
            ctx.fillStyle = '#FDD835';
            ctx.beginPath();
            ctx.ellipse(sx, sy, width * 0.02, height * 0.03, angle, 0, Math.PI * 2);
            ctx.fill();
        }

        // Developing carpel (center)
        ctx.fillStyle = '#E1BEE7';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, width * 0.06, height * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stigma (top of carpel)
        ctx.fillStyle = '#CE93D8';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - height * 0.08, width * 0.03, height * 0.03, 0, 0, Math.PI * 2);
        ctx.fill();

        // Developing ovules
        ctx.fillStyle = '#FFF9C4';
        for(let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(
                centerX + (i - 1) * width * 0.02,
                centerY + height * 0.05,
                width * 0.015,
                0, Math.PI * 2
            );
            ctx.fill();
        }

        ctx.restore();
    }

    // ===== GEOGRAPHY - EARTH & LANDFORMS =====

    static drawEarth(ctx, x, y, width, height, showDepths) {
        ctx.save();
        ctx.translate(x, y);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.45;

        // Inner core (solid iron-nickel)
        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Outer core (liquid iron-nickel)
        ctx.fillStyle = '#FF9800';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // Lower mantle
        ctx.fillStyle = '#FF5722';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Upper mantle
        ctx.fillStyle = '#F44336';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.85, 0, Math.PI * 2);
        ctx.fill();

        // Asthenosphere (partially molten layer)
        ctx.fillStyle = '#EF5350';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.92, 0, Math.PI * 2);
        ctx.fill();

        // Lithosphere (crust + upper mantle)
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.97, 0, Math.PI * 2);
        ctx.fill();

        // Crust
        ctx.fillStyle = '#A1887F';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Continental crust (thicker)
        ctx.fillStyle = '#BCAAA4';
        ctx.beginPath();
        ctx.arc(centerX + radius * 0.3, centerY - radius * 0.85, radius * 0.15, 0, Math.PI);
        ctx.fill();

        // Oceanic crust (thinner)
        ctx.fillStyle = '#90A4AE';
        ctx.beginPath();
        ctx.arc(centerX - radius * 0.4, centerY - radius * 0.9, radius * 0.08, 0, Math.PI);
        ctx.fill();

        if(showDepths) {
            // Depth labels
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Inner Core', centerX, centerY);
            ctx.fillText('1220 km', centerX, centerY + 15);
            
            ctx.fillText('Outer Core', centerX + radius * 0.28, centerY);
            ctx.fillText('2260 km', centerX + radius * 0.28, centerY + 15);
            
            ctx.fillText('Mantle', centerX + radius * 0.7, centerY);
            ctx.fillText('2900 km', centerX + radius * 0.7, centerY + 15);
            
            ctx.fillStyle = '#000000';
            ctx.fillText('Crust', centerX, centerY - radius * 0.9);
            ctx.fillText('5-70 km', centerX, centerY - radius * 0.85);
        }

        // Layer boundaries
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        [0.2, 0.35, 0.6, 0.85, 0.92, 0.97].forEach(r => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * r, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        ctx.setLineDash([]);

        // Outer boundary
        ctx.strokeStyle = '#212121';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    static drawVolcano(ctx, x, y, width, height, showLavaFlow) {
        ctx.save();
        ctx.translate(x, y);

        // Magma chamber
        ctx.fillStyle = '#FF5722';
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.85, width * 0.25, height * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Conduit (main vent)
        ctx.fillStyle = '#FF6F00';
        ctx.fillRect(width * 0.47, height * 0.3, width * 0.06, height * 0.44);

        // Volcanic cone
        ctx.fillStyle = '#6D4C41';
        ctx.beginPath();
        ctx.moveTo(width * 0.1, height * 0.7);
        ctx.lineTo(width * 0.45, height * 0.25);
        ctx.lineTo(width * 0.55, height * 0.25);
        ctx.lineTo(width * 0.9, height * 0.7);
        ctx.closePath();
        ctx.fill();

        // Volcanic layers (strata)
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 2;
        for(let i = 0; i < 6; i++) {
            const layerY = height * (0.35 + i * 0.06);
            const layerWidth = width * (0.3 - i * 0.04);
            ctx.beginPath();
            ctx.moveTo(width * 0.5 - layerWidth, layerY);
            ctx.lineTo(width * 0.5 + layerWidth, layerY);
            ctx.stroke();
        }

        // Crater
        ctx.fillStyle = '#424242';
        ctx.beginPath();
        ctx.moveTo(width * 0.45, height * 0.25);
        ctx.lineTo(width * 0.42, height * 0.2);
        ctx.lineTo(width * 0.58, height * 0.2);
        ctx.lineTo(width * 0.55, height * 0.25);
        ctx.closePath();
        ctx.fill();

        if(showLavaFlow) {
            // Erupting lava
            ctx.fillStyle = '#FF6F00';
            ctx.beginPath();
            ctx.moveTo(width * 0.48, height * 0.2);
            ctx.lineTo(width * 0.45, height * 0.05);
            ctx.lineTo(width * 0.5, height * 0.02);
            ctx.lineTo(width * 0.55, height * 0.05);
            ctx.lineTo(width * 0.52, height * 0.2);
            ctx.closePath();
            ctx.fill();

            // Lava flow down slope
            ctx.fillStyle = '#FF5722';
            ctx.beginPath();
            ctx.moveTo(width * 0.55, height * 0.25);
            ctx.quadraticCurveTo(width * 0.6, height * 0.4, width * 0.7, height * 0.7);
            ctx.lineTo(width * 0.75, height * 0.7);
            ctx.quadraticCurveTo(width * 0.65, height * 0.42, width * 0.58, height * 0.25);
            ctx.closePath();
            ctx.fill();

            // Pyroclastic material
            ctx.fillStyle = '#B71C1C';
            for(let i = 0; i < 10; i++) {
                const px = width * (0.3 + Math.random() * 0.4);
                const py = height * (0.05 + Math.random() * 0.15);
                ctx.beginPath();
                ctx.arc(px, py, 2 + Math.random() * 3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Volcanic ash cloud
            ctx.fillStyle = 'rgba(97, 97, 97, 0.5)';
            ctx.beginPath();
            ctx.ellipse(width * 0.5, height * 0.08, width * 0.2, height * 0.08, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Side vents
        ctx.fillStyle = '#D84315';
        ctx.fillRect(width * 0.3, height * 0.5, width * 0.04, height * 0.15);
        ctx.fillRect(width * 0.66, height * 0.55, width * 0.04, height * 0.1);

        // Dike (intrusive feature)
        ctx.fillStyle = '#FF7043';
        ctx.save();
        ctx.translate(width * 0.3, height * 0.7);
        ctx.rotate(-Math.PI / 6);
        ctx.fillRect(0, 0, width * 0.15, height * 0.03);
        ctx.restore();

        // Sill (horizontal intrusion)
        ctx.fillStyle = '#FF8A65';
        ctx.fillRect(width * 0.2, height * 0.6, width * 0.25, height * 0.02);

        // Ground surface
        ctx.fillStyle = '#4E342E';
        ctx.fillRect(0, height * 0.7, width, height * 0.3);

        ctx.restore();
    }

    static drawFoldMountain(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        const colors = ['#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8', '#EFEBE9'];

        // Draw rock layers with folds
        const layers = 5;
        for(let layer = 0; layer < layers; layer++) {
            ctx.fillStyle = colors[layer];
            ctx.strokeStyle = '#5D4037';
            ctx.lineWidth = 1;

            ctx.beginPath();
            const baseY = height * 0.9 - layer * height * 0.15;

            // Create folded pattern
            ctx.moveTo(0, baseY);

            // Syncline (downfold)
            ctx.quadraticCurveTo(
                width * 0.15, baseY - height * 0.05,
                width * 0.25, baseY
            );

            // Anticline (upfold)
            ctx.quadraticCurveTo(
                width * 0.35, baseY + height * 0.15,
                width * 0.45, baseY + height * 0.25
            );

            // Peak
            ctx.quadraticCurveTo(
                width * 0.5, baseY + height * 0.28,
                width * 0.55, baseY + height * 0.25
            );

            // Descending anticline
            ctx.quadraticCurveTo(
                width * 0.65, baseY + height * 0.15,
                width * 0.75, baseY
            );

            // Final syncline
            ctx.quadraticCurveTo(
                width * 0.85, baseY - height * 0.05,
                width, baseY
            );

            // Close the layer
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // Add compression arrows
        ctx.strokeStyle = '#E53935';
        ctx.fillStyle = '#E53935';
        ctx.lineWidth = 3;

        // Left arrow
        ctx.beginPath();
        ctx.moveTo(width * 0.05, height * 0.5);
        ctx.lineTo(width * 0.15, height * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width * 0.15, height * 0.5);
        ctx.lineTo(width * 0.12, height * 0.47);
        ctx.lineTo(width * 0.12, height * 0.53);
        ctx.closePath();
        ctx.fill();

        // Right arrow
        ctx.beginPath();
        ctx.moveTo(width * 0.95, height * 0.5);
        ctx.lineTo(width * 0.85, height * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width * 0.85, height * 0.5);
        ctx.lineTo(width * 0.88, height * 0.47);
        ctx.lineTo(width * 0.88, height * 0.53);
        ctx.closePath();
        ctx.fill();

        // Label features
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Syncline', width * 0.25, height * 0.95);
        ctx.fillText('Anticline', width * 0.5, height * 0.3);
        ctx.fillText('Syncline', width * 0.75, height * 0.95);

        ctx.restore();
    }

    static drawFaultLine(ctx, x, y, width, height, faultType) {
        ctx.save();
        ctx.translate(x, y);

        const colors = ['#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8'];

        // Draw rock layers
        for(let i = 0; i < 4; i++) {
            ctx.fillStyle = colors[i];
            ctx.strokeStyle = '#5D4037';
            ctx.lineWidth = 1;

            const layerY = height * (0.2 + i * 0.2);
            const layerHeight = height * 0.2;

            if(faultType === 'normal') {
                // Normal fault (tension - hanging wall moves down)
                // Left block (footwall - stationary)
                ctx.fillRect(0, layerY, width * 0.45, layerHeight);
                ctx.strokeRect(0, layerY, width * 0.45, layerHeight);

                // Right block (hanging wall - dropped)
                const drop = height * 0.15;
                ctx.fillRect(width * 0.55, layerY + drop, width * 0.45, layerHeight);
                ctx.strokeRect(width * 0.55, layerY + drop, width * 0.45, layerHeight);

            } else if(faultType === 'reverse') {
                // Reverse/thrust fault (compression - hanging wall moves up)
                // Left block (footwall)
                ctx.fillRect(0, layerY, width * 0.45, layerHeight);
                ctx.strokeRect(0, layerY, width * 0.45, layerHeight);

                // Right block (hanging wall - pushed up)
                const uplift = height * 0.15;
                ctx.fillRect(width * 0.55, layerY - uplift, width * 0.45, layerHeight);
                ctx.strokeRect(width * 0.55, layerY - uplift, width * 0.45, layerHeight);

            } else if(faultType === 'strike-slip') {
                // Strike-slip fault (lateral movement)
                // Left block
                ctx.fillRect(0, layerY, width * 0.48, layerHeight);
                ctx.strokeRect(0, layerY, width * 0.48, layerHeight);

                // Right block (shifted)
                const shift = i * height * 0.05;
                ctx.fillRect(width * 0.52, layerY + shift, width * 0.48, layerHeight);
                ctx.strokeRect(width * 0.52, layerY + shift, width * 0.48, layerHeight);
            }
        }

        // Draw fault plane
        ctx.strokeStyle = '#D32F2F';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 5]);

        if(faultType === 'normal') {
            ctx.beginPath();
            ctx.moveTo(width * 0.45, height * 0.1);
            ctx.lineTo(width * 0.55, height * 0.9);
            ctx.stroke();
        } else if(faultType === 'reverse') {
            ctx.beginPath();
            ctx.moveTo(width * 0.55, height * 0.1);
            ctx.lineTo(width * 0.45, height * 0.9);
            ctx.stroke();
        } else if(faultType === 'strike-slip') {
            ctx.beginPath();
            ctx.moveTo(width * 0.5, 0);
            ctx.lineTo(width * 0.5, height);
            ctx.stroke();
        }

        ctx.setLineDash([]);

        // Movement arrows
        ctx.strokeStyle = '#1976D2';
        ctx.fillStyle = '#1976D2';
        ctx.lineWidth = 3;

        if(faultType === 'normal') {
            // Hanging wall down
            this.drawArrow(ctx, width * 0.7, height * 0.3, width * 0.7, height * 0.5);
        } else if(faultType === 'reverse') {
            // Hanging wall up
            this.drawArrow(ctx, width * 0.7, height * 0.5, width * 0.7, height * 0.3);
        } else if(faultType === 'strike-slip') {
            // Lateral movement
            this.drawArrow(ctx, width * 0.7, height * 0.5, width * 0.8, height * 0.5);
        }

        ctx.restore();
    }

    static drawArrow(ctx, x1, y1, x2, y2) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(
            x2 - 10 * Math.cos(angle - Math.PI / 6),
            y2 - 10 * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x2 - 10 * Math.cos(angle + Math.PI / 6),
            y2 - 10 * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    }

    static drawRiverValley(ctx, x, y, width, height, valleyType) {
        ctx.save();
        ctx.translate(x, y);

        if(valleyType === 'v-shaped') {
            // V-shaped valley (formed by river erosion)
            ctx.fillStyle = '#8D6E63';
            ctx.beginPath();
            ctx.moveTo(0, height * 0.3);
            ctx.lineTo(width * 0.5, height * 0.9);
            ctx.lineTo(width, height * 0.3);
            ctx.lineTo(width, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();

            // Steep valley sides
            ctx.strokeStyle = '#5D4037';
            ctx.lineWidth = 2;
            for(let i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.moveTo(i * (width * 0.05), height * 0.3);
                ctx.lineTo(width * 0.5 - (10 - i) * (width * 0.05), height * 0.9);
                ctx.stroke();
            }

            // River at bottom
            ctx.fillStyle = '#2196F3';
            ctx.beginPath();
            ctx.moveTo(width * 0.48, height * 0.9);
            ctx.lineTo(width * 0.48, height);
            ctx.lineTo(width * 0.52, height);
            ctx.lineTo(width * 0.52, height * 0.9);
            ctx.closePath();
            ctx.fill();

        } else if(valleyType === 'u-shaped') {
            // U-shaped valley (formed by glacial erosion)
            ctx.fillStyle = '#8D6E63';
            ctx.beginPath();
            ctx.moveTo(0, height * 0.2);
            ctx.quadraticCurveTo(width * 0.25, height * 0.9, width * 0.5, height * 0.95);
            ctx.quadraticCurveTo(width * 0.75, height * 0.9, width, height * 0.2);
            ctx.lineTo(width, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();

            // Flat valley floor
            ctx.fillStyle = '#BCAAA4';
            ctx.beginPath();
            ctx.moveTo(width * 0.35, height * 0.92);
            ctx.quadraticCurveTo(width * 0.5, height * 0.95, width * 0.65, height * 0.92);
            ctx.lineTo(width * 0.65, height);
            ctx.lineTo(width * 0.35, height);
            ctx.closePath();
            ctx.fill();

            // River
            ctx.fillStyle = '#2196F3';
            ctx.fillRect(width * 0.47, height * 0.93, width * 0.06, height * 0.07);

            // Hanging valleys (tributaries)
            ctx.fillStyle = '#A1887F';
            ctx.beginPath();
            ctx.moveTo(width * 0.15, height * 0.5);
            ctx.quadraticCurveTo(width * 0.2, height * 0.6, width * 0.25, height * 0.7);
            ctx.lineTo(width * 0.28, height * 0.7);
            ctx.quadraticCurveTo(width * 0.23, height * 0.6, width * 0.18, height * 0.5);
            ctx.closePath();
            ctx.fill();

            // Waterfall from hanging valley
            ctx.strokeStyle = '#81D4FA';
            ctx.lineWidth = 2;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(width * 0.265, height * 0.7);
            ctx.lineTo(width * 0.265, height * 0.88);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.restore();
    }

    // Continue with more geography shapes...
    static drawRiverMeander(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        // River channel
        ctx.fillStyle = '#2196F3';
        ctx.beginPath();
        ctx.moveTo(width * 0.1, 0);
        
        // Meander curves
        ctx.bezierCurveTo(
            width * 0.2, height * 0.15,
            width * 0.3, height * 0.25,
            width * 0.4, height * 0.35
        );
        ctx.bezierCurveTo(
            width * 0.5, height * 0.45,
            width * 0.6, height * 0.5,
            width * 0.7, height * 0.55
        );
        ctx.bezierCurveTo(
            width * 0.8, height * 0.6,
            width * 0.9, height * 0.7,
            width * 0.9, height
        );
        
        // Width of river
        ctx.lineTo(width * 0.95, height);
        ctx.bezierCurveTo(
            width * 0.95, height * 0.7,
            width * 0.85, height * 0.6,
            width * 0.75, height * 0.55
        );
        ctx.bezierCurveTo(
            width * 0.65, height * 0.5,
            width * 0.55, height * 0.45,
            width * 0.45, height * 0.35
        );
        ctx.bezierCurveTo(
            width * 0.35, height * 0.25,
            width * 0.25, height * 0.15,
            width * 0.15, 0
        );
        ctx.closePath();
        ctx.fill();

        // Erosion bank (outer bend - faster flow)
        ctx.fillStyle = '#F44336';
        ctx.globalAlpha = 0.3;
        
        // Left outer bend
        ctx.beginPath();
        ctx.moveTo(width * 0.15, height * 0.05);
        ctx.bezierCurveTo(
            width * 0.25, height * 0.2,
            width * 0.32, height * 0.28,
            width * 0.38, height * 0.35
        );
        ctx.lineTo(width * 0.3, height * 0.38);
        ctx.bezierCurveTo(
            width * 0.24, height * 0.3,
            width * 0.18, height * 0.2,
            width * 0.1, height * 0.05
        );
        ctx.closePath();
        ctx.fill();

        // Right outer bend
        ctx.beginPath();
        ctx.moveTo(width * 0.72, height * 0.52);
        ctx.bezierCurveTo(
            width * 0.82, height * 0.58,
            width * 0.92, height * 0.68,
            width * 0.95, height * 0.95
        );
        ctx.lineTo(width * 0.9, height * 0.95);
        ctx.bezierCurveTo(
            width * 0.88, height * 0.7,
            width * 0.78, height * 0.6,
            width * 0.68, height * 0.54
        );
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha = 1;

        // Deposition bank (inner bend - slower flow)
        ctx.fillStyle = '#FDD835';
        ctx.globalAlpha = 0.4;
        
        // Right inner bend (point bar)
        ctx.beginPath();
        ctx.moveTo(width * 0.42, height * 0.32);
        ctx.bezierCurveTo(
            width * 0.5, height * 0.4,
            width * 0.58, height * 0.45,
            width * 0.65, height * 0.5
        );
        ctx.lineTo(width * 0.7, height * 0.47);
        ctx.bezierCurveTo(
            width * 0.62, height * 0.42,
            width * 0.52, height * 0.37,
            width * 0.44, height * 0.29
        );
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha = 1;

        // Flow direction arrows
        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        
        // Faster flow on outer bend
        this.drawArrow(ctx, width * 0.25, height * 0.15, width * 0.3, height * 0.22);
        
        // Slower flow on inner bend
        this.drawArrow(ctx, width * 0.55, height * 0.42, width * 0.6, height * 0.47);

        ctx.restore();
    }

    // Due to length, I'll provide a few more key agriculture diagrams

    static drawSeedGermination(ctx, x, y, width, height, showStages) {
        ctx.save();
        ctx.translate(x, y);

        if(showStages) {
            const stageWidth = width / 4;

            // Stage 1: Imbibition
            ctx.fillStyle = '#8D6E63';
            ctx.beginPath();
            ctx.ellipse(stageWidth * 0.5, height * 0.7, 15, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Water absorption', stageWidth * 0.5, height * 0.9);

            // Stage 2: Radicle emergence
            ctx.fillStyle = '#8D6E63';
            ctx.beginPath();
            ctx.ellipse(stageWidth * 1.5, height * 0.65, 16, 13, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#AED581';
            ctx.fillRect(stageWidth * 1.5 - 2, height * 0.78, 4, 15);
            ctx.fillText('Radicle emerges', stageWidth * 1.5, height * 0.9);

            // Stage 3: Root and shoot
            ctx.fillStyle = '#8D6E63';
            ctx.beginPath();
            ctx.ellipse(stageWidth * 2.5, height * 0.6, 14, 11, 0, 0, Math.PI * 2);
            ctx.fill();
            // Root
            ctx.fillStyle = '#9CCC65';
            ctx.fillRect(stageWidth * 2.5 - 2, height * 0.71, 4, 20);
            // Shoot
            ctx.fillRect(stageWidth * 2.5 - 2, height * 0.4, 4, 20);
            ctx.fillText('Root & shoot', stageWidth * 2.5, height * 0.9);

            // Stage 4: Seedling
            // Root
            ctx.fillStyle = '#7CB342';
            ctx.fillRect(stageWidth * 3.5 - 2, height * 0.65, 4, 30);
            // Stem
            ctx.fillStyle = '#AED581';
            ctx.fillRect(stageWidth * 3.5 - 2, height * 0.35, 4, 30);
            // First leaves
            ctx.fillStyle = '#4CAF50';
            ctx.beginPath();
            ctx.ellipse(stageWidth * 3.5 - 15, height * 0.4, 12, 8, -Math.PI / 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(stageWidth * 3.5 + 15, height * 0.4, 12, 8, Math.PI / 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.fillText('Seedling', stageWidth * 3.5, height * 0.9);

            // Soil line
            ctx.strokeStyle = '#5D4037';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, height * 0.75);
            ctx.lineTo(width, height * 0.75);
            ctx.stroke();
        }

        ctx.restore();
    }

    static drawGreenhouseCrossSection(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        // Foundation
        ctx.fillStyle = '#757575';
        ctx.fillRect(width * 0.05, height * 0.85, width * 0.9, height * 0.15);

        // Floor
        ctx.fillStyle = '#A1887F';
        ctx.fillRect(width * 0.1, height * 0.8, width * 0.8, height * 0.05);

        // Frame structure
        ctx.strokeStyle = '#616161';
        ctx.lineWidth = 4;

        // Walls
        ctx.beginPath();
        ctx.moveTo(width * 0.1, height * 0.8);
        ctx.lineTo(width * 0.1, height * 0.3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width * 0.9, height * 0.8);
        ctx.lineTo(width * 0.9, height * 0.3);
        ctx.stroke();

        // Roof structure (arched)
        ctx.beginPath();
        ctx.moveTo(width * 0.1, height * 0.3);
        ctx.quadraticCurveTo(width * 0.5, height * 0.05, width * 0.9, height * 0.3);
        ctx.stroke();

        // Glass/plastic covering
        ctx.fillStyle = 'rgba(173, 216, 230, 0.3)';
        ctx.strokeStyle = '#90CAF9';
        ctx.lineWidth = 2;

        // Side panels
        ctx.fillRect(width * 0.1, height * 0.3, width * 0.02, height * 0.5);
        ctx.strokeRect(width * 0.1, height * 0.3, width * 0.02, height * 0.5);
        ctx.fillRect(width * 0.88, height * 0.3, width * 0.02, height * 0.5);
        ctx.strokeRect(width * 0.88, height * 0.3, width * 0.02, height * 0.5);

        // Roof panels
        ctx.beginPath();
        ctx.moveTo(width * 0.1, height * 0.3);
        ctx.quadraticCurveTo(width * 0.5, height * 0.05, width * 0.9, height * 0.3);
        ctx.lineTo(width * 0.88, height * 0.32);
        ctx.quadraticCurveTo(width * 0.5, height * 0.08, width * 0.12, height * 0.32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ventilation windows
        ctx.fillStyle = '#E3F2FD';
        ctx.fillRect(width * 0.15, height * 0.15, width * 0.15, height * 0.08);
        ctx.strokeRect(width * 0.15, height * 0.15, width * 0.15, height * 0.08);
        ctx.fillRect(width * 0.7, height * 0.15, width * 0.15, height * 0.08);
        ctx.strokeRect(width * 0.7, height * 0.15, width * 0.15, height * 0.08);

        // Plants inside
        const plantPositions = [0.2, 0.35, 0.5, 0.65, 0.8];
        plantPositions.forEach(pos => {
            // Pot
            ctx.fillStyle = '#D84315';
            ctx.fillRect(width * (pos - 0.03), height * 0.75, width * 0.06, height * 0.05);
            
            // Plant
            ctx.fillStyle = '#4CAF50';
            ctx.strokeStyle = '#2E7D32';
            ctx.lineWidth = 2;
            
            // Stem
            ctx.beginPath();
            ctx.moveTo(width * pos, height * 0.75);
            ctx.lineTo(width * pos, height * 0.55);
            ctx.stroke();
            
            // Leaves
            for(let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.ellipse(
                    width * (pos - 0.04), 
                    height * (0.6 + i * 0.05),
                    width * 0.03,
                    height * 0.03,
                    -Math.PI / 4,
                    0, Math.PI * 2
                );
                ctx.fill();
                
                ctx.beginPath();
                ctx.ellipse(
                    width * (pos + 0.04), 
                    height * (0.62 + i * 0.05),
                    width * 0.03,height * 0.03,
                    Math.PI / 4,
                    0, Math.PI * 2
                );
                ctx.fill();
            }
        });

        // Irrigation system
        ctx.strokeStyle = '#0277BD';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.15, height * 0.35);
        ctx.lineTo(width * 0.85, height * 0.35);
        ctx.stroke();

        // Drip emitters
        ctx.fillStyle = '#01579B';
        plantPositions.forEach(pos => {
            ctx.beginPath();
            ctx.arc(width * pos, height * 0.35, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Water drops
            ctx.fillStyle = 'rgba(3, 169, 244, 0.6)';
            for(let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(width * pos, height * (0.4 + i * 0.1), 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Heating pipes
        ctx.strokeStyle = '#FF6F00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.1, height * 0.82);
        ctx.lineTo(width * 0.9, height * 0.82);
        ctx.stroke();

        // Temperature/humidity sensor
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(width * 0.85, height * 0.4, width * 0.04, height * 0.06);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(width * 0.85, height * 0.4, width * 0.04, height * 0.06);

        ctx.restore();
    }

    static drawTerracefarm(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        // Number of terraces
        const terraces = 5;
        const terraceHeight = height / (terraces + 1);

        for(let i = 0; i < terraces; i++) {
            const terraceY = height * 0.15 + i * terraceHeight;
            const terraceWidth = width * (0.85 - i * 0.1);
            const terraceX = width * 0.1 + i * width * 0.05;

            // Retaining wall
            ctx.fillStyle = '#757575';
            ctx.fillRect(terraceX, terraceY + terraceHeight * 0.7, terraceWidth, terraceHeight * 0.3);
            
            // Wall texture (stones)
            ctx.strokeStyle = '#424242';
            ctx.lineWidth = 1;
            for(let row = 0; row < 3; row++) {
                for(let col = 0; col < 8; col++) {
                    const stoneX = terraceX + col * (terraceWidth / 8);
                    const stoneY = terraceY + terraceHeight * 0.7 + row * (terraceHeight * 0.1);
                    ctx.strokeRect(stoneX, stoneY, terraceWidth / 8, terraceHeight * 0.1);
                }
            }

            // Cultivated soil
            ctx.fillStyle = '#6D4C41';
            ctx.fillRect(terraceX, terraceY, terraceWidth, terraceHeight * 0.7);

            // Crops
            ctx.fillStyle = '#4CAF50';
            const cropCount = Math.floor(terraceWidth / 30);
            for(let j = 0; j < cropCount; j++) {
                const cropX = terraceX + 15 + j * 30;
                const cropY = terraceY + terraceHeight * 0.4;
                
                // Plant stem
                ctx.fillRect(cropX - 1, cropY, 2, terraceHeight * 0.3);
                
                // Leaves
                ctx.beginPath();
                ctx.arc(cropX, cropY - 5, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Water channel
            ctx.fillStyle = '#2196F3';
            ctx.fillRect(
                terraceX + terraceWidth * 0.05,
                terraceY + terraceHeight * 0.6,
                terraceWidth * 0.9,
                terraceHeight * 0.05
            );
        }

        // Slope behind terraces
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.1);
        ctx.lineTo(width, height * 0.9);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Rain runoff arrows
        ctx.strokeStyle = '#1976D2';
        ctx.fillStyle = '#1976D2';
        ctx.lineWidth = 2;
        
        for(let i = 0; i < terraces; i++) {
            const arrowX = width * 0.08;
            const arrowY = height * (0.25 + i * (terraceHeight / height));
            this.drawArrow(ctx, arrowX, arrowY, arrowX, arrowY + terraceHeight * 0.4);
        }

        ctx.restore();
    }

    static drawSoilProfile(ctx, x, y, width, height, showHorizons) {
        ctx.save();
        ctx.translate(x, y);

        if(showHorizons) {
            // O Horizon (Organic layer)
            ctx.fillStyle = '#3E2723';
            ctx.fillRect(0, 0, width, height * 0.08);
            
            // Organic matter particles
            ctx.fillStyle = '#5D4037';
            for(let i = 0; i < 30; i++) {
                ctx.fillRect(
                    Math.random() * width,
                    Math.random() * height * 0.08,
                    3, 2
                );
            }

            // A Horizon (Topsoil)
            ctx.fillStyle = '#4E342E';
            ctx.fillRect(0, height * 0.08, width, height * 0.17);
            
            // Humus and fine particles
            ctx.fillStyle = '#3E2723';
            for(let i = 0; i < 40; i++) {
                ctx.beginPath();
                ctx.arc(
                    Math.random() * width,
                    height * 0.08 + Math.random() * height * 0.17,
                    1 + Math.random() * 2,
                    0, Math.PI * 2
                );
                ctx.fill();
            }
            
            // Plant roots
            ctx.strokeStyle = '#FFEB3B';
            ctx.lineWidth = 1.5;
            for(let i = 0; i < 8; i++) {
                const rootX = (i + 1) * (width / 9);
                ctx.beginPath();
                ctx.moveTo(rootX, 0);
                ctx.quadraticCurveTo(
                    rootX + (Math.random() - 0.5) * 20,
                    height * 0.15,
                    rootX + (Math.random() - 0.5) * 30,
                    height * 0.25
                );
                ctx.stroke();
            }

            // E Horizon (Eluviation/Leaching layer) - lighter colored
            ctx.fillStyle = '#8D6E63';
            ctx.fillRect(0, height * 0.25, width, height * 0.1);

            // B Horizon (Subsoil)
            ctx.fillStyle = '#A1887F';
            ctx.fillRect(0, height * 0.35, width, height * 0.3);
            
            // Accumulated clay and minerals
            ctx.fillStyle = '#D84315';
            for(let i = 0; i < 25; i++) {
                ctx.fillRect(
                    Math.random() * width,
                    height * 0.35 + Math.random() * height * 0.3,
                    4, 3
                );
            }
            
            // Iron oxide deposits
            ctx.fillStyle = '#BF360C';
            for(let i = 0; i < 15; i++) {
                ctx.beginPath();
                ctx.arc(
                    Math.random() * width,
                    height * 0.35 + Math.random() * height * 0.3,
                    2,
                    0, Math.PI * 2
                );
                ctx.fill();
            }

            // C Horizon (Parent material)
            ctx.fillStyle = '#BCAAA4';
            ctx.fillRect(0, height * 0.65, width, height * 0.25);
            
            // Weathered rock fragments
            ctx.fillStyle = '#9E9E9E';
            for(let i = 0; i < 20; i++) {
                const size = 5 + Math.random() * 10;
                ctx.fillRect(
                    Math.random() * (width - size),
                    height * 0.65 + Math.random() * height * 0.25,
                    size, size * 0.7
                );
            }

            // R Horizon (Bedrock)
            ctx.fillStyle = '#757575';
            ctx.fillRect(0, height * 0.9, width, height * 0.1);
            
            // Rock layers
            ctx.strokeStyle = '#424242';
            ctx.lineWidth = 2;
            for(let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(0, height * (0.92 + i * 0.03));
                ctx.lineTo(width, height * (0.92 + i * 0.03));
                ctx.stroke();
            }

            // Labels
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'right';
            
            ctx.fillText('O - Organic', width - 5, height * 0.04);
            ctx.fillText('A - Topsoil', width - 5, height * 0.16);
            ctx.fillText('E - Leaching', width - 5, height * 0.30);
            ctx.fillText('B - Subsoil', width - 5, height * 0.50);
            ctx.fillText('C - Parent Material', width - 5, height * 0.77);
            ctx.fillText('R - Bedrock', width - 5, height * 0.95);
        }

        // Outline
        ctx.strokeStyle = '#212121';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, width, height);

        ctx.restore();
    }

    static drawFishPond(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        // Pond banks/dykes
        ctx.fillStyle = '#6D4C41';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.3);
        ctx.lineTo(width * 0.15, height * 0.5);
        ctx.lineTo(width * 0.15, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(width, height * 0.3);
        ctx.lineTo(width * 0.85, height * 0.5);
        ctx.lineTo(width * 0.85, height);
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // Water layers
        // Surface layer (warm, oxygen-rich)
        ctx.fillStyle = '#4FC3F7';
        ctx.fillRect(width * 0.15, height * 0.5, width * 0.7, height * 0.15);

        // Middle layer
        ctx.fillStyle = '#29B6F6';
        ctx.fillRect(width * 0.15, height * 0.65, width * 0.7, height * 0.15);

        // Bottom layer (cooler, less oxygen)
        ctx.fillStyle = '#0288D1';
        ctx.fillRect(width * 0.15, height * 0.8, width * 0.7, height * 0.1);

        // Pond bottom (mud/silt)
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(width * 0.15, height * 0.9, width * 0.7, height * 0.1);

        // Inlet pipe
        ctx.fillStyle = '#757575';
        ctx.fillRect(0, height * 0.45, width * 0.15, height * 0.05);
        
        // Water flow from inlet
        ctx.fillStyle = '#81D4FA';
        ctx.beginPath();
        ctx.moveTo(width * 0.15, height * 0.47);
        ctx.lineTo(width * 0.25, height * 0.52);
        ctx.lineTo(width * 0.25, height * 0.48);
        ctx.closePath();
        ctx.fill();

        // Outlet pipe (drain)
        ctx.fillStyle = '#757575';
        ctx.fillRect(width * 0.85, height * 0.85, width * 0.15, height * 0.05);

        // Monk/outlet structure
        ctx.fillStyle = '#616161';
        ctx.fillRect(width * 0.82, height * 0.75, width * 0.06, height * 0.15);

        // Fish at different depths
        ctx.fillStyle = '#FF6F00';
        ctx.strokeStyle = '#E65100';
        ctx.lineWidth = 1;

        // Surface fish
        for(let i = 0; i < 3; i++) {
            const fx = width * (0.25 + Math.random() * 0.5);
            const fy = height * (0.52 + Math.random() * 0.1);
            this.drawSimpleFish(ctx, fx, fy, 15, true);
        }

        // Mid-water fish
        ctx.fillStyle = '#F57C00';
        for(let i = 0; i < 4; i++) {
            const fx = width * (0.25 + Math.random() * 0.5);
            const fy = height * (0.67 + Math.random() * 0.1);
            this.drawSimpleFish(ctx, fx, fy, 12, false);
        }

        // Bottom feeders
        ctx.fillStyle = '#EF6C00';
        for(let i = 0; i < 3; i++) {
            const fx = width * (0.25 + Math.random() * 0.5);
            const fy = height * (0.83 + Math.random() * 0.05);
            this.drawSimpleFish(ctx, fx, fy, 10, false);
        }

        // Aquatic plants
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        for(let i = 0; i < 5; i++) {
            const plantX = width * (0.2 + i * 0.12);
            ctx.beginPath();
            ctx.moveTo(plantX, height * 0.9);
            ctx.quadraticCurveTo(
                plantX + 5, height * 0.7,
                plantX + 10, height * 0.55
            );
            ctx.stroke();
            
            // Leaves
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath();
            ctx.ellipse(plantX + 10, height * 0.55, 8, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Floating plants
        ctx.fillStyle = '#8BC34A';
        for(let i = 0; i < 4; i++) {
            const leafX = width * (0.3 + i * 0.15);
            ctx.beginPath();
            ctx.ellipse(leafX, height * 0.52, 12, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Aerator (bubbles)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        const aeratorX = width * 0.7;
        for(let i = 0; i < 8; i++) {
            const bubbleY = height * (0.85 - i * 0.04);
            const bubbleX = aeratorX + (Math.random() - 0.5) * 15;
            ctx.beginPath();
            ctx.arc(bubbleX, bubbleY, 2 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Water surface
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(width * 0.15, height * 0.5);
        for(let i = 0; i < 10; i++) {
            ctx.quadraticCurveTo(
                width * (0.15 + i * 0.07 + 0.035), height * (0.5 - 0.005),
                width * (0.15 + (i + 1) * 0.07), height * 0.5
            );
        }
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.restore();
    }

    static drawSimpleFish(ctx, x, y, size, facingRight) {
        ctx.save();
        
        if(!facingRight) {
            ctx.scale(-1, 1);
            x = -x;
        }

        // Body
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Tail
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x - size * 1.4, y - size * 0.4);
        ctx.lineTo(x - size * 1.4, y + size * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x + size * 0.5, y - size * 0.15, size * 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    static drawCompostPit(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x, y);

        // Pit walls
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(0, height * 0.2, width * 0.1, height * 0.8);
        ctx.fillRect(width * 0.9, height * 0.2, width * 0.1, height * 0.8);

        // Base
        ctx.fillRect(0, height * 0.9, width, height * 0.1);

        // Layers of organic material
        const layers = [
            { y: 0.85, color: '#8D6E63', label: 'Fresh material' },
            { y: 0.75, color: '#6D4C41', label: 'Decomposing' },
            { y: 0.65, color: '#5D4037', label: 'Partially decomposed' },
            { y: 0.55, color: '#4E342E', label: 'Well decomposed' },
            { y: 0.45, color: '#3E2723', label: 'Mature compost' }
        ];

        layers.forEach((layer, index) => {
            ctx.fillStyle = layer.color;
            ctx.fillRect(
                width * 0.1,
                height * layer.y,
                width * 0.8,
                height * 0.1
            );

            // Add texture
            ctx.fillStyle = index < 2 ? '#A1887F' : '#5D4037';
            for(let i = 0; i < 20; i++) {
                ctx.fillRect(
                    width * (0.1 + Math.random() * 0.8),
                    height * (layer.y + Math.random() * 0.1),
                    3, 2
                );
            }
        });

        // Green waste (visible in top layers)
        ctx.fillStyle = '#4CAF50';
        for(let i = 0; i < 10; i++) {
            ctx.fillRect(
                width * (0.15 + Math.random() * 0.7),
                height * (0.46 + Math.random() * 0.15),
                4, 6
            );
        }

        // Kitchen waste
        ctx.fillStyle = '#FF9800';
        for(let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.arc(
                width * (0.15 + Math.random() * 0.7),
                height * (0.5 + Math.random() * 0.12),
                3,
                0, Math.PI * 2
            );
            ctx.fill();
        }

        // Air pockets/ventilation
        ctx.fillStyle = '#E3F2FD';
        for(let i = 0; i < 15; i++) {
            ctx.beginPath();
            ctx.arc(
                width * (0.15 + Math.random() * 0.7),
                height * (0.45 + Math.random() * 0.4),
                2 + Math.random() * 3,
                0, Math.PI * 2
            );
            ctx.fill();
        }

        // Ventilation pipes
        ctx.fillStyle = '#9E9E9E';
        const pipeCount = 3;
        for(let i = 0; i < pipeCount; i++) {
            const pipeX = width * (0.25 + i * 0.25);
            ctx.fillRect(pipeX, height * 0.45, width * 0.03, height * 0.45);
            
            // Holes in pipes
            ctx.fillStyle = '#FFFFFF';
            for(let j = 0; j < 6; j++) {
                ctx.beginPath();
                ctx.arc(
                    pipeX + width * 0.015,
                    height * (0.5 + j * 0.06),
                    2,
                    0, Math.PI * 2
                );
                ctx.fill();
            }
            ctx.fillStyle = '#9E9E9E';
        }

        // Worms (decomposers)
        ctx.strokeStyle = '#E91E63';
        ctx.lineWidth = 2;
        for(let i = 0; i < 5; i++) {
            const wx = width * (0.2 + Math.random() * 0.6);
            const wy = height * (0.55 + Math.random() * 0.25);
            ctx.beginPath();
            ctx.moveTo(wx, wy);
            ctx.quadraticCurveTo(
                wx + 8, wy + 5,
                wx + 15, wy
            );
            ctx.stroke();
        }

        // Temperature indicator
        ctx.fillStyle = '#FF5722';
        ctx.fillRect(width * 0.85, height * 0.3, width * 0.03, height * 0.15);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('HEAT', width * 0.865, height * 0.27);

        // Moisture
        ctx.fillStyle = '#2196F3';
        for(let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.arc(
                width * (0.2 + Math.random() * 0.6),
                height * (0.5 + Math.random() * 0.3),
                1.5,
                0, Math.PI * 2
            );
            ctx.fill();
        }

        // Cover (optional)
        ctx.fillStyle = '#795548';
        ctx.fillRect(width * 0.05, height * 0.4, width * 0.9, height * 0.03);

        ctx.restore();
    }
}

// ============================================================================
// CROSS-SECTION DIAGRAM RENDERER
// ============================================================================

class CrossSectionDiagramRenderer {
    constructor(canvas = null) {
        this.canvas = canvas;
        this.ctx = canvas ? canvas.getContext('2d') : null;
        this.defaultFont = 'Arial, sans-serif';
        this.defaultFontSize = 12;
    }

    // Rendering methods for each diagram type
    renderDiagram(key, x, y, width, height, options = {}) {
        if(!this.ctx) {
            throw new Error('Canvas context not initialized');
        }

        const {
            showLabels = true,
            title = '',
            backgroundColor = '#ffffff'
        } = options;

        // Clear and set background
        if(backgroundColor) {
            this.ctx.fillStyle = backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Render title
        if(title) {
            this.ctx.save();
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillStyle = '#2C3E50';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(title, this.canvas.width / 2, 40);
            this.ctx.restore();
        }

        // Route to appropriate rendering method
        switch(key) {
            // Biology - Plant Structures
            case 'dicotLeafCrossSection':
                CrossSectionShapes.drawDicotLeaf(this.ctx, x, y, width, height, options.showCellDetail);
                if(showLabels) this.addLeafLabels(x, y, width, height, 'dicot');
                break;
            case 'monocotLeafCrossSection':
                CrossSectionShapes.drawMonocotLeaf(this.ctx, x, y, width, height);
                if(showLabels) this.addLeafLabels(x, y, width, height, 'monocot');
                break;
            case 'rootTipCrossSection':
                CrossSectionShapes.drawRootTip(this.ctx, x, y, width, height, options.showZones);
                break;
            case 'dicotStemCrossSection':
                CrossSectionShapes.drawDicotStem(this.ctx, x, y, width, height);
                if(showLabels) this.addStemLabels(x, y, width, height, 'dicot');
                break;
            case 'monocotStemCrossSection':
                CrossSectionShapes.drawMonocotStem(this.ctx, x, y, width, height);
                if(showLabels) this.addStemLabels(x, y, width, height, 'monocot');
                break;
            case 'flowerOvaryCrossSection':
                CrossSectionShapes.drawFlowerOvary(this.ctx, x, y, width, height);
                break;
            case 'seedCrossSection':
                CrossSectionShapes.drawSeed(this.ctx, x, y, width, height, options.seedType || 'bean');
                break;
            case 'fruitCrossSection':
                CrossSectionShapes.drawFruit(this.ctx, x, y, width, height, options.fruitType || 'apple');
                break;

            // Biology - Animal Anatomy
            case 'brainCrossSection':
                CrossSectionShapes.drawBrain(this.ctx, x, y, width, height, options.plane || 'sagittal');
                break;
            case 'smallIntestineCrossSection':
                CrossSectionShapes.drawSmallIntestine(this.ctx, x, y, width, height, options.showVilli);
                break;
            case 'fishGillsCrossSection':
                CrossSectionShapes.drawFishGills(this.ctx, x, y, width, height);
                break;
            case 'insectThoraxCrossSection':
                CrossSectionShapes.drawInsectThorax(this.ctx, x, y, width, height);
                break;
            case 'flowerBudCrossSection':
                CrossSectionShapes.drawFlowerBud(this.ctx, x, y, width, height);
                break;

            // Geography
            case 'earthCrossSection':
                CrossSectionShapes.drawEarth(this.ctx, x, y, width, height, options.showDepths);
                break;
            case 'volcanoCrossSection':
                CrossSectionShapes.drawVolcano(this.ctx, x, y, width, height, options.showLavaFlow);
                break;
            case 'foldMountainCrossSection':
                CrossSectionShapes.drawFoldMountain(this.ctx, x, y, width, height);
                break;
            case 'faultLineCrossSection':
                CrossSectionShapes.drawFaultLine(this.ctx, x, y, width, height, options.faultType || 'normal');
                break;
            case 'riverValleyCrossSection':
                CrossSectionShapes.drawRiverValley(this.ctx, x, y, width, height, options.valleyType || 'v-shaped');
                break;
            case 'riverMeanderCrossSection':
                CrossSectionShapes.drawRiverMeander(this.ctx, x, y, width, height);
                break;

            // Agriculture
            case 'seedGerminationCrossSection':
                CrossSectionShapes.drawSeedGermination(this.ctx, x, y, width, height, options.showStages);
                break;
            case 'greenhouseCrossSection':
                CrossSectionShapes.drawGreenhouseCrossSection(this.ctx, x, y, width, height);
                break;
            case 'terraceFarmCrossSection':
                CrossSectionShapes.drawTerraceFarm(this.ctx, x, y, width, height);
                break;
            case 'soilProfileCrossSection':
                CrossSectionShapes.drawSoilProfile(this.ctx, x, y, width, height, options.showHorizons);
                break;
            case 'fishPondCrossSection':
                CrossSectionShapes.drawFishPond(this.ctx, x, y, width, height);
                break;
            case 'compostPitCrossSection':
                CrossSectionShapes.drawCompostPit(this.ctx, x, y, width, height);
                break;

            default:
                throw new Error(`Rendering for cross-section diagram '${key}' not implemented`);
        }
    }

    // Helper methods for labels
    addLeafLabels(x, y, width, height, type) {
        this.ctx.save();
        this.ctx.font = 'bold 11px Arial';
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'left';

        if(type === 'dicot') {
            this.ctx.fillText('Cuticle', x + width + 10, y + height * 0.02);
            this.ctx.fillText('Upper Epidermis', x + width + 10, y + height * 0.06);
            this.ctx.fillText('Palisade Mesophyll', x + width + 10, y + height * 0.2);
            this.ctx.fillText('Spongy Mesophyll', x + width + 10, y + height * 0.5);
            this.ctx.fillText('Vascular Bundle', x + width + 10, y + height * 0.4);
            this.ctx.fillText('Lower Epidermis', x + width + 10, y + height * 0.94);
            this.ctx.fillText('Stomata', x + width + 10, y + height * 0.97);
        } else {
            this.ctx.fillText('Bulliform Cells', x + width + 10, y + height * 0.06);
            this.ctx.fillText('Mesophyll', x + width + 10, y + height * 0.5);
            this.ctx.fillText('Vascular Bundle', x + width + 10, y + height * 0.5);
            this.ctx.fillText('Bundle Sheath', x + width + 10, y + height * 0.55);
        }

        this.ctx.restore();
    }

    addStemLabels(x, y, width, height, type) {
        this.ctx.save();
        this.ctx.font = 'bold 11px Arial';
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'center';

        const centerX = x + width / 2;
        const centerY = y + height / 2;

        if(type === 'dicot') {
            this.ctx.fillText('Epidermis', centerX, y + height * 0.98);
            this.ctx.fillText('Cortex', centerX - width * 0.35, centerY);
            this.ctx.fillText('Vascular Bundles', centerX + width * 0.35, centerY - height * 0.1);
            this.ctx.fillText('(arranged in ring)', centerX + width * 0.35, centerY - height * 0.05);
            this.ctx.fillText('Pith', centerX, centerY);
            this.ctx.fillText('Xylem', centerX + width * 0.28, centerY - height * 0.18);
            this.ctx.fillText('Phloem', centerX + width * 0.22, centerY - height * 0.25);
        } else {
            this.ctx.fillText('Epidermis', centerX, y + height * 0.98);
            this.ctx.fillText('Ground Tissue', centerX - width * 0.3, centerY);
            this.ctx.fillText('Scattered Vascular Bundles', centerX, y - 10);
        }

        this.ctx.restore();
    }

    clear() {
        if(this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}


// ============================================================================
// STEREOCHEMISTRY DIAGRAMS REGISTRY - Molecular Structure Configuration
// ============================================================================

class StereochemistryDiagramsRegistry {
    static diagrams = {
        // ===== SIMPLE MOLECULES =====
        'methane': {
            name: 'Methane (CH₄)',
            formula: 'CH4',
            category: 'Simple Molecules',
            description: 'Tetrahedral methane molecule with 109.5° bond angles',
            geometry: 'tetrahedral',
            bondAngles: [109.5],
            centralAtom: 'C',
            atoms: [
                { element: 'C', position: [0, 0, 0] },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 }
            ],
            defaultOptions: {
                title: 'Methane (CH₄)',
                showAngles: true,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 20,
                rotationY: 30,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'water': {
            name: 'Water (H₂O)',
            formula: 'H2O',
            category: 'Simple Molecules',
            description: 'Bent water molecule with 104.5° bond angle',
            geometry: 'bent',
            bondAngles: [104.5],
            centralAtom: 'O',
            atoms: [
                { element: 'O', position: [0, 0, 0] },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 }
            ],
            lonePairs: 2,
            defaultOptions: {
                title: 'Water (H₂O)',
                showAngles: true,
                showLabels: true,
                showLonePairs: true,
                show3D: true,
                show2D: true,
                rotationX: 15,
                rotationY: 20,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'ammonia': {
            name: 'Ammonia (NH₃)',
            formula: 'NH3',
            category: 'Simple Molecules',
            description: 'Trigonal pyramidal ammonia with 107° bond angles',
            geometry: 'trigonal_pyramidal',
            bondAngles: [107],
            centralAtom: 'N',
            atoms: [
                { element: 'N', position: [0, 0, 0] },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 }
            ],
            lonePairs: 1,
            defaultOptions: {
                title: 'Ammonia (NH₃)',
                showAngles: true,
                showLabels: true,
                showLonePairs: true,
                show3D: true,
                show2D: true,
                rotationX: 20,
                rotationY: 25,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'carbonDioxide': {
            name: 'Carbon Dioxide (CO₂)',
            formula: 'CO2',
            category: 'Simple Molecules',
            description: 'Linear carbon dioxide with 180° bond angle',
            geometry: 'linear',
            bondAngles: [180],
            centralAtom: 'C',
            atoms: [
                { element: 'O', position: [-1, 0, 0] },
                { element: 'C', position: [0, 0, 0] },
                { element: 'O', position: [1, 0, 0] }
            ],
            bondTypes: ['double', 'double'],
            defaultOptions: {
                title: 'Carbon Dioxide (CO₂)',
                showAngles: true,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 0,
                rotationY: 20,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== ORGANIC MOLECULES =====
        'ethane': {
            name: 'Ethane (C₂H₆)',
            formula: 'C2H6',
            category: 'Organic Molecules',
            description: 'Ethane molecule with C-C single bond',
            geometry: 'tetrahedral',
            bondAngles: [109.5],
            atoms: [
                { element: 'C', position: [-0.5, 0, 0] },
                { element: 'C', position: [0.5, 0, 0] },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 1 },
                { element: 'H', bondedTo: 1 },
                { element: 'H', bondedTo: 1 }
            ],
            defaultOptions: {
                title: 'Ethane (C₂H₆)',
                showAngles: true,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 20,
                rotationY: 30,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'ethene': {
            name: 'Ethene (C₂H₄)',
            formula: 'C2H4',
            category: 'Organic Molecules',
            description: 'Ethene with C=C double bond, planar geometry',
            geometry: 'trigonal_planar',
            bondAngles: [120],
            atoms: [
                { element: 'C', position: [-0.5, 0, 0] },
                { element: 'C', position: [0.5, 0, 0] },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 0 },
                { element: 'H', bondedTo: 1 },
                { element: 'H', bondedTo: 1 }
            ],
            bondTypes: ['double'],
            defaultOptions: {
                title: 'Ethene (C₂H₄)',
                showAngles: true,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 10,
                rotationY: 20,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'glucose': {
            name: 'Glucose (C₆H₁₂O₆)',
            formula: 'C6H12O6',
            category: 'Carbohydrates',
            description: 'α-D-Glucose in chair conformation',
            geometry: 'chair',
            bondAngles: [109.5],
            isRing: true,
            atoms: [
                { element: 'C', position: [0, 0, 0], label: 'C1' },
                { element: 'C', position: [1, 0.5, 0], label: 'C2' },
                { element: 'C', position: [2, 0, 0], label: 'C3' },
                { element: 'C', position: [2.5, -1, 0], label: 'C4' },
                { element: 'C', position: [1.5, -1.5, 0], label: 'C5' },
                { element: 'O', position: [0.5, -1, 0], label: 'O' }
            ],
            defaultOptions: {
                title: 'α-D-Glucose (C₆H₁₂O₆)',
                showAngles: false,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 30,
                rotationY: 45,
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== INORGANIC MOLECULES =====
        'sulfurHexafluoride': {
            name: 'Sulfur Hexafluoride (SF₆)',
            formula: 'SF6',
            category: 'Inorganic Molecules',
            description: 'Octahedral sulfur hexafluoride with 90° bond angles',
            geometry: 'octahedral',
            bondAngles: [90, 180],
            centralAtom: 'S',
            atoms: [
                { element: 'S', position: [0, 0, 0] },
                { element: 'F', bondedTo: 0 },
                { element: 'F', bondedTo: 0 },
                { element: 'F', bondedTo: 0 },
                { element: 'F', bondedTo: 0 },
                { element: 'F', bondedTo: 0 },
                { element: 'F', bondedTo: 0 }
            ],
            defaultOptions: {
                title: 'Sulfur Hexafluoride (SF₆)',
                showAngles: true,
                showLabels: true,
                show3D: true,
                show2D: true,
                rotationX: 30,
                rotationY: 45,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        }
    };

    static getDiagram(key) {
        return this.diagrams[key];
    }

    static getAllDiagrams() {
        return Object.keys(this.diagrams);
    }

    static getDiagramsByCategory(category) {
        return Object.entries(this.diagrams)
            .filter(([_, diagram]) => diagram.category === category)
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getAllCategories() {
        return [...new Set(Object.values(this.diagrams).map(d => d.category))];
    }

    static searchDiagrams(query) {
        const lowerQuery = query.toLowerCase();
        return Object.entries(this.diagrams)
            .filter(([key, diagram]) =>
                diagram.name.toLowerCase().includes(lowerQuery) ||
                diagram.formula.toLowerCase().includes(lowerQuery) ||
                diagram.description.toLowerCase().includes(lowerQuery) ||
                key.toLowerCase().includes(lowerQuery)
            )
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static findByFormula(formula) {
        const normalizedFormula = formula.replace(/\s/g, '').toLowerCase();
        return Object.entries(this.diagrams)
            .filter(([_, diagram]) => 
                diagram.formula.toLowerCase() === normalizedFormula
            )
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getDiagramStats() {
        const stats = {};
        this.getAllCategories().forEach(category => {
            const diagrams = this.getDiagramsByCategory(category);
            stats[category] = {
                count: Object.keys(diagrams).length,
                diagrams: Object.keys(diagrams)
            };
        });
        return stats;
    }
}

// ============================================================================
// ATOM PROPERTIES - Colors, sizes, and characteristics
// ============================================================================

class AtomProperties {
    static elements = {
        'H': { 
            name: 'Hydrogen', 
            color: '#FFFFFF', 
            radius: 25, 
            bonds: 1,
            electronegativity: 2.20
        },
        'C': { 
            name: 'Carbon', 
            color: '#909090', 
            radius: 40, 
            bonds: 4,
            electronegativity: 2.55
        },
        'N': { 
            name: 'Nitrogen', 
            color: '#3050F8', 
            radius: 38, 
            bonds: 3,
            electronegativity: 3.04
        },
        'O': { 
            name: 'Oxygen', 
            color: '#FF0D0D', 
            radius: 37, 
            bonds: 2,
            electronegativity: 3.44
        },
        'F': { 
            name: 'Fluorine', 
            color: '#90E050', 
            radius: 35, 
            bonds: 1,
            electronegativity: 3.98
        },
        'S': { 
            name: 'Sulfur', 
            color: '#FFFF30', 
            radius: 42, 
            bonds: 2,
            electronegativity: 2.58
        },
        'P': { 
            name: 'Phosphorus', 
            color: '#FF8000', 
            radius: 42, 
            bonds: 3,
            electronegativity: 2.19
        },
        'Cl': { 
            name: 'Chlorine', 
            color: '#1FF01F', 
            radius: 38, 
            bonds: 1,
            electronegativity: 3.16
        },
        'Br': { 
            name: 'Bromine', 
            color: '#A62929', 
            radius: 40, 
            bonds: 1,
            electronegativity: 2.96
        }
    };

    static getElement(symbol) {
        return this.elements[symbol] || { 
            name: symbol, 
            color: '#FF00FF', 
            radius: 35, 
            bonds: 1,
            electronegativity: 2.0
        };
    }

    static getBondLength(element1, element2) {
        const e1 = this.getElement(element1);
        const e2 = this.getElement(element2);
        return (e1.radius + e2.radius) * 1.2;
    }
}

// ============================================================================
// MOLECULAR GEOMETRY CALCULATOR
// ============================================================================

class MolecularGeometry {
    static calculateTetrahedralPositions(bondLength = 100) {
        const angle = 109.5 * Math.PI / 180;
        return [
            [0, -bondLength, 0],
            [bondLength * Math.sin(angle), bondLength * Math.cos(angle) * 0.33, bondLength * 0.94],
            [bondLength * Math.sin(angle) * Math.cos(2*Math.PI/3), bondLength * Math.cos(angle) * 0.33, bondLength * 0.94 * Math.sin(2*Math.PI/3)],
            [bondLength * Math.sin(angle) * Math.cos(4*Math.PI/3), bondLength * Math.cos(angle) * 0.33, bondLength * 0.94 * Math.sin(4*Math.PI/3)]
        ];
    }

    static calculateTrigonalPlanarPositions(bondLength = 100) {
        const angle = 120 * Math.PI / 180;
        return [
            [0, -bondLength, 0],
            [bondLength * Math.sin(angle), bondLength * Math.cos(angle), 0],
            [bondLength * Math.sin(angle) * Math.cos(2*Math.PI/3), bondLength * Math.cos(angle), 0]
        ];
    }

    static calculateLinearPositions(bondLength = 100) {
        return [
            [-bondLength, 0, 0],
            [bondLength, 0, 0]
        ];
    }

    static calculateBentPositions(bondLength = 100, angle = 104.5) {
        const angleRad = angle * Math.PI / 180;
        const halfAngle = angleRad / 2;
        return [
            [-bondLength * Math.sin(halfAngle), -bondLength * Math.cos(halfAngle), 0],
            [bondLength * Math.sin(halfAngle), -bondLength * Math.cos(halfAngle), 0]
        ];
    }

    static calculateTrigonalPyramidalPositions(bondLength = 100) {
        const angle = 107 * Math.PI / 180;
        return [
            [0, -bondLength, 0],
            [bondLength * Math.sin(angle), bondLength * Math.cos(angle) * 0.4, bondLength * 0.8],
            [bondLength * Math.sin(angle) * Math.cos(2*Math.PI/3), bondLength * Math.cos(angle) * 0.4, bondLength * 0.8 * Math.sin(2*Math.PI/3)],
            [bondLength * Math.sin(angle) * Math.cos(4*Math.PI/3), bondLength * Math.cos(angle) * 0.4, bondLength * 0.8 * Math.sin(4*Math.PI/3)]
        ];
    }

    static calculateOctahedralPositions(bondLength = 100) {
        return [
            [0, bondLength, 0],
            [0, -bondLength, 0],
            [bondLength, 0, 0],
            [-bondLength, 0, 0],
            [0, 0, bondLength],
            [0, 0, -bondLength]
        ];
    }

    static rotatePoint3D(point, rotX, rotY, rotZ) {
        let [x, y, z] = point;

        // Rotate around X axis
        if (rotX) {
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);
            const newY = y * cosX - z * sinX;
            const newZ = y * sinX + z * cosX;
            y = newY;
            z = newZ;
        }

        // Rotate around Y axis
        if (rotY) {
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const newX = x * cosY + z * sinY;
            const newZ = -x * sinY + z * cosY;
            x = newX;
            z = newZ;
        }

        // Rotate around Z axis
        if (rotZ) {
            const cosZ = Math.cos(rotZ);
            const sinZ = Math.sin(rotZ);
            const newX = x * cosZ - y * sinZ;
            const newY = x * sinZ + y * cosZ;
            x = newX;
            y = newY;
        }

        return [x, y, z];
    }

    static projectTo2D(point3D, scale = 1, perspective = 500) {
        const [x, y, z] = point3D;
        const factor = perspective / (perspective + z);
        return [
            x * factor * scale,
            y * factor * scale,
            z
        ];
    }
}

// ============================================================================
// STEREOCHEMISTRY DIAGRAM RENDERER
// ============================================================================

class StereochemistryDiagramRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas ? canvas.getContext('2d') : null;
    }

    renderDiagram(diagramKey, x, y, width, height, options = {}) {
        const diagram = StereochemistryDiagramsRegistry.getDiagram(diagramKey);
        if (!diagram) {
            throw new Error(`Stereochemistry diagram '${diagramKey}' not found`);
        }

        const mergedOptions = { ...diagram.defaultOptions, ...options };
        
        this.ctx.save();
        this.ctx.translate(x, y);

        // Clear background
        this.ctx.fillStyle = mergedOptions.backgroundColor;
        this.ctx.fillRect(0, 0, width, height);

        // Title
        this.drawTitle(mergedOptions.title, width / 2, 20);

        // Draw both 2D and 3D if requested
        if (mergedOptions.show2D && mergedOptions.show3D) {
            // Split view
            this.draw2DMolecule(diagram, width * 0.25, height * 0.5, width * 0.4, mergedOptions);
            this.draw3DMolecule(diagram, width * 0.75, height * 0.5, width * 0.4, mergedOptions);
            
            // Labels
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillStyle = '#2C3E50';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('2D Structure', width * 0.25, 60);
            this.ctx.fillText('3D Model', width * 0.75, 60);
        } else if (mergedOptions.show2D) {
            this.draw2DMolecule(diagram, width / 2, height / 2, width * 0.8, mergedOptions);
        } else if (mergedOptions.show3D) {
            this.draw3DMolecule(diagram, width / 2, height / 2, width * 0.8, mergedOptions);
        }

        // Molecular info
        this.drawMolecularInfo(diagram, 20, height - 100, mergedOptions);

        this.ctx.restore();
    }

    draw2DMolecule(diagram, centerX, centerY, size, options) {
        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        const bondLength = size * 0.15;
        const positions = this.calculate2DPositions(diagram, bondLength);

        // Draw bonds first
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;

        diagram.atoms.forEach((atom, index) => {
            if (atom.bondedTo !== undefined && positions[index] && positions[atom.bondedTo]) {
                const bondType = diagram.bondTypes ? diagram.bondTypes[index - 1] : 'single';
                this.draw2DBond(
                    positions[atom.bondedTo],
                    positions[index],
                    bondType
                );
            }
        });

        // Draw atoms
        diagram.atoms.forEach((atom, index) => {
            if (positions[index]) {
                this.drawAtom2D(
                    atom.element,
                    positions[index][0],
                    positions[index][1],
                    options.showLabels
                );
            }
        });

        // Draw bond angles if requested
        if (options.showAngles && diagram.bondAngles) {
            this.drawBondAngles2D(positions, diagram, bondLength);
        }

        // Draw lone pairs if present
        if (options.showLonePairs && diagram.lonePairs) {
            this.drawLonePairs2D(positions[0], diagram.lonePairs);
        }

        this.ctx.restore();
    }

    draw3DMolecule(diagram, centerX, centerY, size, options) {
        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        const bondLength = size * 0.12;
        const rotX = (options.rotationX || 0) * Math.PI / 180;
        const rotY = (options.rotationY || 0) * Math.PI / 180;
        
        const positions = this.calculate3DPositions(diagram, bondLength, rotX, rotY);

        // Sort by Z-depth for proper rendering
        const renderOrder = positions
            .map((pos, idx) => ({ pos, idx, z: pos ? pos[2] : -Infinity }))
            .sort((a, b) => a.z - b.z);

        // Draw bonds first (back to front)
        renderOrder.forEach(({ idx }) => {
            const atom = diagram.atoms[idx];
            if (atom.bondedTo !== undefined && positions[idx] && positions[atom.bondedTo]) {
                const bondType = diagram.bondTypes ? diagram.bondTypes[idx - 1] : 'single';
                this.draw3DBond(
                    positions[atom.bondedTo],
                    positions[idx],
                    bondType,
                    diagram.atoms[atom.bondedTo].element,
                    atom.element
                );
            }
        });

        // Draw atoms (back to front)
        renderOrder.forEach(({ idx }) => {
            if (positions[idx]) {
                const atom = diagram.atoms[idx];
                this.drawAtom3D(
                    atom.element,
                    positions[idx][0],
                    positions[idx][1],
                    positions[idx][2],
                    options.showLabels
                );
            }
        });

        // Draw bond angles if requested
        if (options.showAngles && diagram.bondAngles) {
            this.drawBondAngles3D(positions, diagram);
        }

        this.ctx.restore();
    }

    calculate2DPositions(diagram, bondLength) {
        const positions = [];
        
        switch (diagram.geometry) {
            case 'tetrahedral':
                positions[0] = [0, 0];
                const tetPos = [
                    [0, -bondLength],
                    [bondLength * 0.866, bondLength * 0.5],
                    [-bondLength * 0.866, bondLength * 0.5],
                    [0, bondLength * 0.3]
                ];
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = tetPos.shift();
                    }
                });
                break;

            case 'bent':
                positions[0] = [0, 0];
                const angle = (diagram.bondAngles[0] || 104.5) * Math.PI / 180;
                const halfAngle = angle / 2;
                positions[1] = [-bondLength * Math.sin(halfAngle), -bondLength * Math.cos(halfAngle)];
                positions[2] = [bondLength * Math.sin(halfAngle), -bondLength * Math.cos(halfAngle)];
                break;

            case 'trigonal_pyramidal':
                positions[0] = [0, 0];
                const trigPos = [
                    [0, -bondLength],
                    [bondLength * 0.866, bondLength * 0.3],
                    [-bondLength * 0.866, bondLength * 0.3]
                ];
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = trigPos.shift();
                    }
                });
                break;

            case 'linear':
                diagram.atoms.forEach((atom, idx) => {
                    positions[idx] = atom.position ? 
                        [atom.position[0] * bondLength, atom.position[1] * bondLength] :
                        [0, 0];
                });
                break;

            case 'trigonal_planar':
                positions[0] = [0, 0];
                const planarPos = MolecularGeometry.calculateTrigonalPlanarPositions(bondLength);
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        const pos = planarPos.shift();
                        positions[idx] = [pos[0], pos[1]];
                    }
                });
                break;

            case 'octahedral':
                positions[0] = [0, 0];
                const octPos = [
                    [0, -bondLength],
                    [bondLength, 0],
                    [0, bondLength],
                    [-bondLength, 0],
                    [bondLength * 0.5, -bondLength * 0.3],
                    [-bondLength * 0.5, -bondLength * 0.3]
                ];
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = octPos.shift();
                    }
                });
                break;

            default:
                diagram.atoms.forEach((atom, idx) => {
                    positions[idx] = atom.position ? 
                        [atom.position[0] * bondLength, atom.position[1] * bondLength] :
                        [0, 0];
                });
        }

        return positions;
    }

    calculate3DPositions(diagram, bondLength, rotX, rotY) {
        const positions = [];
        let pos3D;

        switch (diagram.geometry) {
            case 'tetrahedral':
                pos3D = MolecularGeometry.calculateTetrahedralPositions(bondLength);
                positions[0] = [0, 0, 0];
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx] && pos3D.length > 0) {
                        positions[idx] = pos3D.shift();
                    }
                });
                break;

            case 'bent':
                pos3D = MolecularGeometry.calculateBentPositions(bondLength, diagram.bondAngles[0]);
                positions[0] = [0, 0, 0];
                positions[1] = pos3D[0];
                positions[2] = pos3D[1];
                break;

            case 'trigonal_pyramidal':
                pos3D = MolecularGeometry.calculateTrigonalPyramidalPositions(bondLength);
                positions[0] = [0, 0, 0];
                let pIndex = 0;
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = pos3D[pIndex++];
                    }
                });
                break;

            case 'linear':
                pos3D = MolecularGeometry.calculateLinearPositions(bondLength);
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.position) {
                        positions[idx] = [
                            atom.position[0] * bondLength,
                            atom.position[1] * bondLength,
                            atom.position[2] * bondLength
                        ];
                    }
                });
                break;

            case 'trigonal_planar':
                pos3D = MolecularGeometry.calculateTrigonalPlanarPositions(bondLength);
                positions[0] = [0, 0, 0];
                let tpIndex = 0;
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = pos3D[tpIndex++];
                    }
                });
                break;

            case 'octahedral':
                pos3D = MolecularGeometry.calculateOctahedralPositions(bondLength);
                positions[0] = [0, 0, 0];
                let octIndex = 0;
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.bondedTo === 0 && !positions[idx]) {
                        positions[idx] = pos3D[octIndex++];
                    }
                });
                break;

            default:
                diagram.atoms.forEach((atom, idx) => {
                    if (atom.position) {
                        positions[idx] = [
                            atom.position[0] * bondLength,
                            atom.position[1] * bondLength,
                            atom.position[2] * bondLength || 0
                        ];
                    }
                });
        }

        // Apply rotations and project to 2D
        return positions.map(pos => {
            if (!pos) return null;
            const rotated = MolecularGeometry.rotatePoint3D(pos, rotX, rotY, 0);
            return MolecularGeometry.projectTo2D(rotated, 1, 500);
        });
    }

    drawAtom2D(element, x, y, showLabel) {
        const props = AtomProperties.getElement(element);
        
        // Draw sphere with gradient
        const gradient = this.ctx.createRadialGradient(
            x - props.radius * 0.3, 
            y - props.radius * 0.3, 
            0,
            x, 
            y, 
            props.radius
        );
        gradient.addColorStop(0, this.lightenColor(props.color, 40));
        gradient.addColorStop(1, props.color);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, props.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Outline
        this.ctx.strokeStyle = this.darkenColor(props.color, 30);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Label
        if (showLabel) {
            this.ctx.fillStyle = element === 'H' ? '#000000' : '#FFFFFF';
            this.ctx.font = 'bold 18px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(element, x, y);
        }
    }

    drawAtom3D(element, x, y, z, showLabel) {
        const props = AtomProperties.getElement(element);
        
        // Depth-based size adjustment
        const depthFactor = (z + 500) / 500;
        const radius = props.radius * Math.max(0.5, Math.min(1.2, depthFactor));

        // Draw sphere with gradient and depth shading
        const brightness = Math.max(0.6, Math.min(1, depthFactor));
        const gradient = this.ctx.createRadialGradient(
            x - radius * 0.3, 
            y - radius * 0.3, 
            0,
            x, 
            y, 
            radius
        );
        
        const lightColor = this.lightenColor(props.color, 40 * brightness);
        const baseColor = this.adjustBrightness(props.color, brightness);
        
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(0.7, baseColor);
        gradient.addColorStop(1, this.darkenColor(baseColor, 20));

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Specular highlight
        this.ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * brightness})`;
        this.ctx.beginPath();
        this.ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        // Outline
        this.ctx.strokeStyle = this.darkenColor(props.color, 30);
        this.ctx.lineWidth = 2 * (z > 0 ? 1 : 0.7);
        this.ctx.stroke();

        // Label
        if (showLabel) {
            this.ctx.fillStyle = element === 'H' ? '#000000' : '#FFFFFF';
            this.ctx.font = `bold ${Math.floor(16 * depthFactor)}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(element, x, y);
        }
    }

    draw2DBond(pos1, pos2, bondType = 'single') {
        const [x1, y1] = pos1;
        const [x2, y2] = pos2;

        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;

        if (bondType === 'single') {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        } else if (bondType === 'double') {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const offsetX = -dy / len * 4;
            const offsetY = dx / len * 4;

            this.ctx.beginPath();
            this.ctx.moveTo(x1 + offsetX, y1 + offsetY);
            this.ctx.lineTo(x2 + offsetX, y2 + offsetY);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x1 - offsetX, y1 - offsetY);
            this.ctx.lineTo(x2 - offsetX, y2 - offsetY);
            this.ctx.stroke();
        } else if (bondType === 'triple') {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const offsetX = -dy / len * 5;
            const offsetY = dx / len * 5;

            this.ctx.beginPath();
            this.ctx.moveTo(x1 + offsetX, y1 + offsetY);
            this.ctx.lineTo(x2 + offsetX, y2 + offsetY);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x1 - offsetX, y1 - offsetY);
            this.ctx.lineTo(x2 - offsetX, y2 - offsetY);
            this.ctx.stroke();
        }
    }

    draw3DBond(pos1, pos2, bondType, element1, element2) {
        const [x1, y1, z1] = pos1;
        const [x2, y2, z2] = pos2;

        // Depth-based width
        const avgZ = (z1 + z2) / 2;
        const depthFactor = (avgZ + 500) / 500;
        const lineWidth = 3 * Math.max(0.7, Math.min(1.2, depthFactor));

        // Gradient for depth
        const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
        const brightness1 = Math.max(0.6, (z1 + 500) / 500);
        const brightness2 = Math.max(0.6, (z2 + 500) / 500);
        
        gradient.addColorStop(0, `rgba(44, 62, 80, ${brightness1})`);
        gradient.addColorStop(1, `rgba(44, 62, 80, ${brightness2})`);

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';

        if (bondType === 'single') {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        } else if (bondType === 'double') {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const offsetX = -dy / len * 4;
            const offsetY = dx / len * 4;

            this.ctx.beginPath();
            this.ctx.moveTo(x1 + offsetX, y1 + offsetY);
            this.ctx.lineTo(x2 + offsetX, y2 + offsetY);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x1 - offsetX, y1 - offsetY);
            this.ctx.lineTo(x2 - offsetX, y2 - offsetY);
            this.ctx.stroke();
        } else if (bondType === 'triple') {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const offsetX = -dy / len * 5;
            const offsetY = dx / len * 5;

            this.ctx.beginPath();
            this.ctx.moveTo(x1 + offsetX, y1 + offsetY);
            this.ctx.lineTo(x2 + offsetX, y2 + offsetY);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x1 - offsetX, y1 - offsetY);
            this.ctx.lineTo(x2 - offsetX, y2 - offsetY);
            this.ctx.stroke();
        }
    }

    drawBondAngles2D(positions, diagram, bondLength) {
        if (positions.length < 3) return;

        this.ctx.save();
        
        const centralPos = positions[0];
        const bondedPositions = positions.slice(1, 3);

        if (centralPos && bondedPositions[0] && bondedPositions[1]) {
            const angle1 = Math.atan2(
                bondedPositions[0][1] - centralPos[1],
                bondedPositions[0][0] - centralPos[0]
            );
            const angle2 = Math.atan2(
                bondedPositions[1][1] - centralPos[1],
                bondedPositions[1][0] - centralPos[0]
            );

            // Draw arc
            this.ctx.strokeStyle = '#E74C3C';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 3]);
            this.ctx.beginPath();
            this.ctx.arc(centralPos[0], centralPos[1], bondLength * 0.4, angle1, angle2, false);
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            // Draw angle label
            const midAngle = (angle1 + angle2) / 2;
            const labelX = centralPos[0] + Math.cos(midAngle) * bondLength * 0.6;
            const labelY = centralPos[1] + Math.sin(midAngle) * bondLength * 0.6;

            this.ctx.fillStyle = '#E74C3C';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`${diagram.bondAngles[0]}°`, labelX, labelY);
        }

        this.ctx.restore();
    }

    drawBondAngles3D(positions, diagram) {
        if (positions.length < 3) return;

        this.ctx.save();
        
        const centralPos = positions[0];
        const bondedPositions = positions.slice(1, 3).filter(p => p);

        if (centralPos && bondedPositions.length >= 2) {
            const angle1 = Math.atan2(
                bondedPositions[0][1] - centralPos[1],
                bondedPositions[0][0] - centralPos[0]
            );
            const angle2 = Math.atan2(
                bondedPositions[1][1] - centralPos[1],
                bondedPositions[1][0] - centralPos[0]
            );

            const radius = 50;

            // Draw arc
            this.ctx.strokeStyle = '#E74C3C';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 3]);
            this.ctx.beginPath();
            this.ctx.arc(centralPos[0], centralPos[1], radius, angle1, angle2, false);
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            // Draw angle label
            const midAngle = (angle1 + angle2) / 2;
            const labelX = centralPos[0] + Math.cos(midAngle) * (radius + 20);
            const labelY = centralPos[1] + Math.sin(midAngle) * (radius + 20);

            this.ctx.fillStyle = '#E74C3C';
            this.ctx.font = 'bold 13px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`${diagram.bondAngles[0]}°`, labelX, labelY);
        }

        this.ctx.restore();
    }

    drawLonePairs2D(centralPos, count) {
        if (!centralPos) return;

        const [x, y] = centralPos;
        const radius = 50;
        const angleStart = Math.PI * 0.6;
        const angleSpacing = Math.PI * 0.3;

        this.ctx.fillStyle = '#95A5A6';
        
        for (let i = 0; i < count; i++) {
            const angle = angleStart + i * angleSpacing;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;

            // Draw two dots for each lone pair
            this.ctx.beginPath();
            this.ctx.arc(px - 4, py, 3, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(px + 4, py, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawTitle(title, x, y) {
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, x, y);
    }

    drawMolecularInfo(diagram, x, y, options) {
        this.ctx.save();
        this.ctx.translate(x, y);

        // Info box background
        this.ctx.fillStyle = 'rgba(236, 240, 241, 0.9)';
        this.ctx.strokeStyle = '#BDC3C7';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(0, 0, 300, 80, 8);
        this.ctx.fill();
        this.ctx.stroke();

        // Info text
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = '13px Arial';
        this.ctx.textAlign = 'left';

        this.ctx.fillText(`Formula: ${diagram.formula}`, 15, 25);
        this.ctx.fillText(`Geometry: ${diagram.geometry.replace(/_/g, ' ')}`, 15, 45);
        
        if (diagram.bondAngles && diagram.bondAngles.length > 0) {
            const angleText = diagram.bondAngles.length > 1 
                ? `${diagram.bondAngles.join('°, ')}°`
                : `${diagram.bondAngles[0]}°`;
            this.ctx.fillText(`Bond Angles: ${angleText}`, 15, 65);
        }

        this.ctx.restore();
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
    }

    adjustBrightness(color, factor) {
        const num = parseInt(color.replace('#', ''), 16);
        const R = Math.min(255, Math.max(0, Math.round((num >> 16) * factor)));
        const G = Math.min(255, Math.max(0, Math.round(((num >> 8) & 0x00FF) * factor)));
        const B = Math.min(255, Math.max(0, Math.round((num & 0x0000FF) * factor)));
        return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
    }
}





// ============================================================================
// EXCEL CHARTS REGISTRY - Comprehensive Chart Configuration System
// ============================================================================

class ExcelChartsRegistry {
    static charts = {
        // ===== COMPARISON CHARTS =====
        'columnChart': {
            name: 'Column Chart',
            category: 'Comparison',
            description: 'Vertical bars comparing values across categories',
            excel: 'Column Chart',
            dataRequired: ['categories', 'series'],
            usage: 'Best for comparing values across different categories',
            examples: ['Sales by region', 'Monthly revenue', 'Product performance'],
            defaultOptions: {
                title: 'Column Chart',
                xlabel: 'Categories',
                ylabel: 'Values',
                color: '#4472C4',
                alternateColor: '#ED7D31',
                height: 400,
                width: 600,
                showGrid: true,
                showLegend: true,
                backgroundColor: '#ffffff'
            }
        },

        'barChart': {
            name: 'Bar Chart',
            category: 'Comparison',
            description: 'Horizontal bars comparing values across categories',
            excel: 'Bar Chart',
            dataRequired: ['categories', 'series'],
            usage: 'Best for comparing values with long category names',
            examples: ['Country sales', 'Department budgets', 'Team performance'],
            defaultOptions: {
                title: 'Bar Chart',
                xlabel: 'Values',
                ylabel: 'Categories',
                color: '#70AD47',
                alternateColor: '#FFC000',
                height: 400,
                width: 600,
                showGrid: true,
                showLegend: true,
                backgroundColor: '#ffffff'
            }
        },

        'lineChart': {
            name: 'Line Chart',
            category: 'Trend',
            description: 'Lines showing trends over time',
            excel: 'Line Chart',
            dataRequired: ['xValues', 'yValues'],
            usage: 'Best for showing trends and changes over time',
            examples: ['Stock price trends', 'Website traffic', 'Temperature over months'],
            defaultOptions: {
                title: 'Line Chart',
                xlabel: 'Time/Categories',
                ylabel: 'Values',
                lineColor: '#4472C4',
                lineWidth: 2,
                height: 400,
                width: 600,
                showGrid: true,
                showLegend: true,
                smooth: true,
                backgroundColor: '#ffffff',
                pointRadius: 4
            }
        },

        'areaChart': {
            name: 'Area Chart',
            category: 'Trend',
            description: 'Area under line showing cumulative trends',
            excel: 'Area Chart',
            dataRequired: ['xValues', 'yValues'],
            usage: 'Best for showing cumulative trends over time',
            examples: ['Revenue accumulation', 'Market share growth', 'Cumulative sales'],
            defaultOptions: {
                title: 'Area Chart',
                xlabel: 'Time/Categories',
                ylabel: 'Values',
                areaColor: '#4472C4',
                opacity: 0.6,
                height: 400,
                width: 600,
                showGrid: true,
                showLegend: true,
                backgroundColor: '#ffffff'
            }
        },

        'pieChart': {
            name: 'Pie Chart',
            category: 'Composition',
            description: 'Pie slices showing composition as percentages',
            excel: 'Pie Chart',
            dataRequired: ['labels', 'values'],
            usage: 'Best for showing parts of a whole (composition)',
            examples: ['Market share', 'Budget allocation', 'Sales by category'],
            defaultOptions: {
                title: 'Pie Chart',
                colors: ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#70AD47', '#FF6B6B'],
                height: 400,
                width: 600,
                showLegend: true,
                showPercentage: true,
                explodeSlices: false,
                backgroundColor: '#ffffff',
                borderRadius: 50
            }
        },

        'donutChart': {
            name: 'Donut Chart',
            category: 'Composition',
            description: 'Pie chart with hollow center showing composition',
            excel: 'Doughnut Chart',
            dataRequired: ['labels', 'values'],
            usage: 'Best for showing parts of a whole with center text',
            examples: ['Resource allocation', 'Customer segments', 'Project breakdown'],
            defaultOptions: {
                title: 'Donut Chart',
                colors: ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#70AD47', '#FF6B6B'],
                height: 400,
                width: 600,
                innerRadius: 60,
                outerRadius: 120,
                showLegend: true,
                showPercentage: true,
                centerText: '',
                backgroundColor: '#ffffff'
            }
        },

        'scatterChart': {
            name: 'Scatter Plot',
            category: 'Correlation',
            description: 'Points showing correlation between two variables',
            excel: 'Scatter Chart',
            dataRequired: ['xValues', 'yValues'],
            usage: 'Best for showing relationships between variables',
            examples: ['Price vs demand', 'Temperature vs sales', 'Height vs weight'],
            defaultOptions: {
                title: 'Scatter Plot',
                xlabel: 'X Axis',
                ylabel: 'Y Axis',
                pointColor: '#4472C4',
                pointSize: 6,
                height: 400,
                width: 600,
                showGrid: true,
                showTrendline: false,
                backgroundColor: '#ffffff'
            }
        },

        'bubbleChart': {
            name: 'Bubble Chart',
            category: 'Correlation',
            description: 'Bubbles showing three variables (x, y, size)',
            excel: 'Bubble Chart',
            dataRequired: ['xValues', 'yValues', 'sizes'],
            usage: 'Best for showing 3-dimensional relationships',
            examples: ['Company analysis (profit, growth, market cap)', 'Product metrics'],
            defaultOptions: {
                title: 'Bubble Chart',
                xlabel: 'X Axis',
                ylabel: 'Y Axis',
                bubbleColor: '#4472C4',
                height: 400,
                width: 600,
                showGrid: true,
                opacity: 0.7,
                backgroundColor: '#ffffff',
                minBubbleSize: 10,
                maxBubbleSize: 100
            }
        },

        'histogramChart': {
            name: 'Histogram',
            category: 'Distribution',
            description: 'Bars showing distribution of continuous data',
            excel: 'Histogram',
            dataRequired: ['values'],
            usage: 'Best for showing data distribution patterns',
            examples: ['Age distribution', 'Test scores', 'Income ranges'],
            defaultOptions: {
                title: 'Histogram',
                xlabel: 'Value Ranges',
                ylabel: 'Frequency',
                barColor: '#4472C4',
                height: 400,
                width: 600,
                bins: 10,
                showGrid: true,
                backgroundColor: '#ffffff'
            }
        },

        'boxPlotChart': {
            name: 'Box Plot',
            category: 'Distribution',
            description: 'Box and whisker plot showing data distribution',
            excel: 'Box & Whisker',
            dataRequired: ['series'],
            usage: 'Best for comparing distributions and identifying outliers',
            examples: ['Test score comparison', 'Salary ranges', 'Performance metrics'],
            defaultOptions: {
                title: 'Box Plot',
                xlabel: 'Categories',
                ylabel: 'Values',
                boxColor: '#4472C4',
                whiskerColor: '#000000',
                height: 400,
                width: 600,
                showGrid: true,
                backgroundColor: '#ffffff'
            }
        },

        'comboChart': {
            name: 'Combo Chart',
            category: 'Comparison',
            description: 'Combination of bar and line showing different data types',
            excel: 'Combo Chart',
            dataRequired: ['categories', 'barSeries', 'lineSeries'],
            usage: 'Best for comparing different metrics on same chart',
            examples: ['Revenue and profit', 'Sales and market share', 'Units and value'],
            defaultOptions: {
                title: 'Combo Chart',
                xlabel: 'Categories',
                ylabel1: 'Primary Values',
                ylabel2: 'Secondary Values',
                barColor: '#4472C4',
                lineColor: '#ED7D31',
                height: 400,
                width: 600,
                showGrid: true,
                showLegend: true,
                backgroundColor: '#ffffff'
            }
        },

        'waterfall': {
            name: 'Waterfall Chart',
            category: 'Comparison',
            description: 'Shows how initial value changes through sequence',
            excel: 'Waterfall Chart',
            dataRequired: ['categories', 'values'],
            usage: 'Best for showing impact of positive/negative changes',
            examples: ['Budget variance', 'Profit breakdown', 'Revenue changes'],
            defaultOptions: {
                title: 'Waterfall Chart',
                xlabel: 'Categories',
                ylabel: 'Values',
                positiveColor: '#70AD47',
                negativeColor: '#FF6B6B',
                totalColor: '#4472C4',
                height: 400,
                width: 600,
                showValues: true,
                backgroundColor: '#ffffff'
            }
        },

        'radarChart': {
            name: 'Radar Chart',
            category: 'Comparison',
            description: 'Multi-axis chart for comparing multiple variables',
            excel: 'Radar Chart',
            dataRequired: ['categories', 'series'],
            usage: 'Best for comparing multiple attributes of entities',
            examples: ['Product features', 'Employee skills', 'Company metrics'],
            defaultOptions: {
                title: 'Radar Chart',
                colors: ['#4472C4', '#ED7D31', '#A5A5A5'],
                height: 400,
                width: 600,
                showGrid: true,
                showLegend: true,
                fillOpacity: 0.2,
                backgroundColor: '#ffffff'
            }
        },

        'gaugeChart': {
            name: 'Gauge Chart',
            category: 'Dashboard',
            description: 'Speedometer-style gauge showing single metric',
            excel: 'Gauge (via conditional formatting)',
            dataRequired: ['value', 'min', 'max'],
            usage: 'Best for displaying KPIs and performance metrics',
            examples: ['Performance score', 'Completion percentage', 'Satisfaction rating'],
            defaultOptions: {
                title: 'Gauge Chart',
                value: 65,
                minValue: 0,
                maxValue: 100,
                unit: '%',
                colors: ['#FF6B6B', '#FFC000', '#70AD47'],
                height: 300,
                width: 400,
                backgroundColor: '#ffffff',
                showValue: true
            }
        },

        'funnelChart': {
            name: 'Funnel Chart',
            category: 'Specialized',
            description: 'Shows sequential stages with decreasing values',
            excel: 'Funnel Chart',
            dataRequired: ['stages', 'values'],
            usage: 'Best for showing conversion rates and process stages',
            examples: ['Sales funnel', 'Customer journey', 'Conversion stages'],
            defaultOptions: {
                title: 'Funnel Chart',
                colors: ['#4472C4', '#5B8FD8', '#70AD47', '#FFC000', '#ED7D31'],
                height: 400,
                width: 600,
                showValues: true,
                showPercentage: true,
                backgroundColor: '#ffffff'
            }
        },

        'treemap': {
            name: 'Treemap',
            category: 'Composition',
            description: 'Hierarchical rectangles showing composition and hierarchy',
            excel: 'Treemap',
            dataRequired: ['labels', 'values', 'parents'],
            usage: 'Best for showing hierarchical composition',
            examples: ['File storage usage', 'Market segments', 'Organizational structure'],
            defaultOptions: {
                title: 'Treemap',
                colors: ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#70AD47'],
                height: 400,
                width: 600,
                backgroundColor: '#ffffff',
                showLabels: true,
                borderWidth: 2
            }
        },

        'sunburst': {
            name: 'Sunburst Chart',
            category: 'Composition',
            description: 'Multi-level pie chart showing hierarchical composition',
            excel: 'Sunburst Chart',
            dataRequired: ['labels', 'values', 'parents'],
            usage: 'Best for showing multi-level hierarchies',
            examples: ['Organization structure', 'File system', 'Product categories'],
            defaultOptions: {
                title: 'Sunburst Chart',
                colors: ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#70AD47', '#FF6B6B'],
                height: 500,
                width: 600,
                backgroundColor: '#ffffff',
                showLabels: true
            }
        },

        'splineChart': {
            name: 'Spline Chart',
            category: 'Trend',
            description: 'Smooth curve line chart showing trends',
            excel: 'Line Chart (Spline)',
            dataRequired: ['xValues', 'yValues'],
            usage: 'Best for smooth trend visualization',
            examples: ['Temperature trends', 'Growth curves', 'Performance over time'],
            defaultOptions: {
                title: 'Spline Chart',
                xlabel: 'X Axis',
                ylabel: 'Y Axis',
                lineColor: '#4472C4',
                lineWidth: 2,
                height: 400,
                width: 600,
                showGrid: true,
                smoothness: 0.5,
                backgroundColor: '#ffffff'
            }
        },

        'bubbleMapChart': {
            name: 'Bubble Map',
            category: 'Specialized',
            description: 'Geographic map with bubbles showing regional data',
            excel: 'Map Chart',
            dataRequired: ['regions', 'values'],
            usage: 'Best for geographic comparison',
            examples: ['Sales by region', 'Population density', 'Website traffic by country'],
            defaultOptions: {
                title: 'Bubble Map',
                bubbleColor: '#4472C4',
                height: 400,
                width: 600,
                showGrid: true,
                minBubbleSize: 5,
                maxBubbleSize: 50,
                backgroundColor: '#f0f0f0'
            }
        }
    };

    // Get chart configuration
    static getChart(chartKey) {
        return this.charts[chartKey];
    }

    // Get all charts
    static getAllCharts() {
        return Object.keys(this.charts);
    }

    // Get charts by category
    static getChartsByCategory(category) {
        return Object.entries(this.charts)
            .filter(([_, chart]) => chart.category === category)
            .reduce((acc, [key, chart]) => {
                acc[key] = chart;
                return acc;
            }, {});
    }

    // Get all categories
    static getAllCategories() {
        return [...new Set(Object.values(this.charts).map(c => c.category))];
    }

    // Search charts
    static searchCharts(query) {
        const lowerQuery = query.toLowerCase();
        return Object.entries(this.charts)
            .filter(([key, chart]) =>
                chart.name.toLowerCase().includes(lowerQuery) ||
                chart.description.toLowerCase().includes(lowerQuery) ||
                chart.category.toLowerCase().includes(lowerQuery) ||
                key.toLowerCase().includes(lowerQuery)
            )
            .reduce((acc, [key, chart]) => {
                acc[key] = chart;
                return acc;
            }, {});
    }

    // Get chart statistics
    static getChartStats() {
        const stats = {};
        this.getAllCategories().forEach(category => {
            const charts = this.getChartsByCategory(category);
            stats[category] = {
                count: Object.keys(charts).length,
                charts: Object.keys(charts)
            };
        });
        return stats;
    }

    // Validate data for chart
    static validateChartData(chartKey, data) {
        const chart = this.getChart(chartKey);
        if (!chart) {
            return { valid: false, error: 'Chart not found' };
        }

        const validation = {
            valid: true,
            errors: []
        };

        // Check required data fields
        const missingFields = chart.dataRequired.filter(field => !data[field] || data[field].length === 0);
        if (missingFields.length > 0) {
            validation.errors.push(`Missing required data: ${missingFields.join(', ')}`);
            validation.valid = false;
        }

        // Check data consistency
        if (data.categories && data.series) {
            const categoryCount = data.categories.length;
            const seriesValid = data.series.every(s => s.length === categoryCount);
            if (!seriesValid) {
                validation.errors.push('Series data length must match categories');
                validation.valid = false;
            }
        }

        return validation;
    }
}


// ============================================================================
// CHART CANVAS RENDERER - Creates charts using napi-rs/canvas
// ============================================================================

class ChartCanvasRenderer {
    constructor() {
        this.defaultFont = 'Arial, sans-serif';
        this.defaultFontSize = 12;
    }

    // Render chart to canvas
    renderChart(canvas, ctx, chartKey, data, options = {}) {
        const chart = ExcelChartsRegistry.getChart(chartKey);
        if (!chart) {
            throw new Error(`Chart '${chartKey}' not found`);
        }

        const mergedOptions = { ...chart.defaultOptions, ...options };

        switch (chartKey) {
            case 'columnChart':
                return this.renderColumnChart(ctx, data, mergedOptions, canvas);
            case 'barChart':
                return this.renderBarChart(ctx, data, mergedOptions, canvas);
            case 'lineChart':
                return this.renderLineChart(ctx, data, mergedOptions, canvas);
            case 'areaChart':
                return this.renderAreaChart(ctx, data, mergedOptions, canvas);
            case 'pieChart':
                return this.renderPieChart(ctx, data, mergedOptions, canvas);
            case 'donutChart':
                return this.renderDonutChart(ctx, data, mergedOptions, canvas);
            case 'scatterChart':
                return this.renderScatterChart(ctx, data, mergedOptions, canvas);
            case 'gaugeChart':
                return this.renderGaugeChart(ctx, data, mergedOptions, canvas);
            case 'waterfall':
                return this.renderWaterfall(ctx, data, mergedOptions, canvas);
            case 'radarChart':
                return this.renderRadarChart(ctx, data, mergedOptions, canvas);
            case 'funnelChart':
                return this.renderFunnelChart(ctx, data, mergedOptions, canvas);
            default:
                throw new Error(`Rendering for chart '${chartKey}' not yet implemented`);
        }
    }

    // Column Chart Renderer
    renderColumnChart(ctx, data, options, canvas) {
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = `bold 16px ${this.defaultFont}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, canvas.width / 2, 30);

        const categories = data.categories || [];
        const values = data.series?.[0] || [];

        if (categories.length === 0 || values.length === 0) {
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxValue = Math.max(...values.map(v => parseFloat(v)));
        const barWidth = (chartWidth / categories.length) * 0.7;
        const spacing = (chartWidth / categories.length) * 0.3;

        // Draw grid lines
        if (options.showGrid) {
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 5; i++) {
                const y = padding + (chartHeight * (1 - i / 5));
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(padding + chartWidth, y);
                ctx.stroke();
            }
        }

        // Draw bars
        values.forEach((value, index) => {
            const barHeight = (parseFloat(value) / maxValue) * chartHeight;
            const x = padding + (index * (chartWidth / categories.length)) + spacing / 2;
            const y = padding + chartHeight - barHeight;

            ctx.fillStyle = index % 2 === 0 ? options.color : options.alternateColor;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Value label on bar
            ctx.fillStyle = '#000000';
            ctx.font = `11px ${this.defaultFont}`;
            ctx.textAlign = 'center';
            ctx.fillText(value.toFixed(0), x + barWidth / 2, y - 5);
        });

        // X-axis labels
        ctx.fillStyle = '#666666';
        ctx.font = `11px ${this.defaultFont}`;
        ctx.textAlign = 'center';
        categories.forEach((cat, index) => {
            const x = padding + (index * (chartWidth / categories.length)) + chartWidth / (categories.length * 2);
            ctx.fillText(String(cat).substring(0, 10), x, padding + chartHeight + 20);
        });

        // Axes
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();

        // Y-axis label
        ctx.fillStyle = '#666666';
        ctx.font = `11px ${this.defaultFont}`;
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = (maxValue * i / 5).toFixed(0);
            const y = padding + chartHeight * (1 - i / 5);
            ctx.fillText(value, padding - 10, y + 4);
        }
    }

    // Pie Chart Renderer
    renderPieChart(ctx, data, options, canvas) {
        const padding = 40;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 2.5;

        // Background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = `bold 16px ${this.defaultFont}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, canvas.width / 2, 30);

        const labels = data.labels || [];
        const values = data.values || [];

        if (labels.length === 0 || values.length === 0) {
            ctx.fillText('No data to display', centerX, centerY);
            return;
        }

        const total = values.reduce((sum, v) => sum + parseFloat(v), 0);
        let currentAngle = -Math.PI / 2;

        values.forEach((value, index) => {
            const sliceAngle = (parseFloat(value) / total) * 2 * Math.PI;

            // Draw slice
            ctx.fillStyle = options.colors[index % options.colors.length];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Draw border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw label
            if (options.showPercentage) {
                const labelAngle = currentAngle + sliceAngle / 2;
                const labelRadius = radius * 0.65;
                const labelX = centerX + Math.cos(labelAngle) * labelRadius;
                const labelY = centerY + Math.sin(labelAngle) * labelRadius;

                const percentage = ((parseFloat(value) / total) * 100).toFixed(1);
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold 12px ${this.defaultFont}`;
                ctx.textAlign = 'center';
                ctx.fillText(percentage + '%', labelX, labelY);
            }

            currentAngle += sliceAngle;
        });

        // Draw legend
        if (options.showLegend) {
            const legendX = canvas.width - 200;
            const legendY = 80;
            const legendItemHeight = 20;

            labels.forEach((label, index) => {
                const y = legendY + index * legendItemHeight;

                // Color box
                ctx.fillStyle = options.colors[index % options.colors.length];
                ctx.fillRect(legendX, y, 12, 12);

                // Label
                ctx.fillStyle = '#000000';
                ctx.font = `11px ${this.defaultFont}`;
                ctx.textAlign = 'left';
                ctx.fillText(String(label).substring(0, 15), legendX + 18, y + 10);
            });
        }
    }

    // Line Chart Renderer
    renderLineChart(ctx, data, options, canvas) {
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = `bold 16px ${this.defaultFont}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, canvas.width / 2, 30);

        const xValues = data.xValues || [];
        const yValues = data.yValues || [];

        if (xValues.length === 0 || yValues.length === 0) {
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxY = Math.max(...yValues.map(v => parseFloat(v)));
        const minY = Math.min(...yValues.map(v => parseFloat(v)));

        // Draw grid
        if (options.showGrid) {
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 5; i++) {
                const y = padding + (chartHeight * i / 5);
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(padding + chartWidth, y);
                ctx.stroke();
            }
        }

        // Draw line
        ctx.strokeStyle = options.lineColor;
        ctx.lineWidth = options.lineWidth;
        ctx.beginPath();

        yValues.forEach((value, index) => {
            const x = padding + (index / (yValues.length - 1)) * chartWidth;
            const y = padding + chartHeight - (((parseFloat(value) - minY) / (maxY - minY)) * chartHeight);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw points
        yValues.forEach((value, index) => {
            const x = padding + (index / (yValues.length - 1)) * chartWidth;
            const y = padding + chartHeight - (((parseFloat(value) - minY) / (maxY - minY)) * chartHeight);

            ctx.fillStyle = options.lineColor;
            ctx.beginPath();
            ctx.arc(x, y, options.pointRadius, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Axes
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
    }

    // Gauge Chart Renderer
    renderGaugeChart(ctx, data, options, canvas) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;

        // Background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = `bold 16px ${this.defaultFont}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, centerX, 30);

        const value = parseFloat(data.value || options.value);
        const minVal = parseFloat(data.min || options.minValue);
        const maxVal = parseFloat(data.max || options.maxValue);

        // Draw gauge background
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        ctx.stroke();

        // Draw colored gauge sections
        const ranges = [
            { color: options.colors[0], start: 0, end: 0.33 },
            { color: options.colors[1], start: 0.33, end: 0.67 },
            { color: options.colors[2], start: 0.67, end: 1 }
        ];

        ranges.forEach(range => {
            ctx.strokeStyle = range.color;
            ctx.lineWidth = 20;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, Math.PI + (Math.PI * range.start), Math.PI + (Math.PI * range.end));
            ctx.stroke();
        });

        // Draw needle
        const percentage = (value - minVal) / (maxVal - minVal);
        const angle = Math.PI + (Math.PI * percentage);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * radius * 0.8, centerY + Math.sin(angle) * radius * 0.8);
        ctx.stroke();

        // Draw center circle
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Draw value display
        ctx.fillStyle = '#000000';
        ctx.font = `bold 24px ${this.defaultFont}`;
        ctx.textAlign = 'center';
        ctx.fillText(value.toFixed(1) + options.unit, centerX, centerY + 60);
    }

    // Waterfall Chart Renderer
    renderWaterfall(ctx, data, options, canvas) {
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = `bold 16px ${this.defaultFont}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, canvas.width / 2, 30);

        const categories = data.categories || [];
        const values = data.values || [];

        if (categories.length === 0 || values.length === 0) {
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }

        let cumulative = 0;
        const maxVal = Math.max(...values.map(v => Math.abs(parseFloat(v))));

        const barWidth = (chartWidth / (categories.length + 1)) * 0.7;
        const spacing = (chartWidth / (categories.length + 1)) * 0.3;

        // Draw bars
        values.forEach((value, index) => {
            const numValue = parseFloat(value);
            const previousCumulative = cumulative;
            cumulative += numValue;

            const isPositive = numValue >= 0;
            const barHeight = (Math.abs(numValue) / maxVal) * chartHeight;
            const x = padding + spacing / 2 + (index * (chartWidth / (categories.length + 1)));
            const y = isPositive
                ? padding + chartHeight - (((previousCumulative + numValue) / maxVal) * chartHeight)
                : padding + chartHeight - ((previousCumulative / maxVal) * chartHeight);

            // Draw bar
            ctx.fillStyle = isPositive ? options.positiveColor : options.negativeColor;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw connector line
            if (index < values.length - 1) {
                ctx.strokeStyle = '#999999';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(x + barWidth, padding + chartHeight - ((cumulative / maxVal) * chartHeight));
                const nextX = padding + spacing / 2 + ((index + 1) * (chartWidth / (categories.length + 1)));
                ctx.lineTo(nextX, padding + chartHeight - ((cumulative / maxVal) * chartHeight));
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Value label
            if (options.showValues) {
                ctx.fillStyle = '#000000';
                ctx.font = `11px ${this.defaultFont}`;
                ctx.textAlign = 'center';
                ctx.fillText(numValue.toFixed(0), x + barWidth / 2, y - 5);
            }
        });

        // X-axis labels
        ctx.fillStyle = '#666666';
        ctx.font = `11px ${this.defaultFont}`;
        ctx.textAlign = 'center';
        categories.forEach((cat, index) => {
            const x = padding + spacing / 2 + (index * (chartWidth / (categories.length + 1))) + barWidth / 2;
            ctx.fillText(String(cat).substring(0, 10), x, padding + chartHeight + 20);
        });

        // Axes
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
    }

    // Radar Chart Renderer
    renderRadarChart(ctx, data, options, canvas) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;

        // Background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = `bold 16px ${this.defaultFont}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, centerX, 30);

        const categories = data.categories || [];
        const series = data.series || [];
        const numCategories = categories.length;

        if (numCategories === 0) {
            ctx.fillText('No data to display', centerX, centerY);
            return;
        }

        // Draw grid circles
        if (options.showGrid) {
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            for (let i = 1; i <= 5; i++) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }

        // Draw axes
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        for (let i = 0; i < numCategories; i++) {
            const angle = (i / numCategories) * 2 * Math.PI;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        // Draw data series
        series.forEach((seriesData, seriesIndex) => {
            ctx.fillStyle = options.colors[seriesIndex % options.colors.length];
            ctx.globalAlpha = options.fillOpacity;

            ctx.beginPath();
            seriesData.forEach((value, index) => {
                const angle = (index / numCategories) * 2 * Math.PI;
                const distance = (parseFloat(value) / 100) * radius;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.closePath();
            ctx.fill();

            // Draw outline
            ctx.globalAlpha = 1;
            ctx.strokeStyle = options.colors[seriesIndex % options.colors.length];
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw labels
        ctx.fillStyle = '#666666';
        ctx.font = `12px ${this.defaultFont}`;
        ctx.textAlign = 'center';
        categories.forEach((cat, index) => {
            const angle = (index / numCategories) * 2 * Math.PI;
            const x = centerX + Math.cos(angle) * (radius + 30);
            const y = centerY + Math.sin(angle) * (radius + 30);
            ctx.fillText(String(cat).substring(0, 12), x, y);
        });

        // Draw legend
        if (options.showLegend) {
            const legendX = canvas.width - 150;
            const legendY = 80;

            series.forEach((_, index) => {
                const y = legendY + index * 20;
                ctx.fillStyle = options.colors[index % options.colors.length];
                ctx.fillRect(legendX, y, 12, 12);

                ctx.fillStyle = '#000000';
                ctx.font = `11px ${this.defaultFont}`;
                ctx.textAlign = 'left';
                ctx.fillText(`Series ${index + 1}`, legendX + 18, y + 10);
            });
        }
    }

    // Funnel Chart Renderer
    renderFunnelChart(ctx, data, options, canvas) {
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = `bold 16px ${this.defaultFont}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, canvas.width / 2, 30);

        const stages = data.stages || [];
        const values = data.values || [];

        if (stages.length === 0 || values.length === 0) {
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxValue = Math.max(...values.map(v => parseFloat(v)));
        const segmentHeight = chartHeight / stages.length;

        stages.forEach((stage, index) => {
            const value = parseFloat(values[index]);
            const percentage = value / maxValue;
            const width = chartWidth * percentage;
            const x = padding + (chartWidth - width) / 2;
            const y = padding + 40 + (index * segmentHeight);

            // Draw segment
            ctx.fillStyle = options.colors[index % options.colors.length];
            ctx.fillRect(x, y, width, segmentHeight - 5);

            // Draw label
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold 12px ${this.defaultFont}`;
            ctx.textAlign = 'center';
            ctx.fillText(String(stage), padding + chartWidth / 2, y + segmentHeight / 2);

            // Draw value
            if (options.showValues) {
                ctx.fillStyle = '#000000';
                ctx.font = `11px ${this.defaultFont}`;
                ctx.textAlign = 'left';
                ctx.fillText(value.toFixed(0), x + width + 10, y + segmentHeight / 2);
            }

            // Draw percentage
            if (options.showPercentage) {
                const pct = ((value / maxValue) * 100).toFixed(1);
                ctx.fillStyle = '#666666';
                ctx.font = `10px ${this.defaultFont}`;
                ctx.fillText(pct + '%', x - 30, y + segmentHeight / 2);
            }
        });
    }

    // Area Chart Renderer
    renderAreaChart(ctx, data, options, canvas) {
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = `bold 16px ${this.defaultFont}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, canvas.width / 2, 30);

        const xValues = data.xValues || [];
        const yValues = data.yValues || [];

        if (xValues.length === 0 || yValues.length === 0) {
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxY = Math.max(...yValues.map(v => parseFloat(v)));
        const minY = 0;

        // Draw area
        ctx.fillStyle = options.areaColor;
        ctx.globalAlpha = options.opacity;
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);

        yValues.forEach((value, index) => {
            const x = padding + (index / (yValues.length - 1)) * chartWidth;
            const y = padding + chartHeight - (((parseFloat(value) - minY) / (maxY - minY)) * chartHeight);
            ctx.lineTo(x, y);
        });

        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.closePath();
        ctx.fill();

        // Draw line on top
        ctx.globalAlpha = 1;
        ctx.strokeStyle = options.areaColor;
        ctx.lineWidth = 2;
        ctx.beginPath();

        yValues.forEach((value, index) => {
            const x = padding + (index / (yValues.length - 1)) * chartWidth;
            const y = padding + chartHeight - (((parseFloat(value) - minY) / (maxY - minY)) * chartHeight);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Axes
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
    }

    // Bar Chart Renderer
    renderBarChart(ctx, data, options, canvas) {
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = `bold 16px ${this.defaultFont}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, canvas.width / 2, 30);

        const categories = data.categories || [];
        const values = data.series?.[0] || [];

        if (categories.length === 0 || values.length === 0) {
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxValue = Math.max(...values.map(v => parseFloat(v)));
        const barHeight = (chartHeight / categories.length) * 0.7;
        const spacing = (chartHeight / categories.length) * 0.3;

        // Draw bars
        values.forEach((value, index) => {
            const barWidth = (parseFloat(value) / maxValue) * chartWidth;
            const y = padding + (index * (chartHeight / categories.length)) + spacing / 2;
            const x = padding;

            ctx.fillStyle = index % 2 === 0 ? options.color : options.alternateColor;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Value label
            ctx.fillStyle = '#000000';
            ctx.font = `11px ${this.defaultFont}`;
            ctx.textAlign = 'left';
            ctx.fillText(value.toFixed(0), x + barWidth + 5, y + barHeight / 2 + 4);
        });

        // Y-axis labels
        ctx.fillStyle = '#666666';
        ctx.font = `11px ${this.defaultFont}`;
        ctx.textAlign = 'right';
        categories.forEach((cat, index) => {
            const y = padding + (index * (chartHeight / categories.length)) + (chartHeight / (categories.length * 2));
            ctx.fillText(String(cat).substring(0, 15), padding - 10, y + 4);
        });

        // Axes
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
    }

    // Scatter Chart Renderer
    renderScatterChart(ctx, data, options, canvas) {
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = `bold 16px ${this.defaultFont}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, canvas.width / 2, 30);

        const xValues = data.xValues || [];
        const yValues = data.yValues || [];

        if (xValues.length === 0 || yValues.length === 0) {
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxX = Math.max(...xValues.map(v => parseFloat(v)));
        const maxY = Math.max(...yValues.map(v => parseFloat(v)));
        const minX = Math.min(...xValues.map(v => parseFloat(v)));
        const minY = Math.min(...yValues.map(v => parseFloat(v)));

        // Draw grid
        if (options.showGrid) {
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 5; i++) {
                const y = padding + (chartHeight * i / 5);
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(padding + chartWidth, y);
                ctx.stroke();

                const x = padding + (chartWidth * i / 5);
                ctx.beginPath();
                ctx.moveTo(x, padding);
                ctx.lineTo(x, padding + chartHeight);
                ctx.stroke();
            }
        }

        // Draw points
        ctx.fillStyle = options.pointColor;
        xValues.forEach((xValue, index) => {
            if (index < yValues.length) {
                const x = padding + (((parseFloat(xValue) - minX) / (maxX - minX)) * chartWidth);
                const y = padding + chartHeight - (((parseFloat(yValues[index]) - minY) / (maxY - minY)) * chartHeight);

                ctx.beginPath();
                ctx.arc(x, y, options.pointSize, 0, 2 * Math.PI);
                ctx.fill();
            }
        });

        // Axes
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
    }

    // Donut Chart Renderer
    renderDonutChart(ctx, data, options, canvas) {
        const padding = 40;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const outerRadius = 120;
        const innerRadius = options.innerRadius || 60;

        // Background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = `bold 16px ${this.defaultFont}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(options.title, centerX, 30);

        const labels = data.labels || [];
        const values = data.values || [];

        if (labels.length === 0 || values.length === 0) {
            ctx.fillText('No data to display', centerX, centerY);
            return;
        }

        const total = values.reduce((sum, v) => sum + parseFloat(v), 0);
        let currentAngle = -Math.PI / 2;

        values.forEach((value, index) => {
            const sliceAngle = (parseFloat(value) / total) * 2 * Math.PI;

            // Draw donut slice
            ctx.fillStyle = options.colors[index % options.colors.length];
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
            ctx.lineTo(centerX + Math.cos(currentAngle + sliceAngle) * innerRadius, centerY + Math.sin(currentAngle + sliceAngle) * innerRadius);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            ctx.fill();

            // Draw border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw label
            if (options.showPercentage) {
                const labelAngle = currentAngle + sliceAngle / 2;
                const labelRadius = (outerRadius + innerRadius) / 2;
                const labelX = centerX + Math.cos(labelAngle) * labelRadius;
                const labelY = centerY + Math.sin(labelAngle) * labelRadius;

                const percentage = ((parseFloat(value) / total) * 100).toFixed(1);
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold 12px ${this.defaultFont}`;
                ctx.textAlign = 'center';
                ctx.fillText(percentage + '%', labelX, labelY);
            }

            currentAngle += sliceAngle;
        });

        // Draw center text
        if (options.centerText) {
            ctx.fillStyle = '#000000';
            ctx.font = `bold 14px ${this.defaultFont}`;
            ctx.textAlign = 'center';
            ctx.fillText(options.centerText, centerX, centerY);
        }

        // Draw legend
        if (options.showLegend) {
            const legendX = canvas.width - 180;
            const legendY = 80;

            labels.forEach((label, index) => {
                const y = legendY + index * 20;

                ctx.fillStyle = options.colors[index % options.colors.length];
                ctx.fillRect(legendX, y, 12, 12);

                ctx.fillStyle = '#000000';
                ctx.font = `11px ${this.defaultFont}`;
                ctx.textAlign = 'left';
                ctx.fillText(String(label).substring(0, 15), legendX + 18, y + 10);
            });
        }
    }
}





// ============================================================================
// ANATOMICAL SHAPES LIBRARY
// ============================================================================
class AnatomicalShapes {
  static drawHeart(ctx, x, y, width, height, chamber, state = 'neutral') {
    ctx.save();
    ctx.translate(x, y);
    
    const colors = {
      deoxygenated: { base: '#8B4789', light: '#A569A0', dark: '#6B3569' },
      oxygenated: { base: '#E74C3C', light: '#FF6B6B', dark: '#C0392B' },
      neutral: { base: '#E8B4B8', light: '#F5D7D9', dark: '#D19CA0' }
    };
    
    const color = colors[state] || colors.neutral;
    
    switch(chamber) {
      case 'rightAtrium':
        this.drawRightAtrium(ctx, color, width, height);
        break;
      case 'rightVentricle':
        this.drawRightVentricle(ctx, color, width, height);
        break;
      case 'leftAtrium':
        this.drawLeftAtrium(ctx, color, width, height);
        break;
      case 'leftVentricle':
        this.drawLeftVentricle(ctx, color, width, height);
        break;
      case 'wholeheart':
        this.drawWholeHeart(ctx, color, width, height);
        break;
    }
    
    ctx.restore();
  }

  static drawRightAtrium(ctx, color, width, height) {
    const w = width, h = height;
    
    // Create gradient for 3D effect
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    // Draw anatomically accurate right atrium shape
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.1);
    ctx.bezierCurveTo(w * 0.1, h * 0.05, w * 0.05, h * 0.15, w * 0.1, h * 0.3);
    ctx.bezierCurveTo(w * 0.15, h * 0.45, w * 0.25, h * 0.55, w * 0.4, h * 0.6);
    ctx.lineTo(w * 0.7, h * 0.6);
    ctx.bezierCurveTo(w * 0.85, h * 0.55, w * 0.95, h * 0.45, w * 0.9, h * 0.3);
    ctx.bezierCurveTo(w * 0.85, h * 0.15, w * 0.75, h * 0.05, w * 0.6, h * 0.1);
    ctx.closePath();
    ctx.fill();
    
    // Add highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(w * 0.35, h * 0.25, w * 0.15, h * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add texture lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for(let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * (0.2 + i * 0.1));
      ctx.lineTo(w * 0.7, h * (0.25 + i * 0.08));
      ctx.stroke();
    }
    
    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.1);
    ctx.bezierCurveTo(w * 0.1, h * 0.05, w * 0.05, h * 0.15, w * 0.1, h * 0.3);
    ctx.bezierCurveTo(w * 0.15, h * 0.45, w * 0.25, h * 0.55, w * 0.4, h * 0.6);
    ctx.lineTo(w * 0.7, h * 0.6);
    ctx.bezierCurveTo(w * 0.85, h * 0.55, w * 0.95, h * 0.45, w * 0.9, h * 0.3);
    ctx.bezierCurveTo(w * 0.85, h * 0.15, w * 0.75, h * 0.05, w * 0.6, h * 0.1);
    ctx.closePath();
    ctx.stroke();
  }

  static drawRightVentricle(ctx, color, width, height) {
    const w = width, h = height;
    
    const gradient = ctx.createRadialGradient(w * 0.4, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    // Anatomically accurate right ventricle (triangular/crescent shape)
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.1);
    ctx.bezierCurveTo(w * 0.15, h * 0.2, w * 0.1, h * 0.35, w * 0.15, h * 0.55);
    ctx.bezierCurveTo(w * 0.2, h * 0.75, w * 0.3, h * 0.9, w * 0.45, h * 0.95);
    ctx.bezierCurveTo(w * 0.55, h * 0.97, w * 0.65, h * 0.95, w * 0.7, h * 0.85);
    ctx.bezierCurveTo(w * 0.8, h * 0.65, w * 0.85, h * 0.45, w * 0.8, h * 0.25);
    ctx.bezierCurveTo(w * 0.75, h * 0.15, w * 0.65, h * 0.08, w * 0.5, h * 0.1);
    ctx.closePath();
    ctx.fill();
    
    // Muscle striations
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1.5;
    for(let i = 0; i < 8; i++) {
      ctx.beginPath();
      const startY = h * (0.2 + i * 0.1);
      ctx.moveTo(w * 0.25, startY);
      ctx.quadraticCurveTo(w * 0.45, startY + h * 0.05, w * 0.65, startY);
      ctx.stroke();
    }
    
    // Apex (pointed bottom)
    ctx.fillStyle = color.dark;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.85);
    ctx.lineTo(w * 0.45, h * 0.95);
    ctx.lineTo(w * 0.55, h * 0.85);
    ctx.fill();
    
    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.1);
    ctx.bezierCurveTo(w * 0.15, h * 0.2, w * 0.1, h * 0.35, w * 0.15, h * 0.55);
    ctx.bezierCurveTo(w * 0.2, h * 0.75, w * 0.3, h * 0.9, w * 0.45, h * 0.95);
    ctx.bezierCurveTo(w * 0.55, h * 0.97, w * 0.65, h * 0.95, w * 0.7, h * 0.85);
    ctx.bezierCurveTo(w * 0.8, h * 0.65, w * 0.85, h * 0.45, w * 0.8, h * 0.25);
    ctx.bezierCurveTo(w * 0.75, h * 0.15, w * 0.65, h * 0.08, w * 0.5, h * 0.1);
    ctx.closePath();
    ctx.stroke();
  }

  static drawLeftAtrium(ctx, color, width, height) {
    const w = width, h = height;
    
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    // Left atrium - similar to right but slightly smaller
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.15);
    ctx.bezierCurveTo(w * 0.15, h * 0.1, w * 0.08, h * 0.2, w * 0.12, h * 0.35);
    ctx.bezierCurveTo(w * 0.18, h * 0.48, w * 0.28, h * 0.58, w * 0.42, h * 0.62);
    ctx.lineTo(w * 0.68, h * 0.62);
    ctx.bezierCurveTo(w * 0.82, h * 0.58, w * 0.92, h * 0.48, w * 0.88, h * 0.35);
    ctx.bezierCurveTo(w * 0.84, h * 0.2, w * 0.75, h * 0.1, w * 0.62, h * 0.15);
    ctx.closePath();
    ctx.fill();
    
    // Pulmonary vein connections (4 openings)
    ctx.fillStyle = color.dark;
    const veinPositions = [[0.15, 0.25], [0.25, 0.18], [0.65, 0.18], [0.75, 0.25]];
    veinPositions.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.ellipse(w * px, h * py, w * 0.04, h * 0.03, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.ellipse(w * 0.4, h * 0.3, w * 0.12, h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.15);
    ctx.bezierCurveTo(w * 0.15, h * 0.1, w * 0.08, h * 0.2, w * 0.12, h * 0.35);
    ctx.bezierCurveTo(w * 0.18, h * 0.48, w * 0.28, h * 0.58, w * 0.42, h * 0.62);
    ctx.lineTo(w * 0.68, h * 0.62);
    ctx.bezierCurveTo(w * 0.82, h * 0.58, w * 0.92, h * 0.48, w * 0.88, h * 0.35);
    ctx.bezierCurveTo(w * 0.84, h * 0.2, w * 0.75, h * 0.1, w * 0.62, h * 0.15);
    ctx.closePath();
    ctx.stroke();
  }

  static drawLeftVentricle(ctx, color, width, height) {
    const w = width, h = height;
    
    const gradient = ctx.createRadialGradient(w * 0.45, h * 0.35, 0, w * 0.5, h * 0.5, w * 0.7);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.4, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    // Left ventricle - most muscular chamber (thicker walls)
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.08);
    ctx.bezierCurveTo(w * 0.2, h * 0.15, w * 0.12, h * 0.3, w * 0.15, h * 0.5);
    ctx.bezierCurveTo(w * 0.18, h * 0.68, w * 0.28, h * 0.85, w * 0.43, h * 0.95);
    ctx.lineTo(w * 0.57, h * 0.95);
    ctx.bezierCurveTo(w * 0.72, h * 0.85, w * 0.82, h * 0.68, w * 0.85, h * 0.5);
    ctx.bezierCurveTo(w * 0.88, h * 0.3, w * 0.8, h * 0.15, w * 0.65, h * 0.08);
    ctx.closePath();
    ctx.fill();
    
    // Thick myocardium (heart muscle) texture
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;
    for(let i = 0; i < 10; i++) {
      ctx.beginPath();
      const startY = h * (0.15 + i * 0.08);
      ctx.moveTo(w * 0.22, startY);
      ctx.quadraticCurveTo(w * 0.5, startY + h * 0.04, w * 0.78, startY);
      ctx.stroke();
    }
    
    // Papillary muscles (internal structures)
    ctx.fillStyle = color.dark;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.7);
    ctx.lineTo(w * 0.35, h * 0.85);
    ctx.lineTo(w * 0.4, h * 0.7);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(w * 0.6, h * 0.7);
    ctx.lineTo(w * 0.65, h * 0.85);
    ctx.lineTo(w * 0.7, h * 0.7);
    ctx.fill();
    
    // Apex
    ctx.fillStyle = color.dark;
    ctx.beginPath();
    ctx.moveTo(w * 0.43, h * 0.92);
    ctx.lineTo(w * 0.5, h * 0.98);
    ctx.lineTo(w * 0.57, h * 0.92);
    ctx.fill();
    
    // Strong outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.08);
    ctx.bezierCurveTo(w * 0.2, h * 0.15, w * 0.12, h * 0.3, w * 0.15, h * 0.5);
    ctx.bezierCurveTo(w * 0.18, h * 0.68, w * 0.28, h * 0.85, w * 0.43, h * 0.95);
    ctx.lineTo(w * 0.57, h * 0.95);
    ctx.bezierCurveTo(w * 0.72, h * 0.85, w * 0.82, h * 0.68, w * 0.85, h * 0.5);
    ctx.bezierCurveTo(w * 0.88, h * 0.3, w * 0.8, h * 0.15, w * 0.65, h * 0.08);
    ctx.closePath();
    ctx.stroke();
  }

  static drawWholeHeart(ctx, color, width, height) {
    const w = width, h = height;

    ctx.save();

    // Draw the classic heart shape outline
    const heartCenterX = w * 0.5;
    const heartCenterY = h * 0.4;
    
    // Create heart-shaped path
    ctx.beginPath();
    
    // Top left curve
    ctx.moveTo(heartCenterX, heartCenterY);
    ctx.bezierCurveTo(
        heartCenterX, heartCenterY - h * 0.3,
        heartCenterX - w * 0.4, heartCenterY - h * 0.3,
        heartCenterX - w * 0.4, heartCenterY
    );
    
    // Bottom left curve
    ctx.bezierCurveTo(
        heartCenterX - w * 0.4, heartCenterY + h * 0.15,
        heartCenterX - w * 0.25, heartCenterY + h * 0.3,
        heartCenterX, heartCenterY + h * 0.5
    );
    
    // Bottom right curve  
    ctx.bezierCurveTo(
        heartCenterX + w * 0.25, heartCenterY + h * 0.3,
        heartCenterX + w * 0.4, heartCenterY + h * 0.15,
        heartCenterX + w * 0.4, heartCenterY
    );
    
    // Top right curve
    ctx.bezierCurveTo(
        heartCenterX + w * 0.4, heartCenterY - h * 0.3,
        heartCenterX, heartCenterY - h * 0.3,
        heartCenterX, heartCenterY
    );
    
    ctx.closePath();

    // Fill with gradient
    const gradient = ctx.createLinearGradient(heartCenterX - w * 0.4, 0, heartCenterX + w * 0.4, h);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.5, '#E74C3C');
    gradient.addColorStop(1, '#C0392B');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Now draw chambers inside the heart shape
    // Right side (deoxygenated - purple)
    const rightColor = { base: '#8B4789', light: '#A569A0', dark: '#6B3569' };

    // Right atrium (top right)
    ctx.fillStyle = rightColor.base;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY - h * 0.15);
    ctx.bezierCurveTo(
        heartCenterX + w * 0.15, heartCenterY - h * 0.15,
        heartCenterX + w * 0.25, heartCenterY - h * 0.05,
        heartCenterX + w * 0.25, heartCenterY + h * 0.05
    );
    ctx.lineTo(heartCenterX, heartCenterY + h * 0.05);
    ctx.closePath();
    ctx.fill();

    // Right ventricle (bottom right)
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY + h * 0.05);
    ctx.lineTo(heartCenterX + w * 0.25, heartCenterY + h * 0.05);
    ctx.bezierCurveTo(
        heartCenterX + w * 0.25, heartCenterY + h * 0.2,
        heartCenterX + w * 0.15, heartCenterY + h * 0.35,
        heartCenterX, heartCenterY + h * 0.45
    );
    ctx.closePath();
    ctx.fill();

    // Left side (oxygenated - red)
    const leftColor = { base: '#E74C3C', light: '#FF6B6B', dark: '#C0392B' };

    // Left atrium (top left)
    ctx.fillStyle = leftColor.base;
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY - h * 0.15);
    ctx.bezierCurveTo(
        heartCenterX - w * 0.15, heartCenterY - h * 0.15,
        heartCenterX - w * 0.25, heartCenterY - h * 0.05,
        heartCenterX - w * 0.25, heartCenterY + h * 0.05
    );
    ctx.lineTo(heartCenterX, heartCenterY + h * 0.05);
    ctx.closePath();
    ctx.fill();

    // Left ventricle (bottom left)
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY + h * 0.05);
    ctx.lineTo(heartCenterX - w * 0.25, heartCenterY + h * 0.05);
    ctx.bezierCurveTo(
        heartCenterX - w * 0.25, heartCenterY + h * 0.2,
        heartCenterX - w * 0.15, heartCenterY + h * 0.35,
        heartCenterX, heartCenterY + h * 0.45
    );
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1.0;

    // Septum (dividing line)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY - h * 0.15);
    ctx.lineTo(heartCenterX, heartCenterY + h * 0.45);
    ctx.stroke();

    // Horizontal dividing line between atria and ventricles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(heartCenterX - w * 0.25, heartCenterY + h * 0.05);
    ctx.lineTo(heartCenterX + w * 0.25, heartCenterY + h * 0.05);
    ctx.stroke();

    // Main vessels at top
    // Aorta (left)
    ctx.strokeStyle = leftColor.base;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(heartCenterX - w * 0.1, heartCenterY - h * 0.2);
    ctx.lineTo(heartCenterX - w * 0.1, heartCenterY - h * 0.4);
    ctx.stroke();

    // Pulmonary artery (right)
    ctx.strokeStyle = rightColor.base;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(heartCenterX + w * 0.1, heartCenterY - h * 0.2);
    ctx.lineTo(heartCenterX + w * 0.1, heartCenterY - h * 0.4);
    ctx.stroke();

    // Vena cava
    ctx.strokeStyle = rightColor.dark;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(heartCenterX + w * 0.25, heartCenterY - h * 0.1);
    ctx.lineTo(heartCenterX + w * 0.35, heartCenterY - h * 0.25);
    ctx.stroke();

    // Pulmonary veins
    ctx.strokeStyle = leftColor.base;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(heartCenterX - w * 0.25, heartCenterY - h * 0.1);
    ctx.lineTo(heartCenterX - w * 0.35, heartCenterY - h * 0.25);
    ctx.stroke();

    // Heart outline (stronger)
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY);
    ctx.bezierCurveTo(
        heartCenterX, heartCenterY - h * 0.3,
        heartCenterX - w * 0.4, heartCenterY - h * 0.3,
        heartCenterX - w * 0.4, heartCenterY
    );
    ctx.bezierCurveTo(
        heartCenterX - w * 0.4, heartCenterY + h * 0.15,
        heartCenterX - w * 0.25, heartCenterY + h * 0.3,
        heartCenterX, heartCenterY + h * 0.5
    );
    ctx.bezierCurveTo(
        heartCenterX + w * 0.25, heartCenterY + h * 0.3,
        heartCenterX + w * 0.4, heartCenterY + h * 0.15,
        heartCenterX + w * 0.4, heartCenterY
    );
    ctx.bezierCurveTo(
        heartCenterX + w * 0.4, heartCenterY - h * 0.3,
        heartCenterX, heartCenterY - h * 0.3,
        heartCenterX, heartCenterY
    );
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawBloodVessel(ctx, x, y, width, height, type = 'artery', state = 'oxygenated') {
    ctx.save();
    ctx.translate(x, y);
    
    const colors = {
      artery_oxygenated: { base: '#E74C3C', light: '#FF6B6B', dark: '#C0392B' },
      artery_deoxygenated: { base: '#8B4789', light: '#A569A0', dark: '#6B3569' },
      vein_oxygenated: { base: '#C0392B', light: '#E74C3C', dark: '#A93226' },
      vein_deoxygenated: { base: '#6B3569', light: '#8B4789', dark: '#5B2D59' }
    };
    
    const colorKey = `${type}_${state}`;
    const color = colors[colorKey] || colors.artery_oxygenated;
    
    // Vessel walls
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color.dark);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    if(type === 'artery') {
      // Thicker walls for arteries
      ctx.fillRect(0, 0, width, height);
      
      // Muscular layers
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width * 0.1, 0);
      ctx.lineTo(width * 0.1, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(width * 0.9, 0);
      ctx.lineTo(width * 0.9, height);
      ctx.stroke();
    } else {
      // Thinner walls for veins
      ctx.fillRect(0, 0, width, height);
      
      // Valves
      const valveCount = Math.floor(height / 60);
      ctx.fillStyle = color.dark;
      for(let i = 0; i < valveCount; i++) {
        const y = (i + 1) * (height / (valveCount + 1));
        ctx.beginPath();
        ctx.moveTo(width * 0.2, y);
        ctx.lineTo(width * 0.5, y - 10);
        ctx.lineTo(width * 0.8, y);
        ctx.lineTo(width * 0.5, y + 5);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    // Lumen (inner space)
    ctx.fillStyle = color.light;
    ctx.fillRect(width * 0.25, height * 0.1, width * 0.5, height * 0.8);
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(width * 0.3, height * 0.15, width * 0.15, height * 0.7);
    
    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
    
    ctx.restore();
  }

  static drawBronchialTree(ctx, x, y, width, height, depth) {
    if (depth === 0 || height < 5) return; // Add height check to prevent issues

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height * 0.3);
    ctx.stroke();

    if (depth > 1) {
        const branchY = y + height * 0.3;

        // Left branch
        const leftX = x - width * 0.2;
        const leftY = branchY + height * 0.2;
        ctx.beginPath();
        ctx.moveTo(x, branchY);
        ctx.lineTo(leftX, leftY);
        ctx.stroke();
        this.drawBronchialTree(ctx, leftX, leftY, width * 0.6, height * 0.5, depth - 1);

        // Right branch
        const rightX = x + width * 0.2;
        const rightY = branchY + height * 0.2;
        ctx.beginPath();
        ctx.moveTo(x, branchY);
        ctx.lineTo(rightX, rightY);
        ctx.stroke();
        this.drawBronchialTree(ctx, rightX, rightY, width * 0.6, height * 0.5, depth - 1);
    }
}

  static drawLung(ctx, x, y, width, height, side = 'left') {
    ctx.save();
    ctx.translate(x, y);
    
    const color = { base: '#FFB6D9', light: '#FFD4E8', dark: '#FF8FB6' };
    
    const gradient = ctx.createRadialGradient(width * 0.4, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    if(side === 'left') {
      // Left lung - 2 lobes
      // Superior lobe
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height * 0.1);
      ctx.bezierCurveTo(width * 0.1, height * 0.15, width * 0.05, height * 0.25, width * 0.1, height * 0.4);
      ctx.lineTo(width * 0.8, height * 0.4);
      ctx.bezierCurveTo(width * 0.9, height * 0.3, width * 0.85, height * 0.15, width * 0.7, height * 0.1);
      ctx.closePath();
      ctx.fill();
      
      // Inferior lobe
      ctx.beginPath();
      ctx.moveTo(width * 0.1, height * 0.45);
      ctx.bezierCurveTo(width * 0.05, height * 0.6, width * 0.1, height * 0.8, width * 0.25, height * 0.9);
      ctx.bezierCurveTo(width * 0.4, height * 0.95, width * 0.6, height * 0.95, width * 0.75, height * 0.88);
      ctx.bezierCurveTo(width * 0.88, height * 0.75, width * 0.9, height * 0.6, width * 0.8, height * 0.45);
      ctx.closePath();
      ctx.fill();
    } else {
      // Right lung - 3 lobes
      // Superior lobe
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height * 0.08);
      ctx.bezierCurveTo(width * 0.1, height * 0.12, width * 0.05, height * 0.2, width * 0.1, height * 0.32);
      ctx.lineTo(width * 0.8, height * 0.32);
      ctx.bezierCurveTo(width * 0.9, height * 0.25, width * 0.85, height * 0.12, width * 0.7, height * 0.08);
      ctx.closePath();
      ctx.fill();
      
      // Middle lobe
      ctx.beginPath();
      ctx.moveTo(width * 0.1, height * 0.36);
      ctx.lineTo(width * 0.8, height * 0.36);
      ctx.lineTo(width * 0.85, height * 0.52);
      ctx.lineTo(width * 0.15, height * 0.52);
      ctx.closePath();
      ctx.fill();
      
      // Inferior lobe
      ctx.beginPath();
      ctx.moveTo(width * 0.15, height * 0.56);
      ctx.bezierCurveTo(width * 0.08, height * 0.68, width * 0.1, height * 0.82, width * 0.25, height * 0.92);
      ctx.bezierCurveTo(width * 0.42, height * 0.98, width * 0.62, height * 0.96, width * 0.77, height * 0.88);
      ctx.bezierCurveTo(width * 0.9, height * 0.75, width * 0.92, height * 0.62, width * 0.85, height * 0.56);
      ctx.closePath();
      ctx.fill();
    }
    
    // Bronchial tree
    ctx.strokeStyle = '#C44569';
    ctx.lineWidth = 3;
    this.drawBronchialTree(ctx, width * 0.45, height * 0.05, width * 0.4, height * 0.8, 3);
    
    // Alveoli texture (small circles)
    ctx.fillStyle = 'rgba(255, 182, 217, 0.5)';
    for(let i = 0; i < 20; i++) {
      const ax = width * (0.2 + Math.random() * 0.6);
      const ay = height * (0.2 + Math.random() * 0.7);
      ctx.beginPath();
      ctx.arc(ax, ay, 2 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    if(side === 'left') {
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height * 0.1);
      ctx.bezierCurveTo(width * 0.1, height * 0.15, width * 0.05, height * 0.25, width * 0.1, height * 0.4);
      ctx.bezierCurveTo(width * 0.05, height * 0.6, width * 0.1, height * 0.8, width * 0.25, height * 0.9);
      ctx.bezierCurveTo(width * 0.4, height * 0.95, width * 0.6, height * 0.95, width * 0.75, height * 0.88);
      ctx.bezierCurveTo(width * 0.88, height * 0.75, width * 0.9, height * 0.6, width * 0.8, height * 0.45);
      ctx.lineTo(width * 0.8, height * 0.4);
      ctx.bezierCurveTo(width * 0.9, height * 0.3, width * 0.85, height * 0.15, width * 0.7, height * 0.1);
      ctx.closePath();
      ctx.stroke();
    }
    
    ctx.restore();
  }

  


  static drawBrain(ctx, x, y, width, height, section = 'whole') {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#FFB8D1', light: '#FFD4E5', dark: '#FF9AB8' };
    const gray = { base: '#C8B8C8', light: '#E0D0E0', dark: '#A898A8' };

    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Main cerebrum shape
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.3);
    ctx.bezierCurveTo(width * 0.05, height * 0.15, width * 0.2, height * 0.05, width * 0.5, height * 0.08);
    ctx.bezierCurveTo(width * 0.8, height * 0.05, width * 0.95, height * 0.15, width * 0.85, height * 0.3);
    ctx.bezierCurveTo(width * 0.92, height * 0.5, width * 0.88, height * 0.7, width * 0.7, height * 0.85);
    ctx.bezierCurveTo(width * 0.55, height * 0.92, width * 0.45, height * 0.92, width * 0.3, height * 0.85);
    ctx.bezierCurveTo(width * 0.12, height * 0.7, width * 0.08, height * 0.5, width * 0.15, height * 0.3);
    ctx.closePath();
    ctx.fill();

    // Cerebral gyri (folds)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    
    // Left hemisphere gyri
    for(let i = 0; i < 6; i++) {
      ctx.beginPath();
      const startY = height * (0.2 + i * 0.1);
      ctx.moveTo(width * 0.15, startY);
      ctx.bezierCurveTo(
        width * (0.2 + Math.random() * 0.05), startY + height * 0.02,
        width * (0.3 + Math.random() * 0.05), startY - height * 0.02,
        width * 0.45, startY
      );
      ctx.stroke();
    }

    // Right hemisphere gyri
    for(let i = 0; i < 6; i++) {
      ctx.beginPath();
      const startY = height * (0.2 + i * 0.1);
      ctx.moveTo(width * 0.55, startY);
      ctx.bezierCurveTo(
        width * (0.65 + Math.random() * 0.05), startY - height * 0.02,
        width * (0.75 + Math.random() * 0.05), startY + height * 0.02,
        width * 0.85, startY
      );
      ctx.stroke();
    }

    // Longitudinal fissure (split between hemispheres)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.1);
    ctx.lineTo(width * 0.5, height * 0.7);
    ctx.stroke();

    // Cerebellum (back lower part)
    ctx.fillStyle = gray.base;
    ctx.beginPath();
    ctx.moveTo(width * 0.25, height * 0.75);
    ctx.bezierCurveTo(width * 0.2, height * 0.85, width * 0.3, height * 0.95, width * 0.5, height * 0.95);
    ctx.bezierCurveTo(width * 0.7, height * 0.95, width * 0.8, height * 0.85, width * 0.75, height * 0.75);
    ctx.closePath();
    ctx.fill();

    // Cerebellum folds
    ctx.strokeStyle = gray.dark;
    ctx.lineWidth = 1;
    for(let i = 0; i < 8; i++) {
      ctx.beginPath();
      const x1 = width * (0.3 + i * 0.05);
      ctx.moveTo(x1, height * 0.78);
      ctx.lineTo(x1, height * 0.92);
      ctx.stroke();
    }

    // Brain stem
    ctx.fillStyle = gray.light;
    ctx.fillRect(width * 0.45, height * 0.85, width * 0.1, height * 0.1);

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.3);
    ctx.bezierCurveTo(width * 0.05, height * 0.15, width * 0.2, height * 0.05, width * 0.5, height * 0.08);
    ctx.bezierCurveTo(width * 0.8, height * 0.05, width * 0.95, height * 0.15, width * 0.85, height * 0.3);
    ctx.bezierCurveTo(width * 0.92, height * 0.5, width * 0.88, height * 0.7, width * 0.7, height * 0.85);
    ctx.bezierCurveTo(width * 0.55, height * 0.92, width * 0.45, height * 0.92, width * 0.3, height * 0.85);
    ctx.bezierCurveTo(width * 0.12, height * 0.7, width * 0.08, height * 0.5, width * 0.15, height * 0.3);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }




  static drawLiver(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#8B4513', light: '#A0522D', dark: '#654321' };

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Liver shape (wedge-shaped with lobes)
    ctx.beginPath();
    // Right lobe (larger)
    ctx.moveTo(width * 0.4, height * 0.1);
    ctx.bezierCurveTo(width * 0.15, height * 0.15, width * 0.05, height * 0.3, width * 0.08, height * 0.6);
    ctx.bezierCurveTo(width * 0.12, height * 0.85, width * 0.25, height * 0.95, width * 0.45, height * 0.92);
    
    // Gallbladder notch
    ctx.lineTo(width * 0.52, height * 0.92);
    ctx.quadraticCurveTo(width * 0.54, height * 0.85, width * 0.56, height * 0.92);
    
    // Left lobe (smaller)
    ctx.lineTo(width * 0.7, height * 0.88);
    ctx.bezierCurveTo(width * 0.85, height * 0.82, width * 0.95, height * 0.65, width * 0.92, height * 0.45);
    ctx.bezierCurveTo(width * 0.88, height * 0.25, width * 0.75, height * 0.12, width * 0.55, height * 0.1);
    ctx.closePath();
    ctx.fill();

    // Lobules texture (hexagonal pattern)
    ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
    for(let row = 0; row < 6; row++) {
      for(let col = 0; col < 8; col++) {
        const lobX = width * (0.15 + col * 0.1);
        const lobY = height * (0.25 + row * 0.12);
        this.drawHexagon(ctx, lobX, lobY, 4);
      }
    }

    // Hepatic vessels
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.15);
    ctx.lineTo(width * 0.3, height * 0.4);
    ctx.moveTo(width * 0.5, height * 0.15);
    ctx.lineTo(width * 0.7, height * 0.4);
    ctx.moveTo(width * 0.5, height * 0.15);
    ctx.lineTo(width * 0.5, height * 0.5);
    ctx.stroke();

    // Gallbladder
    ctx.fillStyle = '#9ACD32';
    ctx.beginPath();
    ctx.ellipse(width * 0.54, height * 0.78, width * 0.04, height * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6B8E23';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Falciform ligament
    ctx.strokeStyle = '#D2B48C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.48, height * 0.08);
    ctx.lineTo(width * 0.5, height * 0.6);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.4, height * 0.1);
    ctx.bezierCurveTo(width * 0.15, height * 0.15, width * 0.05, height * 0.3, width * 0.08, height * 0.6);
    ctx.bezierCurveTo(width * 0.12, height * 0.85, width * 0.25, height * 0.95, width * 0.45, height * 0.92);
    ctx.lineTo(width * 0.52, height * 0.92);
    ctx.quadraticCurveTo(width * 0.54, height * 0.85, width * 0.56, height * 0.92);
    ctx.lineTo(width * 0.7, height * 0.88);
    ctx.bezierCurveTo(width * 0.85, height * 0.82, width * 0.95, height * 0.65, width * 0.92, height * 0.45);
    ctx.bezierCurveTo(width * 0.88, height * 0.25, width * 0.75, height * 0.12, width * 0.55, height * 0.1);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawHexagon(ctx, x, y, radius) {
    ctx.beginPath();
    for(let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + radius * Math.cos(angle);
      const hy = y + radius * Math.sin(angle);
      if(i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fill();
  }

  static drawKidney(ctx, x, y, width, height, side = 'left') {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#8B0000', light: '#A52A2A', dark: '#660000' };

    const gradient = ctx.createRadialGradient(width * 0.4, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Kidney bean shape
    ctx.beginPath();
    if(side === 'left') {
      ctx.moveTo(width * 0.3, height * 0.1);
      ctx.bezierCurveTo(width * 0.1, height * 0.15, width * 0.05, height * 0.35, width * 0.1, height * 0.55);
      ctx.bezierCurveTo(width * 0.15, height * 0.75, width * 0.25, height * 0.9, width * 0.45, height * 0.92);
      ctx.bezierCurveTo(width * 0.65, height * 0.94, width * 0.82, height * 0.85, width * 0.88, height * 0.65);
      ctx.bezierCurveTo(width * 0.92, height * 0.5, width * 0.88, height * 0.35, width * 0.75, height * 0.25);
      // Hilum (indented area)
      ctx.bezierCurveTo(width * 0.68, height * 0.3, width * 0.62, height * 0.4, width * 0.65, height * 0.5);
      ctx.bezierCurveTo(width * 0.68, height * 0.6, width * 0.72, height * 0.68, width * 0.78, height * 0.72);
      ctx.bezierCurveTo(width * 0.7, height * 0.78, width * 0.58, height * 0.8, width * 0.45, height * 0.78);
      ctx.bezierCurveTo(width * 0.55, height * 0.6, width * 0.58, height * 0.4, width * 0.55, height * 0.2);
      ctx.bezierCurveTo(width * 0.48, height * 0.12, width * 0.38, height * 0.08, width * 0.3, height * 0.1);
    } else {
      // Mirror for right kidney
      ctx.moveTo(width * 0.7, height * 0.1);
      ctx.bezierCurveTo(width * 0.9, height * 0.15, width * 0.95, height * 0.35, width * 0.9, height * 0.55);
      ctx.bezierCurveTo(width * 0.85, height * 0.75, width * 0.75, height * 0.9, width * 0.55, height * 0.92);
      ctx.bezierCurveTo(width * 0.35, height * 0.94, width * 0.18, height * 0.85, width * 0.12, height * 0.65);
      ctx.bezierCurveTo(width * 0.08, height * 0.5, width * 0.12, height * 0.35, width * 0.25, height * 0.25);
      ctx.bezierCurveTo(width * 0.32, height * 0.3, width * 0.38, height * 0.4, width * 0.35, height * 0.5);
      ctx.bezierCurveTo(width * 0.32, height * 0.6, width * 0.28, height * 0.68, width * 0.22, height * 0.72);
      ctx.bezierCurveTo(width * 0.3, height * 0.78, width * 0.42, height * 0.8, width * 0.55, height * 0.78);
      ctx.bezierCurveTo(width * 0.45, height * 0.6, width * 0.42, height * 0.4, width * 0.45, height * 0.2);
      ctx.bezierCurveTo(width * 0.52, height * 0.12, width * 0.62, height * 0.08, width * 0.7, height * 0.1);
    }
    ctx.closePath();
    ctx.fill();

    // Renal cortex (outer layer)
    ctx.strokeStyle = color.light;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Renal pyramids
    ctx.fillStyle = color.dark;
    const pyramidCount = 6;
    for(let i = 0; i < pyramidCount; i++) {
      const py = height * (0.2 + i * 0.12);
      const px = side === 'left' ? width * 0.35 : width * 0.65;
      ctx.beginPath();
      ctx.moveTo(px - 8, py);
      ctx.lineTo(px, py + 12);
      ctx.lineTo(px + 8, py);
      ctx.closePath();
      ctx.fill();
    }

    // Renal pelvis
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    const pelvisX = side === 'left' ? width * 0.68 : width * 0.32;
    ctx.ellipse(pelvisX, height * 0.5, width * 0.08, height * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ureter
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pelvisX, height * 0.65);
    ctx.lineTo(pelvisX, height * 0.95);
    ctx.stroke();

    // Renal artery and vein
    ctx.strokeStyle = '#E74C3C'; // Artery
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pelvisX, height * 0.45);
    ctx.lineTo(side === 'left' ? width * 0.95 : width * 0.05, height * 0.45);
    ctx.stroke();

    ctx.strokeStyle = '#8B4789'; // Vein
    ctx.beginPath();
    ctx.moveTo(pelvisX, height * 0.55);
    ctx.lineTo(side === 'left' ? width * 0.95 : width * 0.05, height * 0.55);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if(side === 'left') {
      ctx.moveTo(width * 0.3, height * 0.1);
      ctx.bezierCurveTo(width * 0.1, height * 0.15, width * 0.05, height * 0.35, width * 0.1, height * 0.55);
      ctx.bezierCurveTo(width * 0.15, height * 0.75, width * 0.25, height * 0.9, width * 0.45, height * 0.92);
      ctx.bezierCurveTo(width * 0.65, height * 0.94, width * 0.82, height * 0.85, width * 0.88, height * 0.65);
      ctx.bezierCurveTo(width * 0.92, height * 0.5, width * 0.88, height * 0.35, width * 0.75, height * 0.25);
    } else {
      ctx.moveTo(width * 0.7, height * 0.1);
      ctx.bezierCurveTo(width * 0.9, height * 0.15, width * 0.95, height * 0.35, width * 0.9, height * 0.55);
      ctx.bezierCurveTo(width * 0.85, height * 0.75, width * 0.75, height * 0.9, width * 0.55, height * 0.92);
      ctx.bezierCurveTo(width * 0.35, height * 0.94, width * 0.18, height * 0.85, width * 0.12, height * 0.65);
      ctx.bezierCurveTo(width * 0.08, height * 0.5, width * 0.12, height * 0.35, width * 0.25, height * 0.25);
    }
    ctx.stroke();

    ctx.restore();
  }

  static drawStomach(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#FFA07A', light: '#FFB89A', dark: '#FF8866' };

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // J-shaped stomach
    ctx.beginPath();
    // Fundus (top rounded part)
    ctx.moveTo(width * 0.4, height * 0.15);
    ctx.bezierCurveTo(width * 0.2, height * 0.1, width * 0.1, height * 0.2, width * 0.15, height * 0.35);
    
    // Greater curvature (left side)
    ctx.bezierCurveTo(width * 0.12, height * 0.5, width * 0.15, height * 0.65, width * 0.25, height * 0.78);
    ctx.bezierCurveTo(width * 0.35, height * 0.88, width * 0.5, height * 0.92, width * 0.65, height * 0.88);
    
    // Pylorus (outlet to small intestine)
    ctx.bezierCurveTo(width * 0.75, height * 0.85, width * 0.82, height * 0.78, width * 0.85, height * 0.68);
    
    // Lesser curvature (right side)
    ctx.bezierCurveTo(width * 0.88, height * 0.55, width * 0.85, height * 0.4, width * 0.78, height * 0.28);
    ctx.bezierCurveTo(width * 0.7, height * 0.18, width * 0.58, height * 0.13, width * 0.4, height * 0.15);
    ctx.closePath();
    ctx.fill();

    // Gastric rugae (folds)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    for(let i = 0; i < 5; i++) {
      ctx.beginPath();
      const startY = height * (0.3 + i * 0.12);
      ctx.moveTo(width * 0.25, startY);
      ctx.bezierCurveTo(
        width * 0.35, startY - height * 0.02,
        width * 0.45, startY + height * 0.02,
        width * 0.6, startY
      );
      ctx.stroke();
    }

    // Esophageal opening (cardia)
    ctx.fillStyle = color.dark;
    ctx.beginPath();
    ctx.ellipse(width * 0.45, height * 0.15, width * 0.05, height * 0.03, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Pyloric sphincter
    ctx.fillStyle = '#CD853F';
    ctx.beginPath();
    ctx.arc(width * 0.85, height * 0.68, width * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Mucosa texture
    ctx.fillStyle = 'rgba(255, 160, 122, 0.3)';
    for(let i = 0; i < 15; i++) {
      const dotX = width * (0.2 + Math.random() * 0.5);
      const dotY = height * (0.3 + Math.random() * 0.5);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.4, height * 0.15);
    ctx.bezierCurveTo(width * 0.2, height * 0.1, width * 0.1, height * 0.2, width * 0.15, height * 0.35);
    ctx.bezierCurveTo(width * 0.12, height * 0.5, width * 0.15, height * 0.65, width * 0.25, height * 0.78);
    ctx.bezierCurveTo(width * 0.35, height * 0.88, width * 0.5, height * 0.92, width * 0.65, height * 0.88);
    ctx.bezierCurveTo(width * 0.75, height * 0.85, width * 0.82, height * 0.78, width * 0.85, height * 0.68);
    ctx.bezierCurveTo(width * 0.88, height * 0.55, width * 0.85, height * 0.4, width * 0.78, height * 0.28);
    ctx.bezierCurveTo(width * 0.7, height * 0.18, width * 0.58, height * 0.13, width * 0.4, height * 0.15);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawIntestine(ctx, x, y, width, height, type = 'small') {
    ctx.save();
    ctx.translate(x, y);

    const smallColor = { base: '#FFB6C1', light: '#FFC8D3', dark: '#FFA4B0' };
    const largeColor = { base: '#E6A8B8', light: '#F0BAC8', dark: '#DC96A8' };
    const color = type === 'small' ? smallColor : largeColor;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    if(type === 'small') {
      // Small intestine - coiled/folded appearance
      const coils = 6;
      const coilHeight = height / (coils + 1);
      
      ctx.fillStyle = gradient;
      ctx.strokeStyle = color.dark;
      ctx.lineWidth = 2;

      for(let i = 0; i < coils; i++) {
        const yPos = (i + 1) * coilHeight;
        const direction = i % 2 === 0 ? 1 : -1;
        
        ctx.beginPath();
        ctx.moveTo(width * 0.1, yPos);
        ctx.bezierCurveTo(
          width * (0.3 * direction + 0.5), yPos - coilHeight * 0.4,
          width * (0.3 * direction + 0.5), yPos + coilHeight * 0.4,
          width * 0.9, yPos + coilHeight * 0.2
        );
        ctx.lineWidth = width * 0.08;
        ctx.strokeStyle = color.base;
        ctx.stroke();
        
        // Villi (small projections)
        ctx.lineWidth = 1;
        ctx.strokeStyle = color.dark;
        for(let v = 0; v < 20; v++) {
          const vx = width * (0.2 + Math.random() * 0.6);
          const vy = yPos + (Math.random() - 0.5) * coilHeight * 0.8;
          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(vx + 2, vy - 3);
          ctx.stroke();
        }
      }

      // Duodenum curve
      ctx.beginPath();
      ctx.strokeStyle = color.base;
      ctx.lineWidth = width * 0.09;
      ctx.moveTo(width * 0.5, 0);
      ctx.bezierCurveTo(width * 0.8, height * 0.05, width * 0.9, height * 0.15, width * 0.85, height * 0.25);
      ctx.stroke();

    } else {
      // Large intestine - frame shape (ascending, transverse, descending, sigmoid colon)
      ctx.fillStyle = color.base;
      ctx.strokeStyle = color.dark;
      ctx.lineWidth = width * 0.12;

      // Ascending colon (right side going up)
      ctx.beginPath();
      ctx.moveTo(width * 0.85, height * 0.9);
      ctx.lineTo(width * 0.85, height * 0.2);
      ctx.stroke();

      // Transverse colon (across top)
      ctx.beginPath();
      ctx.moveTo(width * 0.85, height * 0.2);
      ctx.lineTo(width * 0.15, height * 0.2);
      ctx.stroke();

      // Descending colon (left side going down)
      ctx.beginPath();
      ctx.moveTo(width * 0.15, height * 0.2);
      ctx.lineTo(width * 0.15, height * 0.65);
      ctx.stroke();

      // Sigmoid colon (S-shaped)
      ctx.beginPath();
      ctx.moveTo(width * 0.15, height * 0.65);
      ctx.bezierCurveTo(
        width * 0.2, height * 0.75,
        width * 0.3, height * 0.8,
        width * 0.4, height * 0.85
      );
      ctx.bezierCurveTo(
        width * 0.5, height * 0.9,
        width * 0.6, height * 0.92,
        width * 0.7, height * 0.88
      );
      ctx.stroke();

      // Haustra (pouches) - characteristic of large intestine
      const haustraCount = 8;
      ctx.lineWidth = 2;
      ctx.strokeStyle = color.dark;
      
      // Haustra on ascending colon
      for(let i = 0; i < 4; i++) {
        const hy = height * (0.3 + i * 0.15);
        ctx.beginPath();
        ctx.arc(width * 0.85, hy, width * 0.05, Math.PI * 0.5, Math.PI * 1.5);
        ctx.stroke();
      }

      // Haustra on transverse colon
      for(let i = 0; i < 4; i++) {
        const hx = width * (0.75 - i * 0.15);
        ctx.beginPath();
        ctx.arc(hx, height * 0.2, width * 0.05, 0, Math.PI);
        ctx.stroke();
      }

      // Haustra on descending colon
      for(let i = 0; i < 3; i++) {
        const hy = height * (0.3 + i * 0.15);
        ctx.beginPath();
        ctx.arc(width * 0.15, hy, width * 0.05, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.stroke();
      }

      // Cecum (beginning of large intestine)
      ctx.fillStyle = color.light;
      ctx.beginPath();
      ctx.ellipse(width * 0.85, height * 0.85, width * 0.08, height * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Appendix
      ctx.strokeStyle = color.base;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(width * 0.82, height * 0.92);
      ctx.lineTo(width * 0.78, height * 0.98);
      ctx.stroke();

      // Rectum
      ctx.lineWidth = width * 0.1;
      ctx.strokeStyle = color.base;
      ctx.beginPath();
      ctx.moveTo(width * 0.7, height * 0.88);
      ctx.lineTo(width * 0.65, height * 0.98);
      ctx.stroke();
    }

    ctx.restore();
  }

  static drawPancreas(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#FFDAB9', light: '#FFE4C4', dark: '#F4C2A0' };

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Pancreas shape (elongated with head, body, tail)
    ctx.beginPath();
    // Head (right, widest part)
    ctx.moveTo(width * 0.85, height * 0.35);
    ctx.bezierCurveTo(width * 0.95, height * 0.3, width * 0.98, height * 0.4, width * 0.95, height * 0.55);
    ctx.bezierCurveTo(width * 0.92, height * 0.68, width * 0.85, height * 0.75, width * 0.75, height * 0.72);
    
    // Body (middle)
    ctx.bezierCurveTo(width * 0.6, height * 0.7, width * 0.45, height * 0.65, width * 0.3, height * 0.58);
    
    // Tail (left, pointed)
    ctx.bezierCurveTo(width * 0.15, height * 0.52, width * 0.05, height * 0.45, width * 0.02, height * 0.38);
    ctx.bezierCurveTo(width * 0.0, height * 0.32, width * 0.02, height * 0.28, width * 0.08, height * 0.3);
    
    // Top curve back
    ctx.bezierCurveTo(width * 0.25, height * 0.35, width * 0.45, height * 0.32, width * 0.65, height * 0.3);
    ctx.bezierCurveTo(width * 0.75, height * 0.28, width * 0.82, height * 0.3, width * 0.85, height * 0.35);
    ctx.closePath();
    ctx.fill();

    // Lobules (grape-like clusters)
    ctx.fillStyle = color.dark;
    const lobuleCount = 12;
    for(let i = 0; i < lobuleCount; i++) {
      const lx = width * (0.15 + i * 0.06);
      const ly = height * (0.4 + (Math.random() - 0.5) * 0.15);
      ctx.beginPath();
      ctx.arc(lx, ly, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pancreatic duct (Wirsung duct)
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.88, height * 0.5);
    ctx.bezierCurveTo(width * 0.65, height * 0.48, width * 0.4, height * 0.45, width * 0.15, height * 0.4);
    ctx.stroke();

    // Islets of Langerhans (hormone-producing cells)
    ctx.fillStyle = '#FFE4B5';
    const isletCount = 8;
    for(let i = 0; i < isletCount; i++) {
      const ix = width * (0.2 + Math.random() * 0.6);
      const iy = height * (0.35 + Math.random() * 0.3);
      ctx.beginPath();
      ctx.arc(ix, iy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.85, height * 0.35);
    ctx.bezierCurveTo(width * 0.95, height * 0.3, width * 0.98, height * 0.4, width * 0.95, height * 0.55);
    ctx.bezierCurveTo(width * 0.92, height * 0.68, width * 0.85, height * 0.75, width * 0.75, height * 0.72);
    ctx.bezierCurveTo(width * 0.6, height * 0.7, width * 0.45, height * 0.65, width * 0.3, height * 0.58);
    ctx.bezierCurveTo(width * 0.15, height * 0.52, width * 0.05, height * 0.45, width * 0.02, height * 0.38);
    ctx.bezierCurveTo(width * 0.0, height * 0.32, width * 0.02, height * 0.28, width * 0.08, height * 0.3);
    ctx.bezierCurveTo(width * 0.25, height * 0.35, width * 0.45, height * 0.32, width * 0.65, height * 0.3);
    ctx.bezierCurveTo(width * 0.75, height * 0.28, width * 0.82, height * 0.3, width * 0.85, height * 0.35);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawSpleen(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#800080', light: '#9370DB', dark: '#4B0082' };

    const gradient = ctx.createRadialGradient(width * 0.4, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Spleen shape (oval/football-shaped)
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.15);
    ctx.bezierCurveTo(width * 0.15, height * 0.2, width * 0.08, height * 0.35, width * 0.12, height * 0.55);
    ctx.bezierCurveTo(width * 0.16, height * 0.75, width * 0.28, height * 0.9, width * 0.45, height * 0.92);
    ctx.bezierCurveTo(width * 0.62, height * 0.94, width * 0.78, height * 0.82, width * 0.85, height * 0.65);
    ctx.bezierCurveTo(width * 0.92, height * 0.48, width * 0.88, height * 0.28, width * 0.75, height * 0.18);
    ctx.bezierCurveTo(width * 0.62, height * 0.08, width * 0.45, height * 0.1, width * 0.3, height * 0.15);
    ctx.closePath();
    ctx.fill();

    // Hilum (indentation where vessels enter)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.35, height * 0.4);
    ctx.bezierCurveTo(width * 0.4, height * 0.45, width * 0.4, height * 0.55, width * 0.35, height * 0.6);
    ctx.stroke();

    // Splenic pulp texture (red and white pulp)
    ctx.fillStyle = 'rgba(147, 112, 219, 0.4)'; // White pulp
    for(let i = 0; i < 15; i++) {
      const px = width * (0.2 + Math.random() * 0.5);
      const py = height * (0.2 + Math.random() * 0.6);
      ctx.beginPath();
      ctx.arc(px, py, 2 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Splenic artery
    ctx.strokeStyle = '#E74C3C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.95, height * 0.45);
    ctx.bezierCurveTo(width * 0.7, height * 0.42, width * 0.5, height * 0.45, width * 0.38, height * 0.48);
    ctx.stroke();

    // Splenic vein
    ctx.strokeStyle = '#8B4789';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.38, height * 0.52);
    ctx.bezierCurveTo(width * 0.5, height * 0.55, width * 0.7, height * 0.58, width * 0.95, height * 0.55);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.15);
    ctx.bezierCurveTo(width * 0.15, height * 0.2, width * 0.08, height * 0.35, width * 0.12, height * 0.55);
    ctx.bezierCurveTo(width * 0.16, height * 0.75, width * 0.28, height * 0.9, width * 0.45, height * 0.92);
    ctx.bezierCurveTo(width * 0.62, height * 0.94, width * 0.78, height * 0.82, width * 0.85, height * 0.65);
    ctx.bezierCurveTo(width * 0.92, height * 0.48, width * 0.88, height * 0.28, width * 0.75, height * 0.18);
    ctx.bezierCurveTo(width * 0.62, height * 0.08, width * 0.45, height * 0.1, width * 0.3, height * 0.15);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawBladder(ctx, x, y, width, height, fillLevel = 0.5) {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#FFD700', light: '#FFED4E', dark: '#D4AF37' };

    // Bladder wall
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Bladder shape (balloon-like when full)
    const fullness = 0.3 + fillLevel * 0.6; // Scale from 0.3 to 0.9
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.1);
    ctx.bezierCurveTo(
      width * (0.2 - fullness * 0.1), height * 0.15,
      width * (0.1 - fullness * 0.05), height * 0.4,
      width * 0.15, height * 0.65
    );
    ctx.bezierCurveTo(width * 0.2, height * 0.85, width * 0.35, height * 0.92, width * 0.5, height * 0.9);
    ctx.bezierCurveTo(width * 0.65, height * 0.92, width * 0.8, height * 0.85, width * 0.85, height * 0.65);
    ctx.bezierCurveTo(
      width * (0.9 + fullness * 0.05), height * 0.4,
      width * (0.8 + fullness * 0.1), height * 0.15,
      width * 0.5, height * 0.1
    );
    ctx.closePath();
    ctx.fill();

    // Urine (if present)
    if(fillLevel > 0.1) {
      ctx.fillStyle = 'rgba(255, 255, 150, 0.6)';
      ctx.beginPath();
      const urineTop = height * (0.9 - fillLevel * 0.7);
      ctx.moveTo(width * 0.2, urineTop);
      ctx.lineTo(width * 0.8, urineTop);
      ctx.bezierCurveTo(width * 0.8, height * 0.85, width * 0.65, height * 0.92, width * 0.5, height * 0.9);
      ctx.bezierCurveTo(width * 0.35, height * 0.92, width * 0.2, height * 0.85, width * 0.2, urineTop);
      ctx.closePath();
      ctx.fill();
    }

    // Detrusor muscle (bladder wall texture)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1.5;
    for(let i = 0; i < 8; i++) {
      ctx.beginPath();
      const angle = (i * Math.PI) / 4;
      const x1 = width * 0.5 + Math.cos(angle) * width * 0.15;
      const y1 = height * 0.5 + Math.sin(angle) * height * 0.2;
      const x2 = width * 0.5 + Math.cos(angle) * width * 0.35;
      const y2 = height * 0.5 + Math.sin(angle) * height * 0.35;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Ureters (tubes from kidneys)
    ctx.strokeStyle = color.base;
    ctx.lineWidth = 3;
    // Left ureter
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.05);
    ctx.bezierCurveTo(width * 0.28, height * 0.08, width * 0.32, height * 0.12, width * 0.35, height * 0.15);
    ctx.stroke();
    // Right ureter
    ctx.beginPath();
    ctx.moveTo(width * 0.7, height * 0.05);
    ctx.bezierCurveTo(width * 0.72, height * 0.08, width * 0.68, height * 0.12, width * 0.65, height * 0.15);
    ctx.stroke();

    // Urethra (tube to outside)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.9);
    ctx.lineTo(width * 0.5, height * 0.98);
    ctx.stroke();

    // Trigone (triangular area at base)
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.35, height * 0.75);
    ctx.lineTo(width * 0.65, height * 0.75);
    ctx.lineTo(width * 0.5, height * 0.85);
    ctx.closePath();
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.1);
    ctx.bezierCurveTo(
      width * (0.2 - fullness * 0.1), height * 0.15,
      width * (0.1 - fullness * 0.05), height * 0.4,
      width * 0.15, height * 0.65
    );
    ctx.bezierCurveTo(width * 0.2, height * 0.85, width * 0.35, height * 0.92, width * 0.5, height * 0.9);
    ctx.bezierCurveTo(width * 0.65, height * 0.92, width * 0.8, height * 0.85, width * 0.85, height * 0.65);
    ctx.bezierCurveTo(
      width * (0.9 + fullness * 0.05), height * 0.4,
      width * (0.8 + fullness * 0.1), height * 0.15,
      width * 0.5, height * 0.1
    );
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawEye(ctx, x, y, width, height, pupilDilation = 0.3) {
    ctx.save();
    ctx.translate(x, y);

    // Sclera (white of eye)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.5, width * 0.45, height * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blood vessels
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
    ctx.lineWidth = 0.5;
    for(let i = 0; i < 8; i++) {
      ctx.beginPath();
      const angle = (i * Math.PI) / 4;
      const startX = width * 0.5 + Math.cos(angle) * width * 0.25;
      const startY = height * 0.5 + Math.sin(angle) * height * 0.2;
      const endX = width * 0.5 + Math.cos(angle) * width * 0.42;
      const endY = height * 0.5 + Math.sin(angle) * height * 0.38;
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(
        startX + Math.random() * 10 - 5,
        startY + Math.random() * 10 - 5,
        endX,
        endY
      );
      ctx.stroke();
    }

    // Iris
    const irisGradient = ctx.createRadialGradient(
      width * 0.5, height * 0.5, 0,
      width * 0.5, height * 0.5, width * 0.25
    );
    irisGradient.addColorStop(0, '#8B7355');
    irisGradient.addColorStop(0.3, '#A0826D');
    irisGradient.addColorStop(0.7, '#654321');
    irisGradient.addColorStop(1, '#3E2723');
    ctx.fillStyle = irisGradient;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Iris texture (radial lines)
    ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
    ctx.lineWidth = 1;
    for(let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8;
      ctx.beginPath();
      ctx.moveTo(
        width * 0.5 + Math.cos(angle) * width * 0.08,
        height * 0.5 + Math.sin(angle) * height * 0.08
      );
      ctx.lineTo(
        width * 0.5 + Math.cos(angle) * width * 0.24,
        height * 0.5 + Math.sin(angle) * height * 0.24
      );
      ctx.stroke();
    }

    // Pupil
    const pupilSize = width * (0.08 + pupilDilation * 0.12);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, pupilSize, 0, Math.PI * 2);
    ctx.fill();

    // Reflection/highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(width * 0.55, height * 0.45, width * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.42, height * 0.48, width * 0.02, 0, Math.PI * 2);
    ctx.fill();

    // Cornea outline
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.27, 0, Math.PI * 2);
    ctx.stroke();

    // Sclera outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.5, width * 0.45, height * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  static drawSkeleton(ctx, x, y, width, height, bone = 'skull') {
    ctx.save();
    ctx.translate(x, y);

    const boneColor = { base: '#F5F5DC', light: '#FFFAF0', dark: '#D3D3C0' };

    switch(bone) {
      case 'skull':
        this.drawSkull(ctx, boneColor, width, height);
        break;
      case 'femur':
        this.drawFemur(ctx, boneColor, width, height);
        break;
      case 'ribcage':
        this.drawRibcage(ctx, boneColor, width, height);
        break;
      case 'spine':
        this.drawSpine(ctx, boneColor, width, height);
        break;
    }

    ctx.restore();
  }

  static drawSkull(ctx, color, width, height) {
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.3, 0, width * 0.5, height * 0.4, width * 0.5);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.6, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Cranium (brain case)
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.35);
    ctx.bezierCurveTo(width * 0.15, height * 0.25, width * 0.1, height * 0.15, width * 0.2, height * 0.08);
    ctx.bezierCurveTo(width * 0.35, height * 0.02, width * 0.65, height * 0.02, width * 0.8, height * 0.08);
    ctx.bezierCurveTo(width * 0.9, height * 0.15, width * 0.85, height * 0.25, width * 0.7, height * 0.35);
    ctx.closePath();
    ctx.fill();

    // Face
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.35);
    ctx.lineTo(width * 0.28, height * 0.55);
    ctx.lineTo(width * 0.35, height * 0.68);
    ctx.lineTo(width * 0.65, height * 0.68);
    ctx.lineTo(width * 0.72, height * 0.55);
    ctx.lineTo(width * 0.7, height * 0.35);
    ctx.closePath();
    ctx.fill();

    // Eye sockets
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(width * 0.35, height * 0.42, width * 0.08, height * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width * 0.65, height * 0.42, width * 0.08, height * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nasal cavity
    ctx.beginPath();
    ctx.moveTo(width * 0.45, height * 0.52);
    ctx.lineTo(width * 0.42, height * 0.62);
    ctx.lineTo(width * 0.5, height * 0.64);
    ctx.lineTo(width * 0.58, height * 0.62);
    ctx.lineTo(width * 0.55, height * 0.52);
    ctx.closePath();
    ctx.fill();

    // Teeth (upper jaw)
    ctx.fillStyle = color.light;
    for(let i = 0; i < 8; i++) {
      const tx = width * (0.38 + i * 0.03);
      ctx.fillRect(tx, height * 0.68, width * 0.025, height * 0.05);
    }

    // Mandible (lower jaw)
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(width * 0.35, height * 0.68);
    ctx.lineTo(width * 0.28, height * 0.75);
    ctx.bezierCurveTo(width * 0.25, height * 0.85, width * 0.35, height * 0.92, width * 0.5, height * 0.94);
    ctx.bezierCurveTo(width * 0.65, height * 0.92, width * 0.75, height * 0.85, width * 0.72, height * 0.75);
    ctx.lineTo(width * 0.65, height * 0.68);
    ctx.closePath();
    ctx.fill();

    // Lower teeth
    ctx.fillStyle = color.light;
    for(let i = 0; i < 8; i++) {
      const tx = width * (0.38 + i * 0.03);
      ctx.fillRect(tx, height * 0.73, width * 0.025, height * 0.04);
    }
    // Cranial sutures (skull joints)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 1.5;
    // Sagittal suture
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.05);
    ctx.bezierCurveTo(width * 0.5, height * 0.15, width * 0.5, height * 0.25, width * 0.5, height * 0.35);
    ctx.stroke();
    // Coronal suture
    ctx.beginPath();
    ctx.moveTo(width * 0.22, height * 0.15);
    ctx.bezierCurveTo(width * 0.35, height * 0.12, width * 0.65, height * 0.12, width * 0.78, height * 0.15);
    ctx.stroke();

    // Temporal bone features
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.4, width * 0.04, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.4, width * 0.04, 0, Math.PI * 2);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.35);
    ctx.bezierCurveTo(width * 0.15, height * 0.25, width * 0.1, height * 0.15, width * 0.2, height * 0.08);
    ctx.bezierCurveTo(width * 0.35, height * 0.02, width * 0.65, height * 0.02, width * 0.8, height * 0.08);
    ctx.bezierCurveTo(width * 0.9, height * 0.15, width * 0.85, height * 0.25, width * 0.7, height * 0.35);
    ctx.stroke();
  }

  static drawFemur(ctx, color, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Femoral head (ball joint at hip)
    ctx.beginPath();
    ctx.arc(width * 0.3, height * 0.15, width * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Greater trochanter (bump on outside)
    ctx.beginPath();
    ctx.arc(width * 0.55, height * 0.18, width * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.beginPath();
    ctx.moveTo(width * 0.4, height * 0.2);
    ctx.lineTo(width * 0.48, height * 0.28);
    ctx.lineTo(width * 0.52, height * 0.28);
    ctx.lineTo(width * 0.43, height * 0.15);
    ctx.closePath();
    ctx.fill();

    // Shaft (main body of femur)
    ctx.beginPath();
    ctx.moveTo(width * 0.48, height * 0.28);
    ctx.lineTo(width * 0.45, height * 0.75);
    ctx.lineTo(width * 0.55, height * 0.75);
    ctx.lineTo(width * 0.52, height * 0.28);
    ctx.closePath();
    ctx.fill();

    // Medullary cavity (marrow cavity - hollow center)
    ctx.fillStyle = '#FFE4C4';
    ctx.beginPath();
    ctx.moveTo(width * 0.49, height * 0.35);
    ctx.lineTo(width * 0.47, height * 0.7);
    ctx.lineTo(width * 0.53, height * 0.7);
    ctx.lineTo(width * 0.51, height * 0.35);
    ctx.closePath();
    ctx.fill();

    // Lateral condyle (outer knuckle)
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(width * 0.4, height * 0.88, width * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Medial condyle (inner knuckle)
    ctx.beginPath();
    ctx.arc(width * 0.6, height * 0.88, width * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Intercondylar notch (groove between condyles)
    ctx.fillStyle = color.dark;
    ctx.beginPath();
    ctx.moveTo(width * 0.48, height * 0.82);
    ctx.lineTo(width * 0.46, height * 0.92);
    ctx.lineTo(width * 0.54, height * 0.92);
    ctx.lineTo(width * 0.52, height * 0.82);
    ctx.closePath();
    ctx.fill();

    // Linea aspera (ridge on back of shaft)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.32);
    ctx.lineTo(width * 0.5, height * 0.72);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(width * 0.3, height * 0.15, width * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width * 0.55, height * 0.18, width * 0.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width * 0.4, height * 0.88, width * 0.12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width * 0.6, height * 0.88, width * 0.12, 0, Math.PI * 2);
    ctx.stroke();
  }

  static drawRibcage(ctx, color, width, height) {
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.3, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Sternum (breastbone)
    ctx.beginPath();
    ctx.moveTo(width * 0.48, height * 0.05);
    ctx.lineTo(width * 0.46, height * 0.55);
    ctx.lineTo(width * 0.54, height * 0.55);
    ctx.lineTo(width * 0.52, height * 0.05);
    ctx.closePath();
    ctx.fill();

    // Manubrium (top of sternum)
    ctx.beginPath();
    ctx.moveTo(width * 0.44, height * 0.05);
    ctx.lineTo(width * 0.42, height * 0.12);
    ctx.lineTo(width * 0.58, height * 0.12);
    ctx.lineTo(width * 0.56, height * 0.05);
    ctx.closePath();
    ctx.fill();

    // Xiphoid process (bottom of sternum)
    ctx.beginPath();
    ctx.moveTo(width * 0.48, height * 0.55);
    ctx.lineTo(width * 0.5, height * 0.62);
    ctx.lineTo(width * 0.52, height * 0.55);
    ctx.closePath();
    ctx.fill();

    // Ribs (12 pairs)
    ctx.strokeStyle = color.base;
    ctx.lineWidth = 3;
    ctx.fillStyle = gradient;

    const ribCount = 12;
    for(let i = 0; i < ribCount; i++) {
      const startY = height * (0.08 + i * 0.042);
      const ribWidth = width * (0.35 + (i < 7 ? i * 0.05 : (11 - i) * 0.03));
      const ribHeight = height * (0.08 + i * 0.01);

      // Right rib
      ctx.beginPath();
      ctx.moveTo(width * 0.52, startY);
      ctx.bezierCurveTo(
        width * (0.52 + ribWidth * 0.3), startY,
        width * (0.52 + ribWidth * 0.7), startY + ribHeight * 0.5,
        width * (0.52 + ribWidth), startY + ribHeight
      );
      if(i < 10) {
        // True and false ribs attach to sternum
        ctx.bezierCurveTo(
          width * (0.52 + ribWidth * 0.7), startY + ribHeight * 1.2,
          width * (0.52 + ribWidth * 0.3), startY + ribHeight * 0.8,
          width * 0.52, startY + ribHeight * 0.6
        );
      }
      ctx.stroke();

      // Left rib
      ctx.beginPath();
      ctx.moveTo(width * 0.48, startY);
      ctx.bezierCurveTo(
        width * (0.48 - ribWidth * 0.3), startY,
        width * (0.48 - ribWidth * 0.7), startY + ribHeight * 0.5,
        width * (0.48 - ribWidth), startY + ribHeight
      );
      if(i < 10) {
        ctx.bezierCurveTo(
          width * (0.48 - ribWidth * 0.7), startY + ribHeight * 1.2,
          width * (0.48 - ribWidth * 0.3), startY + ribHeight * 0.8,
          width * 0.48, startY + ribHeight * 0.6
        );
      }
      ctx.stroke();
    }

    // Costal cartilage (softer connection to sternum)
    ctx.strokeStyle = '#B0C4DE';
    ctx.lineWidth = 2;
    for(let i = 0; i < 7; i++) {
      const startY = height * (0.08 + i * 0.042);
      const cartY = startY + height * (0.05 + i * 0.008);
      ctx.beginPath();
      ctx.moveTo(width * 0.52, startY);
      ctx.lineTo(width * 0.65, cartY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(width * 0.48, startY);
      ctx.lineTo(width * 0.35, cartY);
      ctx.stroke();
    }

    // Sternum outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.44, height * 0.05);
    ctx.lineTo(width * 0.42, height * 0.12);
    ctx.lineTo(width * 0.46, height * 0.55);
    ctx.lineTo(width * 0.5, height * 0.62);
    ctx.lineTo(width * 0.54, height * 0.55);
    ctx.lineTo(width * 0.58, height * 0.12);
    ctx.lineTo(width * 0.56, height * 0.05);
    ctx.closePath();
    ctx.stroke();
  }

  static drawSpine(ctx, color, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    // Vertebrae (33 bones, draw representative sections)
    const vertebraCount = 24; // Draw 24 vertebrae
    const vertebraHeight = height / vertebraCount;

    for(let i = 0; i < vertebraCount; i++) {
      const y = i * vertebraHeight;
      const size = width * (0.15 - Math.abs(i - 12) * 0.002); // Vary size

      ctx.fillStyle = gradient;

      // Vertebral body (anterior/front)
      ctx.beginPath();
      ctx.roundRect(width * 0.35, y + vertebraHeight * 0.2, width * 0.3, vertebraHeight * 0.6, 2);
      ctx.fill();

      // Vertebral arch (posterior)
      ctx.beginPath();
      ctx.arc(width * 0.5, y + vertebraHeight * 0.5, width * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Spinous process (the bump you can feel on your back)
      ctx.beginPath();
      ctx.moveTo(width * 0.48, y + vertebraHeight * 0.5);
      ctx.lineTo(width * 0.45, y + vertebraHeight * 0.8);
      ctx.lineTo(width * 0.55, y + vertebraHeight * 0.8);
      ctx.lineTo(width * 0.52, y + vertebraHeight * 0.5);
      ctx.closePath();
      ctx.fill();

      // Transverse processes (side projections)
      ctx.fillRect(width * 0.2, y + vertebraHeight * 0.4, width * 0.1, vertebraHeight * 0.2);
      ctx.fillRect(width * 0.7, y + vertebraHeight * 0.4, width * 0.1, vertebraHeight * 0.2);

      // Outline vertebra
      ctx.strokeStyle = color.dark;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(width * 0.35, y + vertebraHeight * 0.2, width * 0.3, vertebraHeight * 0.6, 2);
      ctx.stroke();
    }

    // Intervertebral discs (between vertebrae)
    ctx.fillStyle = '#87CEEB';
    for(let i = 0; i < vertebraCount - 1; i++) {
      const y = (i + 1) * vertebraHeight - vertebraHeight * 0.15;
      ctx.beginPath();
      ctx.ellipse(width * 0.5, y, width * 0.18, vertebraHeight * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Spinal cord (inside vertebral canal)
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, 0);
    ctx.lineTo(width * 0.5, height);
    ctx.stroke();

    // Spinal nerves (exiting on sides)
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1.5;
    for(let i = 0; i < vertebraCount; i++) {
      const y = i * vertebraHeight + vertebraHeight * 0.5;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, y);
      ctx.lineTo(width * 0.15, y + 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(width * 0.5, y);
      ctx.lineTo(width * 0.85, y + 5);
      ctx.stroke();
    }

    // Curvatures (natural curves of spine)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(width * 0.5, 0);
    ctx.bezierCurveTo(
      width * 0.6, height * 0.15,
      width * 0.4, height * 0.4,
      width * 0.55, height * 0.65
    );
    ctx.bezierCurveTo(width * 0.6, height * 0.8, width * 0.5, height * 0.95, width * 0.5, height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  static drawMuscle(ctx, x, y, width, height, type = 'bicep') {
    ctx.save();
    ctx.translate(x, y);

    const muscleColor = { base: '#DC143C', light: '#FF6B7A', dark: '#A52A2A' };

    switch(type) {
      case 'bicep':
        this.drawBicep(ctx, muscleColor, width, height);
        break;
      case 'heart':
        // Already have heart muscle, use cardiac pattern
        this.drawCardiacMuscle(ctx, muscleColor, width, height);
        break;
      case 'smooth':
        this.drawSmoothMuscle(ctx, muscleColor, width, height);
        break;
    }

    ctx.restore();
  }

  static drawBicep(ctx, color, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.dark);
    gradient.addColorStop(0.3, color.base);
    gradient.addColorStop(0.7, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Bicep muscle belly
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.1);
    ctx.bezierCurveTo(width * 0.15, height * 0.2, width * 0.1, height * 0.35, width * 0.15, height * 0.5);
    ctx.bezierCurveTo(width * 0.2, height * 0.65, width * 0.3, height * 0.75, width * 0.35, height * 0.85);
    ctx.lineTo(width * 0.65, height * 0.85);
    ctx.bezierCurveTo(width * 0.7, height * 0.75, width * 0.8, height * 0.65, width * 0.85, height * 0.5);
    ctx.bezierCurveTo(width * 0.9, height * 0.35, width * 0.85, height * 0.2, width * 0.7, height * 0.1);
    ctx.closePath();
    ctx.fill();

    // Muscle fibers (striations)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    for(let i = 0; i < 20; i++) {
      ctx.beginPath();
      const y = height * (0.15 + i * 0.035);
      ctx.moveTo(width * 0.2, y);
      ctx.lineTo(width * 0.8, y);
      ctx.stroke();
    }

    // Tendons
    ctx.fillStyle = '#F5DEB3';
    // Upper tendon
    ctx.fillRect(width * 0.4, height * 0.02, width * 0.2, height * 0.1);
    // Lower tendon
    ctx.fillRect(width * 0.42, height * 0.85, width * 0.16, height * 0.13);

    // Fascia (connective tissue covering)
    ctx.strokeStyle = 'rgba(245, 222, 179, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.1);
    ctx.bezierCurveTo(width * 0.15, height * 0.2, width * 0.1, height * 0.35, width * 0.15, height * 0.5);
    ctx.bezierCurveTo(width * 0.2, height * 0.65, width * 0.3, height * 0.75, width * 0.35, height * 0.85);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.1);
    ctx.bezierCurveTo(width * 0.15, height * 0.2, width * 0.1, height * 0.35, width * 0.15, height * 0.5);
    ctx.bezierCurveTo(width * 0.2, height * 0.65, width * 0.3, height * 0.75, width * 0.35, height * 0.85);
    ctx.lineTo(width * 0.65, height * 0.85);
    ctx.bezierCurveTo(width * 0.7, height * 0.75, width * 0.8, height * 0.65, width * 0.85, height * 0.5);
    ctx.bezierCurveTo(width * 0.9, height * 0.35, width * 0.85, height * 0.2, width * 0.7, height * 0.1);
    ctx.closePath();
    ctx.stroke();
  }

  static drawCardiacMuscle(ctx, color, width, height) {
    // Cardiac muscle cells (interconnected)
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Intercalated discs (connections between cells)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    for(let i = 0; i < 10; i++) {
      const y = height * (i / 10);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Striations
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for(let i = 0; i < 30; i++) {
      const y = height * (i / 30);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Branch points
    ctx.fillStyle = color.dark;
    for(let i = 0; i < 5; i++) {
      const x = width * (0.2 + Math.random() * 0.6);
      const y = height * (0.2 + Math.random() * 0.6);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  static drawSmoothMuscle(ctx, color, width, height) {
    // Smooth muscle (no striations, spindle-shaped cells)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    // Draw spindle-shaped cells overlapping
    const cellCount = 15;
    for(let i = 0; i < cellCount; i++) {
      const cy = (i / cellCount) * height;
      const offset = (i % 2) * width * 0.1;

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(width * 0.5 + offset, cy, width * 0.15, height * 0.08, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Nucleus
      ctx.fillStyle = '#4B0082';
      ctx.beginPath();
      ctx.ellipse(width * 0.5 + offset, cy, width * 0.04, height * 0.02, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Outline
      ctx.strokeStyle = color.dark;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(width * 0.5 + offset, cy, width * 0.15, height * 0.08, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  static drawNeuron(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const neuronColor = { base: '#FFD700', light: '#FFED4E', dark: '#DAA520' };

    // Cell body (soma)
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.15);
    gradient.addColorStop(0, neuronColor.light);
    gradient.addColorStop(0.7, neuronColor.base);
    gradient.addColorStop(1, neuronColor.dark);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Nucleus
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Nucleolus
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.arc(width * 0.52, height * 0.48, width * 0.03, 0, Math.PI * 2);
    ctx.fill();

    // Dendrites (branching inputs)
    ctx.strokeStyle = neuronColor.base;
    ctx.lineWidth = 2;
    const dendriteCount = 6;
    for(let i = 0; i < dendriteCount; i++) {
      const angle = ((i / dendriteCount) * Math.PI * 2) - Math.PI / 2;
      if(Math.abs(angle) < Math.PI * 0.6) { // Don't draw on axon side
        this.drawDendrite(ctx, 
          width * 0.5 + Math.cos(angle) * width * 0.15,
          height * 0.5 + Math.sin(angle) * height * 0.15,
          angle, 3, width * 0.08
        );
      }
    }

    // Axon (long projection)
    ctx.strokeStyle = neuronColor.base;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.65);
    ctx.bezierCurveTo(
      width * 0.52, height * 0.75,
      width * 0.48, height * 0.85,
      width * 0.5, height * 0.95
    );
    ctx.stroke();

    // Myelin sheath (insulation on axon)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = neuronColor.dark;
    ctx.lineWidth = 1;
    const myelinSegments = 4;
    for(let i = 0; i < myelinSegments; i++) {
      const segY = height * (0.68 + i * 0.07);
      ctx.beginPath();
      ctx.ellipse(width * 0.5, segY, width * 0.04, height * 0.025, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Nodes of Ranvier (gaps in myelin)
    ctx.fillStyle = neuronColor.base;
    for(let i = 0; i < myelinSegments - 1; i++) {
      const nodeY = height * (0.705 + i * 0.07);
      ctx.fillRect(width * 0.48, nodeY, width * 0.04, height * 0.01);
    }

    // Axon terminals (synaptic buttons)
    const terminalCount = 3;
    for(let i = 0; i < terminalCount; i++) {
      const tx = width * (0.4 + i * 0.1);
      ctx.fillStyle = neuronColor.light;
      ctx.beginPath();
      ctx.arc(tx, height * 0.98, width * 0.03, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = neuronColor.dark;
      ctx.stroke();

      // Synaptic vesicles
      ctx.fillStyle = '#FF69B4';
      for(let v = 0; v < 3; v++) {
        ctx.beginPath();
        ctx.arc(
          tx + (Math.random() - 0.5) * width * 0.02,
          height * 0.98 + (Math.random() - 0.5) * height * 0.02,
          1,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Connection line to terminal
      ctx.strokeStyle = neuronColor.base;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, height * 0.95);
      ctx.lineTo(tx, height * 0.95);
      ctx.stroke();
    }

    // Cell body outline
    ctx.strokeStyle = neuronColor.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.15, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  static drawDendrite(ctx, x, y, angle, depth, length) {
    if(depth === 0 || length < 2) return;

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Branch into smaller dendrites
    if(depth > 1) {
      this.drawDendrite(ctx, endX, endY, angle - 0.4, depth - 1, length * 0.7);
      this.drawDendrite(ctx, endX, endY, angle + 0.4, depth - 1, length * 0.7);
    }
  }

  static drawSkin(ctx, x, y, width, height, section = 'cross-section') {
    ctx.save();
    ctx.translate(x, y);

    if(section === 'cross-section') {
      // Epidermis (outer layer)
      const epidermisgradient = ctx.createLinearGradient(0, 0, 0, height * 0.15);
      epidermisgradient.addColorStop(0, '#F5D0C5');
      epidermisgradient.addColorStop(1, '#E8B4A8');
      ctx.fillStyle = epidermisgradient;
      ctx.fillRect(0, 0, width, height * 0.15);

      // Stratum corneum (dead cell layer)
      ctx.fillStyle = '#FAEBD7';
      for(let i = 0; i < 20; i++) {
        const cellX = (i / 20) * width;
        ctx.fillRect(cellX, 0, width / 22, height * 0.03);
      }

      // Dermis (middle layer)
      const dermisGradient = ctx.createLinearGradient(0, height * 0.15, 0, height * 0.75);
      dermisGradient.addColorStop(0, '#E8B4A8');
      dermisGradient.addColorStop(0.5, '#D19A8E');
      dermisGradient.addColorStop(1, '#C08878');
      ctx.fillStyle = dermisGradient;
      ctx.fillRect(0, height * 0.15, width, height * 0.6);

      // Hypodermis (subcutaneous fat layer)
      ctx.fillStyle = '#FFE4B5';
      ctx.fillRect(0, height * 0.75, width, height * 0.25);

      // Fat cells
      ctx.fillStyle = '#FFEFD5';
      ctx.strokeStyle = '#DEB887';
      ctx.lineWidth = 1;
      for(let i = 0; i < 8; i++) {
        const fatX = width * (0.1 + (i % 4) * 0.22);
        const fatY = height * (0.77 + Math.floor(i / 4) * 0.12);
        ctx.beginPath();
        ctx.arc(fatX, fatY, width * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Hair follicle
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height * 0.05);
      ctx.quadraticCurveTo(width * 0.32, height * 0.3, width * 0.35, height * 0.6);
      ctx.lineTo(width * 0.37, height * 0.6);
      ctx.quadraticCurveTo(width * 0.34, height * 0.3, width * 0.32, height * 0.05);
      ctx.closePath();
      ctx.fill();

      // Hair shaft (above skin)
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width * 0.31, 0);
      ctx.lineTo(width * 0.31, height * 0.06);
      ctx.stroke();

      // Sebaceous gland (oil gland)
      ctx.fillStyle = '#F0E68C';
      ctx.beginPath();
      ctx.arc(width * 0.34, height * 0.22, width * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#BDB76B';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sweat gland (coiled tube)
      ctx.strokeStyle = '#87CEEB';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for(let i = 0; i < 5; i++) {
        const coilY = height * (0.5 + i * 0.04);
        ctx.arc(width * 0.7, coilY, width * 0.03, 0, Math.PI * 2);
      }
      ctx.stroke();

      // Sweat duct
      ctx.beginPath();
      ctx.moveTo(width * 0.7, height * 0.5);
      ctx.lineTo(width * 0.68, height * 0.15);
      ctx.lineTo(width * 0.67, 0);
      ctx.stroke();

      // Blood vessels (capillaries)
      ctx.strokeStyle = '#E74C3C';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.4);
      ctx.bezierCurveTo(width * 0.2, height * 0.42, width * 0.3, height * 0.38, width * 0.5, height * 0.4);
      ctx.bezierCurveTo(width * 0.7, height * 0.42, width * 0.8, height * 0.38, width, height * 0.4);
      ctx.stroke();

      // Nerve endings (Meissner's corpuscles)
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#DAA520';
      ctx.lineWidth = 1;
      for(let i = 0; i < 3; i++) {
        const nerveX = width * (0.2 + i * 0.3);
        ctx.beginPath();
        ctx.ellipse(nerveX, height * 0.2, width * 0.02, height * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Pacinian corpuscle (pressure receptor, deeper)
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.65, width * 0.05, 0, Math.PI * 2);
      ctx.fill();
      // Layered appearance
      for(let i = 1; i <= 3; i++) {
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.65, width * (0.05 - i * 0.012), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Layer labels/boundaries
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, height * 0.15);
      ctx.lineTo(width, height * 0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.75);
      ctx.lineTo(width, height * 0.75);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  static drawRedBloodCell(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);

    // Biconcave disc shape (side view creates characteristic dumbbell)
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.5, '#E74C3C');
    gradient.addColorStop(1, '#C0392B');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    // Central pallor (lighter center due to biconcave shape)
    ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Outline
    ctx.strokeStyle = '#A52A2A';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  static drawWhiteBloodCell(ctx, x, y, size, type = 'neutrophil') {
    ctx.save();
    ctx.translate(x, y);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, '#E8E8FF');
    gradient.addColorStop(0.6, '#D0D0F8');
    gradient.addColorStop(1, '#B8B8E8');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    switch(type) {
      case 'neutrophil':
        // Multi-lobed nucleus
        ctx.fillStyle = '#4B0082';
        for(let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(
            Math.cos(angle) * size * 0.3,
            Math.sin(angle) * size * 0.3,
            size * 0.25,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        break;

      case 'lymphocyte':
        // Large round nucleus
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'monocyte':
        // Kidney-shaped nucleus
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.ellipse(-size * 0.15, 0, size * 0.45, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'eosinophil':
        // Bi-lobed nucleus
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.arc(-size * 0.25, 0, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size * 0.25, 0, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        // Red granules
        ctx.fillStyle = '#FF6347';
        for(let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(
            Math.cos(angle) * size * 0.6,
            Math.sin(angle) * size * 0.6,
            size * 0.08,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        break;

      case 'basophil':
        // Obscured nucleus with large granules
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        // Large dark granules
        ctx.fillStyle = '#191970';
        for(let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(
            Math.cos(angle) * size * 0.5,
            Math.sin(angle) * size * 0.5,
            size * 0.12,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        break;
    }

    // Outline
    ctx.strokeStyle = '#8888CC';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  static drawPlatelet(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);

    // Small irregular disc
    ctx.fillStyle = '#DDA0DD';
    ctx.beginPath();
    for(let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = size * (0.8 + Math.random() * 0.4);
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if(i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Granules
    ctx.fillStyle = '#8B008B';
    for(let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(
        (Math.random() - 0.5) * size * 0.5,
        (Math.random() - 0.5) * size * 0.5,
        size * 0.15,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.strokeStyle = '#9370DB';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  }

  static drawCell(ctx, x, y, size, type = 'generic') {
    ctx.save();
    ctx.translate(x, y);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, '#FFE4E1');
    gradient.addColorStop(0.6, '#FFD6D1');
    gradient.addColorStop(1, '#FFC8C1');

    // Cell membrane
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    // Nucleus
    ctx.fillStyle = '#9370DB';
    ctx.beginPath();
    ctx.arc(size * 0.1, -size * 0.1, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Nucleolus
    ctx.fillStyle = '#4B0082';
    ctx.beginPath();
    ctx.arc(size * 0.15, -size * 0.05, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Mitochondria
    ctx.strokeStyle = '#FF6347';
    ctx.fillStyle = '#FF7F50';
    ctx.lineWidth = 1;
    for(let i = 0; i < 3; i++) {
      const mx = (Math.random() - 0.5) * size * 1.2;
      const my = (Math.random() - 0.5) * size * 1.2;
      ctx.beginPath();
      ctx.ellipse(mx, my, size * 0.15, size * 0.08, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Cristae (inner folds)
      ctx.strokeStyle = '#DC143C';
      for(let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.moveTo(mx - size * 0.1, my - size * 0.05 + j * size * 0.05);
        ctx.lineTo(mx + size * 0.1, my - size * 0.05 + j * size * 0.05);
        ctx.stroke();
      }
      ctx.strokeStyle = '#FF6347';
    }

    // Endoplasmic reticulum
    ctx.strokeStyle = '#8FBC8F';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for(let i = 0; i < 5; i++) {
      const erAngle = (i / 5) * Math.PI * 2;
      const erX = Math.cos(erAngle) * size * 0.6;
      const erY = Math.sin(erAngle) * size * 0.6;
      if(i === 0) ctx.moveTo(erX, erY);
      else ctx.lineTo(erX, erY);
    }
    ctx.stroke();

    // Ribosomes (small dots on ER)
    ctx.fillStyle = '#556B2F';
    for(let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = size * 0.6;
      ctx.beginPath();
      ctx.arc(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Golgi apparatus
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1.5;
    for(let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(-size * 0.4, size * 0.3, size * 0.15 + i * size * 0.03, Math.PI, Math.PI * 1.5);
      ctx.stroke();
    }

    // Lysosomes
    ctx.fillStyle = '#FF69B4';
    for(let i = 0; i < 3; i++) {
      const lx = (Math.random() - 0.5) * size * 1.2;
      const ly = (Math.random() - 0.5) * size * 1.2;
      ctx.beginPath();
      ctx.arc(lx, ly, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cell membrane outline
    ctx.strokeStyle = '#CD5C5C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.stroke();

    // Membrane proteins (bumps on surface)
    ctx.fillStyle = '#F08080';
    for(let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(
        Math.cos(angle) * size * 1.05,
        Math.sin(angle) * size * 1.05,
        size * 0.08,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

  static drawDNA(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const turns = 5;
    const pointsPerTurn = 20;
    const totalPoints = turns * pointsPerTurn;

    // Draw double helix
    for(let strand = 0; strand < 2; strand++) {
      ctx.strokeStyle = strand === 0 ? '#4169E1' : '#DC143C';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for(let i = 0; i <= totalPoints; i++) {
        const t = i / totalPoints;
        const y_pos = t * height;
        const angle = t * turns * Math.PI * 2 + (strand * Math.PI);
        const x_pos = width * 0.5 + Math.cos(angle) * width * 0.3;

        if(i === 0) ctx.moveTo(x_pos, y_pos);
        else ctx.lineTo(x_pos, y_pos);
      }
      ctx.stroke();
    }

    // Base pairs (rungs of the ladder)
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    for(let i = 0; i < totalPoints; i += 2) {
      const t = i / totalPoints;
      const y_pos = t * height;
      const angle = t * turns * Math.PI * 2;
      
      const x1 = width * 0.5 + Math.cos(angle) * width * 0.3;
      const x2 = width * 0.5 + Math.cos(angle + Math.PI) * width * 0.3;

      ctx.beginPath();
      ctx.moveTo(x1, y_pos);
      ctx.lineTo(x2, y_pos);
      ctx.stroke();

      // Nucleotide bases (A-T, G-C)
      const bases = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3'];
      const baseColor = bases[i % 4];
      
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(x1, y_pos, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x2, y_pos, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  static drawValve(ctx, x, y, width, height, type = 'atrioventricular', state = 'closed') {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#F5F5DC', light: '#FFFAF0', dark: '#D3D3C0' };

    if(type === 'atrioventricular') {
      // Mitral or tricuspid valve
      const leaflets = type === 'mitral' ? 2 : 3;
      
      for(let i = 0; i < leaflets; i++) {
        const angle = (i / leaflets) * Math.PI * 2 - Math.PI / 2;
        const openAngle = state === 'open' ? 0.6 : 0;
        
        ctx.fillStyle = color.base;
        ctx.strokeStyle = color.dark;
        ctx.lineWidth = 2;
        
        ctx.save();
        ctx.rotate(angle + openAngle);
        
        // Valve leaflet
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          width * 0.2, height * 0.1,
          width * 0.3, height * 0.3,
          width * 0.25, height * 0.5
        );
        ctx.bezierCurveTo(
          width * 0.2, height * 0.4,
          width * 0.1, height * 0.2,
          0, 0
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Chordae tendineae (tendon strings)
        ctx.strokeStyle = '#CD853F';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(width * 0.25, height * 0.5);
        ctx.lineTo(width * 0.3, height * 0.8);
        ctx.stroke();
        
        ctx.restore();
      }
      
      // Papillary muscle attachment
      ctx.fillStyle = '#DC143C';
      ctx.beginPath();
      ctx.arc(0, height * 0.85, width * 0.15, 0, Math.PI * 2);
      ctx.fill();
      
    } else if(type === 'semilunar') {
      // Aortic or pulmonary valve (3 cusps)
      for(let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const openAngle = state === 'open' ? 0.8 : 0;
        
        ctx.save();
        ctx.rotate(angle + openAngle);
        
        ctx.fillStyle = color.light;
        ctx.strokeStyle = color.dark;
        ctx.lineWidth = 2;
        
        // Semilunar cusp (pocket-like)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          width * 0.15, height * 0.05,
          width * 0.25, height * 0.15,
          width * 0.2, height * 0.3
        );
        ctx.bezierCurveTo(
          width * 0.15, height * 0.25,
          width * 0.05, height * 0.15,
          0, 0
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Nodule of Arantius (thickening at tip)
        ctx.fillStyle = color.dark;
        ctx.beginPath();
        ctx.arc(width * 0.12, height * 0.18, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    ctx.restore();
  }
}


// ============================================================================
// ANATOMICAL DIAGRAM RENDERER CLASS
// ============================================================================

class AnatomicalDiagramRenderer {
    constructor(canvas = null) {
        this.defaultFont = 'Arial, sans-serif';
        this.defaultFontSize = 12;
        this.canvas = canvas;
        this.ctx = canvas ? canvas.getContext('2d') : null;  // Only get context if canvas exists
    }
  // ============================================================================
  // CARDIOVASCULAR SYSTEM DIAGRAMS
  // ============================================================================

  renderHeartAnatomyDiagram(x, y, width, height, options = {}) {
    const {
      showLabels = true,
      showBloodFlow = true,
      animate = false,
      chamber = 'wholeheart'
    } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    if(showLabels) {
      this.ctx.font = 'bold 24px Arial';
      this.ctx.fillStyle = '#2C3E50';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Human Heart Anatomy', width / 2, -20);
    }

    // Draw heart
    if(chamber === 'wholeheart') {
      AnatomicalShapes.drawHeart(this.ctx, 0, 0, width, height, 'wholeheart');
      
      if(showLabels) {
        this.addLabel('Right Atrium', width * 0.7, height * 0.2, '#8B4789');
        this.addLabel('Right Ventricle', width * 0.7, height * 0.6, '#8B4789');
        this.addLabel('Left Atrium', width * 0.2, height * 0.2, '#E74C3C');
        this.addLabel('Left Ventricle', width * 0.2, height * 0.6, '#E74C3C');
        this.addLabel('Septum', width * 0.5, height * 0.5, '#5D4E60');
      }

      // Blood flow arrows
      if(showBloodFlow) {
        // Deoxygenated blood (blue/purple) from body to right atrium
        this.drawArrow(width * 0.85, height * 0.15, width * 0.75, height * 0.22, '#8B4789', 'From Body');
        
        // To lungs from right ventricle
        this.drawArrow(width * 0.75, height * 0.4, width * 0.85, height * 0.35, '#8B4789', 'To Lungs');
        
        // Oxygenated blood (red) from lungs to left atrium
        this.drawArrow(width * 0.15, height * 0.15, width * 0.25, height * 0.22, '#E74C3C', 'From Lungs');
        
        // To body from left ventricle
        this.drawArrow(width * 0.25, height * 0.4, width * 0.15, height * 0.35, '#E74C3C', 'To Body');
      }
    } else {
      // Individual chamber view
      const state = chamber.includes('Atrium') ? 'deoxygenated' : 
                   chamber.includes('right') ? 'deoxygenated' : 'oxygenated';
      AnatomicalShapes.drawHeart(this.ctx, 0, 0, width, height, chamber, state);
      
      if(showLabels) {
        const chamberNames = {
          'rightAtrium': 'Right Atrium',
          'rightVentricle': 'Right Ventricle',
          'leftAtrium': 'Left Atrium',
          'leftVentricle': 'Left Ventricle'
        };
        this.addLabel(chamberNames[chamber], width / 2, -10, '#2C3E50');
      }
    }

    // Animation for heartbeat
    if(animate) {
      const scale = 1 + Math.sin(this.currentFrame * 0.1) * 0.05;
      this.ctx.scale(scale, scale);
    }

    this.ctx.restore();
  }



  renderCirculatorySystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showOxygenation = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Circulatory System', width / 2, -20);

    // Heart in center
    const heartWidth = width * 0.2;
    const heartHeight = height * 0.25;
    const heartX = width * 0.4;
    const heartY = height * 0.35;
    AnatomicalShapes.drawHeart(this.ctx, heartX, heartY, heartWidth, heartHeight, 'wholeheart');

    // Lungs
    const lungWidth = width * 0.15;
    const lungHeight = height * 0.2;
    AnatomicalShapes.drawLung(this.ctx, width * 0.15, height * 0.1, lungWidth, lungHeight, 'left');
    AnatomicalShapes.drawLung(this.ctx, width * 0.65, height * 0.1, lungWidth, lungHeight, 'right');

    // Body representation (simplified)
    this.ctx.strokeStyle = '#95A5A6';
    this.ctx.lineWidth = 3;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.35, height * 0.65, width * 0.3, height * 0.3, 10);
    this.ctx.fill();
    this.ctx.stroke();

    // Blood vessels - Pulmonary circulation (heart to lungs)
    // Right ventricle to lungs (deoxygenated)
    this.drawCurvedArrow(
      heartX + heartWidth * 0.7, heartY + heartHeight * 0.5,
      width * 0.25, height * 0.25,
      '#8B4789', 'Pulmonary Artery'
    );
    this.drawCurvedArrow(
      heartX + heartWidth * 0.7, heartY + heartHeight * 0.5,
      width * 0.7, height * 0.25,
      '#8B4789', ''
    );

    // Lungs to left atrium (oxygenated)
    this.drawCurvedArrow(
      width * 0.25, height * 0.32,
      heartX + heartWidth * 0.3, heartY + heartHeight * 0.3,
      '#E74C3C', 'Pulmonary Vein'
    );
    this.drawCurvedArrow(
      width * 0.7, height * 0.32,
      heartX + heartWidth * 0.3, heartY + heartHeight * 0.3,
      '#E74C3C', ''
    );

    // Systemic circulation (heart to body)
    // Left ventricle to body (oxygenated)
    this.drawCurvedArrow(
      heartX + heartWidth * 0.3, heartY + heartHeight * 0.7,
      width * 0.5, height * 0.65,
      '#E74C3C', 'Aorta'
    );

    // Body to right atrium (deoxygenated)
    this.drawCurvedArrow(
      width * 0.5, height * 0.95,
      heartX + heartWidth * 0.7, heartY + heartHeight * 0.7,
      '#8B4789', 'Vena Cava'
    );

    if(showLabels) {
      this.addLabel('Lungs', width * 0.25, height * 0.08, '#2C3E50');
      this.addLabel('Lungs', width * 0.7, height * 0.08, '#2C3E50');
      this.addLabel('Heart', heartX + heartWidth / 2, heartY - 10, '#2C3E50');
      this.addLabel('Body Tissues', width * 0.5, height * 0.8, '#2C3E50');
    }

    // Legend
    if(showOxygenation) {
      this.drawLegend(width * 0.02, height * 0.85, [
        { color: '#E74C3C', label: 'Oxygenated Blood' },
        { color: '#8B4789', label: 'Deoxygenated Blood' }
      ]);
    }

    this.ctx.restore();
  }

  renderBloodVesselComparison(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Blood Vessel Comparison', width / 2, -20);

    const vesselWidth = width * 0.15;
    const vesselHeight = height * 0.8;
    const spacing = width * 0.28;

    // Artery (oxygenated)
    AnatomicalShapes.drawBloodVessel(
      this.ctx,
      width * 0.1,
      height * 0.1,
      vesselWidth,
      vesselHeight,
      'artery',
      'oxygenated'
    );
    if(showLabels) {
      this.addLabel('Artery', width * 0.175, height * 0.05, '#E74C3C');
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Thick walls', width * 0.175, height * 0.95);
      this.ctx.fillText('High pressure', width * 0.175, height * 0.98);
    }

    // Vein (deoxygenated)
    AnatomicalShapes.drawBloodVessel(
      this.ctx,
      width * 0.1 + spacing,
      height * 0.1,
      vesselWidth,
      vesselHeight,
      'vein',
      'deoxygenated'
    );
    if(showLabels) {
      this.addLabel('Vein', width * 0.175 + spacing, height * 0.05, '#8B4789');
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Thin walls', width * 0.175 + spacing, height * 0.95);
      this.ctx.fillText('Has valves', width * 0.175 + spacing, height * 0.98);
    }

    // Capillary
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.1 + spacing * 2, height * 0.1);
    this.ctx.lineTo(width * 0.1 + spacing * 2, height * 0.9);
    this.ctx.stroke();

    // Capillary detail (single cell layer)
    this.ctx.strokeStyle = '#95A5A6';
    this.ctx.lineWidth = 2;
    for(let i = 0; i < 10; i++) {
      const cy = height * (0.15 + i * 0.075);
      this.ctx.beginPath();
      this.ctx.arc(width * 0.1 + spacing * 2, cy, 4, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    if(showLabels) {
      this.addLabel('Capillary', width * 0.1 + spacing * 2, height * 0.05, '#E74C3C');
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('One cell thick', width * 0.1 + spacing * 2, height * 0.95);
      this.ctx.fillText('Gas exchange', width * 0.1 + spacing * 2, height * 0.98);
    }

    this.ctx.restore();
  }

  // ============================================================================
  // RESPIRATORY SYSTEM DIAGRAMS
  // ============================================================================

  renderRespiratorySystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showGasExchange = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Respiratory System', width / 2, -20);

    // Trachea
    const tracheaWidth = width * 0.08;
    const tracheaHeight = height * 0.25;
    this.ctx.fillStyle = '#FFB6D9';
    this.ctx.strokeStyle = '#FF8FB6';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.46, height * 0.05, tracheaWidth, tracheaHeight, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Tracheal rings
    for(let i = 0; i < 8; i++) {
      this.ctx.strokeStyle = '#FF8FB6';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      const ringY = height * (0.08 + i * 0.03);
      this.ctx.arc(width * 0.5, ringY, tracheaWidth * 0.5, Math.PI, 0);
      this.ctx.stroke();
    }

    // Bronchi (branching)
    this.ctx.strokeStyle = '#FFB6D9';
    this.ctx.lineWidth = 6;
    // Left bronchus
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.48, height * 0.3);
    this.ctx.quadraticCurveTo(width * 0.35, height * 0.35, width * 0.25, height * 0.42);
    this.ctx.stroke();
    // Right bronchus
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.52, height * 0.3);
    this.ctx.quadraticCurveTo(width * 0.65, height * 0.35, width * 0.75, height * 0.42);
    this.ctx.stroke();

    // Lungs
    const lungWidth = width * 0.3;
    const lungHeight = height * 0.55;
    AnatomicalShapes.drawLung(this.ctx, width * 0.05, height * 0.4, lungWidth, lungHeight, 'left');
    AnatomicalShapes.drawLung(this.ctx, width * 0.65, height * 0.4, lungWidth, lungHeight, 'right');

    // Diaphragm
    this.ctx.strokeStyle = '#DC143C';
    this.ctx.fillStyle = 'rgba(220, 20, 60, 0.2)';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.05, height * 0.95);
    this.ctx.quadraticCurveTo(width * 0.5, height * 1.05, width * 0.95, height * 0.95);
    this.ctx.fill();
    this.ctx.stroke();

    if(showLabels) {
      this.addLabel('Trachea', width * 0.5, height * 0.02, '#2C3E50');
      this.addLabel('Bronchi', width * 0.5, height * 0.35, '#2C3E50');
      this.addLabel('Left Lung', width * 0.2, height * 0.38, '#2C3E50');
      this.addLabel('Right Lung', width * 0.8, height * 0.38, '#2C3E50');
      this.addLabel('Diaphragm', width * 0.5, height * 0.98, '#2C3E50');
    }

    // Gas exchange inset
    if(showGasExchange) {
      this.drawGasExchangeInset(width * 0.65, height * 0.05, width * 0.3, height * 0.25);
    }

    this.ctx.restore();
  }

  drawGasExchangeInset(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Border
    this.ctx.strokeStyle = '#34495E';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, width, height, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Title
    this.ctx.font = 'bold 12px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Gas Exchange in Alveoli', width / 2, 15);

    // Alveolus
    this.ctx.strokeStyle = '#FFB6D9';
    this.ctx.fillStyle = 'rgba(255, 182, 217, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.55, width * 0.18, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Capillary around alveolus
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.55, width * 0.22, 0, Math.PI * 2);
    this.ctx.stroke();

    // O2 molecules entering blood
    this.ctx.fillStyle = '#3498DB';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText('O₂', width * 0.25, height * 0.45);
    this.drawArrow(width * 0.25, height * 0.48, width * 0.25, height * 0.58, '#3498DB');

    // CO2 molecules leaving blood
    this.ctx.fillStyle = '#E67E22';
    this.ctx.fillText('CO₂', width * 0.35, height * 0.65);
    this.drawArrow(width * 0.35, height * 0.62, width * 0.35, height * 0.52, '#E67E22');

    // Red blood cell
    AnatomicalShapes.drawRedBloodCell(this.ctx, width * 0.45, height * 0.55, 8);

    // Labels
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Alveolus', width * 0.5, height * 0.4);
    this.ctx.fillText('Capillary', width * 0.5, height * 0.7);

    this.ctx.restore();
  }

  // ============================================================================
  // DIGESTIVE SYSTEM DIAGRAMS
  // ============================================================================

  renderDigestiveSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showPath = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Digestive System', width / 2, -20);

    // Esophagus
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.fillRect(width * 0.45, 0, width * 0.1, height * 0.15);

    // Stomach
    AnatomicalShapes.drawStomach(this.ctx, width * 0.35, height * 0.14, width * 0.3, height * 0.2);

    // Liver (overlapping stomach area)
    AnatomicalShapes.drawLiver(this.ctx, width * 0.15, height * 0.08, width * 0.25, height * 0.18);

    // Pancreas (behind stomach)
    AnatomicalShapes.drawPancreas(this.ctx, width * 0.25, height * 0.24, width * 0.35, height * 0.08);

    // Small intestine
    AnatomicalShapes.drawIntestine(this.ctx, width * 0.25, height * 0.35, width * 0.5, height * 0.35, 'small');

    // Large intestine
    AnatomicalShapes.drawIntestine(this.ctx, width * 0.15, height * 0.3, width * 0.7, height * 0.65, 'large');

    if(showLabels) {
      this.addLabel('Esophagus', width * 0.5, -5, '#2C3E50');
      this.addLabel('Liver', width * 0.12, height * 0.12, '#8B4513');
      this.addLabel('Stomach', width * 0.35, height * 0.18, '#FFA07A');
      this.addLabel('Pancreas', width * 0.22, height * 0.28, '#FFDAB9');
      this.addLabel('Small\nIntestine', width * 0.5, height * 0.5, '#FFB6C1');
      this.addLabel('Large\nIntestine', width * 0.08, height * 0.55, '#E6A8B8');
    }

    // Digestive path arrow
    if(showPath) {
      this.ctx.strokeStyle = '#E74C3C';
      this.ctx.fillStyle = '#E74C3C';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.01);
      this.ctx.lineTo(width * 0.5, height * 0.14);
      this.ctx.quadraticCurveTo(width * 0.45, height * 0.24, width * 0.55, height * 0.34);
      this.ctx.quadraticCurveTo(width * 0.4, height * 0.5, width * 0.6, height * 0.65);
      this.ctx.quadraticCurveTo(width * 0.3, height * 0.4, width * 0.85, height * 0.5);
      this.ctx.quadraticCurveTo(width * 0.7, height * 0.7, width * 0.7, height * 0.88);
      this.ctx.stroke();
      
      this.ctx.setLineDash([]);
    }

    this.ctx.restore();
  }

  renderDigestiveOrganComparison(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Digestive Organs', width / 2, -20);

    const organWidth = width * 0.22;
    const organHeight = height * 0.4;
    const spacing = width * 0.25;

    // Stomach
    AnatomicalShapes.drawStomach(this.ctx, width * 0.02, height * 0.1, organWidth, organHeight);
    this.addLabel('Stomach', width * 0.13, height * 0.05, '#FFA07A');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Digests proteins', width * 0.13, height * 0.55);
    this.ctx.fillText('Acidic environment', width * 0.13, height * 0.58);

    // Liver
    AnatomicalShapes.drawLiver(this.ctx, width * 0.02 + spacing, height * 0.1, organWidth, organHeight);
    this.addLabel('Liver', width * 0.13 + spacing, height * 0.05, '#8B4513');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Produces bile', width * 0.13 + spacing, height * 0.55);
    this.ctx.fillText('Detoxifies blood', width * 0.13 + spacing, height * 0.58);

    // Pancreas
    AnatomicalShapes.drawPancreas(this.ctx, width * 0.02 + spacing * 2, height * 0.18, organWidth * 1.3, organHeight * 0.6);
    this.addLabel('Pancreas', width * 0.13 + spacing * 2.2, height * 0.05, '#FFDAB9');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Digestive enzymes', width * 0.13 + spacing * 2.2, height * 0.55);
    this.ctx.fillText('Insulin production', width * 0.13 + spacing * 2.2, height * 0.58);

    // Small intestine cross-section
    this.ctx.strokeStyle = '#FFB6C1';
    this.ctx.fillStyle = '#FFD4E5';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.13, height * 0.78, organWidth * 0.4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Villi
    for(let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const vx = width * 0.13 + Math.cos(angle) * organWidth * 0.25;
      const vy = height * 0.78 + Math.sin(angle) * organWidth * 0.25;
      this.ctx.fillStyle = '#FFA4B0';
      this.ctx.beginPath();
      this.ctx.moveTo(vx, vy);
      this.ctx.lineTo(vx + Math.cos(angle) * 8, vy + Math.sin(angle) * 8);
      this.ctx.lineTo(vx + Math.cos(angle + 0.3) * 5, vy + Math.sin(angle + 0.3) * 5);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.addLabel('Small Intestine', width * 0.13, height * 0.65, '#FFB6C1');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Nutrient absorption', width * 0.13, height * 0.92);
    this.ctx.fillText('Villi increase surface', width * 0.13, height * 0.95);

    this.ctx.restore();
  }

  // ============================================================================
  // NERVOUS SYSTEM DIAGRAMS
  // ============================================================================

  renderNervousSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showSignal = false } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Central Nervous System', width / 2, -20);

    // Brain
    const brainWidth = width * 0.35;
    const brainHeight = height * 0.3;
    AnatomicalShapes.drawBrain(this.ctx, width * 0.32, height * 0.05, brainWidth, brainHeight);

    // Spinal cord
    const spineWidth = width * 0.12;
    const spineHeight = height * 0.6;
    AnatomicalShapes.drawSkeleton(this.ctx, width * 0.44, height * 0.35, spineWidth, spineHeight, 'spine');

    // Peripheral nerves
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 2;

    // Nerves branching from spinal cord
    for(let i = 0; i < 12; i++) {
      const ny = height * (0.4 + i * 0.045);
      
      // Left side
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.44, ny);
      this.ctx.quadraticCurveTo(width * 0.3, ny + height * 0.02, width * 0.15, ny + height * 0.05);
      this.ctx.stroke();

      // Right side
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.56, ny);
      this.ctx.quadraticCurveTo(width * 0.7, ny + height * 0.02, width * 0.85, ny + height * 0.05);
      this.ctx.stroke();
    }

    // Nerve signal animation
    if(showSignal) {
      const signalY = height * (0.4 + (this.currentFrame % 60) / 5);
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      this.ctx.arc(width * 0.5, signalY, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if(showLabels) {
      this.addLabel('Brain', width * 0.5, height * 0.02, '#2C3E50');
      this.addLabel('Spinal Cord', width * 0.5, height * 0.33, '#2C3E50');
      this.addLabel('Peripheral\nNerves', width * 0.1, height * 0.5, '#FFD700');
    }

    this.ctx.restore();
  }

  renderNeuronDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showSignal = false } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Neuron Structure', width / 2, -20);

    // Draw neuron
    AnatomicalShapes.drawNeuron(this.ctx, 0, 0, width, height);

    if(showLabels) {
      // Dendrites label
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.25, height * 0.3);
      this.ctx.lineTo(width * 0.1, height * 0.25);
      this.ctx.stroke();
      this.addLabel('Dendrites\n(receive signals)', width * 0.02, height * 0.23, '#2C3E50', 'left');

      // Cell body label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.65, height * 0.5);
      this.ctx.lineTo(width * 0.8, height * 0.5);
      this.ctx.stroke();
      this.addLabel('Cell Body\n(soma)', width * 0.82, height * 0.48, '#2C3E50', 'left');

      // Nucleus label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.5);
      this.ctx.lineTo(width * 0.7, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Nucleus', width * 0.72, height * 0.58, '#2C3E50', 'left');

      // Axon label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.65, height * 0.8);
      this.ctx.lineTo(width * 0.8, height * 0.8);
      this.ctx.stroke();
      this.addLabel('Axon\n(transmits signals)', width * 0.82, height * 0.78, '#2C3E50', 'left');

      // Myelin sheath label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.68);
      this.ctx.lineTo(width * 0.7, height * 0.65);
      this.ctx.stroke();
      this.addLabel('Myelin Sheath', width * 0.72, height * 0.63, '#2C3E50', 'left');

      // Axon terminals label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.45, height * 0.98);
      this.ctx.lineTo(width * 0.3, height * 0.95);
      this.ctx.stroke();
      this.addLabel('Axon Terminals\n(synaptic buttons)', width * 0.02, height * 0.93, '#2C3E50', 'left');
    }

    // Signal animation
    if(showSignal) {
      const signalProgress = (this.currentFrame % 60) / 60;
      const signalY = height * (0.3 + signalProgress * 0.68);
      
      this.ctx.fillStyle = '#FFD700';
      this.ctx.shadowColor = '#FFD700';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.arc(width * 0.5, signalY, 6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    this.ctx.restore();
  }

  // ============================================================================
  // SKELETAL SYSTEM DIAGRAMS
  // ============================================================================

  renderSkeletalSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, bone = 'skull' } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    const boneNames = {
      'skull': 'Human Skull',
      'femur': 'Femur (Thigh Bone)',
      'ribcage': 'Ribcage',
      'spine': 'Vertebral Column'
    };

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(boneNames[bone] || 'Skeletal System', width / 2, -20);

    // Draw bone
    AnatomicalShapes.drawSkeleton(this.ctx, 0, 0, width, height, bone);

    if(showLabels) {
      switch(bone) {
        case 'skull':
          this.addLabel('Cranium', width * 0.5, height * 0.15, '#2C3E50');
          this.addLabel('Eye Socket', width * 0.35, height * 0.42, '#2C3E50');
          this.addLabel('Nasal Cavity', width * 0.5, height * 0.57, '#2C3E50');
          this.addLabel('Mandible', width * 0.5, height * 0.85, '#2C3E50');
          break;
        case 'femur':
          this.addLabel('Femoral Head', width * 0.3, height * 0.15, '#2C3E50');
          this.addLabel('Greater\nTrochanter', width * 0.7, height * 0.18, '#2C3E50');
          this.addLabel('Shaft', width * 0.7, height * 0.5, '#2C3E50');
          this.addLabel('Condyles', width * 0.5, height * 0.88, '#2C3E50');
          break;
        case 'ribcage':
          this.addLabel('Sternum', width * 0.5, height * 0.3, '#2C3E50');
          this.addLabel('Ribs', width * 0.15, height * 0.5, '#2C3E50');
          this.addLabel('Costal\nCartilage', width * 0.75, height * 0.35, '#2C3E50');
          break;
        case 'spine':
          this.addLabel('Cervical\nVertebrae', width * 0.7, height * 0.15, '#2C3E50');
          this.addLabel('Thoracic\nVertebrae', width * 0.7, height * 0.4, '#2C3E50');
          this.addLabel('Lumbar\nVertebrae', width * 0.7, height * 0.65, '#2C3E50');
          this.addLabel('Sacrum', width * 0.7, height * 0.85, '#2C3E50');
          break;
      }
    }

    this.ctx.restore();
  }

  renderBoneStructureDiagram(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Bone Structure (Cross-Section)', width / 2, -20);

    // Long bone cross-section
    const boneColor = { base: '#F5F5DC', light: '#FFFAF0', dark: '#D3D3C0' };

    // Compact bone (outer layer)
    const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, boneColor.light);
    gradient.addColorStop(0.5, boneColor.base);
    gradient.addColorStop(1, boneColor.dark);
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.2, height * 0.15, width * 0.6, height * 0.7, 10);
    this.ctx.fill();

    // Medullary cavity (marrow)
    this.ctx.fillStyle = '#FFE4C4';
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.35, height * 0.25, width * 0.3, height * 0.5, 5);
    this.ctx.fill();

    // Yellow marrow (fat)
    this.ctx.fillStyle = '#FFEFD5';
    for(let i = 0; i < 8; i++) {
      const mx = width * (0.4 + Math.random() * 0.2);
      const my = height * (0.3 + Math.random() * 0.4);
      this.ctx.beginPath();
      this.ctx.arc(mx, my, 8, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Periosteum (outer membrane)
    this.ctx.strokeStyle = '#CD853F';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.19, height * 0.14, width * 0.62, height * 0.72, 10);
    this.ctx.stroke();

    // Haversian canals (in compact bone)
    this.ctx.fillStyle = '#FFB6C1';
    for(let i = 0; i < 6; i++) {
      for(let j = 0; j < 3; j++) {
        const hx = width * (0.23 + j * 0.06);
        const hy = height * (0.2 + i * 0.1);
        this.ctx.beginPath();
        this.ctx.arc(hx, hy, 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Concentric lamellae around canal
        for(let k = 1; k <= 2; k++) {
          this.ctx.strokeStyle = 'rgba(211, 211, 192, 0.5)';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.arc(hx, hy, 2 + k * 3, 0, Math.PI * 2);
          this.ctx.stroke();
        }
      }
    }

    // Spongy bone (at ends)
    this.ctx.strokeStyle = boneColor.dark;
    this.ctx.lineWidth = 2;
    // Top end
    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 3; j++) {
        const sx = width * (0.25 + i * 0.06);
        const sy = height * (0.05 + j * 0.03);
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(sx + 10, sy + 5);
        this.ctx.stroke();
      }
    }

    // Labels
    this.addLabel('Compact Bone', width * 0.05, height * 0.5, '#2C3E50', 'left');
    this.addLabel('Medullary Cavity\n(Bone Marrow)', width * 0.5, height * 0.5, '#2C3E50');
    this.addLabel('Periosteum', width * 0.15, height * 0.15, '#CD853F', 'left');
    this.addLabel('Haversian\nCanal', width * 0.23, height * 0.3, '#FFB6C1', 'center');
    this.addLabel('Spongy Bone', width * 0.5, height * 0.05, '#2C3E50');

    this.ctx.restore();
  }

  // ============================================================================
  // MUSCULAR SYSTEM DIAGRAMS
  // ============================================================================

  renderMuscularSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, type = 'skeletal' } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    const typeNames = {
      'skeletal': 'Skeletal Muscle',
      'cardiac': 'Cardiac Muscle',
      'smooth': 'Smooth Muscle'
    };

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(typeNames[type] || 'Muscle Types', width / 2, -20);

    if(type === 'skeletal') {
      // Draw bicep
      AnatomicalShapes.drawMuscle(this.ctx, width * 0.3, height * 0.1, width * 0.4, height * 0.8, 'bicep');

      if(showLabels) {
        this.addLabel('Origin\n(Tendon)', width * 0.5, height * 0.05, '#2C3E50');
        this.addLabel('Muscle Belly', width * 0.75, height * 0.5, '#DC143C');
        this.addLabel('Insertion\n(Tendon)', width * 0.5, height * 0.95, '#2C3E50');
        
        // Muscle fiber detail inset
        this.drawMuscleFiberInset(width * 0.02, height * 0.1, width * 0.25, height * 0.3);
      }
    } else if(type === 'cardiac') {
      AnatomicalShapes.drawMuscle(this.ctx, width * 0.25, height * 0.1, width * 0.5, height * 0.8, 'heart');

      if(showLabels) {
        this.addLabel('Branching\nFibers', width * 0.75, height * 0.3, '#DC143C');
        this.addLabel('Intercalated\nDiscs', width * 0.75, height * 0.5, '#A52A2A');
      }
    } else if(type === 'smooth') {
      AnatomicalShapes.drawMuscle(this.ctx, width * 0.25, height * 0.1, width * 0.5, height * 0.8, 'smooth');

      if(showLabels) {
        this.addLabel('Spindle-shaped\nCells', width * 0.75, height * 0.4, '#DC143C');
        this.addLabel('No Striations', width * 0.75, height * 0.6, '#A52A2A');
      }
    }

    this.ctx.restore();
  }

  drawMuscleFiberInset(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Border
    this.ctx.strokeStyle = '#34495E';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, width, height, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Title
    this.ctx.font = 'bold 11px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Muscle Fiber Detail', width / 2, 12);

    // Muscle fiber
    this.ctx.fillStyle = '#DC143C';
    this.ctx.strokeStyle = '#A52A2A';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.15, height * 0.2, width * 0.7, height * 0.7, 3);
    this.ctx.fill();
    this.ctx.stroke();

    // Myofibrils (internal structures)
    for(let i = 0; i < 4; i++) {
      const fx = width * (0.25 + i * 0.15);
      this.ctx.strokeStyle = '#8B0000';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(fx, height * 0.25);
      this.ctx.lineTo(fx, height * 0.85);
      this.ctx.stroke();
    }

    // Striations (Z-lines)
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.lineWidth = 1;
    for(let i = 0; i < 8; i++) {
      const fy = height * (0.3 + i * 0.08);
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.2, fy);
      this.ctx.lineTo(width * 0.8, fy);
      this.ctx.stroke();
    }

    // Nuclei
    this.ctx.fillStyle = '#4B0082';
    this.ctx.beginPath();
    this.ctx.ellipse(width * 0.3, height * 0.4, width * 0.05, height * 0.06, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(width * 0.6, height * 0.6, width * 0.05, height * 0.06, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Labels
    this.ctx.font = '9px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Sarcomere', width * 0.05, height * 0.5);
    this.ctx.fillText('Nucleus', width * 0.87, height * 0.45);

    this.ctx.restore();
  }

  renderMuscleContractionDiagram(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Muscle Contraction (Sliding Filament)', width / 2, -20);

    const sarcomereHeight = height * 0.35;

    // Relaxed sarcomere
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('RELAXED', width * 0.05, height * 0.15);

    this.drawSarcomere(width * 0.1, height * 0.18, width * 0.8, sarcomereHeight, false);

    // Contracted sarcomere
    this.ctx.fillText('CONTRACTED', width * 0.05, height * 0.6);
    this.drawSarcomere(width * 0.1, height * 0.63, width * 0.8, sarcomereHeight, true);

    // Arrows showing direction
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.fillStyle = '#E74C3C';
    this.ctx.lineWidth = 3;
    
    // Left arrow
    this.drawArrow(width * 0.15, height * 0.55, width * 0.35, height * 0.55, '#E74C3C', '', 10);
    // Right arrow
    this.drawArrow(width * 0.85, height * 0.55, width * 0.65, height * 0.55, '#E74C3C', '', 10);

    this.ctx.restore();
  }

  drawSarcomere(x, y, width, height, contracted = false) {
    this.ctx.save();
    this.ctx.translate(x, y);

    const overlapWidth = contracted ? width * 0.35 : width * 0.15;

    // Z-lines (boundaries)
    this.ctx.strokeStyle = '#2C3E50';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, height);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(width, 0);
    this.ctx.lineTo(width, height);
    this.ctx.stroke();

    // M-line (center)
    this.ctx.beginPath();
    this.ctx.moveTo(width / 2, height * 0.3);
    this.ctx.lineTo(width / 2, height * 0.7);
    this.ctx.stroke();

    // Thin filaments (actin - red)
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.lineWidth = 4;
    for(let i = 0; i < 5; i++) {
      const yPos = height * (0.2 + i * 0.15);
      // From left Z-line
      this.ctx.beginPath();
      this.ctx.moveTo(5, yPos);
      this.ctx.lineTo(overlapWidth + width * 0.1, yPos);
      this.ctx.stroke();
      // From right Z-line
      this.ctx.beginPath();
      this.ctx.moveTo(width - 5, yPos);
      this.ctx.lineTo(width - overlapWidth - width * 0.1, yPos);
      this.ctx.stroke();
    }

    // Thick filaments (myosin - blue)
    this.ctx.strokeStyle = '#3498DB';
    this.ctx.lineWidth = 6;
    for(let i = 0; i < 4; i++) {
      const yPos = height * (0.25 + i * 0.17);
      this.ctx.beginPath();
      this.ctx.moveTo(width / 2 - width * 0.2, yPos);
      this.ctx.lineTo(width / 2 + width * 0.2, yPos);
      this.ctx.stroke();

      // Myosin heads
      this.ctx.fillStyle = '#2980B9';
      for(let j = 0; j < 6; j++) {
        const headX = width / 2 - width * 0.15 + j * width * 0.06;
        this.ctx.beginPath();
        this.ctx.arc(headX, yPos - 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(headX, yPos + 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Labels
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Z', 0, -5);
    this.ctx.fillText('Z', width, -5);
    this.ctx.fillText('M', width / 2, -5);

    this.ctx.restore();
  }

  // ============================================================================
  // CELLULAR & MICROSCOPIC DIAGRAMS
  // ============================================================================

  renderCellDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, type = 'generic' } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Animal Cell Structure', width / 2, -20);

    // Draw cell
    const cellSize = Math.min(width, height) * 0.4;
    AnatomicalShapes.drawCell(this.ctx, width / 2, height / 2, cellSize, type);

    if(showLabels) {
      // Cell membrane
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.75, height * 0.35);
      this.ctx.lineTo(width * 0.9, height * 0.3);
      this.ctx.stroke();
      this.addLabel('Cell Membrane', width * 0.92, height * 0.28, '#2C3E50', 'left');

      // Nucleus
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.45);
      this.ctx.lineTo(width * 0.7, height * 0.15);
      this.ctx.stroke();
      this.addLabel('Nucleus', width * 0.72, height * 0.13, '#2C3E50', 'left');

      // Mitochondria
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.3, height * 0.6);
      this.ctx.lineTo(width * 0.1, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Mitochondrion', width * 0.02, height * 0.58, '#2C3E50', 'left');

      // Endoplasmic reticulum
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.65, height * 0.65);
      this.ctx.lineTo(width * 0.9, height * 0.7);
      this.ctx.stroke();
      this.addLabel('Endoplasmic\nReticulum', width * 0.92, height * 0.68, '#2C3E50', 'left');

      // Golgi apparatus
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.3, height * 0.7);
      this.ctx.lineTo(width * 0.1, height * 0.8);
      this.ctx.stroke();
      this.addLabel('Golgi Apparatus', width * 0.02, height * 0.78, '#2C3E50', 'left');
    }

    this.ctx.restore();
  }

  renderBloodCellsDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Blood Cells', width / 2, -20);

    const cellSpacing = width * 0.2;
    const startX = width * 0.15;
    const cellY = height * 0.4;

    // Red Blood Cell
    AnatomicalShapes.drawRedBloodCell(this.ctx, startX, cellY, 25);
    if(showLabels) {
      this.addLabel('Red Blood Cell\n(Erythrocyte)', startX, cellY + 50, '#E74C3C');
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Carries oxygen', startX, cellY + 75);
    }

    // White Blood Cells
    const wbcTypes = ['neutrophil', 'lymphocyte', 'monocyte'];
    const wbcNames = ['Neutrophil', 'Lymphocyte', 'Monocyte'];
    
    for(let i = 0; i < 3; i++) {
      const cellX = startX + (i + 1) * cellSpacing;
      AnatomicalShapes.drawWhiteBloodCell(this.ctx, cellX, cellY, 25, wbcTypes[i]);
      if(showLabels) {
        this.addLabel(`${wbcNames[i]}\n(White Blood Cell)`, cellX, cellY + 50, '#D0D0F8');
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.textAlign = 'center';
        const functions = ['Fights bacteria', 'Immune response', 'Phagocytosis'];
        this.ctx.fillText(functions[i], cellX, cellY + 75);
      }
    }

    // Platelets
    for(let i = 0; i < 5; i++) {
      const px = width * (0.3 + i * 0.08);
      const py = height * 0.8;
      AnatomicalShapes.drawPlatelet(this.ctx, px, py, 8);
    }
    if(showLabels) {
      this.addLabel('Platelets\n(Thrombocytes)', width * 0.5, height * 0.85, '#DDA0DD');
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Blood clotting', width * 0.5, height * 0.92);
    }

    this.ctx.restore();
  }

  renderDNADiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('DNA Double Helix', width / 2, -20);

    // Draw DNA
    AnatomicalShapes.drawDNA(this.ctx, 0, 0, width, height);

    if(showLabels) {
      // Sugar-phosphate backbone
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.25, height * 0.2);
      this.ctx.lineTo(width * 0.1, height * 0.2);
      this.ctx.stroke();
      this.addLabel('Sugar-Phosphate\nBackbone', width * 0.02, height * 0.18, '#4169E1', 'left');

      // Base pairs
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.4);
      this.ctx.lineTo(width * 0.7, height * 0.4);
      this.ctx.stroke();
      this.addLabel('Base Pairs', width * 0.72, height * 0.38, '#808080', 'left');

      // Base pair legend
      this.drawLegend(width * 0.65, height * 0.65, [
        { color: '#FF6B6B', label: 'Adenine (A)' },
        { color: '#4ECDC4', label: 'Thymine (T)' },
        { color: '#FFD93D', label: 'Guanine (G)' },
        { color: '#95E1D3', label: 'Cytosine (C)' }
      ]);

      // Complementary base pairing note
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'left';
      this.ctx.fillText('A pairs with T', width * 0.65, height * 0.55);
      this.ctx.fillText('G pairs with C', width * 0.65, height * 0.58);
    }

    this.ctx.restore();
  }

  // ============================================================================
  // INTEGUMENTARY SYSTEM (SKIN) DIAGRAMS
  // ============================================================================

  renderSkinDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Skin Structure (Cross-Section)', width / 2, -20);

    // Draw skin
    AnatomicalShapes.drawSkin(this.ctx, 0, 0, width, height, 'cross-section');

    if(showLabels) {
      // Layer labels
      this.addLabel('Epidermis', width * 0.85, height * 0.08, '#F5D0C5', 'left');
      this.addLabel('Dermis', width * 0.85, height * 0.45, '#E8B4A8', 'left');
      this.addLabel('Hypodermis\n(Subcutaneous)', width * 0.85, height * 0.85, '#FFE4B5', 'left');

      // Structure labels
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      
      // Hair follicle
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.32, height * 0.3);
      this.ctx.lineTo(width * 0.15, height * 0.25);
      this.ctx.stroke();
      this.addLabel('Hair Follicle', width * 0.02, height * 0.23, '#8B4513', 'left');

      // Sebaceous gland
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.36, height * 0.22);
      this.ctx.lineTo(width * 0.45, height * 0.18);
      this.ctx.stroke();
      this.addLabel('Oil Gland', width * 0.47, height * 0.16, '#F0E68C', 'left');

      // Sweat gland
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.7, height * 0.6);
      this.ctx.lineTo(width * 0.8, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Sweat Gland', width * 0.82, height * 0.58, '#87CEEB', 'left');

      // Blood vessels
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.4);
      this.ctx.lineTo(width * 0.6, height * 0.35);
      this.ctx.stroke();
      this.addLabel('Blood Vessels', width * 0.62, height * 0.33, '#E74C3C', 'left');

      // Nerve endings
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.2, height * 0.2);
      this.ctx.lineTo(width * 0.1, height * 0.15);
      this.ctx.stroke();
      this.addLabel('Nerve Endings', width * 0.02, height * 0.13, '#FFD700', 'left');
    }

    this.ctx.restore();
  }

  // ============================================================================
  // URINARY SYSTEM DIAGRAMS
  // ============================================================================

  renderUrinarySystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Urinary System', width / 2, -20);

    // Kidneys
    const kidneyWidth = width * 0.2;
    const kidneyHeight = height * 0.35;
    AnatomicalShapes.drawKidney(this.ctx, width * 0.15, height * 0.15, kidneyWidth, kidneyHeight, 'left');
    AnatomicalShapes.drawKidney(this.ctx, width * 0.65, height * 0.15, kidneyWidth, kidneyHeight, 'right');

    // Bladder
    const bladderWidth = width * 0.25;
    const bladderHeight = height * 0.3;
    AnatomicalShapes.drawBladder(this.ctx, width * 0.375, height * 0.6, bladderWidth, bladderHeight, 0.6);

    // Ureters connecting kidneys to bladder
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 4;
    // Left ureter
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.32, height * 0.48);
    this.ctx.quadraticCurveTo(width * 0.35, height * 0.55, width * 0.42, height * 0.65);
    this.ctx.stroke();
    // Right ureter
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.68, height * 0.48);
    this.ctx.quadraticCurveTo(width * 0.65, height * 0.55, width * 0.58, height * 0.65);
    this.ctx.stroke();

    // Urethra
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.5, height * 0.9);
    this.ctx.lineTo(width * 0.5, height * 0.98);
    this.ctx.stroke();

    if(showLabels) {
      this.addLabel('Kidneys', width * 0.5, height * 0.08, '#8B0000');
      this.addLabel('Ureters', width * 0.38, height * 0.55, '#FFD700');
      this.addLabel('Bladder', width * 0.5, height * 0.58, '#FFD700');
      this.addLabel('Urethra', width * 0.55, height * 0.94, '#FFD700');

      // Function notes
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Filters blood', width * 0.25, height * 0.52);
      this.ctx.fillText('Stores urine', width * 0.5, height * 0.95);
    }

    this.ctx.restore();
  }

  renderKidneyDetailDiagram(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Kidney Internal Structure', width / 2, -20);

    // Draw kidney
    AnatomicalShapes.drawKidney(this.ctx, width * 0.2, height * 0.1, width * 0.6, height * 0.8, 'left');

    // Labels with leader lines
    this.ctx.strokeStyle = '#2C3E50';
    this.ctx.lineWidth = 1;

    // Renal cortex
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.35, height * 0.3);
    this.ctx.lineTo(width * 0.15, height * 0.25);
    this.ctx.stroke();
    this.addLabel('Renal Cortex', width * 0.02, height * 0.23, '#A52A2A', 'left');

    // Renal medulla
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.45, height * 0.45);
    this.ctx.lineTo(width * 0.15, height * 0.45);
    this.ctx.stroke();
    this.addLabel('Renal Medulla\n(Pyramids)', width * 0.02, height * 0.43, '#8B0000', 'left');

    // Renal pelvis
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.65, height * 0.5);
    this.ctx.lineTo(width * 0.85, height * 0.5);
    this.ctx.stroke();
    this.addLabel('Renal Pelvis', width * 0.87, height * 0.48, '#FFD700', 'left');

    // Ureter
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.68, height * 0.75);
    this.ctx.lineTo(width * 0.85, height * 0.8);
    this.ctx.stroke();
    this.addLabel('Ureter', width * 0.87, height * 0.78, '#FFD700', 'left');

    // Renal artery
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.7, height * 0.42);
    this.ctx.lineTo(width * 0.85, height * 0.35);
    this.ctx.stroke();
    this.addLabel('Renal Artery', width * 0.87, height * 0.33, '#E74C3C', 'left');

    // Renal vein
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.7, height * 0.58);
    this.ctx.lineTo(width * 0.85, height * 0.65);
    this.ctx.stroke();
    this.addLabel('Renal Vein', width * 0.87, height * 0.63, '#8B4789', 'left');

    // Nephron inset
    this.drawNephronInset(width * 0.02, height * 0.55, width * 0.3, height * 0.4);

    this.ctx.restore();
  }

  drawNephronInset(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Border
    this.ctx.strokeStyle = '#34495E';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, width, height, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Title
    this.ctx.font = 'bold 11px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Nephron (Functional Unit)', width / 2, 12);

    // Glomerulus (ball of capillaries)
    this.ctx.fillStyle = '#E74C3C';
    this.ctx.strokeStyle = '#C0392B';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.25, width * 0.08, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Bowman's capsule
    this.ctx.strokeStyle = '#3498DB';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.25, width * 0.12, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Proximal convoluted tubule
    this.ctx.strokeStyle = '#F39C12';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.42, height * 0.25);
    for(let i = 0; i < 3; i++) {
      this.ctx.bezierCurveTo(
        width * (0.5 + i * 0.05), height * (0.3 + i * 0.03),
        width * (0.5 + i * 0.05), height * (0.35 + i * 0.03),
        width * (0.52 + i * 0.05), height * (0.37 + i * 0.03)
      );
    }
    this.ctx.stroke();

    // Loop of Henle
    this.ctx.strokeStyle = '#9B59B6';
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.67, height * 0.46);
    this.ctx.lineTo(width * 0.7, height * 0.65);
    this.ctx.lineTo(width * 0.6, height * 0.65);
    this.ctx.lineTo(width * 0.57, height * 0.46);
    this.ctx.stroke();

    // Distal convoluted tubule
    this.ctx.strokeStyle = '#1ABC9C';
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.57, height * 0.46);
    for(let i = 0; i < 2; i++) {
      this.ctx.bezierCurveTo(
        width * (0.5 - i * 0.08), height * (0.5 + i * 0.05),
        width * (0.5 - i * 0.08), height * (0.55 + i * 0.05),
        width * (0.45 - i * 0.08), height * (0.58 + i * 0.05)
      );
    }
    this.ctx.stroke();

    // Collecting duct
    this.ctx.strokeStyle = '#E67E22';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.29, height * 0.68);
    this.ctx.lineTo(width * 0.29, height * 0.9);
    this.ctx.stroke();

    // Labels
    this.ctx.font = '8px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Glomerulus', width * 0.3, height * 0.15);
    this.ctx.fillText('Loop of Henle', width * 0.63, height * 0.75);
    this.ctx.fillText('Collecting\nDuct', width * 0.29, height * 0.95);

    this.ctx.restore();
  }

  // ============================================================================
  // SENSORY ORGAN DIAGRAMS
  // ============================================================================

  renderEyeDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, pupilDilation = 0.3 } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Human Eye Anatomy', width / 2, -20);

    // Draw eye
    AnatomicalShapes.drawEye(this.ctx, width * 0.2, height * 0.2, width * 0.6, height * 0.6, pupilDilation);

    if(showLabels) {
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;

      // Cornea
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.35);
      this.ctx.lineTo(width * 0.7, height * 0.25);
      this.ctx.stroke();
      this.addLabel('Cornea', width * 0.72, height * 0.23, '#2C3E50', 'left');

      // Iris
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.6, height * 0.5);
      this.ctx.lineTo(width * 0.8, height * 0.5);
      this.ctx.stroke();
      this.addLabel('Iris', width * 0.82, height * 0.48, '#8B7355', 'left');

      // Pupil
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.5);
      this.ctx.lineTo(width * 0.3, height * 0.5);
      this.ctx.stroke();
      this.addLabel('Pupil', width * 0.02, height * 0.48, '#000000', 'left');

      // Lens
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.53, height * 0.6);
      this.ctx.lineTo(width * 0.7, height * 0.7);
      this.ctx.stroke();
      this.addLabel('Lens', width * 0.72, height * 0.68, '#2C3E50', 'left');

      // Retina
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.73, height * 0.55);
      this.ctx.lineTo(width * 0.85, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Retina', width * 0.87, height * 0.58, '#2C3E50', 'left');

      // Optic nerve
      this.ctx.strokeStyle = '#FFD700';
      this.ctx.lineWidth = 5;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.6);
      this.ctx.lineTo(width * 0.5, height * 0.85);
      this.ctx.stroke();
      
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.75);
      this.ctx.lineTo(width * 0.3, height * 0.8);
      this.ctx.stroke();
      this.addLabel('Optic Nerve', width * 0.02, height * 0.78, '#FFD700', 'left');
    }

    this.ctx.restore();
  }

  // ============================================================================
  // VALVE DIAGRAMS
  // ============================================================================

  renderHeartValvesDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Heart Valves', width / 2, -20);

    const valveSize = width * 0.18;
    const spacing = width * 0.25;

    // Atrioventricular valves
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('AV Valves', width * 0.25, height * 0.15);

    // Tricuspid valve (closed)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.08,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'atrioventricular',
      'closed'
    );
    this.addLabel('Tricuspid\n(Closed)', width * 0.17, height * 0.48, '#2C3E50');

    // Mitral valve (open)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.08 + spacing,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'mitral',
      'open'
    );
    this.addLabel('Mitral\n(Open)', width * 0.17 + spacing, height * 0.48, '#2C3E50');

    // Semilunar valves
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.fillText('Semilunar Valves', width * 0.75, height * 0.15);

    // Pulmonary valve (open)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.58,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'semilunar',
      'open'
    );
    this.addLabel('Pulmonary\n(Open)', width * 0.67, height * 0.48, '#2C3E50');

    // Aortic valve (closed)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.58 + spacing,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'semilunar',
      'closed'
    );
    this.addLabel('Aortic\n(Closed)', width * 0.67 + spacing, height * 0.48, '#2C3E50');

    // Function description
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Prevent backflow of blood through the heart', width / 2, height * 0.6);

    if(showLabels) {
      // Legend
      this.drawLegend(width * 0.3, height * 0.7, [
        { color: '#F5F5DC', label: 'Valve Leaflets' },
        { color: '#CD853F', label: 'Chordae Tendineae' },
        { color: '#DC143C', label: 'Papillary Muscle' }
      ]);
    }

    this.ctx.restore();
  }

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  addLabel(text, x, y, color = '#2C3E50', align = 'center') {
    this.ctx.font = 'bold 13px Arial';
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      this.ctx.fillText(line, x, y + index * 15);
    });
  }

  drawArrow(x1, y1, x2, y2, color, label = '', arrowSize = 8) {
    this.ctx.save();
    
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 2;

    // Draw line
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1);
    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(
      x2 - arrowSize * Math.cos(angle - Math.PI / 6),
      y2 - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(
      x2 - arrowSize * Math.cos(angle + Math.PI / 6),
      y2 - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.closePath();
    this.ctx.fill();

    // Label
    if(label) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = color;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(label, midX, midY - 5);
    }

    this.ctx.restore();
  }

  drawCurvedArrow(x1, y1, x2, y2, color, label = '') {
    this.ctx.save();
    
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 3;

    // Calculate control point for curve
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const ctrlX = midX - dy * 0.3;
    const ctrlY = midY + dx * 0.3;

    // Draw curved line
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
    this.ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(y2 - ctrlY, x2 - ctrlX);
    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(
      x2 - 10 * Math.cos(angle - Math.PI / 6),
      y2 - 10 * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(
      x2 - 10 * Math.cos(angle + Math.PI / 6),
      y2 - 10 * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.closePath();
    this.ctx.fill();

    // Label
    if(label) {
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = color;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(label, ctrlX, ctrlY - 5);
    }

    this.ctx.restore();
  }

  drawLegend(x, y, items) {
    this.ctx.save();
    this.ctx.translate(x, y);

    const boxSize = 12;
    const spacing = 20;

    items.forEach((item, index) => {
      const yPos = index * spacing;

      // Color box
      this.ctx.fillStyle = item.color;
      this.ctx.fillRect(0, yPos, boxSize, boxSize);
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(0, yPos, boxSize, boxSize);

      // Label
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = '#2C3E50';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(item.label, boxSize + 5, yPos + boxSize - 2);
    });

    this.ctx.restore();
  }

  // ============================================================================
  // ANIMATION & RENDERING
  // ============================================================================

  animate() {
    this.currentFrame++;
    requestAnimationFrame(() => this.animate());
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  saveAsPNG(filename = 'anatomical-diagram.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvas.toDataURL();
    link.click();
  }
}

// ============================================================================
// ANATOMICAL DIAGRAMS REGISTRY - Comprehensive Anatomy Configuration System
// ============================================================================

class AnatomicalDiagramsRegistry {
    static diagrams = {
        // ===== CARDIOVASCULAR SYSTEM =====
        'heartAnatomy': {
            name: 'Heart Anatomy',
            category: 'Cardiovascular System',
            description: 'Complete heart structure with chambers and blood flow',
            dataRequired: ['chamber'],
            usage: 'Best for showing heart structure and chamber details',
            examples: ['Medical education', 'Patient briefings', 'Anatomy studies'],
            chamberOptions: ['wholeheart', 'rightAtrium', 'rightVentricle', 'leftAtrium', 'leftVentricle'],
            defaultOptions: {
                title: 'Heart Anatomy',
                chamber: 'wholeheart',
                showLabels: true,
                showBloodFlow: true,
                animate: false,
                width: 600,
                height: 500,
                backgroundColor: '#ffffff'
            }
        },

        'circulatorySystem': {
            name: 'Circulatory System',
            category: 'Cardiovascular System',
            description: 'Complete blood circulation pathway through body',
            dataRequired: [],
            usage: 'Best for showing systemic and pulmonary circulation',
            examples: ['Blood flow education', 'Circulatory teaching', 'Medical diagrams'],
            defaultOptions: {
                title: 'Circulatory System',
                showLabels: true,
                showOxygenation: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'bloodVesselComparison': {
            name: 'Blood Vessel Comparison',
            category: 'Cardiovascular System',
            description: 'Comparison of arteries, veins, and capillaries',
            dataRequired: [],
            usage: 'Best for comparing vessel structures',
            examples: ['Vessel anatomy', 'Blood transport', 'Vascular system'],
            defaultOptions: {
                title: 'Blood Vessel Comparison',
                showLabels: true,
                width: 700,
                height: 400,
                backgroundColor: '#ffffff'
            }
        },

        'heartValves': {
            name: 'Heart Valves',
            category: 'Cardiovascular System',
            description: 'All four heart valves showing structure and function',
            dataRequired: [],
            usage: 'Best for showing valve anatomy and operation',
            examples: ['Valve disorders', 'Cardiac anatomy', 'Heart function'],
            defaultOptions: {
                title: 'Heart Valves',
                showLabels: true,
                width: 800,
                height: 500,
                backgroundColor: '#ffffff'
            }
        },

        // ===== RESPIRATORY SYSTEM =====
        'respiratorySystem': {
            name: 'Respiratory System',
            category: 'Respiratory System',
            description: 'Complete respiratory tract with gas exchange',
            dataRequired: [],
            usage: 'Best for showing breathing anatomy',
            examples: ['Lung function', 'Breathing education', 'Respiratory health'],
            defaultOptions: {
                title: 'Respiratory System',
                showLabels: true,
                showGasExchange: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== DIGESTIVE SYSTEM =====
        'digestiveSystem': {
            name: 'Digestive System',
            category: 'Digestive System',
            description: 'Complete digestive tract from mouth to intestines',
            dataRequired: [],
            usage: 'Best for showing digestion pathway',
            examples: ['Digestive health', 'Nutrition education', 'GI tract'],
            defaultOptions: {
                title: 'Digestive System',
                showLabels: true,
                showPath: true,
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'digestiveOrgans': {
            name: 'Digestive Organs',
            category: 'Digestive System',
            description: 'Individual digestive organs with functions',
            dataRequired: [],
            usage: 'Best for comparing digestive organ structures',
            examples: ['Organ functions', 'Digestive process', 'Anatomy education'],
            defaultOptions: {
                title: 'Digestive Organs',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== NERVOUS SYSTEM =====
        'nervousSystem': {
            name: 'Nervous System',
            category: 'Nervous System',
            description: 'Central nervous system with brain and spinal cord',
            dataRequired: [],
            usage: 'Best for showing neural pathways',
            examples: ['Neurology', 'Brain structure', 'Nerve signals'],
            defaultOptions: {
                title: 'Central Nervous System',
                showLabels: true,
                showSignal: false,
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'neuronStructure': {
            name: 'Neuron Structure',
            category: 'Nervous System',
            description: 'Detailed neuron anatomy with all components',
            dataRequired: [],
            usage: 'Best for showing nerve cell structure',
            examples: ['Cellular neurology', 'Signal transmission', 'Neural anatomy'],
            defaultOptions: {
                title: 'Neuron Structure',
                showLabels: true,
                showSignal: false,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== SKELETAL SYSTEM =====
        'skull': {
            name: 'Human Skull',
            category: 'Skeletal System',
            description: 'Skull anatomy with cranium and facial bones',
            dataRequired: [],
            usage: 'Best for cranial anatomy education',
            examples: ['Skull anatomy', 'Cranial structure', 'Head bones'],
            defaultOptions: {
                title: 'Human Skull',
                bone: 'skull',
                showLabels: true,
                width: 500,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'femur': {
            name: 'Femur',
            category: 'Skeletal System',
            description: 'Thigh bone structure and features',
            dataRequired: [],
            usage: 'Best for long bone anatomy',
            examples: ['Bone structure', 'Orthopedics', 'Skeletal anatomy'],
            defaultOptions: {
                title: 'Femur (Thigh Bone)',
                bone: 'femur',
                showLabels: true,
                width: 400,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'ribcage': {
            name: 'Ribcage',
            category: 'Skeletal System',
            description: 'Thoracic cage with ribs and sternum',
            dataRequired: [],
            usage: 'Best for thoracic anatomy',
            examples: ['Chest structure', 'Rib anatomy', 'Thoracic cage'],
            defaultOptions: {
                title: 'Ribcage',
                bone: 'ribcage',
                showLabels: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'spine': {
            name: 'Vertebral Column',
            category: 'Skeletal System',
            description: 'Spine with vertebrae and spinal cord',
            dataRequired: [],
            usage: 'Best for spinal anatomy',
            examples: ['Back pain education', 'Spinal structure', 'Vertebrae'],
            defaultOptions: {
                title: 'Vertebral Column',
                bone: 'spine',
                showLabels: true,
                width: 400,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'boneStructure': {
            name: 'Bone Structure',
            category: 'Skeletal System',
            description: 'Cross-section showing internal bone anatomy',
            dataRequired: [],
            usage: 'Best for showing bone composition',
            examples: ['Bone health', 'Osteoporosis education', 'Bone anatomy'],
            defaultOptions: {
                title: 'Bone Structure (Cross-Section)',
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== MUSCULAR SYSTEM =====
        'skeletalMuscle': {
            name: 'Skeletal Muscle',
            category: 'Muscular System',
            description: 'Voluntary muscle structure with fibers',
            dataRequired: [],
            usage: 'Best for muscle anatomy education',
            examples: ['Muscle structure', 'Exercise physiology', 'Athletic training'],
            defaultOptions: {
                title: 'Skeletal Muscle',
                type: 'skeletal',
                showLabels: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'muscleContraction': {
            name: 'Muscle Contraction',
            category: 'Muscular System',
            description: 'Sliding filament model of muscle contraction',
            dataRequired: [],
            usage: 'Best for showing muscle mechanics',
            examples: ['Exercise science', 'Physiology', 'Muscle function'],
            defaultOptions: {
                title: 'Muscle Contraction (Sliding Filament)',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== CELLULAR & MICROSCOPIC =====
        'cellStructure': {
            name: 'Animal Cell',
            category: 'Cellular & Microscopic',
            description: 'Complete cell with organelles',
            dataRequired: [],
            usage: 'Best for cell biology education',
            examples: ['Cell biology', 'Organelles', 'Cellular anatomy'],
            defaultOptions: {
                title: 'Animal Cell Structure',
                type: 'generic',
                showLabels: true,
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'bloodCells': {
            name: 'Blood Cells',
            category: 'Cellular & Microscopic',
            description: 'Red blood cells, white blood cells, and platelets',
            dataRequired: [],
            usage: 'Best for hematology education',
            examples: ['Blood composition', 'Immune system', 'Hematology'],
            defaultOptions: {
                title: 'Blood Cells',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'dnaStructure': {
            name: 'DNA Double Helix',
            category: 'Cellular & Microscopic',
            description: 'DNA structure with base pairs',
            dataRequired: [],
            usage: 'Best for genetics education',
            examples: ['Genetics', 'Molecular biology', 'DNA structure'],
            defaultOptions: {
                title: 'DNA Double Helix',
                showLabels: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== INTEGUMENTARY SYSTEM =====
        'skinStructure': {
            name: 'Skin Layers',
            category: 'Integumentary System',
            description: 'Cross-section showing all skin layers',
            dataRequired: [],
            usage: 'Best for dermatology education',
            examples: ['Skin anatomy', 'Dermatology', 'Wound healing'],
            defaultOptions: {
                title: 'Skin Structure (Cross-Section)',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== URINARY SYSTEM =====
        'urinarySystem': {
            name: 'Urinary System',
            category: 'Urinary System',
            description: 'Kidneys, bladder, and urinary tract',
            dataRequired: [],
            usage: 'Best for renal anatomy',
            examples: ['Kidney function', 'Urinary health', 'Renal anatomy'],
            defaultOptions: {
                title: 'Urinary System',
                showLabels: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'kidneyDetail': {
            name: 'Kidney Internal Structure',
            category: 'Urinary System',
            description: 'Detailed kidney anatomy with nephron',
            dataRequired: [],
            usage: 'Best for renal physiology',
            examples: ['Kidney function', 'Filtration process', 'Nephron anatomy'],
            defaultOptions: {
                title: 'Kidney Internal Structure',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== SENSORY ORGANS =====
        'eyeAnatomy': {
            name: 'Eye Anatomy',
            category: 'Sensory Organs',
            description: 'Complete eye structure with all components',
            dataRequired: [],
            usage: 'Best for ophthalmology education',
            examples: ['Vision anatomy', 'Eye structure', 'Ophthalmology'],
            defaultOptions: {
                title: 'Human Eye Anatomy',
                showLabels: true,
                pupilDilation: 0.3,
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        }
    };

    static getDiagram(key) {
        return this.diagrams[key];
    }

    static getAllDiagrams() {
        return Object.keys(this.diagrams);
    }

    static getDiagramsByCategory(category) {
        return Object.entries(this.diagrams)
            .filter(([_, diagram]) => diagram.category === category)
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getAllCategories() {
        return [...new Set(Object.values(this.diagrams).map(d => d.category))];
    }

    static searchDiagrams(query) {
        const lowerQuery = query.toLowerCase();
        return Object.entries(this.diagrams)
            .filter(([key, diagram]) =>
                diagram.name.toLowerCase().includes(lowerQuery) ||
                diagram.description.toLowerCase().includes(lowerQuery) ||
                diagram.category.toLowerCase().includes(lowerQuery) ||
                key.toLowerCase().includes(lowerQuery)
            )
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getDiagramStats() {
        const stats = {};
        this.getAllCategories().forEach(category => {
            const diagrams = this.getDiagramsByCategory(category);
            stats[category] = {
                count: Object.keys(diagrams).length,
                diagrams: Object.keys(diagrams)
            };
        });
        return stats;
    }
}







// ============================================================================
// ADD THIS TO EnhancedSpreadsheetWorkbook CLASS
// ============================================================================

export class EnhancedSpreadsheetWorkbook {
    constructor(options = {}) {
        this.width = options.width || 1600;
        this.height = options.height || 2000;
        this.theme = options.theme || 'professional';

        // Spreadsheet data
        this.data = [];
        this.headers = [];
        this.formulas = {};
        this.calculations = {};
        this.history = [];

        // Chart management
        this.charts = [];
        this.chartRenderer = new ChartCanvasRenderer();

        // Anatomical diagram management
        this.anatomicalDiagrams = [];
        this.diagramRenderer = new AnatomicalDiagramRenderer(null);

        // Cross-section diagram management
        this.crossSectionDiagrams = [];
        this.crossSectionRenderer = new CrossSectionDiagramRenderer(null);

        // Stereochemistry diagram management
        this.stereochemistryDiagrams = [];
        this.stereochemistryRenderer = new StereochemistryDiagramRenderer(null);

        // Graphing Calculator management
        this.graphingCalculator = null;

        // Unified diagram tracking (for convenience)
        this.allDiagrams = {
            anatomical: this.anatomicalDiagrams,
            crossSection: this.crossSectionDiagrams,
            stereochemistry: this.stereochemistryDiagrams
        };

        // Visual settings
        this.cellWidth = 150;
        this.cellHeight = 30;
        this.headerHeight = 35;
        this.fontSize = 11;
        this.headerFontSize = 12;

        // Metadata
        this.sheetName = options.sheetName || 'Sheet1';
        this.createdDate = new Date();
        this.lastModified = new Date();
        this.author = options.author || 'User';

        this.setThemeColors();
    }



    
    // ==================== GRAPHING CALCULATOR INTEGRATION ====================

    /**
     * Initialize GraphingCalculatorGame instance
     */
    initializeGraphingCalculator() {
        if (!this.graphingCalculator) {
            this.graphingCalculator = new GraphingCalculatorGame();
        }
        return this.graphingCalculator;
    }

    /**
     * Get graphing calculator instance
     */
    getGraphingCalculator() {
        if (!this.graphingCalculator) {
            this.initializeGraphingCalculator();
        }
        return this.graphingCalculator;
    }

    // ==================== EQUATION METHODS ====================

    /**
     * Add equation to graphing calculator
     */
    addEquation(equation) {
        const calc = this.getGraphingCalculator();
        const result = calc.addEquation(equation);
        if (result) {
            this.addToHistory(`Added equation: ${equation}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get equation history
     */
    getEquationHistory() {
        const calc = this.getGraphingCalculator();
        return calc.equationHistory;
    }

    /**
     * Get equation count
     */
    getEquationCount() {
        const calc = this.getGraphingCalculator();
        return calc.equationCounter;
    }

    // ==================== TRIANGLE METHODS ====================

    /**
     * Add triangle
     */
    addTriangle(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addTriangle(input);
        if (result) {
            this.addToHistory(`Added triangle: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get triangle history
     */
    getTriangleHistory() {
        const calc = this.getGraphingCalculator();
        return calc.triangleHistory;
    }

    /**
     * Get triangle count
     */
    getTriangleCount() {
        const calc = this.getGraphingCalculator();
        return calc.triangleCounter;
    }

    // ==================== CIRCLE METHODS ====================

    /**
     * Add circle
     */
    addCircle(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addCircle(input);
        if (result) {
            this.addToHistory(`Added circle: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get circle history
     */
    getCircleHistory() {
        const calc = this.getGraphingCalculator();
        return calc.circleHistory;
    }

    /**
     * Get circle count
     */
    getCircleCount() {
        const calc = this.getGraphingCalculator();
        return calc.circleCounter;
    }

    // ==================== RECTANGLE METHODS ====================

    /**
     * Add rectangle
     */
    addRectangle(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addRectangle(input);
        if (result) {
            this.addToHistory(`Added rectangle: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get rectangle history
     */
    getRectangleHistory() {
        const calc = this.getGraphingCalculator();
        return calc.rectangleHistory;
    }

    /**
     * Get rectangle count
     */
    getRectangleCount() {
        const calc = this.getGraphingCalculator();
        return calc.rectangleCounter;
    }

    // ==================== SQUARE METHODS ====================

    /**
     * Add square
     */
    addSquare(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addSquare(input);
        if (result) {
            this.addToHistory(`Added square: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get square history
     */
    getSquareHistory() {
        const calc = this.getGraphingCalculator();
        return calc.squareHistory;
    }

    /**
     * Get square count
     */
    getSquareCount() {
        const calc = this.getGraphingCalculator();
        return calc.squareCounter;
    }

    // ==================== PARALLELOGRAM METHODS ====================

    /**
     * Add parallelogram
     */
    addParallelogram(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addParallelogram(input);
        if (result) {
            this.addToHistory(`Added parallelogram: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get parallelogram history
     */
    getParallelogramHistory() {
        const calc = this.getGraphingCalculator();
        return calc.parallelogramHistory;
    }

    /**
     * Get parallelogram count
     */
    getParallelogramCount() {
        const calc = this.getGraphingCalculator();
        return calc.parallelogramCounter;
    }

    // ==================== POLYGON METHODS ====================

    /**
     * Add polygon
     */
    addPolygon(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addPolygon(input);
        if (result) {
            this.addToHistory(`Added polygon: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get polygon history
     */
    getPolygonHistory() {
        const calc = this.getGraphingCalculator();
        return calc.polygonHistory;
    }

    /**
     * Get polygon count
     */
    getPolygonCount() {
        const calc = this.getGraphingCalculator();
        return calc.polygonCounter;
    }

    // ==================== ELLIPSE METHODS ====================

    /**
     * Add ellipse
     */
    addEllipse(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addEllipse(input);
        if (result) {
            this.addToHistory(`Added ellipse: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get ellipse history
     */
    getEllipseHistory() {
        const calc = this.getGraphingCalculator();
        return calc.ellipseHistory;
    }

    /**
     * Get ellipse count
     */
    getEllipseCount() {
        const calc = this.getGraphingCalculator();
        return calc.ellipseCounter;
    }

    // ==================== QUADRILATERAL METHODS ====================

    /**
     * Add quadrilateral
     */
    addQuadrilateral(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addQuadrilateral(input);
        if (result) {
            this.addToHistory(`Added quadrilateral: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get quadrilateral history
     */
    getQuadrilateralHistory() {
        const calc = this.getGraphingCalculator();
        return calc.quadrilateralHistory;
    }

    /**
     * Get quadrilateral count
     */
    getQuadrilateralCount() {
        const calc = this.getGraphingCalculator();
        return calc.quadrilateralCounter;
    }

    // ==================== TRAPEZOID METHODS ====================

    /**
     * Add trapezoid
     */
    addTrapezoid(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addTrapezoid(input);
        if (result) {
            this.addToHistory(`Added trapezoid: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get trapezoid history
     */
    getTrapezoidHistory() {
        const calc = this.getGraphingCalculator();
        return calc.trapezoidHistory;
    }

    /**
     * Get trapezoid count
     */
    getTrapezoidCount() {
        const calc = this.getGraphingCalculator();
        return calc.trapezoidCounter;
    }

    // ==================== SPHERE METHODS ====================

    /**
     * Add sphere
     */
    addSphere(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addSphere(input);
        if (result) {
            this.addToHistory(`Added sphere: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get sphere history
     */
    getSphereHistory() {
        const calc = this.getGraphingCalculator();
        return calc.sphereHistory;
    }

    /**
     * Get sphere count
     */
    getSphereCount() {
        const calc = this.getGraphingCalculator();
        return calc.sphereCounter;
    }

    // ==================== CYLINDER METHODS ====================

    /**
     * Add cylinder
     */
    addCylinder(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addCylinder(input);
        if (result) {
            this.addToHistory(`Added cylinder: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get cylinder history
     */
    getCylinderHistory() {
        const calc = this.getGraphingCalculator();
        return calc.cylinderHistory;
    }

    /**
     * Get cylinder count
     */
    getCylinderCount() {
        const calc = this.getGraphingCalculator();
        return calc.cylinderCounter;
    }

    // ==================== CONE METHODS ====================

    /**
     * Add cone
     */
    addCone(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addCone(input);
        if (result) {
            this.addToHistory(`Added cone: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get cone history
     */
    getConeHistory() {
        const calc = this.getGraphingCalculator();
        return calc.coneHistory;
    }

    /**
     * Get cone count
     */
    getConeCount() {
        const calc = this.getGraphingCalculator();
        return calc.coneCounter;
    }

    // ==================== CUBE METHODS ====================

    /**
     * Add cube
     */
    addCube(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addCube(input);
        if (result) {
            this.addToHistory(`Added cube: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get cube history
     */
    getCubeHistory() {
        const calc = this.getGraphingCalculator();
        return calc.cubeHistory;
    }

    /**
     * Get cube count
     */
    getCubeCount() {
        const calc = this.getGraphingCalculator();
        return calc.cubeCounter;
    }

    // ==================== VECTOR METHODS ====================

    /**
     * Add vector
     */
    addVector(input) {
        const calc = this.getGraphingCalculator();
        const result = calc.addVector(input);
        if (result) {
            this.addToHistory(`Added vector: ${input}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Get vector history
     */
    getVectorHistory() {
        const calc = this.getGraphingCalculator();
        return calc.vectorHistory;
    }

    /**
     * Get vector count
     */
    getVectorCount() {
        const calc = this.getGraphingCalculator();
        return calc.vectorCounter;
    }

    /**
     * Display vector history
     */
    displayVectorHistory() {
        const calc = this.getGraphingCalculator();
        calc.displayVectorHistory();
    }

    /**
     * Toggle vector settings
     */
    toggleVectorSettings() {
        const calc = this.getGraphingCalculator();
        calc.toggleVectorSettings();
    }

    // ==================== MATRIX METHODS ====================

    /**
     * Add matrix (you'll need to implement addMatrix in GraphingCalculatorGame)
     */
    addMatrix(input) {
        const calc = this.getGraphingCalculator();
        if (calc.addMatrix) {
            const result = calc.addMatrix(input);
            if (result) {
                this.addToHistory(`Added matrix: ${input}`);
                this.lastModified = new Date();
            }
            return result;
        }
        console.log("❌ Matrix functionality not yet implemented in GraphingCalculatorGame");
        return false;
    }

    /**
     * Get matrix history
     */
    getMatrixHistory() {
        const calc = this.getGraphingCalculator();
        return calc.matrixHistory || [];
    }

    /**
     * Get matrix count
     */
    getMatrixCount() {
        const calc = this.getGraphingCalculator();
        return calc.matrixCounter || 0;
    }

    /**
     * Display matrix history
     */
    displayMatrixHistory() {
        const calc = this.getGraphingCalculator();
        if (calc.displayMatrixHistory) {
            calc.displayMatrixHistory();
        } else {
            console.log("❌ Matrix functionality not yet implemented");
        }
    }

    /**
     * Toggle matrix settings
     */
    toggleMatrixSettings() {
        const calc = this.getGraphingCalculator();
        if (calc.toggleMatrixSettings) {
            calc.toggleMatrixSettings();
        } else {
            console.log("❌ Matrix functionality not yet implemented");
        }
    }

    // ==================== DISPLAY METHODS ====================

    /**
     * Display all available formulas
     */
    displayAllFormulas() {
        const calc = this.getGraphingCalculator();
        calc.displayAllFormulas();
    }

    /**
     * Display help menu
     */
    displayHelp() {
        const calc = this.getGraphingCalculator();
        calc.displayHelp();
    }

    /**
     * Display current graph
     */
    displayCurrentGraph() {
        const calc = this.getGraphingCalculator();
        calc.displayCurrentGraph();
    }

    /**
     * Display complete history
     */
    displayCompleteHistory() {
        console.log("\n📜 COMPLETE WORKBOOK HISTORY:");
        console.log("=".repeat(70));

        // Spreadsheet history
        if (this.history.length > 0) {
            console.log("\n📊 Spreadsheet Actions:");
            this.history.forEach((entry, index) => {
                console.log(`  ${index + 1}. ${entry}`);
            });
        }

        // Graphing calculator history
        const calc = this.getGraphingCalculator();
        
        if (calc.equationHistory.length > 0) {
            console.log("\n📈 Equation History:");
            calc.equationHistory.forEach(eq => console.log(`  ${eq}`));
        }

        const allShapes = [
            { name: 'Triangle', history: calc.triangleHistory, icon: '🔺' },
            { name: 'Circle', history: calc.circleHistory, icon: '⭕' },
            { name: 'Rectangle', history: calc.rectangleHistory, icon: '▭' },
            { name: 'Square', history: calc.squareHistory, icon: '▢' },
            { name: 'Parallelogram', history: calc.parallelogramHistory, icon: '▱' },
            { name: 'Polygon', history: calc.polygonHistory, icon: '⬡' },
            { name: 'Ellipse', history: calc.ellipseHistory, icon: '⬭' },
            { name: 'Quadrilateral', history: calc.quadrilateralHistory, icon: '⬢' },
            { name: 'Trapezoid', history: calc.trapezoidHistory, icon: '⏢' },
            { name: 'Sphere', history: calc.sphereHistory, icon: '🌐' },
            { name: 'Cylinder', history: calc.cylinderHistory, icon: '🛢️' },
            { name: 'Cone', history: calc.coneHistory, icon: '🔺' },
            { name: 'Cube', history: calc.cubeHistory, icon: '🧊' }
        ];

        allShapes.forEach(shape => {
            if (shape.history && shape.history.length > 0) {
                console.log(`\n${shape.icon} ${shape.name} History:`);
                shape.history.forEach(item => console.log(`  ${item.id}. ${item.input}`));
            }
        });

        if (calc.vectorHistory && calc.vectorHistory.length > 0) {
            console.log("\n➡️  Vector History:");
            calc.vectorHistory.forEach(vec => console.log(`  ${vec.id}. ${vec.input}`));
        }

        if (calc.matrixHistory && calc.matrixHistory.length > 0) {
            console.log("\n🔢 Matrix History:");
            calc.matrixHistory.forEach(mat => {
                const desc = mat.description ? ` (${mat.description})` : '';
                console.log(`  ${mat.id}. ${mat.input}${desc}`);
            });
        }

        if (this.getTotalGraphingItems() === 0 && this.history.length === 0) {
            console.log("\nNo items added yet.");
        }

        console.log("=".repeat(70));
    }

    /**
     * Display shape history by type
     */
    displayShapeHistory(shapeName) {
        const calc = this.getGraphingCalculator();
        calc.displayShapeHistory(shapeName, calc[`${shapeName}History`]);
    }

    // ==================== THEME & SETTINGS METHODS ====================

    /**
     * Change graphing calculator theme
     */
    changeGraphTheme(themeName) {
        const calc = this.getGraphingCalculator();
        const result = calc.changeTheme(themeName);
        if (result) {
            this.addToHistory(`Changed graph theme to: ${themeName}`);
            this.lastModified = new Date();
        }
        return result;
    }

    /**
     * Set viewing window for graphs
     */
    setGraphViewingWindow(xMin, xMax, yMin, yMax) {
        const calc = this.getGraphingCalculator();
        const result = calc.setViewingWindow(xMin, xMax, yMin, yMax);
        if (result) {
            this.addToHistory(`Updated viewing window: x[${xMin}, ${xMax}], y[${yMin}, ${yMax}]`);
            this.lastModified = new Date();
        }
        return result;
    }

    // ==================== STATUS & UTILITY METHODS ====================

    /**
     * Get calculator status
     */
    getCalculatorStatus() {
        const calc = this.getGraphingCalculator();
        return calc.getCalculatorStatus();
    }

    /**
     * Get total graphing items count
     */
    getTotalGraphingItems() {
        const calc = this.getGraphingCalculator();
        return calc.getTotalItemCount();
    }

    /**
     * Clear all graphing items
     */
    clearAllGraphingItems() {
        const calc = this.getGraphingCalculator();
        calc.clearAll();
        this.addToHistory('Cleared all graphing calculator items');
        this.lastModified = new Date();
    }

    /**
     * Undo last graphing item
     */
    undoLastGraphingItem() {
        const calc = this.getGraphingCalculator();
        calc.undoLast();
        this.addToHistory('Undone last graphing calculator action');
        this.lastModified = new Date();
    }

    /**
     * Save current graph
     */
    async saveCurrentGraph() {
        const calc = this.getGraphingCalculator();
        await calc.saveCurrentGraph();
    }

    // ==================== COMPREHENSIVE WORKBOOK STATUS ====================

    /**
     * Get complete workbook status including all components
     */
    getCompleteWorkbookStatus() {
        const calc = this.graphingCalculator;
        
        return {
            metadata: {
                name: this.sheetName,
                created: this.createdDate,
                lastModified: this.lastModified,
                author: this.author
            },
            spreadsheet: {
                rows: this.data.length,
                columns: this.headers.length,
                formulas: Object.keys(this.formulas).length,
                calculations: Object.keys(this.calculations).length
            },
            visualizations: {
                charts: this.charts.length,
                anatomicalDiagrams: this.anatomicalDiagrams.length,
                crossSectionDiagrams: this.crossSectionDiagrams.length,
                stereochemistryDiagrams: this.stereochemistryDiagrams.length
            },
            graphingCalculator: calc ? {
                equations: calc.equationCounter,
                triangles: calc.triangleCounter,
                circles: calc.circleCounter,
                rectangles: calc.rectangleCounter,
                squares: calc.squareCounter,
                parallelograms: calc.parallelogramCounter,
                polygons: calc.polygonCounter,
                ellipses: calc.ellipseCounter,
                quadrilaterals: calc.quadrilateralCounter,
                trapezoids: calc.trapezoidCounter,
                spheres: calc.sphereCounter,
                cylinders: calc.cylinderCounter,
                cones: calc.coneCounter,
                cubes: calc.cubeCounter,
                vectors: calc.vectorCounter,
                matrices: calc.matrixCounter || 0,
                total: calc.getTotalItemCount()
            } : {
                equations: 0,
                total: 0
            },
            history: {
                spreadsheetActions: this.history.length,
                totalActions: this.history.length
            }
        };
    }

    /**
     * Display complete workbook status
     */
    displayCompleteWorkbookStatus() {
        const status = this.getCompleteWorkbookStatus();

        console.log("\n" + "=".repeat(70));
        console.log("📊 COMPLETE WORKBOOK STATUS");
        console.log("=".repeat(70));

        console.log("\n📋 METADATA:");
        console.log(`  Name: ${status.metadata.name}`);
        console.log(`  Author: ${status.metadata.author}`);
        console.log(`  Created: ${status.metadata.created.toLocaleString()}`);
        console.log(`  Last Modified: ${status.metadata.lastModified.toLocaleString()}`);

        console.log("\n📊 SPREADSHEET:");
        console.log(`  Rows: ${status.spreadsheet.rows}`);
        console.log(`  Columns: ${status.spreadsheet.columns}`);
        console.log(`  Formulas: ${status.spreadsheet.formulas}`);
        console.log(`  Calculations: ${status.spreadsheet.calculations}`);

        console.log("\n📈 VISUALIZATIONS:");
        console.log(`  Charts: ${status.visualizations.charts}`);
        console.log(`  Anatomical Diagrams: ${status.visualizations.anatomicalDiagrams}`);
        console.log(`  Cross-Section Diagrams: ${status.visualizations.crossSectionDiagrams}`);
        console.log(`  Stereochemistry Diagrams: ${status.visualizations.stereochemistryDiagrams}`);

        console.log("\n🧮 GRAPHING CALCULATOR:");
        console.log(`  📈 Equations: ${status.graphingCalculator.equations}`);
        console.log(`  🔺 Triangles: ${status.graphingCalculator.triangles}`);
        console.log(`  ⭕ Circles: ${status.graphingCalculator.circles}`);
        console.log(`  ▭ Rectangles: ${status.graphingCalculator.rectangles}`);
        console.log(`  ▢ Squares: ${status.graphingCalculator.squares}`);
        console.log(`  ▱ Parallelograms: ${status.graphingCalculator.parallelograms}`);
        console.log(`  ⬡ Polygons: ${status.graphingCalculator.polygons}`);
        console.log(`  ⬭ Ellipses: ${status.graphingCalculator.ellipses}`);
        console.log(`  ⬢ Quadrilaterals: ${status.graphingCalculator.quadrilaterals}`);
        console.log(`  ⏢ Trapezoids: ${status.graphingCalculator.trapezoids}`);
        console.log(`  🌐 Spheres: ${status.graphingCalculator.spheres}`);
        console.log(`  🛢️ Cylinders: ${status.graphingCalculator.cylinders}`);
        console.log(`  🔺 Cones: ${status.graphingCalculator.cones}`);
        console.log(`  🧊 Cubes: ${status.graphingCalculator.cubes}`);
        console.log(`  ➡️  Vectors: ${status.graphingCalculator.vectors}`);
        console.log(`  🔢 Matrices: ${status.graphingCalculator.matrices}`);
        console.log(`  📊 Total Graphing Items: ${status.graphingCalculator.total}`);

        console.log("\n📜 HISTORY:");
        console.log(`  Total Actions: ${status.history.totalActions}`);

        console.log("\n=".repeat(70));
    }




    // ========================================================================
    // STEREOCHEMISTRY DIAGRAM MANAGEMENT METHODS
    // ========================================================================

    // Get available stereochemistry diagrams
    getAvailableStereochemistryDiagrams() {
        const diagrams = {};
        const categories = StereochemistryDiagramsRegistry.getAllCategories();

        categories.forEach(category => {
            diagrams[category] = StereochemistryDiagramsRegistry.getDiagramsByCategory(category);
        });

        return diagrams;
    }

    // Get stereochemistry diagram suggestions based on context
    suggestStereochemistryDiagrams(context = null) {
        const suggestions = [];

        // Check headers for chemistry keywords
        const hasChemistry = this.headers.some(h => 
            /molecule|compound|chemical|bond|atom|formula|reaction|chemistry/i.test(h)
        );
        
        const hasOrganic = this.headers.some(h => 
            /carbon|hydrocarbon|alkane|alkene|alkyne|organic|methane|ethane|benzene/i.test(h)
        );
        
        const hasInorganic = this.headers.some(h => 
            /sulfur|fluoride|oxide|chloride|inorganic|metal|ion/i.test(h)
        );

        const hasBiochemistry = this.headers.some(h => 
            /glucose|amino|protein|carbohydrate|lipid|biochem/i.test(h)
        );

        // Check data for chemical formulas
        const detectedFormulas = new Set();
        this.data.forEach(row => {
            Object.values(row).forEach(value => {
                if (typeof value === 'string') {
                    // Common chemical formula patterns
                    const formulaPatterns = [
                        /\bCH4\b/i, /\bC2H6\b/i, /\bC2H4\b/i, /\bH2O\b/i, 
                        /\bNH3\b/i, /\bCO2\b/i, /\bSF6\b/i, /\bC6H12O6\b/i
                    ];
                    
                    formulaPatterns.forEach(pattern => {
                        if (pattern.test(value)) {
                            const match = value.match(pattern)[0].toUpperCase().replace(/\s/g, '');
                            detectedFormulas.add(match);
                        }
                    });
                }
            });
        });

        // Add suggestions based on detected formulas
        detectedFormulas.forEach(formula => {
            const found = StereochemistryDiagramsRegistry.findByFormula(formula);
            Object.keys(found).forEach(key => {
                if (!suggestions.find(s => s.key === key)) {
                    suggestions.push({
                        key,
                        priority: 10,
                        reason: `Chemical formula ${formula} detected in data`
                    });
                }
            });
        });

        // Add context-based suggestions
        if (hasOrganic || hasChemistry) {
            if (!suggestions.find(s => s.key === 'methane')) {
                suggestions.push({ key: 'methane', priority: 9, reason: 'Organic chemistry context detected' });
            }
            if (!suggestions.find(s => s.key === 'ethane')) {
                suggestions.push({ key: 'ethane', priority: 8, reason: 'Hydrocarbon molecules' });
            }
            if (!suggestions.find(s => s.key === 'ethene')) {
                suggestions.push({ key: 'ethene', priority: 7, reason: 'Alkene structures' });
            }
        }

        if (hasInorganic) {
            if (!suggestions.find(s => s.key === 'water')) {
                suggestions.push({ key: 'water', priority: 9, reason: 'Inorganic chemistry context' });
            }
            if (!suggestions.find(s => s.key === 'ammonia')) {
                suggestions.push({ key: 'ammonia', priority: 8, reason: 'Simple inorganic molecules' });
            }
            if (!suggestions.find(s => s.key === 'sulfurHexafluoride')) {
                suggestions.push({ key: 'sulfurHexafluoride', priority: 7, reason: 'Complex inorganic structures' });
            }
        }

        if (hasBiochemistry) {
            if (!suggestions.find(s => s.key === 'glucose')) {
                suggestions.push({ key: 'glucose', priority: 9, reason: 'Biochemistry/carbohydrate data detected' });
            }
        }

        // General suggestions if no specific context
        if (suggestions.length === 0) {
            suggestions.push(
                { key: 'methane', priority: 7, reason: 'Common chemistry molecule' },
                { key: 'water', priority: 6, reason: 'Universal molecule' },
                { key: 'carbonDioxide', priority: 5, reason: 'Environmental chemistry' }
            );
        }

        return suggestions.sort((a, b) => b.priority - a.priority);
    }

    // Get stereochemistry diagram help
    getStereochemistryDiagramHelp(diagramKey) {
        const diagram = StereochemistryDiagramsRegistry.getDiagram(diagramKey);
        if (!diagram) {
            return { error: 'Stereochemistry diagram not found' };
        }

        return {
            name: diagram.name,
            formula: diagram.formula,
            category: diagram.category,
            description: diagram.description,
            geometry: diagram.geometry,
            bondAngles: diagram.bondAngles,
            centralAtom: diagram.centralAtom,
            atoms: diagram.atoms.length,
            defaultOptions: diagram.defaultOptions
        };
    }

    // Find stereochemistry diagram by formula
    findStereochemistryDiagramByFormula(formula) {
        return StereochemistryDiagramsRegistry.findByFormula(formula);
    }

    // Add stereochemistry diagram to workbook
    addStereochemistryDiagram(diagramConfig) {
        const {
            key,
            title = null,
            options = {},
            filename = null
        } = diagramConfig;

        // Validate diagram exists
        const diagram = StereochemistryDiagramsRegistry.getDiagram(key);
        if (!diagram) {
            throw new Error(`Stereochemistry diagram '${key}' not found`);
        }

        // Merge options
        const mergedOptions = { ...diagram.defaultOptions, ...options };
        if (title) mergedOptions.title = title;

        // Store diagram config
        const diagramObj = {
            id: `stereochem_${this.stereochemistryDiagrams.length + 1}`,
            key,
            type: 'stereochemistry',
            title: mergedOptions.title,
            options: mergedOptions,
            filename: filename || `${this.sheetName}_${key}_${Date.now()}.png`,
            createdAt: new Date(),
            category: diagram.category,
            formula: diagram.formula
        };

        this.stereochemistryDiagrams.push(diagramObj);
        this.addToHistory(`Added stereochemistry diagram: ${diagram.name}`);

        return diagramObj;
    }

    // Render stereochemistry diagram to PNG
    renderStereochemistryDiagramToPNG(diagramIndex) {
        if (diagramIndex < 0 || diagramIndex >= this.stereochemistryDiagrams.length) {
            throw new Error(`Stereochemistry diagram index ${diagramIndex} out of range`);
        }

        const diagramConfig = this.stereochemistryDiagrams[diagramIndex];
        
        const width = diagramConfig.options.width || 800;
        const height = diagramConfig.options.height || 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Update renderer's canvas
        this.stereochemistryRenderer.canvas = canvas;
        this.stereochemistryRenderer.ctx = ctx;

        // Render the diagram
        this.stereochemistryRenderer.renderDiagram(
            diagramConfig.key,
            0,
            0,
            width,
            height,
            diagramConfig.options
        );

        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(diagramConfig.filename, buffer);

        return {
            id: diagramConfig.id,
            filename: diagramConfig.filename,
            size: buffer.length,
            category: diagramConfig.category,
            type: 'stereochemistry',
            formula: diagramConfig.formula
        };
    }

    // Render all stereochemistry diagrams
    renderAllStereochemistryDiagrams() {
        const results = [];

        this.stereochemistryDiagrams.forEach((_, index) => {
            try {
                const result = this.renderStereochemistryDiagramToPNG(index);
                results.push(result);
            } catch (error) {
                results.push({
                    error: error.message,
                    index
                });
            }
        });

        return results;
    }

    // Get stereochemistry diagram statistics
    getStereochemistryDiagramStatistics() {
        const stats = StereochemistryDiagramsRegistry.getDiagramStats();
        return {
            totalAvailable: Object.values(stats).reduce((sum, cat) => sum + cat.count, 0),
            byCategory: stats,
            diagramsInWorkbook: this.stereochemistryDiagrams.length
        };
    }

    // Search stereochemistry diagrams
    searchStereochemistryDiagrams(query) {
        return StereochemistryDiagramsRegistry.searchDiagrams(query);
    }

    // List all stereochemistry diagrams in workbook
    listStereochemistryDiagrams() {
        return this.stereochemistryDiagrams.map((diagram, index) => ({
            index,
            id: diagram.id,
            name: diagram.title,
            formula: diagram.formula,
            type: StereochemistryDiagramsRegistry.getDiagram(diagram.key).name,
            category: diagram.category,
            filename: diagram.filename,
            created: diagram.createdAt
        }));
    }

    // Remove stereochemistry diagram
    removeStereochemistryDiagram(diagramIndex) {
        if (diagramIndex < 0 || diagramIndex >= this.stereochemistryDiagrams.length) {
            throw new Error(`Stereochemistry diagram index ${diagramIndex} out of range`);
        }

        const removed = this.stereochemistryDiagrams.splice(diagramIndex, 1);
        this.addToHistory(`Removed stereochemistry diagram: ${removed[0].title}`);
        return removed[0];
    }

    // Update stereochemistry diagram
    updateStereochemistryDiagram(diagramIndex, updates) {
        if (diagramIndex < 0 || diagramIndex >= this.stereochemistryDiagrams.length) {
            throw new Error(`Stereochemistry diagram index ${diagramIndex} out of range`);
        }

        const diagram = this.stereochemistryDiagrams[diagramIndex];
        
        if (updates.title) diagram.title = updates.title;
        if (updates.options) {
            diagram.options = { ...diagram.options, ...updates.options };
        }

        this.addToHistory(`Updated stereochemistry diagram: ${diagram.title}`);
        return diagram;
    }

    // Batch add stereochemistry diagrams by category
    addStereochemistryDiagramsByCategory(category, options = {}) {
        const diagrams = StereochemistryDiagramsRegistry.getDiagramsByCategory(category);
        const results = [];

        Object.keys(diagrams).forEach(key => {
            try {
                const result = this.addStereochemistryDiagram({
                    key,
                    options,
                    filename: `${this.sheetName}_${key}_${Date.now()}.png`
                });
                results.push(result);
            } catch (error) {
                results.push({ key, error: error.message });
            }
        });

        return results;
    }

    // Auto-detect and add stereochemistry diagrams from data
    addStereochemistryDiagramsFromData(options = {}) {
        const results = [];
        const foundFormulas = new Set();

        // Search through data for chemical formulas
        this.data.forEach(row => {
            Object.values(row).forEach(value => {
                if (typeof value === 'string') {
                    // Common chemical formula patterns
                    const formulaPattern = /\b([A-Z][a-z]?\d*)+\b/g;
                    const matches = value.match(formulaPattern);
                    
                    if (matches) {
                        matches.forEach(formula => {
                            const found = StereochemistryDiagramsRegistry.findByFormula(formula);
                            Object.keys(found).forEach(key => {
                                if (!foundFormulas.has(key)) {
                                    foundFormulas.add(key);
                                    try {
                                        const result = this.addStereochemistryDiagram({
                                            key,
                                            options,
                                            filename: `${this.sheetName}_${key}_${Date.now()}.png`
                                        });
                                        results.push({
                                            ...result,
                                            detectedIn: 'data',
                                            formula
                                        });
                                    } catch (error) {
                                        results.push({
                                            key,
                                            formula,
                                            error: error.message
                                        });
                                    }
                                }
                            });
                        });
                    }
                }
            });
        });

        return {
            results,
            totalAdded: results.filter(r => !r.error).length,
            formulas: Array.from(foundFormulas)
        };
    }

    // Export stereochemistry diagrams to a folder
    exportStereochemistryDiagramsToFolder(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const results = [];

        this.stereochemistryDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/${path.basename(diagram.filename)}`;
                
                const result = this.renderStereochemistryDiagramToPNG(index);
                results.push(result);
                
                // Restore original filename
                diagram.filename = originalFilename;
            } catch (error) {
                results.push({
                    index,
                    error: error.message
                });
            }
        });

        return {
            folder: folderPath,
            results,
            totalExported: results.filter(r => !r.error).length
        };
    }

    // Generate stereochemistry comparison report
    generateStereochemistryComparisonReport(formulas) {
        const report = {
            title: 'Molecular Structure Comparison',
            molecules: [],
            summary: {}
        };

        formulas.forEach(formula => {
            const found = this.findStereochemistryDiagramByFormula(formula);
            Object.entries(found).forEach(([key, diagram]) => {
                report.molecules.push({
                    key,
                    name: diagram.name,
                    formula: diagram.formula,
                    geometry: diagram.geometry,
                    bondAngles: diagram.bondAngles,
                    centralAtom: diagram.centralAtom,
                    category: diagram.category
                });
            });
        });

        // Generate summary
        const geometries = {};
        report.molecules.forEach(mol => {
            geometries[mol.geometry] = (geometries[mol.geometry] || 0) + 1;
        });

        report.summary = {
            totalMolecules: report.molecules.length,
            geometryDistribution: geometries,
            categories: [...new Set(report.molecules.map(m => m.category))]
        };

        return report;
    }

    // Get molecular geometry information
    getMolecularGeometryInfo(geometry) {
        const geometryInfo = {
            'tetrahedral': {
                bondAngles: [109.5],
                coordination: 4,
                description: 'Four atoms arranged at corners of a tetrahedron',
                examples: ['CH₄', 'CCl₄', 'NH₄⁺']
            },
            'bent': {
                bondAngles: [104.5, 120],
                coordination: 2,
                description: 'Two atoms with lone pairs causing bent shape',
                examples: ['H₂O', 'H₂S', 'SO₂']
            },
            'trigonal_pyramidal': {
                bondAngles: [107],
                coordination: 3,
                description: 'Three atoms with one lone pair forming pyramid',
                examples: ['NH₃', 'PH₃', 'H₃O⁺']
            },
            'trigonal_planar': {
                bondAngles: [120],
                coordination: 3,
                description: 'Three atoms in flat triangular arrangement',
                examples: ['BF₃', 'CO₃²⁻', 'C₂H₄']
            },
            'linear': {
                bondAngles: [180],
                coordination: 2,
                description: 'Two atoms in straight line',
                examples: ['CO₂', 'HCN', 'BeF₂']
            },
            'octahedral': {
                bondAngles: [90, 180],
                coordination: 6,
                description: 'Six atoms arranged at corners of octahedron',
                examples: ['SF₆', 'Fe(CN)₆³⁻', 'Co(NH₃)₆³⁺']
            }
        };

        return geometryInfo[geometry] || { error: 'Geometry not found' };
    }

    // Generate molecular properties table
    generateMolecularPropertiesTable() {
        const molecules = this.stereochemistryDiagrams;
        
        if (molecules.length === 0) {
            return { error: 'No stereochemistry diagrams in workbook' };
        }

        const table = {
            headers: ['Name', 'Formula', 'Geometry', 'Bond Angles', 'Central Atom', 'Category'],
            rows: []
        };

        molecules.forEach(mol => {
            const diagram = StereochemistryDiagramsRegistry.getDiagram(mol.key);
            if (diagram) {
                table.rows.push([
                    diagram.name,
                    diagram.formula,
                    diagram.geometry.replace(/_/g, ' '),
                    diagram.bondAngles.join(', ') + '°',
                    diagram.centralAtom || 'N/A',
                    diagram.category
                ]);
            }
        });

        return table;
    }

    // Export stereochemistry diagrams with metadata
    exportStereochemistryWithMetadata(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const results = [];
        const metadata = {
            exportDate: new Date().toISOString(),
            workbookName: this.sheetName,
            molecules: []
        };

        this.stereochemistryDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/${path.basename(diagram.filename)}`;
                
                const result = this.renderStereochemistryDiagramToPNG(index);
                results.push(result);
                
                // Add metadata
                const diagramInfo = StereochemistryDiagramsRegistry.getDiagram(diagram.key);
                metadata.molecules.push({
                    filename: path.basename(diagram.filename),
                    name: diagramInfo.name,
                    formula: diagramInfo.formula,
                    geometry: diagramInfo.geometry,
                    bondAngles: diagramInfo.bondAngles,
                    centralAtom: diagramInfo.centralAtom,
                    category: diagramInfo.category
                });
                
                diagram.filename = originalFilename;
            } catch (error) {
                results.push({
                    error: error.message,
                    diagram: diagram.key
                });
            }
        });

        // Write metadata JSON file
        const metadataPath = `${folderPath}/metadata.json`;
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        return {
            folder: folderPath,
            results,
            metadataFile: metadataPath,
            totalExported: results.filter(r => !r.error).length
        };
    }

    // ========================================================================
    // UNIFIED DIAGRAM MANAGEMENT (Anatomical + Cross-Section + Stereochemistry)
    // ========================================================================

    // Get all available diagrams
    getAllAvailableDiagrams() {
        return {
            anatomical: this.getAvailableAnatomicalDiagrams(),
            crossSection: this.getAvailableCrossSectionDiagrams(),
            stereochemistry: this.getAvailableStereochemistryDiagrams()
        };
    }

    // Search all diagrams
    searchAllDiagrams(query) {
        return {
            anatomical: this.searchAnatomicalDiagrams(query),
            crossSection: this.searchCrossSectionDiagrams(query),
            stereochemistry: this.searchStereochemistryDiagrams(query)
        };
    }

    // Get all diagram statistics
    getAllDiagramStatistics() {
        const anatomicalStats = this.getAnatomicalDiagramStatistics();
        const crossSectionStats = this.getCrossSectionDiagramStatistics();
        const stereochemStats = this.getStereochemistryDiagramStatistics();

        return {
            anatomical: anatomicalStats,
            crossSection: crossSectionStats,
            stereochemistry: stereochemStats,
            combined: {
                totalAvailable: 
                    anatomicalStats.totalDiagrams + 
                    crossSectionStats.totalAvailable + 
                    stereochemStats.totalAvailable,
                totalInWorkbook: 
                    this.anatomicalDiagrams.length + 
                    this.crossSectionDiagrams.length + 
                    this.stereochemistryDiagrams.length
            }
        };
    }

    // List all diagrams by type
    listAllDiagrams() {
        return {
            anatomical: this.listAnatomicalDiagrams(),
            crossSection: this.listCrossSectionDiagrams(),
            stereochemistry: this.listStereochemistryDiagrams(),
            total: 
                this.anatomicalDiagrams.length + 
                this.crossSectionDiagrams.length + 
                this.stereochemistryDiagrams.length
        };
    }

    // Get all diagram suggestions
    getAllDiagramSuggestions() {
        return {
            anatomical: this.suggestAnatomicalDiagrams(),
            crossSection: this.suggestCrossSectionDiagrams(),
            stereochemistry: this.suggestStereochemistryDiagrams()
        };
    }

    // Render all diagrams (anatomical + cross-section + stereochemistry)
    renderAllDiagrams() {
        const results = {
            anatomical: this.renderAllAnatomicalDiagrams(),
            crossSection: this.renderAllCrossSectionDiagrams(),
            stereochemistry: this.renderAllStereochemistryDiagrams()
        };

        return {
            ...results,
            summary: {
                anatomicalRendered: results.anatomical.filter(r => !r.error).length,
                crossSectionRendered: results.crossSection.filter(r => !r.error).length,
                stereochemistryRendered: results.stereochemistry.filter(r => !r.error).length,
                totalRendered: 
                    results.anatomical.filter(r => !r.error).length + 
                    results.crossSection.filter(r => !r.error).length +
                    results.stereochemistry.filter(r => !r.error).length,
                totalErrors: 
                    results.anatomical.filter(r => r.error).length + 
                    results.crossSection.filter(r => r.error).length +
                    results.stereochemistry.filter(r => r.error).length
            }
        };
    }

    // Export all diagrams organized by type
    exportAllDiagramsToFolder(folderPath, separateByType = true) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const results = {
            anatomical: [],
            crossSection: [],
            stereochemistry: []
        };

        if (separateByType) {
            // Create subfolders
            const anatomicalFolder = `${folderPath}/anatomical`;
            const crossSectionFolder = `${folderPath}/cross-section`;
            const stereochemFolder = `${folderPath}/stereochemistry`;
            
            [anatomicalFolder, crossSectionFolder, stereochemFolder].forEach(folder => {
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true });
                }
            });

            // Export anatomical diagrams
            const anatomicalExport = this.exportAnatomicalDiagramsToFolder(anatomicalFolder);
            results.anatomical = anatomicalExport.results;

            // Export cross-section diagrams
            const crossSectionExport = this.exportCrossSectionDiagramsToFolder(crossSectionFolder);
            results.crossSection = crossSectionExport.results;

            // Export stereochemistry diagrams
            const stereochemExport = this.exportStereochemistryDiagramsToFolder(stereochemFolder);
            results.stereochemistry = stereochemExport.results;
        } else {
            // Export all to same folder
            const anatomicalExport = this.exportAnatomicalDiagramsToFolder(folderPath);
            results.anatomical = anatomicalExport.results;

            const crossSectionExport = this.exportCrossSectionDiagramsToFolder(folderPath);
            results.crossSection = crossSectionExport.results;

            const stereochemExport = this.exportStereochemistryDiagramsToFolder(folderPath);
            results.stereochemistry = stereochemExport.results;
        }

        return {
            folder: folderPath,
            separatedByType: separateByType,
            results,
            summary: {
                anatomicalExported: results.anatomical.filter(r => !r.error).length,
                crossSectionExported: results.crossSection.filter(r => !r.error).length,
                stereochemistryExported: results.stereochemistry.filter(r => !r.error).length,
                totalExported: 
                    results.anatomical.filter(r => !r.error).length + 
                    results.crossSection.filter(r => !r.error).length +
                    results.stereochemistry.filter(r => !r.error).length,
                totalErrors: 
                    results.anatomical.filter(r => r.error).length + 
                    results.crossSection.filter(r => r.error).length +
                    results.stereochemistry.filter(r => r.error).length
            }
        };
    }

    // Batch add diagrams by category (all three types)
    addDiagramsByCategory(category, diagramType = 'all', options = {}) {
        const results = {
            anatomical: [],
            crossSection: [],
            stereochemistry: []
        };

        if (diagramType === 'anatomical' || diagramType === 'all') {
            try {
                results.anatomical = this.addAnatomicalDiagramsByCategory(category, options);
            } catch (error) {
                results.anatomical = [{ error: error.message, category, type: 'anatomical' }];
            }
        }

        if (diagramType === 'crossSection' || diagramType === 'all') {
            try {
                results.crossSection = this.addCrossSectionDiagramsByCategory(category, options);
            } catch (error) {
                results.crossSection = [{ error: error.message, category, type: 'crossSection' }];
            }
        }

        if (diagramType === 'stereochemistry' || diagramType === 'all') {
            try {
                results.stereochemistry = this.addStereochemistryDiagramsByCategory(category, options);
            } catch (error) {
                results.stereochemistry = [{ error: error.message, category, type: 'stereochemistry' }];
            }
        }

        return results;
    }

    // Generate comprehensive diagram guide
    generateComprehensiveDiagramGuide() {
        const guide = {
            title: 'Complete Scientific Diagram Reference',
            generatedAt: new Date(),
            workbook: this.sheetName,
            anatomical: {
                title: 'Anatomical Diagrams',
                categories: {},
                totalAvailable: 0
            },
            crossSection: {
                title: 'Cross-Section Diagrams',
                categories: {},
                totalAvailable: 0
            },
            stereochemistry: {
                title: 'Stereochemistry Diagrams',
                categories: {},
                totalAvailable: 0
            },
            suggestions: this.getAllDiagramSuggestions(),
            inWorkbook: this.listAllDiagrams()
        };

        // Anatomical diagrams
        const anatomicalCategories = AnatomicalDiagramsRegistry.getAllCategories();
        anatomicalCategories.forEach(category => {
            const diagrams = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);
            guide.anatomical.categories[category] = Object.entries(diagrams).map(([key, diagram]) => ({
                key,
                name: diagram.name,
                description: diagram.description,
                usage: diagram.usage,
                examples: diagram.examples
            }));
            guide.anatomical.totalAvailable += Object.keys(diagrams).length;
        });

        // Cross-section diagrams
        const crossSectionCategories = CrossSectionDiagramsRegistry.getAllCategories();
        crossSectionCategories.forEach(category => {
            const diagrams = CrossSectionDiagramsRegistry.getDiagramsByCategory(category);
            guide.crossSection.categories[category] = Object.entries(diagrams).map(([key, diagram]) => ({
                key,
                name: diagram.name,
                description: diagram.description,
                usage: diagram.usage,
                examples: diagram.examples
            }));
            guide.crossSection.totalAvailable += Object.keys(diagrams).length;
        });

        // Stereochemistry diagrams
        const stereochemCategories = StereochemistryDiagramsRegistry.getAllCategories();
        stereochemCategories.forEach(category => {
            const diagrams = StereochemistryDiagramsRegistry.getDiagramsByCategory(category);
            guide.stereochemistry.categories[category] = Object.entries(diagrams).map(([key, diagram]) => ({
                key,
                name: diagram.name,
                formula: diagram.formula,
                geometry: diagram.geometry,
                description: diagram.description,
                usage: diagram.usage,
                bondAngles: diagram.bondAngles
            }));
            guide.stereochemistry.totalAvailable += Object.keys(diagrams).length;
        });

        guide.summary = {
            totalAvailableDiagrams: 
                guide.anatomical.totalAvailable + 
                guide.crossSection.totalAvailable +
                guide.stereochemistry.totalAvailable,
            anatomicalInWorkbook: this.anatomicalDiagrams.length,
            crossSectionInWorkbook: this.crossSectionDiagrams.length,
            stereochemistryInWorkbook: this.stereochemistryDiagrams.length,
            totalInWorkbook: 
                this.anatomicalDiagrams.length + 
                this.crossSectionDiagrams.length +
                this.stereochemistryDiagrams.length
        };

        return guide;
    }

    // Generate unified report with all visualizations
    generateUnifiedVisualizationReport() {
        const baseReport = this.generateReport();
        const diagramsList = this.listAllDiagrams();
        const stats = this.getAllDiagramStatistics();

        return {
            ...baseReport,
            visualizations: {
                charts: {
                    count: this.charts.length,
                    charts: this.charts.map((chart, index) => ({
                        index,
                        type: chart.type,
                        title: chart.title
                    }))
                },
                anatomicalDiagrams: {
                    count: diagramsList.anatomical.length,
                    diagrams: diagramsList.anatomical
                },
                crossSectionDiagrams: {
                    count: diagramsList.crossSection.length,
                    diagrams: diagramsList.crossSection
                },
                stereochemistryDiagrams: {
                    count: diagramsList.stereochemistry.length,
                    diagrams: diagramsList.stereochemistry
                },
                summary: {
                    totalCharts: this.charts.length,
                    totalAnatomical: diagramsList.anatomical.length,
                    totalCrossSection: diagramsList.crossSection.length,
                    totalStereochemistry: diagramsList.stereochemistry.length,
                    totalDiagrams: diagramsList.total,
                    totalVisualizations: this.charts.length + diagramsList.total
                }
            },
            statistics: stats,
            suggestions: this.getAllDiagramSuggestions()
        };
    }

    // Quick add: Suggest and add top diagrams based on data
    quickAddSuggestedDiagrams(maxDiagrams = 5, diagramType = 'all') {
        const results = {
            anatomical: [],
            crossSection: [],
            stereochemistry: []
        };

        if (diagramType === 'anatomical' || diagramType === 'all') {
            const anatomicalSuggestions = this.suggestAnatomicalDiagrams().slice(0, maxDiagrams);
            anatomicalSuggestions.forEach(suggestion => {
                try {
                    const diagram = this.addAnatomicalDiagram({ key: suggestion.key });
                    results.anatomical.push({
                        ...diagram,
                        reason: suggestion.reason
                    });
                } catch (error) {
                    results.anatomical.push({
                        key: suggestion.key,
                        error: error.message
                    });
                }
            });
        }

        if (diagramType === 'crossSection' || diagramType === 'all') {
            const crossSectionSuggestions = this.suggestCrossSectionDiagrams().slice(0, maxDiagrams);
            crossSectionSuggestions.forEach(suggestion => {
                try {
                    const diagram = this.addCrossSectionDiagram({ key: suggestion.key });
                    results.crossSection.push({
                        ...diagram,
                        reason: suggestion.reason
                    });
                } catch (error) {
                    results.crossSection.push({
                        key: suggestion.key,
                        error: error.message
                    });
                }
            });
        }

        if (diagramType === 'stereochemistry' || diagramType === 'all') {
            const stereochemSuggestions = this.suggestStereochemistryDiagrams().slice(0, maxDiagrams);
            stereochemSuggestions.forEach(suggestion => {
                try {
                    const diagram = this.addStereochemistryDiagram({ key: suggestion.key });
                    results.stereochemistry.push({
                        ...diagram,
                        reason: suggestion.reason
                    });
                } catch (error) {
                    results.stereochemistry.push({
                        key: suggestion.key,
                        error: error.message
                    });
                }
            });
        }

        return results;
    }

    // Get diagram by ID (searches all three types)
    getDiagramById(diagramId) {
        const anatomical = this.anatomicalDiagrams.find(d => d.id === diagramId);
        if (anatomical) return { ...anatomical, type: 'anatomical' };

        const crossSection = this.crossSectionDiagrams.find(d => d.id === diagramId);
        if (crossSection) return { ...crossSection, type: 'crossSection' };

        const stereochemistry = this.stereochemistryDiagrams.find(d => d.id === diagramId);
        if (stereochemistry) return { ...stereochemistry, type: 'stereochemistry' };

        return null;
    }

    // Remove diagram by ID (searches all three types)
    removeDiagramById(diagramId) {
        const anatomicalIndex = this.anatomicalDiagrams.findIndex(d => d.id === diagramId);
        if (anatomicalIndex !== -1) {
            return this.removeAnatomicalDiagram(anatomicalIndex);
        }

        const crossSectionIndex = this.crossSectionDiagrams.findIndex(d => d.id === diagramId);
        if (crossSectionIndex !== -1) {
            return this.removeCrossSectionDiagram(crossSectionIndex);
        }

        const stereochemIndex = this.stereochemistryDiagrams.findIndex(d => d.id === diagramId);
        if (stereochemIndex !== -1) {
            return this.removeStereochemistryDiagram(stereochemIndex);
        }

        throw new Error(`Diagram with ID ${diagramId} not found`);
    }

    // Get diagram by identifier (searches all registries)
    getDiagramByIdentifier(identifier) {
        // Try as key in stereochemistry first (for formula support)
        let diagram = StereochemistryDiagramsRegistry.getDiagram(identifier);
        if (diagram) return { type: 'stereochemistry', diagram };

        // Try as formula
        const byFormula = StereochemistryDiagramsRegistry.findByFormula(identifier);
        if (Object.keys(byFormula).length > 0) {
            return { type: 'stereochemistry', diagrams: byFormula };
        }

        // Try anatomical
        diagram = AnatomicalDiagramsRegistry.getDiagram(identifier);
        if (diagram) return { type: 'anatomical', diagram };

        // Try cross-section
        diagram = CrossSectionDiagramsRegistry.getDiagram(identifier);
        if (diagram) return { type: 'crossSection', diagram };

        return { error: 'Diagram not found' };
    }

    // Generate complete diagram catalog
    generateDiagramCatalog() {
        const catalog = {
            metadata: {
                generated: new Date().toISOString(),
                workbook: this.sheetName,
                author: this.author
            },
            anatomical: {
                available: AnatomicalDiagramsRegistry.getAllDiagrams().length,
                inWorkbook: this.anatomicalDiagrams.length,
                categories: AnatomicalDiagramsRegistry.getAllCategories()
            },
            crossSection: {
                available: CrossSectionDiagramsRegistry.getAllDiagrams().length,
                inWorkbook: this.crossSectionDiagrams.length,
                categories: CrossSectionDiagramsRegistry.getAllCategories()
            },
            stereochemistry: {
                available: StereochemistryDiagramsRegistry.getAllDiagrams().length,
                inWorkbook: this.stereochemistryDiagrams.length,
                categories: StereochemistryDiagramsRegistry.getAllCategories(),
                formulas: Object.values(StereochemistryDiagramsRegistry.diagrams).map(d => d.formula)
            },
            totalDiagrams: {
                available: 
                    AnatomicalDiagramsRegistry.getAllDiagrams().length +
                    CrossSectionDiagramsRegistry.getAllDiagrams().length +
                    StereochemistryDiagramsRegistry.getAllDiagrams().length,
                inWorkbook: 
                    this.anatomicalDiagrams.length +
                    this.crossSectionDiagrams.length +
                    this.stereochemistryDiagrams.length
            }
        };

        return catalog;
    }

    // Count diagrams by type
    getDiagramCounts() {
        return {
            anatomical: this.anatomicalDiagrams.length,
            crossSection: this.crossSectionDiagrams.length,
            stereochemistry: this.stereochemistryDiagrams.length,
            total: 
                this.anatomicalDiagrams.length + 
                this.crossSectionDiagrams.length + 
                this.stereochemistryDiagrams.length
        };
    }

    // Check if workbook has diagrams of specific type
    hasDiagramsOfType(type) {
        const counts = this.getDiagramCounts();
        switch(type) {
            case 'anatomical':
                return counts.anatomical > 0;
            case 'crossSection':
                return counts.crossSection > 0;
            case 'stereochemistry':
                return counts.stereochemistry > 0;
            case 'any':
                return counts.total > 0;
            default:
                return false;
        }
    }

    // Get all diagrams of specific category across all types
    getAllDiagramsByCategory(category) {
        const results = {
            anatomical: [],
            crossSection: [],
            stereochemistry: []
        };

        // Check anatomical
        const anatomicalInCategory = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);
        results.anatomical = this.anatomicalDiagrams.filter(d => 
            Object.keys(anatomicalInCategory).includes(d.key)
        );

        // Check cross-section
        const crossSectionInCategory = CrossSectionDiagramsRegistry.getDiagramsByCategory(category);
        results.crossSection = this.crossSectionDiagrams.filter(d => 
            Object.keys(crossSectionInCategory).includes(d.key)
        );

        // Check stereochemistry
        const stereochemInCategory = StereochemistryDiagramsRegistry.getDiagramsByCategory(category);
        results.stereochemistry = this.stereochemistryDiagrams.filter(d => 
            Object.keys(stereochemInCategory).includes(d.key)
        );

        return results;
    }

    // Export diagrams with comprehensive metadata
    exportDiagramsWithFullMetadata(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const results = {
            anatomical: [],
            crossSection: [],
            stereochemistry: []
        };

        const metadata = {
            exportDate: new Date().toISOString(),
            workbook: this.sheetName,
            author: this.author,
            diagrams: {
                anatomical: [],
                crossSection: [],
                stereochemistry: []
            }
        };

        // Export anatomical
        this.anatomicalDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/anatomical_${path.basename(diagram.filename)}`;
                
                const result = this.renderAnatomicalDiagramToPNG(index);
                results.anatomical.push(result);
                
                const diagramInfo = AnatomicalDiagramsRegistry.getDiagram(diagram.key);
                metadata.diagrams.anatomical.push({
                    filename: path.basename(diagram.filename),
                    name: diagramInfo.name,
                    category: diagramInfo.category,
                    description: diagramInfo.description
                });
                
                diagram.filename = originalFilename;
            } catch (error) {
                results.anatomical.push({ error: error.message, diagram: diagram.key });
            }
        });

        // Export cross-section
        this.crossSectionDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/crosssection_${path.basename(diagram.filename)}`;
                
                const result = this.renderCrossSectionDiagramToPNG(index);
                results.crossSection.push(result);
                
                const diagramInfo = CrossSectionDiagramsRegistry.getDiagram(diagram.key);
                metadata.diagrams.crossSection.push({
                    filename: path.basename(diagram.filename),
                    name: diagramInfo.name,
                    category: diagramInfo.category,
                    description: diagramInfo.description
                });
                
                diagram.filename = originalFilename;
            } catch (error) {
                results.crossSection.push({ error: error.message, diagram: diagram.key });
            }
        });

        // Export stereochemistry
        this.stereochemistryDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/molecule_${path.basename(diagram.filename)}`;
                
                const result = this.renderStereochemistryDiagramToPNG(index);
                results.stereochemistry.push(result);
                
                const diagramInfo = StereochemistryDiagramsRegistry.getDiagram(diagram.key);
                metadata.diagrams.stereochemistry.push({
                    filename: path.basename(diagram.filename),
                    name: diagramInfo.name,
                    formula: diagramInfo.formula,
                    geometry: diagramInfo.geometry,
                    bondAngles: diagramInfo.bondAngles,
                    category: diagramInfo.category
                });
                
                diagram.filename = originalFilename;
            } catch (error) {
                results.stereochemistry.push({ error: error.message, diagram: diagram.key });
            }
        });

        // Write metadata JSON file
        const metadataPath = `${folderPath}/complete_metadata.json`;
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        return {
            folder: folderPath,
            results,
            metadataFile: metadataPath,
            summary: {
                anatomicalExported: results.anatomical.filter(r => !r.error).length,
                crossSectionExported: results.crossSection.filter(r => !r.error).length,
                stereochemistryExported: results.stereochemistry.filter(r => !r.error).length,
                totalExported: 
                    results.anatomical.filter(r => !r.error).length +
                    results.crossSection.filter(r => !r.error).length +
                    results.stereochemistry.filter(r => !r.error).length,
                totalErrors: 
                    results.anatomical.filter(r => r.error).length +
                    results.crossSection.filter(r => r.error).length +
                    results.stereochemistry.filter(r => r.error).length
            }
        };
    }

    // Generate comparison report for all diagram types
    generateDiagramTypeComparisonReport() {
        return {
            title: 'Diagram Type Comparison Report',
            workbook: this.sheetName,
            generatedAt: new Date().toISOString(),
            anatomical: {
                count: this.anatomicalDiagrams.length,
                availableCount: AnatomicalDiagramsRegistry.getAllDiagrams().length,
                categories: AnatomicalDiagramsRegistry.getAllCategories(),
                utilizationRate: this.anatomicalDiagrams.length / AnatomicalDiagramsRegistry.getAllDiagrams().length
            },
            crossSection: {
                count: this.crossSectionDiagrams.length,
                availableCount: CrossSectionDiagramsRegistry.getAllDiagrams().length,
                categories: CrossSectionDiagramsRegistry.getAllCategories(),
                utilizationRate: this.crossSectionDiagrams.length / CrossSectionDiagramsRegistry.getAllDiagrams().length
            },
            stereochemistry: {
                count: this.stereochemistryDiagrams.length,
                availableCount: StereochemistryDiagramsRegistry.getAllDiagrams().length,
                categories: StereochemistryDiagramsRegistry.getAllCategories(),
                formulas: this.stereochemistryDiagrams.map(d => d.formula),
                utilizationRate: this.stereochemistryDiagrams.length / StereochemistryDiagramsRegistry.getAllDiagrams().length
            },
            summary: {
                totalDiagrams: 
                    this.anatomicalDiagrams.length + 
                    this.crossSectionDiagrams.length + 
                    this.stereochemistryDiagrams.length,
                totalAvailable: 
                    AnatomicalDiagramsRegistry.getAllDiagrams().length +
                    CrossSectionDiagramsRegistry.getAllDiagrams().length +
                    StereochemistryDiagramsRegistry.getAllDiagrams().length,
                overallUtilizationRate: 
                    (this.anatomicalDiagrams.length + this.crossSectionDiagrams.length + this.stereochemistryDiagrams.length) /
                    (AnatomicalDiagramsRegistry.getAllDiagrams().length + CrossSectionDiagramsRegistry.getAllDiagrams().length + StereochemistryDiagramsRegistry.getAllDiagrams().length)
            }
        };
    }

    // Clear all diagrams of specific type
    clearDiagramsByType(type) {
        const removed = {
            anatomical: 0,
            crossSection: 0,
            stereochemistry: 0
        };

        switch(type) {
            case 'anatomical':
                removed.anatomical = this.anatomicalDiagrams.length;
                this.anatomicalDiagrams = [];
                this.addToHistory(`Cleared all anatomical diagrams (${removed.anatomical})`);
                break;
            case 'crossSection':
                removed.crossSection = this.crossSectionDiagrams.length;
                this.crossSectionDiagrams = [];
                this.addToHistory(`Cleared all cross-section diagrams (${removed.crossSection})`);
                break;
            case 'stereochemistry':
                removed.stereochemistry = this.stereochemistryDiagrams.length;
                this.stereochemistryDiagrams = [];
                this.addToHistory(`Cleared all stereochemistry diagrams (${removed.stereochemistry})`);
                break;
            case 'all':
                removed.anatomical = this.anatomicalDiagrams.length;
                removed.crossSection = this.crossSectionDiagrams.length;
                removed.stereochemistry = this.stereochemistryDiagrams.length;
                this.anatomicalDiagrams = [];
                this.crossSectionDiagrams = [];
                this.stereochemistryDiagrams = [];
                this.addToHistory(`Cleared all diagrams (${removed.anatomical + removed.crossSection + removed.stereochemistry})`);
                break;
            default:
                throw new Error(`Invalid diagram type: ${type}`);
        }

        return removed;
    }

    // Get comprehensive workbook summary
    getWorkbookSummary() {
        return {
            metadata: {
                name: this.sheetName,
                created: this.createdDate,
                lastModified: this.lastModified,
                author: this.author
            },
            data: {
                rows: this.data.length,
                columns: this.headers.length,
                headers: this.headers
            },
            visualizations: {
                charts: this.charts.length,
                diagrams: {
                    anatomical: this.anatomicalDiagrams.length,
                    crossSection: this.crossSectionDiagrams.length,
                    stereochemistry: this.stereochemistryDiagrams.length,
                    total: this.getDiagramCounts().total
                }
            },
            history: {
                entries: this.history.length,
                lastAction: this.history[this.history.length - 1] || null
            }
        };
    }


  // ========================================================================
    // CROSS-SECTION DIAGRAM MANAGEMENT METHODS
    // ========================================================================

    // Get available cross-section diagrams
   // ========================================================================
    // CROSS-SECTION DIAGRAM MANAGEMENT METHODS
    // ========================================================================

    // Get available cross-section diagrams
    getAvailableCrossSectionDiagrams() {
        const diagrams = {};
        const categories = CrossSectionDiagramsRegistry.getAllCategories();

        categories.forEach(category => {
            diagrams[category] = CrossSectionDiagramsRegistry.getDiagramsByCategory(category);
        });

        return diagrams;
    }

    // Get cross-section diagram suggestions based on context
    suggestCrossSectionDiagrams(context = null) {
        const suggestions = [];

        // Check headers for relevant keywords
        const hasBotany = this.headers.some(h => 
            /plant|leaf|stem|root|seed|fruit|flower|botany/i.test(h)
        );
        
        const hasZoology = this.headers.some(h => 
            /animal|insect|fish|brain|intestine|gill|zoology/i.test(h)
        );
        
        const hasGeography = this.headers.some(h => 
            /earth|mountain|volcano|river|valley|soil|glacier|coast|geology|landform/i.test(h)
        );

        const hasAgriculture = this.headers.some(h => 
            /farm|crop|agriculture|irrigation|greenhouse|compost|pond|cultivat/i.test(h)
        );

        // Add suggestions based on context
        if (hasBotany) {
            suggestions.push(
                { key: 'dicotLeafCrossSection', priority: 10, reason: 'Plant anatomy data detected' },
                { key: 'dicotStemCrossSection', priority: 9, reason: 'Plant structure context' },
                { key: 'rootTipCrossSection', priority: 8, reason: 'Plant growth data' },
                { key: 'seedCrossSection', priority: 7, reason: 'Plant reproduction context' }
            );
        }

        if (hasZoology) {
            suggestions.push(
                { key: 'brainCrossSection', priority: 10, reason: 'Animal anatomy detected' },
                { key: 'smallIntestineCrossSection', priority: 9, reason: 'Digestive system context' },
                { key: 'fishGillsCrossSection', priority: 8, reason: 'Aquatic anatomy' },
                { key: 'insectThoraxCrossSection', priority: 7, reason: 'Invertebrate anatomy' }
            );
        }

        if (hasGeography) {
            suggestions.push(
                { key: 'earthCrossSection', priority: 10, reason: 'Geological data detected' },
                { key: 'volcanoCrossSection', priority: 9, reason: 'Volcanic/geological context' },
                { key: 'riverValleyCrossSection', priority: 8, reason: 'Landform data' },
                { key: 'soilProfileCrossSection', priority: 7, reason: 'Soil science context' }
            );
        }

        if (hasAgriculture) {
            suggestions.push(
                { key: 'greenhouseCrossSection', priority: 10, reason: 'Agricultural structure detected' },
                { key: 'soilProfileCrossSection', priority: 9, reason: 'Soil/cultivation data' },
                { key: 'terraceFarmCrossSection', priority: 8, reason: 'Farming systems context' },
                { key: 'fishPondCrossSection', priority: 7, reason: 'Aquaculture data' }
            );
        }

        // General suggestions if no specific context
        if (suggestions.length === 0) {
            suggestions.push(
                { key: 'dicotLeafCrossSection', priority: 7, reason: 'Popular biology diagram' },
                { key: 'earthCrossSection', priority: 6, reason: 'Earth science education' },
                { key: 'soilProfileCrossSection', priority: 5, reason: 'Environmental science' }
            );
        }

        return suggestions.sort((a, b) => b.priority - a.priority);
    }

    // Get cross-section diagram help
    getCrossSectionDiagramHelp(diagramKey) {
        const diagram = CrossSectionDiagramsRegistry.getDiagram(diagramKey);
        if (!diagram) {
            return { error: 'Cross-section diagram not found' };
        }

        return {
            name: diagram.name,
            category: diagram.category,
            description: diagram.description,
            usage: diagram.usage,
            examples: diagram.examples,
            dataRequired: diagram.dataRequired,
            defaultOptions: diagram.defaultOptions
        };
    }

    // Add cross-section diagram to workbook
    addCrossSectionDiagram(diagramConfig) {
        const {
            key,
            title = null,
            options = {},
            filename = null
        } = diagramConfig;

        // Validate diagram exists
        const diagram = CrossSectionDiagramsRegistry.getDiagram(key);
        if (!diagram) {
            throw new Error(`Cross-section diagram '${key}' not found`);
        }

        // Merge options
        const mergedOptions = { ...diagram.defaultOptions, ...options };
        if (title) mergedOptions.title = title;

        // Store diagram config
        const diagramObj = {
            id: `crosssection_${this.crossSectionDiagrams.length + 1}`,
            key,
            type: 'crossSection',
            title: mergedOptions.title,
            options: mergedOptions,
            filename: filename || `${this.sheetName}_${key}_${Date.now()}.png`,
            createdAt: new Date(),
            category: diagram.category
        };

        this.crossSectionDiagrams.push(diagramObj);
        this.addToHistory(`Added cross-section diagram: ${diagram.name}`);

        return diagramObj;
    }

    // Render cross-section diagram to PNG
    renderCrossSectionDiagramToPNG(diagramIndex) {
        if (diagramIndex < 0 || diagramIndex >= this.crossSectionDiagrams.length) {
            throw new Error(`Cross-section diagram index ${diagramIndex} out of range`);
        }

        const diagramConfig = this.crossSectionDiagrams[diagramIndex];
        
        const width = diagramConfig.options.width || 800;
        const height = diagramConfig.options.height || 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Update renderer's canvas
        this.crossSectionRenderer.canvas = canvas;
        this.crossSectionRenderer.ctx = ctx;

        // Render the diagram
        this.crossSectionRenderer.renderDiagram(
            diagramConfig.key,
            50,
            80,
            width - 100,
            height - 100,
            diagramConfig.options
        );

        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(diagramConfig.filename, buffer);

        return {
            id: diagramConfig.id,
            filename: diagramConfig.filename,
            size: buffer.length,
            category: diagramConfig.category,
            type: 'crossSection'
        };
    }

    // Render all cross-section diagrams
    renderAllCrossSectionDiagrams() {
        const results = [];

        this.crossSectionDiagrams.forEach((_, index) => {
            try {
                const result = this.renderCrossSectionDiagramToPNG(index);
                results.push(result);
            } catch (error) {
                results.push({
                    error: error.message,
                    index
                });
            }
        });

        return results;
    }

    // Get cross-section diagram statistics
    getCrossSectionDiagramStatistics() {
        const stats = CrossSectionDiagramsRegistry.getDiagramStats();
        return {
            totalAvailable: Object.values(stats).reduce((sum, cat) => sum + cat.count, 0),
            byCategory: stats,
            diagramsInWorkbook: this.crossSectionDiagrams.length
        };
    }

    // Search cross-section diagrams
    searchCrossSectionDiagrams(query) {
        return CrossSectionDiagramsRegistry.searchDiagrams(query);
    }

    // List all cross-section diagrams in workbook
    listCrossSectionDiagrams() {
        return this.crossSectionDiagrams.map((diagram, index) => ({
            index,
            id: diagram.id,
            name: diagram.title,
            type: CrossSectionDiagramsRegistry.getDiagram(diagram.key).name,
            category: diagram.category,
            filename: diagram.filename,
            created: diagram.createdAt
        }));
    }

    // Remove cross-section diagram
    removeCrossSectionDiagram(diagramIndex) {
        if (diagramIndex < 0 || diagramIndex >= this.crossSectionDiagrams.length) {
            throw new Error(`Cross-section diagram index ${diagramIndex} out of range`);
        }

        const removed = this.crossSectionDiagrams.splice(diagramIndex, 1);
        this.addToHistory(`Removed cross-section diagram: ${removed[0].title}`);
        return removed[0];
    }

    // Update cross-section diagram
    updateCrossSectionDiagram(diagramIndex, updates) {
        if (diagramIndex < 0 || diagramIndex >= this.crossSectionDiagrams.length) {
            throw new Error(`Cross-section diagram index ${diagramIndex} out of range`);
        }

        const diagram = this.crossSectionDiagrams[diagramIndex];
        
        if (updates.title) diagram.title = updates.title;
        if (updates.options) {
            diagram.options = { ...diagram.options, ...updates.options };
        }

        this.addToHistory(`Updated cross-section diagram: ${diagram.title}`);
        return diagram;
    }

    // Batch add cross-section diagrams by category
    addCrossSectionDiagramsByCategory(category, options = {}) {
        const diagrams = CrossSectionDiagramsRegistry.getDiagramsByCategory(category);
        const results = [];

        Object.keys(diagrams).forEach(key => {
            try {
                const result = this.addCrossSectionDiagram({
                    key,
                    options,
                    filename: `${this.sheetName}_${key}_${Date.now()}.png`
                });
                results.push(result);
            } catch (error) {
                results.push({ key, error: error.message });
            }
        });

        return results;
    }

    // Export cross-section diagrams to a folder
    exportCrossSectionDiagramsToFolder(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const results = [];

        this.crossSectionDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/${path.basename(diagram.filename)}`;
                
                const result = this.renderCrossSectionDiagramToPNG(index);
                results.push(result);
                
                // Restore original filename
                diagram.filename = originalFilename;
            } catch (error) {
                results.push({
                    index,
                    error: error.message
                });
            }
        });

        return {
            folder: folderPath,
            results,
            totalExported: results.filter(r => !r.error).length
        };
    }



    // ========================================================================
    // CHART MANAGEMENT METHODS
    // ========================================================================

    // Get available charts
    getAvailableCharts() {
        const charts = {};
        const categories = ExcelChartsRegistry.getAllCategories();

        categories.forEach(category => {
            charts[category] = ExcelChartsRegistry.getChartsByCategory(category);
        });

        return charts;
    }

    // Get chart suggestions based on data
    suggestCharts(dataRange = null) {
        const suggestions = [];

        // Check data structure
        const hasNumericData = this.data.some(row =>
            row.some(cell => !isNaN(parseFloat(cell)))
        );

        const hasMultipleSeries = this.data.length > 3;
        const hasMultipleColumns = this.data[0]?.length > 2;

        // Basic suggestions
        if (hasNumericData) {
            suggestions.push({
                key: 'columnChart',
                priority: 10,
                reason: 'Great for comparing values across categories'
            });

            suggestions.push({
                key: 'pieChart',
                priority: 9,
                reason: 'Perfect for showing composition/parts of whole'
            });
        }

        if (hasMultipleSeries) {
            suggestions.push({
                key: 'lineChart',
                priority: 8,
                reason: 'Excellent for showing trends over time'
            });

            suggestions.push({
                key: 'areaChart',
                priority: 7,
                reason: 'Good for showing cumulative trends'
            });
        }

        if (hasMultipleColumns && this.data.length > 5) {
            suggestions.push({
                key: 'radarChart',
                priority: 7,
                reason: 'Great for comparing multiple attributes'
            });
        }

        return suggestions.sort((a, b) => b.priority - a.priority);
    }

    // Get chart help
    getChartHelp(chartKey) {
        const chart = ExcelChartsRegistry.getChart(chartKey);
        if (!chart) {
            return { error: 'Chart not found' };
        }

        return {
            name: chart.name,
            category: chart.category,
            description: chart.description,
            excel: chart.excel,
            usage: chart.usage,
            examples: chart.examples,
            dataRequired: chart.dataRequired,
            defaultOptions: chart.defaultOptions
        };
    }

    // Add chart to workbook
    addChart(chartConfig) {
        const {
            key,
            title = null,
            data,
            options = {},
            filename = null
        } = chartConfig;

        // Validate chart exists
        const chart = ExcelChartsRegistry.getChart(key);
        if (!chart) {
            throw new Error(`Chart '${key}' not found`);
        }

        // Validate data
        const validation = ExcelChartsRegistry.validateChartData(key, data);
        if (!validation.valid) {
            throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
        }

        // Merge options
        const mergedOptions = { ...chart.defaultOptions, ...options };
        if (title) mergedOptions.title = title;

        // Store chart config
        const chartObj = {
            id: `chart_${this.charts.length + 1}`,
            key,
            title: mergedOptions.title,
            data,
            options: mergedOptions,
            filename: filename || `${this.sheetName}_${key}_${Date.now()}.png`,
            createdAt: new Date()
        };

        this.charts.push(chartObj);
        this.addToHistory(`Added chart: ${chart.name}`);

        return chartObj;
    }

    // Render chart to PNG
    renderChartToPNG(chartIndex) {
        if (chartIndex < 0 || chartIndex >= this.charts.length) {
            throw new Error(`Chart index ${chartIndex} out of range`);
        }

        const chartConfig = this.charts[chartIndex];
        
        const canvas = createCanvas(chartConfig.options.width, chartConfig.options.height);
        const ctx = canvas.getContext('2d');

        // Render the chart
        this.chartRenderer.renderChart(canvas, ctx, chartConfig.key, chartConfig.data, chartConfig.options);

        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(chartConfig.filename, buffer);

        return {
            id: chartConfig.id,
            filename: chartConfig.filename,
            size: buffer.length
        };
    }

    // Render all charts
    renderAllCharts() {
        const results = [];

        this.charts.forEach((_, index) => {
            try {
                const result = this.renderChartToPNG(index);
                results.push(result);
            } catch (error) {
                results.push({
                    error: error.message,
                    index
                });
            }
        });

        return results;
    }

    // Get chart statistics
    getChartStatistics() {
        const stats = ExcelChartsRegistry.getChartStats();
        return {
            totalCharts: Object.values(stats).reduce((sum, cat) => sum + cat.count, 0),
            byCategory: stats,
            chartsInWorkbook: this.charts.length
        };
    }

    // Search charts
    searchCharts(query) {
        return ExcelChartsRegistry.searchCharts(query);
    }

    // List all charts in workbook
    listCharts() {
        return this.charts.map((chart, index) => ({
            index,
            id: chart.id,
            name: chart.title,
            type: ExcelChartsRegistry.getChart(chart.key).name,
            filename: chart.filename,
            created: chart.createdAt
        }));
    }

    // Remove chart
    removeChart(chartIndex) {
        if (chartIndex < 0 || chartIndex >= this.charts.length) {
            throw new Error(`Chart index ${chartIndex} out of range`);
        }

        const removed = this.charts.splice(chartIndex, 1);
        this.addToHistory(`Removed chart: ${removed[0].title}`);
        return removed[0];
    }

    // Update chart
    updateChart(chartIndex, updates) {
        if (chartIndex < 0 || chartIndex >= this.charts.length) {
            throw new Error(`Chart index ${chartIndex} out of range`);
        }

        const chart = this.charts[chartIndex];
        
        if (updates.title) chart.title = updates.title;
        if (updates.data) chart.data = updates.data;
        if (updates.options) {
            chart.options = { ...chart.options, ...updates.options };
        }

        this.addToHistory(`Updated chart: ${chart.title}`);
        return chart;
    }



       // ========================================================================
    // ANATOMICAL DIAGRAM MANAGEMENT METHODS
    // ========================================================================

    // Get available anatomical diagrams
    getAvailableAnatomicalDiagrams() {
        const diagrams = {};
        const categories = AnatomicalDiagramsRegistry.getAllCategories();

        categories.forEach(category => {
            diagrams[category] = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);
        });

        return diagrams;
    }

    // Get diagram suggestions based on context
    suggestAnatomicalDiagrams(context = null) {
        const suggestions = [];

        // Check headers for medical/anatomical keywords
        const hasCardiovascular = this.headers.some(h => 
            /heart|blood|artery|vein|circulation|cardiac/i.test(h)
        );
        
        const hasRespiratory = this.headers.some(h => 
            /lung|breath|respiratory|oxygen|co2/i.test(h)
        );
        
        const hasDigestive = this.headers.some(h => 
            /stomach|intestine|digest|food|nutrition/i.test(h)
        );

        const hasNervous = this.headers.some(h => 
            /brain|nerve|neural|neuron|spine/i.test(h)
        );

        const hasSkeletal = this.headers.some(h => 
            /bone|skeleton|skull|spine|fracture/i.test(h)
        );

        // Add suggestions based on context
        if (hasCardiovascular) {
            suggestions.push({
                key: 'heartAnatomy',
                priority: 10,
                reason: 'Cardiovascular data detected in headers'
            });
            suggestions.push({
                key: 'circulatorySystem',
                priority: 9,
                reason: 'Blood circulation context identified'
            });
        }

        if (hasRespiratory) {
            suggestions.push({
                key: 'respiratorySystem',
                priority: 10,
                reason: 'Respiratory data detected'
            });
        }

        if (hasDigestive) {
            suggestions.push({
                key: 'digestiveSystem',
                priority: 10,
                reason: 'Digestive system data detected'
            });
        }

        if (hasNervous) {
            suggestions.push({
                key: 'nervousSystem',
                priority: 10,
                reason: 'Nervous system data detected'
            });
            suggestions.push({
                key: 'neuronStructure',
                priority: 8,
                reason: 'Neural anatomy context'
            });
        }

        if (hasSkeletal) {
            suggestions.push({
                key: 'skull',
                priority: 9,
                reason: 'Skeletal data detected'
            });
            suggestions.push({
                key: 'boneStructure',
                priority: 8,
                reason: 'Bone anatomy context'
            });
        }

        // General suggestions if no specific context
        if (suggestions.length === 0) {
            suggestions.push(
                { key: 'heartAnatomy', priority: 7, reason: 'Popular anatomy diagram' },
                { key: 'cellStructure', priority: 6, reason: 'Fundamental biology' },
                { key: 'bloodCells', priority: 5, reason: 'Common medical reference' }
            );
        }

        return suggestions.sort((a, b) => b.priority - a.priority);
    }

    // Get diagram help
    getAnatomicalDiagramHelp(diagramKey) {
        const diagram = AnatomicalDiagramsRegistry.getDiagram(diagramKey);
        if (!diagram) {
            return { error: 'Diagram not found' };
        }

        return {
            name: diagram.name,
            category: diagram.category,
            description: diagram.description,
            usage: diagram.usage,
            examples: diagram.examples,
            dataRequired: diagram.dataRequired,
            defaultOptions: diagram.defaultOptions,
            chamberOptions: diagram.chamberOptions || null
        };
    }

    // Add anatomical diagram to workbook
    addAnatomicalDiagram(diagramConfig) {
        const {
            key,
            title = null,
            options = {},
            filename = null
        } = diagramConfig;

        // Validate diagram exists
        const diagram = AnatomicalDiagramsRegistry.getDiagram(key);
        if (!diagram) {
            throw new Error(`Anatomical diagram '${key}' not found`);
        }

        // Merge options
        const mergedOptions = { ...diagram.defaultOptions, ...options };
        if (title) mergedOptions.title = title;

        // Store diagram config
        const diagramObj = {
            id: `diagram_${this.anatomicalDiagrams.length + 1}`,
            key,
            title: mergedOptions.title,
            options: mergedOptions,
            filename: filename || `${this.sheetName}_${key}_${Date.now()}.png`,
            createdAt: new Date(),
            category: diagram.category
        };

        this.anatomicalDiagrams.push(diagramObj);
        this.addToHistory(`Added anatomical diagram: ${diagram.name}`);

        return diagramObj;
    }

    // Render anatomical diagram to PNG
    renderAnatomicalDiagramToPNG(diagramIndex) {
        if (diagramIndex < 0 || diagramIndex >= this.anatomicalDiagrams.length) {
            throw new Error(`Diagram index ${diagramIndex} out of range`);
        }

        const diagramConfig = this.anatomicalDiagrams[diagramIndex];
        
        
        const width = diagramConfig.options.width || 800;
        const height = diagramConfig.options.height || 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Update renderer's canvas
        this.diagramRenderer.canvas = canvas;
        this.diagramRenderer.ctx = ctx;

        // Render the appropriate diagram
        this.renderSpecificDiagram(diagramConfig.key, diagramConfig.options);

        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(diagramConfig.filename, buffer);

        return {
            id: diagramConfig.id,
            filename: diagramConfig.filename,
            size: buffer.length,
            category: diagramConfig.category
        };
    }

    // Helper method to render specific diagram types
    renderSpecificDiagram(key, options) {
        const x = 0;
        const y = 0;
        const width = options.width || 800;
        const height = options.height || 600;

        switch (key) {
            case 'heartAnatomy':
                this.diagramRenderer.renderHeartAnatomyDiagram(x, y, width, height, options);
                break;
            case 'circulatorySystem':
                this.diagramRenderer.renderCirculatorySystemDiagram(x, y, width, height, options);
                break;
            case 'bloodVesselComparison':
                this.diagramRenderer.renderBloodVesselComparison(x, y, width, height, options);
                break;
            case 'heartValves':
                this.diagramRenderer.renderHeartValvesDiagram(x, y, width, height, options);
                break;
            case 'respiratorySystem':
                this.diagramRenderer.renderRespiratorySystemDiagram(x, y, width, height, options);
                break;
            case 'digestiveSystem':
                this.diagramRenderer.renderDigestiveSystemDiagram(x, y, width, height, options);
                break;
            case 'digestiveOrgans':
                this.diagramRenderer.renderDigestiveOrganComparison(x, y, width, height);
                break;
            case 'nervousSystem':
                this.diagramRenderer.renderNervousSystemDiagram(x, y, width, height, options);
                break;
            case 'neuronStructure':
                this.diagramRenderer.renderNeuronDiagram(x, y, width, height, options);
                break;
            case 'skull':
            case 'femur':
            case 'ribcage':
            case 'spine':
                this.diagramRenderer.renderSkeletalSystemDiagram(x, y, width, height, options);
                break;
            case 'boneStructure':
                this.diagramRenderer.renderBoneStructureDiagram(x, y, width, height);
                break;
            case 'skeletalMuscle':
                this.diagramRenderer.renderMuscularSystemDiagram(x, y, width, height, options);
                break;
            case 'muscleContraction':
                this.diagramRenderer.renderMuscleContractionDiagram(x, y, width, height);
                break;
            case 'cellStructure':
                this.diagramRenderer.renderCellDiagram(x, y, width, height, options);
                break;
            case 'bloodCells':
                this.diagramRenderer.renderBloodCellsDiagram(x, y, width, height, options);
                break;
            case 'dnaStructure':
                this.diagramRenderer.renderDNADiagram(x, y, width, height, options);
                break;
            case 'skinStructure':
                this.diagramRenderer.renderSkinDiagram(x, y, width, height, options);
                break;
            case 'urinarySystem':
                this.diagramRenderer.renderUrinarySystemDiagram(x, y, width, height, options);
                break;
            case 'kidneyDetail':
                this.diagramRenderer.renderKidneyDetailDiagram(x, y, width, height);
                break;
            case 'eyeAnatomy':
                this.diagramRenderer.renderEyeDiagram(x, y, width, height, options);
                break;
            default:
                throw new Error(`Rendering for diagram '${key}' not implemented`);
        }
    }


    // Helper method for rendering specific anatomical diagrams
renderSpecificAnatomicalDiagram(key, options) {
    const x = 0;
    const y = 0;
    const width = options.width || 800;
    const height = options.height || 600;

    switch (key) {
        case 'heartAnatomy':
            this.diagramRenderer.renderHeartAnatomyDiagram(x, y, width, height, options);
            break;
        case 'circulatorySystem':
            this.diagramRenderer.renderCirculatorySystemDiagram(x, y, width, height, options);
            break;
        case 'bloodVesselComparison':
            this.diagramRenderer.renderBloodVesselComparison(x, y, width, height, options);
            break;
        case 'heartValves':
            this.diagramRenderer.renderHeartValvesDiagram(x, y, width, height, options);
            break;
        case 'respiratorySystem':
            this.diagramRenderer.renderRespiratorySystemDiagram(x, y, width, height, options);
            break;
        case 'digestiveSystem':
            this.diagramRenderer.renderDigestiveSystemDiagram(x, y, width, height, options);
            break;
        case 'digestiveOrgans':
            this.diagramRenderer.renderDigestiveOrganComparison(x, y, width, height);
            break;
        case 'nervousSystem':
            this.diagramRenderer.renderNervousSystemDiagram(x, y, width, height, options);
            break;
        case 'neuronStructure':
            this.diagramRenderer.renderNeuronDiagram(x, y, width, height, options);
            break;
        case 'skull':
        case 'femur':
        case 'ribcage':
        case 'spine':
            this.diagramRenderer.renderSkeletalSystemDiagram(x, y, width, height, options);
            break;
        case 'boneStructure':
            this.diagramRenderer.renderBoneStructureDiagram(x, y, width, height);
            break;
        case 'skeletalMuscle':
            this.diagramRenderer.renderMuscularSystemDiagram(x, y, width, height, options);
            break;
        case 'muscleContraction':
            this.diagramRenderer.renderMuscleContractionDiagram(x, y, width, height);
            break;
        case 'cellStructure':
            this.diagramRenderer.renderCellDiagram(x, y, width, height, options);
            break;
        case 'bloodCells':
            this.diagramRenderer.renderBloodCellsDiagram(x, y, width, height, options);
            break;
        case 'dnaStructure':
            this.diagramRenderer.renderDNADiagram(x, y, width, height, options);
            break;
        case 'skinStructure':
            this.diagramRenderer.renderSkinDiagram(x, y, width, height, options);
            break;
        case 'urinarySystem':
            this.diagramRenderer.renderUrinarySystemDiagram(x, y, width, height, options);
            break;
        case 'kidneyDetail':
            this.diagramRenderer.renderKidneyDetailDiagram(x, y, width, height);
            break;
        case 'eyeAnatomy':
            this.diagramRenderer.renderEyeDiagram(x, y, width, height, options);
            break;
        default:
            throw new Error(`Rendering for anatomical diagram '${key}' not implemented`);
    }
}



    // Render all anatomical diagrams
    renderAllAnatomicalDiagrams() {
        const results = [];

        this.anatomicalDiagrams.forEach((_, index) => {
            try {
                const result = this.renderAnatomicalDiagramToPNG(index);
                results.push(result);
            } catch (error) {
                results.push({
                    error: error.message,
                    index
                });
            }
        });

        return results;
    }

    // Get anatomical diagram statistics
    getAnatomicalDiagramStatistics() {
        const stats = AnatomicalDiagramsRegistry.getDiagramStats();
        return {
            totalDiagrams: Object.values(stats).reduce((sum, cat) => sum + cat.count, 0),
            byCategory: stats,
            diagramsInWorkbook: this.anatomicalDiagrams.length
        };
    }

    // Search anatomical diagrams
    searchAnatomicalDiagrams(query) {
        return AnatomicalDiagramsRegistry.searchDiagrams(query);
    }

    // List all anatomical diagrams in workbook
    listAnatomicalDiagrams() {
        return this.anatomicalDiagrams.map((diagram, index) => ({
            index,
            id: diagram.id,
            name: diagram.title,
            type: AnatomicalDiagramsRegistry.getDiagram(diagram.key).name,
            category: diagram.category,
            filename: diagram.filename,
            created: diagram.createdAt
        }));
    }

    // Remove anatomical diagram
    removeAnatomicalDiagram(diagramIndex) {
        if (diagramIndex < 0 || diagramIndex >= this.anatomicalDiagrams.length) {
            throw new Error(`Diagram index ${diagramIndex} out of range`);
        }

        const removed = this.anatomicalDiagrams.splice(diagramIndex, 1);
        this.addToHistory(`Removed anatomical diagram: ${removed[0].title}`);
        return removed[0];
    }

    // Update anatomical diagram
    updateAnatomicalDiagram(diagramIndex, updates) {
        if (diagramIndex < 0 || diagramIndex >= this.anatomicalDiagrams.length) {
            throw new Error(`Diagram index ${diagramIndex} out of range`);
        }

        const diagram = this.anatomicalDiagrams[diagramIndex];
        
        if (updates.title) diagram.title = updates.title;
        if (updates.options) {
            diagram.options = { ...diagram.options, ...updates.options };
        }

        this.addToHistory(`Updated anatomical diagram: ${diagram.title}`);
        return diagram;
    }

    // Generate anatomical diagram guide
    generateAnatomicalDiagramGuide() {
        const guide = {
            title: 'Available Anatomical Diagrams',
            categories: {},
            totalDiagrams: 0,
            suggestions: []
        };

        const categories = AnatomicalDiagramsRegistry.getAllCategories();

        categories.forEach(category => {
            const diagrams = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);
            guide.categories[category] = Object.entries(diagrams).map(([key, diagram]) => ({
                key,
                name: diagram.name,
                description: diagram.description,
                usage: diagram.usage,
                examples: diagram.examples
            }));
            guide.totalDiagrams += Object.keys(diagrams).length;
        });

        // Add suggestions based on workbook context
        guide.suggestions = this.suggestAnatomicalDiagrams();

        return guide;
    }

    // Batch add anatomical diagrams by category
    addAnatomicalDiagramsByCategory(category, options = {}) {
        const diagrams = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);
        const results = [];

        Object.keys(diagrams).forEach(key => {
            try {
                const result = this.addAnatomicalDiagram({
                    key,
                    options,
                    filename: `${this.sheetName}_${key}_${Date.now()}.png`
                });
                results.push(result);
            } catch (error) {
                results.push({ key, error: error.message });
            }
        });

        return results;
    }

    // Export anatomical diagrams to a folder
    exportAnatomicalDiagramsToFolder(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const results = [];

        this.anatomicalDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/${diagram.filename}`;
                
                const result = this.renderAnatomicalDiagramToPNG(index);
                results.push(result);
                
                // Restore original filename
                diagram.filename = originalFilename;
            } catch (error) {
                results.push({
                    index,
                    error: error.message
                });
            }
        });

        return {
            folder: folderPath,
            results,
            totalExported: results.filter(r => !r.error).length
        };
    }

    // Generate combined report with charts and anatomical diagrams
    generateCombinedReport() {
        const baseReport = this.generateReport();
        
        return {
            ...baseReport,
            anatomicalDiagrams: this.listAnatomicalDiagrams(),
            anatomicalStats: this.getAnatomicalDiagramStatistics(),
            visualizations: {
                charts: this.charts.length,
                anatomicalDiagrams: this.anatomicalDiagrams.length,
                total: this.charts.length + this.anatomicalDiagrams.length
            }
        };
    }




    // ========================================================================
    // EXISTING METHODS (Keep all your existing methods here)
    // ========================================================================

    setThemeColors() {
        const themes = {
            professional: {
                background: '#ffffff',
                gridColor: '#d0d0d0',
                headerBg: '#4472C4',
                headerText: '#ffffff',
                cellBg: '#ffffff',
                cellText: '#000000',
                alternateRowBg: '#f2f2f2',
                formulaCellBg: '#fff2cc',
                calculatedCellBg: '#e2efda',
                borderColor: '#808080',
                highlightColor: '#ffeb9c'
            },
            dark: {
                background: '#1e1e1e',
                gridColor: '#3e3e3e',
                headerBg: '#2d2d30',
                headerText: '#ffffff',
                cellBg: '#252526',
                cellText: '#cccccc',
                alternateRowBg: '#2d2d30',
                formulaCellBg: '#3e3733',
                calculatedCellBg: '#283d2b',
                borderColor: '#555555',
                highlightColor: '#4d4d00'
            }
        };
        this.colors = themes[this.theme] || themes.professional;
    }

    loadData(data, headers = null) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Data must be a non-empty array');
        }

        this.data = data.map(row => Array.isArray(row) ? row : Object.values(row));
        this.headers = headers || (Array.isArray(data[0]) ? data[0].map((_, i) => this.columnToLetter(i)) : Object.keys(data[0]));

        if (this.data.length > 0 && this.data[0].every(cell => typeof cell === 'string')) {
            this.headers = this.data[0];
            this.data = this.data.slice(1);
        }

        this.lastModified = new Date();
        this.addToHistory('Data loaded');

        return this;
    }

    columnToLetter(column) {
        let temp, letter = '';
        while (column >= 0) {
            temp = column % 26;
            letter = String.fromCharCode(temp + 65) + letter;
            column = (column - temp) / 26 - 1;
        }
        return letter;
    }

    letterToColumn(letter) {
        let column = 0;
        for (let i = 0; i < letter.length; i++) {
            column = column * 26 + letter.charCodeAt(i) - 64;
        }
        return column - 1;
    }

    parseCellReference(ref) {
        const match = ref.match(/^([A-Z]+)(\d+)$/);
        if (!match) return null;
        return {
            col: this.letterToColumn(match[1]),
            row: parseInt(match[2]) - 1
        };
    }

    parseRangeReference(range) {
        const [start, end] = range.split(':');
        const startCell = this.parseCellReference(start);
        const endCell = this.parseCellReference(end || start);
        return { start: startCell, end: endCell };
    }

    getCellValue(cellRef) {
        const cell = this.parseCellReference(cellRef);
        if (!cell || cell.row < 0 || cell.row >= this.data.length) return null;
        if (cell.col < 0 || cell.col >= this.data[cell.row].length) return null;
        return this.data[cell.row][cell.col];
    }

    setCellValue(cellRef, value) {
        const cell = this.parseCellReference(cellRef);
        if (!cell) return false;

        while (this.data.length <= cell.row) {
            this.data.push([]);
        }
        while (this.data[cell.row].length <= cell.col) {
            this.data[cell.row].push('');
        }

        this.data[cell.row][cell.col] = value;
        this.lastModified = new Date();
        return true;
    }

    getRangeValues(rangeRef) {
        const range = this.parseRangeReference(rangeRef);
        if (!range.start || !range.end) return [];

        const values = [];
        for (let row = range.start.row; row <= range.end.row; row++) {
            for (let col = range.start.col; col <= range.end.col; col++) {
                if (row >= 0 && row < this.data.length && col >= 0 && col < this.data[row].length) {
                    values.push(this.data[row][col]);
                }
            }
        }
        return values;
    }

    applyFormula(targetCell, formulaKey, params) {
        const formula = SpreadsheetFormulaRegistry.getFormula(formulaKey);
        if (!formula) {
            throw new Error(`Formula '${formulaKey}' not found`);
        }

        const processedParams = params.map(param => {
            if (typeof param === 'string' && param.includes(':')) {
                return this.getRangeValues(param);
            }
            else if (typeof param === 'string' && /^[A-Z]+\d+$/.test(param)) {
                return this.getCellValue(param);
            }
            return param;
        });

        const result = formula.calculate(...processedParams);

        this.formulas[targetCell] = {
            formulaKey,
            formula: `=${formula.excelFormula}(${params.join(',')})`,
            params,
            timestamp: new Date()
        };
        this.calculations[targetCell] = result;

        this.setCellValue(targetCell, result);

        this.addToHistory(`Applied ${formula.name} to ${targetCell}`);

        return {
            cell: targetCell,
            formula: this.formulas[targetCell].formula,
            result,
            formatted: this.formatCellValue(result, formula.category)
        };
    }

  applyFormulaBatch(targetRange, formulaKey, paramTemplate) {
    const range = this.parseRangeReference(targetRange);
    if (!range.start || !range.end) {
        throw new Error('Invalid target range');
    }

    const formula = SpreadsheetFormulaRegistry.getFormula(formulaKey);
    if (!formula) {
        throw new Error(`Formula '${formulaKey}' not found`);
    }

    const results = [];

    // Handle row-wise operations
    const rowWiseFormulas = [
        'sumByRow', 'productByRow', 'averageByRow', 'divideByRow', 
        'subtractByRow', 'maxByRow', 'minByRow', 'countByRow'
    ];
    
    if (rowWiseFormulas.includes(formulaKey)) {
        const sourceRange = this.parseRangeReference(paramTemplate[0]);
        
        if (!sourceRange.start || !sourceRange.end) {
            throw new Error('Invalid source range');
        }
        
        // Calculate number of rows in source and target
        const sourceRows = sourceRange.end.row - sourceRange.start.row + 1;
        const targetRows = range.end.row - range.start.row + 1;
        
        if (sourceRows !== targetRows) {
            throw new Error(`Source has ${sourceRows} rows but target has ${targetRows} rows. They must match.`);
        }
        
        // Process each row
        for (let i = 0; i < sourceRows; i++) {
            const sourceRow = sourceRange.start.row + i;
            const targetRow = range.start.row + i;
            
            // Build row range (e.g., C2:E2, C3:E3, etc.)
            const rowRangeStart = `${this.columnToLetter(sourceRange.start.col)}${sourceRow + 1}`;
            const rowRangeEnd = `${this.columnToLetter(sourceRange.end.col)}${sourceRow + 1}`;
            const rowRange = `${rowRangeStart}:${rowRangeEnd}`;
            
            // Get values for this row
            const rowValues = this.getRangeValues(rowRange);
            
            // Calculate based on formula type
            let result;
            let excelFormulaName;
            
            switch (formulaKey) {
                case 'sumByRow':
                    result = rowValues.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
                    excelFormulaName = 'SUM';
                    break;
                    
                case 'productByRow':
                    result = rowValues.reduce((prod, val) => prod * (parseFloat(val) || 1), 1);
                    excelFormulaName = 'PRODUCT';
                    break;
                    
                case 'averageByRow':
                    const nums = rowValues.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v));
                    result = nums.length > 0 ? nums.reduce((sum, val) => sum + val, 0) / nums.length : 0;
                    excelFormulaName = 'AVERAGE';
                    break;
                    
                case 'subtractByRow':
                    // First value minus all subsequent values
                    result = rowValues.length > 0 ? parseFloat(rowValues[0]) || 0 : 0;
                    for (let j = 1; j < rowValues.length; j++) {
                        result -= (parseFloat(rowValues[j]) || 0);
                    }
                    excelFormulaName = 'SUBTRACT';
                    break;
                    
                case 'divideByRow':
                    // First value divided by product of all subsequent values
                    result = rowValues.length > 0 ? parseFloat(rowValues[0]) || 1 : 1;
                    for (let j = 1; j < rowValues.length; j++) {
                        const divisor = parseFloat(rowValues[j]) || 1;
                        if (divisor === 0) {
                            throw new Error(`Division by zero in row ${sourceRow + 1}`);
                        }
                        result /= divisor;
                    }
                    excelFormulaName = 'DIVIDE';
                    break;
                    
                case 'maxByRow':
                    const maxNums = rowValues.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v));
                    result = maxNums.length > 0 ? Math.max(...maxNums) : 0;
                    excelFormulaName = 'MAX';
                    break;
                    
                case 'minByRow':
                    const minNums = rowValues.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v));
                    result = minNums.length > 0 ? Math.min(...minNums) : 0;
                    excelFormulaName = 'MIN';
                    break;
                    
                case 'countByRow':
                    result = rowValues.filter(v => v !== null && v !== undefined && v !== '').length;
                    excelFormulaName = 'COUNT';
                    break;
                    
                default:
                    throw new Error(`Unknown row-wise formula: ${formulaKey}`);
            }
            
            // Target cell (e.g., F2, F3, F4, etc.)
            const targetCell = `${this.columnToLetter(range.start.col)}${targetRow + 1}`;
            
            // Set value
            this.setCellValue(targetCell, result);
            
            // Store formula
            this.formulas[targetCell] = {
                formulaKey,
                formula: `=${excelFormulaName}(${rowRange})`,
                params: [rowRange],
                timestamp: new Date()
            };
            
            this.calculations[targetCell] = result;
            
            results.push({
                cell: targetCell,
                formula: `=${excelFormulaName}(${rowRange})`,
                result,
                formatted: this.formatCellValue(result, formula.category)
            });
        }
        
        this.addToHistory(`Applied ${formula.name} to ${targetRange}`);
        return results;
    }
    
    // Original batch logic for other formulas
    for (let row = range.start.row; row <= range.end.row; row++) {
        for (let col = range.start.col; col <= range.end.col; col++) {
            const cellRef = `${this.columnToLetter(col)}${row + 1}`;

            // Adjust parameters for current row
            const adjustedParams = paramTemplate.map(param => {
                if (typeof param === 'string' && param.includes('{row}')) {
                    return param.replace('{row}', String(row + 1));
                }
                return param;
            });

            try {
                const result = this.applyFormula(cellRef, formulaKey, adjustedParams);
                results.push(result);
            } catch (error) {
                results.push({ cell: cellRef, error: error.message });
            }
        }
    }

    return results;
}
    formatCellValue(value, category) {
        if (value === null || value === undefined) return '';

        switch (category) {
            case 'Budget & Business':
            case 'Financial & Economic':
                if (typeof value === 'number') {
                    if (Math.abs(value) < 1 && value !== 0) {
                        return (value * 100).toFixed(2) + '%';
                    }
                    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
                break;
            case 'Statistics & Science':
                if (typeof value === 'number') {
                    return value.toFixed(4);
                }
                break;
            default:
                if (typeof value === 'number') {
                    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
                }
        }

        return String(value);
    }

    getAvailableActions() {
        const actions = {};
        const categories = SpreadsheetFormulaRegistry.getAllCategories();

        categories.forEach(category => {
            actions[category] = SpreadsheetFormulaRegistry.getFormulasByCategory(category);
        });

        return actions;
    }

    suggestFormulas(cellRange) {
        const values = this.getRangeValues(cellRange);
        const suggestions = [];

        const hasNumbers = values.some(v => !isNaN(parseFloat(v)));
        if (hasNumbers) {
            suggestions.push(
                { key: 'sum', priority: 10, reason: 'Numeric data detected' },
                { key: 'average', priority: 9, reason: 'Calculate central tendency' },
                { key: 'max', priority: 8, reason: 'Find highest value' },
                { key: 'min', priority: 8, reason: 'Find lowest value' }
            );
        }

        if (this.headers.some(h => /revenue|sales|income|cost|expense|budget/i.test(h))) {
            suggestions.push(
                { key: 'profitMargin', priority: 10, reason: 'Financial data detected' },
                { key: 'budgetPercentage', priority: 9, reason: 'Budget tracking recommended' }
            );
        }

        if (values.some(v => !isNaN(Date.parse(v)))) {
            suggestions.push(
                { key: 'datedif', priority: 7, reason: 'Date data detected' }
            );
        }

        return suggestions.sort((a, b) => b.priority - a.priority);
    }

    addToHistory(action) {
        this.history.push({
            action,
            timestamp: new Date(),
            dataSnapshot: JSON.parse(JSON.stringify({
                data: this.data,
                formulas: this.formulas
            }))
        });

        if (this.history.length > 50) {
            this.history = this.history.slice(-50);
        }
    }


    renderSpreadsheet(ctx) {
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, this.width, this.height);

        const startX = 60;
        const startY = 100;

        ctx.fillStyle = this.colors.cellText;
        ctx.font = 'bold 24px Arial';
        ctx.fillText(this.sheetName, 30, 40);

        ctx.font = '12px Arial';
        ctx.fillText(`Last Modified: ${this.lastModified.toLocaleString()}`, 30, 70);

        this.headers.forEach((header, colIndex) => {
            const x = startX + colIndex * this.cellWidth;

            ctx.fillStyle = this.colors.headerBg;
            ctx.fillRect(x, startY, this.cellWidth, this.headerHeight);

            ctx.strokeStyle = this.colors.borderColor;
            ctx.strokeRect(x, startY, this.cellWidth, this.headerHeight);

            ctx.fillStyle = this.colors.headerText;
            ctx.font = `bold ${this.headerFontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                String(header).substring(0, 15),
                x + this.cellWidth / 2,
                startY + this.headerHeight / 2
            );
        });

        this.data.forEach((row, rowIndex) => {
            const y = startY + this.headerHeight + rowIndex * this.cellHeight;

            ctx.fillStyle = this.colors.headerBg;
            ctx.fillRect(10, y, 40, this.cellHeight);
            ctx.strokeStyle = this.colors.borderColor;
            ctx.strokeRect(10, y, 40, this.cellHeight);

            ctx.fillStyle = this.colors.headerText;
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(String(rowIndex + 1), 30, y + this.cellHeight / 2);

            row.forEach((cell, colIndex) => {
                const x = startX + colIndex * this.cellWidth;
                const cellRef = `${this.columnToLetter(colIndex)}${rowIndex + 1}`;

                const isFormulaCell = this.formulas[cellRef];
                const isCalculatedCell = this.calculations[cellRef] !== undefined;

                if (isFormulaCell) {
                    ctx.fillStyle = this.colors.formulaCellBg;
                } else if (isCalculatedCell) {
                    ctx.fillStyle = this.colors.calculatedCellBg;
                } else if (rowIndex % 2 === 1) {
                    ctx.fillStyle = this.colors.alternateRowBg;
                } else {
                    ctx.fillStyle = this.colors.cellBg;
                }

                ctx.fillRect(x, y, this.cellWidth, this.cellHeight);
                ctx.strokeStyle = this.colors.gridColor;
                ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);

                ctx.fillStyle = this.colors.cellText;
                ctx.font = `${this.fontSize}px Arial`;
                ctx.textAlign = 'left';

                let displayValue = String(cell);
                if (isFormulaCell) {
                    displayValue = this.formulas[cellRef].formula;
                }

                if (displayValue.length > 20) {
                    displayValue = displayValue.substring(0, 17) + '...';
                }

                ctx.fillText(displayValue, x + 5, y + this.cellHeight / 2);
            });
        });
    }

// ============================================================================
// UPDATED exportToPNG - Now includes Charts, Anatomical, Cross-Section, and Stereochemistry Diagrams
// ============================================================================

exportToPNG(filename = 'spreadsheet.png', options = {}) {
    const { 
        includeCharts = false, 
        includeAnatomicalDiagrams = false,
        includeCrossSectionDiagrams = false,
        includeStereochemistryDiagrams = false,
        chartIndices = [],
        anatomicalIndices = [],
        crossSectionIndices = [],
        stereochemistryIndices = []
    } = options;

    let totalHeight = this.height;
    const visualizationsToRender = {
        charts: [],
        anatomical: [],
        crossSection: [],
        stereochemistry: []
    };

    // Collect charts to render
    if (includeCharts && this.charts.length > 0) {
        const selectedCharts = chartIndices.length > 0
            ? chartIndices.map(i => this.charts[i]).filter(Boolean)
            : this.charts;
        visualizationsToRender.charts = selectedCharts;
    }

    // Collect anatomical diagrams to render
    if (includeAnatomicalDiagrams && this.anatomicalDiagrams.length > 0) {
        const selectedDiagrams = anatomicalIndices.length > 0
            ? anatomicalIndices.map(i => this.anatomicalDiagrams[i]).filter(Boolean)
            : this.anatomicalDiagrams;
        visualizationsToRender.anatomical = selectedDiagrams;
    }

    // Collect cross-section diagrams to render
    if (includeCrossSectionDiagrams && this.crossSectionDiagrams.length > 0) {
        const selectedCrossSections = crossSectionIndices.length > 0
            ? crossSectionIndices.map(i => this.crossSectionDiagrams[i]).filter(Boolean)
            : this.crossSectionDiagrams;
        visualizationsToRender.crossSection = selectedCrossSections;
    }

    // Collect stereochemistry diagrams to render
    if (includeStereochemistryDiagrams && this.stereochemistryDiagrams.length > 0) {
        const selectedStereochem = stereochemistryIndices.length > 0
            ? stereochemistryIndices.map(i => this.stereochemistryDiagrams[i]).filter(Boolean)
            : this.stereochemistryDiagrams;
        visualizationsToRender.stereochemistry = selectedStereochem;
    }

    // Calculate additional height needed
    const totalVisualizations = 
        visualizationsToRender.charts.length + 
        visualizationsToRender.anatomical.length +
        visualizationsToRender.crossSection.length +
        visualizationsToRender.stereochemistry.length;
    
    if (totalVisualizations > 0) {
        const sectionHeaderHeight = 80;
        const itemHeight = 350;
        const itemsPerRow = 2;
        const rows = Math.ceil(totalVisualizations / itemsPerRow);
        totalHeight += sectionHeaderHeight + (itemHeight * rows) + 50;
    }

    const canvas = createCanvas(this.width, totalHeight);
    const ctx = canvas.getContext('2d');

    // Render spreadsheet
    this.renderSpreadsheet(ctx);

    // Render visualizations if any
    if (totalVisualizations > 0) {
        this.renderVisualizationsToCanvas(ctx, visualizationsToRender);
    }

    const buffer = canvas.toBuffer('image/png');
    if (filename) {
        fs.writeFileSync(filename, buffer);
    }
    return buffer;
}

// ============================================================================
// UNIFIED Visualizations Renderer - All Visualization Types
// ============================================================================

renderVisualizationsToCanvas(ctx, visualizations) {
    const { 
        charts = [], 
        anatomical = [], 
        crossSection = [], 
        stereochemistry = [] 
    } = visualizations;
    
    const allVisualizations = [
        ...charts.map(c => ({ type: 'chart', data: c, icon: '📊' })),
        ...anatomical.map(d => ({ type: 'anatomical', data: d, icon: '🫀' })),
        ...crossSection.map(d => ({ type: 'crossSection', data: d, icon: '🔬' })),
        ...stereochemistry.map(d => ({ type: 'stereochemistry', data: d, icon: '🧪' }))
    ];

    if (allVisualizations.length === 0) return;

    // Calculate exact position right after spreadsheet ends
    const numRows = this.data.length;
    const spreadsheetEndY = 100 + this.headerHeight + (numRows * this.cellHeight) + 80;

    // Section header
    const headerY = spreadsheetEndY;
    ctx.fillStyle = this.colors.headerBg;
    ctx.fillRect(0, headerY, this.width, 60);

    ctx.fillStyle = this.colors.headerText;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('📊 Visualizations', 30, headerY + 25);

    // Summary text
    ctx.font = '14px Arial';
    const summaryParts = [];
    if (charts.length > 0) summaryParts.push(`${charts.length} Chart${charts.length !== 1 ? 's' : ''}`);
    if (anatomical.length > 0) summaryParts.push(`${anatomical.length} Anatomical`);
    if (crossSection.length > 0) summaryParts.push(`${crossSection.length} Cross-Section`);
    if (stereochemistry.length > 0) summaryParts.push(`${stereochemistry.length} Molecule${stereochemistry.length !== 1 ? 's' : ''}`);
    
    ctx.fillText(summaryParts.join(' • '), 30, headerY + 45);

    // Visualizations layout
    let currentY = headerY + 80;
    const itemsPerRow = 2;
    const itemWidth = 700;
    const itemHeight = 500;
    const itemSpacingX = 80;
    const itemSpacingY = 80;

    allVisualizations.forEach((viz, index) => {
        const colIndex = index % itemsPerRow;
        const rowIndex = Math.floor(index / itemsPerRow);

        const vizX = 50 + (colIndex * (itemWidth + itemSpacingX));
        const vizY = currentY + (rowIndex * (itemHeight + itemSpacingY + 40));

        // Title with icon
        ctx.fillStyle = this.colors.cellText;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(
            `${viz.icon} ${index + 1}. ${viz.data.title}`,
            vizX,
            vizY - 15
        );

        // Type label
        ctx.font = '11px Arial';
        ctx.fillStyle = '#666666';
        const typeLabels = {
            'chart': 'Chart',
            'anatomical': 'Anatomical Diagram',
            'crossSection': 'Cross-Section',
            'stereochemistry': 'Molecular Structure'
        };
        ctx.fillText(typeLabels[viz.type], vizX, vizY - 2);

        // Border
        ctx.strokeStyle = this.colors.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(vizX, vizY, itemWidth, itemHeight);

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(vizX + 1, vizY + 1, itemWidth - 2, itemHeight - 2);

        // Render the visualization
        try {
            ctx.save();
            ctx.translate(vizX, vizY);

            const tempCanvas = createCanvas(itemWidth, itemHeight);
            const tempCtx = tempCanvas.getContext('2d');

            if (viz.type === 'chart') {
                // Render chart
                this.chartRenderer.renderChart(
                    tempCanvas,
                    tempCtx,
                    viz.data.key,
                    viz.data.data,
                    { ...viz.data.options, width: itemWidth, height: itemHeight }
                );
            } else if (viz.type === 'anatomical') {
                // Render anatomical diagram
                this.diagramRenderer.canvas = tempCanvas;
                this.diagramRenderer.ctx = tempCtx;
                this.renderSpecificAnatomicalDiagram(viz.data.key, {
                    ...viz.data.options,
                    width: itemWidth,
                    height: itemHeight
                });
            } else if (viz.type === 'crossSection') {
                // Render cross-section diagram
                this.crossSectionRenderer.canvas = tempCanvas;
                this.crossSectionRenderer.ctx = tempCtx;
                this.crossSectionRenderer.renderDiagram(
                    viz.data.key,
                    0,
                    0,
                    itemWidth,
                    itemHeight,
                    viz.data.options
                );
            } else if (viz.type === 'stereochemistry') {
                // Render stereochemistry diagram
                this.stereochemistryRenderer.canvas = tempCanvas;
                this.stereochemistryRenderer.ctx = tempCtx;
                this.stereochemistryRenderer.renderDiagram(
                    viz.data.key,
                    0,
                    0,
                    itemWidth,
                    itemHeight,
                    viz.data.options
                );
            }

            // Draw the rendered visualization onto main canvas
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.restore();

        } catch (error) {
            ctx.restore();
            // Error state
            ctx.fillStyle = '#ffcccc';
            ctx.fillRect(vizX, vizY, itemWidth, itemHeight);
            ctx.fillStyle = '#ff0000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                `Error rendering ${typeLabels[viz.type]}`,
                vizX + itemWidth / 2,
                vizY + itemHeight / 2
            );
            console.error(`${viz.type} ${index + 1} error:`, error.message);
        }
    });
}

// Helper method for rendering specific anatomical diagrams


// ============================================================================
// UPDATED exportToExcel - All Diagram Types
// ============================================================================

async exportToExcel(filename = 'spreadsheet.xlsx', options = {}) {
    const { 
        includeCharts = false,
        includeAnatomicalDiagrams = false,
        includeCrossSectionDiagrams = false,
        includeStereochemistryDiagrams = false
    } = options;
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = this.author;
    workbook.created = this.createdDate;
    workbook.modified = this.lastModified;
    workbook.lastPrinted = new Date();

    const worksheet = workbook.addWorksheet(this.sheetName);
    worksheet.properties.defaultRowHeight = 20;

    // Add headers
    const headerRow = worksheet.addRow(this.headers);
    headerRow.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 12,
        name: 'Calibri'
    };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
    };
    headerRow.alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    headerRow.height = 30;

    headerRow.eachCell(cell => {
        cell.border = {
            top: { style: 'medium', color: { argb: 'FF2E5C8A' } },
            left: { style: 'thin', color: { argb: 'FF2E5C8A' } },
            bottom: { style: 'medium', color: { argb: 'FF2E5C8A' } },
            right: { style: 'thin', color: { argb: 'FF2E5C8A' } }
        };
    });

    // Add data rows
    this.data.forEach((row, rowIndex) => {
        const excelRow = worksheet.addRow(row);
        excelRow.height = 22;

        row.forEach((cellValue, colIndex) => {
            const cellRef = `${this.columnToLetter(colIndex)}${rowIndex + 1}`;
            const cell = excelRow.getCell(colIndex + 1);

            if (this.formulas[cellRef]) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFF2CC' }
                };
                cell.font = { bold: true, color: { argb: 'FF000000' } };
                cell.note = {
                    texts: [
                        { font: { bold: true, size: 10 }, text: 'Formula: ' },
                        { font: { size: 10 }, text: this.formulas[cellRef].formula }
                    ],
                    margins: { insetmode: 'auto', inset: [5, 5, 5, 5] }
                };
            } else if (this.calculations[cellRef] !== undefined) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE2EFDA' }
                };
                cell.font = { italic: true };
            }

            if (typeof cellValue === 'number') {
                cell.numFmt = cellValue % 1 === 0 ? '#,##0' : '#,##0.00';
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
            } else {
                cell.alignment = { horizontal: 'left', vertical: 'middle' };
            }

            cell.border = {
                top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
            };
        });

        if (rowIndex % 2 === 1) {
            excelRow.eachCell(cell => {
                if (!cell.fill || !cell.fill.fgColor || cell.fill.fgColor.argb === 'FFFFFFFF') {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF8F8F8' }
                    };
                }
            });
        }
    });

    // Auto-fit columns
    worksheet.columns.forEach((column, index) => {
        let maxLength = this.headers[index]?.toString().length || 10;
        column.eachCell({ includeEmpty: false }, cell => {
            const cellLength = cell.value ? cell.value.toString().length : 0;
            maxLength = Math.max(maxLength, cellLength);
        });
        column.width = Math.min(Math.max(maxLength + 3, 12), 45);
    });

    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    // ========== FORMULAS SHEET ==========
    if (Object.keys(this.formulas).length > 0) {
        const formulaSheet = workbook.addWorksheet('📋 Formulas');

        const formulaHeaderRow = formulaSheet.addRow([
            'Cell', 'Formula', 'Type', 'Category', 'Description', 'Applied'
        ]);

        formulaHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        formulaHeaderRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF70AD47' }
        };
        formulaHeaderRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        formulaHeaderRow.height = 30;

        Object.entries(this.formulas).forEach(([cell, data], index) => {
            const formula = SpreadsheetFormulaRegistry.getFormula(data.formulaKey);
            const formulaRow = formulaSheet.addRow([
                cell,
                data.formula,
                formula?.name || data.formulaKey,
                formula?.category || 'Unknown',
                formula?.description || '',
                data.timestamp.toLocaleString()
            ]);

            formulaRow.alignment = { vertical: 'top', wrapText: true };

            if (index % 2 === 1) {
                formulaRow.eachCell(cell => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F0F0' } };
                });
            }
        });

        formulaSheet.columns = [
            { width: 15 }, { width: 35 }, { width: 25 },
            { width: 20 }, { width: 45 }, { width: 22 }
        ];
    }

    // ========== VISUALIZATIONS SHEET (All Types) ==========
    const hasVisualizations = 
        (includeCharts && this.charts.length > 0) || 
        (includeAnatomicalDiagrams && this.anatomicalDiagrams.length > 0) ||
        (includeCrossSectionDiagrams && this.crossSectionDiagrams.length > 0) ||
        (includeStereochemistryDiagrams && this.stereochemistryDiagrams.length > 0);

    if (hasVisualizations) {
        const vizSheet = workbook.addWorksheet('📊 Visualizations');
        let currentRow = 1;

        // Track temp files for cleanup AFTER Excel is saved
        const tempFilesToCleanup = [];

        // HELPER FUNCTION: Add image to Excel with proper error handling
        const addImageToExcel = async (canvas, title, type, index, metadata = {}) => {
            let tempFilePath = null;
            
            try {
                // Create temp directory if it doesn't exist
                const tempDir = os.tmpdir();
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }

                // Generate unique filename
                const timestamp = Date.now();
                const random = Math.random().toString(36).substring(2, 15);
                tempFilePath = path.join(tempDir, `${type}_${timestamp}_${index}_${random}.png`);

                // Save canvas to buffer
                const buffer = canvas.toBuffer('image/png');
                
                // Write buffer to temp file
                fs.writeFileSync(tempFilePath, buffer);

                // Verify file exists
                if (!fs.existsSync(tempFilePath)) {
                    throw new Error(`Failed to create temp file: ${tempFilePath}`);
                }

                console.log(`  • Created temp file: ${path.basename(tempFilePath)}`);

                // Add image to workbook
                const imageId = workbook.addImage({
                    filename: tempFilePath,
                    extension: 'png'
                });

                // Add title
                const titleCell = vizSheet.getCell(`A${currentRow}`);
                titleCell.value = title;
                
                const typeColors = {
                    'chart': 'FF4472C4',
                    'anatomical': 'FFE74C3C',
                    'crossSection': 'FF27AE60',
                    'stereochemistry': 'FF9B59B6'
                };
                
                titleCell.font = { 
                    bold: true, 
                    size: 12, 
                    color: { argb: typeColors[type] || 'FF000000' } 
                };
                titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
                vizSheet.getRow(currentRow).height = 25;
                currentRow += 1;

                // Add metadata if provided
                if (Object.keys(metadata).length > 0) {
                    const metaCell = vizSheet.getCell(`A${currentRow}`);
                    const metaText = Object.entries(metadata)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(' • ');
                    metaCell.value = metaText;
                    metaCell.font = { size: 10, italic: true, color: { argb: 'FF666666' } };
                    vizSheet.getRow(currentRow).height = 20;
                    currentRow += 1;
                }

                // Insert image
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                
                vizSheet.addImage(imageId, {
                    tl: { col: 0, row: currentRow - 1 },
                    ext: { width: imgWidth, height: imgHeight },
                    editAs: 'oneCell'
                });

                // Calculate rows for image
                const rowsNeeded = Math.ceil(imgHeight / 20);
                for (let r = 0; r < rowsNeeded; r++) {
                    vizSheet.getRow(currentRow + r).height = 20;
                }
                currentRow += rowsNeeded + 2;

                console.log(`  ✓ Added ${type} to Excel: ${title}`);

                // Add to cleanup list (don't delete yet!)
                tempFilesToCleanup.push(tempFilePath);

                return true;

            } catch (error) {
                console.error(`  ❌ Error adding ${type} ${index + 1}:`, error.message);
                
                // Add error message to sheet
                const errorCell = vizSheet.getCell(`A${currentRow}`);
                errorCell.value = `⚠ Error: ${title} - ${error.message}`;
                errorCell.font = { color: { argb: 'FFFF0000' }, italic: true };
                vizSheet.getRow(currentRow).height = 25;
                currentRow += 2;

                return false;
            }
        };

        // Add Charts
        if (includeCharts && this.charts.length > 0) {
            console.log('\n📊 Adding Charts to Excel...');
            
            // Section header
            const chartHeaderCell = vizSheet.getCell(`A${currentRow}`);
            chartHeaderCell.value = '📊 CHARTS';
            chartHeaderCell.font = { bold: true, size: 14, color: { argb: 'FF4472C4' } };
            chartHeaderCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE7F3FF' }
            };
            vizSheet.getRow(currentRow).height = 30;
            currentRow += 2;

            for (let i = 0; i < this.charts.length; i++) {
                const chartConfig = this.charts[i];
                
                try {
                    // Render chart to canvas
                    const chartCanvas = createCanvas(
                        chartConfig.options.width || 700,
                        chartConfig.options.height || 500
                    );
                    const chartCtx = chartCanvas.getContext('2d');

                    this.chartRenderer.renderChart(
                        chartCanvas,
                        chartCtx,
                        chartConfig.key,
                        chartConfig.data,
                        chartConfig.options
                    );

                    // Add to Excel
                    await addImageToExcel(
                        chartCanvas,
                        `Chart ${i + 1}: ${chartConfig.title}`,
                        'chart',
                        i,
                        { Type: chartConfig.key }
                    );

                } catch (error) {
                    console.error(`  ❌ Chart ${i + 1} rendering failed:`, error.message);
                }
            }

            currentRow += 2;
        }

        // Add Anatomical Diagrams
        if (includeAnatomicalDiagrams && this.anatomicalDiagrams.length > 0) {
            console.log('\n🫀 Adding Anatomical Diagrams to Excel...');
            
            // Section header
            const anatomicalHeaderCell = vizSheet.getCell(`A${currentRow}`);
            anatomicalHeaderCell.value = '🫀 ANATOMICAL DIAGRAMS';
            anatomicalHeaderCell.font = { bold: true, size: 14, color: { argb: 'FFE74C3C' } };
            anatomicalHeaderCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFE7E7' }
            };
            vizSheet.getRow(currentRow).height = 30;
            currentRow += 2;

            for (let i = 0; i < this.anatomicalDiagrams.length; i++) {
                const diagramConfig = this.anatomicalDiagrams[i];
                
                try {
                    // Render diagram to canvas
                    const diagramWidth = diagramConfig.options.width || 800;
                    const diagramHeight = diagramConfig.options.height || 700;
                    const diagramCanvas = createCanvas(diagramWidth, diagramHeight);
                    const diagramCtx = diagramCanvas.getContext('2d');

                    this.diagramRenderer.canvas = diagramCanvas;
                    this.diagramRenderer.ctx = diagramCtx;
                    
                    this.renderSpecificAnatomicalDiagram(diagramConfig.key, diagramConfig.options);

                    const diagramInfo = AnatomicalDiagramsRegistry.getDiagram(diagramConfig.key);

                    // Add to Excel
                    await addImageToExcel(
                        diagramCanvas,
                        `Diagram ${i + 1}: ${diagramConfig.title}`,
                        'anatomical',
                        i,
                        { Category: diagramInfo.category }
                    );

                } catch (error) {
                    console.error(`  ❌ Anatomical Diagram ${i + 1} rendering failed:`, error.message);
                }
            }

            currentRow += 2;
        }

        // Add Cross-Section Diagrams
        if (includeCrossSectionDiagrams && this.crossSectionDiagrams.length > 0) {
            console.log('\n🔬 Adding Cross-Section Diagrams to Excel...');
            
            // Section header
            const crossSectionHeaderCell = vizSheet.getCell(`A${currentRow}`);
            crossSectionHeaderCell.value = '🔬 CROSS-SECTION DIAGRAMS';
            crossSectionHeaderCell.font = { bold: true, size: 14, color: { argb: 'FF27AE60' } };
            crossSectionHeaderCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE7F9EF' }
            };
            vizSheet.getRow(currentRow).height = 30;
            currentRow += 2;

            for (let i = 0; i < this.crossSectionDiagrams.length; i++) {
                const diagramConfig = this.crossSectionDiagrams[i];
                
                try {
                    // Render diagram to canvas
                    const diagramWidth = diagramConfig.options.width || 800;
                    const diagramHeight = diagramConfig.options.height || 600;
                    const diagramCanvas = createCanvas(diagramWidth, diagramHeight);
                    const diagramCtx = diagramCanvas.getContext('2d');

                    this.crossSectionRenderer.canvas = diagramCanvas;
                    this.crossSectionRenderer.ctx = diagramCtx;
                    
                    this.crossSectionRenderer.renderDiagram(
                        diagramConfig.key,
                        0,
                        0,
                        diagramWidth,
                        diagramHeight,
                        diagramConfig.options
                    );

                    const diagramInfo = CrossSectionDiagramsRegistry.getDiagram(diagramConfig.key);

                    // Add to Excel
                    await addImageToExcel(
                        diagramCanvas,
                        `Cross-Section ${i + 1}: ${diagramConfig.title}`,
                        'crossSection',
                        i,
                        { Category: diagramInfo.category }
                    );

                } catch (error) {
                    console.error(`  ❌ Cross-Section Diagram ${i + 1} rendering failed:`, error.message);
                }
            }

            currentRow += 2;
        }

        // Add Stereochemistry Diagrams
        if (includeStereochemistryDiagrams && this.stereochemistryDiagrams.length > 0) {
            console.log('\n🧪 Adding Stereochemistry Diagrams to Excel...');
            
            // Section header
            const stereochemHeaderCell = vizSheet.getCell(`A${currentRow}`);
            stereochemHeaderCell.value = '🧪 MOLECULAR STRUCTURES';
            stereochemHeaderCell.font = { bold: true, size: 14, color: { argb: 'FF9B59B6' } };
            stereochemHeaderCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF4ECF7' }
            };
            vizSheet.getRow(currentRow).height = 30;
            currentRow += 2;

            for (let i = 0; i < this.stereochemistryDiagrams.length; i++) {
                const diagramConfig = this.stereochemistryDiagrams[i];
                
                try {
                    // Render diagram to canvas
                    const diagramWidth = diagramConfig.options.width || 800;
                    const diagramHeight = diagramConfig.options.height || 600;
                    const diagramCanvas = createCanvas(diagramWidth, diagramHeight);
                    const diagramCtx = diagramCanvas.getContext('2d');

                    this.stereochemistryRenderer.canvas = diagramCanvas;
                    this.stereochemistryRenderer.ctx = diagramCtx;
                    
                    this.stereochemistryRenderer.renderDiagram(
                        diagramConfig.key,
                        0,
                        0,
                        diagramWidth,
                        diagramHeight,
                        diagramConfig.options
                    );

                    const diagramInfo = StereochemistryDiagramsRegistry.getDiagram(diagramConfig.key);

                    // Add to Excel with molecular info
                    await addImageToExcel(
                        diagramCanvas,
                        `Molecule ${i + 1}: ${diagramConfig.title}`,
                        'stereochemistry',
                        i,
                        { 
                            Formula: diagramInfo.formula,
                            Geometry: diagramInfo.geometry.replace(/_/g, ' '),
                            'Bond Angles': diagramInfo.bondAngles.join('°, ') + '°'
                        }
                    );

                } catch (error) {
                    console.error(`  ❌ Stereochemistry Diagram ${i + 1} rendering failed:`, error.message);
                }
            }

            currentRow += 2;
        }

        vizSheet.columns = [{ width: 100 }];

        // Save workbook FIRST, then cleanup temp files
        console.log('\n💾 Saving Excel workbook...');
        await workbook.xlsx.writeFile(filename);
        console.log(`✓ Excel file saved: ${filename}\n`);

        // NOW cleanup temp files after Excel is saved
        console.log('🧹 Cleaning up temporary files...');
        tempFilesToCleanup.forEach(tempFile => {
            try {
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                    console.log(`  • Cleaned up: ${path.basename(tempFile)}`);
                }
            } catch (e) {
                console.warn(`  ⚠ Failed to delete temp file: ${tempFile}`);
            }
        });
    } else {
        // No visualizations - just save
        console.log('\n💾 Saving Excel workbook...');
        await workbook.xlsx.writeFile(filename);
        console.log(`✓ Excel file saved: ${filename}\n`);
    }

    return {
        success: true,
        filename,
        sheets: workbook.worksheets.length,
        rows: this.data.length,
        columns: this.headers.length,
        formulas: Object.keys(this.formulas).length,
        visualizations: {
            charts: includeCharts ? this.charts.length : 0,
            anatomicalDiagrams: includeAnatomicalDiagrams ? this.anatomicalDiagrams.length : 0,
            crossSectionDiagrams: includeCrossSectionDiagrams ? this.crossSectionDiagrams.length : 0,
            stereochemistryDiagrams: includeStereochemistryDiagrams ? this.stereochemistryDiagrams.length : 0,
            total: 
                (includeCharts ? this.charts.length : 0) +
                (includeAnatomicalDiagrams ? this.anatomicalDiagrams.length : 0) +
                (includeCrossSectionDiagrams ? this.crossSectionDiagrams.length : 0) +
                (includeStereochemistryDiagrams ? this.stereochemistryDiagrams.length : 0)
        }
    };
}

// ============================================================================
// UPDATED generateCombinedReport - All Visualization Types
// ============================================================================

generateCombinedReport() {
    const baseReport = this.generateReport();
    
    return {
        ...baseReport,
        anatomicalDiagrams: this.listAnatomicalDiagrams(),
        crossSectionDiagrams: this.listCrossSectionDiagrams(),
        stereochemistryDiagrams: this.listStereochemistryDiagrams(),
        statistics: {
            anatomical: this.getAnatomicalDiagramStatistics(),
            crossSection: this.getCrossSectionDiagramStatistics(),
            stereochemistry: this.getStereochemistryDiagramStatistics()
        },
        visualizations: {
            charts: this.charts.length,
            anatomicalDiagrams: this.anatomicalDiagrams.length,
            crossSectionDiagrams: this.crossSectionDiagrams.length,
            stereochemistryDiagrams: this.stereochemistryDiagrams.length,
            total: 
                this.charts.length + 
                this.anatomicalDiagrams.length +
                this.crossSectionDiagrams.length +
                this.stereochemistryDiagrams.length
        }
    };
}

// ============================================================================
// UPDATED generateReport - Complete Metadata
// ============================================================================

generateReport() {
    return {
        metadata: {
            sheetName: this.sheetName,
            created: this.createdDate,
            lastModified: this.lastModified,
            author: this.author,
            rowCount: this.data.length,
            columnCount: this.headers.length
        },
        data: {
            headers: this.headers,
            totalRows: this.data.length,
            totalCells: this.data.length * this.headers.length
        },
        formulas: {
            count: Object.keys(this.formulas).length,
            formulas: Object.entries(this.formulas).map(([cell, data]) => ({
                cell,
                formula: data.formula,
                formulaKey: data.formulaKey,
                timestamp: data.timestamp
            }))
        },
        calculations: {
            count: Object.keys(this.calculations).length
        },
        visualizations: {
            charts: {
                count: this.charts.length,
                types: [...new Set(this.charts.map(c => c.key))]
            },
            diagrams: {
                anatomical: {
                    count: this.anatomicalDiagrams.length,
                    categories: [...new Set(this.anatomicalDiagrams.map(d => d.category))]
                },
                crossSection: {
                    count: this.crossSectionDiagrams.length,
                    categories: [...new Set(this.crossSectionDiagrams.map(d => d.category))]
                },
                stereochemistry: {
                    count: this.stereochemistryDiagrams.length,
                    formulas: [...new Set(this.stereochemistryDiagrams.map(d => d.formula))],
                    geometries: [...new Set(this.stereochemistryDiagrams.map(d => {
                        const diagram = StereochemistryDiagramsRegistry.getDiagram(d.key);
                        return diagram ? diagram.geometry : 'unknown';
                    }))]
                },
                total: 
                    this.anatomicalDiagrams.length +
                    this.crossSectionDiagrams.length +
                    this.stereochemistryDiagrams.length
            }
        },
        history: {
            entries: this.history.length,
            recentActions: this.history.slice(-10)
        }
    };
}

// ============================================================================
// EXPORT CONVENIENCE METHODS
// ============================================================================

// Export with all visualizations
async exportCompleteWorkbook(baseFilename = 'complete_workbook', format = 'both') {
    const results = {
        png: null,
        excel: null
    };

    const exportOptions = {
        includeCharts: true,
        includeAnatomicalDiagrams: true,
        includeCrossSectionDiagrams: true,
        includeStereochemistryDiagrams: true
    };

    try {
        if (format === 'png' || format === 'both') {
            console.log('📊 Exporting complete workbook to PNG...');
            const pngFilename = `${baseFilename}.png`;
            this.exportToPNG(pngFilename, exportOptions);
            results.png = {
                success: true,
                filename: pngFilename,
                visualizations: this.getDiagramCounts()
            };
            console.log(`✓ PNG export complete: ${pngFilename}\n`);
        }

        if (format === 'excel' || format === 'both') {
            console.log('📊 Exporting complete workbook to Excel...');
            const excelFilename = `${baseFilename}.xlsx`;
            const excelResult = await this.exportToExcel(excelFilename, exportOptions);
            results.excel = excelResult;
        }

        return {
            success: true,
            results,
            summary: {
                format,
                charts: this.charts.length,
                anatomicalDiagrams: this.anatomicalDiagrams.length,
                crossSectionDiagrams: this.crossSectionDiagrams.length,
                stereochemistryDiagrams: this.stereochemistryDiagrams.length,
                totalVisualizations: this.getDiagramCounts().total
            }
        };

    } catch (error) {
        console.error('❌ Export failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Export specific visualization types
async exportSelectedVisualizations(baseFilename, options = {}) {
    const {
        format = 'both',
        includeCharts = false,
        includeAnatomicalDiagrams = false,
        includeCrossSectionDiagrams = false,
        includeStereochemistryDiagrams = false,
        chartIndices = [],
        anatomicalIndices = [],
        crossSectionIndices = [],
        stereochemistryIndices = []
    } = options;

    const exportOptions = {
        includeCharts,
        includeAnatomicalDiagrams,
        includeCrossSectionDiagrams,
        includeStereochemistryDiagrams,
        chartIndices,
        anatomicalIndices,
        crossSectionIndices,
        stereochemistryIndices
    };

    const results = {
        png: null,
        excel: null
    };

    try {
        if (format === 'png' || format === 'both') {
            const pngFilename = `${baseFilename}.png`;
            this.exportToPNG(pngFilename, exportOptions);
            results.png = {
                success: true,
                filename: pngFilename
            };
        }

        if (format === 'excel' || format === 'both') {
            const excelFilename = `${baseFilename}.xlsx`;
            results.excel = await this.exportToExcel(excelFilename, exportOptions);
        }

        return {
            success: true,
            results
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Quick export methods
async exportWithCharts(filename = 'workbook_with_charts') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeCharts: true
    });
}

async exportWithAnatomicalDiagrams(filename = 'workbook_with_anatomical') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeAnatomicalDiagrams: true
    });
}

async exportWithCrossSectionDiagrams(filename = 'workbook_with_crosssection') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeCrossSectionDiagrams: true
    });
}

async exportWithStereochemistryDiagrams(filename = 'workbook_with_molecules') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeStereochemistryDiagrams: true
    });
}

async exportWithAllDiagrams(filename = 'workbook_with_all_diagrams') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeAnatomicalDiagrams: true,
        includeCrossSectionDiagrams: true,
        includeStereochemistryDiagrams: true
    });
}

// ============================================================================
// VISUALIZATION SUMMARY METHODS
// ============================================================================

getVisualizationSummary() {
    return {
        charts: {
            count: this.charts.length,
            types: this.charts.map(c => ({
                title: c.title,
                type: c.key
            }))
        },
        anatomicalDiagrams: {
            count: this.anatomicalDiagrams.length,
            diagrams: this.anatomicalDiagrams.map(d => ({
                title: d.title,
                category: d.category
            }))
        },
        crossSectionDiagrams: {
            count: this.crossSectionDiagrams.length,
            diagrams: this.crossSectionDiagrams.map(d => ({
                title: d.title,
                category: d.category
            }))
        },
        stereochemistryDiagrams: {
            count: this.stereochemistryDiagrams.length,
            molecules: this.stereochemistryDiagrams.map(d => ({
                title: d.title,
                formula: d.formula
            }))
        },
        total: 
            this.charts.length + 
            this.anatomicalDiagrams.length +
            this.crossSectionDiagrams.length +
            this.stereochemistryDiagrams.length
    };
}

hasAnyVisualizations() {
    return (
        this.charts.length > 0 ||
        this.anatomicalDiagrams.length > 0 ||
        this.crossSectionDiagrams.length > 0 ||
        this.stereochemistryDiagrams.length > 0
    );
}

getVisualizationTypes() {
    const types = [];
    if (this.charts.length > 0) types.push('charts');
    if (this.anatomicalDiagrams.length > 0) types.push('anatomical');
    if (this.crossSectionDiagrams.length > 0) types.push('crossSection');
    if (this.stereochemistryDiagrams.length > 0) types.push('stereochemistry');
    return types;
}

// ============================================================================
// BATCH EXPORT METHODS
// ============================================================================

async exportAllVisualizationsSeparately(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const results = {
        charts: [],
        anatomical: [],
        crossSection: [],
        stereochemistry: [],
        errors: []
    };

    console.log('\n📊 Exporting all visualizations separately...\n');

    // Export charts
    for (let i = 0; i < this.charts.length; i++) {
        try {
            const chart = this.charts[i];
            const filename = `${folderPath}/chart_${i + 1}_${chart.title.replace(/[^a-z0-9]/gi, '_')}.png`;
            
            const canvas = createCanvas(
                chart.options.width || 700,
                chart.options.height || 500
            );
            const ctx = canvas.getContext('2d');

            this.chartRenderer.renderChart(canvas, ctx, chart.key, chart.data, chart.options);

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            results.charts.push({ success: true, filename, title: chart.title });
            console.log(`✓ Chart ${i + 1}: ${chart.title}`);
        } catch (error) {
            results.errors.push({ type: 'chart', index: i, error: error.message });
            console.error(`✗ Chart ${i + 1} failed: ${error.message}`);
        }
    }

    // Export anatomical diagrams
    for (let i = 0; i < this.anatomicalDiagrams.length; i++) {
        try {
            const diagram = this.anatomicalDiagrams[i];
            const filename = `${folderPath}/anatomical_${i + 1}_${diagram.title.replace(/[^a-z0-9]/gi, '_')}.png`;
            
            const canvas = createCanvas(
                diagram.options.width || 800,
                diagram.options.height || 700
            );
            const ctx = canvas.getContext('2d');

            this.diagramRenderer.canvas = canvas;
            this.diagramRenderer.ctx = ctx;
            this.renderSpecificAnatomicalDiagram(diagram.key, diagram.options);

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            results.anatomical.push({ success: true, filename, title: diagram.title });
            console.log(`✓ Anatomical ${i + 1}: ${diagram.title}`);
        } catch (error) {
            results.errors.push({ type: 'anatomical', index: i, error: error.message });
            console.error(`✗ Anatomical ${i + 1} failed: ${error.message}`);
        }
    }

    // Export cross-section diagrams
    for (let i = 0; i < this.crossSectionDiagrams.length; i++) {
        try {
            const diagram = this.crossSectionDiagrams[i];
            const filename = `${folderPath}/crosssection_${i + 1}_${diagram.title.replace(/[^a-z0-9]/gi, '_')}.png`;
            
            const canvas = createCanvas(
                diagram.options.width || 800,
                diagram.options.height || 600
            );
            const ctx = canvas.getContext('2d');

            this.crossSectionRenderer.canvas = canvas;
            this.crossSectionRenderer.ctx = ctx;
            this.crossSectionRenderer.renderDiagram(
                diagram.key,
                0,
                0,
                diagram.options.width || 800,
                diagram.options.height || 600,
                diagram.options
            );

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            results.crossSection.push({ success: true, filename, title: diagram.title });
            console.log(`✓ Cross-Section ${i + 1}: ${diagram.title}`);
        } catch (error) {
            results.errors.push({ type: 'crossSection', index: i, error: error.message });
            console.error(`✗ Cross-Section ${i + 1} failed: ${error.message}`);
        }
    }

    // Export stereochemistry diagrams
    for (let i = 0; i < this.stereochemistryDiagrams.length; i++) {
        try {
            const diagram = this.stereochemistryDiagrams[i];
            const filename = `${folderPath}/molecule_${i + 1}_${diagram.title.replace(/[^a-z0-9]/gi, '_')}.png`;
            
            const canvas = createCanvas(
                diagram.options.width || 800,
                diagram.options.height || 600
            );
            const ctx = canvas.getContext('2d');

            this.stereochemistryRenderer.canvas = canvas;
            this.stereochemistryRenderer.ctx = ctx;
            this.stereochemistryRenderer.renderDiagram(
                diagram.key,
                0,
                0,
                diagram.options.width || 800,
                diagram.options.height || 600,
                diagram.options
            );

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            results.stereochemistry.push({ success: true, filename, title: diagram.title });
            console.log(`✓ Molecule ${i + 1}: ${diagram.title}`);
        } catch (error) {
            results.errors.push({ type: 'stereochemistry', index: i, error: error.message });
            console.error(`✗ Molecule ${i + 1} failed: ${error.message}`);
        }
    }

    console.log('\n✓ Export complete!\n');

    return {
        folder: folderPath,
        results,
        summary: {
            chartsExported: results.charts.length,
            anatomicalExported: results.anatomical.length,
            crossSectionExported: results.crossSection.length,
            stereochemistryExported: results.stereochemistry.length,
            totalExported: 
                results.charts.length + 
                results.anatomical.length +
                results.crossSection.length +
                results.stereochemistry.length,
            errors: results.errors.length
        }
    };
}

  

    generateFormulaGuide() {
        const guide = {
            title: 'Available Formula Actions',
            categories: {},
            totalFormulas: 0,
            suggestions: []
        };

        const categories = SpreadsheetFormulaRegistry.getAllCategories();

        categories.forEach(category => {
            const formulas = SpreadsheetFormulaRegistry.getFormulasByCategory(category);
            guide.categories[category] = Object.entries(formulas).map(([key, formula]) => ({
                key,
                name: formula.name,
                description: formula.description,
                example: formula.example,
                excelFormula: formula.excelFormula,
                parameters: formula.paramNames || []
            }));
            guide.totalFormulas += Object.keys(formulas).length;
        });

        if (this.data.length > 0) {
            const sampleRange = `A2:A${Math.min(this.data.length + 1, 11)}`;
            guide.suggestions = this.suggestFormulas(sampleRange);
        }

        return guide;
    }

    getFormulaHelp(formulaKey) {
        const formula = SpreadsheetFormulaRegistry.getFormula(formulaKey);
        if (!formula) {
            return { error: 'Formula not found' };
        }

        return {
            name: formula.name,
            category: formula.category,
            description: formula.description,
            excelFormula: formula.excelFormula,
            example: formula.example,
            parameters: formula.params.map((param, index) => ({
                name: param,
                description: formula.paramNames[index] || param,
                required: true
            })),
            usage: formula.usage || 'Apply this formula to calculate results',
            tips: this.generateFormulaTips(formula)
        };
    }

    generateFormulaTips(formula) {
        const tips = [];

        if (formula.params.includes('range')) {
            tips.push('Use cell ranges like A1:A10 to reference multiple cells');
            tips.push('You can reference entire columns like A:A');
        }

        if (formula.category === 'Financial & Economic') {
            tips.push('Interest rates should be entered as decimals (e.g., 0.05 for 5%)');
            tips.push('Ensure time periods match (monthly rate with monthly periods)');
        }

        if (formula.category === 'Budget & Business') {
            tips.push('Compare actual vs budget to track performance');
            tips.push('Use conditional formatting to highlight variances');
        }

        if (formula.excelFormula === 'IF') {
            tips.push('Conditions can use operators: >, <, >=, <=, =, <>');
            tips.push('Nest multiple IF statements for complex logic');
        }

        return tips;
    }

    validateFormulaParams(formulaKey, params) {
        const formula = SpreadsheetFormulaRegistry.getFormula(formulaKey);
        if (!formula) {
            return { valid: false, error: 'Formula not found' };
        }

        const validation = {
            valid: true,
            warnings: [],
            errors: []
        };

        if (params.length < formula.params.length) {
            validation.errors.push(`Expected ${formula.params.length} parameters, got ${params.length}`);
            validation.valid = false;
        }

        params.forEach((param, index) => {
            const paramType = formula.params[index];

            if (typeof param === 'string' && param.includes(':')) {
                const range = this.parseRangeReference(param);
                if (!range.start || !range.end) {
                    validation.errors.push(`Invalid range reference: ${param}`);
                    validation.valid = false;
                }
            }
            else if (typeof param === 'string' && /^[A-Z]+\d+$/.test(param)) {
                const cell = this.parseCellReference(param);
                if (!cell) {
                    validation.errors.push(`Invalid cell reference: ${param}`);
                    validation.valid = false;
                }
            }

            if (formula.category === 'Financial & Economic' && typeof param !== 'string') {
                if (isNaN(parseFloat(param))) {
                    validation.errors.push(`Parameter ${index + 1} must be numeric`);
                    validation.valid = false;
                }
            }
        });

        return validation;
    }

    createFormulaTemplate(formulaKey, description = '') {
        const formula = SpreadsheetFormulaRegistry.getFormula(formulaKey);
        if (!formula) {
            return null;
        }

        return {
            key: formulaKey,
            name: formula.name,
            description: description || formula.description,
            template: formula.example,
            parameters: formula.paramNames.map((name, index) => ({
                name,
                placeholder: `<${name}>`,
                example: this.getParameterExample(formula.params[index])
            })),
            instructions: `Replace placeholders with your cell references or values`,
            example: formula.example
        };
    }

    getParameterExample(paramType) {
        switch (paramType) {
            case 'range':
                return 'A1:A10';
            case 'number':
                return '100';
            case 'rate':
                return '0.05';
            case 'text':
                return '"Sample Text"';
            default:
                return 'value';
        }
    }

    
    countEmptyCells() {
        let count = 0;
        this.data.forEach(row => {
            row.forEach(cell => {
                if (cell === '' || cell === null || cell === undefined) {
                    count++;
                }
            });
        });
        return count;
    }

    calculateStatistics() {
        const stats = {};

        for (let col = 0; col < this.headers.length; col++) {
            const values = [];
            this.data.forEach(row => {
                if (row[col] !== undefined && !isNaN(parseFloat(row[col]))) {
                    values.push(parseFloat(row[col]));
                }
            });

            if (values.length > 0) {
                const sum = values.reduce((a, b) => a + b, 0);
                const avg = sum / values.length;
                const sorted = [...values].sort((a, b) => a - b);

                stats[this.headers[col]] = {
                    count: values.length,
                    sum,
                    average: avg,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    median: sorted[Math.floor(sorted.length / 2)]
                };
            }
        }

        return stats;
    }
}

// ============================================================================
// EXPORT REGISTRIES AND CLASSES
// ============================================================================

export { SpreadsheetFormulaRegistry,GraphingCalculator, GraphingCalculatorGame,Theme, ExcelChartsRegistry, ChartCanvasRenderer, AnatomicalDiagramsRegistry, AnatomicalShapes,AnatomicalDiagramRenderer,StereochemistryDiagramsRegistry,StereochemistryDiagramRenderer,CrossSectionDiagramsRegistry,CrossSectionDiagramRenderer,CrossSectionShapes,AtomProperties,MolecularGeometry };
export default EnhancedSpreadsheetWorkbook;


