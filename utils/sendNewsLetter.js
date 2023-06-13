const colors = require("colors");
const newsLetterTemplate = require("../data/newsLetterTemplate");
const sendEmail = require("./emailSender");
const db = require("../models/db");
const NewsLetter = db.news_letter;

/** @param {{title: string, author: {id: number, name: string}, newId: number}} latestNew */
async function sendNewsLetter(latestNew) {
	/** @type {Array<{email: string, delete_key: string}>} */
	const users = await NewsLetter.findAll();

	// email data
	const from = "ECOLY - Newsletter";
	const subject = "ECOLY - Nova Notícia";

	for (const user of users) {
		const body = newsLetterTemplate({
			newId: latestNew.newId,
			title: latestNew.title,
			author: latestNew.author,
			date: new Date().toLocaleDateString("pt-PT"),
			unsubscribeKey: user.delete_key,
		});

		// send email
		const userData = { name: user.email, email: user.email };
		const result = await sendEmail(from, [userData], subject, body);

		if (result) console.log(colors.green(`Email sent to ${user.email}`));
		else console.log(colors.red(`Email not sent to ${user.email}`));
	}
}

module.exports = sendNewsLetter;
