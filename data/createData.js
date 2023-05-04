const colors = require("colors");
const db = require("../models/db");
const data = require("./data");
const bcrypt = require("bcryptjs");

async function roles() {
	try {
		const start = new Date();
		await db.role.bulkCreate(data.roles);
		const end = new Date();
		console.log(colors.blue("Roles created successfully - ") + colors.green(end - start + "ms"));
	} catch (err) {
		throw new Error(colors.red("An error occurred while creating roles:\n") + colors.yellow(err));
	}
}

async function schools() {
	try {
		const start = new Date();
		await db.schools.bulkCreate(data.schools);
		const end = new Date();
		console.log(
			colors.blue("Schools created successfully - ") + colors.green(end - start + "ms")
		);
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while creating schools:\n") + colors.yellow(err)
		);
	}
}

async function users() {
	try {
		const start = new Date();

		// Hash the passwords
		data.users.forEach((user) => (user.password = bcrypt.hashSync(user.password, 10)));

		await db.users.bulkCreate(data.users);
		const end = new Date();
		console.log(colors.blue("Users created successfully - ") + colors.green(end - start + "ms"));
	} catch (err) {
		throw new Error(colors.red("An error occurred while creating users:\n") + colors.yellow(err));
	}
}

async function badges() {
	try {
		const start = new Date();
		await db.badges.bulkCreate(data.badges);
		const end = new Date();
		console.log(colors.blue("Badges created successfully - ") + colors.green(end - start + "ms"));
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while creating badges:\n") + colors.yellow(err)
		);
	}
}

async function userBadge() {
	try {
		const start = new Date();
		await db.user_badge.bulkCreate(data.user_badge);
		const end = new Date();
		console.log(
			colors.blue("User_badge created successfully - ") + colors.green(end - start + "ms")
		);
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while creating user_badge:\n") + colors.yellow(err)
		);
	}
}

async function news() {
	try {
		const start = new Date();
		await db.news.bulkCreate(data.news);
		const end = new Date();
		console.log(colors.blue("News created successfully - ") + colors.green(end - start + "ms"));
	} catch (err) {
		throw new Error(colors.red("An error occurred while creating news:\n") + colors.yellow(err));
	}
}

async function newImg() {
	try {
		const start = new Date();
		await db.new_image.bulkCreate(data.new_image);
		const end = new Date();
		console.log(
			colors.blue("New_img created successfully - ") + colors.green(end - start + "ms")
		);
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while creating new_img:\n") + colors.yellow(err)
		);
	}
}

async function newsLetter() {
	try {
		const start = new Date();
		await db.news_letter.bulkCreate(data.news_letter);
		const end = new Date();
		console.log(
			colors.blue("News_letter created successfully - ") + colors.green(end - start + "ms")
		);
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while creating news_letter:\n") + colors.yellow(err)
		);
	}
}

async function meetings() {
	try {
		const start = new Date();
		await db.meetings.bulkCreate(data.meetings);
		const end = new Date();
		console.log(
			colors.blue("Meetings created successfully - ") + colors.green(end - start + "ms")
		);
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while creating meetings:\n") + colors.yellow(err)
		);
	}
}

async function meetingAtaImage() {
	try {
		const start = new Date();
		await db.meeting_ata_image.bulkCreate(data.meeting_ata_image);
		const end = new Date();
		console.log(
			colors.blue("Meeting_ata_image created successfully - ") + colors.green(end - start + "ms")
		);
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while creating meeting_ata_image:\n") + colors.yellow(err)
		);
	}
}

async function theme() {
	try {
		const start = new Date();
		await db.theme.bulkCreate(data.theme);
		const end = new Date();
		console.log(colors.blue("Theme created successfully - ") + colors.green(end - start + "ms"));
	} catch (err) {
		throw new Error(colors.red("An error occurred while creating theme:\n") + colors.yellow(err));
	}
}

async function activities() {
	try {
		const start = new Date();
		await db.activities.bulkCreate(data.activities);
		const end = new Date();
		console.log(
			colors.blue("Activities created successfully - ") + colors.green(end - start + "ms")
		);
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while creating activities:\n") + colors.yellow(err)
		);
	}
}

async function activityImage() {
	try {
		const start = new Date();
		await db.activity_image.bulkCreate(data.activity_image);
		const end = new Date();
		console.log(
			colors.blue("Activity_image created successfully - ") + colors.green(end - start + "ms")
		);
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while creating activity_image:\n") + colors.yellow(err)
		);
	}
}

async function activityReportImage() {
	try {
		const start = new Date();
		await db.activity_report_image.bulkCreate(data.activity_report_image);
		const end = new Date();
		console.log(
			colors.blue("Activity_report_image created successfully - ") +
				colors.green(end - start + "ms")
		);
	} catch (err) {
		throw new Error(
			colors.red("An error occurred while creating activity_report_image:\n") +
				colors.yellow(err)
		);
	}
}

async function seeds() {
	try {
		const start = new Date();
		await db.seeds.bulkCreate(data.seeds);
		const end = new Date();
		console.log(colors.blue("Seeds created successfully - ") + colors.green(end - start + "ms"));
	} catch (err) {
		throw new Error(colors.red("An error occurred while creating seeds:\n") + colors.yellow(err));
	}
}

module.exports = {
	roles,
	schools,
	users,
	userBadge,
	badges,
	news,
	newImg,
	newsLetter,
	meetings,
	meetingAtaImage,
	theme,
	activities,
	activityImage,
	activityReportImage,
	seeds,
};
