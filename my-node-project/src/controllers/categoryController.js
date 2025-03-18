const Category = require('../models/Category');
const User = require('../models/User');
const Product = require('../models/Product'); // تأكد من أن المسار صحيح

const createMainCategory = async (req, res) => {
    try {
        const { nameAr, nameEn } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: '🚫 فقط المسؤولين يمكنهم إنشاء الفئات الرئيسية.' });
        }

        if (!nameAr || !nameEn) {
            return res.status(400).json({ message: '❌ يجب إدخال اسم الفئة باللغتين العربية والإنجليزية.' });
        }

        // التحقق من وجود فئة بنفس الاسم
        const existingCategory = await Category.findOne({
            $or: [{ "name.ar": nameAr }, { "name.en": nameEn }]
        });

        if (existingCategory) {
            return res.status(400).json({ message: '❌ الفئة بهذا الاسم موجودة بالفعل.' });
        }

        const newCategory = new Category({
            name: { ar: nameAr, en: nameEn },
            parent: null
        });

        await newCategory.save();

        res.status(201).json({ message: '✅ تم إنشاء الفئة الرئيسية بنجاح', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء إنشاء الفئة الرئيسية', error: error.message });
    }
};
const createSubCategory = async (req, res) => {
    try {
        const { nameAr, nameEn, parentId } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: '🚫 فقط المسؤولين يمكنهم إنشاء الفئات الفرعية.' });
        }

        if (!nameAr || !nameEn || !parentId) {
            return res.status(400).json({ message: '❌ يجب إدخال اسم الفئة باللغتين العربية والإنجليزية وتحديد الفئة الرئيسية.' });
        }

        // البحث عن الفئة الرئيسية
        const parentCategory = await Category.findById(parentId);
        if (!parentCategory) {
            return res.status(400).json({ message: '❌ الفئة الرئيسية غير موجودة. يرجى تحديد فئة رئيسية صحيحة.' });
        }

        // التأكد من أن الفئة الفرعية غير موجودة مسبقًا تحت الفئة الرئيسية
        const existingSubCategory = await Category.findOne({
            parent: parentId,
            $or: [{ "name.ar": nameAr }, { "name.en": nameEn }]
        });

        if (existingSubCategory) {
            return res.status(400).json({ message: '❌ الفئة الفرعية بهذا الاسم موجودة بالفعل تحت هذه الفئة الرئيسية.' });
        }

        // إنشاء الفئة الفرعية مع تعيين الفئة الرئيسية فقط وعدم إنشائها كفئة مستقلة
        const newSubCategory = new Category({
            name: { ar: nameAr, en: nameEn },
            parent: parentId // ✅ تعيين الفئة الرئيسية فقط
        });

        await newSubCategory.save();

        // تحديث الفئة الرئيسية بإضافة الفئة الفرعية لها
        parentCategory.subcategories.push(newSubCategory._id);
        await parentCategory.save();

        res.status(201).json({ message: '✅ تم إنشاء الفئة الفرعية بنجاح', subcategory: newSubCategory });
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء إنشاء الفئة الفرعية', error: error.message });
    }
};





const getCategories = async (req, res) => {
    try {
        const { lang = 'en' } = req.query; // اللغة الافتراضية هي الإنجليزية

        // جلب الفئات الرئيسية فقط
        const categories = await Category.find({ parent: null })
            .populate({
                path: 'subcategories',
                select: 'name subcategories',
                populate: { path: 'subcategories', select: 'name' } // دعم التداخل المتعدد
            });

        // إذا لم تكن هناك فئات، إرجاع مصفوفة فارغة
        if (!categories.length) {
            return res.json([]);
        }

        // حساب عدد المنتجات في كل فئة وفئة فرعية
        const formattedCategories = await Promise.all(
            categories.map(async (category) => {
                const categoryProductCount = await Product.countDocuments({ category: category._id }).catch(() => 0);

                const formattedSubcategories = await Promise.all(
                    category.subcategories.map(async (sub) => {
                        const subcategoryProductCount = await Product.countDocuments({ subcategory: sub._id }).catch(() => 0);

                        const formattedSubSubcategories = await Promise.all(
                            sub.subcategories.map(async (subSub) => {
                                const subSubcategoryProductCount = await Product.countDocuments({ subcategory: subSub._id }).catch(() => 0);

                                return {
                                    _id: subSub._id,
                                    name: subSub.name[lang] || subSub.name.en,
                                    productCount: subSubcategoryProductCount
                                };
                            })
                        );

                        return {
                            _id: sub._id,
                            name: sub.name[lang] || sub.name.en,
                            productCount: subcategoryProductCount,
                            subcategories: formattedSubSubcategories
                        };
                    })
                );

                return {
                    _id: category._id,
                    name: category.name[lang] || category.name.en,
                    productCount: categoryProductCount,
                    subcategories: formattedSubcategories
                };
            })
        );

        res.json(formattedCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};





const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // التأكد من أن المستخدم أدمن
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: '🚫 الوصول مرفوض! فقط المسؤولين يمكنهم حذف الفئات.' });
        }

        // البحث عن الفئة المطلوبة
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: '❌ الفئة غير موجودة.' });
        }

        // حذف جميع الفئات الفرعية المرتبطة بها
        await Category.deleteMany({ parent: id });

        // حذف الفئة نفسها
        await Category.findByIdAndDelete(id);
        
        res.json({ message: '✅ تم حذف الفئة وجميع الفئات الفرعية المرتبطة بها بنجاح' });
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء حذف الفئة', error: error.message });
    }
};


module.exports = { createSubCategory,createMainCategory, getCategories,deleteCategory };