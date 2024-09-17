const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const entry = path.resolve(fs.realpathSync(process.cwd()) + "/src/index.ts");

const assetsHolder = addAssetsPlaceholder();

function addAssetsPlaceholder() {
    const assets = process.cwd() + '/assets/file.json';
    const res = fs.readFileSync(assets, 'utf-8');

    return `<script type="text/javascript">window["Assets"] = ${res}; window['MODE'] = 'DEV';</script>`;
}

module.exports = {
    mode: 'development',
    cache: false,
    entry: entry,
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
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
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
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