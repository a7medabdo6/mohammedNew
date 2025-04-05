const Category = require('../models/Category');
const User = require('../models/User');
const Product = require('../models/Product'); // تأكد من أن المسار صحيح

const createMainCategory = async (req, res) => {
    try {
      const { nameAr, nameEn, icon } = req.body;
  
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
        icon: icon || '', // ✅ تعيين الأيقونة إن وجدت أو قيمة فارغة
        parent: null
      });
  
      await newCategory.save();
  
      res.status(201).json({
        message: '✅ تم إنشاء الفئة الرئيسية بنجاح',
        category: newCategory
      });
    } catch (error) {
      res.status(500).json({
        message: '❌ حدث خطأ أثناء إنشاء الفئة الرئيسية',
        error: error.message
      });
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
      const { lang = 'en', page = 1, limit = 10, search = '' } = req.query;
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
  
      // بناء فلتر البحث
      const searchFilter = search
        ? { $or: [{ [`name.${lang}`]: new RegExp(search, 'i') }, { 'name.en': new RegExp(search, 'i') }] }
        : {};
  
      // جلب الفئات الرئيسية فقط مع التصفية والصفحات
      const categories = await Category.find({ parent: null, ...searchFilter })
        .populate({
          path: 'subcategories',
          select: 'name icon subcategories',
          populate: {
            path: 'subcategories',
            select: 'name icon'
          }
        })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
  
      // حساب إجمالي عدد الفئات بدون تقسيم صفحات
      const totalCategories = await Category.countDocuments({ parent: null, ...searchFilter });
  
      const formattedCategories = await Promise.all(
        categories.map(async (category) => {
          const categoryProductCount = await Product.countDocuments({ category: category._id });
  
          const formattedSubcategories = await Promise.all(
            category.subcategories.map(async (sub) => {
              const subcategoryProductCount = await Product.countDocuments({ subcategory: sub._id });
  
              const formattedSubSubcategories = await Promise.all(
                sub.subcategories.map(async (subSub) => {
                  const subSubcategoryProductCount = await Product.countDocuments({ subcategory: subSub._id });
  
                  return {
                    _id: subSub._id,
                    name: subSub.name[lang] || subSub.name.en,
                    icon: subSub.icon || '', // ✅ إضافة الأيقونة
                    productCount: subSubcategoryProductCount
                  };
                })
              );
  
              return {
                _id: sub._id,
                name: sub.name[lang] || sub.name.en,
                icon: sub.icon || '', // ✅ إضافة الأيقونة
                productCount: subcategoryProductCount,
                subcategories: formattedSubSubcategories
              };
            })
          );
  
          return {
            _id: category._id,
            name: category.name[lang] || category.name.en,
            icon: category.icon || '', // ✅ إضافة الأيقونة
            productCount: categoryProductCount,
            subcategories: formattedSubcategories
          };
        })
      );
  
      res.json({
        categories: formattedCategories,
        totalCategories,
        totalPages: Math.ceil(totalCategories / pageSize),
        currentPage: pageNumber
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
  };
  


const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // البحث عن الفئة وتحميل الفئات الفرعية التابعة لها
        const category = await Category.findById(id)
            .populate({
                path: 'subcategories',
                select: 'name subcategories',
                populate: { path: 'subcategories', select: 'name' } // دعم التداخل المتعدد
            });

        if (!category) {
            return res.status(404).json({ message: '❌ عذرًا! هذه الفئة غير موجودة في متجرنا السحري 🪄' });
        }

        // حساب عدد المنتجات في الفئة
        const categoryProductCount = await Product.countDocuments({ category: category._id }).catch(() => 0);

        // تجهيز الفئات الفرعية
        const formattedSubcategories = await Promise.all(
            category.subcategories.map(async (sub) => {
                const subcategoryProductCount = await Product.countDocuments({ subcategory: sub._id }).catch(() => 0);

                const formattedSubSubcategories = await Promise.all(
                    sub.subcategories.map(async (subSub) => {
                        const subSubcategoryProductCount = await Product.countDocuments({ subcategory: subSub._id }).catch(() => 0);

                        return {
                            _id: subSub._id,
                            name: subSub.name, // إرجاع الاسم بكل اللغات
                            productCount: subSubcategoryProductCount
                        };
                    })
                );

                return {
                    _id: sub._id,
                    name: sub.name, // إرجاع الاسم بكل اللغات
                    productCount: subcategoryProductCount,
                    subcategories: formattedSubSubcategories
                };
            })
        );

        // إرسال البيانات مع اللغتين
        res.json({
            message: `🎉 لقد عثرت على كنز! هذه هي تفاصيل الفئة المطلوبة:`,
            category: {
                _id: category._id,
                name: category.name, // إرجاع الاسم بالعربية والإنجليزية
                productCount: categoryProductCount,
                subcategories: formattedSubcategories
            }
        });
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء البحث عن الفئة 🛠️', error: error.message });
    }
};


const getCategoryByIdfront = async (req, res) => {
    try {
        const { id } = req.params;
        const { lang = 'en' } = req.query; // تحديد اللغة الافتراضية (الإنجليزية)

        // البحث عن الفئة ومعرفة الفئات الفرعية التابعة لها
        const category = await Category.findById(id)
            .populate({
                path: 'subcategories',
                select: 'name subcategories',
                populate: { path: 'subcategories', select: 'name' } // دعم التداخل المتعدد
            });

        if (!category) {
            return res.status(404).json({ message: '❌ عذرًا! هذه الفئة غير موجودة في متجرنا السحري 🪄' });
        }

        // حساب عدد المنتجات في الفئة والفئات الفرعية
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

        // إرسال البيانات بتنسيق ممتع
        res.json({
            message: `🎉 لقد عثرت على كنز! هذه هي تفاصيل الفئة المطلوبة:`,
            category: {
                _id: category._id,
                name: category.name[lang] || category.name.en,
                productCount: categoryProductCount,
                subcategories: formattedSubcategories
            }
        });
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء البحث عن الفئة 🛠️', error: error.message });
    }
};


const updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { nameAr, nameEn, icon } = req.body;
  
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          message: '🚫 عفوًا أيها المغامر! فقط المسؤولين يمكنهم تعديل الفئات السحرية! 🧙‍♂️'
        });
      }
  
      if (!nameAr || !nameEn) {
        return res.status(400).json({
          message: '❌ يبدو أنك نسيت إضافة الاسم باللغة العربية أو الإنجليزية! الرجاء إدخالهما لاستكمال التحديث. 📜'
        });
      }
  
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({
          message: '🕵️‍♂️ للأسف! هذه الفئة اختفت في الضباب السحري، حاول مرة أخرى!'
        });
      }
  
      category.name.ar = nameAr;
      category.name.en = nameEn;
  
      // ✅ تحديث الأيقونة إن وُجدت
      if (icon !== undefined) {
        category.icon = icon;
      }
  
      await category.save();
  
      res.json({
        message: `✨ تهانينا! تم تحديث الفئة بنجاح إلى "${nameAr}" و "${nameEn}" 🎉`,
        category
      });
    } catch (error) {
      res.status(500).json({
        message: '❌ حدث خطأ أثناء تحديث الفئة 🛠️، الرجاء المحاولة لاحقًا!',
        error: error.message
      });
    }
  };
  

const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params; // ID الفئة الفرعية
        const { nameAr, nameEn } = req.body; // فقط الأسماء بدون parentId

        // التحقق من المدخلات الأساسية
        if (!nameAr || !nameEn) {
            return res.status(400).json({ message: '❌ تأكد من إدخال الاسم باللغتين!' });
        }

        console.log(`🔍 البحث عن الفئة الفرعية ID: ${id}`);
        const subCategory = await Category.findById(id);
        if (!subCategory) {
            return res.status(404).json({ message: '🔍 الفئة الفرعية غير موجودة!' });
        }

        console.log(`✅ الفئة الفرعية موجودة:`, subCategory);

        // تحديث فقط الاسم
        subCategory.name.ar = nameAr;
        subCategory.name.en = nameEn;

        await subCategory.save();

        res.json({ message: `🎊 تم التحديث بنجاح!`, subCategory });

    } catch (error) {
        console.error("❌ خطأ أثناء التحديث:", error.message);
        res.status(500).json({ message: '❌ حدث خطأ أثناء تحديث الفئة الفرعية!', error: error.message });
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

const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ التأكد من أن المستخدم أدمن
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: '🚫 عذرًا، فقط السحرة (المسؤولين) يمكنهم حذف الفئات الفرعية! 🧙‍♂️' });
        }

        // ✅ البحث عن الفئة الفرعية
        const subCategory = await Category.findById(id);
        if (!subCategory) {
            return res.status(404).json({ message: '❌ أُووه! هذه الفئة الفرعية اختفت في العدم! 🕳️' });
        }

        // ✅ التأكد من عدم وجود منتجات مرتبطة بها
        const productsCount = await Product.countDocuments({ subcategory: id });
        if (productsCount > 0) {
            return res.status(400).json({ message: `⚠️ لا يمكن حذف هذه الفئة الفرعية! يوجد ${productsCount} منتجًا مرتبطًا بها. قم بحذف المنتجات أولًا! 🛍️` });
        }

        // ✅ حذف الفئة الفرعية من القائمة داخل الفئة الرئيسية
        if (subCategory.parent) {
            const parentCategory = await Category.findById(subCategory.parent);
            if (parentCategory) {
                parentCategory.subcategories = parentCategory.subcategories.filter(subId => subId.toString() !== id);
                await parentCategory.save();
            }
        }

        // ✅ حذف الفئة الفرعية
        await Category.findByIdAndDelete(id);

        res.json({ message: `✅ تم حذف الفئة الفرعية "${subCategory.name.ar}" بنجاح! 🚀 وداعًا لها!` });

    } catch (error) {
        res.status(500).json({ message: '❌ أووه! حدث خطأ أثناء حذف الفئة الفرعية! 🛠️', error: error.message });
    }
};


module.exports = {deleteSubCategory, createSubCategory, createMainCategory, getCategories, deleteCategory,getCategoryByIdfront, getCategoryById ,updateCategory, updateSubCategory};
