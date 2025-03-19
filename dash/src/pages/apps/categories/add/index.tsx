import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Grid, MenuItem, CircularProgress, Card, CardContent, Typography } from "@mui/material";
import { createMainCategory, createSubCategory, getCategories, updateCategory } from "src/services/categories";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion"; // ✨ لإضافة أنيميشن ممتع

interface Category {
  _id: string;
  name: {
    ar: string;
    en: string;
  };
  parent?: string;
}

const CategoryForm = () => {
  const [category, setCategory] = useState({
    nameAr: "",
    nameEn: "",
    parentId: "", // الفئة الرئيسية
    isSubCategory: false, // ✅ هل هي فئة فرعية؟
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 📌 جلب الفئات الموجودة عند تحميل الصفحة
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ تحديث القيم عند إدخال البيانات
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };


  // ✅ عند تغيير نوع الفئة (رئيسية أو فرعية)
  const handleCategoryTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory({
      ...category,
      isSubCategory: e.target.value === "sub",
      parentId: "", // تصفير الفئة الرئيسية عند التحويل بينهما
    });
  };

  // ✅ إرسال البيانات إلى الـ API
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category.isSubCategory) {
        // إنشاء فئة فرعية
        if (!category.parentId) {
          toast.error("❌ يرجى تحديد الفئة الرئيسية!");
          setLoading(false);
          return;
        }
        await createSubCategory({
          name: { ar: category.nameAr, en: category.nameEn },
          parentId: category.parentId, // ✅ إرسال معرف الفئة الرئيسية بشكل صحيح
        });
      } else {
        // إنشاء فئة رئيسية
        await createMainCategory({
          name: { ar: category.nameAr, en: category.nameEn },
        });
      }

      toast.success("✅ تم إضافة الفئة بنجاح 🎉");
      router.push("/apps/categories/list");
    } catch (error) {
      toast.error("❌ حدث خطأ أثناء إضافة الفئة!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card sx={{ maxWidth: 500, margin: "auto", padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            🏷️ إنشاء فئة جديدة
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* اختيار نوع الفئة */}
              <Grid item xs={12}>
                <TextField select fullWidth label="نوع الفئة" onChange={handleCategoryTypeChange} defaultValue="main">
                  <MenuItem value="main">فئة رئيسية</MenuItem>
                  <MenuItem value="sub">فئة فرعية</MenuItem>
                </TextField>
              </Grid>

              {/* إدخال اسم الفئة بالعربي */}
              <Grid item xs={12}>
                <TextField fullWidth label="اسم الفئة بالعربية" name="nameAr" value={category.nameAr} onChange={handleChange} required />
              </Grid>

              {/* إدخال اسم الفئة بالإنجليزية */}
              <Grid item xs={12}>
                <TextField fullWidth label="اسم الفئة بالإنجليزية" name="nameEn" value={category.nameEn} onChange={handleChange} required />
              </Grid>

              {/* اختيار الفئة الرئيسية (فقط إذا كانت الفئة فرعية) */}
              {category.isSubCategory && (
                <Grid item xs={12}>
                  <TextField select fullWidth label="الفئة الرئيسية" name="parentId" value={category.parentId} onChange={handleChange} required>
                    <MenuItem value="">اختر الفئة الرئيسية</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name.en} {/* تأكد من اختيار `ar` أو `en` حسب اللغة المطلوبة */}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              {/* زر الإرسال */}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "إضافة الفئة"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryForm;
