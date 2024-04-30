const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const User = require("./user.model");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.UUID,
    default: DataTypes.UUIDV4,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
});

User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

module.exports = Cart;
