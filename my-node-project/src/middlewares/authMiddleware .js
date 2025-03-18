const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ التحقق من أن المستخدم مسجل
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]; // استخراج التوكن
        if (!token) return res.status(401).json({ message: '❌ غير مصرح! التوكن مطلوب.' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) return res.status(401).json({ message: '❌ المستخدم غير موجود.' });

        next();
    } catch (error) {
        res.status(401).json({ message: '❌ توكن غير صالح.' });
    }
};

// ✅ التحقق من أن المستخدم مسؤول (Admin)
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: '❌ غير مصرح! هذه العملية تتطلب صلاحيات المسؤول.' });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
