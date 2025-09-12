// src/components/Layout/Header.jsx
import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
const apiBase = import.meta.env.VITE_BACKEND_URL
/**
 * Header Component
 *
 * Main navigation header with responsive design and comprehensive features
 *
 * Features:
 * - Responsive navigation (desktop/mobile)
 * - Global search functionality
 * - Real-time notification badges
 * - User profile dropdown
 * - Active tab highlighting
 * - Mobile hamburger menu
 * - Accessibility support
 *
 * Security Features:
 * - XSS protection in search input
 * - Secure logout functionality
 * - CSRF token ready
 *
 * Props: None (uses global context)
 * State: showProfileMenu, showMobileMenu, searchQuery
 */
function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  /**
   * Handle user logout with cleanup
   */
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      // Optionally handle error
    }
    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // Clear any session data
    sessionStorage.clear();
    setShowProfileMenu(false);
    window.location.reload();
  };

  /**
   * Handle tab navigation
   * @param {string} tabName - Tab to navigate to
   */
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setShowMobileMenu(false); // Close mobile menu on navigation
    if (tabName === "messaging") {
      navigate("/messages");
    } else if (tabName === "home") {
      navigate("/dashboard");
    } else if (tabName === "network") {
      navigate("/network");
    } else if (tabName === "jobs") {
      navigate("/jobs");
    } else if (tabName === "notifications") {
      navigate("/dashboard");
    } else if (tabName === "profile") {
      navigate("/profile");
    }
  };

  /**
   * Handle search submission
   * @param {Event} e - Form submit event
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Sanitize search query : This approach helps prevent injection of HTML or script tags that could be malicious
      const sanitizedQuery = searchQuery.replace(/[<>]/g, "").trim();
      dispatch({ type: "SET_SEARCH_QUERY", payload: sanitizedQuery });
      // In real app, trigger search API call
      console.log("Searching for:", sanitizedQuery);
    }
  };

  /**
   * Get unread notification count
   */
  // TODO: Replace with Redux notifications if available
  const unreadCount = 0;

  /**
   * Navigation items configuration
   */
  const navigationItems = [
    { key: "home", icon: Home, label: "Home", mobileOnly: false },
    { key: "network", icon: Users, label: "Network", mobileOnly: false },
    { key: "jobs", icon: Briefcase, label: "Jobs", mobileOnly: false },
    { key: "messaging", icon: MessageSquare, label: "Messages", mobileOnly: false },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Search Section */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white font-bold text-lg px-3 py-1 rounded shadow-sm">
                GC
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Global Connect
              </span>
            </div>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search professionals, jobs, posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 xl:w-96 bg-gray-100 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-sm"
                  maxLength="100"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => handleTabClick(key)}
                className={`relative flex flex-col items-center p-3 text-xs font-medium transition-all duration-200 rounded-md ${
                  activeTab === key
                    ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
                aria-label={label}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{label}</span>
                {/* Badge for messages: implement if you have messages in Redux */}
              </button>
            ))}

            {/* Notifications */}
            <button
              onClick={() => handleTabClick("notifications")}
              className={`relative flex flex-col items-center p-3 text-xs font-medium transition-all duration-200 rounded-md ${
                activeTab === "notifications"
                  ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 mb-1" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </button>
          </nav>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              onClick={() => {
                /* Open mobile search modal */
              }}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Profile menu"
              >
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                />
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {user?.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/profile");
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        dispatch({ type: "SET_MODAL", payload: "editProfile" });
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Account Settings
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              aria-label="Mobile menu"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => handleTabClick(key)}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      activeTab === key
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}

              {/* Mobile Notifications */}
              <button
                onClick={() => handleTabClick("notifications")}
                className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-md transition-colors relative ${
                  activeTab === "notifications"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mt-4 px-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  maxLength="100"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns (using portal) */}
      {(showProfileMenu || showMobileMenu) &&
        createPortal(
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowProfileMenu(false);
              setShowMobileMenu(false);
            }}
          />,
          document.body
        )}
    </header>
  );
}

export default Header;