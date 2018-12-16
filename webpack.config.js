const path = require('path');

module.exports = {
    context: path.join(__dirname, './src'),
    devtool: 'source-map',
    performance: { hints: false },
    entry: {
        index: './index',
        'add-restaurant': './add-restaurant',
        'restaurant-details': './restaurant-details',
        login: './login',
        register: './register',
        profile: './profile',
        'edit-profile': './edit-profile'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname + '/dist')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },        
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{ loader: 'ts-loader' }],
            },
            { test: /\.handlebars$/, loader: "handlebars-loader" }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    name: "commons",
                    minChunks: 2,
                    minSize: 0
                }
            }
        }
    },
    devServer: {
        contentBase: __dirname,
        publicPath: '/dist/',
        compress: true,
        port: 8080
    }
}

