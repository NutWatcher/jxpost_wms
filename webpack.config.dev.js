const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    // JS 执行入口文件
    entry: {
        bundle: './src/index.jsx',
        bundleLog: './src/login.jsx'
    },
    mode: 'development',
    devtool: 'source-map',
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        filename: '[name].js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, './dist')
    },
    devServer: {
        port: 3050,
        proxy: {
            '/v1': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime',
                            ['import', {
                                'libraryName': 'antd',
                                'libraryDirectory': 'es',
                                'style': true
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader' // translates CSS into CommonJS
                }, {
                    loader: 'less-loader', // compiles Less to CSS
                    options: {
                        modifyVars: {
                            'primary-color': '#1DA57A'
                        },
                        javascriptEnabled: true
                    }
                }]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: 'public/index-dev.html',
            to: 'index.html'
        },
        {
            from: 'public/login.html',
            to: 'login.html'
        }
            // ,
            // {
            //     from: 'public/loadIndex.js',
            //     to: 'loadIndex.js'
            // },
            // {
            //     from: 'public/loadLogin.js',
            //     to: 'loadLogin.js'
            // }
        ])
    ]
};
