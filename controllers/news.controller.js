const jwt = require("jsonwebtoken");
const db = require("../models/db");
const News = db.news;
const NewsImage = db.new_image;
const Roles = db.role;
const Users = db.users;
const sendNewsLetter = require("../utils/sendNewsLetter");

exports.getNews = async (req, res) => {
	try {
		const news = await News.findAll();
		const newsJSON = news.map((item) => item.toJSON());
		let isUserAdmin = false;

		console.log(newsJSON);

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

		if (!singleNew) {
			return res.status(404).json({
				success: false,
				message: "New does not exist",
			});
		}

		const newsJSON = singleNew.toJSON();

		let isUserAdmin = false;

		const creator = await Users.findByPk(newsJSON.creator_id);

		const creatorInfo = {
			id: creator.id,
			name: creator.name,
		};

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

		res.status(200).json({
			success: true,
			data: { isUserAdmin, creator: creatorInfo, news: newsJSON },
		});
	} catch (error) {
		return res.status(500).json({
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
	const { newToCreate } = req.body;

	try {
		const existingNew = await News.findOne({ where: { title: newToCreate.title } });
		const creator = await Users.findByPk(newToCreate.creator_id);

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
				author: { id: `${creator.id}`, name: `${creator.name}` },
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
