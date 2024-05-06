const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const User = require("./user.model");


const Address = sequelize.define("Address", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  type: {
    type: DataTypes.ENUM,
    values: ['home', 'work'],
    defaultValue: 'home',
  },

  street: {
    type: DataTypes.STRING,
    required: true,
  },

  city: {
    type: DataTypes.STRING,
    required: true,
  },

  state: {
    type: DataTypes.STRING,
    required: true,
  },

  country: {
    type: DataTypes.STRING,
    required: true,
  },

  postalCode: {
    type: DataTypes.STRING,
    required: true,
  },

  default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

User.hasMany(Address, { foreignKey: "userId" });
Address.belongsTo(User, { foreignKey: "userId" });

module.exports = Address;
