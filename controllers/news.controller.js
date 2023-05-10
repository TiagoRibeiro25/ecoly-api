const db = require("../models/db");
const News = db.news;

exports.getNews = async (req, res) => {
	try {
		const news = await News.findAll();
		res.status(200).json({
			success: true,
			news,
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
				message: "School does not exist",
			});
		}

		const result = singleNew.toJSON();

		return res.status(200).json({
			success: true,
			new: result,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch New",
		});
	}
};
