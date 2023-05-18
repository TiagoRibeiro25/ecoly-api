const colors = require("colors");
const db = require("../models/db");
const Seeds = db.seeds;

/**
 * @description Adds seeds to a user's account
 * @param {{amount: number, userId: number}} - An object containing the amount of seeds and the user id
 */
async function addSeeds({ amount, userId }) {
	try {
		await Seeds.create({
			user_id: userId,
			amount: amount,
			date: new Date().toISOString().slice(0, 19).replace("T", " "),
		});

		// get current time (yyyy-mm-dd hh:mm:ss)
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		console.log(
			`${colors.cyan(now)} - ${colors.blue(
				`Added ${colors.green(amount)} seeds to the user ${colors.green(userId)}.`
			)}`
		);

		return { success: true, message: "Seeds added successfully" };
	} catch (err) {
		return { success: false, message: "Something went wrong while adding seeds" };
	}
}

module.exports = addSeeds;
