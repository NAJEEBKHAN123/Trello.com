import React, { useState } from "react";
import axios from "axios";
import {useNavigate}  from 'react-router-dom'

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", formData);
      console.log("Signup successful:", response.data);
      alert("Signup Successful!");

      setFormData({
        username: "",
        email: "",
        password: ""
      })
      navigate('/login')
      
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error);
      alert(error.response?.data?.message || "Signup failed. Try again.");
    }


  };
  
 


  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">
          <h1 className="text-3xl text-blue-600 font-extrabold mb-6">Create Account</h1>

          <div className="flex flex-col gap-4 w-full">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <button className="bg-blue-500 text-white font-semibold py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all w-full">
              Sign Up
            </button>
          </div>

          <span className="mt-4 text-gray-600 text-center">
            Already have an account?
            <button className="text-blue-500 hover:underline ml-1 cursor-pointer">
              <button  onClick={() => navigate("/login")} className="cursor-pointer">Sign In</button>
            </button>
          </span>
        </div>
      </div>
    </form>
  );
}

export default Signup;
