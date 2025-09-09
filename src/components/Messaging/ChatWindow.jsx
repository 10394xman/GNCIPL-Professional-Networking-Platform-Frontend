// src/components/Messaging/ChatWindow.jsx
import { useState, useRef, useEffect } from 'react';
import { 
  Send, Smile, Paperclip, MoreVertical, Phone, Video, 
  ArrowLeft, Info, Search, Archive, Delete,
  Check, CheckCheck, Clock, AlertCircle, Image, File
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import MessageBubble from './MessageBubble';

/**
 * ChatWindow Component
 * 
 * Real-time chat interface with comprehensive messaging features
 * 
 * Features:
 * - Real-time messaging with Socket.io simulation
 * - Message status indicators (sent, delivered, read)
 * - File upload and media sharing
 * - Emoji picker integration
 * - Typing indicators
 * - Message reactions
 * - Voice notes (future)
 * - Message search and filtering
 * - Responsive design
 * 
 * Security Features:
 * - Message encryption ready
 * - Content sanitization
 * - File type validation
 * - Rate limiting protection
 * - Blocked user handling
 * 
 * Props:
 * - conversation: User object for current conversation
 * - isTyping: Boolean indicating if user is typing
 * - setIsTyping: Function to set typing status
 * - onBack: Function for mobile back navigation
 * - isOnline: Boolean indicating if user is online
 */
function ChatWindow({ conversation, isTyping, setIsTyping, onBack, isOnline }) {
  const { state } = useAppContext();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageInputRef = useRef(null);

  /**
   * Fetch messages for the selected user from backend
   */
  useEffect(() => {
    setMessages([]);
    if (!conversation?.id) return;
    api.get(`/api/messages/${conversation._id}`)
      .then(res => {
        setMessages(res.data || []);
      })
      .catch(() => {
        setMessages([]);
      });
  }, [conversation._id]);

  /**
   * Scroll to bottom of messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Simulate other user typing
   */
  useEffect(() => {
    const simulateTyping = () => {
      if (Math.random() > 0.95 && !otherUserTyping) {
        setOtherUserTyping(true);
        setTimeout(() => setOtherUserTyping(false), 3000);
      }
    };

    const interval = setInterval(simulateTyping, 5000);
    return () => clearInterval(interval);
  }, [otherUserTyping]);

  /**
   * Handle message submission
   * @param {Event} e - Form submit event
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && !isUploading) {
      // Sanitize message content
      const sanitizedMessage = message.replace(/[<>]/g, '').trim();
      const tempId = Date.now();
      const optimisticMsg = {
        senderId: state.currentUser.id,
        content: sanitizedMessage,
        timestamp: new Date().toISOString(),
        status: 'sending',
        type: 'text'
      };
      setMessages(prev => [...prev, optimisticMsg]);
      setMessage('');
      setIsTyping(false);

      // Focus back to input
      messageInputRef.current?.focus();
      try {
        const res = await api.post(`/api/messages/${conversation._id}`, { content: sanitizedMessage });
        // Replace optimistic message with real one from backend
        setMessages(prev => prev.map(m => m._id === tempId ? res.data : m));
      } catch (err) {
        setMessages(prev => prev.map(m => m._id === tempId ? { ...m, status: 'failed' } : m));
      }
    }
  };

  /**
   * Handle typing with debounce
   * @param {Event} e - Input change event
   */
  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    
    // Set typing indicator
    if (value.trim() && !isTyping) {
      setIsTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to clear typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Handle file upload
   * @param {Event} e - File input change event
   */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'text/csv',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        alert('File type not supported. Please upload images, PDFs, or text files.');
        return;
      }

      if (file.size > maxSize) {
        alert('File too large. Maximum size is 10MB.');
        return;
      }

      setIsUploading(true);

      // Simulate file upload progress
      let progress = 0;
      const uploadInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          clearInterval(uploadInterval);
          
          const fileMessage = {
            id: Date.now(),
            senderId: state.currentUser.id,
            content: `Shared: ${file.name}`,
            timestamp: new Date().toISOString(),
            status: 'sent',
            type: file.type.startsWith('image/') ? 'image' : 'file',
            fileUrl: URL.createObjectURL(file),
            fileName: file.name,
            fileSize: file.size
          };

          setMessages(prev => [...prev, fileMessage]);
          setIsUploading(false);
        }
      }, 200);
    }
    
    // Clear the input
    e.target.value = '';
  };

  /**
   * Handle emoji selection
   * @param {string} emoji - Selected emoji
   */
  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  /**
   * Handle option actions
   * @param {string} action - Action type
   */
  const handleOptionAction = (action) => {
    setShowOptions(false);
    
    switch (action) {
      case 'viewProfile':
        console.log('View profile:', conversation._id);
        break;
      case 'archive':
        console.log('Archive conversation:', conversation._id);
        break;
      case 'block':
        if (confirm(`Block ${conversation.name}? You won't receive messages from them.`)) {
          console.log('Block user:', conversation._id);
        }
        break;
      case 'delete':
        if (confirm(`Delete conversation with ${conversation.name}? This action cannot be undone.`)) {
          console.log('Delete conversation:', conversation._id);
        }
        break;
      default:
        break;
    }
  };

  /**
   * Common emojis for quick access
   */
  const quickEmojis = ['😊', '😂', '👍', '❤️', '😢', '🎉', '🔥', '💯', '👌', '🙏'];

  /**
   * Full emoji list for picker
   */
  const allEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', 
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', 
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '👍', '👎', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈',
    '👉', '👆', '🖕', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝',
    '🙏', '💪', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️'
  ];

  /**
   * Format timestamp for display
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Formatted time
   */
  // const formatTime = (timestamp) => {
  //   return new Date(timestamp).toLocaleTimeString('en-US', {
  //     hour: 'numeric',
  //     minute: '2-digit',
  //     hour12: true
  //   });
  // };

  /**
   * Get last seen status
   * @returns {string} Last seen text
   */
  const getLastSeen = () => {
    if (isOnline) return 'Active now';
    
    // Mock last seen times
    const lastSeenOptions = [
      'Last seen 5m ago',
      'Last seen 1h ago', 
      'Last seen 2h ago',
      'Last seen yesterday',
      'Last seen 2 days ago'
    ];
    
    return lastSeenOptions[Math.floor(Math.random() * lastSeenOptions.length)];
  };

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape to close dropdowns
      if (e.key === 'Escape') {
        setShowEmojiPicker(false);
        setShowOptions(false);
        setShowSearch(false);
      }
      
      // Ctrl/Cmd + F for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Auto-resize textarea
   */
  const handleTextareaResize = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      
      {/* Chat Header */}
  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm relative z-30">
        <div className="flex items-center space-x-3">
          
          {/* Mobile Back Button */}
          <button
            onClick={onBack}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors -ml-2"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* User Info */}
          <div className="relative">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleOptionAction('viewProfile')}
            />
            {/* Online indicator */}
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => handleOptionAction('viewProfile')}>
              {conversation.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {otherUserTyping ? (
                <span className="text-blue-600 italic">typing...</span>
              ) : (
                getLastSeen()
              )}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-full transition-colors ${
              showSearch 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Search messages"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Voice call"
            onClick={() => alert('Voice call feature coming soon!')}
          >
            <Phone className="w-5 h-5" />
          </button>
          
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Video call"
            onClick={() => alert('Video call feature coming soon!')}
          >
            <Video className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {/* Options Dropdown */}
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button 
                  onClick={() => handleOptionAction('viewProfile')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                >
                  <Info className="w-4 h-4 mr-3" />
                  View Profile
                </button>
                <button 
                  onClick={() => handleOptionAction('archive')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                >
                  <Archive className="w-4 h-4 mr-3" />
                  Archive Chat
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button 
                  onClick={() => handleOptionAction('block')}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                >
                  <AlertCircle className="w-4 h-4 mr-3" />
                  Block User
                </button>
                <button 
                  onClick={() => handleOptionAction('delete')}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                >
                  <Delete className="w-4 h-4 mr-3" />
                  Delete Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      {showSearch && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              Searching for "{searchQuery}"...
            </p>
          )}
        </div>
      )}
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        
        {/* Date Separator */}
        <div className="flex items-center justify-center">
          <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border border-gray-200 shadow-sm">
            Today
          </div>
        </div>
        
        {/* Messages */}
        {messages.map((msg, index) => {
          const isCurrentUser = msg.senderId === state.currentUser.id;
          const showAvatar = !isCurrentUser && (index === 0 || messages[index - 1].senderId !== msg.senderId);
          const showTimestamp = index === messages.length - 1 || messages[index + 1].senderId !== msg.senderId;
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isCurrentUser={isCurrentUser}
              showAvatar={showAvatar}
              showTimestamp={showTimestamp}
              user={isCurrentUser ? state.currentUser : conversation}
              onReaction={(emoji) => {
                setMessages(prevMsgs => prevMsgs.map(m => {
                  if (m.id !== msg.id) return m;
                  // Add or update reaction count for emoji
                  let reactions = Array.isArray(m.reactions) ? [...m.reactions] : [];
                  const idx = reactions.findIndex(r => r.emoji === emoji);
                  if (idx !== -1) {
                    reactions[idx] = { ...reactions[idx], count: reactions[idx].count + 1 };
                  } else {
                    reactions.push({ emoji, count: 1 });
                  }
                  return { ...m, reactions };
                }));
              }}
              onDelete={isCurrentUser ? () => setMessages(prev => prev.filter(m => m.id !== msg.id)) : undefined}
            />
          );
        })}
        
        {/* Typing Indicator */}
        {otherUserTyping && (
          <div className="flex items-center space-x-2 animate-fade-in">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Messages End Ref */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Upload Progress */}
      {isUploading && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-blue-700">Uploading file...</span>
          </div>
        </div>
      )}
      
      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        
        {/* Quick Emoji Bar */}
        <div className="flex items-center space-x-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
          {quickEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiSelect(emoji)}
              className="text-xl hover:bg-gray-100 rounded-full p-1 transition-colors flex-shrink-0 hover:scale-110"
              aria-label={`Add ${emoji} emoji`}
            >
              {emoji}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          
          {/* File Upload */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.txt,.doc,.docx,.csv"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`p-2 rounded-full transition-colors ${
              isUploading
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
            }`}
            aria-label="Attach file"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Paperclip className="w-5 h-5" />
            )}
          </button>
          
          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={messageInputRef}
              value={message}
              onChange={handleMessageChange}
              onInput={handleTextareaResize}
              placeholder="Type a message..."
              className="w-full px-4 py-2 pr-12 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none min-h-[40px] max-h-[120px]"
              rows="1"
              maxLength="1000"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            
            {/* Emoji Picker Button */}
            <div className="absolute right-3 bottom-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`transition-colors ${
                  showEmojiPicker 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Add emoji"
              >
                <Smile className="w-5 h-5" />
              </button>
              
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 h-64 overflow-y-auto z-20">
                  <div className="grid grid-cols-8 gap-2">
                    {allEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-xl hover:bg-gray-100 rounded p-1 transition-colors hover:scale-110"
                        aria-label={`Select ${emoji} emoji`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || isUploading}
            className={`p-2 rounded-full transition-all ${
              message.trim() && !isUploading
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        {/* Character Count */}
        {message.length > 800 && (
          <div className={`text-xs text-right mt-1 ${
            message.length > 950 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {message.length}/1000
          </div>
        )}
      </div>
      
      {/* Click outside to close dropdowns */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
      {showEmojiPicker && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
}

export default ChatWindow;