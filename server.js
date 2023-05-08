if (process.env.NODE_ENV !== "production") require("dotenv").config();
const colors = require("colors");
const checkEnvs = require("./config/checkEnvs");
const app = require("./app");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;

if (!checkEnvs()) process.exit(1);

app.listen(PORT, HOST, async () => {
	// await require("./data/resetDB")(); // Reset the database
	console.log(
		colors.green("-> ") +
			colors.cyan("Server is running on ") +
			colors.green(`http://${HOST}:${PORT}\n`)
	);
});
