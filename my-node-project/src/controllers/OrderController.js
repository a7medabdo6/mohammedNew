const User = require('../models/User');
const Product = require('../models/Product');
const { Order } = require('../models/Order');

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { address, paymentMethod } = req.body;

        const user = await User.findById(userId).populate('cart.product');
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        if (user.cart.length === 0) {
            return res.status(400).json({ message: 'السلة فارغة، لا يمكن إنشاء طلب' });
        }

        const totalAmount = user.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        const order = new Order({
            user: userId,
            items: user.cart.map(item => ({ product: item.product._id, quantity: item.quantity })),
            totalAmount,
            address,
            paymentMethod
        });

        await order.save();
        user.orders.push(order._id); 
        user.cart = [];
        await user.save();

        res.status(201).json({ message: 'تم إنشاء الطلب بنجاح', order });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {}; // تطبيق الفلترة فقط إذا تم تمرير الحالة في الاستعلام

        const orders = await Order.find(filter).populate('user', 'name email');
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

// تحديث حالة الطلب
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // التحقق من أن الحالة المدخلة صحيحة
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'حالة غير صحيحة' });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'الطلب غير موجود' });
        }

        res.status(200).json({ message: 'تم تحديث حالة الطلب بنجاح', order });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};


const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

module.exports = { createOrder,getUserOrders,getAllOrders ,updateOrderStatus};
