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
function App() {
  return (
    <AppProvider>
      <Router>
        <Header />
        <main className="max-w-6xl mx-auto mt-8 px-4">
          <Routes>
            <Route path="/" element={<Navigate to="/profile" />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Example: Sidebar profile card on a dashboard route */}
            <Route path="/dashboard" element={<ProfileCard />} />
            <Route path="/messages" element={<MessagingPage />} />
            {/* Add more routes for other features/pages */}
          </Routes>
        </main>
      </Router>
    </AppProvider>
  );
}

export default App;
