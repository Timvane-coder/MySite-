import EnhancedSpreadsheetWorkbook, {
    SpreadsheetFormulaRegistry,
    ExcelChartsRegistry,
    AnatomicalDiagramsRegistry,
    CrossSectionDiagramsRegistry,
    StereochemistryDiagramsRegistry
} from './excel.js';
import readline from 'readline';

class InteractiveExcelSession {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.workbook = null;
        this.currentStep = 0;
        this.sessionData = {
            formulasApplied: [],
            chartsAdded: [],
            anatomicalDiagramsAdded: [],
            crossSectionDiagramsAdded: [],
            stereochemistryDiagramsAdded: [],
            exportFormats: []
        };
    }

    // Utility to ask questions
    question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    // Display formatted header
    displayHeader(title) {
        console.log('\n' + '='.repeat(80));
        console.log(title.toUpperCase().padStart(40 + title.length / 2));
        console.log('='.repeat(80) + '\n');
    }

    // Display section
    displaySection(title) {
        console.log('\n' + '-'.repeat(80));
        console.log(`  ${title}`);
        console.log('-'.repeat(80) + '\n');
    }

    // Welcome screen
    async welcome() {
        this.displayHeader('Excel Workbook Interactive Session');
        console.log('Welcome! This interactive tool will guide you through:');
        console.log('  ✓ Creating a workbook');
        console.log('  ✓ Loading your business data');
        console.log('  ✓ Applying powerful formulas');
        console.log('  ✓ Creating beautiful charts');
        console.log('  ✓ Creating anatomical diagrams');
        console.log('  ✓ Creating cross-section diagrams');
        console.log('  ✓ Creating stereochemistry (molecular) diagrams');
        console.log('  ✓ Generating comprehensive reports');
        console.log('  ✓ Exporting to PNG and Excel formats\n');

        await this.question('Press Enter to begin...');
    }

    // Step 1: Create Workbook
    async step1_CreateWorkbook() {
        this.currentStep = 1;
        this.displaySection('Step 1: Create Workbook Instance');

        console.log('Let\'s set up your workbook with custom metadata.\n');

        const sheetName = await this.question('Enter sheet name (default: "Sheet1"): ') || 'Sheet1';
        const author = await this.question('Enter author name (default: "User"): ') || 'User';

        console.log('\nAvailable themes:');
        console.log('  1. professional (default) - Clean white background');
        console.log('  2. dark - Dark mode theme');

        const themeChoice = await this.question('Choose theme (1 or 2, default: 1): ');
        const theme = themeChoice === '2' ? 'dark' : 'professional';

        this.workbook = new EnhancedSpreadsheetWorkbook({
            sheetName,
            author,
            theme
        });

        console.log('\n✓ Workbook created successfully!');
        console.log(`  Sheet Name: ${sheetName}`);
        console.log(`  Author: ${author}`);
        console.log(`  Theme: ${theme}`);

        await this.question('\nPress Enter to continue to data loading...');
    }

    // Step 2: Load Data
    async step2_LoadData() {
        this.currentStep = 2;
        this.displaySection('Step 2: Load Business Data');

        console.log('You can load data in three ways:\n');
        console.log('Option 1: Use sample sales data (recommended for first-time users)');
        console.log('Option 2: Enter custom data manually');
        console.log('Option 3: Paste multi-line data\n');

        const choice = await this.question('Choose option (1, 2, or 3): ');

        let data;

        if (choice === '1') {
            data = [
                ['Agent Name', 'Target Sales', 'Actual Sales', 'Achievement %', 'Commission Rate', 'Commission Earned', 'Status'],
                ['John M.', 50000, 55000, '', 0.05, '', ''],
                ['Sarah K.', 60000, 48000, '', 0.05, '', ''],
                ['Daniel P.', 40000, 42500, '', 0.04, '', ''],
                ['Grace L.', 70000, 80000, '', 0.06, '', ''],
                ['Alice N.', 55000, 50000, '', 0.05, '', ''],
                ['Mike T.', 65000, 72000, '', 0.05, '', ''],
                ['Emma R.', 45000, 46500, '', 0.04, '', '']
            ];
            console.log('\n✓ Sample sales data loaded');
        } else if (choice === '2') {
            data = await this.loadCustomData();
        } else if (choice === '3') {
            data = await this.loadPastedData();
        } else {
            console.log('Invalid choice. Loading sample data...');
            data = [
                ['Agent Name', 'Target Sales', 'Actual Sales', 'Achievement %', 'Commission Rate', 'Commission Earned', 'Status'],
                ['John M.', 50000, 55000, '', 0.05, '', ''],
                ['Sarah K.', 60000, 48000, '', 0.05, '', '']
            ];
        }

        this.workbook.loadData(data);

        console.log(`\n✓ Data loaded successfully!`);
        console.log(`  Rows: ${this.workbook.data.length}`);
        console.log(`  Columns: ${this.workbook.headers.length}`);
        this.displayDataPreview();

        await this.question('\nPress Enter to see available formulas...');
    }

    // Load custom data helper
    async loadCustomData() {
        console.log('\nData Entry Format Guide:');
        console.log('- First row: Column headers (comma-separated)');
        console.log('- Following rows: Data values (comma-separated)');
        console.log('- Example: Name,Sales,Target');
        console.log('          John,5000,4500\n');

        const headers = (await this.question('Enter column headers (comma-separated): ')).split(',').map(h => h.trim());
        const data = [headers];

        const numRows = parseInt(await this.question('How many data rows? ')) || 3;

        for (let i = 0; i < numRows; i++) {
            const row = (await this.question(`Row ${i + 1} data: `)).split(',').map(v => {
                const trimmed = v.trim();
                return isNaN(trimmed) ? trimmed : parseFloat(trimmed);
            });
            data.push(row);
        }

        return data;
    }

    // Load pasted data
    async loadPastedData() {
        console.log('\nPaste your data below (one row per line, comma-separated).');
        console.log('Type "END" on a new line when finished:\n');

        const data = [];
        while (true) {
            const line = await this.question('');
            if (line.toUpperCase() === 'END') break;

            const row = line.split(',').map(v => {
                const trimmed = v.trim();
                return isNaN(trimmed) ? trimmed : parseFloat(trimmed);
            });
            data.push(row);
        }

        return data;
    }

    // Display data preview
    displayDataPreview() {
        console.log('\n' + '='.repeat(80));
        console.log('DATA PREVIEW');
        console.log('='.repeat(80));

        console.log('\nSpreadsheet Data (first 5 rows):\n');
        const preview = [this.workbook.headers, ...this.workbook.data.slice(0, 5)];
        
        preview.forEach((row, rowIndex) => {
            const rowNum = rowIndex === 0 ? '1' : String(rowIndex + 1);
            const rowLabel = `Row ${rowNum}:`.padEnd(8);
            console.log(rowLabel + row.map(cell => String(cell).padEnd(15)).join(' | '));
        });

        if (this.workbook.data.length > 5) {
            console.log(`... (${this.workbook.data.length - 5} more rows)`);
        }

        console.log('\n' + '='.repeat(80) + '\n');
    }

    // Display quick reference
    displayQuickReference() {
        const numRows = this.workbook.data.length;
        const numCols = this.workbook.headers.length;
        const lastCol = this.workbook.columnToLetter(numCols - 1);

        console.log('\n' + '='.repeat(80));
        console.log('QUICK REFERENCE GUIDE');
        console.log('='.repeat(80));
        
        console.log(`\nDimensions: ${numRows} rows × ${numCols} columns`);
        console.log(`Last Column: ${lastCol} | Last Row: ${numRows + 1}`);
        
        console.log('\n📋 Named Columns:');
        this.workbook.headers.forEach((header, index) => {
            const colLetter = this.workbook.columnToLetter(index);
            const dataRange = `${colLetter}2:${colLetter}${numRows + 1}`;
            console.log(`  • ${header.padEnd(20)}: ${dataRange}`);
        });
        
        console.log('\n' + '='.repeat(80) + '\n');
    }

    // UPDATED: Step 3 - Show formulas
    async step3_ShowFormulas() {
        this.currentStep = 3;
        this.displaySection('Step 3 & 4: Available Formulas & Smart Suggestions');

        this.displayDataPreview();

        const actions = this.workbook.getAvailableActions();

        console.log('AVAILABLE FORMULA CATEGORIES:\n');
        Object.entries(actions).forEach(([category, formulas], index) => {
            console.log(`${index + 1}. ${category} (${Object.keys(formulas).length} formulas)`);
        });

        console.log('\n\nSMART SUGGESTIONS based on your data:\n');
        const suggestions = this.workbook.suggestFormulas('B2:B8');
        suggestions.slice(0, 5).forEach((suggestion, index) => {
            const formula = SpreadsheetFormulaRegistry.getFormula(suggestion.key);
            console.log(`${index + 1}. ${formula.name}`);
            console.log(`   Reason: ${suggestion.reason}`);
            console.log(`   Example: ${formula.example}\n`);
        });

        await this.question('Press Enter to start applying formulas...');
    }

    // Apply formula
    async configureAndApplyFormula(formulaKey) {
        const formula = SpreadsheetFormulaRegistry.getFormula(formulaKey);

        console.log(`\n\nConfiguring: ${formula.name}`);
        console.log(`Description: ${formula.description}`);
        console.log(`Excel Formula: ${formula.excelFormula}\n`);

        this.displayDataPreview();

        console.log('Where should the result go?');
        const targetCell = await this.question('Enter target cell (e.g., D2) or range (e.g., D2:D8): ');

        const params = [];
        console.log('\nEnter parameters:');

        for (let i = 0; i < formula.params.length; i++) {
            const paramName = formula.paramNames?.[i] || formula.params[i];
            const param = await this.question(`  ${paramName}: `);
            params.push(param);
        }

        try {
            if (targetCell.includes(':')) {
                const results = this.workbook.applyFormulaBatch(targetCell, formulaKey, params);
                console.log(`\n✓ Formula applied to ${results.length} cells`);
                results.slice(0, 3).forEach(result => {
                    if (!result.error) {
                        console.log(`  ${result.cell}: ${result.formatted}`);
                    }
                });
            } else {
                const result = this.workbook.applyFormula(targetCell, formulaKey, params);
                console.log(`\n✓ Formula applied successfully!`);
                console.log(`  Cell: ${result.cell}`);
                console.log(`  Formula: ${result.formula}`);
                console.log(`  Result: ${result.formatted}`);
            }

            this.sessionData.formulasApplied.push({
                formula: formula.name,
                target: targetCell,
                timestamp: new Date()
            });

            console.log('\n📊 Updated Data:');
            this.displayDataPreview();

        } catch (error) {
            console.log(`\n✗ Error: ${error.message}`);
        }

        await this.question('\nPress Enter to continue...');
    }

    // Step 5: Apply Formulas
    async step5_ApplyFormulas() {
        this.currentStep = 5;

        let continueApplying = true;

        while (continueApplying) {
            this.displaySection('Step 5: Apply Formulas to Your Data');

            this.displayDataPreview();

            console.log('What would you like to calculate?\n');
            console.log('Available formula categories:');

            const categories = SpreadsheetFormulaRegistry.getAllCategories();
            categories.forEach((cat, index) => {
                console.log(`  ${index + 1}. ${cat}`);
            });
            console.log('  0. See all formulas');
            console.log('  R. View data reference guide');
            console.log('  Q. Finish applying formulas\n');

            const choice = await this.question('Choose category (or Q to finish): ');

            if (choice.toUpperCase() === 'Q') {
                break;
            }

            if (choice.toUpperCase() === 'R') {
                this.displayQuickReference();
                await this.question('Press Enter to continue...');
                continue;
            }

            if (choice === '0') {
                await this.displayAllFormulas();
                continue;
            }

            const categoryIndex = parseInt(choice) - 1;
            if (categoryIndex >= 0 && categoryIndex < categories.length) {
                await this.applyFormulaFromCategory(categories[categoryIndex]);
            } else {
                console.log('Invalid choice. Please try again.');
            }
        }

        console.log(`\n✓ Applied ${this.sessionData.formulasApplied.length} formulas successfully!`);
        
        console.log('\n📊 Final Data State:');
        this.displayDataPreview();
        
        await this.question('Press Enter to continue to charts...');
    }

    // Display all formulas
    async displayAllFormulas() {
        console.log('\n' + '='.repeat(80));
        console.log('ALL AVAILABLE FORMULAS');
        console.log('='.repeat(80) + '\n');

        const categories = SpreadsheetFormulaRegistry.getAllCategories();

        categories.forEach(category => {
            console.log(`\n${category}:`);
            const formulas = SpreadsheetFormulaRegistry.getFormulasByCategory(category);

            Object.entries(formulas).forEach(([key, formula]) => {
                console.log(`  • ${formula.name} (${key})`);
                console.log(`    ${formula.description}`);
                console.log(`    Example: ${formula.example}`);
            });
        });

        await this.question('\nPress Enter to go back...');
    }

    // Apply formula from category
    async applyFormulaFromCategory(category) {
        console.log(`\n${category} Formulas:\n`);

        const formulas = SpreadsheetFormulaRegistry.getFormulasByCategory(category);
        const formulaKeys = Object.keys(formulas);

        formulaKeys.forEach((key, index) => {
            const formula = formulas[key];
            console.log(`${index + 1}. ${formula.name}`);
            console.log(`   ${formula.description}`);
            console.log(`   Example: ${formula.example}\n`);
        });

        const choice = await this.question('Choose formula (number) or B to go back: ');

        if (choice.toUpperCase() === 'B') return;

        const formulaIndex = parseInt(choice) - 1;
        if (formulaIndex >= 0 && formulaIndex < formulaKeys.length) {
            const formulaKey = formulaKeys[formulaIndex];
            await this.configureAndApplyFormula(formulaKey);
        }
    }

    // Step 6 - Create Charts
    async step6_CreateCharts() {
        this.currentStep = 6;
        this.displaySection('Step 6: Create Charts & Visualizations');

        let continueCharts = true;

        while (continueCharts) {
            console.log('Chart Options:\n');
            console.log('  1. View available charts');
            console.log('  2. Get chart suggestions');
            console.log('  3. Create a chart');
            console.log('  4. View existing charts');
            console.log('  5. Render all charts to PNG');
            console.log('  Q. Continue to anatomical diagrams\n');

            const choice = await this.question('Choose option: ');

            switch (choice) {
                case '1':
                    await this.displayAvailableCharts();
                    break;
                case '2':
                    await this.displayChartSuggestions();
                    break;
                case '3':
                    await this.createChartInteractive();
                    break;
                case '4':
                    await this.viewExistingCharts();
                    break;
                case '5':
                    await this.renderAllCharts();
                    break;
                case 'Q':
                case 'q':
                    continueCharts = false;
                    break;
                default:
                    console.log('Invalid choice.');
            }
        }

        console.log(`\n✓ Created ${this.sessionData.chartsAdded.length} charts`);
        await this.question('Press Enter to continue to anatomical diagrams...');
    }

    // Display available charts
    async displayAvailableCharts() {
        console.log('\n' + '='.repeat(80));
        console.log('AVAILABLE CHARTS BY CATEGORY');
        console.log('='.repeat(80) + '\n');

        const categories = ExcelChartsRegistry.getAllCategories();

        categories.forEach(category => {
            console.log(`\n${category}:`);
            const charts = ExcelChartsRegistry.getChartsByCategory(category);

            Object.entries(charts).forEach(([key, chart]) => {
                console.log(`  • ${chart.name} (${key})`);
                console.log(`    ${chart.description}`);
                if (chart.examples.length > 0) {
                    console.log(`    Example: ${chart.examples[0]}`);
                }
            });
        });

        await this.question('\nPress Enter to go back...');
    }

    // Display chart suggestions
    async displayChartSuggestions() {
        console.log('\nAnalyzing your data...\n');

        const suggestions = this.workbook.suggestCharts();

        if (suggestions.length === 0) {
            console.log('No chart suggestions available for your current data.');
        } else {
            console.log('Recommended Charts:\n');
            suggestions.forEach((suggestion, index) => {
                const chart = ExcelChartsRegistry.getChart(suggestion.key);
                console.log(`${index + 1}. ${chart.name} (${suggestion.key})`);
                console.log(`   ${suggestion.reason}`);
                console.log(`   ${chart.usage}\n`);
            });
        }

        await this.question('Press Enter to go back...');
    }

    // Create chart interactively
    async createChartInteractive() {
        console.log('\nChart Creation Wizard\n');
        console.log('Available chart categories:\n');

        const categories = ExcelChartsRegistry.getAllCategories();
        categories.forEach((cat, index) => {
            const chartsInCat = ExcelChartsRegistry.getChartsByCategory(cat);
            console.log(`${index + 1}. ${cat} (${Object.keys(chartsInCat).length} charts)`);
        });

        const categoryChoice = await this.question('\nSelect category: ');
        const categoryIndex = parseInt(categoryChoice) - 1;

        if (categoryIndex < 0 || categoryIndex >= categories.length) {
            console.log('Invalid choice.');
            return;
        }

        const category = categories[categoryIndex];
        const chartsInCategory = ExcelChartsRegistry.getChartsByCategory(category);
        const chartKeys = Object.keys(chartsInCategory);

        console.log(`\n${category} Charts:\n`);
        chartKeys.forEach((key, index) => {
            const chart = chartsInCategory[key];
            console.log(`${index + 1}. ${chart.name}`);
            console.log(`   ${chart.description}`);
        });

        const chartChoice = await this.question('\nSelect chart type: ');
        const chartIndex = parseInt(chartChoice) - 1;

        if (chartIndex < 0 || chartIndex >= chartKeys.length) {
            console.log('Invalid choice.');
            return;
        }

        const chartKey = chartKeys[chartIndex];
        const chartInfo = ExcelChartsRegistry.getChart(chartKey);

        console.log(`\n\nConfiguring: ${chartInfo.name}`);
        console.log(`${chartInfo.description}\n`);

        const title = await this.question('Enter chart title: ') || chartInfo.name;

        const chartData = await this.getChartDataInteractive(chartKey);

        if (!chartData) {
            console.log('Chart creation cancelled.');
            return;
        }

        const customizeOptions = await this.question('Customize chart options? (y/n, default: n): ');
        let options = {};

        if (customizeOptions.toLowerCase() === 'y') {
            const heightStr = await this.question('Chart height in pixels (default: 400): ');
            const widthStr = await this.question('Chart width in pixels (default: 600): ');

            if (heightStr) options.height = parseInt(heightStr);
            if (widthStr) options.width = parseInt(widthStr);
        }

        try {
            const chartObj = this.workbook.addChart({
                key: chartKey,
                title,
                data: chartData,
                options,
                filename: `chart_${chartKey}_${Date.now()}.png`
            });

            console.log(`\n✓ Chart created successfully!`);
            console.log(`  ID: ${chartObj.id}`);
            console.log(`  File: ${chartObj.filename}`);

            this.sessionData.chartsAdded.push({
                name: title,
                type: chartKey,
                timestamp: new Date()
            });

        } catch (error) {
            console.log(`\n✗ Error creating chart: ${error.message}`);
        }

        await this.question('\nPress Enter to continue...');
    }

    // Get chart data interactively
    async getChartDataInteractive(chartKey) {
        const chart = ExcelChartsRegistry.getChart(chartKey);
        const dataNeeded = chart.dataRequired;

        console.log(`\nData Required: ${dataNeeded.join(', ')}\n`);

        const chartData = {};

        for (const dataType of dataNeeded) {
            console.log(`Enter ${dataType} (comma-separated cell ranges or values):`);
            const input = await this.question(`${dataType}: `);

            if (!input) {
                console.log('Invalid input.');
                return null;
            }

            if (dataType === 'series') {
                const seriesRanges = input.split(',').map(r => r.trim());
                chartData[dataType] = seriesRanges.map(range => {
                    if (range.includes(':')) {
                        return this.workbook.getRangeValues(range);
                    } else {
                        return [parseFloat(range)];
                    }
                });
            }
            else if (dataType === 'categories' || dataType === 'labels' || dataType === 'stages') {
                if (input.includes(':')) {
                    const values = this.workbook.getRangeValues(input);
                    chartData[dataType] = values;
                } else {
                    chartData[dataType] = input.split(',').map(v => v.trim());
                }
            }
            else if (dataType === 'values' || dataType === 'xValues' || dataType === 'yValues' || dataType === 'sizes') {
                if (input.includes(':')) {
                    const values = this.workbook.getRangeValues(input);
                    chartData[dataType] = values.map(v => parseFloat(v));
                } else {
                    chartData[dataType] = input.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
                }
            }
        }

        return chartData;
    }

    // View existing charts
    async viewExistingCharts() {
        const charts = this.workbook.listCharts();

        if (charts.length === 0) {
            console.log('\nNo charts created yet.');
            return;
        }

        console.log('\n\nCharts in Workbook:\n');
        charts.forEach(chart => {
            console.log(`${chart.index + 1}. ${chart.name}`);
            console.log(`   Type: ${chart.type}`);
            console.log(`   File: ${chart.filename}`);
            console.log(`   Created: ${chart.created.toLocaleString()}\n`);
        });

        await this.question('Press Enter to go back...');
    }

    // Render all charts
    async renderAllCharts() {
        console.log('\nRendering all charts to PNG...\n');

        const results = this.workbook.renderAllCharts();

        results.forEach((result, index) => {
            if (result.error) {
                console.log(`${index + 1}. ✗ Error: ${result.error}`);
            } else {
                console.log(`${index + 1}. ✓ ${result.filename}`);
            }
        });

        console.log('\n✓ Chart rendering complete!');
        await this.question('Press Enter to continue...');
    }

    // Step 6.5 - Create Anatomical Diagrams
    async step6_5_CreateAnatomicalDiagrams() {
        this.currentStep = 6.5;
        this.displaySection('Step 6.5: Create Anatomical Diagrams');

        let continueDiagrams = true;

        while (continueDiagrams) {
            console.log('Anatomical Diagram Options:\n');
            console.log('  1. View available anatomical diagrams');
            console.log('  2. Get diagram suggestions');
            console.log('  3. Create an anatomical diagram');
            console.log('  4. View existing diagrams');
            console.log('  5. Render all diagrams to PNG');
            console.log('  Q. Continue to cross-section diagrams\n');

            const choice = await this.question('Choose option: ');

            switch (choice) {
                case '1':
                    await this.displayAvailableAnatomicalDiagrams();
                    break;
                case '2':
                    await this.displayAnatomicalDiagramSuggestions();
                    break;
                case '3':
                    await this.createAnatomicalDiagramInteractive();
                    break;
                case '4':
                    await this.viewExistingAnatomicalDiagrams();
                    break;
                case '5':
                    await this.renderAllAnatomicalDiagrams();
                    break;
                case 'Q':
                case 'q':
                    continueDiagrams = false;
                    break;
                default:
                    console.log('Invalid choice.');
            }
        }

        console.log(`\n✓ Created ${this.sessionData.anatomicalDiagramsAdded.length} anatomical diagrams`);
        await this.question('Press Enter to continue to cross-section diagrams...');
    }

    // Display available anatomical diagrams
    async displayAvailableAnatomicalDiagrams() {
        console.log('\n' + '='.repeat(80));
        console.log('AVAILABLE ANATOMICAL DIAGRAMS BY CATEGORY');
        console.log('='.repeat(80) + '\n');

        const categories = AnatomicalDiagramsRegistry.getAllCategories();

        categories.forEach(category => {
            console.log(`\n${category}:`);
            const diagrams = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);

            Object.entries(diagrams).forEach(([key, diagram]) => {
                console.log(`  • ${diagram.name} (${key})`);
                console.log(`    ${diagram.description}`);
                if (diagram.examples.length > 0) {
                    console.log(`    Example: ${diagram.examples[0]}`);
                }
            });
        });

        await this.question('\nPress Enter to go back...');
    }

    // Display anatomical diagram suggestions
    async displayAnatomicalDiagramSuggestions() {
        console.log('\nAnalyzing your data for anatomical context...\n');

        const suggestions = this.workbook.suggestAnatomicalDiagrams();

        if (suggestions.length === 0) {
            console.log('No specific anatomical diagram suggestions based on data.');
            console.log('However, you can still create any diagram from the library!\n');
            
            console.log('Popular choices:');
            console.log('  • Heart Anatomy - Cardiovascular education');
            console.log('  • Cell Structure - Basic biology');
            console.log('  • Blood Cells - Hematology reference');
        } else {
            console.log('Recommended Anatomical Diagrams:\n');
            suggestions.forEach((suggestion, index) => {
                const diagram = AnatomicalDiagramsRegistry.getDiagram(suggestion.key);
                console.log(`${index + 1}. ${diagram.name} (${suggestion.key})`);
                console.log(`   ${suggestion.reason}`);
                console.log(`   ${diagram.usage}\n`);
            });
        }

        await this.question('Press Enter to go back...');
    }

    // Create anatomical diagram interactively
    async createAnatomicalDiagramInteractive() {
        console.log('\nAnatomical Diagram Creation Wizard\n');
        console.log('Available diagram categories:\n');

        const categories = AnatomicalDiagramsRegistry.getAllCategories();
        categories.forEach((cat, index) => {
            const diagramsInCat = AnatomicalDiagramsRegistry.getDiagramsByCategory(cat);
            console.log(`${index + 1}. ${cat} (${Object.keys(diagramsInCat).length} diagrams)`);
        });

        const categoryChoice = await this.question('\nSelect category: ');
        const categoryIndex = parseInt(categoryChoice) -1;

        if (categoryIndex < 0 || categoryIndex >= categories.length) {
            console.log('Invalid choice.');
            return;
        }

        const category = categories[categoryIndex];
        const diagramsInCategory = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);
        const diagramKeys = Object.keys(diagramsInCategory);

        console.log(`\n${category} Diagrams:\n`);
        diagramKeys.forEach((key, index) => {
            const diagram = diagramsInCategory[key];
            console.log(`${index + 1}. ${diagram.name}`);
            console.log(`   ${diagram.description}`);
        });

        const diagramChoice = await this.question('\nSelect diagram type: ');
        const diagramIndex = parseInt(diagramChoice) - 1;

        if (diagramIndex < 0 || diagramIndex >= diagramKeys.length) {
            console.log('Invalid choice.');
            return;
        }

        const diagramKey = diagramKeys[diagramIndex];
        const diagramInfo = AnatomicalDiagramsRegistry.getDiagram(diagramKey);

        console.log(`\n\nConfiguring: ${diagramInfo.name}`);
        console.log(`${diagramInfo.description}\n`);

        const title = await this.question('Enter diagram title: ') || diagramInfo.name;

        let options = {};

        if (diagramKey === 'heartAnatomy') {
            console.log('\nAvailable chambers:');
            console.log('  1. wholeheart (default)');
            console.log('  2. rightAtrium');
            console.log('  3. rightVentricle');
            console.log('  4. leftAtrium');
            console.log('  5. leftVentricle');
            
            const chamberChoice = await this.question('Select chamber (1-5): ');
            const chambers = ['wholeheart', 'rightAtrium', 'rightVentricle', 'leftAtrium', 'leftVentricle'];
            const chamberIndex = parseInt(chamberChoice) - 1;
            
            if (chamberIndex >= 0 && chamberIndex < chambers.length) {
                options.chamber = chambers[chamberIndex];
            }

            const showLabels = await this.question('Show labels? (y/n, default: y): ');
            options.showLabels = showLabels.toLowerCase() !== 'n';

            const showBloodFlow = await this.question('Show blood flow? (y/n, default: y): ');
            options.showBloodFlow = showBloodFlow.toLowerCase() !== 'n';
        }

        if (['skull', 'femur', 'ribcage', 'spine'].includes(diagramKey)) {
            options.bone = diagramKey;
            
            const showLabels = await this.question('Show labels? (y/n, default: y): ');
            options.showLabels = showLabels.toLowerCase() !== 'n';
        }

        const customizeOptions = await this.question('Customize diagram size? (y/n, default: n): ');
        
        if (customizeOptions.toLowerCase() === 'y') {
            const heightStr = await this.question('Diagram height in pixels (default: 600-800): ');
            const widthStr = await this.question('Diagram width in pixels (default: 600-800): ');

            if (heightStr) options.height = parseInt(heightStr);
            if (widthStr) options.width = parseInt(widthStr);
        }

        try {
            const diagramObj = this.workbook.addAnatomicalDiagram({
                key: diagramKey,
                title,
                options,
                filename: `diagram_${diagramKey}_${Date.now()}.png`
            });

            console.log(`\n✓ Anatomical diagram created successfully!`);
            console.log(`  ID: ${diagramObj.id}`);
            console.log(`  Category: ${diagramObj.category}`);
            console.log(`  File: ${diagramObj.filename}`);

            this.sessionData.anatomicalDiagramsAdded.push({
                name: title,
                type: diagramKey,
                category: diagramObj.category,
                timestamp: new Date()
            });

        } catch (error) {
            console.log(`\n✗ Error creating anatomical diagram: ${error.message}`);
        }

        await this.question('\nPress Enter to continue...');
    }

    // View existing anatomical diagrams
    async viewExistingAnatomicalDiagrams() {
        const diagrams = this.workbook.listAnatomicalDiagrams();

        if (diagrams.length === 0) {
            console.log('\nNo anatomical diagrams created yet.');
            return;
        }

        console.log('\n\nAnatomical Diagrams in Workbook:\n');
        diagrams.forEach(diagram => {
            console.log(`${diagram.index + 1}. ${diagram.name}`);
            console.log(`   Type: ${diagram.type}`);
            console.log(`   Category: ${diagram.category}`);
            console.log(`   File: ${diagram.filename}`);
            console.log(`   Created: ${diagram.created.toLocaleString()}\n`);
        });

        await this.question('Press Enter to go back...');
    }

    // Render all anatomical diagrams
    async renderAllAnatomicalDiagrams() {
        console.log('\nRendering all anatomical diagrams to PNG...\n');

        const results = this.workbook.renderAllAnatomicalDiagrams();

        results.forEach((result, index) => {
            if (result.error) {
                console.log(`${index + 1}. ✗ Error: ${result.error}`);
            } else {
                console.log(`${index + 1}. ✓ ${result.filename} (${result.category})`);
            }
        });

        console.log('\n✓ Anatomical diagram rendering complete!');
        await this.question('Press Enter to continue...');
    }

    // Step 6.6 - Create Cross-Section Diagrams
    async step6_6_CreateCrossSectionDiagrams() {
        this.currentStep = 6.6;
        this.displaySection('Step 6.6: Create Cross-Section Diagrams');

        let continueDiagrams = true;

        while (continueDiagrams) {
            console.log('Cross-Section Diagram Options:\n');
            console.log('  1. View available cross-section diagrams');
            console.log('  2. Get diagram suggestions');
            console.log('  3. Create a cross-section diagram');
            console.log('  4. View existing diagrams');
            console.log('  5. Render all diagrams to PNG');
            console.log('  Q. Continue to stereochemistry diagrams\n');

            const choice = await this.question('Choose option: ');

            switch (choice) {
                case '1':
                    await this.displayAvailableCrossSectionDiagrams();
                    break;
                case '2':
                    await this.displayCrossSectionDiagramSuggestions();
                    break;
                case '3':
                    await this.createCrossSectionDiagramInteractive();
                    break;
                case '4':
                    await this.viewExistingCrossSectionDiagrams();
                    break;
                case '5':
                    await this.renderAllCrossSectionDiagrams();
                    break;
                case 'Q':
                case 'q':
                    continueDiagrams = false;
                    break;
                default:
                    console.log('Invalid choice.');
            }
        }

        console.log(`\n✓ Created ${this.sessionData.crossSectionDiagramsAdded.length} cross-section diagrams`);
        await this.question('Press Enter to continue to stereochemistry diagrams...');
    }

    // Display available cross-section diagrams
    async displayAvailableCrossSectionDiagrams() {
        console.log('\n' + '='.repeat(80));
        console.log('AVAILABLE CROSS-SECTION DIAGRAMS BY CATEGORY');
        console.log('='.repeat(80) + '\n');

        const categories = CrossSectionDiagramsRegistry.getAllCategories();

        categories.forEach(category => {
            console.log(`\n${category}:`);
            const diagrams = CrossSectionDiagramsRegistry.getDiagramsByCategory(category);

            Object.entries(diagrams).forEach(([key, diagram]) => {
                console.log(`  • ${diagram.name} (${key})`);
                console.log(`    ${diagram.description}`);
                if (diagram.examples && diagram.examples.length > 0) {
                    console.log(`    Example: ${diagram.examples[0]}`);
                }
            });
        });

        await this.question('\nPress Enter to go back...');
    }

    // Display cross-section diagram suggestions
    async displayCrossSectionDiagramSuggestions() {
        console.log('\nAnalyzing your data for cross-section diagram context...\n');

        const suggestions = this.workbook.suggestCrossSectionDiagrams();

        if (suggestions.length === 0) {
            console.log('No specific cross-section diagram suggestions based on data.');
            console.log('However, you can still create any diagram from the library!\n');
            
            console.log('Popular choices:');
            console.log('  • Dicot Leaf - Plant anatomy');
            console.log('  • Earth Cross-Section - Geology');
            console.log('  • Soil Profile - Environmental science');
        } else {
            console.log('Recommended Cross-Section Diagrams:\n');
            suggestions.forEach((suggestion, index) => {
                const diagram = CrossSectionDiagramsRegistry.getDiagram(suggestion.key);
                console.log(`${index + 1}. ${diagram.name} (${suggestion.key})`);
                console.log(`   ${suggestion.reason}`);
                console.log(`   ${diagram.usage}\n`);
            });
        }

        await this.question('Press Enter to go back...');
    }

    // Create cross-section diagram interactively
    async createCrossSectionDiagramInteractive() {
        console.log('\nCross-Section Diagram Creation Wizard\n');
        console.log('Available diagram categories:\n');

        const categories = CrossSectionDiagramsRegistry.getAllCategories();
        categories.forEach((cat, index) => {
            const diagramsInCat = CrossSectionDiagramsRegistry.getDiagramsByCategory(cat);
            console.log(`${index + 1}. ${cat} (${Object.keys(diagramsInCat).length} diagrams)`);
        });

        const categoryChoice = await this.question('\nSelect category: ');
        const categoryIndex = parseInt(categoryChoice) - 1;

        if (categoryIndex < 0 || categoryIndex >= categories.length) {
            console.log('Invalid choice.');
            return;
        }

        const category = categories[categoryIndex];
        const diagramsInCategory = CrossSectionDiagramsRegistry.getDiagramsByCategory(category);
        const diagramKeys = Object.keys(diagramsInCategory);

        console.log(`\n${category} Diagrams:\n`);
        diagramKeys.forEach((key, index) => {
            const diagram = diagramsInCategory[key];
            console.log(`${index + 1}. ${diagram.name}`);
            console.log(`   ${diagram.description}`);
        });

        const diagramChoice = await this.question('\nSelect diagram type: ');
        const diagramIndex = parseInt(diagramChoice) - 1;

        if (diagramIndex < 0 || diagramIndex >= diagramKeys.length) {
            console.log('Invalid choice.');
            return;
        }

        const diagramKey = diagramKeys[diagramIndex];
        const diagramInfo = CrossSectionDiagramsRegistry.getDiagram(diagramKey);

        console.log(`\n\nConfiguring: ${diagramInfo.name}`);
        console.log(`${diagramInfo.description}\n`);

        const title = await this.question('Enter diagram title: ') || diagramInfo.name;

        let options = {};

        const showLabels = await this.question('Show labels? (y/n, default: y): ');
        options.showLabels = showLabels.toLowerCase() !== 'n';

        const customizeOptions = await this.question('Customize diagram size? (y/n, default: n): ');
        
        if (customizeOptions.toLowerCase() === 'y') {
            const heightStr = await this.question('Diagram height in pixels (default: 600): ');
            const widthStr = await this.question('Diagram width in pixels (default: 800): ');

            if (heightStr) options.height = parseInt(heightStr);
            if (widthStr) options.width = parseInt(widthStr);
        }

        try {
            const diagramObj = this.workbook.addCrossSectionDiagram({
                key: diagramKey,
                title,
                options,
                filename: `crosssection_${diagramKey}_${Date.now()}.png`
            });

            console.log(`\n✓ Cross-section diagram created successfully!`);
            console.log(`  ID: ${diagramObj.id}`);
            console.log(`  Category: ${diagramObj.category}`);
            console.log(`  File: ${diagramObj.filename}`);

            this.sessionData.crossSectionDiagramsAdded.push({
                name: title,
                type: diagramKey,
                category: diagramObj.category,
                timestamp: new Date()
            });

        } catch (error) {
            console.log(`\n✗ Error creating cross-section diagram: ${error.message}`);
        }

        await this.question('\nPress Enter to continue...');
    }

    // View existing cross-section diagrams
    async viewExistingCrossSectionDiagrams() {
        const diagrams = this.workbook.listCrossSectionDiagrams();

        if (diagrams.length === 0) {
            console.log('\nNo cross-section diagrams created yet.');
            return;
        }

        console.log('\n\nCross-Section Diagrams in Workbook:\n');
        diagrams.forEach(diagram => {
            console.log(`${diagram.index + 1}. ${diagram.name}`);
            console.log(`   Type: ${diagram.type}`);
            console.log(`   Category: ${diagram.category}`);
            console.log(`   File: ${diagram.filename}`);
            console.log(`   Created: ${diagram.created.toLocaleString()}\n`);
        });

        await this.question('Press Enter to go back...');
    }

    // Render all cross-section diagrams
    async renderAllCrossSectionDiagrams() {
        console.log('\nRendering all cross-section diagrams to PNG...\n');

        const results = this.workbook.renderAllCrossSectionDiagrams();

        results.forEach((result, index) => {
            if (result.error) {
                console.log(`${index + 1}. ✗ Error: ${result.error}`);
            } else {
                console.log(`${index + 1}. ✓ ${result.filename} (${result.category})`);
            }
        });

        console.log('\n✓ Cross-section diagram rendering complete!');
        await this.question('Press Enter to continue...');
    }

    // Step 6.7 - Create Stereochemistry Diagrams
    async step6_7_CreateStereochemistryDiagrams() {
        this.currentStep = 6.7;
        this.displaySection('Step 6.7: Create Stereochemistry (Molecular) Diagrams');

        let continueDiagrams = true;

        while (continueDiagrams) {
            console.log('Stereochemistry Diagram Options:\n');
            console.log('  1. View available molecular structures');
            console.log('  2. Get diagram suggestions');
            console.log('  3. Search by chemical formula');
            console.log('  4. Create a molecular diagram');
            console.log('  5. View existing diagrams');
            console.log('  6. Render all diagrams to PNG');
            console.log('  7. Get molecular geometry information');
            console.log('  Q. Continue to summary statistics\n');

            const choice = await this.question('Choose option: ');

            switch (choice) {
                case '1':
                    await this.displayAvailableStereochemistryDiagrams();
                    break;
                case '2':
                    await this.displayStereochemistryDiagramSuggestions();
                    break;
                case '3':
                    await this.searchByChemicalFormula();
                    break;
                case '4':
                    await this.createStereochemistryDiagramInteractive();
                    break;
                case '5':
                    await this.viewExistingStereochemistryDiagrams();
                    break;
                case '6':
                    await this.renderAllStereochemistryDiagrams();
                    break;
                case '7':
                    await this.viewMolecularGeometryInfo();
                    break;
                case 'Q':
                case 'q':
                    continueDiagrams = false;
                    break;
                default:
                    console.log('Invalid choice.');
            }
        }

        console.log(`\n✓ Created ${this.sessionData.stereochemistryDiagramsAdded.length} molecular diagrams`);
        await this.question('Press Enter to continue to summary statistics...');
    }

    // Display available stereochemistry diagrams
    async displayAvailableStereochemistryDiagrams() {
        console.log('\n' + '='.repeat(80));
        console.log('AVAILABLE MOLECULAR STRUCTURES BY CATEGORY');
        console.log('='.repeat(80) + '\n');

        const categories = StereochemistryDiagramsRegistry.getAllCategories();

        categories.forEach(category => {
            console.log(`\n${category}:`);
            const diagrams = StereochemistryDiagramsRegistry.getDiagramsByCategory(category);

            Object.entries(diagrams).forEach(([key, diagram]) => {
                console.log(`  • ${diagram.name} (${key})`);
                console.log(`    Formula: ${diagram.formula}`);
                console.log(`    Geometry: ${diagram.geometry.replace(/_/g, ' ')}`);
                console.log(`    Bond Angles: ${diagram.bondAngles.join('°, ')}°`);
                console.log(`    ${diagram.description}`);
            });
        });

        await this.question('\nPress Enter to go back...');
    }

    // Display stereochemistry diagram suggestions
    async displayStereochemistryDiagramSuggestions() {
        console.log('\nAnalyzing your data for chemistry context...\n');

        const suggestions = this.workbook.suggestStereochemistryDiagrams();

        if (suggestions.length === 0) {
            console.log('No specific molecular diagram suggestions based on data.');
            console.log('However, you can still create any molecule from the library!\n');
            
            console.log('Popular molecules:');
            console.log('  • Methane (CH₄) - Simple tetrahedral');
            console.log('  • Water (H₂O) - Bent molecule');
            console.log('  • Glucose (C₆H₁₂O₆) - Carbohydrate');
        } else {
            console.log('Recommended Molecular Diagrams:\n');
            suggestions.forEach((suggestion, index) => {
                const diagram = StereochemistryDiagramsRegistry.getDiagram(suggestion.key);
                console.log(`${index + 1}. ${diagram.name} (${suggestion.key})`);
                console.log(`   Formula: ${diagram.formula}`);
                console.log(`   ${suggestion.reason}\n`);
            });
        }

        await this.question('Press Enter to go back...');
    }

    // Search by chemical formula
    async searchByChemicalFormula() {
        const formula = await this.question('\nEnter chemical formula (e.g., CH4, H2O, CO2): ');
        
        const results = this.workbook.findStereochemistryDiagramByFormula(formula);

        if (Object.keys(results).length === 0) {
            console.log(`\nNo diagrams found for formula: ${formula}`);
            console.log('\nAvailable formulas:');
            const allDiagrams = StereochemistryDiagramsRegistry.getAllDiagrams();
            allDiagrams.forEach(key => {
                const diagram = StereochemistryDiagramsRegistry.getDiagram(key);
                console.log(`  • ${diagram.formula} - ${diagram.name}`);
            });
        } else {
            console.log(`\nFound ${Object.keys(results).length} diagram(s) for ${formula}:\n`);
            Object.entries(results).forEach(([key, diagram]) => {
                console.log(`• ${diagram.name} (${key})`);
                console.log(`  Geometry: ${diagram.geometry.replace(/_/g, ' ')}`);
                console.log(`  Bond Angles: ${diagram.bondAngles.join('°, ')}°`);
                console.log(`  ${diagram.description}\n`);
            });
        }

        await this.question('Press Enter to go back...');
    }

    // Create stereochemistry diagram interactively
    async createStereochemistryDiagramInteractive() {
        console.log('\nMolecular Structure Creation Wizard\n');
        console.log('Available molecule categories:\n');

        const categories = StereochemistryDiagramsRegistry.getAllCategories();
        categories.forEach((cat, index) => {
            const diagramsInCat = StereochemistryDiagramsRegistry.getDiagramsByCategory(cat);
            console.log(`${index + 1}. ${cat} (${Object.keys(diagramsInCat).length} molecules)`);
        });

        const categoryChoice = await this.question('\nSelect category: ');
        const categoryIndex = parseInt(categoryChoice) - 1;

        if (categoryIndex < 0 || categoryIndex >= categories.length) {
            console.log('Invalid choice.');
            return;
        }

        const category = categories[categoryIndex];
        const diagramsInCategory = StereochemistryDiagramsRegistry.getDiagramsByCategory(category);
        const diagramKeys = Object.keys(diagramsInCategory);

        console.log(`\n${category} Molecules:\n`);
        diagramKeys.forEach((key, index) => {
            const diagram = diagramsInCategory[key];
            console.log(`${index + 1}. ${diagram.name}`);
            console.log(`   Formula: ${diagram.formula}`);
            console.log(`   Geometry: ${diagram.geometry.replace(/_/g, ' ')}`);
        });

        const diagramChoice = await this.question('\nSelect molecule: ');
        const diagramIndex = parseInt(diagramChoice) - 1;

        if (diagramIndex < 0 || diagramIndex >= diagramKeys.length) {
            console.log('Invalid choice.');
            return;
        }

        const diagramKey = diagramKeys[diagramIndex];
        const diagramInfo = StereochemistryDiagramsRegistry.getDiagram(diagramKey);

        console.log(`\n\nConfiguring: ${diagramInfo.name}`);
        console.log(`Formula: ${diagramInfo.formula}`);
        console.log(`Geometry: ${diagramInfo.geometry.replace(/_/g, ' ')}`);
        console.log(`Bond Angles: ${diagramInfo.bondAngles.join('°, ')}°`);
        console.log(`${diagramInfo.description}\n`);

        const title = await this.question('Enter diagram title: ') || diagramInfo.name;

        let options = {};

        console.log('\nView Options:');
        console.log('  1. Both 2D and 3D (default)');
        console.log('  2. 2D structure only');
        console.log('  3. 3D model only');
        
        const viewChoice = await this.question('Select view (1-3): ');
        
        if (viewChoice === '2') {
            options.show2D = true;
            options.show3D = false;
        } else if (viewChoice === '3') {
            options.show2D = false;
            options.show3D = true;
        } else {
            options.show2D = true;
            options.show3D = true;
        }

        const showAngles = await this.question('Show bond angles? (y/n, default: y): ');
        options.showAngles = showAngles.toLowerCase() !== 'n';

        const showLabels = await this.question('Show atom labels? (y/n, default: y): ');
        options.showLabels = showLabels.toLowerCase() !== 'n';

        if (options.show3D) {
            const rotXStr = await this.question('3D rotation X (0-360, default: 20): ');
            const rotYStr = await this.question('3D rotation Y (0-360, default: 30): ');
            
            if (rotXStr) options.rotationX = parseInt(rotXStr);
            if (rotYStr) options.rotationY = parseInt(rotYStr);
        }

        const customizeOptions = await this.question('Customize diagram size? (y/n, default: n): ');
        
        if (customizeOptions.toLowerCase() === 'y') {
            const heightStr = await this.question('Diagram height in pixels (default: 600): ');
            const widthStr = await this.question('Diagram width in pixels (default: 800): ');

            if (heightStr) options.height = parseInt(heightStr);
            if (widthStr) options.width = parseInt(widthStr);
        }

        try {
            const diagramObj = this.workbook.addStereochemistryDiagram({
                key: diagramKey,
                title,
                options,
                filename: `molecule_${diagramKey}_${Date.now()}.png`
            });

            console.log(`\n✓ Molecular diagram created successfully!`);
            console.log(`  ID: ${diagramObj.id}`);
            console.log(`  Formula: ${diagramObj.formula}`);
            console.log(`  Category: ${diagramObj.category}`);
            console.log(`  File: ${diagramObj.filename}`);

            this.sessionData.stereochemistryDiagramsAdded.push({
                name: title,
                type: diagramKey,
                formula: diagramObj.formula,
                category: diagramObj.category,
                timestamp: new Date()
            });

        } catch (error) {
            console.log(`\n✗ Error creating molecular diagram: ${error.message}`);
        }

        await this.question('\nPress Enter to continue...');
    }

    // View existing stereochemistry diagrams
    async viewExistingStereochemistryDiagrams() {
        const diagrams = this.workbook.listStereochemistryDiagrams();

        if (diagrams.length === 0) {
            console.log('\nNo molecular diagrams created yet.');
            return;
        }

        console.log('\n\nMolecular Diagrams in Workbook:\n');
        diagrams.forEach(diagram => {
            console.log(`${diagram.index + 1}. ${diagram.name}`);
            console.log(`   Formula: ${diagram.formula}`);
            console.log(`   Type: ${diagram.type}`);
            console.log(`   Category: ${diagram.category}`);
            console.log(`   File: ${diagram.filename}`);
            console.log(`   Created: ${diagram.created.toLocaleString()}\n`);
        });

        await this.question('Press Enter to go back...');
    }

    // Render all stereochemistry diagrams
    async renderAllStereochemistryDiagrams() {
        console.log('\nRendering all molecular diagrams to PNG...\n');

        const results = this.workbook.renderAllStereochemistryDiagrams();

        results.forEach((result, index) => {
            if (result.error) {
                console.log(`${index + 1}. ✗ Error: ${result.error}`);
            } else {
                console.log(`${index + 1}. ✓ ${result.filename} (${result.formula})`);
            }
        });

        console.log('\n✓ Molecular diagram rendering complete!');
        await this.question('Press Enter to continue...');
    }

    // View molecular geometry info
    async viewMolecularGeometryInfo() {
        console.log('\nAvailable Molecular Geometries:\n');
        console.log('  1. Tetrahedral (109.5°) - CH₄, CCl₄');
        console.log('  2. Bent (104.5°) - H₂O, H₂S');
        console.log('  3. Trigonal Pyramidal (107°) - NH₃, PH₃');
        console.log('  4. Trigonal Planar (120°) - BF₃, C₂H₄');
        console.log('  5. Linear (180°) - CO₂, HCN');
        console.log('  6. Octahedral (90°, 180°) - SF₆');

        const choice = await this.question('\nSelect geometry for details (1-6): ');

        const geometries = ['tetrahedral', 'bent', 'trigonal_pyramidal', 'trigonal_planar', 'linear', 'octahedral'];
        const geometryIndex = parseInt(choice) - 1;

        if (geometryIndex >= 0 && geometryIndex < geometries.length) {
            const info = this.workbook.getMolecularGeometryInfo(geometries[geometryIndex]);
            
            console.log(`\n${geometries[geometryIndex].replace(/_/g, ' ').toUpperCase()}:`);
            console.log(`  Bond Angles: ${info.bondAngles.join('°, ')}°`);
            console.log(`  Coordination: ${info.coordination} atoms`);
            console.log(`  Description: ${info.description}`);
            console.log(`  Examples: ${info.examples.join(', ')}`);
        }

        await this.question('\nPress Enter to go back...');
    }

    // Step 7: Summary statistics
    async step7_SummaryStatistics() {
        this.currentStep = 7;
        this.displaySection('Step 7: Calculate Summary Statistics');

        this.displayDataPreview();

        console.log('Let\'s generate summary statistics for your data.\n');
        console.log('Available summary formulas:');
        console.log('  1. SUM - Total of values');
        console.log('  2. AVERAGE - Mean value');
        console.log('  3. MAX - Highest value');
        console.log('  4. MIN - Lowest value');
        console.log('  5. MEDIAN - Middle value');
        console.log('  6. STDEV - Standard deviation');
        console.log('  7. Apply all common statistics\n');

        const choice = await this.question('Choose option (1-7): ');

        if (choice === '7') {
            await this.applyAllStatistics();
        } else {
            await this.applySingleStatistic(choice);
        }

        console.log('\n📊 Updated Data with Statistics:');
        this.displayDataPreview();

        await this.question('\nPress Enter to continue to additional options...');
    }

    // Apply all statistics
    async applyAllStatistics() {
        console.log('\nApplying all statistics...\n');

        const numericColumns = [];
        this.workbook.headers.forEach((header, index) => {
            const firstValue = this.workbook.data[0]?.[index];
            if (!isNaN(parseFloat(firstValue))) {
                numericColumns.push({ header, index });
            }
        });

        console.log(`Found ${numericColumns.length} numeric columns\n`);

        const summaryRow = this.workbook.data.length + 2;

        numericColumns.forEach(({ header, index }) => {
            const col = this.workbook.columnToLetter(index);
            const range = `${col}2:${col}${this.workbook.data.length + 1}`;

            try {
                const sumResult = this.workbook.applyFormula(`${col}${summaryRow}`, 'sum', [range]);
                const avgResult = this.workbook.applyFormula(`${col}${summaryRow + 1}`, 'average', [range]);

                console.log(`${header}:`);
                console.log(`  Total: ${sumResult.formatted}`);
                console.log(`  Average: ${avgResult.formatted}\n`);
            } catch (error) {
                console.log(`  Error calculating for ${header}: ${error.message}`);
            }
        });
    }

    // Apply single statistic
    async applySingleStatistic(choice) {
        const formulas = ['sum', 'average', 'max', 'min', 'median', 'stdev'];
        const formulaKey = formulas[parseInt(choice) - 1];

        if (!formulaKey) {
            console.log('Invalid choice');
            return;
        }

        const range = await this.question('Enter range (e.g., B2:B8): ');
        const target = await this.question('Enter target cell (e.g., B10): ');

        try {
            const result = this.workbook.applyFormula(target, formulaKey, [range]);
            console.log(`\n✓ ${result.formula} = ${result.formatted}`);
        } catch (error) {
            console.log(`\n✗ Error: ${error.message}`);
        }
    }

    // Step 8: Additional options
    async additionalOptions() {
        let continueOptions = true;

        while (continueOptions) {
            this.displaySection('Additional Analysis & Options');

            console.log('What would you like to do next?\n');
            console.log('  1. View formula documentation');
            console.log('  2. View chart documentation');
            console.log('  3. View anatomical diagram documentation');
            console.log('  4. View cross-section diagram documentation');
            console.log('  5. View stereochemistry diagram documentation');
            console.log('  6. Generate comprehensive report');
            console.log('  7. View data statistics');
            console.log('  8. Search formulas, charts, or diagrams');
            console.log('  9. Export workbook (PNG/Excel)');
            console.log(' 10. View session summary');
            console.log('  Q. Finish session\n');

            const choice = await this.question('Choose option: ');

            switch (choice) {
                case '1':
                    await this.viewFormulaDocumentation();
                    break;
                case '2':
                    await this.viewChartDocumentation();
                    break;
                case '3':
                    await this.viewAnatomicalDiagramDocumentation();
                    break;
                case '4':
                    await this.viewCrossSectionDiagramDocumentation();
                    break;
                case '5':
                    await this.viewStereochemistryDiagramDocumentation();
                    break;
                case '6':
                    await this.generateReport();
                    break;
                case '7':
                    await this.viewStatistics();
                    break;
                case '8':
                    await this.searchItems();
                    break;
                case '9':
                    await this.exportWorkbook();
                    continueOptions = false;
                    break;
                case '10':
                    await this.viewSessionSummary();
                    break;
                case 'Q':
                case 'q':
                    continueOptions = false;
                    break;
                default:
                    console.log('Invalid choice');
            }
        }
    }

    // View formula documentation
    async viewFormulaDocumentation() {
        const formulaKey = await this.question('\nEnter formula name (e.g., sum, average): ');
        const help = this.workbook.getFormulaHelp(formulaKey);

        if (help.error) {
            console.log(`\n✗ ${help.error}`);
        } else {
            console.log(`\n${help.name}`);
            console.log(`Category: ${help.category}`);
            console.log(`Description: ${help.description}`);
            console.log(`Excel Formula: ${help.excelFormula}`);
            console.log(`Example: ${help.example}`);
            console.log('\nTips:');
            help.tips.forEach(tip => console.log(`  • ${tip}`));
        }

        await this.question('\nPress Enter to continue...');
    }

    // View chart documentation
    async viewChartDocumentation() {
        const chartKey = await this.question('\nEnter chart name (e.g., columnChart, pieChart): ');
        const help = this.workbook.getChartHelp(chartKey);

        if (help.error) {
            console.log(`\n✗ ${help.error}`);
        } else {
            console.log(`\n${help.name}`);
            console.log(`Category: ${help.category}`);
            console.log(`Description: ${help.description}`);
            console.log(`Excel Equivalent: ${help.excel}`);
            console.log(`Usage: ${help.usage}`);
            console.log(`\nData Required: ${help.dataRequired.join(', ')}`);
            console.log('\nExamples:');
            help.examples.forEach(ex => console.log(`  • ${ex}`));
        }

        await this.question('\nPress Enter to continue...');
    }

    // View anatomical diagram documentation
    async viewAnatomicalDiagramDocumentation() {
        const diagramKey = await this.question('\nEnter diagram name (e.g., heartAnatomy, cellStructure): ');
        const help = this.workbook.getAnatomicalDiagramHelp(diagramKey);

        if (help.error) {
            console.log(`\n✗ ${help.error}`);
        } else {
            console.log(`\n${help.name}`);
            console.log(`Category: ${help.category}`);
            console.log(`Description: ${help.description}`);
            console.log(`Usage: ${help.usage}`);
            console.log('\nExamples:');
            help.examples.forEach(ex => console.log(`  • ${ex}`));
            
            if (help.chamberOptions) {
                console.log('\nAvailable Options:');
                help.chamberOptions.forEach(opt => console.log(`  • ${opt}`));
            }
        }

        await this.question('\nPress Enter to continue...');
    }

    // View cross-section diagram documentation
    async viewCrossSectionDiagramDocumentation() {
        const diagramKey = await this.question('\nEnter diagram name (e.g., dicotLeafCrossSection, earthCrossSection): ');
        const help = this.workbook.getCrossSectionDiagramHelp(diagramKey);

        if (help.error) {
            console.log(`\n✗ ${help.error}`);
        } else {
            console.log(`\n${help.name}`);
            console.log(`Category: ${help.category}`);
            console.log(`Description: ${help.description}`);
            console.log(`Usage: ${help.usage}`);
            console.log('\nExamples:');
            help.examples.forEach(ex => console.log(`  • ${ex}`));
        }

        await this.question('\nPress Enter to continue...');
    }

    // View stereochemistry diagram documentation
    async viewStereochemistryDiagramDocumentation() {
        const diagramKey = await this.question('\nEnter molecule name (e.g., methane, water, glucose): ');
        const help = this.workbook.getStereochemistryDiagramHelp(diagramKey);

        if (help.error) {
            console.log(`\n✗ ${help.error}`);
        } else {
            console.log(`\n${help.name}`);
            console.log(`Formula: ${help.formula}`);
            console.log(`Category: ${help.category}`);
            console.log(`Geometry: ${help.geometry.replace(/_/g, ' ')}`);
            console.log(`Bond Angles: ${help.bondAngles.join('°, ')}°`);
            console.log(`Central Atom: ${help.centralAtom || 'N/A'}`);
            console.log(`Description: ${help.description}`);
        }

        await this.question('\nPress Enter to continue...');
    }

    // Generate report
    async generateReport() {
        console.log('\nGenerating comprehensive report...\n');

        const report = this.workbook.generateUnifiedVisualizationReport();

        console.log('WORKBOOK REPORT');
        console.log('='.repeat(80));
        console.log(`\nSheet: ${report.metadata.sheetName}`);
        console.log(`Author: ${report.metadata.author}`);
        console.log(`Created: ${report.metadata.created.toLocaleString()}`);
        console.log(`Last Modified: ${report.metadata.lastModified.toLocaleString()}`);
        console.log(`\nDimensions: ${report.metadata.rowCount} rows × ${report.metadata.columnCount} columns`);
        console.log(`Total Cells: ${report.data.totalCells}`);
        console.log(`Formula Cells: ${report.formulas.count}`);
        console.log(`\nVisualizations:`);
        console.log(`  Charts: ${report.visualizations.summary.totalCharts}`);
        console.log(`  Anatomical Diagrams: ${report.visualizations.summary.totalAnatomical}`);
        console.log(`  Cross-Section Diagrams: ${report.visualizations.summary.totalCrossSection}`);
        console.log(`  Molecular Diagrams: ${report.visualizations.summary.totalStereochemistry}`);
        console.log(`  Total: ${report.visualizations.summary.totalVisualizations}`);

        await this.question('\nPress Enter to continue...');
    }

    // View statistics
    async viewStatistics() {
        const stats = this.workbook.calculateStatistics();

        console.log('\nDATA STATISTICS');
        console.log('='.repeat(80));

        if (Object.keys(stats).length === 0) {
            console.log('No numeric columns found.');
        } else {
            Object.entries(stats).forEach(([col, data]) => {
                console.log(`\n${col}:`);
                console.log(`  Count: ${data.count}`);
                console.log(`  Sum: ${data.sum.toFixed(2)}`);
                console.log(`  Average: ${data.average.toFixed(2)}`);
                console.log(`  Min: ${data.min.toFixed(2)}`);
                console.log(`  Max: ${data.max.toFixed(2)}`);
                console.log(`  Median: ${data.median.toFixed(2)}`);
            });
        }

        await this.question('\nPress Enter to continue...');
    }

    // Search items
    async searchItems() {
        console.log('\nSearch Options:\n');
        console.log('  1. Search formulas');
        console.log('  2. Search charts');
        console.log('  3. Search anatomical diagrams');
        console.log('  4. Search cross-section diagrams');
        console.log('  5. Search molecular structures');
        console.log('  6. Search all');
        console.log('  7. Back\n');

        const choice = await this.question('Choose option: ');

        if (choice === '1') {
            await this.searchFormulas();
        } else if (choice === '2') {
            await this.searchCharts();
        } else if (choice === '3') {
            await this.searchAnatomicalDiagrams();
        } else if (choice === '4') {
            await this.searchCrossSectionDiagrams();
        } else if (choice === '5') {
            await this.searchStereochemistryDiagrams();
        } else if (choice === '6') {
            await this.searchAll();
        }
    }

    // Search formulas
    async searchFormulas() {
        const query = await this.question('\nEnter search term for formulas: ');
        const results = SpreadsheetFormulaRegistry.searchFormulas(query);

        console.log(`\nFound ${Object.keys(results).length} formulas:\n`);

        Object.entries(results).forEach(([key, formula]) => {
            console.log(`• ${formula.name} (${key})`);
            console.log(`  ${formula.description}`);
            console.log(`  Example: ${formula.example}\n`);
        });

        await this.question('Press Enter to continue...');
    }

    // Search charts
    async searchCharts() {
        const query = await this.question('\nEnter search term for charts: ');
        const results = ExcelChartsRegistry.searchCharts(query);

        console.log(`\nFound ${Object.keys(results).length} charts:\n`);

        Object.entries(results).forEach(([key, chart]) => {
            console.log(`• ${chart.name} (${key})`);
            console.log(`  ${chart.description}`);
            console.log(`  Category: ${chart.category}\n`);
        });

        await this.question('Press Enter to continue...');
    }

    // Search anatomical diagrams
    async searchAnatomicalDiagrams() {
        const query = await this.question('\nEnter search term for anatomical diagrams: ');
        const results = AnatomicalDiagramsRegistry.searchDiagrams(query);

        console.log(`\nFound ${Object.keys(results).length} anatomical diagrams:\n`);

        Object.entries(results).forEach(([key, diagram]) => {
            console.log(`• ${diagram.name} (${key})`);
            console.log(`  ${diagram.description}`);
            console.log(`  Category: ${diagram.category}\n`);
        });

        await this.question('Press Enter to continue...');
    }

    // Search cross-section diagrams
    async searchCrossSectionDiagrams() {
        const query = await this.question('\nEnter search term for cross-section diagrams: ');
        const results = CrossSectionDiagramsRegistry.searchDiagrams(query);

        console.log(`\nFound ${Object.keys(results).length} cross-section diagrams:\n`);

        Object.entries(results).forEach(([key, diagram]) => {
            console.log(`• ${diagram.name} (${key})`);
            console.log(`  ${diagram.description}`);
            console.log(`  Category: ${diagram.category}\n`);
        });

        await this.question('Press Enter to continue...');
    }

    // Search stereochemistry diagrams
    async searchStereochemistryDiagrams() {
        const query = await this.question('\nEnter search term for molecular structures: ');
        const results = StereochemistryDiagramsRegistry.searchDiagrams(query);

        console.log(`\nFound ${Object.keys(results).length} molecular structures:\n`);

        Object.entries(results).forEach(([key, diagram]) => {
            console.log(`• ${diagram.name} (${key})`);
            console.log(`  Formula: ${diagram.formula}`);
            console.log(`  Geometry: ${diagram.geometry.replace(/_/g, ' ')}`);
            console.log(`  ${diagram.description}\n`);
        });

        await this.question('Press Enter to continue...');
    }

    // Search all
    async searchAll() {
        const query = await this.question('\nEnter search term: ');
        const results = this.workbook.searchAllDiagrams(query);

        console.log('\n' + '='.repeat(80));
        console.log('SEARCH RESULTS');
        console.log('='.repeat(80));

        console.log(`\nFormulas (${Object.keys(results.anatomical).length}):`);
        Object.entries(results.anatomical).slice(0, 3).forEach(([key, item]) => {
            console.log(`  • ${item.name}`);
        });

        console.log(`\nAnatomical Diagrams (${Object.keys(results.anatomical).length}):`);
        Object.entries(results.anatomical).slice(0, 3).forEach(([key, item]) => {
            console.log(`  • ${item.name}`);
        });

        console.log(`\nCross-Section Diagrams (${Object.keys(results.crossSection).length}):`);
        Object.entries(results.crossSection).slice(0, 3).forEach(([key, item]) => {
            console.log(`  • ${item.name}`);
        });

        console.log(`\nMolecular Structures (${Object.keys(results.stereochemistry).length}):`);
        Object.entries(results.stereochemistry).slice(0, 3).forEach(([key, item]) => {
            console.log(`  • ${item.name} (${item.formula})`);
        });

        await this.question('\nPress Enter to continue...');
    }

    // UPDATED: Export workbook with all diagram types
    async exportWorkbook() {
        this.displaySection('Export Workbook');

        const hasCharts = this.workbook.charts.length > 0;
        const hasAnatomical = this.workbook.anatomicalDiagrams.length > 0;
        const hasCrossSection = this.workbook.crossSectionDiagrams.length > 0;
        const hasSterechem = this.workbook.stereochemistryDiagrams.length > 0;
        const hasVisualizations = hasCharts || hasAnatomical || hasCrossSection || hasSterechem;

        console.log('Choose export format:\n');
        console.log('  1. PNG image (spreadsheet only)');
        console.log('  2. PNG image (spreadsheet + all visualizations)');
        console.log('  3. Excel file (.xlsx, no visualizations)');
        console.log('  4. Excel file (.xlsx + all embedded visualizations)');
        console.log('  5. Separate visualization PNG files');
        console.log('  6. Complete package (all formats)\n');

        if (hasCharts) console.log(`Note: Your workbook contains ${this.workbook.charts.length} chart(s)`);
        if (hasAnatomical) console.log(`Note: Your workbook contains ${this.workbook.anatomicalDiagrams.length} anatomical diagram(s)`);
        if (hasCrossSection) console.log(`Note: Your workbook contains ${this.workbook.crossSectionDiagrams.length} cross-section diagram(s)`);
        if (hasSterechem) console.log(`Note: Your workbook contains ${this.workbook.stereochemistryDiagrams.length} molecular diagram(s)`);
        console.log('');

        const choice = await this.question('Choose option (1-6): ');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const baseName = `workbook_${timestamp}`;

        try {
            if (choice === '1') {
                // PNG spreadsheet only
                const pngFile = `${baseName}.png`;
                this.workbook.exportToPNG(pngFile, { 
                    includeCharts: false, 
                    includeAnatomicalDiagrams: false,
                    includeCrossSectionDiagrams: false,
                    includeStereochemistryDiagrams: false
                });
                console.log(`✓ PNG exported: ${pngFile}`);
                this.sessionData.exportFormats.push('PNG (Spreadsheet Only)');

            } else if (choice === '2') {
                // PNG spreadsheet with all visualizations
                if (!hasVisualizations) {
                    console.log('⚠ No visualizations created yet. Exporting spreadsheet only.');
                }
                const pngFile = `${baseName}_with_all.png`;
                this.workbook.exportToPNG(pngFile, { 
                    includeCharts: hasCharts, 
                    includeAnatomicalDiagrams: hasAnatomical,
                    includeCrossSectionDiagrams: hasCrossSection,
                    includeStereochemistryDiagrams: hasSterechem
                });
                console.log(`✓ PNG with all visualizations exported: ${pngFile}`);
                this.sessionData.exportFormats.push('PNG (With All Visualizations)');

            } else if (choice === '3') {
                // Excel without visualizations
                const xlsxFile = `${baseName}.xlsx`;
                await this.workbook.exportToExcel(xlsxFile, { 
                    includeCharts: false, 
                    includeAnatomicalDiagrams: false,
                    includeCrossSectionDiagrams: false,
                    includeStereochemistryDiagrams: false
                });
                console.log(`✓ Excel exported: ${xlsxFile}`);
                this.sessionData.exportFormats.push('XLSX (No Visualizations)');

            } else if (choice === '4') {
                // Excel with all embedded visualizations
                if (!hasVisualizations) {
                    console.log('⚠ No visualizations created yet. Exporting Excel without visualizations.');
                }
                const xlsxFile = `${baseName}_with_all.xlsx`;
                await this.workbook.exportToExcel(xlsxFile, { 
                    includeCharts: hasCharts, 
                    includeAnatomicalDiagrams: hasAnatomical,
                    includeCrossSectionDiagrams: hasCrossSection,
                    includeStereochemistryDiagrams: hasSterechem
                });
                console.log(`✓ Excel with all visualizations exported: ${xlsxFile}`);
                this.sessionData.exportFormats.push('XLSX (With All Visualizations)');

            } else if (choice === '5') {
                // Separate visualization files
                let totalExported = 0;
                
                if (hasCharts) {
                    console.log('\nRendering charts...');
                    const chartResults = this.workbook.renderAllCharts();
                    const chartSuccess = chartResults.filter(r => !r.error).length;
                    console.log(`✓ ${chartSuccess} chart(s) rendered to PNG`);
                    totalExported += chartSuccess;
                }
                
                if (hasAnatomical) {
                    console.log('\nRendering anatomical diagrams...');
                    const anatomicalResults = this.workbook.renderAllAnatomicalDiagrams();
                    const anatomicalSuccess = anatomicalResults.filter(r => !r.error).length;
                    console.log(`✓ ${anatomicalSuccess} anatomical diagram(s) rendered to PNG`);
                    totalExported += anatomicalSuccess;
                }

                if (hasCrossSection) {
                    console.log('\nRendering cross-section diagrams...');
                    const crossResults = this.workbook.renderAllCrossSectionDiagrams();
                    const crossSuccess = crossResults.filter(r => !r.error).length;
                    console.log(`✓ ${crossSuccess} cross-section diagram(s) rendered to PNG`);
                    totalExported += crossSuccess;
                }

                if (hasSterechem) {
                    console.log('\nRendering molecular diagrams...');
                    const moleculeResults = this.workbook.renderAllStereochemistryDiagrams();
                    const moleculeSuccess = moleculeResults.filter(r => !r.error).length;
                    console.log(`✓ ${moleculeSuccess} molecular diagram(s) rendered to PNG`);
                    totalExported += moleculeSuccess;
                }
                
                if (totalExported > 0) {
                    this.sessionData.exportFormats.push(`Separate Files (${totalExported} visualizations)`);
                } else {
                    console.log('⚠ No visualizations created yet.');
                }

            } else if (choice === '6') {
                // Complete package
                console.log('\nCreating complete export package...\n');

                // 1. Spreadsheet PNG (with all visualizations if available)
                const pngFile = hasVisualizations
                    ? `${baseName}_with_all.png`
                    : `${baseName}.png`;
                this.workbook.exportToPNG(pngFile, {
                    includeCharts: hasCharts,
                    includeAnatomicalDiagrams: hasAnatomical,
                    includeCrossSectionDiagrams: hasCrossSection,
                    includeStereochemistryDiagrams: hasSterechem
                });
                console.log(`✓ PNG exported: ${pngFile}`);

                // 2. Excel file (with all visualizations if available)
                const xlsxFile = hasVisualizations
                    ? `${baseName}_with_all.xlsx`
                    : `${baseName}.xlsx`;
                await this.workbook.exportToExcel(xlsxFile, {
                    includeCharts: hasCharts,
                    includeAnatomicalDiagrams: hasAnatomical,
                    includeCrossSectionDiagrams: hasCrossSection,
                    includeStereochemistryDiagrams: hasSterechem
                });
                console.log(`✓ Excel exported: ${xlsxFile}`);

                // 3. Separate visualization files
                let totalVisualizationsExported = 0;

                if (hasCharts) {
                    console.log('\nRendering charts...');
                    const chartResults = this.workbook.renderAllCharts();
                    const chartSuccess = chartResults.filter(r => !r.error).length;
                    console.log(`✓ ${chartSuccess} chart(s) rendered`);
                    totalVisualizationsExported += chartSuccess;
                }

                if (hasAnatomical) {
                    console.log('\nRendering anatomical diagrams...');
                    const anatomicalResults = this.workbook.renderAllAnatomicalDiagrams();
                    const anatomicalSuccess = anatomicalResults.filter(r => !r.error).length;
                    console.log(`✓ ${anatomicalSuccess} anatomical diagram(s) rendered`);
                    totalVisualizationsExported += anatomicalSuccess;
                }

                if (hasCrossSection) {
                    console.log('\nRendering cross-section diagrams...');
                    const crossResults = this.workbook.renderAllCrossSectionDiagrams();
                    const crossSuccess = crossResults.filter(r => !r.error).length;
                    console.log(`✓ ${crossSuccess} cross-section diagram(s) rendered`);
                    totalVisualizationsExported += crossSuccess;
                }

                if (hasSterechem) {
                    console.log('\nRendering molecular diagrams...');
                    const moleculeResults = this.workbook.renderAllStereochemistryDiagrams();
                    const moleculeSuccess = moleculeResults.filter(r => !r.error).length;
                    console.log(`✓ ${moleculeSuccess} molecular diagram(s) rendered`);
                    totalVisualizationsExported += totalVisualizationsExported;
                }

                this.sessionData.exportFormats.push('Complete Package');
                console.log(`\n✓ Complete package created with ${totalVisualizationsExported} visualizations`);
            } else {
                console.log('Invalid choice. No export performed.');
                return;
            }

            console.log('\n✓ Export completed successfully!');

        } catch (error) {
            console.log(`\n✗ Export error: ${error.message}`);
        }

        await this.question('\nPress Enter to continue...');
    }

    // View session summary
    async viewSessionSummary() {
        this.displaySection('Session Summary');

        console.log(`Workbook: ${this.workbook.sheetName}`);
        console.log(`Data Rows: ${this.workbook.data.length}`);
        console.log(`Columns: ${this.workbook.headers.length}`);

        console.log(`\nFormulas Applied: ${this.sessionData.formulasApplied.length}`);
        if (this.sessionData.formulasApplied.length > 0) {
            console.log('Formula History:');
            this.sessionData.formulasApplied.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.formula} → ${item.target}`);
            });
        }

        console.log(`\nCharts Created: ${this.sessionData.chartsAdded.length}`);
        if (this.sessionData.chartsAdded.length > 0) {
            console.log('Chart History:');
            this.sessionData.chartsAdded.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.name} (${item.type})`);
            });
        }

        console.log(`\nAnatomical Diagrams Created: ${this.sessionData.anatomicalDiagramsAdded.length}`);
        if (this.sessionData.anatomicalDiagramsAdded.length > 0) {
            console.log('Anatomical Diagram History:');
            this.sessionData.anatomicalDiagramsAdded.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.name} (${item.type}) - ${item.category}`);
            });
        }

        console.log(`\nCross-Section Diagrams Created: ${this.sessionData.crossSectionDiagramsAdded.length}`);
        if (this.sessionData.crossSectionDiagramsAdded.length > 0) {
            console.log('Cross-Section Diagram History:');
            this.sessionData.crossSectionDiagramsAdded.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.name} (${item.type}) - ${item.category}`);
            });
        }

        console.log(`\nMolecular Diagrams Created: ${this.sessionData.stereochemistryDiagramsAdded.length}`);
        if (this.sessionData.stereochemistryDiagramsAdded.length > 0) {
            console.log('Molecular Diagram History:');
            this.sessionData.stereochemistryDiagramsAdded.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.name} (${item.formula}) - ${item.category}`);
            });
        }

        if (this.sessionData.exportFormats.length > 0) {
            console.log(`\nExported Formats: ${this.sessionData.exportFormats.join(', ')}`);
        }

        const totalVisualizations = 
            this.sessionData.chartsAdded.length + 
            this.sessionData.anatomicalDiagramsAdded.length +
            this.sessionData.crossSectionDiagramsAdded.length +
            this.sessionData.stereochemistryDiagramsAdded.length;

        console.log(`\nTotal Visualizations: ${totalVisualizations}`);
        console.log(`  Charts: ${this.sessionData.chartsAdded.length}`);
        console.log(`  Anatomical: ${this.sessionData.anatomicalDiagramsAdded.length}`);
        console.log(`  Cross-Section: ${this.sessionData.crossSectionDiagramsAdded.length}`);
        console.log(`  Molecular: ${this.sessionData.stereochemistryDiagramsAdded.length}`);

        await this.question('\nPress Enter to continue...');
    }

    // UPDATED: Main run method with all diagram steps
    async run() {
        try {
            await this.welcome();
            await this.step1_CreateWorkbook();
            await this.step2_LoadData();
            await this.step3_ShowFormulas();
            await this.step5_ApplyFormulas();
            await this.step6_CreateCharts();
            await this.step6_5_CreateAnatomicalDiagrams();
            await this.step6_6_CreateCrossSectionDiagrams();
            await this.step6_7_CreateStereochemistryDiagrams();
            await this.step7_SummaryStatistics();
            await this.additionalOptions();

            this.displayHeader('Session Complete');
            console.log('Thank you for using the Excel Workbook Interactive Tool!\n');
            await this.viewSessionSummary();

            console.log('\n✓ All operations completed successfully!');
            console.log('Your files have been saved to the current directory.\n');

            // Final summary of created content
            const totalVisualizations = 
                this.sessionData.chartsAdded.length + 
                this.sessionData.anatomicalDiagramsAdded.length +
                this.sessionData.crossSectionDiagramsAdded.length +
                this.sessionData.stereochemistryDiagramsAdded.length;

            if (totalVisualizations > 0) {
                console.log('📊 Visualization Summary:');
                console.log(`  • ${this.sessionData.chartsAdded.length} Charts`);
                console.log(`  • ${this.sessionData.anatomicalDiagramsAdded.length} Anatomical Diagrams`);
                console.log(`  • ${this.sessionData.crossSectionDiagramsAdded.length} Cross-Section Diagrams`);
                console.log(`  • ${this.sessionData.stereochemistryDiagramsAdded.length} Molecular Structures`);
                console.log(`  • ${totalVisualizations} Total Visualizations\n`);
            }

            if (this.sessionData.formulasApplied.length > 0) {
                console.log(`📐 Applied ${this.sessionData.formulasApplied.length} formulas\n`);
            }

            if (this.sessionData.exportFormats.length > 0) {
                console.log(`💾 Exported formats: ${this.sessionData.exportFormats.join(', ')}\n`);
            }

            console.log('Thank you for using the Enhanced Excel Workbook System!');
            console.log('Your complete scientific workbook with charts, anatomy, biology,');
            console.log('earth science, and chemistry diagrams is ready!\n');

        } catch (error) {
            console.error('\n❌ Error during session:', error.message);
            console.error('Stack trace:', error.stack);
        } finally {
            this.rl.close();
        }
    }
}

// Entry point
if (process.argv[2] === 'excel' || !process.argv[2]) {
    const session = new InteractiveExcelSession();
    session.run();
} else {
    console.log('Usage: node interactive-excel.js excel');
}

export default InteractiveExcelSession;
