const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const DBconnection = require('./config/db');
const authRoutes = require('./Routes/authRoutes');
const boardRoutes = require('./Routes/boardRoutes');
const listRoutes = require('./Routes/listRoutes');
const taskRoutes = require('./Routes/taskRoutes.js');
const moveRoute = require('./Routes/moveRoutes.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
DBconnection();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send("This is the home page");
});

// Correct route prefixes
app.use('/api/auth', authRoutes);
app.use('/api/auth', boardRoutes);
app.use('/api/auth', listRoutes);
app.use('/api/auth', taskRoutes);
app.use('/api/auth', moveRoute);


// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
