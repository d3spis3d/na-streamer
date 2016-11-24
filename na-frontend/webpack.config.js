const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: `${__dirname}/dist`,
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
      },
      {
        test: /\.css$/, loader: 'style-loader!css-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true, output: { comments: false } })
  ],
  eslint: {
    failOnError: true
  },
  devtool: 'eval',
  devServer: {
    stats: {
      colors: true
    },
    proxy: [{
      path: '/api/*',
      target: 'http://127.0.0.1:4000'
    }]
  }
};
