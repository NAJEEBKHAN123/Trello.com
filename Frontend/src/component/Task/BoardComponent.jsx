// BoardComponent.js
import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import axios from "axios";
import TaskComponent from "./TaskComponent";

const BoardComponent = ({ boardId }) => {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  const fetchBoardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [listsRes, tasksRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/lists/boards/${boardId}/lists`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:3000/api/lists/boards/${boardId}/lists`, {
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
    
    if (!destination || source.index === destination.index) return;

    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;

    // Clone tasks
    const newTasks = { ...tasks };
    const sourceTasks = [...newTasks[sourceListId]];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceListId === destListId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      newTasks[sourceListId] = sourceTasks;
    } else {
      const destTasks = [...(newTasks[destListId] || [])];
      destTasks.splice(destination.index, 0, { ...movedTask, list: destListId });
      newTasks[sourceListId] = sourceTasks;
      newTasks[destListId] = destTasks;
    }

    setTasks(newTasks);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3000/api/moves/moveTask",
        {
          taskId: draggableId,
          newListId: destListId,
          newIndex: destination.index,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Move failed:", error);
      fetchBoardData(); // Revert on error
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
            onUpdate={fetchBoardData}
          />
        ))}
      </DragDropContext>
    </div>
  );
};

export default BoardComponent;