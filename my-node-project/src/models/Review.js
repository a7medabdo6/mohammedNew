const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { 
        ar: { type: String, required: true },
        en: { type: String, required: true }
    },
    status: { type: Boolean, default: false } // الافتراضي: غير موافق عليه حتى يوافق الأدمن
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
