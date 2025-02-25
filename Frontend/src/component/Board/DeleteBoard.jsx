import axios from "axios";
import React from "react";

const DeleteBoard = ({ board, userRole, fetchBoards }) => {
  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token provided, please log in again.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:3000/api/boards/deleteBoard/${boardId}`, // ✅ Check endpoint
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Board deleted successfully!");
        fetchBoards(); // Refresh board list after deletion
      } else {
        alert("Failed to delete the board.");
      }
    } catch (error) {
      console.error("Error deleting board:", error);
      alert("An error occurred while deleting the board.");
    }
  };

  return (
    <>
      {userRole === "admin" && (
        <button
          onClick={() => handleDeleteBoard(board._id)}
          className="px-3 py-1 transition"
        >
          ❌ 
        </button>
      )}
    </>
  );
};

export default DeleteBoard;
