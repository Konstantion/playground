import LoginPage from '../pages/LoginPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import QuestionDetailPage from '@/pages/QuestionDetailPage.jsx';
import { StatisticsPage } from '@/pages/StatisticsPage.jsx';

export const RHome = '/home';
export const RQuestions = '/questions';

export const Routes = Object.freeze({
    Login: { path: '/login', element: <LoginPage />, public: true },
    Home: { path: `${RHome}/:section`, element: <HomePage />, public: false }, // updated path
    Test: { path: `/test`, element: <StatisticsPage />, public: false }, // updated path
    QuestionDetail: {
        path: `${RQuestions}/:id`,
        element: <QuestionDetailPage />,
        public: false,
    },
});
