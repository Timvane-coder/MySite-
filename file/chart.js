import { createCanvas } from '@napi-rs/canvas';
import ExcelJS from 'exceljs';
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import * as math from 'mathjs';
import GIFEncoder from 'gifencoder';
import { PassThrough } from 'stream';











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



generateEDAReport() {
    // Ensure necessary calculations are done
    if (!this.statistics || Object.keys(this.statistics).length === 0) {
        this.calculateStatistics();
    }
    
    if (!this.robustStatistics || Object.keys(this.robustStatistics).length === 0) {
        this.calculateRobustStatistics();
    }
    
    // Fit distribution if not already done
    if (!this.distributionParams) {
        this.selectedDistribution = 'normal';
        this.fitDistribution();
    }
    
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

generateEDARecommendations() {
    const recommendations = [];
    
    // Data quality recommendations
    if (this.validationResults.dataQuality.score < 75) {
        recommendations.push({
            priority: 'High',
            category: 'Data Quality',
            message: 'Consider collecting more data or improving data quality',
            details: this.validationResults.warnings
        });
    }
    
    // Outlier recommendations
    if (this.robustStatistics.outlierDetection) {
        const outlierPct = parseFloat(this.robustStatistics.outlierDetection.outlierPercentage);
        if (outlierPct > 5) {
            recommendations.push({
                priority: 'Medium',
                category: 'Outliers',
                message: `${outlierPct}% outliers detected`,
                details: this.robustStatistics.outlierDetection.recommendation
            });
        }
    }
    
    // Distribution recommendations based on skewness
    if (Math.abs(this.statistics.skewness) > 1) {
        recommendations.push({
            priority: 'Medium',
            category: 'Distribution',
            message: 'High skewness detected - consider data transformation or non-normal distributions',
            details: `Skewness: ${this.statistics.skewness.toFixed(3)}`
        });
    }
    
    // Sample size recommendations
    if (this.statistics.n < 30) {
        recommendations.push({
            priority: 'Medium',
            category: 'Sample Size',
            message: 'Small sample size - use caution with parametric tests',
            details: `Current n=${this.statistics.n}, recommended n≥30 for reliable inference`
        });
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
}




// ============================================================================
// ADD THIS TO EnhancedSpreadsheetWorkbook CLASS
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

        // Statistical Workbook management
        this.statisticalWorkbook = null;
        this.statisticalAnalyses = [];

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

    // ==================== THEME COLORS ====================
    setThemeColors() {
        const themes = {
            professional: {
                background: '#ffffff',
                gridColor: '#e0e0e0',
                headerBg: '#2c3e50',
                headerText: '#ffffff',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#c0c0c0'
            },
            dark: {
                background: '#1e1e1e',
                gridColor: '#404040',
                headerBg: '#0d47a1',
                headerText: '#ffffff',
                cellBg: '#2d2d2d',
                cellText: '#ffffff',
                borderColor: '#505050'
            },
            light: {
                background: '#f5f5f5',
                gridColor: '#d0d0d0',
                headerBg: '#4caf50',
                headerText: '#ffffff',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#bdbdbd'
            }
        };
        this.colors = themes[this.theme] || themes.professional;
    }

    // ==================== STATISTICAL WORKBOOK INTEGRATION ====================

    /**
     * Initialize EnhancedStatisticalWorkbook instance
     */
    initializeStatisticalWorkbook(options = {}) {
        if (!this.statisticalWorkbook) {
            this.statisticalWorkbook = new EnhancedStatisticalWorkbook(options);
        }
        return this.statisticalWorkbook;
    }

    /**
     * Get statistical workbook instance
     */
    getStatisticalWorkbook() {
        if (!this.statisticalWorkbook) {
            this.initializeStatisticalWorkbook();
        }
        return this.statisticalWorkbook;
    }

    // ==================== DATA LOADING METHODS ====================

    /**
     * Load data from CSV for statistical analysis
     */
    loadStatisticalDataFromCSV(filePath) {
        const wb = this.getStatisticalWorkbook();
        wb.loadFromCSV(filePath);
        this.addToHistory(`Loaded statistical data from CSV: ${filePath}`);
        this.lastModified = new Date();
        return wb;
    }

    /**
     * Load data from JSON for statistical analysis
     */
    loadStatisticalDataFromJSON(filePath) {
        const wb = this.getStatisticalWorkbook();
        wb.loadFromJSON(filePath);
        this.addToHistory(`Loaded statistical data from JSON: ${filePath}`);
        this.lastModified = new Date();
        return wb;
    }

    /**
     * Load data from array for statistical analysis
     */
    loadStatisticalDataFromArray(data) {
        const wb = this.getStatisticalWorkbook();
        wb.loadFromArray(data);
        this.addToHistory(`Loaded statistical data from array (${data.length} samples)`);
        this.lastModified = new Date();
        return wb;
    }

    // ==================== EXPLORATORY DATA ANALYSIS ====================

    /**
     * Perform exploratory data analysis
     */
    /**
 * Perform exploratory data analysis
 */
performEDA() {
    const wb = this.getStatisticalWorkbook();
    
    // Ensure data is loaded and validated
    if (!wb.rawSamples || wb.rawSamples.length === 0) {
        throw new Error('No data loaded. Call loadStatisticalDataFromArray() first.');
    }
    
    // Calculate basic statistics if not already done
    if (!wb.statistics || Object.keys(wb.statistics).length === 0) {
        wb.calculateStatistics();
    }
    
    // Calculate robust statistics if not already done
    if (!wb.robustStatistics || Object.keys(wb.robustStatistics).length === 0) {
        wb.calculateRobustStatistics();
    }
    
    // Fit a default distribution for visualization purposes
    if (!wb.distributionParams) {
        wb.selectedDistribution = 'normal';
        wb.fitDistribution();
    }
    
    const eda = wb.generateEDAReport();
    
    this.statisticalAnalyses.push({
        type: 'EDA',
        timestamp: new Date(),
        results: eda
    });
    
    this.addToHistory('Performed Exploratory Data Analysis');
    this.lastModified = new Date();
    
    return eda;
}

    /**
     * Get data quality assessment
     */
    getDataQualityAssessment() {
        const wb = this.getStatisticalWorkbook();
        return wb.validationResults.dataQuality;
    }

    /**
     * Get outlier detection results
     */
    getOutlierDetection() {
        const wb = this.getStatisticalWorkbook();
        return wb.robustStatistics.outlierDetection;
    }




    // ==================== DISTRIBUTION IDENTIFICATION ====================

    /**
     * Identify best-fit distribution family
     */
    identifyDistributionFamily(distributionList = null) {
        const wb = this.getStatisticalWorkbook();
        
        if (!distributionList) {
            // Test common distributions
            distributionList = ['normal', 'lognormal', 'exponential', 'gamma', 'beta', 'pareto'];
        }
        
        wb.compareDistributions(distributionList);
        
        this.statisticalAnalyses.push({
            type: 'DistributionIdentification',
            timestamp: new Date(),
            results: wb.comparisonResults
        });
        
        this.addToHistory(`Identified best-fit distribution: ${wb.comparisonResults.bestFit}`);
        this.lastModified = new Date();
        
        return wb.comparisonResults;
    }

    /**
     * Get suggested distributions based on data characteristics
     */
    suggestDistributions() {
        const wb = this.getStatisticalWorkbook();
        const stats = wb.statistics;
        const suggestions = [];

        // Based on skewness
        if (Math.abs(stats.skewness) < 0.5) {
            suggestions.push({ 
                distribution: 'normal', 
                reason: 'Low skewness suggests symmetric distribution'
            });
        } else if (stats.skewness > 1) {
            suggestions.push({ 
                distribution: 'lognormal', 
                reason: 'High positive skewness'
            });
            suggestions.push({ 
                distribution: 'gamma', 
                reason: 'Right-skewed data'
            });
        }

        // Based on data range
        if (stats.min >= 0 && stats.max <= 1) {
            suggestions.push({ 
                distribution: 'beta', 
                reason: 'Data bounded between 0 and 1'
            });
        }

        // Based on minimum value
        if (stats.min > 0) {
            suggestions.push({ 
                distribution: 'exponential', 
                reason: 'Positive data, possibly waiting times'
            });
        }

        return suggestions;
    }

 
    // ==================== MAIN STATISTICAL ANALYSIS METHOD ====================

    /**
     * Comprehensive distribution analysis (main entry point)
     * This is the primary method for complete statistical analysis
     */
    analyzeDistribution(config) {
        console.log("\n📊 Starting Comprehensive Distribution Analysis...\n");

        const wb = this.getStatisticalWorkbook();
        
        // Set progress callback if provided
        if (config.progressCallback) {
            wb.progressCallback = config.progressCallback;
        }

        wb.progressCallback({ stage: 'initialization', progress: 0 });
        
        // Configure analysis
        wb.sampleName = config.sampleName || "Sample Data";
        wb.variableName = config.variableName || "Value";
        wb.unitName = config.unitName || "units";
        wb.scenarioDescription = config.scenarioDescription || "";
        wb.rawSamples = [...config.samples];
        wb.selectedDistribution = config.distribution || 'normal';
        wb.distributionParams = config.distributionParams || null;
        wb.targetValue = config.targetValue || null;
        wb.targetAnalysisType = config.targetAnalysisType || null;

        console.log(`Sample Name: ${wb.sampleName}`);
        console.log(`Variable: ${wb.variableName} (${wb.unitName})`);
        console.log(`Sample Size: ${wb.rawSamples.length}`);
        console.log(`Distribution: ${wb.selectedDistribution}`);

        // Step 1: Validate data
        console.log("\nStep 1: Validating data...");
        wb.validationResults = wb.validateData();
        wb.progressCallback({ stage: 'validation', progress: 5 });
        console.log(`✅ Data Quality: ${wb.validationResults.dataQuality.score}/100 (${wb.validationResults.dataQuality.rating})`);
        
        if (wb.validationResults.issues.length > 0) {
            console.log("⚠️  Issues found:");
            wb.validationResults.issues.forEach(issue => console.log(`   - ${issue}`));
        }

        // Step 2: Calculate basic statistics
        console.log("\nStep 2: Calculating descriptive statistics...");
        wb.calculateStatistics();
        wb.progressCallback({ stage: 'statistics', progress: 15 });
        console.log(`✅ Mean: ${wb.statistics.mean.toFixed(4)}, SD: ${wb.statistics.standardDeviation.toFixed(4)}`);

        // Step 3: Fit distribution
        console.log(`\nStep 3: Fitting ${wb.selectedDistribution} distribution...`);
        wb.fitDistribution();
        wb.progressCallback({ stage: 'distribution', progress: 25 });
        console.log(`✅ Distribution fitted`);
        console.log(`   Log-Likelihood: ${wb.distributionAnalysis.logLikelihood.toFixed(4)}`);
        console.log(`   AIC: ${wb.distributionAnalysis.aic.toFixed(4)}`);
        console.log(`   BIC: ${wb.distributionAnalysis.bic.toFixed(4)}`);

        // Step 4: Calculate confidence intervals
        console.log("\nStep 4: Calculating confidence intervals...");
        wb.calculateDistributionConfidenceIntervals();
        wb.calculateParameterConfidenceIntervals();
        wb.progressCallback({ stage: 'confidence_intervals', progress: 35 });
        console.log(`✅ Confidence intervals calculated`);

        // Step 5: Perform goodness of fit tests
        console.log("\nStep 5: Performing goodness-of-fit tests...");
        wb.performGoodnessOfFitTests();
        wb.progressCallback({ stage: 'goodness_of_fit', progress: 45 });
        console.log(`✅ Goodness-of-fit tests completed`);
        console.log(`   K-S p-value: ${wb.goodnessOfFit.kolmogorovSmirnov.pValue.toFixed(4)}`);

        // Step 6: Robust statistics
        console.log("\nStep 6: Calculating robust statistics...");
        wb.calculateRobustStatistics();
        wb.progressCallback({ stage: 'robust_stats', progress: 55 });
        console.log(`✅ Robust statistics calculated`);
        if (wb.robustStatistics.outlierDetection) {
            console.log(`   Outliers: ${wb.robustStatistics.outlierDetection.outlierCount} (${wb.robustStatistics.outlierDetection.outlierPercentage})`);
        }

        // Step 7: Hypothesis testing if specified
        if (config.hypothesisTest) {
            console.log("\nStep 7: Performing hypothesis tests...");
            wb.performHypothesisTest(config.hypothesisTest);
            wb.progressCallback({ stage: 'hypothesis', progress: 65 });
            console.log(`✅ Hypothesis test completed`);
        } else {
            wb.progressCallback({ stage: 'hypothesis', progress: 65 });
        }

        // Step 8: Compare with other distributions if requested
        if (config.compareDistributions) {
            console.log("\nStep 8: Comparing distributions...");
            wb.compareDistributions(config.compareDistributions);
            wb.progressCallback({ stage: 'comparison', progress: 75 });
            console.log(`✅ Distribution comparison completed`);
            console.log(`   Best fit: ${wb.comparisonResults.bestFit}`);
        } else {
            wb.progressCallback({ stage: 'comparison', progress: 75 });
        }

        // Step 9: Target analysis if target value provided
        if (wb.targetValue !== null) {
            console.log("\nStep 9: Performing target analysis...");
            wb.calculateDistributionSpecificTargetAnalysis();
            wb.progressCallback({ stage: 'target_analysis', progress: 85 });
            console.log(`✅ Target analysis completed for value: ${wb.targetValue}`);
        } else {
            wb.progressCallback({ stage: 'target_analysis', progress: 85 });
        }

        // Step 10: Regression if specified
        if (config.regression) {
            console.log("\nStep 10: Performing regression analysis...");
            wb.performRegression(config.regression);
            wb.progressCallback({ stage: 'regression', progress: 90 });
            console.log(`✅ Regression analysis completed`);
        } else {
            wb.progressCallback({ stage: 'regression', progress: 90 });
        }

        // Step 11: Generate workbook
        console.log("\nStep 11: Generating statistical workbook...");
        wb.generateWorkbook();
        wb.progressCallback({ stage: 'complete', progress: 100 });
        console.log(`✅ Workbook generated`);

        // Track in spreadsheet history
        this.statisticalAnalyses.push({
            type: 'ComprehensiveDistributionAnalysis',
            timestamp: new Date(),
            distribution: wb.selectedDistribution,
            sampleSize: wb.rawSamples.length,
            results: {
                validation: wb.validationResults,
                statistics: wb.statistics,
                distribution: wb.distributionAnalysis,
                goodnessOfFit: wb.goodnessOfFit
            }
        });

        this.addToHistory(`Performed comprehensive distribution analysis on ${wb.sampleName}`);
        this.lastModified = new Date();

        console.log("\n✅ Comprehensive Distribution Analysis Complete!\n");

        return {
            workbook: wb.currentWorkbook,
            analysis: {
                sampleName: wb.sampleName,
                variableName: wb.variableName,
                distribution: wb.selectedDistribution,
                dataQuality: wb.validationResults.dataQuality,
                statistics: wb.statistics,
                distributionFit: wb.distributionAnalysis,
                goodnessOfFit: wb.goodnessOfFit,
                confidenceIntervals: wb.confidenceIntervals,
                parameterCI: wb.parameterConfidenceIntervals,
                robustStatistics: wb.robustStatistics,
                hypothesisTests: wb.hypothesisTests,
                comparisonResults: wb.comparisonResults,
                targetAnalysis: wb.targetAnalysis,
                regressionResults: wb.regressionResults
            }
        };
    }

    /**
     * Simplified version - analyze distribution with minimal configuration
     */
    quickDistributionAnalysis(samples, distribution = 'normal') {
        return this.analyzeDistribution({
            samples: samples,
            distribution: distribution,
            sampleName: 'Quick Analysis',
            variableName: 'Value',
            unitName: 'units'
        });
    }

    /**
     * Analyze distribution with automatic distribution selection
     */
    autoDistributionAnalysis(samples, config = {}) {
        console.log("\n🤖 Automatic Distribution Analysis...\n");

        // First, load data and suggest distributions
        this.loadStatisticalDataFromArray(samples);
        const suggestions = this.suggestDistributions();
        
        console.log("Suggested distributions:");
        suggestions.forEach(s => console.log(`  - ${s.distribution}: ${s.reason}`));

        // Test all suggested distributions
        const distributionsToTest = suggestions.map(s => s.distribution);
        
        // Perform comparison
        const comparison = this.identifyDistributionFamily(distributionsToTest);
        const bestDistribution = comparison.bestFit;

        console.log(`\nBest distribution identified: ${bestDistribution}`);

        // Now perform full analysis with the best distribution
        return this.analyzeDistribution({
            samples: samples,
            distribution: bestDistribution,
            compareDistributions: distributionsToTest,
            sampleName: config.sampleName || 'Auto Analysis',
            variableName: config.variableName || 'Value',
            unitName: config.unitName || 'units',
            ...config
        });
    }


   // ==================== FORMAL DISTRIBUTIONAL ASSUMPTION CHECKS ====================

    /**
     * Perform comprehensive goodness-of-fit tests
     */
    performGoodnessOfFitTests(distribution = null) {
        const wb = this.getStatisticalWorkbook();
        
        if (distribution) {
            wb.selectedDistribution = distribution;
            wb.fitDistribution();
        }
        
        wb.performGoodnessOfFitTests();
        
        this.statisticalAnalyses.push({
            type: 'GoodnessOfFit',
            timestamp: new Date(),
            distribution: wb.selectedDistribution,
            results: wb.goodnessOfFit
        });
        
        this.addToHistory(`Performed goodness-of-fit tests for ${wb.selectedDistribution} distribution`);
        this.lastModified = new Date();
        
        return wb.goodnessOfFit;
    }

    /**
     * Test normality (comprehensive)
     */
    testNormality() {
        const wb = this.getStatisticalWorkbook();
        wb.selectedDistribution = 'normal';
        wb.fitDistribution();
        wb.performGoodnessOfFitTests();
        
        const normalityTests = {
            shapiroWilk: wb.goodnessOfFit.shapiroWilk,
            kolmogorovSmirnov: wb.goodnessOfFit.kolmogorovSmirnov,
            andersonDarling: wb.goodnessOfFit.andersonDarling,
            skewness: wb.statistics.skewness,
            kurtosis: wb.statistics.kurtosis,
            conclusion: this._getNormalityConclusion(wb.goodnessOfFit, wb.statistics)
        };
        
        this.statisticalAnalyses.push({
            type: 'NormalityTest',
            timestamp: new Date(),
            results: normalityTests
        });
        
        this.addToHistory('Performed comprehensive normality tests');
        this.lastModified = new Date();
        
        return normalityTests;
    }

    _getNormalityConclusion(gof, stats) {
        const tests = [
            gof.shapiroWilk.pValue > 0.05,
            gof.kolmogorovSmirnov.pValue > 0.05,
            !gof.andersonDarling.reject['0.05'],
            Math.abs(stats.skewness) < 2,
            Math.abs(stats.kurtosis) < 7
        ];
        
        const passCount = tests.filter(t => t).length;
        
        if (passCount >= 4) return 'Strong evidence of normality';
        if (passCount >= 3) return 'Moderate evidence of normality';
        if (passCount >= 2) return 'Weak evidence of normality';
        return 'Data appears non-normal';
    }

    // ==================== VISUALIZATION GENERATION ====================

    /**
     * Generate all statistical visualizations
     */
    generateStatisticalVisualizations() {
        const wb = this.getStatisticalWorkbook();
        const visualizations = wb.generateAllVisualizations();
        
        this.statisticalAnalyses.push({
            type: 'Visualizations',
            timestamp: new Date(),
            count: Object.keys(visualizations).length
        });
        
        this.addToHistory(`Generated ${Object.keys(visualizations).length} statistical visualizations`);
        this.lastModified = new Date();
        
        return visualizations;
    }

    /**
     * Save all statistical visualizations
     */
    async saveStatisticalVisualizations(outputDir = './visualizations') {
        const wb = this.getStatisticalWorkbook();
        const savedFiles = await wb.saveAllVisualizations(outputDir);
        
        this.addToHistory(`Saved ${savedFiles.length} visualization files to ${outputDir}`);
        this.lastModified = new Date();
        
        return savedFiles;
    }

    /**
     * Generate specific visualization
     */
    generateSpecificVisualization(type) {
        const wb = this.getStatisticalWorkbook();
        let visualization;
        
        switch(type) {
            case 'histogram':
                visualization = wb.generateHistogramData();
                break;
            case 'boxplot':
                visualization = wb.generateBoxplotData();
                break;
            case 'qqplot':
                visualization = wb.generateQQPlotData();
                break;
            case 'densityplot':
                visualization = wb.generateDensityPlotData();
                break;
            case 'ppplot':
                visualization = wb.generatePPPlotData();
                break;
            default:
                throw new Error(`Unknown visualization type: ${type}`);
        }
        
        this.addToHistory(`Generated ${type} visualization`);
        this.lastModified = new Date();
        
        return visualization;
    }

    // ==================== PARAMETER ESTIMATION ====================

    /**
     * Estimate distribution parameters (Maximum Likelihood Estimation)
     */
    estimateParameters(distribution) {
        const wb = this.getStatisticalWorkbook();
        wb.selectedDistribution = distribution;
        wb.fitDistribution();
        
        this.statisticalAnalyses.push({
            type: 'ParameterEstimation',
            timestamp: new Date(),
            distribution: distribution,
            parameters: wb.distributionParams
        });
        
        this.addToHistory(`Estimated parameters for ${distribution} distribution`);
        this.lastModified = new Date();
        
        return {
            distribution: distribution,
            parameters: wb.distributionParams,
            logLikelihood: wb.distributionAnalysis.logLikelihood,
            aic: wb.distributionAnalysis.aic,
            bic: wb.distributionAnalysis.bic
        };
    }

    // ==================== POINT ESTIMATES ====================

    /**
     * Calculate point estimates (mean, median, mode)
     */
    calculatePointEstimates() {
        const wb = this.getStatisticalWorkbook();
        const stats = wb.statistics;
        
        const pointEstimates = {
            mean: {
                value: stats.mean,
                description: 'Arithmetic average',
                robustness: 'Sensitive to outliers'
            },
            median: {
                value: stats.median,
                description: '50th percentile',
                robustness: 'Robust to outliers'
            },
            trimmedMean: {
                value: wb.robustStatistics.trimmedMean.value,
                description: wb.robustStatistics.trimmedMean.interpretation,
                robustness: 'Moderately robust'
            },
            winsorizedMean: {
                value: wb.robustStatistics.winsorizedMean.value,
                description: wb.robustStatistics.winsorizedMean.interpretation,
                robustness: 'Moderately robust'
            }
        };
        
        this.statisticalAnalyses.push({
            type: 'PointEstimates',
            timestamp: new Date(),
            results: pointEstimates
        });
        
        this.addToHistory('Calculated point estimates');
        this.lastModified = new Date();
        
        return pointEstimates;
    }

    // ==================== STANDARD ERROR CALCULATION ====================

    /**
     * Calculate standard errors
     */
    calculateStandardErrors() {
        const wb = this.getStatisticalWorkbook();
        const stats = wb.statistics;
        
        const standardErrors = {
            mean: {
                value: stats.standardError,
                formula: 'σ / √n',
                interpretation: 'Standard deviation of the sample mean'
            },
            proportion: stats.mean >= 0 && stats.mean <= 1 ? {
                value: Math.sqrt(stats.mean * (1 - stats.mean) / stats.n),
                formula: '√[p(1-p)/n]',
                interpretation: 'Standard error of proportion'
            } : null,
            median: {
                value: 1.253 * stats.standardDeviation / Math.sqrt(stats.n),
                formula: '1.253σ / √n',
                interpretation: 'Approximate standard error of median (for normal data)'
            }
        };
        
        this.statisticalAnalyses.push({
            type: 'StandardErrors',
            timestamp: new Date(),
            results: standardErrors
        });
        
        this.addToHistory('Calculated standard errors');
        this.lastModified = new Date();
        
        return standardErrors;
    }

    // ==================== CONFIDENCE INTERVALS ====================

    /**
     * Calculate confidence intervals for parameters
     */
    calculateConfidenceIntervals(confidenceLevel = 0.95) {
        const wb = this.getStatisticalWorkbook();
        
        // Mean confidence interval
        const meanCI = wb.calculateMeanConfidenceInterval(confidenceLevel);
        
        // Distribution parameter confidence intervals
        wb.calculateParameterConfidenceIntervals();
        const paramCI = wb.parameterConfidenceIntervals[confidenceLevel];
        
        // Distribution quantile confidence intervals
        const quantileCI = wb.confidenceIntervals[confidenceLevel];
        
        const allCIs = {
            mean: meanCI,
            parameters: paramCI,
            quantiles: quantileCI,
            confidenceLevel: confidenceLevel
        };
        
        this.statisticalAnalyses.push({
            type: 'ConfidenceIntervals',
            timestamp: new Date(),
            confidenceLevel: confidenceLevel,
            results: allCIs
        });
        
        this.addToHistory(`Calculated ${(confidenceLevel * 100)}% confidence intervals`);
        this.lastModified = new Date();
        
        return allCIs;
    }

    // ==================== HYPOTHESIS TESTING ====================

    /**
     * Perform hypothesis test
     */
    performHypothesisTest(testConfig) {
        const wb = this.getStatisticalWorkbook();
        wb.performHypothesisTest(testConfig);
        
        this.statisticalAnalyses.push({
            type: 'HypothesisTest',
            timestamp: new Date(),
            testType: testConfig.type,
            results: wb.hypothesisTests
        });
        
        this.addToHistory(`Performed ${testConfig.type} hypothesis test`);
        this.lastModified = new Date();
        
        return wb.hypothesisTests;
    }

    /**
     * One-sample t-test
     */
    oneSampleTTest(nullValue, alternative = 'two-sided', alpha = 0.05) {
        return this.performHypothesisTest({
            type: 'oneSample',
            nullValue: nullValue,
            alternative: alternative,
            alpha: alpha
        });
    }

    /**
     * Two-sample t-test
     */
    twoSampleTTest(sample2, equalVariance = true, alternative = 'two-sided', alpha = 0.05) {
        return this.performHypothesisTest({
            type: 'twoSample',
            sample2: sample2,
            equalVariance: equalVariance,
            alternative: alternative,
            alpha: alpha
        });
    }

    /**
     * Paired t-test
     */
    pairedTTest(sample2, alternative = 'two-sided', alpha = 0.05) {
        return this.performHypothesisTest({
            type: 'paired',
            sample2: sample2,
            alternative: alternative,
            alpha: alpha
        });
    }

    // ==================== CORRELATION ANALYSIS ====================

    /**
     * Calculate correlation matrix (if multiple variables in spreadsheet)
     */
    calculateCorrelationMatrix() {
        // Extract numeric columns from spreadsheet data
        const numericColumns = this._extractNumericColumns();
        
        if (numericColumns.length < 2) {
            throw new Error('Need at least 2 numeric columns for correlation analysis');
        }
        
        const correlationMatrix = [];
        const wb = this.getStatisticalWorkbook();
        
        for (let i = 0; i < numericColumns.length; i++) {
            correlationMatrix[i] = [];
            for (let j = 0; j < numericColumns.length; j++) {
                if (i === j) {
                    correlationMatrix[i][j] = 1.0;
                } else {
                    correlationMatrix[i][j] = wb.pearsonCorrelation(
                        numericColumns[i].data,
                        numericColumns[j].data
                    );
                }
            }
        }
        
        const result = {
            variables: numericColumns.map(col => col.name),
            correlationMatrix: correlationMatrix,
            interpretation: this._interpretCorrelations(correlationMatrix, numericColumns.map(col => col.name))
        };
        
        this.statisticalAnalyses.push({
            type: 'CorrelationMatrix',
            timestamp: new Date(),
            results: result
        });
        
        this.addToHistory('Calculated correlation matrix');
        this.lastModified = new Date();
        
        return result;
    }

    _extractNumericColumns() {
        const numericColumns = [];
        
        for (let col = 0; col < this.headers.length; col++) {
            const columnData = [];
            let isNumeric = true;
            
            for (let row = 0; row < this.data.length; row++) {
                const value = this.data[row][col];
                if (typeof value === 'number' && !isNaN(value)) {
                    columnData.push(value);
                } else if (value !== null && value !== undefined && value !== '') {
                    isNumeric = false;
                    break;
                }
            }
            
            if (isNumeric && columnData.length > 0) {
                numericColumns.push({
                    name: this.headers[col],
                    data: columnData
                });
            }
        }
        
        return numericColumns;
    }

    _interpretCorrelations(matrix, varNames) {
        const interpretations = [];
        
        for (let i = 0; i < matrix.length; i++) {
            for (let j = i + 1; j < matrix[i].length; j++) {
                const r = matrix[i][j];
                const absR = Math.abs(r);
                
                let strength;
                if (absR < 0.3) strength = 'weak';
                else if (absR < 0.7) strength = 'moderate';
                else strength = 'strong';
                
                const direction = r > 0 ? 'positive' : 'negative';
                
                interpretations.push({
                    var1: varNames[i],
                    var2: varNames[j],
                    correlation: r,
                    strength: strength,
                    direction: direction,
                    description: `${strength} ${direction} correlation (r = ${r.toFixed(3)})`
                });
            }
        }
        
        return interpretations;
    }

    // ==================== REGRESSION ANALYSIS ====================

    /**
     * Perform regression analysis
     */
    performRegression(config) {
        const wb = this.getStatisticalWorkbook();
        wb.performRegression(config);
        
        this.statisticalAnalyses.push({
            type: 'Regression',
            timestamp: new Date(),
            regressionType: config.type,
            results: wb.regressionResults
        });
        
        this.addToHistory(`Performed ${config.type} regression`);
        this.lastModified = new Date();
        
        return wb.regressionResults;
    }

    /**
     * Simple linear regression
     */
    linearRegression(x, y) {
        return this.performRegression({
            type: 'linear',
            predictors: x,
            response: y
        });
    }

    /**
     * Multiple regression
     */
    multipleRegression(X, y) {
        return this.performRegression({
            type: 'multiple',
            predictors: X,
            response: y
        });
    }

    /**
     * Polynomial regression
     */
    polynomialRegression(x, y, degree = 2) {
        return this.performRegression({
            type: 'polynomial',
            predictors: x,
            response: y,
            degree: degree
        });
    }

    /**
     * Logistic regression
     */
    logisticRegression(X, y) {
        return this.performRegression({
            type: 'logistic',
            predictors: X,
            response: y
        });
    }

    /**
     * Ridge regression
     */
    ridgeRegression(X, y, lambda = 1.0) {
        return this.performRegression({
            type: 'ridge',
            predictors: X,
            response: y,
            lambda: lambda
        });
    }

    /**
     * Lasso regression
     */
    lassoRegression(X, y, lambda = 1.0) {
        return this.performRegression({
            type: 'lasso',
            predictors: X,
            response: y,
            lambda: lambda
        });
    }

    // ==================== BAYESIAN INFERENCE ====================

    /**
     * Perform Bayesian inference
     */
    performBayesianInference(config) {
        const wb = this.getStatisticalWorkbook();
        const results = wb.performBayesianInference(config);
        
        this.statisticalAnalyses.push({
            type: 'BayesianInference',
            timestamp: new Date(),
            priorDistribution: config.priorDistribution,
            results: results
        });
        
        this.addToHistory('Performed Bayesian inference analysis');
        this.lastModified = new Date();
        
        return results;
    }

    // ==================== POWER ANALYSIS ====================

    /**
     * Calculate power analysis
     */
    calculatePowerAnalysis(config) {
        const wb = this.getStatisticalWorkbook();
        const results = wb.calculatePowerAnalysis(config);
        
        this.statisticalAnalyses.push({
            type: 'PowerAnalysis',
            timestamp: new Date(),
            config: config,
            results: results
        });
        
        this.addToHistory('Performed power analysis');
        this.lastModified = new Date();
        
        return results;
    }

    // ==================== META-ANALYSIS ====================

    /**
     * Perform meta-analysis
     */
    performMetaAnalysis(studies) {
        const wb = this.getStatisticalWorkbook();
        const results = wb.performMetaAnalysis(studies);
        
        this.statisticalAnalyses.push({
            type: 'MetaAnalysis',
            timestamp: new Date(),
            studyCount: studies.length,
            results: results
        });
        
        this.addToHistory(`Performed meta-analysis on ${studies.length} studies`);
        this.lastModified = new Date();
        
        return results;
    }

    // ==================== TIME SERIES ANALYSIS ====================

    /**
     * Perform time series analysis
     */
    performTimeSeriesAnalysis(timeData, config = {}) {
        const wb = this.getStatisticalWorkbook();
        const results = wb.performTimeSeriesAnalysis(timeData, config);
        
        this.statisticalAnalyses.push({
            type: 'TimeSeriesAnalysis',
            timestamp: new Date(),
            dataPoints: timeData.length,
            results: results
        });
        
        this.addToHistory('Performed time series analysis');
        this.lastModified = new Date();
        
        return results;
    }

    // ==================== ANOVA ====================

    /**
     * Perform ANOVA
     */
    performANOVA(groups) {
        const wb = this.getStatisticalWorkbook();
        const results = wb.performANOVA(groups);
        
        this.statisticalAnalyses.push({
            type: 'ANOVA',
            timestamp: new Date(),
            groupCount: groups.length,
            results: results
        });
        
        this.addToHistory(`Performed ANOVA on ${groups.length} groups`);
        this.lastModified = new Date();
        
        return results;
    }

    // ==================== STATISTICAL REPORTS ====================

    /**
     * Generate comprehensive statistical report
     */
    generateStatisticalReport() {
        const wb = this.getStatisticalWorkbook();
        
        // Ensure all analyses are complete
        if (!wb.statistics || Object.keys(wb.statistics).length === 0) {
            throw new Error('No statistical data loaded. Load data first.');
        }
        
        const report = {
            metadata: {
                generatedAt: new Date(),
                sampleName: wb.sampleName,
                sampleSize: wb.statistics.n,
                author: this.author
            },
            dataQuality: wb.validationResults,
            descriptiveStatistics: wb.statistics,
            robustStatistics: wb.robustStatistics,
            distributionAnalysis: wb.distributionAnalysis,
            goodnessOfFit: wb.goodnessOfFit,
            confidenceIntervals: wb.confidenceIntervals,
            parameterConfidenceIntervals: wb.parameterConfidenceIntervals,
            hypothesisTests: wb.hypothesisTests,
            regressionResults: wb.regressionResults,
            bayesianAnalysis: wb.bayesianAnalysis,
            powerAnalysis: wb.powerAnalysis,
            metaAnalysis: wb.metaAnalysis,
            timeSeriesAnalysis: wb.timeSeriesAnalysis,
            visualizations: wb.visualizations,
            recommendations: this._generateRecommendations(wb)
        };
        
        this.statisticalAnalyses.push({
            type: 'ComprehensiveReport',
            timestamp: new Date(),
            report: report
        });
        
        this.addToHistory('Generated comprehensive statistical report');
        this.lastModified = new Date();
        
        return report;
    }

    _generateRecommendations(wb) {
        const recommendations = [];
        
        // Data quality recommendations
        if (wb.validationResults.dataQuality.score < 75) {
            recommendations.push({
                category: 'Data Quality',
                priority: 'High',
                message: 'Consider collecting more data or investigating data quality issues',
                details: wb.validationResults.warnings
            });
        }
        
        // Distribution recommendations
        if (wb.goodnessOfFit && wb.goodnessOfFit.kolmogorovSmirnov) {
            if (wb.goodnessOfFit.kolmogorovSmirnov.reject['0.05']) {
                recommendations.push({
                    category: 'Distribution Fit',
                    priority: 'Medium',
                    message: `Current ${wb.selectedDistribution} distribution may not fit well`,
                    details: 'Consider alternative distributions'
                });
            }
        }
        
        // Outlier recommendations
        if (wb.robustStatistics.outlierDetection) {
            const outlierPct = parseFloat(wb.robustStatistics.outlierDetection.outlierPercentage);
            if (outlierPct > 5) {
                recommendations.push({
                    category: 'Outliers',
                    priority: 'Medium',
                    message: `${outlierPct}% outliers detected`,
                    details: wb.robustStatistics.outlierDetection.recommendation
                });
            }
        }
        
        return recommendations;
    }


    /**
     * Get analysis summary
     */
    getAnalysisSummary() {
        return {
            totalAnalyses: this.statisticalAnalyses.length,
            analysesByType: this._groupAnalysesByType(),
            latestAnalysis: this.statisticalAnalyses[this.statisticalAnalyses.length - 1],
            dataLoaded: this.statisticalWorkbook ? this.statisticalWorkbook.rawSamples.length > 0 : false
        };
    }

    _groupAnalysesByType() {
        const grouped = {};
        this.statisticalAnalyses.forEach(analysis => {
            if (!grouped[analysis.type]) {
                grouped[analysis.type] = [];
            }
            grouped[analysis.type].push(analysis);
        });
        return grouped;
    }

    // ==================== GRAPHING CALCULATOR INTEGRATION ====================
    // (Keep all existing graphing calculator methods unchanged)

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
     * Add matrix
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

        // Statistical analyses
        if (this.statisticalAnalyses.length > 0) {
            console.log("\n📈 Statistical Analyses:");
            this.statisticalAnalyses.forEach((analysis, index) => {
                console.log(`  ${index + 1}. ${analysis.type} - ${analysis.timestamp.toLocaleString()}`);
            });
        }

        // Graphing calculator history
        if (this.graphingCalculator) {
            const calc = this.graphingCalculator;
            
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
        }

        if (this.getTotalItems() === 0) {
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
        if (!this.graphingCalculator) return 0;
        const calc = this.graphingCalculator;
        return calc.getTotalItemCount();
    }

    /**
     * Get total items (spreadsheet + graphing + statistical)
     */
    getTotalItems() {
        return this.history.length + 
               this.getTotalGraphingItems() + 
               this.statisticalAnalyses.length;
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
        const statWb = this.statisticalWorkbook;
        
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
            statisticalAnalysis: statWb ? {
                samplesLoaded: statWb.rawSamples.length,
                distribution: statWb.selectedDistribution,
                analysesPerformed: this.statisticalAnalyses.length,
                visualizationsGenerated: statWb.visualizations ? Object.keys(statWb.visualizations).length : 0
            } : {
                samplesLoaded: 0,
                distribution: null,
                analysesPerformed: 0,
                visualizationsGenerated: 0
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
                statisticalAnalyses: this.statisticalAnalyses.length,
                totalActions: this.history.length + this.statisticalAnalyses.length
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

        console.log("\n📊 STATISTICAL ANALYSIS:");
        console.log(`  Samples Loaded: ${status.statisticalAnalysis.samplesLoaded}`);
        console.log(`  Distribution: ${status.statisticalAnalysis.distribution || 'None'}`);
        console.log(`  Analyses Performed: ${status.statisticalAnalysis.analysesPerformed}`);
        console.log(`  Visualizations Generated: ${status.statisticalAnalysis.visualizationsGenerated}`);

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
        console.log(`  Spreadsheet: ${status.history.spreadsheetActions}`);
        console.log(`  Statistical: ${status.history.statisticalAnalyses}`);

        console.log("\n=".repeat(70));
    }



    // ==================== UTILITY METHODS ====================

    /**
     * Add to history
     */
    addToHistory(action) {
        this.history.push({
            action: action,
            timestamp: new Date()
        });
    }

    /**
     * Clear all data
     */
    clearAll() {
        this.data = [];
        this.headers = [];
        this.formulas = {};
        this.calculations = {};
        this.charts = [];
        this.anatomicalDiagrams = [];
        this.crossSectionDiagrams = [];
        this.stereochemistryDiagrams = [];
        this.statisticalAnalyses = [];
        
        if (this.graphingCalculator) {
            this.graphingCalculator.clearAll();
        }
        
        if (this.statisticalWorkbook) {
            this.statisticalWorkbook = null;
        }
        
        this.addToHistory('Cleared all workbook data');
        this.lastModified = new Date();
        
        }

         /**
     * Export complete workbook (synchronous JSON only)
     */
    exportCompleteWorkbook(filename = null) {
        if (!filename) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            filename = `complete_workbook_${timestamp}.json`;
        }

        const completeData = {
            metadata: {
                name: this.sheetName,
                created: this.createdDate,
                lastModified: this.lastModified,
                author: this.author,
                version: '2.0.0'
            },
            spreadsheet: {
                headers: this.headers,
                data: this.data,
                formulas: this.formulas,
                calculations: this.calculations
            },
            charts: this.charts,
            diagrams: {
                anatomical: this.anatomicalDiagrams,
                crossSection: this.crossSectionDiagrams,
                stereochemistry: this.stereochemistryDiagrams
            },
            statisticalAnalyses: this.statisticalAnalyses,
            graphingCalculator: this.graphingCalculator ? {
                equationHistory: this.graphingCalculator.equationHistory,
                triangleHistory: this.graphingCalculator.triangleHistory,
                circleHistory: this.graphingCalculator.circleHistory,
                rectangleHistory: this.graphingCalculator.rectangleHistory,
                squareHistory: this.graphingCalculator.squareHistory,
                parallelogramHistory: this.graphingCalculator.parallelogramHistory,
                polygonHistory: this.graphingCalculator.polygonHistory,
                ellipseHistory: this.graphingCalculator.ellipseHistory,
                quadrilateralHistory: this.graphingCalculator.quadrilateralHistory,
                trapezoidHistory: this.graphingCalculator.trapezoidHistory,
                sphereHistory: this.graphingCalculator.sphereHistory,
                cylinderHistory: this.graphingCalculator.cylinderHistory,
                coneHistory: this.graphingCalculator.coneHistory,
                cubeHistory: this.graphingCalculator.cubeHistory,
                vectorHistory: this.graphingCalculator.vectorHistory,
                matrixHistory: this.graphingCalculator.matrixHistory
            } : null,
            history: this.history
        };

        fs.writeFileSync(filename, JSON.stringify(completeData, null, 2));

        this.addToHistory(`Exported complete workbook to ${filename}`);
        console.log(`✅ Complete workbook exported to: ${filename}`);
        return filename;
    }

    /**
     * Import workbook from JSON file (synchronous only)
     */
    importWorkbook(filename) {
        const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
        
        this.sheetName = data.metadata.name;
        this.author = data.metadata.author;
        this.createdDate = new Date(data.metadata.created);
        this.lastModified = new Date(data.metadata.lastModified);
        
        this.headers = data.spreadsheet.headers;
        this.data = data.spreadsheet.data;
        this.formulas = data.spreadsheet.formulas;
        this.calculations = data.spreadsheet.calculations;
        
        this.charts = data.charts || [];
        this.anatomicalDiagrams = data.diagrams?.anatomical || [];
        this.crossSectionDiagrams = data.diagrams?.crossSection || [];
        this.stereochemistryDiagrams = data.diagrams?.stereochemistry || [];
        
        this.statisticalAnalyses = data.statisticalAnalyses || [];
        this.history = data.history || [];

        this.addToHistory(`Imported workbook from ${filename}`);
        console.log(`✅ Workbook imported from: ${filename}`);
    }

    // ==================== ADVANCED STATISTICAL WORKFLOWS ====================

    /**
     * Complete statistical workflow for distribution analysis
     */
    completeDistributionAnalysisWorkflow(data, config = {}) {
        console.log("\n📊 Starting Complete Distribution Analysis Workflow...\n");

        // Step 1: Load data
        console.log("Step 1: Loading data...");
        this.loadStatisticalDataFromArray(data);
        const wb = this.getStatisticalWorkbook();
        console.log(`✅ Loaded ${data.length} samples`);

        // Step 2: EDA
        console.log("\nStep 2: Exploratory Data Analysis...");
        const eda = this.performEDA();
        console.log(`✅ Data Quality Score: ${eda.dataQuality.score}/100 (${eda.dataQuality.rating})`);

        // Step 3: Suggest distributions
        console.log("\nStep 3: Suggesting distributions...");
        const suggestions = this.suggestDistributions();
        console.log(`✅ ${suggestions.length} distributions suggested`);
        suggestions.forEach(s => console.log(`  - ${s.distribution}: ${s.reason}`));

        // Step 4: Identify best-fit distribution
        console.log("\nStep 4: Identifying best-fit distribution...");
        const distributionList = config.distributionsToTest || 
            suggestions.map(s => s.distribution).concat(['normal', 'lognormal']);
        const comparison = this.identifyDistributionFamily([...new Set(distributionList)]);
        console.log(`✅ Best fit: ${comparison.bestFit}`);

        // Step 5: Fit selected distribution
        console.log(`\nStep 5: Fitting ${comparison.bestFit} distribution...`);
        const paramEstimates = this.estimateParameters(comparison.bestFit);
        console.log(`✅ Parameters estimated`);
        console.log(`  Log-Likelihood: ${paramEstimates.logLikelihood.toFixed(4)}`);
        console.log(`  AIC: ${paramEstimates.aic.toFixed(4)}`);
        console.log(`  BIC: ${paramEstimates.bic.toFixed(4)}`);

        // Step 6: Goodness of fit tests
        console.log("\nStep 6: Performing goodness-of-fit tests...");
        const gof = this.performGoodnessOfFitTests();
        console.log(`✅ Goodness-of-fit tests completed`);
        console.log(`  K-S p-value: ${gof.kolmogorovSmirnov.pValue.toFixed(4)}`);

        // Step 7: Calculate confidence intervals
        console.log("\nStep 7: Calculating confidence intervals...");
        const ci = this.calculateConfidenceIntervals(0.95);
        console.log(`✅ 95% confidence intervals calculated`);

        // Step 8: Generate visualizations
        console.log("\nStep 8: Generating visualizations...");
        const visualizations = this.generateStatisticalVisualizations();
        console.log(`✅ ${Object.keys(visualizations).length} visualizations generated`);

        // Step 9: Save visualizations (synchronous)
        if (config.saveVisualizations !== false) {
            console.log("\nStep 9: Saving visualizations...");
            const outputDir = config.visualizationDir || './visualizations';
            const savedFiles = this.saveStatisticalVisualizationsSync(outputDir);
            console.log(`✅ Saved ${savedFiles.length} visualization files`);
        }

        // Step 10: Generate report
        console.log("\nStep 10: Generating comprehensive report...");
        const report = this.generateStatisticalReport();
        console.log(`✅ Report generated`);

        // Step 11: Export report (synchronous JSON only)
        if (config.exportReport !== false) {
            console.log("\nStep 11: Exporting report...");
            const reportFile = this.exportStatisticalReportSync(
                config.reportFilename
            );
            console.log(`✅ Report exported to: ${reportFile}`);
        }

        console.log("\n✅ Complete Distribution Analysis Workflow finished successfully!\n");

        return {
            dataQuality: eda.dataQuality,
            bestDistribution: comparison.bestFit,
            parameterEstimates: paramEstimates,
            goodnessOfFit: gof,
            confidenceIntervals: ci,
            visualizations: visualizations,
            report: report
        };
    }

    /**
     * Save statistical visualizations (synchronous version)
     */
    saveStatisticalVisualizationsSync(outputDir = './visualizations') {
        const wb = this.getStatisticalWorkbook();
        
        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Generate all visualizations if not already done
        if (!wb.visualizations) {
            wb.generateAllVisualizations();
        }
        
        const savedFiles = [];
        
        // Render and save each visualization
        for (const [name, data] of Object.entries(wb.visualizations)) {
            try {
                let canvas;
                const filename = path.join(outputDir, `${wb.sampleName}_${name}.png`);
                
                switch(name) {
                    case 'histogram':
                        canvas = wb.renderHistogram(data);
                        break;
                    case 'boxplot':
                        canvas = wb.renderBoxplot(data);
                        break;
                    case 'qqplot':
                        canvas = wb.renderQQPlot(data);
                        break;
                    case 'densityplot':
                        canvas = wb.renderDensityPlot(data);
                        break;
                    case 'ppplot':
                        canvas = wb.renderPPPlot(data);
                        break;
                    case 'acf':
                        canvas = wb.renderACFPlot(data);
                        break;
                    case 'pacf':
                        canvas = wb.renderPACFPlot(data);
                        break;
                    case 'timeseries':
                        canvas = wb.renderTimeSeriesPlot(data);
                        break;
                    default:
                        if (name.startsWith('residuals_')) {
                            canvas = wb.renderResidualPlots(data);
                        }
                }
                
                if (canvas) {
                    const buffer = canvas.toBuffer('image/png');
                    fs.writeFileSync(filename, buffer);
                    savedFiles.push(filename);
                    console.log(`  Saved: ${filename}`);
                }
            } catch (e) {
                console.error(`  Error saving ${name}:`, e.message);
            }
        }
        
        this.addToHistory(`Saved ${savedFiles.length} visualization files to ${outputDir}`);
        this.lastModified = new Date();
        
        return savedFiles;
    }

    /**
     * Export statistical report (synchronous JSON only)
     */
    exportStatisticalReportSync(filename = null) {
        const report = this.generateStatisticalReport();
        
        if (!filename) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            filename = `statistical_report_${timestamp}.json`;
        }
        
        fs.writeFileSync(filename, JSON.stringify(report, null, 2));
        
        this.addToHistory(`Exported statistical report to ${filename}`);
        this.lastModified = new Date();
        
        return filename;
    }

    /**
     * Complete data analysis workflow (synchronous)
     */
    completeDataAnalysisWorkflow(config) {
        console.log("\n🚀 Starting Complete Data Analysis Workflow...\n");

        // 1. Load spreadsheet data
        if (config.spreadsheetData) {
            console.log("Loading spreadsheet data...");
            this.headers = config.spreadsheetData.headers;
            this.data = config.spreadsheetData.data;
            console.log(`✅ Loaded ${this.data.length} rows, ${this.headers.length} columns`);
        }

        // 2. Perform statistical analysis on specified column
        if (config.statisticalColumn) {
            console.log(`\nPerforming statistical analysis on column: ${config.statisticalColumn}...`);
            const columnIndex = this.headers.indexOf(config.statisticalColumn);
            
            if (columnIndex === -1) {
                throw new Error(`Column ${config.statisticalColumn} not found`);
            }

            const columnData = this.data.map(row => row[columnIndex]).filter(val => 
                typeof val === 'number' && !isNaN(val)
            );

            const analysisResults = this.completeDistributionAnalysisWorkflow(
                columnData,
                config.statisticalConfig || {}
            );

            console.log("\n✅ Statistical analysis completed");

            return {
                spreadsheet: {
                    headers: this.headers,
                    rows: this.data.length
                },
                statistics: analysisResults
            };
        }

        // 3. Correlation analysis if multiple numeric columns
        const numericColumns = this._extractNumericColumns();
        if (numericColumns.length >= 2 && config.performCorrelation !== false) {
            console.log("\nPerforming correlation analysis...");
            const correlations = this.calculateCorrelationMatrix();
            console.log(`✅ Correlation matrix calculated for ${numericColumns.length} variables`);
        }

        console.log("\n✅ Complete Data Analysis Workflow finished!\n");
    }

       /**
     * Quick statistical summary
     */

    /**
 * Quick statistical summary
 */
quickStatisticalSummary(data) {
    // Load data
    this.loadStatisticalDataFromArray(data);
    const wb = this.getStatisticalWorkbook();
    
    // Perform necessary calculations
    wb.validateData();
    wb.calculateStatistics();
    wb.calculateRobustStatistics();

    return {
        sampleSize: wb.statistics.n,
        mean: wb.statistics.mean,
        median: wb.statistics.median,
        standardDeviation: wb.statistics.standardDeviation,
        min: wb.statistics.min,
        max: wb.statistics.max,
        range: wb.statistics.range,
        skewness: wb.statistics.skewness,
        kurtosis: wb.statistics.kurtosis,
        outliers: wb.robustStatistics.outlierDetection ? 
                  wb.robustStatistics.outlierDetection.outlierCount : 0,
        dataQuality: wb.validationResults && wb.validationResults.dataQuality ? 
                     wb.validationResults.dataQuality.rating : 'Unknown'
    };
}

    /**
     * Hypothesis testing workflow
     */
    performHypothesisTestingWorkflow(testType, config) {
        console.log(`\n🧪 Hypothesis Testing Workflow: ${testType}\n`);

        const wb = this.getStatisticalWorkbook();
        
        if (!wb || !wb.rawSamples || wb.rawSamples.length === 0) {
            throw new Error('No data loaded. Load data first using loadStatisticalDataFromArray()');
        }

        // Perform the test
        const results = this.performHypothesisTest({
            type: testType,
            ...config
        });

        // Display results
        console.log("Test Results:");
        console.log(`  Test Type: ${results[testType].testType}`);
        console.log(`  Test Statistic: ${results[testType].testStatistic.toFixed(4)}`);
        console.log(`  p-value: ${results[testType].pValue.toFixed(4)}`);
        console.log(`  Conclusion: ${results[testType].conclusion}`);

        return results;
    }

    /**
     * Regression workflow
     */
    performRegressionWorkflow(regressionType, X, y, config = {}) {
        console.log(`\n📈 Regression Analysis Workflow: ${regressionType}\n`);

        const results = this.performRegression({
            type: regressionType,
            predictors: X,
            response: y,
            ...config
        });

        const regResult = results[regressionType];

        // Display results
        console.log("Regression Results:");
        console.log(`  Type: ${regResult.type}`);
        if (regResult.modelFit) {
            console.log(`  R²: ${regResult.modelFit.rSquared.toFixed(4)}`);
            console.log(`  Adjusted R²: ${regResult.modelFit.adjustedRSquared.toFixed(4)}`);
            console.log(`  RMSE: ${regResult.modelFit.RMSE.toFixed(4)}`);
        }

        console.log("\nCoefficients:");
        regResult.coefficients.forEach(coef => {
            console.log(`  ${coef.name}: ${coef.value.toFixed(4)}`);
        });

        // Generate residual plots
        if (config.generatePlots !== false) {
            console.log("\nGenerating residual plots...");
            const wb = this.getStatisticalWorkbook();
            wb.generateResidualPlots(regressionType);
            console.log("✅ Residual plots generated");
        }

        return regResult;
    }

    // ==================== HELPER DISPLAY METHODS ====================

    /**
     * Display statistical summary
     */
    displayStatisticalSummary() {
        const wb = this.getStatisticalWorkbook();
        
        if (!wb || !wb.statistics) {
            console.log("❌ No statistical data loaded");
            return;
        }

        console.log("\n📊 STATISTICAL SUMMARY");
        console.log("=".repeat(70));
        console.log(`Sample Size: ${wb.statistics.n}`);
        console.log(`Mean: ${wb.statistics.mean.toFixed(4)}`);
        console.log(`Median: ${wb.statistics.median.toFixed(4)}`);
        console.log(`Standard Deviation: ${wb.statistics.standardDeviation.toFixed(4)}`);
        console.log(`Min: ${wb.statistics.min.toFixed(4)}`);
        console.log(`Max: ${wb.statistics.max.toFixed(4)}`);
        console.log(`Range: ${wb.statistics.range.toFixed(4)}`);
        console.log(`Skewness: ${wb.statistics.skewness.toFixed(4)}`);
        console.log(`Kurtosis: ${wb.statistics.kurtosis.toFixed(4)}`);
        
        if (wb.robustStatistics.outlierDetection) {
            console.log(`\nOutliers: ${wb.robustStatistics.outlierDetection.outlierCount} (${wb.robustStatistics.outlierDetection.outlierPercentage})`);
        }
        
        if (wb.validationResults) {
            console.log(`\nData Quality: ${wb.validationResults.dataQuality.score}/100 (${wb.validationResults.dataQuality.rating})`);
        }
        
        console.log("=".repeat(70));
    }

    /**
     * Display distribution analysis
     */
    displayDistributionAnalysis() {
        const wb = this.getStatisticalWorkbook();
        
        if (!wb || !wb.distributionAnalysis) {
            console.log("❌ No distribution analysis performed");
            return;
        }

        const da = wb.distributionAnalysis;

        console.log("\n📈 DISTRIBUTION ANALYSIS");
        console.log("=".repeat(70));
        console.log(`Distribution: ${da.name}`);
        
        console.log("\nParameters:");
        Object.entries(da.parameters).forEach(([param, value]) => {
            console.log(`  ${param}: ${value.toFixed(4)}`);
        });

        console.log("\nModel Fit:");
        console.log(`  Log-Likelihood: ${da.logLikelihood.toFixed(4)}`);
        console.log(`  AIC: ${da.aic.toFixed(4)}`);
        console.log(`  BIC: ${da.bic.toFixed(4)}`);

        if (wb.goodnessOfFit) {
            console.log("\nGoodness of Fit:");
            console.log(`  K-S Statistic: ${wb.goodnessOfFit.kolmogorovSmirnov.testStatistic.toFixed(4)}`);
            console.log(`  K-S p-value: ${wb.goodnessOfFit.kolmogorovSmirnov.pValue.toFixed(4)}`);
        }

        console.log("=".repeat(70));
    }

    /**
     * Display analysis summary
     */
    displayAnalysisSummary() {
        const summary = this.getAnalysisSummary();

        console.log("\n📊 ANALYSIS SUMMARY");
        console.log("=".repeat(70));
        console.log(`Total Analyses: ${summary.totalAnalyses}`);
        console.log(`Data Loaded: ${summary.dataLoaded ? 'Yes' : 'No'}`);

        if (summary.totalAnalyses > 0) {
            console.log("\nAnalyses by Type:");
            Object.entries(summary.analysesByType).forEach(([type, analyses]) => {
                console.log(`  ${type}: ${analyses.length}`);
            });

            if (summary.latestAnalysis) {
                console.log(`\nLatest Analysis:`);
                console.log(`  Type: ${summary.latestAnalysis.type}`);
                console.log(`  Timestamp: ${summary.latestAnalysis.timestamp.toLocaleString()}`);
            }
        }

        console.log("=".repeat(70));
    }

  

    // ==================== DIAGNOSTIC METHODS ====================

    /**
     * Check system health
     */
    checkSystemHealth() {
        const health = {
            spreadsheet: {
                status: 'OK',
                rows: this.data.length,
                columns: this.headers.length,
                issues: []
            },
            statistics: {
                status: 'OK',
                initialized: !!this.statisticalWorkbook,
                samplesLoaded: this.statisticalWorkbook ? this.statisticalWorkbook.rawSamples.length : 0,
                issues: []
            },
            graphingCalculator: {
                status: 'OK',
                initialized: !!this.graphingCalculator,
                itemCount: this.getTotalGraphingItems(),
                issues: []
            },
            overall: 'OK'
        };

        // Check for issues
        if (this.data.length === 0) {
            health.spreadsheet.issues.push('No spreadsheet data loaded');
        }

        if (this.statisticalWorkbook && this.statisticalWorkbook.validationResults) {
            if (!this.statisticalWorkbook.validationResults.isValid) {
                health.statistics.status = 'WARNING';
                health.statistics.issues = this.statisticalWorkbook.validationResults.issues;
            }
        }

        // Set overall status
        if (health.spreadsheet.issues.length > 0 || 
            health.statistics.issues.length > 0 || 
            health.graphingCalculator.issues.length > 0) {
            health.overall = 'WARNING';
        }

        return health;
    }

    /**
     * Display system health
     */
    displaySystemHealth() {
        const health = this.checkSystemHealth();

        console.log("\n🏥 SYSTEM HEALTH CHECK");
        console.log("=".repeat(70));
        console.log(`Overall Status: ${health.overall}`);

        console.log("\n📊 Spreadsheet:");
        console.log(`  Status: ${health.spreadsheet.status}`);
        console.log(`  Rows: ${health.spreadsheet.rows}`);
        console.log(`  Columns: ${health.spreadsheet.columns}`);
        if (health.spreadsheet.issues.length > 0) {
            console.log(`  Issues:`);
            health.spreadsheet.issues.forEach(issue => console.log(`    - ${issue}`));
        }

        console.log("\n📈 Statistics:");
        console.log(`  Status: ${health.statistics.status}`);
        console.log(`  Initialized: ${health.statistics.initialized}`);
        console.log(`  Samples: ${health.statistics.samplesLoaded}`);
        if (health.statistics.issues.length > 0) {
            console.log(`  Issues:`);
            health.statistics.issues.forEach(issue => console.log(`    - ${issue}`));
        }

        console.log("\n🧮 Graphing Calculator:");
        console.log(`  Status: ${health.graphingCalculator.status}`);
        console.log(`  Initialized: ${health.graphingCalculator.initialized}`);
        console.log(`  Items: ${health.graphingCalculator.itemCount}`);

        console.log("=".repeat(70));
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

export { 
    SpreadsheetFormulaRegistry,
    GraphingCalculator, 
    GraphingCalculatorGame,
    Theme, 
    ExcelChartsRegistry, 
    ChartCanvasRenderer, 
    AnatomicalDiagramsRegistry, 
    AnatomicalShapes,
    AnatomicalDiagramRenderer,
    StereochemistryDiagramsRegistry,
    StereochemistryDiagramRenderer,
    CrossSectionDiagramsRegistry,
    CrossSectionDiagramRenderer,
    CrossSectionShapes,
    AtomProperties,
    MolecularGeometry,
    EnhancedStatisticalWorkbook,
    StatisticalDistributions,
    DistributionRegistry
};

export default EnhancedSpreadsheetWorkbook;
