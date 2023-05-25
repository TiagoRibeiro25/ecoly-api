const moment = require("moment");
const db = require("../models/db");
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
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

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
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

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
		});

		if (pastMeetingsData.length === 0) {
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
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

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
		});

		if (futureMeetingsData.length === 0) {
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
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.createMeeting = async (req, res) => {
	const { date, room, description } = req.body;

	try {
		const creator = await Users.findByPk(req.tokenData.userId);
		const schoolUser = await Schools.findByPk(req.tokenData.schoolId);

		// check if there is a meeting at the same date and room
		const meeting = await meetings.findOne({
			where: {
				date: date,
				room: room,
			},
		});

		if (meeting) {
			throw new Error("There is already a meeting at this date and room.");
		}

		// if the hour is delayed on the database (1 hour) increase the date by 1 hour with moment
		const dateMoment = moment(date).add(1, "hours");

		// if the hour is ahead on the database (1 hour) decrease the date by 1 hour with moment
		const dateMomentV2 = moment(date).subtract(1, "hours");

		const newMeeting = await meetings.create({
			creator_id: creator.id, // user
			school_id: schoolUser.id, // user school
			date: dateMoment || dateMomentV2,
			room: room,
			description: description,
		});

		const meetingsCount = await meetings.count({
			where: {
				creator_id: creator.id,
			},
		});

		if (meetingsCount === 1) {
			await unlockBadge({ badgeId: 4, userId: creator.id });
		}

		if (meetingsCount === 3) {
			await unlockBadge({ badgeId: 8, userId: creator.id });
		}

		if (newMeeting) {
			addSeeds({ userId: creator.id, amount: 40 });
		}

		return res.status(201).json({
			success: true,
			message: `meeting created ${newMeeting.id}`,
		});
	} catch (err) {
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		if (err.message === "There is already a meeting at this date and room.") {
			return res.status(409).json({
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

exports.addAta = async (req, res) => {
	const { ata, images } = req.body;

	const { id } = req.params;

	try {
		const creator = await Users.findByPk(req.tokenData.userId);

		const meeting = await meetings.findByPk(req.params.id);

		if (isNaN(id)) {
			throw new Error("Invalid id.");
		}

		if (!meeting) {
			throw new Error("Meeting not found.");
		}

		// check if the meeting is from the past
		if (meeting.date > new Date()) {
			throw new Error("You can only add ATA to past meetings.");
		}

		if (meeting.ata != null) {
			throw new Error("ATA already added to this meeting.");
		}

		const updatedMeeting = await meeting.update({
			ata: ata,
		});

		if (req.body.images && req.body.images.length > 0) {
			images.forEach(async (image) => {
				await meetingAtaImage.create({
					meeting_id: meeting.id,
					img: image,
				});
			});
			await unlockBadge({ badgeId: 5, userId: creator.id }); //if already have the badge only will earn seeds
			await addSeeds({ userId: creator.id, amount: 40 });
		}

		return res.status(200).json({
			success: true,
			message: `ATA added to meeting ${updatedMeeting.id}`,
		});
	} catch (err) {
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		if (err.message === "Meeting not found.") {
			return res.status(404).json({
				success: false,
				error: err.message,
			});
		}
		if (err.message === "You can only add ATA to past meetings.") {
			return res.status(409).json({
				success: false,
				error: err.message,
			});
		}

		if (err.message === "ATA already added to this meeting.") {
			return res.status(409).json({
				success: false,
				error: err.message,
			});
		}

		if (err.message === "Invalid id.") {
			return res.status(400).json({
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

exports.deleteMeeting = async (req, res) => {
	try {
		const meeting = await meetings.findByPk(req.params.id);

		if (!meeting) {
			throw new Error("Meeting not found.");
		}

		// if the meeting haves an ata will delete the ata images associated
		if (meeting.ata != null) {
			const ataImages = await meetingAtaImage.findAll({
				where: {
					meeting_id: meeting.id,
				},
			});

			if (ataImages) {
				ataImages.forEach(async (image) => {
					await image.destroy();
				});
			}

			await meeting.destroy({
				where: {
					id: meeting.id,
				},
			});
		}

		// if the meeting don´t have an ata will delete the meeting only (no ata images)
		await meeting.destroy({
			where: {
				id: meeting.id,
			},
		});

		return res.status(200).json({
			success: true,
			message: `Meeting ${meeting.id} deleted.`,
		});
	} catch (err) {
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		if (err.message === "Meeting not found.") {
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
