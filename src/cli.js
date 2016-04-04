import minimist from "minimist";
import {resolve} from "path";

let argv = minimist(process.argv.slice(2), {
	string: [ "config", "port" ],
	boolean: [ "help", "version", "production" ],
	alias: {
		h: "help", H: "help",
		v: "version", V: "version",
		c: "config",
		p: "port"
	},
	default: {
		port: 3000
	}
});

if (argv.help) {
	console.log(`halp plz`);
	process.exit(0);
}

if (argv.version) {
	let {name, version="edge"} = require("./package.json");
	console.log("%s %s", name, version);
	process.exit(0);
}

if (argv.config) {
	try {
		Object.assign(argv, require(resolve(argv.config)));
	} catch(e) {
		if (!/Cannot find module/.test(e.message)) throw e;
	}
}

if (argv.production) {
	process.env.NODE_ENV = "production";
} else if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = "development";
}

function panic(e) {
	console.error(e.stack || e);
	process.exit(1);
}

const createApp = require("./");
const app = createApp();

const server = app.listen(argv.port, function() {
	const addr = server.address();
	console.log("Temple Playground is ready! Go to http://localhost:%s", addr.port);
});

server.on("error", panic);
