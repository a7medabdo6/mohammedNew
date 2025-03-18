const express = require('express');
const router = express.Router();
const { addToCart,updateCartQuantity,removeFromCart } = require('../controllers/CartController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware ');

// إضافة منتج إلى السلة
router.post('/', authMiddleware, addToCart);
router.put('/update', authMiddleware, updateCartQuantity);
router.delete('/remove', authMiddleware, removeFromCart);



// إضافة منتج إلى المفضلة

module.exports = router;
