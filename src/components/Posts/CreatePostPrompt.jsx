import React, { useState } from "react";

const CreatePostPrompt = () => {
  const [postText, setPostText] = useState("");

  const handlePost = (e) => {
    e.preventDefault();
    alert("Post created: " + postText); // Dummy only
    setPostText("");
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
