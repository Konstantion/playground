export const ErrorType = Object.freeze({
    Fetch: 'fetch',
    Parse: 'parse',
    Unexpected: 'unexpected',
    Forbidden: 'forbidden',
    Server: 'server',
    TokenExpired: 'tokenExpired',
});

export const errorTypeOf = statusCode => {
    switch (statusCode) {
        case 403:
            return ErrorType.Forbidden;
        case 401:
            return ErrorType.TokenExpired;
        case 500:
            return ErrorType.Server;
        default:
            return ErrorType.Unexpected;
    }
};

export const toReadableMsg = statusCode => {
    switch (statusCode) {
        case ErrorType.Fetch:
            return 'Network error';
        case ErrorType.Parse:
            return 'Parsing error';
        case ErrorType.Unexpected:
            return 'Unexpected error';
        case ErrorType.Forbidden:
            return 'Forbidden';
        case ErrorType.Server:
            return 'Server error';
        case ErrorType.TokenExpired:
            return 'Token expired';
        default:
            return 'Unknown error';
    }
};
