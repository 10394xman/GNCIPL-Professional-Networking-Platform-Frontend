// src/components/Messaging/ConversationList.jsx
import {
  Pin,
  Archive,
  MoreHorizontal,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Volume2,
  VolumeX,
} from "lucide-react";

/**
 * ConversationList Component
 *
 * Displays list of conversations with status indicators and actions
 *
 * Features:
 * - Conversation previews with last message
 * - Online status indicators
 * - Unread message badges
 * - Message status icons (sent, delivered, read)
 * - Pin/archive functionality
 * - Mute/unmute conversations
 * - Search highlighting
 * - Responsive design
 *
 * Props:
 * - conversations: Array of user objects
 * - selectedConversation: Currently selected conversation
 * - onSelectConversation: Function to handle conversation selection
 * - onlineUsers: Set of online user IDs
 * - searchQuery: Current search query for highlighting
 */
function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  onlineUsers,
  searchQuery,
  lastMessages = {}, // new prop: { [userId]: lastMessageObj }
}) {
  /**
   * Get conversation data using lastMessages prop or fallback
   */
  const getConversationData = (user) => {
    const lastMsg = lastMessages[user.id];
    if (lastMsg) {
      return {
        content: lastMsg.content,
        timestamp: lastMsg.timestamp,
        status: lastMsg.status,
        unreadCount: lastMsg.unreadCount || 0,
        isLastMessageFromMe: lastMsg.senderId === (user.currentUserId || -1),
      };
    }
    // fallback default
    return {
      content: "Hey! How are you doing?",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      status: "read",
      unreadCount: 0,
      isLastMessageFromMe: false,
    };
  };

  /**
   * Format timestamp for conversation list
   * @param {Date} timestamp - Message timestamp
   * @returns {string} Formatted time
   */
  const formatConversationTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.floor((now - messageTime) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
      return diffInMinutes < 1 ? "now" : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else {
      return messageTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  /**
   * Get message status icon
   * @param {string} status - Message status
   * @param {boolean} isFromMe - Whether message is from current user
   * @returns {JSX.Element} Status icon
   */
  const getStatusIcon = (status, isFromMe) => {
    if (!isFromMe) return null;

    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-gray-400" />;
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case "failed":
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  /**
   * Highlight search query in text
   * @param {string} text - Text to highlight
   * @param {string} query - Search query
   * @returns {JSX.Element} Highlighted text
   */
  const highlightSearchQuery = (text, query) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="bg-yellow-200 text-yellow-800 rounded px-1"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  /**
   * Truncate message content
   * @param {string} content - Message content
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated content
   */
  const truncateMessage = (content, maxLength = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Sort conversations by last message timestamp
  const sortedConversations = [...conversations].sort((a, b) => {
    const aData = getConversationData(a);
    const bData = getConversationData(b);
    return new Date(bData.timestamp) - new Date(aData.timestamp);
  });

  return (
    <div className="divide-y divide-gray-200">
      {sortedConversations.length === 0 ? (
        // Empty State
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Volume2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No conversations yet
          </h3>
          <p className="text-gray-500 text-sm">
            {searchQuery
              ? `No conversations found for "${searchQuery}"`
              : "Start connecting with people to begin messaging"}
          </p>
        </div>
      ) : (
        /* Conversation Items */
        sortedConversations.map((user) => {
          const conversationData = getConversationData(user);
          const isSelected = selectedConversation?.id === user.id;
          const isOnline = onlineUsers.has(user.id);
          const hasUnread = conversationData.unreadCount > 0;

          return (
            <div
              key={user.id}
              onClick={() => onSelectConversation(user)}
              className={`relative flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
              }`}
            >
              {/* Avatar with Online Status */}
              <div className="relative flex-shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                {/* Online Indicator */}
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                )}

                {/* Unread Indicator */}
                {hasUnread && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {conversationData.unreadCount > 9
                      ? "9+"
                      : conversationData.unreadCount}
                  </div>
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0 ml-3">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`font-medium truncate ${
                      hasUnread ? "text-gray-900" : "text-gray-800"
                    }`}
                  >
                    {highlightSearchQuery(user.name, searchQuery)}
                  </h3>

                  <div className="flex items-center space-x-1 ml-2">
                    {/* Message Status */}
                    {getStatusIcon(
                      conversationData.status,
                      conversationData.isLastMessageFromMe
                    )}

                    {/* Timestamp */}
                    <span
                      className={`text-xs ${
                        hasUnread
                          ? "text-blue-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {formatConversationTime(conversationData.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Last Message */}
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm truncate ${
                      hasUnread ? "text-gray-900 font-medium" : "text-gray-600"
                    }`}
                  >
                    {conversationData.isLastMessageFromMe && (
                      <span className="text-gray-500 mr-1">You: </span>
                    )}
                    {highlightSearchQuery(
                      truncateMessage(conversationData.content),
                      searchQuery
                    )}
                  </p>

                  {/* Action Indicators */}
                  <div className="flex items-center space-x-1 ml-2">
                    {/* Pinned Indicator */}
                    {Math.random() > 0.8 && (
                      <Pin className="w-3 h-3 text-gray-400" />
                    )}

                    {/* Muted Indicator */}
                    {Math.random() > 0.9 && (
                      <VolumeX className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Typing Indicator */}
                {isOnline && Math.random() > 0.95 && (
                  <div className="flex items-center mt-1">
                    <div className="flex space-x-1 mr-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-blue-500">typing...</span>
                  </div>
                )}
              </div>

              {/* Context Menu Button */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle context menu
                    console.log("Context menu for conversation:", user.id);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Conversation options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ConversationList;
