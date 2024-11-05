const express = require('express');
const router = express.Router();
const CombinationService = require('../services/combinationService');
const CombinationGenerator = require('../utils/combinationGenerator');
const { pool } = require('../config/database');

router.post('/generate', async (req, res) => {
    const combinationService = new CombinationService(pool);

    try {
        // Extract request body parameters
        const { items, length } = req.body;

        // Validate input
        if (!Array.isArray(items) || !Number.isInteger(length) || length < 1) {
            return res.status(400).json({
                error: 'Invalid input. Expected array of numbers for items and positive integer for length'
            });
        }

        // Generate all items first (A1, B1, B2, C1)
        const generatedItems = CombinationGenerator.generateItems(items);

        // Store items in the database
        await combinationService.storeItems(generatedItems);

        // Generate combinations using the generated items
        const combinations = CombinationGenerator.generateValidCombinations(generatedItems, length);

        // Store combinations and log
        const result = await combinationService.storeCombinationsAndLog(
            combinations,
            { items, length }
        );

        res.json(result);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/items', async (req, res) => {
    const combinationService = new CombinationService(pool);
    try {
        const items = await combinationService.getAllItems();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;