const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!', app: 'LoftVision' });
});

// Get all designs
router.get('/designs', async (req, res) => {
    try {
        const designs = await db.getAllDesigns();
        res.json({
            success: true,
            count: designs.length,
            data: designs
        });
    } catch (error) {
        console.error('Error fetching designs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching designs',
            error: error.message
        });
    }
});

// Get design by ID
router.get('/designs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if id is a number or slug
        let design;
        if (isNaN(id)) {
            // It's a slug
            design = await db.getDesignBySlug(id);
        } else {
            // It's an ID
            design = await db.getDesignById(parseInt(id));
        }

        if (!design) {
            return res.status(404).json({
                success: false,
                message: 'Design not found'
            });
        }

        res.json({
            success: true,
            data: design
        });
    } catch (error) {
        console.error('Error fetching design:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching design',
            error: error.message
        });
    }
});

module.exports = router;