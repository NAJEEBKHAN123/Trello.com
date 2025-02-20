 import { useState, useEffect } from "react";
 import React from "React"
import axios from "axios";

const ListComp = ({ boardId }) => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    fetchLists();
  }, [boardId]);

  const fetchLists = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/lists/boards/${boardId}/lists`);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  return (
    <div>
      <h3>Lists</h3>
      <ul>
        {lists.map((list) => (
          <ul key={lists.id}>
            <li key={list._id}>{list.title}</li>
            <li key={list._id}>{list.description}</li>
          </ul>

        ))}
      </ul>
    </div>
  );
};

export default ListComp;
