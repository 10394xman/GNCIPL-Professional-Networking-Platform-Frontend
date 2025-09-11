import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // centralized axios

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // ✅ backend expects { token, newPassword }
      await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      console.error("Reset Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to reset password!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
          >
            Reset Password
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Back to{" "}
          <Link to="/login" className="text-pink-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
