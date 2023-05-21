const express = require("express");
const router = express.Router();
const subscribeController = require("../controllers/subscribe.controller");
const subscribeValidator = require("../validators/subscribe.validator");
const authController = require("../controllers/auth.controller");

router
	.route("/")
	.get(authController.verifyToken, subscribeController.isEmailSubscribed)
	.post(subscribeValidator.validateBodySubscribe, subscribeController.subscribe);

router.route("/:id").delete(subscribeController.deleteSubscription);

module.exports = router;
