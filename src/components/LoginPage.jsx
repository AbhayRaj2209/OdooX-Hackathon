import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../LoginPage.css';

// The backend URL
const API_URL = 'http://localhost:5000/api';

const LoginPage = () => {
    const navigate = useNavigate();
    
    // State to toggle between Login, Signup, and Forgot Password views
    const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'forgot-password', 'verify-otp', 'reset-password'

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // For signup form
    const [otp, setOtp] = useState(''); // For OTP verification
    const [newPassword, setNewPassword] = useState(''); // For password reset
    const [confirmNewPassword, setConfirmNewPassword] = useState(''); // For password reset

    // Messaging state
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Admin login state

    // --- Signup Handler ---
    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setIsLoading(true);

        if (password !== confirmPassword) {
            setIsError(true);
            setMessage('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, role: 'employee' });
            setIsError(false);
            setMessage(response.data.message + ' You can now log in.');
            // Switch to login view on successful signup
            setCurrentView('login');
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'Signup failed.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Login Handler ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            
            // Check if user is admin
            const userResponse = await axios.get(`${API_URL}/user/${email}`);
            if (userResponse.data.role === 'admin') {
                setIsError(false);
                setMessage('Admin login successful! Redirecting to admin panel...');
                setTimeout(() => {
                    navigate('/dashboard', { state: { isAdmin: true, adminUser: userResponse.data } });
                }, 1000);
            } else {
                setIsError(false);
                setMessage('Login successful! Redirecting to user dashboard...');
                setTimeout(() => {
                    navigate('/dashboard', { state: { isAdmin: false, user: userResponse.data, hasAdminAccess: false } });
                }, 1000);
            }
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Forgot Password Handler ---
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            setIsError(false);
            setMessage(response.data.message);
            setCurrentView('verify-otp');
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Verify OTP Handler ---
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
            setIsError(false);
            setMessage(response.data.message);
            setCurrentView('reset-password');
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'Invalid OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Reset Password Handler ---
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setIsLoading(true);

        if (newPassword !== confirmNewPassword) {
            setIsError(true);
            setMessage('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/reset-password`, { email, newPassword });
            setIsError(false);
            setMessage(response.data.message);
            setCurrentView('login');
            // Clear form
            setEmail('');
            setPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setOtp('');
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Admin Login Handler ---
    const handleAdminLogin = (adminUser) => {
        setShowAdminLogin(false);
        // Go to user dashboard first, then user can access admin from there
        navigate('/dashboard', { state: { isAdmin: false, user: adminUser, hasAdminAccess: true } });
    };

    // --- Direct User Access Handler (No Authentication) ---
    const handleDirectUserAccess = () => {
        // Create a dummy user object
        const dummyUser = {
            id: 1,
            email: 'user@expenseflow.com',
            name: 'User',
            role: 'employee'
        };
        // Go directly to user dashboard
        navigate('/dashboard', { state: { isAdmin: false, user: dummyUser, hasAdminAccess: false } });
    }; 

    // Get the appropriate form handler based on current view
    const getFormHandler = () => {
        switch (currentView) {
            case 'login':
                return handleLogin;
            case 'signup':
                return handleSignup;
            case 'forgot-password':
                return handleForgotPassword;
            case 'verify-otp':
                return handleVerifyOtp;
            case 'reset-password':
                return handleResetPassword;
            default:
                return handleLogin;
        }
    };

    return (
        <div className="login-page-container">
            {/* The info panel on the left */}
            <div className="info-panel">
                <div className="info-content">
                    <div className="brand-section">
                        <div className="odoo-logo-large">
                            <div className="odoo-logo-text">
                                <span className="odoo-o" style={{color: '#714B67'}}>o</span>
                                <span className="odoo-d" style={{color: '#875A7B'}}>d</span>
                                <span className="odoo-o" style={{color: '#875A7B'}}>o</span>
                                <span className="odoo-o" style={{color: '#875A7B'}}>o</span>
                            </div>
                            <span className="brand-text">ExpenseFlow</span>
                        </div>
                        <div className="project-subtitle">Smart Expense Management</div>
                    </div>
                    
                    <h1>
                        {currentView === 'login' && 'Welcome Back!'}
                        {currentView === 'signup' && 'Join Our Innovation!'}
                        {currentView === 'forgot-password' && 'Forgot Password?'}
                        {currentView === 'verify-otp' && 'Verify Your Identity'}
                        {currentView === 'reset-password' && 'Create New Password'}
                    </h1>
                    <p>
                        {currentView === 'login' && 'Sign in to access your expense management dashboard and streamline your reimbursement process.'}
                        {currentView === 'signup' && 'Create your company account and start managing expenses with intelligent workflows.'}
                        {currentView === 'forgot-password' && 'No worries! Enter your email address and we\'ll send you an OTP to reset your password.'}
                        {currentView === 'verify-otp' && 'We\'ve sent a 6-digit verification code to your email address. Please enter it below.'}
                        {currentView === 'reset-password' && 'You\'re almost done! Enter your new password to complete the reset process.'}
                    </p>
                    
                    <div className="hackathon-info">
                        <div className="info-badge">
                            <span className="badge-icon">💼</span>
                            <span>Enterprise Ready</span>
                        </div>
                    </div>
                </div>
                
                {/* Decorative elements */}
                <div className="panel-decoration">
                    <div className="floating-shape shape-1"></div>
                    <div className="floating-shape shape-2"></div>
                    <div className="floating-shape shape-3"></div>
                </div>
            </div>

            {/* The form panel on the right */}
            <div className="form-panel">
                <div className="form-container">
                    <div className="form-header">
                        <h2>
                            {currentView === 'login' && 'Sign In'}
                            {currentView === 'signup' && 'Create Account'}
                            {currentView === 'forgot-password' && 'Reset Password'}
                            {currentView === 'verify-otp' && 'Enter OTP'}
                            {currentView === 'reset-password' && 'New Password'}
                        </h2>
                        <p className="form-subtitle">
                            {currentView === 'login' && 'Access your hackathon workspace'}
                            {currentView === 'signup' && 'Join the innovation challenge'}
                            {currentView === 'forgot-password' && 'We\'ll help you get back in'}
                            {currentView === 'verify-otp' && 'Check your email for the code'}
                            {currentView === 'reset-password' && 'Choose a strong password'}
                        </p>
                    </div>

                    {message && (
                        <div className={`message ${isError ? 'error' : 'success'}`}>
                            <div className="message-icon">
                                {isError ? '⚠️' : '✅'}
                            </div>
                            <span>{message}</span>
                        </div>
                    )}

                    <form onSubmit={getFormHandler()}>
                        {/* Email field - shown in all views except verify-otp */}
                        {(currentView === 'login' || currentView === 'signup' || currentView === 'forgot-password' || currentView === 'reset-password') && (
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                    <span className="input-icon">📧</span>
                                </div>
                            </div>
                        )}

                        {/* OTP field - shown only in verify-otp */}
                        {currentView === 'verify-otp' && (
                            <div className="form-group">
                                <label htmlFor="otp">Verification Code</label>
                                <div className="input-wrapper">
                                    <input
                                        id="otp"
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="000000"
                                        maxLength="6"
                                        className="otp-input"
                                    />
                                    <span className="input-icon">🔐</span>
                                </div>
                            </div>
                        )}

                        {/* Password field - shown in login, signup, and reset-password */}
                        {(currentView === 'login' || currentView === 'signup' || currentView === 'reset-password') && (
                            <div className="form-group">
                                <label htmlFor="password">
                                    {currentView === 'reset-password' ? 'New Password' : 'Password'}
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={currentView === 'reset-password' ? newPassword : password}
                                        onChange={(e) => currentView === 'reset-password' ? setNewPassword(e.target.value) : setPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <span className="input-icon">🔒</span>
                                </div>
                            </div>
                        )}

                        {/* Confirm Password field - shown in signup and reset-password */}
                        {(currentView === 'signup' || currentView === 'reset-password') && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    {currentView === 'reset-password' ? 'Confirm New Password' : 'Confirm Password'}
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        value={currentView === 'reset-password' ? confirmNewPassword : confirmPassword}
                                        onChange={(e) => currentView === 'reset-password' ? setConfirmNewPassword(e.target.value) : setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <span className="input-icon">🔒</span>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? (
                                <span className="loading-content">
                                    <span className="spinner"></span>
                                    Processing...
                                </span>
                            ) : (
                                <span className="btn-content">
                                    <span>
                                        {currentView === 'login' && 'Sign In to Dashboard'}
                                        {currentView === 'signup' && 'Create My Account'}
                                        {currentView === 'forgot-password' && 'Send Reset Code'}
                                        {currentView === 'verify-otp' && 'Verify Code'}
                                        {currentView === 'reset-password' && 'Update Password'}
                                    </span>
                                    <span className="btn-icon">→</span>
                                </span>
                            )}
                        </button>
                    </form>

                    {/* --- Navigation buttons --- */}
                    <div className="form-navigation">
                        {currentView === 'login' && (
                            <>
                                <button 
                                    type="button" 
                                    className="nav-btn secondary"
                                    onClick={() => setCurrentView('signup')}
                                >
                                    <span>New to hackathon?</span>
                                    <strong>Create Account</strong>
                                </button>
                                <button 
                                    type="button" 
                                    className="nav-btn link"
                                    onClick={() => setCurrentView('forgot-password')}
                                >
                                    Forgot your password?
                                </button>
                                <button 
                                    type="button" 
                                    className="nav-btn admin"
                                    onClick={handleDirectUserAccess}
                                >
                                    <span>👤</span>
                                    <strong>User Access</strong>
                                </button>
                            </>
                        )}
                        {currentView === 'signup' && (
                            <button 
                                type="button" 
                                className="nav-btn secondary"
                                onClick={() => setCurrentView('login')}
                            >
                                <span>Already have an account?</span>
                                <strong>Sign In</strong>
                            </button>
                        )}
                        {(currentView === 'forgot-password' || currentView === 'verify-otp' || currentView === 'reset-password') && (
                            <button 
                                type="button" 
                                className="nav-btn link"
                                onClick={() => setCurrentView('login')}
                            >
                                ← Back to Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
