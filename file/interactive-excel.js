import EnhancedSpreadsheetWorkbook, {
    SpreadsheetFormulaRegistry,
    ExcelChartsRegistry,
    AnatomicalDiagramsRegistry
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

    // Show actual data (first 5 rows)
    console.log('\nSpreadsheet Data (first 5 rows):\n');
    const preview = [this.workbook.headers, ...this.workbook.data.slice(0, 5)];
    
    // Display with cell references
    preview.forEach((row, rowIndex) => {
        const rowNum = rowIndex === 0 ? '1' : String(rowIndex + 1);
        const rowLabel = `Row ${rowNum}:`.padEnd(8);
        console.log(rowLabel + row.map(cell => String(cell).padEnd(15)).join(' | '));
    });

    if (this.workbook.data.length > 5) {
        console.log(`... (${this.workbook.data.length - 5} more rows)`);
    }

    // Show available ranges
    console.log('\n' + '-'.repeat(80));
    console.log('AVAILABLE CELL RANGES');
    console.log('-'.repeat(80));

    // Row ranges
    console.log('\n📊 Row Ranges (examples):');
    const numRows = this.workbook.data.length;
    const numCols = this.workbook.headers.length;
    const lastCol = this.workbook.columnToLetter(numCols - 1);
    
    console.log(`  • Full data range:        A1:${lastCol}${numRows + 1}`);
    console.log(`  • Headers only:           A1:${lastCol}1`);
    console.log(`  • All data (no headers):  A2:${lastCol}${numRows + 1}`);
    console.log(`  • First row data:         A2:${lastCol}2`);
    console.log(`  • Last row data:          A${numRows + 1}:${lastCol}${numRows + 1}`);
    console.log(`  • First 3 rows:           A2:${lastCol}4`);

    // Column ranges (Named columns)
    console.log('\n📋 Named Column Ranges:');
    this.workbook.headers.forEach((header, index) => {
        const colLetter = this.workbook.columnToLetter(index);
        const headerRange = `${colLetter}1`;
        const dataRange = `${colLetter}2:${colLetter}${numRows + 1}`;
        const fullRange = `${colLetter}1:${colLetter}${numRows + 1}`;
        
        console.log(`  • ${String(header).padEnd(20)} ${headerRange.padEnd(10)} (header)  |  ${dataRange.padEnd(15)} (data only)  |  ${fullRange} (with header)`);
    });

    // Individual cell examples
    console.log('\n🔢 Individual Cell Examples:');
    console.log(`  • Top-left data cell:     A2`);
    console.log(`  • Top-right data cell:    ${lastCol}2`);
    console.log(`  • Bottom-left data cell:  A${numRows + 1}`);
    console.log(`  • Bottom-right data cell: ${lastCol}${numRows + 1}`);

    // Block ranges if formulas applied
    if (Object.keys(this.workbook.formulas).length > 0) {
        console.log('\n✨ Formula Block Ranges:');
        
        // Group formulas by column
        const formulasByColumn = {};
        Object.keys(this.workbook.formulas).forEach(cellRef => {
            const match = cellRef.match(/^([A-Z]+)(\d+)$/);
            if (match) {
                const col = match[1];
                const row = parseInt(match[2]);
                if (!formulasByColumn[col]) {
                    formulasByColumn[col] = [];
                }
                formulasByColumn[col].push(row);
            }
        });

        // Find contiguous ranges
        Object.entries(formulasByColumn).forEach(([col, rows]) => {
            rows.sort((a, b) => a - b);
            
            // Find contiguous ranges
            let rangeStart = rows[0];
            let rangeEnd = rows[0];
            const ranges = [];

            for (let i = 1; i < rows.length; i++) {
                if (rows[i] === rangeEnd + 1) {
                    rangeEnd = rows[i];
                } else {
                    ranges.push(rangeStart === rangeEnd ? `${col}${rangeStart}` : `${col}${rangeStart}:${col}${rangeEnd}`);
                    rangeStart = rows[i];
                    rangeEnd = rows[i];
                }
            }
            ranges.push(rangeStart === rangeEnd ? `${col}${rangeStart}` : `${col}${rangeStart}:${col}${rangeEnd}`);

            const colIndex = this.workbook.letterToColumn(col);
            const headerName = this.workbook.headers[colIndex] || `Column ${col}`;
            
            ranges.forEach(range => {
                const cellCount = range.includes(':') ? 
                    (parseInt(range.split(':')[1].match(/\d+/)[0]) - parseInt(range.split(':')[0].match(/\d+/)[0]) + 1) : 1;
                console.log(`  • ${String(headerName).padEnd(20)} ${range.padEnd(15)} (${cellCount} formula${cellCount > 1 ? 's' : ''})`);
            });
        });
    }

    console.log('\n' + '='.repeat(80) + '\n');
}

// Helper: Get quick reference guide
getQuickReferenceGuide() {
    const numRows = this.workbook.data.length;
    const numCols = this.workbook.headers.length;
    const lastCol = this.workbook.columnToLetter(numCols - 1);

    return {
        dimensions: {
            rows: numRows,
            columns: numCols,
            lastColumn: lastCol,
            lastRow: numRows + 1
        },
        commonRanges: {
            allData: `A2:${lastCol}${numRows + 1}`,
            allWithHeaders: `A1:${lastCol}${numRows + 1}`,
            headers: `A1:${lastCol}1`,
            firstColumn: `A2:A${numRows + 1}`,
            lastColumn: `${lastCol}2:${lastCol}${numRows + 1}`
        },
        namedColumns: this.workbook.headers.map((header, index) => {
            const colLetter = this.workbook.columnToLetter(index);
            return {
                name: header,
                column: colLetter,
                headerCell: `${colLetter}1`,
                dataRange: `${colLetter}2:${colLetter}${numRows + 1}`,
                fullRange: `${colLetter}1:${colLetter}${numRows + 1}`
            };
        }),
        formulaCells: Object.keys(this.workbook.formulas)
    };
}

// Display quick reference at any time
displayQuickReference() {
    const ref = this.getQuickReferenceGuide();
    
    console.log('\n' + '='.repeat(80));
    console.log('QUICK REFERENCE GUIDE');
    console.log('='.repeat(80));
    
    console.log(`\nDimensions: ${ref.dimensions.rows} rows × ${ref.dimensions.columns} columns`);
    console.log(`Last Column: ${ref.dimensions.lastColumn} | Last Row: ${ref.dimensions.lastRow}`);
    
    console.log('\n📌 Common Ranges:');
    Object.entries(ref.commonRanges).forEach(([name, range]) => {
        console.log(`  • ${name.padEnd(20)}: ${range}`);
    });
    
    console.log('\n📋 Named Columns:');
    ref.namedColumns.forEach(col => {
        console.log(`  • ${col.name.padEnd(20)}: Data=${col.dataRange} | Full=${col.fullRange}`);
    });
    
    if (ref.formulaCells.length > 0) {
        console.log(`\n✨ Formula Cells: ${ref.formulaCells.join(', ')}`);
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
}
 


// UPDATED: Step 3 - Show formulas (add preview)
async step3_ShowFormulas() {
    this.currentStep = 3;
    this.displaySection('Step 3 & 4: Available Formulas & Smart Suggestions');

    // Show data preview first
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

// UPDATED: After applying each formula (in configureAndApplyFormula)
async configureAndApplyFormula(formulaKey) {
    const formula = SpreadsheetFormulaRegistry.getFormula(formulaKey);

    console.log(`\n\nConfiguring: ${formula.name}`);
    console.log(`Description: ${formula.description}`);
    console.log(`Excel Formula: ${formula.excelFormula}\n`);

    // Show current data state
    console.log('Current Data State:');
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

        // Show updated data preview after applying formula
        console.log('\n📊 Updated Data:');
        this.displayDataPreview();

    } catch (error) {
        console.log(`\n✗ Error: ${error.message}`);
    }

    await this.question('\nPress Enter to continue...');
}

// UPDATED: Step 5 - Apply formulas (show preview when user returns to menu)
async step5_ApplyFormulas() {
    this.currentStep = 5;

    let continueApplying = true;

    while (continueApplying) {
        this.displaySection('Step 5: Apply Formulas to Your Data');

        // Show current state before choosing
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
    
    // Final preview before moving on
    console.log('\n📊 Final Data State:');
    this.displayDataPreview();
    
    await this.question('Press Enter to continue to charts...');
}

// UPDATED: Step 7 - Summary statistics (show preview)
async step7_SummaryStatistics() {
    this.currentStep = 7;
    this.displaySection('Step 7: Calculate Summary Statistics');

    // Show current data state
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

    // Show updated preview after statistics
    console.log('\n📊 Updated Data with Statistics:');
    this.displayDataPreview();

    await this.question('\nPress Enter to continue to additional options...');
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

    // Configure and apply formula
 
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

        // Get data for chart
        const chartData = await this.getChartDataInteractive(chartKey);

        if (!chartData) {
            console.log('Chart creation cancelled.');
            return;
        }

        // Optional: Get custom options
        const customizeOptions = await this.question('Customize chart options? (y/n, default: n): ');
        let options = {};

        if (customizeOptions.toLowerCase() === 'y') {
            const heightStr = await this.question('Chart height in pixels (default: 400): ');
            const widthStr = await this.question('Chart width in pixels (default: 600): ');

            if (heightStr) options.height = parseInt(heightStr);
            if (widthStr) options.width = parseInt(widthStr);
        }

        // Create chart
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

            // Handle series specially - split by comma and parse each range
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

    // NEW: Step 6.5 - Create Anatomical Diagrams
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
            console.log('  Q. Skip to summary statistics\n');

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
        await this.question('Press Enter to continue to summary statistics...');
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
        const categoryIndex = parseInt(categoryChoice) - 1;

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

        // Get options for specific diagrams
        let options = {};

        // Heart anatomy chamber selection
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

        // Skeletal system bone selection
        if (['skull', 'femur', 'ribcage', 'spine'].includes(diagramKey)) {
            options.bone = diagramKey;
            
            const showLabels = await this.question('Show labels? (y/n, default: y): ');
            options.showLabels = showLabels.toLowerCase() !== 'n';
        }

        // Generic customization
        const customizeOptions = await this.question('Customize diagram size? (y/n, default: n): ');
        
        if (customizeOptions.toLowerCase() === 'y') {
            const heightStr = await this.question('Diagram height in pixels (default: 600-800): ');
            const widthStr = await this.question('Diagram width in pixels (default: 600-800): ');

            if (heightStr) options.height = parseInt(heightStr);
            if (widthStr) options.width = parseInt(widthStr);
        }

        // Create anatomical diagram
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

    // Step 7: Summary statistics
 
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
            console.log('  4. Generate comprehensive report');
            console.log('  5. View data statistics');
            console.log('  6. Search formulas, charts, or diagrams');
            console.log('  7. Export workbook (PNG/Excel)');
            console.log('  8. View session summary');
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
                    await this.generateReport();
                    break;
                case '5':
                    await this.viewStatistics();
                    break;
                case '6':
                    await this.searchItems();
                    break;
                case '7':
                    await this.exportWorkbook();
                    continueOptions = false;
                    break;
                case '8':
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

    // NEW: View anatomical diagram documentation
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

    // Generate report
    async generateReport() {
        console.log('\nGenerating comprehensive report...\n');

        const report = this.workbook.generateCombinedReport();

        console.log('WORKBOOK REPORT');
        console.log('='.repeat(80));
        console.log(`\nSheet: ${report.metadata.sheetName}`);
        console.log(`Author: ${report.metadata.author}`);
        console.log(`Created: ${report.metadata.created.toLocaleString()}`);
        console.log(`Last Modified: ${report.metadata.lastModified.toLocaleString()}`);
        console.log(`\nDimensions: ${report.metadata.rowCount} rows × ${report.metadata.columnCount} columns`);
        console.log(`Total Cells: ${report.summary.totalCells}`);
        console.log(`Formula Cells: ${report.summary.formulaCells}`);
        console.log(`Calculated Cells: ${report.summary.calculatedCells}`);
        console.log(`\nVisualizations:`);
        console.log(`  Charts: ${report.visualizations.charts}`);
        console.log(`  Anatomical Diagrams: ${report.visualizations.anatomicalDiagrams}`);
        console.log(`  Total: ${report.visualizations.total}`);

        if (Object.keys(report.statistics).length > 0) {
            console.log('\nColumn Statistics:');
            Object.entries(report.statistics).forEach(([col, stats]) => {
                console.log(`\n  ${col}:`);
                console.log(`    Count: ${stats.count}`);
                console.log(`    Sum: ${stats.sum.toFixed(2)}`);
                console.log(`    Average: ${stats.average.toFixed(2)}`);
                console.log(`    Range: ${stats.min.toFixed(2)} - ${stats.max.toFixed(2)}`);
            });
        }

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

    // Search formulas, charts, or diagrams
    async searchItems() {
        console.log('\nSearch Options:\n');
        console.log('  1. Search formulas');
        console.log('  2. Search charts');
        console.log('  3. Search anatomical diagrams');
        console.log('  4. Back\n');

        const choice = await this.question('Choose option: ');

        if (choice === '1') {
            await this.searchFormulas();
        } else if (choice === '2') {
            await this.searchCharts();
        } else if (choice === '3') {
            await this.searchAnatomicalDiagrams();
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

    // UPDATED: Export workbook with anatomical diagrams
    async exportWorkbook() {
        this.displaySection('Export Workbook');

        const hasCharts = this.workbook.charts.length > 0;
        const hasDiagrams = this.workbook.anatomicalDiagrams.length > 0;
        const hasVisualizations = hasCharts || hasDiagrams;

        console.log('Choose export format:\n');
        console.log('  1. PNG image (spreadsheet only)');
        console.log('  2. PNG image (spreadsheet + embedded charts)');
        console.log('  3. PNG image (spreadsheet + embedded anatomical diagrams)');
        console.log('  4. PNG image (spreadsheet + all visualizations)');
        console.log('  5. Excel file (.xlsx, no visualizations)');
        console.log('  6. Excel file (.xlsx + embedded charts)');
        console.log('  7. Excel file (.xlsx + embedded anatomical diagrams)');
        console.log('  8. Excel file (.xlsx + all embedded visualizations)');
        console.log('  9. Separate chart PNG files');
        console.log(' 10. Separate anatomical diagram PNG files');
        console.log(' 11. All separate visualization files');
        console.log(' 12. Complete package (all formats)\n');

        if (hasCharts) {
            console.log(`Note: Your workbook contains ${this.workbook.charts.length} chart(s)`);
        }
        if (hasDiagrams) {
            console.log(`Note: Your workbook contains ${this.workbook.anatomicalDiagrams.length} anatomical diagram(s)`);
        }
        console.log('');

        const choice = await this.question('Choose option (1-12): ');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const baseName = `workbook_${timestamp}`;

        try {
            if (choice === '1') {
                // PNG spreadsheet only
                const pngFile = `${baseName}.png`;
                this.workbook.exportToPNG(pngFile, { 
                    includeCharts: false, 
                    includeAnatomicalDiagrams: false 
                });
                console.log(`✓ PNG exported: ${pngFile}`);
                this.sessionData.exportFormats.push('PNG (Spreadsheet Only)');

            } else if (choice === '2') {
                // PNG spreadsheet with embedded charts
                if (!hasCharts) {
                    console.log('⚠ No charts created yet. Exporting spreadsheet only.');
                    const pngFile = `${baseName}.png`;
                    this.workbook.exportToPNG(pngFile, { 
                        includeCharts: false, 
                        includeAnatomicalDiagrams: false 
                    });
                    console.log(`✓ PNG exported: ${pngFile}`);
                } else {
                    const pngFile = `${baseName}_with_charts.png`;
                    this.workbook.exportToPNG(pngFile, { 
                        includeCharts: true, 
                        includeAnatomicalDiagrams: false 
                    });
                    console.log(`✓ PNG with ${this.workbook.charts.length} chart(s) exported: ${pngFile}`);
                    this.sessionData.exportFormats.push(`PNG (Spreadsheet + ${this.workbook.charts.length} Charts)`);
                }

            } else if (choice === '3') {
                // PNG spreadsheet with embedded anatomical diagrams
                if (!hasDiagrams) {
                    console.log('⚠ No anatomical diagrams created yet. Exporting spreadsheet only.');
                    const pngFile = `${baseName}.png`;
                    this.workbook.exportToPNG(pngFile, { 
                        includeCharts: false, 
                        includeAnatomicalDiagrams: false 
                    });
                    console.log(`✓ PNG exported: ${pngFile}`);
                } else {
                    const pngFile = `${baseName}_with_diagrams.png`;
                    this.workbook.exportToPNG(pngFile, { 
                        includeCharts: false, 
                        includeAnatomicalDiagrams: true 
                    });
                    console.log(`✓ PNG with ${this.workbook.anatomicalDiagrams.length} anatomical diagram(s) exported: ${pngFile}`);
                    this.sessionData.exportFormats.push(`PNG (Spreadsheet + ${this.workbook.anatomicalDiagrams.length} Diagrams)`);
                }

            } else if (choice === '4') {
                // PNG spreadsheet with all visualizations
                if (!hasVisualizations) {
                    console.log('⚠ No visualizations created yet. Exporting spreadsheet only.');
                    const pngFile = `${baseName}.png`;
                    this.workbook.exportToPNG(pngFile, { 
                        includeCharts: false, 
                        includeAnatomicalDiagrams: false 
                    });
                    console.log(`✓ PNG exported: ${pngFile}`);
                } else {
                    const pngFile = `${baseName}_with_all_visualizations.png`;
                    this.workbook.exportToPNG(pngFile, { 
                        includeCharts: hasCharts, 
                        includeAnatomicalDiagrams: hasDiagrams 
                    });
                    console.log(`✓ PNG with ${this.workbook.charts.length} chart(s) and ${this.workbook.anatomicalDiagrams.length} diagram(s) exported: ${pngFile}`);
                    this.sessionData.exportFormats.push(`PNG (Spreadsheet + All Visualizations)`);
                }

            } else if (choice === '5') {
                // Excel without visualizations
                const xlsxFile = `${baseName}.xlsx`;
                await this.workbook.exportToExcel(xlsxFile, { 
                    includeCharts: false, 
                    includeAnatomicalDiagrams: false 
                });
                console.log(`✓ Excel exported: ${xlsxFile}`);
                this.sessionData.exportFormats.push('XLSX (No Visualizations)');

            } else if (choice === '6') {
                // Excel with embedded charts
                if (!hasCharts) {
                    console.log('⚠ No charts created yet. Exporting Excel without visualizations.');
                    const xlsxFile = `${baseName}.xlsx`;
                    await this.workbook.exportToExcel(xlsxFile, { 
                        includeCharts: false, 
                        includeAnatomicalDiagrams: false 
                    });
                    console.log(`✓ Excel exported: ${xlsxFile}`);
                } else {
                    const xlsxFile = `${baseName}_with_charts.xlsx`;
                    await this.workbook.exportToExcel(xlsxFile, { 
                        includeCharts: true, 
                        includeAnatomicalDiagrams: false 
                    });
                    console.log(`✓ Excel with ${this.workbook.charts.length} chart(s) exported: ${xlsxFile}`);
                    this.sessionData.exportFormats.push(`XLSX (With ${this.workbook.charts.length} Charts)`);
                }

            } else if (choice === '7') {
                // Excel with embedded anatomical diagrams
                if (!hasDiagrams) {
                    console.log('⚠ No anatomical diagrams created yet. Exporting Excel without visualizations.');
                    const xlsxFile = `${baseName}.xlsx`;
                    await this.workbook.exportToExcel(xlsxFile, { 
                        includeCharts: false, 
                        includeAnatomicalDiagrams: false 
                    });
                    console.log(`✓ Excel exported: ${xlsxFile}`);
                } else {
                    const xlsxFile = `${baseName}_with_diagrams.xlsx`;
                    await this.workbook.exportToExcel(xlsxFile, { 
                        includeCharts: false, 
                        includeAnatomicalDiagrams: true 
                    });
                    console.log(`✓ Excel with ${this.workbook.anatomicalDiagrams.length} anatomical diagram(s) exported: ${xlsxFile}`);
                    this.sessionData.exportFormats.push(`XLSX (With ${this.workbook.anatomicalDiagrams.length} Diagrams)`);
                }

            } else if (choice === '8') {
                // Excel with all embedded visualizations
                if (!hasVisualizations) {
                    console.log('⚠ No visualizations created yet. Exporting Excel without visualizations.');
                    const xlsxFile = `${baseName}.xlsx`;
                    await this.workbook.exportToExcel(xlsxFile, { 
                        includeCharts: false, 
                        includeAnatomicalDiagrams: false 
                    });
                    console.log(`✓ Excel exported: ${xlsxFile}`);
                } else {
                    const xlsxFile = `${baseName}_with_all_visualizations.xlsx`;
                    await this.workbook.exportToExcel(xlsxFile, { 
                        includeCharts: hasCharts, 
                        includeAnatomicalDiagrams: hasDiagrams 
                    });
                    console.log(`✓ Excel with ${this.workbook.charts.length} chart(s) and ${this.workbook.anatomicalDiagrams.length} diagram(s) exported: ${xlsxFile}`);
                    this.sessionData.exportFormats.push(`XLSX (With All Visualizations)`);
                }

            } else if (choice === '9') {
                // Separate chart files
                if (!hasCharts) {
                    console.log('⚠ No charts created yet.');
                } else {
                    console.log('\nRendering charts to separate PNG files...');
                    const chartResults = this.workbook.renderAllCharts();
                    const successful = chartResults.filter(r => !r.error).length;
                    console.log(`✓ ${successful} chart(s) rendered to PNG`);
                    this.sessionData.exportFormats.push(`Charts (${successful} files)`);
                }

            } else if (choice === '10') {
                // Separate anatomical diagram files
                if (!hasDiagrams) {
                    console.log('⚠ No anatomical diagrams created yet.');
                } else {
                    console.log('\nRendering anatomical diagrams to separate PNG files...');
                    const diagramResults = this.workbook.renderAllAnatomicalDiagrams();
                    const successful = diagramResults.filter(r => !r.error).length;
                    console.log(`✓ ${successful} anatomical diagram(s) rendered to PNG`);
                    this.sessionData.exportFormats.push(`Anatomical Diagrams (${successful} files)`);
                }

            } else if (choice === '11') {
                // All separate visualization files
                let totalSuccessful = 0;
                
                if (hasCharts) {
                    console.log('\nRendering charts...');
                    const chartResults = this.workbook.renderAllCharts();
                    const chartSuccess = chartResults.filter(r => !r.error).length;
                    console.log(`✓ ${chartSuccess} chart(s) rendered to PNG`);
                    totalSuccessful += chartSuccess;
                }
                
                if (hasDiagrams) {
                    console.log('\nRendering anatomical diagrams...');
                    const diagramResults = this.workbook.renderAllAnatomicalDiagrams();
                    const diagramSuccess = diagramResults.filter(r => !r.error).length;
                    console.log(`✓ ${diagramSuccess} anatomical diagram(s) rendered to PNG`);
                    totalSuccessful += diagramSuccess;
                }
                
                if (totalSuccessful > 0) {
                    this.sessionData.exportFormats.push(`All Visualizations (${totalSuccessful} files)`);
                } else {
                    console.log('⚠ No visualizations created yet.');
                }

            } else if (choice === '12') {
                // Complete package
                console.log('\nCreating complete export package...\n');

                // 1. Spreadsheet PNG (with all visualizations if available)
                const pngFile = hasVisualizations
                    ? `${baseName}_with_all_visualizations.png`
                    : `${baseName}.png`;
                this.workbook.exportToPNG(pngFile, {
                    includeCharts: hasCharts,
                    includeAnatomicalDiagrams: hasDiagrams
                });
                console.log(`✓ PNG exported: ${pngFile}`);

                // 2. Excel file (with all visualizations if available)
                const xlsxFile = hasVisualizations
                    ? `${baseName}_with_all_visualizations.xlsx`
                    : `${baseName}.xlsx`;
                await this.workbook.exportToExcel(xlsxFile, {
                    includeCharts: hasCharts,
                    includeAnatomicalDiagrams: hasDiagrams
                });
                console.log(`✓ Excel exported: ${xlsxFile}`);

                // 3. Separate chart files
                if (hasCharts) {
                    console.log('\nRendering charts...');
                    const chartResults = this.workbook.renderAllCharts();
                    const chartSuccess = chartResults.filter(r => !r.error).length;
                    console.log(`✓ ${chartSuccess} chart(s) rendered to separate PNG files`);
                }

                // 4. Separate anatomical diagram files
                if (hasDiagrams) {
                    console.log('\nRendering anatomical diagrams...');
                    const diagramResults = this.workbook.renderAllAnatomicalDiagrams();
                    const diagramSuccess = diagramResults.filter(r => !r.error).length;
                    console.log(`✓ ${diagramSuccess} anatomical diagram(s) rendered to separate PNG files`);
                }

                this.sessionData.exportFormats.push('Complete Package');
            } else {
                console.log('Invalid choice. No export performed.');
                return;
            }

            console.log('\n✓ Export completed successfully!');

            // Show what was exported
            if (hasCharts || hasDiagrams) {
                console.log(`\nYour workbook contains:`);
                if (hasCharts) console.log(`  • ${this.workbook.charts.length} chart(s)`);
                if (hasDiagrams) console.log(`  • ${this.workbook.anatomicalDiagrams.length} anatomical diagram(s)`);
            }

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

        if (this.sessionData.exportFormats.length > 0) {
            console.log(`\nExported Formats: ${this.sessionData.exportFormats.join(', ')}`);
        }

        console.log(`\nTotal Visualizations: ${this.sessionData.chartsAdded.length + this.sessionData.anatomicalDiagramsAdded.length}`);

        await this.question('\nPress Enter to continue...');
    }

    // Main run method
    async run() {
        try {
            await this.welcome();
            await this.step1_CreateWorkbook();
            await this.step2_LoadData();
            await this.step3_ShowFormulas();
            await this.step5_ApplyFormulas();
            await this.step6_CreateCharts();
            await this.step6_5_CreateAnatomicalDiagrams();
            await this.step7_SummaryStatistics();
            await this.additionalOptions();

            this.displayHeader('Session Complete');
            console.log('Thank you for using the Excel Workbook Interactive Tool!\n');
            await this.viewSessionSummary();

            console.log('\n✓ All operations completed successfully!');
            console.log('Your files have been saved to the current directory.\n');

        } catch (error) {
            console.error('\nError during session:', error.message);
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
