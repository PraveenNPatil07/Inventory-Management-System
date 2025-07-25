// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils/error');

const protect = (req, res, next) => {

    console.log("I am here ");
    let token;
    if (req.cookies.access_token) { // Use 'access_token' matching your cookie name
        token = req.cookies.access_token;
    }

    if (!token) {
        return next(errorHandler(401, 'Not authorized, no token.'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded; // Attach user info (id, role) to the request
        next();
    } catch (error) {
        next(errorHandler(401, 'Not authorized, token failed.'));
    }
};

const authorizeRoles = (...roles ) => {

    console.log("i am here  now in authorize rules")
    
    console.log("woo")
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(errorHandler(403, `User role ${req.user.role || 'unknown'} is not authorized to access this route.`));
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };