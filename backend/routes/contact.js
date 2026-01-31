const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// ÅÑÓÇá ÑÓÇáÉ ÇÊÕÇá
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;
        
        const contact = await Contact.create({
            firstName,
            lastName,
            email,
            message
        });
        
        res.status(201).json({ 
            message: 'Message sent successfully', 
            contact 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;