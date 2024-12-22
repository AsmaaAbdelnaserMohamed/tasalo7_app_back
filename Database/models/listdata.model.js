import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// create database connection
const pool = new Pool({
    connectionString: process.env.LISTDATABASE_URL,
});

const getDataByUserId = async (userId, searchQuery = '', limit = 5, offset = 0) => {
    let query = `SELECT requestnumber, applicant_name, address, gov, x_coordinate, y_coordinate, phone_number, observer_decision,mapp_user_id,height_image,type,change_status_id
        FROM cert_data
        WHERE mapp_user_id = $1 AND height_image is null AND type = 'متغير' AND change_status_id = 2 `;
    let countQuery = `
        SELECT COUNT(*) AS total
        FROM cert_data
        WHERE mapp_user_id = $1 AND height_image is null AND type = 'متغير' AND change_status_id = 2
    `;
    let filteredCountQuery = `
        SELECT COUNT(*) AS total
        FROM cert_data
        WHERE mapp_user_id = $1 AND height_image is null AND type = 'متغير' AND change_status_id = 2 AND (requestnumber ILIKE $2)`;

    const params = [userId];
    const countParams = [userId];
    const filteredCountParams = [userId, `%${searchQuery}%`];

    if (searchQuery) {
        query += ` AND (requestnumber ILIKE $2)`;
        params.push(`%${searchQuery}%`);
    }

    // If limit is not specified, all matching data is fetched
    if (limit) {
        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
    }

    try {
        console.log('Executing query:', query);
        console.log('With parameters:', params);

        // Query to get data

        const { rows: dataRows } = await pool.query(query, params);

        // Query to get the total number of results without filtering
        const { rows: countRows } = await pool.query(countQuery, countParams);
        const total = parseInt(countRows[0].total, 10);

        // Query to get the number of filtered results (if searchQuery exists)
        let filteredTotal = total;
        if (searchQuery) {
            const { rows: filteredCountRows } = await pool.query(filteredCountQuery, filteredCountParams);
            filteredTotal = parseInt(filteredCountRows[0].total, 10);
        }

        return {
            data: dataRows,
            total,
            filteredTotal
        };
    } catch (error) {
        console.error('Database query failed:', error.message);
        throw new Error('Database query failed');
    }
};

export { getDataByUserId };
