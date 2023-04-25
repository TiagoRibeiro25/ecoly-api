const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('meetings', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schools',
        key: 'id'
      }
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    room: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ata: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'meetings',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "creator_id",
        using: "BTREE",
        fields: [
          { name: "creator_id" },
        ]
      },
      {
        name: "school_id",
        using: "BTREE",
        fields: [
          { name: "school_id" },
        ]
      },
    ]
  });
};
