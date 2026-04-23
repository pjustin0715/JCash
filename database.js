import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

async function getUser(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', 
        [id]);
    return rows[0];
}

async function createUser(username, phone_number, password_hash) {
    const [ result ] = await pool.query('INSERT INTO users (username, phone_number, password_hash) VALUES (?, ?, ?)', 
        [username, phone_number, password_hash]
    );
    const id = result.insertId;
    return getUser(id);
}

async function deleteUser(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', 
        [id]);
    return result;
}

async function getAllTransactions() {
    const [rows] = await pool.query('SELECT * FROM transactions');
    return rows;
}

async function getTransactions() {
    const [rows] = await pool.query(`
        SELECT 
        t.transaction_id, 
        t.amount, 
        t.sender_id,
        u_sender.username AS sender_username,
        u_recipient.username AS recipient_username
        FROM transactions t 
        LEFT JOIN users u_sender ON t.sender_id = u_sender.id 
        LEFT JOIN users u_recipient ON t.recipient_id = u_recipient.id
        WHERE sender_id = 1 OR recipient_id = 1;
        `);
    return rows;
}

async function sendTransaction(sender_id, recipient_id, amount) {
    const [user] = await pool.query('SELECT balance FROM users WHERE id = ?',[sender_id])
    if (user[0].balance < amount) return "Insufficient Funds";

    await pool.query('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, sender_id]);
    await pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, recipient_id]);

    await pool.query('INSERT INTO transactions (sender_id, recipient_id, amount) VALUES (?, ?, ?)',
        [sender_id, recipient_id, amount]
    );
    return "Transaction Successful";
}

export { getUsers, getUser, createUser, deleteUser, getAllTransactions, getTransactions, sendTransaction };