/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * AuthProvider wraps the entire app and provides:
 *   - user: { id, name, phone, location, profilePic }
 *   - token: JWT string
 *   - login(data): saves session after login/signup
 *   - logout(): clears session
 *   - updateUser(patch): patch-updates the user object
 *   - isAuthenticated: boolean
 *   - loading: true while restoring session from localStorage
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('authToken');
            if (savedUser && savedToken) {
                setUser(JSON.parse(savedUser));
                setToken(savedToken);
            }
        } catch {
            // corrupted data, clear it
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Called after a successful signup or login API response.
     * Expects the full API response object with { id, name, phone, location, token, ... }
     */
    const login = (apiResponse) => {
        const { token: newToken, ...userData } = apiResponse;
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', newToken);
    };

    /**
     * Clears session from state and localStorage.
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    };

    /**
     * Patch-update the user object in state and localStorage.
     * e.g. updateUser({ profilePic: 'https://...' })
     */
    const updateUser = (patch) => {
        setUser(prev => {
            const updated = { ...prev, ...patch };
            localStorage.setItem('user', JSON.stringify(updated));
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
