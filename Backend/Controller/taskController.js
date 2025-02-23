const Board = require('../model/Board')
const Task = require('../model/taskModel.js')
const List = require('../model/listModel')

const createTask = async (req, res) => {
    const { title, description, status, dueDate, list, board, assignedTo, priority, tags } = req.body;
    
    try {
        // Validate if list and board exist
        const existingList = await List.findById(list);
        const existingBoard = await Board.findById(board);

        if (!existingList || !existingBoard) {
            return res.status(404).json({ success: false, message: "List or Board not found" });
        }

        const task = new Task({
            title,
            description,
            status,
            dueDate,
            list,
            board,
            assignedTo,
            createdBy: req.user._id, // Authenticated user
            priority,
            tags
        });

        await task.save();
        res.status(201).json({ success: true, message: "Task created successfully", data: task });

    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

 const updateTask = async(req, res) =>{
    const {taskId} = req.params;
    const { title, description, status, dueDate, list, board, assignedTo, priority, tags } = req.body;
    
    try {
        const task = await Task.findById(taskId)
        if(!task){
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo) task.assignedTo = assignedTo;
    if (priority) task.priority = priority;
    if (tags) task.tags = tags;

    await task.save();
    return res.status(200).json({
        success: true,
        message: "Task update successfully",
        data: task
    })
    } catch (error) {
        console.error("Error updating task:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
 }
  
 const getTask = async(req, res) =>{
    const {taskId} = req.params

    try {
        const task = await Task.findById(taskId)
      .populate('list')
      .populate('board')
      .populate('assignedTo')
      .populate('createdBy');

      if(!task){
        return res.status(404).json({
            success: false,
            message: "Task not found"
        })
      }
      res.status(200).json({
        success: true,
        message: "Task fetched successfully",
        data: task
      })
    } catch (error) {
        console.error("Error fetching task:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
 }

 const getTasksByList = async (req, res) => {
    const { listId } = req.params; // ✅ Correctly get listId from params

    try {
        const tasks = await Task.find({ list: listId }) // ✅ Find tasks where listId matches
            .populate("list")
            .populate("board")
            .populate("assignedTo")
            .populate("createdBy");

        if (tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No tasks found for this list",
            });
        }

        res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            data: tasks,
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};


 module.exports = {createTask, updateTask, getTask, getTasksByList, deleteTask}