const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"activities",
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			creator_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
			},
			school_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "schools",
					key: "id",
				},
			},
			theme_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "theme",
					key: "id",
				},
			},
			title: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			complexity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			initial_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			final_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			objective: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			diagnostic: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			meta: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			resources: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			participants: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			evaluation_indicator: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			evaluation_method: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			is_finished: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			report: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: "activities",
			timestamps: false,
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "id" }],
				},
				{
					name: "creator_id",
					using: "BTREE",
					fields: [{ name: "creator_id" }],
				},
				{
					name: "theme_id",
					using: "BTREE",
					fields: [{ name: "theme_id" }],
				},
				{
					name: "school_id",
					using: "BTREE",
					fields: [{ name: "school_id" }],
				},
			],
		}
	);
};
