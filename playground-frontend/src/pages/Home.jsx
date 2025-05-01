import { useAuth } from '../hooks/useAuth.jsx';
import { Button } from '@/components/ui/button.js';
import { Endpoints } from '@/utils/Endpoints.js';

export default function Home() {
    const { auth } = useAuth();
    const handleClick = async e => {
        e.preventDefault();

        console.log('User:', auth);
        const response = await fetch(Endpoints.Hello, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.accessToken}`,
            },
        });
        if (!response.ok) {
            console.error('Error:', response.statusText);
            return;
        }
        const data = await response.body;
        console.log('Response data:', data);
    };
    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-3xl font-bold">Welcome {'Guest'}!</h1>
            <Button onClick={handleClick}> Click </Button>
        </div>
    );
}
