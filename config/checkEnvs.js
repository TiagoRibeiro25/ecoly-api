const colors = require("colors");

/** @returns {boolean} true if all envs are defined, false if not */
function checkEnvs() {
	if (!process.env.PORT) {
		console.log(colors.red("-> ") + colors.cyan("PORT ") + colors.red("is not defined!"));
		return false;
	}

	if (!process.env.HOST) {
		console.log(colors.red("-> ") + colors.cyan("HOST ") + colors.red("is not defined!"));
		return false;
	}

	if (!process.env.JWT_SECRET) {
		console.log(colors.red("-> ") + colors.cyan("JWT_SECRET ") + colors.red("is not defined!"));
		return false;
	}

	if (!process.env.DB_HOST) {
		console.log(colors.red("-> ") + colors.cyan("DB_HOST ") + colors.red("is not defined!"));
		return false;
	}

	if (!process.env.DB_USER) {
		console.log(colors.red("-> ") + colors.cyan("DB_USER ") + colors.red("is not defined!"));
		return false;
	}

	if (!process.env.DB_PASSWORD) {
		console.log(colors.red("-> ") + colors.cyan("DB_PASSWORD ") + colors.red("is not defined!"));
		return false;
	}

	if (!process.env.DB_NAME) {
		console.log(colors.red("-> ") + colors.cyan("DB_NAME ") + colors.red("is not defined!"));
		return false;
	}

	if (!process.env.SEND_EMAIL_AUTH_KEY) {
		console.log(
			colors.red("-> ") + colors.cyan("SEND_EMAIL_AUTH_KEY ") + colors.red("is not defined!")
		);
		return false;
	}

	if (!process.env.SEND_EMAIL_URI) {
		console.log(
			colors.red("-> ") + colors.cyan("SEND_EMAIL_URI ") + colors.red("is not defined!")
		);
		return false;
	}

	return true;
}

module.exports = checkEnvs;
