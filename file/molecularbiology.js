// Enhanced Molecular Biology Workbook - Comprehensive Cellular Molecules System
import * as math from 'mathjs';

export class EnhancedMolecularBiologyWorkbook {
    constructor(options = {}) {
        this.width = options.width || 1400;
        this.height = options.height || 2000;
        this.theme = options.theme || "molecular";
        this.cellWidth = 200;
        this.cellHeight = 28;
        this.headerHeight = 35;
        this.contentHeight = 40;
        this.rowLabelWidth = 60;
        this.fontSize = 12;
        this.contentFontSize = 14;

        this.currentProblem = null;
        this.currentContent = null;
        this.contentSteps = [];
        this.currentWorkbook = null;
        this.diagramData = null;
        this.currentExperiment = null;

        // Enhanced explanation options
        this.explanationLevel = options.explanationLevel || 'intermediate';
        this.includeVisualizations = options.includeVisualizations !== false;
        this.includeConceptualConnections = options.includeConceptualConnections !== false;
        this.includeExamples = options.includeExamples !== false;
        this.includeComparisons = options.includeComparisons !== false;
        this.includeCommonMisconceptions = options.includeCommonMisconceptions !== false;
        this.includePedagogicalNotes = options.includePedagogicalNotes !== false;
        this.includeExperiments = options.includeExperiments !== false;
        this.detailLevel = options.detailLevel || 'detailed';

        // Adaptive learning features
        this.adaptiveDifficulty = options.adaptiveDifficulty !== false;
        this.metacognitiveSupport = options.metacognitiveSupport !== false;
        this.contextualLearning = options.contextualLearning !== false;
        this.assessmentFeedback = options.assessmentFeedback !== false;

        // Learning state tracking
        this.learnerProfile = {
            currentLevel: 'intermediate',
            masteredTopics: [],
            strugglingTopics: [],
            preferredLearningStyle: 'visual',
            progressHistory: []
        };

        this.molecularSymbols = this.initializeMolecularSymbols();
        this.setThemeColors();
        this.initializeMolecularTopics();
        this.initializeMolecularLessons();
        this.initializeMolecularExperiments();
        this.initializeMisconceptionDatabase();
        this.initializeMetacognitivePrompts();
        this.initializeContextualScenarios();
        this.initializeAssessmentRubrics();
    }



    initializeMolecularSymbols() {
        return {
            // Greek letters
            'alpha': 'α',
            'beta': 'β',
            'gamma': 'γ',
            'delta': 'Δ',
            'Delta': 'Δ',
            'lambda': 'λ',
            'mu': 'μ',
            'pi': 'π',
            
            // Arrows
            'arrow': '→',
            'reversible': '⇌',
            'doubleArrow': '↔',
            
            // Math symbols
            'plus': '+',
            'minus': '−',
            'plusminus': '±',
            'approximately': '≈',
            'proportional': '∝',
            'infinity': '∞',
            'degree': '°',
            
            // Chemical formulas
            'H2O': 'H₂O',
            'CO2': 'CO₂',
            'O2': 'O₂',
            'N2': 'N₂',
            'H+': 'H⁺',
            'OH-': 'OH⁻',
            
            // Biochemical molecules
            'ATP': 'ATP',
            'ADP': 'ADP',
            'AMP': 'AMP',
            'NAD+': 'NAD⁺',
            'NADH': 'NADH',
            'NADP+': 'NADP⁺',
            'NADPH': 'NADPH',
            'FAD': 'FAD',
            'FADH2': 'FADH₂',
            'CoA': 'CoA',
            'acetyl-CoA': 'acetyl-CoA',
            
            // Carbohydrates
            'glucose': 'C₆H₁₂O₆',
            'fructose': 'C₆H₁₂O₆',
            'sucrose': 'C₁₂H₂₂O₁₁',
            'maltose': 'C₁₂H₂₂O₁₁',
            'lactose': 'C₁₂H₂₂O₁₁',
            
            // Nucleic acids
            'DNA': 'DNA',
            'RNA': 'RNA',
            'mRNA': 'mRNA',
            'tRNA': 'tRNA',
            'rRNA': 'rRNA',
            'ATP': 'ATP',
            'GTP': 'GTP',
            'CTP': 'CTP',
            'UTP': 'UTP',
            
            // Amino acids (3-letter)
            'Ala': 'Ala',
            'Arg': 'Arg',
            'Asn': 'Asn',
            'Asp': 'Asp',
            'Cys': 'Cys',
            'Gln': 'Gln',
            'Glu': 'Glu',
            'Gly': 'Gly',
            'His': 'His',
            'Ile': 'Ile',
            'Leu': 'Leu',
            'Lys': 'Lys',
            'Met': 'Met',
            'Phe': 'Phe',
            'Pro': 'Pro',
            'Ser': 'Ser',
            'Thr': 'Thr',
            'Trp': 'Trp',
            'Tyr': 'Tyr',
            'Val': 'Val'
        };
    }

    initializeBiologyTopics() {
        this.molecularTopics = {
            carbohydrates: {
                patterns: [
                    /carbohydrate/i,
                    /sugar|glucose|fructose|sucrose/i,
                    /monosaccharide|disaccharide|polysaccharide/i,
                    /starch|glycogen|cellulose/i
                ],
                handler: this.handleCarbohydrates.bind(this),
                name: 'Carbohydrates',
                category: 'macromolecules',
                description: 'Sugar molecules and their polymers used for energy and structure',
                difficulty: 'intermediate',
                prerequisites: ['basic_chemistry', 'organic_chemistry']
            },
            
            lipids: {
                patterns: [
                    /lipid|fat|oil/i,
                    /phospholipid|triglyceride|steroid/i,
                    /fatty.*acid|saturated|unsaturated/i,
                    /membrane|bilayer/i
                ],
                handler: this.handleLipids.bind(this),
                name: 'Lipids and Biomembranes',
                category: 'macromolecules',
                description: 'Hydrophobic molecules including fats, phospholipids, and steroids',
                difficulty: 'intermediate',
                prerequisites: ['basic_chemistry', 'organic_chemistry']
            },
            
            proteins: {
                patterns: [
                    /protein|polypeptide/i,
                    /amino.*acid|peptide/i,
                    /enzyme|catalyst/i,
                    /protein.*structure|folding/i
                ],
                handler: this.handleProteins.bind(this),
                name: 'Proteins and Proteomics',
                category: 'macromolecules',
                description: 'Polymers of amino acids with diverse structures and functions',
                difficulty: 'advanced',
                prerequisites: ['amino_acids', 'chemical_bonding']
            },
            
            nucleic_acids: {
                patterns: [
                    /nucleic.*acid|DNA|RNA/i,
                    /nucleotide|base.*pair/i,
                    /double.*helix|replication/i,
                    /transcription|translation/i
                ],
                handler: this.handleNucleicAcids.bind(this),
                name: 'Nucleic Acids',
                category: 'macromolecules',
                description: 'Information-carrying molecules including DNA and RNA',
                difficulty: 'advanced',
                prerequisites: ['basic_chemistry', 'molecular_structure']
            },
            
            bioenergetics: {
                patterns: [
                    /ATP|energy.*currency/i,
                    /metabolism|glycolysis|krebs/i,
                    /oxidative.*phosphorylation|electron.*transport/i,
                    /NAD|FAD|redox/i
                ],
                handler: this.handleBioenergetics.bind(this),
                name: 'Bioenergetics and Metabolism',
                category: 'metabolism',
                description: 'Energy transformations in living systems',
                difficulty: 'advanced',
                prerequisites: ['thermodynamics', 'redox_reactions', 'organic_chemistry']
            },
            
            enzymes: {
                patterns: [
                    /enzyme|catalyst/i,
                    /active.*site|substrate/i,
                    /enzyme.*kinetics|michaelis/i,
                    /inhibitor|activator|allosteric/i
                ],
                handler: this.handleEnzymes.bind(this),
                name: 'Enzyme Function and Kinetics',
                category: 'protein_function',
                description: 'Biological catalysts and their regulation',
                difficulty: 'advanced',
                prerequisites: ['proteins', 'chemical_kinetics']
            },
            
            molecular_signaling: {
                patterns: [
                    /signal.*transduction|signaling/i,
                    /receptor|ligand/i,
                    /hormone|neurotransmitter/i,
                    /second.*messenger|cascade/i
                ],
                handler: this.handleMolecularSignaling.bind(this),
                name: 'Molecular Signaling',
                category: 'cell_communication',
                description: 'Cell-to-cell communication through molecular signals',
                difficulty: 'advanced',
                prerequisites: ['proteins', 'membrane_structure']
            },
            
            glycobiology: {
                patterns: [
                    /glycoprotein|glycolipid/i,
                    /glycosylation|carbohydrate.*recognition/i,
                    /cell.*surface.*marker/i
                ],
                handler: this.handleGlycobiology.bind(this),
                name: 'Glycobiology',
                category: 'molecular_recognition',
                description: 'The role of carbohydrates in cell recognition and signaling',
                difficulty: 'advanced',
                prerequisites: ['carbohydrates', 'proteins', 'membrane_structure']
            },
            
            molecular_techniques: {
                patterns: [
                    /electrophoresis|PCR|chromatography/i,
                    /gel.*electrophoresis|HPLC|TLC/i,
                    /western.*blot|southern.*blot/i,
                    /molecular.*method|technique/i
                ],
                handler: this.handleMolecularTechniques.bind(this),
                name: 'Molecular Techniques',
                category: 'methodology',
                description: 'Laboratory methods for studying biological molecules',
                difficulty: 'intermediate',
                prerequisites: ['macromolecules', 'lab_basics']
            }
        };
    }

    initializeBiologyLessons() {
        this.lessons = {
            carbohydrates: {
                title: "Carbohydrates: Structure, Function, and Classification",
                concepts: [
                    "Carbohydrates are composed of carbon, hydrogen, and oxygen in a 1:2:1 ratio",
                    "Monosaccharides are simple sugars that cannot be hydrolyzed",
                    "Disaccharides are formed by glycosidic bonds between two monosaccharides",
                    "Polysaccharides serve as energy storage and structural molecules",
                    "Carbohydrate structure determines function"
                ],
                theory: "Carbohydrates are organic compounds that serve as primary energy sources and structural components. The empirical formula (CH₂O)ₙ reflects their composition. Understanding carbohydrate chemistry is essential for biochemistry, nutrition, and molecular biology.",
                keyDefinitions: {
                    "Monosaccharide": "Simple sugar that cannot be broken down by hydrolysis (e.g., glucose, fructose)",
                    "Disaccharide": "Two monosaccharides joined by a glycosidic bond (e.g., sucrose, lactose)",
                    "Polysaccharide": "Polymer of many monosaccharides (e.g., starch, glycogen, cellulose)",
                    "Glycosidic Bond": "Covalent bond between sugar molecules formed by dehydration synthesis",
                    "Aldose": "Sugar with an aldehyde group",
                    "Ketose": "Sugar with a ketone group",
                    "Reducing Sugar": "Sugar that can donate electrons (has free aldehyde or ketone)",
                    "Anomers": "Isomers that differ in configuration at the anomeric carbon (α and β forms)"
                },
                classification: {
                    bySize: {
                        monosaccharides: "Single sugar units (glucose, fructose, galactose)",
                        disaccharides: "Two sugar units (sucrose, maltose, lactose)",
                        oligosaccharides: "3-10 sugar units (raffinose, stachyose)",
                        polysaccharides: "Many sugar units (starch, glycogen, cellulose, chitin)"
                    },
                    byCarbonNumber: {
                        triose: "3 carbons (glyceraldehyde)",
                        tetrose: "4 carbons (erythrose)",
                        pentose: "5 carbons (ribose, deoxyribose)",
                        hexose: "6 carbons (glucose, fructose, galactose)",
                        heptose: "7 carbons (sedoheptulose)"
                    },
                    byFunction: {
                        energy: "Glucose, glycogen, starch - rapid or stored energy",
                        structural: "Cellulose, chitin - cell walls and exoskeletons",
                        recognition: "Glycoproteins, glycolipids - cell surface markers"
                    }
                },
                structuralFeatures: {
                    linearForm: "Open-chain structure with aldehyde or ketone",
                    cyclicForm: "Ring structure (furanose or pyranose)",
                    isomerism: "Structural, geometric, and optical isomers exist",
                    configuration: "D and L forms (most biological sugars are D-form)"
                },
                applications: [
                    "Energy metabolism and blood glucose regulation",
                    "Dietary fiber and digestive health",
                    "Biofuel production from cellulose",
                    "Food science and sweetener development",
                    "Glycobiology and disease markers"
                ]
            },

            lipids: {
                title: "Lipids and Biomembranes: Structure and Function",
                concepts: [
                    "Lipids are hydrophobic or amphipathic molecules",
                    "Fatty acids can be saturated or unsaturated",
                    "Phospholipids form bilayer membranes",
                    "Membrane fluidity depends on lipid composition",
                    "Lipids serve energy storage, signaling, and structural roles"
                ],
                theory: "Lipids are a diverse group of hydrophobic molecules essential for membrane structure, energy storage, and cellular signaling. Unlike other macromolecules, lipids are defined by their solubility properties rather than a common structural motif.",
                keyDefinitions: {
                    "Fatty Acid": "Long hydrocarbon chain with a carboxyl group",
                    "Saturated Fatty Acid": "No double bonds between carbons (solid at room temperature)",
                    "Unsaturated Fatty Acid": "One or more double bonds (liquid at room temperature)",
                    "Triglyceride (Triacylglycerol)": "Three fatty acids esterified to glycerol (energy storage)",
                    "Phospholipid": "Glycerol + 2 fatty acids + phosphate group (membrane component)",
                    "Amphipathic": "Having both hydrophobic and hydrophilic regions",
                    "Steroid": "Four-ring hydrocarbon structure (cholesterol, hormones)",
                    "Lipid Bilayer": "Double layer of phospholipids forming cell membranes"
                },
                classification: {
                    simpleL ipids: {
                        fats: "Triglycerides - energy storage",
                        waxes: "Long-chain fatty acids + alcohols - protection"
                    },
                    complexLipids: {
                        phospholipids: "Membrane components",
                        glycolipids: "Lipid + carbohydrate - cell recognition",
                        lipoproteins: "Lipid + protein - lipid transport"
                    },
                    derivedLipids: {
                        steroids: "Cholesterol, hormones, vitamin D",
                        fatSolubleVitamins: "A, D, E, K",
                        eicosanoids: "Prostaglandins, leukotrienes - signaling"
                    }
                },
                membraneStructure: {
                    fluidMosaicModel: "Proteins embedded in fluid lipid bilayer",
                    components: {
                        phospholipids: "Primary structural component",
                        cholesterol: "Modulates membrane fluidity",
                        proteins: "Integral and peripheral - transport, signaling",
                        glycolipids: "Cell recognition and immune response"
                    },
                    fluidity: {
                        factors: [
                            "Temperature (higher = more fluid)",
                            "Unsaturated fatty acids (more = more fluid)",
                            "Cholesterol (stabilizes fluidity)",
                            "Chain length (shorter = more fluid)"
                        ]
                    }
                },
                fattyAcidComparison: {
                    saturated: {
                        structure: "No double bonds, straight chains",
                        packingDensity: "High - tight packing",
                        state: "Solid at room temperature",
                        examples: "Palmitic acid (C16:0), Stearic acid (C18:0)",
                        sources: "Animal fats, butter, coconut oil"
                    },
                    unsaturated: {
                        structure: "One or more double bonds, kinked chains",
                        packingDensity: "Low - loose packing",
                        state: "Liquid at room temperature",
                        examples: "Oleic acid (C18:1), Linoleic acid (C18:2)",
                        sources: "Plant oils, fish oil"
                    }
                },
                applications: [
                    "Membrane biology and drug delivery",
                    "Nutritional science and health",
                    "Cardiovascular disease prevention",
                    "Cosmetics and pharmaceutical industry",
                    "Understanding metabolic disorders"
                ]
            },

            proteins: {
                title: "Proteins and Proteomics: Structure, Function, and Regulation",
                concepts: [
                    "Proteins are polymers of amino acids linked by peptide bonds",
                    "20 standard amino acids with diverse properties",
                    "Protein structure has four levels: primary, secondary, tertiary, quaternary",
                    "Structure determines function",
                    "Enzymes are biological catalysts that lower activation energy",
                    "Proteins can be regulated through allosteric mechanisms"
                ],
                theory: "Proteins perform virtually every function in living cells, from catalysis to structure to signaling. Understanding protein structure-function relationships is central to biochemistry and molecular biology.",
                keyDefinitions: {
                    "Amino Acid": "Organic molecule with amino group, carboxyl group, and unique R-group",
                    "Peptide Bond": "Covalent bond between amino acids (C-N bond)",
                    "Polypeptide": "Chain of amino acids linked by peptide bonds",
                    "Primary Structure": "Linear sequence of amino acids",
                    "Secondary Structure": "Local folding into α-helices and β-sheets (H-bonds)",
                    "Tertiary Structure": "3D shape of entire polypeptide (R-group interactions)",
                    "Quaternary Structure": "Multiple polypeptide subunits assembled",
                    "Denaturation": "Loss of protein structure and function",
                    "Active Site": "Region of enzyme where substrate binds",
                    "Allosteric Regulation": "Regulation by binding at site other than active site"
                },
                aminoAcidClassification: {
                    byPolarity: {
                        nonpolar: "Gly, Ala, Val, Leu, Ile, Met, Phe, Trp, Pro",
                        polar: "Ser, Thr, Cys, Tyr, Asn, Gln",
                        charged: {
                            acidic: "Asp, Glu (negative)",
                            basic: "Lys, Arg, His (positive)"
                        }
                    },
                    bySideChain: {
                        aliphatic: "Ala, Val, Leu, Ile",
                        aromatic: "Phe, Tyr, Trp",
                        sulfurContaining: "Cys, Met",
                        hydroxylContaining: "Ser, Thr, Tyr"
                    },
                    special: {
                        glycine: "Smallest, most flexible",
                        proline: "Rigid, kinks polypeptide chain",
                        cysteine: "Forms disulfide bonds"
                    }
                },
                structuralLevels: {
                    primary: {
                        description: "Linear amino acid sequence",
                        bonds: "Peptide bonds (covalent)",
                        determination: "DNA sequence → amino acid sequence",
                        example: "Gly-Ala-Ser-Thr-..."
                    },
                    secondary: {
                        description: "Local folding patterns",
                        bonds: "Hydrogen bonds between backbone atoms",
                        structures: {
                            alphaHelix: "Right-handed coil, 3.6 residues/turn",
                            betaSheet: "Extended, pleated structure (parallel/antiparallel)",
                            turns: "Reverse direction of polypeptide chain"
                        }
                    },
                    tertiary: {
                        description: "Overall 3D shape of polypeptide",
                        bonds: [
                            "Hydrogen bonds",
                            "Ionic bonds",
                            "Disulfide bridges (Cys-Cys)",
                            "Hydrophobic interactions",
                            "Van der Waals forces"
                        ],
                        domains: "Functional units within protein"
                    },
                    quaternary: {
                        description: "Assembly of multiple polypeptide subunits",
                        examples: "Hemoglobin (4 subunits), collagen (3 helices)",
                        interactions: "Same as tertiary, between subunits"
                    }
                },
                proteinFunctions: {
                    catalytic: "Enzymes speed up reactions",
                    structural: "Collagen, keratin, elastin",
                    transport: "Hemoglobin, membrane transporters",
                    storage: "Ferritin (iron), casein (amino acids)",
                    signaling: "Hormones, receptors",
                    movement: "Actin, myosin",
                    defense: "Antibodies, complement proteins",
                    regulation: "Transcription factors, kinases"
                },
                enzymeMechanisms: {
                    lockAndKey: "Substrate fits precisely into active site",
                    inducedFit: "Active site changes shape upon substrate binding",
                    catalyticStrategies: [
                        "Stabilizing transition state",
                        "Providing favorable microenvironment",
                        "Participating in reaction (covalent catalysis)",
                        "Bringing substrates together (proximity effect)"
                    ]
                },
                applications: [
                    "Drug design and development",
                    "Protein engineering and design",
                    "Understanding genetic diseases",
                    "Industrial enzymes and biotechnology",
                    "Proteomics and personalized medicine"
                ]
            },

            nucleic_acids: {
                title: "Nucleic Acids: Structure, Function, and Information Flow",
                concepts: [
                    "DNA and RNA are polymers of nucleotides",
                    "Nucleotides consist of pentose sugar, nitrogenous base, and phosphate",
                    "DNA has a double helix structure with complementary base pairing",
                    "RNA is typically single-stranded and more versatile",
                    "Central Dogma: DNA → RNA → Protein",
                    "DNA replication is semiconservative"
                ],
                theory: "Nucleic acids are information-carrying molecules essential for heredity and gene expression. DNA stores genetic information, while RNA translates that information into functional proteins.",
                keyDefinitions: {
                    "Nucleotide": "Monomer of nucleic acids (sugar + base + phosphate)",
                    "Nucleoside": "Sugar + base (no phosphate)",
                    "Purine": "Two-ring nitrogenous base (Adenine, Guanine)",
                    "Pyrimidine": "One-ring nitrogenous base (Cytosine, Thymine, Uracil)",
                    "Phosphodiester Bond": "Bond linking nucleotides (sugar-phosphate backbone)",
                    "Complementary Base Pairing": "A-T (or A-U) and G-C hydrogen bonding",
                    "Antiparallel": "DNA strands run in opposite directions (5'→3' and 3'→5')",
                    "Central Dogma": "DNA → RNA → Protein information flow"
                },
                nucleotideComponents: {
                    pentoseSugar: {
                        DNA: "Deoxyribose (lacks 2' OH group)",
                        RNA: "Ribose (has 2' OH group)"
                    },
                    nitrogenousBases: {
                        purines: {
                            adenine: "A (both DNA and RNA)",
                            guanine: "G (both DNA and RNA)"
                        },
                        pyrimidines: {
                            cytosine: "C (both DNA and RNA)",
                            thymine: "T (DNA only)",
                            uracil: "U (RNA only, replaces thymine)"
                        }
                    },
                    phosphateGroup: "Links nucleotides via phosphodiester bonds"
                },
                DNAStructure: {
                    doubleHelix: {
                        discoverers: "Watson and Crick (1953)",
                        features: [
                            "Two antiparallel polynucleotide strands",
                            "Right-handed helix",
                            "Major and minor grooves",
                            "Hydrophobic bases inside, hydrophilic backbone outside",
                            "10 base pairs per turn",
                            "Diameter ~2 nm"
                        ]
                    },
                    basePairing: {
                        AT: "2 hydrogen bonds (weaker)",
                        GC: "3 hydrogen bonds (stronger)",
                        rule: "Amount of A = T, amount of G = C (Chargaff's rules)"
                    },
                    forms: {
                        BDNA: "Most common in cells, right-handed",
                        ADNA: "Dehydrated form, wider and shorter",
                        ZDNA: "Left-handed, in specific sequences"
                    }
                },
                RNATypes: {
                    mRNA: {
                        name: "Messenger RNA",
                        function: "Carries genetic code from DNA to ribosome",
                        features: "5' cap, poly-A tail, exons (after splicing)"
                    },
                    tRNA: {
                        name: "Transfer RNA",
                        function: "Brings amino acids to ribosome during translation",
                        features: "Cloverleaf structure, anticodon, amino acid attachment site"
                    },
                    rRNA: {
                        name: "Ribosomal RNA",
                        function: "Structural and catalytic component of ribosomes",
                        features: "Highly conserved, peptidyl transferase activity"
                    },
                    otherRNA: {
                        miRNA: "MicroRNA - gene regulation",
                        siRNA: "Small interfering RNA - gene silencing",
                        lncRNA: "Long non-coding RNA - epigenetic regulation"
                    }
                },
                centralDogma: {
                    replication: {
                        process: "DNA → DNA",
                        purpose: "Copy genetic information for cell division",
                        mechanism: "Semiconservative (each strand templates new strand)",
                        enzymes: "DNA polymerase, helicase, ligase, primase"
                    },
                    transcription: {
                        process: "DNA → RNA",
                        purpose: "Create RNA copy of gene",
                        mechanism: "RNA polymerase reads template strand 3'→5'",
                        location: "Nucleus (eukaryotes)"
                    },
                    translation: {
                        process: "RNA → Protein",
                        purpose: "Synthesize proteins from genetic code",
                        mechanism: "Ribosome reads mRNA codons, tRNA brings amino acids",
                        location: "Ribosome (cytoplasm or ER)"
                    }
                },
                DNAvsRNA: {
                    sugar: "DNA: deoxyribose; RNA: ribose",
                    bases: "DNA: A, T, G, C; RNA: A, U, G, C",
                    structure: "DNA: double-stranded helix; RNA: usually single-stranded",
                    stability: "DNA: more stable; RNA: less stable (2' OH makes it reactive)",
                    function: "DNA: long-term storage; RNA: temporary messenger, catalyst, regulation",
                    location: "DNA: nucleus; RNA: nucleus and cytoplasm"
                },
                applications: [
                    "Genetic testing and diagnosis",
                    "Gene therapy and CRISPR",
                    "Forensic science and paternity testing",
                    "Evolutionary biology and phylogenetics",
                    "Biotechnology and recombinant DNA"
                ]
            },

            bioenergetics: {
                title: "Bioenergetics and Metabolism: Energy Flow in Living Systems",
                concepts: [
                    "ATP is the universal energy currency of cells",
                    "Redox reactions transfer energy via electron carriers",
                    "Metabolism includes catabolic and anabolic pathways",
                    "Glycolysis breaks down glucose in cytoplasm",
                    "Krebs cycle oxidizes acetyl-CoA in mitochondrial matrix",
                    "Electron transport chain generates ATP via chemiosmosis"
                ],
                theory: "Bioenergetics studies energy transformations in biological systems. Cells harness energy from nutrients through metabolic pathways, storing it as ATP for cellular work. Understanding these pathways is essential for biochemistry, physiology, and medicine.",
                keyDefinitions: {
                    "ATP (Adenosine Triphosphate)": "Primary energy currency; releases energy when hydrolyzed to ADP",
                    "Metabolism": "All chemical reactions in an organism",
                    "Catabolism": "Breaking down molecules to release energy",
                    "Anabolism": "Building up molecules using energy",
                    "Redox Reaction": "Transfer of electrons from one molecule to another",
                    "Oxidation": "Loss of electrons (or hydrogen)",
                    "Reduction": "Gain of electrons (or hydrogen)",
                    "Substrate-Level Phosphorylation": "Direct transfer of phosphate to ADP to make ATP",
                    "Oxidative Phosphorylation": "ATP synthesis driven by electron transport chain",
                    "Chemiosmosis": "ATP synthesis using proton gradient across membrane"
                },
                energyMolecules: {
                    ATP: {
                        structure: "Adenine + ribose + 3 phosphate groups",
                        hydrolysis: "ATP + H₂O → ADP + Pi + energy (~30.5 kJ/mol)",
                        regeneration: "ADP + Pi + energy → ATP",
                        cellularAmount: "~250g in human, recycled ~100x/day"
                    },
                    electronCarriers: {
                        NADplus: {
                            full: "Nicotinamide Adenine Dinucleotide",
                            reduced: "NAD⁺ + 2e⁻ + H⁺ → NADH",
                            role: "Primary electron carrier in catabolism"
                        },
                        FAD: {
                            full: "Flavin Adenine Dinucleotide",
                            reduced: "FAD + 2e⁻ + 2H⁺ → FADH₂",
                            role: "Electron carrier in Krebs cycle"
                        },
                        NADPplus: {
                            full: "Nicotinamide Adenine Dinucleotide Phosphate",
                            reduced: "NADP⁺ + 2e⁻ + H⁺ → NADPH",
                            role: "Electron carrier in anabolic reactions (photosynthesis)"
                        }
                    }
                },
                cellularRespiration: {
                    overview: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (36-38 total)",
                    stages: {
                        glycolysis: {
                            location: "Cytoplasm",
                            input: "1 glucose (6C)",
                            output: "2 pyruvate (3C), 2 ATP (net), 2 NADH",
                            oxygenRequired: "No (anaerobic)",
                            steps: "10 enzyme-catalyzed reactions",
                            energyPhases: {
                                investment: "Uses 2 ATP to phosphorylate glucose",
                                payoff: "Produces 4 ATP and 2 NADH"
                            }
                        },
                        pyruvateLinkReaction: {
                            location: "Mitochondrial matrix",
                            input: "2 pyruvate (from glycolysis)",
                            output: "2 acetyl-CoA, 2 NADH, 2 CO₂",
                            enzyme: "Pyruvate dehydrogenase complex",
                            reaction: "Pyruvate + CoA + NAD⁺ → Acetyl-CoA + NADH + CO₂"
                        },
                        krebsCycle: {
                            alternativeName: "Citric acid cycle, TCA cycle",
                            location: "Mitochondrial matrix",
                            input: "2 acetyl-CoA (per glucose)",
                            output: "4 CO₂, 6 NADH, 2 FADH₂, 2 ATP (or GTP)",
                            turns: "2 per glucose molecule",
                            keySteps: [
                                "Acetyl-CoA (2C) + Oxaloacetate (4C) → Citrate (6C)",
                                "Citrate oxidized through series of steps",
                                "Regenerates oxaloacetate to continue cycle"
                            ]
                        },
                        electronTransportChain: {
                            location: "Inner mitochondrial membrane (cristae)",
                            input: "10 NADH, 2 FADH₂ (from all previous stages)",
                            output: "~32-34 ATP, H₂O",
                            mechanism: [
                                "NADH and FADH₂ donate electrons",
                                "Electrons pass through protein complexes (I, II, III, IV)",
                                "Energy pumps H⁺ from matrix to intermembrane space",
                                "Proton gradient drives ATP synthase",
                                "Oxygen is final electron acceptor (forms H₂O)"
                            ],
                            chemiosmosis: "H⁺ flows back through ATP synthase, driving ATP synthesis"
                        }
                    },
                    ATPYield: {
                        glycolysis: "2 ATP (substrate-level) + 2 NADH (→ 5 ATP)",
                        linkReaction: "2 NADH (→ 5 ATP)",
                        krebsCycle: "2 ATP + 6 NADH (→ 15 ATP) + 2 FADH₂ (→ 3 ATP)",
                        total: "~36-38 ATP per glucose (varies by shuttle system)"
                    }
                },
                anaerobicRespiration: {
                    fermentation: {
                        definition: "Glycolysis + regeneration of NAD⁺ without oxygen",
                        ATPYield: "2 ATP per glucose (only from glycolysis)",
                        lacticAcid: {
                            organisms: "Muscle cells, some bacteria",
                            reaction: "Pyruvate + NADH → Lactate + NAD⁺",
                            result: "Allows glycolysis to continue"
                        },
                        alcoholic: {
                            organisms: "Yeast, some bacteria",
                            reaction: "Pyruvate → Ethanol + CO₂ + NAD⁺",
                            application: "Beer, wine, bread making"
                        }
                    }
                },
                metabolicRegulation: {
                    feedback: "Product inhibits earlier step (e.g., ATP inhibits phosphofructokinase)",
                    allosteric: "Molecules bind to regulatory sites on enzymes",
                    hormonal: "Insulin/glucagon regulate glucose metabolism",
                    compartmentalization: "Separating pathways in organelles"
                },
                applications: [
                    "Understanding metabolic diseases (diabetes, mitochondrial disorders)",
                    "Athletic performance and muscle physiology",
                    "Cancer metabolism (Warburg effect)",
                    "Drug targeting of metabolic pathways",
                    "Biofuel production and fermentation technology"
                ]
            },

            enzymes: {
                title: "Enzyme Function and Kinetics: Biological Catalysis",
                concepts: [
                    "Enzymes are biological catalysts that speed up reactions",
                    "Enzymes lower activation energy without being consumed",
                    "Active site is specific for substrate (lock-and-key or induced fit)",
                    "Enzyme activity depends on temperature, pH, and cofactors",
                    "Michaelis-Menten kinetics describes enzyme behavior",
                    "Enzymes can be regulated by inhibitors and activators"
                ],
                theory: "Enzymes are protein catalysts essential for virtually all biochemical reactions. They achieve remarkable specificity and rate enhancement, making life possible at physiological temperatures.",
                keyDefinitions: {
                    "Enzyme": "Biological catalyst (usually protein) that speeds up reactions",
                    "Active Site": "Region where substrate binds and reaction occurs",
                    "Substrate": "Reactant molecule that binds to enzyme",
                    "Product": "Molecule(s) formed by enzyme-catalyzed reaction",
                    "Cofactor": "Non-protein helper (metal ion or organic molecule)",
                    "Coenzyme": "Organic cofactor (often vitamin-derived)",
                    "Apoenzyme": "Protein part of enzyme without cofactor",
                    "Holoenzyme": "Complete, active enzyme (apoenzyme + cofactor)",
                    "Activation Energy": "Energy needed to start a reaction",
                    "Turnover Number (kcat)": "Substrate molecules converted per enzyme per time"
                },
                mechanismOfAction: {
                    lockAndKey: {
                        proposed: "Emil Fischer (1894)",
                        description: "Rigid active site perfectly fits substrate",
                        limitation: "Doesn't explain conformational changes"
                    },
                    inducedFit: {
                        proposed: "Daniel Koshland (1958)",
                        description: "Active site changes shape upon substrate binding",
                        advantage: "Better explains specificity and catalytic mechanisms"
                    },
                    catalyticStrategies: [
                        "Stabilize transition state (lower activation energy)",
                        "Provide optimal microenvironment (pH, hydrophobicity)",
                        "Bring substrates together (proximity and orientation)",
                        "Participate directly in reaction (covalent catalysis)",
                        "Strain substrate bonds"
                    ]
                },
                factorsAffectingActivity: {
                    temperature: {
                        low: "Slow molecular motion, low reaction rate",
                        optimal: "Maximum activity (typically 35-40°C for human enzymes)",
                        high: "Denaturation, loss of activity",
                        Qten: "Reaction rate doubles per 10°C increase (until denaturation)"
                    },
                    pH: {
                        optimal: "pH at which enzyme is most active (varies by enzyme)",
                        extremes: "Alter ionization of amino acids, denature enzyme",
                        examples: "Pepsin (pH 2), trypsin (pH 8), catalase (pH 7)"
                    },
                    substrateConcentration: {
                        low: "Rate increases linearly with [S]",
                        high: "Rate plateaus (enzyme saturation)",
                        Vmax: "Maximum rate when all enzyme active sites occupied"
                    },
                    enzymeConcentration: {
                        relationship: "Rate directly proportional to [E] (when substrate not limiting)"
                    }
                },
                enzymeKinetics: {
                    MichaelisMenten: {
                        equation: "v = (Vmax [S]) / (Km + [S])",
                        Vmax: "Maximum reaction rate at saturating [S]",
                        Km: "Substrate concentration at half Vmax (measure of affinity)",
                        assumptions: [
                            "Substrate in large excess",
                            "Steady-state conditions",
                            "Initial rate measured (product doesn't accumulate)"
                        ],
                        interpretation: {
                            lowKm: "High affinity (enzyme binds substrate tightly)",
                            highKm: "Low affinity (enzyme binds substrate weakly)"
                        }
                    },
                    LineweaverBurk: {
                        equation: "1/v = (Km/Vmax)(1/[S]) + 1/Vmax",
                        plot: "Double reciprocal plot (1/v vs 1/[S])",
                        yIntercept: "1/Vmax",
                        xIntercept: "-1/Km",
                        slope: "Km/Vmax",
                        use: "Determine kinetic parameters, identify inhibition type"
                    }
                },
                enzymeInhibition: {
                    competitiveInhibition: {
                        mechanism: "Inhibitor competes with substrate for active site",
                        effect: "Increases apparent Km, Vmax unchanged",
                        overcome: "Increase substrate concentration",
                        example: "Malonate inhibits succinate dehydrogenase"
                    },
                    noncompetitiveInhibition: {
                        mechanism: "Inhibitor binds to site other than active site (allosteric)",
                        effect: "Decreases Vmax, Km unchanged",
                        overcome: "Cannot be overcome by increasing [S]",
                        example: "Heavy metals inhibiting many enzymes"
                    },
                    uncompetitiveInhibition: {
                        mechanism: "Inhibitor binds only to ES complex",
                        effect: "Decreases both Vmax and Km",
                        example: "Less common, some drugs"
                    },
                    irreversibleInhibition: {
                        mechanism: "Inhibitor covalently modifies enzyme (permanent)",
                        examples: "Aspirin (COX inhibitor), penicillin (transpeptidase inhibitor)",
                        suicide: "Inhibitor activated by enzyme, then inactivates it"
                    }
                },
                enzymeRegulation: {
                    allostericRegulation: {
                        mechanism: "Regulator binds to site other than active site",
                        effect: "Changes enzyme conformation and activity",
                        positive: "Activator increases activity",
                        negative: "Inhibitor decreases activity",
                        example: "Phosphofructokinase in glycolysis"
                    },
                    feedbackInhibition: {
                        mechanism: "End product inhibits earlier enzyme in pathway",
                        purpose: "Prevents overproduction",
                        example: "CTP inhibits aspartate transcarbamoylase"
                    },
                    covalentModification: {
                        phosphorylation: "Addition of phosphate group (activates or inhibits)",
                        methylation: "Addition of methyl group",
                        example: "Glycogen phosphorylase activated by phosphorylation"
                    },
                    compartmentalization: {
                        mechanism: "Separate enzymes and substrates in different locations",
                        example: "Metabolic pathways in different organelles"
                    }
                },
                enzymeClassification: {
                    oxidoreductases: "Catalyze oxidation-reduction reactions (dehydrogenases, oxidases)",
                    transferases: "Transfer functional groups (kinases, transaminases)",
                    hydrolases: "Break bonds using water (proteases, lipases, nucleases)",
                    lyases: "Break bonds without water or redox (decarboxylases, aldolases)",
                    isomerases: "Rearrange atoms within molecule (racemases, epimerases)",
                    ligases: "Form bonds using ATP (synthetases, carboxylases)"
                },
                applications: [
                    "Drug design (enzyme inhibitors as drugs)",
                    "Diagnostic tests (enzyme markers for disease)",
                    "Industrial processes (detergents, food processing)",
                    "Biotechnology (restriction enzymes, polymerases)",
                    "Understanding metabolic disorders"
                ]
            },

            molecular_signaling: {
                title: "Molecular Signaling: Cell Communication and Signal Transduction",
                concepts: [
                    "Cells communicate via chemical signals (hormones, neurotransmitters)",
                    "Receptors are specific proteins that bind signaling molecules",
                    "Signal transduction amplifies and transmits signals into cells",
                    "Second messengers relay signals inside cells",
                    "Signaling cascades allow for regulation and amplification"
                ],
                theory: "Cells coordinate their activities through chemical communication. Signal transduction pathways convert extracellular signals into cellular responses, enabling organisms to respond to their environment.",
                keyDefinitions: {
                    "Ligand": "Signaling molecule that binds to receptor",
                    "Receptor": "Protein that binds ligand and initiates response",
                    "Signal Transduction": "Process of converting extracellular signal to intracellular response",
                    "Second Messenger": "Small molecule that relays signal inside cell (cAMP, Ca²⁺, IP₃)",
                    "Amplification": "Each step in cascade activates multiple molecules",
                    "G-Protein": "Molecular switch that activates signaling pathways",
                    "Protein Kinase": "Enzyme that phosphorylates proteins",
                    "Autophosphorylation": "Receptor phosphorylates itself upon activation"
                },
                signalingTypes: {
                    endocrine: {
                        description: "Long-distance signaling via bloodstream",
                        ligands: "Hormones (insulin, estrogen, growth hormone)",
                        speed: "Slow (minutes to hours)",
                        duration: "Long-lasting effects"
                    },
                    paracrine: {
                        description: "Local signaling to nearby cells",
                        ligands: "Growth factors, neurotransmitters (at synapse)",
                        speed: "Fast (seconds to minutes)",
                        duration: "Short-lived, local effects"
                    },
                    autocrine: {
                        description: "Cell signals to itself",
                        ligands: "Growth factors during development",
                        purpose: "Self-regulation, cancer cells often use this"
                    },
                    juxtacrine: {
                        description: "Direct contact between cells",
                        mechanism: "Membrane-bound signals, gap junctions",
                        example: "Notch signaling in development"
                    }
                },
                receptorTypes: {
                    GPCRs: {
                        name: "G-Protein Coupled Receptors",
                        structure: "7 transmembrane domains",
                        mechanism: [
                            "Ligand binds to receptor",
                            "Receptor activates G-protein (GDP → GTP exchange)",
                            "G-protein activates effector enzyme",
                            "Effector produces second messenger",
                            "Signal amplified through cascade"
                        ],
                        examples: "Adrenaline receptors, odorant receptors",
                        secondMessengers: "cAMP, IP₃, DAG, Ca²⁺"
                    },
                    RTKs: {
                        name: "Receptor Tyrosine Kinases",
                        structure: "Single transmembrane domain with tyrosine kinase",
                        mechanism: [
                            "Ligand binding causes receptor dimerization",
                            "Autophosphorylation of tyrosine residues",
                            "Phosphotyrosines recruit signaling proteins",
                            "Activate multiple pathways (Ras/MAPK, PI3K/Akt)"
                        ],
                        examples: "Insulin receptor, growth factor receptors (EGFR)"
                    },
                    ionChannelReceptors: {
                        name: "Ligand-Gated Ion Channels",
                        structure: "Multisubunit pore",
                        mechanism: "Ligand binding opens channel, ions flow",
                        speed: "Fastest signaling (milliseconds)",
                        examples: "Acetylcholine receptor (nicotinic), GABA receptor"
                    },
                    intracellularReceptors: {
                        name: "Nuclear Receptors",
                        location: "Cytoplasm or nucleus",
                        ligands: "Lipid-soluble hormones (steroid, thyroid)",
                        mechanism: "Ligand-receptor complex acts as transcription factor",
                        examples: "Estrogen receptor, testosterone receptor"
                    }
                },
                secondMessengers: {
                    cAMP: {
                        fullName: "Cyclic AMP",
                        production: "ATP → cAMP (by adenylyl cyclase)",
                        degradation: "cAMP → AMP (by phosphodiesterase)",
                        target: "Protein Kinase A (PKA)",
                        examples: "Adrenaline, glucagon signaling"
                    },
                    calcium: {
                        symbol: "Ca²⁺",
                        storage: "ER/SR stores Ca²⁺",
                        release: "IP₃ opens Ca²⁺ channels",
                        sensors: "Calmodulin binds Ca²⁺, activates enzymes",
                        examples: "Muscle contraction, neurotransmitter release"
                    },
                    IP3_DAG: {
                        IP3: "Inositol trisphosphate - releases Ca²⁺ from ER",
                        DAG: "Diacylglycerol - activates Protein Kinase C (PKC)",
                        production: "PLC cleaves PIP₂ → IP₃ + DAG",
                        example: "Growth factor signaling"
                    }
                },
                signalingPathways: {
                    cAMP_PKA: {
                        steps: [
                            "Hormone binds GPCR",
                            "G-protein activates adenylyl cyclase",
                            "cAMP produced",
                            "cAMP activates PKA",
                            "PKA phosphorylates target proteins",
                            "Cellular response (e.g., glycogen breakdown)"
                        ]
                    },
                    Ras_MAPK: {
                        steps: [
                            "Growth factor binds RTK",
                            "RTK autophosphorylation",
                            "Adaptor proteins recruit Ras-GEF",
                            "Ras activated (GDP → GTP)",
                            "Ras activates Raf (MAPKKK)",
                            "Raf → MEK (MAPKK) → ERK (MAPK)",
                            "ERK enters nucleus, phosphorylates transcription factors",
                            "Gene expression changes"
                        ],
                        importance: "Cell growth, division, differentiation; mutations cause cancer"
                    },
                    PI3K_Akt: {
                        steps: [
                            "RTK activation",
                            "PI3K recruited, produces PIP₃",
                            "PIP₃ recruits Akt to membrane",
                            "Akt phosphorylated and activated",
                            "Akt phosphorylates many targets (metabolism, survival)"
                        ],
                        importance: "Cell survival, growth, metabolism"
                    }
                },
                signalTermination: {
                    receptorInactivation: "Phosphorylation, internalization, degradation",
                    GTPaseActivity: "G-proteins and Ras hydrolyze GTP → GDP (self-inactivate)",
                    phosphatases: "Remove phosphate groups added by kinases",
                    degradationOfSecondMessengers: "Phosphodiesterases break down cAMP/cGMP"
                },
                applications: [
                    "Drug development (most drugs target receptors or signaling proteins)",
                    "Understanding cancer (many oncogenes are signaling proteins)",
                    "Hormone disorders and therapy",
                    "Neuroscience and neurotransmitter function",
                    "Personalized medicine (targeted therapies)"
                ]
            },

            glycobiology: {
                title: "Glycobiology: Carbohydrates in Cell Recognition and Signaling",
                concepts: [
                    "Glycoproteins and glycolipids have carbohydrate chains on cell surfaces",
                    "Oligosaccharides serve as recognition markers",
                    "Lectins are proteins that bind specific carbohydrates",
                    "Blood types determined by carbohydrate structures",
                    "Glycosylation affects protein folding, stability, and function"
                ],
                theory: "Glycobiology studies the structure, biosynthesis, and function of carbohydrates in biological systems. Carbohydrates on cell surfaces mediate cell-cell recognition, immune responses, and pathogen interactions.",
                keyDefinitions: {
                    "Glycoprotein": "Protein with covalently attached carbohydrate chains",
                    "Glycolipid": "Lipid with attached carbohydrate (e.g., gangliosides)",
                    "Glycosylation": "Enzymatic addition of carbohydrates to proteins or lipids",
                    "Lectin": "Protein that binds specific carbohydrate structures",
                    "Glycocalyx": "Carbohydrate-rich layer on cell surface",
                    "N-linked": "Carbohydrate attached to asparagine (Asn)",
                    "O-linked": "Carbohydrate attached to serine or threonine (Ser/Thr)",
                    "Oligosaccharide": "Short chain of sugars (3-10 monosaccharides)"
                },
                glycoproteinStructure: {
                    Nlinked: {
                        attachment: "Asparagine (Asn) in Asn-X-Ser/Thr sequence",
                        location: "ER and Golgi",
                        commonCore: "Man₃GlcNAc₂ (mannose and N-acetylglucosamine)",
                        types: {
                            highMannose: "Many mannose residues",
                            complex: "Diverse, often branched with sialic acid",
                            hybrid: "Features of both"
                        },
                        examples: "Antibodies, cell surface receptors"
                    },
                    Olinked: {
                        attachment: "Serine (Ser) or Threonine (Thr)",
                        location: "Golgi",
                        commonSugar: "N-acetylgalactosamine (GalNAc) often first",
                        examples: "Mucins, collagen"
                    }
                },
                glycolipids: {
                    cerebrosides: "Simple glycolipids with single sugar (glucose or galactose)",
                    gangliosides: "Complex glycolipids with sialic acid, abundant in nervous system",
                    location: "Outer leaflet of plasma membrane",
                    function: "Cell recognition, signaling, receptor modulation"
                },
                cellRecognition: {
                    bloodTypes: {
                        determination: "Carbohydrate structures on RBC surface",
                        A: "N-acetylgalactosamine added",
                        B: "Galactose added",
                        O: "No additional sugar (H antigen only)",
                        AB: "Both A and B sugars present",
                        Rhfactor: "Protein antigen (separate from ABO)"
                    },
                    immuneResponse: {
                        selfVsNonself: "Immune system recognizes foreign carbohydrate patterns",
                        antibodies: "Recognize specific oligosaccharide epitopes",
                        pathogens: "Often have unique carbohydrate structures"
                    },
                    cellAdhesion: {
                        selectins: "Lectins that bind carbohydrates during inflammation",
                        homing: "Lymphocytes recognize carbohydrates to find target tissues",
                        fertilization: "Sperm bind egg glycoproteins"
                    }
                },
                lectins: {
                    definition: "Carbohydrate-binding proteins (not enzymes, no catalysis)",
                    types: {
                        Ctype: "Calcium-dependent (selectins, collectins)",
                        Stype: "Contain sulfhydryl groups (galectins)",
                        Ptype: "Mannose-6-phosphate receptors",
                        Itype: "Immunoglobulin-like (siglecs)"
                    },
                    functions: [
                        "Cell adhesion and trafficking",
                        "Immune recognition",
                        "Protein trafficking within cells",
                        "Pathogen recognition (innate immunity)"
                    ],
                    examples: "Hemagglutinin (influenza virus), concanavalin A (plant lectin)"
                },
                glycosylationFunctions: {
                    proteinFolding: "Helps chaperones fold proteins correctly",
                    stability: "Protects from proteolysis and aggregation",
                    trafficking: "Mannose-6-phosphate targets proteins to lysosomes",
                    signaling: "Modulates receptor activity and interactions",
                    recognition: "Cell-cell and cell-pathogen interactions"
                },
                diseaseRelevance: {
                    cancer: "Altered glycosylation on tumor cells (tumor markers)",
                    infectiousDiseases: "Pathogens use carbohydrates to attach and invade",
                    congenitalDisorders: "CDG (Congenital Disorders of Glycosylation)",
                    autoimmunity: "Antibodies against self-carbohydrates",
                    transplantRejection: "Carbohydrate antigens cause graft rejection"
                },
                applications: [
                    "Vaccine development (carbohydrate-based vaccines)",
                    "Cancer diagnostics and therapy",
                    "Blood transfusion and typing",
                    "Understanding infectious disease",
                    "Designing glycoprotein therapeutics"
                ]
            },

            molecular_techniques: {
                title: "Molecular Techniques: Methods for Studying Biological Molecules",
                concepts: [
                    "Electrophoresis separates molecules by size and charge",
                    "PCR amplifies specific DNA sequences",
                    "Chromatography separates molecules by physical/chemical properties",
                    "Different techniques suited for different molecule types",
                    "Understanding principles allows proper technique selection"
                ],
                theory: "Molecular techniques enable scientists to isolate, identify, and analyze biological macromolecules. These methods are fundamental to biochemistry, molecular biology, and biotechnology research.",
                keyDefinitions: {
                    "Electrophoresis": "Separation of charged molecules in electric field",
                    "PCR (Polymerase Chain Reaction)": "Amplification of DNA sequences",
                    "Chromatography": "Separation based on differential migration through medium",
                    "Denaturation": "Unfolding proteins or separating DNA strands",
                    "Annealing": "Binding of complementary sequences (DNA primers)",
                    "Visualization": "Making separated molecules visible (stains, fluorescence)",
                    "Resolution": "Ability to distinguish between similar molecules",
                    "Elution": "Removal of molecules from chromatography column"
                },
                electrophoresis: {
                    gelElectrophoresis: {
                        principle: "Charged molecules migrate through gel matrix in electric field",
                        matrix: "Agarose (DNA, large proteins) or polyacrylamide (small proteins, DNA)",
                        separation: "By size (and sometimes charge)",
                        visualization: "Ethidium bromide (DNA), Coomassie blue (protein)",
                        applications: "DNA fingerprinting, protein purity check, genotyping"
                    },
                    SDSPAGE: {
                        name: "Sodium Dodecyl Sulfate Polyacrylamide Gel Electrophoresis",
                        purpose: "Separate proteins by molecular weight",
                        SDS: "Denatures proteins, gives uniform negative charge",
                        mechanism: "All proteins have same charge/mass ratio, separate only by size",
                        reducing: "β-mercaptoethanol or DTT breaks disulfide bonds",
                        visualization: "Coomassie stain, silver stain",
                        application: "Protein analysis, Western blot"
                    },
                    isoelectricFocusing: {
                        principle: "Separate proteins by isoelectric point (pI)",
                        mechanism: "pH gradient; protein stops where pH = pI (no net charge)",
                        combination: "2D gels (IEF + SDS-PAGE) for comprehensive protein separation"
                    },
                    capillaryElectrophoresis: {
                        setup: "Narrow capillary tube, high voltage",
                        advantages: "High resolution, small sample, automated",
                        applications: "DNA sequencing, forensics, drug testing"
                    }
                },
                PCR: {
                    components: {
                        template: "DNA containing target sequence",
                        primers: "Short DNA sequences flanking target (forward and reverse)",
                        polymerase: "Taq polymerase (heat-stable)",
                        dNTPs: "Deoxynucleotide triphosphates (building blocks)",
                        buffer: "Optimal pH and ions (Mg²⁺)"
                    },
                    cycleSteps: {
                        denaturation: "94-98°C - separate DNA strands",
                        annealing: "50-65°C - primers bind to template",
                        extension: "72°C - Taq polymerase synthesizes new strand"
                    },
                    amplification: "Exponential: 2^n copies after n cycles (typically 25-35 cycles)",
                    applications: [
                        "Clone genes",
                        "Diagnose genetic diseases",
                        "Forensic DNA analysis",
                        "Detect pathogens",
                        "Study gene expression (RT-PCR)"
                    ],
                    variations: {
                        rtPCR: "Reverse Transcriptase PCR - amplify RNA (convert to cDNA first)",
                        qPCR: "Quantitative/Real-time PCR - measure DNA amount in real-time",
                        multiplex: "Multiple primer sets amplify different targets simultaneously"
                    }
                },
                chromatography: {
                    principle: "Separate molecules based on interactions with stationary and mobile phases",
                    types: {
                        paperChromatography: {
                            stationary: "Paper (cellulose)",
                            mobile: "Solvent",
                            separation: "Polarity, size",
                            application: "Amino acids, pigments (simple, educational)"
                        },
                        TLC: {
                            name: "Thin Layer Chromatography",
                            stationary: "Silica or alumina on glass/plastic",
                            mobile: "Solvent mixture",
                            separation: "Polarity",
                            visualization: "UV light, iodine vapor, stains",
                            Rf: "Retention factor = distance moved by compound / distance moved by solvent",
                            application: "Quick analysis, drug screening"
                        },
                        columnChromatography: {
                            stationary: "Resin packed in column",
                            mobile: "Buffer or solvent flows through",
                            types: {
                                ionExchange: "Separates by charge",
                                sizeExclusion: "Separates by size (gel filtration)",
                                affinity: "Separates by specific binding (e.g., antibody, his-tag)",
                                hydrophobic: "Separates by hydrophobicity"
                            },
                            application: "Protein purification, DNA isolation"
                        },
                        HPLC: {
                            name: "High Performance Liquid Chromatography",
                            features: "High pressure, very fine resin, high resolution",
                            detection: "UV absorbance, fluorescence, mass spec",
                            types: "Reverse-phase, ion exchange, size exclusion",
                            application: "Purify/analyze small molecules, peptides, proteins"
                        },
                        gasChromatography: {
                            mobile: "Inert gas (helium, nitrogen)",
                            stationary: "Liquid or solid in column",
                            requirement: "Volatile or derivatized samples",
                            detection: "Flame ionization, mass spec (GC-MS)",
                            application: "Metabolite analysis, environmental toxins"
                        }
                    }
                },
                blottingTechniques: {
                    southernBlot: {
                        target: "DNA",
                        steps: [
                            "Digest DNA with restriction enzymes",
                            "Separate by gel electrophoresis",
                            "Transfer to membrane (blotting)",
                            "Hybridize with labeled DNA probe",
                            "Detect probe (autoradiography or chemiluminescence)"
                        ],
                        application: "Detect specific DNA sequences, gene mapping"
                    },
                    northernBlot: {
                        target: "RNA",
                        similar: "Like Southern but with RNA",
                        application: "Detect and quantify specific mRNA"
                    },
                    westernBlot: {
                        target: "Protein",
                        steps: [
                            "Separate proteins by SDS-PAGE",
                            "Transfer to membrane (nitrocellulose or PVDF)",
                            "Block non-specific binding",
                            "Incubate with primary antibody (specific for target protein)",
                            "Incubate with secondary antibody (labeled, binds primary)",
                            "Detect (chemiluminescence, fluorescence)"
                        ],
                        application: "Detect specific proteins, confirm expression, diagnose disease"
                    }
                },
                spectroscopy: {
                    UVVis: {
                        principle: "Measure absorbance of UV/visible light",
                        use: "Quantify nucleic acids (260 nm), proteins (280 nm)",
                        purity: "260/280 ratio (DNA purity), 260/230 ratio (contamination)",
                        BeerLambert: "A = εcl (absorbance = molar absorptivity × concentration × path length)"
                    },
                    fluorescence: {
                        principle: "Excite fluorophore, measure emitted light",
                        use: "Quantify DNA (PicoGreen), proteins (fluorescent dyes), live cell imaging",
                        sensitivity: "More sensitive than UV-Vis"
                    },
                    massSpectrometry: {
                        principle: "Ionize molecules, measure mass-to-charge ratio",
                        use: "Identify proteins, sequence peptides, detect post-translational modifications",
                        coupling: "LC-MS, GC-MS (separate first, then analyze)",
                        proteomics: "Identify thousands of proteins in complex samples"
                    }
                },
                applications: [
                    "Recombinant protein production and purification",
                    "DNA cloning and genetic engineering",
                    "Clinical diagnostics (disease markers)",
                    "Forensic science (DNA fingerprinting)",
                    "Drug discovery and development",
                    "Quality control in biotechnology"
                ]
            }
        };
    }

    initializeBiologyExperiments() {
        this.molecularExperiments = {
            // ========================================
            // CARBOHYDRATE EXPERIMENTS
            // ========================================
            
            prouts_classification: {
                name: "Prout's Classification - The Standard Four Food Tests",
                relatedTopics: ['carbohydrates', 'proteins', 'lipids'],
                category: 'biochemical_tests',
                historicalBackground: {
                    scientist: "William Prout",
                    year: "1827",
                    contribution: "Classified nutrients into three 'proximate principles': saccharines (carbohydrates), oleaginous (fats), and albuminous (proteins)",
                    context: "Prout recognized that foods could be categorized by their chemical nature, laying groundwork for nutritional biochemistry",
                    significance: "First systematic classification of macronutrients",
                    quote: "The ultimate elements of food are saccharous, oily, and albuminous matter"
                },
                labExperiment: {
                    title: "The Standard Four Food Tests",
                    hypothesis: "Different foods contain different macromolecules that can be identified through specific chemical tests",
                    purpose: "Identify presence of carbohydrates, reducing sugars, proteins, and lipids in food samples",
                    variables: {
                        independent: "Type of food sample tested",
                        dependent: "Color change observed in each test",
                        controlled: ["Reagent concentration", "Temperature", "Sample amount", "Reaction time"]
                    },
                    materials: [
                        "Food samples: glucose solution, starch suspension, egg white, vegetable oil, bread, potato, milk",
                        "Benedict's reagent (reducing sugar test)",
                        "Iodine solution (starch test)",
                        "Biuret reagent (protein test)",
                        "Sudan III or IV solution (lipid test)",
                        "Test tubes and test tube rack",
                        "Dropper or pipette",
                        "Hot water bath or beaker with boiling water",
                        "Test tube holder",
                        "White tile (for observing color changes)",
                        "Mortar and pestle (for solid food samples)",
                        "Distilled water"
                    ],
                    safetyPrecautions: [
                        "Wear safety goggles and lab coat",
                        "Benedict's reagent contains copper sulfate - avoid skin contact",
                        "Biuret reagent contains sodium hydroxide - caustic, handle carefully",
                        "Sudan III can stain skin and clothing",
                        "Use test tube holder when heating",
                        "Do not point test tube at anyone when heating",
                        "Dispose of chemicals properly"
                    ],
                    procedure: {
                        preparation: [
                            "Prepare food samples by crushing solids with mortar and pestle",
                            "Mix solid samples with small amount of distilled water",
                            "Label test tubes clearly for each test and sample",
                            "Set up hot water bath if using Benedict's test"
                        ],
                        
                        test1_BenedictsReducingSugar: {
                            name: "Benedict's Test for Reducing Sugars",
                            target: "Glucose, fructose, maltose, lactose (not sucrose)",
                            steps: [
                                "Add 2 ml of food sample to test tube",
                                "Add 2 ml of Benedict's reagent",
                                "Place test tube in boiling water bath for 3-5 minutes",
                                "Observe color change",
                                "Record results"
                            ],
                            colorResults: {
                                blue: "No reducing sugar (negative)",
                                green: "Trace amount (0.5%)",
                                yellow: "Low amount (0.5-1%)",
                                orange: "Moderate amount (1-1.5%)",
                                brickRed: "High amount (>2%) - positive"
                            },
                            principle: "Reducing sugars reduce Cu²⁺ (blue) to Cu₂O (brick red precipitate) in alkaline conditions when heated",
                            chemicalReaction: "Cu²⁺ (blue) + reducing sugar + heat → Cu₂O (brick red) + oxidized sugar"
                        },
                        
                        test2_IodineStarch: {
                            name: "Iodine Test for Starch",
                            target: "Starch (polysaccharide)",
                            steps: [
                                "Add 2 ml of food sample to test tube",
                                "Add 2-3 drops of iodine solution",
                                "Mix gently",
                                "Observe color change immediately",
                                "Record results"
                            ],
                            colorResults: {
                                brownOrange: "No starch (iodine color) - negative",
                                blueBlack: "Starch present - positive"
                            },
                            principle: "Iodine forms complex with helical structure of amylose in starch, producing blue-black color",
                            note: "This test does NOT require heating"
                        },
                        
                        test3_BiuretProtein: {
                            name: "Biuret Test for Proteins",
                            target: "Proteins and polypeptides",
                            steps: [
                                "Add 2 ml of food sample to test tube",
                                "Add 1 ml of Biuret reagent (contains NaOH and CuSO₄)",
                                "Mix gently",
                                "Wait 5 minutes at room temperature",
                                "Observe color change",
                                "Record results"
                            ],
                            colorResults: {
                                blue: "No protein (reagent color) - negative",
                                violet: "Protein present - positive",
                                pink: "Short peptides present"
                            },
                            principle: "Peptide bonds (C-N) in proteins complex with Cu²⁺ ions in alkaline solution, forming violet complex",
                            chemicalReaction: "Cu²⁺ + peptide bonds in alkaline solution → violet copper complex"
                        },
                        
                        test4_SudanLipid: {
                            name: "Sudan III/IV Test for Lipids",
                            target: "Fats and oils",
                            steps: [
                                "Add 2 ml of food sample to test tube",
                                "Add 2 ml of ethanol (or leave sample in water)",
                                "Add 2-3 drops of Sudan III or Sudan IV solution",
                                "Shake gently",
                                "Observe formation of layers and color",
                                "Record results"
                            ],
                            colorResults: {
                                noRedLayer: "No lipid - negative",
                                redLayer: "Lipid present (red layer on top or red droplets) - positive"
                            },
                            principle: "Sudan dyes are lipophilic (fat-soluble) and preferentially dissolve in lipids, staining them red/orange",
                            alternative: "Ethanol emulsion test - lipids form cloudy white emulsion when mixed with ethanol then added to water"
                        }
                    },
                    expectedResults: {
                        glucose: "Benedict's: brick red; Iodine: brown; Biuret: blue; Sudan: clear",
                        starch: "Benedict's: blue; Iodine: blue-black; Biuret: blue; Sudan: clear",
                        eggWhite: "Benedict's: blue; Iodine: brown; Biuret: violet; Sudan: clear",
                        oil: "Benedict's: blue; Iodine: brown; Biuret: blue; Sudan: red layer",
                        bread: "Benedict's: slight color (trace sugar); Iodine: blue-black; Biuret: slight violet; Sudan: clear",
                        potato: "Benedict's: slight color; Iodine: blue-black; Biuret: blue; Sudan: clear",
                        milk: "Benedict's: orange (lactose); Iodine: brown; Biuret: violet; Sudan: slight red"
                    },
                    dataTable: [
                        ["Food Sample", "Benedict's", "Iodine", "Biuret", "Sudan III"],
                        ["Glucose solution", "Brick red", "Brown", "Blue", "Clear"],
                        ["Starch solution", "Blue", "Blue-black", "Blue", "Clear"],
                        ["Egg white", "Blue", "Brown", "Violet", "Clear"],
                        ["Vegetable oil", "Blue", "Brown", "Blue", "Red layer"],
                        ["Bread", "Yellow", "Blue-black", "Pale violet", "Clear"],
                        ["Potato", "Green/yellow", "Blue-black", "Blue", "Clear"],
                        ["Milk", "Orange", "Brown", "Violet", "Slight red"]
                    ],
                    analysis: {
                        interpretation: [
                            "Positive Benedict's = reducing sugars present (simple sugars)",
                            "Positive iodine = starch present (complex carbohydrate)",
                            "Positive Biuret = proteins present",
                            "Positive Sudan = lipids/fats present",
                            "Some foods contain multiple macromolecules"
                        ],
                        limitations: [
                            "Tests are qualitative, not quantitative (can't determine exact amounts)",
                            "Sucrose does NOT give positive Benedict's (not a reducing sugar)",
                            "Very dilute samples may give false negatives",
                            "Food colorings can interfere with results"
                        ]
                    },
                    conclusions: [
                        "Different foods contain different combinations of macromolecules",
                        "Chemical tests can identify specific macromolecules based on their unique properties",
                        "Carbohydrates, proteins, and lipids have distinct chemical behaviors",
                        "Simple tests confirm Prout's classification of nutrients into distinct groups"
                    ],
                    realWorldApplications: [
                        "Food labeling and nutritional analysis",
                        "Quality control in food industry",
                        "Detecting adulteration in food products",
                        "Diagnosing malnutrition",
                        "Educational demonstrations of biochemistry"
                    ],
                    extensions: [
                        "Test a variety of foods and create a macromolecule content chart",
                        "Investigate why sucrose doesn't give positive Benedict's test",
                        "Research how food processing affects test results",
                        "Design quantitative versions of these tests"
                    ]
                }
            },

            // ========================================
            // PROTEIN EXPERIMENTS
            // ========================================
            
            sangers_insulin_sequencing: {
                name: "Sanger's Sequencing of Insulin - Paper Chromatography of Amino Acids",
                relatedTopics: ['proteins', 'molecular_techniques'],
                category: 'protein_structure',
                historicalBackground: {
                    scientist: "Frederick Sanger",
                    year: "1951-1955",
                    achievement: "First complete amino acid sequence of a protein (insulin)",
                    nobelPrize: "1958 Nobel Prize in Chemistry (his first of two)",
                    significance: "Proved proteins have definite, reproducible sequences; opened era of protein chemistry",
                    method: {
                        strategy: "Break insulin into smaller peptides using different enzymes/chemicals",
                        hydrolysis: [
                            "Acid hydrolysis breaks all peptide bonds → individual amino acids",
                            "Partial acid hydrolysis → mix of shorter peptides",
                            "Enzyme digestion (trypsin, chymotrypsin) → specific cuts"
                        ],
                        identification: "Used paper chromatography and electrophoresis to separate and identify amino acids",
                        sequencing: [
                            "Sanger's reagent (FDNB - fluorodinitrobenzene) labels N-terminal amino acid",
                            "Hydrolyze labeled peptide, identify labeled amino acid (it was N-terminal)",
                            "Repeat process on overlapping peptides",
                            "Piece together like a puzzle"
                        ],
                        result: "Insulin has two polypeptide chains (A-chain 21 aa, B-chain 30 aa) linked by disulfide bonds",
                        insight: "Proved primary structure is genetically determined and precise"
                    },
                    quote: "The amino acid sequence of insulin is not a random affair but a specific sequence"
                },
                labExperiment: {
                    title: "Paper Chromatography of Amino Acids",
                    hypothesis: "Different amino acids have different polarities and can be separated by paper chromatography based on their differential migration in a solvent",
                    purpose: "Separate and identify amino acids using paper chromatography, understanding the principle Sanger used",
                    variables: {
                        independent: "Type of amino acids in mixture",
                        dependent: "Rf value (distance traveled) of each amino acid",
                        controlled: ["Solvent composition", "Paper type", "Temperature", "Humidity", "Development time"]
                    },
                    materials: [
                        "Chromatography paper (Whatman No. 1 or similar)",
                        "Amino acid solutions (0.1% each): glycine, alanine, leucine, aspartic acid, lysine",
                        "Unknown mixture of amino acids",
                        "Solvent (mobile phase): butanol:acetic acid:water (4:1:1) or similar",
                        "Ninhydrin spray (0.2% in acetone) or dipping solution",
                        "Chromatography tank or large beaker with lid",
                        "Micropipette or capillary tubes for spotting",
                        "Pencil and ruler",
                        "Drying oven or hair dryer",
                        "Forceps",
                        "Gloves and safety goggles"
                    ],
                    safetyPrecautions: [
                        "Perform in well-ventilated area (fume hood if available)",
                        "Butanol and acetic acid are flammable and corrosive",
                        "Ninhydrin is toxic - avoid skin contact, wear gloves",
                        "No flames near solvents",
                        "Oven used for drying should be well-ventilated"
                    ],
                    procedure: [
                        "SETUP:",
                        "Cut chromatography paper to appropriate size (e.g., 20 cm × 15 cm)",
                        "Using PENCIL (not pen), draw a faint baseline 2 cm from bottom edge",
                        "Mark spots along baseline with pencil, evenly spaced (1-2 cm apart)",
                        "Label each spot position lightly in pencil",
                        "",
                        "SPOTTING SAMPLES:",
                        "Using capillary tube or micropipette, apply tiny spot of each amino acid solution to marked positions",
                        "Spot should be small (<5 mm diameter) - important for clear separation",
                        "Allow spot to dry completely (use hair dryer on cool setting)",
                        "Repeat spotting 2-3 times on same spot to concentrate amino acids (dry between applications)",
                        "Apply known amino acids and unknown mixture on same paper",
                        "",
                        "PREPARING SOLVENT TANK:",
                        "Pour solvent into chromatography tank to depth of ~1 cm",
                        "Cover tank and allow to equilibrate (saturate atmosphere) for 10-15 minutes",
                        "Solvent level must be BELOW baseline on paper when paper is inserted",
                        "",
                        "RUNNING CHROMATOGRAM:",
                        "Carefully place spotted paper in tank, ensuring bottom edge touches solvent",
                        "Paper should not touch sides of tank",
                        "Cover tank immediately to maintain saturated atmosphere",
                        "Allow solvent to rise up paper by capillary action until ~2 cm from top (typically 1-2 hours)",
                        "Do NOT move or disturb tank during development",
                        "",
                        "STOPPING AND DRYING:",
                        "When solvent front reaches near top, remove paper with forceps",
                        "Immediately mark the solvent front with pencil",
                        "Hang paper in fume hood to dry completely (~15-30 minutes)",
                        "Alternatively, dry in well-ventilated oven at low temperature (<80°C)",
                        "",
                        "VISUALIZATION:",
                        "Once dry, spray paper evenly with ninhydrin solution (or dip in ninhydrin)",
                        "Heat in oven at 100-110°C for 5-10 minutes",
                        "Amino acid spots will appear as purple/pink colors",
                        "Allow to cool",
                        "",
                        "MEASUREMENT AND CALCULATION:",
                        "Measure distance from baseline to center of each spot (d_spot)",
                        "Measure distance from baseline to solvent front (d_solvent)",
                        "Calculate Rf for each amino acid: Rf = d_spot / d_solvent",
                        "Identify unknown amino acids by comparing Rf values to known standards"
                    ],
                    ninhydrinReaction: {
                        principle: "Ninhydrin reacts with amino acids to form purple complex (Ruhemann's purple)",
                        reaction: "Ninhydrin + amino acid + heat → purple color (Ruhemann's purple)",
                        note: "Proline gives yellow color instead of purple",
                        sensitivity: "Can detect as little as 1-5 µg of amino acid"
                    },
                    expectedRfValues: {
                        note: "Rf values depend on solvent system; these are approximate for butanol:acetic acid:water (4:1:1)",
                        glycine: "~0.26 (most polar, travels least)",
                        alanine: "~0.38",
                        valine: "~0.60",
                        leucine: "~0.73",
                        phenylalanine: "~0.68",
                        asparticAcid: "~0.24 (polar, acidic)",
                        lysine: "~0.14 (polar, basic, travels least)",
                        general: "Nonpolar amino acids travel farther; polar amino acids stay closer to baseline"
                    },
                    observations: [
                        "Each known amino acid produces a spot at characteristic Rf value",
                        "More polar (hydrophilic) amino acids have lower Rf values",
                        "Less polar (hydrophobic) amino acids have higher Rf values",
                        "Unknown mixture can be analyzed by matching Rf values",
                        "Well-separated spots indicate good chromatographic conditions",
                        "Overlapping spots indicate need for different solvent system"
                    ],
                    results: "Amino acids separate based on polarity. Nonpolar amino acids (leucine, phenylalanine) travel farther up paper; polar amino acids (glycine, aspartic acid, lysine) remain closer to baseline. Unknown mixture can be identified by comparing Rf values.",
                    dataTable: [
                        ["Amino Acid", "Polarity", "Distance Moved (cm)", "Solvent Front (cm)", "Rf Value"],
                        ["Glycine", "Polar", "2.6", "10.0", "0.26"],
                        ["Alanine", "Nonpolar", "3.8", "10.0", "0.38"],
                        ["Leucine", "Nonpolar", "7.3", "10.0", "0.73"],
                        ["Aspartic acid", "Polar (acidic)", "2.4", "10.0", "0.24"],
                        ["Lysine", "Polar (basic)", "1.4", "10.0", "0.14"]
                    ],
                    analysis: {
                        RfInterpretation: [
                            "Rf is constant for a given amino acid in a specific solvent system",
                            "Rf depends on amino acid polarity and solvent polarity",
                            "Polar amino acids interact strongly with polar paper (cellulose) → low Rf",
                            "Nonpolar amino acids prefer mobile phase → high Rf"
                        ],
                        factorsAffectingRf: [
                            "Solvent composition (different solvents give different Rf)",
                            "Temperature (affects solvent properties)",
                            "Paper quality and type",
                            "pH of solvent",
                            "Saturation of tank atmosphere"
                        ],
                        limitations: [
                            "Cannot separate amino acids with very similar Rf values",
                            "Quantification difficult (only semi-quantitative by spot intensity)",
                            "Affected by environmental conditions",
                            "Time-consuming compared to modern methods"
                        ]
                    },
                    connectionToSanger: {
                        technique: "Sanger used paper chromatography extensively to separate peptides and amino acids",
                        combination: "Combined chromatography with chemical labeling (FDNB) to sequence peptides",
                        modernEquivalent: "Today: automated Edman degradation, mass spectrometry sequencing",
                        importance: "Demonstrated that proteins have precise, reproducible sequences encoded by genes"
                    },
                    modernTechniques: [
                        "Thin Layer Chromatography (TLC) - faster, better resolution",
                        "High Performance Liquid Chromatography (HPLC) - automated, quantitative",
                        "Mass Spectrometry - can sequence entire proteins",
                        "Automated Edman Degradation - sequential N-terminal amino acid removal",
                        "DNA sequencing - infer protein sequence from gene sequence"
                    ],
                    realWorldApplications: [
                        "Quality control in pharmaceutical industry",
                        "Food analysis (detecting amino acid adulteration)",
                        "Medical diagnostics (aminoacidopathies like phenylketonuria)",
                        "Forensic science",
                        "Research in protein chemistry"
                    ],
                    extensions: [
                        "Try different solvent systems and compare Rf values",
                        "Perform 2D chromatography (run in two perpendicular directions with different solvents)",
                        "Investigate how pH affects amino acid separation",
                        "Quantify amino acids by measuring spot intensity or area"
                    ]
                }
            },

            // ========================================
            // LIPID EXPERIMENTS
            // ========================================
            
            chevreuls_fatty_acids: {
                name: "Chevreul's Study of Fatty Acids - Saponification (Soap Making)",
                relatedTopics: ['lipids'],
                category: 'lipid_chemistry',
                historicalBackground: {
                    scientist: "Michel Eugène Chevreul",
                    year: "1813-1823",
                    achievement: "Discovered that fats are esters of glycerol and fatty acids; pioneered analysis of lipids",
                    contribution: [
                        "Showed fats are not simple substances but composed of glycerol + fatty acids",
                        "Isolated and characterized many fatty acids (stearic, oleic, butyric, etc.)",
                        "Explained saponification chemistry (fat + base → soap + glycerol)",
                        "Distinguished between saturated and unsaturated fats"
                    ],
                    context: "Before Chevreul, soap making was empirical. He provided chemical understanding, founding lipid chemistry",
                    significance: "Established that biological molecules have defined structures, laid groundwork for organic chemistry",
                    quote: "Animal fats are composed of three acids united with glycerine"
                },
                labExperiment: {
                    title: "Saponification: Making Soap from Lipids",
                    hypothesis: "If fats are esters of glycerol and fatty acids, then treating fats with strong base will hydrolyze the ester bonds, producing soap (fatty acid salts) and glycerol",
                    purpose: "Demonstrate saponification reaction and produce soap, understanding lipid chemistry",
                    chemicalReaction: {
                        general: "Triglyceride + 3 NaOH → Glycerol + 3 Soap (sodium fatty acid salt)",
                        detailed: "R-COO-CH₂ (fat ester bonds) + NaOH → R-COO⁻ Na⁺ (soap) + CH₂OH (glycerol)",
                        explanation: "Base-catalyzed hydrolysis of ester bonds in triglycerides"
                    },
                    variables: {
                        independent: "Type of fat/oil used (animal fat vs vegetable oil)",
                        dependent: "Properties of soap produced (hardness, lathering)",
                        controlled: ["NaOH concentration", "Temperature", "Reaction time", "Stirring rate"]
                    },
                    materials: [
                        "Vegetable oil or animal fat (lard, coconut oil, olive oil) - 25 ml",
                        "Sodium hydroxide (NaOH) pellets - 5 g",
                        "Distilled water - 10 ml",
                        "Ethanol (95%) - 15 ml (optional, helps dissolve fat)",
                        "Saturated salt solution (NaCl)",
                        "250 ml beaker",
                        "Glass stirring rod",
                        "Hot plate or Bunsen burner",
                        "Thermometer",
                        "pH paper",
                        "Cheesecloth or filter paper",
                        "Molds for soap (small cups, ice cube tray)",
                        "Safety goggles, gloves, lab coat"
                    ],
                    safetyPrecautions: [
                        "CRITICAL: Sodium hydroxide is highly caustic - causes severe burns",
                        "Wear safety goggles, gloves, and lab coat at all times",
                        "Work in well-ventilated area",
                        "Add NaOH to water, NEVER water to NaOH (exothermic!)",
                        "If NaOH contacts skin, rinse immediately with copious water for 15 minutes",
                        "Do not touch soap mixture until neutralized",
                        "Keep ethanol away from flames",
                        "Have vinegar or dilute acid available to neutralize spills"
                    ],
                    procedure: [
                        "PREPARATION OF NaOH SOLUTION:",
                        "Wearing full PPE, carefully add 5 g NaOH pellets to 10 ml distilled water in beaker",
                        "Stir gently until dissolved (solution will get HOT - exothermic)",
                        "Allow to cool slightly",
                        "",
                        "SAPONIFICATION REACTION:",
                        "Add 25 ml of oil or melted fat to the NaOH solution",
                        "Optional: Add 15 ml ethanol to help dissolve fat (improves mixing)",
                        "Place beaker on hot plate, heat gently to 70-80°C",
                        "Stir continuously with glass rod for 30-45 minutes",
                        "Mixture should become thick and opaque (saponification occurring)",
                        "Monitor temperature - don't overheat or boil vigorously",
                        "",
                        "SALTING OUT (OPTIONAL):",
                        "Once mixture is thick and homogeneous, add saturated salt solution (20-30 ml)",
                        "Stir well",
                        "Soap will separate and float (less soluble in salt water)",
                        "Allow to cool and solidify",
                        "",
                        "SEPARATION AND MOLDING:",
                        "Skim soap layer from top (if salted out) or pour entire mixture into mold",
                        "If using mold, line with wax paper or plastic wrap",
                        "Allow soap to harden for 24-48 hours",
                        "",
                        "CURING (OPTIONAL FOR USE):",
                        "Remove hardened soap from mold",
                        "Test pH with pH paper - should be around 9-10 (safe for skin)",
                        "If too alkaline (pH >11), allow to cure for several more weeks",
                        "Curing allows excess NaOH to react with atmospheric CO₂",
                        "",
                        "TESTING SOAP PROPERTIES:",
                        "Test small piece in water - should lather and emulsify oils",
                        "Compare soaps made from different fats (hardness, lather, feel)"
                    ],
                    observations: {
                        duringReaction: [
                            "Mixture becomes warm (exothermic reaction)",
                            "Initially two layers (oil and water separate)",
                            "With stirring and heating, becomes uniform emulsion",
                            "Gradually thickens as saponification proceeds",
                            "Changes from clear/translucent to opaque white/cream color",
                            "May trace patterns in thickened mixture (sign of saponification)"
                        ],
                        afterReaction: [
                            "Solidifies upon cooling",
                            "Texture depends on fat type: coconut oil → hard soap; olive oil → softer soap",
                            "Sweet smell of glycerol may be detectable",
                            "Soap lathers in water and emulsifies oils"
                        ]
                    },
                    chemistryExplanation: {
                        saponification: "Alkaline hydrolysis breaks ester bonds in triglycerides",
                        products: {
                            soap: "Sodium salts of fatty acids (amphipathic molecules)",
                            glycerol: "Three-carbon alcohol (sweet, water-soluble)"
                        },
                        soapStructure: {
                            head: "Carboxylate group (COO⁻) - hydrophilic (water-loving)",
                            tail: "Long hydrocarbon chain - hydrophobic (water-fearing)",
                            amphipathic: "Dual nature allows soap to emulsify oils in water"
                        },
                        cleaningAction: {
                            mechanism: [
                                "Soap molecules orient at oil-water interface",
                                "Hydrophobic tails dissolve in oil/grease",
                                "Hydrophilic heads face water",
                                "Form micelles (spheres) around oil droplets",
                                "Micelles suspend in water and rinse away"
                            ]
                        }
                    },
                    fatComparison: {
                        coconutOil: {
                            fattyAcids: "High in saturated fatty acids (lauric, myristic)",
                            soap: "Hard, cleansing, lots of lather",
                            meltingPoint: "High"
                        },
                        oliveOil: {
                            fattyAcids: "High in monounsaturated (oleic acid)",
                            soap: "Softer, moisturizing, less lather",
                            meltingPoint: "Lower"
                        },
                        animalFat: {
                            fattyAcids: "Mix of saturated (stearic, palmitic)",
                            soap: "Hard, similar to coconut",
                            meltingPoint: "High",
                            note: "Traditional soap base"
                        }
                    },
                    results: "Soap is successfully produced from fats/oils, demonstrating that fats are esters that can be hydrolyzed. Different fats produce soaps with different properties, reflecting differences in fatty acid composition.",
                    dataTable: [
                        ["Fat/Oil Type", "Fatty Acid Type", "Soap Hardness", "Lathering", "Feel"],
                        ["Coconut oil", "Saturated (short)", "Hard", "Excellent", "Cleansing"],
                        ["Olive oil", "Monounsaturated", "Soft", "Poor", "Moisturizing"],
                        ["Lard (animal)", "Saturated (long)", "Hard", "Good", "Neutral"],
                        ["Mix (50:50)", "Mixed", "Medium", "Good", "Balanced"]
                    ],
                    analysis: {
                        saturatedVsUnsaturated: [
                            "Saturated fats (no double bonds) pack tightly → harder soap",
                            "Unsaturated fats (double bonds create kinks) pack loosely → softer soap",
                            "Chain length matters: shorter chains → more soluble, better lather"
                        ],
                        industrialSoapMaking: [
                            "Modern soaps are mixtures of different fats for balanced properties",
                            "May add glycerol back to increase moisture",
                            "Fragrances, colors, and other additives included",
                            "Some use synthetic detergents instead of true soap"
                        ]
                    },
                    connectionToChevreul: {
                        discovery: "Chevreul showed that different fats yield different fatty acids upon saponification",
                        method: "He isolated and crystallized individual fatty acids, determining their properties",
                        impact: "Proved fats have specific, definable chemical structures",
                        legacy: "Founded the field of lipid chemistry"
                    },
                    realWorldApplications: [
                        "Commercial soap and detergent manufacture",
                        "Understanding cleaning and emulsification",
                        "Biodiesel production (similar transesterification reaction)",
                        "Food industry (emulsifiers in processed foods)",
                        "Cosmetics and personal care products"
                    ],
                    extensions: [
                        "Test different oil combinations for optimal soap properties",
                        "Extract glycerol from soap mixture and test its properties",
                        "Compare soap effectiveness in hard vs soft water",
                        "Investigate pH and its effect on skin",
                        "Research modern synthetic detergents vs traditional soap"
                    ],
                    troubleshooting: [
                        "Soap too soft: Not enough NaOH, or used very unsaturated oil",
                        "Soap won't harden: Reaction incomplete, heat longer or add more NaOH",
                        "Soap too harsh: Excess NaOH, allow longer curing time",
                        "Mixture separated: Insufficient stirring or temperature too low"
                    ]
                }
            },

            // ========================================
            // ENZYME EXPERIMENTS
            // ========================================
            
            fischer_lock_and_key: {
                name: "Fischer's Lock and Key Hypothesis - Enzyme Specificity Lab",
                relatedTopics: ['enzymes', 'proteins', 'carbohydrates'],
                category: 'enzyme_kinetics',
                historicalBackground: {
                    scientist: "Emil Fischer",
                    year: "1894",
                    hypothesis: "Lock and Key model of enzyme specificity",
                    proposal: "Enzyme (lock) has rigid active site that perfectly fits specific substrate (key)",
                    context: "Fischer studied enzyme-catalyzed sugar fermentation and observed strict substrate specificity",
                    significance: "First molecular explanation for enzyme specificity; foundation for understanding catalysis",
                    quote: "To use a picture, I would say that enzyme and glucoside must fit together like a lock and key",
                    nobelPrize: "1902 Nobel Prize in Chemistry (for work on sugars and purines)",
                    modernUpdate: "Induced Fit model (Koshland, 1958) refined this - active site changes shape upon binding"
                },
                labExperiment: {
                    title: "Enzyme Specificity: Salivary Amylase on Different Substrates",
                    hypothesis: "If enzymes have specific active sites shaped for particular substrates (lock and key), then salivary amylase will only digest starch and not other polysaccharides like cellulose",
                    purpose: "Demonstrate enzyme-substrate specificity using amylase and different carbohydrates",
                    background: {
                        amylase: "Enzyme that breaks down starch (α-1,4 glycosidic bonds)",
                        starch: "Polymer of glucose with α-1,4 and α-1,6 glycosidic bonds",
                        cellulose: "Polymer of glucose with β-1,4 glycosidic bonds",
                        difference: "Starch and cellulose are both glucose polymers but have different bond types and 3D structures",
                        prediction: "Amylase active site fits starch structure but NOT cellulose structure"
                    },
                    variables: {
                        independent: "Type of substrate (starch, cellulose, glucose)",
                        dependent: "Presence of reducing sugars (product formation)",
                        controlled: ["Enzyme concentration", "Substrate concentration", "Temperature", "pH", "Time"]
                    },
                    materials: [
                        "Saliva (source of amylase) or commercial amylase solution",
                        "Starch solution (1%)",
                        "Cellulose powder or filter paper",
                        "Glucose solution (positive control)",
                        "Distilled water (negative control)",
                        "Benedict's reagent",
                        "Iodine solution",
                        "Test tubes (15-20)",
                        "Test tube rack",
                        "Water bath (37°C)",
                        "Boiling water bath",
                        "Droppers or pipettes",
                        "Stopwatch or timer",
                        "pH paper",
                        "White tile for color observation"
                    ],
                    safetyPrecautions: [
                        "Use own saliva only (avoid cross-contamination)",
                        "Rinse mouth with water before collecting saliva",
                        "Handle Benedict's reagent carefully (contains copper sulfate)",
                        "Use test tube holder when heating",
                        "Wear safety goggles",
                        "Dispose of saliva-containing tubes properly"
                    ],
                    procedure: [
                        "PREPARATION OF ENZYME (SALIVA COLLECTION):",
                        "Rinse mouth thoroughly with water",
                        "Collect ~10 ml saliva in clean beaker (chew paraffin wax if needed to stimulate)",
                        "Dilute saliva 1:10 with distilled water (1 ml saliva + 9 ml water)",
                        "Keep at room temperature or 37°C until use",
                        "Alternative: Use commercial amylase solution per instructions",
                        "",
                        "SUBSTRATE PREPARATION:",
                        "Prepare 1% starch solution by mixing starch powder with warm water",
                        "If using cellulose: soak filter paper pieces in water or make cellulose suspension",
                        "Prepare glucose solution (1%) as positive control",
                        "",
                        "EXPERIMENTAL SETUP - Part 1: Substrate Specificity:",
                        "Label 6 test tubes: Starch, Starch+Amylase, Cellulose, Cellulose+Amylase, Glucose, Water",
                        "Add to each tube:",
                        "  Starch: 2 ml starch solution only",
                        "  Starch+Amylase: 2 ml starch solution + 2 ml diluted saliva",
                        "  Cellulose: 2 ml cellulose suspension only",
                        "  Cellulose+Amylase: 2 ml cellulose + 2 ml diluted saliva",
                        "  Glucose: 2 ml glucose solution (positive control)",
                        "  Water: 2 ml water (negative control)",
                        "",
                        "INCUBATION:",
                        "Place all tubes in 37°C water bath for 10 minutes",
                        "Swirl gently every 2-3 minutes to mix",
                        "",
                        "TEST 1 - IODINE TEST (for remaining starch):",
                        "After 10 min, remove 1 ml from each tube into new tubes",
                        "Add 2 drops of iodine solution to each",
                        "Observe color:",
                        "  Blue-black = starch still present (no digestion)",
                        "  Brown/orange = no starch (digestion occurred)",
                        "Record results",
                        "",
                        "TEST 2 - BENEDICT'S TEST (for reducing sugars/products):",
                        "To original tubes (or take another 2 ml sample), add 2 ml Benedict's reagent",
                        "Place in boiling water bath for 3-5 minutes",
                        "Observe color change:",
                        "  Blue = no reducing sugar (negative)",
                        "  Green/yellow/orange/red = reducing sugar present (positive)",
                        "Record results",
                        "",
                        "ADDITIONAL EXPERIMENTS (Optional):",
                        "Time course: Test at 0, 2, 5, 10, 15 min to see progression",
                        "Temperature effect: Compare 0°C, 37°C, 60°C, 100°C",
                        "pH effect: Add acid or base to change pH, compare activity",
                        "Enzyme concentration: Use different dilutions of saliva"
                    ],
                    expectedResults: {
                        iodineTest: {
                            starchOnly: "Blue-black (starch present)",
                            starchPlusAmylase: "Brown/orange (starch digested)",
                            celluloseOnly: "Brown/orange (no starch initially)",
                            cellulosePlusAmylase: "Brown/orange (cellulose not digested)",
                            glucose: "Brown/orange (no starch)",
                            water: "Brown/orange (no starch)"
                        },
                        benedictsTest: {
                            starchOnly: "Blue (no reducing sugars - starch non-reducing)",
                            starchPlusAmylase: "Orange/red (maltose/glucose produced)",
                            celluloseOnly: "Blue (no reducing sugars)",
                            cellulosePlusAmylase: "Blue (cellulose not broken down)",
                            glucose: "Orange/red (glucose is reducing sugar - positive control)",
                            water: "Blue (negative control)"
                        }
                    },
                    dataTable: [
                        ["Tube", "Substrate", "Enzyme", "Iodine Test", "Benedict's Test", "Interpretation"],
                        ["1", "Starch", "No", "Blue-black", "Blue", "Starch present, no digestion"],
                        ["2", "Starch", "Yes", "Brown", "Orange/Red", "Starch digested to sugars"],
                        ["3", "Cellulose", "No", "Brown", "Blue", "No starch, no sugars"],
                        ["4", "Cellulose", "Yes", "Brown", "Blue", "Cellulose NOT digested"],
                        ["5", "Glucose", "No", "Brown", "Orange/Red", "Positive control"],
                        ["6", "Water", "No", "Brown", "Blue", "Negative control"]
                    ],
                    observations: [
                        "Amylase digests starch (iodine test negative, Benedict's positive)",
                        "Amylase does NOT digest cellulose (no change from control)",
                        "Both starch and cellulose are glucose polymers, yet only starch is digested",
                        "This demonstrates enzyme specificity for substrate structure"
                    ],
                    analysis: {
                        whySpecificity: [
                            "Active site of amylase is shaped to fit α-1,4 glycosidic bonds in starch",
                            "Cellulose has β-1,4 bonds with different 3D structure",
                            "Active site does NOT fit cellulose structure",
                            "Like a lock that only fits one specific key"
                        ],
                        molecularBasis: [
                            "Amino acids in active site positioned to catalyze specific reaction",
                            "Substrate must fit precisely for catalysis to occur",
                            "Even small structural differences prevent binding and catalysis"
                        ],
                        lockAndKeyVsInducedFit: {
                            lockAndKey: "Rigid active site, substrate fits exactly (Fischer's original idea)",
                            inducedFit: "Active site changes shape slightly upon substrate binding (modern view)",
                            both: "Both models emphasize specificity - only correct substrate binds and is catalyzed"
                        }
                    },
                    results: "Amylase specifically digests starch but not cellulose, despite both being glucose polymers. This demonstrates enzyme-substrate specificity explained by the lock and key model - enzyme active site is complementary to starch structure but not cellulose structure.",
                    conclusions: [
                        "Enzymes are highly specific for their substrates",
                        "Specificity depends on 3D structure complementarity (shape)",
                        "Small structural differences (α vs β bonds) prevent enzyme-substrate interaction",
                        "Lock and key model explains enzyme specificity at molecular level",
                        "This explains why humans cannot digest cellulose (lack cellulase enzyme)"
                    ],
                    realWorldRelevance: {
                        humanDigestion: "Humans have amylase but not cellulase - can digest starch but not cellulose (dietary fiber)",
                        ruminants: "Cows/sheep have bacteria with cellulase in gut - can digest cellulose (grass)",
                        termites: "Have protozoa with cellulase - can digest wood",
                        lactoseIntolerance: "Lack of lactase enzyme → cannot digest lactose (similar specificity issue)",
                        drugDesign: "Understanding enzyme active sites allows design of specific inhibitors (drugs)"
                    },
                    extensions: [
                        "Test different enzymes with their specific substrates (lactase/lactose, protease/protein)",
                        "Investigate effect of temperature on reaction rate (enzyme denaturation)",
                        "Study effect of pH on amylase activity (optimal pH for salivary vs pancreatic amylase)",
                        "Quantify reaction rate by measuring product formation over time",
                        "Research how enzyme inhibitors work (competitive vs non-competitive)"
                    ],
                    modernConnections: [
                        "Drug development based on enzyme active site structure",
                        "Understanding metabolic diseases caused by enzyme deficiencies",
                        "Industrial enzyme applications (detergents, food processing)",
                        "Enzyme engineering for new catalytic activities"
                    ]
                }
            },

            // ========================================
            // CARBOHYDRATE STRUCTURE EXPERIMENTS
            // ========================================
            
            haworth_sugar_structures: {
                name: "Haworth's Sugar Structures - Polarimetry of Glucose",
                relatedTopics: ['carbohydrates', 'molecular_techniques'],
                category: 'molecular_structure',
                historicalBackground: {
                    scientist: "Walter Norman Haworth",
                    year: "1926-1929",
                    achievement: "Determined cyclic structure of sugars (pyranose and furanose rings)",
                    contribution: [
                        "Showed sugars exist as rings, not just linear chains",
                        "Developed Haworth projection formulas",
                        "Explained mutarotation phenomenon",
                        "Determined structure of vitamin C"
                    ],
                    nobelPrize: "1937 Nobel Prize in Chemistry",
                    context: "Before Haworth, sugars were thought to exist only in linear form. He proved cyclic forms dominate in solution",
                    significance: "Explained optical rotation changes (mutarotation) and reactivity of sugars",
                    mutarotation: "Spontaneous change in optical rotation of sugar solutions over time due to equilibrium between α and β anomers"
                },
                labExperiment: {
                    title: "Polarimetry: Measuring Optical Rotation and Mutarotation of Glucose",
                    hypothesis: "If glucose exists in equilibrium between linear, α-cyclic, and β-cyclic forms, then freshly dissolved glucose will show changing optical rotation over time (mutarotation) as equilibrium is established",
                    purpose: "Measure optical rotation of sugars using polarimeter and observe mutarotation",
                    background: {
                        opticalActivity: "Chiral molecules rotate plane-polarized light",
                        glucose: {
                            linearForm: "Has aldehyde group, chiral centers",
                            alphaCyclic: "OH on C1 is down (Haworth projection)",
                            betaCyclic: "OH on C1 is up (Haworth projection)",
                            equilibrium: "In solution: ~36% α, ~64% β, <0.1% linear"
                        },
                        specificRotation: "[α] = observed rotation / (concentration × path length)",
                        mutarotation: {
                            definition: "Change in optical rotation as anomers interconvert",
                            alphaGlucose: "[α] = +112° (initially, pure α form)",
                            betaGlucose: "[α] = +19° (initially, pure β form)",
                            equilibriumMixture: "[α] = +52.7° (final, both forms)"
                        }
                    },
                    variables: {
                        independent: "Type of sugar (α-glucose, β-glucose, fructose, sucrose)",
                        dependent: "Optical rotation angle",
                        controlled: ["Concentration", "Temperature", "Path length", "Wavelength of light"]
                    },
                    materials: [
                        "Polarimeter",
                        "α-D-glucose (anhydrous)",
                        "β-D-glucose (if available)",
                        "Fructose",
                        "Sucrose",
                        "Distilled water",
                        "Polarimeter tubes (fixed path length, e.g., 20 cm)",
                        "Balance (accurate to 0.01 g)",
                        "Volumetric flask (100 ml)",
                        "Beakers",
                        "Stirring rod",
                        "Stopwatch",
                        "Thermometer",
                        "Filter paper (if solution cloudy)"
                    ],
                    safetyPrecautions: [
                        "Polarimeter contains light source - avoid looking directly at beam",
                        "Handle glass tubes carefully to avoid breakage",
                        "Clean polarimeter tubes thoroughly to avoid contamination",
                        "Sugars are safe but avoid contaminating pure chemicals"
                    ],
                    polarimeterOperation: [
                        "SETUP:",
                        "Allow polarimeter to warm up (5-10 minutes)",
                        "Clean polarimeter tube and fill with distilled water",
                        "Place tube in polarimeter",
                        "Zero instrument with water (0° reading)",
                        "",
                        "MEASUREMENT:",
                        "Look through eyepiece and adjust analyzer until field is uniformly dark or light",
                        "Read angle from scale (in degrees)",
                        "Repeat 3 times and average",
                        "Empty tube and refill with sample solution"
                    ],
                    procedure: [
                        "PREPARATION OF GLUCOSE SOLUTION:",
                        "Weigh exactly 10.0 g of α-D-glucose",
                        "Place in 100 ml volumetric flask",
                        "Add ~50 ml distilled water",
                        "Swirl/stir to dissolve QUICKLY and completely",
                        "Immediately fill to 100 ml mark with water",
                        "Note exact time when glucose dissolves (t=0)",
                        "Mix thoroughly",
                        "",
                        "IMMEDIATE MEASUREMENT (t=0):",
                        "Quickly fill polarimeter tube with glucose solution (avoid air bubbles)",
                        "Place in polarimeter",
                        "Record optical rotation and time (within 1-2 minutes of dissolution)",
                        "This is initial rotation of predominantly α-glucose",
                        "",
                        "TIME-COURSE MEASUREMENTS (Mutarotation):",
                        "Continue measuring optical rotation at intervals:",
                        "  t = 0, 5, 10, 15, 20, 30, 45, 60, 90, 120 minutes",
                        "Record each reading and time",
                        "Keep solution at constant temperature (room temp or 25°C)",
                        "Plot rotation vs time to observe mutarotation",
                        "",
                        "EQUILIBRIUM MEASUREMENT:",
                        "After ~2 hours (or next day), measure final equilibrium rotation",
                        "This represents equilibrium mixture of α and β glucose",
                        "",
                        "COMPARISON WITH OTHER SUGARS:",
                        "Prepare 10% solutions of:",
                        "  Fructose",
                        "  Sucrose",
                        "Measure optical rotation of each",
                        "Compare rotation direction and magnitude"
                    ],
                    expectedResults: {
                        alphaGlucoseMutarotation: {
                            t0: "+110° to +112° (pure α form)",
                            t120min: "+52° to +53° (equilibrium)",
                            curve: "Exponential decay from +112° to +52.7°",
                            explanation: "α-glucose converts to equilibrium mixture with β-glucose"
                        },
                        betaGlucose: {
                            t0: "+19° (pure β form)",
                            tEquilibrium: "+52.7° (same equilibrium)",
                            curve: "Increase from +19° to +52.7°"
                        },
                        otherSugars: {
                            fructose: "−92° (levorotatory)",
                            sucrose: "+66° (dextrorotatory)",
                            lactose: "+55° (dextrorotatory)",
                            maltose: "+138° (highly dextrorotatory)"
                        }
                    },
                    dataTable: [
                        ["Time (min)", "Optical Rotation (degrees)", "% α-anomer", "% β-anomer"],
                        ["0", "+112", "~100", "~0"],
                        ["5", "+95", "~75", "~25"],
                        ["10", "+82", "~60", "~40"],
                        ["20", "+70", "~50", "~50"],
                        ["30", "+63", "~42", "~58"],
                        ["60", "+56", "~38", "~62"],
                        ["120", "+53", "~36", "~64"],
                        ["Equilibrium", "+52.7", "36", "64"]
                    ],
                    calculations: {
                        specificRotation: "[α]²⁰_D = α / (l × c)",
                        where: {
                            alpha: "observed rotation in degrees",
                            l: "path length in decimeters (dm)",
                            c: "concentration in g/ml"
                        },
                        example: {
                            observed: "+5.27° for 10% glucose in 20 cm tube",
                            calculation: "[α] = 5.27 / (2 dm × 0.1 g/ml) = +26.35° (per dm and g/ml)",
                            corrected: "[α] = +52.7° (standard concentration 1 g/ml, 1 dm)"
                        }
                    },
                    observations: [
                        "Freshly dissolved α-glucose shows high positive rotation (+112°)",
                        "Rotation decreases over time, approaching +52.7°",
                        "Rate of change is initially rapid, then slows",
                        "Equilibrium reached after ~2 hours at room temperature",
                        "Different sugars show different rotation directions and magnitudes",
                        "Fructose is levorotatory (negative rotation)"
                    ],
                    analysis: {
                        mutarotationMechanism: [
                            "In solution, cyclic glucose opens to linear form (very briefly)",
                            "Linear form can re-close to either α or β anomer",
                            "Process continues until equilibrium is reached",
                            "Equilibrium favors β-glucose (~64%) over α (~36%)",
                            "β-glucose is thermodynamically more stable (less steric hindrance)"
                        ],
                        factorsAffectingRate: [
                            "Temperature: higher temperature → faster mutarotation",
                            "pH: acids and bases catalyze mutarotation (speed it up)",
                            "Solvent: mutarotation faster in water than other solvents"
                        ],
                        opticalActivityBasis: [
                            "Chiral centers (asymmetric carbons) rotate polarized light",
                            "D-sugars typically dextrorotatory (+), but not always",
                            "L-sugars typically levorotatory (−), but not always",
                            "Direction and magnitude depend on overall molecular shape"
                        ]
                    },
                    connectionToHaworth: {
                        significance: "Haworth's cyclic structures explained why rotation changes over time",
                        discovery: "Realized sugars exist as pyranose (6-membered) and furanose (5-membered) rings",
                        anomers: "α and β forms differ only in OH position at C1 (anomeric carbon)",
                        projection: "Haworth projection shows ring as flat hexagon with groups above/below plane",
                        impact: "Understanding cyclic structures crucial for polysaccharide structure (starch, cellulose)"
                    },
                    realWorldApplications: [
                        "Quality control in sugar industry",
                        "Pharmaceutical analysis (drug purity)",
                        "Food industry (honey authenticity, sugar content)",
                        "Clinical chemistry (glucose measurement in blood)",
                        "Understanding enzymatic reactions with sugars"
                    ],
                    modernTechniques: [
                        "NMR spectroscopy can directly show α and β anomers",
                        "HPLC can separate and quantify anomers",
                        "X-ray crystallography reveals 3D structure",
                        "Computational chemistry predicts equilibrium ratios"
                    ],
                    extensions: [
                        "Measure mutarotation rate at different temperatures (Arrhenius plot)",
                        "Study effect of pH on mutarotation rate (acid/base catalysis)",
                        "Compare mutarotation of different monosaccharides",
                        "Investigate why sucrose does not show mutarotation (no free anomeric carbon)",
                        "Model mutarotation kinetics with first-order rate equation"
                    ],
                    troubleshooting: [
                        "Readings drift: Temperature not stable, allow equilibration",
                        "Cannot see field: Adjust analyzer or light intensity",
                        "Inconsistent readings: Air bubbles in tube, clean and refill",
                        "No mutarotation observed: Equilibrium already reached before first measurement (work faster!)"
                    ]
                }
            },

            // ========================================
            // MEMBRANE PERMEABILITY EXPERIMENTS
            // ========================================
            
            overton_lipid_solubility: {
                name: "Overton's Rule - Cell Membrane Permeability Lab (Beetroot Pigment)",
                relatedTopics: ['lipids', 'cell_membrane'],
                category: 'membrane_biology',
                historicalBackground: {
                    scientist: "Charles Ernest Overton",
                    year: "1899",
                    discovery: "Overton's Rule: Cell permeability to substances correlates with lipid solubility",
                    observation: "Tested ~500 compounds on plant cells, found lipid-soluble molecules enter cells faster",
                    hypothesis: "Cell membranes are composed primarily of lipids",
                    significance: "First evidence for lipid nature of cell membranes (before phospholipid bilayer model)",
                    context: "At the time, cell membrane composition was unknown. Overton's work suggested lipid barrier",
                    rule: "Permeability ∝ lipid solubility (measured by oil/water partition coefficient)",
                    modernView: "Confirmed by fluid mosaic model - membrane is phospholipid bilayer with embedded proteins"
                },
                labExperiment: {
                    title: "Cell Membrane Permeability: Beetroot Pigment Leakage",
                    hypothesis: "If cell membranes are lipid bilayers, then factors that disrupt membrane structure (heat, ethanol, detergents) will increase permeability and cause leakage of intracellular pigments",
                    purpose: "Investigate factors affecting cell membrane permeability using beetroot vacuolar pigment (betalain) as indicator",
                    background: {
                        beetroot: "Contains betalain pigment in vacuole (red/purple color)",
                        intact membrane: "Pigment remains inside vacuole",
                        damaged membrane: "Pigment leaks into surrounding solution (measurable by color intensity)",
                        factors: "Temperature, ethanol, detergents, pH affect membrane integrity"
                    },
                    variables: {
                        independent: "Treatment type (temperature, ethanol concentration, etc.)",
                        dependent: "Pigment leakage (measured by absorbance or color intensity)",
                        controlled: ["Beetroot piece size", "Treatment time", "Volume of solution", "Beetroot variety"]
                    },
                    materials: [
                        "Fresh beetroot (red beet)",
                        "Cork borer or knife (to cut uniform cylinders)",
                        "Ruler",
                        "Distilled water",
                        "Ethanol (various concentrations: 0%, 25%, 50%, 75%, 100%)",
                        "Detergent solution (dish soap, 1%)",
                        "Test tubes",
                        "Water baths at different temperatures (0°C, 20°C, 40°C, 60°C, 80°C)",
                        "Colorimeter or spectrophotometer (optional, for quantitative)",
                        "White tile for visual comparison",
                        "Thermometer",
                        "Timer",
                        "Pipettes"
                    ],
                    safetyPrecautions: [
                        "Beetroot stains clothing and skin - wear gloves and lab coat",
                        "Be careful with sharp cork borer/knife",
                        "Hot water baths can cause burns - handle with care",
                        "High concentrations of ethanol are flammable - keep away from flames"
                    ],
                    procedure: [
                        "PREPARATION OF BEETROOT SAMPLES:",
                        "Peel beetroot and cut into uniform cylinders using cork borer (~5 mm diameter)",
                        "Cut cylinders into discs of equal thickness (~3-5 mm thick)",
                        "Rinse discs thoroughly in distilled water until rinse water is clear",
                        "This removes pigment from damaged surface cells",
                        "Blot dry gently with paper towel",
                        "Prepare enough uniform discs for all treatments (at least 3 per condition)",
                        "",
                        "EXPERIMENT 1: EFFECT OF TEMPERATURE:",
                        "Label 6 test tubes: 0°C, 20°C, 40°C, 60°C, 80°C, 100°C",
                        "Add 10 ml distilled water to each tube",
                        "Place one beetroot disc in each tube",
                        "Incubate tubes at respective temperatures for 20 minutes:",
                        "  0°C: ice water bath",
                        "  20°C: room temperature",
                        "  40°C, 60°C, 80°C: water baths at these temperatures",
                        "  100°C: boiling water bath",
                        "After 20 min, remove beetroot discs",
                        "Observe and record color intensity of solutions",
                        "Optionally: measure absorbance at 530 nm with colorimeter",
                        "",
                        "EXPERIMENT 2: EFFECT OF ETHANOL (Lipid Solvent):",
                        "Label 5 test tubes: 0%, 25%, 50%, 75%, 100% ethanol",
                        "Prepare ethanol solutions by mixing with water:",
                        "  0%: 10 ml water",
                        "  25%: 2.5 ml ethanol + 7.5 ml water",
                        "  50%: 5 ml ethanol + 5 ml water",
                        "  75%: 7.5 ml ethanol + 2.5 ml water",
                        "  100%: 10 ml ethanol",
                        "Add one beetroot disc to each tube",
                        "Incubate at room temperature for 20 minutes",
                        "Remove discs and observe/measure pigment leakage",
                        "",
                        "EXPERIMENT 3: EFFECT OF DETERGENT (Disrupts Lipid Bilayer):",
                        "Prepare detergent solutions: 0%, 0.1%, 0.5%, 1%, 2%",
                        "Add beetroot disc to each",
                        "Incubate 20 minutes at room temperature",
                        "Observe pigment leakage",
                        "",
                        "MEASUREMENT:",
                        "Visual: Compare color intensity against white background, rank 0-5",
                        "Quantitative: Use colorimeter at 530 nm wavelength",
                        "Plot absorbance (or color score) vs treatment intensity"
                    ],
                    expectedResults: {
                        temperature: {
                            low0_20C: "Minimal or no pigment leakage (membranes intact)",
                            medium40C: "Slight pigment leakage (membranes becoming more fluid)",
                            high60_80C: "Significant pigment leakage (membranes disrupted, proteins denature)",
                            boiling100C: "Complete pigment release (membranes totally destroyed)"
                        },
                        ethanol: {
                            zero: "No leakage (membranes intact)",
                            low25: "Slight leakage (ethanol begins dissolving lipids)",
                            medium50: "Moderate leakage (significant membrane disruption)",
                            high75_100: "High leakage (membranes severely disrupted)"
                        },
                        detergent: {
                            zero: "No leakage",
                            increasing: "Progressively more leakage as detergent concentration increases",
                            mechanism: "Detergents solubilize membrane lipids, creating holes"
                        }
                    },
                    dataTable: [
                        ["Temperature (°C)", "Color Intensity (0-5)", "Absorbance (530 nm)", "Membrane Integrity"],
                        ["0", "0", "0.05", "Intact"],
                        ["20", "1", "0.12", "Mostly intact"],
                        ["40", "2", "0.35", "Slightly damaged"],
                        ["60", "4", "0.88", "Significantly damaged"],
                        ["80", "5", "1.45", "Severely damaged"],
                        ["100", "5", "1.92", "Completely destroyed"],
                        ["", "", "", ""],
                        ["Ethanol (%)", "Color Intensity", "Absorbance", "Membrane Integrity"],
                        ["0", "0", "0.06", "Intact"],
                        ["25", "2", "0.41", "Slightly disrupted"],
                        ["50", "3", "0.79", "Moderately disrupted"],
                        ["75", "4", "1.18", "Severely disrupted"],
                        ["100", "5", "1.55", "Completely disrupted"]
                    ],
                    observations: [
                        "Low temperatures preserve membrane integrity (little pigment leakage)",
                        "High temperatures cause membrane breakdown (extensive leakage)",
                        "Threshold around 60°C where leakage dramatically increases (protein denaturation)",
                        "Ethanol disrupts membranes in dose-dependent manner",
                        "Detergents rapidly solubilize membranes even at low concentrations",
                        "Damage is often irreversible (pigment doesn't go back in)"
                    ],
                    analysis: {
                        temperatureEffect: [
                            "Low temp: membranes less fluid but intact",
                            "Moderate temp (37°C): optimal fluidity, intact",
                            "High temp (>60°C): membrane proteins denature, lipids become too fluid",
                            "Boiling: complete destruction of membrane structure"
                        ],
                        ethanolEffect: [
                            "Ethanol dissolves lipids (similar polarity)",
                            "Creates holes/disruptions in bilayer",
                            "Demonstrates Overton's Rule: lipid solvents penetrate lipid membranes",
                            "Mechanism: ethanol intercalates between phospholipids, increasing permeability"
                        ],
                        detergentEffect: [
                            "Detergents have hydrophobic tail and hydrophilic head (like phospholipids)",
                            "Solubilize membrane lipids into micelles",
                            "Disrupt bilayer integrity",
                            "Used in cell lysis for protein extraction"
                        ]
                    },
                    connectionToOverton: {
                        rule: "Lipid-soluble substances (ethanol) easily cross/disrupt lipid membranes",
                        evidence: "Ethanol (lipid-soluble) disrupts membrane; water (polar) does not",
                        implication: "Membranes must be lipid-based to show this selective permeability",
                        modernConfirmation: "Phospholipid bilayer model confirms Overton's hypothesis"
                    },
                    molecularExplanation: {
                        fluidMosaicModel: "Membrane = phospholipid bilayer with embedded proteins",
                        phospholipidStructure: {
                            head: "Hydrophilic (polar, phosphate group)",
                            tail: "Hydrophobic (nonpolar, fatty acid chains)"
                        },
                        permeability: {
                            highlyPermeable: "Small, nonpolar molecules (O₂, CO₂, ethanol)",
                            lowlyPermeable: "Large, polar molecules (glucose, ions)",
                            impermeable: "Very large or charged molecules (proteins, DNA)"
                        },
                        factors: [
                            "Temperature affects membrane fluidity",
                            "Cholesterol modulates fluidity (at moderate temps)",
                            "Saturated vs unsaturated fatty acids affect packing"
                        ]
                    },
                    results: "Membrane permeability increases with temperature, ethanol concentration, and detergent concentration. This demonstrates that cell membranes are lipid-based structures that can be disrupted by heat, lipid solvents, and detergents, supporting Overton's Rule and the fluid mosaic model.",
                    conclusions: [
                        "Cell membranes are selectively permeable lipid barriers",
                        "Lipid-soluble substances can disrupt membrane integrity",
                        "Temperature affects membrane fluidity and integrity",
                        "Detergents solubilize membranes by interacting with lipids",
                        "Overton's Rule is confirmed: lipid solubility predicts membrane permeability"
                    ],
                    realWorldApplications: [
                        "Understanding drug delivery (lipid-soluble drugs cross membranes better)",
                        "Food preservation (heat treatment destroys microbial membranes)",
                        "Alcohol antiseptics (disrupt bacterial membranes)",
                        "Cryopreservation (avoid ice crystal damage to membranes)",
                        "Understanding how toxins and pollutants affect cells"
                    ],
                    extensions: [
                        "Test effect of pH on membrane integrity",
                        "Compare different types of cells (plant vs animal)",
                        "Investigate protective effects of antioxidants",
                        "Study membrane recovery after mild stress",
                        "Quantify permeability using Fick's Law of Diffusion",
                        "Model membrane as lipid bilayer and predict permeability of different molecules"
                    ],
                    limitations: [
                        "Beetroot cells are dead (vacuole membrane, not plasma membrane primarily studied)",
                        "Only measures passive leakage, not active transport",
                        "Qualitative unless spectrophotometer used",
                        "Natural variation in beetroot pigment content"
                    ],
                    troubleshooting: [
                        "Rinse water colored: Cut surfaces damaged, rinse more thoroughly",
                        "No difference between treatments: Beetroot may be old/damaged, use fresh",
                        "All samples very colored: Cutting damaged too many cells, be gentler",
                        "Inconsistent results: Ensure uniform disc size and treatment time"
                    ]
                }
            }
        };

        // Link experiments to topics
        this.linkExperimentsToTopics();
    }

    linkExperimentsToTopics() {
        Object.entries(this.molecularExperiments).forEach(([expId, experiment]) => {
            experiment.relatedTopics.forEach(topicId => {
                if (this.molecularTopics[topicId]) {
                    if (!this.molecularTopics[topicId].relatedExperiments) {
                        this.molecularTopics[topicId].relatedExperiments = [];
                    }
                    this.molecularTopics[topicId].relatedExperiments.push({
                        id: expId,
                        name: experiment.name,
                        category: experiment.category
                    });
                }
            });
        });
    }

    initializeMisconceptionDatabase() {
        this.commonMisconceptions = {
            carbohydrates: {
                'Structure and Classification': [
                    'Thinking all carbohydrates are sugars (cellulose is carbohydrate but not sweet)',
                    'Believing carbs are only for energy (also structural: cellulose, chitin)',
                    'Confusing starch and cellulose (both glucose polymers but different bonds)',
                    'Thinking simple sugars are always bad (glucose is essential for brain function)',
                    'Believing all carbohydrates have same formula CH₂O (close but not exact for all)'
                ],
                'Reducing vs Non-reducing Sugars': [
                    'Thinking sucrose is a reducing sugar (it\'s not - no free anomeric carbon)',
                    'Believing all disaccharides are reducing sugars (sucrose is exception)',
                    'Confusing reducing ability with sweetness'
                ]
            },
            
            lipids: {
                'Structure and Function': [
                    'Thinking all fats are bad (essential fatty acids, membrane phospholipids vital)',
                    'Believing lipids are only for energy storage (also membranes, signaling, vitamins)',
                    'Confusing saturated with unhealthy (some saturated fats are essential)',
                    'Thinking cholesterol is always harmful (needed for membranes, hormones, vitamin D)',
                    'Believing lipids dissolve in water (they\'re hydrophobic by definition)'
                ],
                'Fatty Acids': [
                    'Thinking saturated means solid (coconut oil is saturated but liquid in tropics - it\'s about melting point)',
                    'Believing all unsaturated fats are healthy (trans fats are unsaturated but harmful)',
                    'Confusing omega-3/6/9 with number of double bonds (it\'s position of first double bond from methyl end)'
                ]
            },
            
            proteins: {
                'Structure': [
                    'Thinking primary structure is unimportant (it determines all higher structures)',
                    'Believing all proteins have quaternary structure (many are single polypeptides)',
                    'Confusing denaturation with hydrolysis (denaturation unfolds, hydrolysis breaks peptide bonds)',
                    'Thinking denatured = non-functional (sometimes reversible)',
                    'Believing protein folding is random (it\'s determined by sequence and environment)'
                ],
                'Function': [
                    'Thinking proteins are only for structure (enzymes, transport, signaling, etc.)',
                    'Believing all enzymes are proteins (some RNAs are catalytic - ribozymes)',
                    'Confusing amino acids with proteins (proteins are polymers OF amino acids)'
                ]
            },
            
            nucleic_acids: {
                'DNA vs RNA': [
                    'Thinking DNA and RNA only differ by one letter (many differences: sugar, bases, structure, stability)',
                    'Believing RNA is always single-stranded (can have secondary structure, tRNA has cloverleaf)',
                    'Thinking thymine and uracil are very different (just methyl group difference)',
                    'Confusing DNA replication with transcription'
                ],
                'Structure': [
                    'Believing A=T means same amount of adenine and thymine in single strand (true for double-stranded DNA, not single)',
                    'Thinking base pairing is due to electrostatic attraction (it\'s hydrogen bonding)',
                    'Confusing nucleotide with nucleoside (nucleoside lacks phosphate)'
                ]
            },
            
            bioenergetics: {
                'ATP': [
                    'Thinking ATP is stored in large amounts (actually made on demand, small reserves)',
                    'Believing ATP is only made in mitochondria (also in glycolysis in cytoplasm)',
                    'Confusing ATP with ADP (3 vs 2 phosphates)',
                    'Thinking ATP synthesis requires oxygen (glycolysis doesn\'t)'
                ],
                'Cellular Respiration': [
                    'Believing plants don\'t do cellular respiration (they do! They need ATP too)',
                    'Thinking glucose is directly converted to ATP (multi-step process)',
                    'Confusing fermentation with cellular respiration (fermentation is anaerobic, no oxygen)',
                    'Believing all organisms use O₂ (anaerobes use other electron acceptors)',
                    'Thinking 38 ATP is exact yield (varies by shuttle system, 36-38 range)'
                ]
            },
            
            enzymes: {
                'Activity and Specificity': [
                    'Thinking enzymes are consumed in reactions (they\'re reused)',
                    'Believing enzymes change equilibrium of reaction (they speed it up but don\'t change equilibrium)',
                    'Confusing enzyme with substrate (enzyme is catalyst, substrate is what\'s acted upon)',
                    'Thinking all enzymes work best at pH 7 (optimal pH varies)',
                    'Believing higher temperature always increases activity (until denaturation)'
                ],
                'Inhibition': [
                    'Confusing competitive with non-competitive inhibition',
                    'Thinking all inhibitors are bad (many are drugs that work by inhibiting enzymes)',
                    'Believing inhibition is always irreversible'
                ]
            },
            
            molecular_signaling: {
                'Signal Transduction': [
                    'Thinking signaling is always slow (some pathways are milliseconds)',
                    'Believing one signal = one response (often amplification cascades)',
                    'Confusing first messenger with second messenger',
                    'Thinking receptors are only on cell surface (steroid receptors are intracellular)'
                ]
            }
        };

        this.clarificationStrategies = {
            visual_comparison: {
                method: 'Use diagrams to show structural differences',
                effectiveness: 'High for distinguishing similar molecules'
            },
            analogy: {
                method: 'Relate to everyday examples (lock and key, etc.)',
                effectiveness: 'High for abstract concepts'
            },
            molecular_models: {
                method: 'Build physical or virtual 3D models',
                effectiveness: 'Very high for understanding structure'
            },
            contrast_table: {
                method: 'Side-by-side comparison charts',
                effectiveness: 'High for related concepts'
            },
            chemical_equations: {
                method: 'Show balanced reactions and mechanisms',
                effectiveness: 'High for understanding processes'
            },
            experimental_demonstration: {
                method: 'Link to historical and lab experiments',
                effectiveness: 'Very high for concrete understanding'
            }
        };
    }

    initializeMetacognitivePrompts() {
        this.metacognitivePrompts = {
            beforeLearning: [
                "What do you already know about {topic}?",
                "What questions do you have about {topic}?",
                "How does {topic} relate to what you've learned before?",
                "What do you predict will be most challenging about {topic}?"
            ],
            duringLearning: [
                "Does this make sense? Can you explain it in your own words?",
                "How does this connect to {related_concept}?",
                "What's confusing about this concept?",
                "Can you think of a real-world example of {concept}?"
            ],
            afterLearning: [
                "What were the main ideas about {topic}?",
                "What surprised you while learning about {topic}?",
                "What are you still unsure about?",
                "How would you teach {topic} to someone else?",
                "What study strategy worked best for you with this material?"
            ],
            problemSolving: [
                "What is the question really asking?",
                "What information do you have? What do you need?",
                "Have you seen a similar problem before?",
                "Did your answer make sense? How can you check?"
            ]
        };
    }

    initializeContextualScenarios() {
        this.contextualScenarios = {
            carbohydrates: [
                {
                    scenario: "Diabetes Management",
                    context: "A person with diabetes needs to understand how different carbohydrates affect blood glucose levels",
                    application: "Simple sugars (glucose, sucrose) raise blood sugar quickly; complex carbohydrates (starch with fiber) are absorbed slowly",
                    question: "Why does eating whole grain bread affect blood sugar differently than white bread?"
                },
                {
                    scenario: "Athletic Performance",
                    context: "Marathon runners 'carbo-load' before races",
                    application: "Glycogen stores in muscles provide energy during endurance exercise",
                    question: "Why do athletes eat pasta the night before a race?"
                }
            ],
            
            lipids: [
                {
                    scenario: "Heart Disease Prevention",
                    context: "Understanding different types of dietary fats and cardiovascular health",
                    application: "Trans fats and excessive saturated fats increase LDL cholesterol; unsaturated fats (omega-3) are protective",
                    question: "Why are trans fats particularly harmful even though they're unsaturated?"
                },
                {
                    scenario: "Cold-Water Fish",
                    context: "Fish in cold water have more unsaturated fats in membranes",
                    application: "Unsaturated fatty acids remain fluid at low temperatures (kinks prevent tight packing)",
                    question: "How do Arctic fish keep their cell membranes functional in freezing water?"
                }
            ],
            
            proteins: [
                {
                    scenario: "Sickle Cell Disease",
                    context: "Single amino acid substitution in hemoglobin causes disease",
                    application: "Glutamic acid → Valine at position 6 changes protein shape, causes RBCs to sickle",
                    question: "How can one amino acid change cause such severe disease?"
                },
                {
                    scenario: "Cooking Eggs",
                    context: "Eggs change texture when cooked",
                    application: "Heat denatures proteins (ovalbumin), causing them to unfold and aggregate",
                    question: "Why can't you 'uncook' an egg?"
                }
            ],
            
            enzymes: [
                {
                    scenario: "Lactose Intolerance",
                    context: "Many adults can't digest milk sugar",
                    application: "Lack of lactase enzyme means lactose not broken down, causing digestive problems",
                    question: "Why do lactose-intolerant people feel better when they take lactase pills?"
                },
                {
                    scenario: "Aspirin as Pain Reliever",
                    context: "Aspirin reduces pain and inflammation",
                    application: "Aspirin irreversibly inhibits COX enzyme, blocking prostaglandin synthesis",
                    question: "Why does aspirin have long-lasting effects even though it's cleared from blood quickly?"
                }
            ],
            
            bioenergetics: [
                {
                    scenario: "Cyanide Poisoning",
                    context: "Cyanide is rapidly fatal",
                    application: "Cyanide blocks cytochrome c oxidase in electron transport chain, halting ATP production",
                    question: "Why does cyanide cause death so quickly?"
                },
                {
                    scenario: "High-Altitude Adaptation",
                    context: "People at high altitude produce more red blood cells",
                    application: "Less O₂ available, so body compensates to maintain aerobic respiration and ATP production",
                    question: "Why do athletes train at high altitude?"
                }
            ]
        };
    }

    initializeAssessmentRubrics() {
        this.assessmentRubrics = {
            knowledgeLevel: {
                remember: {
                    description: "Recall facts, terms, basic concepts",
                    verbs: ["Define", "List", "Identify", "Name", "State"],
                    example: "Define monosaccharide"
                },
                understand: {
                    description: "Explain ideas or concepts",
                    verbs: ["Explain", "Describe", "Summarize", "Compare", "Classify"],
                    example: "Explain why saturated fats are solid at room temperature"
                },
                apply: {
                    description: "Use information in new situations",
                    verbs: ["Calculate", "Solve", "Demonstrate", "Predict", "Use"],
                    example: "Predict what happens to enzyme activity at pH 2"
                },
                analyze: {
                    description: "Draw connections among ideas",
                    verbs: ["Analyze", "Differentiate", "Organize", "Compare", "Contrast"],
                    example: "Analyze how protein structure relates to function"
                },
                evaluate: {
                    description: "Justify a decision or course of action",
                    verbs: ["Evaluate", "Critique", "Judge", "Defend", "Assess"],
                    example: "Evaluate the evidence for the induced fit model vs lock and key"
                },
                create: {
                    description: "Produce new or original work",
                    verbs: ["Design", "Construct", "Create", "Develop", "Formulate"],
                    example: "Design an experiment to test enzyme specificity"
                }
            },
            
            understanding Levels: {
                novice: {
                    characteristics: ["Memorizes facts", "Sees concepts in isolation", "Struggles with application"],
                    support: ["Provide analogies", "Use concrete examples", "Break down complex ideas"]
                },
                developing: {
                    characteristics: ["Connects related concepts", "Can apply to familiar situations", "Begins seeing patterns"],
                    support: ["Challenge with new contexts", "Encourage explanation", "Introduce exceptions"]
                },
                proficient: {
                    characteristics: ["Flexible thinking", "Applies to novel situations", "Explains reasoning"],
                    support: ["Present complex problems", "Encourage analysis", "Develop research skills"]
                },
                expert: {
                    characteristics: ["Synthesizes across domains", "Creates new connections", "Teaches others effectively"],
                    support: ["Original research", "Mentoring others", "Advanced applications"]
                }
            }
        };

        this.assessmentQuestions = {
            carbohydrates: {
                remember: "List the three main types of carbohydrates",
                understand: "Explain why cellulose is indigestible by humans but starch is digestible",
                apply: "Predict which sugar will give a positive Benedict's test: glucose or sucrose",
                analyze: "Compare and contrast the structures of amylose and cellulose",
                evaluate: "Evaluate the claim that 'all carbohydrates are bad for health'",
                create: "Design an experiment to distinguish between reducing and non-reducing sugars"
            },
            // Similar for other topics...
        };
    }

    // ========================================
    // HANDLER METHODS FOR EACH TOPIC
    // ========================================

    handleCarbohydrates(problem) {
        const content = {
            topic: "Carbohydrates",
            category: 'macromolecules',
            summary: "Carbohydrates are organic compounds composed of carbon, hydrogen, and oxygen, typically in a ratio of 1:2:1 (empirical formula (CH₂O)ₙ). They serve as primary energy sources and structural components in living organisms.",
            
            classification: {
                bySize: {
                    monosaccharides: {
                        definition: "Simple sugars that cannot be hydrolyzed into smaller carbohydrates",
                        generalFormula: "(CH₂O)ₙ where n = 3-7",
                        examples: ["Glucose (C₆H₁₂O₆)", "Fructose (C₆H₁₂O₆)", "Galactose (C₆H₁₂O₆)", "Ribose (C₅H₁₀O₅)"],
                        properties: ["Sweet taste", "Soluble in water", "Crystalline", "Reducing sugars"],
                        functions: ["Immediate energy source", "Building blocks for larger carbohydrates"]
                    },
                    disaccharides: {
                        definition: "Two monosaccharides joined by glycosidic bond",
                        formation: "Dehydration synthesis (remove H₂O)",
                        breakdown: "Hydrolysis (add H₂O)",
                        examples: [
                            {name: "Sucrose", composition: "Glucose + Fructose", bond: "α-1,2", reducing: "No", source: "Table sugar, plants"},
                            {name: "Maltose", composition: "Glucose + Glucose", bond: "α-1,4", reducing: "Yes", source: "Malt, germinating grains"},
                            {name: "Lactose", composition: "Glucose + Galactose", bond: "β-1,4", reducing: "Yes", source: "Milk"}
                        ]
                    },
                    polysaccharides: {
                        definition: "Many monosaccharides (hundreds to thousands) joined by glycosidic bonds",
                        properties: ["Not sweet", "Often insoluble", "Form large molecules"],
                        storage: {
                            starch: {
                                components: "Amylose (20-30%) + Amylopectin (70-80%)",
                                amylose: "Linear chain, α-1,4 bonds, helical structure",
                                amylopectin: "Branched, α-1,4 and α-1,6 bonds",
                                function: "Energy storage in plants",
                                sources: "Potatoes, rice, wheat, corn",
                                digestion: "Broken down by amylase → maltose → glucose"
                            },
                            glycogen: {
                                structure: "Highly branched, more than amylopectin",
                                bonds: "α-1,4 (main chain) and α-1,6 (branches)",
                                function: "Energy storage in animals",
                                location: "Liver (regulate blood glucose), muscle (energy for contraction)",
                                advantage: "Branches allow rapid glucose release"
                            }
                        },
                        structural: {
                            cellulose: {
                                structure: "Linear chains, β-1,4 glycosidic bonds",
                                bonds: "β configuration causes straight, rigid chains",
                                function: "Structural support in plant cell walls",
                                properties: ["Indigestible by humans (lack cellulase)", "Dietary fiber", "Most abundant organic polymer on Earth"],
                                uses: "Paper, cotton, wood"
                            },
                            chitin: {
                                structure: "Similar to cellulose but with N-acetylglucosamine units",
                                function: "Structural component of arthropod exoskeletons, fungal cell walls",
                                properties: "Strong, flexible, indigestible"
                            }
                        }
                    }
                },
                
                byFunction: {
                    energy: {
                        immediate: "Glucose, fructose - quickly absorbed",
                        shortTerm: "Glycogen in animals - hours to day",
                        stored: "Starch in plants - long-term storage"
                    },
                    structural: {
                        plants: "Cellulose (cell walls)",
                        animals: "Chitin (arthropod exoskeletons)",
                        extracellular: "Glycoproteins, proteoglycans (connective tissue)"
                    },
                    recognition: {
                        bloodTypes: "ABO antigens are carbohydrate structures",
                        cellSurface: "Glycoproteins and glycolipids for cell-cell recognition",
                        immune: "Immune cells recognize pathogen carbohydrates"
                    }
                }
            },
            
            structure: {
                linearVsCyclic: {
                    linear: "Open-chain form with aldehyde or ketone group",
                    cyclic: "Ring form (hemiacetal/hemiketal formation)",
                    equilibrium: "In solution, equilibrium favors cyclic (>99%)",
                    pyranose: "6-membered ring (most hexoses)",
                    furanose: "5-membered ring (some pentoses, fructose)"
                },
                stereochemistry: {
                    anomers: {
                        definition: "Isomers differing in configuration at anomeric carbon (C1)",
                        alpha: "OH on anomeric carbon is down (Haworth projection)",
                        beta: "OH on anomeric carbon is up",
                        mutarotation: "Interconversion between α and β forms in solution"
                    },
                    DandL: {
                        determination: "Configuration at chiral center farthest from carbonyl",
                        Dsugars: "OH on right in Fischer projection (most biological sugars)",
                        Lsugars: "OH on left (rare in nature)"
                    }
                },
                glycosidicBond: {
                    formation: "Dehydration synthesis between two hydroxyl groups",
                    types: {
                        alpha14: "Starch, glycogen - digestible by amylase",
                        beta14: "Cellulose - not digestible by humans",
                        alpha16: "Branch points in glycogen, amylopectin",
                        alpha12: "Sucrose (fructose in β-2 configuration)"
                    }
                }
            },
            
            chemicalTests: {
                benedicts: {
                    detects: "Reducing sugars (free aldehyde or ketone)",
                    positive: "Glucose, fructose, maltose, lactose",
                    negative: "Sucrose (no free anomeric carbon)",
                    color: "Blue → green/yellow/orange/red (depending on concentration)"
                },
                iodine: {
                    detects: "Starch",
                    positive: "Blue-black color",
                    mechanism: "Iodine forms complex with helical amylose"
                },
                seliwanoff: {
                    detects: "Ketoses (e.g., fructose)",
                    positive: "Red color develops quickly with ketoses, slowly with aldoses"
                }
            },
            
            metabolism: {
                digestion: [
                    "Mouth: Salivary amylase begins starch digestion",
                    "Stomach: Amylase inactivated by low pH",
                    "Small intestine: Pancreatic amylase continues → maltose",
                    "Brush border enzymes: Maltase, sucrase, lactase → monosaccharides",
                    "Absorption: Glucose and other monosaccharides absorbed into blood"
                ],
                bloodGlucose: {
                    normal: "70-100 mg/dL (fasting)",
                    regulation: "Insulin lowers, glucagon raises",
                    diabetes: "Insufficient insulin or insulin resistance → high blood glucose"
                }
            },
            
            comparison: {
                starchVsCellulose: {
                    similarity: "Both glucose polymers",
                    difference: "α-1,4 bonds (starch) vs β-1,4 bonds (cellulose)",
                    consequence: "Digestible vs indigestible by humans",
                    structure: "Helical vs linear and rigid"
                },
                glycogenVsStarch: {
                    similarity: "Both α-glucose polymers for energy storage",
                    difference: "Glycogen more highly branched",
                    location: "Animals vs plants",
                    mobilization: "Glycogen mobilizes faster (more branch points)"
                }
            },
            
            examples: [
                {
                    name: "Glucose",
                    type: "Monosaccharide (aldohexose)",
                    formula: "C₆H₁₂O₆",
                    role: "Primary energy source for cells, blood sugar",
                    note: "Can exist as α or β anomer"
                },
                {
                    name: "Sucrose",
                    type: "Disaccharide",
                    composition: "Glucose + Fructose",
                    role: "Table sugar, plant transport form",
                    note: "Non-reducing sugar"
                },
                {
                    name: "Starch",
                    type: "Polysaccharide",
                    function: "Energy storage in plants",
                    note: "Composed of amylose and amylopectin"
                },
                {
                    name: "Cellulose",
                    type: "Polysaccharide",
                    function: "Structural support in plants",
                    note: "Most abundant organic molecule on Earth"
                }
            ],
            
            applications: [
                "Nutrition and dietary recommendations",
                "Diabetes management and blood glucose monitoring",
                "Food industry (sweeteners, thickeners, fibers)",
                "Biofuel production (ethanol from starch/cellulose)",
                "Paper and textile industries (cellulose)",
                "Understanding digestive disorders (lactose intolerance, celiac disease)"
            ]
        };
        
        return content;
    }

    handleLipids(problem) {
        const content = {
            topic: "Lipids and Biomembranes",
            category: 'macromolecules',
            summary: "Lipids are a diverse group of hydrophobic or amphipathic molecules essential for energy storage, membrane structure, signaling, and insulation. Unlike other macromolecules, lipids are defined by their solubility (hydrophobic) rather than structure.",
            
            classification: {
                simpleLipids: {
                    fats: {
                        structure: "Glycerol + 3 fatty acids (triglycerides/triacylglycerols)",
                        formation: "Esterification (dehydration synthesis)",
                        function: "Long-term energy storage (9 kcal/g vs 4 for carbs/protein)",
                        location: "Adipose tissue in animals, seeds in plants",
                        properties: {
                            solid: "Fats (saturated fatty acids) - animal fats, butter",
                            liquid: "Oils (unsaturated fatty acids) - plant oils, fish oil"
                        }
                    },
                    waxes: {
                        structure: "Long-chain fatty acid + long-chain alcohol",
                        properties: "Very hydrophobic, high melting point",
                        function: "Protective coating, waterproofing",
                        examples: "Beeswax, plant cuticle, ear wax"
                    }
                },
                
                complexLipids: {
                    phospholipids: {
                        structure: "Glycerol + 2 fatty acids + phosphate group (+ additional group)",
                        amphipathic: {
                            hydrophilic: "Phosphate head (polar)",
                            hydrophobic: "Fatty acid tails (nonpolar)"
                        },
                        types: [
                            {name: "Phosphatidylcholine (lecithin)", head: "Choline", role: "Major membrane component"},
                            {name: "Phosphatidylethanolamine", head: "Ethanolamine", role: "Inner membrane leaflet"},
                            {name: "Phosphatidylserine", head: "Serine", role: "Cell signaling (apoptosis marker)"},
                            {name: "Phosphatidylinositol", head: "Inositol", role: "Signaling (PI3K pathway)"}
                        ],
                        function: "Form bilayer membranes, emulsifiers",
                        bilayer: {
                            structure: "Two layers with hydrophobic tails facing inward, hydrophilic heads facing water",
                            spontaneous: "Self-assembles in aqueous environment",
                            selective: "Controls what enters/exits cell"
                        }
                    },
                    glycolipids: {
                        structure: "Lipid + carbohydrate chain",
                        types: "Cerebrosides (simple), gangliosides (complex with sialic acid)",
                        location: "Outer membrane leaflet, especially in nervous system",
                        function: "Cell recognition, immune response, blood type antigens"
                    },
                    lipoproteins: {
                        structure: "Lipid core + protein shell",
                        function: "Transport lipids in blood (lipids insoluble in water)",
                        types: [
                            {name: "Chylomicrons", density: "Lowest", function: "Transport dietary lipids from intestine"},
                            {name: "VLDL", density: "Very low", function: "Transport triglycerides from liver"},
                            {name: "LDL", density: "Low", function: "Deliver cholesterol to tissues ('bad' cholesterol)"},
                            {name: "HDL", density: "High", function: "Remove excess cholesterol ('good' cholesterol)"}
                        ]
                    }
                },
                
                derivedLipids: {
                    steroids: {
                        structure: "Four fused carbon rings (steroid nucleus)",
                        cholesterol: {
                            roles: ["Membrane component (modulates fluidity)", "Precursor to steroid hormones", "Precursor to vitamin D", "Precursor to bile salts"],
                            location: "All animal cell membranes",
                            note: "Plants have similar sterols (e.g., sitosterol)"
                        },
                        steroidHormones: [
                            {name: "Cortisol", type: "Glucocorticoid", function: "Stress response, metabolism"},
                            {name: "Aldosterone", type: "Mineralocorticoid", function: "Salt/water balance"},
                            {name: "Testosterone", type: "Androgen", function: "Male sex hormone"},
                            {name: "Estrogen", type: "Estrogen", function: "Female sex hormone"},
                            {name: "Progesterone", type: "Progestin", function: "Pregnancy maintenance"}
                        ]
                    },
                    fatSolubleVitamins: {
                        A: "Vision, immune function",
                        D: "Calcium absorption, bone health",
                        E: "Antioxidant",
                        K: "Blood clotting"
                    },
                    eicosanoids: {
                        derivedFrom: "Arachidonic acid (20-carbon fatty acid)",
                        types: [
                            {name: "Prostaglandins", function: "Inflammation, pain, fever, blood clotting"},
                            {name: "Thromboxanes", function: "Platelet aggregation"},
                            {name: "Leukotrienes", function: "Immune response, inflammation"}
                        ],
                        note: "Local hormones (paracrine signaling)"
                    }
                }
            },
            
            fattyAcids: {
                structure: {
                    general: "Long hydrocarbon chain (usually 12-20 carbons) + carboxyl group (-COOH)",
                    saturated: {
                        definition: "No double bonds between carbons (C-C)",
                        structure: "Straight chains, pack tightly",
                        state: "Solid at room temperature",
                        examples: "Palmitic acid (C16:0), Stearic acid (C18:0)",
                        sources: "Animal fats, butter, coconut oil, palm oil",
                        meltingPoint: "High (tight packing)"
                    },
                    unsaturated: {
                        definition: "One or more C=C double bonds",
                        monounsaturated: {
                            bonds: "One double bond",
                            example: "Oleic acid (C18:1, omega-9)",
                            source: "Olive oil, avocado"
                        },
                        polyunsaturated: {
                            bonds: "Multiple double bonds",
                            examples: "Linoleic acid (C18:2, omega-6), Linolenic acid (C18:3, omega-3)",
                            sources: "Vegetable oils, fish oil, nuts, seeds"
                        },
                        cisVsTrans: {
                            cis: "Hydrogens on same side of double bond (natural, kink in chain)",
                            trans: "Hydrogens on opposite sides (artificial, straight chain)",
                            trans: {
                                formation: "Partial hydrogenation of oils",
                                health: "Increases LDL, decreases HDL - harmful",
                                regulation: "Banned or restricted in many countries"
                            }
                        },
                        structure: "Kinks prevent tight packing",
                        state: "Liquid at room temperature (oils)",
                        meltingPoint: "Lower (loose packing)"
                    }
                },
                essentialFattyAcids: {
                    definition: "Cannot be synthesized by body, must be obtained from diet",
                    omega3: {
                        examples: "ALA, EPA, DHA",
                        sources: "Fish, flaxseed, walnuts",
                        benefits: "Anti-inflammatory, heart health, brain development"
                    },
                    omega6: {
                        examples: "Linoleic acid",
                        sources: "Vegetable oils, nuts",
                        note: "Need balance with omega-3"
                    }
                },
                nomenclature: {
                    systematic: "Number of carbons : number of double bonds",
                    example: "C18:2 = 18 carbons, 2 double bonds",
                    omega: "Position of first double bond from methyl end",
                    example: "Omega-3 = first double bond at 3rd carbon from methyl end"
                }
            },
            
            membrane Structure: {
                fluidMosaicModel: {
                    proposed: "Singer and Nicolson (1972)",
                    description: "Membrane is a fluid bilayer of phospholipids with embedded proteins (mosaic)",
                    fluid: "Lipids and proteins can move laterally (but rarely flip)",
                    mosaic: "Variety of proteins embedded or attached"
                },
                components: {
                    phospholipids: {
                        role: "Form bilayer matrix",
                        movement: "Lateral diffusion (rapid), flip-flop (rare)",
                        asymmetry: "Different lipid composition in inner vs outer leaflet"
                    },
                    cholesterol: {
                        amount: "20-25% of membrane lipids (animal cells)",
                        role: "Modulates fluidity (restricts at high temp, prevents solidification at low temp)",
                        positioning: "Hydroxyl group near heads, steroid rings among tails"
                    },
                    proteins: {
                        integral: {
                            definition: "Embedded in membrane, often transmembrane",
                            structure: "Hydrophobic regions in membrane, hydrophilic outside",
                            types: "Channels, carriers, receptors",
                            removal: "Requires detergents"
                        },
                        peripheral: {
                            definition: "Attached to surface (not embedded)",
                            attachment: "Hydrogen bonds, electrostatic to integral proteins or lipid heads",
                            removal: "Mild treatments (salt solutions)",
                            examples: "Cytoskeleton attachments, some enzymes"
                        }
                    },
                    carbohydrates: {
                        location: "Attached to proteins (glycoproteins) or lipids (glycolipids) on extracellular surface",
                        role: "Cell recognition, immune response, cell adhesion",
                        glycocalyx: "Carbohydrate-rich layer on cell surface"
                    }
                },
                fluidity: {
                    factors: [
                        "Temperature (higher → more fluid)",
                        "Unsaturated fatty acids (more → more fluid, kinks prevent packing)",
                        "Chain length (shorter → more fluid)",
                        "Cholesterol (buffers fluidity changes)"
                    ],
                    importance: "Affects membrane function (transport, signaling, fusion)"
                }
            },
            
            lipidFunctions: {
                energy: {
                    storage: "Fats store >2× energy per gram vs carbohydrates",
                    efficiency: "Highly reduced (many C-H bonds), anhydrous",
                    mobilization: "Lipolysis breaks down triglycerides → glycerol + fatty acids"
                },
                structural: {
                    membranes: "Phospholipids form bilayer, cholesterol modulates properties",
                    insulation: "Subcutaneous fat layer insulates",
                    protection: "Cushions organs"
                },
                signaling: {
                    hormones: "Steroid hormones (lipophilic, cross membrane)",
                    secondMessengers: "DAG, IP₃, ceramide",
                    eicosanoids: "Local signaling (inflammation, pain)"
                },
                absorption: {
                    vitamins: "Dietary lipids needed to absorb fat-soluble vitamins (A, D, E, K)"
                }
            },
            
            comparison: {
                fatsVsOils: {
                    fats: "Solid at room temp, mostly saturated, animal sources",
                    oils: "Liquid at room temp, mostly unsaturated, plant/fish sources",
                    chemicalBasis: "Saturation affects packing and melting point"
                },
                phospholipidsVsTriglycerides: {
                    structure: "Phospholipids have phosphate group (amphipathic), triglycerides have 3 fatty acids (hydrophobic)",
                    function: "Membranes vs energy storage",
                    solubility: "Phospholipids form bilayers in water, triglycerides form droplets"
                }
            },
            
            examples: [
                {
                    name: "Palmitic acid",
                    type: "Saturated fatty acid",
                    formula: "C16:0",
                    sources: "Palm oil, meat, dairy"
                },
                {
                    name: "Oleic acid",
                    type: "Monounsaturated fatty acid",
                    formula: "C18:1 (omega-9)",
                    sources: "Olive oil, avocado"
                },
                {
                    name: "Phosphatidylcholine",
                    type: "Phospholipid",
                    role: "Major membrane component, emulsifier (lecithin)"
                },
                {
                    name: "Cholesterol",
                    type: "Steroid",
                    roles: "Membrane fluidity, hormone precursor, bile synthesis"
                },
                {
                    name: "Triglyceride",
                    type: "Simple lipid",
                    function: "Energy storage"
                }
            ],
            
            applications: [
                "Understanding cardiovascular disease and atherosclerosis",
                "Dietary recommendations (saturated vs unsaturated fats)",
                "Drug delivery systems (liposomes)",
                "Soap and detergent production (saponification)",
                "Understanding metabolic disorders (obesity, hyperlipidemia)",
                "Development of anti-inflammatory drugs (COX inhibitors like aspirin)"
            ]
        };
        
        return content;
    }


handleProteins(problem) {
        const content = {
            topic: "Proteins and Proteomics",
            category: 'macromolecules',
            summary: "Proteins are polymers of amino acids that perform virtually every function in living cells. Their diverse structures enable catalysis, transport, signaling, immune defense, and structural support.",
            
            aminoAcids: {
                structure: {
                    general: "Central carbon (α-carbon) bonded to: amino group (-NH₂), carboxyl group (-COOH), hydrogen, and R-group (side chain)",
                    zwitterion: "At physiological pH (~7), exists as NH₃⁺ and COO⁻ (both charged)",
                    chiral: "All except glycine have asymmetric α-carbon (L-form in proteins)"
                },
                
                classification: {
                    byPolarity: {
                        nonpolar: {
                            aminoAcids: ["Glycine (Gly, G)", "Alanine (Ala, A)", "Valine (Val, V)", "Leucine (Leu, L)", "Isoleucine (Ile, I)", "Methionine (Met, M)", "Phenylalanine (Phe, F)", "Tryptophan (Trp, W)", "Proline (Pro, P)"],
                            Rgroups: "Hydrophobic, hydrocarbon chains or rings",
                            location: "Interior of proteins (hydrophobic core)",
                            properties: "Insoluble in water, stabilize protein structure"
                        },
                        polar: {
                            uncharged: {
                                aminoAcids: ["Serine (Ser, S)", "Threonine (Thr, T)", "Cysteine (Cys, C)", "Tyrosine (Tyr, Y)", "Asparagine (Asn, N)", "Glutamine (Gln, Q)"],
                                Rgroups: "Hydroxyl (-OH), thiol (-SH), or amide groups",
                                location: "Surface or interior (H-bonding)",
                                properties: "Can H-bond, moderately soluble"
                            },
                            charged: {
                                acidic: {
                                    aminoAcids: ["Aspartic acid (Asp, D)", "Glutamic acid (Glu, E)"],
                                    Rgroups: "Carboxyl groups (COO⁻ at pH 7)",
                                    charge: "Negative (anionic)",
                                    location: "Surface (interact with water, cations)"
                                },
                                basic: {
                                    aminoAcids: ["Lysine (Lys, K)", "Arginine (Arg, R)", "Histidine (His, H)"],
                                    Rgroups: "Amino groups (NH₃⁺ at pH 7, except His)",
                                    charge: "Positive (cationic)",
                                    location: "Surface (interact with water, anions)",
                                    note: "Histidine pKa ~6, often in active sites"
                                }
                            }
                        }
                    },
                    
                    special: {
                        glycine: {
                            property: "Smallest (R = H), no chiral center",
                            consequence: "Highly flexible, allows tight turns",
                            location: "Loops, flexible regions"
                        },
                        proline: {
                            property: "Cyclic structure (R-group bonds back to N)",
                            consequence: "Rigid, creates kinks in polypeptide",
                            effect: "Breaks α-helices, introduces bends"
                        },
                        cysteine: {
                            property: "Contains thiol group (-SH)",
                            consequence: "Forms disulfide bonds (S-S) with other cysteines",
                            role: "Stabilizes tertiary/quaternary structure, especially in extracellular proteins"
                        },
                        aromatic: {
                            aminoAcids: ["Phenylalanine", "Tyrosine", "Tryptophan"],
                            property: "Contain benzene/indole rings",
                            absorbance: "Absorb UV light at 280 nm (used to measure protein concentration)",
                            interactions: "π-π stacking, hydrophobic interactions"
                        }
                    }
                },
                
                essentialAminoAcids: {
                    definition: "Cannot be synthesized by humans, must be obtained from diet",
                    list: ["Histidine", "Isoleucine", "Leucine", "Lysine", "Methionine", "Phenylalanine", "Threonine", "Tryptophan", "Valine"],
                    mnemonic: "PVT TIM HaLL (Private Tim Hall)",
                    conditionallyEssential: "Arginine, cysteine (needed during growth or illness)"
                }
            },
            
            peptideBond: {
                formation: {
                    reaction: "Dehydration synthesis between carboxyl of one amino acid and amino of next",
                    equation: "R₁-COOH + H₂N-R₂ → R₁-CO-NH-R₂ + H₂O",
                    location: "Ribosomes (translation)",
                    bond: "Covalent bond between C and N (amide bond)"
                },
                properties: {
                    planar: "C-N bond has partial double-bond character (resonance)",
                    rigid: "No rotation around C-N bond",
                    trans: "Usually trans configuration (O and H on opposite sides)",
                    consequence: "Restricts conformations, creates regular structures"
                },
                breakage: {
                    hydrolysis: "Add water to break bond (reverse of formation)",
                    enzymes: "Proteases, peptidases",
                    conditions: "Strong acid or base, high temperature"
                }
            },
            
            proteinStructure: {
                primary: {
                    definition: "Linear sequence of amino acids (order)",
                    bonds: "Peptide bonds (covalent)",
                    notation: "N-terminus (free NH₂) → C-terminus (free COOH)",
                    example: "Gly-Ala-Ser-Thr-Cys-Val...",
                    determination: "DNA sequencing → infer amino acid sequence; Edman degradation; Mass spectrometry",
                    significance: "Determines all higher levels of structure (sequence → structure → function)",
                    mutations: "Change in sequence can alter function (e.g., sickle cell: Glu → Val at position 6)"
                },
                
                secondary: {
                    definition: "Local folding of polypeptide backbone into regular structures",
                    bonds: "Hydrogen bonds between backbone C=O and N-H (NOT R-groups)",
                    structures: {
                        alphaHelix: {
                            description: "Right-handed spiral/coil",
                            structure: "3.6 amino acids per turn, pitch 0.54 nm",
                            Hbonds: "C=O of residue n bonds to N-H of residue n+4",
                            Rgroups: "Project outward from helix",
                            stability: "Maximizes H-bonds, compact",
                            examples: "Keratin (hair, nails), myoglobin",
                            favored: "Alanine, leucine, methionine",
                            disfavored: "Proline (breaks helix), glycine (too flexible), charged residues in close proximity"
                        },
                        betaSheet: {
                            description: "Extended, pleated structure with adjacent strands",
                            types: {
                                parallel: "Strands run in same direction (N→C)",
                                antiparallel: "Strands run in opposite directions (more stable, better H-bonds)"
                            },
                            Hbonds: "Between C=O and N-H of adjacent strands",
                            Rgroups: "Alternate above/below plane of sheet",
                            examples: "Silk fibroin (mostly antiparallel)",
                            stability: "Extensive H-bonding network"
                        },
                        turns: {
                            description: "Reverse direction of polypeptide chain (connect α-helices and β-sheets)",
                            types: "β-turns, loops",
                            residues: "Often glycine and proline (proline's rigidity creates turn)",
                            location: "Surface of protein"
                        },
                        randomCoil: {
                            description: "Irregular, non-repeating structure",
                            note: "Not truly random - determined by sequence"
                        }
                    },
                    prediction: "Chou-Fasman, GOR algorithms; modern AI (AlphaFold)"
                },
                
                tertiary: {
                    definition: "Overall 3D shape of entire polypeptide chain",
                    bonds: {
                        disulfideBonds: {
                            between: "Cysteine residues (S-S)",
                            strength: "Strong covalent bond",
                            location: "Often in extracellular proteins (stabilizes against harsh conditions)",
                            formation: "Oxidation of two -SH groups",
                            breakage: "Reduction (add reducing agents like β-mercaptoethanol)"
                        },
                        hydrogenBonds: {
                            between: "Polar R-groups or R-group to backbone",
                            strength: "Moderate (individually weak, collectively strong)",
                            examples: "Ser-Ser, Thr-Asn"
                        },
                        ionicBonds: {
                            between: "Oppositely charged R-groups (salt bridges)",
                            example: "Lys⁺ and Asp⁻",
                            strength: "Moderate, pH-dependent",
                            location: "Often on surface or stabilizing structures"
                        },
                        hydrophobicInteractions: {
                            between: "Nonpolar R-groups",
                            driving: "Entropy increase (water molecules released)",
                            location: "Interior of protein (hydrophobic core)",
                            significance: "Major force in protein folding"
                        },
                        vanDerWaals: {
                            description: "Weak attractions between atoms in close proximity",
                            significance: "Cumulative effect stabilizes structure"
                        }
                    },
                    domains: {
                        definition: "Distinct structural/functional units within protein",
                        examples: "DNA-binding domain, catalytic domain",
                        modularity: "Domains can be shuffled evolutionarily (exon shuffling)"
                    },
                    motifs: {
                        definition: "Common structural patterns (supersecondary structures)",
                        examples: "Helix-turn-helix (DNA binding), zinc finger, leucine zipper, EF hand (calcium binding)"
                    }
                },
                
                quaternary: {
                    definition: "Assembly of multiple polypeptide subunits (only for proteins with >1 chain)",
                    bonds: "Same as tertiary (H-bonds, ionic, hydrophobic, sometimes disulfide)",
                    examples: [
                        {name: "Hemoglobin", subunits: "2α + 2β chains (tetramer)", function: "Oxygen transport"},
                        {name: "Collagen", subunits: "3 polypeptide helices (triple helix)", function: "Structural protein"},
                        {name: "Antibody (IgG)", subunits: "2 heavy + 2 light chains", bonds: "Disulfide bonds between chains"}
                    ],
                    cooperativity: "Subunits influence each other (e.g., hemoglobin oxygen binding)",
                    allosteric: "Binding at one subunit affects others"
                }
            },
            
            proteinFolding: {
                process: {
                    primary: "Ribosome synthesizes linear polypeptide",
                    folding: "Polypeptide folds into 3D structure (spontaneous for many proteins)",
                    anfinsen: "Anfin sen's dogma: sequence determines structure",
                    chaperones: "Assist folding, prevent aggregation (e.g., Hsp70, GroEL/GroES)",
                    energy: "Funnel model - many paths lead to native state (lowest free energy)"
                },
                denaturation: {
                    definition: "Loss of native structure (unfolds but peptide bonds intact)",
                    causes: [
                        "Heat (disrupts H-bonds, hydrophobic interactions)",
                        "pH extremes (alters charge, disrupts ionic bonds)",
                        "Organic solvents (disrupt hydrophobic interactions)",
                        "Detergents (solubilize hydrophobic regions)",
                        "Reducing agents (break disulfide bonds)",
                        "Urea, guanidinium chloride (chaotropic agents)"
                    ],
                    consequence: "Loss of function",
                    reversibility: "Sometimes reversible (renaturation) if conditions restored",
                    example: "Cooking egg white (ovalbumin denatures irreversibly)"
                },
                misfoldingDiseases: {
                    prions: "Misfolded PrP protein causes others to misfold (Creutzfeldt-Jakob, Mad Cow)",
                    alzheimers: "Amyloid-β plaques, tau tangles",
                    parkinsons: "α-synuclein aggregates (Lewy bodies)",
                    cysticFibrosis: "CFTR protein misfolds, degraded"
                }
            },
            
            proteinFunctions: {
                catalytic: {
                    type: "Enzymes",
                    function: "Speed up chemical reactions by lowering activation energy",
                    specificity: "Each enzyme catalyzes specific reaction(s)",
                    examples: "Amylase (starch digestion), DNA polymerase (DNA synthesis), catalase (H₂O₂ breakdown)",
                    mechanism: "Active site binds substrate, stabilizes transition state"
                },
                structural: {
                    type: "Fibrous proteins",
                    function: "Provide support and shape",
                    examples: [
                        {name: "Collagen", location: "Connective tissue, bone, skin", structure: "Triple helix"},
                        {name: "Keratin", location: "Hair, nails, skin", structure: "α-helix coiled-coil"},
                        {name: "Elastin", location: "Ligaments, arteries", property: "Stretchy"},
                        {name: "Actin/Myosin", location: "Muscle", function: "Contraction"}
                    ]
                },
                transport: {
                    function: "Carry molecules/ions across membranes or in blood",
                    examples: [
                        {name: "Hemoglobin", carries: "O₂ and CO₂", location: "Red blood cells"},
                        {name: "Myoglobin", carries: "O₂", location: "Muscle"},
                        {name: "Albumin", carries: "Fatty acids, hormones", location: "Blood plasma"},
                        {name: "Transferrin", carries: "Iron", location: "Blood"},
                        {name: "Channel proteins", function: "Allow specific ions through membrane"}
                    ]
                },
                storage: {
                    function: "Store important substances",
                    examples: [
                        {name: "Ferritin", stores: "Iron", location: "Liver, spleen"},
                        {name: "Casein", stores: "Amino acids", location: "Milk"},
                        {name: "Ovalbumin", stores: "Amino acids", location: "Egg white"}
                    ]
                },
                signaling: {
                    hormones: {
                        examples: ["Insulin (glucose regulation)", "Growth hormone", "Glucagon"],
                        mechanism: "Bind to receptors, trigger cellular response"
                    },
                    receptors: {
                        examples: "G-protein coupled receptors, receptor tyrosine kinases",
                        function: "Receive signals, initiate signal transduction"
                    }
                },
                movement: {
                    motor: "Actin and myosin in muscle contraction",
                    cytoskeleton: "Tubulin (microtubules), actin (microfilaments) - cell shape, movement, division",
                    flagella: "Dynein and kinesin move cilia/flagella"
                },
                defense: {
                    antibodies: {
                        structure: "Y-shaped, 2 heavy + 2 light chains",
                        function: "Recognize and neutralize antigens",
                        specificity: "Each antibody binds specific antigen",
                        diversity: ">10⁸ different antibodies possible (VDJ recombination)"
                    },
                    complement: "Cascade of proteins that help destroy pathogens",
                    antimicrobialPeptides: "Defensins, lysozyme"
                },
                regulation: {
                    transcriptionFactors: "Bind DNA, regulate gene expression",
                    kinases: "Add phosphate groups to proteins (activate/inactivate)",
                    phosphatases: "Remove phosphate groups",
                    ubiquitin: "Tags proteins for degradation"
                }
            },
            
            enzymeDetails: {
                activeSite: {
                    definition: "Region where substrate binds and catalysis occurs",
                    properties: "Specific shape complementary to substrate (or transition state)",
                    residues: "Catalytic residues, binding residues",
                    microenvironment: "Can have different pH, hydrophobicity than bulk solution"
                },
                lockAndKey: {
                    model: "Rigid active site perfectly fits substrate (Fischer, 1894)",
                    limitation: "Doesn't explain conformational changes"
                },
                inducedFit: {
                    model: "Active site changes shape upon substrate binding (Koshland, 1958)",
                    advantage: "Explains specificity and catalytic enhancement",
                    mechanism: "Binding induces conformational change that brings catalytic residues into position"
                },
                cofactorsCoenzymes: {
                    cofactor: {
                        definition: "Non-protein helper molecule (metal ions)",
                        examples: "Zn²⁺ (carbonic anhydrase), Fe²⁺/Fe³⁺ (cytochromes), Mg²⁺ (kinases)",
                        role: "Stabilize charges, participate in catalysis"
                    },
                    coenzyme: {
                        definition: "Organic cofactor (often vitamin-derived)",
                        examples: [
                            {name: "NAD⁺", derived: "Niacin (B3)", role: "Electron carrier"},
                            {name: "FAD", derived: "Riboflavin (B2)", role: "Electron carrier"},
                            {name: "Coenzyme A", derived: "Pantothenic acid (B5)", role: "Acyl group carrier"},
                            {name: "Thiamine pyrophosphate", derived: "Thiamine (B1)", role: "Decarboxylation"},
                            {name: "Pyridoxal phosphate", derived: "Pyridoxine (B6)", role: "Amino acid metabolism"}
                        ]
                    },
                    prostheticGroup: "Tightly bound coenzyme (e.g., heme in hemoglobin)"
                }
            },
            
            comparison: {
                fibrousVsGlobular: {
                    fibrous: {
                        shape: "Long, thread-like",
                        structure: "Regular, repetitive (α-helix or β-sheet)",
                        solubility: "Insoluble in water",
                        function: "Structural",
                        examples: "Collagen, keratin, elastin, silk fibroin"
                    },
                    globular: {
                        shape: "Compact, spherical",
                        structure: "Irregular, folded (mix of α, β, loops)",
                        solubility: "Soluble in water",
                        function: "Catalytic, transport, regulatory",
                        examples: "Enzymes, hemoglobin, antibodies, albumin"
                    }
                },
                denaturationVsHydrolysis: {
                    denaturation: "Unfolds protein, breaks non-covalent bonds (H-bonds, etc.), peptide bonds intact",
                    hydrolysis: "Breaks peptide bonds (covalent), creates smaller peptides/amino acids",
                    reversibility: "Denaturation sometimes reversible, hydrolysis never reversible"
                }
            },
            
            proteomics: {
                definition: "Large-scale study of all proteins in cell/organism",
                techniques: {
                    gelElectrophoresis: "Separate proteins by size (SDS-PAGE) or charge and size (2D gels)",
                    massSpectrometry: "Identify proteins by mass, sequence peptides",
                    westernBlot: "Detect specific protein with antibody",
                    ELISA: "Quantify specific protein",
                    proteinMicroarray: "Screen protein interactions, binding"
                },
                applications: [
                    "Disease biomarkers",
                    "Drug targets",
                    "Understanding cellular pathways",
                    "Personalized medicine"
                ]
            },
            
            examples: [
                {
                    name: "Insulin",
                    type: "Hormone (globular)",
                    structure: "2 chains (A: 21 aa, B: 30 aa) linked by disulfide bonds",
                    function: "Regulates blood glucose (promotes glucose uptake)",
                    note: "First protein sequenced (Sanger, 1951)",
                    disease: "Diabetes (type 1: no insulin; type 2: insulin resistance)"
                },
                {
                    name: "Hemoglobin",
                    type: "Transport protein (globular)",
                    structure: "Quaternary: 2α + 2β subunits, each with heme prosthetic group",
                    function: "Carries O₂ from lungs to tissues, CO₂ back to lungs",
                    cooperativity: "Sigmoidal O₂ binding curve (positive cooperativity)",
                    disease: "Sickle cell (Glu→Val at β-6), thalassemia"
                },
                {
                    name: "Collagen",
                    type: "Structural protein (fibrous)",
                    structure: "Triple helix of 3 polypeptide chains (Gly-X-Y repeat, often Pro or Hyp)",
                    function: "Most abundant protein in mammals, provides tensile strength",
                    location: "Bone, cartilage, tendons, skin, blood vessels",
                    disease: "Scurvy (vitamin C deficiency → abnormal collagen), Ehlers-Danlos syndrome"
                },
                {
                    name: "Lysozyme",
                    type: "Enzyme (globular)",
                    function: "Breaks down bacterial cell walls (hydrolyzes peptidoglycan)",
                    location: "Tears, saliva, egg white",
                    mechanism: "Active site binds substrate, catalyzes hydrolysis",
                    note: "One of first enzymes with known 3D structure"
                }
            ],
            
            applications: [
                "Drug design and development (targeting enzymes, receptors)",
                "Understanding genetic diseases (mutations in protein sequence)",
                "Biotechnology (recombinant proteins: insulin, growth hormone, antibodies)",
                "Nutrition (dietary protein quality, essential amino acids)",
                "Forensics (protein markers)",
                "Protein engineering (designing new functions)",
                "Understanding neurodegenerative diseases (protein misfolding)"
            ]
        };
        
        return content;
    }

    handleNucleicAcids(problem) {
        const content = {
            topic: "Nucleic Acids: DNA and RNA",
            category: 'macromolecules',
            summary: "Nucleic acids are polymers of nucleotides that store and transmit genetic information. DNA stores hereditary information, while RNA translates that information into proteins and has additional catalytic and regulatory roles.",
            
            nucleotideStructure: {
                components: {
                    pentoseSugar: {
                        DNA: {
                            sugar: "2-deoxyribose",
                            structure: "5-carbon sugar lacking hydroxyl group at 2' position",
                            significance: "More stable than ribose (less reactive)"
                        },
                        RNA: {
                            sugar: "Ribose",
                            structure: "5-carbon sugar with hydroxyl (-OH) at 2' position",
                            significance: "2'-OH makes RNA more reactive and less stable"
                        }
                    },
                    nitrogenousBase: {
                        purines: {
                            structure: "Double-ring structure (9 atoms)",
                            bases: {
                                adenine: {
                                    abbreviation: "A",
                                    foundIn: "Both DNA and RNA",
                                    pairs: "Thymine (DNA) or Uracil (RNA) - 2 H-bonds"
                                },
                                guanine: {
                                    abbreviation: "G",
                                    foundIn: "Both DNA and RNA",
                                    pairs: "Cytosine - 3 H-bonds"
                                }
                            },
                            mnemonic: "PURe As Gold (purines: A, G)"
                        },
                        pyrimidines: {
                            structure: "Single-ring structure (6 atoms)",
                            bases: {
                                cytosine: {
                                    abbreviation: "C",
                                    foundIn: "Both DNA and RNA",
                                    pairs: "Guanine - 3 H-bonds"
                                },
                                thymine: {
                                    abbreviation: "T",
                                    foundIn: "DNA only",
                                    pairs: "Adenine - 2 H-bonds",
                                    structure: "Methyl group at C5"
                                },
                                uracil: {
                                    abbreviation: "U",
                                    foundIn: "RNA only",
                                    pairs: "Adenine - 2 H-bonds",
                                    structure: "Like thymine but lacks methyl group"
                                }
                            },
                            mnemonic: "PYrimidines: CUT (C, U, T)"
                        }
                    },
                    phosphateGroup: {
                        structure: "PO₄³⁻ group",
                        attachment: "Attached to 5' carbon of sugar",
                        function: "Links nucleotides via phosphodiester bonds",
                        charge: "Negative (makes DNA/RNA negatively charged)"
                    }
                },
                nomenclature: {
                    nucleoside: "Sugar + base (no phosphate)",
                    nucleotide: "Sugar + base + phosphate",
                    examples: {
                        adenosine: "Nucleoside (adenine + ribose)",
                        AMP: "Adenosine monophosphate (nucleotide)",
                        ATP: "Adenosine triphosphate (3 phosphate groups)"
                    }
                }
            },
            
            DNAStructure: {
                doubleHelix: {
                    discoverers: "James Watson and Francis Crick (1953)",
                    based: "X-ray crystallography data from Rosalind Franklin and Maurice Wilkins",
                    nobelPrize: "1962 (Watson, Crick, Wilkins)",
                    features: {
                        strands: "Two antiparallel polynucleotide strands",
                        orientation: "One strand 5'→3', other 3'→5'",
                        helix: "Right-handed double helix",
                        turns: "~10 base pairs per complete turn (360°)",
                        diameter: "~2 nm (20 Å)",
                        grooves: {
                            major: "Wider groove, more protein binding sites",
                            minor: "Narrower groove"
                        },
                        backbone: "Sugar-phosphate backbone on outside (hydrophilic)",
                        interior: "Nitrogenous bases stacked inside (hydrophobic)",
                        stabilization: [
                            "Hydrogen bonds between complementary bases",
                            "Base stacking (van der Waals, π-π interactions)",
                            "Hydrophobic effect (bases cluster away from water)"
                        ]
                    }
                },
                
                basePairing: {
                    chargaffRules: {
                        rule1: "Amount of A = amount of T",
                        rule2: "Amount of G = amount of C",
                        rule3: "Amount of purines = amount of pyrimidines",
                        consequence: "A+G = T+C",
                        discovered: "Erwin Chargaff (1950), before structure known"
                    },
                    complementarity: {
                        AT: {
                            bases: "Adenine pairs with Thymine",
                            bonds: "2 hydrogen bonds",
                            strength: "Weaker than G-C"
                        },
                        GC: {
                            bases: "Guanine pairs with Cytosine",
                            bonds: "3 hydrogen bonds",
                            strength: "Stronger than A-T",
                            consequence: "Higher G-C content → higher melting temperature (Tm)"
                        }
                    },
                    antiparallel: {
                        meaning: "Strands run in opposite directions",
                        notation: "5'-ATGC-3' pairs with 3'-TACG-5'",
                        importance: "DNA/RNA polymerases work 5'→3' direction only"
                    }
                },
                
                forms: {
                    BDNA: {
                        description: "Most common form in cells",
                        helix: "Right-handed",
                        diameter: "2.0 nm",
                        bpPerTurn: "10-10.5",
                        conditions: "High humidity"
                    },
                    ADNA: {
                        description: "Dehydrated form",
                        helix: "Right-handed, wider and shorter",
                        diameter: "2.3 nm",
                        bpPerTurn: "11",
                        conditions: "Low humidity",
                        note: "May occur temporarily during replication/transcription"
                    },
                    ZDNA: {
                        description: "Left-handed helix",
                        helix: "Zigzag backbone",
                        bpPerTurn: "12",
                        sequences: "Alternating purines and pyrimidines (GC-rich)",
                        function: "Possible role in gene regulation",
                        note: "Rare in cells"
                    }
                },
                
                supercoiling: {
                    definition: "Further twisting of double helix",
                    positive: "Overwound (more turns per length)",
                    negative: "Underwound (fewer turns per length)",
                    enzymes: {
                        topoisomerases: "Relieve supercoiling by cutting and religating DNA",
                        type1: "Cuts one strand",
                        type2: "Cuts both strands (DNA gyrase in bacteria)"
                    },
                    importance: "Necessary for compacting DNA, regulating access"
                },
                
                packaging: {
                    prokaryotes: {
                        chromosome: "Single circular DNA in nucleoid region",
                        packaging: "Supercoiling with nucleoid-associated proteins",
                        plasmids: "Small circular DNA molecules (extra genes)"
                    },
                    eukaryotes: {
                        levels: [
                            "DNA wraps around histone octamer → nucleosome (~146 bp)",
                            "Nucleosomes connected by linker DNA → 'beads on a string' (10 nm fiber)",
                            "Further coiling → 30 nm fiber (solenoid)",
                            "Loop domains attached to scaffold",
                            "Condensed chromatin",
                            "Chromosome (maximally condensed during mitosis)"
                        ],
                        histones: {
                            core: "H2A, H2B, H3, H4 (octamer: 2 of each)",
                            linker: "H1 (stabilizes nucleosome)",
                            modifications: "Acetylation, methylation, phosphorylation regulate gene expression"
                        }
                    }
                }
            },
            
            RNAStructure: {
                differences: {
                    sugar: "Ribose (2'-OH) instead of deoxyribose",
                    bases: "Uracil (U) instead of Thymine (T)",
                    strands: "Usually single-stranded (can have secondary structure)",
                    stability: "Less stable (2'-OH allows self-cleavage)",
                    length: "Typically shorter than DNA"
                },
                secondaryStructure: {
                    hairpin: "Stem-loop structure from intramolecular base pairing",
                    internalLoop: "Unpaired regions within double-stranded region",
                    bulge: "Unpaired nucleotides on one strand",
                    pseudoknot: "Complex folding with base pairing between loop and outside region",
                    example: "tRNA has cloverleaf secondary structure"
                },
                types: {
                    mRNA: {
                        name: "Messenger RNA",
                        function: "Carries genetic information from DNA to ribosome",
                        structure: {
                            prokaryotes: "5'-UTR, coding sequence (ORF), 3'-UTR, polycistronic (multiple genes)",
                            eukaryotes: "5' cap (7-methylguanosine), 5'-UTR, coding sequence, 3'-UTR, poly-A tail (~200 A's), monocistronic (one gene)"
                        },
                        processing: {
                            capping: "Add 5' cap (protects from degradation, helps ribosome bind)",
                            splicing: "Remove introns, join exons (spliceosome)",
                            polyadenylation: "Add poly-A tail (stability, translation, localization)"
                        },
                        codons: "Three-nucleotide sequences encoding amino acids",
                        lifetime: "Varies: minutes (short-lived) to hours (stable)"
                    },
                    rRNA: {
                        name: "Ribosomal RNA",
                        function: "Structural and catalytic component of ribosomes",
                        types: {
                            prokaryotic: "16S, 23S, 5S rRNA (in 30S and 50S subunits)",
                            eukaryotic: "18S, 28S, 5.8S, 5S rRNA (in 40S and 60S subunits)"
                        },
                        catalyticActivity: "Peptidyl transferase (forms peptide bonds) - ribozyme",
                        abundance: "~80% of total cellular RNA",
                        conservation: "Highly conserved (used for phylogenetic studies)"
                    },
                    tRNA: {
                        name: "Transfer RNA",
                        function: "Delivers amino acids to ribosome during translation",
                        structure: {
                            shape: "Cloverleaf (2D), L-shape (3D)",
                            anticodon: "3 nucleotides complementary to mRNA codon",
                            aminoAcidAttachment: "3'-CCA end (acceptor stem)",
                            arms: "D-arm, anticodon arm, T-arm, variable loop"
                        },
                        aminoacylation: "tRNA synthetase attaches correct amino acid (1 enzyme per amino acid)",
                        wobble: "Third base of codon can pair loosely (allows degeneracy of genetic code)",
                        size: "~75-95 nucleotides",
                        number: "At least 20 types (one per amino acid), often >20 (isoaccep tors)"
                    },
                    otherRNA: {
                        snRNA: {
                            name: "Small nuclear RNA",
                            function: "Splicing pre-mRNA (part of spliceosome)",
                            examples: "U1, U2, U4, U5, U6 snRNA"
                        },
                        miRNA: {
                            name: "MicroRNA",
                            function: "Gene regulation (post-transcriptional silencing)",
                            mechanism: "Binds to complementary mRNA → degradation or block translation",
                            size: "~22 nucleotides"
                        },
                        siRNA: {
                            name: "Small interfering RNA",
                            function: "Gene silencing (RNAi pathway)",
                            mechanism: "Similar to miRNA",
                            use: "Research tool, potential therapy"
                        },
                        lncRNA: {
                            name: "Long non-coding RNA",
                            function: "Gene regulation, chromatin remodeling, X-inactivation",
                            size: ">200 nucleotides",
                            example: "Xist RNA (X-chromosome inactivation)"
                        },
                        ribozymes: {
                            definition: "Catalytic RNA molecules",
                            examples: "Self-splicing introns (group I, II), RNase P, ribosome (peptidyl transferase)",
                            significance: "RNA World hypothesis (RNA may have preceded DNA and proteins)"
                        }
                    }
                }
            },
            
            centralDogma: {
                concept: "Flow of genetic information in cells",
                proposed: "Francis Crick (1958)",
                mainFlow: "DNA → RNA → Protein",
                
                replication: {
                    process: "DNA → DNA",
                    purpose: "Copy genetic information for cell division",
                    mechanism: "Semiconservative (each strand templates new strand)",
                    enzymes: {
                        helicase: "Unwinds double helix (breaks H-bonds)",
                        primase: "Synthesizes RNA primer (short RNA sequence)",
                        DNApolymerase: {
                            prokaryotes: "DNA Pol III (main), DNA Pol I (remove primers, fill gaps)",
                            eukaryotes: "DNA Pol α (primase), Pol δ (lagging), Pol ε (leading)"
                        },
                        ligase: "Joins Okazaki fragments (seals nicks)",
                        topoisomerase: "Relieves supercoiling ahead of replication fork"
                    },
                    direction: "5'→3' synthesis (adds to 3'-OH)",
                    strands: {
                        leading: "Continuous synthesis (toward replication fork)",
                        lagging: "Discontinuous synthesis (away from fork) → Okazaki fragments"
                    },
                    proofreading: "3'→5' exonuclease activity (DNA polymerase removes errors)",
                    fidelity: "~1 error per 10⁹ nucleotides"
                },
                
                transcription: {
                    process: "DNA → RNA",
                    purpose: "Create RNA copy of gene",
                    enzymes: {
                        prokaryotes: "Single RNA polymerase (with different σ factors)",
                        eukaryotes: {
                            PolI: "rRNA (except 5S)",
                            PolII: "mRNA, most snRNA, miRNA, lncRNA",
                            PolIII: "tRNA, 5S rRNA"
                        }
                    },
                    mechanism: {
                        initiation: [
                            "RNA polymerase binds to promoter (TATA box in eukaryotes, -10/-35 in prokaryotes)",
                            "DNA unwinds locally",
                            "Transcription bubble forms"
                        ],
                        elongation: [
                            "RNA polymerase reads template strand 3'→5'",
                            "Synthesizes RNA 5'→3'",
                            "RNA complementary to template (same as coding strand, except U for T)"
                        ],
                        termination: [
                            "Prokaryotes: Rho-independent (hairpin + poly-U) or Rho-dependent",
                            "Eukaryotes: Pol II continues past polyadenylation signal, cleaved"
                        ]
                    },
                    processing: {
                        prokaryotes: "mRNA used directly (no processing)",
                        eukaryotes: "5' cap, splicing (remove introns), poly-A tail"
                    }
                },
                
                translation: {
                    process: "RNA → Protein",
                    purpose: "Synthesize proteins from mRNA template",
                    location: "Ribosome (cytoplasm or ER)",
                    geneticCode: {
                        codon: "3 nucleotides → 1 amino acid",
                        start: "AUG (methionine) - translation initiation",
                        stop: "UAA, UAG, UGA (no tRNA, release factors bind)",
                        degeneracy: "Multiple codons for same amino acid (wobble)",
                        universal: "Same code in nearly all organisms (minor exceptions)",
                        codons: "64 total (61 sense + 3 stop)"
                    },
                    mechanism: {
                        initiation: [
                            "Small ribosomal subunit binds mRNA at 5' cap (eukaryotes) or Shine-Dalgarno (prokaryotes)",
                            "Scans for start codon AUG",
                            "Initiator tRNA (Met-tRNA) binds at P site",
                            "Large subunit joins → 80S ribosome (eukaryotes) or 70S (prokaryotes)"
                        ],
                        elongation: [
                            "Aminoacyl-tRNA enters A site (codon recognition)",
                            "Peptidyl transferase forms peptide bond (rRNA catalyzes)",
                            "Ribosome translocates: tRNA in P site → E site (exit), tRNA in A site → P site",
                            "Cycle repeats"
                        ],
                        termination: [
                            "Stop codon in A site",
                            "Release factors bind (RF1/RF2 in prokaryotes, eRF1 in eukaryotes)",
                            "Polypeptide released, ribosome dissociates"
                        ]
                    },
                    energyCost: "~4 ATP per peptide bond (2 for aminoacylation, 1 for tRNA delivery, 1 for translocation)"
                },
                
                reverseTranscription: {
                    process: "RNA → DNA",
                    enzyme: "Reverse transcriptase",
                    found: "Retroviruses (HIV, HTLV), transposons",
                    mechanism: "Uses RNA template to synthesize complementary DNA (cDNA)",
                    applications: "Make cDNA libraries, study gene expression, PCR from RNA (RT-PCR)"
                },
                
                exceptions: {
                    RNAreplication: "RNA viruses replicate RNA genome (RNA → RNA)",
                    proteinToProtein: "Prions (misfolded protein converts normal protein)"
                }
            },
            
            geneticCode: {
                features: {
                    triplet: "3 nucleotides = 1 codon",
                    degenerate: "Multiple codons for same amino acid (synonyms)",
                    wobble: "Third position less specific (allows degeneracy)",
                    unambiguous: "Each codon specifies only one amino acid",
                    universal: "Nearly universal across all life (few exceptions)",
                    nonoverlapping: "Codons read sequentially, no overlap",
                    commafree: "No punctuation between codons (except start/stop)"
                },
                readingFrame: {
                    definition: "Way mRNA is divided into codons",
                    start: "Determined by start codon AUG",
                    frames: "3 possible reading frames (shift by 1 or 2 nucleotides changes all codons)",
                    frameshift: "Insertion/deletion (not multiple of 3) shifts frame, changes all downstream amino acids"
                }
            },
            
            mutations: {
                types: {
                    pointMutation: {
                        silent: "Change in codon but same amino acid (due to degeneracy)",
                        missense: "Change in codon → different amino acid (may affect function)",
                        nonsense: "Change to stop codon (truncated protein, usually non-functional)"
                    },
                    insertion: "Add nucleotides (frameshift if not multiple of 3)",
                    deletion: "Remove nucleotides (frameshift if not multiple of 3)",
                    duplication: "Segment copied",
                    inversion: "Segment reversed",
                    translocation: "Segment moved to different location/chromosome"
                },
                effects: {
                    beneficial: "Rare, can provide advantage (evolution)",
                    neutral: "No effect on function",
                    harmful: "Most common, disrupt protein function (disease)"
                },
                examples: {
                    sickleCellAnemia: "Missense: Glu→Val in β-globin (GAG→GTG)",
                    cysticFibrosis: "Deletion: ΔF508 (deletion of Phe at position 508)",
                    Duchenne: "Frameshift or nonsense in dystrophin gene"
                }
            },
            
            DNAvsRNA: {
                comparison: [
                    {feature: "Sugar", DNA: "Deoxyribose", RNA: "Ribose"},
                    {feature: "Bases", DNA: "A, T, G, C", RNA: "A, U, G, C"},
                    {feature: "Structure", DNA: "Double-stranded helix", RNA: "Usually single-stranded"},
                    {feature: "Stability", DNA: "More stable", RNA: "Less stable (2'-OH reactive)"},
                    {feature: "Location", DNA: "Nucleus (eukaryotes), nucleoid (prokaryotes)", RNA: "Nucleus and cytoplasm"},
                    {feature: "Function", DNA: "Long-term storage", RNA: "Temporary messenger, catalysis, regulation"},
                    {feature: "Size", DNA: "Very long (millions-billions bp)", RNA: "Shorter (hundreds-thousands nt)"},
                    {feature: "Replication", DNA: "Self-replicates", RNA: "Transcribed from DNA"}
                ]
            },
            
            techniques: {
                PCR: {
                    name: "Polymerase Chain Reaction",
                    purpose: "Amplify specific DNA sequence",
                    components: "Template DNA, primers, Taq polymerase, dNTPs",
                    cycles: "Denaturation (94°C) → Annealing (50-65°C) → Extension (72°C)",
                    result: "Exponential amplification (2ⁿ copies after n cycles)"
                },
                sequencing: {
                    Sanger: "Dideoxy chain termination method (1977)",
                    NGS: "Next-generation sequencing (massively parallel)",
                    applications: "Genome projects, diagnostics, personalized medicine"
                },
                gelElectrophoresis: "Separate DNA/RNA by size (smaller migrates farther)",
                southernBlot: "Detect specific DNA sequences",
                northernBlot: "Detect specific RNA sequences"
            },
            
            examples: [
                {
                    name: "Human genome",
                    size: "~3.2 billion base pairs",
                    genes: "~20,000-25,000 protein-coding genes",
                    organization: "23 pairs of chromosomes",
                    note: "Only ~1.5% codes for proteins"
                },
                {
                    name: "E. coli chromosome",
                    size: "~4.6 million base pairs",
                    genes: "~4,300 genes",
                    structure: "Single circular chromosome"
                },
                {
                    name: "HIV genome",
                    type: "RNA retrovirus",
                    size: "~9,700 nucleotides",
                    note: "Reverse transcribes RNA → DNA in host cell"
                }
            ],
            
            applications: [
                "Genetic testing and diagnosis",
                "Gene therapy (correct defective genes)",
                "CRISPR gene editing",
                "Forensic DNA fingerprinting",
                "Evolutionary studies (phylogenetics)",
                "Agriculture (GMO crops)",
                "Biotechnology (recombinant proteins)",
                "Personalized medicine"
            ]
        };
        
        return content;
    }

    handleBioenergetics(problem) {
        const content = {
            topic: "Bioenergetics and Cellular Metabolism",
            category: 'metabolism',
            summary: "Bioenergetics is the study of energy transformations in living organisms. Cells harvest energy from nutrients through metabolic pathways, primarily cellular respiration, storing it as ATP for cellular work.",
            
            energyFundamentals: {
                ATP: {
                    fullName: "Adenosine Triphosphate",
                    structure: {
                        components: "Adenine + Ribose + 3 Phosphate groups",
                        bonds: "Two high-energy phosphate bonds (between phosphates)",
                        symbol: "ATP has 3 phosphates; ADP has 2; AMP has 1"
                    },
                    hydrolysis: {
                        reaction: "ATP + H₂O → ADP + Pi + energy",
                        energy: "~30.5 kJ/mol (−7.3 kcal/mol) under standard conditions",
                        cellular: "~50 kJ/mol under cellular conditions",
                        note: "Energy released, not stored in bond (bond breaking requires energy, but products more stable)"
                    },
                    synthesis: {
                        substrateLevelPhosphorylation: "Direct transfer of Pi from substrate to ADP",
                        oxidativePhosphorylation: "ATP synthase uses proton gradient",
                        photophosphorylation: "Light energy → ATP (in photosynthesis)"
                    },
                    roles: {
                        energyCurrency: "Powers most cellular processes",
                        uses: [
                            "Muscle contraction (myosin)",
                            "Active transport (Na⁺/K⁺ pump)",
                            "Biosynthesis (making macromolecules)",
                            "Nerve impulses",
                            "Cell division",
                            "Bioluminescence"
                        ]
                    },
                    turnover: {
                        amount: "~250g ATP in human body at any moment",
                        production: "Body makes and uses ~40-50 kg ATP per day",
                        recycling: "Each ATP molecule recycled ~500-750 times per day"
                    }
                },
                
                electronCarriers: {
                    NADplus: {
                        fullName: "Nicotinamide Adenine Dinucleotide",
                        derivedFrom: "Niacin (Vitamin B3)",
                        oxidized: "NAD⁺ (electron acceptor)",
                        reduced: "NADH + H⁺ (electron donor)",
                        reaction: "NAD⁺ + 2e⁻ + H⁺ → NADH",
                        role: "Primary electron carrier in catabolism (glycolysis, Krebs cycle)",
                        ATPyield: "~2.5 ATP per NADH (via electron transport chain)"
                    },
                    FAD: {
                        fullName: "Flavin Adenine Dinucleotide",
                        derivedFrom: "Riboflavin (Vitamin B2)",
                        oxidized: "FAD (electron acceptor)",
                        reduced: "FADH₂ (electron donor)",
                        reaction: "FAD + 2e⁻ + 2H⁺ → FADH₂",
                        role: "Electron carrier in Krebs cycle, fatty acid oxidation",
                        ATPyield: "~1.5 ATP per FADH₂ (via electron transport chain)",
                        note: "Enters ETC at Complex II (later than NADH), so less ATP"
                    },
                    NADPplus: {
                        fullName: "Nicotinamide Adenine Dinucleotide Phosphate",
                        difference: "Extra phosphate group compared to NAD⁺",
                        oxidized: "NADP⁺",
                        reduced: "NADPH + H⁺",
                        role: "Electron carrier in anabolic reactions (biosynthesis, photosynthesis)",
                        examples: "Fatty acid synthesis, cholesterol synthesis, photosynthesis (light reactions)"
                    }
                },
                
                redoxReactions: {
                    definition: "Reduction-Oxidation reactions (transfer of electrons)",
                    oxidation: {
                        definition: "Loss of electrons (or hydrogen)",
                        mnemonic: "OIL (Oxidation Is Loss)",
                        example: "Glucose oxidized during cellular respiration"
                    },
                    reduction: {
                        definition: "Gain of electrons (or hydrogen)",
                        mnemonic: "RIG (Reduction Is Gain)",
                        example: "Oxygen reduced to water"
                    },
                    coupled: "Oxidation and reduction always occur together (electron transfer)",
                    energy: "Electrons move from high-energy to low-energy state, releasing energy"
                }
            },
            
            cellularRespiration: {
                overview: {
                    equation: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (~36-38 ATP)",
                    purpose: "Extract energy from glucose, store as ATP",
                    efficiency: "~40% (rest released as heat)",
                    location: "Cytoplasm (glycolysis), Mitochondria (Krebs, ETC)",
                    oxygen: "Aerobic process (requires O₂ for full efficiency)"
                },
                
                stages: {
                    glycolysis: {
                        location: "Cytoplasm (cytosol)",
                        input: "1 Glucose (6C)",
                        output: {
                            products: "2 Pyruvate (3C each)",
                            ATP: "2 ATP (net: 4 produced - 2 invested)",
                            NADH: "2 NADH",
                            water: "2 H₂O produced"
                        },
                        oxygen: "Not required (anaerobic)",
                        steps: "10 enzyme-catalyzed reactions",
                        phases: {
                            energyInvestment: {
                                steps: "1-5",
                                description: "Glucose phosphorylated (uses 2 ATP)",
                                purpose: "Activate glucose, split into two 3-carbon molecules"
                            },
                            energyPayoff: {
                                steps: "6-10",
                                description: "Oxidation, ATP production",
                                yields: "4 ATP, 2 NADH"
                            }
                        },
                        keySteps: [
                            "Glucose → Glucose-6-phosphate (hexokinase, uses ATP)",
                            "Fructose-6-phosphate → Fructose-1,6-bisphosphate (phosphofructokinase, uses ATP, rate-limiting)",
                            "Glyceraldehyde-3-phosphate → 1,3-bisphosphoglycerate (produces NADH)",
                            "1,3-bisphosphoglycerate → 3-phosphoglycerate (produces ATP, substrate-level)",
                            "Phosphoenolpyruvate → Pyruvate (produces ATP, substrate-level)"
                        ],
                        regulation: {
                            phosphofructokinase: {
                                inhibitors: "ATP, citrate (energy high)",
                                activators: "AMP, ADP (energy low)",
                                note: "Key regulatory enzyme (rate-limiting step)"
                            }
                        }
                    },
                    
                    linkReaction: {
                        alternativeName: "Pyruvate oxidation, Transition reaction",
                        location: "Mitochondrial matrix",
                        input: "2 Pyruvate (from glycolysis)",
                        output: {
                            products: "2 Acetyl-CoA (2C each)",
                            NADH: "2 NADH",
                            CO2: "2 CO₂"
                        },
                        enzyme: "Pyruvate dehydrogenase complex (multi-enzyme complex)",
                        reaction: "Pyruvate + CoA + NAD⁺ → Acetyl-CoA + NADH + CO₂",
                        irreversible: "Committed step (can't go back to glucose)",
                        regulation: {
                            inhibitors: "Acetyl-CoA, NADH, ATP",
                            activators: "AMP, CoA, NAD⁺, Ca²⁺"
                        }
                    },
                    
                    krebsCycle: {
                        alternativeName: "Citric acid cycle, TCA cycle (tricarboxylic acid)",
                        location: "Mitochondrial matrix",
                        input: "2 Acetyl-CoA (per glucose)",
                        output: {
                            CO2: "4 CO₂ (2 per turn × 2 turns)",
                            NADH: "6 NADH (3 per turn × 2)",
                            FADH2: "2 FADH₂ (1 per turn × 2)",
                            ATP: "2 ATP (or GTP) (1 per turn × 2)",
                            CoA: "2 CoA regenerated"
                        },
                        turns: "2 per glucose (one for each Acetyl-CoA)",
                        cycle: "Oxaloacetate regenerated (catalytic)",
                        keySteps: [
                            "Acetyl-CoA (2C) + Oxaloacetate (4C) → Citrate (6C) [citrate synthase]",
                            "Citrate → Isocitrate [aconitase]",
                            "Isocitrate → α-Ketoglutarate + CO₂ + NADH [isocitrate dehydrogenase, regulated]",
                            "α-Ketoglutarate → Succinyl-CoA + CO₂ + NADH [α-ketoglutarate dehydrogenase, regulated]",
                            "Succinyl-CoA → Succinate + ATP (or GTP) [succinyl-CoA synthetase, substrate-level phosphorylation]",
                            "Succinate → Fumarate + FADH₂ [succinate dehydrogenase, Complex II of ETC]",
                            "Fumarate → Malate [fumarase]",
                            "Malate → Oxaloacetate + NADH [malate dehydrogenase]"
                        ],
                        regulation: {
                            isocitrateDehydrogenase: {
                                inhibitors: "ATP, NADH",
                                activators: "ADP, Ca²⁺"
                            },
                            alphaKetoglutarateDehydrogenase: {
                                inhibitors: "Succinyl-CoA, NADH",
                                activators: "Ca²⁺"
                            }
                        }
                    },
                    
                    electronTransportChain: {
                        alternativeName: "ETC, Respiratory chain",
                        location: "Inner mitochondrial membrane (cristae)",
                        input: {
                            NADH: "10 NADH (2 from glycolysis, 2 from link, 6 from Krebs)",
                            FADH2: "2 FADH₂ (from Krebs)",
                            O2: "6 O₂ (final electron acceptor)"
                        },
                        output: {
                            ATP: "~32-34 ATP (via oxidative phosphorylation)",
                            H2O: "6 H₂O (from O₂ reduction)"
                        },
                        complexes: {
                            complexI: {
                                name: "NADH dehydrogenase",
                                accepts: "Electrons from NADH",
                                pumps: "4 H⁺ to intermembrane space",
                                passes: "Electrons to ubiquinone (CoQ)"
                            },
                            complexII: {
                                name: "Succinate dehydrogenase",
                                accepts: "Electrons from FADH₂ (also part of Krebs cycle)",
                                pumps: "0 H⁺ (does not pump)",
                                passes: "Electrons to ubiquinone (CoQ)",
                                note: "FADH₂ bypasses Complex I, so less ATP"
                            },
                            complexIII: {
                                name: "Cytochrome bc1 complex",
                                accepts: "Electrons from ubiquinone (CoQ)",
                                pumps: "4 H⁺ to intermembrane space",
                                passes: "Electrons to cytochrome c"
                            },
                            complexIV: {
                                name: "Cytochrome c oxidase",
                                accepts: "Electrons from cytochrome c",
                                pumps: "2 H⁺ to intermembrane space",
                                reduces: "O₂ + 4H⁺ + 4e⁻ → 2H₂O (final step)",
                                note: "Oxygen is final electron acceptor"
                            }
                        },
                        protonGradient: {
                            pumping: "Complexes I, III, IV pump H⁺ from matrix to intermembrane space",
                            gradient: "High [H⁺] in intermembrane space, low in matrix",
                            electrochemical: "Both concentration gradient and electrical gradient (proton-motive force)"
                        },
                        chemiosmosis: {
                            definition: "ATP synthesis driven by proton gradient",
                            enzyme: "ATP synthase (Complex V)",
                            mechanism: [
                                "H⁺ flows back through ATP synthase (down gradient)",
                                "Rotation of F₀ subunit drives conformational change in F₁",
                                "F₁ catalyzes ADP + Pi → ATP",
                                "Binding change mechanism (Boyer)"
                            ],
                            ratio: "~2.5 ATP per NADH, ~1.5 ATP per FADH₂ (approximate)"
                        },
                        cyanidePoisoning: {
                            mechanism: "Cyanide binds Complex IV, blocks electron transport",
                            consequence: "ETC stops, no ATP production, rapid death",
                            why: "Cells can't produce ATP even with oxygen present"
                        }
                    }
                },
                
                ATPaccounting: {
                    glycolysis: {
                        direct: "2 ATP (substrate-level)",
                        NADH: "2 NADH → ~5 ATP (via ETC, depends on shuttle)",
                        total: "~7 ATP"
                    },
                    linkReaction: {
                        NADH: "2 NADH → ~5 ATP"
                    },
                    krebsCycle: {
                        direct: "2 ATP (substrate-level)",
                        NADH: "6 NADH → ~15 ATP",
                        FADH2: "2 FADH₂ → ~3 ATP",
                        total: "~20 ATP"
                    },
                    grandTotal: {
                        theoretical: "~38 ATP per glucose",
                        actual: "~36 ATP (energy cost of shuttles, proton leak)",
                        prokaryotes: "~38 ATP (no compartmentalization)",
                        efficiency: "~40% (rest as heat)"
                    },
                    shuttles: {
                        glycerol3phosphate: "2 NADH → 2 FADH₂ (~3 ATP total, less efficient)",
                        malateaspartate: "2 NADH → 2 NADH (~5 ATP total, more efficient)"
                    }
                }
            },
            
            anaerobicRespiration: {
                fermentation: {
                    definition: "Glycolysis + NAD⁺ regeneration without O₂",
                    purpose: "Regenerate NAD⁺ to allow glycolysis to continue",
                    ATPyield: "2 ATP per glucose (only from glycolysis)",
                    efficiency: "Much less efficient than aerobic respiration",
                    
                    lacticAcidFermentation: {
                        organisms: "Muscle cells (during intense exercise), some bacteria (yogurt, sauerkraut)",
                        reaction: "Pyruvate + NADH → Lactate + NAD⁺",
                        enzyme: "Lactate dehydrogenase",
                        muscle: {
                            accumulation: "Lactate builds up during intense exercise (O₂ limited)",
                            fatigue: "Contributes to muscle fatigue (lowers pH)",
                            recovery: "Lactate transported to liver, converted back to glucose (Cori cycle)"
                        }
                    },
                    
                    alcoholicFermentation: {
                        organisms: "Yeast, some bacteria",
                        reaction: "Pyruvate → Ethanol + CO₂ + NAD⁺",
                        steps: [
                            "Pyruvate → Acetaldehyde + CO₂ (pyruvate decarboxylase)",
                            "Acetaldehyde + NADH → Ethanol + NAD⁺ (alcohol dehydrogenase)"
                        ],
                        applications: {
                            brewing: "Beer, wine (ethanol production)",
                            baking: "Bread (CO₂ for rising, ethanol evaporates)"
                        }
                    }
                },
                
                comparisonAerobicVsAnaerobic: {
                    oxygen: "Aerobic requires O₂; Anaerobic does not",
                    location: "Aerobic: mitochondria; Anaerobic: cytoplasm only",
                    ATPyield: "Aerobic: ~36-38 ATP; Anaerobic: 2 ATP",
                    products: "Aerobic: CO₂ + H₂O; Anaerobic: Lactate or Ethanol + CO₂",
                    efficiency: "Aerobic: ~40%; Anaerobic: ~2%"
                }
            },
            
            metabolicRegulation: {
                feedbackInhibition: {
                    definition: "End product inhibits earlier enzyme in pathway",
                    purpose: "Prevent overproduction",
                    example: "ATP inhibits phosphofructokinase (glycolysis)"
                },
                allostericRegulation: {
                    definition: "Regulator binds to site other than active site",
                    effect: "Changes enzyme conformation, alters activity",
                    examples: "PFK (glycolysis), isocitrate dehydrogenase (Krebs)"
                },
                hormonalRegulation: {
                    insulin: {
                        released: "When blood glucose high (after meal)",
                        effect: "Promotes glucose uptake, glycolysis, glycogen synthesis",
                        target: "Liver, muscle, adipose tissue"
                    },
                    glucagon: {
                        released: "When blood glucose low (fasting)",
                        effect: "Promotes glycogen breakdown, gluconeogenesis",
                        target: "Liver primarily"
                    },
                    epinephrine: {
                        released: "During stress (fight-or-flight)",
                        effect: "Mobilizes glucose (glycogen → glucose), increases metabolic rate",
                        target: "Liver, muscle"
                    }
                },
                compartmentalization: {
                    glycolysis: "Cytoplasm",
                    krebsCycle: "Mitochondrial matrix",
                    ETC: "Inner mitochondrial membrane",
                    fattyAcidSynthesis: "Cytoplasm",
                    fattyAcidOxidation: "Mitochondrial matrix",
                    purpose: "Separate anabolic and catabolic pathways, regulate independently"
                }
            },
            
            alternativeFuels: {
                fats: {
                    storage: "More energy-dense than carbohydrates (9 kcal/g vs 4 kcal/g)",
                    breakdown: {
                        lipolysis: "Triglycerides → Glycerol + Fatty acids",
                        betaOxidation: "Fatty acids → Acetyl-CoA (in mitochondria)",
                        yield: "More ATP per molecule (e.g., palmitic acid → ~129 ATP)"
                    },
                    ketogenesis: {
                        when: "During fasting, low-carb diet, diabetes",
                        location: "Liver",
                        products: "Ketone bodies (acetoacetate, β-hydroxybutyrate, acetone)",
                        use: "Brain can use ketones when glucose low"
                    }
                },
                proteins: {
                    breakdown: "Amino acids deaminated (remove NH₂ group)",
                    entry: "Carbon skeletons enter at various points (Krebs cycle intermediates, pyruvate, Acetyl-CoA)",
                    urea: "NH₂ converted to urea (excreted)",
                    note: "Last resort (body prefers to preserve proteins for structure/function)"
                }
            },
            
            comparison: {
                aerobicVsAnaerobic: [
                    {feature: "O₂ requirement", aerobic: "Required", anaerobic: "Not required"},
                    {feature: "ATP yield", aerobic: "~36-38 per glucose", anaerobic: "2 per glucose"},
                    {feature: "End products", aerobic: "CO₂ + H₂O", anaerobic: "Lactate or Ethanol + CO₂"},
                    {feature: "Location", aerobic: "Cytoplasm + Mitochondria", anaerobic: "Cytoplasm only"},
                    {feature: "Efficiency", aerobic: "~40%", anaerobic: "~2%"},
                    {feature: "Speed", aerobic: "Slower (multi-step)", anaerobic: "Faster (fewer steps)"}
                ]
            },
            
            examples: [
                {
                    name: "Marathon running",
                    process: "Primarily aerobic respiration",
                    fuel: "Glucose, glycogen, then fats",
                    note: "Efficient ATP production for sustained activity"
                },
                {
                    name: "Sprinting",
                    process: "Anaerobic (lactic acid fermentation)",
                    fuel: "Glucose (glycolysis only)",
                    note: "Fast ATP but inefficient, causes lactate buildup"
                },
                {
                    name: "Yeast in bread dough",
                    process: "Alcoholic fermentation",
                    products: "CO₂ (rises dough), ethanol (evaporates)",
                    note: "Anaerobic conditions"
                }
            ],
            
            applications: [
                "Understanding metabolic diseases (diabetes, mitochondrial disorders)",
                "Optimizing athletic performance",
                "Weight loss and nutrition strategies",
                "Cancer metabolism (Warburg effect: cancer cells prefer glycolysis)",
                "Drug development (targeting metabolic enzymes)",
                "Biofuel production (fermentation)",
                "Understanding aging (mitochondrial dysfunction)"
            ]
        };
        
        return content;
    }

    handleEnzymes(problem) {
        const content = {
            topic: "Enzyme Function and Kinetics",
            category: 'protein_function',
            summary: "Enzymes are biological catalysts that dramatically increase the rates of biochemical reactions without being consumed. They achieve remarkable specificity and efficiency, making life possible at physiological temperatures and conditions.",
            
            enzymeBasics: {
                definition: "Biological catalyst (usually protein) that speeds up chemical reactions",
                characteristics: [
                    "Highly specific for substrate(s)",
                    "Not consumed in reaction (reusable)",
                    "Speed up both forward and reverse reactions (don't change equilibrium)",
                    "Lower activation energy (Ea)",
                    "Work under mild conditions (pH ~7, temp ~37°C)",
                    "Can be regulated"
                ],
                nomenclature: {
                    common: "Often ends in '-ase' (e.g., amylase, lipase, protease)",
                    systematic: "Describes reaction (e.g., ATP:glucose phosphotransferase = hexokinase)",
                    EC: "Enzyme Commission number (e.g., EC 2.7.1.1 for hexokinase)"
                },
                components: {
                    apoenzyme: "Protein part alone (inactive without cofactor)",
                    cofactor: "Non-protein helper (metal ion or organic molecule)",
                    holoenzyme: "Complete, active enzyme (apoenzyme + cofactor)",
                    prostheticGroup: "Tightly bound cofactor (e.g., heme in catalase)"
                }
            },
            
            activeSite: {
                definition: "Specific region where substrate binds and catalysis occurs",
                properties: {
                    small: "Only small portion of enzyme (3-12 amino acids)",
                    cleft: "Often a groove or pocket in 3D structure",
                    specific: "Shape and chemistry complementary to substrate (or transition state)",
                    microenvironment: "Can have different pH, polarity than bulk solution"
                },
                binding: {
                    substratebinding: "Non-covalent interactions (H-bonds, ionic, hydrophobic, van der Waals)",
                    specificity: "Precise fit ensures only correct substrate binds",
                    proximity: "Brings reactive groups close together",
                    orientation: "Positions substrate for reaction"
                },
                catalytic: {
                    residues: "Specific amino acids directly participate in catalysis",
                    examples: "Ser, His, Asp in serine proteases (catalytic triad)",
                    mechanism: "Stabilize transition state, donate/accept protons, form covalent intermediates"
                }
            },
            
            catalyticMechanisms: {
                lockAndKey: {
                    proposed: "Emil Fischer (1894)",
                    model: "Rigid active site perfectly matches substrate shape",
                    analogy: "Lock (enzyme) fits specific key (substrate)",
                    limitation: "Doesn't explain conformational changes or transition state stabilization"
                },
                inducedFit: {
                    proposed: "Daniel Koshland (1958)",
                    model: "Active site changes shape upon substrate binding",
                    mechanism: "Substrate induces conformational change that optimizes catalysis",
                    advantages: [
                        "Explains specificity (induced fit only for correct substrate)",
                        "Explains catalysis (change brings catalytic residues into position)",
                        "Explains regulation (allosteric effects)"
                    ]
                },
                strategies: {
                    transitionStateStabilization: {
                        principle: "Enzyme binds transition state more tightly than substrate",
                        effect: "Lowers activation energy (Ea)",
                        pauling: "Linus Pauling proposed this (1946)",
                        consequence: "Rate enhancement up to 10¹⁷-fold"
                    },
                    proximityAndOrientation: {
                        principle: "Enzyme brings substrates together in correct orientation",
                        effect: "Increases effective concentration, proper alignment",
                        example: "Two substrates bound in active site, positioned for reaction"
                    },
                    covalentCatalysis: {
                        principle: "Enzyme forms temporary covalent bond with substrate",
                        mechanism: "Creates reactive intermediate",
                        example: "Serine proteases (Ser-OH attacks peptide bond)"
                    },
                    acidBaseCatalysis: {
                        principle: "Active site residues donate or accept protons",
                        mechanism: "Stabilize charged intermediates",
                        example: "His acts as general base, abstracts proton"
                    },
                    strainAndDistortion: {
                        principle: "Enzyme distorts substrate bonds",
                        effect: "Makes bonds easier to break",
                        example: "Lysozyme strains glycosidic bond"
                    },
                    environmentalEffects: {
                        principle: "Active site provides favorable microenvironment",
                        examples: "Low dielectric (hydrophobic pocket), altered pKa of residues"
                    }
                }
            },
            
            cofactorsCoenzymes: {
                cofactors: {
                    definition: "Inorganic ions required for enzyme activity",
                    examples: [
                        {ion: "Zn²⁺", enzyme: "Carbonic anhydrase, DNA polymerase", role: "Lewis acid, stabilize negative charge"},
                        {ion: "Fe²⁺/Fe³⁺", enzyme: "Cytochromes, catalase", role: "Redox reactions"},
                        {ion: "Mg²⁺", enzyme: "Kinases, DNA/RNA polymerases", role: "Bind ATP, stabilize negative charge"},
                        {ion: "Cu²⁺", enzyme: "Cytochrome oxidase", role: "Redox reactions"},
                        {ion: "Mn²⁺", enzyme: "Arginase", role: "Activate water"},
                        {ion: "Ca²⁺", enzyme: "Some proteases", role: "Structural, signaling"}
                    ]
                },
                coenzymes: {
                    definition: "Organic molecules (often vitamin-derived) required for activity",
                    types: {
                        NADplusNADH: {
                            fullName: "Nicotinamide Adenine Dinucleotide",
                            vitamin: "Niacin (B3)",
                            role: "Redox reactions (electron carrier)",
                            reactions: "Dehydrogenases",
                            mechanism: "Accepts/donates hydride ion (H⁻)"
                        },
                        FADFADH2: {
                            fullName: "Flavin Adenine Dinucleotide",
                            vitamin: "Riboflavin (B2)",
                            role: "Redox reactions",
                            reactions: "Oxidases, dehydrogenases",
                            mechanism: "Accepts/donates hydrogen atoms or electrons"
                        },
                        coenzymeA: {
                            fullName: "Coenzyme A",
                            vitamin: "Pantothenic acid (B5)",
                            role: "Acyl group carrier",
                            reactions: "Krebs cycle, fatty acid metabolism",
                            mechanism: "Thiol group (-SH) forms thioester bonds"
                        },
                        TPP: {
                            fullName: "Thiamine Pyrophosphate",
                            vitamin: "Thiamine (B1)",
                            role: "Decarboxylation reactions",
                            enzyme: "Pyruvate dehydrogenase, α-ketoglutarate dehydrogenase"
                        },
                        PLP: {
                            fullName: "Pyridoxal Phosphate",
                            vitamin: "Pyridoxine (B6)",
                            role: "Amino acid metabolism (transamination, decarboxylation)",
                            mechanism: "Forms Schiff base with amino acids"
                        },
                        biotin: {
                            vitamin: "Biotin (B7)",
                            role: "Carboxylation reactions (CO₂ transfer)",
                            enzymes: "Pyruvate carboxylase, acetyl-CoA carboxylase"
                        },
                        THF: {
                            fullName: "Tetrahydrofolate",
                            vitamin: "Folic acid (B9)",
                            role: "One-carbon transfer (methyl, formyl groups)",
                            reactions: "Nucleotide synthesis, amino acid metabolism"
                        },
                        cobalamin: {
                            vitamin: "Vitamin B12",
                            role: "Methyl transfer, rearrangements",
                            enzymes: "Methionine synthase, methylmalonyl-CoA mutase"
                        }
                    }
                }
            },
            
            factorsAffectingActivity: {
                temperature: {
                    low: "Slow molecular motion → low reaction rate",
                    optimal: "Maximum activity (typically 37°C for human enzymes, varies by organism)",
                    high: "Denaturation → loss of activity (proteins unfold)",
                    Qten: {
                        definition: "Factor by which rate increases for 10°C rise",
                        typical: "Q₁₀ ≈ 2 (rate doubles per 10°C, until denaturation)",
                        note: "Only valid below denaturation temperature"
                    },
                    adaptations: {
                        psychrophiles: "Optimal ~15°C (cold-adapted enzymes)",
                        mesophiles: "Optimal ~37°C (humans)",
                        thermophiles: "Optimal >60°C (hot spring bacteria, Taq polymerase)"
                    }
                },
                pH: {
                    mechanism: "Alters ionization state of active site amino acids and substrate",
                    optimal: "pH where enzyme is most active (varies by enzyme)",
                    examples: [
                        {enzyme: "Pepsin", optimal: "pH 2", location: "Stomach", note: "Acidic environment"},
                        {enzyme: "Trypsin", optimal: "pH 8", location: "Small intestine", note: "Slightly basic"},
                        {enzyme: "Catalase", optimal: "pH 7", location: "Cells", note: "Neutral"},
                        {enzyme: "Arginase", optimal: "pH 10", location: "Liver", note: "Basic"}
                    ],
                    extremes: {
                        too low: "Protonates carboxyl groups, alters charges, may denature",
                        too high: "Deprotonates amino groups, alters charges, may denature"
                    }
                },
                substrateConcentration: {
                    low: "Rate increases linearly with [S] (first-order kinetics)",
                    medium: "Rate increases but not linearly (mixed-order)",
                    high: "Rate plateaus at Vmax (zero-order kinetics, enzyme saturated)",
                    saturation: "All active sites occupied, adding more substrate doesn't help"
                },
                enzymeConcentration: {
                    relationship: "Rate directly proportional to [E] (when substrate not limiting)",
                    doubleEnzyme: "Double rate (if enough substrate available)"
                }
            },
            
            enzymeKinetics: {
                MichaelisMenten: {
                    equation: "v = (Vmax × [S]) / (Km + [S])",
                    derivation: "E + S ⇌ ES → E + P (rapid equilibrium or steady-state assumption)",
                    parameters: {
                        v: "Initial reaction rate (velocity)",
                        Vmax: {
                            definition: "Maximum rate at saturating [S]",
                            relation: "Vmax = kcat × [E]total",
                            meaning: "All enzyme in ES form"
                        },
                        Km: {
                            definition: "Michaelis constant - [S] at which v = ½Vmax",
                            interpretation: "Measure of affinity (low Km = high affinity, tight binding)",
                            approximation: "Km ≈ Kd (dissociation constant) under some conditions",
                            typical: "Range from μM to mM"
                        },
                        kcat: {
                            definition: "Turnover number - catalytic rate constant",
                            meaning: "Substrate molecules converted per enzyme per second when saturated",
                            typical: "Range from 10⁻¹ to 10⁷ s⁻¹"
                        },
                        kcatKm: {
                            definition: "Catalytic efficiency (specificity constant)",
                            interpretation: "How well enzyme performs at low [S]",
                            limit: "Cannot exceed diffusion limit (~10⁸-10⁹ M⁻¹s⁻¹)",
                            perfection: "Enzymes near diffusion limit are 'catalytically perfect'"
                        }
                    },
                    hyperbolicCurve: "Plot of v vs [S] is rectangular hyperbola",
                    assumptions: [
                        "Initial rate (product concentration negligible)",
                        "Steady state ([ES] constant)",
                        "Single substrate (or one varied)"
                    ]
                },
                
                LineweaverBurk: {
                    equation: "1/v = (Km/Vmax) × (1/[S]) + 1/Vmax",
                    plot: "Double reciprocal: 1/v vs 1/[S]",
                    type: "Linear transformation of Michaelis-Menten",
                    intercepts: {
                        yIntercept: "1/Vmax",
                        xIntercept: "−1/Km",
                        slope: "Km/Vmax"
                    },
                    advantages: [
                        "Easy to determine Vmax and Km from linear plot",
                        "Identify type of inhibition (by comparing slopes/intercepts)"
                    ],
                    disadvantages: [
                        "Distorts error (emphasizes low [S] data)",
                        "Not as accurate as non-linear regression"
                    ]
                },
                
                otherPlots: {
                    EadieHofstee: "v vs v/[S] - less distortion than Lineweaver-Burk",
                    HanesWoolf: "[S]/v vs [S] - good for determining Km",
                    directFit: "Non-linear regression to Michaelis-Menten (best method with modern computers)"
                }
            },
            
            enzymeInhibition: {
                reversible: {
                    competitive: {
                        mechanism: "Inhibitor competes with substrate for active site",
                        binding: "I binds to E (not to ES)",
                        structure: "Inhibitor resembles substrate (substrate analog)",
                        effect: {
                            Km: "Increases (apparent Km higher - need more [S] to reach ½Vmax)",
                            Vmax: "Unchanged (can overcome by increasing [S])",
                            LineweaverBurk: "Slope increases, y-intercept same, x-intercept changes"
                        },
                        examples: [
                            {inhibitor: "Malonate", enzyme: "Succinate dehydrogenase", substrate: "Succinate", note: "Similar structure"},
                            {inhibitor: "Methotrexate", enzyme: "Dihydrofolate reductase", use: "Cancer drug"},
                            {inhibitor: "Statins", enzyme: "HMG-CoA reductase", use: "Lower cholesterol"}
                        ],
                        overcome: "Increase [S] to outcompete inhibitor"
                    },
                    
                    noncompetitive: {
                        mechanism: "Inhibitor binds to site other than active site (allosteric site)",
                        binding: "I can bind to E or ES (forms EI and ESI)",
                        structure: "Inhibitor does NOT resemble substrate",
                        effect: {
                            Km: "Unchanged (binding affinity same)",
                            Vmax: "Decreases (less functional enzyme)",
                            LineweaverBurk: "Slope increases, y-intercept increases (both change), x-intercept same"
                        },
                        conformational: "Binding causes shape change, reduces catalytic activity",
                        overcome: "Cannot overcome by increasing [S]",
                        examples: [
                            {inhibitor: "Heavy metals (Pb²⁺, Hg²⁺)", mechanism: "Bind to -SH groups, distort enzyme"},
                            {inhibitor: "Some drugs targeting allosteric sites"}
                        ]
                    },
                    
                    uncompetitive: {
                        mechanism: "Inhibitor binds only to ES complex (not to free E)",
                        binding: "I + ES → ESI (inactive)",
                        effect: {
                            Km: "Decreases (apparent higher affinity)",
                            Vmax: "Decreases (less active enzyme)",
                            LineweaverBurk: "Parallel lines (slope same, both intercepts change)"
                        },
                        note: "Less common than competitive or non-competitive",
                        examples: "Some drugs, less common in nature"
                    },
                    
                    mixed: {
                        mechanism: "Inhibitor can bind to E or ES, but with different affinity",
                        effect: "Both Km and Vmax affected",
                        note: "General case (competitive and non-competitive are special cases)"
                    }
                },
                
                irreversible: {
                    mechanism: "Inhibitor forms covalent bond with enzyme (permanent inactivation)",
                    suicide: {
                        definition: "Mechanism-based inhibitor - enzyme activates inhibitor, which then inactivates enzyme",
                        example: "Penicillin (inhibits bacterial transpeptidase)",
                        note: "Highly specific, used as drugs"
                    },
                    examples: [
                        {inhibitor: "Aspirin", enzyme: "COX (cyclooxygenase)", mechanism: "Acetylates Ser residue, blocks prostaglandin synthesis", use: "Pain relief, anti-inflammatory"},
                        {inhibitor: "Penicillin", enzyme: "Transpeptidase", mechanism: "Mimics D-Ala-D-Ala, forms covalent adduct", use: "Antibiotic"},
                        {inhibitor: "Nerve gases (Sarin)", enzyme: "Acetylcholinesterase", mechanism: "Phosphorylates Ser, permanent", effect: "Paralysis, death"},
                        {inhibitor: "Cyanide", enzyme: "Cytochrome c oxidase", mechanism: "Binds Fe³⁺, blocks ETC", effect: "Stops cellular respiration"}
                    ]
                }
            },
            
            allostericRegulation: {
                definition: "Regulation by molecules binding to sites other than active site",
                allostery: "Binding at one site affects another site (conformational change)",
                cooperativity: {
                    positive: "Binding of substrate to one subunit increases affinity of others (e.g., hemoglobin)",
                    negative: "Binding decreases affinity of other subunits",
                    sigmoidalCurve: "Positive cooperativity gives S-shaped curve (vs hyperbolic)",
                    Hill: "Hill coefficient (n > 1: positive cooperativity, n = 1: no cooperativity, n < 1: negative)"
                },
                regulators: {
                    activator: "Increases enzyme activity (positive effector)",
                    inhibitor: "Decreases enzyme activity (negative effector)"
                },
                examples: [
                    {enzyme: "Phosphofructokinase (PFK)", pathway: "Glycolysis", activators: "AMP, ADP, F-2,6-BP", inhibitors: "ATP, citrate", note: "Key regulatory enzyme"},
                    {enzyme: "Aspartate transcarbamoylase (ATCase)", pathway: "Pyrimidine synthesis", activator: "ATP", inhibitor: "CTP (end product)", note: "Feedback inhibition"},
                    {enzyme: "Hemoglobin", function: "O₂ transport", effector: "O₂ (positive cooperativity)", note: "Not an enzyme but shows allostery"}
                ]
            },
            
            covalentModification: {
                phosphorylation: {
                    mechanism: "Add phosphate group (from ATP) to Ser, Thr, or Tyr",
                    enzyme: "Protein kinases catalyze phosphorylation",
                    reversal: "Protein phosphatases remove phosphate",
                    effect: "Can activate or inactivate enzyme (depends on enzyme)",
                    examples: [
                        {enzyme: "Glycogen phosphorylase", effect: "Phosphorylation activates (breaks down glycogen)"},
                        {enzyme: "Glycogen synthase", effect: "Phosphorylation inactivates (stops glycogen synthesis)"},
                        {note: "Reciprocal regulation - one active when other inactive"}
                    ],
                    amplification: "Cascade of kinases amplifies signal (e.g., MAPK pathway)"
                },
                otherModifications: {
                    acetylation: "Add acetyl group (histone acetylation affects gene expression)",
                    methylation: "Add methyl group (affects DNA/protein function)",
                    ubiquitination: "Add ubiquitin (tags for degradation or alters function)",
                    proteolysis: "Cleave inactive zymogen → active enzyme (irreversible activation)"
                }
            },
            
            enzymeClassification: {
                EC: {
                    system: "Enzyme Commission classification",
                    format: "EC X.Y.Z.W (4 numbers)",
                    example: "EC 2.7.1.1 = Hexokinase"
                },
                classes: {
                    1: {
                        name: "Oxidoreductases",
                        reaction: "Oxidation-reduction (transfer electrons)",
                        examples: "Dehydrogenases, oxidases, reductases, catalase",
                        coenzymes: "NAD⁺, FAD"
                    },
                    2: {
                        name: "Transferases",
                        reaction: "Transfer functional groups",
                        examples: "Kinases (phosphate), transaminases (amino group), methyltransferases",
                        coenzymes: "ATP (kinases), PLP (transaminases)"
                    },
                    3: {
                        name: "Hydrolases",
                        reaction: "Hydrolysis (break bonds using water)",
                        examples: "Proteases, lipases, nucleases, phosphatases, esterases",
                        note: "Very common in digestion"
                    },
                    4: {
                        name: "Lyases",
                        reaction: "Break bonds without water or redox (often form double bonds)",
                        examples: "Decarboxylases, aldolases, dehydratases",
                        note: "Non-hydrolytic cleavage"
                    },
                    5: {
                        name: "Isomerases",
                        reaction: "Rearrange atoms within molecule (isomerization)",
                        examples: "Racemases, epimerases, mutases, isomerases",
                        note: "Change configuration or structure, same molecular formula"
                    },
                    6: {
                        name: "Ligases",
                        reaction: "Form bonds using ATP energy (join molecules)",
                        examples: "DNA ligase, synthetases, carboxylases",
                        coenzyme: "ATP (or other NTP)",
                        note: "Also called synthetases"
                    }
                }
            },
            
            comparison: {
                competitiveVsNoncompetitive: [
                    {feature: "Binding site", competitive: "Active site (same as substrate)", noncompetitive: "Allosteric site (different from active)"},
                    {feature: "Structure", competitive: "Resembles substrate", noncompetitive: "Different from substrate"},
                    {feature: "Effect on Km", competitive: "Increases", noncompetitive: "Unchanged"},
                    {feature: "Effect on Vmax", competitive: "Unchanged", noncompetitive: "Decreases"},
                    {feature: "Overcome by [S]", competitive: "Yes (increase [S])", noncompetitive: "No"},
                    {feature: "Lineweaver-Burk", competitive: "Lines intersect on y-axis", noncompetitive: "Lines intersect on x-axis"}
                ]
            },
            
            examples: [
                {
                    name: "Lysozyme",
                    type: "Hydrolase (EC 3.2.1.17)",
                    substrate: "Peptidoglycan (bacterial cell wall)",
                    mechanism: "Cleaves β-1,4 glycosidic bonds",
                    location: "Tears, saliva, egg white",
                    function: "Antibacterial defense",
                    kcat: "~0.5 s⁻¹",
                    Km: "~6 × 10⁻⁶ M",
                    note: "One of first enzymes with known 3D structure (1965)"
                },
                {
                    name: "Carbonic anhydrase",
                    type: "Lyase (EC 4.2.1.1)",
                    reaction: "CO₂ + H₂O ⇌ HCO₃⁻ + H⁺",
                    cofactor: "Zn²⁺",
                    location: "Red blood cells, stomach",
                    function: "CO₂ transport, pH regulation",
                    kcat: "~10⁶ s⁻¹",
                    note: "One of fastest known enzymes (catalytically perfect, diffusion-limited)"
                },
                {
                    name: "Chymotrypsin",
                    type: "Serine protease (hydrolase)",
                    substrate: "Proteins (cleaves after Phe, Trp, Tyr)",
                    mechanism: "Catalytic triad (Ser-His-Asp)",
                    location: "Small intestine",
                    function: "Protein digestion",
                    activation: "Zymogen (chymotrypsinogen) → chymotrypsin (proteolysis)",
                    specificity: "Hydrophobic amino acids"
                },
                {
                    name: "Hexokinase",
                    type: "Transferase (kinase, EC 2.7.1.1)",
                    reaction: "Glucose + ATP → Glucose-6-phosphate + ADP",
                    cofactor: "Mg²⁺",
                    location: "Cytoplasm (all cells)",
                    function: "First step of glycolysis (traps glucose in cell)",
                    mechanism: "Induced fit (large conformational change upon glucose binding)",
                    inhibition: "Product inhibition by G-6-P",
                    Km: "~0.1 mM (low Km = high affinity for glucose)"
                },
                {
                    name: "Catalase",
                    type: "Oxidoreductase (EC 1.11.1.6)",
                    reaction: "2 H₂O₂ → 2 H₂O + O₂",
                    cofactor: "Heme (Fe)",
                    location: "Peroxisomes",
                    function: "Detoxify hydrogen peroxide",
                    kcat: "~10⁷ s⁻¹",
                    note: "Extremely fast, one of highest turnover numbers known"
                }
            ],
            
            applications: [
                "Drug design (most drugs are enzyme inhibitors)",
                "Diagnostic tests (enzyme markers for disease: CK for heart attack, ALT/AST for liver damage)",
                "Industrial processes (detergents contain proteases/lipases; cheese making uses rennet)",
                "Biotechnology (restriction enzymes for DNA cloning, Taq polymerase for PCR)",
                "Understanding metabolic diseases (enzyme deficiencies: PKU, Tay-Sachs)",
                "Personalized medicine (pharmacogenomics - genetic variants in drug-metabolizing enzymes)",
                "Enzyme replacement therapy (Gaucher disease, Fabry disease)",
                "Biosensors (glucose monitors for diabetes use glucose oxidase)"
            ]
        };
        
        return content;
    }

    // ========================================
    // MAIN PROBLEM PROCESSING METHODS
    // ========================================

    parseMolecularProblem(topic, parameters = {}, subTopic = null, context = {}) {
        let topicType = null;

        // Match topic to handler
        for (const [type, config] of Object.entries(this.molecularTopics)) {
            if (type === topic || type === subTopic) {
                topicType = type;
                break;
            }
            
            for (const pattern of config.patterns) {
                if (pattern.test(topic) || (subTopic && pattern.test(subTopic))) {
                    topicType = type;
                    break;
                }
            }
            if (topicType) break;
        }

        if (!topicType) {
            throw new Error(`Unable to recognize molecular biology topic: ${topic}`);
        }

        return {
            originalTopic: topic,
            type: topicType,
            subTopic: subTopic,
            parameters: { ...parameters },
            context: { ...context },
            difficulty: this.molecularTopics[topicType].difficulty,
            prerequisites: this.molecularTopics[topicType].prerequisites,
            parsedAt: new Date().toISOString()
        };
    }

    handleMolecularProblem(config) {
        const { topic, parameters, subTopic, context, requestType } = config;

        try {
            // Determine if requesting experiments or topics
            const isExperimentRequest = requestType === 'experiment' || 
                                       (typeof topic === 'string' && topic.toLowerCase().includes('experiment'));

            if (isExperimentRequest) {
                return this.handleExperimentRequest(config);
            } else {
                // Original topic handling
                this.currentProblem = this.parseMolecularProblem(topic, parameters, subTopic, context);
                this.currentContent = this.getMolecularContent(this.currentProblem);
                
                // Apply adaptive difficulty if enabled
                if (this.adaptiveDifficulty) {
                    this.currentContent = this.adaptContentDifficulty(this.currentContent, this.learnerProfile.currentLevel);
                }
                
                // Add contextual scenarios if enabled
                if (this.contextualLearning) {
                    this.currentContent.contextualScenarios = this.getContextualScenarios(this.currentProblem.type);
                }
                
                // Include related experiments if enabled
                if (this.includeExperiments) {
                    this.currentContent.relatedExperiments = this.getRelatedExperiments(this.currentProblem.type);
                }
                
                // Add metacognitive prompts if enabled
                if (this.metacognitiveSupport) {
                    this.currentContent.metacognitivePrompts = this.getMetacognitivePrompts(this.currentProblem.type);
                }
                
                this.contentSteps = this.generateMolecularContent(this.currentProblem, this.currentContent);
                this.generateMolecularWorkbook();

                return {
                    workbook: this.currentWorkbook,
                    content: this.currentContent,
                    steps: this.contentSteps,
                    experiments: this.currentContent.relatedExperiments,
                    learnerProfile: this.learnerProfile
                };
            }
        } catch (error) {
            throw new Error(`Failed to process molecular biology request: ${error.message}`);
        }
    }

    getMolecularContent(problem) {
        const handler = this.molecularTopics[problem.type]?.handler;
        if (!handler) {
            throw new Error(`No handler available for molecular biology topic: ${problem.type}`);
        }

        let content = handler(problem);

        // Apply parameter filtering if parameters are provided
        if (problem.parameters && Object.keys(problem.parameters).length > 0) {
            content = this.filterContentByParameters(content, problem.parameters);
        }

        return content;
    }

    filterContentByParameters(content, parameters) {
        if (!parameters || Object.keys(parameters).length === 0) {
            return content;
        }

        const filtered = { ...content };

        // Filter by specific items
        if (parameters.specificItems && Array.isArray(parameters.specificItems)) {
            // Filter arrays in content
            Object.keys(filtered).forEach(key => {
                if (Array.isArray(filtered[key])) {
                    filtered[key] = filtered[key].filter(item => {
                        if (typeof item === 'object' && item.name) {
                            return parameters.specificItems.some(spec =>
                                item.name.toLowerCase().includes(spec.toLowerCase())
                            );
                        }
                        return true;
                    });
                }
            });
        }

        // Filter by difficulty level
        if (parameters.difficulty) {
            filtered.detailLevel = parameters.difficulty;
        }

        return filtered;
    }

    // ========================================
    // ADAPTIVE LEARNING METHODS
    // ========================================

    adaptContentDifficulty(content, currentLevel) {
        const adapted = { ...content };

        switch (currentLevel) {
            case 'beginner':
                adapted.vocabulary = 'simplified';
                adapted.examples = this.selectBasicExamples(content.examples);
                adapted.depth = 'overview';
                break;
            
            case 'intermediate':
                adapted.vocabulary = 'standard';
                adapted.examples = this.selectMixedExamples(content.examples);
                adapted.depth = 'moderate';
                break;
            
            case 'advanced':
                adapted.vocabulary = 'technical';
                adapted.examples = this.selectAdvancedExamples(content.examples);
                adapted.depth = 'comprehensive';
                adapted.research = this.addResearchConnections(content);
                break;
        }

        return adapted;
    }

    selectBasicExamples(examples) {
        if (!examples || !Array.isArray(examples)) return [];
        return examples.filter(ex => ex.difficulty === 'basic' || !ex.difficulty).slice(0, 3);
    }

    selectMixedExamples(examples) {
        if (!examples || !Array.isArray(examples)) return [];
        return examples.slice(0, 5);
    }

    selectAdvancedExamples(examples) {
        if (!examples || !Array.isArray(examples)) return [];
        return examples;
    }

    addResearchConnections(content) {
        return {
            currentResearch: `Current research in ${content.topic} includes...`,
            openQuestions: "Unresolved questions in the field...",
            techniques: "Advanced techniques used to study this topic..."
        };
    }

    getContextualScenarios(topicType) {
        return this.contextualScenarios[topicType] || [];
    }

    getMetacognitivePrompts(topicType) {
        const prompts = {
            beforeLearning: this.metacognitivePrompts.beforeLearning.map(p => 
                p.replace('{topic}', this.molecularTopics[topicType]?.name || topicType)
            ),
            duringLearning: this.metacognitivePrompts.duringLearning.map(p => 
                p.replace('{concept}', topicType)
            ),
            afterLearning: this.metacognitivePrompts.afterLearning.map(p => 
                p.replace('{topic}', this.molecularTopics[topicType]?.name || topicType)
            )
        };

        return prompts;
    }

    updateLearnerProfile(topicType, performance) {
        if (performance.score >= 0.8) {
            if (!this.learnerProfile.masteredTopics.includes(topicType)) {
                this.learnerProfile.masteredTopics.push(topicType);
            }
            // Remove from struggling if present
            this.learnerProfile.strugglingTopics = this.learnerProfile.strugglingTopics.filter(t => t !== topicType);
        } else if (performance.score < 0.5) {
            if (!this.learnerProfile.strugglingTopics.includes(topicType)) {
                this.learnerProfile.strugglingTopics.push(topicType);
            }
        }

        this.learnerProfile.progressHistory.push({
            topic: topicType,
            timestamp: new Date().toISOString(),
            performance: performance
        });
    }

    // ========================================
    // CONTENT GENERATION METHODS
    // ========================================

    generateMolecularContent(problem, content) {
        const contentSections = [];

        // Generate overview section
        contentSections.push(this.generateOverviewSection(problem, content));

        // Generate specific content sections based on content structure
        if (content.classification) {
            contentSections.push(this.generateClassificationSection(content));
        }

        if (content.structure || content.nucleotideStructure || content.aminoAcids) {
            contentSections.push(this.generateStructureSection(content));
        }

        if (content.functions || content.proteinFunctions || content.lipidFunctions) {
            contentSections.push(this.generateFunctionsSection(content));
        }

        if (content.metabolism || content.cellularRespiration) {
            contentSections.push(this.generateMetabolismSection(content));
        }

        if (content.enzymeKinetics) {
            contentSections.push(this.generateKineticsSection(content));
        }

        // Add comparisons if available
        if (content.comparison) {
            contentSections.push(this.generateComparisonsSection(content));
        }

        // Add examples section
        if (content.examples) {
            contentSections.push(this.generateExamplesSection(content));
        }

        // Add contextual scenarios
        if (content.contextualScenarios) {
            contentSections.push(this.generateContextualScenariosSection(content));
        }

        // Add related experiments section
        if (this.includeExperiments && content.relatedExperiments) {
            contentSections.push(this.generateRelatedExperimentsSection(content));
        }

        // Add metacognitive prompts
        if (content.metacognitivePrompts) {
            contentSections.push(this.generateMetacognitiveSection(content));
        }

        return contentSections;
    }

    generateOverviewSection(problem, content) {
        return {
            sectionType: 'overview',
            title: content.topic || problem.originalTopic,
            category: content.category,
            summary: content.summary,
            difficulty: problem.difficulty,
            prerequisites: problem.prerequisites,
            keyPoints: this.extractKeyPoints(content)
        };
    }

    generateClassificationSection(content) {
        return {
            sectionType: 'classification',
            title: 'Classification and Types',
            data: content.classification
        };
    }

    generateStructureSection(content) {
        return {
            sectionType: 'structure',
            title: 'Molecular Structure',
            data: content.structure || content.nucleotideStructure || content.aminoAcids || content.structure
        };
    }

    generateFunctionsSection(content) {
        return {
            sectionType: 'functions',
            title: 'Functions and Roles',
            data: content.functions || content.proteinFunctions || content.lipidFunctions
        };
    }

    generateMetabolismSection(content) {
        return {
            sectionType: 'metabolism',
            title: 'Metabolic Pathways',
            data: content.metabolism || content.cellularRespiration
        };
    }

    generateKineticsSection(content) {
        return {
            sectionType: 'kinetics',
            title: 'Enzyme Kinetics',
            data: content.enzymeKinetics
        };
    }

    generateComparisonsSection(content) {
        return {
            sectionType: 'comparisons',
            title: 'Comparisons and Contrasts',
            data: content.comparison
        };
    }

    generateExamplesSection(content) {
        return {
            sectionType: 'examples',
            title: 'Examples and Applications',
            examples: content.examples,
            applications: content.applications
        };
    }

    generateContextualScenariosSection(content) {
        return {
            sectionType: 'contextual_scenarios',
            title: 'Real-World Applications',
            scenarios: content.contextualScenarios
        };
    }

    generateRelatedExperimentsSection(content) {
        if (!content.relatedExperiments || content.relatedExperiments.length === 0) {
            return null;
        }

        return {
            sectionType: 'related_experiments',
            title: 'Related Experiments',
            experiments: content.relatedExperiments
        };
    }

    generateMetacognitiveSection(content) {
        return {
            sectionType: 'metacognitive',
            title: 'Learning Guidance',
            prompts: content.metacognitivePrompts
        };
    }

    extractKeyPoints(content) {
        const keyPoints = [];

        if (content.summary) keyPoints.push(content.summary);
        
        // Extract from various content structures
        if (content.classification && content.classification.bySize) {
            Object.keys(content.classification.bySize).forEach(key => {
                keyPoints.push(`${key}: ${content.classification.bySize[key].definition || ''}`);
            });
        }

        return keyPoints.slice(0, 5);
    }

    // ========================================
    // WORKBOOK GENERATION METHODS
    // ========================================

    generateMolecularWorkbook() {
        if (!this.currentContent || !this.currentProblem) return;

        const workbook = this.createWorkbookStructure();
        workbook.title = 'Molecular Biology Workbook';

        workbook.sections = [
            this.createProblemSection(),
            this.createContentOverviewSection(),
            this.createDetailedContentSection(),
            this.createComparisonsWorkbookSection(),
            this.createExamplesApplicationsSection(),
            this.createContextualScenariosWorkbookSection(),
            this.createRelatedExperimentsWorkbookSection(),
            this.createMisconceptionsSection(),
            this.createMetacognitiveWorkbookSection(),
            this.createAssessmentSection()
        ].filter(section => section !== null);

        this.currentWorkbook = workbook;
    }

    createWorkbookStructure() {
        return {
            title: 'Molecular Biology Workbook',
            timestamp: new Date().toISOString(),
            theme: this.theme,
            dimensions: { width: this.width, height: this.height },
            learnerLevel: this.learnerProfile.currentLevel,
            sections: []
        };
    }

    createProblemSection() {
        if (!this.currentProblem) return null;

        return {
            title: 'Topic Information',
            type: 'problem',
            data: [
                ['Topic Type', this.currentProblem.type],
                ['Main Topic', this.currentProblem.originalTopic],
                ['Sub-Topic', this.currentProblem.subTopic || 'General'],
                ['Category', this.molecularTopics[this.currentProblem.type]?.category || 'N/A'],
                ['Difficulty', this.currentProblem.difficulty || 'Intermediate'],
                ['Prerequisites', this.currentProblem.prerequisites ? this.currentProblem.prerequisites.join(', ') : 'None']
            ]
        };
    }

    createContentOverviewSection() {
        if (!this.currentContent) return null;

        const overviewData = [
            ['Topic', this.currentContent.topic],
            ['Category', this.currentContent.category]
        ];

        if (this.currentContent.summary) {
            overviewData.push(['Summary', this.currentContent.summary]);
        }

        return {
            title: 'Content Overview',
            type: 'overview',
            data: overviewData
        };
    }

    createDetailedContentSection() {
        if (!this.currentContent) return null;

        const contentData = [];

        // Process different content structures
        this.processContentStructure(this.currentContent, contentData);

        return contentData.length > 0 ? {
            title: 'Detailed Content',
            type: 'detailed_content',
            data: contentData
        } : null;
    }

    processContentStructure(obj, dataArray, prefix = '') {
        Object.entries(obj).forEach(([key, value]) => {
            if (key === 'topic' || key === 'category' || key === 'summary') return;

            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                dataArray.push([`${prefix}${key.toUpperCase()}`, '']);
                this.processContentStructure(value, dataArray, '  ');
            } else if (Array.isArray(value)) {
                dataArray.push([`${prefix}${key}`, '']);
                value.forEach(item => {
                    if (typeof item === 'string') {
                        dataArray.push([`${prefix}  •`, item]);
                    } else if (typeof item === 'object') {
                        Object.entries(item).forEach(([k, v]) => {
                            dataArray.push([`${prefix}  ${k}`, typeof v === 'object' ? JSON.stringify(v) : v]);
                        });
                        dataArray.push(['', '']);
                    }
                });
            } else {
                dataArray.push([`${prefix}${key}`, value]);
            }
        });
    }

    createComparisonsWorkbookSection() {
        if (!this.currentContent?.comparison) return null;

        const comparisonData = [];
        
        if (Array.isArray(this.currentContent.comparison)) {
            comparisonData.push(['Feature', 'Comparison 1', 'Comparison 2']);
            this.currentContent.comparison.forEach(comp => {
                const row = [];
                Object.values(comp).forEach(val => row.push(val));
                comparisonData.push(row);
            });
        } else {
            Object.entries(this.currentContent.comparison).forEach(([key, value]) => {
                comparisonData.push([key.toUpperCase(), '']);
                Object.entries(value).forEach(([k, v]) => {
                    comparisonData.push([`  ${k}`, typeof v === 'object' ? JSON.stringify(v) : v]);
                });
                comparisonData.push(['', '']);
            });
        }

        return {
            title: 'Comparisons',
            type: 'comparisons',
            data: comparisonData
        };
    }

    createExamplesApplicationsSection() {
        if (!this.currentContent.examples && !this.currentContent.applications) return null;

        const data = [];

        if (this.currentContent.examples) {
            data.push(['EXAMPLES', '']);
            this.currentContent.examples.forEach(example => {
                if (typeof example === 'object') {
                    Object.entries(example).forEach(([key, value]) => {
                        data.push([key, typeof value === 'object' ? JSON.stringify(value) : value]);
                    });
                    data.push(['', '']);
                }
            });
        }

        if (this.currentContent.applications) {
            data.push(['APPLICATIONS', '']);
            this.currentContent.applications.forEach(app => {
                data.push(['•', app]);
            });
        }

        return data.length > 0 ? {
            title: 'Examples and Applications',
            type: 'examples_applications',
            data: data
        } : null;
    }

    createContextualScenariosWorkbookSection() {
        if (!this.currentContent.contextualScenarios || this.currentContent.contextualScenarios.length === 0) {
            return null;
        }

        const data = [['Scenario', 'Context', 'Application']];
        
        this.currentContent.contextualScenarios.forEach(scenario => {
            data.push([
                scenario.scenario,
                scenario.context,
                scenario.application
            ]);
        });

        return {
            title: 'Real-World Scenarios',
            type: 'contextual',
            data: data
        };
    }

    createRelatedExperimentsWorkbookSection() {
        if (!this.includeExperiments || !this.currentContent.relatedExperiments) {
            return null;
        }

        const data = [['Experiment Name', 'Category', 'Scientist']];

        this.currentContent.relatedExperiments.forEach(exp => {
            data.push([
                exp.name,
                exp.category,
                exp.historicalScientist || 'Various'
            ]);
        });

        return {
            title: 'Related Experiments',
            type: 'experiments',
            data: data
        };
    }

    createMisconceptionsSection() {
        if (!this.includeCommonMisconceptions) return null;

        const misconceptions = this.commonMisconceptions[this.currentProblem.type];
        if (!misconceptions) return null;

        const data = [['Category', 'Common Misconceptions']];

        Object.entries(misconceptions).forEach(([category, miscList]) => {
            data.push([category, '']);
            miscList.forEach(misc => {
                data.push(['  •', misc]);
            });
        });

        return {
            title: 'Common Misconceptions',
            type: 'misconceptions',
            data: data
        };
    }

    createMetacognitiveWorkbookSection() {
        if (!this.metacognitiveSupport || !this.currentContent.metacognitivePrompts) {
            return null;
        }

        const data = [];

        Object.entries(this.currentContent.metacognitivePrompts).forEach(([phase, prompts]) => {
            data.push([phase.toUpperCase().replace('_', ' '), '']);
            prompts.forEach(prompt => {
                data.push(['  •', prompt]);
            });
            data.push(['', '']);
        });

        return {
            title: 'Learning Strategies',
            type: 'metacognitive',
            data: data
        };
    }

    createAssessmentSection() {
        if (!this.assessmentFeedback) return null;

        const questions = this.generateAssessmentQuestions(this.currentProblem.type);
        if (!questions || questions.length === 0) return null;

        const data = [['Level', 'Question']];

        Object.entries(questions).forEach(([level, question]) => {
            data.push([level.charAt(0).toUpperCase() + level.slice(1), question]);
        });

        return {
            title: 'Assessment Questions',
            type: 'assessment',
            data: data
        };
    }

    generateAssessmentQuestions(topicType) {
        return this.assessmentQuestions[topicType] || {};
    }

    // ========================================
    // EXPERIMENT HANDLING METHODS
    // ========================================

    handleExperimentRequest(config) {
        const { topic, parameters, experimentId } = config;

        if (experimentId && this.molecularExperiments[experimentId]) {
            this.currentExperiment = this.molecularExperiments[experimentId];
        } else {
            this.currentExperiment = this.findExperimentByTopic(topic);
        }

        if (!this.currentExperiment) {
            throw new Error(`No experiment found for: ${topic}`);
        }

        const experimentContent = this.generateExperimentContent(this.currentExperiment, parameters);
        this.generateExperimentWorkbook(experimentContent);

        return {
            experiment: this.currentExperiment,
            content: experimentContent,
            workbook: this.currentWorkbook
        };
    }

    findExperimentByTopic(topic) {
        const topicLower = topic.toLowerCase();
        
        for (const [id, exp] of Object.entries(this.molecularExperiments)) {
            if (exp.name.toLowerCase().includes(topicLower)) {
                return exp;
            }
        }

        for (const [id, exp] of Object.entries(this.molecularExperiments)) {
            if (exp.relatedTopics.some(t => topicLower.includes(t.toLowerCase()))) {
                return exp;
            }
        }

        return null;
    }

    generateExperimentContent(experiment, parameters = {}) {
        const content = {
            experimentName: experiment.name,
            category: experiment.category,
            relatedTopics: experiment.relatedTopics,
            sections: []
        };

        if (experiment.historicalBackground) {
            content.sections.push({
                type: 'historical_background',
                title: 'Historical Background',
                data: this.formatHistoricalBackground(experiment.historicalBackground)
            });
        }

        if (experiment.labExperiment) {
            content.sections.push({
                type: 'lab_experiment',
                title: 'Laboratory Experiment',
                data: this.formatLabExperiment(experiment.labExperiment)
            });
        }

        return content;
    }

    formatHistoricalBackground(background) {
        const formatted = [];

        Object.entries(background).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                formatted.push([key, '']);
                value.forEach((item, index) => {
                    if (typeof item === 'object') {
                        Object.entries(item).forEach(([k, v]) => {
                            formatted.push([`  ${k}`, v]);
                        });
                    } else {
                        formatted.push([`  ${index + 1}.`, item]);
                    }
                });
            } else if (typeof value === 'object' && value !== null) {
                formatted.push([key, '']);
                Object.entries(value).forEach(([k, v]) => {
                    formatted.push([`  ${k}`, typeof v === 'object' ? JSON.stringify(v) : v]);
                });
            } else {
                formatted.push([key, value]);
            }
        });

        return formatted;
    }

    formatLabExperiment(labExp) {
        const formatted = [];

        formatted.push(['Experiment Title', labExp.title]);
        formatted.push(['Hypothesis', labExp.hypothesis]);

        if (labExp.variables) {
            formatted.push(['', '']);
            formatted.push(['VARIABLES', '']);
            Object.entries(labExp.variables).forEach(([key, value]) => {
                formatted.push([`  ${key}`, Array.isArray(value) ? value.join(', ') : value]);
            });
        }

        if (labExp.materials) {
            formatted.push(['', '']);
            formatted.push(['MATERIALS', '']);
            labExp.materials.forEach(material => {
                formatted.push(['  •', material]);
            });
        }

        if (labExp.procedure) {
            formatted.push(['', '']);
            formatted.push(['PROCEDURE', '']);
            labExp.procedure.forEach((step, index) => {
                if (step.trim() === '') {
                    formatted.push(['', '']);
                } else if (step === step.toUpperCase() && step.includes(':')) {
                    formatted.push([step, '']);
                } else {
                    formatted.push([`  ${index + 1}.`, step]);
                }
            });
        }

        if (labExp.expectedResults || labExp.results) {
            formatted.push(['', '']);
            formatted.push(['RESULTS', '']);
            const results = labExp.expectedResults || labExp.results;
            if (typeof results === 'object' && !Array.isArray(results)) {
                Object.entries(results).forEach(([key, value]) => {
                    formatted.push([`  ${key}`, typeof value === 'object' ? JSON.stringify(value) : value]);
                });
            } else {
                formatted.push(['', results]);
            }
        }

        if (labExp.conclusion || labExp.conclusions) {
            formatted.push(['', '']);
            formatted.push(['CONCLUSION', '']);
            const conclusions = labExp.conclusion || labExp.conclusions;
            if (Array.isArray(conclusions)) {
                conclusions.forEach(c => formatted.push(['  •', c]));
            } else {
                formatted.push(['', conclusions]);
            }
        }

        if (labExp.realWorldApplications || labExp.applications) {
            formatted.push(['', '']);
            formatted.push(['APPLICATIONS', '']);
            const apps = labExp.realWorldApplications || labExp.applications;
            apps.forEach(app => formatted.push(['  •', app]));
        }

        if (labExp.safetyNotes || labExp.safetyPrecautions) {
            formatted.push(['', '']);
            formatted.push(['SAFETY NOTES', '']);
            const safety = labExp.safetyNotes || labExp.safetyPrecautions;
            safety.forEach(note => formatted.push(['  ⚠', note]));
        }

        return formatted;
    }

    generateExperimentWorkbook(experimentContent) {
        const workbook = this.createWorkbookStructure();
        workbook.title = 'Molecular Biology Experiment Workbook';

        workbook.sections = experimentContent.sections.map(section => ({
            title: section.title,
            type: section.type,
            data: section.data
        }));

        if (experimentContent.relatedTopics) {
            workbook.sections.push({
                title: 'Related Topics',
                type: 'related_topics',
                data: experimentContent.relatedTopics.map(topic => [
                    this.molecularTopics[topic]?.name || topic,
                    this.molecularTopics[topic]?.description || ''
                ])
            });
        }

        this.currentWorkbook = workbook;
    }

    getRelatedExperiments(topicType) {
        const related = [];
        
        Object.entries(this.molecularExperiments).forEach(([id, experiment]) => {
            if (experiment.relatedTopics.includes(topicType)) {
                related.push({
                    id: id,
                    name: experiment.name,
                    category: experiment.category,
                    historicalScientist: experiment.historicalBackground?.scientist,
                    labTitle: experiment.labExperiment?.title
                });
            }
        });

        return related;
    }

    // ========================================
    // UTILITY AND HELPER METHODS
    // ========================================

    getAllExperiments() {
        return Object.entries(this.molecularExperiments).map(([id, exp]) => ({
            id: id,
            name: exp.name,
            category: exp.category,
            relatedTopics: exp.relatedTopics,
            scientist: exp.historicalBackground?.scientist,
            year: exp.historicalBackground?.year
        }));
    }

    getAllTopics() {
        return Object.entries(this.molecularTopics).map(([id, topic]) => ({
            id: id,
            name: topic.name,
            category: topic.category,
            description: topic.description,
            difficulty: topic.difficulty,
            prerequisites: topic.prerequisites
        }));
    }

    resetWorkbook() {
        this.currentProblem = null;
        this.currentContent = null;
        this.contentSteps = [];
        this.currentWorkbook = null;
        this.currentExperiment = null;
    }

    getWorkbookStatus() {
        return {
            hasProblem: !!this.currentProblem,
            hasContent: !!this.currentContent,
            hasWorkbook: !!this.currentWorkbook,
            hasExperiment: !!this.currentExperiment,
            learnerLevel: this.learnerProfile.currentLevel,
            masteredTopics: this.learnerProfile.masteredTopics.length,
            strugglingTopics: this.learnerProfile.strugglingTopics.length
        };
    }

    formatMolecularTerm(term) {
        let formatted = term;
        
        Object.entries(this.molecularSymbols).forEach(([key, symbol]) => {
            const regex = new RegExp(key, 'g');
            formatted = formatted.replace(regex, symbol);
        });

        return formatted;
    }
}

// Export the class
export default EnhancedMolecularBiologyWorkbook;
