// test.js - ملف اختبار بسيط
const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('<h1>ModaMatch Backend is Working! 🚀</h1>');
});

app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'API is working perfectly!',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`✅ Test endpoint: http://localhost:${PORT}/api/test`);
});