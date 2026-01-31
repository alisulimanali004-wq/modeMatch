require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import Models
const User = require('./models/User');
const Outfit = require('./models/Outfit');
const Contact = require('./models/Contact');

// Import AI Routes
const aiRoutes = require('./routes/ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ==================== ROUTES ====================

// Health Check
app.get('/', (req, res) => {
    res.send('ModaMatch API is running successfully');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'ModaMatch API',
        database: 'MongoDB Atlas',
        timestamp: new Date().toISOString()
    });
});

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, gender,
                height, weight, shoulderWidth, chestSize, waistSize } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email'
            });
        }

        // Create new user (password will be hashed by User model pre-save hook)
        const user = new User({
            firstName,
            lastName,
            email,
            password,
            phone,
            gender,
            height,
            weight,
            shoulderWidth,
            chestSize,
            waistSize
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during registration'
        });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during login'
        });
    }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during password reset'
        });
    }
});

// ==================== OUTFIT ROUTES ====================

// Get all outfits
app.get('/api/outfits', async (req, res) => {
    try {
        const outfits = await Outfit.find();
        res.json({
            success: true,
            count: outfits.length,
            outfits
        });
    } catch (error) {
        console.error('Get outfits error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// Get outfit suggestions
app.post('/api/outfits/suggest', async (req, res) => {
    try {
        const { season, event, gender, bodyShape } = req.body;

        // Build query dynamically
        const query = {};
        if (season) query.season = season.toLowerCase();
        if (event) query.event = event.toLowerCase();
        if (gender) query.gender = gender.toLowerCase();
        if (bodyShape) query.bodyShape = bodyShape.toUpperCase();

        let outfits = await Outfit.find(query);

        // If no exact match, get general suggestions for the gender
        if (outfits.length === 0 && gender) {
            outfits = await Outfit.find({ gender: gender.toLowerCase() }).limit(3);
            return res.json({
                success: true,
                message: 'General suggestions (no exact match found)',
                outfits
            });
        }

        res.json({
            success: true,
            message: 'Outfit suggestions found',
            outfits
        });

    } catch (error) {
        console.error('Outfit suggestions error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// ==================== CONTACT ROUTES ====================

// Submit contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        const contact = new Contact({
            firstName,
            lastName,
            email,
            message
        });

        await contact.save();

        res.json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// ==================== AI ROUTES ====================
app.use('/api/ai', aiRoutes);

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('ModaMatch Backend is running!');
    console.log('Port: ' + PORT);
    console.log('URL: http://localhost:' + PORT);
    console.log('Database: MongoDB Atlas');
    console.log('='.repeat(60));
    console.log('\nAvailable Endpoints:');
    console.log('   GET   http://localhost:' + PORT + '/api/health');
    console.log('   POST  http://localhost:' + PORT + '/api/auth/register');
    console.log('   POST  http://localhost:' + PORT + '/api/auth/login');
    console.log('   POST  http://localhost:' + PORT + '/api/auth/reset-password');
    console.log('   GET   http://localhost:' + PORT + '/api/outfits');
    console.log('   POST  http://localhost:' + PORT + '/api/outfits/suggest');
    console.log('   POST  http://localhost:' + PORT + '/api/contact');
    console.log('   POST  http://localhost:' + PORT + '/api/ai/recommend');
    console.log('   POST  http://localhost:' + PORT + '/api/ai/recommend-text');
    console.log('='.repeat(60));
});
