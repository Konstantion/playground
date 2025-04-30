/** @type {import('prettier').Config} */
module.exports = {
    tabWidth: 4, // 4 spaces per tab
    useTabs: false, // use spaces, not actual tab characters
    semi: true, // add semicolons at end of statements
    singleQuote: true, // use single quotes instead of double
    trailingComma: 'es5', // add trailing commas where valid in ES5 (objects, arrays)
    bracketSpacing: true, // print spaces between brackets in object literals
    arrowParens: 'avoid', // omit parens when possible in arrow functions
    printWidth: 100, // max line length before wrapping
};
