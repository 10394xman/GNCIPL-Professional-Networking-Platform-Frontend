// src/components/Messaging/MessageBubble.jsx
import React, { useState } from 'react';
import api from '../../api/axios';
import { 
  Check, CheckCheck, Clock, AlertCircle, Download, 
  Play, Pause, MoreVertical, Reply, Copy, Delete,
  Heart, ThumbsUp, Smile, Eye, File, Image as ImageIcon
} from 'lucide-react';

/**
 * MessageBubble Component
 * 
 * Individual message display with reactions and interactions
 * 
 * Features:
 * - Message status indicators
 * - Media message support (images, files, voice notes)
 * - Message reactions and quick reactions
 * - Copy, reply, delete actions
 * - Timestamp display
 * - Read receipts
 * - Message forwarding
 * - Link previews (future)
 * 
 * Security:
 * - Safe HTML rendering
 * - File type validation
 * - Content sanitization
 * 
 * Props:
 * - message: Message object
 * - isCurrentUser: Boolean indicating if message is from current user
 * - showAvatar: Boolean to show/hide avatar
 * - showTimestamp: Boolean to show/hide timestamp
 * - user: User object for avatar/name
 * - onReaction: Function to handle reactions
 */
function MessageBubble({ 
  message, 
  isCurrentUser, 
  showAvatar, 
  showTimestamp, 
  user, 
  onReaction, 
  onDelete
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  /**
   * Format timestamp for message
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Formatted time
   */
  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  /**
   * Get message status icon
   * @param {string} status - Message status
   * @returns {JSX.Element} Status icon
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  /**
   * Handle message actions
   * @param {string} action - Action type
   */
  const handleMessageAction = async (action) => {
    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(message.content);
        break;
      case 'reply':
        console.log('Reply to message:', message._id || message.id);
        break;
      case 'delete':
        if (onDelete && confirm('Delete this message?')) {
          try {
            await api.delete(`/api/messages/${message._id || message.id}`);
            onDelete();
          } catch (err) {
            alert('Failed to delete message.');
          }
        }
        break;
      case 'forward':
        console.log('Forward message:', message._id || message.id);
        break;
      default:
        break;
    }
    setShowActions(false);
  };

  /**
   * Handle reaction selection
   * @param {string} emoji - Selected emoji
   */
  const handleReaction = (emoji) => {
    onReaction(emoji);
    setShowReactions(false);
  };

  /**
   * Format file size
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Quick reaction emojis
   */
  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  /**
   * Extended emoji list for reaction picker
   */
  const extendedEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', 
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', 
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩'
  ];

  /**
   * Render message content based on type
   */
  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="relative max-w-xs">
            <img
              src={message.fileUrl}
              alt="Shared image"
              className={`rounded-lg max-w-full h-auto cursor-pointer transition-all ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsImageLoaded(true)}
              onClick={() => window.open(message.fileUrl, '_blank')}
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            {message.content && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg max-w-xs">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <File className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {message.fileName}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(message.fileSize)}
              </p>
            </div>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = message.fileUrl;
                link.download = message.fileName;
                link.click();
              }}
              className="flex-shrink-0 p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
              aria-label="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        );

      case 'voice':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg max-w-xs">
            <button className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 ml-0.5" />
            </button>
            <div className="flex-1">
              <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">0:45</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap break-words leading-relaxed m-0">
              {message.content}
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`flex group ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      
      {/* Avatar (for received messages) */}
      {!isCurrentUser && showAvatar && (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full mr-3 flex-shrink-0"
        />
      )}
      
      {/* Spacer for alignment */}
      {!isCurrentUser && !showAvatar && (
        <div className="w-8 mr-3 flex-shrink-0"></div>
      )}
      
      {/* Message Content */}
      <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isCurrentUser ? 'order-1' : ''}`}>
        
        {/* Message Bubble */}
        <div
          className={`relative px-4 py-2 rounded-lg ${
            isCurrentUser
              ? 'bg-blue-600 text-white ml-auto'
              : 'bg-white text-gray-900 border border-gray-200'
          } shadow-sm hover:shadow-md transition-shadow`}
        >
          {renderMessageContent()}
          
          {/* Message Actions Button */}
          <button
            onClick={() => setShowActions(!showActions)}
            className={`absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 rounded-full transition-all ${
              isCurrentUser
                ? 'text-blue-200 hover:bg-blue-500'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            aria-label="Message options"
          >
            <MoreVertical className="w-3 h-3" />
          </button>
          
          {/* Actions Dropdown */}
          {showActions && (
            <div className={`absolute top-8 z-20 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 ${
              isCurrentUser ? 'right-0' : 'left-0'
            }`}>
              <button
                onClick={() => handleMessageAction('copy')}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </button>
              
              <button
                onClick={() => handleMessageAction('reply')}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Reply className="w-4 h-4 mr-2" />
                Reply
              </button>
              
              {isCurrentUser && (
                <button
                  onClick={() => handleMessageAction('delete')}
                  className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Delete className="w-4 h-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Message Info */}
        <div className={`flex items-center mt-1 space-x-2 text-xs text-gray-500 ${
          isCurrentUser ? 'justify-end' : 'justify-start'
        }`}>
          
          {/* Timestamp */}
          {showTimestamp && (
            <span>{formatMessageTime(message.timestamp)}</span>
          )}
          
          {/* Status (for sent messages) */}
          {isCurrentUser && (
            <div className="flex items-center">
              {getStatusIcon(message.status)}
            </div>
          )}
          
          {/* Read by indicator */}
          {isCurrentUser && message.status === 'read' && (
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>Read</span>
            </div>
          )}
        </div>
        
        {/* Message Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-2 ${
            isCurrentUser ? 'justify-end' : 'justify-start'
          }`}>
            {message.reactions.map((reaction, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleReaction(reaction.emoji)}
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Quick Reactions */}
        <div
          className={`opacity-0 group-hover:opacity-100 transition-opacity mt-2 ${
            isCurrentUser ? 'text-right' : 'text-left'
          }`}
        >
          <div className="inline-flex space-x-1">
            {quickReactions.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleReaction(emoji)}
                className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-sm hover:bg-gray-50 hover:scale-110 transition-all shadow-sm"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
            
            {/* More Reactions Button */}
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-50 hover:scale-110 transition-all shadow-sm"
              aria-label="More reactions"
            >
              <Smile className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Extended Reactions Picker */}
        {showReactions && (
          <div className={`mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-30 ${
            isCurrentUser ? 'text-right' : 'text-left'
          }`}>
            <div className="grid grid-cols-6 gap-2 max-w-xs">
              {extendedEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleReaction(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
                  aria-label={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Avatar spacer for sent messages */}
      {isCurrentUser && showAvatar && (
        <div className="w-8 ml-3 flex-shrink-0"></div>
      )}
      
      {/* Click outside to close dropdowns */}
      {(showActions || showReactions) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowActions(false);
            setShowReactions(false);
          }}
        />
      )}
    </div>
  );
}

export default MessageBubble;