require("dotenv").config();
require("./resetDB")(true)
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
