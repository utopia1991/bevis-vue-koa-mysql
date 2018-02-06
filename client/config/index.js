var path = require('path')
var { config_client_port } = require('../../config')

module.exports = {
  build: {
    // 发布环境，不需要node环境和跨域代理
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    // 发布项目的静态资源文件根路径
    assetsPublicPath: '/demo/',
    // 本地测试用
    assetsPublicPath: '/',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    // 开发环境，使用node作为本地服务器，接口请求需要跨域代理请求
    env: require('./dev.env'),
    port: config_client_port,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // 开发跨域请求
    proxyTable: {
      '/api': {
        target: 'http://127.0.0.1:6061',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
    cssSourceMap: false
  }
}
