if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
// Import routes
const usersRouter = require("./routes/users.routes");
const subscribeRouter = require("./routes/subscribe.routes");
const schoolsRouter = require("./routes/schools.routes");
const newsRouter = require("./routes/news.routes");
const meetingsRouter = require("./routes/meetings.routes");
const activitiesRouter = require("./routes/activities.routes");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api", (_req, res) => {
	res.json({ message: "Welcome to the Ecoly API" });
});

app.use("/api/users", usersRouter);
app.use("/api/subscribe", subscribeRouter);
app.use("/api/schools", schoolsRouter);
app.use("/api/news", newsRouter);
app.use("/api/meetings", meetingsRouter);
app.use("/api/activities", activitiesRouter);

app.use((_req, res) => {
	res.status(404).json({ message: "Invalid route" });
});

app.listen(PORT, HOST, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`);
});
