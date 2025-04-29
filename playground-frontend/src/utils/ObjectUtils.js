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

export const typeOf = (obj) => {
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

export const deepFreeze = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key) => {
        if (typeOf(obj[key]) === TypeofObject.Object) {
            deepFreeze(obj[key]);
        }
    });
    return obj;
};
