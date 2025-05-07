import Header from '@/components/Header.jsx';
import {
    QuestionsPage as QuestionsPPage,
    StatisticsPage as StatisticsPPage,
    TestModelsPage as TestModelsPPage,
    TestsPage as TestsPPage, // Use the correct key
} from '@/pages/Pages.js';
import QuestionsPage from '@/pages/QuestionsPage.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { RHome } from '@/rout/Routes.jsx';
import NotFound from '@/components/NotFound.jsx';
import { StatisticsPage } from '@/pages/StatisticsPage.jsx';
import TestModelsPage from '@/pages/TestModelsPage.jsx';
import TestsPage from '@/pages/TestsPage.jsx'; // Import the renamed component
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export default function HomePage() {
    const { section } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (section) {
            document.title = `${section} - Playground`; // Title uses the key directly
        } else {
            document.title = 'Playground';
        }
    }, [section]);

    const renderPage = page => {
        switch (page) {
            case QuestionsPPage:
                return <QuestionsPage />;
            case StatisticsPPage:
                return <StatisticsPage />;
            case TestModelsPPage:
                return <TestModelsPage />;
            case TestsPPage: // Use the key for the immutable tests list
                return <TestsPage />; // Render the renamed component
            default:
                return <NotFound message={`The section '${page}' does not exist.`} />;
        }
    };

    const setPage = newPage => {
        navigate(`${RHome}/${newPage}`);
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
            <Header page={section} setPage={setPage} />
            <main
                className={cn(
                    'flex-1 w-full mx-auto',
                    // Adjust layout based on section key
                    section === QuestionsPPage ||
                        section === TestModelsPPage ||
                        section === TestsPPage
                        ? 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6'
                        : 'max-w-5xl px-4 sm:px-6 lg:px-8 py-6'
                )}
            >
                {renderPage(section)}
            </main>
        </div>
    );
}
