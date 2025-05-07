export const PlaceholderDefinition = Object.freeze({
    Int32RandomOneOf: {
        name: 'i32_random_one_of',
        type: 'number',
        desc: 'One of random Integer',
        return: `i32`,
    },
    StrRandomOneOf: {
        name: 'str_random_one_of',
        type: 'string',
        desc: 'One of random String',
        return: `str`,
    },
    Int32Range: {
        name: 'i32_range',
        type: 'number',
        desc: 'One of random Integer in range',
        return: `i32`,
    },
    Int32Value: { name: 'i32_value', type: 'number', desc: 'Integer value', return: `i32` },
    StrValue: { name: 'str_value', type: 'string', desc: 'String value', return: `str` },
});

export const PlaceholderIdentifier = Object.freeze({
    P_1: 'P_1',
    P_2: 'P_2',
    P_3: 'P_3',
    P_4: 'P_4',
    P_5: 'P_5',
    P_6: 'P_6',
    P_7: 'P_7',
    P_8: 'P_8',
    P_9: 'P_9',
    P_10: 'P_10',
});

export const CallArgs = Object.freeze({
    A: 'a',
    B: 'b',
    C: 'c',
    D: 'd',
    E: 'e',
    F: 'f',
    G: 'g',
    H: 'h',
    I: 'i',
    J: 'j',
});

export const parse = definition => {
    switch (definition.type) {
        case PlaceholderDefinition.Int32RandomOneOf.name:
            return PlaceholderDefinition.Int32RandomOneOf;
        case PlaceholderDefinition.StrRandomOneOf.name:
            return PlaceholderDefinition.StrRandomOneOf;
        case PlaceholderDefinition.Int32Range.name:
            return PlaceholderDefinition.Int32Range;
        case PlaceholderDefinition.Int32Value.name:
            return PlaceholderDefinition.Int32Value;
        case PlaceholderDefinition.StrValue.name:
            return PlaceholderDefinition.StrValue;
        default:
            return undefined;
    }
};

export const prettierStr = definition => {
    switch (definition.type) {
        case PlaceholderDefinition.Int32RandomOneOf.name:
            return `RandomOneOf<number>(${definition.options.join(', ')})`;
        case PlaceholderDefinition.StrRandomOneOf.name:
            return `RandomOneOf<string>(${definition.options.join(', ')})`;
        case PlaceholderDefinition.Int32Range.name:
            return `Range<number>(${definition.start}, ${definition.end})`;
        case PlaceholderDefinition.Int32Value.name:
            return `Value<number>(${definition.value})`;
        case PlaceholderDefinition.StrValue.name:
            return `Value<string>(${definition.value})`;
        default:
            return `unknown(${definition.type})`;
    }
};
