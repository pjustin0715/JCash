import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashed, phone]
    );
    await db.execute(
      'INSERT INTO wallets (user_id, balance) VALUES (?, ?)',
      [result.insertId, 0.00]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Email already exists or server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: rows[0].id, name: rows[0].name, email: rows[0].email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;