import React, { useEffect, useState } from "react";
import axios from "axios";
import BoardList from "../component/Board/BoardList";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:3000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return(

     <>
      <h1>hello</h1>
      <BoardList/>
     </>
) 
    
};

export default Dashboard;
