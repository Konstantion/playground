import LoginPage from '../pages/LoginPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import QuestionDetailPage from '@/pages/QuestionDetailPage.jsx';
import TestModelDetailPage from '@/pages/TestModelDetailPage.jsx';
import TestsPage from '@/pages/TestsPage.jsx';
import TestDetailPage from '@/pages/TestDetailPage.jsx';
import TestTakingPage from '@/pages/TestTakingPage.jsx';
import UserTestResultPage from '@/pages/UserTestResultPage.jsx';

export const RHome = '/home';
export const RQuestions = '/questions';
export const RTestModels = '/test_models';
export const RTests = '/tests';
export const RLogin = '/login';
export const RTest = '/test';
export const RUserTestResult = '/user_test_result';

export const Routes = Object.freeze({
    Login: { path: RLogin, element: <LoginPage />, public: true },
    Home: { path: `${RHome}/:section`, element: <HomePage />, public: false },
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
    TestsList: {
        path: RTests,
        element: <TestsPage />,
        public: false,
    },
    TestDetail: {
        path: `${RTests}/:id`,
        element: <TestDetailPage />,
        public: false,
    },
    TestTaking: {
        path: `${RTest}/:userTestId`,
        element: <TestTakingPage />,
        public: false,
    },
    UserTestResult: {
        path: `${RUserTestResult}/:userTestId`,
        element: <UserTestResultPage />,
        public: false,
    },
});
