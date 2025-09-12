import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // ✅ centralized axios use karenge
const apiBase = import.meta.env.VITE_BACKEND_URL
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ backend expects { email }
      await axiosInstance.post("/auth/send-mail", { email });
      setEmailSent(true);
    } catch (err) {
      console.error("ForgotPassword Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to send reset link!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-4 font-sans">
      <div className="bg-white bg-opacity-5 p-8 rounded-2xl shadow-xl border border-gray-700 w-full max-w-sm transform transition-transform duration-500 ease-in-out hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">
          Forgot Password
        </h2>
        <p className="text-center text-black mb-6">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-lg"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          <span className="text-gray-300">Remember your password? </span>
          <Link
            to="/login"
            className="text-indigo-400 font-medium hover:underline focus:outline-none"
          >
            Login
          </Link>
        </p>
      </div>

      {emailSent && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Success!
            </h3>
            <p className="text-gray-600 mb-4">
              A password reset link has been sent to{" "}
              <span className="font-semibold">{email}</span>.
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
