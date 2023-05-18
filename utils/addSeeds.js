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

		return { success: true, message: "Seeds added successfully" };
	} catch (err) {
		return { success: false, message: "Something went wrong while adding seeds" };
	}
}

module.exports = addSeeds;
