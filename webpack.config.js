export default {
  entry: `./lib/index.js`,
  devtool: 'source-map',
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'Textbox',
    filename: 'textbox.js',
    globalObject: 'this'
  },
  module: {
    rules: [
      { test: /\.js$/,
        exclude: /node_modules/,
        use: { 
          loader: 'babel-loader',
          options:  {
            presets: [ [ '@babel/preset-env', {
              targets: {
                browsers: [
                  '>0.25%', 'not op_mini all'
                ]
              }
            } ] ]
          }
        }
      }
    ]
  },
  devServer: {
    static: 'examples',
    compress: true,
    port: 9000
  }
}

