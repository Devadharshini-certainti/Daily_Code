const express = require('express');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    res.status(200).json({ success: true, userId, items: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:userId/add', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, price } = req.body;
    if (!productId || !quantity || !price) {
      return res.status(400).json({ success: false, message: 'productId, quantity, and price are required' });
    }
    res.status(201).json({ success: true, message: 'Item added to cart', userId, productId, quantity, price });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:userId/update', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ success: false, message: 'productId and quantity are required' });
    }
    res.status(200).json({ success: true, message: 'Cart updated', userId, productId, quantity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    res.status(200).json({ success: true, message: 'Item removed from cart', userId, productId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:userId/clear', async (req, res) => {
  try {
    const { userId } = req.params;
    res.status(200).json({ success: true, message: 'Cart cleared', userId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
