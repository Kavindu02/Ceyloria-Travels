const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Activity = sequelize.define('Activity', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
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
  items: {
    type: DataTypes.JSON, // Array of item objects
    defaultValue: []
  }
}, {
  tableName: 'activities',
  timestamps: true
});

module.exports = Activity;
