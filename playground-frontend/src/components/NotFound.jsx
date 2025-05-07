import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';
import {AlertTriangle} from 'lucide-react';
import {TestsPage} from '@/pages/Pages.js';
import {RHome} from '@/rout/Routes.jsx';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-6">
                Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <Button onClick={() => navigate(`${RHome}/${TestsPage}`)}>Go to Home</Button>
        </div>
    );
}
