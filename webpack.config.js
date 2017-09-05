const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const SvgStore = require('webpack-svgstore-plugin')

module.exports = {
  entry: path.resolve('./src/index.js'),
  output: {
    path: path.resolve('./'),
    filename: "bundle.js"
  },
  devServer: {
    port: 8085,
    historyApiFallback: true
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
        }
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
         fallback: 'style-loader',
         use: [{
           loader: 'css-loader',
           options: {
             importLoaders: 1,
             modules: false,
             sourceMap: true
           }
         }, {
           loader: 'postcss-loader',
           options: {
             sourceMap: true
           }
         }, {
           loader: 'sass-loader',
           options: {
            sourceMap: true
           }
         }]
      })
    }, {
      test: /\.(gif|png|jpe?g)$/i,
      loaders: [
        'file-loader?name=images/[name]-[hash].[ext]',
        {
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true
            },
            optipng: {
              optimizationLevel: 7
            },
            gifsicle: {
              interlaced: false
            },
            pngquant: {
              quality: '65-90',
              speed: 4
            }
          }
        }
      ]
    }, {
      test: /\.(eot|ttf|woff|woff2)/,
      loader: 'file-loader',
      query: {
        name: 'fonts/[name].[ext]?[hash]'
      }
    }, {
      test: /\.(docx|pdf)/,
      loader: 'file-loader',
      query: {
        name: 'files/[name].[ext]?[hash]'
      }
    }
  ]},
  plugins: [
    new ExtractTextPlugin({filename: 'style.css', allChunks: true}),
    new SvgStore({
      svgoOptions: {
        plugins: [
          { removeTitle: true }
        ]
      },
      prefix: 'icon'
    })
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: false,
    //   compress: {
    //     'drop_console': false,
    //     unsafe: true
    //   }
    // })
  ]
}
