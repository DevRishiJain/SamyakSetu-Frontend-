// ============================================================
// SamyakSetu — Central API Service
// Base URL is defined in vite.config.js via __API_BASE_URL__
// ============================================================

const BASE_URL = typeof __API_BASE_URL__ !== 'undefined' ? __API_BASE_URL__ : 'http://localhost:8080';

/**
 * Returns the current auth token stored in localStorage.
 */
function getToken() {
    return localStorage.getItem('authToken');
}

/**
 * Builds standard headers with JWT auth if available.
 */
function authHeaders(extraHeaders = {}) {
    const headers = { ...extraHeaders };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// ─────────────────────────────────────────────
// 1. Health Check
// ─────────────────────────────────────────────
export async function healthCheck() {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error('Server is unreachable');
    return res.json();
}

// ─────────────────────────────────────────────
// 2. Send OTP (Optional in Prototype Mode)
// ─────────────────────────────────────────────
export async function sendOtp(phone) {
    const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
    return data;
}

// ─────────────────────────────────────────────
// 3. Signup Farmer
// ─────────────────────────────────────────────
export async function signupFarmer({ name, phone, otp, latitude, longitude }) {
    const res = await fetch(`${BASE_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, otp, latitude, longitude }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    return data;
}

// ─────────────────────────────────────────────
// 4. Login
// ─────────────────────────────────────────────
export async function loginFarmer({ phone, otp }) {
    const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
}

// ─────────────────────────────────────────────
// 5. Logout
// ─────────────────────────────────────────────
export async function logoutFarmer() {
    const res = await fetch(`${BASE_URL}/api/logout`, {
        method: 'POST',
        headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Logout failed');
    return data;
}

// ─────────────────────────────────────────────
// 6. Upload Soil Image & Get AI Analysis
// ─────────────────────────────────────────────
export async function uploadSoilImage(farmerId, imageFile) {
    const formData = new FormData();
    formData.append('farmerId', farmerId);
    formData.append('soilImage', imageFile);

    const res = await fetch(`${BASE_URL}/api/soil/upload`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Soil upload failed');
    return data;
}

// ─────────────────────────────────────────────
// 7. Chat with Agronomy AI Advisor (context-aware)
//    Uses farmerId + GPS + weather + soil context
// ─────────────────────────────────────────────
export async function chatWithAdvisor({ farmerId, message, image }) {
    if (image) {
        // Multipart form data when image is attached
        const formData = new FormData();
        formData.append('farmerId', farmerId);
        formData.append('message', message);
        formData.append('image', image);

        const res = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: authHeaders(),
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Chat failed');
        return data;
    } else {
        // JSON when text-only
        const res = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ farmerId, message }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Chat failed');
        return data;
    }
}

// ─────────────────────────────────────────────
// 8. Update Farmer Location
// ─────────────────────────────────────────────
export async function updateLocation({ farmerId, latitude, longitude }) {
    const res = await fetch(`${BASE_URL}/api/location`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ farmerId, latitude, longitude }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Location update failed');
    return data;
}

// ─────────────────────────────────────────────
// 9. Update Profile Picture
// ─────────────────────────────────────────────
export async function updateProfilePic(imageFile) {
    const formData = new FormData();
    formData.append('profilePic', imageFile);

    const res = await fetch(`${BASE_URL}/api/profile-pic`, {
        method: 'PUT',
        headers: authHeaders(),
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Profile pic update failed');
    return data;
}

// ─────────────────────────────────────────────
// 10. Get Weather & 5-Day Forecast
// ─────────────────────────────────────────────
export async function getWeather(farmerId) {
    const res = await fetch(`${BASE_URL}/api/weather?farmerId=${farmerId}`, {
        headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Weather fetch failed');
    return data;
}

// ─────────────────────────────────────────────
// 11. SamyakAI — Open Agricultural Chatbot
//     General farming assistant, no farmerId needed
// ─────────────────────────────────────────────
export async function samyakAIChat(message) {
    const res = await fetch(`${BASE_URL}/api/samyakai`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ message }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'SamyakAI chat failed');
    return data;
}
