import Header from '@/components/Header.jsx';
import {
    QuestionsPage as QuestionsPPage,
    StatisticsPage as StatisticsPPage,
    TestModelsPage as TestModelsPPage,
    TestsPage as TestsPPage,
} from '@/pages/Pages.js';
import QuestionsPage from '@/pages/QuestionsPage.jsx';

import {useNavigate, useParams} from 'react-router-dom';
import {RHome} from '@/rout/Routes.jsx';
import NotFound from '@/components/NotFound.jsx';
import {StatisticsPage} from '@/pages/StatisticsPage.jsx';
import TestModelsPage from '@/pages/TestModelsPage.jsx';

export default function HomePage() {
    const { section } = useParams();
    const navigate = useNavigate();

    const renderPage = page => {
        switch (page) {
            case TestsPPage:
                return <div>Tests</div>;
            case QuestionsPPage:
                return <QuestionsPage />;
            case StatisticsPPage:
                return <StatisticsPage />;
            case TestModelsPPage:
                return <TestModelsPage />;
            default:
                return <NotFound />;
        }
    };

    const setPage = newPage => {
        navigate(`${RHome}/${newPage}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header page={section} setPage={setPage} />
            <main className="flex-1 p-6 max-w-6xl mx-auto w-full">{renderPage(section)}</main>
        </div>
    );
}
