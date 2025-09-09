import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../redux/PostSlice";

const CreatePostPrompt = () => {
  const [postText, setPostText] = useState("");
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handlePost = (e) => {
    e.preventDefault();

    if (!postText && !file) {
      alert("Post cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("content", postText);
    if (file) formData.append("media", file);

    dispatch(createPost(formData));

    setPostText("");
    setFile(null);
  };

  return (
    <div className="bg-black/30 p-4 rounded-xl shadow-lg mb-6">
      <form onSubmit={handlePost} className="flex flex-col space-y-3">
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-[#0B1530] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
          rows="3"
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-white"
        />

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
