import LoginPage from '../pages/LoginPage.jsx';
import HomePage from '../pages/HomePage.jsx';

export const RHome = '/home';

export const Routes = Object.freeze({
    Login: { path: '/login', element: <LoginPage />, public: true },
    Home: { path: `${RHome}/:section`, element: <HomePage />, public: false }, // updated path
});
