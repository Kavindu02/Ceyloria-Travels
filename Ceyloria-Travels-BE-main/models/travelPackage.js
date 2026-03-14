const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const TravelPackage = sequelize.define('TravelPackage', {
  title: {
    type: DataTypes.STRING,
    defaultValue: "Untitled Package"
  },
  shortDescription: {
    type: DataTypes.TEXT,
    defaultValue: ""
  },
  description: {
    type: DataTypes.TEXT('long'),
    defaultValue: ""
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  ratingText: {
    type: DataTypes.STRING,
    defaultValue: "4.9/5"
  },
  starCount: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  duration: {
    type: DataTypes.STRING,
    defaultValue: ""
  },
  citiesCovered: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  highlights: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  itinerary: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  inclusions: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  exclusions: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isCurated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'travel_packages',
  timestamps: true
});

module.exports = TravelPackage;
