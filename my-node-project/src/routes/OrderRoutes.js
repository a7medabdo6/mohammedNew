const express = require('express');
const router = express.Router();
const {  createOrder ,getUserOrders,getAllOrders,updateOrderStatus,deleteOrder,getOrderDetails} = require('../controllers/OrderController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware ');

// إضافة منتج إلى السلة

// إضافة منتج إلى المفضلة
router.post('/', authMiddleware, createOrder);

router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.put('/:id', authMiddleware, adminMiddleware, updateOrderStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteOrder);

router.get('/:id', getOrderDetails);


// الحصول على طلبات المستخدم الخاصة به
router.get('/user', authMiddleware, getUserOrders);
module.exports = router;
