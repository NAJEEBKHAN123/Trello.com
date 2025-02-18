const mongoose = require('mongoose');
const Board = require('../model/Board');
const User = require('../model/usermodel');
const jwt = require('jsonwebtoken')

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
      // Verify token and extract user ID
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find boards associated with the user ID
      const boards = await Board.find({ userId: decoded.id });
      
      if (!boards) {
        return res.status(404).json({ message: 'No boards found' });
      }
  
      res.json({ data: boards });
    } catch (err) {
      console.error("Error fetching boards:", err);
      res.status(500).json({ message: 'Error fetching boards' });
    }
  };

  const getBoardById = async (req, res) => {
    const { id } = req.params; // Extract board ID from request parameters

    try {
        // Ensure authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = req.headers.authorization.split(' ')[1]; // Extract token
        let decoded;
        
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Token expired' });
            }
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const userId = decoded.id; // Extract user ID from decoded token
        console.log("Fetching board with ID:", id); // Log ID for debugging

        // Fetch board from database and populate owner & members
        const board = await Board.findById(id)
            .populate('owner', 'username email')
            .populate('members', 'username email');

        // Log board for debugging
        console.log(board);

        if (!board) {
            return res.status(404).json({ success: false, message: "Board not found" });
        }

        // Check if the user is the owner or a member
        const isOwner = board.owner && board.owner._id.toString() === userId;
        const isMember = board.members.some(member => member._id.toString() === userId);

        if (!isOwner && !isMember) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        // Return board data if user has access
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
