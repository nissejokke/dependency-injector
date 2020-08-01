const merge = require('webpack-merge').merge;
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'eval-module-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: { loader: 'ts-loader', options: { configFile: 'tsconfig.json' } },
            },
        ],
    },
    mode: 'development',
});
