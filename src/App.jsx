import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header.jsx";
import ProfilePage from "./components/Profile/ProfilePage.jsx";
import ProfileCard from "./components/Profile/ProfileCard.jsx";
import { AppProvider } from "./context/AppContext";
import MessagingPage from "./components/Messaging/MessagingPage.jsx";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./components/pages/Dashboard";


function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes with Header */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Header />
                <main className="max-w-6xl mx-auto mt-8 px-4">
                  <Dashboard />
                </main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Header />
                <main className="max-w-6xl mx-auto mt-8 px-4">
                  <ProfilePage />
                </main>
              </ProtectedRoute>
            }
          />
          {/* Example: Sidebar profile card on a dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Header />
                <main className="max-w-6xl mx-auto mt-8 px-4">
                  <Dashboard />
                </main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Header />
                <main className="max-w-6xl mx-auto mt-8 px-4">
                  <MessagingPage />
                </main>
              </ProtectedRoute>
            }
          />
          {/* Add more protected routes for other features/pages as needed */}

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
