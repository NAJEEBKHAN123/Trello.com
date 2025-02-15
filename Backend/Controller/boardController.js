const mongoose = require('mongoose');
const Board = require('../model/Board');
const User = require('../model/usermodel');

const createBoard = async (req, res) => {
    try {
        const { title, description, members } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const owner = req.user.id;

        if (!title) {
            return res.status(400).json({ success: false, message: "Board title is required" });
        }

        const boardMembers = members ? [...new Set([...members, owner])] : [owner];

        if (boardMembers.length > 0) {
            const validMembers = await User.find({ _id: { $in: boardMembers } });
            if (validMembers.length !== boardMembers.length) {
                return res.status(400).json({ success: false, message: "Invalid member IDs provided" });
            }
        }

        const newBoard = new Board({ title, description, owner, members: boardMembers });
        await newBoard.save();

        res.status(201).json({ success: true, message: "Board created successfully", data: newBoard });
    } catch (error) {
        console.error("Error creating board:", error);
        res.status(500).json({ success: false, message: "Error creating board", error: error.message });
    }
};

const getBoards = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Authenticated User ID:", userId);

        // Convert userId to ObjectId using `new`
        const { ObjectId } = require('mongoose').Types;
        const userObjectId = new ObjectId(userId); // ✅ Correct usage
        console.log("User ObjectId:", userObjectId);

        // Fetch boards where the user is either the owner or a member
        const boards = await Board.find({
            $or: [{ owner: userObjectId }, { members: userObjectId }],
        })
        .populate("owner", "username email")
        .populate("members", "username email");

        console.log("Boards found:", boards); // Log the query results

        // Add a `role` field to determine if the user is an owner or a member
        const boardsWithRole = boards.map(board => {
            const isOwner = board.owner._id.toString() === userId;
            const isMember = board.members.some(member => member._id.toString() === userId);
            
            return {
                ...board.toObject(),
                role: isOwner ? "owner" : isMember ? "member" : "none"
            };
        });

        console.log("Boards with roles:", boardsWithRole); // Log the final result

        res.status(200).json({
            success: true,
            message: "Fetched boards successfully",
            data: boardsWithRole,
        });
    } catch (error) {
        console.error("Error fetching boards:", error);
        res.status(500).json({ success: false, message: "Error fetching boards", error: error.message });
    }
};


const getBoardById = async (req, res) => {
    const { id } = req.params;
    try {
        const board = await Board.findById(id)
            .populate('owner', 'username email')
            .populate('members', 'username email');

        if (!board) {
            return res.status(404).json({ success: false, message: "Board not found" });
        }

        const isMember = board.members.some(member => member._id.toString() === req.user.id);
        if (!isMember) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        res.status(200).json({ success: true, message: "Fetched board successfully", data: board });
    } catch (error) {
        console.error("Error fetching board:", error);
        res.status(500).json({ success: false, message: "Error fetching board", error: error.message });
    }
};

const updateBoard = async (req, res) => {
    const { id } = req.params;
    const { title, description, members } = req.body;

    try {
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).json({ success: false, message: "Board not found" });
        }

        if (board.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        if (title) board.title = title;
        if (description) board.description = description;
        if (members) board.members = members;

        await board.save();

        res.status(200).json({ success: true, message: "Board updated successfully", data: board });
    } catch (error) {
        console.error("Error updating board:", error);
        res.status(500).json({ success: false, message: "Error updating board", error: error.message });
    }
};

const deleteBoard = async (req, res) => {
    const { id } = req.params;

    try {
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).json({ success: false, message: "Board not found" });
        }

        if (board.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        await Board.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Board deleted successfully" });
    } catch (error) {
        console.error("Error deleting board:", error);
        res.status(500).json({ success: false, message: "Error deleting board", error: error.message });
    }
};

module.exports = { createBoard, getBoards, getBoardById, deleteBoard };
