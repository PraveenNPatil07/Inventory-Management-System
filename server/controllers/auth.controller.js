const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils/error')// Adjust path as needed

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


const generateTokenAndSetCookie = (user, statusCode, res) => {
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 3600000
    });

    const { password: pass, ...rest } = user._doc;

    res.status(statusCode).json({
        success: true,
        user: rest
    });
};

const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(errorHandler(400, 'Please enter both email and password.'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'Invalid credentials!'));
        }

        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, 'Invalid credentials!'));
        }

        generateTokenAndSetCookie(validUser, 200, res);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    signin
    
};