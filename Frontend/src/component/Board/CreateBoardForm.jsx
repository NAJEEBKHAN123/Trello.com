import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CreateBoardForm = ({onCreateBoard}) => {
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!boardName || !description) {
      setError("Both fields are required!");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/boards/create",
        { title: boardName, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setBoardName("");
        setDescription("");
        onCreateBoard(response.data.board); // Pass new board to the parent
        
        
      }
      navigate('/boardlist')
    } catch (error) {
      setError("Error creating board. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Board</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Board created successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Board Name</label>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter board name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter board description"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Board"}
        </button>
      </form>
    </div>
  );
};

export default CreateBoardForm;
