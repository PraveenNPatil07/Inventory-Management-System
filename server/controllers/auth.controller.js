const User = require('../models/user.model'); // No .js extension needed for CommonJS require
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils/error'); // Adjust path as needed

// Your provided signup function:
const signup = async (req, res, next) => {

    console.log(req.body);
    const { username, password, email } = req.body;

    // --- Server-side validation (Add this if not already present in your code) ---
    if (!username || !email || !password) {
        return next(errorHandler(400, 'Please enter all fields.'));
    }
    if (password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters long.'));
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return next(errorHandler(400, 'User already exists with this email.'));
        }
        user = await User.findOne({ username });
        if (user) {
            return next(errorHandler(400, 'Username already taken.'));
        }
        // --- End of server-side validation ---


        const hashpass = bcrypt.hashSync(password, 11); // bcrypt.hashSync is fine for hackathon
        const newUser = new User({ username, password: hashpass, email }); // Default role will apply from schema

        await newUser.save();

   
        const { password: _, ...userWithoutPass } = newUser._doc; // Destructure to exclude password
        res.status(201).json(userWithoutPass);


    } catch (err) {
        next(err); // Pass error to global error handling middleware
    }

}

module.exports = {
    signup,
    
};