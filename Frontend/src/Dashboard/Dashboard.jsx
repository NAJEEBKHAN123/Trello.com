import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteBoard from "../component/Board/DeleteBoard";
import ListComponent from "../component/List/ListComponent";
import Navbar from "../Common/Navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [viewAllBoards, setViewAllBoards] = useState(false);
  const [userRole, setUserRole] = useState(""); // 🔹 Store user role
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    fetchBoards();
    fetchUserRole(); // 🔹 Fetch user role on mount
  }, []);

  // 🔹 Fetch User Role
  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in localStorage");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Full API Response:", response.data);
      console.log("Full API Response:", response.data.data.role); // Debugging full response
      // Debugging full response
      setUserRole(response.data.data.role || "user"); // Fallback to "user" if undefined
    } catch (error) {
      console.error("Error fetching user role:", error.response?.data || error);
    }
  };

  //  Fetch boards
  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:3000/api/boards/getAllBoards",
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Fixed backticks
        }
      );
      setBoards(response.data.data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch the current board count for this admin
      const boardCountResponse = await axios.get(
        "http://localhost:3000/api/boards/getAllBoards",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const adminBoards = boardCountResponse.data.data.filter(
        (board) => board.createdBy === localStorage.getItem("userId") // Ensure user ID matches
      );

      if (adminBoards.length >= 9) {
        alert("Admin can only create up to 9 boards");
        return;
      }

      // Proceed with board creation if limit is not reached
      const response = await axios.post(
        "http://localhost:3000/api/boards/createBoards",
        { title: boardName, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newBoard = response.data.data;

      // Automatically create default lists
      await axios.post("http://localhost:3000/api/lists/createList", {
        boardId: newBoard._id,
        title: "To-Do",
      });

      await axios.post("http://localhost:3000/api/lists/createList", {
        boardId: newBoard._id,
        title: "In Progress",
      });

      await axios.post("http://localhost:3000/api/lists/createList", {
        boardId: newBoard._id,
        title: "Completed",
      });

      setBoardName("");
      setDescription("");
      setShowCreateForm(false);
      fetchBoards();
      navigate('/user-dashboard')
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        console.error("Error creating board:", error);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Sidebar */}
      <button
        className="sm:hidden p-2 bg-gray-800 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>
      <div
        className={`fixed sm:relative z-10  w-64 bg-gray-800 text-white h-screen  transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="sidebar p-4 w-full md:w-64 text-white h-auto md:h-screen">
          <h2 className="text-xl font-semibold mb-4">Project Manager</h2>
          <ul className="space-y-3">
            <li
              className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded"
              onClick={() => {
                setSelectedBoard(null);
                setShowCreateForm(false);
                setViewAllBoards(true);
                setIsSidebarOpen(false);
              }}
            >
              📌 Boards
            </li>
            <li
              className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded"
              onClick={() => setIsSidebarOpen(false)}
            >
              👥 Members
            </li>
            <li className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded">
              📁 Your Boards
              <ul className="ml-4 mt-2 overflow-y-auto max-h-80">
                {boards.map((board) => (
                  <li
                    key={board._id}
                    className="cursor-pointer p-2 bg-gray-600 hover:bg-gray-500 rounded mt-1"
                    onClick={() => {
                      setSelectedBoard(board);
                      setIsSidebarOpen(false);
                    }}
                  >
                    {board.title}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Section */}
     {/* Main Section */}
{/* Main Section */}
<div className=" bg-gray-100 relative flex flex-wrap flex-col h-screen">
  {/* Navbar */}
  <div className="pb-0">
    <Navbar />
  </div>

  {/* Content Area (Without Scroll) */}
  <div className="flex-1 p-6">
    {/* Show All Boards */}
    {viewAllBoards && !selectedBoard && !showCreateForm && (
      <>
        <h2 className="text-2xl font-semibold mb-4">All Boards</h2>
        <div className="flex justify-end mb-4">
          {userRole === "admin" && boards.length < 9 && (
            <button
              onClick={() => {
                setShowCreateForm(true);
                setViewAllBoards(false);
                setSelectedBoard(null);
              }}
              className="p-3 border rounded bg-blue-500 text-white text-center hover:bg-blue-400"
            >
              + Create Board
            </button>
          )}
          {userRole === "admin" && boards.length >= 9 && (
            <div className="p-3 border rounded bg-gray-400 text-white text-[10px] text-center">
              Max Board Limit Reached
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div 
              key={board._id}
              className="cursor-pointer p-4 bg-white shadow-md rounded hover:bg-gray-200 relative"
            >
              <div onClick={() => setSelectedBoard(board)}>
                <h3 className="font-semibold">{board.title}</h3>
                <p className="text-sm text-gray-600">{board.description}</p>
                <p className="text-sm text-gray-600">
                  Created At: {new Date(board.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Delete Button (Only for Admins) */}
              <div className="absolute top-3 right-0">
                <DeleteBoard
                  board={board}
                  fetchBoards={fetchBoards}
                  userRole={userRole}
                />
              </div>
            </div>
          ))}
        </div>
      </>
    )}

    {/* Create Board Form */}
    {showCreateForm && !selectedBoard && (
      <div className="p-4 bg-white shadow-md rounded max-w-lg mx-auto">
        <h3 className="text-lg font-semibold mb-2">Create New Board</h3>
        <form onSubmit={handleCreateBoard}>
          <input
            type="text"
            placeholder="Board Name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Create
          </button>
        </form>
      </div>
    )}

    {/* Default Welcome Message Based on Role */}
    {!viewAllBoards && !selectedBoard && !showCreateForm && (
      <div className="flex items-center justify-center h-full text-center">
        {userRole === "admin" ? (
          <h2 className="text-xl text-gray-600">
            Welcome, Admin! You have full access to manage boards.
          </h2>
        ) : (
          <h2 className="text-xl text-gray-600">
            Welcome to Project Manager! Select a board from the sidebar.
          </h2>
        )}
      </div>
    )}

    {/* Board Details */}
    {selectedBoard && (
      <div>
        <ListComponent boardId={selectedBoard._id} />
      </div>
    )}
  </div>
</div>


    </div>
  );
};

export default Dashboard;
