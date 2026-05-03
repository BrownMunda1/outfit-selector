import React, { useState } from 'react';
import './Chatbot.css';
import axios from 'axios';
import { useNavigate } from 'react-router';


function Chatbot({ active }) {

    const [userInput, setUserInput] = useState("");
    const [chatMessageType, setChatMessageType] = useState("user");
    const [chatHistory, setChatHistory] = useState([]);

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

        const chatApi = axios.create({
            baseURL: import.meta.env.BACKEND_BASE_URL,
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        await chatApi.get(
            import.meta.env.BACKEND_CHAT_ENDPOINT + `/${message}`,
        ).then(
            response => {
                console.log("Chat Response", response);
                const llmResponse = response.data["data"]["content"];

                console.log("LLM Response", llmResponse);
                setChatHistory(prev => [...prev, { message: llmResponse, type: "assistant" }]);
            }
        ).catch(
            error => {
                if (error.response && error.response.status === 401) {
                    navigate("/login", { replace: true });
                }
                throw new Error(`Server error: ${error.message}`);
            }
        ).finally(
            () => {
                setChatMessageType("user");
            }
        );

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
