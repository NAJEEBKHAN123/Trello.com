const express = require("express");
const { moveTask } = require("../Controller/moveTask");
const router = express.Router();

router.put("/moveTask", moveTask); // ✅ Route to update task list

module.exports = router;
