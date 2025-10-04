// Environment configuration for admin access
const config = {
  // Admin credentials from environment variables
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'admin@company.com',
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',
  
  // API configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // App configuration
  appName: import.meta.env.VITE_APP_NAME || 'ExpenseFlow',
  companyName: import.meta.env.VITE_COMPANY_NAME || 'Your Company',
  
  // Feature flags
  enableOCR: import.meta.env.VITE_ENABLE_OCR === 'true' || false,
  enableEmailNotifications: import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS === 'true' || true,
};

export default config;
