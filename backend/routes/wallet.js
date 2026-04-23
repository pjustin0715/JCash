import express from 'express';
import db from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get balance
router.get('/balance', authMiddleware, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT balance FROM wallets WHERE user_id = ?',
    [req.user.id]
  );
  res.json({ balance: rows[0].balance });
});

// Send money
router.post('/send', authMiddleware, async (req, res) => {
  const { receiver_email, amount } = req.body;
  const fee = 10.00;
  const total = parseFloat(amount) + fee;

  try {
    const [receiver] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [receiver_email]
    );
    if (!receiver.length) return res.status(404).json({ message: 'Recipient not found' });
    if (receiver[0].id === req.user.id) return res.status(400).json({ message: 'Cannot send to yourself' });

    const [senderWallet] = await db.execute(
      'SELECT balance FROM wallets WHERE user_id = ?',
      [req.user.id]
    );
    if (senderWallet[0].balance < total) return res.status(400).json({ message: 'Insufficient balance' });

    await db.execute(
      'UPDATE wallets SET balance = balance - ? WHERE user_id = ?',
      [total, req.user.id]
    );
    await db.execute(
      'UPDATE wallets SET balance = balance + ? WHERE user_id = ?',
      [amount, receiver[0].id]
    );
    await db.execute(
      'INSERT INTO transactions (sender_id, receiver_id, amount, fee, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, receiver[0].id, amount, fee, 'completed']
    );

    res.json({ message: 'Transfer successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Transaction history
router.get('/history', authMiddleware, async (req, res) => {
  const [rows] = await db.execute(
    `SELECT t.*, 
      u1.name as sender_name, 
      u2.name as receiver_name 
     FROM transactions t
     JOIN users u1 ON t.sender_id = u1.id
     JOIN users u2 ON t.receiver_id = u2.id
     WHERE t.sender_id = ? OR t.receiver_id = ?
     ORDER BY t.created_at DESC`,
    [req.user.id, req.user.id]
  );
  res.json(rows);
});

export default router;