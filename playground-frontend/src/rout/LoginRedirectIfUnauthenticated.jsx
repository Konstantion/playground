import { useAuth } from '../hooks/useAuth.jsx';
import { Navigate } from 'react-router-dom';
import { Routes } from './Routes.jsx';

export const LoginRedirectIfUnauthenticated = ({ children }) => {
    const { auth } = useAuth();

    console.log('LoginRedirectInLoggedOut', auth);

    if (!auth) {
        return <Navigate to={Routes.Login.path} replace />;
    } else {
        return children;
    }
};

export const HomeRedirectIfAuthenticated = ({ children }) => {
    const { auth } = useAuth();

    console.log('HomeRedirectIfAuthenticated', auth);

    if (auth) {
        return <Navigate to={Routes.Home.path} replace />;
    } else {
        return children;
    }
};
