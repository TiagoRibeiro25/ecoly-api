const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"news_letter",
		{
			email: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},

			delete_key: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
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
					fields: [{ name: "delete_key" }],
				},
			],
		}
	);
};
