const Cart = require('../models/Cart');

const computeTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(200).json({ success: true, userId, items: [], total: 0 });
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, price, name } = req.body;

    if (!productId || !quantity || !price) {
      return res.status(400).json({ success: false, message: 'productId, quantity, and price are required' });
    }

    let cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, name, quantity, price }],
        total: price * quantity,
      });
    } else {
      const items = [...cart.items];
      const existing = items.findIndex((i) => i.productId === productId);

      if (existing >= 0) {
        items[existing].quantity += quantity;
      } else {
        items.push({ productId, name, quantity, price });
      }

      await cart.update({ items, total: computeTotal(items) });
    }

    res.status(201).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      return res.status(400).json({ success: false, message: 'productId and quantity are required' });
    }

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const items = cart.items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    ).filter((i) => i.quantity > 0);

    await cart.update({ items, total: computeTotal(items) });

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const items = cart.items.filter((i) => i.productId !== productId);
    await cart.update({ items, total: computeTotal(items) });

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    await cart.update({ items: [], total: 0 });
    res.status(200).json({ success: true, message: 'Cart cleared', userId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
