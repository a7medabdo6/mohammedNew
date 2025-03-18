const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        ar: { type: String, required: true },
        en: { type: String, required: true }
    },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
