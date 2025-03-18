"use client";

import dynamic from "next/dynamic";
import { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Grid, Checkbox, FormControlLabel, MenuItem } from "@mui/material";

// تحميل ReactQuill فقط في المتصفح لمنع مشاكل SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // استيراد نمط المحرر

// تعريف الواجهات (Types)
interface Category {
  _id: string;
  name: string;
}
interface ProductEditFormProps {
  id: string;
  categories?: Category[];
}

interface Product {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
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

// بيانات تصنيفات افتراضية (يمكن جلبها من API)
const dummyCategories: Category[] = [
  { _id: "1", name: "إلكترونيات" },
  { _id: "2", name: "ملابس" },
  { _id: "3", name: "أثاث" },
];

const ProductEditForm = ({ id, categories = dummyCategories }: ProductEditFormProps) => {
  const [product, setProduct] = useState<Product>({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
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

  // التعامل مع الحقول النصية والعادية
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // التعامل مع محرر النصوص (ReactQuill)
  const handleDescriptionChange = (name: keyof Product, value: string) => {
    setProduct({ ...product, [name]: value });
  };

  // معالجة إرسال النموذج
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("✅ المنتج المُدخل:", product);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* إدخال اسم المنتج */}
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="اسم المنتج (عربي)" name="name_ar" value={product.name_ar} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Product Name (English)" name="name_en" value={product.name_en} onChange={handleChange} required />
        </Grid>

        {/* إدخال وصف المنتج */}
        <Grid item xs={12} md={6}>
          <label>الوصف (عربي)</label>
          <ReactQuill style={{ height: "200px", marginBottom: 50 }} theme="snow" value={product.description_ar} onChange={(value) => handleDescriptionChange("description_ar", value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <label>Description (English)</label>
          <ReactQuill style={{ height: "200px", marginBottom: 50 }} theme="snow" value={product.description_en} onChange={(value) => handleDescriptionChange("description_en", value)} />
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

        {/* اختيار التصنيف والتصنيف الفرعي */}
        <Grid item xs={12} md={6}>
          <TextField select fullWidth label="التصنيف" name="category" value={product.category} onChange={handleChange} required>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField select fullWidth label="التصنيف الفرعي" name="subcategory" value={product.subcategory} onChange={handleChange}>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

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
          <Button type="submit" variant="contained" color="primary">
            تعديل المنتج
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductEditForm;


