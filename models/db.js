const dbConfig = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	pool: {
		max: dbConfig.pool.max,
		min: dbConfig.pool.min,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle,
	},
});

const initModels = require("./init-models");

const db = initModels(sequelize);

// Synchronize the database with the models
// (async () => {
// 	try {
// 		await sequelize.sync();
// 		console.log("All models were synchronized successfully.");
// 	} catch (err) {
// 		console.log(err);
// 	}
// })();

module.exports = db;
