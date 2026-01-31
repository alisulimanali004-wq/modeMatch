const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
    season: { 
        type: String, 
        enum: ['winter', 'summer', 'autumn', 'spring'] 
    },
    event: { 
        type: String, 
        enum: ['sport', 'classic', 'date', 'event', 'casual', 'formal'] 
    },
    gender: { 
        type: String, 
        enum: ['male', 'female'] 
    },
    bodyShape: { type: String }, // A, B, C, D, E
    
    //  ›«’Ì· «·„·«»” «·„ﬁ —Õ…
    top: { type: String, required: true },
    bottom: { type: String, required: true },
    shoes: { type: String },
    accessories: { type: String },
    colors: { type: [String] },
    
    // «·’Ê—
    imageUrl: { type: String },
    
    // «·„ «Ã— «·„Ê’Ï »Â«
    recommendedStores: { 
        type: [String],
        enum: ['shein', 'aliexpress', 'temu', 'zara', 'h&m'] 
    },
    
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Outfit', outfitSchema);