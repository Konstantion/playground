import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login({ username: 'testuser' });
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-2xl shadow-md w-96 space-y-6">
                <h2 className="text-2xl font-semibold text-center">Sign In</h2>
                <button
                    onClick={handleLogin}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
