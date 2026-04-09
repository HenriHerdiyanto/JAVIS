const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getUsers = (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(results);
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) {
            return res.status(400).json({ message: 'User tidak ditemukan' });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah' });
        }
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        // Simpan token di HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // true kalau pakai HTTPS
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({
            message: 'Login berhasil'
        });
    });
};

exports.register = async (req, res) => {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { email, password } = req.body;
        console.log("BODY:", req.body);

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email dan password wajib diisi'
            });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Format email tidak valid'
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password minimal 6 karakter'
            });
        }
        // cek user
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length > 0) {
                return res.status(400).json({
                    message: 'Email sudah terdaftar'
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query(
                "INSERT INTO users (email, password) VALUES (?, ?)",
                [email, hashedPassword],
                (err, result) => {
                    if (err) return res.status(500).json(err);
                    res.status(201).json({
                        message: 'User berhasil dibuat',
                        userId: result.insertId
                    });
                }
            );
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: false // true kalau HTTPS
    });

    res.json({
        message: 'Logout berhasil'
    });
};