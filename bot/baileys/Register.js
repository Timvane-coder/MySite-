class AnatomicalDiagramsRegistry {
    static diagrams = {
        // ===== CELL BIOLOGY =====
        'animalCell': {
            name: 'Animal Cell',
            category: 'Cell Biology',
            description: 'Complete animal cell with all organelles',
            dataRequired: ['view', 'organelleHighlight'],
            usage: 'Best for cell biology education',
            examples: ['Cell biology', 'Organelles', 'Cellular anatomy'],
            viewOptions: ['complete', 'nucleus', 'mitochondria', 'endoplasmicReticulum', 'golgiApparatus', 'lysosome', 'ribosome'],
            organelleHighlightOptions: ['none', 'nucleus', 'mitochondria', 'er', 'golgi', 'all'],
            insets: ['atp-production', 'protein-synthesis', 'vesicle-transport'],
            defaultOptions: {
                title: 'Animal Cell Structure',
                view: 'complete',
                organelleHighlight: 'none',
                showLabels: true,
                showInset: false,
                insetType: 'atp-production',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'plantCell': {
            name: 'Plant Cell',
            category: 'Cell Biology',
            description: 'Plant cell with cell wall, chloroplasts, and large central vacuole',
            dataRequired: ['view', 'processHighlight'],
            usage: 'Best for plant cell biology education',
            examples: ['Botany', 'Plant biology', 'Cell comparison'],
            viewOptions: ['complete', 'cellWall', 'chloroplast', 'vacuole', 'plasmodesmata'],
            processHighlightOptions: ['none', 'photosynthesis', 'cellWallFormation', 'turgorPressure'],
            insets: ['photosynthesis-detail', 'cell-wall-structure', 'plasmodesmata-connection'],
            defaultOptions: {
                title: 'Plant Cell Structure',
                view: 'complete',
                processHighlight: 'none',
                showLabels: true,
                showInset: false,
                insetType: 'photosynthesis-detail',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'cellMembrane': {
            name: 'Cell Membrane (Phospholipid Bilayer)',
            category: 'Cell Biology',
            description: 'Fluid mosaic model showing phospholipids, proteins, and cholesterol',
            dataRequired: ['view', 'componentHighlight'],
            usage: 'Best for membrane structure education',
            examples: ['Cell membrane', 'Transport', 'Cellular biology'],
            viewOptions: ['fluidMosaic', 'phospholipidBilayer', 'proteins', 'transportMechanisms'],
            componentHighlightOptions: ['none', 'phospholipids', 'integralProteins', 'peripheralProteins', 'cholesterol', 'glycoproteins'],
            insets: ['active-transport', 'passive-transport', 'endocytosis', 'exocytosis'],
            defaultOptions: {
                title: 'Cell Membrane Structure',
                view: 'fluidMosaic',
                componentHighlight: 'none',
                showLabels: true,
                showInset: false,
                insetType: 'active-transport',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'mitosis': {
            name: 'Mitosis',
            category: 'Cell Biology',
            description: 'All stages of mitotic cell division',
            dataRequired: ['stage', 'detail'],
            usage: 'Best for cell division education',
            examples: ['Cell division', 'Growth', 'Reproduction'],
            stageOptions: ['complete', 'interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'],
            detailOptions: ['overview', 'chromosomes', 'spindle', 'centrosomes'],
            insets: ['chromosome-condensation', 'spindle-formation', 'checkpoint-regulation'],
            defaultOptions: {
                title: 'Mitosis - Cell Division',
                stage: 'complete',
                detail: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'chromosome-condensation',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'meiosis': {
            name: 'Meiosis',
            category: 'Cell Biology',
            description: 'Meiotic division producing four haploid gametes',
            dataRequired: ['stage', 'division'],
            usage: 'Best for sexual reproduction and genetics',
            examples: ['Gamete formation', 'Sexual reproduction', 'Genetic variation'],
            stageOptions: ['complete', 'meiosisI', 'meiosisII', 'prophaseI', 'metaphaseI', 'anaphaseI', 'telophaseI', 'prophaseII', 'metaphaseII', 'anaphaseII', 'telophaseII'],
            divisionOptions: ['both', 'reductional', 'equational'],
            insets: ['crossing-over', 'independent-assortment', 'genetic-variation'],
            defaultOptions: {
                title: 'Meiosis',
                stage: 'complete',
                division: 'both',
                showLabels: true,
                showInset: false,
                insetType: 'crossing-over',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== GENETICS & MOLECULAR BIOLOGY =====
        'dnaStructure': {
            name: 'DNA Double Helix',
            category: 'Genetics & Molecular Biology',
            description: 'DNA structure with base pairs',
            dataRequired: ['view', 'componentFocus'],
            usage: 'Best for genetics education',
            examples: ['Genetics', 'Molecular biology', 'DNA structure'],
            viewOptions: ['doubleHelix', 'basePairs', 'sugarPhosphate', 'nucleotide', 'major-minor-grooves'],
            componentFocusOptions: ['complete', 'backbone', 'bases', 'hydrogen-bonds', 'antiparallel'],
            insets: ['base-pairing-rules', 'dna-packaging', 'replication-fork'],
            defaultOptions: {
                title: 'DNA Double Helix',
                view: 'doubleHelix',
                componentFocus: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'base-pairing-rules',
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'dnaReplication': {
            name: 'DNA Replication',
            category: 'Genetics & Molecular Biology',
            description: 'Semi-conservative DNA replication process',
            dataRequired: ['stage', 'enzymeHighlight'],
            usage: 'Best for molecular biology and genetics',
            examples: ['DNA synthesis', 'Cell division prep', 'Molecular biology'],
            stageOptions: ['complete', 'initiation', 'elongation', 'termination', 'lagging-strand', 'leading-strand'],
            enzymeHighlightOptions: ['all', 'helicase', 'primase', 'dna-polymerase', 'ligase', 'topoisomerase'],
            insets: ['okazaki-fragments', 'proofreading', 'telomere-replication'],
            defaultOptions: {
                title: 'DNA Replication',
                stage: 'complete',
                enzymeHighlight: 'all',
                showLabels: true,
                showInset: false,
                insetType: 'okazaki-fragments',
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'transcription': {
            name: 'Transcription',
            category: 'Genetics & Molecular Biology',
            description: 'DNA to RNA transcription process',
            dataRequired: ['stage', 'detail'],
            usage: 'Best for gene expression education',
            examples: ['Gene expression', 'RNA synthesis', 'Molecular biology'],
            stageOptions: ['complete', 'initiation', 'elongation', 'termination', 'rna-processing'],
            detailOptions: ['overview', 'promoter', 'rna-polymerase', 'transcription-factors', 'enhancers'],
            insets: ['rna-splicing', 'capping-tailing', 'transcription-bubble'],
            defaultOptions: {
                title: 'Transcription (DNA → RNA)',
                stage: 'complete',
                detail: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'rna-splicing',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'translation': {
            name: 'Translation',
            category: 'Genetics & Molecular Biology',
            description: 'RNA to protein translation at ribosome',
            dataRequired: ['stage', 'componentFocus'],
            usage: 'Best for protein synthesis education',
            examples: ['Protein synthesis', 'Ribosomes', 'Gene expression'],
            stageOptions: ['complete', 'initiation', 'elongation', 'termination', 'ribosome-binding'],
            componentFocusOptions: ['complete', 'ribosome', 'trna', 'mrna', 'amino-acids', 'peptide-bond'],
            insets: ['codon-anticodon', 'peptide-bond-formation', 'post-translational'],
            defaultOptions: {
                title: 'Translation (RNA → Protein)',
                stage: 'complete',
                componentFocus: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'codon-anticodon',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== HUMAN ANATOMY & PHYSIOLOGY =====
        'heartAnatomy': {
            name: 'Heart Anatomy',
            category: 'Cardiovascular System',
            description: 'Complete heart structure with chambers and blood flow',
            dataRequired: ['chamber', 'view'],
            usage: 'Best for showing heart structure and chamber details',
            examples: ['Medical education', 'Patient briefings', 'Anatomy studies'],
            chamberOptions: ['wholeheart', 'rightAtrium', 'rightVentricle', 'leftAtrium', 'leftVentricle', 'septum'],
            viewOptions: ['external', 'internal', 'valves', 'vessels'],
            insets: ['cardiac-cycle', 'conduction-system', 'coronary-circulation'],
            defaultOptions: {
                title: 'Heart Anatomy',
                chamber: 'wholeheart',
                view: 'internal',
                showLabels: true,
                showBloodFlow: true,
                showInset: false,
                insetType: 'cardiac-cycle',
                animate: false,
                width: 600,
                height: 500,
                backgroundColor: '#ffffff'
            }
        },

        'respiratorySystem': {
            name: 'Respiratory System',
            category: 'Respiratory System',
            description: 'Complete respiratory tract with gas exchange',
            dataRequired: ['component', 'process'],
            usage: 'Best for showing breathing anatomy',
            examples: ['Lung function', 'Breathing education', 'Respiratory health'],
            componentOptions: ['complete', 'trachea', 'bronchi', 'bronchioles', 'leftLung', 'rightLung', 'alveoli', 'diaphragm'],
            processOptions: ['structure', 'inhalation', 'exhalation', 'gas-exchange'],
            insets: ['gas-exchange', 'alveolar-structure', 'surfactant-function', 'oxygen-hemoglobin'],
            defaultOptions: {
                title: 'Respiratory System',
                component: 'complete',
                process: 'structure',
                showLabels: true,
                showGasExchange: true,
                showInset: false,
                insetType: 'gas-exchange',
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'digestiveSystem': {
            name: 'Digestive System',
            category: 'Digestive System',
            description: 'Complete digestive tract',
            dataRequired: ['component', 'process'],
            usage: 'Best for digestion pathway',
            examples: ['Digestion', 'GI tract', 'Nutrition'],
            componentOptions: ['complete', 'mouth', 'esophagus', 'stomach', 'small-intestine', 'large-intestine', 'liver', 'pancreas', 'gallbladder'],
            processOptions: ['anatomy', 'mechanical-digestion', 'chemical-digestion', 'absorption', 'elimination'],
            insets: ['villi-structure', 'enzyme-action', 'peristalsis', 'bile-production'],
            defaultOptions: {
                title: 'Digestive System',
                component: 'complete',
                process: 'anatomy',
                showLabels: true,
                showPath: true,
                showInset: false,
                insetType: 'villi-structure',
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'nervousSystem': {
            name: 'Nervous System',
            category: 'Nervous System',
            description: 'Central and peripheral nervous system',
            dataRequired: ['component', 'division'],
            usage: 'Best for nervous system overview',
            examples: ['Brain', 'Spinal cord', 'Nerves'],
            componentOptions: ['complete', 'brain', 'spinal-cord', 'cranial-nerves', 'spinal-nerves', 'autonomic'],
            divisionOptions: ['both', 'central', 'peripheral', 'somatic', 'autonomic', 'sympathetic', 'parasympathetic'],
            insets: ['neuron-structure', 'synapse', 'reflex-arc', 'action-potential'],
            defaultOptions: {
                title: 'Nervous System',
                component: 'complete',
                division: 'both',
                showLabels: true,
                showSignal: false,
                showInset: false,
                insetType: 'neuron-structure',
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'neuronStructure': {
            name: 'Neuron Structure',
            category: 'Nervous System',
            description: 'Detailed neuron anatomy',
            dataRequired: ['component', 'state'],
            usage: 'Best for nerve cell structure',
            examples: ['Neurons', 'Synapses', 'Neural transmission'],
            componentOptions: ['complete', 'dendrites', 'soma', 'axon', 'myelin', 'terminals', 'nodes-of-ranvier'],
            stateOptions: ['resting', 'action-potential', 'refractory'],
            insets: ['action-potential', 'saltatory-conduction', 'neurotransmitter-release'],
            defaultOptions: {
                title: 'Neuron Structure',
                component: 'complete',
                state: 'resting',
                showLabels: true,
                showSignal: false,
                showInset: false,
                insetType: 'action-potential',
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'skeletalSystem': {
            name: 'Skeletal System',
            category: 'Skeletal System',
            description: 'Complete human skeleton',
            dataRequired: ['region', 'view'],
            usage: 'Best for skeletal anatomy overview',
            examples: ['Skeleton', 'Bones', 'Anatomy'],
            regionOptions: ['complete', 'axial', 'appendicular', 'skull', 'ribcage', 'spine', 'pelvis', 'upper-limb', 'lower-limb'],
            viewOptions: ['anterior', 'posterior', 'lateral', 'cross-section'],
            insets: ['bone-structure', 'joint-detail', 'bone-remodeling', 'red-marrow'],
            defaultOptions: {
                title: 'Human Skeletal System',
                region: 'complete',
                view: 'anterior',
                showLabels: true,
                showInset: false,
                insetType: 'bone-structure',
                width: 600,
                height: 900,
                backgroundColor: '#ffffff'
            }
        },

        'muscularSystem': {
            name: 'Muscular System',
            category: 'Muscular System',
            description: 'Major muscle groups',
            dataRequired: ['type', 'region'],
            usage: 'Best for muscle anatomy',
            examples: ['Muscles', 'Anatomy', 'Movement'],
            typeOptions: ['skeletal', 'cardiac', 'smooth'],
            regionOptions: ['complete', 'head-neck', 'trunk', 'upper-limb', 'lower-limb'],
            insets: ['muscle-fiber', 'sarcomere', 'neuromuscular-junction', 'sliding-filament'],
            defaultOptions: {
                title: 'Human Muscular System',
                type: 'skeletal',
                region: 'complete',
                view: 'anterior',
                showLabels: true,
                showInset: false,
                insetType: 'sarcomere',
                width: 600,
                height: 900,
                backgroundColor: '#ffffff'
            }
        },

        'urinarySystem': {
            name: 'Urinary/Excretory System',
            category: 'Urinary System',
            description: 'Kidneys and urinary tract',
            dataRequired: ['component', 'process'],
            usage: 'Best for waste removal education',
            examples: ['Kidneys', 'Urinary system', 'Excretion'],
            componentOptions: ['complete', 'kidneys', 'ureters', 'bladder', 'urethra', 'nephron'],
            processOptions: ['anatomy', 'filtration', 'reabsorption', 'secretion', 'concentration'],
            insets: ['nephron-detail', 'glomerular-filtration', 'tubular-reabsorption', 'countercurrent'],
            defaultOptions: {
                title: 'Urinary System',
                component: 'complete',
                process: 'anatomy',
                showLabels: true,
                showInset: false,
                insetType: 'nephron-detail',
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'endocrineSystem': {
            name: 'Endocrine System',
            category: 'Endocrine System',
            description: 'Hormone-producing glands',
            dataRequired: ['gland', 'hormone'],
            usage: 'Best for hormone education',
            examples: ['Hormones', 'Glands', 'Regulation'],
            glandOptions: ['complete', 'pituitary', 'thyroid', 'parathyroid', 'adrenal', 'pancreas', 'gonads', 'pineal', 'thymus'],
            hormoneOptions: ['overview', 'growth', 'metabolism', 'reproduction', 'stress', 'calcium'],
            insets: ['feedback-loop', 'hormone-action', 'receptor-binding', 'signal-cascade'],
            defaultOptions: {
                title: 'Endocrine System',
                gland: 'complete',
                hormone: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'feedback-loop',
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

      'immuneSystem': {
            name: 'Immune System',
            category: 'Immune System',
            description: 'Immune organs and cells',
            dataRequired: ['component', 'response'],
            usage: 'Best for immunity education',
            examples: ['Immunity', 'White blood cells', 'Defense'],
            componentOptions: ['complete', 'thymus', 'spleen', 'lymph-nodes', 'bone-marrow', 'lymphatic-vessels'],
            responseOptions: ['overview', 'innate', 'adaptive', 'humoral', 'cell-mediated'],
            insets: ['antibody-production', 'phagocytosis', 'antigen-presentation', 'cytotoxic-action'],
            defaultOptions: {
                title: 'Immune System',
                component: 'complete',
                response: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'antibody-production',
                width: 700,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'skinStructure': {
            name: 'Skin Layers',
            category: 'Integumentary System',
            description: 'Cross-section of skin layers',
            dataRequired: ['layer', 'structure'],
            usage: 'Best for dermatology education',
            examples: ['Skin', 'Integumentary system', 'Dermis'],
            layerOptions: ['complete', 'epidermis', 'dermis', 'hypodermis'],
            structureOptions: ['overview', 'hair-follicle', 'sweat-gland', 'sebaceous-gland', 'sensory-receptors'],
            insets: ['melanocyte-function', 'wound-healing', 'thermoregulation', 'tactile-receptor'],
            defaultOptions: {
                title: 'Skin Structure',
                layer: 'complete',
                structure: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'melanocyte-function',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'eyeAnatomy': {
            name: 'Eye Anatomy',
            category: 'Sensory Organs',
            description: 'Complete eye structure with all components',
            dataRequired: ['component', 'process'],
            usage: 'Best for ophthalmology education',
            examples: ['Vision anatomy', 'Eye structure', 'Ophthalmology'],
            componentOptions: ['complete', 'cornea', 'lens', 'retina', 'optic-nerve', 'iris', 'ciliary-body'],
            processOptions: ['structure', 'light-refraction', 'accommodation', 'phototransduction'],
            insets: ['retinal-layers', 'rod-cone-cells', 'optic-disc', 'accommodation-mechanism'],
            defaultOptions: {
                title: 'Human Eye Anatomy',
                component: 'complete',
                process: 'structure',
                showLabels: true,
                pupilDilation: 0.3,
                showInset: false,
                insetType: 'retinal-layers',
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== BOTANY =====
        'leafCrossSection': {
            name: 'Leaf Cross-Section',
            category: 'Plants (Botany)',
            description: 'Detailed leaf anatomy',
            dataRequired: ['layer', 'process'],
            usage: 'Best for photosynthesis and plant anatomy',
            examples: ['Leaf structure', 'Gas exchange', 'Photosynthesis'],
            layerOptions: ['complete', 'cuticle', 'epidermis', 'palisade', 'spongy', 'vascular'],
            processOptions: ['structure', 'photosynthesis', 'transpiration', 'gas-exchange'],
            insets: ['stomata-mechanism', 'chloroplast-detail', 'xylem-phloem', 'light-reactions'],
            defaultOptions: {
                title: 'Leaf Cross-Section',
                layer: 'complete',
                process: 'structure',
                showLabels: true,
                showInset: false,
                insetType: 'stomata-mechanism',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'photosynthesis': {
            name: 'Photosynthesis',
            category: 'Plants (Botany)',
            description: 'Photosynthesis process in chloroplast',
            dataRequired: ['stage', 'detail'],
            usage: 'Best for teaching photosynthesis mechanism',
            examples: ['Plant metabolism', 'Energy production', 'Biochemistry'],
            stageOptions: ['complete', 'light-reactions', 'calvin-cycle', 'electron-transport'],
            detailOptions: ['overview', 'chloroplast', 'thylakoid', 'stroma', 'products'],
            insets: ['z-scheme', 'calvin-cycle-detail', 'chemiosmosis', 'carbon-fixation'],
            defaultOptions: {
                title: 'Photosynthesis',
                stage: 'complete',
                detail: 'overview',
                showLabels: true,
                showEquation: true,
                showInset: false,
                insetType: 'z-scheme',
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'flowerStructure': {
            name: 'Flower Structure',
            category: 'Plants (Botany)',
            description: 'Reproductive parts of flowering plants',
            dataRequired: ['component', 'stage'],
            usage: 'Best for plant reproduction',
            examples: ['Flowers', 'Reproduction', 'Pollination'],
            componentOptions: ['complete', 'petals', 'sepals', 'stamen', 'pistil', 'ovary', 'anther'],
            stageOptions: ['mature', 'pollination', 'fertilization', 'seed-development'],
            insets: ['pollen-tube-growth', 'double-fertilization', 'embryo-development', 'pollinator-interaction'],
            defaultOptions: {
                title: 'Flower Anatomy',
                component: 'complete',
                stage: 'mature',
                showLabels: true,
                showInset: false,
                insetType: 'double-fertilization',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== ECOLOGY =====
        'foodWeb': {
            name: 'Food Web',
            category: 'Ecology',
            description: 'Complex interconnected food relationships',
            dataRequired: ['ecosystem', 'trophicLevel'],
            usage: 'Best for ecosystem complexity',
            examples: ['Food webs', 'Ecosystem interactions', 'Energy flow'],
            ecosystemOptions: ['terrestrial', 'aquatic', 'forest', 'grassland', 'marine', 'freshwater'],
            trophicLevelOptions: ['complete', 'producers', 'primary-consumers', 'secondary-consumers', 'tertiary-consumers', 'decomposers'],
            insets: ['energy-pyramid', 'biomass-transfer', 'trophic-efficiency', 'bioaccumulation'],
            defaultOptions: {
                title: 'Food Web',
                ecosystem: 'terrestrial',
                trophicLevel: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'energy-pyramid',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'carbonCycle': {
            name: 'Carbon Cycle',
            category: 'Ecology',
            description: 'Carbon movement through ecosystems',
            dataRequired: ['process', 'reservoir'],
            usage: 'Best for biogeochemical cycles',
            examples: ['Carbon cycle', 'Climate change', 'Biogeochemical cycles'],
            processOptions: ['complete', 'photosynthesis', 'respiration', 'decomposition', 'combustion', 'ocean-absorption'],
            reservoirOptions: ['all', 'atmosphere', 'biosphere', 'hydrosphere', 'geosphere', 'fossil-fuels'],
            insets: ['greenhouse-effect', 'ocean-acidification', 'carbon-sequestration', 'anthropogenic-impact'],
            defaultOptions: {
                title: 'Carbon Cycle',
                process: 'complete',
                reservoir: 'all',
                showLabels: true,
                showInset: false,
                insetType: 'greenhouse-effect',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== EVOLUTION =====
        'naturalSelection': {
            name: 'Natural Selection Process',
            category: 'Evolution & Natural Selection',
            description: 'Step-by-step natural selection mechanism',
            dataRequired: ['stage', 'example'],
            usage: 'Best for evolution education',
            examples: ['Evolution', 'Selection pressure', 'Adaptation'],
            stageOptions: ['complete', 'variation', 'selection', 'reproduction', 'adaptation'],
            exampleOptions: ['general', 'peppered-moth', 'antibiotic-resistance', 'galapagos-finches', 'giraffe-neck'],
            insets: ['mutation-source', 'fitness-concept', 'gene-pool-change', 'speciation-timeline'],
            defaultOptions: {
                title: 'Natural Selection Process',
                stage: 'complete',
                example: 'general',
                showLabels: true,
                showInset: false,
                insetType: 'fitness-concept',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== MICROBIOLOGY =====
        'bacteriaStructure': {
            name: 'Bacterial Cell',
            category: 'Microbiology',
            description: 'Prokaryotic cell structure',
            dataRequired: ['type', 'structure'],
            usage: 'Best for microbiology education',
            examples: ['Bacteria', 'Prokaryotes', 'Microbiology'],
            typeOptions: ['gram-positive', 'gram-negative', 'archaea'],
            structureOptions: ['complete', 'cell-wall', 'membrane', 'nucleoid', 'plasmids', 'flagella', 'pili'],
            insets: ['peptidoglycan-layer', 'conjugation', 'binary-fission', 'endospore-formation'],
            defaultOptions: {
                title: 'Bacterial Cell Structure',
                type: 'gram-positive',
                structure: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'peptidoglycan-layer',
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'virusStructure': {
            name: 'Virus Structure',
            category: 'Microbiology',
            description: 'Viral components and structure',
            dataRequired: ['type', 'component'],
            usage: 'Best for virology education',
            examples: ['Viruses', 'Virology', 'Infectious disease'],
            typeOptions: ['bacteriophage', 'enveloped', 'non-enveloped', 'retrovirus'],
            
             componentOptions: ['complete', 'capsid', 'envelope', 'spike-proteins', 'nucleic-acid', 'enzymes'],
            insets: ['lytic-cycle', 'lysogenic-cycle', 'viral-entry', 'replication-mechanism'],
            defaultOptions: {
                title: 'Virus Structure',
                type: 'bacteriophage',
                component: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'lytic-cycle',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== BIOTECHNOLOGY =====
        'gelElectrophoresis': {
            name: 'Gel Electrophoresis',
            category: 'Biotechnology',
            description: 'DNA separation technique and band patterns',
            dataRequired: ['stage', 'application'],
            usage: 'Best for DNA analysis techniques',
            examples: ['DNA analysis', 'Lab techniques', 'Forensics'],
            stageOptions: ['complete', 'loading', 'separation', 'visualization', 'interpretation'],
            applicationOptions: ['dna-fingerprinting', 'pcr-products', 'restriction-digest', 'rna-analysis'],
            insets: ['dna-migration', 'molecular-weight-ladder', 'band-interpretation', 'ethidium-bromide'],
            defaultOptions: {
                title: 'Gel Electrophoresis',
                stage: 'complete',
                application: 'dna-fingerprinting',
                showLabels: true,
                showBands: true,
                showInset: false,
                insetType: 'dna-migration',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'crispr': {
            name: 'CRISPR-Cas9',
            category: 'Biotechnology',
            description: 'Gene editing mechanism',
            dataRequired: ['stage', 'component'],
            usage: 'Best for modern gene editing',
            examples: ['CRISPR', 'Gene editing', 'Biotechnology'],
            stageOptions: ['complete', 'recognition', 'cleavage', 'repair', 'outcome'],
            componentOptions: ['overview', 'cas9-protein', 'guide-rna', 'pam-sequence', 'target-dna'],
            insets: ['guide-rna-design', 'double-strand-break', 'nhej-hdr', 'off-target-effects'],
            defaultOptions: {
                title: 'CRISPR-Cas9 Gene Editing',
                stage: 'complete',
                component: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'guide-rna-design',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== REPRODUCTION & DEVELOPMENT =====
        'embryoDevelopment': {
            name: 'Embryo Development',
            category: 'Reproduction & Development',
            description: 'Stages from zygote to fetus',
            dataRequired: ['stage', 'week'],
            usage: 'Best for developmental biology',
            examples: ['Embryology', 'Development', 'Pregnancy'],
            stageOptions: ['complete', 'cleavage', 'blastula', 'gastrulation', 'organogenesis', 'fetal'],
            weekOptions: ['week1', 'week2', 'week3', 'week4', 'week8', 'week12', 'trimester1', 'trimester2', 'trimester3'],
            insets: ['cell-differentiation', 'germ-layers', 'neural-tube', 'limb-development'],
            defaultOptions: {
                title: 'Embryo Development Stages',
                stage: 'complete',
                week: 'week4',
                showLabels: true,
                showInset: false,
                insetType: 'germ-layers',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'menstrualCycle': {
            name: 'Menstrual Cycle',
            category: 'Reproduction & Development',
            description: 'Hormonal cycle and uterine changes',
            dataRequired: ['phase', 'hormone'],
            usage: 'Best for reproductive physiology',
            examples: ['Menstrual cycle', 'Hormones', 'Reproduction'],
            phaseOptions: ['complete', 'menstrual', 'follicular', 'ovulation', 'luteal'],
            hormoneOptions: ['all', 'fsh', 'lh', 'estrogen', 'progesterone'],
            insets: ['hormone-feedback', 'ovarian-changes', 'endometrial-changes', 'temperature-chart'],
            defaultOptions: {
                title: 'Menstrual Cycle',
                phase: 'complete',
                hormone: 'all',
                showLabels: true,
                showHormones: true,
                showInset: false,
                insetType: 'hormone-feedback',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== HEALTH & IMMUNOLOGY =====
        'immuneResponse': {
            name: 'Immune Response',
            category: 'Health, Disease & Immunology',
            description: 'Innate and adaptive immune response flowchart',
            dataRequired: ['responseType', 'stage'],
            usage: 'Best for immunology education',
            examples: ['Immunity', 'Immune response', 'Defense'],
            responseTypeOptions: ['both', 'innate', 'adaptive', 'humoral', 'cell-mediated'],
            stageOptions: ['complete', 'recognition', 'activation', 'effector', 'memory'],
            insets: ['antibody-structure', 'complement-cascade', 'mhc-presentation', 'clonal-selection'],
            defaultOptions: {
                title: 'Immune Response',
                responseType: 'both',
                stage: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'antibody-structure',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'vaccination': {
            name: 'Vaccination Mechanism',
            category: 'Health, Disease & Immunology',
            description: 'How vaccines create immunity',
            dataRequired: ['vaccineType', 'stage'],
            usage: 'Best for vaccine education',
            examples: ['Vaccination', 'Immunization', 'Prevention'],
            vaccineTypeOptions: ['live-attenuated', 'inactivated', 'subunit', 'mrna', 'vector'],
            stageOptions: ['complete', 'administration', 'recognition', 'primary-response', 'memory-formation', 'secondary-response'],
            insets: ['memory-cell-formation', 'booster-effect', 'herd-immunity', 'adjuvant-action'],
            defaultOptions: {
                title: 'How Vaccines Work',
                vaccineType: 'inactivated',
                stage: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'memory-cell-formation',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'bloodCells': {
            name: 'Blood Cells',
            category: 'Health, Disease & Immunology',
            description: 'RBCs, WBCs, and platelets',
            dataRequired: ['cellType', 'function'],
            usage: 'Best for hematology education',
            examples: ['Blood cells', 'Hematology', 'Immune cells'],
            cellTypeOptions: ['all', 'erythrocytes', 'leukocytes', 'platelets', 'neutrophils', 'lymphocytes', 'monocytes', 'eosinophils', 'basophils'],
            functionOptions: ['structure', 'oxygen-transport', 'immune-defense', 'clotting', 'development'],
            insets: ['hemoglobin-binding', 'phagocytosis', 'clotting-cascade', 'hematopoiesis'],
            defaultOptions: {
                title: 'Blood Cell Types',
                cellType: 'all',
                function: 'structure',
                showLabels: true,
                showInset: false,
                insetType: 'hemoglobin-binding',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== HOMEOSTASIS & REGULATION =====
        'negativeFeedback': {
            name: 'Negative Feedback Loop',
            category: 'Homeostasis & Regulation',
            description: 'Self-regulating homeostatic mechanism',
            dataRequired: ['system', 'variable'],
            usage: 'Best for homeostasis education',
            examples: ['Homeostasis', 'Regulation', 'Feedback'],
            systemOptions: ['general', 'temperature', 'glucose', 'blood-pressure', 'calcium', 'thyroid'],
            variableOptions: ['overview', 'stimulus', 'sensor', 'control-center', 'effector', 'response'],
            insets: ['set-point', 'gain-calculation', 'positive-feedback-comparison', 'multiple-loops'],
            defaultOptions: {
                title: 'Negative Feedback Loop',
                system: 'general',
                variable: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'set-point',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'bloodGlucoseRegulation': {
            name: 'Blood Glucose Regulation',
            category: 'Homeostasis & Regulation',
            description: 'Insulin and glucagon balance',
            dataRequired: ['state', 'hormone'],
            usage: 'Best for diabetes education',
            examples: ['Glucose regulation', 'Diabetes', 'Hormones'],
            stateOptions: ['homeostasis', 'hyperglycemia', 'hypoglycemia', 'postprandial', 'fasting'],
            hormoneOptions: ['both', 'insulin', 'glucagon', 'cortisol', 'epinephrine'],
            insets: ['insulin-signaling', 'glut4-translocation', 'glycogenolysis', 'gluconeogenesis'],
            defaultOptions: {
                title: 'Blood Glucose Regulation',
                state: 'homeostasis',
                hormone: 'both',
                showLabels: true,
                showInset: false,
                insetType: 'insulin-signaling',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'nephron': {
            name: 'Kidney Nephron',
            category: 'Homeostasis & Regulation',
            description: 'Detailed nephron structure and function',
            dataRequired: ['component', 'process'],
            usage: 'Best for kidney function',
            examples: ['Nephron', 'Filtration', 'Kidney function'],
            componentOptions: ['complete', 'glomerulus', 'bowmans-capsule', 'proximal-tubule', 'loop-henle', 'distal-tubule', 'collecting-duct'],
            processOptions: ['structure', 'filtration', 'reabsorption', 'secretion', 'concentration'],
            insets: ['glomerular-filtration-barrier', 'countercurrent-multiplier', 'adh-action', 'juxtaglomerular'],
            defaultOptions: {
                title: 'Nephron Structure',
                component: 'complete',
                process: 'structure',
                showLabels: true,
                showInset: false,
                insetType: 'countercurrent-multiplier',
                width: 700,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        // ===== ENERGY IN LIVING SYSTEMS =====
        'cellularRespiration': {
            name: 'Cellular Respiration',
            category: 'Energy in Living Systems',
            description: 'Complete aerobic respiration pathway',
            dataRequired: ['stage', 'location'],
            usage: 'Best for energy metabolism',
            examples: ['Cellular respiration', 'Metabolism', 'Energy production'],
            stageOptions: ['complete', 'glycolysis', 'krebs-cycle', 'electron-transport', 'oxidative-phosphorylation'],
            locationOptions: ['overview', 'cytoplasm', 'mitochondrial-matrix', 'inner-membrane'],
            insets: ['atp-yield', 'chemiosmosis', 'nadh-fadh2-comparison', 'substrate-level'],
            defaultOptions: {
                title: 'Cellular Respiration',
                stage: 'complete',
                location: 'overview',
                showLabels: true,
                showStages: true,
                showInset: false,
                insetType: 'atp-yield',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'electronTransportChain': {
            name: 'Electron Transport Chain',
            category: 'Energy in Living Systems',
            description: 'ETC and chemiosmosis in mitochondria',
            dataRequired: ['complex', 'process'],
            usage: 'Best for ATP synthesis education',
            examples: ['ETC', 'Chemiosmosis', 'ATP synthesis'],
            complexOptions: ['complete', 'complex-I', 'complex-II', 'complex-III', 'complex-IV', 'atp-synthase'],
            processOptions: ['electron-flow', 'proton-pumping', 'chemiosmosis', 'atp-synthesis'],
            insets: ['proton-motive-force', 'atp-synthase-rotation', 'inhibitor-sites', 'uncoupling'],
            defaultOptions: {
                title: 'Electron Transport Chain',
                complex: 'complete',
                process: 'electron-flow',
                showLabels: true,
                showInset: false,
                insetType: 'proton-motive-force',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'photosynthesisDetailed': {
            name: 'Photosynthesis (Light & Dark Reactions)',
            category: 'Energy in Living Systems',
            description: 'Complete photosynthesis with both reaction stages',
            dataRequired: ['reaction', 'detail'],
            usage: 'Best for detailed photosynthesis',
            examples: ['Light reactions', 'Calvin cycle', 'Photosynthesis'],
            reactionOptions: ['both', 'light-dependent', 'light-independent', 'electron-transport', 'carbon-fixation'],
            detailOptions: ['overview', 'photosystems', 'atp-nadph-production', 'calvin-cycle-steps'],
            insets: ['photosystem-detail', 'rubisco-mechanism', 'c3-c4-cam', 'photorespiration'],
            defaultOptions: {
                title: 'Photosynthesis - Complete Process',
                reaction: 'both',
                detail: 'overview',
                showLabels: true,
                showBothStages: true,
                showInset: false,
                insetType: 'photosystem-detail',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== CLASSIFICATION & TAXONOMY =====
        'phylogeneticTree': {
            name: 'Phylogenetic Tree',
            category: 'Classification & Taxonomy',
            description: 'Evolutionary relationships between species',
            dataRequired: ['group', 'timeScale'],
            usage: 'Best for evolutionary relationships',
            examples: ['Evolution', 'Taxonomy', 'Common ancestry'],
            groupOptions: ['life', 'animals', 'plants', 'vertebrates', 'mammals', 'primates', 'custom'],
            timeScaleOptions: ['recent', 'millions-years', 'geological-eras'],
            insets: ['cladistics-method', 'molecular-clock', 'convergent-evolution', 'homology-analogy'],
            defaultOptions: {
                title: 'Phylogenetic Tree',
                group: 'vertebrates',
                timeScale: 'millions-years',
                showLabels: true,
                showInset: false,
                insetType: 'cladistics-method',
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },
      // ===== REMAINING DIAGRAMS IN REGISTRY =====

        'circulatorySystem': {
            name: 'Circulatory System',
            category: 'Cardiovascular System',
            description: 'Complete blood circulation pathway through body',
            dataRequired: ['circuit', 'component'],
            usage: 'Best for showing systemic and pulmonary circulation',
            examples: ['Blood flow education', 'Circulatory teaching', 'Medical diagrams'],
            circuitOptions: ['complete', 'systemic', 'pulmonary', 'coronary', 'portal'],
            componentOptions: ['overview', 'heart', 'arteries', 'veins', 'capillaries'],
            insets: ['capillary-exchange', 'blood-pressure-flow', 'valve-function', 'vascular-resistance'],
            defaultOptions: {
                title: 'Circulatory System',
                circuit: 'complete',
                component: 'overview',
                showLabels: true,
                showOxygenation: true,
                showInset: false,
                insetType: 'capillary-exchange',
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'bloodVesselComparison': {
            name: 'Blood Vessel Comparison',
            category: 'Cardiovascular System',
            description: 'Comparison of arteries, veins, and capillaries',
            dataRequired: ['vesselType', 'layer'],
            usage: 'Best for comparing vessel structures',
            examples: ['Vessel anatomy', 'Blood transport', 'Vascular system'],
            vesselTypeOptions: ['all', 'artery', 'vein', 'capillary', 'arteriole', 'venule'],
            layerOptions: ['complete', 'tunica-intima', 'tunica-media', 'tunica-externa', 'endothelium'],
            insets: ['pressure-gradient', 'elastic-recoil', 'venous-return', 'capillary-bed'],
            defaultOptions: {
                title: 'Blood Vessel Comparison',
                vesselType: 'all',
                layer: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'pressure-gradient',
                width: 700,
                height: 400,
                backgroundColor: '#ffffff'
            }
        },

        'heartValves': {
            name: 'Heart Valves',
            category: 'Cardiovascular System',
            description: 'All four heart valves showing structure and function',
            dataRequired: ['valve', 'state'],
            usage: 'Best for showing valve anatomy and operation',
            examples: ['Valve disorders', 'Cardiac anatomy', 'Heart function'],
            valveOptions: ['all', 'tricuspid', 'pulmonary', 'mitral', 'aortic'],
            stateOptions: ['both', 'open', 'closed', 'dysfunction'],
            insets: ['valve-mechanism', 'chordae-tendineae', 'papillary-muscles', 'stenosis-regurgitation'],
            defaultOptions: {
                title: 'Heart Valves',
                valve: 'all',
                state: 'both',
                showLabels: true,
                showInset: false,
                insetType: 'valve-mechanism',
                width: 800,
                height: 500,
                backgroundColor: '#ffffff'
            }
        },

        'digestiveOrgans': {
            name: 'Digestive Organs',
            category: 'Digestive System',
            description: 'Individual digestive organs with functions',
            dataRequired: ['organ', 'function'],
            usage: 'Best for comparing digestive organ structures',
            examples: ['Organ functions', 'Digestive process', 'Anatomy education'],
            organOptions: ['all', 'stomach', 'liver', 'pancreas', 'small-intestine', 'large-intestine', 'gallbladder'],
            functionOptions: ['structure', 'secretion', 'absorption', 'motility'],
            insets: ['gastric-glands', 'hepatocyte-function', 'pancreatic-enzymes', 'intestinal-motility'],
            defaultOptions: {
                title: 'Digestive Organs',
                organ: 'all',
                function: 'structure',
                showLabels: true,
                showInset: false,
                insetType: 'gastric-glands',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'completeDigestiveSystem': {
            name: 'Complete Digestive System',
            category: 'Digestive System',
            description: 'Entire digestive tract with accessory organs',
            dataRequired: ['region', 'process'],
            usage: 'Best for digestion pathway',
            examples: ['Digestion', 'GI tract', 'Nutrition'],
            regionOptions: ['complete', 'upper-gi', 'lower-gi', 'accessory-organs'],
            processOptions: ['anatomy', 'ingestion', 'digestion', 'absorption', 'elimination'],
            insets: ['enzyme-breakdown', 'nutrient-absorption', 'microbiome', 'enteric-nervous'],
            defaultOptions: {
                title: 'Complete Digestive System',
                region: 'complete',
                process: 'anatomy',
                showLabels: true,
                showPath: true,
                showInset: false,
                insetType: 'enzyme-breakdown',
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'completeNervousSystem': {
            name: 'Complete Nervous System',
            category: 'Nervous System',
            description: 'CNS and PNS with neural pathways',
            dataRequired: ['system', 'pathway'],
            usage: 'Best for nervous system overview',
            examples: ['Brain', 'Spinal cord', 'Nerves'],
            systemOptions: ['complete', 'cns', 'pns', 'somatic', 'autonomic'],
            pathwayOptions: ['overview', 'sensory', 'motor', 'reflex', 'autonomic'],
            insets: ['gray-white-matter', 'dorsal-ventral-roots', 'sympathetic-chain', 'cranial-nerves'],
            defaultOptions: {
                title: 'Complete Nervous System',
                system: 'complete',
                pathway: 'overview',
                showLabels: true,
                showSignal: false,
                showInset: false,
                insetType: 'gray-white-matter',
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'synapse': {
            name: 'Synapse',
            category: 'Nervous System',
            description: 'Synaptic transmission between neurons',
            dataRequired: ['type', 'stage'],
            usage: 'Best for neural communication',
            examples: ['Synapse', 'Neurotransmitters', 'Neural signaling'],
            typeOptions: ['chemical', 'electrical', 'neuromuscular'],
            stageOptions: ['resting', 'depolarization', 'vesicle-release', 'receptor-binding', 'termination'],
            insets: ['vesicle-cycle', 'receptor-types', 'reuptake-degradation', 'summation'],
            defaultOptions: {
                title: 'Synaptic Transmission',
                type: 'chemical',
                stage: 'vesicle-release',
                showLabels: true,
                showInset: false,
                insetType: 'vesicle-cycle',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'brain': {
            name: 'Brain Structure',
            category: 'Nervous System',
            description: 'Brain anatomy with major regions',
            dataRequired: ['region', 'section'],
            usage: 'Best for neuroanatomy',
            examples: ['Brain anatomy', 'Neuroscience', 'CNS'],
            regionOptions: ['whole', 'cerebrum', 'cerebellum', 'brainstem', 'limbic', 'lobes'],
            sectionOptions: ['external', 'sagittal', 'coronal', 'horizontal'],
            insets: ['cortical-layers', 'basal-ganglia', 'ventricles', 'blood-brain-barrier'],
            defaultOptions: {
                title: 'Brain Structure',
                region: 'whole',
                section: 'sagittal',
                showLabels: true,
                showInset: false,
                insetType: 'cortical-layers',
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'reproductiveSystem': {
            name: 'Reproductive System',
            category: 'Reproductive System',
            description: 'Male and female reproductive anatomy',
            dataRequired: ['sex', 'component'],
            usage: 'Best for reproductive anatomy',
            examples: ['Reproduction', 'Anatomy', 'Development'],
            sexOptions: ['both', 'male', 'female'],
            componentOptions: ['complete', 'gonads', 'ducts', 'accessory-glands', 'external-genitalia'],
            insets: ['spermatogenesis', 'oogenesis', 'fertilization', 'hormone-regulation'],
            defaultOptions: {
                title: 'Reproductive System',
                sex: 'both',
                component: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'spermatogenesis',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'liver': {
            name: 'Liver',
            category: 'Digestive System',
            description: 'Liver structure and lobes',
            dataRequired: ['view', 'function'],
            usage: 'Best for hepatic anatomy',
            examples: ['Liver anatomy', 'Digestive system', 'Metabolism'],
            viewOptions: ['anterior', 'posterior', 'inferior', 'lobule'],
            functionOptions: ['anatomy', 'bile-production', 'metabolism', 'detoxification', 'storage'],
            insets: ['hepatic-lobule', 'portal-triad', 'bile-canaliculi', 'sinusoids'],
            defaultOptions: {
                title: 'Liver Anatomy',
                view: 'anterior',
                function: 'anatomy',
                showLabels: true,
                showInset: false,
                insetType: 'hepatic-lobule',
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'kidney': {
            name: 'Kidney Structure',
            category: 'Urinary System',
            description: 'Kidney anatomy with internal structures',
            dataRequired: ['view', 'region'],
            usage: 'Best for renal anatomy',
            examples: ['Kidney structure', 'Urinary system', 'Filtration'],
            viewOptions: ['external', 'coronal-section', 'nephron'],
            regionOptions: ['complete', 'cortex', 'medulla', 'pelvis', 'vasculature'],
            insets: ['nephron-types', 'renal-corpuscle', 'vasa-recta', 'juxtaglomerular'],
            defaultOptions: {
                title: 'Kidney Anatomy',
                view: 'coronal-section',
                region: 'complete',
                side: 'left',
                showLabels: true,
                showInset: false,
                insetType: 'nephron-types',
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'kidneyDetail': {
            name: 'Kidney Internal Structure',
            category: 'Urinary System',
            description: 'Detailed kidney anatomy with nephron',
            dataRequired: ['structure', 'process'],
            usage: 'Best for renal physiology',
            examples: ['Kidney function', 'Filtration process', 'Nephron anatomy'],
            structureOptions: ['complete', 'cortex-medulla', 'renal-columns', 'calyces', 'blood-supply'],
            processOptions: ['anatomy', 'filtration', 'concentration', 'regulation'],
            insets: ['glomerular-barrier', 'tubular-transport', 'renin-angiotensin', 'acid-base'],
            defaultOptions: {
                title: 'Kidney Internal Structure',
                structure: 'complete',
                process: 'anatomy',
                showLabels: true,
                showInset: false,
                insetType: 'glomerular-barrier',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'skull': {
            name: 'Human Skull',
            category: 'Skeletal System',
            description: 'Skull anatomy with cranium and facial bones',
            dataRequired: ['view', 'bone'],
            usage: 'Best for cranial anatomy education',
            examples: ['Skull anatomy', 'Cranial structure', 'Head bones'],
            viewOptions: ['anterior', 'lateral', 'superior', 'inferior', 'sagittal'],
            boneOptions: ['all', 'cranial', 'facial', 'individual'],
            insets: ['sutures', 'foramina', 'sinuses', 'temporomandibular-joint'],
            defaultOptions: {
                title: 'Human Skull',
                view: 'anterior',
                bone: 'all',
                showLabels: true,
                showInset: false,
                insetType: 'sutures',
                width: 500,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'femur': {
            name: 'Femur',
            category: 'Skeletal System',
            description: 'Thigh bone structure and features',
            dataRequired: ['view', 'region'],
            usage: 'Best for long bone anatomy',
            examples: ['Bone structure', 'Orthopedics', 'Skeletal anatomy'],
            viewOptions: ['anterior', 'posterior', 'medial', 'lateral', 'cross-section'],
            regionOptions: ['complete', 'proximal', 'shaft', 'distal'],
            insets: ['bone-marrow', 'growth-plate', 'muscle-attachments', 'blood-supply'],
            defaultOptions: {
                title: 'Femur (Thigh Bone)',
                view: 'anterior',
                region: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'bone-marrow',
                width: 400,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'ribcage': {
            name: 'Ribcage',
            category: 'Skeletal System',
            description: 'Thoracic cage with ribs and sternum',
            dataRequired: ['view', 'component'],
            usage: 'Best for thoracic anatomy',
            examples: ['Chest structure', 'Rib anatomy', 'Thoracic cage'],
            viewOptions: ['anterior', 'posterior', 'lateral', 'superior'],
            componentOptions: ['complete', 'sternum', 'ribs', 'costal-cartilage', 'thoracic-vertebrae'],
            insets: ['rib-types', 'breathing-mechanics', 'intercostal-muscles', 'thoracic-cavity'],
            defaultOptions: {
                title: 'Ribcage',
                view: 'anterior',
                component: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'rib-types',
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'spine': {
            name: 'Vertebral Column',
            category: 'Skeletal System',
            description: 'Spine with vertebrae and spinal cord',
            dataRequired: ['view', 'region'],
            usage: 'Best for spinal anatomy',
            examples: ['Back pain education', 'Spinal structure', 'Vertebrae'],
            viewOptions: ['lateral', 'anterior', 'posterior', 'vertebra-detail'],
            regionOptions: ['complete', 'cervical', 'thoracic', 'lumbar', 'sacral', 'coccygeal'],
            insets: ['vertebra-anatomy', 'intervertebral-disc', 'spinal-nerves', 'curvatures'],
            defaultOptions: {
                title: 'Vertebral Column',
                view: 'lateral',
                region: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'vertebra-anatomy',
                width: 400,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'boneStructure': {
            name: 'Bone Structure',
            category: 'Skeletal System',
            description: 'Cross-section showing internal bone anatomy',
            dataRequired: ['boneType', 'tissue'],
            usage: 'Best for showing bone composition',
            examples: ['Bone health', 'Osteoporosis education', 'Bone anatomy'],
            boneTypeOptions: ['long-bone', 'flat-bone', 'irregular', 'sesamoid'],
            tissueOptions: ['complete', 'compact', 'spongy', 'periosteum', 'endosteum', 'marrow'],
            insets: ['haversian-system', 'bone-cells', 'remodeling-cycle', 'calcium-homeostasis'],
            defaultOptions: {
                title: 'Bone Structure (Cross-Section)',
                boneType: 'long-bone',
                tissue: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'haversian-system',
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'skeletalMuscle': {
            name: 'Skeletal Muscle',
            category: 'Muscular System',
            description: 'Voluntary muscle structure with fibers',
            dataRequired: ['level', 'component'],
            usage: 'Best for muscle anatomy education',
            examples: ['Muscle structure', 'Exercise physiology', 'Athletic training'],
            levelOptions: ['complete', 'muscle', 'fascicle', 'fiber', 'myofibril', 'sarcomere'],
            componentOptions: ['overview', 'connective-tissue', 'blood-supply', 'innervation'],
            insets: ['fiber-types', 'motor-unit', 'energy-systems', 'hypertrophy'],
            defaultOptions: {
                title: 'Skeletal Muscle',
                level: 'complete',
                component: 'overview',
                type: 'skeletal',
                showLabels: true,
                showInset: false,
                insetType: 'fiber-types',
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'muscleContraction': {
            name: 'Muscle Contraction',
            category: 'Muscular System',
            description: 'Sliding filament model of muscle contraction',
            dataRequired: ['state', 'mechanism'],
            usage: 'Best for showing muscle mechanics',
            examples: ['Exercise science', 'Physiology', 'Muscle function'],
            stateOptions: ['relaxed', 'contracted', 'comparison', 'cycle'],
            mechanismOptions: ['sliding-filament', 'cross-bridge', 'excitation-contraction', 'energy'],
            insets: ['calcium-release', 'troponin-tropomyosin', 'atp-hydrolysis', 'length-tension'],
            defaultOptions: {
                title: 'Muscle Contraction (Sliding Filament)',
                state: 'comparison',
                mechanism: 'sliding-filament',
                showLabels: true,
                showInset: false,
                insetType: 'calcium-release',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },
      'cellStructure': {
            name: 'Animal Cell',
            category: 'Cellular & Microscopic',
            description: 'Complete cell with organelles',
            dataRequired: ['view', 'organelleHighlight'],
            usage: 'Best for cell biology education',
            examples: ['Cell biology', 'Organelles', 'Cellular anatomy'],
            viewOptions: ['complete', 'membrane', 'nucleus', 'cytoplasm', 'cytoskeleton'],
            organelleHighlightOptions: ['none', 'nucleus', 'mitochondria', 'er', 'golgi', 'lysosomes', 'all'],
            insets: ['cell-cycle', 'membrane-transport', 'protein-trafficking', 'cell-signaling'],
            defaultOptions: {
                title: 'Animal Cell Structure',
                view: 'complete',
                organelleHighlight: 'none',
                type: 'generic',
                showLabels: true,
                showInset: false,
                insetType: 'cell-cycle',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== ADDITIONAL ECOLOGY DIAGRAMS =====
        'foodChain': {
            name: 'Food Chain',
            category: 'Ecology',
            description: 'Simple food chain showing energy flow',
            dataRequired: ['ecosystem', 'length'],
            usage: 'Best for basic ecology education',
            examples: ['Energy flow', 'Trophic levels', 'Ecosystems'],
            ecosystemOptions: ['terrestrial', 'aquatic', 'marine', 'forest'],
            lengthOptions: ['simple', 'extended', 'detrital'],
            insets: ['energy-transfer', '10-percent-rule', 'biomagnification', 'decomposer-role'],
            defaultOptions: {
                title: 'Food Chain',
                ecosystem: 'terrestrial',
                length: 'simple',
                showLabels: true,
                showInset: false,
                insetType: 'energy-transfer',
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'energyPyramid': {
            name: 'Energy Pyramid',
            category: 'Ecology',
            description: 'Trophic pyramid showing 10% energy transfer rule',
            dataRequired: ['type', 'ecosystem'],
            usage: 'Best for energy transfer in ecosystems',
            examples: ['Trophic levels', 'Energy efficiency', 'Biomass'],
            typeOptions: ['energy', 'biomass', 'numbers'],
            ecosystemOptions: ['general', 'grassland', 'aquatic', 'forest'],
            insets: ['energy-loss', 'inverted-pyramids', 'productivity', 'trophic-efficiency'],
            defaultOptions: {
                title: 'Energy Pyramid',
                type: 'energy',
                ecosystem: 'general',
                showLabels: true,
                showInset: false,
                insetType: 'energy-loss',
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'nitrogenCycle': {
            name: 'Nitrogen Cycle',
            category: 'Ecology',
            description: 'Nitrogen fixation and cycling',
            dataRequired: ['process', 'organism'],
            usage: 'Best for nutrient cycles',
            examples: ['Nitrogen cycle', 'Nutrient cycling', 'Bacteria'],
            processOptions: ['complete', 'fixation', 'nitrification', 'assimilation', 'denitrification'],
            organismOptions: ['all', 'bacteria', 'plants', 'animals', 'decomposers'],
            insets: ['nitrogen-fixing-bacteria', 'root-nodules', 'atmospheric-return', 'human-impact'],
            defaultOptions: {
                title: 'Nitrogen Cycle',
                process: 'complete',
                organism: 'all',
                showLabels: true,
                showInset: false,
                insetType: 'nitrogen-fixing-bacteria',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'waterCycle': {
            name: 'Water Cycle',
            category: 'Ecology',
            description: 'Hydrological cycle',
            dataRequired: ['process', 'scale'],
            usage: 'Best for water movement education',
            examples: ['Water cycle', 'Precipitation', 'Evaporation'],
            processOptions: ['complete', 'evaporation', 'condensation', 'precipitation', 'infiltration', 'runoff'],
            scaleOptions: ['global', 'regional', 'local', 'watershed'],
            insets: ['phase-changes', 'groundwater-flow', 'transpiration', 'residence-times'],
            defaultOptions: {
                title: 'Water Cycle',
                process: 'complete',
                scale: 'global',
                showLabels: true,
                showInset: false,
                insetType: 'phase-changes',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'populationGrowth': {
            name: 'Population Growth Curves',
            category: 'Ecology',
            description: 'Exponential and logistic growth curves',
            dataRequired: ['curveType', 'phase'],
            usage: 'Best for population dynamics',
            examples: ['Population growth', 'Carrying capacity', 'Ecology'],
            curveTypeOptions: ['both', 'exponential', 'logistic'],
            phaseOptions: ['complete', 'lag', 'exponential', 'transition', 'plateau'],
            insets: ['limiting-factors', 'carrying-capacity', 'r-K-selection', 'overshoot-collapse'],
            defaultOptions: {
                title: 'Population Growth Curves',
                curveType: 'both',
                phase: 'complete',
                showBoth: true,
                showLabels: true,
                showInset: false,
                insetType: 'limiting-factors',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'ecosystem': {
            name: 'Ecosystem Diagram',
            category: 'Ecology',
            description: 'Biotic and abiotic components of ecosystem',
            dataRequired: ['ecosystemType', 'component'],
            usage: 'Best for ecosystem structure',
            examples: ['Ecosystems', 'Biotic factors', 'Abiotic factors'],
            ecosystemTypeOptions: ['forest', 'aquatic', 'grassland', 'desert', 'tundra', 'marine'],
            componentOptions: ['complete', 'biotic', 'abiotic', 'producers', 'consumers', 'decomposers'],
            insets: ['nutrient-cycling', 'succession', 'niche-concept', 'keystone-species'],
            defaultOptions: {
                title: 'Ecosystem Components',
                ecosystemType: 'forest',
                component: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'nutrient-cycling',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'biomes': {
            name: 'World Biomes',
            category: 'Ecology',
            description: 'Distribution of major biomes',
            dataRequired: ['biome', 'characteristic'],
            usage: 'Best for global ecology',
            examples: ['Biomes', 'Climate', 'Biodiversity'],
            biomeOptions: ['all', 'tropical-rainforest', 'desert', 'tundra', 'taiga', 'temperate-forest', 'grassland', 'savanna'],
            characteristicOptions: ['distribution', 'climate', 'vegetation', 'animals', 'precipitation-temp'],
            insets: ['climate-diagram', 'adaptation-examples', 'biome-threats', 'whittaker-diagram'],
            defaultOptions: {
                title: 'World Biomes Distribution',
                biome: 'all',
                characteristic: 'distribution',
                showLabels: true,
                showInset: false,
                insetType: 'climate-diagram',
                width: 1000,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'predatorPrey': {
            name: 'Predator-Prey Graph',
            category: 'Ecology',
            description: 'Lotka-Volterra predator-prey dynamics',
            dataRequired: ['display', 'phase'],
            usage: 'Best for population interactions',
            examples: ['Population dynamics', 'Predation', 'Ecology'],
            displayOptions: ['time-series', 'phase-plot', 'both'],
            phaseOptions: ['complete', 'increasing-prey', 'increasing-predator', 'decreasing-prey', 'decreasing-predator'],
            insets: ['lotka-volterra-equations', 'lag-time', 'cycle-factors', 'real-examples'],
            defaultOptions: {
                title: 'Predator-Prey Dynamics',
                display: 'time-series',
                phase: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'lag-time',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== EVOLUTION DIAGRAMS =====
        'darwinsFinches': {
            name: "Darwin's Finches",
            category: 'Evolution & Natural Selection',
            description: 'Beak adaptations in Galapagos finches',
            dataRequired: ['species', 'adaptation'],
            usage: 'Best for natural selection examples',
            examples: ['Natural selection', 'Adaptation', 'Evolution'],
            speciesOptions: ['all', 'ground-finch', 'tree-finch', 'warbler-finch', 'vegetarian-finch'],
            adaptationOptions: ['beak-shape', 'beak-size', 'food-source', 'habitat'],
            insets: ['directional-selection', 'adaptive-radiation', 'character-displacement', 'allopatric-speciation'],
            defaultOptions: {
                title: "Darwin's Finches - Beak Adaptations",
                species: 'all',
                adaptation: 'beak-shape',
                showLabels: true,
                showInset: false,
                insetType: 'directional-selection',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'adaptiveRadiation': {
            name: 'Adaptive Radiation',
            category: 'Evolution & Natural Selection',
            description: 'Divergent evolution from common ancestor',
            dataRequired: ['example', 'timescale'],
            usage: 'Best for speciation education',
            examples: ['Speciation', 'Divergent evolution', 'Biodiversity'],
            exampleOptions: ['general', 'galapagos-finches', 'hawaiian-honeycreepers', 'cichlid-fish', 'marsupials'],
            timescaleOptions: ['rapid', 'gradual', 'geological'],
            insets: ['founder-effect', 'ecological-opportunity', 'key-innovation', 'extinction-role'],
            defaultOptions: {
                title: 'Adaptive Radiation',
                example: 'general',
                timescale: 'gradual',
                showLabels: true,
                showInset: false,
                insetType: 'ecological-opportunity',
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'fossilLayers': {
            name: 'Fossil Layers (Stratigraphy)',
            category: 'Evolution & Natural Selection',
            description: 'Geological time and fossil record',
            dataRequired: ['era', 'layer'],
            usage: 'Best for fossil evidence of evolution',
            examples: ['Fossils', 'Geological time', 'Evolution evidence'],
            eraOptions: ['complete', 'cenozoic', 'mesozoic', 'paleozoic', 'precambrian'],
            layerOptions: ['all', 'specific-period', 'transition-fossils', 'index-fossils'],
            insets: ['radiometric-dating', 'law-superposition', 'transitional-forms', 'mass-extinctions'],
            defaultOptions: {
                title: 'Fossil Layers',
                era: 'complete',
                layer: 'all',
                showLabels: true,
                showInset: false,
                insetType: 'radiometric-dating',
                width: 700,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'hardyWeinberg': {
            name: 'Hardy-Weinberg Equilibrium',
            category: 'Evolution & Natural Selection',
            description: 'Population genetics equilibrium graph',
            dataRequired: ['display', 'condition'],
            usage: 'Best for population genetics',
            examples: ['Population genetics', 'Allele frequency', 'Evolution'],
            displayOptions: ['graph', 'equation', 'both', 'chi-square'],
            conditionOptions: ['equilibrium', 'mutation', 'migration', 'selection', 'drift', 'non-random-mating'],
            insets: ['five-conditions', 'allele-frequency-calc', 'microevolution', 'real-populations'],
            defaultOptions: {
                title: 'Hardy-Weinberg Equilibrium',
                display: 'both',
                condition: 'equilibrium',
                showLabels: true,
                showInset: false,
                insetType: 'five-conditions',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'speciation': {
            name: 'Speciation',
            category: 'Evolution & Natural Selection',
            description: 'Formation of new species (allopatric, sympatric)',
            dataRequired: ['speciationType', 'stage'],
            usage: 'Best for speciation mechanisms',
            examples: ['Speciation', 'Reproductive isolation', 'Evolution'],
            speciationTypeOptions: ['allopatric', 'sympatric', 'parapatric', 'peripatric'],
            stageOptions: ['complete', 'barrier-formation', 'divergence', 'reproductive-isolation', 'separate-species'],
            insets: ['reproductive-barriers', 'hybrid-zones', 'polyploidy', 'behavioral-isolation'],
            defaultOptions: {
                title: 'Speciation Mechanisms',
                speciationType: 'allopatric',
                stage: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'reproductive-barriers',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'comparativeAnatomy': {
            name: 'Comparative Anatomy',
            category: 'Evolution & Natural Selection',
            description: 'Homologous and analogous structures',
            dataRequired: ['structureType', 'example'],
            usage: 'Best for anatomical evidence of evolution',
            examples: ['Homologous structures', 'Analogous structures', 'Evolution'],
            structureTypeOptions: ['homologous', 'analogous', 'vestigial', 'both'],
            exampleOptions: ['vertebrate-limbs', 'bird-bat-wings', 'whale-flipper', 'human-vestigial'],
            insets: ['divergent-convergent', 'common-ancestry', 'embryological-evidence', 'molecular-homology'],
            defaultOptions: {
                title: 'Comparative Anatomy',
                structureType: 'homologous',
                example: 'vertebrate-limbs',
                showLabels: true,
                showInset: false,
                insetType: 'common-ancestry',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== BOTANY DIAGRAMS =====
        'stomata': {
            name: 'Stomata Structure',
            category: 'Plants (Botany)',
            description: 'Guard cells and stomatal pore',
            dataRequired: ['state', 'view'],
            usage: 'Best for gas exchange in plants',
            examples: ['Stomata', 'Transpiration', 'Gas exchange'],
            stateOptions: ['both', 'open', 'closed'],
            viewOptions: ['surface', 'cross-section', 'mechanism'],
            insets: ['turgor-pressure', 'ion-movement', 'environmental-control', 'cam-plants'],
            defaultOptions: {
                title: 'Stomata Structure',
                state: 'both',
                view: 'cross-section',
                showLabels: true,
                showInset: false,
                insetType: 'turgor-pressure',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'xylemPhloem': {
            name: 'Xylem & Phloem',
            category: 'Plants (Botany)',
            description: 'Vascular tissue structure and function',
            dataRequired: ['tissue', 'transport'],
            usage: 'Best for plant transport systems',
            examples: ['Vascular tissue', 'Transport', 'Plant anatomy'],
            tissueOptions: ['both', 'xylem', 'phloem'],
            transportOptions: ['structure', 'water-movement', 'sugar-movement', 'pressure-flow'],
            insets: ['cohesion-tension', 'transpiration-pull', 'source-sink', 'loading-unloading'],
            defaultOptions: {
                title: 'Xylem & Phloem - Vascular Tissue',
                tissue: 'both',
                transport: 'structure',
                showLabels: true,
                showInset: false,
                insetType: 'cohesion-tension',
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'seedGermination': {
            name: 'Seed Germination',
            category: 'Plants (Botany)',
            description: 'Stages of seed sprouting and growth',
            dataRequired: ['stage', 'seedType'],
            usage: 'Best for plant development',
            examples: ['Germination', 'Plant growth', 'Development'],
            stageOptions: ['complete', 'imbibition', 'activation', 'radicle-emergence', 'shoot-emergence', 'seedling'],
            seedTypeOptions: ['dicot', 'monocot', 'epigeal', 'hypogeal'],
            insets: ['dormancy-breaking', 'hormone-role', 'metabolic-changes', 'environmental-cues'],
            defaultOptions: {
                title: 'Seed Germination Stages',
                stage: 'complete',
                seedType: 'dicot',
                showLabels: true,
                showInset: false,
                insetType: 'hormone-role',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'tropisms': {
            name: 'Plant Tropisms',
            category: 'Plants (Botany)',
            description: 'Phototropism, geotropism, thigmotropism',
            dataRequired: ['tropismType', 'mechanism'],
            usage: 'Best for plant responses to stimuli',
            examples: ['Tropisms', 'Plant behavior', 'Growth responses'],
            tropismTypeOptions: ['all', 'phototropism', 'gravitropism', 'thigmotropism', 'hydrotropism'],
            mechanismOptions: ['response', 'auxin-distribution', 'cell-elongation', 'signal-transduction'],
            insets: ['auxin-mechanism', 'statoliths', 'differential-growth', 'darwin-experiments'],
            defaultOptions: {
                title: 'Plant Tropisms',
                tropismType: 'all',
                mechanism: 'response',
                tropismTypes: ['phototropism', 'geotropism', 'thigmotropism'],
                showLabels: true,
                showInset: false,
                insetType: 'auxin-mechanism',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== MICROBIOLOGY DIAGRAMS =====
        'fungalCell': {
            name: 'Fungal Cell Structure',
            category: 'Microbiology',
            description: 'Fungal cell with chitin wall and hyphae',
            dataRequired: ['structure', 'form'],
            usage: 'Best for mycology education',
            examples: ['Fungi', 'Mycology', 'Cell structure'],
            structureOptions: ['cell', 'hyphae', 'mycelium', 'fruiting-body'],
            formOptions: ['yeast', 'mold', 'mushroom', 'dimorphic'],
            insets: ['chitin-wall', 'septate-aseptate', 'spore-formation', 'nutrient-absorption'],
            defaultOptions: {
                title: 'Fungal Cell Structure',
                structure: 'cell',
                form: 'mold',
                showLabels: true,
                showHyphae: true,
                showInset: false,
                insetType: 'chitin-wall',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'protists': {
            name: 'Protist Examples',
            category: 'Microbiology',
            description: 'Various protist organisms (amoeba, paramecium, euglena)',
            dataRequired: ['protistType', 'feature'],
            usage: 'Best for protist diversity',
            examples: ['Protists', 'Microorganisms', 'Diversity'],
            protistTypeOptions: ['all', 'amoeba', 'paramecium', 'euglena', 'volvox', 'diatom', 'plasmodium'],
            featureOptions: ['structure', 'movement', 'nutrition', 'reproduction'],
            insets: ['pseudopodia-action', 'cilia-beating', 'flagella-motion', 'contractile-vacuole'],
            defaultOptions: {
                title: 'Protist Diversity',
                protistType: 'all',
                feature: 'structure',
                protistTypes: ['amoeba', 'paramecium', 'euglena'],
                showLabels: true,
                showInset: false,
                insetType: 'pseudopodia-action',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'bacterialGrowthCurve': {
            name: 'Bacterial Growth Curve',
            category: 'Microbiology',
            description: 'Lag, log, stationary, death phases',
            dataRequired: ['phase', 'scale'],
            usage: 'Best for microbial growth dynamics',
            examples: ['Bacterial growth', 'Microbiology', 'Population dynamics'],
            phaseOptions: ['complete', 'lag', 'exponential', 'stationary', 'death'],
            scaleOptions: ['linear', 'logarithmic'],
            insets: ['generation-time', 'batch-vs-continuous', 'limiting-factors', 'viable-count'],
            defaultOptions: {
                title: 'Bacterial Growth Curve',
                phase: 'complete',
                scale: 'logarithmic',
                showLabels: true,
                showInset: false,
                insetType: 'generation-time',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'viralReplication': {
            name: 'Viral Replication Cycles',
            category: 'Microbiology',
            description: 'Lytic and lysogenic cycles',
            dataRequired: ['cycleType', 'stage'],
            usage: 'Best for viral life cycles',
            examples: ['Viral replication', 'Lytic cycle', 'Lysogenic cycle'],
            cycleTypeOptions: ['both', 'lytic', 'lysogenic', 'retroviral'],
            stageOptions: ['complete', 'attachment', 'entry', 'replication', 'assembly', 'release'],
            insets: ['temperate-phage', 'prophage-integration', 'viral-enzymes', 'host-damage'],
            defaultOptions: {
                title: 'Viral Replication Cycles',
                cycleType: 'both',
                stage: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'prophage-integration',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'microscopy': {
            name: 'Microscopy Types',
            category: 'Microbiology',
            description: 'Light microscope vs electron microscope',
            dataRequired: ['type', 'component'],
            usage: 'Best for microscopy education',
            examples: ['Microscopy', 'Lab techniques', 'Visualization'],
            typeOptions: ['comparison', 'light', 'electron', 'fluorescence', 'confocal'],
            componentOptions: ['complete', 'light-path', 'lenses', 'specimen-prep', 'resolution'],
            insets: ['resolution-limits', 'magnification-calc', 'staining-methods', 'sample-preparation'],
            defaultOptions: {
                title: 'Microscopy Comparison',
                type: 'comparison',
                component: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'resolution-limits',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== BIOTECHNOLOGY DIAGRAMS =====
        'geneticEngineering': {
            name: 'Genetic Engineering',
            category: 'Biotechnology',
            description: 'Gene insertion and modification process',
            dataRequired: ['stage', 'method'],
            usage: 'Best for biotechnology overview',
            examples: ['Genetic engineering', 'GMOs', 'Biotechnology'],
            stageOptions: ['complete', 'isolation', 'insertion', 'transformation', 'selection', 'expression'],
            methodOptions: ['plasmid-vector', 'viral-vector', 'gene-gun', 'electroporation'],
            insets: ['restriction-enzymes', 'recombinant-plasmid', 'antibiotic-selection', 'reporter-genes'],
            defaultOptions: {
                title: 'Genetic Engineering Process',
                stage: 'complete',
                method: 'plasmid-vector',
                showLabels: true,
                showInset: false,
                insetType: 'restriction-enzymes',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'cloning': {
            name: 'Cloning Process',
            category: 'Biotechnology',
            description: 'Steps in organismal cloning',
            dataRequired: ['cloningType', 'stage'],
            usage: 'Best for cloning technology',
            examples: ['Cloning', 'Biotechnology', 'Reproduction'],
            cloningTypeOptions: ['organismal', 'gene', 'therapeutic', 'reproductive'],
            stageOptions: ['complete', 'donor-cell', 'enucleation', 'fusion', 'development', 'birth'],
            insets: ['scnt-process', 'embryonic-stem-cells', 'ethical-considerations', 'success-rates'],
            defaultOptions: {
                title: 'Cloning Steps',
                cloningType: 'organismal',
                stage: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'scnt-process',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'bioreactor': {
            name: 'Bioreactor',
            category: 'Biotechnology',
            description: 'Industrial biotechnology vessel',
            dataRequired: ['type', 'component'],
            usage: 'Best for industrial biotechnology',
            examples: ['Bioreactor', 'Fermentation', 'Industrial biology'],
            typeOptions: ['stirred-tank', 'airlift', 'packed-bed', 'hollow-fiber'],
            componentOptions: ['complete', 'vessel', 'agitation', 'aeration', 'control-systems', 'monitoring'],
            insets: ['batch-vs-continuous', 'sterilization', 'downstream-processing', 'scale-up'],
            defaultOptions: {
                title: 'Bioreactor System',
                type: 'stirred-tank',
                component: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'batch-vs-continuous',
                width: 700,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'gmoProduction': {
            name: 'GMO Production',
            category: 'Biotechnology',
            description: 'Creating genetically modified organisms',
            dataRequired: ['organism', 'trait'],
            usage: 'Best for GMO education',
            examples: ['GMOs', 'Agricultural biotechnology', 'Genetic modification'],
            organismOptions: ['plant', 'animal', 'bacteria', 'yeast'],
            traitOptions: ['overview', 'herbicide-resistance', 'pest-resistance', 'nutrient-enhancement', 'pharmaceutical'],
            insets: ['agrobacterium-method', 'bt-toxin', 'golden-rice', 'regulatory-approval'],
            defaultOptions: {
                title: 'GMO Production Process',
                organism: 'plant',
                trait: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'agrobacterium-method',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== REPRODUCTION & DEVELOPMENT =====
        'fertilization': {
            name: 'Fertilization',
            category: 'Reproduction & Development',
            description: 'Sperm-egg fusion process',
            dataRequired: ['stage', 'detail'],
            usage: 'Best for reproduction education',
            examples: ['Fertilization', 'Conception', 'Reproduction'],
            stageOptions: ['complete', 'sperm-approach', 'acrosome-reaction', 'membrane-fusion', 'pronuclei-fusion'],
            detailOptions: ['overview', 'zona-pellucida', 'cortical-reaction', 'blocks-to-polyspermy'],
            insets: ['acrosome-enzymes', 'calcium-wave', 'polyspermy-prevention', 'activation-events'],
            defaultOptions: {
                title: 'Fertilization Process',
                stage: 'complete',
                detail: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'acrosome-enzymes',
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },
        'gametogenesis': {
            name: 'Gametogenesis',
            category: 'Reproduction & Development',
            description: 'Spermatogenesis and oogenesis',
            dataRequired: ['type', 'stage'],
            usage: 'Best for gamete formation',
            examples: ['Gametogenesis', 'Meiosis', 'Reproduction'],
            typeOptions: ['both', 'spermatogenesis', 'oogenesis'],
            stageOptions: ['complete', 'mitosis', 'meiosis-I', 'meiosis-II', 'maturation'],
            insets: ['hormone-regulation', 'polar-bodies', 'acrosome-formation', 'differences-comparison'],
            defaultOptions: {
                title: 'Gametogenesis',
                type: 'both',
                stage: 'complete',
                showBoth: true,
                showLabels: true,
                showInset: false,
                insetType: 'hormone-regulation',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'placenta': {
            name: 'Placenta & Fetal Development',
            category: 'Reproduction & Development',
            description: 'Placental structure and maternal-fetal exchange',
            dataRequired: ['component', 'function'],
            usage: 'Best for pregnancy education',
            examples: ['Placenta', 'Pregnancy', 'Fetal development'],
            componentOptions: ['complete', 'maternal-side', 'fetal-side', 'umbilical-cord', 'chorionic-villi'],
            functionOptions: ['structure', 'gas-exchange', 'nutrient-transfer', 'waste-removal', 'hormone-production'],
            insets: ['placental-barrier', 'circulation-pattern', 'hormone-functions', 'immunological-protection'],
            defaultOptions: {
                title: 'Placenta Structure',
                component: 'complete',
                function: 'structure',
                showLabels: true,
                showInset: false,
                insetType: 'placental-barrier',
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== HEALTH & IMMUNOLOGY =====
        'antibodyStructure': {
            name: 'Antibody Structure',
            category: 'Health, Disease & Immunology',
            description: 'Y-shaped antibody with binding sites',
            dataRequired: ['region', 'type'],
            usage: 'Best for antibody education',
            examples: ['Antibodies', 'Immunity', 'Proteins'],
            regionOptions: ['complete', 'variable-region', 'constant-region', 'fab', 'fc', 'antigen-binding'],
            typeOptions: ['IgG', 'IgM', 'IgA', 'IgE', 'IgD'],
            insets: ['antigen-binding', 'class-switching', 'complement-activation', 'opsonization'],
            defaultOptions: {
                title: 'Antibody (Immunoglobulin) Structure',
                region: 'complete',
                type: 'IgG',
                showLabels: true,
                showInset: false,
                insetType: 'antigen-binding',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'pathogenTypes': {
            name: 'Pathogen Types',
            category: 'Health, Disease & Immunology',
            description: 'Bacteria, viruses, fungi, parasites comparison',
            dataRequired: ['pathogen', 'characteristic'],
            usage: 'Best for infectious disease education',
            examples: ['Pathogens', 'Infectious disease', 'Microbiology'],
            pathogenOptions: ['all', 'bacteria', 'viruses', 'fungi', 'protozoa', 'helminths', 'prions'],
            characteristicOptions: ['structure', 'size', 'reproduction', 'treatment', 'examples'],
            insets: ['koch-postulates', 'antibiotic-resistance', 'antiviral-mechanisms', 'emerging-diseases'],
            defaultOptions: {
                title: 'Types of Pathogens',
                pathogen: 'all',
                characteristic: 'structure',
                showLabels: true,
                showInset: false,
                insetType: 'koch-postulates',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'inflammation': {
            name: 'Inflammation Pathway',
            category: 'Health, Disease & Immunology',
            description: 'Steps in inflammatory response',
            dataRequired: ['stage', 'type'],
            usage: 'Best for immune response education',
            examples: ['Inflammation', 'Innate immunity', 'Healing'],
            stageOptions: ['complete', 'tissue-damage', 'chemical-signals', 'vasodilation', 'phagocyte-recruitment', 'tissue-repair'],
            typeOptions: ['acute', 'chronic', 'localized', 'systemic'],
            insets: ['inflammatory-mediators', 'fever-mechanism', 'resolution', 'chronic-consequences'],
            defaultOptions: {
                title: 'Inflammatory Response',
                stage: 'complete',
                type: 'acute',
                showLabels: true,
                showInset: false,
                insetType: 'inflammatory-mediators',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'diseaseTransmission': {
            name: 'Disease Transmission Cycles',
            category: 'Health, Disease & Immunology',
            description: 'Vector-borne disease transmission (e.g., mosquito-human)',
            dataRequired: ['diseaseType', 'stage'],
            usage: 'Best for epidemiology education',
            examples: ['Disease transmission', 'Vectors', 'Epidemiology'],
            diseaseTypeOptions: ['malaria', 'dengue', 'lyme', 'zika', 'plague', 'typhus'],
            stageOptions: ['complete', 'infection', 'incubation', 'transmission', 'vector-acquisition'],
            insets: ['vector-control', 'reservoir-hosts', 'break-cycle', 'epidemic-curves'],
            defaultOptions: {
                title: 'Disease Transmission Cycle',
                diseaseType: 'malaria',
                stage: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'vector-control',
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== CLASSIFICATION & TAXONOMY =====
        'fiveKingdoms': {
            name: 'Five Kingdom System',
            category: 'Classification & Taxonomy',
            description: 'Monera, Protista, Fungi, Plantae, Animalia',
            dataRequired: ['kingdom', 'characteristic'],
            usage: 'Best for biological classification',
            examples: ['Classification', 'Taxonomy', 'Kingdoms'],
            kingdomOptions: ['all', 'monera', 'protista', 'fungi', 'plantae', 'animalia'],
            characteristicOptions: ['overview', 'cell-type', 'nutrition', 'organization', 'examples'],
            insets: ['historical-development', 'limitations', 'exceptions', 'modern-revisions'],
            defaultOptions: {
                title: 'Five Kingdom Classification',
                kingdom: 'all',
                characteristic: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'historical-development',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'threeDomains': {
            name: 'Three Domain System',
            category: 'Classification & Taxonomy',
            description: 'Bacteria, Archaea, Eukarya',
            dataRequired: ['domain', 'basis'],
            usage: 'Best for modern classification',
            examples: ['Domains', 'Taxonomy', 'Evolution'],
            domainOptions: ['all', 'bacteria', 'archaea', 'eukarya'],
            basisOptions: ['molecular', 'ribosomal-rna', 'membrane-lipids', 'cell-wall', 'phylogenetic'],
            insets: ['rrna-sequencing', 'archaeal-uniqueness', 'endosymbiosis', 'tree-of-life'],
            defaultOptions: {
                title: 'Three Domain System',
                domain: 'all',
                basis: 'molecular',
                showLabels: true,
                showInset: false,
                insetType: 'rrna-sequencing',
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'taxonomyHierarchy': {
            name: 'Taxonomy Hierarchy',
            category: 'Classification & Taxonomy',
            description: 'Kingdom to species classification levels',
            dataRequired: ['level', 'example'],
            usage: 'Best for taxonomic ranks',
            examples: ['Taxonomy', 'Classification', 'Hierarchy'],
            levelOptions: ['complete', 'domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'],
            exampleOptions: ['human', 'dog', 'oak-tree', 'e-coli', 'custom'],
            insets: ['binomial-nomenclature', 'taxonomic-keys', 'classification-rules', 'infraspecific-ranks'],
            defaultOptions: {
                title: 'Taxonomic Hierarchy',
                level: 'complete',
                example: 'human',
                showExample: true,
                showLabels: true,
                showInset: false,
                insetType: 'binomial-nomenclature',
                width: 700,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'dichotomousKey': {
            name: 'Dichotomous Key',
            category: 'Classification & Taxonomy',
            description: 'Branching identification tool',
            dataRequired: ['keyType', 'complexity'],
            usage: 'Best for species identification',
            examples: ['Identification', 'Classification', 'Keys'],
            keyTypeOptions: ['leaves', 'insects', 'shells', 'birds', 'general'],
            complexityOptions: ['simple', 'moderate', 'complex'],
            insets: ['how-to-use', 'key-construction', 'couplet-writing', 'limitations'],
            defaultOptions: {
                title: 'Dichotomous Key Example',
                keyType: 'leaves',
                complexity: 'moderate',
                showLabels: true,
                showInset: false,
                insetType: 'how-to-use',
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'cladogram': {
            name: 'Cladogram',
            category: 'Classification & Taxonomy',
            description: 'Evolutionary relationships diagram',
            dataRequired: ['group', 'trait'],
            usage: 'Best for phylogenetic relationships',
            examples: ['Cladistics', 'Evolution', 'Phylogeny'],
            groupOptions: ['vertebrates', 'primates', 'plants', 'insects', 'custom'],
            traitOptions: ['morphological', 'molecular', 'both'],
            insets: ['synapomorphies', 'outgroup', 'parsimony', 'reading-cladograms'],
            defaultOptions: {
                title: 'Cladogram',
                group: 'vertebrates',
                trait: 'morphological',
                showLabels: true,
                showInset: false,
                insetType: 'synapomorphies',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== HOMEOSTASIS & REGULATION =====
        'thermoregulation': {
            name: 'Thermoregulation',
            category: 'Homeostasis & Regulation',
            description: 'Body temperature regulation mechanisms',
            dataRequired: ['state', 'mechanism'],
            usage: 'Best for temperature regulation',
            examples: ['Temperature control', 'Homeostasis', 'Physiology'],
            stateOptions: ['homeostasis', 'hypothermia', 'hyperthermia', 'fever'],
            mechanismOptions: ['complete', 'heat-production', 'heat-loss', 'neural-control', 'behavioral'],
            insets: ['hypothalamus-role', 'sweating-mechanism', 'shivering-thermogenesis', 'set-point-adjustment'],
            defaultOptions: {
                title: 'Thermoregulation',
                state: 'homeostasis',
                mechanism: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'hypothalamus-role',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'waterBalance': {
            name: 'Water Balance (Osmoregulation)',
            category: 'Homeostasis & Regulation',
            description: 'Kidney regulation of water and salt',
            dataRequired: ['state', 'hormone'],
            usage: 'Best for osmoregulation education',
            examples: ['Osmoregulation', 'Kidneys', 'Water balance'],
            stateOptions: ['normal', 'dehydration', 'overhydration', 'salt-imbalance'],
            hormoneOptions: ['complete', 'adh', 'aldosterone', 'anp', 'renin-angiotensin'],
            insets: ['adh-mechanism', 'thirst-response', 'aquaporins', 'diabetes-insipidus'],
            defaultOptions: {
                title: 'Water Balance Regulation',
                state: 'normal',
                hormone: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'adh-mechanism',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== ENERGY IN LIVING SYSTEMS =====
        'atpStructure': {
            name: 'ATP Structure',
            category: 'Energy in Living Systems',
            description: 'Adenosine triphosphate molecular structure',
            dataRequired: ['view', 'process'],
            usage: 'Best for cellular energy education',
            examples: ['ATP', 'Energy', 'Biochemistry'],
            viewOptions: ['structure', 'hydrolysis', 'synthesis', 'cycle'],
            processOptions: ['static', 'energy-release', 'energy-storage', 'coupled-reactions'],
            insets: ['phosphate-bonds', 'atp-adp-cycle', 'energy-currency', 'cellular-work'],
            defaultOptions: {
                title: 'ATP (Adenosine Triphosphate) Structure',
                view: 'structure',
                process: 'static',
                showLabels: true,
                showHydrolysis: true,
                showInset: false,
                insetType: 'phosphate-bonds',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'mitochondrion': {
            name: 'Mitochondrion Structure',
            category: 'Energy in Living Systems',
            description: 'Detailed mitochondrial anatomy',
            dataRequired: ['view', 'component'],
            usage: 'Best for cellular energy organelles',
            examples: ['Mitochondria', 'Cell respiration', 'Organelles'],
            viewOptions: ['complete', 'outer-membrane', 'inner-membrane', 'matrix', 'cristae'],
            componentOptions: ['structure', 'function', 'dna', 'ribosomes', 'proteins'],
            insets: ['endosymbiotic-theory', 'maternal-inheritance', 'atp-synthase-location', 'mitochondrial-diseases'],
            defaultOptions: {
                title: 'Mitochondrion Structure',
                view: 'complete',
                component: 'structure',
                showLabels: true,
                showInset: false,
                insetType: 'endosymbiotic-theory',
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'chloroplastStructure': {
            name: 'Chloroplast Structure',
            category: 'Energy in Living Systems',
            description: 'Chloroplast anatomy with thylakoids',
            dataRequired: ['view', 'component'],
            usage: 'Best for photosynthesis organelle',
            examples: ['Chloroplast', 'Photosynthesis', 'Plant cells'],
            viewOptions: ['complete', 'outer-membrane', 'thylakoid', 'stroma', 'grana'],
            componentOptions: ['structure', 'photosystems', 'starch-grains', 'dna-ribosomes'],
            insets: ['thylakoid-membrane', 'chlorophyll-arrangement', 'endosymbiosis', 'c3-c4-anatomy'],
            defaultOptions: {
                title: 'Chloroplast Structure',
                view: 'complete',
                component: 'structure',
                showLabels: true,
                showInset: false,
                insetType: 'thylakoid-membrane',
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== DNA TECHNOLOGY & FORENSICS =====
        'dnaFingerprinting': {
            name: 'DNA Fingerprinting',
            category: 'DNA Technology & Forensics',
            description: 'DNA profile patterns for identification',
            dataRequired: ['method', 'application'],
            usage: 'Best for forensic science',
            examples: ['DNA fingerprinting', 'Forensics', 'Identification'],
            methodOptions: ['rflp', 'str', 'vntr', 'comparison'],
            applicationOptions: ['forensics', 'paternity', 'identification', 'database-matching'],
            insets: ['str-analysis', 'codis-system', 'probability-matching', 'sample-collection'],
            defaultOptions: {
                title: 'DNA Fingerprinting',
                method: 'str',
                application: 'forensics',
                showLabels: true,
                showComparison: true,
                showInset: false,
                insetType: 'str-analysis',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'gelElectrophoresisForensic': {
            name: 'Gel Electrophoresis (Forensic)',
            category: 'DNA Technology & Forensics',
            description: 'Gel electrophoresis for DNA comparison',
            dataRequired: ['sample', 'interpretation'],
            usage: 'Best for forensic DNA analysis',
            examples: ['Forensics', 'DNA analysis', 'Electrophoresis'],
            sampleOptions: ['crime-scene', 'suspects', 'victim', 'all'],
            interpretationOptions: ['bands', 'matching', 'exclusion', 'statistics'],
            insets: ['reading-results', 'contamination-issues', 'chain-of-custody', 'expert-testimony'],
            defaultOptions: {
                title: 'Forensic Gel Electrophoresis',
                sample: 'all',
                interpretation: 'matching',
                showLabels: true,
                showSamples: true,
                showInset: false,
                insetType: 'reading-results',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'strAnalysis': {
            name: 'STR Analysis',
            category: 'DNA Technology & Forensics',
            description: 'Short tandem repeat analysis for identification',
            dataRequired: ['locus', 'profile'],
            usage: 'Best for DNA profiling',
            examples: ['STR analysis', 'DNA profiling', 'Forensics'],
            locusOptions: ['single', 'multiple', 'codis-13', 'codis-20'],
            profileOptions: ['electropherogram', 'allele-calls', 'comparison', 'statistics'],
            insets: ['str-biology', 'allele-frequency', 'match-probability', 'mixtures'],
            defaultOptions: {
                title: 'STR (Short Tandem Repeat) Analysis',
                locus: 'multiple',
                profile: 'electropherogram',
                showLabels: true,
                showInset: false,
                insetType: 'str-biology',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'forensicComparison': {
            name: 'Forensic DNA Comparison',
            category: 'DNA Technology & Forensics',
            description: 'Comparing suspect and crime scene DNA',
            dataRequired: ['evidence', 'outcome'],
            usage: 'Best for forensic matching',
            examples: ['Forensic comparison', 'DNA matching', 'Criminal justice'],
            evidenceOptions: ['single-source', 'mixture', 'degraded', 'touch-dna'],
            outcomeOptions: ['match', 'exclusion', 'inconclusive', 'partial'],
            insets: ['likelihood-ratio', 'random-match-probability', 'database-search', 'familial-searching'],
            defaultOptions: {
                title: 'Forensic DNA Comparison',
                evidence: 'single-source',
                outcome: 'match',
                showLabels: true,
                showInset: false,
                insetType: 'likelihood-ratio',
                width: 900,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== ADDITIONAL CELL BIOLOGY =====
        'prokaryoticVsEukaryotic': {
            name: 'Prokaryotic vs Eukaryotic Cell',
            category: 'Cell Biology',
            description: 'Side-by-side comparison of prokaryotic and eukaryotic cells',
            dataRequired: ['view', 'feature'],
            usage: 'Best for comparing cell types',
            examples: ['Cell types', 'Evolution', 'Microbiology'],
            viewOptions: ['side-by-side', 'prokaryotic', 'eukaryotic'],
            featureOptions: ['complete', 'nucleus', 'organelles', 'dna', 'size', 'complexity'],
            insets: ['evolutionary-timeline', 'size-comparison', 'dna-organization', 'ribosomes'],
            defaultOptions: {
                title: 'Prokaryotic vs Eukaryotic Cells',
                view: 'side-by-side',
                feature: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'evolutionary-timeline',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'osmosisDiffusion': {
            name: 'Osmosis & Diffusion',
            category: 'Cell Biology',
            description: 'Passive transport mechanisms across membranes',
            dataRequired: ['process', 'scenario'],
            usage: 'Best for transport mechanisms',
            examples: ['Passive transport', 'Osmosis', 'Diffusion'],
            processOptions: ['both', 'osmosis', 'diffusion', 'facilitated-diffusion'],
            scenarioOptions: ['isotonic', 'hypertonic', 'hypotonic', 'concentration-gradient'],
            insets: ['water-potential', 'plasmolysis', 'turgor-pressure', 'equilibrium'],
            defaultOptions: {
                title: 'Osmosis & Diffusion',
                process: 'both',
                scenario: 'isotonic',
                showLabels: true,
                showInset: false,
                insetType: 'water-potential',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'activePassiveTransport': {
            name: 'Active vs Passive Transport',
            category: 'Cell Biology',
            description: 'Comparison of transport mechanisms requiring and not requiring energy',
            dataRequired: ['transportType', 'example'],
            usage: 'Best for cellular transport education',
            examples: ['Cell transport', 'Membrane function', 'ATP usage'],
            transportTypeOptions: ['comparison', 'passive', 'active', 'bulk'],
            exampleOptions: ['general', 'sodium-potassium-pump', 'glucose-transport', 'endocytosis'],
            insets: ['energy-requirement', 'protein-carriers', 'gradient-direction', 'specificity'],
            defaultOptions: {
                title: 'Active vs Passive Transport',
                transportType: 'comparison',
                example: 'general',
                showLabels: true,
                showInset: false,
                insetType: 'energy-requirement',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'organelles': {
            name: 'Cell Organelles',
            category: 'Cell Biology',
            description: 'Individual organelles with detailed structures',
            dataRequired: ['organelleType', 'detail'],
            usage: 'Best for detailed organelle study',
            examples: ['Organelle function', 'Cell components', 'Cellular biology'],
            organelleTypeOptions: ['nucleus', 'mitochondria', 'ribosome', 'endoplasmicReticulum', 'golgiApparatus', 'lysosome', 'peroxisome', 'centrosome', 'vacuole'],
            detailOptions: ['structure', 'function', 'ultrastructure', 'pathways'],
            insets: ['nuclear-pores', 'cristae-detail', 'protein-synthesis', 'vesicle-trafficking'],
            defaultOptions: {
                title: 'Cell Organelles',
                organelleType: 'mitochondria',
                detail: 'structure',
                showLabels: true,
                showInset: false,
                insetType: 'cristae-detail',
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'cellCycle': {
            name: 'Cell Cycle',
            category: 'Cell Biology',
            description: 'Complete cell cycle with G1, S, G2, and M phases',
            dataRequired: ['phase', 'regulation'],
            usage: 'Best for cell division regulation',
            examples: ['Cell growth', 'Cell division', 'Cancer biology'],
            phaseOptions: ['complete', 'interphase', 'G1', 'S', 'G2', 'M', 'G0'],
            regulationOptions: ['overview', 'checkpoints', 'cyclins-cdks', 'growth-factors'],
            insets: ['checkpoint-control', 'cyclin-levels', 'cancer-mutations', 'apoptosis'],
            defaultOptions: {
                title: 'Cell Cycle',
                phase: 'complete',
                regulation: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'checkpoint-control',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'enzymeAction': {
            name: 'Enzyme Action',
            category: 'Cell Biology',
            description: 'Lock-and-key and induced fit models of enzyme action',
            dataRequired: ['model', 'stage'],
            usage: 'Best for enzyme mechanism education',
            examples: ['Enzyme kinetics', 'Biochemistry', 'Metabolism'],
            modelOptions: ['both', 'lockAndKey', 'inducedFit'],
            stageOptions: ['complete', 'substrate-binding', 'transition-state', 'product-release'],
            insets: ['active-site', 'activation-energy', 'enzyme-inhibition', 'cofactors'],
            defaultOptions: {
                title: 'Enzyme Action Mechanism',
                model: 'both',
                stage: 'complete',
                showLabels: true,
                showInset: false,
                insetType: 'active-site',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== GENETICS & MOLECULAR BIOLOGY (continued) =====
        'rnaStructure': {
            name: 'RNA Structure',
            category: 'Genetics & Molecular Biology',
            description: 'RNA single strand with different types (mRNA, tRNA, rRNA)',
            dataRequired: ['rnaType', 'feature'],
            usage: 'Best for RNA education',
            examples: ['Molecular biology', 'Gene expression', 'Protein synthesis'],
            rnaTypeOptions: ['mRNA', 'tRNA', 'rRNA', 'comparison'],
            featureOptions: ['structure', 'modifications', 'function', 'processing'],
            insets: ['rna-bases', 'secondary-structure', 'wobble-pairing', 'ribozymes'],
            defaultOptions: {
                title: 'RNA Structure',
                rnaType: 'mRNA',
                feature: 'structure',
                showLabels: true,
                showInset: false,
                insetType: 'rna-bases',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'codonChart': {
            name: 'Genetic Code (Codon Chart)',
            category: 'Genetics & Molecular Biology',
            description: 'Complete genetic code showing all 64 codons',
            dataRequired: ['display', 'feature'],
            usage: 'Best for understanding genetic code',
            examples: ['Genetics', 'Protein synthesis', 'Molecular biology'],
            displayOptions: ['circular', 'table', 'wheel'],
            featureOptions: ['standard', 'start-codons', 'stop-codons', 'degeneracy', 'wobble'],
            insets: ['universal-code', 'mutations-effect', 'wobble-hypothesis', 'codon-bias'],
            defaultOptions: {
                title: 'Genetic Code - Codon Chart',
                display: 'table',
                feature: 'standard',
                showLabels: true,
                showInset: false,
                insetType: 'universal-code',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'geneExpression': {
            name: 'Gene Expression Pathway',
            category: 'Genetics & Molecular Biology',
            description: 'Complete pathway from DNA to protein',
            dataRequired: ['stage', 'regulation'],
            usage: 'Best for central dogma education',
            examples: ['Gene expression', 'Central dogma', 'Molecular biology'],
            stageOptions: ['complete', 'transcription', 'rna-processing', 'translation', 'post-translational'],
            regulationOptions: ['overview', 'transcriptional', 'post-transcriptional', 'translational', 'epigenetic'],
            insets: ['central-dogma', 'gene-regulation', 'alternative-splicing', 'protein-modifications'],
            defaultOptions: {
                title: 'Gene Expression Pathway',
                stage: 'complete',
                regulation: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'central-dogma',
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },
        'punnettSquare': {
            name: 'Punnett Square',
            category: 'Genetics & Molecular Biology',
            description: 'Genetic cross prediction tool',
            dataRequired: ['crossType', 'trait'],
            usage: 'Best for genetics problems',
            examples: ['Mendelian genetics', 'Inheritance', 'Probability'],
            crossTypeOptions: ['monohybrid', 'dihybrid', 'test-cross', 'incomplete-dominance', 'codominance'],
            traitOptions: ['simple', 'flower-color', 'seed-shape', 'blood-type', 'custom'],
            insets: ['genotype-phenotype', 'probability-rules', 'chi-square-test', 'pedigree-analysis'],
            defaultOptions: {
                title: 'Punnett Square',
                crossType: 'monohybrid',
                trait: 'simple',
                showLabels: true,
                showInset: false,
                insetType: 'genotype-phenotype',
                width: 600,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'chromosomes': {
            name: 'Chromosome Structure',
            category: 'Genetics & Molecular Biology',
            description: 'Chromosome anatomy and homologous pairs',
            dataRequired: ['view', 'stage'],
            usage: 'Best for genetics and cell division',
            examples: ['Chromosomes', 'Karyotypes', 'Genetics'],
            viewOptions: ['single', 'homologous-pair', 'karyotype', 'banding'],
            stageOptions: ['metaphase', 'interphase', 'condensation-levels'],
            insets: ['chromatin-packaging', 'centromere-telomere', 'sex-chromosomes', 'chromosomal-aberrations'],
            defaultOptions: {
                title: 'Chromosome Structure',
                view: 'single',
                stage: 'metaphase',
                showHomologousPairs: true,
                showLabels: true,
                showInset: false,
                insetType: 'chromatin-packaging',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'crossingOver': {
            name: 'Crossing Over',
            category: 'Genetics & Molecular Biology',
            description: 'Genetic recombination during meiosis',
            dataRequired: ['stage', 'detail'],
            usage: 'Best for genetic variation education',
            examples: ['Meiosis', 'Genetic variation', 'Recombination'],
            stageOptions: ['complete', 'synapsis', 'chiasma-formation', 'recombination', 'separation'],
            detailOptions: ['overview', 'molecular-mechanism', 'frequency', 'mapping'],
            insets: ['synaptonemal-complex', 'holliday-junction', 'genetic-mapping', 'linkage-analysis'],
            defaultOptions: {
                title: 'Crossing Over (Recombination)',
                stage: 'complete',
                detail: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'synaptonemal-complex',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'mutations': {
            name: 'DNA Mutations',
            category: 'Genetics & Molecular Biology',
            description: 'Types of mutations: point, frameshift, etc.',
            dataRequired: ['mutationType', 'effect'],
            usage: 'Best for mutation education',
            examples: ['Mutations', 'Genetic disorders', 'Evolution'],
            mutationTypeOptions: ['all', 'point', 'frameshift', 'insertion', 'deletion', 'substitution', 'chromosomal'],
            effectOptions: ['overview', 'silent', 'missense', 'nonsense', 'protein-effect'],
            insets: ['mutation-causes', 'repair-mechanisms', 'sickle-cell-example', 'cancer-mutations'],
            defaultOptions: {
                title: 'DNA Mutations',
                mutationType: 'all',
                effect: 'overview',
                mutationTypes: ['point', 'frameshift', 'insertion', 'deletion'],
                showLabels: true,
                showInset: false,
                insetType: 'mutation-causes',
                width: 900,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'recombinantDNA': {
            name: 'Recombinant DNA Technology',
            category: 'Genetics & Molecular Biology',
            description: 'Gene splicing and recombinant DNA creation',
            dataRequired: ['stage', 'application'],
            usage: 'Best for biotechnology education',
            examples: ['Genetic engineering', 'Biotechnology', 'GMOs'],
            stageOptions: ['complete', 'gene-isolation', 'vector-preparation', 'ligation', 'transformation', 'selection'],
            applicationOptions: ['overview', 'insulin-production', 'gene-therapy', 'transgenic-organisms'],
            insets: ['restriction-sites', 'sticky-ends', 'blue-white-screening', 'applications-examples'],
            defaultOptions: {
                title: 'Recombinant DNA Technology',
                stage: 'complete',
                application: 'overview',
                showLabels: true,
                showInset: false,
                insetType: 'restriction-sites',
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'pcrCycle': {
            name: 'PCR (Polymerase Chain Reaction)',
            category: 'Genetics & Molecular Biology',
            description: 'DNA amplification cycle',
            dataRequired: ['stage', 'cycle'],
            usage: 'Best for molecular biology techniques',
            examples: ['PCR', 'DNA amplification', 'Molecular techniques'],
            stageOptions: ['complete', 'denaturation', 'annealing', 'extension'],
            cycleOptions: ['single', 'multiple', 'exponential-growth'],
            insets: ['temperature-profile', 'primer-design', 'taq-polymerase', 'applications'],
            defaultOptions: {
                title: 'PCR Cycle',
                stage: 'complete',
                cycle: 'single',
                showLabels: true,
                showInset: false,
                insetType: 'temperature-profile',
                width: 800,
                height: 700,
                backgroundColor: '#ffffff'
            }
        }
    };

    // Keep all existing helper methods
    static getDiagram(key) {
        return this.diagrams[key];
    }

    static getAllDiagrams() {
        return Object.keys(this.diagrams);
    }

    static getDiagramsByCategory(category) {
        return Object.entries(this.diagrams)
            .filter(([_, diagram]) => diagram.category === category)
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getAllCategories() {
        return [...new Set(Object.values(this.diagrams).map(d => d.category))];
    }

    static searchDiagrams(query) {
        const lowerQuery = query.toLowerCase();
        return Object.entries(this.diagrams)
            .filter(([key, diagram]) =>
                diagram.name.toLowerCase().includes(lowerQuery) ||
                diagram.description.toLowerCase().includes(lowerQuery) ||
                diagram.category.toLowerCase().includes(lowerQuery) ||
                key.toLowerCase().includes(lowerQuery) ||
                diagram.examples.some(ex => ex.toLowerCase().includes(lowerQuery))
            )
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getDiagramStats() {
        const stats = {};
        this.getAllCategories().forEach(category => {
            const diagrams = this.getDiagramsByCategory(category);
            stats[category] = {
                count: Object.keys(diagrams).length,
                diagrams: Object.keys(diagrams)
            };
        });
        return stats;
    }

    static getTotalDiagramCount() {
        return Object.keys(this.diagrams).length;
    }

    static getInsetTypes() {
        const insets = new Set();
        Object.values(this.diagrams).forEach(diagram => {
            if(diagram.insets) {
                diagram.insets.forEach(inset => insets.add(inset));
            }
        });
        return Array.from(insets);
    }

    static getDiagramsByInset(insetType) {
        return Object.entries(this.diagrams)
            .filter(([_, diagram]) => diagram.insets && diagram.insets.includes(insetType))
            .map(([key, _]) => key);
    }

    static printSummary() {
        console.log('=== ANATOMICAL DIAGRAMS REGISTRY SUMMARY ===');
        console.log(`Total Diagrams: ${this.getTotalDiagramCount()}`);
        console.log(`Total Inset Types: ${this.getInsetTypes().length}`);
        console.log('\nBy Category:');
        const stats = this.getDiagramStats();
        Object.entries(stats).forEach(([category, data]) => {
            console.log(`  ${category}: ${data.count} diagrams`);
        });
    }
                  }
              
                
      
