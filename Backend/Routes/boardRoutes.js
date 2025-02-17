const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createBoard,
  getBoards,
  getBoardById,
  deleteBoard,
} = require("../Controller/boardController");

// Protected route for creating a board
router.post("/createBoards", authMiddleware, createBoard);
router.get("/getAllBoards", authMiddleware, getBoards);
router.get("/getBoardById/:id", authMiddleware, getBoardById);
router.delete("/deleteBoard/:id", authMiddleware, deleteBoard);

module.exports = router;