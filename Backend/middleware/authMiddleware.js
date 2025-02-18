const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Ensure header exists and follows Bearer Token format
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized: Missing or malformed token" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user and exclude password field
        const user = await User.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        req.user = user; // Attach user to request
        console.log(`✅ User ${user.id} authenticated successfully`);

        next();
    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        }

        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

// Middleware to check user roles
const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Your role: ${req.user.role}. Only ${roles.join(", ")} are allowed.`,
            });
        }

        console.log(`✅ Role Check Passed: ${req.user.role} has access`);
        next();
    };
};

module.exports = { authMiddleware, hasRole };
