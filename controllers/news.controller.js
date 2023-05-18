const jwt = require("jsonwebtoken");
const db = require("../models/db");
const News = db.news;
const NewsImage = db.new_image;
const Roles = db.role;
const Users = db.users;
const sendNewsLetter = require("../utils/sendNewsLetter");
const { Op } = require("sequelize");

exports.getNews = async (req, res) => {
	try {
		const { search } = req.query;
		const formatVal = search ? search.replace(/%20/g, " ") : "";

		const news = await News.findAll({ where: { title: { [Op.like]: `%${formatVal}%` } } });
		const newsJSON = news.map((item) => item.toJSON());
		let isUserAdmin = false;

		// Add image to each new
		for (const item of newsJSON) {
			const image = await NewsImage.findOne({ where: { new_id: item.id } });
			item.image = image.img;
		}

		// Check if the person that made the request is an admin
		let token = req.headers["x-access-token"] || req.headers.authorization;
		token = token?.replace("Bearer ", "");

		if (token) {
			try {
				// verify the token
				const decoded = jwt.verify(token, process.env.JWT_SECRET);

				// if the token is valid, find the role name from the database
				const role = await Roles.findByPk(+decoded.roleId);

				// if the role name is admin, add the isLoggedUser field to the response
				if (role.title === "admin") isUserAdmin = true;
			} catch (err) {
				isUserAdmin = false;
			}
		}

		// sort news by date
		newsJSON.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

		res.status(200).json({ success: true, data: { isUserAdmin, news: newsJSON } });
	} catch (error) {
		console.log(error);
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
		if (!singleNew) throw new Error("New does not exist");

		const newsJSON = singleNew.toJSON();
		let isUserAdmin = false;

		const creator = await Users.findByPk(newsJSON.creator_id);
		newsJSON.creator = { id: creator.id, name: creator.name };
		delete newsJSON.creator_id;

		// Add images to the news
		const images = await NewsImage.findAll({ where: { new_id: newsJSON.id } });
		newsJSON.images = images.map((image) => image.img);

		let token = req.headers["x-access-token"] || req.headers.authorization;
		token = token?.replace("Bearer ", "");

		if (token) {
			try {
				// verify the token
				const decoded = jwt.verify(token, process.env.JWT_SECRET);

				// if the token is valid, find the role name from the database
				const role = await Roles.findByPk(+decoded.roleId);

				// if the role name is admin, add the isLoggedUser field to the response
				if (role.title === "admin") isUserAdmin = true;
			} catch (err) {
				isUserAdmin = false;
			}
		}

		res.status(200).json({ success: true, data: { isUserAdmin, ...newsJSON } });
	} catch (error) {
		if (error.message === "New does not exist") {
			return res.status(404).json({ success: false, message: error.message });
		}

		res.status(500).json({
			success: false,
			message: "Failed to fetch New" + " " + error,
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
	const { title, content, imgs } = req.body;

	try {
		const existingNew = await News.findOne({ where: { title: title } });
		const creator = await Users.findByPk(req.tokenData.userId);

		if (existingNew) throw new Error("The new already exists");
		else {
			const newNew = await News.create({
				title: title,
				content: content,
				date_created: new Date().toISOString().split("T")[0],
				creator_id: creator.id,
			});

			for (const img of imgs) {
				await NewsImage.create({ img: img, new_id: newNew.id });
			}

			res.status(201).json({
				success: true,
				message: "New was successfully added",
			});

			const selectedImage = await NewsImage.findOne({ where: { new_id: newNew.id } });

			await sendNewsLetter({
				title: `${title}`,
				author: { id: `${creator.id}`, name: `${creator.name}` },
				content: `${content}`,
				img: selectedImage.img,
			});
		}
	} catch (error) {
		if (error.message === "The new already exists") {
			return res.status(409).json({ success: false, message: "The new already exists" });
		}

		res.status(500).send({
			success: false,
			message: "Failed to add the new",
		});
	}
};
