const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const User = require("./user.model");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    default: DataTypes.UUIDV4,
    primaryKey: true,
  },

  date: {
    type: DataTypes.DATETIME,
    default: DataTypes.NOW,
  },

  totalPrice: {
    type: DataTypes.INTEGER,
    required: true,
  },

  status: {
    type: DataTypes.ENUM,
    values: ["pending", "shipped", "delivered"],
    default: "pending",
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userid" });

module.exports = Order;
