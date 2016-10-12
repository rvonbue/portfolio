const webpack = require('webpack');

module.exports = {
   entry: './src/js/app.js',
   output: {
       path: './bin',
       filename: 'app.bundle.js'
   },
	 module: {
     loaders: [
       { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
		   { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel', query: {	presets: ['es2015'] }}
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
    ],
	devServer: {
    contentBase: "./bin",
	  // inline: true,
	  // hot: true,
	  open: true,
	  historyApiFallback: true
	}
 };
