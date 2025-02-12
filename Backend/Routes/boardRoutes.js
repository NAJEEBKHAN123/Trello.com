const express = require("express");
const router = express.Router();
const { authMiddleware, hasRole } = require("../middleware/authMiddleware");
const {
  createBoard,
  getBoards,
  getBoardById,
  deleteBoard,
  udpateBoard
} = require("../Controller/boardController");

// Protected route for creating a board
router.post("/boards", authMiddleware, createBoard);
router.get("/getAllBoards", authMiddleware, getBoards);
router.get("/getBoardById/:id", authMiddleware, getBoardById);
router.delete("/deleteBoard/:id", authMiddleware, deleteBoard);
router.put("/updateBoard/:id", authMiddleware, udpateBoard);



// Admin-only route
router.get("/admin-only", authMiddleware, hasRole("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome, Admin!",
  });
});

module.exports = router;
