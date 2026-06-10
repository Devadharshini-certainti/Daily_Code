const express = require('express');
const router = express.Router();
const { getCart, addItem, updateItem, removeItem, clearCart } = require('../controllers/cartController');

router.get('/:userId', getCart);
router.post('/:userId/add', addItem);
router.put('/:userId/update', updateItem);
router.delete('/:userId/remove/:productId', removeItem);
router.delete('/:userId/clear', clearCart);

module.exports = router;
