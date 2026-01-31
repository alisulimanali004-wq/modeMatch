const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

// ÇáÊÓÌíá
router.post('/register', register);

// ÊÓÌíá ÇáÏÎæá
router.post('/login', login);

// ÊÓÌíá ÇáÎÑæÌ
router.post('/logout', logout);

module.exports = router;