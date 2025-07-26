import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function AddProduct({ editMode = false }) {
    const [formData, setFormData] = useState({
        SKU: '', name: '', barcode: '', category: '',
        stock: 0, threshold: 10, expiryDate: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [messageClass, setMessageClass] = useState('status-message'); // For styling success/error messages
    const navigate = useNavigate();
    const { id } = useParams(); // For edit mode, gets the product ID from URL

    // Effect to fetch product data if in editMode
    useEffect(() => {
        if (editMode && id) {
            const fetchProduct = async () => {
                try {
                    const res = await axios.get(`http://localhost:3000/server/product/getProduct/${id}`, { // Corrected endpoint
                        withCredentials: true
                    });
                    const productData = res.data;
                    setFormData({
                        SKU: productData.SKU,
                        name: productData.name,
                        barcode: productData.barcode || '', // Handle null/undefined barcode
                        category: productData.category,
                        stock: productData.stock,
                        threshold: productData.threshold,
                        expiryDate: productData.expiryDate ? new Date(productData.expiryDate).toISOString().split('T')[0] : '', // Format date for input type="date"
                    });
                } catch (err) {
                    console.error('Error fetching product for edit:', err.response ? err.response.data : err.message);
                    setMessage(err.response && err.response.data.message ? err.response.data.message : 'Failed to load product for editing.');
                    setMessageClass('status-message error');
                    navigate('/dashboard/products'); // Redirect to list if product not found or error
                }
            };
            fetchProduct();
        }
    }, [editMode, id, navigate]); // Dependencies for useEffect

    // Destructure formData for easier access in JSX
    const { SKU, name, barcode, category, stock, threshold, expiryDate } = formData;

    // Handle input changes
    const onChange = (e) => {
        let value = e.target.value;
        // Convert stock/threshold to number if they are number inputs
        if (e.target.name === 'stock' || e.target.name === 'threshold') {
            value = parseInt(value);
            if (isNaN(value)) value = ''; // Allow empty string momentarily during typing for better UX
        }
        setFormData({ ...formData, [e.target.name]: value });
        // Clear specific error and general message on change
        if (errors[e.target.name]) { setErrors({ ...errors, [e.target.name]: '' }); }
        setMessage('');
        setMessageClass('status-message');
    };

    // Client-side form validation
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!SKU.trim()) { newErrors.SKU = 'SKU is required'; isValid = false; }
        if (!name.trim()) { newErrors.name = 'Product name is required'; isValid = false; }
        if (!category.trim()) { newErrors.category = 'Category is required'; isValid = false; }
        
        if (stock === '' || stock === null || isNaN(stock)) { newErrors.stock = 'Stock is required and must be a number'; isValid = false; }
        else if (stock < 0) { newErrors.stock = 'Stock cannot be negative'; isValid = false; }

        if (threshold !== '' && threshold !== null && isNaN(threshold)) { newErrors.threshold = 'Threshold must be a number'; isValid = false; }
        else if (threshold !== '' && threshold !== null && threshold < 0) { newErrors.threshold = 'Threshold cannot be negative'; isValid = false; }

        if (expiryDate) {
            const date = new Date(expiryDate);
            if (isNaN(date.getTime())) {
                newErrors.expiryDate = 'Invalid date format'; isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        setMessageClass('status-message');

        if (!validateForm()) {
            return; // Stop if validation fails
        }

        try {
            const payload = { ...formData };
            // Clean up empty optional fields for backend
            if (payload.expiryDate === '') delete payload.expiryDate;
            if (payload.barcode === '') delete payload.barcode;
            if (payload.threshold === '') payload.threshold = 10; // Default if left empty on frontend

            let res;
            if (editMode) {
                // Update existing product
                res = await axios.put(`http://localhost:3000/server/product/updateProd/${id}`, payload, { // Corrected endpoint
                    withCredentials: true
                });
                setMessage('Product updated successfully!');
                setMessageClass('status-message success');
            } else {
                // Add new product
                res = await axios.post('http://localhost:3000/server/product/createProd', payload, { // Corrected endpoint
                    withCredentials: true
                });
                setMessage('Product added successfully!');
                setMessageClass('status-message success');
                // Clear form after successful add
                setFormData({ SKU: '', name: '', barcode: '', category: '', stock: 0, threshold: 10, expiryDate: '' });
            }
            // Redirect to product list after a short delay
            setTimeout(() => navigate('/dashboard/products'), 1500);

        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            setMessage(err.response && err.response.data.message ? err.response.data.message : 'Operation failed. Please try again.');
            setMessageClass('status-message error');
        }
    };

    return (
        <div className="product-form-container">
            <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="SKU">SKU</label>
                    <input type="text" id="SKU" name="SKU" value={SKU} onChange={onChange} className={errors.SKU ? 'input-error' : ''} disabled={editMode} />
                    {errors.SKU && <span className="error-message">{errors.SKU}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input type="text" id="name" name="name" value={name} onChange={onChange} className={errors.name ? 'input-error' : ''} />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="barcode">Barcode (Optional)</label>
                    <input type="text" id="barcode" name="barcode" value={barcode} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" name="category" value={category} onChange={onChange} className={errors.category ? 'input-error' : ''} />
                    {errors.category && <span className="error-message">{errors.category}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input type="number" id="stock" name="stock" value={stock} onChange={onChange} className={errors.stock ? 'input-error' : ''} />
                    {errors.stock && <span className="error-message">{errors.stock}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="threshold">Threshold (Optional)</label>
                    <input type="number" id="threshold" name="threshold" value={threshold} onChange={onChange} className={errors.threshold ? 'input-error' : ''} />
                    {errors.threshold && <span className="error-message">{errors.threshold}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date (Optional)</label>
                    <input type="date" id="expiryDate" name="expiryDate" value={expiryDate} onChange={onChange} className={errors.expiryDate ? 'input-error' : ''} />
                    {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                </div>
                <button type="submit">{editMode ? 'Update Product' : 'Add Product'}</button>
                {message && <p className={messageClass}>{message}</p>}
            </form>
        </div>
    );
}

export default AddProduct;