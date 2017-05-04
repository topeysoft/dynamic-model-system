var webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon','jasmine'],
    files: [
      'src/**/*spec.ts',
      '**/*.spec.ts',
      '**/*.ts'
    ],
    exclude: [],
   preprocessors: {
      'src/**/*.ts': ['webpack']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: [ 'PhantomJS'],
    // browsers: ['Chrome', 'Firefox', 'Safari', 'PhantomJS', 'IE'],

    singleRun: false,

    concurrency: Infinity
  })
}