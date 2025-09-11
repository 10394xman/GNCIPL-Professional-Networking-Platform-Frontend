import React from "react";
import PostFeed from "../Posts/PostFeed";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#0B1530] text-white p-6">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Welcome to Global Connect 🚀</h1>
        <p className="text-gray-400">Share your thoughts with the community</p>
      </header>

      {/* Posts Feed */}
      <main>
        <PostFeed />
      </main>
    </div>
  );
};

export default Dashboard;
