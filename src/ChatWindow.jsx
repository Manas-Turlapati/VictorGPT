import "./ChatWindow.css";
import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReactMediaRecorder } from "react-media-recorder";
import { MyContext } from "./MyContext.jsx";
import { BeatLoader } from "react-spinners";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  faUser,
  faPaperPlane,
  faMicrophone,
  faMicrophoneSlash,
  faGear,
  faRightFromBracket,
  faRocket,
  faBars,
  faPenToSquare,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
//old thread means old messages the name is different
import Chat from "./Chat.jsx";
import { useNavigate } from "react-router-dom";
import OnboardingModal from "./OnboardingModal.jsx";

function ChatWindow() {
  const navigate = useNavigate();
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    pendingTask,
    setpendingTask,
    isViewingOldThread,
    setview,
    setnewChat,
    currthread,
    setcurrThread,
    newChat,
    threadId,
    setThreadId,
    prevMessages,
    setprevMessages,
    refetch,
    setRefetch,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  let [isopen, setOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isTalk, setTalk] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem("avatarUrl"));
  const textareaRef = useRef(null);

  function handleOnboardingComplete() {
    setShowOnboarding(false);
  }

  function handleNewChat() {
    if (prevMessages && prevMessages.length > 0) {
      const storedThreads = JSON.parse(localStorage.getItem('mockThreads') || '[]');
      const currentThreadId = threadId || uuidv4();
      
      localStorage.setItem('mockMessages_' + currentThreadId, JSON.stringify(prevMessages));
      
      if (!storedThreads.find(t => t.threadId === currentThreadId)) {
        storedThreads.unshift({
          threadId: currentThreadId,
          title: prevMessages[0].content.substring(0, 30) + '...'
        });
        localStorage.setItem('mockThreads', JSON.stringify(storedThreads));
        setThreads(storedThreads);
      }
    }

    setnewChat(true);
    setprevMessages([]);
    setPrompt("");
    setReply("");
    setThreadId(uuidv4());
    setview(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function userClick() {
    setOpen(!isopen);
  }
  function handleChange(e) {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }
  async function sendReply() {
    if (!prompt.trim()) return;
    setLoading(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    if (newChat) {
      setprevMessages([]);
    }
    try {
      const token = localStorage.getItem("token");

      if (token === "mock-token-123") {
        setTimeout(() => {
          setLoading(false);
          setpendingTask(prompt);
          setReply("This is a mock response from VictorGPT since the backend is currently bypassed. You can test the UI smoothly!");
          setnewChat(false);
          setPrompt("");
          setRefetch((prev) => prev + 1);
        }, 1000);
        return;
      }

      const res = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          threadId: currthread ? currthread : threadId,
          message: prompt,
        }),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      setpendingTask(prompt);
      setReply(data.reply);
      setnewChat(false);
      setPrompt("");
      setRefetch((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Try again!");
    }
    setLoading(false);
  }
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toast.success("Logged Out Successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  }
  function startSpeech() {
    if (!isTalk) {
      startRecording();
    } else {
      stopRecording();
    }
    setTalk((prev) => !prev);
  }
  useEffect(() => {
    if (!mediaBlobUrl) return;
    sendAudio(mediaBlobUrl);
  }, [mediaBlobUrl]);

  async function sendAudio(mediaBlobUrl) {
    const response = await fetch(mediaBlobUrl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("audio", blob, "audio.webm");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/transcribe`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      const data = await res.json();
      setPrompt(data.transcript);
    } catch (err) {
      console.log(err);
      toast.error("Transcription failed. Try again!");
    }
  }

  return (
    <>
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <div className="chat-window">
        <div className="navbar">
          <div className="left-controls">
            {!isSidebarOpen && (
              <div className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(true)} title="Open sidebar">
                <FontAwesomeIcon icon={faBars} />
              </div>
            )}
            <div className="new-chat-btn" onClick={handleNewChat} title="New chat">
              <FontAwesomeIcon icon={faPenToSquare} />
            </div>
            <div className="custom-dropdown-container">
              <div className="sigmagpt" onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}>
                VictorGPT <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '0.65em', marginLeft: '8px', opacity: 0.7 }} />
              </div>
              {isModelDropdownOpen && (
                <div className="custom-dropdown-menu">
                  <div className="custom-dropdown-item" onClick={() => setIsModelDropdownOpen(false)}>
                    VictorGPT
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="profile-container">
            <div className="user" onClick={userClick} style={localStorage.getItem("avatarUrl") ? { padding: 0, background: 'transparent' } : {}}>
              {localStorage.getItem("avatarUrl") ? (
                <img 
                  className="hover-glow"
                  src={localStorage.getItem("avatarUrl")} 
                  alt="User Avatar" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.2)' }} 
                />
              ) : (
                <FontAwesomeIcon icon={faUser} />
              )}
            </div>
            {isopen && (
              <div className="user-options">
                <div className="icon-item" onClick={() => { setShowOnboarding(true); setOpen(false); }}>
                  <FontAwesomeIcon icon={faGear} />
                  <span> Settings</span>
                </div>
                <div className="icon-item">
                  <FontAwesomeIcon icon={faRocket} />
                  <span> Upgrade Plan</span>
                </div>
                <div className="icon-item">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  <span onClick={logout}> Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <Chat loading={loading} />

        <div className="chatInput">
          <form className="inputBox" onSubmit={(e) => { e.preventDefault(); sendReply(); }}>
            <button type="button" className="phone" onClick={startSpeech} style={{border: 'none'}}>
              <FontAwesomeIcon
                icon={isTalk ? faMicrophoneSlash : faMicrophone}
              />
            </button>
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask Anything"
              onChange={handleChange}
              value={prompt}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendReply();
                }
              }}
              style={{
                resize: 'none',
                maxHeight: '200px',
                padding: '14px 0',
                border: 'none',
                background: 'transparent',
                color: 'white',
                outline: 'none',
                width: '100%',
                fontFamily: 'inherit',
                fontSize: '1rem',
                lineHeight: '1.5'
              }}
            />
            <button type="submit" className="submit" style={{border: 'none'}} disabled={!prompt.trim() || loading}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
          <p className="alert-info">
            VictorGPT can make mistakes. Check important info. See Cookie
            Preferences.
          </p>
        </div>
      </div>
    </>
  );
}
export default ChatWindow;
