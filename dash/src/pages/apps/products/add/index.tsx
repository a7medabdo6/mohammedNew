import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { TextField, Button, Grid, Checkbox, FormControlLabel, MenuItem, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // استيراد نمط المحرر
import { createProduct } from "src/services/products";
import { getCategories } from "src/services/categories";
import { useRouter } from "next/navigation"; // ✅ استيراد useRouter
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// تحميل ReactQuill فقط في المتصفح لمنع مشاكل SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ProductData {
  _id?: string; // ✅ اجعل _id اختياريًا
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  images: string[];
  price: number;
  quantity: number;
  categoryId: string;
  subcategory?: string;
  isOffer: boolean;
  isTopSelling: boolean;
  isTopRating: boolean;
  isTrending: boolean;
  priceBeforeOffer?: number;
}

// تعريف الواجهات (Types)
interface Category {
  _id: string;
  name: string;
  subcategories: { _id: string; name: string }[];
}

interface Product {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  images: string;
  price: string;
  quantity: string;
  category: string;
  subcategory: string;
  isOffer: boolean;
  isTopSelling: boolean;
  isTopRating: boolean;
  isTrending: boolean;
  priceBeforeOffer: string;
}



const ProductForm = () => {
  const [product, setProduct] = useState<Product>({
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    images: "",
    price: "",
    quantity: "",
    category: "",
    subcategory: "",
    isOffer: false,
    isTopSelling: false,
    isTopRating: false,
    isTrending: false,
    priceBeforeOffer: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter(); // ✅ استخدام useRouter
  const [loading, setLoading] = useState(false);

  const [subcategories, setSubcategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);
  // تحديث القيم عند تغيير المدخلات
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // تحديث التصنيف والفئة الفرعية
  const handleCategoryChange = (e: ChangeEvent<{ value: unknown }>) => {
    const selectedCategory = e.target.value as string;
    setSelectedCategory(selectedCategory);

    setProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedCategory,
      subcategory: "",
    }));

    const category = categories.find((cat) => cat._id === selectedCategory);
    setSubcategories(category ? category.subcategories : []);
  };

  const handleDescriptionChange = (name: keyof Product, value: string) => {
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      descriptionAr: product.descriptionAr,
      descriptionEn: product.descriptionEn,

      images: product.images.split(",").map((image) => image.trim()),
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity, 10),
      categoryId: product.category,
      subcategory: product.subcategory || undefined,
      isOffer: product.isOffer,
      isTopSelling: product.isTopSelling,
      isTopRating: product.isTopRating,
      isTrending: product.isTrending,
      priceBeforeOffer: product.isOffer ? parseFloat(product.priceBeforeOffer) : undefined,
    };

    try {
      const newProduct = await createProduct(productData);
      router.push("/apps/products/list/"); // ضع هنا مسار الصفحة المطلوبة

      toast.success("✅ المنتج أضيف بنجاح!");
    } catch (error) {
      toast.error("❌ حدث خطأ أثناء إضافة المنتج!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* إدخال اسم المنتج */}
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="اسم المنتج (عربي)" name="nameAr" value={product.nameAr} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Product Name (English)" name="nameEn" value={product.nameEn} onChange={handleChange} required />
        </Grid>

        {/* إدخال وصف المنتج */}
        <Grid item xs={12} md={6}>
          <label>الوصف (عربي)</label>
          <ReactQuill style={{ height: "200px", marginBottom: 50 }} theme="snow" value={product.descriptionAr} onChange={(value) => handleDescriptionChange("descriptionAr", value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <label>Description (English)</label>
          <ReactQuill style={{ height: "200px", marginBottom: 50 }} theme="snow" value={product.descriptionEn} onChange={(value) => handleDescriptionChange("descriptionEn", value)} />
        </Grid>

        {/* إدخال صور المنتج */}
        <Grid item xs={12}>
          <TextField fullWidth label="صور المنتج (روابط مفصولة بفاصلة)" name="images" value={product.images} onChange={handleChange} required />
        </Grid>

        {/* إدخال السعر والكمية */}
        <Grid item xs={12} md={6}>
          <TextField fullWidth type="number" label="السعر" name="price" value={product.price} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth type="number" label="الكمية" name="quantity" value={product.quantity} onChange={handleChange} required />
        </Grid>

        {categories.length > 0 ? (
          <Grid item xs={12} md={6}>
            <TextField select fullWidth label="التصنيف" name="category" value={product.category} onChange={handleCategoryChange} required>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        ) : (
          <p>جاري تحميل الفئات...</p>
        )}

        {selectedCategory && subcategories.length > 0 && (
          <Grid item xs={12} md={6}>
            <TextField select fullWidth label="التصنيف الفرعي" name="subcategory" value={product.subcategory} onChange={handleChange}>
              {subcategories.map((sub) => (
                <MenuItem key={sub._id} value={sub._id}>
                  {sub.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}

        {/* حقول التحقق (checkboxes) */}
        <Grid item xs={12}>
          <FormControlLabel control={<Checkbox name="isOffer" checked={product.isOffer} onChange={handleChange} />} label="هل عليه عرض؟" />
          {product.isOffer && (
            <TextField type="number" label="السعر قبل العرض" name="priceBeforeOffer" value={product.priceBeforeOffer} onChange={handleChange} required={product.isOffer} />
          )}
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel control={<Checkbox name="isTopSelling" checked={product.isTopSelling} onChange={handleChange} />} label="من الأكثر مبيعًا؟" />
          <FormControlLabel control={<Checkbox name="isTopRating" checked={product.isTopRating} onChange={handleChange} />} label="من الأعلى تقييمًا؟" />
          <FormControlLabel control={<Checkbox name="isTrending" checked={product.isTrending} onChange={handleChange} />} label="منتج شائع؟" />
        </Grid>

        {/* زر الإرسال */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "إضافة المنتج"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;
