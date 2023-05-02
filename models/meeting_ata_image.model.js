const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"meeting_ata_image",
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			meeting_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "meetings",
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
			tableName: "meeting_ata_image",
			timestamps: false,
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "id" }],
				},
				{
					name: "meeting_id",
					using: "BTREE",
					fields: [{ name: "meeting_id" }],
				},
			],
		}
	);
};
