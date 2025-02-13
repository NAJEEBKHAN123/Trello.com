import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../Dashboard/Dashboard";

function Home() {
  return (
    <Routes>
      {/* ✅ Redirect '/' to '/login' */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ Protected Route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/user-dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default Home;
