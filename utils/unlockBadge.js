//!Important:
//	This file is used to unlock a badge for a user but it does not check if the user did the task or not.
// It is only used to check if the user has the badge or not, if not, it will unlock it for the user.

const colors = require("colors");
const db = require("../models/db");
const UserBadges = db.user_badge;
const Badges = db.badges;

/**
 * @description IMPORTANT: This file is used to unlock a badge for a user but it does not check if the user did the task or not.
 * @param {{ badgeId: number, userId: number}} - An object containing the badge id and the user id
 * @returns  {Promise<{ success: boolean, message: string, data?: object }>} - Returns an object with the success status, a message and the data if success is true
 */
async function unlockBadge({ badgeId, userId }) {
	try {
		// check if the bad exists
		const badge = await Badges.findOne({ where: { id: badgeId } });
		if (!badge) throw new Error("Badge not found");

		// check if the user has the badge
		const userBadge = await UserBadges.findOne({ where: { badge_id: badgeId, user_id: userId } });
		if (userBadge) throw new Error("User already has the badge");

		// unlock the badge for the user
		const newUserBadge = await UserBadges.create({
			user_id: userId,
			badge_id: badgeId,
			is_highlight: false,
		});

		// get current time (yyyy-mm-dd hh:mm:ss)
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");

		console.log(
			`${colors.cyan(now)} - ${colors.blue(
				`Unlocked badge ${colors.green(badgeId)} for user ${colors.green(userId)}.`
			)}`
		);

		return { success: true, message: "Badge unlocked successfully", data: newUserBadge };
	} catch (err) {
		if (err.message === "Badge not found") {
			return { success: false, message: err.message };
		}

		if (err.message === "User already has the badge") {
			return { success: false, message: err.message };
		}

		return { success: false, message: "Something went wrong while unlocking the badge" };
	}
}

module.exports = unlockBadge;
