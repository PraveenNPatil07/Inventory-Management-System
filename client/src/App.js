import React, { useState, createContext, } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';

import './App.css';
import Dashboard from './components/Dashboard';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
   
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;