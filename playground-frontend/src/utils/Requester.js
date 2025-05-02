import {ErrorType, errorTypeOf} from '@/utils/ErrorType.js';

export const authenticatedReq = async (url, method, body, token, onError, onData) => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    const params = { method, headers };
    if (body) {
        params.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, params);

        const json = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message = json.message || response.statusText;
            onError(errorTypeOf(response.status), message);
        } else {
            onData(json);
        }
    } catch (error) {
        onError(ErrorType.Fetch, error.message || error.toString());
    }
};
