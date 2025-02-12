const List = require("../model/listModel");
const Board = require("../model/Board");

// Create a new list
const createList = async (req, res) => {
  const { title, boardId } = req.body;

  // Basic validation
  if (!title || !boardId) {
    return res.status(400).json({
      success: false,
      message: "Title and boardId are required",
    });
  }

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    const newList = new List({ title, board: boardId });
    await newList.save();

    board.lists.push(newList._id);
    await board.save();

    return res.status(200).json({
      success: true,
      message: "New list created successfully",
      data: newList, // Return the newly created list
    });
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({
      success: false,
      message: "Error creating list",
      error: error.message,
    });
  }
};

// Get lists by board ID
const getListsByBoard = async (req, res) => {
  const { boardId } = req.params;

  try {
    const board = await Board.findById(boardId).populate("lists");
    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Board fetched successfully",
      data: board,
    });
  } catch (error) {
    console.error("Error fetching list:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching list",
      error: error.message,
    });
  }
};

// Update a list
const updateLists = async (req, res) => {
  const { listId } = req.params;
  const { title } = req.body;

  try {
    const updatedList = await List.findByIdAndUpdate(
      listId,
      { title },
      { new: true } // Return the updated document
    );

    if (!updatedList) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "List updated successfully",
      data: updatedList, // Return the updated list
    });
  } catch (error) {
    console.error("Error updating list:", error);
    res.status(500).json({
      success: false,
      message: "Error updating list",
      error: error.message,
    });
  }
};

// Delete a list
const deleteList = async (req, res) => {
  const { listId } = req.params;

  try {
    const deletedList = await List.findByIdAndDelete(listId);

    if (!deletedList) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    // Remove the list ID from the board's lists array
    const board = await Board.findById(deletedList.board);
    if (board) {
      board.lists = board.lists.filter(
        (id) => id.toString() !== listId.toString()
      );
      await board.save();
    }

    return res.status(200).json({
      success: true,
      message: "List deleted successfully",
      data: deletedList, // Return the deleted list
    });
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting list",
      error: error.message,
    });
  }
};

module.exports = { createList, getListsByBoard, updateLists, deleteList };