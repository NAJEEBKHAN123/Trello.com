const Board = require('../model/Board');
const User = require('../model/usermodel');

const createBoard = async (req, res) => {
    try {
        const { title, description, members } = req.body;

        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        const owner = req.user.id;

        // Validate required fields
        if (!title) {
            return res.status(400).json({ 
                success: false, 
                message: "Board title is required" 
            });
        }

        // Ensure the owner is always included in the members array
        const boardMembers = members ? [...new Set([...members, owner])] : [owner];

        // Validate members (optional)
        if (boardMembers.length > 0) {
            const validMembers = await User.find({ _id: { $in: boardMembers } });
            if (validMembers.length !== boardMembers.length) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid member IDs provided" 
                });
            }
        }

        // Create the board
        const newBoard = new Board({
            title,
            description,
            owner,
            members: boardMembers,
        });

        // Save the board to the database
        await newBoard.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: "Board created successfully",
            data: newBoard,
        });
    } catch (error) {
        console.error("Error creating board:", error);

        // Handle specific errors
        if (error.name === "ValidationError") {
            return res.status(400).json({ 
                success: false, 
                message: "Validation error", 
                error: error.message 
            });
        }

        // Generic error response
        res.status(500).json({ 
            success: false, 
            message: "Error creating board", 
            error: error.message 
        });
    }
};

const getBoards = async (req, res) => {
    try {
        // Fetch boards where the authenticated user is a member
        const boards = await Board.find({ members: req.user.id }).populate('owner', 'username email');

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Fetched all boards",
            data: boards,
        });
    } catch (error) {
        console.error("Error fetching boards:", error);
        res.status(500).json({ success: false, message: "Error fetching boards", error });
    }
};

const getBoardById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the board by ID and populate owner and members
        const board = await Board.findById(id)
            .populate('owner', 'username email')
            .populate('members', 'username email');

        // Check if the board exists
        if (!board) {
            return res.status(404).json({ success: false, message: "Board not found" });
        }

        // Check if the authenticated user is a member of the board
        const isMember = board.members.some(member => member._id.toString() === req.user.id);
        if (!isMember) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Fetched board successfully",
            data: board,
        });
    } catch (error) {
        console.error("Error fetching board:", error);
        res.status(500).json({ success: false, message: "Error fetching board", error });
    }
};

const udpateBoard = async (req, res) => {
    const { id } = req.params;
    const { title, description, members } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).json({
                success: false,
                message: "Board not found"
            });
        }
        if (board.owner.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied: Only the owner or admin can update the board" 
            });
        }
        if (title) board.title = title;
        if (description) board.description = description;
        if (members) board.members = members;

        await board.save();

        res.status(200).json({
            success: true,
            message: "Board updated successfully",
            data: board
        });
    } catch (error) {
        console.error("Error updating board:", error);
        res.status(500).json({ success: false, message: "Error updating board", error });
    }
};

const deleteBoard = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // Find the board by ID
        const board = await Board.findById(id);

        // Check if the board exists
        if (!board) {
            return res.status(404).json({ 
                success: false, 
                message: "Board not found" 
            });
        }

        // Check if the authenticated user is the owner or an admin
        if (board.owner.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied: Only the owner or admin can delete the board" 
            });
        }

        // Delete the board using the static method
        await Board.findByIdAndDelete(id);

        // Send success response
        return res.status(200).json({
            success: true, 
            message: 'Board deleted successfully',
        });
    } catch (error) {
        console.error("Error deleting board:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error deleting board", 
            error: error.message 
        });
    }
};

module.exports = { createBoard, getBoards, getBoardById, deleteBoard, udpateBoard };