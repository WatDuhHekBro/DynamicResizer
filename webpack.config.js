const Copier = require("copy-webpack-plugin");

module.exports = {
	mode: "production",
	devtool: "source-map",
	entry: {
		popup: "./src/popup.tsx"
	},
	output: {
		path: `${__dirname}/dist`,
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: "ts-loader"
			}
		]
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	plugins: [
		new Copier({
			patterns: [
				{
					from: "public",
					to: "."
				}
			]
		})
	]
	// Probably figure this out sometime, I'm noticing some duplicate dependencies.
	/*optimization: {
		splitChunks: {
			chunks: "all",
			name: false
		}
	}*/
};
