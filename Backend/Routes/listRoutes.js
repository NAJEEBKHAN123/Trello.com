const express = require('express');
const router = express.Router();
const {
  createList,
  getListsByBoard,
  updateLists,
  deleteList,
} = require('../Controller/listController');

// Create a new list
router.post('/lists', createList);

// Get all lists for a specific board
router.get('/boards/:boardId/lists', getListsByBoard);

// Update a specific list
router.put('/lists/:listId', updateLists);

// Delete a specific list
router.delete('/lists/:listId', deleteList);

module.exports = router;