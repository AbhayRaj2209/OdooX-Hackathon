// Script to add your email as admin user
require('dotenv').config();
const bcrypt = require('bcrypt');
const { initializeDatabase } = require('./database');
const User = require('./UserPG');

async function addAdminUser() {
    try {
        // Initialize database connection
        await initializeDatabase();
        
        const adminEmail = 'abhayraj3051@gmail.com';
        const adminPassword = 'admin123';
        
        // Check if user already exists
        const existingUser = await User.findByEmail(adminEmail);
        if (existingUser) {
            console.log('✅ User already exists:', adminEmail);
            console.log('Current role:', existingUser.role);
            
            // Update role to admin if not already
            if (existingUser.role !== 'admin') {
                const { pool } = require('./database');
                await pool.query('UPDATE users SET role = $1 WHERE email = $2', ['admin', adminEmail]);
                console.log('✅ Updated user role to admin');
            }
            return;
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        
        // Create admin user
        const adminUser = await User.create(adminEmail, hashedPassword, 'admin');
        
        console.log('✅ Admin user created successfully!');
        console.log('Email:', adminUser.email);
        console.log('Role:', adminUser.role);
        console.log('ID:', adminUser.id);
        console.log('Created at:', adminUser.created_at);
        console.log('\n🔐 Admin Login Credentials:');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        console.log('\n✅ You can now login with these credentials!');
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        process.exit(0);
    }
}

// Run the script
addAdminUser();
