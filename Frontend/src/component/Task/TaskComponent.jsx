import React, { useState, useEffect } from "react";
import axios from "axios";
import { Award, X } from "lucide-react";

const TaskComponent = ({ listId, boardId }) => {

  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [listId]);

const fetchTasks = async () => {
  if (!listId) {
    console.error("Error: listId is undefined!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    console.log("Fetching tasks for listId:", listId); // ✅ Debugging

    const response = await axios.get(
      `http://localhost:3000/api/tasks/getTasksByList/${listId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Fetched tasks:", response.data.data);
    setTasks(response.data.data);
  } catch (error) {
    console.error("Error fetching tasks:", error.response?.data || error);
  }
};
 


  

const createTask = async () => {
  if (!newTaskTitle.trim()) return;

  try {
    const token = localStorage.getItem("token");

    console.log("Creating task for listId:", listId, "boardId:", boardId); // ✅ Debugging

    await axios.post(
      `http://localhost:3000/api/tasks/createTask`,
      { 
        list: listId, 
        board: boardId, // ✅ Now this is correctly passed
        title: newTaskTitle,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewTaskTitle("");
    fetchTasks();
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error);
  }
};

const deleteTask = async(taskId) =>{
  const token = localStorage.getItem('token')
  await axios.delete(`http://localhost:3000/api/tasks/deleteTask/${taskId}`, {
        headers: {Authorization: `Bearer ${token}`}
  })
  setTasks(tasks.filter((task) => task._id !== taskId))
  console.log("deleted")
}


  return (
    <div className="mt-2">
      <ul className="space-y-2">
      {tasks.map((task) => (
          <li
            key={task._id}
            className="p-2 bg-gray-100 rounded mt-1 flex justify-between items-center"
          >
            <span>{task.title}</span>
            <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:text-red-700">
              <X size={18} />
            </button>
          </li>
        ))}
      </ul>

      {/* Task Input & Button */}
      <div className="flex items-center gap-3 p-2 mt-2 ">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter task name..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
      
        <button
          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          onClick={createTask}
        >
          ➕
        </button>
      </div>
    </div>
  );
};

export default TaskComponent;
