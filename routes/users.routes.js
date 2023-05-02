const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const usersMiddleware = require("../middleware/users.middleware");

router
	.route("/role")
	.get(usersController.getRoles)
	.post(usersMiddleware.validateBodyRoleName, usersController.addRole);

router.route("/role/:id").put(usersMiddleware.validateBodyRoleName, usersController.editRole);

router.route("/:id/role").patch(usersMiddleware.validateBodyRoleId, usersController.editUserRole);

router.route("/").get(usersController.getUsers);

router.route("/:id").get(usersController.getUser);

module.exports = router;
