import React, { useEffect, useState } from "react";
import axios from "axios";

const BoardList = () => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found in localStorage");
          return;
        }

        console.log("Token:", token);  // ✅ Log token

        const response = await axios.get("http://localhost:3000/api/auth/getAllBoards", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data);  // ✅ Log API response
        console.log("Boards Data:", response.data.data);  // ✅ Log extracted board data

        setBoards(response.data.data);
      } catch (error) {
        console.error("Error fetching boards:", error.response?.data || error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div>
      <h2>Your Boards</h2>
      {boards.length === 0 ? (
        <p>No boards found</p>
      ) : (
        <ul>
          {boards.map((board) => (
            <li key={board._id}>{board.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BoardList;
