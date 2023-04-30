const colors = require("colors");
const db = require("../models/db");
const create = require("./createData");

async function deleteData() {
	try {
		const start = new Date();
		await db.sequelize.sync({ force: true });
		const end = new Date();
		console.log(
			colors.blue("Cleared all data from the database - ") + colors.green(end - start + "ms\n")
		);
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while deleting all data from the database:\n") +
				colors.yellow(err)
		);
	}
}

const resetDB = async () => {
	console.log(colors.green("-> ") + colors.cyan("Resetting database...\n"));

	try {
		await deleteData();

		// Create Initial Data
		await create.roles();
		await create.schools();
		await create.users();
		await create.badges();
		await create.userBadge();
		await create.news();
		await create.newImg();
		await create.newsLetter();
		await create.meetings();
		await create.meetingAtaImage();
		await create.theme();
		await create.activities();
		await create.activityImage();
		await create.activityReportImage();
		await create.seeds();
	} catch (err) {
		console.log(colors.red("-> ") + colors.yellow(err) + "\n");
		return;
	}

	console.log(colors.green("\n-> ") + colors.cyan("Database reset successfully!\n"));
};

module.exports = resetDB;
