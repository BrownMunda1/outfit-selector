import React, { useState } from 'react';
import './Chatbot.css';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { createParser } from 'eventsource-parser';


function Chatbot({ active }) {

    const [userInput, setUserInput] = useState("");
    const [chatMessageType, setChatMessageType] = useState("user");
    const [chatHistory, setChatHistory] = useState([]);
    const [checkpointId, setCheckpointId] = useState(null); // This is for ALL users, maintain a map of users and remove the user's data after some timeout or on logout, logout is better

    const navigate = useNavigate();

    const handleUserChat = async () => {

        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login", { replace: true });
        }

        const message = userInput;
        setUserInput("");
        if (!message.trim()) {
            return;
        }

        setChatHistory(prev => [...prev, {
            message: message,
            type: "user"
        }]);

        setChatMessageType("assistant");
        setChatHistory(prev => [...prev, { message: "", type: "assistant" }]);


        try {
            const url = `${import.meta.env.BACKEND_BASE_URL}${import.meta.env.BACKEND_CHAT_ENDPOINT}`;
            const response = await fetch(
                url,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: message,
                        chat_thread_id: checkpointId
                    })
                }
            );

            if (response.status === 401){
                return navigate("/login", { replace: true });
            }
            if (!response.ok){
                throw new Error("Network response was not ok");
            }

            // Attach a reader to the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const parser = createParser({
                onEvent: (event) => {
                    const data = JSON.parse(event.data); // Expects only a string! can deserialize it into a json

                    if(data.type === "checkpoint"){
                        setCheckpointId(data["chat_thread_id"]);
                    }

                    if(data.type === "content"){
                        let content = data["content"];
                        setChatHistory(prev => {
                            const newHistory = [...prev];
                            newHistory[newHistory.length - 1].message += content;
                            return newHistory;
                        });
                    }
                }
            });

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Feed the raw chunk into the parser
                const chunk = decoder.decode(value, { stream: true });
                parser.feed(chunk);
            }
        } catch (error) {
            console.error("Streaming error:", error);
        } finally {
            setChatMessageType("user");
        }


    };

    return (
        <div id="chat" className={`tab-content ${active ? "active" : ""}`}>
            <div className="messages-container" id="messagesContainer">
                {
                    chatHistory.length === 0 &&
                    <div className="empty-chat">Start a conversation by typing a message below...</div>
                }
                {
                    chatHistory.map((chat, index) => {
                        if (chat.type === "user") {
                            return (
                                <div className="message user" key={index}>
                                    <div className="message-content">{chat.message}</div>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className="message assistant" key={index}>
                                    <div className="message-content">{chat.message}</div>
                                </div>
                            )
                        }
                    })
                }
            </div>
            <div className="chat-input-area">
                <input type="text" className="chat-input" id="chatInput" placeholder="Type your message here..." value={userInput}
                    autoComplete="off" onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleUserChat();
                        }
                    }} />
                <button className="send-btn" id="sendBtn" onClick={handleUserChat}>➤</button>
            </div>
        </div>
    )
}

export default Chatbot
