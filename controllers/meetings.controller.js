const db = require("../models/db");
const colors = require("colors");
const { Op } = require("sequelize");
const meetings = db.meetings;
const meetingAtaImage = db.meeting_ata_image;
const Schools = db.schools;
const unlockBadge = require("../utils/unlockBadge");
const addSeeds = require("../utils/addSeeds");

function fixDate(date) {
	const Date = date.toISOString().split("T")[0];

	const reverseDate = Date.split("-").reverse().join("-");

	return reverseDate;
}

exports.getAtaMeeting = async (req, res) => {
	const { id } = req.params;

	let { school } = req.query;

	school = school.toUpperCase();

	try {
		const meeting = await meetings.findByPk(id, {
			attributes: ["date", "ata"],
			include: [
				{
					model: meetingAtaImage,
					as: "meeting_ata_images",
					attributes: ["img"],
				},
			],
		});

		const schoolUser = await Schools.findByPk(req.tokenData.schoolId);

		// check if the school exists
		const schoolExists = await Schools.findOne({
			where: {
				name: school,
			},
		});

		if (!schoolExists) {
			return res.status(404).json({
				success: false,
				error: "School not found.",
			});
		}

		// check if the query school name is from the logged user school
		if (schoolUser.name !== school) {
			return res.status(401).json({
				success: false,
				error: "you are not from this school.",
			});
		}

		if (isNaN(id)) {
			return res.status(400).json({
				success: false,
				error: "Invalid id.",
			});
		}

		if (!meeting) {
			return res.status(404).json({
				success: false,
				error: "Meeting not found.",
			});
		}

		// if the school don´t have any ata to see
		if (meeting.ata === null) {
			return res.status(404).json({
				success: false,
				error: "This meeting don´t have an ata yet.",
			});
		}

		const ata = {
			ata: meeting.ata,
			date: fixDate(meeting.date),
			images: meeting.meeting_ata_images.map((image) => image.img),
		};

        console.log(ata);
		return res.status(200).json({
			success: true,
			data: ata,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getPastMeetings = async (req, res) => {
	console.log(colors.green("Past Meetings"));
};

exports.getFutureMeetings = async (req, res) => {
	console.log(colors.green("Future Meetings"));
};

exports.createMeeting = async (req, res) => {
	console.log(colors.green("Create Meeting"));
};

exports.addAta = async (req, res) => {
	console.log(colors.green("Add Ata to meeting"));
};

exports.deleteMeeting = async (req, res) => {
	console.log(colors.green("Delete Meeting"));
};
