import React, { useState, useContext } from 'react'; // Import useContext
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { AuthContext } from '../App.js'; // Import AuthContext from App.js

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login: authLogin } = useContext(AuthContext); // Get the login function from AuthContext

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
        setError(null); // Clear error when user starts typing again
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Clear previous errors

        // Basic client-side validation
        if (!formData.email.trim() || !formData.password.trim()) {
            setError('Please enter both email and password.');
            setLoading(false);
            return;
        }

        try {
            // Use axios for the API call, crucial for cookie handling withCredentials
            const res = await axios.post('http://localhost:3000/server/auth/signin', formData, {
                withCredentials: true // This ensures cookies are sent and received
            });

            // If the request was successful, the backend's `signin` controller
            // would have set the HttpOnly cookie and sent back user data in the JSON response.
            // We'll use this user data to update our AuthContext.
            authLogin(res.data.user); // Dispatch loginSuccess by updating AuthContext
            
            // Redirect to the dashboard or home page after successful login
            navigate('/dashboard'); // Changed from '/' to '/dashboard' as per our routing plan

        } catch (err) {
            console.error('Login error:', err.response ? err.response.data : err.message);
            // Display error message from backend if available, otherwise a generic one
            setError(err.response && err.response.data.message ? err.response.data.message : 'Login failed. Please try again.');
        } finally {
            setLoading(false); // Always set loading to false after attempt
        }
    };

    return (
        <div className='auth-container'> {/* Replaced p-3 max-w-lg mx-auto */}
            <h1 className='auth-title'>Sign In</h1> {/* Replaced text-3xl text-center font-semibold my-7 */}
            <form onSubmit={handleSubmit} className='auth-form'> {/* Replaced flex flex-col gap-4 */}
                <input
                    type='email'
                    placeholder='Email'
                    className='form-input' 
                    id='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    className='form-input'
                    id='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button
                    type='submit'
                    disabled={loading}
                    className='auth-button' /* Replaced bg-slate-700 ... */
                >
                    {loading ? 'Logging in...' : 'Sign In'}
                </button>
            </form>

            <div className='auth-links-container'> {/* Replaced flex gap-2 mt-5 */}
                <p>Don’t have an account?</p>
                <Link to={'/register'}> {/* Changed to /register as per our routing */}
                    <span className='auth-link'>Sign Up</span> {/* Replaced text-blue-700 */}
                </Link>
            </div>

            {error && <p className='auth-error-message'>{error}</p>} {/* Replaced text-red-500 mt-5 */}
        </div>
    );
}