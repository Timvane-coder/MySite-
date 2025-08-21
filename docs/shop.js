import { createCanvas } from '@napi-rs/canvas';
import * as math from 'mathjs';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

// ./src/SpreadsheetCalculator.js (updated with shopping template)

export class SpreadsheetCalculator {
    constructor() {
        // Default settings
        this.width = 800;
        this.height = 600;
        this.rowLabelWidth = 50;
        this.headerHeight = 40;
        this.cellWidth = 120;
        this.cellHeight = 30;
        this.fontSize = 14;
        this.cellPadding = 5;
        this.theme = 'light'; // Default theme
        this.colors = this.setThemeColors(this.theme);
        this.currentSheet = null;
        this.calculationHistory = [];
        this.formulaDatabase = this.initializeFormulaDatabase();
        this.padding = 10;
        this.formulaBarHeight = 25;
        this.statsPanelHeight = 80;
    }

    // Set theme colors based on theme name
    setThemeColors(theme) {
        const themes = {
            light: {
                background: '#ffffff',
                headerBg: '#e0e0e0',
                headerText: '#000000',
                cellBg: '#f9f9f9',
                cellText: '#333333',
                borderColor: '#cccccc',
                gridColor: '#e0e0e0',
                formulaBar: '#f0f0f0',
            },
            excel: {
                background: '#ffffff',
                headerBg: '#4472c4', // Blue-gray header like Excel
                headerText: '#ffffff',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#e0e0e0',
                gridColor: '#e0e0e0',
                formulaBar: '#f0f0f0',
            },
            dark: {
                background: '#1a1a1a',
                headerBg: '#2d2d2d',
                headerText: '#ffffff',
                cellBg: '#2a2a2a',
                cellText: '#cccccc',
                borderColor: '#404040',
                gridColor: '#333333',
                formulaBar: '#252525',
            },
            scientific: {
                background: '#ffffff',
                headerBg: '#d3d3d3', // Light gray for a clean look
                headerText: '#000000',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#d3d3d3',
                gridColor: '#e0e0e0',
                formulaBar: '#f0f0f0',
            },
            googlesheets: {
                background: '#ffffff',
                headerBg: '#34a853', // Green header like Google Sheets
                headerText: '#ffffff',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#e0e0e0',
                gridColor: '#e0e0e0',
                formulaBar: '#f0f0f0',
            },
            classic: {
                background: '#f5f5dc', // Beige background for retro feel
                headerBg: '#d2b48c', // Tan header
                headerText: '#000000',
                cellBg: '#f5f5dc',
                cellText: '#000000',
                borderColor: '#8b4513', // Brown border
                gridColor: '#d2b48c',
                formulaBar: '#f0e68c', // Light yellow
            }
        };
        return themes[theme] || themes['light']; // Default to light if theme is invalid
    }

    // Method to set or change the theme
    setTheme(theme) {
        this.theme = theme;
        this.colors = this.setThemeColors(theme);
    }

    initializeFormulaDatabase() {
        return {
            // Default shopping list template
            'shopping_list': {
                type: 'shopping',
                description: 'Comprehensive shopping list with automatic calculations',
                params: ['items', 'currency', 'taxRate', 'discountRate'],
                template: this.createShoppingTemplate.bind(this)
            },

            // Custom shopping analysis
            'custom_shopping': {
                type: 'shopping',
                description: 'Custom shopping list with your items',
                params: ['itemsData'],
                template: this.createShoppingTemplate.bind(this)
            }
        };
    }

    // Parse shopping equation from user input
    parseShoppingEquation(equation) {
        const defaultParams = {
            items: [
                { name: 'Rice', quantity: 2, unitPrice: 12.00, category: 'Grains' },
                { name: 'Oil', quantity: 3, unitPrice: 5.00, category: 'Cooking' },
                { name: 'Bread', quantity: 4, unitPrice: 2.50, category: 'Bakery' },
                { name: 'Milk', quantity: 2, unitPrice: 3.00, category: 'Dairy' },
                { name: 'Sugar', quantity: 1, unitPrice: 4.50, category: 'Baking' },
                { name: 'Apples', quantity: 3, unitPrice: 3.20, category: 'Fruits' },
                { name: 'Chicken', quantity: 2, unitPrice: 8.75, category: 'Meat' },
                { name: 'Eggs', quantity: 1, unitPrice: 6.00, category: 'Dairy' }
            ],
            currency: 'USD',
            taxRate: 0.08, // 8% tax
            discountRate: 0.00 // No discount by default
        };

        try {
            // Remove spaces and normalize the equation
            const cleanEquation = equation.replace(/^\s+|\s+$/g, '');

            // Check if it's just the template name
            if (cleanEquation.toLowerCase() === 'shopping_list' || cleanEquation.toLowerCase() === 'custom_shopping') {
                return defaultParams;
            }

            // Try to parse structured shopping data
            let parsedParams = { ...defaultParams };

            // Method 1: Parse from structured text format
            if (cleanEquation.includes('Item') || cleanEquation.includes('Qty') || cleanEquation.includes('Price')) {
                parsedParams.items = this.parseShoppingListFromText(cleanEquation);
            }

            // Method 2: Try to parse as JSON-like object
            else if (cleanEquation.includes('{') && cleanEquation.includes('}')) {
                try {
                    const objectMatch = cleanEquation.match(/\{[\s\S]*\}/);
                    if (objectMatch) {
                        let objectStr = objectMatch[0];
                        // Convert to valid JSON
                        objectStr = objectStr.replace(/(\w+):/g, '"$1":');
                        objectStr = objectStr.replace(/'/g, '"');
                        const parsed = JSON.parse(objectStr);
                        parsedParams = { ...defaultParams, ...parsed };
                    }
                } catch (e) {
                    console.warn('Failed to parse as JSON object, using text parsing');
                }
            }

            // Method 3: Parse simple item list format
            else {
                parsedParams.items = this.parseSimpleItemList(cleanEquation);
            }

            // Validate and clean the items
            parsedParams.items = this.validateShoppingItems(parsedParams.items);

            return parsedParams;

        } catch (error) {
            console.warn('Failed to parse shopping equation, using defaults:', error.message);
            return defaultParams;
        }
    }

    // Parse shopping list from structured text
    parseShoppingListFromText(text) {
        const items = [];
        const lines = text.split('\n').filter(line => line.trim());

        let headerFound = false;
        for (const line of lines) {
            // Skip header lines
            if (line.toLowerCase().includes('item') && line.toLowerCase().includes('qty')) {
                headerFound = true;
                continue;
            }
            if (line.includes('----') || line.includes('===')) {
                continue;
            }

            // Parse item lines
            const parts = line.split(/\s+|\|/).filter(part => part.trim());
            if (parts.length >= 3) {
                const name = parts[0].trim() || `Item ${items.length + 1}`;
                const quantity = parseFloat(parts[1]) || 1;
                const unitPrice = parseFloat(parts[2]) || 0;
                const category = parts[3] ? parts[3].trim() : 'General';

                items.push({ name, quantity, unitPrice, category });
            }
        }

        return items.length > 0 ? items : this.getDefaultItems();
    }

    // Parse simple comma-separated item list
    parseSimpleItemList(text) {
        const items = [];
        const lines = text.split(/[,;\n]/).filter(line => line.trim());

        for (const line of lines) {
            const parts = line.split(/[:=]/).map(p => p.trim());
            if (parts.length >= 2) {
                const name = parts[0];
                const details = parts[1].split(/\s+/);
                const quantity = parseFloat(details[0]) || 1;
                const unitPrice = parseFloat(details[1]) || 0;

                items.push({
                    name,
                    quantity,
                    unitPrice,
                    category: 'General'
                });
            }
        }

        return items.length > 0 ? items : this.getDefaultItems();
    }

    // Get default shopping items
    getDefaultItems() {
        return [
            { name: 'Rice', quantity: 2, unitPrice: 12.00, category: 'Grains' },
            { name: 'Oil', quantity: 3, unitPrice: 5.00, category: 'Cooking' },
            { name: 'Bread', quantity: 4, unitPrice: 2.50, category: 'Bakery' },
            { name: 'Milk', quantity: 2, unitPrice: 3.00, category: 'Dairy' },
            { name: 'Sugar', quantity: 1, unitPrice: 4.50, category: 'Baking' }
        ];
    }

    // Validate shopping items
    validateShoppingItems(items) {
        return items.map((item, index) => ({
            name: item.name || `Item ${index + 1}`,
            quantity: Math.max(0, parseFloat(item.quantity) || 1),
            unitPrice: Math.max(0, parseFloat(item.unitPrice) || 0),
            category: item.category || 'General'
        }));
    }

    createShoppingTemplate(equation, params) {
        const { items, currency, taxRate, discountRate } = params;
        const data = [];
        const currencySymbol = this.getCurrencySymbol(currency);

        // Calculate totals
        let subtotal = 0;
        const itemTotals = [];
        const categoryTotals = {};

        // Calculate item totals and category totals
        items.forEach(item => {
            const total = item.quantity * item.unitPrice;
            itemTotals.push(total);
            subtotal += total;

            if (!categoryTotals[item.category]) {
                categoryTotals[item.category] = 0;
            }
            categoryTotals[item.category] += total;
        });

        const discountAmount = subtotal * discountRate;
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = afterDiscount * taxRate;
        const finalTotal = afterDiscount + taxAmount;

        // Header
        data.push([
            { value: 'Shopping List Analysis', type: 'header', span: 6, style: 'title' },
            '', '', '', '', ''
        ]);
        data.push([
            { value: `Generated: ${new Date().toLocaleString()}`, type: 'data', span: 6 },
            '', '', '', '', ''
        ]);
        data.push(['', '', '', '', '', '']); // Empty row

        // Shopping Items Table
        data.push([
            { value: 'Shopping Items', type: 'header', span: 6 },
            '', '', '', '', ''
        ]);

        data.push([
            { value: 'Item Name', type: 'header' },
            { value: 'Category', type: 'header' },
            { value: 'Quantity', type: 'header' },
            { value: 'Unit Price', type: 'header' },
            { value: 'Total', type: 'header' },
            { value: 'Notes', type: 'header' }
        ]);

        // Add each item
        items.forEach((item, index) => {
            const total = itemTotals[index];
            data.push([
                { value: item.name, type: 'label' },
                { value: item.category, type: 'data' },
                { value: item.quantity.toString(), type: 'result' },
                { value: `${currencySymbol}${item.unitPrice.toFixed(2)}`, type: 'data' },
                { value: `${currencySymbol}${total.toFixed(2)}`, type: 'result' },
                { value: this.getItemNotes(item, total), type: 'data' }
            ]);
        });

        data.push(['', '', '', '', '', '']); // Empty row

        // Category Summary
        data.push([
            { value: 'Category Summary', type: 'header', span: 6 },
            '', '', '', '', ''
        ]);

        data.push([
            { value: 'Category', type: 'header' },
            { value: 'Items Count', type: 'header' },
            { value: 'Total Amount', type: 'header' },
            { value: 'Percentage', type: 'header' },
            { value: 'Avg per Item', type: 'header' },
            { value: 'Priority', type: 'header' }
        ]);

        Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]).forEach(category => {
            const categoryTotal = categoryTotals[category];
            const categoryItems = items.filter(item => item.category === category);
            const percentage = (categoryTotal / subtotal) * 100;
            const avgPerItem = categoryTotal / categoryItems.length;

            data.push([
                { value: category, type: 'label' },
                { value: categoryItems.length.toString(), type: 'result' },
                { value: `${currencySymbol}${categoryTotal.toFixed(2)}`, type: 'result' },
                { value: `${percentage.toFixed(1)}%`, type: 'data' },
                { value: `${currencySymbol}${avgPerItem.toFixed(2)}`, type: 'data' },
                { value: this.getCategoryPriority(category), type: 'data' }
            ]);
        });

        data.push(['', '', '', '', '', '']); // Empty row

        // Financial Summary
        data.push([
            { value: 'Financial Summary', type: 'header', span: 6 },
            '', '', '', '', ''
        ]);

        data.push([
            { value: 'Description', type: 'header' },
            { value: 'Calculation', type: 'header' },
            { value: 'Amount', type: 'header' },
            { value: 'Percentage', type: 'header' },
            { value: 'Impact', type: 'header' },
            { value: 'Notes', type: 'header' }
        ]);

        data.push([
            { value: 'Subtotal', type: 'label' },
            { value: 'Sum of all items', type: 'formula' },
            { value: `${currencySymbol}${subtotal.toFixed(2)}`, type: 'result' },
            { value: '100.0%', type: 'data' },
            { value: 'Base amount', type: 'data' },
            { value: `${items.length} items total`, type: 'data' }
        ]);

        if (discountRate > 0) {
            data.push([
                { value: 'Discount', type: 'label' },
                { value: `${(discountRate * 100).toFixed(1)}% of subtotal`, type: 'formula' },
                { value: `-${currencySymbol}${discountAmount.toFixed(2)}`, type: 'result' },
                { value: `-${(discountRate * 100).toFixed(1)}%`, type: 'data' },
                { value: 'Savings', type: 'data' },
                { value: 'Applied discount', type: 'data' }
            ]);

            data.push([
                { value: 'After Discount', type: 'label' },
                { value: 'Subtotal - Discount', type: 'formula' },
                { value: `${currencySymbol}${afterDiscount.toFixed(2)}`, type: 'result' },
                { value: `${((afterDiscount / subtotal) * 100).toFixed(1)}%`, type: 'data' },
                { value: 'Reduced total', type: 'data' },
                { value: 'Before tax', type: 'data' }
            ]);
        }

        if (taxRate > 0) {
            data.push([
                { value: 'Tax', type: 'label' },
                { value: `${(taxRate * 100).toFixed(1)}% of discounted amount`, type: 'formula' },
                { value: `+${currencySymbol}${taxAmount.toFixed(2)}`, type: 'result' },
                { value: `+${(taxRate * 100).toFixed(1)}%`, type: 'data' },
                { value: 'Additional cost', type: 'data' },
                { value: 'Government tax', type: 'data' }
            ]);
        }

        data.push([
            { value: 'Final Total', type: 'label' },
            { value: 'After discount + Tax', type: 'formula' },
            { value: `${currencySymbol}${finalTotal.toFixed(2)}`, type: 'result' },
            { value: `${((finalTotal / subtotal) * 100).toFixed(1)}%`, type: 'data' },
            { value: 'Amount to pay', type: 'data' },
            { value: 'Final checkout amount', type: 'data' }
        ]);

        data.push(['', '', '', '', '', '']); // Empty row

        // Shopping Statistics
        data.push([
            { value: 'Shopping Statistics', type: 'header', span: 6 },
            '', '', '', '', ''
        ]);

        const avgItemPrice = subtotal / items.length;
        const maxItem = items.reduce((max, item, index) => 
            itemTotals[index] > itemTotals[max] ? index : max, 0);
        const minItem = items.reduce((min, item, index) => 
            itemTotals[index] < itemTotals[min] ? index : min, 0);

        data.push([
            { value: 'Statistic', type: 'header' },
            { value: 'Value', type: 'header' },
            { value: 'Description', type: 'header' },
            { value: 'Analysis', type: 'header' },
            { value: 'Recommendation', type: 'header' },
            { value: 'Action', type: 'header' }
        ]);

        data.push([
            { value: 'Total Items', type: 'label' },
            { value: items.length.toString(), type: 'result' },
            { value: 'Number of different items', type: 'data' },
            { value: items.length > 10 ? 'Large shopping list' : items.length > 5 ? 'Medium list' : 'Small list', type: 'data' },
            { value: items.length > 15 ? 'Consider splitting into multiple trips' : 'Manageable size', type: 'data' },
            { value: 'Review necessity', type: 'data' }
        ]);

        data.push([
            { value: 'Average Item Cost', type: 'label' },
            { value: `${currencySymbol}${avgItemPrice.toFixed(2)}`, type: 'result' },
            { value: 'Average total per item', type: 'data' },
            { value: avgItemPrice > 10 ? 'High average' : avgItemPrice > 5 ? 'Moderate average' : 'Low average', type: 'data' },
            { value: avgItemPrice > 15 ? 'Look for alternatives' : 'Reasonable pricing', type: 'data' },
            { value: 'Compare prices', type: 'data' }
        ]);

        data.push([
            { value: 'Most Expensive Item', type: 'label' },
            { value: `${items[maxItem].name} (${currencySymbol}${itemTotals[maxItem].toFixed(2)})`, type: 'result' },
            { value: 'Highest total cost item', type: 'data' },
            { value: `${((itemTotals[maxItem] / subtotal) * 100).toFixed(1)}% of total`, type: 'data' },
            { value: itemTotals[maxItem] > subtotal * 0.3 ? 'Consider if necessary' : 'Reasonable proportion', type: 'data' },
            { value: 'Price check', type: 'data' }
        ]);

        data.push([
            { value: 'Least Expensive Item', type: 'label' },
            { value: `${items[minItem].name} (${currencySymbol}${itemTotals[minItem].toFixed(2)})`, type: 'result' },
            { value: 'Lowest total cost item', type: 'data' },
            { value: `${((itemTotals[minItem] / subtotal) * 100).toFixed(1)}% of total`, type: 'data' },
            { value: 'Good value item', type: 'data' },
            { value: 'Consider buying more', type: 'data' }
        ]);

        data.push([
            { value: 'Categories Count', type: 'label' },
            { value: Object.keys(categoryTotals).length.toString(), type: 'result' },
            { value: 'Different item categories', type: 'data' },
            { value: 'Diverse shopping list', type: 'data' },
            { value: 'Well-balanced selection', type: 'data' },
            { value: 'Organize by category', type: 'data' }
        ]);

        data.push(['', '', '', '', '', '']); // Empty row

        // Budget Analysis
        data.push([
            { value: 'Budget Analysis & Recommendations', type: 'header', span: 6 },
            '', '', '', '', ''
        ]);

        const recommendations = this.generateShoppingRecommendations(items, itemTotals, subtotal, finalTotal);
        recommendations.forEach(rec => {
            data.push([
                { value: rec.category, type: 'label' },
                { value: rec.recommendation, type: 'data', span: 5 },
                '', '', '', ''
            ]);
        });

        return data;
    }

    // Generate shopping recommendations
    generateShoppingRecommendations(items, itemTotals, subtotal, finalTotal) {
        const recommendations = [];

        // Budget recommendations
        if (finalTotal > 200) {
            recommendations.push({
                category: 'Budget Alert',
                recommendation: '💰 High total amount - Consider if all items are necessary or look for alternatives'
            });
        } else if (finalTotal > 100) {
            recommendations.push({
                category: 'Budget Notice',
                recommendation: '💸 Moderate spending - Good time to check for deals and coupons'
            });
        } else {
            recommendations.push({
                category: 'Budget Status',
                recommendation: '✅ Reasonable total - Well-controlled shopping list'
            });
        }

        // Item-specific recommendations
        const maxItemIndex = itemTotals.indexOf(Math.max(...itemTotals));
        const maxItemPercentage = (itemTotals[maxItemIndex] / subtotal) * 100;

        if (maxItemPercentage > 40) {
            recommendations.push({
                category: 'Item Distribution',
                recommendation: `⚠️ ${items[maxItemIndex].name} represents ${maxItemPercentage.toFixed(1)}% of total - Consider if quantity is necessary`
            });
        }

        // Shopping efficiency
        if (items.length < 5) {
            recommendations.push({
                category: 'Shopping Efficiency',
                recommendation: '🛒 Small list - Good for quick shopping trips, consider combining with other errands'
            });
        } else if (items.length > 15) {
            recommendations.push({
                category: 'Shopping Efficiency',
                recommendation: '📝 Large list - Consider organizing by store layout or splitting into multiple trips'
            });
        }

        // Category balance
        const categories = [...new Set(items.map(item => item.category))];
        if (categories.includes('Fruits') || categories.includes('Vegetables')) {
            recommendations.push({
                category: 'Nutrition',
                recommendation: '🥬 Good inclusion of fresh produce - Healthy shopping choices'
            });
        } else {
            recommendations.push({
                category: 'Nutrition',
                recommendation: '🍎 Consider adding fresh fruits and vegetables for balanced nutrition'
            });
        }

        return recommendations;
    }

    // Get currency symbol
    getCurrencySymbol(currency) {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'CAD': 'C$',
            'AUD': 'A$',
            'CHF': 'CHF',
            'CNY': '¥',
            'INR': '₹'
        };
        return symbols[currency] || '$';
    }

    // Get item notes based on price analysis
    getItemNotes(item, total) {
        if (total > 20) return 'High value item';
        if (total < 2) return 'Low cost item';
        if (item.quantity > 5) return 'Bulk purchase';
        return 'Standard item';
    }

    // Get category priority
    getCategoryPriority(category) {
        const priorities = {
            'Dairy': 'High',
            'Meat': 'High',
            'Fruits': 'Medium',
            'Vegetables': 'Medium',
            'Grains': 'Medium',
            'Bakery': 'Medium',
            'Cooking': 'Low',
            'Baking': 'Low',
            'Snacks': 'Low'
        };
        return priorities[category] || 'Medium';
    }

    // Method to get supported parameter formats for shopping
    getSupportedParameterFormats() {
        return {
            formats: [
                'Text format: Item | Qty | Unit Price format',
                'Simple list: ItemName: qty price, ItemName2: qty price',
                'Object notation: { items: [...], currency: "USD", taxRate: 0.08 }',
                'Template name: shopping_list (uses defaults)'
            ],
            parameters: {
                items: 'Array of shopping items with name, quantity, unitPrice, and category',
                currency: 'Currency code (USD, EUR, GBP, etc.)',
                taxRate: 'Tax rate as decimal (0.08 for 8%)',
                discountRate: 'Discount rate as decimal (0.10 for 10%)'
            },
            examples: {
                simple_text: `Rice | 2 | 12.00
Oil | 3 | 5.00
Bread | 4 | 2.50`,
                simple_list: 'Rice: 2 12.00, Oil: 3 5.00, Bread: 4 2.50',
                with_tax: '{ currency: "USD", taxRate: 0.08, discountRate: 0.05 }',
                full_object: '{ items: [{ name: "Rice", quantity: 2, unitPrice: 12.00, category: "Grains" }], currency: "USD" }'
            }
        };
    }

    // Method to validate shopping parameters
    validateShoppingParameters(params) {
        const errors = [];

        if (!params.items || !Array.isArray(params.items)) {
            errors.push('Items must be an array');
            return { isValid: false, errors };
        }

        if (params.items.length === 0) {
            errors.push('At least one item is required');
        }

        params.items.forEach((item, index) => {
            if (!item.name || typeof item.name !== 'string') {
                errors.push(`Item ${index + 1}: Name is required and must be a string`);
            }
            if (item.quantity === undefined || isNaN(parseFloat(item.quantity)) || parseFloat(item.quantity) < 0) {
                errors.push(`Item ${index + 1}: Quantity must be a non-negative number`);
            }
            if (item.unitPrice === undefined || isNaN(parseFloat(item.unitPrice)) || parseFloat(item.unitPrice) < 0) {
                errors.push(`Item ${index + 1}: Unit price must be a non-negative number`);
            }
        });

        if (params.taxRate !== undefined && (isNaN(parseFloat(params.taxRate)) || parseFloat(params.taxRate) < 0)) {
            errors.push('Tax rate must be a non-negative number');
        }

        if (params.discountRate !== undefined && (isNaN(parseFloat(params.discountRate)) || parseFloat(params.discountRate) < 0 || parseFloat(params.discountRate) > 1)) {
            errors.push('Discount rate must be between 0 and 1');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Method to add item to shopping list
    addShoppingItem(name, quantity, unitPrice, category = 'General') {
        const item = {
            name: name || `Item ${Date.now()}`,
            quantity: Math.max(0, parseFloat(quantity) || 1),
            unitPrice: Math.max(0, parseFloat(unitPrice) || 0),
            category: category || 'General'
        };
        return item;
    }

    // Method to parse custom equations with parameters
    parseCustomEquation(equation, parameters) {
        let normalizedEq = equation.toLowerCase().replace(/\s/g, '');

        // Special handling for betting
        if (normalizedEq.startsWith('bet_analysis') || normalizedEq.startsWith('custom_betting')) {
            let paramsString = equation.replace(/bet_analysis|custom_betting/i, '').trim();
            let parsedParams;

            if (paramsString) {
                // Parse the remaining string as params
                parsedParams = this.parseBettingEquation(paramsString);
            } else if (parameters && Object.keys(parameters).length > 0) {
                // Use provided parameters object
                parsedParams = { ...this.getDefaultParameters('bet_analysis'), ...parameters };
            } else {
                // Defaults
                parsedParams = this.getDefaultParameters('bet_analysis');
            }

            // Validate
            const validation = this.validateBettingParameters(parsedParams);
            if (!validation.isValid) {
                throw new Error(`Invalid betting parameters: ${validation.errors.join('; ')}`);
            }

            return {
                equation: 'bet_analysis',
                template: this.formulaDatabase['bet_analysis'],
                parameters: parsedParams
            };
        }

        // Special handling for shopping
        if (normalizedEq.startsWith('shopping_list') || normalizedEq.startsWith('custom_shopping')) {
            let paramsString = equation.replace(/shopping_list|custom_shopping/i, '').trim();
            let parsedParams;

            if (paramsString) {
                // Parse the remaining string as params
                parsedParams = this.parseShoppingEquation(paramsString);
            } else if (parameters && Object.keys(parameters).length > 0) {
                // Use provided parameters object
                parsedParams = { ...this.getDefaultParameters('shopping_list'), ...parameters };
            } else {
                // Defaults
                parsedParams = this.getDefaultParameters('shopping_list');
            }

            // Validate
            const validation = this.validateShoppingParameters(parsedParams);
            if (!validation.isValid) {
                throw new Error(`Invalid shopping parameters: ${validation.errors.join('; ')}`);
            }

            return {
                equation: 'shopping_list',
                template: this.formulaDatabase['shopping_list'],
                parameters: parsedParams
            };
        }

        if (!this.formulaDatabase[normalizedEq]) {
            throw new Error(`Unknown equation: ${equation}`);
        }

        const template = this.formulaDatabase[normalizedEq];
        // Validate parameters
        const requiredParams = template.params;
        const missingParams = requiredParams.filter(param => !(param in parameters));

        if (missingParams.length > 0) {
            throw new Error(`Missing parameters: ${missingParams.join(', ')}`);
        }

        // Validate parameter types and values
        this.validateParameters(normalizedEq, parameters);

        return {
            equation: normalizedEq,
            template: template,
            parameters: parameters
        };
    }

    // Method to validate parameters based on equation type
    validateParameters(equation, parameters) {
        switch(equation) {
            case 'linearfunction':
                // Linear functions are valid for any real numbers m and b
                if (typeof parameters.m !== 'number' || typeof parameters.b !== 'number') {
                    throw new Error('Parameters "m" and "b" must be numbers');
                }
                break;
            case 'customlinear':
                // Custom linear requires an equation string
                if (typeof parameters.equation !== 'string' || parameters.equation.trim() === '') {
                    throw new Error('Parameter "equation" must be a non-empty string');
                }
                // Test if the equation can be parsed
                try {
                    this.parseLinearEquation(parameters.equation);
                } catch (error) {
                    throw new Error(`Invalid linear equation: ${error.message}`);
                }
                break;
            case 'customquadratic':
                // Custom quadratic requires an equation string
                if (typeof parameters.equation !== 'string' || parameters.equation.trim() === '') {
                    throw new Error('Parameter "equation" must be a non-empty string');
                }
                // Test if the equation can be parsed
                try {
                    this.parseQuadraticEquation(parameters.equation);
                } catch (error) {
                    throw new Error(`Invalid quadratic equation: ${error.message}`);
                }
                break;
            case 'quadraticformula':
                if (parameters.a === 0) {
                    throw new Error('Parameter "a" cannot be zero in quadratic formula');
                }
                break;
            case 'compoundinterest':
                if (parameters.P <= 0) {
                    throw new Error('Principal amount must be positive');
                }
                if (parameters.r < 0) {
                    throw new Error('Interest rate cannot be negative');
                }
                if (parameters.n <= 0) {
                    throw new Error('Number of compounds per year must be positive');
                }
                if (parameters.t <= 0) {
                    throw new Error('Time period must be positive');
                }
                break;
            case 'bet_analysis':
            case 'custom_betting':
                const bettingValidation = this.validateBettingParameters(parameters);
                if (!bettingValidation.isValid) {
                    throw new Error(bettingValidation.errors.join('; '));
                }
                break;
            case 'shopping_list':
            case 'custom_shopping':
                const shoppingValidation = this.validateShoppingParameters(parameters);
                if (!shoppingValidation.isValid) {
                    throw new Error(shoppingValidation.errors.join('; '));
                }
                break;
        }
    }

    // Method to get default analysis template for an equation
    getDefaultAnalysisTemplate(equation) {
        const normalizedEq = equation.toLowerCase().replace(/\s/g, '');

        if (!this.formulaDatabase[normalizedEq]) {
            throw new Error(`Unknown equation: ${equation}`);
        }

        const template = this.formulaDatabase[normalizedEq];
        // Provide default parameters based on equation type
        const defaultParams = this.getDefaultParameters(normalizedEq);

        return {
            equation: normalizedEq,
            type: template.type,
            description: template.description,
            requiredParams: template.params,
            defaultParams: defaultParams,
            example: this.generateSpreadsheetWithParams(equation, defaultParams)
        };
    }

    // Method to get default parameters for each equation
    getDefaultParameters(equation) {
        const defaults = {
            'linearfunction': { m: 2, b: 3 }, // y = 2x + 3
            'customlinear': { equation: 'y = 2x + 3' }, // Example custom linear equation
            'quadraticformula': { a: 1, b: -5, c: 6 }, // x² - 5x + 6 = 0
            'customquadratic': { equation: 'y = x² - 4x + 3' }, // Example custom quadratic equation
            'compoundinterest': { P: 1000, r: 0.05, n: 12, t: 5 }, // $1000 at 5% compounded monthly for 5 years
            'bet_analysis': {
                winProbability: 0.55,
                betAmount: 100,
                odds: 2.0,
                oddsFormat: 'decimal',
                bankroll: 1000
            },
            'custom_betting': {
                equation: 'winProbability:0.55, betAmount:100, odds:2.0, oddsFormat:decimal, bankroll:1000'
            },
            'shopping_list': {
                items: [
                    { name: 'Rice', quantity: 2, unitPrice: 12.00, category: 'Grains' },
                    { name: 'Oil', quantity: 3, unitPrice: 5.00, category: 'Cooking' },
                    { name: 'Bread', quantity: 4, unitPrice: 2.50, category: 'Bakery' },
                    { name: 'Milk', quantity: 2, unitPrice: 3.00, category: 'Dairy' },
                    { name: 'Sugar', quantity: 1, unitPrice: 4.50, category: 'Baking' },
                    { name: 'Apples', quantity: 3, unitPrice: 3.20, category: 'Fruits' },
                    { name: 'Chicken', quantity: 2, unitPrice: 8.75, category: 'Meat' },
                    { name: 'Eggs', quantity: 1, unitPrice: 6.00, category: 'Dairy' }
                ],
                currency: 'USD',
                taxRate: 0.08, // 8% tax
                discountRate: 0.00 // No discount by default
            },
            'custom_shopping': {
                itemsData: 'Rice: 2 12.00, Oil: 3 5.00, Bread: 4 2.50, Milk: 2 3.00'
            }
        };

        return defaults[equation] || {};
    }

    // Method to get available equations
    getAvailableEquations() {
        return Object.keys(this.formulaDatabase).map(key => ({
            equation: key,
            type: this.formulaDatabase[key].type,
            description: this.formulaDatabase[key].description,
            params: this.formulaDatabase[key].params
        }));
    }

    // Method to get calculation history
    getCalculationHistory() {
        return this.calculationHistory;
    }

    // Method to clear history
    clearHistory() {
        this.calculationHistory = [];
    }

    // Method to change theme
    setTheme(theme) {
        this.theme = theme;
        this.colors = this.setThemeColors(theme);
    }

    // Method to add custom equation template
    addCustomEquation(name, config) {
        const normalizedName = name.toLowerCase().replace(/\s/g, '');
        this.formulaDatabase[normalizedName] = {
            type: config.type || 'custom',
            description: config.description || name,
            params: config.params || [],
            template: config.template
        };
    }

    // Method to calculate betting metrics for statistics
    calculateBettingMetrics(params) {
        const { winProbability, betAmount, odds, oddsFormat, bankroll } = params;
        const decimalOdds = this.convertOdds(odds, oddsFormat, 'decimal');
        const impliedProbability = this.calculateImpliedProbability(odds, oddsFormat);
        const payout = betAmount * decimalOdds;
        const profit = payout - betAmount;
        const expectedValue = (winProbability * profit) - ((1 - winProbability) * betAmount);
        const edge = winProbability - impliedProbability;
        const kellyFraction = this.calculateKellyCriterion(winProbability, odds, oddsFormat);
        const betPercentage = (betAmount / bankroll) * 100;

        // Calculate variance and standard deviation
        const winOutcome = profit;
        const loseOutcome = -betAmount;
        const variance = winProbability * Math.pow(winOutcome - expectedValue, 2) +
                        (1 - winProbability) * Math.pow(loseOutcome - expectedValue, 2);
        const standardDeviation = Math.sqrt(variance);

        return {
            expectedValue,
            edge,
            kellyFraction,
            betPercentage,
            impliedProbability,
            variance,
            standardDeviation
        };
    }

    // Method to calculate shopping metrics for statistics
    calculateShoppingMetrics(params) {
        const { items, currency, taxRate, discountRate } = params;
        const totals = this.calculateShoppingTotals(items, taxRate, discountRate);
        const categoryGroups = this.groupItemsByCategory(items);
        const patterns = this.analyzeShoppingPatterns(items);
        const timeEstimate = this.estimateShoppingTime(items);
        const categoryPercentages = this.calculateCategoryPercentages(items);

        return {
            ...totals,
            categoryCount: Object.keys(categoryGroups).length,
            mostExpensiveItem: items.reduce((max, item) => 
                (item.quantity * item.unitPrice) > (max.quantity * max.unitPrice) ? item : max, items[0]),
            averageItemPrice: totals.subtotal / items.length,
            patterns,
            timeEstimate,
            categoryPercentages,
            priceEfficiency: totals.subtotal / items.length // Cost per item
        };
    }

    // Method to generate spreadsheet from equation with custom parameters
    generateSpreadsheetWithParams(equation, parameters) {
        const parsedEq = this.parseCustomEquation(equation, parameters);
        const template = parsedEq.template;
        const data = template.template(equation, parsedEq.parameters); // Use parsed parameters

        this.currentSheet = {
            equation: parsedEq.equation,
            type: template.type,
            description: template.description,
            data: data,
            parameters: parsedEq.parameters,
            generated: new Date().toISOString(),
            rows: data.length,
            cols: data[0] ? data[0].length : 0
        };

        this.calculationHistory.push({
            equation: parsedEq.equation,
            parameters: parsedEq.parameters,
            timestamp: new Date().toISOString(),
            type: template.type
        });

        return this.currentSheet;
    }

    // Enhanced method to generate spreadsheet from equation
    generateSpreadsheet(equation, parameters = null) {
        const normalizedEq = equation.toLowerCase().replace(/\s/g, '');
        if (!this.formulaDatabase[normalizedEq]) {
            throw new Error(`Unknown equation: ${equation}. Available equations: ${Object.keys(this.formulaDatabase).join(', ')}`);
        }

        const template = this.formulaDatabase[normalizedEq];
        // Use provided parameters or defaults
        const finalParams = parameters || this.getDefaultParameters(normalizedEq);

        // Validate parameters
        this.validateParameters(normalizedEq, finalParams);

        // Generate the data using the template
        const data = template.template(equation, finalParams);

        this.currentSheet = {
            equation: normalizedEq,
            type: template.type,
            description: template.description,
            data: data,
            parameters: finalParams,
            generated: new Date().toISOString(),
            rows: data.length,
            cols: data[0] ? data[0].length : 0
        };

        this.calculationHistory.push({
            equation: normalizedEq,
            parameters: finalParams,
            timestamp: new Date().toISOString(),
            type: template.type
        });

        return this.currentSheet;
    }

    // Method to get template-specific help and examples
    getTemplateHelp(equation) {
        const normalizedEq = equation.toLowerCase().replace(/\s/g, '');
        
        switch(normalizedEq) {
            case 'bet_analysis':
            case 'custom_betting':
                return {
                    type: 'betting',
                    description: 'Comprehensive betting probability analysis with Kelly Criterion, expected value, and risk assessment',
                    parameterFormats: this.getSupportedParameterFormats(),
                    examples: {
                        basic: 'bet_analysis',
                        withParams: 'bet_analysis winProbability: 0.6, betAmount: 50, odds: 2.2, oddsFormat: decimal, bankroll: 1000',
                        american: 'custom_betting winProbability: 0.55, betAmount: 100, odds: +150, oddsFormat: american, bankroll: 2000'
                    },
                    metrics: 'Calculates expected value, Kelly Criterion, risk assessment, and long-term projections'
                };

            case 'shopping_list':
            case 'custom_shopping':
                return {
                    type: 'shopping',
                    description: 'Comprehensive shopping list analysis with budget tracking, category breakdown, and optimization suggestions',
                    parameterFormats: this.getSupportedParameterFormats(),
                    examples: {
                        basic: 'shopping_list',
                        textFormat: `shopping_list Rice | 2 | 12.00
Oil | 3 | 5.00
Bread | 4 | 2.50`,
                        simpleList: 'custom_shopping Rice: 2 12.00, Oil: 3 5.00, Bread: 4 2.50',
                        withSettings: 'shopping_list currency: EUR, taxRate: 0.10, discountRate: 0.05'
                    },
                    metrics: 'Calculates totals, category analysis, budget optimization, and shopping time estimates'
                };

            case 'linearfunction':
                return {
                    type: 'mathematical',
                    description: 'Linear function analysis with slope-intercept form',
                    examples: {
                        basic: 'linearfunction m: 2, b: 3',
                        custom: 'customlinear equation: "y = 3x - 5"'
                    }
                };

            case 'quadraticformula':
                return {
                    type: 'mathematical', 
                    description: 'Quadratic equation solver with detailed analysis',
                    examples: {
                        basic: 'quadraticformula a: 1, b: -5, c: 6',
                        custom: 'customquadratic equation: "y = 2x² - 4x + 1"'
                    }
                };

            case 'compoundinterest':
                return {
                    type: 'financial',
                    description: 'Compound interest calculator with detailed breakdown',
                    examples: {
                        basic: 'compoundinterest P: 1000, r: 0.05, n: 12, t: 5'
                    }
                };

            default:
                return {
                    type: 'unknown',
                    description: 'Template not found',
                    availableTemplates: this.getAvailableEquations()
                };
        }
    }

    // Method to get all supported formats for all templates
    getAllSupportedFormats() {
        return {
            betting: {
                templates: ['bet_analysis', 'custom_betting'],
                formats: this.getSupportedParameterFormats ? this.getSupportedParameterFormats() : {},
                description: 'Betting analysis with probability calculations and risk management'
            },
            shopping: {
                templates: ['shopping_list', 'custom_shopping'],
                formats: {
                    formats: [
                        'Text format: Item | Qty | Unit Price',
                        'Simple list: ItemName: qty price',
                        'Object notation: { items: [...], currency: "USD", taxRate: 0.08 }',
                        'Template name: shopping_list (uses defaults)'
                    ],
                    parameters: {
                        items: 'Array of shopping items',
                        currency: 'Currency code (USD, EUR, GBP, etc.)',
                        taxRate: 'Tax rate as decimal',
                        discountRate: 'Discount rate as decimal'
                    }
                },
                description: 'Shopping list analysis with budget optimization and category breakdown'
            },
            mathematical: {
                templates: ['linearfunction', 'customlinear', 'quadraticformula', 'customquadratic'],
                description: 'Mathematical equation analysis and solving'
            },
            financial: {
                templates: ['compoundinterest'],
                description: 'Financial calculations and analysis'
            }
        };
    }

    // Method to suggest similar templates
    suggestSimilarTemplates(equation) {
        const normalizedEq = equation.toLowerCase().replace(/\s/g, '');
        const suggestions = [];

        if (normalizedEq.includes('bet') || normalizedEq.includes('gambl') || normalizedEq.includes('odds')) {
            suggestions.push({
                template: 'bet_analysis',
                reason: 'For betting and gambling probability analysis'
            });
        }

        if (normalizedEq.includes('shop') || normalizedEq.includes('buy') || normalizedEq.includes('purchase') || normalizedEq.includes('list')) {
            suggestions.push({
                template: 'shopping_list', 
                reason: 'For shopping list analysis and budget tracking'
            });
        }

        if (normalizedEq.includes('linear') || normalizedEq.includes('line') || normalizedEq.includes('slope')) {
            suggestions.push({
                template: 'linearfunction',
                reason: 'For linear equation analysis'
            });
        }

        if (normalizedEq.includes('quadratic') || normalizedEq.includes('square') || normalizedEq.includes('parabola')) {
            suggestions.push({
                template: 'quadraticformula',
                reason: 'For quadratic equation solving'
            });
        }

        if (normalizedEq.includes('interest') || normalizedEq.includes('invest') || normalizedEq.includes('compound')) {
            suggestions.push({
                template: 'compoundinterest',
                reason: 'For compound interest calculations'
            });
        }

        return suggestions;
    }

}
