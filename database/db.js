// Database Configuration for PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
    process.exit(-1);
});

// Query helper function
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

// Get all designs
const getAllDesigns = async () => {
    const result = await query(
        'SELECT * FROM designs ORDER BY created_at DESC'
    );
    return result.rows;
};

// Get design by ID
const getDesignById = async (id) => {
    const result = await query(
        'SELECT * FROM designs WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

// Get design by slug
const getDesignBySlug = async (slug) => {
    const result = await query(
        'SELECT * FROM designs WHERE slug = $1',
        [slug]
    );
    return result.rows[0];
};

// Export pool and functions
module.exports = {
    pool,
    query,
    getAllDesigns,
    getDesignById,
    getDesignBySlug
};