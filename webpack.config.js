const path = require('path')
const fs = require('file-system')

const getCssFiles = function (currentDirPath) {
    var files = []
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var file_path = path.join(currentDirPath, name);
        var stat = fs.statSync(file_path);
        if (stat.isFile() && path.extname(file_path) === '.css') {
            files.push(file_path);
        } else if (stat.isDirectory()) {
            files = [...files, ...getCssFiles(file_path)]
        }
    });
    return files
}

const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlWebpack = new HtmlWebpackPlugin(
    {
        inject: true,
        template: './src/index.html',
        filename: './index.html',
    }
)

const CopyWebpackPlugin = require('copy-webpack-plugin')
const copyWebpack = new CopyWebpackPlugin([
    {
        from: './src/views/**/*.html',
        to: './html/',
        flatten: true,
    }
])

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractText = new ExtractTextPlugin(
    "styles.css"
);

module.exports = {
    entry: {
        'styles.css': 
            getCssFiles('./src').map((file_path) => 
            path.resolve(__dirname, file_path))
        ,
        'main.js': [
            path.resolve(__dirname, 'src/index.js')
        ]
    },
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.css']
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css?$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        htmlWebpack,
        copyWebpack,
        extractText
    ]
}