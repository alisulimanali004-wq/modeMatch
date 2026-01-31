const express = require('express');
const router = express.Router();
const Outfit = require('../models/Outfit');

// ÇáÍÕæá Úáì ÇÞÊÑÇÍÇÊ ÃÒíÇÁ
router.post('/suggest', async (req, res) => {
    try {
        const { season, event, gender, bodyShape } = req.body;
        
        // ÝáÊÑÉ ÍÓÈ ÇáãÚÇííÑ
        const outfits = await Outfit.find({
            season: season.toLowerCase(),
            event: event.toLowerCase(),
            gender: gender.toLowerCase(),
            bodyShape: bodyShape.toUpperCase()
        }).limit(3);
        
        // ÅÐÇ áã ÊæÌÏ äÊÇÆÌ¡ ÃÚØ ÇÞÊÑÇÍÇÊ ÚÇãÉ
        if (outfits.length === 0) {
            const generalOutfits = await Outfit.find({
                season: season.toLowerCase(),
                gender: gender.toLowerCase()
            }).limit(3);
            
            return res.json(generalOutfits);
        }
        
        res.json(outfits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ÅÖÇÝÉ Òí ÌÏíÏ (ááÊØæíÑ áÇÍÞÇð)
router.post('/', async (req, res) => {
    try {
        const outfit = await Outfit.create(req.body);
        res.status(201).json(outfit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ÇáÍÕæá Úáì ÌãíÚ ÇáÃÒíÇÁ
router.get('/', async (req, res) => {
    try {
        const outfits = await Outfit.find().sort({ createdAt: -1 });
        res.json(outfits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;