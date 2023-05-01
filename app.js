const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Import routes
const usersRouter = require("./routes/users.routes");
const subscribeRouter = require("./routes/subscribe.routes");
const schoolsRouter = require("./routes/schools.routes");
const newsRouter = require("./routes/news.routes");
const meetingsRouter = require("./routes/meetings.routes");
const activitiesRouter = require("./routes/activities.routes");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.ENABLE_LOG === "true") app.use(morgan("dev"));

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

module.exports = app;
