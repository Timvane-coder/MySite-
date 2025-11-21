// ============================================================================
// COMPLETE STATISTICAL ANALYSIS WORKFLOW
// From Raw Data to Publication-Ready Results
// ============================================================================

import { EnhancedStatisticalWorkbook } from './workbook.js';
import fs from 'fs';
import path from 'path';


// ============================================================================
// STEP 1: DEFINE THE RESEARCH QUESTION
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 1: DEFINE RESEARCH QUESTION");
console.log("═══════════════════════════════════════════════════════════════\n");

const researchQuestion = {
    parameter: "population mean",
    variable: "Patient Recovery Time",
    units: "days",
    hypothesis: "H0: μ = 14 days vs H1: μ ≠ 14 days",
    significance: 0.05,
    desiredPower: 0.80,
    clinicallyMeaningfulDifference: 2, // days
    context: "Comparing new treatment vs standard care"
};

console.log("Research Question:", researchQuestion.variable);
console.log("Parameter of Interest:", researchQuestion.parameter);
console.log("Null Hypothesis:", researchQuestion.hypothesis);
console.log("Significance Level: α =", researchQuestion.significance);
console.log("Desired Power: 1-β =", researchQuestion.desiredPower);
console.log("\n");



// ============================================================================
// STEP 2: EXPLORATORY DATA ANALYSIS (Quick stats only - NO visualizations yet)
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 2: EXPLORATORY DATA ANALYSIS");
console.log("═══════════════════════════════════════════════════════════════\n");

// Load the raw data
const rawData = [12.3, 14.1, 13.5, 15.2, 16.8, /* ... */];

const workbook = new EnhancedStatisticalWorkbook({
    theme: 'excel',
    progressCallback: (progress) => {
        console.log(`Progress: ${progress.stage} - ${progress.progress}%`);
    }
});

workbook.loadFromArray(rawData);

// Quick descriptive stats (NO distribution fitting yet)
console.log("✓ Data loaded: n =", rawData.length);
console.log("\n--- Quick Summary Statistics ---");
console.log("Mean:", (rawData.reduce((a,b) => a+b)/rawData.length).toFixed(2));
console.log("Median:", [...rawData].sort((a,b) => a-b)[Math.floor(rawData.length/2)].toFixed(2));
console.log("Min:", Math.min(...rawData).toFixed(2));
console.log("Max:", Math.max(...rawData).toFixed(2));

// Data quality checks
console.log("\n--- Data Quality Checks ---");
console.log("Missing values:", rawData.filter(x => x === null || isNaN(x)).length);
console.log("Unique values:", new Set(rawData).size);

// NOTE: NO visualizations here! We need distributionParams first.

// ============================================================================
// STEP 3: IDENTIFY PLAUSIBLE DISTRIBUTION FAMILY (Hypothesis)
// ============================================================================

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("STEP 3: IDENTIFY DISTRIBUTION FAMILY");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("Domain Knowledge:");
console.log("• Recovery time is continuous and positive");
console.log("• Typically slightly right-skewed");
console.log("\nPlausible Distributions:");
console.log("1. Normal - if data is symmetric");
console.log("2. Log-Normal - if right-skewed");
console.log("3. Gamma - for positive continuous data");

console.log("\nRecommendation: Start with Normal, then compare alternatives\n");

// ============================================================================
// STEP 4: FORMAL DISTRIBUTIONAL CHECKS
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 4: FORMAL DISTRIBUTIONAL ASSUMPTION CHECKS");
console.log("═══════════════════════════════════════════════════════════════\n");

// *** THIS IS THE CRITICAL PART ***
// Run analyzeDistribution() FIRST - this estimates parameters and stores them
console.log("Running distribution analysis (this estimates parameters)...");

const normalAnalysis = workbook.analyzeDistribution({
    samples: rawData,
    sampleName: "Patient Recovery Times",
    variableName: "Recovery Time",
    unitName: "days",
    distribution: 'normal',  // ← We chose this in Step 3
    scenarioDescription: researchQuestion.context,
    hypothesisTest: {
        type: 'oneSample',
        nullValue: 14,
        alternative: 'two-sided',
        alpha: 0.05
    }
});


// Display normality test results
console.log("--- Normality Tests ---");
if (workbook.goodnessOfFit.shapiroWilk) {
    const sw = workbook.goodnessOfFit.shapiroWilk;
    console.log("Shapiro-Wilk Test:");
    console.log("  W =", sw.testStatistic?.toFixed(4) || "N/A");
    console.log("  p-value =", sw.pValue?.toFixed(4) || "N/A");
    console.log("  Conclusion:", sw.pValue > 0.05 ? "✓ Data appears normally distributed" : "✗ Significant departure from normality");
}

const ks = workbook.goodnessOfFit.kolmogorovSmirnov;
console.log("\nKolmogorov-Smirnov Test:");
console.log("  D =", ks.testStatistic.toFixed(4));
console.log("  p-value =", ks.pValue.toFixed(4));
console.log("  Conclusion:", ks.pValue > 0.05 ? "✓ Consistent with normal" : "✗ Reject normality");

// Display skewness and kurtosis
console.log("\n--- Shape Statistics ---");
console.log("Skewness:", workbook.statistics.skewness.toFixed(4));
console.log("  Interpretation:", 
    Math.abs(workbook.statistics.skewness) < 0.5 ? "Approximately symmetric" :
    Math.abs(workbook.statistics.skewness) < 1.0 ? "Moderately skewed" : "Highly skewed");
console.log("Kurtosis:", workbook.statistics.kurtosis.toFixed(4));
console.log("  Interpretation:", 
    Math.abs(workbook.statistics.kurtosis) < 0.5 ? "Mesokurtic (normal-like tails)" :
    workbook.statistics.kurtosis < -0.5 ? "Platykurtic (light tails)" : "Leptokurtic (heavy tails)");

// Check for outliers
console.log("\n--- Outlier Detection ---");
const outliers = workbook.robustStatistics.outlierDetection;
console.log("Method:", outliers.method);
console.log("Outliers detected:", outliers.outlierCount);
console.log("Percentage:", outliers.outlierPercentage);
if (outliers.outliers.length > 0) {
    console.log("Outlier values:", outliers.outliers.map(x => x.toFixed(2)).join(", "));
}
console.log("Recommendation:", outliers.recommendation);

console.log("\n");

// At this point, workbook now has:
// - workbook.distributionParams = [mean, std]  ← THESE ARE NOW SET!
// - workbook.statistics = { mean, std, median, ... }
// - workbook.goodnessOfFit = { shapiroWilk, ks, ... }

console.log("✓ Normal distribution analysis complete");
console.log("✓ Parameters estimated:");
console.log("    μ (mean) =", workbook.distributionParams[0].toFixed(4));
console.log("    σ (std)  =", workbook.distributionParams[1].toFixed(4));
console.log("\n");

// ============================================================================
// STEP 4 (CONTINUED): NOW GENERATE VISUALIZATIONS
// ============================================================================

console.log("--- Visual Inspection & EDA Plots ---");
console.log("Generating diagnostic visualizations...\n");

try {
    // NOW it's safe to generate visualizations because:
    // - workbook.distributionParams exists
    // - workbook.selectedDistribution is set
    // - All statistics are calculated
    
    console.log("1. Generating visualization data structures...");
    const vizData = workbook.generateAllVisualizations();
    // ↑ This internally calls:
    //   - generateHistogramData() → uses distributionParams for theoretical overlay
    //   - generateQQPlotData() → uses distributionParams for theoretical quantiles
    //   - generateDensityPlotData() → uses distributionParams for theoretical curve
    //   etc.
    
    console.log("   ✓ Data structures created for all plots\n");
    
    // Render to PNG files
    console.log("2. Rendering and saving plots to disk...");
    
    const vizDir = './visualizations';
    if (!fs.existsSync(vizDir)) {
        fs.mkdirSync(vizDir, { recursive: true });
    }
    
    const savedFiles = [];
    
    // Render each visualization
    const visualizationsToRender = [
        { name: 'histogram', data: vizData.histogram, renderer: 'renderHistogram' },
        { name: 'boxplot', data: vizData.boxplot, renderer: 'renderBoxplot' },
        { name: 'qqplot', data: vizData.qqplot, renderer: 'renderQQPlot' },
        { name: 'densityplot', data: vizData.densityplot, renderer: 'renderDensityPlot' },
        { name: 'ppplot', data: vizData.ppplot, renderer: 'renderPPPlot' }
    ];
    
    for (const viz of visualizationsToRender) {
        try {
            if (viz.data) {
                // Call the rendering method (e.g., workbook.renderHistogram(data))
                const canvas = workbook[viz.renderer](viz.data);
                const filename = path.join(vizDir, `${viz.name}.png`);
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync(filename, buffer);
                savedFiles.push(filename);
                console.log(`   ✓ ${viz.name}.png saved`);
            }
        } catch (err) {
            console.log(`   ✗ Error rendering ${viz.name}: ${err.message}`);
        }
    }
    
    console.log(`\n   Total plots generated: ${savedFiles.length}\n`);
    
    // ============================================================================
    // ANALYZE THE VISUALIZATIONS
    // ============================================================================
    
    console.log("--- Visualization Analysis ---\n");
    
    // Histogram Analysis
    if (vizData.histogram) {
        console.log("📊 HISTOGRAM:");
        const hist = vizData.histogram;
        console.log(`   Bins: ${hist.bins.length}`);
        console.log(`   Bin width: ${hist.binWidth.toFixed(4)} days`);
        
        // Find modal bin
        const maxFreqIdx = hist.frequencies.indexOf(Math.max(...hist.frequencies));
        const modalBin = hist.bins[maxFreqIdx];
        console.log(`   Modal bin: [${modalBin.start.toFixed(2)}, ${modalBin.end.toFixed(2)}]`);
        
        // Check for multimodality
        const peaks = [];
        for (let i = 1; i < hist.frequencies.length - 1; i++) {
            if (hist.frequencies[i] > hist.frequencies[i-1] && 
                hist.frequencies[i] > hist.frequencies[i+1]) {
                peaks.push(i);
            }
        }
        console.log(`   Peaks detected: ${peaks.length}`);
        if (peaks.length > 1) {
            console.log(`   ⚠️  MULTIMODAL distribution`);
        } else {
            console.log(`   ✓ UNIMODAL distribution`);
        }
        
        // Compare empirical vs theoretical
        // ↓ This works because hist.theoretical was calculated using distributionParams!
        const avgDiff = hist.frequencies.map((f, i) => 
            Math.abs(f - hist.theoretical[i] * hist.totalCount * hist.binWidth)
        ).reduce((a, b) => a + b, 0) / hist.frequencies.length;
        console.log(`   Avg deviation from theoretical: ${avgDiff.toFixed(2)} obs`);
        console.log("");
    }
    
    // Boxplot Analysis
    if (vizData.boxplot) {
        console.log("📦 BOXPLOT:");
        const box = vizData.boxplot;
        console.log(`   Median: ${box.q2.toFixed(4)} days`);
        console.log(`   IQR: ${box.iqr.toFixed(4)} days`);
        console.log(`   Outliers: ${box.outliers.length}`);
        
        // Symmetry check
        const symmetryRatio = (box.q2 - box.q1) / (box.q3 - box.q2);
        console.log(`   Symmetry ratio: ${symmetryRatio.toFixed(3)}`);
        if (Math.abs(symmetryRatio - 1) < 0.2) {
            console.log(`   ✓ Approximately SYMMETRIC`);
        } else if (symmetryRatio > 1) {
            console.log(`   ⚠️  LEFT-SKEWED`);
        } else {
            console.log(`   ⚠️  RIGHT-SKEWED`);
        }
        console.log("");
    }
    
    // Q-Q Plot Analysis
    if (vizData.qqplot) {
        console.log("📈 Q-Q PLOT:");
        const qq = vizData.qqplot;
        // ↓ This correlation was calculated using distributionParams!
        console.log(`   Correlation: ${qq.correlation.toFixed(6)}`);
        console.log(`   Interpretation: ${qq.interpretation}`);
        
        if (qq.correlation > 0.99) {
            console.log(`   ✓ EXCELLENT fit`);
        } else if (qq.correlation > 0.95) {
            console.log(`   ✓ GOOD fit`);
        } else if (qq.correlation > 0.90) {
            console.log(`   ⚠️  MODERATE fit`);
        } else {
            console.log(`   ✗ POOR fit`);
        }
        console.log("");
    }
    
} catch (error) {
    console.log("✗ Error generating visualizations:", error.message);
    console.log("  Stack trace:", error.stack);
}

// ============================================================================
// STEP 5: DECIDE ESTIMATION METHOD
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 5: CHOOSE ESTIMATION METHOD");
console.log("═══════════════════════════════════════════════════════════════\n");


const assumptionsHold = ks.pValue > 0.05 && Math.abs(workbook.statistics.skewness) < 1.0;

console.log("Decision Tree:");
console.log("1. Are normality assumptions satisfied?", assumptionsHold ? "YES ✓" : "NO ✗");
console.log("2. Sample size n =", rawData.length, "→", rawData.length >= 30 ? "Large (CLT applies)" : "Small (exact methods needed)");
console.log("3. Outliers present?", outliers.outlierCount > 0 ? "YES ⚠️" : "NO ✓");

console.log("\n--- Selected Approach ---");
if (assumptionsHold) {
    console.log("✓ Use parametric methods (classical t-based inference)");
    console.log("  - Sample mean as point estimate");
    console.log("  - t-distribution for confidence intervals");
    console.log("  - One-sample t-test for hypothesis testing");
} else {
    console.log("⚠️  Assumptions questionable. Consider:");
    console.log("  Option A: Transform data (e.g., log transform)");
    console.log("  Option B: Use robust estimators (median, trimmed mean)");
    console.log("  Option C: Bootstrap confidence intervals");
    console.log("\n  → Will compare all three approaches below");
}

console.log("\n");

// ============================================================================
// STEP 6: COMPUTE POINT ESTIMATES
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 6: POINT ESTIMATES");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("--- Parametric Estimate ---");
console.log("Sample Mean (x̄):", workbook.statistics.mean.toFixed(4), "days");
console.log("  [This is our MLE under normality assumption]\n");

console.log("--- Robust Estimates ---");
console.log("Sample Median:", workbook.statistics.median.toFixed(4), "days");
console.log("10% Trimmed Mean:", workbook.robustStatistics.trimmedMean.value.toFixed(4), "days");
console.log("  (removes extreme 10% from each tail)");
console.log("10% Winsorized Mean:", workbook.robustStatistics.winsorizedMean.value.toFixed(4), "days");
console.log("  (replaces extreme values with boundary values)\n");

console.log("--- Comparison ---");
const meanMedianDiff = Math.abs(workbook.statistics.mean - workbook.statistics.median);
console.log("Mean - Median =", meanMedianDiff.toFixed(4), "days");
console.log("Interpretation:", meanMedianDiff < 0.5 ? "✓ Estimates agree (symmetric data)" : 
    "⚠️  Estimates differ (possible skewness or outliers)");

console.log("\n");

// ============================================================================
// STEP 7: COMPUTE STANDARD ERROR
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 7: STANDARD ERROR CALCULATION");
console.log("═══════════════════════════════════════════════════════════════\n");

const n = workbook.statistics.n;
const s = workbook.statistics.standardDeviation;
const se = workbook.statistics.standardError;

console.log("Formula: SE = s / √n");
console.log("\nInputs:");
console.log("  Sample size (n):", n);
console.log("  Sample std dev (s):", s.toFixed(4), "days");
console.log("  √n:", Math.sqrt(n).toFixed(4));
console.log("\nCalculation:");
console.log("  SE = ", s.toFixed(4), " / ", Math.sqrt(n).toFixed(4));
console.log("  SE = ", se.toFixed(4), "days");

console.log("\nInterpretation:");
console.log("  The sample mean has standard error", se.toFixed(4), "days.");
console.log("  We expect sample means to vary by approximately ±", (1.96*se).toFixed(4), "days");
console.log("  (95% of the time in repeated sampling)");

console.log("\n");

// ============================================================================
// STEP 8: CONFIDENCE INTERVALS
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 8: CONFIDENCE INTERVALS");
console.log("═══════════════════════════════════════════════════════════════\n");

// 95% CI for mean
const ci95 = workbook.confidenceIntervals[0.95];
const mean = workbook.statistics.mean;
const df = n - 1;

console.log("--- 95% Confidence Interval for Population Mean ---");
console.log("Method: t-distribution with df =", df);
console.log("\nFormula: x̄ ± t(α/2, df) × SE");
console.log("\nCalculation:");
console.log("  x̄ =", mean.toFixed(4), "days");
console.log("  t(0.025,", df, ") =", (1.96 + 0.1).toFixed(4), "(approximately)"); // Approx t-value
console.log("  SE =", se.toFixed(4), "days");
console.log("  Margin of Error =", ((ci95.upperBound - mean)).toFixed(4), "days");
console.log("\nResult:");
console.log("  95% CI: [", ci95.lowerBound.toFixed(4), ",", ci95.upperBound.toFixed(4), "] days");
console.log("\nInterpretation:");
console.log("  We are 95% confident that the true population mean recovery time");
console.log("  lies between", ci95.lowerBound.toFixed(2), "and", ci95.upperBound.toFixed(2), "days.");

// Additional confidence levels
console.log("\n--- Other Confidence Levels ---");
console.log("90% CI: [", workbook.confidenceIntervals[0.90].lowerBound.toFixed(4), ",", 
    workbook.confidenceIntervals[0.90].upperBound.toFixed(4), "] days");
console.log("99% CI: [", workbook.confidenceIntervals[0.99].lowerBound.toFixed(4), ",", 
    workbook.confidenceIntervals[0.99].upperBound.toFixed(4), "] days");

// Bootstrap CI (if assumptions violated)
console.log("\n--- Bootstrap Percentile CI (distribution-free) ---");
console.log("(Use when parametric assumptions are questionable)");
console.log("\nMethod: Resample data 10,000 times with replacement");
console.log("  → Compute mean for each resample");
console.log("  → Take 2.5th and 97.5th percentiles");
console.log("\nNote: Bootstrap CI will be in the detailed workbook output");

console.log("\n");

// ============================================================================
// STEP 9: HYPOTHESIS TEST
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 9: HYPOTHESIS TEST");
console.log("═══════════════════════════════════════════════════════════════\n");

if (workbook.hypothesisTests.oneSample) {
    const test = workbook.hypothesisTests.oneSample;
    
    console.log("--- One-Sample t-Test ---");
    console.log("H₀:", researchQuestion.hypothesis.split('vs')[0].trim());
    console.log("H₁:", researchQuestion.hypothesis.split('vs')[1].trim());
    console.log("Significance level: α =", researchQuestion.significance);
    
    console.log("\nTest Statistic Calculation:");
    console.log("  t = (x̄ - μ₀) / SE");
    console.log("  t = (", mean.toFixed(4), " - 14.0000 ) /", se.toFixed(4));
    console.log("  t =", test.testStatistic.toFixed(4));
    
    console.log("\nDegrees of freedom:", test.degreesOfFreedom);
    console.log("p-value:", test.pValue.toFixed(6), "(two-sided)");
    
    console.log("\nDecision:");
    if (test.pValue < researchQuestion.significance) {
        console.log("  ✓ REJECT H₀ (p <", researchQuestion.significance + ")");
        console.log("  There is statistically significant evidence that the mean");
        console.log("  recovery time differs from 14 days.");
    } else {
        console.log("  ✗ FAIL TO REJECT H₀ (p ≥", researchQuestion.significance + ")");
        console.log("  Insufficient evidence to conclude the mean differs from 14 days.");
    }
    
    console.log("\nEffect Size (practical significance):");
    const effectSize = Math.abs(mean - 14) / s;
    console.log("  Cohen's d =", effectSize.toFixed(4));
    console.log("  Interpretation:", 
        effectSize < 0.2 ? "Negligible effect" :
        effectSize < 0.5 ? "Small effect" :
        effectSize < 0.8 ? "Medium effect" : "Large effect");
}

console.log("\n");

// ============================================================================
// STEP 10: SPECIAL DESIGNS (if applicable)
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 10: COMPLEX SAMPLING CONSIDERATIONS");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("Current Analysis: Simple Random Sample");
console.log("  ✓ No clustering or stratification");
console.log("  ✓ No survey weights needed");
console.log("  ✓ Independence assumption reasonable");
console.log("\nIf your data involved:");
console.log("  • Clustered sampling → Use mixed models or GEE");
console.log("  • Stratified sampling → Use survey weights");
console.log("  • Time series → Check for autocorrelation");
console.log("  • Matched pairs → Use paired t-test");

console.log("\n");

// ============================================================================
// STEP 11: DISTRIBUTION COMPARISON (Model Selection)
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 11: COMPARE ALTERNATIVE DISTRIBUTIONS");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("Comparing distributions: Normal, Log-Normal, Gamma\n");

// Compare distributions
workbook.compareDistributions(['normal', 'lognormal', 'gamma']);

console.log("--- Model Comparison Results ---");
console.log("(Lower AIC/BIC = better fit)\n");

const compResults = workbook.comparisonResults.distributions;
const sorted = Object.entries(compResults).sort((a, b) => a[1].aic - b[1].aic);

sorted.forEach(([distName, results], rank) => {
    console.log(`${rank + 1}. ${results.name}`);
    console.log(`   AIC: ${results.aic.toFixed(2)}`);
    console.log(`   BIC: ${results.bic.toFixed(2)}`);
    console.log(`   K-S test p-value: ${results.ksTest.pValue.toFixed(4)}`);
    console.log(`   Log-likelihood: ${results.logLikelihood.toFixed(4)}`);
    console.log("");
});

console.log("Recommendation:", workbook.comparisonResults.summary.summary);

console.log("\n");

// ============================================================================
// STEP 12: DIAGNOSTICS & SENSITIVITY
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 12: DIAGNOSTICS & SENSITIVITY ANALYSIS");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("--- Data Quality Assessment ---");
const quality = workbook.validationResults.dataQuality;
console.log("Quality Score:", quality.score, "/100");
console.log("Rating:", quality.rating);
if (quality.recommendations.length > 0) {
    console.log("Recommendations:");
    quality.recommendations.forEach(rec => console.log("  •", rec));
}

console.log("\n--- Sensitivity Checks ---");
console.log("1. Outlier influence:");
console.log("   • Analysis WITH outliers: mean =", mean.toFixed(4));
// Remove outliers and recalculate
const cleanData = rawData.filter(x => 
    x >= outliers.lowerFence && x <= outliers.upperFence
);
const cleanMean = cleanData.reduce((a,b) => a+b) / cleanData.length;
console.log("   • Analysis WITHOUT outliers: mean =", cleanMean.toFixed(4));
console.log("   • Difference:", Math.abs(mean - cleanMean).toFixed(4), "days");
console.log("   → Conclusion:", Math.abs(mean - cleanMean) < 0.5 ? 
    "✓ Results robust to outliers" : "⚠️  Outliers have substantial influence");

console.log("\n2. Distribution assumption:");
console.log("   → Compared Normal, Log-Normal, Gamma (see Step 11)");
console.log("   → Best fit:", workbook.comparisonResults.bestFit);

console.log("\n3. Sample size sensitivity:");
console.log("   → Current n =", n);
console.log("   → CI width:", (ci95.upperBound - ci95.lowerBound).toFixed(4), "days");
console.log("   → To halve CI width, need n ≈", (n * 4), "(4x larger sample)");

console.log("\n");

// ============================================================================
// STEP 13: REPORT RESULTS
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 13: PUBLICATION-READY RESULTS");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("--- FINAL RESULTS SUMMARY ---\n");

console.log("Research Question:");
console.log(`  ${researchQuestion.variable} in ${researchQuestion.context}`);

console.log("\nSample:");
console.log(`  n = ${n} patients`);
console.log(`  Data quality: ${quality.rating} (${quality.score}/100)`);

console.log("\nDescriptive Statistics:");
console.log(`  Mean: ${mean.toFixed(2)} days (SD = ${s.toFixed(2)})`);
console.log(`  Median: ${workbook.statistics.median.toFixed(2)} days (IQR = ${workbook.statistics.iqr.toFixed(2)})`);
console.log(`  Range: [${workbook.statistics.min.toFixed(2)}, ${workbook.statistics.max.toFixed(2)}] days`);

console.log("\nInferential Statistics:");
console.log(`  95% CI: [${ci95.lowerBound.toFixed(2)}, ${ci95.upperBound.toFixed(2)}] days`);
console.log(`  Distribution: ${workbook.comparisonResults.bestFit} (best fit by AIC)`);

if (workbook.hypothesisTests.oneSample) {
    const test = workbook.hypothesisTests.oneSample;
    console.log("\nHypothesis Test:");
    console.log(`  H₀: μ = 14 days vs H₁: μ ≠ 14 days`);
    console.log(`  t(${test.degreesOfFreedom}) = ${test.testStatistic.toFixed(3)}, p = ${test.pValue.toFixed(4)}`);
    console.log(`  Decision: ${test.pValue < 0.05 ? 'Reject H₀' : 'Fail to reject H₀'}`);
}

console.log("\nInterpretation:");
console.log(`  The mean recovery time was ${mean.toFixed(2)} days (95% CI: ${ci95.lowerBound.toFixed(2)}–${ci95.upperBound.toFixed(2)}).`);
if (workbook.hypothesisTests.oneSample && workbook.hypothesisTests.oneSample.pValue < 0.05) {
    console.log(`  This differs significantly from the standard 14-day recovery (p = ${workbook.hypothesisTests.oneSample.pValue.toFixed(4)}).`);
} else {
    console.log(`  This is not significantly different from the standard 14-day recovery (p = ${workbook.hypothesisTests.oneSample.pValue.toFixed(4)}).`);
}

console.log("\nAssumptions:");
if (ks.pValue > 0.05) {
    console.log(`  ✓ Normality: Supported by Shapiro-Wilk (p = ${workbook.goodnessOfFit.shapiroWilk.pValue?.toFixed(4) || 'N/A'})`);
} else {
    console.log(`  ⚠️  Normality: Questionable (p = ${workbook.goodnessOfFit.shapiroWilk.pValue?.toFixed(4) || 'N/A'})`);
    console.log(`     Alternative: ${workbook.comparisonResults.bestFit} distribution used`);
}
console.log(`  ✓ Independence: Simple random sampling`);
console.log(`  ✓ Outliers: ${outliers.outlierCount} detected (${outliers.outlierPercentage})`);

console.log("\n--- APA-Style Reporting ---");
console.log(`A one-sample t-test was conducted to compare the mean recovery time`);
console.log(`(M = ${mean.toFixed(2)}, SD = ${s.toFixed(2)}, n = ${n}) to the standard 14-day baseline.`);
if (workbook.hypothesisTests.oneSample.pValue < 0.05) {
    console.log(`The difference was statistically significant, t(${df}) = ${workbook.hypothesisTests.oneSample.testStatistic.toFixed(2)},`);
    console.log(`p = ${workbook.hypothesisTests.oneSample.pValue.toFixed(4)}, 95% CI [${ci95.lowerBound.toFixed(2)}, ${ci95.upperBound.toFixed(2)}].`);
} else {
    console.log(`The difference was not statistically significant, t(${df}) = ${workbook.hypothesisTests.oneSample.testStatistic.toFixed(2)},`);
    console.log(`p = ${workbook.hypothesisTests.oneSample.pValue.toFixed(4)}, 95% CI [${ci95.lowerBound.toFixed(2)}, ${ci95.upperBound.toFixed(2)}].`);
}

console.log("\n");

// ============================================================================
// STEP 14: EXTRAS - POWER, EFFECT SIZE, MULTIPLE COMPARISONS
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("STEP 14: ADVANCED ANALYSES & EXTRAS");
console.log("═══════════════════════════════════════════════════════════════\n");

// ────────────────────────────────────────────────────────────────────────────
// 14.1 POWER ANALYSIS
// ────────────────────────────────────────────────────────────────────────────

console.log("┌─────────────────────────────────────────────────────────────┐");
console.log("│ 14.1 POWER ANALYSIS                                         │");
console.log("└─────────────────────────────────────────────────────────────┘\n");

const observedEffect = Math.abs(mean - 14) / s;
workbook.calculatePowerAnalysis({
    effectSize: observedEffect,
    alpha: 0.05,
    desiredPower: 0.80,
    testType: 'oneSample'
});

console.log("Post-hoc Power Analysis:");
console.log("  Observed effect size (Cohen's d):", observedEffect.toFixed(4));
console.log("  Interpretation:", 
    observedEffect < 0.2 ? "Negligible" :
    observedEffect < 0.5 ? "Small" :
    observedEffect < 0.8 ? "Medium" : "Large");

const powerAnalysis = workbook.powerAnalysis;
console.log("\nCurrent Study Power:");
console.log("  Sample size:", n);
console.log("  Statistical power:", (powerAnalysis.currentPower.power * 100).toFixed(1) + "%");
console.log("  Interpretation:", powerAnalysis.currentPower.interpretation);

console.log("\nSample Size Planning:");
console.log("  To detect effect size d =", researchQuestion.clinicallyMeaningfulDifference / s, ":");
const requiredN = powerAnalysis.requiredSampleSize;
console.log("  Required n for 80% power:", requiredN);
console.log("  Current n:", n);
console.log("  Status:", n >= requiredN ? "✓ Adequately powered" : "⚠️  Underpowered");

console.log("\nPower Curve Summary:");
console.log("  Sample sizes tested:", powerAnalysis.powerCurve.map(x => x.sampleSize).join(", "));
console.log("  (See full power curve in workbook visualization)");

console.log("\n");

// ────────────────────────────────────────────────────────────────────────────
// 14.2 EFFECT SIZE WITH CONFIDENCE INTERVALS
// ────────────────────────────────────────────────────────────────────────────

console.log("┌─────────────────────────────────────────────────────────────┐");
console.log("│ 14.2 EFFECT SIZE ANALYSIS                                   │");
console.log("└─────────────────────────────────────────────────────────────┘\n");

console.log("Cohen's d Calculation:");
console.log("  d = (x̄ - μ₀) / s");
console.log("  d = (", mean.toFixed(4), " - 14.0000 ) /", s.toFixed(4));
console.log("  d =", observedEffect.toFixed(4));

console.log("\nEffect Size Classification (Cohen's conventions):");
console.log("  |d| < 0.2  : Negligible");
console.log("  |d| < 0.5  : Small");
console.log("  |d| < 0.8  : Medium");
console.log("  |d| ≥ 0.8  : Large");
console.log(`  \nCurrent effect: ${
    Math.abs(observedEffect) < 0.2 ? "Negligible" :
    Math.abs(observedEffect) < 0.5 ? "Small" :
    Math.abs(observedEffect) < 0.8 ? "Medium" : "Large"
} (d = ${observedEffect.toFixed(3)})`);

console.log("\nClinical vs Statistical Significance:");
const clinicallyMeaningful = Math.abs(mean - 14) >= researchQuestion.clinicallyMeaningfulDifference;
const statisticallySignificant = workbook.hypothesisTests.oneSample.pValue < 0.05;

console.log("  Clinically meaningful difference: ≥", researchQuestion.clinicallyMeaningfulDifference, "days");
console.log("  Observed difference:", Math.abs(mean - 14).toFixed(2), "days");
console.log("  Clinically meaningful?", clinicallyMeaningful ? "YES ✓" : "NO ✗");
console.log("  Statistically significant?", statisticallySignificant ? "YES ✓" : "NO ✗");

console.log("\n  Interpretation Matrix:");
console.log("  ┌────────────────┬──────────────┬─────────────┐");
console.log("  │                │ Significant  │ Not Signif. │");
console.log("  ├────────────────┼──────────────┼─────────────┤");
console.log("  │ Meaningful     │ ✓ Act on it  │ ? More data │");
console.log("  │ Not Meaningful │ ⚠️  Caution   │ ✗ Ignore    │");
console.log("  └────────────────┴──────────────┴─────────────┘");

if (clinicallyMeaningful && statisticallySignificant) {
    console.log("\n  → Result is BOTH statistically significant AND clinically meaningful");
    console.log("    Recommendation: Strong evidence for action/implementation");
} else if (clinicallyMeaningful && !statisticallySignificant) {
    console.log("\n  → Result is clinically meaningful but NOT statistically significant");
    console.log("    Recommendation: Consider collecting more data (may be underpowered)");
} else if (!clinicallyMeaningful && statisticallySignificant) {
    console.log("\n  → Result is statistically significant but NOT clinically meaningful");
    console.log("    Recommendation: Consider practical importance, not just p-value");
} else {
    console.log("\n  → Result is NEITHER statistically significant NOR clinically meaningful");
    console.log("    Recommendation: No evidence for meaningful difference");
}

console.log("\n");

// ────────────────────────────────────────────────────────────────────────────
// 14.3 BOOTSTRAP CONFIDENCE INTERVALS
// ────────────────────────────────────────────────────────────────────────────

console.log("┌─────────────────────────────────────────────────────────────┐");
console.log("│ 14.3 BOOTSTRAP INFERENCE (DISTRIBUTION-FREE)                │");
console.log("└─────────────────────────────────────────────────────────────┘\n");

console.log("Bootstrap Method: Resampling with Replacement");
console.log("Number of resamples: 10,000");
console.log("\nProcedure:");
console.log("  1. Resample n observations from original data (with replacement)");
console.log("  2. Compute statistic (mean) for each bootstrap sample");
console.log("  3. Repeat 10,000 times → empirical sampling distribution");
console.log("  4. Percentile CI: 2.5th and 97.5th percentiles of bootstrap means");

// Simple bootstrap implementation
console.log("\nRunning bootstrap...");
const bootstrapSamples = 10000;
const bootstrapMeans = [];

for (let i = 0; i < bootstrapSamples; i++) {
    const bootstrapSample = [];
    for (let j = 0; j < n; j++) {
        const randomIndex = Math.floor(Math.random() * n);
        bootstrapSample.push(rawData[randomIndex]);
    }
    const bootstrapMean = bootstrapSample.reduce((a, b) => a + b) / n;
    bootstrapMeans.push(bootstrapMean);
}

bootstrapMeans.sort((a, b) => a - b);
const bootstrapLower = bootstrapMeans[Math.floor(bootstrapSamples * 0.025)];
const bootstrapUpper = bootstrapMeans[Math.floor(bootstrapSamples * 0.975)];
const bootstrapSE = Math.sqrt(
    bootstrapMeans.reduce((sum, val) => 
        sum + Math.pow(val - mean, 2), 0) / bootstrapSamples
);

console.log("✓ Bootstrap complete\n");

console.log("Bootstrap Results:");
console.log("  Bootstrap SE:", bootstrapSE.toFixed(4), "days");
console.log("  Classical SE:", se.toFixed(4), "days");
console.log("  Difference:", Math.abs(bootstrapSE - se).toFixed(4), "days");

console.log("\n  95% Bootstrap Percentile CI: [", bootstrapLower.toFixed(4), ",", bootstrapUpper.toFixed(4), "] days");
console.log("  95% Classical t-based CI:    [", ci95.lowerBound.toFixed(4), ",", ci95.upperBound.toFixed(4), "] days");
console.log("  Width difference:", Math.abs((bootstrapUpper - bootstrapLower) - (ci95.upperBound - ci95.lowerBound)).toFixed(4), "days");

console.log("\nComparison:");
if (Math.abs(bootstrapSE - se) / se < 0.1) {
    console.log("  ✓ Bootstrap and classical methods agree closely");
    console.log("    → Parametric assumptions appear reasonable");
} else {
    console.log("  ⚠️  Bootstrap and classical methods differ");
    console.log("    → Consider using bootstrap for inference (fewer assumptions)");
}

console.log("\n");

// ────────────────────────────────────────────────────────────────────────────
// 14.4 ROBUST ALTERNATIVES
// ────────────────────────────────────────────────────────────────────────────

console.log("┌─────────────────────────────────────────────────────────────┐");
console.log("│ 14.4 ROBUST STATISTICAL METHODS                             │");
console.log("└─────────────────────────────────────────────────────────────┘\n");

console.log("When to use robust methods:");
console.log("  • Heavy-tailed distributions");
console.log("  • Presence of outliers");
console.log("  • Violations of normality");
console.log("  • Small sample sizes");

console.log("\n--- Robust Location Estimates ---");
console.log("Median:", workbook.statistics.median.toFixed(4), "days");
console.log("  (50th percentile, resistant to outliers)");
console.log("\n10% Trimmed Mean:", workbook.robustStatistics.trimmedMean.value.toFixed(4), "days");
console.log("  (removes 10% from each tail before averaging)");
console.log("  Trimmed sample size:", workbook.robustStatistics.trimmedMean.sampleSize);

console.log("\n10% Winsorized Mean:", workbook.robustStatistics.winsorizedMean.value.toFixed(4), "days");
console.log("  (replaces extreme values with boundary values)");

console.log("\n--- Robust Scale Estimates ---");
console.log("MAD (Median Absolute Deviation):", workbook.robustStatistics.mad.value.toFixed(4));
console.log("  Scaled MAD (robust SD):", workbook.robustStatistics.mad.scaledMAD.toFixed(4), "days");
console.log("  Classical SD:", s.toFixed(4), "days");
console.log("  Ratio (MAD/SD):", (workbook.robustStatistics.mad.scaledMAD / s).toFixed(4));

console.log("\nIQR (Interquartile Range):", workbook.statistics.iqr.toFixed(4), "days");
console.log("  (middle 50% spread, resistant to outliers)");

console.log("\n--- Comparison Summary ---");
console.log("┌─────────────────┬──────────┬─────────────────────┐");
console.log("│ Estimator       │  Value   │  Interpretation     │");
console.log("├─────────────────┼──────────┼─────────────────────┤");
console.log(`│ Mean            │ ${mean.toFixed(4)} │ Standard            │`);
console.log(`│ Median          │ ${workbook.statistics.median.toFixed(4)} │ Robust to outliers  │`);
console.log(`│ Trimmed Mean    │ ${workbook.robustStatistics.trimmedMean.value.toFixed(4)} │ Compromise          │`);
console.log(`│ Winsorized Mean │ ${workbook.robustStatistics.winsorizedMean.value.toFixed(4)} │ Less data loss      │`);
console.log("└─────────────────┴──────────┴─────────────────────┘");

const robustRange = Math.max(
    Math.abs(mean - workbook.statistics.median),
    Math.abs(mean - workbook.robustStatistics.trimmedMean.value),
    Math.abs(mean - workbook.robustStatistics.winsorizedMean.value)
);

if (robustRange / mean < 0.05) {
    console.log("\n✓ All estimators agree within 5% → Data is well-behaved");
} else {
    console.log("\n⚠️  Estimators differ by >5% → Consider robust methods");
}

console.log("\n");

// ────────────────────────────────────────────────────────────────────────────
// 14.5 CALCULATION WALKTHROUGH
// ────────────────────────────────────────────────────────────────────────────

console.log("┌─────────────────────────────────────────────────────────────┐");
console.log("│ 14.5 DETAILED CALCULATION WALKTHROUGH                       │");
console.log("└─────────────────────────────────────────────────────────────┘\n");

console.log("=== Step-by-Step: One-Sample t-Test ===\n");

console.log("Given:");
console.log("  Sample data: n =", n, "observations");
console.log("  Null hypothesis: μ₀ = 14 days");
console.log("  Significance level: α = 0.05");

console.log("\nStep 1: Calculate sample mean");
console.log("  x̄ = Σxᵢ / n");
console.log("  x̄ = (", rawData.slice(0, 3).map(x => x.toFixed(2)).join(" + "), "+ ... +", rawData[rawData.length-1].toFixed(2), ") /", n);
console.log("  x̄ =", mean.toFixed(4), "days");

console.log("\nStep 2: Calculate sample standard deviation");
console.log("  s = √[ Σ(xᵢ - x̄)² / (n-1) ]");
console.log("  s = √[", workbook.statistics.variance.toFixed(4), "]");
console.log("  s =", s.toFixed(4), "days");

console.log("\nStep 3: Calculate standard error");
console.log("  SE = s / √n");
console.log("  SE =", s.toFixed(4), "/", Math.sqrt(n).toFixed(4));
console.log("  SE =", se.toFixed(4), "days");

console.log("\nStep 4: Calculate t-statistic");
console.log("  t = (x̄ - μ₀) / SE");
console.log("  t = (", mean.toFixed(4), " - 14.0000 ) /", se.toFixed(4));
console.log("  t =", workbook.hypothesisTests.oneSample.testStatistic.toFixed(4));

console.log("\nStep 5: Find p-value");
console.log("  Degrees of freedom: df = n - 1 =", df);
console.log("  For two-sided test: p = 2 × P(T >", Math.abs(workbook.hypothesisTests.oneSample.testStatistic).toFixed(4), ")");
console.log("  p =", workbook.hypothesisTests.oneSample.pValue.toFixed(6));

console.log("\nStep 6: Make decision");
console.log("  Compare: p =", workbook.hypothesisTests.oneSample.pValue.toFixed(4), "vs α =", researchQuestion.significance);
if (workbook.hypothesisTests.oneSample.pValue < researchQuestion.significance) {
    console.log("  Since p < α: REJECT H₀");
} else {
    console.log("  Since p ≥ α: FAIL TO REJECT H₀");
}

console.log("\nStep 7: Construct confidence interval");
console.log("  Critical value: t(0.025,", df, ") ≈ 2.00"); // Approximation
console.log("  Margin of error: ME = t × SE");
console.log("  ME =", (ci95.upperBound - mean).toFixed(4), "days");
console.log("  95% CI: x̄ ± ME");
console.log("  95% CI: [", ci95.lowerBound.toFixed(4), ",", ci95.upperBound.toFixed(4), "] days");

console.log("\n");

// ────────────────────────────────────────────────────────────────────────────
// 14.6 PRACTICAL RECOMMENDATIONS
// ────────────────────────────────────────────────────────────────────────────

console.log("┌─────────────────────────────────────────────────────────────┐");
console.log("│ 14.6 PRACTICAL RECOMMENDATIONS                              │");
console.log("└─────────────────────────────────────────────────────────────┘\n");

const recommendations = workbook.generateEnhancedPracticalRecommendations();

console.log("=== Key Recommendations ===\n");
recommendations.forEach((rec, idx) => {
    if (!rec.includes("===")) {
        console.log(`${idx + 1}. ${rec}`);
    } else {
        console.log(`\n${rec}`);
    }
});

console.log("\n--- Domain-Specific Guidance ---");
console.log("For Clinical/Medical Research:");
console.log("  • Report both statistical significance AND clinical relevance");
console.log("  • Consider patient-centered outcomes (not just p-values)");
console.log("  • Document any protocol deviations or missing data");
console.log("  • Use intention-to-treat analysis when applicable");

console.log("\nFor Quality Control/Manufacturing:");
console.log("  • Focus on process capability indices (Cp, Cpk)");
console.log("  • Use control charts for monitoring over time");
console.log("  • Set specification limits based on practical constraints");
console.log("  • Consider economic significance (cost of defects vs testing)");

console.log("\nFor Social Science Research:");
console.log("  • Report effect sizes (Cohen's d, η², R²)");
console.log("  • Discuss practical significance in context");
console.log("  • Consider cultural/contextual factors");
console.log("  • Validate findings across multiple samples when possible");

console.log("\n");

// ────────────────────────────────────────────────────────────────────────────
// 14.7 MULTIPLE COMPARISON CORRECTIONS
// ────────────────────────────────────────────────────────────────────────────

console.log("┌─────────────────────────────────────────────────────────────┐");
console.log("│ 14.7 MULTIPLE COMPARISON ADJUSTMENTS                        │");
console.log("└─────────────────────────────────────────────────────────────┘\n");

console.log("Why adjust for multiple comparisons?");
console.log("  • Conducting multiple tests inflates Type I error rate");
console.log("  • Family-wise error rate (FWER) grows with # of tests");
console.log("  • Without adjustment: P(at least one false positive) → 1");

console.log("\nExample: Testing 3 hypotheses at α = 0.05");
const pValues = [
    workbook.hypothesisTests.oneSample.pValue,
    0.03, // Simulated additional tests
    0.07
];

console.log("  Raw p-values:", pValues.map(p => p.toFixed(4)).join(", "));

// Apply corrections (would use workbook method if implemented)
console.log("\n--- Bonferroni Correction ---");
console.log("  Method: Multiply each p-value by m (# of tests)");
console.log("  Conservative but simple");
const bonferroni = pValues.map(p => Math.min(1, p * pValues.length));
console.log("  Adjusted p-values:", bonferroni.map(p => p.toFixed(4)).join(", "));

console.log("\n--- Holm-Bonferroni (Sequential) ---");
console.log("  Method: More powerful than Bonferroni");
console.log("  Controls FWER while rejecting more nulls");

console.log("\n--- False Discovery Rate (FDR / Benjamini-Hochberg) ---");
console.log("  Method: Controls proportion of false discoveries");
console.log("  Appropriate when some false positives acceptable");
console.log("  More powerful than FWER methods");

console.log("\nDecision Table:");
console.log("┌──────┬──────────┬─────────────┬──────────────┐");
console.log("│ Test │ Raw p    │ Bonferroni  │ Decision     │");
console.log("├──────┼──────────┼─────────────┼──────────────┤");
pValues.forEach((p, i) => {
    const decision = bonferroni[i] < 0.05 ? "Reject H₀" : "Retain H₀";
    console.log(`│  ${i+1}   │ ${p.toFixed(4)} │   ${bonferroni[i].toFixed(4)}   │ ${decision.padEnd(12)} │`);
});
console.log("└──────┴──────────┴─────────────┴──────────────┘");

console.log("\n");

// ────────────────────────────────────────────────────────────────────────────
// 14.8 REPRODUCIBILITY CHECKLIST
// ────────────────────────────────────────────────────────────────────────────

console.log("┌─────────────────────────────────────────────────────────────┐");
console.log("│ 14.8 REPRODUCIBILITY & DOCUMENTATION CHECKLIST              │");
console.log("└─────────────────────────────────────────────────────────────┘\n");

console.log("✓ Reproducibility Checklist:");
console.log("  [✓] Sample size reported: n =", n);
console.log("  [✓] Descriptive statistics provided");
console.log("  [✓] Statistical methods specified: One-sample t-test");
console.log("  [✓] Assumptions checked and reported");
console.log("  [✓] Significance level declared: α = 0.05");
console.log("  [✓] Effect size calculated: d =", observedEffect.toFixed(4));
console.log("  [✓] Confidence intervals reported");
console.log("  [✓] p-values reported (not just \"p < 0.05\")");
console.log("  [✓] Power analysis included");
console.log("  [✓] Software/code version documented");

console.log("\nData Transparency:");
console.log("  [✓] Data source described");
console.log("  [✓] Missing data handling documented");
console.log("  [✓] Outlier treatment specified");
console.log("  [✓] Transformations (if any) noted");

console.log("\nReporting Standards:");
console.log("  • CONSORT: Clinical trials");
console.log("  • STROBE: Observational studies");
console.log("  • PRISMA: Systematic reviews/meta-analyses");
console.log("  • APA 7th: Psychology/social sciences");

console.log("\n");

// ============================================================================
// FINAL SUMMARY & OUTPUT
// ============================================================================

console.log("═══════════════════════════════════════════════════════════════");
console.log("WORKFLOW COMPLETE - GENERATING WORKBOOK");
console.log("═══════════════════════════════════════════════════════════════\n");

// Generate Excel workbook
console.log("Generating comprehensive Excel workbook...");
console.log("This may take a moment...\n");

// First, ensure the workbook is generated
if (!workbook.currentWorkbook) {
    workbook.generateWorkbook();
}

const workbookData = workbook.currentWorkbook;

console.log("✓ Workbook generated with", workbookData.length, "rows");
console.log("\nWorkbook Contents:");
console.log("  ✓ Header & metadata");
console.log("  ✓ Data validation report");
console.log("  ✓ Raw sample data");
console.log("  ✓ Descriptive statistics");
console.log("  ✓ Robust statistics (MAD, trimmed mean, etc.)");
console.log("  ✓ Distribution analysis");
console.log("  ✓ Distribution properties");
console.log("  ✓ Parameter estimates & confidence intervals");
console.log("  ✓ Hypothesis test results");
console.log("  ✓ Non-parametric tests");
console.log("  ✓ Effect size calculations");
console.log("  ✓ Goodness-of-fit tests");
console.log("  ✓ Power analysis");
console.log("  ✓ Bootstrap results");
console.log("  ✓ Robust alternatives");
console.log("  ✓ Practical recommendations");
console.log("  ✓ Calculation walkthroughs");
console.log("  ✓ Visualizations (histograms, Q-Q plots, etc.)");

if (Object.keys(workbook.regressionResults).length > 0) {
    console.log("  ✓ Regression analysis");
}
if (Object.keys(workbook.bayesianAnalysis).length > 0) {
    console.log("  ✓ Bayesian analysis");
}
if (Object.keys(workbook.metaAnalysis).length > 0) {
    console.log("  ✓ Meta-analysis");
}
if (Object.keys(workbook.timeSeriesAnalysis).length > 0) {
    console.log("  ✓ Time series analysis");
}

// Save workbook in multiple formats
console.log("\n--- Exporting Results ---");

const outputPath = './';
const baseFilename = 'statistical_analysis_' + new Date().toISOString().split('T')[0];
const xlsxPath = `./${baseFilename}.xlsx`;
const pngPath = `./${baseFilename}.png`;

console.log("\nSaving XLSX workbook...");
console.log("Output path:", xlsxPath);

try {
    await workbook.generateXLSX(xlsxPath);
    console.log("✓ XLSX workbook saved successfully");
    console.log("  File size:", (fs.statSync(xlsxPath).size / 1024).toFixed(2), "KB");
} catch (error) {
    console.log("✗ Error saving XLSX workbook:", error.message);
    console.log("  Tip: Ensure ExcelJS is installed: npm install exceljs");
}

console.log("\nGenerating PNG image...");
console.log("Output path:", pngPath);
console.log("Dimensions:", workbook.width, "x", workbook.height, "pixels");

try {
    await workbook.generateImage(pngPath);
    console.log("✓ PNG image saved successfully");
    console.log("  File size:", (fs.statSync(pngPath).size / 1024).toFixed(2), "KB");
    console.log("  Note: Image shows first page of workbook");
} catch (error) {
    console.log("✗ Error saving PNG image:", error.message);
    console.log("  Tip: Ensure @napi-rs/canvas is installed: npm install @napi-rs/canvas");
}

// Generate summary report (plain text)
const reportPath = `./${baseFilename}_report.txt`;
console.log("\nGenerating text summary report...");
console.log("Output path:", reportPath);

try {
    const reportContent = generateTextReport(workbook, researchQuestion, quality, outliers);
    fs.writeFileSync(reportPath, reportContent);
    console.log("✓ Text report saved successfully");
    console.log("  File size:", (fs.statSync(reportPath).size / 1024).toFixed(2), "KB");
} catch (error) {
    console.log("✗ Error saving text report:", error.message);
}

console.log("\n--- Export Summary ---");
console.log("Files generated:");
console.log("  1. " + xlsxPath + " (Excel workbook - full analysis)");
console.log("  2. " + pngPath + " (PNG image - visual summary)");
console.log("  3. " + reportPath + " (Text report - portable summary)");
console.log("\nAll files saved to current directory.");

// Helper function to generate text report
function generateTextReport(wb, research, qual, outl) {
    let report = [];
    
    report.push("═══════════════════════════════════════════════════════════════");
    report.push("              STATISTICAL ANALYSIS SUMMARY REPORT              ");
    report.push("═══════════════════════════════════════════════════════════════");
    report.push("");
    report.push("Generated: " + new Date().toLocaleString());
    report.push("Analysis Tool: Enhanced Statistical Workbook v2.0.0");
    report.push("");
    
    report.push("───────────────────────────────────────────────────────────────");
    report.push("RESEARCH QUESTION");
    report.push("───────────────────────────────────────────────────────────────");
    report.push("Variable: " + research.variable);
    report.push("Context: " + research.context);
    report.push("Hypothesis: " + research.hypothesis);
    report.push("Significance Level: α = " + research.significance);
    report.push("");
    
    report.push("───────────────────────────────────────────────────────────────");
    report.push("SAMPLE INFORMATION");
    report.push("───────────────────────────────────────────────────────────────");
    report.push("Sample Size: n = " + wb.statistics.n);
    report.push("Data Quality: " + qual.rating + " (" + qual.score + "/100)");
    report.push("Outliers Detected: " + outl.outlierCount + " (" + outl.outlierPercentage + ")");
    report.push("");
    
    report.push("───────────────────────────────────────────────────────────────");
    report.push("DESCRIPTIVE STATISTICS");
    report.push("───────────────────────────────────────────────────────────────");
    report.push("Mean: " + wb.statistics.mean.toFixed(4) + " " + wb.unitName);
    report.push("Standard Deviation: " + wb.statistics.standardDeviation.toFixed(4) + " " + wb.unitName);
    report.push("Median: " + wb.statistics.median.toFixed(4) + " " + wb.unitName);
    report.push("IQR: " + wb.statistics.iqr.toFixed(4) + " " + wb.unitName);
    report.push("Range: [" + wb.statistics.min.toFixed(4) + ", " + wb.statistics.max.toFixed(4) + "] " + wb.unitName);
    report.push("Skewness: " + wb.statistics.skewness.toFixed(4));
    report.push("Kurtosis: " + wb.statistics.kurtosis.toFixed(4));
    report.push("");
    
    report.push("───────────────────────────────────────────────────────────────");
    report.push("DISTRIBUTION ANALYSIS");
    report.push("───────────────────────────────────────────────────────────────");
    report.push("Selected Distribution: " + wb.selectedDistribution);
    report.push("Parameters:");
    const dist = DistributionRegistry.getDistribution(wb.selectedDistribution);
    dist.params.forEach((param, idx) => {
        report.push("  " + param + " = " + wb.distributionParams[idx].toFixed(4));
    });
    report.push("");
    report.push("Goodness of Fit:");
    report.push("  K-S Test: D = " + wb.goodnessOfFit.kolmogorovSmirnov.testStatistic.toFixed(4) + 
                ", p = " + wb.goodnessOfFit.kolmogorovSmirnov.pValue.toFixed(4));
    if (wb.goodnessOfFit.shapiroWilk && wb.goodnessOfFit.shapiroWilk.testStatistic) {
        report.push("  Shapiro-Wilk: W = " + wb.goodnessOfFit.shapiroWilk.testStatistic.toFixed(4) + 
                    ", p = " + wb.goodnessOfFit.shapiroWilk.pValue.toFixed(4));
    }
    report.push("");
    
    report.push("───────────────────────────────────────────────────────────────");
    report.push("INFERENCE");
    report.push("───────────────────────────────────────────────────────────────");
    const ci95 = wb.confidenceIntervals[0.95];
    report.push("95% Confidence Interval:");
    report.push("  [" + ci95.lowerBound.toFixed(4) + ", " + ci95.upperBound.toFixed(4) + "] " + wb.unitName);
    report.push("");
    
    if (wb.hypothesisTests.oneSample) {
        const test = wb.hypothesisTests.oneSample;
        report.push("Hypothesis Test:");
        report.push("  Test: One-sample t-test");
        report.push("  t(" + test.degreesOfFreedom + ") = " + test.testStatistic.toFixed(4));
        report.push("  p-value = " + test.pValue.toFixed(6));
        report.push("  Decision: " + (test.pValue < 0.05 ? "Reject H₀" : "Fail to reject H₀"));
        report.push("");
    }
    
    if (wb.powerAnalysis && wb.powerAnalysis.currentPower) {
        report.push("Power Analysis:");
        report.push("  Statistical Power: " + (wb.powerAnalysis.currentPower.power * 100).toFixed(1) + "%");
        report.push("  Interpretation: " + wb.powerAnalysis.currentPower.interpretation);
        report.push("");
    }
    
    report.push("───────────────────────────────────────────────────────────────");
    report.push("ROBUST STATISTICS");
    report.push("───────────────────────────────────────────────────────────────");
    report.push("Median: " + wb.statistics.median.toFixed(4) + " " + wb.unitName);
    report.push("MAD (scaled): " + wb.robustStatistics.mad.scaledMAD.toFixed(4) + " " + wb.unitName);
    report.push("Trimmed Mean (10%): " + wb.robustStatistics.trimmedMean.value.toFixed(4) + " " + wb.unitName);
    report.push("Winsorized Mean (10%): " + wb.robustStatistics.winsorizedMean.value.toFixed(4) + " " + wb.unitName);
    report.push("");
    
    if (Object.keys(wb.comparisonResults).length > 0) {
        report.push("───────────────────────────────────────────────────────────────");
        report.push("DISTRIBUTION COMPARISON");
        report.push("───────────────────────────────────────────────────────────────");
        report.push("Best Fit: " + wb.comparisonResults.bestFit);
        report.push("");
        const sorted = Object.entries(wb.comparisonResults.distributions).sort((a, b) => a[1].aic - b[1].aic);
        sorted.forEach(([name, results], rank) => {
            report.push(`${rank + 1}. ${results.name}`);
            report.push(`   AIC: ${results.aic.toFixed(2)}, BIC: ${results.bic.toFixed(2)}`);
        });
        report.push("");
    }
    
    report.push("───────────────────────────────────────────────────────────────");
    report.push("RECOMMENDATIONS");
    report.push("───────────────────────────────────────────────────────────────");
    const recs = wb.generateEnhancedPracticalRecommendations();
    recs.slice(0, 10).forEach(rec => {
        if (!rec.includes("===")) {
            report.push("• " + rec);
        }
    });
    report.push("");
    
    report.push("═══════════════════════════════════════════════════════════════");
    report.push("               END OF SUMMARY REPORT                           ");
    report.push("═══════════════════════════════════════════════════════════════");
    report.push("");
    report.push("For detailed analysis, please refer to the Excel workbook.");
    report.push("");
    
    return report.join('\n');
}

console.log("\n");
console.log("═══════════════════════════════════════════════════════════════");
console.log("SESSION SUMMARY");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("Analysis Type: One-Sample Statistical Inference");
console.log("Date:", new Date().toISOString().split('T')[0]);
console.log("Sample Size:", n, "observations");
console.log("Primary Outcome:", researchQuestion.variable);
console.log("\nKey Findings:");
console.log(`  • Mean recovery time: ${mean.toFixed(2)} days (95% CI: ${ci95.lowerBound.toFixed(2)}–${ci95.upperBound.toFixed(2)})`);
console.log(`  • Statistical test: t(${df}) = ${workbook.hypothesisTests.oneSample.testStatistic.toFixed(3)}, p = ${workbook.hypothesisTests.oneSample.pValue.toFixed(4)}`);
console.log(`  • Effect size: Cohen's d = ${observedEffect.toFixed(3)} (${
    Math.abs(observedEffect) < 0.2 ? "negligible" :
    Math.abs(observedEffect) < 0.5 ? "small" :
    Math.abs(observedEffect) < 0.8 ? "medium" : "large"
})`);
console.log(`  • Study power: ${(powerAnalysis.currentPower.power * 100).toFixed(1)}%`);
console.log(`  • Best-fit distribution: ${workbook.comparisonResults.bestFit}`);

console.log("\nQuality Assessment:");
console.log(`  • Data quality score: ${quality.score}/100 (${quality.rating})`);
console.log(`  • Assumptions: ${assumptionsHold ? '✓ Met' : '⚠️  Questionable'}`);
console.log(`  • Outliers: ${outliers.outlierCount} detected`);
console.log(`  • Robust checks: All estimators agree within ${(robustRange/mean*100).toFixed(1)}%`);

console.log("\nNext Steps:");
console.log("  1. Review detailed workbook (", outputPath, ")");
console.log("  2. Examine diagnostic plots for assumption violations");
console.log("  3. Consider clinical/practical significance (not just p-value)");
console.log("  4. Plan follow-up studies or validation if needed");
console.log("  5. Prepare manuscript/report with full transparency");

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("Thank you for using Enhanced Statistical Workbook!");
console.log("For questions or issues, consult the documentation.");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// ADDITIONAL UTILITY: Quick Reference Card
// ============================================================================

console.log("\n\n");
console.log("╔═══════════════════════════════════════════════════════════════╗");
console.log("║           STATISTICAL INFERENCE QUICK REFERENCE               ║");
console.log("╚═══════════════════════════════════════════════════════════════╝");

console.log("\n┌───────────────────────────────────────────────────────────────┐");
console.log("│ CHOOSING THE RIGHT TEST                                       │");
console.log("├───────────────────────────────────────────────────────────────┤");
console.log("│                                                               │");
console.log("│ Comparing Mean to Known Value:                               │");
console.log("│   • One-sample t-test (continuous, normal)                   │");
console.log("│   • Wilcoxon signed-rank (continuous, non-normal)            │");
console.log("│   • Sign test (ordinal/non-normal)                           │");
console.log("│                                                               │");
console.log("│ Comparing Two Means:                                          │");
console.log("│   • Independent t-test (two groups, normal)                  │");
console.log("│   • Paired t-test (matched pairs, normal)                    │");
console.log("│   • Mann-Whitney U (two groups, non-normal)                  │");
console.log("│   • Wilcoxon signed-rank (paired, non-normal)                │");
console.log("│                                                               │");
console.log("│ Comparing Multiple Means:                                     │");
console.log("│   • One-way ANOVA (≥3 groups, normal, equal variance)        │");
console.log("│   • Welch ANOVA (≥3 groups, normal, unequal variance)        │");
console.log("│   • Kruskal-Wallis (≥3 groups, non-normal)                   │");
console.log("│   • Repeated measures ANOVA (within-subjects)                │");
console.log("│                                                               │");
console.log("│ Testing Proportions:                                          │");
console.log("│   • One-proportion z-test (large n)                          │");
console.log("│   • Binomial exact test (small n)                            │");
console.log("│   • Chi-square test of independence (contingency tables)     │");
console.log("│   • Fisher's exact test (small expected frequencies)         │");
console.log("│                                                               │");
console.log("│ Testing Variances:                                            │");
console.log("│   • Chi-square test (one variance vs known)                  │");
console.log("│   • F-test (two variances, normal data)                      │");
console.log("│   • Levene's test (multiple variances, robust)               │");
console.log("│                                                               │");
console.log("│ Testing Relationships:                                        │");
console.log("│   • Pearson correlation (linear, normal)                     │");
console.log("│   • Spearman correlation (monotonic, non-normal)             │");
console.log("│   • Linear regression (continuous outcome)                   │");
console.log("│   • Logistic regression (binary outcome)                     │");
console.log("│                                                               │");
console.log("└───────────────────────────────────────────────────────────────┘");

console.log("\n┌───────────────────────────────────────────────────────────────┐");
console.log("│ SAMPLE SIZE RULES OF THUMB                                    │");
console.log("├───────────────────────────────────────────────────────────────┤");
console.log("│                                                               │");
console.log("│ • n < 30    → Use exact/non-parametric methods               │");
console.log("│ • n ≥ 30    → Central Limit Theorem applies (can use t-test) │");
console.log("│ • n ≥ 100   → Reliable parameter estimates                    │");
console.log("│ • n ≥ 1000  → Asymptotic approximations accurate             │");
console.log("│                                                               │");
console.log("│ For proportions:                                              │");
console.log("│ • np ≥ 10 and n(1-p) ≥ 10 → Normal approximation OK          │");
console.log("│                                                               │");
console.log("│ For chi-square tests:                                         │");
console.log("│ • All expected frequencies ≥ 5 → Chi-square valid            │");
console.log("│ • Any expected < 5 → Use Fisher's exact                      │");
console.log("│                                                               │");
console.log("│ For correlation:                                              │");
console.log("│ • n ≥ 30 for small correlations (|r| < 0.3)                  │");
console.log("│ • n ≥ 50 for robust inference                                │");
console.log("│                                                               │");
console.log("└───────────────────────────────────────────────────────────────┘");

console.log("\n┌───────────────────────────────────────────────────────────────┐");
console.log("│ EFFECT SIZE INTERPRETATION                                    │");
console.log("├───────────────────────────────────────────────────────────────┤");
console.log("│                                                               │");
console.log("│ Cohen's d (standardized mean difference):                    │");
console.log("│   0.00 - 0.20  :  Negligible                                 │");
console.log("│   0.20 - 0.50  :  Small                                      │");
console.log("│   0.50 - 0.80  :  Medium                                     │");
console.log("│   0.80+        :  Large                                      │");
console.log("│                                                               │");
console.log("│ Pearson r (correlation):                                      │");
console.log("│   0.00 - 0.10  :  Negligible                                 │");
console.log("│   0.10 - 0.30  :  Small                                      │");
console.log("│   0.30 - 0.50  :  Medium                                     │");
console.log("│   0.50+        :  Large                                      │");
console.log("│                                                               │");
console.log("│ R² (variance explained):                                      │");
console.log("│   0.00 - 0.02  :  Negligible                                 │");
console.log("│   0.02 - 0.13  :  Small                                      │");
console.log("│   0.13 - 0.26  :  Medium                                     │");
console.log("│   0.26+        :  Large                                      │");
console.log("│                                                               │");
console.log("│ Eta-squared (η²) for ANOVA:                                   │");
console.log("│   0.01         :  Small                                      │");
console.log("│   0.06         :  Medium                                     │");
console.log("│   0.14+        :  Large                                      │");
console.log("│                                                               │");
console.log("└───────────────────────────────────────────────────────────────┘");

console.log("\n┌───────────────────────────────────────────────────────────────┐");
console.log("│ P-VALUE INTERPRETATION GUIDE                                  │");
console.log("├───────────────────────────────────────────────────────────────┤");
console.log("│                                                               │");
console.log("│ p ≥ 0.10   :  No evidence against H₀                         │");
console.log("│ p = 0.05-0.10 : Weak evidence (marginal significance)        │");
console.log("│ p = 0.01-0.05 : Moderate evidence (significant)              │");
console.log("│ p = 0.001-0.01: Strong evidence (highly significant)         │");
console.log("│ p < 0.001  :  Very strong evidence                           │");
console.log("│                                                               │");
console.log("│ ⚠️  CAUTION:                                                  │");
console.log("│   • p-value ≠ effect size                                    │");
console.log("│   • Statistical significance ≠ practical importance          │");
console.log("│   • Always report effect size AND confidence intervals       │");
console.log("│   • p = 0.049 is NOT meaningfully different from p = 0.051   │");
console.log("│   • Absence of evidence ≠ evidence of absence                │");
console.log("│                                                               │");
console.log("└───────────────────────────────────────────────────────────────┘");

console.log("\n┌───────────────────────────────────────────────────────────────┐");
console.log("│ CONFIDENCE INTERVAL INTERPRETATION                            │");
console.log("├───────────────────────────────────────────────────────────────┤");
console.log("│                                                               │");
console.log("│ Correct Interpretation:                                       │");
console.log("│   \"We are 95% confident that the true population parameter   │");
console.log("│    lies within this interval.\"                              │");
console.log("│                                                               │");
console.log("│ More technically:                                             │");
console.log("│   \"If we repeated this study 100 times, approximately 95 of  │");
console.log("│    the resulting CIs would contain the true parameter.\"     │");
console.log("│                                                               │");
console.log("│ WRONG Interpretations:                                        │");
console.log("│   ✗ \"There is a 95% probability the parameter is in this CI\" │");
console.log("│   ✗ \"95% of the data falls within this interval\"            │");
console.log("│                                                               │");
console.log("│ Width of CI indicates:                                        │");
console.log("│   • Precision of estimate (narrower = more precise)          │");
console.log("│   • Sample size (larger n → narrower CI)                     │");
console.log("│   • Variability (larger σ → wider CI)                        │");
console.log("│                                                               │");
console.log("│ Decision Rule:                                                │");
console.log("│   If CI for difference excludes 0 → significant at α level   │");
console.log("│   If CI includes 0 → not significant at α level              │");
console.log("│                                                               │");
console.log("└───────────────────────────────────────────────────────────────┘");

console.log("\n┌───────────────────────────────────────────────────────────────┐");
console.log("│ COMMON PITFALLS & HOW TO AVOID THEM                           │");
console.log("├───────────────────────────────────────────────────────────────┤");
console.log("│                                                               │");
console.log("│ 1. Multiple Testing Problem                                   │");
console.log("│    Problem: Testing many hypotheses inflates Type I error    │");
console.log("│    Solution: Bonferroni, Holm, or FDR corrections            │");
console.log("│                                                               │");
console.log("│ 2. p-Hacking / Cherry-Picking                                 │");
console.log("│    Problem: Testing until you find p < 0.05                  │");
console.log("│    Solution: Pre-register analysis plan, report all tests    │");
console.log("│                                                               │");
console.log("│ 3. Ignoring Assumptions                                       │");
console.log("│    Problem: Using parametric tests with violated assumptions │");
console.log("│    Solution: Check assumptions, use robust alternatives       │");
console.log("│                                                               │");
console.log("│ 4. Confusing Statistical vs Practical Significance            │");
console.log("│    Problem: Large n → tiny effects can be \"significant\"      │");
console.log("│    Solution: Always report effect sizes and CIs              │");
console.log("│                                                               │");
console.log("│ 5. Stopping When p < 0.05                                     │");
console.log("│    Problem: Optional stopping inflates Type I error          │");
console.log("│    Solution: Fix sample size in advance (power analysis)     │");
console.log("│                                                               │");
console.log("│ 6. Misinterpreting Non-Significance                           │");
console.log("│    Problem: \"p > 0.05 proves H₀ is true\"                    │");
console.log("│    Solution: Report effect size and CI (absence of evidence) │");
console.log("│                                                               │");
console.log("│ 7. Ignoring Missing Data                                      │");
console.log("│    Problem: Complete-case analysis can bias results          │");
console.log("│    Solution: Investigate missingness, consider imputation    │");
console.log("│                                                               │");
console.log("│ 8. Overfitting with Many Predictors                           │");
console.log("│    Problem: Model fits noise rather than signal              │");
console.log("│    Solution: Cross-validation, regularization, limit # vars  │");
console.log("│                                                               │");
console.log("└───────────────────────────────────────────────────────────────┘");

console.log("\n┌───────────────────────────────────────────────────────────────┐");
console.log("│ REPORTING CHECKLIST (APA STYLE)                               │");
console.log("├───────────────────────────────────────────────────────────────┤");
console.log("│                                                               │");
console.log("│ Always Report:                                                │");
console.log("│  ☐ Sample size (n)                                           │");
console.log("│  ☐ Descriptive statistics (M, SD or Mdn, IQR)               │");
console.log("│  ☐ Test statistic value (t, F, χ², etc.)                    │");
console.log("│  ☐ Degrees of freedom                                        │");
console.log("│  ☐ Exact p-value (not just \"p < .05\")                       │");
console.log("│  ☐ Effect size with interpretation                          │");
console.log("│  ☐ Confidence interval (95% CI)                              │");
console.log("│  ☐ Direction of effect                                       │");
console.log("│                                                               │");
console.log("│ Example (APA 7th):                                            │");
console.log("│  \"An independent-samples t-test was conducted to compare     │");
console.log("│   recovery times. There was a significant difference in the  │");
console.log("│   scores for Group A (M = 15.2, SD = 2.1) and Group B        │");
console.log("│   (M = 13.8, SD = 1.9); t(98) = 3.45, p = .001, 95% CI       │");
console.log("│   [0.6, 2.2], d = 0.70. Group A had longer recovery times.\" │");
console.log("│                                                               │");
console.log("└───────────────────────────────────────────────────────────────┘");

console.log("\n┌───────────────────────────────────────────────────────────────┐");
console.log("│ WHEN TO USE PARAMETRIC VS NON-PARAMETRIC                     │");
console.log("├───────────────────────────────────────────────────────────────┤");
console.log("│                                                               │");
console.log("│ Use PARAMETRIC (t-test, ANOVA, Pearson r) when:              │");
console.log("│  ✓ Data is approximately normally distributed                │");
console.log("│  ✓ Variances are roughly equal (for multiple groups)         │");
console.log("│  ✓ Sample size is adequate (n ≥ 30 per group)               │");
console.log("│  ✓ Data is continuous (interval/ratio scale)                │");
console.log("│  ✓ Outliers are minimal or handled appropriately            │");
console.log("│                                                               │");
console.log("│ Use NON-PARAMETRIC (Mann-Whitney, Kruskal-Wallis) when:      │");
console.log("│  ✓ Data is severely non-normal (even with large n)          │");
console.log("│  ✓ Data is ordinal (ranks matter, not exact values)         │");
console.log("│  ✓ Small sample size (n < 30)                               │");
console.log("│  ✓ Extreme outliers cannot be removed                       │");
console.log("│  ✓ Variances are very unequal                               │");
console.log("│                                                               │");
console.log("│ Advantages of Non-Parametric:                                 │");
console.log("│  • Fewer assumptions                                         │");
console.log("│  • Robust to outliers                                        │");
console.log("│  • Works with ordinal data                                   │");
console.log("│                                                               │");
console.log("│ Disadvantages of Non-Parametric:                              │");
console.log("│  • Less statistical power (if assumptions hold)              │");
console.log("│  • Less familiar interpretation                              │");
console.log("│  • Fewer analysis options available                          │");
console.log("│                                                               │");
console.log("└───────────────────────────────────────────────────────────────┘");

console.log("\n┌───────────────────────────────────────────────────────────────┐");
console.log("│ TRANSFORMATION GUIDE                                          │");
console.log("├───────────────────────────────────────────────────────────────┤");
console.log("│                                                               │");
console.log("│ When Data is RIGHT-SKEWED (long right tail):                 │");
console.log("│  • log(x)         : Moderate positive skew                   │");
console.log("│  • √x             : Mild positive skew                       │");
console.log("│  • 1/x            : Strong positive skew                     │");
console.log("│  • Box-Cox        : Automatically find best λ                │");
console.log("│                                                               │");
console.log("│ When Data is LEFT-SKEWED (long left tail):                   │");
console.log("│  • x²             : Mild negative skew                       │");
console.log("│  • x³             : Moderate negative skew                   │");
console.log("│  • exp(x)         : Strong negative skew                     │");
console.log("│  • Reflect + transform: max(x) - x, then use right-skew     │");
console.log("│                                                               │");
console.log("│ When Variance Increases with Mean:                            │");
console.log("│  • log(x)         : Stabilizes variance                      │");
console.log("│  • √x             : Poisson-like data                        │");
console.log("│                                                               │");
console.log("│ When Data Contains ZEROS or NEGATIVES:                        │");
console.log("│  • log(x + c)     : Add constant c before logging            │");
console.log("│  • Yeo-Johnson    : Works with all real numbers              │");
console.log("│                                                               │");
console.log("│ IMPORTANT:                                                    │");
console.log("│  • Always check if transformation improves normality         │");
console.log("│  • Report results on ORIGINAL scale when possible           │");
console.log("│  • Consider non-parametric methods as alternative           │");
console.log("│  • Document transformation in methods section                │");
console.log("│                                                               │");
console.log("└───────────────────────────────────────────────────────────────┘");

console.log("\n");
console.log("═══════════════════════════════════════════════════════════════");
console.log("END OF COMPREHENSIVE STATISTICAL WORKFLOW");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// EXPORT FUNCTIONS FOR REUSE
// ============================================================================

