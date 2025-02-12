const express = require('express')
const router = express.Router();
const {createList} = require('../Controller/listController');
const { authMiddleware } = require('../middleware/authMiddleware');



 router.post('/createList',authMiddleware, createList)

module.exports = router
