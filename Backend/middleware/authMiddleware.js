const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token || !req.headers.authorization?.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        req.user = user;
        console.log(`User ${user.id} authenticated successfully`);
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        }

        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `Access denied. Only ${roles.join(", ")} are allowed.` });
        }
        next();
    };
};

module.exports = { authMiddleware, hasRole };
