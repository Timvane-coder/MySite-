import { EnhancedRedoxChemistryWorkbook } from './reduction.js';
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
                        // Multi-column row (like verification tables)
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

// ============== GALVANIC CELLS - RELATED PROBLEMS GENERATOR ==============

function generateRelatedGalvanicCells() {
    const relatedProblems = [];

    // Problem 1: Simple Cell EMF Calculation
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Basic Cell EMF',
        problem: 'Calculate the standard cell EMF for a cell with Zn|Zn²⁺ and Cu²⁺|Cu electrodes. E°(Zn²⁺/Zn) = -0.76V, E°(Cu²⁺/Cu) = +0.34V.',
        parameters: {
            cathodeHalf: 'Cu²⁺ + 2e⁻ → Cu',
            anodeHalf: 'Zn → Zn²⁺ + 2e⁻',
            cathodePotential: 0.34,
            anodePotential: -0.76
        },
        type: 'cell_emf',
        context: { difficulty: 'beginner', topic: 'Standard Cell Potential' },
        subparts: [
            'Given: E°(Cu²⁺/Cu) = +0.34V, E°(Zn²⁺/Zn) = -0.76V',
            'More positive electrode is cathode (Cu)',
            'Less positive electrode is anode (Zn)',
            'E°(cell) = E°(cathode) - E°(anode)',
            'E°(cell) = 0.34 - (-0.76)',
            'E°(cell) = 0.34 + 0.76 = +1.10V',
            'Positive E° means spontaneous reaction'
        ],
        helper: 'E°(cell) = E°(cathode) - E°(anode); more positive = cathode',
        solution: 'E°(cell) = +1.10V (spontaneous)',
        realWorldContext: 'Daniell cell - one of the first practical batteries'
    });

    // Problem 2: Determining Spontaneity
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Reaction Spontaneity',
        problem: 'Will silver ions oxidize copper metal? E°(Ag⁺/Ag) = +0.80V, E°(Cu²⁺/Cu) = +0.34V.',
        parameters: {
            cathodeHalf: 'Ag⁺ + e⁻ → Ag',
            anodeHalf: 'Cu → Cu²⁺ + 2e⁻',
            cathodePotential: 0.80,
            anodePotential: 0.34
        },
        type: 'cell_emf',
        context: { difficulty: 'intermediate', topic: 'Predicting Redox Reactions' },
        subparts: [
            'Proposed: 2Ag⁺ + Cu → 2Ag + Cu²⁺',
            'Cathode (reduction): Ag⁺ + e⁻ → Ag, E° = +0.80V',
            'Anode (oxidation): Cu → Cu²⁺ + 2e⁻, E° = +0.34V',
            'E°(cell) = 0.80 - 0.34 = +0.46V',
            'Positive E° → reaction is spontaneous',
            'Yes, Ag⁺ will oxidize Cu'
        ],
        helper: 'Positive E°(cell) means spontaneous; negative means non-spontaneous',
        solution: 'Yes, E°(cell) = +0.46V (spontaneous)',
        realWorldContext: 'Silver plating on copper surfaces'
    });

    // Problem 3: Three-Electrode Comparison
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Comparing Multiple Cells',
        problem: 'Which combination gives the highest cell voltage: Zn-Cu, Zn-Ag, or Cu-Ag? E°: Zn²⁺/Zn = -0.76V, Cu²⁺/Cu = +0.34V, Ag⁺/Ag = +0.80V.',
        parameters: {
            species: ['Zn²⁺/Zn', 'Cu²⁺/Cu', 'Ag⁺/Ag'],
            potentials: [-0.76, 0.34, 0.80],
            compare: 'cells'
        },
        type: 'redox_strength',
        context: { difficulty: 'intermediate', topic: 'Cell Voltage Comparison' },
        subparts: [
            'Zn-Cu cell: E°(cell) = 0.34 - (-0.76) = 1.10V',
            'Zn-Ag cell: E°(cell) = 0.80 - (-0.76) = 1.56V',
            'Cu-Ag cell: E°(cell) = 0.80 - 0.34 = 0.46V',
            'Highest voltage: Zn-Ag = 1.56V',
            'Largest potential difference gives highest EMF'
        ],
        helper: 'Larger difference in E° values gives higher cell voltage',
        solution: 'Zn-Ag cell gives highest voltage (1.56V)',
        realWorldContext: 'Battery design - maximizing voltage output'
    });

    // Problem 4: Cell with Negative EMF
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Non-spontaneous Reaction',
        problem: 'Calculate E°(cell) for Ni|Ni²⁺||Cu²⁺|Cu. Will this reaction occur spontaneously? E°(Ni²⁺/Ni) = -0.25V, E°(Cu²⁺/Cu) = +0.34V.',
        parameters: {
            cathodeHalf: 'Cu²⁺ + 2e⁻ → Cu',
            anodeHalf: 'Ni → Ni²⁺ + 2e⁻',
            cathodePotential: 0.34,
            anodePotential: -0.25
        },
        type: 'cell_emf',
        context: { difficulty: 'intermediate', topic: 'Cell Spontaneity Analysis' },
        subparts: [
            'Cathode (more positive): Cu²⁺/Cu at +0.34V',
            'Anode: Ni²⁺/Ni at -0.25V',
            'E°(cell) = 0.34 - (-0.25) = +0.59V',
            'Positive E° means spontaneous',
            'Reaction will occur spontaneously'
        ],
        helper: 'Always identify more positive electrode as cathode',
        solution: 'E°(cell) = +0.59V (spontaneous)',
        realWorldContext: 'Nickel-copper batteries in electronics'
    });

    // Problem 5: Calculating ΔG from EMF
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'EMF to Free Energy',
        problem: 'Calculate ΔG° for the Zn-Cu cell. E°(cell) = 1.10V, n = 2 electrons. (F = 96,485 C/mol)',
        parameters: {
            cathodeHalf: 'Cu²⁺ + 2e⁻ → Cu',
            anodeHalf: 'Zn → Zn²⁺ + 2e⁻',
            cathodePotential: 0.34,
            anodePotential: -0.76
        },
        type: 'cell_emf',
        context: { difficulty: 'advanced', topic: 'Thermodynamics of Cells' },
        subparts: [
            'Given: E°(cell) = 1.10V, n = 2',
            'Formula: ΔG° = -nFE°',
            'ΔG° = -2 × 96,485 × 1.10',
            'ΔG° = -212,267 J/mol',
            'ΔG° = -212.3 kJ/mol',
            'Negative ΔG° confirms spontaneous reaction'
        ],
        helper: 'ΔG° = -nFE°; negative ΔG° means spontaneous',
        solution: 'ΔG° = -212.3 kJ/mol',
        realWorldContext: 'Energy available from battery reactions'
    });

    // Problem 6: Identifying Strongest Oxidizing Agent
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Oxidizing Agent Strength',
        problem: 'Which is the strongest oxidizing agent: Fe³⁺, Cu²⁺, or Ag⁺? E°: Fe³⁺/Fe²⁺ = +0.77V, Cu²⁺/Cu = +0.34V, Ag⁺/Ag = +0.80V.',
        parameters: {
            species: ['Fe³⁺', 'Cu²⁺', 'Ag⁺'],
            potentials: [0.77, 0.34, 0.80],
            compare: 'oxidizing'
        },
        type: 'redox_strength',
        context: { difficulty: 'intermediate', topic: 'Oxidizing Agent Comparison' },
        subparts: [
            'Given electrode potentials:',
            'Ag⁺/Ag: +0.80V (most positive)',
            'Fe³⁺/Fe²⁺: +0.77V',
            'Cu²⁺/Cu: +0.34V (least positive)',
            'Higher E° = stronger oxidizing agent',
            'Strongest oxidizing agent: Ag⁺'
        ],
        helper: 'Most positive E° = strongest oxidizing agent',
        solution: 'Ag⁺ is strongest oxidizing agent (E° = +0.80V)',
        realWorldContext: 'Selecting oxidants for chemical synthesis'
    });

    // Problem 7: Complex Cell with Ion Concentrations
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Cell with Concentration Effects',
        problem: 'A Zn-Cu cell has E°(cell) = 1.10V. Qualitatively, what happens to E(cell) if [Zn²⁺] increases? (Consider Le Chatelier)',
        parameters: {
            cathodeHalf: 'Cu²⁺ + 2e⁻ → Cu',
            anodeHalf: 'Zn → Zn²⁺ + 2e⁻',
            cathodePotential: 0.34,
            anodePotential: -0.76
        },
        type: 'cell_emf',
        context: { difficulty: 'advanced', topic: 'Nernst Equation Concepts' },
        subparts: [
            'Overall reaction: Zn + Cu²⁺ → Zn²⁺ + Cu',
            'Increasing [Zn²⁺] favors reverse reaction',
            'By Le Chatelier: shifts equilibrium left',
            'This opposes forward reaction',
            'Result: E(cell) decreases',
            'Nernst equation: E = E° - (RT/nF)ln([Zn²⁺]/[Cu²⁺])'
        ],
        helper: 'Increasing product concentration decreases cell potential',
        solution: 'E(cell) decreases (product concentration increases)',
        realWorldContext: 'Battery voltage drops as it discharges'
    });

    return relatedProblems;
}

// ============== ELECTROLYSIS - RELATED PROBLEMS GENERATOR ==============

function generateRelatedElectrolysis() {
    const relatedProblems = [];

    // Problem 1: Simple Electrolysis Mass Calculation
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Copper Electroplating',
        problem: 'Calculate the mass of copper deposited when 0.100 mol of electrons pass through a Cu²⁺ solution.',
        parameters: {
            equation: 'Cu²⁺ + 2e⁻ → Cu',
            givenSpecies: 'e⁻',
            givenAmount: 0.100,
            givenUnit: 'mol',
            findSpecies: 'Cu'
        },
        type: 'electron_transfer_stoich',
        context: { difficulty: 'beginner', topic: 'Electrolysis Stoichiometry' },
        subparts: [
            'Given: 0.100 mol e⁻',
            'Equation: Cu²⁺ + 2e⁻ → Cu',
            'Electron ratio: 2e⁻ : 1Cu',
            'Moles Cu = 0.100 / 2 = 0.0500 mol',
            'Ar(Cu) = 63.5',
            'Mass Cu = 0.0500 × 63.5 = 3.18g'
        ],
        helper: 'Use electron stoichiometry: moles = electrons ÷ n-factor',
        solution: '3.18g Cu deposited',
        realWorldContext: 'Copper electroplating in electronics manufacturing'
    });

    // Problem 2: Faraday's Law Calculation
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Silver Electroplating',
        problem: 'What mass of silver is deposited when 0.500 mol of electrons pass through AgNO₃ solution?',
        parameters: {
            equation: 'Ag⁺ + e⁻ → Ag',
            givenSpecies: 'e⁻',
            givenAmount: 0.500,
            givenUnit: 'mol',
            findSpecies: 'Ag'
        },
        type: 'electron_transfer_stoich',
        context: { difficulty: 'intermediate', topic: 'Faraday\'s Laws' },
        subparts: [
            'Given: 0.500 mol e⁻',
            'Equation: Ag⁺ + e⁻ → Ag',
            'Ratio: 1e⁻ : 1Ag',
            'Moles Ag = 0.500 mol',
            'Ar(Ag) = 108',
            'Mass Ag = 0.500 × 108 = 54.0g'
        ],
        helper: 'Silver requires only 1 electron per atom',
        solution: '54.0g Ag deposited',
        realWorldContext: 'Silver plating for jewelry and electrical contacts'
    });

    // Problem 3: Aluminum Extraction
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Aluminum Production',
        problem: 'Calculate the mass of aluminum produced when 0.300 mol of electrons are used in the electrolysis of Al₂O₃.',
        parameters: {
            equation: 'Al³⁺ + 3e⁻ → Al',
            givenSpecies: 'e⁻',
            givenAmount: 0.300,
            givenUnit: 'mol',
            findSpecies: 'Al'
        },
        type: 'electron_transfer_stoich',
        context: { difficulty: 'intermediate', topic: 'Industrial Electrolysis' },
        subparts: [
            'Given: 0.300 mol e⁻',
            'Equation: Al³⁺ + 3e⁻ → Al',
            'Ratio: 3e⁻ : 1Al',
            'Moles Al = 0.300 / 3 = 0.100 mol',
            'Ar(Al) = 27',
            'Mass Al = 0.100 × 27 = 2.70g'
        ],
        helper: 'Al³⁺ requires 3 electrons - check the n-factor',
        solution: '2.70g Al produced',
        realWorldContext: 'Industrial aluminum production from bauxite'
    });

    // Problem 4: Chlorine Gas Production
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Chlorine Electrolysis',
        problem: 'What volume of Cl₂ gas (at r.t.p.) is produced when 0.200 mol of electrons pass through molten NaCl?',
        parameters: {
            equation: '2Cl⁻ → Cl₂ + 2e⁻',
            givenSpecies: 'e⁻',
            givenAmount: 0.200,
            givenUnit: 'mol',
            findSpecies: 'Cl₂',
            includeGasVolume: true
        },
        type: 'electron_transfer_stoich',
        context: { difficulty: 'advanced', topic: 'Gas Production in Electrolysis' },
        subparts: [
            'Given: 0.200 mol e⁻',
            'Equation: 2Cl⁻ → Cl₂ + 2e⁻',
            'Ratio: 2e⁻ : 1Cl₂',
            'Moles Cl₂ = 0.200 / 2 = 0.100 mol',
            'At r.t.p.: 1 mol = 24 dm³',
            'Volume = 0.100 × 24 = 2.40 dm³'
        ],
        helper: 'Convert moles of gas to volume at r.t.p. (24 dm³/mol)',
        solution: '2.40 dm³ Cl₂ at r.t.p.',
        realWorldContext: 'Chlor-alkali industry producing chlorine gas'
    });

    // Problem 5: Competing Electrode Reactions
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Product Prediction',
        problem: 'In aqueous CuSO₄ electrolysis with inert electrodes, what forms at cathode and anode? E°(Cu²⁺/Cu) = +0.34V, E°(O₂/H₂O) = +1.23V, E°(H⁺/H₂) = 0.00V.',
        parameters: {
            species: ['Cu²⁺/Cu', 'H⁺/H₂', 'O₂/H₂O'],
            potentials: [0.34, 0.00, 1.23],
            solution: 'aqueous',
            type: 'predict_products'
        },
        type: 'redox_strength',
        context: { difficulty: 'advanced', topic: 'Electrolysis Product Prediction' },
        subparts: [
            'Cathode (reduction - less positive wins):',
            'Cu²⁺ + 2e⁻ → Cu (E° = +0.34V)',
            'vs 2H⁺ + 2e⁻ → H₂ (E° = 0.00V)',
            'More positive E° preferred: Cu deposits',
            '',
            'Anode (oxidation - less positive wins):',
            '2H₂O → O₂ + 4H⁺ + 4e⁻ (easier)',
            'vs 2SO₄²⁻ → S₂O₈²⁻ + 2e⁻ (harder)',
            'O₂ gas produced at anode'
        ],
        helper: 'At cathode: more positive E° wins; at anode: easier oxidation wins',
        solution: 'Cathode: Cu deposited; Anode: O₂ produced',
        realWorldContext: 'Copper purification and refining'
    });

    // Problem 6: Charge and Time Calculation
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Time for Electrolysis',
        problem: 'How many moles of electrons are needed to deposit 6.35g of copper from Cu²⁺ solution?',
        parameters: {
            equation: 'Cu²⁺ + 2e⁻ → Cu',
            givenSpecies: 'Cu',
            givenAmount: 6.35,
            givenUnit: 'g',
            findSpecies: 'e⁻'
        },
        type: 'electron_transfer_stoich',
        context: { difficulty: 'intermediate', topic: 'Reverse Stoichiometry' },
        subparts: [
            'Given: 6.35g Cu',
            'Ar(Cu) = 63.5',
            'Moles Cu = 6.35 / 63.5 = 0.100 mol',
            'Equation: Cu²⁺ + 2e⁻ → Cu',
            'Ratio: 1Cu : 2e⁻',
            'Moles e⁻ = 0.100 × 2 = 0.200 mol',
            'Charge = 0.200 × 96,485 = 19,297 C'
        ],
        helper: 'Work backwards: mass → moles → electrons needed',
        solution: '0.200 mol electrons (19,297 C)',
        realWorldContext: 'Calculating electrical requirements for plating'
    });

    // Problem 7: Multiple Ion Electrolysis
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Mixed Ion Solution',
        problem: 'A solution contains Cu²⁺ and Ag⁺. Which deposits first during electrolysis? E°(Cu²⁺/Cu) = +0.34V, E°(Ag⁺/Ag) = +0.80V.',
        parameters: {
            species: ['Cu²⁺', 'Ag⁺'],
            potentials: [0.34, 0.80],
            compare: 'reduction'
        },
        type: 'redox_strength',
        context: { difficulty: 'advanced', topic: 'Selective Electrolysis' },
        subparts: [
            'At cathode, reduction occurs',
            'More positive E° reduced first',
            'E°(Ag⁺/Ag) = +0.80V (more positive)',
            'E°(Cu²⁺/Cu) = +0.34V',
            'Silver deposits first',
            'After Ag⁺ depleted, Cu begins depositing',
            'This allows separation of metals'
        ],
        helper: 'More positive E° means easier reduction (deposits first)',
        solution: 'Ag deposits first (E° = +0.80V)',
        realWorldContext: 'Electrorefining and metal purification'
    });

    return relatedProblems;
}

// ============== ELECTROCHEMISTRY (GENERAL) - RELATED PROBLEMS GENERATOR ==============

function generateRelatedElectrochemistry() {
    const relatedProblems = [];

    // Problem 1: Oxidation State in Electrochemistry
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Oxidation State in Electrode',
        problem: 'Determine the oxidation state of manganese in MnO₄⁻ ion.',
        parameters: {
            compound: 'MnO4^-',
            element: 'Mn',
            charge: -1,
            knownStates: { 'O': -2 }
        },
        type: 'oxidation_state',
        context: { difficulty: 'beginner', topic: 'Oxidation States' },
        subparts: [
            'Given: MnO₄⁻ (overall charge = -1)',
            'Let Mn oxidation state = x',
            'O oxidation state = -2',
            'Equation: x + 4(-2) = -1',
            'x - 8 = -1',
            'x = +7',
            'Mn oxidation state = +7'
        ],
        helper: 'Sum of oxidation states = overall charge',
        solution: 'Mn oxidation state = +7',
        realWorldContext: 'Permanganate ion in redox titrations'
    });

    // Problem 2: Balancing Redox in Acid
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Half-Equation Balancing',
        problem: 'Balance the half-equation for permanganate reduction in acidic solution: MnO₄⁻ → Mn²⁺',
        parameters: {
            species: 'MnO4^-',
            product: 'Mn^2+',
            medium: 'acidic',
            type: 'reduction'
        },
        type: 'half_equation',
        context: { difficulty: 'intermediate', topic: 'Half-Equation Balancing' },
        subparts: [
            'Step 1: MnO₄⁻ → Mn²⁺',
            'Step 2: Mn already balanced',
            'Step 3: Balance O with H₂O',
            'MnO₄⁻ → Mn²⁺ + 4H₂O',
            'Step 4: Balance H with H⁺ (acidic)',
            'MnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O',
            'Step 5: Balance charge with e⁻',
            'Left: -1 + 8 = +7; Right: +2',
            'Add 5e⁻ to left',
            'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O'
        ],
        helper: 'Systematic: atoms → O (H₂O) → H (H⁺) → charge (e⁻)',
        solution: 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O',
        realWorldContext: 'Permanganate titrations in analytical chemistry'
    });

    // Problem 3: Identifying Redox Agents
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Oxidizing and Reducing Agents',
        problem: 'In the reaction: Zn + Cu²⁺ → Zn²⁺ + Cu, identify the oxidizing and reducing agents.',
        parameters: {
            equation: 'Zn + Cu²⁺ → Zn²⁺ + Cu'
        },
        type: 'identify_agents',
        context: { difficulty: 'intermediate', topic: 'Agent Identification' },
        subparts: [
            'Oxidation states:',
            'Zn: 0 → +2 (increases, oxidation)',
            'Cu²⁺: +2 → 0 (decreases, reduction)',
            '',
            'Reducing agent: gets oxidized',
            'Zn is reducing agent (it loses electrons)',
            '',
            'Oxidizing agent: gets reduced',
            'Cu²⁺ is oxidizing agent (it gains electrons)'
        ],
        helper: 'Oxidizing agent gets reduced; reducing agent gets oxidized',
        solution: 'Oxidizing agent: Cu²⁺; Reducing agent: Zn',
        realWorldContext: 'Understanding battery chemistry'
    });

    // Problem 4: Complete Redox Equation Balancing
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Full Redox Balancing',
        problem: 'Balance: Fe²⁺ + MnO₄⁻ → Fe³⁺ + Mn²⁺ (in acidic solution)',
        parameters: {
            oxidationHalf: 'Fe²⁺ → Fe³⁺ + e⁻',
            reductionHalf: 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O',
            medium: 'acidic'
        },
        type: 'balance_redox_ionic',
        context: { difficulty: 'advanced', topic: 'Complete Redox Balancing' },
        subparts: [
            'Oxidation: Fe²⁺ → Fe³⁺ + e⁻',
            'Reduction: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O',
            '',
            'Equalize electrons: LCM(1,5) = 5',
            'Multiply oxidation by 5:',
            '5Fe²⁺ → 5Fe³⁺ + 5e⁻',
            '',
            'Add equations:',
            '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O'
        ],
        helper: 'Balance half-equations, equalize electrons, then add',
        solution: '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O',
        realWorldContext: 'Permanganate titration of iron(II) solutions'
    });

    // Problem 5: Redox Titration Calculation
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Permanganate Titration',
        problem: '25.0 cm³ of 0.020 mol/dm³ KMnO₄ reacts with 20.0 cm³ of Fe²⁺ solution. Calculate [Fe²⁺]. (5Fe²⁺ : 1MnO₄⁻)',
        parameters: {
            titrantFormula: 'KMnO4',
            titrantConcentration: 0.020,
            titrantVolume: 25.0,
            analyteFormula: 'Fe^2+',
            analyteVolume: 20.0,
            equation: '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O',
            calculate: 'concentration'
        },
        type: 'redox_titration',
        context: { difficulty: 'intermediate', topic: 'Redox Titrations' },
        subparts: [
            'Given: 25.0 cm³ of 0.020 mol/dm³ KMnO₄',
            'Moles MnO₄⁻ = 0.020 × (25.0/1000)',
            'Moles MnO₄⁻ = 0.000500 mol',
            '',
            'Mole ratio: 5Fe²⁺ : 1MnO₄⁻',
            'Moles Fe²⁺ = 0.000500 × 5 = 0.00250 mol',
            '',
            'Volume Fe²⁺ = 20.0 cm³ = 0.0200 dm³',
            'Concentration = 0.00250 / 0.0200',
            '[Fe²⁺] = 0.125 mol/dm³'
        ],
        helper: 'n = CV, then use mole ratio from equation',
        solution: '[Fe²⁺] = 0.125 mol/dm³',
        realWorldContext: 'Quantitative analysis of iron content in samples'
    });

    // Problem 6: Disproportionation Reaction
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Chlorine Disproportionation',
        problem: 'Show that chlorine undergoes disproportionation in water: Cl₂ + H₂O → HCl + HOCl',
        parameters: {
            species: 'Cl2',
            products: ['Cl^-', 'ClO^-'],
            medium: 'aqueous'
        },
        type: 'disproportionation',
        context: { difficulty: 'advanced', topic: 'Disproportionation' },
        subparts: [
            'Oxidation states:',
            'Cl₂: Cl = 0',
            'HCl: Cl = -1 (reduced)',
            'HOCl: Cl = +1 (oxidized)',
            '',
            'Same element (Cl) goes to:',
            '0 → -1 (reduction, gains 1e⁻)',
            '0 → +1 (oxidation, loses 1e⁻)',
            '',
            'Simultaneous oxidation and reduction',
            'This is disproportionation'
        ],
        helper: 'Same species both oxidized and reduced = disproportionation',
        solution: 'Cl goes from 0 to -1 and +1 (disproportionation)',
        realWorldContext: 'Chlorine chemistry in swimming pools and water treatment'
    });

    // Problem 7: Electrode Potential and Spontaneity
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Predicting Reaction Direction',
        problem: 'Will Fe³⁺ oxidize I⁻ to I₂? E°(Fe³⁺/Fe²⁺) = +0.77V, E°(I₂/I⁻) = +0.54V.',
        parameters: {
            cathodeHalf: 'Fe³⁺ + e⁻ → Fe²⁺',
            anodeHalf: '2I⁻ → I₂ + 2e⁻',
            cathodePotential: 0.77,
            anodePotential: 0.54
        },
        type: 'cell_emf',
        context: { difficulty: 'advanced', topic: 'Reaction Prediction' },
        subparts: [
            'Proposed: 2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂',
            '',
            'Reduction: Fe³⁺ + e⁻ → Fe²⁺ (E° = +0.77V)',
            'Oxidation: 2I⁻ → I₂ + 2e⁻ (E° = +0.54V)',
            '',
            'E°(cell) = E°(cathode) - E°(anode)',
            'E°(cell) = 0.77 - 0.54 = +0.23V',
            '',
            'Positive E° → spontaneous',
            'Yes, Fe³⁺ will oxidize I⁻'
        ],
        helper: 'Calculate E°(cell); positive means spontaneous',
        solution: 'Yes, E°(cell) = +0.23V (spontaneous)',
        realWorldContext: 'Iodometric titrations and redox chemistry'
    });

    return relatedProblems;
}

// ============== REDOX STOICHIOMETRY - RELATED PROBLEMS GENERATOR ==============

function generateRelatedRedoxStoichiometry() {
    const relatedProblems = [];

    // Problem 1: Simple Redox Stoichiometry
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Basic Redox Mass Calculation',
        problem: 'How many grams of iron(II) sulfate react with 50.0 cm³ of 0.100 mol/dm³ acidified potassium permanganate? (5Fe²⁺ : 1MnO₄⁻)',
        parameters: {
            equation: '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O',
            givenSpecies: 'MnO4^-',
            givenAmount: 0.100,
            givenUnit: 'mol/dm3',
            volume: 50.0,
            findSpecies: 'FeSO4',
            calculate: 'mass'
        },
        type: 'redox_titration',
        context: { difficulty: 'beginner', topic: 'Redox Stoichiometry' },
        subparts: [
            'Given: 50.0 cm³ of 0.100 mol/dm³ KMnO₄',
            'Convert volume: 50.0 cm³ = 0.0500 dm³',
            'Moles MnO₄⁻ = 0.100 × 0.0500 = 0.00500 mol',
            'Mole ratio: 5Fe²⁺ : 1MnO₄⁻',
            'Moles Fe²⁺ = 0.00500 × 5 = 0.0250 mol',
            'Mr(FeSO₄) = 56 + 32 + 4(16) = 152',
            'Mass FeSO₄ = 0.0250 × 152 = 3.80g'
        ],
        helper: 'Use mole ratio from balanced equation after finding moles',
        solution: '3.80g FeSO₄',
        realWorldContext: 'Quantitative analysis of iron in water samples'
    });

    // Problem 2: Dichromate Oxidation
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Dichromate-Alcohol Reaction',
        problem: 'Calculate the mass of ethanol (C₂H₅OH) oxidized by 25.0 cm³ of 0.0500 mol/dm³ K₂Cr₂O₇ in acidic solution. (3C₂H₅OH : 2Cr₂O₇²⁻)',
        parameters: {
            equation: '3C₂H₅OH + 2Cr₂O₇²⁻ + 16H⁺ → 3CH₃COOH + 4Cr³⁺ + 11H₂O',
            givenSpecies: 'Cr2O7^2-',
            givenAmount: 0.0500,
            givenUnit: 'mol/dm3',
            volume: 25.0,
            findSpecies: 'C2H5OH',
            calculate: 'mass'
        },
        type: 'redox_titration',
        context: { difficulty: 'intermediate', topic: 'Dichromate Oxidations' },
        subparts: [
            'Given: 25.0 cm³ of 0.0500 mol/dm³ Cr₂O₇²⁻',
            'Moles Cr₂O₇²⁻ = 0.0500 × 0.0250 = 0.00125 mol',
            'Mole ratio: 3C₂H₅OH : 2Cr₂O₇²⁻',
            'Moles C₂H₅OH = 0.00125 × (3/2) = 0.001875 mol',
            'Mr(C₂H₅OH) = 2(12) + 6(1) + 16 = 46',
            'Mass = 0.001875 × 46 = 0.0863g'
        ],
        helper: 'Watch mole ratio carefully: 3:2 not 1:1',
        solution: '0.0863g ethanol',
        realWorldContext: 'Breathalyzer tests for alcohol content'
    });

    // Problem 3: Iodine-Thiosulfate Titration
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Iodometric Titration',
        problem: 'What volume of 0.100 mol/dm³ sodium thiosulfate is needed to react with the iodine produced from 0.00250 mol of iodate? (IO₃⁻ + 5I⁻ + 6H⁺ → 3I₂ + 3H₂O; I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻)',
        parameters: {
            equation: 'I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻',
            givenSpecies: 'IO3^-',
            givenAmount: 0.00250,
            givenUnit: 'mol',
            findSpecies: 'S2O3^2-',
            calculate: 'volume',
            concentration: 0.100
        },
        type: 'redox_titration',
        context: { difficulty: 'intermediate', topic: 'Two-Step Redox Reactions' },
        subparts: [
            'Step 1: IO₃⁻ → I₂',
            'Mole ratio: 1IO₃⁻ : 3I₂',
            'Moles I₂ = 0.00250 × 3 = 0.00750 mol',
            '',
            'Step 2: I₂ + S₂O₃²⁻',
            'Mole ratio: 1I₂ : 2S₂O₃²⁻',
            'Moles S₂O₃²⁻ = 0.00750 × 2 = 0.0150 mol',
            '',
            'Volume = moles / concentration',
            'Volume = 0.0150 / 0.100 = 0.150 dm³ = 150 cm³'
        ],
        helper: 'Two-step calculation: first reaction then second reaction',
        solution: '150 cm³ of 0.100 mol/dm³ Na₂S₂O₃',
        realWorldContext: 'Iodometric determination of oxidizing agents'
    });

    // Problem 4: Hydrogen Peroxide Analysis
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'H₂O₂ Content Determination',
        problem: 'A 10.0 cm³ sample of hydrogen peroxide solution requires 18.5 cm³ of 0.0200 mol/dm³ KMnO₄ for complete oxidation in acid. Calculate the concentration of H₂O₂. (5H₂O₂ : 2MnO₄⁻)',
        parameters: {
            equation: '5H₂O₂ + 2MnO₄⁻ + 6H⁺ → 5O₂ + 2Mn²⁺ + 8H₂O',
            givenSpecies: 'MnO4^-',
            givenAmount: 0.0200,
            givenUnit: 'mol/dm3',
            volume: 18.5,
            analyteVolume: 10.0,
            findSpecies: 'H2O2',
            calculate: 'concentration'
        },
        type: 'redox_titration',
        context: { difficulty: 'advanced', topic: 'Peroxide Analysis' },
        subparts: [
            'Moles MnO₄⁻ = 0.0200 × 0.0185 = 0.000370 mol',
            'Mole ratio: 5H₂O₂ : 2MnO₄⁻',
            'Moles H₂O₂ = 0.000370 × (5/2) = 0.000925 mol',
            'Volume H₂O₂ = 10.0 cm³ = 0.0100 dm³',
            'Concentration = 0.000925 / 0.0100 = 0.0925 mol/dm³'
        ],
        helper: 'Use mole ratio 5:2, not 1:1',
        solution: '[H₂O₂] = 0.0925 mol/dm³',
        realWorldContext: 'Determining H₂O₂ concentration in antiseptics'
    });

    // Problem 5: Multi-Step Stoichiometry
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Complex Redox Stoichiometry',
        problem: 'Copper(II) sulfate reacts with excess KI to produce iodine. The iodine requires 20.0 cm³ of 0.100 mol/dm³ thiosulfate. Calculate the mass of CuSO₄. (2Cu²⁺ + 4I⁻ → 2CuI + I₂; I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻)',
        parameters: {
            equation: 'I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻',
            givenSpecies: 'S2O3^2-',
            givenAmount: 0.100,
            givenUnit: 'mol/dm3',
            volume: 20.0,
            findSpecies: 'CuSO4',
            calculate: 'mass'
        },
        type: 'redox_titration',
        context: { difficulty: 'advanced', topic: 'Multi-Step Analysis' },
        subparts: [
            'Step 1: Find moles S₂O₃²⁻',
            'Moles S₂O₃²⁻ = 0.100 × 0.0200 = 0.00200 mol',
            '',
            'Step 2: S₂O₃²⁻ → I₂',
            'Ratio: 2S₂O₃²⁻ : 1I₂',
            'Moles I₂ = 0.00200 / 2 = 0.00100 mol',
            '',
            'Step 3: I₂ → Cu²⁺',
            'Ratio: 1I₂ : 2Cu²⁺',
            'Moles Cu²⁺ = 0.00100 × 2 = 0.00200 mol',
            '',
            'Mr(CuSO₄) = 64 + 32 + 64 = 160',
            'Mass = 0.00200 × 160 = 0.320g'
        ],
        helper: 'Work backwards through two reactions',
        solution: '0.320g CuSO₄',
        realWorldContext: 'Indirect determination of copper content'
    });

    // Problem 6: Limiting Reagent in Redox
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Limiting Reagent Problem',
        problem: 'If 0.500g of zinc reacts with 50.0 cm³ of 0.200 mol/dm³ Cu²⁺ solution, what mass of copper is deposited? (Zn + Cu²⁺ → Zn²⁺ + Cu)',
        parameters: {
            equation: 'Zn + Cu²⁺ → Zn²⁺ + Cu',
            reactant1: { species: 'Zn', amount: 0.500, unit: 'g' },
            reactant2: { species: 'Cu^2+', amount: 0.200, unit: 'mol/dm3', volume: 50.0 },
            findSpecies: 'Cu',
            calculate: 'limiting_reagent'
        },
        type: 'electron_transfer_stoich',
        context: { difficulty: 'advanced', topic: 'Limiting Reagents' },
        subparts: [
            'Moles Zn = 0.500 / 65 = 0.00769 mol',
            'Moles Cu²⁺ = 0.200 × 0.0500 = 0.0100 mol',
            '',
            'Mole ratio: 1Zn : 1Cu²⁺',
            'Zn available: 0.00769 mol',
            'Cu²⁺ available: 0.0100 mol',
            'Zn is limiting reagent',
            '',
            'Moles Cu formed = 0.00769 mol',
            'Mass Cu = 0.00769 × 64 = 0.492g'
        ],
        helper: 'Identify limiting reagent first by comparing mole ratios',
        solution: '0.492g Cu (Zn is limiting)',
        realWorldContext: 'Displacement reactions and metal recovery'
    });

    // Problem 7: Percentage Purity Calculation
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Purity Determination',
        problem: 'A 1.25g sample of impure iron wire requires 22.5 cm³ of 0.0200 mol/dm³ KMnO₄ for complete oxidation. Calculate the percentage purity of iron. (5Fe²⁺ : 1MnO₄⁻)',
        parameters: {
            equation: '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O',
            givenSpecies: 'MnO4^-',
            givenAmount: 0.0200,
            givenUnit: 'mol/dm3',
            volume: 22.5,
            sampleMass: 1.25,
            findSpecies: 'Fe',
            calculate: 'percentage_purity'
        },
        type: 'redox_titration',
        context: { difficulty: 'advanced', topic: 'Purity Analysis' },
        subparts: [
            'Moles MnO₄⁻ = 0.0200 × 0.0225 = 0.000450 mol',
            'Mole ratio: 5Fe²⁺ : 1MnO₄⁻',
            'Moles Fe²⁺ = 0.000450 × 5 = 0.00225 mol',
            'Mass Fe = 0.00225 × 56 = 0.126g',
            '',
            'Percentage purity = (0.126 / 1.25) × 100',
            'Percentage purity = 10.1%'
        ],
        helper: 'Calculate actual iron mass, then divide by sample mass',
        solution: '10.1% pure',
        realWorldContext: 'Quality control in metal production'
    });

    return relatedProblems;
}

// ============== OXIDATION STATES - RELATED PROBLEMS GENERATOR ==============

function generateRelatedOxidationStates() {
    const relatedProblems = [];

    // Problem 1: Simple Oxidation State
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Basic Oxidation State',
        problem: 'Determine the oxidation state of sulfur in SO₄²⁻.',
        parameters: {
            compound: 'SO4^2-',
            element: 'S',
            charge: -2,
            knownStates: { 'O': -2 }
        },
        type: 'oxidation_state',
        context: { difficulty: 'beginner', topic: 'Simple Oxidation States' },
        subparts: [
            'Given: SO₄²⁻ (charge = -2)',
            'Let S oxidation state = x',
            'O oxidation state = -2',
            'Equation: x + 4(-2) = -2',
            'x - 8 = -2',
            'x = +6',
            'S oxidation state = +6'
        ],
        helper: 'Sum of oxidation states = overall charge',
        solution: 'S = +6',
        realWorldContext: 'Sulfate ion in sulfuric acid and salts'
    });

    // Problem 2: Transition Metal Complex
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Chromium Oxidation State',
        problem: 'Find the oxidation state of chromium in Cr₂O₇²⁻.',
        parameters: {
            compound: 'Cr2O7^2-',
            element: 'Cr',
            charge: -2,
            knownStates: { 'O': -2 }
        },
        type: 'oxidation_state',
        context: { difficulty: 'intermediate', topic: 'Dichromate Ion' },
        subparts: [
            'Given: Cr₂O₇²⁻ (charge = -2)',
            'Let Cr oxidation state = x',
            'O oxidation state = -2',
            'Equation: 2x + 7(-2) = -2',
            '2x - 14 = -2',
            '2x = 12',
            'x = +6',
            'Cr oxidation state = +6'
        ],
        helper: 'Remember to multiply by subscript (2 Cr atoms)',
        solution: 'Cr = +6',
        realWorldContext: 'Dichromate oxidizing agent in organic chemistry'
    });

    // Problem 3: Peroxide Exception
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Peroxide Oxidation State',
        problem: 'Determine the oxidation state of oxygen in H₂O₂.',
        parameters: {
            compound: 'H2O2',
            element: 'O',
            charge: 0,
            knownStates: { 'H': +1 }
        },
        type: 'oxidation_state',
        context: { difficulty: 'intermediate', topic: 'Peroxide Exception' },
        subparts: [
            'Given: H₂O₂ (neutral molecule)',
            'Let O oxidation state = x',
            'H oxidation state = +1',
            'Equation: 2(+1) + 2x = 0',
            '2 + 2x = 0',
            '2x = -2',
            'x = -1',
            'O oxidation state = -1 (peroxide exception)'
        ],
        helper: 'In peroxides, oxygen is -1 (not -2)',
        solution: 'O = -1 (peroxide)',
        realWorldContext: 'Hydrogen peroxide as oxidizing agent'
    });

    // Problem 4: Nitrogen Oxidation States
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Nitrogen in Nitrate',
        problem: 'Calculate the oxidation state of nitrogen in NO₃⁻.',
        parameters: {
            compound: 'NO3^-',
            element: 'N',
            charge: -1,
            knownStates: { 'O': -2 }
        },
        type: 'oxidation_state',
        context: { difficulty: 'intermediate', topic: 'Nitrogen Compounds' },
        subparts: [
            'Given: NO₃⁻ (charge = -1)',
            'Let N oxidation state = x',
            'O oxidation state = -2',
            'Equation: x + 3(-2) = -1',
            'x - 6 = -1',
            'x = +5',
            'N oxidation state = +5'
        ],
        helper: 'Nitrogen has variable oxidation states from -3 to +5',
        solution: 'N = +5',
        realWorldContext: 'Nitrate ion in fertilizers and explosives'
    });

    // Problem 5: Thiosulfate Ion
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Sulfur in Thiosulfate',
        problem: 'Determine the average oxidation state of sulfur in S₂O₃²⁻.',
        parameters: {
            compound: 'S2O3^2-',
            element: 'S',
            charge: -2,
            knownStates: { 'O': -2 }
        },
        type: 'oxidation_state',
        context: { difficulty: 'advanced', topic: 'Average Oxidation States' },
        subparts: [
            'Given: S₂O₃²⁻ (charge = -2)',
            'Let S average oxidation state = x',
            'O oxidation state = -2',
            'Equation: 2x + 3(-2) = -2',
            '2x - 6 = -2',
            '2x = 4',
            'x = +2',
            'Average S oxidation state = +2',
            'Note: Actual states are 0 and +4 (average +2)'
        ],
        helper: 'Calculate average; actual sulfur atoms may differ',
        solution: 'S average = +2',
        realWorldContext: 'Thiosulfate in photography and titrations'
    });

    // Problem 6: Organic Compound
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Carbon in Methanol',
        problem: 'Calculate the oxidation state of carbon in CH₃OH.',
        parameters: {
            compound: 'CH3OH',
            element: 'C',
            charge: 0,
            knownStates: { 'H': +1, 'O': -2 }
        },
        type: 'oxidation_state',
        context: { difficulty: 'advanced', topic: 'Organic Oxidation States' },
        subparts: [
            'Given: CH₃OH (neutral)',
            'Let C oxidation state = x',
            'H = +1, O = -2',
            'Equation: x + 4(+1) + (-2) = 0',
            'x + 4 - 2 = 0',
            'x = -2',
            'C oxidation state = -2'
        ],
        helper: 'Count all H atoms including those in OH group',
        solution: 'C = -2',
        realWorldContext: 'Oxidation states in organic chemistry'
    });

    // Problem 7: Identifying Oxidation State Change
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Oxidation State Change',
        problem: 'In the reaction Zn + Cu²⁺ → Zn²⁺ + Cu, determine the change in oxidation state for each element.',
        parameters: {
            equation: 'Zn + Cu²⁺ → Zn²⁺ + Cu',
            identifyChanges: true
        },
        type: 'identify_agents',
        context: { difficulty: 'intermediate', topic: 'Oxidation State Changes' },
        subparts: [
            'Zn: 0 → +2',
            'Change: +2 (oxidation, loses 2e⁻)',
            '',
            'Cu: +2 → 0',
            'Change: -2 (reduction, gains 2e⁻)',
            '',
            'Zn is oxidized (reducing agent)',
            'Cu²⁺ is reduced (oxidizing agent)'
        ],
        helper: 'Increase in oxidation state = oxidation; decrease = reduction',
        solution: 'Zn: 0→+2 (oxidation); Cu: +2→0 (reduction)',
        realWorldContext: 'Displacement reactions in electrochemistry'
    });

    return relatedProblems;
}

// ============== HALF-REACTIONS - RELATED PROBLEMS GENERATOR ==============

function generateRelatedHalfReactions() {
    const relatedProblems = [];

    // Problem 1: Simple Reduction Half-Equation
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Basic Reduction',
        problem: 'Balance the half-equation: Cu²⁺ → Cu',
        parameters: {
            species: 'Cu^2+',
            product: 'Cu',
            medium: 'acidic',
            type: 'reduction'
        },
        type: 'half_equation',
        context: { difficulty: 'beginner', topic: 'Simple Half-Equations' },
        subparts: [
            'Step 1: Cu²⁺ → Cu',
            'Step 2: Cu already balanced',
            'Step 3: No oxygen to balance',
            'Step 4: No hydrogen to balance',
            'Step 5: Balance charge',
            'Left: +2, Right: 0',
            'Add 2e⁻ to left',
            'Cu²⁺ + 2e⁻ → Cu'
        ],
        helper: 'Simple metal ion reduction - just balance charge',
        solution: 'Cu²⁺ + 2e⁻ → Cu',
        realWorldContext: 'Copper electroplating'
    });

    // Problem 2: Oxidation Half-Equation
    relatedProblems.push({
        difficulty: 'easier',
        scenario: 'Metal Oxidation',
        problem: 'Balance the half-equation: Fe²⁺ → Fe³⁺',
        parameters: {
            species: 'Fe^2+',
            product: 'Fe^3+',
            medium: 'acidic',
            type: 'oxidation'
        },
        type: 'half_equation',
        context: { difficulty: 'beginner', topic: 'Simple Oxidation' },
        subparts: [
            'Step 1: Fe²⁺ → Fe³⁺',
            'Step 2: Fe already balanced',
            'Step 3: No oxygen',
            'Step 4: No hydrogen',
            'Step 5: Balance charge',
            'Left: +2, Right: +3',
            'Add 1e⁻ to right',
            'Fe²⁺ → Fe³⁺ + e⁻'
        ],
        helper: 'Electrons go on product side for oxidation',
        solution: 'Fe²⁺ → Fe³⁺ + e⁻',
        realWorldContext: 'Iron oxidation in redox titrations'
    });

    // Problem 3: Oxygen-Containing Reduction (Acidic)
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Dichromate Reduction',
        problem: 'Balance in acidic solution: Cr₂O₇²⁻ → Cr³⁺',
        parameters: {
            species: 'Cr2O7^2-',
            product: 'Cr^3+',
            medium: 'acidic',
            type: 'reduction'
        },
        type: 'half_equation',
        context: { difficulty: 'intermediate', topic: 'Acidic Half-Equations' },
        subparts: [
            'Step 1: Cr₂O₇²⁻ → Cr³⁺',
            'Step 2: Balance Cr: Cr₂O₇²⁻ → 2Cr³⁺',
            'Step 3: Balance O with H₂O',
            'Cr₂O₇²⁻ → 2Cr³⁺ + 7H₂O',
            'Step 4: Balance H with H⁺',
            'Cr₂O₇²⁻ + 14H⁺ → 2Cr³⁺ + 7H₂O',
            'Step 5: Balance charge',
            'Left: -2 + 14 = +12; Right: +6',
            'Add 6e⁻ to left',
            'Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O'
        ],
        helper: 'Systematic: Cr → O → H → e⁻',
        solution: 'Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O',
        realWorldContext: 'Dichromate as oxidizing agent'
    });

    // Problem 4: Nitrate Reduction
    relatedProblems.push({
        difficulty: 'similar',
        scenario: 'Nitrate to NO',
        problem: 'Balance in acidic solution: NO₃⁻ → NO',
        parameters: {
            species: 'NO3^-',
            product: 'NO',
            medium: 'acidic',
            type: 'reduction'
        },
        type: 'half_equation',
        context: { difficulty: 'intermediate', topic: 'Nitrogen Reduction' },
        subparts: [
            'Step 1: NO₃⁻ → NO',
            'Step 2: N already balanced',
            'Step 3: Balance O with H₂O',
            'NO₃⁻ → NO + 2H₂O',
            'Step 4: Balance H with H⁺',
            'NO₃⁻ + 4H⁺ → NO + 2H₂O',
            'Step 5: Balance charge',
            'Left: -1 + 4 = +3; Right: 0',
            'Add 3e⁻ to left',
            'NO₃⁻ + 4H⁺ + 3e⁻ → NO + 2H₂O'
        ],
        helper: 'Add H₂O to side needing oxygen',
        solution: 'NO₃⁻ + 4H⁺ + 3e⁻ → NO + 2H₂O',
        realWorldContext: 'Nitric acid as oxidizing agent'
    });

    // Problem 5: Sulfite Oxidation
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Sulfite to Sulfate',
        problem: 'Balance in acidic solution: SO₃²⁻ → SO₄²⁻',
        parameters: {
            species: 'SO3^2-',
            product: 'SO4^2-',
            medium: 'acidic',
            type: 'oxidation'
        },
        type: 'half_equation',
        context: { difficulty: 'intermediate', topic: 'Sulfur Oxidation' },
        subparts: [
            'Step 1: SO₃²⁻ → SO₄²⁻',
            'Step 2: S already balanced',
            'Step 3: Balance O with H₂O',
            'SO₃²⁻ + H₂O → SO₄²⁻',
            'Step 4: Balance H with H⁺',
            'SO₃²⁻ + H₂O → SO₄²⁻ + 2H⁺',
            'Step 5: Balance charge',
            'Left: -2; Right: -2 + 2 = 0',
            'Add 2e⁻ to right',
            'SO₃²⁻ + H₂O → SO₄²⁻ + 2H⁺ + 2e⁻'
        ],
        helper: 'Add H₂O to side needing less oxygen',
        solution: 'SO₃²⁻ + H₂O → SO₄²⁻ + 2H⁺ + 2e⁻',
        realWorldContext: 'Sulfite oxidation in environmental chemistry'
    });

    // Problem 6: Basic Solution Half-Equation
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Manganate in Base',
        problem: 'Balance in basic solution: MnO₄⁻ → MnO₂',
        parameters: {
            species: 'MnO4^-',
            product: 'MnO2',
            medium: 'basic',
            type: 'reduction'
        },
        type: 'half_equation',
        context: { difficulty: 'advanced', topic: 'Basic Half-Equations' },
        subparts: [
            'Step 1: MnO₄⁻ → MnO₂',
            'Step 2: Mn already balanced',
            'Step 3: Balance O with H₂O',
            'MnO₄⁻ → MnO₂ + 2H₂O',
            'Step 4: Balance H with H⁺ (temporary)',
            'MnO₄⁻ + 4H⁺ → MnO₂ + 2H₂O',
            'Step 5: Balance charge with e⁻',
            'MnO₄⁻ + 4H⁺ + 3e⁻ → MnO₂ + 2H₂O',
            'Step 6: Convert to basic (add 4OH⁻ both sides)',
            'MnO₄⁻ + 4H⁺ + 4OH⁻ + 3e⁻ → MnO₂ + 2H₂O + 4OH⁻',
            'MnO₄⁻ + 4H₂O + 3e⁻ → MnO₂ + 2H₂O + 4OH⁻',
            'Simplify: MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻'
        ],
        helper: 'Balance in acid first, then convert with OH⁻',
        solution: 'MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻',
        realWorldContext: 'Alkaline batteries chemistry'
    });

    // Problem 7: Hydrogen Peroxide (Dual Character)
    relatedProblems.push({
        difficulty: 'harder',
        scenario: 'Peroxide Oxidation',
        problem: 'Balance the oxidation of H₂O₂ to O₂ in acidic solution.',
        parameters: {
            species: 'H2O2',
            product: 'O2',
            medium: 'acidic',
            type: 'oxidation'
        },
        type: 'half_equation',
        context: { difficulty: 'advanced', topic: 'Peroxide as Reducing Agent' },
        subparts: [
            'Step 1: H₂O₂ → O₂',
            'Step 2: O already balanced',
            'Step 3: No extra O needed',
            'Step 4: Balance H with H⁺',
            'H₂O₂ → O₂ + 2H⁺',
            'Step 5: Balance charge',
            'Left: 0; Right: +2',
            'Add 2e⁻ to right',
            'H₂O₂ → O₂ + 2H⁺ + 2e⁻'
        ],
        helper: 'H₂O₂ can act as both oxidizing and reducing agent',
        solution: 'H₂O₂ → O₂ + 2H⁺ + 2e⁻',
        realWorldContext: 'Peroxide as reducing agent in some reactions'
    });

    return relatedProblems;
}

// ============== SOLVER FUNCTIONS ==============

function solveRedoxStoichiometryProblems() {
    const problems = generateRelatedRedoxStoichiometry();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Redox Stoichiometry Problem ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedRedoxChemistryWorkbook({
            theme: 'chemistry',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveRedoxProblem({
            problemType: problem.type,
            data: problem.parameters,
            scenario: problem.problem,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solveOxidationStatesProblems() {
    const problems = generateRelatedOxidationStates();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Oxidation States Problem ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedRedoxChemistryWorkbook({
            theme: 'chemistry',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveRedoxProblem({
            problemType: problem.type,
            data: problem.parameters,
            scenario: problem.problem,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solveHalfReactionsProblems() {
    const problems = generateRelatedHalfReactions();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Half-Reactions Problem ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedRedoxChemistryWorkbook({
            theme: 'chemistry',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveRedoxProblem({
            problemType: problem.type,
            data: problem.parameters,
            scenario: problem.problem,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}



// ============== SOLVER FUNCTIONS ==============

function solveGalvanicCellProblems() {
    const problems = generateRelatedGalvanicCells();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Galvanic Cell Problem ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedRedoxChemistryWorkbook({
            theme: 'chemistry',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveRedoxProblem({
            problemType: problem.type,
            data: problem.parameters,
            scenario: problem.problem,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solveElectrolysisProblems() {
    const problems = generateRelatedElectrolysis();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Electrolysis Problem ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedRedoxChemistryWorkbook({
            theme: 'chemistry',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveRedoxProblem({
            problemType: problem.type,
            data: problem.parameters,
            scenario: problem.problem,
            context: problem.context
        });

        solvedProblems.push({
            problem: problem,
            workbook: workbook
        });
    });

    return solvedProblems;
}

function solveElectrochemistryProblems() {
    const problems = generateRelatedElectrochemistry();
    const solvedProblems = [];

    problems.forEach((problem, index) => {
        console.log(`  Solving Electrochemistry Problem ${index + 1}: ${problem.scenario}`);

        const workbook = new EnhancedRedoxChemistryWorkbook({
            theme: 'chemistry',
            explanationLevel: 'detailed',
            includeVerificationInSteps: true,
            includeConceptualConnections: true,
            includeAlternativeMethods: true,
            includeErrorPrevention: true,
            includeCommonMistakes: true,
            includePedagogicalNotes: true,
            verificationDetail: 'detailed'
        });

        workbook.solveRedoxProblem({
            problemType: problem.type,
            data: problem.parameters,
            scenario: problem.problem,
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

// ============== UPDATED DOCUMENT GENERATION ==============

async function generateComprehensiveRedoxChemistryDocument() {
    console.log('Generating Comprehensive Redox Chemistry Workbook with Related Problems...');
    console.log('='.repeat(80));

    const documentChildren = [];

    // ============== DOCUMENT HEADER ==============
    documentChildren.push(
        new docx.Paragraph({
            text: 'Comprehensive Redox Chemistry Mathematical Workbook',
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
            text: 'All Topics in Redox Chemistry with Enhanced Explanations',
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

    // Part I: Galvanic Cells
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part I: Galvanic Cells and Electrode Potentials (7 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const galvanicProblems = generateRelatedGalvanicCells();
    galvanicProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 1}. ${problem.scenario}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part II: Electrolysis
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part II: Electrolysis and Faraday\'s Laws (7 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const electrolysisProblems = generateRelatedElectrolysis();
    electrolysisProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 8}. ${problem.scenario}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part III: General Electrochemistry
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part III: General Electrochemistry (7 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const electrochemProblems = generateRelatedElectrochemistry();
    electrochemProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 15}. ${problem.scenario}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part IV: Redox Stoichiometry
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part IV: Redox Stoichiometry (7 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const stoichiometryProblems = generateRelatedRedoxStoichiometry();
    stoichiometryProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 22}. ${problem.scenario}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part V: Oxidation States
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part V: Oxidation States (7 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const oxidationStatesProblems = generateRelatedOxidationStates();
    oxidationStatesProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 29}. ${problem.scenario}`,
                spacing: { after: 100 }
            })
        );
    });

    // Part VI: Half-Reactions
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part VI: Half-Reactions (7 Problems)',
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
        })
    );

    const halfReactionsProblems = generateRelatedHalfReactions();
    halfReactionsProblems.forEach((problem, index) => {
        documentChildren.push(
            new docx.Paragraph({
                text: `${index + 36}. ${problem.scenario}`,
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

    // ============== PART I: GALVANIC CELLS ==============
    console.log('\nProcessing Part I: Galvanic Cells and Electrode Potentials...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part I: Galvanic Cells and Electrode Potentials',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const galvanicSolved = solveGalvanicCellProblems();
    galvanicSolved.forEach((solved, index) => {
        console.log(`  Adding Galvanic Cell Problem ${index + 1} to document...`);

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

    // ============== PART II: ELECTROLYSIS ==============
    console.log('\nProcessing Part II: Electrolysis and Faraday\'s Laws...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part II: Electrolysis and Faraday\'s Laws',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const electrolysisSolved = solveElectrolysisProblems();
    electrolysisSolved.forEach((solved, index) => {
        console.log(`  Adding Electrolysis Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 8}: ${solved.problem.scenario}`,
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

    // ============== PART III: GENERAL ELECTROCHEMISTRY ==============
    console.log('\nProcessing Part III: General Electrochemistry...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part III: General Electrochemistry',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const electrochemSolved = solveElectrochemistryProblems();
    electrochemSolved.forEach((solved, index) => {
        console.log(`  Adding Electrochemistry Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 15}: ${solved.problem.scenario}`,
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

    // ============== PART IV: REDOX STOICHIOMETRY ==============
    console.log('\nProcessing Part IV: Redox Stoichiometry...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part IV: Redox Stoichiometry',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const stoichiometrySolved = solveRedoxStoichiometryProblems();
    stoichiometrySolved.forEach((solved, index) => {
        console.log(`  Adding Redox Stoichiometry Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 22}: ${solved.problem.scenario}`,
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

    // ============== PART V: OXIDATION STATES ==============
    console.log('\nProcessing Part V: Oxidation States...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part V: Oxidation States',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const oxidationStatesSolved = solveOxidationStatesProblems();
    oxidationStatesSolved.forEach((solved, index) => {
        console.log(`  Adding Oxidation States Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 29}: ${solved.problem.scenario}`,
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

    // ============== PART VI: HALF-REACTIONS ==============
    console.log('\nProcessing Part VI: Half-Reactions...');
    documentChildren.push(
        new docx.Paragraph({
            text: 'Part VI: Half-Reactions',
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true
        })
    );

    const halfReactionsSolved = solveHalfReactionsProblems();
    halfReactionsSolved.forEach((solved, index) => {
        console.log(`  Adding Half-Reactions Problem ${index + 1} to document...`);

        documentChildren.push(
            new docx.Paragraph({
                text: `Problem ${index + 36}: ${solved.problem.scenario}`,
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
        const filename = 'comprehensive_redox_chemistry_workbook.docx';
        const outputPath = path.join(process.cwd(), filename);
        fs.writeFileSync(outputPath, buffer);

        console.log('\n' + '='.repeat(80));
        console.log('✓ COMPREHENSIVE REDOX CHEMISTRY DOCUMENT GENERATION COMPLETE');
        console.log('='.repeat(80));
        console.log(`\n✓ Document saved as: ${outputPath}`);
        console.log('\n📊 DOCUMENT STATISTICS:');
        console.log('  • Total Problems: 42');
        console.log('    - Galvanic Cells and Electrode Potentials: 7 problems');
        console.log('    - Electrolysis and Faraday\'s Laws: 7 problems');
        console.log('    - General Electrochemistry: 7 problems');
        console.log('    - Redox Stoichiometry: 7 problems');
        console.log('    - Oxidation States: 7 problems');
        console.log('    - Half-Reactions: 7 problems');
        console.log('\n📖 CONTENT BREAKDOWN:');
        console.log('  • Part I: Galvanic Cells and Electrode Potentials (Problems 1-7)');
        console.log('  • Part II: Electrolysis and Faraday\'s Laws (Problems 8-14)');
        console.log('  • Part III: General Electrochemistry (Problems 15-21)');
        console.log('  • Part IV: Redox Stoichiometry (Problems 22-28)');
        console.log('  • Part V: Oxidation States (Problems 29-35)');
        console.log('  • Part VI: Half-Reactions (Problems 36-42)');
        console.log('\n📄 EXPECTED PAGES: 150+ pages');
        console.log('\n✨ Each problem includes:');
        console.log('  • Problem statement with difficulty level');
        console.log('  • Helper tips for quick guidance');
        console.log('  • Real-world context and applications');
        console.log('  • Complete step-by-step solution');
        console.log('  • Enhanced multi-layer explanations');
        console.log('  • Solution verification with detailed checks');
        console.log('  • Key concepts and theory');
        console.log('  • Pedagogical notes for teaching');
        console.log('  • Alternative solution methods');
        console.log('  • Common mistakes and error prevention');
        console.log('  • Conceptual, procedural, visual, and chemical explanations');
        console.log('\n🔋 COMPREHENSIVE TOPICS COVERED:');
        console.log('  ✓ Standard electrode potentials and cell EMF calculations');
        console.log('  ✓ Spontaneity predictions using Gibbs free energy');
        console.log('  ✓ Oxidizing and reducing agent strength comparisons');
        console.log('  ✓ Electrolysis stoichiometry and Faraday\'s laws');
        console.log('  ✓ Product prediction in electrolytic cells');
        console.log('  ✓ Oxidation state determination in all compounds');
        console.log('  ✓ Half-equation balancing in acidic and basic media');
        console.log('  ✓ Complete redox equation balancing');
        console.log('  ✓ Redox titration calculations and analysis');
        console.log('  ✓ Disproportionation reactions');
        console.log('  ✓ Multi-step redox stoichiometry');
        console.log('  ✓ Limiting reagent problems in redox');
        console.log('  ✓ Percentage purity determinations');
        console.log('  ✓ Iodometric titrations');
        console.log('  ✓ Dichromate and permanganate oxidations');
        console.log('='.repeat(80) + '\n');
    } catch (error) {
        console.error(`\n❌ Error saving document: ${error.message}`);
        console.error(error.stack);
    }
}

// ============== RUN THE COMPREHENSIVE REDOX CHEMISTRY DOCUMENT GENERATION ==============

generateComprehensiveRedoxChemistryDocument().catch(error => {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
});
