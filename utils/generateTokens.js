const colors = require("colors");
const db = require("../models/db");
const jwt = require("jsonwebtoken");

/**
 *  @param {"admin" | "user" | "unsigned"} userType - the type of user to generate the token for
 *  @param {boolean} logging - logs the events to the console
 */
async function getToken(userType, logging = true) {
	if (logging) console.log(`Generating token for ${userType}`.yellow);

	const emails = {
		admin: "Admin@esmad.ipp.pt",
		user: "User@esmad.ipp.pt",
		unsigned: "not.a.bot@email.com",
	};

	const email = emails[userType];

	const user = await db.users.findOne({ where: { email } });
	if (!user) throw new Error("User not found");

	const token = jwt.sign(
		{ userId: user.id, roleId: user.role_id, schoolId: user.school_id },
		process.env.JWT_SECRET,
		{ expiresIn: 60 * 5 } // 5 minutes
	);

	if (logging) console.log(`Token generated for ${userType}`.green);

	return token;
}

module.exports = getToken;
