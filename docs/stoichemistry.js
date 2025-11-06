// Enhanced Stoichiometry Mathematical Workbook - Improved Step-by-Step Explanations
import * as math from 'mathjs';

export class EnhancedStoichiometryMathematicalWorkbook {
    constructor(options = {}) {
        this.width = options.width || 1400;
        this.height = options.height || 2000;
        this.theme = options.theme || "excel";
        this.cellWidth = 200;
        this.cellHeight = 28;
        this.headerHeight = 35;
        this.mathHeight = 40;
        this.rowLabelWidth = 60;
        this.fontSize = 12;
        this.mathFontSize = 14;

        this.currentProblem = null;
        this.currentSolution = null;
        this.solutionSteps = [];
        this.currentWorkbook = null;
        this.diagramData = null;

        // Enhanced explanation options
        this.explanationLevel = options.explanationLevel || 'intermediate'; // 'basic', 'intermediate', 'detailed', 'scaffolded'
        this.includeVerificationInSteps = options.includeVerificationInSteps !== false;
        this.includeConceptualConnections = options.includeConceptualConnections !== false;
        this.includeAlternativeMethods = options.includeAlternativeMethods !== false;
        this.includeErrorPrevention = options.includeErrorPrevention !== false;
        this.includeCommonMistakes = options.includeCommonMistakes !== false;
        this.includePedagogicalNotes = options.includePedagogicalNotes !== false;
        this.verificationDetail = options.verificationDetail || 'detailed';

        this.chemicalSymbols = this.initializeChemicalSymbols();
        this.setThemeColors();
        this.initializeStoichiometrySolvers();
        this.initializeErrorDatabase();
        this.initializeExplanationTemplates();
        this.initializePeriodicData();
    }

    initializeStoichiometryLessons() {
        this.lessons = {
            mole_calculations: {
                title: "Mole Calculations",
                concepts: [
                    "The mole is the fundamental unit in chemistry: 1 mole = 6.022 × 10²³ particles",
                    "Molar mass connects mass to moles: moles = mass / molar mass",
                    "Avogadro's number: NA = 6.022 × 10²³ mol⁻¹",
                    "Convert between particles, moles, and mass"
                ],
                theory: "The mole concept provides a bridge between the atomic/molecular scale and the macroscopic scale. One mole of any substance contains Avogadro's number of particles and has a mass equal to its molar mass in grams.",
                keyFormulas: {
                    "Moles from Mass": "n = m / M",
                    "Mass from Moles": "m = n × M",
                    "Particles from Moles": "N = n × NA",
                    "Moles from Particles": "n = N / NA"
                },
                solvingSteps: [
                    "Identify what you're given (mass, moles, or particles)",
                    "Identify what you need to find",
                    "Determine molar mass if converting mass ↔ moles",
                    "Apply appropriate formula",
                    "Check units and significant figures"
                ],
                applications: [
                    "Laboratory measurements",
                    "Chemical recipe calculations",
                    "Concentration determinations",
                    "Reaction yield predictions"
                ]
            },

            molar_mass: {
                title: "Molar Mass Calculations",
                concepts: [
                    "Molar mass is the mass of one mole of a substance (g/mol)",
                    "For elements: molar mass = atomic mass from periodic table",
                    "For compounds: sum of (atoms × atomic mass) for each element",
                    "Molar mass is numerically equal to molecular/formula mass"
                ],
                theory: "Molar mass allows conversion between the mass of a substance and the number of moles, connecting macroscopic measurements to molecular quantities.",
                keyFormulas: {
                    "Element": "M = atomic mass (g/mol)",
                    "Compound": "M = Σ(n × atomic mass) for each element",
                    "Example": "H₂O: M = 2(1.008) + 15.999 = 18.015 g/mol"
                },
                solvingSteps: [
                    "Write chemical formula correctly",
                    "Identify all elements and their subscripts",
                    "Look up atomic masses from periodic table",
                    "Multiply each atomic mass by its subscript",
                    "Sum all contributions"
                ],
                applications: [
                    "Converting between mass and moles",
                    "Determining empirical formulas",
                    "Calculating percent composition",
                    "Stoichiometric calculations"
                ]
            },

            mass_mass_stoichiometry: {
                title: "Mass-Mass Stoichiometry",
                concepts: [
                    "Use balanced equations to relate masses of reactants and products",
                    "Convert mass → moles → moles → mass",
                    "Mole ratio comes from balanced equation coefficients",
                    "Always work through moles as intermediate step"
                ],
                theory: "Mass-mass stoichiometry uses the law of conservation of mass and definite proportions. The balanced equation provides the mole ratio, which is the key to all stoichiometric conversions.",
                keyFormulas: {
                    "General Path": "mass A → moles A → moles B → mass B",
                    "Moles A": "n_A = m_A / M_A",
                    "Moles B": "n_B = n_A × (coefficient B / coefficient A)",
                    "Mass B": "m_B = n_B × M_B"
                },
                solvingSteps: [
                    "Write and balance the chemical equation",
                    "Convert given mass to moles (÷ molar mass)",
                    "Use mole ratio from equation to find moles of unknown",
                    "Convert moles to mass (× molar mass)",
                    "Report with correct sig figs and units"
                ],
                applications: [
                    "Industrial chemical production",
                    "Laboratory synthesis planning",
                    "Pollution control calculations",
                    "Fuel efficiency determinations"
                ]
            },

            limiting_reagent: {
                title: "Limiting Reagent Problems",
                concepts: [
                    "Limiting reagent is completely consumed and limits product formation",
                    "Excess reagent(s) remain after reaction completion",
                    "Must compare mole ratios to identify limiting reagent",
                    "Theoretical yield based on limiting reagent"
                ],
                theory: "In reactions with multiple reactants, one reactant typically runs out first. This limiting reagent determines the maximum amount of product that can form, regardless of how much excess reagent is present.",
                keyFormulas: {
                    "Mole Ratio Method": "Compare (moles available / coefficient) for each reactant",
                    "Smallest Ratio": "Reactant with smallest ratio is limiting",
                    "Theoretical Yield": "Based on limiting reagent amount"
                },
                solvingSteps: [
                    "Write balanced chemical equation",
                    "Convert all given masses to moles",
                    "Divide moles by coefficient for each reactant",
                    "Smallest value identifies limiting reagent",
                    "Calculate products based on limiting reagent",
                    "Calculate excess reagent remaining"
                ],
                applications: [
                    "Cost optimization in industry",
                    "Reaction efficiency analysis",
                    "Laboratory procedure design",
                    "Waste minimization strategies"
                ]
            },

            percent_yield: {
                title: "Percent Yield Calculations",
                concepts: [
                    "Theoretical yield: maximum possible product from stoichiometry",
                    "Actual yield: amount actually obtained in experiment",
                    "Percent yield = (actual / theoretical) × 100%",
                    "Yields < 100% due to side reactions, losses, equilibrium"
                ],
                theory: "Real reactions rarely produce the theoretical maximum. Percent yield quantifies reaction efficiency and helps identify problems in procedures or understand reaction limitations.",
                keyFormulas: {
                    "Percent Yield": "% yield = (actual yield / theoretical yield) × 100%",
                    "Actual from Percent": "actual = theoretical × (% yield / 100)",
                    "Theoretical from Percent": "theoretical = actual / (% yield / 100)"
                },
                solvingSteps: [
                    "Calculate theoretical yield from stoichiometry",
                    "Identify actual yield from experimental data",
                    "Apply percent yield formula",
                    "Analyze reasons for yield < 100%",
                    "Consider purity and measurement errors"
                ],
                applications: [
                    "Evaluating reaction efficiency",
                    "Process optimization",
                    "Quality control in manufacturing",
                    "Research experiment assessment"
                ]
            },

            solution_stoichiometry: {
                title: "Solution Stoichiometry",
                concepts: [
                    "Molarity (M) = moles solute / liters solution",
                    "Dilution: M₁V₁ = M₂V₂",
                    "Moles in solution = Molarity × Volume (L)",
                    "Stoichiometry in solution uses molarity for conversions"
                ],
                theory: "Solution stoichiometry extends stoichiometric principles to reactions in solution, where concentration (molarity) replaces mass as the measurement of amount.",
                keyFormulas: {
                    "Molarity": "M = n / V(L) = mol/L",
                    "Moles from Molarity": "n = M × V(L)",
                    "Dilution": "M₁V₁ = M₂V₂",
                    "Solution Stoichiometry": "Volume A → Moles A → Moles B → Volume B"
                },
                solvingSteps: [
                    "Write balanced equation",
                    "Calculate moles from volume and molarity",
                    "Use mole ratio from equation",
                    "Convert back to volume or concentration as needed",
                    "Watch units: convert mL to L when necessary"
                ],
                applications: [
                    "Titration calculations",
                    "Dilution preparations",
                    "Solution reaction predictions",
                    "Analytical chemistry"
                ]
            },

            gas_stoichiometry: {
                title: "Gas Stoichiometry",
                concepts: [
                    "Ideal Gas Law: PV = nRT",
                    "At STP (0°C, 1 atm): 1 mole gas = 22.4 L",
                    "Gas volumes react in simple whole number ratios",
                    "Avogadro's Law: equal volumes of gases contain equal moles (at same T, P)"
                ],
                theory: "Gas stoichiometry uses the ideal gas law and molar volume relationships. Gases are unique in that volume ratios equal mole ratios under constant conditions.",
                keyFormulas: {
                    "Ideal Gas Law": "PV = nRT",
                    "Moles from PVT": "n = PV / RT",
                    "Molar Volume at STP": "Vm = 22.4 L/mol",
                    "Moles at STP": "n = V / 22.4"
                },
                solvingSteps: [
                    "Write balanced equation",
                    "Convert gas volume to moles (using STP or PV=nRT)",
                    "Apply mole ratio from equation",
                    "Convert moles back to volume if needed",
                    "Account for temperature and pressure conditions"
                ],
                applications: [
                    "Industrial gas reactions",
                    "Combustion analysis",
                    "Atmospheric chemistry",
                    "Gas production calculations"
                ]
            },

            empirical_molecular: {
                title: "Empirical and Molecular Formulas",
                concepts: [
                    "Empirical formula: simplest whole number ratio of atoms",
                    "Molecular formula: actual number of atoms in molecule",
                    "Molecular formula = (empirical formula)n",
                    "Need molar mass to determine n"
                ],
                theory: "Empirical formulas show the simplest ratio of elements, while molecular formulas show actual atom counts. The molecular formula is always a whole number multiple of the empirical formula.",
                keyFormulas: {
                    "Empirical from %": "Convert % → mass → moles → ratio",
                    "Molecular Formula": "MF = (EF)n where n = MM(molecular) / MM(empirical)",
                    "Subscripts": "Divide all by smallest, multiply to get whole numbers"
                },
                solvingSteps: [
                    "Convert percent composition to grams (assume 100g sample)",
                    "Convert grams to moles for each element",
                    "Divide all moles by smallest value",
                    "Multiply to get whole numbers if needed",
                    "Use molar mass to find molecular formula"
                ],
                applications: [
                    "Identifying unknown compounds",
                    "Combustion analysis",
                    "Quality control in synthesis",
                    "Structural determination"
                ]
            },

            combustion_analysis: {
                title: "Combustion Analysis",
                concepts: [
                    "Burn organic compound in excess O₂",
                    "Measure masses of CO₂ and H₂O produced",
                    "Calculate moles of C from CO₂, H from H₂O",
                    "Find O by difference if needed"
                ],
                theory: "Combustion analysis determines empirical formulas of organic compounds by completely burning them and analyzing products. Carbon becomes CO₂, hydrogen becomes H₂O.",
                keyFormulas: {
                    "Moles C": "mol C = mol CO₂ (1:1 ratio)",
                    "Moles H": "mol H = 2 × mol H₂O (2:1 ratio)",
                    "Moles O": "mol O = (mass original - mass C - mass H) / 16.00"
                },
                solvingSteps: [
                    "Calculate moles of CO₂ and H₂O from masses",
                    "Determine moles of C and H from products",
                    "If compound contains O, find it by difference",
                    "Determine empirical formula from mole ratios",
                    "Find molecular formula if molar mass given"
                ],
                applications: [
                    "Organic compound identification",
                    "Purity analysis",
                    "Fuel composition determination",
                    "Environmental testing"
                ]
            },

            titration: {
                title: "Titration Calculations",
                concepts: [
                    "Equivalence point: moles acid = moles base (for 1:1 reactions)",
                    "Molarity and volume determine moles: n = M × V",
                    "Use stoichiometry for non-1:1 reactions",
                    "Indicator shows endpoint (approximates equivalence point)"
                ],
                theory: "Titration uses a solution of known concentration (titrant) to determine the concentration of an unknown solution. At equivalence, stoichiometric amounts have reacted.",
                keyFormulas: {
                    "Moles": "n = M × V(L)",
                    "For 1:1": "M₁V₁ = M₂V₂",
                    "General": "n₁/a = n₂/b where a, b are coefficients",
                    "Unknown Molarity": "M = n / V"
                },
                solvingSteps: [
                    "Write balanced neutralization equation",
                    "Calculate moles of titrant used",
                    "Use mole ratio to find moles of unknown",
                    "Calculate molarity of unknown: M = n/V",
                    "Report to correct significant figures"
                ],
                applications: [
                    "Acid-base analysis",
                    "Quality control testing",
                    "Water hardness determination",
                    "Pharmaceutical analysis"
                ]
            },

            percent_composition: {
                title: "Percent Composition",
                concepts: [
                    "% composition = (mass of element / total mass) × 100%",
                    "Can calculate from formula or experimental data",
                    "Sum of all percentages must equal 100%",
                    "Useful for identifying compounds and checking purity"
                ],
                theory: "Percent composition expresses the relative amounts of each element in a compound, useful for identification and quality control.",
                keyFormulas: {
                    "By Mass": "% element = (mass element / mass compound) × 100%",
                    "From Formula": "% element = (n × atomic mass / molar mass) × 100%",
                    "Check": "Σ(% all elements) = 100%"
                },
                solvingSteps: [
                    "Calculate or look up molar mass of compound",
                    "Find total mass of each element in formula",
                    "Divide element mass by compound molar mass",
                    "Multiply by 100%",
                    "Verify all percentages sum to 100%"
                ],
                applications: [
                    "Compound identification",
                    "Purity assessment",
                    "Nutritional labeling",
                    "Material composition analysis"
                ]
            },

            reaction_types: {
                title: "Stoichiometry of Different Reaction Types",
                concepts: [
                    "Synthesis: A + B → AB",
                    "Decomposition: AB → A + B",
                    "Single replacement: A + BC → AC + B",
                    "Double replacement: AB + CD → AD + CB",
                    "Combustion: CxHy + O₂ → CO₂ + H₂O"
                ],
                theory: "Different reaction types follow predictable patterns. Understanding the reaction type helps predict products and balance equations for stoichiometric calculations.",
                keyFormulas: {
                    "General": "Reactants → Products (must balance)",
                    "Stoichiometry": "Same principles apply regardless of reaction type",
                    "Conservation": "Atoms conserved, not rearranged or destroyed"
                },
                solvingSteps: [
                    "Identify reaction type",
                    "Write and balance equation",
                    "Apply standard stoichiometric methods",
                    "Use mole ratios from balanced equation",
                    "Calculate desired quantity"
                ],
                applications: [
                    "Predicting reaction products",
                    "Industrial process design",
                    "Environmental chemistry",
                    "Laboratory synthesis"
                ]
            }
        };
    }

    setThemeColors() {
        const themes = {
            excel: {
                background: '#ffffff',
                gridColor: '#c0c0c0',
                headerBg: '#4472c4',
                headerText: '#ffffff',
                sectionBg: '#d9e2f3',
                sectionText: '#000000',
                cellBg: '#ffffff',
                cellText: '#000000',
                resultBg: '#e2efda',
                resultText: '#000000',
                formulaBg: '#fff2cc',
                formulaText: '#7f6000',
                stepBg: '#f2f2f2',
                stepText: '#333333',
                borderColor: '#808080',
                mathBg: '#fef7e0',
                mathText: '#b06000',
                diagramBg: '#f8f9fa',
                moleculeBg: '#ffe6e6',
                reactionBg: '#e6f3ff'
            },
            scientific: {
                background: '#f8f9fa',
                gridColor: '#4682b4',
                headerBg: '#2c5aa0',
                headerText: '#ffffff',
                sectionBg: '#e1ecf4',
                sectionText: '#2c5aa0',
                cellBg: '#ffffff',
                cellText: '#2c5aa0',
                resultBg: '#d4edda',
                resultText: '#155724',
                formulaBg: '#fff3cd',
                formulaText: '#856404',
                stepBg: '#e9ecef',
                stepText: '#495057',
                borderColor: '#4682b4',
                mathBg: '#e3f2fd',
                mathText: '#1565c0',
                diagramBg: '#f1f8ff',
                moleculeBg: '#ffe0e6',
                reactionBg: '#e0f7ff'
            }
        };

        this.colors = themes[this.theme] || themes.excel;
    }

    initializeChemicalSymbols() {
        return {
            // Chemical symbols and notations
            'rightarrow': '→',
            'leftarrow': '←',
            'equilibrium': '⇌',
            'plus': '+',
            'yields': '→',
            // Subscripts and superscripts (conceptual - would need special rendering)
            'subscript': '₀₁₂₃₄₅₆₇₈₉',
            'superscript': '⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻',
            // State symbols
            'solid': '(s)',
            'liquid': '(l)',
            'gas': '(g)',
            'aqueous': '(aq)',
            // Greek letters commonly used
            'delta': 'Δ',
            'nu': 'ν',
            'lambda': 'λ'
        };
    }

    initializePeriodicData() {
        // Common elements with atomic masses
        this.atomicMasses = {
            'H': 1.008, 'He': 4.003,
            'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998,
            'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085,
            'P': 30.974, 'S': 32.06, 'Cl': 35.45, 'Ar': 39.948,
            'K': 39.098, 'Ca': 40.078, 'Fe': 55.845, 'Cu': 63.546,
            'Zn': 65.38, 'Br': 79.904, 'Ag': 107.868, 'I': 126.904,
            'Ba': 137.327, 'Au': 196.967, 'Hg': 200.592, 'Pb': 207.2
        };

        this.avogadroNumber = 6.02214076e23;
        this.gasConstant = 0.08206; // L·atm/(mol·K)
        this.stpMolarVolume = 22.4; // L/mol at STP
    }

    initializeStoichiometrySolvers() {
        this.stoichiometryTypes = {
            // Basic mole calculations
            mole_from_mass: {
                patterns: [
                    /mole.*from.*mass/i,
                    /mass.*to.*mole/i,
                    /convert.*gram.*mole/i,
                    /how many mole/i
                ],
                solver: this.solveMoleFromMass.bind(this),
                name: 'Moles from Mass',
                category: 'mole_calculations',
                description: 'Calculate moles from given mass using molar mass'
            },

            mass_from_mole: {
                patterns: [
                    /mass.*from.*mole/i,
                    /mole.*to.*mass/i,
                    /convert.*mole.*gram/i,
                    /how many gram/i
                ],
                solver: this.solveMassFromMole.bind(this),
                name: 'Mass from Moles',
                category: 'mole_calculations',
                description: 'Calculate mass from given moles using molar mass'
            },

            particles_from_mole: {
                patterns: [
                    /particle.*from.*mole/i,
                    /atom.*from.*mole/i,
                    /molecule.*from.*mole/i,
                    /avogadro/i
                ],
                solver: this.solveParticlesFromMole.bind(this),
                name: 'Particles from Moles',
                category: 'mole_calculations',
                description: 'Calculate number of particles using Avogadro\'s number'
            },

            mole_from_particles: {
                patterns: [
                    /mole.*from.*particle/i,
                    /mole.*from.*atom/i,
                    /mole.*from.*molecule/i
                ],
                solver: this.solveMoleFromParticles.bind(this),
                name: 'Moles from Particles',
                category: 'mole_calculations',
                description: 'Calculate moles from number of particles'
            },

            // Molar mass calculations
            molar_mass: {
                patterns: [
                    /molar.*mass/i,
                    /molecular.*weight/i,
                    /formula.*weight/i,
                    /calculate.*M/i
                ],
                solver: this.solveMolarMass.bind(this),
                name: 'Molar Mass Calculation',
                category: 'molar_mass',
                description: 'Calculate molar mass from chemical formula'
            },

            // Stoichiometry calculations
            mass_mass: {
                patterns: [
                    /mass.*mass.*stoichiometry/i,
                    /gram.*gram/i,
                    /mass.*react.*produce/i
                ],
                solver: this.solveMassMassStoichiometry.bind(this),
                name: 'Mass-Mass Stoichiometry',
                category: 'mass_mass_stoichiometry',
                description: 'Convert between masses of reactants and products'
            },

            mole_mole: {
                patterns: [
                    /mole.*mole.*stoichiometry/i,
                    /mole.*ratio/i,
                    /stoichiometric.*coefficient/i
                ],
                solver: this.solveMoleMoleStoichiometry.bind(this),
                name: 'Mole-Mole Stoichiometry',
                category: 'mass_mass_stoichiometry',
                description: 'Use mole ratios from balanced equations'
            },

            // Limiting reagent
            limiting_reagent: {
                patterns: [
                    /limiting.*reagent/i,
                    /limiting.*reactant/i,
                    /excess.*reagent/i,
                    /which.*limit/i
                ],
                solver: this.solveLimitingReagent.bind(this),
                name: 'Limiting Reagent',
                category: 'limiting_reagent',
                description: 'Identify limiting reagent and calculate products'
            },

            // Percent yield
            percent_yield: {
                patterns: [
                    /percent.*yield/i,
                    /percentage.*yield/i,
                    /actual.*theoretical/i,
                    /yield.*calculation/i
                ],
                solver: this.solvePercentYield.bind(this),
                name: 'Percent Yield',
                category: 'percent_yield',
                description: 'Calculate percent yield from actual and theoretical'
            },

            theoretical_yield: {
                patterns: [
                    /theoretical.*yield/i,
                    /maximum.*yield/i,
                    /expected.*product/i
                ],
                solver: this.solveTheoreticalYield.bind(this),
                name: 'Theoretical Yield',
                category: 'percent_yield',
                description: 'Calculate maximum possible product amount'
            },

            // Solution stoichiometry
            molarity: {
                patterns: [
                    /molarity/i,
                    /molar.*concentration/i,
                    /M.*=.*mol.*L/i,
                    /concentration.*solution/i
                ],
                solver: this.solveMolarity.bind(this),
                name: 'Molarity Calculations',
                category: 'solution_stoichiometry',
                description: 'Calculate molarity, moles, or volume'
            },

            dilution: {
                patterns: [
                    /dilution/i,
                    /M1V1.*M2V2/i,
                    /dilute.*solution/i,
                    /concentration.*change/i
                ],
                solver: this.solveDilution.bind(this),
                name: 'Dilution Problems',
                category: 'solution_stoichiometry',
                description: 'Solve dilution problems using M₁V₁ = M₂V₂'
            },

            solution_stoichiometry: {
                patterns: [
                    /solution.*stoichiometry/i,
                    /reaction.*solution/i,
                    /volume.*react/i
                ],
                solver: this.solveSolutionStoichiometry.bind(this),
                name: 'Solution Stoichiometry',
                category: 'solution_stoichiometry',
                description: 'Stoichiometry with solution concentrations'
            },

            // Gas stoichiometry
            gas_stoichiometry: {
                patterns: [
                    /gas.*stoichiometry/i,
                    /ideal.*gas.*law/i,
                    /PV.*nRT/i,
                    /STP/i
                ],
                solver: this.solveGasStoichiometry.bind(this),
                name: 'Gas Stoichiometry',
                category: 'gas_stoichiometry',
                description: 'Stoichiometry involving gases and PV=nRT'
            },

            // Empirical and molecular formulas
            empirical_formula: {
                patterns: [
                    /empirical.*formula/i,
                    /simplest.*formula/i,
                    /percent.*composition/i
                ],
                solver: this.solveEmpiricalFormula.bind(this),
                name: 'Empirical Formula',
                category: 'empirical_molecular',
                description: 'Determine empirical formula from composition'
            },

            molecular_formula: {
                patterns: [
                    /molecular.*formula/i,
                    /true.*formula/i,
                    /actual.*formula/i
                ],
                solver: this.solveMolecularFormula.bind(this),
                name: 'Molecular Formula',
                category: 'empirical_molecular',
                description: 'Determine molecular formula from empirical and molar mass'
            },

            // Combustion analysis
            combustion_analysis: {
                patterns: [
                    /combustion.*analysis/i,
                    /burn.*organic/i,
                    /CO2.*H2O.*produced/i
                ],
                solver: this.solveCombustionAnalysis.bind(this),
                name: 'Combustion Analysis',
                category: 'combustion_analysis',
                description: 'Determine formula from combustion products'
            },

            // Titration
            titration: {
                patterns: [
                    /titration/i,
                    /neutralization/i,
                    /equivalence.*point/i,
                    /acid.*base/i
                ],
                solver: this.solveTitration.bind(this),
                name: 'Titration Calculations',
                category: 'titration',
                description: 'Calculate unknown concentration from titration data'
            },

            // Percent composition
            percent_composition: {
                patterns: [
                    /percent.*composition/i,
                    /percentage.*element/i,
                    /composition.*by.*mass/i
                ],
                solver: this.solvePercentComposition.bind(this),
                name: 'Percent Composition',
                category: 'percent_composition',
                description: 'Calculate percent composition from formula'
            }
        };
    }

    initializeErrorDatabase() {
        this.commonMistakes = {
            mole_calculations: {
                'Convert to moles': [
                    'Forgetting to divide by molar mass',
                    'Using atomic mass instead of molar mass for compounds',
                    'Incorrect unit conversions (mg to g, etc.)'
                ],
                'Calculate molar mass': [
                    'Forgetting to multiply by subscripts',
                    'Using wrong atomic masses from periodic table',
                    'Not accounting for parentheses in formulas'
                ]
            },
            mass_mass_stoichiometry: {
                'Apply mole ratio': [
                    'Using mass ratio instead of mole ratio',
                    'Inverting the mole ratio',
                    'Not using coefficients from balanced equation'
                ],
                'Balance equation': [
                    'Starting calculations with unbalanced equation',
                    'Changing subscripts instead of coefficients',
                    'Not verifying balance for all elements'
                ]
            },
            limiting_reagent: {
                'Identify limiting reagent': [
                    'Only looking at masses instead of mole ratios',
                    'Choosing reagent with smallest mass as limiting',
                    'Not comparing (moles/coefficient) for each reactant'
                ],
                'Calculate products': [
                    'Using excess reagent instead of limiting reagent',
                    'Forgetting to calculate excess remaining',
                    'Not using limiting reagent for all product calculations'
                ]
            },
            solution_stoichiometry: {
                'Convert volume units': [
                    'Using mL instead of L in molarity calculations',
                    'Forgetting to convert volume to liters',
                    'Mixing volume units in dilution problems'
                ],
                'Apply molarity': [
                    'Confusing molarity with molality',
                    'Using wrong formula for molarity',
                    'Not accounting for volume changes in reactions'
                ]
            },
            empirical_molecular: {
                'Find mole ratios': [
                    'Not dividing by smallest number of moles',
                    'Rounding prematurely in calculations',
                    'Not multiplying to get whole number ratios'
                ],
                'Determine molecular formula': [
                    'Forgetting to use molar mass',
                    'Not finding n = MM(molecular)/MM(empirical)',
                    'Confusing empirical with molecular formula'
                ]
            }
        };

        this.errorPrevention = {
            unit_tracking: {
                reminder: 'Always write units and cancel them systematically',
                method: 'Use dimensional analysis for all conversions'
            },
            balanced_equations: {
                reminder: 'Never start stoichiometry with unbalanced equation',
                method: 'Balance first, then verify atom count on both sides'
            },
            mole_ratio_emphasis: {
                reminder: 'Stoichiometry works in moles, not grams',
                method: 'Always convert to moles before using equation ratios'
            },
            significant_figures: {
                reminder: 'Track sig figs throughout calculation',
                method: 'Round only at final answer, keep extra digits during steps'
            }
        };
    }

    initializeExplanationTemplates() {
        this.explanationStyles = {
            conceptual: {
                focus: 'Why this step works and its chemical meaning',
                language: 'intuitive and concept-focused'
            },
            procedural: {
                focus: 'Exact sequence of calculations to perform',
                language: 'step-by-step instructions'
            },
            visual: {
                focus: 'Molecular and macroscopic visualization',
                language: 'visual and spatial metaphors'
            },
            mathematical: {
                focus: 'Numerical relationships and unit conversions',
                language: 'precise mathematical terminology'
            }
        };

        this.difficultyLevels = {
            basic: {
                vocabulary: 'simple, everyday language',
                detail: 'essential steps only',
                examples: 'concrete substances and simple reactions'
            },
            intermediate: {
                vocabulary: 'standard chemical terminology',
                detail: 'main steps with brief explanations',
                examples: 'mix of simple and complex reactions'
            },
            detailed: {
                vocabulary: 'full chemical vocabulary',
                detail: 'comprehensive explanations with theory',
                examples: 'complex reactions and scenarios'
            },
            scaffolded: {
                vocabulary: 'progressive from simple to complex',
                detail: 'guided discovery with questions',
                examples: 'carefully sequenced difficulty progression'
            }
        };
    }

    // MAIN SOLVER METHOD
    solveStoichiometryProblem(config) {
        const { equation, substance, parameters, problemType, context } = config;

        try {
            // Parse the problem
            this.currentProblem = this.parseStoichiometryProblem(
                equation, substance, parameters, problemType, context
            );

            // Solve the problem
            this.currentSolution = this.solveStoichiometryProblem_Internal(this.currentProblem);

            // Generate solution steps
            this.solutionSteps = this.generateStoichiometrySteps(
                this.currentProblem, this.currentSolution
            );

            // Generate diagram data if applicable
            this.generateStoichiometryDiagramData();

            // Generate workbook
            this.generateStoichiometryWorkbook();

            return {
                workbook: this.currentWorkbook,
                solution: this.currentSolution,
                steps: this.solutionSteps,
                diagram: this.diagramData
            };

        } catch (error) {
            throw new Error(`Failed to solve stoichiometry problem: ${error.message}`);
        }
    }

    parseStoichiometryProblem(equation, substance = '', parameters = {}, problemType = null, context = {}) {
        const cleanInput = equation ? this.cleanChemicalExpression(equation) : '';

        // If problem type is specified, use it directly
        if (problemType && this.stoichiometryTypes[problemType]) {
            return {
                originalInput: equation || `${problemType} problem`,
                cleanInput: cleanInput,
                type: problemType,
                substance: substance,
                parameters: { ...parameters },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        // Auto-detect stoichiometry problem type
        for (const [type, config] of Object.entries(this.stoichiometryTypes)) {
            for (const pattern of config.patterns) {
                if (pattern.test(cleanInput) || pattern.test(substance) || 
                    pattern.test(JSON.stringify(parameters))) {
                    return {
                        originalInput: equation || substance,
                        cleanInput: cleanInput,
                        type: type,
                        substance: substance,
                        parameters: { ...parameters },
                        context: { ...context },
                        parsedAt: new Date().toISOString()
                    };
                }
            }
        }

        // Default to mole calculation if mass and formula are provided
        if (parameters.mass !== undefined && parameters.formula) {
            return {
                originalInput: `Calculate moles from ${parameters.mass}g of ${parameters.formula}`,
                cleanInput: cleanInput,
                type: 'mole_from_mass',
                substance: parameters.formula,
                parameters: { ...parameters },
                context: { ...context },
                parsedAt: new Date().toISOString()
            };
        }

        throw new Error(`Unable to recognize stoichiometry problem type from: ${equation || substance}`);
    }

    cleanChemicalExpression(expression) {
        return expression
            .replace(/\s+/g, ' ')
            .replace(/-->/g, '→')
            .replace(/->/g, '→')
            .replace(/<-->/g, '⇌')
            .replace(/<->/g, '⇌')
            .trim();
    }

    solveStoichiometryProblem_Internal(problem) {
        const solver = this.stoichiometryTypes[problem.type]?.solver;
        if (!solver) {
            throw new Error(`No solver available for stoichiometry problem type: ${problem.type}`);
        }

        return solver(problem);
    }

    // STOICHIOMETRY SOLVERS

    solveMoleFromMass(problem) {
        const { mass, formula, molarMass } = problem.parameters;
        
        let M = molarMass;
        if (!M && formula) {
            M = this.calculateMolarMass(formula);
        }

        if (!M || M === 0) {
            throw new Error('Molar mass required for mole calculation');
        }

        const moles = mass / M;

        return {
            problemType: 'Moles from Mass',
            givenMass: mass,
            molarMass: M,
            formula: formula,
            moles: moles,
            calculation: `n = m / M = ${mass} g / ${M} g/mol = ${moles} mol`,
            category: 'mole_calculations'
        };
    }

    solveMassFromMole(problem) {
        const { moles, formula, molarMass } = problem.parameters;
        
        let M = molarMass;
        if (!M && formula) {
            M = this.calculateMolarMass(formula);
        }

        if (!M || M === 0) {
            throw new Error('Molar mass required for mass calculation');
        }

        const mass = moles * M;

        return {
            problemType: 'Mass from Moles',
            givenMoles: moles,
            molarMass: M,
            formula: formula,
            mass: mass,
            calculation: `m = n × M = ${moles} mol × ${M} g/mol = ${mass} g`,
            category: 'mole_calculations'
        };
    }

    solveParticlesFromMole(problem) {
        const { moles } = problem.parameters;
        const particles = moles * this.avogadroNumber;

        return {
            problemType: 'Particles from Moles',
            givenMoles: moles,
            avogadroNumber: this.avogadroNumber,
            particles: particles,
            calculation: `N = n × NA = ${moles} mol × ${this.avogadroNumber} = ${particles}`,
            scientificNotation: particles.toExponential(3),
            category: 'mole_calculations'
        };
    }

    solveMoleFromParticles(problem) {
        const { particles } = problem.parameters;
        const moles = particles / this.avogadroNumber;

        return {
            problemType: 'Moles from Particles',
            givenParticles: particles,
            avogadroNumber: this.avogadroNumber,
            moles: moles,
            calculation: `n = N / NA = ${particles} / ${this.avogadroNumber} = ${moles} mol`,
            category: 'mole_calculations'
        };
    }

    solveMolarMass(problem) {
        const { formula } = problem.parameters;
        
        if (!formula) {
            throw new Error('Chemical formula required for molar mass calculation');
        }

        const M = this.calculateMolarMass(formula);
        const composition = this.parseChemicalFormula(formula);

        return {
            problemType: 'Molar Mass Calculation',
            formula: formula,
            molarMass: M,
            composition: composition,
            breakdown: this.getMolarMassBreakdown(formula, composition),
            units: 'g/mol',
            category: 'molar_mass'
        };
    }

    solveMassMassStoichiometry(problem) {
        const { equation, reactantFormula, reactantMass, productFormula } = problem.parameters;
        
        // Calculate molar masses
        const M_reactant = this.calculateMolarMass(reactantFormula);
        const M_product = this.calculateMolarMass(productFormula);
        
        // Parse equation for coefficients
        const coefficients = this.extractCoefficients(equation, reactantFormula, productFormula);
        
        // Convert mass to moles
        const n_reactant = reactantMass / M_reactant;
        
        // Use mole ratio
        const n_product = n_reactant * (coefficients.product / coefficients.reactant);
        
        // Convert to mass
        const m_product = n_product * M_product;

        return {
            problemType: 'Mass-Mass Stoichiometry',
            equation: equation,
            reactant: {
                formula: reactantFormula,
                mass: reactantMass,
                molarMass: M_reactant,
                moles: n_reactant,
                coefficient: coefficients.reactant
            },
            product: {
                formula: productFormula,
                mass: m_product,
                molarMass: M_product,
                moles: n_product,
                coefficient: coefficients.product
            },
            moleRatio: `${coefficients.reactant}:${coefficients.product}`,
            category: 'mass_mass_stoichiometry'
        };
    }

    solveMoleMoleStoichiometry(problem) {
        const { equation, reactantFormula, reactantMoles, productFormula } = problem.parameters;
        
        const coefficients = this.extractCoefficients(equation, reactantFormula, productFormula);
        const productMoles = reactantMoles * (coefficients.product / coefficients.reactant);

        return {
            problemType: 'Mole-Mole Stoichiometry',
            equation: equation,
            reactantMoles: reactantMoles,
            productMoles: productMoles,
            moleRatio: `${coefficients.reactant}:${coefficients.product}`,
            coefficients: coefficients,
            category: 'mass_mass_stoichiometry'
        };
    }

    solveLimitingReagent(problem) {
        const { equation, reactants } = problem.parameters;
        
        // Calculate moles for each reactant
        const reactantData = reactants.map(r => {
            const molarMass = this.calculateMolarMass(r.formula);
            const moles = r.mass / molarMass;
            const coefficient = this.getCoefficient(equation, r.formula);
            
            return {
                formula: r.formula,
                mass: r.mass,
                molarMass: molarMass,
                moles: moles,
                coefficient: coefficient,
                ratio: moles / coefficient
            };
        });
        
        // Find limiting reagent (smallest ratio)
        const limiting = reactantData.reduce((min, current) => 
            current.ratio < min.ratio ? current : min
        );
        
        const excess = reactantData.filter(r => r.formula !== limiting.formula);

        return {
            problemType: 'Limiting Reagent',
            equation: equation,
            reactants: reactantData,
            limitingReagent: limiting,
            excessReagents: excess,
            explanation: `${limiting.formula} is limiting because it has the smallest moles/coefficient ratio`,
            category: 'limiting_reagent'
        };
    }

    solvePercentYield(problem) {
        const { actualYield, theoreticalYield } = problem.parameters;
        
        const percentYield = (actualYield / theoreticalYield) * 100;

        return {
            problemType: 'Percent Yield',
            actualYield: actualYield,
            theoreticalYield: theoreticalYield,
            percentYield: percentYield,
            calculation: `% yield = (actual / theoretical) × 100% = (${actualYield} / ${theoreticalYield}) × 100% = ${percentYield}%`,
            category: 'percent_yield'
        };
    }

    solveTheoreticalYield(problem) {
        const { equation, reactantFormula, reactantMass, productFormula } = problem.parameters;
        
        // This is essentially mass-mass stoichiometry
        const result = this.solveMassMassStoichiometry(problem);
        
        return {
            problemType: 'Theoretical Yield',
            theoreticalYield: result.product.mass,
            ...result,
            category: 'percent_yield'
        };
    }

    solveMolarity(problem) {
        const { moles, volume, molarity } = problem.parameters;
        
        // Solve for unknown: M, n, or V
        if (molarity === undefined && moles !== undefined && volume !== undefined) {
            // Calculate molarity
            const M = moles / volume;
            return {
                problemType: 'Molarity Calculation',
                moles: moles,
                volume: volume,
                molarity: M,
                calculation: `M = n / V = ${moles} mol / ${volume} L = ${M} M`,
                category: 'solution_stoichiometry'
            };
        } else if (moles === undefined && molarity !== undefined && volume !== undefined) {
            // Calculate moles
            const n = molarity * volume;
            return {
                problemType: 'Moles from Molarity',
                molarity: molarity,
                volume: volume,
                moles: n,
                calculation: `n = M × V = ${molarity} M × ${volume} L = ${n} mol`,
                category: 'solution_stoichiometry'
            };
        } else if (volume === undefined && molarity !== undefined && moles !== undefined) {
            // Calculate volume
            const V = moles / molarity;
            return {
                problemType: 'Volume from Molarity',
                molarity: molarity,
                moles: moles,
                volume: V,
                calculation: `V = n / M = ${moles} mol / ${molarity} M = ${V} L`,
                category: 'solution_stoichiometry'
            };
        }

        throw new Error('Insufficient data for molarity calculation');
    }

    solveDilution(problem) {
        const { M1, V1, M2, V2 } = problem.parameters;
        
        // Solve for unknown using M₁V₁ = M₂V₂
        if (M2 === undefined) {
            const M2_calc = (M1 * V1) / V2;
            return {
                problemType: 'Dilution - Find Final Molarity',
                M1: M1, V1: V1, V2: V2,
                M2: M2_calc,
                calculation: `M₂ = M₁V₁ / V₂ = ${M1} × ${V1} / ${V2} = ${M2_calc} M`,
                category: 'solution_stoichiometry'
            };
        } else if (V2 === undefined) {
            const V2_calc = (M1 * V1) / M2;
            return {
                problemType: 'Dilution - Find Final Volume',
                M1: M1, V1: V1, M2: M2,
                V2: V2_calc,
                calculation: `V₂ = M₁V₁ / M₂ = ${M1} × ${V1} / ${M2} = ${V2_calc} L`,
                category: 'solution_stoichiometry'
            };
        }

        throw new Error('Insufficient data for dilution calculation');
    }

    solveSolutionStoichiometry(problem) {
        const { equation, reactantFormula, molarity, volume, productFormula } = problem.parameters;
        
        // Calculate moles from molarity and volume
        const n_reactant = molarity * volume;
        
        // Use mole ratio to find product moles
        const coefficients = this.extractCoefficients(equation, reactantFormula, productFormula);
        const n_product = n_reactant * (coefficients.product / coefficients.reactant);

        return {
            problemType: 'Solution Stoichiometry',
            equation: equation,
            reactant: {
                formula: reactantFormula,
                molarity: molarity,
                volume: volume,
                moles: n_reactant
            },
            product: {
                formula: productFormula,
                moles: n_product
            },
            moleRatio: `${coefficients.reactant}:${coefficients.product}`,
            category: 'solution_stoichiometry'
        };
    }

    solveGasStoichiometry(problem) {
        const { pressure, volume, temperature, moles, useSTP } = problem.parameters;
        
        if (useSTP) {
            // At STP: 1 mole = 22.4 L
            if (volume !== undefined && moles === undefined) {
                const n = volume / this.stpMolarVolume;
                return {
                    problemType: 'Gas Stoichiometry at STP',
                    volume: volume,
                    moles: n,
                    molarVolume: this.stpMolarVolume,
                    calculation: `n = V / Vm = ${volume} L / ${this.stpMolarVolume} L/mol = ${n} mol`,
                    category: 'gas_stoichiometry'
                };
            } else if (moles !== undefined && volume === undefined) {
                const V = moles * this.stpMolarVolume;
                return {
                    problemType: 'Gas Volume at STP',
                    moles: moles,
                    volume: V,
                    molarVolume: this.stpMolarVolume,
                    calculation: `V = n × Vm = ${moles} mol × ${this.stpMolarVolume} L/mol = ${V} L`,
                    category: 'gas_stoichiometry'
                };
            }
        } else {
            // Use PV = nRT
            if (moles === undefined && pressure !== undefined && volume !== undefined && temperature !== undefined) {
                const n = (pressure * volume) / (this.gasConstant * temperature);
                return {
                    problemType: 'Gas Stoichiometry (Ideal Gas Law)',
                    pressure: pressure,
                    volume: volume,
                    temperature: temperature,
                    moles: n,
                    R: this.gasConstant,
                    calculation: `n = PV / RT = (${pressure} × ${volume}) / (${this.gasConstant} × ${temperature}) = ${n} mol`,
                    category: 'gas_stoichiometry'
                };
            }
        }

        throw new Error('Insufficient data for gas stoichiometry calculation');
    }

    solveEmpiricalFormula(problem) {
        const { percentComposition } = problem.parameters;
        
        // Convert percentages to grams (assume 100g sample)
        const masses = {};
        for (const [element, percent] of Object.entries(percentComposition)) {
            masses[element] = percent;
        }
        
        // Convert to moles
        const moles = {};
        for (const [element, mass] of Object.entries(masses)) {
            moles[element] = mass / this.atomicMasses[element];
        }
        
        // Find smallest number of moles
        const smallestMoles = Math.min(...Object.values(moles));
        
        // Divide all by smallest
        const ratios = {};
        for (const [element, mol] of Object.entries(moles)) {
            ratios[element] = mol / smallestMoles;
        }
        
        // Convert to whole numbers
        const subscripts = this.convertToWholeNumbers(ratios);
        
        // Build empirical formula
        const empiricalFormula = this.buildFormula(subscripts);

        return {
            problemType: 'Empirical Formula',
            percentComposition: percentComposition,
            masses: masses,
            moles: moles,
            ratios: ratios,
            subscripts: subscripts,
            empiricalFormula: empiricalFormula,
            category: 'empirical_molecular'
        };
    }

    solveMolecularFormula(problem) {
        const { empiricalFormula, molarMass } = problem.parameters;
        
        const empiricalMass = this.calculateMolarMass(empiricalFormula);
        const n = Math.round(molarMass / empiricalMass);
        
        const molecularFormula = this.multiplyFormula(empiricalFormula, n);

        return {
            problemType: 'Molecular Formula',
            empiricalFormula: empiricalFormula,
            empiricalMass: empiricalMass,
            molarMass: molarMass,
            n: n,
            molecularFormula: molecularFormula,
            calculation: `n = MM(molecular) / MM(empirical) = ${molarMass} / ${empiricalMass} = ${n}`,
            category: 'empirical_molecular'
        };
    }

    solveCombustionAnalysis(problem) {
        const { compoundMass, CO2mass, H2Omass, containsO } = problem.parameters;
        
        // Calculate moles of C from CO₂
        const M_CO2 = this.calculateMolarMass('CO2');
        const n_CO2 = CO2mass / M_CO2;
        const n_C = n_CO2; // 1:1 ratio
        const mass_C = n_C * this.atomicMasses.C;
        
        // Calculate moles of H from H₂O
        const M_H2O = this.calculateMolarMass('H2O');
        const n_H2O = H2Omass / M_H2O;
        const n_H = 2 * n_H2O; // 2:1 ratio
        const mass_H = n_H * this.atomicMasses.H;
        
        // Calculate O by difference if compound contains oxygen
        let n_O = 0;
        let mass_O = 0;
        if (containsO) {
            mass_O = compoundMass - mass_C - mass_H;
            n_O = mass_O / this.atomicMasses.O;
        }
        
        // Find empirical formula from mole ratios
        const moles = { C: n_C, H: n_H };
        if (containsO) moles.O = n_O;
        
        const smallestMoles = Math.min(...Object.values(moles));
        const ratios = {};
        for (const [element, mol] of Object.entries(moles)) {
            ratios[element] = mol / smallestMoles;
        }
        
        const subscripts = this.convertToWholeNumbers(ratios);
        const empiricalFormula = this.buildFormula(subscripts);

        return {
            problemType: 'Combustion Analysis',
            compoundMass: compoundMass,
            CO2mass: CO2mass,
            H2Omass: H2Omass,
            carbonData: { moles: n_C, mass: mass_C },
            hydrogenData: { moles: n_H, mass: mass_H },
            oxygenData: containsO ? { moles: n_O, mass: mass_O } : null,
            moles: moles,
            ratios: ratios,
            subscripts: subscripts,
            empiricalFormula: empiricalFormula,
            category: 'combustion_analysis'
        };
    }

    solveTitration(problem) {
        const { 
            acidFormula, baseFormula, acidMolarity, baseMolarity,
            acidVolume, baseVolume, equation
        } = problem.parameters;
        
        // Parse equation for coefficients
        const coefficients = this.extractCoefficients(equation, acidFormula, baseFormula);
        
        // Determine what to solve for
        if (acidMolarity === undefined) {
            // Find acid molarity
            const n_base = baseMolarity * (baseVolume / 1000); // Convert mL to L
            const n_acid = n_base * (coefficients.acid / coefficients.base);
            const M_acid = n_acid / (acidVolume / 1000);
            
            return {
                problemType: 'Titration - Find Acid Molarity',
                equation: equation,
                base: { formula: baseFormula, molarity: baseMolarity, volume: baseVolume, moles: n_base },
                acid: { formula: acidFormula, molarity: M_acid, volume: acidVolume, moles: n_acid },
                moleRatio: `${coefficients.acid}:${coefficients.base}`,
                category: 'titration'
            };
        } else if (baseMolarity === undefined) {
            // Find base molarity
            const n_acid = acidMolarity * (acidVolume / 1000);
            const n_base = n_acid * (coefficients.base / coefficients.acid);
            const M_base = n_base / (baseVolume / 1000);
            
            return {
                problemType: 'Titration - Find Base Molarity',
                equation: equation,
                acid: { formula: acidFormula, molarity: acidMolarity, volume: acidVolume, moles: n_acid },
                base: { formula: baseFormula, molarity: M_base, volume: baseVolume, moles: n_base },
                moleRatio: `${coefficients.acid}:${coefficients.base}`,
                category: 'titration'
            };
        }

        throw new Error('Insufficient data for titration calculation');
    }

    solvePercentComposition(problem) {
        const { formula } = problem.parameters;
        
        const molarMass = this.calculateMolarMass(formula);
        const composition = this.parseChemicalFormula(formula);
        
        const percentages = {};
        for (const [element, count] of Object.entries(composition)) {
            const elementMass = count * this.atomicMasses[element];
            percentages[element] = (elementMass / molarMass) * 100;
        }

        return {
            problemType: 'Percent Composition',
            formula: formula,
            molarMass: molarMass,
            composition: composition,
            percentages: percentages,
            verification: Object.values(percentages).reduce((sum, val) => sum + val, 0),
            category: 'percent_composition'
        };
    }

    // HELPER METHODS FOR CALCULATIONS

    calculateMolarMass(formula) {
        const composition = this.parseChemicalFormula(formula);
        let molarMass = 0;
        
        for (const [element, count] of Object.entries(composition)) {
            if (!this.atomicMasses[element]) {
                throw new Error(`Unknown element: ${element}`);
            }
            molarMass += this.atomicMasses[element] * count;
        }
        
        return parseFloat(molarMass.toFixed(4));
    }

    parseChemicalFormula(formula) {
        const composition = {};
        
        // Simple parser - handles basic formulas like H2O, Ca(OH)2, etc.
        // This is a simplified version; real implementation would need more robust parsing
        
        const elementPattern = /([A-Z][a-z]?)(\d*)/g;
        let match;
        
        // Remove parentheses for now (simplified)
        let simplified = formula;
        
        // Handle parentheses like Ca(OH)2
        const parenPattern = /\(([^)]+)\)(\d+)/g;
        while ((match = parenPattern.exec(simplified)) !== null) {
            const group = match[1];
            const multiplier = parseInt(match[2]);
            
            // Parse elements within parentheses
            const groupElements = {};
            let groupMatch;
            const groupPattern = /([A-Z][a-z]?)(\d*)/g;
            while ((groupMatch = groupPattern.exec(group)) !== null) {
                const elem = groupMatch[1];
                const count = groupMatch[2] ? parseInt(groupMatch[2]) : 1;
                groupElements[elem] = (groupElements[elem] || 0) + count * multiplier;
            }
            
            // Add to main composition
            for (const [elem, count] of Object.entries(groupElements)) {
                composition[elem] = (composition[elem] || 0) + count;
            }
            
            // Remove from formula
            simplified = simplified.replace(match[0], '');
        }
        
        // Parse remaining elements
        while ((match = elementPattern.exec(simplified)) !== null) {
            const element = match[1];
            const count = match[2] ? parseInt(match[2]) : 1;
            
            if (element) {
                composition[element] = (composition[element] || 0) + count;
            }
        }
        
        return composition;
    }

    getMolarMassBreakdown(formula, composition) {
        const breakdown = [];
        
        for (const [element, count] of Object.entries(composition)) {
            const atomicMass = this.atomicMasses[element];
            const contribution = atomicMass * count;
            breakdown.push({
                element: element,
                count: count,
                atomicMass: atomicMass,
                contribution: contribution,
                calculation: count > 1 ? `${count} × ${atomicMass} = ${contribution}` : `${atomicMass}`
            });
        }
        
        return breakdown;
    }

    extractCoefficients(equation, formula1, formula2) {
        // Simple coefficient extraction
        // In a real implementation, would parse the balanced equation
        
        const coeff1Pattern = new RegExp(`(\\d*)\\s*${formula1}`, 'i');
        const coeff2Pattern = new RegExp(`(\\d*)\\s*${formula2}`, 'i');
        
        const match1 = equation.match(coeff1Pattern);
        const match2 = equation.match(coeff2Pattern);
        
        const coeff1 = match1 && match1[1] ? parseInt(match1[1]) : 1;
        const coeff2 = match2 && match2[1] ? parseInt(match2[1]) : 1;
        
        // Determine which is reactant and which is product
        const arrowIndex = equation.indexOf('→');
        const formula1Index = equation.indexOf(formula1);
        const formula2Index = equation.indexOf(formula2);
        
        if (formula1Index < arrowIndex && formula2Index < arrowIndex) {
            return { reactant: coeff1, product: coeff2, acid: coeff1, base: coeff2 };
        } else if (formula1Index < arrowIndex) {
            return { reactant: coeff1, product: coeff2, acid: coeff1, base: coeff2 };
        } else {
            return { reactant: coeff2, product: coeff1, acid: coeff2, base: coeff1 };
        }
    }

    getCoefficient(equation, formula) {
        const pattern = new RegExp(`(\\d*)\\s*${formula}`, 'i');
        const match = equation.match(pattern);
        return match && match[1] ? parseInt(match[1]) : 1;
    }

    convertToWholeNumbers(ratios) {
        const subscripts = {};
        
        // Check if ratios are already close to whole numbers
        let needMultiplier = false;
        let multiplier = 1;
        
        for (const [element, ratio] of Object.entries(ratios)) {
            const rounded = Math.round(ratio);
            if (Math.abs(ratio - rounded) > 0.1) {
                needMultiplier = true;
                break;
            }
        }
        
        if (needMultiplier) {
            // Common multipliers to try
            const multipliers = [2, 3, 4, 5, 6];
            for (const mult of multipliers) {
                let allWhole = true;
                for (const ratio of Object.values(ratios)) {
                    const product = ratio * mult;
                    if (Math.abs(product - Math.round(product)) > 0.1) {
                        allWhole = false;
                        break;
                    }
                }
                if (allWhole) {
                    multiplier = mult;
                    break;
                }
            }
        }
        
        for (const [element, ratio] of Object.entries(ratios)) {
            subscripts[element] = Math.round(ratio * multiplier);
        }
        
        return subscripts;
    }

    buildFormula(subscripts) {
        let formula = '';
        
        // Common element order: C, H, others alphabetically, O last
        const elements = Object.keys(subscripts);
        const ordered = [];
        
        if (subscripts.C) ordered.push('C');
        if (subscripts.H) ordered.push('H');
        
        for (const elem of elements.sort()) {
            if (elem !== 'C' && elem !== 'H' && elem !== 'O') {
                ordered.push(elem);
            }
        }
        
        if (subscripts.O) ordered.push('O');
        
        for (const elem of ordered) {
            formula += elem;
            if (subscripts[elem] > 1) {
                formula += subscripts[elem];
            }
        }
        
        return formula;
    }

    multiplyFormula(formula, n) {
        const composition = this.parseChemicalFormula(formula);
        const newSubscripts = {};
        
        for (const [element, count] of Object.entries(composition)) {
            newSubscripts[element] = count * n;
        }
        
        return this.buildFormula(newSubscripts);
    }

    // ENHANCED STEP GENERATION

    generateStoichiometrySteps(problem, solution) {
        let baseSteps = this.generateBaseStoichiometrySteps(problem, solution);

        // Apply enhancements based on options
        if (this.explanationLevel !== 'basic') {
            baseSteps = baseSteps.map((step, index, array) =>
                this.enhanceStepExplanation(step, problem, solution, index, array.length)
            );
        }

        if (this.includeConceptualConnections) {
            baseSteps = this.addStepBridges(baseSteps, problem);
        }

        if (this.includeErrorPrevention) {
            baseSteps = baseSteps.map(step =>
                this.addErrorPrevention(step, problem.type)
            );
        }

        if (this.explanationLevel === 'scaffolded') {
            baseSteps = this.addScaffolding(baseSteps, problem);
        }

        return baseSteps;
    }

    generateBaseStoichiometrySteps(problem, solution) {
        const { type } = problem;

        switch (type) {
            case 'mole_from_mass':
                return this.generateMoleFromMassSteps(problem, solution);
            case 'mass_mass':
                return this.generateMassMassSteps(problem, solution);
            case 'limiting_reagent':
                return this.generateLimitingReagentSteps(problem, solution);
            case 'percent_yield':
                return this.generatePercentYieldSteps(problem, solution);
            case 'molarity':
                return this.generateMolaritySteps(problem, solution);
            case 'empirical_formula':
                return this.generateEmpiricalFormulaSteps(problem, solution);
            default:
                return this.generateGenericStoichiometrySteps(problem, solution);
        }
    }

    generateMoleFromMassSteps(problem, solution) {
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Identify given information',
            description: 'List what is known and what needs to be found',
            given: {
                mass: `${solution.givenMass} g`,
                formula: solution.formula
            },
            find: 'Number of moles (n)',
            reasoning: 'Clear identification of knowns and unknowns guides the solution path',
            visualHint: 'Think: we have a certain mass and need to convert to moles',
            goalStatement: 'Use the relationship between mass, moles, and molar mass'
        });

        steps.push({
            stepNumber: 2,
            step: 'Calculate molar mass',
            description: `Find the molar mass of ${solution.formula}`,
            formula: solution.formula,
            molarMass: solution.molarMass,
            units: 'g/mol',
            reasoning: 'Molar mass is the conversion factor between grams and moles',
            algebraicRule: 'Molar mass = sum of (atomic mass × subscript) for each element',
            visualHint: 'Molar mass tells us the mass of exactly one mole of substance',
            workingDetails: this.getMolarMassBreakdown(solution.formula, 
                this.parseChemicalFormula(solution.formula))
        });

        steps.push({
            stepNumber: 3,
            step: 'Apply mole formula',
            description: 'Use n = m / M to find moles',
            beforeExpression: `n = m / M`,
            operation: 'substitute values',
            afterExpression: `n = ${solution.givenMass} g / ${solution.molarMass} g/mol`,
            reasoning: 'Dividing mass by molar mass gives the number of moles',
            algebraicRule: 'n = m / M (definition of mole)',
            visualHint: 'We\'re finding how many "batches" of molar mass fit into our mass',
            finalAnswer: true,
            numericalResult: solution.moles
        });

        steps.push({
            stepNumber: 4,
            step: 'Calculate and report answer',
            description: 'Complete the calculation',
            expression: `n = ${solution.moles.toFixed(4)} mol`,
            reasoning: 'This is the number of moles in the given mass',
            units: 'mol',
            significantFigures: 'Report to appropriate sig figs based on given data',
            finalAnswer: true
        });

        return steps;
    }

    generateMassMassSteps(problem, solution) {
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Write and verify balanced equation',
            description: 'Ensure the chemical equation is balanced',
            equation: solution.equation,
            reasoning: 'Balanced equations provide the mole ratio needed for stoichiometry',
            visualHint: 'Check that atom count is equal on both sides',
            algebraicRule: 'Law of Conservation of Mass',
            criticalWarning: 'Never start stoichiometry with an unbalanced equation!'
        });

        steps.push({
            stepNumber: 2,
            step: 'Convert reactant mass to moles',
            description: `Calculate moles of ${solution.reactant.formula}`,
            beforeExpression: `n = m / M`,
            afterExpression: `n = ${solution.reactant.mass} g / ${solution.reactant.molarMass} g/mol = ${solution.reactant.moles} mol`,
            reasoning: 'Must work in moles to use the equation\'s mole ratio',
            visualHint: 'Mass → Moles is the first conversion in stoichiometry',
            workingDetails: {
                givenMass: solution.reactant.mass,
                molarMass: solution.reactant.molarMass,
                resultingMoles: solution.reactant.moles
            }
        });

        steps.push({
            stepNumber: 3,
            step: 'Apply mole ratio',
            description: 'Use coefficients from balanced equation',
            beforeExpression: `${solution.reactant.coefficient} ${solution.reactant.formula} : ${solution.product.coefficient} ${solution.product.formula}`,
            operation: `× (${solution.product.coefficient} / ${solution.reactant.coefficient})`,
            afterExpression: `${solution.product.moles} mol ${solution.product.formula}`,
            reasoning: 'Mole ratio from equation relates amounts of substances',
            algebraicRule: 'Mole ratio = coefficients from balanced equation',
            visualHint: 'Think of the equation as a "recipe" - coefficients show proportions',
            criticalWarning: 'Use coefficients, not subscripts, for mole ratio'
        });

        steps.push({
            stepNumber: 4,
            step: 'Convert product moles to mass',
            description: `Calculate mass of ${solution.product.formula}`,
            beforeExpression: `m = n × M`,
            afterExpression: `m = ${solution.product.moles} mol × ${solution.product.molarMass} g/mol = ${solution.product.mass} g`,
            reasoning: 'Convert back to mass for the final answer',
            visualHint: 'Moles → Mass completes the stoichiometry pathway',
            finalAnswer: true,
            workingDetails: {
                productMoles: solution.product.moles,
                molarMass: solution.product.molarMass,
                finalMass: solution.product.mass
            }
        });

        return steps;
    }

    generateLimitingReagentSteps(problem, solution) {
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Write balanced equation',
            description: 'Verify the equation is balanced',
            equation: solution.equation,
            reasoning: 'Need balanced equation to determine stoichiometric ratios'
        });

        steps.push({
            stepNumber: 2,
            step: 'Convert all reactant masses to moles',
            description: 'Calculate moles for each reactant',
            reactants: solution.reactants.map(r => ({
                formula: r.formula,
                mass: r.mass,
                molarMass: r.molarMass,
                moles: r.moles,
                calculation: `${r.moles} = ${r.mass} / ${r.molarMass}`
            })),
            reasoning: 'Need moles of all reactants to compare ratios',
            visualHint: 'Convert everything to moles first'
        });

        steps.push({
            stepNumber: 3,
            step: 'Calculate moles/coefficient ratio for each reactant',
            description: 'Divide moles by stoichiometric coefficient',
            ratios: solution.reactants.map(r => ({
                formula: r.formula,
                moles: r.moles,
                coefficient: r.coefficient,
                ratio: r.ratio,
                calculation: `${r.ratio.toFixed(4)} = ${r.moles} / ${r.coefficient}`
            })),
            reasoning: 'The reactant with the smallest ratio is the limiting reagent',
            algebraicRule: 'Compare (moles available / coefficient required)',
            criticalWarning: 'Must divide by coefficient, not just compare moles!'
        });

        steps.push({
            stepNumber: 4,
            step: 'Identify limiting reagent',
            description: 'Smallest ratio identifies the limiting reagent',
            limitingReagent: solution.limitingReagent.formula,
            limitingRatio: solution.limitingReagent.ratio,
            reasoning: solution.explanation,
            visualHint: 'Limiting reagent runs out first, like the ingredient that limits your recipe',
            finalAnswer: true
        });

        return steps;
    }

    generatePercentYieldSteps(problem, solution) {
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Identify yields',
            description: 'Determine actual and theoretical yields',
            actualYield: solution.actualYield,
            theoreticalYield: solution.theoreticalYield,
            reasoning: 'Percent yield compares what you got to what you expected',
            visualHint: 'Actual = experimental result; Theoretical = stoichiometric maximum'
        });

        steps.push({
            stepNumber: 2,
            step: 'Apply percent yield formula',
            description: 'Calculate percentage',
            formula: '% yield = (actual / theoretical) × 100%',
            beforeExpression: `% yield = (${solution.actualYield} / ${solution.theoreticalYield}) × 100%`,
            afterExpression: `% yield = ${solution.percentYield.toFixed(2)}%`,
            reasoning: 'This shows the efficiency of the reaction',
            visualHint: 'Percent yield is always ≤ 100% for real reactions',
            finalAnswer: true
        });

        return steps;
    }

    generateMolaritySteps(problem, solution) {
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Identify the molarity relationship',
            description: 'Recall that Molarity (M) = moles / volume (L)',
            formula: 'M = n / V',
            reasoning: 'Molarity is a concentration unit expressing moles per liter',
            visualHint: 'M tells us "how concentrated" the solution is'
        });

        steps.push({
            stepNumber: 2,
            step: 'Substitute known values',
            description: 'Plug in the given information',
            calculation: solution.calculation,
            reasoning: 'Solve for the unknown variable',
            finalAnswer: true
        });

        return steps;
    }

    generateEmpiricalFormulaSteps(problem, solution) {
        const steps = [];

        steps.push({
            stepNumber: 1,
            step: 'Convert percent to mass',
            description: 'Assume 100 g sample, so % = grams',
            percentComposition: solution.percentComposition,
            masses: solution.masses,
            reasoning: 'Assuming 100g makes percentages equal to grams',
            visualHint: '25% of 100g = 25g'
        });

        steps.push({
            stepNumber: 2,
            step: 'Convert mass to moles for each element',
            description: 'Divide each mass by atomic mass',
            moles: solution.moles,
            reasoning: 'Need moles to find mole ratios',
            workingDetails: Object.entries(solution.masses).map(([elem, mass]) => ({
                element: elem,
                mass: mass,
                atomicMass: this.atomicMasses[elem],
                moles: solution.moles[elem],
                calculation: `${solution.moles[elem].toFixed(4)} = ${mass} / ${this.atomicMasses[elem]}`
            }))
        });

        steps.push({
            stepNumber: 3,
            step: 'Divide by smallest number of moles',
            description: 'Find simplest ratio',
            smallestMoles: Math.min(...Object.values(solution.moles)),
            ratios: solution.ratios,
            reasoning: 'Dividing by smallest gives relative ratios',
            visualHint: 'This normalizes to the smallest whole number ratio'
        });

        steps.push({
            stepNumber: 4,
            step: 'Convert to whole number subscripts',
            description: 'Multiply if needed to get whole numbers',
            subscripts: solution.subscripts,
            empiricalFormula: solution.empiricalFormula,
            reasoning: 'Chemical formulas use whole number subscripts',
            finalAnswer: true
        });

        return steps;
    }

    generateGenericStoichiometrySteps(problem, solution) {
        return [{
            stepNumber: 1,
            step: 'Solve stoichiometry problem',
            description: 'Apply appropriate stoichiometric principles',
            solution: solution,
            reasoning: 'Use balanced equations and mole relationships'
        }];
    }

    // ENHANCED EXPLANATION METHODS (similar structure to linear workbook)

    enhanceStepExplanation(step, problem, solution, stepIndex, totalSteps) {
        const enhanced = {
            ...step,
            stepNumber: stepIndex + 1,
            totalSteps: totalSteps,

            explanations: {
                conceptual: this.getConceptualExplanation(step, problem),
                procedural: this.getProceduralExplanation(step),
                visual: this.getVisualExplanation(step, problem),
                mathematical: this.getMathematicalExplanation(step)
            },

            adaptiveExplanation: this.getAdaptiveExplanation(step, this.explanationLevel),

            learningSupport: {
                prerequisiteSkills: this.identifyPrerequisites(step, problem.type),
                keyVocabulary: this.identifyKeyVocabulary(step),
                connectionsToPrevious: stepIndex > 0 ? this.connectToPreviousStep(step, stepIndex) : null
            }
        };

        return enhanced;
    }

    addStepBridges(steps, problem) {
        const enhancedSteps = [];

        for (let i = 0; i < steps.length; i++) {
            enhancedSteps.push(steps[i]);

            if (i < steps.length - 1) {
                enhancedSteps.push({
                    stepType: 'bridge',
                    title: 'Connecting to Next Step',
                    explanation: this.generateStepBridge(steps[i], steps[i + 1]),
                    reasoning: this.explainStepProgression(steps[i], steps[i + 1]),
                    strategicThinking: this.explainStepStrategy(steps[i + 1])
                });
            }
        }

        return enhancedSteps;
    }

    addErrorPrevention(step, problemType) {
        const mistakes = this.commonMistakes[this.getStoichiometryCategoryFromType(problemType)]?.[step.step] || [];

        return {
            ...step,
            errorPrevention: {
                commonMistakes: mistakes,
                preventionTips: this.generatePreventionTips(step, problemType),
                checkPoints: this.generateCheckPoints(step),
                warningFlags: this.identifyWarningFlags(step, problemType)
            },
            validation: {
                selfCheck: this.generateSelfCheckQuestion(step),
                expectedResult: this.describeExpectedResult(step),
                troubleshooting: this.generateTroubleshootingTips(step)
            }
        };
    }

    addScaffolding(steps, problem) {
        return steps.map((step, index) => ({
            ...step,
            scaffolding: {
                guidingQuestions: this.generateGuidingQuestions(step, problem),
                subSteps: this.breakIntoSubSteps(step),
                hints: this.generateProgressiveHints(step),
                practiceVariation: this.generatePracticeVariation(step, problem)
            },
            metacognition: {
                thinkingProcess: this.explainThinkingProcess(step),
                decisionPoints: this.identifyDecisionPoints(step),
                alternativeApproaches: this.suggestAlternativeMethods(step, problem)
            }
        }));
    }

    getStoichiometryCategoryFromType(type) {
        const categoryMap = {
            'mole_from_mass': 'mole_calculations',
            'mass_from_mole': 'mole_calculations',
            'particles_from_mole': 'mole_calculations',
            'mass_mass': 'mass_mass_stoichiometry',
            'mole_mole': 'mass_mass_stoichiometry',
            'limiting_reagent': 'limiting_reagent',
            'molarity': 'solution_stoichiometry',
            'dilution': 'solution_stoichiometry',
            'empirical_formula': 'empirical_molecular',
            'molecular_formula': 'empirical_molecular'
        };
        return categoryMap[type] || 'general';
    }

    // EXPLANATION HELPER METHODS

    getConceptualExplanation(step, problem) {
        const conceptualExplanations = {
            'Identify given information': 'Understanding what we know and what we need to find is the foundation of problem-solving in chemistry.',
            'Calculate molar mass': 'Molar mass bridges the gap between the microscopic world (atoms/molecules) and the macroscopic world (grams we can measure).',
            'Apply mole formula': 'The mole is the chemist\'s counting unit - it allows us to count atoms by weighing them.',
            'Write and verify balanced equation': 'A balanced equation is like a recipe - it tells us the exact proportions in which substances react.',
            'Apply mole ratio': 'The mole ratio is the heart of stoichiometry - it comes from the balanced equation coefficients.',
            'Identify limiting reagent': 'The limiting reagent is like the ingredient that runs out first when following a recipe - it determines how much product you can make.'
        };

        return conceptualExplanations[step.step] || 'This step moves us closer to solving the problem by applying stoichiometric principles.';
    }

    getProceduralExplanation(step) {
        if (step.operation) {
            return `1. Start with: ${step.beforeExpression}
2. Perform the operation: ${step.operation}
3. Result: ${step.afterExpression}
4. Verify units cancel correctly`;
        }
        return 'Follow the systematic approach for this calculation type.';
    }

    getVisualExplanation(step, problem) {
        const visualExplanations = {
            'mole_calculations': 'Imagine moles as "dozen" for atoms - a convenient counting unit for tiny particles.',
            'mass_mass_stoichiometry': 'Picture a factory: reactants go in according to the recipe (equation), products come out in predictable amounts.',
            'limiting_reagent': 'Think of making sandwiches: if you have 10 breads and 5 cheeses, cheese limits how many sandwiches you can make.',
            'solution_stoichiometry': 'Visualize dissolving sugar in water - molarity tells us how "sweet" (concentrated) the solution is.',
            'empirical_molecular': 'Imagine finding the simplest LEGO pattern that repeats to build a structure.'
        };

        const category = this.getStoichiometryCategoryFromType(problem.type);
        return visualExplanations[category] || 'Visualize the chemical transformation and conservation of atoms.';
    }

    getMathematicalExplanation(step) {
        const mathExplanations = {
            'Calculate molar mass': 'Sum = Σ(atomic mass × subscript) for all elements',
            'Apply mole formula': 'n = m / M (direct proportion)',
            'Apply mole ratio': 'n₂ = n₁ × (coeff₂ / coeff₁) (proportional relationship)',
            'Apply percent yield formula': '% = (actual / theoretical) × 100 (percentage calculation)'
        };

        return mathExplanations[step.step] || 'Apply mathematical relationships with proper unit conversions.';
    }

    getAdaptiveExplanation(step, explanationLevel) {
    // Determine level configuration
    const levelConfig = typeof explanationLevel === 'string' ? 
        this.difficultyLevels[explanationLevel] : 
        this.difficultyLevels.intermediate;

    if (!levelConfig) {
        return {
            adaptedDescription: step.description,
            adaptedReasoning: step.reasoning,
            complexityLevel: 'intermediate'
        };
    }

    // Adapt description based on level
    const adaptedDescription = this.adaptLanguageLevel(
        step.description || '', 
        { vocabulary: levelConfig.vocabulary }
    );

    // Adapt reasoning based on level
    const adaptedReasoning = this.adaptLanguageLevel(
        step.reasoning || '', 
        { vocabulary: levelConfig.vocabulary }
    );

    // Add level-specific details
    let additionalExplanation = '';
    let scaffoldingQuestions = [];
    let detailLevel = '';

    switch (explanationLevel) {
        case 'basic':
            additionalExplanation = this.getBasicExplanation(step);
            detailLevel = 'Essential steps only, simple language';
            break;

        case 'intermediate':
            additionalExplanation = this.getIntermediateExplanation(step);
            detailLevel = 'Main steps with brief explanations';
            break;

        case 'detailed':
            additionalExplanation = this.getDetailedExplanation(step);
            detailLevel = 'Comprehensive explanations with theory and context';
            break;

        case 'scaffolded':
            scaffoldingQuestions = this.getScaffoldingQuestions(step);
            additionalExplanation = this.getScaffoldedExplanation(step);
            detailLevel = 'Guided discovery with progressive questions';
            break;

        default:
            additionalExplanation = step.reasoning || '';
            detailLevel = 'Standard explanation';
    }

    return {
        adaptedDescription: adaptedDescription,
        adaptedReasoning: adaptedReasoning,
        additionalExplanation: additionalExplanation,
        scaffoldingQuestions: scaffoldingQuestions,
        complexityLevel: explanationLevel,
        detailLevel: detailLevel,
        vocabulary: levelConfig.vocabulary,
        examples: this.getExamplesForLevel(step, explanationLevel)
    };
}

getBasicExplanation(step) {
    const basicExplanations = {
        'Identify given information': 'Write down what numbers and chemicals you have.',
        'Calculate molar mass': 'Add up the weights of all atoms in the formula.',
        'Apply mole formula': 'Divide grams by molar mass to get moles.',
        'Convert reactant mass to moles': 'Change grams into moles by dividing.',
        'Apply mole ratio': 'Use the numbers in front of formulas to find the relationship.',
        'Convert product moles to mass': 'Change moles back to grams by multiplying.',
        'Identify limiting reagent': 'Find which starting material runs out first.',
        'Calculate percent yield': 'Compare what you got to what you expected.',
        'Write and verify balanced equation': 'Make sure atoms are equal on both sides.'
    };

    return basicExplanations[step.step] || 'Follow the steps to solve the problem.';
}

getIntermediateExplanation(step) {
    const intermediateExplanations = {
        'Identify given information': 'Carefully list all provided data including masses, volumes, concentrations, and chemical formulas. Identify what needs to be calculated.',
        'Calculate molar mass': 'Sum the atomic masses of all atoms in the compound, accounting for subscripts and parentheses. Use the periodic table for atomic masses.',
        'Apply mole formula': 'Use the relationship n = m/M where n is moles, m is mass in grams, and M is molar mass in g/mol.',
        'Convert reactant mass to moles': 'Divide the given mass by the molar mass to convert from grams to moles, which is necessary for stoichiometric calculations.',
        'Apply mole ratio': 'Use the coefficients from the balanced equation to establish the ratio between reactants and products. This is the heart of stoichiometry.',
        'Convert product moles to mass': 'Multiply the calculated moles by the molar mass to convert back to grams for the final answer.',
        'Identify limiting reagent': 'Calculate the moles/coefficient ratio for each reactant. The reactant with the smallest ratio is the limiting reagent.',
        'Calculate percent yield': 'Use the formula: % yield = (actual yield / theoretical yield) × 100% to determine reaction efficiency.',
        'Write and verify balanced equation': 'Ensure the equation is balanced by checking that the number of each type of atom is the same on both sides.'
    };

    return intermediateExplanations[step.step] || 'Apply standard stoichiometric principles for this step.';
}

getDetailedExplanation(step) {
    const detailedExplanations = {
        'Identify given information': 'Systematic identification of all given information is crucial for problem-solving. List masses (in grams), molar masses (g/mol), volumes (L), concentrations (M), and chemical formulas. Clearly distinguish between what is known and what must be calculated. This organizational step prevents errors and provides a roadmap for the solution.',

        'Calculate molar mass': 'Molar mass (M) is the mass of one mole of a substance, expressed in g/mol. It is calculated by summing the products of each element\'s atomic mass and its subscript in the formula. For compounds with parentheses, multiply the subscript outside the parentheses by all subscripts inside. The molar mass serves as the conversion factor between the macroscopic world (grams we can measure) and the molecular world (moles of particles).',

        'Apply mole formula': 'The fundamental relationship n = m/M connects mass to moles. This equation embodies the definition of the mole: the amount of substance containing Avogadro\'s number (6.022 × 10²³) of particles. The molar mass M acts as the conversion factor, telling us how many grams equal one mole. This conversion is essential because chemical equations relate substances in terms of moles, not grams.',

        'Convert reactant mass to moles': 'Converting mass to moles is the mandatory first step in stoichiometric calculations. Given mass cannot be used directly with equation coefficients; the conversion through moles is required because balanced equations provide mole ratios, not mass ratios. Use n = m/M, ensuring mass is in grams and molar mass in g/mol for unit consistency.',

        'Apply mole ratio': 'The mole ratio, derived from the coefficients of the balanced chemical equation, represents the fundamental stoichiometric relationship between substances in a reaction. For the equation aA + bB → cC + dD, the ratio of moles of A to moles of C is a:c. This ratio is constant regardless of the amount of material and reflects the molecular-level reaction mechanism. Calculate: moles of product = (moles of reactant) × (coefficient of product / coefficient of reactant).',

        'Convert product moles to mass': 'After calculating moles of the desired substance using stoichiometry, convert back to mass using m = n × M. This step translates the molecular-scale calculation back to macroscopic, measurable quantities. The molar mass again serves as the bridge, now multiplying instead of dividing to move from moles to grams.',

        'Identify limiting reagent': 'The limiting reagent is the reactant that is completely consumed first, thereby limiting the amount of product that can form. It is identified by comparing the ratio (moles available / stoichiometric coefficient) for each reactant. The reactant with the smallest ratio is limiting. This concept is fundamental in real-world chemistry where reactants are rarely provided in exact stoichiometric proportions. All product calculations must be based solely on the limiting reagent amount.',

        'Calculate percent yield': 'Percent yield quantifies reaction efficiency by comparing actual experimental yield to theoretical (stoichiometrically predicted) yield: % yield = (actual/theoretical) × 100%. Yields below 100% are normal due to side reactions, incomplete reactions, equilibrium limitations, product loss during purification, and measurement uncertainties. Yields above 100% indicate experimental error, such as impure product or measurement mistakes. This metric is critical in industrial chemistry for process optimization and cost analysis.',

        'Write and verify balanced equation': 'A balanced chemical equation is the foundation of all stoichiometric calculations. It must satisfy the law of conservation of mass: the number of atoms of each element must be identical on both sides. Balancing involves adjusting coefficients (never subscripts) to achieve this equality. Verification requires counting atoms of each element on both sides. Only balanced equations provide the correct mole ratios for stoichiometric calculations.'
    };

    return detailedExplanations[step.step] || 'This step applies fundamental stoichiometric principles based on the law of conservation of mass and definite proportions. The calculation maintains dimensional consistency and chemical accuracy throughout.';
}

getScaffoldedExplanation(step) {
    const scaffoldedExplanations = {
        'Identify given information': 'Let\'s start by organizing what we know. What information does the problem give us? What are we trying to find? Writing this down clearly helps us see the path to the solution.',

        'Calculate molar mass': 'To find molar mass, we need to add up the "weights" of all the atoms. Which elements are in the formula? How many of each do we have? Let\'s look at the periodic table to find each atomic mass, then add them together carefully.',

        'Apply mole formula': 'Now we need to convert between grams and moles. Think about what we\'re starting with (grams) and what we need (moles). Which formula helps us do this conversion? Remember: dividing by molar mass takes us from grams to moles.',

        'Convert reactant mass to moles': 'Before we can use the equation, we must work in moles. We have grams right now. What do we need to divide by to get moles? That\'s right—the molar mass! Let\'s calculate that first if we haven\'t already.',

        'Apply mole ratio': 'Here\'s where the balanced equation helps us! The numbers in front (coefficients) tell us the mole relationship. If we have a certain number of moles of one substance, how can we find the moles of another? Set up the ratio and multiply.',

        'Convert product moles to mass': 'We\'ve found moles of our product, but the question asks for grams. How do we go from moles back to grams? We multiply by molar mass this time—it\'s the reverse of what we did earlier!',

        'Identify limiting reagent': 'When we have multiple starting materials, which one limits how much product we can make? To find out, we calculate moles ÷ coefficient for each reactant. The smallest number tells us the limiting reagent. Why? Because that reagent will run out first!',

        'Calculate percent yield': 'How efficient was the reaction? We compare what we actually got (actual yield) to what we could have gotten (theoretical yield). The formula is: percent = (actual ÷ theoretical) × 100. What does it mean if this number is 80%? What if it\'s over 100%?',

        'Write and verify balanced equation': 'Is the equation balanced? Let\'s check each element. Count the atoms on the left side... now count the atoms on the right side. Are they equal? If not, we need to adjust coefficients (the numbers in front) until they match.'
    };

    return scaffoldedExplanations[step.step] || 'Let\'s think through this step together. What do we know? What do we need? What mathematical relationship connects them?';
}

getScaffoldingQuestions(step) {
    const questionSets = {
        'Identify given information': [
            'What information does the problem provide?',
            'What are we being asked to find?',
            'What units are the given values in?',
            'Do we have everything we need, or do we need to calculate something first?'
        ],
        'Calculate molar mass': [
            'What elements are in this compound?',
            'How many of each atom are present?',
            'Where do we find the atomic mass for each element?',
            'How do we handle subscripts when calculating?',
            'What are the units of molar mass?'
        ],
        'Apply mole formula': [
            'What relationship connects mass and moles?',
            'Which value goes in the numerator? The denominator?',
            'Are our units consistent (grams and g/mol)?',
            'Does our answer make sense in magnitude?'
        ],
        'Convert reactant mass to moles': [
            'Why do we need to convert to moles?',
            'What is the formula for this conversion?',
            'Do we multiply or divide by molar mass?',
            'Are we starting with grams?'
        ],
        'Apply mole ratio': [
            'Where do we get the mole ratio?',
            'What numbers from the equation do we use?',
            'Do we use coefficients or subscripts?',
            'How do we set up the ratio correctly?',
            'Which substance are we starting with? Which are we finding?'
        ],
        'Convert product moles to mass': [
            'Do we multiply or divide to go from moles to grams?',
            'Why is this the opposite operation from before?',
            'What molar mass do we use for this step?',
            'Are the units working out correctly?'
        ],
        'Identify limiting reagent': [
            'What does "limiting reagent" mean?',
            'Why do we divide moles by the coefficient?',
            'What does the smallest ratio tell us?',
            'Which reactant will run out first?',
            'Can we use the excess reagent to calculate products?'
        ],
        'Calculate percent yield': [
            'What is the difference between actual and theoretical yield?',
            'Which number goes in the numerator?',
            'Why do we multiply by 100?',
            'What does a percent yield of 75% mean?',
            'Is it possible to get over 100%? What would that indicate?'
        ],
        'Write and verify balanced equation': [
            'What does it mean for an equation to be balanced?',
            'How do we count atoms on each side?',
            'What can we change to balance: coefficients or subscripts?',
            'Are all elements balanced now?',
            'Why is balancing important for stoichiometry?'
        ]
    };

    return questionSets[step.step] || [
        'What is this step trying to accomplish?',
        'What information do we need?',
        'What formula or principle applies?',
        'How do we verify our answer?'
    ];
}

getExamplesForLevel(step, level) {
    const examples = {
        basic: {
            'Calculate molar mass': 'For H₂O: H is 1 g/mol, O is 16 g/mol. We have 2 H atoms, so: 2(1) + 16 = 18 g/mol',
            'Apply mole formula': 'If we have 36 g of H₂O and molar mass is 18 g/mol: 36 ÷ 18 = 2 moles',
            'Apply mole ratio': 'In 2H₂ + O₂ → 2H₂O, the ratio of H₂ to H₂O is 2:2 or 1:1. So 3 moles H₂ makes 3 moles H₂O'
        },
        intermediate: {
            'Calculate molar mass': 'For Ca(OH)₂: Ca = 40.08, O = 16.00, H = 1.008. Total: 40.08 + 2(16.00 + 1.008) = 74.096 g/mol',
            'Apply mole formula': 'Given 150 g NaCl with M = 58.44 g/mol: n = 150/58.44 = 2.57 mol',
            'Apply mole ratio': 'From N₂ + 3H₂ → 2NH₃, if we have 5 mol N₂: (5 mol N₂)(2 mol NH₃/1 mol N₂) = 10 mol NH₃'
        },
        detailed: {
            'Calculate molar mass': 'For Al₂(SO₄)₃: M = 2(26.98) + 3[32.06 + 4(16.00)] = 53.96 + 3(96.06) = 342.14 g/mol. Note the parentheses multiply all subscripts inside.',
            'Apply mole formula': 'Converting 250.0 g of glucose (C₆H₁₂O₆, M = 180.16 g/mol): n = 250.0/180.16 = 1.388 mol, reported to 4 sig figs',
            'Apply mole ratio': 'For 2C₈H₁₈ + 25O₂ → 16CO₂ + 18H₂O, calculate CO₂ from 10.0 mol C₈H₁₈: (10.0 mol)(16/2) = 80.0 mol CO₂'
        },
        scaffolded: {
            'Calculate molar mass': 'Let\'s do H₂SO₄ step by step: H: 2 × 1.008 = 2.016; S: 1 × 32.06 = 32.06; O: 4 × 16.00 = 64.00; Total: 98.076 g/mol',
            'Apply mole formula': 'We have 100 g and want moles. We know n = m/M. If M = 50 g/mol, then n = 100/50 = 2 mol. Try it yourself with different numbers!',
            'Apply mole ratio': 'In 2Na + Cl₂ → 2NaCl: If I start with 4 mol Na, the equation says 2 mol Na makes 2 mol NaCl. So 4 mol Na makes... ? That\'s right, 4 mol NaCl!'
        }
    };

    const levelExamples = examples[level] || examples.intermediate;
    return levelExamples[step.step] || 'Practice with similar problems to build understanding.';
}

generateStoichiometryDiagramData() {
    if (!this.currentSolution) return;

    const { type } = this.currentProblem;
    const solution = this.currentSolution;

    switch(type) {
        case 'mole_from_mass':
        case 'mass_from_mole':
        case 'particles_from_mole':
        case 'mole_from_particles':
            this.diagramData = this.generateMoleConversionDiagram(solution, type);
            break;

        case 'molar_mass':
            this.diagramData = this.generateMolarMassDiagram(solution);
            break;

        case 'mass_mass':
        case 'mole_mole':
            this.diagramData = this.generateStoichiometryPathwayDiagram(solution);
            break;

        case 'limiting_reagent':
            this.diagramData = this.generateLimitingReagentDiagram(solution);
            break;

        case 'percent_yield':
            this.diagramData = this.generatePercentYieldDiagram(solution);
            break;

        case 'molarity':
        case 'dilution':
        case 'solution_stoichiometry':
            this.diagramData = this.generateSolutionDiagram(solution, type);
            break;

        case 'gas_stoichiometry':
            this.diagramData = this.generateGasStoichiometryDiagram(solution);
            break;

        case 'empirical_formula':
        case 'molecular_formula':
            this.diagramData = this.generateFormulaDiagram(solution, type);
            break;

        case 'combustion_analysis':
            this.diagramData = this.generateCombustionDiagram(solution);
            break;

        case 'titration':
            this.diagramData = this.generateTitrationDiagram(solution);
            break;

        default:
            this.diagramData = this.generateGenericDiagram(solution);
    }
}

generateMoleConversionDiagram(solution, type) {
    const conversionTypes = {
        'mole_from_mass': {
            from: 'Mass (g)',
            to: 'Moles (mol)',
            operation: '÷ Molar Mass',
            formula: 'n = m / M'
        },
        'mass_from_mole': {
            from: 'Moles (mol)',
            to: 'Mass (g)',
            operation: '× Molar Mass',
            formula: 'm = n × M'
        },
        'particles_from_mole': {
            from: 'Moles (mol)',
            to: 'Particles',
            operation: '× Avogadro\'s Number',
            formula: 'N = n × NA'
        },
        'mole_from_particles': {
            from: 'Particles',
            to: 'Moles (mol)',
            operation: '÷ Avogadro\'s Number',
            formula: 'n = N / NA'
        }
    };

    const conversionInfo = conversionTypes[type];

    return {
        type: 'mole_conversion',
        title: 'Mole Conversion Pathway',
        formula: solution.formula || 'Chemical substance',
        molarMass: solution.molarMass,
        pathway: [
            {
                stage: 'Start',
                label: conversionInfo.from,
                value: type === 'mole_from_mass' ? solution.givenMass : 
                       type === 'mass_from_mole' ? solution.givenMoles :
                       type === 'particles_from_mole' ? solution.moles :
                       solution.particles
            },
            {
                stage: 'Conversion',
                label: conversionInfo.operation,
                factor: type.includes('mass') ? solution.molarMass : this.avogadroNumber
            },
            {
                stage: 'Result',
                label: conversionInfo.to,
                value: type === 'mole_from_mass' ? solution.moles :
                       type === 'mass_from_mole' ? solution.mass :
                       type === 'particles_from_mole' ? solution.particles :
                       solution.moles
            }
        ],
        formula_used: conversionInfo.formula,
        visualization: 'arrow_diagram'
    };
}

generateMolarMassDiagram(solution) {
    return {
        type: 'molar_mass_breakdown',
        title: 'Molar Mass Calculation',
        formula: solution.formula,
        totalMolarMass: solution.molarMass,
        breakdown: solution.breakdown || [],
        composition: solution.composition,
        visualization: 'table_breakdown',
        pieChart: {
            elements: Object.keys(solution.composition || {}),
            percentages: this.calculateElementPercentages(solution.formula, solution.molarMass)
        }
    };
}

generateStoichiometryPathwayDiagram(solution) {
    return {
        type: 'stoichiometry_pathway',
        title: 'Complete Stoichiometry Pathway',
        equation: solution.equation,
        pathway: [
            {
                step: 1,
                stage: 'Mass A',
                substance: solution.reactant.formula,
                value: solution.reactant.mass,
                unit: 'g',
                color: '#e3f2fd'
            },
            {
                step: 2,
                stage: 'Moles A',
                substance: solution.reactant.formula,
                value: solution.reactant.moles,
                unit: 'mol',
                operation: '÷ ' + solution.reactant.molarMass + ' g/mol',
                color: '#bbdefb'
            },
            {
                step: 3,
                stage: 'Moles B',
                substance: solution.product.formula,
                value: solution.product.moles,
                unit: 'mol',
                operation: '× (' + solution.product.coefficient + '/' + solution.reactant.coefficient + ')',
                moleRatio: solution.moleRatio,
                color: '#c8e6c9'
            },
            {
                step: 4,
                stage: 'Mass B',
                substance: solution.product.formula,
                value: solution.product.mass,
                unit: 'g',
                operation: '× ' + solution.product.molarMass + ' g/mol',
                color: '#a5d6a7'
            }
        ],
        moleRatioBox: {
            label: 'Key: Mole Ratio from Equation',
            ratio: solution.moleRatio,
            explanation: 'Coefficients from balanced equation'
        },
        visualization: 'flow_diagram'
    };
}

generateLimitingReagentDiagram(solution) {
    return {
        type: 'limiting_reagent_analysis',
        title: 'Limiting Reagent Determination',
        equation: solution.equation,
        reactants: solution.reactants.map(r => ({
            formula: r.formula,
            mass: r.mass,
            molarMass: r.molarMass,
            moles: r.moles,
            coefficient: r.coefficient,
            ratio: r.ratio,
            isLimiting: r.formula === solution.limitingReagent.formula,
            color: r.formula === solution.limitingReagent.formula ? '#ffcdd2' : '#c8e6c9'
        })),
        limitingReagent: solution.limitingReagent.formula,
        excessReagents: solution.excessReagents.map(e => e.formula),
        comparisonTable: {
            headers: ['Reactant', 'Moles', 'Coefficient', 'Moles/Coeff', 'Status'],
            rows: solution.reactants.map(r => [
                r.formula,
                r.moles.toFixed(4),
                r.coefficient,
                r.ratio.toFixed(4),
                r.formula === solution.limitingReagent.formula ? 'LIMITING ⚠️' : 'Excess'
            ])
        },
        visualization: 'comparison_table'
    };
}

generatePercentYieldDiagram(solution) {
    return {
        type: 'percent_yield',
        title: 'Percent Yield Analysis',
        theoreticalYield: solution.theoreticalYield,
        actualYield: solution.actualYield,
        percentYield: solution.percentYield,
        barChart: {
            theoretical: {
                value: solution.theoreticalYield,
                label: 'Theoretical (100%)',
                color: '#4caf50'
            },
            actual: {
                value: solution.actualYield,
                label: 'Actual (' + solution.percentYield.toFixed(1) + '%)',
                color: '#2196f3'
            },
            lost: {
                value: solution.theoreticalYield - solution.actualYield,
                label: 'Lost/Unreacted',
                color: '#f44336'
            }
        },
        interpretation: solution.percentYield <= 100 ? 'Normal yield' : 'Error: yield > 100%',
        visualization: 'bar_chart'
    };
}

generateSolutionDiagram(solution, type) {
    if (type === 'molarity') {
        return {
            type: 'molarity_triangle',
            title: 'Molarity Relationship',
            molarity: solution.molarity,
            moles: solution.moles,
            volume: solution.volume,
            triangle: {
                top: 'n (moles)',
                bottomLeft: 'M (molarity)',
                bottomRight: 'V (volume)',
                relationships: [
                    'M = n / V',
                    'n = M × V',
                    'V = n / M'
                ]
            },
            beakerDiagram: {
                substance: solution.formula || 'Solute',
                concentration: solution.molarity + ' M',
                volume: solution.volume + ' L'
            },
            visualization: 'triangle_beaker'
        };
    } else if (type === 'dilution') {
        return {
            type: 'dilution_diagram',
            title: 'Dilution Process',
            M1: solution.M1,
            V1: solution.V1,
            M2: solution.M2,
            V2: solution.V2,
            stages: [
                {
                    stage: 'Concentrated',
                    molarity: solution.M1,
                    volume: solution.V1,
                    color: '#1565c0'
                },
                {
                    stage: 'Add Solvent',
                    volumeAdded: solution.V2 - solution.V1,
                    color: '#90caf9'
                },
                {
                    stage: 'Diluted',
                    molarity: solution.M2,
                    volume: solution.V2,
                    color: '#64b5f6'
                }
            ],
            conservation: 'M₁V₁ = M₂V₂ = ' + (solution.M1 * solution.V1).toFixed(4),
            visualization: 'beaker_sequence'
        };
    } else {
        return {
            type: 'solution_stoichiometry',
            title: 'Solution Reaction',
            equation: solution.equation,
            reactant: solution.reactant,
            product: solution.product,
            visualization: 'reaction_beakers'
        };
    }
}

generateGasStoichiometryDiagram(solution) {
    if (solution.useSTP) {
        return {
            type: 'gas_stp',
            title: 'Gas Stoichiometry at STP',
            conditions: {
                temperature: '0°C (273 K)',
                pressure: '1 atm',
                molarVolume: '22.4 L/mol'
            },
            calculation: {
                moles: solution.moles,
                volume: solution.volume,
                relationship: '1 mol = 22.4 L at STP'
            },
            gasBalloon: {
                volume: solution.volume + ' L',
                moles: solution.moles + ' mol',
                color: '#fff9c4'
            },
            visualization: 'balloon_stp'
        };
    } else {
        return {
            type: 'gas_ideal_law',
            title: 'Ideal Gas Law Application',
            formula: 'PV = nRT',
            values: {
                P: solution.pressure + ' atm',
                V: solution.volume + ' L',
                n: solution.moles + ' mol',
                R: this.gasConstant + ' L·atm/(mol·K)',
                T: solution.temperature + ' K'
            },
            gasBalloon: {
                conditions: `P = ${solution.pressure} atm, T = ${solution.temperature} K`,
                volume: solution.volume + ' L',
                color: '#fff9c4'
            },
            visualization: 'balloon_ideal_gas'
        };
    }
}

generateFormulaDiagram(solution, type) {
    if (type === 'empirical_formula') {
        return {
            type: 'empirical_formula_flow',
            title: 'Empirical Formula Determination',
            steps: [
                {
                    step: 1,
                    label: 'Percent Composition',
                    data: solution.percentComposition,
                    visual: 'pie_chart'
                },
                {
                    step: 2,
                    label: 'Assume 100g Sample',
                    data: solution.masses,
                    visual: 'mass_blocks'
                },
                {
                    step: 3,
                    label: 'Convert to Moles',
                    data: solution.moles,
                    visual: 'mole_boxes'
                },
                {
                    step: 4,
                    label: 'Divide by Smallest',
                    data: solution.ratios,
                    visual: 'ratio_bars'
                },
                {
                    step: 5,
                    label: 'Whole Number Subscripts',
                    data: solution.subscripts,
                    visual: 'formula_result'
                }
            ],
            empiricalFormula: solution.empiricalFormula,
            visualization: 'step_flow'
        };
    } else {
        return {
            type: 'molecular_formula',
            title: 'Molecular Formula from Empirical',
            empiricalFormula: solution.empiricalFormula,
            empiricalMass: solution.empiricalMass,
            molecularMass: solution.molarMass,
            multiplier: solution.n,
            molecularFormula: solution.molecularFormula,
            relationship: `${solution.molecularFormula} = (${solution.empiricalFormula})${solution.n}`,
            visualization: 'formula_multiplication'
        };
    }
}

generateCombustionDiagram(solution) {
    return {
        type: 'combustion_analysis',
        title: 'Combustion Analysis Flow',
        combustionReaction: 'CₓHₓOₓ + O₂ → CO₂ + H₂O',
        products: {
            CO2: {
                mass: solution.CO2mass,
                moles: solution.carbonData.moles,
                carbonMoles: solution.carbonData.moles,
                arrow: '→ C atoms'
            },
            H2O: {
                mass: solution.H2Omass,
                moles: solution.hydrogenData.moles / 2,
                hydrogenMoles: solution.hydrogenData.moles,
                arrow: '→ H atoms'
            }
        },
        oxygenByDifference: solution.oxygenData,
        elementalComposition: solution.moles,
        empiricalFormula: solution.empiricalFormula,
        visualization: 'combustion_flow'
    };
}

generateTitrationDiagram(solution) {
    return {
        type: 'titration',
        title: 'Titration Analysis',
        equation: solution.equation,
        titrationSetup: {
            flask: {
                substance: solution.acid ? solution.acid.formula : 'Unknown',
                volume: solution.acid ? solution.acid.volume : 0,
                molarity: solution.acid ? solution.acid.molarity : 'Unknown'
            },
            burette: {
                substance: solution.base ? solution.base.formula : 'Titrant',
                volumeAdded: solution.base ? solution.base.volume : 0,
                molarity: solution.base ? solution.base.molarity : 0
            }
        },
        moleCalculations: {
            substance1: {
                formula: solution.acid?.formula || 'Acid',
                moles: solution.acid?.moles || 0,
                calculation: 'M × V'
            },
            substance2: {
                formula: solution.base?.formula || 'Base',
                moles: solution.base?.moles || 0,
                calculation: 'M × V'
            }
        },
        moleRatio: solution.moleRatio,
        equivalencePoint: 'Stoichiometric amounts reacted',
        visualization: 'titration_setup'
    };
}

generateGenericDiagram(solution) {
    return {
        type: 'generic_stoichiometry',
        title: 'Stoichiometry Problem',
        problemType: solution.problemType,
        keyValues: this.extractKeyValues(solution),
        visualization: 'summary_table'
    };
}

extractKeyValues(solution) {
    const keyValues = [];
    
    if (solution.moles !== undefined) keyValues.push({ label: 'Moles', value: solution.moles });
    if (solution.mass !== undefined) keyValues.push({ label: 'Mass', value: solution.mass + ' g' });
    if (solution.molarMass !== undefined) keyValues.push({ label: 'Molar Mass', value: solution.molarMass + ' g/mol' });
    if (solution.molarity !== undefined) keyValues.push({ label: 'Molarity', value: solution.molarity + ' M' });
    if (solution.volume !== undefined) keyValues.push({ label: 'Volume', value: solution.volume + ' L' });
    if (solution.percentYield !== undefined) keyValues.push({ label: 'Percent Yield', value: solution.percentYield + '%' });
    
    return keyValues;
}

calculateElementPercentages(formula, molarMass) {
    const composition = this.parseChemicalFormula(formula);
    const percentages = {};
    
    for (const [element, count] of Object.entries(composition)) {
        const elementMass = count * this.atomicMasses[element];
        percentages[element] = ((elementMass / molarMass) * 100).toFixed(2);
    }
    
    return percentages;
}

// ============================================================================
// COMPLETE WORKBOOK GENERATION
// ============================================================================

generateStoichiometryWorkbook() {
    if (!this.currentSolution || !this.currentProblem) {
        console.warn('Cannot generate workbook: missing solution or problem data');
        return;
    }

    const workbook = this.createWorkbookStructure();

    workbook.sections = [
        this.createProblemSection(),
        this.createGivenDataSection(),
        this.createConceptualOverviewSection(),
        this.createEnhancedStepsSection(),
        this.createLessonSection(),
        this.createSolutionSection(),
        this.createAnalysisSection(),
        this.createVerificationSection(),
        this.createDiagramSection(),
        this.createKeyFormulasSection(),
        this.createCommonMistakesSection(),
        this.createPedagogicalNotesSection(),
        this.createAlternativeMethodsSection(),
        this.createPracticeProblemsSection(),
        this.createReferenceSection()
    ].filter(section => section !== null);

    this.currentWorkbook = workbook;
    return workbook;
}

createWorkbookStructure() {
    return {
        title: 'Enhanced Stoichiometry Mathematical Workbook',
        subtitle: this.stoichiometryTypes[this.currentProblem.type]?.name || 'Stoichiometry Problem',
        timestamp: new Date().toISOString(),
        theme: this.theme,
        dimensions: { width: this.width, height: this.height },
        explanationLevel: this.explanationLevel,
        features: {
            verification: this.includeVerificationInSteps,
            errorPrevention: this.includeErrorPrevention,
            pedagogicalNotes: this.includePedagogicalNotes,
            alternativeMethods: this.includeAlternativeMethods
        },
        sections: []
    };
}

createProblemSection() {
    if (!this.currentProblem) return null;

    const problemData = [
        ['Problem Type', this.stoichiometryTypes[this.currentProblem.type]?.name || this.currentProblem.type],
        ['Category', this.stoichiometryTypes[this.currentProblem.type]?.category || 'General Stoichiometry'],
        ['Description', this.stoichiometryTypes[this.currentProblem.type]?.description || 'Stoichiometry calculation']
    ];

    if (this.currentProblem.scenario) {
        problemData.push(['Scenario', this.currentProblem.scenario]);
    }

    return {
        title: 'Problem Statement',
        type: 'problem',
        data: problemData,
        styling: {
            headerColor: this.colors.headerBg,
            backgroundColor: this.colors.sectionBg
        }
    };
}

createGivenDataSection() {
    const { parameters } = this.currentProblem;
    const givenData = [];

    // Add all provided parameters
    const parameterMap = {
        mass: { label: 'Mass', unit: 'g' },
        moles: { label: 'Moles', unit: 'mol' },
        formula: { label: 'Chemical Formula', unit: '' },
        equation: { label: 'Chemical Equation', unit: '' },
        molarity: { label: 'Molarity', unit: 'M' },
        volume: { label: 'Volume', unit: 'L' },
        actualYield: { label: 'Actual Yield', unit: 'g' },
        theoreticalYield: { label: 'Theoretical Yield', unit: 'g' },
        pressure: { label: 'Pressure', unit: 'atm' },
        temperature: { label: 'Temperature', unit: 'K' },
        percentComposition: { label: 'Percent Composition', unit: '' },
        molarMass: { label: 'Molar Mass', unit: 'g/mol' },
        particles: { label: 'Number of Particles', unit: '' }
    };

    for (const [key, info] of Object.entries(parameterMap)) {
        if (parameters[key] !== undefined) {
            const value = typeof parameters[key] === 'object' ? 
                JSON.stringify(parameters[key]) : 
                parameters[key];
            givenData.push([info.label, `${value}${info.unit ? ' ' + info.unit : ''}`]);
        }
    }

    // Add reactants array if present
    if (parameters.reactants && Array.isArray(parameters.reactants)) {
        parameters.reactants.forEach((r, i) => {
            givenData.push([`Reactant ${i + 1}`, `${r.formula}: ${r.mass} g`]);
        });
    }

    if (givenData.length === 0) return null;

    return {
        title: 'Given Information',
        type: 'given_data',
        data: givenData,
        styling: {
            backgroundColor: this.colors.formulaBg
        }
    };
}

createConceptualOverviewSection() {
    const { type } = this.currentProblem;
    const category = this.getStoichiometryCategoryFromType(type);
    
    const overviewData = [
        ['Problem Category', category],
        ['Key Concept', this.getKeyConcept(type)],
        ['Main Formula', this.getMainFormula(type)],
        ['Expected Output', this.getExpectedOutput(type)]
    ];

    return {
        title: 'Conceptual Overview',
        type: 'overview',
        data: overviewData,
        styling: {
            backgroundColor: this.colors.mathBg
        }
    };
}

getKeyConcept(type) {
    const concepts = {
        'mole_from_mass': 'Converting mass to moles using molar mass',
        'mass_from_mole': 'Converting moles to mass using molar mass',
        'molar_mass': 'Calculating the mass of one mole of substance',
        'mass_mass': 'Using balanced equations to relate masses',
        'limiting_reagent': 'Identifying which reactant limits product formation',
        'percent_yield': 'Comparing actual to theoretical yield',
        'molarity': 'Concentration as moles per liter',
        'dilution': 'Decreasing concentration by adding solvent',
        'empirical_formula': 'Simplest whole number ratio of atoms',
        'gas_stoichiometry': 'Gas calculations using ideal gas law or STP'
    };
    
    return concepts[type] || 'Stoichiometric calculations';
}

getMainFormula(type) {
    const formulas = {
        'mole_from_mass': 'n = m / M',
        'mass_from_mole': 'm = n × M',
        'molar_mass': 'M = Σ(atomic mass × subscript)',
        'mass_mass': 'mass A → moles A → moles B → mass B',
        'limiting_reagent': 'Compare (moles / coefficient) for each reactant',
        'percent_yield': '% yield = (actual / theoretical) × 100%',
        'molarity': 'M = n / V',
        'dilution': 'M₁V₁ = M₂V₂',
        'empirical_formula': '% → mass → moles → ratio → subscripts',
        'gas_stoichiometry': 'PV = nRT or V = n × 22.4 L/mol at STP'
    };
    
    return formulas[type] || 'Standard stoichiometric relationships';
}

getExpectedOutput(type) {
    const outputs = {
        'mole_from_mass': 'Number of moles (mol)',
        'mass_from_mole': 'Mass in grams (g)',
        'molar_mass': 'Molar mass (g/mol)',
        'mass_mass': 'Mass of product (g)',
        'limiting_reagent': 'Identity of limiting reagent',
        'percent_yield': 'Percentage (%)',
        'molarity': 'Concentration (M or mol/L)',
        'dilution': 'Final concentration or volume',
        'empirical_formula': 'Simplest formula',
        'gas_stoichiometry': 'Moles, volume, or other gas property'
    };
    
    return outputs[type] || 'Calculated value with units';
}

createKeyFormulasSection() {
    const { type } = this.currentProblem;
    const formulas = this.getRelevantFormulas(type);

    if (!formulas || formulas.length === 0) return null;

    const formulaData = [
        ['Essential Formulas for This Problem', ''],
        ['', '']
    ];

    formulas.forEach(f => {
        formulaData.push([f.name, f.formula]);
        if (f.description) {
            formulaData.push(['Description', f.description]);
        }
        formulaData.push(['', '']);
    });

    return {
        title: 'Key Formulas Reference',
        type: 'formulas',
        data: formulaData,
        styling: {
            backgroundColor: this.colors.formulaBg
        }
    };
}

getRelevantFormulas(type) {
    const formulaDatabase = {
        'mole_from_mass': [
            { name: 'Moles from Mass', formula: 'n = m / M', description: 'where n = moles, m = mass (g), M = molar mass (g/mol)' },
            { name: 'Molar Mass', formula: 'M = Σ(atomic mass × subscript)', description: 'Sum contributions from all elements' }
        ],
        'mass_mass': [
            { name: 'Moles from Mass', formula: 'n = m / M', description: 'Convert mass to moles' },
            { name: 'Mole Ratio', formula: 'n₂ = n₁ × (coeff₂ / coeff₁)', description: 'Apply coefficients from balanced equation' },
            { name: 'Mass from Moles', formula: 'm = n × M', description: 'Convert moles back to mass' }
        ],
        'limiting_reagent': [
            { name: 'Ratio Comparison', formula: 'ratio = moles / coefficient', description: 'Smallest ratio indicates limiting reagent' },
            { name: 'Moles Calculation', formula: 'n = m / M', description: 'Find moles for each reactant' }
        ],
        'percent_yield': [
            { name: 'Percent Yield', formula: '% yield = (actual / theoretical) × 100%', description: 'Efficiency of reaction' }
        ],
        'molarity': [
            { name: 'Molarity', formula: 'M = n / V', description: 'Concentration in mol/L' },
            { name: 'Moles from Molarity', formula: 'n = M × V', description: 'Calculate moles in solution' }
        ],
        'dilution': [
            { name: 'Dilution Equation', formula: 'M₁V₁ = M₂V₂', description: 'Moles conserved during dilution' }
        ],
        'gas_stoichiometry': [
            { name: 'Ideal Gas Law', formula: 'PV = nRT', description: 'R = 0.08206 L·atm/(mol·K)' },
            { name: 'STP Molar Volume', formula: 'V = n × 22.4 L/mol', description: 'At 0°C and 1 atm' }
        ]
    };

    return formulaDatabase[type] || [];
}

createCommonMistakesSection() {
    if (!this.includeCommonMistakes) return null;

    const { type } = this.currentProblem;
    const category = this.getStoichiometryCategoryFromType(type);
    const mistakes = this.commonMistakes[category];

    if (!mistakes) return null;

    const mistakeData = [
        ['Common Errors to Avoid', ''],
        ['', '']
    ];

    for (const [step, errors] of Object.entries(mistakes)) {
        mistakeData.push([`During: ${step}`, '']);
        errors.forEach((error, i) => {
            mistakeData.push([`  ${i + 1}.`, error]);
        });
        mistakeData.push(['', '']);
    }

    return {
          title: 'Common Mistakes and How to Avoid Them',
        type: 'mistakes',
        data: mistakeData,
        styling: {
            backgroundColor: '#fff3e0',
            borderColor: '#ff6f00'
        }
    };
}

createReferenceSection() {
    const referenceData = [
        ['Important Constants', ''],
        ['Avogadro\'s Number', `${this.avogadroNumber} particles/mol`],
        ['Gas Constant R', `${this.gasConstant} L·atm/(mol·K)`],
        ['STP Molar Volume', `${this.stpMolarVolume} L/mol`],
        ['STP Temperature', '0°C or 273 K'],
        ['STP Pressure', '1 atm'],
        ['', ''],
        ['Unit Conversions', ''],
        ['1 L', '1000 mL'],
        ['°C to K', 'K = °C + 273'],
        ['g to mg', '1 g = 1000 mg'],
        ['', ''],
        ['Significant Figures', ''],
        ['Rule', 'Use least number of sig figs from given data'],
        ['Rounding', 'Only round final answer, keep extra digits during calculation']
    ];

    return {
        title: 'Reference Information',
        type: 'reference',
        data: referenceData,
        styling: {
            backgroundColor: this.colors.cellBg,
            borderColor: this.colors.borderColor
        }
    };
}

createPracticeProblemsSection() {
    const { type } = this.currentProblem;
    const practiceProblems = this.generatePracticeProblems(type);

    if (!practiceProblems || practiceProblems.length === 0) return null;

    const practiceData = [
        ['Practice Problem Set', `Similar to: ${this.stoichiometryTypes[type]?.name}`],
        ['Instructions', 'Try these problems to reinforce your understanding'],
        ['', '']
    ];

    practiceProblems.forEach((problem, index) => {
        practiceData.push([`Problem ${index + 1}`, problem.question]);
        if (problem.hint) {
            practiceData.push(['💡 Hint', problem.hint]);
        }
        if (problem.answer) {
            practiceData.push(['Answer', problem.answer]);
        }
        practiceData.push(['', '']);
    });

    return {
        title: 'Practice Problems',
        type: 'practice',
        data: practiceData,
        styling: {
            backgroundColor: '#f3e5f5'
        }
    };
}

// ============================================================================
// ENHANCED VERIFICATION WITH CONFIDENCE CALCULATION
// ============================================================================

calculateVerificationConfidence() {
    if (!this.currentSolution || !this.currentProblem) return 'Unknown';

    const { type } = this.currentProblem;
    const verification = this.verifyStoichiometryCalculation();

    if (!verification) return 'Medium';

    // Check if verification explicitly states validity
    if (verification.isValid === true) {
        // Further check for specific confidence indicators
        if (type === 'mole_from_mass' || type === 'mass_from_mole') {
            if (verification.percentError !== undefined) {
                if (verification.percentError < 0.01) return 'Very High';
                if (verification.percentError < 0.1) return 'High';
                if (verification.percentError < 1) return 'Medium';
                return 'Low';
            }
        }

        if (type === 'mass_mass') {
            const moleError = verification.molesDifference < 1e-6;
            const massError = verification.massDifference < 0.01;
            if (moleError && massError) return 'Very High';
            if (moleError || massError) return 'High';
            return 'Medium';
        }

        if (type === 'limiting_reagent') {
            if (verification.allRatiosCorrect && verification.correctLimiting) return 'Very High';
            if (verification.correctLimiting) return 'High';
            return 'Medium';
        }

        if (type === 'percent_yield') {
            if (verification.percentYield > 100) return 'Error - Impossible Result';
            if (verification.difference < 0.01) return 'Very High';
            if (verification.difference < 0.1) return 'High';
            return 'Medium';
        }

        if (type === 'molarity' || type === 'dilution') {
            if (verification.difference < 1e-6) return 'Very High';
            if (verification.difference < 1e-4) return 'High';
            return 'Medium';
        }

        if (type === 'empirical_formula' || type === 'molecular_formula') {
            if (verification.allWholeNumbers && verification.inSimplestRatio) return 'Very High';
            if (verification.allWholeNumbers) return 'High';
            return 'Medium';
        }

        if (type === 'gas_stoichiometry') {
            if (verification.difference < 0.01) return 'Very High';
            if (verification.difference < 0.1) return 'High';
            return 'Medium';
        }

        return 'High';
    } else if (verification.isValid === false) {
        return 'Low - Verification Failed';
    }

    // Default confidence levels
    return 'Medium';
}

getVerificationNotes() {
    const { type } = this.currentProblem;
    const verification = this.verifyStoichiometryCalculation();
    const confidence = this.calculateVerificationConfidence();
    const notes = [];

    // General verification info
    notes.push(`Confidence Level: ${confidence}`);
    notes.push(`Verification Method: ${verification?.method || 'Standard stoichiometric check'}`);

    // Type-specific notes
    switch (type) {
        case 'mole_from_mass':
        case 'mass_from_mole':
            notes.push('Reverse calculation confirms conversion accuracy');
            if (verification?.percentError !== undefined) {
                notes.push(`Percent error: ${verification.percentError.toFixed(4)}%`);
            }
            notes.push('Tolerance: ±0.01 g for mass calculations');
            if (verification?.percentError < 0.1) {
                notes.push('✓ Excellent precision achieved');
            }
            break;

        case 'molar_mass':
            notes.push('Atomic masses from periodic table verified');
            notes.push('All subscripts and parentheses accounted for');
            notes.push('Sum of element contributions checked');
            break;

        case 'mass_mass':
        case 'mole_mole':
            notes.push('Mole ratio from balanced equation verified');
            notes.push('Mass conversions checked using molar masses');
            notes.push('Stoichiometric pathway: mass → moles → moles → mass confirmed');
            if (verification?.moleRatioCheck) {
                notes.push(`Ratio calculation: ${verification.moleRatioCheck}`);
            }
            break;

        case 'limiting_reagent':
            notes.push('All reactant ratios (moles/coefficient) calculated');
            notes.push('Smallest ratio correctly identifies limiting reagent');
            notes.push('Excess reagent(s) remain after reaction');
            if (verification?.allRatiosCorrect) {
                notes.push('✓ All ratio calculations verified correct');
            }
            if (verification?.identifiedLimiting) {
                notes.push(`Limiting reagent: ${verification.identifiedLimiting}`);
            }
            break;

        case 'percent_yield':
            notes.push('Actual yield compared to theoretical maximum');
            if (verification?.percentYield > 100) {
                notes.push('⚠️ WARNING: Yield > 100% indicates error in measurement or calculation');
                notes.push('Possible causes: impure product, measurement error, calculation mistake');
            } else if (verification?.percentYield < 50) {
                notes.push('Low yield may indicate: side reactions, incomplete reaction, or losses during purification');
            } else if (verification?.percentYield >= 90) {
                notes.push('✓ Excellent yield achieved');
            }
            notes.push(`Interpretation: ${verification?.interpretation || 'Physically reasonable'}`);
            break;

        case 'molarity':
            notes.push('Molarity definition M = n/V verified');
            notes.push('Volume units: must be in liters (L)');
            notes.push('Concentration units: mol/L or M');
            notes.push('Intensive property: independent of sample size');
            break;

        case 'dilution':
            notes.push('Conservation of moles verified: M₁V₁ = M₂V₂');
            notes.push('Moles of solute remain constant during dilution');
            notes.push('Only solvent is added; no additional solute');
            if (verification?.M1V1 && verification?.M2V2) {
                notes.push(`M₁V₁ = ${verification.M1V1.toFixed(6)}`);
                notes.push(`M₂V₂ = ${verification.M2V2.toFixed(6)}`);
                notes.push(`Difference: ${verification.difference.toExponential(2)}`);
            }
            break;

        case 'solution_stoichiometry':
            notes.push('Moles calculated from molarity and volume');
            notes.push('Stoichiometric ratio applied to solution reactions');
            notes.push('Volume units checked for consistency');
            break;

        case 'gas_stoichiometry':
            if (this.currentSolution.useSTP) {
                notes.push('STP conditions verified: 0°C (273 K) and 1 atm');
                notes.push('Molar volume at STP: 22.4 L/mol used');
                notes.push('✓ Standard conditions simplify calculations');
            } else {
                notes.push('Ideal gas law PV = nRT applied');
                notes.push(`Gas constant R = ${this.gasConstant} L·atm/(mol·K)`);
                notes.push('Temperature in Kelvin verified');
                notes.push('Pressure units: atmospheres (atm)');
            }
            break;

        case 'empirical_formula':
            notes.push('All subscripts converted to whole numbers');
            notes.push('Formula reduced to simplest ratio');
            if (verification?.gcdOfSubscripts > 1) {
                notes.push(`⚠️ GCD of subscripts = ${verification.gcdOfSubscripts}: may need simplification`);
            } else {
                notes.push('✓ Formula is in simplest form');
            }
            notes.push('Percent composition pathway verified');
            break;

        case 'molecular_formula':
            notes.push('Molecular formula is whole number multiple of empirical');
            notes.push(`Multiplier n = ${this.currentSolution.n}`);
            notes.push('n calculated from: MM(molecular) / MM(empirical)');
            if (verification?.nMatches) {
                notes.push('✓ Multiplier confirmed by reverse calculation');
            }
            break;

        case 'combustion_analysis':
            notes.push('Carbon from CO₂: moles C = moles CO₂ (1:1 ratio)');
            notes.push('Hydrogen from H₂O: moles H = 2 × moles H₂O (2:1 ratio)');
            if (this.currentSolution.oxygenData) {
                notes.push('Oxygen calculated by mass difference');
            }
            notes.push('Empirical formula derived from elemental moles');
            break;

        case 'titration':
            notes.push('Stoichiometric equivalence at endpoint verified');
            notes.push('Mole ratio from balanced equation used');
            notes.push('Both reactants consumed in stoichiometric amounts');
            if (verification?.difference < 1e-6) {
                notes.push('✓ Excellent agreement at equivalence point');
            }
            break;

        case 'percent_composition':
            notes.push('Sum of all percentages verified ≈ 100%');
            notes.push('Each element contribution calculated accurately');
            notes.push('Formula: % = (element mass / total mass) × 100%');
            break;

        default:
            notes.push('Standard stoichiometric verification methods applied');
            notes.push('All calculations follow dimensional analysis');
    }

    // Add significant figures note
    notes.push('Answer reported to appropriate significant figures');
    
    // Add units note
    notes.push('Units tracked and verified throughout calculation');

    return notes.join('; ');
}

// ============================================================================
// COMPLETE VERIFICATION SECTION CREATION
// ============================================================================

createVerificationSection() {
    if (!this.includeVerificationInSteps) return null;

    const verification = this.verifyStoichiometryCalculation();
    if (!verification) return null;

    const confidence = this.calculateVerificationConfidence();
    const notes = this.getVerificationNotes();

    const verificationData = [
        ['Verification Method', verification.method],
        ['Status', verification.isValid ? '✓ Valid' : '⚠️ Check calculation'],
        ['Confidence Level', confidence],
        ['', '']
    ];

    // Add type-specific verification data
    const { type } = this.currentProblem;

    if (type === 'mole_from_mass' || type === 'mass_from_mole') {
        verificationData.push(['Verification Details', '']);
        if (verification.originalMass !== undefined) {
            verificationData.push(['Original Mass', `${verification.originalMass} g`]);
            verificationData.push(['Calculated Mass', `${verification.calculatedMass.toFixed(4)} g`]);
            verificationData.push(['Difference', `${verification.difference.toFixed(6)} g`]);
        }
        if (verification.originalMoles !== undefined) {
            verificationData.push(['Original Moles', `${verification.originalMoles} mol`]);
            verificationData.push(['Calculated Moles', `${verification.calculatedMoles.toFixed(6)} mol`]);
            verificationData.push(['Difference', `${verification.difference.toExponential(2)} mol`]);
        }
        if (verification.percentError !== undefined) {
            verificationData.push(['Percent Error', `${verification.percentError.toFixed(6)}%`]);
        }
        verificationData.push(['Verification Equation', verification.verification || 'n × M = m']);
    }

    if (type === 'mass_mass') {
        verificationData.push(['Mole Ratio Verification', '']);
        verificationData.push(['Expected Product Moles', verification.expectedProductMoles?.toFixed(6) || 'N/A']);
        verificationData.push(['Actual Product Moles', verification.actualProductMoles?.toFixed(6) || 'N/A']);
        verificationData.push(['Moles Difference', verification.molesDifference?.toExponential(2) || 'N/A']);
        verificationData.push(['', '']);
        verificationData.push(['Mass Verification', '']);
        verificationData.push(['Expected Product Mass', `${verification.expectedProductMass?.toFixed(4) || 'N/A'} g`]);
        verificationData.push(['Actual Product Mass', `${verification.actualProductMass?.toFixed(4) || 'N/A'} g`]);
        verificationData.push(['Mass Difference', `${verification.massDifference?.toFixed(6) || 'N/A'} g`]);
        if (verification.moleRatioCheck) {
            verificationData.push(['Ratio Check', verification.moleRatioCheck]);
        }
    }

    if (type === 'limiting_reagent') {
        verificationData.push(['Ratio Verifications', '']);
        if (verification.ratioVerifications) {
            verification.ratioVerifications.forEach(rv => {
                verificationData.push([
                    rv.formula,
                    `Calculated: ${rv.calculatedRatio.toFixed(6)}, Reported: ${rv.reportedRatio.toFixed(6)}, Match: ${rv.matches ? '✓' : '✗'}`
                ]);
            });
        }
        verificationData.push(['', '']);
        verificationData.push(['Smallest Ratio', verification.smallestRatio?.toFixed(6) || 'N/A']);
        verificationData.push(['Identified Limiting', verification.identifiedLimiting || 'N/A']);
        verificationData.push(['Correct Identification', verification.correctLimiting ? '✓ Yes' : '✗ No']);
    }

    if (type === 'percent_yield') {
        verificationData.push(['Yield Verification', '']);
        verificationData.push(['Actual Yield', `${verification.actualYield} g`]);
        verificationData.push(['Theoretical Yield', `${verification.theoreticalYield} g`]);
        verificationData.push(['Calculated %', `${verification.calculatedPercent?.toFixed(2)}%`]);
        verificationData.push(['Reported %', `${verification.reportedPercent?.toFixed(2)}%`]);
        verificationData.push(['Difference', `${verification.difference?.toFixed(4)}%`]);
        verificationData.push(['Interpretation', verification.interpretation || 'Normal']);
        if (verification.calculation) {
            verificationData.push(['Calculation', verification.calculation]);
        }
    }

    if (type === 'molarity' || type === 'dilution') {
        if (type === 'molarity' && verification.calculatedMolarity !== undefined) {
            verificationData.push(['Molarity Verification', '']);
            verificationData.push(['Moles', `${verification.moles} mol`]);
            verificationData.push(['Volume', `${verification.volume} L`]);
            verificationData.push(['Calculated M', `${verification.calculatedMolarity.toFixed(6)} M`]);
            verificationData.push(['Reported M', `${verification.reportedMolarity.toFixed(6)} M`]);
            verificationData.push(['Difference', verification.difference.toExponential(2)]);
            if (verification.calculation) {
                verificationData.push(['Calculation', verification.calculation]);
            }
        }
        
        if (type === 'dilution') {
            verificationData.push(['Dilution Verification', '']);
            verificationData.push(['M₁V₁', verification.M1V1?.toFixed(6) || 'N/A']);
            verificationData.push(['M₂V₂', verification.M2V2?.toFixed(6) || 'N/A']);
            verificationData.push(['Difference', verification.difference?.toExponential(2) || 'N/A']);
            if (verification.calculation) {
                verificationData.push(['Calculation', verification.calculation]);
            }
        }
    }

    if (type === 'empirical_formula') {
        verificationData.push(['Formula Verification', '']);
        verificationData.push(['All Whole Numbers', verification.allWholeNumbers ? '✓ Yes' : '✗ No']);
        verificationData.push(['GCD of Subscripts', verification.gcdOfSubscripts || 'N/A']);
        verificationData.push(['In Simplest Ratio', verification.inSimplestRatio ? '✓ Yes' : '⚠️ Check']);
        verificationData.push(['Empirical Formula', verification.empiricalFormula || 'N/A']);
        if (verification.note) {
            verificationData.push(['Note', verification.note]);
        }
    }

    if (type === 'molecular_formula') {
        verificationData.push(['Molecular Formula Verification', '']);
        verificationData.push(['Empirical Mass', `${verification.empiricalMass} g/mol`]);
        verificationData.push(['Molecular Mass', `${verification.molarMass} g/mol`]);
        verificationData.push(['Calculated n', verification.calculatedN || 'N/A']);
        verificationData.push(['Reported n', verification.reportedN || 'N/A']);
        verificationData.push(['n Matches', verification.nMatches ? '✓ Yes' : '✗ No']);
        if (verification.calculation) {
            verificationData.push(['Calculation', verification.calculation]);
        }
    }

    if (type === 'gas_stoichiometry') {
        if (verification.useSTP || verification.molarVolume) {
            verificationData.push(['STP Verification', '']);
            verificationData.push(['Moles', `${verification.moles} mol`]);
            verificationData.push(['Molar Volume', `${verification.molarVolume || this.stpMolarVolume} L/mol`]);
            verificationData.push(['Calculated Volume', `${verification.calculatedVolume?.toFixed(4)} L`]);
            verificationData.push(['Reported Volume', `${verification.reportedVolume?.toFixed(4)} L`]);
        } else {
            verificationData.push(['Ideal Gas Law Verification', '']);
            verificationData.push(['P', `${verification.P} atm`]);
            verificationData.push(['V', `${verification.V} L`]);
            verificationData.push(['T', `${verification.T} K`]);
            verificationData.push(['R', `${verification.R} L·atm/(mol·K)`]);
            verificationData.push(['Calculated Moles', `${verification.calculatedMoles?.toFixed(6)} mol`]);
            verificationData.push(['Reported Moles', `${verification.reportedMoles?.toFixed(6)} mol`]);
        }
        verificationData.push(['Difference', verification.difference?.toExponential(2) || 'N/A']);
        if (verification.calculation) {
            verificationData.push(['Calculation', verification.calculation]);
        }
    }

    if (type === 'titration') {
        verificationData.push(['Titration Verification', '']);
        verificationData.push(['Acid Moles', verification.acidMoles?.toFixed(6) || 'N/A']);
        verificationData.push(['Base Moles', verification.baseMoles?.toFixed(6) || 'N/A']);
        verificationData.push(['Acid Mole Ratio', verification.acidMoleRatio?.toFixed(6) || 'N/A']);
        verificationData.push(['Base Mole Ratio', verification.baseMoleRatio?.toFixed(6) || 'N/A']);
        verificationData.push(['Difference', verification.difference?.toExponential(2) || 'N/A']);
        verificationData.push(['Interpretation', verification.interpretation || 'Equivalence verified']);
    }

    // Add detailed notes
    verificationData.push(['', '']);
    verificationData.push(['Detailed Notes', '']);
    const notesList = notes.split('; ');
    notesList.forEach(note => {
        verificationData.push(['•', note]);
    });

    return {
        title: 'Solution Verification',
        type: 'verification',
        data: verificationData,
        confidence: confidence,
        isValid: verification.isValid,
        styling: {
            backgroundColor: verification.isValid ? this.colors.resultBg : '#ffebee',
            borderColor: verification.isValid ? '#4caf50' : '#f44336'
        }
    };
}

// ============================================================================
// ALTERNATIVE METHODS SECTION CREATION
// ============================================================================

createAlternativeMethodsSection() {
    if (!this.includeAlternativeMethods) return null;

    const { type } = this.currentProblem;
    const alternatives = this.generateAlternativeMethods(type);

    const methodsData = [
        ['Primary Method Used', alternatives.primaryMethod],
        ['', ''],
        ['Alternative Solution Methods', ''],
        ['', '']
    ];

    alternatives.methods.forEach((method, index) => {
        methodsData.push([`Method ${index + 1}: ${method.name}`, '']);
        methodsData.push(['Description', method.description]);
        if (method.steps) {
            methodsData.push(['Steps', method.steps.join(' → ')]);
        }
        if (method.pros) {
            methodsData.push(['Advantages', method.pros]);
        }
        if (method.cons) {
            methodsData.push(['Disadvantages', method.cons]);
        }
        methodsData.push(['', '']);
    });

    methodsData.push(['Method Comparison', alternatives.comparison]);
    methodsData.push(['', '']);
    methodsData.push(['Recommendation', this.getMethodRecommendation(type, alternatives)]);

    return {
        title: 'Alternative Solution Methods',
        type: 'alternatives',
        data: methodsData,
        styling: {
            backgroundColor: '#e8f5e9'
        }
    };
}

getMethodRecommendation(type, alternatives) {
    const recommendations = {
        'mole_from_mass': 'Direct formula method (n = m/M) is most efficient for routine calculations. Dimensional analysis is better for learning and verification.',
        'mass_mass': 'Step-by-step method is clearest for learning. Dimensional analysis is efficient once proficient. Both ensure proper unit tracking.',
        'limiting_reagent': 'Ratio comparison method is fastest. BCA table method is most comprehensive for complex problems with multiple products.',
        'molarity': 'Direct formula method is standard. Triangle diagram helps visualize relationships between M, n, and V.',
        'empirical_formula': 'Standard pathway (% → mass → moles → ratio) is systematic and reliable. Always verify subscripts are in simplest ratio.'
    };

    return recommendations[type] || 'Choose the method that best fits your problem complexity and personal preference. Practice multiple methods to build flexibility.';
}

// ============================================================================
// PEDAGOGICAL NOTES SECTION CREATION
// ============================================================================

createPedagogicalNotesSection() {
    if (!this.includePedagogicalNotes) return null;

    const { type } = this.currentProblem;
    const category = this.getStoichiometryCategoryFromType(type);
    const notes = this.generatePedagogicalNotes(category);

    const pedagogicalData = [
        ['Learning Objectives', ''],
        ...notes.objectives.map((obj, i) => [`  ${i + 1}.`, obj]),
        ['', ''],
        ['Key Concepts', ''],
        ...notes.keyConcepts.map((concept, i) => [`  ${i + 1}.`, concept]),
        ['', ''],
        ['Prerequisites', ''],
        ...notes.prerequisites.map((prereq, i) => [`  ${i + 1}.`, prereq]),
        ['', ''],
        ['Common Difficulties', ''],
        ...notes.commonDifficulties.map((diff, i) => [`  ${i + 1}.`, diff]),
        ['', ''],
        ['Extension Ideas', ''],
        ...notes.extensions.map((ext, i) => [`  ${i + 1}.`, ext]),
        ['', ''],
        ['Assessment Tips', ''],
        ...notes.assessment.map((assess, i) => [`  ${i + 1}.`, assess])
    ];

    // Add teaching tips if available
    if (notes.teachingTips && notes.teachingTips.length > 0) {
        pedagogicalData.push(['', '']);
        pedagogicalData.push(['Teaching Tips', '']);
        notes.teachingTips.forEach((tip, i) => {
            pedagogicalData.push([`  ${i + 1}.`, tip]);
        });
    }

    return {
        title: 'Pedagogical Notes for Educators',
        type: 'pedagogical',
        data: pedagogicalData,
        styling: {
            backgroundColor: '#f3e5f5',
            borderColor: '#9c27b0'
        }
    };
}

// ============================================================================
// EXPORT AND UTILITY METHODS
// ============================================================================

exportWorkbook() {
    if (!this.currentWorkbook) {
        console.warn('No workbook available to export');
        return null;
    }

    return {
        workbook: this.currentWorkbook,
        format: 'json',
        timestamp: new Date().toISOString(),
        exportOptions: {
            includeVerification: this.includeVerificationInSteps,
            explanationLevel: this.explanationLevel,
            theme: this.theme
        }
    };
}

generateWorkbookSummary() {
    if (!this.currentWorkbook) return null;

    return {
        title: this.currentWorkbook.title,
        problemType: this.currentProblem?.type,
        solutionType: this.currentSolution?.problemType,
        numberOfSections: this.currentWorkbook.sections.length,
        numberOfSteps: this.solutionSteps?.length || 0,
        confidence: this.calculateVerificationConfidence(),
        hasVerification: this.includeVerificationInSteps,
        hasDiagram: this.diagramData !== null,
        explanationLevel: this.explanationLevel,
        timestamp: this.currentWorkbook.timestamp
    };
}

getWorkbookStatistics() {
    if (!this.currentWorkbook || !this.solutionSteps) {
        return null;
    }

    return {
        totalSections: this.currentWorkbook.sections.length,
        totalSteps: this.solutionSteps.length,
        sectionTypes: this.currentWorkbook.sections.map(s => s.type),
        hasVerification: !!this.currentWorkbook.sections.find(s => s.type === 'verification'),
        hasDiagram: !!this.diagramData,
        hasPedagogicalNotes: !!this.currentWorkbook.sections.find(s => s.type === 'pedagogical'),
        hasAlternativeMethods: !!this.currentWorkbook.sections.find(s => s.type === 'alternatives'),
        hasPracticeProblems: !!this.currentWorkbook.sections.find(s => s.type === 'practice'),
        confidence: this.calculateVerificationConfidence(),
        problemComplexity: this.assessProblemComplexity()
    };
}

assessProblemComplexity() {
    const { type } = this.currentProblem;
    
    const complexityLevels = {
        'mole_from_mass': 'Basic',
        'mass_from_mole': 'Basic',
        'molar_mass': 'Basic',
        'particles_from_mole': 'Basic',
        'mass_mass': 'Intermediate',
        'mole_mole': 'Intermediate',
        'molarity': 'Intermediate',
        'dilution': 'Intermediate',
        'percent_yield': 'Intermediate',
        'limiting_reagent': 'Advanced',
        'solution_stoichiometry': 'Advanced',
        'gas_stoichiometry': 'Advanced',
        'empirical_formula': 'Advanced',
        'molecular_formula': 'Advanced',
        'combustion_analysis': 'Advanced',
        'titration': 'Advanced'
    };

return complexityLevels[type] || 'Intermediate';
}

// ============================================================================
// LESSON SECTION CREATION
// ============================================================================

createLessonSection() {
    const { type } = this.currentProblem;
    const category = this.getStoichiometryCategoryFromType(type);
    
    const lessonData = [
        ['Category', category],
        ['Key Principle', this.getKeyPrinciple(category)],
        ['Essential Formula', this.getEssentialFormula(category)],
        ['Problem-Solving Strategy', this.getProblemSolvingStrategy(category)],
        ['', ''],
        ['Critical Rule', this.getCriticalRule(category)],
        ['Common Application', this.getCommonApplication(category)]
    ];

    return {
        title: 'Key Concepts and Strategy',
        type: 'lesson',
        data: lessonData,
        styling: {
            backgroundColor: this.colors.sectionBg
        }
    };
}

getKeyPrinciple(category) {
    const principles = {
        'mole_calculations': 'The mole is the bridge between the atomic/molecular scale and the macroscopic scale',
        'molar_mass': 'Molar mass converts between mass and moles using atomic masses from the periodic table',
        'mass_mass_stoichiometry': 'Balanced equations provide mole ratios; always convert through moles',
        'limiting_reagent': 'The limiting reagent determines the maximum amount of product that can form',
        'percent_yield': 'Actual yield is typically less than theoretical due to real-world limitations',
        'solution_stoichiometry': 'Molarity relates moles to volume; use M×V to find moles in solution',
        'gas_stoichiometry': 'Gases follow PV=nRT or use 22.4 L/mol at STP',
        'empirical_molecular': 'Empirical shows simplest ratio; molecular shows actual composition',
        'combustion_analysis': 'Products of combustion reveal elemental composition of compounds',
        'titration': 'At equivalence point, stoichiometric amounts have reacted'
    };

    return principles[category] || 'Apply stoichiometric principles systematically';
}

getEssentialFormula(category) {
    const formulas = {
        'mole_calculations': 'n = m / M (moles = mass / molar mass)',
        'molar_mass': 'M = Σ(atomic mass × subscript)',
        'mass_mass_stoichiometry': 'mass → moles → moles → mass using mole ratio',
        'limiting_reagent': 'Compare (moles / coefficient) for each reactant',
        'percent_yield': '% yield = (actual / theoretical) × 100%',
        'solution_stoichiometry': 'M = n / V or n = M × V',
        'gas_stoichiometry': 'PV = nRT or V = n × 22.4 L/mol at STP',
        'empirical_molecular': 'Molecular Formula = (Empirical Formula)ₙ',
        'combustion_analysis': 'C from CO₂, H from H₂O, O by difference',
        'titration': 'M₁V₁/coeff₁ = M₂V₂/coeff₂'
    };

    return formulas[category] || 'Use appropriate stoichiometric relationships';
}

getProblemSolvingStrategy(category) {
    const strategies = {
        'mole_calculations': '1. Identify given (mass or moles) 2. Find molar mass 3. Apply n = m/M or m = n×M',
        'molar_mass': '1. Write formula 2. List elements and counts 3. Sum (atomic mass × count) for each element',
        'mass_mass_stoichiometry': '1. Balance equation 2. Mass → moles 3. Apply mole ratio 4. Moles → mass',
        'limiting_reagent': '1. Convert all masses to moles 2. Calculate moles/coefficient 3. Smallest is limiting',
        'percent_yield': '1. Calculate theoretical yield 2. Measure actual yield 3. Apply % formula',
        'solution_stoichiometry': '1. Find moles using M×V 2. Apply stoichiometry 3. Convert back as needed',
        'gas_stoichiometry': '1. Identify conditions (STP or not) 2. Use appropriate formula 3. Solve for unknown',
        'empirical_molecular': '1. % → mass → moles → ratio 2. Simplify to whole numbers 3. Apply multiplier if needed',
        'combustion_analysis': '1. Moles C from CO₂ 2. Moles H from H₂O 3. Moles O by difference 4. Find empirical formula',
        'titration': '1. Calculate moles of known 2. Use mole ratio 3. Find concentration of unknown'
    };

    return strategies[category] || 'Follow systematic problem-solving approach';
}

getCriticalRule(category) {
    const rules = {
        'mole_calculations': '⚠️ Always divide by molar mass to get moles; multiply by molar mass to get mass',
        'molar_mass': '⚠️ Don\'t forget to multiply by subscripts, including those outside parentheses',
        'mass_mass_stoichiometry': '⚠️ Never use subscripts for mole ratio - only use coefficients from balanced equation',
        'limiting_reagent': '⚠️ Don\'t just compare masses - must compare (moles/coefficient) ratios',
        'percent_yield': '⚠️ Percent yield > 100% indicates error in measurement or calculation',
        'solution_stoichiometry': '⚠️ Volume must be in liters (L) for molarity calculations',
        'gas_stoichiometry': '⚠️ Always convert temperature to Kelvin for gas law calculations',
        'empirical_molecular': '⚠️ Empirical and molecular formulas are different - don\'t confuse them',
        'combustion_analysis': '⚠️ Remember H₂O contains 2 H atoms - use 2:1 ratio',
        'titration': '⚠️ M₁V₁ = M₂V₂ only works for 1:1 reactions'
    };

    return rules[category] || '⚠️ Check your work carefully and verify units';
}

getCommonApplication(category) {
    const applications = {
        'mole_calculations': 'Laboratory measurements, preparing solutions, determining sample sizes',
        'molar_mass': 'Foundation for all stoichiometric calculations, compound identification',
        'mass_mass_stoichiometry': 'Industrial production, recipe scaling, yield prediction',
        'limiting_reagent': 'Cost optimization, determining excess reagent, production planning',
        'percent_yield': 'Reaction efficiency analysis, process optimization, quality control',
        'solution_stoichiometry': 'Analytical chemistry, titrations, solution preparation',
        'gas_stoichiometry': 'Airbag deployment, atmospheric chemistry, gas production/consumption',
        'empirical_molecular': 'Compound identification, structural determination, quality verification',
        'combustion_analysis': 'Organic compound identification, fuel analysis, pollution studies',
        'titration': 'Acid-base analysis, water hardness testing, pharmaceutical analysis'
    };

    return applications[category] || 'Various chemical calculations and real-world applications';
}

// ============================================================================
// SOLUTION SECTION CREATION
// ============================================================================

createSolutionSection() {
    if (!this.currentSolution) return null;

    const solutionData = [
        ['Final Answer', ''],
        ['', '']
    ];

    // Add problem-specific solution data based on type
    const { type } = this.currentProblem;

    switch(type) {
        case 'mole_from_mass':
            solutionData.push(['Moles', `${this.formatSigFigs(this.currentSolution.moles, 4)} mol`]);
            solutionData.push(['Calculation', this.currentSolution.calculation]);
            break;

        case 'mass_from_mole':
            solutionData.push(['Mass', `${this.formatSigFigs(this.currentSolution.mass, 4)} g`]);
            solutionData.push(['Calculation', this.currentSolution.calculation]);
            break;

        case 'particles_from_mole':
            solutionData.push(['Particles', this.currentSolution.scientificNotation]);
            solutionData.push(['Exact Value', this.currentSolution.particles.toExponential(4)]);
            break;

        case 'molar_mass':
            solutionData.push(['Molar Mass', `${this.currentSolution.molarMass} g/mol`]);
            solutionData.push(['Formula', this.currentSolution.formula]);
            break;

        case 'mass_mass':
        case 'mole_mole':
            solutionData.push(['Product Amount', `${this.formatSigFigs(this.currentSolution.product.mass || this.currentSolution.product.moles, 4)} ${this.currentSolution.product.mass ? 'g' : 'mol'}`]);
            solutionData.push(['Product Formula', this.currentSolution.product.formula]);
            solutionData.push(['Mole Ratio Used', this.currentSolution.moleRatio]);
            break;

        case 'limiting_reagent':
            solutionData.push(['Limiting Reagent', this.currentSolution.limitingReagent.formula]);
            solutionData.push(['Limiting Ratio', this.currentSolution.limitingReagent.ratio.toFixed(6)]);
            solutionData.push(['Excess Reagents', this.currentSolution.excessReagents.map(e => e.formula).join(', ')]);
            break;

        case 'percent_yield':
            solutionData.push(['Percent Yield', `${this.currentSolution.percentYield.toFixed(2)}%`]);
            solutionData.push(['Actual Yield', `${this.currentSolution.actualYield} g`]);
            solutionData.push(['Theoretical Yield', `${this.currentSolution.theoreticalYield} g`]);
            break;

        case 'molarity':
            if (this.currentSolution.molarity !== undefined) {
                solutionData.push(['Molarity', `${this.formatSigFigs(this.currentSolution.molarity, 4)} M`]);
            }
            if (this.currentSolution.moles !== undefined) {
                solutionData.push(['Moles', `${this.formatSigFigs(this.currentSolution.moles, 4)} mol`]);
            }
            if (this.currentSolution.volume !== undefined) {
                solutionData.push(['Volume', `${this.formatSigFigs(this.currentSolution.volume, 4)} L`]);
            }
            break;

        case 'dilution':
            solutionData.push(['Initial Conditions', `M₁ = ${this.currentSolution.M1} M, V₁ = ${this.currentSolution.V1} L`]);
            solutionData.push(['Final Conditions', `M₂ = ${this.currentSolution.M2} M, V₂ = ${this.currentSolution.V2} L`]);
            break;

        case 'empirical_formula':
            solutionData.push(['Empirical Formula', this.currentSolution.empiricalFormula]);
            solutionData.push(['Subscripts', JSON.stringify(this.currentSolution.subscripts)]);
            break;

        case 'molecular_formula':
            solutionData.push(['Molecular Formula', this.currentSolution.molecularFormula]);
            solutionData.push(['Empirical Formula', this.currentSolution.empiricalFormula]);
            solutionData.push(['Multiplier (n)', this.currentSolution.n]);
            break;

        case 'gas_stoichiometry':
            if (this.currentSolution.moles !== undefined) {
                solutionData.push(['Moles', `${this.formatSigFigs(this.currentSolution.moles, 4)} mol`]);
            }
            if (this.currentSolution.volume !== undefined) {
                solutionData.push(['Volume', `${this.formatSigFigs(this.currentSolution.volume, 4)} L`]);
            }
            if (this.currentSolution.useSTP) {
                solutionData.push(['Conditions', 'STP (0°C, 1 atm)']);
            }
            break;

        case 'combustion_analysis':
            solutionData.push(['Empirical Formula', this.currentSolution.empiricalFormula]);
            solutionData.push(['From CO₂', `${this.currentSolution.carbonData.moles.toFixed(4)} mol C`]);
            solutionData.push(['From H₂O', `${this.currentSolution.hydrogenData.moles.toFixed(4)} mol H`]);
            break;

        case 'titration':
            if (this.currentSolution.acid && this.currentSolution.acid.molarity) {
                solutionData.push(['Acid Molarity', `${this.formatSigFigs(this.currentSolution.acid.molarity, 4)} M`]);
            }
            if (this.currentSolution.base && this.currentSolution.base.molarity) {
                solutionData.push(['Base Molarity', `${this.formatSigFigs(this.currentSolution.base.molarity, 4)} M`]);
            }
            break;

        default:
            // Generic solution display
            for (const [key, value] of Object.entries(this.currentSolution)) {
                if (typeof value === 'number') {
                    solutionData.push([key, this.formatSigFigs(value, 4)]);
                } else if (typeof value === 'string') {
                    solutionData.push([key, value]);
                }
            }
    }

    // Add interpretation if available
    if (this.currentSolution.interpretation) {
        solutionData.push(['', '']);
        solutionData.push(['Interpretation', this.currentSolution.interpretation]);
    }

    return {
        title: 'Final Solution',
        type: 'solution',
        data: solutionData,
        styling: {
            backgroundColor: this.colors.resultBg,
            borderColor: '#4caf50',
            fontWeight: 'bold'
        }
    };
}

// ============================================================================
// ANALYSIS SECTION CREATION
// ============================================================================

createAnalysisSection() {
    const analysisData = [
        ['Problem Analysis', ''],
        ['', ''],
        ['Steps Required', this.solutionSteps?.length || 0],
        ['Explanation Level', this.explanationLevel],
        ['Problem Complexity', this.assessProblemComplexity()],
        ['Primary Method', this.getPrimaryMethod()],
        ['', '']
    ];

    // Add calculation pathway
    if (this.currentSolution) {
        analysisData.push(['Calculation Pathway', '']);
        const pathway = this.getCalculationPathway();
        pathway.forEach((step, i) => {
            analysisData.push([`Step ${i + 1}`, step]);
        });
        analysisData.push(['', '']);
    }

    // Add key conversions used
    const conversions = this.getKeyConversions();
    if (conversions.length > 0) {
        analysisData.push(['Key Conversions Used', '']);
        conversions.forEach(conv => {
            analysisData.push(['•', conv]);
        });
        analysisData.push(['', '']);
    }

    // Add units tracking
    analysisData.push(['Unit Tracking', '']);
    const unitFlow = this.getUnitFlow();
    unitFlow.forEach(flow => {
        analysisData.push(['→', flow]);
    });

    return {
        title: 'Solution Analysis',
        type: 'analysis',
        data: analysisData,
        styling: {
            backgroundColor: this.colors.stepBg
        }
    };
}

getPrimaryMethod() {
    const { type } = this.currentProblem;
    const methods = {
        'mole_from_mass': 'Direct division by molar mass',
        'mass_from_mole': 'Direct multiplication by molar mass',
        'mass_mass': 'Stoichiometric pathway (mass → moles → moles → mass)',
        'limiting_reagent': 'Mole ratio comparison method',
        'percent_yield': 'Direct percentage calculation',
        'molarity': 'Molarity formula (M = n/V)',
        'dilution': 'Conservation of moles (M₁V₁ = M₂V₂)',
        'empirical_formula': 'Percent to mole ratio method',
        'gas_stoichiometry': 'Ideal gas law or STP molar volume'
    };

    return methods[type] || 'Standard stoichiometric approach';
}

getCalculationPathway() {
    const { type } = this.currentProblem;
    const pathways = {
        'mole_from_mass': ['Start: Mass (g)', 'Divide by molar mass', 'Result: Moles (mol)'],
        'mass_from_mole': ['Start: Moles (mol)', 'Multiply by molar mass', 'Result: Mass (g)'],
        'mass_mass': ['Mass A (g)', 'Convert to moles A', 'Apply mole ratio', 'Convert to mass B', 'Result: Mass B (g)'],
        'limiting_reagent': ['Masses of reactants', 'Convert to moles', 'Calculate moles/coefficient', 'Identify smallest ratio', 'Determine limiting reagent'],
        'percent_yield': ['Theoretical yield', 'Actual yield', 'Calculate ratio', 'Multiply by 100%', 'Result: Percent yield'],
        'molarity': ['Moles and volume given', 'Apply M = n/V', 'Result: Molarity (M)'],
        'dilution': ['Initial M and V', 'Apply M₁V₁ = M₂V₂', 'Solve for unknown', 'Result: Final conditions'],
        'empirical_formula': ['Percent composition', 'Convert to mass', 'Convert to moles', 'Find ratios', 'Simplify to whole numbers', 'Result: Empirical formula']
    };

    return pathways[type] || ['Analyze problem', 'Apply appropriate formula', 'Calculate result', 'Verify answer'];
}

getKeyConversions() {
    const conversions = [];
    const { type } = this.currentProblem;

    if (type.includes('mole') || type.includes('mass')) {
        conversions.push('Mass ↔ Moles using molar mass');
    }

    if (type === 'mass_mass' || type === 'mole_mole') {
        conversions.push('Mole ratio from balanced equation coefficients');
    }

    if (type === 'particles_from_mole' || type === 'mole_from_particles') {
        conversions.push('Moles ↔ Particles using Avogadro\'s number');
    }

    if (type.includes('molarity') || type.includes('solution')) {
        conversions.push('Moles from molarity and volume (n = M × V)');
        conversions.push('mL → L (divide by 1000)');
    }

    if (type === 'gas_stoichiometry') {
        if (this.currentSolution?.useSTP) {
            conversions.push('Moles ↔ Volume at STP (22.4 L/mol)');
        } else {
            conversions.push('PV = nRT relationships');
            conversions.push('°C → K (add 273)');
        }
    }

    if (type === 'percent_yield') {
        conversions.push('Ratio → Percentage (multiply by 100)');
    }

    return conversions;
}

getUnitFlow() {
    const { type } = this.currentProblem;
    const flows = {
        'mole_from_mass': ['g → (÷ g/mol) → mol'],
        'mass_from_mole': ['mol → (× g/mol) → g'],
        'mass_mass': ['g A → mol A → mol B → g B'],
        'molarity': ['mol, L → (÷) → mol/L or M'],
        'percent_yield': ['g, g → (÷) → dimensionless → (×100) → %'],
        'gas_stoichiometry': ['atm, L, K → (with mol·K⁻¹·atm⁻¹·L) → mol']
    };

    return flows[type] || ['Input units → Calculation → Output units'];
}

// ============================================================================
// DIAGRAM SECTION CREATION
// ============================================================================

createDiagramSection() {
    if (!this.diagramData) return null;

    const diagramData = [
        ['Diagram Type', this.diagramData.type],
        ['Title', this.diagramData.title || 'Stoichiometry Visualization'],
        ['', '']
    ];

    // Add diagram-specific information
    if (this.diagramData.pathway) {
        diagramData.push(['Pathway Steps', '']);
        this.diagramData.pathway.forEach((step, i) => {
            diagramData.push([`Step ${i + 1}`, `${step.stage || step.label}: ${step.value || ''} ${step.unit || ''}`]);
        });
    }

    if (this.diagramData.equation) {
        diagramData.push(['', '']);
        diagramData.push(['Chemical Equation', this.diagramData.equation]);
    }

    if (this.diagramData.moleRatio) {
        diagramData.push(['Mole Ratio', this.diagramData.moleRatio]);
    }

    if (this.diagramData.formula) {
        diagramData.push(['Formula', this.diagramData.formula]);
    }

    return {
        title: 'Visual Representation',
        type: 'diagram',
        data: diagramData,
        diagramData: this.diagramData,
        styling: {
            backgroundColor: this.colors.diagramBg
        }
    };
}

// ============================================================================
// HELPER METHODS FOR WORKBOOK GENERATION
// ============================================================================

formatDataForWorkbook(data) {
    if (Array.isArray(data)) {
        return data.map(row => {
            if (Array.isArray(row)) {
                return row.map(cell => this.formatCellValue(cell));
            }
            return [this.formatCellValue(row)];
        });
    }
    return [[this.formatCellValue(data)]];
}

formatCellValue(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
        return this.formatSigFigs(value, 4);
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}

// ============================================================================
// FINAL EXPORT METHODS
// ============================================================================

exportToJSON() {
    return JSON.stringify({
        workbook: this.currentWorkbook,
        problem: this.currentProblem,
        solution: this.currentSolution,
        steps: this.solutionSteps,
        diagram: this.diagramData
    }, null, 2);
}

exportWorkbookSummary() {
    return {
        metadata: {
            title: this.currentWorkbook?.title,
            timestamp: new Date().toISOString(),
            explanationLevel: this.explanationLevel,
            theme: this.theme
        },
        problem: {
            type: this.currentProblem?.type,
            category: this.getStoichiometryCategoryFromType(this.currentProblem?.type)
        },
        solution: {
            confidence: this.calculateVerificationConfidence(),
            verified: this.verifyStoichiometryCalculation()?.isValid
        },
        content: {
            sections: this.currentWorkbook?.sections.length || 0,
            steps: this.solutionSteps?.length || 0,
            hasDiagram: !!this.diagramData
        }
    };
 }

}
