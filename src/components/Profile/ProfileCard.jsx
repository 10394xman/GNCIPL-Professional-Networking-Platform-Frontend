// src/components/Profile/ProfileCard.jsx

import { MapPin, Plus, Eye } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * ProfileCard Component
 * 
 * Sidebar profile card displaying current user's basic information
 * 
 * Features:
 * - Profile picture with upload button
 * - User name, title, and location
 * - Profile views and connections count
 * - Quick create post button
 * - Responsive design
 * - Hover effects and animations
 * 
 * Design:
 * - Cover image with gradient
 * - Profile picture overlay
 * - Clean typography hierarchy
 * - Call-to-action buttons
 * 
 * Props: None (uses global context)
 * State: None (stateless component)
 */
function ProfileCard() {
  const { state, dispatch } = useAppContext();
  const user = state.currentUser;

  /**
   * Handle profile picture upload (mock)
   */
  const handleProfilePictureUpload = () => {
    // In real app, would open file picker
    console.log('Profile picture upload clicked');
    // Mock implementation
    alert('Profile picture upload feature will be implemented with backend integration');
  };

  /**
   * Handle create post action
   */
  const handleCreatePost = () => {
    dispatch({ type: 'SET_MODAL', payload: 'createPost' });
  };

  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden hover:shadow-md transition-shadow duration-200">
      
      {/* Cover Image */}
      <div className="relative h-20 bg-gradient-to-r from-blue-500 to-blue-600">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-10">
          <div className="absolute top-2 right-2 w-16 h-16 border border-white border-opacity-20 rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-8 h-8 border border-white border-opacity-20 rounded-full"></div>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="relative px-4 pb-4 -mt-10">
        
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover group-hover:shadow-xl transition-shadow duration-200"
            />
            
            {/* Upload Overlay */}
            <button
              onClick={handleProfilePictureUpload}
              className="absolute inset-0 w-20 h-20 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
              aria-label="Upload profile picture"
            >
              <Plus className="w-6 h-6 text-black" />
            </button>
          </div>
          
          {/* User Information */}
          <div className="text-center mt-3 w-full">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
              {user.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 leading-snug">
              {user.title}
            </p>
            <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{user.location}</span>
            </div>
          </div>
          
          {/* Profile Stats */}
          <div className="w-full mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              
              {/* Profile Views */}
              <div className="flex justify-between items-center text-sm group cursor-pointer">
                <div className="flex items-center text-gray-600">
                  <Eye className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Profile views</span>
                </div>
                <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  247
                </span>
              </div>
              
              {/* Connections Count */}
              <div className="flex justify-between items-center text-sm group cursor-pointer">
                <div className="flex items-center text-gray-600">
                  <div className="w-4 h-4 mr-2 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span>Connections</span>
                </div>
                <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  {user.connections.toLocaleString()}
                </span>
              </div>
              
              {/* Profile Strength */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Profile strength</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-green-600 font-medium text-xs">Strong</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="w-full mt-4 space-y-2">
            
            {/* Create Post Button */}
            <button
              onClick={handleCreatePost}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group"
            >
              <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Create Post</span>
            </button>
            
            {/* View Profile Button */}
            <button
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'profile' })}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 text-sm font-medium"
            >
              View Full Profile
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
    </div>
  );
}

export default ProfileCard;