import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Pencil } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


const TaskComponent = ({ listId, boardId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    if (listId) {
      fetchTasks();
    }
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
      console.error("Error fetching tasks:", error.response?.data || error);
    }
  };

  const createTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/tasks/createTask",
        { list: listId, board: boardId, title: newTaskTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prevTasks) => [...prevTasks, response.data.data]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/tasks/deleteTask/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error);
    }
  };

  const handleUpdate = (task) => {
    const updatedTitle = prompt("Update task title:", task.title);
    if (updatedTitle !== null && updatedTitle.trim() !== "") {
      updateTask(task._id, updatedTitle);
    }
  };

  const updateTask = async (taskId, updatedTitle) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/tasks/updateTask/${taskId}`,
        { title: updatedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, title: updatedTitle } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error);
    }
  };

  // 🔥 Handle Dragging Tasks
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
  
    console.log("Drag Result:", result);
  
    const { source, destination, draggableId } = result;
    
    console.log(`Dragging task ${draggableId} from ${source.droppableId} to ${destination.droppableId}`);
  
    if (source.droppableId === destination.droppableId) {
      console.log("Reordering task within the same list");
      const reorderedTasks = [...tasks];
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      setTasks(reorderedTasks);
    } else {
      console.log("Moving task to a different list");
      
      try {
        const token = localStorage.getItem("token");
  
        await axios.put(
          `http://localhost:3000/api/moves/moveTask`,
          { taskId: draggableId, newListId: destination.droppableId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== draggableId)
        );
  
        fetchTasks();  
      } catch (error) {
        console.error("Error moving task:", error.response?.data || error);
      }
    }
  };
  
  
  

  return (
    <div className="mt-2 w-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={listId}>
          {(provided) => (
            <ul
              className="space-y-2 h-30 min-h-10 overflow-y-auto border border-gray-300 rounded-lg p-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-2 bg-gray-100 rounded flex justify-between items-center shadow-md"
                    >
                      <span>{task.title}</span>
                      <span className="flex gap-2">
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={() => handleUpdate(task)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={18} />
                        </button>
                      </span>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {/* Task Input & Button */}
      <div className="flex items-center gap-3 p-2 mt-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter task name..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button
          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
          onClick={createTask}
        >
          ➕
        </button>
      </div>
    </div>
  );
};

export default TaskComponent;