const path = require('path')

module.exports = {
entry: [
  "@babel/polyfill", path.resolve(__dirname, 'app.js')
],
output: {
  path: path.resolve(__dirname, 'dist')
},
  mode: process.env.NODE_ENV,
  module: {
    rules: [
    ],
  },
  plugins: [
  ],
}