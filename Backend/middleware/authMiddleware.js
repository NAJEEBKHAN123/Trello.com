const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        // Check if token exists and has the correct format
        if (!token || !req.headers.authorization?.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token format" });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password'); // Exclude password from user data

        // If user not found, return unauthorized error
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        // Attach user data to request object
        req.user = user;
        console.log(`User ${user.id} authenticated successfully`);
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);

        // Handling token expiration specifically
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        }

        // Handling any other JWT-related errors
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

// Middleware to check user roles
const hasRole = (...roles) => {
    return (req, res, next) => {
        // If the user's role is not in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `Access denied. Only ${roles.join(", ")} are allowed.` });
        }

        // Proceed if role matches
        next();
    };
};

module.exports = { authMiddleware, hasRole };
