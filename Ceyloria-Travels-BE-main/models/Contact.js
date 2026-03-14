const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Contact = sequelize.define('Contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  adults: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  kids: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  infants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  arrivalDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  departureDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'contacts',
  timestamps: true
});

module.exports = Contact;
