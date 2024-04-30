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
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

const User.hasOne(Profile, { foreignKey: "userId" });
const Profile.belongsTo(User, { foreignKey: "userId" });

module.exports = Profile;
