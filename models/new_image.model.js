const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"new_image",
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			new_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "news",
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
			tableName: "new_image",
			timestamps: false,
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "id" }],
				},
				{
					name: "new_id",
					using: "BTREE",
					fields: [{ name: "new_id" }],
				},
			],
		}
	);
};
