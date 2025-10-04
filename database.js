const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test the connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL connection error:', err);
});

// Create users table if it doesn't exist
const createUsersTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'employee',
                otp_secret VARCHAR(255),
                otp_expiry TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(query);
        console.log('✅ Users table created/verified');
        
        // Add role column if it doesn't exist (for existing tables)
        try {
            await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT \'employee\';');
            console.log('✅ Role column added/verified');
        } catch (error) {
            // Column might already exist, that's okay
            console.log('ℹ️ Role column already exists or error adding:', error.message);
        }
    } catch (error) {
        console.error('❌ Error creating users table:', error);
    }
};

// Initialize database
const initializeDatabase = async () => {
    try {
        await createUsersTable();
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
};

module.exports = { pool, initializeDatabase };
