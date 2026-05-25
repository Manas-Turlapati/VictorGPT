import './Sidebar.css'
import { faOpenai } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {useState,useEffect,useContext} from 'react';
import { MyContext } from "./MyContext";
import { v4 as uuidv4 } from "uuid";
function Sidebar(){
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
    setprevMessages
  } = useContext(MyContext);
  useEffect(()=>{
    async function fetchData(){
      try{
        const thread = await fetch("http://localhost:8080/api/thread");
        const res = await thread.json();
        if(res&&res.data){
          setThreads(res.data);
        }
      }
      catch(err){
        console.log(err);
      }

    }
    fetchData();
  },[reply])
  async function displayInfo(threadId){
    setcurrThread(threadId);
    setprevMessages([]);
    setReply("");
    try{
      const res = await fetch(`http://localhost:8080/api/thread/${threadId}`);
      const arr = await res.json();
      setprevMessages(arr.data.messages);
      setview(true);
      setnewChat(false);
    }
    catch(err){
      console.log(err);
    }
  }
  function opennewChat(){
    setprevMessages([]); 
    setReply("");
    setcurrThread("");
    setnewChat(true);
    setview(false);
    setThreadId(uuidv4());
  }
  async function deleteThread(threadId){
    try{
      const res = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      setThreads((prev) => prev.filter((t) => t.threadId !== threadId));
    }
    catch(err){
      console.log("error in deleting the thread")
    }
  }
  return (
    <>
      <section>
        <button className="info" onClick={opennewChat}>
          <div className="InfoDiv">
            <FontAwesomeIcon icon={faOpenai} className='logo'/>
            <FontAwesomeIcon icon={faPenToSquare} className='note'/>
          </div>
        </button>
        <div className="history-block">
          {threads && threads.length > 0 && (
            <ul className="history">
              {threads.map((el, idx) => {
                return (
                  <li key={el._id}>
                    <span onClick={() => displayInfo(el.threadId)}>
                      {el.title}
                    </span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="bin"
                      onClick={(e) => {
                        e.stopPropagation(); // ← stops li click from firing
                        deleteThread(el.threadId)
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