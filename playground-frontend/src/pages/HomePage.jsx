import Header from '@/components/Header.jsx';
import { QuestionsPage as QQuestionsPage, StatisticsPage, TestsPage } from '@/pages/Pages.js';
import QuestionsPage from '@/pages/QuestionsPage.jsx';

import { useNavigate, useParams } from 'react-router-dom';
import { RHome } from '@/rout/Routes.jsx';
import NotFound from '@/components/NotFound.jsx';

export default function HomePage() {
    const { section } = useParams();
    const navigate = useNavigate();

    const renderPage = page => {
        switch (page) {
            case TestsPage:
                return <div>Tests</div>;
            case QQuestionsPage:
                return <QuestionsPage />;
            case StatisticsPage:
                return <div>Statistics</div>;
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
