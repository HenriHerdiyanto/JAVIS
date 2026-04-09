const express = require('express');
const router = express.Router();

const rateLimit = require('express-rate-limit');

const {
    login,
    getUsers,
    register,
    logout
} = require('../controllers/authController');

const { verifyToken } = require('../middleware/authMiddleware');

// 🔥 RATE LIMIT LOGIN (5x per menit)
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 menit
    max: 5, // max 5 request
    message: {
        message: 'Terlalu banyak percobaan login, coba lagi nanti'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// 🔒 protected route
router.get('/users', verifyToken, getUsers);

// 🔥 pasang limiter di login
router.post('/login', loginLimiter, login);

router.post('/register', register);
router.post('/logout', logout);

module.exports = router;