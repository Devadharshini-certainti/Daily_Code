const { validationResult, body, param } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const createOrderRules = [
  body('userId').notEmpty().withMessage('userId is required'),
  body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
  body('items.*.productId').notEmpty().withMessage('each item must have a productId'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('each item quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('each item price must be a positive number'),
];

const updateStatusRules = [
  param('orderId').isUUID().withMessage('orderId must be a valid UUID'),
  body('status')
    .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .withMessage('invalid status value'),
];

const addItemRules = [
  body('productId').notEmpty().withMessage('productId is required'),
  body('quantity').isInt({ min: 1 }).withMessage('quantity must be at least 1'),
  body('price').isFloat({ min: 0 }).withMessage('price must be a positive number'),
];

const updateItemRules = [
  body('productId').notEmpty().withMessage('productId is required'),
  body('quantity').isInt({ min: 0 }).withMessage('quantity must be 0 or more'),
];

module.exports = {
  handleValidation,
  createOrderRules,
  updateStatusRules,
  addItemRules,
  updateItemRules,
};
