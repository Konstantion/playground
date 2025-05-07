export const Action = Object.freeze({
    ADD: 'Add',
    REMOVE: 'Remove',
});

export const actionStr = action => {
    switch (action) {
        case Action.ADD:
            return 'ADD';
        case Action.REMOVE:
            return 'REMOVE';
    }
};

export const userStr = action => {
    switch (action) {
        case Action.ADD:
            return 'added';
        case Action.REMOVE:
            return 'removed';
    }
};
