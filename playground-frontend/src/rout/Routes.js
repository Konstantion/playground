import Login from '../pages/Login';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';

export const Routes = Object.freeze({
    Login: { path: '/login', element: <Login />, public: true },
    Home: { path: '/', element: <Home />, public: false },
    Dashboard: { path: '/dashboard', element: <Dashboard />, public: false },
});
