const List = require('../model/listModel');
const Board = require('../model/Board');

const createList = async (req, res) => {
    const { title, boardId } = req.body;

    // Basic validation
    if (!title || !boardId) {
        return res.status(400).json({
            success: false,
            message: "Title and boardId are required"
        });
    }

    try {
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({
                success: false,
                message: "Board not found"
            });
        }

        const newList = new List({ title, board: boardId });
        await newList.save();

        board.lists.push(newList._id);
        await board.save();

        return res.status(200).json({
            success: true,
            message: "New list created successfully",
            data: newList // Return the newly created list instead of the entire board
        });
    } catch (error) {
        console.error('Error creating list:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating list', 
            error: error.message 
        });
    }
};

module.exports = { createList };