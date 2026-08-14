import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Register from "./Register.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
function App() {
  
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [newChat, setnewChat] = useState(true);
  const [pendingTask, setpendingTask] = useState("");
  const [threads, setThreads] = useState([]);
  const [isViewingOldThread, setview] = useState(false);
  const [currthread, setcurrThread] = useState("");
  const [threadId, setThreadId] = useState(uuidv4());
  const [prevMessages, setprevMessages] = useState([]);
  const [refetch, setRefetch] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    newChat,
    setnewChat,
    pendingTask,
    setpendingTask,
    threads,
    setThreads,
    isViewingOldThread,
    setview,
    currthread,
    setcurrThread,
    threadId,
    setThreadId,
    prevMessages,
    setprevMessages,
    refetch,
    setRefetch,
    isSidebarOpen,
    setIsSidebarOpen,
  };
  useEffect(() => {
    if (!pendingTask || !reply) {
      return;
    }
    setprevMessages((prev) => [
      ...prev,
      { role: "user", content: pendingTask },
      { role: "assistant", content: reply },
    ]);
    setpendingTask("");
    setnewChat(false);
  }, [reply,pendingTask]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle sidebar on Ctrl+B or Ctrl+. (macOS Cmd+B / Cmd+.)
      if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B" || e.key === ".")) {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  if (!token) {
    return null;
  }
  return (
    <>
      <div className='chat-page'>
          <MyContext.Provider value={providerValues}>
            <Sidebar/>
            <ChatWindow/> 
          </MyContext.Provider>
        </div> 
    </>
  );
}

export default App;
