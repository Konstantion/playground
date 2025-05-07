import LoginPage from '@/pages/LoginPage.jsx';
import HomePage from '@/pages/HomePage.jsx';
import QuestionDetailPage from '@/pages/QuestionDetailPage.jsx';
import TestModelDetailPage from '@/pages/TestModelDetailPage.jsx';
import TestsPage from '@/pages/TestsPage.jsx';
import TestDetailPage from '@/pages/TestDetailPage.jsx';

export const RHome = '/home';
export const RQuestions = '/questions';
export const RTestModels = '/test_models';
export const RTests = '/tests'; // Renamed route constant
export const RLogin = '/login';

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
    // Renamed Routes for Tests (Immutable Tests)
    TestsList: {
        path: RTests, // Path for the list page (will be handled by HomePage)
        element: <TestsPage />, // Component to render within HomePage
        public: false,
    },
    TestDetail: {
        path: `${RTests}/:id`, // Path for the detail page
        element: <TestDetailPage />,
        public: false,
    },
});
