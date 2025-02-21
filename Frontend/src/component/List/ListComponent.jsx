import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskComponent from "../Task/TaskComponent";

const ListComponent = ({ boardId }) => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/boards/${boardId}/lists`);
      setLists(response.data.data);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {lists.map((list) => (
        <div key={list._id} className="bg-white p-4 shadow-md rounded">
          <h3 className="font-semibold text-lg">{list.title}</h3>
          <TaskComponent listId={list._id} />
        </div>
      ))}
    </div>
  );
};

export default ListComponent;
