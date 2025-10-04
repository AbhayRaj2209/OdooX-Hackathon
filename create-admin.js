// Script to create an admin user in the database
require('dotenv').config();
const bcrypt = require('bcrypt');
const { initializeDatabase } = require('./database');
const User = require('./UserPG');

async function createAdminUser() {
    try {
        // Initialize database connection
        await initializeDatabase();
        
        const adminEmail = 'admin@expenseflow.com';
        const adminPassword = 'admin123';
        
        // Check if admin already exists
        const existingAdmin = await User.findByEmail(adminEmail);
        if (existingAdmin) {
            console.log('✅ Admin user already exists:', adminEmail);
            console.log('Role:', existingAdmin.role);
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
        console.log('\n⚠️  Please change the password after first login!');
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        process.exit(0);
    }
}

// Run the script
createAdminUser();
