import { createContext, useContext, useState } from 'react';

const AuthKey = 'token';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(localStorage.getItem(AuthKey));

    const login = (token) => {
        setAuth(token);
        localStorage.setItem(AuthKey, token);
    };
    const logout = () => {
        setAuth(null);
        localStorage.removeItem(AuthKey);
    };

    return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
