const merge = require('webpack-merge').merge;
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    plugins: [],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: false,
                    keep_fnames: true,
                    keep_classnames: true,
                },
                sourceMap: true,
            }),
        ],
    },
    devtool: 'hidden-source-map',
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                use: { loader: 'ts-loader', options: { configFile: 'tsconfig.json' } },
            },
        ],
    },
    mode: 'production',
});
