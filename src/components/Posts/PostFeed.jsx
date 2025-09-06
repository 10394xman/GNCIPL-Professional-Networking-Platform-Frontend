import React from "react";
import PostCard from "./PostCard";
import CreatePostPrompt from "./CreatePostPrompt";

const dummyPosts = [
  {
    id: 1,
    userName: "Nitin Mishra",
    userAvatar: "https://i.pravatar.cc/50?img=1",
    time: "2 hrs ago",
    content: "Excited to start working on Global Connect 🚀",
    image: "https://source.unsplash.com/600x300/?tech,code",
  },
  {
    id: 2,
    userName: "Kavya",
    userAvatar: "https://i.pravatar.cc/50?img=2",
    time: "5 hrs ago",
    content: "Frontend design is coming together beautifully ✨",
  },
];

const PostFeed = () => {
  return (
    <div className="max-w-xl mx-auto p-4">
      <CreatePostPrompt />
      {dummyPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
