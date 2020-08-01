const path = require('path');

module.exports = {
    entry: { index: './src/dependency-injector.ts' },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/public/',
    },
};
