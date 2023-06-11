const axios = require("axios");
const colors = require("colors");

/**
 * Sends an email message.
 * @param {string} from - the email address of the sender (or the name of the sender)
 * @param {Array<{name: string, email: string}>} toEmails - the names and email addresses of the recipients
 * @param {string} subject - the subject of the email
 * @param {string} body - the body of the email (html is supported)
 * @returns {Promise<boolean>} - true if the email was sent successfully, false otherwise
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
