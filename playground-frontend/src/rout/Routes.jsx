// playground-frontend/src/rout/Routes.jsx

import LoginPage from '../pages/LoginPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import QuestionDetailPage from '@/pages/QuestionDetailPage.jsx';
import { StatisticsPage } from '@/pages/StatisticsPage.jsx';
import TestModelDetailPage from '@/pages/TestModelDetailPage.jsx';
import TestsPage from '@/pages/TestsPage.jsx'; // Admin/Teacher list view
// Remove duplicate import if MyTestsPage is not directly routed
// import MyTestsPage from '@/pages/MyTestsPage.jsx'; // Student list view (rendered by HomePage)
import TestDetailPage from '@/pages/TestDetailPage.jsx'; // Immutable Test detail view
import TestTakingPage from '@/pages/TestTakingPage.jsx'; // Import the test taking page component

export const RHome = '/home';
export const RQuestions = '/questions';
export const RTestModels = '/test_models';
export const RTests = '/tests'; // Base for Admin/Teacher list view of Immutable Tests
export const RLogin = '/login';
export const RTest = '/test'; // Define the base path for taking a test

export const Routes = Object.freeze({
    Login: { path: RLogin, element: <LoginPage />, public: true },
    Home: { path: `${RHome}/:section`, element: <HomePage />, public: false },
    // Statistics: { path: '/statistics', element: <StatisticsPage />, public: false }, // Example if needed separately
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
    // Route for Admin/Teacher list view (handled by HomePage)
    TestsList: {
        path: RTests,
        element: <TestsPage />, // Rendered within HomePage based on section param
        public: false,
    },
    // Route for Admin/Teacher detail view of an Immutable Test
    TestDetail: {
        path: `${RTests}/:id`,
        element: <TestDetailPage />,
        public: false,
    },
    // --- New Route for Student Test Taking ---
    TestTaking: {
        path: `${RTest}/:userTestId`, // Use RTest constant and userTestId param
        element: <TestTakingPage />, // Point to the TestTakingPage component
        public: false, // Requires authentication
    },
});
