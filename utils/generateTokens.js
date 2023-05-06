const colors = require("colors");
const db = require("../models/db");
const jwt = require("jsonwebtoken");

/** @param {"admin" | "user" | "unsigned"} userType */
async function getToken(userType) {
	console.log(`Generating token for ${userType}`.yellow);

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
		{ expiresIn: 60 * 3 } // 3 minutes
	);

	console.log(`Token generated for ${userType}`.green);

	return token;
}

module.exports = getToken;
