import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Register from "./Register.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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
  if (!token) {
    window.location.href = "/login";
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
