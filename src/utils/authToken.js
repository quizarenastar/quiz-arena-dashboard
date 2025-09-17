// Safe LocalStorage accessors and helpers for auth token

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getAuthToken = () => {
    if (!isBrowser) return null;
    try {
        const raw = window.localStorage.getItem('authToken');
        return raw ?? null;
    } catch {
        return null;
    }
};

export const setAuthToken = (token) => {
    if (!isBrowser) return false;
    try {
        if (token == null) {
            window.localStorage.removeItem('authToken');
        } else {
            window.localStorage.setItem('authToken', String(token));
        }
        return true;
    } catch {
        return false;
    }
};

export const clearAuthToken = () => setAuthToken(null);

export const hasAuthToken = () => Boolean(getAuthToken());

export const authHeader = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
    getAuthToken,
    setAuthToken,
    clearAuthToken,
    hasAuthToken,
    authHeader,
};


