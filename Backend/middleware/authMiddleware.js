const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized: Missing or malformed token" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};


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



