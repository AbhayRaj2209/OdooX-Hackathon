# Environment Setup for ExpenseFlow

## Overview
The ExpenseFlow application now uses environment variables for configuration, including admin access credentials. This allows you to customize the application without modifying the code.

## Setup Instructions

### 1. Create Environment File
Create a `.env` file in the frontend directory (`Odoo/frontend/.env`) with the following content:

```env
# Admin Access Credentials
VITE_ADMIN_EMAIL=your-admin@company.com
VITE_ADMIN_PASSWORD=your-secure-password

# API Configuration
VITE_API_URL=http://localhost:5000/api

# Application Configuration
VITE_APP_NAME=ExpenseFlow
VITE_COMPANY_NAME=Your Company Name

# Feature Flags
VITE_ENABLE_OCR=true
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
```

### 2. Customize Your Settings

#### Admin Credentials
- `VITE_ADMIN_EMAIL`: The email address for admin login
- `VITE_ADMIN_PASSWORD`: The password for admin access

#### Company Information
- `VITE_COMPANY_NAME`: Your company name (appears in admin dashboard)
- `VITE_APP_NAME`: Application name (default: ExpenseFlow)

#### API Configuration
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

#### Feature Flags
- `VITE_ENABLE_OCR`: Enable/disable OCR receipt processing
- `VITE_ENABLE_EMAIL_NOTIFICATIONS`: Enable/disable email notifications

### 3. Default Values
If no `.env` file is created, the application will use these default values:
- Admin Email: `admin@company.com`
- Admin Password: `admin123`
- Company Name: `Your Company`
- API URL: `http://localhost:5000/api`

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` files to version control**
2. **Use strong passwords for production**
3. **Change default credentials immediately**
4. **The `.env` file is in `.gitignore` for security**

## How It Works

1. **User Access**: Users can access the application directly without login
2. **Admin Access**: Click "Admin Login" button in the header
3. **Environment-Based**: Admin credentials are loaded from environment variables
4. **No Initial Login Page**: Application starts directly with user dashboard

## File Structure
```
frontend/
├── .env                 # Your environment variables (create this)
├── env.example          # Example environment file
├── src/
│   ├── config/
│   │   └── env.js       # Environment configuration loader
│   └── components/      # React components
```

## Troubleshooting

### Admin Login Not Working
1. Check if `.env` file exists in frontend directory
2. Verify environment variable names start with `VITE_`
3. Restart the development server after creating `.env`
4. Check browser console for any errors

### Environment Variables Not Loading
1. Ensure variables start with `VITE_` prefix
2. Restart the development server
3. Clear browser cache
4. Check for typos in variable names

## Development vs Production

### Development
- Use `env.example` as template
- Create `.env` with your local settings
- Default credentials work for testing

### Production
- Set environment variables on your hosting platform
- Use strong, unique passwords
- Never use default credentials in production
