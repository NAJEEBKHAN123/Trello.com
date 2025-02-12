const express = require('express');
const router = express.Router();
const { createTask, updateTask, getTask, deleteTask } = require('../Controller/taskController');
const { authMiddleware } = require('../middleware/authMiddleware'); // Add authentication middleware

// Create a new task
router.post('/tasks', authMiddleware, createTask);

// Update a task
router.put('/tasks/:taskId', authMiddleware, updateTask);

// Get a task by ID
router.get('/tasks/:taskId', authMiddleware, getTask);

// Delete a task
router.delete('/tasks/:taskId', authMiddleware, deleteTask);

module.exports = router;