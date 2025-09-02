import { Theme } from "./types"; // Import Theme as a value
import { createCanvas, loadImage } from "@napi-rs/canvas";
import GIFEncoder from "gifencoder";
import path from "path";
import { PassThrough } from "stream";
import * as math from "mathjs";
// Class implementing a graphing calculator for plotting mathematical equations
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
            // Use a default color if none available
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
        cleaned = cleaned.replace(/\^/g, '**'); // Convert ^ to **
        cleaned = cleaned.replace(/ln/g, 'log'); // Convert ln to log
        cleaned = cleaned.replace(/π/g, 'pi'); // Convert π to pi
        cleaned = cleaned.replace(/∞/g, 'Infinity'); // Convert ∞ to Infinity
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
            // For non-GIF formats, plot up to the specified equation number or all equations
            const equationLimit = options?.equation !== undefined ? options.equation : this.equations.length;
            await this.drawGraph(ctx, equationLimit);
            return canvas.toBuffer(mime);
        }
        else {
            // For GIF, create an animation if showProgression is true, up to equation number
            return new Promise((resolve, reject) => {
                const encoder = new GIFEncoder(this.width, this.height);
                const passThrough = new PassThrough();
                const chunks = [];
                passThrough.on("data", chunk => chunks.push(chunk));
                passThrough.on("end", () => resolve(Buffer.concat(chunks)));
                passThrough.on(" error", reject);
                encoder.start();
                encoder.setRepeat(0);
                encoder.setDelay(options?.delay ?? 1000);
                encoder.createReadStream().pipe(passThrough);
                const createFrames = async () => {
                    const limit = options?.equation !== undefined ? Math.min(options.equation, this.equations.length) : this.equations.length;
                    const showProgression = options?.showProgression ?? true;
                    if (showProgression) {
                        // Create frames showing equations added one by one
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
                        // Single frame with all equations up to limit
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
export { GraphingCalculator, Theme };
//# sourceMappingURL=graph.js.map