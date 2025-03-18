const User = require('../models//User');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });

        const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        res.status(200).json({ message: 'تمت إضافة المنتج إلى السلة بنجاح', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};



const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'المنتج غير موجود في السلة' });
        }

        user.cart[itemIndex].quantity = quantity;
        await user.save();
        res.status(200).json({ message: 'تم تحديث الكمية بنجاح', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        user.markModified('cart');
        await user.save();

        res.status(200).json({ message: 'تمت إزالة المنتج من السلة بنجاح', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};


module.exports = { addToCart, updateCartQuantity, removeFromCart };