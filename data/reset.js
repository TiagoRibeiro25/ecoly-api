require("dotenv").config();
require("./resetDB")(true).then(() => {
	process.exit(0);
});
