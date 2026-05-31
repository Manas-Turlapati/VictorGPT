import "./ChatWindow.css";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { useReactMediaRecorder } from "react-media-recorder";
import { MyContext } from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  faGear,
  faRightFromBracket,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
//old thread means old messages the name is different
import Chat from "./Chat.jsx";
function ChatWindow() {
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
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  let [isopen, setOpen] = useState(false);
  const [isTalk,setTalk] = useState(false);
  function userClick() {
    setOpen(!isopen);
  }
  function handleChange(e) {
    setPrompt(e.target.value);
  }
  async function sendReply() {
    if (!prompt.trim()) return;
    setLoading(true);
    if (newChat) {
      setprevMessages([]);
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
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
    toast.success("Logged Out Successfully!")
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }
  function startSpeech(){
    if(!isTalk){
      startRecording();
    }
    else{
      stopRecording();
    }
    setTalk(prev=>!prev);
  }
  useEffect(() => {
    if(!mediaBlobUrl)return;
    sendAudio(mediaBlobUrl);
  }, [mediaBlobUrl]);

  async function sendAudio(mediaBlobUrl){
    const response = await fetch(mediaBlobUrl); 
    const blob = await response.blob(); 
    const formData = new FormData();
    formData.append("audio",blob,"audio.webm");
    try{
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/transcribe`,
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
    }
    catch(err){
      console.log(err);
      toast.error("Transcription failed. Try again!");
    }
  }
  
  return (
    <>
      <div className="chat-window">
        <div className="navbar">
          <select name="sigmagpt" id="sigmagpt" className="sigmagpt">
            <option value="sigmagpt">VictorGPT</option>
          </select>
          <div className="user" onClick={userClick}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="user-container">
            {isopen && (
              <div className="user-options">
                <div className="icon-item">
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
        <Chat />
        <ScaleLoader
          color="#ffffff"
          className="loader"
          height={150} // Increases the height of the bars (default is 35)
          width={5} // Increases the width of each bar (default is 4)
          radius={5} // Changes the roundness of the bar edges (default is 2)
          loading={loading}
        />

        <div className="chatInput">
          <div className="inputBox">
            <div className="phone" onClick={startSpeech}>
              <FontAwesomeIcon icon={isTalk?faMicrophoneSlash:faMicrophone} />
            </div>
            <input
              type="text"
              placeholder="Ask Anything"
              onChange={handleChange}
              value={prompt}
            />
            <div className="submit" onClick={sendReply}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>
          </div>
          <p className="alert-info">
            VectorGPT can make mistakes. Check important info. See Cookie
            Preferences.
          </p>
        </div>
      </div>
    </>
  );
}
export default ChatWindow;
