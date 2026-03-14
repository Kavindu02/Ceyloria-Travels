const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Accommodation = sequelize.define('Accommodation', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  images: {
    type: DataTypes.JSON, // Array of image URLs
    defaultValue: []
  },
  packages: {
    type: DataTypes.JSON, // Array of package objects
    defaultValue: []
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'accommodations',
  timestamps: true
});

module.exports = Accommodation;
