import express from "express";
import path from "path";
import fs from "fs-promise";
import compress from "compression";

let templeDists = {};
templeDists.runtimeFull = require.resolve("templejs-runtime/dist/browser.js");
templeDists.runtimeMin = require.resolve("templejs-runtime/dist/browser.min.js");
templeDists.compilerFull = require.resolve("templejs-compiler/dist/browser.js");
templeDists.compilerMin = require.resolve("templejs-compiler/dist/browser.min.js");

const examplesDir = __dirname + "/examples";
const playgroundFile = (min) => `${__dirname}/dist/playground${min ? ".min" : ""}.js`;
const production = process.env.NODE_ENV === "production";

const html = `<!DOCTYPE html>

<html lang="en-US">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
	</head>
	<body>
		<script type="text/javascript" src="/runtime${production ? ".min" : ""}.js"></script>
		<script type="text/javascript" src="/compiler${production ? ".min" : ""}.js"></script>
		<script type="text/javascript" src="/playground${production ? ".min" : ""}.js"></script>
	</body>
</html>`;

export default function createApp() {
	const app = express();

	if (production) {
		app.use(compress());
	}

	app.get("/", (req, res) => {
		res.type("html").send(html);
	});

	app.get(/^\/(compiler|runtime)(\.min)?\.js$/, (req, res) => {
		res.sendFile(templeDists[req.params[0] + (req.params[1] ? "Min" : "Full")]);
	});

	app.get("/playground(.min)?.js", (req, res) => {
		res.sendFile(playgroundFile(req.params[0]));
	});

	app.get("/examples", (req, res, next) => {
		fs.readdir(examplesDir)
		.then((examples) => Promise.all(examples.map((f) => {
			if (f[0] === ".") return;
			return fs.stat(path.join(examplesDir, f))
			.then(s => s.isFile() ? f : null);
		})))
		.then(r => {
			res.send(r.filter(Boolean));
		})
		.catch(next);
	});

	app.get("/examples/:name", (req, res) => {
		res.type("text").sendFile(path.join(examplesDir, req.params.name));
	});

	return app;
}
