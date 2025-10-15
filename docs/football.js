import { createCanvas} from '@napi-rs/canvas';

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Readable } from 'stream';
import readline from 'readline';

// ============================================================================
// FOOTBALL IMAGE GENERATOR CLASS
// ============================================================================

class FootballImageGenerator {
    constructor() {
        this.width = 1200;
        this.height = 800;
        this.padding = 40;
        this.colors = {
            background: '#0a0e27',
            cardBg: '#1a1f3a',
            accent: '#00d9ff',
            success: '#00ff88',
            warning: '#ffaa00',
            danger: '#ff4444',
            text: '#ffffff',
            textSecondary: '#a0aec0',
            border: '#2d3748',
            purple: '#9f7aea',
            orange: '#ed8936'
        };
    }

    // Generate Team Analysis Image
    async generateTeamAnalysis(teamName, league, leagueColor, stats, recentMatches) {
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');

        this.drawBackground(ctx);
        this.drawHeader(ctx, `${leagueColor} ${teamName}`, league);

        let yPos = 150;
        yPos = this.drawStatsCard(ctx, stats, yPos);
        yPos += 30;
        this.drawRecentMatches(ctx, recentMatches, yPos);
        this.drawFooter(ctx);

        return canvas.toBuffer('image/png');
    }

    // Generate Team Comparison Image
    async generateTeamComparison(team1Name, team1Stats, team2Name, team2Stats, comparisonData) {
        const canvas = createCanvas(this.width, 900);
        const ctx = canvas.getContext('2d');

        this.drawBackground(ctx);
        this.drawHeader(ctx, `⚔️ ${team1Name} vs ${team2Name}`, 'Team Comparison');

        let yPos = 150;

        // Team 1 Stats
        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 24px Arial';
        ctx.fillText(team1Name, this.padding, yPos);
        yPos += 10;
        yPos = this.drawMiniStatsCard(ctx, team1Stats, yPos, this.padding);

        // Team 2 Stats
        yPos = 150;
        const team2X = this.width / 2 + 20;
        ctx.fillText(team2Name, team2X, yPos);
        yPos += 10;
        yPos = this.drawMiniStatsCard(ctx, team2Stats, yPos, team2X);

        yPos = Math.max(yPos, 500);
        this.drawComparisonBars(ctx, comparisonData, yPos);

        this.drawFooter(ctx);
        return canvas.toBuffer('image/png');
    }

    // Generate Top Performers Image
    async generateTopPerformers(title, performers, category) {
        const canvas = createCanvas(this.width, 1000);
        const ctx = canvas.getContext('2d');

        this.drawBackground(ctx);
        this.drawHeader(ctx, `🏆 ${title}`, category);

        let yPos = 180;

        performers.forEach((performer, index) => {
            const position = index + 1;
            let emoji = '⚪';
            if (position === 1) emoji = '🥇';
            else if (position === 2) emoji = '🥈';
            else if (position === 3) emoji = '🥉';
            else if (position <= 4) emoji = '🟢';
            else if (position <= 6) emoji = '🟡';

            ctx.fillStyle = this.colors.cardBg;
            ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 50);

            ctx.fillStyle = this.colors.text;
            ctx.font = 'bold 20px Arial';
            ctx.fillText(`${emoji} ${position}`, this.padding + 20, yPos + 32);

            ctx.font = '18px Arial';
            ctx.fillText(performer.team, this.padding + 120, yPos + 32);

            ctx.fillStyle = this.colors.textSecondary;
            ctx.font = '14px Arial';
            ctx.fillText(performer.league, this.padding + 400, yPos + 32);

            ctx.fillStyle = this.colors.accent;
            ctx.font = 'bold 20px Arial';
            ctx.fillText(performer.value, this.padding + 700, yPos + 32);

            ctx.fillStyle = this.colors.textSecondary;
            ctx.font = '14px Arial';
            ctx.fillText(`(${performer.matches} matches)`, this.padding + 850, yPos + 32);

            yPos += 60;
        });

        this.drawFooter(ctx);
        return canvas.toBuffer('image/png');
    }

    // Generate Match Details Image
    async generateMatchDetails(teamName, matches) {
        const maxHeight = Math.max(1000, 300 + matches.length * 45);
        const canvas = createCanvas(this.width, maxHeight);
        const ctx = canvas.getContext('2d');

        this.drawBackground(ctx);
        this.drawHeader(ctx, `📋 All Matches`, teamName);

        let yPos = 180;

        // Table header
        ctx.fillStyle = this.colors.accent;
        ctx.font = 'bold 14px Arial';
        const headers = ['#', 'Date', 'Venue', 'Result', 'Score', 'xG', 'xGA', 'Pts'];
        const colWidths = [50, 180, 100, 80, 80, 80, 80, 80];
        let xPos = this.padding;

        headers.forEach((header, i) => {
            ctx.fillText(header, xPos, yPos);
            xPos += colWidths[i];
        });

        yPos += 25;

        // Matches
        matches.forEach((match, index) => {
            const bgColor = index % 2 === 0 ? this.colors.cardBg : this.colors.background;
            ctx.fillStyle = bgColor;
            ctx.fillRect(this.padding, yPos - 15, this.width - 2 * this.padding, 40);

            xPos = this.padding;
            ctx.fillStyle = this.colors.text;
            ctx.font = '13px Arial';

            const data = [
                (index + 1).toString(),
                match.date.substring(0, 10),
                match.venue,
                match.result,
                match.score,
                match.xG,
                match.xGA,
                match.points.toString()
            ];

            data.forEach((val, i) => {
                ctx.fillText(val, xPos, yPos);
                xPos += colWidths[i];
            });

            yPos += 40;
        });

        this.drawFooter(ctx);
        return canvas.toBuffer('image/png');
    }

    // Generate Form Table Image
    async generateFormTable(formData, numMatches) {
        const canvas = createCanvas(this.width, Math.max(1000, 300 + formData.length * 45));
        const ctx = canvas.getContext('2d');

        this.drawBackground(ctx);
        this.drawHeader(ctx, `📈 Form Table`, `Last ${numMatches} Matches`);

        let yPos = 180;

        // Table header
        ctx.fillStyle = this.colors.accent;
        ctx.font = 'bold 13px Arial';
        const headers = ['Pos', 'Team', 'Pts', 'W', 'D', 'L', 'Form', 'Avg xG', 'Avg xGA'];
        const colWidths = [60, 220, 60, 50, 50, 50, 120, 90, 90];
        let xPos = this.padding;

        headers.forEach((header, i) => {
            ctx.fillText(header, xPos, yPos);
            xPos += colWidths[i];
        });

        yPos += 25;

        // Form data
        formData.forEach((team, index) => {
            const bgColor = index % 2 === 0 ? this.colors.cardBg : this.colors.background;
            ctx.fillStyle = bgColor;
            ctx.fillRect(this.padding, yPos - 15, this.width - 2 * this.padding, 40);

            xPos = this.padding;
            ctx.fillStyle = this.colors.text;
            ctx.font = '13px Arial';

            const data = [
                (index + 1).toString(),
                team.team,
                team.points.toString(),
                team.wins.toString(),
                team.draws.toString(),
                team.losses.toString(),
                team.form,
                team.avgXG,
                team.avgXGA
            ];

            data.forEach((val, i) => {
                if (i === 6) {
                    this.drawFormIndicators(ctx, val, xPos, yPos - 5);
                } else {
                    ctx.fillText(val, xPos, yPos);
                }
                xPos += colWidths[i];
            });

            yPos += 40;
        });

        this.drawFooter(ctx);
        return canvas.toBuffer('image/png');
    }

    // Generate Performance Trends Image
    async generatePerformanceTrends(teamName, trends) {
        const canvas = createCanvas(this.width, 900);
        const ctx = canvas.getContext('2d');

        this.drawBackground(ctx);
        this.drawHeader(ctx, `📈 Performance Trends`, teamName);

        // Prepare chart
        const labels = trends.map(t => `M${t.matchNum}`);
        const xGData = trends.map(t => parseFloat(t.avgXG));
        const xGAData = trends.map(t => parseFloat(t.avgXGA));

        const chartCanvas = createCanvas(1000, 400);
        const chartCtx = chartCanvas.getContext('2d');

        this.drawLineChart(chartCtx, labels, xGData, xGAData);
        ctx.drawImage(chartCanvas, 100, 200);

        // Summary
        const latestTrend = trends[trends.length - 1];
        let yPos = 650;

        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 120);

        yPos += 30;
        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 18px Arial';
        ctx.fillText('📊 Trend Summary', this.padding + 20, yPos);

        yPos += 30;
        ctx.font = '15px Arial';
        ctx.fillText(`Recent Form: ${latestTrend.form}`, this.padding + 20, yPos);
        ctx.fillText(`Current xG: ${latestTrend.avgXG}`, this.padding + 300, yPos);
        ctx.fillText(`Current xGA: ${latestTrend.avgXGA}`, this.padding + 550, yPos);

        yPos += 30;
        const trend = parseFloat(latestTrend.xGDiff) > 0 ? '📈 Positive Trend' : '📉 Negative Trend';
        ctx.fillStyle = parseFloat(latestTrend.xGDiff) > 0 ? this.colors.success : this.colors.danger;
        ctx.fillText(`Trend: ${trend}`, this.padding + 20, yPos);

        this.drawFooter(ctx);
        return canvas.toBuffer('image/png');
    }

    // Generate Match Prediction Image
    async generateMatchPrediction(homeTeam, awayTeam, prediction) {
        const canvas = createCanvas(this.width, 1400);
        const ctx = canvas.getContext('2d');

        this.drawBackground(ctx);
        this.drawHeader(ctx, `🔮 Match Prediction`, `${homeTeam} vs ${awayTeam}`);

        let yPos = 180;

        // xG Prediction
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 80);

        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Predicted xG', this.padding + 20, yPos + 30);

        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = this.colors.accent;
        const xGText = `${homeTeam} ${prediction.homeXG.toFixed(2)} - ${prediction.awayXG.toFixed(2)} ${awayTeam}`;
        ctx.fillText(xGText, this.padding + 20, yPos + 65);

        yPos += 100;

        // Most Likely Score
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 60);

        ctx.fillStyle = this.colors.text;
        ctx.font = '18px Arial';
        ctx.fillText('Most Likely Score:', this.padding + 20, yPos + 25);

        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = this.colors.success;
        ctx.fillText(prediction.predictedScore, this.padding + 20, yPos + 50);

        yPos += 80;

        // Win Probabilities
        this.drawWinProbabilities(ctx, homeTeam, awayTeam, prediction, yPos);
        yPos += 180;

        // Enhanced Predictions
        yPos = this.drawEnhancedPredictions(ctx, homeTeam, awayTeam, prediction, yPos);
        yPos += 20;

        // Key Factors
        ctx.fillStyle = this.colors.cardBg;
        const factorsHeight = 40 + prediction.keyFactors.length * 25;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, factorsHeight);

        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 18px Arial';
        ctx.fillText('🎯 Key Factors', this.padding + 20, yPos + 30);

        ctx.font = '15px Arial';
        let factorY = yPos + 55;
        prediction.keyFactors.forEach(factor => {
            ctx.fillText(`• ${factor}`, this.padding + 40, factorY);
            factorY += 25;
        });

        yPos += factorsHeight + 20;

        // Advanced Insights
        this.drawAdvancedInsights(ctx, prediction, yPos);

        this.drawFooter(ctx);
        return canvas.toBuffer('image/png');
    }

// Generate Season Projection Image
async generateSeasonProjection(teamName, projection, currentMatches) {
    const canvas = createCanvas(this.width, 1000);
    const ctx = canvas.getContext('2d');

    this.drawBackground(ctx);
    this.drawHeader(ctx, `📈 Season Projection`, teamName);

    let yPos = 180;

    // Current Performance Card
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 140);

    ctx.fillStyle = this.colors.accent;
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Current Performance (${currentMatches} matches)`, this.padding + 20, yPos + 30);

    ctx.fillStyle = this.colors.text;
    ctx.font = '16px Arial';
    const currentStats = [
        `Points per game: ${projection.currentPPG.toFixed(2)}`,
        `xG per game: ${projection.avgXG.toFixed(2)}`,
        `xGA per game: ${projection.avgXGA.toFixed(2)}`,
        `xG Difference: ${projection.xGDiff > 0 ? '+' : ''}${projection.xGDiff.toFixed(2)}`
    ];

    let lineY = yPos + 60;
    currentStats.forEach((stat, index) => {
        const xPos = this.padding + 20 + (index % 2) * 550;
        if (index % 2 === 0 && index > 0) lineY += 30;
        ctx.fillText(stat, xPos, lineY);
    });

    yPos += 160;

    // Season Projections Card
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 180);

    ctx.fillStyle = this.colors.success;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('🎯 Season Projections (38 games)', this.padding + 20, yPos + 30);

    ctx.fillStyle = this.colors.text;
    ctx.font = '16px Arial';
    const projectionStats = [
        `Projected Points: ${projection.projectedPoints.toFixed(0)} points`,
        `Projected Goals: ${projection.projectedGoals.toFixed(0)} goals`,
        `Projected Goals Against: ${projection.projectedGA.toFixed(0)} goals`,
        `Expected League Position: ${projection.expectedPosition}`
    ];

    lineY = yPos + 65;
    projectionStats.forEach(stat => {
        ctx.fillText(stat, this.padding + 40, lineY);
        lineY += 30;
    });

    yPos += 200;

    // Season Outlook
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 80);

    ctx.fillStyle = this.colors.warning;
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🏆 Season Outlook', this.padding + 20, yPos + 30);

    ctx.fillStyle = this.colors.text;
    ctx.font = '16px Arial';
    ctx.fillText(projection.outlook, this.padding + 40, yPos + 60);

    yPos += 100;

    // Qualification Probabilities with bars
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 180);

    ctx.fillStyle = this.colors.purple;
    ctx.font = 'bold 18px Arial';
    ctx.fillText('📊 Qualification Probabilities', this.padding + 20, yPos + 30);

    const barHeight = 30;
    const maxWidth = this.width - 2 * this.padding - 300;

    // Champions League
    let barY = yPos + 60;
    ctx.fillStyle = this.colors.text;
    ctx.font = '15px Arial';
    ctx.fillText('Champions League:', this.padding + 40, barY + 20);
    const clWidth = (projection.clProbability / 100) * maxWidth;
    ctx.fillStyle = this.colors.success;
    ctx.fillRect(this.padding + 250, barY, clWidth, barHeight);
    ctx.fillStyle = this.colors.text;
    ctx.fillText(`${projection.clProbability.toFixed(1)}%`, this.padding + 260 + clWidth, barY + 20);

    // Europa League
    barY += 50;
    ctx.fillText('Europa League:', this.padding + 40, barY + 20);
    const elWidth = (projection.elProbability / 100) * maxWidth;
    ctx.fillStyle = this.colors.warning;
    ctx.fillRect(this.padding + 250, barY, elWidth, barHeight);
    ctx.fillStyle = this.colors.text;
    ctx.fillText(`${projection.elProbability.toFixed(1)}%`, this.padding + 260 + elWidth, barY + 20);

    // Relegation
    barY += 50;
    ctx.fillText('Relegation:', this.padding + 40, barY + 20);
    const relWidth = (projection.relegationProbability / 100) * maxWidth;
    ctx.fillStyle = this.colors.danger;
    ctx.fillRect(this.padding + 250, barY, relWidth, barHeight);
    ctx.fillStyle = this.colors.text;
    ctx.fillText(`${projection.relegationProbability.toFixed(1)}%`, this.padding + 260 + relWidth, barY + 20);

    this.drawFooter(ctx);
    return canvas.toBuffer('image/png');
}

// Generate Goal Prediction Model Image
async generateGoalPrediction(teamName, goalModel) {
    const canvas = createCanvas(this.width, 900);
    const ctx = canvas.getContext('2d');

    this.drawBackground(ctx);
    this.drawHeader(ctx, `⚽ Goal Prediction Model`, teamName);

    let yPos = 180;

    // Next Match Predictions
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 160);

    ctx.fillStyle = this.colors.success;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Next Match Predictions', this.padding + 20, yPos + 30);

    ctx.fillStyle = this.colors.text;
    ctx.font = '16px Arial';
    const nextMatchStats = [
        `Expected Goals (Home): ${goalModel.homeGoals.toFixed(2)}`,
        `Expected Goals (Away): ${goalModel.awayGoals.toFixed(2)}`,
        `Scoring Probability: ${goalModel.scoringProb.toFixed(1)}%`,
        `Clean Sheet Probability: ${goalModel.cleanSheetProb.toFixed(1)}%`
    ];

    let lineY = yPos + 65;
    nextMatchStats.forEach((stat, index) => {
        const xPos = this.padding + 20 + (index % 2) * 550;
        if (index % 2 === 0 && index > 0) lineY += 35;
        ctx.fillText(stat, xPos, lineY);
    });

    yPos += 180;

    // Goal Patterns
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 140);

    ctx.fillStyle = this.colors.accent;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('📊 Goal Patterns', this.padding + 20, yPos + 30);

    ctx.fillStyle = this.colors.text;
    ctx.font = '16px Arial';
    const patterns = [
        `Average goals per game: ${goalModel.avgGoals.toFixed(2)}`,
        `Goals vs xG efficiency: ${goalModel.efficiency.toFixed(1)}%`,
        `Most likely next match score: ${goalModel.mostLikelyScore}`,
        `High-scoring games (3+): ${goalModel.highScoringProb.toFixed(1)}%`
    ];

    lineY = yPos + 65;
    patterns.forEach((stat, index) => {
        const xPos = this.padding + 20 + (index % 2) * 550;
        if (index % 2 === 0 && index > 0) lineY += 30;
        ctx.fillText(stat, xPos, lineY);
    });

    yPos += 160;

    // Scoring Analysis
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 120);

    ctx.fillStyle = this.colors.warning;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('🎯 Scoring Analysis', this.padding + 20, yPos + 30);

    ctx.fillStyle = this.colors.text;
    ctx.font = '16px Arial';
    const analysis = [
        `Goal variance: ${goalModel.consistency}`,
        `Best goal-scoring period: ${goalModel.bestPeriod}`,
        `Scoring trend: ${goalModel.trend || 'Stable'}`
    ];

    lineY = yPos + 65;
    analysis.forEach(stat => {
        ctx.fillText(stat, this.padding + 40, lineY);
        lineY += 25;
    });

    this.drawFooter(ctx);
    return canvas.toBuffer('image/png');
}

// Generate Team Form Analysis Image
async generateTeamFormAnalysis(teamName, formAnalysis) {
    const canvas = createCanvas(this.width, 950);
    const ctx = canvas.getContext('2d');

    this.drawBackground(ctx);
    this.drawHeader(ctx, `📈 Team Form Analysis`, teamName);

    let yPos = 180;

    // Current Form Status
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 140);

    ctx.fillStyle = this.colors.accent;
    ctx.font = 'bold 22px Arial';
    ctx.fillText('Current Form Status', this.padding + 20, yPos + 35);

    ctx.fillStyle = this.colors.text;
    ctx.font = '18px Arial';
    ctx.fillText(`Form Rating: ${formAnalysis.formRating}`, this.padding + 40, yPos + 70);
    ctx.fillText(`Trend: ${formAnalysis.trend}`, this.padding + 40, yPos + 100);

    ctx.fillStyle = this.colors.success;
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Momentum: ${formAnalysis.momentum.toFixed(1)}/10`, this.padding + 600, yPos + 85);

    yPos += 160;

    // Last 5 Matches Performance
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 140);

    ctx.fillStyle = this.colors.purple;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Last 5 Matches Performance', this.padding + 20, yPos + 30);

    ctx.fillStyle = this.colors.text;
    ctx.font = '16px Arial';
    const recentStats = [
        `xG per game: ${formAnalysis.recentXG.toFixed(2)}`,
        `xGA per game: ${formAnalysis.recentXGA.toFixed(2)}`,
        `Points per game: ${formAnalysis.recentPPG.toFixed(2)}`,
        `Goal difference: ${formAnalysis.recentGD || 'N/A'}`
    ];

    let lineY = yPos + 65;
    recentStats.forEach((stat, index) => {
        const xPos = this.padding + 20 + (index % 2) * 550;
        if (index % 2 === 0 && index > 0) lineY += 30;
        ctx.fillText(stat, xPos, lineY);
    });

    yPos += 160;

    // Form Insights
    ctx.fillStyle = this.colors.cardBg;
    const insightsHeight = 60 + formAnalysis.insights.length * 30;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, insightsHeight);

    ctx.fillStyle = this.colors.warning;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('🔥 Form Insights', this.padding + 20, yPos + 35);

    ctx.fillStyle = this.colors.text;
    ctx.font = '15px Arial';
    lineY = yPos + 70;
    formAnalysis.insights.forEach(insight => {
        ctx.fillText(`• ${insight}`, this.padding + 40, lineY);
        lineY += 30;
    });

    yPos += insightsHeight + 20;

    // Performance Metrics
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 120);

    ctx.fillStyle = this.colors.orange;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('📊 Performance Metrics', this.padding + 20, yPos + 30);

    ctx.fillStyle = this.colors.text;
    ctx.font = '16px Arial';
    const metrics = [
        `Form consistency: ${formAnalysis.consistency}`,
        `Pressure performance: ${formAnalysis.pressureRating}`,
        `Next match confidence: ${formAnalysis.nextMatchConfidence}`
    ];

    lineY = yPos + 65;
    metrics.forEach(metric => {
        ctx.fillText(metric, this.padding + 40, lineY);
        lineY += 25;
    });

    this.drawFooter(ctx);
    return canvas.toBuffer('image/png');
}

// Generate League Position Prediction Image
async generateLeaguePositionPrediction(leagueName, predictions, leagueStats) {
    const maxHeight = Math.max(1200, 350 + predictions.length * 45);
    const canvas = createCanvas(this.width, maxHeight);
    const ctx = canvas.getContext('2d');

    this.drawBackground(ctx);
    this.drawHeader(ctx, `🏆 Predicted Final Table`, leagueName);

    let yPos = 180;

    // Table header
    ctx.fillStyle = this.colors.accent;
    ctx.font = 'bold 16px Arial';
    const headers = ['Pos', 'Team', 'Projected Pts', 'Confidence'];
    const colWidths = [80, 450, 200, 200];
    let xPos = this.padding;

    headers.forEach((header, i) => {
        ctx.fillText(header, xPos, yPos);
        xPos += colWidths[i];
    });

    yPos += 30;

    // Teams
    predictions.forEach((team, index) => {
        const position = index + 1;
        let emoji = '';
        let bgColor = this.colors.cardBg;
        
        if (position <= 4) {
            emoji = '🟢';
            bgColor = this.colors.success + '20';
        } else if (position <= 6) {
            emoji = '🟡';
            bgColor = this.colors.warning + '20';
        } else if (position >= predictions.length - 2) {
            emoji = '🔴';
            bgColor = this.colors.danger + '20';
        }

        ctx.fillStyle = index % 2 === 0 ? this.colors.cardBg : this.colors.background;
        ctx.fillRect(this.padding, yPos - 15, this.width - 2 * this.padding, 40);

        xPos = this.padding;
        ctx.fillStyle = this.colors.text;
        ctx.font = '15px Arial';

        ctx.fillText(`${emoji} ${position}`, xPos + 10, yPos);
        ctx.fillText(team.name, xPos + colWidths[0], yPos);
        ctx.fillText(`${team.projectedPoints.toFixed(0)} pts`, xPos + colWidths[0] + colWidths[1], yPos);
        
        // Confidence badge
        const confColor = team.confidence === 'High' ? this.colors.success :
                         team.confidence === 'Medium' ? this.colors.warning :
                         this.colors.danger;
        ctx.fillStyle = confColor;
        ctx.fillText(team.confidence, xPos + colWidths[0] + colWidths[1] + colWidths[2], yPos);

        yPos += 40;
    });

    yPos += 20;

    // Legend
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 100);

    ctx.fillStyle = this.colors.text;
    ctx.font = '16px Arial';
    ctx.fillText('🟢 Champions League: Top 4', this.padding + 20, yPos + 30);
    ctx.fillText('🟡 Europa League: 5th-6th', this.padding + 20, yPos + 55);
    ctx.fillText('🔴 Relegation: Bottom 3', this.padding + 20, yPos + 80);

    yPos += 120;

    // League Insights
    ctx.fillStyle = this.colors.cardBg;
    ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 120);

    ctx.fillStyle = this.colors.purple;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('📊 League Insights', this.padding + 20, yPos + 35);

    ctx.fillStyle = this.colors.text;
    ctx.font = '16px Arial';
    ctx.fillText(`Title race: ${leagueStats.titleRace}`, this.padding + 40, yPos + 65);
    ctx.fillText(`Relegation battle: ${leagueStats.relegationBattle}`, this.padding + 40, yPos + 90);

    this.drawFooter(ctx);
    return canvas.toBuffer('image/png');
}

    // Generate Statistics Summary Image
    async generateStatisticsSummary(summaryData) {
        const canvas = createCanvas(this.width, 1400);
        const ctx = canvas.getContext('2d');

        this.drawBackground(ctx);
        this.drawHeader(ctx, '📈 Comprehensive Statistics Summary', 'Overall Football Data Analysis');

        let yPos = 180;

        yPos = this.drawOverallStatsCard(ctx, summaryData.overall, yPos);
        yPos += 20;

        yPos = this.drawLeagueBreakdown(ctx, summaryData.leagues, yPos);
        yPos += 20;

        if (summaryData.goals) {
            yPos = this.drawGoalStatsCard(ctx, summaryData.goals, yPos);
            yPos += 20;
        }

        if (summaryData.xg) {
            yPos = this.drawXGStatsCard(ctx, summaryData.xg, yPos);
            yPos += 20;
        }

        if (summaryData.results) {
            yPos = this.drawResultDistribution(ctx, summaryData.results, yPos);
            yPos += 20;
        }

        if (summaryData.homeAway) {
            yPos = this.drawHomeAwayCard(ctx, summaryData.homeAway, yPos);
            yPos += 20;
        }

        if (summaryData.topTeams) {
            yPos = this.drawTopTeamsSummary(ctx, summaryData.topTeams, yPos);
            yPos += 20;
        }

        if (summaryData.dataQuality) {
            yPos = this.drawDataQualityCard(ctx, summaryData.dataQuality, yPos);
        }

        this.drawFooter(ctx);
        return canvas.toBuffer('image/png');
    }

    // Helper: Draw Background
    drawBackground(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a0e27');
        gradient.addColorStop(1, '#1a1f3a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    // Helper: Draw Header
    drawHeader(ctx, title, subtitle) {
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(0, 0, this.width, 120);

        ctx.fillStyle = this.colors.accent;
        ctx.font = 'bold 36px Arial';
        ctx.fillText(title, this.padding, 55);

        ctx.fillStyle = this.colors.textSecondary;
        ctx.font = '20px Arial';
        ctx.fillText(subtitle, this.padding, 90);
    }

    // Helper: Draw Stats Card
    drawStatsCard(ctx, stats, yPos) {
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 180);

        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 20px Arial';
        ctx.fillText('📊 Statistics', this.padding + 20, yPos + 30);

        ctx.font = '16px Arial';
        const lines = [
            `Matches: ${stats.matches} | W: ${stats.wins} D: ${stats.draws} L: ${stats.losses}`,
            `Points: ${stats.points} (${stats.pointsPercentage}% of maximum)`,
            `Goals: ${stats.scored} scored, ${stats.conceded} conceded (${stats.goalDiff} difference)`,
            `xG: ${stats.xG} for, ${stats.xGA} against (${stats.xGDiff} difference)`,
            `Avg per game: ${stats.avgGoals} goals, ${stats.avgXG} xG`
        ];

        let lineY = yPos + 60;
        lines.forEach(line => {
            ctx.fillText(line, this.padding + 20, lineY);
            lineY += 25;
        });

        return yPos + 190;
    }

    // Helper: Draw Recent Matches
    drawRecentMatches(ctx, matches, yPos) {
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 200);

        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 20px Arial';
        ctx.fillText('📅 Recent Matches (Last 5)', this.padding + 20, yPos + 30);

        ctx.font = '14px monospace';
        let matchY = yPos + 60;
        matches.forEach((match, index) => {
            const resultColor = match.result === 'W' ? this.colors.success :
                               match.result === 'D' ? this.colors.warning :
                               this.colors.danger;

            ctx.fillStyle = this.colors.text;
            ctx.fillText(`${index + 1}.`, this.padding + 20, matchY);
            ctx.fillText(match.date, this.padding + 50, matchY);
            ctx.fillText(match.venue, this.padding + 250, matchY);

            ctx.fillStyle = resultColor;
            ctx.fillText(`(${match.result})`, this.padding + 310, matchY);

            ctx.fillStyle = this.colors.text;
            ctx.fillText(match.score, this.padding + 380, matchY);
            ctx.fillText(`xG: ${match.xG}`, this.padding + 460, matchY);

            matchY += 25;
        });
    }

    // Helper: Draw Mini Stats Card
    drawMiniStatsCard(ctx, stats, yPos, xPos) {
        const width = (this.width / 2) - this.padding - 30;
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(xPos, yPos, width, 300);

        ctx.fillStyle = this.colors.text;
        ctx.font = '14px Arial';

        const lines = [
            `Matches: ${stats.matches}`,
            `Points: ${stats.points}`,
            `Win Rate: ${stats.winRate}%`,
            `Goals: ${stats.scored}-${stats.conceded}`,
            `Avg xG: ${stats.avgXG}`,
            `Avg xGA: ${stats.avgXGA}`,
            `PPG: ${stats.ppg}`
        ];

        let lineY = yPos + 30;
        lines.forEach(line => {
            ctx.fillText(line, xPos + 20, lineY);
            lineY += 35;
        });

        return yPos + 310;
    }

    // Helper: Draw Comparison Bars
    drawComparisonBars(ctx, data, yPos) {
        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 18px Arial';
        ctx.fillText('Head-to-Head Comparison', this.padding, yPos);

        yPos += 30;

        data.forEach(stat => {
            const maxVal = Math.max(parseFloat(stat.team1), parseFloat(stat.team2));
            const barWidth = (this.width - 3 * this.padding) / 2;

            ctx.fillStyle = this.colors.textSecondary;
            ctx.font = '14px Arial';
            ctx.fillText(stat.name, this.padding, yPos);

            const team1Width = (parseFloat(stat.team1) / maxVal) * barWidth * 0.8;
            ctx.fillStyle = this.colors.accent;
            ctx.fillRect(this.padding, yPos + 10, team1Width, 20);
            ctx.fillStyle = this.colors.text;
            ctx.fillText(stat.team1.toString(), this.padding + team1Width + 10, yPos + 25);

            const team2Width = (parseFloat(stat.team2) / maxVal) * barWidth * 0.8;
            const team2X = this.width / 2 + 20;
            ctx.fillStyle = this.colors.success;
            ctx.fillRect(team2X, yPos + 10, team2Width, 20);
            ctx.fillStyle = this.colors.text;
            ctx.fillText(stat.team2.toString(), team2X + team2Width + 10, yPos + 25);

            yPos += 50;
        });
    }

    // Helper: Draw Form Indicators
    drawFormIndicators(ctx, form, x, y) {
        const indicators = form.split('');
        indicators.forEach((indicator, i) => {
            const color = indicator === 'W' ? this.colors.success :
                         indicator === 'D' ? this.colors.warning :
                         indicator === 'L' ? this.colors.danger :
                         this.colors.textSecondary;

            ctx.fillStyle = color;
            ctx.fillRect(x + i * 20, y, 15, 15);

            ctx.fillStyle = this.colors.background;
            ctx.font = 'bold 10px Arial';
            ctx.fillText(indicator, x + i * 20 + 4, y + 11);
        });
    }

    // Helper: Draw Line Chart
    drawLineChart(ctx, labels, xGData, xGAData) {
        const padding = 50;
        const chartWidth = 900;
        const chartHeight = 300;
        const maxY = Math.max(...xGData, ...xGAData) * 1.2;

        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(0, 0, 1000, 400);

        ctx.strokeStyle = this.colors.border;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, chartHeight + padding);
        ctx.lineTo(chartWidth + padding, chartHeight + padding);
        ctx.stroke();

        ctx.strokeStyle = this.colors.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        xGData.forEach((val, i) => {
            const x = padding + (i / (xGData.length - 1)) * chartWidth;
            const y = chartHeight + padding - (val / maxY) * chartHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        ctx.strokeStyle = this.colors.danger;
        ctx.beginPath();
        xGAData.forEach((val, i) => {
            const x = padding + (i / (xGAData.length - 1)) * chartWidth;
            const y = chartHeight + padding - (val / maxY) * chartHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        ctx.fillStyle = this.colors.accent;
        ctx.fillRect(padding, 10, 20, 10);
        ctx.fillStyle = this.colors.text;
        ctx.font = '14px Arial';
        ctx.fillText('xG', padding + 30, 20);

        ctx.fillStyle = this.colors.danger;
        ctx.fillRect(padding + 80, 10, 20, 10);
        ctx.fillStyle = this.colors.text;
        ctx.fillText('xGA', padding + 110, 20);
    }

    // Helper: Draw Win Probabilities
    drawWinProbabilities(ctx, homeTeam, awayTeam, prediction, yPos) {
        const barHeight = 40;
        const maxWidth = this.width - 2 * this.padding - 200;

        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 150);

        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 16px Arial';
        ctx.fillText('📊 Win Probabilities', this.padding + 20, yPos + 25);

        yPos += 50;

        ctx.fillText(`${homeTeam} Win`, this.padding + 20, yPos + 25);
        const homeWidth = (prediction.homeWinProb / 100) * maxWidth;
        ctx.fillStyle = this.colors.success;
        ctx.fillRect(this.padding + 200, yPos, homeWidth, barHeight);
        ctx.fillStyle = this.colors.text;
        ctx.fillText(`${prediction.homeWinProb.toFixed(1)}%`, this.padding + 210 + homeWidth, yPos + 25);

        yPos += 50;

        ctx.fillStyle = this.colors.text;
        ctx.fillText('Draw', this.padding + 20, yPos + 25);
        const drawWidth = (prediction.drawProb / 100) * maxWidth;
        ctx.fillStyle = this.colors.warning;
        ctx.fillRect(this.padding + 200, yPos, drawWidth, barHeight);
        ctx.fillStyle = this.colors.text;
        ctx.fillText(`${prediction.drawProb.toFixed(1)}%`, this.padding + 210 + drawWidth, yPos + 25);

        yPos += 50;

        ctx.fillStyle = this.colors.text;
        ctx.fillText(`${awayTeam} Win`, this.padding + 20, yPos + 25);
        const awayWidth = (prediction.awayWinProb / 100) * maxWidth;
        ctx.fillStyle = this.colors.accent;
        ctx.fillRect(this.padding + 200, yPos, awayWidth, barHeight);
        ctx.fillStyle = this.colors.text;
        ctx.fillText(`${prediction.awayWinProb.toFixed(1)}%`, this.padding + 210 + awayWidth, yPos + 25);
    }

    // Helper: Draw Enhanced Predictions
    drawEnhancedPredictions(ctx, homeTeam, awayTeam, prediction, yPos) {
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 180);

        ctx.fillStyle = this.colors.purple;
        ctx.font = 'bold 18px Arial';
        ctx.fillText('🎯 Enhanced Predictions', this.padding + 20, yPos + 30);

        ctx.fillStyle = this.colors.text;
        ctx.font = '15px Arial';
        let predY = yPos + 60;

        const predictions = [
            `Expected Assists: ${homeTeam} ${prediction.expectedAssists.home} - ${prediction.expectedAssists.away} ${awayTeam}`,
            `Expected Points: ${homeTeam} ${prediction.expectedPoints.home} - ${prediction.expectedPoints.away} ${awayTeam}`,
            `Possession: ${homeTeam} ${prediction.possessionPrediction.home}% - ${prediction.possessionPrediction.away}% ${awayTeam}`,
            `Cards: ${homeTeam} ${prediction.cardsPrediction.home} - ${prediction.cardsPrediction.away} ${awayTeam} (Total: ${prediction.cardsPrediction.total})`,
            `Corners: ${homeTeam} ${prediction.cornersPrediction.home} - ${prediction.cornersPrediction.away} ${awayTeam} (Total: ${prediction.cornersPrediction.total})`
        ];

        predictions.forEach(pred => {
            ctx.fillText(pred, this.padding + 30, predY);
            predY += 25;
        });

        return yPos + 190;
    }

    // Helper: Draw Advanced Insights
    drawAdvancedInsights(ctx, prediction, yPos) {
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 120);

        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 18px Arial';
        ctx.fillText('🔍 Advanced Insights', this.padding + 20, yPos + 30);

        ctx.font = '15px Arial';
        let insightY = yPos + 60;

        const insights = [
            `Over 2.5 Goals: ${prediction.over25Goals.toFixed(1)}%`,
            `Both Teams to Score: ${prediction.bothTeamsScore.toFixed(1)}%`,
            `Match Quality: ${prediction.matchQuality}/10`,
            `Confidence: ${prediction.confidence}`
        ];

        insights.forEach((insight, i) => {
            ctx.fillText(insight, this.padding + 20 + (i % 2) * 500, insightY);
            if (i % 2 === 1) insightY += 25;
        });
    }

    // Helper: Draw Overall Stats Card
    drawOverallStatsCard(ctx, overall, yPos) {
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 120);

        ctx.fillStyle = this.colors.accent;
        ctx.font = 'bold 22px Arial';
        ctx.fillText('🌍 OVERALL STATISTICS', this.padding + 20, yPos + 35);

        ctx.fillStyle = this.colors.text;
        ctx.font = '16px Arial';
        
        const stats = [
            `Total Matches: ${overall.totalMatches.toLocaleString()}`,
            `Total Teams: ${overall.totalTeams}`,
            `Total Leagues: ${overall.totalLeagues}`,
            `Data Coverage: ${overall.coverage}%`
        ];

        let lineY = yPos + 65;
        stats.forEach((stat, index) => {
            const xPos = this.padding + 20 + (index % 2) * 550;
            if (index % 2 === 0 && index > 0) lineY += 30;
            ctx.fillText(stat, xPos, lineY);
        });

        return yPos + 130;
    }

    // Helper: Draw League Breakdown
    drawLeagueBreakdown(ctx, leagues, yPos) {
        const cardHeight = 60 + leagues.length * 35;
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, cardHeight);

        ctx.fillStyle = this.colors.accent;
        ctx.font = 'bold 20px Arial';
        ctx.fillText('🏆 LEAGUE BREAKDOWN', this.padding + 20, yPos + 35);

        ctx.font = '15px Arial';
        let lineY = yPos + 65;

        leagues.forEach(league => {
            ctx.fillStyle = this.colors.text;
            ctx.fillText(`${league.emoji} ${league.name}:`, this.padding + 30, lineY);
            ctx.fillStyle = this.colors.textSecondary;
            ctx.fillText(`${league.matches} matches, ${league.teams} teams`, this.padding + 350, lineY);
            lineY += 35;
        });

        return yPos + cardHeight + 10;
    }

    // Helper: Draw Goal Stats Card
    drawGoalStatsCard(ctx, goals, yPos) {
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 140);

        ctx.fillStyle = this.colors.success;
        ctx.font = 'bold 20px Arial';
        ctx.fillText('⚽ GOAL STATISTICS', this.padding + 20, yPos + 35);

        ctx.fillStyle = this.colors.text;
        ctx.font = '16px Arial';

        const stats = [
            `Total Goals: ${goals.totalGoals.toLocaleString()}`,
            `Avg Goals per Match: ${goals.avgGoalsPerMatch}`,
            `Highest Scoring Match: ${goals.highestScoringMatch} goals`,
            `Clean Sheets: ${goals.cleanSheets || 'N/A'}`
        ];

        let lineY = yPos + 65;
        stats.forEach((stat, index) => {
            const xPos = this.padding + 20 + (index % 2) * 550;
            if (index % 2 === 0 && index > 0) lineY += 35;
            ctx.fillText(stat, xPos, lineY);
        });

        return yPos + 150;
    }

    // Helper: Draw xG Stats Card
    drawXGStatsCard(ctx, xg, yPos) {
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 120);

        ctx.fillStyle = this.colors.purple;
        ctx.font = 'bold 20px Arial';
        ctx.fillText('📊 xG STATISTICS', this.padding + 20, yPos + 35);

        ctx.fillStyle = this.colors.text;
        ctx.font = '16px Arial';

        const stats = [
            `Avg xG per Match: ${xg.avgXG}`,
            `Avg xGA per Match: ${xg.avgXGA}`,
            `Total xG: ${xg.totalXG}`,
            `xG Accuracy: ${xg.accuracy || 'N/A'}`
        ];

        let lineY = yPos + 65;
        stats.forEach((stat, index) => {
            const xPos = this.padding + 20 + (index % 2) * 550;
            if (index % 2 === 0 && index > 0) lineY += 30;
            ctx.fillText(stat, xPos, lineY);
        });

        return yPos + 130;
    }

    // Helper: Draw Result Distribution
    drawResultDistribution(ctx, results, yPos) {
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 150);

        ctx.fillStyle = this.colors.warning;
        ctx.font = 'bold 20px Arial';
        ctx.fillText('🎯 RESULT DISTRIBUTION', this.padding + 20, yPos + 35);

        const barY = yPos + 70;
        const barHeight = 30;
        const maxWidth = this.width - 2 * this.padding - 200;

        ['wins', 'draws', 'losses'].forEach((result, index) => {
            const currentY = barY + index * 40;
            const percentage = parseFloat(results[result].percentage);
            const barWidth = (percentage / 100) * maxWidth;
            const color = result === 'wins' ? this.colors.success :
                         result === 'draws' ? this.colors.warning :
                         this.colors.danger;

            ctx.fillStyle = this.colors.text;
            ctx.font = '14px Arial';
            ctx.fillText(`${result.charAt(0).toUpperCase() + result.slice(1)}:`, this.padding + 20, currentY + 20);

            ctx.fillStyle = color;
            ctx.fillRect(this.padding + 120, currentY, barWidth, barHeight);

            ctx.fillStyle = this.colors.text;
            ctx.fillText(`${results[result].count} (${percentage}%)`, this.padding + 130 + barWidth, currentY + 20);
        });

        return yPos + 160;
    }

    // Helper: Draw Home vs Away Card
    drawHomeAwayCard(ctx, homeAway, yPos) {
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 140);

        ctx.fillStyle = this.colors.orange;
        ctx.font = 'bold 20px Arial';
        ctx.fillText('🏠 HOME vs AWAY PERFORMANCE', this.padding + 20, yPos + 35);

        ctx.fillStyle = this.colors.text;
        ctx.font = '16px Arial';

        const stats = [
            `Home Matches: ${homeAway.homeMatches}`,
            `Away Matches: ${homeAway.awayMatches}`,
            `Home Win Rate: ${homeAway.homeWinRate}%`,
            `Away Win Rate: ${homeAway.awayWinRate}%`,
            `Home Advantage: ${homeAway.homeAdvantage}%`
        ];

        let lineY = yPos + 65;
        stats.forEach((stat, index) => {
            const xPos = this.padding + 20 + (index % 2) * 550;
            if (index % 2 === 0 && index > 0) lineY += 30;
            ctx.fillText(stat, xPos, lineY);
        });

        return yPos + 150;
    }

    // Helper: Draw Top Teams Summary
    drawTopTeamsSummary(ctx, topTeams, yPos) {
        const cardHeight = 60 + topTeams.length * 35;
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, cardHeight);

        ctx.fillStyle = this.colors.accent;
        ctx.font = 'bold 20px Arial';
        ctx.fillText('🌟 TOP TEAMS SUMMARY', this.padding + 20, yPos + 35);

        ctx.font = '15px Arial';
        let lineY = yPos + 65;

        topTeams.forEach((team, index) => {
            const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐';
            ctx.fillStyle = this.colors.text;
            ctx.fillText(`${emoji} ${index + 1}. ${team.name}`, this.padding + 30, lineY);
            ctx.fillStyle = this.colors.textSecondary;
            ctx.fillText(`(${team.league})`, this.padding + 350, lineY);
            ctx.fillStyle = this.colors.accent;
            ctx.fillText(`${team.ppg} PPG`, this.padding + 600, lineY);
            lineY += 35;
        });

        return yPos + cardHeight + 10;
    }

    // Helper: Draw Data Quality Card
    drawDataQualityCard(ctx, dataQuality, yPos) {
        ctx.fillStyle = this.colors.cardBg;
        ctx.fillRect(this.padding, yPos, this.width - 2 * this.padding, 150);

        ctx.fillStyle = this.colors.danger;
        ctx.font = 'bold 20px Arial';
        ctx.fillText('🔍 DATA QUALITY REPORT', this.padding + 20, yPos + 35);

        ctx.fillStyle = this.colors.text;
        ctx.font = '15px Arial';

        const quality = [
            `Missing Team Names: ${dataQuality.missingTeamNames} (${dataQuality.missingTeamNamesPercent}%)`,
            `Missing Results: ${dataQuality.missingResults} (${dataQuality.missingResultsPercent}%)`,
            `Missing xG Data: ${dataQuality.missingXG} (${dataQuality.missingXGPercent}%)`,
            `Missing Dates: ${dataQuality.missingDates} (${dataQuality.missingDatesPercent}%)`,
            `Overall Quality Score: ${dataQuality.qualityScore}/100`
        ];

        let lineY = yPos + 65;
        quality.forEach((item, index) => {
            const xPos = this.padding + 20 + (index % 2) * 550;
            if (index % 2 === 0 && index > 0) lineY += 30;
            ctx.fillText(item, xPos, lineY);
        });

        return yPos + 160;
    }

    // Helper: Draw Footer
    drawFooter(ctx) {
        ctx.fillStyle = this.colors.textSecondary;
        ctx.font = '12px Arial';
        ctx.fillText('⚽ Football Data Explorer | Powered by Advanced Analytics', this.padding, this.height - 20);
        ctx.fillText(new Date().toLocaleDateString(), this.width - 200, this.height - 20);
    }
}

// ============================================================================
// FOOTBALL DATA EXPLORER CLASS
// ============================================================================

class FootballDataExplorer {
    constructor() {
        this.data = [];
        this.teams = [];
        this.leagues = new Map();
        this.loadErrors = [];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.leagueConfigs = {
            'epl': {
                name: 'Premier League',
                url: 'https://raw.githubusercontent.com/Timvane-coder/MySite-/02629107bf7b037ca64c0e737893e5417694bcc5/premier_league_detailed_data.csv',
                color: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
            },
            'serie-a': {
                name: 'Serie A',
                url: 'https://raw.githubusercontent.com/Timvane-coder/MySite-/111e1d61cffac7f888e4c7d2d5bd0b21b61358d4/seriea_detailed_data.csv',
                color: '🇮🇹'
            },
            'bundesliga': {
                name: 'Bundesliga',
                url: 'https://raw.githubusercontent.com/Timvane-coder/MySite-/02629107bf7b037ca64c0e737893e5417694bcc5/bundesliga_detailed_data.csv',
                color: '🇩🇪'
            },
            'la-liga': {
                name: 'La Liga',
                url: 'https://raw.githubusercontent.com/Timvane-coder/MySite-/02629107bf7b037ca64c0e737893e5417694bcc5/laliga_detailed_data.csv',
                color: '🇪🇸'
            },
            'ligue-1': {
                name: 'Ligue 1',
                url: 'https://raw.githubusercontent.com/Timvane-coder/MySite-/02629107bf7b037ca64c0e737893e5417694bcc5/ligue1_detailed_data.csv',
                color: '🇫🇷'
            }
        };
        
        // Initialize image generator
        this.imageGenerator = new FootballImageGenerator();
        this.tempImageDir = './temp/football_images';
        
        // Create temp directory
        if (!fs.existsSync(this.tempImageDir)) {
            fs.mkdirSync(this.tempImageDir, { recursive: true });
        }
    }

    async loadCSV(source, leagueKey = null) {
        return new Promise(async (resolve, reject) => {
            const results = [];
            let stream;
            let headers = [];
            try {
                if (source.startsWith('http')) {
                    this.log(`📡 Fetching data from ${this.leagueConfigs[leagueKey]?.name || leagueKey}...`);
                    const response = await fetch(source, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        },
                        timeout: 15000
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    const text = await response.text();
                    if (text.trim().startsWith('<!DOCTYPE html') || text.trim().startsWith('<html')) {
                        throw new Error('Received HTML page instead of CSV');
                    }
                    stream = Readable.from([text]);
                } else {
                    if (!fs.existsSync(source)) {
                        throw new Error(`File not found: ${source}`);
                    }
                    this.log(`📁 Loading data from ${source}...`);
                    stream = fs.createReadStream(source);
                }
                stream
                    .pipe(csv({
                        skipEmptyLines: true,
                        trim: true
                    }))
                    .on('headers', (headerList) => {
                        headers = headerList.map(h => h.trim());
                    })
                    .on('data', (data) => {
                        const cleanData = {};
                        Object.keys(data).forEach(key => {
                            const cleanKey = key.trim();
                            const cleanValue = typeof data[key] === 'string' ? data[key].trim() : data[key];
                            cleanData[cleanKey] = cleanValue;
                        });
                        let teamName = cleanData.title || cleanData.team || cleanData.name ||
                            cleanData.Team || cleanData.Title || cleanData.NAME ||
                            cleanData.club || cleanData.Club;
                        if (teamName) {
                            cleanData.title = teamName;
                        }
                        const numericFields = ['xG', 'xGA', 'npxG', 'npxGA', 'deep', 'deep_allowed',
                            'scored', 'missed', 'xpts', 'wins', 'draws', 'loses', 'pts', 'npxGD',
                            'ppda_att', 'ppda_def', 'ppda_allowed_att', 'ppda_allowed_def'];
                        numericFields.forEach(field => {
                            if (cleanData[field] !== undefined && cleanData[field] !== null && cleanData[field] !== '') {
                                const numValue = parseFloat(cleanData[field]);
                                if (!isNaN(numValue)) {
                                    cleanData[field] = numValue;
                                }
                            }
                        });
                        if (leagueKey) {
                            cleanData.league = leagueKey;
                            cleanData.leagueName = this.leagueConfigs[leagueKey]?.name || leagueKey;
                        }
                        if (cleanData.result && typeof cleanData.result === 'string') {
                            cleanData.result = cleanData.result.toLowerCase();
                        }
                        results.push(cleanData);
                    })
                    .on('end', () => {
                        if (results.length === 0) {
                            reject(new Error('No data found in CSV file'));
                            return;
                        }
                        const validTeams = results.filter(row => row.title && row.title !== 'undefined' && row.title.trim() !== '');
                        if (leagueKey) {
                            this.leagues.set(leagueKey, results);
                            this.log(`✅ Loaded ${results.length} matches for ${this.leagueConfigs[leagueKey]?.name || leagueKey} (${validTeams.length} with team names)`);
                        }
                        resolve(results);
                    })
                    .on('error', (error) => {
                        this.loadErrors.push({ league: leagueKey, error: error.message });
                        reject(error);
                    });
            } catch (error) {
                this.loadErrors.push({ league: leagueKey, error: error.message });
                reject(error);
            }
        });
    }

    async loadMultipleLeagues(sources) {
        this.log('🌍 Loading multiple leagues...\n');
        this.loadErrors = [];
        for (const [leagueKey, source] of Object.entries(sources)) {
            try {
                const leagueData = await this.loadCSV(source, leagueKey);
                this.data.push(...leagueData);
            } catch (error) {
                this.log(`❌ Error loading ${this.leagueConfigs[leagueKey]?.name || leagueKey}: ${error.message}`);
            }
        }
        const allTitles = this.data.map(row => row.title).filter(title => title && title.trim() !== '' && title !== 'undefined');
        this.teams = [...new Set(allTitles)].sort();
        this.log(`\n🏆 Total: ${this.data.length} matches across ${this.leagues.size} leagues`);
        this.log(`👥 ${this.teams.length} unique teams loaded`);
        return this.data;
    }

    async loadDefaultLeagues() {
        const sources = {};
        for (const [key, config] of Object.entries(this.leagueConfigs)) {
            sources[key] = config.url;
        }
        return this.loadMultipleLeagues(sources);
    }

    showMenu() {
        this.log('\n⚽ FOOTBALL DATA EXPLORER - MULTI LEAGUE');
        this.log('========================================');
        this.log('1. Show all teams');
        this.log('2. Analyze specific team');
        this.log('3. Compare two teams');
        this.log('4. Show top performers');
        this.log('5. Filter matches');
        this.log('6. League comparison');
        this.log('7. Show match details');
        this.log('8. Statistics summary');
        this.log('9. 📈 Form Table Analysis');
        this.log('10. 📊 Performance Trends');
        this.log('11. 🔮 Match Predictions');
        this.log('0. Exit');
        this.log('========================================');
    }

    showTeams() {
        this.log('\n📋 TEAMS BY LEAGUE:');
        if (this.teams.length === 0) {
            this.log('❌ No teams available.');
            return;
        }
        for (const [leagueKey, leagueData] of this.leagues) {
            const config = this.leagueConfigs[leagueKey];
            const leagueTeams = [...new Set(leagueData
                .map(row => row.title)
                .filter(team => team && team !== 'undefined' && team.trim() !== '')
            )].sort();
            this.log(`\n${config?.color || '⚽'} ${config?.name || leagueKey.toUpperCase()}:`);
            if (leagueTeams.length === 0) {
                this.log('  ❌ No valid team names found');
            } else {
                leagueTeams.forEach((team, index) => {
                    const teamMatches = leagueData.filter(row => row.title === team);
                    this.log(`  ${index + 1}. ${team} (${teamMatches.length} matches)`);
                });
            }
        }
    }

    getTeamByChoice(choice) {
        if (!choice || choice.trim() === '') return null;
        const choiceStr = choice.trim();
        const choiceNum = parseInt(choiceStr);
        if (!isNaN(choiceNum) && choiceNum > 0 && choiceNum <= this.teams.length) {
            return this.teams[choiceNum - 1];
        }
        let team = this.teams.find(t => t.toLowerCase() === choiceStr.toLowerCase());
        if (team) return team;
        team = this.teams.find(t => t.toLowerCase().includes(choiceStr.toLowerCase()));
        return team;
    }

    log(message) {
        console.log(message);
    }

    async question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve);
        });
    }

    // Analyze Team with Image Generation
    async analyzeTeam() {
        this.log('\n🔍 TEAM ANALYSIS');
        if (this.teams.length === 0) {
            this.log('❌ No teams available for analysis.');
            return null;
        }
        this.showTeams();
        const teamChoice = await this.question('\nEnter team name (or part of it): ');
        const selectedTeam = this.teams.find(team =>
            team.toLowerCase().includes(teamChoice.toLowerCase()));

        if (!selectedTeam) {
            this.log('❌ Team not found!');
            return null;
        }

        const teamData = this.data.filter(row => row.title === selectedTeam);
        const league = teamData[0]?.league;
        const leagueConfig = this.leagueConfigs[league];

        const stats = this.prepareTeamStatsForImage(selectedTeam, teamData);
        const recentMatches = this.prepareRecentMatchesForImage(teamData);

        const imageBuffer = await this.imageGenerator.generateTeamAnalysis(
            selectedTeam,
            leagueConfig?.name || 'Unknown League',
            leagueConfig?.color || '⚽',
            stats,
            recentMatches
        );

        const filename = path.join(this.tempImageDir, `team_analysis_${selectedTeam.replace(/\s+/g, '_')}_${Date.now()}.png`);
        fs.writeFileSync(filename, imageBuffer);

        this.log(`✅ Team analysis image generated: ${filename}`);
        return filename;
    }

    prepareTeamStatsForImage(teamName, data) {
        const matches = data.length;
        const wins = data.filter(m => m.result === 'w').length;
        const draws = data.filter(m => m.result === 'd').length;
        const losses = data.filter(m => m.result === 'l').length;
        const scored = data.reduce((sum, m) => sum + (m.scored || 0), 0);
        const conceded = data.reduce((sum, m) => sum + (m.missed || 0), 0);
        const xG = data.reduce((sum, m) => sum + (m.xG || 0), 0);
        const xGA = data.reduce((sum, m) => sum + (m.xGA || 0), 0);
        const points = data.reduce((sum, m) => sum + (m.pts || 0), 0);

        return {
            matches,
            wins,
            draws,
            losses,
            points,
            pointsPercentage: ((points / (matches * 3)) * 100).toFixed(1),
            scored,
            conceded,
            goalDiff: scored - conceded,
            xG: xG.toFixed(2),
            xGA: xGA.toFixed(2),
            xGDiff: (xG - xGA).toFixed(2),
            avgGoals: (scored / matches).toFixed(2),
            avgXG: (xG / matches).toFixed(2)
        };
    }

    prepareRecentMatchesForImage(teamData) {
        return teamData.slice(-5).map((match, index) => ({
            index: teamData.length - 4 + index,
            date: (match.date || 'No date').substring(0, 10),
            venue: match.h_a === 'h' ? 'vs' : match.h_a === 'a' ? '@' : '',
            result: match.result ? match.result.toUpperCase() : 'N/A',
            score: `${match.scored || 0}-${match.missed || 0}`,
            xG: match.xG ? match.xG.toFixed(2) : 'N/A'
        }));
    }

    // Compare Teams with Image Generation
    async compareTeams() {
        this.log('\n⚔️ TEAM COMPARISON');
        if (this.teams.length === 0) {
            this.log('❌ No teams available for comparison.');
            return null;
        }
        this.showTeams();
        const team1Choice = await this.question('\nSelect first team: ');
        const team2Choice = await this.question('Select second team: ');

        const team1 = this.teams.find(team => team.toLowerCase().includes(team1Choice.toLowerCase()));
        const team2 = this.teams.find(team => team.toLowerCase().includes(team2Choice.toLowerCase()));

        if (!team1 || !team2) {
            this.log('❌ One or both teams not found!');
            return null;
        }

        const team1Data = this.data.filter(row => row.title === team1);
        const team2Data = this.data.filter(row => row.title === team2);

        const team1Stats = this.prepareComparisonStats(team1Data);
        const team2Stats = this.prepareComparisonStats(team2Data);
        const comparisonData = this.prepareComparisonBars(team1Stats, team2Stats);

        const imageBuffer = await this.imageGenerator.generateTeamComparison(
            team1, team1Stats, team2, team2Stats, comparisonData
        );

        const filename = path.join(this.tempImageDir, `comparison_${team1.replace(/\s+/g, '_')}_vs_${team2.replace(/\s+/g, '_')}_${Date.now()}.png`);
        fs.writeFileSync(filename, imageBuffer);

        this.log(`✅ Team comparison image generated: ${filename}`);
        return filename;
    }

    prepareComparisonStats(data) {
        const matches = data.length;
        const wins = data.filter(m => m.result === 'w').length;
        const points = data.reduce((s, m) => s + (m.pts || 0), 0);
        const scored = data.reduce((s, m) => s + (m.scored || 0), 0);
        const conceded = data.reduce((s, m) => s + (m.missed || 0), 0);
        const avgXG = matches > 0 ? (data.reduce((s, m) => s + (m.xG || 0), 0) / matches) : 0;

        return {
            matches,
            wins,
            points,
            scored,
            conceded,
            avgXG: avgXG.toFixed(2),
            ppg: (points / matches).toFixed(2),
            winRate: ((wins / matches) * 100).toFixed(1)
        };
    }

    prepareComparisonBars(team1Stats, team2Stats) {
        return [
            { name: 'Matches', team1: team1Stats.matches, team2: team2Stats.matches },
            { name: 'Wins', team1: team1Stats.wins, team2: team2Stats.wins },
            { name: 'Points', team1: team1Stats.points, team2: team2Stats.points },
            { name: 'Goals Scored', team1: team1Stats.scored, team2: team2Stats.scored },
            { name: 'Goals Conceded', team1: team1Stats.conceded, team2: team2Stats.conceded },
            { name: 'Avg xG', team1: team1Stats.avgXG, team2: team2Stats.avgXG }
        ];
    }

    // Show Top Performers with Image Generation
    async showTopPerformers() {
        this.log('\n🏆 TOP PERFORMERS ACROSS ALL LEAGUES');
        this.log('1. Highest xG average');
        this.log('2. Best goal difference');
        this.log('3. Most points per game');
        this.log('4. Best defensive record (lowest xGA)');
        const choice = await this.question('\nSelect category (1-4): ');

        if (this.teams.length === 0) {
            this.log('❌ No teams available for analysis.');
            return null;
        }

        const teamStats = this.teams.map(team => {
            const teamData = this.data.filter(row => row.title === team);
            const matches = teamData.length;
            const league = teamData[0]?.leagueName || 'Unknown';
            return {
                team: team,
                league: league,
                matches: matches,
                avgXG: matches > 0 ? teamData.reduce((s, m) => s + (m.xG || 0), 0) / matches : 0,
                avgXGA: matches > 0 ? teamData.reduce((s, m) => s + (m.xGA || 0), 0) / matches : 0,
                goalDiff: teamData.reduce((s, m) => s + (m.scored || 0) - (m.missed || 0), 0),
                pointsPerGame: matches > 0 ? teamData.reduce((s, m) => s + (m.pts || 0), 0) / matches : 0,
                totalPoints: teamData.reduce((s, m) => s + (m.pts || 0), 0)
            };
        });

        let sortedStats, title, category;
        switch (choice) {
            case '1':
                sortedStats = teamStats.sort((a, b) => b.avgXG - a.avgXG);
                title = 'HIGHEST xG AVERAGE';
                category = 'Expected Goals per Game';
                break;
            case '2':
                sortedStats = teamStats.sort((a, b) => b.goalDiff - a.goalDiff);
                title = 'BEST GOAL DIFFERENCE';
                category = 'Goal Differential';
                break;
            case '3':
                sortedStats = teamStats.sort((a, b) => b.pointsPerGame - a.pointsPerGame);
                title = 'MOST POINTS PER GAME';
                category = 'Points per Match';
                break;
            case '4':
                sortedStats = teamStats.sort((a, b) => a.avgXGA - b.avgXGA);
                title = 'BEST DEFENSIVE RECORD';
                category = 'Lowest Expected Goals Against';
                break;
            default:
                this.log('❌ Invalid choice');
                return null;
        }

        const performers = sortedStats.slice(0, 15).map(stat => {
            let value;
            switch (choice) {
                case '1': value = stat.avgXG.toFixed(2); break;
                case '2': value = stat.goalDiff.toString(); break;
                case '3': value = stat.pointsPerGame.toFixed(2); break;
                case '4': value = stat.avgXGA.toFixed(2); break;
            }
            return {
                team: stat.team,
                league: stat.league,
                value: value,
                matches: stat.matches
            };
        });

        const imageBuffer = await this.imageGenerator.generateTopPerformers(
            title, performers, category
        );

        const filename = path.join(this.tempImageDir, `top_performers_${choice}_${Date.now()}.png`);
        fs.writeFileSync(filename, imageBuffer);

        this.log(`✅ Top performers image generated: ${filename}`);
        return filename;
    }

    // Show Match Details with Image Generation
    async showMatchDetails() {
        this.log('\n📋 MATCH DETAILS');
        if (this.data.length === 0) {
            this.log('❌ No match data available.');
            return null;
        }
        const teamName = await this.question('Enter team name to see their matches: ');
        const team = this.teams.find(t => t.toLowerCase().includes(teamName.toLowerCase()));

        if (!team) {
            this.log('❌ Team not found!');
            return null;
        }

        const teamMatches = this.data.filter(row => row.title === team);

        const matches = teamMatches.map((match, index) => ({
            index: index + 1,
            date: match.date || 'No date',
            venue: match.h_a === 'h' ? 'Home' : match.h_a === 'a' ? 'Away' : 'N/A',
            result: match.result ? match.result.toUpperCase() : 'N/A',
            score: `${match.scored || 0}-${match.missed || 0}`,
            xG: match.xG ? match.xG.toFixed(2) : 'N/A',
            xGA: match.xGA ? match.xGA.toFixed(2) : 'N/A',
            points: match.pts || 0
        }));

        const imageBuffer = await this.imageGenerator.generateMatchDetails(team, matches);

        const filename = path.join(this.tempImageDir, `match_details_${team.replace(/\s+/g, '_')}_${Date.now()}.png`);
        fs.writeFileSync(filename, imageBuffer);

        this.log(`✅ Match details image generated: ${filename}`);
        return filename;
    }

    // Show Form Table with Image Generation
    async showFormTable() {
        this.log('\n📈 FORM TABLE ANALYSIS');
        this.log('\nSelect League:');

        let leagueIndex = 1;
        const leagueKeys = [];
        for (const [key, config] of Object.entries(this.leagueConfigs)) {
            if (this.leagues.has(key)) {
                this.log(`${leagueIndex}. ${config.color} ${config.name}`);
                leagueKeys.push(key);
                leagueIndex++;
            }
        }

        const leagueChoice = await this.question('\nSelect league number: ');
        const selectedLeagueKey = leagueKeys[parseInt(leagueChoice) - 1];

        if (!selectedLeagueKey) {
            this.log('❌ Invalid league selection!');
            return null;
        }

        const leagueData = this.leagues.get(selectedLeagueKey);
        const leagueTeams = [...new Set(leagueData.map(row => row.title).filter(Boolean))];

        const numMatches = await this.question('Enter number of recent matches to analyze (default 5): ') || '5';
        let n = parseInt(numMatches);
        if (isNaN(n) || n <= 0) {
            this.log('❌ Invalid number. Using default value of 5.');
            n = 5;
        }

        const formTable = leagueTeams.map(team => {
            const teamData = leagueData.filter(row => row.title === team);
            if (teamData.length === 0) return null;

            const sortedData = teamData.sort((a, b) => {
                if (a.date && b.date) return new Date(a.date) - new Date(b.date);
                return 0;
            });

            const recentMatches = sortedData.slice(-n);
            const points = recentMatches.reduce((sum, m) => sum + (m.pts || 0), 0);
            const wins = recentMatches.filter(m => m.result === 'w').length;
            const draws = recentMatches.filter(m => m.result === 'd').length;
            const losses = recentMatches.filter(m => m.result === 'l').length;
            const form = recentMatches.map(m => (m.result || 'u').toUpperCase()).join('');

            return {
                team,
                matches: recentMatches.length,
                points,
                wins,
                draws,
                losses,
                form: form || 'N/A',
                avgXG: recentMatches.length > 0 ?
                    (recentMatches.reduce((s, m) => s + (m.xG || 0), 0) / recentMatches.length).toFixed(2) : '0.00',
                avgXGA: recentMatches.length > 0 ?
                    (recentMatches.reduce((s, m) => s + (m.xGA || 0), 0) / recentMatches.length).toFixed(2) : '0.00'
            };
        }).filter(team => team !== null).sort((a, b) => b.points - a.points);

        const imageBuffer = await this.imageGenerator.generateFormTable(formTable, n);

        const filename = path.join(this.tempImageDir, `form_table_${selectedLeagueKey}_${Date.now()}.png`);
        fs.writeFileSync(filename, imageBuffer);

        this.log(`✅ Form table image generated: ${filename}`);
        return filename;
    }

    // Show Performance Trends with Image Generation
    async showPerformanceTrends() {
        this.showTeams();
        const teamChoice = await this.question('\nSelect team for trend analysis: ');
        const team = this.getTeamByChoice(teamChoice);

        if (!team) {
            this.log('❌ Team not found!');
            return null;
        }

        const teamData = this.data.filter(row => row.title === team);
        if (teamData.length === 0) {
            this.log('❌ No data found for this team!');
            return null;
        }

        const sortedData = teamData.sort((a, b) => {
            if (a.date && b.date) return new Date(a.date) - new Date(b.date);
            return 0;
        });

        const windowSize = Math.min(5, sortedData.length);
        const trends = [];

        for (let i = windowSize - 1; i < sortedData.length; i++) {
            const window = sortedData.slice(i - windowSize + 1, i + 1);
            const avgXG = window.reduce((s, m) => s + (m.xG || 0), 0) / windowSize;
            const avgXGA = window.reduce((s, m) => s + (m.xGA || 0), 0) / windowSize;
            const points = window.reduce((s, m) => s + (m.pts || 0), 0);
            const form = window.map(m => (m.result || 'u').toUpperCase()).join('');

            trends.push({
                matchNum: i + 1,
                date: sortedData[i].date || 'N/A',
                avgXG: avgXG.toFixed(2),
                avgXGA: avgXGA.toFixed(2),
                points: points,
                form: form,
                xGDiff: (avgXG - avgXGA).toFixed(2)
            });
        }

        const displayTrends = trends.slice(-15);
        const imageBuffer = await this.imageGenerator.generatePerformanceTrends(team, displayTrends);

        const filename = path.join(this.tempImageDir, `performance_trends_${team.replace(/\s+/g, '_')}_${Date.now()}.png`);
        fs.writeFileSync(filename, imageBuffer);

        this.log(`✅ Performance trends image generated: ${filename}`);
        return filename;
    }

    // Show Predictions Menu
    async showPredictions() {
        this.log('\n🔮 MATCH PREDICTOR & PROJECTIONS');
        this.log('================================');
        this.log('1. Predict next match outcome');
        this.log('2. Season projection');
        this.log('3. Goal prediction model');
        this.log('4. Team form analysis');
        this.log('5. League position predictor');
        this.log('0. Back to main menu');
        const choice = await this.question('\nSelect prediction type (0-5): ');

        switch (choice) {
            case '1': return await this.predictMatch();
            case '2': return await this.projectSeason();
            case '3': return await this.predictGoals();
            case '4': return await this.analyzeTeamForm();
            case '5': return await this.predictLeaguePositions();
            case '0': return null;
            default:
                this.log('❌ Invalid choice. Please select 0-5.');
                return null;
        }
    }

    // Predict Match with Image Generation
    async predictMatch() {
        this.log('\n🔮 MATCH OUTCOME PREDICTOR');
        this.log('='.repeat(50));
        this.showTeams();

        const team1Choice = await this.question('\nEnter home team name or number: ');
        const team2Choice = await this.question('Enter away team name or number: ');

        const homeTeam = this.getTeamByChoice(team1Choice);
        const awayTeam = this.getTeamByChoice(team2Choice);

        if (!homeTeam || !awayTeam) {
            this.log('❌ One or both teams not found!');
            return null;
        }

        if (homeTeam === awayTeam) {
            this.log('❌ Cannot predict a team against itself!');
            return null;
        }

        const homeData = this.data.filter(row => row.title === homeTeam);
        const awayData = this.data.filter(row => row.title === awayTeam);

        if (homeData.length === 0 || awayData.length === 0) {
            this.log('❌ Insufficient data for one or both teams!');
            return null;
        }

        const homeStats = this.calculateTeamStats(homeData, true);
        const awayStats = this.calculateTeamStats(awayData, false);
        const prediction = this.generateMatchPrediction(homeTeam, awayTeam, homeStats, awayStats);

        // Add enhanced predictions
        prediction.expectedAssists = this.calculateExpectedAssists(homeStats, awayStats);
        prediction.expectedPoints = this.calculateExpectedPoints(prediction);
        prediction.possessionPrediction = this.predictPossession(homeStats, awayStats);
        prediction.cardsPrediction = this.predictCards(homeStats, awayStats);
        prediction.cornersPrediction = this.predictCorners(homeStats, awayStats);

        const imageBuffer = await this.imageGenerator.generateMatchPrediction(
            homeTeam, awayTeam, prediction
        );

        const filename = path.join(this.tempImageDir, `match_prediction_${homeTeam.replace(/\s+/g, '_')}_vs_${awayTeam.replace(/\s+/g, '_')}_${Date.now()}.png`);
        fs.writeFileSync(filename, imageBuffer);

        this.log(`✅ Match prediction image generated: ${filename}`);
        return filename;
    }

    // Calculate Team Stats with ALL numeric fields
    calculateTeamStats(teamData, isHome) {
        const matches = teamData.length;
        if (matches === 0) return null;
        
        const stats = {
            matches,
            avgXG: teamData.reduce((s, m) => s + (m.xG || 0), 0) / matches,
            avgXGA: teamData.reduce((s, m) => s + (m.xGA || 0), 0) / matches,
            avgNpxG: teamData.reduce((s, m) => s + (m.npxG || 0), 0) / matches,
            avgNpxGA: teamData.reduce((s, m) => s + (m.npxGA || 0), 0) / matches,
            avgDeep: teamData.reduce((s, m) => s + (m.deep || 0), 0) / matches,
            avgDeepAllowed: teamData.reduce((s, m) => s + (m.deep_allowed || 0), 0) / matches,
            avgGoals: teamData.reduce((s, m) => s + (m.scored || 0), 0) / matches,
            avgGA: teamData.reduce((s, m) => s + (m.missed || 0), 0) / matches,
            avgPPDA_att: teamData.reduce((s, m) => s + (m.ppda_att || 0), 0) / matches,
            avgPPDA_def: teamData.reduce((s, m) => s + (m.ppda_def || 0), 0) / matches,
            avgPPDA_allowed_att: teamData.reduce((s, m) => s + (m.ppda_allowed_att || 0), 0) / matches,
            avgPPDA_allowed_def: teamData.reduce((s, m) => s + (m.ppda_allowed_def || 0), 0) / matches,
            ppg: teamData.reduce((s, m) => s + (m.pts || 0), 0) / matches,
            npxGD: teamData.reduce((s, m) => s + (m.npxGD || 0), 0) / matches
        };
        
        // Apply home/away adjustments
        if (isHome) {
            stats.avgXG *= 1.1;
            stats.avgXGA *= 0.9;
            stats.avgNpxG *= 1.1;
            stats.avgDeep *= 1.15;
        } else {
            stats.avgXG *= 0.9;
            stats.avgXGA *= 1.1;
            stats.avgNpxG *= 0.9;
            stats.avgDeep *= 0.85;
        }
        
        return stats;
    }

    // Generate Match Prediction
    generateMatchPrediction(homeTeam, awayTeam, homeStats, awayStats) {
        const homeXG = (homeStats.avgXG + awayStats.avgXGA) / 2;
        const awayXG = (awayStats.avgXG + homeStats.avgXGA) / 2;
        const homeWinProb = this.calculateWinProbability(homeXG, awayXG);
        const awayWinProb = this.calculateWinProbability(awayXG, homeXG);
        const drawProb = 100 - homeWinProb - awayWinProb;
        const predictedHomeGoals = Math.round(homeXG);
        const predictedAwayGoals = Math.round(awayXG);

        const keyFactors = [];
        if (homeStats.ppg > awayStats.ppg + 0.5) keyFactors.push(`${homeTeam} has superior recent form`);
        if (awayStats.ppg > homeStats.ppg + 0.5) keyFactors.push(`${awayTeam} has superior recent form`);
        if (homeXG > 2.0) keyFactors.push(`${homeTeam} strong attacking threat`);
        if (awayXG > 2.0) keyFactors.push(`${awayTeam} strong attacking threat`);
        if (homeStats.avgXGA < 1.0) keyFactors.push(`${homeTeam} solid defensive record`);
        if (awayStats.avgXGA < 1.0) keyFactors.push(`${awayTeam} solid defensive record`);

        const confidence = homeStats.matches > 10 && awayStats.matches > 10 ? 'High' :
            homeStats.matches > 5 && awayStats.matches > 5 ? 'Medium' : 'Low';

        const totalXG = homeXG + awayXG;
        const over25Goals = Math.min(85, totalXG * 35);
        const bothTeamsScore = Math.min(80, (homeXG * awayXG) * 25);
        const matchQuality = Math.min(10, ((homeStats.ppg + awayStats.ppg) / 2) * 3.33);

        return {
            homeXG,
            awayXG,
            homeWinProb,
            drawProb,
            awayWinProb,
            predictedScore: `${predictedHomeGoals}-${predictedAwayGoals}`,
            keyFactors,
            confidence,
            over25Goals,
            bothTeamsScore,
            matchQuality: matchQuality.toFixed(1)
        };
    }

    calculateWinProbability(teamXG, opponentXG) {
        const scoreDiff = teamXG - opponentXG;
        let baseProb = 35;
        if (scoreDiff > 0.5) baseProb += 20;
        if (scoreDiff > 1.0) baseProb += 15;
        if (scoreDiff < -0.5) baseProb -= 15;
        if (scoreDiff < -1.0) baseProb -= 10;
        return Math.max(10, Math.min(75, baseProb));
    }

    // Enhanced Prediction: Expected Assists
    calculateExpectedAssists(homeStats, awayStats) {
        const homeXA = (homeStats.avgNpxG || homeStats.avgXG) * 0.75;
        const awayXA = (awayStats.avgNpxG || awayStats.avgXG) * 0.75;
        
        const homeDeepBonus = homeStats.avgDeep ? homeStats.avgDeep * 0.05 : 0;
        const awayDeepBonus = awayStats.avgDeep ? awayStats.avgDeep * 0.05 : 0;
        
        return {
            home: (homeXA + homeDeepBonus).toFixed(2),
            away: (awayXA + awayDeepBonus).toFixed(2)
        };
    }

    // Enhanced Prediction: Expected Points
    calculateExpectedPoints(prediction) {
        const homeXP = (prediction.homeWinProb / 100) * 3 + (prediction.drawProb / 100) * 1;
        const awayXP = (prediction.awayWinProb / 100) * 3 + (prediction.drawProb / 100) * 1;
        return {
            home: homeXP.toFixed(2),
            away: awayXP.toFixed(2)
        };
    }

    // Enhanced Prediction: Possession
    predictPossession(homeStats, awayStats) {
        const homePPDA = homeStats.avgPPDA_att || 0;
        const awayPPDA = awayStats.avgPPDA_att || 0;
        
        const totalXG = homeStats.avgXG + awayStats.avgXG;
        if (totalXG === 0) return { home: '50.0', away: '50.0' };
        
        let homePossession = (homeStats.avgXG / totalXG) * 50 + 50;
        
        if (homePPDA > 0 && awayPPDA > 0) {
            const ppdaRatio = homePPDA / (homePPDA + awayPPDA);
            homePossession = (homePossession * 0.7) + (ppdaRatio * 100 * 0.3);
        }
        
        const awayPossession = 100 - homePossession;
        
        return {
            home: Math.min(70, Math.max(30, homePossession)).toFixed(1),
            away: Math.min(70, Math.max(30, awayPossession)).toFixed(1)
        };
    }

    // Enhanced Prediction: Cards
    predictCards(homeStats, awayStats) {
        const homePPDA_def = homeStats.avgPPDA_def || 3;
        const awayPPDA_def = awayStats.avgPPDA_def || 3;
        
        const homeCards = Math.max(1, Math.min(5, (6 - homePPDA_def) * 0.8));
        const awayCards = Math.max(1, Math.min(5, (6 - awayPPDA_def) * 0.8));
        
        return {
            home: homeCards.toFixed(1),
            away: awayCards.toFixed(1),
            total: (homeCards + awayCards).toFixed(1)
        };
    }

    // Enhanced Prediction: Corners
    predictCorners(homeStats, awayStats) {
        const homeDeep = homeStats.avgDeep || (homeStats.avgXG * 2);
        const awayDeep = awayStats.avgDeep || (awayStats.avgXG * 2);
        
        const homeCorners = homeDeep * 1.5;
        const awayCorners = awayDeep * 1.5;
        
        return {
            home: Math.round(Math.max(2, Math.min(12, homeCorners))),
            away: Math.round(Math.max(2, Math.min(12, awayCorners))),
            total: Math.round(Math.max(4, Math.min(20, homeCorners + awayCorners)))
        };
    }

    // Statistics Summary with Image Generation
    async statisticsSummary() {
        this.log('\n📈 COMPREHENSIVE STATISTICS SUMMARY');
        this.log('='.repeat(80));
        
        if (this.data.length === 0) {
            this.log('❌ No data available for statistics.');
            return null;
        }

        const totalMatches = this.data.length;
        const totalTeams = this.teams.length;
        const totalLeagues = this.leagues.size;

        // Prepare overall stats
        const overall = {
            totalMatches,
            totalTeams,
            totalLeagues,
            coverage: ((totalMatches / (totalLeagues * 380)) * 100).toFixed(1)
        };

        // League breakdown
        const leagues = [];
        for (const [leagueKey, leagueData] of this.leagues) {
            const config = this.leagueConfigs[leagueKey];
            const uniqueTeams = new Set(leagueData.map(row => row.title).filter(Boolean));
            leagues.push({
                name: config?.name || leagueKey,
                emoji: config?.color || '⚽',
                matches: leagueData.length,
                teams: uniqueTeams.size
            });
        }

        // Goal statistics
        const validMatches = this.data.filter(m => m.scored !== undefined && m.missed !== undefined);
        let goals = null;
        if (validMatches.length > 0) {
            const totalGoalsScored = validMatches.reduce((sum, m) => sum + (m.scored || 0), 0);
            const avgGoalsPerMatch = totalGoalsScored / validMatches.length;
            const highestScoringMatch = Math.max(...validMatches.map(m => (m.scored || 0) + (m.missed || 0)));
            const cleanSheets = validMatches.filter(m => m.missed === 0).length;
            
            goals = {
                totalGoals: totalGoalsScored,
                avgGoalsPerMatch: avgGoalsPerMatch.toFixed(2),
                highestScoringMatch,
                cleanSheets
            };
        }

        // xG statistics
        const xgMatches = this.data.filter(m => m.xG !== undefined && m.xGA !== undefined);
        let xg = null;
        if (xgMatches.length > 0) {
            const totalXG = xgMatches.reduce((sum, m) => sum + (m.xG || 0), 0);
            const totalXGA = xgMatches.reduce((sum, m) => sum + (m.xGA || 0), 0);
            const avgXG = totalXG / xgMatches.length;
            const avgXGA = totalXGA / xgMatches.length;
            
            // Calculate xG accuracy
            const validXGMatches = this.data.filter(m => m.xG !== undefined && m.scored !== undefined);
            let accuracy = 'N/A';
            if (validXGMatches.length > 0) {
                const totalActualGoals = validXGMatches.reduce((s, m) => s + (m.scored || 0), 0);
                const totalExpectedGoals = validXGMatches.reduce((s, m) => s + (m.xG || 0), 0);
                accuracy = totalExpectedGoals > 0 ? ((totalActualGoals / totalExpectedGoals) * 100).toFixed(1) + '%' : 'N/A';
            }
            
            xg = {
                avgXG: avgXG.toFixed(2),
                avgXGA: avgXGA.toFixed(2),
                totalXG: totalXG.toFixed(2),
                accuracy
            };
        }

        // Result distribution
        const resultsWithData = this.data.filter(m => m.result);
        let results = null;
        if (resultsWithData.length > 0) {
            const wins = resultsWithData.filter(m => m.result === 'w').length;
            const draws = resultsWithData.filter(m => m.result === 'd').length;
            const losses = resultsWithData.filter(m => m.result === 'l').length;
            
            results = {
                wins: { 
                    count: wins, 
                    percentage: (wins / resultsWithData.length * 100).toFixed(1) 
                },
                draws: { 
                    count: draws, 
                    percentage: (draws / resultsWithData.length * 100).toFixed(1) 
                },
                losses: { 
                    count: losses, 
                    percentage: (losses / resultsWithData.length * 100).toFixed(1) 
                }
            };
        }

        // Home vs Away performance
        const homeAwayMatches = this.data.filter(m => m.h_a && m.result);
        let homeAway = null;
        if (homeAwayMatches.length > 0) {
            const homeMatches = homeAwayMatches.filter(m => m.h_a === 'h');
            const awayMatches = homeAwayMatches.filter(m => m.h_a === 'a');
            const homeWins = homeMatches.filter(m => m.result === 'w').length;
            const awayWins = awayMatches.filter(m => m.result === 'w').length;
            const homeWinRate = homeMatches.length > 0 ? (homeWins / homeMatches.length * 100).toFixed(1) : '0.0';
            const awayWinRate = awayMatches.length > 0 ? (awayWins / awayMatches.length * 100).toFixed(1) : '0.0';
            
            homeAway = {
                homeMatches: homeMatches.length,
                awayMatches: awayMatches.length,
                homeWinRate,
                awayWinRate,
                homeAdvantage: (parseFloat(homeWinRate) - parseFloat(awayWinRate)).toFixed(1)
            };
        }

        // Top teams
        const teamStats = this.teams.map(team => {
            const teamData = this.data.filter(row => row.title === team);
            const matches = teamData.length;
            return {
                name: team,
                league: teamData[0]?.leagueName || 'Unknown',
                matches,
                points: teamData.reduce((s, m) => s + (m.pts || 0), 0),
                ppg: matches > 0 ? (teamData.reduce((s, m) => s + (m.pts || 0), 0) / matches).toFixed(2) : '0.00'
            };
        });

        const topTeams = teamStats
            .filter(t => t.matches >= 10)
            .sort((a, b) => parseFloat(b.ppg) - parseFloat(a.ppg))
            .slice(0, 5);

        // Data quality
        const missingTeamNames = this.data.filter(m => !m.title || m.title.trim() === '').length;
        const missingResults = this.data.filter(m => !m.result).length;
        const missingXG = this.data.filter(m => m.xG === undefined || m.xG === null).length;
        const missingDates = this.data.filter(m => !m.date).length;
        
        const qualityScore = Math.round(
            ((totalMatches - missingTeamNames - missingResults - missingXG - missingDates) / 
            (totalMatches * 4)) * 100
        );

        const dataQuality = {
            missingTeamNames,
            missingTeamNamesPercent: (missingTeamNames / totalMatches * 100).toFixed(1),
            missingResults,
            missingResultsPercent: (missingResults / totalMatches * 100).toFixed(1),
            missingXG,
            missingXGPercent: (missingXG / totalMatches * 100).toFixed(1),
            missingDates,
            missingDatesPercent: (missingDates / totalMatches * 100).toFixed(1),
            qualityScore
        };

        // Compile summary data
        const summaryData = {
            overall,
            leagues,
            goals,
            xg,
            results,
            homeAway,
            topTeams,
            dataQuality
        };

        // Generate image
        try {
            const imageBuffer = await this.imageGenerator.generateStatisticsSummary(summaryData);
            const filename = path.join(this.tempImageDir, `statistics_summary_${Date.now()}.png`);
            fs.writeFileSync(filename, imageBuffer);

            this.log(`✅ Statistics summary image generated: ${filename}`);
            return filename;
        } catch (error) {
            this.log(`❌ Error generating image: ${error.message}`);
            // Fallback to text output
            this.logTextSummary(summaryData);
            return null;
        }
    }

    // Fallback text logging helper
    logTextSummary(summaryData) {
        this.log(`\n🌍 OVERALL STATISTICS:`);
        this.log(`Total Matches: ${summaryData.overall.totalMatches.toLocaleString()}`);
        this.log(`Total Teams: ${summaryData.overall.totalTeams}`);
        this.log(`Total Leagues: ${summaryData.overall.totalLeagues}`);
        
        this.log(`\n🏆 LEAGUE BREAKDOWN:`);
        summaryData.leagues.forEach(league => {
            this.log(`${league.emoji} ${league.name}: ${league.matches} matches, ${league.teams} teams`);
        });
        
        if (summaryData.goals) {
            this.log(`\n⚽ GOAL STATISTICS:`);
            this.log(`Total Goals: ${summaryData.goals.totalGoals.toLocaleString()}`);
            this.log(`Average Goals per Match: ${summaryData.goals.avgGoalsPerMatch}`);
            this.log(`Highest Scoring Match: ${summaryData.goals.highestScoringMatch} goals`);
        }
        
        if (summaryData.xg) {
            this.log(`\n📊 xG STATISTICS:`);
            this.log(`Average xG per Match: ${summaryData.xg.avgXG}`);
            this.log(`Average xGA per Match: ${summaryData.xg.avgXGA}`);
            this.log(`Total xG: ${summaryData.xg.totalXG}`);
        }
        
        if (summaryData.results) {
            this.log(`\n🎯 RESULT DISTRIBUTION:`);
            this.log(`Wins: ${summaryData.results.wins.count} (${summaryData.results.wins.percentage}%)`);
            this.log(`Draws: ${summaryData.results.draws.count} (${summaryData.results.draws.percentage}%)`);
            this.log(`Losses: ${summaryData.results.losses.count} (${summaryData.results.losses.percentage}%)`);
        }
        
        if (summaryData.homeAway) {
            this.log(`\n🏠 HOME vs AWAY PERFORMANCE:`);
            this.log(`Home Win Rate: ${summaryData.homeAway.homeWinRate}%`);
            this.log(`Away Win Rate: ${summaryData.homeAway.awayWinRate}%`);
        }
        
        if (summaryData.topTeams && summaryData.topTeams.length > 0) {
            this.log(`\n🌟 TOP TEAMS:`);
            summaryData.topTeams.forEach((team, index) => {
                this.log(`${index + 1}. ${team.name} (${team.league}): ${team.ppg} PPG`);
            });
        }
    }


// League Comparison
    async compareLeagues() {
        this.log('\n🌍 LEAGUE COMPARISON');
        if (this.leagues.size === 0) {
            this.log('❌ No leagues loaded for comparison.');
            return;
        }
        const leagueStats = new Map();
        for (const [leagueKey, leagueData] of this.leagues) {
            const config = this.leagueConfigs[leagueKey];
            const matches = leagueData.length;
            const totalGoals = leagueData.reduce((sum, m) => sum + (m.scored || 0), 0);
            const totalXG = leagueData.reduce((sum, m) => sum + (m.xG || 0), 0);
            const homeWins = leagueData.filter(m => m.h_a === 'h' && m.result === 'w').length;
            const homeMatches = leagueData.filter(m => m.h_a === 'h').length;
            leagueStats.set(leagueKey, {
                name: config?.name || leagueKey,
                color: config?.color || '⚽',
                matches,
                avgGoals: matches > 0 ? totalGoals / matches : 0,
                avgXG: matches > 0 ? totalXG / matches : 0,
                homeWinRate: homeMatches > 0 ? (homeWins / homeMatches) * 100 : 0
            });
        }
        this.log('\n📊 LEAGUE STATISTICS:');
        this.log('='.repeat(80));
        this.log('League'.padEnd(20) + 'Matches'.padEnd(10) + 'Avg Goals'.padEnd(12) + 'Avg xG'.padEnd(10) + 'Home Win %');
        this.log('='.repeat(80));
        for (const [key, stats] of leagueStats) {
            this.log(
                `${stats.color} ${stats.name.padEnd(15)}`.padEnd(20) +
                stats.matches.toString().padEnd(10) +
                stats.avgGoals.toFixed(2).padEnd(12) +
                stats.avgXG.toFixed(2).padEnd(10) +
                stats.homeWinRate.toFixed(1) + '%'
            );
        }
    }



async projectSeason() {
    this.log('\n📈 SEASON PROJECTION');
    this.log('='.repeat(50));
    this.showTeams();
    const teamChoice = await this.question('\nEnter team name or number for season projection: ');
    const team = this.getTeamByChoice(teamChoice);
    
    if (!team) {
        this.log('❌ Team not found!');
        return null;
    }
    
    const teamData = this.data.filter(row => row.title === team);
    if (teamData.length === 0) {
        this.log('❌ No data found for this team!');
        return null;
    }
    
    const projection = this.calculateSeasonProjection(team, teamData);
    
    // Generate image
    const imageBuffer = await this.imageGenerator.generateSeasonProjection(
        team, projection, teamData.length
    );
    
    const filename = path.join(this.tempImageDir, `season_projection_${team.replace(/\s+/g, '_')}_${Date.now()}.png`);
    fs.writeFileSync(filename, imageBuffer);
    
    this.log(`✅ Season projection image generated: ${filename}`);
    return filename;
}

async predictGoals() {
    this.log('\n⚽ GOAL PREDICTION MODEL');
    this.log('='.repeat(50));
    this.showTeams();
    const teamChoice = await this.question('\nEnter team name or number: ');
    const team = this.getTeamByChoice(teamChoice);
    
    if (!team) {
        this.log('❌ Team not found!');
        return null;
    }
    
    const teamData = this.data.filter(row => row.title === team);
    if (teamData.length === 0) {
        this.log('❌ No data found for this team!');
        return null;
    }
    
    const goalModel = this.calculateGoalModel(team, teamData);
    
    // Generate image
    const imageBuffer = await this.imageGenerator.generateGoalPrediction(team, goalModel);
    
    const filename = path.join(this.tempImageDir, `goal_prediction_${team.replace(/\s+/g, '_')}_${Date.now()}.png`);
    fs.writeFileSync(filename, imageBuffer);
    
    this.log(`✅ Goal prediction image generated: ${filename}`);
    return filename;
}

async analyzeTeamForm() {
    this.log('\n📈 TEAM FORM ANALYSIS');
    this.log('='.repeat(50));
    this.showTeams();
    const teamChoice = await this.question('\nEnter team name or number: ');
    const team = this.getTeamByChoice(teamChoice);if (!team) {
        this.log('❌ Team not found!');
        return null;
    }
    
    const teamData = this.data.filter(row => row.title === team);
    if (teamData.length === 0) {
        this.log('❌ No data found for this team!');
        return null;
    }
    
    const formAnalysis = this.analyzeForm(team, teamData);
    
    // Generate image
    const imageBuffer = await this.imageGenerator.generateTeamFormAnalysis(team, formAnalysis);
    
    const filename = path.join(this.tempImageDir, `team_form_${team.replace(/\s+/g, '_')}_${Date.now()}.png`);
    fs.writeFileSync(filename, imageBuffer);
    
    this.log(`✅ Team form analysis image generated: ${filename}`);
    return filename;
}

async predictLeaguePositions() {
    this.log('\n🏆 LEAGUE POSITION PREDICTOR');
    this.log('='.repeat(50));
    this.log('\nAvailable leagues:');
    
    let leagueIndex = 1;
    const leagueKeys = [];
    for (const [key, config] of Object.entries(this.leagueConfigs)) {
        if (this.leagues.has(key)) {
            this.log(`${leagueIndex}. ${config.color} ${config.name}`);
            leagueKeys.push(key);
            leagueIndex++;
        }
    }
    
    if (leagueKeys.length === 0) {
        this.log('❌ No league data available!');
        return null;
    }
    
    const leagueChoice = await this.question('\nSelect league number: ');
    const selectedLeagueKey = leagueKeys[parseInt(leagueChoice) - 1];
    
    if (!selectedLeagueKey) {
        this.log('❌ Invalid league selection!');
        return null;
    }
    
    const leagueData = this.leagues.get(selectedLeagueKey);
    const predictions = this.predictFinalTable(selectedLeagueKey, leagueData);
    const leagueStats = this.calculateLeagueStats(predictions);
    
    // Generate image
    const imageBuffer = await this.imageGenerator.generateLeaguePositionPrediction(
        this.leagueConfigs[selectedLeagueKey].name,
        predictions,
        leagueStats
    );
    
    const filename = path.join(this.tempImageDir, `league_positions_${selectedLeagueKey}_${Date.now()}.png`);
    fs.writeFileSync(filename, imageBuffer);
    
    this.log(`✅ League position prediction image generated: ${filename}`);
    return filename;
}


calculateSeasonProjection(team, teamData) {
    const avgXG = teamData.reduce((sum, match) => sum + (match.xG || 0), 0) / teamData.length;
    const avgXGA = teamData.reduce((sum, match) => sum + (match.xGA || 0), 0) / teamData.length;
    const currentPPG = teamData.reduce((sum, match) => sum + (match.pts || 0), 0) / teamData.length;
    const projectedPoints = currentPPG * 38;
    const projectedGoals = avgXG * 38;
    const projectedGA = avgXGA * 38;
    const xGDiff = avgXG - avgXGA;

    let expectedPosition = '10th-15th';
    let outlook = 'Mid-table finish expected';
    let clProbability = 0;
    let elProbability = 0;
    let relegationProbability = 0;

    if (projectedPoints > 75) {
        expectedPosition = 'Top 4';
        outlook = 'Champions League qualification likely';
        clProbability = 85;
        elProbability = 10;
    } else if (projectedPoints > 65) {
        expectedPosition = '5th-7th';
        outlook = 'Europa League contention';
        clProbability = 25;
        elProbability = 60;
    } else if (projectedPoints < 35) {
        expectedPosition = 'Bottom 3';
        outlook = 'Relegation battle';
        relegationProbability = 70;
    } else if (projectedPoints < 45) {
        expectedPosition = '15th-18th';
        outlook = 'Lower table, safety concerns';
        relegationProbability = 25;
    } else {
        elProbability = 15;
        relegationProbability = 5;
    }

    return {
        currentPPG,
        avgXG,
        avgXGA,
        xGDiff,
        projectedPoints,
        projectedGoals,
        projectedGA,
        expectedPosition,
        outlook,
        clProbability,
        elProbability,
        relegationProbability
    };
}

calculateGoalModel(team, teamData) {
    const avgXG = teamData.reduce((sum, match) => sum + (match.xG || 0), 0) / teamData.length;
    const avgGoals = teamData.reduce((sum, match) => sum + (match.scored || 0), 0) / teamData.length;
    const avgXGA = teamData.reduce((sum, match) => sum + (match.xGA || 0), 0) / teamData.length;

    const homeData = teamData.filter(match => match.h_a === 'h');
    const awayData = teamData.filter(match => match.h_a === 'a');

    const homeGoals = homeData.length > 0 ?
        homeData.reduce((sum, match) => sum + (match.xG || 0), 0) / homeData.length : avgXG * 1.1;
    const awayGoals = awayData.length > 0 ?
        awayData.reduce((sum, match) => sum + (match.xG || 0), 0) / awayData.length : avgXG * 0.9;

    const efficiency = avgGoals > 0 ? (avgGoals / avgXG) * 100 : 100;
    const scoringProb = Math.min(95, avgXG * 45);
    const cleanSheetProb = Math.max(5, (2 - avgXGA) * 30);
    const mostLikelyScore = `${Math.round(avgXG)}-${Math.round(avgXGA)}`;
    const highScoringProb = Math.min(75, avgXG * 25);
    
    const goalVariance = teamData.reduce((sum, match) => 
        sum + Math.pow((match.scored || 0) - avgGoals, 2), 0) / teamData.length;
    const consistency = goalVariance < 1 ? 'Very Consistent' : goalVariance < 2 ? 'Consistent' : 'Inconsistent';

    let bestPeriod = 'First Half';
    if (avgXG > 1.5) bestPeriod = 'Second Half';
    if (avgXG > 2.0) bestPeriod = 'Both Halves';

    return {
        homeGoals,
        awayGoals,
        avgGoals,
        efficiency,
        scoringProb,
        cleanSheetProb,
        mostLikelyScore,
        highScoringProb,
        consistency,
        bestPeriod
    };
}

analyzeForm(team, teamData) {
    const recentMatches = teamData.slice(-5);
    const recentPoints = recentMatches.reduce((sum, match) => sum + (match.pts || 0), 0);
    const recentPPG = recentPoints / recentMatches.length;
    const recentXG = recentMatches.reduce((sum, match) => sum + (match.xG || 0), 0) / recentMatches.length;
    const recentXGA = recentMatches.reduce((sum, match) => sum + (match.xGA || 0), 0) / recentMatches.length;

    let formRating = '';
    let momentum = 0;

    if (recentPPG >= 2.5) {
        formRating = '🔥 Excellent';
        momentum = 9;
    } else if (recentPPG >= 2.0) {
        formRating = '🟢 Very Good';
        momentum = 7.5;
    } else if (recentPPG >= 1.5) {
        formRating = '🟡 Good';
        momentum = 6;
    } else if (recentPPG >= 1.0) {
        formRating = '🟠 Average';
        momentum = 4.5;
    } else {
        formRating = '🔴 Poor';
        momentum = 2;
    }

    const allPPG = teamData.reduce((sum, match) => sum + (match.pts || 0), 0) / teamData.length;
    const trend = recentPPG > allPPG + 0.3 ? '📈 Improving' :
        recentPPG < allPPG - 0.3 ? '📉 Declining' : '➡️ Stable';

    const insights = [];
    if (recentXG > 2.0) insights.push('Strong attacking form');
    if (recentXGA < 1.0) insights.push('Solid defensive shape');
    if (recentPPG > 2.0) insights.push('Excellent recent results');
    if (recentPoints === 15) insights.push('Perfect recent form (5 wins)');
    if (recentPoints === 0) insights.push('Crisis form (5 losses)');
    if (recentXG - recentXGA > 1.0) insights.push('Dominating performances');

    const consistency = recentMatches.every(match => (match.pts || 0) >= 1) ? 'Very Consistent' : 'Inconsistent';
    const pressureRating = momentum > 7 ? 'Excellent under pressure' : momentum < 4 ? 'Struggles under pressure' : 'Average under pressure';
    const nextMatchConfidence = momentum > 7 ? 'High' : momentum < 4 ? 'Low' : 'Medium';

    return {
        formRating,
        trend,
        momentum,
        recentXG,
        recentXGA,
        recentPPG,
        insights,
        consistency,
        pressureRating,
        nextMatchConfidence
    };
}

predictFinalTable(leagueKey, leagueData) {
    const teams = [...new Set(leagueData.map(match => match.title))].filter(team => team && team.trim() !== '');
    const predictions = teams.map(teamName => {
        const teamMatches = leagueData.filter(match => match.title === teamName);
        const stats = this.calculateSeasonProjection(teamName, teamMatches);
        return {
            name: teamName,
            projectedPoints: stats.projectedPoints,
            currentPPG: stats.currentPPG,
            xGDiff: stats.xGDiff,
            confidence: teamMatches.length > 15 ? 'High' : teamMatches.length > 8 ? 'Medium' : 'Low'
        };
    });
    return predictions.sort((a, b) => b.projectedPoints - a.projectedPoints);
}

calculateLeagueStats(predictions) {
    const topTeam = predictions[0];
    const secondTeam = predictions[1];
    const bottomTeam = predictions[predictions.length - 1];
    const secondBottomTeam = predictions[predictions.length - 2];

    const titleGap = topTeam.projectedPoints - secondTeam.projectedPoints;
    const relegationGap = secondBottomTeam.projectedPoints - bottomTeam.projectedPoints;

    const titleRace = titleGap < 3 ? 'Very tight title race' : titleGap < 8 ? 'Competitive title race' : 'Clear title favorite';
    const relegationBattle = relegationGap < 5 ? 'Fierce relegation battle' : 'Clear relegation candidates';

    const avgPointsGap = predictions.reduce((sum, team, index) => {
        if (index === 0) return sum;
        return sum + (predictions[index - 1].projectedPoints - team.projectedPoints);
    }, 0) / (predictions.length - 1);

    return {
        titleRace,
        relegationBattle,
        avgPointsGap
    };
}


 // Clean up temp images (LAST METHOD in FootballDataExplorer class)
    cleanupTempImages(maxAge = 3600000) {
        try {
            const files = fs.readdirSync(this.tempImageDir);
            const now = Date.now();
            
            files.forEach(file => {
                const filePath = path.join(this.tempImageDir, file);
                const stats = fs.statSync(filePath);
                const age = now - stats.mtimeMs;
                
                if (age > maxAge) {
                    fs.unlinkSync(filePath);
                    console.log(`🗑️ Cleaned up old image: ${file}`);
                }
            });
        } catch (error) {
            console.error('Error cleaning up temp images:', error);
        }
    }
} // ← IMPORTANT: Close FootballDataExplorer class here



async function main() {
    const explorer = new FootballDataExplorer();
    
    console.log('🏆 Welcome to Football Data Explorer with Image Generation!');
    console.log('Loading default leagues...\n');
    
    await explorer.loadDefaultLeagues();
    
    let running = true;
    
    while (running) {
        explorer.showMenu();
        const choice = await explorer.question('\nEnter your choice: ');
        
        let imageFile = null;
        
        try {
            switch (choice) {
                case '1':
                    explorer.showTeams();
                    break;
                case '2':
                    imageFile = await explorer.analyzeTeam();
                    break;
                case '3':
                    imageFile = await explorer.compareTeams();
                    break;
                case '4':
                    imageFile = await explorer.showTopPerformers();
                    break;
                case '5':
                    console.log('Filter matches not implemented.');
                    break;
                case '6':
                    await explorer.compareLeagues();
                    break;
                case '7':
                    imageFile = await explorer.showMatchDetails();
                    break;
                case '8':
                    imageFile = await explorer.statisticsSummary();
                    break;
                case '9':
                    imageFile = await explorer.showFormTable();
                    break;
                case '10':
                    imageFile = await explorer.showPerformanceTrends();
                    break;
                case '11':
                    // Predictions submenu
                    imageFile = await explorer.showPredictions();
                    break;
                case '0':
                    running = false;
                    console.log('\n👋 Thanks for using Football Data Explorer!');
                    break;
                default:
                    console.log('❌ Invalid choice. Please try again.');
                    break;
            }
            
            if (imageFile) {
                console.log(`\n✅ Image saved: ${imageFile}`);
                console.log('You can now view or share this image.');
            }
            
        } catch (error) {
            console.error(`\n❌ Error: ${error.message}`);
        }
        
        if (running) {
            await explorer.question('\nPress Enter to continue...');
        }
    }
    
      // Cleanup and exit
    explorer.cleanupTempImages();
    explorer.rl.close();
    process.exit(0);
}

// Export for use in other modules (like WhatsApp bot)

// Run if executed directly

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}
