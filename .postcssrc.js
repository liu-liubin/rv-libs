module.exports = {
  plugins: {
    'postcss-pxtorem':{
      "rootValue": 37.5,
      "propList": ["*"],
      "minPixelValue":1,
      "replace": true,
      "mediaQuery": false,
    }
  }
}