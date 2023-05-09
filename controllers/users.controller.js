const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const colors = require("colors");
const sendEmail = require("../utils/emailSender");
const db = require("../models/db");
const contactMembersTemplate = require("../utils/contactMembersTemplate");
const Users = db.users;
const Badges = db.badges;
const Roles = db.role;
const Schools = db.schools;
const UserBadge = db.user_badge;

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

/**
 * @param {number} badgeId
 * @returns {Promise<number>}
 */
async function getBadgeCompletionPercentage(badgeId) {
	// get the total number of users that have the badge
	const totalUsers = await UserBadge.count({ where: { badge_id: badgeId } });
	// get total number of users that exist
	const totalUsersExist = await Users.count();
	return Math.round((totalUsers / totalUsersExist) * 100);
}

/**
 * @param {string} name
 * @returns {string}
 */
function convertName(name) {
	// trim
	let newName = name.trim();
	// replace spaces with underscores
	newName = newName.replace(/\s/g, "_");
	// remove special characters
	newName = newName.replace(/[^\w\s]/gi, "");
	// lowercase
	newName = newName.toLowerCase();
	// replace letters with accents with the same letter without accent
	newName = newName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	return newName;
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

	/** @type number | undefined */
	const highlightBadgeId = unlockedBadges.find((badge) => badge.is_highlight)?.badge_id;

	// get the rest of the badges
	const badges = await Badges.findAll();
	const lockedBadgesInfoArray = badges.map((badge) => badge.toJSON());
	lockedBadgesInfoArray.forEach((badge) => {
		// if the badge is unlocked, delete it from the array
		if (unlockedBadgesInfoArray.some((unlockedBadge) => unlockedBadge.id === badge.id)) {
			lockedBadgesInfoArray.splice(lockedBadgesInfoArray.indexOf(badge), 1);
		}
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

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// check if the user exists
		const user = await Users.findOne({ where: { email } });
		if (!user) throw new Error("not_found");

		// check if the password is correct
		const passwordIsValid = bcrypt.compareSync(password, user.password);
		if (!passwordIsValid) throw new Error("invalid_password");

		// generate token
		const token = jwt.sign(
			{ userId: user.id, roleId: user.role_id, schoolId: user.school_id },
			process.env.JWT_SECRET,
			{ expiresIn: 86400 } // 24 hours
		);

		res.status(200).send({ success: true, data: { auth_key: token } });
	} catch (err) {
		if (err.message === "not_found") {
			return res.status(404).send({ success: false, message: "User not found." });
		}
		if (err.message === "invalid_password") {
			return res.status(401).send({ success: false, message: "Invalid password." });
		}
		console.log(colors.red(err));
		res.status(500).send({ success: false, message: "Error logging in." });
	}
};

exports.register = async (req, res) => {
	const { name, email, password, schoolId, internalId, course, year } = req.body;

	try {
		// check if there's already a user with the same email
		const user = await Users.findOne({ where: { email } });
		if (user) throw new Error("email_already_exists");

		// check if the school exists
		const school = await Schools.findByPk(schoolId);
		if (!school) throw new Error("school_not_found");

		// create the user
		const newUser = await Users.create({
			name,
			email,
			password: bcrypt.hashSync(password, 10),
			photo: `https://api.dicebear.com/5.x/personas/svg?seed=${convertName(name)}`,
			role_id: 1,
			school_id: school.id,
			...(internalId && { internal_id: internalId }),
			...(course && { course }),
			...(year && { year }),
		});

		res.status(201).json({
			success: true,
			message: "Account created with success - " + newUser.id,
		});
	} catch (err) {
		if (err.message === "email_already_exists") {
			return res
				.status(409)
				.send({ success: false, message: "There's already an account with that email." });
		}

		if (err.message === "school_not_found") {
			return res.status(404).send({ success: false, message: "School not found." });
		}

		console.log(colors.red("\n\n-> ") + colors.yellow(err) + "\n");
		res.status(500).send({ success: false, message: "Error creating account." });
	}
};

exports.getUser = async (req, res) => {
	const { id } = req.params;

	try {
		/** @type {{ id: number, name: string, email: string, password: string, photo: string, role_id: number, school_id: number, internal_id?: string, course?: string, year?: number }} */
		const user = await Users.findByPk(id);
		if (!user) throw new Error("not_found");
		const result = user.toJSON();

		// check if there's a token in the request
		let token = req.headers["x-access-token"] || req.headers.authorization;
		token = token?.replace("Bearer ", "");

		if (token) {
			try {
				// verify the token
				const decoded = jwt.verify(token, process.env.JWT_SECRET);

				// check if the user is the same as the one in the token
				result.isLoggedUser = +decoded.userId === +id;
			} catch (err) {
				// if the token is invalid, return the user without the isLoggedUser field
				result.isLoggedUser = false;
			}
		} else result.isLoggedUser = false;

		// remove password
		delete result.password;

		// remove unnecessary fields
		if (!result.internal_id) delete result.internal_id;
		if (!result.course) delete result.course;
		if (!result.year) delete result.year;

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

		res.status(200).json({ success: true, data: result });
	} catch (err) {
		if (err.message === "not_found") {
			res.status(404).json({ success: false, message: `User with id ${id} not found.` });
		} else {
			console.log(colors.red("\n\n-> ") + colors.yellow(err) + "\n");
			res.status(500).json({
				success: false,
				message: `Error occurred while retrieving user with id ${id}.`,
			});
		}
	}
};

exports.getUsers = async (req, res) => {
	// check if there's a query called filter
	const { filter } = req.query;
	let userSchoolName = null;

	try {
		if (filter === "school") {
			// get name of the school
			const school = await Schools.findByPk(req.tokenData.schoolId);
			if (!school) throw new Error("school_not_found");

			userSchoolName = school.name;
		}

		const users = await Users.findAll();
		/** @type { Array<{id: number, name: string, email: string, role: string, school: string}>} */
		let result = [];

		for (const user of users) {
			result.push({
				id: user.id,
				name: user.name,
				email: user.email,
				role: (await user.getRole()).title,
				school: (await user.getSchool()).name,
			});
		}

		// filter users by school
		if (userSchoolName) result = result.filter((user) => user.school === userSchoolName);

		res.status(200).json({ success: true, data: result });
	} catch (err) {
		if (err.message === "no_token_provided") {
			return res.status(401).json({ success: false, message: "No token provided." });
		}
		if (err.message === "school_not_found") {
			return res.status(404).json({ success: false, message: "School not found." });
		}

		console.log(colors.red("\n\n-> ") + colors.yellow(err) + "\n");
		res.status(500).json({ success: false, message: "Error occurred while retrieving users." });
	}
};

exports.getRoles = async (_req, res) => {
	try {
		/** @type { Array<{ id: number, title: string }> } */
		const roles = await Roles.findAll();
		res.status(200).json({ success: true, data: roles });
	} catch (err) {
		console.log(colors.red("\n\n-> ") + colors.yellow(err) + "\n");
		res.status(500).json({ success: false, message: "Error occurred while retrieving roles." });
	}
};

exports.addRole = async (req, res) => {
	/** @type { string } */
	const role = req.body.role?.trim().toLowerCase();

	try {
		// check if the role exists
		const roleExists = await Roles.findOne({ where: { title: role } });
		if (roleExists) throw new Error("role_exists");

		// add the role
		await Roles.create({ title: role });
		res.status(201).json({ success: true, message: `Role ${role} added successfully.` });
	} catch (err) {
		if (err.message === "role_exists") {
			res.status(409).json({
				success: false,
				message: `Role ${role} already exists.`,
			});
		} else {
			console.log(colors.red("\n\n-> ") + colors.yellow(err) + "\n");
			res.status(500).json({
				success: false,
				message: `Error occurred while adding a new role.`,
			});
		}
	}
};

exports.editRole = async (req, res) => {
	/** @type {{ id: number}} */
	const { id } = req.params;
	/** @type { string } */
	const role = req.body.role?.trim().toLowerCase();

	try {
		// check if the role exists
		const roleExists = await Roles.findByPk(id);
		if (!roleExists) throw new Error("role_not_found");

		// check if there is another role with the same name
		const roleExists2 = await Roles.findOne({ where: { title: role } });
		if (roleExists2) throw new Error("role_exists");

		// update the role
		await Roles.update({ title: role }, { where: { id } });

		res.status(200).json({ success: true, message: `Role updated successfully.` });
	} catch (err) {
		if (err.message === "role_not_found") {
			res.status(404).json({
				success: false,
				message: `Role with id ${id} not found.`,
			});
		} else if (err.message === "role_exists") {
			res.status(409).json({
				success: false,
				message: `Role ${role} already exists.`,
			});
		} else {
			console.log(colors.red("\n\n-> ") + colors.yellow(err) + "\n");
			res.status(500).json({
				success: false,
				message: `Error occurred while updating role with id ${id}.`,
			});
		}
	}
};

exports.editUserRole = async (req, res) => {
	/** @type {{id :number}} */
	const { id } = req.params;
	/** @type {{ role: number }} */
	const { roleId } = req.body;

	try {
		// check if the user exists
		const user = await Users.findByPk(id);
		if (!user) throw new Error("user_not_found");

		// check if the user is trying edit his own role
		if (+req.tokenData.userId === +id) throw new Error("user_editing_himself");

		// check if the role exists
		const roleExists = await Roles.findOne({ where: { id: roleId } });
		if (!roleExists) throw new Error("role_not_found");

		// update the user role
		await Users.update({ role_id: roleId }, { where: { id } });

		res.status(200).json({ success: true, message: `User role updated successfully.` });
	} catch (err) {
		if (err.message === "user_not_found") {
			return res.status(404).json({ success: false, message: `User with id ${id} not found.` });
		}

		if (err.message === "user_editing_himself") {
			return res.status(403).json({ success: false, message: `You can't edit your own role.` });
		}

		if (err.message === "role_not_found") {
			return res
				.status(404)
				.json({ success: false, message: `Role with id ${roleId} not found.` });
		}

		console.log(colors.red("\n\n-> ") + colors.yellow(err) + "\n");
		res.status(500).json({
			success: false,
			message: `Error occurred while updating user role with id ${id}.`,
		});
	}
};

//TODO: Reduce cognitive complexity of this function
exports.editUserInfo = async (req, res) => {
	/** @type { number } */
	const id = req.tokenData.userId;
	const updates = {};

	try {
		// email
		if (req.body.email) {
			const user = await Users.findOne({ where: { email: req.body.email } });
			if (user && user.id !== id) throw new Error("email_exists");
			updates.email = req.body.email;
		}

		// password
		if (req.body.password) {
			req.body.password = bcrypt.hashSync(req.body.password, 10);
			updates.password = req.body.password;
		}

		// internal id
		if (req.body.internalId) updates.internal_id = req.body.internalId;

		// course and year
		["course", "year"].forEach((key) => {
			if (req.body[key]) updates[key] = req.body[key];
		});

		// highlighted badge
		if (req.body.highlightBadgeId) {
			const userBadge = await UserBadge.findOne({
				where: { user_id: id, badge_id: req.body.highlightBadgeId },
			});
			if (!userBadge) throw new Error("user_badge_not_found");

			// remove highlight from all other badges
			await UserBadge.update(
				{ is_highlight: false },
				{ where: { user_id: id, badge_id: { [Op.ne]: req.body.highlightBadgeId } } }
			);
		}

		// update the user
		if (Object.keys(updates).length !== 0) await Users.update(updates, { where: { id } });

		res.status(200).json({ success: true, message: `User info updated successfully.` });
	} catch (err) {
		if (err.message === "email_exists") {
			return res.status(409).json({ success: false, message: `Email already in use!` });
		}

		if (err.message === "user_badge_not_found") {
			return res.status(404).json({ success: false, message: `User badge not found.` });
		}

		console.log(colors.red("\n\n-> ") + colors.yellow(err) + "\n");
		res.status(500).json({
			success: false,
			message: `Error occurred while updating user info with id ${id}.`,
		});
	}
};

exports.contactMembers = async (req, res) => {
	/** @type {{ to: {name: string, email: string}[], content: string }} */
	const { to, content } = req.body;

	try {
		const from = (await Users.findByPk(req.tokenData.userId)).email; // get the email from the user logged in
		const subject = "ECOLY - Mensagem de um membro da comunidade";
		const body = contactMembersTemplate(content);

		const result = await sendEmail(from, to, subject, body);
		if (!result) throw new Error("email_not_sent");

		res.status(200).json({ success: true, message: `Email sent successfully.` });
	} catch (err) {
		console.log(colors.red("\n\n-> ") + colors.yellow(err) + "\n");
		res.status(500).json({ success: false, message: `Error occurred while sending email.` });
	}
};
