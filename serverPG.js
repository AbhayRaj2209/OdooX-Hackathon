// serverPG.js - PostgreSQL version
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const { initializeDatabase } = require('./database');
const User = require('./UserPG'); // PostgreSQL User model

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
initializeDatabase();

// --- API Routes ---

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, role = 'employee' } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create(email, hashedPassword, role);

        res.status(201).json({ 
            message: 'User created successfully! You can now log in.',
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ 
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// Get user by email endpoint
app.get('/api/user/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error while fetching user.' });
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

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email.' });
        }

        // Generate a simple 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        
        console.log('Generated OTP:', otp);
        console.log('OTP Expiry:', otpExpiry);
        
        // Store the OTP and expiry in database
        await User.updateOTP(email, otp, otpExpiry);

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

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if OTP has expired
        if (new Date() > user.otp_expiry) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }


        // Simple OTP verification
        console.log('Debug OTP Info:', {
            userOTP: otp,
            storedOTP: user.otp_secret,
            expiry: user.otp_expiry,
            isExpired: new Date() > user.otp_expiry
        });

        // Check if OTP matches
        if (user.otp_secret !== otp) {
            return res.status(400).json({ 
                message: 'Invalid OTP.',
                debug: {
                    expectedOTP: user.otp_secret,
                    receivedOTP: otp
                }
            });
        }

        // Clear OTP data after successful verification
        await User.clearOTP(email);

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

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(email, hashedPassword);

        res.status(200).json({ message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (error) {
        console.error('Error in password reset:', error);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
});

// Debug endpoint to test OTP generation
app.get('/api/debug-otp/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        
        // Store OTP
        await User.updateOTP(email, otp, otpExpiry);
        
        // Get updated user data
        const updatedUser = await User.findByEmail(email);
        
        res.json({
            message: 'OTP generated for testing',
            otp: otp,
            storedOTP: updatedUser.otp_secret,
            expiry: updatedUser.otp_expiry,
            match: otp === updatedUser.otp_secret
        });
    } catch (error) {
        console.error('Debug OTP error:', error);
        res.status(500).json({ message: 'Debug error', error: error.message });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
    console.log('📊 Using PostgreSQL database');
    console.log(`🔧 Debug endpoint: http://localhost:${PORT}/api/debug-otp/your-email@example.com`);
});
