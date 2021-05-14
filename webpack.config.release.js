const path = require('path');

module.exports = {
    entry: "./dist/Compiler.js",
    mode: "production",
    output: {
        path: path.resolve(__dirname, 'bundle'),
        filename: 'compiler.js',
        library: {
            name: 'Compiler',
            type: 'var',
            export: 'default',
        },
    },
};