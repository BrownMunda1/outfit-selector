import React, { useEffect, useState } from 'react'
import './Home.css'
import UploadImages from '../UploadImages/UploadImages'
import Chatbot from '../Chatbot/Chatbot'
import { useNavigate } from 'react-router'

function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [activeTab, setActiveTab] = useState("upload");
    const navigate = useNavigate();

    const decodeJwtPayload = (token) => {
        try {
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const payload = parts[1];
            // Base64url -> base64
            let b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            while (b64.length % 4) b64 += '=';
            const json = atob(b64);
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setIsAuthenticated(false);
            return;
        }
        setIsAuthenticated(true);
        const payload = decodeJwtPayload(token);
        if (payload && payload.sub) {
            try {
                const sub = JSON.parse(payload.sub);
                setUsername(sub.username || '');
            } catch (e) {
                // ignore
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
    }

    return (
        <>
            <div className="container">
                <div className="app-header">
                    <div className="header-left"><span className="app-title">👔 Outfit Selector</span></div>
                    <div id="authStatus" className="header-auth">
                        <span id="welcomeText" className="welcome-user">{isAuthenticated ? `Welcome ${username || ''}` : ''}</span>
                        {isAuthenticated && (
                            <button id="logoutBtn" className="logout-btn" onClick={handleLogout}>Sign out</button>
                        )}
                    </div>
                </div>
                <div className="app-content">
                    <div className="tabs">
                        <button className={`tab-button ${activeTab === "upload" ? "active" : ""}`} data-tab="upload" onClick={() => setActiveTab("upload")}>📤 Upload Outfits</button>
                        <button className={`tab-button ${activeTab === "chat" ? "active" : ""}`} data-tab="chat" onClick={() => setActiveTab("chat")}>💬 Chat Assistant</button>
                    </div>

                    {activeTab === "upload" && <UploadImages active={activeTab === "upload"} />}

                    {activeTab === "chat" && <Chatbot active={activeTab === "chat"} />}

                </div>
            </div>
        </>
    )
}

export default Home
