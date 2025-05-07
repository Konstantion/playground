import Header from '@/components/Header.jsx';
import {
    QuestionsPage as QuestionsPPage,
    StatisticsPage as StatisticsPPage,
    TestModelsPage as TestModelsPPage,
    TestsPage as TestsPPage,
} from '@/pages/Pages.js';
import QuestionsPage from '@/pages/QuestionsPage.jsx';

import { useNavigate, useParams } from 'react-router-dom';
import { RHome } from '@/rout/Routes.jsx';
import NotFound from '@/components/NotFound.jsx';
import { StatisticsPage } from '@/pages/StatisticsPage.jsx'; // This was named component, ensure it's default or used as named
import TestModelsPage from '@/pages/TestModelsPage.jsx';
import { cn } from '@/lib/utils'; // For conditional classes
import { useEffect } from 'react';

// HomePage component: Acts as a container for different sections of the application
export default function HomePage() {
    const { section } = useParams(); // Get the current section from URL parameters (e.g., 'Questions', 'TestModels')
    const navigate = useNavigate(); // Navigation hook

    useEffect(() => {
        if (section) {
            document.title = `${section} - Playground`;
        } else {
            document.title = 'Playground';
        }
    }, [section]);

    const renderPage = page => {
        switch (page) {
            case TestsPPage: // 'Tests'
                // Placeholder for Tests page content
                return (
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
                            Tests Section
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Content for tests will be displayed here.
                        </p>
                    </div>
                );
            case QuestionsPPage: // 'Questions'
                return <QuestionsPage />;
            case StatisticsPPage: // 'Statistics'
                return <StatisticsPage />; // Assuming StatisticsPage is a default export or used correctly
            case TestModelsPPage: // 'TestModels'
                return <TestModelsPage />;
            default:
                // If the section is not recognized, render the NotFound component
                return <NotFound message={`The section '${page}' does not exist.`} />;
        }
    };

    const setPage = newPage => {
        navigate(`${RHome}/${newPage}`); // Update the URL to navigate to the new section
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
            <Header page={section} setPage={setPage} />

            <main
                className={cn(
                    'flex-1 w-full mx-auto',
                    section === QuestionsPPage || section === TestModelsPPage
                        ? 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6' // Wider for list/creation pages
                        : 'max-w-5xl px-4 sm:px-6 lg:px-8 py-6' // Default width
                )}
            >
                {renderPage(section)}
            </main>
        </div>
    );
}
