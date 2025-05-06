export const AlertType = Object.freeze({
    Success: 'success',
    Error: 'error',
    Warning: 'warning',
    Info: 'info',
});

export const defaultAlert = () => {
    return { type: AlertType.Success, message: '', show: false };
};
