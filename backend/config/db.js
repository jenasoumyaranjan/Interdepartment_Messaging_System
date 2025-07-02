const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const db = {}; // ✅ Yeh line missing thi
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Load models here
db.Message = require('../models/Message')(sequelize, DataTypes);
db.User = require('../models/User')(sequelize, DataTypes); // If you have User model

module.exports = db;
