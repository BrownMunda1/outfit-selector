import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import "./Login.css";

function Login() {

    // Toggle Password
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    const navigate = useNavigate();

    // Send the data to backend endpoint
    const handleSignIn = async (e) => {

        e.preventDefault();

        const authenticateApi = axios.create({
            baseURL: import.meta.env.BACKEND_BASE_URL,
            // withCredentials: true // use for cookie-based refresh
        });
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        const res = await authenticateApi.post(
            import.meta.env.BACKEND_AUTH_TOKEN_ENDPOINT,
            formData
        ).then(
            response => {
                const data = response.data;
                localStorage.setItem("access_token", data.access_token);
            }
        ).catch(
            error => {
                throw new Error(error.message); // display something on screen for UX
            }
        );

        // redirect to page correctly
        setTimeout(() => { // display something on screen for UX
            navigate("/", { replace: true });
        }, 1000);
    }

    const redirectToRegister = (e) => {
        e.preventDefault();
        setTimeout(() => { // display something on screen for UX
            navigate("/register", { replace: true });
        }, 1000);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">👔</div>
                    <h1 className="auth-title">Outfit Selector</h1>
                </div>

                <div className="auth-welcome">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account and start styling</p>
                </div>

                <form id="loginForm" aria-label="Login form" className="auth-form">
                    <div className="form-field">
                        <label htmlFor="username" className="form-label">Username</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input id="username" name="username" type="text" onChange={e => setUsername(e.target.value)} placeholder="Enter your username"
                                autoComplete="username" required className="form-input" />
                        </div>
                        <span className="field-error" id="usernameError"></span>
                    </div>

                    <div className="form-field">
                        <div className="form-label-row">
                            <label htmlFor="password" className="form-label">Password</label>
                            <a href="#" className="forgot-link">Forgot?</a>
                        </div>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input id="password" name="password" type={passwordVisible ? "text" : "password"} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                                autoComplete="current-password" required className="form-input" />
                            <button type="button" className="toggle-password" id="togglePassword" aria-label={passwordVisible ? "Hide Password" : "Show Password"} aria-pressed={passwordVisible} onClick={() => setPasswordVisible(v => !v)}>{passwordVisible ? '🙈' : '👁️'}</button>
                        </div>
                        <span className="field-error" id="passwordError"></span >
                    </div>

                    <div id="msg" aria-live="polite" className="auth-message"></div>

                    <button type="submit" className="auth-button" id="loginBtn" onClick={handleSignIn}>
                        <span>Sign in</span>
                        <span className="button-icon">→</span>
                    </button>
                </form>

                <div className="auth-divider">
                    <span>New to Outfit Selector?</span>
                </div>

                <button className="auth-link-button" onClick={redirectToRegister}>
                    <span>Create an account</span>
                    <span className="button-arrow">→</span>
                </button>
            </div>

            <div className="auth-decoration">
                <div className="decoration-item">✨</div>
                <div className="decoration-item">👗</div>
                <div className="decoration-item">👠</div>
            </div>
        </div>
    )
}

export default Login
