import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        console.log("Token:", token); // Debugging

        const response = await axios.get(
          "http://localhost:3000/api/boards/getAllBoards",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API Response:", response.data); // Debugging

        setBoards(response.data.data);
      } catch (err) {
        console.error("Error fetching boards:", err.response || err);
        setError(
          err.response?.data?.message || "Failed to fetch boards. Try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Boards</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : boards.length === 0 ? (
        <p className="text-gray-500">No boards found</p>
      ) : (
        <ul className="space-y-4">
          {boards.map((board) => (
            <li
              key={board._id}
              className="border p-4 rounded-md shadow-md bg-white"
            >
              <h3 className="text-xl font-semibold">{board.title}</h3>
              <p className="text-gray-700">{board.description}</p>
              <p className="text-sm text-gray-500">
                Created At: {new Date(board.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Updated At: {new Date(board.updatedAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Owner: {board.owner}</p>
              <p className="text-sm text-gray-500">
                Members: {board.members.join(", ")}
              </p>
              <Link
                to={`/boards/${board._id}`}
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Board
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BoardList;
