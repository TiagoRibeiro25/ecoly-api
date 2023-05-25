const colors = require("colors");
const db = require("../models/db");
const create = require("./createData");

/**
 * @description Deletes all data from the database
 * @param {boolean} logging - Whether to log events to the console
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
 * @param {boolean} logging - Whether to log events to the console
 * @returns {Promise<void>}
 * @throws {Error}
 */
const resetDB = async (logging = true) => {
	if (logging) console.log(colors.green("-> ") + colors.cyan("Resetting database...\n"));

	try {
		await deleteData(logging);

		// Create Initial Data
		await Promise.all([create.roles(logging), create.schools(logging)]);

		await Promise.all([create.users(logging), create.badges(logging), create.theme(logging)]);

		await Promise.all([
			create.userBadge(logging),
			create.news(logging),
			create.newsLetter(logging),
			create.meetings(logging),
			create.activities(logging),
			create.seeds(logging)
		]);

		await Promise.all([
			create.newImg(logging),
			create.meetingAtaImage(logging),
			create.activityImage(logging),
			create.activityReportImage(logging)
		]);
	} catch (err) {
		console.log(colors.red("-> ") + colors.yellow(err) + "\n");
		return;
	}

	if (logging) console.log(colors.green("\n-> ") + colors.cyan("Database reset successfully!\n"));
};

module.exports = resetDB;
