import { deepFreeze } from './ObjectUtils';

const BACKEND_API_URL = import.meta.env.DEV ? 'http://localhost:8079/api' : '/api';

export const Endpoints = deepFreeze({
    Auth: {
        Login: `${BACKEND_API_URL}/auth/login`,
        Register: `${BACKEND_API_URL}/auth/register`,
        Base: `${BACKEND_API_URL}/auth`,
    },
    Hello: `${BACKEND_API_URL}/hello`,
    Questions: {
        Base: `${BACKEND_API_URL}/questions`,
        GetAll: `${BACKEND_API_URL}/questions/all`,
    },
    Variant: {
        Base: `${BACKEND_API_URL}/variant`,
    },
    TestModel: {
        Base: `${BACKEND_API_URL}/test_model`,
    },
    ImmutableTest: {
        Base: `${BACKEND_API_URL}/immutable_test`,
    },
    UserTest: {
        Base: `${BACKEND_API_URL}/user_test`,
    },
});
