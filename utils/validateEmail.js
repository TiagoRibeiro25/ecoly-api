/**
 * @param {string} email
 * @returns boolean
 */
function validateEmail(email) {
	const emailRegex = /^\S+@\S+\.[a-z]{2,}$/i;

	return emailRegex.test(String(email).toLowerCase());
}

module.exports = validateEmail;
