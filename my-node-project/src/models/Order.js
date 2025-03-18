const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    address: { type: String, required: true },
    paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'cash_on_delivery'], required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = {
    Order: mongoose.model('Order', orderSchema)
};
