import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
    HomeRedirectIfAuthenticated,
    LoginRedirectIfUnauthenticated,
} from './LoginRedirectIfUnauthenticated.jsx';
import { RHome, Routes as RRoutes } from './Routes.jsx';
import { TestsPage } from '@/pages/Pages.js';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {Object.values(RRoutes).map(route => {
                    if (route.public) {
                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <HomeRedirectIfAuthenticated>
                                        {route.element}
                                    </HomeRedirectIfAuthenticated>
                                }
                            />
                        );
                    } else {
                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <LoginRedirectIfUnauthenticated>
                                        {route.element}
                                    </LoginRedirectIfUnauthenticated>
                                }
                            />
                        );
                    }
                })}
                <Route path={'*'} element={<Navigate to={`${RHome}/${TestsPage}`} replace />} />
            </Routes>
        </BrowserRouter>
    );
};
