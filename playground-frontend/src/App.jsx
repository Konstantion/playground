import {AuthProvider} from './hooks/useAuth.jsx';
import {AppRouter} from './rout/AppRouter.jsx';
import {Toaster} from 'sonner';

function App() {
    return (
        <AuthProvider>
            <>
                <AppRouter />
                <Toaster position={'top-right'} richColors={true} />
            </>
        </AuthProvider>
    );
}

export default App;
