import { useAuth } from '../hooks/useAuth';

export default function Home() {
    const { user } = useAuth();
    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-3xl font-bold">Welcome {user?.username || 'Guest'}!</h1>
        </div>
    );
}
