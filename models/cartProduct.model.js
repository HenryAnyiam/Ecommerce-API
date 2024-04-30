const { DataTypes } = require("sequelize");
const Cart = require("./cart.model");
const Product = require("./product.model");

const CartProduct = sequelize.define("CartProduct", {
  cartId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Cart,
      key: "id",
    },
  },

  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },

  quantity: {
    type: DataTypes.INTEGER,
    default: 1,
  }
});

Cart.belongsToMany(Product, { through: CartProduct });
Product.belongsToMany(Cart, { through: CartProduct });

module.exports = CartProduct;
