import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../Dashboard/Dashboard";
// import BoardList from "../component/Board/BoardList";
import BoardDetail from "../component/Board/BoardDetail";

function Home() {
  return (
    <Routes>
      {/* Redirect '/' to '/login' */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      {/* <Route exact path="/boards" component={BoardList} /> */}
      <Route path="/boards/:boardId" component={BoardDetail} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/user-dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default Home;
