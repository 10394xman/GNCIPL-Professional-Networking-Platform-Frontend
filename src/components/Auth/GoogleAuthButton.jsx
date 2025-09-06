import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle, setLoading } from "../../redux/AuthSlice";

const GoogleAuthButton = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);

  const handleGoogleAuth = () => {
    dispatch(setLoading());
    setTimeout(() => {
      const googleToken = "mock-google-token-from-popup";
      dispatch(loginWithGoogle(googleToken));
    }, 1000);
  };

  return (
    <button
      onClick={handleGoogleAuth}
      className="w-full border border-gray-300 p-2 rounded flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
      disabled={authStatus === "loading"}
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        className="w-5 h-5 mr-2"
      />
      {authStatus === "loading" ? "Loading..." : "Continue with Google"}
    </button>
  );
};

export default GoogleAuthButton;
