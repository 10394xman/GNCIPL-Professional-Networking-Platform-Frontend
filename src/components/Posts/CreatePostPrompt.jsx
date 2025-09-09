// src/components/Posts/CreatePostPrompt.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../redux/PostSlice";

const CreatePostPrompt = () => {
  const dispatch = useDispatch();
  const [postText, setPostText] = useState("");
  const [file, setFile] = useState(null); // 👈 media support

  const handlePost = (e) => {
    e.preventDefault();
    if (!postText.trim() && !file) return;

    const formData = new FormData();
    formData.append("content", postText);
    if (file) {
      formData.append("media", file); // 👈 backend supports multiple too
    }

    dispatch(createPost(formData));
    setPostText("");
    setFile(null);
  };

  return (
    <div className="bg-black/30 p-4 rounded-xl shadow-lg mb-6">
      <form onSubmit={handlePost} className="flex flex-col space-y-3">
        {/* Post Text */}
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-[#0B1530] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
          rows="3"
          name="content" // 👈 accessibility fix
          id="postContent"
        />

        {/* File Upload */}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 
                     file:rounded-full file:border-0 
                     file:text-sm file:font-semibold 
                     file:bg-[#4285F4] file:text-white 
                     hover:file:bg-[#357AE8] cursor-pointer"
          name="media" // 👈 accessibility fix
          id="postMedia"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="self-end px-6 py-2 bg-[#4285F4] hover:bg-[#357AE8] text-white rounded-lg transition"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePostPrompt;
