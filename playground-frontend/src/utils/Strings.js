export const blank = str => {
    return str === undefined || str === null || str.trim() === '';
};

export const below = (str, length) => {
    return !blank(str) && str.length < length;
};

export const above = (str, length) => {
    return !blank(str) && str.length > length;
};

export const between = (str, min, max) => {
    return !blank(str) && str.length >= min && str.length <= max;
};

export const contains = (str, substr) => {
    return !blank(str) && str.includes(substr);
};

export const substrs = (str, end) => {
    return substr(str, 0, end);
};

export const substr = (str, start, end) => {
    if (blank(str)) {
        return '';
    }

    return str.substring(start, end);
};
