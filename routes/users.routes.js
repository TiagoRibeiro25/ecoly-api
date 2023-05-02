const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const usersMiddleware = require("../middleware/users.middleware");

router.route("/:id").get(usersController.getUser);

router.route("/role").post(usersMiddleware.validateRoleBody, usersController.addRole);

router.route("/role/:id").put(usersMiddleware.validateRoleBody, usersController.editRole);

module.exports = router;
