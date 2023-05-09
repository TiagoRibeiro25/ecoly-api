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

	if (!name || !email || !password || (!schoolId && schoolId !== 0)) {
		return res.status(400).json({ success: false, message: "Missing fields!" });
	}

	if (!validateEmail(email)) {
		return res.status(400).json({ success: false, message: "Invalid email!" });
	}

	if (typeof name !== "string") {
		return res.status(400).json({ success: false, message: "Invalid name!" });
	}

	if (typeof password !== "string") {
		return res.status(400).json({ success: false, message: "Invalid password!" });
	}

	if (typeof schoolId !== "number") {
		return res.status(400).json({ success: false, message: "Invalid school id!" });
	}

	if (internalId && typeof internalId !== "string") {
		return res.status(400).json({ success: false, message: "Invalid internal id!" });
	}

	if (internalId && course && typeof course !== "string") {
		return res.status(400).json({ success: false, message: "Invalid course!" });
	}

	if (internalId && course && year && typeof year !== "number") {
		return res.status(400).json({ success: false, message: "Invalid year!" });
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

exports.validateBodyEditUserInfo = (req, res, next) => {
	const validFields = ["email", "password", "internalId", "course", "year", "highlightBadgeId"];
	const fields = Object.keys(req.body);

	if (fields.length === 0) {
		return res.status(400).json({ success: false, message: "Missing fields!" });
	}

	const validators = {
		email: (email) =>
			typeof email === "string" && validateEmail(email) && email.trim().length !== 0,
		password: (password) => typeof password === "string" && password.trim().length !== 0,
		internalId: (internalId) => typeof internalId === "string" && internalId.trim().length !== 0,
		course: (course) => typeof course === "string" && course.trim().length !== 0,
		year: (year) => typeof year === "number" && year >= 0 && year <= 5,
		highlightBadgeId: (highlightBadgeId) =>
			typeof highlightBadgeId === "number" && highlightBadgeId > 0,
	};

	// check if the fields are valid
	for (const field of fields) {
		if (!validFields.includes(field)) {
			return res.status(400).json({ success: false, message: `${field} is not a valid field!` });
		}
		if (!validators[field](req.body[field])) {
			return res.status(400).json({ success: false, message: `Invalid ${field}!` });
		}
	}

	next();
};

exports.validateBodyContactMembers = (req, res, next) => {
	/** @type {{ to: {name: string, email: string}[], content: string }} */
	const { to, content } = req.body;

	if (!to || !content) {
		return res.status(400).json({ success: false, message: "Missing fields!" });
	}

	// validate the emails
	if (
		!Array.isArray(to) ||
		to.length === 0 ||
		!to.every((user) => validateEmail(user.email)) ||
		!to.every((user) => typeof user.name === "string")
	) {
		return res.status(400).json({ success: false, message: "Invalid Users!" });
	}

	// validate the content
	if (typeof content !== "string" || content.trim().length === 0) {
		return res.status(400).json({ success: false, message: "Invalid message!" });
	}

	next();
};
