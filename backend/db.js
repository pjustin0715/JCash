import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.DB_PASSWORD,
  database: 'ewallet_db'
});

export default pool.promise();