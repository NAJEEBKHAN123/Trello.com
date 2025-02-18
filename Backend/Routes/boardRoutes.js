const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { createBoard, getBoards, getBoardById, deleteBoard } = require('../Controller/boardController');

// Define routes
router.post('/createBoards', authMiddleware, createBoard);  // Protected route to create boards
router.get('/getAllBoards', authMiddleware, getBoards);     // Protected route to get all boards
router.get('/getBoardById/:id', authMiddleware, getBoardById);  // Protected route to get a specific board by ID
router.delete('/deleteBoard/:id', authMiddleware, deleteBoard);  // Protected route to delete a board by ID

module.exports = router;
