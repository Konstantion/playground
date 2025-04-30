export const preventAnd = callback => event => {
    event.preventDefault();
    callback();
};

export const preventAndAsync = callback => async event => {
    event.preventDefault();
    await callback();
};
