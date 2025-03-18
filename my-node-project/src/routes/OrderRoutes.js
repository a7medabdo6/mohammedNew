const express = require('express');
const router = express.Router();
const {  createOrder ,getUserOrders,getAllOrders} = require('../controllers/OrderController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware ');

// إضافة منتج إلى السلة

// إضافة منتج إلى المفضلة
router.post('/', authMiddleware, createOrder);

router.get('/', authMiddleware, adminMiddleware, getAllOrders);

// الحصول على طلبات المستخدم الخاصة به
router.get('/user', authMiddleware, getUserOrders);
module.exports = router;
