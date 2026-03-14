const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Blog = sequelize.define('Blog', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  author: {
    type: DataTypes.STRING,
    defaultValue: "Ceyloria Team"
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  anchor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'blogs',
  timestamps: true
});

module.exports = Blog;
