const path = require('path');

module.exports = {
  entry: './dist/index.js',
  mode:"none",
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'bundle.js'
  }
};