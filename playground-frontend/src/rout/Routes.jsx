// playground-frontend/src/rout/Routes.jsx

import LoginPage from '../pages/LoginPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import QuestionDetailPage from '@/pages/QuestionDetailPage.jsx';
import TestModelDetailPage from '@/pages/TestModelDetailPage.jsx';
import TestsPage from '@/pages/TestsPage.jsx'; // Admin/Teacher list view
import TestDetailPage from '@/pages/TestDetailPage.jsx'; // Immutable Test detail view
import TestTakingPage from '@/pages/TestTakingPage.jsx';
import UserTestResultPage from '@/pages/UserTestResultPage.jsx'; // Import the test taking page component

export const RHome = '/home';
export const RQuestions = '/questions';
export const RTestModels = '/test_models';
export const RTests = '/tests'; // Base for Admin/Teacher list view of Immutable Tests
export const RLogin = '/login';
export const RTest = '/test'; // Define the base path for taking a test
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
        element: <TestsPage />, // Rendered within HomePage based on section param
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
