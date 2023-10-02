
const 
path = require('path'),
MonacoWebpackPlugin = require('monaco-editor-webpack-plugin'),
UCNModulePlugin = require('./ucn-webpack-plugin')

module.exports = {
  options: {
    verbose: false,
    buildType: 'iso',
    cssPrefix: 'static/css',
    jsPrefix: 'static/js',
    mediaPrefix: 'static/media'
  },
  modifyWebpackOptions( opts ){
    const options = opts.options.webpackOptions
    // Add .marko to exlude
    options.fileLoaderExclude = [ /\.marko$/, /\.ya?ml$/, ...options.fileLoaderExclude ]

    return options
  },
  modifyWebpackConfig({ webpackConfig }){
    // Client.js moved to `/src/frontend` folder
    if( webpackConfig.entry.client ){
      const clientPath = path.join( __dirname, '/src/frontend/client' )

      webpackConfig.mode == 'production' ?
                  webpackConfig.entry.client = clientPath
                  : webpackConfig.entry.client[1] = clientPath
    }

    webpackConfig.resolve.extensions = [ ...webpackConfig.resolve.extensions, '.css', '.scss', '.marko', '.yml', '.yaml' ]
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      'test': path.resolve(__dirname, './test'),
      'public': path.resolve(__dirname, './public'),
      'frontend': path.resolve(__dirname, './src/frontend'),
      'pages': path.resolve(__dirname, './src/frontend/views/pages'),
      'assets': path.resolve(__dirname, './src/frontend/views/assets'),
      // Important modules
      'vscode': require.resolve('@codingame/monaco-languageclient/lib/vscode-compatibility'),
      // 'fs-inter': require.resolve('./src/backend/lib/Inter/fs'),
      // 'path-inter': require.resolve('./src/backend/lib/Inter/path'),

      // Important project
      'handlers': path.resolve(__dirname, './custom/handlers'),
      'plugins': path.resolve(__dirname, './custom/plugins'),
      'store': path.resolve(__dirname, './store'),
      'sync': path.resolve(__dirname, './sync')
    }
    webpackConfig.resolve.fallback = {
      ...webpackConfig.resolve.fallback,
      // Assert: require.resolve('assert'),
      path: require.resolve('path-browserify'),
      /*
       * Stream: require.resolve('stream-browserify'),
       * crypto: require.resolve('crypto-browserify')
       */
    }

    webpackConfig.module.rules.push({
      test: /\.marko$/,
      loader: require.resolve('@marko/webpack/loader')
    })
    webpackConfig.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: [
        'style-loader', // Creates `style` nodes from JS strings
        'css-loader', // Translates CSS into CommonJS
        'sass-loader' // Compiles Sass to CSS
      ]
    })
    webpackConfig.module.rules.push({
      test: /\.ya?ml$/,
      use: 'yaml-loader'
    })
    // webpackConfig.module.rules.push({
    //   test: /\.ucn$/,
    //   use: require.resolve('./ucn-loader.js')
    // })
    webpackConfig.module.rules.push({
      test: /\.worker\.(c|m)?js$/i,
      loader: 'worker-loader',
      options: { inline: true }
    })

    const monacoConfig = {
      languages: [
        'css',
        'html',
        'javascript',
        'json',
        'less',
        'scss',
        'typescript',
        'jsx',
        'tsx',
        'marko'
      ]
    }
    webpackConfig.plugins = [
      ...webpackConfig.plugins,
      new MonacoWebpackPlugin( monacoConfig ),
      new UCNModulePlugin()
    ]

    return webpackConfig
  }
}