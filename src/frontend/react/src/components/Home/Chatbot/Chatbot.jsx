import React from 'react'
import './Chatbot.css'

function Chatbot({ active }) {
    return (
        <div id="chat" className={`tab-content ${active ? "active" : ""}`}>
            <div className="messages-container" id="messagesContainer">
                <div className="empty-chat">Start a conversation by typing a message below...</div>
            </div>
            <div className="chat-input-area">
                <input type="text" className="chat-input" id="chatInput" placeholder="Type your message here..."
                    autoComplete="off" />
                <button className="send-btn" id="sendBtn">➤</button>
            </div>
        </div>
    )
}

export default Chatbot
