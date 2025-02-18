import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ onSelectBoard }) => {
  const [showBoardPopup, setShowBoardPopup] = useState(false);
  const [boards, setBoards] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:3000/api/boards/getAllBoards", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

      const response = await axios.post(
        "http://localhost:3000/api/boards/createBoards",
        {
          title: boardName,
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBoards([...boards, response.data.board]);
      setBoardName("");
      setDescription("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <div className="sidebar p-4 w-64 bg-gray-800 text-white h-screen">
      <h2 className="text-xl font-semibold mb-4">Project Manager</h2>
      <div>
        <button
          onClick={() => setShowBoardPopup(!showBoardPopup)}
          className="w-full text-left p-2 bg-gray-700 rounded mb-2"
        >
          Board
        </button>
        {showBoardPopup && (
          <div className="absolute left-64 top-12 bg-white text-black p-4 shadow-lg rounded w-64">
            <h3 className="text-lg font-semibold mb-2">Your Boards</h3>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
            >
              + Create Board
            </button>
            {showCreateForm && (
              <form onSubmit={handleCreateBoard} className="mb-4">
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
            )}
            <ul>
              {boards.map((board) => (
                <li
                  key={board._id}
                  onClick={() => onSelectBoard(board)}
                  className="cursor-pointer p-2 border rounded mb-2 hover:bg-gray-200"
                >
                  {board.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button className="w-full text-left p-2 bg-gray-700 rounded">Member</button>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Your Boards</h3>
        <ul>
          {boards.map((board) => (
            <li
              key={board._id}
              onClick={() => onSelectBoard(board)}
              className="cursor-pointer p-2 border rounded mb-2 hover:bg-gray-200"
            >
              {board.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
