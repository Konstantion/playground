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
import { StatisticsPage } from '@/pages/StatisticsPage.jsx';
import TestModelsPage from '@/pages/TestModelsPage.jsx';
import TestsPage from '@/pages/TestsPage.jsx';
import MyTestsPage from '@/pages/MyTestsPage.jsx';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/entities/Role';

export default function HomePage() {
    const { section } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
        if (section) {
            document.title = `${section} - Playground`;
        } else {
            document.title = 'Playground';
        }
    }, [section]);

    const renderPage = page => {
        switch (page) {
            case TestsPPage:
                if (auth?.user?.role === Role.Student) {
                    return <MyTestsPage />;
                } else {
                    return <TestsPage />;
                }
            case QuestionsPPage:
                return <QuestionsPage />;
            case StatisticsPPage:
                return <StatisticsPage />;
            case TestModelsPPage:
                return <TestModelsPage />;
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
                    [QuestionsPPage, TestModelsPPage, TestsPPage].includes(section)
                        ? 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6'
                        : 'max-w-5xl px-4 sm:px-6 lg:px-8 py-6'
                )}
            >
                {renderPage(section)}
            </main>
        </div>
    );
}
