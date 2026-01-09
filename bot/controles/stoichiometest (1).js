
import { EnhancedStoichiometryMathematicalWorkbook } from './stoichiometryworkbook.js';
import * as docx from 'docx';
import fs from 'fs';
import path from 'path';

// ============== UTILITY FUNCTION ==============

// Generate all workbook sections for a problem
function generateProblemSections(workbookInstance) {
    const workbook = workbookInstance.currentWorkbook;
    if (!workbook) {
        console.error('No workbook generated');
        return [];
    }

    const sections = [];

    // Process each section
    workbook.sections.forEach((section, sectionIndex) => {
        // Section title
        sections.push(
            new docx.Paragraph({
                text: section.title,
                heading: docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
            })
        );

        // Section content
        if (section.data && Array.isArray(section.data)) {
            section.data.forEach(row => {
                if (Array.isArray(row)) {
                    // Handle table-like data
                    if (row.length === 2 && row[0] && row[1]) {
                        // Key-value pair
                        sections.push(
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: `${row[0]}: `,
                                        bold: true
                                    }),
                                    new docx.TextRun({
                                        text: String(row[1])
                                    })
                                ],
                                spacing: { after: 100 }
                            })
                        );
                    } else if (row[0] === '' && row[1] === '') {
                        // Spacing row
                        sections.push(
                            new docx.Paragraph({
                                text: '',
                                spacing: { after: 200 }
                            })
                        );
                    } else if (row.length > 2) {
                        // Multi-column row
                        sections.push(
                            new docx.Paragraph({
                                text: row.join(' | '),
                                spacing: { after: 100 }
                            })
                        );
                    }
                }
            });
        }

        // Add extra spacing after section
        sections.push(
            new docx.Paragraph({
                text: '',
                spacing: { after: 300 }
            })
        );
    });

    return sections;
}

// ============== STOICHIOMETRY RELATED PROBLEMS GENERATORS ==============

// 1. MOLE CALCULATIONS
function generateRelatedMoleCalculations() {
    const relatedProblems = [];

    // Problem 1: Basic Mole from Mass
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Basic Mole Calculation',
        problem: 'Calculate the number of moles in 36.0 g of H₂O',
        parameters: { mass: 36.0, formula: 'H2O' },
        type: 'mass_to_moles',
        context: { difficulty: 'beginner', topic: 'Mole Calculations' },
        subparts: [
            'Given: mass = 36.0 g, formula = H₂O',
            'Step 1: Calculate molar mass of H₂O',
            'M(H₂O) = 2(1.008) + 15.999 = 18.015 g/mol',
            'Step 2: Apply formula n = m / M',
            'n = 36.0 g / 18.015 g/mol',
            'n = 1.998 mol ≈ 2.00 mol',
            'Check: Makes sense - 36g is about twice 18g'
        ],
        helper: 'Divide mass by molar mass to get moles',
        solution: '2.00 mol',
        realWorldContext: 'Laboratory measurements for chemical reactions'
    });

    // Problem 2: Mass from Moles
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Mass from Moles',
        problem: 'Calculate the mass of 0.500 moles of NaCl',
        parameters: { moles: 0.500, formula: 'NaCl' },
        type: 'moles_to_mass',
        context: { difficulty: 'beginner', topic: 'Mole Calculations' },
        subparts: [
            'Given: n = 0.500 mol, formula = NaCl',
            'Step 1: Calculate molar mass of NaCl',
            'M(NaCl) = 22.990 + 35.45 = 58.44 g/mol',
            'Step 2: Apply formula m = n × M',
            'm = 0.500 mol × 58.44 g/mol',
            'm = 29.22 g ≈ 29.2 g',
            'Check: Half mole gives about half the molar mass'
        ],
        helper: 'Multiply moles by molar mass to get mass',
        solution: '29.2 g',
        realWorldContext: 'Preparing specific amounts for experiments'
    });

    // Problem 3: Molar Mass Calculation
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Molar Mass Calculation',
        problem: 'Calculate the molar mass of Ca(OH)₂',
        parameters: { formula: 'Ca(OH)2' },
        type: 'molar_mass',
        context: { difficulty: 'beginner', topic: 'Molar Mass' },
        subparts: [
            'Given: Ca(OH)₂',
            'Step 1: Identify all atoms',
            'Ca: 1 atom, O: 2 atoms, H: 2 atoms',
            'Step 2: Get atomic masses',
            'Ca = 40.078, O = 15.999, H = 1.008',
            'Step 3: Calculate contributions',
            'Ca: 1 × 40.078 = 40.078',
            'O: 2 × 15.999 = 31.998',
            'H: 2 × 1.008 = 2.016',
            'Step 4: Sum all contributions',
            'M = 40.078 + 31.998 + 2.016 = 74.092 g/mol'
        ],
        helper: 'Remember parentheses multiply all subscripts inside',
        solution: '74.092 g/mol',
        realWorldContext: 'Foundation for all stoichiometric calculations'
    });

    // Problem 4: Particles to Moles
   relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Particles from Moles',
        problem: 'How many molecules are in 2.5 moles of CO₂?',
        parameters: { moles: 2.5 },
        type: 'moles_to_particles',
        context: { difficulty: 'intermediate', topic: 'Avogadro\'s Number' },
        subparts: [
            'Given: n = 2.5 mol',
            'Use Avogadro\'s number: NA = 6.022 × 10²³',
            'Formula: N = n × NA',
            'N = 2.5 mol × 6.022 × 10²³ molecules/mol',
            'N = 1.506 × 10²⁴ molecules',
            'Check: More than 1 mole gives more than 6.022×10²³'
        ],
        helper: 'Multiply moles by Avogadro\'s number',
        solution: '1.51 × 10²⁴ molecules',
        realWorldContext: 'Understanding molecular scale quantities'
    });
    


    // Problem 5: Complex Molar Mass
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Complex Compound',
        problem: 'Calculate the molar mass of Al₂(SO₄)₃',
        parameters: { formula: 'Al2(SO4)3' },
        type: 'molar_mass',
        context: { difficulty: 'intermediate', topic: 'Complex Formulas' },
        subparts: [
            'Given: Al₂(SO₄)₃',
            'Step 1: Expand parentheses',
            'Al: 2 atoms, S: 3 atoms, O: 12 atoms (3×4)',
            'Step 2: Calculate each contribution',
            'Al: 2 × 26.982 = 53.964',
            'S: 3 × 32.06 = 96.18',
            'O: 12 × 15.999 = 191.988',
            'Step 3: Sum all',
            'M = 53.964 + 96.18 + 191.988 = 342.132 g/mol'
        ],
        helper: 'Subscript outside parentheses multiplies everything inside',
        solution: '342.13 g/mol',
        realWorldContext: 'Industrial compounds and salts'
    });

    return relatedProblems;
}

// 2. EQUATION BALANCING
function generateRelatedEquationBalancing() {
    const relatedProblems = [];

    // Problem 1: Simple Balancing
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Simple Equation Balancing',
        problem: 'Balance: H₂ + O₂ → H₂O',
        parameters: { equation: 'H2 + O2 → H2O', unbalanced: true },
        type: 'balancing_equations',
        context: { difficulty: 'beginner', topic: 'Equation Balancing' },
        subparts: [
            'Given: H₂ + O₂ → H₂O (unbalanced)',
            'Count atoms: Left: H=2, O=2; Right: H=2, O=1',
            'Oxygen is unbalanced',
            'Add coefficient 2 to H₂O: H₂ + O₂ → 2H₂O',
            'Recount: Left: H=2, O=2; Right: H=4, O=2',
            'Hydrogen now unbalanced',
            'Add coefficient 2 to H₂: 2H₂ + O₂ → 2H₂O',
            'Final check: Left: H=4, O=2; Right: H=4, O=2 ✓',
            'Balanced: 2H₂ + O₂ → 2H₂O'
        ],
        helper: 'Start with the most complex molecule',
        solution: '2H₂ + O₂ → 2H₂O',
        realWorldContext: 'Combustion and synthesis reactions'
    });

    // Problem 2: Combustion Equation
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Combustion Balancing',
        problem: 'Balance: C₃H₈ + O₂ → CO₂ + H₂O',
        parameters: { equation: 'C3H8 + O2 → CO2 + H2O', unbalanced: true },
        type: 'balancing_equations',
        context: { difficulty: 'intermediate', topic: 'Combustion Reactions' },
        subparts: [
            'Given: C₃H₈ + O₂ → CO₂ + H₂O',
            'Balance C: C₃H₈ + O₂ → 3CO₂ + H₂O',
            'Balance H: C₃H₈ + O₂ → 3CO₂ + 4H₂O',
            'Count O on right: 3(2) + 4(1) = 10 oxygen atoms',
            'Balance O: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
            'Final: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
            'Check all atoms balance ✓'
        ],
        helper: 'Balance C, then H, then O last',
        solution: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
        realWorldContext: 'Propane combustion in grills and heaters'
    });

    // Problem 3: Decomposition
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Decomposition Reaction',
        problem: 'Balance: KClO₃ → KCl + O₂',
        parameters: { equation: 'KClO3 → KCl + O2', unbalanced: true },
        type: 'balancing_equations',
        context: { difficulty: 'beginner', topic: 'Decomposition' },
        subparts: [
            'Given: KClO₃ → KCl + O₂',
            'K and Cl already balance (1:1)',
            'Oxygen: 3 on left, 2 on right',
            'Use 2 KClO₃ to get 6 oxygen',
            '2KClO₃ → KCl + 3O₂',
            'Now balance K and Cl',
            '2KClO₃ → 2KCl + 3O₂',
            'Check: K=2, Cl=2, O=6 on both sides ✓'
        ],
        helper: 'Find LCM for oxygen atoms',
        solution: '2KClO₃ → 2KCl + 3O₂',
        realWorldContext: 'Laboratory oxygen generation'
    });

    return relatedProblems;
}

// 3. MASS-MASS STOICHIOMETRY
function generateRelatedMassMassStoichiometry() {
    const relatedProblems = [];

    // Problem 1: Basic Mass-Mass
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Basic Mass-Mass Stoichiometry',
        problem: 'How many grams of H₂O form from 4.0 g H₂? Reaction: 2H₂ + O₂ → 2H₂O',
        parameters: {
            equation: '2H2 + O2 → 2H2O',
            givenFormula: 'H2',
            givenMass: 4.0,
            desiredFormula: 'H2O',
            givenCoeff: 2,
            desiredCoeff: 2
        },
        type: 'mass_mass_stoichiometry',
        context: { difficulty: 'intermediate', topic: 'Mass-Mass Stoichiometry' },
        subparts: [
            'Given: 4.0 g H₂, equation: 2H₂ + O₂ → 2H₂O',
            'Step 1: Convert H₂ mass to moles',
            'M(H₂) = 2(1.008) = 2.016 g/mol',
            'n(H₂) = 4.0 g / 2.016 g/mol = 1.984 mol',
            'Step 2: Use mole ratio from equation',
            'Ratio H₂:H₂O = 2:2 = 1:1',
            'n(H₂O) = 1.984 mol × (2/2) = 1.984 mol',
            'Step 3: Convert H₂O moles to mass',
            'M(H₂O) = 18.015 g/mol',
            'm(H₂O) = 1.984 mol × 18.015 g/mol = 35.7 g'
        ],
        helper: 'Always go through moles: mass → moles → moles → mass',
        solution: '35.7 g H₂O',
        realWorldContext: 'Hydrogen fuel cell water production'
    });

    // Problem 2: Different Mole Ratio
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Mass-Mass with Different Ratio',
        problem: 'How many grams of NH₃ form from 28.0 g N₂? Reaction: N₂ + 3H₂ → 2NH₃',
        parameters: {
            equation: 'N2 + 3H2 → 2NH3',
            givenFormula: 'N2',
            givenMass: 28.0,
            desiredFormula: 'NH3',
            givenCoeff: 1,
            desiredCoeff: 2
        },
        type: 'mass_mass_stoichiometry',
        context: { difficulty: 'intermediate', topic: 'Mass-Mass Stoichiometry' },
        subparts: [
            'Given: 28.0 g N₂, equation: N₂ + 3H₂ → 2NH₃',
            'Step 1: n(N₂) = 28.0 g / 28.014 g/mol = 0.999 mol',
            'Step 2: Mole ratio N₂:NH₃ = 1:2',
            'n(NH₃) = 0.999 mol × (2/1) = 1.998 mol',
            'Step 3: M(NH₃) = 14.007 + 3(1.008) = 17.031 g/mol',
            'm(NH₃) = 1.998 mol × 17.031 g/mol = 34.0 g'
        ],
        helper: 'Use coefficients from balanced equation for mole ratio',
        solution: '34.0 g NH₃',
        realWorldContext: 'Ammonia production (Haber process)'
    });

    // Problem 3: Combustion Stoichiometry
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Combustion Stoichiometry',
        problem: 'How much CO₂ forms from burning 44.0 g C₃H₈? Reaction: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
        parameters: {
            equation: 'C3H8 + 5O2 → 3CO2 + 4H2O',
            givenFormula: 'C3H8',
            givenMass: 44.0,
            desiredFormula: 'CO2',
            givenCoeff: 1,
            desiredCoeff: 3
        },
        type: 'mass_mass_stoichiometry',
        context: { difficulty: 'intermediate', topic: 'Combustion' },
        subparts: [
            'Given: 44.0 g C₃H₈',
            'M(C₃H₈) = 3(12.011) + 8(1.008) = 44.097 g/mol',
            'n(C₃H₈) = 44.0 / 44.097 = 0.998 mol',
            'Mole ratio C₃H₈:CO₂ = 1:3',
            'n(CO₂) = 0.998 × 3 = 2.994 mol',
            'M(CO₂) = 12.011 + 2(15.999) = 44.009 g/mol',
            'm(CO₂) = 2.994 × 44.009 = 131.7 g'
        ],
        helper: 'Three CO₂ produced for every one C₃H₈',
        solution: '132 g CO₂',
        realWorldContext: 'Carbon dioxide emissions from propane'
    });

    return relatedProblems;
}

// 4. LIMITING REAGENT
function generateRelatedLimitingReagent() {
    const relatedProblems = [];

    // Problem 1: Basic Limiting Reagent
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Basic Limiting Reagent',
        problem: 'Given 10.0 g H₂ and 80.0 g O₂, which is limiting? Reaction: 2H₂ + O₂ → 2H₂O',
        parameters: {
            equation: '2H2 + O2 → 2H2O',
            reactants: [
                { formula: 'H2', mass: 10.0 },
                { formula: 'O2', mass: 80.0 }
            ],
            coefficients: {
                'H2': 2,
                'O2': 1,
                'H2O': 2
            }
        },
        type: 'limiting_reagent',
        context: { difficulty: 'intermediate', topic: 'Limiting Reagent' },
        subparts: [
            'Given: 10.0 g H₂, 80.0 g O₂',
            'Equation: 2H₂ + O₂ → 2H₂O',
            'Step 1: Convert to moles',
            'n(H₂) = 10.0 / 2.016 = 4.96 mol',
            'n(O₂) = 80.0 / 32.00 = 2.50 mol',
            'Step 2: Calculate moles/coefficient',
            'H₂: 4.96 / 2 = 2.48',
            'O₂: 2.50 / 1 = 2.50',
            'Step 3: Smallest ratio is limiting',
            'H₂ has smallest ratio (2.48 < 2.50)',
            'H₂ is the limiting reagent',
            'O₂ is in excess'
        ],
        helper: 'Compare (moles/coefficient) for each reactant',
        solution: 'H₂ is limiting reagent',
        realWorldContext: 'Optimizing reactant amounts in synthesis'
    });

    // Problem 2: Limiting Reagent with Product Calculation
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Limiting Reagent with Product Calculation',
        problem: '20.0 g N₂ + 6.0 g H₂ → NH₃. Find limiting reagent and NH₃ produced',
        parameters: {
            equation: 'N2 + 3H2 → 2NH3',
            reactants: [
                { formula: 'N2', mass: 20.0 },
                { formula: 'H2', mass: 6.0 }
            ],
            coefficients: {
                'N2': 1,
                'H2': 3,
                'NH3': 2
            },
            desiredProduct: { formula: 'NH3' }
        },
        type: 'limiting_reagent',
        context: { difficulty: 'advanced', topic: 'Limiting Reagent with Products' },
        subparts: [
            'Given: 20.0 g N₂, 6.0 g H₂',
            'n(N₂) = 20.0 / 28.014 = 0.714 mol',
            'n(H₂) = 6.0 / 2.016 = 2.976 mol',
            'Ratios: N₂: 0.714/1 = 0.714',
            '        H₂: 2.976/3 = 0.992',
            'N₂ is limiting (0.714 < 0.992)',
            'Product from limiting: n(NH₃) = 0.714 × 2 = 1.428 mol',
            'm(NH₃) = 1.428 × 17.031 = 24.3 g'
        ],
        helper: 'Always use limiting reagent for product calculations',
        solution: 'N₂ limiting, 24.3 g NH₃ produced',
        realWorldContext: 'Industrial ammonia production'
    });

    return relatedProblems;
}


// 5. PERCENT YIELD
function generateRelatedPercentYield() {
    const relatedProblems = [];

    // Problem 1: Basic Percent Yield (This one is correct)
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Basic Percent Yield',
        problem: 'Theoretical yield = 50.0 g, Actual yield = 42.5 g. Find % yield',
        parameters: { 
            theoreticalYield: 50.0, 
            actualYield: 42.5 
        },
        type: 'percent_yield',
        context: { difficulty: 'beginner', topic: 'Percent Yield' },
        subparts: [
            'Given: Theoretical = 50.0 g, Actual = 42.5 g',
            'Formula: % yield = (actual / theoretical) × 100%',
            '% yield = (42.5 / 50.0) × 100%',
            '% yield = 0.850 × 100%',
            '% yield = 85.0%',
            'Interpretation: Good yield, 85% efficiency'
        ],
        helper: 'Divide actual by theoretical, multiply by 100',
        solution: '85.0%',
        realWorldContext: 'Evaluating reaction efficiency'
    });

    // Problem 2: Finding Actual Yield - FIXED VERSION
    // Since the solver requires BOTH actual and theoretical, we calculate actual first
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Calculate Percent Yield',
        problem: 'If theoretical yield is 75.0 g and actual yield is 58.9 g, find % yield',
        parameters: { 
            theoreticalYield: 75.0, 
            actualYield: 58.875  // This is 78.5% of 75.0
        },
        type: 'percent_yield',
        context: { difficulty: 'intermediate', topic: 'Yield Calculations' },
        subparts: [
            'Given: Theoretical = 75.0 g, Actual = 58.9 g',
            'Formula: % yield = (actual / theoretical) × 100%',
            '% yield = (58.875 / 75.0) × 100%',
            '% yield = 0.785 × 100%',
            '% yield = 78.5%',
            'Note: In practice, you might be given % and asked to find actual:',
            'Rearranged: actual = theoretical × (% yield / 100)',
            'This would give: actual = 75.0 × 0.785 = 58.9 g'
        ],
        helper: 'When given %, multiply theoretical by decimal form to find actual',
        solution: '78.5%',
        realWorldContext: 'Predicting actual product amounts from percent yield'
    });

    // Problem 3: Complete Yield Problem (This one is correct)
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Complete Yield Problem',
        problem: '10.0 g Mg reacts with excess O₂ to form MgO. If 14.8 g MgO obtained, find % yield. Reaction: 2Mg + O₂ → 2MgO',
        parameters: {
            theoreticalYield: 16.58,  // Calculated from stoichiometry
            actualYield: 14.8
        },
        type: 'percent_yield',
        context: { difficulty: 'advanced', topic: 'Complete Yield Analysis' },
        subparts: [
            'Given: 10.0 g Mg, 14.8 g MgO actual',
            'Step 1: Calculate theoretical yield',
            'n(Mg) = 10.0 / 24.305 = 0.411 mol',
            'Ratio Mg:MgO = 2:2 = 1:1',
            'n(MgO) = 0.411 mol',
            'M(MgO) = 24.305 + 15.999 = 40.304 g/mol',
            'Theoretical = 0.411 × 40.304 = 16.6 g',
            'Step 2: Calculate % yield',
            '% = (14.8 / 16.6) × 100% = 89.2%'
        ],
        helper: 'First find theoretical, then calculate percentage',
        solution: '89.2%',
        realWorldContext: 'Real lab reaction efficiency'
    });

    return relatedProblems;
}

// 6. GAS STOICHIOMETRY
function generateRelatedGasStoichiometry() {
    const relatedProblems = [];

    // Problem 1: STP Volume
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Gas Volume at STP',
        problem: 'What volume does 2.0 moles of CO₂ occupy at STP?',
        parameters: { 
            moles: 2.0, 
            atSTP: true 
        },
        type: 'gas_stoichiometry',
        context: { difficulty: 'beginner', topic: 'Gas at STP' },
        subparts: [
            'Given: n = 2.0 mol, conditions = STP',
            'At STP: 1 mol = 22.4 L',
            'Formula: V = n × 22.4 L/mol',
            'V = 2.0 mol × 22.4 L/mol',
            'V = 44.8 L',
            'Check: Twice the moles gives twice the volume'
        ],
        helper: 'At STP, multiply moles by 22.4 L/mol',
        solution: '44.8 L',
        realWorldContext: 'Standard gas measurements'
    });

    // Problem 2: Ideal Gas Law
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Ideal Gas Law',
        problem: 'Find moles in 10.0 L at 2.0 atm and 300 K',
        parameters: { 
            pressure: 2.0, 
            volume: 10.0, 
            temperature: 300, 
            atSTP: false 
        },
        type: 'gas_stoichiometry',
        context: { difficulty: 'intermediate', topic: 'Ideal Gas Law' },
        subparts: [
            'Given: P = 2.0 atm, V = 10.0 L, T = 300 K',
            'Use PV = nRT',
            'R = 0.08206 L·atm/(mol·K)',
            'Solve for n: n = PV / RT',
            'n = (2.0 × 10.0) / (0.08206 × 300)',
            'n = 20.0 / 24.618',
            'n = 0.813 mol'
        ],
        helper: 'Use PV = nRT when not at STP',
        solution: '0.813 mol',
        realWorldContext: 'Non-standard condition calculations'
    });

    // Problem 3: Gas-Gas Stoichiometry at STP
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Gas Stoichiometry Problem',
        problem: 'How many liters of O₂ (STP) needed to burn 5.0 L CH₄ at STP? CH₄ + 2O₂ → CO₂ + 2H₂O',
        parameters: {
            equation: 'CH4 + 2O2 → CO2 + 2H2O',
            volume: 5.0,  // Volume of CH4
            atSTP: true
        },
        type: 'gas_stoichiometry',
        context: { difficulty: 'intermediate', topic: 'Gas-Gas Stoichiometry' },
        subparts: [
            'Given: 5.0 L CH₄ at STP',
            'At STP, volume ratio = mole ratio',
            'From equation: CH₄:O₂ = 1:2',
            'V(O₂) = V(CH₄) × (2/1)',
            'V(O₂) = 5.0 L × 2',
            'V(O₂) = 10.0 L',
            'At STP, gases react in volume ratios'
        ],
        helper: 'At STP, volume ratios equal mole ratios',
        solution: '10.0 L O₂',
        realWorldContext: 'Combustion gas requirements'
    });

    return relatedProblems;
}

// 7. SOLUTION STOICHIOMETRY
function generateRelatedSolutionStoichiometry() {
    const relatedProblems = [];

    // Problem 1: Basic Molarity
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Basic Molarity Calculation',
        problem: 'Calculate molarity of 0.50 moles NaCl in 2.0 L solution',
        parameters: { moles: 0.50, volume: 2.0 },
        type: 'solution_molarity',
        context: { difficulty: 'beginner', topic: 'Molarity' },
        subparts: [
            'Given: n = 0.50 mol, V = 2.0 L',
            'Formula: M = n / V',
            'M = 0.50 mol / 2.0 L',
            'M = 0.25 mol/L',
            'M = 0.25 M',
            'Check: Units are mol/L or M'
        ],
        helper: 'Divide moles by volume in liters',
        solution: '0.25 M',
        realWorldContext: 'Preparing laboratory solutions'
    });

    // Problem 2: Dilution
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Dilution Problem',
        problem: 'Dilute 50.0 mL of 6.0 M HCl to 200.0 mL. Find final molarity',
        parameters: { M1: 6.0, V1: 50.0, V2: 200.0 },
        type: 'dilution',
        context: { difficulty: 'intermediate', topic: 'Dilution' },
        subparts: [
            'Given: M₁ = 6.0 M, V₁ = 50.0 mL, V₂ = 200.0 mL',
            'Use M₁V₁ = M₂V₂',
            'Solve for M₂: M₂ = M₁V₁ / V₂',
            'M₂ = (6.0 M × 50.0 mL) / 200.0 mL',
            'M₂ = 300.0 / 200.0',
            'M₂ = 1.5 M',
            'Check: Final concentration is lower (diluted)'
        ],
        helper: 'Use M₁V₁ = M₂V₂ for dilution problems',
        solution: '1.5 M',
        realWorldContext: 'Preparing working solutions from stock'
    });

    // Problem 3: Solution Stoichiometry
    /**relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Solution Reaction Stoichiometry',
        problem: 'How many mL of 0.500 M NaOH needed to neutralize 25.0 mL of 0.400 M H₂SO₄?',
        parameters: {
            equation: 'H2SO4 + 2NaOH → Na2SO4 + 2H2O',
            acidMolarity: 0.400,
            acidVolume: 25.0,
            baseMolarity: 0.500,
            acidFormula: 'H2SO4',
            baseFormula: 'NaOH'
        },
        type: 'titration',
        context: { difficulty: 'intermediate', topic: 'Acid-Base Titration' },
        subparts: [
            'Given: 25.0 mL of 0.400 M H₂SO₄',
            'Need: volume of 0.500 M NaOH',
            'Equation: H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
            'Step 1: Find moles of H₂SO₄',
            'n(H₂SO₄) = 0.400 M × 0.0250 L = 0.0100 mol',
            'Step 2: Use mole ratio (1:2)',
            'n(NaOH) = 0.0100 mol × 2 = 0.0200 mol',
            'Step 3: Find volume of NaOH',
            'V = n / M = 0.0200 mol / 0.500 M = 0.0400 L = 40.0 mL'
        ],
        helper: 'Remember the 1:2 mole ratio from equation',
        solution: '40.0 mL NaOH',
        realWorldContext: 'Acid-base neutralization in titrations'
    });
    */
    // Problem 4: Moles from Molarity
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Moles from Molarity and Volume',
        problem: 'How many moles in 250 mL of 0.800 M NaCl?',
        parameters: { molarity: 0.800, volume: 250 },
        type: 'solution_molarity',
        context: { difficulty: 'beginner', topic: 'Solution Calculations' },
        subparts: [
            'Given: M = 0.800 M, V = 250 mL = 0.250 L',
            'Formula: n = M × V',
            'n = 0.800 mol/L × 0.250 L',
            'n = 0.200 mol',
            'Remember: Convert mL to L first!'
        ],
        helper: 'Multiply molarity by volume in liters',
        solution: '0.200 mol',
        realWorldContext: 'Calculating amounts in solution'
    });

    return relatedProblems;
}

// 8. THERMOCHEMICAL
function generateRelatedThermochemical() {
    const relatedProblems = [];

    // Problem 1: Enthalpy Calculation
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Enthalpy Change Calculation',
        problem: 'Burning 1 mol CH₄ releases 890 kJ. How much heat from 16.0 g CH₄?',
        parameters: {
            equation: 'CH4 + 2O2 → CO2 + 2H2O, ΔH = -890 kJ',
            givenMass: 16.0,
            givenFormula: 'CH4',
            enthalpyPerMole: -890
        },
        type: 'thermochemical',
        context: { difficulty: 'intermediate', topic: 'Thermochemistry' },
        subparts: [
            'Given: 16.0 g CH₄, ΔH = -890 kJ/mol',
            'Step 1: Convert mass to moles',
            'M(CH₄) = 12.011 + 4(1.008) = 16.043 g/mol',
            'n = 16.0 g / 16.043 g/mol = 0.997 mol',
            'Step 2: Calculate heat released',
            'Heat = n × ΔH',
            'Heat = 0.997 mol × (-890 kJ/mol)',
            'Heat = -887 kJ (released)',
            'Negative sign means exothermic'
        ],
        helper: 'Multiply moles by enthalpy per mole',
        solution: '887 kJ released',
        realWorldContext: 'Energy from fuel combustion'
    });

    // Problem 2: Simple enthalpy
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Heat from Combustion',
        problem: 'If 2 moles of H₂ burn releasing 572 kJ, how much heat per mole?',
        parameters: {
            givenMass: 4.032,  // 2 moles * 2.016 g/mol
            givenFormula: 'H2',
            enthalpyPerMole: -286  // 572/2
        },
        type: 'thermochemical',
        context: { difficulty: 'beginner', topic:'Thermochemistry' },
        subparts: [
            'Given: 2 moles H₂ releases 572 kJ',
            'Heat per mole = 572 kJ / 2 mol = 286 kJ/mol',
            'For calculation: Use 4.032 g H₂ (2 moles)',
            'M(H₂) = 2(1.008) = 2.016 g/mol',
            'n = 4.032 / 2.016 = 2.00 mol',
            'Heat = 2.00 mol × (-286 kJ/mol) = -572 kJ'
        ],
        helper: 'Divide total heat by number of moles',
        solution: '286 kJ/mol',
        realWorldContext: 'Hydrogen fuel energy content'
    });

    // Problem 3: Endothermic reaction
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Endothermic Reaction Energy',
        problem: 'Decomposition of 1 mol NH₄NO₃ absorbs 25.7 kJ. How much heat for 40.0 g?',
        parameters: {
            equation: 'NH4NO3 → N2O + 2H2O, ΔH = +25.7 kJ',
            givenMass: 40.0,
            givenFormula: 'NH4NO3',
            enthalpyPerMole: 25.7
        },
        type: 'thermochemical',
        context: { difficulty: 'intermediate', topic: 'Endothermic Reactions' },
        subparts: [
            'Given: 40.0 g NH₄NO₃, ΔH = +25.7 kJ/mol',
            'M(NH₄NO₃) = 14.007 + 4(1.008) + 14.007 + 3(15.999)',
            'M = 80.043 g/mol',
            'n = 40.0 / 80.043 = 0.500 mol',
            'Heat = 0.500 mol × (+25.7 kJ/mol) = +12.9 kJ',
            'Positive = endothermic (absorbs heat)'
        ],
        helper: 'Positive ΔH means heat is absorbed',
        solution: '12.9 kJ absorbed',
        realWorldContext: 'Cold packs use endothermic reactions'
    });

    return relatedProblems;
}

// 9. EMPIRICAL FORMULA
function generateRelatedEmpiricalFormula() {
    const relatedProblems = [];

    // Problem 1: Basic Empirical Formula
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Basic Empirical Formula',
        problem: 'Find empirical formula: 40.0% C, 6.7% H, 53.3% O',
        parameters: {
            composition: { 
                C: 40.0, 
                H: 6.7, 
                O: 53.3 
            }
        },
        type: 'empirical_formula',
        context: { difficulty: 'intermediate', topic: 'Empirical Formula' },
        subparts: [
            'Given: 40.0% C, 6.7% H, 53.3% O',
            'Step 1: Assume 100 g sample',
            'Mass: C = 40.0 g, H = 6.7 g, O = 53.3 g',
            'Step 2: Convert to moles',
            'n(C) = 40.0 / 12.011 = 3.33 mol',
            'n(H) = 6.7 / 1.008 = 6.65 mol',
            'n(O) = 53.3 / 15.999 = 3.33 mol',
            'Step 3: Divide by smallest (3.33)',
            'C: 3.33/3.33 = 1',
            'H: 6.65/3.33 = 2',
            'O: 3.33/3.33 = 1',
            'Empirical formula: CH₂O'
        ],
        helper: 'Divide by smallest mole value to get ratios',
        solution: 'CH₂O',
        realWorldContext: 'Determining formula from composition data'
    });

    // Problem 2: Molecular Formula
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Molecular Formula from Empirical',
        problem: 'Empirical formula CH₂O, molar mass 180 g/mol. Find molecular formula',
        parameters: {
            empiricalFormula: 'CH2O',
            molarMass: 180
        },
        type: 'molecular_formula',
        context: { difficulty: 'intermediate', topic: 'Molecular Formula' },
        subparts: [
            'Given: Empirical = CH₂O, MM = 180 g/mol',
            'Step 1: Find empirical formula mass',
            'EF mass = 12.011 + 2(1.008) + 15.999 = 30.026 g/mol',
            'Step 2: Find multiplier n',
            'n = MM / EF mass = 180 / 30.026 = 5.99 ≈ 6',
            'Step 3: Multiply empirical formula by n',
            'Molecular formula = (CH₂O)₆ = C₆H₁₂O₆'
        ],
        helper: 'Divide molecular mass by empirical mass',
        solution: 'C₆H₁₂O₆',
        realWorldContext: 'Glucose formula determination'
    });

    // Problem 3: Another empirical formula
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Empirical Formula from Percentages',
        problem: 'Find empirical formula: 52.2% C, 13.0% H, 34.8% O',
        parameters: {
            composition: { 
                C: 52.2, 
                H: 13.0, 
                O: 34.8 
            }
        },
        type: 'empirical_formula',
        context: { difficulty: 'intermediate', topic: 'Empirical Formula' },
        subparts: [
            'Given: 52.2% C, 13.0% H, 34.8% O',
            'Assume 100g: C = 52.2 g, H = 13.0 g, O = 34.8 g',
            'Convert to moles:',
            'n(C) = 52.2 / 12.011 = 4.35 mol',
            'n(H) = 13.0 / 1.008 = 12.9 mol',
            'n(O) = 34.8 / 15.999 = 2.18 mol',
            'Divide by smallest (2.18):',
            'C: 4.35/2.18 = 2',
            'H: 12.9/2.18 = 6',
            'O: 2.18/2.18 = 1',
            'Empirical formula: C₂H₆O'
        ],
        helper: 'Always divide by smallest mole value',
        solution: 'C₂H₆O',
        realWorldContext: 'Ethanol formula determination'
    });

    // Problem 4: Complex Empirical Formula
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Complex Ratio Empirical Formula',
        problem: 'Find empirical formula: 26.7% P, 12.1% N, 61.2% Cl',
        parameters: {
            composition: { 
                P: 26.7, 
                N: 12.1, 
                Cl: 61.2 
            }
        },
        type: 'empirical_formula',
        context: { difficulty: 'advanced', topic: 'Complex Empirical Formulas' },
        subparts: [
            'Given: 26.7% P, 12.1% N, 61.2% Cl',
            'Assume 100 g: P = 26.7 g, N = 12.1 g, Cl = 61.2 g',
            'Convert to moles:',
            'n(P) = 26.7 / 30.974 = 0.862 mol',
            'n(N) = 12.1 / 14.007 = 0.864 mol',
            'n(Cl) = 61.2 / 35.45 = 1.726 mol',
            'Divide by smallest (0.862):',
            'P: 0.862/0.862 = 1',
            'N: 0.864/0.862 = 1.00',
            'Cl: 1.726/0.862 = 2.00',
            'Empirical formula: PNCl₂'
        ],
        helper: 'All ratios worked out to whole numbers easily',
        solution: 'PNCl₂',
        realWorldContext: 'Inorganic compound analysis'
    });

    return relatedProblems;
}

// ============== SOLVER FUNCTIONS ==============

function solveMoleCalculationProblems() {
    const problems = generateRelatedMoleCalculations();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Mole Calculation ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedStoichiometryMathematicalWorkbook({
            theme: 'scientific',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveStoichiometryProblem({
            problemType: problem.type,
            parameters: problem.parameters,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solveEquationBalancingProblems() {
    const problems = generateRelatedEquationBalancing();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Equation Balancing ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedStoichiometryMathematicalWorkbook({
            theme: 'scientific',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveStoichiometryProblem({
            equation: problem.parameters.equation,
            problemType: problem.type,
            parameters: problem.parameters,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solveMassMassProblems() {
    const problems = generateRelatedMassMassStoichiometry();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Mass-Mass Stoichiometry ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedStoichiometryMathematicalWorkbook({
            theme: 'scientific',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveStoichiometryProblem({
            equation: problem.parameters.equation,
            problemType: problem.type,
            parameters: problem.parameters,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solveLimitingReagentProblems() {
    const problems = generateRelatedLimitingReagent();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Limiting Reagent ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedStoichiometryMathematicalWorkbook({
            theme: 'scientific',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveStoichiometryProblem({
            equation: problem.parameters.equation,
            problemType: problem.type,
            parameters: problem.parameters,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solvePercentYieldProblems() {
    const problems = generateRelatedPercentYield();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Percent Yield ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedStoichiometryMathematicalWorkbook({
            theme: 'scientific',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveStoichiometryProblem({
            equation: problem.parameters.equation,
            problemType: problem.type,
            parameters: problem.parameters,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solveGasStoichiometryProblems() {
    const problems = generateRelatedGasStoichiometry();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Gas Stoichiometry ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedStoichiometryMathematicalWorkbook({
            theme: 'scientific',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveStoichiometryProblem({
            equation: problem.parameters.equation,
            problemType: problem.type,
            parameters: problem.parameters,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solveSolutionStoichiometryProblems() {
    const problems = generateRelatedSolutionStoichiometry();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Solution Stoichiometry ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedStoichiometryMathematicalWorkbook({
            theme: 'scientific',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveStoichiometryProblem({
            equation: problem.parameters.equation,
            problemType: problem.type,
            parameters: problem.parameters,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solveThermochemicalProblems() {
    const problems = generateRelatedThermochemical();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Thermochemical ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedStoichiometryMathematicalWorkbook({
            theme: 'scientific',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveStoichiometryProblem({
            equation: problem.parameters.equation,
            problemType: problem.type,
            parameters: problem.parameters,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solveEmpiricalFormulaProblems() {
    const problems = generateRelatedEmpiricalFormula();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Empirical Formula ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedStoichiometryMathematicalWorkbook({
            theme: 'scientific',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveStoichiometryProblem({
            problemType: problem.type,
            parameters: problem.parameters,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

// ============== COMPREHENSIVE DOCUMENT GENERATION ==============

async function generateComprehensiveStoichiometryDocument() {
    console.log('Generating Comprehensive Stoichiometry Workbook with Related Problems...');
    console.log('='.repeat(80));

    const documentChildren = [];

    // ============== DOCUMENT HEADER ==============
    documentChildren.push(
        new docx.Paragraph({
            text: 'Comprehensive Stoichiometry Workbook',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { after: 200 },
            alignment: docx.AlignmentType.CENTER
        })
    );

    documentChildren.push(
        new docx.Paragraph({
            text: 'Complete Guide with Related Problems',
            spacing: { after: 150 },
            alignment: docx.AlignmentType.CENTER
        })
    );

    documentChildren.push(
        new docx.Paragraph({
            text: 'Mole Calculations, Stoichiometry, Gas Laws, and Chemical Formulas',
            spacing: { after: 300 },
            alignment: docx.AlignmentType.CENTER
        })
    );

    documentChildren.push(
        new docx.Paragraph({
            text: `Generated: ${new Date().toLocaleString()}`,
            spacing: { after: 600 },
            alignment: docx.AlignmentType.CENTER
        })
    );

    // ============== TABLE OF CONTENTS ==============
    documentChildren.push(
        new docx.Paragraph({
            text: 'Table of Contents',
            heading: docx.HeadingLevel.HEADING_2,
            spacing: { after: 200 }
        })
    );

    // Part I: Mole Calculations
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part I: Mole Calculations (5 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const moleProblems = generateRelatedMoleCalculations();
    moleProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 1}. ${problem.scenario}: ${problem.problem}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part II: Equation Balancing
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part II: Equation Balancing (3 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const balancingProblems = generateRelatedEquationBalancing();
    balancingProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 6}. ${problem.scenario}: ${problem.problem}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part III: Mass-Mass Stoichiometry
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part III: Mass-Mass Stoichiometry (3 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const massMassProblems = generateRelatedMassMassStoichiometry();
    massMassProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 9}. ${problem.scenario}: ${problem.problem}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part IV: Limiting Reagent
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part IV: Limiting Reagent (2 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const limitingProblems = generateRelatedLimitingReagent();
    limitingProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 12}. ${problem.scenario}: ${problem.problem}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part V: Percent Yield
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part V: Percent Yield (3 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const yieldProblems = generateRelatedPercentYield();
    yieldProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 14}. ${problem.scenario}: ${problem.problem}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part VI: Gas Stoichiometry
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part VI: Gas Stoichiometry (3 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const gasProblems = generateRelatedGasStoichiometry();
    gasProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 17}. ${problem.scenario}: ${problem.problem}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part VII: Solution Stoichiometry
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part VII: Solution Stoichiometry (4 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const solutionProblems = generateRelatedSolutionStoichiometry();
    solutionProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 20}. ${problem.scenario}: ${problem.problem}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part VIII: Thermochemical
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part VIII: Thermochemistry (3 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const thermoProblems = generateRelatedThermochemical();
    thermoProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 24}. ${problem.scenario}: ${problem.problem}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part IX: Empirical Formula
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part IX: Empirical and Molecular Formulas (4 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const empiricalProblems = generateRelatedEmpiricalFormula();
    empiricalProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 27}. ${problem.scenario}: ${problem.problem}`,
                spacing: { after: 100 }
            })
        );
    });

    documentChildren.push(
        new docx.Paragraph({
            text: '',
            spacing: { after: 400 }
        })
    );

    // ============== PART I: MOLE CALCULATIONS ==============
    console.log('\nProcessing Part I: Mole Calculations...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part I: Mole Calculations',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const moleSolved = solveMoleCalculationProblems();
    moleSolved.forEach((solved, index) => {
        console.log(`  Adding Mole Calculation Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 1}: ${solved.problem.scenario}`,
                heading: docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 300 },
                pageBreakBefore: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `${solved.problem.problem}`,
                spacing: { after: 200 },
                bold: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Difficulty: ${solved.problem.difficulty}`,
                spacing: { after: 100 }
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Helper Tip: ${solved.problem.helper}`,
                spacing: { after: 200 },
                italics: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Real-World Context: ${solved.problem.realWorldContext}`,
                spacing: { after: 300 },
                italics: true
            })
        );

        documentChildren.push(...generateProblemSections(solved.workbook));
    });

    // ============== PART II: EQUATION BALANCING ==============
    console.log('\nProcessing Part II: Equation Balancing...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part II: Equation Balancing',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const balancingSolved = solveEquationBalancingProblems();
    balancingSolved.forEach((solved, index) => {
        console.log(`  Adding Equation Balancing Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 6}: ${solved.problem.scenario}`,
                heading: docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 300 },
                pageBreakBefore: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `${solved.problem.problem}`,
                spacing: { after: 200 },
                bold: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Difficulty: ${solved.problem.difficulty}`,
                spacing: { after: 100 }
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Helper Tip: ${solved.problem.helper}`,
                spacing: { after: 200 },
                italics: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Real-World Context: ${solved.problem.realWorldContext}`,
                spacing: { after: 300 },
                italics: true
            })
        );

        documentChildren.push(...generateProblemSections(solved.workbook));
    });

    // ============== PART III: MASS-MASS STOICHIOMETRY ==============
    console.log('\nProcessing Part III: Mass-Mass Stoichiometry...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part III: Mass-Mass Stoichiometry',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const massMassSolved = solveMassMassProblems();
    massMassSolved.forEach((solved, index) => {
        console.log(`  Adding Mass-Mass Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 9}: ${solved.problem.scenario}`,
                heading: docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 300 },
                pageBreakBefore: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `${solved.problem.problem}`,
                spacing: { after: 200 },
                bold: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Difficulty: ${solved.problem.difficulty}`,
                spacing: { after: 100 }
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Helper Tip: ${solved.problem.helper}`,
                spacing: { after: 200 },
                italics: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Real-World Context: ${solved.problem.realWorldContext}`,
                spacing: { after: 300 },
                italics: true
            })
        );

        documentChildren.push(...generateProblemSections(solved.workbook));
    });

    // ============== PART IV: LIMITING REAGENT ==============
    console.log('\nProcessing Part IV: Limiting Reagent...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part IV: Limiting Reagent',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const limitingSolved = solveLimitingReagentProblems();
    limitingSolved.forEach((solved, index) => {
        console.log(`  Adding Limiting Reagent Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 12}: ${solved.problem.scenario}`,
                heading: docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 300 },
                pageBreakBefore: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `${solved.problem.problem}`,
                spacing: { after: 200 },
                bold: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Difficulty: ${solved.problem.difficulty}`,
                spacing: { after: 100 }
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Helper Tip: ${solved.problem.helper}`,
                spacing: { after: 200 },
                italics: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Real-World Context: ${solved.problem.realWorldContext}`,
                spacing: { after: 300 },
                italics: true
            })
        );

        documentChildren.push(...generateProblemSections(solved.workbook));
    });

    // ============== PART V: PERCENT YIELD ==============
    console.log('\nProcessing Part V: Percent Yield...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part V: Percent Yield',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const yieldSolved = solvePercentYieldProblems();
    yieldSolved.forEach((solved, index) => {
        console.log(`  Adding Percent Yield Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 14}: ${solved.problem.scenario}`,
                heading: docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 300 },
                pageBreakBefore: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `${solved.problem.problem}`,
                spacing: { after: 200 },
                bold: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Difficulty: ${solved.problem.difficulty}`,
                spacing: { after: 100 }
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Helper Tip: ${solved.problem.helper}`,
                spacing: { after: 200 },
                italics: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Real-World Context: ${solved.problem.realWorldContext}`,
                spacing: { after: 300 },
                italics: true
            })
        );

        documentChildren.push(...generateProblemSections(solved.workbook));
    });

    // ============== PART VI: GAS STOICHIOMETRY ==============
    console.log('\nProcessing Part VI: Gas Stoichiometry...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part VI: Gas Stoichiometry',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const gasSolved = solveGasStoichiometryProblems();
    gasSolved.forEach((solved, index) => {
        console.log(`  Adding Gas Stoichiometry Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 17}: ${solved.problem.scenario}`,
                heading: docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 300 },
                pageBreakBefore: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `${solved.problem.problem}`,
                spacing: { after: 200 },
                bold: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Difficulty: ${solved.problem.difficulty}`,
                spacing: { after: 100 }
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Helper Tip: ${solved.problem.helper}`,
                spacing: { after: 200 },
                italics: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Real-World Context: ${solved.problem.realWorldContext}`,
                spacing: { after: 300 },
                italics: true
            })
        );

        documentChildren.push(...generateProblemSections(solved.workbook));
    });

    // ============== PART VII: SOLUTION STOICHIOMETRY ==============
    console.log('\nProcessing Part VII: Solution Stoichiometry...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part VII: Solution Stoichiometry',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const solutionSolved = solveSolutionStoichiometryProblems();
    solutionSolved.forEach((solved, index) => {
        console.log(`  Adding Solution Stoichiometry Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 20}: ${solved.problem.scenario}`,
                heading: docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 300 },
                pageBreakBefore: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `${solved.problem.problem}`,
                spacing: { after: 200 },
                bold: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Difficulty: ${solved.problem.difficulty}`,
                spacing: { after: 100 }
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Helper Tip: ${solved.problem.helper}`,
                spacing: { after: 200 },
                italics: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Real-World Context: ${solved.problem.realWorldContext}`,
                spacing: { after: 300 },
                italics: true
            })
        );

        documentChildren.push(...generateProblemSections(solved.workbook));
    });

    // ============== PART VIII: THERMOCHEMISTRY ==============
    console.log('\nProcessing Part VIII: Thermochemistry...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part VIII: Thermochemistry',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const thermoSolved = solveThermochemicalProblems();
    thermoSolved.forEach((solved, index) => {
        console.log(`  Adding Thermochemical Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 24}: ${solved.problem.scenario}`,
                heading: docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 300 },
                pageBreakBefore: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `${solved.problem.problem}`,
                spacing: { after: 200 },
                bold: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Difficulty: ${solved.problem.difficulty}`,
                spacing: { after: 100 }
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Helper Tip: ${solved.problem.helper}`,
                spacing: { after: 200 },
                italics: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Real-World Context: ${solved.problem.realWorldContext}`,
                spacing: { after: 300 },
                italics: true
            })
        );

        documentChildren.push(...generateProblemSections(solved.workbook));
    });
    


    // ============== PART IX: EMPIRICAL AND MOLECULAR FORMULAS ==============
    console.log('\nProcessing Part IX: Empirical and Molecular Formulas...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part IX: Empirical and Molecular Formulas',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const empiricalSolved = solveEmpiricalFormulaProblems();
    empiricalSolved.forEach((solved, index) => {
        console.log(`  Adding Empirical Formula Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 27}: ${solved.problem.scenario}`,
                heading: docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 300 },
                pageBreakBefore: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `${solved.problem.problem}`,
                spacing: { after: 200 },
                bold: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Difficulty: ${solved.problem.difficulty}`,
                spacing: { after: 100 }
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Helper Tip: ${solved.problem.helper}`,
                spacing: { after: 200 },
                italics: true
            })
        );

        documentChildren.push(
            new docx.Paragraph({
                text: `Real-World Context: ${solved.problem.realWorldContext}`,
                spacing: { after: 300 },
                italics: true
            })
        );

        documentChildren.push(...generateProblemSections(solved.workbook));
    });

    // ============== CREATE AND SAVE DOCUMENT ==============
    const doc = new docx.Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 720,    // 0.5 inch
                        right: 720,
                        bottom: 720,
                        left: 720
                    }
                }
            },
            children: documentChildren
        }]
    });

    // Save the document
    try {
        const buffer = await docx.Packer.toBuffer(doc);
        const filename = 'comprehensive_stoichiometry_workbook_with_related_problems.docx';
        const outputPath = path.join(process.cwd(), filename);
        fs.writeFileSync(outputPath, buffer);

        console.log('\n' + '='.repeat(80));
        console.log('✓ COMPREHENSIVE STOICHIOMETRY DOCUMENT GENERATION COMPLETE');
        console.log('='.repeat(80));
        console.log(`\n✓ Document saved as: ${outputPath}`);
        console.log('\n📊 DOCUMENT STATISTICS:');
        console.log('  • Total Problems: 30');
        console.log('    - Mole Calculations: 5 problems');
        console.log('    - Equation Balancing: 3 problems');
        console.log('    - Mass-Mass Stoichiometry: 3 problems');
        console.log('    - Limiting Reagent: 2 problems');
        console.log('    - Percent Yield: 3 problems');
        console.log('    - Gas Stoichiometry: 3 problems');
        console.log('    - Solution Stoichiometry: 4 problems');
        console.log('    - Thermochemistry: 3 problems');
        console.log('    - Empirical/Molecular Formulas: 4 problems');
        console.log('\n📖 CONTENT BREAKDOWN:');
        console.log('  • Part I: Mole Calculations (Problems 1-5)');
        console.log('  • Part II: Equation Balancing (Problems 6-8)');
        console.log('  • Part III: Mass-Mass Stoichiometry (Problems 9-11)');
        console.log('  • Part IV: Limiting Reagent (Problems 12-13)');
        console.log('  • Part V: Percent Yield (Problems 14-16)');
        console.log('  • Part VI: Gas Stoichiometry (Problems 17-19)');
        console.log('  • Part VII: Solution Stoichiometry (Problems 20-23)');
        console.log('  • Part VIII: Thermochemistry (Problems 24-26)');
        console.log('  • Part IX: Empirical/Molecular Formulas (Problems 27-30)');
        console.log('\n📄 EXPECTED PAGES: 120+ pages');
        console.log('\n✨ Each problem includes:');
        console.log('  • Problem statement with difficulty level');
        console.log('  • Helper tips for quick guidance');
        console.log('  • Real-world context and applications');
        console.log('  • Complete step-by-step solution');
        console.log('  • Enhanced explanations and verification');
        console.log('  • Key concepts and pedagogical notes');
        console.log('  • Alternative solution methods');
        console.log('  • Common mistakes and error prevention');
        console.log('  • Conceptual connections between steps');
        console.log('  • Diagram representations where applicable');
        console.log('='.repeat(80) + '\n');
    } catch (error) {
        console.error(`\n❌ Error saving document: ${error.message}`);
        console.error(error.stack);
    }
}

// ============== RUN THE COMPREHENSIVE STOICHIOMETRY DOCUMENT GENERATION ==============

generateComprehensiveStoichiometryDocument().catch(error => {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
});
