const colors = require("colors");
const db = require("../models/db");
const Users = db.users;
const Badges = db.badges;

/**
 * @param { Array<{ id: number, user_id: number, amount: number, date: string}> } seeds
 * @returns {{ monthSeeds: number, totalSeeds: number }}
 */
function getSeedsMonthAndTotal(seeds) {
	const currMonth = new Date().getMonth() + 1;
	const currYear = new Date().getFullYear();
	let monthSeeds = 0;
	let totalSeeds = 0;

	for (const seed of seeds) {
		const seedDate = new Date(seed.date);
		const seedMonth = seedDate.getMonth() + 1;
		const seedYear = seedDate.getFullYear();

		if (currMonth === seedMonth && currYear === seedYear) {
			monthSeeds += seed.amount;
		}

		totalSeeds += seed.amount;
	}
	return { monthSeeds, totalSeeds };
}

/** @param {number} badgeId */
async function getBadgeCompletionPercentage(badgeId) {
	// get the total number of users that have the badge
	const totalUsers = await db.user_badge.count({ where: { badge_id: badgeId } });
	// get total number of users that exist
	const totalUsersExist = await db.users.count();
	return Math.round((totalUsers / totalUsersExist) * 100);
}

/**
 * @param { Array<{ id: number, user_id: number, badge_id: number, is_highlight: boolean }> } unlockedBadges
 * @returns {Promise<{
 * 	highlighted?: number,
 *  	unlocked: Array<{ id: number, title: string, description: string, img: string}>,
 *  	locked: Array<{ id: number, title: string, description: string, img: string}>,
 *   }>}
 */
async function getBadgesInfo(unlockedBadges) {
	const unlockedBadgesInfoArray = await Promise.all(
		unlockedBadges.map(async (badge) => await badge.getBadge())
	);

	// convert badges img to base64
	unlockedBadgesInfoArray.forEach((badge) => {
		badge.img = badge.img.toString("base64");
	});

	/** @type number | undefined */
	const highlightBadgeId = unlockedBadges.find((badge) => badge.is_highlight)?.badge_id;

	// get the rest of the badges
	const badges = await Badges.findAll();
	const badgesInfoArray = badges.map((badge) => badge.toJSON());
	badgesInfoArray.forEach((badge) => {
		// if the badge is unlocked, delete it from the array
		if (unlockedBadgesInfoArray.some((unlockedBadge) => unlockedBadge.id === badge.id)) {
			badgesInfoArray.splice(badgesInfoArray.indexOf(badge), 1);
		}
	});

	// copy the array but convert the img to base64
	const lockedBadgesInfoArray = badgesInfoArray.map((badge) => {
		const copy = { ...badge };
		copy.img = copy.img.toString("base64");
		return copy;
	});

	if (highlightBadgeId) {
		return {
			highlighted: highlightBadgeId,
			unlocked: unlockedBadgesInfoArray,
			locked: lockedBadgesInfoArray,
		};
	}
	return { unlocked: unlockedBadgesInfoArray, locked: lockedBadgesInfoArray };
}

exports.getUser = async (req, res) => {
	const { id } = req.params;

	try {
		/** @type {{ id: number, internal_id: string, name: string, email: string, password: string, photo: Buffer, role_id: number, school_id: number, course?: string, year?: number }} */
		const user = await Users.findByPk(id);
		if (!user) throw new Error("not_found");
		const result = user.toJSON();

		//TODO: check if this is the current logged user
		result.isLoggedUser = false;

		// remove password
		delete result.password;

		// remove unnecessary fields
		if (!result.internal_id) delete result.internal_id;
		if (!result.course) delete result.course;
		if (!result.year) delete result.year;

		// convert image to base64
		result.photo = result.photo.toString("base64");

		// replace role_id with role name
		delete result.role_id;
		result.role = (await user.getRole()).title;

		// replace school_id with school name
		delete result.school_id;
		result.school = (await user.getSchool()).name;

		// add the seeds
		const { monthSeeds, totalSeeds } = getSeedsMonthAndTotal(await user.getSeeds());
		result.seeds = { month: monthSeeds, total: totalSeeds };

		// add badges
		const unlockedBadges = await user.getUser_badges();
		result.badges = await getBadgesInfo(unlockedBadges);

		// add users unlock percentage to the badges
		for (const badge of result.badges.unlocked) {
			badge.percentageUnlocked = await getBadgeCompletionPercentage(badge.id);
		}
		for (const badge of result.badges.locked) {
			badge.percentageUnlocked = await getBadgeCompletionPercentage(badge.id);
		}

		res.status(200).send({ success: true, data: result });
	} catch (err) {
		if (err.message === "not_found") {
			res.status(404).send({ success: false, message: `User with id ${id} not found.` });
		} else {
			console.log(colors.red("\n\n-> ") + colors.yellow(err) + "\n");
			res.status(500).send({ success: false, message: `Error retrieving user with id ${id}.` });
		}
	}
};
