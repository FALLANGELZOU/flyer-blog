const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./webpack.common');
const { ROOT_PATH, SERVER_HOST, SERVER_PORT } = require('../constant');

module.exports = merge(common, {
  target: 'web', // 解决热更新失效
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    path: path.resolve(ROOT_PATH, './build'),
    filename: 'js/[name].js',
    //TODO: 目前这么写，非跟url刷新会报错
    publicPath: "/"
  },
  devServer: {
    host: SERVER_HOST,
    port: SERVER_PORT,
    compress: true, // gzip压缩
    open: true, // 自动打开默认浏览器
    hot: true, // 启用服务热替换配置
    client: {
      logging: 'warn', // warn以上的信息，才会打印
      overlay: true // 当出现编译错误或警告时，在浏览器中显示全屏覆盖
    },
    // 解决路由跳转404问题
    historyApiFallback: true,

    proxy: {
      // '/api': {
      //   target: 'http://127.0.0.1:3000',
      //   //pathRewrite: {'^/api' : ''},
      //   changeOrigin: true,     // target是域名的话，需要这个参数，
      //   secure: false,          // 设置支持https协议的代理
      // },
    }
  
  },
  plugins: [],

  optimization: {
    minimize: false,
    minimizer: [],
    // 代码分割
    splitChunks: {
      chunks: 'all',
      minSize: 0
    }
  }
});
