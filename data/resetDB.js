const colors = require("colors");
const db = require("../models/db");
const create = require("./createData");

/**
 * @description Deletes all data from the database
 * @param {boolean} logging - Whether or not to log events to the console
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function deleteData(logging) {
	try {
		const start = new Date();
		await db.sequelize.sync({ force: true });
		const end = new Date();
		if (logging) {
			console.log(
				colors.blue("Cleared all data from the database - ") +
					colors.green(end - start + "ms\n")
			);
		}
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while deleting all data from the database:\n") +
				colors.yellow(err)
		);
	}
}

/**
 * @description Resets the database by deleting all data and creating new data
 * @param {boolean} logging - Whether or not to log events to the console
 * @returns {Promise<void>}
 * @throws {Error}
 */
const resetDB = async (logging = true) => {
	if (logging) console.log(colors.green("-> ") + colors.cyan("Resetting database...\n"));

	try {
		await deleteData(logging);

		// Create Initial Data
		await create.roles(logging);
		await create.schools(logging);
		await create.users(logging);
		await create.badges(logging);
		await create.userBadge(logging);
		await create.news(logging);
		await create.newImg(logging);
		await create.newsLetter(logging);
		await create.meetings(logging);
		await create.meetingAtaImage(logging);
		await create.theme(logging);
		await create.activities(logging);
		await create.activityImage(logging);
		await create.activityReportImage(logging);
		await create.seeds(logging);
	} catch (err) {
		console.log(colors.red("-> ") + colors.yellow(err) + "\n");
		return;
	}

	if (logging) console.log(colors.green("\n-> ") + colors.cyan("Database reset successfully!\n"));
};

module.exports = resetDB;
