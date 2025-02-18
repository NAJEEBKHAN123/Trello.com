import React, { useEffect, useState } from "react";
import axios from "axios";
import BoardDetail from "../component/Board/BoardDetail";
import BoardList from "../component/Board/BoardList";



const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);  // State to track the selected board

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      {user && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
        </div>
      )}

      {/* Optionally, display the Board List */}
      <BoardList onSelectBoard={(board) => setSelectedBoard(board)} />

      {/* If a board is selected, display its details */}
      {selectedBoard && (
        <BoardDetail board={selectedBoard} />
      )}
    </>
  );
};

export default Dashboard;
