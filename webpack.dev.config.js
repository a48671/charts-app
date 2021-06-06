const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.[hash].js",
        path: path.resolve(__dirname, "dist")
    },
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        port: 5000,
        hot: true,
        open: true,
        watchOptions: {
            poll: true,
            ignored: '/node_modules/'
        }
    },
    resolve: {
        alias: {
            'src': path.resolve(__dirname, 'src'),
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: "./src/index.html", minify: true }),
        new MiniCssExtractPlugin({ filename: "style.[hash].css" })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            }
        ],
    },
}
