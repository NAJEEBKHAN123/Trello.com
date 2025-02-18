import React, { useState } from "react";
import axios from "axios";

const BoardTask = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState(task.title);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedTaskTitle(task.title);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.put(
        `http://localhost:3000/api/tasks/${task._id}`,
        { title: updatedTaskTitle },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdate(response.data); 
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`http://localhost:3000/api/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(task._id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="border p-4 rounded-md shadow-md mb-4">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={updatedTaskTitle}
            onChange={(e) => setUpdatedTaskTitle(e.target.value)}
            className="p-2 border rounded-md w-full mb-2"
          />
          <div className="flex space-x-2">
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
            <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold">{task.title}</h3>
          <p>{task.description}</p>
          <div className="mt-2 flex space-x-2">
            <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Edit</button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardTask;
