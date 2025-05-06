export const TypeofObject = Object.freeze({
    Object: 'object',
    Array: 'array',
    String: 'string',
    Number: 'number',
    Boolean: 'boolean',
    Function: 'function',
    Undefined: 'undefined',
    Null: 'null',
    Unknown: 'unknown',
});

export const sCp = obj => {
    return {...obj};
};

export const dCp = obj => {
    structuredClone(obj);
};

export const sNotEmpty = obj => {
    return obj && !sEq(obj, {});
};

export const sEq = (obj1, obj2) => {
    if (obj1 === obj2) {
        return true;
    }

    if (typeOf(obj1) !== typeOf(obj2)) {
        return false;
    }

    if (typeOf(obj1) === TypeofObject.Object) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            if (!sEq(obj1[key], obj2[key])) {
                return false;
            }
        }
        return true;
    }

    return false;
};

export const typeOf = obj => {
    if (obj === null) {
        return TypeofObject.Null;
    }

    const type = typeof obj;

    if (type === 'object') {
        if (Array.isArray(obj)) {
            return TypeofObject.Array;
        }
        return TypeofObject.Object;
    }

    switch (type) {
        case 'string':
            return TypeofObject.String;
        case 'number':
            return TypeofObject.Number;
        case 'boolean':
            return TypeofObject.Boolean;
        case 'function':
            return TypeofObject.Function;
        case 'undefined':
            return TypeofObject.Undefined;
        default:
            return TypeofObject.Unknown;
    }
};

export const deepFreeze = obj => {
    Object.freeze(obj);
    Object.keys(obj).forEach(key => {
        if (typeOf(obj[key]) === TypeofObject.Object) {
            deepFreeze(obj[key]);
        }
    });
    return obj;
};
