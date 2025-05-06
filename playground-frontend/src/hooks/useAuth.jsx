import { createContext, useContext, useState } from 'react';

const AuthKey = 'token';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(JSON.parse(sessionStorage.getItem(AuthKey)));

    const login = userAndToken => {
        setAuth(userAndToken);
        sessionStorage.setItem(AuthKey, JSON.stringify(userAndToken));
    };

    const logout = () => {
        setAuth(null);
        sessionStorage.removeItem(AuthKey);
    };

    return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
