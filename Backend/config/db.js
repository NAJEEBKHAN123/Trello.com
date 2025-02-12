const mongoose = require('mongoose');
require('dotenv').config();

const DBconnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ DB connected successfully');
    } catch (error) {
        console.error('❌ Error in DB connection:', error.message);
        process.exit(1); // Exit if DB fails
    }
};

module.exports = DBconnection;
