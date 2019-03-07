const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname,'src/pages/index.js'),
  mode:"none",
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: '[name].js'
  },
  plugins:[
    new HtmlWebpackPlugin({
      title:"rival js ",
      filename:"pages/index.html",
      template: path.resolve(__dirname,"src/pages/index.html"),
      // chunks: ['app']
    })
  ],
  module:{
    rules: [
      {
        test:/\.js$/,
        use:"babel-loader",
        exclude:/(node_modules|bower_components)/
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options:{}
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions:[".js",".ts",".jsx",".scss"],
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'
    }
  }
};