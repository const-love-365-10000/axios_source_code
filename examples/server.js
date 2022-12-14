const http = require("http");
const fs = require("fs");
const path = require("path");

const config = {
	hostname: "localhost",
	port: "3000",
};

http.createServer((req, res) => {
	if (req.url === "/") {
		const files = fs.readdirSync(__dirname);
		const paths = [];
		files.forEach((filename) => {
			const stat = fs.statSync(path.join(__dirname, filename));
			if (stat.isFile() && /\.html$/.test(filename)) {
				paths.push(filename);
			} else if (stat.isDirectory()) {
				(fs.readdirSync(path.join(__dirname, filename)) || []).forEach(
					(onFilename) => {
						paths.push(filename + "/" + onFilename);
					}
				);
			}
		});
		res.end(
			paths
				.map((item) => `<a href="/${item}" >${item}</a>`)
				.join("<br />")
		);
	}
	// api
	else if (req.url.indexOf("/api") > -1) {
		if (req.url.indexOf("/cors") > -1) {
			res.setHeader("access-control-allow-origin", "localhost:3000");
			res.setHeader("access-control-allow-headers", "Authorization");
			res.setHeader("access-control-allow-methods", "GET,POST");
			res.setHeader("Access-Control-Allow-Credentials", true);
		}

		res.end("axios");
	} else if (/\.html$/.test(req.url)) {
		res.end(fs.readFileSync(path.join(__dirname, req.url)).toString());
	} else if (req.url.indexOf("/download") > -1) {
		let text = "";
		for (let i = 0; i < 1000000; i++) {
			text += "a=1\n";
		}
		res.writeHead(200, {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": "attachment; filename=res_file.txt",
			"content-length": text.length,
		});
		res.end(text);
	} else {
		res.statusCode = 404;
		res.end("Not Founded");
	}
}).listen(config.port, config.hostname, () => {
	console.log(`服务已启动，请打开: http://${config.hostname}:${config.port}`);
});
