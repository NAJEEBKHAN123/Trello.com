// BoardComponent.js (Parent)
import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import axios from "axios";
import TaskComponent from "./TaskComponent";

const BoardComponent = ({ boardId }) => {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState({}); // { [listId]: arrayOfTasks }

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  const fetchBoardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [listsRes, tasksRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/lists/getListsByBoard/${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:3000/api/tasks/getTasksByBoard/${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const tasksByList = tasksRes.data.data.reduce((acc, task) => {
        acc[task.list] = acc[task.list] || [];
        acc[task.list].push(task);
        return acc;
      }, {});

      setLists(listsRes.data.data);
      setTasks(tasksByList);
    } catch (error) {
      console.error("Error fetching board data:", error);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic update
    const sourceTasks = [...tasks[source.droppableId]];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    const newTasks = { ...tasks };

    // Same list movement
    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      newTasks[source.droppableId] = sourceTasks;
      setTasks(newTasks);
    } 
    // Different list movement
    else {
      const destTasks = [...(tasks[destination.droppableId] || [])];
      destTasks.splice(destination.index, 0, { ...movedTask, list: destination.droppableId });
      
      newTasks[source.droppableId] = sourceTasks;
      newTasks[destination.droppableId] = destTasks;
      setTasks(newTasks);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/moves/moveTask`,
        {
          taskId: draggableId,
          newListId: destination.droppableId,
          newIndex: destination.index,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Move failed, reverting UI:", error);
      fetchBoardData(); // Revert to server state
    }
  };

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        {lists.map((list) => (
          <TaskComponent
            key={list._id}
            list={list}
            tasks={tasks[list._id] || []}
            boardId={boardId}
            onTaskUpdate={fetchBoardData}
          />
        ))}
      </DragDropContext>
    </div>
  );
};

export default BoardComponent;