const Order = require('../models/Order');
const { publishEvent } = require('../../kafka/producer');

const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'userId and items are required' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({ userId, items, total, shippingAddress });

    await publishEvent('order-events', { type: 'ORDER_CREATED', orderId: order.id, userId, total });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.params.userId }, order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    await order.update({ status });

    await publishEvent('order-events', { type: 'ORDER_STATUS_UPDATED', orderId: order.id, status });

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ success: false, message: `Cannot cancel an order that is already ${order.status}` });
    }

    await order.update({ status: 'cancelled' });

    await publishEvent('order-events', { type: 'ORDER_CANCELLED', orderId: order.id, userId: order.userId });

    res.status(200).json({ success: true, message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, getOrder, getUserOrders, updateOrderStatus, cancelOrder };
