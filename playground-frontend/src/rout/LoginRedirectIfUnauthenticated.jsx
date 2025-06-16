import { useAuth } from '../hooks/useAuth.jsx';
import { Navigate } from 'react-router-dom';
import { RHome, Routes } from './Routes.jsx';
import { TestsPage } from '@/pages/Pages.js';

export const LoginRedirectIfUnauthenticated = ({ children }) => {
    const { auth } = useAuth();

    if (!auth) {
        return <Navigate to={Routes.Login.path} replace />;
    } else {
        return children;
    }
};

export const HomeRedirectIfAuthenticated = ({ children }) => {
    const { auth } = useAuth();

    if (auth) {
        return <Navigate to={`${RHome}/${TestsPage}`} replace />;
    } else {
        return children;
    }
};
