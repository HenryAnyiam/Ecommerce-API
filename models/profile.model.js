const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const User = require("./user.model");


const Profile = sequelize.define("Profile", {
  id: {
    type: DataTypes.UUID,
    default: DataTypes.UUIDV4,
    primaryKey: true,
  },

  firstName: {
    type: DataTypes.STRING,
  },

  lastName: {
    type: DataTypes.STRING,
  },

  photo: {
    type: DataTypes.STRING,
    default: "default_photo_url",
    allowNull: false,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

User.hasOne(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

module.exports = Profile;
