import { useAuth } from '@/hooks/useAuth.jsx';
import { Button } from '@/components/ui/button.js';
import { pagesFor } from '@/pages/Pages.js'; // Import TestsPage key
import {
    LogOut,
    UserCircle,
    Briefcase,
    LayoutDashboard,
    BarChart3,
    Settings,
    ClipboardList, // Using ClipboardList for "Tests"
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mapping page keys to icons for the header navigation
const pageIcons = {
    TestsPage: <ClipboardList size={16} />, // Use TestsPage key
    TestModels: <Briefcase size={16} />,
    Questions: <LayoutDashboard size={16} />,
    Statistics: <BarChart3 size={16} />,
    // Add more mappings as needed
};

const Header = ({ page, setPage }) => {
    const { logout, auth } = useAuth(); // Authentication context

    const accessiblePages = pagesFor(auth.user.role);

    return (
        <header className="w-full bg-white dark:bg-slate-800 shadow-md px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-50 border-b dark:border-slate-700">
            <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                    <Settings size={28} className="text-sky-600 dark:text-sky-500" />{' '}
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                        Playground
                    </h1>
                </div>

                <nav className="hidden md:flex items-center gap-1 sm:gap-2">
                    {accessiblePages.map(key => (
                        <Button
                            key={key}
                            variant="ghost"
                            onClick={() => setPage(key)}
                            className={cn(
                                'text-sm font-medium px-3 py-2 rounded-md transition-colors duration-150 ease-in-out flex items-center gap-1.5',
                                page === key
                                    ? 'bg-sky-100 dark:bg-sky-700/50 text-sky-600 dark:text-sky-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100'
                            )}
                            aria-current={page === key ? 'page' : undefined}
                        >
                            {pageIcons[key] || <Briefcase size={16} /> /* Default icon */}
                            {key}
                        </Button>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <UserCircle size={20} className="text-slate-500 dark:text-slate-400" />
                    <span className="font-medium hidden sm:inline">{auth.user.username}</span>
                    <span className="px-1.5 py-0.5 text-xs bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-200 rounded-full capitalize">
                        {auth.user.role.toLowerCase()}
                    </span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-xs sm:text-sm border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 px-2.5 sm:px-3"
                >
                    <LogOut size={14} />
                    Logout
                </Button>
            </div>
        </header>
    );
};

export default Header;
