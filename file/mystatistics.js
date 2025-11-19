// Enhanced Multi-Distribution StatisticalWorkbook.js
// Supports Normal, T, F, Chi-Square, Exponential, Gamma, Beta, and more

// Enhanced Multi-Distribution Statistical Workbook with Research Methodology Suite
// Supports: Normal, T, F, Chi-Square, Exponential, Gamma, Beta, LogNormal, Pareto, and more
// Features: Bayesian Analysis, Power Analysis, Meta-Analysis, Regression, Time Series, etc.

import { createCanvas } from '@napi-rs/canvas';
import * as math from 'mathjs';
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

// ============================================================================
// STATISTICAL DISTRIBUTIONS LIBRARY
// ============================================================================

class StatisticalDistributions {
    // Gamma function approximation (Lanczos approximation)
    static gamma(z) {
        const g = 7;
        const C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
                  771.32342877765313, -176.61502916214059, 12.507343278686905,
                  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];

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

    // Normal distribution
    static normalPDF(x, mean = 0, std = 1) {
        const z = (x - mean) / std;
        return Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI));
    }

    static normalCDF(x, mean = 0, std = 1) {
        const z = (x - mean) / std;
        const sign = z < 0 ? -1 : 1;
        const absZ = Math.abs(z);

        const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
        const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;

        const t = 1.0 / (1.0 + p * absZ);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);

        return 0.5 + sign * (y - 0.5);
    }

    static normalInverse(p, mean = 0, std = 1) {
        const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 
                   1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
        const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 
                   6.680131188771972e+01, -1.328068155288572e+01];
        const c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, 
                   -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
        const d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 
                   3.754408661907416e+00];

        const pLow = 0.02425, pHigh = 1 - pLow;
        let x;

        if (p < pLow) {
            const q = Math.sqrt(-2 * Math.log(p));
            x = (((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) / 
                ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
        } else if (p <= pHigh) {
            const q = p - 0.5, r = q * q;
            x = (((((a[1] * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * r + a[6]) * q / 
                (((((b[1] * r + b[2]) * r + b[3]) * r + b[4]) * r + b[5]) * r + 1);
        } else {
            const q = Math.sqrt(-2 * Math.log(1 - p));
            x = -(((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) / 
                 ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
        }

        return mean + std * x;
    }

    // T-distribution
    static tPDF(x, df) {
        const numerator = this.gamma((df + 1) / 2);
        const denominator = Math.sqrt(df * Math.PI) * this.gamma(df / 2);
        return numerator / denominator * Math.pow(1 + x * x / df, -(df + 1) / 2);
    }

    static tCDF(x, df) {
        if (df <= 0) return NaN;
        if (x === 0) return 0.5;

        const prob = 0.5 * this.incompleteBeta(df / (df + x * x), df / 2, 0.5);
        return x > 0 ? 1 - prob : prob;
    }

    static tInverse(p, df) {
        if (p <= 0 || p >= 1) return NaN;
        if (p === 0.5) return 0;

        let x = this.normalInverse(p);
        for (let i = 0; i < 20; i++) {
            const fx = this.tCDF(x, df) - p;
            const dfx = this.tPDF(x, df);
            const newX = x - fx / dfx;
            if (Math.abs(newX - x) < 1e-12) break;
            x = newX;
        }
        return x;
    }

    // Chi-square distribution
    static chiSquarePDF(x, df) {
        if (x <= 0) return 0;
        return Math.pow(x, df / 2 - 1) * Math.exp(-x / 2) / (Math.pow(2, df / 2) * this.gamma(df / 2));
    }

    static chiSquareCDF(x, df) {
        if (x <= 0) return 0;
        return this.incompleteGammaLower(df / 2, x / 2) / this.gamma(df / 2);
    }

    static chiSquareInverse(p, df) {
        if (p <= 0) return 0;
        if (p >= 1) return Infinity;
        if (df < 0.1) return NaN;
        if (p < 1e-10) return 0;
        if (p > 1 - 1e-10) return Infinity;

        let x;
        if (df === 1) {
            x = Math.pow(this.normalInverse(p, 0, 1), 2);
        } else if (df === 2) {
            x = -2 * Math.log(1 - p);
        } else {
            const h = 2 / (9 * df);
            const z = this.normalInverse(p, 0, 1);
            x = df * Math.pow(1 - h + z * Math.sqrt(h), 3);
            x = Math.max(0.1, x);
        }

        const maxIterations = 100, tolerance = 1e-10;
        
        for (let i = 0; i < maxIterations; i++) {
            const fx = this.chiSquareCDF(x, df) - p;
            const dfx = this.chiSquarePDF(x, df);
            
            if (Math.abs(fx) < tolerance) break;
            if (Math.abs(dfx) < 1e-20) break;
            
            const newX = x - fx / dfx;
            
            if (newX <= 0) {
                x = x / 2;
            } else if (newX > x * 10) {
                x = x * 2;
            } else if (newX < x / 10) {
                x = x / 2;
            } else {
                x = newX;
            }
            
            if (Math.abs(fx) < tolerance) break;
        }
        
        return Math.max(0, x);
    }

    // F-distribution
    static fPDF(x, df1, df2) {
        if (x <= 0) return 0;
        const numerator = Math.pow(df1 / df2, df1 / 2) * Math.pow(x, df1 / 2 - 1);
        const denominator = this.beta(df1 / 2, df2 / 2) * Math.pow(1 + df1 * x / df2, (df1 + df2) / 2);
        return numerator / denominator;
    }

    static fCDF(x, df1, df2) {
        if (x <= 0) return 0;
        return this.incompleteBeta(df1 * x / (df1 * x + df2), df1 / 2, df2 / 2);
    }

    static fInverse(p, df1, df2) {
        if (p <= 0) return 0;
        if (p >= 1) return Infinity;

        let x = 1;
        for (let i = 0; i < 50; i++) {
            const fx = this.fCDF(x, df1, df2) - p;
            const dfx = this.fPDF(x, df1, df2);
            if (Math.abs(dfx) < 1e-20) break;
            const newX = x - fx / dfx;
            if (newX <= 0) {
                x = x / 2;
                continue;
            }
            if (Math.abs(newX - x) < 1e-12) break;
            x = newX;
        }
        return x;
    }

    // Exponential distribution
    static exponentialPDF(x, lambda) {
        return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
    }

    static exponentialCDF(x, lambda) {
        return x >= 0 ? 1 - Math.exp(-lambda * x) : 0;
    }

    static exponentialInverse(p, lambda) {
        return p > 0 && p < 1 ? -Math.log(1 - p) / lambda : (p === 0 ? 0 : Infinity);
    }

    // Gamma distribution
    static gammaPDF(x, shape, scale) {
        if (x <= 0) return 0;
        return Math.pow(x, shape - 1) * Math.exp(-x / scale) / (Math.pow(scale, shape) * this.gamma(shape));
    }

    static gammaCDF(x, shape, scale) {
        if (x <= 0) return 0;
        return this.incompleteGammaLower(shape, x / scale) / this.gamma(shape);
    }

    static gammaInverse(p, shape, scale) {
        if (p <= 0) return 0;
        if (p >= 1) return Infinity;

        let low = 0, high = 100 * shape * scale;
        for (let i = 0; i < 100; i++) {
            const mid = (low + high) / 2;
            const cdf = this.gammaCDF(mid, shape, scale);
            if (cdf < p) low = mid;
            else high = mid;
            if (high - low < 1e-10) break;
        }
        return (low + high) / 2;
    }

    // Beta distribution
    static betaPDF(x, alpha, beta) {
        if (x <= 0 || x >= 1) return 0;
        return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) / this.beta(alpha, beta);
    }

    static betaCDF(x, alpha, beta) {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        return this.incompleteBeta(x, alpha, beta);
    }

    static betaInverse(p, alpha, beta) {
        if (p <= 0) return 0;
        if (p >= 1) return 1;

        let low = 0, high = 1;
        for (let i = 0; i < 100; i++) {
            const mid = (low + high) / 2;
            const cdf = this.betaCDF(mid, alpha, beta);
            if (cdf < p) low = mid;
            else high = mid;
            if (high - low < 1e-12) break;
        }
        return (low + high) / 2;
    }

    // Log-Normal distribution
    static logNormalPDF(x, mu, sigma) {
        if (x <= 0) return 0;
        const logx = Math.log(x);
        const numerator = Math.exp(-Math.pow(logx - mu, 2) / (2 * sigma * sigma));
        const denominator = x * sigma * Math.sqrt(2 * Math.PI);
        return numerator / denominator;
    }

    static logNormalCDF(x, mu, sigma) {
        if (x <= 0) return 0;
        const z = (Math.log(x) - mu) / sigma;
        return this.normalCDF(z, 0, 1);
    }

    static logNormalInverse(p, mu, sigma) {
        if (p <= 0) return 0;
        if (p >= 1) return Infinity;
        const z = this.normalInverse(p, 0, 1);
        return Math.exp(mu + sigma * z);
    }

    // Pareto distribution
    static paretoPDF(x, xm, alpha) {
        if (x < xm) return 0;
        if (alpha <= 0 || xm <= 0) return 0;
        return alpha * Math.pow(xm, alpha) / Math.pow(x, alpha + 1);
    }

    static paretoCDF(x, xm, alpha) {
        if (x < xm) return 0;
        if (alpha <= 0 || xm <= 0) return 0;
        return 1 - Math.pow(xm / x, alpha);
    }

    static paretoInverse(p, xm, alpha) {
        if (p <= 0) return xm;
        if (p >= 1) return Infinity;
        if (alpha <= 0 || xm <= 0) return NaN;
        return xm / Math.pow(1 - p, 1 / alpha);
    }

    // Binomial distribution
    static binomialPDF(k, n, p) {
        if (k < 0 || k > n || !Number.isInteger(k)) return 0;
        return math.combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    static binomialCDF(x, n, p) {
        let sum = 0;
        const floorX = Math.floor(x);
        for (let k = 0; k <= floorX; k++) {
            sum += this.binomialPDF(k, n, p);
        }
        return sum;
    }

    static binomialInverse(q, n, p) {
        if (q <= 0) return 0;
        if (q >= 1) return n;
        let sum = 0;
        for (let k = 0; k <= n; k++) {
            sum += this.binomialPDF(k, n, p);
            if (sum >= q) return k;
        }
        return n;
    }

    // Poisson distribution
    static poissonPDF(k, lambda) {
        if (k < 0 || !Number.isInteger(k)) return 0;
        return Math.exp(-lambda) * Math.pow(lambda, k) / math.factorial(k);
    }

    static poissonCDF(x, lambda) {
        let sum = 0;
        const floorX = Math.floor(x);
        for (let k = 0; k <= floorX; k++) {
            sum += this.poissonPDF(k, lambda);
        }
        return sum;
    }

    static poissonInverse(q, lambda) {
        if (q <= 0) return 0;
        if (q >= 1) return Infinity;
        let sum = 0, k = 0;
        while (sum < q) {
            sum += this.poissonPDF(k, lambda);
            if (sum >= q) return k;
            k++;
        }
        return k - 1;
    }

    // Geometric distribution
    static geometricPDF(k, p) {
        if (k < 1 || !Number.isInteger(k)) return 0;
        return Math.pow(1 - p, k - 1) * p;
    }

    static geometricCDF(x, p) {
        const floorX = Math.floor(x);
        if (floorX < 1) return 0;
        return 1 - Math.pow(1 - p, floorX);
    }

    static geometricInverse(q, p) {
        if (q <= 0) return 1;
        if (q >= 1) return Infinity;
        return Math.ceil(Math.log(1 - q) / Math.log(1 - p));
    }

    // Uniform distribution
    static uniformPDF(x, min, max) {
        if (x < min || x > max) return 0;
        return 1 / (max - min);
    }

    static uniformCDF(x, min, max) {
        if (x < min) return 0;
        if (x > max) return 1;
        return (x - min) / (max - min);
    }

    static uniformInverse(p, min, max) {
        if (p < 0 || p > 1) return NaN;
        return min + p * (max - min);
    }
}

// ============================================================================
// DISTRIBUTION REGISTRY
// ============================================================================

class DistributionRegistry {
    static distributions = {
        'normal': {
            name: 'Normal Distribution',
            params: ['mean', 'std'],
            paramNames: ['μ (mean)', 'σ (standard deviation)'],
            defaultParams: [0, 1],
            pdf: (x, params) => StatisticalDistributions.normalPDF(x, params[0], params[1]),
            cdf: (x, params) => StatisticalDistributions.normalCDF(x, params[0], params[1]),
            inverse: (p, params) => StatisticalDistributions.normalInverse(p, params[0], params[1]),
            estimateParams: (data) => {
                const mean = data.reduce((a, b) => a + b) / data.length;
                const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
                return [mean, Math.sqrt(variance)];
            },
            useCases: ['Measurement errors', 'Natural phenomena', 'Central Limit Theorem applications']
        },
        't': {
            name: 'T Distribution',
            params: ['df'],
            paramNames: ['df (degrees of freedom)'],
            defaultParams: [10],
            pdf: (x, params) => StatisticalDistributions.tPDF(x, params[0]),
            cdf: (x, params) => StatisticalDistributions.tCDF(x, params[0]),
            inverse: (p, params) => StatisticalDistributions.tInverse(p, params[0]),
            estimateParams: (data) => [Math.max(1, data.length - 1)],
            useCases: ['Small sample hypothesis testing', 'Confidence intervals with unknown variance']
        },
        'chisquare': {
            name: 'Chi-Square Distribution',
            params: ['df'],
            paramNames: ['df (degrees of freedom)'],
            defaultParams: [5],
            pdf: (x, params) => StatisticalDistributions.chiSquarePDF(x, params[0]),
            cdf: (x, params) => StatisticalDistributions.chiSquareCDF(x, params[0]),
            inverse: (p, params) => StatisticalDistributions.chiSquareInverse(p, params[0]),
            estimateParams: (data) => {
                const mean = data.reduce((a, b) => a + b) / data.length;
                return [Math.max(1, Math.round(mean))];
            },
            useCases: ['Goodness of fit tests', 'Independence tests', 'Variance testing']
        },
        'f': {
            name: 'F Distribution',
            params: ['df1', 'df2'],
            paramNames: ['df1 (numerator df)', 'df2 (denominator df)'],
            defaultParams: [5, 10],
            pdf: (x, params) => StatisticalDistributions.fPDF(x, params[0], params[1]),
            cdf: (x, params) => StatisticalDistributions.fCDF(x, params[0], params[1]),
            inverse: (p, params) => StatisticalDistributions.fInverse(p, params[0], params[1]),
            estimateParams: (data) => [5, 10],
            useCases: ['ANOVA', 'Comparing variances', 'Regression analysis']
        },
        'exponential': {
            name: 'Exponential Distribution',
            params: ['lambda'],
            paramNames: ['λ (rate parameter)'],
            defaultParams: [1],
            pdf: (x, params) => StatisticalDistributions.exponentialPDF(x, params[0]),
            cdf: (x, params) => StatisticalDistributions.exponentialCDF(x, params[0]),
            inverse: (p, params) => StatisticalDistributions.exponentialInverse(p, params[0]),
            estimateParams: (data) => {
                const mean = data.reduce((a, b) => a + b) / data.length;
                return [1 / mean];
            },
            useCases: ['Survival analysis', 'Reliability engineering', 'Queueing theory']
        },
        'gamma': {
            name: 'Gamma Distribution',
            params: ['shape', 'scale'],
            paramNames: ['α (shape)', 'β (scale)'],
            defaultParams: [2, 1],
            pdf: (x, params) => StatisticalDistributions.gammaPDF(x, params[0], params[1]),
            cdf: (x, params) => StatisticalDistributions.gammaCDF(x, params[0], params[1]),
            inverse: (p, params) => StatisticalDistributions.gammaInverse(p, params[0], params[1]),
            estimateParams: (data) => {
                const mean = data.reduce((a, b) => a + b) / data.length;
                const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
                const scale = variance / mean;
                const shape = mean / scale;
                return [shape, scale];
            },
            useCases: ['Waiting times', 'Reliability analysis', 'Bayesian priors']
        },
        'beta': {
            name: 'Beta Distribution',
            params: ['alpha', 'beta'],
            paramNames: ['α (shape 1)', 'β (shape 2)'],
            defaultParams: [2, 2],
            pdf: (x, params) => StatisticalDistributions.betaPDF(x, params[0], params[1]),
            cdf: (x, params) => StatisticalDistributions.betaCDF(x, params[0], params[1]),
            inverse: (p, params) => StatisticalDistributions.betaInverse(p, params[0], params[1]),
            estimateParams: (data) => {
                const mean = data.reduce((a, b) => a + b) / data.length;
                const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
                const temp = mean * (1 - mean) / variance - 1;
                const alpha = mean * temp;
                const beta = (1 - mean) * temp;
                return [Math.max(0.1, alpha), Math.max(0.1, beta)];
            },
            useCases: ['Proportions', 'Probabilities', 'Bayesian analysis']
        },
        'lognormal': {
            name: 'Log-Normal Distribution',
            params: ['mu', 'sigma'],
            paramNames: ['μ (log-scale location)', 'σ (log-scale scale)'],
            defaultParams: [0, 1],
            pdf: (x, params) => StatisticalDistributions.logNormalPDF(x, params[0], params[1]),
            cdf: (x, params) => StatisticalDistributions.logNormalCDF(x, params[0], params[1]),
            inverse: (p, params) => StatisticalDistributions.logNormalInverse(p, params[0], params[1]),
            estimateParams: (data) => {
                const positiveData = data.filter(x => x > 0);
                if (positiveData.length === 0) return [0, 1];
                
                const logData = positiveData.map(x => Math.log(x));
                const mu = logData.reduce((a, b) => a + b) / logData.length;
                const variance = logData.reduce((acc, val) => acc + Math.pow(val - mu, 2), 0) / (logData.length - 1);
                const sigma = Math.sqrt(Math.max(0.01, variance));
                
                return [mu, sigma];
            },
            useCases: ['Stock prices', 'Income distributions', 'Multiplicative processes', 'Environmental data']
        },
        'pareto': {
            name: 'Pareto Distribution',
            params: ['xm', 'alpha'],
            paramNames: ['xₘ (scale/minimum)', 'α (shape)'],
            defaultParams: [1, 1],
            pdf: (x, params) => StatisticalDistributions.paretoPDF(x, params[0], params[1]),
            cdf: (x, params) => StatisticalDistributions.paretoCDF(x, params[0], params[1]),
            inverse: (p, params) => StatisticalDistributions.paretoInverse(p, params[0], params[1]),
            estimateParams: (data) => {
                const positiveData = data.filter(x => x > 0);
                if (positiveData.length === 0) return [1, 1];

                const xm = Math.min(...positiveData);
                const validData = positiveData.filter(x => x > xm);
                
                if (validData.length === 0) {
                    const adjustedXm = xm * 0.999;
                    const sumLogRatio = positiveData.reduce((sum, x) => 
                        sum + Math.log(Math.max(x, xm * 1.001) / adjustedXm), 0);
                    const alpha = positiveData.length / Math.max(0.001, sumLogRatio);
                    return [adjustedXm, Math.max(0.1, alpha)];
                }
                
                const sumLogRatio = validData.reduce((sum, x) => sum + Math.log(x / xm), 0);
                const alpha = validData.length / Math.max(0.001, sumLogRatio);

                return [xm, Math.max(0.1, alpha)];
            },
            useCases: ['Wealth distributions', 'City sizes', 'Natural phenomena', '80-20 rule applications']
        },
        'binomial': {
            name: 'Binomial Distribution',
            params: ['n', 'p'],
            paramNames: ['n (trials)', 'p (success probability)'],
            defaultParams: [10, 0.5],
            pdf: (k, params) => StatisticalDistributions.binomialPDF(k, ...params),
            cdf: (x, params) => StatisticalDistributions.binomialCDF(x, ...params),
            inverse: (p, params) => StatisticalDistributions.binomialInverse(p, ...params),
            estimateParams: (data) => {
                const mean = data.reduce((a, b) => a + b) / data.length;
                const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
                const pEst = 1 - variance / mean;
                const nEst = Math.round(mean / pEst);
                return [Math.max(1, nEst), Math.max(0.01, Math.min(0.99, pEst))];
            },
            useCases: ['Number of successes in fixed trials', 'Quality control', 'Survey responses']
        },
        'poisson': {
            name: 'Poisson Distribution',
            params: ['lambda'],
            paramNames: ['λ (rate)'],
            defaultParams: [1],
            pdf: (k, params) => StatisticalDistributions.poissonPDF(k, ...params),
            cdf: (x, params) => StatisticalDistributions.poissonCDF(x, ...params),
            inverse: (p, params) => StatisticalDistributions.poissonInverse(p, ...params),
            estimateParams: (data) => {
                const mean = data.reduce((a, b) => a + b) / data.length;
                return [Math.max(0.01, mean)];
            },
            useCases: ['Rare events count', 'Arrival rates', 'Defects per unit']
        },
        'geometric': {
            name: 'Geometric Distribution',
            params: ['p'],
            paramNames: ['p (success probability)'],
            defaultParams: [0.5],
            pdf: (k, params) => StatisticalDistributions.geometricPDF(k, ...params),
            cdf: (x, params) => StatisticalDistributions.geometricCDF(x, ...params),
            inverse: (p, params) => StatisticalDistributions.geometricInverse(p, ...params),
            estimateParams: (data) => {
                const mean = data.reduce((a, b) => a + b) / data.length;
                return [Math.max(0.01, Math.min(0.99, 1 / mean))];
            },
            useCases: ['Trials until first success', 'Failure analysis']
        },
        'uniform': {
            name: 'Uniform Distribution',
            params: ['min', 'max'],
            paramNames: ['min (lower bound)', 'max (upper bound)'],
            defaultParams: [0, 1],
            pdf: (x, params) => StatisticalDistributions.uniformPDF(x, ...params),
            cdf: (x, params) => StatisticalDistributions.uniformCDF(x, ...params),
            inverse: (p, params) => StatisticalDistributions.uniformInverse(p, ...params),
            estimateParams: (data) => [Math.min(...data), Math.max(...data)],
            useCases: ['Equal probability intervals', 'Random number generation']
        }
    };

    static getDistribution(name) {
        return this.distributions[name] || null;
    }

    static getAllDistributions() {
        return Object.keys(this.distributions);
    }
}

// ============================================================================
// MATRIX OPERATIONS (for multivariate analysis and regression)
// ============================================================================

class MatrixOperations {
    static transpose(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    static multiply(A, B) {
        const result = [];
        for (let i = 0; i < A.length; i++) {
            result[i] = [];
            for (let j = 0; j < B[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < A[0].length; k++) {
                    sum += A[i][k] * B[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    static inverse(matrix) {
        const n = matrix.length;
        const identity = Array(n).fill(0).map((_, i) => 
            Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
        );
        
        const augmented = matrix.map((row, i) => [...row, ...identity[i]]);
        
        // Gauss-Jordan elimination
        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            
            const pivot = augmented[i][i];
            if (Math.abs(pivot) < 1e-10) {
                throw new Error('Matrix is singular and cannot be inverted');
            }
            
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= pivot;
            }
            
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = augmented[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }
        }
        
        return augmented.map(row => row.slice(n));
    }

    static eigenDecomposition(matrix) {
        // Simplified eigenvalue/eigenvector calculation using power iteration
        // For production, use a proper library like numeric.js
        const n = matrix.length;
        const maxIterations = 1000;
        const tolerance = 1e-10;
        
        const eigenvalues = [];
        const eigenvectors = [];
        
        // Find dominant eigenvalue/eigenvector
        let v = Array(n).fill(1).map(() => Math.random());
        let lambda = 0;
        
        for (let iter = 0; iter < maxIterations; iter++) {
            const Av = this.multiply(matrix, v.map(x => [x])).map(row => row[0]);
            const newLambda = Math.sqrt(Av.reduce((sum, x) => sum + x * x, 0));
            v = Av.map(x => x / newLambda);
            
            if (Math.abs(newLambda - lambda) < tolerance) break;
            lambda = newLambda;
        }
        
        eigenvalues.push(lambda);
        eigenvectors.push(v);
        
        return { values: eigenvalues, vectors: eigenvectors };
    }

    static determinant(matrix) {
        const n = matrix.length;
        if (n === 1) return matrix[0][0];
        if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        
        let det = 0;
        for (let j = 0; j < n; j++) {
            const minor = matrix.slice(1).map(row => 
                row.filter((_, colIdx) => colIdx !== j)
            );
            det += Math.pow(-1, j) * matrix[0][j] * this.determinant(minor);
        }
        return det;
    }
}

// ============================================================================
// ENHANCED STATISTICAL WORKBOOK - MAIN CLASS
// ============================================================================

export class EnhancedStatisticalWorkbook {
    constructor(options = {}) {
        this.version = '2.0.0';
        this.width = options.width || 1200;
        this.height = options.height || 1600;
        this.theme = options.theme || "excel";
        this.progressCallback = options.progressCallback || (() => {});
        this.randomSeed = options.randomSeed || Date.now();

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
        this.selectedDistribution = 'normal';
        this.distributionParams = null;
        this.distributionAnalysis = {};
        this.goodnessOfFit = {};
        this.confidenceIntervals = {};
        this.hypothesisTests = {};

        // Advanced analyses
        this.regressionResults = {};
        this.bayesianAnalysis = {};
        this.powerAnalysis = {};
        this.metaAnalysis = {};
        this.timeSeriesAnalysis = {};
        this.multivariateAnalysis = {};
        this.missingDataAnalysis = {};
        this.effectSizes = {};
        this.robustStatistics = {};
        this.nonParametricTests = {};

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

        // Cache for expensive computations
        this._cache = new Map();

        // Data validation
        this.validationResults = {};

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

    // ========================================================================
    // CACHE MANAGEMENT
    // ========================================================================

    getCached(key, computeFn) {
        if (!this._cache.has(key)) {
            this._cache.set(key, computeFn());
        }
        return this._cache.get(key);
    }

    clearCache() {
        this._cache.clear();
    }

    // ========================================================================
    // DATA VALIDATION
    // ========================================================================

    validateData() {
        const issues = [];
        const warnings = [];
        
        if (this.rawSamples.some(x => !isFinite(x))) {
            issues.push('Data contains non-finite values (NaN or Infinity)');
        }
        
        if (this.rawSamples.length < 3) {
            issues.push('Sample size too small for reliable inference (n < 3)');
        }
        
        const uniqueValues = new Set(this.rawSamples).size;
        if (uniqueValues < this.rawSamples.length * 0.1) {
            warnings.push('Very few unique values - consider discrete distribution');
        }

        if (this.rawSamples.length < 30) {
            warnings.push('Small sample size (n < 30) - use caution with parametric tests');
        }

        const sorted = [...this.rawSamples].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const outliers = sorted.filter(x => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr);
        
        if (outliers.length > 0.05 * sorted.length) {
            warnings.push(`${outliers.length} potential outliers detected (${(outliers.length/sorted.length*100).toFixed(1)}%)`);
        }
        
        return {
            isValid: issues.length === 0,
            issues: issues,
            warnings: warnings,
            dataQuality: this.assessDataQuality()
        };
    }

    assessDataQuality() {
        const n = this.rawSamples.length;
        let score = 100;
        
        if (n < 10) score -= 30;
        else if (n < 30) score -= 15;
        else if (n < 100) score -= 5;
        
        const uniqueRatio = new Set(this.rawSamples).size / n;
        if (uniqueRatio < 0.1) score -= 20;
        else if (uniqueRatio < 0.3) score -= 10;
        
        const sorted = [...this.rawSamples].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(n * 0.25)];
        const q3 = sorted[Math.floor(n * 0.75)];
        const iqr = q3 - q1;
        const outlierRatio = sorted.filter(x => 
            x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr
        ).length / n;
        
        if (outlierRatio > 0.1) score -= 15;
        else if (outlierRatio > 0.05) score -= 5;
        
        return {
            score: Math.max(0, score),
            rating: score >= 90 ? 'Excellent' : 
                   score >= 75 ? 'Good' : 
                   score >= 60 ? 'Fair' : 'Poor',
            recommendations: this.generateDataQualityRecommendations(score)
        };
    }

    generateDataQualityRecommendations(score) {
        const recs = [];
        if (score < 90) {
            if (this.rawSamples.length < 30) {
                recs.push('Collect more data points for reliable inference');
            }
            if (new Set(this.rawSamples).size / this.rawSamples.length < 0.3) {
                recs.push('Low variability - verify measurement precision');
            }
        }
        return recs;
    }

    // ========================================================================
    // DATA IMPORT METHODS
    // ========================================================================

    loadFromCSV(filePath) {
        const csvData = fs.readFileSync(filePath, 'utf8');
        const lines = csvData.split('\n').filter(line => line.trim());
        this.rawSamples = lines.map(line => 
            line.split(',')[0]
        ).map(Number).filter(n => !isNaN(n));
        
        console.log(`Loaded ${this.rawSamples.length} samples from CSV: ${filePath}`);
        this.validationResults = this.validateData();
    }

    loadFromJSON(filePath) {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        this.rawSamples = jsonData.samples || [];
        console.log(`Loaded ${this.rawSamples.length} samples from JSON: ${filePath}`);
        this.validationResults = this.validateData();
    }

    loadFromArray(data) {
        this.rawSamples = [...data];
        this.validationResults = this.validateData();
    }

    // ========================================================================
    // MAIN ANALYSIS METHOD
    // ========================================================================

    analyzeDistribution(config) {
        this.progressCallback({ stage: 'initialization', progress: 0 });
        
        this.sampleName = config.sampleName || "Sample Data";
        this.variableName = config.variableName || "Value";
        this.unitName = config.unitName || "units";
        this.scenarioDescription = config.scenarioDescription || "";
        this.rawSamples = [...config.samples];
        this.selectedDistribution = config.distribution || 'normal';
        this.distributionParams = config.distributionParams || null;
        this.targetValue = config.targetValue || null;
        this.targetAnalysisType = config.targetAnalysisType || null;

        // Validate data
        this.validationResults = this.validateData();
        this.progressCallback({ stage: 'validation', progress: 5 });

        // Calculate basic statistics
        this.calculateStatistics();
        this.progressCallback({ stage: 'statistics', progress: 15 });

        // Fit distribution
        this.fitDistribution();
        this.progressCallback({ stage: 'distribution', progress: 25 });

        // Calculate confidence intervals
        this.calculateDistributionConfidenceIntervals();
        this.calculateParameterConfidenceIntervals();
        this.progressCallback({ stage: 'confidence_intervals', progress: 35 });

        // Perform goodness of fit tests
        this.performGoodnessOfFitTests();
        this.progressCallback({ stage: 'goodness_of_fit', progress: 45 });

        // Robust statistics
        this.calculateRobustStatistics();
        this.progressCallback({ stage: 'robust_stats', progress: 55 });

        // Hypothesis testing if specified
        if (config.hypothesisTest) {
            this.performHypothesisTest(config.hypothesisTest);
        }
        this.progressCallback({ stage: 'hypothesis', progress: 65 });

        // Compare with other distributions if requested
        if (config.compareDistributions) {
            this.compareDistributions(config.compareDistributions);
        }
        this.progressCallback({ stage: 'comparison', progress: 75 });

        // Target analysis if target value provided
        if (this.targetValue !== null) {
            this.calculateDistributionSpecificTargetAnalysis();
        }
        this.progressCallback({ stage: 'target_analysis', progress: 85 });

        // Regression if specified
        if (config.regression) {
            this.performRegression(config.regression);
        }
        this.progressCallback({ stage: 'regression', progress: 90 });

        // Generate workbook
        this.generateWorkbook();
        this.progressCallback({ stage: 'complete', progress: 100 });

        return this.currentWorkbook;
    }

    // ========================================================================
    // BASIC STATISTICS
    // ========================================================================

    calculateStatistics() {
        const n = this.rawSamples.length;
        const sum = this.rawSamples.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        const sortedSamples = [...this.rawSamples].sort((a, b) => a - b);

        const variance = this.rawSamples.reduce((acc, val) => 
            acc + Math.pow(val - mean, 2), 0) / (n - 1);
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
            n, sum, mean, variance, standardDeviation,
            min: Math.min(...this.rawSamples),
            max: Math.max(...this.rawSamples),
            range: Math.max(...this.rawSamples) - Math.min(...this.rawSamples),
            median: getPercentile(50),
            q1: getPercentile(25),
            q3: getPercentile(75),
            iqr: getPercentile(75) - getPercentile(25),
            skewness: this.calculateSkewness(),
            kurtosis: this.calculateKurtosis(),
            coefficientOfVariation: standardDeviation / mean,
            standardError: standardDeviation / Math.sqrt(n),
            percentiles: {
                1: getPercentile(1), 5: getPercentile(5), 10: getPercentile(10),
                25: getPercentile(25), 50: getPercentile(50), 75: getPercentile(75),
                90: getPercentile(90), 95: getPercentile(95), 99: getPercentile(99)
            }
        };
    }

    pearsonCorrelation(x, y) {
    const n = x.length;
    if (n === 0) return 0;
    
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denomX = 0;
    let denomY = 0;
    
    for (let i = 0; i < n; i++) {
        const dx = x[i] - meanX;
        const dy = y[i] - meanY;
        numerator += dx * dy;
        denomX += dx * dx;
        denomY += dy * dy;
    }
    
    if (denomX === 0 || denomY === 0) return 0;
    
    return numerator / Math.sqrt(denomX * denomY);
}

    calculateSkewness() {
        const n = this.rawSamples.length;
        const mean = this.rawSamples.reduce((a, b) => a + b) / n;
        const std = Math.sqrt(this.rawSamples.reduce((acc, val) => 
            acc + Math.pow(val - mean, 2), 0) / n);

        const sumCubed = this.rawSamples.reduce((acc, val) => 
            acc + Math.pow((val - mean) / std, 3), 0);
        return (n / ((n - 1) * (n - 2))) * sumCubed;
    }

    calculateKurtosis() {
        const n = this.rawSamples.length;
        const mean = this.rawSamples.reduce((a, b) => a + b) / n;
        const std = Math.sqrt(this.rawSamples.reduce((acc, val) => 
            acc + Math.pow(val - mean, 2), 0) / n);

        const sumFourth = this.rawSamples.reduce((acc, val) => 
            acc + Math.pow((val - mean) / std, 4), 0);
        return (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * sumFourth - 
               3 * Math.pow(n - 1, 2) / ((n - 2) * (n - 3));
    }

    // ========================================================================
    // ROBUST STATISTICS
    // ========================================================================

    calculateRobustStatistics() {
        const sorted = [...this.rawSamples].sort((a, b) => a - b);
        
        this.robustStatistics = {
            median: this.statistics.median,
            mad: this.calculateMAD(sorted),
            trimmedMean: this.calculateTrimmedMean(sorted, 0.1),
            winsorizedMean: this.calculateWinsorizedMean(sorted, 0.1),
            robustSD: this.calculateRobustSD(sorted),
            outlierDetection: this.detectOutliers(sorted)
        };
    }

    calculateMAD(sorted) {
        const median = this.statistics.median;
        const absDeviations = sorted.map(x => Math.abs(x - median)).sort((a, b) => a - b);
        const mad = absDeviations[Math.floor(absDeviations.length / 2)];
        
        return {
            value: mad,
            scaledMAD: mad * 1.4826,
            interpretation: 'Robust measure of scale resistant to outliers'
        };
    }

    calculateTrimmedMean(sorted, trimProportion) {
        const trimCount = Math.floor(sorted.length * trimProportion);
        const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
        const mean = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
        
        return {
            value: mean,
            trimProportion: trimProportion,
            sampleSize: trimmed.length,
            interpretation: `Mean after removing ${(trimProportion*100).toFixed(0)}% from each tail`
        };
    }

    calculateWinsorizedMean(sorted, winsorProportion) {
        const winsorCount = Math.floor(sorted.length * winsorProportion);
        const winsorized = [...sorted];
        
        const lowerBound = sorted[winsorCount];
        const upperBound = sorted[sorted.length - winsorCount - 1];
        
        for (let i = 0; i < winsorCount; i++) {
            winsorized[i] = lowerBound;
            winsorized[sorted.length - i - 1] = upperBound;
        }
        
        const mean = winsorized.reduce((a, b) => a + b, 0) / winsorized.length;
        
        return {
            value: mean,
            winsorProportion: winsorProportion,
            interpretation: `Mean after replacing extreme ${(winsorProportion*100).toFixed(0)}% with boundary values`
        };
    }

    calculateRobustSD(sorted) {
        const mad = this.calculateMAD(sorted);
        return {
            value: mad.scaledMAD,
            interpretation: 'Robust standard deviation based on MAD'
        };
    }

    detectOutliers(sorted) {
        const q1 = this.statistics.q1;
        const q3 = this.statistics.q3;
        const iqr = this.statistics.iqr;
        
        const lowerFence = q1 - 1.5 * iqr;
        const upperFence = q3 + 1.5 * iqr;
        
        const extremeLowerFence = q1 - 3 * iqr;
        const extremeUpperFence = q3 + 3 * iqr;
        
        const outliers = sorted.filter(x => x < lowerFence || x > upperFence);
        const extremeOutliers = sorted.filter(x => 
            x < extremeLowerFence || x > extremeUpperFence
        );
        
        return {
            method: 'Tukey Fences (IQR)',
            lowerFence, upperFence,
            extremeLowerFence, extremeUpperFence,
            outliers: outliers,
            extremeOutliers: extremeOutliers,
            outlierCount: outliers.length,
            extremeOutlierCount: extremeOutliers.length,
            outlierPercentage: ((outliers.length / sorted.length) * 100).toFixed(2) + '%',
            recommendation: outliers.length > 0.05 * sorted.length ? 
                'Consider robust methods or data transformation' : 
                'No significant outlier concern'
        };
    }

    // ========================================================================
    // REGRESSION ANALYSIS
    // ========================================================================

    performRegression(config) {
        const { type = 'linear', predictors, response } = config;
        
        switch(type) {
            case 'linear':
                this.regressionResults.linear = this.performLinearRegression(predictors, response);
                break;
            case 'multiple':
                this.regressionResults.multiple = this.performMultipleRegression(predictors, response);
                break;
            case 'polynomial':
                this.regressionResults.polynomial = this.performPolynomialRegression(
                    predictors, response, config.degree || 2
                );
                break;
            case 'logistic':
                this.regressionResults.logistic = this.performLogisticRegression(predictors, response);
                break;
            case 'probit':
                this.regressionResults.probit = this.performProbitRegression(predictors, response);
                break;
            case 'poisson':
                this.regressionResults.poisson = this.performPoissonRegression(predictors, response);
                break;
            case 'negativeBinomial':
                this.regressionResults.negativeBinomial = this.performNegativeBinomialRegression(predictors, response);
                break;
            case 'ridge':
                this.regressionResults.ridge = this.performRidgeRegression(
                    predictors, response, config.lambda || 1.0
                );
                break;
            case 'lasso':
                this.regressionResults.lasso = this.performLassoRegression(
                    predictors, response, config.lambda || 1.0
                );
                break;
            case 'elasticNet':
                this.regressionResults.elasticNet = this.performElasticNetRegression(
                    predictors, response, config.alpha || 0.5, config.lambda || 1.0
                );
                break;
            case 'quantile':
                this.regressionResults.quantile = this.performQuantileRegression(
                    predictors, response, config.quantile || 0.5
                );
                break;
            case 'robust':
                this.regressionResults.robust = this.performRobustRegression(predictors, response);
                break;
            default:
                throw new Error(`Unknown regression type: ${type}`);
        }
    }

    // ========================================================================
    // REGULARIZED REGRESSION METHODS
    // ========================================================================

    performRidgeRegression(X, y, lambda = 1.0) {
        // Ridge regression: minimize ||y - Xβ||² + λ||β||²
        const n = X.length;
        const k = X[0].length;

        // Standardize predictors (important for regularization)
        const { X_scaled, means, stds } = this.standardizeMatrix(X);
        
        // Add intercept
        const X_design = X_scaled.map(row => [1, ...row]);
        
        // Ridge solution: β = (X'X + λI)^(-1)X'y
        const X_t = MatrixOperations.transpose(X_design);
        const X_tX = MatrixOperations.multiply(X_t, X_design);
        
        // Add ridge penalty (don't penalize intercept)
        const ridgeMatrix = X_tX.map((row, i) => 
            row.map((val, j) => i === j && i > 0 ? val + lambda : val)
        );
        
        try {
            const ridgeInv = MatrixOperations.inverse(ridgeMatrix);
            const X_ty = MatrixOperations.multiply(X_t, y.map(yi => [yi]));
            const beta = MatrixOperations.multiply(ridgeInv, X_ty).map(row => row[0]);
            
            // Predictions
            const predictions = X_design.map(row => 
                row.reduce((sum, xi, i) => sum + xi * beta[i], 0)
            );
            
            // Residuals and fit statistics
            const residuals = y.map((yi, i) => yi - predictions[i]);
            const SSE = residuals.reduce((sum, r) => sum + r * r, 0);
            const meanY = y.reduce((a, b) => a + b, 0) / n;
            const SST = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
            const rSquared = 1 - SSE / SST;
            
            // Effective degrees of freedom for ridge
            const H = MatrixOperations.multiply(
                X_design,
                MatrixOperations.multiply(ridgeInv, X_t)
            );
            const trace = H.reduce((sum, row, i) => sum + row[i], 0);
            const effectiveDF = trace;
            
            // Rescale coefficients back to original scale
            const rescaledBeta = beta.map((b, i) => {
                if (i === 0) {
                    // Intercept adjustment
                    let adjustment = 0;
                    for (let j = 0; j < k; j++) {
                        adjustment += beta[j + 1] * means[j] / stds[j];
                    }
                    return b - adjustment;
                }
                return b / stds[i - 1];
            });
            
            return {
                type: 'Ridge Regression',
                lambda: lambda,
                coefficients: rescaledBeta.map((value, i) => ({
                    name: i === 0 ? 'Intercept' : `X${i}`,
                    value,
                    standardized: beta[i],
                    interpretation: i > 0 ? 
                        `Effect of X${i} with L2 penalty` : 
                        'Intercept'
                })),
                modelFit: {
                    rSquared,
                    adjustedRSquared: 1 - (1 - rSquared) * (n - 1) / (n - effectiveDF - 1),
                    SSE,
                    SST,
                    RMSE: Math.sqrt(SSE / n),
                    effectiveDF: effectiveDF
                },
                predictions,
                residuals,
                regularization: {
                    lambda: lambda,
                    penalty: beta.slice(1).reduce((sum, b) => sum + b * b, 0),
                    interpretation: 'L2 penalty reduces coefficient magnitudes'
                },
                crossValidation: this.ridgeCrossValidation(X, y, lambda)
            };
        } catch (e) {
            throw new Error('Ridge regression failed: ' + e.message);
        }
    }

    performLassoRegression(X, y, lambda = 1.0) {
        // Lasso regression: minimize ||y - Xβ||² + λ||β||₁
        // Using coordinate descent algorithm
        const n = X.length;
        const k = X[0].length;

        const { X_scaled, means, stds } = this.standardizeMatrix(X);
        
        // Initialize coefficients
        let beta = Array(k).fill(0);
        let intercept = y.reduce((a, b) => a + b, 0) / n;
        
        const maxIter = 1000;
        const tolerance = 1e-6;
        
        for (let iter = 0; iter < maxIter; iter++) {
            const betaOld = [...beta];
            
            // Update each coefficient
            for (let j = 0; j < k; j++) {
                // Calculate partial residual
                const partialResidual = y.map((yi, i) => {
                    let pred = intercept;
                    for (let l = 0; l < k; l++) {
                        if (l !== j) pred += X_scaled[i][l] * beta[l];
                    }
                    return yi - pred;
                });
                
                // Calculate correlation
                let rho = 0;
                for (let i = 0; i < n; i++) {
                    rho += X_scaled[i][j] * partialResidual[i];
                }
                rho /= n;
                
                // Soft thresholding
                if (rho > lambda) {
                    beta[j] = rho - lambda;
                } else if (rho < -lambda) {
                    beta[j] = rho + lambda;
                } else {
                    beta[j] = 0;
                }
            }
            
            // Update intercept
            let sum = 0;
            for (let i = 0; i < n; i++) {
                let pred = 0;
                for (let j = 0; j < k; j++) {
                    pred += X_scaled[i][j] * beta[j];
                }
                sum += y[i] - pred;
            }
            intercept = sum / n;
            
            // Check convergence
            const maxChange = Math.max(...beta.map((b, i) => Math.abs(b - betaOld[i])));
            if (maxChange < tolerance) break;
        }
        
        // Predictions
        const predictions = X_scaled.map((row, i) => {
            let pred = intercept;
            for (let j = 0; j < k; j++) {
                pred += row[j] * beta[j];
            }
            return pred;
        });
        
        // Statistics
        const residuals = y.map((yi, i) => yi - predictions[i]);
        const SSE = residuals.reduce((sum, r) => sum + r * r, 0);
        const meanY = y.reduce((a, b) => a + b, 0) / n;
        const SST = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
        const rSquared = 1 - SSE / SST;
        
        // Count non-zero coefficients
        const nonZeroCount = beta.filter(b => Math.abs(b) > 1e-10).length;
        
        // Rescale coefficients
        const rescaledBeta = beta.map((b, j) => b / stds[j]);
        let adjustedIntercept = intercept;
        for (let j = 0; j < k; j++) {
            adjustedIntercept -= rescaledBeta[j] * means[j];
        }
        
        return {
            type: 'Lasso Regression',
            lambda: lambda,
            coefficients: [
                {
                    name: 'Intercept',
                    value: adjustedIntercept,
                    standardized: intercept,
                    interpretation: 'Intercept'
                },
                ...rescaledBeta.map((value, j) => ({
                    name: `X${j + 1}`,
                    value,
                    standardized: beta[j],
                    selected: Math.abs(beta[j]) > 1e-10,
                    interpretation: Math.abs(beta[j]) > 1e-10 ? 
                        `Selected variable with effect ${value.toFixed(4)}` : 
                        'Variable excluded (coefficient = 0)'
                }))
            ],
            modelFit: {
                rSquared,
                adjustedRSquared: 1 - (1 - rSquared) * (n - 1) / (n - nonZeroCount - 1),
                SSE, SST,
                RMSE: Math.sqrt(SSE / n)
            },
            predictions,
            residuals,
            regularization: {
                lambda: lambda,
                penalty: beta.reduce((sum, b) => sum + Math.abs(b), 0),
                interpretation: 'L1 penalty performs variable selection'
            },
            variableSelection: {
                totalVariables: k,
                selectedVariables: nonZeroCount,
                excludedVariables: k - nonZeroCount,
                sparsity: ((k - nonZeroCount) / k * 100).toFixed(1) + '%'
            }
        };
    }

    performElasticNetRegression(X, y, alpha = 0.5, lambda = 1.0) {
        // Elastic Net: minimize ||y - Xβ||² + λ[α||β||₁ + (1-α)||β||²]
        // Combines Ridge (α=0) and Lasso (α=1)
        const n = X.length;
        const k = X[0].length;

        const { X_scaled, means, stds } = this.standardizeMatrix(X);
        
        let beta = Array(k).fill(0);
        let intercept = y.reduce((a, b) => a + b, 0) / n;
        
        const maxIter = 1000;
        const tolerance = 1e-6;
        
        for (let iter = 0; iter < maxIter; iter++) {
            const betaOld = [...beta];
            
            for (let j = 0; j < k; j++) {
                const partialResidual = y.map((yi, i) => {
                    let pred = intercept;
                    for (let l = 0; l < k; l++) {
                        if (l !== j) pred += X_scaled[i][l] * beta[l];
                    }
                    return yi - pred;
                });
                
                let rho = 0;
                for (let i = 0; i < n; i++) {
                    rho += X_scaled[i][j] * partialResidual[i];
                }
                rho /= n;
                
                // Elastic net soft thresholding
                const lassoThreshold = lambda * alpha;
                const ridgePenalty = 1 + lambda * (1 - alpha);
                
                if (rho > lassoThreshold) {
                    beta[j] = (rho - lassoThreshold) / ridgePenalty;
                } else if (rho < -lassoThreshold) {
                    beta[j] = (rho + lassoThreshold) / ridgePenalty;
                } else {
                    beta[j] = 0;
                }
            }
            
            let sum = 0;
            for (let i = 0; i < n; i++) {
                let pred = 0;
                for (let j = 0; j < k; j++) {
                    pred += X_scaled[i][j] * beta[j];
                }
                sum += y[i] - pred;
            }
            intercept = sum / n;
            
            const maxChange = Math.max(...beta.map((b, i) => Math.abs(b - betaOld[i])));
            if (maxChange < tolerance) break;
        }
        
        const predictions = X_scaled.map((row, i) => {
            let pred = intercept;
            for (let j = 0; j < k; j++) {
                pred += row[j] * beta[j];
            }
            return pred;
        });
        
        const residuals = y.map((yi, i) => yi - predictions[i]);
        const SSE = residuals.reduce((sum, r) => sum + r * r, 0);
        const meanY = y.reduce((a, b) => a + b, 0) / n;
        const SST = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
        const rSquared = 1 - SSE / SST;
        
        const nonZeroCount = beta.filter(b => Math.abs(b) > 1e-10).length;
        
        const rescaledBeta = beta.map((b, j) => b / stds[j]);
        let adjustedIntercept = intercept;
        for (let j = 0; j < k; j++) {
            adjustedIntercept -= rescaledBeta[j] * means[j];
        }
        
        return {
            type: 'Elastic Net Regression',
            alpha: alpha,
            lambda: lambda,
            coefficients: [
                {
                    name: 'Intercept',
                    value: adjustedIntercept,
                    standardized: intercept,
                    interpretation: 'Intercept'
                },
                ...rescaledBeta.map((value, j) => ({
                    name: `X${j + 1}`,
                    value,
                    standardized: beta[j],
                    selected: Math.abs(beta[j]) > 1e-10,
                    interpretation: Math.abs(beta[j]) > 1e-10 ? 
                        `Selected with effect ${value.toFixed(4)}` : 
                        'Variable excluded'
                }))
            ],
            modelFit: {
                rSquared,
                adjustedRSquared: 1 - (1 - rSquared) * (n - 1) / (n - nonZeroCount - 1),
                SSE, SST,
                RMSE: Math.sqrt(SSE / n)
            },
            predictions,
            residuals,
            regularization: {
                lambda, alpha,
                l1Penalty: beta.reduce((sum, b) => sum + Math.abs(b), 0),
                l2Penalty: beta.reduce((sum, b) => sum + b * b, 0),
                interpretation: `Combines Lasso (${(alpha*100).toFixed(0)}%) and Ridge (${((1-alpha)*100).toFixed(0)}%)`
            },
            variableSelection: {
                totalVariables: k,
                selectedVariables: nonZeroCount,
                excludedVariables: k - nonZeroCount
            }
        };
    }

    performQuantileRegression(X, y, tau = 0.5) {
        // Quantile regression: minimize Σρ_τ(y_i - x_i'β)
        // where ρ_τ(u) = u(τ - I(u<0))
        const n = X.length;
        const k = X[0].length;

        const X_design = X.map(row => [1, ...row]);
        
        // Initialize with OLS estimates
        const ols = this.performMultipleRegression(X, y);
        let beta = [ols.coefficients[0].value, ...ols.coefficients.slice(1).map(c => c.value)];
        
        const maxIter = 100;
        const tolerance = 1e-6;
        
        // Iteratively reweighted least squares for quantile regression
        for (let iter = 0; iter < maxIter; iter++) {
            const betaOld = [...beta];
            
            // Calculate residuals
            const residuals = y.map((yi, i) => 
                yi - X_design[i].reduce((sum, xij, j) => sum + xij * beta[j], 0)
            );
            
            // Calculate weights
            const weights = residuals.map(r => {
                if (Math.abs(r) < tolerance) return 1 / tolerance;
                return 1 / Math.abs(r);
            });
            
            // Weighted least squares
            const WX = X_design.map((row, i) => row.map(x => x * Math.sqrt(weights[i])));
            const Wy = y.map((yi, i) => {
                const pred = X_design[i].reduce((sum, xij, j) => sum + xij * beta[j], 0);
                const adj = (yi - pred) * (tau - (residuals[i] < 0 ? 1 : 0));
                return (yi + adj) * Math.sqrt(weights[i]);
            });
            
            try {
                const X_tWX = MatrixOperations.multiply(
                    MatrixOperations.transpose(WX),
                    WX
                );
                const X_tWX_inv = MatrixOperations.inverse(X_tWX);
                const X_tWy = MatrixOperations.multiply(
                    MatrixOperations.transpose(WX),
                    Wy.map(v => [v])
                );
                
                beta = MatrixOperations.multiply(X_tWX_inv, X_tWy).map(row => row[0]);
                
                const maxChange = Math.max(...beta.map((b, i) => Math.abs(b - betaOld[i])));
                if (maxChange < tolerance) break;
            } catch (e) {
                console.warn('Quantile regression convergence issue:', e.message);
                break;
            }
        }
        
        const predictions = X_design.map(row => 
            row.reduce((sum, xi, i) => sum + xi * beta[i], 0)
        );
        
        const residuals = y.map((yi, i) => yi - predictions[i]);
        
        // Quantile-specific loss
        const quantileLoss = residuals.reduce((sum, r) => 
            sum + (r < 0 ? (tau - 1) * r : tau * r), 0
        );
        
        return {
            type: 'Quantile Regression',
            quantile: tau,
            coefficients: beta.map((value, i) => ({
                name: i === 0 ? 'Intercept' : `X${i}`,
                value,
                interpretation: i > 0 ? 
                    `Effect on ${(tau*100).toFixed(0)}th percentile` : 
                    `${(tau*100).toFixed(0)}th percentile intercept`
            })),
            modelFit: {
                quantileLoss,
                quantile: tau,
                interpretation: tau === 0.5 ? 
                    'Median regression (robust to outliers)' :
                    `Models ${(tau*100).toFixed(0)}th conditional quantile`
            },
            predictions,
            residuals,
            comparison: tau === 0.5 ? {
                note: 'Median regression is more robust than OLS mean regression',
                advantage: 'Less sensitive to extreme values'
            } : null
        };
    }

    performRobustRegression(X, y) {
        // Robust regression using iteratively reweighted least squares (Huber M-estimator)
        const n = X.length;
        const k = X[0].length;

        const X_design = X.map(row => [1, ...row]);
        
        // Start with OLS
        const ols = this.performMultipleRegression(X, y);
        let beta = [ols.coefficients[0].value, ...ols.coefficients.slice(1).map(c => c.value)];
        
        const maxIter = 50;
        const tolerance = 1e-6;
        const c = 1.345; // Tuning constant for Huber
        
        for (let iter = 0; iter < maxIter; iter++) {
            const betaOld = [...beta];
            
            // Calculate residuals
            const residuals = y.map((yi, i) => 
                yi - X_design[i].reduce((sum, xij, j) => sum + xij * beta[j], 0)
            );
            
            // Calculate robust scale estimate (MAD)
            const absResiduals = residuals.map(Math.abs).sort((a, b) => a - b);
            const mad = absResiduals[Math.floor(absResiduals.length / 2)] * 1.4826;
            
            if (mad < 1e-10) break;
            
            // Calculate Huber weights
            const weights = residuals.map(r => {
                const standardized = r / mad;
                if (Math.abs(standardized) <= c) {
                    return 1;
                } else {
                    return c / Math.abs(standardized);
                }
            });
            
            // Weighted least squares
            const WX = X_design.map((row, i) => row.map(x => x * Math.sqrt(weights[i])));
            const Wy = y.map((yi, i) => yi * Math.sqrt(weights[i]));
            
            try {
                const X_tWX = MatrixOperations.multiply(
                    MatrixOperations.transpose(WX),
                    WX
                );
                const X_tWX_inv = MatrixOperations.inverse(X_tWX);
                const X_tWy = MatrixOperations.multiply(
                    MatrixOperations.transpose(WX),
                    Wy.map(v => [v])
                );
                
                beta = MatrixOperations.multiply(X_tWX_inv, X_tWy).map(row => row[0]);
                
                const maxChange = Math.max(...beta.map((b, i) => Math.abs(b - betaOld[i])));
                if (maxChange < tolerance) break;
            } catch (e) {
                console.warn('Robust regression convergence issue:', e.message);
                break;
            }
        }
        
        const predictions = X_design.map(row => 
            row.reduce((sum, xi, i) => sum + xi * beta[i], 0)
        );
        
        const residuals = y.map((yi, i) => yi - predictions[i]);
        const absResiduals = residuals.map(Math.abs).sort((a, b) => a - b);
        const mad = absResiduals[Math.floor(absResiduals.length / 2)] * 1.4826;
        
        // Identify outliers
        const outliers = residuals.map((r, i) => ({
            index: i,
            residual: r,
            standardized: r / mad,
            isOutlier: Math.abs(r / mad) > 2.5
        })).filter(item => item.isOutlier);
        
        const SSE = residuals.reduce((sum, r) => sum + r * r, 0);
        const meanY = y.reduce((a, b) => a + b, 0) / n;
        const SST = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
        const rSquared = 1 - SSE / SST;
        
        return {
            type: 'Robust Regression (Huber M-estimator)',
            coefficients: beta.map((value, i) => ({
                name: i === 0 ? 'Intercept' : `X${i}`,
                value,
                interpretation: i > 0 ? 
                    'Robust to outliers' : 
                    'Robust intercept'
            })),
            modelFit: {
                rSquared,
                RMSE: Math.sqrt(SSE / n),
                robustScale: mad,
                tuningConstant: c
            },
            predictions,
            residuals,
            outlierDiagnostics: {
                outliers: outliers,
                outlierCount: outliers.length,
                outlierPercentage: (outliers.length / n * 100).toFixed(2) + '%',
                robustScale: mad
            },
            comparison: {
                note: 'Robust regression downweights outliers automatically',
                advantage: 'No need to manually remove influential points'
            }
        };
    }

    // ========================================================================
    // HELPER METHODS FOR REGULARIZATION
    // ========================================================================

    standardizeMatrix(X) {
        const n = X.length;
        const k = X[0].length;
        
        // Calculate means
        const means = Array(k).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < k; j++) {
                means[j] += X[i][j];
            }
        }
        means.forEach((_, j) => means[j] /= n);
        
        // Calculate standard deviations
        const stds = Array(k).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < k; j++) {
                stds[j] += Math.pow(X[i][j] - means[j], 2);
            }
        }
        stds.forEach((_, j) => stds[j] = Math.sqrt(stds[j] / (n - 1)));
        
        // Prevent division by zero
        stds.forEach((s, j) => {
            if (s < 1e-10) stds[j] = 1;
        });
        
        // Standardize
        const X_scaled = X.map(row => 
            row.map((val, j) => (val - means[j]) / stds[j])
        );
        
        return { X_scaled, means, stds };
    }

    ridgeCrossValidation(X, y, lambda) {
        // Simple k-fold cross-validation for ridge regression
        const k = Math.min(5, Math.floor(X.length / 10));
        if (k < 2) {
            return { note: 'Insufficient data for cross-validation' };
        }
        
        const foldSize = Math.floor(X.length / k);
        const cvScores = [];
        
        for (let fold = 0; fold < k; fold++) {
            const testStart = fold * foldSize;
            const testEnd = fold === k - 1 ? X.length : (fold + 1) * foldSize;
            
            const X_train = [...X.slice(0, testStart), ...X.slice(testEnd)];
            const y_train = [...y.slice(0, testStart), ...y.slice(testEnd)];
            const X_test = X.slice(testStart, testEnd);
            const y_test = y.slice(testStart, testEnd);
            
            try {
                const model = this.performRidgeRegression(X_train, y_train, lambda);
                
                // Predict on test set
                const testPredictions = X_test.map(row => {
                    let pred = model.coefficients[0].value;
                    for (let j = 0; j < row.length; j++) {
                        pred += model.coefficients[j + 1].value * row[j];
                    }
                    return pred;
                });
                
                // Calculate MSE
                const mse = y_test.reduce((sum, yi, i) => 
                    sum + Math.pow(yi - testPredictions[i], 2), 0
                ) / y_test.length;
                
                cvScores.push(mse);
            } catch (e) {
                console.warn(`Fold ${fold} failed:`, e.message);
            }
        }
        
        if (cvScores.length === 0) {
            return { note: 'Cross-validation failed' };
        }
        
        const meanCV = cvScores.reduce((a, b) => a + b, 0) / cvScores.length;
        const stdCV = Math.sqrt(
            cvScores.reduce((sum, score) => sum + Math.pow(score - meanCV, 2), 0) / cvScores.length
        );
        
        return {
            folds: k,
            cvMSE: meanCV,
            cvRMSE: Math.sqrt(meanCV),
            stdError: stdCV,
            scores: cvScores
        };
    }



    performLinearRegression(x, y) {
        if (!x || !y || x.length !== y.length) {
            throw new Error('Invalid input for linear regression');
        }

        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Predictions and residuals
        const predictions = x.map(xi => slope * xi + intercept);
        const residuals = y.map((yi, i) => yi - predictions[i]);
        const SSE = residuals.reduce((sum, r) => sum + r * r, 0);
        const meanY = sumY / n;
        const SST = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
        const SSR = SST - SSE;
        const rSquared = SSR / SST;
        const adjustedRSquared = 1 - (1 - rSquared) * (n - 1) / (n - 2);

        // Standard errors
        const MSE = SSE / (n - 2);
        const slopeStdError = Math.sqrt(MSE / (sumX2 - sumX * sumX / n));
        const interceptStdError = Math.sqrt(MSE * (1/n + (sumX/n)**2 / (sumX2 - sumX*sumX/n)));

        // t-statistics
        const slopeTStat = slope / slopeStdError;
        const interceptTStat = intercept / interceptStdError;

        // p-values
        const slopePValue = 2 * (1 - StatisticalDistributions.tCDF(Math.abs(slopeTStat), n - 2));
        const interceptPValue = 2 * (1 - StatisticalDistributions.tCDF(Math.abs(interceptTStat), n - 2));

        // Confidence intervals
        const tCritical = StatisticalDistributions.tInverse(0.975, n - 2);
        const slopeCI = [
            slope - tCritical * slopeStdError,
            slope + tCritical * slopeStdError
        ];
        const interceptCI = [
            intercept - tCritical * interceptStdError,
            intercept + tCritical * interceptStdError
        ];

        // F-statistic for overall model
        const fStatistic = (SSR / 1) / (SSE / (n - 2));
        const fPValue = 1 - StatisticalDistributions.fCDF(fStatistic, 1, n - 2);

        return {
            type: 'Simple Linear Regression',
            equation: `y = ${intercept.toFixed(4)} + ${slope.toFixed(4)}x`,
            coefficients: {
                intercept: {
                    value: intercept,
                    stdError: interceptStdError,
                    tStat: interceptTStat,
                    pValue: interceptPValue,
                    confidenceInterval: interceptCI
                },
                slope: {
                    value: slope,
                    stdError: slopeStdError,
                    tStat: slopeTStat,
                    pValue: slopePValue,
                    confidenceInterval: slopeCI
                }
            },
            modelFit: {
                rSquared, adjustedRSquared,
                fStatistic, fPValue,
                SSE, SSR, SST, MSE,
                RMSE: Math.sqrt(MSE)
            },
            predictions, residuals,
            diagnostics: this.performRegressionDiagnostics(residuals, predictions, x),
            interpretation: this.interpretLinearRegression(slope, rSquared, slopePValue)
        };
    }

    performMultipleRegression(X, y) {
        // X is array of arrays (each row is observation, each column is predictor)
        const n = X.length;
        const k = X[0].length;

        // Add intercept column
        const X_design = X.map(row => [1, ...row]);

        // Convert to matrices
        const X_t = MatrixOperations.transpose(X_design);
        const X_tX = MatrixOperations.multiply(X_t, X_design);
        const X_tX_inv = MatrixOperations.inverse(X_tX);
        const X_ty = MatrixOperations.multiply(X_t, y.map(yi => [yi]));
        
        // Calculate coefficients: β = (X'X)^(-1)X'y
        const coefficients = MatrixOperations.multiply(X_tX_inv, X_ty).map(row => row[0]);

        // Predictions
        const predictions = X_design.map(row => 
            row.reduce((sum, xi, i) => sum + xi * coefficients[i], 0)
        );

        // Residuals
        const residuals = y.map((yi, i) => yi - predictions[i]);
        const SSE = residuals.reduce((sum, r) => sum + r * r, 0);
        const meanY = y.reduce((a, b) => a + b, 0) / n;
        const SST = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
        const SSR = SST - SSE;

        // Model statistics
        const rSquared = SSR / SST;
        const adjustedRSquared = 1 - (1 - rSquared) * (n - 1) / (n - k - 1);
        const MSE = SSE / (n - k - 1);
        const MSR = SSR / k;
        const fStatistic = MSR / MSE;
        const fPValue = 1 - StatisticalDistributions.fCDF(fStatistic, k, n - k - 1);

        // Standard errors and t-statistics
        const standardErrors = coefficients.map((_, i) => 
            Math.sqrt(MSE * X_tX_inv[i][i])
        );
        const tStats = coefficients.map((coef, i) => coef / standardErrors[i]);
        const pValues = tStats.map(t => 
            2 * (1 - StatisticalDistributions.tCDF(Math.abs(t), n - k - 1))
        );

        const tCritical = StatisticalDistributions.tInverse(0.975, n - k - 1);
        const confidenceIntervals = coefficients.map((coef, i) => [
            coef - tCritical * standardErrors[i],
            coef + tCritical * standardErrors[i]
        ]);

        return {
            type: 'Multiple Linear Regression',
            coefficients: coefficients.map((value, i) => ({
                name: i === 0 ? 'Intercept' : `X${i}`,
                value,
                stdError: standardErrors[i],
                tStat: tStats[i],
                pValue: pValues[i],
                confidenceInterval: confidenceIntervals[i]
            })),
            modelFit: {
                rSquared, adjustedRSquared,
                fStatistic, fPValue,
                SSE, SSR, SST, MSE, RMSE: Math.sqrt(MSE)
            },
            predictions, residuals,
            diagnostics: this.performRegressionDiagnostics(residuals, predictions, X),
            VIF: this.calculateVIF(X)
        };
    }

    performPolynomialRegression(x, y, degree) {
        // Transform x into polynomial features
        const X = x.map(xi => {
            const row = [];
            for (let d = 1; d <= degree; d++) {
                row.push(Math.pow(xi, d));
            }
            return row;
        });

        const result = this.performMultipleRegression(X, y);
        result.type = `Polynomial Regression (degree ${degree})`;
        result.degree = degree;
        
        return result;
    }

    performLogisticRegression(X, y) {
        // Newton-Raphson for logistic regression
        const n = X.length;
        const k = X[0].length;
        
        // Add intercept
        const X_design = X.map(row => [1, ...row]);
        
        // Initialize coefficients
        let beta = Array(k + 1).fill(0);
        const maxIter = 100;
        const tolerance = 1e-6;

        for (let iter = 0; iter < maxIter; iter++) {
            // Calculate probabilities
            const eta = X_design.map(row => 
                row.reduce((sum, xi, i) => sum + xi * beta[i], 0)
            );
            const p = eta.map(e => 1 / (1 + Math.exp(-e)));
            
            // Calculate gradient
            const gradient = Array(k + 1).fill(0);
            for (let j = 0; j < k + 1; j++) {
                for (let i = 0; i < n; i++) {
                    gradient[j] += X_design[i][j] * (y[i] - p[i]);
                }
            }
            
            // Calculate Hessian
            const W = p.map(pi => pi * (1 - pi));
            const X_t = MatrixOperations.transpose(X_design);
            const WX = X_design.map((row, i) => row.map(x => x * W[i]));
            const hessian = MatrixOperations.multiply(X_t, WX);
            
            try {
                const hessianInv = MatrixOperations.inverse(hessian);
                const delta = MatrixOperations.multiply(
                    hessianInv, 
                    gradient.map(g => [g])
                ).map(row => row[0]);
                
                // Update coefficients
                beta = beta.map((b, i) => b + delta[i]);
                
                // Check convergence
                const maxDelta = Math.max(...delta.map(Math.abs));
                if (maxDelta < tolerance) break;
            } catch (e) {
                console.warn('Logistic regression convergence issue:', e.message);
                break;
            }
        }

        // Calculate final predictions
        const predictions = X_design.map(row => {
            const eta = row.reduce((sum, xi, i) => sum + xi * beta[i], 0);
            return 1 / (1 + Math.exp(-eta));
        });

        // Log-likelihood
        const logLikelihood = y.reduce((sum, yi, i) => {
            const pi = predictions[i];
            return sum + yi * Math.log(pi + 1e-10) + (1 - yi) * Math.log(1 - pi + 1e-10);
        }, 0);

        // Pseudo R-squared (McFadden)
        const nullLogLikelihood = y.reduce((sum, yi) => {
            const p0 = y.reduce((a, b) => a + b) / n;
            return sum + yi * Math.log(p0 + 1e-10) + (1 - yi) * Math.log(1 - p0 + 1e-10);
        }, 0);
        const pseudoRSquared = 1 - logLikelihood / nullLogLikelihood;

        return {
            type: 'Logistic Regression',
            coefficients: beta.map((value, i) => ({
                name: i === 0 ? 'Intercept' : `X${i}`,
                value,
                oddsRatio: Math.exp(value),
                interpretation: i > 0 ? 
                    `One unit increase in X${i} multiplies odds by ${Math.exp(value).toFixed(3)}` : 
                    'Baseline log-odds'
            })),
            modelFit: {
                logLikelihood,
                nullLogLikelihood,
                pseudoRSquared,
                AIC: 2 * (k + 1) - 2 * logLikelihood,
                BIC: (k + 1) * Math.log(n) - 2 * logLikelihood
            },
            predictions,
            classificationMatrix: this.calculateClassificationMatrix(y, predictions, 0.5)
        };
    }

    calculateClassificationMatrix(actual, predicted, threshold = 0.5) {
        const binaryPredictions = predicted.map(p => p >= threshold ? 1 : 0);
        
        let TP = 0, TN = 0, FP = 0, FN = 0;
        for (let i = 0; i < actual.length; i++) {
            if (actual[i] === 1 && binaryPredictions[i] === 1) TP++;
            else if (actual[i] === 0 && binaryPredictions[i] === 0) TN++;
            else if (actual[i] === 0 && binaryPredictions[i] === 1) FP++;
            else if (actual[i] === 1 && binaryPredictions[i] === 0) FN++;
        }

        const accuracy = (TP + TN) / (TP + TN + FP + FN);
        const precision = TP / (TP + FP) || 0;
        const recall = TP / (TP + FN) || 0;
        const f1Score = 2 * precision * recall / (precision + recall) || 0;

        return {
            confusionMatrix: { TP, TN, FP, FN },
            accuracy, precision, recall, f1Score,
            threshold
        };
    }

    performRegressionDiagnostics(residuals, predictions, X) {
        // Normality test on residuals
        const residualMean = residuals.reduce((a, b) => a + b, 0) / residuals.length;
        const residualStd = Math.sqrt(
            residuals.reduce((sum, r) => sum + Math.pow(r - residualMean, 2), 0) / 
            (residuals.length - 1)
        );

        // Standardized residuals
        const standardizedResiduals = residuals.map(r => (r - residualMean) / residualStd);

        // Durbin-Watson test for autocorrelation
        let dw = 0;
        for (let i = 1; i < residuals.length; i++) {
            dw += Math.pow(residuals[i] - residuals[i-1], 2);
        }
        dw /= residuals.reduce((sum, r) => sum + r * r, 0);

        return {
            residualMean,
            residualStd,
            standardizedResiduals,
            durbinWatson: {
                statistic: dw,
                interpretation: dw < 1.5 ? 'Positive autocorrelation' :
                               dw > 2.5 ? 'Negative autocorrelation' :
                               'No significant autocorrelation'
            },
            normalityTest: this.testResidualNormality(residuals),
            homoscedasticityTest: this.testHomoscedasticity(residuals, predictions)
        };
    }

    testResidualNormality(residuals) {
        // Shapiro-Wilk test on residuals
        const sorted = [...residuals].sort((a, b) => a - b);
        const n = sorted.length;
        
        if (n < 3 || n > 5000) {
            return {
                test: 'Shapiro-Wilk',
                note: 'Sample size out of range for test',
                conclusion: 'Visual inspection recommended'
            };
        }

        const mean = residuals.reduce((a, b) => a + b, 0) / n;
        const ss = residuals.reduce((acc, x) => acc + (x - mean) ** 2, 0);

        if (ss === 0) {
            return {
                test: 'Shapiro-Wilk',
                note: 'Zero variance in residuals',
                conclusion: 'Perfect fit or data issue'
            };
        }

        const m = new Array(n);
        for (let i = 0; i < n; i++) {
            m[i] = StatisticalDistributions.normalInverse((i + 1 - 0.375) / (n + 0.25), 0, 1);
        }
        
        const mm = m.reduce((acc, val) => acc + val ** 2, 0);
        const a = m.map(mi => mi / Math.sqrt(mm));

        let b = 0;
        for (let i = 0; i < n; i++) {
            b += a[i] * sorted[i];
        }

        const w = (b ** 2) / ss;
        const mu = 0.0038915 * Math.log(n) ** 3 - 0.083751 * Math.log(n) ** 2 - 
                   0.31082 * Math.log(n) - 1.5861;
        const sigma = Math.exp(0.0030302 * Math.log(n) ** 2 - 0.082676 * Math.log(n) - 0.4803);
        const z = (Math.log(Math.max(1e-10, 1 - w)) - mu) / sigma;
        const pValue = Math.max(0, Math.min(1, 1 - StatisticalDistributions.normalCDF(z, 0, 1)));

        return {
            test: 'Shapiro-Wilk',
            statistic: w,
            pValue,
            conclusion: pValue > 0.05 ? 
                'Residuals appear normally distributed' : 
                'Residuals show departure from normality'
        };
    }

    testHomoscedasticity(residuals, predictions) {
        // Breusch-Pagan test approximation
        const squaredResiduals = residuals.map(r => r * r);
        const meanSqRes = squaredResiduals.reduce((a, b) => a + b, 0) / squaredResiduals.length;
        
        // Correlation between squared residuals and predictions
        const meanPred = predictions.reduce((a, b) => a + b, 0) / predictions.length;
        
        let num = 0, denPred = 0, denRes = 0;
        for (let i = 0; i < predictions.length; i++) {
            num += (predictions[i] - meanPred) * (squaredResiduals[i] - meanSqRes);
            denPred += Math.pow(predictions[i] - meanPred, 2);
            denRes += Math.pow(squaredResiduals[i] - meanSqRes, 2);
        }
        
        const correlation = num / Math.sqrt(denPred * denRes);

        return {
            test: 'Breusch-Pagan (approximate)',
            correlation: correlation,
            conclusion: Math.abs(correlation) < 0.3 ? 
                'No evidence of heteroscedasticity' : 
                'Possible heteroscedasticity detected'
        };
    }

    calculateVIF(X) {
        // Variance Inflation Factor for each predictor
        const n = X.length;
        const k = X[0].length;
        const vifs = [];

        for (let j = 0; j < k; j++) {
            // Use other predictors to predict X[j]
            const y = X.map(row => row[j]);
            const otherX = X.map(row => row.filter((_, idx) => idx !== j));
            
            if (otherX[0].length === 0) {
                vifs.push({ predictor: `X${j+1}`, VIF: 1, interpretation: 'No multicollinearity' });
                continue;
            }

            try {
                const regression = this.performMultipleRegression(otherX, y);
                const vif = 1 / (1 - regression.modelFit.rSquared);
                
                vifs.push({
                    predictor: `X${j+1}`,
                    VIF: vif,
                    interpretation: vif < 5 ? 'Low multicollinearity' :
                                   vif < 10 ? 'Moderate multicollinearity' :
                                   'High multicollinearity - consider removing'
                });
            } catch (e) {
                vifs.push({
                    predictor: `X${j+1}`,
                    VIF: null,
                    interpretation: 'Cannot calculate VIF'
                });
            }
        }

        return vifs;
    }

    interpretLinearRegression(slope, rSquared, pValue) {
        const interpretations = [];
        
        if (pValue < 0.001) {
            interpretations.push('Highly significant relationship (p < 0.001)');
        } else if (pValue < 0.01) {
            interpretations.push('Significant relationship (p < 0.01)');
        } else if (pValue < 0.05) {
            interpretations.push('Significant relationship (p < 0.05)');
        } else {
            interpretations.push('No significant relationship (p ≥ 0.05)');
        }

        if (rSquared >= 0.9) {
            interpretations.push('Excellent model fit (R² ≥ 0.9)');
        } else if (rSquared >= 0.7) {
            interpretations.push('Good model fit (R² ≥ 0.7)');
        } else if (rSquared >= 0.5) {
            interpretations.push('Moderate model fit (R² ≥ 0.5)');
        } else {
            interpretations.push('Weak model fit (R² < 0.5)');
        }

        interpretations.push(
            slope > 0 ? 'Positive relationship: Y increases as X increases' :
                       'Negative relationship: Y decreases as X increases'
        );

        return interpretations.join('. ');
    }

    // ========================================================================
    // BAYESIAN ANALYSIS
    // ========================================================================

    performBayesianInference(config) {
        const { priorDistribution, priorParams } = config;
        
        this.bayesianAnalysis = {
            prior: { distribution: priorDistribution, parameters: priorParams },
            posterior: this.calculatePosterior(priorDistribution, priorParams),
            credibleIntervals: this.calculateCredibleIntervals(priorDistribution, priorParams),
            bayesFactor: this.calculateBayesFactor(priorDistribution, priorParams)
        };

        return this.bayesianAnalysis;
    }

    calculatePosterior(priorDist, priorParams) {
        // Conjugate prior updates
        if (this.selectedDistribution === 'normal' && priorDist === 'normal') {
            const priorMean = priorParams[0];
            const priorVar = priorParams[1] ** 2;
            const n = this.statistics.n;
            const sampleMean = this.statistics.mean;
            const sampleVar = this.statistics.variance;
            
            const posteriorVar = 1 / (1/priorVar + n/sampleVar);
            const posteriorMean = posteriorVar * (priorMean/priorVar + n*sampleMean/sampleVar);
            
            return {
                distribution: 'normal',
                parameters: [posteriorMean, Math.sqrt(posteriorVar)],
                interpretation: 'Updated beliefs after observing data',
                priorInfluence: Math.abs(posteriorMean - sampleMean) / Math.abs(priorMean - sampleMean)
            };
        }

        if (this.selectedDistribution === 'exponential' && priorDist === 'gamma') {
            // Gamma-Exponential conjugate
            const [alpha0, beta0] = priorParams;
            const n = this.statistics.n;
            const sumX = this.statistics.sum;
            
            const alphaN = alpha0 + n;
            const betaN = beta0 + sumX;
            
            return {
                distribution: 'gamma',
                parameters: [alphaN, betaN],
                interpretation: 'Posterior distribution of rate parameter λ',
                posteriorMean: alphaN / betaN,
                posteriorMode: (alphaN - 1) / betaN
            };
        }

        return {
            note: 'Conjugate prior not implemented for this distribution pair',
            recommendation: 'Use MCMC sampling for posterior estimation'
        };
    }

    calculateCredibleIntervals(priorDist, priorParams) {
        const posterior = this.calculatePosterior(priorDist, priorParams);
        
        if (!posterior.parameters) {
            return { note: 'Posterior not available' };
        }

        const levels = [0.90, 0.95, 0.99];
        const intervals = {};

        levels.forEach(level => {
            const alpha = 1 - level;
            
            if (posterior.distribution === 'normal') {
                const [mean, std] = posterior.parameters;
                const z = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);
                intervals[level] = {
                    lower: mean - z * std,
                    upper: mean + z * std,
                    interpretation: `${(level*100)}% credible interval`
                };
            } else if (posterior.distribution === 'gamma') {
                const [shape, scale] = posterior.parameters;
                intervals[level] = {
                    lower: StatisticalDistributions.gammaInverse(alpha/2, shape, scale),
                    upper: StatisticalDistributions.gammaInverse(1 - alpha/2, shape, scale),
                    interpretation: `${(level*100)}% credible interval`
                };
            }
        });

        return intervals;
    }

    calculateBayesFactor(priorDist, priorParams) {
        // Simplified Bayes Factor calculation
        // For more complex scenarios, use MCMC
        
        return {
            note: 'Bayes Factor calculation requires specification of alternative hypothesis',
            recommendation: 'Use BIC approximation: BF ≈ exp((BIC_null - BIC_alt)/2)',
            interpretation: 'BF > 10: strong evidence for model, BF < 0.1: strong evidence against'
        };
    }

    // ========================================================================
    // POWER ANALYSIS
    // ========================================================================

    calculatePowerAnalysis(config) {
        const { effectSize, alpha = 0.05, desiredPower = 0.80, testType = 'twoSample' } = config;
        
        this.powerAnalysis = {
            inputParameters: { effectSize, alpha, desiredPower, testType },
            requiredSampleSize: this.calculateRequiredN(effectSize, alpha, desiredPower, testType),
            currentPower: this.calculateCurrentPower(effectSize, alpha, testType),
            minimumDetectableEffect: this.calculateMDE(alpha, desiredPower, testType),
            powerCurve: this.generatePowerCurve(effectSize, alpha, testType),
            recommendation: this.generatePowerRecommendation(effectSize, alpha, desiredPower)
        };

        return this.powerAnalysis;
    }

    calculateRequiredN(effectSize, alpha, power, testType) {
        const zAlpha = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);
        const zBeta = StatisticalDistributions.normalInverse(power, 0, 1);
        
        switch(testType) {
            case 'oneSample':
                return Math.ceil(Math.pow((zAlpha + zBeta) / effectSize, 2));
            
            case 'twoSample':
                return Math.ceil(2 * Math.pow((zAlpha + zBeta) / effectSize, 2));
            
            case 'paired':
                return Math.ceil(Math.pow((zAlpha + zBeta) / effectSize, 2));
            
            default:
                return null;
        }
    }

    calculateCurrentPower(effectSize, alpha, testType) {
        const n = this.statistics.n;
        const zAlpha = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);
        
        let noncentrality;
        switch(testType) {
            case 'oneSample':
                noncentrality = effectSize * Math.sqrt(n);
                break;
            case 'twoSample':
                noncentrality = effectSize * Math.sqrt(n / 2);
                break;
            case 'paired':
                noncentrality = effectSize * Math.sqrt(n);
                break;
            default:
                return null;
        }
        
        const power = 1 - StatisticalDistributions.normalCDF(zAlpha - noncentrality, 0, 1);
        
        return {
            power: power,
            interpretation: power >= 0.8 ? 'Adequate power' : 'Insufficient power',
            sampleSize: n
        };
    }

    calculateMDE(alpha, power, testType) {
        const n = this.statistics.n;
        const zAlpha = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);
        const zBeta = StatisticalDistributions.normalInverse(power, 0, 1);
        
        switch(testType) {
            case 'oneSample':
                return (zAlpha + zBeta) / Math.sqrt(n);
            case 'twoSample':
                return (zAlpha + zBeta) / Math.sqrt(n / 2);
            case 'paired':
                return (zAlpha + zBeta) / Math.sqrt(n);
            default:
                return null;
        }
    }

    generatePowerCurve(effectSize, alpha, testType) {
        const sampleSizes = [10, 20, 30, 50, 75, 100, 150, 200, 300, 500];
        const curve = [];
        
        sampleSizes.forEach(n => {
            const zAlpha = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);
            let noncentrality;
            
            switch(testType) {
                case 'oneSample':
                    noncentrality = effectSize * Math.sqrt(n);
                    break;
                case 'twoSample':
                    noncentrality = effectSize * Math.sqrt(n / 2);
                    break;
                case 'paired':
                    noncentrality = effectSize * Math.sqrt(n);
                    break;
            }
            
            const power = 1 - StatisticalDistributions.normalCDF(zAlpha - noncentrality, 0, 1);
            curve.push({ sampleSize: n, power: power });
        });
        
        return curve;
    }

    generatePowerRecommendation(effectSize, alpha, desiredPower) {
        const recommendations = [];
        const currentPower = this.calculateCurrentPower(effectSize, alpha, 'twoSample');
        
        if (currentPower.power < desiredPower) {
            const required = this.calculateRequiredN(effectSize, alpha, desiredPower, 'twoSample');
            recommendations.push(
                `Current sample size (n=${this.statistics.n}) provides ${(currentPower.power*100).toFixed(1)}% power.`
            );
            recommendations.push(
                `To achieve ${(desiredPower*100)}% power, collect n=${required} samples.`
            );
        } else {
            recommendations.push(
                `Current sample size provides adequate power (${(currentPower.power*100).toFixed(1)}%).`
            );
        }
        
        if (effectSize < 0.2) {
            recommendations.push('Very small effect size may require large sample for detection.');
        }
        
        return recommendations.join(' ');
    }

    // ========================================================================
    // META-ANALYSIS
    // ========================================================================

    performMetaAnalysis(studies) {
        // studies = [{mean, variance, n, studyName}]
        
        const weights = studies.map(s => 1 / s.variance);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        
        const pooledMean = studies.reduce((sum, s, i) => 
            sum + weights[i] * s.mean, 0) / totalWeight;
        
        const pooledVariance = 1 / totalWeight;
        
        // Heterogeneity tests
        const Q = studies.reduce((sum, s, i) => 
            sum + weights[i] * Math.pow(s.mean - pooledMean, 2), 0);
        
        const df = studies.length - 1;
        const pValueQ = 1 - StatisticalDistributions.chiSquareCDF(Q, df);
        
        const I2 = Math.max(0, (Q - df) / Q) * 100;
        
        // Tau-squared (between-study variance)
        const C = totalWeight - weights.reduce((sum, w) => sum + w*w, 0) / totalWeight;
        const tauSquared = Math.max(0, (Q - df) / C);
        
        this.metaAnalysis = {
            fixedEffect: {
                pooledEffect: pooledMean,
                standardError: Math.sqrt(pooledVariance),
                confidenceInterval: {
                    lower: pooledMean - 1.96 * Math.sqrt(pooledVariance),
                    upper: pooledMean + 1.96 * Math.sqrt(pooledVariance)
                },
                zScore: pooledMean / Math.sqrt(pooledVariance),
                pValue: 2 * (1 - StatisticalDistributions.normalCDF(
                    Math.abs(pooledMean / Math.sqrt(pooledVariance)), 0, 1
                ))
            },
            randomEffects: this.calculateRandomEffects(studies, tauSquared),
            heterogeneity: {
                Q, df, pValue: pValueQ,
                I2: I2.toFixed(1) + '%',
                tauSquared: tauSquared,
                interpretation: I2 < 25 ? 'Low heterogeneity' : 
                               I2 < 50 ? 'Moderate heterogeneity' :
                               I2 < 75 ? 'Substantial heterogeneity' : 
                               'High heterogeneity'
            },
            forestPlot: this.generateForestPlotData(studies, pooledMean, pooledVariance),
            publicationBias: this.assessPublicationBias(studies),
            sensitivity: this.performSensitivityAnalysis(studies)
        };

        return this.metaAnalysis;
    }

    calculateRandomEffects(studies, tauSquared) {
        const weights = studies.map(s => 1 / (s.variance + tauSquared));
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        
        const pooledMean = studies.reduce((sum, s, i) => 
            sum + weights[i] * s.mean, 0) / totalWeight;
        
        const pooledVariance = 1 / totalWeight;
        
        return {
            pooledEffect: pooledMean,
            standardError: Math.sqrt(pooledVariance),
            confidenceInterval: {
                lower: pooledMean - 1.96 * Math.sqrt(pooledVariance),
                upper: pooledMean + 1.96 * Math.sqrt(pooledVariance)
            },
            tauSquared: tauSquared
        };
    }

    generateForestPlotData(studies, pooledMean, pooledVariance) {
        return studies.map(s => ({
            study: s.studyName,
            mean: s.mean,
            lower: s.mean - 1.96 * Math.sqrt(s.variance),
            upper: s.mean + 1.96 * Math.sqrt(s.variance),
            weight: (1 / s.variance) / studies.reduce((sum, st) => sum + 1/st.variance, 0) * 100
        })).concat([{
            study: 'Pooled',
            mean: pooledMean,
            lower: pooledMean - 1.96 * Math.sqrt(pooledVariance),
            upper: pooledMean + 1.96 * Math.sqrt(pooledVariance),
            weight: 100
        }]);
    }

    assessPublicationBias(studies) {
        // Egger's test approximation
        const effectSizes = studies.map(s => s.mean);
        const standardErrors = studies.map(s => Math.sqrt(s.variance));
        const precisions = standardErrors.map(se => 1 / se);
        
        // Regression of effect size on precision
        const meanPrecision = precisions.reduce((a, b) => a + b) / precisions.length;
        const meanEffect = effectSizes.reduce((a, b) => a + b) / effectSizes.length;
        
        let numerator = 0, denominator = 0;
        for (let i = 0; i < studies.length; i++) {
            numerator += (precisions[i] - meanPrecision) * (effectSizes[i] - meanEffect);
            denominator += Math.pow(precisions[i] - meanPrecision, 2);
        }
        
        const slope = numerator / denominator;
        const intercept = meanEffect - slope * meanPrecision;
        
        return {
            test: "Egger's Regression Test",
            intercept: intercept,
            interpretation: Math.abs(intercept) < 1 ? 
                'No strong evidence of publication bias' :
                'Possible publication bias detected',
            recommendation: 'Visual inspection with funnel plot recommended'
        };
    }

    performSensitivityAnalysis(studies) {
        // Leave-one-out analysis
        const results = studies.map((_, idx) => {
            const subset = studies.filter((_, i) => i !== idx);
            const weights = subset.map(s => 1 / s.variance);
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            const pooledMean = subset.reduce((sum, s, i) => 
                sum + weights[i] * s.mean, 0) / totalWeight;
            
            return {
                excludedStudy: studies[idx].studyName,
                pooledEffect: pooledMean,
                change: Math.abs(pooledMean - this.metaAnalysis.fixedEffect.pooledEffect)
            };
        });
        
        const maxChange = Math.max(...results.map(r => r.change));
        
        return {
            leaveOneOut: results,
            maximalChange: maxChange,
            robustness: maxChange < 0.1 ? 'Robust' : maxChange < 0.3 ? 'Moderately robust' : 'Sensitive'
        };
    }

    // ========================================================================
    // TIME SERIES ANALYSIS
    // ========================================================================

    performTimeSeriesAnalysis(timeData, config = {}) {
        const { frequency = 1, seasonal = false, seasonalPeriod = 12 } = config;
        
        this.timeSeriesAnalysis = {
            descriptive: this.calculateTimeSeriesDescriptives(timeData),
            trend: this.detectTrend(timeData),
            seasonality: seasonal ? this.detectSeasonality(timeData, seasonalPeriod) : null,
            autocorrelation: this.calculateACF(timeData, Math.min(20, Math.floor(timeData.length / 4))),
            partialAutocorrelation: this.calculatePACF(timeData, Math.min(20, Math.floor(timeData.length / 4))),
            stationarity: this.testStationarity(timeData),
            decomposition: this.decomposeTimeSeries(timeData, seasonalPeriod),
            arima: this.fitARIMA(timeData, config.arimaOrder || [1, 0, 1]),
            forecast: this.forecastTimeSeries(timeData, config.horizon || 10)
        };

        return this.timeSeriesAnalysis;
    }

    calculateTimeSeriesDescriptives(data) {
        const n = data.length;
        const mean = data.reduce((a, b) => a + b, 0) / n;
        const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n;
        
        // First differences
        const diffs = [];
        for (let i = 1; i < n; i++) {
            diffs.push(data[i] - data[i-1]);
        }
        
        return {
            observations: n,
            mean, variance,
            min: Math.min(...data),
            max: Math.max(...data),
            firstDifferenceMean: diffs.reduce((a, b) => a + b, 0) / diffs.length,
            firstDifferenceVariance: diffs.reduce((sum, x) => 
                sum + Math.pow(x - diffs.reduce((a, b) => a + b, 0) / diffs.length, 2), 0
            ) / diffs.length
        };
    }

    detectTrend(data) {
        const n = data.length;
        const x = Array.from({length: n}, (_, i) => i);
        const y = data;
        
        // Linear trend
        const regression = this.performLinearRegression(x, y);
        
        // Mann-Kendall test for trend
        let S = 0;
        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                S += Math.sign(data[j] - data[i]);
            }
        }
        
        const varS = n * (n - 1) * (2 * n + 5) / 18;
        const Z = S > 0 ? (S - 1) / Math.sqrt(varS) : 
                  S < 0 ? (S + 1) / Math.sqrt(varS) : 0;
        const pValue = 2 * (1 - StatisticalDistributions.normalCDF(Math.abs(Z), 0, 1));
        
        return {
            linearTrend: {
                slope: regression.coefficients.slope.value,
                pValue: regression.coefficients.slope.pValue,
                interpretation: regression.coefficients.slope.pValue < 0.05 ?
                    (regression.coefficients.slope.value > 0 ? 'Significant upward trend' : 'Significant downward trend') :
                    'No significant linear trend'
            },
            mannKendall: {
                statistic: S,
                zScore: Z,
                pValue: pValue,
                interpretation: pValue < 0.05 ?
                    (S > 0 ? 'Significant upward trend' : 'Significant downward trend') :
                    'No significant monotonic trend'
            }
        };
    }

    detectSeasonality(data, period) {
        // Simple seasonal decomposition
        const n = data.length;
        if (n < 2 * period) {
            return { note: 'Insufficient data for seasonal analysis' };
        }
        
        // Calculate seasonal indices
        const seasonalIndices = Array(period).fill(0);
        const counts = Array(period).fill(0);
        
        for (let i = 0; i < n; i++) {
            const seasonIdx = i % period;
            seasonalIndices[seasonIdx] += data[i];
            counts[seasonIdx]++;
        }
        
        for (let i = 0; i < period; i++) {
            seasonalIndices[i] /= counts[i];
        }
        
        const meanValue = seasonalIndices.reduce((a, b) => a + b, 0) / period;
        const normalizedIndices = seasonalIndices.map(idx => idx / meanValue);
        
        // Test for seasonality
        const seasonalVariance = normalizedIndices.reduce((sum, idx) => 
            sum + Math.pow(idx - 1, 2), 0
        ) / period;
        
        return {
            period: period,
            seasonalIndices: normalizedIndices,
            seasonalVariance: seasonalVariance,
            hasSeasonality: seasonalVariance > 0.01,
            interpretation: seasonalVariance > 0.1 ? 'Strong seasonality' :
                           seasonalVariance > 0.01 ? 'Moderate seasonality' :
                           'Weak or no seasonality'
        };
    }

    calculateACF(data, maxLag) {
        const n = data.length;
        const mean = data.reduce((a, b) => a + b, 0) / n;
        
        const acf = [];
        const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n;
        
        for (let lag = 0; lag <= maxLag; lag++) {
            let sum = 0;
            for (let i = 0; i < n - lag; i++) {
                sum += (data[i] - mean) * (data[i + lag] - mean);
            }
            acf.push(sum / (n * variance));
        }
        
        // Confidence bounds
        const confidenceBound = 1.96 / Math.sqrt(n);
        
        return {
            values: acf,
            lags: Array.from({length: maxLag + 1}, (_, i) => i),
            confidenceBound: confidenceBound,
            significantLags: acf.map((val, lag) => ({
                lag, value: val,
                significant: lag > 0 && Math.abs(val) > confidenceBound
            })).filter(item => item.significant)
        };
    }

    calculatePACF(data, maxLag) {
        const n = data.length;
        const acf = this.calculateACF(data, maxLag).values;
        
        const pacf = [1]; // PACF at lag 0 is always 1
        
        for (let k = 1; k <= maxLag; k++) {
            // Durbin-Levinson recursion
            let numerator = acf[k];
            let denominator = 1;
            
            if (k > 1) {
                for (let j = 1; j < k; j++) {
                    numerator -= pacf[j] * acf[k - j];
                }
                
                for (let j = 1; j < k; j++) {
                    denominator -= pacf[j] * acf[j];
                }
            }
            
            pacf.push(numerator / denominator);
        }
        
        const confidenceBound = 1.96 / Math.sqrt(n);
        
        return {
            values: pacf,
            lags: Array.from({length: maxLag + 1}, (_, i) => i),
            confidenceBound: confidenceBound,
            significantLags: pacf.map((val, lag) => ({
                lag, value: val,
                significant: lag > 0 && Math.abs(val) > confidenceBound
            })).filter(item => item.significant)
        };
    }

    testStationarity(data) {
        // Augmented Dickey-Fuller test (simplified)
        const n = data.length;
        const diffs = [];
        for (let i = 1; i < n; i++) {
            diffs.push(data[i] - data[i-1]);
        }
        
        const lagged = data.slice(0, -1);
        
        // Simple regression: Δy_t = α + βy_{t-1} + ε_t
        const regression = this.performLinearRegression(lagged, diffs);
        const beta = regression.coefficients.slope.value;
        const tStat = regression.coefficients.slope.tStat;
        
        // Critical values (approximate)
        const criticalValues = {
            '0.01': -3.43,
            '0.05': -2.86,
            '0.10': -2.57
        };
        
        const isStationary = tStat < criticalValues['0.05'];
        
        return {
            test: 'Augmented Dickey-Fuller',
            testStatistic: tStat,
            criticalValues: criticalValues,
            isStationary: isStationary,
            pValue: regression.coefficients.slope.pValue,
            recommendation: isStationary ? 
                'Series appears stationary' : 
                'Series appears non-stationary - consider differencing',
            unitRoot: !isStationary
        };
    }

    decomposeTimeSeries(data, period) {
        const n = data.length;
        
        if (n < 2 * period) {
            return { note: 'Insufficient data for decomposition' };
        }
        
        // Moving average for trend
        const trend = [];
        const halfPeriod = Math.floor(period / 2);
        
        for (let i = 0; i < n; i++) {
            if (i < halfPeriod || i >= n - halfPeriod) {
                trend.push(null);
            } else {
                let sum = 0;
                for (let j = i - halfPeriod; j <= i + halfPeriod; j++) {
                    sum += data[j];
                }
                trend.push(sum / period);
            }
        }
        
        // Detrended series
        const detrended = data.map((val, i) => 
            trend[i] !== null ? val - trend[i] : null
        );
        
        // Seasonal component
        const seasonal = Array(n).fill(null);
        const seasonalAvg = Array(period).fill(0);
        const seasonalCount = Array(period).fill(0);
        
        for (let i = 0; i < n; i++) {
            if (detrended[i] !== null) {
                const seasonIdx = i % period;
                seasonalAvg[seasonIdx] += detrended[i];
                seasonalCount[seasonIdx]++;
            }
        }
        
        for (let i = 0; i < period; i++) {
            if (seasonalCount[i] > 0) {
                seasonalAvg[i] /= seasonalCount[i];
            }
        }
        
        for (let i = 0; i < n; i++) {
            seasonal[i] = seasonalAvg[i % period];
        }
        
        // Residual (irregular) component
        const residual = data.map((val, i) => 
            trend[i] !== null ? val - trend[i] - seasonal[i] : null
        );
        
        return {
            original: data,
            trend: trend,
            seasonal: seasonal,
            residual: residual,
            seasonalPeriod: period
        };
    }

    fitARIMA(data, order) {
        const [p, d, q] = order;
        
        // Apply differencing
        let workingData = [...data];
        for (let i = 0; i < d; i++) {
            const diffed = [];
            for (let j = 1; j < workingData.length; j++) {
                diffed.push(workingData[j] - workingData[j-1]);
            }
            workingData = diffed;
        }
        
        // Simplified ARIMA estimation (Yule-Walker for AR, approximation for MA)
        const n = workingData.length;
        const mean = workingData.reduce((a, b) => a + b, 0) / n;
        const centered = workingData.map(x => x - mean);
        
        // AR parameters using Yule-Walker
        const acf = this.calculateACF(centered, Math.max(p, q)).values;
        const arParams = [];
        
        if (p > 0) {
            // Yule-Walker equations (simplified)
            for (let i = 0; i < p; i++) {
                arParams.push(acf[i + 1] / acf[0]);
            }
        }
        
        // MA parameters (simplified)
        const maParams = [];
        if (q > 0) {
            for (let i = 0; i < q; i++) {
                maParams.push(-acf[i + 1] * 0.5); // Approximation
            }
        }
        
        // Calculate fitted values and residuals
        const fitted = [];
        const residuals = [];
        
        for (let t = Math.max(p, q); t < n; t++) {
            let prediction = mean;
            
            // AR component
            for (let i = 0; i < p; i++) {
                prediction += arParams[i] * (workingData[t - i - 1] - mean);
            }
            
            fitted.push(prediction);
            residuals.push(workingData[t] - prediction);
        }
        
        // Model diagnostics
        const mse = residuals.reduce((sum, r) => sum + r * r, 0) / residuals.length;
        const aic = n * Math.log(mse) + 2 * (p + q + 1);
        const bic = n * Math.log(mse) + (p + q + 1) * Math.log(n);
        
        return {
            order: { p, d, q },
            parameters: {
                ar: arParams,
                ma: maParams,
                mean: mean
            },
            fitted: fitted,
            residuals: residuals,
            diagnostics: {
                AIC: aic,
                BIC: bic,
                RMSE: Math.sqrt(mse),
                residualACF: this.calculateACF(residuals, Math.min(10, Math.floor(residuals.length / 4)))
            },
            interpretation: this.interpretARIMA(p, d, q, arParams, maParams)
        };
    }

    interpretARIMA(p, d, q, arParams, maParams) {
        const interpretations = [];
        
        if (d > 0) {
            interpretations.push(`Series differenced ${d} time(s) to achieve stationarity`);
        }
        
        if (p > 0) {
            interpretations.push(`AR(${p}): Current value depends on previous ${p} value(s)`);
            if (arParams[0] > 0.5) {
                interpretations.push('Strong positive autocorrelation');
            } else if (arParams[0] < -0.5) {
                interpretations.push('Strong negative autocorrelation');
            }
        }
        
        if (q > 0) {
            interpretations.push(`MA(${q}): Model includes ${q} lagged forecast error(s)`);
        }
        
        return interpretations.join('. ');
    }

    forecastTimeSeries(data, horizon) {
        // Simple exponential smoothing forecast
        const alpha = 0.3; // Smoothing parameter
        const n = data.length;
        
        // Calculate level
        let level = data[0];
        const smoothed = [level];
        
        for (let i = 1; i < n; i++) {
            level = alpha * data[i] + (1 - alpha) * level;
            smoothed.push(level);
        }
        
        // Forecast
        const forecast = Array(horizon).fill(level);
        
        // Prediction intervals (simplified)
        const residuals = data.slice(1).map((val, i) => val - smoothed[i]);
        const mse = residuals.reduce((sum, r) => sum + r * r, 0) / residuals.length;
        const stdError = Math.sqrt(mse);
        
        const forecastIntervals = forecast.map((f, h) => {
            const se = stdError * Math.sqrt(1 + alpha * h);
            return {
                point: f,
                lower80: f - 1.28 * se,
                upper80: f + 1.28 * se,
                lower95: f - 1.96 * se,
                upper95: f + 1.96 * se
            };
        });
        
        return {
            method: 'Simple Exponential Smoothing',
            horizon: horizon,
            forecast: forecastIntervals,
            lastObserved: data[n - 1],
            smoothingParameter: alpha
        };
    }

    // ========================================================================
    // ADVANCED REGRESSION MODELS
    // ========================================================================

    performProbitRegression(X, y) {
        // Probit regression using Newton-Raphson
        const n = X.length;
        const k = X[0].length;
        
        // Add intercept
        const X_design = X.map(row => [1, ...row]);
        
        // Initialize coefficients
        let beta = Array(k + 1).fill(0);
        const maxIter = 100;
        const tolerance = 1e-6;

        for (let iter = 0; iter < maxIter; iter++) {
            // Calculate linear predictions
            const eta = X_design.map(row => 
                row.reduce((sum, xi, i) => sum + xi * beta[i], 0)
            );
            
            // Calculate probabilities using standard normal CDF
            const p = eta.map(e => StatisticalDistributions.normalCDF(e, 0, 1));
            
            // Calculate PDF values
            const phi = eta.map(e => StatisticalDistributions.normalPDF(e, 0, 1));
            
            // Calculate gradient
            const gradient = Array(k + 1).fill(0);
            for (let j = 0; j < k + 1; j++) {
                for (let i = 0; i < n; i++) {
                    const yi = y[i];
                    const pi = p[i];
                    const phii = phi[i];
                    
                    if (yi === 1) {
                        gradient[j] += X_design[i][j] * phii / (pi + 1e-10);
                    } else {
                        gradient[j] -= X_design[i][j] * phii / (1 - pi + 1e-10);
                    }
                }
            }
            
            // Calculate Hessian (approximation)
            const hessian = [];
            for (let j = 0; j < k + 1; j++) {
                hessian[j] = [];
                for (let l = 0; l < k + 1; l++) {
                    let sum = 0;
                    for (let i = 0; i < n; i++) {
                        const pi = p[i];
                        const phii = phi[i];
                        const wi = phii * phii / (pi * (1 - pi) + 1e-10);
                        sum -= X_design[i][j] * X_design[i][l] * wi;
                    }
                    hessian[j][l] = sum;
                }
            }
            
            try {
                const hessianInv = MatrixOperations.inverse(hessian);
                const delta = MatrixOperations.multiply(
                    hessianInv, 
                    gradient.map(g => [g])
                ).map(row => row[0]);
                
                // Update coefficients
                beta = beta.map((b, i) => b + delta[i]);
                
                // Check convergence
                const maxDelta = Math.max(...delta.map(Math.abs));
                if (maxDelta < tolerance) break;
            } catch (e) {
                console.warn('Probit regression convergence issue:', e.message);
                break;
            }
        }

        // Calculate final predictions
        const predictions = X_design.map(row => {
            const eta = row.reduce((sum, xi, i) => sum + xi * beta[i], 0);
            return StatisticalDistributions.normalCDF(eta, 0, 1);
        });

        // Log-likelihood
        const logLikelihood = y.reduce((sum, yi, i) => {
            const pi = predictions[i];
            return sum + yi * Math.log(pi + 1e-10) + (1 - yi) * Math.log(1 - pi + 1e-10);
        }, 0);

        // Pseudo R-squared
        const nullLogLikelihood = y.reduce((sum, yi) => {
            const p0 = y.reduce((a, b) => a + b) / n;
            return sum + yi * Math.log(p0 + 1e-10) + (1 - yi) * Math.log(1 - p0 + 1e-10);
        }, 0);
        const pseudoRSquared = 1 - logLikelihood / nullLogLikelihood;

        return {
            type: 'Probit Regression',
            coefficients: beta.map((value, i) => ({
                name: i === 0 ? 'Intercept' : `X${i}`,
                value,
                interpretation: i > 0 ? 
                    `One unit increase in X${i} changes z-score by ${value.toFixed(4)}` : 
                    'Baseline z-score'
            })),
            modelFit: {
                logLikelihood,
                nullLogLikelihood,
                pseudoRSquared,
                AIC: 2 * (k + 1) - 2 * logLikelihood,
                BIC: (k + 1) * Math.log(n) - 2 * logLikelihood
            },
            predictions,
            classificationMatrix: this.calculateClassificationMatrix(y, predictions, 0.5),
            marginalEffects: this.calculateProbitMarginalEffects(X_design, beta)
        };
    }

    calculateProbitMarginalEffects(X_design, beta) {
        // Average marginal effects
        const n = X_design.length;
        const k = beta.length;
        
        const marginalEffects = Array(k).fill(0);
        
        for (let i = 0; i < n; i++) {
            const eta = X_design[i].reduce((sum, xi, j) => sum + xi * beta[j], 0);
            const phi = StatisticalDistributions.normalPDF(eta, 0, 1);
            
            for (let j = 0; j < k; j++) {
                marginalEffects[j] += phi * beta[j];
            }
        }
        
        return marginalEffects.map((me, i) => ({
            variable: i === 0 ? 'Intercept' : `X${i}`,
            averageMarginalEffect: me / n,
            interpretation: i > 0 ? 
                `One unit increase changes probability by ${(me/n*100).toFixed(2)}%` : 
                'N/A'
        }));
    }

performPoissonRegression(X, y) {
    // Poisson regression using iteratively reweighted least squares (IRLS)
    const n = X.length;
    const k = X[0].length;
    
    // Add intercept
    const X_design = X.map(row => [1, ...row]);
    
    // Initialize coefficients
    let beta = Array(k + 1).fill(0);
    const maxIter = 100;
    const tolerance = 1e-6;

    for (let iter = 0; iter < maxIter; iter++) {
        // Calculate linear predictor
        const eta = X_design.map(row => 
            row.reduce((sum, xi, i) => sum + xi * beta[i], 0)
        );
        
        // Calculate means (mu = exp(eta))
        const mu = eta.map(e => Math.exp(Math.min(20, e))); // Prevent overflow
        
        // Calculate working responses
        const z = eta.map((e, i) => e + (y[i] - mu[i]) / (mu[i] + 1e-10));
        
        // Calculate weights
        const w = mu.map(m => m + 1e-10);
        
        // Weighted least squares
        const WX = X_design.map((row, i) => row.map(x => x * Math.sqrt(w[i])));
        const Wz = z.map((zi, i) => zi * Math.sqrt(w[i]));
        
        try {
            const X_tWX = MatrixOperations.multiply(
                MatrixOperations.transpose(WX),
                WX
            );
            const X_tWX_inv = MatrixOperations.inverse(X_tWX);
            const X_tWz = MatrixOperations.multiply(
                MatrixOperations.transpose(WX),
                Wz.map(v => [v])
            );
            
            const newBeta = MatrixOperations.multiply(X_tWX_inv, X_tWz).map(row => row[0]);
            
            // Check convergence
            const maxDelta = Math.max(...newBeta.map((b, i) => Math.abs(b - beta[i])));
            beta = newBeta;
            
            if (maxDelta < tolerance) break;
        } catch (e) {
            console.warn('Poisson regression convergence issue:', e.message);
            break;
        }
    }

    // Calculate final predictions
    const predictions = X_design.map(row => {
        const eta = row.reduce((sum, xi, i) => sum + xi * beta[i], 0);
        return Math.exp(Math.min(20, eta));
    });

    // Log-likelihood for Poisson
    const logLikelihood = y.reduce((sum, yi, i) => {
        const mui = predictions[i];
        return sum + yi * Math.log(mui + 1e-10) - mui - this.logFactorial(yi);
    }, 0);

    // Null model (intercept only)
    const yMean = y.reduce((a, b) => a + b) / n;
    const nullLogLikelihood = y.reduce((sum, yi) => {
        return sum + yi * Math.log(yMean + 1e-10) - yMean - this.logFactorial(yi);
    }, 0);

    const pseudoRSquared = 1 - logLikelihood / nullLogLikelihood;

    // Deviance
    const deviance = y.reduce((sum, yi, i) => {
        const mui = predictions[i];
        if (yi === 0) return sum + 2 * mui;
        return sum + 2 * (yi * Math.log(yi / (mui + 1e-10)) - (yi - mui));
    }, 0);

    return {
        type: 'Poisson Regression',
        coefficients: beta.map((value, i) => ({
            name: i === 0 ? 'Intercept' : `X${i}`,
            value,
            rateRatio: Math.exp(value),
            interpretation: i > 0 ? 
                `One unit increase in X${i} multiplies rate by ${Math.exp(value).toFixed(3)}` : 
                'Baseline log-rate'
        })),
        modelFit: {
            logLikelihood,
            nullLogLikelihood,
            pseudoRSquared,
            deviance,
            AIC: 2 * (k + 1) - 2 * logLikelihood,
            BIC: (k + 1) * Math.log(n) - 2 * logLikelihood
        },
        predictions,
        overdispersion: this.testOverdispersion(y, predictions, k + 1),
        residuals: y.map((yi, i) => yi - predictions[i])
    };
}

logFactorial(n) {
    if (n <= 1) return 0;
    let sum = 0;
    for (let i = 2; i <= n; i++) {
        sum += Math.log(i);
    }
    return sum;
}

testOverdispersion(observed, fitted, p) {
    // Deviance-based test for overdispersion
    const n = observed.length;
    const pearsonResiduals = observed.map((yi, i) => 
        (yi - fitted[i]) / Math.sqrt(fitted[i] + 1e-10)
    );
    
    const pearsonChi2 = pearsonResiduals.reduce((sum, r) => sum + r * r, 0);
    const dispersionParameter = pearsonChi2 / (n - p);
    
    return {
        pearsonChi2,
        degreesOfFreedom: n - p,
        dispersionParameter,
        interpretation: dispersionParameter > 1.5 ? 
            'Overdispersion detected - consider Negative Binomial model' :
            dispersionParameter < 0.7 ?
            'Underdispersion detected' :
            'Dispersion appears adequate'
    };
}  


generateEDAReport() {
    return {
        outlierAnalysis: this.robustStatistics.outlierDetection,
        dataQuality: this.validationResults.dataQuality,
        visualInspection: {
            histogram: this.generateHistogramData(),
            boxplot: this.generateBoxplotData(),
            qqplot: this.generateQQPlotData()
        },
        summaryStatistics: this.statistics,
        recommendations: this.generateEDARecommendations()
    };
}

// Step 5: Transformation suggestions
suggestTransformations() {
    const transformations = [];
    
    if (this.statistics.skewness > 1) {
        transformations.push({
            type: 'log',
            reason: 'High positive skewness detected',
            formula: 'log(x)',
            expectedImprovement: 'Reduces right skewness'
        });
    }
    
    if (this.rawSamples.some(x => x < 0)) {
        transformations.push({
            type: 'yeo-johnson',
            reason: 'Data contains negative values',
            formula: 'Yeo-Johnson power transform',
            expectedImprovement: 'Handles negative values and normalizes'
        });
    }
    
    return transformations;
}

// Step 10: Survey-weighted estimation
calculateWeightedEstimates(weights) {
    if (!weights || weights.length !== this.rawSamples.length) {
        throw new Error('Weights must match sample size');
    }
    
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const weightedMean = this.rawSamples.reduce((sum, val, i) => 
        sum + val * weights[i], 0) / totalWeight;
    
    const weightedVariance = this.rawSamples.reduce((sum, val, i) => 
        sum + weights[i] * Math.pow(val - weightedMean, 2), 0) / totalWeight;
    
    return {
        weightedMean,
        weightedVariance,
        effectiveSampleSize: Math.pow(totalWeight, 2) / weights.reduce((sum, w) => sum + w * w, 0)
    };
}

// Step 14: Enhanced recommendations with effect sizes
calculateEffectSizes(comparison) {
    const cohensD = (this.statistics.mean - comparison.mean) / 
        Math.sqrt((this.statistics.variance + comparison.variance) / 2);
    
    return {
        cohensD,
        interpretation: Math.abs(cohensD) < 0.2 ? 'Negligible' :
                       Math.abs(cohensD) < 0.5 ? 'Small' :
                       Math.abs(cohensD) < 0.8 ? 'Medium' : 'Large',
        confidence: this.calculateEffectSizeCI(cohensD)
    };
}

// Multiple comparison adjustment
adjustPValues(pValues, method = 'bonferroni') {
    const m = pValues.length;
    
    switch(method) {
        case 'bonferroni':
            return pValues.map(p => Math.min(1, p * m));
        case 'holm':
            const sorted = [...pValues].sort((a, b) => a - b);
            return pValues.map(p => {
                const rank = sorted.indexOf(p) + 1;
                return Math.min(1, p * (m - rank + 1));
            });
        case 'fdr':
            const sortedIndices = pValues
                .map((p, i) => ({p, i}))
                .sort((a, b) => a.p - b.p);
            const adjusted = sortedIndices.map((item, rank) => 
                Math.min(1, item.p * m / (rank + 1))
            );
            return pValues.map((_, i) => 
                adjusted[sortedIndices.findIndex(item => item.i === i)]
            );
        default:
            return pValues;
    }
}



    fitDistribution() {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        if (!dist) {
            throw new Error(`Unknown distribution: ${this.selectedDistribution}`);
        }

        // Estimate parameters if not provided
        if (!this.distributionParams && dist.estimateParams) {
            this.distributionParams = dist.estimateParams(this.rawSamples);
        } else if (!this.distributionParams) {
            this.distributionParams = dist.defaultParams;
        }

        // Calculate distribution statistics
        const distributionStats = {
            name: dist.name,
            parameters: {},
            theoreticalMoments: this.calculateTheoreticalMoments()
        };

        // Map parameters to names
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
        // This would be distribution-specific
        // For now, return basic structure
        return {
            mean: null,
            variance: null,
            skewness: null,
            kurtosis: null
        };
    }

    calculateLogLikelihood() {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        let logLikelihood = 0;

        this.rawSamples.forEach(x => {
            const pdf = dist.pdf(x, this.distributionParams);
            if (pdf > 0) {
                logLikelihood += Math.log(pdf);
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
        andersonDarling: this.andersonDarlingTest(),
        chisquareTest: this.chiSquareGoodnessOfFit()
    };
    
    // Only add Shapiro-Wilk for normal distribution
    if (this.selectedDistribution === 'normal') {
        this.goodnessOfFit.shapiroWilk = this.shapiroWilkTest();
    } else {
        this.goodnessOfFit.shapiroWilk = {
            note: `Shapiro-Wilk test not applicable to ${DistributionRegistry.getDistribution(this.selectedDistribution).name}`,
            testStatistic: null,
            pValue: null,
            reject: null
        };
    }
}

    // FIXED: Shapiro-Wilk test - add validation
shapiroWilkTest() {
    // Only apply to normal distribution
    if (this.selectedDistribution !== 'normal') {
        return { 
            note: 'Shapiro-Wilk test only implemented for normal distribution',
            testStatistic: null,
            pValue: null,
            reject: null
        };
    }

    const n = this.rawSamples.length;
    if (n < 3 || n > 5000) {
        return { 
            error: 'Sample size must be between 3 and 5000 for Shapiro-Wilk test',
            testStatistic: null,
            pValue: null,
            reject: null
        };
    }

    try {
        const sorted = [...this.rawSamples].sort((a, b) => a - b);
        const mean = this.statistics.mean;
        const ss = this.rawSamples.reduce((acc, x) => acc + (x - mean) ** 2, 0);

        if (ss === 0) {
            return {
                note: 'All values are identical - cannot perform Shapiro-Wilk test',
                testStatistic: null,
                pValue: null,
                reject: null
            };
        }

        // Coefficients for W (approximate; for exact, use tables)
        const a = new Array(n);
        const m = new Array(n);
        for (let i = 0; i < n; i++) {
            m[i] = StatisticalDistributions.normalInverse((i + 1 - 0.375) / (n + 0.25), 0, 1);
        }
        const mm = m.reduce((acc, val) => acc + val ** 2, 0);
        
        if (mm === 0) {
            return {
                error: 'Cannot compute Shapiro-Wilk coefficients',
                testStatistic: null,
                pValue: null,
                reject: null
            };
        }
        
        for (let i = 0; i < n; i++) {
            a[i] = m[i] / Math.sqrt(mm);
        }

        let b = 0;
        for (let i = 0; i < n; i++) {
            b += a[i] * sorted[i];
        }

        const w = (b ** 2) / ss;

        // Approximate p-value (for n <= 50)
        const mu = 0.0038915 * Math.log(n) ** 3 - 0.083751 * Math.log(n) ** 2 - 0.31082 * Math.log(n) - 1.5861;
        const sigma = Math.exp(0.0030302 * Math.log(n) ** 2 - 0.082676 * Math.log(n) - 0.4803);
        const z = (Math.log(Math.max(1e-10, 1 - w)) - mu) / sigma;
        const pValue = Math.max(0, Math.min(1, 1 - StatisticalDistributions.normalCDF(z, 0, 1)));

        return {
            testStatistic: w,
            pValue,
            reject: {
                '0.05': pValue < 0.05,
                '0.01': pValue < 0.01,
                '0.001': pValue < 0.001
            }
        };
    } catch (error) {
        return {
            error: 'Error computing Shapiro-Wilk test: ' + error.message,
            testStatistic: null,
            pValue: null,
            reject: null
        };
    }
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

        // Critical values for common significance levels
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
        // Approximation for KS p-value
        const lambda = (Math.sqrt(n) + 0.12 + 0.11/Math.sqrt(n)) * d;
        let sum = 0;
        for (let i = 1; i <= 100; i++) {
            sum += Math.pow(-1, i-1) * Math.exp(-2 * i * i * lambda * lambda);
        }
        return 2 * sum;
    }

    andersonDarlingTest() {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        const sortedData = [...this.rawSamples].sort((a, b) => a - b);
        const n = sortedData.length;
        let sum = 0;

        for (let i = 0; i < n; i++) {
            const cdfValue = dist.cdf(sortedData[i], this.distributionParams);
            const cdfComplement = 1 - dist.cdf(sortedData[n - i - 1], this.distributionParams);

            if (cdfValue > 0 && cdfValue < 1 && cdfComplement > 0 && cdfComplement < 1) {
                sum += (2 * i + 1) * (Math.log(cdfValue) + Math.log(cdfComplement));
            }
        }

        const testStatistic = -n - (1/n) * sum;

        // Critical values vary by distribution
        const criticalValues = {
            0.05: 2.492,
            0.01: 3.857,
            0.001: 6.000
        };

        return {
            testStatistic,
            criticalValues,
            reject: {
                '0.05': testStatistic > criticalValues[0.05],
                '0.01': testStatistic > criticalValues[0.01],
                '0.001': testStatistic > criticalValues[0.001]
            }
        };
    }

    chiSquareGoodnessOfFit() {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        const n = this.rawSamples.length;
        const k = Math.min(10, Math.max(5, Math.ceil(Math.sqrt(n)))); // Number of bins

        const min = Math.min(...this.rawSamples);
        const max = Math.max(...this.rawSamples);
        const binWidth = (max - min) / k;

        const observed = new Array(k).fill(0);
        const expected = new Array(k).fill(0);

        // Count observed frequencies
        this.rawSamples.forEach(x => {
            const bin = Math.min(k - 1, Math.floor((x - min) / binWidth));
            observed[bin]++;
        });

        // Calculate expected frequencies
        for (let i = 0; i < k; i++) {
            const binStart = min + i * binWidth;
            const binEnd = min + (i + 1) * binWidth;
            const probStart = dist.cdf(binStart, this.distributionParams);
            const probEnd = dist.cdf(binEnd, this.distributionParams);
            expected[i] = n * (probEnd - probStart);
        }

        // Calculate chi-square statistic
        let chiSquare = 0;
        for (let i = 0; i < k; i++) {
            if (expected[i] > 0) {
                chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
            }
        }

        const df = k - 1 - this.distributionParams.length;
        const pValue = 1 - StatisticalDistributions.chiSquareCDF(chiSquare, df);

        return {
            testStatistic: chiSquare,
            degreesOfFreedom: df,
            pValue,
            observed,
            expected,
            bins: k,
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
            case 'oneSample':
                this.hypothesisTests.oneSample = this.oneSampleTest(testConfig);
                break;
            case 'twoSample':
                this.hypothesisTests.twoSample = this.twoSampleTest(testConfig);
                break;
            case 'paired':
                this.hypothesisTests.paired = this.pairedTest(testConfig);
                break;
            case 'proportion':
                this.hypothesisTests.proportion = this.proportionTest(testConfig);
                break;
            case 'variance':
                this.hypothesisTests.variance = this.varianceTest(testConfig);
                break;
            case 'gamma':
                this.hypothesisTests.gamma = this.performGammaHypothesisTest(testConfig);
                break;
            case 'chisquare':
                this.hypothesisTests.chisquare = this.performChiSquareHypothesisTest(testConfig);
                break;
            case 'f':
                this.hypothesisTests.f = this.performFHypothesisTest(testConfig);
                break;
            case 'exponential':
                this.hypothesisTests.exponential = this.performExponentialHypothesisTest(testConfig);
                break;
            case 'normal':
                this.hypothesisTests.normal = this.performNormalHypothesisTest(testConfig);
                break;
            case 't':
                this.hypothesisTests.t = this.performTHypothesisTest(testConfig);
                break;
            case 'beta':
                this.hypothesisTests.beta = this.performBetaHypothesisTest(testConfig);
                break;
            case 'lognormal':
                this.hypothesisTests.lognormal = this.performLogNormalHypothesisTest(testConfig);
                break;
            case 'pareto':
                this.hypothesisTests.pareto = this.performParetoHypothesisTest(testConfig);
                break;
            case 'binomial':
                this.hypothesisTests.binomial = this.performBinomialHypothesisTest(testConfig);
                break;
            case 'bernoulli':
                this.hypothesisTests.bernoulli = this.performBernoulliHypothesisTest(testConfig);
                break;
            case 'poisson':
                this.hypothesisTests.poisson = this.performPoissonHypothesisTest(testConfig);
                break;
            case 'geometric':
                this.hypothesisTests.geometric = this.performGeometricHypothesisTest(testConfig);
                break;
            case 'uniform':
                this.hypothesisTests.uniform = this.performUniformHypothesisTest(testConfig);
                break;
            default:
                throw new Error(`Unknown test type: ${testType}`);
        }
    }

    oneSampleTest(config) {
        const { nullValue, alternative = 'two-sided', alpha = 0.05 } = config;
        const n = this.statistics.n;
        const mean = this.statistics.mean;
        const std = this.statistics.standardDeviation;

        const standardError = std / Math.sqrt(n);
        const testStatistic = (mean - nullValue) / standardError;

        // Use t-distribution for small samples or unknown population variance
        let pValue;
        let criticalValue;

        if (n >= 30) {
            // Use normal distribution
            if (alternative === 'two-sided') {
                pValue = 2 * (1 - StatisticalDistributions.normalCDF(Math.abs(testStatistic)));
                criticalValue = StatisticalDistributions.normalInverse(1 - alpha/2);
            } else if (alternative === 'greater') {
                pValue = 1 - StatisticalDistributions.normalCDF(testStatistic);
                criticalValue = StatisticalDistributions.normalInverse(1 - alpha);
            } else {
                pValue = StatisticalDistributions.normalCDF(testStatistic);
                criticalValue = StatisticalDistributions.normalInverse(alpha);
            }
        } else {
            // Use t-distribution
            const df = n - 1;
            if (alternative === 'two-sided') {
                pValue = 2 * (1 - StatisticalDistributions.tCDF(Math.abs(testStatistic), df));
                criticalValue = StatisticalDistributions.tInverse(1 - alpha/2, df);
            } else if (alternative === 'greater') {
                pValue = 1 - StatisticalDistributions.tCDF(testStatistic, df);
                criticalValue = StatisticalDistributions.tInverse(1 - alpha, df);
            } else {
                pValue = StatisticalDistributions.tCDF(testStatistic, df);
                criticalValue = StatisticalDistributions.tInverse(alpha, df);
            }
        }

        return {
            testType: 'One Sample Test',
            nullHypothesis: `μ = ${nullValue}`,
            alternative,
            testStatistic,
            pValue,
            criticalValue,
            standardError,
            confidenceInterval: this.calculateMeanConfidenceInterval(1 - alpha),
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis'
        };
    }

    twoSampleTest(config) {
        const { sample2, equalVariance = true, alternative = 'two-sided', alpha = 0.05 } = config;

        // Calculate statistics for second sample
        const n1 = this.statistics.n;
        const mean1 = this.statistics.mean;
        const var1 = this.statistics.variance;

        const n2 = sample2.length;
        const mean2 = sample2.reduce((a, b) => a + b) / n2;
        const var2 = sample2.reduce((acc, val) => acc + Math.pow(val - mean2, 2), 0) / (n2 - 1);

        let testStatistic, df, standardError;

        if (equalVariance) {
            // Pooled variance t-test
            const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
            standardError = Math.sqrt(pooledVar * (1/n1 + 1/n2));
            testStatistic = (mean1 - mean2) / standardError;
            df = n1 + n2 - 2;
        } else {
            // Welch's t-test
            standardError = Math.sqrt(var1/n1 + var2/n2);
            testStatistic = (mean1 - mean2) / standardError;
            df = Math.pow(var1/n1 + var2/n2, 2) / (Math.pow(var1/n1, 2)/(n1-1) + Math.pow(var2/n2, 2)/(n2-1));
        }

        let pValue;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - StatisticalDistributions.tCDF(Math.abs(testStatistic), df));
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.tCDF(testStatistic, df);
        } else {
            pValue = StatisticalDistributions.tCDF(testStatistic, df);
        }

        return {
            testType: 'Two Sample Test',
            nullHypothesis: 'μ1 = μ2',
            alternative,
            testStatistic,
            pValue,
            degreesOfFreedom: df,
            standardError,
            sample1Stats: { n: n1, mean: mean1, variance: var1 },
            sample2Stats: { n: n2, mean: mean2, variance: var2 },
            equalVariance,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis'
        };
    }

    pairedTest(config) {
        const { sample2, alternative = 'two-sided', alpha = 0.05 } = config;

        if (this.rawSamples.length !== sample2.length) {
            throw new Error('Paired samples must have equal length');
        }

        const differences = this.rawSamples.map((x, i) => x - sample2[i]);
        const n = differences.length;
        const meanDiff = differences.reduce((a, b) => a + b) / n;
        const varDiff = differences.reduce((acc, val) => acc + Math.pow(val - meanDiff, 2), 0) / (n - 1);
        const stdDiff = Math.sqrt(varDiff);

        const standardError = stdDiff / Math.sqrt(n);
        const testStatistic = meanDiff / standardError;
        const df = n - 1;

        let pValue;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - StatisticalDistributions.tCDF(Math.abs(testStatistic), df));
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.tCDF(testStatistic, df);
        } else {
            pValue = StatisticalDistributions.tCDF(testStatistic, df);
        }

        return {
            testType: 'Paired Sample Test',
            nullHypothesis: 'μd = 0',
            alternative,
            testStatistic,
            pValue,
            degreesOfFreedom: df,
            meanDifference: meanDiff,
            standardError,
            differences: differences.slice(0, 10), // Show first 10 differences
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis'
        };
    }

    proportionTest(config) {
        const { nullProportion, alternative = 'two-sided', alpha = 0.05 } = config;
        const n = this.rawSamples.length;
        const successes = this.rawSamples.filter(x => x === 1).length;
        const sampleProportion = successes / n;

        const standardError = Math.sqrt(nullProportion * (1 - nullProportion) / n);
        const testStatistic = (sampleProportion - nullProportion) / standardError;

        let pValue;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - StatisticalDistributions.normalCDF(Math.abs(testStatistic)));
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.normalCDF(testStatistic);
        } else {
            pValue = StatisticalDistributions.normalCDF(testStatistic);
        }

        return {
            testType: 'Proportion Test',
            nullHypothesis: `p = ${nullProportion}`,
            alternative,
            testStatistic,
            pValue,
            sampleProportion,
            standardError,
            successes,
            sampleSize: n,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis'
        };
    }

    varianceTest(config) {
        const { nullVariance, alternative = 'two-sided', alpha = 0.05 } = config;
        const n = this.statistics.n;
        const sampleVariance = this.statistics.variance;

        const testStatistic = (n - 1) * sampleVariance / nullVariance;
        const df = n - 1;

        let pValue;
        if (alternative === 'two-sided') {
            const lower = StatisticalDistributions.chiSquareCDF(testStatistic, df);
            const upper = 1 - StatisticalDistributions.chiSquareCDF(testStatistic, df);
            pValue = 2 * Math.min(lower, upper);
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.chiSquareCDF(testStatistic, df);
        } else {
            pValue = StatisticalDistributions.chiSquareCDF(testStatistic, df);
        }

        return {
            testType: 'Variance Test',
            nullHypothesis: `σ² = ${nullVariance}`,
            alternative,
            testStatistic,
            pValue,
            degreesOfFreedom: df,
            sampleVariance,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis'
        };
    }

    calculateMeanConfidenceInterval(confidence = 0.95) {
        const alpha = 1 - confidence;
        const n = this.statistics.n;
        const mean = this.statistics.mean;
        const std = this.statistics.standardDeviation;
        const standardError = std / Math.sqrt(n);

        let criticalValue;
        if (n >= 30) {
            criticalValue = StatisticalDistributions.normalInverse(1 - alpha/2);
        } else {
            criticalValue = StatisticalDistributions.tInverse(1 - alpha/2, n - 1);
        }

        const marginOfError = criticalValue * standardError;

        return {
            confidence,
            lowerBound: mean - marginOfError,
            upperBound: mean + marginOfError,
            marginOfError,
            standardError
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

            // Perform KS test
            const ksTest = this.performKSTestForDistribution(distName, params);

            results[distName] = {
                name: dist.name,
                parameters: params,
                logLikelihood,
                aic,
                bic,
                ksTest,
                rank: 0 // Will be calculated after all distributions
            };
        });

        // Rank distributions by AIC
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
            const pdf = dist.pdf(x, params);
            if (pdf > 0) {
                logLikelihood += Math.log(pdf);
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
        return recommendations;
    }

    // ANOVA Analysis
    performANOVA(groups) {
        const k = groups.length; // number of groups
        const N = groups.reduce((sum, group) => sum + group.length, 0); // total sample size

        // Calculate group means and overall mean
        const groupMeans = groups.map(group => group.reduce((sum, val) => sum + val, 0) / group.length);
        const overallMean = groups.flat().reduce((sum, val) => sum + val, 0) / N;

        // Calculate Sum of Squares Between (SSB)
        let SSB = 0;
        for (let i = 0; i < k; i++) {
            SSB += groups[i].length * Math.pow(groupMeans[i] - overallMean, 2);
        }

        // Calculate Sum of Squares Within (SSW)
        let SSW = 0;
        for (let i = 0; i < k; i++) {
            for (let j = 0; j < groups[i].length; j++) {
                SSW += Math.pow(groups[i][j] - groupMeans[i], 2);
            }
        }

        // Calculate Total Sum of Squares (SST)
        const SST = SSB + SSW;

        // Degrees of freedom
        const dfBetween = k - 1;
        const dfWithin = N - k;
        const dfTotal = N - 1;

        // Mean Squares
        const MSB = SSB / dfBetween;
        const MSW = SSW / dfWithin;

        // F-statistic
        const fStatistic = MSB / MSW;
        const pValue = 1 - StatisticalDistributions.fCDF(fStatistic, dfBetween, dfWithin);

        return {
            testType: 'One-Way ANOVA',
            groups: groups.length,
            totalSampleSize: N,
            groupSizes: groups.map(g => g.length),
            groupMeans,
            overallMean,
            sumOfSquares: {
                between: SSB,
                within: SSW,
                total: SST
            },
            degreesOfFreedom: {
                between: dfBetween,
                within: dfWithin,
                total: dfTotal
            },
            meanSquares: {
                between: MSB,
                within: MSW
            },
            fStatistic,
            pValue,
            reject: pValue < 0.05,
            conclusion: pValue < 0.05 ? 'Reject null hypothesis - groups have different means' : 'Fail to reject null hypothesis - no evidence of different group means'
        };
    }

    // Survival Analysis (Basic Kaplan-Meier)
    performSurvivalAnalysis(times, events) {
        if (times.length !== events.length) {
            throw new Error('Times and events arrays must have the same length');
        }

        // Combine and sort by time
        const data = times.map((time, i) => ({ time, event: events[i] }))
                          .sort((a, b) => a.time - b.time);

        const results = [];
        let nAtRisk = data.length;
        let survivalProbability = 1.0;

        for (let i = 0; i < data.length; i++) {
            const currentTime = data[i].time;
            let nEvents = 0;
            let j = i;

            // Count events at this time point
            while (j < data.length && data[j].time === currentTime) {
                if (data[j].event === 1) nEvents++;
                j++;
            }

            if (nEvents > 0) {
                survivalProbability *= (nAtRisk - nEvents) / nAtRisk;
            }

            results.push({
                time: currentTime,
                nAtRisk,
                nEvents,
                survivalProbability,
                standardError: Math.sqrt(survivalProbability * (1 - survivalProbability) / nAtRisk)
            });

            nAtRisk -= (j - i);
            i = j - 1; // Skip to next unique time
        }

        return {
            testType: 'Kaplan-Meier Survival Analysis',
            survivalTable: results,
            medianSurvivalTime: this.calculateMedianSurvival(results),
            summary: this.generateSurvivalSummary(results)
        };
    }

    calculateMedianSurvival(survivalTable) {
        for (let i = 0; i < survivalTable.length; i++) {
            if (survivalTable[i].survivalProbability <= 0.5) {
                return survivalTable[i].time;
            }
        }
        return null; // Median not reached
    }

    generateSurvivalSummary(survivalTable) {
        const finalSurvival = survivalTable[survivalTable.length - 1].survivalProbability;
        return {
            finalSurvivalRate: finalSurvival,
            totalEvents: survivalTable.reduce((sum, row) => sum + row.nEvents, 0),
            followUpTime: survivalTable[survivalTable.length - 1].time
        };
    }

    // Parameter Confidence Intervals
    calculateParameterConfidenceIntervals() {
        const confidenceLevels = [0.90, 0.95, 0.99];
        this.parameterConfidenceIntervals = {};

        confidenceLevels.forEach(level => {
            this.parameterConfidenceIntervals[level] = this.calculateParameterCIForLevel(level);
        });
    }

    calculateParameterCIForLevel(confidence) {
        const alpha = 1 - confidence;
        const n = this.statistics.n;

        switch(this.selectedDistribution) {
            case 'normal':
                return this.calculateNormalParameterCI(confidence, alpha, n);
            case 't':
                return this.calculateTParameterCI(confidence, alpha, n);
            case 'exponential':
                return this.calculateExponentialParameterCI(confidence, alpha, n);
            case 'gamma':
                return this.calculateGammaParameterCI(confidence, alpha, n);
            case 'beta':
                return this.calculateBetaParameterCI(confidence, alpha, n);
            case 'chisquare':
                return this.calculateChiSquareParameterCI(confidence, alpha, n);
            case 'f':
                return this.calculateFParameterCI(confidence, alpha, n);
            case 'lognormal':
                return this.calculateLogNormalParameterCI(confidence, alpha, n);
            case 'pareto':
                return this.calculateParetoParameterCI(confidence, alpha, n);
            case 'binomial':
                return this.calculateBinomialParameterCI(confidence, alpha, n);
            case 'bernoulli':
                return this.calculateBernoulliParameterCI(confidence, alpha, n);
            case 'poisson':
                return this.calculatePoissonParameterCI(confidence, alpha, n);
            case 'geometric':
                return this.calculateGeometricParameterCI(confidence, alpha, n);
            case 'uniform':
                return this.calculateUniformParameterCI(confidence, alpha, n);
            default:
                return this.calculateBootstrapParameterCI(confidence, alpha, n);
        }
    }


calculateLogNormalParameterCI(confidence, alpha, n) {
    const [mu, sigma] = this.distributionParams;
    
    // For log-normal, the log-transformed data follows normal distribution
    const logData = this.rawSamples.filter(x => x > 0).map(x => Math.log(x));
    const logN = logData.length;
    
    if (logN < 2) {
        return {
            parameters: {
                mu: {
                    estimate: mu,
                    lowerBound: mu,
                    upperBound: mu,
                    standardError: 0,
                    interpretation: 'Insufficient positive data for confidence interval'
                },
                sigma: {
                    estimate: sigma,
                    lowerBound: sigma,
                    upperBound: sigma,
                    standardError: 0,
                    interpretation: 'Insufficient positive data for confidence interval'
                }
            }
        };
    }
    
    const tCritical = StatisticalDistributions.tInverse(1 - alpha/2, logN - 1);
    const muSE = sigma / Math.sqrt(logN);
    
    // Chi-square CI for sigma
    const chiLower = StatisticalDistributions.chiSquareInverse(alpha/2, logN - 1);
    const chiUpper = StatisticalDistributions.chiSquareInverse(1 - alpha/2, logN - 1);
    
    return {
        parameters: {
            mu: {
                estimate: mu,
                lowerBound: mu - tCritical * muSE,
                upperBound: mu + tCritical * muSE,
                standardError: muSE,
                interpretation: 'Confidence interval for log-scale location parameter'
            },
            sigma: {
                estimate: sigma,
                lowerBound: sigma * Math.sqrt((logN - 1) / chiUpper),
                upperBound: sigma * Math.sqrt((logN - 1) / chiLower),
                standardError: sigma / Math.sqrt(2 * (logN - 1)),
                interpretation: 'Confidence interval for log-scale scale parameter'
            }
        }
    };
}

calculateParetoParameterCI(confidence, alpha, n) {
    const [xm, alphaParam] = this.distributionParams;
    
    // For Pareto distribution, alpha follows approximately normal for large n
    const alphaSE = alphaParam / Math.sqrt(n);
    const zCritical = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);
    
    return {
        parameters: {
            xm: {
                estimate: xm,
                lowerBound: xm,
                upperBound: xm,
                standardError: 0,
                interpretation: 'Scale parameter (minimum value) - fixed at sample minimum'
            },
            alpha: {
                estimate: alphaParam,
                lowerBound: Math.max(0.01, alphaParam - zCritical * alphaSE),
                upperBound: alphaParam + zCritical * alphaSE,
                standardError: alphaSE,
                interpretation: 'Confidence interval for Pareto shape parameter'
            }
        }
    };
}



    calculateNormalParameterCI(confidence, alpha, n) {
        const mean = this.statistics.mean;
        const std = this.statistics.standardDeviation;
        const tCritical = StatisticalDistributions.tInverse(1 - alpha/2, n - 1);

        const meanSE = std / Math.sqrt(n);
        const varSE = std * Math.sqrt(2 / (n - 1)); // Approximate

        return {
            parameters: {
                mean: {
                    estimate: mean,
                    lowerBound: mean - tCritical * meanSE,
                    upperBound: mean + tCritical * meanSE,
                    standardError: meanSE,
                    interpretation: 'Confidence interval for the population mean'
                },
                standardDeviation: {
                    estimate: std,
                    lowerBound: std * Math.sqrt((n - 1) / StatisticalDistributions.chiSquareInverse(1 - alpha/2, n - 1)),
                    upperBound: std * Math.sqrt((n - 1) / StatisticalDistributions.chiSquareInverse(alpha/2, n - 1)),
                    standardError: varSE,
                    interpretation: 'Confidence interval for the population standard deviation'
                }
            }
        };
    }

    calculateExponentialParameterCI(confidence, alpha, n) {
        const lambda = this.distributionParams[0];
        const mean = this.statistics.mean;

        // For exponential, MLE of λ = 1/sample_mean
        // CI for λ using chi-square distribution
        const lowerBound = StatisticalDistributions.chiSquareInverse(alpha/2, 2 * n) / (2 * n * mean);
        const upperBound = StatisticalDistributions.chiSquareInverse(1 - alpha/2, 2 * n) / (2 * n * mean);

        return {
            parameters: {
                lambda: {
                    estimate: lambda,
                    lowerBound,
                    upperBound,
                    standardError: lambda / Math.sqrt(n),
                    interpretation: `Rate parameter: ${lambda.toFixed(4)} events per unit time`
                },
                meanTime: {
                    estimate: 1/lambda,
                    lowerBound: 1/upperBound,
                    upperBound: 1/lowerBound,
                    standardError: (1/lambda) / Math.sqrt(n),
                    interpretation: `Average time between events: ${(1/lambda).toFixed(4)} time units`
                }
            }
        };
    }

    calculateGammaParameterCI(confidence, alpha, n) {
        const [shape, scale] = this.distributionParams;

        // Approximate confidence intervals using asymptotic theory
        const shapeSE = shape / Math.sqrt(n);
        const scaleSE = scale / Math.sqrt(n);
        const zCritical = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);

        return {
            parameters: {
                shape: {
                    estimate: shape,
                    lowerBound: Math.max(0.01, shape - zCritical * shapeSE),
                    upperBound: shape + zCritical * shapeSE,
                    standardError: shapeSE,
                    interpretation: `Shape parameter α = ${shape.toFixed(3)} determines distribution shape`
                },
                scale: {
                    estimate: scale,
                    lowerBound: Math.max(0.01, scale - zCritical * scaleSE),
                    upperBound: scale + zCritical * scaleSE,
                    standardError: scaleSE,
                    interpretation: `Scale parameter β = ${scale.toFixed(3)} stretches the distribution`
                }
            }
        };
    }

    calculateBetaParameterCI(confidence, alpha, n) {
        const [alphaParam, betaParam] = this.distributionParams;

        // Use delta method for approximate confidence intervals
        const alphaSE = Math.sqrt(alphaParam * (alphaParam + betaParam + n) / (n * (alphaParam + betaParam)));
        const betaSE = Math.sqrt(betaParam * (alphaParam + betaParam + n) / (n * (alphaParam + betaParam)));
        const zCritical = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);

        return {
            parameters: {
                alpha: {
                    estimate: alphaParam,
                    lowerBound: Math.max(0.01, alphaParam - zCritical * alphaSE),
                    upperBound: alphaParam + zCritical * alphaSE,
                    standardError: alphaSE,
                    interpretation: `Shape parameter α = ${alphaParam.toFixed(3)}`
                },
                beta: {
                    estimate: betaParam,
                    lowerBound: Math.max(0.01, betaParam - zCritical * betaSE),
                    upperBound: betaParam + zCritical * betaSE,
                    standardError: betaSE,
                    interpretation: `Shape parameter β = ${betaParam.toFixed(3)}`
                }
            }
        };
    }

    calculateTParameterCI(confidence, alpha, n) {
        const df = this.distributionParams[0];

        // Approximate CI for degrees of freedom parameter
        const dfSE = Math.sqrt(2 * df); // Approximate standard error
        const zCritical = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);

        return {
            parameters: {
                degreesOfFreedom: {
                    estimate: df,
                    lowerBound: Math.max(1, df - zCritical * dfSE),
                    upperBound: df + zCritical * dfSE,
                    standardError: dfSE,
                    interpretation: `Degrees of freedom = ${df}, affects tail behavior`
                }
            }
        };
    }

    calculateChiSquareParameterCI(confidence, alpha, n) {
        const df = this.distributionParams[0];

        // For chi-square, mean = df, so we can estimate df from sample mean
        // CI based on gamma distribution properties
        const dfSE = Math.sqrt(2 * df / n);
        const zCritical = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);

        return {
            parameters: {
                degreesOfFreedom: {
                    estimate: df,
                    lowerBound: Math.max(1, df - zCritical * dfSE),
                    upperBound: df + zCritical * dfSE,
                    standardError: dfSE,
                    interpretation: `df = ${df.toFixed(1)}, determines distribution shape and spread`
                }
            }
        };
    }

    calculateFParameterCI(confidence, alpha, n) {
        const [df1, df2] = this.distributionParams;

        // F-distribution parameters are typically fixed by design
        // Provide informational CI based on theoretical properties
        return {
            parameters: {
                numeratorDF: {
                    estimate: df1,
                    lowerBound: df1,
                    upperBound: df1,
                    standardError: 0,
                    interpretation: `Numerator df = ${df1}, typically determined by study design`
                },
                denominatorDF: {
                    estimate: df2,
                    lowerBound: df2,
                    upperBound: df2,
                    standardError: 0,
                    interpretation: `Denominator df = ${df2}, typically determined by study design`
                }
            }
        };
    }

    calculateBinomialParameterCI(confidence, alpha, n) {
        return this.calculateBootstrapParameterCI(confidence, alpha, n);
    }

    calculateBernoulliParameterCI(confidence, alpha, n) {
        return this.calculateBootstrapParameterCI(confidence, alpha, n);
    }

    calculatePoissonParameterCI(confidence, alpha, n) {
        return this.calculateBootstrapParameterCI(confidence, alpha, n);
    }

    calculateGeometricParameterCI(confidence, alpha, n) {
        return this.calculateBootstrapParameterCI(confidence, alpha, n);
    }

    calculateUniformParameterCI(confidence, alpha, n) {
        return this.calculateBootstrapParameterCI(confidence, alpha, n);
    }

    calculateBootstrapParameterCI(confidence, alpha, n, bootstrapSamples = 1000) {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        if (!dist.estimateParams) return null;

        const bootstrapEstimates = [];

        // Generate bootstrap samples
        for (let i = 0; i < bootstrapSamples; i++) {
            const bootstrapSample = this.generateBootstrapSample();
            const bootstrapParams = dist.estimateParams(bootstrapSample);
            bootstrapEstimates.push(bootstrapParams);
        }

        // Calculate percentile confidence intervals for each parameter
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

    // Distribution-Specific Target Analysis
    calculateDistributionSpecificTargetAnalysis() {
        if (this.targetValue === null) return;

        switch(this.selectedDistribution) {
            case 'normal':
                this.targetAnalysis = this.calculateNormalTargetAnalysis();
                break;
            case 't':
                this.targetAnalysis = this.calculateTTargetAnalysis();
                break;
            case 'exponential':
                this.targetAnalysis = this.calculateExponentialTargetAnalysis();
                break;
            case 'gamma':
                this.targetAnalysis = this.calculateGammaTargetAnalysis();
                break;
            case 'beta':
                this.targetAnalysis = this.calculateBetaTargetAnalysis();
                break;
            case 'chisquare':
                this.targetAnalysis = this.calculateChiSquareTargetAnalysis();
                break;
            case 'f':
                this.targetAnalysis = this.calculateFTargetAnalysis();
                break;
            case 'lognormal':
                this.targetAnalysis = this.calculateLogNormalTargetAnalysis();
                break;
            case 'pareto':
                this.targetAnalysis = this.calculateParetoTargetAnalysis();
                break;
            case 'binomial':
                this.targetAnalysis = this.calculateBinomialTargetAnalysis();
                break;
            case 'bernoulli':
                this.targetAnalysis = this.calculateBernoulliTargetAnalysis();
                break;
            case 'poisson':
                this.targetAnalysis = this.calculatePoissonTargetAnalysis();
                break;
            case 'geometric':
                this.targetAnalysis = this.calculateGeometricTargetAnalysis();
                break;
            case 'uniform':
                this.targetAnalysis = this.calculateUniformTargetAnalysis();
                break;
            default:
                this.targetAnalysis = this.calculateGenericTargetAnalysis();
        }
    }


calculateLogNormalTargetAnalysis() {
    const [mu, sigma] = this.distributionParams;
    const target = this.targetValue;

    if (target <= 0) {
        return {
            targetValue: target,
            error: 'Target value must be positive for log-normal distribution'
        };
    }

    const logTarget = Math.log(target);
    const zScore = (logTarget - mu) / sigma;
    const probLessThan = StatisticalDistributions.logNormalCDF(target, mu, sigma);
    const probGreaterThan = 1 - probLessThan;

    const theoreticalMean = Math.exp(mu + sigma * sigma / 2);
    const theoreticalVariance = (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma);
    const theoreticalMedian = Math.exp(mu);
    const theoreticalMode = Math.exp(mu - sigma * sigma);

    return {
        targetValue: target,
        targetType: 'Value',
        logTransform: {
            logTarget: logTarget,
            standardizedLogValue: zScore
        },
        probabilities: {
            lessThan: probLessThan,
            greaterThan: probGreaterThan,
            interpretation: `P(X ≤ ${target}) = ${probLessThan.toFixed(4)}`
        },
        distributionProperties: {
            theoreticalMean: theoreticalMean,
            theoreticalVariance: theoreticalVariance,
            theoreticalMedian: theoreticalMedian,
            theoreticalMode: theoreticalMode,
            coefficientOfVariation: Math.sqrt(Math.exp(sigma * sigma) - 1)
        },
        practicalSignificance: this.assessLogNormalPracticalSignificance(target, theoreticalMean, theoreticalMedian),
        recommendation: this.generateLogNormalRecommendation(target, theoreticalMean, theoreticalMedian),
        distributionContext: {
            logLocationParameter: mu,
            logScaleParameter: sigma,
            multiplicativeProcess: 'Data follows multiplicative rather than additive process'
        }
    };
}

assessLogNormalPracticalSignificance(target, mean, median) {
    const ratioToMean = target / mean;
    const ratioToMedian = target / median;
    
    if (ratioToMean < 0.5) return 'Target is well below typical values';
    if (ratioToMean < 0.8) return 'Target is below average';
    if (ratioToMean < 1.2) return 'Target is near average';
    if (ratioToMean < 2.0) return 'Target is above average';
    return 'Target is well above typical values';
}

generateLogNormalRecommendation(target, mean, median) {
    const ratioToMedian = target / median;
    
    if (ratioToMedian < 0.5) {
        return "Target is in the lower tail. Consider if this represents unusual circumstances.";
    } else if (ratioToMedian > 2.0) {
        return "Target is in the upper tail. This may represent extreme values or outliers.";
    } else {
        return "Target falls within the typical range for log-normal processes.";
    }
}

// PARETO TARGET ANALYSIS
calculateParetoTargetAnalysis() {
    const [xm, alpha] = this.distributionParams;
    const target = this.targetValue;

    if (target < xm) {
        return {
            targetValue: target,
            error: `Target value must be ≥ ${xm} (minimum value) for Pareto distribution`
        };
    }

    const probLessThan = StatisticalDistributions.paretoCDF(target, xm, alpha);
    const probGreaterThan = 1 - probLessThan;

    const theoreticalMean = alpha > 1 ? (alpha * xm) / (alpha - 1) : Infinity;
    const theoreticalVariance = alpha > 2 ? (xm * xm * alpha) / ((alpha - 1) * (alpha - 1) * (alpha - 2)) : Infinity;
    const theoreticalMedian = xm * Math.pow(2, 1/alpha);
    const theoreticalMode = xm;

    const eightyPercentileValue = StatisticalDistributions.paretoInverse(0.8, xm, alpha);
    const twentyPercentileValue = StatisticalDistributions.paretoInverse(0.2, xm, alpha);

    return {
        targetValue: target,
        targetType: 'Value',
        probabilities: {
            lessThan: probLessThan,
            greaterThan: probGreaterThan,
            interpretation: `P(X ≤ ${target}) = ${probLessThan.toFixed(4)}`
        },
        distributionProperties: {
            theoreticalMean: theoreticalMean,
            theoreticalVariance: theoreticalVariance,
            theoreticalMedian: theoreticalMedian,
            theoreticalMode: theoreticalMode,
            minimumValue: xm
        },
        paretoPrinciple: {
            eightyPercentile: eightyPercentileValue,
            twentyPercentile: twentyPercentileValue,
            paretoRatio: eightyPercentileValue / twentyPercentileValue,
            interpretation: this.interpretParetoRatio(alpha)
        },
        practicalSignificance: this.assessParetoPracticalSignificance(target, xm, alpha),
        recommendation: this.generateParetoRecommendation(target, xm, alpha),
        distributionContext: {
            scaleParameter: xm,
            shapeParameter: alpha,
            heavyTail: alpha < 2 ? 'Infinite variance - very heavy tail' : 'Finite variance'
        }
    };
}

interpretParetoRatio(alpha) {
    if (alpha > 2) {
        return 'Moderate inequality - finite variance';
    } else if (alpha > 1) {
        return 'High inequality - infinite variance, finite mean';
    } else {
        return 'Extreme inequality - infinite mean and variance';
    }
}

assessParetoPracticalSignificance(target, xm, alpha) {
    const ratio = target / xm;
    
    if (ratio < 1.5) return 'Close to minimum value';
    if (ratio < 3) return 'In lower portion of distribution';
    if (ratio < 10) return 'In middle portion of distribution';
    return 'In upper tail - potential extreme value';
}

generateParetoRecommendation(target, xm, alpha) {
    const ratio = target / xm;
    
    if (alpha < 1) {
        return "Extremely heavy-tailed distribution. Most values are near minimum, but extreme outliers are common.";
    } else if (alpha < 2) {
        return "Heavy-tailed distribution following 80-20 principle. Expect significant inequality.";
    } else {
        return "Pareto distribution with finite variance. Still right-skewed but more moderate.";
    }
}



    calculateNormalTargetAnalysis() {
        const [mean, std] = this.distributionParams;
        const target = this.targetValue;

        const zScore = (target - mean) / std;
        const probLessThan = StatisticalDistributions.normalCDF(target, mean, std);
        const probGreaterThan = 1 - probLessThan;

        const effectSize = Math.abs(zScore);

        return {
            targetValue: target,
            targetType: 'Value',
            zScore: zScore,
            probabilities: {
                lessThan: probLessThan,
                greaterThan: probGreaterThan,
                interpretation: `P(X ≤ ${target}) = ${probLessThan.toFixed(4)}`
            },
            effectSize: effectSize,
            practicalSignificance: this.assessNormalPracticalSignificance(effectSize),
            recommendation: this.generateNormalRecommendation(effectSize, zScore),
            distributionContext: {
                mean: mean,
                standardDeviation: std,
                standardizedValue: zScore
            }
        };
    }

    assessNormalPracticalSignificance(effectSize) {
        if (effectSize < 0.2) return 'Negligible difference from mean';
        if (effectSize < 0.5) return 'Small difference from mean';
        if (effectSize < 0.8) return 'Medium difference from mean';
        return 'Large difference from mean';
    }

    generateNormalRecommendation(effectSize, zScore) {
        if (effectSize < 0.2) {
            return "Target value is very close to the mean. No significant deviation.";
        } else if (effectSize < 0.8) {
            return "Target value shows moderate deviation. Review if within acceptable range.";
        } else {
            return "Target value is far from the mean. Investigate potential outliers or shifts.";
        }
    }

    calculateTTargetAnalysis() {
        const df = this.distributionParams[0];
        const target = this.targetValue;

        const probLessThan = StatisticalDistributions.tCDF(target, df);
        const probGreaterThan = 1 - probLessThan;

        // Effect size compared to standard normal
        const normalEquivalent = StatisticalDistributions.normalInverse(probLessThan);
        const effectSize = Math.abs(normalEquivalent);

        return {
            targetValue: target,
            targetType: 'T-Value',
            degreesOfFreedom: df,
            probabilities: {
                lessThan: probLessThan,
                greaterThan: probGreaterThan,
                interpretation: `P(T ≤ ${target}) = ${probLessThan.toFixed(4)} with df=${df}`
            },
            effectSize: effectSize,
            practicalSignificance: this.assessTPracticalSignificance(effectSize, df),
            recommendation: this.generateTRecommendation(effectSize, target, df),
            distributionContext: {
                degreesOfFreedom: df,
                normalEquivalent: normalEquivalent,
                tailBehavior: df > 30 ? 'Similar to normal' : 'Heavy tails'
            }
        };
    }

    assessTPracticalSignificance(effectSize, df) {
        if (df < 10) return effectSize > 2.5 ? 'Large (small df)' : 'Small to medium (small df)';
        return effectSize > 1.96 ? 'Significant at 5% level' : 'Not significant at 5% level';
    }

    generateTRecommendation(effectSize, target, df) {
        return `With df=${df}, the target t-value of ${target} corresponds to a p-value of ${(1 - StatisticalDistributions.tCDF(Math.abs(target), df))*2}.toFixed(4) for two-tailed test.`;
    }

    calculateExponentialTargetAnalysis() {
        const lambda = this.distributionParams[0];
        const target = this.targetValue;
        const sampleMean = this.statistics.mean;

        // For exponential, analyze target rate or target time
        const isRateTarget = this.targetAnalysisType === 'rate';
        const actualTarget = isRateTarget ? target : 1/target;

        // Probability calculations
        const probGreaterThan = target > 0 ? Math.exp(-lambda * target) : 1;
        const probLessThan = 1 - probGreaterThan;

        // Effect size for exponential
        const effectSize = Math.abs(Math.log(sampleMean / (1/lambda)));

        return {
            targetValue: target,
            targetType: isRateTarget ? 'Rate Parameter' : 'Time Value',
            sampleEstimate: isRateTarget ? lambda : sampleMean,
            probabilities: {
                greaterThan: probGreaterThan,
                lessThan: probLessThan,
                interpretation: `P(X > ${target}) = ${probGreaterThan.toFixed(4)}`
            },
            effectSize: effectSize,
            practicalSignificance: this.assessExponentialPracticalSignificance(effectSize),
            recommendation: this.generateExponentialRecommendation(effectSize, probGreaterThan),
            distributionContext: {
                expectedValue: 1/lambda,
                variance: 1/(lambda * lambda),
                medianValue: Math.log(2)/lambda
            }
        };
    }

    assessExponentialPracticalSignificance(effectSize) {
        if (effectSize < 0.2) return 'Negligible';
        if (effectSize < 0.5) return 'Small';
        if (effectSize < 0.8) return 'Medium';
        return 'Large';
    }

    generateExponentialRecommendation(effectSize, probability) {
        if (effectSize < 0.2) {
            return "The data is consistent with the exponential model. No action needed.";
        } else if (effectSize < 0.8) {
            return "Moderate evidence suggests reviewing the exponential assumption or parameter values.";
        } else {
            return "Strong evidence against the current exponential model. Consider alternative distributions or parameter adjustment.";
        }
    }

    calculateGammaTargetAnalysis() {
        const [shape, scale] = this.distributionParams;
        const target = this.targetValue;

        const dist = DistributionRegistry.getDistribution('gamma');
        const probLessThan = dist.cdf(target, this.distributionParams);
        const probGreaterThan = 1 - probLessThan;

        const expectedValue = shape * scale;
        const effectSize = Math.abs(target - expectedValue) / Math.sqrt(shape * scale * scale);

        return {
            targetValue: target,
            targetType: 'Value',
            expectedValue: expectedValue,
            probabilities: {
                lessThan: probLessThan,
                greaterThan: probGreaterThan,
                interpretation: `P(X ≤ ${target}) = ${probLessThan.toFixed(4)}`
            },
            effectSize: effectSize,
            practicalSignificance: this.assessGammaPracticalSignificance(effectSize),
            recommendation: this.generateGammaRecommendation(effectSize, probLessThan),
            distributionContext: {
                expectedValue: expectedValue,
                variance: shape * scale * scale,
                mode: shape > 1 ? (shape - 1) * scale : 0
            }
        };
    }

    assessGammaPracticalSignificance(effectSize) {
        if (effectSize < 0.2) return 'Negligible deviation';
        if (effectSize < 0.5) return 'Small deviation';
        if (effectSize < 0.8) return 'Medium deviation';
        return 'Large deviation';
    }

    generateGammaRecommendation(effectSize, probLessThan) {
        if (effectSize < 0.2) {
            return "Target is close to expected value under gamma model.";
        } else {
            return "Significant deviation; consider if gamma model is appropriate.";
        }
    }

    calculateBetaTargetAnalysis() {
        const [alpha, beta] = this.distributionParams;
        const target = this.targetValue;

        if (target < 0 || target > 1) {
            return {
                error: 'Target value must be between 0 and 1 for Beta distribution'
            };
        }

        const probLessThan = StatisticalDistributions.betaCDF(target, alpha, beta);
        const probGreaterThan = 1 - probLessThan;

        const mean = alpha / (alpha + beta);
        const variance = (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
        const effectSize = Math.abs(target - mean) / Math.sqrt(variance);

        return {
            targetValue: target,
            targetType: 'Proportion/Probability',
            probabilities: {
                lessThan: probLessThan,
                greaterThan: probGreaterThan,
                interpretation: `P(X ≤ ${target}) = ${probLessThan.toFixed(4)}`
            },
            effectSize: effectSize,
            practicalSignificance: this.assessBetaPracticalSignificance(effectSize),
            recommendation: this.generateBetaRecommendation(effectSize, target, mean),
            distributionContext: {
                expectedValue: mean,
                mode: alpha > 1 && beta > 1 ? (alpha - 1)/(alpha + beta - 2) : null,
                variance: variance
            }
        };
    }

    assessBetaPracticalSignificance(effectSize) {
        if (effectSize < 0.2) return 'Negligible';
        if (effectSize < 0.5) return 'Small';
        if (effectSize < 0.8) return 'Medium';
        return 'Large';
    }

    generateBetaRecommendation(effectSize, target, mean) {
        if (effectSize < 0.2) {
            return "Target proportion is close to expected value.";
        } else {
            return `Target ${target.toFixed(3)} deviates from mean ${mean.toFixed(3)}; review data.`;
        }
    }

    calculateChiSquareTargetAnalysis() {
        const df = this.distributionParams[0];
        const target = this.targetValue;

        const probLessThan = StatisticalDistributions.chiSquareCDF(target, df);
        const probGreaterThan = 1 - probLessThan;

        const expectedValue = df;
        const effectSize = Math.abs(target - expectedValue) / Math.sqrt(2 * df);

        return {
            targetValue: target,
            targetType: 'Chi-Square Value',
            probabilities: {
                lessThan: probLessThan,
                greaterThan: probGreaterThan,
                interpretation: `P(χ² ≤ ${target}) = ${probLessThan.toFixed(4)} with df=${df}`
            },
            effectSize: effectSize,
            practicalSignificance: effectSize > 1.96 ? 'Significant' : 'Not significant',
            recommendation: `For df=${df}, value ${target} is ${effectSize > 1.96 ? 'significant' : 'not significant'} at 5% level.`,
            distributionContext: {
                expectedValue: df,
                variance: 2 * df,
                mode: df > 2 ? df - 2 : 0
            }
        };
    }

    calculateFTargetAnalysis() {
        const [df1, df2] = this.distributionParams;
        const target = this.targetValue;

        if (target < 0) {
            return {
                error: 'Target value must be positive for F distribution'
            };
        }

        const probLessThan = StatisticalDistributions.fCDF(target, df1, df2);
        const probGreaterThan = 1 - probLessThan;

        // Critical values for common significance levels
        const criticalValues = {
            '0.10': StatisticalDistributions.fInverse(0.90, df1, df2),
            '0.05': StatisticalDistributions.fInverse(0.95, df1, df2),
            '0.01': StatisticalDistributions.fInverse(0.99, df1, df2)
        };

        return {
            targetValue: target,
            targetType: 'F-Statistic',
            degreesOfFreedom: { df1, df2 },
            probabilities: {
                lessThan: probLessThan,
                greaterThan: probGreaterThan,
                interpretation: `P(F ≤ ${target}) = ${probLessThan.toFixed(4)} with df1=${df1}, df2=${df2}`
            },
            criticalValues: criticalValues,
            statisticalSignificance: {
                '0.10': target > criticalValues['0.10'],
                '0.05': target > criticalValues['0.05'],
                '0.01': target > criticalValues['0.01']
            },
            recommendation: this.generateFRecommendation(target, criticalValues),
            distributionContext: {
                numeratorDF: df1,
                denominatorDF: df2,
                expectedValue: df2 > 2 ? df2 / (df2 - 2) : 'Undefined'
            }
        };
    }

    generateFRecommendation(target, criticalValues) {
        if (target > criticalValues['0.01']) {
            return "Highly significant difference in variances (p < 0.01)";
        } else if (target > criticalValues['0.05']) {
            return "Significant difference in variances (p < 0.05)";
        } else {
            return "No significant difference in variances (p > 0.05)";
        }
    }

    calculateGenericTargetAnalysis() {
        return {
            note: 'Generic target analysis not implemented for this distribution'
        };
    }

    calculateBinomialTargetAnalysis() {
        return this.calculateGenericTargetAnalysis();
    }

    calculateBernoulliTargetAnalysis() {
        return this.calculateGenericTargetAnalysis();
    }

    calculatePoissonTargetAnalysis() {
        return this.calculateGenericTargetAnalysis();
    }

    calculateGeometricTargetAnalysis() {
        return this.calculateGenericTargetAnalysis();
    }

    calculateUniformTargetAnalysis() {
        return this.calculateGenericTargetAnalysis();
    }





performLogNormalHypothesisTest(testConfig) {
    const { nullMu = 0, nullSigma = null, testParameter = 'mu', alternative = 'two-sided', alpha = 0.05 } = testConfig;
    const [observedMu, observedSigma] = this.distributionParams;
    const n = this.statistics.n;
    const logData = this.rawSamples.filter(x => x > 0).map(x => Math.log(x));

    if (testParameter === 'mu') {
        const standardError = observedSigma / Math.sqrt(n);
        const testStatistic = (observedMu - nullMu) / standardError;
        const df = n - 1;

        let pValue;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - StatisticalDistributions.tCDF(Math.abs(testStatistic), df));
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.tCDF(testStatistic, df);
        } else {
            pValue = StatisticalDistributions.tCDF(testStatistic, df);
        }

        return {
            testType: 'Log-Normal Mean Parameter Test',
            nullHypothesis: `μ = ${nullMu} (log-scale location)`,
            alternative: alternative,
            testStatistic: testStatistic,
            pValue: pValue,
            degreesOfFreedom: df,
            observedMu: observedMu,
            nullMu: nullMu,
            standardError: standardError,
            reject: pValue < alpha,
            conclusion: pValue < alpha ?
                `Reject H₀: Evidence suggests log-scale mean ≠ ${nullMu}` :
                `Fail to reject H₀: Data consistent with log-scale mean = ${nullMu}`,
            interpretation: 'Testing the location parameter of the underlying normal distribution of log-transformed data'
        };
    }

    if (testParameter === 'sigma' && nullSigma !== null) {
        const nullVariance = nullSigma * nullSigma;
        const observedVariance = observedSigma * observedSigma;
        const testStatistic = (n - 1) * observedVariance / nullVariance;
        const df = n - 1;

        let pValue;
        if (alternative === 'two-sided') {
            const lower = StatisticalDistributions.chiSquareCDF(testStatistic, df);
            const upper = 1 - StatisticalDistributions.chiSquareCDF(testStatistic, df);
            pValue = 2 * Math.min(lower, upper);
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.chiSquareCDF(testStatistic, df);
        } else {
            pValue = StatisticalDistributions.chiSquareCDF(testStatistic, df);
        }

        return {
            testType: 'Log-Normal Scale Parameter Test',
            nullHypothesis: `σ = ${nullSigma} (log-scale scale)`,
            alternative: alternative,
            testStatistic: testStatistic,
            pValue: pValue,
            degreesOfFreedom: df,
            observedSigma: observedSigma,
            nullSigma: nullSigma,
            reject: pValue < alpha,
            conclusion: pValue < alpha ?
                `Reject H₀: Evidence suggests log-scale scale ≠ ${nullSigma}` :
                `Fail to reject H₀: Data consistent with log-scale scale = ${nullSigma}`,
            interpretation: 'Testing the scale parameter of the underlying normal distribution of log-transformed data'
        };
    }

    return { error: 'Invalid test parameter or missing nullSigma for sigma test' };
}

// PARETO HYPOTHESIS TESTING
performParetoHypothesisTest(testConfig) {
    const { nullAlpha = 1, testParameter = 'alpha', alternative = 'two-sided', alpha = 0.05 } = testConfig;
    const [observedXm, observedAlpha] = this.distributionParams;
    const n = this.statistics.n;

    if (testParameter === 'alpha') {
        const standardError = observedAlpha / Math.sqrt(n);
        const testStatistic = (observedAlpha - nullAlpha) / standardError;

        let pValue;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - StatisticalDistributions.normalCDF(Math.abs(testStatistic)));
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.normalCDF(testStatistic);
        } else {
            pValue = StatisticalDistributions.normalCDF(testStatistic);
        }

        return {
            testType: 'Pareto Shape Parameter Test',
            nullHypothesis: `α = ${nullAlpha}`,
            alternative: alternative,
            testStatistic: testStatistic,
            pValue: pValue,
            observedAlpha: observedAlpha,
            nullAlpha: nullAlpha,
            standardError: standardError,
            reject: pValue < alpha,
            conclusion: pValue < alpha ?
                `Reject H₀: Evidence suggests Pareto index ≠ ${nullAlpha}` :
                `Fail to reject H₀: Data consistent with Pareto index = ${nullAlpha}`,
            interpretation: this.interpretParetoTest(observedAlpha, nullAlpha)
        };
    }

    return { error: 'Invalid test parameter for Pareto distribution' };
}


interpretParetoTest(observed, null_val) {
    if (observed < 1 && null_val >= 1) {
        return 'Evidence suggests infinite mean (very heavy tail) vs finite mean';
    } else if (observed >= 1 && null_val < 1) {
        return 'Evidence suggests finite mean vs infinite mean (very heavy tail)';
    } else if (observed < 2 && null_val >= 2) {
        return 'Evidence suggests infinite variance vs finite variance';
    } else if (observed >= 2 && null_val < 2) {
        return 'Evidence suggests finite variance vs infinite variance';
    } else {
        return 'Testing degree of tail heaviness in Pareto distribution';
    }
}


    performGammaHypothesisTest(testConfig) {

        const { nullShape, nullScale, testParameter = 'shape', alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const [observedShape, observedScale] = this.distributionParams;
        const n = this.statistics.n;

        if (testParameter === 'shape') {
            // Test for shape parameter using likelihood ratio test
            const logL1 = this.calculateLogLikelihood(); // Full model
            const logL0 = this.calculateLogLikelihoodUnderNull([nullShape, observedScale]); // Null model

            const lrStatistic = 2 * (logL1 - logL0);
            const pValue = 1 - StatisticalDistributions.chiSquareCDF(lrStatistic, 1);

            return {
                testType: 'Gamma Shape Parameter Test (Likelihood Ratio)',
                nullHypothesis: `α = ${nullShape}`,
                alternative: alternative,
                testStatistic: lrStatistic,
                pValue: pValue,
                degreesOfFreedom: 1,
                observedShape: observedShape,
                nullShape: nullShape,
                reject: pValue < alpha,
                conclusion: pValue < alpha ? 
                    `Reject H₀: Evidence suggests shape parameter ≠ ${nullShape}` : 
                    `Data consistent with shape parameter = ${nullShape}`,
                method: 'Likelihood Ratio Test'
            };
        } else if (testParameter === 'scale') {
            // Similar test for scale parameter
            const logL1 = this.calculateLogLikelihood();
            const logL0 = this.calculateLogLikelihoodUnderNull([observedShape, nullScale]);

            const lrStatistic = 2 * (logL1 - logL0);
            const pValue = 1 - StatisticalDistributions.chiSquareCDF(lrStatistic, 1);

            return {
                testType: 'Gamma Scale Parameter Test (Likelihood Ratio)',
                nullHypothesis: `β = ${nullScale}`,
                alternative: alternative,
                testStatistic: lrStatistic,
                pValue: pValue,
                degreesOfFreedom: 1,
                observedScale: observedScale,
                nullScale: nullScale,
                reject: pValue < alpha,
                conclusion: pValue < alpha ? 
                    `Reject H₀: Evidence suggests scale parameter ≠ ${nullScale}` : 
                    `Data consistent with scale parameter = ${nullScale}`,
                method: 'Likelihood Ratio Test'
            };
        }
    }

    calculateLogLikelihoodUnderNull(nullParams) {
        const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
        let logLikelihood = 0;

        this.rawSamples.forEach(x => {
            const pdf = dist.pdf(x, nullParams);
            if (pdf > 0) {
                logLikelihood += Math.log(pdf);
            }
        });

        return logLikelihood;
    }



    performChiSquareHypothesisTest(testConfig) {
        const { nullDF, alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const observedDF = this.distributionParams[0];
        const n = this.statistics.n;

        // For chi-square, we can test if the degrees of freedom parameter matches expected value
        // Using the sample mean (which equals df for chi-square) and its sampling distribution
        const sampleMean = this.statistics.mean;
        const expectedMean = nullDF;
        const standardError = Math.sqrt(2 * nullDF / n); // Approximate SE for chi-square mean

        // Z-test approximation for large samples
        const zStatistic = (sampleMean - expectedMean) / standardError;

        let pValue;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - StatisticalDistributions.normalCDF(Math.abs(zStatistic), 0, 1));
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.normalCDF(zStatistic, 0, 1);
        } else {
            pValue = StatisticalDistributions.normalCDF(zStatistic, 0, 1);
        }

        return {
            testType: 'Chi-Square Degrees of Freedom Test',
            nullHypothesis: `df = ${nullDF}`,
            alternative: alternative,
            testStatistic: zStatistic,
            pValue: pValue,
            sampleMean: sampleMean,
            expectedMean: expectedMean,
            standardError: standardError,
            observedDF: observedDF,
            nullDF: nullDF,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 
                `Reject H₀: Evidence suggests degrees of freedom ≠ ${nullDF}` : 
                `Fail to reject H₀: Data consistent with df = ${nullDF}`,
            method: 'Large Sample Z-Test Approximation'
        };
    }

    performFHypothesisTest(testConfig) {
        const { sample2, nullRatio = 1, alternative = 'two-sided', alpha = 0.05 } = testConfig;

        if (!sample2 || sample2.length === 0) {
            throw new Error('F-test requires a second sample for variance comparison');
        }

        // Calculate sample variances
        const var1 = this.statistics.variance;
        const n1 = this.statistics.n;

        const mean2 = sample2.reduce((a, b) => a + b) / sample2.length;
        const var2 = sample2.reduce((acc, val) => acc + Math.pow(val - mean2, 2), 0) / (sample2.length - 1);
        const n2 = sample2.length;

        // F-test statistic
        const fStatistic = (var1 / var2) / nullRatio;
        const df1 = n1 - 1;
        const df2 = n2 - 1;

        let pValue;
        if (alternative === 'two-sided') {
            const cdf = StatisticalDistributions.fCDF(fStatistic, df1, df2);
            pValue = 2 * Math.min(cdf, 1 - cdf);
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.fCDF(fStatistic, df1, df2);
        } else {
            pValue = StatisticalDistributions.fCDF(fStatistic, df1, df2);
        }

        return {
            testType: 'F-Test for Ratio of Variances',
            nullHypothesis: `σ₁²/σ₂² = ${nullRatio}`,
            alternative: alternative,
            testStatistic: fStatistic,
            pValue: pValue,
            df1: df1,
            df2: df2,
            variance1: var1,
            variance2: var2,
            sampleSize1: n1,
            sampleSize2: n2,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 
                'Reject H₀: Evidence suggests variances ratio ≠ ' + nullRatio : 
                'Fail to reject H₀: No evidence against variances ratio = ' + nullRatio,
            method: 'F-Test'
        };
    }

    performDistributionSpecificHypothesisTests(testConfig) {
        return this.performHypothesisTest(testConfig); // Redirect to main method
    }

    performExponentialHypothesisTest(testConfig) {
        const { nullRate, alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const n = this.statistics.n;
        const sampleMean = this.statistics.mean;
        const observedRate = 1 / sampleMean;

        // Test statistic: 2nλ₀X̄ ~ χ²(2n) under null hypothesis
        const testStatistic = 2 * n * nullRate * sampleMean;
        const df = 2 * n;

        let pValue;
        if (alternative === 'two-sided') {
            const lower = StatisticalDistributions.chiSquareCDF(testStatistic, df);
            const upper = 1 - StatisticalDistributions.chiSquareCDF(testStatistic, df);
            pValue = 2 * Math.min(lower, upper);
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.chiSquareCDF(testStatistic, df);
        } else {
            pValue = StatisticalDistributions.chiSquareCDF(testStatistic, df);
        }

        return {
            testType: 'Exponential Rate Test',
            nullHypothesis: `λ = ${nullRate}`,
            alternative: alternative,
            testStatistic: testStatistic,
            degreesOfFreedom: df,
            pValue: pValue,
            observedRate: observedRate,
            expectedMeanTime: 1/nullRate,
            observedMeanTime: sampleMean,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 
                `Reject H₀: Evidence suggests rate ≠ ${nullRate}` : 
                `Fail to reject H₀: Data consistent with rate = ${nullRate}`,
            confidenceInterval: this.calculateExponentialRateCI(1 - alpha)
        };
    }

    calculateExponentialRateCI(confidence) {
        const alpha = 1 - confidence;
        const n = this.statistics.n;
        const mean = this.statistics.mean;
        const lowerBound = StatisticalDistributions.chiSquareInverse(alpha/2, 2 * n) / (2 * n * mean);
        const upperBound = StatisticalDistributions.chiSquareInverse(1 - alpha/2, 2 * n) / (2 * n * mean);

        return {
            confidence,
            lowerBound: lowerBound,
            upperBound: upperBound
        };
    }

    performNormalHypothesisTest(testConfig) {
        const { nullMean = 0, nullStd = null, testParameter = 'mean', alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const [observedMean, observedStd] = this.distributionParams;
        const n = this.statistics.n;

        if (testParameter === 'mean') {
            // One-sample t-test for mean
            const standardError = observedStd / Math.sqrt(n);
            const testStatistic = (observedMean - nullMean) / standardError;
            const df = n - 1;

            let pValue;
            if (alternative === 'two-sided') {
                pValue = 2 * (1 - StatisticalDistributions.tCDF(Math.abs(testStatistic), df));
            } else if (alternative === 'greater') {
                pValue = 1 - StatisticalDistributions.tCDF(testStatistic, df);
            } else {
                pValue = StatisticalDistributions.tCDF(testStatistic, df);
            }

            return {
                testType: 'Normal Mean Test (One-Sample t-test)',
                nullHypothesis: `μ = ${nullMean}`,
                alternative: alternative,
                testStatistic: testStatistic,
                pValue: pValue,
                degreesOfFreedom: df,
                observedMean: observedMean,
                nullMean: nullMean,
                standardError: standardError,
                reject: pValue < alpha,
                conclusion: pValue < alpha ?
                    `Reject H₀: Evidence suggests mean ≠ ${nullMean}` :
                    `Fail to reject H₀: Data consistent with mean = ${nullMean}`,
                method: 'One-Sample t-test'
            };
        } else if (testParameter === 'variance' && nullStd !== null) {
            // Chi-square test for variance
            const nullVariance = nullStd * nullStd;
            const observedVariance = observedStd * observedStd;
            const testStatistic = (n - 1) * observedVariance / nullVariance;
            const df = n - 1;

            let pValue;
            if (alternative === 'two-sided') {
                const lower = StatisticalDistributions.chiSquareCDF(testStatistic, df);
                const upper = 1 - StatisticalDistributions.chiSquareCDF(testStatistic, df);
                pValue = 2 * Math.min(lower, upper);
            } else if (alternative === 'greater') {
                pValue = 1 - StatisticalDistributions.chiSquareCDF(testStatistic, df);
            } else {
                pValue = StatisticalDistributions.chiSquareCDF(testStatistic, df);
            }

            return {
                testType: 'Normal Variance Test (Chi-square)',
                nullHypothesis: `σ² = ${nullVariance}`,
                alternative: alternative,
                testStatistic: testStatistic,
                pValue: pValue,
                degreesOfFreedom: df,
                observedVariance: observedVariance,
                nullVariance: nullVariance,
                reject: pValue < alpha,
                conclusion: pValue < alpha ?
                    `Reject H₀: Evidence suggests variance ≠ ${nullVariance}` :
                    `Fail to reject H₀: Data consistent with variance = ${nullVariance}`,
                method: 'Chi-square test for variance'
            };
        }
    }

    performTHypothesisTest(testConfig) {
        const { nullDF, alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const observedDF = this.distributionParams[0];
        const n = this.statistics.n;

        // Test if degrees of freedom matches expected value
        // Using sample-based approximation
        const sampleMean = this.statistics.mean;
        const sampleVar = this.statistics.variance;

        // For t-distribution, theoretical variance = df/(df-2) for df > 2
        if (observedDF <= 2) {
            return {
                error: 'Hypothesis testing for t-distribution requires df > 2'
            };
        }

        const theoreticalVar = observedDF / (observedDF - 2);
        const standardError = Math.sqrt(2 * theoreticalVar / n);
        const testStatistic = (sampleVar - theoreticalVar) / standardError;

        let pValue;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - StatisticalDistributions.normalCDF(Math.abs(testStatistic), 0, 1));
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.normalCDF(testStatistic, 0, 1);
        } else {
            pValue = StatisticalDistributions.normalCDF(testStatistic, 0, 1);
        }

        return {
            testType: 'T-Distribution Degrees of Freedom Test',
            nullHypothesis: `df = ${nullDF}`,
            alternative: alternative,
            testStatistic: testStatistic,
            pValue: pValue,
            observedDF: observedDF,
            nullDF: nullDF,
            theoreticalVariance: theoreticalVar,
            sampleVariance: sampleVar,
            reject: pValue < alpha,
            conclusion: pValue < alpha ?
                `Reject H₀: Evidence suggests df ≠ ${nullDF}` :
                `Fail to reject H₀: Data consistent with df = ${nullDF}`,
            method: 'Large Sample Approximation'
        };
    }

    performBetaHypothesisTest(testConfig) {
        const { nullAlpha, nullBeta, testParameter = 'both', alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const [observedAlpha, observedBeta] = this.distributionParams;
        const n = this.statistics.n;

        // Likelihood ratio test for beta parameters
        const logL1 = this.calculateLogLikelihood(); // Full model
        let logL0;
        let df = 1;

        if (testParameter === 'alpha') {
            logL0 = this.calculateLogLikelihoodUnderNull([nullAlpha, observedBeta]);
        } else if (testParameter === 'beta') {
            logL0 = this.calculateLogLikelihoodUnderNull([observedAlpha, nullBeta]);
        } else {
            logL0 = this.calculateLogLikelihoodUnderNull([nullAlpha, nullBeta]);
            df = 2;
        }

        const lrStatistic = 2 * (logL1 - logL0);
        const pValue = 1 - StatisticalDistributions.chiSquareCDF(lrStatistic, df);

        return {
            testType: 'Beta Distribution Parameter Test (Likelihood Ratio)',
            nullHypothesis: testParameter === 'both' ? 
                `α = ${nullAlpha}, β = ${nullBeta}` : 
                testParameter === 'alpha' ? `α = ${nullAlpha}` : `β = ${nullBeta}`,
            alternative: alternative,
            testStatistic: lrStatistic,
            pValue: pValue,
            degreesOfFreedom: df,
            observedParameters: { alpha: observedAlpha, beta: observedBeta },
            nullParameters: { alpha: nullAlpha, beta: nullBeta },
            reject: pValue < alpha,
            conclusion: pValue < alpha ?
                'Reject H₀: Evidence against null parameter values' :
                'Fail to reject H₀: Data consistent with null parameter values',
            method: 'Likelihood Ratio Test'
        };
    }

    performBinomialHypothesisTest(testConfig) {
        const { nullP, alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const [nTrials, observedP] = this.distributionParams;
        const N = this.statistics.n; // Number of binomial samples

        const totalSuccesses = this.rawSamples.reduce((a, b) => a + b, 0);
        const totalTrials = N * nTrials;
        const sampleP = totalSuccesses / totalTrials;

        const standardError = Math.sqrt(nullP * (1 - nullP) / totalTrials);
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
            standardError,
            totalSuccesses,
            totalTrials,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis'
        };
    }

    performBernoulliHypothesisTest(testConfig) {
        const { nullP, alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const observedP = this.distributionParams[0];
        const n = this.statistics.n;

        const successes = this.rawSamples.reduce((a, b) => a + b, 0);
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
            standardError,
            successes,
            sampleSize: n,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis'
        };
    }

    performPoissonHypothesisTest(testConfig) {
        const { nullLambda, alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const observedLambda = this.distributionParams[0];
        const n = this.statistics.n;
        const sampleMean = this.statistics.mean;

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
            sampleMean,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis'
        };
    }

    performGeometricHypothesisTest(testConfig) {
        const { nullP, alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const observedP = this.distributionParams[0];
        const n = this.statistics.n;
        const sampleMean = this.statistics.mean;

        const nullMean = 1 / nullP;
        const standardError = Math.sqrt(nullMean * nullMean / n);
        const testStatistic = (sampleMean - nullMean) / standardError;

        let pValue;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - StatisticalDistributions.normalCDF(Math.abs(testStatistic)));
        } else if (alternative === 'greater') {
            pValue = 1 - StatisticalDistributions.normalCDF(testStatistic);
        } else {
            pValue = StatisticalDistributions.normalCDF(testStatistic);
        }

        return {
            testType: 'Geometric Probability Test',
            nullHypothesis: `p = ${nullP}`,
            alternative,
            testStatistic,
            pValue,
            observedP,
            sampleMean,
            reject: pValue < alpha,
            conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis'
        };
    }

    performUniformHypothesisTest(testConfig) {
        const { nullMin, nullMax, testParameter = 'bounds', alternative = 'two-sided', alpha = 0.05 } = testConfig;
        const [observedMin, observedMax] = this.distributionParams;
        const n = this.statistics.n;

        return {
            testType: 'Uniform Bounds Test',
            nullHypothesis: `min = ${nullMin}, max = ${nullMax}`,
            alternative,
            observedMin,
            observedMax,
            reject: false, // Placeholder
            conclusion: 'Uniform hypothesis testing not fully implemented'
        };
    }

// Detailed Calculation Walkthroughs
    generateDistributionCalculationWalkthrough() {
        switch(this.selectedDistribution) {
            case 'normal':
                return this.generateNormalCalculationWalkthrough();
            case 't':
                return this.generateTCalculationWalkthrough();
            case 'exponential':
                return this.generateExponentialCalculationWalkthrough();
            case 'gamma':
                return this.generateGammaCalculationWalkthrough();
            case 'beta':
                return this.generateBetaCalculationWalkthrough();
            case 'chisquare':
                return this.generateChiSquareCalculationWalkthrough();
            case 'f':           
                return this.generateFCalculationWalkthrough();
            case 'lognormal':
                return this.generateLogNormalCalculationWalkthrough();
            case 'pareto':
                return this.generateParetoCalculationWalkthrough();

            case 'binomial':
                return this.generateBinomialCalculationWalkthrough();
            case 'bernoulli':
                return this.generateBernoulliCalculationWalkthrough();
            case 'poisson':
                return this.generatePoissonCalculationWalkthrough();
            case 'geometric':
                return this.generateGeometricCalculationWalkthrough();
            case 'uniform':
                return this.generateUniformCalculationWalkthrough();
            default:
                return this.generateGenericCalculationWalkthrough();
        }
    }



generateLogNormalCalculationWalkthrough() {
    const [mu, sigma] = this.distributionParams;
    const n = this.statistics.n;

    return {
        parameterEstimation: {
            title: "Maximum Likelihood Estimation for Log-Normal Distribution",
            steps: [
                {
                    step: "Step 1: Transform Data",
                    formula: "Y = ln(X) for each observation",
                    explanation: `Transform ${n} observations to log scale`
                },
                {
                    step: "Step 2: Estimate μ (log-scale mean)",
                    formula: "μ̂ = (1/n) × Σln(xᵢ)",
                    explanation: `μ̂ = ${mu.toFixed(4)} (mean of log-transformed data)`
                },
                {
                    step: "Step 3: Estimate σ (log-scale std dev)",
                    formula: "σ̂ = √[(1/(n-1)) × Σ(ln(xᵢ) - μ̂)²]",
                    explanation: `σ̂ = ${sigma.toFixed(4)} (std dev of log-transformed data)`
                },
                {
                    step: "Step 4: Back-transform Properties",
                    formula: "E[X] = exp(μ + σ²/2), Var[X] = (exp(σ²) - 1) × exp(2μ + σ²)",
                    explanation: `Original scale: Mean ≈ ${Math.exp(mu + sigma*sigma/2).toFixed(2)}, Median = ${Math.exp(mu).toFixed(2)}`
                }
            ],
            result: `LogNormal(μ = ${mu.toFixed(4)}, σ = ${sigma.toFixed(4)})`
        },
        transformation: {
            title: "Log Transformation",
            explanation: "X ~ LogNormal(μ,σ) ⟺ ln(X) ~ Normal(μ,σ)",
            properties: "Multiplicative processes become additive after log transformation"
        },
        backTransformation: {
            title: "Back to Original Scale",
            formulas: {
                mean: `exp(μ + σ²/2) = ${Math.exp(mu + sigma*sigma/2).toFixed(4)}`,
                median: `exp(μ) = ${Math.exp(mu).toFixed(4)}`,
                mode: `exp(μ - σ²) = ${Math.exp(mu - sigma*sigma).toFixed(4)}`
            }
        }
    };
}
// PARETO CALCULATION WALKTHROUGH
generateParetoCalculationWalkthrough() {
    const [xm, alpha] = this.distributionParams;
    const n = this.statistics.n;

    return {
        parameterEstimation: {
            title: "Maximum Likelihood Estimation for Pareto Distribution",
            steps: [
                {
                    step: "Step 1: Identify Minimum",
                    formula: "xₘ = min(x₁, x₂, ..., xₙ)",
                    explanation: `xₘ = ${xm.toFixed(4)} (minimum observed value)`
                },
                {
                    step: "Step 2: Estimate Shape Parameter",
                    formula: "α̂ = n / Σln(xᵢ/xₘ)",
                    explanation: `α̂ = ${alpha.toFixed(4)} (controls tail heaviness)`
                },
                {
                    step: "Step 3: Validate Parameters",
                    formula: "Check: α > 0 and all xᵢ ≥ xₘ",
                    explanation: "Ensure all data points are above minimum threshold"
                }
            ],
            result: `Pareto(xₘ = ${xm.toFixed(4)}, α = ${alpha.toFixed(4)})`
        },
        properties: {
            title: "Pareto Properties",
            moments: {
                mean: alpha > 1 ? `${((alpha * xm) / (alpha - 1)).toFixed(4)}` : 'Undefined (infinite)',
                variance: alpha > 2 ? `${((xm * xm * alpha) / ((alpha - 1) * (alpha - 1) * (alpha - 2))).toFixed(4)}` : 'Undefined (infinite)'
            }
        },
        paretoRule: {
            title: "80-20 Principle",
            explanation: alpha < 1.61 ? 
                "Strong 80-20 effect: 20% of items account for >80% of total" :
                "Weaker Pareto effect: more evenly distributed"
        }
    };
}



    generateNormalCalculationWalkthrough() {
        const [mean, std] = this.distributionParams;
        const n = this.statistics.n;

        return {
            parameterEstimation: {
                title: "Maximum Likelihood Estimation for Normal Distribution",
                steps: [
                    {
                        step: "Step 1: Sample Mean",
                        formula: "x̄ = (1/n) × Σxᵢ",
                        explanation: `x̄ = (1/${n}) × ${this.statistics.sum.toFixed(3)} = ${mean.toFixed(4)}`
                    },
                    {
                        step: "Step 2: Sample Standard Deviation",
                        formula: "s = √[(1/(n-1)) × Σ(xᵢ - x̄)²]",
                        explanation: `s = √[(1/${n-1}) × ${((n-1) * this.statistics.variance).toFixed(3)}] = ${std.toFixed(4)}`
                    },
                    {
                        step: "Step 3: MLE Properties",
                        formula: "μ̂ = x̄, σ̂ = s",
                        explanation: "Sample mean and standard deviation are unbiased estimators"
                    }
                ],
                result: `Normal(μ = ${mean.toFixed(4)}, σ = ${std.toFixed(4)})`
            },
            standardization: {
                title: "Standardization Process",
                formula: "Z = (X - μ)/σ ~ N(0,1)",
                explanation: `Any value x can be standardized: z = (x - ${mean.toFixed(4)})/${std.toFixed(4)}`
            },
            confidenceInterval: {
                title: "Confidence Interval for Mean",
                formula: `x̄ ± t_{α/2,${n-1}} × (s/√n)`,
                calculation: this.calculateMeanConfidenceInterval(0.95)
            }
        };
    }

    generateTCalculationWalkthrough() {
        const df = this.distributionParams[0];

        return {
            parameterEstimation: {
                title: "T-Distribution Parameter Estimation",
                steps: [
                    {
                        step: "Step 1: Degrees of Freedom",
                        formula: "df = n - 1 (for one-sample case)",
                        explanation: `df = ${this.statistics.n} - 1 = ${df}`
                    },
                    {
                        step: "Step 2: Distribution Properties",
                        formula: "E[T] = 0 (for df > 1), Var[T] = df/(df-2) (for df > 2)",
                        explanation: df > 2 ? `Variance = ${df}/(${df}-2) = ${(df/(df-2)).toFixed(4)}` : "Variance undefined for df ≤ 2"
                    }
                ],
                result: `t-distribution with df = ${df}`
            },
            comparison: {
                title: "Comparison with Standard Normal",
                explanation: df > 30 ? 
                    "With df > 30, t-distribution closely approximates standard normal" :
                    "With small df, t-distribution has heavier tails than normal"
            },
            criticalValues: this.calculateTCriticalValues(df)
        };
    }

    calculateTCriticalValues(df) {
        return {
            title: "Critical Values for Common Significance Levels",
            values: {
                '0.10': { 
                    oneTailed: StatisticalDistributions.tInverse(0.90, df).toFixed(4),
                    twoTailed: StatisticalDistributions.tInverse(0.95, df).toFixed(4)
                },
                '0.05': { 
                    oneTailed: StatisticalDistributions.tInverse(0.95, df).toFixed(4),
                    twoTailed: StatisticalDistributions.tInverse(0.975, df).toFixed(4)
                },
                '0.01': { 
                    oneTailed: StatisticalDistributions.tInverse(0.99, df).toFixed(4),
                    twoTailed: StatisticalDistributions.tInverse(0.995, df).toFixed(4)
                }
            }
        };
    }

    generateExponentialCalculationWalkthrough() {
        const lambda = this.distributionParams[0];
        const n = this.statistics.n;
        const sampleMean = this.statistics.mean;

        return {
            parameterEstimation: {
                title: "Maximum Likelihood Estimation for Exponential Distribution",
                steps: [
                    {
                        step: "Step 1: Likelihood Function",
                        formula: "L(λ) = λⁿ × exp(-λ × Σxᵢ)",
                        explanation: `For n = ${n} observations, the likelihood function depends on λ and the sum of observations.`
                    },
                    {
                        step: "Step 2: Log-Likelihood Function", 
                        formula: "ℓ(λ) = n×ln(λ) - λ×Σxᵢ",
                        explanation: `Taking natural log: ℓ(λ) = ${n}×ln(λ) - λ×${this.statistics.sum.toFixed(3)}`
                    },
                    {
                        step: "Step 3: Differentiate and Set to Zero",
                        formula: "dℓ/dλ = n/λ - Σxᵢ = 0",
                        explanation: `Setting derivative to zero: ${n}/λ - ${this.statistics.sum.toFixed(3)} = 0`
                    },
                    {
                        step: "Step 4: Solve for λ",
                        formula: "λ̂ = n/Σxᵢ = 1/x̄",
                        explanation: `λ̂ = ${n}/${this.statistics.sum.toFixed(3)} = 1/${sampleMean.toFixed(3)} = ${lambda.toFixed(4)}`
                    }
                ],
                result: `Maximum likelihood estimate: λ̂ = ${lambda.toFixed(4)} events per time unit`
            },
            confidenceInterval: this.generateExponentialCIWalkthrough(),
            interpretation: {
                rateParameter: `λ = ${lambda.toFixed(4)} represents the rate of occurrence`,
                meanTime: `Expected time between events = 1/λ = ${(1/lambda).toFixed(3)} time units`,
                probability: `P(X > t) = exp(-λt) = exp(-${lambda.toFixed(4)}×t)`
            }
        };
    }

    generateExponentialCIWalkthrough() {
        const lambda = this.distributionParams[0];
        const n = this.statistics.n;
        const alpha = 0.05; // 95% CI

        return {
            title: "95% Confidence Interval for Exponential Rate Parameter",
            steps: [
                {
                    step: "Step 1: Sampling Distribution",
                    explanation: `Under exponential distribution, 2nλX̄ ~ χ²(2n)`,
                    formula: `2 × ${n} × λ × ${this.statistics.mean.toFixed(3)} ~ χ²(${2*n})`
                },
                {
                    step: "Step 2: Chi-Square Critical Values",
                    explanation: `For 95% CI with df = ${2*n}:`,
                    formula: `χ²₀.₀₂₅,${2*n} and χ²₀.₉₇₅,${2*n}`
                },
                {
                    step: "Step 3: Confidence Interval Formula",
                    explanation: "Rearranging the inequality for λ:",
                    formula: `[χ²₀.₀₂₅/(2n×x̄), χ²₀.₉₇₅/(2n×x̄)]`
                },
                {
                    step: "Step 4: Calculate Bounds",
                    calculation: this.calculateExponentialCIBounds(alpha),
                    interpretation: "We are 95% confident the true rate parameter lies in this interval"
                }
            ]
        };
    }

    calculateExponentialCIBounds(alpha) {
        const n = this.statistics.n;
        const mean = this.statistics.mean;

        const chiLower = StatisticalDistributions.chiSquareInverse(alpha/2, 2*n);
        const chiUpper = StatisticalDistributions.chiSquareInverse(1 - alpha/2, 2*n);

        const lowerBound = chiLower / (2 * n * mean);
        const upperBound = chiUpper / (2 * n * mean);

        return {
            lowerBound: lowerBound.toFixed(6),
            upperBound: upperBound.toFixed(6),
            interpretation: `95% CI for rate parameter: [${lowerBound.toFixed(6)}, ${upperBound.toFixed(6)}]`
        };
    }

    generateGammaCalculationWalkthrough() {
        const [shape, scale] = this.distributionParams;
        const n = this.statistics.n;
        const mean = this.statistics.mean;
        const variance = this.statistics.variance;

        return {
            parameterEstimation: {
                title: "Method of Moments Estimation for Gamma Distribution",
                steps: [
                    {
                        step: "Step 1: Calculate Sample Moments",
                        formula: "x̄ = Σxᵢ/n, s² = Σ(xᵢ - x̄)²/n",
                        explanation: `Mean = ${mean.toFixed(4)}, Variance = ${variance.toFixed(4)}`
                    },
                    {
                        step: "Step 2: Estimate Shape and Scale",
                        formula: "α̂ = x̄² / s², β̂ = s² / x̄",
                        explanation: `Shape α = (${mean.toFixed(4)}²) / ${variance.toFixed(4)} = ${shape.toFixed(4)}, Scale β = ${variance.toFixed(4)} / ${mean.toFixed(4)} = ${scale.toFixed(4)}`
                    }
                ],
                result: `Gamma(α = ${shape.toFixed(4)}, β = ${scale.toFixed(4)})`
            },
            interpretation: {
                expectedValue: `E[X] = αβ = ${ (shape * scale).toFixed(4) }`,
                variance: `Var[X] = αβ² = ${ (shape * scale * scale).toFixed(4) }`,
                skewness: `Skewness = 2/√α = ${ (2 / Math.sqrt(shape)).toFixed(4) }`
            }
        };
    }

    generateBetaCalculationWalkthrough() {
        const [alpha, beta] = this.distributionParams;
        const n = this.statistics.n;

        return {
            parameterEstimation: {
                title: "Method of Moments for Beta Distribution",
                steps: [
                    {
                        step: "Step 1: Sample Mean and Variance",
                        formula: "x̄ = sample mean, s² = sample variance",
                        explanation: `x̄ = ${this.statistics.mean.toFixed(4)}, s² = ${this.statistics.variance.toFixed(6)}`
                    },
                    {
                        step: "Step 2: Method of Moments Equations",
                        formula: "μ = α/(α+β), σ² = αβ/[(α+β)²(α+β+1)]",
                        explanation: "Solve for α and β using sample moments"
                    },
                    {
                        step: "Step 3: Parameter Solutions",
                        formula: "α = μ × [μ(1-μ)/σ² - 1], β = (1-μ) × [μ(1-μ)/σ² - 1]",
                        explanation: `α = ${alpha.toFixed(4)}, β = ${beta.toFixed(4)}`
                    }
                ],
                result: `Beta(α = ${alpha.toFixed(4)}, β = ${beta.toFixed(4)})`
            },
            properties: {
                title: "Distribution Properties",
                mean: alpha / (alpha + beta),
                variance: (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1)),
                mode: alpha > 1 && beta > 1 ? (alpha - 1)/(alpha + beta - 2) : 'Undefined',
                shape: this.describeBetaShape(alpha, beta)
            }
        };
    }

    generateChiSquareCalculationWalkthrough() {
        const df = this.distributionParams[0];
        const mean = this.statistics.mean;

        return {
            parameterEstimation: {
                title: "Estimation for Chi-Square Distribution",
                steps: [
                    {
                        step: "Step 1: Use Sample Mean",
                        formula: "df ≈ mean (since E[χ²] = df)",
                        explanation: `df ≈ ${mean.toFixed(4)}`
                    },
                    {
                        step: "Step 2: Round to Integer",
                        explanation: `Estimated df = ${df}`
                    }
                ],
                result: `Chi-Square(df = ${df})`
            },
            interpretation: {
                expectedValue: `E[X] = df = ${df}`,
                variance: `Var[X] = 2df = ${2 * df}`,
                skewness: `Skewness = √(8/df) = ${Math.sqrt(8 / df).toFixed(4)}`
            }
        };
    }

    generateFCalculationWalkthrough() {
        const [df1, df2] = this.distributionParams;

        return {
            parameterEstimation: {
                title: "F-Distribution Parameter Estimation",
                steps: [
                    {
                        step: "Note: df1 and df2 typically from study design",
                        explanation: "Not estimated from data in this context"
                    }
                ],
                result: `F(df1 = ${df1}, df2 = ${df2})`
            },
            interpretation: {
                expectedValue: df2 > 2 ? `E[X] = df2/(df2-2) = ${(df2 / (df2 - 2)).toFixed(4)}` : 'Undefined',
                variance: df2 > 4 ? `Var[X] = 2*df2²*(df1+df2-2)/(df1*(df2-2)²*(df2-4))` : 'Undefined'
            }
        };
    }

    generateGenericCalculationWalkthrough() {
        return {
            parameterEstimation: {
                title: "Generic Estimation",
                steps: [
                    {
                        step: "Step 1: Use distribution-specific estimator",
                        explanation: "See code for details"
                    }
                ],
                result: `${this.selectedDistribution} with params ${this.distributionParams.join(', ')}`
            }
        };
    }



// ============================================================================
// DATA GENERATION METHODS FOR VISUALIZATION
// ============================================================================

generateHistogramData(bins = null) {
    const data = [...this.rawSamples].sort((a, b) => a - b);
    const n = data.length;
    
    // Determine optimal number of bins using Sturges' rule if not specified
    if (!bins) {
        bins = Math.ceil(Math.log2(n) + 1);
    }
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    
    // Create bins
    const histogram = {
        bins: [],
        frequencies: [],
        densities: [],
        binEdges: [],
        binCenters: []
    };
    
    for (let i = 0; i < bins; i++) {
        const binStart = min + i * binWidth;
        const binEnd = min + (i + 1) * binWidth;
        const binCenter = (binStart + binEnd) / 2;
        
        // Count frequencies
        const frequency = data.filter(x => 
            x >= binStart && (i === bins - 1 ? x <= binEnd : x < binEnd)
        ).length;
        
        const density = frequency / (n * binWidth);
        
        histogram.bins.push({ start: binStart, end: binEnd, center: binCenter });
        histogram.frequencies.push(frequency);
        histogram.densities.push(density);
        histogram.binEdges.push(binStart);
        histogram.binCenters.push(binCenter);
    }
    histogram.binEdges.push(max);
    
    // Generate theoretical distribution overlay
    const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
    histogram.theoretical = histogram.binCenters.map(x => 
        dist.pdf(x, this.distributionParams)
    );
    
    return {
        ...histogram,
        binWidth,
        totalCount: n,
        title: `Histogram of ${this.variableName}`,
        xLabel: `${this.variableName} (${this.unitName})`,
        yLabel: 'Density',
        distributionName: dist.name
    };
}

generateBoxplotData() {
    const sorted = [...this.rawSamples].sort((a, b) => a - b);
    const n = sorted.length;
    
    const q1 = this.statistics.q1;
    const q2 = this.statistics.median;
    const q3 = this.statistics.q3;
    const iqr = this.statistics.iqr;
    
    // Calculate whiskers (1.5 * IQR rule)
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    
    // Find actual whisker positions (min/max within fences)
    const lowerWhisker = sorted.find(x => x >= lowerFence) || sorted[0];
    const upperWhisker = sorted.reverse().find(x => x <= upperFence) || sorted[0];
    sorted.reverse(); // Restore order
    
    // Identify outliers
    const outliers = sorted.filter(x => x < lowerFence || x > upperFence);
    
    // Identify extreme outliers (3 * IQR)
    const extremeLowerFence = q1 - 3 * iqr;
    const extremeUpperFence = q3 + 3 * iqr;
    const extremeOutliers = outliers.filter(x => 
        x < extremeLowerFence || x > extremeUpperFence
    );
    
    return {
        q1, q2, q3, iqr,
        lowerWhisker,
        upperWhisker,
        outliers,
        extremeOutliers,
        mean: this.statistics.mean,
        min: sorted[0],
        max: sorted[n - 1],
        title: `Box Plot of ${this.variableName}`,
        yLabel: `${this.variableName} (${this.unitName})`,
        distributionName: DistributionRegistry.getDistribution(this.selectedDistribution).name
    };
}

generateQQPlotData() {
    const sorted = [...this.rawSamples].sort((a, b) => a - b);
    const n = sorted.length;
    const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
    
    const qqData = {
        sampleQuantiles: [],
        theoreticalQuantiles: [],
        points: []
    };
    
    for (let i = 0; i < n; i++) {
        // Calculate probability for this rank
        const p = (i + 0.5) / n; // Adjusted rank
        
        // Theoretical quantile from fitted distribution
        const theoreticalQ = dist.inverse(p, this.distributionParams);
        const sampleQ = sorted[i];
        
        qqData.sampleQuantiles.push(sampleQ);
        qqData.theoreticalQuantiles.push(theoreticalQ);
        qqData.points.push({ x: theoreticalQ, y: sampleQ });
    }
    
    // Calculate correlation coefficient for QQ plot
    const correlation = this.pearsonCorrelation(
        qqData.theoreticalQuantiles,
        qqData.sampleQuantiles
    );
    
    // Calculate reference line (y = x)
    const minQ = Math.min(...qqData.theoreticalQuantiles);
    const maxQ = Math.max(...qqData.theoreticalQuantiles);
    
    return {
        ...qqData,
        correlation,
        referenceLine: { start: minQ, end: maxQ },
        title: `Q-Q Plot: ${this.variableName} vs ${dist.name}`,
        xLabel: `Theoretical Quantiles (${dist.name})`,
        yLabel: `Sample Quantiles (${this.unitName})`,
        interpretation: correlation > 0.99 ? 'Excellent fit' :
                       correlation > 0.95 ? 'Good fit' :
                       correlation > 0.90 ? 'Moderate fit' : 'Poor fit'
    };
}

generateDensityPlotData(bandwidth = null) {
    const sorted = [...this.rawSamples].sort((a, b) => a - b);
    const n = sorted.length;
    
    // Silverman's rule of thumb for bandwidth
    if (!bandwidth) {
        const std = this.statistics.standardDeviation;
        bandwidth = 1.06 * std * Math.pow(n, -0.2);
    }
    
    // Generate evaluation points
    const min = Math.min(...sorted);
    const max = Math.max(...sorted);
    const range = max - min;
    const padding = range * 0.1;
    const numPoints = 200;
    
    const evaluationPoints = [];
    const kdeValues = [];
    
    for (let i = 0; i < numPoints; i++) {
        const x = min - padding + (range + 2 * padding) * i / (numPoints - 1);
        evaluationPoints.push(x);
        
        // Gaussian kernel density estimation
        let density = 0;
        for (let j = 0; j < n; j++) {
            const u = (x - sorted[j]) / bandwidth;
            density += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
        }
        density /= (n * bandwidth);
        kdeValues.push(density);
    }
    
    // Generate theoretical density overlay
    const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
    const theoreticalValues = evaluationPoints.map(x => 
        dist.pdf(x, this.distributionParams)
    );
    
    return {
        evaluationPoints,
        kdeValues,
        theoreticalValues,
        bandwidth,
        title: `Kernel Density Estimate: ${this.variableName}`,
        xLabel: `${this.variableName} (${this.unitName})`,
        yLabel: 'Density',
        legend: ['Kernel Density (Sample)', `Theoretical (${dist.name})`]
    };
}

generatePPPlotData() {
    const sorted = [...this.rawSamples].sort((a, b) => a - b);
    const n = sorted.length;
    const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
    
    const ppData = {
        empiricalProbabilities: [],
        theoreticalProbabilities: [],
        points: []
    };
    
    for (let i = 0; i < n; i++) {
        const empiricalP = (i + 0.5) / n;
        const theoreticalP = dist.cdf(sorted[i], this.distributionParams);
        
        ppData.empiricalProbabilities.push(empiricalP);
        ppData.theoreticalProbabilities.push(theoreticalP);
        ppData.points.push({ x: theoreticalP, y: empiricalP });
    }
    
    // Calculate Kolmogorov-Smirnov statistic (max deviation)
    const maxDeviation = Math.max(...ppData.points.map(p => 
        Math.abs(p.y - p.x)
    ));
    
    return {
        ...ppData,
        maxDeviation,
        referenceLine: { start: 0, end: 1 },
        title: `P-P Plot: ${this.variableName} vs ${dist.name}`,
        xLabel: `Theoretical Cumulative Probability (${dist.name})`,
        yLabel: 'Empirical Cumulative Probability',
        ksStatistic: maxDeviation
    };
}

generateResidualPlots(regressionType = 'linear') {
    if (!this.regressionResults[regressionType]) {
        throw new Error(`No ${regressionType} regression results available`);
    }
    
    const regression = this.regressionResults[regressionType];
    const residuals = regression.residuals;
    const predictions = regression.predictions;
    const n = residuals.length;
    
    // 1. Residuals vs Fitted
    const residualsVsFitted = {
        points: predictions.map((fitted, i) => ({
            x: fitted,
            y: residuals[i]
        })),
        title: 'Residuals vs Fitted Values',
        xLabel: 'Fitted Values',
        yLabel: 'Residuals',
        referenceLine: 0
    };
    
    // 2. Normal Q-Q plot of residuals
    const sortedResiduals = [...residuals].sort((a, b) => a - b);
    const qqResiduals = {
        points: sortedResiduals.map((r, i) => {
            const p = (i + 0.5) / n;
            const theoreticalQ = StatisticalDistributions.normalInverse(p, 0, 1);
            return { x: theoreticalQ, y: r };
        }),
        title: 'Normal Q-Q Plot of Residuals',
        xLabel: 'Theoretical Quantiles',
        yLabel: 'Standardized Residuals'
    };
    
    // 3. Scale-Location (sqrt of standardized residuals vs fitted)
    const residualMean = residuals.reduce((a, b) => a + b, 0) / n;
    const residualSD = Math.sqrt(
        residuals.reduce((sum, r) => sum + Math.pow(r - residualMean, 2), 0) / (n - 1)
    );
    
    const scaleLoc = {
        points: predictions.map((fitted, i) => ({
            x: fitted,
            y: Math.sqrt(Math.abs((residuals[i] - residualMean) / residualSD))
        })),
        title: 'Scale-Location Plot',
        xLabel: 'Fitted Values',
        yLabel: '√|Standardized Residuals|'
    };
    
    // 4. Residuals vs Order (for detecting autocorrelation)
    const residualsVsOrder = {
        points: residuals.map((r, i) => ({ x: i + 1, y: r })),
        title: 'Residuals vs Order',
        xLabel: 'Observation Order',
        yLabel: 'Residuals',
        referenceLine: 0
    };
    
    // 5. Histogram of residuals
    const residualHistogram = this.generateHistogramDataForArray(residuals);
    residualHistogram.title = 'Histogram of Residuals';
    
    return {
        residualsVsFitted,
        qqResiduals,
        scaleLoc,
        residualsVsOrder,
        residualHistogram,
        summary: {
            meanResidual: residualMean,
            sdResidual: residualSD,
            interpretation: regression.diagnostics ? regression.diagnostics.normalityTest : null
        }
    };
}

generateHistogramDataForArray(dataArray, bins = null) {
    const sorted = [...dataArray].sort((a, b) => a - b);
    const n = sorted.length;
    
    if (!bins) {
        bins = Math.ceil(Math.log2(n) + 1);
    }
    
    const min = Math.min(...sorted);
    const max = Math.max(...sorted);
    const binWidth = (max - min) / bins;
    
    const histogram = {
        bins: [],
        frequencies: [],
        densities: []
    };
    
    for (let i = 0; i < bins; i++) {
        const binStart = min + i * binWidth;
        const binEnd = min + (i + 1) * binWidth;
        
        const frequency = sorted.filter(x => 
            x >= binStart && (i === bins - 1 ? x <= binEnd : x < binEnd)
        ).length;
        
        histogram.bins.push({ start: binStart, end: binEnd });
        histogram.frequencies.push(frequency);
        histogram.densities.push(frequency / (n * binWidth));
    }
    
    return histogram;
}

generateTimeSeriesPlot() {
    if (!this.timeSeriesAnalysis) {
        throw new Error('No time series analysis available');
    }
    
    const ts = this.timeSeriesAnalysis;
    const n = this.rawSamples.length;
    
    // Original series
    const originalSeries = {
        points: this.rawSamples.map((value, index) => ({ x: index, y: value })),
        label: 'Original Series',
        title: `Time Series: ${this.variableName}`,
        xLabel: 'Time',
        yLabel: this.variableName
    };
    
    // Decomposition plots
    const decomposition = ts.decomposition ? {
        trend: ts.decomposition.trend.map((value, index) => ({ 
            x: index, 
            y: value 
        })).filter(p => p.y !== null),
        seasonal: ts.decomposition.seasonal.map((value, index) => ({ 
            x: index, 
            y: value 
        })).filter(p => p.y !== null),
        residual: ts.decomposition.residual.map((value, index) => ({ 
            x: index, 
            y: value 
        })).filter(p => p.y !== null)
    } : null;
    
    // Forecast
    const forecast = ts.forecast ? {
        historical: this.rawSamples.map((value, index) => ({ x: index, y: value })),
        forecast: ts.forecast.forecast.map((f, i) => ({
            x: n + i,
            y: f.point,
            lower95: f.lower95,
            upper95: f.upper95,
            lower80: f.lower80,
            upper80: f.upper80
        }))
    } : null;
    
    return {
        originalSeries,
        decomposition,
        forecast,
        title: `Time Series Analysis: ${this.variableName}`
    };
}

generateACFPlot() {
    if (!this.timeSeriesAnalysis || !this.timeSeriesAnalysis.autocorrelation) {
        throw new Error('No ACF analysis available');
    }
    
    const acf = this.timeSeriesAnalysis.autocorrelation;
    
    return {
        lags: acf.lags,
        values: acf.values,
        confidenceBound: acf.confidenceBound,
        significantLags: acf.significantLags,
        points: acf.lags.map((lag, i) => ({
            lag: lag,
            acf: acf.values[i],
            significant: Math.abs(acf.values[i]) > acf.confidenceBound
        })),
        title: 'Autocorrelation Function (ACF)',
        xLabel: 'Lag',
        yLabel: 'ACF',
        upperBound: acf.confidenceBound,
        lowerBound: -acf.confidenceBound
    };
}

generatePACFPlot() {
    if (!this.timeSeriesAnalysis || !this.timeSeriesAnalysis.partialAutocorrelation) {
        throw new Error('No PACF analysis available');
    }
    
    const pacf = this.timeSeriesAnalysis.partialAutocorrelation;
    
    return {
        lags: pacf.lags,
        values: pacf.values,
        confidenceBound: pacf.confidenceBound,
        significantLags: pacf.significantLags,
        points: pacf.lags.map((lag, i) => ({
            lag: lag,
            pacf: pacf.values[i],
            significant: Math.abs(pacf.values[i]) > pacf.confidenceBound
        })),
        title: 'Partial Autocorrelation Function (PACF)',
        xLabel: 'Lag',
        yLabel: 'PACF',
        upperBound: pacf.confidenceBound,
        lowerBound: -pacf.confidenceBound
    };
}

// ============================================================================
// CANVAS RENDERING METHODS
// ============================================================================

renderHistogram(histogramData, width = 800, height = 600) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Margins
    const margin = { top: 60, right: 60, bottom: 80, left: 80 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(histogramData.title, width / 2, margin.top / 2);
    
    // Find max density for scaling
    const maxDensity = Math.max(...histogramData.densities, ...histogramData.theoretical);
    
    // Scales
    const xScale = (value) => {
        const min = histogramData.binEdges[0];
        const max = histogramData.binEdges[histogramData.binEdges.length - 1];
        return margin.left + (value - min) / (max - min) * plotWidth;
    };
    
    const yScale = (value) => {
        return margin.top + plotHeight - (value / maxDensity) * plotHeight;
    };
    
    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();
    
    // Draw histogram bars
    ctx.fillStyle = 'rgba(70, 130, 180, 0.6)';
    ctx.strokeStyle = 'rgba(70, 130, 180, 1)';
    ctx.lineWidth = 1;
    
    histogramData.bins.forEach((bin, i) => {
        const x = xScale(bin.start);
        const barWidth = xScale(bin.end) - x;
        const barHeight = plotHeight * (histogramData.densities[i] / maxDensity);
        const y = height - margin.bottom - barHeight;
        
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.strokeRect(x, y, barWidth, barHeight);
    });
    
    // Draw theoretical distribution overlay
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    histogramData.binCenters.forEach((center, i) => {
        const x = xScale(center);
        const y = yScale(histogramData.theoretical[i]);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // X-axis label
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(histogramData.xLabel, width / 2, height - margin.bottom / 3);
    
    // Y-axis label
    ctx.save();
    ctx.translate(margin.left / 3, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(histogramData.yLabel, 0, 0);
    ctx.restore();
    
    // Legend
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    // Sample histogram legend
    ctx.fillStyle = 'rgba(70, 130, 180, 0.6)';
    ctx.fillRect(width - margin.right - 150, margin.top + 10, 20, 15);
    ctx.fillStyle = '#000000';
    ctx.fillText('Sample Data', width - margin.right - 125, margin.top + 22);
    
    // Theoretical curve legend
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width - margin.right - 150, margin.top + 45);
    ctx.lineTo(width - margin.right - 130, margin.top + 45);
    ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.fillText(histogramData.distributionName, width - margin.right - 125, margin.top + 50);
    
    return canvas;
}

renderBoxplot(boxplotData, width = 600, height = 800) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    const margin = { top: 60, right: 60, bottom: 80, left: 80 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(boxplotData.title, width / 2, margin.top / 2);
    
    // Y-scale
    const yMin = boxplotData.min;
    const yMax = boxplotData.max;
    const yRange = yMax - yMin;
    const yPadding = yRange * 0.1;
    
    const yScale = (value) => {
        return height - margin.bottom - 
               ((value - (yMin - yPadding)) / (yRange + 2 * yPadding)) * plotHeight;
    };
    
    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();
    
    // Box center position
    const boxCenter = width / 2;
    const boxWidth = 100;
    
    // Draw whiskers
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Lower whisker
    ctx.beginPath();
    ctx.moveTo(boxCenter, yScale(boxplotData.q1));
    ctx.lineTo(boxCenter, yScale(boxplotData.lowerWhisker));
    ctx.stroke();
    
    // Lower whisker cap
    ctx.beginPath();
    ctx.moveTo(boxCenter - boxWidth / 4, yScale(boxplotData.lowerWhisker));
    ctx.lineTo(boxCenter + boxWidth / 4, yScale(boxplotData.lowerWhisker));
    ctx.stroke();
    
    // Upper whisker
    ctx.beginPath();
    ctx.moveTo(boxCenter, yScale(boxplotData.q3));
    ctx.lineTo(boxCenter, yScale(boxplotData.upperWhisker));
    ctx.stroke();
    
    // Upper whisker cap
    ctx.beginPath();
    ctx.moveTo(boxCenter - boxWidth / 4, yScale(boxplotData.upperWhisker));
    ctx.lineTo(boxCenter + boxWidth / 4, yScale(boxplotData.upperWhisker));
    ctx.stroke();
    
    // Draw box
    ctx.fillStyle = 'rgba(70, 130, 180, 0.3)';
    ctx.strokeStyle = 'rgba(70, 130, 180, 1)';
    ctx.lineWidth = 2;
    
    const boxHeight = yScale(boxplotData.q1) - yScale(boxplotData.q3);
    ctx.fillRect(
        boxCenter - boxWidth / 2,
        yScale(boxplotData.q3),
        boxWidth,
        boxHeight
    );
    ctx.strokeRect(
        boxCenter - boxWidth / 2,
        yScale(boxplotData.q3),
        boxWidth,
        boxHeight
    );
    
    // Draw median line
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(boxCenter - boxWidth / 2, yScale(boxplotData.q2));
    ctx.lineTo(boxCenter + boxWidth / 2, yScale(boxplotData.q2));
    ctx.stroke();
    
    // Draw mean marker
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(boxCenter, yScale(boxplotData.mean), 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw outliers
    ctx.fillStyle = '#000000';
    boxplotData.outliers.forEach(outlier => {
        const isExtreme = boxplotData.extremeOutliers.includes(outlier);
        ctx.beginPath();
        ctx.arc(boxCenter, yScale(outlier), isExtreme ? 4 : 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Y-axis label
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.save();
    ctx.translate(margin.left / 3, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(boxplotData.yLabel, 0, 0);
    ctx.restore();
    
    // Legend
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    const legendX = width - margin.right - 120;
    let legendY = margin.top + 20;
    
    // Median
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 20, legendY);
    ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.fillText('Median', legendX + 25, legendY + 4);
    legendY += 20;
    
    // Mean
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.fillText('Mean', legendX + 25, legendY + 4);
    legendY += 20;
    
    // Outliers
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText('Outliers', legendX + 25, legendY + 4);
    
    return canvas;
}

renderQQPlot(qqData, width = 800, height = 800) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    const margin = { top: 60, right: 60, bottom: 80, left: 80 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(qqData.title, width / 2, margin.top / 2);
    
    // Subtitle with correlation
    ctx.font = '14px Arial';
    ctx.fillText(`Correlation: ${qqData.correlation.toFixed(4)} (${qqData.interpretation})`, 
                 width / 2, margin.top / 2 + 25);
    
    // Find ranges
    const xMin = Math.min(...qqData.theoreticalQuantiles);
    const xMax = Math.max(...qqData.theoreticalQuantiles);
    const yMin = Math.min(...qqData.sampleQuantiles);
    const yMax = Math.max(...qqData.sampleQuantiles);
    
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const xPadding = xRange * 0.1;
    const yPadding = yRange * 0.1;
    
    // Scales
    const xScale = (value) => {
        return margin.left + ((value - (xMin - xPadding)) / (xRange + 2 * xPadding)) * plotWidth;
    };
    
    const yScale = (value) => {
        return height - margin.bottom - 
               ((value - (yMin - yPadding)) / (yRange + 2 * yPadding)) * plotHeight;
    };
    
    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();
    
    // Draw reference line (y = x)
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(xScale(qqData.referenceLine.start), yScale(qqData.referenceLine.start));
    ctx.lineTo(xScale(qqData.referenceLine.end), yScale(qqData.referenceLine.end));
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw points
    ctx.fillStyle = 'rgba(70, 130, 180, 0.6)';
    qqData.points.forEach(point => {
        ctx.beginPath();
        ctx.arc(xScale(point.x), yScale(point.y), 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // X-axis label
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(qqData.xLabel, width / 2, height - margin.bottom / 3);
    
    // Y-axis label
    ctx.save();
    ctx.translate(margin.left / 3, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(qqData.yLabel, 0, 0);
    ctx.restore();
    
    // Legend
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    const legendX = margin.left + 20;
    const legendY = margin.top + 20;
    
    // Sample points
    ctx.fillStyle = 'rgba(70, 130, 180, 0.6)';
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.fillText('Sample Quantiles', legendX + 20, legendY + 4);
    
    // Reference line
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(legendX, legendY + 20);
    ctx.lineTo(legendX + 20, legendY + 20);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#000000';
    ctx.fillText('Reference Line (y=x)', legendX + 25, legendY + 24);
    
    return canvas;
}

renderDensityPlot(densityData, width = 800, height = 600) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    const margin = { top: 60, right: 60, bottom: 80, left: 80 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(densityData.title, width / 2, margin.top / 2);
    
    // Find max density for scaling
    const maxDensity = Math.max(...densityData.kdeValues, ...densityData.theoreticalValues);
    const minX = Math.min(...densityData.evaluationPoints);
    const maxX = Math.max(...densityData.evaluationPoints);
    
    // Scales
    const xScale = (value) => {
        return margin.left + ((value - minX) / (maxX - minX)) * plotWidth;
    };
    
    const yScale = (value) => {
        return height - margin.bottom - (value / maxDensity) * plotHeight;
    };
    
    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();
    
    // Draw KDE curve
    ctx.strokeStyle = 'rgba(70, 130, 180, 1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    densityData.evaluationPoints.forEach((x, i) => {
        const plotX = xScale(x);
        const plotY = yScale(densityData.kdeValues[i]);
        if (i === 0) {
            ctx.moveTo(plotX, plotY);
        } else {
            ctx.lineTo(plotX, plotY);
        }
    });
    ctx.stroke();
    
    // Draw theoretical curve
    ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    densityData.evaluationPoints.forEach((x, i) => {
        const plotX = xScale(x);
        const plotY = yScale(densityData.theoreticalValues[i]);
        if (i === 0) {
            ctx.moveTo(plotX, plotY);
        } else {
            ctx.lineTo(plotX, plotY);
        }
    });
    ctx.stroke();
    ctx.setLineDash([]);
    
    // X-axis label
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(densityData.xLabel, width / 2, height - margin.bottom / 3);
    
    // Y-axis label
    ctx.save();
    ctx.translate(margin.left / 3, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(densityData.yLabel, 0, 0);
    ctx.restore();
    
    // Legend
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    const legendX = width - margin.right - 180;
    let legendY = margin.top + 20;
    
    // KDE line
    ctx.strokeStyle = 'rgba(70, 130, 180, 1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 30, legendY);
    ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.fillText(densityData.legend[0], legendX + 35, legendY + 4);
    legendY += 20;
    
    // Theoretical line
    ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 30, legendY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText(densityData.legend[1], legendX + 35, legendY + 4);
    
    return canvas;
}

renderPPPlot(ppData, width = 800, height = 800) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    const margin = { top: 60, right: 60, bottom: 80, left: 80 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(ppData.title, width / 2, margin.top / 2);
    
    // Subtitle with K-S statistic
    ctx.font = '14px Arial';
    ctx.fillText(`K-S Statistic: ${ppData.ksStatistic.toFixed(4)}`, width / 2, margin.top / 2 + 25);
    
    // Scales (0 to 1 for both axes)
    const xScale = (value) => margin.left + value * plotWidth;
    const yScale = (value) => height - margin.bottom - value * plotHeight;
    
    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();
    
    // Draw reference line (y = x)
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(0));
    ctx.lineTo(xScale(1), yScale(1));
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw points
    ctx.fillStyle = 'rgba(70, 130, 180, 0.6)';
    ppData.points.forEach(point => {
        ctx.beginPath();
        ctx.arc(xScale(point.x), yScale(point.y), 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // X-axis label
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(ppData.xLabel, width / 2, height - margin.bottom / 3);
    
    // Y-axis label
    ctx.save();
    ctx.translate(margin.left / 3, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(ppData.yLabel, 0, 0);
    ctx.restore();
    
    return canvas;
}

renderResidualPlots(residualPlotsData, width = 800, height = 600) {
    // This renders a 2x2 grid of residual diagnostic plots
    const canvas = createCanvas(width * 2, height * 2);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width * 2, height * 2);
    
    // Main title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Residual Diagnostic Plots', width, 30);
    
    // Render each subplot
    const plots = [
        { data: residualPlotsData.residualsVsFitted, x: 0, y: 60 },
        { data: residualPlotsData.qqResiduals, x: width, y: 60 },
        { data: residualPlotsData.scaleLoc, x: 0, y: height + 60 },
        { data: residualPlotsData.residualsVsOrder, x: width, y: height + 60 }
    ];
    
    plots.forEach(plot => {
        this.renderScatterPlot(ctx, plot.data, plot.x, plot.y, width - 20, height - 80);
    });
    
    return canvas;
}

renderScatterPlot(ctx, plotData, offsetX, offsetY, width, height) {
    const margin = { top: 40, right: 20, bottom: 40, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    // Find ranges
    const xValues = plotData.points.map(p => p.x);
    const yValues = plotData.points.map(p => p.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const xPadding = xRange * 0.1;
    const yPadding = yRange * 0.1;
    
    // Scales
    const xScale = (value) => {
        return offsetX + margin.left + 
               ((value - (xMin - xPadding)) / (xRange + 2 * xPadding)) * plotWidth;
    };
    
    const yScale = (value) => {
        return offsetY + margin.top + plotHeight - 
               ((value - (yMin - yPadding)) / (yRange + 2 * yPadding)) * plotHeight;
    };
    
    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(plotData.title, offsetX + width / 2, offsetY + 20);
    
    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(offsetX + margin.left, offsetY + margin.top);
    ctx.lineTo(offsetX + margin.left, offsetY + margin.top + plotHeight);
    ctx.lineTo(offsetX + margin.left + plotWidth, offsetY + margin.top + plotHeight);
    ctx.stroke();
    
    // Draw reference line if specified (e.g., y = 0)
    if (plotData.referenceLine !== undefined) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(offsetX + margin.left, yScale(plotData.referenceLine));
        ctx.lineTo(offsetX + margin.left + plotWidth, yScale(plotData.referenceLine));
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Draw points
    ctx.fillStyle = 'rgba(70, 130, 180, 0.6)';
    plotData.points.forEach(point => {
        ctx.beginPath();
        ctx.arc(xScale(point.x), yScale(point.y), 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // X-axis label
    ctx.fillStyle = '#000000';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(plotData.xLabel, offsetX + width / 2, offsetY + height - 10);
    
    // Y-axis label
    ctx.save();
    ctx.translate(offsetX + 15, offsetY + height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(plotData.yLabel, 0, 0);
    ctx.restore();
}

renderACFPlot(acfData, width = 800, height = 600) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    const margin = { top: 60, right: 60, bottom: 80, left: 80 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(acfData.title, width / 2, margin.top / 2);
    
    const maxLag = Math.max(...acfData.lags);
    
    // Scales
    const xScale = (lag) => margin.left + (lag / maxLag) * plotWidth;
    const yScale = (value) => {
        return height - margin.bottom - ((value + 1) / 2) * plotHeight;
    };
    
    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();
    
    // Draw zero line
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, yScale(0));
    ctx.lineTo(width - margin.right, yScale(0));
    ctx.stroke();
    
    // Draw confidence bounds
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(margin.left, yScale(acfData.upperBound));
    ctx.lineTo(width - margin.right, yScale(acfData.upperBound));
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(margin.left, yScale(acfData.lowerBound));
    ctx.lineTo(width - margin.right, yScale(acfData.lowerBound));
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw ACF bars
    acfData.points.forEach(point => {
        const x = xScale(point.lag);
        const y0 = yScale(0);
        const y1 = yScale(point.acf);
        
        ctx.strokeStyle = point.significant ? 'rgba(255, 0, 0, 0.8)' : 'rgba(70, 130, 180, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y0);
        ctx.lineTo(x, y1);
        ctx.stroke();
    });
    
    // X-axis label
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(acfData.xLabel, width / 2, height - margin.bottom / 3);
    
    // Y-axis label
    ctx.save();
    ctx.translate(margin.left / 3, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(acfData.yLabel, 0, 0);
    ctx.restore();
    
    // Legend
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    const legendX = width - margin.right - 150;
    let legendY = margin.top + 20;
    
    // Significant lags
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 20, legendY);
    ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.fillText('Significant', legendX + 25, legendY + 4);
    legendY += 20;
    
    // Non-significant lags
    ctx.strokeStyle = 'rgba(70, 130, 180, 0.8)';
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 20, legendY);
    ctx.stroke();
    ctx.fillText('Non-significant', legendX + 25, legendY + 4);
    legendY += 20;
    
    // Confidence bounds
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 20, legendY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText('95% Confidence', legendX + 25, legendY + 4);
    
    return canvas;
}

renderPACFPlot(pacfData, width = 800, height = 600) {
    // PACF plot is nearly identical to ACF plot, just with different title/data
    return this.renderACFPlot(pacfData, width, height);
}

renderTimeSeriesPlot(tsData, width = 1200, height = 800) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Main title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(tsData.title, width / 2, 30);
    
    // If we have decomposition, create a 3-panel plot
    if (tsData.decomposition) {
        const plotHeight = (height - 100) / 3;
        
        // Original series
        this.renderLinePlot(ctx, tsData.originalSeries.points, 
                          'Original Series', 0, 60, width, plotHeight);
        
        // Trend
        this.renderLinePlot(ctx, tsData.decomposition.trend, 
                          'Trend Component', 0, 60 + plotHeight, width, plotHeight);
        
        // Seasonal
        this.renderLinePlot(ctx, tsData.decomposition.seasonal, 
                          'Seasonal Component', 0, 60 + 2 * plotHeight, width, plotHeight);
    } else {
        // Just plot the original series
        this.renderLinePlot(ctx, tsData.originalSeries.points, 
                          tsData.originalSeries.title, 0, 60, width, height - 100);
    }
    
    return canvas;
}

renderLinePlot(ctx, points, title, offsetX, offsetY, width, height) {
    const margin = { top: 40, right: 40, bottom: 40, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    if (points.length === 0) return;
    
    // Find ranges
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;
    
    // Scales
    const xScale = (value) => offsetX + margin.left + ((value - xMin) / xRange) * plotWidth;
    const yScale = (value) => offsetY + margin.top + plotHeight - ((value - yMin) / yRange) * plotHeight;
    
    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, offsetX + width / 2, offsetY + 20);
    
    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(offsetX + margin.left, offsetY + margin.top);
    ctx.lineTo(offsetX + margin.left, offsetY + margin.top + plotHeight);
    ctx.lineTo(offsetX + margin.left + plotWidth, offsetY + margin.top + plotHeight);
    ctx.stroke();
    
    // Draw line
    ctx.strokeStyle = 'rgba(70, 130, 180, 1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((point, i) => {
        const x = xScale(point.x);
        const y = yScale(point.y);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
}

// ============================================================================
// BATCH VISUALIZATION GENERATION
// ============================================================================

generateAllVisualizations() {
    const visualizations = {};
    
    // Always generate these
    visualizations.histogram = this.generateHistogramData();
    visualizations.boxplot = this.generateBoxplotData();
    visualizations.qqplot = this.generateQQPlotData();
    visualizations.densityplot = this.generateDensityPlotData();
    visualizations.ppplot = this.generatePPPlotData();
    
    // Conditional visualizations
    if (this.regressionResults && Object.keys(this.regressionResults).length > 0) {
        Object.keys(this.regressionResults).forEach(regType => {
            try {
                visualizations[`residuals_${regType}`] = this.generateResidualPlots(regType);
            } catch (e) {
                console.warn(`Could not generate residual plots for ${regType}:`, e.message);
            }
        });
    }
    
    if (this.timeSeriesAnalysis && Object.keys(this.timeSeriesAnalysis).length > 0) {
        try {
            visualizations.timeseries = this.generateTimeSeriesPlot();
            visualizations.acf = this.generateACFPlot();
            visualizations.pacf = this.generatePACFPlot();
        } catch (e) {
            console.warn('Could not generate time series plots:', e.message);
        }
    }
    
    this.visualizations = visualizations;
    return visualizations;
}

async saveAllVisualizations(outputDir = './visualizations') {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate all visualizations if not already done
    if (!this.visualizations) {
        this.generateAllVisualizations();
    }
    
    const savedFiles = [];
    
    // Render and save each visualization
    for (const [name, data] of Object.entries(this.visualizations)) {
        try {
            let canvas;
            const filename = path.join(outputDir, `${this.sampleName}_${name}.png`);
            
            switch(name) {
                case 'histogram':
                    canvas = this.renderHistogram(data);
                    break;
                case 'boxplot':
                    canvas = this.renderBoxplot(data);
                    break;
                case 'qqplot':
                    canvas = this.renderQQPlot(data);
                    break;
                case 'densityplot':
                    canvas = this.renderDensityPlot(data);
                    break;
                case 'ppplot':
                    canvas = this.renderPPPlot(data);
                    break;
                case 'acf':
                    canvas = this.renderACFPlot(data);
                    break;
                case 'pacf':
                    canvas = this.renderPACFPlot(data);
                    break;
                case 'timeseries':
                    canvas = this.renderTimeSeriesPlot(data);
                    break;
                default:
                    if (name.startsWith('residuals_')) {
                        canvas = this.renderResidualPlots(data);
                    }
            }
            
            if (canvas) {
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync(filename, buffer);
                savedFiles.push(filename);
                console.log(`Saved: ${filename}`);
            }
        } catch (e) {
            console.error(`Error saving ${name}:`, e.message);
        }
    }
    
    return savedFiles;
}

// ============================================================================
// ADD VISUALIZATIONS TO WORKBOOK
// ============================================================================

generateVisualizationsSection() {
    const data = [];
    
    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'VISUALIZATIONS GENERATED', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);
    
    data.push([
        { value: 'Note: Visual plots have been generated as PNG files', type: 'data' },
        { value: '', type: 'data' },
        { value: '', type: 'data' },
        { value: '', type: 'data' }
    ]);
    
    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'Plot Type', type: 'header' },
        { value: 'Description', type: 'header' },
        { value: 'Status', type: 'header' },
        { value: '', type: 'header' }
    ]);
    
    const plots = [
        { name: 'Histogram', desc: 'Frequency distribution with theoretical overlay' },
        { name: 'Box Plot', desc: 'Five-number summary with outliers' },
        { name: 'Q-Q Plot', desc: 'Quantile-quantile comparison' },
        { name: 'Density Plot', desc: 'Kernel density estimation vs theoretical' },
        { name: 'P-P Plot', desc: 'Probability-probability comparison' }
    ];
    
    if (this.regressionResults && Object.keys(this.regressionResults).length > 0) {
        plots.push({ name: 'Residual Plots', desc: 'Regression diagnostics (4-panel)' });
    }
    
    if (this.timeSeriesAnalysis) {
        plots.push(
            { name: 'Time Series', desc: 'Original series with decomposition' },
            { name: 'ACF Plot', desc: 'Autocorrelation function' },
            { name: 'PACF Plot', desc: 'Partial autocorrelation function' }
        );
    }
    
    plots.forEach(plot => {
        data.push([
            { value: plot.name, type: 'label' },
            { value: plot.desc, type: 'data' },
            { value: '✓ Generated', type: 'result' },
            { value: '', type: 'data' }
        ]);
    });
    
    // Add file locations
    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'Output Location:', type: 'label' },
        { value: './visualizations/', type: 'data' },
        { value: '', type: 'data' },
        { value: '', type: 'data' }
    ]);
    
    data.push([
        { value: 'File Format:', type: 'label' },
        { value: 'PNG (Portable Network Graphics)', type: 'data' },
        { value: '', type: 'data' },
        { value: '', type: 'data' }
    ]);
    
    return data;
}

// Update generateWorkbook() to include visualizations section
// Add this line after generateRegressionSection():
// data.push(...this.generateVisualizationsSection());

// ============================================================================
// EMBED IMAGES IN EXCEL WORKBOOK
// ============================================================================

async generateXLSXWithImages(filename = 'workbook_with_images.xlsx') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Analysis');
    
    // Add all the text data rows first
    this.currentWorkbook.forEach((row, rowIndex) => {
        const excelRow = sheet.getRow(rowIndex + 1);
        row.forEach((cell, colIndex) => {
            const excelCell = excelRow.getCell(colIndex + 1);
            excelCell.value = cell.value;
            
            // Apply styling based on cell type
            switch (cell.type) {
                case 'header':
                    excelCell.fill = { 
                        type: 'pattern', 
                        pattern: 'solid', 
                        fgColor: { argb: 'FF4472C4' } 
                    };
                    excelCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
                    break;
                case 'section':
                    excelCell.fill = { 
                        type: 'pattern', 
                        pattern: 'solid', 
                        fgColor: { argb: 'FFD9E2F3' } 
                    };
                    excelCell.font = { bold: true };
                    break;
                case 'result':
                    excelCell.fill = { 
                        type: 'pattern', 
                        pattern: 'solid', 
                        fgColor: { argb: 'FFE2EFDA' } 
                    };
                    break;
                case 'formula':
                    excelCell.fill = { 
                        type: 'pattern', 
                        pattern: 'solid', 
                        fgColor: { argb: 'FFFFF2CC' } 
                    };
                    excelCell.font = { color: { argb: 'FF7F6000' } };
                    break;
                case 'label':
                    excelCell.font = { bold: true };
                    break;
            }
            
            excelCell.border = {
                top: { style: 'thin', color: { argb: 'FF808080' } },
                left: { style: 'thin', color: { argb: 'FF808080' } },
                bottom: { style: 'thin', color: { argb: 'FF808080' } },
                right: { style: 'thin', color: { argb: 'FF808080' } }
            };
        });
        excelRow.commit();
    });
    
    // Auto-width columns
    sheet.columns.forEach(column => {
        column.width = 30;
    });
    
    // Create a separate sheet for visualizations
    const vizSheet = workbook.addWorksheet('Visualizations');
    
    // Generate visualizations if not already done
    if (!this.visualizations) {
        this.generateAllVisualizations();
    }
    
    let currentRow = 1;
    
    // Add each visualization to the sheet
    for (const [name, data] of Object.entries(this.visualizations)) {
        try {
            let canvas;
            
            switch(name) {
                case 'histogram':
                    canvas = this.renderHistogram(data);
                    break;
                case 'boxplot':
                    canvas = this.renderBoxplot(data);
                    break;
                case 'qqplot':
                    canvas = this.renderQQPlot(data);
                    break;
                case 'densityplot':
                    canvas = this.renderDensityPlot(data);
                    break;
                case 'ppplot':
                    canvas = this.renderPPPlot(data);
                    break;
                case 'acf':
                    canvas = this.renderACFPlot(data);
                    break;
                case 'pacf':
                    canvas = this.renderPACFPlot(data);
                    break;
                case 'timeseries':
                    canvas = this.renderTimeSeriesPlot(data);
                    break;
                default:
                    if (name.startsWith('residuals_')) {
                        canvas = this.renderResidualPlots(data);
                    }
            }
            
            if (canvas) {
                // Convert canvas to buffer
                const imageBuffer = canvas.toBuffer('image/png');
                
                // Add image to workbook
                const imageId = workbook.addImage({
                    buffer: imageBuffer,
                    extension: 'png',
                });
                
                // Add title for the plot
                vizSheet.getCell(`A${currentRow}`).value = name.toUpperCase().replace(/_/g, ' ');
                vizSheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
                currentRow += 2;
                
                // Embed image
                vizSheet.addImage(imageId, {
                    tl: { col: 0, row: currentRow },
                    ext: { width: canvas.width / 2, height: canvas.height / 2 }
                });
                
                // Move to next position (leave space for image)
                currentRow += Math.ceil(canvas.height / 2 / 20) + 3;
            }
        } catch (e) {
            console.error(`Error adding ${name} to workbook:`, e.message);
        }
    }
    
    // Save workbook
    await workbook.xlsx.writeFile(filename);
    console.log(`Workbook with images saved: ${filename}`);
    return filename;
}

// ============================================================================
// SUMMARY VISUALIZATION REPORT
// ============================================================================

generateVisualizationSummary() {
    if (!this.visualizations) {
        this.generateAllVisualizations();
    }
    
    const summary = {
        totalVisualizations: Object.keys(this.visualizations).length,
        visualizationList: [],
        recommendations: []
    };
    
    // Histogram analysis
    if (this.visualizations.histogram) {
        const hist = this.visualizations.histogram;
        summary.visualizationList.push({
            name: 'Histogram',
            insight: `Distribution shows ${hist.binCenters.length} bins with theoretical ${hist.distributionName} overlay`
        });
    }
    
    // Boxplot analysis
    if (this.visualizations.boxplot) {
        const box = this.visualizations.boxplot;
        summary.visualizationList.push({
            name: 'Box Plot',
            insight: `Identified ${box.outliers.length} outlier(s), IQR = ${box.iqr.toFixed(2)}`
        });
        
        if (box.outliers.length > 0) {
            summary.recommendations.push(
                `${box.outliers.length} outlier(s) detected. Consider robust methods or investigate data quality.`
            );
        }
    }
    
    // Q-Q plot analysis
    if (this.visualizations.qqplot) {
        const qq = this.visualizations.qqplot;
        summary.visualizationList.push({
            name: 'Q-Q Plot',
            insight: `Correlation = ${qq.correlation.toFixed(4)} - ${qq.interpretation}`
        });
        
        if (qq.correlation < 0.95) {
            summary.recommendations.push(
                `Q-Q plot shows poor fit (r = ${qq.correlation.toFixed(3)}). Consider alternative distribution.`
            );
        }
    }
    
    // Density plot analysis
    if (this.visualizations.densityplot) {
        summary.visualizationList.push({
            name: 'Density Plot',
            insight: `Kernel density estimation with bandwidth = ${this.visualizations.densityplot.bandwidth.toFixed(4)}`
        });
    }
    
    // P-P plot analysis
    if (this.visualizations.ppplot) {
        const pp = this.visualizations.ppplot;
        summary.visualizationList.push({
            name: 'P-P Plot',
            insight: `Maximum deviation (K-S) = ${pp.ksStatistic.toFixed(4)}`
        });
    }
    
    // Residual plots analysis
    Object.keys(this.visualizations).forEach(key => {
        if (key.startsWith('residuals_')) {
            const regType = key.replace('residuals_', '');
            summary.visualizationList.push({
                name: `Residual Plots (${regType})`,
                insight: 'Four-panel diagnostic plot for regression assumptions'
            });
        }
    });
    
    // Time series plots analysis
    if (this.visualizations.timeseries) {
        summary.visualizationList.push({
            name: 'Time Series',
            insight: 'Original series with trend and seasonal decomposition'
        });
    }
    
    if (this.visualizations.acf) {
        const acf = this.visualizations.acf;
        const sigLags = acf.significantLags.length;
        summary.visualizationList.push({
            name: 'ACF Plot',
            insight: `${sigLags} significant lag(s) detected`
        });
        
        if (sigLags > 0) {
            summary.recommendations.push(
                `ACF shows ${sigLags} significant lag(s). Consider AR component in time series model.`
            );
        }
    }
    
    if (this.visualizations.pacf) {
        const pacf = this.visualizations.pacf;
        const sigLags = pacf.significantLags.length;
        summary.visualizationList.push({
            name: 'PACF Plot',
            insight: `${sigLags} significant lag(s) detected`
        });
        
        if (sigLags > 0) {
            summary.recommendations.push(
                `PACF shows ${sigLags} significant lag(s). Suggests AR(${sigLags}) model.`
            );
        }
    }
    
    return summary;
}


generateWorkbook() {
    const data = [];

    // Core sections (existing)
    data.push(...this.generateHeaderSection());
    data.push(...this.generateValidationSection());
    data.push(...this.generateSampleDataSection());
    data.push(...this.generateBasicStatisticsSection());
    data.push(...this.generateRobustStatisticsSection());
    
    // Distribution analysis sections
    data.push(...this.generateParameterEstimationSection());
    data.push(...this.generateParameterConfidenceIntervalsSection());
    data.push(...this.generateDistributionAnalysisSection());
    data.push(...this.generateDistributionPropertiesSection());

    // Target analysis (conditional)
    if (this.targetAnalysis && Object.keys(this.targetAnalysis).length > 0) {
        data.push(...this.generateDistributionTargetAnalysisSection());
    }

    // Statistical tests sections
    if (this.hypothesisTests && Object.keys(this.hypothesisTests).length > 0) {
        data.push(...this.generateHypothesisTestsSection());
    }

    if (this.nonParametricTests && Object.keys(this.nonParametricTests).length > 0) {
        data.push(...this.generateNonParametricTestsSection());
    }

    if (this.effectSizes && Object.keys(this.effectSizes).length > 0) {
        data.push(...this.generateEffectSizesSection());
    }

    // Goodness of fit
    data.push(...this.generateGoodnessOfFitSection());
    data.push(...this.generateDistributionCalculationWalkthroughSection());
    data.push(...this.generateConfidenceIntervalsSection());
    
    // Distribution comparison (conditional)
    if (Object.keys(this.comparisonResults).length > 0) {
        data.push(...this.generateComparisonSection());
    }

    // Advanced analyses sections
    if (this.regressionResults && Object.keys(this.regressionResults).length > 0) {
        data.push(...this.generateRegressionSection());
    }

    if (this.bayesianAnalysis && Object.keys(this.bayesianAnalysis).length > 0) {
        data.push(...this.generateBayesianAnalysisSection());
    }

    if (this.powerAnalysis && Object.keys(this.powerAnalysis).length > 0) {
        data.push(...this.generatePowerAnalysisSection());
    }

    if (this.metaAnalysis && Object.keys(this.metaAnalysis).length > 0) {
        data.push(...this.generateMetaAnalysisSection());
    }

    if (this.timeSeriesAnalysis && Object.keys(this.timeSeriesAnalysis).length > 0) {
        data.push(...this.generateTimeSeriesAnalysisSection());
    }

    if (this.multivariateAnalysis && Object.keys(this.multivariateAnalysis).length > 0) {
        data.push(...this.generateMultivariateAnalysisSection());
    }

    if (this.missingDataAnalysis && Object.keys(this.missingDataAnalysis).length > 0) {
        data.push(...this.generateMissingDataAnalysisSection());
    }

    // ** ADD VISUALIZATIONS SECTION HERE **
    data.push(...this.generateVisualizationsSection());

    // Recommendations and summary
    data.push(...this.generatePracticalRecommendationsSection());
    data.push(...this.generateAnalysisSummarySection());

    this.currentWorkbook = data;
}




    // Enhanced Workbook Template Generation



// ============================================================================
// NEW WORKBOOK SECTION GENERATORS
// ============================================================================

generateValidationSection() {
    const data = [];
    const validation = this.validationResults;

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'DATA VALIDATION & QUALITY ASSESSMENT', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    data.push([
        { value: 'Data Quality Score:', type: 'label' },
        { value: `${validation.dataQuality.score}/100`, type: 'result' },
        { value: validation.dataQuality.rating, type: 'data' },
        { value: '', type: 'data' }
    ]);

    data.push([
        { value: 'Status:', type: 'label' },
        { value: validation.isValid ? 'VALID' : 'ISSUES DETECTED', type: validation.isValid ? 'result' : 'error' },
        { value: '', type: 'data' },
        { value: '', type: 'data' }
    ]);

    if (validation.issues && validation.issues.length > 0) {
        data.push([
            { value: 'Issues:', type: 'label' },
            { value: '', type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);
        validation.issues.forEach(issue => {
            data.push([
                { value: '⚠', type: 'data' },
                { value: issue, type: 'error' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        });
    }

    if (validation.warnings && validation.warnings.length > 0) {
        data.push([
            { value: 'Warnings:', type: 'label' },
            { value: '', type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);
        validation.warnings.forEach(warning => {
            data.push([
                { value: '⚡', type: 'data' },
                { value: warning, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        });
    }

    return data;
}

generateRobustStatisticsSection() {
    const data = [];
    const robust = this.robustStatistics;

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'ROBUST STATISTICS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    data.push([
        { value: 'Median (50th percentile):', type: 'label' },
        { value: robust.median.toFixed(4), type: 'result' },
        { value: 'Robust central tendency', type: 'data' },
        { value: '', type: 'data' }
    ]);

    if (robust.mad) {
        data.push([
            { value: 'MAD (Median Absolute Deviation):', type: 'label' },
            { value: robust.mad.value.toFixed(4), type: 'result' },
            { value: 'Robust scale estimate', type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([
            { value: 'Scaled MAD (comparable to SD):', type: 'label' },
            { value: robust.mad.scaledMAD.toFixed(4), type: 'result' },
            { value: robust.mad.interpretation, type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    if (robust.trimmedMean) {
        data.push([
            { value: `Trimmed Mean (${(robust.trimmedMean.trimProportion*100).toFixed(0)}%):`, type: 'label' },
            { value: robust.trimmedMean.value.toFixed(4), type: 'result' },
            { value: robust.trimmedMean.interpretation, type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    if (robust.outlierDetection) {
        const outliers = robust.outlierDetection;
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'OUTLIER DETECTION', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        data.push([
            { value: 'Method:', type: 'label' },
            { value: outliers.method, type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([
            { value: 'Outliers Detected:', type: 'label' },
            { value: outliers.outlierCount.toString(), type: 'result' },
            { value: outliers.outlierPercentage, type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([
            { value: 'Recommendation:', type: 'label' },
            { value: outliers.recommendation, type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    return data;
}

generateRegressionSection() {
    const data = [];

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'REGRESSION ANALYSIS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    Object.entries(this.regressionResults).forEach(([modelType, results]) => {
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: results.type.toUpperCase(), type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        // Model equation
        if (results.equation) {
            data.push([
                { value: 'Equation:', type: 'label' },
                { value: results.equation, type: 'formula' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        // Coefficients
        data.push([
            { value: 'Coefficient', type: 'header' },
            { value: 'Estimate', type: 'header' },
            { value: 'Std Error', type: 'header' },
            { value: 'P-Value', type: 'header' }
        ]);

        results.coefficients.forEach(coef => {
            data.push([
                { value: coef.name, type: 'label' },
                { value: coef.value.toFixed(4), type: 'result' },
                { value: coef.stdError ? coef.stdError.toFixed(4) : 'N/A', type: 'data' },
                { value: coef.pValue ? coef.pValue.toFixed(6) : 'N/A', type: 'data' }
            ]);
        });

        // Model fit
        if (results.modelFit) {
            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
            data.push([
                { value: 'MODEL FIT STATISTICS', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);

            if (results.modelFit.rSquared !== undefined) {
                data.push([
                    { value: 'R-squared:', type: 'label' },
                    { value: results.modelFit.rSquared.toFixed(4), type: 'result' },
                    { value: `${(results.modelFit.rSquared * 100).toFixed(2)}% variance explained`, type: 'data' },
                    { value: '', type: 'data' }
                ]);
            }

            if (results.modelFit.RMSE !== undefined) {
                data.push([
                    { value: 'RMSE:', type: 'label' },
                    { value: results.modelFit.RMSE.toFixed(4), type: 'result' },
                    { value: 'Root Mean Square Error', type: 'data' },
                    { value: '', type: 'data' }
                ]);
            }

            if (results.modelFit.AIC !== undefined) {
                data.push([
                    { value: 'AIC:', type: 'label' },
                    { value: results.modelFit.AIC.toFixed(2), type: 'result' },
                    { value: 'Lower is better', type: 'data' },
                    { value: '', type: 'data' }
                ]);
            }
        }

        // Regularization info
        if (results.regularization) {
            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
            data.push([
                { value: 'REGULARIZATION', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);

            data.push([
                { value: 'Lambda:', type: 'label' },
                { value: results.regularization.lambda.toFixed(4), type: 'result' },
                { value: results.regularization.interpretation, type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        // Variable selection (for Lasso/Elastic Net)
        if (results.variableSelection) {
            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
            data.push([
                { value: 'Variables Selected:', type: 'label' },
                { value: `${results.variableSelection.selectedVariables}/${results.variableSelection.totalVariables}`, type: 'result' },
                { value: `Sparsity: ${results.variableSelection.sparsity}`, type: 'data' },
                { value: '', type: 'data' }
            ]);
        }
    });

    return data;
}

generateTimeSeriesAnalysisSection() {
    const data = [];
    const ts = this.timeSeriesAnalysis;

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'TIME SERIES ANALYSIS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    // Stationarity test
    if (ts.stationarity) {
        data.push([
            { value: 'STATIONARITY TEST', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        data.push([
            { value: 'Test:', type: 'label' },
            { value: ts.stationarity.test, type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([
            { value: 'Test Statistic:', type: 'label' },
            { value: ts.stationarity.testStatistic.toFixed(4), type: 'result' },
            { value: ts.stationarity.isStationary ? 'Stationary' : 'Non-stationary', type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([
            { value: 'Recommendation:', type: 'label' },
            { value: ts.stationarity.recommendation, type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    // ARIMA model
    if (ts.arima) {
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'ARIMA MODEL', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        data.push([
            { value: 'Model Order:', type: 'label' },
            { value: `ARIMA(${ts.arima.order.p}, ${ts.arima.order.d}, ${ts.arima.order.q})`, type: 'result' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);

        if (ts.arima.diagnostics) {
            data.push([
                { value: 'AIC:', type: 'label' },
                { value: ts.arima.diagnostics.AIC.toFixed(2), type: 'result' },
                { value: 'Model selection criterion', type: 'data' },
                { value: '', type: 'data' }
            ]);

            data.push([
                { value: 'RMSE:', type: 'label' },
                { value: ts.arima.diagnostics.RMSE.toFixed(4), type: 'result' },
                { value: 'Forecast accuracy', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        if (ts.arima.interpretation) {
            data.push([
                { value: 'Interpretation:', type: 'label' },
                { value: ts.arima.interpretation, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }
    }

    // Forecast
    if (ts.forecast) {
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'FORECAST', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        data.push([
            { value: 'Method:', type: 'label' },
            { value: ts.forecast.method, type: 'data' },
            { value: `Horizon: ${ts.forecast.horizon} periods`, type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    return data;
}

generateBayesianAnalysisSection() {
    const data = [];
    const bayes = this.bayesianAnalysis;

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'BAYESIAN ANALYSIS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    if (bayes.prior) {
        data.push([
            { value: 'Prior Distribution:', type: 'label' },
            { value: bayes.prior.distribution, type: 'data' },
            { value: `Parameters: ${bayes.prior.parameters.join(', ')}`, type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    if (bayes.posterior) {
        data.push([
            { value: 'Posterior Distribution:', type: 'label' },
            { value: bayes.posterior.distribution, type: 'result' },
            { value: bayes.posterior.interpretation, type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    if (bayes.credibleIntervals) {
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'CREDIBLE INTERVALS', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        Object.entries(bayes.credibleIntervals).forEach(([level, ci]) => {
            data.push([
                { value: `${(level*100).toFixed(0)}% CI:`, type: 'label' },
                { value: `[${ci.lower.toFixed(4)}, ${ci.upper.toFixed(4)}]`, type: 'result' },
                { value: ci.interpretation, type: 'data' },
                { value: '', type: 'data' }
            ]);
        });
    }

    return data;
}

generatePowerAnalysisSection() {
    const data = [];
    const power = this.powerAnalysis;

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'POWER ANALYSIS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    data.push([
        { value: 'Effect Size:', type: 'label' },
        { value: power.inputParameters.effectSize.toFixed(3), type: 'result' },
        { value: '', type: 'data' },
        { value: '', type: 'data' }
    ]);

    data.push([
        { value: 'Significance Level (α):', type: 'label' },
        { value: power.inputParameters.alpha.toFixed(3), type: 'result' },
        { value: '', type: 'data' },
        { value: '', type: 'data' }
    ]);

    data.push([
        { value: 'Current Power:', type: 'label' },
        { value: power.currentPower.power.toFixed(3), type: 'result' },
        { value: power.currentPower.interpretation, type: 'data' },
        { value: '', type: 'data' }
    ]);

    data.push([
        { value: 'Required Sample Size:', type: 'label' },
        { value: power.requiredSampleSize.toString(), type: 'result' },
        { value: `For ${(power.inputParameters.desiredPower*100).toFixed(0)}% power`, type: 'data' },
        { value: '', type: 'data' }
    ]);

    data.push([
        { value: 'Recommendation:', type: 'label' },
        { value: power.recommendation, type: 'data' },
        { value: '', type: 'data' },
        { value: '', type: 'data' }
    ]);

    return data;
}

generateMetaAnalysisSection() {
    const data = [];
    const meta = this.metaAnalysis;

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'META-ANALYSIS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    // Fixed effects
    if (meta.fixedEffect) {
        data.push([
            { value: 'FIXED EFFECTS MODEL', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        data.push([
            { value: 'Pooled Effect:', type: 'label' },
            { value: meta.fixedEffect.pooledEffect.toFixed(4), type: 'result' },
            { value: `95% CI: [${meta.fixedEffect.confidenceInterval.lower.toFixed(4)}, ${meta.fixedEffect.confidenceInterval.upper.toFixed(4)}]`, type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([
            { value: 'P-Value:', type: 'label' },
            { value: meta.fixedEffect.pValue.toFixed(6), type: 'result' },
            { value: meta.fixedEffect.pValue < 0.05 ? 'Significant' : 'Not significant', type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    // Heterogeneity
    if (meta.heterogeneity) {
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'HETEROGENEITY ASSESSMENT', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        data.push([
            { value: 'I² Statistic:', type: 'label' },
            { value: meta.heterogeneity.I2, type: 'result' },
            { value: meta.heterogeneity.interpretation, type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    return data;
}

generateMultivariateAnalysisSection() {
    const data = [];
    const multi = this.multivariateAnalysis;

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'MULTIVARIATE ANALYSIS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    if (multi.correlationMatrix) {
        data.push([
            { value: 'Correlation Matrix Available', type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);

        if (multi.correlationMatrix.interpretation) {
            data.push([
                { value: 'Interpretation:', type: 'label' },
                { value: multi.correlationMatrix.interpretation.note, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }
    }

    return data;
}

generateMissingDataAnalysisSection() {
    const data = [];
    const missing = this.missingDataAnalysis;

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'MISSING DATA ANALYSIS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    if (missing.missingPercentage) {
        data.push([
            { value: 'Total Missing:', type: 'label' },
            { value: missing.missingPercentage.percentage, type: 'result' },
            { value: `${missing.missingPercentage.missing} of ${missing.missingPercentage.total} values`, type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    if (missing.missingMechanism) {
        data.push([
            { value: 'Mechanism:', type: 'label' },
            { value: missing.missingMechanism.mechanism, type: 'result' },
            { value: missing.missingMechanism.recommendation, type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    return data;
}

generateNonParametricTestsSection() {
    const data = [];

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'NON-PARAMETRIC TESTS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    Object.entries(this.nonParametricTests).forEach(([testName, test]) => {
        data.push([
            { value: test.testType.toUpperCase(), type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        data.push([{ value: 'Test Statistic:', type: 'label' },
            { value: typeof test.testStatistic === 'number' ? test.testStatistic.toFixed(4) : test.testStatistic.toString(), type: 'result' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);

        if (test.pValue !== undefined) {
            data.push([
                { value: 'P-Value:', type: 'label' },
                { value: test.pValue.toFixed(6), type: 'result' },
                { value: test.pValue < 0.05 ? 'Significant' : 'Not significant', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        if (test.conclusion) {
            data.push([
                { value: 'Conclusion:', type: 'label' },
                { value: test.conclusion, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        if (test.effectSize) {
            data.push([
                { value: 'Effect Size:', type: 'label' },
                { value: test.effectSize.value, type: 'result' },
                { value: test.effectSize.interpretation, type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    });

    return data;
}

generateEffectSizesSection() {
    const data = [];

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'EFFECT SIZE ANALYSIS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    Object.entries(this.effectSizes).forEach(([effectName, effect]) => {
        data.push([
            { value: `${effectName}:`, type: 'label' },
            { value: effect.value, type: 'result' },
            { value: effect.interpretation, type: 'data' },
            { value: '', type: 'data' }
        ]);

        if (effect.confidenceInterval) {
            data.push([
                { value: '  95% CI:', type: 'label' },
                { value: `[${effect.confidenceInterval[0]}, ${effect.confidenceInterval[1]}]`, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        if (effect.note) {
            data.push([
                { value: '  Note:', type: 'label' },
                { value: effect.note, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }
    });

    return data;
}

generateDistributionPropertiesSection() {
    const data = [];
    const properties = this.calculateDistributionProperties();

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'THEORETICAL DISTRIBUTION PROPERTIES', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    Object.entries(properties).forEach(([propName, prop]) => {
        if (typeof prop === 'object' && prop.value !== undefined) {
            data.push([
                { value: propName + ':', type: 'label' },
                { value: typeof prop.value === 'number' ? prop.value.toFixed(4) : prop.value, type: 'result' },
                { value: prop.interpretation || '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }
    });

    return data;
}

generateParameterEstimationSection() {
    const data = [];

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'PARAMETER ESTIMATION', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
    
    data.push([
        { value: 'Estimation Method:', type: 'label' },
        { value: 'Maximum Likelihood Estimation (MLE)', type: 'data' },
        { value: '', type: 'data' },
        { value: '', type: 'data' }
    ]);

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'Parameter', type: 'header' },
        { value: 'Estimate', type: 'header' },
        { value: 'Description', type: 'header' },
        { value: '', type: 'header' }
    ]);

    dist.params.forEach((paramName, index) => {
        data.push([
            { value: dist.paramNames[index], type: 'label' },
            { value: this.distributionParams[index].toFixed(4), type: 'result' },
            { value: this.getParameterInterpretation(paramName, this.distributionParams[index]), type: 'data' },
            { value: '', type: 'data' }
        ]);
    });

    return data;
}

generateParameterConfidenceIntervalsSection() {
    const data = [];

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'PARAMETER CONFIDENCE INTERVALS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    Object.entries(this.parameterConfidenceIntervals).forEach(([level, ciData]) => {
        const percentage = Math.round(level * 100);
        
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: `${percentage}% CONFIDENCE INTERVALS`, type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        if (ciData.parameters) {
            Object.entries(ciData.parameters).forEach(([paramName, param]) => {
                data.push([
                    { value: paramName + ':', type: 'label' },
                    { value: `${param.estimate.toFixed(4)}`, type: 'result' },
                    { value: `[${param.lowerBound.toFixed(4)}, ${param.upperBound.toFixed(4)}]`, type: 'data' },
                    { value: '', type: 'data' }
                ]);

                if (param.interpretation) {
                    data.push([
                        { value: '', type: 'data' },
                        { value: param.interpretation, type: 'data' },
                        { value: '', type: 'data' },
                        { value: '', type: 'data' }
                    ]);
                }
            });
        }
    });

    return data;
}

generateAnalysisSummarySection() {
    const data = [];

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'ANALYSIS SUMMARY', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    // Data summary
    data.push([
        { value: 'Dataset:', type: 'label' },
        { value: this.sampleName, type: 'data' },
        { value: `n = ${this.statistics.n}`, type: 'data' },
        { value: '', type: 'data' }
    ]);

    // Distribution summary
    const dist = DistributionRegistry.getDistribution(this.selectedDistribution);
    data.push([
        { value: 'Best-Fit Distribution:', type: 'label' },
        { value: dist.name, type: 'result' },
        { value: '', type: 'data' },
        { value: '', type: 'data' }
    ]);

    // Goodness of fit summary
    if (this.goodnessOfFit && this.goodnessOfFit.kolmogorovSmirnov) {
        const ksTest = this.goodnessOfFit.kolmogorovSmirnov;
        data.push([
            { value: 'Goodness of Fit:', type: 'label' },
            { value: ksTest.pValue > 0.05 ? 'Good fit' : 'Poor fit', type: ksTest.pValue > 0.05 ? 'result' : 'error' },
            { value: `K-S p-value: ${ksTest.pValue.toFixed(4)}`, type: 'data' },
            { value: '', type: 'data' }
        ]);
    }

    // Analyses performed
    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'ANALYSES PERFORMED', type: 'header' },
        { value: '', type: 'header' },
        { value: '', type: 'header' },
        { value: '', type: 'header' }
    ]);

    const analyses = [];
    analyses.push('✓ Descriptive Statistics');
    analyses.push('✓ Distribution Fitting');
    analyses.push('✓ Goodness of Fit Tests');
    analyses.push('✓ Parameter Estimation');
    analyses.push('✓ Robust Statistics');

    if (Object.keys(this.regressionResults).length > 0) {
        analyses.push(`✓ Regression Analysis (${Object.keys(this.regressionResults).length} model(s))`);
    }
    if (Object.keys(this.hypothesisTests).length > 0) {
        analyses.push('✓ Hypothesis Testing');
    }
    if (Object.keys(this.nonParametricTests).length > 0) {
        analyses.push('✓ Non-Parametric Tests');
    }
    if (Object.keys(this.bayesianAnalysis).length > 0) {
        analyses.push('✓ Bayesian Analysis');
    }
    if (Object.keys(this.powerAnalysis).length > 0) {
        analyses.push('✓ Power Analysis');
    }
    if (Object.keys(this.metaAnalysis).length > 0) {
        analyses.push('✓ Meta-Analysis');
    }
    if (Object.keys(this.timeSeriesAnalysis).length > 0) {
        analyses.push('✓ Time Series Analysis (ARIMA)');
    }
    if (Object.keys(this.multivariateAnalysis).length > 0) {
        analyses.push('✓ Multivariate Analysis');
    }

    analyses.forEach(analysis => {
        data.push([
            { value: analysis, type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);
    });

    // Footer
    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: `Analysis completed: ${new Date().toLocaleString()}`, type: 'data' },
        { value: '', type: 'data' },
        { value: '', type: 'data' },
        { value: '', type: 'data' }
    ]);

    data.push([
        { value: `Software: Enhanced Statistical Workbook v${this.version}`, type: 'data' },
        { value: '', type: 'data' },
        { value: '', type: 'data' },
        { value: '', type: 'data' }
    ]);

    return data;
}

generatePracticalRecommendationsSection() {
    const data = [];
    const recommendations = this.generatePracticalRecommendations();

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'PRACTICAL RECOMMENDATIONS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    recommendations.forEach((rec, index) => {
        data.push([
            { value: `${index + 1}.`, type: 'label' },
            { value: rec, type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);
    });

    // Add data quality recommendations
    if (this.validationResults && this.validationResults.dataQuality) {
        const qualityRecs = this.validationResults.dataQuality.recommendations;
        if (qualityRecs && qualityRecs.length > 0) {
            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
            data.push([
                { value: 'DATA QUALITY RECOMMENDATIONS', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);

            qualityRecs.forEach((rec, index) => {
                data.push([
                    { value: `${index + 1}.`, type: 'label' },
                    { value: rec, type: 'data' },
                    { value: '', type: 'data' },
                    { value: '', type: 'data' }
                ]);
            });
        }
    }

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

        // Parameter estimates with interpretations
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

        // Add distribution properties
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
                { value: value.value, type: 'result' },
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
            case 'normal':
                if (paramName === 'mean') return `Location parameter: ${paramValue.toFixed(4)} ${this.unitName}`;
                if (paramName === 'std') return `Scale parameter: ${paramValue.toFixed(4)} ${this.unitName}`;
                break;
            case 't':
                return `Degrees of freedom: ${paramValue.toFixed(0)}, controls tail behavior`;
            case 'exponential':
                return `Rate: ${paramValue.toFixed(4)} events per time unit`;
            case 'gamma':
                if (paramName === 'shape') {
                    return paramValue > 1 ? 'Distribution is right-skewed' : 'Distribution is highly right-skewed';
                } else {
                    return `Scale stretches distribution by factor ${paramValue.toFixed(2)}`;
                }
            case 'beta':
                if (paramName === 'alpha') {
                    return paramValue > 1 ? 'Favors higher values' : 'Favors lower values';
                } else {
                    return paramValue > 1 ? 'Favors lower values' : 'Favors higher values';
                }
            case 'chisquare':
                return `Degrees of freedom: ${paramValue.toFixed(0)}, determines shape and spread`;
            case 'f':
                if (paramName === 'df1') return `Numerator df: ${paramValue.toFixed(0)}`;
                if (paramName === 'df2') return `Denominator df: ${paramValue.toFixed(0)}`;
                break;
            default:
                return `Parameter value: ${paramValue.toFixed(4)}`;
        }
    }

    calculateDistributionProperties() {
        switch(this.selectedDistribution) {
            case 'normal':
                const [mean, std] = this.distributionParams;
                return {
                    'Expected Value': { value: `${mean.toFixed(4)} ${this.unitName}`, interpretation: 'Center of distribution' },
                    'Standard Deviation': { value: `${std.toFixed(4)} ${this.unitName}`, interpretation: 'Measure of spread' },
                    'Variance': { value: `${(std*std).toFixed(4)} ${this.unitName}²`, interpretation: 'Squared standard deviation' },
                    'Skewness': { value: '0.000', interpretation: 'Perfectly symmetric' },
                    'Kurtosis': { value: '3.000', interpretation: 'Mesokurtic (normal tail behavior)' }
                };
            case 't':
                const df = this.distributionParams[0];
                return {
                    'Degrees of Freedom': { value: df.toString(), interpretation: 'Parameter controlling tail behavior' },
                    'Expected Value': { value: '0.000', interpretation: 'Center at zero' },
                    'Variance': { value: df > 2 ? (df/(df-2)).toFixed(4) : 'Undefined', interpretation: df > 2 ? 'Decreases as df increases' : 'Undefined for df ≤ 2' },
                    'Skewness': { value: '0.000', interpretation: 'Symmetric distribution' },
                    'Tail Behavior': { value: df > 30 ? 'Normal-like' : 'Heavy tails', interpretation: 'Approaches normal as df → ∞' }
                };
            case 'exponential':
                const lambda = this.distributionParams[0];
                return {
                    'Expected Value': { value: `${(1/lambda).toFixed(4)} ${this.unitName}`, interpretation: 'Mean time between events' },
                    'Variance': { value: `${(1/(lambda*lambda)).toFixed(4)} ${this.unitName}²`, interpretation: 'Variability in timing' },
                    'Standard Deviation': { value: `${(1/lambda).toFixed(4)} ${this.unitName}`, interpretation: 'Same as expected value' },
                    'Median': { value: `${(Math.log(2)/lambda).toFixed(4)} ${this.unitName}`, interpretation: '50th percentile' },
                    'Mode': { value: `0 ${this.unitName}`, interpretation: 'Most likely value' },
                    'Skewness': { value: '2.000', interpretation: 'Highly right-skewed' },
                    'Kurtosis': { value: '9.000', interpretation: 'Heavy right tail' }
                };
            case 'gamma':
                const [shape, scale] = this.distributionParams;
                const meanG = shape * scale;
                const varianceG = shape * scale * scale;
                const skewnessG = 2 / Math.sqrt(shape);
                const kurtosisG = 3 + 6/shape;
                const modeG = shape > 1 ? (shape - 1) * scale : 0;

                return {
                    'Expected Value': { value: `${meanG.toFixed(4)} ${this.unitName}`, interpretation: 'Average value' },
                    'Variance': { value: `${varianceG.toFixed(4)} ${this.unitName}²`, interpretation: 'Spread increases with both parameters' },
                    'Standard Deviation': { value: `${Math.sqrt(varianceG).toFixed(4)} ${this.unitName}`, interpretation: 'Square root of variance' },
                    'Mode': { value: shape > 1 ? `${modeG.toFixed(4)} ${this.unitName}` : `0 ${this.unitName}`, interpretation: shape > 1 ? 'Most likely value' : 'Distribution starts at zero' },
                    'Median': { value: 'No closed form', interpretation: 'Approximately ' + (meanG * 0.9).toFixed(2) + ' ' + this.unitName },
                    'Skewness': { value: skewnessG.toFixed(4), interpretation: skewnessG > 1 ? 'Highly right-skewed' : 'Moderately right-skewed' },
                    'Kurtosis': { value: kurtosisG.toFixed(4), interpretation: 'Tail heaviness depends on shape parameter' }
                };

            case 'beta':
                const [alphaB, betaB] = this.distributionParams;
                const meanB = alphaB / (alphaB + betaB);
                const varianceB = (alphaB * betaB) / (Math.pow(alphaB + betaB, 2) * (alphaB + betaB + 1));
                const modeB = (alphaB > 1 && betaB > 1) ? (alphaB - 1) / (alphaB + betaB - 2) : null;
                const skewnessB = (2 * (betaB - alphaB) * Math.sqrt(alphaB + betaB + 1)) / ((alphaB + betaB + 2) * Math.sqrt(alphaB * betaB));

                return {
                    'Expected Value': { value: meanB.toFixed(4), interpretation: 'Mean proportion/probability' },
                    'Variance': { value: varianceB.toFixed(6), interpretation: 'Variability in proportion' },
                    'Standard Deviation': { value: Math.sqrt(varianceB).toFixed(4), interpretation: 'Standard error of proportion' },
                    'Mode': { value: modeB ? modeB.toFixed(4) : 'N/A', interpretation: modeB ? 'Most likely proportion' : 'No unique mode (uniform or U-shaped)' },
                    'Median': { value: 'No closed form', interpretation: 'Approximately ' + meanB.toFixed(3) },
                    'Skewness': { value: skewnessB.toFixed(4), interpretation: this.interpretBetaSkewness(skewnessB) },
                    'Shape': { value: this.describeBetaShape(alphaB, betaB), interpretation: 'Overall distribution shape' }
                };

            case 'chisquare':
                const dfChi = this.distributionParams[0];
                const meanChi = dfChi;
                const varianceChi = 2 * dfChi;
                const skewnessChi = Math.sqrt(8 / dfChi);
                const kurtosisChi = 3 + 12 / dfChi;

                return {
                    'Expected Value': { value: `${meanChi.toFixed(4)} ${this.unitName}`, interpretation: 'Mean equals degrees of freedom' },
                    'Variance': { value: `${varianceChi.toFixed(4)} ${this.unitName}²`, interpretation: 'Variance is twice the degrees of freedom' },
                    'Standard Deviation': { value: `${Math.sqrt(varianceChi).toFixed(4)} ${this.unitName}`, interpretation: 'Square root of 2df' },
                    'Mode': { value: dfChi > 2 ? `${(dfChi - 2).toFixed(4)} ${this.unitName}` : `0 ${this.unitName}`, interpretation: dfChi > 2 ? 'Peak of distribution' : 'Mode at zero' },
                    'Skewness': { value: skewnessChi.toFixed(4), interpretation: dfChi > 10 ? 'Moderately right-skewed' : 'Highly right-skewed' },
                    'Kurtosis': { value: kurtosisChi.toFixed(4), interpretation: 'Approaches normal as df increases' }
                };

            case 'f':
                const [df1F, df2F] = this.distributionParams;
                const meanF = df2F > 2 ? df2F / (df2F - 2) : 'Undefined';
                const varianceF = df2F > 4 ? (2 * df2F * df2F * (df1F + df2F - 2)) / (df1F * (df2F - 2) * (df2F - 2) * (df2F - 4)) : 'Undefined';
                const modeF = df1F > 2 ? ((df1F - 2) / df1F) * (df2F / (df2F + 2)) : 0;

                return {
                    'Expected Value': { value: typeof meanF === 'number' ? `${meanF.toFixed(4)} ${this.unitName}` : meanF, interpretation: 'Mean exists only for df2 > 2' },
                    'Variance': { value: typeof varianceF === 'number' ? `${varianceF.toFixed(4)} ${this.unitName}²` : varianceF, interpretation: 'Variance exists only for df2 > 4' },
                    'Mode': { value: `${modeF.toFixed(4)} ${this.unitName}`, interpretation: 'Most likely F-statistic value' },
                    'Numerator DF': { value: df1F.toString(), interpretation: 'Degrees of freedom in numerator' },
                    'Denominator DF': { value: df2F.toString(), interpretation: 'Degrees of freedom in denominator' },
                    'Shape': { value: df1F > 5 && df2F > 5 ? 'Bell-shaped' : 'Right-skewed', interpretation: 'Shape depends on both df parameters' }
                };

                case 'lognormal':
                     return this.calculateLogNormalProperties();
                case 'pareto':
                     return this.calculateParetoProperties();
                
            default:
                return {
                    'Distribution': { value: this.selectedDistribution, interpretation: 'Selected distribution type' },
                    'Parameters': { value: this.distributionParams.join(', '), interpretation: 'Estimated parameter values' }
                };
        }
    }

    describeBetaShape(alpha, beta) {
        if (alpha < 1 && beta < 1) return 'U-shaped';
        if (alpha === 1 && beta === 1) return 'Uniform';
        if (alpha > 1 && beta > 1) return 'Bell-shaped';
        if (alpha < 1 || beta < 1) return 'J-shaped';
        return 'Unimodal';
    }

    interpretBetaSkewness(skewness) {
        if (Math.abs(skewness) < 0.5) return 'Nearly symmetric';
        if (skewness > 0) return 'Right-skewed (favors lower values)';
        return 'Left-skewed (favors higher values)';
    }



    calculateLogNormalProperties() {
    const [mu, sigma] = this.distributionParams;
    const theoreticalMean = Math.exp(mu + sigma * sigma / 2);
    const theoreticalVariance = (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma);
    const theoreticalMedian = Math.exp(mu);
    const theoreticalMode = Math.exp(mu - sigma * sigma);
    const theoreticalCV = Math.sqrt(Math.exp(sigma * sigma) - 1);

    return {
        'Expected Value': { 
            value: `${theoreticalMean.toFixed(4)} ${this.unitName}`, 
            interpretation: 'Mean of original scale data' 
        },
        'Variance': { 
            value: `${theoreticalVariance.toFixed(4)} ${this.unitName}²`, 
            interpretation: 'Variance increases exponentially with σ' 
        },
        'Standard Deviation': { 
            value: `${Math.sqrt(theoreticalVariance).toFixed(4)} ${this.unitName}`, 
            interpretation: 'Square root of variance' 
        },
        'Median': { 
            value: `${theoreticalMedian.toFixed(4)} ${this.unitName}`, 
            interpretation: 'exp(μ) - geometric mean of log-normal' 
        },
        'Mode': { 
            value: `${theoreticalMode.toFixed(4)} ${this.unitName}`, 
            interpretation: 'Most frequent value' 
        },
        'Coefficient of Variation': { 
            value: theoreticalCV.toFixed(4), 
            interpretation: theoreticalCV > 1 ? 'High relative variability' : 'Moderate relative variability' 
        },
        'Log Parameters': { 
            value: `μ = ${mu.toFixed(4)}, σ = ${sigma.toFixed(4)}`, 
            interpretation: 'Parameters of underlying normal distribution' 
        },
        'Skewness': { 
            value: ((Math.exp(sigma*sigma) + 2) * Math.sqrt(Math.exp(sigma*sigma) - 1)).toFixed(4), 
            interpretation: 'Always positive - right-skewed' 
        }
    };
}

calculateParetoProperties() {
    const [xm, alpha] = this.distributionParams;
    const theoreticalMean = alpha > 1 ? (alpha * xm) / (alpha - 1) : Infinity;
    const theoreticalVariance = alpha > 2 ? (xm * xm * alpha) / ((alpha - 1) * (alpha - 1) * (alpha - 2)) : Infinity;
    const theoreticalMedian = xm * Math.pow(2, 1/alpha);

    return {
        'Expected Value': { 
            value: theoreticalMean === Infinity ? 'Infinite' : `${theoreticalMean.toFixed(4)} ${this.unitName}`, 
            interpretation: alpha > 1 ? 'Finite mean' : 'Infinite mean - very heavy tail' 
        },
        'Variance': { 
            value: theoreticalVariance === Infinity ? 'Infinite' : `${theoreticalVariance.toFixed(4)} ${this.unitName}²`, 
            interpretation: alpha > 2 ? 'Finite variance' : 'Infinite variance' 
        },
        'Standard Deviation': { 
            value: theoreticalVariance === Infinity ? 'Infinite' : `${Math.sqrt(theoreticalVariance).toFixed(4)} ${this.unitName}`, 
            interpretation: alpha > 2 ? 'Well-defined spread' : 'Undefined spread' 
        },
        'Median': { 
            value: `${theoreticalMedian.toFixed(4)} ${this.unitName}`, 
            interpretation: '50th percentile value' 
        },
        'Mode': { 
            value: `${xm.toFixed(4)} ${this.unitName}`, 
            interpretation: 'Most frequent value (minimum)' 
        },
        'Minimum Value': { 
            value: `${xm.toFixed(4)} ${this.unitName}`, 
            interpretation: 'Lower bound of distribution' 
        },
        'Shape Parameter': { 
            value: alpha.toFixed(4), 
            interpretation: alpha < 1 ? 'Extremely heavy tail' : alpha < 2 ? 'Heavy tail' : 'Moderate tail' 
        },
        'Pareto Index': { 
            value: (1/alpha).toFixed(4), 
            interpretation: 'Inverse of shape parameter' 
        },
        '80-20 Rule': { 
            value: alpha < 1.61 ? 'Strong effect' : 'Weak effect', 
            interpretation: 'Degree of inequality concentration' 
        }
    };
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
                    row.push({ value: displayData[i + j].toFixed(4), type: 'data' });
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
            ['Minimum:', this.statistics.min.toFixed(4), this.unitName],
            ['Maximum:', this.statistics.max.toFixed(4), this.unitName],
            ['Range:', this.statistics.range.toFixed(4), this.unitName],
            ['Q1 (25th percentile):', this.statistics.q1.toFixed(4), this.unitName],
            ['Q3 (75th percentile):', this.statistics.q3.toFixed(4), this.unitName],
            ['IQR:', this.statistics.iqr.toFixed(4), this.unitName],
            ['Skewness:', this.statistics.skewness.toFixed(4), ''],
            ['Kurtosis:', this.statistics.kurtosis.toFixed(4), '']
        ];

        stats.forEach(([label, value, unit]) => {
            data.push([
                { value: label, type: 'label' },
                { value: value.toString(), type: 'result' },
                { value: unit, type: 'data' },
                { value: '', type: 'data' }
            ]);
        });

        return data;
    }

    generateDistributionAnalysisSection() {
        const data = [];

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'DISTRIBUTION ANALYSIS', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);

        data.push([
            { value: 'Distribution:', type: 'label' },
            { value: this.distributionAnalysis.distribution, type: 'result' },
            { value: DistributionRegistry.getDistribution(this.selectedDistribution).name, type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([
            { value: 'Log-Likelihood:', type: 'label' },
            { value: this.distributionAnalysis.logLikelihood.toFixed(4), type: 'result' },
            { value: 'Model fit measure', type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([
            { value: 'AIC:', type: 'label' },
            { value: this.distributionAnalysis.aic.toFixed(4), type: 'result' },
            { value: 'Lower is better', type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([
            { value: 'BIC:', type: 'label' },
            { value: this.distributionAnalysis.bic.toFixed(4), type: 'result' },
            { value: 'Lower is better', type: 'data' },
            { value: '', type: 'data' }
        ]);

        return data;
    }

generateGoodnessOfFitSection() {
    const data = [];

    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
    data.push([
        { value: 'GOODNESS OF FIT TESTS', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' },
        { value: '', type: 'section' }
    ]);

    // Kolmogorov-Smirnov Test
    if (this.goodnessOfFit && this.goodnessOfFit.kolmogorovSmirnov) {
        const ks = this.goodnessOfFit.kolmogorovSmirnov;
        if (ks.testStatistic !== null && ks.testStatistic !== undefined) {
            data.push([
                { value: 'KOLMOGOROV-SMIRNOV TEST', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);

            data.push([
                { value: 'Test Statistic:', type: 'label' },
                { value: ks.testStatistic.toFixed(6), type: 'result' },
                { value: 'Maximum difference between CDFs', type: 'data' },
                { value: '', type: 'data' }
            ]);

            data.push([
                { value: 'P-Value:', type: 'label' },
                { value: ks.pValue ? ks.pValue.toFixed(6) : 'N/A', type: 'result' },
                { value: ks.pValue && ks.pValue < 0.05 ? 'Reject H0 (poor fit)' : 'Fail to reject H0 (good fit)', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }
    }

    // Chi-square test
    if (this.goodnessOfFit && this.goodnessOfFit.chisquareTest) {
        const chi = this.goodnessOfFit.chisquareTest;
        if (chi.testStatistic !== null && chi.testStatistic !== undefined) {
            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
            data.push([
                { value: 'CHI-SQUARE GOODNESS OF FIT', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);

            data.push([
                { value: 'Test Statistic:', type: 'label' },
                { value: chi.testStatistic.toFixed(4), type: 'result' },
                { value: `df = ${chi.degreesOfFreedom || 'N/A'}`, type: 'data' },
                { value: '', type: 'data' }
            ]);

            data.push([
                { value: 'P-Value:', type: 'label' },
                { value: chi.pValue ? chi.pValue.toFixed(6) : 'N/A', type: 'result' },
                { value: chi.pValue && chi.pValue < 0.05 ? 'Reject H0 (poor fit)' : 'Fail to reject H0 (good fit)', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }
    }

    // Shapiro-Wilk test - Only show if applicable and has valid results
    if (this.goodnessOfFit && this.goodnessOfFit.shapiroWilk) {
        const sw = this.goodnessOfFit.shapiroWilk;
        
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'SHAPIRO-WILK TEST (FOR NORMALITY)', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        // Check if we have valid test results
        if (sw.testStatistic !== null && sw.testStatistic !== undefined && !isNaN(sw.testStatistic)) {
            data.push([
                { value: 'Test Statistic (W):', type: 'label' },
                { value: sw.testStatistic.toFixed(4), type: 'result' },
                { value: 'Closer to 1 indicates normality', type: 'data' },
                { value: '', type: 'data' }
            ]);

            data.push([
                { value: 'P-Value:', type: 'label' },
                { value: sw.pValue && !isNaN(sw.pValue) ? sw.pValue.toFixed(6) : 'N/A', type: 'result' },
                { value: sw.pValue && sw.pValue < 0.05 ? 'Reject H0 (not normal)' : 'Fail to reject H0 (consistent with normal)', type: 'data' },
                { value: '', type: 'data' }
            ]);
        } else {
            // Handle cases where test couldn't be performed or is not applicable
            const message = sw.note || sw.error || 'Test not applicable to this distribution';
            data.push([
                { value: 'Status:', type: 'label' },
                { value: message, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }
    }

    return data;
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

        // Distribution-specific recommendations
        switch(this.selectedDistribution) {
            case 'normal':
                recommendations.push("The normal distribution is appropriate for continuous data with symmetric, bell-shaped patterns.");
                recommendations.push("Use for measurement errors, natural phenomena following the Central Limit Theorem.");
                if (Math.abs(this.statistics.skewness) > 0.5) {
                    recommendations.push("Warning: Data shows significant skewness. Consider data transformation or alternative distributions.");
                }
                break;
            case 't':
                recommendations.push("T-distribution is appropriate for small sample hypothesis testing.");
                const df = this.distributionParams[0];
                if (df > 30) {
                    recommendations.push("With df > 30, results are very similar to normal distribution.");
                } else {
                    recommendations.push("Heavy tails account for additional uncertainty with small samples.");
                }
                recommendations.push("Use for confidence intervals when population variance is unknown.");
                break;
            case 'exponential':
                recommendations.push("Exponential distribution is ideal for modeling time between events in Poisson processes.");
                recommendations.push(`Expected wait time: ${(1/this.distributionParams[0]).toFixed(2)} ${this.unitName}`);
                recommendations.push("Use for reliability analysis, survival times, or queueing systems.");
                recommendations.push("Memoryless property: P(X > s+t | X > s) = P(X > t)");
                break;
            case 'gamma':
                recommendations.push("Gamma distribution models waiting times for multiple events.");
                const [shape] = this.distributionParams;
                if (shape < 1) {
                    recommendations.push("Shape < 1 indicates decreasing hazard rate over time.");
                } else if (shape > 1) {
                    recommendations.push("Shape > 1 indicates increasing hazard rate over time.");
                } else {
                    recommendations.push("Shape = 1 reduces to exponential distribution.");
                }
                recommendations.push("Use for modeling aggregate waiting times or continuous positive-valued data.");
                break;
            case 'beta':
                recommendations.push("Beta distribution is ideal for modeling proportions, percentages, or probabilities.");
                recommendations.push("Bounded between 0 and 1, making it perfect for rates and proportions.");
                const [alpha, beta] = this.distributionParams;
                if (alpha < 1 && beta < 1) {
                    recommendations.push("U-shaped: data concentrates at extremes (0 and 1).");
                } else if (alpha === 1 && beta === 1) {
                    recommendations.push("Uniform: all values between 0 and 1 equally likely.");
                } else if (alpha > 1 && beta > 1) {
                    recommendations.push("Bell-shaped: data concentrates around the mean.");
                }
                break;
            case 'chisquare':
                recommendations.push("Chi-square distribution is used for goodness-of-fit tests and variance testing.");
                const dfChi = this.distributionParams[0];
                recommendations.push(`With ${dfChi} degrees of freedom, mean = ${dfChi}, variance = ${2*dfChi}.`);
                if (dfChi > 30) {
                    recommendations.push("Large df: distribution approaches normal shape.");
                } else {
                    recommendations.push("Small df: highly right-skewed distribution.");
                }
                recommendations.push("Use for testing independence in contingency tables or variance tests.");
                break;
            case 'f':
                const [df1, df2] = this.distributionParams;
                recommendations.push("F-distribution is used for comparing variances and ANOVA.");
                recommendations.push(`Numerator df = ${df1}, Denominator df = ${df2}`);
                recommendations.push("Use for testing equality of variances between groups.");
                if (df1 > 5 && df2 > 5) {
                    recommendations.push("Both df > 5: distribution is approximately bell-shaped.");
                } else {
                    recommendations.push("Small df values: distribution is right-skewed.");
                }
                recommendations.push("Critical for ANOVA F-tests and regression analysis.");
                break;
            case 'lognormal':
                recommendations.push("Log-normal distribution is ideal for data from multiplicative processes.");
                recommendations.push("Common in financial data, environmental measurements, and biological processes.");
                const [muLN, sigmaLN] = this.distributionParams;
                const cvLN = Math.sqrt(Math.exp(sigmaLN * sigmaLN) - 1);
                if (cvLN > 1) {
                recommendations.push("High coefficient of variation indicates significant right skewness.");
                }
                recommendations.push("Use for positive-valued data with right skew and multiplicative effects.");
                if (sigmaLN < 0.5) {
                recommendations.push("Low σ suggests data is close to log-normal with moderate skewness.");
                } else {
                recommendations.push("High σ indicates strong right skewness and wide spread.");
                }
                break;

           case 'pareto':
                recommendations.push("Pareto distribution models power-law phenomena and extreme inequality.");
                recommendations.push("Perfect for wealth distributions, city sizes, and 'winner-takes-all' scenarios.");
                const [xmP, alphaP] = this.distributionParams;
                if (alphaP < 1) {
                recommendations.push("α < 1: Infinite mean - extremely heavy tail with frequent extreme values.");
                } else if (alphaP < 2) {
                recommendations.push("1 < α < 2: Finite mean but infinite variance - classic 80-20 rule applies.");
                } else if (alphaP < 3) {
                recommendations.push("2 < α < 3: Finite variance but infinite skewness - moderate inequality.");
                } else {
                recommendations.push("α > 3: All moments finite - weaker Pareto effect.");
                }
    
                if (alphaP < 1.61) {
                recommendations.push("Strong Pareto principle: 20% of items account for >80% of total value.");
                }
    
                recommendations.push(`Minimum threshold: ${xmP.toFixed(2)} ${this.unitName} - no values below this point.`);
                break;
            case 'binomial':
                recommendations.push("Binomial distribution models number of successes in fixed trials.");
                break;
            case 'bernoulli':
                recommendations.push("Bernoulli distribution models single trial success/failure.");
                break;
            case 'poisson':
                recommendations.push("Poisson distribution models count of rare events.");
                break;
            case 'geometric':
                recommendations.push("Geometric distribution models trials until first success.");
                break;
            case 'uniform':
                recommendations.push("Uniform distribution models equal probability over interval.");
                break;
            default:
                recommendations.push(`${dist.name} distribution analysis completed.`);
                recommendations.push("Refer to distribution-specific literature for detailed interpretation.");
        }

        // Goodness of fit recommendations
        const ksTest = this.goodnessOfFit.kolmogorovSmirnov;
        if (ksTest && ksTest.pValue < 0.05) {
            recommendations.push("Goodness of fit tests suggest the distribution may not be appropriate. Consider alternative distributions.");
        } else if (ksTest) {
            recommendations.push("Goodness of fit tests support the chosen distribution.");
        }

        // Sample size recommendations
        if (this.statistics.n < 30) {
            recommendations.push("Small sample size: Results should be interpreted cautiously. Consider collecting more data.");
        } else if (this.statistics.n > 100) {
            recommendations.push("Large sample size provides reliable parameter estimates and test results.");
        } else {
            recommendations.push("Adequate sample size for reliable estimates.");
        }

        // Distribution comparison recommendations
        if (Object.keys(this.comparisonResults).length > 0) {
            const bestFit = this.comparisonResults.bestFit;
            recommendations.push(`Among compared distributions, ${DistributionRegistry.getDistribution(bestFit).name} provides the best fit.`);
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

            // Add additional test-specific information
            if (test.degreesOfFreedom !== undefined) {
                data.push([
                    { value: 'Degrees of Freedom:', type: 'label' },
                    { value: test.degreesOfFreedom.toString(), type: 'result' },
                    { value: '', type: 'data' },
                    { value: '', type: 'data' }
                ]);
            }

            if (test.confidenceInterval) {
                const ci = test.confidenceInterval;
                data.push([
                    { value: `${Math.round((1-0.05)*100)}% CI:`, type: 'label' },
                    { value: `[${ci.lowerBound.toFixed(4)}, ${ci.upperBound.toFixed(4)}]`, type: 'result' },
                    { value: '', type: 'data' },
                    { value: '', type: 'data' }
                ]);
            }

            // Add spacing between tests
            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        });

        return data;
    }

    generateComparisonSection() {
        const data = [];

        if (Object.keys(this.comparisonResults).length === 0) return data;

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'DISTRIBUTION COMPARISON', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);

        // Summary
        data.push([
            { value: 'Best Fit Distribution:', type: 'label' },
            { value: DistributionRegistry.getDistribution(this.comparisonResults.bestFit).name, type: 'result' },
            { value: 'Based on AIC criteria', type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);

        // Comparison table header
        data.push([
            { value: 'Distribution', type: 'header' },
            { value: 'AIC', type: 'header' },
            { value: 'BIC', type: 'header' },
            { value: 'Rank', type: 'header' }
        ]);

        // Sort distributions by rank
        const sortedDistributions = Object.entries(this.comparisonResults.distributions)
            .sort((a, b) => a[1].rank - b[1].rank);

        sortedDistributions.forEach(([distName, result]) => {
            data.push([
                { value: result.name, type: 'data' },
                { value: result.aic.toFixed(2), type: 'result' },
                { value: result.bic.toFixed(2), type: 'result' },
                { value: result.rank.toString(), type: result.rank === 1 ? 'result' : 'data' }
            ]);
        });

        // Recommendations
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'COMPARISON RECOMMENDATIONS', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' },
            { value: '', type: 'header' }
        ]);

        this.comparisonResults.summary.recommendations.forEach((rec, index) => {
            data.push([
                { value: `${index + 1}. ${rec}`, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        });

        return data;
    }

    generateDistributionTargetAnalysisSection() {
        if (!this.targetAnalysis || Object.keys(this.targetAnalysis).length === 0) return [];

        const data = [];
        const target = this.targetAnalysis;

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'TARGET VALUE ANALYSIS', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);

        data.push([
            { value: 'Target Value:', type: 'label' },
            { value: target.targetValue.toString(), type: 'result' },
            { value: target.targetType || '', type: 'data' },
            { value: '', type: 'data' }
        ]);

        if (target.probabilities) {
            data.push([
                { value: 'P(X ≤ target):', type: 'label' },
                { value: target.probabilities.lessThan.toFixed(4), type: 'result' },
                { value: `${(target.probabilities.lessThan * 100).toFixed(2)}%`, type: 'data' },
                { value: '', type: 'data' }
            ]);

            data.push([
                { value: 'P(X > target):', type: 'label' },
                { value: target.probabilities.greaterThan.toFixed(4), type: 'result' },
                { value: `${(target.probabilities.greaterThan * 100).toFixed(2)}%`, type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        if (target.effectSize !== undefined) {
            data.push([
                { value: 'Effect Size:', type: 'label' },
                { value: target.effectSize.toFixed(4), type: 'result' },
                { value: target.practicalSignificance || '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        if (target.recommendation) {
            data.push([
                { value: 'Recommendation:', type: 'label' },
                { value: target.recommendation, type: 'data' },
                { value: '', type: 'data' },
                { value: '', type: 'data' }
            ]);
        }

        return data;
    }

    generateDistributionCalculationWalkthroughSection() {
        const data = [];
        const walkthrough = this.generateDistributionCalculationWalkthrough();

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'CALCULATION WALKTHROUGH', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);

        // Parameter Estimation Section
        if (walkthrough.parameterEstimation) {
            const paramEst = walkthrough.parameterEstimation;

            data.push([
                { value: paramEst.title.toUpperCase(), type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);

            if (paramEst.steps) {
                paramEst.steps.forEach((step, index) => {
                    data.push([
                        { value: step.step, type: 'label' },
                        { value: step.formula || '', type: 'formula' },
                        { value: '', type: 'data' },
                        { value: '', type: 'data' }
                    ]);

                    if (step.explanation) {
                        data.push([
                            { value: '', type: 'data' },
                            { value: step.explanation, type: 'data' },
                            { value: '', type: 'data' },
                            { value: '', type: 'data' }
                        ]);
                    }

                    data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
                });
            }

            if (paramEst.result) {
                data.push([
                    { value: 'Result:', type: 'label' },
                    { value: paramEst.result, type: 'result' },
                    { value: '', type: 'data' },
                    { value: '', type: 'data' }
                ]);
            }
        }

        // Interpretation Section
        if (walkthrough.interpretation) {
            data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
            data.push([
                { value: 'INTERPRETATION', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' },
                { value: '', type: 'header' }
            ]);

            Object.entries(walkthrough.interpretation).forEach(([key, value]) => {
                data.push([
                    { value: `${key}:`, type: 'label' },
                    { value: value, type: 'data' },
                    { value: '', type: 'data' },
                    { value: '', type: 'data' }
                ]);
            });
        }

        return data;
    }

    generateConfidenceIntervalsSection() {
        const data = [];

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'DISTRIBUTION CONFIDENCE INTERVALS', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' },
            { value: '', type: 'section' }
        ]);

        // Add explanation
        data.push([
            { value: 'Confidence intervals for distribution values', type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);

        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);

        Object.entries(this.confidenceIntervals).forEach(([level, ci]) => {
            const percentage = Math.round(level * 100);
            data.push([
                { value: `${percentage}% CI:`, type: 'label' },
                { value: `[${ci.lowerBound.toFixed(4)}, ${ci.upperBound.toFixed(4)}]`, type: 'result' },
                { value: `Width: ${ci.width.toFixed(4)}`, type: 'data' },
                { value: this.unitName, type: 'data' }
            ]);
        });

        // Add interpretation
        data.push([{ value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }, { value: '', type: 'data' }]);
        data.push([
            { value: 'Interpretation:', type: 'label' },
            { value: 'We can be X% confident that a new observation will fall within the given interval', type: 'data' },
            { value: '', type: 'data' },
            { value: '', type: 'data' }
        ]);

        return data;
    }
    // Export Methods
    async generateImage(filename = 'workbook.png') {
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');

        // Render the workbook data to canvas
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, this.width, this.height);

        // Draw grid and text based on this.currentWorkbook
        let y = 0;
        this.currentWorkbook.forEach(row => {
            let x = 0;
            row.forEach(cell => {
                // Draw cell background based on type
                switch (cell.type) {
                    case 'header':
                        ctx.fillStyle = this.colors.headerBg;
                        break;
                    case 'section':
                        ctx.fillStyle = this.colors.sectionBg;
                        break;
                    case 'result':
                        ctx.fillStyle = this.colors.resultBg;
                        break;
                    case 'formula':
                        ctx.fillStyle = this.colors.formulaBg;
                        break;
                    default:
                        ctx.fillStyle = this.colors.cellBg;
                }
                ctx.fillRect(x, y, this.cellWidth, this.cellHeight);

                // Draw text
                ctx.fillStyle = this.colors.cellText;
                ctx.font = `${this.fontSize}px Arial`;
                ctx.fillText(cell.value, x + 5, y + this.cellHeight / 2);

                x += this.cellWidth;
            });
            y += this.cellHeight;
        });

        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);

        return filename;
    }



// ==================== DISCRETE DISTRIBUTION TARGET ANALYSIS METHODS ====================

calculateBinomialTargetAnalysis() {
    const [n, p] = this.distributionParams;
    const target = this.targetValue;

    if (!Number.isInteger(target) || target < 0 || target > n) {
        return {
            targetValue: target,
            error: `Target must be integer between 0 and ${n} for Binomial(${n}, ${p})`
        };
    }

    const prob = StatisticalDistributions.binomialPDF(target, n, p);
    const probLessThan = StatisticalDistributions.binomialCDF(target, n, p);
    const probGreaterThan = 1 - StatisticalDistributions.binomialCDF(target - 1, n, p);

    const expectedValue = n * p;
    const variance = n * p * (1 - p);
    const effectSize = Math.abs(target - expectedValue) / Math.sqrt(variance);

    return {
        targetValue: target,
        targetType: 'Number of Successes',
        trials: n,
        successProbability: p,
        probabilities: {
            exactMatch: prob,
            lessThan: probLessThan,
            greaterThan: probGreaterThan,
            interpretation: `P(X = ${target}) = ${prob.toFixed(6)}, P(X ≤ ${target}) = ${probLessThan.toFixed(4)}`
        },
        effectSize: effectSize,
        expectedValue: expectedValue,
        distributionProperties: {
            mean: expectedValue,
            variance: variance,
            standardDeviation: Math.sqrt(variance),
            mode: Math.floor((n + 1) * p),
            skewness: (1 - 2*p) / Math.sqrt(n * p * (1 - p))
        },
        practicalSignificance: this.assessBinomialPracticalSignificance(target, expectedValue),
        recommendation: this.generateBinomialRecommendation(target, expectedValue, n),
        distributionContext: {
            numberOfTrials: n,
            successProbability: p,
            failureProbability: 1 - p
        }
    };
}

calculateBernoulliTargetAnalysis() {
    const p = this.distributionParams[0];
    const target = this.targetValue;

    if (target !== 0 && target !== 1) {
        return {
            targetValue: target,
            error: 'Target must be 0 (failure) or 1 (success) for Bernoulli distribution'
        };
    }

    const prob = StatisticalDistributions.bernoulliPDF(target, p);
    const probSuccess = p;
    const probFailure = 1 - p;

    return {
        targetValue: target,
        targetType: target === 1 ? 'Success' : 'Failure',
        successProbability: p,
        probabilities: {
            probability: prob,
            interpretation: target === 1 ? 
                `P(X = 1) = ${probSuccess.toFixed(4)} (success probability)` :
                `P(X = 0) = ${probFailure.toFixed(4)} (failure probability)`
        },
        distributionProperties: {
            mean: p,
            variance: p * (1 - p),
            standardDeviation: Math.sqrt(p * (1 - p)),
            mode: p > 0.5 ? 1 : 0,
            skewness: (1 - 2*p) / Math.sqrt(p * (1 - p))
        },
        practicalSignificance: this.assessBernoulliPracticalSignificance(target, p),
        recommendation: this.generateBernoulliRecommendation(target, p),
        distributionContext: {
            successProbability: p,
            failureProbability: 1 - p,
            trialType: 'Single binary trial'
        }
    };
}

calculatePoissonTargetAnalysis() {
    const lambda = this.distributionParams[0];
    const target = this.targetValue;

    if (!Number.isInteger(target) || target < 0) {
        return {
            targetValue: target,
            error: 'Target must be non-negative integer for Poisson distribution'
        };
    }

    const prob = StatisticalDistributions.poissonPDF(target, lambda);
    const probLessThan = StatisticalDistributions.poissonCDF(target, lambda);
    const probGreaterThan = 1 - StatisticalDistributions.poissonCDF(target - 1, lambda);

    const variance = lambda;
    const effectSize = Math.abs(target - lambda) / Math.sqrt(lambda);

    return {
        targetValue: target,
        targetType: 'Event Count',
        rateParameter: lambda,
        probabilities: {
            exactMatch: prob,
            lessThan: probLessThan,
            greaterThan: probGreaterThan,
            interpretation: `P(X = ${target}) = ${prob.toFixed(6)}, P(X ≤ ${target}) = ${probLessThan.toFixed(4)}`
        },
        effectSize: effectSize,
        expectedValue: lambda,
        distributionProperties: {
            mean: lambda,
            variance: lambda,
            standardDeviation: Math.sqrt(lambda),
            mode: Math.floor(lambda),
            skewness: 1 / Math.sqrt(lambda),
            dispersion: 'Equal mean and variance (equidispersion)'
        },
        practicalSignificance: this.assessPoissonPracticalSignificance(target, lambda),
        recommendation: this.generatePoissonRecommendation(target, lambda),
        distributionContext: {
            rateParameter: lambda,
            timeOrAreaUnit: this.unitName,
            processType: 'Homogeneous Poisson process'
        }
    };
}

calculateGeometricTargetAnalysis() {
    const p = this.distributionParams[0];
    const target = this.targetValue;

    if (!Number.isInteger(target) || target < 1) {
        return {
            targetValue: target,
            error: 'Target must be positive integer for Geometric distribution'
        };
    }

    const prob = StatisticalDistributions.geometricPDF(target, p);
    const probLessThan = StatisticalDistributions.geometricCDF(target, p);
    const probGreaterThan = 1 - probLessThan;

    const expectedValue = 1 / p;
    const variance = (1 - p) / (p * p);
    const effectSize = Math.abs(target - expectedValue) / Math.sqrt(variance);

    return {
        targetValue: target,
        targetType: 'Trials Until First Success',
        successProbability: p,
        probabilities: {
            exactMatch: prob,
            lessThan: probLessThan,
            greaterThan: probGreaterThan,
            interpretation: `P(X = ${target}) = ${prob.toFixed(6)}, P(X ≤ ${target}) = ${probLessThan.toFixed(4)}`
        },
        effectSize: effectSize,
        expectedValue: expectedValue,
        distributionProperties: {
            mean: expectedValue,
            variance: variance,
            standardDeviation: Math.sqrt(variance),
            mode: 1,
            skewness: (2 - p) / Math.sqrt(1 - p),
            memoryless: 'No memory - past failures don\'t affect future probability'
        },
        practicalSignificance: this.assessGeometricPracticalSignificance(target, expectedValue),
        recommendation: this.generateGeometricRecommendation(target, p),
        distributionContext: {
            successProbability: p,
            failureProbability: 1 - p,
            expectedTrials: expectedValue.toFixed(2)
        }
    };
}

calculateUniformTargetAnalysis() {
    const [min, max] = this.distributionParams;
    const target = this.targetValue;

    if (target < min || target > max) {
        return {
            targetValue: target,
            error: `Target must be between ${min} and ${max} for Uniform distribution`
        };
    }

    const prob = StatisticalDistributions.uniformPDF(target, min, max);
    const probLessThan = StatisticalDistributions.uniformCDF(target, min, max);
    const probGreaterThan = 1 - probLessThan;

    const expectedValue = (min + max) / 2;
    const variance = Math.pow(max - min, 2) / 12;
    const effectSize = Math.abs(target - expectedValue) / Math.sqrt(variance);

    return {
        targetValue: target,
        targetType: 'Value',
        bounds: { minimum: min, maximum: max },
        probabilities: {
            lessThan: probLessThan,
            greaterThan: probGreaterThan,
            interpretation: `P(X ≤ ${target}) = ${probLessThan.toFixed(4)}, P(X > ${target}) = ${probGreaterThan.toFixed(4)}`
        },
        effectSize: effectSize,
        expectedValue: expectedValue,
        distributionProperties: {
            mean: expectedValue,
            variance: variance,
            standardDeviation: Math.sqrt(variance),
            range: max - min,
            skewness: 0,
            kurtosis: -1.2,
            uniformityIndicator: 'All intervals of equal length have equal probability'
        },
        positionInRange: {
            percentileInRange: ((target - min) / (max - min) * 100).toFixed(1),
            interpretation: `Target is at ${((target - min) / (max - min) * 100).toFixed(1)}% through the range`
        },
        practicalSignificance: this.assessUniformPracticalSignificance(target, min, max),
        recommendation: this.generateUniformRecommendation(target, min, max),
        distributionContext: {
            lowerBound: min,
            upperBound: max,
            width: max - min
        }
    };
}

// ==================== PRACTICAL SIGNIFICANCE ASSESSMENTS ====================

assessBinomialPracticalSignificance(target, expected) {
    const percentDiff = Math.abs(target - expected) / expected * 100;
    if (percentDiff < 5) return 'Very close to expected value';
    if (percentDiff < 15) return 'Moderately close to expected value';
    if (percentDiff < 30) return 'Notably different from expected';
    return 'Substantially different from expected';
}

assessBernoulliPracticalSignificance(target, p) {
    if (target === 1) {
        if (p > 0.7) return 'High probability outcome';
        if (p > 0.3) return 'Moderate probability outcome';
        return 'Low probability outcome';
    } else {
        if (p < 0.3) return 'High probability outcome';
        if (p < 0.7) return 'Moderate probability outcome';
        return 'Low probability outcome';
    }
}

assessPoissonPracticalSignificance(target, lambda) {
    const percentDiff = Math.abs(target - lambda) / lambda * 100;
    if (percentDiff < 10) return 'Within typical variation';
    if (percentDiff < 25) return 'Moderate deviation';
    if (percentDiff < 50) return 'Significant deviation';
    return 'Extreme deviation';
}

assessGeometricPracticalSignificance(target, expected) {
    if (target === 1) return 'Immediate success on first trial';
    if (target <= expected) return 'Earlier than expected success';
    if (target <= 2 * expected) return 'Later than expected but reasonable';
    return 'Unusually delayed success';
}

assessUniformPracticalSignificance(target, min, max) {
    const midpoint = (min + max) / 2;
    const percentDeviation = Math.abs(target - midpoint) / ((max - min) / 2) * 100;
    if (percentDeviation < 20) return 'Near the middle of the range';
    if (percentDeviation < 50) return 'Moderately positioned in range';
    if (percentDeviation < 80) return 'Near one boundary';
    return 'Very close to a boundary';
}

// ==================== RECOMMENDATION GENERATORS ====================

generateBinomialRecommendation(target, expected, n) {
    if (Math.abs(target - expected) < Math.sqrt(n * 0.25)) {
        return `Target of ${target} successes is within typical range. Expected value is ${expected.toFixed(1)}.`;
    } else if (target > expected) {
        return `Target of ${target} successes exceeds expected value of ${expected.toFixed(1)}. Achievement requires above-average performance.`;
    } else {
        return `Target of ${target} successes is below expected value of ${expected.toFixed(1)}. This is a conservative estimate.`;
    }
}

generateBernoulliRecommendation(target, p) {
    if (target === 1) {
        if (p > 0.8) return 'Success is highly likely. Design should assume this outcome.';
        if (p > 0.5) return 'Success is more likely than failure. Plan for success.';
        if (p > 0.2) return 'Success is possible but not guaranteed. Contingency plans needed.';
        return 'Success is unlikely. Plan for failure as primary scenario.';
    } else {
        if (p < 0.2) return 'Failure is highly likely. Design should account for this.';
        if (p < 0.5) return 'Failure is more likely than success. Plan for failure.';
        if (p < 0.8) return 'Failure is possible but not guaranteed. Contingency plans needed.';
        return 'Failure is unlikely. Assume success in most scenarios.';
    }
}

generatePoissonRecommendation(target, lambda) {
    const ratio = target / lambda;
    if (ratio < 0.5) {
        return `Target of ${target} events is substantially below expected rate of ${lambda.toFixed(2)}. Investigate for process improvement opportunities.`;
    } else if (ratio < 1.5) {
        return `Target of ${target} events aligns with expected rate of ${lambda.toFixed(2)}. Process is behaving as anticipated.`;
    } else {
        return `Target of ${target} events exceeds expected rate of ${lambda.toFixed(2)}. Higher intensity than normal - investigate causes.`;
    }
}

generateGeometricRecommendation(target, p) {
    const expected = 1 / p;
    if (target <= expected) {
        return `Success by trial ${target} is faster than average (expected ${expected.toFixed(1)}). Good efficiency.`;
    } else if (target <= 2 * expected) {
        return `Success by trial ${target} is within reasonable timeframe relative to expected ${expected.toFixed(1)}.`;
    } else {
        return `Success by trial ${target} is significantly delayed beyond expected ${expected.toFixed(1)}. Investigate for obstacles.`;
    }
}

generateUniformRecommendation(target, min, max) {
    const range = max - min;
    const midpoint = (min + max) / 2;
    const fromMid = Math.abs(target - midpoint);
    
    if (fromMid < range * 0.1) {
        return 'Target is near the center of the uniform range - equally probable compared to any other point in the range.';
    } else if (fromMid < range * 0.3) {
        return 'Target is moderately positioned within the range - maintains uniform probability properties.';
    } else {
        return 'Target is near the boundary of the uniform range - check if boundary conditions are relevant.';
    }
}

// ==================== CALCULATION WALKTHROUGH METHODS ====================

generateBinomialCalculationWalkthrough() {
    const [n, p] = this.distributionParams;
    const mean = n * p;
    const variance = n * p * (1 - p);

    return {
        parameterEstimation: {
            title: "Parameter Estimation for Binomial Distribution",
            steps: [
                {
                    step: "Step 1: Identify Trial Count",
                    formula: "n = number of independent trials",
                    explanation: `n = ${n} trials (fixed by experimental design)`
                },
                {
                    step: "Step 2: Estimate Success Probability",
                    formula: "p̂ = (number of successes) / n",
                    explanation: `p̂ = ${p.toFixed(4)} (success probability per trial)`
                },
                {
                    step: "Step 3: Calculate Distribution Parameters",
                    formula: "Mean = np, Variance = np(1-p)",
                    explanation: `Mean = ${n} × ${p.toFixed(4)} = ${mean.toFixed(4)}, Variance = ${variance.toFixed(4)}`
                }
            ],
            result: `Binomial(n = ${n}, p = ${p.toFixed(4)})`
        },
        pmf: {
            title: "Probability Mass Function",
            formula: "P(X = k) = C(n,k) × p^k × (1-p)^(n-k)",
            explanation: `For each value k from 0 to ${n}, calculate the binomial coefficient and probability`
        },
        normalApproximation: {
            title: n > 30 ? "Normal Approximation Appropriate" : "Use Exact Binomial (small n)",
            condition: `${n > 5 && n * (1 - p) > 5 ? 'np and n(1-p) > 5: Can approximate with Normal' : 'Use exact binomial distribution'}`,
            parameters: n > 30 ? `N(μ = ${mean.toFixed(4)}, σ = ${Math.sqrt(variance).toFixed(4)})` : 'N/A'
        }
    };
}

generateBernoulliCalculationWalkthrough() {
    const p = this.distributionParams[0];

    return {
        parameterEstimation: {
            title: "Parameter Estimation for Bernoulli Distribution",
            steps: [
                {
                    step: "Step 1: Identify Success Criterion",
                    formula: "Define what constitutes success (X=1) vs failure (X=0)",
                    explanation: "Binary outcome with no middle ground"
                },
                {
                    step: "Step 2: Estimate Success Probability",
                    formula: "p̂ = (number of successes) / (total trials)",
                    explanation: `p̂ = ${p.toFixed(4)} (probability of success in single trial)`
                },
                {
                    step: "Step 3: Verify Parameters",
                    formula: "0 ≤ p ≤ 1, Special cases: p=0 (always fail), p=1 (always succeed)",
                    explanation: `With p = ${p.toFixed(4)}, ${p < 0.5 ? 'failure is more likely' : p > 0.5 ? 'success is more likely' : 'success and failure equally likely'}`
                }
            ],
            result: `Bernoulli(p = ${p.toFixed(4)})`
        },
        pmf: {
            title: "Probability Mass Function",
            formula: "P(X = 0) = 1-p, P(X = 1) = p",
            probabilities: {
                failure: (1 - p).toFixed(6),
                success: p.toFixed(6)
            }
        },
        specialCases: {
            title: "Special Properties",
            binomialRelationship: "Bernoulli(p) = Binomial(n=1, p)",
            meanVariance: `E[X] = ${p.toFixed(4)}, Var[X] = ${(p * (1 - p)).toFixed(6)}`
        }
    };
}

generatePoissonCalculationWalkthrough() {
    const lambda = this.distributionParams[0];
    const n = this.statistics.n;
    const mean = this.statistics.mean;

    return {
        parameterEstimation: {
            title: "Maximum Likelihood Estimation for Poisson Distribution",
            steps: [
                {
                    step: "Step 1: Calculate Sample Mean",
                    formula: "λ̂ = (1/n) × Σxᵢ",
                    explanation: `λ̂ = (1/${n}) × ${this.statistics.sum.toFixed(1)} = ${lambda.toFixed(4)}`
                },
                {
                    step: "Step 2: MLE Property",
                    formula: "For Poisson, sample mean is the MLE of λ",
                    explanation: `λ̂ = ${lambda.toFixed(4)} events per ${this.unitName}`
                },
                {
                    step: "Step 3: Verify Assumptions",
                    formula: "Check: mean ≈ variance (equidispersion test)",
                    explanation: `Sample mean = ${mean.toFixed(4)}, Sample variance = ${this.statistics.variance.toFixed(4)}`
                }
            ],
            result: `Poisson(λ = ${lambda.toFixed(4)})`
        },
        pmf: {
            title: "Probability Mass Function",
            formula: "P(X = k) = (e^(-λ) × λ^k) / k!",
            explanation: "Probability of exactly k events when rate is λ"
        },
        properties: {
            title: "Key Properties",
            equidispersion: `E[X] = Var[X] = λ = ${lambda.toFixed(4)}`,
            standardDeviation: `SD = √λ = ${Math.sqrt(lambda).toFixed(4)}`,
            skewness: `√λ = ${Math.sqrt(lambda).toFixed(4)} (right-skewed, approaches normal as λ increases)`,
            normalApproximation: lambda > 10 ? 
                `λ = ${lambda.toFixed(2)} > 10: Can approximate with N(${lambda.toFixed(2)}, ${Math.sqrt(lambda).toFixed(2)})` :
                'Use exact Poisson (λ ≤ 10)'
        }
    };
}

generateGeometricCalculationWalkthrough() {
    const p = this.distributionParams[0];
    const expected = 1 / p;

    return {
        parameterEstimation: {
            title: "Parameter Estimation for Geometric Distribution",
            steps: [
                {
                    step: "Step 1: Identify Trial Type",
                    formula: "Geometric counts trials X until first success",
                    explanation: "Trials are independent, each with probability p of success"
                },
                {
                    step: "Step 2: Estimate Success Probability",
                    formula: "p̂ = 1 / (mean number of trials)",
                    explanation: `p̂ = 1 / ${this.statistics.mean.toFixed(2)} = ${p.toFixed(4)}`
                },
                {
                    step: "Step 3: Calculate Expected Trials",
                    formula: "E[X] = 1/p",
                    explanation: `Expected trials to first success = ${expected.toFixed(2)}`
                }
            ],
            result: `Geometric(p = ${p.toFixed(4)})`
        },
        pmf: {
            title: "Probability Mass Function",
            formula: "P(X = k) = (1-p)^(k-1) × p for k = 1, 2, 3, ...",
            explanation: "Probability that first success occurs on trial k"
        },
        properties: {
            title: "Distribution Properties",
            expectedValue: `E[X] = 1/p = ${expected.toFixed(4)} trials`,
            variance: `Var[X] = (1-p)/p² = ${((1-p)/(p*p)).toFixed(4)}`,
            memorylessProperty: "P(X > m+n | X > m) = P(X > n) - future is independent of past",
            skewness: `(2-p)/√(1-p) = ${((2-p)/Math.sqrt(1-p)).toFixed(4)} (right-skewed)`
        }
    };
}

generateUniformCalculationWalkthrough() {
    const [min, max] = this.distributionParams;
    const range = max - min;
    const mean = (min + max) / 2;
    const variance = Math.pow(range, 2) / 12;

    return {
        parameterEstimation: {
            title: "Parameter Estimation for Uniform Distribution",
            steps: [
                {
                    step: "Step 1: Identify Range Boundaries",
                    formula: "min = smallest possible value, max = largest possible value",
                    explanation: `Range: [${min}, ${max}]`
                },
                {
                    step: "Step 2: Verify Equal Probability Assumption",
                    formula: "Check that all values in range are equally likely",
                    explanation: "Uniform distribution assumes no preference for values within range"
                },
                {
                    step: "Step 3: Calculate Distribution Parameters",
                    formula: "Mean = (a+b)/2, Variance = (b-a)²/12",
                    explanation: `Mean = ${mean.toFixed(4)}, Variance = ${variance.toFixed(4)}`
                }
            ],
            result: `Uniform(a = ${min}, b = ${max})`
        },
        pdf: {
            title: "Probability Density Function",
            formula: "f(x) = 1/(b-a) for a ≤ x ≤ b, 0 otherwise",
            constantDensity: `f(x) = 1/${range} = ${(1/range).toFixed(6)} on [${min}, ${max}]`
        },
        properties: {
            title: "Distribution Properties",
            expectedValue: `E[X] = (a+b)/2 = ${mean.toFixed(4)}`,
            variance: `Var[X] = (b-a)²/12 = ${variance.toFixed(4)}`,
            standardDeviation: `SD = (b-a)/√12 = ${Math.sqrt(variance).toFixed(4)}`,
            skewness: "0 (perfectly symmetric)",
            kurtosis: "-1.2 (flatter than normal)",
            percentiles: `All intervals of equal length have equal probability`
        }
    };
}

// ==================== DISTRIBUTION PROPERTIES METHODS ====================

calculateBinomialProperties() {
    const [n, p] = this.distributionParams;
    const mean = n * p;
    const variance = n * p * (1 - p);
    const std = Math.sqrt(variance);
    const mode = Math.floor((n + 1) * p);
    const skewness = (1 - 2 * p) / std;

    return {
        'Number of Trials': { value: n.toString(), interpretation: 'Total independent trials' },
        'Success Probability': { value: p.toFixed(4), interpretation: `Probability of success per trial` },
        'Expected Value': { value: mean.toFixed(4), interpretation: 'Average number of successes' },
        'Variance': { value: variance.toFixed(4), interpretation: 'Spread of successes' },
        'Standard Deviation': { value: std.toFixed(4), interpretation: 'Typical deviation from mean' },
        'Mode': { value: mode.toString(), interpretation: 'Most likely number of successes' },
        'Skewness': { 
            value: Math.abs(skewness).toFixed(4), 
            interpretation: Math.abs(skewness) < 0.1 ? 'Nearly symmetric' : p < 0.5 ? 'Right-skewed' : 'Left-skewed'
        },
        'Range': { value: `[0, ${n}]`, interpretation: `Possible values from 0 to ${n} successes` }
    };
}

calculateBernoulliProperties() {
    const p = this.distributionParams[0];
    const variance = p * (1 - p);

    return {
        'Success Probability': { value: p.toFixed(4), interpretation: 'Probability of X=1' },
        'Failure Probability': { value: (1 - p).toFixed(4), interpretation: 'Probability of X=0' },
        'Expected Value': { value: p.toFixed(4), interpretation: 'Average outcome' },
        'Variance': { value: variance.toFixed(6), interpretation: 'Spread of outcomes' },
        'Standard Deviation': { value: Math.sqrt(variance).toFixed(6), interpretation: 'Typical deviation' },
        'Mode': { 
            value: p > 0.5 ? '1 (Success)' : p < 0.5 ? '0 (Failure)' : 'Both equal', 
            interpretation: 'Most likely outcome'
        },
        'Skewness': { 
            value: ((1 - 2*p) / Math.sqrt(variance)).toFixed(4), 
            interpretation: p < 0.5 ? 'Right-skewed' : p > 0.5 ? 'Left-skewed' : 'Symmetric'
        }
    };
}

calculatePoissonProperties() {
    const lambda = this.distributionParams[0];
    const mean = lambda;
    const variance = lambda;
    const std = Math.sqrt(lambda);
    const skewness = 1 / std;

    return {
        'Rate Parameter': { value: lambda.toFixed(4), interpretation: `Events per ${this.unitName}` },
        'Expected Value': { value: mean.toFixed(4), interpretation: 'Average number of events' },
        'Variance': { value: variance.toFixed(4), interpretation: 'Always equal to mean (equidispersion)' },
        'Standard Deviation': { value: std.toFixed(4), interpretation: 'Typical deviation from mean' },
        'Mode': { value: Math.floor(lambda).toString(), interpretation: 'Most likely count' },
        'Median': { 
            value: Math.floor(lambda + 1/3 - 0.02/lambda).toString(), 
            interpretation: '50th percentile approximately' 
        },
        'Skewness': { 
            value: skewness.toFixed(4), 
            interpretation: lambda > 10 ? 'Nearly symmetric' : 'Right-skewed'
        },
        'Characteristic': { 
            value: 'Equidispersion', 
            interpretation: 'Mean = Variance (distinguishes Poisson from other count distributions)'
        }
    };
}

calculateGeometricProperties() {
    const p = this.distributionParams[0];
    const mean = 1 / p;
    const variance = (1 - p) / (p * p);
    const std = Math.sqrt(variance);
    const skewness = (2 - p) / std;

    return {
        'Success Probability': { value: p.toFixed(4), interpretation: 'Probability per trial' },
        'Failure Probability': { value: (1 - p).toFixed(4), interpretation: 'Probability per trial' },
        'Expected Value': { value: mean.toFixed(4), interpretation: 'Average trials until first success' },
        'Variance': { value: variance.toFixed(4), interpretation: 'Spread of trial counts' },
        'Standard Deviation': { value: std.toFixed(4), interpretation: 'Typical deviation from mean' },
        'Mode': { value: '1', interpretation: 'Most likely to succeed on first trial' },
        'Median': { value: Math.ceil(Math.log(0.5) / Math.log(1 - p)).toString(), interpretation: '50th percentile' },
        'Skewness': { value: skewness.toFixed(4), interpretation: 'Always right-skewed' },
        'Memoryless Property': { 
            value: 'P(X > m+n | X > m) = P(X > n)', 
            interpretation: 'Past failures do not affect future probability of success'
        }
    };
}

calculateUniformProperties() {
    const [min, max] = this.distributionParams;
    const range = max - min;
    const mean = (min + max) / 2;
    const variance = Math.pow(range, 2) / 12;
    const std = Math.sqrt(variance);

    return {
        'Lower Bound': { value: min.toFixed(4), interpretation: 'Minimum value' },
        'Upper Bound': { value: max.toFixed(4), interpretation: 'Maximum value' },
        'Range': { value: range.toFixed(4), interpretation: 'Width of interval' },
        'Expected Value': { value: mean.toFixed(4), interpretation: 'Mean of uniform distribution' },
        'Variance': { value: variance.toFixed(4), interpretation: '(b-a)²/12' },
        'Standard Deviation': { value: std.toFixed(4), interpretation: 'Range / √12' },
        'Mode': { value: 'All values equal', interpretation: 'No unique mode' },
        'Median': { value: mean.toFixed(4), interpretation: 'Midpoint of interval' },
        'Skewness': { value: '0', interpretation: 'Perfectly symmetric' },
        'Kurtosis': { value: '-1.2', interpretation: 'Platykurtic (flatter than normal)' }
    };
}

// ==================== PARAMETER INTERPRETATION METHODS ====================

getParameterInterpretationDiscrete(paramName, paramValue) {
    switch(this.selectedDistribution) {
        case 'binomial':
            if (paramName === 'n') return `Number of independent trials: ${paramValue}`;
            if (paramName === 'p') return `Probability of success per trial: ${paramValue.toFixed(4)} (${(paramValue*100).toFixed(1)}%)`;
            break;
        case 'bernoulli':
            return `Probability of success in single trial: ${paramValue.toFixed(4)} (${(paramValue*100).toFixed(1)}%)`;
        case 'poisson':
            return `Rate parameter: ${paramValue.toFixed(4)} events per ${this.unitName}`;
        case 'geometric':
            return `Probability of success per trial: ${paramValue.toFixed(4)} (Expected ${(1/paramValue).toFixed(1)} trials until success)`;
        case 'uniform':
            if (paramName === 'min') return `Lower bound: ${paramValue.toFixed(4)} ${this.unitName}`;
            if (paramName === 'max') return `Upper bound: ${paramValue.toFixed(4)} ${this.unitName}`;
            break;
        default:
            return `Parameter value: ${paramValue.toFixed(4)}`;
    }
}

// ==================== EXTENDED PARAMETER INTERPRETATION ====================

getParameterInterpretationExtended(paramName, paramValue) {
    // Combine continuous and discrete interpretations
    const discreteInterp = this.getParameterInterpretationDiscrete(paramName, paramValue);
    if (discreteInterp !== `Parameter value: ${paramValue.toFixed(4)}`) {
        return discreteInterp;
    }
    
    // Fall back to existing method for continuous distributions
    switch(this.selectedDistribution) {
        case 'normal':
            if (paramName === 'mean') return `Location parameter: ${paramValue.toFixed(4)} ${this.unitName}`;
            if (paramName === 'std') return `Scale parameter: ${paramValue.toFixed(4)} ${this.unitName}`;
            break;
        case 't':
            return `Degrees of freedom: ${paramValue.toFixed(0)}, controls tail behavior`;
        case 'exponential':
            return `Rate: ${paramValue.toFixed(4)} events per time unit`;
        case 'gamma':
            if (paramName === 'shape') {
                return paramValue > 1 ? 'Distribution is right-skewed' : 'Distribution is highly right-skewed';
            } else {
                return `Scale stretches distribution by factor ${paramValue.toFixed(2)}`;
            }
        case 'beta':
            if (paramName === 'alpha') {
                return paramValue > 1 ? 'Favors higher values' : 'Favors lower values';
            } else {
                return paramValue > 1 ? 'Favors lower values' : 'Favors higher values';
            }
        case 'chisquare':
            return `Degrees of freedom: ${paramValue.toFixed(0)}, determines shape and spread`;
        case 'f':
            if (paramName === 'df1') return `Numerator df: ${paramValue.toFixed(0)}`;
            if (paramName === 'df2') return `Denominator df: ${paramValue.toFixed(0)}`;
            break;
        case 'lognormal':
            if (paramName === 'mu') return `Log-scale location: ${paramValue.toFixed(4)}`;
            if (paramName === 'sigma') return `Log-scale scale: ${paramValue.toFixed(4)}`;
            break;
        case 'pareto':
            if (paramName === 'xm') return `Minimum threshold: ${paramValue.toFixed(4)} ${this.unitName}`;
            if (paramName === 'alpha') return `Shape (inequality): ${paramValue.toFixed(4)}`;
            break;
        default:
            return `Parameter value: ${paramValue.toFixed(4)}`;
    }
}

// ==================== PRACTICAL RECOMMENDATIONS - DISCRETE DISTRIBUTIONS ====================

generatePracticalRecommendationsDiscrete() {
    const recommendations = [];
    const dist = DistributionRegistry.getDistribution(this.selectedDistribution);

    switch(this.selectedDistribution) {
        case 'binomial':
            const [n, p] = this.distributionParams;
            recommendations.push("Binomial distribution is ideal for modeling number of successes in fixed number of independent trials.");
            recommendations.push(`With n=${n} trials and p=${p.toFixed(4)}, expect approximately ${(n*p).toFixed(1)} successes on average.`);
            recommendations.push("Useful for quality control, survey responses, and A/B testing scenarios.");
            if (n > 30 && n*p > 5 && n*(1-p) > 5) {
                recommendations.push("Normal approximation is appropriate for this parameter combination (n>30, np>5, n(1-p)>5).");
            }
            if (p === 0.5) {
                recommendations.push("With p=0.5, distribution is perfectly symmetric around n/2.");
            } else if (p < 0.5) {
                recommendations.push(`With p<0.5 (${(p*100).toFixed(1)}%), distribution is right-skewed toward lower success counts.`);
            } else {
                recommendations.push(`With p>0.5 (${(p*100).toFixed(1)}%), distribution is left-skewed toward higher success counts.`);
            }
            break;

        case 'bernoulli':
            const pBern = this.distributionParams[0];
            recommendations.push("Bernoulli distribution models single binary trial outcomes (success/failure).");
            recommendations.push(pBern > 0.5 ? 
                `Success is more likely (${(pBern*100).toFixed(1)}% probability). Design assumes success as default.` :
                `Failure is more likely (${((1-pBern)*100).toFixed(1)}% probability). Plan for failure scenarios.`);
            recommendations.push("Foundational for binomial and geometric distributions (repeated Bernoulli trials).");
            recommendations.push("Use for yes/no decisions, presence/absence indicators, or any binary classification.");
            break;

        case 'poisson':
            const lambda = this.distributionParams[0];
            recommendations.push("Poisson distribution is ideal for modeling count of rare events in fixed time/space intervals.");
            recommendations.push(`With rate λ=${lambda.toFixed(4)}, expect approximately ${lambda.toFixed(1)} events per ${this.unitName}.`);
            recommendations.push("Key property: mean equals variance (equidispersion). Test this assumption with real data.");
            if (lambda > 10) {
                recommendations.push("With λ > 10, normal approximation N(λ, √λ) is appropriate.");
            } else {
                recommendations.push("With λ ≤ 10, use exact Poisson probabilities for accuracy.");
            }
            recommendations.push("Use for: call center arrivals, disease occurrences, typos per page, traffic incidents per hour.");
            break;

        case 'geometric':
            const pGeom = this.distributionParams[0];
            const expectedTrials = 1 / pGeom;
            recommendations.push("Geometric distribution models number of trials until first success.");
            recommendations.push(`With success probability p=${pGeom.toFixed(4)}, expect ${expectedTrials.toFixed(1)} trials on average until first success.`);
            recommendations.push("Memoryless property: past failures don't affect future success probability.");
            if (pGeom > 0.5) {
                recommendations.push("High success probability - expect success quickly.");
            } else if (pGeom < 0.1) {
                recommendations.push("Low success probability - expect many trials before success.");
            }
            recommendations.push("Use for: retry attempts, first customer conversion, equipment failure time (discrete).");
            break;

        case 'uniform':
            const [min, max] = this.distributionParams;
            recommendations.push("Uniform distribution assumes all values in the range are equally likely.");
            recommendations.push(`Range: [${min.toFixed(2)}, ${max.toFixed(2)}], Mean = ${((min+max)/2).toFixed(2)}`);
            recommendations.push("Perfect symmetry - no skewness or preference for any region.");
            recommendations.push("Use when: complete uncertainty within bounds, random number generation, bounded equally-likely values.");
            recommendations.push("Verify assumption: collect data to ensure no systematic preference for certain regions.");
            if (this.statistics.skewness > 0.2) {
                recommendations.push("Warning: Actual data shows skewness. Uniform assumption may not hold.");
            }
            break;

        default:
            recommendations.push(`${dist.name} distribution analysis completed.`);
    }

    return recommendations;
}

// ==================== ENHANCED PRACTICAL RECOMMENDATIONS ====================

generateEnhancedPracticalRecommendations() {
    const baseRecommendations = this.selectedDistribution === 'binomial' || 
                                this.selectedDistribution === 'bernoulli' ||
                                this.selectedDistribution === 'poisson' ||
                                this.selectedDistribution === 'geometric' ||
                                this.selectedDistribution === 'uniform' ?
        this.generatePracticalRecommendationsDiscrete() :
        this.generatePracticalRecommendations();

    const recommendations = [...baseRecommendations];

    // Add goodness of fit recommendations
    const ksTest = this.goodnessOfFit.kolmogorovSmirnov;
    if (ksTest && ksTest.pValue < 0.05) {
        recommendations.push("⚠️ Goodness of fit tests suggest the distribution may not be appropriate. Consider alternative distributions.");
    } else if (ksTest) {
        recommendations.push("✓ Goodness of fit tests support the chosen distribution.");
    }

    // Add sample size recommendations
    if (this.statistics.n < 30) {
        recommendations.push("⚠️ Small sample size: Results should be interpreted cautiously. Collect more data if possible.");
    } else if (this.statistics.n > 1000) {
        recommendations.push("✓ Large sample size provides highly reliable parameter estimates and test results.");
    } else {
        recommendations.push("✓ Adequate sample size for reliable estimates.");
    }

    // Add comparison recommendations
    if (Object.keys(this.comparisonResults).length > 0) {
        const bestFit = this.comparisonResults.bestFit;
        recommendations.push(`Among compared distributions, ${DistributionRegistry.getDistribution(bestFit).name} provides the best fit (lowest AIC).`);
    }

    // Add parameter-specific recommendations
    recommendations.push("\n=== Parameter-Specific Guidance ===");
    this.distributionParams.forEach((param, idx) => {
        const paramName = DistributionRegistry.getDistribution(this.selectedDistribution).params[idx];
        recommendations.push(`• ${paramName}: ${this.getParameterInterpretationExtended(paramName, param)}`);
    });

    return recommendations;
}


calculateBinomialParameterCI(confidence, alpha, n) {
        const [nTrials, p] = this.distributionParams;
        
        // Wilson score interval for p
        const z = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);
        const pHat = p;
        const denominator = 1 + z*z/n;
        const center = (pHat + z*z/(2*n)) / denominator;
        const margin = z * Math.sqrt((pHat*(1-pHat)/n + z*z/(4*n*n))) / denominator;
        
        return {
            parameters: {
                n: {
                    estimate: nTrials,
                    lowerBound: nTrials,
                    upperBound: nTrials,
                    standardError: 0,
                    interpretation: 'Number of trials (fixed by design)'
                },
                p: {
                    estimate: p,
                    lowerBound: Math.max(0, center - margin),
                    upperBound: Math.min(1, center + margin),
                    standardError: Math.sqrt(p * (1-p) / n),
                    interpretation: `Wilson score interval for success probability`
                }
            },
            method: 'Wilson Score Interval'
        };
    }

    calculateBernoulliParameterCI(confidence, alpha, n) {
        const p = this.distributionParams[0];
        
        // Agresti-Coull interval
        const z = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);
        const nTilde = n + z*z;
        const pTilde = (n*p + z*z/2) / nTilde;
        const margin = z * Math.sqrt(pTilde * (1-pTilde) / nTilde);
        
        return {
            parameters: {
                p: {
                    estimate: p,
                    lowerBound: Math.max(0, pTilde - margin),
                    upperBound: Math.min(1, pTilde + margin),
                    standardError: Math.sqrt(p * (1-p) / n),
                    interpretation: `Agresti-Coull confidence interval for probability`
                }
            },
            method: 'Agresti-Coull Interval'
        };
    }

    calculatePoissonParameterCI(confidence, alpha, n) {
        const lambda = this.distributionParams[0];
        
        // Exact CI using chi-square distribution
        const totalEvents = Math.round(lambda * n);
        const lowerBound = totalEvents > 0 
            ? StatisticalDistributions.chiSquareInverse(alpha/2, 2*totalEvents) / (2*n)
            : 0;
        const upperBound = StatisticalDistributions.chiSquareInverse(1 - alpha/2, 2*(totalEvents + 1)) / (2*n);
        
        return {
            parameters: {
                lambda: {
                    estimate: lambda,
                    lowerBound: lowerBound,
                    upperBound: upperBound,
                    standardError: Math.sqrt(lambda / n),
                    interpretation: `Exact Poisson rate confidence interval`
                }
            },
            method: 'Exact Poisson Interval (based on chi-square)'
        };
    }

    calculateGeometricParameterCI(confidence, alpha, n) {
        const p = this.distributionParams[0];
        
        // Approximate CI using normal approximation
        const se = Math.sqrt((1-p) / (n * p * p));
        const z = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);
        
        return {
            parameters: {
                p: {
                    estimate: p,
                    lowerBound: Math.max(0.001, p - z * se),
                    upperBound: Math.min(0.999, p + z * se),
                    standardError: se,
                    interpretation: `Approximate confidence interval for success probability`
                }
            },
            method: 'Normal Approximation'
        };
    }

    calculateUniformParameterCI(confidence, alpha, n) {
        const [min, max] = this.distributionParams;
        
        // Order statistics approach
        const range = max - min;
        const minSE = range / Math.sqrt(12 * n);
        const maxSE = range / Math.sqrt(12 * n);
        const z = StatisticalDistributions.normalInverse(1 - alpha/2, 0, 1);
        
        return {
            parameters: {
                min: {
                    estimate: min,
                    lowerBound: min - z * minSE,
                    upperBound: min + z * minSE,
                    standardError: minSE,
                    interpretation: 'Lower bound of uniform distribution'
                },
                max: {
                    estimate: max,
                    lowerBound: max - z * maxSE,
                    upperBound: max + z * maxSE,
                    standardError: maxSE,
                    interpretation: 'Upper bound of uniform distribution'
                }
            },
            method: 'Order Statistics Method'
        };
    }



    async generateXLSX(filename = 'workbook.xlsx') {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Analysis');

        // Add rows
        this.currentWorkbook.forEach((row, rowIndex) => {
            const excelRow = sheet.getRow(rowIndex + 1);
            row.forEach((cell, colIndex) => {
                const excelCell = excelRow.getCell(colIndex + 1);
                excelCell.value = cell.value;

                // Style based on type
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

        // Auto width columns
        sheet.columns.forEach(column => {
            column.width = 30; // Default width
        });

        await workbook.xlsx.writeFile(filename);
        return filename;
    }


}
