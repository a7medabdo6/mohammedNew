const express = require('express');
const router = express.Router();
const {  addToFavorites ,removeFromFavorites} = require('../controllers/FavoriteController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware ');

// إضافة منتج إلى السلة

// إضافة منتج إلى المفضلة
router.post('/', authMiddleware, addToFavorites);
router.delete('/remove', authMiddleware, removeFromFavorites);


module.exports = router;
