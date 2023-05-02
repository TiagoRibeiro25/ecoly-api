exports.validateRoleBody = (req, res, next) => {
	const { role } = req.body;

	// check if the role is empty
	if (!role) {
		return res.status(400).send({ success: false, message: "Role can not be empty!" });
	}
	// check if the role is a string
	if (typeof role !== "string") {
		return res.status(400).send({ success: false, message: "Role must be a string!" });
	}
	// check if the role name is valid (only letters and spaces)
	if (!/^[a-zA-Z]+$/.test(role)) {
		return res.status(400).send({ success: false, message: "Invalid role name!" });
	}

	next();
};
