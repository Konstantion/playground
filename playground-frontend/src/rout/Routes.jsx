import LoginPage from '../pages/LoginPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import QuestionDetailPage from '@/pages/QuestionDetailPage.jsx';
import { StatisticsPage } from '@/pages/StatisticsPage.jsx';
import TestModelDetailPage from '@/pages/TestModelDetailPage.jsx';

export const RHome = '/home';
export const RQuestions = '/questions';
export const RTestModels = '/test_models';
export const RLogin = '/login';
export const RTest = '/test';

export const Routes = Object.freeze({
    Login: { path: RLogin, element: <LoginPage />, public: true },
    Home: { path: `${RHome}/:section`, element: <HomePage />, public: false }, // updated path
    Test: { path: RTest, element: <StatisticsPage />, public: false }, // updated path
    QuestionDetail: {
        path: `${RQuestions}/:id`,
        element: <QuestionDetailPage />,
        public: false,
    },
    TestModelDetail: {
        path: `${RTestModels}/:id`,
        element: <TestModelDetailPage />,
        public: false,
    },
});
