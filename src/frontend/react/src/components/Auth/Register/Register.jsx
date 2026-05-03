import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import "./Register.css";

function Register() {

    // Send user data to backend for mongodb save
    // Redirect to home page after successful registration, save the token after successful registration

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {

        e.preventDefault();

        // Step 1: Register User
        const registerApi = axios.create({
            baseURL: import.meta.env.BACKEND_BASE_URL,
            // withCredentials: true // use for cookie-based refresh
        });
        const userData = {
            "username": username,
            "password": password,
            "gender": gender,
            "name": name
        }
        await registerApi.post(
            import.meta.env.BACKEND_AUTH_REGISTER_ENDPOINT,
            userData
        ).then( // successful registration
            response => {
                console.log("Successful Registration");
            }
        ).catch( // some error occurred
            error => {
                throw new Error(error.message); // display something on screen for UX
            }
        )

        // Step 2: Authenticate the User
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
    };

    const redirectToLogin = (e) => {
        e.preventDefault();
        setTimeout(() => { // display something on screen for UX
            navigate("/login", { replace: true });
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
                    <h2>Create Account</h2>
                    <p>Join our community and discover your perfect style</p>
                </div>

                <form id="registerForm" aria-label="Register form" className="auth-form">
                    <div className="form-row">
                        <div className="form-field form-field-half">
                            <label htmlFor="username" className="form-label">Username</label>
                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>
                                <input id="username" name="username" type="text" onChange={e => setUsername(e.target.value)} placeholder="Choose a username"
                                autoComplete="username" required className="form-input" />
                            </div>
                            <span className="field-error" id="usernameError"></span>
                        </div>
                        <div className="form-field form-field-half">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📝</span>
                                <input id="name" name="name" type="text" placeholder="Your full name" required
                                    className="form-input" onChange={e => setName(e.target.value)} />
                            </div>
                            <span className="field-error" id="nameError"></span>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field form-field-half">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input id="password" name="password" type={passwordVisible ? "text" : "password"} onChange={e => setPassword(e.target.value)} placeholder="Create your password"
                                    autoComplete="current-password" required className="form-input" />
                                <button type="button" className="toggle-password" id="togglePassword" aria-label={passwordVisible ? "Hide Password" : "Show Password"} aria-pressed={passwordVisible} onClick={() => setPasswordVisible(v => !v)}>{passwordVisible ? '🙈' : '👁️'}</button>
                            </div>
                            <span className="field-error" id="passwordError"></span>
                            <span className="field-hint">At least 8 characters</span>
                        </div>
                        <div className="form-field form-field-half">
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <div className="input-wrapper select-wrapper">
                                <span className="input-icon">✨</span>
                                <select id="gender" name="gender" required className="form-input" defaultValue="" onChange={e => setGender(e.target.value)}>
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <span className="field-error" id="genderError"></span>
                        </div>
                    </div>

                    <div id="msg" aria-live="polite" className="auth-message"></div>

                    <button type="submit" className="auth-button" id="registerBtn" onClick={handleRegister}>
                        <span>Create Account</span>
                        <span className="button-icon">→</span>
                    </button>
                </form>

                <div className="auth-divider">
                    <span>Already have an account?</span>
                </div>

                <button className="auth-link-button" onClick={redirectToLogin}>
                    <span>Sign in</span>
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

export default Register
