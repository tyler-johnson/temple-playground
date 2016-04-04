const babel = require("rollup-plugin-babel");
const builtins = require("rollup-plugin-node-builtins");
const nodeGlobals = require("rollup-plugin-node-globals");
const commonjs = require("rollup-plugin-commonjs");
const resolve = require("rollup-plugin-node-resolve");
const Temple = require("templejs-compiler");

Temple.compileFile(process.argv[2], {
	format: "umd",
	moduleName: "Playground",
	plugins: [
		builtins(),
		{
			resolveId: function(id) {
				if (id === "templejs") return false;
			}
		},
		resolve({
			jsnext: false,
			main: true,
			browser: true,
			preferBuiltins: true
		}),
		babel({
			exclude: [ "node_modules/**" ],
			presets: [ "es2015-rollup" ],
			plugins: [ "lodash" ]
		}),
		commonjs({
			include: [ "node_modules/**" ],
			exclude: [ "node_modules/rollup-plugin-node-globals/**" ],
			extensions: [ ".js" ]
		}),
		nodeGlobals()
	]
}).then(res => {
	process.stdout.write(res.toString());
}).catch(e => {
	console.error(e.stack || e);
	process.exit(1);
});
