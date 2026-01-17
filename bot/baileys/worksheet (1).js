
exportToPNG(filename = 'spreadsheet.png', options = {}) {
    const {
        includeCharts = false,
        includeAnatomicalDiagrams = false,
        includeCrossSectionDiagrams = false,
        includeStereochemistryDiagrams = false,
        includeGeometricShapes = false,
        includeGraphs = false,
        chartIndices = [],
        anatomicalIndices = [],
        crossSectionIndices = [],
        stereochemistryIndices = [],
        geometricIndices = [],
        graphIndices = []
    } = options;

    let totalHeight = this.height;
    const visualizationsToRender = {
        charts: [],
        anatomical: [],
        crossSection: [],
        stereochemistry: [],
        geometric: [],
        graphs: []
    };

    // Collect charts
    if (includeCharts && this.charts.length > 0) {
        const selectedCharts = chartIndices.length > 0
            ? chartIndices.map(i => this.charts[i]).filter(Boolean)
            : this.charts;
        visualizationsToRender.charts = selectedCharts;
    }

    // Collect anatomical diagrams
    if (includeAnatomicalDiagrams && this.anatomicalDiagrams.length > 0) {
        const selectedDiagrams = anatomicalIndices.length > 0
            ? anatomicalIndices.map(i => this.anatomicalDiagrams[i]).filter(Boolean)
            : this.anatomicalDiagrams;
        visualizationsToRender.anatomical = selectedDiagrams;
    }

    // Collect cross-section diagrams
    if (includeCrossSectionDiagrams && this.crossSectionDiagrams.length > 0) {
        const selectedCrossSections = crossSectionIndices.length > 0
            ? crossSectionIndices.map(i => this.crossSectionDiagrams[i]).filter(Boolean)
            : this.crossSectionDiagrams;
        visualizationsToRender.crossSection = selectedCrossSections;
    }

    // Collect stereochemistry diagrams
    if (includeStereochemistryDiagrams && this.stereochemistryDiagrams.length > 0) {
        const selectedStereochem = stereochemistryIndices.length > 0
            ? stereochemistryIndices.map(i => this.stereochemistryDiagrams[i]).filter(Boolean)
            : this.stereochemistryDiagrams;
        visualizationsToRender.stereochemistry = selectedStereochem;
    }

    // Collect geometric shapes
    if (includeGeometricShapes && this.geometricShapes.length > 0) {
        const selectedGeometric = geometricIndices.length > 0
            ? geometricIndices.map(i => this.geometricShapes[i]).filter(Boolean)
            : this.geometricShapes;
        visualizationsToRender.geometric = selectedGeometric;
    }

    // Collect graphs
    if (includeGraphs && this.graphs.length > 0) {
        const selectedGraphs = graphIndices.length > 0
            ? graphIndices.map(i => this.graphs[i]).filter(Boolean)
            : this.graphs;
        visualizationsToRender.graphs = selectedGraphs;
    }

    // Calculate additional height needed
    const totalVisualizations =
        visualizationsToRender.charts.length +
        visualizationsToRender.anatomical.length +
        visualizationsToRender.crossSection.length +
        visualizationsToRender.stereochemistry.length +
        visualizationsToRender.geometric.length +
        visualizationsToRender.graphs.length;

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

// Update renderVisualizationsToCanvas to include graphs:
renderVisualizationsToCanvas(ctx, visualizations) {
    const {
        charts = [],
        anatomical = [],
        crossSection = [],
        stereochemistry = [],
        geometric = [],
        graphs = []
    } = visualizations;

    const allVisualizations = [
        ...charts.map(c => ({ type: 'chart', data: c, icon: '📊' })),
        ...anatomical.map(d => ({ type: 'anatomical', data: d, icon: '🫀' })),
        ...crossSection.map(d => ({ type: 'crossSection', data: d, icon: '🔬' })),
        ...stereochemistry.map(d => ({ type: 'stereochemistry', data: d, icon: '🧪' })),
        ...geometric.map(d => ({ type: 'geometric', data: d, icon: '📐' })),
        ...graphs.map(d => ({ type: 'graph', data: d, icon: '📈' }))
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
    if (geometric.length > 0) summaryParts.push(`${geometric.length} Geometric Shape${geometric.length !== 1 ? 's' : ''}`);
    if (graphs.length > 0) summaryParts.push(`${graphs.length} Graph${graphs.length !== 1 ? 's' : ''}`);

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
            'stereochemistry': 'Molecular Structure',
            'geometric': 'Geometric Shape',
            'graph': 'Mathematical Graph'
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
                this.chartRenderer.renderChart(
                    tempCanvas,
                    tempCtx,
                    viz.data.key,
                    viz.data.data,
                    { ...viz.data.options, width: itemWidth, height: itemHeight }
                );
            } else if (viz.type === 'anatomical') {
                this.diagramRenderer.canvas = tempCanvas;
                this.diagramRenderer.ctx = tempCtx;
                this.renderSpecificAnatomicalDiagram(viz.data.key, {
                    ...viz.data.options,
                    width: itemWidth,
                    height: itemHeight
                });
            } else if (viz.type === 'crossSection') {
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
            } else if (viz.type === 'geometric') {
                this.geometricRenderer.canvas = tempCanvas;
                this.geometricRenderer.ctx = tempCtx;
                this.geometricRenderer.renderShape(
                    viz.data.key,
                    0,
                    0,
                    itemWidth,
                    itemHeight,
                    viz.data.config
                );
            } else if (viz.type === 'graph') {
                // Render mathematical graph
                this.graphRenderer.canvas = tempCanvas;
                this.graphRenderer.ctx = tempCtx;
                this.graphRenderer.renderGraph(
                    viz.data.key,
                    0,
                    0,
                    itemWidth,
                    itemHeight,
                    viz.data.config
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


// Update exportToExcel to include graphs:
async exportToExcel(filename = 'spreadsheet.xlsx', options = {}) {
    const {
        includeCharts = false,
        includeAnatomicalDiagrams = false,
        includeCrossSectionDiagrams = false,
        includeStereochemistryDiagrams = false,
        includeGeometricShapes = false,
        includeGraphs = false
    } = options;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = this.author;
    workbook.created = this.createdDate;
    workbook.modified = this.lastModified;
    workbook.lastPrinted = new Date();

    const worksheet = workbook.addWorksheet(this.sheetName);
    worksheet.properties.defaultRowHeight = 20;


  // ========== VISUALIZATIONS SHEET (All Types Including Graphs) ==========
    const hasVisualizations =
        (includeCharts && this.charts.length > 0) ||
        (includeAnatomicalDiagrams && this.anatomicalDiagrams.length > 0) ||
        (includeCrossSectionDiagrams && this.crossSectionDiagrams.length > 0) ||
        (includeStereochemistryDiagrams && this.stereochemistryDiagrams.length > 0) ||
        (includeGeometricShapes && this.geometricShapes.length > 0) ||
        (includeGraphs && this.graphs.length > 0);

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
                    'stereochemistry': 'FF9B59B6',
                    'geometric': 'FFFF9800',
                    'graph': 'FF2196F3'
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
                    const diagramWidth = diagramConfig.options.width || 800;
                    const diagramHeight = diagramConfig.options.height || 700;
                    const diagramCanvas = createCanvas(diagramWidth, diagramHeight);
                    const diagramCtx = diagramCanvas.getContext('2d');

                    this.diagramRenderer.canvas = diagramCanvas;
                    this.diagramRenderer.ctx = diagramCtx;

                    this.renderSpecificAnatomicalDiagram(diagramConfig.key, diagramConfig.options);

                    const diagramInfo = AnatomicalDiagramsRegistry.getDiagram(diagramConfig.key);

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

        // Add Geometric Shapes
        if (includeGeometricShapes && this.geometricShapes.length > 0) {
            console.log('\n📐 Adding Geometric Shapes to Excel...');

            const geometricHeaderCell = vizSheet.getCell(`A${currentRow}`);
            geometricHeaderCell.value = '📐 GEOMETRIC SHAPES';
            geometricHeaderCell.font = { bold: true, size: 14, color: { argb: 'FFFF9800' } };
            geometricHeaderCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFF3E0' }
            };
            vizSheet.getRow(currentRow).height = 30;
            currentRow += 2;

            for (let i = 0; i < this.geometricShapes.length; i++) {
                const shapeConfig = this.geometricShapes[i];

                try {
                    const shapeWidth = shapeConfig.options.width || 800;
                    const shapeHeight = shapeConfig.options.height || 600;
                    const shapeCanvas = createCanvas(shapeWidth, shapeHeight);
                    const shapeCtx = shapeCanvas.getContext('2d');

                    this.geometricRenderer.canvas = shapeCanvas;
                    this.geometricRenderer.ctx = shapeCtx;

                    this.geometricRenderer.renderShape(
                        shapeConfig.key,
                        0,
                        0,
                        shapeWidth,
                        shapeHeight,
                        shapeConfig.config
                    );

                    const shapeInfo = GeometricShapesRegistry.getShape(shapeConfig.key);

                    await addImageToExcel(
                        shapeCanvas,
                        `Shape ${i + 1}: ${shapeConfig.title}`,
                        'geometric',
                        i,
                        {
                            Type: shapeInfo.name,
                            Category: shapeInfo.category,
                            Dimensionality: shapeInfo.dimensionality
                        }
                    );

                } catch (error) {
                    console.error(`  ❌ Geometric Shape ${i + 1} rendering failed:`, error.message);
                }
            }

            currentRow += 2;
        }
        // Add Mathematical Graphs
        if (includeGraphs && this.graphs.length > 0) {
            console.log('\n📈 Adding Mathematical Graphs to Excel...');

            const graphsHeaderCell = vizSheet.getCell(`A${currentRow}`);
            graphsHeaderCell.value = '📈 MATHEMATICAL GRAPHS';
            graphsHeaderCell.font = { bold: true, size: 14, color: { argb: 'FF2196F3' } };
            graphsHeaderCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE3F2FD' }
            };
            vizSheet.getRow(currentRow).height = 30;
            currentRow += 2;

            for (let i = 0; i < this.graphs.length; i++) {
                const graphConfig = this.graphs[i];

                try {
                    const graphWidth = 1000;
                    const graphHeight = 800;
                    const graphCanvas = createCanvas(graphWidth, graphHeight);
                    const graphCtx = graphCanvas.getContext('2d');

                    this.graphRenderer.canvas = graphCanvas;
                    this.graphRenderer.ctx = graphCtx;

                    const graphData = this.graphRenderer.renderGraph(
                        graphConfig.key,
                        0,
                        0,
                        graphWidth,
                        graphHeight,
                        graphConfig.config
                    );

                    const graphInfo = GraphRegistry.getGraph(graphConfig.key);

                    const metadata = {
                        Type: graphInfo.name,
                        Category: graphInfo.category,
                        Equation: graphData.equation || graphInfo.equation,
                        'Data Points': graphConfig.config.points ? graphConfig.config.points.length : 0
                    };

                    if (graphData.rSquared !== undefined) {
                        metadata['R²'] = graphData.rSquared.toFixed(4);
                    }

                    if (graphData.slope !== undefined) {
                        metadata['Slope'] = graphData.slope.toFixed(4);
                    }

                    await addImageToExcel(
                        graphCanvas,
                        `Graph ${i + 1}: ${graphConfig.title}`,
                        'graph',
                        i,
                        metadata
                    );

                } catch (error) {
                    console.error(`  ❌ Graph ${i + 1} rendering failed:`, error.message);
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
            geometricShapes: includeGeometricShapes ? this.geometricShapes.length : 0,
            graphs: includeGraphs ? this.graphs.length : 0,
            total:
                (includeCharts ? this.charts.length : 0) +
                (includeAnatomicalDiagrams ? this.anatomicalDiagrams.length : 0) +
                (includeCrossSectionDiagrams ? this.crossSectionDiagrams.length : 0) +
                (includeStereochemistryDiagrams ? this.stereochemistryDiagrams.length : 0) +
                (includeGeometricShapes ? this.geometricShapes.length : 0) +
                (includeGraphs ? this.graphs.length : 0)
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
        geometricShapes: this.listGeometricShapes(),
        statistics: {
            anatomical: this.getAnatomicalDiagramStatistics(),
            crossSection: this.getCrossSectionDiagramStatistics(),
            stereochemistry: this.getStereochemistryDiagramStatistics(),
            geometric: this.getGeometricShapeStatistics()
        },
        visualizations: {
            charts: this.charts.length,
            anatomicalDiagrams: this.anatomicalDiagrams.length,
            crossSectionDiagrams: this.crossSectionDiagrams.length,
            stereochemistryDiagrams: this.stereochemistryDiagrams.length,
            geometricShapes: this.geometricShapes.length,
            total:
                this.charts.length +
                this.anatomicalDiagrams.length +
                this.crossSectionDiagrams.length +
                this.stereochemistryDiagrams.length +
                this.geometricShapes.length
        }
    };
}

/**
     * Export statistical report to file
     */
    async exportStatisticalReport(columnRef, filename, options = {}) {
        const report = this.generateStatisticalReport(columnRef, options);
        const stats = this.getStatisticalWorkbook();

        const {
            outputFormat = 'both',
            includeVisualizations = true
        } = options;

        const results = {};

        if (outputFormat === 'png' || outputFormat === 'both') {
            const pngFilename = `${filename}.png`;
            
            if (includeVisualizations) {
                // Export with visualizations
                await stats.generateXLSXWithImages(pngFilename);
            } else {
                // Export spreadsheet only
                stats.exportToPNG(pngFilename);
            }

            results.png = pngFilename;
            console.log(`✓ PNG report saved: ${pngFilename}`);
        }

        if (outputFormat === 'excel' || outputFormat === 'both') {
            const excelFilename = `${filename}.xlsx`;
            await stats.generateXLSXWithImages(excelFilename);
            results.excel = excelFilename;
            console.log(`✓ Excel report saved: ${excelFilename}`);
        }

        return {
            report: report,
            files: results
        };
    }


   /**
     * Generate complete statistical workbook
     */
    async generateStatisticalWorkbook(columnRef, distributionType, filename, options = {}) {
        console.log('\n📊 GENERATING STATISTICAL WORKBOOK');
        console.log('='.repeat(70));

        const report = this.generateStatisticalReport(columnRef, {
            ...options,
            distributionType: distributionType,
            includeVisualizations: true
        });

        const stats = this.getStatisticalWorkbook();

        // Export to Excel with images
        const excelFilename = `${filename}.xlsx`;
        await stats.generateXLSXWithImages(excelFilename);

        console.log(`\n✓ Statistical Workbook Generated`);
        console.log(`  File: ${excelFilename}`);
        console.log(`  Sheets: Multiple`);
        console.log(`  Visualizations: ${Object.keys(stats.visualizations || {}).length}`);

        return {
            filename: excelFilename,
            report: report,
            visualizations: stats.visualizations
        };
    }

 /**
     * Export all statistical analyses
     */
    async exportAllStatisticalAnalyses(outputDir) {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        console.log('\n📊 EXPORTING ALL STATISTICAL ANALYSES');
        console.log('='.repeat(70));

        const exports = [];

        // Export each report
        for (let i = 0; i < this.statisticalReports.length; i++) {
            const report = this.statisticalReports[i];
            const filename = `${outputDir}/statistical_report_${i + 1}_${report.columnName}`;

            try {
                const stats = new EnhancedStatisticalWorkbook();
                stats.currentWorkbook = report.workbook;
                stats.visualizations = report.visualizations;

                await stats.generateXLSXWithImages(`${filename}.xlsx`);
                exports.push({
                    success: true,
                    filename: `${filename}.xlsx`,
                    report: report.columnName
                });

                console.log(`✓ Exported: ${report.columnName}`);
            } catch (error) {
                console.error(`✗ Failed: ${report.columnName} - ${error.message}`);
                exports.push({
                    success: false,
                    error: error.message,
                    report: report.columnName
                });
            }
        }

        console.log(`\n✓ Export Complete: ${exports.filter(e => e.success).length}/${exports.length} successful`);

        return {
            outputDirectory: outputDir,
            exports: exports,
            successCount: exports.filter(e => e.success).length,
            totalCount: exports.length
        };
    }




// ============================================================================
// UPDATED generateReport() - WITH GRAPHS
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
                geometric: {
                    count: this.geometricShapes.length,
                    types: [...new Set(this.geometricShapes.map(d => d.key))],
                    dimensionalities: [...new Set(this.geometricShapes.map(d => d.dimensionality))]
                },
                graphs: {
                    count: this.graphs.length,
                    types: [...new Set(this.graphs.map(g => g.key))],
                    categories: [...new Set(this.graphs.map(g => g.category))]
                },
                total:
                    this.anatomicalDiagrams.length +
                    this.crossSectionDiagrams.length +
                    this.stereochemistryDiagrams.length +
                    this.geometricShapes.length +
                    this.graphs.length
            }
        },
        history: {
            entries: this.history.length,
            recentActions: this.history.slice(-10)
        }
    };
}

// ============================================================================
// UPDATED exportSelectedVisualizations() - WITH GRAPHS
// ============================================================================

async exportSelectedVisualizations(baseFilename, options = {}) {
    const {
        format = 'both',
        includeCharts = false,
        includeAnatomicalDiagrams = false,
        includeCrossSectionDiagrams = false,
        includeStereochemistryDiagrams = false,
        includeGeometricShapes = false,
        includeGraphs = false,
        chartIndices = [],
        anatomicalIndices = [],
        crossSectionIndices = [],
        stereochemistryIndices = [],
        geometricIndices = [],
        graphIndices = []
    } = options;

    const exportOptions = {
        includeCharts,
        includeAnatomicalDiagrams,
        includeCrossSectionDiagrams,
        includeStereochemistryDiagrams,
        includeGeometricShapes,
        includeGraphs,
        chartIndices,
        anatomicalIndices,
        crossSectionIndices,
        stereochemistryIndices,
        geometricIndices,
        graphIndices
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

// ============================================================================
// UPDATED exportCompleteWorkbook() - WITH GRAPHS
// ============================================================================

async exportCompleteWorkbook(baseFilename = 'complete_workbook', format = 'both') {
    const results = {
        png: null,
        excel: null
    };

    const exportOptions = {
        includeCharts: true,
        includeAnatomicalDiagrams: true,
        includeCrossSectionDiagrams: true,
        includeStereochemistryDiagrams: true,
        includeGeometricShapes: true,
        includeGraphs: true
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
                geometricShapes: this.geometricShapes.length,
                graphs: this.graphs.length,
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

// ============================================================================
// UPDATED QUICK EXPORT METHODS - WITH GRAPHS
// ============================================================================

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

async exportWithGeometricShapes(filename = 'workbook_with_geometric') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeGeometricShapes: true
    });
}

async exportWithGraphs(filename = 'workbook_with_graphs') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeGraphs: true
    });
}

async exportWithAllDiagrams(filename = 'workbook_with_all_diagrams') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeAnatomicalDiagrams: true,
        includeCrossSectionDiagrams: true,
        includeStereochemistryDiagrams: true,
        includeGeometricShapes: true,
        includeGraphs: true
    });
}

async exportWithAllVisualizations(filename = 'workbook_complete') {
    return this.exportSelectedVisualizations(filename, {
        format: 'both',
        includeCharts: true,
        includeAnatomicalDiagrams: true,
        includeCrossSectionDiagrams: true,
        includeStereochemistryDiagrams: true,
        includeGeometricShapes: true,
        includeGraphs: true
    });
}

// ============================================================================
// UPDATED getVisualizationSummary() - WITH GRAPHS
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
        geometricShapes: {
            count: this.geometricShapes.length,
            shapes: this.geometricShapes.map(d => ({
                title: d.title,
                type: d.key,
                dimensionality: d.dimensionality
            }))
        },
        graphs: {
            count: this.graphs.length,
            graphs: this.graphs.map(g => ({
                title: g.title,
                type: g.key,
                category: g.category,
                pointCount: g.config.points ? g.config.points.length : 0
            }))
        },
        total:
            this.charts.length +
            this.anatomicalDiagrams.length +
            this.crossSectionDiagrams.length +
            this.stereochemistryDiagrams.length +
            this.geometricShapes.length +
            this.graphs.length
    };
}

// ============================================================================
// UPDATED hasAnyVisualizations() - WITH GRAPHS
// ============================================================================

hasAnyVisualizations() {
    return (
        this.charts.length > 0 ||
        this.anatomicalDiagrams.length > 0 ||
        this.crossSectionDiagrams.length > 0 ||
        this.stereochemistryDiagrams.length > 0 ||
        this.geometricShapes.length > 0 ||
        this.graphs.length > 0
    );
}

// ============================================================================
// UPDATED getVisualizationTypes() - WITH GRAPHS
// ============================================================================

getVisualizationTypes() {
    const types = [];
    if (this.charts.length > 0) types.push('charts');
    if (this.anatomicalDiagrams.length > 0) types.push('anatomical');
    if (this.crossSectionDiagrams.length > 0) types.push('crossSection');
    if (this.stereochemistryDiagrams.length > 0) types.push('stereochemistry');
    if (this.geometricShapes.length > 0) types.push('geometric');
    if (this.graphs.length > 0) types.push('graphs');
    return types;
}

// ============================================================================
// UPDATED exportAllVisualizationsSeparately() - WITH GRAPHS
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
        geometric: [],
        graphs: [],
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

    // Export geometric shapes
    for (let i = 0; i < this.geometricShapes.length; i++) {
        try {
            const shape = this.geometricShapes[i];
            const filename = `${folderPath}/geometric_${i + 1}_${shape.title.replace(/[^a-z0-9]/gi, '_')}.png`;

            const canvas = createCanvas(
                shape.options.width || 800,
                shape.options.height || 600
            );
            const ctx = canvas.getContext('2d');

            this.geometricRenderer.canvas = canvas;
            this.geometricRenderer.ctx = ctx;
            this.geometricRenderer.renderShape(
                shape.key,
                0,
                0,
                shape.options.width || 800,
                shape.options.height || 600,
                shape.config
            );

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            results.geometric.push({ success: true, filename, title: shape.title });
            console.log(`✓ Geometric Shape ${i + 1}: ${shape.title}`);
        } catch (error) {
            results.errors.push({ type: 'geometric', index: i, error: error.message });
            console.error(`✗ Geometric Shape ${i + 1} failed: ${error.message}`);
        }
    }

    // Export graphs
    for (let i = 0; i < this.graphs.length; i++) {
        try {
            const graph = this.graphs[i];
            const filename = `${folderPath}/graph_${i + 1}_${graph.title.replace(/[^a-z0-9]/gi, '_')}.png`;

            const canvas = createCanvas(1000, 800);
            const ctx = canvas.getContext('2d');

            this.graphRenderer.canvas = canvas;
            this.graphRenderer.ctx = ctx;

            const graphData = this.graphRenderer.renderGraph(
                graph.key,
                0,
                0,
                1000,
                800,
                graph.config
            );

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            results.graphs.push({ 
                success: true, 
                filename, 
                title: graph.title,
                equation: graphData.equation,
                rSquared: graphData.rSquared
            });
            console.log(`✓ Graph ${i + 1}: ${graph.title}`);
        } catch (error) {
            results.errors.push({ type: 'graph', index: i, error: error.message });
            console.error(`✗ Graph ${i + 1} failed: ${error.message}`);
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
            geometricExported: results.geometric.length,
            graphsExported: results.graphs.length,
            totalExported:
                results.charts.length +
                results.anatomical.length +
                results.crossSection.length +
                results.stereochemistry.length +
                results.geometric.length +
                results.graphs.length,
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
    GraphRegistry, 
    GraphRenderer,
    EnhancedStatisticalWorkbook,
    StatisticalDistributions,
    DistributionRegistry
};

export default EnhancedSpreadsheetWorkbook;
