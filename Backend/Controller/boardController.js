const mongoose = require('mongoose');
const Board = require('../model/Board');
const User = require('../model/usermodel');
const jwt = require('jsonwebtoken')

const createBoard = async (req, res) => {
    try {
        console.log("User from token:", req.user); // Add this for debugging

        const { title, description, members } = req.body;

        if (!req.user || !req.user.id) {
            console.log("User not authenticated: No user found in request");
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const owner = req.user.id;
        if (!title) {
            return res.status(400).json({ success: false, message: "Board title is required" });
        }

        const boardMembers = members ? [...new Set([...members, owner])] : [owner];
        console.log("Board members:", boardMembers);

        if (boardMembers.length > 0) {
            const validMembers = await User.find({ _id: { $in: boardMembers } });
            console.log("Valid members found:", validMembers);

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
    const { id } = req.params;
  
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ success: false, message: "No token provided" });
      }
  
      const token = req.headers.authorization.split(' ')[1];
      let decoded;
  
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
      } catch (error) {
        return res.status(401).json({ success: false, message: error.name === 'TokenExpiredError' ? 'Token expired' : "Invalid token" });
      }
  
      const userId = decoded._id; // Correctly extract the user ID
  
      console.log("Fetching board with ID:", id);
      const board = await Board.findById(id)
        .populate('owner', 'username email')
        .populate('members', 'username email');
  
      console.log("Fetched Board:", board);
  
      if (!board) {
        return res.status(404).json({ success: false, message: "Board not found" });
      }
  
      // Log IDs for debugging
      console.log("Board Owner ID:", board.owner._id.toString());
      console.log("Board Members IDs:", board.members.map(member => member._id.toString()));
      console.log("User ID:", userId.toString());
  
      // Check if the user is the owner or a member
      const isOwner = board.owner._id.toString() === userId.toString();
      const isMember = board.members.some(member => member._id.toString() === userId.toString());
  
      console.log("Is Owner:", isOwner);
      console.log("Is Member:", isMember);
  
      // If the user is not the owner or a member, add them to the members array
      if (!isOwner && !isMember) {
        console.log("User is not a member, adding them to the board.");
        board.members.push({ _id: userId }); // Add the user to the members array
        await board.save(); // Save the updated board
        console.log('User added to the board.');
      }
  
      // Respond with the fetched board
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
