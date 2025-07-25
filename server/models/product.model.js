// server/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    SKU: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    barcode: { // Optional, can be unique or not
        type: String,
        unique: true,
        sparse: true, // Allows null values to not violate unique constraint
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    threshold: { // For low stock alerts (stretch goal)
        type: Number,
        min: [0, 'Threshold cannot be negative'],
        default: 10
    },
    expiryDate: {
        type: Date
    }
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.model('Product', ProductSchema);