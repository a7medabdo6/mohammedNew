const User = require('../models/User');
const Product = require('../models/Product');



const addToFavorites = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });

        if (user.favorites.includes(productId)) {
            return res.status(400).json({ message: 'المنتج موجود بالفعل في المفضلة' });
        }

        user.favorites.push(productId);
        await user.save();

        res.status(200).json({ message: 'تمت إضافة المنتج إلى المفضلة بنجاح', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

const removeFromFavorites = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        user.favorites = user.favorites.filter(id => id.toString() !== productId);
        await user.save();

        res.status(200).json({ message: 'تمت إزالة المنتج من المفضلة بنجاح', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};

module.exports = {  addToFavorites, removeFromFavorites };