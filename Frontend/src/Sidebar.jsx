import toast from "react-hot-toast";
import "./Sidebar.css";
import { faOpenai } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "./MyContext";
import { v4 as uuidv4 } from "uuid";
function Sidebar() {
  const {
    newChat,
    setReply,
    reply,
    threads,
    setThreads,
    isViewingOldThread,
    setview,
    setnewChat,
    currthread,
    setcurrThread,
    threadId,
    setThreadId,
    prevMessages,
    setprevMessages,
    pendingTask,
    setpendingTask,
    refetch,
    setRefetch,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useContext(MyContext);
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (token === "mock-token-123") {
        const stored = JSON.parse(localStorage.getItem('mockThreads') || '[]');
        if (stored.length > 0) {
          setThreads(stored);
        } else {
          setThreads([
            { threadId: "mock-thread-1", title: "Mock Chat 1" },
            { threadId: "mock-thread-2", title: "Testing UX" }
          ]);
        }
        return;
      }

      try {
        const thread = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/thread`,
          {
            headers: {
              authorization: `Bearer ${token}`, // ← send token
            },
          },
        );
        const res = await thread.json();
        if (res && res.data) {
          setThreads(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to load threads!");
      }
    }
    fetchData();
  }, [refetch]);
  async function displayInfo(threadId) {
    const token = localStorage.getItem("token");
    setcurrThread(threadId);
    setview(true);
    setnewChat(false);
    if (window.innerWidth <= 768) setIsSidebarOpen(false); 

    if (token === "mock-token-123") {
        const localMessages = JSON.parse(localStorage.getItem('mockMessages_' + threadId));
        if (localMessages) {
            setprevMessages(localMessages);
        } else {
            setprevMessages([
                { role: "user", content: "This is an old mock chat." },
                { role: "assistant", content: "Yes, I am a mock response from VictorGPT." }
            ]);
        }
        return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/thread/${threadId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      const arr = await res.json();
      setprevMessages(arr.data.messages);
      setview(true);
      setnewChat(false);
    } catch (err) {
      console.log(err);
    }
  }
  function opennewChat() {
    setprevMessages([]);
    setReply("");
    setcurrThread("");
    setnewChat(true);
    setview(false);
    setThreadId(uuidv4());
  }
  async function deleteThread(threadId, e) {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    
    if (token === "mock-token-123") {
      setThreads((prev) => prev.filter((item) => item.threadId !== threadId));
      if (threadId === threadId) opennewChat();
      toast.success("Deleted Mock Thread");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );
      setThreads((prev) => prev.filter((t) => t.threadId !== threadId));
      toast.success("Thread deleted!");
    } catch (err) {
      console.log("error in deleting the thread");
      toast.error("Failed to delete thread!");
    }
  }
  return (
    <>
      <section className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <button className="info">
          <div className="InfoDiv">
            <div className="logo" onClick={() => setview(false)} style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                className="hover-glow"
                src="/victorgpt_logo.jpg" 
                alt="VictorGPT Logo" 
                style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', mixBlendMode: 'screen' }} 
              />
            </div>
            <button className="new-chat-btn-sidebar" onClick={opennewChat} style={{ background: 'transparent', border: 'none', padding: 0 }}>
              <FontAwesomeIcon icon={faPenToSquare} className="note" />
            </button>
          </div>
        </button>
        <div className="history-block">
          {threads && threads.length > 0 && (
            <ul className="history">
              {threads.map((el, idx) => {
                return (
                  <li key={el.threadId}>
                    <span onClick={() => displayInfo(el.threadId)}>
                      {el.title}
                    </span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="bin"
                      onClick={(e) => {
                        e.stopPropagation(); // ← stops li click from firing
                        deleteThread(el.threadId);
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="sign">
          <p>&hearts; By Manas Turlapati</p>
        </div>
      </section>
    </>
  );
}
export default Sidebar;
