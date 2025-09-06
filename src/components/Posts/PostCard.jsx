import React from "react";

const PostCard = ({ post }) => {
  return (
    <div className="bg-black/20 p-4 rounded-xl shadow-md mb-6">
      {/* User Info */}
      <div className="flex items-center mb-3">
        <img
          src={post.userAvatar}
          alt={post.userName}
          className="w-10 h-10 rounded-full mr-3 border border-gray-600"
        />
        <div>
          <h3 className="font-semibold text-white">{post.userName}</h3>
          <p className="text-gray-400 text-sm">{post.time}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-200 mb-3">{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="rounded-lg w-full max-h-72 object-cover mb-3"
        />
      )}

      {/* Actions */}
      <div className="flex justify-between text-gray-400 text-sm">
        <button className="hover:text-[#4285F4]">👍 Like</button>
        <button className="hover:text-[#4285F4]">💬 Comment</button>
        <button className="hover:text-[#4285F4]">↗ Share</button>
      </div>
    </div>
  );
};

export default PostCard;
