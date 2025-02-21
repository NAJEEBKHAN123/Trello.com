import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskComponent = ({ listId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/lists/${listId}/tasks`);
      setTasks(response.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post("http://localhost:3000/api/tasks", {
        title: newTaskTitle,
        listId,
      });

      setTasks([...tasks, response.data.data]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id} className="bg-gray-200 p-2 rounded mt-2">
          {task.title}
        </div>
      ))}
      <input
        type="text"
        placeholder="Add Task"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        className="w-full p-2 border rounded mt-2"
      />
      <button onClick={handleCreateTask} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full">
        + Add Task
      </button>
    </div>
  );
};

export default TaskComponent;
