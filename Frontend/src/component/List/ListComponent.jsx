import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskComponent from "../Task/TaskComponent";
import { X } from "lucide-react";

const ListComponent = ({ boardId }) => {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (boardId) {
      fetchLists();
      fetchUserRole(); 
    }
  }, [boardId]);

 const fetchUserRole = async() =>{
    try {
      const token = localStorage.getItem('token')
      if(!token){
        alert("provide perfect token")
      }
      const response = await axios.get('http://localhost:3000/api/auth/users', {
        headers: {Authorization: `Bearer ${token}`}
      })
      setUserRole(response.data.data.role || "user")

    } catch (error) {
      console.error("Error fetching user role:", error.response?.data || error);
    }
  }

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/lists/boards/${boardId}/lists`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Fetched Lists:", response.data.data); // Debugging log

      if (Array.isArray(response.data.data.lists)) {
        setLists(response.data.data.lists);
      } else {
        setLists([]);
      }
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

  const deleteList = async (listId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/lists/deleteList/${listId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLists((prevList) => prevList.filter((lis) => lis._id !== listId));
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Lists</h2>
      <div className="grid grid-cols-3 gap-2">
        {Array.isArray(lists) &&
          lists.map((list) => (
            <div
              key={list._id}
              className="bg-white p-4 shadow-md rounded relative w-72"
            >
              <h3 className="text-md font-bold mb-2">{list.title}</h3>
              <TaskComponent listId={list._id} boardId={boardId} />
              <div className="absolute top-5 right-3">
                {userRole === "admin" && (
                  <button
                    onClick={() => deleteList(list._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>

                )}
                
              </div>
            </div>
          ))}

        <div className="p-4 bg-gray-200 rounded w-64 h-30">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="New List Name"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
          />
          <button
            className="w-full mt-2 bg-blue-500 text-white p-2 rounded"
            onClick={createList}
          >
            Add List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
