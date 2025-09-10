import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/AuthSlice";
import axiosInstance from "../../utils/axiosInstance"; // centralized axios

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // default Candidate

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        role, 
      });

      dispatch(loginSuccess(res.data));
      alert("Signup successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0B1530] text-white p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Connect</h1>
        <p className="text-lg text-gray-400">Your World, Connected</p>
      </div>
      <div className="bg-black/20 p-8 rounded-2xl w-full max-w-sm">
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-4 bg-white text-gray-800 rounded-full border-2 border-transparent focus:border-blue-500 focus:outline-none placeholder-gray-500"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-white text-gray-800 rounded-full border-2 border-transparent focus:border-blue-500 focus:outline-none placeholder-gray-500"
            required
          />

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white text-gray-800 rounded-full focus:border-blue-500 focus:outline-none placeholder-gray-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Role Selection */}
          <div className="flex justify-around text-gray-300">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={(e) => setRole(e.target.value)}
              />
              Candidate
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={role === "recruiter"}
                onChange={(e) => setRole(e.target.value)}
              />
              Recruiter
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-[#4285F4] text-white font-semibold rounded-full shadow-lg hover:bg-[#357AE8] transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
