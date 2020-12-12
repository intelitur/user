const path = require('path')


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
    },
    {
        from: './src/services/info/*.json',
        to: './info/',
        flatten: true,
    },
    {
        from: './assets/*',
        to: './'
    },
    {
        from: './*/*.ico',
        to: './',
        flatten: true,
    }
])

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const miniCssExtract = new MiniCssExtractPlugin({
    filename: 'assets/[name].css'
})

module.exports = {
    entry: './src/index.js'
    ,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js']
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
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            url: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: true
                        }
                    }
                ]
            },
            { 
                test: /\.(png|jpg)$/, 
                loader: 'file-loader',
                options: {
                    outputPath: 'assets/images',
                    publicPath: 'images',
                },
            }
        ]
    },
    plugins: [
        htmlWebpack,
        copyWebpack,
        miniCssExtract
    ]
}