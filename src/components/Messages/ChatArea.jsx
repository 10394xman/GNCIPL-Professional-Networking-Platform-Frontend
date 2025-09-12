import { useState, useEffect, useRef } from "react";
import { auth } from "./authWrapper";
// import { formatedTime } from "../utils/arraymethods"; // Make sure this import is correct
import axios from "axios";
import AllUsers from "./AllUsers";

const ChatArea = () => {
  const sendButtonRef = useRef(null);
  const editButtonRef = useRef(null);
  const editingMessageRef = useRef(null);
  const inputImageRef = useRef(null);
  const inputFileRef = useRef(null);
  const messageRef = useRef(null);

  const {
    userDetails,
    selectedUser,
    setSelectedUser,
    onlineUsers,
    allMessages,
    setAllMessages,
    sendMessage,
    sendBase64Message,
    deleteMessage,
    editMessage,
    loading,
    inputRef,
    handleSendTypingStatus,
    typing,
    setTyping,
  } = auth();

  const [editing, setEditing] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [Base64Image, setBase64Image] = useState(null);
  const [isSideBarVisible, setIsSideBarVisible] = useState(true);
  const [moreVisibleFor, setMoreVisibleFor] = useState(null);
  const [file, setFile] = useState([]);
  const myId = userDetails?._id;

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setFadeIn(true);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [loading]);
const renderFile = (filePath) => {
  if (!filePath) return null;

  const extension = filePath.split(".").pop().toLowerCase();
  const fileURL = `${import.meta.env.VITE_BACKEND_URL}${filePath}`;
  const fileName = filePath.split("/").pop();

  // Display full image
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
    return (
      <img
        src={fileURL}
        alt="uploaded file"
        style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
      />
    );
  }

  // File card for other files
  return (
    <a
      href={fileURL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        backgroundColor: "#1f2937", // dark gray
        color: "#f3f4f6", // light text
        borderRadius: "8px",
        textDecoration: "none",
        width: "fit-content",
        margin: "4px 0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}
    >
      <span
        style={{
          fontSize: "20px",
          marginRight: "10px",
        }}
      >
        📎
      </span>
      <span
        style={{
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {fileName}
      </span>
    </a>
  );
};




  const calculateBase64URL = () => {
    const file = inputImageRef.current?.files?.[0];
    if (!file) return null;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log("FileReader.result: ", fileReader.result);
      setBase64Image(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const handleSend64Message = () => {
    const file = inputImageRef.current?.files?.[0];
    const text = inputRef.current?.value.trim();
    console.log("The file useRef: ", file);

    if (!Base64Image && text) {
      sendBase64Message(inputRef.current?.value, null);
    }
    if (!text && Base64Image) {
      console.log("empty text");
      sendBase64Message(null, file);
      console.log("selected image: ", Base64Image);
    }
    if (Base64Image && text) {
      sendBase64Message(inputRef.current?.value, Base64Image);
    }

    if (inputImageRef.current) inputImageRef.current.value = "";
    console.log("Deleted image from useRef: ", inputImageRef.current?.files);
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = inputRef.current?.value;

    if (!text && file.length === 0) {
      alert("Please enter a message or select file(s).");
      return;
    }

    const formData = new FormData();
    if (text) formData.append("text", text);
    file.forEach((file1) => formData.append("media", file1)); // ✅ multiple files

    try {
      const res = await axios.post(
        `/api/messages/${selectedUser?._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setAllMessages((prev) => [...prev, res.data])
      console.log("Response:", res.data);
      alert("✅ Message sent!");

      // Reset state
      if (inputRef.current) inputRef.current.value = "";
      setFile([]);
      setBase64Image(null);
      if (inputFileRef.current) inputFileRef.current.value = "";
      if (inputImageRef.current) inputImageRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send message");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      messageRef?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [allMessages, typing]);

  useEffect(() => {
    const handleEnterPress = (e) => {
      if (e.key === "Enter" && document.activeElement === inputRef.current) {
        if (e.shiftKey) return;

        if (!editing) {
          sendButtonRef.current?.click();
          console.log("enter Key pressed");
        } else {
          editButtonRef.current?.click();
          console.log("enter Key pressed on edit");
        }
        return;
      }
      console.log("A key is pressed ");
    };

    document.addEventListener("keydown", handleEnterPress);
    return () => document.removeEventListener("keydown", handleEnterPress);
  }, [editing]);

  return (
    <div
      className={`bg-gray-800 w-full h-[calc(100dvh-84px)] flex flex-row justify-between rounded-4xl backdrop-brightness-110 border border-current/10 fade-in ${
        !fadeIn ? "" : "loaded"
      }`}
    >
      <div
        className={`flex flex-wrap justify-around max-[769px]:${
          isSideBarVisible ? "block" : "hidden"
        } max-[769px]:w-full w-[36vw] rounded-tr-2xl`}
      >
        <AllUsers setIsSideBarVisible={setIsSideBarVisible} />{" "}
      </div>

      {selectedUser ? (
        <div
          className={`flex item-center justify-center max-[769px]:w-full max-[769px]:${
            isSideBarVisible ? "hidden" : "block"
          } w-[64vw]`}
        >
          <div
            className={`flex flex-col flex-wrap justify-between max-[769px]:w-full max-[769px]:${
              isSideBarVisible ? "hidden" : "block"
            } w-[64vw]`}
          >
            <div className="h-[60px] border-b border-base-300/80 flex items-center justify-start gap-2 px-4 shrink-0">
              {/* back button */}
              <button
                type="button"
                className="hidden max-[769px]:flex active:scale-85 active:bg-white/50 transition-transform delay-200 ease-in-out rounded-2xl"
                onClick={() => {
                  setIsSideBarVisible(true);
                  setSelectedUser(null);
                  setAllMessages([]);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </button>

              <div className="p-2.5 ">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}

                    <div className="avatar">
                      <div className="size-10 rounded-full relative">
                        <img
                          src={
                            selectedUser?.profilepic ||
                            "https://t4.ftcdn.net/jpg/05/89/93/27/240_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                          }
                        />
                      </div>
                    </div>

                    {/* User info */}
                    <div>
                      <h3 className="font-medium">{selectedUser?.name}</h3>
                      <p className="text-sm text-base-content/70 text-left">
                        {onlineUsers.includes(selectedUser?._id)
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {console.log(
              "Message component rendered!",
              Array.isArray(allMessages),
              allMessages
            )}
            {/* actual chat messages! */}
            <div className="transition-all ease-in-out delay-100 flex-1 flex-wrap wrap-anywhere overflow-y-auto px-4 py-2 space-y-2 max-[769px]:h-[calc(70dvh)]">
              {allMessages?.map((ele, index) => (
                <div
                  className={`chat ${
                    myId !== ele.senderId ? "chat-start" : "chat-end"
                  }`}
                  key={index}
                >
                  <div className="chat-image avatar"></div>
                  <div className="chat-header">
                    {ele.senderId === userDetails?._id
                      ? "You"
                      : selectedUser.name}
                    <time className="text-xs opacity-50"></time>
                  </div>
                  <div className="relative chat-bubble max-w-[75%] text-left">
                    {/* {ele.image && (
                      <div>
                        {" "}
                        <img src={`${ele.files}`} className="h-40" /> <br />
                      </div>
                    )} */}
                    {ele.files?.map((e)=>(<div>{renderFile(e)}</div>))}
                    {/* FIXED: Display actual message text instead of hardcoded "helllooo" */}
                    {ele.text}
                    {ele.senderId === userDetails?._id && !editing && (
                      <div
                        title={"more"}
                        className="absolute right-0 top-0.5 p-0 cursor-pointer rounded-full hover:bg-white/20 active:bg-white/40"
                      >
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={() =>
                            setMoreVisibleFor((prev) =>
                              prev === ele._id ? null : ele._id
                            )
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5 lg:size-4 p-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                    {moreVisibleFor &&
                    !editing &&
                    moreVisibleFor === ele._id ? (
                      <div className="absolute top-4 right-4 flex flex-wrap wrap-anywhere flex-col w-[160px] transition-all delay-200 ease-in-out bg-accent/70 rounded-xl rounded-tr-[2px] p-2 text-xs border z-30">
                        <button
                          type="button"
                          className="text-error font-bold p-1 cursor-pointer hover:scale-95 active:scale-90"
                          onClick={() => {
                            deleteMessage(`${ele._id}`);
                            setAllMessages((prev) =>
                              prev.filter((items) => items._id !== ele._id)
                            );
                          }}
                        >
                          Delete for everyone
                        </button>
                        <button
                          type="button"
                          className="text-accent-content font-bold p-1 cursor-pointer hover:scale-95 active:scale-90"
                          onClick={() => {
                            if (inputRef?.current) {
                              inputRef.current.value = ele.text;
                              setEditing(true);
                              editingMessageRef.current = `${ele._id}`;
                              inputRef.current.focus();
                              setMoreVisibleFor(null);
                            }
                          }}
                        >
                          Edit Message
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <div className="chat-footer opacity-50">
                    {ele.senderId === userDetails?._id && ele.isRead
                      ? "read"
                      : ""}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="chat chat-start">
                  <div className="relative chat-bubble max-w-[75%] text-left bg-accent/20 animate-pulse transition-all ease-in-out">
                    Typing...
                  </div>{" "}
                </div>
              )}
              <div ref={messageRef} />
            </div>
            <div className="relative h-[60px] flex items-center justify-start gap-2 px-6 border-t border-base-300">
              {/* attach / image button */}
              {/* // file attach */}
              <button
                type="button"
                onClick={() => {
                  inputFileRef.current?.click();
                }}
                className="rounded-full active:bg-white/20 active:scale-90 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                  />
                </svg>
              </button>
            
              {/* // ---------------- FILE INPUTS ---------------- */}
             
              <input
                type="file"
                ref={inputFileRef}
                 accept=".jpg,.jpeg,.png,.gif,.mp4,.mov,.avi,.mkv,.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                multiple // ✅ allow multiple files
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(Array.from(e.target.files)); // ✅ always store as array
                  }
                }}
                className="hidden"
              />
              {/* // ---------------- FILE PREVIEW ---------------- */}
              {file.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-300">
                  {file.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-lg"
                    >
                      📎{" "}
                      {f.name.length > 20
                        ? f.name.slice(0, 10) + "..." + f.name.slice(-7)
                        : f.name}
                      <button
                        type="button"
                        className="ml-1 text-red-400 hover:text-red-600"
                        onClick={() =>
                          setFile((prev) => prev.filter((_, i) => i !== idx))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {Base64Image && (
                <div className="absolute bottom-15 left-6 h-30 border border-base-200 shadow-2xs shadow-accent-content rounded-2xl rounded-bl-[0px] ">
                  <img
                    src={`${Base64Image}`}
                    alt="selected img"
                    className="h-30 rounded-2xl rounded-bl-[0px] opacity-80"
                  />{" "}
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-accent rounded-full active:bg-accent-content"
                    onClick={() => {
                      setBase64Image(null);
                      if (inputImageRef?.current) {
                        inputImageRef.current.value = "";
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="size-7 stroke-accent-content  active:stroke-accent"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              
              <input
                type="text"
                ref={inputRef}
                onFocus={() => {
                  inputRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                onChange={() => {
                  console.log(
                    "THe changed inputRef Val: ",
                    inputRef.current?.value
                  );
                  handleSendTypingStatus(selectedUser?._id, userDetails?._id);
                }}
                placeholder="Type Something"
                className="p-2 border border-base-300 rounded-2xl w-full focus:outline focus:outline-accent-content/50 focus:border focus:border-accent-content"
              />
              {/*direct send button */}
              <button
                type="button"
                onClick={(e) => {
                  setTyping(false);
                  // sendMessage(inputRef.current?.value.trim(), file)
                  handleSubmit(e);
                  setBase64Image(null);
                  inputRef.current?.value
                    ? (inputRef.current.value = "")
                    : null;
                }}
                ref={sendButtonRef}
                className={`${
                  editing ? "hidden" : "block"
                } active:scale-85 active:bg-white/30 rounded-full hover:scale-95 cursor-pointer`}
              >
                {/* send button */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </button>
              {/* is editing done send button */}
              <button
                type="button"
                onClick={() => {
                  editMessage(
                    editingMessageRef.current,
                    inputRef.current?.value
                  );
                  console.log(
                    "The modification req text: ",
                    inputRef.current?.value
                  );
                  editingMessageRef.current = null;
                  setEditing(false);
                  inputRef.current?.value
                    ? (inputRef.current.value = "")
                    : null;
                }}
                ref={editButtonRef}
                className={`${
                  editing ? "block" : "hidden"
                } active:scale-85 active:bg-white/30 rounded-full hover:scale-95 cursor-pointer`}
              >
                {/* edit done button */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flex item-center justify-center max-[769px]:w-full max-[769px]:${
            isSideBarVisible ? "hidden" : "block"
          } w-[64vw]`}
        >
          <div className="flex flex-col flex-wrap wrap-anywhere justify-center items-center max-[769px]:hidden w-[100%] h-[100%]">
            <img
              src="/messaging.svg"
              alt="messaging"
              className="size-90 opacity-70"
            />
            Select and start chatting
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
