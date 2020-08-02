const http = require("http");
const url = require("url");

const server = require("./routes");

const PORT = 3000;
const HOST = "127.0.0.1";

server.listen(PORT, () => {
	console.log(`Server is listening at http://${HOST}:${PORT}`);
});
