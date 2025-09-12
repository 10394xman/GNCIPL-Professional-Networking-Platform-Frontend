import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header.jsx";

import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Dashboard from "./components/pages/Dashboard.jsx";
import JobPage from "./components/pages/JobsPage.jsx"; // ✅ corrected filename
import ChatArea from "./components/Messages/ChatArea";

import AuthProvider from "./components/Messages/authWrapper";
import axios from "axios";
import { auth } from "./components/Messages/authWrapper";
// import CreateJob from "./components/pages/CreateJob"; // ✅ new route for recruiter

function App() {
  const { setUserDetails, connectToSocket } = auth();
  useEffect(() => {
    const setUserDetailsAfterPageRefresh = async () => {
      try {
        const response = await axios.get(`/api/auth/dash`, {
          withCredentials: true,
        });
        console.log("Response: ", response.data);
        setUserDetails(response.data);
        connectToSocket(response.data._id)
      } catch (err) {
        console.log("error in setting user details after refresh\n", err);
      }
    };
    setUserDetailsAfterPageRefresh();
  }, []);

  return (
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
                            <Header />

            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/message"
        element={
          <ProtectedRoute>
                            <Header />

            <ChatArea />
          </ProtectedRoute>
        }
      />

      {/* Jobs list page */}
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
                            <Header />

            <JobPage />
          </ProtectedRoute>
        }
      />

      {/* Recruiter create job page */}
      <Route
        path="/jobs/create"
        element={
          <ProtectedRoute>
                            <Header />

            <CreateJob />
            create job
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
