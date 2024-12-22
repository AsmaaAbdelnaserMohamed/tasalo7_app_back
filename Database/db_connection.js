import pkg from 'pg';
import dotenv from "dotenv";
const { Client } = pkg;
dotenv.config();


// database connection
export const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


export function dbConnection() {
    client.connect(err => {
        if (err) {
            console.error('Connection error', err.stack);
        } else {
            console.log('Connected to database');
        }
    });
}


export const listConnectionDataBase = process.env.LISTDATABASE_URL