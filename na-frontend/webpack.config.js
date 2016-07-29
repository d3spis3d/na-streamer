var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './js/app.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ minimize: true, output: { comments: false }})
    ],
    eslint: {
        failOnError: true
    },
    devtool: '#source-map',
    devServer: {
		stats: {
			colors: true
		},
		proxy: [{
			path: "/api/*",
			target: "http://127.0.0.1:4000"
		}]
    }
};
