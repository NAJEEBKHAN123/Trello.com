import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../Dashboard/Dashboard";
import BoardDetail from "../component/Board/BoardDetail";
import BoardList from "../component/Board/BoardList";
import CreateBoardForm from "../component/Board/CreateBoardForm"; // Import CreateBoardForm

function Home() {
  return (
    <Routes>
      {/* Redirect '/' to '/login' */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Board routes */}
      <Route path="/boardlist" element={<BoardList />} />
      <Route path="/boards/:boardId" element={<BoardDetail />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/user-dashboard" element={<Dashboard />} />
        <Route path="/create-board" element={<CreateBoardForm />} /> 
      </Route>
    </Routes>
  );
}

export default Home;
