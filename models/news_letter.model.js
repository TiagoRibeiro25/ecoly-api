const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"news_letter",
		{
			email: {
				type: DataTypes.STRING(255),
				allowNull: false,
				primaryKey: true,
			},
		},
		{
			sequelize,
			tableName: "news_letter",
			timestamps: false,
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "email" }],
				},
			],
		}
	);
};
