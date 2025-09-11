// src/components/Messaging/MessagingPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Phone,
  Video,
  Info,
  Archive,
  Delete,
  Pin,
  Settings,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";

import axiosInstance from "../../utils/axiosInstance";

/**
 * MessagingPage Component
 *
 * Main messaging interface with conversation management and chat functionality
 *
 * Features:
 * - Split-pane layout (conversations | chat)
 * - Real-time message updates
 * - Search conversations
 * - Create new conversations
 * - Message status indicators
 * - Responsive mobile/desktop views
 * - Keyboard shortcuts
 * - Message encryption ready
 *
 * Security Features:
 * - Message content sanitization
 * - User verification
 * - Rate limiting for messages
 * - Blocked user handling
 *
 * Props: None (uses global context)
 * State: selectedConversation, searchQuery, showNewChat, isTyping
 */

function MessagingPage() {
  const { state, dispatch } = useAppContext();
  const [currentUser, setCurrentUser] = useState(state.currentUser);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [showMobileChat, setShowMobileChat] = useState(false);
  // Add missing state for loading and error for users fetch
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Get connected users for conversations (memoized)
  const conversations = useMemo(
    () =>
      Array.isArray(availableUsers) && availableUsers.length > 0
        ? availableUsers.filter((user) => user.isConnected)
        : state.users.filter((user) => user.isConnected),
    [availableUsers, state.users]
  );

  // Filter conversations based on search
  const filteredConversations = conversations.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch connected users for chat from backend
  useEffect(() => {
    setLoading(true);
    setError(null);
    axiosInstance
      .get("/users/")
      .then((res) => {
        setAvailableUsers(res.data || []);
        // Find user whose _id or id matches state.currentUser.id
        let backendCurrentUser = null;
        if (res.data && res.data.length > 0) {
          backendCurrentUser = res.data.find(
            (u) =>
              String(u._id) === String(state.currentUser.id) ||
              String(u.id) === String(state.currentUser.id)
          );
        }
        if (backendCurrentUser) {
          setCurrentUser(backendCurrentUser);
          dispatch({
            type: "UPDATE_CURRENT_USER",
            payload: backendCurrentUser,
          });
        }
      })
      .catch((err) => {
        setError("Failed to load users.");
      })
      .finally(() => setLoading(false));
  }, [state.currentUser.id, dispatch]);

  // Compute last message for each conversation (user)
  const lastMessages = useMemo(() => {
    const map = {};
    conversations.forEach((user) => {
      // Find all messages between currentUser and this user
      const msgs = state.messages.filter(
        (m) =>
          (String(m.senderId) === String(currentUser._id || currentUser.id) &&
            String(m.receiverId) === String(user._id || user.id)) ||
          (String(m.senderId) === String(user._id || user.id) &&
            String(m.receiverId) === String(currentUser._id || currentUser.id))
      );
      if (msgs.length > 0) {
        // Sort by timestamp descending and take the last one
        const lastMsg = msgs
          .slice()
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        map[user._id || user.id] = lastMsg;
      }
    });
    return map;
  }, [conversations, state.messages, currentUser]);

  /**
   * Handle conversation selection
   * @param {Object} user - Selected user/conversation
   */
  const handleConversationSelect = (user) => {
    setSelectedConversation(user);
    setShowMobileChat(true); // Show chat on mobile

    // Mark messages as read (mock)
    console.log("Marking messages as read for user:", user.id);
  };

  /**
   * Handle new chat creation
   */
  const handleNewChat = () => {
    setShowNewChat(true);
  };

  /**
   * Handle search input with sanitization
   * @param {Event} e - Input event
   */
  const handleSearchChange = (e) => {
    const sanitizedQuery = e.target.value.replace(/[<>]/g, "").trim();
    setSearchQuery(sanitizedQuery);
  };

  /**
   * Simulate real-time online status
   */
  useEffect(() => {
    const updateOnlineStatus = () => {
      const randomUsers = new Set();
      conversations.forEach((user) => {
        if (Math.random() > 0.5) {
          randomUsers.add(user.id);
        }
      });
      setOnlineUsers(randomUsers);
    };

    updateOnlineStatus();
    const interval = setInterval(updateOnlineStatus, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, [conversations]);

  /**
   * Handle back to conversations (mobile)
   */
  const handleBackToConversations = () => {
    setShowMobileChat(false);
    setSelectedConversation(null);
  };

  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("message-search")?.focus();
      }

      // Escape to close search/new chat
      if (e.key === "Escape") {
        setShowNewChat(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewChat}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="New message"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-96 lg:h-[600px]">
        {/* Conversations Sidebar */}
        <div
          className={`w-full lg:w-1/3 lg:border-r border-gray-200 flex flex-col ${
            showMobileChat ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Sidebar Header */}
          <div className="hidden lg:block p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleNewChat}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  aria-label="New message"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="message-search"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                maxLength="100"
              />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                maxLength="100"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={filteredConversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleConversationSelect}
              onlineUsers={onlineUsers}
              searchQuery={searchQuery}
              lastMessages={lastMessages}
            />
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {filteredConversations.length} conversation
                {filteredConversations.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div
          className={`flex-1 flex flex-col ${
            !showMobileChat ? "hidden lg:flex" : "flex"
          }`}
        >
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
              onBack={handleBackToConversations}
              isOnline={onlineUsers.has(selectedConversation._id)}
              currentUser={currentUser}
            />
          ) : (
            <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 mb-6">
                  Choose from your existing conversations or start a new one
                </p>
                <button
                  onClick={handleNewChat}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onSelectUser={(user) => {
            setSelectedConversation(user);
            setShowNewChat(false);
            setShowMobileChat(true);
          }}
        />
      )}
    </div>
  );
}

/**
 * NewChatModal Component
 *
 * Modal for starting new conversations
 *
 * Props:
 * - onClose: Function to close modal
 */
function NewChatModal({ onClose, onSelectUser }) {
  const { state } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch connected users for chat from backend
  useEffect(() => {
    setLoading(true);
    setError(null);
    axiosInstance
      .get("/messages")
      .then((res) => {
        setAvailableUsers(res.data || []);
      })
      .catch((err) => {
        setError("Failed to load users.");
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Handle user selection
   * @param {Object} user - User to add to conversation
   */
  const handleUserSelect = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery("");
    if (onSelectUser) {
      onSelectUser(user);
    }
  };

  /**
   * Remove user from selection
   * @param {number} userId - User ID to remove
   */
  const handleUserRemove = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  /**
   * Start conversation
   */
  const handleStartConversation = () => {
    if (selectedUsers.length > 0) {
      console.log("Starting conversation with:", selectedUsers);
      // In real app, would create conversation and navigate to it
      onClose();
    }
  };

  /**
   * Handle search input change
   * @param {Event} e - Input change event
   */
  const handleSearchChange = (e) => {
    const sanitizedQuery = e.target.value.replace(/[<>]/g, "").trim();
    setSearchQuery(sanitizedQuery);
  };

  // Filter available users based on search and selection
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      selectedUsers.find((selected) => selected.id === user.id) === undefined
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold leading-none"
            aria-label="Close modal"
          ></button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search people..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              maxLength="100"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span>{user.name}</span>
                  <button
                    onClick={() => handleUserRemove(user.id)}
                    className="text-blue-600 hover:text-blue-800 font-bold leading-none"
                    aria-label={`Remove ${user.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User List */}
        <div className="max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading users...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.title}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? (
                <>No users found matching "{searchQuery}"</>
              ) : (
                "Start typing to search for people..."
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartConversation}
            disabled={selectedUsers.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedUsers.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Start Chat ({selectedUsers.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessagingPage;
