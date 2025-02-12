const express = require("express");
const { moveTask } = require("../Controller/moveTask");
const router = express.Router();

router.put("/move-task", moveTask); // ✅ Route to update task list

module.exports = router;
