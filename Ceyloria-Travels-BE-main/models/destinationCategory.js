const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const DestinationCategory = sequelize.define('DestinationCategory', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tagline: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destinations: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'destination_categories',
  timestamps: true
});

module.exports = DestinationCategory;
