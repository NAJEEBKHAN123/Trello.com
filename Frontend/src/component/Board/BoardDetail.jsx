import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const BoardDetail = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For redirecting

  useEffect(() => {
    const fetchBoard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      console.log("Token:", token); // Debugging

      try {
        const response = await axios.get(
          `http://localhost:3000/api/boards/getBoardById/${boardId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response.data); // Debugging

        if (response.data && response.data.data) {
          setBoard(response.data.data);
        } else {
          setError("Invalid response format from the server.");
        }
      } catch (err) {
        console.error("Error fetching board:", err.response || err);
        setError(
          err.response?.data?.message || "Failed to fetch board. Access Denied."
        );

        if (err.response?.status === 403 || err.response?.status === 401) {
          setTimeout(() => navigate("/login"), 1000); // Prevent immediate redirect
        }
      } finally {
        setLoading(false);
      }
    };

    if (boardId) fetchBoard();
  }, [boardId, navigate]);

  return (
    <div className="container mx-auto p-4">
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader size={40} color="#4A90E2" />
        </div>
      ) : board ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">{board.title}</h2>
          <p className="text-gray-700">{board.description}</p>
          <p className="text-sm text-gray-500">
            Owner: {board.owner?.username} ({board.owner?.email})
          </p>

          <h3 className="text-lg font-semibold mt-4">Members:</h3>
          <ul className="list-disc pl-5">
            {board.members?.length > 0 ? (
              board.members.map((member) => (
                <li key={member._id} className="text-gray-600">
                  {member.username} ({member.email})
                </li>
              ))
            ) : (
              <p className="text-gray-500">No members in this board.</p>
            )}
          </ul>

          {/* Back Button */}
          <button
            onClick={() => navigate("/boardlist")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Boards
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Board not found.</p>
      )}
    </div>
  );
};

export default BoardDetail;
