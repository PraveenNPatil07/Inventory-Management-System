import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Login from './components/Login'; // Corrected import path
import Register from './components/Register'; // Corrected import path
import Dashboard from './components/Dashboard'; // Corrected import path and component name

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    withCredentials: true
                });
                if (res.data.success) {
                    setUser(res.data.user);
                }
            } catch (error) {
                setUser(null);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.get('http://localhost:5000/server/auth/signout', {
                withCredentials: true
            });
            setUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="loading-screen">Checking authentication...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};


function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        <Route
                            path="/dashboard/*"
                            element={
                                <PrivateRoute allowedRoles={['admin', 'staff']}>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />

                        <Route path="/unauthorized" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>You are not authorized to view this page.</h2>} />
                        
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;