import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router";
import io, { Socket } from "socket.io-client";
const apiBase = import.meta.env.VITE_BACKEND_URL
const Authcontext = createContext<any | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [allMessages, setAllMessages] = useState<any[]>([]);

  const navigate = useNavigate();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<{
    _id: string;
    name: string;
    email: string;
    profilepic: string;
    updatedAt: string;
    preferences: [];
  }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typing, setTyping] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<{
    _id: string;
    name: string;
    email: string;
    profilepic: string;
    updatedAt: string;
    preferences: [];
  } | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const userTheme = localStorage.getItem("theme") || "coffee";
  const [theme, setTheme] = useState<string>(userTheme);
  const [pageReloaded, setPageReloaded] = useState<boolean>(true);
  const selectedUserRef = useRef(selectedUser);

  useEffect(() => {
    if (!socket) return;
    const handleShowTypingStatus = ({ from }: any) => {
      if (from == selectedUser?._id) {
        console.log("selected User is Typing: ", from);
        setTyping(true);
        clearTimeout((handleShowTypingStatus as any).timeout);
        (handleShowTypingStatus as any).timeout = setTimeout(
          () => setTyping(false),
          2000
        );
      }
    };

    socket?.on("showTypingStatus", handleShowTypingStatus);

    return () => {
      socket.off("showTypingStatus", handleShowTypingStatus);
      clearTimeout((handleShowTypingStatus as any).timeout);
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${apiBase}/api/messages`, {
        withCredentials: true,
      });
      console.log("All Users: ", response.data);
      setAllUsers(response.data);
    } catch (err) {
      console.log("Error getting allUsers: ", err);
    }
  };
  const getAllMessagesForSelectedUser = async (id: string) => {
    try {
      const response = await axios.get(`${apiBase}/api/messages/${id}`, {
        withCredentials: true,
      });
      console.log(
        "Messages are feched: length:  ",
        response.data.allMessages.length
      );
      setAllMessages(response.data.allMessages);
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSendTypingStatus = (to: String, from: string) => {
    socket?.emit("sendTypingStatus", { to: to, from: from });
  };
  const connectToSocket = (id: string) => {
    console.log("UserDetails at socket formation: ", userDetails);
    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      query: {
        userId: id,
      },
    });
    if (socket.connected) {
      console.log("Already connected! ");
      return;
    }
    socket.connect();

    socket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
      setTimeout(() => {
        console.log("All online users: ", userIds);
        getAllUsers();
      }, 2000);
    });
    socket.on("newMessage", (newMessage) => {
      if (selectedUserRef?.current?._id == `${newMessage?.senderId}`) {
        setAllMessages((prev: any) => [...prev, newMessage]);
        //tells that the message is rendered on teh user's page and read realtime
        socket.emit("read", newMessage);
      }
    });
    socket.on("deletedMessage", (deletedMessage) => {
      // console.log("Deleted message socket emitted: ", deletedMessage)
      console.log(`allMessages: ${allMessages}\n${deletedMessage._id}`);
      setAllMessages((prev: any) =>
        prev.filter((ele: any) => ele._id !== deletedMessage._id)
      );
      // console.log("TEMPMEssAGEs: ", tempAllMessages)
    });
    socket.on("updatedMessage", (updatedMessage) => {
      setAllMessages((prev: any) => {
        const temp = prev.map((ele: any) => {
          if (ele._id === updatedMessage._id) {
            return updatedMessage;
          } else {
            return ele;
          }
        });
        return temp;
      });
      // socket.emit("read", updatedMessage);
    });
    socket.on("readUpdated", (messageId) => {
      setAllMessages((prev: any[]) => {
        return prev.map((ele: any, index: number) => {
          if (ele._id == messageId) {
            ele.isRead = true;
            console.log("REad is Set to true!");
          }
          return ele;
        });
      });
    });
    console.log("FE user connected: ", socket.id);
    socket.on("connect", () => {
      console.log("client connected ", socket?.id);
    });
    setSocket(socket);

    console.log("socket: ", socket);
  };
  // NOTE:
  // while appeding the mesage into the new message which is commin from the sender oyou have to also
  //  send a socket emit event to the sender saying where the message is read or not if the array
  // is appended with the message then the mess age is asud to be read otherwise no!

  // const handleTypingStatus = () =>{
  //   socket?.emit("sendTypingStatus", {to: selectedUser?._id, from: userDetails?._id});

  //   socket?.on("ShowTypingStatus", ({from})=>{
  //     console.log("selcted user typing!")
  //     if(from === selectedUser?._id) {
  //       console.log("selected User is Typing");
  //     }
  //   })
  // }
  const disconnectFromSocket = () => {
    if (!isUserLoggedIn && !socket?.connected) {
      console.log("user not authenticated for socket disconnection!");
      return;
    }

    console.log("client connected ", socket?.id);
    socket?.disconnect();
  };
  const sendMessage = async (text: any | null, files: File[] | null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const formData = new FormData();
      if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("media", file); // backend must accept multiple "media"
      });
    }
      if (text) formData.append("text", text);
      const response = await axios.post(
        `${apiBase}/api/messages/${
          selectedUser?._id
        }`,
        formData,
        {
          withCredentials: true
        }
      );
      console.log("API Response after sending message: ", response?.data);
      setAllMessages((prev: any) => [...prev, response.data]);
    } catch (err) {
      console.log("error sending the message: ", err);
    }
  };
  const sendBase64Message = async (text: any | null, file: string | null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (text) formData.append("text", text);
      const response = await axios.post(
        `${apiBase}/api/messages/${
          selectedUser?._id
        }`,
        {
          file: file,
          text: text,
        },
        {
          withCredentials: true
        }
      );
      console.log("API Response after sending message: ", response?.data);
      setAllMessages((prev: any) => [...prev, response.data]);
    } catch (err) {
      console.log("error sending the message: ", err);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found!");
        navigate("/signin");
        return;
      }
      await axios.delete(`${apiBase}/api/messages/${messageId}`, {
        withCredentials: true,
      });
      console.log("Deleted!");
    } catch (err) {
      console.log("Error in deleting message: ", err);
    } finally {
      setLoading(false);
    }
  };
  const editMessage = async (messageId: string, text: any) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found and modification denied!");
        return;
      }
      const response = await axios.put(
        `${apiBase}/api/messages/${messageId}`,
        {
          text: text,
        },
        {
          withCredentials: true,
        }
      );
      setAllMessages((prev: any) => {
        const temp = prev.map((ele: any) => {
          if (ele._id === messageId) {
            ele.text = text;
            return ele;
          } else {
            return ele;
          }
        });
        return temp;
      });
      console.log("After edit req: ", response.data);
    } catch (err) {
      console.log("Error in editing the message: ", err);
    }
  };

  return (
    <Authcontext.Provider
      value={{
        isUserLoggedIn,
        setIsUserLoggedIn,
        openForm,
        setOpenForm,
        userDetails,
        setUserDetails,
        loading,
        setLoading,
        theme,
        setTheme,
        pageReloaded,
        setPageReloaded,
        socket,
        onlineUsers,
        selectedUser,
        setSelectedUser,
        allUsers,
        getAllMessagesForSelectedUser,
        sendMessage,
        sendBase64Message,
        deleteMessage,
        editMessage,
        selectedUserRef,
        inputRef,
        handleSendTypingStatus,
        typing,
        setTyping,
        allMessages,
        setAllMessages,
        connectToSocket
      }}
    >
      {children}
    </Authcontext.Provider>
  );
};
export const auth = () => useContext<any>(Authcontext);

export default AuthProvider;
