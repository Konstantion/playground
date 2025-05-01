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
        case 498:
            return ErrorType.TokenExpired;
        case 500:
            return ErrorType.Server;
        default:
            return ErrorType.Unexpected;
    }
};
