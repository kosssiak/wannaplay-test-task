const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const entry = path.resolve(fs.realpathSync(process.cwd()) + "/src/index.ts");

const assetsHolder = addAssetsPlaceholder();

function addAssetsPlaceholder() {
    const assets = process.cwd() + '/assets/file.json';
    const res = fs.readFileSync(assets, 'utf-8');

    return `<script type="text/javascript">window["Assets"] = ${res}; window['MODE'] = 'MRAID';</script>`;
}

module.exports = {
    mode: 'production',
    cache: false,
    entry: entry,
    output: {
        filename: 'main.js',
        path: process.cwd() + '/dist',
        clean: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devServer: {
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{ loader: "ts-loader" }],
                exclude: /node_modules/
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            assetsHolder,
            template: __dirname + "/index.html",
            inlineSource: '.(js|css)$',
            inject: 'body'
        })
    ]
};