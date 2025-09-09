// src/components/Posts/PostFeed.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../redux/PostSlice";
import PostCard from "./PostCard";
import CreatePostPrompt from "./CreatePostPrompt";

const PostFeed = () => {
  const dispatch = useDispatch();
  const { posts, status } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <CreatePostPrompt />
      {status === "loading" && <p className="text-gray-400">Loading posts...</p>}
      {status === "failed" && <p className="text-red-500">Failed to load posts.</p>}
      {Array.isArray(posts) &&
        posts.map((post) => <PostCard key={post._id} post={post} />)}
    </div>
  );
};

export default PostFeed;

