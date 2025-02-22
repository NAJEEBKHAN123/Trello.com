import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskComponent = ({ listId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [listId]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/tasks/getTasksByList/${listId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(response.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const createTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/tasks/createTask",
        { listId, title: newTaskTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTaskTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="mt-2">
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="p-2 bg-gray-100 rounded mt-1">
            {task.title}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3  rounded-lg">
  <input
    type="text"
    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    placeholder="Enter task name..."
    value={newTaskTitle}
    onChange={(e) => setNewTaskTitle(e.target.value)}
  />
  <button
    className="flex items-center gap-2 px-2 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
    onClick={createTask}
  >
    ➕ 
  </button>
</div>

    </div>
  );
};

export default TaskComponent;
