// Enhanced Multi-Distribution StatisticalWorkbook.js
// Supports Poisson, Binomial, Bernoulli distributions

import { createCanvas } from '@napi-rs/canvas';
import * as math from 'mathjs';
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

// Statistical Distribution Functions Library
class StatisticalDistributions {
    // Gamma function approximation (Lanczos approximation)
    static gamma(z) {
        const g = 7;
        const C = [0.99999999999980993,
                  676.5203681218851,
                  -1259.1392167224028,
                  771.32342877765313,
                  -176.61502916214059,
                  12.507343278686905,
                  -0.13857109526572012,
                  9.9843695780195716e-6,
                  1.5056327351493116e-7];

        if (z < 0.5) {
            return Math.PI / (Math.sin(Math.PI * z) * this.gamma(1 - z));
        }

        z -= 1;
        let x = C[0];
        for (let i = 1; i < g + 2; i++) {
            x += C[i] / (z + i);
        }

        const t = z + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }

    // Beta function
    static beta(a, b) {
        return this.gamma(a) * this.gamma(b) / this.gamma(a + b);
    }

    // Incomplete gamma function (lower)
    static incompleteGammaLower(s, x, iterations = 100) {
        if (x <= 0) return 0;

        let sum = 1;
        let term = 1;

        for (let n = 1; n <= iterations; n++) {
            term *= x / (s + n - 1);
            sum += term;
            if (Math.abs(term) < 1e-12) break;
        }

        return Math.pow(x, s) * Math.exp(-x) * sum / s;
    }

    // Incomplete beta function
    static incompleteBeta(x, a, b, iterations = 100) {
        if (x <= 0) return 0;
        if (x >= 1) return 1;

        const bt = Math.pow(x, a) * Math.pow(1 - x, b) / this.beta(a, b);

        // Continued fraction
        let c = 1;
        let d = 1 - (a + b) * x / (a + 1);
        if (Math.abs(d) < 1e-30) d = 1e-30;
        d = 1 / d;
        let h = d;

        for (let m = 1; m <= iterations; m++) {
            const m2 = 2 * m;
            let aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
            d = 1 + aa * d;
            if (Math.abs(d) < 1e-30) d = 1e-30;
            c = 1 + aa / c;
            if (Math.abs(c) < 1e-30) c = 1e-30;
            d = 1 / d;
            h *= d * c;

            aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
            d = 1 + aa * d;
            if (Math.abs(d) < 1e-30) d = 1e-30;
            c = 1 + aa / c;
            if (Math.abs(c) < 1e-30) c = 1e-30;
            d = 1 / d;
            const del = d * c;
            h *= del;

            if (Math.abs(del - 1) <= 1e-12) break;
        }

        return bt * h / a;
    }

    // Poisson distribution
    static poissonPMF(k, lambda) {
        if (k < 0 || !Number.isInteger(k)) return 0;
        return Math.exp(-lambda) * Math.pow(lambda, k) / math.factorial(k);
    }

    static poissonCDF(k, lambda) {
        if (k < 0) return 0;
        k = Math.floor(k);
        return 1 - this.incompleteGammaLower(k + 1, lambda) / this.gamma(k + 1);
    }

    static poissonInverse(p, lambda) {
        if (p <= 0) return 0;
        if (p >= 1) return Infinity;
        let cum = 0;
        let k = 0;
        while (cum < p) {
            cum += this.poissonPMF(k, lambda);
            if (cum >= p) break;
            k++;
            if (k > 1000) break; // Safety limit
        }
        return k;
    }

    // Binomial distribution
    static binomialPMF(k, n, p) {
        if (k < 0 || k > n || !Number.isInteger(k)) return 0;
        return math.combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    static binomialCDF(k, n, p) {
        if (k < 0) return 0;
        if (k >= n) return 1;
        k = Math.floor(k);
        return 1 - this.incompleteBeta(p, k + 1, n - k);
    }

    static binomialInverse(p, n, p_param) {
        if (p <= 0) return 0;
        if (p >= 1) return n;
        let cum = 0;
        let k = 0;
        while (cum < p) {
            cum += this.binomialPMF(k, n, p_param);
            if (cum >= p) break;
            k++;
            if (k > n) break;
        }
        return k;
    }

    // Bernoulli distribution
    static bernoulliPMF(k, p) {
        if (k === 0) return 1 - p;
        if (k === 1) return p;
        return 0;
    }

    static bernoulliCDF(k, p) {
        if (k < 0) return 0;
        if (k < 1) return 1 - p;
        return 1;
    }

    static bernoulliInverse(q, p) {
        if (q < 1 - p) return 0;
        return 1;
    }

    // Chi-square CDF for goodness of fit p-value
    static chiSquareCDF(x, df) {
        if (x <= 0) return 0;
        return this.incompleteGammaLower(df / 2, x / 2) / this.gamma(df / 2);
    }

    // Normal CDF and inverse for approximations
    static normalCDF(x, mean = 0, std = 1) {
        const z = (x - mean) / std;
        const sign = z < 0 ? -1 : 1;
        const absZ = Math.abs(z);

        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const t = 1.0 / (1.0 + p * absZ);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);

        return 0.5 + sign * (y - 0.5);
    }

    static normalInverse(p, mean = 0, std = 1) {
        // Beasley-Springer-Moro algorithm
        const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
        const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
        const c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
        const d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

        const pLow = 0.02425;
        const pHigh = 1 - pLow;
        let x;

        if (p < pLow) {
            const q = Math.sqrt(-2 * Math.log(p));
            x = (((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) / ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
        } else if (p <= pHigh) {
            const q = p - 0.5;
            const r = q * q;
            x = (((((a[1] * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * r + a[6]) * q / (((((b[1] * r + b[2]) * r + b[3]) * r + b[4]) * r + b[5]) * r + 1);
        } else {
            const q = Math.sqrt(-2 * Math.log(1 - p));
            x = -(((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) / ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
        }

        return mean + std * x;
    }
}

// Distribution Registry
class DistributionRegistry {
    static distributions = {
        'poisson': {
            name: 'Poisson Distribution',
            params: ['lambda'],
            paramNames: ['λ (rate)'],
            defaultParams: [1],
            pmf: (k, params) => StatisticalDistributions.poissonPMF(k, params[0]),
            cdf: (k, params) => StatisticalDistributions.poissonCDF(k, params[0]),
            inverse: (p, params) => StatisticalDistributions.poissonInverse(p, params[0]),
            estimateParams: (data) => {
                const mean = data.reduce((a, b) => a + b) / data.length;
                return [mean];
            },
            useCases: ['Count data', 'Rare events', 'Poisson processes']
        },
        'binomial': {
            name: 'Binomial Distribution',
            params: ['n', 'p'],
            paramNames: ['n (trials)', 'p (success probability)'],
            defaultParams: [10, 0.5],
            pmf: (k, params) => StatisticalDistributions.binomialPMF(k, params[0], params[1]),
            cdf: (k, params) => StatisticalDistributions.binomialCDF(k, params[0], params[1]),
            inverse: (p, params) => StatisticalDistributions.binomialInverse(p, params[0], params[1]),
            estimateParams: (data) => {
                const mean = data.reduce((a, b) => a + b) / data.length;
                const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
                const p = 1 - variance / mean;
                const n = Math.round(mean / p);
                return [n, p];
            },
            useCases: ['Binary trials', 'Success counts', 'Proportion estimation']
        },
        'bernoulli': {
            name: 'Bernoulli Distribution',
            params: ['p'],
            paramNames: ['p (success probability)'],
            defaultParams: [0.5],
            pmf: (k, params) => StatisticalDistributions.bernoulliPMF(k, params[0]),
            cdf: (k, params) => StatisticalDistributions.bernoulliCDF(k, params[0]),
            inverse: (p, params) => StatisticalDistributions.bernoulliInverse(p, params[0]),
            estimateParams: (data) => {
                const mean = data.reduce((a, b) => a + b) / data.length;
                return [mean];
            },
            useCases: ['Single binary trial', 'Coin flips', 'Success/Failure']
        }
    };

    static getDistribution(name) {
        return this.distributions[name] || null;
    }

    static getAllDistributions() {
        return Object.keys(this.distributions);
    }
}

export class EnhancedStatisticalWorkbook {
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

        // Data storage
        this.rawSamples = [];
        this.sampleName = "";
        this.variableName = "";
        this.unitName = "";
        this.scenarioDescription = "";

        // Distribution analysis
        this.selectedDistribution = 'poisson';
        this.distributionParams = null;
        this.distributionAnalysis = {};
        this.goodnessOfFit = {};
        this.confidenceIntervals = {};
        this.hypothesisTests = {};

        // Comparative analysis
        this.comparisonResults = {};

        // Calculated statistics
        this.statistics = {};
        this.calculationHistory = [];
        this.currentWorkbook = null;

        // Target analysis
        this.targetValue = null;
        this.targetAnalysisType = null;
        this.targetAnalysis = {};

        // Parameter CI
        this.parameterConfidenceIntervals = {};

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

    analyzeDistribution(config) {
        this.sampleName = config.sampleName || "Sample Data";
        this.variableName = config.variableName || "Value";
        this.unitName = config.unitName || "units";
        this.scenarioDescription = config.scenarioDescription || "";
        this.rawSamples = [...config.samples];
        this.selectedDistribution = config.distribution || 'poisson';
        this.distributionParams = config.distributionParams || null;
        this.targetValue = config.targetValue || null;
        this.targetAnalysisType = config.targetAnalysisType || null;

        this.calculateStatistics();

        this.fitDistribution();

        this.calculateDistributionConfidenceIntervals();

        this.calculateParameterConfidenceIntervals();

        this.performGoodnessOfFitTests();

        if (config.hypothesisTest) {
            this.performHypothesisTest(config.hypothesisTest);
        }

        if (config.compareDistributions) {
            this.compareDistributions(config.compareDistributions);
        }

        if (this.targetValue !== null) {
            this.calculateDistributionSpecificTargetAnalysis();
        }

        this.generateWorkbook();

        return this.currentWorkbook;
    }

    calculateStatistics() {
        const n = this.rawSamples.length;
        const sum = this.rawSamples.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        const sortedSamples = [...this.rawSamples].sort((a, b) => a - b);

        const variance = this.rawSamples.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
        const standardDeviation = Math.sqrt(variance);

        const getPercentile = (p) => {
            const index = (p / 100) * (n - 1);
            const lower = Math.floor(index);
            const upper = Math.ceil(index);
            const weight = index - lower;

            if (upper >= n) return sortedSamples[n - 1];
            return sortedSamples[lower] * (1 - weight) + sortedSamples[upper] * weight;
        };

        this.statistics = {
            n,
            sum,
            mean,
            variance,
            standardDeviation,
            min: Math.min(...this.rawSamples),
            max: Math.max(...this.rawSamples),
            range: Math.max(...this.rawSamples) - Math.min(...this.rawSamples),
            median: getPercentile(50),
            q1: getPercentile(25),
            q3: getPercentile(75),
            iqr: getPercentile(75) - getPercentile(25),
            skewness: this.calculateSkewness(),
            kurtosis: this.calculateKurtosis(),
            percentiles: {
                5: getPercentile(5),
                10: getPercentile(10),
                25: getPercentile(25),
                50: getPercentile(50),
                75: getPercentile(75),
                90: getPercentile(90),
                95: getPercentile(95)
            }
        };
    }

    calculateSkewness() {
        const n = this.statistics.n;
        const mean = this.statistics.mean;
        const std = this.statistics.standardDeviation;

        const sumCubed = this.rawSamples.reduce((acc, val) => acc + Math.pow((val - mean) / std, 3), 0);
        return (n / ((n - 1) * (n - 2))) * sumCubed;
    }

    calculateKurtosis() {
        const n = this.statistics.n;
        const mean = this.statistics.mean;
        const std = this.statistics.standardDeviation;

        const sumFourth = this.rawSamples.reduce((acc, val) => acc + Math.pow((val - mean) / std, 4), 0);
        return (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * sumFourth - 3 * Math.pow(n - 1, 2) / ((n - 2) * (n - 3));
    }

    fitDistribution() {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        if (!dist) {
            throw new Error(`Unknown distribution: ${this.selectedDistribution}`);
        }

        if (!this.distributionParams && dist.estimateParams) {
            this.distributionParams = dist.estimateParams(this.rawSamples);
        } else if (!this.distributionParams) {
            this.distributionParams = dist.defaultParams;
        }

        const distributionStats = {
            name: dist.name,
            parameters: {},
            theoreticalMoments: this.calculateTheoreticalMoments()
        };

        dist.params.forEach((param, index) => {
            distributionStats.parameters[param] = this.distributionParams[index];
        });

        this.distributionAnalysis = {
            distribution: this.selectedDistribution,
            ...distributionStats,
            logLikelihood: this.calculateLogLikelihood(),
            aic: this.calculateAIC(),
            bic: this.calculateBIC()
        };
    }

    calculateTheoreticalMoments() {
        switch(this.selectedDistribution) {
            case 'poisson':
                const lambda = this.distributionParams[0];
                return {
                    mean: lambda,
                    variance: lambda,
                    skewness: 1 / Math.sqrt(lambda),
                    kurtosis: 3 + 1 / lambda
                };
            case 'binomial':
                const [n, p] = this.distributionParams;
                return {
                    mean: n * p,
                    variance: n * p * (1 - p),
                    skewness: (1 - 2 * p) / Math.sqrt(n * p * (1 - p)),
                    kurtosis: 3 + (1 - 6 * p * (1 - p)) / (n * p * (1 - p))
                };
            case 'bernoulli':
                const pb = this.distributionParams[0];
                return {
                    mean: pb,
                    variance: pb * (1 - pb),
                    skewness: (1 - 2 * pb) / Math.sqrt(pb * (1 - pb)),
                    kurtosis: 3 + (1 - 6 * pb * (1 - pb)) / (pb * (1 - pb))
                };
            default:
                return {
                    mean: null,
                    variance: null,
                    skewness: null,
                    kurtosis: null
                };
        }
    }

    calculateLogLikelihood() {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        let logLikelihood = 0;

        this.rawSamples.forEach(x => {
            const pmf = dist.pmf(x, this.distributionParams);
            if (pmf > 0) {
                logLikelihood += Math.log(pmf);
            }
        });

        return logLikelihood;
    }

    calculateAIC() {
        const k = this.distributionParams.length;
        const logL = this.distributionAnalysis.logLikelihood;
        return 2 * k - 2 * logL;
    }

    calculateBIC() {
        const k = this.distributionParams.length;
        const n = this.statistics.n;
        const logL = this.distributionAnalysis.logLikelihood;
        return k * Math.log(n) - 2 * logL;
    }

    calculateDistributionConfidenceIntervals() {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        if (!dist.inverse) return;

        const confidenceLevels = [0.90, 0.95, 0.99];
        this.confidenceIntervals = {};

        confidenceLevels.forEach(level => {
            const alpha = 1 - level;
            const lowerP = alpha / 2;
            const upperP = 1 - alpha / 2;

            const lowerBound = dist.inverse(lowerP, this.distributionParams);
            const upperBound = dist.inverse(upperP, this.distributionParams);

            this.confidenceIntervals[level] = {
                level,
                lowerBound,
                upperBound,
                width: upperBound - lowerBound
            };
        });
    }

    performGoodnessOfFitTests() {
        this.goodnessOfFit = {
            kolmogorovSmirnov: this.kolmogorovSmirnovTest(),
            chisquareTest: this.chiSquareGoodnessOfFit()
        };
    }

    kolmogorovSmirnovTest() {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        const sortedData = [...this.rawSamples].sort((a, b) => a - b);
        const n = sortedData.length;
        let maxDiff = 0;

        for (let i = 0; i < n; i++) {
            const empiricalCDF = (i + 1) / n;
            const theoreticalCDF = dist.cdf(sortedData[i], this.distributionParams);
            const diff = Math.abs(empiricalCDF - theoreticalCDF);
            maxDiff = Math.max(maxDiff, diff);
        }

        const criticalValues = {
            0.05: 1.36 / Math.sqrt(n),
            0.01: 1.63 / Math.sqrt(n),
            0.001: 1.95 / Math.sqrt(n)
        };

        return {
            testStatistic: maxDiff,
            criticalValues,
            pValue: this.calculateKSPValue(maxDiff, n),
            reject: {
                '0.05': maxDiff > criticalValues[0.05],
                '0.01': maxDiff > criticalValues[0.01],
                '0.001': maxDiff > criticalValues[0.001]
            }
        };
    }

    calculateKSPValue(d, n) {
        const lambda = (Math.sqrt(n) + 0.12 + 0.11 / Math.sqrt(n)) * d;
        let sum = 0;
        for (let i = 1; i <= 100; i++) {
            sum += Math.pow(-1, i - 1) * Math.exp(-2 * i * i * lambda * lambda);
        }
        return 2 * sum;
    }

    chiSquareGoodnessOfFit() {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        const n = this.rawSamples.length;
        const min = Math.min(...this.rawSamples);
        const max = Math.max(...this.rawSamples);
        let bins = Math.max(5, Math.min(10, max - min + 1));

        const observed = new Array(bins).fill(0);
        const expected = new Array(bins).fill(0);

        const binWidth = Math.ceil((max - min + 1) / bins);

        this.rawSamples.forEach(x => {
            const bin = Math.min(bins - 1, Math.floor((x - min) / binWidth));
            observed[bin]++;
        });

        for (let i = 0; i < bins; i++) {
            const binStart = min + i * binWidth;
            const binEnd = i === bins - 1 ? max : min + (i + 1) * binWidth - 1;
            let prob = 0;
            for (let j = binStart; j <= binEnd; j++) {
                prob += dist.pmf(j, this.distributionParams);
            }
            expected[i] = n * prob;
        }

        // Merge bins if expected < 5
        for (let i = 0; i < bins; i++) {
            if (expected[i] < 5 && i < bins - 1) {
                expected[i + 1] += expected[i];
                observed[i + 1] += observed[i];
                expected[i] = 0;
                observed[i] = 0;
            }
        }

        let chiSquare = 0;
        let effectiveBins = 0;
        for (let i = 0; i < bins; i++) {
            if (expected[i] > 0) {
                chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
                effectiveBins++;
            }
        }

        const df = effectiveBins - 1 - this.distributionParams.length;
        const pValue = 1 - StatisticalDistributions.chiSquareCDF(chiSquare, df);

        return {
            testStatistic: chiSquare,
            degreesOfFreedom: df,
            pValue,
            observed,
            expected,
            bins: effectiveBins,
            reject: {
                '0.05': pValue < 0.05,
                '0.01': pValue < 0.01,
                '0.001': pValue < 0.001
            }
        };
    }

    performHypothesisTest(testConfig) {
        const testType = testConfig.type;

        switch (testType) {
            case 'poisson':
                this.hypothesisTests.poisson = this.performPoissonHypothesisTest(testConfig);
                break;
            case 'binomial':
                this.hypothesisTests.binomial = this.performBinomialHypothesisTest(testConfig);
                break;
            case 'bernoulli':
                this.hypothesisTests.bernoulli = this.performBernoulliHypothesisTest(testConfig);
                break;
            // Add other tests if needed
            default:
                throw new Error(`Unknown test type: ${testType}`);
        }
    }

    performPoissonHypothesisTest(testConfig) {
        const { nullLambda, alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const n = this.statistics.n;
        const sampleMean = this.statistics.mean;
        const observedLambda = sampleMean;

        const standardError = Math.sqrt(nullLambda / n);
        const testStatistic = (sampleMean - nullLambda) / standardError;

        let pValue;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - StatisticalDistributions.normalCDF(Math.abs(testStatistic)));
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.normalCDF(testStatistic);
        } else {
            pValue = StatisticalDistributions.normalCDF(testStatistic);
        }

        return {
            testType: 'Poisson Rate Test',
            nullHypothesis: `λ = ${nullLambda}`,
            alternative,
            testStatistic,
            pValue,
            observedLambda,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis',
            method: 'Large Sample Normal Approximation'
        };
    }

    performBinomialHypothesisTest(testConfig) {
        const { nullP, alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const [trials] = this.distributionParams;
        const n = this.statistics.n;
        const successes = this.rawSamples.reduce((a, b) => a + b, 0);
        const sampleP = successes / (n * trials);

        const standardError = Math.sqrt(nullP * (1 - nullP) / (n * trials));
        const testStatistic = (sampleP - nullP) / standardError;

        let pValue;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - StatisticalDistributions.normalCDF(Math.abs(testStatistic)));
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.normalCDF(testStatistic);
        } else {
            pValue = StatisticalDistributions.normalCDF(testStatistic);
        }

        return {
            testType: 'Binomial Proportion Test',
            nullHypothesis: `p = ${nullP}`,
            alternative,
            testStatistic,
            pValue,
            sampleProportion: sampleP,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis',
            method: 'Normal Approximation for Proportion'
        };
    }

    performBernoulliHypothesisTest(testConfig) {
        const { nullP, alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const n = this.statistics.n;
        const successes = this.rawSamples.filter(x => x === 1).length;
        const sampleP = successes / n;

        const standardError = Math.sqrt(nullP * (1 - nullP) / n);
        const testStatistic = (sampleP - nullP) / standardError;

        let pValue;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - StatisticalDistributions.normalCDF(Math.abs(testStatistic)));
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.normalCDF(testStatistic);
        } else {
            pValue = StatisticalDistributions.normalCDF(testStatistic);
        }

        return {
            testType: 'Bernoulli Proportion Test',
            nullHypothesis: `p = ${nullP}`,
            alternative,
            testStatistic,
            pValue,
            sampleProportion: sampleP,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis',
            method: 'Normal Approximation for Proportion'
        };
    }

    compareDistributions(distributionsList) {
        const results = {};

        distributionsList.forEach(distName => {
            const dist = DistributionRegistry.getDistribution(distName);
            if (!dist || !dist.estimateParams) return;

            const params = dist.estimateParams(this.rawSamples);
            const logLikelihood = this.calculateLogLikelihoodForDistribution(distName, params);
            const k = params.length;
            const n = this.statistics.n;

            const aic = 2 * k - 2 * logLikelihood;
            const bic = k * Math.log(n) - 2 * logLikelihood;

            const ksTest = this.performKSTestForDistribution(distName, params);

            results[distName] = {
                name: dist.name,
                parameters: params,
                logLikelihood,
                aic,
                bic,
                ksTest,
                rank: 0
            };
        });

        const sortedByAIC = Object.entries(results).sort((a, b) => a[1].aic - b[1].aic);
        sortedByAIC.forEach(([name, result], index) => {
            results[name].rank = index + 1;
        });

        this.comparisonResults = {
            distributions: results,
            bestFit: sortedByAIC[0][0],
            summary: this.generateComparisonSummary(results)
        };
    }

    calculateLogLikelihoodForDistribution(distName, params) {
        const dist = DistributionRegistry.getDistribution(distName);
        let logLikelihood = 0;

        this.rawSamples.forEach(x => {
            const pmf = dist.pmf(x, params);
            if (pmf > 0) {
                logLikelihood += Math.log(pmf);
            }
        });

        return logLikelihood;
    }

    performKSTestForDistribution(distName, params) {
        const dist = DistributionRegistry.getDistribution(distName);
        const sortedData = [...this.rawSamples].sort((a, b) => a - b);
        const n = sortedData.length;
        let maxDiff = 0;

        for (let i = 0; i < n; i++) {
            const empiricalCDF = (i + 1) / n;
            const theoreticalCDF = dist.cdf(sortedData[i], params);
            const diff = Math.abs(empiricalCDF - theoreticalCDF);
            maxDiff = Math.max(maxDiff, diff);
        }

        const criticalValue = 1.36 / Math.sqrt(n);
        const pValue = this.calculateKSPValue(maxDiff, n);

        return {
            testStatistic: maxDiff,
            criticalValue,
            pValue,
            reject: maxDiff > criticalValue
        };
    }

    generateComparisonSummary(results) {
        const sortedResults = Object.entries(results).sort((a, b) => a[1].aic - b[1].aic);

        return {
            bestFit: sortedResults[0][0],
            summary: `Based on AIC, ${DistributionRegistry.getDistribution(sortedResults[0][0]).name} provides the best fit to the data.`,
            recommendations: this.generateRecommendations(sortedResults)
        };
    }

    generateRecommendations(sortedResults) {
        const recommendations = [];
        const best = sortedResults[0];

        recommendations.push(`The ${DistributionRegistry.getDistribution(best[0]).name} is recommended as the primary model.`);

        if (sortedResults.length > 1) {
            const second = sortedResults[1];
            const aicDiff = second[1].aic - best[1].aic;
            if (aicDiff < 2) {
                recommendations.push(`The ${DistributionRegistry.getDistribution(second[0]).name} provides a similarly good fit (ΔAIC = ${aicDiff.toFixed(2)}).`);
            }
        }

        if (best[1].ksTest.reject) {
            recommendations.push("Warning: The Kolmogorov-Smirnov test suggests the fit may not be adequate. Consider alternative distributions or data transformations.");
        }

        return recommendations;
    }

    calculateParameterCIForLevel(confidence) {
        const alpha = 1 - confidence;
        const n = this.statistics.n;

        switch(this.selectedDistribution) {
            case 'poisson':
                return this.calculatePoissonParameterCI(confidence, alpha, n);
            case 'binomial':
                return this.calculateBinomialParameterCI(confidence, alpha, n);
            case 'bernoulli':
                return this.calculateBernoulliParameterCI(confidence, alpha, n);
            default:
                return this.calculateBootstrapParameterCI(confidence, alpha, n);
        }
    }

    calculatePoissonParameterCI(confidence, alpha, n) {
        const mean = this.statistics.mean;

        const zCritical = StatisticalDistributions.normalInverse(1 - alpha/2);
        const se = Math.sqrt(mean / n);
        const lower = mean - zCritical * se;
        const upper = mean + zCritical * se;

        return {
            parameters: {
                lambda: {
                    estimate: mean,
                    lowerBound: Math.max(0, lower),
                    upperBound: upper,
                    standardError: se,
                    interpretation: 'Confidence interval for Poisson rate parameter'
                }
            }
        };
    }

    calculateBinomialParameterCI(confidence, alpha, n) {
        const [trials, p] = this.distributionParams;
        const mean = this.statistics.mean;
        const sampleP = mean / trials;

        const zCritical = StatisticalDistributions.normalInverse(1 - alpha/2);
        const center = sampleP + (zCritical * zCritical) / (2 * n * trials);
        const adjustment = zCritical * Math.sqrt(sampleP * (1 - sampleP) / (n * trials) + zCritical * zCritical / (4 * n * trials * n * trials));
        const denom = 1 + zCritical * zCritical / (n * trials);

        const lower = (center - adjustment) / denom;
        const upper = (center + adjustment) / denom;

        return {
            parameters: {
                p: {
                    estimate: p,
                    lowerBound: lower,
                    upperBound: upper,
                    standardError: Math.sqrt(p * (1 - p) / (n * trials)),
                    interpretation: 'Confidence interval for success probability'
                },
                n: {
                    estimate: trials,
                    lowerBound: trials,
                    upperBound: trials,
                    standardError: 0,
                    interpretation: 'Number of trials (fixed)'
                }
            }
        };
    }

    calculateBernoulliParameterCI(confidence, alpha, n) {
        const p = this.distributionParams[0];
        const sampleP = this.statistics.mean;

        const zCritical = StatisticalDistributions.normalInverse(1 - alpha/2);
        const se = Math.sqrt(sampleP * (1 - sampleP) / n);
        const lower = sampleP - zCritical * se;
        const upper = sampleP + zCritical * se;

        return {
            parameters: {
                p: {
                    estimate: p,
                    lowerBound: Math.max(0, lower),
                    upperBound: Math.min(1, upper),
                    standardError: se,
                    interpretation: 'Confidence interval for success probability'
                }
            }
        };
    }

    calculateBootstrapParameterCI(confidence, alpha, n, bootstrapSamples = 1000) {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        if (!dist.estimateParams) return null;

        const bootstrapEstimates = [];

        for (let i = 0; i < bootstrapSamples; i++) {
            const bootstrapSample = this.generateBootstrapSample();
            const bootstrapParams = dist.estimateParams(bootstrapSample);
            bootstrapEstimates.push(bootstrapParams);
        }

        const parameterCIs = {};

        dist.params.forEach((paramName, paramIndex) => {
            const paramValues = bootstrapEstimates.map(params => params[paramIndex]).sort((a, b) => a - b);
            const lowerIndex = Math.floor((alpha / 2) * bootstrapSamples);
            const upperIndex = Math.ceil((1 - alpha / 2) * bootstrapSamples) - 1;

            parameterCIs[paramName] = {
                estimate: this.distributionParams[paramIndex],
                lowerBound: paramValues[lowerIndex],
                upperBound: paramValues[upperIndex],
                standardError: this.calculateBootstrapSE(paramValues),
                interpretation: this.getParameterInterpretation(paramName, this.distributionParams[paramIndex])
            };
        });

        return {
            parameters: parameterCIs,
            bootstrapSamples: bootstrapSamples,
            method: 'Bootstrap Percentile Method'
        };
    }

    generateBootstrapSample() {
        const n = this.rawSamples.length;
        const bootstrapSample = [];

        for (let i = 0; i < n; i++) {
            const randomIndex = Math.floor(Math.random() * n);
            bootstrapSample.push(this.rawSamples[randomIndex]);
        }

        return bootstrapSample;
    }

    calculateBootstrapSE(values) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
        return Math.sqrt(variance);
    }

    calculateDistributionSpecificTargetAnalysis() {
        if (this.targetValue === null) return;

        switch(this.selectedDistribution) {
            case 'poisson':
                this.targetAnalysis = this.calculatePoissonTargetAnalysis();
                break;
            case 'binomial':
                this.targetAnalysis = this.calculateBinomialTargetAnalysis();
                break;
            case 'bernoulli':
                this.targetAnalysis = this.calculateBernoulliTargetAnalysis();
                break;
            default:
                this.targetAnalysis = { note: 'Generic target analysis not implemented' };
        }
    }

    calculatePoissonTargetAnalysis() {
        const lambda = this.distributionParams[0];
        const target = Math.floor(this.targetValue);

        const pmf = StatisticalDistributions.poissonPMF(target, lambda);
        const cdf = StatisticalDistributions.poissonCDF(target, lambda);

        const effectSize = Math.abs(target - lambda) / Math.sqrt(lambda);

        return {
            targetValue: target,
            targetType: 'Count',
            probabilities: {
                exactly: pmf,
                lessThanOrEqual: cdf,
                greaterThan: 1 - cdf,
                interpretation: `P(X = ${target}) = ${pmf.toFixed(4)}`
            },
            effectSize: effectSize,
            practicalSignificance: effectSize < 1 ? 'Small deviation' : 'Large deviation',
            recommendation: effectSize < 1 ? 'Target is consistent with expected rate' : 'Target deviates significantly from expected rate'
        };
    }

    calculateBinomialTargetAnalysis() {
        const [nTrials, p] = this.distributionParams;
        const target = Math.floor(this.targetValue);

        const pmf = StatisticalDistributions.binomialPMF(target, nTrials, p);
        const cdf = StatisticalDistributions.binomialCDF(target, nTrials, p);

        const expected = nTrials * p;
        const effectSize = Math.abs(target - expected) / Math.sqrt(nTrials * p * (1 - p));

        return {
            targetValue: target,
            targetType: 'Success Count',
            probabilities: {
                exactly: pmf,
                lessThanOrEqual: cdf,
                greaterThan: 1 - cdf,
                interpretation: `P(X = ${target}) = ${pmf.toFixed(4)}`
            },
            effectSize: effectSize,
            practicalSignificance: effectSize < 1 ? 'Small' : 'Large',
            recommendation: effectSize < 1 ? 'Target is consistent with expected successes' : 'Target deviates significantly'
        };
    }

    calculateBernoulliTargetAnalysis() {
        const p = this.distributionParams[0];
        const target = Math.floor(this.targetValue);

        if (target !== 0 && target !== 1) {
            return {
                error: 'Target value must be 0 or 1 for Bernoulli distribution'
            };
        }

        const pmf = StatisticalDistributions.bernoulliPMF(target, p);

        return {
            targetValue: target,
            targetType: 'Outcome',
            probabilities: {
                exactly: pmf,
                interpretation: `P(X = ${target}) = ${pmf.toFixed(4)}`
            },
            recommendation: `Probability of outcome ${target} is ${pmf.toFixed(4)}`
        };
    }

    generateDistributionCalculationWalkthrough() {
        switch(this.selectedDistribution) {
            case 'poisson':
                return this.generatePoissonCalculationWalkthrough();
            case 'binomial':
                return this.generateBinomialCalculationWalkthrough();
            case 'bernoulli':
                return this.generateBernoulliCalculationWalkthrough();
            default:
                return {
                    parameterEstimation: {
                        title: "Generic Estimation",
                        steps: [
                            {
                                step: "Step 1: Use distribution-specific estimator",
                                explanation: "See code for details"
                            }
                        ]
                    }
                };
        }
    }

    generatePoissonCalculationWalkthrough() {
        const lambda = this.distributionParams[0];
        const n = this.statistics.n;
        const sampleMean = this.statistics.mean;

        return {
            parameterEstimation: {
                title: "Maximum Likelihood Estimation for Poisson Distribution",
                steps: [
                    {
                        step: "Step 1: Likelihood Function",
                        formula: "L(λ) = (e^{-λ} λ^{k}) / k! for each k, product over observations",
                        explanation: `For n = ${n} observations, the likelihood is product of PMFs.`
                    },
                    {
                        step: "Step 2: Log-Likelihood Function", 
                        formula: "ℓ(λ) = -nλ + (sum k_i) ln(λ) - sum ln(k_i!)",
                        explanation: `Taking natural log simplifies to terms with λ.`
                    },
                    {
                        step: "Step 3: Differentiate and Set to Zero",
                        formula: "dℓ/dλ = -n + (sum k_i)/λ = 0",
                        explanation: `Derivative leads to λ = (sum k_i)/n`
                    },
                    {
                        step: "Step 4: Solve for λ",
                        formula: "λ̂ = sum k_i / n = sample mean",
                        explanation: `λ̂ = ${this.statistics.sum} / ${n} = ${lambda.toFixed(4)}`
                    }
                ],
                result: `Maximum likelihood estimate: λ̂ = ${lambda.toFixed(4)} events per interval`
            },
            interpretation: {
                rateParameter: `λ = ${lambda.toFixed(4)} represents the average number of events`,
                variance: `Variance = λ = ${lambda.toFixed(4)}, equal to mean for Poisson`
            }
        };
    }

    generateBinomialCalculationWalkthrough() {
        const [nTrials, p] = this.distributionParams;
        const mean = this.statistics.mean;
        const variance = this.statistics.variance;

        return {
            parameterEstimation: {
                title: "Estimation for Binomial Distribution",
                steps: [
                    {
                        step: "Step 1: Assume n known or estimated",
                        explanation: `For binomial, n is often known; here estimated as ${nTrials}`
                    },
                    {
                        step: "Step 2: Estimate p",
                        formula: "p̂ = mean / n",
                        explanation: `p̂ = ${mean.toFixed(4)} / ${nTrials} = ${p.toFixed(4)}`
                    }
                ],
                result: `Binomial(n = ${nTrials}, p = ${p.toFixed(4)})`
            },
            interpretation: {
                expectedValue: `E[X] = n p = ${(nTrials * p).toFixed(4)}`,
                variance: `Var[X] = n p (1 - p) = ${(nTrials * p * (1 - p)).toFixed(4)}`
            }
        };
    }

    generateBernoulliCalculationWalkthrough() {
        const p = this.distributionParams[0];
        const mean = this.statistics.mean;

        return {
            parameterEstimation: {
                title: "Maximum Likelihood Estimation for Bernoulli Distribution",
                steps: [
                    {
                        step: "Step 1: Likelihood Function",
                        formula: "L(p) = p^{successes} (1-p)^{failures}",
                        explanation: `Successes = ${mean * this.statistics.n}, failures = ${this.statistics.n - mean * this.statistics.n}`
                    },
                    {
                        step: "Step 2: Log-Likelihood",
                        formula: "ℓ(p) = successes ln(p) + failures ln(1-p)",
                        explanation: `Maximized at p = successes / n`
                    },
                    {
                        step: "Step 3: Estimate p",
                        formula: "p̂ = mean",
                        explanation: `p̂ = ${mean.toFixed(4)}`
                    }
                ],
                result: `Bernoulli(p = ${p.toFixed(4)})`
            },
            interpretation: {
                probability: `P(success) = ${p.toFixed(4)}`,
                variance: `Var = p (1 - p) = ${ (p * (1 - p)).toFixed(4) }`
            }
        };
    }

    generateWorkbook() {
        const data = [];

        data.push(...this.generateHeaderSection());
        data.push(...this.generateSampleDataSection());
        data.push(...this.generateBasicStatisticsSection());
        data.push(...this.generateParameterEstimationSection());
        data.push(...this.generateParameterConfidenceIntervalsSection());
        data.push(...this.generateDistributionAnalysisSection());

        if (this.targetAnalysis && Object.keys(this.targetAnalysis).length > 0) {
            data.push(...this.generateDistributionTargetAnalysisSection());
        }

        if (this.hypothesisTests && Object.keys(this.hypothesisTests).length > 0) {
            data.push(...this.generateHypothesisTestsSection());
        }

        data.push(...this.generateGoodnessOfFitSection());
        data.push(...this.generateDistributionCalculationWalkthroughSection());
        data.push(...this.generateConfidenceIntervalsSection());
        if (Object.keys(this.comparisonResults).length > 0) {
            data.push(...this.generateComparisonSection());
        }
        data.push(...this.generatePracticalRecommendationsSection());

        this.currentWorkbook = data;
    }

    generateHeaderSection() {
        const data = [];

        data.push([
            { value: 'ENHANCED STATISTICAL DISTRIBUTION ANALYSIS WORKBOOK', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        data.push([
            { value: `Analysis Date: ${new Date().toLocaleDateString()}`, type: 'data' },
            { value: `Distribution: ${DistributionRegistry.getDistribution(this.selectedDistribution).name}`, type: 'data' },
            { value: `Sample Size: ${this.statistics.n}`, type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([
            { value: `Sample Name: ${this.sampleName}`, type: 'data' },
            { value: `Variable: ${this.variableName}`, type: 'data' },
            { value: `Units: ${this.unitName}`, type: 'data' },
            { value: '', type: 'data' }
        ]);

        if (this.scenarioDescription) {
            data.push([
                { value: `Description: ${this.scenarioDescription}`, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        return data;
    }

    generateSampleDataSection() {
        const data = [];

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'SAMPLE DATA (First 20 values)', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);

        const displayData = this.rawSamples.slice(0, 20);
        for (let i = 0; i < displayData.length; i += 4) {
            const row = [];
            for (let j = 0; j < 4; j++) {
                if (i + j < displayData.length) {
                    row.push({ value: displayData[i + j].toString(), type: 'data' });
                } else {
                    row.push({ value: '', type: 'data' });
                }
            }
            data.push(row);
        }

        if (this.rawSamples.length > 20) {
            data.push([
                { value: `... and ${this.rawSamples.length - 20} more values`, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        return data;
    }

    generateBasicStatisticsSection() {
        const data = [];

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'DESCRIPTIVE STATISTICS', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);

        const stats = [
            ['Sample Size (n):', this.statistics.n, ''],
            ['Mean:', this.statistics.mean.toFixed(4), this.unitName],
            ['Median:', this.statistics.median.toFixed(4), this.unitName],
            ['Standard Deviation:', this.statistics.standardDeviation.toFixed(4), this.unitName],
            ['Variance:', this.statistics.variance.toFixed(4), this.unitName + '²'],
            ['Minimum:', this.statistics.min.toString(), this.unitName],
            ['Maximum:', this.statistics.max.toString(), this.unitName],
            ['Range:', this.statistics.range.toString(), this.unitName],
            ['Q1 (25th percentile):', this.statistics.q1.toFixed(4), this.unitName],
            ['Q3 (75th percentile):', this.statistics.q3.toFixed(4), this.unitName],
            ['IQR:', this.statistics.iqr.toFixed(4), this.unitName],
            ['Skewness:', this.statistics.skewness.toFixed(4), ''],
            ['Kurtosis:', this.statistics.kurtosis.toFixed(4), '']
        ];

        stats.forEach(([label, value, unit]) => {
            data.push([
                { value: label, type: 'label' },
                { value: value, type: 'result' },
                { value: unit, type: 'data' },
                { value: '', type: 'data' }
            ]);
        });

        return data;
    }

    generateParameterEstimationSection() {
        const data = [];
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: `${dist.name.toUpperCase()} PARAMETER ESTIMATION`, type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);

        dist.params.forEach((param, index) => {
            const paramValue = this.distributionParams[index];
            const paramName = dist.paramNames[index];
            const interpretation = this.getParameterInterpretation(param, paramValue);

            data.push([
                { value: `${paramName}:`, type: 'label' },
                { value: paramValue.toFixed(4), type: 'result' },
                { value: interpretation, type: 'data' },
                { value: '', type: 'data' }
            ]);
        });

        const properties = this.calculateDistributionProperties();
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'DISTRIBUTION PROPERTIES', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        Object.entries(properties).forEach(([property, value]) => {
            data.push([
                { value: `${property}:`, type: 'label' },
                { value: value.value.toFixed(4), type: 'result' },
                { value: value.interpretation || '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        });

        return data;
    }

    generateParameterConfidenceIntervalsSection() {
        if (!this.parameterConfidenceIntervals) return [];

        const data = [];

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'PARAMETER CONFIDENCE INTERVALS', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);

        Object.entries(this.parameterConfidenceIntervals).forEach(([level, intervals]) => {
            const percentage = Math.round(level * 100);

            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
            data.push([
                { value: `${percentage}% CONFIDENCE INTERVALS`, type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);

            Object.entries(intervals.parameters).forEach(([paramName, paramCI]) => {
                data.push([
                    { value: `${paramName}:`, type: 'label' },
                    { value: `[${paramCI.lowerBound.toFixed(4)}, ${paramCI.upperBound.toFixed(4)}]`, type: 'result' },
                    { value: paramCI.interpretation || '', type: 'data' },
                    { value: '', type: 'data' }
                ]);
            });
        });

        return data;
    }

    getParameterInterpretation(paramName, paramValue) {
        switch(this.selectedDistribution) {
            case 'poisson':
                return `Rate parameter: ${paramValue.toFixed(4)} events per unit`;
            case 'binomial':
                if (paramName === 'n') return `Number of trials: ${paramValue}`;
                if (paramName === 'p') return `Success probability: ${paramValue.toFixed(4)}`;
                break;
            case 'bernoulli':
                return `Success probability: ${paramValue.toFixed(4)}`;
            default:
                return `Parameter: ${paramValue.toFixed(4)}`;
        }
    }

    generatePracticalRecommendationsSection() {
        const data = [];

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'PRACTICAL RECOMMENDATIONS', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);

        const recommendations = this.generatePracticalRecommendations();

        recommendations.forEach((rec, index) => {
            data.push([
                { value: `${index + 1}. ${rec}`, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        });

        return data;
    }

    generatePracticalRecommendations() {
        const recommendations = [];
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);

        switch(this.selectedDistribution) {
            case 'poisson':
                recommendations.push("Poisson distribution is suitable for modeling rare events or count data where mean equals variance.");
                if (Math.abs(this.statistics.mean - this.statistics.variance) / this.statistics.mean < 0.1) {
                    recommendations.push("Mean ≈ Variance, good fit for Poisson assumption.");
                } else {
                    recommendations.push("Warning: Mean and variance differ; consider over/underdispersion.");
                }
                break;
            case 'binomial':
                recommendations.push("Binomial distribution models number of successes in fixed trials with constant probability.");
                const [n, p] = this.distributionParams;
                if (p < 0.1 && n * p < 5) {
                    recommendations.push("Rare events: Poisson approximation may be appropriate.");
                }
                break;
            case 'bernoulli':
                recommendations.push("Bernoulli distribution for binary outcomes (success/failure).");
                recommendations.push("Use for modeling single trial events.");
                break;
        }

        const ksTest = this.goodnessOfFit.kolmogorovSmirnov;
        if (ksTest && ksTest.pValue < 0.05) {
            recommendations.push("Goodness of fit suggests poor fit; consider alternatives.");
        } else if (ksTest) {
            recommendations.push("Goodness of fit supports the distribution.");
        }

        if (this.statistics.n < 30) {
            recommendations.push("Small sample; results may be unreliable.");
        }

        if (Object.keys(this.comparisonResults).length > 0) {
            const bestFit = this.comparisonResults.bestFit;
            recommendations.push(`Best fit: ${DistributionRegistry.getDistribution(bestFit).name}`);
        }

        return recommendations;
    }

    generateHypothesisTestsSection() {
        const data = [];

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'HYPOTHESIS TESTS', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);

        Object.entries(this.hypothesisTests).forEach(([testName, test]) => {
            data.push([
                { value: test.testType.toUpperCase(), type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);

            data.push([
                { value: 'Null Hypothesis:', type: 'label' },
                { value: test.nullHypothesis, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);

            data.push([
                { value: 'Test Statistic:', type: 'label' },
                { value: test.testStatistic.toFixed(4), type: 'result' },
                { value: test.method || '', type: 'data' },
                { value: '', type: 'data' }
            ]);

            data.push([
                { value: 'P-Value:', type: 'label' },
                { value: test.pValue.toFixed(6), type: 'result' },
                { value: test.reject ? 'Reject H₀' : 'Fail to reject H₀', type: 'data' },
                { value: '', type: 'data' }
            ]);

            data.push([
                { value: 'Conclusion:', type: 'label' },
                { value: test.conclusion, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);

            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: 'data' }, { value: '', type: 'data' }]);
        });

        return data;
    }

    // ... Add other generate sections similar to original, adapted

    async generateXLSX(filename = 'workbook.xlsx') {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Analysis');

        this.currentWorkbook.forEach((row, rowIndex) => {
            const excelRow = sheet.getRow(rowIndex + 1);
            row.forEach((cell, colIndex) => {
                const excelCell = excelRow.getCell(colIndex + 1);
                excelCell.value = cell.value;

                switch (cell.type) {
                    case 'header':
                        excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colors.headerBg.replace('#', '') } };
                        excelCell.font = { color: { argb: this.colors.headerText.replace('#', '') }, bold: true };
                        break;
                    case 'section':
                        excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colors.sectionBg.replace('#', '') } };
                        excelCell.font = { color: { argb: this.colors.sectionText.replace('#', '') }, bold: true };
                        break;
                    case 'result':
                        excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colors.resultBg.replace('#', '') } };
                        excelCell.font = { color: { argb: this.colors.resultText.replace('#', '') } };
                        break;
                    case 'formula':
                        excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colors.formulaBg.replace('#', '') } };
                        excelCell.font = { color: { argb: this.colors.formulaText.replace('#', '') } };
                        break;
                    case 'label':
                        excelCell.font = { bold: true };
                        break;
                }

                excelCell.border = {
                    top: { style: 'thin', color: { argb: this.colors.borderColor.replace('#', '') } },
                    left: { style: 'thin', color: { argb: this.colors.borderColor.replace('#', '') } },
                    bottom: { style: 'thin', color: { argb: this.colors.borderColor.replace('#', '') } },
                    right: { style: 'thin', color: { argb: this.colors.borderColor.replace('#', '') } }
                };
            });
            excelRow.commit();
        });

        sheet.columns.forEach(column => {
            column.width = 30;
        });

        await workbook.xlsx.writeFile(filename);
        return filename;
    }

    // Add generateImage if needed, similar

}
