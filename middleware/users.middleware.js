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
