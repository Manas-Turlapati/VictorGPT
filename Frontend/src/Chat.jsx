import { MyContext } from "./MyContext";
import { useContext, useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./Chat.css"
import { BeatLoader } from "react-spinners";

function Chat({ loading }) {
    const {newChat, prevMessages} = useContext(MyContext);
    const user = localStorage.getItem("username");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [prevMessages, loading]);

    return (
      <> 
        {newChat && (
          <div className="greeting-container">
            <h1>Hello, <span>{user}</span></h1>
            <p>What should we work on today?</p>
          </div>
        )}
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
          {loading && (
            <div className="gptDiv">
              <div className="gptMessage" style={{ padding: "12px 20px" }}>
                <BeatLoader color="#ffffff" size={8} speedMultiplier={0.7} />
              </div>
            </div>
          )}
          <div ref={bottomRef} style={{ paddingBottom: '20px' }} />
        </div>
      </>
    );
}
export default Chat;