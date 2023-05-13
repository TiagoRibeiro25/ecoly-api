const db = require("../models/db");
const News = db.news;
const sendNewsLetter = require("../utils/sendNewsLetter");

exports.getNews = async (req, res) => {
	try {
		const news = await News.findAll();
		res.status(200).json({
			success: true,
			data: news,
		});
	} catch (error) {
		res.status(500).send({
			success: false,
			message: "Failed to fetch news",
		});
	}
};

exports.getSingleNew = async (req, res) => {
	const { id } = req.params;

	try {
		const singleNew = await News.findByPk(id);
		if (!singleNew) {
			return res.status(404).json({
				success: false,
				message: "New does not exist",
			});
		}

		const result = singleNew.toJSON();

		return res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch New",
		});
	}
};

exports.deleteNew = async (req, res) => {
	const { id } = req.params;

	try {
		const newToDelete = await News.findByPk(id);

		if (!newToDelete) {
			res.status(404).json({
				success: false,
				message: "New was not found",
			});
		} else {
			await newToDelete.destroy();

			res.status(200).json({
				success: true,
				message: "The new was deleted",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to delete new",
		});
	}
};

exports.addNew = async (req, res) => {
	const { newToCreate } = req.body;

	try {
		const existingNew = await News.findOne({ where: { title: newToCreate.title } });

		if (existingNew) {
			res.status(409).json({
				success: false,
				message: "The new already exists",
			});
		} else {
			const newNew = await News.create({
				title: newToCreate.title,
				content: newToCreate.content,
				date_created: newToCreate.date_created,
				creator_id: newToCreate.creator_id,
			});

			await sendNewsLetter({
				title: `${newToCreate.title}`,
				author: { id: `${newToCreate.creator_id}`, name: `José Nogueira` },
				content: `${newToCreate.content}`,
				img: "https://picsum.photos/400/300",
			});

			res.status(201).json({
				success: true,
				message: "New was successfully added",
			});
		}
	} catch (error) {
		res.status(500).send({
			success: false,
			message: "Failed to add the new" + " " + error,
		});
	}
};
