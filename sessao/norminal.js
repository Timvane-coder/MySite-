// Enhanced StatisticalWorkbook.js with Z-Distribution and Target Analysis Features

import { createCanvas } from '@napi-rs/canvas';
import * as math from 'mathjs';
import fs from 'fs';
import path from 'path';

export class StatisticalWorkbook {
    constructor(options = {}) {
        this.width = options.width || 1200;
        this.height = options.height || 1600;
        this.theme = options.theme || "excel";
        
        // Spreadsheet styling
        this.cellWidth = 180;
        this.cellHeight = 25;
        this.headerHeight = 30;
        this.rowLabelWidth = 50;
        this.fontSize = 11;
        
        // Survey data storage
        this.rawSamples = [];
        this.sampleName = "";
        this.variableName = "";
        this.unitName = "";
        this.scenarioDescription = "";
        this.knownPopulationStd = null;
        this.knownPopulationMean = null; // NEW: For z-test analysis
        this.targetValue = null; // NEW: Target value for decision analysis
        this.decisionCriteria = null; // NEW: Decision criteria
        
        // Calculated statistics
        this.statistics = {};
        this.confidenceIntervals = {};
        this.hypothesisTests = {}; // NEW: Hypothesis test results
        this.targetAnalysis = {}; // NEW: Target value analysis
        this.zDistributionAnalysis = {}; // NEW: Z-distribution specific analysis
        this.calculationHistory = [];
        this.currentWorkbook = null;
        
        // Theme colors
        this.setThemeColors();
        
        // Statistical analysis templates
        this.analysisTemplates = this.initializeAnalysisTemplates();
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
            },
            googlesheets: {
                background: '#ffffff',
                gridColor: '#e0e0e0',
                headerBg: '#1a73e8',
                headerText: '#ffffff',
                sectionBg: '#e8f0fe',
                sectionText: '#3c4043',
                cellBg: '#ffffff',
                cellText: '#202124',
                resultBg: '#e6f4ea',
                resultText: '#137333',
                formulaBg: '#fef7e0',
                formulaText: '#b06000',
                borderColor: '#dadce0'
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
                borderColor: '#4682b4'
            }
        };
        
        this.colors = themes[this.theme] || themes.excel;
    }

    initializeAnalysisTemplates() {
        return {
            'confidenceinterval': {
                type: 'statistical',
                description: 'Confidence Interval Analysis',
                requiredFields: ['samples', 'variableName', 'unitName'],
                template: (data) => this.generateConfidenceIntervalTemplate(data)
            }
        };
    }
    // ... [Previous methods remain the same until inputSurveyData] ...

    // Enhanced main method to input survey data with target analysis
    inputSurveyData(config) {
        this.sampleName = config.sampleName || "Survey Sample";
        this.variableName = config.variableName || "Value";
        this.unitName = config.unitName || "units";
        this.scenarioDescription = config.scenarioDescription || "";
        this.knownPopulationStd = config.knownPopulationStd || null;
        this.knownPopulationMean = config.knownPopulationMean || null; // NEW
        this.targetValue = config.targetValue || null; // NEW
        this.decisionCriteria = config.decisionCriteria || null; // NEW
        this.rawSamples = [...config.samples];
        
        // Calculate basic statistics
        this.calculateStatistics();
        
        // Calculate confidence intervals
        this.calculateConfidenceIntervals();
        
        // NEW: Calculate hypothesis tests if population parameters known
        if (this.knownPopulationStd && this.knownPopulationMean) {
            this.calculateHypothesisTests();
        }
        
        // NEW: Calculate target analysis if target value provided
        if (this.targetValue !== null) {
            this.calculateTargetAnalysis();
        }
        
        // NEW: Enhanced z-distribution analysis
        if (this.knownPopulationStd) {
            this.calculateZDistributionAnalysis();
        }
        
        // Generate the workbook
        this.generateWorkbook();
        
        return this.currentWorkbook;
    }


    calculateStatistics() {
        const n = this.rawSamples.length;
        const sum = this.rawSamples.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        
        // Calculate sample standard deviation
        const variance = this.rawSamples.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
        const sampleStd = Math.sqrt(variance);
        
        // Sort for percentiles
        const sorted = [...this.rawSamples].sort((a, b) => a - b);
        const median = n % 2 === 0 
            ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
            : sorted[Math.floor(n/2)];
        
        this.statistics = {
            n: n,
            sum: sum,
            mean: mean,
            sampleStd: sampleStd,
            populationStd: this.knownPopulationStd,
            standardError: this.knownPopulationStd 
                ? this.knownPopulationStd / Math.sqrt(n)
                : sampleStd / Math.sqrt(n),
            min: Math.min(...this.rawSamples),
            max: Math.max(...this.rawSamples),
            median: median,
            range: Math.max(...this.rawSamples) - Math.min(...this.rawSamples)
        };
    }

    calculateConfidenceIntervals() {
        const confidenceLevels = [0.90, 0.95, 0.99];
        this.confidenceIntervals = {};
        
        confidenceLevels.forEach(level => {
            const alpha = 1 - level;
            let critical, marginError, lowerBound, upperBound;
            
            if (this.knownPopulationStd) {
                // Use normal distribution (z-distribution)
                critical = this.getZCritical(alpha / 2);
                marginError = critical * this.statistics.standardError;
            } else {
                // Use t-distribution
                const df = this.statistics.n - 1;
                critical = this.getTCritical(alpha / 2, df);
                marginError = critical * this.statistics.standardError;
            }
            
            lowerBound = this.statistics.mean - marginError;
            upperBound = this.statistics.mean + marginError;
            
            this.confidenceIntervals[level] = {
                level: level,
                alpha: alpha,
                critical: critical,
                marginError: marginError,
                lowerBound: lowerBound,
                upperBound: upperBound,
                width: upperBound - lowerBound,
                distributionType: this.knownPopulationStd ? 'normal' : 't'
            };
        });
    }

    getZCritical(alpha) {
        // Common z-values for confidence intervals
        const zTable = {
            0.005: 2.5758,  // 99%
            0.025: 1.9600,  // 95%
            0.05: 1.6449    // 90%
        };
        return zTable[alpha] || 1.96;
    }

    getTCritical(alpha, df) {
    // Comprehensive t-table for common alpha values and degrees of freedom
    const tTable = {
        // 99% confidence interval (alpha/2 = 0.005)
        0.005: { 
            1: 63.657, 2: 9.925, 3: 5.841, 4: 4.604, 5: 4.032, 6: 3.707, 7: 3.499, 8: 3.355, 9: 3.250, 10: 3.169,
            11: 3.106, 12: 3.055, 13: 3.012, 14: 2.977, 15: 2.947, 16: 2.921, 17: 2.898, 18: 2.878, 19: 2.861, 20: 2.845,
            21: 2.831, 22: 2.819, 23: 2.807, 24: 2.797, 25: 2.787, 26: 2.779, 27: 2.771, 28: 2.763, 29: 2.756, 30: 2.750,
            40: 2.704, 50: 2.678, 60: 2.660, 80: 2.639, 100: 2.626, 120: 2.617, 150: 2.609, 200: 2.601, 300: 2.592, 500: 2.586, 1000: 2.581
        },
        // 95% confidence interval (alpha/2 = 0.025)
        0.025: { 
            1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
            11: 2.201, 12: 2.179, 13: 2.160, 14: 2.145, 15: 2.131, 16: 2.120, 17: 2.110, 18: 2.101, 19: 2.093, 20: 2.086,
            21: 2.080, 22: 2.074, 23: 2.069, 24: 2.064, 25: 2.060, 26: 2.056, 27: 2.052, 28: 2.048, 29: 2.045, 30: 2.042,
            40: 2.021, 50: 2.009, 60: 2.000, 80: 1.990, 100: 1.984, 120: 1.980, 150: 1.976, 200: 1.972, 300: 1.968, 500: 1.965, 1000: 1.962
        },
        // 90% confidence interval (alpha/2 = 0.05)
        0.05: { 
            1: 6.314, 2: 2.920, 3: 2.353, 4: 2.132, 5: 2.015, 6: 1.943, 7: 1.895, 8: 1.860, 9: 1.833, 10: 1.812,
            11: 1.796, 12: 1.782, 13: 1.771, 14: 1.761, 15: 1.753, 16: 1.746, 17: 1.740, 18: 1.734, 19: 1.729, 20: 1.725,
            21: 1.721, 22: 1.717, 23: 1.714, 24: 1.711, 25: 1.708, 26: 1.706, 27: 1.703, 28: 1.701, 29: 1.699, 30: 1.697,
            40: 1.684, 50: 1.676, 60: 1.671, 80: 1.664, 100: 1.660, 120: 1.658, 150: 1.655, 200: 1.653, 300: 1.650, 500: 1.648, 1000: 1.646
        },
        // 80% confidence interval (alpha/2 = 0.1)
        0.1: { 
            1: 3.078, 2: 1.886, 3: 1.638, 4: 1.533, 5: 1.476, 6: 1.440, 7: 1.415, 8: 1.397, 9: 1.383, 10: 1.372,
            11: 1.363, 12: 1.356, 13: 1.350, 14: 1.345, 15: 1.341, 16: 1.337, 17: 1.333, 18: 1.330, 19: 1.328, 20: 1.325,
            21: 1.323, 22: 1.321, 23: 1.319, 24: 1.318, 25: 1.316, 26: 1.315, 27: 1.314, 28: 1.313, 29: 1.311, 30: 1.310,
            40: 1.303, 50: 1.299, 60: 1.296, 80: 1.292, 100: 1.290, 120: 1.289, 150: 1.287, 200: 1.286, 300: 1.284, 500: 1.283, 1000: 1.282
        }
    };

    // Round alpha to avoid floating point precision issues
    const roundedAlpha = Math.round(alpha * 1000) / 1000;
    
    // Check if the alpha value exists in our table
    if (!tTable[roundedAlpha]) {
        console.warn(`Alpha value ${alpha} (rounded to ${roundedAlpha}) not found in t-table.`);
        console.warn(`Available alpha values: ${Object.keys(tTable).join(', ')}`);
        
        // Try to find the closest alpha value
        const availableAlphas = Object.keys(tTable).map(Number);
        const closestAlpha = availableAlphas.reduce((prev, curr) => 
            Math.abs(curr - roundedAlpha) < Math.abs(prev - roundedAlpha) ? curr : prev
        );
        
        console.warn(`Using closest available alpha: ${closestAlpha}`);
        return this.getTCritical(closestAlpha, df);
    }
    
    // Get available degrees of freedom for this alpha level
    const availableDf = Object.keys(tTable[roundedAlpha]).map(Number).sort((a, b) => a - b);
    
    // Find the closest degrees of freedom (use next higher value for conservative estimate)
    let closestDf;
    if (df <= availableDf[0]) {
        // If df is smaller than our smallest table value, use the smallest
        closestDf = availableDf[0];
        if (df < availableDf[0]) {
            console.warn(`Degrees of freedom ${df} is smaller than table minimum ${availableDf[0]}. Using ${availableDf[0]} (conservative estimate).`);
        }
    } else if (df >= availableDf[availableDf.length - 1]) {
        // If df is larger than our largest table value, use the largest
        closestDf = availableDf[availableDf.length - 1];
    } else {
        // Find the next higher value for conservative estimate
        closestDf = availableDf.find(d => d >= df);
        if (!closestDf) {
            // Fallback: find the closest value
            closestDf = availableDf.reduce((prev, curr) => 
                Math.abs(curr - df) < Math.abs(prev - df) ? curr : prev
            );
        }
    }
    
    const criticalValue = tTable[roundedAlpha][closestDf];
    
    // Add debugging information for unusual cases
    if (df !== closestDf || alpha !== roundedAlpha) {
        console.log(`t-critical lookup: alpha=${alpha} (using ${roundedAlpha}), df=${df} (using ${closestDf}) => t=${criticalValue}`);
    }
    
    return criticalValue;
  }

    // NEW: Calculate hypothesis tests (z-tests)
    calculateHypothesisTests() {
        if (!this.knownPopulationStd || !this.knownPopulationMean) return;
        
        const sampleMean = this.statistics.mean;
        const n = this.statistics.n;
        const populationMean = this.knownPopulationMean;
        const populationStd = this.knownPopulationStd;
        
        // Calculate z-statistic
        const standardError = populationStd / Math.sqrt(n);
        const zStatistic = (sampleMean - populationMean) / standardError;
        
        // Calculate p-values for different alternative hypotheses
        const pValueTwoTailed = 2 * (1 - this.normalCDF(Math.abs(zStatistic)));
        const pValueLeftTailed = this.normalCDF(zStatistic);
        const pValueRightTailed = 1 - this.normalCDF(zStatistic);
        
        // Common significance levels
        const alphaLevels = [0.01, 0.05, 0.10];
        
        this.hypothesisTests = {
            populationMean: populationMean,
            sampleMean: sampleMean,
            zStatistic: zStatistic,
            standardError: standardError,
            pValues: {
                twoTailed: pValueTwoTailed,
                leftTailed: pValueLeftTailed,
                rightTailed: pValueRightTailed
            },
            criticalValues: {
                twoTailed: alphaLevels.map(alpha => ({
                    alpha: alpha,
                    zCritical: this.getZCritical(alpha/2),
                    reject: Math.abs(zStatistic) > this.getZCritical(alpha/2)
                })),
                leftTailed: alphaLevels.map(alpha => ({
                    alpha: alpha,
                    zCritical: -this.getZCritical(alpha),
                    reject: zStatistic < -this.getZCritical(alpha)
                })),
                rightTailed: alphaLevels.map(alpha => ({
                    alpha: alpha,
                    zCritical: this.getZCritical(alpha),
                    reject: zStatistic > this.getZCritical(alpha)
                }))
            }
        };
    }

    // NEW: Calculate target analysis and decision making
    calculateTargetAnalysis() {
        if (this.targetValue === null) return;
        
        const sampleMean = this.statistics.mean;
        const standardError = this.statistics.standardError;
        const target = this.targetValue;
        
        // Calculate probability that population mean equals target
        let zScore, probabilityAnalysis;
        
        if (this.knownPopulationStd) {
            // Use known population standard deviation
            zScore = (sampleMean - target) / standardError;
            
            // Calculate probability of observing this sample mean or more extreme
            const pValueTwoTailed = 2 * (1 - this.normalCDF(Math.abs(zScore)));
            const pValueGreater = 1 - this.normalCDF(zScore);
            const pValueLess = this.normalCDF(zScore);
            
            probabilityAnalysis = {
                zScore: zScore,
                pValueTwoTailed: pValueTwoTailed,
                pValueGreater: pValueGreater,
                pValueLess: pValueLess,
                distributionType: 'normal'
            };
        } else {
            // Use t-distribution
            const tScore = (sampleMean - target) / standardError;
            const df = this.statistics.n - 1;
            
            probabilityAnalysis = {
                tScore: tScore,
                degreesOfFreedom: df,
                distributionType: 't'
                // Note: Would need t-distribution CDF for exact p-values
            };
        }
        
        // Decision analysis based on confidence intervals
        const decisionsByConfidence = {};
        Object.entries(this.confidenceIntervals).forEach(([level, ci]) => {
            const contains = target >= ci.lowerBound && target <= ci.upperBound;
            const distance = contains ? 0 : Math.min(
                Math.abs(target - ci.lowerBound),
                Math.abs(target - ci.upperBound)
            );
            
            decisionsByConfidence[level] = {
                contains: contains,
                decision: contains ? 'Cannot reject that μ = target' : 'Evidence suggests μ ≠ target',
                distance: distance,
                confidenceLevel: Math.round(level * 100)
            };
        });
        
        // Effect size analysis
        const effectSize = this.knownPopulationStd ? 
            Math.abs(sampleMean - target) / this.knownPopulationStd :
            Math.abs(sampleMean - target) / this.statistics.sampleStd;
        
        // Practical significance assessment
        let practicalSignificance = 'Small';
        if (effectSize >= 0.8) practicalSignificance = 'Large';
        else if (effectSize >= 0.5) practicalSignificance = 'Medium';
        
        this.targetAnalysis = {
            targetValue: target,
            sampleMean: sampleMean,
            difference: sampleMean - target,
            percentDifference: ((sampleMean - target) / target) * 100,
            effectSize: effectSize,
            practicalSignificance: practicalSignificance,
            probabilityAnalysis: probabilityAnalysis,
            decisionsByConfidence: decisionsByConfidence,
            recommendation: this.generateTargetRecommendation(decisionsByConfidence, effectSize)
        };
    }

    // NEW: Enhanced z-distribution specific analysis
    calculateZDistributionAnalysis() {
        if (!this.knownPopulationStd) return;
        
        const sampleMean = this.statistics.mean;
        const n = this.statistics.n;
        const populationStd = this.knownPopulationStd;
        
        // Sampling distribution properties
        const samplingDistribution = {
            mean: this.knownPopulationMean || sampleMean, // Best estimate
            standardError: populationStd / Math.sqrt(n),
            shape: 'normal',
            standardized: true
        };
        
        // Z-score of sample mean (if population mean known)
        let sampleZScore = null;
        if (this.knownPopulationMean) {
            sampleZScore = (sampleMean - this.knownPopulationMean) / samplingDistribution.standardError;
        }
        
        // Probability calculations for various scenarios
        const probabilities = {};
        
        // If we know the population mean, calculate probabilities
        if (this.knownPopulationMean) {
            const populationMean = this.knownPopulationMean;
            probabilities.sampleMeanProbabilities = {
                exactlyObserved: 0, // Continuous distribution
                moreExtreme: 2 * (1 - this.normalCDF(Math.abs(sampleZScore))),
                greaterThanObserved: 1 - this.normalCDF(sampleZScore),
                lessThanObserved: this.normalCDF(sampleZScore)
            };
        }
        
        // Power analysis for different effect sizes (if population mean known)
        let powerAnalysis = null;
        if (this.knownPopulationMean && this.targetValue) {
            powerAnalysis = this.calculatePowerAnalysis();
        }
        
        // Sample size analysis
        const sampleSizeAnalysis = this.calculateSampleSizeAnalysis();
        
        this.zDistributionAnalysis = {
            samplingDistribution: samplingDistribution,
            sampleZScore: sampleZScore,
            probabilities: probabilities,
            powerAnalysis: powerAnalysis,
            sampleSizeAnalysis: sampleSizeAnalysis,
            centralLimitTheorem: {
                applies: n >= 30 || this.knownPopulationStd !== null,
                explanation: n >= 30 ? 
                    "CLT ensures normal sampling distribution (n ≥ 30)" :
                    "Normal sampling distribution due to known population σ"
            }
        };
    }

    // NEW: Power analysis calculations
    calculatePowerAnalysis() {
        if (!this.knownPopulationStd || !this.knownPopulationMean || !this.targetValue) return null;
        
        const n = this.statistics.n;
        const populationStd = this.knownPopulationStd;
        const populationMean = this.knownPopulationMean;
        const alternativeMean = this.targetValue;
        const standardError = populationStd / Math.sqrt(n);
        
        const alphaLevels = [0.01, 0.05, 0.10];
        const powerResults = {};
        
        alphaLevels.forEach(alpha => {
            const zAlpha = this.getZCritical(alpha/2); // Two-tailed
            const criticalValue1 = populationMean - zAlpha * standardError;
            const criticalValue2 = populationMean + zAlpha * standardError;
            
            // Calculate power (1 - β)
            const z1 = (criticalValue1 - alternativeMean) / standardError;
            const z2 = (criticalValue2 - alternativeMean) / standardError;
            const beta = this.normalCDF(z2) - this.normalCDF(z1);
            const power = 1 - beta;
            
            powerResults[alpha] = {
                alpha: alpha,
                beta: beta,
                power: power,
                criticalValues: [criticalValue1, criticalValue2],
                effectSize: Math.abs(populationMean - alternativeMean) / populationStd
            };
        });
        
        return powerResults;
    }

    // NEW: Sample size analysis for different margins of error
    calculateSampleSizeAnalysis() {
        if (!this.knownPopulationStd) return null;
        
        const populationStd = this.knownPopulationStd;
        const confidenceLevels = [0.90, 0.95, 0.99];
        const marginsOfError = [
            populationStd * 0.1,  // 10% of std dev
            populationStd * 0.2,  // 20% of std dev
            populationStd * 0.5   // 50% of std dev
        ];
        
        const sampleSizeTable = {};
        
        confidenceLevels.forEach(confidence => {
            const zValue = this.getZCritical((1 - confidence) / 2);
            sampleSizeTable[confidence] = {};
            
            marginsOfError.forEach(margin => {
                const requiredN = Math.ceil(Math.pow(zValue * populationStd / margin, 2));
                sampleSizeTable[confidence][margin] = {
                    marginOfError: margin,
                    requiredSampleSize: requiredN,
                    currentMargin: zValue * populationStd / Math.sqrt(this.statistics.n),
                    improvement: requiredN > this.statistics.n ? 
                        `Need ${requiredN - this.statistics.n} more observations` :
                        `Current sample size is adequate`
                };
            });
        });
        
        return sampleSizeTable;
    }

    // NEW: Generate target recommendation
    generateTargetRecommendation(decisionsByConfidence, effectSize) {
        const ci95 = decisionsByConfidence[0.95];
        if (!ci95) return "Insufficient data for recommendation";
        
        let recommendation = "";
        
        if (ci95.contains) {
            if (effectSize < 0.2) {
                recommendation = "ACCEPT: The data is consistent with the target value. The difference is not statistically or practically significant.";
            } else {
                recommendation = "CAUTION: While not statistically significant, there may be a practically meaningful difference. Consider increasing sample size.";
            }
        } else {
            if (effectSize >= 0.8) {
                recommendation = "REJECT: Strong evidence against the target value. The difference is both statistically and practically significant.";
            } else if (effectSize >= 0.5) {
                recommendation = "LIKELY REJECT: Moderate evidence against the target value. The difference appears meaningful.";
            } else {
                recommendation = "WEAK EVIDENCE: Some evidence against the target value, but effect size is small. Consider practical importance.";
            }
        }
        
        return recommendation;
    }

    // NEW: Normal CDF approximation
    normalCDF(z) {
        // Abramowitz and Stegun approximation
        const sign = z < 0 ? -1 : 1;
        z = Math.abs(z);
        
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;
        
        const t = 1.0 / (1.0 + p * z);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
        
        return 0.5 + sign * (y - 0.5);
    }

    // Enhanced workbook generation with new analyses
    generateWorkbook() {
        const workbookData = this.generateEnhancedTemplate();
        
        this.currentWorkbook = {
            type: 'enhanced_statistical_analysis',
            sampleName: this.sampleName,
            variableName: this.variableName,
            unitName: this.unitName,
            data: workbookData,
            statistics: this.statistics,
            confidenceIntervals: this.confidenceIntervals,
            hypothesisTests: this.hypothesisTests, // NEW
            targetAnalysis: this.targetAnalysis, // NEW
            zDistributionAnalysis: this.zDistributionAnalysis, // NEW
            rawSamples: this.rawSamples,
            generated: new Date().toISOString()
        };
        
        this.calculationHistory.push({
            type: 'enhanced_statistical_analysis',
            sampleName: this.sampleName,
            sampleSize: this.statistics.n,
            hasTargetAnalysis: this.targetValue !== null,
            hasHypothesisTests: Object.keys(this.hypothesisTests).length > 0,
            timestamp: new Date().toISOString()
        });
        
        return this.currentWorkbook;
    }

    generateConfidenceIntervalTemplate() {
        const data = [];
        
        // Title Section
        data.push([
            { value: `${this.sampleName.toUpperCase()} - CONFIDENCE INTERVAL ANALYSIS`, type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);
        
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        
        // Scenario Description
        if (this.scenarioDescription) {
            data.push([
                { value: 'SCENARIO DESCRIPTION', type: 'section' },
                { value: '', type: 'section' },
                { value: '', type: 'section' },
                { value: '', type: 'section' }
            ]);
            data.push([
                { value: this.scenarioDescription, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        }
        
        // Sample Data Section (first 10 rows)
        data.push([
            { value: `SAMPLE DATA (${this.statistics.n} OBSERVATIONS)`, type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);
        
        data.push([
            { value: 'Observation #', type: 'header' },
            { value: `${this.variableName} (${this.unitName})`, type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);
        
        // Show first 10 data points
        for (let i = 0; i < Math.min(10, this.rawSamples.length); i++) {
            data.push([
                { value: i + 1, type: 'data' },
                { value: this.rawSamples[i].toFixed(3), type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }
        
        if (this.rawSamples.length > 10) {
            data.push([
                { value: '...', type: 'data' },
                { value: `(${this.rawSamples.length - 10} more observations)`, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }
        
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        
        // Sample Statistics
        data.push([
            { value: 'SAMPLE STATISTICS', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);
        
        const stats = [
            ['Sample Size (n):', this.statistics.n],
            [`Sample Mean (x̄):`, `${this.statistics.mean.toFixed(3)} ${this.unitName}`],
            [`Sample Std Dev (s):`, `${this.statistics.sampleStd.toFixed(3)} ${this.unitName}`],
        ];
        
        if (this.knownPopulationStd) {
            stats.push([`KNOWN Population Std Dev (σ):`, `${this.knownPopulationStd.toFixed(3)} ${this.unitName}`]);
        }
        
        stats.push(
            [`Standard Error:`, `${this.statistics.standardError.toFixed(4)} ${this.unitName}`],
            [`Minimum ${this.variableName}:`, `${this.statistics.min.toFixed(3)} ${this.unitName}`],
            [`Maximum ${this.variableName}:`, `${this.statistics.max.toFixed(3)} ${this.unitName}`],
            [`Median ${this.variableName}:`, `${this.statistics.median.toFixed(3)} ${this.unitName}`]
        );
        
        stats.forEach(([label, value]) => {
            data.push([
                { value: label, type: 'label' },
                { value: value, type: 'result' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        });
        
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        
        // Confidence Intervals
        const distributionName = this.knownPopulationStd ? 'NORMAL DISTRIBUTION' : 'T-DISTRIBUTION';
        const distributionNote = this.knownPopulationStd ? '(σ Known)' : '(σ Unknown)';
        
        data.push([
            { value: `${distributionName} CONFIDENCE INTERVALS ${distributionNote}`, type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);
        
        // Add confidence intervals for each level
        Object.values(this.confidenceIntervals).forEach(ci => {
            const percentage = Math.round(ci.level * 100);
            
            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
            data.push([
                { value: `${percentage}% CONFIDENCE INTERVAL`, type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);
            
            const ciData = [
                ['Confidence Level:', `${percentage}%`],
                ['Sample Size (n):', this.statistics.n],
                [`Sample Mean (x̄):`, `${this.statistics.mean.toFixed(3)} ${this.unitName}`],
            ];
            
            if (this.knownPopulationStd) {
                ciData.push([`Known Pop Std Dev (σ):`, `${this.knownPopulationStd.toFixed(3)} ${this.unitName}`]);
                ciData.push([`z-critical (two-tailed):`, ci.critical.toFixed(4)]);
            } else {
                ciData.push([`Sample Std Dev (s):`, `${this.statistics.sampleStd.toFixed(3)} ${this.unitName}`]);
                ciData.push([`t-critical (two-tailed):`, ci.critical.toFixed(4)]);
                ciData.push([`Degrees of Freedom:`, this.statistics.n - 1]);
            }
            
            ciData.push(
                [`Standard Error:`, `${this.statistics.standardError.toFixed(4)} ${this.unitName}`],
                [`Margin of Error:`, `${ci.marginError.toFixed(3)} ${this.unitName}`],
                [`Lower Bound:`, `${ci.lowerBound.toFixed(3)} ${this.unitName}`],
                [`Upper Bound:`, `${ci.upperBound.toFixed(3)} ${this.unitName}`],
                [`Confidence Interval:`, `[${ci.lowerBound.toFixed(3)}, ${ci.upperBound.toFixed(3)}] ${this.unitName}`]
            );
            
            ciData.forEach(([label, value]) => {
                data.push([
                    { value: label, type: 'label' },
                    { value: value, type: 'result' },
                    { value: '', type: 'data' },
                    { value: '', type: 'data' }
                ]);
            });
            
            // Add interpretation
            data.push([
                { value: 'Interpretation:', type: 'label' },
                { value: `We are ${percentage}% confident that the true population mean`, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
            data.push([
                { value: '', type: 'data' },
                { value: `${this.variableName.toLowerCase()} is between ${ci.lowerBound.toFixed(2)} and ${ci.upperBound.toFixed(2)} ${this.unitName}.`, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        });
        
        // Detailed calculation walkthrough for 95% CI
        const ci95 = this.confidenceIntervals[0.95];
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'DETAILED CALCULATION WALKTHROUGH (95% Confidence Interval)', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);
        
        const steps = [
            {
                title: 'Step 1: Identify known parameters',
                details: [
                    `Sample size: n = ${this.statistics.n}`,
                    this.knownPopulationStd 
                        ? `Known population std dev: σ = ${this.knownPopulationStd} ${this.unitName}`
                        : `Sample std dev: s = ${this.statistics.sampleStd.toFixed(3)} ${this.unitName}`
                ]
            },
            {
                title: 'Step 2: Calculate sample mean',
                details: [
                    `Sample mean: x̄ = Σx/n = ${this.statistics.mean.toFixed(3)} ${this.unitName}`
                ]
            },
            {
                title: 'Step 3: Calculate standard error',
                details: [
                    this.knownPopulationStd
                        ? `Standard error: SE = σ/√n = ${this.knownPopulationStd}/√${this.statistics.n} = ${this.statistics.standardError.toFixed(4)} ${this.unitName}`
                        : `Standard error: SE = s/√n = ${this.statistics.sampleStd.toFixed(3)}/√${this.statistics.n} = ${this.statistics.standardError.toFixed(4)} ${this.unitName}`
                ]
            },
            {
                title: `Step 4: Find ${this.knownPopulationStd ? 'z' : 't'}-critical value`,
                details: [
                    this.knownPopulationStd
                        ? `For 95% CI (α = 0.05, two-tailed): z₀.₀₂₅ = ${ci95.critical.toFixed(4)}`
                        : `For 95% CI (α = 0.05, two-tailed, df = ${this.statistics.n - 1}): t₀.₀₂₅ = ${ci95.critical.toFixed(4)}`
                ]
            },
            {
                title: 'Step 5: Calculate margin of error',
                details: [
                    `Margin of error: ME = ${this.knownPopulationStd ? 'z' : 't'} × SE = ${ci95.critical.toFixed(4)} × ${this.statistics.standardError.toFixed(4)} = ${ci95.marginError.toFixed(4)}`
                ]
            },
            {
                title: 'Step 6: Construct confidence interval',
                details: [
                    `CI = x̄ ± ME = ${this.statistics.mean.toFixed(3)} ± ${ci95.marginError.toFixed(4)}`,
                    `CI = [${this.statistics.mean.toFixed(3)} - ${ci95.marginError.toFixed(4)}, ${this.statistics.mean.toFixed(3)} + ${ci95.marginError.toFixed(4)}]`,
                    `CI = [${ci95.lowerBound.toFixed(3)}, ${ci95.upperBound.toFixed(3)}] ${this.unitName}`
                ]
            }
        ];
        
        steps.forEach(step => {
            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
            data.push([
                { value: step.title, type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);
            
            step.details.forEach(detail => {
                data.push([
                    { value: `   ${detail}`, type: 'formula' },
                    { value: '', type: 'data' },
                    { value: '', type: 'data' },
                    { value: '', type: 'data' }
                ]);
            });
        });
        
        return data;
    }


    // NEW: Enhanced template generation
    generateEnhancedTemplate() {
        const data = this.generateConfidenceIntervalTemplate(); // Base template
        
        // Add hypothesis tests if available
        if (Object.keys(this.hypothesisTests).length > 0) {
            data.push(...this.generateHypothesisTestSection());
        }
        
        // Add target analysis if available
        if (Object.keys(this.targetAnalysis).length > 0) {
            data.push(...this.generateTargetAnalysisSection());
        }
        
        // Add z-distribution analysis if available
        if (Object.keys(this.zDistributionAnalysis).length > 0) {
            data.push(...this.generateZDistributionSection());
        }
        
        return data;
    }

    // NEW: Generate hypothesis test section
    generateHypothesisTestSection() {
        const data = [];
        const ht = this.hypothesisTests;
        
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'HYPOTHESIS TESTING (Z-TEST)', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);
        
        const testData = [
            ['Null Hypothesis (H₀):', `μ = ${ht.populationMean} ${this.unitName}`],
            ['Sample Mean (x̄):', `${ht.sampleMean.toFixed(4)} ${this.unitName}`],
            ['Z-Statistic:', ht.zStatistic.toFixed(4)],
            ['Standard Error:', `${ht.standardError.toFixed(4)} ${this.unitName}`],
            ['P-Value (Two-tailed):', ht.pValues.twoTailed.toFixed(6)],
            ['P-Value (Right-tailed):', ht.pValues.rightTailed.toFixed(6)],
            ['P-Value (Left-tailed):', ht.pValues.leftTailed.toFixed(6)]
        ];
        
        testData.forEach(([label, value]) => {
            data.push([
                { value: label, type: 'label' },
                { value: value, type: 'result' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        });
        
        // Decision table
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'DECISION TABLE (Two-tailed test)', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);
        
        ht.criticalValues.twoTailed.forEach(test => {
            const decision = test.reject ? 'REJECT H₀' : 'FAIL TO REJECT H₀';
            data.push([
                { value: `α = ${test.alpha}`, type: 'label' },
                { value: `z-critical = ±${test.zCritical.toFixed(3)}`, type: 'data' },
                { value: decision, type: test.reject ? 'result' : 'data' },
                { value: '', type: 'data' }
            ]);
        });
        
        return data;
    }

    // NEW: Generate target analysis section
    generateTargetAnalysisSection() {
        const data = [];
        const ta = this.targetAnalysis;
        
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'TARGET VALUE ANALYSIS', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);
        
        const targetData = [
            ['Target Value:', `${ta.targetValue} ${this.unitName}`],
            ['Sample Mean:', `${ta.sampleMean.toFixed(4)} ${this.unitName}`],
            ['Difference:', `${ta.difference.toFixed(4)} ${this.unitName}`],
            ['Percent Difference:', `${ta.percentDifference.toFixed(2)}%`],
            ['Effect Size:', ta.effectSize.toFixed(3)],
            ['Practical Significance:', ta.practicalSignificance]
        ];
        
        targetData.forEach(([label, value]) => {
            data.push([
                { value: label, type: 'label' },
                { value: value, type: 'result' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        });
        
        // Decision by confidence level
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'DECISION BY CONFIDENCE LEVEL', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);
        
        Object.values(ta.decisionsByConfidence).forEach(decision => {
            data.push([
                { value: `${decision.confidenceLevel}% CI:`, type: 'label' },
                { value: decision.contains ? 'Contains target' : 'Does not contain target', type: decision.contains ? 'data' : 'result' },
                { value: decision.decision, type: 'data' },
                { value: '', type: 'data' }
            ]);
        });
        
        // Recommendation
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'RECOMMENDATION:', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);
        data.push([
            { value: ta.recommendation, type: 'result' },
            { value: '', type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);
        
        return data;
    }

    // NEW: Generate z-distribution analysis section
    generateZDistributionSection() {
        const data = [];
        const zd = this.zDistributionAnalysis;
        
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'Z-DISTRIBUTION ANALYSIS', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);
        
        // Sampling distribution properties
        data.push([
            { value: 'SAMPLING DISTRIBUTION PROPERTIES', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);
        
        const samplingData = [
            ['Distribution Shape:', zd.samplingDistribution.shape],
            ['Standard Error:', `${zd.samplingDistribution.standardError.toFixed(4)} ${this.unitName}`],
            ['Central Limit Theorem:', zd.centralLimitTheorem.explanation]
        ];
        
        if (zd.sampleZScore !== null) {
            samplingData.push(['Sample Z-Score:', zd.sampleZScore.toFixed(4)]);
        }
        
        samplingData.forEach(([label, value]) => {
            data.push([
                { value: label, type: 'label' },
                { value: value, type: 'result' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        });
        
        // Sample size analysis if available
        if (zd.sampleSizeAnalysis) {
            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
            data.push([
                { value: 'SAMPLE SIZE ANALYSIS', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);
            
            Object.entries(zd.sampleSizeAnalysis).forEach(([confidence, margins]) => {
                const confPercent = Math.round(confidence * 100);
                data.push([
                    { value: `${confPercent}% Confidence Level:`, type: 'label' },
                    { value: '', type: 'data' },
                    { value: '', type: 'data' },
                    { value: '', type: 'data' }
                ]);
                
                Object.values(margins).forEach(margin => {
                    data.push([
                        { value: `  Margin ±${margin.marginOfError.toFixed(3)}:`, type: 'data' },
                        { value: `n = ${margin.requiredSampleSize}`, type: 'data' },
                        { value: margin.improvement, type: 'data' },
                        { value: '', type: 'data' }
                    ]);
                });
            });
        }
        
        return data;
    }

    // Method to render workbook to canvas
    renderToCanvas() {
        if (!this.currentWorkbook) {
            throw new Error('No workbook data to render. Generate a workbook first.');
        }

        const data = this.currentWorkbook.data;
        const maxCols = Math.max(...data.map(row => row.length));

        // Calculate canvas dimensions based on content
        const canvasWidth = Math.max(this.width, maxCols * this.cellWidth + 50);
        const canvasHeight = Math.max(this.height, data.length * this.cellHeight + 100);

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        // Clear canvas with background color
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Set default font
        ctx.font = `${this.fontSize}px Arial`;

        // Draw cells
        data.forEach((row, rowIndex) => {
            const y = rowIndex * this.cellHeight + 50; // Add top margin

            row.forEach((cell, colIndex) => {
                const x = colIndex * this.cellWidth + 25; // Add left margin

                // Determine cell style based on type
                let bgColor = this.colors.cellBg;
                let textColor = this.colors.cellText;
                let font = `${this.fontSize}px Arial`;

                if (typeof cell === 'object' && cell.type) {
                    switch (cell.type) {
                        case 'header':
                            bgColor = this.colors.headerBg;
                            textColor = this.colors.headerText;
                            font = `bold ${this.fontSize + 1}px Arial`;
                            break;
                        case 'section':
                            bgColor = this.colors.sectionBg;
                            textColor = this.colors.sectionText;
                            font = `bold ${this.fontSize}px Arial`;
                            break;
                        case 'formula':
                            bgColor = this.colors.formulaBg;
                            textColor = this.colors.formulaText;
                            break;
                        case 'result':
                            bgColor = this.colors.resultBg;
                            textColor = this.colors.resultText;
                            font = `bold ${this.fontSize}px Arial`;
                            break;
                        case 'label':
                            font = `bold ${this.fontSize}px Arial`;
                            break;
                    }
                }

                // Draw cell background
                ctx.fillStyle = bgColor;
                ctx.fillRect(x, y, this.cellWidth, this.cellHeight);

                // Draw cell border
                ctx.strokeStyle = this.colors.gridColor;
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);

                // Draw cell text
                ctx.fillStyle = textColor;
                ctx.font = font;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';

                const text = typeof cell === 'object' ? String(cell.value) : String(cell);
                if (text !== '' && text !== 'undefined') {
                    const textY = y + this.cellHeight / 2;
                    const textX = x + 5; // Small padding

                    // Handle text overflow
                    const maxWidth = this.cellWidth - 10;
                    if (ctx.measureText(text).width > maxWidth) {
                        // Truncate text if too long
                        let truncated = text;
                        while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
                            truncated = truncated.slice(0, -1);
                        }
                        ctx.fillText(truncated + (truncated.length < text.length ? '...' : ''), textX, textY);
                    } else {
                        ctx.fillText(text, textX, textY);
                    }
                }
            });
        });

        // Draw title
        ctx.fillStyle = this.colors.headerText;
        ctx.font = `bold ${this.fontSize + 4}px Arial`;
        ctx.textAlign = 'center';
        const title = `Statistical Analysis - Generated ${new Date().toLocaleDateString()}`;
        ctx.fillText(title, canvasWidth / 2, 25);

        return canvas;
    }

    // Method to export to various formats
    exportToBuffer(format = 'png') {
        const canvas = this.renderToCanvas();
        return canvas.toBuffer(`image/${format}`);
    }

    // Method to save to file
    saveToFile(filename, format = 'png') {
        const buffer = this.exportToBuffer(format);
        fs.writeFileSync(filename, buffer);
        return filename;
    }

    // Method to export raw data as CSV - UPDATED with new features
    exportToCSV() {
        if (!this.currentWorkbook) {
            throw new Error('No workbook data to export.');
        }

        let csv = `${this.sampleName} - Statistical Analysis Export\n`;
        csv += `Generated: ${new Date().toISOString()}\n\n`;

        // Scenario description
        if (this.scenarioDescription) {
            csv += `Scenario Description\n`;
            csv += `"${this.scenarioDescription}"\n\n`;
        }

        // Raw data
        csv += `Raw Sample Data\n`;
        csv += `Observation #,${this.variableName} (${this.unitName})\n`;
        this.rawSamples.forEach((sample, index) => {
            csv += `${index + 1},${sample}\n`;
        });

        // Summary statistics
        csv += `\nSummary Statistics\n`;
        csv += `Metric,Value\n`;
        csv += `Sample Size (n),${this.statistics.n}\n`;
        csv += `Sample Mean,${this.statistics.mean.toFixed(6)}\n`;
        csv += `Sample Std Dev,${this.statistics.sampleStd.toFixed(6)}\n`;
        if (this.knownPopulationStd) {
            csv += `Known Population Std Dev,${this.knownPopulationStd.toFixed(6)}\n`;
        }
        csv += `Standard Error,${this.statistics.standardError.toFixed(6)}\n`;
        csv += `Minimum,${this.statistics.min.toFixed(6)}\n`;
        csv += `Maximum,${this.statistics.max.toFixed(6)}\n`;
        csv += `Median,${this.statistics.median.toFixed(6)}\n`;
        csv += `Range,${this.statistics.range.toFixed(6)}\n`;

        // Confidence intervals
        csv += `\nConfidence Intervals\n`;
        csv += `Confidence Level,Lower Bound,Upper Bound,Margin of Error,Distribution Type\n`;
        Object.values(this.confidenceIntervals).forEach(ci => {
            const level = Math.round(ci.level * 100);
            csv += `${level}%,${ci.lowerBound.toFixed(6)},${ci.upperBound.toFixed(6)},${ci.marginError.toFixed(6)},${ci.distributionType}\n`;
        });

        // Hypothesis tests (if available)
        if (Object.keys(this.hypothesisTests).length > 0) {
            const ht = this.hypothesisTests;
            csv += `\nHypothesis Test Results (Z-Test)\n`;
            csv += `Metric,Value\n`;
            csv += `Null Hypothesis Mean,${ht.populationMean}\n`;
            csv += `Sample Mean,${ht.sampleMean.toFixed(6)}\n`;
            csv += `Z-Statistic,${ht.zStatistic.toFixed(6)}\n`;
            csv += `P-Value (Two-tailed),${ht.pValues.twoTailed.toFixed(6)}\n`;
            csv += `P-Value (Left-tailed),${ht.pValues.leftTailed.toFixed(6)}\n`;
            csv += `P-Value (Right-tailed),${ht.pValues.rightTailed.toFixed(6)}\n`;

            csv += `\nHypothesis Test Decisions\n`;
            csv += `Alpha Level,Critical Value,Decision (Two-tailed)\n`;
            ht.criticalValues.twoTailed.forEach(test => {
                const decision = test.reject ? 'REJECT H0' : 'FAIL TO REJECT H0';
                csv += `${test.alpha},±${test.zCritical.toFixed(4)},${decision}\n`;
            });
        }

        // Target analysis (if available)
        if (Object.keys(this.targetAnalysis).length > 0) {
            const ta = this.targetAnalysis;
            csv += `\nTarget Value Analysis\n`;
            csv += `Metric,Value\n`;
            csv += `Target Value,${ta.targetValue}\n`;
            csv += `Sample Mean,${ta.sampleMean.toFixed(6)}\n`;
            csv += `Difference,${ta.difference.toFixed(6)}\n`;
            csv += `Percent Difference,${ta.percentDifference.toFixed(2)}%\n`;
            csv += `Effect Size,${ta.effectSize.toFixed(6)}\n`;
            csv += `Practical Significance,${ta.practicalSignificance}\n`;
            csv += `Recommendation,"${ta.recommendation}"\n`;

            csv += `\nTarget Analysis by Confidence Level\n`;
            csv += `Confidence Level,Contains Target,Decision\n`;
            Object.values(ta.decisionsByConfidence).forEach(decision => {
                csv += `${decision.confidenceLevel}%,${decision.contains ? 'Yes' : 'No'},"${decision.decision}"\n`;
            });
        }

        // Z-distribution analysis (if available)
        if (Object.keys(this.zDistributionAnalysis).length > 0) {
            const zd = this.zDistributionAnalysis;
            csv += `\nZ-Distribution Analysis\n`;
            csv += `Metric,Value\n`;
            csv += `Distribution Shape,${zd.samplingDistribution.shape}\n`;
            csv += `Standard Error,${zd.samplingDistribution.standardError.toFixed(6)}\n`;
            if (zd.sampleZScore !== null) {
                csv += `Sample Z-Score,${zd.sampleZScore.toFixed(6)}\n`;
            }
            csv += `Central Limit Theorem,"${zd.centralLimitTheorem.explanation}"\n`;
        }

        return csv;
    }

    // Method to get workbook summary - UPDATED with new features
    getSummary() {
        if (!this.currentWorkbook) {
            return null;
        }

        const summary = {
            // Basic information
            sampleName: this.sampleName,
            variableName: this.variableName,
            unitName: this.unitName,
            scenarioDescription: this.scenarioDescription,
            
            // Sample statistics
            sampleSize: this.statistics.n,
            sampleMean: this.statistics.mean,
            sampleStandardDeviation: this.statistics.sampleStd,
            standardError: this.statistics.standardError,
            
            // Distribution information
            distributionUsed: this.knownPopulationStd ? 'normal (z-distribution)' : 't-distribution',
            knownPopulationStd: this.knownPopulationStd,
            knownPopulationMean: this.knownPopulationMean,
            
            // Confidence intervals
            confidenceIntervals: Object.fromEntries(
                Object.entries(this.confidenceIntervals).map(([level, ci]) => [
                    `${Math.round(level * 100)}%`,
                    {
                        lowerBound: Number(ci.lowerBound.toFixed(4)),
                        upperBound: Number(ci.upperBound.toFixed(4)),
                        marginOfError: Number(ci.marginError.toFixed(4)),
                        width: Number(ci.width.toFixed(4))
                    }
                ])
            ),
            
            // Analysis flags
            hasHypothesisTests: Object.keys(this.hypothesisTests).length > 0,
            hasTargetAnalysis: Object.keys(this.targetAnalysis).length > 0,
            hasZDistributionAnalysis: Object.keys(this.zDistributionAnalysis).length > 0,
            
            // Generation information
            generatedAt: this.currentWorkbook.generated,
            theme: this.theme
        };

        // Add hypothesis test summary if available
        if (summary.hasHypothesisTests) {
            summary.hypothesisTestSummary = {
                nullHypothesisMean: this.hypothesisTests.populationMean,
                zStatistic: Number(this.hypothesisTests.zStatistic.toFixed(4)),
                pValueTwoTailed: Number(this.hypothesisTests.pValues.twoTailed.toFixed(6)),
                significantAt05: this.hypothesisTests.pValues.twoTailed < 0.05,
                significantAt01: this.hypothesisTests.pValues.twoTailed < 0.01
            };
        }

        // Add target analysis summary if available
        if (summary.hasTargetAnalysis) {
            summary.targetAnalysisSummary = {
                targetValue: this.targetAnalysis.targetValue,
                difference: Number(this.targetAnalysis.difference.toFixed(4)),
                percentDifference: Number(this.targetAnalysis.percentDifference.toFixed(2)),
                effectSize: Number(this.targetAnalysis.effectSize.toFixed(3)),
                practicalSignificance: this.targetAnalysis.practicalSignificance,
                recommendation: this.targetAnalysis.recommendation,
                ci95ContainsTarget: this.targetAnalysis.decisionsByConfidence[0.95]?.contains || null
            };
        }

        return summary;
    }

    // Method to change theme
    setTheme(theme) {
        this.theme = theme;
        this.setThemeColors();
        
        // Regenerate workbook if it exists
        if (this.currentWorkbook) {
            this.generateWorkbook();
        }
        
        return this;
    }

    // Method to get available themes
    getAvailableThemes() {
        return ['excel', 'googlesheets', 'scientific'];
    }

    // Method to clone the workbook with different settings
    clone(options = {}) {
        const cloned = new StatisticalWorkbook({
            width: options.width || this.width,
            height: options.height || this.height,
            theme: options.theme || this.theme
        });
        
        // Copy data if it exists
        if (this.rawSamples.length > 0) {
            cloned.rawSamples = [...this.rawSamples];
            cloned.sampleName = this.sampleName;
            cloned.variableName = this.variableName;
            cloned.unitName = this.unitName;
            cloned.scenarioDescription = this.scenarioDescription;
            cloned.knownPopulationStd = this.knownPopulationStd;
            cloned.knownPopulationMean = this.knownPopulationMean;
            cloned.targetValue = this.targetValue;
            cloned.decisionCriteria = this.decisionCriteria;
            
            // Recalculate everything
            cloned.calculateStatistics();
            cloned.calculateConfidenceIntervals();
            
            if (cloned.knownPopulationStd && cloned.knownPopulationMean) {
                cloned.calculateHypothesisTests();
            }
            
            if (cloned.targetValue !== null) {
                cloned.calculateTargetAnalysis();
            }
            
            if (cloned.knownPopulationStd) {
                cloned.calculateZDistributionAnalysis();
            }
            
            cloned.generateWorkbook();
        }
        
        return cloned;
    }

    // Method to validate input data
    validateInputData(config) {
        const errors = [];
        
        if (!config.samples || !Array.isArray(config.samples) || config.samples.length === 0) {
            errors.push('Samples must be a non-empty array');
        } else {
            // Check if all samples are numbers
            config.samples.forEach((sample, index) => {
                if (typeof sample !== 'number' || isNaN(sample)) {
                    errors.push(`Sample at index ${index} is not a valid number: ${sample}`);
                }
            });
            
            // Check minimum sample size
            if (config.samples.length < 2) {
                errors.push('At least 2 samples are required for statistical analysis');
            }
        }
        
        if (config.knownPopulationStd !== null && config.knownPopulationStd !== undefined) {
            if (typeof config.knownPopulationStd !== 'number' || config.knownPopulationStd <= 0) {
                errors.push('Known population standard deviation must be a positive number');
            }
        }
        
        if (config.knownPopulationMean !== null && config.knownPopulationMean !== undefined) {
            if (typeof config.knownPopulationMean !== 'number' || isNaN(config.knownPopulationMean)) {
                errors.push('Known population mean must be a valid number');
            }
        }
        
        if (config.targetValue !== null && config.targetValue !== undefined) {
            if (typeof config.targetValue !== 'number' || isNaN(config.targetValue)) {
                errors.push('Target value must be a valid number');
            }
        }
        
        return errors;
    }

    // Method to get calculation history
    getCalculationHistory() {
        return [...this.calculationHistory];
    }

    // Method to clear calculation history
    clearHistory() {
        this.calculationHistory = [];
        return this;
    }

    // Method to export workbook data as JSON
    exportToJSON() {
        if (!this.currentWorkbook) {
            throw new Error('No workbook data to export.');
        }
        
        return JSON.stringify(this.currentWorkbook, null, 2);
    }

    // Method to save JSON to file
    saveJSONToFile(filename) {
        const json = this.exportToJSON();
        fs.writeFileSync(filename, json);
        return filename;
    }

    // Static method to load from JSON
    static fromJSON(jsonData) {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        const workbook = new StatisticalWorkbook({
            theme: data.statistics?.theme || 'excel'
        });
        
        if (data.rawSamples && data.rawSamples.length > 0) {
            const config = {
                samples: data.rawSamples,
                sampleName: data.sampleName,
                variableName: data.variableName,
                unitName: data.unitName,
                scenarioDescription: data.scenarioDescription || '',
                knownPopulationStd: data.statistics?.populationStd || null,
                knownPopulationMean: data.hypothesisTests?.populationMean || null,
                targetValue: data.targetAnalysis?.targetValue || null
            };
            
            workbook.inputSurveyData(config);
        }
        
        return workbook;
    }

    // Method to get performance metrics
    getPerformanceMetrics() {
        return {
            sampleSize: this.statistics.n || 0,
            calculationsPerformed: this.calculationHistory.length,
            memoryUsage: {
                rawSamples: this.rawSamples.length,
                hasConfidenceIntervals: Object.keys(this.confidenceIntervals).length > 0,
                hasHypothesisTests: Object.keys(this.hypothesisTests).length > 0,
                hasTargetAnalysis: Object.keys(this.targetAnalysis).length > 0,
                hasZDistributionAnalysis: Object.keys(this.zDistributionAnalysis).length > 0
            },
            lastGenerated: this.currentWorkbook?.generated || null
        };
    }
}
