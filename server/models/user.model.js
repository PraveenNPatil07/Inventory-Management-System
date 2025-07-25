// server/models/user.model.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true
    },
   role: {
        type: String,
        enum: ['admin', 'staff'], // Define your roles
        default: 'staff'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);