// src/components/Messaging/ChatWindow.jsx
import { useState, useRef, useEffect } from 'react';
import { 
  Send, Smile, Paperclip, MoreVertical, Phone, Video, 
  ArrowLeft, Info, Search, Archive, Delete,
  Check, CheckCheck, Clock, AlertCircle, Image, File
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import axiosInstance from "../../utils/axiosInstance";
import MessageBubble from './MessageBubble';

/**
 * ChatWindow Component
 * 
 * Real-time chat interface with comprehensive messaging features
 */
function ChatWindow({ conversation, isTyping, setIsTyping, onBack, isOnline, currentUser }) {
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

  // Helper function to normalize user ID comparison
  const normalizeUserId = (id) => {
    return id ? String(id) : '';
  };

  // Helper function to get current user ID
  const getCurrentUserId = () => {
    return normalizeUserId(currentUser?._id || currentUser?.id);
  };

  // Helper function to determine if message is from current user
  const isMessageFromCurrentUser = (message) => {
    const messageSenderId = normalizeUserId(message.senderId || message.userId || message.sender?._id || message.sender?.id);
    const currentUserId = getCurrentUserId();
    return messageSenderId === currentUserId && currentUserId !== '';
  };

  /**
   * Fetch messages for the selected user from backend
   */
  useEffect(() => {
    setMessages([]);
    if (!conversation?._id) return;
    
    axiosInstance.get(`/messages/${conversation._id}`)
      .then(res => {
        const fetchedMessages = res.data.allMessages || [];
        console.log('Fetched messages:', fetchedMessages);
        console.log('Current user:', currentUser);
        
        // Normalize message structure and add missing status
        const normalizedMessages = fetchedMessages.map(msg => ({
          ...msg,
          // Ensure consistent sender identification
          senderId: msg.senderId || msg.userId || msg.sender?._id || msg.sender?.id,
          // Add status if missing (for existing messages, assume 'read')
          status: msg.status || 'read',
          // Ensure content field
          content: msg.content || msg.text || '',
          // Ensure timestamp
          timestamp: msg.timestamp || msg.createdAt || new Date().toISOString()
        }));
        
        console.log('Normalized messages:', normalizedMessages);
        setMessages(normalizedMessages);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
        setMessages([]);
      });
  }, [conversation?._id, currentUser]);

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
   * Simulate message status progression
   */
  const simulateMessageStatusProgression = (tempId) => {
    // Sent status (immediate)
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.tempId === tempId ? { ...m, status: 'sent' } : m
      ));
    }, 500);

    // Delivered status
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.tempId === tempId ? { ...m, status: 'delivered' } : m
      ));
    }, 1500);

    // Read status
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.tempId === tempId ? { ...m, status: 'read' } : m
      ));
    }, 3000);
  };

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

  // Helper to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /**
   * Handle message submission
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && !isUploading) {
      // Sanitize message content
      const sanitizedMessage = message.replace(/[<>]/g, '').trim();
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      const currentUserId = getCurrentUserId();
      
      // Create optimistic message
      const optimisticMsg = {
        tempId,
        _id: tempId, // Fallback ID
        senderId: currentUserId,
        content: sanitizedMessage,
        text: sanitizedMessage, // Fallback field
        timestamp: new Date().toISOString(),
        status: 'sending',
        type: 'text'
      };

      console.log('Sending optimistic message:', optimisticMsg);
      
      setMessages(prev => {
        const newMessages = Array.isArray(prev) ? [...prev, optimisticMsg] : [optimisticMsg];
        console.log('Updated messages with optimistic:', newMessages);
        return newMessages;
      });
      
      setMessage('');
      setIsTyping(false);

      // Focus back to input
      messageInputRef.current?.focus();

      try {
        const response = await axiosInstance.post(`/messages/${conversation._id}`, {
          text: sanitizedMessage
        });

        console.log('Backend response:', response.data);

        if (response.data) {
          // Replace optimistic message with real one from backend
          setMessages(prev => prev.map(m => {
            if (m.tempId === tempId) {
              return {
                ...response.data,
                senderId: response.data.senderId || response.data.userId || currentUserId,
                status: response.data.status || 'sent',
                content: response.data.content || response.data.text || sanitizedMessage,
                tempId: undefined // Remove temp ID
              };
            }
            return m;
          }));

          // Start status progression simulation
          simulateMessageStatusProgression(response.data._id || response.data.id);
        }
      } catch (err) {
        console.error('Error sending message:', err);
        // Mark message as failed
        setMessages(prev => prev.map(m => 
          m.tempId === tempId ? { ...m, status: 'failed' } : m
        ));
      }
    }
  };

  /**
   * Handle typing with debounce
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
   */
  const handleFileUpload = async (e) => {
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
      const tempId = `temp_file_${Date.now()}_${Math.random()}`;
      const currentUserId = getCurrentUserId();
      
      const optimisticMsg = {
        _id: tempId,
        tempId,
        senderId: currentUserId,
        content: `Shared: ${file.name}`,
        timestamp: new Date().toISOString(),
        status: 'sending',
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileName: file.name,
        fileSize: file.size
      };
      
      setMessages(prev => [...prev, optimisticMsg]);

      try {
        const base64 = await fileToBase64(file);
        const res = await axiosInstance.post(`/messages/${conversation._id}`, {
          text: '',
          file: base64
        });
        setMessages(prev => prev.map(m => 
          m.tempId === tempId ? {
            ...res.data,
            senderId: res.data.senderId || currentUserId,
            status: 'sent'
          } : m
        ));
      } catch (err) {
        console.error('Error uploading file:', err);
        setMessages(prev => prev.map(m => 
          m.tempId === tempId ? { ...m, status: 'failed' } : m
        ));
      }
      setIsUploading(false);
    }
    // Clear the input
    e.target.value = '';
  };

  /**
   * Handle emoji selection
   */
  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  /**
   * Handle option actions
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
    '👍', '👎', '👌', '🤝', '✌️', '🤞', '🤟', '🤘', '🤙', '👈',
    '👉', '👆', '🖕', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝',
    '🙏', '💪', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️'
  ];

  /**
   * Get last seen status
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
        {(Array.isArray(messages) ? messages : []).map((msg, index) => {
          // Determine if message is from current user
          const isCurrentUserMessage = isMessageFromCurrentUser(msg);
          const senderId = msg.senderId || msg.userId || msg.sender?._id || msg.sender?.id;
          
          // Debug logging
          console.log(`Message ${index}:`, {
            msg,
            senderId,
            currentUserId: getCurrentUserId(),
            isCurrentUserMessage
          });
          
          // Determine avatar and timestamp display logic
          const showAvatar = !isCurrentUserMessage && (
            index === 0 || 
            !isMessageFromCurrentUser(messages[index - 1])
          );
          
          const showTimestamp = (
            index === messages.length - 1 || 
            isMessageFromCurrentUser(messages[index + 1]) !== isCurrentUserMessage
          );
          
          return (
            <MessageBubble
              key={msg._id || msg.id || msg.tempId || index}
              message={msg}
              isCurrentUser={isCurrentUserMessage}
              showAvatar={showAvatar}
              showTimestamp={showTimestamp}
              user={isCurrentUserMessage ? currentUser : conversation}
              currentUser={currentUser}
              onReaction={(emoji) => {
                const messageId = msg._id || msg.id || msg.tempId;
                setMessages(prevMsgs => prevMsgs.map(m => {
                  const mId = m._id || m.id || m.tempId;
                  if (mId !== messageId) return m;
                  
                  let reactions = Array.isArray(m.reactions) ? [...m.reactions] : [];
                  const existingReactionIndex = reactions.findIndex(r => r.emoji === emoji);
                  
                  if (existingReactionIndex !== -1) {
                    reactions[existingReactionIndex] = { 
                      ...reactions[existingReactionIndex], 
                      count: reactions[existingReactionIndex].count + 1 
                    };
                  } else {
                    reactions.push({ emoji, count: 1 });
                  }
                  
                  return { ...m, reactions };
                }));
              }}
              onDelete={isCurrentUserMessage ? async () => {
                const messageId = msg._id || msg.id;
                if (!messageId) return;
                
                if (confirm('Delete this message?')) {
                  try {
                    await axiosInstance.delete(`/messages/${messageId}`);
                    setMessages(prev => prev.filter(m => 
                      (m._id || m.id || m.tempId) !== (msg._id || msg.id || msg.tempId)
                    ));
                  } catch (err) {
                    console.error('Failed to delete message:', err);
                    alert('Failed to delete message.');
                  }
                }
              } : undefined}
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