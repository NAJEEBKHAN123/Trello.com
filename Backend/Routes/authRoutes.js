const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers } = require('../Controller/authController');
const { authMiddleware, hasRole } = require('../middleware/authMiddleware');

// ✅ Signup should NOT require authentication
router.post('/signup', signup); 

// ✅ Login should NOT require authentication
router.post('/login', login);

// ✅ Admin Dashboard (Admins only)
router.get('/admin-dashboard', authMiddleware, hasRole('admin'), (req, res) => {
    res.json({ success: true, message: "Welcome to Admin Dashboard" });
});

// ✅ User Dashboard (All authenticated users)
router.get('/user-dashboard', authMiddleware, (req, res) => {
    res.json({ success: true, message: `Welcome ${req.user.username}`, user: req.user });
});

// ✅ Get all users (Only Admins & Moderators can access)
// ✅ Get all users (Only Admins & Moderators can access)
router.get('/users', getAllUsers);


module.exports = router;
