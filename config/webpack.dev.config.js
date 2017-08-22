var path = require('path')
var webpack = require('webpack')

const resolve = path.resolve;
const webRootDir = resolve(__dirname, '../');


module.exports = {
    entry: resolve(webRootDir, './src/main.js'),
    output: {
        path: resolve(webRootDir, './build'),
        publicPath: '/build/',
        // path:path.resolve('E:/dev/test/publish_web/src/main/resources/static/', './build'),
        // publicPath:path.resolve('E:/dev/test/publish_web/src/main/resources/static/', '/build/'),
        filename: 'build.js'
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
                loader: 'babel-loader',
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
            'mobilePage': resolve(webRootDir, './src/mobilePage'),
            'page': resolve(webRootDir, './src/page'),
            'style': resolve(webRootDir, './src/style'),
            'script': resolve(webRootDir, './src/script'),
            'static': resolve(webRootDir, './static')
        }
    },
    devServer: {
        host: '0.0.0.0',
        port: 30181,
        disableHostCheck: true,
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

    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: `"development"`
        },
        'packageEnv': `"${process.env.NODE_ENV}"`
    }),

])

