if (process.env.NODE_ENV !== "production") require("dotenv").config();

const colors = require("colors");
const checkEnvs = require("./config/checkEnvs");
const app = require("./app");

const HOST = process.env.HOST;
const PORT = process.env.PORT;

if (!checkEnvs()) process.exit(1);

app.listen(PORT, HOST, async () => {
	// await require("./data/resetDB")(); // Reset the database
	// await require("./data/uploadToCloudinary")(); // Upload images to Cloudinary
	console.log(
		colors.green("-> ") +
		colors.cyan("Server is running on ") +
		colors.green(`https://${HOST}:${PORT}\n`)
	);
});
