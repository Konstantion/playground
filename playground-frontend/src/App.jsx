import { AuthProvider } from './hooks/useAuth.jsx';
import { AppRouter } from './rout/AppRouter.jsx';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip.js';

function App() {
    return (
        <AuthProvider>
            <TooltipProvider>
                <>
                    <AppRouter />
                    <Toaster position={'top-right'} richColors={true} />
                </>
            </TooltipProvider>
        </AuthProvider>
    );
}

export default App;
