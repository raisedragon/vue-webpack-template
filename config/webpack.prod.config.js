var path = require('path');
var webpack = require('webpack');


const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');



const resolve = path.resolve;
const webRootDir = resolve(__dirname, '../');


module.exports = {
    entry: {
        "babel-polyfill": "babel-polyfill",
        vendor: resolve(webRootDir, './src/vendor.js'),
        main: resolve(webRootDir, './src/main.js'),
    },
    output: {
        path: resolve(webRootDir, './build'),
        // publicPath: '/build/',
        filename: '[name].[chunkhash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        loader: 'css-loader',
                        options: {
                            minimize: process.env.NODE_ENV === 'production',
                        }
                    },
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 5 versions']
                        })
                    ]

                }
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 5 version", "Firefox' +
                ' 15"]}!sass-loader?sourceMap&outputStyle=compressed'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'components': resolve(webRootDir, './src/components'),
            'mobilePage': path.resolve(webRootDir, './src/mobilePage'),
            'page': resolve(webRootDir, './src/page'),
            'style': resolve(webRootDir, './src/style'),
            'script': resolve(webRootDir, './src/script'),
            'static': resolve(webRootDir, './static')
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },


}

module.exports.devtool = '#source-map'
// http://vue-loader.vuejs.org/en/workflow/production.html
module.exports.plugins = (module.exports.plugins || []).concat([
    // new ExtractTextPlugin("style.[hash:8].css"),

    new CleanWebpackPlugin(['build/*', 'm/*'], {
        root: resolve(webRootDir, '../resources/static'),
        verbose: true,
        dry: false,
        exclude: [],
        watch: false
    }),


    /*pc端入口配置*/
    new HtmlWebpackPlugin({
        // favicon: resolve(webRootDir, './src/static/ico_pb_16X16.ico' ),
        template: resolve(webRootDir, './index-template.html' ),
        filename:   'index.html'  ,
        title: 'XX系统',
    }),
    /*变量定义*/
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: `"production"`
            /*`"${process.env.NODE_ENV}"`*/
        },
        'packageEnv': `"${process.env.NODE_ENV}"`
    }),
    new webpack.optimize.UglifyJsPlugin({
        // sourceMap: true,

        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false,

        compress: {
            warnings: false,
            // 删除所有的 `console` 语句
            // 还可以兼容ie浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
        }
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: "vendor.js",
        minChunks: Infinity,
        chunks: ["main"],  // 只在 main 的 entry 中使用到 commonChunk
    }),




])

