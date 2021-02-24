const Copier = require("copy-webpack-plugin");

module.exports = {
	mode: "production",
	entry: {
		deps: "./src/deps.ts",
		resizer: "./src/resizer.tsx"
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
};
