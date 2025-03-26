const express = require('express');
const { createSubCategory,createMainCategory,updateCategory, getCategories,deleteCategory, getCategoryById } = require('../controllers/categoryController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware ');

const router = express.Router();

router.post('/', authMiddleware,adminMiddleware, createMainCategory); // 🔐 يجب أن يكون المستخدم أدمن لإنشاء فئة
router.post('/sub/', authMiddleware,adminMiddleware, createSubCategory); // 🔐 يجب أن يكون المستخدم أدمن لإنشاء فئة

router.delete('/:id', authMiddleware,adminMiddleware, deleteCategory); // 🔐 يجب أن يكون المستخدم أدمن لإنشاء فئة
router.get('/:id', authMiddleware,adminMiddleware, getCategoryById); // 🔐 يجب أن يكون المستخدم أدمن لإنشاء فئة
router.put('/:id', authMiddleware,adminMiddleware, updateCategory); // 🔐 يجب أن يكون المستخدم أدمن لإنشاء فئة



router.get('/', getCategories); // 📌 يمكن جلب الفئات بأي لغة

module.exports = router;
