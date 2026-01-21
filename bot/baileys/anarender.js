
// ============================================================================
// ANATOMICAL DIAGRAM RENDERER CLASS
// ============================================================================


class AnatomicalDiagramRenderer {
    constructor(canvas = null) {
        this.defaultFont = 'Arial, sans-serif';
        this.defaultFontSize = 12;
        this.canvas = canvas;
        this.ctx = canvas ? canvas.getContext('2d') : null;
        this.currentFrame = 0;
    }

    renderDiagram(diagramKey, x, y, width, height, options = {}) {
        const diagram = AnatomicalDiagramsRegistry.getDiagram(diagramKey);
        if (!diagram) {
            throw new Error(`Anatomical diagram '${diagramKey}' not found`);
        }

        const mergedOptions = { ...diagram.defaultOptions, ...options };
        
        this.ctx.save();
        this.ctx.translate(x, y);

        // Clear background
        this.ctx.fillStyle = mergedOptions.backgroundColor;
        this.ctx.fillRect(0, 0, width, height);

        // Title
        this.drawTitle(mergedOptions.title, width / 2, 30);

        // Route to specific renderer based on diagram key
        const centerX = width / 2;
        const centerY = height / 2 + 30;

        try {
            switch (diagramKey) {
                // ===== CELL BIOLOGY =====
                case 'animalCell':
                    this.renderAnimalCellDiagram(centerX, centerY, Math.min(width, height) * 0.7, mergedOptions);
                    break;
                case 'plantCell':
                    this.renderPlantCellDiagram(centerX, centerY, Math.min(width, height) * 0.7, mergedOptions);
                    break;
                case 'prokaryoticVsEukaryotic':
                    this.renderProkaryoticVsEukaryoticDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'cellMembrane':
                    this.renderCellMembraneDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'osmosisDiffusion':
                    this.renderOsmosisDiffusionDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'activePassiveTransport':
                    this.renderActivePassiveTransportDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'mitosis':
                    this.renderMitosisDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'meiosis':
                    this.renderMeiosisDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'organelles':
                    this.renderOrganellesDiagram(centerX, centerY, width * 0.7, height * 0.6, mergedOptions);
                    break;
                case 'cellCycle':
                    this.renderCellCycleDiagram(centerX, centerY, Math.min(width, height) * 0.6, mergedOptions);
                    break;
                case 'enzymeAction':
                    this.renderEnzymeActionDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;

                // ===== GENETICS & MOLECULAR BIOLOGY =====
                case 'dnaStructure':
                    this.renderDNAStructureDiagram(centerX, centerY, width * 0.5, height * 0.7, mergedOptions);
                    break;
                case 'rnaStructure':
                    this.renderRNAStructureDiagram(centerX, centerY, width * 0.6, height * 0.7, mergedOptions);
                    break;
                case 'dnaReplication':
                    this.renderDNAReplicationDiagram(centerX, centerY, width * 0.5, height * 0.7, mergedOptions);
                    break;
                case 'transcription':
                    this.renderTranscriptionDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'translation':
                    this.renderTranslationDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'codonChart':
                    this.renderCodonChartDiagram(centerX, centerY, Math.min(width, height) * 0.6, mergedOptions);
                    break;
                case 'geneExpression':
                    this.renderGeneExpressionDiagram(centerX, centerY, width * 0.8, height * 0.7, mergedOptions);
                    break;
                case 'punnettSquare':
                    this.renderPunnettSquareDiagram(centerX, centerY, Math.min(width, height) * 0.5, mergedOptions);
                    break;
                case 'chromosomes':
                    this.renderChromosomesDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'crossingOver':
                    this.renderCrossingOverDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'mutations':
                    this.renderMutationsDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'recombinantDNA':
                    this.renderRecombinantDNADiagram(centerX, centerY, width * 0.8, height * 0.7, mergedOptions);
                    break;
                case 'pcrCycle':
                    this.renderPCRCycleDiagram(centerX, centerY, width * 0.8, height * 0.7, mergedOptions);
                    break;

                // ===== EVOLUTION & NATURAL SELECTION =====
                case 'darwinsFinches':
                    this.renderDarwinsFinchesDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'naturalSelection':
                    this.renderNaturalSelectionDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'phylogeneticTree':
                    this.renderPhylogeneticTreeDiagram(centerX, centerY, width * 0.8, height * 0.7, mergedOptions);
                    break;
                case 'adaptiveRadiation':
                    this.renderAdaptiveRadiationDiagram(centerX, centerY, width * 0.8, height * 0.7, mergedOptions);
                    break;
                case 'fossilLayers':
                    this.renderFossilLayersDiagram(centerX, centerY, width * 0.6, height * 0.8, mergedOptions);
                    break;
                case 'hardyWeinberg':
                    this.renderHardyWeinbergDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'speciation':
                    this.renderSpeciationDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'comparativeAnatomy':
                    this.renderComparativeAnatomyDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;

                // ===== ECOLOGY =====
                case 'foodChain':
                    this.renderFoodChainDiagram(centerX, centerY, width * 0.5, height * 0.7, mergedOptions);
                    break;
                case 'foodWeb':
                    this.renderFoodWebDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'energyPyramid':
                    this.renderEnergyPyramidDiagram(centerX, centerY, width * 0.6, height * 0.6, mergedOptions);
                    break;
                case 'carbonCycle':
                    this.renderCarbonCycleDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'nitrogenCycle':
                    this.renderNitrogenCycleDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'waterCycle':
                    this.renderWaterCycleDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'populationGrowth':
                    this.renderPopulationGrowthDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'ecosystem':
                    this.renderEcosystemDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'biomes':
                    this.renderBiomesDiagram(centerX, centerY, width * 0.9, height * 0.6, mergedOptions);
                    break;
                case 'predatorPrey':
                    this.renderPredatorPreyDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;

                // ===== HUMAN ANATOMY & PHYSIOLOGY =====
                case 'skeletalSystem':
                    this.renderSkeletalSystemDiagram(centerX, centerY, width * 0.5, height * 0.85, mergedOptions);
                    break;
                case 'muscularSystem':
                    this.renderMuscularSystemDiagram(centerX, centerY, width * 0.5, height * 0.85, mergedOptions);
                    break;
                case 'digestiveSystem':
                    this.renderCompleteDigestiveSystemDiagram(centerX, centerY, width * 0.5, height * 0.8, mergedOptions);
                    break;
                case 'respiratorySystem':
                    this.renderRespiratorySystemDiagram(centerX, centerY, width * 0.5, height * 0.7, mergedOptions);
                    break;
                case 'circulatorySystem':
                    this.renderCirculatorySystemDiagram(centerX, centerY, width * 0.5, height * 0.7, mergedOptions);
                    break;
                case 'excretorySystem':
                    this.renderUrinarySystemDiagram(centerX, centerY, width * 0.5, height * 0.7, mergedOptions);
                    break;
                case 'nervousSystem':
                    this.renderCompleteNervousSystemDiagram(centerX, centerY, width * 0.5, height * 0.8, mergedOptions);
                    break;
                case 'neuronStructure':
                    this.renderNeuronDiagram(centerX, centerY, width * 0.5, height * 0.7, mergedOptions);
                    break;
                case 'synapse':
                    this.renderSynapseDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'endocrineSystem':
                    this.renderEndocrineSystemDiagram(centerX, centerY, width * 0.5, height * 0.8, mergedOptions);
                    break;
                case 'reproductiveSystem':
                    this.renderReproductiveSystemDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'immuneSystem':
                    this.renderImmuneSystemDiagram(centerX, centerY, width * 0.6, height * 0.8, mergedOptions);
                    break;
                case 'skinStructure':
                    this.renderSkinDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'eyeAnatomy':
                    this.renderEyeDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;

                // ===== PLANTS (BOTANY) =====
                case 'leafCrossSection':
                    this.renderLeafCrossSectionDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'photosynthesis':
                    this.renderPhotosynthesisDiagram(centerX, centerY, width * 0.7, height * 0.6, mergedOptions);
                    break;
                case 'stomata':
                    this.renderStomataDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'xylemPhloem':
                    this.renderXylemPhloemDiagram(centerX, centerY, width * 0.8, height * 0.7, mergedOptions);
                    break;
                case 'flowerStructure':
                    this.renderFlowerStructureDiagram(centerX, centerY, Math.min(width, height) * 0.6, mergedOptions);
                    break;
                case 'seedGermination':
                    this.renderSeedGerminationDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'tropisms':
                    this.renderTropismsDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;

                // ===== MICROBIOLOGY =====
                case 'bacteriaStructure':
                    this.renderBacterialCellDiagram(centerX, centerY, width * 0.6, height * 0.6, mergedOptions);
                    break;
                case 'virusStructure':
                    this.renderVirusStructureDiagram(centerX, centerY, Math.min(width, height) * 0.6, mergedOptions);
                    break;
                case 'fungalCell':
                    this.renderFungalCellDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'protists':
                    this.renderProtistsDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'bacterialGrowthCurve':
                    this.renderBacterialGrowthCurveDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'viralReplication':
                    this.renderViralReplicationDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'microscopy':
                    this.renderMicroscopyDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;

                // ===== BIOTECHNOLOGY =====
                case 'geneticEngineering':
                    this.renderGeneticEngineeringDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'gelElectrophoresis':
                    this.renderGelElectrophoresisDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'cloning':
                    this.renderCloningProcessDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'crispr':
                    this.renderCRISPRDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'bioreactor':
                    this.renderBioreactorDiagram(centerX, centerY, width * 0.6, height * 0.8, mergedOptions);
                    break;
                case 'gmoProduction':
                    this.renderGMOProductionDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;

                // ===== REPRODUCTION & DEVELOPMENT =====
                case 'fertilization':
                    this.renderFertilizationDiagram(centerX, centerY, width * 0.8, height * 0.7, mergedOptions);
                    break;
                case 'embryoDevelopment':
                    this.renderEmbryoDevelopmentDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'menstrualCycle':
                    this.renderMenstrualCycleDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'gametogenesis':
                    this.renderGametogenesisDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'placenta':
                    this.renderPlacentaDiagram(centerX, centerY, width * 0.8, height * 0.7, mergedOptions);
                    break;

                // ===== HEALTH, DISEASE & IMMUNOLOGY =====
                case 'immuneResponse':
                    this.renderImmuneResponseDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'antibodyStructure':
                    this.renderAntibodyStructureDiagram(centerX, centerY, Math.min(width, height) * 0.6, mergedOptions);
                    break;
                case 'pathogenTypes':
                    this.renderPathogenTypesDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'vaccination':
                    this.renderVaccinationDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'inflammation':
                    this.renderInflammationDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'diseaseTransmission':
                    this.renderDiseaseTransmissionDiagram(centerX, centerY, width * 0.8, height * 0.7, mergedOptions);
                    break;
                case 'bloodCells':
                    this.renderBloodCellsDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;

                // ===== CLASSIFICATION & TAXONOMY =====
                case 'fiveKingdoms':
                    this.renderFiveKingdomsDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'threeDomains':
                    this.renderThreeDomainsDiagram(centerX, centerY, width * 0.8, height * 0.7, mergedOptions);
                    break;
                case 'taxonomyHierarchy':
                    this.renderTaxonomyHierarchyDiagram(centerX, centerY, width * 0.6, height * 0.8, mergedOptions);
                    break;
                case 'dichotomousKey':
                    this.renderDichotomousKeyDiagram(centerX, centerY, width * 0.8, height * 0.7, mergedOptions);
                    break;
                case 'cladogram':
                    this.renderCladogramDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;

                // ===== HOMEOSTASIS & REGULATION =====
                case 'negativeFeedback':
                    this.renderNegativeFeedbackDiagram(centerX, centerY, Math.min(width, height) * 0.6, mergedOptions);
                    break;
                case 'thermoregulation':
                    this.renderThermoregulationDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'bloodGlucoseRegulation':
                    this.renderBloodGlucoseRegulationDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'waterBalance':
                    this.renderWaterBalanceDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'nephron':
                    this.renderNephronDiagram(centerX, centerY, width * 0.6, height * 0.8, mergedOptions);
                    break;

                // ===== ENERGY IN LIVING SYSTEMS =====
                case 'atpStructure':
                    this.renderATPStructureDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'cellularRespiration':
                    this.renderCellularRespirationDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;
                case 'mitochondrion':
                    this.renderMitochondrionDiagram(centerX, centerY, width * 0.7, height * 0.6, mergedOptions);
                    break;
                case 'electronTransportChain':
                    this.renderElectronTransportChainDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'chloroplastStructure':
                    this.renderChloroplastStructureDiagram(centerX, centerY, width * 0.7, height * 0.6, mergedOptions);
                    break;
                case 'photosynthesisDetailed':
                    this.renderPhotosynthesisDetailedDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;

                // ===== DNA TECHNOLOGY & FORENSICS =====
                case 'dnaFingerprinting':
                    this.renderDNAFingerprintingDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'gelElectrophoresisForensic':
                    this.renderGelElectrophoresisForensicDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'strAnalysis':
                    this.renderSTRAnalysisDiagram(centerX, centerY, width * 0.85, height * 0.6, mergedOptions);
                    break;
                case 'forensicComparison':
                    this.renderForensicDNAComparisonDiagram(centerX, centerY, width * 0.85, height * 0.7, mergedOptions);
                    break;

                // ===== EXISTING CARDIOVASCULAR, ETC. =====
                case 'heartAnatomy':
                    this.renderHeartAnatomyDiagram(0, 0, width, height, mergedOptions);
                    break;
                case 'bloodVesselComparison':
                    this.renderBloodVesselComparison(centerX, centerY, width * 0.7, height * 0.4, mergedOptions);
                    break;
                case 'heartValves':
                    this.renderHeartValvesDiagram(centerX, centerY, width * 0.8, height * 0.5, mergedOptions);
                    break;
                case 'digestiveOrgans':
                    this.renderDigestiveOrganComparison(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'brain':
                    this.renderBrainDiagram(centerX, centerY, width * 0.5, height * 0.7, mergedOptions);
                    break;
                case 'liver':
                    this.renderLiverDiagram(centerX, centerY, width * 0.6, height * 0.6, mergedOptions);
                    break;
                case 'kidney':
                    this.renderKidneyDiagram(centerX, centerY, width * 0.5, height * 0.7, mergedOptions);
                    break;
                case 'kidneyDetail':
                    this.renderKidneyDetailDiagram(centerX, centerY, width * 0.7, height * 0.7, mergedOptions);
                    break;
                case 'eyeAnatomy':
                    this.renderEyeDiagram(centerX, centerY, width * 0.7, height * 0.6, mergedOptions);
                    break;
                case 'skull':
                    this.renderSkullDiagram(centerX, centerY, width * 0.4, height * 0.6, mergedOptions);
                    break;
                case 'femur':
                    this.renderFemurDiagram(centerX, centerY, width * 0.3, height * 0.7, mergedOptions);
                    break;
                case 'ribcage':
                    this.renderRibcageDiagram(centerX, centerY, width * 0.5, height * 0.7, mergedOptions);
                    break;
                case 'spine':
                    this.renderSpineDiagram(centerX, centerY, width * 0.3, height * 0.8, mergedOptions);
                    break;
                case 'boneStructure':
                    this.renderBoneStructureDiagram(centerX, centerY, width * 0.7, height * 0.6, mergedOptions);
                    break;
                case 'skeletalMuscle':
                    this.renderSkeletalMuscleDiagram(centerX, centerY, width * 0.5, height * 0.7, mergedOptions);
                    break;
                case 'muscleContraction':
                    this.renderMuscleContractionDiagram(centerX, centerY, width * 0.8, height * 0.6, mergedOptions);
                    break;
                case 'cellStructure':
                    this.renderCellDiagram(centerX, centerY, Math.min(width, height) * 0.7, mergedOptions);
                    break;

                default:
                    this.renderPlaceholder(diagram, centerX, centerY, width * 0.7, height * 0.5);
            }

            // Add category and info
            this.drawDiagramInfo(diagram, 20, height - 60, mergedOptions);

        } catch (error) {
            console.error(`Error rendering ${diagramKey}:`, error);
            this.renderError(diagram, centerX, centerY, width * 0.7, height * 0.5, error.message);
        }

        this.ctx.restore();
    }

    // ========== HELPER METHODS ==========

    drawTitle(title, x, y) {
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, x, y);
    }

    drawDiagramInfo(diagram, x, y, options) {
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Category: ${diagram.category}`, x, y);
        this.ctx.fillText(`Description: ${diagram.description}`, x, y + 15);
    }

    renderPlaceholder(diagram, x, y, width, height) {
        this.ctx.fillStyle = '#ECF0F1';
        this.ctx.fillRect(x - width/2, y - height/2, width, height);
        this.ctx.strokeStyle = '#BDC3C7';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - width/2, y - height/2, width, height);
        
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${diagram.name}`, x, y - 10);
        this.ctx.font = '14px Arial';
        this.ctx.fillText('(Renderer not yet implemented)', x, y + 15);
    }

    renderError(diagram, x, y, width, height, errorMessage) {
        this.ctx.fillStyle = '#FADBD8';
        this.ctx.fillRect(x - width/2, y - height/2, width, height);
        this.ctx.strokeStyle = '#E74C3C';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - width/2, y - height/2, width, height);
        
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillStyle = '#C0392B';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Error Rendering Diagram', x, y - 10);
        this.ctx.font = '14px Arial';
        this.ctx.fillText(errorMessage, x, y + 15);
    }

    addLabel(text, x, y, color = '#2C3E50', align = 'center') {
        this.ctx.font = 'bold 13px Arial';
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        
        const lines = text.split('\n');
        lines.forEach((line, index) => {
            this.ctx.fillText(line, x, y + index * 15);
        });
    }

    drawArrow(x1, y1, x2, y2, color, label = '', arrowSize = 8) {
        this.ctx.save();
        
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 2;

        // Draw line
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(y2 - y1, x2 - x1);
        this.ctx.beginPath();
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(
            x2 - arrowSize * Math.cos(angle - Math.PI / 6),
            y2 - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.lineTo(
            x2 - arrowSize * Math.cos(angle + Math.PI / 6),
            y2 - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.closePath();
        this.ctx.fill();

        // Label
        if(label) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            this.ctx.font = '11px Arial';
            this.ctx.fillStyle = color;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, midX, midY - 5);
        }

        this.ctx.restore();
    }

    drawCurvedArrow(x1, y1, x2, y2, color, label = '') {
        this.ctx.save();
        
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 3;

        // Calculate control point for curve
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const ctrlX = midX - dy * 0.3;
        const ctrlY = midY + dx * 0.3;

        // Draw curved line
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
        this.ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(y2 - ctrlY, x2 - ctrlX);
        this.ctx.beginPath();
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(
            x2 - 10 * Math.cos(angle - Math.PI / 6),
            y2 - 10 * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.lineTo(
            x2 - 10 * Math.cos(angle + Math.PI / 6),
            y2 - 10 * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.closePath();
        this.ctx.fill();

        // Label
        if(label) {
            this.ctx.font = '11px Arial';
            this.ctx.fillStyle = color;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, ctrlX, ctrlY - 5);
        }

        this.ctx.restore();
    }

    drawLegend(x, y, items) {
        this.ctx.save();
        this.ctx.translate(x, y);

        const boxSize = 12;
        const spacing = 20;

        items.forEach((item, index) => {
            const yPos = index * spacing;

            // Color box
            this.ctx.fillStyle = item.color;
            this.ctx.fillRect(0, yPos, boxSize, boxSize);
            this.ctx.strokeStyle = '#2C3E50';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(0, yPos, boxSize, boxSize);

            // Label
            this.ctx.font = '11px Arial';
            this.ctx.fillStyle = '#2C3E50';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(item.label, boxSize + 5, yPos + boxSize - 2);
        });

        this.ctx.restore();
    }



renderPlantCellDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Plant Cell Structure', width / 2, -20);
    
    // Draw plant cell
    AnatomicalShapes.drawPlantCell(this.ctx, width * 0.1, height * 0.1, width * 0.8, height * 0.8);
    
    if(showLabels) {
        this.addLabel('Cell Wall', width * 0.05, height * 0.5, '#228B22', 'left');
        this.addLabel('Chloroplast', width * 0.3, height * 0.25, '#228B22', 'left');
        this.addLabel('Central Vacuole', width * 0.5, height * 0.5, '#4682B4');
        this.addLabel('Nucleus', width * 0.35, height * 0.3, '#9370DB', 'left');
        this.addLabel('Mitochondria', width * 0.7, height * 0.4, '#FF6347', 'right');
        this.addLabel('Golgi Apparatus', width * 0.75, height * 0.5, '#DAA520', 'right');
    }
    
    this.ctx.restore();
}

renderLeafCrossSectionDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Leaf Cross-Section', width / 2, -20);
    
    // Draw leaf structure
    AnatomicalShapes.drawLeafCrossSection(this.ctx, width * 0.1, height * 0.1, width * 0.8, height * 0.8);
    
    if(showLabels) {
        this.addLabel('Cuticle', width * 0.05, height * 0.13, '#2E7D32', 'left');
        this.addLabel('Upper Epidermis', width * 0.05, height * 0.18, '#2E7D32', 'left');
        this.addLabel('Palisade Mesophyll', width * 0.05, height * 0.25, '#2E7D32', 'left');
        this.addLabel('Spongy Mesophyll', width * 0.05, height * 0.55, '#2E7D32', 'left');
        this.addLabel('Vascular Bundle\n(Xylem & Phloem)', width * 0.5, height * 0.45, '#795548');
        this.addLabel('Lower Epidermis', width * 0.05, height * 0.93, '#2E7D32', 'left');
        this.addLabel('Stomata', width * 0.75, height * 0.93, '#4CAF50', 'right');
        
        // Draw arrows for gas exchange
        this.drawArrow(width * 0.95, height * 0.35, width * 0.92, height * 0.5, '#03A9F4', 'CO₂ in');
        this.drawArrow(width * 0.92, height * 0.55, width * 0.95, height * 0.7, '#4CAF50', 'O₂ out');
    }
    
    this.ctx.restore();
}

renderPhotosynthesisDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showEquation = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Photosynthesis', width / 2, -30);
    
    // Draw chloroplast with reactions
    AnatomicalShapes.drawPhotosynthesis(this.ctx, width * 0.1, height * 0.15, width * 0.8, height * 0.6);
    
    if(showEquation) {
        // Chemical equation
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.textAlign = 'center';
        
        const eqY = height * 0.85;
        this.ctx.fillStyle = '#2196F3';
        this.ctx.fillText('6CO₂', width * 0.15, eqY);
        
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.fillText('+', width * 0.23, eqY);
        
        this.ctx.fillStyle = '#2196F3';
        this.ctx.fillText('6H₂O', width * 0.31, eqY);
        
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('→', width * 0.42, eqY);
        
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#FF6F00';
        this.ctx.fillText('C₆H₁₂O₆', width * 0.56, eqY);
        
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.fillText('+', width * 0.69, eqY);
        
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillText('6O₂', width * 0.77, eqY);
        
        // Light requirement
        this.ctx.fillStyle = '#FDD835';
        this.ctx.font = '13px Arial';
        this.ctx.fillText('Light Energy', width * 0.42, eqY - 15);
    }
    
    this.ctx.restore();
}

renderBacteriaStructureDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Bacterial Cell Structure', width / 2, -20);
    
    // Draw bacteria
    AnatomicalShapes.drawBacteriaStructure(this.ctx, width * 0.15, height * 0.15, width * 0.7, height * 0.7);
    
    if(showLabels) {
        this.addLabel('Capsule', width * 0.12, height * 0.25, '#9C27B0', 'left');
        this.addLabel('Cell Wall', width * 0.15, height * 0.35, '#7B1FA2', 'left');
        this.addLabel('Cell Membrane', width * 0.17, height * 0.45, '#E91E63', 'left');
        this.addLabel('Nucleoid (DNA)', width * 0.5, height * 0.5, '#FF6F00');
        this.addLabel('Ribosomes', width * 0.35, height * 0.6, '#1976D2', 'left');
        this.addLabel('Plasmid', width * 0.75, height * 0.65, '#FF9800', 'right');
        this.addLabel('Flagellum', width * 0.92, height * 0.5, '#424242', 'right');
        this.addLabel('Pili', width * 0.85, height * 0.25, '#616161', 'right');
    }
    
    // Note
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Prokaryotic Cell - No nucleus or membrane-bound organelles', width / 2, height * 0.95);
    
    this.ctx.restore();
}

renderVirusStructureDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Virus Structure', width / 2, -20);
    
    // Draw virus
    AnatomicalShapes.drawVirusStructure(this.ctx, width * 0.1, height * 0.1, width * 0.8, height * 0.8);
    
    if(showLabels) {
        this.addLabel('Spike Proteins\n(Glycoproteins)', width * 0.85, height * 0.25, '#5E35B1', 'right');
        this.addLabel('Envelope', width * 0.82, height * 0.5, '#8E24AA', 'right');
        this.addLabel('Capsid\n(Protein Coat)', width * 0.75, height * 0.7, '#B71C1C', 'right');
        this.addLabel('Genetic Material\n(RNA or DNA)', width * 0.5, height * 0.5, '#FFA000');
    }
    
    // Note
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Not a living cell - requires host to reproduce', width / 2, height * 0.95);
    
    this.ctx.restore();
}

renderMitosisDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Mitosis - Cell Division', width / 2, -30);
    
    const stages = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'];
    const stageNames = ['Interphase', 'Prophase', 'Metaphase', 'Anaphase', 'Telophase', 'Cytokinesis'];
    const cellWidth = width / 3 - 20;
    const cellHeight = height / 2 - 40;
    
    stages.forEach((stage, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const cellX = col * (width / 3) + 10;
        const cellY = row * (height / 2) + 20;
        
        // Draw stage
        AnatomicalShapes.drawMitosis(this.ctx, cellX, cellY, cellWidth, cellHeight, stage);
        
        // Label
        if(showLabels) {
            this.ctx.font = 'bold 14px Arial';
            this.ctx.fillStyle = '#2C3E50';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(stageNames[idx], cellX + cellWidth / 2, cellY + cellHeight + 20);
        }
    });
    
    this.ctx.restore();
}

renderMeiosisDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Meiosis - Formation of Gametes', width / 2, -30);
    
    const stages = [
        { stage: 'meiosis1_prophase', name: 'Meiosis I\nProphase I\n(Crossing Over)' },
        { stage: 'meiosis1_end', name: 'End of\nMeiosis I\n(2 cells)' },
        { stage: 'meiosis2_end', name: 'End of\nMeiosis II\n(4 haploid cells)' }
    ];
    
    const cellWidth = width / 3 - 30;
    const cellHeight = height * 0.7;
    
    stages.forEach((stageInfo, idx) => {
        const cellX = idx * (width / 3) + 20;
        const cellY = height * 0.1;
        
        // Draw stage
        AnatomicalShapes.drawMeiosis(this.ctx, cellX, cellY, cellWidth, cellHeight, stageInfo.stage);
        
        // Label
        if(showLabels) {
            this.ctx.font = 'bold 13px Arial';
            this.ctx.fillStyle = '#2C3E50';
            this.ctx.textAlign = 'center';
            const lines = stageInfo.name.split('\n');
            lines.forEach((line, lineIdx) => {
                this.ctx.fillText(line, cellX + cellWidth / 2, cellY + cellHeight + 25 + lineIdx * 16);
            });
        }
    });
    
    // Note
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Produces 4 genetically unique haploid cells (gametes)', width / 2, height * 0.95);
    
    this.ctx.restore();
}

renderFoodChainDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Food Chain', width / 2, -30);
    
    // Draw food chain
    AnatomicalShapes.drawFoodChain(this.ctx, 0, 0, width, height);
    
    // Energy flow label
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = '#E67E22';
    this.ctx.save();
    this.ctx.translate(width * 0.05, height / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.fillText('Energy Flow →', 0, 0);
    this.ctx.restore();
    
    this.ctx.restore();
}

renderEnergyPyramidDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Draw pyramid
    AnatomicalShapes.drawEnergyPyramid(this.ctx, width * 0.1, height * 0.05, width * 0.8, height * 0.85);
    
    this.ctx.restore();
}

renderDNAReplicationDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('DNA Replication', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Semi-conservative replication process', width / 2, -10);
    
    // Draw replication
    AnatomicalShapes.drawDNAReplication(this.ctx, 0, 0, width, height);
    
    this.ctx.restore();
}

renderCellCycleDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Cell Cycle', width / 2, -20);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    // Phases with colors and percentages
    const phases = [
        { name: 'G₁\n(Growth)', angle: 0, sweep: Math.PI * 0.8, color: '#4CAF50' },
        { name: 'S\n(DNA Synthesis)', angle: Math.PI * 0.8, sweep: Math.PI * 0.6, color: '#2196F3' },
        { name: 'G₂\n(Growth)', angle: Math.PI * 1.4, sweep: Math.PI * 0.4, color: '#FFC107' },
        { name: 'M\n(Mitosis)', angle: Math.PI * 1.8, sweep: Math.PI * 0.2, color: '#E91E63' }
    ];
    
    // Draw phase segments
    phases.forEach(phase => {
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, phase.color);
        gradient.addColorStop(1, phase.color + 'AA');
        
        this.ctx.fillStyle = gradient;
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.arc(centerX, centerY, radius, phase.angle, phase.angle + phase.sweep);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Labels
        if(showLabels) {
            const labelAngle = phase.angle + phase.sweep / 2;
            const labelRadius = radius * 0.7;
            const labelX = centerX + Math.cos(labelAngle) * labelRadius;
            const labelY = centerY + Math.sin(labelAngle) * labelRadius;
            
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
            this.ctx.shadowBlur = 3;
            
            const lines = phase.name.split('\n');
            lines.forEach((line, i) => {
                this.ctx.fillText(line, labelX, labelY + (i - 0.5) * 18);
            });
            this.ctx.shadowBlur = 0;
        }
    });
    
    // Center label - Interphase
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#2C3E50';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Interphase', centerX, centerY - 5);
    this.ctx.font = '12px Arial';
    this.ctx.fillText('(G₁ + S + G₂)', centerX, centerY + 10);
    
    // Checkpoint labels
    if(showLabels) {
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#C0392B';
        
        // G1 checkpoint
        this.ctx.fillText('G₁ checkpoint', centerX + radius * 0.85, centerY - radius * 0.5);
        
        // G2 checkpoint
        this.ctx.fillText('G₂ checkpoint', centerX - radius * 0.6, centerY + radius * 0.7);
        
        // M checkpoint
        this.ctx.fillText('M checkpoint', centerX + radius * 0.2, centerY - radius * 0.9);
    }
    
    this.ctx.restore();
}


renderFertilizationDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Fertilization Process', width / 2, -20);
  }
  
  AnatomicalShapes.drawFertilization(this.ctx, 0, 0, width, height);
  
  this.ctx.restore();
}

renderEmbryoDevelopmentDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Embryo Development Stages', width / 2, -20);
  }
  
  AnatomicalShapes.drawEmbryoDevelopment(this.ctx, 0, 0, width, height);
  
  this.ctx.restore();
}

renderMenstrualCycleDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showHormones = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Menstrual Cycle', width / 2, -20);
  }
  
  AnatomicalShapes.drawMenstrualCycle(this.ctx, 0, 0, width, height, showHormones);
  
  this.ctx.restore();
}

renderGametogenesisDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showBoth = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    const title = showBoth ? 'Gametogenesis - Sperm & Egg Formation' :
                  'Spermatogenesis';
    this.ctx.fillText(title, width / 2, -20);
  }
  
  AnatomicalShapes.drawGametogenesis(this.ctx, 0, 0, width, height, showBoth);
  
  this.ctx.restore();
}

renderPlacentaDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Placenta & Fetal Development', width / 2, -20);
  }
  
  AnatomicalShapes.drawPlacenta(this.ctx, 0, 0, width, height);
  
  this.ctx.restore();
}




renderDNAFingerprintingDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showComparison = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('DNA Fingerprinting (RFLP Analysis)', width / 2, -20);
  }

  // Draw DNA fingerprint
  AnatomicalShapes.drawDNAFingerprint(this.ctx, 0, 0, width, height, showComparison);

  // Add description
  if (showLabels) {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Each person has a unique DNA band pattern - like a genetic barcode', 
      width / 2, height - 10);
  }

  this.ctx.restore();
}

renderSTRAnalysisDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('STR Analysis - DNA Profiling', width / 2, -20);
  }

  // Draw STR analysis
  AnatomicalShapes.drawSTRAnalysis(this.ctx, 0, 0, width, height);

  // Add key information
  if (showLabels) {
    // Info box
    this.ctx.fillStyle = '#E8F5E9';
    this.ctx.fillRect(width - 280, 50, 260, 110);
    this.ctx.strokeStyle = '#388E3C';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(width - 280, 50, 260, 110);

    this.ctx.fillStyle = '#1B5E20';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Why STR Analysis?', width - 270, 70);
    
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#2C3E50';
    const strInfo = [
      '• More sensitive than RFLP',
      '• Requires less DNA sample',
      '• Faster results (24-48 hours)',
      '• Can use degraded samples',
      '• CODIS uses 20 STR loci',
      '• Extremely discriminating',
      '• Industry standard since 1990s'
    ];
    
    strInfo.forEach((info, i) => {
      this.ctx.fillText(info, width - 270, 88 + i * 13);
    });
  }

  this.ctx.restore();
}

renderForensicDNAComparisonDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Forensic DNA Analysis Workflow', width / 2, -20);
  }

  // Draw forensic comparison
  AnatomicalShapes.drawForensicDNAComparison(this.ctx, 0, 0, width, height);

  // Add legal considerations
  if (showLabels) {
    this.ctx.fillStyle = '#FCE4EC';
    this.ctx.fillRect(width - 250, 50, 230, 100);
    this.ctx.strokeStyle = '#C2185B';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(width - 250, 50, 230, 100);

    this.ctx.fillStyle = '#C2185B';
    this.ctx.font = 'bold 11px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Legal Considerations:', width - 240, 68);
    
    this.ctx.font = '9px Arial';
    this.ctx.fillStyle = '#2C3E50';
    const legalInfo = [
      '• Chain of custody critical',
      '• Contamination prevention',
      '• Quality control standards',
      '• Expert witness testimony',
      '• Database privacy concerns',
      '• Familial searching ethics',
      '• Post-conviction review'
    ];
    
    legalInfo.forEach((info, i) => {
      this.ctx.fillText(info, width - 240, 83 + i * 12);
    });
  }

  this.ctx.restore();
}

renderGelElectrophoresisForensicDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showSamples = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Forensic Gel Electrophoresis', width / 2, -20);
  }

  // Draw gel electrophoresis
  AnatomicalShapes.drawGelElectrophoresisForensic(this.ctx, 0, 0, width, height, showSamples);

  // Add technical details
  if (showLabels) {
    // Technical info box
    this.ctx.fillStyle = '#F3E5F5';
    this.ctx.fillRect(20, 100, 180, 120);
    this.ctx.strokeStyle = '#7B1FA2';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(20, 100, 180, 120);

    this.ctx.fillStyle = '#7B1FA2';
    this.ctx.font = 'bold 11px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Technical Details:', 30, 118);
    
    this.ctx.font = '9px Arial';
    this.ctx.fillStyle = '#2C3E50';
    const techInfo = [
      '• Gel: Agarose (0.8-2%)',
      '• Buffer: TAE or TBE',
      '• Voltage: 50-150V',
      '• Time: 30-90 minutes',
      '• Staining: EtBr or SYBR',
      '• UV visualization',
      '• Documentation required',
      '• Size standard (ladder)',
      '• Band analysis software'
    ];
    
    techInfo.forEach((info, i) => {
      this.ctx.fillText(info, 30, 133 + i * 11);
    });
  }

  // Add forensic applications
  if (showLabels) {
    this.ctx.fillStyle = '#E1F5FE';
    this.ctx.fillRect(width - 200, 100, 180, 100);
    this.ctx.strokeStyle = '#0277BD';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(width - 200, 100, 180, 100);

    this.ctx.fillStyle = '#0277BD';
    this.ctx.font = 'bold 11px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Forensic Applications:', width - 190, 118);
    
    this.ctx.font = '9px Arial';
    this.ctx.fillStyle = '#2C3E50';
    const applications = [
      '• Criminal investigations',
      '• Paternity testing',
      '• Mass disaster ID',
      '• Missing persons',
      '• Sexual assault cases',
      '• Cold case reviews',
      '• Exoneration cases'
    ];
    
    applications.forEach((app, i) => {
      this.ctx.fillText(app, width - 190, 133 + i * 12);
    });
  }

  this.ctx.restore();
}



renderATPStructureDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showHydrolysis = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('ATP Structure and Hydrolysis', width / 2, -20);
  }

  // Draw ATP
  AnatomicalShapes.drawATPStructure(this.ctx, 0, 0, width, height, showHydrolysis);

  // Add description
  if (showLabels) {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('ATP is the primary energy currency of cells', width / 2, height - 10);
  }

  this.ctx.restore();
}

renderCellularRespirationDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showStages = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Cellular Respiration - Aerobic Pathway', width / 2, -20);
  }

  // Draw cellular respiration
  AnatomicalShapes.drawCellularRespiration(this.ctx, 0, 0, width, height, showStages);

  // Add key information
  if (showLabels && showStages) {
    // Location info box
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.fillRect(20, height - 90, 250, 70);
    this.ctx.strokeStyle = '#34495E';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(20, height - 90, 250, 70);

    this.ctx.fillStyle = '#2C3E50';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Key Points:', 30, height - 70);
    
    this.ctx.font = '10px Arial';
    const keyPoints = [
      '• Most ATP from ETC (oxidative phosphorylation)',
      '• Requires oxygen (aerobic)',
      '• Occurs in mitochondria (except glycolysis)'
    ];
    
    keyPoints.forEach((point, i) => {
      this.ctx.fillText(point, 30, height - 52 + i * 14);
    });
  }

  this.ctx.restore();
}

renderMitochondrionDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Mitochondrion - The Powerhouse of the Cell', width / 2, -20);
  }

  // Draw mitochondrion
  AnatomicalShapes.drawMitochondrion(this.ctx, 0, 0, width, height);

  // Add function information
  if (showLabels) {
    this.ctx.fillStyle = '#FDECEA';
    this.ctx.fillRect(20, height - 110, 280, 90);
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(20, height - 110, 280, 90);

    this.ctx.fillStyle = '#C0392B';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Mitochondrial Functions:', 30, height - 90);
    
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#2C3E50';
    const functions = [
      '• ATP production via cellular respiration',
      '• Krebs cycle occurs in matrix',
      '• ETC located in inner membrane cristae',
      '• Contains own DNA and ribosomes',
      '• Thought to be ancient endosymbiotic bacteria'
    ];
    
    functions.forEach((func, i) => {
      this.ctx.fillText(func, 30, height - 72 + i * 13);
    });
  }

  this.ctx.restore();
}

renderElectronTransportChainDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Electron Transport Chain & Chemiosmosis', width / 2, -20);
  }

  // Draw ETC
  AnatomicalShapes.drawElectronTransportChain(this.ctx, 0, 20, width, height - 40);

  // Add description
  if (showLabels) {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Produces ~32-34 ATP through oxidative phosphorylation', 
      width / 2, height - 5);
  }

  this.ctx.restore();
}

renderChloroplastStructureDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Chloroplast Structure', width / 2, -20);
  }

  // Draw chloroplast
  AnatomicalShapes.drawChloroplastStructure(this.ctx, 0, 0, width, height);

  // Add function information
  if (showLabels) {
    this.ctx.fillStyle = '#E8F5E9';
    this.ctx.fillRect(20, height - 110, 300, 90);
    this.ctx.strokeStyle = '#388E3C';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(20, height - 110, 300, 90);

    this.ctx.fillStyle = '#1B5E20';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Chloroplast Functions:', 30, height - 90);
    
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#2C3E50';
    const functions = [
      '• Photosynthesis - converts light to chemical energy',
      '• Light reactions in thylakoid membranes',
      '• Calvin cycle in stroma',
      '• Contains own DNA and ribosomes',
      '• Found only in plant cells and some protists'
    ];
    
    functions.forEach((func, i) => {
      this.ctx.fillText(func, 30, height - 72 + i * 13);
    });
  }

  this.ctx.restore();
}

renderPhotosynthesisDetailedDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showBothStages = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Photosynthesis - Complete Process', width / 2, -20);
  }

  // Draw photosynthesis
  AnatomicalShapes.drawPhotosynthesisDetailed(this.ctx, 0, 0, width, height, showBothStages);

  // Add description
  if (showLabels) {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Converts light energy into chemical energy stored in glucose', 
      width / 2, height - 10);
  }

  this.ctx.restore();
}


renderNegativeFeedbackDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, exampleType = 'general' } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    
    const titles = {
      general: 'Negative Feedback Loop',
      temperature: 'Body Temperature Regulation',
      glucose: 'Blood Glucose Regulation'
    };
    
    this.ctx.fillText(titles[exampleType] || titles.general, width / 2, -20);
  }

  // Draw feedback loop
  AnatomicalShapes.drawNegativeFeedbackLoop(this.ctx, 0, 0, width, height, exampleType);

  // Add description
  if (showLabels) {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Maintains homeostasis by counteracting changes from set point', 
      width / 2, height - 10);
  }

  this.ctx.restore();
}

renderThermoregulationDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Thermoregulation - Body Temperature Control', width / 2, -20);
  }

  // Draw thermoregulation
  AnatomicalShapes.drawThermoregulation(this.ctx, 0, 0, width, height);

  // Add key information
  if (showLabels) {
    // Control center info
    this.ctx.font = 'bold 11px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Control Center: Hypothalamus', width / 2, 20);
    
    // Set point info
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Normal human body temperature maintained at ~37°C (98.6°F)', 
      width / 2, height - 10);
  }

  this.ctx.restore();
}

renderBloodGlucoseRegulationDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Blood Glucose Regulation', width / 2, -20);
  }

  // Draw regulation mechanism
  AnatomicalShapes.drawBloodGlucoseRegulation(this.ctx, 0, 0, width, height);

  // Add hormone legend
  if (showLabels) {
    this.drawLegend(width - 200, 50, [
      { color: '#8E44AD', label: 'Insulin (lowers glucose)' },
      { color: '#D35400', label: 'Glucagon (raises glucose)' }
    ]);
  }

  // Add description
  if (showLabels) {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Pancreatic hormones maintain blood glucose at ~90 mg/dL', 
      width / 2, height - 10);
  }

  this.ctx.restore();
}

renderWaterBalanceDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Water Balance (Osmoregulation)', width / 2, -20);
  }

  // Draw water balance system
  AnatomicalShapes.drawWaterBalance(this.ctx, 0, 0, width, height);

  // Add key hormone info
  if (showLabels) {
    // ADH info box
    this.ctx.fillStyle = '#EBF5FB';
    this.ctx.fillRect(20, height - 120, 200, 100);
    this.ctx.strokeStyle = '#3498DB';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(20, height - 120, 200, 100);

    this.ctx.fillStyle = '#3498DB';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('ADH (Antidiuretic Hormone)', 30, height - 100);
    
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#2C3E50';
    const adhInfo = [
      '• Also called Vasopressin',
      '• Produced by hypothalamus',
      '• Released by pituitary gland',
      '• Increases water reabsorption'
    ];
    
    adhInfo.forEach((info, i) => {
      this.ctx.fillText(info, 30, height - 80 + i * 15);
    });
  }

  // Add description
  if (showLabels) {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Kidneys regulate water balance in response to blood osmolarity changes', 
      width / 2, height - 10);
  }

  this.ctx.restore();
}

renderNephronDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Kidney Nephron - Functional Unit', width / 2, -20);
  }

  // Draw nephron
  AnatomicalShapes.drawNephron(this.ctx, 0, 0, width, height);

  // Add process descriptions
  if (showLabels) {
    // Process info boxes
    const processes = [
      {
        title: 'Filtration',
        color: '#3498DB',
        x: width - 250,
        y: 50,
        points: [
          'Blood enters glomerulus',
          'Pressure filters small molecules',
          'Forms filtrate in Bowman\'s capsule'
        ]
      },
      {
        title: 'Reabsorption',
        color: '#2ECC71',
        x: width - 250,
        y: 170,
        points: [
          'Useful substances returned to blood',
          'Water, glucose, ions, amino acids',
          'Occurs in PCT, Loop, DCT'
        ]
      },
      {
        title: 'Secretion',
        color: '#9B59B6',
        x: width - 250,
        y: 290,
        points: [
          'Wastes added from blood to filtrate',
          'H+, K+, toxins, drugs',
          'Fine-tunes urine composition'
        ]
      }
    ];

    processes.forEach(proc => {
      // Box
      this.ctx.fillStyle = proc.color + '20';
      this.ctx.fillRect(proc.x, proc.y, 230, 80);
      this.ctx.strokeStyle = proc.color;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(proc.x, proc.y, 230, 80);

      // Title
      this.ctx.fillStyle = proc.color;
      this.ctx.font = 'bold 12px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(proc.title, proc.x + 10, proc.y + 20);

      // Points
      this.ctx.font = '10px Arial';
      this.ctx.fillStyle = '#2C3E50';
      proc.points.forEach((point, i) => {
        this.ctx.fillText('• ' + point, proc.x + 10, proc.y + 40 + i * 15);
      });
    });
  }

  // Add description
  if (showLabels) {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Each kidney contains ~1 million nephrons that filter blood and produce urine', 
      width / 2, height - 10);
  }

  // Add label callouts
  if (showLabels) {
    this.ctx.font = 'bold 11px Arial';
    this.ctx.fillStyle = '#E74C3C';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('→ Urine to bladder', 320, height - 40);
  }

  this.ctx.restore();
}



renderFiveKingdomsDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Five Kingdom Classification System', width / 2, -20);
  }

  // Draw kingdoms
  AnatomicalShapes.drawFiveKingdoms(this.ctx, 0, 0, width, height);

  // Add description
  if (showLabels) {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Traditional biological classification system', width / 2, height - 10);
  }

  this.ctx.restore();
}

renderThreeDomainsDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Three Domain System', width / 2, -20);
  }

  // Draw domains
  AnatomicalShapes.drawThreeDomains(this.ctx, 0, 0, width, height);

  // Add description
  if (showLabels) {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Modern classification based on molecular and genetic evidence', width / 2, height - 10);
  }

  this.ctx.restore();
}

renderTaxonomyHierarchyDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showExample = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Taxonomic Hierarchy', width / 2, -20);
    
    if (showExample) {
      this.ctx.font = 'italic 14px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.fillText('(Example: Lion - Panthera leo)', width / 2, 0);
    }
  }

  // Draw hierarchy
  AnatomicalShapes.drawTaxonomyHierarchy(this.ctx, 0, 30, width, height - 50, showExample);

  // Add mnemonic
  if (showLabels) {
    this.ctx.font = 'italic 11px Arial';
    this.ctx.fillStyle = '#95A5A6';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Mnemonic: King Philip Came Over For Good Soup', width / 2, height - 5);
  }

  this.ctx.restore();
}

renderDichotomousKeyDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, keyType = 'leaves' } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    const title = keyType === 'leaves' ? 'Dichotomous Key - Leaf Identification' : 
                  keyType === 'insects' ? 'Dichotomous Key - Insect Identification' :
                  'Dichotomous Key Example';
    this.ctx.fillText(title, width / 2, -20);
  }

  // Draw key
  AnatomicalShapes.drawDichotomousKey(this.ctx, 0, 20, width, height - 60, keyType);

  // Add legend
  if (showLabels) {
    this.drawLegend(20, height - 50, [
      { color: '#3498DB', label: 'Decision Node' },
      { color: '#2ECC71', label: 'Terminal (Identified Species)' }
    ]);
  }

  // Add description
  if (showLabels) {
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Follow branches based on characteristics to identify organisms', 
      width / 2, height - 5);
  }

  this.ctx.restore();
}

renderCladogramDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;

  this.ctx.save();
  this.ctx.translate(x, y);

  // Title
  if (showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Cladogram - Vertebrate Evolution', width / 2, -20);
  }

  // Draw cladogram
  AnatomicalShapes.drawCladogram(this.ctx, 0, 20, width, height - 50);

  // Add description
  if (showLabels) {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Shows evolutionary relationships based on shared derived characteristics', 
      width / 2, height - 10);
  }

  this.ctx.restore();
}



renderGeneticEngineeringDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Genetic Engineering Process', width / 2, -20);
  }
  
  AnatomicalShapes.drawGeneticEngineering(this.ctx, 0, 0, width, height);
  
  this.ctx.restore();
}

renderGelElectrophoresisDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showBands = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Gel Electrophoresis', width / 2, -20);
  }
  
  AnatomicalShapes.drawGelElectrophoresis(this.ctx, 0, 0, width, height, showBands);
  
  if(showLabels) {
    this.addLabel('Loading\nWells', width * 0.1, height * 0.26, '#5C6BC0');
    this.addLabel('Gel\nMatrix', width * 0.88, height * 0.5, '#C5CAE9');
    this.addLabel('DNA\nBands', width * 0.12, height * 0.6, '#4ECDC4');
  }
  
  this.ctx.restore();
}

renderCloningProcessDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, cloningType = 'organismal' } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    const title = cloningType === 'organismal' ? 'Organismal Cloning Process' :
                  cloningType === 'gene' ? 'Gene Cloning' :
                  'Therapeutic Cloning';
    this.ctx.fillText(title, width / 2, -20);
  }
  
  AnatomicalShapes.drawCloningProcess(this.ctx, 0, 0, width, height, cloningType);
  
  this.ctx.restore();
}

renderCRISPRDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('CRISPR-Cas9 Gene Editing', width / 2, -20);
  }
  
  AnatomicalShapes.drawCRISPR(this.ctx, 0, 0, width, height);
  
  this.ctx.restore();
}

renderBioreactorDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Bioreactor System', width / 2, -20);
  }
  
  AnatomicalShapes.drawBioreactor(this.ctx, 0, 0, width, height);
  
  if(showLabels) {
    this.addLabel('Culture\nVessel', width * 0.15, height * 0.45, '#1976D2');
    this.addLabel('Impeller\n(Stirrer)', width * 0.35, height * 0.35, '#424242');
    this.addLabel('Temp.\nSensor', width * 0.88, height * 0.22, '#E53935');
    this.addLabel('pH\nSensor', width * 0.88, height * 0.32, '#43A047');
    this.addLabel('Control\nPanel', width * 0.98, height * 0.475, '#37474F');
  }
  
  this.ctx.restore();
}

renderGMOProductionDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GMO Production Process', width / 2, -20);
  }
  
  AnatomicalShapes.drawGMOProduction(this.ctx, 0, 0, width, height);
  
  this.ctx.restore();
}

renderBacterialCellDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Bacterial Cell Structure', width / 2, -20);
  }
  
  AnatomicalShapes.drawBacterialCell(this.ctx, 0, 0, width, height);
  
  if(showLabels) {
    this.addLabel('Capsule', width * 0.15, height * 0.25, '#B8E6B8');
    this.addLabel('Cell Wall', width * 0.15, height * 0.35, '#2E5C8A');
    this.addLabel('Cell\nMembrane', width * 0.15, height * 0.45, '#7FB3D5');
    this.addLabel('Cytoplasm', width * 0.15, height * 0.55, '#ADD8E6');
    this.addLabel('Nucleoid\n(DNA)', width * 0.5, height * 0.65, '#FF6B9D');
    this.addLabel('Plasmid', width * 0.35, height * 0.75, '#FF1493');
    this.addLabel('Ribosomes', width * 0.65, height * 0.75, '#8B4789');
    this.addLabel('Flagellum', width * 0.85, height * 0.5, '#2C5F2D');
    this.addLabel('Pili', width * 0.25, height * 0.15, '#97BE5A');
  }
  
  this.ctx.restore();
}

renderVirusStructureDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Virus Structure', width / 2, -20);
  }
  
  AnatomicalShapes.drawVirusStructure(this.ctx, 0, 0, width, height);
  
  if(showLabels) {
    this.addLabel('Capsid\n(Protein Shell)', width * 0.15, height * 0.35, '#FF6B6B');
    this.addLabel('Capsomeres\n(Subunits)', width * 0.75, height * 0.3, '#FA5252');
    this.addLabel('Genetic Material\n(DNA/RNA)', width * 0.5, height * 0.65, '#4ECDC4');
    this.addLabel('Envelope\n(Lipid Layer)', width * 0.2, height * 0.65, '#FFD93D');
    this.addLabel('Spike\nProteins', width * 0.85, height * 0.5, '#FFA94D');
  }
  
  this.ctx.restore();
}

renderFungalCellDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showHyphae = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    const title = showHyphae ? 'Fungal Cell Structure & Hyphae' : 'Fungal Cell Structure';
    this.ctx.fillText(title, width / 2, -20);
  }
  
  AnatomicalShapes.drawFungalCell(this.ctx, 0, 0, width, height, showHyphae);
  
  if(showLabels) {
    if(showHyphae) {
      this.addLabel('Hyphae\n(Filaments)', width * 0.15, height * 0.5, '#D4A373');
      this.addLabel('Septa\n(Cross-walls)', width * 0.25, height * 0.7, '#8B4513');
    }
    
    const labelX = showHyphae ? width * 0.75 : width * 0.75;
    const labelY = showHyphae ? height * 0.3 : height * 0.5;
    
    this.addLabel('Cell Wall\n(Chitin)', labelX, labelY - height * 0.15, '#8B7355');
    this.addLabel('Nucleus', labelX, labelY, '#9B59B6');
    this.addLabel('Mitochondria', labelX, labelY + height * 0.12, '#FF69B4');
    this.addLabel('Vacuole', labelX, labelY + height * 0.22, '#4682B4');
  }
  
  this.ctx.restore();
}

renderProtistsDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Protist Diversity', width / 2, -20);
  }
  
  AnatomicalShapes.drawProtists(this.ctx, 0, 0, width, height);
  
  if(showLabels) {
    const protistWidth = width / 3;
    
    // Amoeba labels
    this.addLabel('Pseudopodia', protistWidth * 0.85, height * 0.28, '#4CAF50');
    this.addLabel('Nucleus', protistWidth * 0.5, height * 0.58, '#9C27B0');
    this.addLabel('Food\nVacuole', protistWidth * 0.65, height * 0.48, '#FFE082');
    this.addLabel('Contractile\nVacuole', protistWidth * 0.75, height * 0.6, '#64B5F6');
    
    // Paramecium labels
    this.addLabel('Cilia', protistWidth * 1.2, height * 0.38, '#4FC3F7');
    this.addLabel('Oral\nGroove', protistWidth * 1.3, height * 0.48, '#01579B');
    this.addLabel('Macro-\nnucleus', protistWidth * 1.65, height * 0.55, '#7E57C2');
    
    // Euglena labels
    this.addLabel('Flagellum', protistWidth * 2.65, height * 0.12, '#558B2F');
    this.addLabel('Eyespot', protistWidth * 2.65, height * 0.35, '#FF5722');
    this.addLabel('Chloro-\nplasts', protistWidth * 2.75, height * 0.55, '#4CAF50');
  }
  
  this.ctx.restore();
}

renderBacterialGrowthCurveDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Bacterial Growth Curve', width / 2, -20);
  }
  
  AnatomicalShapes.drawBacterialGrowthCurve(this.ctx, 0, 0, width, height);
  
  this.ctx.restore();
}

renderViralReplicationDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, cycleType = 'both' } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    const title = cycleType === 'both' ? 'Viral Replication Cycles' :
                  cycleType === 'lytic' ? 'Lytic Cycle' :
                  'Lysogenic Cycle';
    this.ctx.fillText(title, width / 2, -20);
  }
  
  AnatomicalShapes.drawViralReplicationCycles(this.ctx, 0, 0, width, height, cycleType);
  
  this.ctx.restore();
}

renderMicroscopyDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Microscopy Types Comparison', width / 2, -20);
  }
  
  AnatomicalShapes.drawMicroscopyComparison(this.ctx, 0, 0, width, height);
  
  if(showLabels) {
    // Additional comparison info
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    
    this.ctx.fillText('Resolution: ~200 nm', width * 0.25, height * 0.99);
    this.ctx.fillText('Live specimens: Yes', width * 0.25, height * 1.02);
    
    this.ctx.fillText('Resolution: ~0.1 nm', width * 0.75, height * 0.99);
    this.ctx.fillText('Live specimens: No (vacuum)', width * 0.75, height * 1.02);
  }
  
  this.ctx.restore();
}


renderLeafCrossSectionDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Leaf Cross-Section', width / 2, -20);
  }
  
  AnatomicalShapes.drawLeafCrossSection(this.ctx, 0, 0, width, height);
  
  if(showLabels) {
    this.addLabel('Cuticle', width * 0.85, height * 0.05, '#FFD700');
    this.addLabel('Upper\nEpidermis', width * 0.85, height * 0.1, '#228B22');
    this.addLabel('Palisade\nMesophyll', width * 0.05, height * 0.2, '#32CD32');
    this.addLabel('Spongy\nMesophyll', width * 0.05, height * 0.5, '#98FB98');
    this.addLabel('Vascular\nBundle', width * 0.65, height * 0.5, '#8B4513');
    this.addLabel('Xylem', width * 0.65, height * 0.46, '#D2691E');
    this.addLabel('Phloem', width * 0.65, height * 0.54, '#DEB887');
    this.addLabel('Lower\nEpidermis', width * 0.85, height * 0.92, '#228B22');
    this.addLabel('Stomata', width * 0.15, height * 0.9, '#ADFF2F');
    this.addLabel('Guard\nCells', width * 0.08, height * 0.88, '#ADFF2F');
  }
  
  this.ctx.restore();
}

renderPhotosynthesisDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showEquation = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Photosynthesis Process', width / 2, -20);
  }
  
  AnatomicalShapes.drawPhotosynthesisProcess(this.ctx, 0, 0, width, height, showEquation);
  
  if(showLabels) {
    this.addLabel('Chloroplast', width * 0.5, height * 0.72, '#228B22');
    this.addLabel('Thylakoid\n(Grana)', width * 0.25, height * 0.52, '#006400');
    this.addLabel('Stroma', width * 0.75, height * 0.52, '#90EE90');
  }
  
  this.ctx.restore();
}

renderStomataDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, state = 'both' } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    const title = state === 'both' ? 'Stomata Structure - Open vs Closed' :
                  state === 'open' ? 'Stomata - Open State' :
                  'Stomata - Closed State';
    this.ctx.fillText(title, width / 2, -20);
  }
  
  AnatomicalShapes.drawStomata(this.ctx, 0, 0, width, height, state);
  
  if(showLabels && state === 'both') {
    this.addLabel('Guard Cells', width * 0.2, height * 0.48, '#32CD32');
    this.addLabel('Stomatal\nPore', width * 0.2, height * 0.55, '#FFFFFF');
    this.addLabel('Epidermal\nCells', width * 0.05, height * 0.35, '#ADFF2F');
  }
  
  this.ctx.restore();
}

renderXylemPhloemDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Xylem & Phloem - Vascular Tissue', width / 2, -20);
  }
  
  AnatomicalShapes.drawXylemPhloem(this.ctx, 0, 0, width, height);
  
  if(showLabels) {
    this.addLabel('XYLEM', width * 0.425, height * 0.05, '#8B4513');
    this.addLabel('(Water Transport)', width * 0.425, height * 0.08, '#8B4513');
    this.addLabel('Vessel\nCells', width * 0.42, height * 0.5, '#D2691E');
    this.addLabel('PHLOEM', width * 0.575, height * 0.05, '#DEB887');
    this.addLabel('(Sugar Transport)', width * 0.575, height * 0.08, '#DEB887');
    this.addLabel('Sieve\nTube', width * 0.595, height * 0.5, '#D2691E');
    this.addLabel('Companion\nCells', width * 0.53, height * 0.5, '#F4A460');
  }
  
  this.ctx.restore();
}

renderFlowerStructureDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Flower Anatomy', width / 2, -20);
  }
  
  AnatomicalShapes.drawFlowerStructure(this.ctx, 0, 0, width, height);
  
  if(showLabels) {
    // Pistil (female parts)
    this.addLabel('Stigma', width * 0.55, height * 0.32, '#FFD700');
    this.addLabel('Style', width * 0.55, height * 0.42, '#F0E68C');
    this.addLabel('Ovary', width * 0.55, height * 0.6, '#ADFF2F');
    this.addLabel('Ovules', width * 0.55, height * 0.55, '#FFE4B5');
    
    // Stamens (male parts)
    this.addLabel('Anther', width * 0.65, height * 0.42, '#FFA500');
    this.addLabel('Filament', width * 0.7, height * 0.58, '#FFDAB9');
    this.addLabel('Pollen', width * 0.72, height * 0.38, '#FFD700');
    
    // Other parts
    this.addLabel('Petals', width * 0.25, height * 0.35, '#FF69B4');
    this.addLabel('Sepals', width * 0.2, height * 0.65, '#7CFC00');
    this.addLabel('Receptacle', width * 0.35, height * 0.85, '#90EE90');
    this.addLabel('Pedicel\n(stalk)', width * 0.35, height * 0.95, '#8FBC8F');
  }
  
  this.ctx.restore();
}

renderSeedGerminationDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Seed Germination Stages', width / 2, -20);
  }
  
  AnatomicalShapes.drawSeedGermination(this.ctx, 0, 0, width, height);
  
  this.ctx.restore();
}

renderTropismsDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
   this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Plant Tropisms', width / 2, -20);
  }
  
  AnatomicalShapes.drawTropisms(this.ctx, 0, 0, width, height);
  
  this.ctx.restore();
}



renderDigestiveSystemDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showPath = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Human Digestive System', width / 2, -20);
  }
  
  AnatomicalShapes.drawDigestiveSystem(this.ctx, 0, 0, width, height, showPath);
  
  if(showLabels) {
    this.addLabel('Mouth', width * 0.5, height * 0.05, '#8B4513');
    this.addLabel('Esophagus', width * 0.58, height * 0.12, '#A0522D');
    this.addLabel('Liver', width * 0.72, height * 0.18, '#654321');
    this.addLabel('Stomach', width * 0.25, height * 0.25, '#E74C3C');
    this.addLabel('Pancreas', width * 0.65, height * 0.28, '#9B59B6');
    this.addLabel('Small\nIntestine', width * 0.85, height * 0.55, '#F39C12');
    this.addLabel('Large\nIntestine', width * 0.15, height * 0.6, '#E67E22');
    this.addLabel('Rectum', width * 0.5, height * 0.94, '#D35400');
  }
  
  this.ctx.restore();
}

renderNervousSystemDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, showSignal = false } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Human Nervous System', width / 2, -20);
  }
  
  AnatomicalShapes.drawNervousSystem(this.ctx, 0, 0, width, height, showSignal);
  
  if(showLabels) {
    this.addLabel('Brain (CNS)', width * 0.7, height * 0.08, '#C0392B');
    this.addLabel('Spinal Cord\n(CNS)', width * 0.65, height * 0.35, '#E67E22');
    this.addLabel('Peripheral\nNerves', width * 0.15, height * 0.4, '#F39C12');
    this.addLabel('Motor\nNeurons', width * 0.85, height * 0.65, '#F7DC6F');
  }
  
  this.ctx.restore();
}

renderEndocrineSystemDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Human Endocrine System', width / 2, -20);
  }
  
  AnatomicalShapes.drawEndocrineSystem(this.ctx, 0, 0, width, height);
  
  if(showLabels) {
    this.addLabel('Pineal Gland', width * 0.65, height * 0.08, '#9B59B6');
    this.addLabel('Pituitary\nGland', width * 0.7, height * 0.12, '#E67E22');
    this.addLabel('Thyroid', width * 0.7, height * 0.18, '#16A085');
    this.addLabel('Thymus', width * 0.7, height * 0.3, '#F39C12');
    this.addLabel('Adrenal\nGlands', width * 0.2, height * 0.42, '#E74C3C');
    this.addLabel('Pancreas', width * 0.7, height * 0.5, '#9B59B6');
    this.addLabel('Gonads', width * 0.7, height * 0.7, '#3498DB');
  }
  
  this.ctx.restore();
}

renderReproductiveSystemDiagram(x, y, width, height, options = {}) {
  const { showLabels = true, sex = 'both' } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    const title = sex === 'both' ? 'Human Reproductive Systems' :
                  sex === 'male' ? 'Male Reproductive System' :
                  'Female Reproductive System';
    this.ctx.fillText(title, width / 2, -20);
  }
  
  AnatomicalShapes.drawReproductiveSystem(this.ctx, 0, 0, width, height, sex);
  
  if(showLabels) {
    if(sex === 'male' || sex === 'both') {
      const xOffset = sex === 'both' ? 0 : width * 0.25;
      this.addLabel('Testes', xOffset + width * 0.27, height * 0.78, '#3498DB');
      this.addLabel('Vas\nDeferens', xOffset + width * 0.15, height * 0.5, '#5DADE2');
      this.addLabel('Prostate', xOffset + width * 0.35, height * 0.39, '#85C1E2');
    }
    
    if(sex === 'female' || sex === 'both') {
      const xOffset = sex === 'both' ? width * 0.5 : width * 0.25;
      this.addLabel('Ovaries', xOffset + width * 0.05, height * 0.4, '#E74C3C');
      this.addLabel('Fallopian\nTubes', xOffset + width * 0.25, height * 0.3, '#F5B7B1');
      this.addLabel('Uterus', xOffset + width * 0.35, height * 0.55, '#E67E22');
      this.addLabel('Vagina', xOffset + width * 0.35, height * 0.75, '#F0B27A');
    }
  }
  
  this.ctx.restore();
}

renderImmuneSystemDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Human Immune System', width / 2, -20);
  }
  
  AnatomicalShapes.drawImmuneSystem(this.ctx, 0, 0, width, height);
  
  if(showLabels) {
    this.addLabel('Thymus', width * 0.65, height * 0.25, '#F39C12');
    this.addLabel('Spleen', width * 0.2, height * 0.45, '#8B4513');
    this.addLabel('Bone\nMarrow', width * 0.1, height * 0.62, '#9B59B6');
    this.addLabel('Lymph\nNodes', width * 0.15, height * 0.35, '#3498DB');
    this.addLabel('Lymphatic\nVessels', width * 0.85, height * 0.7, '#85C1E2');
  }
  
  this.ctx.restore();
}

renderSynapseDiagram(x, y, width, height, options = {}) {
  const { showLabels = true } = options;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  
  if(showLabels) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Synaptic Transmission', width / 2, -20);
  }
  
  AnatomicalShapes.drawSynapse(this.ctx, 0, 0, width, height);
  
  if(showLabels) {
    this.addLabel('Presynaptic\nTerminal', width * 0.3, height * 0.05, '#C0392B');
    this.addLabel('Synaptic\nVesicles', width * 0.25, height * 0.45, '#E74C3C');
    this.addLabel('Synaptic\nCleft', width * 0.5, height * 0.02, '#7F8C8D');
    this.addLabel('Neuro-\ntransmitters', width * 0.5, height * 0.55, '#F39C12');
    this.addLabel('Receptors', width * 0.6, height * 0.55, '#3498DB');
    this.addLabel('Postsynaptic\nMembrane', width * 0.7, height * 0.05, '#5DADE2');
  }
  this.ctx.restore();

}




renderFoodWebDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Food Web', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Complex feeding relationships in an ecosystem', width / 2, -10);
    
    // Draw food web
    AnatomicalShapes.drawFoodWeb(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Note
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'italic 11px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Arrows show direction of energy flow', width * 0.5, height * 0.98);
    }
    
    this.ctx.restore();
}

renderCarbonCycleDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Carbon Cycle', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Movement of carbon through Earth\'s systems', width / 2, -10);
    
    // Draw carbon cycle
    AnatomicalShapes.drawCarbonCycle(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Human impact note
        this.ctx.strokeStyle = '#E74C3C';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(width * 0.02, height * 0.92, width * 0.4, height * 0.06);
        
        this.ctx.fillStyle = '#E74C3C';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Human Impact: Burning fossil fuels increases', width * 0.03, height * 0.955);
        this.ctx.fillText('atmospheric CO₂ (greenhouse effect)', width * 0.03, height * 0.97);
    }
    
    this.ctx.restore();
}

renderNitrogenCycleDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Nitrogen Cycle', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Nitrogen transformation through ecosystems', width / 2, -10);
    
    // Draw nitrogen cycle
    AnatomicalShapes.drawNitrogenCycle(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Bacteria role box
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(width * 0.55, height * 0.02, width * 0.43, height * 0.08);
        
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Key Role of Bacteria:', width * 0.57, height * 0.045);
        
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('• Nitrogen fixation (Rhizobium, Azotobacter)', width * 0.57, height * 0.06);
        this.ctx.fillText('• Nitrification (Nitrosomonas, Nitrobacter)', width * 0.57, height * 0.075);
        this.ctx.fillText('• Denitrification (Pseudomonas)', width * 0.57, height * 0.09);
    }
    
    this.ctx.restore();
}

renderWaterCycleDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Water Cycle (Hydrological Cycle)', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Continuous movement of water on, above, and below Earth\'s surface', width / 2, -10);
    
    // Draw water cycle
    AnatomicalShapes.drawWaterCycle(this.ctx, 0, 0, width, height);
    
    this.ctx.restore();
}

renderPopulationGrowthDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showBoth = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Population Growth Curves', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Exponential vs Logistic Growth', width / 2, -10);
    
    // Draw growth curves
    AnatomicalShapes.drawPopulationGrowth(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Growth equations
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        
        // Exponential
        this.ctx.fillStyle = '#E74C3C';
        this.ctx.fillText('Exponential: dN/dt = rN', width * 0.02, height * 0.88);
        
        // Logistic
        this.ctx.fillStyle = '#2196F3';
        this.ctx.fillText('Logistic: dN/dt = rN(1 - N/K)', width * 0.02, height * 0.92);
        
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('r = growth rate, N = population size, K = carrying capacity', width * 0.02, height * 0.96);
    }
    
    this.ctx.restore();
}

renderEcosystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, ecosystemType = 'forest' } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    const titles = {
        'forest': 'Forest Ecosystem',
        'aquatic': 'Aquatic Ecosystem',
        'grassland': 'Grassland Ecosystem'
    };
    
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(titles[ecosystemType], width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Biotic and abiotic components', width / 2, -10);
    
    // Draw ecosystem
    AnatomicalShapes.drawEcosystem(this.ctx, 0, 0, width, height, ecosystemType);
    
    this.ctx.restore();
}

renderPredatorPreyDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Predator-Prey Dynamics', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Lotka-Volterra Model', width / 2, -10);
    
    // Draw predator-prey graph
    AnatomicalShapes.drawPredatorPreyGraph(this.ctx, 0, 0, width, height);
    
    this.ctx.restore();
}


// Add these methods to AnatomicalDiagramRenderer class:
renderDarwinsFinchesDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("Darwin's Finches - Adaptive Radiation", width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Galapagos Islands - Beak adaptations for different food sources', width / 2, -10);
    
    // Draw finches
    AnatomicalShapes.drawDarwinsFinches(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Key concept box
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(width * 0.02, height * 0.02, width * 0.35, height * 0.12);
        
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Natural Selection:', width * 0.04, height * 0.05);
        
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('• Beak shape matches food source', width * 0.04, height * 0.08);
        this.ctx.fillText('• Better adapted birds survive', width * 0.04, height * 0.10);
        this.ctx.fillText('• Traits passed to offspring', width * 0.04, height * 0.12);
    }
    
    this.ctx.restore();
}

renderNaturalSelectionDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Natural Selection Process', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Mechanism of Evolution', width / 2, -10);
    
    // Draw process
    AnatomicalShapes.drawNaturalSelectionProcess(this.ctx, 0, 0, width, height);
    
    this.ctx.restore();
}

renderPhylogeneticTreeDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Phylogenetic Tree - Tree of Life', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Evolutionary relationships between major groups', width / 2, -10);
    
    // Draw tree
    AnatomicalShapes.drawPhylogeneticTree(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Key concept
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = '11px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Branch points = common ancestors', width * 0.05, height * 0.05);
        this.ctx.fillText('Branch length = evolutionary time', width * 0.05, height * 0.08);
    }
    
    this.ctx.restore();
}

renderAdaptiveRadiationDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Adaptive Radiation', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Single ancestor diversifies into multiple species', width / 2, -10);
    
    // Draw radiation
    AnatomicalShapes.drawAdaptiveRadiation(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Conditions box
        this.ctx.strokeStyle = '#9C27B0';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(width * 0.02, height * 0.88, width * 0.45, height * 0.1);
        
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Common Triggers:', width * 0.04, height * 0.91);
        
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('• New habitat colonization', width * 0.04, height * 0.94);
        this.ctx.fillText('• Mass extinction event', width * 0.04, height * 0.96);
        this.ctx.fillText('• New ecological opportunity', width * 0.04, height * 0.98);
    }
    
    this.ctx.restore();
}


/**
renderFossilLayersDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Fossil Record - Geological Time Scale', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Evidence of evolution preserved in rock layers', width / 2, -10);
    
    // Draw fossil layers
    AnatomicalShapes.drawFossilLayers(this.ctx, width * 0.1, 0, width * 0.8, height);
    
    if(showLabels) {
        // Law of Superposition
        this.ctx.strokeStyle = '#FF5722';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(width * 0.02, height * 0.02, width * 0.35, height * 0.08);
        
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Law of Superposition:', width * 0.04, height * 0.045);
        
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('Older layers at bottom,', width * 0.04, height * 0.065);
        this.ctx.fillText('younger layers at top', width * 0.04, height * 0.08);
    }
    
    this.ctx.restore();
}
*/

renderHardyWeinbergDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Draw Hardy-Weinberg
    AnatomicalShapes.drawHardyWeinberg(this.ctx, 0, 0, width, height);
    
    this.ctx.restore();
}

renderSpeciationDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, speciationType = 'allopatric' } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    const titles = {
        'allopatric': 'Allopatric Speciation',
        'sympatric': 'Sympatric Speciation'
    };
    
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(titles[speciationType], width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    const subtitles = {
        'allopatric': 'Geographic separation leads to new species',
        'sympatric': 'New species form in same location'
    };
    this.ctx.fillText(subtitles[speciationType], width / 2, -10);
    
    // Draw speciation
    AnatomicalShapes.drawSpeciation(this.ctx, 0, 0, width, height, speciationType);
    
    if(showLabels) {
        // Definition box
        const defX = width * 0.65;
        const defY = height * 0.02;
        
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(defX, defY, width * 0.33, height * 0.12);
        
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Speciation:', defX + 5, defY + 15);
        
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        
        if(speciationType === 'allopatric') {
            this.ctx.fillText('• Physical barrier separates', defX + 5, defY + 30);
            this.ctx.fillText('  populations', defX + 5, defY + 43);
            this.ctx.fillText('• Different selection pressures', defX + 5, defY + 56);
            this.ctx.fillText('• Cannot interbreed when reunited', defX + 5, defY + 69);
        } else {
            this.ctx.fillText('• No physical separation', defX + 5, defY + 30);
            this.ctx.fillText('• Behavioral/temporal isolation', defX + 5, defY + 43);
            this.ctx.fillText('• Polyploidy in plants', defX + 5, defY + 56);
            this.ctx.fillText('• Chromosomal changes', defX + 5, defY + 69);
        }
    }
    
    this.ctx.restore();
}

renderComparativeAnatomyDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Comparative Anatomy - Evidence of Evolution', width / 2, -30);
    
    // Draw comparative anatomy
    AnatomicalShapes.drawComparativeAnatomy(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Key differences
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(width * 0.25, height * 0.88, width * 0.5, height * 0.1);
        
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Homologous:', width * 0.27, height * 0.905);
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('Evidence of common ancestry', width * 0.27, height * 0.925);
        this.ctx.fillText('(Divergent evolution)', width * 0.27, height * 0.94);
        
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Analogous:', width * 0.52, height * 0.905);
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('Similar function, not ancestry', width * 0.52, height * 0.925);
        this.ctx.fillText('(Convergent evolution)', width * 0.52, height * 0.94);
    }
    
    this.ctx.restore();
}



renderDNAStructureDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('DNA Double Helix Structure', width / 2, -30);
    
    // Draw DNA
    AnatomicalShapes.drawDNAHelix(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        this.addLabel('Sugar-Phosphate\nBackbone', width * 0.15, height * 0.5, '#1976D2', 'left');
        this.addLabel('Base Pairs', width * 0.85, height * 0.4, '#2C3E50', 'right');
        this.addLabel('Adenine-Thymine\n(2 H-bonds)', width * 0.85, height * 0.55, '#4CAF50', 'right');
        this.addLabel('Guanine-Cytosine\n(3 H-bonds)', width * 0.85, height * 0.7, '#FF5722', 'right');
        
        // Antiparallel note
        this.ctx.font = 'italic 12px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('Antiparallel strands', width * 0.5, height * 0.98);
    }
    
    this.ctx.restore();
}

renderRNAStructureDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, rnaType = 'mRNA' } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    const titles = {
        'mRNA': 'Messenger RNA (mRNA)',
        'tRNA': 'Transfer RNA (tRNA)',
        'rRNA': 'Ribosomal RNA (rRNA)'
    };
    
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(titles[rnaType], width / 2, -30);
    
    // Draw RNA
    AnatomicalShapes.drawRNAStructure(this.ctx, 0, 0, width, height, rnaType);
    
    if(showLabels) {
        switch(rnaType) {
            case 'mRNA':
                this.addLabel('Single-stranded', width * 0.1, height * 0.35, '#E91E63', 'left');
                this.addLabel('Contains Uracil (U)\ninstead of Thymine (T)', width * 0.5, height * 0.15, '#FFC107');
                
                // Function
                this.ctx.font = '12px Arial';
                this.ctx.fillStyle = '#7F8C8D';
                this.ctx.fillText('Function: Carries genetic code from DNA to ribosomes', width * 0.5, height * 0.9);
                break;
            case 'tRNA':
                this.addLabel('Cloverleaf\nStructure', width * 0.15, height * 0.5, '#9C27B0', 'left');
                this.addLabel('Amino Acid\nAttachment', width * 0.5, height * 0.02, '#FF6F00');
                
                this.ctx.font = '12px Arial';
                this.ctx.fillStyle = '#7F8C8D';
                this.ctx.fillText('Function: Delivers amino acids to ribosome during translation', width * 0.5, height * 0.9);
                break;
            case 'rRNA':
                this.addLabel('Complex\nFolded Structure', width * 0.15, height * 0.4, '#00897B', 'left');
                
                this.ctx.font = '12px Arial';
                this.ctx.fillStyle = '#7F8C8D';
                this.ctx.fillText('Function: Structural and catalytic component of ribosomes', width * 0.5, height * 0.9);
                break;
        }
    }
    
    this.ctx.restore();
}

renderTranscriptionDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Transcription: DNA → RNA', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('RNA polymerase synthesizes mRNA from DNA template', width / 2, -10);
    
    // Draw transcription
    AnatomicalShapes.drawTranscription(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Key steps
        const stepsY = height * 0.7;
        this.ctx.font = 'bold 13px Arial';
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Key Steps:', width * 0.05, stepsY);
        
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('1. DNA strands separate', width * 0.05, stepsY + 18);
        this.ctx.fillText('2. RNA polymerase binds to promoter', width * 0.05, stepsY + 33);
        this.ctx.fillText('3. Complementary RNA nucleotides added', width * 0.05, stepsY + 48);
        this.ctx.fillText('4. mRNA released at terminator', width * 0.05, stepsY + 63);
        
        // Base pairing rules
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('Base Pairing:', width * 0.95, stepsY);
        
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('DNA A → RNA U', width * 0.95, stepsY + 18);
        this.ctx.fillText('DNA T → RNA A', width * 0.95, stepsY + 33);
        this.ctx.fillText('DNA G → RNA C', width * 0.95, stepsY + 48);
        this.ctx.fillText('DNA C → RNA G', width * 0.95, stepsY + 63);
    }
    
    this.ctx.restore();
}

renderTranslationDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Translation: RNA → Protein', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Ribosomes decode mRNA to synthesize proteins', width / 2, -10);
    
    // Draw translation
    AnatomicalShapes.drawTranslation(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Key components
        const infoY = height * 0.75;
        this.ctx.font = 'bold 13px Arial';
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Ribosome Binding Sites:', width * 0.05, infoY);
        
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('A site: Aminoacyl (incoming tRNA)', width * 0.05, infoY + 18);
        this.ctx.fillText('P site: Peptidyl (growing chain)', width * 0.05, infoY + 33);
        this.ctx.fillText('E site: Exit (empty tRNA leaves)', width * 0.05, infoY + 48);
        
        // Process
        this.ctx.font = 'bold 13px Arial';
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('Process:', width * 0.95, infoY);
        
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('1. tRNA brings amino acid', width * 0.95, infoY + 18);
        this.ctx.fillText('2. Anticodon pairs with codon', width * 0.95, infoY + 33);
        this.ctx.fillText('3. Peptide bond forms', width * 0.95, infoY + 48);
        this.ctx.fillText('4. Ribosome moves to next codon', width * 0.95, infoY + 63);
    }
    
    this.ctx.restore();
}

renderCodonChartDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Genetic Code - Codon Chart', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('64 codons specify 20 amino acids + 3 stop signals', width / 2, -10);
    
    // Draw codon chart
    AnatomicalShapes.drawCodonChart(this.ctx, width * 0.05, height * 0.05, width * 0.9, height * 0.85);
    
    this.ctx.restore();
}

renderGeneExpressionDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Central Dogma of Molecular Biology', width / 2, -30);
    
    const stepWidth = width / 3;
    const stepY = height * 0.4;
    
    // DNA
    this.ctx.fillStyle = '#1976D2';
    this.ctx.strokeStyle = '#0D47A1';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.05, stepY, stepWidth * 0.8, height * 0.2, 10);
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('DNA', width * 0.05 + stepWidth * 0.4, stepY + height * 0.11);
    
    // Transcription arrow
    this.drawArrow(
        width * 0.05 + stepWidth * 0.8,
        stepY + height * 0.1,
        width * 0.05 + stepWidth,
        stepY + height * 0.1,
        '#9C27B0',
        'Transcription'
    );
    
    // RNA
    this.ctx.fillStyle = '#E91E63';
    this.ctx.strokeStyle = '#C2185B';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.05 + stepWidth, stepY, stepWidth * 0.8, height * 0.2, 10);
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.fillText('RNA', width * 0.05 + stepWidth + stepWidth * 0.4, stepY + height * 0.11);
    
    // Translation arrow
    this.drawArrow(
        width * 0.05 + stepWidth * 1.8,
        stepY + height * 0.1,
        width * 0.05 + stepWidth * 2,
        stepY + height * 0.1,
        '#4CAF50',
        'Translation'
    );
    
    // Protein
    this.ctx.fillStyle = '#FF6F00';
    this.ctx.strokeStyle = '#E65100';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.05 + stepWidth * 2, stepY, stepWidth * 0.8, height * 0.2, 10);
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.fillText('PROTEIN', width * 0.05 + stepWidth * 2 + stepWidth * 0.4, stepY + height * 0.11);
    
    // Replication arrow (DNA to DNA)
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(width * 0.05 + stepWidth * 0.4, stepY - height * 0.1, height * 0.15, Math.PI * 0.7, Math.PI * 2.3);
    ctx.stroke();
    ctx.setLineDash([]);
    
    this.drawArrow(
        width * 0.05 + stepWidth * 0.55,
        stepY - height * 0.22,
        width * 0.05 + stepWidth * 0.4,
        stepY - height * 0.15,
        '#2196F3',
        'Replication',
        8
    );
    
    if(showLabels) {
        // Detailed information
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.textAlign = 'center';
        
        // DNA info
        this.ctx.fillText('Double helix', width * 0.05 + stepWidth * 0.4, stepY + height * 0.35);
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('Deoxyribonucleotides', width * 0.05 + stepWidth * 0.4, stepY + height * 0.38 + 13);
        this.ctx.fillText('A, T, G, C', width * 0.05 + stepWidth * 0.4, stepY + height * 0.38 + 26);
        
        // RNA info
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillText('Single strand', width * 0.05 + stepWidth * 1.4, stepY + height * 0.35);
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('Ribonucleotides', width * 0.05 + stepWidth * 1.4, stepY + height * 0.38 + 13);
        this.ctx.fillText('A, U, G, C', width * 0.05 + stepWidth * 1.4, stepY + height * 0.38 + 26);
        
        // Protein info
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillText('Polypeptide chain', width * 0.05 + stepWidth * 2.4, stepY + height * 0.35);
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('Amino acids', width * 0.05 + stepWidth * 2.4, stepY + height * 0.38 + 13);
        this.ctx.fillText('20 types', width * 0.05 + stepWidth * 2.4, stepY + height * 0.38 + 26);
    }
    
    this.ctx.restore();
}

renderPunnettSquareDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, crossType = 'monohybrid' } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    const title = crossType === 'monohybrid' ? 
        'Monohybrid Cross (Tt × Tt)' : 
        'Dihybrid Cross (RrYy × RrYy)';
    
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    const subtitle = crossType === 'monohybrid' ? 
        'One trait - Tall (T) vs short (t)' : 
        'Two traits - Round (R) vs wrinkled (r), Yellow (Y) vs green (y)';
    this.ctx.fillText(subtitle, width / 2, -10);
    
    // Draw Punnett square
    AnatomicalShapes.drawPunnettSquare(this.ctx, 0, 0, width, height, crossType);
    
    this.ctx.restore();
}

renderChromosomesDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showHomologousPairs = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    const title = showHomologousPairs ? 
        'Homologous Chromosome Pair' : 
        'Replicated Chromosome';
    
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, width / 2, -30);
    
    // Draw chromosome
    AnatomicalShapes.drawChromosome(this.ctx, 0, 0, width, height, showHomologousPairs);
    
    this.ctx.restore();
}

renderCrossingOverDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Crossing Over (Genetic Recombination)', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Occurs during Prophase I of Meiosis', width / 2, -10);
    
    // Draw crossing over
    AnatomicalShapes.drawCrossingOver(this.ctx, 0, 0, width, height);
    
    this.ctx.restore();
}

renderMutationsDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Types of DNA Mutations', width / 2, -30);
    
    // Draw mutations
    AnatomicalShapes.drawMutations(this.ctx, 0, 0, width, height);
    
    this.ctx.restore();
}

renderRecombinantDNADiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Recombinant DNA Technology', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Genetic Engineering Process', width / 2, -10);
    
    // Draw recombinant DNA process
    AnatomicalShapes.drawRecombinantDNA(this.ctx, 0, 0, width, height);
    
    this.ctx.restore();
}

renderPCRCycleDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PCR (Polymerase Chain Reaction)', width / 2, -30);
    
    // Subtitle
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('DNA Amplification Technique', width / 2, -10);
    
    // Draw PCR cycle
    AnatomicalShapes.drawPCRCycle(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Result box
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(width * 0.02, height * 0.82, width * 0.25, height * 0.15);
        
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Result:', width * 0.04, height * 0.85);
        
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('After 30 cycles:', width * 0.04, height * 0.88 + 13);
        this.ctx.fillText('~1 billion copies', width * 0.04, height * 0.88 + 26);
        this.ctx.fillText('of target DNA', width * 0.04, height * 0.88 + 39);
    }
    
    this.ctx.restore();
}


renderAnimalCellDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Animal Cell Structure', width / 2, -30);
    
    // Draw cell
    AnatomicalShapes.drawAnimalCell(this.ctx, width * 0.1, height * 0.1, width * 0.8, height * 0.8);
    
    if(showLabels) {
        // Labels with leader lines
        this.addLabel('Cell Membrane', width * 0.05, height * 0.5, '#E91E63', 'left');
        this.addLabel('Nucleus', width * 0.5, height * 0.35, '#9C27B0');
        this.addLabel('Nucleolus', width * 0.5, height * 0.45, '#4A148C');
        this.addLabel('Mitochondria', width * 0.75, height * 0.35, '#FF6347', 'right');
        this.addLabel('Endoplasmic\nReticulum', width * 0.8, height * 0.6, '#8D6E63', 'right');
        this.addLabel('Golgi Apparatus', width * 0.85, height * 0.25, '#FFA726', 'right');
        this.addLabel('Lysosomes', width * 0.22, height * 0.65, '#AB47BC', 'left');
        this.addLabel('Ribosomes', width * 0.3, height * 0.75, '#3E2723', 'left');
        this.addLabel('Centrioles', width * 0.4, height * 0.22, '#4CAF50', 'left');
    }
    
    this.ctx.restore();
}

renderProkaryoticVsEukaryoticDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Prokaryotic vs Eukaryotic Cells', width / 2, -30);
    
    // Draw comparison
    AnatomicalShapes.drawProkaryoticVsEukaryotic(this.ctx, 0, 0, width, height);
    
    if(showLabels) {
        // Key differences table at bottom
        const tableY = height * 0.92;
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.textAlign = 'left';
        
        this.ctx.fillText('Key Differences:', width * 0.1, tableY);
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.fillText('• Prokaryotes: No membrane-bound organelles, 1-10 μm', width * 0.1, tableY + 15);
        this.ctx.fillText('• Eukaryotes: Membrane-bound organelles, 10-100 μm', width * 0.55, tableY + 15);
    }
    
    this.ctx.restore();
}

renderCellMembraneDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Cell Membrane - Fluid Mosaic Model', width / 2, -30);
    
    // Draw membrane
    AnatomicalShapes.drawCellMembrane(this.ctx, width * 0.05, height * 0.15, width * 0.9, height * 0.7);
    
    if(showLabels) {
        this.addLabel('Phospholipid\nBilayer', width * 0.02, height * 0.5, '#1976D2', 'left');
        this.addLabel('Hydrophilic\nHead', width * 0.12, height * 0.35, '#1976D2', 'left');
        this.addLabel('Hydrophobic\nTail', width * 0.12, height * 0.5, '#FFA726', 'left');
        this.addLabel('Integral\nProtein', width * 0.52, height * 0.25, '#7B1FA2');
        this.addLabel('Peripheral\nProtein', width * 0.7, height * 0.2, '#E91E63', 'right');
        this.addLabel('Cholesterol', width * 0.88, height * 0.5, '#FFB74D', 'right');
        this.addLabel('Carbohydrate\nChain', width * 0.82, height * 0.15, '#4CAF50', 'right');
    }
    
    this.ctx.restore();
}

renderOsmosisDiffusionDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Passive Transport: Osmosis & Diffusion', width / 2, -30);
    
    // Draw diagram
    AnatomicalShapes.drawOsmosisDiffusion(this.ctx, 0, 0, width, height);
    
    this.ctx.restore();
}

renderActivePassiveTransportDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Active vs Passive Transport', width / 2, -30);
    
    // Draw comparison
    AnatomicalShapes.drawActivePassiveTransport(this.ctx, 0, 0, width, height);
    
    this.ctx.restore();
}

renderOrganellesDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, organelleType = 'mitochondria' } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    const organelleNames = {
        'nucleus': 'Nucleus - Control Center',
        'mitochondria': 'Mitochondrion - Powerhouse',
        'ribosome': 'Ribosome - Protein Factory',
        'endoplasmicReticulum': 'Endoplasmic Reticulum',
        'golgiApparatus': 'Golgi Apparatus',
        'lysosome': 'Lysosome - Digestive Organelle',
        'peroxisome': 'Peroxisome - Detoxification'
    };
    
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(organelleNames[organelleType] || 'Cell Organelle', width / 2, -20);
    
    // Draw organelle
    AnatomicalShapes.drawOrganelle(this.ctx, width * 0.1, height * 0.1, width * 0.8, height * 0.8, organelleType);
    
    if(showLabels) {
        // Add specific labels based on organelle type
        switch(organelleType) {
            case 'nucleus':
                this.addLabel('Nuclear\nEnvelope', width * 0.15, height * 0.3, '#7B1FA2', 'left');
                this.addLabel('Nuclear Pore', width * 0.75, height * 0.25, '#4A148C', 'right');
                this.addLabel('Nucleolus', width * 0.5, height * 0.6, '#4A148C');
                this.addLabel('Chromatin', width * 0.35, height * 0.4, '#7B1FA2', 'left');
                break;
            case 'mitochondria':
                this.addLabel('Outer\nMembrane', width * 0.12, height * 0.5, '#D84315', 'left');
                this.addLabel('Inner\nMembrane', width * 0.25, height * 0.4, '#BF360C', 'left');
                this.addLabel('Cristae', width * 0.3, height * 0.5, '#BF360C', 'left');
                this.addLabel('Matrix', width * 0.5, height * 0.5, '#FF9800');
                break;
            case 'ribosome':
                this.addLabel('Small\nSubunit', width * 0.5, height * 0.25, '#78909C');
                this.addLabel('Large\nSubunit', width * 0.5, height * 0.7, '#546E7A');
                this.addLabel('mRNA', width * 0.15, height * 0.5, '#4CAF50', 'left');
                break;
        }
    }
    
    // Function description
    const functions = {
        'nucleus': 'Stores genetic material (DNA) and controls cell activities',
        'mitochondria': 'Produces ATP through cellular respiration',
        'ribosome': 'Synthesizes proteins from amino acids',
        'endoplasmicReticulum': 'Protein and lipid synthesis and transport',
        'golgiApparatus': 'Modifies, packages, and ships proteins',
        'lysosome': 'Breaks down waste materials and cellular debris',
        'peroxisome': 'Breaks down fatty acids and detoxifies harmful substances'
    };
    
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(functions[organelleType], width / 2, height * 0.95);
    
    this.ctx.restore();
}

renderEnzymeActionDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, model = 'both' } = options;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Title
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Enzyme Action Models', width / 2, -30);
    
    // Draw enzyme action
    AnatomicalShapes.drawEnzymeAction(this.ctx, 0, 0, width, height, model);
    
    if(showLabels && model === 'both') {
        // Dividing line
        this.ctx.strokeStyle = '#BDC3C7';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(width * 0.05, height * 0.5);
        this.ctx.lineTo(width * 0.95, height * 0.5);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    // Key concepts
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Enzymes lower activation energy and are not consumed in reactions', width / 2, height * 0.98);
    
    this.ctx.restore();
}



  // ============================================================================
  // CARDIOVASCULAR SYSTEM DIAGRAMS
  // ============================================================================

 renderHeartAnatomyDiagram(x, y, width, height, options = {}) {
    const {
      showLabels = true,
      showBloodFlow = true,
      animate = false,
      chamber = 'wholeheart'
    } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    if(showLabels) {
      this.ctx.font = 'bold 24px Arial';
      this.ctx.fillStyle = '#2C3E50';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Human Heart Anatomy', width / 2, -20);
    }

    // Draw heart
    if(chamber === 'wholeheart') {
      AnatomicalShapes.drawHeart(this.ctx, 0, 0, width, height, 'wholeheart');
      
      if(showLabels) {
        this.addLabel('Right Atrium', width * 0.7, height * 0.2, '#8B4789');
        this.addLabel('Right Ventricle', width * 0.7, height * 0.6, '#8B4789');
        this.addLabel('Left Atrium', width * 0.2, height * 0.2, '#E74C3C');
        this.addLabel('Left Ventricle', width * 0.2, height * 0.6, '#E74C3C');
        this.addLabel('Septum', width * 0.5, height * 0.5, '#5D4E60');
      }

      // Blood flow arrows
      if(showBloodFlow) {
        // Deoxygenated blood (blue/purple) from body to right atrium
        this.drawArrow(width * 0.85, height * 0.15, width * 0.75, height * 0.22, '#8B4789', 'From Body');
        
        // To lungs from right ventricle
        this.drawArrow(width * 0.75, height * 0.4, width * 0.85, height * 0.35, '#8B4789', 'To Lungs');
        
        // Oxygenated blood (red) from lungs to left atrium
        this.drawArrow(width * 0.15, height * 0.15, width * 0.25, height * 0.22, '#E74C3C', 'From Lungs');
        
        // To body from left ventricle
        this.drawArrow(width * 0.25, height * 0.4, width * 0.15, height * 0.35, '#E74C3C', 'To Body');
      }
    } else {
      // Individual chamber view
      const state = chamber.includes('Atrium') ? 'deoxygenated' : 
                   chamber.includes('right') ? 'deoxygenated' : 'oxygenated';
      AnatomicalShapes.drawHeart(this.ctx, 0, 0, width, height, chamber, state);
      
      if(showLabels) {
        const chamberNames = {
          'rightAtrium': 'Right Atrium',
          'rightVentricle': 'Right Ventricle',
          'leftAtrium': 'Left Atrium',
          'leftVentricle': 'Left Ventricle'
        };
        this.addLabel(chamberNames[chamber], width / 2, -10, '#2C3E50');
      }
    }

    // Animation for heartbeat
    if(animate) {
      const scale = 1 + Math.sin(this.currentFrame * 0.1) * 0.05;
      this.ctx.scale(scale, scale);
    }

    this.ctx.restore();
  }



  renderCirculatorySystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showOxygenation = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Circulatory System', width / 2, -20);

    // Heart in center
    const heartWidth = width * 0.2;
    const heartHeight = height * 0.25;
    const heartX = width * 0.4;
    const heartY = height * 0.35;
    AnatomicalShapes.drawHeart(this.ctx, heartX, heartY, heartWidth, heartHeight, 'wholeheart');

    // Lungs
    const lungWidth = width * 0.15;
    const lungHeight = height * 0.2;
    AnatomicalShapes.drawLung(this.ctx, width * 0.15, height * 0.1, lungWidth, lungHeight, 'left');
    AnatomicalShapes.drawLung(this.ctx, width * 0.65, height * 0.1, lungWidth, lungHeight, 'right');

    // Body representation (simplified)
    this.ctx.strokeStyle = '#95A5A6';
    this.ctx.lineWidth = 3;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.35, height * 0.65, width * 0.3, height * 0.3, 10);
    this.ctx.fill();
    this.ctx.stroke();

    // Blood vessels - Pulmonary circulation (heart to lungs)
    // Right ventricle to lungs (deoxygenated)
    this.drawCurvedArrow(
      heartX + heartWidth * 0.7, heartY + heartHeight * 0.5,
      width * 0.25, height * 0.25,
      '#8B4789', 'Pulmonary Artery'
    );
    this.drawCurvedArrow(
      heartX + heartWidth * 0.7, heartY + heartHeight * 0.5,
      width * 0.7, height * 0.25,
      '#8B4789', ''
    );

    // Lungs to left atrium (oxygenated)
    this.drawCurvedArrow(
      width * 0.25, height * 0.32,
      heartX + heartWidth * 0.3, heartY + heartHeight * 0.3,
      '#E74C3C', 'Pulmonary Vein'
    );
    this.drawCurvedArrow(
      width * 0.7, height * 0.32,
      heartX + heartWidth * 0.3, heartY + heartHeight * 0.3,
      '#E74C3C', ''
    );

    // Systemic circulation (heart to body)
    // Left ventricle to body (oxygenated)
    this.drawCurvedArrow(
      heartX + heartWidth * 0.3, heartY + heartHeight * 0.7,
      width * 0.5, height * 0.65,
      '#E74C3C', 'Aorta'
    );

    // Body to right atrium (deoxygenated)
    this.drawCurvedArrow(
      width * 0.5, height * 0.95,
      heartX + heartWidth * 0.7, heartY + heartHeight * 0.7,
      '#8B4789', 'Vena Cava'
    );

    if(showLabels) {
      this.addLabel('Lungs', width * 0.25, height * 0.08, '#2C3E50');
      this.addLabel('Lungs', width * 0.7, height * 0.08, '#2C3E50');
      this.addLabel('Heart', heartX + heartWidth / 2, heartY - 10, '#2C3E50');
      this.addLabel('Body Tissues', width * 0.5, height * 0.8, '#2C3E50');
    }

    // Legend
    if(showOxygenation) {
      this.drawLegend(width * 0.02, height * 0.85, [
        { color: '#E74C3C', label: 'Oxygenated Blood' },
        { color: '#8B4789', label: 'Deoxygenated Blood' }
      ]);
    }

    this.ctx.restore();
  }

  renderBloodVesselComparison(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Blood Vessel Comparison', width / 2, -20);

    const vesselWidth = width * 0.15;
    const vesselHeight = height * 0.8;
    const spacing = width * 0.28;

    // Artery (oxygenated)
    AnatomicalShapes.drawBloodVessel(
      this.ctx,
      width * 0.1,
      height * 0.1,
      vesselWidth,
      vesselHeight,
      'artery',
      'oxygenated'
    );
    if(showLabels) {
      this.addLabel('Artery', width * 0.175, height * 0.05, '#E74C3C');
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Thick walls', width * 0.175, height * 0.95);
      this.ctx.fillText('High pressure', width * 0.175, height * 0.98);
    }

    // Vein (deoxygenated)
    AnatomicalShapes.drawBloodVessel(
      this.ctx,
      width * 0.1 + spacing,
      height * 0.1,
      vesselWidth,
      vesselHeight,
      'vein',
      'deoxygenated'
    );
    if(showLabels) {
      this.addLabel('Vein', width * 0.175 + spacing, height * 0.05, '#8B4789');
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Thin walls', width * 0.175 + spacing, height * 0.95);
      this.ctx.fillText('Has valves', width * 0.175 + spacing, height * 0.98);
    }

    // Capillary
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.1 + spacing * 2, height * 0.1);
    this.ctx.lineTo(width * 0.1 + spacing * 2, height * 0.9);
    this.ctx.stroke();

    // Capillary detail (single cell layer)
    this.ctx.strokeStyle = '#95A5A6';
    this.ctx.lineWidth = 2;
    for(let i = 0; i < 10; i++) {
      const cy = height * (0.15 + i * 0.075);
      this.ctx.beginPath();
      this.ctx.arc(width * 0.1 + spacing * 2, cy, 4, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    if(showLabels) {
      this.addLabel('Capillary', width * 0.1 + spacing * 2, height * 0.05, '#E74C3C');
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('One cell thick', width * 0.1 + spacing * 2, height * 0.95);
      this.ctx.fillText('Gas exchange', width * 0.1 + spacing * 2, height * 0.98);
    }

    this.ctx.restore();
  }

  // ============================================================================
  // RESPIRATORY SYSTEM DIAGRAMS
  // ============================================================================

  renderRespiratorySystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showGasExchange = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Respiratory System', width / 2, -20);

    // Trachea
    const tracheaWidth = width * 0.08;
    const tracheaHeight = height * 0.25;
    this.ctx.fillStyle = '#FFB6D9';
    this.ctx.strokeStyle = '#FF8FB6';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.46, height * 0.05, tracheaWidth, tracheaHeight, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Tracheal rings
    for(let i = 0; i < 8; i++) {
      this.ctx.strokeStyle = '#FF8FB6';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      const ringY = height * (0.08 + i * 0.03);
      this.ctx.arc(width * 0.5, ringY, tracheaWidth * 0.5, Math.PI, 0);
      this.ctx.stroke();
    }

    // Bronchi (branching)
    this.ctx.strokeStyle = '#FFB6D9';
    this.ctx.lineWidth = 6;
    // Left bronchus
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.48, height * 0.3);
    this.ctx.quadraticCurveTo(width * 0.35, height * 0.35, width * 0.25, height * 0.42);
    this.ctx.stroke();
    // Right bronchus
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.52, height * 0.3);
    this.ctx.quadraticCurveTo(width * 0.65, height * 0.35, width * 0.75, height * 0.42);
    this.ctx.stroke();

    // Lungs
    const lungWidth = width * 0.3;
    const lungHeight = height * 0.55;
    AnatomicalShapes.drawLung(this.ctx, width * 0.05, height * 0.4, lungWidth, lungHeight, 'left');
    AnatomicalShapes.drawLung(this.ctx, width * 0.65, height * 0.4, lungWidth, lungHeight, 'right');

    // Diaphragm
    this.ctx.strokeStyle = '#DC143C';
    this.ctx.fillStyle = 'rgba(220, 20, 60, 0.2)';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.05, height * 0.95);
    this.ctx.quadraticCurveTo(width * 0.5, height * 1.05, width * 0.95, height * 0.95);
    this.ctx.fill();
    this.ctx.stroke();

    if(showLabels) {
      this.addLabel('Trachea', width * 0.5, height * 0.02, '#2C3E50');
      this.addLabel('Bronchi', width * 0.5, height * 0.35, '#2C3E50');
      this.addLabel('Left Lung', width * 0.2, height * 0.38, '#2C3E50');
      this.addLabel('Right Lung', width * 0.8, height * 0.38, '#2C3E50');
      this.addLabel('Diaphragm', width * 0.5, height * 0.98, '#2C3E50');
    }

    // Gas exchange inset
    if(showGasExchange) {
      this.drawGasExchangeInset(width * 0.65, height * 0.05, width * 0.3, height * 0.25);
    }

    this.ctx.restore();
  }

  drawGasExchangeInset(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Border
    this.ctx.strokeStyle = '#34495E';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, width, height, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Title
    this.ctx.font = 'bold 12px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Gas Exchange in Alveoli', width / 2, 15);

    // Alveolus
    this.ctx.strokeStyle = '#FFB6D9';
    this.ctx.fillStyle = 'rgba(255, 182, 217, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.55, width * 0.18, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Capillary around alveolus
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.55, width * 0.22, 0, Math.PI * 2);
    this.ctx.stroke();

    // O2 molecules entering blood
    this.ctx.fillStyle = '#3498DB';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText('O₂', width * 0.25, height * 0.45);
    this.drawArrow(width * 0.25, height * 0.48, width * 0.25, height * 0.58, '#3498DB');

    // CO2 molecules leaving blood
    this.ctx.fillStyle = '#E67E22';
    this.ctx.fillText('CO₂', width * 0.35, height * 0.65);
    this.drawArrow(width * 0.35, height * 0.62, width * 0.35, height * 0.52, '#E67E22');

    // Red blood cell
    AnatomicalShapes.drawRedBloodCell(this.ctx, width * 0.45, height * 0.55, 8);

    // Labels
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Alveolus', width * 0.5, height * 0.4);
    this.ctx.fillText('Capillary', width * 0.5, height * 0.7);

    this.ctx.restore();
  }

  // ============================================================================
  // DIGESTIVE SYSTEM DIAGRAMS
  // ============================================================================

  renderDigestiveSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showPath = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Digestive System', width / 2, -20);

    // Esophagus
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.fillRect(width * 0.45, 0, width * 0.1, height * 0.15);

    // Stomach
    AnatomicalShapes.drawStomach(this.ctx, width * 0.35, height * 0.14, width * 0.3, height * 0.2);

    // Liver (overlapping stomach area)
    AnatomicalShapes.drawLiver(this.ctx, width * 0.15, height * 0.08, width * 0.25, height * 0.18);

    // Pancreas (behind stomach)
    AnatomicalShapes.drawPancreas(this.ctx, width * 0.25, height * 0.24, width * 0.35, height * 0.08);

    // Small intestine
    AnatomicalShapes.drawIntestine(this.ctx, width * 0.25, height * 0.35, width * 0.5, height * 0.35, 'small');

    // Large intestine
    AnatomicalShapes.drawIntestine(this.ctx, width * 0.15, height * 0.3, width * 0.7, height * 0.65, 'large');

    if(showLabels) {
      this.addLabel('Esophagus', width * 0.5, -5, '#2C3E50');
      this.addLabel('Liver', width * 0.12, height * 0.12, '#8B4513');
      this.addLabel('Stomach', width * 0.35, height * 0.18, '#FFA07A');
      this.addLabel('Pancreas', width * 0.22, height * 0.28, '#FFDAB9');
      this.addLabel('Small\nIntestine', width * 0.5, height * 0.5, '#FFB6C1');
      this.addLabel('Large\nIntestine', width * 0.08, height * 0.55, '#E6A8B8');
    }

    // Digestive path arrow
    if(showPath) {
      this.ctx.strokeStyle = '#E74C3C';
      this.ctx.fillStyle = '#E74C3C';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.01);
      this.ctx.lineTo(width * 0.5, height * 0.14);
      this.ctx.quadraticCurveTo(width * 0.45, height * 0.24, width * 0.55, height * 0.34);
      this.ctx.quadraticCurveTo(width * 0.4, height * 0.5, width * 0.6, height * 0.65);
      this.ctx.quadraticCurveTo(width * 0.3, height * 0.4, width * 0.85, height * 0.5);
      this.ctx.quadraticCurveTo(width * 0.7, height * 0.7, width * 0.7, height * 0.88);
      this.ctx.stroke();
      
      this.ctx.setLineDash([]);
    }

    this.ctx.restore();
  }

  renderDigestiveOrganComparison(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Digestive Organs', width / 2, -20);

    const organWidth = width * 0.22;
    const organHeight = height * 0.4;
    const spacing = width * 0.25;

    // Stomach
    AnatomicalShapes.drawStomach(this.ctx, width * 0.02, height * 0.1, organWidth, organHeight);
    this.addLabel('Stomach', width * 0.13, height * 0.05, '#FFA07A');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Digests proteins', width * 0.13, height * 0.55);
    this.ctx.fillText('Acidic environment', width * 0.13, height * 0.58);

    // Liver
    AnatomicalShapes.drawLiver(this.ctx, width * 0.02 + spacing, height * 0.1, organWidth, organHeight);
    this.addLabel('Liver', width * 0.13 + spacing, height * 0.05, '#8B4513');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Produces bile', width * 0.13 + spacing, height * 0.55);
    this.ctx.fillText('Detoxifies blood', width * 0.13 + spacing, height * 0.58);

    // Pancreas
    AnatomicalShapes.drawPancreas(this.ctx, width * 0.02 + spacing * 2, height * 0.18, organWidth * 1.3, organHeight * 0.6);
    this.addLabel('Pancreas', width * 0.13 + spacing * 2.2, height * 0.05, '#FFDAB9');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Digestive enzymes', width * 0.13 + spacing * 2.2, height * 0.55);
    this.ctx.fillText('Insulin production', width * 0.13 + spacing * 2.2, height * 0.58);

    // Small intestine cross-section
    this.ctx.strokeStyle = '#FFB6C1';
    this.ctx.fillStyle = '#FFD4E5';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.13, height * 0.78, organWidth * 0.4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Villi
    for(let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const vx = width * 0.13 + Math.cos(angle) * organWidth * 0.25;
      const vy = height * 0.78 + Math.sin(angle) * organWidth * 0.25;
      this.ctx.fillStyle = '#FFA4B0';
      this.ctx.beginPath();
      this.ctx.moveTo(vx, vy);
      this.ctx.lineTo(vx + Math.cos(angle) * 8, vy + Math.sin(angle) * 8);
      this.ctx.lineTo(vx + Math.cos(angle + 0.3) * 5, vy + Math.sin(angle + 0.3) * 5);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.addLabel('Small Intestine', width * 0.13, height * 0.65, '#FFB6C1');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Nutrient absorption', width * 0.13, height * 0.92);
    this.ctx.fillText('Villi increase surface', width * 0.13, height * 0.95);

    this.ctx.restore();
  }

  // ============================================================================
  // NERVOUS SYSTEM DIAGRAMS
  // ============================================================================

  renderNervousSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showSignal = false } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Central Nervous System', width / 2, -20);

    // Brain
    const brainWidth = width * 0.35;
    const brainHeight = height * 0.3;
    AnatomicalShapes.drawBrain(this.ctx, width * 0.32, height * 0.05, brainWidth, brainHeight);

    // Spinal cord
    const spineWidth = width * 0.12;
    const spineHeight = height * 0.6;
    AnatomicalShapes.drawSkeleton(this.ctx, width * 0.44, height * 0.35, spineWidth, spineHeight, 'spine');

    // Peripheral nerves
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 2;

    // Nerves branching from spinal cord
    for(let i = 0; i < 12; i++) {
      const ny = height * (0.4 + i * 0.045);
      
      // Left side
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.44, ny);
      this.ctx.quadraticCurveTo(width * 0.3, ny + height * 0.02, width * 0.15, ny + height * 0.05);
      this.ctx.stroke();

      // Right side
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.56, ny);
      this.ctx.quadraticCurveTo(width * 0.7, ny + height * 0.02, width * 0.85, ny + height * 0.05);
      this.ctx.stroke();
    }

    // Nerve signal animation
    if(showSignal) {
      const signalY = height * (0.4 + (this.currentFrame % 60) / 5);
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      this.ctx.arc(width * 0.5, signalY, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if(showLabels) {
      this.addLabel('Brain', width * 0.5, height * 0.02, '#2C3E50');
      this.addLabel('Spinal Cord', width * 0.5, height * 0.33, '#2C3E50');
      this.addLabel('Peripheral\nNerves', width * 0.1, height * 0.5, '#FFD700');
    }

    this.ctx.restore();
  }

  renderNeuronDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showSignal = false } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Neuron Structure', width / 2, -20);

    // Draw neuron
    AnatomicalShapes.drawNeuron(this.ctx, 0, 0, width, height);

    if(showLabels) {
      // Dendrites label
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.25, height * 0.3);
      this.ctx.lineTo(width * 0.1, height * 0.25);
      this.ctx.stroke();
      this.addLabel('Dendrites\n(receive signals)', width * 0.02, height * 0.23, '#2C3E50', 'left');

      // Cell body label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.65, height * 0.5);
      this.ctx.lineTo(width * 0.8, height * 0.5);
      this.ctx.stroke();
      this.addLabel('Cell Body\n(soma)', width * 0.82, height * 0.48, '#2C3E50', 'left');

      // Nucleus label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.5);
      this.ctx.lineTo(width * 0.7, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Nucleus', width * 0.72, height * 0.58, '#2C3E50', 'left');

      // Axon label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.65, height * 0.8);
      this.ctx.lineTo(width * 0.8, height * 0.8);
      this.ctx.stroke();
      this.addLabel('Axon\n(transmits signals)', width * 0.82, height * 0.78, '#2C3E50', 'left');

      // Myelin sheath label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.68);
      this.ctx.lineTo(width * 0.7, height * 0.65);
      this.ctx.stroke();
      this.addLabel('Myelin Sheath', width * 0.72, height * 0.63, '#2C3E50', 'left');

      // Axon terminals label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.45, height * 0.98);
      this.ctx.lineTo(width * 0.3, height * 0.95);
      this.ctx.stroke();
      this.addLabel('Axon Terminals\n(synaptic buttons)', width * 0.02, height * 0.93, '#2C3E50', 'left');
    }

    // Signal animation
    if(showSignal) {
      const signalProgress = (this.currentFrame % 60) / 60;
      const signalY = height * (0.3 + signalProgress * 0.68);
      
      this.ctx.fillStyle = '#FFD700';
      this.ctx.shadowColor = '#FFD700';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.arc(width * 0.5, signalY, 6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    this.ctx.restore();
  }

  // ============================================================================
  // SKELETAL SYSTEM DIAGRAMS
  // ============================================================================

  renderSkeletalSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, bone = 'skull' } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    const boneNames = {
      'skull': 'Human Skull',
      'femur': 'Femur (Thigh Bone)',
      'ribcage': 'Ribcage',
      'spine': 'Vertebral Column'
    };

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(boneNames[bone] || 'Skeletal System', width / 2, -20);

    // Draw bone
    AnatomicalShapes.drawSkeleton(this.ctx, 0, 0, width, height, bone);

    if(showLabels) {
      switch(bone) {
        case 'skull':
          this.addLabel('Cranium', width * 0.5, height * 0.15, '#2C3E50');
          this.addLabel('Eye Socket', width * 0.35, height * 0.42, '#2C3E50');
          this.addLabel('Nasal Cavity', width * 0.5, height * 0.57, '#2C3E50');
          this.addLabel('Mandible', width * 0.5, height * 0.85, '#2C3E50');
          break;
        case 'femur':
          this.addLabel('Femoral Head', width * 0.3, height * 0.15, '#2C3E50');
          this.addLabel('Greater\nTrochanter', width * 0.7, height * 0.18, '#2C3E50');
          this.addLabel('Shaft', width * 0.7, height * 0.5, '#2C3E50');
          this.addLabel('Condyles', width * 0.5, height * 0.88, '#2C3E50');
          break;
        case 'ribcage':
          this.addLabel('Sternum', width * 0.5, height * 0.3, '#2C3E50');
          this.addLabel('Ribs', width * 0.15, height * 0.5, '#2C3E50');
          this.addLabel('Costal\nCartilage', width * 0.75, height * 0.35, '#2C3E50');
          break;
        case 'spine':
          this.addLabel('Cervical\nVertebrae', width * 0.7, height * 0.15, '#2C3E50');
          this.addLabel('Thoracic\nVertebrae', width * 0.7, height * 0.4, '#2C3E50');
          this.addLabel('Lumbar\nVertebrae', width * 0.7, height * 0.65, '#2C3E50');
          this.addLabel('Sacrum', width * 0.7, height * 0.85, '#2C3E50');
          break;
      }
    }

    this.ctx.restore();
  }

  renderBoneStructureDiagram(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Bone Structure (Cross-Section)', width / 2, -20);

    // Long bone cross-section
    const boneColor = { base: '#F5F5DC', light: '#FFFAF0', dark: '#D3D3C0' };

    // Compact bone (outer layer)
    const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, boneColor.light);
    gradient.addColorStop(0.5, boneColor.base);
    gradient.addColorStop(1, boneColor.dark);
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.2, height * 0.15, width * 0.6, height * 0.7, 10);
    this.ctx.fill();

    // Medullary cavity (marrow)
    this.ctx.fillStyle = '#FFE4C4';
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.35, height * 0.25, width * 0.3, height * 0.5, 5);
    this.ctx.fill();

    // Yellow marrow (fat)
    this.ctx.fillStyle = '#FFEFD5';
    for(let i = 0; i < 8; i++) {
      const mx = width * (0.4 + Math.random() * 0.2);
      const my = height * (0.3 + Math.random() * 0.4);
      this.ctx.beginPath();
      this.ctx.arc(mx, my, 8, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Periosteum (outer membrane)
    this.ctx.strokeStyle = '#CD853F';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.19, height * 0.14, width * 0.62, height * 0.72, 10);
    this.ctx.stroke();

    // Haversian canals (in compact bone)
    this.ctx.fillStyle = '#FFB6C1';
    for(let i = 0; i < 6; i++) {
      for(let j = 0; j < 3; j++) {
        const hx = width * (0.23 + j * 0.06);
        const hy = height * (0.2 + i * 0.1);
        this.ctx.beginPath();
        this.ctx.arc(hx, hy, 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Concentric lamellae around canal
        for(let k = 1; k <= 2; k++) {
          this.ctx.strokeStyle = 'rgba(211, 211, 192, 0.5)';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.arc(hx, hy, 2 + k * 3, 0, Math.PI * 2);
          this.ctx.stroke();
        }
      }
    }

    // Spongy bone (at ends)
    this.ctx.strokeStyle = boneColor.dark;
    this.ctx.lineWidth = 2;
    // Top end
    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 3; j++) {
        const sx = width * (0.25 + i * 0.06);
        const sy = height * (0.05 + j * 0.03);
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(sx + 10, sy + 5);
        this.ctx.stroke();
      }
    }

    // Labels
    this.addLabel('Compact Bone', width * 0.05, height * 0.5, '#2C3E50', 'left');
    this.addLabel('Medullary Cavity\n(Bone Marrow)', width * 0.5, height * 0.5, '#2C3E50');
    this.addLabel('Periosteum', width * 0.15, height * 0.15, '#CD853F', 'left');
    this.addLabel('Haversian\nCanal', width * 0.23, height * 0.3, '#FFB6C1', 'center');
    this.addLabel('Spongy Bone', width * 0.5, height * 0.05, '#2C3E50');

    this.ctx.restore();
  }

  // ============================================================================
  // MUSCULAR SYSTEM DIAGRAMS
  // ============================================================================

  renderMuscularSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, type = 'skeletal' } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    const typeNames = {
      'skeletal': 'Skeletal Muscle',
      'cardiac': 'Cardiac Muscle',
      'smooth': 'Smooth Muscle'
    };

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(typeNames[type] || 'Muscle Types', width / 2, -20);

    if(type === 'skeletal') {
      // Draw bicep
      AnatomicalShapes.drawMuscle(this.ctx, width * 0.3, height * 0.1, width * 0.4, height * 0.8, 'bicep');

      if(showLabels) {
        this.addLabel('Origin\n(Tendon)', width * 0.5, height * 0.05, '#2C3E50');
        this.addLabel('Muscle Belly', width * 0.75, height * 0.5, '#DC143C');
        this.addLabel('Insertion\n(Tendon)', width * 0.5, height * 0.95, '#2C3E50');
        
        // Muscle fiber detail inset
        this.drawMuscleFiberInset(width * 0.02, height * 0.1, width * 0.25, height * 0.3);
      }
    } else if(type === 'cardiac') {
      AnatomicalShapes.drawMuscle(this.ctx, width * 0.25, height * 0.1, width * 0.5, height * 0.8, 'heart');

      if(showLabels) {
        this.addLabel('Branching\nFibers', width * 0.75, height * 0.3, '#DC143C');
        this.addLabel('Intercalated\nDiscs', width * 0.75, height * 0.5, '#A52A2A');
      }
    } else if(type === 'smooth') {
      AnatomicalShapes.drawMuscle(this.ctx, width * 0.25, height * 0.1, width * 0.5, height * 0.8, 'smooth');

      if(showLabels) {
        this.addLabel('Spindle-shaped\nCells', width * 0.75, height * 0.4, '#DC143C');
        this.addLabel('No Striations', width * 0.75, height * 0.6, '#A52A2A');
      }
    }

    this.ctx.restore();
  }

  drawMuscleFiberInset(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Border
    this.ctx.strokeStyle = '#34495E';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, width, height, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Title
    this.ctx.font = 'bold 11px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Muscle Fiber Detail', width / 2, 12);

    // Muscle fiber
    this.ctx.fillStyle = '#DC143C';
    this.ctx.strokeStyle = '#A52A2A';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.15, height * 0.2, width * 0.7, height * 0.7, 3);
    this.ctx.fill();
    this.ctx.stroke();

    // Myofibrils (internal structures)
    for(let i = 0; i < 4; i++) {
      const fx = width * (0.25 + i * 0.15);
      this.ctx.strokeStyle = '#8B0000';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(fx, height * 0.25);
      this.ctx.lineTo(fx, height * 0.85);
      this.ctx.stroke();
    }

    // Striations (Z-lines)
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.lineWidth = 1;
    for(let i = 0; i < 8; i++) {
      const fy = height * (0.3 + i * 0.08);
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.2, fy);
      this.ctx.lineTo(width * 0.8, fy);
      this.ctx.stroke();
    }

    // Nuclei
    this.ctx.fillStyle = '#4B0082';
    this.ctx.beginPath();
    this.ctx.ellipse(width * 0.3, height * 0.4, width * 0.05, height * 0.06, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(width * 0.6, height * 0.6, width * 0.05, height * 0.06, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Labels
    this.ctx.font = '9px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Sarcomere', width * 0.05, height * 0.5);
    this.ctx.fillText('Nucleus', width * 0.87, height * 0.45);

    this.ctx.restore();
  }

  renderMuscleContractionDiagram(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Muscle Contraction (Sliding Filament)', width / 2, -20);

    const sarcomereHeight = height * 0.35;

    // Relaxed sarcomere
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('RELAXED', width * 0.05, height * 0.15);

    this.drawSarcomere(width * 0.1, height * 0.18, width * 0.8, sarcomereHeight, false);

    // Contracted sarcomere
    this.ctx.fillText('CONTRACTED', width * 0.05, height * 0.6);
    this.drawSarcomere(width * 0.1, height * 0.63, width * 0.8, sarcomereHeight, true);

    // Arrows showing direction
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.fillStyle = '#E74C3C';
    this.ctx.lineWidth = 3;
    
    // Left arrow
    this.drawArrow(width * 0.15, height * 0.55, width * 0.35, height * 0.55, '#E74C3C', '', 10);
    // Right arrow
    this.drawArrow(width * 0.85, height * 0.55, width * 0.65, height * 0.55, '#E74C3C', '', 10);

    this.ctx.restore();
  }

  drawSarcomere(x, y, width, height, contracted = false) {
    this.ctx.save();
    this.ctx.translate(x, y);

    const overlapWidth = contracted ? width * 0.35 : width * 0.15;

    // Z-lines (boundaries)
    this.ctx.strokeStyle = '#2C3E50';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, height);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(width, 0);
    this.ctx.lineTo(width, height);
    this.ctx.stroke();

    // M-line (center)
    this.ctx.beginPath();
    this.ctx.moveTo(width / 2, height * 0.3);
    this.ctx.lineTo(width / 2, height * 0.7);
    this.ctx.stroke();

    // Thin filaments (actin - red)
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.lineWidth = 4;
    for(let i = 0; i < 5; i++) {
      const yPos = height * (0.2 + i * 0.15);
      // From left Z-line
      this.ctx.beginPath();
      this.ctx.moveTo(5, yPos);
      this.ctx.lineTo(overlapWidth + width * 0.1, yPos);
      this.ctx.stroke();
      // From right Z-line
      this.ctx.beginPath();
      this.ctx.moveTo(width - 5, yPos);
      this.ctx.lineTo(width - overlapWidth - width * 0.1, yPos);
      this.ctx.stroke();
    }

    // Thick filaments (myosin - blue)
    this.ctx.strokeStyle = '#3498DB';
    this.ctx.lineWidth = 6;
    for(let i = 0; i < 4; i++) {
      const yPos = height * (0.25 + i * 0.17);
      this.ctx.beginPath();
      this.ctx.moveTo(width / 2 - width * 0.2, yPos);
      this.ctx.lineTo(width / 2 + width * 0.2, yPos);
      this.ctx.stroke();

      // Myosin heads
      this.ctx.fillStyle = '#2980B9';
      for(let j = 0; j < 6; j++) {
        const headX = width / 2 - width * 0.15 + j * width * 0.06;
        this.ctx.beginPath();
        this.ctx.arc(headX, yPos - 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(headX, yPos + 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Labels
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Z', 0, -5);
    this.ctx.fillText('Z', width, -5);
    this.ctx.fillText('M', width / 2, -5);

    this.ctx.restore();
  }

  // ============================================================================
  // CELLULAR & MICROSCOPIC DIAGRAMS
  // ============================================================================

  renderCellDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, type = 'generic' } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Animal Cell Structure', width / 2, -20);

    // Draw cell
    const cellSize = Math.min(width, height) * 0.4;
    AnatomicalShapes.drawCell(this.ctx, width / 2, height / 2, cellSize, type);

    if(showLabels) {
      // Cell membrane
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.75, height * 0.35);
      this.ctx.lineTo(width * 0.9, height * 0.3);
      this.ctx.stroke();
      this.addLabel('Cell Membrane', width * 0.92, height * 0.28, '#2C3E50', 'left');

      // Nucleus
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.45);
      this.ctx.lineTo(width * 0.7, height * 0.15);
      this.ctx.stroke();
      this.addLabel('Nucleus', width * 0.72, height * 0.13, '#2C3E50', 'left');

      // Mitochondria
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.3, height * 0.6);
      this.ctx.lineTo(width * 0.1, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Mitochondrion', width * 0.02, height * 0.58, '#2C3E50', 'left');

      // Endoplasmic reticulum
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.65, height * 0.65);
      this.ctx.lineTo(width * 0.9, height * 0.7);
      this.ctx.stroke();
      this.addLabel('Endoplasmic\nReticulum', width * 0.92, height * 0.68, '#2C3E50', 'left');

      // Golgi apparatus
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.3, height * 0.7);
      this.ctx.lineTo(width * 0.1, height * 0.8);
      this.ctx.stroke();
      this.addLabel('Golgi Apparatus', width * 0.02, height * 0.78, '#2C3E50', 'left');
    }

    this.ctx.restore();
  }

  renderBloodCellsDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Blood Cells', width / 2, -20);

    const cellSpacing = width * 0.2;
    const startX = width * 0.15;
    const cellY = height * 0.4;

    // Red Blood Cell
    AnatomicalShapes.drawRedBloodCell(this.ctx, startX, cellY, 25);
    if(showLabels) {
      this.addLabel('Red Blood Cell\n(Erythrocyte)', startX, cellY + 50, '#E74C3C');
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Carries oxygen', startX, cellY + 75);
    }

    // White Blood Cells
    const wbcTypes = ['neutrophil', 'lymphocyte', 'monocyte'];
    const wbcNames = ['Neutrophil', 'Lymphocyte', 'Monocyte'];
    
    for(let i = 0; i < 3; i++) {
      const cellX = startX + (i + 1) * cellSpacing;
      AnatomicalShapes.drawWhiteBloodCell(this.ctx, cellX, cellY, 25, wbcTypes[i]);
      if(showLabels) {
        this.addLabel(`${wbcNames[i]}\n(White Blood Cell)`, cellX, cellY + 50, '#D0D0F8');
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.textAlign = 'center';
        const functions = ['Fights bacteria', 'Immune response', 'Phagocytosis'];
        this.ctx.fillText(functions[i], cellX, cellY + 75);
      }
    }

    // Platelets
    for(let i = 0; i < 5; i++) {
      const px = width * (0.3 + i * 0.08);
      const py = height * 0.8;
      AnatomicalShapes.drawPlatelet(this.ctx, px, py, 8);
    }
    if(showLabels) {
      this.addLabel('Platelets\n(Thrombocytes)', width * 0.5, height * 0.85, '#DDA0DD');
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Blood clotting', width * 0.5, height * 0.92);
    }

    this.ctx.restore();
  }

  renderDNADiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('DNA Double Helix', width / 2, -20);

    // Draw DNA
    AnatomicalShapes.drawDNA(this.ctx, 0, 0, width, height);

    if(showLabels) {
      // Sugar-phosphate backbone
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.25, height * 0.2);
      this.ctx.lineTo(width * 0.1, height * 0.2);
      this.ctx.stroke();
      this.addLabel('Sugar-Phosphate\nBackbone', width * 0.02, height * 0.18, '#4169E1', 'left');

      // Base pairs
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.4);
      this.ctx.lineTo(width * 0.7, height * 0.4);
      this.ctx.stroke();
      this.addLabel('Base Pairs', width * 0.72, height * 0.38, '#808080', 'left');

      // Base pair legend
      this.drawLegend(width * 0.65, height * 0.65, [
        { color: '#FF6B6B', label: 'Adenine (A)' },
        { color: '#4ECDC4', label: 'Thymine (T)' },
        { color: '#FFD93D', label: 'Guanine (G)' },
        { color: '#95E1D3', label: 'Cytosine (C)' }
      ]);

      // Complementary base pairing note
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'left';
      this.ctx.fillText('A pairs with T', width * 0.65, height * 0.55);
      this.ctx.fillText('G pairs with C', width * 0.65, height * 0.58);
    }

    this.ctx.restore();
  }

  // ============================================================================
  // INTEGUMENTARY SYSTEM (SKIN) DIAGRAMS
  // ============================================================================

  renderSkinDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Skin Structure (Cross-Section)', width / 2, -20);

    // Draw skin
    AnatomicalShapes.drawSkin(this.ctx, 0, 0, width, height, 'cross-section');

    if(showLabels) {
      // Layer labels
      this.addLabel('Epidermis', width * 0.85, height * 0.08, '#F5D0C5', 'left');
      this.addLabel('Dermis', width * 0.85, height * 0.45, '#E8B4A8', 'left');
      this.addLabel('Hypodermis\n(Subcutaneous)', width * 0.85, height * 0.85, '#FFE4B5', 'left');

      // Structure labels
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      
      // Hair follicle
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.32, height * 0.3);
      this.ctx.lineTo(width * 0.15, height * 0.25);
      this.ctx.stroke();
      this.addLabel('Hair Follicle', width * 0.02, height * 0.23, '#8B4513', 'left');

      // Sebaceous gland
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.36, height * 0.22);
      this.ctx.lineTo(width * 0.45, height * 0.18);
      this.ctx.stroke();
      this.addLabel('Oil Gland', width * 0.47, height * 0.16, '#F0E68C', 'left');

      // Sweat gland
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.7, height * 0.6);
      this.ctx.lineTo(width * 0.8, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Sweat Gland', width * 0.82, height * 0.58, '#87CEEB', 'left');

      // Blood vessels
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.4);
      this.ctx.lineTo(width * 0.6, height * 0.35);
      this.ctx.stroke();
      this.addLabel('Blood Vessels', width * 0.62, height * 0.33, '#E74C3C', 'left');

      // Nerve endings
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.2, height * 0.2);
      this.ctx.lineTo(width * 0.1, height * 0.15);
      this.ctx.stroke();
      this.addLabel('Nerve Endings', width * 0.02, height * 0.13, '#FFD700', 'left');
    }

    this.ctx.restore();
  }

  // ============================================================================
  // URINARY SYSTEM DIAGRAMS
  // ============================================================================

  renderUrinarySystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Urinary System', width / 2, -20);

    // Kidneys
    const kidneyWidth = width * 0.2;
    const kidneyHeight = height * 0.35;
    AnatomicalShapes.drawKidney(this.ctx, width * 0.15, height * 0.15, kidneyWidth, kidneyHeight, 'left');
    AnatomicalShapes.drawKidney(this.ctx, width * 0.65, height * 0.15, kidneyWidth, kidneyHeight, 'right');

    // Bladder
    const bladderWidth = width * 0.25;
    const bladderHeight = height * 0.3;
    AnatomicalShapes.drawBladder(this.ctx, width * 0.375, height * 0.6, bladderWidth, bladderHeight, 0.6);

    // Ureters connecting kidneys to bladder
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 4;
    // Left ureter
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.32, height * 0.48);
    this.ctx.quadraticCurveTo(width * 0.35, height * 0.55, width * 0.42, height * 0.65);
    this.ctx.stroke();
    // Right ureter
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.68, height * 0.48);
    this.ctx.quadraticCurveTo(width * 0.65, height * 0.55, width * 0.58, height * 0.65);
    this.ctx.stroke();

    // Urethra
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.5, height * 0.9);
    this.ctx.lineTo(width * 0.5, height * 0.98);
    this.ctx.stroke();

    if(showLabels) {
      this.addLabel('Kidneys', width * 0.5, height * 0.08, '#8B0000');
      this.addLabel('Ureters', width * 0.38, height * 0.55, '#FFD700');
      this.addLabel('Bladder', width * 0.5, height * 0.58, '#FFD700');
      this.addLabel('Urethra', width * 0.55, height * 0.94, '#FFD700');

      // Function notes
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Filters blood', width * 0.25, height * 0.52);
      this.ctx.fillText('Stores urine', width * 0.5, height * 0.95);
    }

    this.ctx.restore();
  }

  renderKidneyDetailDiagram(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Kidney Internal Structure', width / 2, -20);

    // Draw kidney
    AnatomicalShapes.drawKidney(this.ctx, width * 0.2, height * 0.1, width * 0.6, height * 0.8, 'left');

    // Labels with leader lines
    this.ctx.strokeStyle = '#2C3E50';
    this.ctx.lineWidth = 1;

    // Renal cortex
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.35, height * 0.3);
    this.ctx.lineTo(width * 0.15, height * 0.25);
    this.ctx.stroke();
    this.addLabel('Renal Cortex', width * 0.02, height * 0.23, '#A52A2A', 'left');

    // Renal medulla
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.45, height * 0.45);
    this.ctx.lineTo(width * 0.15, height * 0.45);
    this.ctx.stroke();
    this.addLabel('Renal Medulla\n(Pyramids)', width * 0.02, height * 0.43, '#8B0000', 'left');

    // Renal pelvis
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.65, height * 0.5);
    this.ctx.lineTo(width * 0.85, height * 0.5);
    this.ctx.stroke();
    this.addLabel('Renal Pelvis', width * 0.87, height * 0.48, '#FFD700', 'left');

    // Ureter
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.68, height * 0.75);
    this.ctx.lineTo(width * 0.85, height * 0.8);
    this.ctx.stroke();
    this.addLabel('Ureter', width * 0.87, height * 0.78, '#FFD700', 'left');

    // Renal artery
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.7, height * 0.42);
    this.ctx.lineTo(width * 0.85, height * 0.35);
    this.ctx.stroke();
    this.addLabel('Renal Artery', width * 0.87, height * 0.33, '#E74C3C', 'left');

    // Renal vein
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.7, height * 0.58);
    this.ctx.lineTo(width * 0.85, height * 0.65);
    this.ctx.stroke();
    this.addLabel('Renal Vein', width * 0.87, height * 0.63, '#8B4789', 'left');

    // Nephron inset
    this.drawNephronInset(width * 0.02, height * 0.55, width * 0.3, height * 0.4);

    this.ctx.restore();
  }

  drawNephronInset(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Border
    this.ctx.strokeStyle = '#34495E';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, width, height, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Title
    this.ctx.font = 'bold 11px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Nephron (Functional Unit)', width / 2, 12);

    // Glomerulus (ball of capillaries)
    this.ctx.fillStyle = '#E74C3C';
    this.ctx.strokeStyle = '#C0392B';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.25, width * 0.08, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Bowman's capsule
    this.ctx.strokeStyle = '#3498DB';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.25, width * 0.12, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Proximal convoluted tubule
    this.ctx.strokeStyle = '#F39C12';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.42, height * 0.25);
    for(let i = 0; i < 3; i++) {
      this.ctx.bezierCurveTo(
        width * (0.5 + i * 0.05), height * (0.3 + i * 0.03),
        width * (0.5 + i * 0.05), height * (0.35 + i * 0.03),
        width * (0.52 + i * 0.05), height * (0.37 + i * 0.03)
      );
    }
    this.ctx.stroke();

    // Loop of Henle
    this.ctx.strokeStyle = '#9B59B6';
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.67, height * 0.46);
    this.ctx.lineTo(width * 0.7, height * 0.65);
    this.ctx.lineTo(width * 0.6, height * 0.65);
    this.ctx.lineTo(width * 0.57, height * 0.46);
    this.ctx.stroke();

    // Distal convoluted tubule
    this.ctx.strokeStyle = '#1ABC9C';
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.57, height * 0.46);
    for(let i = 0; i < 2; i++) {
      this.ctx.bezierCurveTo(
        width * (0.5 - i * 0.08), height * (0.5 + i * 0.05),
        width * (0.5 - i * 0.08), height * (0.55 + i * 0.05),
        width * (0.45 - i * 0.08), height * (0.58 + i * 0.05)
      );
    }
    this.ctx.stroke();

    // Collecting duct
    this.ctx.strokeStyle = '#E67E22';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.29, height * 0.68);
    this.ctx.lineTo(width * 0.29, height * 0.9);
    this.ctx.stroke();

    // Labels
    this.ctx.font = '8px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Glomerulus', width * 0.3, height * 0.15);
    this.ctx.fillText('Loop of Henle', width * 0.63, height * 0.75);
    this.ctx.fillText('Collecting\nDuct', width * 0.29, height * 0.95);

    this.ctx.restore();
  }

  // ============================================================================
  // SENSORY ORGAN DIAGRAMS
  // ============================================================================

  renderEyeDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, pupilDilation = 0.3 } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Human Eye Anatomy', width / 2, -20);

    // Draw eye
    AnatomicalShapes.drawEye(this.ctx, width * 0.2, height * 0.2, width * 0.6, height * 0.6, pupilDilation);

    if(showLabels) {
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;

      // Cornea
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.35);
      this.ctx.lineTo(width * 0.7, height * 0.25);
      this.ctx.stroke();
      this.addLabel('Cornea', width * 0.72, height * 0.23, '#2C3E50', 'left');

      // Iris
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.6, height * 0.5);
      this.ctx.lineTo(width * 0.8, height * 0.5);
      this.ctx.stroke();
      this.addLabel('Iris', width * 0.82, height * 0.48, '#8B7355', 'left');

      // Pupil
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.5);
      this.ctx.lineTo(width * 0.3, height * 0.5);
      this.ctx.stroke();
      this.addLabel('Pupil', width * 0.02, height * 0.48, '#000000', 'left');

      // Lens
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.53, height * 0.6);
      this.ctx.lineTo(width * 0.7, height * 0.7);
      this.ctx.stroke();
      this.addLabel('Lens', width * 0.72, height * 0.68, '#2C3E50', 'left');

      // Retina
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.73, height * 0.55);
      this.ctx.lineTo(width * 0.85, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Retina', width * 0.87, height * 0.58, '#2C3E50', 'left');

      // Optic nerve
      this.ctx.strokeStyle = '#FFD700';
      this.ctx.lineWidth = 5;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.6);
      this.ctx.lineTo(width * 0.5, height * 0.85);
      this.ctx.stroke();
      
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.75);
      this.ctx.lineTo(width * 0.3, height * 0.8);
      this.ctx.stroke();
      this.addLabel('Optic Nerve', width * 0.02, height * 0.78, '#FFD700', 'left');
    }

    this.ctx.restore();
  }

  // ============================================================================
  // VALVE DIAGRAMS
  // ============================================================================

  renderHeartValvesDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Heart Valves', width / 2, -20);

    const valveSize = width * 0.18;
    const spacing = width * 0.25;

    // Atrioventricular valves
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('AV Valves', width * 0.25, height * 0.15);

    // Tricuspid valve (closed)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.08,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'atrioventricular',
      'closed'
    );
    this.addLabel('Tricuspid\n(Closed)', width * 0.17, height * 0.48, '#2C3E50');

    // Mitral valve (open)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.08 + spacing,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'mitral',
      'open'
    );
    this.addLabel('Mitral\n(Open)', width * 0.17 + spacing, height * 0.48, '#2C3E50');

    // Semilunar valves
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.fillText('Semilunar Valves', width * 0.75, height * 0.15);

    // Pulmonary valve (open)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.58,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'semilunar',
      'open'
    );
    this.addLabel('Pulmonary\n(Open)', width * 0.67, height * 0.48, '#2C3E50');

    // Aortic valve (closed)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.58 + spacing,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'semilunar',
      'closed'
    );
    this.addLabel('Aortic\n(Closed)', width * 0.67 + spacing, height * 0.48, '#2C3E50');

    // Function description
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Prevent backflow of blood through the heart', width / 2, height * 0.6);

    if(showLabels) {
      // Legend
      this.drawLegend(width * 0.3, height * 0.7, [
        { color: '#F5F5DC', label: 'Valve Leaflets' },
        { color: '#CD853F', label: 'Chordae Tendineae' },
        { color: '#DC143C', label: 'Papillary Muscle' }
      ]);
    }

    this.ctx.restore();
  }

  

  // ============================================================================
  // ANIMATION & RENDERING
  // ============================================================================

  animate() {
    this.currentFrame++;
    requestAnimationFrame(() => this.animate());
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  saveAsPNG(filename = 'anatomical-diagram.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvas.toDataURL();
    link.click();
  }
}

// ============================================================================
// ANATOMICAL DIAGRAMS REGISTRY - Comprehensive Anatomy Configuration System
// ============================================================================



