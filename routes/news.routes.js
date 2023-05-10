const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news.controller.js");

router.route("/").get(newsController.getNews);

router.route("/:id").get(newsController.getSingleNew);

module.exports = router;
