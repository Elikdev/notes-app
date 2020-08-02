const url = require("url");
const fs = require("fs");
exports.welcomePage = (req, res) => {
	const welcomeMessage = {
		message: "Welcome to my notes app from WeJapa",
	};

	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify(welcomeMessage));
	return;
};

exports.newNote = (req, res) => {
	let body = "";

	req.on("data", (chunk) => {
		body += chunk;
	});

	req.on("end", () => {
		req.body = JSON.parse(body);

		if (!req.body.title && !req.body.folder && !req.body.note) {
			res.statusCode = 422;
			res.setHeader("Content-Type", "Application/json");
			res.end(JSON.stringify({ message: "You need to include a message" }));
		} else {
			try {
				if (!fs.existsSync(`./notes/${req.body.folder}`)) {
					fs.mkdir(`./notes/${req.body.folder}`, { recursive: true }, (err) => {
						if (err) return err;

						fs.writeFile(
							`./notes/${req.body.folder}/${req.body.title}.txt`,
							`${req.body.note}`,
							(err) => {
								if (err) return err;

								let response = {
									message: "Note has been stored succesfully",
									postBody: req.body,
								};

								res.statusCode = 201;
								res.setHeader("Content-Type", "Application/json");
								res.end(JSON.stringify(response));
								return;
							}
						);
					});
				} else {
					fs.writeFile(
						`./notes/${req.body.folder}/${req.body.title}.txt`,

						`- ${req.body.note} \n`,
						{ flag: "a" },
						(err) => {
							if (err) return err;

							let response = {
								message: "Note has been stored succesfully",
								postBody: req.body,
							};

							res.statusCode = 201;
							res.setHeader("Content-Type", "Application/json");
							res.end(JSON.stringify(response));
							return;
						}
					);
				}
			} catch (error) {
				console.log(`Error >>> ${error.message}`);
			}
		}
	});
};

exports.listNotes = (req, res) => {
	let reqUrl = url.parse(req.url, true);

	if (fs.existsSync("notes")) {
		folder = reqUrl.query.folder;
		title = reqUrl.query.title;
		if (folder && !title) {
			if (!fs.existsSync(`./notes/${folder}`)) {
				let response = {
					message: "No such folder within the notes directory",
				};

				res.statusCode = 404;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify(response));
				return;
			}

			fs.readdir(`./notes/${folder}`, (err, files) => {
				if (err) return err;

				let response = {
					message: "List of notes",
					files,
				};

				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify(response));
				return;
			});
		} else if (folder && title) {
			if (!fs.existsSync(`./notes/${folder}/${title}.txt`)) {
				let response = {
					message: " There is no note with that title in any notes directory",
				};

				res.statusCode = 404;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify(response));
				return;
			}

			fs.readFile(`./notes/${folder}/${title}.txt`, "utf8", (err, data) => {
				if (err) return err;
				let response = {
					message: "Notes displayed",
					content: data,
				};

				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify(response));
				return;
			});
		} else {
			let response = {
				message: "You need to include the folder",
			};

			res.statusCode = 412;
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(response));
			return;
		}
	} else {
		let response = {
			message: "There's no notes to display. Create new notes",
		};

		res.statusCode = 404;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify(response));
		return;
	}
};

//The notes app should let you record notes, create new files, organize the notes into different topics using directories, reading from the directories, reading the contents of the files

exports.readFile;

exports.invalidRoutes = (req, res) => {
	const availableRoutes = [
		{
			method: "GET",
			endpoint: "/",
			description: "homepage",
		},
		{
			method: "POST",
			endpoint: "/create",
			description: "create new note",
		},
	];

	let response = [
		{
			message:
				"You are trying to access an invalid endpoint. The available endpoints are displayed below",
		},
		availableRoutes,
	];

	res.statusCode = 404;
	res.setHeader("Content-Type", "Application/json");
	res.end(JSON.stringify(response));
	return;
};
