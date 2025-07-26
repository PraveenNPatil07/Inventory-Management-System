import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Access user role from AuthContext

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Get user object from context for role checks

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/server/product/getProducts', { // Corrected endpoint as per your router
                withCredentials: true // Send auth cookie
            });
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err.response ? err.response.data : err.message);
            setError('Failed to fetch products. Please try again.');
            setLoading(false);
            // Redirect to login if unauthorized or forbidden
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []); // Fetch products on component mount

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }
        try {
            // Check if user is an admin before attempting delete
            if (!user || user.role !== 'admin') {
                alert('You do not have permission to delete products.');
                return;
            }
            
            await axios.delete(`http://localhost:3000/server/product/deleteProd/${id}`, { // Corrected endpoint
                withCredentials: true
            });
            setProducts(products.filter(product => product._id !== id)); // Remove deleted product from state
            alert('Product deleted successfully!');
        } catch (err) {
            console.error('Error deleting product:', err.response ? err.response.data : err.message);
            alert(err.response && err.response.data.message ? err.response.data.message : 'Failed to delete product.');
        }
    };

    // Conditional rendering for loading, error, and no products
    if (loading) return <p className="status-message">Loading products...</p>;
    if (error) return <p className="status-message error">{error}</p>;
    if (products.length === 0) return <p className="status-message">No products found. Add some!</p>;

    return (
        <div className="product-list-container">
            <h2>Product Dashboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Threshold</th>
                        <th>Expiry Date</th>
                        {/* Only show Actions column if user is admin */}
                        {user && user.role === 'admin' && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.SKU}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.stock}</td>
                            <td>{product.threshold}</td>
                            <td>{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'N/A'}</td>
                            {user && user.role === 'admin' && (
                                <td>
                                    <button className="action-btn edit-btn" onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}>Edit</button>
                                    <button className="action-btn delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;