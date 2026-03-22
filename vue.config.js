const path = require('path')

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .exclude
      .add(path.resolve(__dirname, 'src/fixtures.js'))
  }
}
