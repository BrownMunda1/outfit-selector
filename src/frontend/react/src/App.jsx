import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Login from './components/Auth/login/Login'
import UploadImages from './components/Home/UploadImages/UploadImages'
import Chatbot from './components/Home/Chatbot/Chatbot'
import Register from './components/Auth/Register/Register'
import { replace, Route, Router, Routes, useNavigate } from 'react-router'
import Home from './components/Home/Home/Home'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {

    const navigate = useNavigate();

    const PUBLIC_PATHS = ["/register", "/login"];

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token && !PUBLIC_PATHS.includes(window.location.pathname)) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    return (
        <>
            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                </Route>
            </Routes >
        </>
    )
}

export default App
