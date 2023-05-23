const db = require("../models/db");
const colors = require("colors");
const { Op } = require("sequelize");
const meetings = db.meetings;
const meetingAtaImage = db.meeting_ata_image;
const Schools = db.schools;
const Users = db.users;
const unlockBadge = require("../utils/unlockBadge");
const addSeeds = require("../utils/addSeeds");

function fixDate(date) {
	const Date = date.toISOString().split("T")[0];

	const reverseDate = Date.split("-").reverse().join("-");

	return reverseDate;
}

exports.getAtaMeeting = async (req, res) => {
	const { id } = req.params;

	const schoolUser = await Schools.findByPk(req.tokenData.schoolId);

	try {
		const meeting = await meetings.findByPk(id, {
			attributes: ["date", "ata"],
			where: {
				date: {
					[Op.lt]: new Date(),
				},
			},
			include: [
				{
					model: meetingAtaImage,
					as: "meeting_ata_images",
					attributes: ["img"],
				},
				{
					model: Schools,
					as: "school",
					where: {
						name: schoolUser.name,
					},
					attributes: ["name"],
				},
			],
		});

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

		if (meeting.date > new Date()) {
			return res.status(404).json({
				success: false,
				error: "This his a future meeting.",
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

exports.getOneFutureMeeting = async (req, res) => {
	const { id } = req.params;

	const schoolUser = await Schools.findByPk(req.tokenData.schoolId);

	try {
		const futureMeeting = await meetings.findByPk(id, {
			attributes: ["id", "date", "description", "room"],
			where: {
				date: {
					[Op.gt]: new Date(),
				},
			},
			include: [
				{
					model: Users,
					as: "creator",
					attributes: ["id", "name"],
				},
				{
					model: Schools,
					as: "school",
					where: {
						name: schoolUser.name,
					},
					attributes: ["name"],
				},
			],
		});

		if (isNaN(id)) {
			throw new Error("Invalid id.");
		}

		if (!futureMeeting) {
			throw new Error("Meeting not found.");
		}

		if (futureMeeting.date < new Date()) {
			throw new Error("This his a past meeting.");
		}

		const futureMeetingData = {
			id: futureMeeting.id,
			creator: {
				id: futureMeeting.creator.id,
				name: futureMeeting.creator.name,
			},
			date: fixDate(futureMeeting.date),
			room: futureMeeting.room,
			description: futureMeeting.description,
		};

		return res.status(200).json({
			success: true,
			data: futureMeetingData,
		});
	} catch (err) {
		if (err.message === "Invalid id.") {
			return res.status(400).json({
				success: false,
				error: err.message,
			});
		}

		if (err.message === "Meeting not found.") {
			return res.status(404).json({
				success: false,
				error: err.message,
			});
		}

		if (err.message === "This his a past meeting.") {
			return res.status(404).json({
				success: false,
				error: err.message,
			});
		}

		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getPastMeetings = async (req, res) => {
	const schoolUser = await Schools.findByPk(req.tokenData.schoolId);

	try {
		const pastMeetings = await meetings.findAll({
			where: {
				date: {
					[Op.lt]: new Date(),
				},
			},
			attributes: ["id", "date", "description", "room"],
			include: [
				{
					model: Users,
					as: "creator",
					attributes: ["id", "name"],
				},
				{
					model: Schools,
					as: "school",
					where: {
						name: schoolUser.name,
					},
					attributes: ["name"],
				},
			],
		});

		const pastMeetingsData = pastMeetings.map((meeting) => {
			return {
				id: meeting.id,
				creator: {
					id: meeting.creator.id,
					name: meeting.creator.name,
				},
				date: fixDate(meeting.date),
				room: meeting.room,
				description: meeting.description,
			};
		}
		);

		if(pastMeetingsData.length === 0){
			return res.status(404).json({
				success: false,
				error: "No meetings found.",
			});
		}

		return res.status(200).json({
			success: true,
			data: pastMeetingsData,
		});

	} catch (err) {

		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getFutureMeetings = async (req, res) => {

	const schoolUser = await Schools.findByPk(req.tokenData.schoolId);

	try {
		const futureMeetings = await meetings.findAll({
			where: {
				date: {
					[Op.gt]: new Date(),
				},
			},
			attributes: ["id", "date", "description", "room"],
			include: [
				{
					model: Users,
					as: "creator",
					attributes: ["id", "name"],
				},
				{
					model: Schools,
					as: "school",
					where: {
						name: schoolUser.name,
					},
					attributes: ["name"],
				},
			],
		});

		const futureMeetingsData = futureMeetings.map((meeting) => {
			return {
				id: meeting.id,
				creator: {
					id: meeting.creator.id,
					name: meeting.creator.name,
				},
				date: fixDate(meeting.date),
				room: meeting.room,
				description: meeting.description,
			};
		}
		);

		if(futureMeetingsData.length === 0){
			return res.status(404).json({
				success: false,
				error: "No meetings found.",
			});
		}

		return res.status(200).json({
			success: true,
			data: futureMeetingsData,
		});
		
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
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
