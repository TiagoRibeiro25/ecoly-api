const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const usersMiddleware = require("../middleware/users.middleware");

router.route("/:id").get(usersController.getUser);

router.route("/role").post(usersMiddleware.validateBodyRoleName, usersController.addRole);

router.route("/role/:id").put(usersMiddleware.validateBodyRoleName, usersController.editRole);

router.route("/:id/role").patch(usersMiddleware.validateBodyRoleId, usersController.editUserRole);

module.exports = router;
