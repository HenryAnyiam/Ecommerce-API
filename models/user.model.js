const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");


const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    default: DataTypes.UUIDV4,
    primaryKey: true,
  },

  username: {
    type: DataTypes.String,
    required: true,
    unique: true,
    validate: {
      len: [3, 20],
    },
  },

  email: {
    type: DataTypes.String,
    required: true,
    unique: true,
    validate: {
      is: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
  },

  password: {
    type: DataTypes.String,
    required: true,
  },

  role: {
    type: DataTypes.ENUM,
    values: ['customer', 'admin'],
    default: 'customer',
  },

  phone: {
    type: DataTypes.String,
    required: true,
    unique: true,
    validate: {
      is: /^[0-9{10}$/,
    },
  },
});

module.exports = User;
