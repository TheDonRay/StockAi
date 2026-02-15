import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signupage.css';

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.username.trim() || !formData.email.trim() ||
            !formData.password.trim() || !formData.confirmPassword.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Account created successfully! Redirecting...');
                setTimeout(() => navigate('/'), 1500);
            } else {
                setError(data.error || 'Signup failed');
            }
        } catch (err) { 
            console.log('Error sending data to the backend', err); 
            alert('There was an error signing you up'); 
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }

        // Temporary simulation - remove when backend is connected
        setTimeout(() => {
            setLoading(false);
            setSuccess('Account created successfully! Redirecting...');
            setTimeout(() => navigate('/'), 1500);
        }, 1000);
    };

    return (
        <div className="signup-container">
            <div className="signup-left">
                <div className="brand-section">
                    <h1 className="brand-title">Broker</h1>
                    <div className="brand-accent"></div>
                </div>
                <div className="tagline-section">
                    <h2 className="tagline">Start Your</h2>
                    <h2 className="tagline highlight">Investment Journey</h2>
                    <p className="tagline-sub">
                        Invest with confidence. Let AI guide your decisions.
                    </p>
                </div>
                <div className="floating-elements">
                    <div className="float-card card-1">
                        <span className="card-icon">+</span>
                        <span className="card-value green">+12.4%</span>
                    </div>
                    <div className="float-card card-2">
                        <span className="card-icon">$</span>
                        <span className="card-value">AAPL</span>
                    </div>
                    <div className="float-card card-3">
                        <span className="card-icon">~</span>
                        <span className="card-value green">+8.2%</span>
                    </div> 
                    <div className="float-card card-4">
                        <span className="card-icon">$</span>
                        <span className="card-value">NFLX</span>
                    </div>
                    <div className="float-card card-5">
                        <span className="card-icon">$</span>
                        <span className="card-value">ABNB</span>
                    </div>
                    <div className="float-card card-6">
                        <span className="card-icon">$</span>
                        <span className="card-value"> TSLA</span>
                    </div>
                </div>
            </div>

            <div className="signup-right">
                <div className="signup-card">
                    <h2 className="signup-title">Create Account</h2>
                    <p className="signup-subtitle">Start analyzing stocks in minutes</p>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="signup-input"
                                disabled={loading}
                            />
                            <span className="input-icon">@</span>
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                className="signup-input"
                                disabled={loading}
                            />
                            <span className="input-icon">✉</span>
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="signup-input"
                                disabled={loading}
                            />
                            <span className="input-icon">◆</span>
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="signup-input"
                                disabled={loading}
                            />
                            <span className="input-icon">◆</span>
                        </div>

                        <button
                            type="submit"
                            className="signup-btn primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="spinner"></span>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <div className="divider">
                            <span>or</span>
                        </div>

                        <button
                            type="button"
                            className="signup-btn secondary"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Back to Login
                        </button>
                    </form>

                    <p className="terms-text">
                        By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
