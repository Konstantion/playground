import { Endpoints } from './Endpoints';
import { ErrorType, errorTypeOf } from './ErrorType';

export const fetchJwt = async (username, password, onUserAndToken, onError) => {
    let response;
    try {
        response = await fetch(Endpoints.Auth.Login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
    } catch (error) {
        onError(ErrorType.Fetch, error);
        return;
    }

    try {
        const data = await response.json();

        if (!response.ok) {
            onError(errorTypeOf(response.status), data.message);
        } else {
            const userAndToken = data;
            if (userAndToken && userAndToken.accessToken && userAndToken.user) {
                onUserAndToken(userAndToken);
            } else {
                console.log('Token not found in response:', data);
                onError(ErrorType.Parse, 'No token received');
            }
        }
    } catch (error) {
        onError(ErrorType.Parse, error);
    }
};

export const register = async (username, password, role, onRegistered, onError) => {
    let response;
    try {
        response = await fetch(Endpoints.Auth.Register, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        });
    } catch (error) {
        onError(ErrorType.Fetch, error);
        return;
    }

    try {
        const data = await response.json();

        if (!response.ok) {
            onError(errorTypeOf(response.status), data.message);
        } else {
            onRegistered(data);
        }
    } catch (error) {
        onError(ErrorType.Parse, error);
    }
};
