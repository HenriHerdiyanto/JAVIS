const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// middleware
app.use(express.json());
app.use(cookieParser());

// CORS (WAJIB untuk cookie)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// test route
app.get('/', (req, res) => {
    res.send('API Login berjalan 🚀');
});

// run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});