import {useAuth} from '@/hooks/useAuth.jsx';
import {Button} from '@/components/ui/button.js';
import {pagesFor} from '@/pages/Pages.js';

const Header = ({ page, setPage }) => {
    const { logout, auth } = useAuth();

    return (
        <header className="w-full bg-white shadow-sm px-4 py-2 flex justify-between items-center">
            <div className="flex items-end gap-6">
                <h1 className="text-xl font-semibold">Playground</h1>

                <nav className="flex gap-4">
                    {pagesFor(auth.user.role).map(key => (
                        <span
                            key={key}
                            onClick={() => setPage(key)}
                            className={`text-sm cursor-pointer pb-1 ${
                                page === key ? 'border-b-2 border-black' : 'text-gray-600'
                            }`}
                        >
                            {key}
                        </span>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{auth.user.username}</span>
                <Button variant="outline" onClick={logout} className="text-xs">
                    Logout
                </Button>
            </div>
        </header>
    );
};

export default Header;
