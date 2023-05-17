const express = require("express");
const router = express.Router();
const subscribeController = require("../controllers/news_letter.controller");
const subscribeValidator = require("../validators/news_letter.validator");

router
	.route("/")
	.get(subscribeController.getAllSubscribedEmails)
	.post(subscribeValidator.validateBodySubscribe, subscribeController.subscribe);

router.route("/:id").delete(subscribeController.deleteSubscription);

module.exports = router;
