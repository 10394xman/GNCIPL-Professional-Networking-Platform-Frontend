import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../redux/PostSlice";
import PostCard from "./PostCard";
import CreatePostPrompt from "./CreatePostPrompt";

const PostFeed = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.posts);

  // ✅ Fetch posts on mount
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Create Post Box */}
      <CreatePostPrompt />

      {/* Loading State */}
      {status === "loading" && (
        <p className="text-gray-400 text-center mt-4">Loading posts...</p>
      )}

      {/* Error State */}
      {status === "failed" && (
        <p className="text-red-500 text-center mt-4">
          {error?.message || "Failed to load posts"}
        </p>
      )}

      {/* Posts List */}
      {status === "succeeded" && posts.length > 0 ? (
        posts.map((post, index) => (
          <PostCard
            key={post._id || `post-${index}`} // ✅ unique key fix
            post={post}
          />
        ))
      ) : (
        status === "succeeded" && (
          <p className="text-gray-400 text-center mt-4">No posts yet.</p>
        )
      )}
    </div>
  );
};

export default PostFeed;



