const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news.controller.js");
const authController = require("../controllers/auth.controller");
const newsValidator = require("../validators/news.validator")

router
	.route("/")
	.get(newsController.getNews)
	.post(authController.verifyToken, authController.verifyIsAdmin, newsValidator.validateNews, newsController.addNew);

router
	.route("/:id")
	.get(newsController.getSingleNew)
	.delete(authController.verifyToken, authController.verifyIsAdmin, newsController.deleteNew);

module.exports = router;
