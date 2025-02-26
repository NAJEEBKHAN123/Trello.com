import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteBoard from "../component/Board/DeleteBoard";
import ListComponent from "../component/List/ListComponent";
import Navbar from "../Common/Navbar";
import { useNavigate } from "react-router-dom";
import { View } from "lucide-react";

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [viewAllBoards, setViewAllBoards] = useState(false);
  const [userRole, setUserRole] = useState(""); // 🔹 Store user role
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [viewAllMembers, setViewAllMembers] = useState(false);
  const navigate = useNavigate();

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
  // ✅ Add this to store all members

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:3000/api/boards/getAllBoards",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const boardsData = response.data.data;
      setBoards(boardsData);

      // ✅ Extract unique members
      const allMembers = [
        ...new Set(boardsData.flatMap((board) => board.members)),
      ];
      setMembers(allMembers); // ✅ Store in state

      console.log("Boards:", boardsData);
      console.log("Unique Members:", allMembers);
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
      navigate("/user-dashboard");
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        console.error("Error creating board:", error);
      }
    }
  };

  return (
    <div className="flex flex-col flex-wrap  sm:flex-row h-screen w-screen overflow-hidden">
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
        <div className="sidebar  p-4 w-full md:w-64 text-white h-auto md:h-full">
          <h2 className="text-xl font-semibold mb-4">Project Manager</h2>
          <ul className="space-y-3">
            <li
              className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded"
              onClick={() => {
                setSelectedBoard(null);
                setShowCreateForm(false);
                setViewAllBoards(true);
                setIsSidebarOpen(false);
                setViewAllMembers(false);
              }}
            >
              📌 Boards
            </li>
            <li
              className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded"
              onClick={() => {
                setIsSidebarOpen(false);
                setViewAllMembers(true);
                setViewAllBoards(false);
                setSelectedBoard(false);
              }}
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
                      setViewAllMembers(false);
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
      <div className="flex-1 bg-gray-100 relative flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="pb-0">
          <Navbar />
        </div>

        {/* Content Area (Without Scroll) */}
        <div className="p-6 flex-1 justify-center items-center overflow-auto">
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
                    className="p-3 border rounded bg-blue-500 text-white text-center hover:bg-blue-400 mt-[-44px]"
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

              <div className="flex flex-wrap gap-4 justify-center items-center overflow-auto max-h-[80vh]">
                {boards.map((board) => (
                  <div
                    key={board._id}
                    className="cursor-pointer relative p-4 bg-white shadow-md rounded hover:bg-gray-200 max-h-25 w-72"
                  >
                    <div onClick={() => setSelectedBoard(board)}>
                      <h3 className="font-semibold">{board.title}</h3>
                      <p className="text-sm text-gray-600 overflow-hidden transition-all duration-300 max-h-12 hover:max-h-40">
                        {board.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        Created At: {new Date(board.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Delete Button (Only for Admins) */}
                    <div className="absolute top-3 right-4">
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

          {viewAllMembers && (
            <div className="p-6">
              {userRole === "admin" ? (
                <>
                  <h2 className="text-2xl font-semibold mb-4">All Members</h2>
                  <ul className="flex flex-wrap gap-4">
                    {members.length > 0 ? (
                      members.map((member, index) => (
                        <li
                          key={index}
                          className="p-4 bg-white shadow-md rounded flex items-center space-x-2"
                        >
                          {typeof member === "object" ? (
                            <>
                              <img
                                src={member.avatar || "default-avatar.png"}
                                alt={member.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <span className="text-sm font-medium">
                                {member.members}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-medium">
                              {member}
                            </span>
                          )}
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-400">No members available</p>
                    )}
                  </ul>{" "}
                </>
              ) : (
                "Sorry, The Members can access only admin"
              )}
            </div>
          )}

          {/* Default Welcome Message Based on Role */}
          {!viewAllBoards &&
            !selectedBoard &&
            !showCreateForm &&
            !viewAllMembers && (
              <div className="flex w-full min-w-full items-center justify-center h-full text-center">
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
            <div className="flex items-center justify-center flex-wrap">
              <ListComponent boardId={selectedBoard._id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
