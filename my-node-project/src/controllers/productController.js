const Product = require('../models/Product');
const Review = require('../models/Review');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// ✅ إنشاء منتج جديد
const createProduct = async (req, res) => {
    try {
        const { 
            nameAr, nameEn, 
            descriptionAr, descriptionEn, 
            images, quantity, price, 
            categoryId, subcategoryId, 
            isOffer, priceBeforeOffer, 
            isTopSelling, isTopRating, isTrending, rating 
        } = req.body;

        // التحقق من الحقول المطلوبة
        if (!nameAr || !nameEn || !descriptionAr || !descriptionEn || !price || !images || !quantity || !categoryId) {
            return res.status(400).json({ message: '❌ جميع الحقول مطلوبة' });
        }

        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: '❌ يجب إرسال صورة واحدة على الأقل للمنتج' });
        }

        if (price <= 0) {
            return res.status(400).json({ message: '❌ السعر يجب أن يكون قيمة موجبة' });
        }

        // إذا كان isOffer = true، يجب إدخال السعر قبل العرض
        if (isOffer && (!priceBeforeOffer || priceBeforeOffer <= price)) {
            return res.status(400).json({ message: '❌ يجب إدخال سعر قبل العرض ويجب أن يكون أعلى من السعر الحالي' });
        }

        // التحقق من الفئة الرئيسية
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ message: '❌ الفئة الرئيسية غير موجودة' });
        }

        // التحقق من الفئة الفرعية
        let subcategory = null;
        if (subcategoryId) {
            subcategory = await Category.findById(subcategoryId);
            if (!subcategory || subcategory.parent.toString() !== categoryId) {
                return res.status(400).json({ message: '❌ الفئة الفرعية غير صحيحة' });
            }
        }

        // منع تكرار اسم المنتج
        const existingProduct = await Product.findOne({ $or: [{ "name.ar": nameAr }, { "name.en": nameEn }] });
        if (existingProduct) {
            return res.status(400).json({ message: '❌ اسم المنتج موجود بالفعل، يُرجى اختيار اسم آخر' });
        }

        // إنشاء المنتج مع الحقول الجديدة
        const newProduct = new Product({
            name: { ar: nameAr, en: nameEn },
            description: { ar: descriptionAr, en: descriptionEn },
            images,
            price,
            priceBeforeOffer: isOffer ? priceBeforeOffer : null,
            isOffer: isOffer || false,
            isTopSelling: isTopSelling || false,
            isTopRating: isTopRating || false,
            isTrending: isTrending || false,
            rating: rating || 0,
            quantity,
            category: categoryId,
            subcategory: subcategoryId || null
        });

        await newProduct.save();
        res.status(201).json({ message: '✅ تم إنشاء المنتج بنجاح', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء إنشاء المنتج', error: error.message });
    }
};



const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        // التحقق مما إذا كان المنتج موجودًا
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: '❌ المنتج غير موجود' });
        }

        // التحقق من صحة الحقول العددية (السعر، الكمية، السعر قبل العرض)
        if (updates.price !== undefined && updates.price < 0) {
            return res.status(400).json({ message: '❌ السعر يجب أن يكون رقمًا موجبًا' });
        }
        if (updates.quantity !== undefined && updates.quantity < 0) {
            return res.status(400).json({ message: '❌ الكمية يجب أن تكون رقمًا موجبًا' });
        }
        if (updates.priceBeforeOffer !== undefined && updates.priceBeforeOffer < 0) {
            return res.status(400).json({ message: '❌ السعر قبل العرض يجب أن يكون رقمًا موجبًا' });
        }

        // إذا كان isOffer = true، يجب التحقق من أن السعر قبل العرض أعلى من السعر الحالي
        if (updates.isOffer) {
            if (!updates.priceBeforeOffer || updates.priceBeforeOffer <= (updates.price || product.price)) {
                return res.status(400).json({ message: '❌ يجب أن يكون السعر قبل العرض أعلى من السعر الحالي' });
            }
        } else {
            updates.priceBeforeOffer = null; // إذا لم يكن عليه عرض، لا يجب أن يكون هناك سعر قبل العرض
        }

        // تحديث جميع الحقول المطلوبة
        Object.keys(updates).forEach((key) => {
            product[key] = updates[key];
        });

        // حفظ التعديلات في قاعدة البيانات
        await product.save();

        res.json({ message: '✅ تم تحديث المنتج بنجاح', product });
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء تحديث المنتج', error: error.message });
    }
};




// ✅ حذف المنتج والمراجعات الخاصة به
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔎 البحث عن المنتج بـ _id:", id);

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: '❌ المنتج غير موجود في قاعدة البيانات' });
        }

        await Product.findByIdAndDelete(id);
        await Review.deleteMany({ product: id });

        res.json({ message: '✅ تم حذف المنتج والمراجعات الخاصة به' });
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء حذف المنتج', error: error.message });
    }
};

// ✅ البحث عن منتج بالاسم
const searchProductByName = async (req, res) => {
    try {
        const { name } = req.query;

        const products = await Product.find({
            $or: [
                { 'name.ar': { $regex: name, $options: 'i' } },
                { 'name.en': { $regex: name, $options: 'i' } }
            ]
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء البحث', error: error.message });
    }
};

// ✅ استرجاع جميع المنتجات
const getAllProducts = async (req, res) => {
    try {
        // ✅ استخدام populate() لجلب التقييمات، الفئة، والفئة الفرعية
        const products = await Product.find()
            .populate({
                path: 'reviews',
                model: 'Review',
                select: 'user rating comment createdAt' // تحديد الحقول المطلوبة فقط
            })
            .populate({
                path: 'category',
                model: 'Category',
                select: 'name description' // جلب اسم ووصف الفئة
            })
            .populate({
                path: 'subcategory',
                model: 'Category',
                select: 'name description' // جلب اسم ووصف الفئة الفرعية
            });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء استرجاع المنتجات', error: error.message });
    }
};


const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ جلب المنتج مع التقييمات والفئة والفئة الفرعية
        const product = await Product.findById(id)
            .populate({
                path: 'reviews',
                model: 'Review',
                select: 'user rating comment createdAt'
            })
            .populate({
                path: 'category',
                model: 'Category',
                select: 'name description'
            })
            .populate({
                path: 'subcategory',
                model: 'Category',
                select: 'name description'
            });

        if (!product) {
            return res.status(404).json({ message: '❌ المنتج غير موجود' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء استرجاع المنتج', error: error.message });
    }
};


// ✅ جلب المنتجات حسب الفئة الرئيسية أو الفرعية



// ✅ البحث عن المنتجات حسب الفئة أو الفئة الفرعية
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.params;

        let filter = {};

        // ✅ التحقق من صحة الـ ObjectId قبل البحث
        if (categoryId) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({ message: '❌ categoryId غير صالح' });
            }
            filter.category = categoryId;
        }

        if (subcategoryId) {
            if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
                return res.status(400).json({ message: '❌ subcategoryId غير صالح' });
            }
            filter.subcategory = subcategoryId;
        }

        // 🔍 البحث عن المنتجات باستخدام الفلاتر
        const products = await Product.find(filter).populate('category subcategory');

        res.json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء استرجاع المنتجات', error: error.message });
    }
};







module.exports = { createProduct, updateProduct,getProductsByCategory, deleteProduct, searchProductByName, getAllProducts ,getProductById};
