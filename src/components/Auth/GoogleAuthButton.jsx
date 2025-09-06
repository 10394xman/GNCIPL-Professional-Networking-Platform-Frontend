import React from "react";

const GoogleAuthButton = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleGoogleAuth = () => {
    // 🔗 Redirect user to backend Google OAuth
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleAuth}
      className="w-full border border-gray-300 p-2 rounded flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        className="w-5 h-5 mr-2"
      />
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;
