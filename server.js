// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');

// Initialize email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const app = express();
const PORT = 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL (Neon)'))
    .catch((err) => console.error('Error connecting to PostgreSQL:', err));

// --- API Routes ---

// UPDATED: Signup endpoint (no email sending)
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const result = await pool.query(
            'INSERT INTO users (email, password, role, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [email, hashedPassword, 'employee']
        );

        res.status(201).json({ message: 'User created successfully! You can now log in.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
});

// UPDATED: Login endpoint (no verification check)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ 
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// --- Forgot Password Routes ---

// Send OTP for password reset
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found with this email.' });
        }

        const user = result.rows[0];
        
        // Reuse existing secret if not expired, else generate new
        let otpSecret = user.otp_secret;
        let otpExpiry = user.otp_expiry;
        const now = new Date();
        if (!otpSecret || !otpExpiry || now > new Date(otpExpiry)) {
            // Generate new secret and expiry
            const secret = speakeasy.generateSecret({
                name: 'Password Reset',
                issuer: 'Your App'
            });
            otpSecret = secret.base32;
            otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
            
            // Update user with new OTP data
            await pool.query(
                'UPDATE users SET otp_secret = $1, otp_expiry = $2 WHERE email = $3',
                [otpSecret, otpExpiry, email]
            );
        }

            // Generate OTP using the (possibly reused) secret
            const otp = speakeasy.totp({
                secret: otpSecret,
                encoding: 'base32',
                step: 300 // 5 minutes
            });

            // Send OTP via Email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset OTP',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4f46e5;">Password Reset Request</h2>
                        <p>You have requested to reset your password. Use the following OTP code:</p>
                        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                        </div>
                        <p><strong>This code will expire in 5 minutes.</strong></p>
                        <p>If you didn't request this password reset, please ignore this email.</p>
                        <hr style="margin: 20px 0;">
                        <p style="color: #6b7280; font-size: 14px;">This is an automated message. Please do not reply to this email.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ 
                message: 'OTP sent successfully to your email address.',
                email: email // Return email for verification step
            });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ message: 'Server error during forgot password process.' });
    }
});

// Verify OTP
app.post('/api/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required.' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = result.rows[0];

        // Check if OTP has expired
        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Debug logging
        console.log('--- OTP Verification Debug ---');
        console.log('User email:', email);
        console.log('User.otp_secret:', user.otp_secret);
        console.log('Entered OTP:', otp);
        console.log('User.otp_expiry:', user.otp_expiry);
        console.log('Current server time:', new Date());

        // Verify OTP using speakeasy
        const verified = speakeasy.totp.verify({
            secret: user.otp_secret,
            encoding: 'base32',
            token: otp,
            window: 1, // Allow 1 step tolerance
            step: 300 // 5 minutes, must match generation
        });

        console.log('OTP verified result:', verified);

        if (!verified) {
            console.log('OTP verification failed.');
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Clear OTP data after successful verification
        await pool.query(
            'UPDATE users SET otp_secret = NULL, otp_expiry = NULL WHERE email = $1',
            [email]
        );

        res.status(200).json({ 
            message: 'OTP verified successfully. You can now reset your password.',
            email: email
        });
    } catch (error) {
        console.error('Error in OTP verification:', error);
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
});

// Reset password
app.post('/api/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required.' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password = $1 WHERE email = $2',
            [hashedPassword, email]
        );

        res.status(200).json({ message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (error) {
        console.error('Error in password reset:', error);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(` Backend server is running on http://localhost:${PORT}`);
});
