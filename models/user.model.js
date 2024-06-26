const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");


const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  username: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
    validate: {
      len: [3, 20],
    },
  },

  email: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
    validate: {
      is: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
  },

  emailVerify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  password: {
    type: DataTypes.STRING,
    required: true,
  },

  role: {
    type: DataTypes.ENUM,
    values: ['customer', 'admin'],
    defaultValue: 'customer',
  },

  phone: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
    validate: {
      is: /^[0-9]{10}$/,
    },
  },

  phoneVerify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

});

module.exports = User;
