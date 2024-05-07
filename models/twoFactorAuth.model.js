const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const User = require("./user.model");


const TwoFactorAuth = sequelize.define("TwoFactorAuth", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  secret: {
    type: DataTypes.STRING,
  },

  phoneSecret: {
    type: DataTypes.STRING,
  },

  emailSecret: {
    type: DataTypes.STRING,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

User.hasOne(TwoFactorAuth, { foreignKey: "userId" });
TwoFactorAuth.belongsTo(User, { foreignKey: "userId" });

module.exports = TwoFactorAuth;
