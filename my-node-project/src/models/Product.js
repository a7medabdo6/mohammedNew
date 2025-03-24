const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        ar: { type: String, required: true, unique: true },
        en: { type: String, required: true, unique: true }
    },
    description: {
        ar: { type: String, required: true },
        en: { type: String, required: true }
    },
    content: { 
        ar: { type: String, required: false },
        en: { type: String, required: false }
    }, // محتوى إضافي للمنتج
    images: [{ type: String, required: true }], // قائمة بالصور كروابط
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    status: { 
        type: String, 
        enum: ['in_stock', 'low_stock', 'out_of_stock'], 
        required: true,
        default: 'in_stock'
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // الفئة الرئيسية
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false }, // الفئة الفرعية (اختيارية)
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],

    rating: { type: Number, default: 0, min: 0, max: 5 }, // التقييم الافتراضي 0 حتى 5 نجوم
    isOffer: { type: Boolean, default: false }, // هل المنتج عليه عرض؟
    isTopSelling: { type: Boolean, default: false }, // هل المنتج من الأكثر مبيعًا؟
    isTopRating: { type: Boolean, default: false }, // هل المنتج من الأعلى تقييمًا؟
    isTrending: { type: Boolean, default: false },

    priceBeforeOffer: { 
        type: Number, 
        min: 0, 
        required: function () { return this.isOffer; } // مطلوب فقط إذا كان isOffer = true
    },
    
    gender: { 
        type: String, 
        enum: ['male', 'female', 'unisex'], 
        required: false, 
        default: 'unisex' 
    },
    createdBy: { type: String, required: true }, // 👈 تغيير الـ ObjectId إلى String


}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
