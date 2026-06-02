const express = require('express');

const router = express.Router();
const getCart = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cart fetched successfully',
    data: []
  });
};

const addToCart = (req, res) => {
  const { restaurantId, menuItemId, name, price, quantity } = req.body;

  if (!restaurantId) {
    return res.status(400).json({
      success: false,
      message: 'restaurantId is required'
    });
  }

  if (!menuItemId) {
    return res.status(400).json({
    success: false,
     message: 'menuItemId is required'
    });
  }

  if (!name) {
    return res.status(400).json({
   success: false,
 message: 'name is required'
    });
  }

  if (!price) {
    return res.status(400).json({
      success: false,
      message: 'price is required'
    });
  }
  res.status(201).json({
    success: true,
    message: 'Item added to cart',
    data: {
    restaurantId,
   menuItemId,
  name,
     price,
    quantity: quantity || 1
    }
  });
};
const updateCartItem = (req, res) => {
  const { menuItemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: 'quantity must be greater than 0'
    });
  }
  res.status(200).json({
    success: true,
    message: 'Cart item updated',
    data: {
      menuItemId,
      quantity
    }
  });
};
const removeCartItem = (req, res) => {
  const { menuItemId } = req.params;

  res.status(200).json({
    success: true,
    message: 'Cart item removed',
    data: {
      menuItemId
    }
  });
};
const clearCart = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully'
  });
};
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:menuItemId', updateCartItem);
router.delete('/:menuItemId', removeCartItem);
router.delete('/', clearCart);
module.exports = router;
