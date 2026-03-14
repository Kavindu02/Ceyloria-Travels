const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const User = require('./user.js');

const Gallery = sequelize.define('Gallery', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'galleries',
  timestamps: true
});

Gallery.belongsTo(User, { foreignKey: 'createdBy' });
User.hasMany(Gallery, { foreignKey: 'createdBy' });

module.exports = Gallery;
