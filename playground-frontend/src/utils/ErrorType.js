export const ErrorType = Object.freeze({
    Fetch: 'fetch',
    Parse: 'parse',
    Unexpected: 'unexpected',
    Forbidden: 'forbidden',
    Server: 'server',
});

export const errorTypeOf = statusCode => {
    switch (statusCode) {
        case 403:
            return ErrorType.Forbidden;
        case 500:
            return ErrorType.Server;
        default:
            return ErrorType.Unexpected;
    }
};
