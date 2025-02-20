const User = require('../model/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       let userRole = role === 'admin' ? "admin" : "user";

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: userRole,
        });

        await user.save();
        return res.status(201).json({ success: true, message: "User registered successfully", data: user });

    } catch (error) {
        console.error("Error in user signup:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};





const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// ✅ Admin-only route to fetch all users
const getAllUsers =  async (req, res) => {
    try {
      const user = await User.findById(req.user.id); // ✅ Get only the logged-in user
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, data: user }); // ✅ Send a single user object, not an array
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

module.exports = { signup, login, getAllUsers };
