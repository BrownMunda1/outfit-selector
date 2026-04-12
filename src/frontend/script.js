// Tab Switching
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Image Upload Handling
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const imageGrid = document.getElementById('imageGrid');
const uploadOutfitBtn = document.getElementById('uploadOutfitBtn');

const uploadButton = document.querySelector('.upload-btn');
uploadButton.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

let uploadedImages = []; // Store uploaded images

// Click to browse
uploadArea.addEventListener('click', (e) => {
    fileInput.click();
});

// Handle file selection from input
fileInput.addEventListener('change', (e) => {
    e.preventDefault();
    handleFiles(e.target.files);
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#667eea';
    uploadArea.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ddd';
    uploadArea.style.backgroundColor = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ddd';
    uploadArea.style.backgroundColor = 'transparent';
    handleFiles(e.dataTransfer.files);
});

// Process uploaded files
function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImages.push({
                    name: file.name,
                    data: e.target.result
                });
                displayImages();
                updateButtonState();
            };
            reader.readAsDataURL(file);
        }
    });
}

// Display images in grid
function displayImages() {
    imageGrid.innerHTML = '';
    uploadedImages.forEach((img, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
      <img src="${img.data}" alt="${img.name}">
      <button class="remove-btn" onclick="removeImage(${index})">✕</button>
    `;
        imageGrid.appendChild(imageItem);
    });
}

// Remove image from uploads
function removeImage(index) {
    uploadedImages.splice(index, 1);
    displayImages();
    updateButtonState();
}

// Enable/disable button based on uploads
function updateButtonState() {
    uploadOutfitBtn.disabled = uploadedImages.length === 0;
}

// Handle button click
uploadOutfitBtn.addEventListener('click', () => {
    sendImagesToBackend();
});

async function sendImagesToBackend() {
    try {
        uploadOutfitBtn.disabled = true;
        uploadOutfitBtn.textContent = 'Sending...';

        const formData = new FormData();

        // Add all images to FormData
        uploadedImages.forEach((img, index) => {
            // Convert base64 to blob
            const blob = base64ToBlob(img.data);
            formData.append('images', blob, img.name);
        });

        const token = localStorage.getItem('access_token');
        const response = await fetch('/image/upload', {
            method: 'POST',
            body: formData,
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        });

        if (!response.ok) {
            if(response.status == 401){
                alert("Authentication Failed. Please sign in again")
                localStorage.removeItem("access_token");
                window.location.href = "/login.html";
                return;
            }
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Success:', result);
        alert('Images uploaded successfully!');

        // Clear uploaded images
        uploadedImages = [];
        displayImages();
        updateButtonState();

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to upload images. Check console for details.');
    } finally {
        uploadOutfitBtn.disabled = uploadedImages.length === 0;
        // uploadOutfitBtn.textContent = 'Get Outfit Recommendations';
    }
}

// Helper function to convert base64 to blob
function base64ToBlob(base64) {
    const parts = base64.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }

    return new Blob([u8arr], { type: mime });
}

function renderImages() {
    uploadedImagesContainer.innerHTML = uploadedImages.map(img => `
        <div class="image-item">
            <img src="${img.src}" alt="${img.name}">
            <button class="remove-image" onclick="removeImage(${img.id})">✕</button>
        </div>
    `).join('');
}

function removeImage(id) {
    uploadedImages = uploadedImages.filter(img => img.id !== id);
    renderImages();
}

// Chat Handling
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messagesContainer');
let messages = [];
let isFirstMessage = true;

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// function sendInitialChatMessage() {
//     const assistantMessageDiv = document.createElement('div');
//     assistantMessageDiv.className = 'message assistant';
//     assistantMessageDiv.innerHTML = `<div class="message-content">I'm here to help you with your outfit selection! How can I assist you today?</div>`;
//     messagesContainer.appendChild(assistantMessageDiv);
// }

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Clear empty state on first message
    if (isFirstMessage) {
        messagesContainer.innerHTML = '';
        isFirstMessage = false;
    }

    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user';
    userMessageDiv.innerHTML = `<div class="message-content">${escapeHtml(message)}</div>`;
    messagesContainer.appendChild(userMessageDiv);

    messages.push({ role: 'user', content: message });
    chatInput.value = '';
    const token = localStorage.getItem('access_token');
    console.log("token content:", token);
    const response = await fetch(`/chat/${encodeURIComponent(message)}`, {
        method: 'GET',
        headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    });

    console.log("Response:", response)

    if (!response.ok) {
        if(response.status == 401){
            alert("Authentication failed, Please sign in again");
            localStorage.removeItem("access_token");
            window.location.href = "/login.html";
            return;
        }
        throw new Error(`Server error: ${response.status}`);
    }

    let response_json = await response.json();
    console.log("Success:", response_json);
    let llmResponse = response_json["data"]["content"];
    messages.push({
        role: 'assistant',
        content: llmResponse
    });

    const assistantMessageDiv = document.createElement('div');
    assistantMessageDiv.className = 'message assistant';
    assistantMessageDiv.innerHTML = `<div class="message-content">${llmResponse}</div>`;
    messagesContainer.appendChild(assistantMessageDiv);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Focus chat input when chat tab is opened
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.getAttribute('data-tab') === 'chat') {
            setTimeout(() => chatInput.focus(), 100);
        }
    });
});

// Redirect to login if no token present (except on auth pages)
document.addEventListener('DOMContentLoaded', () => {
    const publicPaths = ['/login.html', '/register.html'];
    const path = window.location.pathname;
    const token = localStorage.getItem('access_token');
    if (!token && !publicPaths.includes(path)) {
        console.log("Here, no access token, login");
        window.location.href = '/login.html';
    }
    // show welcome and logout if token exists
    const welcomeText = document.getElementById('welcomeText');
    const logoutBtn = document.getElementById('logoutBtn');
    console.log("here, in index.html ");
    if (token) {
        // decode basic payload to show username if present
        try {
            console.log("here, found token in local storage");
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            if (welcomeText) welcomeText.textContent = `Signed in as ${decoded.sub.username || decoded.username || ''}`;
        } catch (_) { }
        if (logoutBtn) { logoutBtn.style.display = 'inline-block'; logoutBtn.addEventListener('click', () => { localStorage.removeItem('access_token'); window.location.href = '/login.html'; }); }
    }
});
