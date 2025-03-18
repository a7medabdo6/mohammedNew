const express = require('express');
const router = express.Router();
const { createProduct, updateProduct,getProductById,getProductsByCategory, deleteProduct, searchProductByName, getAllProducts } = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware ');

// 🟢 إنشاء منتج جديد
router.post('/', authMiddleware,adminMiddleware, createProduct);

// 🟡 تعديل المنتج
router.put('/:productId', authMiddleware,adminMiddleware, updateProduct);

// 🔴 حذف المنتج
router.delete('/:id', authMiddleware,adminMiddleware, deleteProduct);

// 🔍 البحث عن منتج بالاسم
router.get('/search', searchProductByName);

// 📋 جلب جميع المنتجات
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductsByCategory);

// 🔹 جلب المنتجات حسب الفئة الفرعية فقط
router.get('/subcategory/:subcategoryId', getProductsByCategory);

// 🔹 جلب المنتجات حسب الفئة الرئيسية والفرعية معًا
router.get('/category/:categoryId/subcategory/:subcategoryId', getProductsByCategory);



module.exports = router;
