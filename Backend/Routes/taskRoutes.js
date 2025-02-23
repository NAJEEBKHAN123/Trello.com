const express = require('express');
const router = express.Router();
const { createTask, updateTask, getTask, deleteTask, getTasksByList } = require('../Controller/taskController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Create a new task
router.post('/createTask', authMiddleware, createTask);

// Update a task
router.put('/updateTask/:taskId', authMiddleware, updateTask);

// Get a single task by taskId
router.get('/getTask/:taskId', authMiddleware, getTask);

// ✅ Get all tasks for a list by listId (Fix)
router.get('/getTasksByList/:listId', authMiddleware, getTasksByList);

// Delete a task
router.delete('/deleteTask/:taskId', authMiddleware, deleteTask);

module.exports = router;
