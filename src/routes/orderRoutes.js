const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getUserOrders, updateOrderStatus, cancelOrder } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/:orderId', getOrder);
router.get('/user/:userId', getUserOrders);
router.put('/:orderId/status', updateOrderStatus);
router.delete('/:orderId/cancel', cancelOrder);

module.exports = router;
