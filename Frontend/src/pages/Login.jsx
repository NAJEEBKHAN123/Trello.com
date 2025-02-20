import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

function Login() {
  const navigate = useNavigate(); // Initialize navigate

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(
            "http://localhost:3000/api/auth/login",
            formData,
            { headers: { "Content-Type": "application/json" } } // ✅ Ensure correct headers
        );

        console.log("Login response:", response.data); // ✅ Debugging

        localStorage.setItem("token", response.data.token);
        alert("Login Successful!");
        navigate("/user-dashboard");
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Login failed");
    }
};


  return (
    <form onSubmit={handleSubmit}>
      {" "}
      {/* ✅ Corrected onSubmit */}
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">
          <h1 className="text-3xl text-blue-600 font-extrabold p-4">
            Login here
          </h1>
          <p className="text-xl text-blue-600 pb-4">
            Welcome back! You've been missed!
          </p>

          <div className="flex flex-col gap-4 w-full">
            <input
              type="email"
              name="email" // ✅ Added name attribute
              placeholder="Email"
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password" // ✅ Added name attribute
              placeholder="Password"
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all w-full"
            >
              Sign In
            </button>
          </div>

          <span className="mt-4 text-gray-600 text-center">
            Don't have an account?
            <button
              className="text-blue-500 hover:underline ml-1 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </span>
        </div>
      </div>
    </form>
  );
}

export default Login;
