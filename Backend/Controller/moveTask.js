const Task = require('../model/taskModel')


const moveTask = async(req, res) =>{
    const {taskId, newListId} = req.body;

    try {
        const task = await Task.findById(taskId)
        if(!task){
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        task.list = newListId;
        await task.save()

        return res.status(200).json({
            success: true,
            message: "Task move successfully"
        })
    } catch (error) {
        console.error("Error moving task:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = {moveTask}