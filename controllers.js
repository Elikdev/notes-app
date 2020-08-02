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

			//fs.mkdirSync('views')
			//fs.unlink('./wel.js')
		}
	});
};

exports.listAllNotes = (req, res) => {};

//The notes app should let you record notes, create new files, organize the notes into different topics using directories, reading from the directories, reading the contents of the files

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
