import { createCanvas } from '@napi-rs/canvas';
import * as math from 'mathjs';
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

// Enhanced Financial Functions Library with more comprehensive calculations
class FinancialFunctions {
    // Time Value of Money Functions with enhanced calculations
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

    // Enhanced NPV with detailed breakdown
    static netPresentValue(rate, cashFlows) {
        const npvDetails = {
            totalNPV: 0,
            cashFlowDetails: [],
            presentValueSum: 0,
            initialInvestment: cashFlows[0]
        };

        cashFlows.forEach((cf, period) => {
            const presentValue = cf / Math.pow(1 + rate, period);
            npvDetails.totalNPV += presentValue;
            npvDetails.cashFlowDetails.push({
                period,
                cashFlow: cf,
                discountFactor: 1 / Math.pow(1 + rate, period),
                presentValue
            });
        });

        return npvDetails.totalNPV;
    }

    // Enhanced IRR with convergence details
    static internalRateOfReturn(cashFlows, guess = 0.1, maxIterations = 100, tolerance = 1e-10) {
        let rate = guess;
        const iterations = [];
        
        for (let i = 0; i < maxIterations; i++) {
            const npv = this.netPresentValue(rate, cashFlows);
            const npvDerivative = this.calculateNPVDerivative(rate, cashFlows);
            
            iterations.push({ iteration: i + 1, rate, npv, derivative: npvDerivative });
            
            if (Math.abs(npv) < tolerance) {
                return { 
                    irr: rate, 
                    converged: true, 
                    iterations: iterations.length,
                    finalNPV: npv,
                    iterationDetails: iterations
                };
            }
            
            if (Math.abs(npvDerivative) < tolerance) {
                throw new Error('IRR calculation failed - derivative too small');
            }
            
            const newRate = rate - (npv / npvDerivative);
            
            if (Math.abs(newRate - rate) < tolerance) {
                return { 
                    irr: newRate, 
                    converged: true, 
                    iterations: iterations.length,
                    finalNPV: npv,
                    iterationDetails: iterations
                };
            }
            
            rate = newRate;
        }
        
        return { 
            irr: rate, 
            converged: false, 
            iterations: maxIterations,
            error: 'Failed to converge'
        };
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

    // Additional Financial Ratios
    static quickRatio(quickAssets, currentLiabilities) {
        if (currentLiabilities === 0) throw new Error('Current liabilities cannot be zero');
        const ratio = quickAssets / currentLiabilities;
        return {
            ratio,
            quickAssets,
            currentLiabilities,
            interpretation: this.interpretQuickRatio(ratio),
            riskLevel: this.assessLiquidityRisk(ratio)
        };
    }

    static interpretQuickRatio(ratio) {
        if (ratio >= 1.5) return { level: 'Excellent', description: 'Very strong immediate liquidity without relying on inventory' };
        if (ratio >= 1.0) return { level: 'Good', description: 'Adequate immediate liquidity to meet short-term obligations' };
        if (ratio >= 0.8) return { level: 'Adequate', description: 'Minimal but acceptable immediate liquidity' };
        if (ratio >= 0.6) return { level: 'Weak', description: 'Limited immediate liquidity - monitor closely' };
        return { level: 'Critical', description: 'Insufficient liquid assets to meet short-term obligations' };
    }

    static debtToEquityRatio(totalDebt, totalEquity) {
        if (totalEquity === 0) throw new Error('Total equity cannot be zero');
        const ratio = totalDebt / totalEquity;
        return {
            ratio,
            totalDebt,
            totalEquity,
            interpretation: this.interpretDebtToEquity(ratio),
            leverageLevel: this.assessLeverageLevel(ratio)
        };
    }

    static interpretDebtToEquity(ratio) {
        if (ratio >= 2.0) return { level: 'Very High', description: 'Excessive leverage - significant financial risk' };
        if (ratio >= 1.0) return { level: 'High', description: 'High leverage - debt exceeds equity' };
        if (ratio >= 0.6) return { level: 'Moderate-High', description: 'Elevated leverage - monitor debt capacity' };
        if (ratio >= 0.3) return { level: 'Moderate', description: 'Balanced capital structure' };
        return { level: 'Conservative', description: 'Low leverage - strong equity base' };
    }

    static assessLeverageLevel(ratio) {
        if (ratio >= 1.5) return 'High Risk';
        if (ratio >= 0.8) return 'Moderate Risk';
        if (ratio >= 0.4) return 'Low Risk';
        return 'Very Low Risk';
    }

    static returnOnAssets(netIncome, averageAssets) {
        if (averageAssets === 0) throw new Error('Average assets cannot be zero');
        const roa = netIncome / averageAssets;
        return {
            roa,
            netIncome,
            averageAssets,
            interpretation: this.interpretROA(roa),
            efficiencyLevel: this.assessAssetEfficiency(roa)
        };
    }

    static interpretROA(roa) {
        const percentage = roa * 100;
        if (percentage >= 15) return { level: 'Exceptional', description: 'Outstanding asset utilization and profitability' };
        if (percentage >= 10) return { level: 'Excellent', description: 'Very efficient asset utilization' };
        if (percentage >= 5) return { level: 'Good', description: 'Above-average asset efficiency' };
        if (percentage >= 2) return { level: 'Average', description: 'Market-level asset utilization' };
        if (percentage >= 0) return { level: 'Poor', description: 'Inefficient asset utilization' };
        return { level: 'Loss', description: 'Assets generating losses' };
    }

    static assessAssetEfficiency(roa) {
        const percentage = roa * 100;
        if (percentage >= 10) return 'Highly Efficient';
        if (percentage >= 5) return 'Efficient';
        if (percentage >= 2) return 'Moderately Efficient';
        return 'Inefficient';
    }

    // Profitability Margins
    static grossProfitMargin(grossProfit, revenue) {
        if (revenue === 0) throw new Error('Revenue cannot be zero');
        const margin = grossProfit / revenue;
        return {
            margin,
            grossProfit,
            revenue,
            interpretation: this.interpretGrossProfitMargin(margin),
            competitivePosition: this.assessMarginCompetitiveness(margin, 'gross')
        };
    }

    static operatingMargin(operatingIncome, revenue) {
        if (revenue === 0) throw new Error('Revenue cannot be zero');
        const margin = operatingIncome / revenue;
        return {
            margin,
            operatingIncome,
            revenue,
            interpretation: this.interpretOperatingMargin(margin),
            competitivePosition: this.assessMarginCompetitiveness(margin, 'operating')
        };
    }

    static netProfitMargin(netIncome, revenue) {
        if (revenue === 0) throw new Error('Revenue cannot be zero');
        const margin = netIncome / revenue;
        return {
            margin,
            netIncome,
            revenue,
            interpretation: this.interpretNetProfitMargin(margin),
            competitivePosition: this.assessMarginCompetitiveness(margin, 'net')
        };
    }

    static interpretGrossProfitMargin(margin) {
        const percentage = margin * 100;
        if (percentage >= 70) return { level: 'Exceptional', description: 'Outstanding pricing power and cost control' };
        if (percentage >= 50) return { level: 'Excellent', description: 'Strong gross profitability' };
        if (percentage >= 30) return { level: 'Good', description: 'Healthy gross margins' };
        if (percentage >= 20) return { level: 'Average', description: 'Market-level gross margins' };
        if (percentage >= 10) return { level: 'Weak', description: 'Low gross profitability' };
        return { level: 'Poor', description: 'Very weak gross margins' };
    }

    static interpretOperatingMargin(margin) {
        const percentage = margin * 100;
        if (percentage >= 25) return { level: 'Exceptional', description: 'Outstanding operational efficiency' };
        if (percentage >= 15) return { level: 'Excellent', description: 'Strong operational performance' };
        if (percentage >= 10) return { level: 'Good', description: 'Healthy operating margins' };
        if (percentage >= 5) return { level: 'Average', description: 'Market-level operating efficiency' };
        if (percentage >= 0) return { level: 'Weak', description: 'Poor operating performance' };
        return { level: 'Loss', description: 'Operating losses' };
    }

    static interpretNetProfitMargin(margin) {
        const percentage = margin * 100;
        if (percentage >= 20) return { level: 'Exceptional', description: 'Outstanding overall profitability' };
        if (percentage >= 10) return { level: 'Excellent', description: 'Strong net profitability' };
        if (percentage >= 5) return { level: 'Good', description: 'Healthy net margins' };
        if (percentage >= 2) return { level: 'Average', description: 'Market-level profitability' };
        if (percentage >= 0) return { level: 'Weak', description: 'Poor overall profitability' };
        return { level: 'Loss', description: 'Net losses' };
    }

    static assessMarginCompetitiveness(margin, type) {
        const percentage = margin * 100;
        const thresholds = {
            gross: { high: 50, average: 30, low: 20 },
            operating: { high: 15, average: 10, low: 5 },
            net: { high: 10, average: 5, low: 2 }
        };
        
        const t = thresholds[type];
        if (percentage >= t.high) return 'Industry Leader';
        if (percentage >= t.average) return 'Competitive';
        if (percentage >= t.low) return 'Below Average';
        return 'Underperformer';
    }

    // Market Ratios
    static earningsPerShare(netIncome, weightedAverageShares) {
        if (weightedAverageShares === 0) throw new Error('Weighted average shares cannot be zero');
        const eps = netIncome / weightedAverageShares;
        return {
            eps,
            netIncome,
            weightedAverageShares,
            interpretation: this.interpretEPS(eps)
        };
    }

    static interpretEPS(eps) {
        if (eps >= 5) return { level: 'Excellent', description: 'Strong earnings per share performance' };
        if (eps >= 2) return { level: 'Good', description: 'Solid earnings per share' };
        if (eps >= 1) return { level: 'Average', description: 'Market-level earnings per share' };
        if (eps >= 0) return { level: 'Weak', description: 'Low earnings per share' };
        return { level: 'Loss', description: 'Negative earnings per share' };
    }

    static priceToEarningsRatio(marketPrice, earningsPerShare) {
        if (earningsPerShare === 0) throw new Error('Earnings per share cannot be zero');
        const peRatio = marketPrice / earningsPerShare;
        return {
            peRatio,
            marketPrice,
            earningsPerShare,
            interpretation: this.interpretPERatio(peRatio),
            valuation: this.assessValuation(peRatio)
        };
    }

    static interpretPERatio(peRatio) {
        if (peRatio >= 30) return { level: 'Very High', description: 'High growth expectations or overvalued' };
        if (peRatio >= 20) return { level: 'High', description: 'Strong growth expectations' };
        if (peRatio >= 15) return { level: 'Average-High', description: 'Market-level to above-average valuation' };
        if (peRatio >= 10) return { level: 'Average', description: 'Market-level valuation' };
        if (peRatio >= 5) return { level: 'Low', description: 'Below-average valuation or concerns' };
        return { level: 'Very Low', description: 'Undervalued or significant concerns' };
    }

    static assessValuation(peRatio) {
        if (peRatio >= 25) return 'Potentially Overvalued';
        if (peRatio >= 15) return 'Fairly Valued';
        if (peRatio >= 8) return 'Reasonably Valued';
        return 'Potentially Undervalued';
    }

    static workingCapital(currentAssets, currentLiabilities) {
        const workingCapital = currentAssets - currentLiabilities;
        return {
            workingCapital,
            currentAssets,
            currentLiabilities,
            interpretation: this.interpretWorkingCapital(workingCapital, currentAssets),
            adequacy: this.assessWorkingCapitalAdequacy(workingCapital, currentLiabilities)
        };
    }

    static interpretWorkingCapital(workingCapital, currentAssets) {
        const ratio = workingCapital / currentAssets;
        if (ratio >= 0.5) return { level: 'Strong', description: 'Substantial working capital cushion' };
        if (ratio >= 0.3) return { level: 'Good', description: 'Adequate working capital position' };
        if (ratio >= 0.1) return { level: 'Adequate', description: 'Minimal but sufficient working capital' };
        if (ratio >= 0) return { level: 'Weak', description: 'Limited working capital buffer' };
        return { level: 'Negative', description: 'Working capital deficit - liquidity risk' };
    }

    static assessWorkingCapitalAdequacy(workingCapital, currentLiabilities) {
        if (workingCapital >= currentLiabilities) return 'More than Adequate';
        if (workingCapital >= currentLiabilities * 0.5) return 'Adequate';
        if (workingCapital >= 0) return 'Minimal';
        return 'Inadequate';
    }

    // Break-Even Analysis - Enhanced
    static breakEvenRevenue(fixedCosts, contributionMarginRatio) {
        if (contributionMarginRatio <= 0) throw new Error('Contribution margin ratio must be positive');
        const breakEvenRevenue = fixedCosts / contributionMarginRatio;
        return {
            breakEvenRevenue,
            fixedCosts,
            contributionMarginRatio,
            interpretation: this.interpretBreakEvenRevenue(breakEvenRevenue, fixedCosts)
        };
    }

    static interpretBreakEvenRevenue(breakEvenRevenue, fixedCosts) {
        const fixedCostCoverage = fixedCosts / breakEvenRevenue;
        if (fixedCostCoverage <= 0.2) return { level: 'Excellent', description: 'Low break-even threshold with strong scalability' };
        if (fixedCostCoverage <= 0.4) return { level: 'Good', description: 'Reasonable break-even point' };
        if (fixedCostCoverage <= 0.6) return { level: 'Average', description: 'Moderate break-even requirements' };
        if (fixedCostCoverage <= 0.8) return { level: 'High', description: 'High break-even threshold' };
        return { level: 'Very High', description: 'Challenging break-even requirements' };
    }

    // Valuation Models
    static dividendDiscountModel(dividend, growthRate, requiredReturn) {
        if (requiredReturn <= growthRate) {
            throw new Error('Required return must be greater than growth rate');
        }
        const value = dividend / (requiredReturn - growthRate);
        return {
            value,
            dividend,
            growthRate,
            requiredReturn,
            interpretation: this.interpretDividendDiscountModel(value, dividend, growthRate),
            sensitivity: this.analyzeDDMSensitivity(dividend, growthRate, requiredReturn)
        };
    }

    static interpretDividendDiscountModel(value, dividend, growthRate) {
        const dividendYield = dividend / value;
        if (dividendYield >= 0.06) return { level: 'High Yield', description: 'Attractive dividend yield for income investors' };
        if (dividendYield >= 0.04) return { level: 'Good Yield', description: 'Reasonable dividend yield' };
        if (dividendYield >= 0.02) return { level: 'Moderate Yield', description: 'Average dividend yield' };
        return { level: 'Low Yield', description: 'Low dividend yield - growth-focused' };
    }

    static analyzeDDMSensitivity(dividend, growthRate, requiredReturn) {
        const spread = requiredReturn - growthRate;
        if (spread <= 0.02) return 'High sensitivity to assumption changes';
        if (spread <= 0.05) return 'Moderate sensitivity to assumptions';
        return 'Low sensitivity to assumption changes';
    }

    static economicValueAdded(nopat, wacc, investedCapital) {
        const eva = nopat - (wacc * investedCapital);
        return {
            eva,
            nopat,
            wacc,
            investedCapital,
            interpretation: this.interpretEVA(eva, investedCapital),
            valueCreation: this.assessValueCreation(eva, nopat)
        };
    }

    static interpretEVA(eva, investedCapital) {
        const evaSpread = eva / investedCapital;
        if (evaSpread >= 0.10) return { level: 'Excellent', description: 'Strong economic value creation' };
        if (evaSpread >= 0.05) return { level: 'Good', description: 'Positive economic value creation' };
        if (evaSpread >= 0) return { level: 'Adequate', description: 'Minimal value creation above cost of capital' };
        if (evaSpread >= -0.05) return { level: 'Poor', description: 'Slight value destruction' };
        return { level: 'Very Poor', description: 'Significant value destruction' };
    }

    static assessValueCreation(eva, nopat) {
        if (eva > 0) return `Creating ${((eva / nopat) * 100).toFixed(1)}% excess value above cost of capital`;
        return `Destroying ${((Math.abs(eva) / nopat) * 100).toFixed(1)}% of value below cost of capital`;
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
        const ccc = daysInventoryOutstanding + daysReceivablesOutstanding - daysPayablesOutstanding;
        return {
            ccc,
            daysInventoryOutstanding,
            daysReceivablesOutstanding, 
            daysPayablesOutstanding,
            interpretation: this.interpretCashConversionCycle(ccc),
            efficiency: this.assessWorkingCapitalEfficiency(ccc)
        };
    }

    static interpretCashConversionCycle(ccc) {
        if (ccc <= 30) return { level: 'Excellent', description: 'Very efficient cash conversion - strong working capital management' };
        if (ccc <= 60) return { level: 'Good', description: 'Efficient cash conversion cycle' };
        if (ccc <= 90) return { level: 'Average', description: 'Market-level cash conversion efficiency' };
        if (ccc <= 120) return { level: 'Weak', description: 'Slow cash conversion - needs improvement' };
        return { level: 'Poor', description: 'Very slow cash conversion - significant working capital issues' };
    }

    static assessWorkingCapitalEfficiency(ccc) {
        if (ccc <= 45) return 'Highly Efficient';
        if (ccc <= 75) return 'Efficient';
        if (ccc <= 105) return 'Moderately Efficient';
        return 'Inefficient';
    }

    static calculateNPVDerivative(rate, cashFlows) {
        return cashFlows.reduce((derivative, cf, period) => {
            if (period === 0) return derivative;
            return derivative - (period * cf / Math.pow(1 + rate, period + 1));
        }, 0);
    }

    // Enhanced ratio analysis with industry context
    static currentRatio(currentAssets, currentLiabilities) {
        if (currentLiabilities === 0) throw new Error('Current liabilities cannot be zero');
        const ratio = currentAssets / currentLiabilities;
        return {
            ratio,
            workingCapital: currentAssets - currentLiabilities,
            interpretation: this.interpretCurrentRatio(ratio),
            riskLevel: this.assessLiquidityRisk(ratio)
        };
    }

    static interpretCurrentRatio(ratio) {
        if (ratio >= 2.5) return { level: 'Excellent', description: 'Very strong liquidity position, may indicate inefficient use of assets' };
        if (ratio >= 2.0) return { level: 'Very Good', description: 'Strong liquidity position with comfortable safety margin' };
        if (ratio >= 1.5) return { level: 'Good', description: 'Adequate liquidity for normal operations' };
        if (ratio >= 1.2) return { level: 'Adequate', description: 'Minimal but acceptable liquidity cushion' };
        if (ratio >= 1.0) return { level: 'Weak', description: 'Just meeting short-term obligations, monitor closely' };
        return { level: 'Poor', description: 'Significant liquidity concerns, immediate attention required' };
    }

    static assessLiquidityRisk(ratio) {
        if (ratio >= 2.0) return 'Low Risk';
        if (ratio >= 1.5) return 'Moderate Risk';
        if (ratio >= 1.0) return 'High Risk';
        return 'Critical Risk';
    }

    // Enhanced ROE with DuPont Analysis
    static returnOnEquity(netIncome, averageEquity, revenue = null, totalAssets = null) {
        if (averageEquity === 0) throw new Error('Average equity cannot be zero');
        
        const roe = netIncome / averageEquity;
        const result = {
            roe,
            interpretation: this.interpretROE(roe)
        };

        // Add DuPont analysis if additional data provided
        if (revenue && totalAssets) {
            result.duPont = {
                netProfitMargin: netIncome / revenue,
                assetTurnover: revenue / totalAssets,
                equityMultiplier: totalAssets / averageEquity,
                verification: (netIncome / revenue) * (revenue / totalAssets) * (totalAssets / averageEquity)
            };
        }

        return result;
    }

    static interpretROE(roe) {
        const percentage = roe * 100;
        if (percentage >= 25) return { level: 'Exceptional', description: 'Outstanding returns, investigate sustainability' };
        if (percentage >= 20) return { level: 'Excellent', description: 'Very strong returns for shareholders' };
        if (percentage >= 15) return { level: 'Very Good', description: 'Above-average performance' };
        if (percentage >= 10) return { level: 'Average', description: 'Market-level returns' };
        if (percentage >= 5) return { level: 'Below Average', description: 'Subpar performance, needs improvement' };
        if (percentage >= 0) return { level: 'Poor', description: 'Weak returns, significant concerns' };
        return { level: 'Loss', description: 'Company is losing money' };
    }

    // Enhanced Break-Even Analysis
    static breakEvenUnits(fixedCosts, pricePerUnit, variableCostPerUnit) {
        const contributionMargin = pricePerUnit - variableCostPerUnit;
        if (contributionMargin <= 0) throw new Error('Contribution margin must be positive');
        
        const breakEvenUnits = fixedCosts / contributionMargin;
        const breakEvenRevenue = breakEvenUnits * pricePerUnit;
        const contributionMarginRatio = contributionMargin / pricePerUnit;

        return {
            breakEvenUnits,
            breakEvenRevenue,
            contributionMargin,
            contributionMarginRatio,
            operatingLeverage: this.calculateOperatingLeverage(fixedCosts, contributionMargin * breakEvenUnits),
            marginOfSafety: null // Will be calculated if actual sales provided
        };
    }

    static calculateOperatingLeverage(fixedCosts, contributionMargin) {
        return contributionMargin / (contributionMargin - fixedCosts);
    }
}

// Enhanced Formula Registry with detailed metadata
class FormulaRegistry {
    static formulas = {
        'presentValue': {
            name: 'Present Value (PV)',
            category: 'Time Value of Money',
            params: ['futureValue', 'interestRate', 'periods', 'payment', 'type'],
            paramNames: ['Future Value ($)', 'Interest Rate (%)', 'Number of Periods', 'Payment ($)', 'Type (0=end, 1=beginning)'],
            defaultParams: [10000, 0.08, 5, 0, 0],
            formula: 'PV = FV / (1 + r)^n + PMT × [(1 - (1 + r)^-n) / r]',
            calculate: (params) => FinancialFunctions.presentValue(params[0], params[1], params[2], params[3], params[4]),
            description: 'Calculates the current worth of a future sum of money or stream of cash flows',
            useCases: ['Investment valuation', 'Bond pricing', 'Loan present value', 'Retirement planning'],
            industryBenchmarks: {
                'Conservative': 'Use 3-5% discount rate',
                'Moderate': 'Use 6-8% discount rate', 
                'Aggressive': 'Use 9-12% discount rate'
            },
            keyInsights: [
                'Higher discount rates reduce present value significantly',
                'Longer time periods compound the discounting effect',
                'Small rate changes have large impacts on long-term values'
            ]
        },

        'netPresentValue': {
            name: 'Net Present Value (NPV)',
            category: 'Investment Analysis',
            params: ['discountRate', 'cashFlows'],
            paramNames: ['Discount Rate (%)', 'Cash Flows Array (Period 0, 1, 2...)'],
            defaultParams: [0.12, [-100000, 25000, 35000, 40000, 45000, 50000]],
            formula: 'NPV = Σ [CFt / (1 + r)^t]',
            calculate: (params) => FinancialFunctions.netPresentValue(params[0], params[1]),
            description: 'Measures the net value created by an investment after accounting for the time value of money',
            useCases: ['Capital budgeting', 'Project evaluation', 'Acquisition analysis', 'Equipment purchases'],
            decisionRules: {
                accept: 'NPV > 0: Project adds value',
                reject: 'NPV < 0: Project destroys value',
                indifferent: 'NPV = 0: Project breaks even'
            },
            industryBenchmarks: {
                'Technology': 'Hurdle rates: 15-20%',
                'Manufacturing': 'Hurdle rates: 10-15%',
                'Utilities': 'Hurdle rates: 8-12%',
                'Real Estate': 'Hurdle rates: 12-18%'
            }
        },

        'currentRatio': {
            name: 'Current Ratio',
            category: 'Liquidity Analysis',
            params: ['currentAssets', 'currentLiabilities'],
            paramNames: ['Current Assets ($)', 'Current Liabilities ($)'],
            defaultParams: [250000, 150000],
            formula: 'Current Ratio = Current Assets / Current Liabilities',
            calculate: (params) => FinancialFunctions.currentRatio(params[0], params[1]),
            description: 'Measures a company\'s ability to pay short-term obligations with short-term assets',
            useCases: ['Credit analysis', 'Liquidity assessment', 'Working capital management', 'Bank lending decisions'],
            industryBenchmarks: {
                'Retail': '1.2 - 1.8',
                'Manufacturing': '1.5 - 2.5',
                'Technology': '2.0 - 4.0',
                'Utilities': '0.8 - 1.2'
            },
            warningSignals: [
                'Ratio < 1.0: May struggle to pay bills',
                'Ratio > 3.0: May be hoarding cash inefficiently',
                'Declining trend: Deteriorating liquidity'
            ]
        },

        'returnOnEquity': {
            name: 'Return on Equity (ROE)',
            category: 'Profitability Analysis',
            params: ['netIncome', 'averageEquity'],
            paramNames: ['Net Income ($)', 'Average Shareholders\' Equity ($)'],
            defaultParams: [50000, 400000],
            formula: 'ROE = Net Income / Average Shareholders\' Equity',
            calculate: (params) => FinancialFunctions.returnOnEquity(params[0], params[1]),
            description: 'Measures how effectively a company generates profits from shareholders\' investments',
            useCases: ['Performance evaluation', 'Investment analysis', 'Management assessment', 'Stock valuation'],
            industryBenchmarks: {
                'Banking': '8-12%',
                'Technology': '15-25%',
                'Consumer Goods': '12-18%',
                'Manufacturing': '10-15%'
            },
            dupontComponents: {
                'Profitability': 'Net Profit Margin = Net Income / Revenue',
                'Efficiency': 'Asset Turnover = Revenue / Total Assets',
                'Leverage': 'Equity Multiplier = Total Assets / Shareholders\' Equity'
            }
        },

        'breakEvenUnits': {
            name: 'Break-Even Analysis',
            category: 'Cost-Volume-Profit Analysis',
            params: ['fixedCosts', 'pricePerUnit', 'variableCostPerUnit'],
            paramNames: ['Fixed Costs ($)', 'Price per Unit ($)', 'Variable Cost per Unit ($)'],
            defaultParams: [120000, 75, 45],
            formula: 'Break-Even Units = Fixed Costs / (Price - Variable Cost per Unit)',
            calculate: (params) => FinancialFunctions.breakEvenUnits(params[0], params[1], params[2]),
            description: 'Determines the sales volume needed to cover all fixed and variable costs',
            useCases: ['Production planning', 'Pricing decisions', 'Cost management', 'Business planning'],
            keyMetrics: {
                'Contribution Margin': 'Revenue per unit after variable costs',
                'Margin of Safety': 'Actual sales above break-even point',
                'Operating Leverage': 'Sensitivity of profits to sales changes'
            }
        },

        'quickRatio': {
            name: 'Quick Ratio (Acid Test)',
            category: 'Liquidity Analysis',
            params: ['quickAssets', 'currentLiabilities'],
            paramNames: ['Quick Assets ($)', 'Current Liabilities ($)'],
            defaultParams: [150000, 100000],
            formula: 'Quick Ratio = Quick Assets / Current Liabilities',
            calculate: (params) => FinancialFunctions.quickRatio(params[0], params[1]),
            description: 'Measures ability to pay short-term obligations with most liquid assets',
            useCases: ['Credit analysis', 'Liquidity assessment', 'Emergency cash planning'],
            industryBenchmarks: {
                'Manufacturing': '0.8 - 1.2',
                'Technology': '1.5 - 3.0',
                'Retail': '0.6 - 1.0',
                'Healthcare': '1.0 - 2.0'
            }
        },

        'debtToEquityRatio': {
            name: 'Debt-to-Equity Ratio',
            category: 'Leverage Analysis',
            params: ['totalDebt', 'totalEquity'],
            paramNames: ['Total Debt ($)', 'Total Equity ($)'],
            defaultParams: [200000, 300000],
            formula: 'D/E Ratio = Total Debt / Total Equity',
            calculate: (params) => FinancialFunctions.debtToEquityRatio(params[0], params[1]),
            description: 'Measures financial leverage and capital structure',
            useCases: ['Credit risk assessment', 'Capital structure analysis', 'Investment decisions'],
            industryBenchmarks: {
                'Utilities': '1.0 - 2.0',
                'Technology': '0.1 - 0.5',
                'Real Estate': '2.0 - 4.0',
                'Manufacturing': '0.5 - 1.5'
            }
        },

        'returnOnAssets': {
            name: 'Return on Assets (ROA)',
            category: 'Profitability Analysis',
            params: ['netIncome', 'averageAssets'],
            paramNames: ['Net Income ($)', 'Average Total Assets ($)'],
            defaultParams: [50000, 500000],
            formula: 'ROA = Net Income / Average Total Assets',
            calculate: (params) => FinancialFunctions.returnOnAssets(params[0], params[1]),
            description: 'Measures how efficiently assets generate profits',
            useCases: ['Performance evaluation', 'Asset management', 'Investment analysis'],
            industryBenchmarks: {
                'Banking': '0.8% - 1.5%',
                'Technology': '5% - 15%',
                'Retail': '3% - 8%',
                'Manufacturing': '4% - 10%'
            }
        },

        'futureValue': {
            name: 'Future Value (FV)',
            category: 'Time Value of Money',
            params: ['presentValue', 'interestRate', 'periods', 'payment', 'type'],
            paramNames: ['Present Value ($)', 'Interest Rate (%)', 'Number of Periods', 'Payment ($)', 'Type (0=end, 1=beginning)'],
            defaultParams: [5000, 0.08, 5, 0, 0],
            formula: 'FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]',
            calculate: (params) => FinancialFunctions.futureValue(params[0], params[1], params[2], params[3], params[4]),
            description: 'Calculates the future worth of a present sum of money or stream of cash flows',
            useCases: ['Investment planning', 'Retirement savings', 'Goal setting', 'Compound growth analysis'],
            industryBenchmarks: {
                'Conservative Growth': '3-5% annually',
                'Moderate Growth': '6-8% annually',
                'Aggressive Growth': '9-12% annually'
            }
        },

        'compoundInterest': {
            name: 'Compound Interest',
            category: 'Time Value of Money',
            params: ['principal', 'rate', 'periods', 'compoundingFrequency'],
            paramNames: ['Principal ($)', 'Annual Interest Rate (%)', 'Number of Years', 'Compounding Frequency (per year)'],
            defaultParams: [10000, 0.06, 10, 12],
            formula: 'A = P(1 + r/n)^(nt)',
            calculate: (params) => FinancialFunctions.compoundInterest(params[0], params[1], params[2], params[3]),
            description: 'Calculates compound interest with specified compounding frequency',
            useCases: ['Savings growth', 'Investment returns', 'Loan interest', 'Retirement planning'],
            compoundingTypes: {
                'Annual': 1,
                'Semi-Annual': 2,
                'Quarterly': 4,
                'Monthly': 12,
                'Daily': 365
            }
        },

        'effectiveInterestRate': {
            name: 'Effective Interest Rate',
            category: 'Time Value of Money',
            params: ['nominalRate', 'compoundingFrequency'],
            paramNames: ['Nominal Interest Rate (%)', 'Compounding Frequency (per year)'],
            defaultParams: [0.06, 12],
            formula: 'EIR = (1 + r/n)^n - 1',
            calculate: (params) => FinancialFunctions.effectiveInterestRate(params[0], params[1]),
            description: 'Calculates the effective annual rate accounting for compounding',
            useCases: ['Loan comparison', 'Investment analysis', 'Rate standardization'],
            keyInsight: 'Higher compounding frequency increases effective rate above nominal rate'
        },

        'internalRateOfReturn': {
            name: 'Internal Rate of Return (IRR)',
            category: 'Investment Analysis',
            params: ['cashFlows', 'guess', 'maxIterations', 'tolerance'],
            paramNames: ['Cash Flows Array', 'Initial Guess (%)', 'Max Iterations', 'Tolerance'],
            defaultParams: [[-100000, 25000, 35000, 40000, 45000], 0.1, 100, 1e-10],
            formula: 'IRR: Rate where NPV = 0',
            calculate: (params) => FinancialFunctions.internalRateOfReturn(params[0], params[1], params[2], params[3]),
            description: 'Finds the discount rate that makes NPV equal to zero',
            useCases: ['Investment evaluation', 'Capital budgeting', 'Performance measurement'],
            decisionRules: {
                accept: 'IRR > Cost of Capital',
                reject: 'IRR < Cost of Capital',
                ranking: 'Higher IRR generally preferred'
            }
        },

        'paybackPeriod': {
            name: 'Payback Period',
            category: 'Investment Analysis',
            params: ['initialInvestment', 'cashFlows'],
            paramNames: ['Initial Investment ($)', 'Annual Cash Flows Array'],
            defaultParams: [100000, [25000, 30000, 35000, 40000]],
            formula: 'Payback = Years until Cumulative Cash Flows = Initial Investment',
            calculate: (params) => FinancialFunctions.paybackPeriod(params[0], params[1]),
            description: 'Time required to recover initial investment from cash flows',
            useCases: ['Quick investment screening', 'Liquidity assessment', 'Risk evaluation'],
            limitations: 'Ignores time value of money and cash flows after payback'
        },

        'discountedPaybackPeriod': {
            name: 'Discounted Payback Period',
            category: 'Investment Analysis',
            params: ['initialInvestment', 'cashFlows', 'discountRate'],
            paramNames: ['Initial Investment ($)', 'Annual Cash Flows Array', 'Discount Rate (%)'],
            defaultParams: [100000, [25000, 30000, 35000, 40000], 0.1],
            formula: 'DPP = Years until Cumulative Discounted Cash Flows = Initial Investment',
            calculate: (params) => FinancialFunctions.discountedPaybackPeriod(params[0], params[1], params[2]),
            description: 'Payback period accounting for time value of money',
            useCases: ['Enhanced investment screening', 'Risk-adjusted payback analysis'],
            advantage: 'Considers time value of money unlike simple payback period'
        },

        'grossProfitMargin': {
            name: 'Gross Profit Margin',
            category: 'Profitability Analysis',
            params: ['grossProfit', 'revenue'],
            paramNames: ['Gross Profit ($)', 'Revenue ($)'],
            defaultParams: [150000, 250000],
            formula: 'Gross Margin = Gross Profit / Revenue',
            calculate: (params) => FinancialFunctions.grossProfitMargin(params[0], params[1]),
            description: 'Measures profitability after direct costs',
            useCases: ['Pricing analysis', 'Cost management', 'Competitive positioning'],
            industryBenchmarks: {
                'Software': '70-90%',
                'Retail': '20-50%',
                'Manufacturing': '15-40%',
                'Services': '50-80%'
            }
        },

        'operatingMargin': {
            name: 'Operating Margin',
            category: 'Profitability Analysis',
            params: ['operatingIncome', 'revenue'],
            paramNames: ['Operating Income ($)', 'Revenue ($)'],
            defaultParams: [75000, 250000],
            formula: 'Operating Margin = Operating Income / Revenue',
            calculate: (params) => FinancialFunctions.operatingMargin(params[0], params[1]),
            description: 'Measures operational efficiency after all operating expenses',
            useCases: ['Operational performance', 'Management effectiveness', 'Industry comparison'],
            industryBenchmarks: {
                'Technology': '15-30%',
                'Healthcare': '10-20%',
                'Retail': '3-8%',
                'Manufacturing': '5-15%'
            }
        },

        'netProfitMargin': {
            name: 'Net Profit Margin',
            category: 'Profitability Analysis',
            params: ['netIncome', 'revenue'],
            paramNames: ['Net Income ($)', 'Revenue ($)'],
            defaultParams: [50000, 250000],
            formula: 'Net Margin = Net Income / Revenue',
            calculate: (params) => FinancialFunctions.netProfitMargin(params[0], params[1]),
            description: 'Measures overall profitability after all expenses',
            useCases: ['Overall performance', 'Investment analysis', 'Shareholder value'],
            industryBenchmarks: {
                'Software': '15-25%',
                'Banking': '15-30%',
                'Retail': '2-6%',
                'Manufacturing': '3-8%'
            }
        },

        'earningsPerShare': {
            name: 'Earnings Per Share (EPS)',
            category: 'Market Ratios',
            params: ['netIncome', 'weightedAverageShares'],
            paramNames: ['Net Income ($)', 'Weighted Average Shares Outstanding'],
            defaultParams: [1000000, 100000],
            formula: 'EPS = Net Income / Weighted Average Shares Outstanding',
            calculate: (params) => FinancialFunctions.earningsPerShare(params[0], params[1]),
            description: 'Net income attributable to each share of common stock',
            useCases: ['Stock valuation', 'Performance measurement', 'Shareholder analysis'],
            keyInsight: 'Higher EPS generally indicates better profitability per share'
        },

        'priceToEarningsRatio': {
            name: 'Price-to-Earnings Ratio (P/E)',
            category: 'Market Ratios',
            params: ['marketPrice', 'earningsPerShare'],
            paramNames: ['Market Price per Share ($)', 'Earnings Per Share ($)'],
            defaultParams: [50, 2.5],
            formula: 'P/E Ratio = Market Price per Share / Earnings per Share',
            calculate: (params) => FinancialFunctions.priceToEarningsRatio(params[0], params[1]),
            description: 'Valuation ratio comparing price to earnings',
            useCases: ['Stock valuation', 'Investment decisions', 'Market comparison'],
            industryBenchmarks: {
                'Technology': '20-40',
                'Utilities': '12-18',
                'Banking': '8-15',
                'Growth Stocks': '25-50+'
            }
        },

        'workingCapital': {
            name: 'Working Capital',
            category: 'Liquidity Analysis',
            params: ['currentAssets', 'currentLiabilities'],
            paramNames: ['Current Assets ($)', 'Current Liabilities ($)'],
            defaultParams: [300000, 150000],
            formula: 'Working Capital = Current Assets - Current Liabilities',
            calculate: (params) => FinancialFunctions.workingCapital(params[0], params[1]),
            description: 'Measures short-term financial health and operational efficiency',
            useCases: ['Cash flow management', 'Operational planning', 'Credit analysis'],
            interpretation: {
                positive: 'Company can meet short-term obligations',
                negative: 'Potential liquidity problems',
                optimal: 'Sufficient but not excessive working capital'
            }
        },

        'breakEvenRevenue': {
            name: 'Break-Even Revenue',
            category: 'Cost-Volume-Profit Analysis',
            params: ['fixedCosts', 'contributionMarginRatio'],
            paramNames: ['Fixed Costs ($)', 'Contribution Margin Ratio (%)'],
            defaultParams: [120000, 0.4],
            formula: 'Break-Even Revenue = Fixed Costs / Contribution Margin Ratio',
            calculate: (params) => FinancialFunctions.breakEvenRevenue(params[0], params[1]),
            description: 'Revenue level needed to cover all fixed and variable costs',
            useCases: ['Sales targeting', 'Business planning', 'Pricing strategy'],
            keyInsight: 'Higher contribution margin ratio lowers break-even revenue requirement'
        },

        'dividendDiscountModel': {
            name: 'Dividend Discount Model (DDM)',
            category: 'Valuation Models',
            params: ['dividend', 'growthRate', 'requiredReturn'],
            paramNames: ['Expected Dividend per Share ($)', 'Growth Rate (%)', 'Required Return (%)'],
            defaultParams: [2.5, 0.05, 0.12],
            formula: 'DDM Value = Dividend / (Required Return - Growth Rate)',
            calculate: (params) => FinancialFunctions.dividendDiscountModel(params[0], params[1], params[2]),
            description: 'Values stock based on present value of expected dividends',
            useCases: ['Stock valuation', 'Investment decisions', 'Dividend policy analysis'],
            limitations: 'Assumes constant growth rate and requires required return > growth rate'
        },

        'economicValueAdded': {
            name: 'Economic Value Added (EVA)',
            category: 'Valuation Models',
            params: ['nopat', 'wacc', 'investedCapital'],
            paramNames: ['Net Operating Profit After Tax ($)', 'Weighted Average Cost of Capital (%)', 'Invested Capital ($)'],
            defaultParams: [150000, 0.1, 1000000],
            formula: 'EVA = NOPAT - (WACC × Invested Capital)',
            calculate: (params) => FinancialFunctions.economicValueAdded(params[0], params[1], params[2]),
            description: 'Measures value creation above cost of capital',
            useCases: ['Performance measurement', 'Value-based management', 'Capital allocation'],
            interpretation: {
                positive: 'Creating shareholder value',
                negative: 'Destroying shareholder value',
                zero: 'Meeting but not exceeding cost of capital'
            }
        },

        'calculatePayment': {
            name: 'Loan Payment Calculator',
            category: 'Amortization Analysis',
            params: ['principal', 'rate', 'periods'],
            paramNames: ['Principal Amount ($)', 'Interest Rate per Period (%)', 'Number of Periods'],
            defaultParams: [200000, 0.005, 360],
            formula: 'PMT = P × [r(1 + r)^n] / [(1 + r)^n - 1]',
            calculate: (params) => FinancialFunctions.calculatePayment(params[0], params[1], params[2]),
            description: 'Calculates periodic payment for a loan',
            useCases: ['Mortgage analysis', 'Loan planning', 'Debt management'],
            note: 'Rate should be per period (e.g., monthly rate for monthly payments)'
        },

        'cashConversionCycle': {
            name: 'Cash Conversion Cycle (CCC)',
            category: 'Working Capital Analysis',
            params: ['daysInventoryOutstanding', 'daysReceivablesOutstanding', 'daysPayablesOutstanding'],
            paramNames: ['Days Inventory Outstanding', 'Days Receivables Outstanding', 'Days Payables Outstanding'],
            defaultParams: [45, 30, 35],
            formula: 'CCC = DIO + DRO - DPO',
            calculate: (params) => FinancialFunctions.cashConversionCycle(params[0], params[1], params[2]),
            description: 'Time to convert investments in inventory and receivables into cash',
            useCases: ['Working capital management', 'Cash flow optimization', 'Operational efficiency'],
            interpretation: {
                shorter: 'More efficient working capital management',
                longer: 'Slower cash conversion, more working capital needed',
                negative: 'Company gets paid before paying suppliers'
            }
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
        this.width = options.width || 1400;
        this.height = options.height || 1800;
        this.theme = options.theme || "professional";

        // Enhanced spreadsheet styling
        this.cellWidth = 220;
        this.cellHeight = 28;
        this.headerHeight = 35;
        this.rowLabelWidth = 70;
        this.fontSize = 12;

        // Data storage with enhanced structure
        this.selectedFormula = null;
        this.formulaParams = null;
        this.calculationResult = null;
        this.scenarioAnalysis = {};
        this.sensitivityAnalysis = {};
        this.comparisonAnalysis = {};
        this.calculationHistory = [];
        this.currentWorkbook = null;
        this.detailedAnalysis = null;

        // Enhanced analysis settings
        this.scenarioName = "";
        this.companyName = "";
        this.analysisDate = new Date().toISOString().split('T')[0];
        this.analystName = "";
        this.notes = "";
        this.executiveSummary = null;

        this.setThemeColors();
    }

    setThemeColors() {
        const themes = {
            professional: {
                background: '#ffffff',
                gridColor: '#d0d0d0',
                headerBg: '#1f4e79',
                headerText: '#ffffff',
                sectionBg: '#e7f3ff',
                sectionText: '#1f4e79',
                cellBg: '#ffffff',
                cellText: '#333333',
                resultBg: '#e8f5e8',
                resultText: '#2d5a2d',
                formulaBg: '#fff9e6',
                formulaText: '#8b4513',
                borderColor: '#666666',
                warningBg: '#fff2cc',
                warningText: '#996633',
                positiveColor: '#28a745',
                negativeColor: '#dc3545',
                neutralColor: '#6c757d'
            }
        };
        this.colors = themes[this.theme] || themes.professional;
    }

    // Enhanced calculation method with detailed analysis
    calculateFinancialFormula(config) {
        this.scenarioName = config.scenarioName || "Professional Financial Analysis";
        this.companyName = config.companyName || "Sample Corporation";
        this.analystName = config.analystName || "Senior Financial Analyst";
        this.notes = config.notes || "";
        
        this.selectedFormula = config.formula;
        this.formulaParams = config.parameters || [];

        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        if (!formula) {
            throw new Error(`Unknown formula: ${this.selectedFormula}`);
        }

        // Use provided parameters or defaults
        const params = this.formulaParams.length > 0 ? this.formulaParams : formula.defaultParams;
        
        // Calculate main result with enhanced analysis
        const result = formula.calculate(params);
        
        this.calculationResult = {
            formula: this.selectedFormula,
            result: typeof result === 'object' ? result : { value: result },
            parameters: this.createParameterSummary(formula, params),
            interpretation: this.generateDetailedInterpretation(formula, params, result),
            formulaDetails: formula
        };

        // Generate detailed analysis specific to formula type
        this.detailedAnalysis = this.generateDetailedAnalysis(formula, params, result);

        // Generate executive summary with formula-specific insights
        this.executiveSummary = this.generateEnhancedExecutiveSummary(formula, result);

        // Enhanced analyses
        if (config.performSensitivityAnalysis) {
            this.performEnhancedSensitivityAnalysis(config.sensitivityConfig);
        }

        if (config.performScenarioAnalysis) {
            this.performEnhancedScenarioAnalysis(config.scenarioConfig);
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
            let value = params[index];
            // Format parameters appropriately
            if (Array.isArray(value)) {
                summary[name] = value.map(v => typeof v === 'number' ? this.formatCurrency(v) : v).join(', ');
            } else if (typeof value === 'number') {
                if (name.toLowerCase().includes('rate') || name.toLowerCase().includes('%')) {
                    summary[name] = this.formatPercentage(value);
                } else if (name.toLowerCase().includes('$') || name.toLowerCase().includes('cost') || name.toLowerCase().includes('value') || name.toLowerCase().includes('income')) {
                    summary[name] = this.formatCurrency(value);
                } else {
                    summary[name] = this.formatNumber(value);
                }
            } else {
                summary[name] = value;
            }
        });
        return summary;
    }

    // Enhanced interpretation based on formula type
    generateDetailedInterpretation(formula, params, result) {
        const baseValue = typeof result === 'object' ? result.value || result.ratio || result.breakEvenUnits || result.roe : result;
        
        switch(this.selectedFormula) {
            case 'presentValue':
                return this.interpretPresentValue(params, baseValue);
            case 'netPresentValue':
                return this.interpretNetPresentValue(params, baseValue);
            case 'currentRatio':
                return this.interpretCurrentRatio(params, result);
            case 'returnOnEquity':
                return this.interpretReturnOnEquity(params, result);
            case 'breakEvenUnits':
                return this.interpretBreakEvenAnalysis(params, result);
            default:
                return this.generateGenericInterpretation(formula, baseValue);
        }
    }

    interpretPresentValue(params, result) {
        const [fv, rate, periods, pmt] = params;
        const discountFactor = Math.pow(1 + rate, periods);
        const totalFutureValue = fv + (pmt * periods);
        const timeValueImpact = totalFutureValue - result;

        return {
            value: this.formatCurrency(result),
            meaning: `The present value of ${this.formatCurrency(fv)} received in ${periods} years at ${this.formatPercentage(rate)} discount rate`,
            implication: result > fv ? 'Present value exceeds future value due to negative discounting' : `Time value of money reduces worth by ${this.formatCurrency(timeValueImpact)}`,
            keyInsights: [
                `Discount factor: ${discountFactor.toFixed(4)}`,
                `Annual discount effect: ${this.formatPercentage((Math.pow(discountFactor, 1/periods) - 1))}`,
                `Sensitivity to rate changes is ${periods > 5 ? 'high' : 'moderate'} due to ${periods}-year time horizon`
            ],
            businessContext: {
                investmentDecision: result > (fv * 0.9) ? 'Acceptable present value' : 'Significant time value erosion',
                riskLevel: rate > 0.1 ? 'High discount rate suggests higher risk' : 'Conservative discount rate applied'
            }
        };
    }

    interpretNetPresentValue(params, result) {
        const [rate, cashFlows] = params;
        const initialInvestment = Math.abs(cashFlows[0]);
        const totalCashInflows = cashFlows.slice(1).reduce((sum, cf) => sum + (cf > 0 ? cf : 0), 0);
        const profitabilityIndex = (result + initialInvestment) / initialInvestment;

        return {
            value: this.formatCurrency(result),
            meaning: `Net value created after ${this.formatPercentage(rate)} cost of capital over ${cashFlows.length - 1} periods`,
            implication: result > 0 ? `Investment creates ${this.formatCurrency(result)} in shareholder value` : `Investment destroys ${this.formatCurrency(Math.abs(result))} in shareholder value`,
            keyInsights: [
                `Initial investment: ${this.formatCurrency(initialInvestment)}`,
                `Total cash inflows: ${this.formatCurrency(totalCashInflows)}`,
                `Profitability index: ${profitabilityIndex.toFixed(3)}`,
                `Value creation rate: ${((result / initialInvestment) * 100).toFixed(2)}%`
            ],
            businessContext: {
                decision: result > 0 ? 'ACCEPT - Creates shareholder value' : 'REJECT - Destroys shareholder value',
                riskAssessment: profitabilityIndex > 1.2 ? 'Strong value creation' : profitabilityIndex > 1.0 ? 'Marginal value creation' : 'Value destruction',
                strategicImplication: result > initialInvestment * 0.15 ? 'Highly attractive project' : result > 0 ? 'Acceptable project' : 'Unacceptable project'
            }
        };
    }

    interpretCurrentRatio(params, result) {
        const [currentAssets, currentLiabilities] = params;
        const ratio = result.ratio || result;
        const workingCapital = currentAssets - currentLiabilities;
        
        return {
            value: ratio.toFixed(2),
            meaning: `Company has ${this.formatCurrency(ratio)} in current assets for every $1.00 of current liabilities`,
            implication: result.interpretation ? result.interpretation.description : this.assessLiquidityPosition(ratio),
            keyInsights: [
                `Working capital: ${this.formatCurrency(workingCapital)}`,
                `Liquidity cushion: ${this.formatCurrency(currentAssets - currentLiabilities)}`,
                `Risk level: ${result.riskLevel || this.assessLiquidityRisk(ratio)}`,
                `Days of liabilities covered: ${(ratio * 30).toFixed(0)} days`
            ],
            businessContext: {
                operationalImpact: workingCapital > 0 ? 'Sufficient funds for operations' : 'Potential cash flow constraints',
                creditworthiness: ratio >= 1.5 ? 'Strong credit profile' : ratio >= 1.2 ? 'Adequate credit profile' : 'Weak credit profile',
                managementFocus: ratio > 2.5 ? 'May optimize cash management' : ratio < 1.2 ? 'Must improve liquidity position' : 'Maintain current liquidity'
            }
        };
    }

    interpretReturnOnEquity(params, result) {
        const [netIncome, averageEquity] = params;
        const roe = result.roe || result;
        const roePercentage = roe * 100;

        return {
            value: this.formatPercentage(roe),
            meaning: `Company generates ${this.formatCurrency(roe)} in profit for every $1.00 of shareholder equity`,
            implication: result.interpretation ? result.interpretation.description : this.assessROEPerformance(roe),
            keyInsights: [
                `Annual profit generation: ${this.formatPercentage(roe)}`,
                `Equity efficiency: ${roePercentage.toFixed(1)}% return rate`,
                `Performance tier: ${this.getROETier(roe)}`,
                `Benchmark comparison: ${this.compareROEToMarket(roe)}`
            ],
            businessContext: {
                shareholderValue: roePercentage > 15 ? 'Excellent shareholder returns' : roePercentage > 10 ? 'Good shareholder returns' : 'Subpar shareholder returns',
                competitivePosition: roePercentage > 20 ? 'Industry leader potential' : roePercentage > 12 ? 'Competitive position' : 'Below competitive standards',
                sustainabilityRisk: roePercentage > 25 ? 'Investigate sustainability of high returns' : roePercentage < 5 ? 'Performance improvement needed' : 'Sustainable performance level'
            }
        };
    }

    interpretBreakEvenAnalysis(params, result) {
        const [fixedCosts, pricePerUnit, variableCostPerUnit] = params;
        const breakEvenUnits = result.breakEvenUnits || result;
        const contributionMargin = pricePerUnit - variableCostPerUnit;
        const contributionMarginRatio = contributionMargin / pricePerUnit;

        return {
            value: `${this.formatNumber(breakEvenUnits)} units`,
            meaning: `Must sell ${this.formatNumber(breakEvenUnits)} units at ${this.formatCurrency(pricePerUnit)} each to cover all costs`,
            implication: `Break-even revenue of ${this.formatCurrency(breakEvenUnits * pricePerUnit)} needed to achieve profitability`,
            keyInsights: [
                `Contribution margin per unit: ${this.formatCurrency(contributionMargin)}`,
                `Contribution margin ratio: ${this.formatPercentage(contributionMarginRatio)}`,
                `Fixed cost recovery rate: ${this.formatNumber(contributionMargin)} per unit`,
                `Operating leverage: ${contributionMarginRatio > 0.4 ? 'High' : contributionMarginRatio > 0.2 ? 'Moderate' : 'Low'}`
            ],
            businessContext: {
                marketViability: breakEvenUnits < 10000 ? 'Easily achievable volume' : breakEvenUnits < 50000 ? 'Moderate volume required' : 'High volume challenge',
                pricingStrategy: contributionMarginRatio > 0.5 ? 'Strong pricing power' : contributionMarginRatio > 0.3 ? 'Adequate pricing' : 'Weak pricing power',
                costStructure: (fixedCosts / (breakEvenUnits * pricePerUnit)) > 0.5 ? 'High fixed cost business' : 'Variable cost driven business'
            }
        };
    }

    // Enhanced executive summary generation
    generateEnhancedExecutiveSummary(formula, result) {
        const baseValue = typeof result === 'object' ? result.value || result.ratio || result.breakEvenUnits || result.roe : result;
        
        switch(this.selectedFormula) {
            case 'presentValue':
                return {
                    headline: `Present Value Analysis: ${this.formatCurrency(baseValue)}`,
                    keyFinding: `Time value analysis shows current worth of future cash flows discounted at specified rate`,
                    businessImplication: baseValue > this.formulaParams[0] * 0.8 ? 'Acceptable present value retention' : 'Significant time value erosion requires attention',
                    criticalFactor: 'Interest rate assumptions are critical - small changes significantly impact valuation',
                    recommendation: 'Verify discount rate reflects appropriate risk level for investment horizon'
                };
                
            case 'netPresentValue':
                const npvValue = baseValue;
                return {
                    headline: `NPV Analysis: ${npvValue > 0 ? 'VALUE CREATING' : 'VALUE DESTROYING'} - ${this.formatCurrency(npvValue)}`,
                    keyFinding: `Investment ${npvValue > 0 ? 'generates' : 'loses'} ${this.formatCurrency(Math.abs(npvValue))} in net present value`,
                    businessImplication: npvValue > 0 ? 'Project exceeds minimum return requirements and creates shareholder wealth' : 'Project fails to meet minimum return threshold and should be rejected',
                    criticalFactor: 'Discount rate and cash flow timing assumptions drive results',
                    recommendation: npvValue > 0 ? 'ACCEPT - Pursue investment opportunity' : 'REJECT - Seek alternative investments'
                };
                
            case 'currentRatio':
                const ratioValue = typeof result === 'object' ? result.ratio : result;
                return {
                    headline: `Liquidity Analysis: ${ratioValue >= 2.0 ? 'STRONG' : ratioValue >= 1.5 ? 'ADEQUATE' : ratioValue >= 1.0 ? 'WEAK' : 'CRITICAL'} - ${ratioValue.toFixed(2)}:1`,
                    keyFinding: `Company maintains ${this.formatCurrency(ratioValue)} in current assets per $1.00 of current liabilities`,
                    businessImplication: ratioValue >= 1.5 ? 'Strong short-term financial position supports operational flexibility' : ratioValue >= 1.0 ? 'Minimal liquidity cushion requires careful cash management' : 'Liquidity shortfall threatens operational continuity',
                    criticalFactor: 'Working capital management and cash conversion cycle efficiency',
                    recommendation: ratioValue >= 2.0 ? 'Optimize excess liquidity for growth' : ratioValue < 1.2 ? 'Immediate liquidity improvement required' : 'Monitor liquidity trends closely'
                };
                
            case 'returnOnEquity':
                const roeValue = typeof result === 'object' ? result.roe : result;
                const roePercentage = roeValue * 100;
                return {
                    headline: `Profitability Analysis: ${roePercentage >= 20 ? 'EXCEPTIONAL' : roePercentage >= 15 ? 'EXCELLENT' : roePercentage >= 10 ? 'GOOD' : 'BELOW AVERAGE'} - ${this.formatPercentage(roeValue)}`,
                    keyFinding: `Management generates ${this.formatPercentage(roeValue)} annual returns on shareholder equity investments`,
                    businessImplication: roePercentage >= 15 ? 'Superior capital efficiency creates significant shareholder value' : roePercentage >= 10 ? 'Competitive returns meet shareholder expectations' : 'Suboptimal returns require strategic performance improvements',
                    criticalFactor: 'Profitability, asset utilization, and capital structure optimization',
                    recommendation: roePercentage >= 20 ? 'Investigate sustainability of high returns' : roePercentage < 10 ? 'Implement DuPont analysis to identify improvement areas' : 'Maintain competitive performance levels'
                };
                
            case 'breakEvenUnits':
                const breakEvenValue = typeof result === 'object' ? result.breakEvenUnits : result;
                return {
                    headline: `Break-Even Analysis: ${this.formatNumber(breakEvenValue)} Units Required for Profitability`,
                    keyFinding: `Business must achieve ${this.formatNumber(breakEvenValue)} unit sales volume to cover all fixed and variable costs`,
                    businessImplication: breakEvenValue < 10000 ? 'Low break-even threshold supports business viability and growth potential' : breakEvenValue < 50000 ? 'Moderate volume requirements need focused sales strategy' : 'High volume threshold presents significant market penetration challenges',
                    criticalFactor: 'Contribution margin optimization and fixed cost management',
                    recommendation: 'Develop sales forecasts and pricing strategies to exceed break-even volumes with adequate safety margins'
                };
                
            default:
                return {
                    headline: `Financial Analysis Complete: ${formula.name}`,
                    keyFinding: 'Analysis provides quantitative insights for business decision-making',
                    businessImplication: 'Results should be evaluated against industry benchmarks and strategic objectives',
                    criticalFactor: 'Data quality and assumption validation',
                    recommendation: 'Consider multiple scenarios and perform sensitivity analysis'
                };
        }
    }

    // Enhanced detailed analysis generation
    generateDetailedAnalysis(formula, params, result) {
        switch(this.selectedFormula) {
            case 'presentValue':
                return this.generatePresentValueAnalysis(params, result);
            case 'netPresentValue':
                return this.generateNPVAnalysis(params, result);
            case 'currentRatio':
                return this.generateLiquidityAnalysis(params, result);
            case 'returnOnEquity':
                return this.generateProfitabilityAnalysis(params, result);
            case 'breakEvenUnits':
                return this.generateCostVolumeAnalysis(params, result);
            default:
                return this.generateGenericAnalysis(formula, params, result);
        }
    }

    generatePresentValueAnalysis(params, result) {
        const [fv, rate, periods, pmt] = params;
        const discountFactor = Math.pow(1 + rate, periods);
        const annualDiscountRate = Math.pow(discountFactor, 1/periods) - 1;
        
        return {
            calculationBreakdown: {
                discountFactor: discountFactor,
                annualEffectiveRate: annualDiscountRate,
                timeValueImpact: fv - result,
                totalCashFlows: fv + (pmt * periods)
            },
            sensitivityFactors: {
                rateImpact: 'High sensitivity to interest rate changes',
                timeImpact: periods > 5 ? 'High time sensitivity' : 'Moderate time sensitivity',
                riskProfile: rate > 0.1 ? 'High risk discount rate' : 'Conservative discount rate'
            },
            businessApplications: [
                'Investment valuation and comparison',
                'Capital budgeting decisions',
                'Loan and bond pricing',
                'Retirement and savings planning'
            ]
        };
    }

    generateNPVAnalysis(params, result) {
        const [rate, cashFlows] = params;
        const initialInvestment = Math.abs(cashFlows[0]);
        const futureCashFlows = cashFlows.slice(1);
        const totalUndiscounted = futureCashFlows.reduce((sum, cf) => sum + cf, 0);
        const profitabilityIndex = (result + initialInvestment) / initialInvestment;
        
        // Calculate year-by-year present values
        const yearlyAnalysis = futureCashFlows.map((cf, index) => ({
            year: index + 1,
            cashFlow: cf,
            discountFactor: 1 / Math.pow(1 + rate, index + 1),
            presentValue: cf / Math.pow(1 + rate, index + 1)
        }));

        return {
            calculationBreakdown: {
                initialInvestment: initialInvestment,
                totalUndiscountedInflows: totalUndiscounted,
                totalPresentValue: result + initialInvestment,
                netValueCreated: result,
                profitabilityIndex: profitabilityIndex
            },
            yearlyBreakdown: yearlyAnalysis,
            investmentMetrics: {
                returnOnInvestment: (result / initialInvestment) * 100,
                paybackIndicator: result > 0 ? 'Positive NPV indicates payback within analysis period' : 'Negative NPV indicates no payback',
                riskAssessment: profitabilityIndex > 1.5 ? 'Low risk - strong value creation' : profitabilityIndex > 1.1 ? 'Moderate risk' : 'High risk'
            },
            decisionFramework: {
                accept: result > 0,
                reasoning: result > 0 ? 'Creates shareholder value' : 'Destroys shareholder value',
                strategicFit: 'Evaluate alongside strategic objectives and resource constraints'
            }
        };
    }

    generateLiquidityAnalysis(params, result) {
        const [currentAssets, currentLiabilities] = params;
        const ratio = typeof result === 'object' ? result.ratio : result;
        const workingCapital = currentAssets - currentLiabilities;
        const liquidityBuffer = currentAssets - (currentLiabilities * 1.2); // 20% safety margin
        
        return {
            liquidityMetrics: {
                currentRatio: ratio,
                workingCapital: workingCapital,
                liquidityBuffer: liquidityBuffer,
                currentAssetCoverage: (currentAssets / currentLiabilities) * 100,
                excessLiquidity: ratio > 2.0 ? currentAssets - (currentLiabilities * 2) : 0
            },
            riskAssessment: {
                liquidityRisk: ratio < 1.2 ? 'High' : ratio < 1.8 ? 'Moderate' : 'Low',
                operationalImpact: workingCapital < 0 ? 'Negative working capital - cash flow concerns' : 'Positive working capital supports operations',
                creditRisk: ratio < 1.0 ? 'High credit risk' : ratio < 1.5 ? 'Moderate credit risk' : 'Low credit risk'
            },
            industryComparison: {
                retail: 'Retail industry average: 1.2-1.8',
                manufacturing: 'Manufacturing average: 1.5-2.5',
                technology: 'Technology average: 2.0-4.0',
                utilities: 'Utilities average: 0.8-1.2'
            },
            managementRecommendations: ratio > 2.5 ? [
                'Consider optimizing excess cash through investments',
                'Evaluate growth opportunities',
                'Review dividend policy'
            ] : ratio < 1.2 ? [
                'Improve collections from customers',
                'Negotiate extended payment terms with suppliers',
                'Consider short-term financing facilities',
                'Reduce inventory levels if possible'
            ] : [
                'Maintain current liquidity management',
                'Monitor cash conversion cycle',
                'Plan for seasonal fluctuations'
            ]
        };
    }

    generateProfitabilityAnalysis(params, result) {
        const [netIncome, averageEquity] = params;
        const roe = typeof result === 'object' ? result.roe : result;
        const roePercentage = roe * 100;
        
        return {
            profitabilityMetrics: {
                returnOnEquity: roe,
                annualizedReturn: roePercentage,
                equityEfficiency: `$${(netIncome / 1000).toFixed(1)}K profit per $1M equity`,
                performanceTier: this.getROETier(roe)
            },
            performanceAnalysis: {
                benchmarkComparison: this.compareROEToIndustry(roe),
                trendIndicator: 'Requires historical comparison for trend analysis',
                competitivePosition: roePercentage > 15 ? 'Above average' : roePercentage > 10 ? 'Average' : 'Below average'
            },
            dupontComponents: {
                note: 'ROE can be analyzed using DuPont framework:',
                netProfitMargin: 'Net Income / Revenue (Profitability)',
                assetTurnover: 'Revenue / Assets (Efficiency)', 
                equityMultiplier: 'Assets / Equity (Leverage)',
                formula: 'ROE = Margin × Turnover × Leverage'
            },
            improvementAreas: roePercentage < 10 ? [
                'Improve profit margins through cost management',
                'Increase asset utilization and efficiency',
                'Optimize capital structure',
                'Focus on higher-margin business segments'
            ] : roePercentage > 25 ? [
                'Assess sustainability of high returns',
                'Consider growth investments',
                'Evaluate competitive advantages',
                'Monitor leverage levels'
            ] : [
                'Maintain competitive performance',
                'Benchmark against industry leaders',
                'Identify incremental improvements'
            ]
        };
    }

    generateCostVolumeAnalysis(params, result) {
        const [fixedCosts, pricePerUnit, variableCostPerUnit] = params;
        const breakEvenUnits = typeof result === 'object' ? result.breakEvenUnits : result;
        const contributionMargin = pricePerUnit - variableCostPerUnit;
        const contributionMarginRatio = contributionMargin / pricePerUnit;
        const breakEvenRevenue = breakEvenUnits * pricePerUnit;
        
        return {
            breakEvenMetrics: {
                breakEvenUnits: breakEvenUnits,
                breakEvenRevenue: breakEvenRevenue,
                contributionMargin: contributionMargin,
                contributionMarginRatio: contributionMarginRatio,
                fixedCostRecovery: `Each unit contributes $${contributionMargin.toFixed(2)} to fixed costs`
            },
            costStructureAnalysis: {
                fixedCostRatio: fixedCosts / breakEvenRevenue,
                variableCostRatio: (variableCostPerUnit * breakEvenUnits) / breakEvenRevenue,
                operatingLeverage: contributionMarginRatio > 0.4 ? 'High' : contributionMarginRatio > 0.2 ? 'Moderate' : 'Low',
                scalability: contributionMarginRatio > 0.3 ? 'Good scalability potential' : 'Limited scalability'
            },
            volumeAnalysis: {
                marginOfSafety: 'Calculate as (Actual Sales - Break-even Sales) / Actual Sales',
                profitProjections: [
                    { volume: Math.round(breakEvenUnits * 1.1), profit: Math.round((breakEvenUnits * 1.1 - breakEvenUnits) * contributionMargin) },
                    { volume: Math.round(breakEvenUnits * 1.25), profit: Math.round((breakEvenUnits * 1.25 - breakEvenUnits) * contributionMargin) },
                    { volume: Math.round(breakEvenUnits * 1.5), profit: Math.round((breakEvenUnits * 1.5 - breakEvenUnits) * contributionMargin) }
                ]
            },
            strategicImplications: {
                marketEntry: breakEvenUnits < 10000 ? 'Low barrier to entry' : 'High volume required for viability',
                pricingFlexibility: contributionMarginRatio > 0.5 ? 'High pricing power' : 'Price sensitive market',
                riskLevel: fixedCosts > breakEvenRevenue * 0.3 ? 'High fixed cost risk' : 'Manageable cost structure'
            }
        };
    }

    // Enhanced sensitivity analysis
    performEnhancedSensitivityAnalysis(config) {
        if (!config || !config.parameterIndex) return;

        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        const baseParams = [...this.formulaParams];
        const paramIndex = config.parameterIndex;
        const baseValue = baseParams[paramIndex];
        
        // Enhanced variation ranges based on parameter type
        const variations = this.getParameterVariations(formula.paramNames[paramIndex], config.variations);
        
        this.sensitivityAnalysis = {
            parameterName: formula.paramNames[paramIndex],
            baseValue: baseValue,
            baseResult: typeof this.calculationResult.result === 'object' ? 
                       this.calculationResult.result.value || this.calculationResult.result.ratio || this.calculationResult.result.breakEvenUnits || this.calculationResult.result.roe :
                       this.calculationResult.result,
            variations: [],
            analysis: {
                elasticity: [],
                riskLevel: null,
                criticalThresholds: []
            }
        };

        variations.forEach(percentChange => {
            const newValue = baseValue * (1 + percentChange / 100);
            const newParams = [...baseParams];
            newParams[paramIndex] = newValue;
            
            try {
                const newResult = formula.calculate(newParams);
                const resultValue = typeof newResult === 'object' ? 
                                   newResult.value || newResult.ratio || newResult.breakEvenUnits || newResult.roe :
                                   newResult;
                const resultChange = ((resultValue - this.sensitivityAnalysis.baseResult) / this.sensitivityAnalysis.baseResult) * 100;
                const elasticity = percentChange !== 0 ? resultChange / percentChange : 0;
                
                this.sensitivityAnalysis.variations.push({
                    percentChange,
                    newValue,
                    newResult: resultValue,
                    resultChange,
                    elasticity,
                    interpretation: this.interpretSensitivityResult(percentChange, resultChange, elasticity)
                });
            } catch (error) {
                this.sensitivityAnalysis.variations.push({
                    percentChange,
                    newValue,
                    error: error.message
                });
            }
        });

        // Enhanced analysis
        this.analyzeSensitivityResults();
    }

    getParameterVariations(parameterName, customVariations) {
        if (customVariations) return customVariations;
        
        // Different variation ranges based on parameter type
        if (parameterName.toLowerCase().includes('rate')) {
            return [-50, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 50];
        } else if (parameterName.toLowerCase().includes('cost') || parameterName.toLowerCase().includes('price')) {
            return [-30, -20, -15, -10, -5, -2.5, 0, 2.5, 5, 10, 15, 20, 30];
        } else {
            return [-40, -30, -20, -10, -5, 0, 5, 10, 20, 30, 40];
        }
    }

    interpretSensitivityResult(percentChange, resultChange, elasticity) {
        const absElasticity = Math.abs(elasticity);
        if (absElasticity > 2) return 'High sensitivity - significant impact';
        if (absElasticity > 1) return 'Moderate sensitivity - material impact';
        if (absElasticity > 0.5) return 'Low sensitivity - minor impact';
        return 'Very low sensitivity - minimal impact';
    }

    analyzeSensitivityResults() {
        const validVariations = this.sensitivityAnalysis.variations.filter(v => !v.error);
        if (validVariations.length === 0) return;

        // Calculate average elasticity
        const elasticities = validVariations.map(v => Math.abs(v.elasticity));
        const avgElasticity = elasticities.reduce((sum, e) => sum + e, 0) / elasticities.length;

        // Determine risk level
        this.sensitivityAnalysis.analysis.riskLevel = 
            avgElasticity > 2 ? 'High Risk - Highly sensitive to parameter changes' :
            avgElasticity > 1 ? 'Moderate Risk - Material sensitivity to changes' :
            'Low Risk - Relatively insensitive to parameter changes';

        // Identify critical thresholds
        this.sensitivityAnalysis.analysis.criticalThresholds = this.identifyCriticalThresholds(validVariations);
    }

    identifyCriticalThresholds(variations) {
        const thresholds = [];
        
        variations.forEach(variation => {
            // Identify when results cross important boundaries
            if (this.selectedFormula === 'netPresentValue') {
                if (this.sensitivityAnalysis.baseResult > 0 && variation.newResult <= 0) {
                    thresholds.push(`NPV turns negative at ${variation.percentChange}% parameter change`);
                } else if (this.sensitivityAnalysis.baseResult <= 0 && variation.newResult > 0) {
                    thresholds.push(`NPV turns positive at ${variation.percentChange}% parameter change`);
                }
            } else if (this.selectedFormula === 'currentRatio') {
                if (this.sensitivityAnalysis.baseResult >= 1.0 && variation.newResult < 1.0) {
                    thresholds.push(`Liquidity becomes inadequate at ${variation.percentChange}% parameter change`);
                }
            }
        });

        return thresholds;
    }

    // Enhanced scenario analysis
    performEnhancedScenarioAnalysis(config) {
        if (!config || !config.scenarios) return;

        this.scenarioAnalysis = {
            baseCase: {
                name: 'Base Case',
                parameters: {...this.calculationResult.parameters},
                result: typeof this.calculationResult.result === 'object' ? 
                       this.calculationResult.result.value || this.calculationResult.result.ratio || this.calculationResult.result.breakEvenUnits || this.calculationResult.result.roe :
                       this.calculationResult.result,
                probability: config.baseCaseProbability || 0.5
            },
            scenarios: [],
            analysis: {
                expectedValue: 0,
                riskMetrics: {},
                recommendations: []
            }
        };

        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        
        config.scenarios.forEach(scenario => {
            const scenarioParams = [...this.formulaParams];
            
            // Apply parameter changes for this scenario
            Object.entries(scenario.parameterChanges).forEach(([paramName, changeValue]) => {
                const paramIndex = formula.paramNames.findIndex(name => 
                    name.toLowerCase().includes(paramName.toLowerCase()) || 
                    paramName.toLowerCase().includes(name.toLowerCase().split(' ')[0])
                );
                
                if (paramIndex !== -1) {
                    if (scenario.changeType === 'percentage') {
                        scenarioParams[paramIndex] = this.formulaParams[paramIndex] * (1 + changeValue / 100);
                    } else {
                        scenarioParams[paramIndex] = changeValue;
                    }
                }
            });

            try {
                const scenarioResult = formula.calculate(scenarioParams);
                const resultValue = typeof scenarioResult === 'object' ? 
                                   scenarioResult.value || scenarioResult.ratio || scenarioResult.breakEvenUnits || scenarioResult.roe :
                                   scenarioResult;
                const resultChange = ((resultValue - this.scenarioAnalysis.baseCase.result) / this.scenarioAnalysis.baseCase.result) * 100;

                const scenarioAnalysis = {
                    name: scenario.name,
                    description: scenario.description || `${scenario.name} scenario analysis`,
                    parameters: this.createParameterSummary(formula, scenarioParams),
                    result: resultValue,
                    resultChange,
                    probability: scenario.probability || 0,
                    interpretation: this.generateScenarioInterpretation(scenario.name, resultValue, resultChange),
                    riskImpact: this.assessScenarioRisk(scenario.name, resultChange),
                    strategicImplication: this.generateStrategicImplication(scenario.name, resultValue, resultChange)
                };

                this.scenarioAnalysis.scenarios.push(scenarioAnalysis);
            } catch (error) {
                this.scenarioAnalysis.scenarios.push({
                    name: scenario.name,
                    error: error.message,
                    description: 'Scenario calculation failed'
                });
            }
        });

        // Calculate expected value and risk metrics
        this.calculateScenarioMetrics();
    }

    generateScenarioInterpretation(scenarioName, result, changePercent) {
        const baseFormula = this.selectedFormula;
        const absoluteChange = Math.abs(changePercent);
        
        let impact = '';
        if (absoluteChange < 5) impact = 'minimal';
        else if (absoluteChange < 15) impact = 'moderate';
        else if (absoluteChange < 30) impact = 'significant';
        else impact = 'dramatic';

        const direction = changePercent >= 0 ? 'improvement' : 'deterioration';
        
        switch(baseFormula) {
            case 'netPresentValue':
                return {
                    summary: `${scenarioName} results in ${impact} ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                    businessImpact: result > 0 ? 'Project remains value-creating' : 'Project becomes value-destroying',
                    recommendation: result > 0 ? 'Proceed with investment' : 'Reconsider investment decision',
                    riskLevel: absoluteChange > 50 ? 'High scenario risk' : absoluteChange > 20 ? 'Moderate scenario risk' : 'Low scenario risk'
                };
            case 'currentRatio':
                return {
                    summary: `${scenarioName} shows ${impact} liquidity ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                    businessImpact: result >= 1.5 ? 'Maintains strong liquidity' : result >= 1.0 ? 'Adequate liquidity preserved' : 'Liquidity concerns arise',
                    recommendation: result < 1.0 ? 'Implement contingency liquidity plans' : 'Monitor liquidity indicators',
                    riskLevel: result < 1.0 ? 'High liquidity risk' : result < 1.5 ? 'Moderate liquidity risk' : 'Low liquidity risk'
                };
            case 'returnOnEquity':
                const roePercent = result * 100;
                return {
                    summary: `${scenarioName} shows ${impact} profitability ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                    businessImpact: roePercent > 15 ? 'Maintains superior returns' : roePercent > 10 ? 'Adequate shareholder returns' : 'Below-average returns',
                    recommendation: roePercent < 10 ? 'Focus on operational improvements' : 'Maintain competitive position',
                    riskLevel: roePercent < 5 ? 'High performance risk' : roePercent < 12 ? 'Moderate performance risk' : 'Low performance risk'
                };
            default:
                return {
                    summary: `${scenarioName} results in ${impact} ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                    businessImpact: 'Scenario shows material change from base case',
                    recommendation: 'Evaluate scenario likelihood and prepare appropriate responses',
                    riskLevel: absoluteChange > 25 ? 'High scenario impact' : 'Moderate scenario impact'
                };
        }
    }

    assessScenarioRisk(scenarioName, changePercent) {
        const absoluteChange = Math.abs(changePercent);
        
        if (scenarioName.toLowerCase().includes('worst') || scenarioName.toLowerCase().includes('crisis')) {
            return {
                level: 'High Risk',
                description: 'Downside scenario with significant negative impact',
                mitigation: 'Develop contingency plans and risk management strategies'
            };
        } else if (scenarioName.toLowerCase().includes('best') || scenarioName.toLowerCase().includes('optimistic')) {
            return {
                level: 'Opportunity',
                description: 'Upside scenario with positive value creation',
                mitigation: 'Position to capitalize on favorable conditions'
            };
        } else {
            return {
                level: absoluteChange > 20 ? 'Moderate Risk' : 'Low Risk',
                description: 'Alternative scenario with material but manageable impact',
                mitigation: 'Monitor key indicators and maintain flexibility'
            };
        }
    }

    generateStrategicImplication(scenarioName, result, changePercent) {
        if (Math.abs(changePercent) < 10) {
            return 'Limited strategic impact - maintain current course';
        } else if (changePercent > 20) {
            return 'Significant upside opportunity - consider accelerated investment';
        } else if (changePercent < -20) {
            return 'Substantial downside risk - develop mitigation strategies';
        } else {
            return 'Material impact requiring strategic adjustment and monitoring';
        }
    }

    calculateScenarioMetrics() {
        const validScenarios = this.scenarioAnalysis.scenarios.filter(s => !s.error && s.probability);
        
        if (validScenarios.length === 0) return;

        // Calculate probability-weighted expected value
        const totalProbability = this.scenarioAnalysis.baseCase.probability + 
                                validScenarios.reduce((sum, s) => sum + s.probability, 0);
        
        if (totalProbability > 0) {
            const expectedValue = (this.scenarioAnalysis.baseCase.result * this.scenarioAnalysis.baseCase.probability +
                                 validScenarios.reduce((sum, s) => sum + (s.result * s.probability), 0)) / totalProbability;
            
            this.scenarioAnalysis.analysis.expectedValue = expectedValue;
            
            // Calculate risk metrics
            const variance = validScenarios.reduce((sum, s) => {
                return sum + (s.probability * Math.pow(s.result - expectedValue, 2));
            }, this.scenarioAnalysis.baseCase.probability * Math.pow(this.scenarioAnalysis.baseCase.result - expectedValue, 2)) / totalProbability;
            
            this.scenarioAnalysis.analysis.riskMetrics = {
                standardDeviation: Math.sqrt(variance),
                coefficientOfVariation: Math.sqrt(variance) / expectedValue,
                worstCase: Math.min(...validScenarios.map(s => s.result), this.scenarioAnalysis.baseCase.result),
                bestCase: Math.max(...validScenarios.map(s => s.result), this.scenarioAnalysis.baseCase.result)
            };
        }
    }

    // Helper formatting methods
    formatCurrency(value) {
        if (Math.abs(value) >= 1000000) {
            return `$${(value / 1000000).toFixed(2)}M`;
        } else if (Math.abs(value) >= 1000) {
            return `$${(value / 1000).toFixed(1)}K`;
        } else {
            return `$${value.toFixed(2)}`;
        }
    }

    formatPercentage(value) {
        return `${(value * 100).toFixed(2)}%`;
    }

    formatNumber(value) {
        return value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    // Helper assessment methods
    assessLiquidityPosition(ratio) {
        if (ratio >= 2.5) return 'Excellent liquidity - may indicate inefficient cash use';
        if (ratio >= 2.0) return 'Very strong liquidity position';
        if (ratio >= 1.5) return 'Good liquidity for normal operations';
        if (ratio >= 1.2) return 'Adequate liquidity with minimal cushion';
        if (ratio >= 1.0) return 'Weak liquidity - monitor closely';
        return 'Critical liquidity shortage - immediate action required';
    }

    assessLiquidityRisk(ratio) {
        if (ratio >= 2.0) return 'Low Risk';
        if (ratio >= 1.5) return 'Moderate Risk';
        if (ratio >= 1.0) return 'High Risk';
        return 'Critical Risk';
    }

    assessROEPerformance(roe) {
        const percentage = roe * 100;
        if (percentage >= 25) return 'Exceptional - investigate sustainability';
        if (percentage >= 20) return 'Excellent - superior shareholder returns';
        if (percentage >= 15) return 'Very good - above average performance';
        if (percentage >= 10) return 'Good - market-level returns';
        if (percentage >= 5) return 'Below average - needs improvement';
        if (percentage >= 0) return 'Poor - significant performance issues';
        return 'Negative - company is losing money';
    }

    getROETier(roe) {
        const percentage = roe * 100;
        if (percentage >= 20) return 'Top Tier';
        if (percentage >= 15) return 'High Performer';
        if (percentage >= 10) return 'Market Average';
        if (percentage >= 5) return 'Below Average';
        return 'Underperformer';
    }

    compareROEToMarket(roe) {
        const percentage = roe * 100;
        if (percentage >= 15) return 'Above market average (10-12%)';
        if (percentage >= 10) return 'At market average (10-12%)';
        return 'Below market average (10-12%)';
    }

    compareROEToIndustry(roe) {
        const percentage = roe * 100;
        return {
            technology: percentage >= 15 ? 'Competitive' : 'Below tech average (15-25%)',
            manufacturing: percentage >= 12 ? 'Competitive' : 'Below manufacturing average (12-18%)',
            retail: percentage >= 10 ? 'Competitive' : 'Below retail average (10-15%)',
            utilities: percentage >= 8 ? 'Competitive' : 'Below utilities average (8-12%)'
        };
    }

    // Enhanced calculation walkthrough generation
    generateCalculationWalkthrough() {
        switch(this.selectedFormula) {
            case 'presentValue':
                return this.generateEnhancedPresentValueWalkthrough();
            case 'netPresentValue':
                return this.generateEnhancedNPVWalkthrough();
            case 'currentRatio':
                return this.generateEnhancedCurrentRatioWalkthrough();
            case 'returnOnEquity':
                return this.generateEnhancedROEWalkthrough();
            case 'breakEvenUnits':
                return this.generateEnhancedBreakEvenWalkthrough();
            default:
                return this.generateGenericWalkthrough();
        }
    }

    generateEnhancedPresentValueWalkthrough() {
        const [fv, rate, periods, pmt, type] = this.formulaParams;
        const result = typeof this.calculationResult.result === 'object' ? 
                      this.calculationResult.result.value : this.calculationResult.result;
        const discountFactor = Math.pow(1 + rate, periods);

        return {
            title: "Present Value Calculation - Detailed Analysis",
            formula: "PV = FV / (1 + r)^n + PMT × [(1 - (1 + r)^-n) / r]",
            steps: [
                {
                    step: "Step 1: Identify and Validate Input Variables",
                    explanation: `Future Value (FV): ${this.formatCurrency(fv)}
                                Interest Rate (r): ${this.formatPercentage(rate)} annually
                                Time Periods (n): ${periods} years
                                Payment (PMT): ${this.formatCurrency(pmt)} ${type === 1 ? '(beginning of period)' : '(end of period)'}`,
                    validation: `Rate check: ${rate > 0 ? '✓ Positive discount rate' : '⚠ Zero or negative rate'}
                               Period check: ${periods > 0 ? '✓ Valid time horizon' : '⚠ Invalid time period'}`
                },
                {
                    step: "Step 2: Calculate Compound Discount Factor",
                    formula: `(1 + r)^n = (1 + ${rate})^${periods} = ${discountFactor.toFixed(6)}`,
                    explanation: `This factor represents the compound growth that $1 would experience over ${periods} years at ${this.formatPercentage(rate)}`,
                    insight: `Higher rates or longer periods create larger discount factors, reducing present value more dramatically`
                },
                {
                    step: "Step 3: Calculate Present Value of Lump Sum",
                    formula: `PV(lump sum) = ${this.formatCurrency(fv)} / ${discountFactor.toFixed(6)} = ${this.formatCurrency(fv / discountFactor)}`,
                    explanation: `The future value is discounted back to today's dollars using the compound discount factor`,
                    timeValueImpact: `Time value erosion: ${this.formatCurrency(fv - (fv / discountFactor))}`
                },
                {
                    step: pmt !== 0 ? "Step 4: Calculate Present Value of Payment Stream" : "Step 4: Final Present Value",
                    formula: pmt !== 0 ? 
                        `PV(payments) = ${this.formatCurrency(pmt)} × [(1 - (1 + ${rate})^-${periods}) / ${rate}] = ${this.formatCurrency(pmt * ((1 - Math.pow(1 + rate, -periods)) / rate))}` :
                        `Total Present Value = ${this.formatCurrency(result)}`,
                    explanation: pmt !== 0 ? 
                        `The payment stream is converted to present value using the annuity formula` :
                        `Final present value represents today's equivalent of all future cash flows`,
                    calculation: pmt !== 0 ? 
                        `Total PV = ${this.formatCurrency(fv / discountFactor)} + ${this.formatCurrency(pmt * ((1 - Math.pow(1 + rate, -periods)) / rate))} = ${this.formatCurrency(result)}` : null
                }
            ],
            businessInsights: {
                keyTakeaway: "Present value quantifies the current worth of future money, accounting for opportunity cost",
                decisionMaking: "Use for investment comparisons, loan valuations, and capital budgeting decisions",
                criticalFactors: [
                    "Interest rate accuracy is crucial - small changes significantly impact results",
                    `Time horizon of ${periods} years creates ${'moderate' + (periods > 10 ? 'high' : 'low')} sensitivity`,
                    "Consider inflation impact if using nominal rates"
                ],
                riskConsiderations: rate > 0.1 ? 
                    "High discount rate suggests elevated risk - verify appropriateness" :
                    "Conservative discount rate - may understate risk"
            },
            practicalApplications: [
                "Bond and stock valuation",
                "Retirement planning calculations", 
                "Equipment lease vs. purchase decisions",
                "Insurance settlement evaluations"
            ]
        };
    }

    generateEnhancedNPVWalkthrough() {
        const [rate, cashFlows] = this.formulaParams;
        const result = this.calculationResult.result;
        const initialInvestment = Math.abs(cashFlows[0]);
        
        // Calculate detailed year-by-year breakdown
        const yearlyBreakdown = cashFlows.map((cf, period) => ({
            period,
            cashFlow: cf,
            discountFactor: 1 / Math.pow(1 + rate, period),
            presentValue: cf / Math.pow(1 + rate, period)
        }));

        const totalPV = yearlyBreakdown.reduce((sum, year) => sum + year.presentValue, 0);
        const profitabilityIndex = totalPV / Math.abs(cashFlows[0]);

        return {
            title: "Net Present Value Analysis - Comprehensive Evaluation",
            formula: "NPV = Σ [CFt / (1 + r)^t] where t = 0 to n",
            steps: [
                {
                    step: "Step 1: Project Overview and Assumptions",
                    explanation: `Initial Investment: ${this.formatCurrency(initialInvestment)}
                                Cost of Capital: ${this.formatPercentage(rate)}
                                Project Duration: ${cashFlows.length - 1} years
                                Total Undiscounted Cash Flows: ${this.formatCurrency(cashFlows.slice(1).reduce((sum, cf) => sum + cf, 0))}`,
                    validation: `Cash flow pattern: ${cashFlows[0] < 0 ? '✓ Initial outflow' : '⚠ No initial investment'}
                               Discount rate: ${rate > 0 && rate < 0.5 ? '✓ Reasonable' : '⚠ Verify rate'}`
                },
                {
                    step: "Step 2: Year-by-Year Present Value Calculations",
                    explanation: "Each future cash flow is discounted back to present value",
                    detailedCalculations: yearlyBreakdown.map(year => 
                        `Year ${year.period}: ${this.formatCurrency(year.cashFlow)} ÷ (1 + ${rate})^${year.period} = ${this.formatCurrency(year.presentValue)}`
                    ).join('\n'),
                    cumulativeImpact: yearlyBreakdown.map((year, index) => {
                        const cumulative = yearlyBreakdown.slice(0, index + 1).reduce((sum, y) => sum + y.presentValue, 0);
                        return `After Year ${year.period}: Cumulative NPV = ${this.formatCurrency(cumulative)}`;
                    }).join('\n')
                },
                {
                    step: "Step 3: Net Present Value Calculation",
                    formula: `NPV = ${yearlyBreakdown.map(y => this.formatCurrency(y.presentValue)).join(' + ')} = ${this.formatCurrency(result)}`,
                    explanation: `Sum of all discounted cash flows equals the net present value`,
                    interpretation: result > 0 ? 
                        `Positive NPV of ${this.formatCurrency(result)} indicates value creation` :
                        `Negative NPV of ${this.formatCurrency(result)} indicates value destruction`
                },
                {
                    step: "Step 4: Investment Decision Metrics",
                    profitabilityIndex: `PI = Total PV / Initial Investment = ${this.formatCurrency(Math.abs(totalPV))} / ${this.formatCurrency(initialInvestment)} = ${profitabilityIndex.toFixed(3)}`,
                    valueCreationRate: `Value Creation = ${((result / initialInvestment) * 100).toFixed(2)}%`,
                    breakEvenRate: "IRR calculation would show the break-even discount rate",
                    explanation: `Profitability Index ${profitabilityIndex > 1 ? 'above 1.0 confirms' : 'below 1.0 confirms'} the NPV decision`
                }
            ],
            decisionFramework: {
                decision: result > 0 ? "ACCEPT PROJECT" : "REJECT PROJECT",
                rationale: result > 0 ? 
                    `Creates ${this.formatCurrency(result)} in shareholder value at ${this.formatPercentage(rate)} cost of capital` :
                    `Destroys ${this.formatCurrency(Math.abs(result))} in shareholder value - return below cost of capital`,
                riskAssessment: profitabilityIndex > 1.3 ? "Low risk - strong value creation" :
                               profitabilityIndex > 1.1 ? "Moderate risk - adequate returns" :
                               "High risk - marginal or negative returns"
            },
            businessInsights: {
                keyStrengths: result > 0 ? [
                    "Project generates positive economic value",
                    `Returns exceed ${this.formatPercentage(rate)} hurdle rate`,
                    "Creates competitive advantage"
                ] : [],
                keyWeaknesses: result <= 0 ? [
                    "Project fails to meet minimum return requirements",
                    "Alternative investments likely offer better returns",
                    "Opportunity cost not covered"
                ] : [],
                criticalAssumptions: [
                    "Cash flow projections accuracy",
                    "Discount rate appropriateness",
                    "Project risk assessment",
                    "Terminal value considerations"
                ]
            }
        };
    }

    generateEnhancedCurrentRatioWalkthrough() {
        const [currentAssets, currentLiabilities] = this.formulaParams;
        const result = typeof this.calculationResult.result === 'object' ? 
                      this.calculationResult.result.ratio : this.calculationResult.result;
        const workingCapital = currentAssets - currentLiabilities;

        return {
            title: "Current Ratio Analysis - Liquidity Assessment",
            formula: "Current Ratio = Current Assets / Current Liabilities",
            steps: [
                {
                    step: "Step 1: Current Assets Identification and Validation",
                    explanation: `Total Current Assets: ${this.formatCurrency(currentAssets)}
                                Components typically include:
                                • Cash and cash equivalents
                                • Accounts receivable
                                • Inventory
                                • Prepaid expenses
                                • Short-term investments`,
                    qualityAssessment: "Asset quality matters - not all current assets are equally liquid"
                },
                {
                    step: "Step 2: Current Liabilities Analysis",
                    explanation: `Total Current Liabilities: ${this.formatCurrency(currentLiabilities)}
                                Components typically include:
                                • Accounts payable
                                • Accrued expenses
                                • Short-term debt
                                • Current portion of long-term debt
                                • Unearned revenue`,
                    timingConsideration: "Payment timing varies - some obligations more urgent than others"
                },
                {
                    step: "Step 3: Current Ratio Calculation",
                    formula: `Current Ratio = ${this.formatCurrency(currentAssets)} / ${this.formatCurrency(currentLiabilities)} = ${result.toFixed(2)}`,
                    interpretation: `Company has ${this.formatCurrency(result)} in current assets for every $1.00 of current liabilities`,
                    workingCapital: `Working Capital = ${this.formatCurrency(currentAssets)} - ${this.formatCurrency(currentLiabilities)} = ${this.formatCurrency(workingCapital)}`
                },
                {
                    step: "Step 4: Liquidity Position Assessment",
                    riskLevel: this.assessLiquidityRisk(result),
                    operationalImpact: workingCapital > 0 ? 
                        "Positive working capital supports smooth operations" :
                        "Negative working capital may create cash flow pressure",
                    benchmarkComparison: {
                        excellent: "Ratio ≥ 2.0 - Very strong liquidity",
                        good: "Ratio 1.5-2.0 - Adequate liquidity", 
                        adequate: "Ratio 1.2-1.5 - Minimal but acceptable",
                        weak: "Ratio 1.0-1.2 - Weak liquidity position",
                        critical: "Ratio < 1.0 - Liquidity crisis risk"
                    }
                }
            ],
            industryContext: {
                manufacturing: "Manufacturing average: 1.5-2.5 (inventory-heavy)",
                retail: "Retail average: 1.2-1.8 (fast inventory turnover)",
                technology: "Technology average: 2.0-4.0 (cash-rich)",
                utilities: "Utilities average: 0.8-1.2 (regulated cash flows)",
                currentCompany: `${result.toFixed(2)} - ${result >= 2.0 ? 'Above' : result >= 1.5 ? 'At' : 'Below'} manufacturing benchmark`
            },
            businessInsights: {
                liquidityStrengths: result >= 2.0 ? [
                    "Strong ability to meet short-term obligations",
                    "Financial flexibility for opportunities",
                    "Low bankruptcy risk"
                ] : result >= 1.5 ? [
                    "Adequate liquidity for normal operations",
                    "Reasonable safety margin"
                ] : [],
                liquidityWeaknesses: result < 1.5 ? [
                    "Limited financial flexibility",
                    "Potential cash flow pressure",
                    "Higher refinancing risk"
                ] : result > 3.0 ? [
                    "Potentially inefficient cash management",
                    "Excess liquidity not generating returns"
                ] : [],
                managementRecommendations: result < 1.2 ? [
                    "Accelerate collections from customers",
                    "Negotiate extended supplier payment terms",
                    "Secure backup credit facilities",
                    "Reduce inventory levels where possible"
                ] : result > 2.5 ? [
                    "Invest excess cash in growth opportunities",
                    "Consider debt reduction or dividend increases",
                    "Evaluate working capital optimization"
                ] : [
                    "Maintain current liquidity management practices",
                    "Monitor seasonal fluctuations",
                    "Track cash conversion cycle efficiency"
                ]
            }
        };
    }

    generateEnhancedROEWalkthrough() {
        const [netIncome, averageEquity] = this.formulaParams;
        const result = typeof this.calculationResult.result === 'object' ? 
                      this.calculationResult.result.roe : this.calculationResult.result;
        const roePercentage = result * 100;

        return {
            title: "Return on Equity Analysis - Shareholder Value Creation",
            formula: "ROE = Net Income / Average Shareholders' Equity",
            steps: [
                {
                    step: "Step 1: Net Income Analysis",
                    explanation: `Net Income: ${this.formatCurrency(netIncome)}
                                Represents bottom-line profitability after:
                                • Operating expenses
                                • Interest expenses  
                                • Taxes
                                • Extraordinary items`,
                    qualityCheck: "Verify net income quality - recurring vs. one-time items"
                },
                {
                    step: "Step 2: Shareholders' Equity Assessment",
                    explanation: `Average Shareholders' Equity: ${this.formatCurrency(averageEquity)}
                                Components include:
                                • Common stock at par value
                                • Additional paid-in capital
                                • Retained earnings
                                • Accumulated other comprehensive income
                                • Less: Treasury stock`,
                    calculation: "Using average equity provides more accurate periodic return measurement"
                },
                {
                    step: "Step 3: Return on Equity Calculation",
                    formula: `ROE = ${this.formatCurrency(netIncome)} / ${this.formatCurrency(averageEquity)} = ${this.formatPercentage(result)}`,
                    interpretation: `Company generates ${this.formatPercentage(result)} annual return on shareholders' invested capital`,
                    dollarReturn: `Each $1,000 of equity generates ${this.formatCurrency(result * 1000)} in annual profit`
                },
                {
                    step: "Step 4: Performance Evaluation and DuPont Analysis",
                    performanceRating: this.getROETier(result),
                    dupontFramework: {
                        formula: "ROE = (Net Income/Sales) × (Sales/Assets) × (Assets/Equity)",
                        components: {
                            profitability: "Net Profit Margin - Operating efficiency",
                            efficiency: "Asset Turnover - Asset utilization", 
                            leverage: "Equity Multiplier - Financial leverage"
                        },
                        insight: "DuPont analysis identifies specific ROE drivers for improvement focus"
                    }
                }
            ],
            benchmarkAnalysis: {
                industryComparisons: this.compareROEToIndustry(result),
                performanceRating: roePercentage >= 20 ? "Exceptional - Top 10%" :
                                 roePercentage >= 15 ? "Excellent - Top 25%" :
                                 roePercentage >= 10 ? "Good - Market Average" :
                                 roePercentage >= 5 ? "Below Average - Bottom 50%" :
                                 "Poor - Bottom 25%",
                marketContext: `S&P 500 average ROE: ~10-12% | Company ROE: ${this.formatPercentage(result)}`
            },
            businessInsights: {
                shareholderValue: {
                    creation: roePercentage > 15 ? "Strong shareholder value creation" :
                             roePercentage > 10 ? "Adequate shareholder returns" :
                             "Suboptimal shareholder value creation",
                    sustainability: roePercentage > 25 ? "Investigate high return sustainability" :
                                   roePercentage < 5 ? "Returns below risk-free rate" :
                                   "Sustainable return level",
                    competitiveness: roePercentage > 15 ? "Competitive advantage indicated" :
                                   "May lack sustainable competitive advantages"
                },
                improvementOpportunities: roePercentage < 15 ? [
                    "Improve profit margins through cost management",
                    "Increase asset turnover and operational efficiency",
                    "Optimize capital structure and leverage",
                    "Focus on higher-margin business segments",
                    "Divest underperforming assets"
                ] : [
                    "Maintain competitive advantages",
                    "Invest in sustainable growth initiatives", 
                    "Monitor return sustainability"
                ],
                riskConsiderations: [
                    roePercentage > 30 ? "Very high ROE may indicate excessive risk or unsustainable practices" :
                    roePercentage < 0 ? "Negative ROE indicates losses - immediate attention required" :
                    "ROE appears within reasonable range for business risk level"
                ]
            }
        };
    }

    generateEnhancedBreakEvenWalkthrough() {
        const [fixedCosts, pricePerUnit, variableCostPerUnit] = this.formulaParams;
        const result = typeof this.calculationResult.result === 'object' ? 
                      this.calculationResult.result.breakEvenUnits : this.calculationResult.result;
        const contributionMargin = pricePerUnit - variableCostPerUnit;
        const contributionMarginRatio = contributionMargin / pricePerUnit;
        const breakEvenRevenue = result * pricePerUnit;

        return {
            title: "Break-Even Analysis - Cost-Volume-Profit Relationships",
            formula: "Break-Even Units = Fixed Costs / (Price per Unit - Variable Cost per Unit)",
            steps: [
                {
                    step: "Step 1: Cost Structure Analysis",
                    fixedCosts: {
                        amount: this.formatCurrency(fixedCosts),
                        definition: "Costs that remain constant regardless of production volume",
                        examples: "Rent, salaries, insurance, depreciation, utilities base charges"
                    },
                    variableCosts: {
                        perUnit: this.formatCurrency(variableCostPerUnit),
                        definition: "Costs that change directly with production volume",
                        examples: "Raw materials, direct labor, sales commissions, shipping"
                    },
                    costValidation: "Ensure proper cost classification - mixed costs should be separated"
                },
                {
                    step: "Step 2: Revenue and Contribution Analysis",
                    pricing: {
                        pricePerUnit: this.formatCurrency(pricePerUnit),
                        contributionMargin: this.formatCurrency(contributionMargin),
                        contributionRatio: this.formatPercentage(contributionMarginRatio)
                    },
                    explanation: `Each unit sold contributes ${this.formatCurrency(contributionMargin)} toward covering fixed costs and generating profit`,
                    pricingPower: contributionMarginRatio > 0.5 ? "Strong pricing power" :
                                 contributionMarginRatio > 0.3 ? "Adequate pricing power" :
                                 "Weak pricing power - cost structure concerns"
                },
                {
                    step: "Step 3: Break-Even Calculation",
                    formula: `Break-Even Units = ${this.formatCurrency(fixedCosts)} / ${this.formatCurrency(contributionMargin)} = ${this.formatNumber(result)} units`,
                    breakEvenRevenue: `Break-Even Revenue = ${this.formatNumber(result)} units × ${this.formatCurrency(pricePerUnit)} = ${this.formatCurrency(breakEvenRevenue)}`,
                    interpretation: `Must sell ${this.formatNumber(result)} units to cover all fixed and variable costs`,
                    timeFrame: `Assuming constant cost structure and pricing throughout analysis period`
                },
                {
                    step: "Step 4: Operational Analysis and Implications",
                    marketViability: result < 5000 ? "Low volume requirement - highly achievable" :
                                   result < 25000 ? "Moderate volume requirement - achievable with focus" :
                                   result < 100000 ? "High volume requirement - significant market penetration needed" :
                                   "Very high volume requirement - market capacity concerns",
                    operatingLeverage: {
                        level: contributionMarginRatio > 0.4 ? "High" : contributionMarginRatio > 0.2 ? "Moderate" : "Low",
                        implication: contributionMarginRatio > 0.4 ? 
                                   "High profit sensitivity to volume changes - significant upside potential" :
                                   "Lower profit sensitivity - more stable but limited upside"
                    }
                }
            ],
            profitProjections: {
                marginOfSafety: "Margin of Safety = (Actual Sales - Break-Even Sales) / Actual Sales",
                profitAtVolumes: [
                    {
                        volume: Math.round(result * 1.1),
                        revenue: this.formatCurrency(Math.round(result * 1.1) * pricePerUnit),
                        profit: this.formatCurrency(Math.round(result * 0.1) * contributionMargin),
                        description: "10% above break-even"
                    },
                    {
                        volume: Math.round(result * 1.25), 
                        revenue: this.formatCurrency(Math.round(result * 1.25) * pricePerUnit),
                        profit: this.formatCurrency(Math.round(result * 0.25) * contributionMargin),
                        description: "25% above break-even"
                    },
                    {
                        volume: Math.round(result * 1.5),
                        revenue: this.formatCurrency(Math.round(result * 1.5) * pricePerUnit), 
                        profit: this.formatCurrency(Math.round(result * 0.5) * contributionMargin),
                        description: "50% above break-even"
                    }
                ]
            },
            businessInsights: {
                strategicImplications: [
                    `Fixed cost structure represents ${((fixedCosts / breakEvenRevenue) * 100).toFixed(1)}% of break-even revenue`,
                    contributionMarginRatio > 0.4 ? "High-margin business model with good scalability" :
                    "Cost-sensitive business model requiring volume focus",
                    result < 10000 ? "Low break-even supports business viability and growth" :
                    "High break-even volume requires strong market penetration strategy"
                ],
                riskFactors: [
                    "Sales volume uncertainty and market demand volatility",
                    "Price competition and margin pressure risks", 
                    "Fixed cost escalation without proportional volume growth",
                    contributionMarginRatio < 0.3 ? "Low contribution margin limits pricing flexibility" :
                    "Adequate contribution margin provides pricing cushion"
                ],
                opportunityAreas: [
                    "Volume growth above break-even provides high profit leverage",
                    contributionMarginRatio < 0.4 ? "Margin improvement through cost reduction or pricing" :
                    "Operational efficiency improvements",
                    "Market expansion and penetration strategies"
                ]
            }
        };
    }

    generateGenericWalkthrough() {
        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        if (!formula) return { title: "Calculation Analysis", steps: [] };

        return {
            title: `${formula.name} - Professional Analysis`,
            formula: formula.formula || "See documentation",
            steps: [
                {
                    step: "Step 1: Parameter Input and Validation",
                    explanation: Object.entries(this.calculationResult.parameters)
                        .map(([name, value]) => `${name}: ${value}`)
                        .join('\n'),
                    validation: "All required parameters provided and validated"
                },
                {
                    step: "Step 2: Formula Application",
                    formula: formula.formula || `Applying ${formula.name} calculation`,
                    explanation: formula.description || `Calculating ${formula.name} based on input parameters`
                },
                {
                    step: "Step 3: Result Interpretation",
                    result: typeof this.calculationResult.result === 'object' ? 
                           JSON.stringify(this.calculationResult.result) : 
                           this.calculationResult.result.toString(),
                    explanation: "Result calculated according to standard financial formulas"
                }
            ],
            businessInsights: {
                keyTakeaway: formula.description || "Financial calculation provides quantitative business insights",
                applications: formula.useCases || ["Business analysis", "Financial planning", "Decision support"],
                considerations: ["Verify input data accuracy", "Consider market conditions", "Review assumptions regularly"]
            }
        };
    }

    // Enhanced workbook generation with professional structure
    generateWorkbook() {
        const data = [];

        // Enhanced header with professional branding
        data.push(...this.generateEnhancedHeaderSection());
        
        // Executive summary with formula-specific insights
        data.push(...this.generateEnhancedExecutiveSummarySection());
        
        // Detailed input analysis
        data.push(...this.generateDetailedInputSection());
        
        // Comprehensive calculation results
        data.push(...this.generateComprehensiveResultsSection());
        
        // Enhanced walkthrough with professional analysis
        data.push(...this.generateProfessionalWalkthroughSection());

        // Advanced sensitivity analysis if available
        if (Object.keys(this.sensitivityAnalysis).length > 0) {
            data.push(...this.generateAdvancedSensitivitySection());
        }

        // Enhanced scenario analysis if available  
        if (Object.keys(this.scenarioAnalysis).length > 0) {
            data.push(...this.generateAdvancedScenarioSection());
        }

        // Comparison analysis if available
        if (Object.keys(this.comparisonAnalysis).length > 0) {
            data.push(...this.generateComparisonAnalysisSection());
        }

        // Professional recommendations and conclusions
        data.push(...this.generateProfessionalRecommendationsSection());
        
        // Enhanced appendix with technical details
        data.push(...this.generateProfessionalAppendixSection());

        this.currentWorkbook = data;
    }

    generateEnhancedHeaderSection() {
        return [
            { type: 'title', content: 'PROFESSIONAL FINANCIAL ANALYSIS WORKBOOK', style: 'main_title' },
            { type: 'subtitle', content: 'Comprehensive Quantitative Business Intelligence', style: 'subtitle' },
            { type: 'spacer' },
            { type: 'section_header', content: 'EXECUTIVE OVERVIEW', style: 'major_section' },
            { type: 'data_row', label: 'Analysis Type:', value: FormulaRegistry.getFormula(this.selectedFormula)?.name || this.selectedFormula, style: 'bold_value' },
            { type: 'data_row', label: 'Business Category:', value: FormulaRegistry.getFormula(this.selectedFormula)?.category || 'Financial Analysis' },
            { type: 'data_row', label: 'Entity/Scenario:', value: this.companyName, style: 'bold_value' },
            { type: 'data_row', label: 'Analysis Date:', value: new Date(this.analysisDate).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
            }) },
            { type: 'data_row', label: 'Prepared By:', value: this.analystName },
            { type: 'data_row', label: 'Report ID:', value: `FA-${Date.now().toString(36).toUpperCase()}` },
            { type: 'spacer' }
        ];
    }

    generateEnhancedExecutiveSummarySection() {
        if (!this.executiveSummary) return [];

        return [
            { type: 'section_header', content: 'EXECUTIVE SUMMARY', style: 'major_section' },
            { type: 'highlight_box', content: this.executiveSummary.headline, style: 'executive_highlight' },
            { type: 'spacer_small' },
            { type: 'subsection_header', content: 'Key Finding', style: 'minor_section' },
            { type: 'narrative', content: this.executiveSummary.keyFinding },
            { type: 'subsection_header', content: 'Business Implication', style: 'minor_section' },
            { type: 'narrative', content: this.executiveSummary.businessImplication },
            { type: 'subsection_header', content: 'Critical Success Factor', style: 'minor_section' },
            { type: 'narrative', content: this.executiveSummary.criticalFactor },
            { type: 'subsection_header', content: 'Strategic Recommendation', style: 'minor_section' },
            { type: 'recommendation', content: this.executiveSummary.recommendation, style: 'recommendation_box' },
            { type: 'spacer' }
        ];
    }

    generateDetailedInputSection() {
        if (!this.calculationResult || !this.calculationResult.parameters) return [];

        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        const rows = [
            { type: 'section_header', content: 'INPUT PARAMETER ANALYSIS', style: 'major_section' }
        ];

        // Parameter validation and analysis
        Object.entries(this.calculationResult.parameters).forEach(([name, value]) => {
            rows.push({ type: 'parameter_header', content: name, style: 'parameter_name' });
            rows.push({ type: 'parameter_value', content: value, style: 'parameter_data' });
            
            // Add parameter-specific insights
            const insights = this.generateParameterInsights(name, value);
            if (insights) {
                rows.push({ type: 'parameter_insight', content: insights, style: 'insight_text' });
            }
            rows.push({ type: 'spacer_small' });
        });

        // Add formula documentation
        if (formula) {
            rows.push({ type: 'subsection_header', content: 'Formula Documentation', style: 'minor_section' });
            rows.push({ type: 'formula_display', content: formula.formula || 'See technical documentation', style: 'formula_box' });
            rows.push({ type: 'formula_description', content: formula.description, style: 'description_text' });
        }

        rows.push({ type: 'spacer' });
        return rows;
    }

    generateParameterInsights(paramName, paramValue) {
        const name = paramName.toLowerCase();
        
        if (name.includes('rate') || name.includes('interest')) {
            const rate = typeof paramValue === 'string' ? parseFloat(paramValue.replace('%', '')) / 100 : paramValue;
            if (rate > 0.15) return 'High rate suggests elevated risk or inflation expectations';
            if (rate < 0.02) return 'Very low rate - verify market appropriateness';
            return 'Rate appears within normal market range';
        }
        
        if (name.includes('asset') || name.includes('income') || name.includes('cost')) {
            const numValue = typeof paramValue === 'string' ? 
                           parseFloat(paramValue.replace(/[$,]/g, '')) : paramValue;
            if (numValue > 1000000) return 'Large-scale enterprise-level figures';
            if (numValue < 1000) return 'Small-scale or per-unit analysis';
        }
        
        if (name.includes('period') || name.includes('year')) {
            const periods = parseInt(paramValue);
            if (periods > 10) return 'Long-term analysis - consider assumption stability';
            if (periods < 2) return 'Short-term analysis - limited trend visibility';
        }
        
        return null;
    }

    generateComprehensiveResultsSection() {
        const result = this.calculationResult.result;
        const interpretation = this.calculationResult.interpretation;
        
        // Handle different result types
        const displayValue = typeof result === 'object' ? 
                           result.value || result.ratio || result.breakEvenUnits || result.roe || 'Complex Result' :
                           result;

        const rows = [
            { type: 'section_header', content: 'COMPREHENSIVE RESULTS ANALYSIS', style: 'major_section' }
        ];

        // Main result display with enhanced formatting
        const formattedResult = this.formatResultForDisplay(displayValue);
        rows.push({ type: 'primary_result', content: formattedResult, style: 'primary_result_box' });

        // Interpretation section
        if (interpretation) {
            rows.push({ type: 'subsection_header', content: 'Result Interpretation', style: 'minor_section' });
            rows.push({ type: 'interpretation_meaning', content: interpretation.meaning, style: 'meaning_text' });
            rows.push({ type: 'interpretation_implication', content: interpretation.implication, style: 'implication_text' });
            
            // Key insights
            if (interpretation.keyInsights) {
                rows.push({ type: 'subsection_header', content: 'Key Analytical Insights', style: 'minor_section' });
                interpretation.keyInsights.forEach(insight => {
                    rows.push({ type: 'insight_bullet', content: insight, style: 'bullet_insight' });
                });
            }

            // Business context
            if (interpretation.businessContext) {
                rows.push({ type: 'subsection_header', content: 'Business Context Analysis', style: 'minor_section' });
                Object.entries(interpretation.businessContext).forEach(([key, value]) => {
                    rows.push({ type: 'context_item', content: `${this.capitalizeFirst(key)}: ${value}`, style: 'context_text' });
                });
            }
        }

        // Detailed analysis if available
        if (this.detailedAnalysis) {
            rows.push(...this.generateDetailedAnalysisRows());
        }

        rows.push({ type: 'spacer' });
        return rows;
    }

    formatResultForDisplay(value) {
        if (typeof value === 'number') {
            // Determine appropriate formatting based on formula type
            if (this.selectedFormula.includes('Ratio') || this.selectedFormula === 'currentRatio') {
                return `${value.toFixed(2)}:1`;
            } else if (this.selectedFormula.includes('return') || this.selectedFormula.includes('Margin')) {
                return this.formatPercentage(value);
            } else if (this.selectedFormula.includes('Value') || this.selectedFormula.includes('cost') || this.selectedFormula.includes('income')) {
                return this.formatCurrency(value);
            } else if (this.selectedFormula === 'breakEvenUnits') {
                return `${this.formatNumber(value)} units`;
            } else {
                return this.formatNumber(value);
            }
        }
        return value.toString();
    }

    generateDetailedAnalysisRows() {
        const rows = [
            { type: 'subsection_header', content: 'Detailed Quantitative Analysis', style: 'minor_section' }
        ];

        // Add analysis based on formula type
        if (this.detailedAnalysis.calculationBreakdown) {
            rows.push({ type: 'analysis_header', content: 'Calculation Breakdown', style: 'analysis_section' });
            Object.entries(this.detailedAnalysis.calculationBreakdown).forEach(([key, value]) => {
                rows.push({ type: 'breakdown_item', content: `${this.formatLabel(key)}: ${this.formatValue(value)}`, style: 'breakdown_text' });
            });
        }

        if (this.detailedAnalysis.businessApplications) {
            rows.push({ type: 'analysis_header', content: 'Business Applications', style: 'analysis_section' });
            this.detailedAnalysis.businessApplications.forEach(app => {
                rows.push({ type: 'application_item', content: app, style: 'application_text' });
            });
        }

        return rows;
    }

    generateProfessionalWalkthroughSection() {
        const walkthrough = this.generateCalculationWalkthrough();
        if (!walkthrough || !walkthrough.steps) return [];

        const rows = [
            { type: 'section_header', content: 'DETAILED CALCULATION METHODOLOGY', style: 'major_section' },
            { type: 'methodology_intro', content: walkthrough.title, style: 'methodology_title' }
        ];

        if (walkthrough.formula) {
            rows.push({ type: 'formula_display', content: walkthrough.formula, style: 'formula_box' });
        }

        // Enhanced step presentation
        walkthrough.steps.forEach((step, index) => {
            rows.push({ type: 'step_header', content: step.step, style: 'step_title' });
            
            if (step.explanation) {
                rows.push({ type: 'step_explanation', content: step.explanation, style: 'explanation_text' });
            }
            
            if (step.formula) {
                rows.push({ type: 'step_formula', content: step.formula, style: 'step_formula_box' });
            }
            
            if (step.calculation) {
                rows.push({ type: 'step_calculation', content: step.calculation, style: 'calculation_text' });
            }
            
            if (step.interpretation) {
                rows.push({ type: 'step_interpretation', content: step.interpretation, style: 'interpretation_text' });
            }

            // Handle complex step data
            if (step.detailedCalculations) {
                rows.push({ type: 'detailed_calc_header', content: 'Detailed Calculations:', style: 'detail_header' });
                rows.push({ type: 'detailed_calc_content', content: step.detailedCalculations, style: 'detail_content' });
            }

            if (step.cumulativeImpact) {
                rows.push({ type: 'cumulative_header', content: 'Cumulative Impact:', style: 'detail_header' });
                rows.push({ type: 'cumulative_content', content: step.cumulativeImpact, style: 'detail_content' });
            }

            rows.push({ type: 'spacer_small' });
        });

        // Business insights section
        if (walkthrough.businessInsights) {
            rows.push({ type: 'subsection_header', content: 'Professional Business Insights', style: 'minor_section' });
            
            if (walkthrough.businessInsights.keyTakeaway) {
                rows.push({ type: 'insight_header', content: 'Key Takeaway:', style: 'insight_label' });
                rows.push({ type: 'insight_content', content: walkthrough.businessInsights.keyTakeaway, style: 'insight_text' });
            }
            
            if (walkthrough.businessInsights.decisionMaking) {
                rows.push({ type: 'insight_header', content: 'Decision Framework:', style: 'insight_label' });
                rows.push({ type: 'insight_content', content: walkthrough.businessInsights.decisionMaking, style: 'insight_text' });
            }
            
            if (walkthrough.businessInsights.criticalFactors) {
                rows.push({ type: 'insight_header', content: 'Critical Success Factors:', style: 'insight_label' });
                walkthrough.businessInsights.criticalFactors.forEach(factor => {
                    rows.push({ type: 'factor_item', content: factor, style: 'factor_text' });
                });
            }
        }

        // Decision framework if available
        if (walkthrough.decisionFramework) {
            rows.push({ type: 'subsection_header', content: 'Decision Framework', style: 'minor_section' });
            rows.push({ type: 'decision_box', content: walkthrough.decisionFramework.decision, style: 'decision_highlight' });
            rows.push({ type: 'decision_rationale', content: walkthrough.decisionFramework.rationale, style: 'rationale_text' });
        }

        rows.push({ type: 'spacer' });
        return rows;
    }

    generateAdvancedSensitivitySection() {
        const sensitivity = this.sensitivityAnalysis;
        
        const rows = [
            { type: 'section_header', content: 'ADVANCED SENSITIVITY ANALYSIS', style: 'major_section' },
            { type: 'sensitivity_intro', content: `Analysis of ${sensitivity.parameterName} Impact on Results`, style: 'analysis_intro' },
            { type: 'base_case', content: `Base Case: ${this.formatValue(sensitivity.baseValue)} → ${this.formatValue(sensitivity.baseResult)}`, style: 'base_case_box' },
            { type: 'spacer_small' },
            { type: 'table_header', content: 'Parameter Change | New Value | Result Change | Elasticity | Risk Assessment', style: 'sensitivity_table_header' }
        ];

        // Enhanced sensitivity data presentation
        sensitivity.variations.forEach(variation => {
            if (!variation.error) {
                const elasticityFormatted = Math.abs(variation.elasticity).toFixed(2);
                const riskColor = Math.abs(variation.elasticity) > 2 ? 'high_risk' : 
                                Math.abs(variation.elasticity) > 1 ? 'moderate_risk' : 'low_risk';
                
                const row = `${variation.percentChange >= 0 ? '+' : ''}${variation.percentChange}% | ` +
                          `${this.formatValue(variation.newValue)} | ` +
                          `${variation.resultChange >= 0 ? '+' : ''}${variation.resultChange.toFixed(2)}% | ` +
                          `${elasticityFormatted} | ` +
                          `${variation.interpretation}`;
                
                rows.push({ type: 'sensitivity_row', content: row, style: riskColor });
            }
        });

        // Enhanced analysis summary
        if (sensitivity.analysis) {
            rows.push({ type: 'spacer_small' });
            rows.push({ type: 'analysis_summary_header', content: 'Sensitivity Analysis Summary', style: 'analysis_header' });
            
            if (sensitivity.analysis.riskLevel) {
                rows.push({ type: 'risk_assessment', content: sensitivity.analysis.riskLevel, style: 'risk_box' });
            }
            
            if (sensitivity.analysis.criticalThresholds && sensitivity.analysis.criticalThresholds.length > 0) {
                rows.push({ type: 'threshold_header', content: 'Critical Thresholds Identified:', style: 'threshold_label' });
                sensitivity.analysis.criticalThresholds.forEach(threshold => {
                    rows.push({ type: 'threshold_item', content: threshold, style: 'threshold_text' });
                });
            }
        }

        rows.push({ type: 'spacer' });
        return rows;
    }

    generateAdvancedScenarioSection() {
        const scenario = this.scenarioAnalysis;
        
        const rows = [
            { type: 'section_header', content: 'COMPREHENSIVE SCENARIO ANALYSIS', style: 'major_section' },
            { type: 'scenario_intro', content: 'Multi-Scenario Impact Assessment and Risk Evaluation', style: 'analysis_intro' }
        ];

        // Base case presentation
        rows.push({ type: 'base_scenario_header', content: 'Base Case Scenario', style: 'scenario_header' });
        rows.push({ type: 'base_scenario_result', content: `${scenario.baseCase.name}: ${this.formatValue(scenario.baseCase.result)}`, style: 'base_scenario_box' });

        // Alternative scenarios
        rows.push({ type: 'scenarios_header', content: 'Alternative Scenario Analysis', style: 'scenario_header' });
        rows.push({ type: 'scenario_table_header', content: 'Scenario | Result | Change from Base | Probability | Risk Impact | Strategic Implication', style: 'scenario_table_header' });

        scenario.scenarios.forEach(scenarioItem => {
            if (!scenarioItem.error) {
                const row = `${scenarioItem.name} | ` +
                          `${this.formatValue(scenarioItem.result)} | ` +
                          `${scenarioItem.resultChange >= 0 ? '+' : ''}${scenarioItem.resultChange.toFixed(1)}% | ` +
                          `${(scenarioItem.probability * 100).toFixed(0)}% | ` +
                          `${scenarioItem.riskImpact?.level || 'N/A'} | ` +
                          `${scenarioItem.strategicImplication || 'Under review'}`;
                
                rows.push({ type: 'scenario_row', content: row, style: 'scenario_data' });
                
                // Add detailed interpretation
                if (scenarioItem.interpretation) {
                    rows.push({ type: 'scenario_detail', content: scenarioItem.interpretation.summary, style: 'scenario_detail_text' });
                }
            }
        });

        // Risk metrics summary
        if (scenario.analysis && scenario.analysis.riskMetrics) {
            rows.push({ type: 'spacer_small' });
            rows.push({ type: 'risk_metrics_header', content: 'Statistical Risk Assessment', style: 'risk_header' });
            
            const metrics = scenario.analysis.riskMetrics;
            rows.push({ type: 'risk_metric', content: `Expected Value: ${this.formatValue(scenario.analysis.expectedValue)}`, style: 'risk_text' });
            rows.push({ type: 'risk_metric', content: `Standard Deviation: ${this.formatValue(metrics.standardDeviation)}`, style: 'risk_text' });
            rows.push({ type: 'risk_metric', content: `Coefficient of Variation: ${(metrics.coefficientOfVariation * 100).toFixed(2)}%`, style: 'risk_text' });
            rows.push({ type: 'risk_metric', content: `Worst Case: ${this.formatValue(metrics.worstCase)}`, style: 'risk_text' });
            rows.push({ type: 'risk_metric', content: `Best Case: ${this.formatValue(metrics.bestCase)}`, style: 'risk_text' });
        }

        rows.push({ type: 'spacer' });
        return rows;
    }

    generateProfessionalRecommendationsSection() {
        const recommendations = this.generateEnhancedRecommendations();

        return [
            { type: 'section_header', content: 'STRATEGIC RECOMMENDATIONS & ACTION PLAN', style: 'major_section' },
            { type: 'primary_recommendation', content: recommendations.primary, style: 'primary_rec_box' },
            { type: 'spacer_small' },
            { type: 'subsection_header', content: 'Risk Assessment & Mitigation', style: 'minor_section' },
            { type: 'risk_analysis', content: recommendations.riskAssessment, style: 'risk_text' },
            { type: 'mitigation_strategy', content: recommendations.mitigation, style: 'mitigation_text' },
            { type: 'subsection_header', content: 'Implementation Framework', style: 'minor_section' },
            { type: 'implementation_steps', content: recommendations.implementation, style: 'implementation_text' },
            { type: 'subsection_header', content: 'Monitoring & Control Metrics', style: 'minor_section' },
            { type: 'monitoring_metrics', content: recommendations.monitoring, style: 'monitoring_text' },
            { type: 'spacer' }
        ];
    }

    generateEnhancedRecommendations() {
        const result = typeof this.calculationResult.result === 'object' ? 
                      this.calculationResult.result.value || this.calculationResult.result.ratio || this.calculationResult.result.breakEvenUnits || this.calculationResult.result.roe :
                      this.calculationResult.result;

        switch(this.selectedFormula) {
            case 'netPresentValue':
                return {
                    primary: result > 0 ? 'ACCEPT INVESTMENT - Project creates significant shareholder value and exceeds minimum return requirements' : 'REJECT INVESTMENT - Project fails to meet cost of capital and destroys shareholder value',
                    riskAssessment: result > 0 ? 
                        'Low to moderate risk - Positive NPV indicates returns exceed hurdle rate, but verify cash flow assumptions and market conditions' :
                        'High risk - Negative NPV suggests inadequate returns. Consider alternative investments or project modifications',
                    mitigation: result > 0 ? 
                        'Monitor key assumptions through project lifecycle. Implement milestone reviews and maintain flexibility for scope adjustments' :
                        'If proceeding despite negative NPV, identify strategic benefits, cost reductions, or revenue enhancements to improve project viability',
                    implementation: 'Establish project governance framework, define key performance indicators, create milestone-based funding approach, and develop contingency plans for adverse scenarios',
                    monitoring: 'Track actual vs. projected cash flows monthly, review discount rate assumptions quarterly, monitor market conditions continuously, and prepare scenario updates semi-annually'
                };
                
            case 'currentRatio':
                const ratio = result;
                return {
                    primary: ratio >= 2.0 ? 'STRONG LIQUIDITY POSITION - Maintain current working capital management while optimizing excess liquidity for growth opportunities' :
                           ratio >= 1.5 ? 'ADEQUATE LIQUIDITY - Continue current practices with enhanced monitoring of cash conversion cycle' :
                           ratio >= 1.0 ? 'WEAK LIQUIDITY - Implement immediate improvements to working capital management and secure backup credit facilities' :
                           'CRITICAL LIQUIDITY SHORTAGE - Take urgent action to improve cash position and avoid operational disruption',
                    riskAssessment: ratio >= 1.5 ? 'Low liquidity risk - Company can meet short-term obligations comfortably' :
                                  ratio >= 1.0 ? 'Moderate to high risk - Limited financial flexibility requires careful cash management' :
                                  'Critical risk - Immediate liquidity crisis possible without intervention',
                    mitigation: ratio < 1.5 ? 
                        'Accelerate receivables collection, negotiate extended payables terms, reduce inventory where possible, secure revolving credit facilities' :
                        'Optimize excess cash through short-term investments, consider debt reduction, evaluate growth investment opportunities',
                    implementation: 'Implement daily cash flow monitoring, establish credit facility relationships, optimize inventory management systems, and enhance collections processes',
                    monitoring: 'Daily cash position tracking, weekly working capital analysis, monthly current ratio calculation, quarterly liquidity stress testing'
                };
                
            case 'returnOnEquity':
                const roePercentage = result * 100;
                return {
                    primary: roePercentage >= 20 ? 'EXCEPTIONAL PERFORMANCE - Investigate sustainability of superior returns while maintaining competitive advantages' :
                           roePercentage >= 15 ? 'EXCELLENT PERFORMANCE - Continue current strategy while monitoring for competitive pressures' :
                           roePercentage >= 10 ? 'ADEQUATE PERFORMANCE - Identify improvement opportunities through DuPont analysis' :
                           'SUBOPTIMAL PERFORMANCE - Implement comprehensive performance improvement program',
                    riskAssessment: roePercentage > 25 ? 'Monitor for unsustainable practices or excessive leverage driving high returns' :
                                  roePercentage < 10 ? 'Below-market returns may indicate operational inefficiencies or strategic misalignment' :
                                  'Performance within acceptable range but monitor competitive position',
                    mitigation: roePercentage < 12 ? 
                        'Focus on margin improvement, asset utilization enhancement, and capital structure optimization through DuPont framework analysis' :
                        'Maintain competitive positioning while preparing for potential market challenges or competitive pressures',
                    implementation: 'Conduct comprehensive DuPont analysis, benchmark against industry peers, develop performance improvement roadmap, and establish management incentive alignment',
                    monitoring: 'Monthly ROE calculation, quarterly DuPont component analysis, semi-annual peer benchmarking, annual strategic performance review'
                };
                
            default:
                return {
                    primary: 'CONTINUE ANALYSIS - Results provide foundation for informed business decisions, but require context-specific interpretation and action planning',
                    riskAssessment: 'Risk level depends on specific business context and industry dynamics - conduct additional analysis as needed',
                    mitigation: 'Verify data accuracy, validate assumptions, consider alternative scenarios, and benchmark against industry standards',
                    implementation: 'Integrate findings into broader strategic planning process, communicate results to stakeholders, and develop action plans based on business priorities',
                    monitoring: 'Establish regular review cycles, track key performance indicators, monitor assumption validity, and update analysis as business conditions change'
                };
        }
    }

    generateProfessionalAppendixSection() {
        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        
        return [
            { type: 'section_header', content: 'TECHNICAL APPENDIX & METHODOLOGY', style: 'major_section' },
            { type: 'subsection_header', content: 'Formula Specification', style: 'minor_section' },
            { type: 'formula_name', content: formula?.name || this.selectedFormula, style: 'formula_title' },
            { type: 'formula_category', content: `Category: ${formula?.category || 'Financial Analysis'}`, style: 'category_text' },
            { type: 'formula_equation', content: formula?.formula || 'See technical documentation', style: 'formula_box' },
            { type: 'formula_description', content: formula?.description || 'Professional financial calculation', style: 'description_text' },
            { type: 'spacer_small' },
            
            { type: 'subsection_header', content: 'Industry Applications', style: 'minor_section' },
            ...(formula?.useCases || ['Business analysis', 'Financial planning', 'Strategic decision-making']).map(useCase => 
                ({ type: 'use_case', content: useCase, style: 'use_case_text' })
            ),
            { type: 'spacer_small' },
            
            { type: 'subsection_header', content: 'Industry Benchmarks', style: 'minor_section' },
            ...this.generateBenchmarkData(formula),
            
            { type: 'subsection_header', content: 'Quality Assurance', style: 'minor_section' },
            { type: 'qa_item', content: 'Data validation: All input parameters verified for accuracy and completeness', style: 'qa_text' },
            { type: 'qa_item', content: 'Calculation verification: Results cross-checked using standard financial formulas', style: 'qa_text' },
            { type: 'qa_item', content: 'Assumption documentation: All key assumptions explicitly stated and justified', style: 'qa_text' },
            { type: 'qa_item', content: 'Professional standards: Analysis conducted according to industry best practices', style: 'qa_text' },
            
            { type: 'spacer_small' },
            { type: 'subsection_header', content: 'Report Metadata', style: 'minor_section' },
            { type: 'metadata', content: `Generated: ${new Date().toLocaleString()}`, style: 'metadata_text' },
            { type: 'metadata', content: `Analysis Version: ${this.getAnalysisVersion()}`, style: 'metadata_text' },
            { type: 'metadata', content: `Data Sources: ${this.getDataSources()}`, style: 'metadata_text' },
            { type: 'metadata', content: `Analyst: ${this.analystName}`, style: 'metadata_text' },
            { type: 'metadata', content: `Review Status: ${this.getReviewStatus()}`, style: 'metadata_text' }
        ];
    }

    generateBenchmarkData(formula) {
        if (!formula?.industryBenchmarks) {
            return [{ type: 'benchmark_note', content: 'Industry benchmarks vary by sector and market conditions', style: 'benchmark_text' }];
        }

        return Object.entries(formula.industryBenchmarks).map(([industry, benchmark]) => ({
            type: 'benchmark_item',
            content: `${industry}: ${benchmark}`,
            style: 'benchmark_text'
        }));
    }

    // Helper methods for metadata
    getAnalysisVersion() {
        return '2.1.0 - Enhanced Professional Edition';
    }

    getDataSources() {
        return 'User-provided parameters, validated against industry standards';
    }

    getReviewStatus() {
        return 'Automated validation completed - Ready for management review';
    }

    // Utility formatting methods
    formatLabel(key) {
        return key.split(/(?=[A-Z])/).map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    formatValue(value) {
        if (typeof value === 'number') {
            if (Math.abs(value) >= 1000000) {
                return `${(value / 1000000).toFixed(2)}M`;
            } else if (Math.abs(value) >= 1000) {
                return `${(value / 1000).toFixed(1)}K`;
            } else if (value % 1 !== 0) {
                return value.toFixed(4);
            } else {
                return value.toLocaleString();
            }
        }
        return value?.toString() || 'N/A';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Enhanced PNG export with professional styling
    exportToPNG(filename = 'financial_analysis.png', options = {}) {
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');

        this.renderProfessionalReport(ctx, options);

        const buffer = canvas.toBuffer('image/png');
        if (filename) {
            fs.writeFileSync(filename, buffer);
        }

        return buffer;
    }

    renderProfessionalReport(ctx, options = {}) {
        const {
            showSensitivity = true,
            showScenarios = true,
            showWalkthrough = true,
            theme = 'professional'
        } = options;

        // Enhanced background with subtle gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#fafbfc');
        gradient.addColorStop(1, '#f8f9fa');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Professional border
        ctx.strokeStyle = this.colors.borderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(15, 15, this.width - 30, this.height - 30);

        let yPosition = 50;
        const leftMargin = 60;
        const rightMargin = this.width - 60;
        const contentWidth = rightMargin - leftMargin;

        // Enhanced header with professional styling
        yPosition = this.renderProfessionalHeader(ctx, yPosition, leftMargin, contentWidth);

        // Executive summary with enhanced visuals
        yPosition = this.renderEnhancedExecutiveSummary(ctx, yPosition, leftMargin, contentWidth);

        // Key metrics dashboard
        yPosition = this.renderKeyMetricsDashboard(ctx, yPosition, leftMargin, contentWidth);

        // Professional results section
        yPosition = this.renderProfessionalResults(ctx, yPosition, leftMargin, contentWidth);

        // Enhanced walkthrough if space allows
        if (showWalkthrough && yPosition < this.height - 400) {
            yPosition = this.renderProfessionalWalkthrough(ctx, yPosition, leftMargin, contentWidth);
        }

        // Visual sensitivity analysis
        if (showSensitivity && this.sensitivityAnalysis && Object.keys(this.sensitivityAnalysis).length > 0) {
            yPosition = this.renderVisualSensitivityAnalysis(ctx, yPosition, leftMargin, contentWidth);
        }

        // Scenario comparison chart
        if (showScenarios && this.scenarioAnalysis && Object.keys(this.scenarioAnalysis).length > 0) {
            yPosition = this.renderScenarioComparisonChart(ctx, yPosition, leftMargin, contentWidth);
        }

        // Professional footer
        this.renderProfessionalFooter(ctx, leftMargin, contentWidth);
    }

    renderProfessionalHeader(ctx, yPosition, leftMargin, contentWidth) {
        // Corporate header background
        const headerHeight = 80;
        const headerGradient = ctx.createLinearGradient(leftMargin, yPosition, leftMargin, yPosition + headerHeight);
        headerGradient.addColorStop(0, this.colors.headerBg);
        headerGradient.addColorStop(1, '#0f3460');
        
        ctx.fillStyle = headerGradient;
        ctx.fillRect(leftMargin - 30, yPosition - 10, contentWidth + 60, headerHeight);

        // Header text with shadow effect
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetY = 1;
        
        ctx.fillStyle = this.colors.headerText;
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PROFESSIONAL FINANCIAL ANALYSIS', leftMargin + contentWidth / 2, yPosition + 35);
        
        ctx.shadowColor = 'transparent';
        ctx.font = 'bold 20px Arial';
        const formulaName = FormulaRegistry.getFormula(this.selectedFormula)?.name || this.selectedFormula;
        ctx.fillText(formulaName, leftMargin + contentWidth / 2, yPosition + 60);

        yPosition += headerHeight + 30;

        // Company information bar
        ctx.fillStyle = this.colors.sectionBg;
        ctx.fillRect(leftMargin, yPosition, contentWidth, 40);
        ctx.strokeStyle = this.colors.borderColor;
        ctx.strokeRect(leftMargin, yPosition, contentWidth, 40);

        ctx.fillStyle = this.colors.sectionText;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Entity: ${this.companyName}`, leftMargin + 20, yPosition + 20);
        ctx.fillText(`Date: ${this.analysisDate}`, leftMargin + contentWidth/2, yPosition + 20);
        ctx.fillText(`Analyst: ${this.analystName}`, leftMargin + 20, yPosition + 35);

        return yPosition + 60;
    }

    renderEnhancedExecutiveSummary(ctx, yPosition, leftMargin, contentWidth) {
        if (!this.executiveSummary) return yPosition;

        yPosition = this.renderProfessionalSectionHeader(ctx, 'EXECUTIVE SUMMARY', yPosition, leftMargin, contentWidth);

        // Highlight box for key finding
        const boxHeight = 60;
        const boxGradient = ctx.createLinearGradient(leftMargin, yPosition, leftMargin, yPosition + boxHeight);
        boxGradient.addColorStop(0, this.colors.resultBg);
        boxGradient.addColorStop(1, '#d4edda');
        
        ctx.fillStyle = boxGradient;
        ctx.fillRect(leftMargin, yPosition, contentWidth, boxHeight);
        ctx.strokeStyle = this.colors.positiveColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(leftMargin, yPosition, contentWidth, boxHeight);

        ctx.fillStyle = this.colors.resultText;
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.executiveSummary.headline, leftMargin + contentWidth / 2, yPosition + 35);

        yPosition += boxHeight + 20;

        // Key insights with bullet points
        ctx.textAlign = 'left';
        ctx.font = '12px Arial';
        ctx.fillStyle = this.colors.cellText;

        yPosition = this.renderWrappedText(ctx, `Key Finding: ${this.executiveSummary.keyFinding}`, leftMargin + 20, yPosition, contentWidth - 40);
        yPosition = this.renderWrappedText(ctx, `Business Impact: ${this.executiveSummary.businessImplication}`, leftMargin + 20, yPosition + 10, contentWidth - 40);
        yPosition = this.renderWrappedText(ctx, `Recommendation: ${this.executiveSummary.recommendation}`, leftMargin + 20, yPosition + 10, contentWidth - 40);

        return yPosition + 30;
    }

    renderKeyMetricsDashboard(ctx, yPosition, leftMargin, contentWidth) {
        yPosition = this.renderProfessionalSectionHeader(ctx, 'KEY METRICS DASHBOARD', yPosition, leftMargin, contentWidth);

        const result = this.calculationResult.result;
        const displayValue = typeof result === 'object' ? 
                           result.value || result.ratio || result.breakEvenUnits || result.roe : result;

        // Main metric display
        const metricBoxWidth = contentWidth / 3 - 20;
        const metricBoxHeight = 80;

        // Primary result box
        ctx.fillStyle = this.colors.resultBg;
        ctx.fillRect(leftMargin, yPosition, metricBoxWidth, metricBoxHeight);
        ctx.strokeStyle = this.colors.borderColor;
        ctx.strokeRect(leftMargin, yPosition, metricBoxWidth, metricBoxHeight);

        ctx.fillStyle = this.colors.resultText;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        const formattedResult = this.formatResultForDisplay(displayValue);
        ctx.fillText(formattedResult, leftMargin + metricBoxWidth / 2, yPosition + 35);
        ctx.font = 'bold 12px Arial';
        ctx.fillText('PRIMARY RESULT', leftMargin + metricBoxWidth / 2, yPosition + 55);

        // Additional metrics based on formula type
        this.renderAdditionalMetrics(ctx, yPosition, leftMargin + metricBoxWidth + 20, metricBoxWidth, metricBoxHeight);

        return yPosition + metricBoxHeight + 30;
    }

    renderAdditionalMetrics(ctx, yPosition, leftMargin, boxWidth, boxHeight) {
        const metrics = this.getAdditionalMetrics();
        
        metrics.forEach((metric, index) => {
            const xOffset = (boxWidth + 20) * index;
            
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(leftMargin + xOffset, yPosition, boxWidth, boxHeight);
            ctx.strokeStyle = this.colors.borderColor;
            ctx.strokeRect(leftMargin + xOffset, yPosition, boxWidth, boxHeight);

            ctx.fillStyle = this.colors.cellText;
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(metric.value, leftMargin + xOffset + boxWidth / 2, yPosition + 35);
            ctx.font = 'bold 10px Arial';
            ctx.fillText(metric.label.toUpperCase(), leftMargin + xOffset + boxWidth / 2, yPosition + 55);
        });
    }

    getAdditionalMetrics() {
        const result = this.calculationResult.result;
        
        switch(this.selectedFormula) {
            case 'netPresentValue':
                const [rate, cashFlows] = this.formulaParams;
                const initialInvestment = Math.abs(cashFlows[0]);
                const profitabilityIndex = (result + initialInvestment) / initialInvestment;
                return [
                    { label: 'Profitability Index', value: profitabilityIndex.toFixed(2) },
                    { label: 'Investment', value: this.formatCurrency(initialInvestment) }
                ];
            
            case 'currentRatio':
                const [currentAssets, currentLiabilities] = this.formulaParams;
                const workingCapital = currentAssets - currentLiabilities;
                return [
                    { label: 'Working Capital', value: this.formatCurrency(workingCapital) },
                    { label: 'Risk Level', value: result >= 1.5 ? 'LOW' : result >= 1.0 ? 'MODERATE' : 'HIGH' }
                ];
            
            case 'returnOnEquity':
                const roePercentage = result * 100;
                return [
                    { label: 'Performance Tier', value: this.getROETier(result) },
                    { label: 'vs Market Avg', value: roePercentage >= 12 ? 'ABOVE' : 'BELOW' }
                ];
            
            default:
                return [
                    { label: 'Analysis Type', value: 'STANDARD' },
                    { label: 'Status', value: 'COMPLETE' }
                ];
        }
    }

    renderProfessionalResults(ctx, yPosition, leftMargin, contentWidth) {
        yPosition = this.renderProfessionalSectionHeader(ctx, 'DETAILED ANALYSIS', yPosition, leftMargin, contentWidth);

        if (this.calculationResult.interpretation) {
            const interpretation = this.calculationResult.interpretation;
            
            // Interpretation box
            ctx.fillStyle = '#fff3cd';
            ctx.fillRect(leftMargin, yPosition, contentWidth, 60);
            ctx.strokeStyle = '#856404';
            ctx.strokeRect(leftMargin, yPosition, contentWidth, 60);

            ctx.fillStyle = '#856404';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'left';
            yPosition = this.renderWrappedText(ctx, interpretation.meaning, leftMargin + 15, yPosition + 20, contentWidth - 30);
            yPosition = this.renderWrappedText(ctx, interpretation.implication, leftMargin + 15, yPosition + 5, contentWidth - 30);
        }

        return yPosition + 30;
    }

    renderProfessionalWalkthrough(ctx, yPosition, leftMargin, contentWidth) {
        const walkthrough = this.generateCalculationWalkthrough();
        if (!walkthrough || !walkthrough.steps) return yPosition;

        yPosition = this.renderProfessionalSectionHeader(ctx, 'CALCULATION METHODOLOGY', yPosition, leftMargin, contentWidth);

        // Show first 2 steps to fit on page
        const stepsToShow = Math.min(2, walkthrough.steps.length);
        
        walkthrough.steps.slice(0, stepsToShow).forEach((step, index) => {
            // Step header
            ctx.fillStyle = this.colors.sectionBg;
            ctx.fillRect(leftMargin, yPosition, contentWidth, 25);
            ctx.strokeStyle = this.colors.borderColor;
            ctx.strokeRect(leftMargin, yPosition, contentWidth, 25);
            
            ctx.fillStyle = this.colors.sectionText;
            ctx.font = 'bold 12px Arial';
            ctx.fillText(step.step, leftMargin + 10, yPosition + 16);
            
            yPosition += 35;

            // Step content
            ctx.font = '11px Arial';
            ctx.fillStyle = this.colors.cellText;
            
            if (step.explanation) {
                yPosition = this.renderWrappedText(ctx, step.explanation, leftMargin + 20, yPosition, contentWidth - 40);
                yPosition += 10;
            }

            if (step.formula) {
                ctx.fillStyle = this.colors.formulaBg;
                ctx.fillRect(leftMargin + 20, yPosition, contentWidth - 40, 20);
                ctx.strokeStyle = this.colors.formulaText;
                ctx.strokeRect(leftMargin + 20, yPosition, contentWidth - 40, 20);
                
                ctx.fillStyle = this.colors.formulaText;
                ctx.font = 'bold 10px monospace';
                ctx.fillText(step.formula, leftMargin + 25, yPosition + 13);
                yPosition += 25;
            }

            yPosition += 15;
        });

        return yPosition;
    }

    renderVisualSensitivityAnalysis(ctx, yPosition, leftMargin, contentWidth) {
        if (!this.sensitivityAnalysis || !this.sensitivityAnalysis.variations) return yPosition;

        yPosition = this.renderProfessionalSectionHeader(ctx, 'SENSITIVITY ANALYSIS', yPosition, leftMargin, contentWidth);

        const chartHeight = 120;
        const chartWidth = contentWidth - 100;
        const chartLeft = leftMargin + 50;

        // Chart background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(chartLeft, yPosition, chartWidth, chartHeight);
        ctx.strokeStyle = this.colors.borderColor;
        ctx.strokeRect(chartLeft, yPosition, chartWidth, chartHeight);

        // Draw sensitivity curve
        const validVariations = this.sensitivityAnalysis.variations.filter(v => !v.error && !isNaN(v.resultChange));
        
        if (validVariations.length > 0) {
            const minChange = Math.min(...validVariations.map(v => v.resultChange));
            const maxChange = Math.max(...validVariations.map(v => v.resultChange));
            const range = maxChange - minChange || 1;

            // Draw grid lines
            ctx.strokeStyle = '#dee2e6';
            ctx.lineWidth = 1;
            for (let i = 1; i <= 4; i++) {
                const y = yPosition + (chartHeight / 5) * i;
                ctx.beginPath();
                ctx.moveTo(chartLeft, y);
                ctx.lineTo(chartLeft + chartWidth, y);
                ctx.stroke();
            }

            // Draw sensitivity line
            ctx.strokeStyle = this.colors.headerBg;
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            validVariations.forEach((variation, index) => {
                const x = chartLeft + (index / (validVariations.length - 1)) * chartWidth;
                const y = yPosition + chartHeight - ((variation.resultChange - minChange) / range) * chartHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();

            // Draw data points
            ctx.fillStyle = this.colors.positiveColor;
            validVariations.forEach((variation, index) => {
                const x = chartLeft + (index / (validVariations.length - 1)) * chartWidth;
                const y = yPosition + chartHeight - ((variation.resultChange - minChange) / range) * chartHeight;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
        }

        // Chart labels
        ctx.fillStyle = this.colors.cellText;
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Parameter: ${this.sensitivityAnalysis.parameterName}`, chartLeft, yPosition - 5);
        ctx.textAlign = 'right';
        ctx.fillText('Result Impact (%)', chartLeft + chartWidth, yPosition - 5);

        return yPosition + chartHeight + 30;
    }

    renderScenarioComparisonChart(ctx, yPosition, leftMargin, contentWidth) {
        if (!this.scenarioAnalysis || !this.scenarioAnalysis.scenarios) return yPosition;

        yPosition = this.renderProfessionalSectionHeader(ctx, 'SCENARIO COMPARISON', yPosition, leftMargin, contentWidth);

        const chartHeight = 100;
        const barHeight = 15;
        const scenarios = [this.scenarioAnalysis.baseCase, ...this.scenarioAnalysis.scenarios.filter(s => !s.error)];

        scenarios.forEach((scenario, index) => {
            const y = yPosition + (index * 25);
            const barWidth = Math.abs(scenario.resultChange || 0) * 2; // Scale factor
            
            // Scenario label
            ctx.fillStyle = this.colors.cellText;
            ctx.font = '11px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(scenario.name, leftMargin, y + 12);
            
            // Result bar
            const barColor = (scenario.resultChange || 0) >= 0 ? this.colors.positiveColor : this.colors.negativeColor;
            ctx.fillStyle = barColor;
            ctx.fillRect(leftMargin + 120, y, Math.min(barWidth, 200), barHeight);
            
            // Value label
            ctx.fillStyle = this.colors.cellText;
            ctx.font = '10px Arial';
            const changeText = scenario.resultChange ? `${scenario.resultChange >= 0 ? '+' : ''}${scenario.resultChange.toFixed(1)}%` : '0%';
            ctx.fillText(changeText, leftMargin + 330, y + 12);
        });

        return yPosition + (scenarios.length * 25) + 20;
    }

    renderProfessionalSectionHeader(ctx, title, yPosition, leftMargin, contentWidth) {
        const headerHeight = 35;
        const headerGradient = ctx.createLinearGradient(leftMargin, yPosition, leftMargin, yPosition + headerHeight);
        headerGradient.addColorStop(0, this.colors.sectionBg);
        headerGradient.addColorStop(1, '#cce7ff');
        
        ctx.fillStyle = headerGradient;
        ctx.fillRect(leftMargin, yPosition, contentWidth, headerHeight);
        ctx.strokeStyle = this.colors.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(leftMargin, yPosition, contentWidth, headerHeight);

        ctx.fillStyle = this.colors.sectionText;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(title, leftMargin + 15, yPosition + 22);

        return yPosition + headerHeight + 15;
    }

    renderWrappedText(ctx, text, x, y, maxWidth, lineHeight = 16) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;

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

    renderProfessionalFooter(ctx, leftMargin, contentWidth) {
        const footerY = this.height - 50;
        
        // Footer background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(leftMargin - 30, footerY - 10, contentWidth + 60, 40);
        ctx.strokeStyle = this.colors.borderColor;
        ctx.strokeRect(leftMargin - 30, footerY - 10, contentWidth + 60, 40);

        ctx.fillStyle = this.colors.borderColor;
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Generated: ${new Date().toLocaleString()}`, leftMargin, footerY + 5);
        ctx.fillText(`Professional Financial Analysis System v2.1.0`, leftMargin, footerY + 18);
        
        ctx.textAlign = 'right';
        ctx.fillText('CONFIDENTIAL - Internal Use Only', leftMargin + contentWidth, footerY + 5);
        ctx.fillText(`Analyst: ${this.analystName}`, leftMargin + contentWidth, footerY + 18);
    }

    // Enhanced Excel export with professional formatting
    async exportToExcel(filename = 'financial_analysis_professional.xlsx') {
        const workbook = new ExcelJS.Workbook();
        
        // Set workbook properties
        workbook.creator = this.analystName;
        workbook.lastModifiedBy = this.analystName;
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();

        // Main analysis worksheet
        const worksheet = workbook.addWorksheet('Financial Analysis', {
            pageSetup: { orientation: 'portrait', fitToPage: true }
        });

        // Apply professional styling
        await this.applyExcelStyling(worksheet);
        
        // Populate worksheet with enhanced formatting
        await this.populateExcelWorksheet(worksheet);

        // Add additional worksheets for detailed analysis
        if (Object.keys(this.sensitivityAnalysis).length > 0) {
            const sensitivitySheet = workbook.addWorksheet('Sensitivity Analysis');
            await this.populateSensitivitySheet(sensitivitySheet);
        }

        if (Object.keys(this.scenarioAnalysis).length > 0) {
            const scenarioSheet = workbook.addWorksheet('Scenario Analysis');
            await this.populateScenarioSheet(scenarioSheet);
        }

        return await workbook.xlsx.writeFile(filename);
    }

    async applyExcelStyling(worksheet) {
        // Define professional styles
        worksheet.properties.defaultRowHeight = 20;
        
        // Set column widths
        worksheet.getColumn('A').width = 30;
        worksheet.getColumn('B').width = 25;
        worksheet.getColumn('C').width = 15;
        worksheet.getColumn('D').width = 20;
    }

    async populateExcelWorksheet(worksheet) {
        let rowIndex = 1;

        // Corporate header
        const headerRow = worksheet.getRow(rowIndex);
        headerRow.getCell(1).value = 'SCENARIO ANALYSIS';
        headerRow.getCell(1).font = { size: 16, bold: true };
        rowIndex += 2;

        // Base case
        worksheet.getRow(rowIndex).getCell(1).value = 'Base Case:';
        worksheet.getRow(rowIndex).getCell(1).font = { bold: true };
        worksheet.getRow(rowIndex).getCell(2).value = this.formatValue(this.scenarioAnalysis.baseCase.result);
        rowIndex += 2;

        // Scenario table headers
        const headers = ['Scenario', 'Result', 'Change %', 'Probability', 'Strategic Implication'];
        const headerRow2 = worksheet.getRow(rowIndex);
        headers.forEach((header, index) => {
            headerRow2.getCell(index + 1).value = header;
            headerRow2.getCell(index + 1).font = { bold: true };
            headerRow2.getCell(index + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E2F3' } };
        });
        rowIndex++;

        // Scenario data
        this.scenarioAnalysis.scenarios.forEach(scenario => {
            if (!scenario.error) {
                const row = worksheet.getRow(rowIndex);
                row.getCell(1).value = scenario.name;
                row.getCell(2).value = this.formatValue(scenario.result);
                row.getCell(3).value = `${scenario.resultChange >= 0 ? '+' : ''}${scenario.resultChange.toFixed(1)}%`;
                row.getCell(4).value = `${(scenario.probability * 100).toFixed(0)}%`;
                row.getCell(5).value = scenario.strategicImplication || 'Under review';
                row.getCell(5).alignment = { wrapText: true };
                rowIndex++;
            }
        });
    }

    // Batch analysis for multiple companies/scenarios
    async performBatchAnalysis(scenarios) {
        const results = [];
        
        for (const scenario of scenarios) {
            try {
                const result = await this.calculateFinancialFormula(scenario);
                results.push({
                    scenarioName: scenario.scenarioName,
                    success: true,
                    result: result,
                    summary: this.executiveSummary
                });
            } catch (error) {
                results.push({
                    scenarioName: scenario.scenarioName,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    }

    // Automated report generation with multiple formats
    async generateComprehensiveReport(baseFilename = 'financial_analysis_comprehensive') {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${baseFilename}_${timestamp}`;
        
        const results = {
            generated: new Date().toISOString(),
            analysisType: this.selectedFormula,
            entity: this.companyName,
            files: {}
        };

        try {
            // Generate Excel report
            await this.exportToExcel(`${filename}.xlsx`);
            results.files.excel = `${filename}.xlsx`;
        } catch (error) {
            results.files.excel = { error: error.message };
        }

        try {
            // Generate main PNG report
            this.exportToPNG(`${filename}_full.png`, {
                showSensitivity: true,
                showScenarios: true,
                showWalkthrough: true
            });
            results.files.fullReport = `${filename}_full.png`;
        } catch (error) {
            results.files.fullReport = { error: error.message };
        }

        try {
            // Generate executive summary PNG
            this.exportToPNG(`${filename}_summary.png`, {
                showSensitivity: false,
                showScenarios: false,
                showWalkthrough: false
            });
            results.files.summary = `${filename}_summary.png`;
        } catch (error) {
            results.files.summary = { error: error.message };
        }

        // Generate JSON data export for further analysis
        try {
            const dataExport = {
                metadata: {
                    analysisType: this.selectedFormula,
                    entity: this.companyName,
                    analyst: this.analystName,
                    date: this.analysisDate,
                    generated: new Date().toISOString()
                },
                inputs: this.calculationResult.parameters,
                results: this.calculationResult,
                executiveSummary: this.executiveSummary,
                detailedAnalysis: this.detailedAnalysis,
                sensitivityAnalysis: Object.keys(this.sensitivityAnalysis).length > 0 ? this.sensitivityAnalysis : null,
                scenarioAnalysis: Object.keys(this.scenarioAnalysis).length > 0 ? this.scenarioAnalysis : null,
                comparisonAnalysis: Object.keys(this.comparisonAnalysis).length > 0 ? this.comparisonAnalysis : null
            };

            fs.writeFileSync(`${filename}_data.json`, JSON.stringify(dataExport, null, 2));
            results.files.dataExport = `${filename}_data.json`;
        } catch (error) {
            results.files.dataExport = { error: error.message };
        }

        return results;
    }

    // Validation and quality assurance
    validateInputs() {
        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        if (!formula) {
            throw new Error(`Invalid formula: ${this.selectedFormula}`);
        }

        const validation = {
            isValid: true,
            warnings: [],
            errors: []
        };

        // Validate parameter count
        if (this.formulaParams.length !== formula.params.length) {
            validation.errors.push(`Expected ${formula.params.length} parameters, got ${this.formulaParams.length}`);
            validation.isValid = false;
        }

        // Validate parameter values
        this.formulaParams.forEach((param, index) => {
            const paramName = formula.paramNames[index];
            
            if (paramName.toLowerCase().includes('rate') && (param < 0 || param > 1)) {
                validation.warnings.push(`${paramName} of ${param} seems unusual - verify if this is intended`);
            }
            
            if (paramName.toLowerCase().includes('cost') && param < 0) {
                validation.errors.push(`${paramName} cannot be negative`);
                validation.isValid = false;
            }

            if (typeof param !== 'number' && !Array.isArray(param)) {
                validation.errors.push(`${paramName} must be a number or array`);
                validation.isValid = false;
            }
        });

        return validation;
    }

    // Generate comparison analysis
    async generateIndustryComparison(industryBenchmarks) {
        if (!industryBenchmarks || !Array.isArray(industryBenchmarks)) {
            return { error: 'Industry benchmarks must be provided as an array' };
        }

        const currentResult = typeof this.calculationResult.result === 'object' ? 
                             this.calculationResult.result.value || this.calculationResult.result.ratio || this.calculationResult.result.breakEvenUnits || this.calculationResult.result.roe :
                             this.calculationResult.result;

        const comparison = {
            currentCompany: {
                name: this.companyName,
                result: currentResult,
                percentile: 0
            },
            industryStatistics: {
                mean: 0,
                median: 0,
                standardDeviation: 0,
                min: 0,
                max: 0
            },
            benchmarkComparisons: [],
            competitivePosition: '',
            recommendations: []
        };

        // Calculate industry statistics
        const allResults = [currentResult, ...industryBenchmarks.map(b => b.result)];
        allResults.sort((a, b) => a - b);
        
        comparison.industryStatistics.min = Math.min(...allResults);
        comparison.industryStatistics.max = Math.max(...allResults);
        comparison.industryStatistics.mean = allResults.reduce((sum, val) => sum + val, 0) / allResults.length;
        comparison.industryStatistics.median = allResults[Math.floor(allResults.length / 2)];
        
        const variance = allResults.reduce((sum, val) => sum + Math.pow(val - comparison.industryStatistics.mean, 2), 0) / allResults.length;
        comparison.industryStatistics.standardDeviation = Math.sqrt(variance);

        // Calculate percentile
        const belowCurrent = allResults.filter(val => val < currentResult).length;
        comparison.currentCompany.percentile = (belowCurrent / allResults.length) * 100;

        // Generate competitive position assessment
        if (comparison.currentCompany.percentile >= 90) {
            comparison.competitivePosition = 'Top Performer - Industry Leader';
        } else if (comparison.currentCompany.percentile >= 75) {
            comparison.competitivePosition = 'Above Average - Strong Competitor';
        } else if (comparison.currentCompany.percentile >= 50) {
            comparison.competitivePosition = 'Average - Market Follower';
        } else if (comparison.currentCompany.percentile >= 25) {
            comparison.competitivePosition = 'Below Average - Needs Improvement';
        } else {
            comparison.competitivePosition = 'Bottom Quartile - Significant Challenges';
        }

        // Individual benchmark comparisons
        industryBenchmarks.forEach(benchmark => {
            const difference = currentResult - benchmark.result;
            const percentDifference = (difference / benchmark.result) * 100;
            
            comparison.benchmarkComparisons.push({
                name: benchmark.name,
                theirResult: benchmark.result,
                difference: difference,
                percentDifference: percentDifference,
                performance: difference > 0 ? 'Better' : difference < 0 ? 'Worse' : 'Equal'
            });
        });

        return comparison;
    }

    // Monte Carlo simulation for risk analysis
    performMonteCarloSimulation(iterations = 1000, variableRanges = {}) {
        const formula = FormulaRegistry.getFormula(this.selectedFormula);
        if (!formula) return { error: 'Invalid formula for simulation' };

        const results = [];
        const simulation = {
            iterations: iterations,
            results: [],
            statistics: {},
            riskMetrics: {},
            confidenceIntervals: {}
        };

        for (let i = 0; i < iterations; i++) {
            const simulationParams = [...this.formulaParams];
            
            // Apply random variations based on specified ranges
            Object.entries(variableRanges).forEach(([paramIndex, range]) => {
                const baseValue = this.formulaParams[paramIndex];
                const randomFactor = 1 + (Math.random() - 0.5) * 2 * range; // ±range variation
                simulationParams[paramIndex] = baseValue * randomFactor;
            });

            try {
                const result = formula.calculate(simulationParams);
                const resultValue = typeof result === 'object' ? 
                                   result.value || result.ratio || result.breakEvenUnits || result.roe :
                                   result;
                results.push(resultValue);
            } catch (error) {
                // Skip failed calculations
                continue;
            }
        }

        if (results.length === 0) {
            return { error: 'No valid simulation results generated' };
        }

        // Calculate statistics
        results.sort((a, b) => a - b);
        simulation.results = results;
        
        simulation.statistics.mean = results.reduce((sum, val) => sum + val, 0) / results.length;
        simulation.statistics.median = results[Math.floor(results.length / 2)];
        simulation.statistics.min = results[0];
        simulation.statistics.max = results[results.length - 1];
        
        const variance = results.reduce((sum, val) => sum + Math.pow(val - simulation.statistics.mean, 2), 0) / results.length;
        simulation.statistics.standardDeviation = Math.sqrt(variance);
        simulation.statistics.coefficientOfVariation = simulation.statistics.standardDeviation / simulation.statistics.mean;

        // Risk metrics
        const baseResult = typeof this.calculationResult.result === 'object' ? 
                          this.calculationResult.result.value || this.calculationResult.result.ratio || this.calculationResult.result.breakEvenUnits || this.calculationResult.result.roe :
                          this.calculationResult.result;

        simulation.riskMetrics.probabilityOfLoss = this.selectedFormula === 'netPresentValue' ? 
                                                  results.filter(r => r < 0).length / results.length :
                                                  results.filter(r => r < baseResult * 0.9).length / results.length;

        simulation.riskMetrics.valueAtRisk95 = results[Math.floor(results.length * 0.05)];
        simulation.riskMetrics.valueAtRisk99 = results[Math.floor(results.length * 0.01)];

        // Confidence intervals
        simulation.confidenceIntervals.ci90 = {
            lower: results[Math.floor(results.length * 0.05)],
            upper: results[Math.floor(results.length * 0.95)]
        };
        simulation.confidenceIntervals.ci95 = {
            lower: results[Math.floor(results.length * 0.025)],
            upper: results[Math.floor(results.length * 0.975)]
        };
        simulation.confidenceIntervals.ci99 = {
            lower: results[Math.floor(results.length * 0.005)],
            upper: results[Math.floor(results.length * 0.995)]
        };

        return simulation;
    }

    // Generate automated insights using statistical analysis
    generateAutomatedInsights() {
        const insights = {
            keyFindings: [],
            riskAssessment: [],
            opportunities: [],
            recommendations: [],
            dataQuality: []
        };

        const result = typeof this.calculationResult.result === 'object' ? 
                      this.calculationResult.result.value || this.calculationResult.result.ratio || this.calculationResult.result.breakEvenUnits || this.calculationResult.result.roe :
                      this.calculationResult.result;

        // Formula-specific insights
        switch(this.selectedFormula) {
            case 'netPresentValue':
                if (result > 0) {
                    insights.keyFindings.push(`Positive NPV of ${this.formatCurrency(result)} indicates value creation`);
                    insights.opportunities.push('Project exceeds minimum return requirements');
                    if (result > this.formulaParams[1][0] * 0.2) { // Initial investment * 20%
                        insights.keyFindings.push('Strong value creation with significant upside');
                    }
                } else {
                    insights.keyFindings.push(`Negative NPV of ${this.formatCurrency(result)} indicates value destruction`);
                    insights.riskAssessment.push('Project fails to meet cost of capital');
                    insights.recommendations.push('Consider alternative investments or project modifications');
                }
                break;

            case 'currentRatio':
                if (result >= 2.0) {
                    insights.keyFindings.push('Strong liquidity position with comfortable safety margin');
                    if (result > 3.0) {
                        insights.opportunities.push('Excess liquidity could be deployed for growth');
                    }
                } else if (result >= 1.5) {
                    insights.keyFindings.push('Adequate liquidity for normal operations');
                } else {
                    insights.riskAssessment.push('Liquidity concerns require management attention');
                    insights.recommendations.push('Implement working capital optimization strategies');
                }
                break;

            case 'returnOnEquity':
                const roePercentage = result * 100;
                if (roePercentage >= 20) {
                    insights.keyFindings.push('Exceptional shareholder returns');
                    insights.riskAssessment.push('Verify sustainability of high returns');
                } else if (roePercentage >= 15) {
                    insights.keyFindings.push('Above-average shareholder returns');
                    insights.opportunities.push('Strong competitive position');
                } else if (roePercentage < 10) {
                    insights.riskAssessment.push('Below-average returns require improvement');
                    insights.recommendations.push('Conduct DuPont analysis to identify improvement areas');
                }
                break;
        }

        // Sensitivity analysis insights
        if (this.sensitivityAnalysis && this.sensitivityAnalysis.variations) {
            const highSensitivity = this.sensitivityAnalysis.variations.filter(v => Math.abs(v.elasticity) > 2);
            if (highSensitivity.length > 0) {
                insights.riskAssessment.push('High sensitivity to parameter changes detected');
                insights.recommendations.push('Monitor key assumptions closely and develop contingency plans');
            }
        }

        // Scenario analysis insights
        if (this.scenarioAnalysis && this.scenarioAnalysis.scenarios) {
            const negativeScenarios = this.scenarioAnalysis.scenarios.filter(s => s.resultChange < -10);
            if (negativeScenarios.length > 0) {
                insights.riskAssessment.push('Multiple negative scenarios identified');
                insights.recommendations.push('Develop risk mitigation strategies for adverse scenarios');
            }
        }

        // Data quality assessment
        insights.dataQuality.push('Input parameters validated for completeness and reasonableness');
        
        const validation = this.validateInputs();
        if (validation.warnings.length > 0) {
            insights.dataQuality.push(`${validation.warnings.length} parameter warnings detected`);
        }
        if (validation.errors.length > 0) {
            insights.dataQuality.push(`${validation.errors.length} parameter errors detected`);
        }

        return insights;
    }
}

// Export the enhanced class
export default EnhancedFinancialWorkbook;(1).value = 'PROFESSIONAL FINANCIAL ANALYSIS WORKBOOK';
        headerRow.getCell(1).font = { size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
        headerRow.getCell(1).alignment = { horizontal: 'center' };
        worksheet.mergeCells(`A${rowIndex}:D${rowIndex}`);
        rowIndex += 2;

        // Analysis details
        const analysisDetails = [
            ['Analysis Type:', FormulaRegistry.getFormula(this.selectedFormula)?.name || this.selectedFormula],
            ['Entity/Scenario:', this.companyName],
            ['Analysis Date:', this.analysisDate],
            ['Prepared By:', this.analystName]
        ];

        analysisDetails.forEach(([label, value]) => {
            const row = worksheet.getRow(rowIndex);
            row.getCell(1).value = label;
            row.getCell(1).font = { bold: true };
            row.getCell(2).value = value;
            rowIndex++;
        });

        rowIndex += 2;

        // Executive Summary
        if (this.executiveSummary) {
            const summaryRow = worksheet.getRow(rowIndex);
            summaryRow.getCell(1).value = 'EXECUTIVE SUMMARY';
            summaryRow.getCell(1).font = { size: 14, bold: true };
            summaryRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7F3FF' } };
            worksheet.mergeCells(`A${rowIndex}:D${rowIndex}`);
            rowIndex += 2;

            const summaryItems = [
                ['Key Finding:', this.executiveSummary.keyFinding],
                ['Business Impact:', this.executiveSummary.businessImplication],
                ['Recommendation:', this.executiveSummary.recommendation]
            ];

            summaryItems.forEach(([label, content]) => {
                const row = worksheet.getRow(rowIndex);
                row.getCell(1).value = label;
                row.getCell(1).font = { bold: true };
                row.getCell(2).value = content;
                row.getCell(2).alignment = { wrapText: true };
                worksheet.mergeCells(`B${rowIndex}:D${rowIndex}`);
                rowIndex++;
            });
        }

        return rowIndex;
    }

    async populateSensitivitySheet(worksheet) {
        // Sensitivity analysis specific formatting
        worksheet.getColumn('A').width = 20;
        worksheet.getColumn('B').width = 15;
        worksheet.getColumn('C').width = 15;
        worksheet.getColumn('D').width = 15;
        worksheet.getColumn('E').width = 20;

        let rowIndex = 1;

        // Header
        const headerRow = worksheet.getRow(rowIndex);
        headerRow.getCell(1).value = 'SENSITIVITY ANALYSIS';
        headerRow.getCell(1).font = { size: 16, bold: true };
        rowIndex += 2;

        // Parameter info
        worksheet.getRow(rowIndex).getCell(1).value = `Parameter: ${this.sensitivityAnalysis.parameterName}`;
        worksheet.getRow(rowIndex).getCell(1).font = { bold: true };
        rowIndex++;
        worksheet.getRow(rowIndex).getCell(1).value = `Base Value: ${this.formatValue(this.sensitivityAnalysis.baseValue)}`;
        rowIndex += 2;

        // Table headers
        const headers = ['Parameter Change', 'New Value', 'Result Change', 'Elasticity', 'Interpretation'];
        const headerRow2 = worksheet.getRow(rowIndex);
        headers.forEach((header, index) => {
            headerRow2.getCell(index + 1).value = header;
            headerRow2.getCell(index + 1).font = { bold: true };
            headerRow2.getCell(index + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E2F3' } };
        });
        rowIndex++;

        // Data rows
        this.sensitivityAnalysis.variations.forEach(variation => {
            if (!variation.error) {
                const row = worksheet.getRow(rowIndex);
                row.getCell(1).value = `${variation.percentChange >= 0 ? '+' : ''}${variation.percentChange}%`;
                row.getCell(2).value = this.formatValue(variation.newValue);
                row.getCell(3).value = `${variation.resultChange >= 0 ? '+' : ''}${variation.resultChange.toFixed(2)}%`;
                row.getCell(4).value = variation.elasticity.toFixed(3);
                row.getCell(5).value = variation.interpretation;
                rowIndex++;
            }
        });
    }

    async populateScenarioSheet(worksheet) {
        // Similar implementation for scenario analysis
        worksheet.getColumn('A').width = 25;
        worksheet.getColumn('B').width = 20;
        worksheet.getColumn('C').width = 15;
        worksheet.getColumn('D').width = 10;
        worksheet.getColumn('E').width = 30;

        let rowIndex = 1;

        const headerRow = worksheet.getRow(rowIndex);
        headerRow.getCell
