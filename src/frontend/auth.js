// auth.js - handles login and registration flows used by login.html and register.html
async function showMessage(el, msg, isError = true) {
    if (!el) return;
    el.className = 'auth-message ' + (isError ? 'error' : 'success');
    el.textContent = msg;
}

function clearMessage(el) {
    if (!el) return;
    el.className = '';
    el.textContent = '';
}

// Password visibility toggle
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const input = button.parentElement.querySelector('.form-input');
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = '🙈';
            } else {
                input.type = 'password';
                button.textContent = '👁️';
            }
        });
    });
}

// Login form handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    console.log("Inside Login Form");
    initPasswordToggle();
    const loginBtn = document.getElementById('loginBtn');
    loginForm.addEventListener('submit', async (e) => {
        console.log("Inside Login Form Listener");
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const msg = document.getElementById('msg');
        clearMessage(msg);
        if (!username || !password) { showMessage(msg, 'Please provide username and password'); return; }
        try {
            loginBtn.disabled = true;
            const originalText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<span>Signing in...</span><span class="button-icon">⏳</span>';

            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);
            const res = await fetch('/auth/token', {
                method: 'POST',
                body: params
            });
            if (!res.ok) {
                let errMsg = res.statusText;
                try { const j = await res.json(); errMsg = j.detail || j.message || JSON.stringify(j); } catch (_) { try { errMsg = await res.text(); } catch (_) { } }
                throw new Error(errMsg || res.statusText);
            }
            const data = await res.json();
            console.log("here, access token:", data);
            localStorage.setItem('access_token', data.access_token);
            console.log("Verified in storage:", localStorage.getItem('access_token'));
            showMessage(msg, 'Welcome! Redirecting...', false);
            // redirect to main app
            setTimeout(() => window.location.href = './index.html', 500);
        } catch (err) {
            showMessage(msg, 'Login failed: ' + (err.message || 'unknown'));
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>Sign in</span><span class="button-icon">→</span>';
        }
    });
}

// Register form handling
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    initPasswordToggle();
    const registerBtn = document.getElementById('registerBtn');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value.trim();
        const gender = document.getElementById('gender').value;
        const msg = document.getElementById('msg');
        clearMessage(msg);
        if (!username || !password || !name || !gender) { showMessage(msg, 'Please fill all fields'); return; }
        // if (password.length < 6) { showMessage(msg, 'Password must be at least 6 characters'); return; }
        try {
            registerBtn.disabled = true;
            registerBtn.innerHTML = '<span>Creating Account...</span><span class=\"button-icon\">⏳</span>';

            const payload = { username, password, name, gender };
            const res = await fetch('/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                let errMsg = res.statusText;
                try { const j = await res.json(); errMsg = j.detail || j.message || JSON.stringify(j); } catch (_) { try { errMsg = await res.text(); } catch (_) { } }
                throw new Error(errMsg || res.statusText);
            }
            showMessage(msg, 'Account created! Redirecting to login...', false);
            setTimeout(() => window.location.href = '/login.html', 900);
        } catch (err) {
            showMessage(msg, 'Registration failed: ' + (err.message || 'unknown'));
        } finally {
            registerBtn.disabled = false;
            registerBtn.innerHTML = '<span>Create Account</span><span class=\"button-icon\">→</span>';
        }
    });
}

// Helper: attach token header to fetch; usage example
async function authFetch(input, init = {}) {
    const token = localStorage.getItem('access_token');
    init.headers = init.headers || {};
    if (token) init.headers['Authorization'] = 'Bearer ' + token;
    return fetch(input, init);
}
