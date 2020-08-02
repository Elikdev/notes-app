const http = require("http");
const url = require("url");

module.exports = http.createServer((req, res) => {
	const { welcomePage, newNote, invalidRoutes } = require("./controllers");
	const parsedUrl = url.parse(req.url, true);

	//GET ENDPOINT
	if (parsedUrl.pathname === "/" && req.method === "GET") {
		console.log(
			`Request Type: ${req.method} \n Endpoint: ${parsedUrl.pathname}`
		);
		welcomePage(req, res);
	}

	//POST ENDPOINT
	else if (parsedUrl.pathname === "/create" && req.method === "POST") {
		console.log(
			`Request Type: ${req.method} \n Endpoint: ${parsedUrl.pathname}`
		);
		newNote(req, res);
	} else {
		console.log(
			`Request Type: ${req.method} \n Endpoint: ${parsedUrl.pathname}`
		);
		invalidRoutes(req, res);
	}
});
