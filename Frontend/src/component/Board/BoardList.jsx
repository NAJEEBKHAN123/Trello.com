import React, { useEffect, useState } from "react";
import axios from "axios";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found in localStorage");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/boards/getAllBoards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Boards Data:", response.data.data); // Logs the data to verify
        setBoards(response.data.data);
      } catch (err) {
        console.error("Error fetching boards:", err);
        setError("Failed to fetch boards");
      }
    };

    fetchBoards();
  }, []);

  return (
    <div>
      <h2>Your Boards</h2>
      {error && <p>{error}</p>}
      {boards.length === 0 ? (
        <p>No boards found</p>
      ) : (
        <ul>
          {boards.map((board) => (
            <li key={board._id}>{board.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Boards;
