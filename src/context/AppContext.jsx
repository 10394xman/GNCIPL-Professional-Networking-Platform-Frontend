// src/context/AppContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

// Create Context
const AppContext = createContext();

// Initial State
const initialState = {
  // User Management
  user: null,
  currentUser: {
    id: 0,
    name: "Alex Rodriguez",
    title: "Full Stack Developer",
    location: "Austin, TX",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    connections: 420,
    email: "alex.rodriguez@email.com",
    phone: "+1 (555) 123-4567",
    about: "Passionate full-stack developer with 4+ years of experience building scalable web applications. Love working with modern technologies and solving complex problems.",
    skills: ["React", "Node.js", "MongoDB", "AWS", "Python", "Docker"],
    experience: [
      { company: "TechStart", role: "Senior Full Stack Developer", from: "2022", to: "Present" },
      { company: "WebSolutions", role: "Frontend Developer", from: "2020", to: "2022" }
    ],
    education: [
      { school: "University of Texas", degree: "BS Computer Science", from: "2016", to: "2020" }
    ]
  },
  
  // Users Database
  users: [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Software Engineer at Microsoft",
      location: "Seattle, WA",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      connections: 850,
      isConnected: false,
      skills: ["React", "Node.js", "Python", "AWS"],
      experience: [
        { company: "Microsoft", role: "Senior Software Engineer", from: "2021", to: "Present" },
        { company: "Google", role: "Software Engineer", from: "2019", to: "2021" }
      ]
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Product Manager at Google",
      location: "Mountain View, CA",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      connections: 1200,
      isConnected: true,
      skills: ["Product Strategy", "Data Analysis", "Leadership"],
      experience: [
        { company: "Google", role: "Product Manager", from: "2020", to: "Present" },
        { company: "Facebook", role: "Associate PM", from: "2018", to: "2020" }
      ]
    }
  ],
  
  // Posts Feed
  posts: [
    {
      id: 1,
      userId: 1,
      content: "Excited to share that our team just launched a revolutionary AI feature that improves user productivity by 40%! The journey from concept to production was incredible. Special thanks to my amazing team. #AI #ProductLaunch #TeamWork",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
      timestamp: "2h",
      likes: 127,
      comments: 23,
      isLiked: false,
      shares: 15
    },
    {
      id: 2,
      userId: 2,
      content: "Just completed an amazing workshop on design thinking. The power of human-centered design never ceases to amaze me. What's your favorite design principle?",
      timestamp: "5h",
      likes: 89,
      comments: 34,
      isLiked: true,
      shares: 8
    }
  ],
  
  // Jobs Database
  jobs: [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      skills: ["React", "TypeScript", "Node.js"],
      salary: "$120K - $150K",
      posted: "2 days ago",
      applicants: 45,
      description: "We're looking for a senior frontend developer to join our growing team and help build the next generation of web applications."
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      skills: ["Product Strategy", "Analytics", "Leadership"],
      salary: "$130K - $160K",
      posted: "1 week ago",
      applicants: 78,
      description: "Join our product team to drive innovation and growth in the fintech space."
    }
  ],
  
  // Messages
  messages: [
    {
      id: 1,
      senderId: 2,
      receiverId: 0,
      content: "Hey! Saw your post about the AI feature. Would love to connect and discuss potential collaboration opportunities.",
      timestamp: "10:30 AM",
      read: false
    }
  ],
  
  // Notifications
  notifications: [
    {
      id: 1,
      type: "connection",
      message: "Sarah Johnson accepted your connection request",
      timestamp: "2h ago",
      read: false
    },
    {
      id: 2,
      type: "like",
      message: "Michael Chen liked your post",
      timestamp: "4h ago",
      read: false
    }
  ],
  
  // UI State
  activeTab: 'home',
  showModal: null,
  searchQuery: '',
  isLoading: false,
  error: null
};

// Reducer Function
function appReducer(state, action) {
  switch (action.type) {
    // UI Actions
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_MODAL':
      return { ...state, showModal: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    // User Actions
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_CURRENT_USER':
      return { ...state, currentUser: { ...state.currentUser, ...action.payload } };
    
    // Post Actions
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'TOGGLE_LIKE':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1
              }
            : post
        )
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.postId
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      };
    
    // Connection Actions
    case 'TOGGLE_CONNECTION':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload
            ? { ...user, isConnected: !user.isConnected }
            : user
        )
      };
    
    // Notification Actions
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        )
      };
    
    default:
      return state;
  }
}

// Provider Component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  const value = {
    state,
    dispatch
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom Hook to use App Context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export default AppContext;