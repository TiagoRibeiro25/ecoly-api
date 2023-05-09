const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/users.controller");
const usersValidator = require("../validators/users.validator");

router
	.route("/")
	.get(authController.verifyToken, authController.verifyIsVerified, usersController.getUsers)
	.post(usersValidator.validateBodyRegister, usersController.register)
	.patch(
		authController.verifyToken,
		usersValidator.validateBodyEditUserInfo,
		usersController.editUserInfo
	);

router.route("/login").post(usersValidator.validateBodyLogin, usersController.login);

router
	.route("/contact")
	.post(
		authController.verifyToken,
		authController.verifyIsVerified,
		usersValidator.validateBodyContactMembers,
		usersController.contactMembers
	);

router
	.route("/role")
	.get(authController.verifyToken, authController.verifyIsAdmin, usersController.getRoles)
	.post(
		authController.verifyToken,
		authController.verifyIsAdmin,
		usersValidator.validateBodyRoleName,
		usersController.addRole
	);

router
	.route("/role/:id")
	.put(
		authController.verifyToken,
		authController.verifyIsAdmin,
		usersValidator.validateBodyRoleName,
		usersController.editRole
	);

router
	.route("/:id/role")
	.patch(
		authController.verifyToken,
		authController.verifyIsAdmin,
		usersValidator.validateBodyRoleId,
		usersController.editUserRole
	);

router.route("/:id").get(usersController.getUser);

module.exports = router;
