const colors = require("colors");
const newsLetterTemplate = require("../data/newsLetterTemplate");
const sendEmail = require("./emailSender");
const db = require("../models/db");
const NewsLetter = db.news_letter;

const reduceText = (text) => (text.length > 200 ? text.slice(0, 200) + "..." : text);

/** @param {{title: string, author: {id: number, name: string}, content: string, img: string}} latestNew */
async function sendNewsLetter(latestNew) {
	/** @type {Array<{email: string, delete_key: string}>} */
	const users = await NewsLetter.findAll();

	// email data
	const from = "ECOLY - Newsletter";
	const subject = "ECOLY - Nova Notícia";

	for (const user of users) {
		const body = newsLetterTemplate(
			latestNew.title,
			latestNew.author,
			reduceText(latestNew.content),
			latestNew.img,
			new Date().toLocaleDateString("pt-PT"),
			user.delete_key
		);

		// send email
		const result = await sendEmail(
			from,
			[{ name: user.email, email: user.email }],
			subject,
			body
		);
		if (result) console.log(colors.green(`Email sent to ${user.email}`));
		else console.log(colors.red(`Email not sent to ${user.email}`));
	}
}

//* Example on how to use:
// await sendNewsLetter({
// 	title: "Hello World",
// 	author: { id: 3, name: "Tiago Ribeiro" },
// 	content:
// 		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos possimus blanditiis, saepe sint dicta nobis magnam perferendis impedit tempora quas a facilis ipsum quibusdam fugit voluptates rem asperiores tempore minus modi cum! Dignissimos minima laborum provident pariatur distinctio, voluptatibus quia veniam perferendis maxime sapiente deleniti omnis excepturi atque aliquid? Laudantium, tempora nemo saepe pariatur iusto voluptatum quisquam blanditiis quis quibusdam, quia suscipit laborum magnam, atque quae repellat error",
// 	img: "https://picsum.photos/400/300",
// });

module.exports = sendNewsLetter;
