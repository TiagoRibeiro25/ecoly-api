const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"activity_image",
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			activity_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "activities",
					key: "id",
				},
			},
			img: {
				type: DataTypes.TEXT("long"),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "activity_image",
			timestamps: false,
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "id" }],
				},
				{
					name: "activity_id",
					using: "BTREE",
					fields: [{ name: "activity_id" }],
				},
			],
		}
	);
};
