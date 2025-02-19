import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [viewAllBoards, setViewAllBoards] = useState(false); // ❌ Main section is empty by default

  useEffect(() => {
    fetchBoards();
  }, []);

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

      await axios.post(
        "http://localhost:3000/api/boards/createBoards",
        { title: boardName, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBoardName("");
      setDescription("");
      setShowCreateForm(false);
      setSelectedBoard(null);
      setViewAllBoards(false);
      fetchBoards();
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  const handleBoardSelection = (board) => {
    setSelectedBoard(board);
    setShowCreateForm(false);
    setViewAllBoards(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="sidebar p-4 w-64 bg-gray-800 text-white h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Project Manager</h2>

        {/* Sidebar Navigation */}
        <ul className="space-y-3">
          <li
            className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={() => {
              setSelectedBoard(null);
              setShowCreateForm(false);
              setViewAllBoards(true);
            }}
          >
            📌 Boards
          </li>
          <li className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded">
            👥 Members
          </li>

          {/* Your Boards Section */}
          <li className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded">
            📁 Your Boards
            <ul className="ml-4 mt-2 overflow-y-auto max-h-80">
              {boards.map((board) => (
                <li
                  key={board._id}
                  className="cursor-pointer p-2 bg-gray-600 hover:bg-gray-500 rounded mt-1"
                  onClick={() => handleBoardSelection(board)}
                >
                  {board.title}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      {/* Main Section */}
      <div className="p-6 flex-1 bg-gray-100">
        {/* Show All Boards when "📌 Boards" is clicked */}
        {viewAllBoards && !selectedBoard && !showCreateForm && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">All Boards</h2>

            {/* Create Board Button */}
            <div
              onClick={() => {
                setShowCreateForm(true);
                setViewAllBoards(false);
                setSelectedBoard(null);
              }}
              className="cursor-pointer p-3 border rounded bg-green-500 text-center hover:bg-green-400 mb-4 w-48"
            >
              + Create Board
            </div>

            {/* Boards Grid */}
            <div className="grid grid-cols-3 gap-4">
              {boards.map((board) => (
                <div
                  key={board._id}
                  onClick={() => handleBoardSelection(board)}
                  className="cursor-pointer p-4 bg-white shadow-md rounded hover:bg-gray-200"
                >
                  <h3 className="font-semibold">{board.title}</h3>
                  <p className="text-sm text-gray-600">{board.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show Selected Board */}
        {selectedBoard && !showCreateForm && (
          <div>
            <h2 className="text-2xl font-semibold">{selectedBoard.title}</h2>
            <p className="text-gray-600">{selectedBoard.description}</p>

            {/* Task Lists */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 shadow-md rounded">
                <h3 className="font-semibold text-lg">📝 To-Do</h3>
              </div>
              <div className="bg-white p-4 shadow-md rounded">
                <h3 className="font-semibold text-lg">🚀 In Progress</h3>
              </div>
              <div className="bg-white p-4 shadow-md rounded">
                <h3 className="font-semibold text-lg">✅ Completed</h3>
              </div>
            </div>
          </div>
        )}

        {/* Show Create Board Form */}
        {showCreateForm && !selectedBoard && (
          <div className="p-4 bg-white shadow-md rounded w-1/3">
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

        {/* Default Message when nothing is selected */}
        {!viewAllBoards && !selectedBoard && !showCreateForm && (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-xl text-gray-600">
              Welcome to Project Manager! Select a board from the sidebar or
              create a new one to get started.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
