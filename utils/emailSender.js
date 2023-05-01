const axios = require("axios");
const colors = require("colors");

/**
 * Sends an email message.
 * @param {string} from
 * @param {Array<{name: string, email: string}>} toEmails
 * @param {string} subject
 * @param {string} body
 */
async function sendEmail(from, toEmails, subject, body) {
	const uri = process.env.SEND_EMAIL_URI;
	const headers = {
		"Content-Type": "application/json",
		authorization: process.env.SEND_EMAIL_AUTH_KEY,
	};

	const data = { From: from, To: toEmails, Subject: subject, Text: body };

	try {
		await axios.post(uri, data, { headers: headers });
		return true;
	} catch (err) {
		console.log(
			colors.red("An error occurred while trying to send an email:\n") +
				colors.yellow("-> " + err)
		);
		return false;
	}
}

module.exports = sendEmail;
