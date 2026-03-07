/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Safari PWA drops localStorage on force-quit, so we sync critical auth data to cookies as a fallback.
const setStorage = (key, value) => {
    localStorage.setItem(key, value);
    // Set cookie to expire in 30 days
    const d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = `${key}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
};

const getStorage = (key) => {
    let val = localStorage.getItem(key);
    if (!val) {
        // Fallback to cookie
        const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
        if (match) {
            val = decodeURIComponent(match[2]);
            // Restore to localStorage
            localStorage.setItem(key, val);
        }
    }
    return val;
};

const removeStorage = (key) => {
    localStorage.removeItem(key);
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};


/**
 * AuthProvider wraps the entire app and provides session state.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage/cookies on mount
    useEffect(() => {
        try {
            const savedUser = getStorage('user');
            const savedToken = getStorage('authToken');
            if (savedUser && savedToken) {
                setUser(JSON.parse(savedUser));
                setToken(savedToken);
            }
        } catch {
            // corrupted data, clear it
            removeStorage('user');
            removeStorage('authToken');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (apiResponse) => {
        const { token: newToken, ...userData } = apiResponse;
        setUser(userData);
        setToken(newToken);
        setStorage('user', JSON.stringify(userData));
        setStorage('authToken', newToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        removeStorage('user');
        removeStorage('authToken');
    };

    const updateUser = (patch) => {
        setUser(prev => {
            const updated = { ...prev, ...patch };
            setStorage('user', JSON.stringify(updated));
            return updated;
        });
    };

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
