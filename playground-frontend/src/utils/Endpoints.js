import {deepFreeze} from './ObjectUtils';

const BACKEND_URL = 'http://localhost:8079';
const BACKEND_API_URL = `${BACKEND_URL}/api`;

export const Endpoints = deepFreeze({
    Auth: {
        Login: `${BACKEND_API_URL}/auth/login`,
        Register: `${BACKEND_API_URL}/auth/register`,
    },
    Hello: `${BACKEND_API_URL}/hello`,
    Questions: {
        Base: `${BACKEND_API_URL}/questions`,
        GetAll: `${BACKEND_API_URL}/questions/all`,
    },
    Variant: {
        Base: `${BACKEND_API_URL}/variant`,
    },
});
