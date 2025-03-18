const mongoose = require('mongoose');

const siteInfoSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },  // رقم الهاتف الأساسي
    phoneWhatsApp: { type: String, required: false }, // رقم الواتساب (اختياري)
    email: { type: String, required: false }, // البريد الإلكتروني (اختياري)
    headerText: { type: String, required: false }, // نص يظهر في الهيدر
    headerImages: [{ type: String, required: false }], // قائمة بالصور كروابط
    socialLinks: {
        facebook: { type: String, required: false },
        twitter: { type: String, required: false },
        instagram: { type: String, required: false },
        whatsapp: { type: String, required: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('SiteInfo', siteInfoSchema);
