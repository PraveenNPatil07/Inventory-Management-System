import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Correct path to AuthContext

import ProductList from '../components/ProductList'; // Import ProductList
import AddProduct from '../components/AddProduct';   // Import AddProduct
// import InventoryLogs from '../Inventory/InventoryLogs'; // Keep this commented for now, for later

function Dashboard() {
    const { user, logout: authLogout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authLogout();
        navigate('/login');
    };

    if (!user) {
        return <p className="loading-screen">Redirecting to login...</p>; // Use a styled message
    }

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <h3>Inventory Hub</h3>
                <ul>
                    <li><Link to="/dashboard/products">Products</Link></li>
                    {/* Show 'Add Product' link only if user is an admin */}
                    {user.role === 'admin' && (
                        <li><Link to="/dashboard/products/add">Add Product</Link></li>
                    )}
                    {/* Add Inventory Logs link here later */}
                    {/* <li><Link to="/dashboard/logs">Inventory Logs</Link></li> */}
                    <li>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </li>
                </ul>
            </nav>
            <main className="main-content">
                <header className="dashboard-header">
                    <h1>Welcome, {user.username}!</h1>
                    <p>Role: {user.role}</p>
                </header>
                <div className="dashboard-body">
                    <Routes>
                        {/* Route for Product List */}
                        <Route path="products" element={<ProductList />} />
                        {/* Route for Add Product Form */}
                        <Route path="products/add" element={<AddProduct />} />
                        {/* Route for Edit Product Form, passes editMode prop */}
                        <Route path="products/edit/:id" element={<AddProduct editMode={true} />} />
                        {/* Add Route for Inventory Logs here later */}
                        {/* <Route path="logs" element={<InventoryLogs />} /> */}
                        {/* Default content for dashboard if no sub-route matches */}
                        <Route path="*" element={<h2>Select an option from the sidebar</h2>} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;