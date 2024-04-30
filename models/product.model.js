const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");


const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    default: DataTypes.UUIDV4,
    primaryKey: true,
  },
});


module.exports = Product;
