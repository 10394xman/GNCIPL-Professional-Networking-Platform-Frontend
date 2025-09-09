// src/components/Profile/ProfilePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Edit, MapPin, Mail, Phone,
  Briefcase, GraduationCap, Award, Plus,
  Globe, Github, Twitter
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * ProfilePage Component
 * 
 * Complete user profile page with comprehensive information display
 * 
 * Features:
 * - Professional header with cover photo
 * - Editable profile information
 * - Experience timeline
 * - Education history
 * - Skills with endorsements
 * - Contact information
 * - Social links
 * - Activity feed
 * - Responsive design
 * 
 * Sections:
 * - Header (cover, profile pic, basic info)
 * - About section
 * - Experience section
 * - Education section  
 * - Skills section
 * - Contact information
 * 
 * Props: None (uses global context)
 * State: activeSection for mobile navigation
 */
function ProfilePage() {
  const { state, dispatch } = useAppContext();
  const user = state.currentUser;
  const [activeSection, setActiveSection] = useState('about');
  const navigate = useNavigate();

  /**
   * Handle edit profile action
   */
  const handleEditProfile = () => {
    dispatch({ type: 'SET_MODAL', payload: 'editProfile' });
  };

  /**
   * Handle cover photo upload (mock)
   */
  const handleCoverUpload = () => {
    console.log('Cover photo upload clicked');
    alert('Cover photo upload feature coming soon!');
  };

  /**
   * Handle profile picture upload (mock)
   */
  const handleProfileUpload = () => {
    console.log('Profile picture upload clicked');
    alert('Profile picture upload feature coming soon!');
  };

  /**
   * Profile sections for mobile navigation
   */
  const profileSections = [
    { key: 'about', label: 'About' },
    { key: 'experience', label: 'Experience' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' },
    { key: 'contact', label: 'Contact' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        
        {/* Cover Photo Section */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600">
          {/* Cover Photo Overlay */}
          <div className="absolute inset-0 bg-opacity-20">
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-32 h-32 border border-white border-opacity-20 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border border-white border-opacity-20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-white bg-opacity-30 rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white bg-opacity-40 rounded-full"></div>
          </div>
          
          {/* Cover Upload Button */}
          <button
            onClick={handleCoverUpload}
            className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-2 rounded-md hover:bg-opacity-30 transition-all duration-200 flex items-center text-sm"
          >
            <Camera className="w-4 h-4 mr-2" />
            Edit Cover
          </button>
        </div>
        
        {/* Profile Information */}
        <div className="relative px-6 pb-6 -mt-16 md:-mt-20">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
            
            {/* Profile Picture */}
            <div className="relative mb-4 md:mb-0">
              <div className="relative group">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-6 border-white shadow-xl object-cover mx-auto md:mx-0"
                />
                <button
                  onClick={handleProfileUpload}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors group"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* User Info & Actions */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {user.name}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 mb-2">
                    {user.title}
                  </p>
                  <div className="flex items-center justify-center md:justify-start text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{user.location}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleEditProfile}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate('/messages')}
                    className="bg-blue-100 text-blue-700 px-6 py-2 rounded-md hover:bg-blue-200 transition-colors flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Message
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors">
                    More
                  </button>
                </div>
              </div>
              
              {/* Profile Stats */}
              <div className="flex items-center justify-center md:justify-start space-x-6 text-sm text-gray-600">
                <div className="text-center md:text-left">
                  <span className="font-semibold text-gray-900">{user.connections.toLocaleString()}</span>
                  <span className="ml-1">connections</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="font-semibold text-gray-900">1,247</span>
                  <span className="ml-1">followers</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="font-semibold text-gray-900">847</span>
                  <span className="ml-1">profile views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Section Navigation */}
      <div className="md:hidden bg-white rounded-lg shadow border p-2">
        <div className="flex overflow-x-auto space-x-2">
          {profileSections.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Section */}
          <div className={`bg-white rounded-lg shadow border p-6 ${
            activeSection !== 'about' ? 'hidden md:block' : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">About</h2>
              <button className="text-blue-600 hover:text-blue-700">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {user.about}
            </p>
          </div>

          {/* Experience Section */}
          <div className={`bg-white rounded-lg shadow border p-6 ${
            activeSection !== 'experience' ? 'hidden md:block' : ''
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
              <button className="text-blue-600 hover:text-blue-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-6">
              {user.experience.map((exp, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{exp.role}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.from} - {exp.to}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          Leading a team of developers in building scalable web applications 
                          and implementing modern development practices.
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className={`bg-white rounded-lg shadow border p-6 ${
            activeSection !== 'education' ? 'hidden md:block' : ''
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Education</h2>
              <button className="text-blue-600 hover:text-blue-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-6">
              {user.education.map((edu, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{edu.school}</h3>
                        <p className="text-blue-600 font-medium">{edu.degree}</p>
                        <p className="text-sm text-gray-500">{edu.from} - {edu.to}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className={`bg-white rounded-lg shadow border p-6 ${
            activeSection !== 'skills' ? 'hidden md:block' : ''
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
              <button className="text-blue-600 hover:text-blue-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {user.skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <Award className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{skill}</h4>
                      <p className="text-sm text-gray-500">
                        {Math.floor(Math.random() * 50) + 10} endorsements
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Endorse
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Contact Information */}
          <div className={`bg-white rounded-lg shadow border p-6 ${
            activeSection !== 'contact' ? 'hidden lg:block' : ''
          }`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Website</p>
                  <p className="font-medium text-blue-600">portfolio.alexrodriguez.dev</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                {/* <LinkedIn className="w-5 h-5 text-blue-600" /> */}
                <span className="text-gray-700">LinkedIn Profile</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Github className="w-5 h-5 text-gray-800" />
                <span className="text-gray-700">GitHub Profile</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <Twitter className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">Twitter Profile</span>
              </button>
            </div>
          </div>

          {/* Profile Analytics */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Analytics</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Profile views (30 days)</span>
                <span className="font-semibold text-gray-900">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Search appearances</span>
                <span className="font-semibold text-gray-900">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Post views</span>
                <span className="font-semibold text-gray-900">1,234</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View detailed analytics →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;