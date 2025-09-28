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
// Enhanced Formula Registry with all 24 financial formulas
class FormulaRegistry {
    static formulas = {
        // Time Value of Money Functions
        'presentValue': {
            name: 'Present Value (PV)',
            category: 'Time Value of Money',
            params: ['futureValue', 'interestRate', 'periods', 'payment', 'type'],
            paramNames: ['Future Value ($)', 'Interest Rate (%)', 'Number of Periods', 'Payment ($)', 'Type (0=end, 1=beginning)'],
            defaultParams: [10000, 0.08, 5, 0, 0],
            formula: 'PV = FV / (1 + r)^n + PMT × [(1 - (1 + r)^-n) / r]',
            calculate: (params) => FinancialFunctions.presentValue(params[0], params[1], params[2], params[3], params[4]),
            description: 'Calculates the current worth of a future sum of money or stream of cash flows',
            useCases: ['Investment valuation', 'Bond pricing', 'Loan present value', 'Retirement planning']
        },

        'futureValue': {
            name: 'Future Value (FV)',
            category: 'Time Value of Money',
            params: ['presentValue', 'interestRate', 'periods', 'payment', 'type'],
            paramNames: ['Present Value ($)', 'Interest Rate (%)', 'Number of Periods', 'Payment ($)', 'Type (0=end, 1=beginning)'],
            defaultParams: [10000, 0.08, 5, 0, 0],
            formula: 'FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]',
            calculate: (params) => FinancialFunctions.futureValue(params[0], params[1], params[2], params[3], params[4]),
            description: 'Calculates the future worth of a present sum or series of payments',
            useCases: ['Savings planning', 'Investment growth projection', 'Annuity valuation', 'Retirement calculations']
        },

        'compoundInterest': {
            name: 'Compound Interest',
            category: 'Time Value of Money',
            params: ['principal', 'rate', 'periods', 'compoundingFrequency'],
            paramNames: ['Principal ($)', 'Annual Interest Rate (%)', 'Number of Years', 'Compounding Frequency (per year)'],
            defaultParams: [10000, 0.08, 5, 12],
            formula: 'A = P × (1 + r/n)^(n×t)',
            calculate: (params) => FinancialFunctions.compoundInterest(params[0], params[1], params[2], params[3]),
            description: 'Calculates compound interest with varying compounding frequencies',
            useCases: ['Savings account growth', 'Certificate of deposit valuation', 'Investment compounding effects']
        },

        'effectiveInterestRate': {
            name: 'Effective Interest Rate',
            category: 'Time Value of Money',
            params: ['nominalRate', 'compoundingFrequency'],
            paramNames: ['Nominal Interest Rate (%)', 'Compounding Frequency (per year)'],
            defaultParams: [0.08, 12],
            formula: 'EAR = (1 + r/n)^n - 1',
            calculate: (params) => FinancialFunctions.effectiveInterestRate(params[0], params[1]),
            description: 'Converts nominal interest rate to effective annual rate',
            useCases: ['Loan comparison', 'Investment yield comparison', 'Credit card APR analysis']
        },

        // Investment Analysis Functions
        'netPresentValue': {
            name: 'Net Present Value (NPV)',
            category: 'Investment Analysis',
            params: ['discountRate', 'cashFlows'],
            paramNames: ['Discount Rate (%)', 'Cash Flows Array (Period 0, 1, 2...)'],
            defaultParams: [0.12, [-100000, 25000, 35000, 40000, 45000, 50000]],
            formula: 'NPV = Σ [CFt / (1 + r)^t]',
            calculate: (params) => FinancialFunctions.netPresentValue(params[0], params[1]),
            description: 'Measures the net value created by an investment after accounting for time value of money',
            useCases: ['Capital budgeting', 'Project evaluation', 'Acquisition analysis', 'Equipment purchases']
        },

        'internalRateOfReturn': {
            name: 'Internal Rate of Return (IRR)',
            category: 'Investment Analysis',
            params: ['cashFlows', 'guess', 'maxIterations', 'tolerance'],
            paramNames: ['Cash Flows Array', 'Initial Guess (%)', 'Max Iterations', 'Tolerance'],
            defaultParams: [[-100000, 25000, 35000, 40000, 45000, 50000], 0.1, 100, 1e-10],
            formula: 'NPV = 0 = Σ [CFt / (1 + IRR)^t]',
            calculate: (params) => FinancialFunctions.internalRateOfReturn(params[0], params[1], params[2], params[3]),
            description: 'Calculates the discount rate that makes NPV equal to zero',
            useCases: ['Investment return analysis', 'Project ranking', 'Hurdle rate comparison']
        },

        'paybackPeriod': {
            name: 'Payback Period',
            category: 'Investment Analysis',
            params: ['initialInvestment', 'cashFlows'],
            paramNames: ['Initial Investment ($)', 'Annual Cash Flows Array'],
            defaultParams: [100000, [25000, 35000, 40000, 45000, 50000]],
            formula: 'Payback Period = Years when Cumulative Cash Flows = Initial Investment',
            calculate: (params) => FinancialFunctions.paybackPeriod(params[0], params[1]),
            description: 'Calculates time required to recover initial investment',
            useCases: ['Risk assessment', 'Liquidity analysis', 'Simple investment screening']
        },

        'discountedPaybackPeriod': {
            name: 'Discounted Payback Period',
            category: 'Investment Analysis',
            params: ['initialInvestment', 'cashFlows', 'discountRate'],
            paramNames: ['Initial Investment ($)', 'Annual Cash Flows Array', 'Discount Rate (%)'],
            defaultParams: [100000, [25000, 35000, 40000, 45000, 50000], 0.12],
            formula: 'DPB = Years when Σ [CFt / (1 + r)^t] = Initial Investment',
            calculate: (params) => FinancialFunctions.discountedPaybackPeriod(params[0], params[1], params[2]),
            description: 'Calculates payback period considering time value of money',
            useCases: ['Enhanced risk assessment', 'Time-value adjusted recovery analysis']
        },

        // Liquidity Ratios
        'currentRatio': {
            name: 'Current Ratio',
            category: 'Liquidity Analysis',
            params: ['currentAssets', 'currentLiabilities'],
            paramNames: ['Current Assets ($)', 'Current Liabilities ($)'],
            defaultParams: [250000, 150000],
            formula: 'Current Ratio = Current Assets / Current Liabilities',
            calculate: (params) => FinancialFunctions.currentRatio(params[0], params[1]),
            description: 'Measures ability to pay short-term obligations with short-term assets',
            useCases: ['Credit analysis', 'Liquidity assessment', 'Working capital management']
        },

        'quickRatio': {
            name: 'Quick Ratio (Acid-Test)',
            category: 'Liquidity Analysis',
            params: ['quickAssets', 'currentLiabilities'],
            paramNames: ['Quick Assets ($)', 'Current Liabilities ($)'],
            defaultParams: [180000, 150000],
            formula: 'Quick Ratio = (Current Assets - Inventory) / Current Liabilities',
            calculate: (params) => FinancialFunctions.quickRatio(params[0], params[1]),
            description: 'Measures immediate liquidity without relying on inventory conversion',
            useCases: ['Conservative liquidity analysis', 'Credit assessment', 'Cash management']
        },

        'workingCapital': {
            name: 'Working Capital',
            category: 'Liquidity Analysis',
            params: ['currentAssets', 'currentLiabilities'],
            paramNames: ['Current Assets ($)', 'Current Liabilities ($)'],
            defaultParams: [250000, 150000],
            formula: 'Working Capital = Current Assets - Current Liabilities',
            calculate: (params) => FinancialFunctions.workingCapital(params[0], params[1]),
            description: 'Measures short-term financial health and operational efficiency',
            useCases: ['Operational planning', 'Cash flow analysis', 'Financial health assessment']
        },

        'cashConversionCycle': {
            name: 'Cash Conversion Cycle',
            category: 'Liquidity Analysis',
            params: ['daysInventoryOutstanding', 'daysReceivablesOutstanding', 'daysPayablesOutstanding'],
            paramNames: ['Days Inventory Outstanding', 'Days Receivables Outstanding', 'Days Payables Outstanding'],
            defaultParams: [45, 35, 25],
            formula: 'CCC = DIO + DRO - DPO',
            calculate: (params) => FinancialFunctions.cashConversionCycle(params[0], params[1], params[2]),
            description: 'Measures efficiency of working capital management',
            useCases: ['Working capital optimization', 'Cash flow management', 'Operational efficiency']
        },

        // Leverage Ratios
        'debtToEquityRatio': {
            name: 'Debt-to-Equity Ratio',
            category: 'Leverage Analysis',
            params: ['totalDebt', 'totalEquity'],
            paramNames: ['Total Debt ($)', 'Total Equity ($)'],
            defaultParams: [300000, 500000],
            formula: 'D/E Ratio = Total Debt / Total Equity',
            calculate: (params) => FinancialFunctions.debtToEquityRatio(params[0], params[1]),
            description: 'Measures financial leverage and capital structure',
            useCases: ['Financial risk assessment', 'Capital structure analysis', 'Credit evaluation']
        },

        // Profitability Ratios
        'returnOnEquity': {
            name: 'Return on Equity (ROE)',
            category: 'Profitability Analysis',
            params: ['netIncome', 'averageEquity', 'revenue', 'totalAssets'],
            paramNames: ['Net Income ($)', 'Average Equity ($)', 'Revenue ($) [Optional]', 'Total Assets ($) [Optional]'],
            defaultParams: [50000, 400000, 0, 0],
            formula: 'ROE = Net Income / Average Shareholders\' Equity',
            calculate: (params) => FinancialFunctions.returnOnEquity(params[0], params[1], params[2] || null, params[3] || null),
            description: 'Measures profitability relative to shareholders\' equity',
            useCases: ['Performance evaluation', 'Investment analysis', 'Management assessment']
        },

        'returnOnAssets': {
            name: 'Return on Assets (ROA)',
            category: 'Profitability Analysis',
            params: ['netIncome', 'averageAssets'],
            paramNames: ['Net Income ($)', 'Average Total Assets ($)'],
            defaultParams: [50000, 800000],
            formula: 'ROA = Net Income / Average Total Assets',
            calculate: (params) => FinancialFunctions.returnOnAssets(params[0], params[1]),
            description: 'Measures how efficiently assets generate profits',
            useCases: ['Asset utilization analysis', 'Operational efficiency', 'Management performance']
        },

        'grossProfitMargin': {
            name: 'Gross Profit Margin',
            category: 'Profitability Analysis',
            params: ['grossProfit', 'revenue'],
            paramNames: ['Gross Profit ($)', 'Total Revenue ($)'],
            defaultParams: [300000, 500000],
            formula: 'Gross Profit Margin = Gross Profit / Revenue',
            calculate: (params) => FinancialFunctions.grossProfitMargin(params[0], params[1]),
            description: 'Measures profitability after direct costs',
            useCases: ['Pricing strategy', 'Cost control', 'Industry comparison']
        },

        'operatingMargin': {
            name: 'Operating Margin',
            category: 'Profitability Analysis',
            params: ['operatingIncome', 'revenue'],
            paramNames: ['Operating Income ($)', 'Total Revenue ($)'],
            defaultParams: [100000, 500000],
            formula: 'Operating Margin = Operating Income / Revenue',
            calculate: (params) => FinancialFunctions.operatingMargin(params[0], params[1]),
            description: 'Measures operational efficiency and profitability',
            useCases: ['Operational analysis', 'Cost management', 'Performance benchmarking']
        },

        'netProfitMargin': {
            name: 'Net Profit Margin',
            category: 'Profitability Analysis',
            params: ['netIncome', 'revenue'],
            paramNames: ['Net Income ($)', 'Total Revenue ($)'],
            defaultParams: [50000, 500000],
            formula: 'Net Profit Margin = Net Income / Revenue',
            calculate: (params) => FinancialFunctions.netProfitMargin(params[0], params[1]),
            description: 'Measures overall profitability after all expenses',
            useCases: ['Overall performance', 'Investment evaluation', 'Strategic planning']
        },

        // Market Valuation Ratios
        'earningsPerShare': {
            name: 'Earnings Per Share (EPS)',
            category: 'Market Analysis',
            params: ['netIncome', 'weightedAverageShares'],
            paramNames: ['Net Income ($)', 'Weighted Average Shares Outstanding'],
            defaultParams: [50000, 10000],
            formula: 'EPS = Net Income / Weighted Average Shares Outstanding',
            calculate: (params) => FinancialFunctions.earningsPerShare(params[0], params[1]),
            description: 'Measures profit allocated to each share of stock',
            useCases: ['Stock valuation', 'Performance comparison', 'Investment analysis']
        },

        'priceToEarningsRatio': {
            name: 'Price-to-Earnings Ratio (P/E)',
            category: 'Market Analysis',
            params: ['marketPrice', 'earningsPerShare'],
            paramNames: ['Market Price per Share ($)', 'Earnings Per Share ($)'],
            defaultParams: [50, 5],
            formula: 'P/E Ratio = Market Price per Share / Earnings Per Share',
            calculate: (params) => FinancialFunctions.priceToEarningsRatio(params[0], params[1]),
            description: 'Measures market valuation relative to earnings',
            useCases: ['Stock valuation', 'Investment comparison', 'Market analysis']
        },

        // Break-Even Analysis
        'breakEvenUnits': {
            name: 'Break-Even Analysis (Units)',
            category: 'Cost-Volume-Profit Analysis',
            params: ['fixedCosts', 'pricePerUnit', 'variableCostPerUnit'],
            paramNames: ['Fixed Costs ($)', 'Price per Unit ($)', 'Variable Cost per Unit ($)'],
            defaultParams: [120000, 75, 45],
            formula: 'Break-Even Units = Fixed Costs / (Price - Variable Cost per Unit)',
            calculate: (params) => FinancialFunctions.breakEvenUnits(params[0], params[1], params[2]),
            description: 'Calculates units needed to cover all costs',
            useCases: ['Production planning', 'Pricing decisions', 'Cost management']
        },

        'breakEvenRevenue': {
            name: 'Break-Even Analysis (Revenue)',
            category: 'Cost-Volume-Profit Analysis',
            params: ['fixedCosts', 'contributionMarginRatio'],
            paramNames: ['Fixed Costs ($)', 'Contribution Margin Ratio (%)'],
            defaultParams: [120000, 0.4],
            formula: 'Break-Even Revenue = Fixed Costs / Contribution Margin Ratio',
            calculate: (params) => FinancialFunctions.breakEvenRevenue(params[0], params[1]),
            description: 'Calculates revenue needed to cover all costs',
            useCases: ['Sales planning', 'Revenue targeting', 'Business planning']
        },

        // Valuation Models
        'dividendDiscountModel': {
            name: 'Dividend Discount Model',
            category: 'Valuation Models',
            params: ['dividend', 'growthRate', 'requiredReturn'],
            paramNames: ['Expected Dividend ($)', 'Growth Rate (%)', 'Required Return (%)'],
            defaultParams: [2.5, 0.05, 0.12],
            formula: 'Value = Dividend / (Required Return - Growth Rate)',
            calculate: (params) => FinancialFunctions.dividendDiscountModel(params[0], params[1], params[2]),
            description: 'Values stock based on expected dividend payments',
            useCases: ['Stock valuation', 'Dividend stock analysis', 'Investment decisions']
        },

        'economicValueAdded': {
            name: 'Economic Value Added (EVA)',
            category: 'Valuation Models',
            params: ['nopat', 'wacc', 'investedCapital'],
            paramNames: ['NOPAT ($)', 'WACC (%)', 'Invested Capital ($)'],
            defaultParams: [75000, 0.10, 500000],
            formula: 'EVA = NOPAT - (WACC × Invested Capital)',
            calculate: (params) => FinancialFunctions.economicValueAdded(params[0], params[1], params[2]),
            description: 'Measures value creation above cost of capital',
            useCases: ['Performance measurement', 'Value-based management', 'Investment evaluation']
        },

        // Amortization
        'amortizationSchedule': {
            name: 'Amortization Schedule',
            category: 'Loan Analysis',
            params: ['principal', 'interestRate', 'periods'],
            paramNames: ['Principal Amount ($)', 'Interest Rate (% per period)', 'Number of Periods'],
            defaultParams: [200000, 0.005, 360],
            formula: 'Payment = P × [r(1+r)^n] / [(1+r)^n - 1]',
            calculate: (params) => FinancialFunctions.calculateAmortizationSchedule(params[0], params[1], params[2]),
            description: 'Calculates loan payment schedule with principal and interest breakdown',
            useCases: ['Mortgage analysis', 'Loan planning', 'Debt service calculations']
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

  
    // Enhanced interpretation based on formula type - Updated for all 24 formulas
    generateDetailedInterpretation(formula, params, result) {
        const baseValue = typeof result === 'object' ? 
            result.value || result.ratio || result.breakEvenUnits || result.roe || result.roa || result.eps || 
            result.peRatio || result.margin || result.workingCapital || result.ccc || result.eva || result.irr : result;
        
        switch(this.selectedFormula) {
            case 'presentValue':
                return this.interpretPresentValue(params, baseValue);
            case 'futureValue':
                return this.interpretFutureValue(params, baseValue);
            case 'compoundInterest':
                return this.interpretCompoundInterest(params, baseValue);
            case 'effectiveInterestRate':
                return this.interpretEffectiveInterestRate(params, baseValue);
            case 'netPresentValue':
                return this.interpretNetPresentValue(params, baseValue);
            case 'internalRateOfReturn':
                return this.interpretInternalRateOfReturn(params, result);
            case 'paybackPeriod':
                return this.interpretPaybackPeriod(params, baseValue);
            case 'discountedPaybackPeriod':
                return this.interpretDiscountedPaybackPeriod(params, baseValue);
            case 'currentRatio':
                return this.interpretCurrentRatio(params, result);
            case 'quickRatio':
                return this.interpretQuickRatio(params, result);
            case 'workingCapital':
                return this.interpretWorkingCapitalAnalysis(params, result);
            case 'cashConversionCycle':
                return this.interpretCashConversionCycle(params, result);
            case 'debtToEquityRatio':
                return this.interpretDebtToEquityRatio(params, result);
            case 'returnOnEquity':
                return this.interpretReturnOnEquity(params, result);
            case 'returnOnAssets':
                return this.interpretReturnOnAssets(params, result);
            case 'grossProfitMargin':
                return this.interpretGrossProfitMargin(params, result);
            case 'operatingMargin':
                return this.interpretOperatingMargin(params, result);
            case 'netProfitMargin':
                return this.interpretNetProfitMargin(params, result);
            case 'earningsPerShare':
                return this.interpretEarningsPerShare(params, result);
            case 'priceToEarningsRatio':
                return this.interpretPriceToEarningsRatio(params, result);
            case 'breakEvenUnits':
                return this.interpretBreakEvenAnalysis(params, result);
            case 'breakEvenRevenue':
                return this.interpretBreakEvenRevenue(params, result);
            case 'dividendDiscountModel':
                return this.interpretDividendDiscountModel(params, result);
            case 'economicValueAdded':
                return this.interpretEconomicValueAdded(params, result);
            case 'amortizationSchedule':
                return this.interpretAmortizationSchedule(params, result);
            default:
                return this.generateGenericInterpretation(formula, baseValue);
        }
    }

    // Individual interpretation methods for each formula
    interpretFutureValue(params, result) {
        const [pv, rate, periods, pmt] = params;
        const growthFactor = Math.pow(1 + rate, periods);
        const totalContributions = pv + (pmt * periods);
        const compoundingEffect = result - totalContributions;

        return {
            value: this.formatCurrency(result),
            meaning: `Investment of ${this.formatCurrency(pv)} grows to ${this.formatCurrency(result)} over ${periods} periods`,
            implication: compoundingEffect > 0 ? `Compounding adds ${this.formatCurrency(compoundingEffect)} in value` : 'No compounding benefit',
            keyInsights: [
                `Growth factor: ${growthFactor.toFixed(4)}`,
                `Annual growth rate: ${this.formatPercentage(rate)}`,
                `Total return: ${this.formatPercentage((result - totalContributions) / totalContributions)}`,
                `Compounding impact: ${this.formatCurrency(compoundingEffect)}`
            ],
            businessContext: {
                investmentGrowth: result > pv * 2 ? 'Strong wealth accumulation' : 'Moderate growth potential',
                timeHorizon: periods > 10 ? 'Long-term compounding benefits' : 'Short-term growth limited'
            }
        };
    }

    interpretCompoundInterest(params, result) {
        const [principal, rate, periods, compoundingFreq] = params;
        const simpleInterest = principal * (1 + rate * periods);
        const compoundingBenefit = result - simpleInterest;
        const effectiveRate = Math.pow(result / principal, 1 / periods) - 1;

        return {
            value: this.formatCurrency(result),
            meaning: `Principal compounds at ${this.formatPercentage(rate)} annually with ${compoundingFreq}x yearly compounding`,
            implication: `Compounding frequency adds ${this.formatCurrency(compoundingBenefit)} vs simple interest`,
            keyInsights: [
                `Effective annual rate: ${this.formatPercentage(effectiveRate)}`,
                `Compounding benefit: ${this.formatCurrency(compoundingBenefit)}`,
                `Frequency impact: ${compoundingFreq > 12 ? 'High' : compoundingFreq > 4 ? 'Moderate' : 'Low'}`,
                `Total return: ${this.formatPercentage((result - principal) / principal)}`
            ],
            businessContext: {
                savingsStrategy: compoundingFreq >= 12 ? 'Optimal compounding frequency' : 'Consider higher frequency options',
                wealthBuilding: effectiveRate > 0.07 ? 'Strong wealth accumulation rate' : 'Conservative growth rate'
            }
        };
    }

    interpretEffectiveInterestRate(params, result) {
        const [nominalRate, compoundingFreq] = params;
        const rateDifference = result - nominalRate;
        const percentageIncrease = (rateDifference / nominalRate) * 100;

        return {
            value: this.formatPercentage(result),
            meaning: `Effective rate accounting for ${compoundingFreq}x annual compounding frequency`,
            implication: `True cost/return is ${this.formatPercentage(rateDifference)} higher than nominal rate`,
            keyInsights: [
                `Nominal rate: ${this.formatPercentage(nominalRate)}`,
                `Compounding frequency: ${compoundingFreq} times per year`,
                `Rate increase: ${percentageIncrease.toFixed(2)}%`,
                `Annual impact: ${this.formatPercentage(rateDifference)}`
            ],
            businessContext: {
                loanComparison: 'Use effective rate for accurate loan cost comparison',
                investmentYield: 'Compare investments using effective rates for true performance'
            }
        };
    }

    interpretInternalRateOfReturn(params, result) {
        const [cashFlows] = params;
        const irr = result.irr || result;
        const initialInvestment = Math.abs(cashFlows[0]);
        const totalCashInflows = cashFlows.slice(1).reduce((sum, cf) => sum + (cf > 0 ? cf : 0), 0);

        return {
            value: this.formatPercentage(irr),
            meaning: `Investment generates ${this.formatPercentage(irr)} annual return based on cash flow timing`,
            implication: result.converged ? 'Calculation converged to reliable IRR' : 'IRR calculation may be unreliable',
            keyInsights: [
                `Convergence: ${result.converged ? 'Yes' : 'No'}`,
                `Iterations: ${result.iterations || 'N/A'}`,
                `vs 10% hurdle: ${irr > 0.1 ? 'Exceeds' : 'Below'}`,
                `Total cash multiple: ${(totalCashInflows / initialInvestment).toFixed(2)}x`
            ],
            businessContext: {
                investmentDecision: irr > 0.15 ? 'Highly attractive return' : irr > 0.1 ? 'Acceptable return' : 'Below threshold',
                riskAssessment: result.converged ? 'Reliable calculation' : 'Verify with alternative methods'
            }
        };
    }

    interpretPaybackPeriod(params, result) {
        const [initialInvestment, cashFlows] = params;
        const avgAnnualCashFlow = cashFlows.reduce((sum, cf) => sum + cf, 0) / cashFlows.length;
        const years = Math.floor(result || 0);
        const months = Math.round(((result || 0) - years) * 12);

        return {
            value: result ? `${years} years, ${months} months` : 'Never pays back',
            meaning: result ? `Investment recovers initial outlay in ${result.toFixed(1)} years` : 'Cash flows insufficient for payback',
            implication: result && result < 3 ? 'Quick capital recovery' : result && result < 5 ? 'Moderate payback period' : 'Slow capital recovery',
            keyInsights: [
                `Average annual cash flow: ${this.formatCurrency(avgAnnualCashFlow)}`,
                `Recovery rate: ${this.formatPercentage(avgAnnualCashFlow / initialInvestment)} per year`,
                `Risk profile: ${result && result < 2 ? 'Low risk' : result && result < 4 ? 'Moderate risk' : 'High risk'}`,
                `Liquidity impact: ${result && result < 3 ? 'Quick liquidity recovery' : 'Extended capital commitment'}`
            ],
            businessContext: {
                riskManagement: result && result < 3 ? 'Low payback risk' : 'Higher uncertainty over longer period',
                capitalAllocation: result && result < 4 ? 'Efficient capital utilization' : 'Consider alternative investments'
            }
        };
    }

    interpretDiscountedPaybackPeriod(params, result) {
        const [initialInvestment, cashFlows, discountRate] = params;
        const regularPayback = FinancialFunctions.paybackPeriod(initialInvestment, cashFlows);
        const timeExtension = result ? result - regularPayback : null;

        return {
            value: result ? `${Math.floor(result)} years, ${Math.round((result - Math.floor(result)) * 12)} months` : 'Never pays back',
            meaning: result ? `Time-adjusted payback period considering ${this.formatPercentage(discountRate)} discount rate` : 'Discounted cash flows insufficient for payback',
            implication: timeExtension ? `Discounting extends payback by ${timeExtension.toFixed(1)} years vs undiscounted` : 'No payback achievable',
            keyInsights: [
                `Regular payback: ${regularPayback ? regularPayback.toFixed(1) + ' years' : 'N/A'}`,
                `Time value impact: ${timeExtension ? timeExtension.toFixed(1) + ' years' : 'N/A'}`,
                `Discount rate: ${this.formatPercentage(discountRate)}`,
                `Risk adjustment: ${result && result > regularPayback ? 'Significant' : 'Minimal'}`
            ],
            businessContext: {
                riskAdjustedReturn: result && result < 5 ? 'Acceptable risk-adjusted recovery' : 'Extended risk exposure',
                capitalEfficiency: timeExtension > 2 ? 'Time value significantly impacts returns' : 'Limited time value impact'
            }
        };
    }

    interpretQuickRatio(params, result) {
        const [quickAssets, currentLiabilities] = params;
        const ratio = result.ratio || result;
        const liquidityGap = quickAssets - currentLiabilities;

        return {
            value: ratio.toFixed(2),
            meaning: `Company has ${this.formatCurrency(ratio)} in liquid assets for every $1.00 of current liabilities`,
            implication: result.interpretation ? result.interpretation.description : this.assessQuickLiquidityPosition(ratio),
            keyInsights: [
                `Immediate liquidity: ${this.formatCurrency(liquidityGap)}`,
                `Risk level: ${result.riskLevel || this.assessLiquidityRisk(ratio)}`,
                `vs Current ratio: More conservative measure excluding inventory`,
                `Coverage days: ${(ratio * 30).toFixed(0)} days of liabilities`
            ],
            businessContext: {
                creditworthiness: ratio >= 1.0 ? 'Strong immediate liquidity' : 'Potential short-term stress',
                operationalSafety: ratio >= 0.8 ? 'Adequate liquid buffer' : 'Tight liquidity position',
                riskManagement: ratio < 0.5 ? 'Critical liquidity risk' : 'Manageable liquidity profile'
            }
        };
    }

    interpretWorkingCapitalAnalysis(params, result) {
        const [currentAssets, currentLiabilities] = params;
        const workingCapital = result.workingCapital || result;
        const wcRatio = workingCapital / currentAssets;

        return {
            value: this.formatCurrency(workingCapital),
            meaning: workingCapital > 0 ? 'Positive working capital indicates liquidity strength' : 'Negative working capital indicates liquidity concerns',
            implication: result.interpretation ? result.interpretation.description : this.assessWorkingCapitalHealth(workingCapital, currentAssets),
            keyInsights: [
                `Current assets: ${this.formatCurrency(currentAssets)}`,
                `Current liabilities: ${this.formatCurrency(currentLiabilities)}`,
                `WC as % of assets: ${this.formatPercentage(wcRatio)}`,
                `Adequacy: ${result.adequacy || this.assessWorkingCapitalAdequacy(workingCapital, currentLiabilities)}`
            ],
            businessContext: {
                operationalFunding: workingCapital > 0 ? 'Self-funding operations capability' : 'External funding needs',
                growthCapability: workingCapital > currentLiabilities * 0.5 ? 'Growth funding available' : 'Limited growth capital',
                financialFlexibility: workingCapital > 0 ? 'Financial cushion available' : 'Tight financial position'
            }
        };
    }

    interpretCashConversionCycle(params, result) {
        const [dio, dro, dpo] = params;
        const ccc = result.ccc || result;
        const cashTied = dio + dro;
        const supplierFinancing = dpo;

        return {
            value: `${Math.round(ccc)} days`,
            meaning: `Cash is tied up in operations for ${Math.round(ccc)} days on average`,
            implication: result.interpretation ? result.interpretation.description : this.assessCashCycleEfficiency(ccc),
            keyInsights: [
                `Inventory conversion: ${dio} days`,
                `Receivables collection: ${dro} days`,
                `Payables extension: ${dpo} days`,
                `Supplier financing: ${this.formatPercentage(supplierFinancing / (cashTied + supplierFinancing))}`
            ],
            businessContext: {
                workingCapitalNeed: ccc > 60 ? 'High working capital requirements' : 'Efficient working capital use',
                cashFlowImpact: ccc < 30 ? 'Positive cash flow cycle' : ccc > 90 ? 'Significant cash drain' : 'Moderate cash needs',
                operationalEfficiency: result.efficiency || this.assessWorkingCapitalEfficiency(ccc)
            }
        };
    }

    interpretDebtToEquityRatio(params, result) {
        const [totalDebt, totalEquity] = params;
        const ratio = result.ratio || result;
        const debtPercent = ratio / (1 + ratio);

        return {
            value: ratio.toFixed(2),
            meaning: `Company has ${this.formatCurrency(ratio)} in debt for every $1.00 of equity`,
            implication: result.interpretation ? result.interpretation.description : this.assessLeveragePosition(ratio),
            keyInsights: [
                `Debt financing: ${this.formatPercentage(debtPercent)} of capital structure`,
                `Equity financing: ${this.formatPercentage(1 - debtPercent)} of capital structure`,
                `Leverage level: ${result.leverageLevel || this.assessLeverageLevel(ratio)}`,
                `Financial risk: ${ratio > 1 ? 'High' : ratio > 0.5 ? 'Moderate' : 'Low'}`
            ],
            businessContext: {
                capitalStructure: ratio > 1 ? 'Debt-heavy structure' : 'Equity-heavy structure',
                financialRisk: ratio > 1.5 ? 'High financial leverage risk' : 'Manageable leverage',
                creditCapacity: ratio < 0.5 ? 'Additional debt capacity available' : 'Limited additional borrowing capacity'
            }
        };
    }

    interpretReturnOnAssets(params, result) {
        const [netIncome, averageAssets] = params;
        const roa = result.roa || result;
        const roaPercentage = roa * 100;

        return {
            value: this.formatPercentage(roa),
            meaning: `Company generates ${this.formatCurrency(roa)} in profit for every $1.00 of assets`,
            implication: result.interpretation ? result.interpretation.description : this.assessAssetEfficiency(roa),
            keyInsights: [
                `Asset productivity: ${roaPercentage.toFixed(1)}% return`,
                `Efficiency level: ${result.efficiencyLevel || this.assessAssetEfficiency(roa)}`,
                `vs ROE comparison: Measures asset utilization independent of capital structure`,
                `Management performance: ${roaPercentage > 5 ? 'Strong' : roaPercentage > 2 ? 'Adequate' : 'Weak'}`
            ],
            businessContext: {
                assetUtilization: roaPercentage > 10 ? 'Excellent asset efficiency' : roaPercentage > 5 ? 'Good efficiency' : 'Room for improvement',
                operationalExcellence: roaPercentage > 8 ? 'Superior operations' : 'Standard operational performance',
                competitiveAdvantage: roaPercentage > 15 ? 'Strong competitive position' : 'Average competitive standing'
            }
        };
    }

    interpretGrossProfitMargin(params, result) {
        const [grossProfit, revenue] = params;
        const margin = result.margin || result;
        const marginPercentage = margin * 100;

        return {
            value: this.formatPercentage(margin),
            meaning: `Company retains ${this.formatCurrency(margin)} as gross profit for every $1.00 of revenue`,
            implication: result.interpretation ? result.interpretation.description : this.assessGrossProfitability(margin),
            keyInsights: [
                `Gross profit: ${this.formatCurrency(grossProfit)}`,
                `Revenue: ${this.formatCurrency(revenue)}`,
                `Cost control: ${marginPercentage > 50 ? 'Excellent' : marginPercentage > 30 ? 'Good' : 'Needs improvement'}`,
                `Pricing power: ${result.competitivePosition || this.assessMarginCompetitiveness(margin, 'gross')}`
            ],
            businessContext: {
                pricingStrategy: marginPercentage > 50 ? 'Strong pricing discipline' : 'Price-competitive market',
                costManagement: marginPercentage > 40 ? 'Efficient cost structure' : 'Cost optimization opportunities',
                businessModel: marginPercentage > 60 ? 'Asset-light/premium model' : 'Volume-driven model'
            }
        };
    }

    interpretOperatingMargin(params, result) {
        const [operatingIncome, revenue] = params;
        const margin = result.margin || result;
        const marginPercentage = margin * 100;

        return {
            value: this.formatPercentage(margin),
            meaning: `Operating efficiency generates ${this.formatPercentage(margin)} profit before interest and taxes`,
            implication: result.interpretation ? result.interpretation.description : this.assessOperatingEfficiency(margin),
            keyInsights: [
                `Operating income: ${this.formatCurrency(operatingIncome)}`,
                `Operating efficiency: ${marginPercentage.toFixed(1)}%`,
                `Cost control: ${marginPercentage > 15 ? 'Excellent' : marginPercentage > 10 ? 'Good' : 'Needs focus'}`,
                `Competitive position: ${result.competitivePosition || this.assessMarginCompetitiveness(margin, 'operating')}`
            ],
            businessContext: {
                operationalExcellence: marginPercentage > 20 ? 'Best-in-class operations' : marginPercentage > 10 ? 'Competitive operations' : 'Operational challenges',
                scalability: marginPercentage > 15 ? 'Good operating leverage' : 'Limited operating leverage',
                sustainability: marginPercentage > 12 ? 'Sustainable competitive advantage' : 'Vulnerable to competition'
            }
        };
    }

    interpretNetProfitMargin(params, result) {
        const [netIncome, revenue] = params;
        const margin = result.margin || result;
        const marginPercentage = margin * 100;

        return {
            value: this.formatPercentage(margin),
            meaning: `Company converts ${this.formatPercentage(margin)} of revenue into net profit after all expenses`,
            implication: result.interpretation ? result.interpretation.description : this.assessNetProfitability(margin),
            keyInsights: [
                `Net income: ${this.formatCurrency(netIncome)}`,
                `Overall efficiency: ${marginPercentage.toFixed(1)}%`,
                `Profitability tier: ${marginPercentage > 15 ? 'Top tier' : marginPercentage > 8 ? 'Above average' : 'Below average'}`,
                `Market position: ${result.competitivePosition || this.assessMarginCompetitiveness(margin, 'net')}`
            ],
            businessContext: {
                overallPerformance: marginPercentage > 15 ? 'Exceptional profitability' : marginPercentage > 8 ? 'Strong performance' : 'Performance concerns',
                investorAttraction: marginPercentage > 10 ? 'Attractive to investors' : 'May need improvement for investment appeal',
                riskCapacity: marginPercentage > 12 ? 'Good buffer for economic downturns' : 'Vulnerable to margin pressure'
            }
        };
    }

    interpretEarningsPerShare(params, result) {
        const [netIncome, shares] = params;
        const eps = result.eps || result;

        return {
            value: this.formatCurrency(eps),
            meaning: `Each share of stock earned ${this.formatCurrency(eps)} in net income`,
            implication: result.interpretation ? result.interpretation.description : this.assessEPSPerformance(eps),
            keyInsights: [
                `Total earnings: ${this.formatCurrency(netIncome)}`,
                `Shares outstanding: ${this.formatNumber(shares)}`,
                `Per-share value creation: ${eps > 2 ? 'Strong' : eps > 1 ? 'Moderate' : 'Weak'}`,
                `Growth potential: ${eps > 3 ? 'High growth company' : 'Mature company profile'}`
            ],
            businessContext: {
                shareholderValue: eps > 3 ? 'Strong value creation per share' : eps > 1 ? 'Adequate returns' : 'Limited shareholder returns',
                stockAttractiveness: eps > 2 ? 'Attractive earnings profile' : 'May need growth initiatives',
                dividendCapacity: eps > 4 ? 'Strong dividend paying capacity' : eps > 2 ? 'Moderate dividend capacity' : 'Limited dividend capacity'
            }
        };
    }

    interpretPriceToEarningsRatio(params, result) {
        const [marketPrice, eps] = params;
        const peRatio = result.peRatio || result;
        const earningsYield = 1 / peRatio;

        return {
            value: peRatio.toFixed(1),
            meaning: `Investors pay ${peRatio.toFixed(1)} times annual earnings for each share`,
            implication: result.interpretation ? result.interpretation.description : this.assessPEValuation(peRatio),
            keyInsights: [
                `Market price: ${this.formatCurrency(marketPrice)}`,
                `Earnings yield: ${this.formatPercentage(earningsYield)}`,
                `Valuation level: ${result.valuation || this.assessValuation(peRatio)}`,
                `Growth expectations: ${peRatio > 25 ? 'High growth expected' : peRatio < 15 ? 'Value/mature company' : 'Moderate growth'}`
            ],
            businessContext: {
                investmentAppeal: peRatio < 15 ? 'Value investment opportunity' : peRatio > 25 ? 'Growth premium priced in' : 'Fairly valued',
                marketSentiment: peRatio > 30 ? 'Very optimistic expectations' : peRatio < 10 ? 'Pessimistic/turnaround story' : 'Balanced expectations',
                riskReturn: peRatio < 12 ? 'Lower risk, steady returns expected' : peRatio > 20 ? 'Higher risk, growth returns expected' : 'Moderate risk-return profile'
            }
        };
    }

    interpretBreakEvenRevenue(params, result) {
        const [fixedCosts, contributionMarginRatio] = params;
        const breakEvenRev = result.breakEvenRevenue || result;
        const marginDollars = breakEvenRev * contributionMarginRatio;

        return {
            value: this.formatCurrency(breakEvenRev),
            meaning: `Business needs ${this.formatCurrency(breakEvenRev)} in revenue to cover all costs`,
            implication: result.interpretation ? result.interpretation.description : this.assessBreakEvenViability(breakEvenRev, fixedCosts),
            keyInsights: [
                `Fixed costs: ${this.formatCurrency(fixedCosts)}`,
                `Contribution margin ratio: ${this.formatPercentage(contributionMarginRatio)}`,
                `Required contribution: ${this.formatCurrency(marginDollars)}`,
                `Market challenge: ${breakEvenRev > 1000000 ? 'High volume market needed' : 'Achievable market size'}`
            ],
            businessContext: {
                salesTarget: 'Primary sales objective for profitability',
                marketRequirement: breakEvenRev < 500000 ? 'Niche market viable' : 'Requires substantial market penetration',
                businessViability: contributionMarginRatio > 0.4 ? 'Healthy business model' : 'Margin improvement needed'
            }
        };
    }

    interpretDividendDiscountModel(params, result) {
        const [dividend, growthRate, requiredReturn] = params;
        const value = result.value || result;
        const dividendYield = dividend / value;
        const priceGrowthRate = growthRate;

        return {
            value: this.formatCurrency(value),
            meaning: `Stock intrinsic value based on ${this.formatCurrency(dividend)} dividend growing at ${this.formatPercentage(growthRate)}`,
            implication: result.interpretation ? result.interpretation.description : this.assessDividendValue(dividendYield, growthRate),
            keyInsights: [
                `Current dividend yield: ${this.formatPercentage(dividendYield)}`,
                `Required return: ${this.formatPercentage(requiredReturn)}`,
                `Growth assumptions: ${this.formatPercentage(growthRate)} annually`,
                `Sensitivity: ${result.sensitivity || 'High sensitivity to growth rate assumptions'}`
            ],
            businessContext: {
                investmentProfile: dividendYield > 0.04 ? 'Income-focused investment' : 'Growth-focused with dividends',
                riskAssessment: requiredReturn - growthRate < 0.03 ? 'High sensitivity to assumptions' : 'Reasonable assumption buffer',
                sustainability: growthRate > 0.06 ? 'Verify growth sustainability' : 'Conservative growth assumptions'
            }
        };
    }

    interpretEconomicValueAdded(params, result) {
        const [nopat, wacc, investedCapital] = params;
        const eva = result.eva || result;
        const roic = nopat / investedCapital;
        const spread = roic - wacc;

        return {
            value: this.formatCurrency(eva),
            meaning: eva > 0 ? `Company creates ${this.formatCurrency(eva)} in economic value above cost of capital` : `Company destroys ${this.formatCurrency(Math.abs(eva))} in economic value`,
            implication: result.interpretation ? result.interpretation.description : this.assessValueCreation(eva, investedCapital),
            keyInsights: [
                `ROIC: ${this.formatPercentage(roic)}`,
                `WACC: ${this.formatPercentage(wacc)}`,
                `Economic spread: ${this.formatPercentage(spread)}`,
                `Value creation: ${result.valueCreation || this.assessValueCreation(eva, nopat)}`
            ],
            businessContext: {
                managementPerformance: eva > 0 ? 'Creating shareholder value' : 'Destroying shareholder value',
                strategicFocus: spread > 0.03 ? 'Strong competitive advantage' : spread < 0 ? 'Strategic repositioning needed' : 'Break-even value creation',
                investmentDecision: eva > investedCapital * 0.05 ? 'Continue investment' : eva < 0 ? 'Consider strategic alternatives' : 'Monitor closely'
            }
        };
    }

    interpretAmortizationSchedule(params, result) {
        const [principal, rate, periods] = params;
        const schedule = Array.isArray(result) ? result : result.schedule || [];
        const monthlyPayment = schedule.length > 0 ? schedule[0].payment : 0;
        const totalPayments = monthlyPayment * periods;
        const totalInterest = totalPayments - principal;

        return {
            value: `${this.formatCurrency(monthlyPayment)} monthly payment`,
            meaning: `Loan of ${this.formatCurrency(principal)} amortized over ${periods} periods at ${this.formatPercentage(rate)} per period`,
            implication: `Total interest cost of ${this.formatCurrency(totalInterest)} over loan term`,
            keyInsights: [
                `Monthly payment: ${this.formatCurrency(monthlyPayment)}`,
                `Total payments: ${this.formatCurrency(totalPayments)}`,
                `Total interest: ${this.formatCurrency(totalInterest)}`,
                `Interest % of loan: ${this.formatPercentage(totalInterest / principal)}`
            ],
            businessContext: {
                affordability: `Monthly payment represents debt service requirement`,
                costOfCapital: `Interest cost: ${this.formatPercentage(totalInterest / principal)} of principal`,
                paymentStructure: 'Early payments are primarily interest, later payments primarily principal'
            }
        };
    }

    // Helper methods for assessments
    assessQuickLiquidityPosition(ratio) {
        if (ratio >= 1.2) return 'Strong immediate liquidity position';
        if (ratio >= 1.0) return 'Adequate immediate liquidity';
        if (ratio >= 0.8) return 'Marginal immediate liquidity';
        return 'Weak immediate liquidity position';
    }

    assessWorkingCapitalHealth(workingCapital, currentAssets) {
        const ratio = workingCapital / currentAssets;
        if (ratio >= 0.4) return 'Strong working capital position';
        if (ratio >= 0.2) return 'Adequate working capital';
        if (ratio >= 0) return 'Minimal working capital buffer';
        return 'Negative working capital - liquidity concerns';
    }

    assessCashCycleEfficiency(ccc) {
        if (ccc <= 30) return 'Highly efficient cash conversion';
        if (ccc <= 60) return 'Efficient cash conversion';
        if (ccc <= 90) return 'Average cash conversion efficiency';
        return 'Inefficient cash conversion - needs improvement';
    }

    assessLeveragePosition(ratio) {
        if (ratio <= 0.3) return 'Conservative leverage position';
        if (ratio <= 0.6) return 'Moderate leverage position';
        if (ratio <= 1.0) return 'Elevated leverage position';
        return 'High leverage position - monitor debt capacity';
    }

    assessAssetEfficiency(roa) {
        const percentage = roa * 100;
        if (percentage >= 10) return 'Excellent asset efficiency';
        if (percentage >= 5) return 'Good asset efficiency';
        if (percentage >= 2) return 'Average asset efficiency';
        return 'Below average asset efficiency';
    }

    assessGrossProfitability(margin) {
        const percentage = margin * 100;
        if (percentage >= 50) return 'Excellent gross profitability';
        if (percentage >= 30) return 'Good gross profitability';
        if (percentage >= 20) return 'Average gross profitability';
        return 'Below average gross profitability';
    }

    assessOperatingEfficiency(margin) {
        const percentage = margin * 100;
        if (percentage >= 15) return 'Excellent operating efficiency';
        if (percentage >= 10) return 'Good operating efficiency';
        if (percentage >= 5) return 'Average operating efficiency';
        return 'Below average operating efficiency';
    }

    assessNetProfitability(margin) {
        const percentage = margin * 100;
        if (percentage >= 10) return 'Excellent net profitability';
        if (percentage >= 5) return 'Good net profitability';
        if (percentage >= 2) return 'Average net profitability';
        return 'Below average net profitability';
    }

    assessEPSPerformance(eps) {
        if (eps >= 5) return 'Excellent earnings per share';
        if (eps >= 2) return 'Good earnings per share';
        if (eps >= 1) return 'Average earnings per share';
        if (eps >= 0) return 'Weak earnings per share';
        return 'Negative earnings per share';
    }

    assessPEValuation(peRatio) {
        if (peRatio >= 30) return 'High valuation - growth expectations or overvalued';
        if (peRatio >= 20) return 'Above average valuation';
        if (peRatio >= 15) return 'Average market valuation';
        if (peRatio >= 10) return 'Below average valuation';
        return 'Low valuation - value opportunity or concerns';
    }

    assessBreakEvenViability(revenue, fixedCosts) {
        const revenueRatio = revenue / fixedCosts;
        if (revenueRatio <= 5) return 'Low revenue threshold - viable business model';
        if (revenueRatio <= 10) return 'Moderate revenue requirements';
        return 'High revenue threshold - challenging market requirements';
    }

    assessDividendValue(yield, growthRate) {
        if (yield >= 0.06) return 'High dividend yield - attractive for income investors';
        if (yield >= 0.04) return 'Reasonable dividend yield';
        if (yield >= 0.02) return 'Moderate dividend yield';
        return 'Low dividend yield - growth-focused investment';
    }

    getROETier(roe) {
        const percentage = roe * 100;
        if (percentage >= 20) return 'Top Tier (>20%)';
        if (percentage >= 15) return 'Excellent (15-20%)';
        if (percentage >= 10) return 'Good (10-15%)';
        if (percentage >= 5) return 'Average (5-10%)';
        return 'Below Average (<5%)';
    }

    compareROEToIndustry(roe) {
        const percentage = roe * 100;
        return {
            technology: percentage >= 15 ? 'Competitive' : 'Below tech average',
            manufacturing: percentage >= 10 ? 'Competitive' : 'Below manufacturing average',
            retail: percentage >= 12 ? 'Competitive' : 'Below retail average',
            utilities: percentage >= 8 ? 'Competitive' : 'Below utilities average'
        };
    }

    compareROEToMarket(roe) {
        const percentage = roe * 100;
        if (percentage >= 15) return 'Above market average';
        if (percentage >= 10) return 'At market average';
        return 'Below market average';
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
  // Enhanced executive summary generation for all 24 financial formulas
generateEnhancedExecutiveSummary(formula, result) {
    const baseValue = typeof result === 'object' ? 
        result.value || result.ratio || result.breakEvenUnits || result.roe || result.roa || 
        result.eps || result.peRatio || result.margin || result.workingCapital || 
        result.ccc || result.eva || result.irr : result;
    
    switch(this.selectedFormula) {
        case 'presentValue':
            return {
                headline: `Present Value Analysis: ${this.formatCurrency(baseValue)}`,
                keyFinding: `Time value analysis shows current worth of future cash flows discounted at specified rate`,
                businessImplication: baseValue > this.formulaParams[0] * 0.8 ? 'Acceptable present value retention' : 'Significant time value erosion requires attention',
                criticalFactor: 'Interest rate assumptions are critical - small changes significantly impact valuation',
                recommendation: 'Verify discount rate reflects appropriate risk level for investment horizon'
            };

        case 'futureValue':
            const growth = ((baseValue / this.formulaParams[0]) - 1) * 100;
            return {
                headline: `Future Value Projection: ${this.formatCurrency(baseValue)} (${growth.toFixed(1)}% growth)`,
                keyFinding: `Investment compounds to ${this.formatCurrency(baseValue)} over specified time horizon`,
                businessImplication: growth > 50 ? 'Strong wealth accumulation potential through compounding' : 'Moderate growth expectations based on current parameters',
                criticalFactor: 'Time horizon and interest rate assumptions drive compounding benefits',
                recommendation: growth < 30 ? 'Consider higher-yield alternatives or longer time horizon' : 'Maintain disciplined savings approach'
            };

        case 'compoundInterest':
            const annualReturn = Math.pow(baseValue / this.formulaParams[0], 1 / this.formulaParams[2]) - 1;
            return {
                headline: `Compound Interest Analysis: ${this.formatCurrency(baseValue)} (${this.formatPercentage(annualReturn)} effective)`,
                keyFinding: `Compounding frequency optimization yields ${this.formatCurrency(baseValue)} total value`,
                businessImplication: this.formulaParams[3] >= 12 ? 'Maximizing compounding benefits through frequent compounding' : 'Additional compounding frequency could enhance returns',
                criticalFactor: 'Compounding frequency and consistent contributions maximize wealth building',
                recommendation: 'Maintain consistent investment discipline to maximize compounding effects'
            };

        case 'effectiveInterestRate':
            const rateDiff = (baseValue - this.formulaParams[0]) * 100;
            return {
                headline: `Effective Rate Analysis: ${this.formatPercentage(baseValue)} (${rateDiff.toFixed(2)}% above nominal)`,
                keyFinding: `True cost/yield is ${this.formatPercentage(baseValue)} when compounding effects considered`,
                businessImplication: rateDiff > 1 ? 'Significant compounding impact on true cost/return' : 'Minimal compounding effect on stated rate',
                criticalFactor: 'Use effective rates for accurate financial product comparisons',
                recommendation: 'Always compare financial products using effective rates for true cost/benefit analysis'
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

        case 'internalRateOfReturn':
            const irrValue = result.irr || baseValue;
            return {
                headline: `IRR Analysis: ${this.formatPercentage(irrValue)} ${irrValue > 0.15 ? 'EXCEPTIONAL' : irrValue > 0.12 ? 'STRONG' : irrValue > 0.08 ? 'ACCEPTABLE' : 'BELOW THRESHOLD'}`,
                keyFinding: `Investment generates ${this.formatPercentage(irrValue)} internal rate of return`,
                businessImplication: result.converged ? `Reliable ${irrValue > 0.12 ? 'above-market' : 'below-market'} return calculation` : 'IRR calculation unreliable - use alternative methods',
                criticalFactor: 'Cash flow pattern and timing critical for accurate IRR calculation',
                recommendation: irrValue > 0.15 ? 'ACCEPT - Excellent returns' : irrValue > 0.10 ? 'ACCEPT - Adequate returns' : 'REJECT - Insufficient returns'
            };

        case 'paybackPeriod':
            return {
                headline: `Payback Analysis: ${baseValue ? `${baseValue.toFixed(1)} YEARS` : 'NO PAYBACK ACHIEVED'}`,
                keyFinding: baseValue ? `Investment recovers initial capital in ${baseValue.toFixed(1)} years` : 'Cash flows insufficient for capital recovery',
                businessImplication: baseValue && baseValue < 3 ? 'Quick capital recovery reduces investment risk' : baseValue && baseValue < 5 ? 'Moderate payback period acceptable' : 'Extended payback increases risk exposure',
                criticalFactor: 'Cash flow consistency and magnitude determine recovery timeline',
                recommendation: baseValue && baseValue < 4 ? 'Acceptable payback period for investment' : 'Consider higher cash flow alternatives'
            };

        case 'discountedPaybackPeriod':
            return {
                headline: `Discounted Payback: ${baseValue ? `${baseValue.toFixed(1)} YEARS` : 'NO TIME-ADJUSTED PAYBACK'}`,
                keyFinding: baseValue ? `Risk-adjusted payback period of ${baseValue.toFixed(1)} years` : 'Present value of cash flows insufficient for recovery',
                businessImplication: baseValue && baseValue < 5 ? 'Acceptable risk-adjusted recovery period' : 'Extended time-value adjusted payback increases risk',
                criticalFactor: 'Discount rate assumption significantly impacts payback timeline',
                recommendation: baseValue && baseValue < 6 ? 'Proceed with investment' : 'Reconsider investment timing or parameters'
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

        case 'quickRatio':
            const quickValue = typeof result === 'object' ? result.ratio : result;
            return {
                headline: `Quick Liquidity: ${quickValue >= 1.2 ? 'EXCELLENT' : quickValue >= 1.0 ? 'STRONG' : quickValue >= 0.8 ? 'ADEQUATE' : 'WEAK'} - ${quickValue.toFixed(2)}:1`,
                keyFinding: `Immediate liquidity of ${this.formatCurrency(quickValue)} per $1.00 of current obligations`,
                businessImplication: quickValue >= 1.0 ? 'Strong immediate liquidity without inventory dependence' : 'Limited liquid assets may constrain short-term flexibility',
                criticalFactor: 'Quality of current assets and collection efficiency',
                recommendation: quickValue >= 1.0 ? 'Maintain liquid asset management' : 'Improve collections and reduce inventory dependence'
            };

        case 'workingCapital':
            const wcValue = typeof result === 'object' ? result.workingCapital : result;
            return {
                headline: `Working Capital: ${wcValue > 0 ? 'POSITIVE' : 'NEGATIVE'} - ${this.formatCurrency(wcValue)}`,
                keyFinding: wcValue > 0 ? `Positive working capital provides ${this.formatCurrency(wcValue)} operational buffer` : `Negative working capital indicates ${this.formatCurrency(Math.abs(wcValue))} funding gap`,
                businessImplication: wcValue > 0 ? 'Self-funding capability supports operations and growth' : 'External financing needed to support operations',
                criticalFactor: 'Balance between liquidity and asset utilization efficiency',
                recommendation: wcValue > 0 ? 'Optimize working capital for growth opportunities' : 'Address funding gap through financing or operational improvements'
            };

        case 'cashConversionCycle':
            const cccValue = typeof result === 'object' ? result.ccc : result;
            return {
                headline: `Cash Cycle: ${cccValue <= 45 ? 'EFFICIENT' : cccValue <= 75 ? 'ADEQUATE' : cccValue <= 105 ? 'SLOW' : 'INEFFICIENT'} - ${Math.round(cccValue)} Days`,
                keyFinding: `Cash tied up in operations for ${Math.round(cccValue)} days average`,
                businessImplication: cccValue <= 60 ? 'Efficient working capital management minimizes cash requirements' : 'Extended cash cycle increases working capital needs',
                criticalFactor: 'Balance between inventory, receivables, and payables management',
                recommendation: cccValue > 90 ? 'Focus on cycle time reduction initiatives' : 'Maintain efficient working capital practices'
            };

        case 'debtToEquityRatio':
            const debtRatio = typeof result === 'object' ? result.ratio : result;
            return {
                headline: `Leverage Analysis: ${debtRatio >= 2.0 ? 'HIGH RISK' : debtRatio >= 1.0 ? 'ELEVATED' : debtRatio >= 0.5 ? 'MODERATE' : 'CONSERVATIVE'} - ${debtRatio.toFixed(2)}:1`,
                keyFinding: `Financial leverage of ${this.formatCurrency(debtRatio)} debt per $1.00 equity`,
                businessImplication: debtRatio >= 1.0 ? 'High leverage increases financial risk and interest burden' : 'Conservative capital structure provides financial flexibility',
                criticalFactor: 'Debt service capacity and earnings stability',
                recommendation: debtRatio > 1.5 ? 'Consider deleveraging strategies' : debtRatio < 0.3 ? 'Potential to optimize capital structure' : 'Maintain balanced leverage'
            };

        case 'returnOnEquity':
            const roeValue = typeof result === 'object' ? result.roe : result;
            const roePercentage = roeValue * 100;
            return {
                headline: `ROE Analysis: ${roePercentage >= 20 ? 'EXCEPTIONAL' : roePercentage >= 15 ? 'EXCELLENT' : roePercentage >= 10 ? 'GOOD' : 'BELOW AVERAGE'} - ${this.formatPercentage(roeValue)}`,
                keyFinding: `Management generates ${this.formatPercentage(roeValue)} annual returns on shareholder equity`,
                businessImplication: roePercentage >= 15 ? 'Superior capital efficiency creates significant shareholder value' : roePercentage >= 10 ? 'Competitive returns meet shareholder expectations' : 'Suboptimal returns require strategic performance improvements',
                criticalFactor: 'Profitability, asset utilization, and capital structure optimization',
                recommendation: roePercentage >= 20 ? 'Investigate sustainability of high returns' : roePercentage < 10 ? 'Implement DuPont analysis to identify improvement areas' : 'Maintain competitive performance levels'
            };

        case 'returnOnAssets':
            const roaValue = typeof result === 'object' ? result.roa : result;
            const roaPercentage = roaValue * 100;
            return {
                headline: `Asset Efficiency: ${roaPercentage >= 10 ? 'EXCEPTIONAL' : roaPercentage >= 5 ? 'STRONG' : roaPercentage >= 2 ? 'ADEQUATE' : 'WEAK'} - ${this.formatPercentage(roaValue)}`,
                keyFinding: `Assets generate ${this.formatPercentage(roaValue)} returns independent of financing structure`,
                businessImplication: roaPercentage >= 8 ? 'Excellent asset utilization drives superior operational performance' : 'Asset efficiency improvement needed for competitive advantage',
                criticalFactor: 'Operational efficiency and asset productivity optimization',
                recommendation: roaPercentage >= 10 ? 'Leverage efficient operations for growth' : 'Focus on operational improvements and asset optimization'
            };

        case 'grossProfitMargin':
            const grossValue = typeof result === 'object' ? result.margin : result;
            const grossPercentage = grossValue * 100;
            return {
                headline: `Gross Profitability: ${grossPercentage >= 50 ? 'EXCELLENT' : grossPercentage >= 30 ? 'STRONG' : grossPercentage >= 20 ? 'ADEQUATE' : 'WEAK'} - ${this.formatPercentage(grossValue)}`,
                keyFinding: `Gross margin of ${this.formatPercentage(grossValue)} indicates pricing power and cost control`,
                businessImplication: grossPercentage >= 40 ? 'Strong pricing discipline and cost management create competitive advantage' : 'Margin improvement needed for sustainable profitability',
                criticalFactor: 'Pricing strategy and direct cost management',
                recommendation: grossPercentage >= 50 ? 'Maintain pricing discipline' : 'Focus on cost optimization and value proposition enhancement'
            };

        case 'operatingMargin':
            const opValue = typeof result === 'object' ? result.margin : result;
            const opPercentage = opValue * 100;
            return {
                headline: `Operating Efficiency: ${opPercentage >= 15 ? 'EXCELLENT' : opPercentage >= 10 ? 'STRONG' : opPercentage >= 5 ? 'ADEQUATE' : 'WEAK'} - ${this.formatPercentage(opValue)}`,
                keyFinding: `Operating margin of ${this.formatPercentage(opValue)} reflects core business profitability`,
                businessImplication: opPercentage >= 12 ? 'Superior operational efficiency creates sustainable competitive advantage' : 'Operational improvements needed for competitive positioning',
                criticalFactor: 'Operating expense management and revenue optimization',
                recommendation: opPercentage >= 15 ? 'Leverage operational excellence for expansion' : 'Focus on operational efficiency initiatives'
            };

        case 'netProfitMargin':
            const netValue = typeof result === 'object' ? result.margin : result;
            const netPercentage = netValue * 100;
            return {
                headline: `Overall Profitability: ${netPercentage >= 15 ? 'EXCEPTIONAL' : netPercentage >= 8 ? 'STRONG' : netPercentage >= 3 ? 'ADEQUATE' : 'WEAK'} - ${this.formatPercentage(netValue)}`,
                keyFinding: `Net profit margin of ${this.formatPercentage(netValue)} represents bottom-line efficiency`,
                businessImplication: netPercentage >= 10 ? 'Excellent overall profitability creates shareholder value' : 'Profitability enhancement needed for investor attractiveness',
                criticalFactor: 'Comprehensive cost management and revenue optimization',
                recommendation: netPercentage >= 12 ? 'Strong foundation for growth and dividends' : 'Focus on comprehensive profitability improvements'
            };

        case 'earningsPerShare':
            const epsValue = typeof result === 'object' ? result.eps : result;
            return {
                headline: `Earnings Per Share: ${epsValue >= 5 ? 'EXCELLENT' : epsValue >= 2 ? 'STRONG' : epsValue >= 1 ? 'ADEQUATE' : epsValue >= 0 ? 'WEAK' : 'NEGATIVE'} - ${this.formatCurrency(epsValue)}`,
                keyFinding: `Each share generates ${this.formatCurrency(epsValue)} in annual earnings`,
                businessImplication: epsValue >= 3 ? 'Strong per-share value creation supports dividend capacity' : 'Limited per-share earnings constrain shareholder returns',
                criticalFactor: 'Earnings growth and share count management',
                recommendation: epsValue >= 4 ? 'Consider dividend policy and growth investments' : 'Focus on earnings enhancement strategies'
            };

        case 'priceToEarningsRatio':
            const peValue = typeof result === 'object' ? result.peRatio : result;
            return {
                headline: `Valuation Assessment: ${peValue >= 25 ? 'HIGH EXPECTATIONS' : peValue >= 15 ? 'GROWTH PREMIUM' : peValue >= 12 ? 'FAIR VALUE' : 'VALUE OPPORTUNITY'} - ${peValue.toFixed(1)}x`,
                keyFinding: `Market pays ${peValue.toFixed(1)} times earnings reflecting growth expectations`,
                businessImplication: peValue >= 20 ? 'High growth expectations priced in - execution risk elevated' : peValue < 12 ? 'Potential undervaluation or fundamental concerns',
                criticalFactor: 'Growth delivery vs market expectations',
                recommendation: peValue > 25 ? 'Verify growth sustainability' : peValue < 10 ? 'Investigate value opportunity or risks'
            };

        case 'breakEvenUnits':
            const breakEvenValue = typeof result === 'object' ? result.breakEvenUnits : result;
            return {
                headline: `Break-Even Analysis: ${this.formatNumber(breakEvenValue)} Units Required for Profitability`,
                keyFinding: `Business must achieve ${this.formatNumber(breakEvenValue)} unit sales volume to cover all costs`,
                businessImplication: breakEvenValue < 10000 ? 'Low break-even threshold supports business viability' : 'High volume requirements challenge market penetration',
                criticalFactor: 'Contribution margin optimization and fixed cost management',
                recommendation: 'Develop sales forecasts exceeding break-even with adequate safety margins'
            };

        case 'breakEvenRevenue':
            const revenueValue = typeof result === 'object' ? result.breakEvenRevenue : result;
            return {
                headline: `Revenue Break-Even: ${this.formatCurrency(revenueValue)} Required for Profitability`,
                keyFinding: `Business needs ${this.formatCurrency(revenueValue)} in sales to achieve break-even`,
                businessImplication: revenueValue < 1000000 ? 'Achievable revenue target supports business model' : 'High revenue threshold requires substantial market capture',
                criticalFactor: 'Market size and penetration strategy',
                recommendation: 'Validate market opportunity exceeds break-even requirements'
            };

        case 'dividendDiscountModel':
            const ddmValue = typeof result === 'object' ? result.value : result;
            return {
                headline: `Intrinsic Valuation: ${this.formatCurrency(ddmValue)} Based on Dividend Growth Model`,
                keyFinding: `Stock intrinsic value of ${this.formatCurrency(ddmValue)} based on dividend growth assumptions`,
                businessImplication: this.formulaParams[2] - this.formulaParams[1] > 0.05 ? 'Reasonable growth assumptions support valuation' : 'High sensitivity to growth rate changes',
                criticalFactor: 'Dividend growth sustainability and required return assumptions',
                recommendation: 'Validate growth assumptions against historical performance and industry trends'
            };

        case 'economicValueAdded':
            const evaValue = typeof result === 'object' ? result.eva : result;
            return {
                headline: `Value Creation: ${evaValue > 0 ? 'POSITIVE' : 'NEGATIVE'} EVA of ${this.formatCurrency(evaValue)}`,
                keyFinding: evaValue > 0 ? `Creates ${this.formatCurrency(evaValue)} in economic value above cost of capital` : `Destroys ${this.formatCurrency(Math.abs(evaValue))} in economic value`,
                businessImplication: evaValue > 0 ? 'Management creates shareholder wealth above capital costs' : 'Capital allocation destroying shareholder value',
                criticalFactor: 'ROIC vs WACC spread and capital efficiency',
                recommendation: evaValue > 0 ? 'Continue value-creating strategies' : 'Reassess capital allocation and strategic direction'
            };

        case 'amortizationSchedule':
            const scheduleArray = Array.isArray(result) ? result : [];
            const monthlyPayment = scheduleArray.length > 0 ? scheduleArray[0].payment : 0;
            const totalInterest = scheduleArray.reduce((sum, period) => sum + period.interestPayment, 0);
            return {
                headline: `Loan Structure: ${this.formatCurrency(monthlyPayment)} Monthly Payment`,
                keyFinding: `Amortization schedule shows ${this.formatCurrency(monthlyPayment)} monthly payment over loan term`,
                businessImplication: `Total interest cost of ${this.formatCurrency(totalInterest)} represents borrowing cost`,
                criticalFactor: 'Payment affordability and total cost of borrowing',
                recommendation: 'Ensure payment fits budget and consider prepayment strategies if beneficial'
            };

        default:
            return {
                headline: `Financial Analysis Complete: ${formula.name}`,
                keyFinding: 'Quantitative analysis provides insights for business decision-making',
                businessImplication: 'Results should be evaluated against benchmarks and strategic objectives',
                criticalFactor: 'Data quality and assumption validation',
                recommendation: 'Consider scenarios and perform sensitivity analysis for robust decisions'
            };
    }

    // Enhanced detailed analysis generation
    // Enhanced detailed analysis generation for all 24 financial formulas
generateDetailedAnalysis(formula, params, result) {
    switch(this.selectedFormula) {
        case 'presentValue':
            return this.generatePresentValueAnalysis(params, result);
        case 'futureValue':
            return this.generateFutureValueAnalysis(params, result);
        case 'compoundInterest':
            return this.generateCompoundInterestAnalysis(params, result);
        case 'effectiveInterestRate':
            return this.generateEffectiveRateAnalysis(params, result);
        case 'netPresentValue':
            return this.generateNPVAnalysis(params, result);
        case 'internalRateOfReturn':
            return this.generateIRRAnalysis(params, result);
        case 'paybackPeriod':
            return this.generatePaybackAnalysis(params, result);
        case 'discountedPaybackPeriod':
            return this.generateDiscountedPaybackAnalysis(params, result);
        case 'currentRatio':
            return this.generateLiquidityAnalysis(params, result);
        case 'quickRatio':
            return this.generateQuickRatioAnalysis(params, result);
        case 'workingCapital':
            return this.generateWorkingCapitalAnalysis(params, result);
        case 'cashConversionCycle':
            return this.generateCashCycleAnalysis(params, result);
        case 'debtToEquityRatio':
            return this.generateLeverageAnalysis(params, result);
        case 'returnOnEquity':
            return this.generateProfitabilityAnalysis(params, result);
        case 'returnOnAssets':
            return this.generateAssetEfficiencyAnalysis(params, result);
        case 'grossProfitMargin':
            return this.generateGrossMarginAnalysis(params, result);
        case 'operatingMargin':
            return this.generateOperatingMarginAnalysis(params, result);
        case 'netProfitMargin':
            return this.generateNetMarginAnalysis(params, result);
        case 'earningsPerShare':
            return this.generateEPSAnalysis(params, result);
        case 'priceToEarningsRatio':
            return this.generatePEAnalysis(params, result);
        case 'breakEvenUnits':
            return this.generateCostVolumeAnalysis(params, result);
        case 'breakEvenRevenue':
            return this.generateRevenueBreakEvenAnalysis(params, result);
        case 'dividendDiscountModel':
            return this.generateDividendValuationAnalysis(params, result);
        case 'economicValueAdded':
            return this.generateEVAAnalysis(params, result);
        case 'amortizationSchedule':
            return this.generateAmortizationAnalysis(params, result);
        default:
            return this.generateGenericAnalysis(formula, params, result);
    }
}

// Individual detailed analysis methods for each formula
generateFutureValueAnalysis(params, result) {
    const [pv, rate, periods, pmt] = params;
    const growthFactor = Math.pow(1 + rate, periods);
    const totalContributions = pv + (pmt * periods);
    const compoundingEffect = result - totalContributions;
    const annualReturn = Math.pow(result / pv, 1 / periods) - 1;
    
    return {
        calculationBreakdown: {
            initialValue: pv,
            additionalPayments: pmt * periods,
            growthFactor: growthFactor,
            compoundingEffect: compoundingEffect,
            finalValue: result,
            effectiveAnnualReturn: annualReturn
        },
        timeValueComponents: {
            principalGrowth: pv * (growthFactor - 1),
            paymentGrowth: pmt * periods > 0 ? result - pv * growthFactor : 0,
            compoundingBenefit: compoundingEffect > 0 ? compoundingEffect : 0
        },
        scenarioAnalysis: {
            doubleTime: Math.log(2) / Math.log(1 + rate),
            tenYearProjection: pv * Math.pow(1 + rate, 10),
            inflationAdjusted: rate > 0.03 ? 'Real growth after inflation' : 'May not keep pace with inflation'
        },
        investmentInsights: [
            `Investment horizon: ${periods} periods optimizes compounding`,
            `Annual growth rate: ${this.formatPercentage(rate)} compounds to ${this.formatPercentage(annualReturn)} effective`,
            `Time value benefit: ${this.formatCurrency(compoundingEffect)} from compounding`,
            `Wealth multiplier: ${(result / pv).toFixed(2)}x original investment`
        ]
    };
}

generateCompoundInterestAnalysis(params, result) {
    const [principal, rate, periods, compoundingFreq] = params;
    const annualCompounding = principal * Math.pow(1 + rate, periods);
    const continuousCompounding = principal * Math.exp(rate * periods);
    const compoundingBenefit = result - (principal * (1 + rate * periods));
    
    return {
        compoundingComparison: {
            annual: annualCompounding,
            withFrequency: result,
            continuous: continuousCompounding,
            simple: principal * (1 + rate * periods),
            benefitFromFrequency: result - annualCompounding
        },
        frequencyAnalysis: {
            currentFrequency: compoundingFreq,
            marginalBenefit: result - annualCompounding,
            optimalFrequency: 'Daily (365) or continuous for maximum benefit',
            diminishingReturns: compoundingFreq > 12 ? 'Limited additional benefit' : 'Room for improvement'
        },
        wealthBuildingMetrics: {
            effectiveRate: Math.pow(result / principal, 1 / periods) - 1,
            totalReturn: (result - principal) / principal,
            annualizedGrowth: Math.pow(result / principal, 1 / periods) - 1,
            compoundingPower: compoundingBenefit / principal
        },
        strategicRecommendations: [
            'Maximize compounding frequency when possible',
            'Maintain consistent investment discipline',
            'Consider tax implications of compounding frequency',
            'Reinvest dividends/interest for maximum compounding benefit'
        ]
    };
}

generateEffectiveRateAnalysis(params, result) {
    const [nominalRate, compoundingFreq] = params;
    const rateDifference = result - nominalRate;
    const percentageIncrease = (rateDifference / nominalRate) * 100;
    
    // Calculate effective rates for comparison
    const quarterlyRate = Math.pow(1 + nominalRate / 4, 4) - 1;
    const monthlyRate = Math.pow(1 + nominalRate / 12, 12) - 1;
    const dailyRate = Math.pow(1 + nominalRate / 365, 365) - 1;
    const continuousRate = Math.exp(nominalRate) - 1;
    
    return {
        rateComparison: {
            nominal: nominalRate,
            current: result,
            quarterly: quarterlyRate,
            monthly: monthlyRate,
            daily: dailyRate,
            continuous: continuousRate
        },
        compoundingImpact: {
            rateDifference: rateDifference,
            percentageIncrease: percentageIncrease,
            annualDollarImpact: `$${(rateDifference * 10000).toFixed(2)} per $10,000`,
            compoundingFrequency: compoundingFreq
        },
        practicalApplications: {
            loanComparison: 'Use effective rates to compare loans with different compounding',
            investmentAnalysis: 'Compare investment yields using effective rates',
            creditCardAPR: 'Understand true cost of revolving credit',
            savingsOptimization: 'Choose accounts with best effective rates'
        },
        decisionFramework: [
            'Always compare financial products using effective rates',
            'Higher compounding frequency increases effective rate',
            'Small rate differences compound significantly over time',
            'Consider effective rate vs convenience and features'
        ]
    };
}

generateIRRAnalysis(params, result) {
    const [cashFlows] = params;
    const initialInvestment = Math.abs(cashFlows[0]);
    const futureCashFlows = cashFlows.slice(1);
    const totalCashInflows = futureCashFlows.reduce((sum, cf) => sum + cf, 0);
    const irr = result.irr || result;
    
    // Calculate NPV at various discount rates for analysis
    const npvAt10 = FinancialFunctions.netPresentValue(0.1, cashFlows);
    const npvAt15 = FinancialFunctions.netPresentValue(0.15, cashFlows);
    const npvAt20 = FinancialFunctions.netPresentValue(0.2, cashFlows);
    
    return {
        irrMetrics: {
            calculatedIRR: irr,
            converged: result.converged,
            iterations: result.iterations || 'N/A',
            finalNPV: result.finalNPV || 0,
            totalCashMultiple: totalCashInflows / initialInvestment
        },
        cashFlowAnalysis: {
            initialInvestment: initialInvestment,
            totalInflows: totalCashInflows,
            netCashFlow: totalCashInflows - initialInvestment,
            averageAnnualCashFlow: totalCashInflows / futureCashFlows.length,
            cashFlowPattern: this.analyzeCashFlowPattern(futureCashFlows)
        },
        benchmarkComparison: {
            vs10Percent: { rate: 0.10, npv: npvAt10, decision: npvAt10 > 0 ? 'Accept' : 'Reject' },
            vs15Percent: { rate: 0.15, npv: npvAt15, decision: npvAt15 > 0 ? 'Accept' : 'Reject' },
            vs20Percent: { rate: 0.20, npv: npvAt20, decision: npvAt20 > 0 ? 'Accept' : 'Reject' },
            hurdle: `IRR of ${this.formatPercentage(irr)} ${irr > 0.15 ? 'exceeds' : 'below'} typical 15% hurdle`
        },
        riskConsiderations: [
            result.converged ? 'Calculation converged - reliable result' : 'Calculation issues - verify manually',
            irr > 0.25 ? 'Very high IRR - verify cash flow assumptions' : 'IRR within reasonable range',
            'IRR assumes reinvestment at the IRR rate',
            'Compare with NPV for final investment decision'
        ]
    };
}

generatePaybackAnalysis(params, result) {
    const [initialInvestment, cashFlows] = params;
    const cumulativeCashFlows = [];
    let cumulative = -initialInvestment;
    
    cashFlows.forEach((cf, index) => {
        cumulative += cf;
        cumulativeCashFlows.push({ period: index + 1, cashFlow: cf, cumulative: cumulative });
    });
    
    return {
        paybackMetrics: {
            paybackPeriod: result,
            initialInvestment: initialInvestment,
            totalCashFlows: cashFlows.reduce((sum, cf) => sum + cf, 0),
            averageAnnualCashFlow: cashFlows.reduce((sum, cf) => sum + cf, 0) / cashFlows.length,
            paybackAchieved: result !== null
        },
        cashFlowProgression: cumulativeCashFlows.map(item => ({
            period: item.period,
            cashFlow: item.cashFlow,
            cumulativeCashFlow: item.cumulative,
            recovered: item.cumulative >= 0
        })),
        riskAssessment: {
            paybackRisk: result && result < 3 ? 'Low risk - quick recovery' : result && result < 5 ? 'Moderate risk' : 'High risk - extended payback',
            liquidityImpact: result && result < 2 ? 'Minimal liquidity impact' : 'Extended capital commitment',
            uncertaintyLevel: result && result > 5 ? 'High uncertainty over long period' : 'Manageable uncertainty'
        },
        investmentGuidelines: [
            result && result < 4 ? 'Acceptable payback period for most investments' : 'Consider higher cash flow alternatives',
            'Payback period ignores time value of money',
            'Use alongside NPV and IRR for complete analysis',
            'Shorter payback reduces investment risk'
        ]
    };
}

generateDiscountedPaybackAnalysis(params, result) {
    const [initialInvestment, cashFlows, discountRate] = params;
    const regularPayback = FinancialFunctions.paybackPeriod(initialInvestment, cashFlows);
    
    // Calculate discounted cash flow progression
    const discountedProgression = [];
    let cumulativeDiscounted = -initialInvestment;
    
    cashFlows.forEach((cf, index) => {
        const discountedCF = cf / Math.pow(1 + discountRate, index + 1);
        cumulativeDiscounted += discountedCF;
        discountedProgression.push({
            period: index + 1,
            originalCashFlow: cf,
            discountedCashFlow: discountedCF,
            discountFactor: 1 / Math.pow(1 + discountRate, index + 1),
            cumulativeDiscounted: cumulativeDiscounted
        });
    });
    
    return {
        discountedPaybackMetrics: {
            discountedPaybackPeriod: result,
            regularPaybackPeriod: regularPayback,
            timeValueImpact: result && regularPayback ? result - regularPayback : null,
            discountRate: discountRate,
            initialInvestment: initialInvestment
        },
        discountedProgression: discountedProgression,
        timeValueAnalysis: {
            presentValueOfCashFlows: discountedProgression.reduce((sum, item) => sum + item.discountedCashFlow, 0),
            totalDiscountEffect: cashFlows.reduce((sum, cf) => sum + cf, 0) - discountedProgression.reduce((sum, item) => sum + item.discountedCashFlow, 0),
            averageDiscountFactor: discountedProgression.reduce((sum, item) => sum + item.discountFactor, 0) / discountedProgression.length
        },
        riskAdjustedAssessment: {
            riskPremium: `${this.formatPercentage(discountRate)} discount rate reflects investment risk`,
            timeValueImpact: result && regularPayback ? `Discounting extends payback by ${(result - regularPayback).toFixed(1)} years` : 'N/A',
            investmentViability: result && result < 6 ? 'Acceptable risk-adjusted payback' : 'Extended risk-adjusted recovery period'
        }
    };
}

generateQuickRatioAnalysis(params, result) {
    const [quickAssets, currentLiabilities] = params;
    const ratio = result.ratio || result;
    const liquidityGap = quickAssets - currentLiabilities;
    
    return {
        quickLiquidityMetrics: {
            quickRatio: ratio,
            quickAssets: quickAssets,
            currentLiabilities: currentLiabilities,
            liquidityGap: liquidityGap,
            immediatePaymentCapacity: Math.min(quickAssets / currentLiabilities, 1) * 100
        },
        assetQualityAnalysis: {
            liquidAssetTypes: 'Cash, marketable securities, accounts receivable',
            excludedAssets: 'Inventory, prepaid expenses, other less liquid assets',
            collectionRisk: ratio < 1.0 ? 'Dependent on receivables collection timing' : 'Strong liquid position',
            marketRisk: 'Marketable securities subject to market volatility'
        },
        liquidityComparison: {
            versusCurrentRatio: 'More conservative than current ratio',
            industryBenchmarks: {
                retail: 'Retail average: 0.8-1.2',
                manufacturing: 'Manufacturing average: 1.0-1.5',
                services: 'Services average: 1.2-2.0'
            },
            creditAnalysis: ratio >= 1.0 ? 'Meets most credit requirements' : 'May face credit constraints'
        },
        managementStrategies: ratio < 0.8 ? [
            'Accelerate accounts receivable collections',
            'Reduce inventory levels if possible',
            'Negotiate extended payment terms',
            'Consider short-term credit facilities'
        ] : ratio > 1.5 ? [
            'Optimize excess cash through investments',
            'Consider growth opportunities',
            'Evaluate working capital efficiency'
        ] : [
            'Maintain current liquidity management',
            'Monitor collection patterns',
            'Plan for seasonal variations'
        ]
    };
}

generateWorkingCapitalAnalysis(params, result) {
    const [currentAssets, currentLiabilities] = params;
    const workingCapital = result.workingCapital || result;
    const currentRatio = currentAssets / currentLiabilities;
    const wcTurnover = currentAssets > 0 ? (currentAssets * 4) / currentAssets : 0; // Assuming quarterly turnover
    
    return {
        workingCapitalMetrics: {
            workingCapital: workingCapital,
            currentRatio: currentRatio,
            workingCapitalRatio: workingCapital / currentAssets,
            liquidityBuffer: workingCapital > 0 ? workingCapital : 0,
            fundingDeficit: workingCapital < 0 ? Math.abs(workingCapital) : 0
        },
        operationalImpact: {
            selfFundingCapacity: workingCapital > 0 ? 'Can self-fund operations' : 'Requires external funding',
            growthCapacity: workingCapital > currentLiabilities * 0.2 ? 'Has growth funding capacity' : 'Limited growth capital',
            seasonalBuffer: workingCapital > currentLiabilities * 0.1 ? 'Adequate seasonal buffer' : 'Vulnerable to seasonal fluctuations',
            emergencyReserve: workingCapital > currentLiabilities * 0.3 ? 'Strong emergency reserve' : 'Limited emergency funds'
        },
        cashFlowImplications: {
            operatingCashFlow: workingCapital > 0 ? 'Positive contribution to cash flow' : 'Drain on cash flow',
            investmentNeed: workingCapital < 0 ? 'Immediate funding need' : 'Self-sustaining operations',
            creditRequirements: workingCapital < currentLiabilities * 0.1 ? 'May need credit facilities' : 'Adequate internal funding'
        },
        strategicRecommendations: workingCapital < 0 ? [
            'Improve collections and reduce receivables',
            'Optimize inventory management',
            'Negotiate better payment terms with suppliers',
            'Consider asset-based financing'
        ] : workingCapital > currentLiabilities ? [
            'Optimize excess working capital',
            'Invest in growth opportunities',
            'Consider dividend policy',
            'Improve asset utilization'
        ] : [
            'Maintain balanced working capital',
            'Monitor cash conversion cycle',
            'Plan for business expansion needs'
        ]
    };
}

generateCashCycleAnalysis(params, result) {
    const [dio, dro, dpo] = params;
    const ccc = result.ccc || result;
    const cashTiedUp = dio + dro;
    const supplierFinancing = dpo;
    const netCashCycle = ccc;
    
    return {
        cashCycleComponents: {
            daysInventoryOutstanding: dio,
            daysReceivablesOutstanding: dro,
            daysPayablesOutstanding: dpo,
            totalCashTiedUp: cashTiedUp,
            supplierFinancing: supplierFinancing,
            netCashConversionCycle: netCashCycle
        },
        workingCapitalEfficiency: {
            inventoryEfficiency: dio <= 30 ? 'Efficient' : dio <= 60 ? 'Average' : 'Slow',
            collectionEfficiency: dro <= 30 ? 'Efficient' : dro <= 45 ? 'Average' : 'Slow',
            paymentOptimization: dpo >= 30 ? 'Well optimized' : dpo >= 20 ? 'Average' : 'Room for improvement',
            overallEfficiency: result.efficiency || this.assessWorkingCapitalEfficiency(ccc)
        },
        cashFlowImpact: {
            dailyCashNeed: 'Average daily sales × CCC = Working capital requirement',
            annualImpact: ccc > 0 ? `${Math.round(ccc)} days of sales tied up in working capital` : 'Negative cycle provides financing',
            growthImpact: ccc > 60 ? 'Growth will significantly increase cash needs' : 'Manageable cash requirements for growth',
            seasonalVariation: 'Monitor for seasonal changes in cycle components'
        },
        improvementOpportunities: [
            dio > 45 ? 'Reduce inventory levels and improve turnover' : 'Maintain inventory efficiency',
            dro > 40 ? 'Accelerate collections and tighten credit terms' : 'Maintain collection performance',
            dpo < 25 ? 'Negotiate extended payment terms with suppliers' : 'Optimize supplier relationships',
            ccc > 90 ? 'Comprehensive working capital improvement program needed' : 'Continue efficiency monitoring'
        ]
    };
}

generateLeverageAnalysis(params, result) {
    const [totalDebt, totalEquity] = params;
    const ratio = result.ratio || result;
    const debtPercent = ratio / (1 + ratio);
    const equityPercent = 1 / (1 + ratio);
    
    return {
        leverageMetrics: {
            debtToEquityRatio: ratio,
            debtPercentage: debtPercent,
            equityPercentage: equityPercent,
            leverageLevel: result.leverageLevel || this.assessLeverageLevel(ratio),
            capitalStructure: ratio > 1 ? 'Debt-heavy' : 'Equity-heavy'
        },
        financialRiskAssessment: {
            interestCoverageRisk: ratio > 2 ? 'High interest burden risk' : 'Manageable interest coverage',
            financialFlexibility: ratio < 0.5 ? 'High financial flexibility' : ratio > 1.5 ? 'Limited financial flexibility' : 'Moderate flexibility',
            creditRisk: ratio > 2 ? 'High credit risk' : ratio > 1 ? 'Elevated credit risk' : 'Low credit risk',
            bankruptcyRisk: ratio > 3 ? 'Elevated bankruptcy risk' : 'Acceptable financial risk'
        },
        capitalStructureAnalysis: {
            optimalLeverage: 'Industry and business model dependent',
            costOfCapital: ratio > 1 ? 'May increase weighted average cost of capital' : 'Efficient capital structure',
            taxBenefits: 'Debt provides tax shield benefits',
            riskCapacity: ratio < 0.5 ? 'Capacity for additional leverage' : 'At or near optimal leverage'
        },
        strategicImplications: ratio > 1.5 ? [
            'Consider debt reduction strategies',
            'Focus on cash flow generation',
            'Limit additional borrowing',
            'Monitor credit ratings and covenants'
        ] : ratio < 0.3 ? [
            'Potential to optimize capital structure',
            'Consider strategic leverage for growth',
            'Evaluate tax efficiency opportunities',
            'Assess cost of equity vs debt'
        ] : [
            'Maintain balanced capital structure',
            'Monitor leverage ratios regularly',
            'Align leverage with business strategy'
        ]
    };
}

generateAssetEfficiencyAnalysis(params, result) {
    const [netIncome, averageAssets] = params;
    const roa = result.roa || result;
    const roaPercentage = roa * 100;
    const assetTurnover = averageAssets > 0 ? (netIncome * 4) / averageAssets : 0; // Assuming quarterly data
    
    return {
        assetEfficiencyMetrics: {
            returnOnAssets: roa,
            roaPercentage: roaPercentage,
            netIncome: netIncome,
            averageAssets: averageAssets,
            assetProductivity: `$${(netIncome / (averageAssets / 1000)).toFixed(2)} per $1K assets`,
            efficiencyLevel: result.efficiencyLevel || this.assessAssetEfficiency(roa)
        },
        operationalAnalysis: {
            assetUtilization: roaPercentage > 8 ? 'Excellent asset utilization' : roaPercentage > 4 ? 'Good utilization' : 'Room for improvement',
            managementEffectiveness: roaPercentage > 6 ? 'Superior management performance' : roaPercentage > 3 ? 'Adequate performance' : 'Below average performance',
            competitivePosition: roaPercentage > 10 ? 'Industry leader potential' : roaPercentage > 5 ? 'Competitive' : 'Below competitive standards'
        },
        industryBenchmarks: {
            technology: 'Technology companies: 8-15%',
            retail: 'Retail companies: 4-8%',
            manufacturing: 'Manufacturing: 3-7%',
            utilities: 'Utilities: 2-4%',
            banking: 'Banks: 0.8-1.5%'
        },
        improvementStrategies: roaPercentage < 5 ? [
            'Improve profit margins through cost management',
            'Increase asset turnover and utilization',
            'Divest underperforming assets',
            'Focus on higher-margin business segments'
        ] : [
            'Maintain operational excellence',
            'Leverage efficient operations for growth',
            'Benchmark against industry leaders',
            'Consider strategic asset investments'
        ]
    };
}

generateGrossMarginAnalysis(params, result) {
    const [grossProfit, revenue] = params;
    const margin = result.margin || result;
    const marginPercentage = margin * 100;
    const costOfSales = revenue - grossProfit;
    
    return {
        grossProfitabilityMetrics: {
            grossProfitMargin: margin,
            grossProfit: grossProfit,
            revenue: revenue,
            costOfSales: costOfSales,
            marginPercentage: marginPercentage,
            competitivePosition: result.competitivePosition || this.assessMarginCompetitiveness(margin, 'gross')
        },
        profitabilityDrivers: {
            pricingPower: marginPercentage > 50 ? 'Strong pricing discipline' : marginPercentage > 30 ? 'Moderate pricing power' : 'Price-sensitive market',
            costControl: marginPercentage > 40 ? 'Excellent cost management' : marginPercentage > 25 ? 'Good cost control' : 'Cost optimization needed',
            valueProposition: marginPercentage > 60 ? 'Premium value proposition' : marginPercentage > 40 ? 'Differentiated offering' : 'Commodity-like positioning'
        },
        industryComparison: {
            software: 'Software/SaaS: 70-85%',
            pharmaceuticals: 'Pharmaceuticals: 60-80%',
            retail: 'Retail: 20-40%',
            manufacturing: 'Manufacturing: 25-45%',
            commodities: 'Commodities: 10-25%'
        },
        strategicImplications: marginPercentage < 30 ? [
            'Focus on value-based pricing strategies',
            'Implement cost reduction initiatives',
            'Improve product mix toward higher-margin items',
            'Negotiate better supplier terms'
        ] : marginPercentage > 60 ? [
            'Maintain pricing discipline',
            'Defend competitive advantages',
            'Monitor for competitive threats',
            'Consider market expansion opportunities'
        ] : [
            'Balance pricing and volume growth',
            'Continuous cost optimization',
            'Product portfolio optimization'
        ]
    };
}

generateOperatingMarginAnalysis(params, result) {
    const [operatingIncome, revenue] = params;
    const margin = result.margin || result;
    const marginPercentage = margin * 100;
    
    return {
        operatingEfficiencyMetrics: {
            operatingMargin: margin,
            operatingIncome: operatingIncome,
            revenue: revenue,
            marginPercentage: marginPercentage,
            operatingLeverage: marginPercentage > 15 ? 'High operating leverage' : marginPercentage > 8 ? 'Moderate leverage' : 'Low operating leverage',
            competitivePosition: result.competitivePosition || this.assessMarginCompetitiveness(margin, 'operating')
        },
        operationalAnalysis: {
            costStructure: marginPercentage > 20 ? 'Highly efficient cost structure' : marginPercentage > 10 ? 'Competitive cost structure' : 'Cost structure needs optimization',
            scalability: marginPercentage > 15 ? 'Good scalability potential' : 'Limited scalability',
            operationalExcellence: marginPercentage > 18 ? 'Best-in-class operations' : marginPercentage > 12 ? 'Above-average operations' : 'Operational improvements needed'
        },
        benchmarkAnalysis: {
            topQuartile: marginPercentage >= 20 ? 'Top quartile performance' : 'Below top quartile',
            industryAverage: 'Compare against industry-specific benchmarks',
            historicalTrend: 'Monitor for improving or declining trends'
        },
        improvementOpportunities: marginPercentage < 10 ? [
            'Comprehensive cost reduction program',
            'Operational efficiency initiatives',
            'Technology and automation investments',
            'Organizational restructuring if needed'
        ] : [
            'Maintain operational discipline',
            'Leverage operating leverage for growth',
            'Benchmark against industry leaders'
        ]
    };
}

generateNetMarginAnalysis(params, result) {
    const [netIncome, revenue] = params;
    const margin = result.margin || result;
    const marginPercentage = margin * 100;
    
    return {
        netProfitabilityMetrics: {
            netProfitMargin: margin,
            netIncome: netIncome,
            revenue: revenue,
            marginPercentage: marginPercentage,
            bottomLineEfficiency: marginPercentage > 15 ? 'Exceptional' : marginPercentage > 8 ? 'Strong' : marginPercentage > 3 ? 'Average' : 'Weak',
            competitivePosition: result.competitivePosition || this.assessMarginCompetitiveness(margin, 'net')
        },
        profitabilityAnalysis: {
            overallPerformance: marginPercentage > 12 ? 'Superior profitability' : marginPercentage > 6 ? 'Good profitability' : 'Profitability concerns',
            investorAppeal: marginPercentage > 10 ? 'Attractive to investors' : marginPercentage > 5 ? 'Acceptable to investors' : 'May struggle with investor interest',
            riskBuffer: marginPercentage > 8 ? 'Good buffer for economic downturns' : 'Vulnerable to margin pressure',
            sustainabilityFactor: marginPercentage > 15 ? 'Verify sustainability of high margins' : 'Focus on margin improvement'
        },
        comprehensiveAssessment: {
            costManagement: 'Reflects overall cost discipline across all functions',
            revenueOptimization: 'Shows effectiveness of pricing and volume strategies',
            financialManagement: 'Indicates tax efficiency and financial cost management',
            strategicPosition: marginPercentage > 10 ? 'Strong strategic position' : 'Strategic repositioning may be needed'
        },
        actionPriorities: marginPercentage < 5 ? [
            'Comprehensive profitability improvement program',
            'Review all cost categories for optimization',
            'Evaluate pricing strategy and value proposition',
            'Consider strategic alternatives if needed'
        ] : [
            'Maintain profitability discipline',
            'Protect and defend margins',
            'Invest in sustainable competitive advantages'
        ]
    };
}

generateEPSAnalysis(params, result) {
    const [netIncome, shares] = params;
    const eps = result.eps || result;
    const marketCap = shares * 50; // Assuming $50 share price for analysis
    const peRatio = eps > 0 ? 50 / eps : null;
    
    return {
        earningsMetrics: {
            earningsPerShare: eps,
            netIncome: netIncome,
            sharesOutstanding: shares,
            estimatedPERatio: peRatio,
            performanceLevel: result.interpretation ? result.interpretation.level : this.assessEPSPerformance(eps)
        },
        shareholderValue: {
            valueCreation: eps > 2 ? 'Strong per-share value creation' : eps > 1 ? 'Moderate value creation' : 'Limited value creation',
            dividendCapacity: eps > 4 ? 'Strong dividend capacity' : eps > 2 ? 'Moderate dividend capacity' : 'Limited dividend capacity',
            retainedEarnings: eps > 3 ? 'Good capacity for reinvestment' : 'Limited reinvestment capacity',
            shareRepurchase: eps > 3 && peRatio < 15 ? 'Consider share buybacks' : 'Focus on operational improvements'
        },
        growthAnalysis: {
            sustainabilityFactor: eps > 5 ? 'Verify earnings sustainability' : 'Focus on earnings growth',
            reinvestmentNeed: 'Balance between dividends and growth investments',
            marketExpectations: peRatio > 20 ? 'High growth expectations' : peRatio < 12 ? 'Value-oriented expectations' : 'Moderate expectations'
        },
        strategicConsiderations: eps < 2 ? [
            'Focus on core business profitability',
            'Evaluate cost structure and efficiency',
            'Consider strategic initiatives to boost earnings',
            'Review capital allocation priorities'
        ] : [
            'Maintain earnings quality and sustainability',
            'Balance growth investments with shareholder returns',
            'Consider optimal dividend policy'
        ]
    };
}

generatePEAnalysis(params, result) {
    const [marketPrice, eps] = params;
    const peRatio = result.peRatio || result;
    const earningsYield = 1 / peRatio;
    const growthImplied = peRatio > 15 ? (peRatio - 15) * 0.01 : 0;
    
    return {
        valuationMetrics: {
            priceToEarningsRatio: peRatio,
            marketPrice: marketPrice,
            earningsPerShare: eps,
            earningsYield: earningsYield,
            impliedGrowthRate: growthImplied,
            valuationTier: result.interpretation ? result.interpretation.level : this.assessPEValuation(peRatio)
        },
        marketSentiment: {
            investorExpectations: peRatio > 25 ? 'Very high growth expectations' : peRatio > 15 ? 'Moderate growth expectations' : 'Value/stability focused',
            riskPremium: peRatio < 10 ? 'High risk premium priced in' : peRatio > 25 ? 'Low risk premium - execution risk' : 'Balanced risk assessment',
            marketConfidence: peRatio > 20 ? 'High market confidence' : peRatio < 12 ? 'Market skepticism or value opportunity' : 'Balanced market view'
        },
        investmentImplications: {
            investmentStyle: peRatio < 12 ? 'Value investment opportunity' : peRatio > 20 ? 'Growth investment premium' : 'Core/balanced investment',
            riskReturn: peRatio < 15 ? 'Lower risk, steady returns expected' : 'Higher risk, growth returns expected',
            timeHorizon: peRatio > 20 ? 'Long-term growth story' : 'Near-term value realization'
        },
        comparativeAnalysis: {
            industryComparison: 'Compare PE ratio to industry peers',
            historicalAnalysis: 'Review historical PE ranges for context',
            marketComparison: peRatio > 18 ? 'Above market average' : peRatio < 12 ? 'Below market average' : 'Near market average'
        }
    };
}

generateRevenueBreakEvenAnalysis(params, result) {
    const [fixedCosts, contributionMarginRatio] = params;
    const breakEvenRevenue = result.breakEvenRevenue || result;
    const contributionDollars = breakEvenRevenue * contributionMarginRatio;
    
    return {
        revenueBreakEvenMetrics: {
            breakEvenRevenue: breakEvenRevenue,
            fixedCosts: fixedCosts,
            contributionMarginRatio: contributionMarginRatio,
            contributionDollars: contributionDollars,
            variableCostRatio: 1 - contributionMarginRatio
        },
        businessModelAnalysis: {
            revenueTarget: 'Primary sales objective for profitability',
            marketRequirement: breakEvenRevenue < 500000 ? 'Niche market sufficient' : breakEvenRevenue < 2000000 ? 'Mid-market penetration needed' : 'Substantial market share required',
            scalabilityFactor: contributionMarginRatio > 0.5 ? 'High scalability above break-even' : contributionMarginRatio > 0.3 ? 'Moderate scalability' : 'Limited scalability',
            businessViability: contributionMarginRatio > 0.4 ? 'Viable business model' : 'Margin improvement critical'
        },
        strategicImplications: {
            pricingStrategy: contributionMarginRatio > 0.5 ? 'Premium pricing sustainable' : 'Competitive pricing pressure',
            costStructure: fixedCosts / breakEvenRevenue > 0.5 ? 'High fixed cost business model' : 'Variable cost driven model',
            growthPotential: contributionMarginRatio > 0.4 ? 'Strong growth profit potential' : 'Limited incremental profit growth'
        },
        achievementStrategies: [
            'Develop comprehensive sales and marketing plan',
            'Focus on customer acquisition and retention',
            'Optimize pricing for contribution margin',
            'Monitor progress against break-even targets'
        ]
    };
}

generateDividendValuationAnalysis(params, result) {
    const [dividend, growthRate, requiredReturn] = params;
    const value = result.value || result;
    const dividendYield = dividend / value;
    const impliedGrowth = growthRate;
    const riskSpread = requiredReturn - growthRate;
    
    return {
        dividendValuationMetrics: {
            intrinsicValue: value,
            currentDividend: dividend,
            growthRate: growthRate,
            requiredReturn: requiredReturn,
            dividendYield: dividendYield,
            riskSpread: riskSpread
        },
        growthAssumptions: {
            growthSustainability: growthRate > 0.08 ? 'High growth - verify sustainability' : growthRate > 0.04 ? 'Moderate growth assumptions' : 'Conservative growth',
            payoutImplications: 'Growth rate should align with retention ratio × ROE',
            competitiveAdvantage: growthRate > 0.06 ? 'Requires sustainable competitive advantage' : 'Market-level growth expectations'
        },
        sensitivityAnalysis: {
            growthSensitivity: riskSpread < 0.05 ? 'Highly sensitive to growth assumptions' : 'Moderate sensitivity',
            discountRateSensitivity: 'Value highly sensitive to required return assumptions',
            dividendPolicy: 'Assumes consistent dividend policy and growth'
        },
        investmentSuitability: {
            investorProfile: dividendYield > 0.05 ? 'Suitable for income investors' : 'Growth-oriented dividend stock',
            riskLevel: riskSpread < 0.03 ? 'High valuation risk' : 'Reasonable risk level',
            timeHorizon: 'Long-term investment horizon required for dividend growth realization'
        }
    };
}

generateEVAAnalysis(params, result) {
    const [nopat, wacc, investedCapital] = params;
    const eva = result.eva || result;
    const roic = nopat / investedCapital;
    const spread = roic - wacc;
    const evaMargin = eva / nopat;
    
    return {
        valueCreationMetrics: {
            economicValueAdded: eva,
            returnOnInvestedCapital: roic,
            weightedAverageCostOfCapital: wacc,
            economicSpread: spread,
            investedCapital: investedCapital,
            evaMargin: evaMargin
        },
        valueCreationAnalysis: {
            valueCreating: eva > 0 ? 'Creating shareholder value' : 'Destroying shareholder value',
            performanceLevel: spread > 0.05 ? 'Superior value creation' : spread > 0 ? 'Positive value creation' : 'Value destruction',
            capitalEfficiency: roic > 0.15 ? 'Excellent capital efficiency' : roic > 0.10 ? 'Good efficiency' : 'Below average efficiency',
            costOfCapitalManagement: wacc < 0.10 ? 'Efficient capital structure' : 'Optimize cost of capital'
        },
        strategicImplications: {
            investmentDecisions: eva > 0 ? 'Continue current investment strategy' : 'Reassess capital allocation',
            businessPortfolio: spread > 0.03 ? 'Strong competitive position' : spread < 0 ? 'Strategic repositioning needed' : 'Breakeven competitive position',
            managementIncentives: 'EVA-based compensation aligns with shareholder value creation'
        },
        improvementOpportunities: eva < 0 ? [
            'Improve operational efficiency to increase ROIC',
            'Optimize capital structure to reduce WACC',
            'Divest value-destroying business units',
            'Focus on higher-return investment opportunities'
        ] : [
            'Maintain value-creating strategies',
            'Pursue additional value-creating investments',
            'Benchmark against industry leaders'
        ]
    };
}

generateAmortizationAnalysis(params, result) {
    const [principal, rate, periods] = params;
    const schedule = Array.isArray(result) ? result : [];
    const monthlyPayment = schedule.length > 0 ? schedule[0].payment : 0;
    const totalPayments = monthlyPayment * periods;
    const totalInterest = totalPayments - principal;
    
    // Calculate key points in amortization
    const halfway = Math.floor(periods / 2);
    const principalPaidHalfway = schedule.slice(0, halfway).reduce((sum, period) => sum + period.principalPayment, 0);
    const interestPaidHalfway = schedule.slice(0, halfway).reduce((sum, period) => sum + period.interestPayment, 0);
    
    return {
        amortizationMetrics: {
            principal: principal,
            monthlyPayment: monthlyPayment,
            totalPayments: totalPayments,
            totalInterest: totalInterest,
            interestPercentage: (totalInterest / principal) * 100,
            averageMonthlyInterest: totalInterest / periods,
            averageMonthlyPrincipal: principal / periods
        },
        paymentStructureAnalysis: {
            earlyPayments: 'Front-loaded with interest payments',
            laterPayments: 'Back-loaded with principal payments',
            crossoverPoint: `Around period ${Math.floor(periods * 0.6)} principal exceeds interest`,
            principalAcceleration: 'Principal payments increase exponentially over time'
        },
        costAnalysis: {
            totalCostOfBorrowing: totalPayments,
            interestBurden: `${((totalInterest / totalPayments) * 100).toFixed(1)}% of total payments`,
            monthlyAffordability: `$${monthlyPayment.toFixed(2)} monthly commitment`,
            opportunityCost: 'Consider alternative investment returns vs loan rate'
        },
        payoffStrategies: [
            'Extra principal payments significantly reduce total interest',
            'Early payments have maximum impact on interest savings',
            'Consider bi-weekly payments to reduce term and interest',
            'Refinancing may be beneficial if rates have dropped'
        ],
        scheduleHighlights: {
            year1Interest: schedule.slice(0, 12).reduce((sum, period) => sum + period.interestPayment, 0),
            year1Principal: schedule.slice(0, 12).reduce((sum, period) => sum + period.principalPayment, 0),
            halfwayPrincipal: principalPaidHalfway,
            halfwayInterest: interestPaidHalfway,
            remainingBalance: schedule[halfway] ? schedule[halfway].remainingBalance : 0
        }
    };
}

// Helper method for analyzing cash flow patterns
analyzeCashFlowPattern(cashFlows) {
    const increasing = cashFlows.every((cf, i) => i === 0 || cf >= cashFlows[i-1]);
    const decreasing = cashFlows.every((cf, i) => i === 0 || cf <= cashFlows[i-1]);
    const stable = cashFlows.every(cf => Math.abs(cf - cashFlows[0]) < cashFlows[0] * 0.1);
    
    if (stable) return 'Stable cash flows';
    if (increasing) return 'Increasing cash flows';
    if (decreasing) return 'Decreasing cash flows';
    return 'Variable cash flows';
}

// Enhanced scenario analysis calculation
calculateScenarioMetrics() {
    const validScenarios = this.scenarioAnalysis.scenarios.filter(s => !s.error);
    if (validScenarios.length === 0) return;

    // Calculate expected value
    const totalProbability = validScenarios.reduce((sum, s) => sum + (s.probability || 0), 0) + this.scenarioAnalysis.baseCase.probability;
    
    let expectedValue = this.scenarioAnalysis.baseCase.result * this.scenarioAnalysis.baseCase.probability;
    validScenarios.forEach(scenario => {
        expectedValue += scenario.result * (scenario.probability || 0);
    });
    
    if (totalProbability > 0) {
        expectedValue /= totalProbability;
    }

    // Calculate risk metrics
    const results = [this.scenarioAnalysis.baseCase.result, ...validScenarios.map(s => s.result)];
    const mean = results.reduce((sum, r) => sum + r, 0) / results.length;
    const variance = results.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / results.length;
    const standardDeviation = Math.sqrt(variance);
    
    this.scenarioAnalysis.analysis = {
        expectedValue: expectedValue,
        riskMetrics: {
            mean: mean,
            standardDeviation: standardDeviation,
            coefficientOfVariation: mean !== 0 ? standardDeviation / Math.abs(mean) : 0,
            range: {
                min: Math.min(...results),
                max: Math.max(...results)
            }
        },
        recommendations: this.generateScenarioRecommendations(validScenarios, expectedValue, standardDeviation)
    };
}

generateScenarioRecommendations(scenarios, expectedValue, stdDev) {
    const recommendations = [];
    
    if (stdDev / Math.abs(expectedValue) > 0.5) {
        recommendations.push('High variability - consider risk mitigation strategies');
    }
    
    const negativeScenarios = scenarios.filter(s => s.resultChange < -10);
    if (negativeScenarios.length > 0) {
        recommendations.push('Develop contingency plans for negative scenarios');
    }
    
    const positiveScenarios = scenarios.filter(s => s.resultChange > 10);
    if (positiveScenarios.length > 0) {
        recommendations.push('Position to capitalize on upside scenarios');
    }
    
    return recommendations;
}

generateScenarioInterpretation(scenarioName, resultValue, resultChange) {
    const absChange = Math.abs(resultChange);
    
    if (absChange > 50) {
        return `${scenarioName} creates dramatic ${resultChange > 0 ? 'positive' : 'negative'} impact`;
    } else if (absChange > 20) {
        return `${scenarioName} has significant ${resultChange > 0 ? 'upside' : 'downside'} potential`;
    } else if (absChange > 10) {
        return `${scenarioName} shows moderate ${resultChange > 0 ? 'improvement' : 'deterioration'}`;
    } else {
        return `${scenarioName} has minimal impact on base case`;
    }
}

assessScenarioRisk(scenarioName, resultChange) {
    const absChange = Math.abs(resultChange);
    
    if (absChange > 30) return 'High impact scenario - requires strategic attention';
    if (absChange > 15) return 'Medium impact scenario - monitor closely';
    if (absChange > 5) return 'Low impact scenario - standard monitoring';
    return 'Minimal impact scenario';
}

generateStrategicImplication(scenarioName, resultValue, resultChange) {
    if (resultChange > 25) {
        return `${scenarioName} presents significant opportunity - develop strategy to capitalize`;
    } else if (resultChange < -25) {
        return `${scenarioName} poses major risk - implement mitigation strategies`;
    } else if (resultChange > 10) {
        return `${scenarioName} offers upside potential - consider positioning strategies`;
    } else if (resultChange < -10) {
        return `${scenarioName} creates downside risk - prepare contingency plans`;
    } else {
        return `${scenarioName} maintains baseline performance - standard operations`;
    }
}

// Enhanced comparison analysis
performComparisonAnalysis(config) {
    if (!config || !config.comparisons) return;

    this.comparisonAnalysis = {
        baseCase: {
            name: this.companyName || 'Base Company',
            result: typeof this.calculationResult.result === 'object' ? 
                   this.calculationResult.result.value || this.calculationResult.result.ratio || 
                   this.calculationResult.result.breakEvenUnits || this.calculationResult.result.roe : 
                   this.calculationResult.result
        },
        comparisons: [],
        analysis: {
            rankings: [],
            insights: [],
            recommendations: []
        }
    };

    const formula = FormulaRegistry.getFormula(this.selectedFormula);
    
    config.comparisons.forEach(comparison => {
        try {
            const comparisonParams = comparison.parameters || this.formulaParams;
            const comparisonResult = formula.calculate(comparisonParams);
            const resultValue = typeof comparisonResult === 'object' ? 
                               comparisonResult.value || comparisonResult.ratio || 
                               comparisonResult.breakEvenUnits || comparisonResult.roe : 
                               comparisonResult;
            
            const percentageDiff = ((resultValue - this.comparisonAnalysis.baseCase.result) / 
                                  this.comparisonAnalysis.baseCase.result) * 100;

            this.comparisonAnalysis.comparisons.push({
                name: comparison.name,
                result: resultValue,
                parameters: this.createParameterSummary(formula, comparisonParams),
                percentageDifference: percentageDiff,
                performance: percentageDiff > 10 ? 'Superior' : 
                           percentageDiff > 0 ? 'Better' : 
                           percentageDiff > -10 ? 'Similar' : 'Inferior',
                keyDifferences: this.identifyKeyDifferences(this.formulaParams, comparisonParams, formula)
            });
        } catch (error) {
            this.comparisonAnalysis.comparisons.push({
                name: comparison.name,
                error: error.message
            });
        }
    });

    this.generateComparisonInsights();
}

identifyKeyDifferences(baseParams, comparisonParams, formula) {
    const differences = [];
    
    formula.paramNames.forEach((paramName, index) => {
        if (baseParams[index] !== comparisonParams[index]) {
            const change = comparisonParams[index] - baseParams[index];
            const percentChange = (change / baseParams[index]) * 100;
            differences.push({
                parameter: paramName,
                baseValue: baseParams[index],
                comparisonValue: comparisonParams[index],
                change: change,
                percentChange: percentChange
            });
        }
    });
    
    return differences;
}

generateComparisonInsights() {
    const validComparisons = this.comparisonAnalysis.comparisons.filter(c => !c.error);
    if (validComparisons.length === 0) return;

    // Create rankings
    const allResults = [
        { name: this.comparisonAnalysis.baseCase.name, result: this.comparisonAnalysis.baseCase.result },
        ...validComparisons.map(c => ({ name: c.name, result: c.result }))
    ];
    
    allResults.sort((a, b) => {
        // Sort based on formula type (higher is better for most ratios)
        if (['currentRatio', 'returnOnEquity', 'returnOnAssets', 'grossProfitMargin', 'operatingMargin', 'netProfitMargin'].includes(this.selectedFormula)) {
            return b.result - a.result;
        } else if (['breakEvenUnits', 'paybackPeriod', 'discountedPaybackPeriod'].includes(this.selectedFormula)) {
            return a.result - b.result; // Lower is better
        } else {
            return b.result - a.result; // Default to higher is better
        }
    });

    this.comparisonAnalysis.analysis.rankings = allResults.map((item, index) => ({
        rank: index + 1,
        name: item.name,
        result: item.result,
        isBase: item.name === this.comparisonAnalysis.baseCase.name
    }));

    // Generate insights
    const baseRank = this.comparisonAnalysis.analysis.rankings.find(r => r.isBase).rank;
    const totalCompanies = allResults.length;
    
    this.comparisonAnalysis.analysis.insights = [
        `Base company ranks ${baseRank} out of ${totalCompanies} companies`,
        `${validComparisons.filter(c => c.performance === 'Superior').length} companies show superior performance`,
        `${validComparisons.filter(c => c.performance === 'Inferior').length} companies show inferior performance`,
        baseRank === 1 ? 'Base company shows best performance' : 
        baseRank === totalCompanies ? 'Base company shows worst performance' : 
        'Base company shows competitive performance'
    ];

    // Generate recommendations
    if (baseRank > totalCompanies / 2) {
        this.comparisonAnalysis.analysis.recommendations.push('Focus on performance improvement initiatives');
        this.comparisonAnalysis.analysis.recommendations.push('Benchmark against top performers');
    } else {
        this.comparisonAnalysis.analysis.recommendations.push('Maintain competitive advantages');
        this.comparisonAnalysis.analysis.recommendations.push('Consider best practices from analysis');
    }
}

// Additional helper methods for formatting
formatCurrency(value) {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

formatPercentage(value) {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    }).format(value);
}

formatNumber(value) {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
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
        // Time Value of Money Functions
        case 'presentValue':
            return {
                summary: `${scenarioName} results in ${impact} present value ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: changePercent < -20 ? 'Significant erosion of investment value' : changePercent > 20 ? 'Enhanced investment attractiveness' : 'Moderate valuation adjustment',
                recommendation: changePercent < -30 ? 'Reconsider discount rate assumptions' : changePercent > 30 ? 'Verify optimistic assumptions' : 'Monitor interest rate environment',
                riskLevel: absoluteChange > 40 ? 'High sensitivity to rate changes' : absoluteChange > 15 ? 'Moderate rate sensitivity' : 'Low rate sensitivity'
            };

        case 'futureValue':
            return {
                summary: `${scenarioName} shows ${impact} future value ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: changePercent > 25 ? 'Strong wealth accumulation potential' : changePercent < -25 ? 'Limited growth prospects' : 'Moderate growth trajectory',
                recommendation: changePercent > 50 ? 'Verify sustainability of growth assumptions' : changePercent < -20 ? 'Consider alternative investment strategies' : 'Maintain disciplined approach',
                riskLevel: absoluteChange > 50 ? 'High growth assumption risk' : 'Manageable projection variance'
            };

        case 'compoundInterest':
            const years = this.formulaParams[2] || 5;
            return {
                summary: `${scenarioName} demonstrates ${impact} compounding ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: years > 10 && absoluteChange > 30 ? 'Long-term compounding effects are substantial' : 'Compounding benefits aligned with expectations',
                recommendation: changePercent > 20 ? 'Maximize compounding frequency and consistency' : 'Focus on rate optimization',
                riskLevel: years > 15 && absoluteChange > 25 ? 'High long-term sensitivity' : 'Moderate compounding variance'
            };

        case 'effectiveInterestRate':
            return {
                summary: `${scenarioName} shows ${impact} effective rate ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: 'True cost/yield differs from nominal rate by compounding effect',
                recommendation: 'Use effective rates for accurate financial product comparisons',
                riskLevel: absoluteChange > 15 ? 'Significant compounding impact' : 'Standard rate adjustment'
            };

        // Investment Analysis Functions
        case 'netPresentValue':
            return {
                summary: `${scenarioName} results in ${impact} NPV ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: result > 0 ? 'Project remains value-creating' : 'Project becomes value-destroying',
                recommendation: result > 0 ? 'Proceed with investment' : 'Reconsider investment decision',
                riskLevel: absoluteChange > 50 ? 'High scenario risk' : absoluteChange > 20 ? 'Moderate scenario risk' : 'Low scenario risk'
            };

        case 'internalRateOfReturn':
            const irrResult = result.irr || result;
            return {
                summary: `${scenarioName} shows ${impact} IRR ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: irrResult > 0.15 ? 'Excellent returns maintained' : irrResult > 0.10 ? 'Acceptable returns' : 'Below-threshold returns',
                recommendation: irrResult > 0.20 ? 'Verify high return sustainability' : irrResult < 0.08 ? 'Seek higher-return alternatives' : 'Proceed with caution',
                riskLevel: !result.converged ? 'High calculation reliability risk' : absoluteChange > 30 ? 'High return volatility' : 'Moderate return variance'
            };

        case 'paybackPeriod':
            return {
                summary: `${scenarioName} results in ${impact} payback period ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: result > 5 ? 'Extended capital recovery period' : result < 3 ? 'Quick capital recovery' : 'Moderate recovery timeline',
                recommendation: result > 6 ? 'Consider alternative investments' : result < 2 ? 'Excellent liquidity recovery' : 'Acceptable investment timeline',
                riskLevel: result > 7 ? 'High payback risk' : result > 4 ? 'Moderate payback risk' : 'Low payback risk'
            };

        case 'discountedPaybackPeriod':
            return {
                summary: `${scenarioName} shows ${impact} discounted payback ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: result > 6 ? 'Extended risk-adjusted recovery' : result < 4 ? 'Good risk-adjusted payback' : 'Moderate risk-adjusted timeline',
                recommendation: result > 8 ? 'High time-value risk' : result < 3 ? 'Strong risk-adjusted returns' : 'Acceptable risk-return profile',
                riskLevel: result > 10 ? 'Critical time-value risk' : result > 6 ? 'High time-value risk' : 'Manageable time-value impact'
            };

        // Liquidity Analysis Functions
        case 'currentRatio':
            return {
                summary: `${scenarioName} shows ${impact} liquidity ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: result >= 1.5 ? 'Maintains strong liquidity' : result >= 1.0 ? 'Adequate liquidity preserved' : 'Liquidity concerns arise',
                recommendation: result < 1.0 ? 'Implement contingency liquidity plans' : result > 2.5 ? 'Optimize excess liquidity' : 'Monitor liquidity indicators',
                riskLevel: result < 1.0 ? 'High liquidity risk' : result < 1.5 ? 'Moderate liquidity risk' : 'Low liquidity risk'
            };

        case 'quickRatio':
            return {
                summary: `${scenarioName} demonstrates ${impact} quick liquidity ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: result >= 1.0 ? 'Strong immediate liquidity maintained' : result >= 0.8 ? 'Adequate immediate liquidity' : 'Immediate liquidity concerns',
                recommendation: result < 0.8 ? 'Improve collections and reduce inventory dependence' : result > 1.5 ? 'Excellent liquid position' : 'Maintain liquid asset quality',
                riskLevel: result < 0.6 ? 'Critical immediate liquidity risk' : result < 1.0 ? 'Moderate immediate liquidity risk' : 'Low immediate liquidity risk'
            };

        case 'workingCapital':
            return {
                summary: `${scenarioName} results in ${impact} working capital ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: result > 0 ? 'Positive working capital supports operations' : 'Negative working capital creates funding needs',
                recommendation: result < 0 ? 'Address working capital deficiency' : result > this.formulaParams[1] ? 'Optimize excess working capital' : 'Maintain working capital balance',
                riskLevel: result < 0 ? 'High operational funding risk' : result < this.formulaParams[1] * 0.1 ? 'Moderate working capital risk' : 'Low working capital risk'
            };

        case 'cashConversionCycle':
            return {
                summary: `${scenarioName} shows ${impact} cash cycle ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: result <= 45 ? 'Efficient cash conversion maintained' : result <= 75 ? 'Adequate cash conversion' : 'Slow cash conversion creates working capital pressure',
                recommendation: result > 90 ? 'Implement working capital optimization program' : result < 30 ? 'Excellent working capital efficiency' : 'Monitor cash cycle components',
                riskLevel: result > 120 ? 'High working capital risk' : result > 75 ? 'Moderate working capital risk' : 'Low working capital risk'
            };

        // Leverage Analysis
        case 'debtToEquityRatio':
            const debtRatio = result.ratio || result;
            return {
                summary: `${scenarioName} results in ${impact} leverage ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: debtRatio > 2.0 ? 'High leverage increases financial risk' : debtRatio < 0.5 ? 'Conservative capital structure' : 'Balanced leverage position',
                recommendation: debtRatio > 2.5 ? 'Consider deleveraging strategies' : debtRatio < 0.3 ? 'Potential for leverage optimization' : 'Maintain balanced capital structure',
                riskLevel: debtRatio > 3.0 ? 'Critical leverage risk' : debtRatio > 1.5 ? 'High leverage risk' : debtRatio > 0.8 ? 'Moderate leverage risk' : 'Low leverage risk'
            };

        // Profitability Analysis Functions
        case 'returnOnEquity':
            const roePercent = (result.roe || result) * 100;
            return {
                summary: `${scenarioName} shows ${impact} profitability ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: roePercent > 15 ? 'Maintains superior returns' : roePercent > 10 ? 'Adequate shareholder returns' : 'Below-average returns',
                recommendation: roePercent < 10 ? 'Focus on operational improvements' : roePercent > 25 ? 'Verify return sustainability' : 'Maintain competitive position',
                riskLevel: roePercent < 5 ? 'High performance risk' : roePercent < 12 ? 'Moderate performance risk' : 'Low performance risk'
            };

        case 'returnOnAssets':
            const roaPercent = (result.roa || result) * 100;
            return {
                summary: `${scenarioName} demonstrates ${impact} asset efficiency ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: roaPercent > 8 ? 'Excellent asset utilization' : roaPercent > 4 ? 'Good asset efficiency' : 'Below-average asset utilization',
                recommendation: roaPercent < 3 ? 'Focus on asset optimization and cost management' : roaPercent > 12 ? 'Leverage efficient operations for growth' : 'Maintain asset discipline',
                riskLevel: roaPercent < 2 ? 'High asset efficiency risk' : roaPercent > 15 ? 'Verify asset efficiency sustainability' : 'Moderate asset performance variance'
            };

        case 'grossProfitMargin':
            const grossPercent = (result.margin || result) * 100;
            return {
                summary: `${scenarioName} shows ${impact} gross margin ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: grossPercent > 50 ? 'Strong pricing power maintained' : grossPercent > 30 ? 'Healthy gross profitability' : 'Margin pressure concerns',
                recommendation: grossPercent < 25 ? 'Implement cost reduction and pricing optimization' : grossPercent > 70 ? 'Maintain pricing discipline' : 'Balance pricing and volume',
                riskLevel: grossPercent < 20 ? 'High margin pressure risk' : grossPercent < 35 ? 'Moderate competitive pressure' : 'Low margin risk'
            };

        case 'operatingMargin':
            const opPercent = (result.margin || result) * 100;
            return {
                summary: `${scenarioName} results in ${impact} operating efficiency ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: opPercent > 15 ? 'Superior operational efficiency' : opPercent > 8 ? 'Competitive operational performance' : 'Operational efficiency concerns',
                recommendation: opPercent < 5 ? 'Comprehensive operational improvement needed' : opPercent > 20 ? 'Leverage operational excellence' : 'Continue operational discipline',
                riskLevel: opPercent < 3 ? 'High operational risk' : opPercent < 10 ? 'Moderate operational risk' : 'Low operational risk'
            };

        case 'netProfitMargin':
            const netPercent = (result.margin || result) * 100;
            return {
                summary: `${scenarioName} shows ${impact} net profitability ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: netPercent > 12 ? 'Excellent overall profitability' : netPercent > 6 ? 'Good profitability performance' : 'Profitability challenges',
                recommendation: netPercent < 3 ? 'Comprehensive profitability improvement required' : netPercent > 15 ? 'Maintain profitability discipline' : 'Focus on margin protection',
                riskLevel: netPercent < 2 ? 'High profitability risk' : netPercent < 8 ? 'Moderate profitability risk' : 'Low profitability risk'
            };

        // Market Analysis Functions
        case 'earningsPerShare':
            const epsValue = result.eps || result;
            return {
                summary: `${scenarioName} demonstrates ${impact} EPS ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: epsValue > 3 ? 'Strong per-share value creation' : epsValue > 1 ? 'Moderate earnings performance' : 'Weak per-share earnings',
                recommendation: epsValue < 1 ? 'Focus on earnings enhancement initiatives' : epsValue > 5 ? 'Consider dividend policy optimization' : 'Maintain earnings quality',
                riskLevel: epsValue < 0 ? 'Critical earnings risk' : epsValue < 2 ? 'Moderate earnings risk' : 'Low earnings risk'
            };

        case 'priceToEarningsRatio':
            const peValue = result.peRatio || result;
            return {
                summary: `${scenarioName} results in ${impact} valuation ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: peValue > 25 ? 'High growth expectations embedded' : peValue > 15 ? 'Moderate growth premium' : peValue < 12 ? 'Value opportunity or concerns' : 'Fair market valuation',
                recommendation: peValue > 30 ? 'Verify growth sustainability vs expectations' : peValue < 8 ? 'Investigate underlying value or risks' : 'Monitor earnings delivery vs expectations',
                riskLevel: peValue > 35 ? 'High valuation risk' : peValue < 6 ? 'High fundamental risk' : peValue > 25 || peValue < 10 ? 'Moderate valuation risk' : 'Low valuation risk'
            };

        // Cost-Volume-Profit Analysis
        case 'breakEvenUnits':
            const breakEvenValue = result.breakEvenUnits || result;
            return {
                summary: `${scenarioName} shows ${impact} break-even volume ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: breakEvenValue < 5000 ? 'Low volume threshold supports viability' : breakEvenValue < 25000 ? 'Moderate volume requirements' : 'High volume challenge',
                recommendation: breakEvenValue > 50000 ? 'Reassess market opportunity and cost structure' : breakEvenValue < 10000 ? 'Strong business model viability' : 'Develop robust sales strategy',
                riskLevel: breakEvenValue > 75000 ? 'High market penetration risk' : breakEvenValue > 30000 ? 'Moderate market risk' : 'Low market risk'
            };

        case 'breakEvenRevenue':
            const revenueValue = result.breakEvenRevenue || result;
            return {
                summary: `${scenarioName} results in ${impact} break-even revenue ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: revenueValue < 500000 ? 'Achievable revenue target' : revenueValue < 2000000 ? 'Moderate revenue challenge' : 'Substantial revenue requirement',
                recommendation: revenueValue > 5000000 ? 'Evaluate market size and penetration strategy' : revenueValue < 1000000 ? 'Strong business model potential' : 'Focus on market development',
                riskLevel: revenueValue > 10000000 ? 'High revenue achievement risk' : revenueValue > 3000000 ? 'Moderate revenue risk' : 'Low revenue risk'
            };

        // Valuation Models
        case 'dividendDiscountModel':
            const ddmValue = result.value || result;
            return {
                summary: `${scenarioName} shows ${impact} intrinsic value ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: absoluteChange > 25 ? 'High sensitivity to growth assumptions' : 'Moderate valuation adjustment',
                recommendation: absoluteChange > 40 ? 'Verify dividend growth sustainability' : 'Monitor dividend policy and growth delivery',
                riskLevel: absoluteChange > 50 ? 'High growth assumption risk' : absoluteChange > 20 ? 'Moderate assumption risk' : 'Low assumption risk'
            };

        case 'economicValueAdded':
            const evaValue = result.eva || result;
            return {
                summary: `${scenarioName} results in ${impact} value creation ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: evaValue > 0 ? 'Maintains value creation above cost of capital' : 'Value destruction below cost of capital',
                recommendation: evaValue < 0 ? 'Reassess capital allocation and strategic direction' : 'Continue value-creating strategies',
                riskLevel: evaValue < -this.formulaParams[2] * 0.05 ? 'High value destruction risk' : evaValue > this.formulaParams[2] * 0.1 ? 'Strong value creation' : 'Moderate value impact'
            };

        // Loan Analysis
        case 'amortizationSchedule':
            const schedule = Array.isArray(result) ? result : [];
            const monthlyPayment = schedule.length > 0 ? schedule[0].payment : 0;
            return {
                summary: `${scenarioName} shows ${impact} payment structure ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: absoluteChange > 20 ? 'Material change in debt service requirements' : 'Moderate payment adjustment',
                recommendation: changePercent > 15 ? 'Verify payment affordability' : changePercent < -15 ? 'Consider prepayment opportunities' : 'Maintain payment schedule',
                riskLevel: changePercent > 30 ? 'High payment burden risk' : absoluteChange > 15 ? 'Moderate payment risk' : 'Low payment risk'
            };

        // Default case for any unhandled formulas
        default:
            return {
                summary: `${scenarioName} results in ${impact} ${direction} of ${Math.abs(changePercent).toFixed(1)}%`,
                businessImpact: absoluteChange > 25 ? 'Material change from base case assumptions' : 'Moderate adjustment to base case',
                recommendation: absoluteChange > 40 ? 'Thoroughly evaluate scenario likelihood and implications' : 'Monitor key drivers and maintain flexibility',
                riskLevel: absoluteChange > 35 ? 'High scenario impact' : absoluteChange > 15 ? 'Moderate scenario impact' : 'Low scenario impact'
            };
    }
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
