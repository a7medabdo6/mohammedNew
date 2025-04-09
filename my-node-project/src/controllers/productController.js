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
            isTopSelling, isTopRating, isTrending,
            rating, ...otherFields
        } = req.body;

        // التحقق من الحقول المطلوبة
        const requiredFields = { nameAr, nameEn, descriptionAr, descriptionEn, images, quantity, price, categoryId };
        if (Object.values(requiredFields).some(field => !field)) {
            return res.status(400).json({ message: '❌ جميع الحقول المطلوبة يجب إدخالها' });
        }

        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: '❌ يجب إرسال صورة واحدة على الأقل للمنتج' });
        }

        if (price <= 0) {
            return res.status(400).json({ message: '❌ السعر يجب أن يكون قيمة موجبة' });
        }

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

        // تحديد حالة المخزون تلقائيًا
        let status = 'in_stock';
        if (quantity === 0) status = 'out_of_stock';
        else if (quantity < 5) status = 'low_stock';

        // **إضافة اسم المستخدم بدلاً من الـ ID**
        const createdBy = `${req.user.firstName} ${req.user.lastName}`;

        // إنشاء المنتج
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
            status,
            category: categoryId,
            subcategory: subcategoryId || null,
            createdBy, // ✅ حفظ اسم المستخدم الذي أنشأ المنتج
            ...otherFields
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

        console.log("📩 البيانات المستلمة في السيرفر:", updates); // طباعة القيم المستلمة

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

        // تحديث الحقول النصية المعقدة (name و description)
        if (updates.nameAr || updates.nameEn) {
            product.name = {
                ar: updates.nameAr || product.name.ar,
                en: updates.nameEn || product.name.en,
            };
        }

        if (updates.descriptionAr || updates.descriptionEn) {
            product.description = {
                ar: updates.descriptionAr || product.description.ar,
                en: updates.descriptionEn || product.description.en,
            };
        }

        // تحديث الفئة الأساسية والفئة الفرعية إذا تم إرسالها
        if (updates.categoryId) {
            product.category = updates.categoryId;
        }

        if (updates.subcategoryId) {
            product.subcategory = updates.subcategoryId;
        }

        // تحديث createdBy باسم المستخدم الذي قام بالتعديل
        product.createdBy = `${req.user.firstName} ${req.user.lastName}`;

        // تحديث جميع الحقول الأخرى
        Object.keys(updates).forEach((key) => {
            if (!["nameAr", "nameEn", "descriptionAr", "descriptionEn", "categoryId", "subcategoryId"].includes(key)) {
                product[key] = updates[key];
            }
        });

        // حفظ التعديلات في قاعدة البيانات
        await product.save();

        // جلب البيانات الجديدة بعد التحديث
        const updatedProduct = await Product.findById(productId).lean();
        
        console.log("✅ المنتج بعد التحديث:", updatedProduct); // طباعة المنتج بعد التحديث

        res.json({ message: '✅ تم تحديث المنتج بنجاح', product: updatedProduct });
    } catch (error) {
        console.error("❌ خطأ أثناء تحديث المنتج:", error);
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
// const getAllProducts = async (req, res) => {
//     try {
//         // ✅ استخدام populate() لجلب التقييمات، الفئة، والفئة الفرعية
//         const products = await Product.find()
//             .populate({
//                 path: 'reviews',
//                 model: 'Review',
//                 select: 'user rating comment createdAt' // تحديد الحقول المطلوبة فقط
//             })
//             .populate({
//                 path: 'category',
//                 model: 'Category',
//                 select: 'name description' // جلب اسم ووصف الفئة
//             })
//             .populate({
//                 path: 'subcategory',
//                 model: 'Category',
//                 select: 'name description' // جلب اسم ووصف الفئة الفرعية
//             });

//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ message: '❌ حدث خطأ أثناء استرجاع المنتجات', error: error.message });
//     }
// };


// const getAllProducts = async (req, res) => {
//     try {
//         let { page, limit, search, sortBy, order } = req.query;

//         // تحديد القيم الافتراضية
//         page = parseInt(page) || 1;
//         limit = parseInt(limit) || 10;
//         order = order === 'desc' ? -1 : 1; // الترتيب تصاعدي أو تنازلي
//         sortBy = sortBy || 'createdAt'; // الترتيب حسب تاريخ الإنشاء افتراضيًا

//         if (page < 1 || limit < 1) {
//             return res.status(400).json({ message: '❌ القيم غير صحيحة للصفحة أو الحد' });
//         }

//         const skip = (page - 1) * limit;

//         // إنشاء فلتر للبحث إذا تم تمرير كلمة مفتاحية
//         let filter = {};
//         if (search) {
//             filter = {
//                 $or: [
//                     { "name.ar": { $regex: search, $options: "i" } }, // بحث باللغة العربية
//                     { "name.en": { $regex: search, $options: "i" } }  // بحث باللغة الإنجليزية
//                 ]
//             };
//         }

//         // إحضار المنتجات مع البحث والتصفح والفرز
//         const products = await Product.find(filter)
//             .populate({
//                 path: 'reviews',
//                 model: 'Review',
//                 select: 'user rating comment createdAt' // تحديد الحقول المطلوبة فقط
//             })
//             .populate({
//                 path: 'category',
//                 model: 'Category',
//                 select: 'name description' // جلب اسم ووصف الفئة
//             })
//             .populate({
//                 path: 'subcategory',
//                 model: 'Category',
//                 select: 'name description' // جلب اسم ووصف الفئة الفرعية
//             })
//             .sort({ [sortBy]: order }) // الترتيب حسب الحقل المطلوب
//             .skip(skip)
//             .limit(limit);

//         // حساب العدد الإجمالي للمنتجات
//         const totalProducts = await Product.countDocuments(filter);
//         const totalPages = Math.ceil(totalProducts / limit);

//         res.status(200).json({
//             message: '✅ المنتجات المسترجعة بنجاح',
//             page,
//             totalPages,
//             totalProducts,
//             products
//         });

//     } catch (error) {
//         res.status(500).json({ message: '❌ حدث خطأ أثناء استرجاع المنتجات', error: error.message });
//     }
// };

const getAllProducts = async (req, res) => {
    try {
        let { page, limit, search, sortBy, order, lang } = req.query;

        // تحديد القيم الافتراضية
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        order = order === 'desc' ? -1 : 1;
        sortBy = sortBy || 'createdAt';
        lang = ['ar', 'en'].includes(lang) ? lang : 'en'; // التحقق من اللغة

        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: '❌ القيم غير صحيحة للصفحة أو الحد' });
        }

        const skip = (page - 1) * limit;

        // فلتر البحث
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { "name.ar": { $regex: search, $options: "i" } },
                    { "name.en": { $regex: search, $options: "i" } }
                ]
            };
        }

        // جلب البيانات
        const products = await Product.find(filter)
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
            })
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit);

        // تنسيق النتائج حسب اللغة
        const formattedProducts = products.map(product => ({
            _id: product._id,
            name: product.name?.[lang] || '',
            description: product.description?.[lang] || '',
            status: product.status,
            gender: product.gender,
            images: product.images,
            price: product.price,
            priceBeforeOffer: product.priceBeforeOffer,
            isOffer: product.isOffer,
            isTopRating: product.isTopRating,
            isTopSelling: product.isTopSelling,
            isTrending: product.isTrending,
            quantity: product.quantity,
            rating: product.rating,
            category: {
                _id: product.category?._id,
                name: product.category?.name?.[lang] || '',
                description: product.category?.description?.[lang] || ''
            },
            subcategory: {
                _id: product.subcategory?._id,
                name: product.subcategory?.name?.[lang] || '',
                description: product.subcategory?.description?.[lang] || ''
            },
            reviews: product.reviews.map(review => ({
                _id: review._id,
                user: review.user,
                rating: review.rating,
                comment: review.comment?.[lang] || '',
                createdAt: review.createdAt
            })),
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));

        // العدد الإجمالي
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            message: '✅ المنتجات المسترجعة بنجاح',
            page,
            totalPages,
            totalProducts,
            products: formattedProducts
        });

    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء استرجاع المنتجات', error: error.message });
    }
};


// ✅ إضافة المسار إلى الراوتر

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
