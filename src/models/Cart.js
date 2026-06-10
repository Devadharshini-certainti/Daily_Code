const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'carts',
  timestamps: true,
});

module.exports = Cart;
