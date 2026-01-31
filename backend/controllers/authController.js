const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ÊæáíÏ ÇáÊæßä
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'moda-match-secret', {
        expiresIn: '30d'
    });
};

// ÊÓÌíá ãÓÊÎÏã ÌÏíÏ
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, gender } = req.body;
        
        // ÇáÊÍÞÞ ãä æÌæÏ ÇáãÓÊÎÏã
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // ÅäÔÇÁ ÇáãÓÊÎÏã
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            phone,
            gender
        });
        
        res.status(201).json({
            message: 'User registered successfully',
            token: generateToken(user._id),
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ÊÓÌíá ÇáÏÎæá
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // ÇáÚËæÑ Úáì ÇáãÓÊÎÏã
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // ÇáÊÍÞÞ ãä ßáãÉ ÇáãÑæÑ
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        res.json({
            message: 'Login successful',
            token: generateToken(user._id),
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ÊÓÌíá ÇáÎÑæÌ
exports.logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};