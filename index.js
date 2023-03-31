if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const cors = require("cors");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.all("*", (req, res) => {
	res.status(404).json({ message: "Invalid route" });
});

app.listen(PORT, HOST, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`);
});
