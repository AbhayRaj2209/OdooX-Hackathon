const { pool } = require('./database');

class User {
    // Create a new user
    static async create(email, password, role = 'employee') {
        try {
            const query = `
                INSERT INTO users (email, password, role) 
                VALUES ($1, $2, $3) 
                RETURNING id, email, role, created_at
            `;
            const result = await pool.query(query, [email, password, role]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const result = await pool.query(query, [email]);
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Update user's OTP secret and expiry
    static async updateOTP(email, otpSecret, otpExpiry) {
        try {
            const query = `
                UPDATE users 
                SET otp_secret = $1, otp_expiry = $2, updated_at = CURRENT_TIMESTAMP 
                WHERE email = $3
            `;
            await pool.query(query, [otpSecret, otpExpiry, email]);
        } catch (error) {
            throw error;
        }
    }

    // Update user's password
    static async updatePassword(email, newPassword) {
        try {
            const query = `
                UPDATE users 
                SET password = $1, updated_at = CURRENT_TIMESTAMP 
                WHERE email = $2
            `;
            await pool.query(query, [newPassword, email]);
        } catch (error) {
            throw error;
        }
    }

    // Clear OTP data
    static async clearOTP(email) {
        try {
            const query = `
                UPDATE users 
                SET otp_secret = NULL, otp_expiry = NULL, updated_at = CURRENT_TIMESTAMP 
                WHERE email = $1
            `;
            await pool.query(query, [email]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
