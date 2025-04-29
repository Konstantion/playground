import { AuthProvider } from './hooks/useAuth';
import { AppRouter } from './rout/AppRouter';

function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}

export default App;
