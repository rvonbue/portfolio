const webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// require("url?limit=10000!./file.png");

module.exports = {
   entry: './src/js/entry.js',
   output: {
       path: './bin',
       filename: 'app.bundle.js'
   },
	 module: {
     loaders: [
       { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
		   { test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {	presets: ['es2015'] }},
      { test: /\.(jpe?g|png|gif|svg)$/i, exclude: /node_modules/, loader: "url-loader?limit=4096"},
       { test: /\.less$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")},
       { test: /\.html$/, loader: "underscore-template-loader" }
     ]
   },
	 plugins: [
      // new webpack.optimize.UglifyJsPlugin({
			// sourceMap: true,
      //       compress: {
      //           warnings: false,
      //       },
      //       output: {
      //           comments: false,
      //       },
      //   }),
		new webpack.ProvidePlugin({	_: "underscore", "window._": "underscore" }),
    // new webpack.ProvidePlugin({	"THREE": "three", "window.THREE": "three" }),
    new ExtractTextPlugin('allStyles.css'),
    ],
	devServer: {
    contentBase: "./bin",
	  open: true,
	  historyApiFallback: true
	}
 };
