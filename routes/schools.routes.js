const express = require("express");
const router = express.Router();
const schoolsController = require("../controllers/schools.controller.js");
const authController = require("../controllers/auth.controller");

router.route("/").get(schoolsController.getSchools).post(schoolsController.addSchool);

router
	.route("/:id")
	.get(authController.verifyToken, authController.verifyIsAdmin, schoolsController.getSchool)
	.delete(
		authController.verifyToken,
		authController.verifyIsAdmin,
		schoolsController.deleteSchool
	);

module.exports = router;
