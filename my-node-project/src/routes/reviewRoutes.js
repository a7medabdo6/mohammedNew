const express = require('express');
const router = express.Router();
const { addReview, approveReview ,getReviewsByProduct,getAllReviews} = require('../controllers/reviewController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware ');

// ⭐️ إضافة مراجعة لمنتج معين
router.post('/', authMiddleware, addReview);

router.put('/:reviewId/approve', authMiddleware,adminMiddleware, approveReview);
router.get('/reviews/:productId', getReviewsByProduct);
router.get('/',authMiddleware, getAllReviews); // استرجاع جميع التقييمات


// ❌ حذف مراجعة
// router.delete('/:reviewId', authMiddleware, deleteReview);

module.exports = router;
