import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskComponent from "../Task/TaskComponent";
import { X } from "lucide-react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

const ListComponent = ({ boardId }) => {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [userRole, setUserRole] = useState("");
  const [boards, setBoards] = useState([])

  useEffect(() => {
    if (boardId) {
      fetchLists();
      fetchUserRole();
      fetchBoards();
    }
  }, [boardId]);

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Provide a valid token");
        return;
      }
      const response = await axios.get("http://localhost:3000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserRole(response.data.data.role || "user");
    } catch (error) {
      console.error("Error fetching user role:", error.response?.data || error);
    }
  };

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/lists/boards/${boardId}/lists`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists(response.data.data.lists || []);
    } catch (error) {
      console.error("Error fetching lists:", error);
      setLists([]);
    }
  };

  const createList = async () => {
    if (!newListTitle.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/lists/createList",
        { boardId, title: newListTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewListTitle("");
      fetchLists();
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const fetchBoards = async() =>{
    try {
      const token = localStorage.getItem('token')
    const response = await axios.get(`http://localhost:3000/api/boards/getBoardById/${boardId}`, {
      headers: {Authorization: `Bearer ${token}`}
    })
    console.log(response.data.data)
    setBoards(response.data.data)
    } catch (error) {
      console.error("Error fetching boards:", error);
      
    }
  }

  const deleteList = async (listId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/lists/deleteList/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists((prevList) => prevList.filter((list) => list._id !== listId));
    } catch (error) {
      console.error("Error deleting list:", error.response?.data || error);
    }
  };

  // 🔥 **Handle Drag & Drop**
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
  
    const { source, destination, draggableId } = result;
  
    if (source.droppableId === destination.droppableId) return; // No change
  
    // 🔥 Optimistically Update UI
    const updatedLists = lists.map((list) => {
      if (list._id === source.droppableId) {
        return {
          ...list,
          tasks: list.tasks.filter((task) => task._id !== draggableId),
        };
      }
      if (list._id === destination.droppableId) {
        return {
          ...list,
          tasks: [...list.tasks, { _id: draggableId }],
        };
      }
      return list;
    });
  
    setLists(updatedLists); // Update the UI immediately
  
    // 🔥 Send API request to update backend
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3000/api/moves/moveTask",
        { taskId: draggableId, newListId: destination.droppableId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      fetchLists(); // Ensure UI is updated after backend confirms
    } catch (error) {
      console.error("Error moving task:", error.response?.data || error);
    }
  };
  

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-wrap flex-col p-4">
        <h2 className="text-lg font-semibold mb-2">
         
            {boards && (
               <>
               <span>{boards.title}</span>
               </>
            )}
          
        </h2>
        <div className="flex justify-center items-center flex-col sm:flex-2/3   sm:flex-row gap-4">
          {lists.map((list) => (
            <Droppable key={list._id} droppableId={list._id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-4 shadow-md rounded relative w-72"
                >
                  <h3 className="text-md font-bold mb-2">{list.title}</h3>
                  <TaskComponent listId={list._id} boardId={boardId} />
                  {userRole === "admin" && (
                    <button
                      onClick={() => deleteList(list._id)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}

          {/* Add List Input */}
          <div className="p-4 bg-gray-200 rounded w-72">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="New List Name"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
            <button className="w-full mt-2 bg-blue-500 text-white p-2 rounded" onClick={createList}>
              Add List
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default ListComponent;
