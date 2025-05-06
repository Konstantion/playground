import {Endpoints} from './Endpoints';
import {ErrorType, errorTypeOf} from './ErrorType';

export const fetchJwt = async (username, password, onUserAndToken, onError) => {
    try {
        const response = await fetch(Endpoints.Auth.Login, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message = data.message || response.statusText;
            onError(errorTypeOf(response.status), message);
            return;
        }

        if (data?.accessToken && data?.user) {
            onUserAndToken(data);
        } else {
            onError(ErrorType.Parse, 'No token received');
        }
    } catch (error) {
        onError(ErrorType.Fetch, error.message || error.toString());
    }
};

export const register = async (username, password, role, onRegistered, onError) => {
    try {
        const response = await fetch(Endpoints.Auth.Register, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password, role}),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message = data.message || response.statusText;
            onError(errorTypeOf(response.status), message);
            return;
        }

        onRegistered(data);
    } catch (error) {
        onError(ErrorType.Fetch, error.message || error.toString());
    }
};
