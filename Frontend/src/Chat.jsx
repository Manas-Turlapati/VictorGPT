import { MyContext } from "./MyContext";
import { useContext,useState,useEffect} from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./Chat.css"
function Chat(){
    const {newChat,prevMessages,reply,setprevMessages, isViewingOldThread,pendingTask
    } = useContext(MyContext);
    const user = localStorage.getItem("username");
    return (
      <> 
        {newChat && <h1>Hello! <i>{user}</i> start a new chat!</h1>}
        <div className="chats">
          {prevMessages.map((el,idx) => {
            return (
              <div
                className={el.role === "user" ? "userDiv" : "gptDiv"}
                key={idx}
              >
                <div
                  className={el.role === "user" ? "userMessage" : "gptMessage"}
                >
                  <Markdown rehypePlugins={[rehypeHighlight]}>
                    {el.content}
                  </Markdown>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
}
export default Chat;