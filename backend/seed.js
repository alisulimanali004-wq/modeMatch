const mongoose = require('mongoose');
require('dotenv').config();
const Outfit = require('./models/Outfit');

const seedOutfits = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // حذف البيانات القديمة
        await Outfit.deleteMany({});
        
        // بيانات تجريبية للنساء
        const womenOutfits = [
            {
                season: 'winter',
                event: 'date',
                gender: 'female',
                bodyShape: 'A',
                top: 'Red sweater with turtleneck',
                bottom: 'Black leather pants',
                shoes: 'Black ankle boots',
                accessories: 'Gold necklace and black purse',
                colors: ['red', 'black', 'gold'],
                recommendedStores: ['shein', 'zara']
            },
            {
                season: 'summer',
                event: 'event',
                gender: 'female',
                bodyShape: 'B',
                top: 'Floral summer dress',
                bottom: '-',
                shoes: 'White sandals',
                accessories: 'Straw hat and sunglasses',
                colors: ['white', 'pink', 'green'],
                recommendedStores: ['shein', 'h&m']
            },
            {
                season: 'autumn',
                event: 'classic',
                gender: 'female',
                bodyShape: 'C',
                top: 'Beige trench coat',
                bottom: 'Brown pleated skirt',
                shoes: 'Brown loafers',
                accessories: 'Scarf and tote bag',
                colors: ['beige', 'brown', 'white'],
                recommendedStores: ['zara', 'h&m']
            }
        ];
        
        // بيانات تجريبية للرجال
        const menOutfits = [
            {
                season: 'winter',
                event: 'date',
                gender: 'male',
                bodyShape: 'A',
                top: 'Burgundy shirt',
                bottom: 'Grey trousers',
                shoes: 'Brown leather shoes',
                accessories: 'Silver watch',
                colors: ['burgundy', 'grey', 'brown'],
                recommendedStores: ['zara', 'h&m']
            },
            {
                season: 'summer',
                event: 'sport',
                gender: 'male',
                bodyShape: 'B',
                top: 'White t-shirt',
                bottom: 'Black shorts',
                shoes: 'White sneakers',
                accessories: 'Baseball cap',
                colors: ['white', 'black'],
                recommendedStores: ['shein', 'temu']
            },
            {
                season: 'spring',
                event: 'classic',
                gender: 'male',
                bodyShape: 'C',
                top: 'Light blue shirt',
                bottom: 'Khaki chinos',
                shoes: 'Brown loafers',
                accessories: 'Leather belt',
                colors: ['blue', 'khaki', 'brown'],
                recommendedStores: ['aliexpress', 'zara']
            }
        ];
        
        await Outfit.insertMany([...womenOutfits, ...menOutfits]);
        console.log('✅ Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedOutfits();