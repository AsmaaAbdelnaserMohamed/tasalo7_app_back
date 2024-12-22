import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// create database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => {
        console.log('mapp user database is connected successfully');
    })
    .catch(err => {
        console.log('mapp user database error connection ', err.stack);
    });

// get user from database
export const findUserByUsername = async (username) => {
    const query = 'SELECT * FROM mapp_user WHERE name = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
};