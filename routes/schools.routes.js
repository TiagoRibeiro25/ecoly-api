const express = require("express");
const router = express.Router();
const schoolsController = require("../controllers/schools.controller.js");
const authController = require("../controllers/auth.controller");

router
	.route("/")
	.get(authController.verifyToken, authController.verifyIsVerified, schoolsController.getSchools);

router.route("/:id").get(schoolsController.getSchool);
module.exports = router;
