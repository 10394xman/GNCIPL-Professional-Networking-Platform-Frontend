import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import axiosInstance from "../../utils/axiosInstance";
const apiBase = import.meta.env.VITE_BACKEND_URL
import GoogleAuthButton from "./GoogleAuthButton";
import { auth } from "../Messages/authWrapper";
const Login = () => {
  const { setUserDetails, connectToSocket } = auth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // ✅ Default Candidate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        "/auth/login",
        { email, password, role }, // ✅ role bhi bhej rahe
        { withCredentials: true }
      );

      console.log("LOGIN API RESPONSE:", res.data);

      const payload = {
        user: res.data.user || {
          name: res.data.name,
          email: res.data.email,
          role: res.data.role || role, // fallback agar backend se na aaye
        },
        token: res.data.token || res.data?.jwt, // fallback if backend uses jwt
      };

      // ✅ Save to Redux
      dispatch(loginSuccess(payload));
      setUserDetails(res.data);
      connectToSocket(res.data._id)
      // ✅ Force save in localStorage
      if (payload.token) localStorage.setItem("token", payload.token);
      if (payload.user)
        localStorage.setItem("user", JSON.stringify(payload.user));

      alert("Login Successful!");

      // ✅ Redirect by role
      if (payload.user?.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0B1530] text-white p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Connect</h1>
        <p className="text-lg text-gray-400">Your World, Connected</p>
      </div>

      <div className="bg-black/20 p-8 rounded-2xl w-full max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-white text-gray-800 rounded-full border-2 border-transparent focus:border-blue-500 focus:outline-none placeholder-gray-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white text-gray-800 rounded-full focus:border-blue-500 focus:outline-none placeholder-gray-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-500"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-gray-400">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500 rounded-full mr-2"
              />
              Remember Me
            </label>
            <Link
              to="/forgot-password"
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#4285F4] text-white font-semibold rounded-full shadow-lg hover:bg-[#357AE8] transition-colors"
          >
            Log In
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">OR</div>
        <GoogleAuthButton />
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
