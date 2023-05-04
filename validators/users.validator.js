const validateEmail = require("../utils/validateEmail");

exports.validateBodyLogin = (req, res, next) => {
	/** @type {{email :string, password :string}} */
	const { email, password } = req.body;

	// validate the email
	if (!email || !validateEmail(email)) {
		return res.status(400).json({ success: false, message: "Invalid email!" });
	}

	// check if the password is empty
	if (!password) {
		return res.status(400).json({ success: false, message: "Password can not be empty!" });
	}

	next();
};

exports.validateBodyRegister = (req, res, next) => {
	const { name, email, password, schoolId, internalId, course, year } = req.body;

	if (!name || !email || !password || !schoolId) {
		return res.status(400).json({ success: false, message: "Missing fields!" });
	}

	if (!validateEmail(email)) {
		return res.status(400).json({ success: false, message: "Invalid email!" });
	}

	if (typeof name !== "string") {
		return res.status(400).json({ success: false, message: "Name must be a string!" });
	}

	if (typeof password !== "string") {
		return res.status(400).json({ success: false, message: "Password must be a string!" });
	}

	if (typeof schoolId !== "number") {
		return res.status(400).json({ success: false, message: "School id must be a number!" });
	}

	if (internalId && typeof internalId !== "string") {
		return res.status(400).json({ success: false, message: "Internal id must be a string!" });
	}

	if (internalId && course && typeof course !== "string") {
		return res.status(400).json({ success: false, message: "Course must be a string!" });
	}

	if (internalId && course && year && typeof year !== "number") {
		return res.status(400).json({ success: false, message: "Year must be a number!" });
	}

	next();
};

exports.validateBodyRoleName = (req, res, next) => {
	/** @type {{role :string}} */
	const { role } = req.body;

	// check if the role is empty
	if (!role) {
		return res.status(400).json({ success: false, message: "Role can not be empty!" });
	}
	// check if the role is a string
	if (typeof role !== "string") {
		return res.status(400).json({ success: false, message: "Role must be a string!" });
	}
	// check if the role name is valid (only letters and spaces)
	if (!/^[a-zA-Z]+$/.test(role)) {
		return res.status(400).json({ success: false, message: "Invalid role name!" });
	}

	next();
};

exports.validateBodyRoleId = (req, res, next) => {
	/** @type {number} */
	const id = req.body.roleId;

	// check if the role id is empty
	if (!id && id !== 0) {
		return res.status(400).json({ success: false, message: "Role id can not be empty!" });
	}
	// check if the id is a number
	if (typeof id !== "number") {
		return res.status(400).json({ success: false, message: "Role id must be a number!" });
	}

	next();
};
