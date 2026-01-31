const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    gender: { type: String, enum: ['male', 'female'] },
    
    // Measurements (�������)
    height: { type: Number }, // cm
    weight: { type: Number }, // kg
    shoulderWidth: { type: Number },
    chestSize: { type: Number },
    waistSize: { type: Number },
    
    // Preferences
    bodyShape: { type: String }, // A, B, C, D, E
    stylePreferences: { type: [String] }, // ['classic', 'sport', etc]
    
    // Timestamps
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// ������ ����� ������
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);