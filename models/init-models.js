let DataTypes = require("sequelize").DataTypes;
let _activities = require("./activities.model");
let _activity_image = require("./activity_image.model");
let _activity_report_image = require("./activity_report_image.model");
let _badges = require("./badges.model");
let _meeting_ata_image = require("./meeting_ata_image.model");
let _meetings = require("./meetings.model");
let _new_image = require("./new_image.model");
let _news = require("./news.model");
let _news_letter = require("./news_letter.model");
let _role = require("./role.model");
let _schools = require("./schools.model");
let _seeds = require("./seeds.model");
let _theme = require("./theme.model");
let _user_badge = require("./user_badge.model");
let _users = require("./users.model");

function initModels(sequelize) {
	let activities = _activities(sequelize, DataTypes);
	let activity_image = _activity_image(sequelize, DataTypes);
	let activity_report_image = _activity_report_image(sequelize, DataTypes);
	let badges = _badges(sequelize, DataTypes);
	let meeting_ata_image = _meeting_ata_image(sequelize, DataTypes);
	let meetings = _meetings(sequelize, DataTypes);
	let new_image = _new_image(sequelize, DataTypes);
	let news = _news(sequelize, DataTypes);
	let news_letter = _news_letter(sequelize, DataTypes);
	let role = _role(sequelize, DataTypes);
	let schools = _schools(sequelize, DataTypes);
	let seeds = _seeds(sequelize, DataTypes);
	let theme = _theme(sequelize, DataTypes);
	let user_badge = _user_badge(sequelize, DataTypes);
	let users = _users(sequelize, DataTypes);

	activity_image.belongsTo(activities, { as: "activity", foreignKey: "activity_id" });
	activities.hasMany(activity_image, { as: "activity_images", foreignKey: "activity_id" });
	activity_report_image.belongsTo(activities, { as: "activity", foreignKey: "activity_id" });
	activities.hasMany(activity_report_image, {
		as: "activity_report_images",
		foreignKey: "activity_id"
	});
	user_badge.belongsTo(badges, { as: "badge", foreignKey: "badge_id" });
	badges.hasMany(user_badge, { as: "user_badges", foreignKey: "badge_id" });
	meeting_ata_image.belongsTo(meetings, { as: "meeting", foreignKey: "meeting_id" });
	meetings.hasMany(meeting_ata_image, { as: "meeting_ata_images", foreignKey: "meeting_id" });
	new_image.belongsTo(news, { as: "new", foreignKey: "new_id" });
	news.hasMany(new_image, { as: "new_images", foreignKey: "new_id" });
	users.belongsTo(role, { as: "role", foreignKey: "role_id" });
	role.hasMany(users, { as: "users", foreignKey: "role_id" });
	activities.belongsTo(schools, { as: "school", foreignKey: "school_id" });
	schools.hasMany(activities, { as: "activities", foreignKey: "school_id" });
	meetings.belongsTo(schools, { as: "school", foreignKey: "school_id" });
	schools.hasMany(meetings, { as: "meetings", foreignKey: "school_id" });
	users.belongsTo(schools, { as: "school", foreignKey: "school_id" });
	schools.hasMany(users, { as: "users", foreignKey: "school_id" });
	activities.belongsTo(theme, { as: "theme", foreignKey: "theme_id" });
	theme.hasMany(activities, { as: "activities", foreignKey: "theme_id" });
	activities.belongsTo(users, { as: "creator", foreignKey: "creator_id" });
	users.hasMany(activities, { as: "activities", foreignKey: "creator_id" });
	meetings.belongsTo(users, { as: "creator", foreignKey: "creator_id" });
	users.hasMany(meetings, { as: "meetings", foreignKey: "creator_id" });
	news.belongsTo(users, { as: "creator", foreignKey: "creator_id" });
	users.hasMany(news, { as: "newss", foreignKey: "creator_id" });
	seeds.belongsTo(users, { as: "user", foreignKey: "user_id" });
	users.hasMany(seeds, { as: "seeds", foreignKey: "user_id" });
	user_badge.belongsTo(users, { as: "user", foreignKey: "user_id" });
	users.hasMany(user_badge, { as: "user_badges", foreignKey: "user_id" });

	return {
		activities,
		activity_image,
		activity_report_image,
		badges,
		meeting_ata_image,
		meetings,
		new_image,
		news,
		news_letter,
		role,
		schools,
		seeds,
		theme,
		user_badge,
		users
	};
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
