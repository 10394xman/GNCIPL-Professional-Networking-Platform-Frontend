import React from "react";
import CreatePostPrompt from "../posts/CreatePostPrompt";
import PostFeed from "../posts/PostFeed";

function Dashboard() {
  return (
    <div className="dashboard-container p-4">
      {/* Post creation prompt */}
      <CreatePostPrompt />

      {/* Feed of all posts */}
      <PostFeed />
    </div>
  );
}

export default Dashboard;

