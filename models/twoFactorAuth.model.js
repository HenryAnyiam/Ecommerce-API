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
    default: false,
  },

  secret: {
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
