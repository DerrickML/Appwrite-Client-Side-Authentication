const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',  // Or 'production' for production builds
  entry: {
    login_signin: './public/sign-login.js',
    profile: './public/profile.js',
    home: './public/home.js',
    admin: './public/admin.js',
    verify: './public/verify.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
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