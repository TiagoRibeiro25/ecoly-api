const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"users",
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			photo: {
				type: DataTypes.TEXT("long"),
				allowNull: false,
			},
			role_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "role",
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
			internal_id: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			course: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			year: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: "users",
			timestamps: false,
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "id" }],
				},
				{
					name: "school_id",
					using: "BTREE",
					fields: [{ name: "school_id" }],
				},
				{
					name: "role_id",
					using: "BTREE",
					fields: [{ name: "role_id" }],
				},
			],
		}
	);
};
