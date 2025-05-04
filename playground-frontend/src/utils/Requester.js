import { ErrorType, errorTypeOf, toReadableMsg } from '@/utils/ErrorType.js';
import { blank } from '@/utils/Strings.js';

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
            let type = errorTypeOf(response.status);
            let message = json.message || response.statusText;
            if (blank(message)) {
                message = toReadableMsg(type);
            }
            onError(type, message);
        } else {
            onData(json);
        }
    } catch (error) {
        let message = error.message || error.toString();
        if (blank(message)) {
            message = toReadableMsg(ErrorType.Fetch);
        }
        onError(ErrorType.Fetch, message);
    }
};
