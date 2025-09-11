import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./components/pages/Dashboard";
import JobPage from "./components/pages/JobsPage";   // ✅ corrected filename
import CreateJob from "./components/pages/CreateJob"; // ✅ new route for recruiter

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Jobs list page */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobPage />
            </ProtectedRoute>
          }
        />

        {/* Recruiter create job page */}
        <Route
          path="/jobs/create"
          element={
            <ProtectedRoute>
              <CreateJob />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
