const Review = require('../models/Review');
const Product = require('../models/Product');

// ✅ إضافة مراجعة جديدة (حالتها `false` افتراضيًا)
const addReview = async (req, res) => {
    try {
        const { productId, user, rating, comment } = req.body;

        // ✅ التأكد من إرسال جميع البيانات المطلوبة
        if (!productId || !user || !rating || !comment?.ar || !comment?.en) {
            return res.status(400).json({ message: '❌ جميع الحقول مطلوبة باللغة العربية والإنجليزية' });
        }

        // ✅ التحقق من صحة التقييم (يجب أن يكون بين 1 و 5)
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: '❌ يجب أن يكون التقييم بين 1 و 5' });
        }

        // ✅ التحقق من وجود المنتج
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: '❌ المنتج غير موجود' });
        }

        // ✅ إنشاء المراجعة
        const newReview = new Review({
            product: productId,
            user,
            rating,
            comment, // يدعم اللغتين العربية والإنجليزية
            status: false
        });

        await newReview.save();
        res.status(201).json({ message: '✅ تم إضافة المراجعة بنجاح، في انتظار موافقة الأدمن', review: newReview });

    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء إضافة المراجعة', error: error.message });
    }
};


// ✅ موافقة الأدمن على المراجعة لتصبح مرئية
const approveReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        // البحث عن التقييم
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: '❌ التقييم غير موجود' });
        }

        // التأكد من أنه غير موافق عليه مسبقًا
        if (review.status) {
            return res.status(400).json({ message: '⚠️ التقييم تمت الموافقة عليه مسبقًا' });
        }

        // تحديث حالة المراجعة إلى "معتمدة"
        review.status = true;
        await review.save();

        // إضافة التقييم إلى المنتج
        await Product.findByIdAndUpdate(review.product, {
            $push: { reviews: review._id }
        });

        res.json({ message: '✅ تم الموافقة على التقييم وإضافته للمنتج', review });
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء الموافقة على التقييم', error: error.message });
    }
};


const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId, status: true }); // فقط المراجعات المقبولة
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء استرجاع المراجعات', error: error.message });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const { lang } = req.query; // استقبال اللغة من الـ request (مثال: ?lang=ar أو ?lang=en)

        // جلب جميع التقييمات مع بيانات المنتج
        const reviews = await Review.find().populate('product', 'name price');

        // تحويل الاستجابة وفقًا للغة المحددة
        const formattedReviews = reviews.map(review => ({
            _id: review._id,
            product: {
                name: review.product.name[lang] || review.product.name.en, // اسم المنتج حسب اللغة
                price: review.product.price
            },
            user: review.user,
            rating: review.rating,
            comment: review.comment[lang] || review.comment.en, // التعليق حسب اللغة
            status: review.status,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt
        }));

        res.json(formattedReviews);
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء استرجاع المراجعات', error: error.message });
    }
};




module.exports = { addReview, approveReview,getReviewsByProduct,getAllReviews };
