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

//TODO: fix this validator
exports.validateBodyEditUserInfo = (req, res, next) => {
	const validFields = ["email", "password", "internalId", "course", "year", "highlightBadgeId"];
	const fields = req.query.fields ? req.query.fields.split(",") : [];

	const validateField = (field, validator) => {
		return fields.includes(field) && !validator(req.body[field]);
	};

	const validators = {
		email: (value) => {
			return typeof value !== "string" || value.trim().length === 0 || !validateEmail(value);
		},
		password: (value) => {
			return typeof value !== "string" || value.trim().length === 0;
		},
		internalId: (value) => {
			return typeof value !== "string" || value.trim().length === 0;
		},
		course: (value) => {
			return typeof value !== "string" || value.trim().length === 0;
		},
		year: (value) => {
			return typeof value !== "number" && value !== null && value !== undefined;
		},
		highlightBadgeId: (value) => {
			return typeof value !== "number" && value !== null && value !== undefined;
		},
	};

	const invalidField = Object.keys(validators).find((field) =>
		validateField(field, validators[field])
	);

	console.log(invalidField); //? error: it's always undefined (why?)

	if (fields.length === 0 || !validFields.some((field) => fields.includes(field))) {
		return res.status(400).json({ success: false, message: "Invalid fields!" });
	}

	if (invalidField) {
		return res.status(400).json({ success: false, message: `Invalid ${invalidField}!` });
	}

	// remove invalid fields
	req.body = Object.fromEntries(
		Object.entries(req.body).filter(([key]) => validFields.includes(key))
	);

	next();
};
