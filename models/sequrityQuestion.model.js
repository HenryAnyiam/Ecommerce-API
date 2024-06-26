const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const User = require("./user.model");


const SequrityQuestion = sequelize.define("SequrityQuestion", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
    primaryKey: true,
  },

  question: {
    type: DataTypes.ENUM,
    values:  [
      "What is your mother's maiden name?",
      "What was the name of your first pet?",
      "What city were you born in?",
      "What is your favorite movie?"
    ],
  },

  answer: {
    types: DataTypes.STRING,
    required: true,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

User.hasOne(SequrityQuestion, { foreignKey: "userId" });
SequrityQuestion.belongsTo(User, { foreignKey: "userId" });

module.exports = SequrityQuestion;
