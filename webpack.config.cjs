const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',  // Or 'production' for production builds
  entry: {
    authentication: './public/js/authentication.js',
    profile: './public/js/profile.js',
    home: './public/js/home.js',
    admin: './public/js/admin.js',
    verify: './public/js/verify.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new Dotenv()
  ],
};