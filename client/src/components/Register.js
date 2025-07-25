import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(''); // For success/error messages
    const [messageClass, setMessageClass] = useState('status-message'); // For styling success/error messages
    const navigate = useNavigate();

    const { username, email, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for the specific field as user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Username validation
        if (!username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters long';
            isValid = false;
        }

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) { // Basic email pattern
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) { // Minimum length as per backend
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Confirm Password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm password is required';
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission and page reload
        setMessage(''); // Clear previous messages
        setMessageClass('status-message'); // Reset message class

        if (!validateForm()) {
            return; // Stop if validation fails
        }

        try {
            // API Endpoint: http://localhost:5000/api/auth/signup
            const res = await axios.post('http://localhost:3000/client/auth/signup', {
                username,
                email,
                password // Only send username, email, password for signup
            });

            console.log('Registration successful:', res.data);
            setMessage('Registration successful! Please login.');
            setMessageClass('status-message success'); // Set to success class
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login'); // Redirect to your login component
            }, 1500); // Redirect after 1.5 seconds

        } catch (err) {
            console.error('Registration error:', err.response ? err.response.data : err.message);
            // Display error message from backend if available, otherwise a generic one
            setMessage(err.response && err.response.data.message ? err.response.data.message : 'Registration failed. Please try again.');
            setMessageClass('status-message error'); // Set to error class
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={onChange}
                        className={errors.username ? 'input-error' : ''}
                    />
                    {errors.username && <span className="error-message">{errors.username}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        className={errors.password ? 'input-error' : ''}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        className={errors.confirmPassword ? 'input-error' : ''}
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
                <button type="submit">Register</button>
                {message && <p className={messageClass}>{message}</p>}
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
}

export default Register;